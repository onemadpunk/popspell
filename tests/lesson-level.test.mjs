import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// A lesson's practice must be at the lesson's level. A Second level lesson on numbers to a million once
// linked only to three-digit sums, so a Years 5 and 6 home pack printed a sheet headed "Year 3".
// Rule for maths lessons from Second level up: no linked activity two CfE levels below the lesson, and
// (Second and Third level) none whose England statements start two or more years below the level.
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "activities.js", "lessons.js"].map(read).join("\n"), page);
const A = page.PopActivities, L = page.PopLessons;
const FOR_ID = JSON.parse(read("england.js").match(/const FOR_ID = (\{[\s\S]*?\});\n/)[1]);
const firstYear = id => { const ys = (FOR_ID[id] || []).map(s => s.match(/-y(R|\d+)-/)).filter(Boolean).map(m => (m[1] === "R" ? 0 : +m[1])); return ys.length ? Math.min(...ys) : null; };
const RANK = { Early: 0, First: 1, Second: 2, Third: 3, Fourth: 4 }, START = { Second: 5, Third: 7 };

test("maths lessons from Second level up link only to practice at (or just below) their level", () => {
  const bad = [];
  for (const l of L.all()) {
    if (l.subject !== "Maths" || !(RANK[l.level] >= 2) || l.england) continue;
    for (const id of l.use || []) {
      const a = A.get(id);
      if (!a || a.game) continue;
      if (RANK[a.level] !== undefined && RANK[l.level] - RANK[a.level] >= 2) bad.push(`${l.id} → ${id} (${a.level})`);
      const y = firstYear(id);
      if (START[l.level] !== undefined && y !== null && START[l.level] - y >= 2) bad.push(`${l.id} → ${id} (Year ${y})`);
    }
  }
  assert.deepEqual(bad, []);
});

test("the new Second level activities make clean questions, each with a worked explanation", () => {
  for (const id of ["s-add-sub", "s-rounding", "s-durations", "s-special-numbers", "s-equations", "s-shapes", "s-data"]) {
    const a = A.get(id);
    assert.equal(a.level, "Second", id);
    for (let i = 0; i < 40; i++) for (const q of a.make()) {
      assert.ok(!/NaN|undefined|Infinity/.test(JSON.stringify(q)), `${id}: ${q.prompt}`);
      assert.ok(q.explain && q.explain.length > 20, `${id} explains: ${q.prompt}`);
      if (q.options) assert.equal(q.options.filter(o => o === q.answer).length, 1, `${id}: ${q.prompt}`);
    }
  }
});
