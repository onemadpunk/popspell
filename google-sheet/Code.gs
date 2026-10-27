/*
  PopSpell → Google Sheet: pupil reports and the private teacher dashboard

  Paste this file into a Google Sheet's Extensions → Apps Script, add the
  Dashboard.html file beside it, then deploy as a web app.
  Full steps are in google-sheet/SETUP.md.

  The sheet gets these tabs:
    Pupils       — one line per pupil: lists done, words right, last practised
    Struggles    — for each pupil, the sounds they miss most often
    Assignments  — which lists each pupil should do (set from the dashboard)
    Sessions     — one line every time a pupil finishes (or stops) a list
    Words        — every word attempted, with each wrong spelling
    Sounds       — every sound missed on a first try (feeds "Struggles")

  The dashboard opens from the Spelling menu in the sheet, or at the web app
  address with ?page=teacher. Only the sheet's owner (and editors, from the
  menu) can see it — Google's own sign-in protects it.
*/

// Optional: a password the website must send. If you set one here,
// put the same text in reportKey in words.js.
const KEY = "";

// The website's address, so the dashboard can list its spelling lists
const SITE_URL = "https://onemadpunk.github.io/popspell/";

const TABS = {
  Assignments: ["Who", "Lists", "Updated"],
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

const LIVE_HOURS = 6; // how long a pupil stays on the live board after their last activity

/* ---------- Web app: what pupils' devices and the teacher's browser ask for ---------- */

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === "assignments") return assignmentsJsonp_(p);
  if (p.page === "teacher") {
    if (!isTeacher_()) {
      return HtmlService.createHtmlOutput("<p style='font:18px sans-serif;padding:2em'>This page is only for the teacher. " +
        "Open it while signed in to the Google account that owns the spreadsheet, or use the Spelling menu in the sheet.</p>");
    }
    return HtmlService.createHtmlOutputFromFile("Dashboard").setTitle("PopSpell — class dashboard");
  }
  // Visiting the plain address shows this, so you can check it's working
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
  if (data.type === "live" || data.type === "help") {
    updateLive_(data);
    return json_({ ok: true });
  }
  return saveReport_(data);
}

/* ---------- Reports (one per finished or stopped list) ---------- */

function saveReport_(data) {
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
      (w.challenge ? "New word: " : "") +
        (w.correct ? (w.triesUsed === 1 ? "Right first time" : "Right on try " + w.triesUsed) : "Missed"),
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

/* ---------- Live class: where each pupil is right now (kept for a few hours, not in the sheet) ---------- */

function readLive_() {
  return JSON.parse(CacheService.getScriptCache().get("live") || "{}");
}

function writeLive_(live) {
  CacheService.getScriptCache().put("live", JSON.stringify(live), LIVE_HOURS * 3600);
}

function updateLive_(d) {
  const name = clean_(d.pupil);
  if (!name) return;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const live = readLive_();
    const key = name.toLowerCase();
    const p = live[key] || { pupil: name, help: false, status: "working" };
    const num = v => Math.max(0, Math.min(999, Number(v) || 0));
    p.pupil = name;
    p.seen = Date.now();
    if (d.type === "help") {
      p.help = !!d.on;
      p.helpAt = d.on ? Date.now() : null;
    } else {
      if (d.event === "start") Object.assign(p, { done: 0, right: 0, missedRow: 0, notFirstRow: 0, lastWord: "" });
      p.status = { start: "working", word: "working", end: "finished", stop: "stopped" }[d.event] || p.status;
      p.list = clean_(d.list);
      p.total = num(d.total);
      if (d.event !== "start") {
        p.done = num(d.done);
        p.right = num(d.right);
        p.missedRow = num(d.missedRow);
        p.notFirstRow = num(d.notFirstRow);
        if (d.word) p.lastWord = clean_(d.word) + (d.ok ? " ✓" : " ✗");
      }
    }
    // Forget pupils who have been gone a long time
    const cutoff = Date.now() - LIVE_HOURS * 3600 * 1000;
    Object.keys(live).forEach(k => { if (live[k].seen < cutoff) delete live[k]; });
    live[key] = p;
    writeLive_(live);
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Assignments: which lists each pupil sees as "Your lists today" ---------- */

function readAssignments_(ss) {
  const sheet = ss.getSheetByName("Assignments");
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues()
    .filter(r => String(r[0]).trim())
    .map(r => ({ who: String(r[0]).trim(), lists: String(r[1]).split(",").map(s => s.trim()).filter(Boolean) }));
}

// Pupils' devices send a fingerprint (SHA-256) of the name, never the name itself, and get back
// only that pupil's lists plus any set for "Everyone" — never the class list
function assignmentsJsonp_(p) {
  const callback = /^[A-Za-z_$][\w$]{0,40}$/.test(p.callback || "") ? p.callback : "";
  let body = { ok: false, lists: [] };
  if (!KEY || p.key === KEY) {
    const wanted = String(p.pupil || "").toLowerCase();
    const lists = [];
    readAssignments_(SpreadsheetApp.getActiveSpreadsheet()).forEach(row => {
      const who = row.who.toLowerCase();
      if (who === "everyone" || sha256_(who) === wanted) row.lists.forEach(l => { if (!lists.includes(l)) lists.push(l); });
    });
    body = { ok: true, lists: lists };
  }
  const text = callback ? callback + "(" + JSON.stringify(body) + ");" : JSON.stringify(body);
  return ContentService.createTextOutput(text)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function sha256_(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8)
    .map(b => ((b + 256) % 256).toString(16).padStart(2, "0"))
    .join("");
}

/* ---------- The teacher dashboard (Dashboard.html calls these) ---------- */

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Spelling")
    .addItem("Open class dashboard", "openDashboard")
    .addToUi();
}

function openDashboard() {
  const html = HtmlService.createHtmlOutputFromFile("Dashboard").setWidth(1200).setHeight(760);
  SpreadsheetApp.getUi().showModelessDialog(html, "PopSpell — class dashboard");
}

// The person looking must be the account the script runs as (the sheet's owner).
// Anyone else — including anonymous visitors to the web app — gets nothing.
function isTeacher_() {
  const owner = Session.getEffectiveUser().getEmail();
  return !!owner && owner === Session.getActiveUser().getEmail();
}

function requireTeacher_() {
  if (!isTeacher_()) throw new Error("Only the teacher can do this.");
}

function dashboardData() {
  requireTeacher_();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setup_(ss);
  const live = readLive_();
  return {
    now: Date.now(),
    live: Object.keys(live).map(k => live[k]),
    assignments: readAssignments_(ss),
    catalogue: listCatalogue_(),
    pupils: pupilSummaries_(ss)
  };
}

function saveAssignment(who, lists) {
  requireTeacher_();
  who = clean_(who);
  if (!who) throw new Error("Type a pupil's name (or Everyone).");
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setup_(ss);
  const sheet = ss.getSheetByName("Assignments");
  const value = (lists || []).map(clean_).filter(Boolean).join(", ");
  const rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues() : [];
  const at = rows.findIndex(r => String(r[0]).trim().toLowerCase() === who.toLowerCase());
  if (at >= 0 && !value) sheet.deleteRow(at + 2);
  else if (at >= 0) sheet.getRange(at + 2, 1, 1, 3).setValues([[String(rows[at][0]).trim(), value, new Date()]]); // keep the name as first typed
  else if (value) sheet.appendRow([who, value, new Date()]);
  return readAssignments_(ss);
}

function clearHelp(pupil) {
  requireTeacher_();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const live = readLive_();
    const p = live[String(pupil).toLowerCase()];
    if (p) { p.help = false; p.helpAt = null; writeLive_(live); }
  } finally {
    lock.releaseLock();
  }
  return true;
}

