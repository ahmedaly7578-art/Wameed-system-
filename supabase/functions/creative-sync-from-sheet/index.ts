// supabase/functions/creative-sync-from-sheet/index.ts
//
// Called by the Google Apps Script bound to the Creative sheet (see
// google-apps-script/Code.gs) whenever a row is edited. Upserts that row
// into `creative_tasks`. If the row is brand new (no id yet), a UUID is
// generated and returned so Apps Script can write it back into the sheet's
// hidden ID column (column T) — that's how future edits to that same row
// are matched correctly.
//
// ─── Required secrets ──────────────────────────────────────────────────
//   SUPABASE_SERVICE_ROLE_KEY
//   CREATIVE_SYNC_SECRET   -> must match the secret hardcoded in Code.gs

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SYNC_SECRET = Deno.env.get("CREATIVE_SYNC_SECRET")!;

Deno.serve(async (req) => {
  try {
    if (req.headers.get("X-Sync-Secret") !== SYNC_SECRET) {
      return new Response("unauthorized", { status: 401 });
    }
    const body = await req.json();
    // Expected body shape (sent by Code.gs onEdit handler):
    // {
    //   id: string | null,       // empty string/null when the row is new
    //   n_o, agency, department, strategy_link, client_name, website_link,
    //   task_date, notes, designer_name, forum, no_of_sizes, size, status,
    //   upload_folder, upload_date, dead_line, done, director_approved,
    //   time_note
    // }
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const row = {
      agency: body.agency || null,
      department: body.department || null,
      strategy_link: body.strategy_link || null,
      client_name: body.client_name || null,
      website_link: body.website_link || null,
      task_date: body.task_date || null,
      notes: body.notes || null,
      designer_name: body.designer_name || null,
      forum: body.forum || null,
      no_of_sizes: body.no_of_sizes || null,
      size: body.size || null,
      status: body.status || "pending",
      upload_folder: body.upload_folder || null,
      upload_date: body.upload_date || null,
      dead_line: body.dead_line || null,
      done: !!body.done,
      director_approved: !!body.director_approved,
      time_note: body.time_note || null,
      n_o: body.n_o ? Number(body.n_o) : null,
    };

    let id = body.id;
    let error;

    if (id) {
      ({ error } = await supabase
        .from("creative_tasks")
        .update(row)
        .eq("id", id));
    } else {
      const { data, error: insErr } = await supabase
        .from("creative_tasks")
        .insert({ ...row, sheet_row_id: crypto.randomUUID() })
        .select("id")
        .single();
      error = insErr;
      id = data?.id;
    }

    if (error) throw error;

    await supabase.from("creative_sync_log").insert({
      direction: "from_sheet",
      creative_task_id: id,
      status: "ok",
    });

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
