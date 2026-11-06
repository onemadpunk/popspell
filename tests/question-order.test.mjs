import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// Every file the activities draw on, loaded as the page loads them
const window = {};
for (const f of ["words.js", "sentences.js", "passages.js", "stories.js", "activities.js"])
  runInNewContext(readFileSync(new URL(`../${f}`, import.meta.url), "utf8"), { window, console }, { filename: f });
const A = window.PopActivities;
// Stories, listening work, the times tables check and the Counting Canopy runs keep a planned order of their own
const keepsOwnOrder = a => a.passage || a.listen || a.id === "n-mtc" || /^g-canopy-run/.test(a.id);

test("activities put their questions in order from easier to harder", () => {
  let checked = 0;
  for (const a of A.all().filter(a => !keepsOwnOrder(a))) {
    let skipped = false;
    for (let run = 0; run < 4; run++) {
      let qs;
      try { qs = a.make(); } catch { skipped = true; break; } // a few games need the page's own spelling engine, which this test does not load
      if (qs.length <= 3) continue;
      const scores = qs.map(A.demand);
      for (let i = 1; i < scores.length; i++) assert.ok(scores[i] >= scores[i - 1], `${a.id}: question ${i + 1} is easier than question ${i}`);
    }
    if (!skipped) checked++;
  }
  assert.ok(checked > 70, `only ${checked} activities were checked`);
});
