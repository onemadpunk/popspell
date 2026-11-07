import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const page = {};
runInNewContext(readFileSync(new URL("../speech-text.js", import.meta.url), "utf8"), page);
const S = page.PopSpeech;
const said = line => [...S.pieces(line)].map(p => p.text || (p.letters ? `[${p.letters}]` : [...p.number].join(" ")));

test("big numbers written with spaces are read as one number, millions too", () => {
  assert.deepEqual(said(S.speakable("9 168 ÷ 24 =")), ["9 thousand 1 hundred and 60 8", "divided by", "20 4", "makes what?"]);
  assert.deepEqual(said("A city has 4 764 092 people."), ["A city has", "4 million 7 hundred and 60 4 thousand and 90 2", "people."]);
  assert.deepEqual(said("It is 2 000 000."), ["It is", "2 million"]);
  assert.deepEqual(said("1 000 050"), ["1 million and 50"]);
  assert.equal(S.pieces("1000000000"), null, "past 999 999 999 the device voice says it");
});

test("Roman numerals are said letter by letter", () => {
  assert.deepEqual(said("What number is XLII?"), ["What number is", "[xlii]"]);
  assert.deepEqual(said("I equals 1, CM equals 900"), ["I equals", "1", "[cm]", "equals", "9 hundred"]);
});

test("powers are read out", () => {
  assert.equal(S.speakable("10⁴"), "10 to the power 4");
  assert.equal(S.speakable("10⁻³"), "10 to the power minus 3");
  assert.equal(S.speakable("5²"), "5 squared");
});
