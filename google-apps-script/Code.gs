/**
 * وميض — Creative Sheet ⇄ System sync (Sheet → System direction)
 *
 * HOW TO INSTALL
 * 1. Open the Google Sheet → Extensions → Apps Script.
 * 2. Delete any starter code, paste this whole file in.
 * 3. Fill in CONFIG below.
 * 4. Run `setup()` once from the editor toolbar (grants permissions and
 *    installs the onEdit trigger + the header row incl. hidden ID column).
 * 5. Done — every time someone edits a row, it's pushed to the system
 *    within ~1 second.
 *
 * Column layout this script expects on row 1 (create it via setup(), or
 * match it manually if you already have a sheet):
 *   A: N.O            B: Agency          C: Department     D: Strategy Link
 *   E: Client         F: Website Link    G: Task Date       H: Notes/Data
 *   I: Designer       J: Forum           K: No of Sizes     L: Size
 *   M: Status         N: Upload Folder   O: Upload Date     P: Dead Line
 *   Q: Done           R: Director        S: Time
 *   T: (hidden) System ID — do not edit manually.
 */

const CONFIG = {
  SHEET_NAME: "Creative",
  // Supabase Edge Function URL, e.g.
  // https://YOUR-PROJECT-REF.functions.supabase.co/creative-sync-from-sheet
  ENDPOINT: "https://YOUR-PROJECT-REF.functions.supabase.co/creative-sync-from-sheet",
  // Must match the CREATIVE_SYNC_SECRET secret set on the edge function.
  SECRET: "REPLACE_WITH_A_LONG_RANDOM_STRING",
};

const HEADERS = [
  "N.O", "Agency", "Department", "Strategy Link", "Client", "Website Link",
  "Task Date", "Notes/Data", "Designer", "Forum", "No of Sizes", "Size",
  "Status", "Upload Folder", "Upload Date", "Dead Line", "Done", "Director",
  "Time", "System ID",
];

function setup() {
  const sheet = getSheet();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.hideColumns(HEADERS.length); // hide the System ID column (T)

  // (Re)install the onEdit trigger tied to this function.
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === "onCreativeEdit")
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("onCreativeEdit")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();

  SpreadsheetApp.getUi().alert("Setup complete — edits will now sync to وميض.");
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
}

/**
 * Installable trigger — fires on any edit to the bound spreadsheet.
 */
function onCreativeEdit(e) {
  try {
    const sheet = e.range.getSheet();
    if (sheet.getName() !== CONFIG.SHEET_NAME) return;
    const row = e.range.getRow();
    if (row === 1) return; // header row

    const lastCol = HEADERS.length;
    const values = sheet.getRange(row, 1, 1, lastCol).getValues()[0];

    // Skip completely empty rows (e.g. accidental click).
    if (values.slice(0, lastCol - 1).every((v) => v === "" || v === null)) return;

    const payload = {
      id: values[19] || null, // column T
      n_o: values[0],
      agency: values[1],
      department: values[2],
      strategy_link: values[3],
      client_name: values[4],
      website_link: values[5],
      task_date: formatDate(values[6]),
      notes: values[7],
      designer_name: values[8],
      forum: values[9],
      no_of_sizes: values[10],
      size: values[11],
      status: values[12],
      upload_folder: values[13],
      upload_date: formatDate(values[14]),
      dead_line: formatDate(values[15]),
      done: values[16] === true || values[16] === "TRUE",
      director_approved: values[17] === true || values[17] === "TRUE",
      time_note: values[18],
    };

    const res = UrlFetchApp.fetch(CONFIG.ENDPOINT, {
      method: "post",
      contentType: "application/json",
      headers: { "X-Sync-Secret": CONFIG.SECRET },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });

    const body = JSON.parse(res.getContentText());
    if (body.ok && body.id && !payload.id) {
      // brand-new row — stamp the generated system ID back into column T
      sheet.getRange(row, 20).setValue(body.id);
    }
    if (!body.ok) {
      console.error("Sync failed: " + res.getContentText());
    }
  } catch (err) {
    console.error("onCreativeEdit error: " + err);
  }
}

function formatDate(v) {
  if (!v) return null;
  if (Object.prototype.toString.call(v) === "[object Date]") {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(v);
}