// The spelling lists on the website, read from its words.js (remembered for an hour)
function listCatalogue_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get("catalogue");
  if (hit) return JSON.parse(hit);
  let lists = [];
  try {
    const text = UrlFetchApp.fetch(SITE_URL.replace(/\/?$/, "/") + "words.js", { muteHttpExceptions: true }).getContentText();
    let stage = "";
    text.split("\n").forEach(line => {
      const s = /stage:\s*"([^"]+)"/.exec(line);
      if (s) stage = s[1];
      const l = /\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)"/.exec(line);
      if (l) lists.push({ id: l[1], title: l[2], stage: stage });
    });
  } catch (err) {
    lists = [];
  }
  if (lists.length) cache.put("catalogue", JSON.stringify(lists), 3600);
  return lists;
}

// Each pupil's totals and most-missed sounds from the last 30 days (remembered for a minute)
function pupilSummaries_(ss) {
  const cache = CacheService.getScriptCache();
  const hit = cache.get("pupils");
  if (hit) return JSON.parse(hit);
  const since = Date.now() - 30 * 24 * 3600 * 1000;
  const pupils = {};
  const get = name => {
    const key = String(name).trim().toLowerCase();
    return pupils[key] = pupils[key] || { pupil: String(name).trim(), lists: 0, words: 0, right: 0, firstGo: 0, last: 0, recent: [], sounds: {} };
  };
  const rows = sheet => (sheet && sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues() : []);
  rows(ss.getSheetByName("Sessions")).forEach(r => {
    if (!r[1]) return;
    const p = get(r[1]);
    const when = new Date(r[0]).getTime();
    p.lists++;
    p.words += Number(r[3]) || 0;
    p.right += Number(r[4]) || 0;
    p.firstGo += Number(r[5]) || 0;
    if (when > p.last) p.last = when;
    p.recent.push({ when: when, list: String(r[2]), score: r[5] + "/" + r[3] });
  });
  rows(ss.getSheetByName("Sounds")).forEach(r => {
    if (!r[1] || new Date(r[0]).getTime() < since) return;
    const s = get(r[1]).sounds;
    s[r[3]] = (s[r[3]] || 0) + 1;
  });
  const out = Object.keys(pupils).map(k => {
    const p = pupils[k];
    p.recent = p.recent.sort((a, b) => b.when - a.when).slice(0, 4);
    p.topSounds = Object.keys(p.sounds).sort((a, b) => p.sounds[b] - p.sounds[a]).slice(0, 6)
      .map(s => ({ sound: s, times: p.sounds[s] }));
    delete p.sounds;
    return p;
  }).sort((a, b) => a.pupil.localeCompare(b.pupil));
  cache.put("pupils", JSON.stringify(out), 60);
  return out;
}

/* ---------- Sheet setup ---------- */

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
    sheet.getRange(name === "Assignments" ? "C:C" : "A:A").setNumberFormat("d mmm yyyy, h:mm");
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
  const text = String(value == null ? "" : value).replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
