// Content checks: run with `npm run check` (GitHub runs them on every push).
//   1. Every CfE experience and outcome from Early to Fourth level has a ready lesson (tools/cfe-outcomes.json).
//   2. Every lesson has an understanding check and printable work, and everything it uses exists.
//   3. Every paper sheet belongs to a lesson, has a unique id and title, and builds.
//   4. england.js matches tools/build_england.py's output, and that build's own checks pass
//      (every statement exists, nothing is mapped twice, every key stage 4 statement is taught).
//   5. Every page's ?v= stamps match its files (tools/build.mjs).
// The A4 fit of printed pages needs a browser: see tools/fit-sweep.js.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { staleStamps } from "./build.mjs";

const root = new URL("..", import.meta.url);
const read = f => readFileSync(new URL(f, root), "utf8");
const problems = [];
const fail = (area, msg) => problems.push(`${area}: ${msg}`);

// The browser's content files, loaded as the page loads them
const window = {};
const context = { window, console };
for (const f of ["words.js", "sentences.js", "passages.js", "stories.js", "activities.js", "lessons.js", "paper-sheets.js"]) runInNewContext(read(f), context, { filename: f });
const { PopActivities: A, PopLessons: L, PopPaper: P } = window;
const lessons = L.all();

// 1. CfE coverage
const outcomes = JSON.parse(read("tools/cfe-outcomes.json")).outcomes;
const taught = new Set(lessons.flatMap(l => (l.codes || []).concat(l.cfe ? l.cfe.codes : [])));
for (const [level, codes] of Object.entries(outcomes)) {
  const missing = codes.filter(c => !taught.has(c));
  if (missing.length) fail("CfE", `${level} level outcomes with no lesson: ${missing.join(", ")}`);
}
const official = new Set(Object.values(outcomes).flat());
const unknown = [...taught].filter(c => !official.has(c));
if (unknown.length) fail("CfE", `codes that aren't official outcomes: ${unknown.join(", ")}`);

// 2. Lessons
const activityIds = new Set(A.AREAS.flatMap(a => a.activities.map(x => x.id)));
const listIds = new Set([...window.SPELLING_LISTS, ...(window.ENGLAND_LISTS || [])].flatMap(s => s.lists.map(l => l.id)));
// Sheets made in teacher.js itself (letter formation and handwriting)
const builtIn = id => /^(letter-formation|letter-family-.+|handwriting-spacing|handwriting-joins)$/.test(id);
const exists = id => activityIds.has(id.replace(/^dictate:/, "")) || listIds.has(id.replace(/^dictate:/, "")) || Boolean(P.get(id)) || builtIn(id);
const seen = new Set();
for (const l of lessons) {
  if (seen.has(l.id)) fail("Lessons", `duplicate id ${l.id}`);
  seen.add(l.id);
  if (!l.understand || !l.lookFor) fail("Lessons", `${l.id} has no understanding check`);
  for (const u of l.use) if (!exists(u)) fail("Lessons", `${l.id} uses ${u}, which doesn't exist`);
  if (!P.forLesson(l.id).length && !l.use.length) fail("Lessons", `${l.id} has nothing to print`);
  for (const k of ["start", "teach", "practise", "check"]) if (!l.steps || !l.steps[k]) fail("Lessons", `${l.id} has no ${k} step`);
}

// 3. Paper sheets
const sheetSource = read("paper-sheets.js");
const declared = [...sheetSource.matchAll(/^\s*add\("(paper-[a-z0-9-]+)"/gm)].map(m => m[1]);
const dupIds = declared.filter((id, i) => declared.indexOf(id) !== i);
if (dupIds.length) fail("Sheets", `ids used twice (the second replaces the first): ${[...new Set(dupIds)].join(", ")}`);
const titles = {};
const kit = { sheetHead: t => `<h1>${t}</h1>`, brandHead: t => `<h1>${t}</h1>`, handwritingRow: () => "<div></div>", esc: x => String(x), phonicsWords: () => [] };
for (const sheet of Object.values(P.sheets)) {
  if (!L.get(sheet.lesson)) fail("Sheets", `${sheet.id} belongs to ${sheet.lesson}, which doesn't exist`);
  (titles[sheet.title] = titles[sheet.title] || []).push(sheet.id);
  try {
    const built = sheet.build("Pupil", kit);
    if (!built || !built.pupil) fail("Sheets", `${sheet.id} builds no pupil page`);
  } catch (e) { fail("Sheets", `${sheet.id} doesn't build: ${e.message}`); }
}
for (const [title, ids] of Object.entries(titles)) if (ids.length > 1) fail("Sheets", `"${title}" is the title of ${ids.join(" and ")}`);
// A lesson that names a sheet in its practise step ("the \"Fill it up\" sheet") must name one of its own
for (const l of lessons) {
  const named = [...l.steps.practise.matchAll(/"([^"]+)" sheet/g)].map(m => m[1]);
  const own = new Set(P.forLesson(l.id).concat(l.use.map(u => P.get(u)).filter(Boolean)).map(s => s.title));
  for (const t of named) if (!own.has(t)) fail("Lessons", `${l.id} names the "${t}" sheet, which isn't one of its sheets`);
}

// 4. England: rebuild into a copy and compare
const dir = mkdtempSync(join(tmpdir(), "popspell-check-"));
try {
  const copy = join(dir, "england.js");
  writeFileSync(copy, read("england.js"));
  const python = process.platform === "win32" ? "python" : "python3";
  execFileSync(python, ["-I", "tools/build_england.py", "tools/england-statements.json", copy], { cwd: new URL(".", root), stdio: "pipe" });
  if (readFileSync(copy, "utf8") !== read("england.js")) fail("England", "england.js is out of date: run python -I tools/build_england.py");
} catch (e) {
  fail("England", `tools/build_england.py stopped: ${String(e.stdout || e.message).trim().split("\n").pop()}`);
} finally { rmSync(dir, { recursive: true, force: true }); }

// 5. Version stamps match the files (npm run build)
const stale = staleStamps();
if (stale.length) fail("Build", `stamps out of date in ${stale.join(", ")}: run npm run build`);

const summary = `${lessons.length} lessons, ${Object.keys(P.sheets).length} paper sheets, ${activityIds.size} activities, ${official.size} CfE outcomes`;
if (problems.length) {
  console.error(`✖ ${problems.length} problem(s) (${summary}):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`✔ All content checks pass (${summary}).`);
