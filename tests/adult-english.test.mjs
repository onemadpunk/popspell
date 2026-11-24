import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const window = {};
runInNewContext(readFileSync(new URL("../english-lessons.js", import.meta.url), "utf8"), { window });
const E = window.PopEnglish;
const KINDS = new Set(["talk", "sort", "read", "grammar", "choose", "roleplay", "write"]);

test("every adult lesson is complete", () => {
  const ids = new Set();
  for (const l of E.all()) {
    assert.ok(!ids.has(l.id), `${l.id} is used twice`); ids.add(l.id);
    assert.match(l.id, /^[a-z0-9-]+$/);
    assert.ok(E.LEVELS.includes(l.level), `${l.id} has level ${l.level}`);
    for (const k of ["title", "topic", "focus", "minutes", "aims", "errors", "stretch"]) assert.ok(l[k] && String(l[k]).length, `${l.id} has no ${k}`);
    assert.equal(l.steps.length, 7, `${l.id}: the A4 copies expect 7 steps`);
    assert.equal(l.steps.reduce((t, s) => t + s.minutes, 0), l.minutes, `${l.id}: step minutes add up to the lesson's`);
    for (const s of l.steps) {
      assert.ok(KINDS.has(s.type), `${l.id}: unknown step type ${s.type}`);
      assert.ok(s.title && s.note && s.minutes, `${l.id} ${s.title}: title, note and minutes`);
    }
  }
});

test("every task has a right answer the page accepts", () => {
  for (const l of E.all()) for (const s of l.steps) {
    if (s.type === "sort") {
      const words = Object.values(s.groups).flat();
      assert.equal(new Set(words).size, words.length, `${l.id}: a sort word is in two groups`);
      assert.ok(Object.values(s.groups).every(g => g.length <= 4), `${l.id}: the A4 sort table has 4 rows`);
    }
    if (s.type === "read") for (const [st, t, why] of s.items) assert.ok(st && typeof t === "boolean" && why);
    if (s.type === "choose") for (const [st, opts, r] of s.items) {
      assert.match(st, /___/); assert.ok(Number.isInteger(r) && opts[r], `${l.id}: "${st}" has no right option`);
    }
    if (s.type === "grammar") for (const item of s.items) {
      assert.equal(item.text.split("{}").length - 1, item.answers.length, `${l.id}: "${item.text}" gaps and answers differ`);
      for (const a of item.answers) assert.ok(E.accepts(a, a[0]));
    }
  }
});

test("typed answers: case, apostrophes, spaces and a full stop don't matter", () => {
  const a = ["isn't going to stay", "is not going to stay"];
  assert.ok(E.accepts(a, "Isn’t  going to stay."));
  assert.ok(E.accepts(a, "is not going to stay"));
  assert.ok(E.accepts(["'re going to take"], " 're going to take"));
  assert.ok(!E.accepts(a, "isn't going to staying"));
  assert.ok(!E.accepts(a, ""));
});
