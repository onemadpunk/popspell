/* npm run sheet-check: prints every worksheet to PDF in a real browser and lists any page that
   doesn't fit one A4 sheet. It opens the teacher Library with a stand-in for the cloud (no Firebase,
   no sign-in), presses Print on each entry and counts the pages Chrome makes:
     - spelling lists: the practice sheet (young, middle, older), sound map, dictation, handwriting
       and sentences
     - paper sheets, activities, dictations and stories, with their answer pages
     - ready lessons, with every sheet in the pack
   A sheet is fine when it prints exactly as many A4 pages as it has pages (pupil page, answers…).
   Letter formation is two pages on purpose.

   It needs Playwright and its Chromium:  npm install --no-save playwright && npx playwright install chromium
   Options: --type spelling|paper|activity|dictation|story|lesson (one kind only), --id regex (matching entries only), --limit N (first N of
   each kind), --pdf folder (keeps a PDF of anything that doesn't fit; add --keep-all to keep every PDF). */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = name => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : null; };
const TYPES = arg("type") ? [arg("type")] : ["spelling", "paper", "activity", "dictation", "story", "lesson"];
const LIMIT = Number(arg("limit")) || Infinity;
const KEEP = arg("pdf");
const ONLY = arg("id") ? new RegExp(arg("id")) : null; // --id regex: only entries whose id matches
const PAPER = arg("paper"); // --paper Letter: as if the printer were set to other paper than the sheet's A4
const KEEP_ALL = process.argv.includes("--keep-all"); // with --pdf: keep every PDF, not just the ones that don't fit
const TWO_PAGES = /^(letter-formation|lesson-early-forming-lowercase-letters)$/;

let chromium;
try { ({ chromium } = await import("playwright")); } catch {
  console.error("sheet-check needs Playwright: npm install --no-save playwright && npx playwright install chromium");
  process.exit(2);
}

