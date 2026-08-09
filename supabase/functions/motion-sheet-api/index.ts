// supabase/functions/motion-sheet-api/index.ts
//
// Same pattern as creative-sheet-api: the Google Sheet ("Motion" tab) IS the
// database for this module. No Postgres table involved.
//
//   GET    -> list all motion tasks (reads the sheet)
//   POST   -> create a new task (appends a row)
//   PUT    -> update an existing task (updates its row, matched by id)
//   DELETE -> remove a task (clears its row)
//
// ─── Required secrets (set with `supabase secrets set`) ───────────────────
//   GOOGLE_SERVICE_ACCOUNT_JSON  -> reuse the SAME service account already
//                                   used for creative-sheet-api. Just make
//                                   sure its client_email is also shared as
//                                   Editor on the Motion sheet.
//   MOTION_SHEET_ID              -> the Motion spreadsheet ID (from its URL)
//   MOTION_SHEET_TAB             -> tab name, e.g. "Motion"
//   MOTION_API_SECRET            -> any random string; the frontend sends it
//                                   back as ?secret=... or X-App-Secret.
//
// The Google service account's email (client_email in the JSON key) MUST be
// shared as an Editor on the Motion Google Sheet, or reads/writes fail.

import { google } from "npm:googleapis@144";

const SHEET_ID = Deno.env.get("MOTION_SHEET_ID")!;
const SHEET_TAB = Deno.env.get("MOTION_SHEET_TAB") ?? "Motion";
const SA_JSON = JSON.parse(Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON")!);
const API_SECRET = Deno.env.get("MOTION_API_SECRET")!;

// Sheet column order, A -> R (matches the real "Motion" sheet header row
// exactly: Task Owner, Agency, Department, Strategy Link, Client,
// Website Link, Task Date, Notes// Data, Dead Line, N.O, Member, Forum,
// Size, Status, Upload Folder, Done, Director, Time).
// Column S (index 18) is the hidden system id used to match rows on sync.
const FIELDS = [
  "taskOwner", "agency", "department", "strategyLink", "clientName",
  "websiteLink", "taskDate", "notes", "deadLine", "nO", "member", "forum",
  "size", "status", "uploadFolder", "done", "director", "time",
];
const ID_COL = FIELDS.length; // 18 -> column S

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
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

// Finds the real tab title regardless of stray spaces/case differences
// between the SHEET_TAB secret and the actual tab name in the sheet — and
// if it truly doesn't exist, the error lists every tab that DOES exist so
// it's obvious what to fix, instead of a vague "unable to parse range".
async function resolveTabName(sheets: any): Promise<string> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const tabs: string[] = (meta.data.sheets ?? []).map((s: any) => s.properties?.title ?? "");
  const target = SHEET_TAB.trim().toLowerCase();
  const match = tabs.find((t) => t.trim().toLowerCase() === target);
  if (!match) {
    throw new Error(`Sheet tab "${SHEET_TAB}" not found. Tabs that DO exist in this sheet: ${tabs.map(t => `"${t}"`).join(", ") || "(none)"}`);
  }
  return match;
}

function rowToTask(values: any[], rowNumber: number) {
  const id = values[ID_COL];
  if (!id) return null;
  const task: Record<string, any> = { id, _row: rowNumber };
  FIELDS.forEach((f, i) => {
    let v = values[i] ?? "";
    if (f === "done" || f === "director") v = v === true || v === "TRUE";
    task[f] = v;
  });
  return task;
}

function taskToRow(body: Record<string, any>) {
  return FIELDS.map((f) => {
    const v = body[f];
    if (v === null || v === undefined) return "";
    if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
    return v;
  });
}

async function findRow(sheets: any, tab: string, id: string): Promise<number | null> {
  const idColLetter = String.fromCharCode(65 + ID_COL); // 'S'
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `'${tab}'!${idColLetter}2:${idColLetter}`,
  });
  const rows: string[][] = res.data.values ?? [];
  const idx = rows.findIndex((r) => r[0] === id);
  return idx === -1 ? null : idx + 2;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const reqUrl = new URL(req.url);
  const incomingSecret = reqUrl.searchParams.get("secret") ?? req.headers.get("x-app-secret") ?? "";
  if (incomingSecret !== API_SECRET) {
    return json({ error: "unauthorized" }, 401);
  }

  // Diagnostic marker — visit ?secret=...&ping=1 to confirm this exact code
  // version is the one actually deployed, with zero Google Sheets calls.
  if (reqUrl.searchParams.get("ping")) {
    return json({ ok: true, version: "v2-resolveTabName", sheetTabEnv: SHEET_TAB });
  }

  try {
    const sheets = await getSheetsClient();
    const TAB = await resolveTabName(sheets);

    if (req.method === "GET") {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `'${TAB}'!A2:S`,
      });
      const rows: any[][] = res.data.values ?? [];
      const tasks = rows
        .map((r, i) => rowToTask(r, i + 2))
        .filter((t) => t !== null);
      return json({ tasks });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const id = crypto.randomUUID();
      const values = taskToRow(body);
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `'${TAB}'!A2:S2`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [[...values, id]] },
      });
      return json({ id });
    }

    if (req.method === "PUT") {
      const body = await req.json();
      if (!body.id) return json({ error: "missing id" }, 400);
      const rowNum = await findRow(sheets, TAB, body.id);
      if (!rowNum) return json({ error: "not found" }, 404);
      const values = taskToRow(body);
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `'${TAB}'!A${rowNum}:S${rowNum}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[...values, body.id]] },
      });
      return json({ ok: true });
    }

    if (req.method === "DELETE") {
      const body = await req.json();
      if (!body.id) return json({ error: "missing id" }, 400);
      const rowNum = await findRow(sheets, TAB, body.id);
      if (rowNum) {
        await sheets.spreadsheets.values.clear({
          spreadsheetId: SHEET_ID,
          range: `'${TAB}'!A${rowNum}:S${rowNum}`,
        });
      }
      return json({ ok: true });
    }

    return json({ error: "method not allowed" }, 405);
  } catch (err) {
    console.error(err);
    return json({ error: String(err) }, 500);
  }
});
