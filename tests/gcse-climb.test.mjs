import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// The GCSE maths exam climb, stage 1 (Foundation, grade 1 to 3): one question bank makes the online
// practice and the A4 sheets, and every question carries its marks and a mark scheme
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "activities.js", "lessons.js", "paper-sheets.js"].map(read).join("\n"), page);
const A = page.PopActivities, L = page.PopLessons, P = page.PopPaper, X = A.examBank;
const kit = { sheetHead: t => `<h1>${t}</h1>`, brandHead: t => `<h1>${t}</h1>`, handwritingRow: () => "", esc: x => String(x), phonicsWords: () => [] };
const num = s => Number(String(s).replace(/−/g, "-"));

test("the climb has 14 topics in order, each with a lesson, online practice and an exam sheet", () => {
  assert.equal(X.TOPICS.length, 14);
  assert.equal(X.TOPICS.map(t => t.n).join(), Array.from({ length: 14 }, (_, i) => i + 1).join());
  for (const t of X.TOPICS) assert.equal(P.get(`paper-gx-${t.id.slice(3)}`).title, `Exam practice ${t.n}: ${t.title}`, t.id);
  assert.equal(X.STAGES[0].topics, X.TOPICS);
  for (const t of X.TOPICS) {
    const a = A.get(t.id), l = L.get(`lesson-england-gcse-climb-${t.id.slice(3)}`);
    assert.ok(a && a.check === false && /GCSE maths exam climb/.test(a.organiser), t.id);
    assert.ok(l && l.use.includes(t.id), `${t.id} has a lesson`);
    assert.ok(P.forLesson(l.id).length, `${t.id} has an exam sheet`);
  }
  for (const id of ["start-here-baseline-and-plan", "what-the-exam-expects", "mini-papers"]) assert.ok(L.get(`lesson-england-gcse-climb-${id}`), id);
});

test("every bank question has marks, a mark scheme that adds up, and a fair answer", () => {
  for (const t of X.TOPICS) for (const make of t.makers) for (let run = 0; run < 60; run++) {
    const it = make();
    if (!it.q) continue;
    assert.ok([1, 2, 3].includes(it.marks), `${t.id}: ${it.q}`);
    const marks = (it.scheme.match(/\(1 mark/g) || []).length;
    assert.equal(marks, it.marks, `${t.id}: the scheme gives ${marks} of ${it.marks} marks: ${it.scheme}`);
    assert.ok(it.answer !== "" && it.skill && it.label, `${t.id}: ${it.q}`);
    assert.doesNotMatch(it.q + it.answer + it.scheme + (it.options || []).join(), /NaN|undefined|Infinity|null|\.\d{6,}/, `${t.id}: ${it.q}`);
    if (it.options) assert.equal(new Set([it.answer, ...it.options]).size, it.options.length + 1, `${t.id}: ${it.q} ${it.options}`);
  }
});

test("online practice: ten questions a topic, a 28-question baseline in climb order, marks on every question", () => {
  for (let run = 0; run < 30; run++) {
    for (const t of X.TOPICS) {
      const qs = A.get(t.id).make();
      assert.equal(qs.length, 10, t.id);
      for (const q of qs) {
        assert.match(q.prompt, /\[\d marks?/, q.prompt);
        assert.match(q.explain, /^Mark scheme: /);
        if (q.kind === "choice") assert.ok(q.options.includes(q.answer) && new Set(q.options).size === q.options.length, q.prompt);
      }
    }
    const base = A.get("gf-baseline").make();
    assert.equal(base.length, 28);
    assert.equal(base.map(q => parseInt(q.skill, 10)).join(), base.map(q => parseInt(q.skill, 10)).slice().sort((a, b) => a - b).join());
    assert.ok(base.every(q => q.marks === 1 && !q.html));
    assert.equal(A.get("gf-mixed").make().length, 12);
  }
});

test("worked answers check out", () => {
  const T = id => X.topic(id).makers;
  for (let run = 0; run < 200; run++) {
    const eq = T("gf-equations")[2]();
    const [a, b, c, d] = eq.q.replace(/−/g, "-").replace(/ /g, "").match(/^Solve(\d+)x([+-]\d+)?=(\d*)x([+-]\d+)?\.$/).slice(1).map((v, i) => (v === undefined ? 0 : v === "" && i === 2 ? 1 : Number(v)));
    const x = num(eq.answer);
    assert.equal(a * x + b, c * x + d, eq.q);
    const ang = T("gf-angles")[2]();
    assert.equal(ang.q.match(/\d+(?=°)/g).map(Number).reduce((s, v) => s + v, 0) + num(ang.answer), 180, ang.q);
    const pf = T("gf-factors")[5]();
    const n = Number(pf.q.match(/Write (\d+)/)[1]);
    const val = pf.answer.split(" × ").reduce((p, f) => { const [base, pow] = [parseInt(f, 10), "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(f.slice(-1))]; return p * base ** (pow > 0 && f.length > 1 && !/\d$/.test(f) ? pow : 1); }, 1);
    assert.equal(val, n, `${pf.q} ${pf.answer}`);
    const mean = T("gf-statistics")[0](), xs = mean.q.match(/\d+/g).map(Number);
    assert.equal(xs.reduce((s, v) => s + v, 0) / xs.length, num(mean.answer), mean.q);
  }
});

test("sheets: every climb sheet builds, has a mark-scheme answers page and changes between prints", () => {
  const sheets = Object.values(P.sheets).filter(s => s.id.startsWith("paper-gx-"));
  assert.ok(sheets.length >= 20, `${sheets.length} sheets`);
  for (const s of sheets) {
    assert.ok(L.get(s.lesson), `${s.id}'s lesson`);
    const seen = new Set();
    for (let run = 0; run < 25; run++) {
      const b = s.build("Pupil", kit);
      assert.ok(b.pupil.includes("GCSE maths climb") && b.answers, s.id);
      assert.doesNotMatch(b.pupil + b.answers, /undefined|NaN|null|\[object|\.\d{6,}/, s.id);
      seen.add(b.answers);
      const total = b.pupil.match(/Total ___ \/ (\d+)/);
      if (total && /^paper-gx-(?!baseline)/.test(s.id)) {
        const marks = [...b.pupil.matchAll(/\((\d) marks?\)<\/span>/g)].reduce((t, m) => t + Number(m[1]), 0);
        assert.equal(marks, Number(total[1]), `${s.id}: the marks add up to the total`);
      }
    }
    if (!/expects|tracker/.test(s.id)) assert.ok(seen.size > 1, `${s.id} varies`);
  }
});

test("the climb sits with key stage 4 in England's library", () => {
  runInNewContext(read("england.js"), page);
  const E = page.PopEngland;
  for (const id of ["gf-fractions", "paper-gx-fractions", "lesson-england-gcse-climb-fractions", "lesson-england-gcse-climb-mini-papers"]) {
    const w = E.forWork(id);
    assert.ok(w && w.statements.length, id);
    assert.equal(E.bandOf(w), "Key stage 4", id);
  }
});
