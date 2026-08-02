// supabase/functions/creative-sheet-api/index.ts
//
// The Google Sheet IS the database for the Creative module. This single
// function reads/writes the sheet directly — no Postgres table involved.
//
//   GET    -> list all creative tasks (reads the sheet)
//   POST   -> create a new task (appends a row)
//   PUT    -> update an existing task (updates its row, matched by id)
//   DELETE -> remove a task (clears its row)
//
// ─── Required secrets ──────────────────────────────────────────────────
//   GOOGLE_SERVICE_ACCOUNT_JSON  -> full JSON key of a Google service account
//   CREATIVE_SHEET_ID            -> the spreadsheet ID (from its URL)
//   CREATIVE_SHEET_TAB           -> tab name, e.g. "Creative"
//   CREATIVE_API_SECRET          -> any random string; the frontend sends
//                                   it back as X-App-Secret on every call.
//
// The Google service account's email (client_email in the JSON key) MUST be
// shared as an Editor on the Google Sheet, or writes/reads will fail.

import { google } from "npm:googleapis@144";

const SHEET_ID = Deno.env.get("CREATIVE_SHEET_ID")!;
const SHEET_TAB = Deno.env.get("CREATIVE_SHEET_TAB") ?? "Creative";
const SA_JSON = JSON.parse(Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON")!);
const API_SECRET = Deno.env.get("CREATIVE_API_SECRET")!;

// Sheet column order, A -> S. Column T (index 19) is the hidden system id.
const FIELDS = [
  "nO","agency","department","strategyLink","clientName","websiteLink",
  "taskDate","notes","designerName","forum","noOfSizes","size","status",
  "uploadFolder","uploadDate","deadLine","done","directorApproved","timeNote",
];
const ID_COL = FIELDS.length; // 19 -> column T

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

function rowToTask(values: any[], rowNumber: number) {
  const id = values[ID_COL];
  if (!id) return null;
  const task: Record<string, any> = { id, _row: rowNumber };
  FIELDS.forEach((f, i) => {
    let v = values[i] ?? "";
    if (f === "done" || f === "directorApproved") v = v === true || v === "TRUE";
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

async function findRow(sheets: any, id: string): Promise<number | null> {
  const idColLetter = String.fromCharCode(65 + ID_COL); // 'T'
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!${idColLetter}2:${idColLetter}`,
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

  try {
    const sheets = await getSheetsClient();

    if (req.method === "GET") {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_TAB}!A2:T`,
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
        range: `${SHEET_TAB}!A2:T2`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [[...values, id]] },
      });
      return json({ id });
    }

    if (req.method === "PUT") {
      const body = await req.json();
      if (!body.id) return json({ error: "missing id" }, 400);
      const rowNum = await findRow(sheets, body.id);
      if (!rowNum) return json({ error: "not found" }, 404);
      const values = taskToRow(body);
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_TAB}!A${rowNum}:T${rowNum}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[...values, body.id]] },
      });
      return json({ ok: true });
    }

    if (req.method === "DELETE") {
      const body = await req.json();
      if (!body.id) return json({ error: "missing id" }, 400);
      const rowNum = await findRow(sheets, body.id);
      if (rowNum) {
        await sheets.spreadsheets.values.clear({
          spreadsheetId: SHEET_ID,
          range: `${SHEET_TAB}!A${rowNum}:T${rowNum}`,
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
