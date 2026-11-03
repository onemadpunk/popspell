import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const root = new URL("../", import.meta.url);
const read = name => readFileSync(new URL(name, root), "utf8");
const browser = {};
browser.window = browser;
browser.document = { getElementById: () => ({}) };
browser.localStorage = { getItem: () => null };
browser.__popspell_audio_scan = true;
for (const file of ["words.js", "sentences.js", "passages.js", "stories.js",
  "speech-text.js", "audio/index.js", "app.js", "activities.js"])
  runInNewContext(read(file), browser, { filename: file });

const { PopSpell, PopActivities, PopSpeech, POPSPELL_AUDIO: recorded } = browser;

test("the audio generator uses PopSpell's real phonics and can build every activity", () => {
  assert.ok(Object.keys(PopSpell.LISTS).length >= 60);
  assert.deepEqual(Array.from(PopSpell.analyse("shop").tokens), ["sh", "o", "p"]);
  for (const activity of PopActivities.all()) {
    for (let i = 0; i < 3; i++)
      assert.doesNotThrow(() => activity.make(), "cannot generate " + activity.id);
  }
  for (const id of ["l-rhyme", "l-first-sound", "l-count-sounds"])
    assert.ok(PopActivities.get(id).make().length, "early listening must be recorded: " + id);
});

test("spoken numbers support grouped thousands, millions and decimals", () => {
  assert.deepEqual(Array.from(PopSpeech.numberParts("10 000 000")), ["10", "million"]);
  assert.deepEqual(Array.from(PopSpeech.numberParts("1 234 567")),
    ["1", "million", "2", "hundred", "and", "30", "4", "thousand",
      "5", "hundred", "and", "60", "7"]);
  assert.deepEqual(Array.from(PopSpeech.numberParts("0.25")), ["0", "point", "2", "5"]);
  const parts = PopSpeech.pieces("Which is bigger: 1 000 000 or 2 000 000?");
  assert.equal(parts.filter(part => part.number).length, 2);
});

test("random lesson speech is assembled from Eponine, not the device voice", () => {
  const app = read("app.js");
  const start = app.indexOf("  function lineSteps(text) {");
  const end = app.indexOf("\n  const sayLine =", start);
  assert.ok(start >= 0 && end > start, "voice resolver can be inspected");
  const source = "(function(window, recPhrases, recWords, recLines, RECORDED, " +
    "recNumbers, recSentenceByText, wordClip, letterSteps) {\n" +
    app.slice(start, end) + "\nreturn lineSteps;\n})";
  const makeResolver = runInNewContext(source, browser);
  // New words/phrases/numbers are created by tools/make_audio.py when merged.
  const extraWords = ["apple", "bed", "cat", "dog", "egg", "fish", "goat", "hat",
    "jam", "kite", "leg", "mop", "nut", "pig", "sun", "van"];
  const extraPhrases = ["alphabet-order", "roman-equals", "answer-is",
    "rhyme-ending", "starts-with", "has", "sounds"];
  const sentenceAudio = new Map(Object.entries(browser.SENTENCES)
    .filter(([word]) => recorded.sentences.includes(word))
    .map(([word, sentence]) => [PopSpeech.said(sentence), "audio/sentences/" + word + ".mp3"]));
  const resolver = makeResolver(browser,
    new Set([...recorded.phrases, ...extraPhrases]),
    new Set([...recorded.words, ...extraWords]), new Set(recorded.lines),
    recorded, new Set([...recorded.numbers, "million"]), sentenceAudio,
    word => "audio/words/" + word.toLowerCase() + ".mp3",
    chars => chars.toLowerCase().split("").flatMap((c, i) =>
      i ? [150, "audio/letters/" + c + ".mp3"] : ["audio/letters/" + c + ".mp3"]));
  for (const speech of [
    "Which word comes first in alphabetical order: jam, pig, nut?",
    'The answer is wreck. wren starts with "wr".',
    "The answer is pig. big rhymes with words ending in -ig.",
    "The answer is 3. throw: th · r · ow — 3 sounds.",
    "The answer is DCCLIV. 754 equals DCCLIV. D equals 500, M equals 1000.",
    "The answer is We made pots from clay. A sentence starts with a capital letter and ends with a full stop."
  ]) {
    const steps = resolver(speech);
    assert.ok(steps && steps.some(s => typeof s === "string" && s.endsWith(".mp3")),
      "missing Eponine audio for " + speech);
  }
});