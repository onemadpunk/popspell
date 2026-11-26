import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const window = {};
runInNewContext(readFileSync(new URL("../paper-sheets.js", import.meta.url), "utf8"), { window });
const kit = { sheetHead: t => `<h1>${t}</h1>`, brandHead: t => `<h1>${t}</h1>`, handwritingRow: () => "<div></div>", esc: x => String(x), phonicsWords: () => [] };
const all = Object.values(window.PopPaper.sheets);
const of = re => all.filter(s => re.test(s.id));
const clean = (b, id) => assert.doesNotMatch(b.pupil + b.answers, /undefined|NaN|\[object|null/, id);

test("the comprehension ladder has 8 rungs, each with a text, a word box and answers for every question", () => {
  const rungs = of(/^paper-comp-ladder-\d$/);
  assert.equal(rungs.length, 8);
  for (const r of rungs) {
    const b = r.build("Pupil", kit);
    clean(b, r.id);
    const qs = (b.pupil.match(/class="pp-q"/g) || []).length, as = (b.answers.match(/<li>/g) || []).length;
    assert.ok(qs >= 5 && as === qs, `${r.id}: ${qs} questions, ${as} answers`);
    assert.match(b.pupil, /Word box/, r.id);
  }
});

test("each reading test's marks add up to the total it shows", () => {
  for (const t of of(/^paper-reading-test-/)) {
    const b = t.build("Pupil", kit);
    clean(b, t.id);
    const marks = [...b.pupil.matchAll(/\((\d) marks?\)/g)].reduce((s, m) => s + Number(m[1]), 0);
    assert.match(b.pupil, new RegExp(`Total ___ / ${marks}<`), t.id);
  }
});

test("writing frames cover eight text types at two levels, each with success criteria to tick", () => {
  const frames = of(/^paper-frame-/);
  assert.equal(frames.length, 16);
  for (const f of frames) { const b = f.build("Pupil", kit); clean(b, f.id); assert.ok((b.pupil.match(/gx-cell/g) || []).length >= 8, f.id); }
});

test("novel task maps have twelve tasks and never point to a website (they go in paper-only packs)", () => {
  for (const m of of(/^paper-novel-map-/)) {
    const b = m.build("Pupil", kit); clean(b, m.id);
    assert.equal((b.pupil.match(/<tr>/g) || []).length, 12, m.id);
    assert.doesNotMatch(b.pupil + b.answers, /website|\bweb\b(?! for)|online|e-book|internet/i, m.id);
  }
});

test("every spot the difference print has exactly the differences it promises, all listed and circled", () => {
  const spots = of(/^paper-spot-[a-z]+-(5|7|10)$/);
  assert.equal(spots.length, 24);
  for (const s of spots) {
    const k = Number(s.id.split("-").pop());
    for (let run = 0; run < 40; run++) {
      const b = s.build("Pupil", kit); clean(b, s.id);
      assert.equal((b.pupil.match(/<svg/g) || []).length, 2, s.id);
      const pics = b.pupil.match(/<svg[\s\S]*?<\/svg>/g);
      assert.notEqual(pics[0], pics[1], `${s.id} pictures differ`);
      assert.equal((b.answers.match(/stroke="#d22"/g) || []).length, k, `${s.id} circles ${k}`);
      assert.equal((b.answers.match(/<li>/g) || []).length, k, `${s.id} lists ${k}`);
    }
  }
});
