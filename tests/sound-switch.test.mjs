import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const phonics = appSource.slice(appSource.indexOf("  const R_GRAPHEMES ="), appSource.indexOf("  const label ="));
assert.ok(phonics.includes("function analyse(entry)"), "the test uses PopSpell's real sound mapper");
const makeAnalyse = runInNewContext(`(function(R_SOUNDED) { const SENTENCES = {}; const TRICKY_WORDS = new Set(); ${phonics} return analyse; })`);
const activitySource = readFileSync(new URL("../activities.js", import.meta.url), "utf8");
const audioSource = readFileSync(new URL("../audio/index.js", import.meta.url), "utf8");
const audio = { window: {} };
runInNewContext(audioSource, audio);
const recorded = new Set(audio.window.POPSPELL_AUDIO.words);

for (const soundedR of [true, false]) {
  test(`Sound Switch has six playable one-sound changes with ${soundedR ? "Scottish" : "English"} r`, () => {
    const browser = { window: { PopSpell: { analyse: makeAnalyse(soundedR), LISTS: {} }, PASSAGES: [], STORIES: [] } };
    runInNewContext(activitySource, browser);
    const catalogue = browser.window.PopActivities;
    for (const id of ["g-switch-first", "g-switch-digraphs", "g-switch-build"]) {
      const game = catalogue.get(id);
      assert.ok(game, id);
      assert.equal(catalogue.tag(id).area, "games");
      const questions = game.make();
      assert.equal(questions.length, 6);
      for (const q of questions) {
        assert.equal(q.kind, "switch");
        assert.equal(q.after.join(""), q.answer);
        assert.equal(q.before.join(""), q.source);
        assert.ok(recorded.has(q.source), `recorded source word: ${q.source}`);
        assert.ok(recorded.has(q.answer), `recorded target word: ${q.answer}`);
        if (q.action === "swap") {
          assert.equal(q.before.length, q.after.length);
          assert.equal(q.before.filter((sound, i) => sound !== q.after[i]).length, 1);
          assert.equal(q.after[q.index], q.answerSound);
        } else if (q.action === "add") {
          assert.equal(q.after.length, q.before.length + 1);
          const copy = [...q.after]; copy.splice(q.index, 1);
          assert.equal(copy.join("/"), q.before.join("/"));
        } else {
          assert.equal(q.before.length, q.after.length + 1);
          const copy = [...q.before]; copy.splice(q.index, 1);
          assert.equal(copy.join("/"), q.after.join("/"));
        }
        if (q.action !== "remove") assert.ok(q.choices.includes(q.answerSound));
      }
    }
  });
}
