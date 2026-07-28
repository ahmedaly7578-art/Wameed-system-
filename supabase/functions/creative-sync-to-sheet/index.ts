// supabase/functions/creative-sync-to-sheet/index.ts
//
// Called by a Supabase Database Webhook whenever a row in `creative_tasks`
// is INSERTed or UPDATEd. Writes/updates the matching row in the Google
// Sheet so the sheet always mirrors the system.
//
// ─── Required secrets (set with `supabase secrets set`) ───────────────────
//   GOOGLE_SERVICE_ACCOUNT_JSON   -> full JSON key of a Google service account
//   CREATIVE_SHEET_ID             -> the spreadsheet ID (from its URL)
//   CREATIVE_SHEET_TAB            -> tab/sheet name, e.g. "Creative"
//   CREATIVE_SYNC_SECRET          -> any random string, also set on the
//                                    Database Webhook as a custom header
//                                    (X-Sync-Secret) so this function only
//                                    accepts calls from Supabase.
//
// The Google service account's email (client_email in the JSON key) MUST be
// added as an Editor on the Google Sheet, or writes will fail with 403.

import { createClient } from "npm:@supabase/supabase-js@2";
import { google } from "npm:googleapis@144";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SHEET_ID = Deno.env.get("CREATIVE_SHEET_ID")!;
const SHEET_TAB = Deno.env.get("CREATIVE_SHEET_TAB") ?? "Creative";
const SYNC_SECRET = Deno.env.get("CREATIVE_SYNC_SECRET")!;
const SA_JSON = JSON.parse(Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON")!);

// Column order MUST match the sheet's header row exactly (A → S).
// The last column (T) is a hidden id column used to match rows on sync.
const COLUMNS = [
  "n_o", "agency", "department", "strategy_link", "client_name",
  "website_link", "task_date", "notes", "designer_name", "forum",
  "no_of_sizes", "size", "status", "upload_folder", "upload_date",
  "dead_line", "done", "director_approved", "time_note",
];
const ID_COLUMN_INDEX = COLUMNS.length; // column T (0-based -> 19th col)

function rowValues(record: Record<string, unknown>): (string | number | boolean)[] {
  return COLUMNS.map((key) => {
    const v = record[key];
    if (v === null || v === undefined) return "";
    if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
    return v as string | number;
  });
}

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: SA_JSON,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client as any });
}

async function findRowIndexById(sheets: any, id: string): Promise<number | null> {
  const idColLetter = String.fromCharCode(65 + ID_COLUMN_INDEX); // 'T'
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!${idColLetter}2:${idColLetter}`,
  });
  const rows: string[][] = res.data.values ?? [];
  const idx = rows.findIndex((r) => r[0] === id);
  return idx === -1 ? null : idx + 2; // +2 => header row + 1-index
}

Deno.serve(async (req) => {
  try {
    if (req.headers.get("X-Sync-Secret") !== SYNC_SECRET) {
      return new Response("unauthorized", { status: 401 });
    }
    const payload = await req.json();
    // Supabase Database Webhook payload shape: { type, table, record, old_record }
    const record = payload.record;
    if (!record?.id) return new Response("no record", { status: 400 });

    const sheets = await getSheetsClient();
    const values = rowValues(record);
    const existingRow = await findRowIndexById(sheets, record.id);

    if (existingRow) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_TAB}!A${existingRow}:T${existingRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[...values, record.id]] },
      });
    } else {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_TAB}!A2:T2`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [[...values, record.id]] },
      });
    }

    // best-effort log
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    await supabase.from("creative_sync_log").insert({
      direction: "to_sheet",
      creative_task_id: record.id,
      status: "ok",
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    try {
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
      await supabase.from("creative_sync_log").insert({
        direction: "to_sheet",
        status: "error",
        detail: String(err),
      });
    } catch (_) { /* ignore */ }
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
