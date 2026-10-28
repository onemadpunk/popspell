import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../activities.js", import.meta.url), "utf8");
const browser = { window: { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] } };
runInNewContext(source, browser);
const activities = browser.window.PopActivities;
const ids = ["g-canopy-flash", "g-canopy-make", "g-canopy-hidden", "g-canopy-compare", "g-canopy-twenty", "g-canopy-run"];

test("all Counting Canopy levels are assignable games with playable number puzzles", () => {
  for (const id of ids) {
    const game = activities.get(id);
    assert.ok(game, id);
    assert.equal(activities.tag(id).area, "games");
    assert.equal(game.organiser, "Numeracy · Number and number processes");
    const rounds = game.make();
    assert.equal(rounds.length, id === "g-canopy-run" ? 8 : 6);
    for (const q of rounds) {
      assert.equal(q.kind, "canopy");
      assert.ok(q.label && q.skill && q.spelling);
      if (q.mode === "flash") {
        assert.ok(q.total >= 1 && q.total <= 6);
        assert.equal(q.answer, String(q.total));
      } else if (q.mode === "make") {
        assert.ok(q.total >= 5 && q.total <= 10);
        assert.equal(q.answer, `make ${q.total}`);
      } else if (q.mode === "hide") {
        assert.ok(q.visible > 0 && q.visible < q.total && q.total <= 20);
        assert.equal(Number(q.answer) + q.visible, q.total);
      } else if (q.mode === "compare") {
        assert.ok(q.left >= 0 && q.right >= 0 && q.left <= 10 && q.right <= 10);
        assert.equal(q.answer, q.left === q.right ? "same" : q.left > q.right ? "left" : "right");
      } else assert.fail(`unknown mode ${q.mode}`);
      if (q.options) {
        assert.equal(q.options.length, 3);
        assert.equal(new Set(q.options.map(String)).size, 3);
        assert.ok(q.options.map(String).includes(q.answer));
      }
    }
    if (id === "g-canopy-run") {
      assert.deepEqual(Array.from(rounds, q => q.mode),
        ["flash", "make", "hide", "compare", "flash", "make", "hide", "compare"]);
      assert.ok(rounds[4].total > rounds[0].total);
      assert.ok(rounds[5].total > rounds[1].total);
    }
  }
});

test("the existing games use the matching Pip artwork", () => {
  const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  assert.ok(app.includes('id="hopperCreature" src="assets/brand/pip-hop-small.webp"'));
  assert.ok(app.includes('class="hopper-creature" src="assets/brand/pip-think-small.webp"'));
  for (const name of ["hop", "listen", "think", "celebrate"]) {
    assert.ok(existsSync(new URL(`../assets/brand/pip-${name}-small.webp`, import.meta.url)));
  }
});
