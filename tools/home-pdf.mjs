/* npm run home-pdf -- <pack id|all> [folder]: makes home-school packs (#/home, home-packs.js) in a real
   browser, saves them as PDFs and checks that every page fits one A4 sheet. With no folder it only checks.

   Each pack is saved as: the parent's guide with the plan and tracker, the sessions in parts of 15 as the
   parent's copy (parent's pages, the child's sheets and the answers), and the child's workbook (every
   sheet, no answers). Options: --edition paper (no web links: the check fails if any page names a web
   address or online practice), --sessions 1-8 (only those sessions, for a sample), --name "Sam",
   --start 2026-12-01, --per-week 3. It needs Playwright, like sheet-check. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const arg = name => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : ""; };
const plain = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
const WANT = plain[0] || "all", OUT = plain[1] ? path.resolve(plain[1]) : "";
const PAPER = arg("edition") === "paper";
let chromium;
try { ({ chromium } = await import("playwright")); } catch {
  console.error("home-pdf needs Playwright: npm install --no-save playwright && npx playwright install chromium");
  process.exit(2);
}
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, path.normalize(decodeURIComponent(req.url.split("?")[0])));
  const f = file.endsWith(path.sep) ? path.join(file, "index.html") : file;
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.route(/^(?!http:\/\/127\.0\.0\.1)/, r => r.abort());
const errors = [];
page.on("pageerror", e => errors.push(e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/index.html#/home`);
await page.waitForFunction(() => window.PopHome && document.querySelector(".hm-panel"), null, { timeout: 60000 });
const ids = WANT === "all" ? await page.evaluate(() => PopHomeData.PACKS.map(p => p.id)) : WANT.split(",");
const bad = [];
for (const id of ids) {
  const info = await page.evaluate(({ id, who, start, perWeek, paper }) => {
    const made = PopHome.use(PopHome.make(id, who, { start: start ? new Date(`${start}T12:00:00`) : null, perWeek: Number(perWeek) || 0, paper }));
    return made ? { code: made.code, n: made.sessions.length, title: made.pack.title } : null;
  }, { id, who: arg("name"), start: arg("start"), perWeek: arg("per-week"), paper: PAPER });
  if (!info || !info.n) { console.log(`${id}: no sessions`); bad.push(id); continue; }
  const range = arg("sessions") || `1-${info.n}`;
  const [lo, hi] = range.split("-").map(Number);
  const jobs = [["front", "parent", "0 Parent's guide, plan and tracker"]];
  for (let i = lo; i <= Math.min(hi, info.n); i += 15) jobs.push([`${i}-${Math.min(hi, info.n, i + 14)}`, "parent", `${jobs.length} Sessions ${i}-${Math.min(hi, info.n, i + 14)} (parent's copy)`]);
  jobs.push([`${lo}-${Math.min(hi, info.n)}`, "pupil", `${jobs.length} Child's workbook (sessions ${lo}-${Math.min(hi, info.n)}, no answers)`]);
  const dir = OUT ? path.join(OUT, `${info.title.replace(/[:/\\?*"<>|]/g, "")}${PAPER ? " (paper only)" : ""}`) : "";
  if (dir) fs.mkdirSync(dir, { recursive: true });
  let pagesAll = 0;
  for (const [which, copy, name] of jobs) {
    const sheets = await page.evaluate(([w, c]) => PopHome.prepare(w, c), [which, copy]);
    await page.emulateMedia({ media: "print" });
    const found = await page.evaluate(paper => {
      const s = document.querySelector(".worksheet-print");
      s.style.width = "186mm";
      const clipped = [...s.querySelectorAll(":scope > .ws-page:not(.ws-flow)")].filter(p => p.scrollHeight > p.clientHeight + 1).length;
      s.style.width = "";
      const web = paper ? [...new Set((s.innerText.match(/[^.\n]*(popspell\.com|https?:|www\.|\bonline (?:practice|check|stage|work|list|quiz)|online\s*best|exam board's website|SQA's website|board's website)[^.\n]*/gi) || [])
        .filter(t => !/no internet|without the internet|isn't online|not online|no web/i.test(t)))].slice(0, 5) : [];
      const flow = s.querySelectorAll(":scope > .ws-page.ws-flow").length;
      return { clipped, web, flow };
    }, PAPER);
    await page.emulateMedia({ media: null });
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
    pagesAll += pages;
    if (dir) fs.writeFileSync(path.join(dir, `${name}.pdf`), pdf);
    const notes = [pages !== sheets && !found.flow ? `${sheets} pages made but ${pages} printed` : "", found.clipped ? `${found.clipped} cut off` : "", found.web.length ? `web: ${found.web.join(" | ")}` : ""].filter(Boolean);
    if (notes.length) { bad.push(`${id} ${name}`); console.log(`  ${id} ${name}: ${notes.join("; ")}`); }
  }
  console.log(`${id}: ${info.n} sessions, ${pagesAll} A4 pages (pack ${info.code})`);
}
await browser.close();
server.close();
if (errors.length) { console.log(`Page errors:\n  ${[...new Set(errors)].join("\n  ")}`); process.exit(1); }
if (bad.length) { console.log(`Problems: ${bad.join(", ")}`); process.exit(1); }
console.log("Every page fits its A4 sheet.");
