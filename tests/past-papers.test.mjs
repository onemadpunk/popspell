import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createContext, runInContext } from "node:vm";

// The banks load before the sheets, as in index.html
const window = {};
window.window = window;
const ctx = createContext(Object.assign(window, { console, Math, Date }));
for (const f of ["exam-english/texts.js", "exam-english/gcse.js", "exam-english/sqa.js", "exam-english/alevel.js", "exam-english/bank.js", "activities.js", "paper-sheets.js"])
  runInContext(readFileSync(new URL(`../${f}`, import.meta.url), "utf8"), ctx);
const kit = { sheetHead: t => `<h1>${t}</h1>`, brandHead: t => `<h1>${t}</h1>`, handwritingRow: () => "<div></div>", esc: x => String(x), phonicsWords: () => [] };
const sheets = Object.values(window.PopPaper.sheets).filter(s => s.id.startsWith("paper-pp-"));

test("every climb stage has a real past paper tracker, each with the stage's own topic map", () => {
  assert.equal(sheets.length, 20);
  for (const s of sheets) {
    const b = s.build("Pupil", kit);
    assert.doesNotMatch(b.pupil + b.answers, /undefined|NaN|\[object|null/, s.id);
    const topics = (b.pupil.match(/<li value=/g) || []).length;
    assert.ok(topics >= 7, `${s.id} maps ${topics} topics`);
    assert.doesNotMatch(b.pupil, /Stage \d+<\/span>/, `${s.id} names its stage`);
  }
});

test("the past paper sheets never point to a website, so they work in the paper-only packs", () => {
  for (const s of sheets) {
    const b = s.build("Pupil", kit);
    assert.doesNotMatch(b.pupil + b.answers, /https?:|www\.|website|online (practice|check)|popspell\.com/i, s.id);
  }
});
