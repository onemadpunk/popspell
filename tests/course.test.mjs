import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// The tutor course (course.html): GCSE maths grade 1 to 3 as 60 sessions, made from the climb's
// question bank: every teaching session's skills exist in the bank, every mock paper is 80 marks
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [], document: { getElementById: () => null }, addEventListener: () => {} };
page.window = page;
runInNewContext(["activities.js", "sheet-print.js", "paper-sheets.js", "course-data.js", "course.js"].map(read).join("\n"), page);
const C = page.PopCourse, D = page.PopCourseData, X = page.PopActivities.examBank, P = page.PopPaper;
const course = D.get("gcse-1-3");

test("60 sessions, and every teaching session names skills the bank has", () => {
  assert.equal(course.sessions.length, course.weeks * course.perWeek);
  const skills = {};
  for (const t of X.TOPICS) { skills[t.id] = new Set(); for (const m of t.makers) for (let i = 0; i < 40; i++) { const it = m(); if (it.q) skills[t.id].add(it.skill); } }
  const taught = new Set();
  for (const s of course.sessions) {
    assert.ok(s.t && s.aim && s.keys && s.keys.length, s.t);
    for (const id of s.sheets || []) assert.ok(P.get(id), `${s.t}: ${id}`);
    for (const id of s.topics || []) assert.ok(X.topic(id), `${s.t}: ${id}`);
    if ((s.kind || "teach") !== "teach") continue;
    for (const [id, list] of s.from) for (const sk of list) { assert.ok(skills[id] && skills[id].has(sk), `${s.t}: ${id} has no "${sk}"`); taught.add(`${id}:${sk}`); }
  }
  // Every kind of question in the grade 1 to 3 bank is taught somewhere
  for (const [id, set] of Object.entries(skills)) for (const sk of set) assert.ok(taught.has(`${id}:${sk}`), `nothing teaches ${id}: ${sk}`);
  // The four progress checks cover all 14 topics
  assert.equal(new Set(course.sessions.filter(s => s.kind === "check").flatMap(s => s.topics)).size, 14);
});

test("a made course: full teaching sessions, 80-mark mock papers with no repeats in a set, and one code on every page", () => {
  for (let run = 0; run < 3; run++) {
    const made = C.make("gcse-1-3", "Sam", { start: new Date("2026-12-01T12:00:00"), perWeek: 2 });
    assert.match(made.code, /^\d{6}-[A-Z0-9]{3}$/);
    for (const m of made.sessions.filter(m => m.s.kind === "teach" || !m.s.kind)) {
      assert.equal(m.starter.length, 4, m.s.t);
      assert.ok(m.example, m.s.t);
      assert.equal(m.practice.length, 8, m.s.t);
      assert.equal(m.exam.length, 2, m.s.t);
      assert.equal(m.exit.length, 3, m.s.t);
      const labels = [m.example, ...m.starter, ...m.practice, ...m.exam, ...m.exit].map(it => it.label);
      assert.equal(new Set(labels).size, labels.length, `${m.s.t}: a question repeats`);
    }
    for (const set of ["A", "B"]) {
      const papers = [1, 2, 3].map(n => made.mocks[`${set}${n}`]);
      for (const p of papers) {
        assert.equal(p.items.reduce((t, it) => t + it.marks, 0), 80, `${set}${p.n}`);
        assert.ok(p.items.length >= 28 && p.items.length <= 50, `${set}${p.n}: ${p.items.length} questions`);
        if (!p.calc) assert.ok(p.items.every(it => !it.calc), "paper 1 is non-calculator");
      }
      const labels = papers.flatMap(p => p.items.map(it => it.label));
      assert.equal(new Set(labels).size, labels.length, `set ${set} repeats a question`);
    }
    assert.equal(made.sessions[2].date, "Tue 8 Dec");
    const all = C.pagesOf(made, "all", "tutor"), pupil = C.pagesOf(made, "all", "pupil");
    assert.ok(all.every(h => h.includes(`Course ${made.code}`)), "every page carries the course code");
    assert.ok(pupil.every(h => !h.includes("ws-adult")), "the pupil's copy has no tutor pages");
    assert.ok(pupil.length < all.length);
  }
});
