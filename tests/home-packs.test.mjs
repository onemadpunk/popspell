import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// Home-school packs (home-data.js, home-packs.js): every pack has lessons, of its own subject, none twice,
// Scotland's packs have no England-only lessons, and every ready lesson is in at least one pack
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [], document: { getElementById: () => null }, addEventListener: () => {} };
page.window = page;
runInNewContext(["words.js", "lessons.js", "england.js", "exam-english/texts.js", "exam-english/gcse.js", "exam-english/sqa.js", "exam-english/bank.js",
  "activities.js", "sheet-print.js", "paper-sheets.js", "home-data.js", "home-packs.js"].map(read).join("\n"), page);
// The teacher area's Scotland view of a lesson (teacher.js viewOf), as the packs use it
page.PopTeacher = { viewOf: (l, cur) => (cur !== "england" && l.cfe ? Object.assign(Object.create(l), { title: l.cfe.title, level: l.cfe.level, codes: l.cfe.codes, criteria: l.cfe.criteria, england: false }) : l) };
const H = page.PopHome, D = page.PopHomeData, L = page.PopLessons;

test("every pack has lessons of its own subject, none twice, and a review every six", () => {
  assert.equal(D.PACKS.length, 48);
  assert.equal(new Set(D.PACKS.map(p => p.id)).size, D.PACKS.length);
  for (const p of D.PACKS) {
    const lessons = H.lessonsFor(p);
    assert.ok(lessons.length >= 5, `${p.id}: ${lessons.length} lessons`);
    assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length, `${p.id} has a lesson twice`);
    for (const l of lessons) assert.equal(l.subject, p.subject, `${p.id}: ${l.id}`);
    if (p.nation === "scotland") for (const l of lessons) assert.ok(!l.england || l.cfe || l.sqa, `${p.id}: England-only ${l.id}`);
    const plan = H.plan(p);
    assert.equal(plan.filter(s => s.kind === "lesson").length, lessons.length);
    assert.equal(plan[plan.length - 1].kind, "final");
    let run = 0;
    for (const s of plan) { run = s.kind === "lesson" ? run + 1 : 0; assert.ok(run <= 6, `${p.id}: more than 6 lessons without a review`); }
  }
});

test("every ready lesson is in a pack", () => {
  const used = new Set(D.PACKS.flatMap(p => H.lessonsFor(p).map(l => l.id)));
  const missing = L.all().filter(l => !used.has(l.id) && !/my-next-step|exam-technique/.test(l.id)).map(l => l.id);
  assert.equal(missing.join(", "), "");
});

test("paper only: no web address or online practice is left", () => {
  assert.equal(H.paperText("Count the pegs. Then play the firefly game on PopSpell. Write the total."), "Count the pegs. Write the total.");
  assert.equal(H.paperText("The three Year 1 grammar sets on PopSpell.", "Do the sheet."), "Do the sheet.");
  const html = H.offline(`<p>Practise at <a href="x">popspell.com/climb.html</a>. Then the online practice for topic 3.</p><th>Online<br>best %</th> Check the board's website for this year's dates.`);
  assert.doesNotMatch(html, /popspell\.com|online|website/i);
});
