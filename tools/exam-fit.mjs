/* npm run exam-check: opens every English exam climb question in a real browser at 1366 × 650 (a pupil's
   laptop, no mouse, no scrolling) and checks that the text, the question, the answers and the feedback all
   fit the window without scrolling:
     - in the pupil app: every online activity (the teacher's preview), each question answered wrong
       first (the longest screen: the reason is shown), then the Next button
     - on english-climb.html, the self-guided "My next step" page: every question in the bank
   It needs Playwright and its Chromium:  npm install --no-save playwright && npx playwright install chromium
   Options: --shots folder (screenshots of the first screen of each activity), --id regex (activities, or climb
   questions "topic-id:n", whose id matches), --part app|climb (one of the two only). */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = name => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : null; };
const SHOTS = arg("shots"), ONLY = arg("id") ? new RegExp(arg("id")) : null, PART = arg("part"); // --part app|climb: one of the two only
let chromium;
try { ({ chromium } = await import("playwright")); } catch { try { ({ chromium } = (await import("node:module")).createRequire(import.meta.url)("playwright")); } catch { /* below */ } }
if (!chromium) {
  console.error("exam-check needs Playwright: npm install --no-save playwright && npx playwright install chromium");
  process.exit(2);
}
const FAKE_CLOUD = `<script>(() => {
  const me = { uid: "u1", email: "check@popspell.com", name: "Exam check", role: "owner" };
  const known = { me: async () => me, classes: async () => [], watchLive: () => () => {}, calendarToken: async () => null, forgetCalendarToken: () => {}, session: async () => {}, live: async () => {} };
  window.__popCloudResolve(new Proxy(known, { get: (t, k) => k in t ? t[k] : (k === "then" ? undefined : async () => []) }));
})();</script>`;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png",
  ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".mp3": "audio/mpeg", ".ico": "image/x-icon" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/" || url === "/check.html") {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8").replace(/<script type="module" src="cloud\.js[^"]*"><\/script>/, FAKE_CLOUD);
    res.writeHead(200, { "content-type": "text/html" }); return res.end(html);
  }
  const file = path.join(ROOT, path.normalize(url));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 650 } });
const problems = [], errors = [];
page.on("pageerror", e => errors.push(e.message));
page.on("dialog", d => d.dismiss());
await page.addInitScript(() => { addEventListener("DOMContentLoaded", () => document.head.insertAdjacentHTML("beforeend", "<style>.preview-banner{display:none!important}</style>")); window.speechSynthesis && (window.speechSynthesis.speak = () => {}); HTMLMediaElement.prototype.play = function () { return Promise.resolve(); }; });
// The pupil app zooms a panel that would run off the bottom (fitToScreen in app.js, down to 60%): a screen fits
// when the panel ends inside the window at 85% zoom or more, so the exam text stays readable. The teacher-preview
// banner is hidden first: pupils never see it.
const MIN_ZOOM = 0.85;
const over = async () => {
  await page.waitForTimeout(40);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(40);
  return page.evaluate(min => {
    const p = document.querySelector(".panel.practice") || document.querySelector("main");
    const zoom = Number(p.style.zoom || 1), r = p.getBoundingClientRect();
    return { tall: Math.max(0, Math.round(r.bottom - innerHeight)) + (zoom < min ? 1000 : 0), zoom, wide: document.scrollingElement.scrollWidth - innerWidth };
  }, MIN_ZOOM);
};
const say = o => `${o.tall >= 1000 ? `zoomed to ${Math.round(o.zoom * 100)}%` : `${o.tall}px too tall`}${o.wide > 0 ? `, ${o.wide}px too wide` : ""}`;

// 1. The pupil app: each activity in the teacher's preview
await page.goto(`${base}/check.html`);
await page.waitForFunction(() => window.PopActivities && window.PopEnglishExam);
const ids = PART === "climb" ? [] : (await page.evaluate(() => window.PopActivities.AREAS.find(a => a.id === "english-exam").activities.map(a => a.id))).filter(id => !ONLY || ONLY.test(id));
let screens = 0;
for (const id of ids) {
  await page.goto(`${base}/check.html#/activity/${encodeURIComponent(id)}?preview=1`);
  await page.reload();
  await page.waitForSelector("#go", { timeout: 20000 });
  await page.click("#go");
  for (let n = 1; n < 30; n++) {
    await page.waitForSelector(".q-option", { timeout: 10000 });
    if (SHOTS && n === 1) await page.screenshot({ path: path.join(SHOTS, `app-${id}.png`) });
    let o = await over();
    if (o.tall > 0 || o.wide > 0) problems.push(`app ${id} question ${n}: ${say(o)}`);
    // Answer wrong until the app gives the answer: the reason then shows, the tallest this screen gets
    for (let k = 0; k < 4 && !(await page.$("#nextQ")); k++) {
      const opts = await page.$$(".q-option:not(:disabled):not(.right)");
      if (!opts.length) break;
      await opts[opts.length - 1].click();
      await page.waitForTimeout(30);
    }
    o = await over();
    if (o.tall > 0 || o.wide > 0) problems.push(`app ${id} question ${n} answered: ${say(o)}`);
    if (SHOTS && (o.tall > 0 || n === 1)) await page.screenshot({ path: path.join(SHOTS, `app-${id}-${n}-answered.png`) });
    screens++;
    const last = await page.$eval("#nextQ", b => /stars/.test(b.textContent));
    await page.click("#nextQ");
    if (last) break;
  }
}
console.log(`Pupil app: ${ids.length} activities, ${screens} question screens checked.`);

// 2. The self-guided page: every bank question, shown and marked
if (PART !== "app" && fs.existsSync(path.join(ROOT, "english-climb.html"))) {
  let n = 0;
  for (const course of ["gcse", "sqa"]) {
    await page.goto(`${base}/english-climb.html${course === "sqa" ? "?course=sqa" : ""}`);
    const ok = await page.evaluate(c => Boolean(window.PopEnglishExam.course(c)), course);
    if (!ok) continue;
    const all = await page.evaluate(c => window.PopEnglishExam.stagesOf(window.PopEnglishExam.course(c)).flatMap(st => st.topics.flatMap(t => t.items.map((it, i) => `${t.id}:${i}`))), course);
    for (const key of all.filter(k => !ONLY || ONLY.test(k))) {
      await page.evaluate(k => window.__climbShow(k), key);
      if (SHOTS && key.endsWith(":0")) await page.screenshot({ path: path.join(SHOTS, `climb-${key.replace(":", "-")}.png`) });
      let o = await over();
      if (o.tall > 0 || o.wide > 0) problems.push(`climb ${key}: ${say(o)}`);
      await page.evaluate(() => { const b = [...document.querySelectorAll(".cl-opt")].pop(); b && b.click(); });
      o = await over();
      if (o.tall > 0 || o.wide > 0) problems.push(`climb ${key} marked: ${say(o)}`);
      n++;
    }
  }
  console.log(`My next step page: ${n} questions checked.`);
}
await browser.close();
server.close();
if (errors.length) console.log(`Page errors:\n  ${[...new Set(errors)].join("\n  ")}`);
if (problems.length) { console.log(`${problems.length} screens don't fit 1366 × 650:\n  ${problems.join("\n  ")}`); process.exit(1); }
console.log("Every screen fits 1366 × 650.");
