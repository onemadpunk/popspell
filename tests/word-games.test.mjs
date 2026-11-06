import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "word-clues.js", "activities.js"].map(read).join("\n"), page);
const A = page.PopActivities;
const dictionary = new Set(read("assets/words/dictionary.txt").split("\n").filter(Boolean));
const listWords = new Set(page.SPELLING_LISTS.concat(page.ENGLAND_LISTS).flatMap(st => st.lists.flatMap(l => l.words.map(w => w.replace(/-$/, "")))));
const runs = (id, n = 40) => Array.from({ length: n }, () => A.get(id).make());

test("every word game is in the plain word-games area with CfE outcomes", () => {
  const area = A.AREAS.find(a => a.id === "word-games");
  assert.ok(area.activities.length >= 15);
  for (const act of area.activities) {
    assert.equal(A.tag(act.id).game, true);
    assert.ok(A.tag(act.id).eo.length, `${act.id} has outcomes`);
    assert.ok(["Second", "Third"].includes(act.level), `${act.id} is for older pupils`);
  }
});

test("word clues are for list words, with one gap and no giveaway", () => {
  for (const level of ["second", "third"]) for (const [word, [meaning, use]] of Object.entries(page.WORD_CLUES[level])) {
    assert.ok(listWords.has(word), `${word} is in a spelling list`);
    assert.equal(use.split("___").length, 2, `${word}: one gap`);
    assert.ok(!meaning.toLowerCase().includes(word), `${word}: the meaning doesn't say the word`);
    assert.ok(!use.toLowerCase().replace("___", "").includes(word), `${word}: the sentence doesn't say the word`);
  }
});

test("the word list accepts every list word and leaves out rude words", () => {
  for (const w of listWords) if (/^[a-z]{3,}$/.test(w)) assert.ok(dictionary.has(w), w);
  for (const w of ["shit", "fuck", "bitch", "wanker", "cunt"]) assert.ok(!dictionary.has(w), w);
  for (const w of ["grape", "scrape", "colour", "favourite"]) assert.ok(dictionary.has(w), w);
});

test("Code Word uses list words of the right length, with a spelling tip", () => {
  for (const [id, ok] of [["w-code-5", w => w.length === 5], ["w-code-6", w => w.length === 6], ["w-code-long", w => w.length >= 7 && w.length <= 8]]) {
    for (const qs of runs(id)) {
      assert.equal(qs.length, 5);
      for (const q of qs) { assert.ok(ok(q.answer), `${id}: ${q.answer}`); assert.ok(listWords.has(q.answer)); assert.ok(q.tip); assert.equal(q.length, q.answer.length); }
      assert.equal(new Set(qs.map(q => q.answer)).size, 5);
    }
  }
});

test("Letter Hunt words all have a meaning and a sentence", () => {
  for (const id of ["w-hunt-second", "w-hunt-third"]) for (const qs of runs(id)) {
    assert.equal(qs.length, 6);
    for (const q of qs) { assert.ok(q.meaning && q.use.includes("___")); assert.ok(q.misses >= 6); }
  }
});

test("Word Sort sets put every word in exactly one known group", () => {
  for (const id of ["w-sort-types", "w-sort-meaning", "w-sort-spelling"]) for (const qs of runs(id, 10)) {
    assert.equal(qs.length, 4);
    for (const q of qs) {
      assert.equal(new Set(q.words.map(w => w.word)).size, q.words.length, `${q.label}: no repeats`);
      q.words.forEach(w => assert.ok(w.bin >= 0 && w.bin < q.bins.length));
      q.bins.forEach((_, i) => assert.ok(q.words.some(w => w.bin === i), `${q.label}: every group is used`));
    }
    qs.slice(1).forEach((q, i) => assert.ok(qs[i].diff <= q.diff, "easy to hard"));
  }
});

test("every Clue Crossword is a real crossword: words cross, never clash and never touch side by side", () => {
  for (const id of ["w-cross-second", "w-cross-third"]) for (const qs of runs(id, 30)) {
    const { puzzle } = qs[0];
    assert.ok(puzzle.words.length >= 5, `${id}: ${puzzle.words.length} words`);
    assert.equal(qs.length, puzzle.words.length);
    const grid = new Map();
    const owners = new Map();
    puzzle.words.forEach((w, k) => [...w.word].forEach((ch, i) => {
      const key = `${w.down ? w.r + i : w.r},${w.down ? w.c : w.c + i}`;
      if (grid.has(key)) assert.equal(grid.get(key), ch, `clash at ${key}`);
      grid.set(key, ch);
      owners.set(key, (owners.get(key) || []).concat(k));
      assert.ok(w.r + (w.down ? w.word.length : 1) <= puzzle.size.rows && w.c + (w.down ? 1 : w.word.length) <= puzzle.size.cols);
    }));
    // every word crosses another
    puzzle.words.forEach((w, k) => assert.ok([...owners.values()].some(o => o.length > 1 && o.includes(k)), `${w.word} crosses another word`));
    // reading across or down the grid only ever gives the placed words (or single letters)
    const placed = new Set(puzzle.words.map(w => `${w.down ? "d" : "a"}${w.word}`));
    for (const down of [false, true]) {
      for (let a = 0; a < (down ? puzzle.size.cols : puzzle.size.rows); a++) {
        let run = "";
        for (let b = 0; b <= (down ? puzzle.size.rows : puzzle.size.cols); b++) {
          const ch = grid.get(down ? `${b},${a}` : `${a},${b}`);
          if (ch) run += ch; else { if (run.length > 1) assert.ok(placed.has(`${down ? "d" : "a"}${run}`), `stray run ${run}`); run = ""; }
        }
      }
    }
    const numbers = puzzle.words.map(w => w.number);
    assert.ok(numbers.every(n => n >= 1));
  }
});
