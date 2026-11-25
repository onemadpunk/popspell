import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// The GCSE English exam climb: one bank (exam-english/) makes the online practice, the My next step
// page and the A4 sheets. Every question's quoted lines must be in its text, as the screen marks them.
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "exam-english/texts.js", "exam-english/gcse.js", "exam-english/sqa.js", "exam-english/bank.js", "activities.js", "lessons.js", "paper-sheets.js"].map(read).join("\n"), page);
const A = page.PopActivities, L = page.PopLessons, P = page.PopPaper, X = page.PopEnglishExam, C = X.course("gcse");
const kit = { sheetHead: t => `<h1>${t}</h1>`, brandHead: t => `<h1>${t}</h1>`, handwritingRow: () => "", esc: x => String(x), phonicsWords: () => [] };
const topics = X.stagesOf(C).flatMap(st => st.topics);

test("three stages of eight topics, plus Literature, each with online practice, a lesson and an exam sheet", () => {
  assert.equal(C.STAGES.map(s => s.topics.length).join(), "8,8,8");
  assert.equal(C.LIT.topics.length, 4);
  for (const t of topics) {
    assert.ok(A.get(t.id) && A.get(t.id).check === false, `${t.id} online`);
    const l = L.get(`lesson-england-english-climb-${t.id}`);
    assert.ok(l && l.use.includes(t.id), `${t.id} lesson`);
    assert.ok(P.get(`paper-ex-${t.id}`), `${t.id} sheet`);
    assert.equal(P.get(`paper-ex-${t.id}`).lesson, l.id);
  }
  for (const st of C.STAGES) for (const id of [`${st.key}-check`, `${st.key}-mixed`]) assert.ok(A.get(id), id);
});

test("every question has one right answer, different options, a reason, and quoted lines that are in its text", () => {
  for (const t of topics) for (const it of t.items) {
    const all = [it.a].concat(it.o);
    assert.equal(new Set(all).size, all.length, `${t.id}: ${it.q}`);
    assert.ok(it.o.length >= 2 && it.why, `${t.id}: ${it.q}`);
    if (it.t) assert.ok(X.text(it.t), `${t.id}: no text ${it.t}`);
    if (it.x) {
      assert.ok(it.t && X.text(it.t).text.includes(it.x), `${t.id}: "${it.x}" isn't in ${it.t}`);
      assert.ok(!/\n/.test(it.x), `${t.id}: quoted lines run over a paragraph`);
    }
  }
});

test("each topic's exam question has a model, and reading questions have levels and texts that exist", () => {
  for (const t of topics) {
    const w = t.written;
    assert.ok(w && w.q && w.model, t.id);
    for (const id of w.texts || (w.t ? [w.t] : [])) assert.ok(X.text(id), `${t.id}: ${id}`);
    if (!w.kind) assert.ok(w.levels.length && w.look.length && w.marks > 0, t.id);
  }
});

test("writing tasks and mini papers point at things that exist, and every sheet builds", () => {
  assert.equal(C.WRITING.length, 6);
  for (const m of C.MINI) for (const p of m.parts) {
    if (p.ref) assert.ok(X.topic(p.ref), `${m.id}: ${p.ref}`);
    if (p.write) assert.ok(C.WRITING.some(w => w.id === p.write), `${m.id}: ${p.write}`);
    if (p.tf) assert.equal(p.statements.filter(s => s[1]).length, 4, `${m.id}: four true statements`);
  }
  const ex = Object.values(P.sheets).filter(s => s.id.startsWith("paper-ex-") && s.lesson.startsWith("lesson-england-"));
  assert.equal(ex.length, 28 + 3 * 3 + 6 + 6 + 2);
  for (const s of ex) for (let i = 0; i < 3; i++) {
    const b = s.build("Pupil", kit);
    assert.ok(b.pupil && b.answers && !/undefined|NaN/.test(b.pupil + b.answers), s.id);
  }
});

