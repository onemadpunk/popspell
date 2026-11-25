/* npm run course-pdf -- [folder]: makes the tutor course (course.html) in a real browser, saves it as PDFs
   and checks that every page fits one A4 sheet. With no folder it only checks (CI runs it this way).

   The PDFs are one course (one course code), in five files: the tutor's guide with the plan and tracker,
   then sessions 1 to 20, 21 to 40 and 41 to 60 as tutor copies (plan, pupil's sheets, answers), and the
   pupil's sheets for all 60 sessions on their own, to print as the pupil's workbook.
   Options: --name "Sam" (the pupil's name on the sheets), --start 2026-12-01 (dates in the plan),
   --per-week 2. It needs Playwright, like sheet-check. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = name => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : ""; };
const OUT = process.argv[2] && !process.argv[2].startsWith("--") ? path.resolve(process.argv[2]) : "";
let chromium;
try { ({ chromium } = await import("playwright")); } catch {
  console.error("course-pdf needs Playwright: npm install --no-save playwright && npx playwright install chromium");
  process.exit(2);
}
const JOBS = [["front", "tutor", "0 Tutor guide, plan and tracker"], ["1-20", "tutor", "1 Sessions 1-20 (tutor copy)"], ["21-40", "tutor", "2 Sessions 21-40 (tutor copy)"],
  ["41-60", "tutor", "3 Sessions 41-60 with mock papers (tutor copy)"], ["all", "pupil", "4 Pupil workbook (all sessions, no answers)"]];
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon" };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, path.normalize(decodeURIComponent(req.url.split("?")[0])));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errors = [];
page.on("pageerror", e => errors.push(e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/course.html`);
await page.waitForSelector("#make");
const code = await page.evaluate(({ who, start, perWeek }) => {
  const made = PopCourse.use(PopCourse.make("gcse-1-3", who, { start: start ? new Date(`${start}T12:00:00`) : null, perWeek: Number(perWeek) || 2 }));
  return made.code;
}, { who: arg("name"), start: arg("start"), perWeek: arg("per-week") });
if (OUT) fs.mkdirSync(OUT, { recursive: true });
const bad = [];
for (const [which, copy, name] of JOBS) {
  const sheets = await page.evaluate(([w, c]) => PopCourse.prepare(w, c), [which, copy]);
  // Each page that fits is a box the size of the printed A4 area: anything cut off its bottom is counted
  await page.emulateMedia({ media: "print" });
  const clipped = await page.evaluate(() => {
    const s = document.querySelector(".worksheet-print");
    s.style.width = "186mm";
    const n = [...s.querySelectorAll(":scope > .ws-page:not(.ws-flow)")].filter(p => p.scrollHeight > p.clientHeight + 1).length;
    s.style.width = "";
    return n;
  });
  await page.emulateMedia({ media: null });
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (OUT) fs.writeFileSync(path.join(OUT, `${name}.pdf`), pdf);
  console.log(`${name}: ${sheets} pages, ${pages} A4 pages${clipped ? `, ${clipped} cut off` : ""}`);
  if (pages !== sheets || clipped) bad.push(name);
}
await browser.close();
server.close();
if (errors.length) { console.log(`Page errors:\n  ${[...new Set(errors)].join("\n  ")}`); process.exit(1); }
console.log(`Course ${code}.${OUT ? ` PDFs in ${OUT}` : ""}`);
if (bad.length) { console.log(`Pages that don't fit one A4 sheet each: ${bad.join(", ")}`); process.exit(1); }
console.log("Every page fits its A4 sheet.");