// The site as it is, with cloud.js swapped for a signed-in owner with one class and no data
const FAKE_CLOUD = `<script>(() => {
  const me = { uid: "u1", email: "check@popspell.com", name: "Sheet check", role: "owner" };
  const classes = [{ id: "CHECK1", name: "Check class", teacher: "u1", teacherName: "Sheet check" }];
  const known = { me: async () => me, classes: async () => classes, watchLive: () => () => {}, calendarToken: async () => null,
    forgetCalendarToken: () => {}, session: async () => {}, live: async () => {} };
  window.__popCloudResolve(new Proxy(known, { get: (t, k) => k in t ? t[k] : (k === "then" ? undefined : async () => []) }));
})();</script>`;
const TYPES_OF = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".mp3": "audio/mpeg" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/" || url === "/check.html") {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8").replace(/<script type="module" src="cloud\.js[^"]*"><\/script>/, FAKE_CLOUD);
    res.writeHead(200, { "content-type": "text/html" }); return res.end(html);
  }
  const file = path.join(ROOT, path.normalize(url));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES_OF[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errors = [];
page.on("pageerror", e => errors.push(e.message));
page.on("dialog", d => d.dismiss());
await page.addInitScript(() => { window.print = () => { window.__printed = (window.__printed || 0) + 1; }; });
await page.goto(`${base}/check.html#/teacher/library`);
await page.waitForSelector("#libType", { timeout: 30000 });
await page.evaluate(() => document.fonts && document.fonts.ready);

const setType = type => page.evaluate(t => {
  const s = document.querySelector("#libType"); s.value = t; s.dispatchEvent(new Event("change", { bubbles: true }));
  return [...new Set([...document.querySelectorAll("[data-print]")].filter(b => !b.closest("dialog")).map(b => b.dataset.print))];
}, type);

// Opens an entry's print preview, chooses the settings, and presses Print (through a lesson's two dialogs)
async function printPages(id, settings) {
  await page.evaluate(async ({ id, settings }) => {
    window.__printed = 0;
    document.querySelectorAll("dialog").forEach(d => d.remove());
    [...document.querySelectorAll(`[data-print="${CSS.escape(id)}"]`)].find(b => !b.closest("dialog")).click();
    for (let i = 0; i < 4 && !window.__printed; i++) {
      await new Promise(r => setTimeout(r, 30));
      const d = [...document.querySelectorAll("dialog[open]")].pop();
      if (!d) break;
      for (const [sel, v] of Object.entries(settings)) {
        const el = d.querySelector(sel);
        if (!el || el.disabled) continue;
        if (el.type === "checkbox") el.checked = v; else el.value = v;
        el.dispatchEvent(new Event("change"));
      }
      const go = d.querySelector("button[data-print]");
      if (!go || go.disabled) break;
      go.click();
    }
  }, { id, settings });
  await page.waitForFunction(() => window.__printed > 0, null, { timeout: 10000 });
  const sheets = await page.evaluate(() => document.querySelectorAll(".worksheet-print > .ws-page").length || 1);
  // Each page that fits is a box the size of the printed A4 area: anything cut off its bottom is counted
  await page.emulateMedia({ media: "print" });
  const clipped = await page.evaluate(() => {
    const sheet = document.querySelector(".worksheet-print");
    sheet.style.width = "186mm";
    const n = [...sheet.querySelectorAll(":scope > .ws-page:not(.ws-flow)")].filter(p => p.scrollHeight > p.clientHeight + 1).length;
    sheet.style.width = "";
    return n;
  });
  await page.emulateMedia({ media: null });
  const pdf = await page.pdf(PAPER ? { format: PAPER, printBackground: true } : { preferCSSPageSize: true, printBackground: true });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  return { sheets, pages, pdf, clipped };
}

const SPELLING = [["practice, young", { "[data-mode]": "practice", "[data-band]": "young" }],
  ["practice, middle", { "[data-mode]": "practice", "[data-band]": "middle" }], ["practice, older", { "[data-mode]": "practice", "[data-band]": "older" }],
  ["sound map", { "[data-mode]": "mapping" }], ["dictation", { "[data-mode]": "dictation" }],
  ["handwriting", { "[data-mode]": "handwriting" }], ["sentences", { "[data-mode]": "sentences" }]];
const bad = [];
let checked = 0;
for (const type of TYPES) {
  const ids = (await setType(type)).filter(id => !ONLY || ONLY.test(id)).slice(0, LIMIT);
  for (const id of ids) {
    const runs = type === "spelling" ? SPELLING.map(([name, s]) => [name, Object.assign({ "[data-words]": false }, s)])
      : [["", { "[data-answers]": true, "[data-words]": true }]];
    for (const [name, settings] of runs) {
      const label = `${type} ${id}${name ? ` (${name})` : ""}`;
      checked++;
      try {
        const r = await printPages(id, settings);
        const expected = r.sheets + (TWO_PAGES.test(id) ? 1 : 0);
        if (r.pages > expected) bad.push(`${label}: ${r.pages} A4 pages for ${r.sheets} sheet${r.sheets === 1 ? "" : "s"}`);
        else if (r.clipped) bad.push(`${label}: the bottom of ${r.clipped} page${r.clipped === 1 ? " is" : "s are"} cut off`);
        if (KEEP && (KEEP_ALL || r.pages > expected || r.clipped)) { fs.mkdirSync(KEEP, { recursive: true }); fs.writeFileSync(path.join(KEEP, `${label.replace(/[^\w-]+/g, "_")}.pdf`), r.pdf); }
      } catch (e) { bad.push(`${label}: couldn't print (${String(e.message || e).split("\n")[0]})`); }
    }
    process.stdout.write(".");
  }
  process.stdout.write(` ${type}\n`);
}
await browser.close();
server.close();
if (errors.length) console.log(`Page errors:\n  ${[...new Set(errors)].slice(0, 10).join("\n  ")}`);
console.log(`Checked ${checked} printouts.`);
if (bad.length) {
  console.log(`${bad.length} don't fit one A4 page each:\n  ${bad.join("\n  ")}`);
  process.exit(1);
}
console.log("Every sheet fits its A4 pages.");
