import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "word-clues.js", "activities.js"].map(read).join("\n"), page);
const A = page.PopActivities;
const runs = (id, n = 60) => Array.from({ length: n }, () => A.get(id).make());
const ops = { "+": (a, b) => a + b, "−": (a, b) => a - b, "×": (a, b) => a * b, "÷": (a, b) => a / b };

test("number games are a plain games area for P5 to S3, with CfE outcomes", () => {
  const area = A.AREAS.find(a => a.id === "number-games");
  assert.ok(area.game && area.older && area.allLooks);
  assert.equal(area.activities.length, 6);
  for (const act of area.activities) {
    assert.ok(["Second", "Third"].includes(act.level), act.id);
    assert.ok(A.tag(act.id).eo.length, `${act.id} has outcomes`);
    assert.match(act.organiser, /^Numeracy/);
  }
});

test("Make the Target: five different targets, each made from its own tiles by the way shown", () => {
  for (const id of ["ng-target-second", "ng-target-third"]) for (const qs of runs(id)) {
    assert.equal(qs.length, 5, id);
    assert.equal(new Set(qs.map(q => q.target)).size, 5);
    for (const q of qs) {
      const left = q.tiles.slice();
      const made = [];
      for (const [a, op, b, r] of q.steps) {
        assert.equal(ops[op](a, b), r, `${id}: ${a} ${op} ${b}`);
        assert.ok(Number.isInteger(r) && r > 0);
        for (const n of [a, b]) {
          const i = made.indexOf(n);
          if (i >= 0) made.splice(i, 1);
          else { const j = left.indexOf(n); assert.ok(j >= 0, `${id}: ${n} is a tile`); left.splice(j, 1); }
        }
        made.push(r);
      }
      assert.equal(q.steps[q.steps.length - 1][3], q.target);
      assert.ok(!q.tiles.includes(q.target));
    }
  }
});

test("Equal Pairs: six pairs a set, and no card appears twice", () => {
  for (const id of ["ng-pairs-second", "ng-pairs-third"]) for (const qs of runs(id)) {
    assert.equal(qs.length, 4, id);
    for (const q of qs) {
      assert.equal(q.pairs.length, 6, `${id}: ${q.title}`);
      const cards = q.pairs.flat();
      assert.equal(new Set(cards).size, 12, `${id}: ${q.title}: ${cards.join(", ")}`);
      // Each pair's second card is a different value from every other pair's second card
      assert.equal(new Set(q.pairs.map(p => p[1])).size, 6);
    }
  }
});

test("Number Line: every number sits on its line", () => {
  for (const id of ["ng-line-second", "ng-line-third"]) for (const qs of runs(id)) {
    assert.equal(qs.length, 6);
    for (const q of qs) {
      assert.ok(q.value > q.min && q.value < q.max, `${id}: ${q.show} on ${q.min} to ${q.max}`);
      assert.ok(q.step > 0 && (q.max - q.min) / q.step <= 20);
    }
  }
});
