/*
  Spelling Practice → Google Sheet reports

  Paste this whole file into a Google Sheet's Extensions → Apps Script,
  then deploy it as a web app. Full steps are in google-sheet/SETUP.md.

  The sheet gets five tabs:
    Pupils     — one line per pupil: lists done, words right, last practised
    Struggles  — for each pupil, the sounds they miss most often
    Sessions   — one line every time a pupil finishes (or stops) a list
    Words      — every word attempted, with each wrong spelling
    Sounds     — every sound missed on a first try (feeds "Struggles")
*/

// Optional: a password the website must send. If you set one here,
// put the same text in reportKey in words.js.
const KEY = "";

const TABS = {
  Sessions: ["When", "Pupil", "List", "Words", "Right", "Right first time", "Sounds missed", "Finished"],
  Words: ["When", "Pupil", "List", "Word", "Sounds", "Result", "Wrong tries", "Sounds missed"],
  Sounds: ["When", "Pupil", "List", "Sound", "Word"]
};

const REPORTS = {
  Pupils: "=QUERY(Sessions!A:H, \"select B, count(C), sum(D), sum(E), sum(F), max(A) where B is not null " +
    "group by B order by B label B 'Pupil', count(C) 'Lists done', sum(D) 'Words tried', sum(E) 'Words right', " +
    "sum(F) 'Right first time', max(A) 'Last practised' format max(A) 'd mmm yyyy'\", 1)",
  Struggles: "=QUERY(Sounds!A:E, \"select B, D, count(E), max(A) where B is not null group by B, D " +
    "order by B, count(E) desc label B 'Pupil', D 'Sound', count(E) 'Times missed', max(A) 'Last missed' " +
    "format max(A) 'd mmm yyyy'\", 1)"
};

// Visiting the web app address in a browser shows this, so you can check it's working
function doGet() {
  return json_({ ok: true, message: "Spelling reports are working." });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: "Not valid data" });
  }
  if (KEY && data.key !== KEY) return json_({ ok: false, error: "Wrong key" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // several pupils finishing at once take turns
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setup_(ss);

    const when = new Date();
    const pupil = clean_(data.pupil) || "(no name)";
    const list = clean_(data.list);
    const words = Array.isArray(data.words) ? data.words.slice(0, 60) : [];

    const right = words.filter(w => w.correct).length;
    const firstGo = words.filter(w => w.correct && w.triesUsed === 1).length;
    const missedCount = {};
    words.forEach(w => (w.missed || []).forEach(s => { missedCount[s] = (missedCount[s] || 0) + 1; }));
    const missedText = Object.keys(missedCount)
      .sort((a, b) => missedCount[b] - missedCount[a])
      .map(s => clean_(s) + (missedCount[s] > 1 ? " ×" + missedCount[s] : ""))
      .join(", ");

    ss.getSheetByName("Sessions").appendRow([when, pupil, list, words.length, right, firstGo, missedText,
      data.finished ? "Yes" : "Stopped early"]);

    addRows_(ss.getSheetByName("Words"), words.map(w => [
      when, pupil, list, clean_(w.word), clean_(w.sounds),
      w.correct ? (w.triesUsed === 1 ? "Right first time" : "Right on try " + w.triesUsed) : "Missed",
      (w.wrong || []).map(clean_).join(", "),
      (w.missed || []).map(clean_).join(", ")
    ]));

    const soundRows = [];
    words.forEach(w => (w.missed || []).forEach(s => soundRows.push([when, pupil, list, clean_(s), clean_(w.word)])));
    addRows_(ss.getSheetByName("Sounds"), soundRows);

    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Creates any missing tabs. Run it once from the editor to see the layout before pupils use it.
function setup() {
  setup_(SpreadsheetApp.getActiveSpreadsheet());
}

function setup_(ss) {
  Object.keys(REPORTS).forEach((name, i) => {
    if (ss.getSheetByName(name)) return;
    const sheet = ss.insertSheet(name, i);
    sheet.getRange("A1").setFormula(REPORTS[name]);
    sheet.setFrozenRows(1);
    sheet.getRange("1:1").setFontWeight("bold");
  });
  Object.keys(TABS).forEach(name => {
    if (ss.getSheetByName(name)) return;
    const sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, TABS[name].length).setValues([TABS[name]]).setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("d mmm yyyy, h:mm");
  });
  // Tidy away the empty tab a new spreadsheet starts with
  const blank = ss.getSheetByName("Sheet1");
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
}

function addRows_(sheet, rows) {
  if (!rows.length) return;
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

// Short plain text only, and never a formula (a name starting with = would otherwise run as one)
function clean_(value) {
  const text = String(value == null ? "" : value).replace(/[\r\n\t]+/g, " ").trim().slice(0, 100);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
