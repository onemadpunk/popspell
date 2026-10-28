import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const examples = {
  "short-a": [["cat", ["c", "a", "t"]], ["bag", ["b", "a", "g"]]],
  "short-e": [["bed", ["b", "e", "d"]], ["hen", ["h", "e", "n"]]],
  "short-i": [["bin", ["b", "i", "n"]], ["pig", ["p", "i", "g"]]],
  "short-o": [["dog", ["d", "o", "g"]], ["cot", ["c", "o", "t"]]],
  "short-u": [["cup", ["c", "u", "p"]], ["sun", ["s", "u", "n"]]],
  sh: [["ship", ["sh", "i", "p"]], ["fish", ["f", "i", "sh"]], ["shop", ["sh", "o", "p"]], ["wish", ["w", "i", "sh"]], ["shed", ["sh", "e", "d"]], ["cash", ["c", "a", "sh"]]],
  ch: [["chip", ["ch", "i", "p"]], ["rich", ["r", "i", "ch"]], ["chat", ["ch", "a", "t"]]],
  th: [["thin", ["th", "i", "n"]], ["moth", ["m", "o", "th"]], ["bath", ["b", "a", "th"]]],
  ai: [["rain", ["r", "ai", "n"]], ["sail", ["s", "ai", "l"]], ["mail", ["m", "ai", "l"]]],
  ay: [["play", ["p", "l", "ay"]], ["stay", ["s", "t", "ay"]], ["tray", ["t", "r", "ay"]]],
  "a-e": [["cake", ["c", "a_e", "k"]], ["make", ["m", "a_e", "k"]], ["snake", ["s", "n", "a_e", "k"]]]
};
const LISTS = Object.fromEntries(Object.entries(examples).map(([id, words]) => [id, {
  items: words.map(([spelling, tokens]) => ({ spelling, tokens, whole: false }))
}]));
const browser = { window: { PopSpell: { LISTS }, PASSAGES: [], STORIES: [] } };
runInNewContext(readFileSync(new URL("../activities.js", import.meta.url), "utf8"), browser);
const catalogue = browser.window.PopActivities;

test("each Sound Hopper level has six heard words with a valid choice for every sound", () => {
  for (const id of ["g-hopper-short", "g-hopper-digraphs", "g-hopper-long-a"]) {
    const game = catalogue.get(id);
    assert.ok(game, id);
    assert.equal(catalogue.tag(id).area, "games");
    const questions = game.make();
    assert.equal(questions.length, 6);
    for (const q of questions) {
      assert.equal(q.kind, "map");
      assert.equal(q.say.word, q.answer);
      assert.ok(!q.prompt.includes(q.answer), "the spelling must stay hidden during the question");
      assert.equal(q.optionsBySlot.length, q.tokens.length);
      q.tokens.forEach((token, i) => assert.ok(q.optionsBySlot[i].includes(token)));
    }
  }
});

test("digraph and split-digraph rounds offer meaningful alternatives", () => {
  const questions = catalogue.get("g-hopper-long-a").make();
  const vowelChoices = questions.flatMap(q => q.tokens.map((token, i) => ({ token, choices: q.optionsBySlot[i] })))
    .filter(({ token }) => ["ai", "ay", "a_e"].includes(token));
  assert.ok(vowelChoices.length > 0);
  for (const { token, choices } of vowelChoices) {
    assert.equal(choices.length, 3);
    assert.ok(choices.includes(token));
    assert.ok(choices.some(choice => choice !== token));
  }
});
