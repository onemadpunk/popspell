/* npm run english-check: opens every Adult English lesson in a real browser and checks that
     - each step fits a 1366 × 650 window without scrolling, in learner view and in teacher view
       (which shows every answer, so it is the tallest), and after Check with every answer wrong
     - the student copy prints on 2 A4 pages and the teacher copy on 3, with nothing cut off
   It needs Playwright and its Chromium:  npm install --no-save playwright && npx playwright install chromium
   Option: --shots folder  saves a screenshot of every step and a PDF of each copy there. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHOTS = (i => i > 0 ? process.argv[i + 1] : null)(process.argv.indexOf("--shots"));
let chromium;
try { ({ chromium } = await import("playwright")); } catch {
  console.error("english-check needs Playwright: npm install --no-save playwright && npx playwright install chromium");
  process.exit(2);
}
const window = {};
runInNewContext(fs.readFileSync(path.join(ROOT, "english-lessons.js"), "utf8"), { window });
const lessons = window.PopEnglish.all();

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".ico": "image/x-icon" };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, path.normalize(decodeURIComponent(req.url.split("?")[0])));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/english.html`;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch();
const problems = [];
const overflow = page => page.evaluate(() => {
  const s = document.getElementById("stage");
  return { page: document.scrollingElement.scrollHeight - innerHeight, stage: s.scrollHeight - s.clientHeight, wide: document.scrollingElement.scrollWidth - innerWidth };
});
// Answer everything wrong, then press Check: the wrong-answer notes show
const answerWrong = page => page.evaluate(() => {
  document.querySelectorAll(".en-gap").forEach(g => { g.value = "xxxxxxxx"; g.dispatchEvent(new Event("input")); });
  const t = document.getElementById("writeBox");
  if (t) { t.value = "I'm going to go. ".repeat(40); t.dispatchEvent(new Event("input")); }
});

for (const [w, h] of [[1366, 650]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const lesson of lessons) {
    for (const teacher of [false, true]) {
      await page.goto(`${base}#${lesson.id}/1`);
      await page.evaluate(t => localStorage.setItem("popspell-english-teacher", t ? "1" : "0"), teacher);
      for (let k = 1; k <= lesson.steps.length; k++) {
        await page.goto(`${base}#${lesson.id}/${k}`);
        await page.reload();
        if (!teacher) {
          // the learner's tallest state: every true/false and choice picked wrong, then checked
          for (const b of await page.$$(".en-tf li")) await (await b.$$(".en-pill"))[1].click().catch(() => {});
          await answerWrong(page);
          const check = await page.$('[data-act="check"]');
          if (check) await check.click();
        }
        const o = await overflow(page);
        const who = `${lesson.id} step ${k} (${teacher ? "teacher" : "learner"} view, ${w}×${h})`;
        if (o.page > 0 || o.stage > 0) problems.push(`${who} needs scrolling: page ${o.page}px, step ${o.stage}px over`);
        if (o.wide > 0) problems.push(`${who} is ${o.wide}px too wide`);
        if (SHOTS && w === 1366) await page.screenshot({ path: path.join(SHOTS, `${lesson.id}-${k}-${teacher ? "teacher" : "learner"}.png`) });
      }
    }
  }
  await page.close();
}

// A4 copies
const page = await browser.newPage();
await page.goto(base);
await page.emulateMedia({ media: "print" });
for (const lesson of lessons) {
  for (const [copy, want] of [["student", 2], ["teacher", 3]]) {
    const pages = await page.evaluate(([id, c]) => window.__englishSheets(id, c), [lesson.id, copy]);
    const over = await page.evaluate(() => [...document.querySelectorAll("#printArea .a4")].map((p, i) => [i + 1, p.scrollHeight - p.clientHeight]).filter(([, d]) => d > 0));
    for (const [n, d] of over) problems.push(`${lesson.id} ${copy} copy page ${n} is ${d}px too tall for A4`);
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const printed = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
    if (pages !== want || printed !== want) problems.push(`${lesson.id} ${copy} copy prints ${printed} pages (${pages} drawn), not ${want}`);
    if (SHOTS) fs.writeFileSync(path.join(SHOTS, `${lesson.id}-${copy}.pdf`), pdf);
  }
}
await browser.close();
server.close();
if (problems.length) { console.log(problems.join("\n")); process.exit(1); }
console.log(`Adult English: ${lessons.length} lesson(s), every step fits the screen and every copy fits A4.`);
