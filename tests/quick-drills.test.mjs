import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const window = {};
runInNewContext(readFileSync(new URL("../paper-sheets.js", import.meta.url), "utf8"), { window });
const kit = { sheetHead: t => `<h1>${t}</h1>`, brandHead: t => `<h1>${t}</h1>`, handwritingRow: () => "<div></div>", esc: x => String(x), phonicsWords: () => [] };
const drills = Object.values(window.PopPaper.sheets).filter(s => s.id.startsWith("paper-drill-"));
const answers = html => (html.match(/<li>/g) || []).length;

test("there are quick drills from Early to Second level, each titled so the Library finds them", () => {
  assert.ok(drills.length >= 28);
  for (const d of drills) assert.match(d.title, /^Quick drill: /, d.id);
});

test("every print of every drill is one page with a strip, numbered tasks and an answers page", () => {
  for (const d of drills) for (let run = 0; run < 150; run++) {
    const b = d.build("Pupil", kit);
    assert.ok(b.pupil.includes('class="qd-strip"'), `${d.id} has the quick drill strip`);
    assert.ok(b.pupil.includes('class="qd-n">1<'), `${d.id} numbers its tasks`);
    assert.ok(b.answers && answers(b.answers) >= 3, `${d.id} has answers`);
    assert.doesNotMatch(b.pupil + b.answers, /undefined|NaN|\[object/, d.id);
  }
});

test("a word box drill never repeats a word, and every word in the box is an answer", () => {
  const d = drills.find(x => x.id === "paper-drill-word-box");
  for (let run = 0; run < 150; run++) {
    const b = d.build("Pupil", kit);
    const box = b.pupil.match(/class="qd-bank">([^<]*)</)[1].split(/\s*&nbsp; · &nbsp;\s*/);
    assert.equal(new Set(box).size, 10);
    for (const w of box) assert.ok(b.answers.includes(`<b>${w}</b>`), w);
  }
});

test("drills change between prints, so the same drill can be done again", () => {
  for (const d of drills.filter(x => x.id !== "paper-drill-quick-read" && x.id !== "paper-drill-tiny-story")) {
    const seen = new Set(Array.from({ length: 12 }, () => d.build("Pupil", kit).answers));
    assert.ok(seen.size > 1, `${d.id} varies`);
  }
});