test("a stage check asks every topic of its stage, and the online sets are the app's own questions", () => {
  for (const st of C.STAGES) {
    const q = X.check(st.key);
    assert.equal(q.length, st.topics.length * (st.n === 1 ? 2 : 1));
    assert.equal([...new Set(q.map(it => it.topic.id))].join(), st.topics.map(t => t.id).join());
  }
  const set = A.get("e1-retrieve").make();
  assert.equal(set.length, 8);
  for (const q of set) assert.ok(q.exam && q.explain, "exam question with its reason");
});

// Scotland's climb: National 4 skills, National 5, Higher (exam-english/sqa.js, sheets/15-sqa-english-climb.js)
const S = X.course("sqa"), sTopics = X.stagesOf(S).flatMap(st => st.topics);

test("SQA: three stages of eight topics, each with online practice, a lesson and an exam sheet, in its own Library area", () => {
  assert.equal(S.STAGES.map(s => s.topics.length).join(), "8,8,8");
  const area = A.AREAS.find(a => a.id === "english-exam-sqa");
  assert.ok(area && area.assignedOnly);
  for (const t of sTopics) {
    assert.ok(A.get(t.id) && A.get(t.id).area === "english-exam-sqa" && A.get(t.id).level === "Senior", `${t.id} online`);
    const l = L.get(`lesson-sqa-english-climb-${t.id}`);
    assert.ok(l && l.use.includes(t.id) && l.sqa, `${t.id} lesson`);
    assert.equal(P.get(`paper-ex-${t.id}`).lesson, l.id);
  }
  assert.ok(A.AREAS.find(a => a.id === "english-exam").activities.every(a => !/^en[45h]-/.test(a.id)), "GCSE area has only GCSE");
});

test("SQA: every question has one right answer, different options, a reason, and quoted lines that are in its text", () => {
  for (const t of sTopics) {
    for (const it of t.items) {
      const all = [it.a].concat(it.o);
      assert.equal(new Set(all).size, all.length, `${t.id}: ${it.q}`);
      assert.ok(it.o.length >= 2 && it.why, `${t.id}: ${it.q}`);
      if (it.t) assert.ok(X.text(it.t), `${t.id}: no text ${it.t}`);
      if (it.x) {
        assert.ok(it.t && X.text(it.t).text.includes(it.x), `${t.id}: "${it.x}" isn't in ${it.t}`);
        assert.ok(!/\n/.test(it.x), `${t.id}: quoted lines run over a paragraph`);
      }
    }
    const w = t.written;
    assert.ok(w && w.q && w.model, t.id);
    for (const id of w.texts || (w.t ? [w.t] : [])) assert.ok(X.text(id), `${t.id}: ${id}`);
    if (!w.kind) assert.ok(w.levels.length && w.look.length && w.marks > 0, t.id);
  }
});

test("SQA: folio tasks, mini papers and every sheet build", () => {
  assert.equal(S.WRITING.length, 6);
  assert.ok(S.WRITING.every(w => w.marks === 15 && S.STAGES.some(st => st.key === w.stage)));
  for (const m of S.MINI) for (const p of m.parts) {
    if (p.ref) assert.ok(X.topic(p.ref) && X.topic(p.ref).written.marks > 0, `${m.id}: ${p.ref}`);
    else assert.ok(p.q && p.marks > 0 && p.look, `${m.id}: ${p.q}`);
  }
  const ex = Object.values(P.sheets).filter(s => s.lesson.startsWith("lesson-sqa-english-climb-"));
  assert.equal(ex.length, 24 + 3 * 3 + 6 + 6 + 2);
  for (const s of ex) for (let i = 0; i < 3; i++) {
    const b = s.build("Pupil", kit);
    assert.ok(b.pupil && b.answers && !/undefined|NaN/.test(b.pupil + b.answers), s.id);
  }
  for (const st of S.STAGES) assert.equal(X.check(st.key).length, st.topics.length * (st.n === 1 ? 2 : 1));
});
