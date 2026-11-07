import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "activities.js"].map(read).join("\n"), page);
const A = page.PopActivities;
const upper = A.AREAS.find(a => a.id === "numeracy").activities.filter(a => a.level === "Third" || a.level === "Fourth");
const num = s => Number(String(s).replace(/−/g, "-").replace(/\s/g, ""));

test("S1 to S3 maths is in the Numbers area, with outcomes, and kept out of the starting check", () => {
  assert.ok(upper.length >= 20, `${upper.length} activities`);
  for (const a of upper) {
    assert.equal(a.check, false, a.id);
    assert.ok(A.tag(a.id).eo.length, `${a.id} has outcomes`);
    assert.ok(A.tag(a.id).eo.every(c => /^M(NU|TH) [34]-/.test(c)), `${a.id}: ${A.tag(a.id).eo}`);
  }
});

test("every S1 to S3 maths question is fair: enough of them, the answer among distinct options, and an explanation", () => {
  for (const a of upper) for (let run = 0; run < 30; run++) {
    const qs = a.make();
    assert.ok(qs.length >= 8, `${a.id}: ${qs.length} questions`);
    for (const q of qs) {
      assert.ok(q.prompt && q.answer !== "" && q.skill && q.explain, `${a.id}: ${q.prompt}`);
      assert.ok(!/NaN|undefined|Infinity|\.\d{9,}/.test(q.prompt + q.answer + q.explain), `${a.id}: ${q.prompt} → ${q.answer}`);
      if (q.kind === "choice") {
        assert.ok(q.options.includes(q.answer), `${a.id}: ${q.prompt}`);
        assert.equal(new Set(q.options).size, q.options.length, `${a.id}: ${q.prompt} ${q.options}`);
        assert.ok(q.options.length >= 2);
      }
    }
  }
});

test("worked answers check out", () => {
  for (let run = 0; run < 40; run++) {
    for (const q of A.get("t-angles").make()) {
      const given = (q.prompt.match(/\d+(?=°)/g) || []).map(Number), sum = /triangle|line/.test(q.prompt) ? 180 : 360;
      assert.equal(given.reduce((t, v) => t + v, 0) + num(q.answer), sum, q.prompt);
    }
    for (const q of A.get("f-pythagoras").make()) {
      const [x, y] = q.prompt.match(/\d+(?= cm)/g).map(Number), ans = num(q.answer);
      assert.ok(/hypotenuse \d/.test(q.prompt) ? x * x === y * y + ans * ans : ans * ans === x * x + y * y, q.prompt);
    }
    for (const q of A.get("t-negative-calc").make()) {
      const m = q.prompt.replace(/−/g, "-").match(/^(-?\d+) ([+-]|×) \(?(-?\d+)\)? = \?$/);
      if (!m) continue;
      const [, a, op, b] = m, r = op === "+" ? +a + +b : op === "-" ? a - b : a * b;
      assert.equal(num(q.answer), r, q.prompt);
    }
  }
});
