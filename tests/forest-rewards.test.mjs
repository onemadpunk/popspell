import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const browser = { window: {} };
runInNewContext(readFileSync(new URL("../forest-rewards.js", import.meta.url), "utf8"), browser);
const forest = browser.window.PopForest;
const plain = value => JSON.parse(JSON.stringify(value));

test("each completed clearing earns one seed once, then unlocks a chosen forest item", () => {
  let first = null;
  for (let clearing = 1; clearing <= 8; clearing++)
    first = forest.award(first, `run-first-${clearing}`, 1);
  assert.equal(forest.earned(first), 8);
  assert.equal(forest.earned(forest.award(first, "run-first-1", 1)), 8);
  const bought = forest.unlock(first, "flowers");
  assert.deepEqual(plain(bought.unlocked), ["flowers"]);
  assert.equal(forest.balance(bought), 2);
  assert.deepEqual(plain(forest.unlock(bought, "treehouse").unlocked), ["flowers"]);
  assert.deepEqual(plain(forest.unlock(bought, "flowers").unlocked), ["flowers"]);
});

test("progress from two devices merges runs and unlocked forest items", () => {
  const home = forest.unlock(forest.award(null, "run-home", 8), "lantern");
  const school = forest.unlock(forest.award(null, "run-school", 8), "flowers");
  const merged = forest.merge(home, school);
  assert.equal(forest.earned(merged), 16);
  assert.deepEqual(plain(merged.unlocked), ["lantern", "flowers"]);
  assert.equal(forest.balance(merged), 6);
  assert.deepEqual(plain(forest.merge(merged, merged)), plain(merged));
});
