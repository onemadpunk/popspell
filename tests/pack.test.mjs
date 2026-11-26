import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// The downloadable packs (pack.html): each stage of the GCSE maths climb as one pack, built from the
// Library's sheets: a cover with a plan, every sheet in study order, then the answers, all one pack code
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [], document: { getElementById: () => null }, addEventListener: () => {} };
page.window = page;
runInNewContext(["words.js", "activities.js", "sheet-print.js", "paper-sheets.js", "pack.js"].map(read).join("\n"), page);
const K = page.PopPacks, P = page.PopPaper;

test("every GCSE, SQA and A level maths climb stage has a pack, and every sheet it names exists", () => {
  const stages = K.stages();
  assert.equal(stages.map(st => st.id).join(), "gcse-1,gcse-2,gcse-3,sqa-1,sqa-2,sqa-3,sqa-4,alevel-1,alevel-2");
  for (const st of stages) {
    assert.equal(st.topics.length, 14, st.id);
    assert.equal(st.papers.length, 3, st.id);
    for (const id of K.sheetsOf(st)) assert.ok(P.get(id), `${st.id}: ${id}`);
  }
});

test("a pack has a plan, the work in study order and an answers section, all with one code", () => {
  for (const st of K.stages()) {
    const made = K.make(st, "Sam");
    assert.match(made.code, /^\d{6}-[A-Z0-9]{3}$/);
    assert.equal(made.parts.length, K.sheetsOf(st).length);
    assert.equal(made.parts[0].id, st.id.startsWith("sqa") ? "paper-sq-route" : st.id.startsWith("alevel") ? "paper-al-route" : "paper-gx-route");
    assert.ok(made.parts.findIndex(p => p.id === st.check) < made.parts.findIndex(p => p.id === st.topics[0]), "check before the topics");
    assert.equal(made.parts.at(-1).id, st.papers.at(-1));
    // Every topic and paper has its answers, and the cover lists every part to tick off
    for (const p of made.parts.filter(p => st.topics.includes(p.id) || st.papers.includes(p.id) || p.id === st.check)) assert.ok(p.answers, `${st.id} ${p.id} answers`);
    for (const p of made.parts) assert.ok(made.cover.includes(`<td class="pk-n">${p.n}</td>`), `${st.id} plan has part ${p.n}`);
    const all = K.pagesOf(made, "all"), work = K.pagesOf(made, "work"), answers = K.pagesOf(made, "answers");
    assert.equal(all.length, work.length + answers.length);
    assert.equal(work.length, made.parts.length + 1);
    assert.ok(all.every(h => h.includes(`Pack ${made.code}`)), "every page carries the pack code");
    assert.ok(answers.every(h => h.includes("ws-adult")) && work.every(h => !h.includes("ws-adult")));
    assert.ok(work.slice(1).every(h => h.includes("Sam")), "the name is on every sheet");
  }
});

test("two packs have different codes, so their answers can't be mixed up", () => {
  const st = K.stages()[0];
  assert.notEqual(K.make(st, "").code, K.make(st, "").code);
});
