// Build: run `npm run build` before every push.
// Writes lessons.js from content/lessons/*.json and paper-sheets.js from sheets/*.js, then stamps every local script and stylesheet a
// page loads with a short fingerprint of that file's contents (style.css?v=3f9a1c2b), so a browser fetches a file again exactly when it has changed,
// and nobody has to bump version numbers by hand. `npm run check` fails if a stamp is out of date.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const read = f => readFileSync(new URL(f, root), "utf8");
// The same fingerprint on Windows and on GitHub's Linux machines, whatever the line endings
export const fingerprint = file => createHash("sha256").update(read(file).replace(/\r\n/g, "\n")).digest("hex").slice(0, 8);

// The site's own pages (tracked by git), except Google's Search Console file
export function pages() {
  const tracked = execFileSync("git", ["ls-files", "*.html"], { cwd: fileURLToPath(root), encoding: "utf8" }).split("\n").filter(Boolean);
  return tracked.filter(p => !/^google[0-9a-f]+\.html$/.test(p));
}

// lessons.js is written from the lesson files in content/lessons (one per section, in name order).
// Edit those files, never lessons.js itself.
export function lessonsJS() {
  const dir = new URL("content/lessons/", root);
  const files = readdirSync(dir).filter(f => f.endsWith(".json")).sort();
  const lessons = files.flatMap(f => JSON.parse(readFileSync(new URL(f, dir), "utf8")).lessons);
  return `/*
  READY LESSONS: a lesson for every area of the Curriculum for Excellence literacy and numeracy
  benchmarks, at Early to Fourth level, and for England's national curriculum from Reception to key
  stage 4, so a tutor can support any gap straight away.

  WRITTEN BY tools/build.mjs (npm run build) from content/lessons/*.json: edit those files, not this one.

  Each lesson is built from the official guidance only (Education Scotland's Experiences and
  Outcomes and Benchmarks, June 2017; the Department for Education's programmes of study): the
  success criteria are the benchmark statements for that area, in "I can" form. A lesson is about
  30 minutes: start (5), teach (10), practise (10), check (5). It links to PopSpell's online work and
  printable sheets where they fit ("use"), ends with something to do at home, and has a question to
  check understanding ("understand", with what to look for in "lookFor").

    level      Early | First | Second | Third | Fourth
    subject    Literacy | Maths
    strand     the library strand it appears under
    codes      the CfE Experiences and Outcomes it covers (England's statements are in england.js)
    use        PopSpell activity, spelling list or paper sheet ids for the practice
    england    true for lessons written from England's curriculum; "cfe" is their Scottish version, if any
*/
window.PopLessons = (() => {
  "use strict";
  const lessons = [
${lessons.map(l => `    ${JSON.stringify(l)}`).join(",\n")}
  ];
  const LEVELS = ["Early", "First", "Second", "Third", "Fourth"];
  return {
    all: () => lessons.slice(),
    get: id => lessons.find(l => l.id === id) || null,
    // Lessons that use a piece of PopSpell work, for suggesting them when a pupil finds it hard
    forWork: id => lessons.filter(l => l.use.includes(id)),
    // Lessons for an area and CfE level, in teaching order (England's own lessons come last)
    forArea: (subject, level) => lessons.filter(l => l.subject === subject && (!level || l.level === level)),
    LEVELS,
    MINUTES: { start: 5, teach: 10, practise: 10, check: 5 }
  };
})();
`;
}
// paper-sheets.js is the files in sheets/ joined in name order: one shared start (helpers), a file
// per section of sheets, and the end. Each file is part of one script, so edit them, not the result.
export function paperSheetsJS() {
  const dir = new URL("sheets/", root);
  return readdirSync(dir).filter(f => f.endsWith(".js")).sort().map(f => readFileSync(new URL(f, dir), "utf8").replace(/\r\n/g, "\n")).join("");
}
// Generated files that don't match their sources
export const GENERATED = { "lessons.js": lessonsJS, "paper-sheets.js": paperSheetsJS };
export const staleGenerated = () => Object.entries(GENERATED).filter(([f, make]) => read(f).replace(/\r\n/g, "\n") !== make()).map(([f]) => f);

const REF = /(<(?:script|link)\b[^>]*?\b(?:src|href)=")([A-Za-z0-9_\-/]+\.(?:js|css))(?:\?v=[^"]*)?(")/g;
// Each page with every local .js/.css reference stamped. The pupil app's page also carries a build
// number made from all its stamps, which open tablets compare with popspell.com's to notice an update.
export function stamped(page) {
  let html = read(page).replace(REF, (all, before, file, after) => (existsSync(new URL(file, root)) ? `${before}${file}?v=${fingerprint(file)}${after}` : all));
  if (page === "index.html") {
    const build = createHash("sha256").update([...html.matchAll(/\?v=([0-9a-f]{8})"/g)].map(m => m[1]).join(",")).digest("hex").slice(0, 8);
    const meta = `<meta name="popspell-build" content="${build}">`;
    html = /<meta name="popspell-build"[^>]*>/.test(html) ? html.replace(/<meta name="popspell-build"[^>]*>/, meta) : html.replace(/(<meta charset="utf-8">)/, `$1\n  ${meta}`);
  }
  return html;
}
// Pages whose stamps don't match their files
export const staleStamps = () => pages().filter(p => stamped(p) !== read(p));

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  // Generated files first, so their stamps are right
  for (const f of staleGenerated()) { writeFileSync(new URL(f, root), GENERATED[f]()); console.log(`Wrote ${f}.`); }
  const changed = staleStamps();
  for (const p of changed) writeFileSync(new URL(p, root), stamped(p));
  console.log(changed.length ? `Stamped ${changed.join(", ")}.` : "All stamps are up to date.");
}
