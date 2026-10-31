import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const browser = { window: { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] } };
runInNewContext(readFileSync(new URL("../activities.js", import.meta.url), "utf8"), browser);
const activities = browser.window.PopActivities;

test("secondary maths answers match the equations and proportion in their prompts", () => {
  const linear = activities.get("sec-linear-equations");
  const proportion = activities.get("sec-proportion");
  assert.equal(linear.level, "Third");
  assert.equal(proportion.level, "Fourth");
  for (let round = 0; round < 40; round++) {
    const equations = linear.make();
    assert.equal(equations.length, 10);
    for (const q of equations) {
      const match = q.prompt.match(/^Solve (\d+)x ([+−]) (\d+) = (-?\d+)\. What is x\?$/);
      assert.ok(match, q.prompt);
      const [, a, sign, b, total] = match;
      assert.equal(Number(a) * Number(q.answer) + (sign === "−" ? -Number(b) : Number(b)), Number(total));
      assert.ok(q.skill && q.explain);
    }
    const ratios = proportion.make();
    assert.equal(ratios.length, 10);
    assert.equal(ratios.filter(q => q.skill === "direct proportion").length, 5);
    assert.equal(ratios.filter(q => q.skill === "inverse proportion").length, 5);
    for (const q of ratios) {
      const match = q.prompt.match(/^y is (directly|inversely) proportional to x\. When x = (\d+), y = (\d+)\. What is y when x = (\d+)\?$/);
      assert.ok(match, q.prompt);
      const [, type, firstX, firstY, nextX] = match;
      const expected = type === "directly"
        ? Number(firstY) / Number(firstX) * Number(nextX)
        : Number(firstY) * Number(firstX) / Number(nextX);
      assert.equal(Number(q.answer), expected);
      assert.ok(q.explain);
    }
  }
});

test("secondary reading practice offers supported answers with feedback", () => {
  const reading = activities.get("sec-evidence-bias");
  assert.equal(reading.level, "Fourth");
  const questions = reading.make();
  assert.equal(questions.length, 8);
  assert.equal(new Set(questions.map(q => q.label)).size, 8);
  for (const q of questions) {
    assert.equal(q.kind, "choice");
    assert.equal(q.options.length, 3);
    assert.equal(new Set(q.options).size, 3);
    assert.ok(q.options.includes(q.answer));
    assert.ok(q.explain && q.skill);
  }
});
