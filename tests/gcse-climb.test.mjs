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

test("stages 2 and 3: 14 topics each, in order, with a lesson, online practice, an exam sheet, a check and mini papers", () => {
  assert.equal(X.STAGES.map(st => `${st.n}:${st.key}:${st.topics.length}`).join(), "1:gf:14,2:g5:14,3:gh:14");
  assert.equal(X.ALL.length, 42);
  for (const st of X.STAGES.slice(1)) {
    const tag = st.n === 2 ? "grades 4 and 5" : "Higher";
    st.topics.forEach((t, i) => {
      assert.equal(t.n, i + 1, t.id);
      assert.ok(t.id.startsWith(`${st.key}-`), t.id);
      const slug = t.id.slice(3), a = A.get(t.id), l = L.get(`lesson-england-gcse-climb-${st.key}-${slug}`);
      assert.equal(P.get(`paper-gx-${st.key}-${slug}`).title, `Exam practice (${tag}) ${t.n}: ${t.title}`, t.id);
      assert.ok(a && a.check === false && /GCSE maths exam climb/.test(a.organiser), t.id);
      assert.ok(l && l.use.includes(t.id) && P.forLesson(l.id).length, `${t.id} has a lesson with its sheet`);
    });
    for (const id of ["check", "tracker", "expects", "mini-noncalc", "mini-calc", "mini-problems"]) assert.ok(P.get(`paper-gx-${st.key}-${id}`), `${st.key} ${id}`);
    for (const id of ["start-here", "what-the-exam-expects", "mini-papers"]) assert.ok(L.get(`lesson-england-gcse-climb-${st.key}-${id}`), `${st.key} ${id}`);
    assert.equal(A.get(`${st.key}-check`).make().length, 14);
    assert.equal(A.get(`${st.key}-mixed`).make().length, 12);
  }
  assert.ok(P.get("paper-gx-route") && L.get("lesson-england-gcse-climb-my-next-step"));
});

test("every bank question has marks, a mark scheme that adds up, and a fair answer", () => {
  for (const t of X.ALL) for (const make of t.makers) for (let run = 0; run < 60; run++) {
    const it = make();
    if (!it.q) continue;
    assert.ok([1, 2, 3].includes(it.marks), `${t.id}: ${it.q}`);
    const marks = (it.scheme.match(/\(1 mark/g) || []).length;
    assert.equal(marks, it.marks, `${t.id}: the scheme gives ${marks} of ${it.marks} marks: ${it.scheme}`);
    assert.ok(it.answer !== "" && it.skill && it.label, `${t.id}: ${it.q}`);
    assert.doesNotMatch([it.q, it.answer, it.scheme, ...(it.options || [])].join(" | "), /NaN|undefined|Infinity|null|\.\d{6,}/, `${t.id}: ${it.q}`);
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

test("worked answers check out at grades 4 to 9", () => {
  const T = id => X.topic(id).makers;
  for (let run = 0; run < 200; run++) {
    const sim = T("g5-solving")[2](), [x, y] = sim.answer.replace(/−/g, "-").match(/-?\d+/g).map(Number);
    for (const eq of sim.q.replace(/−/g, "-").match(/[^:]*?=\s*-?\d+/g).map(e => e.replace(/^.*?equations |^ and /, ""))) {
      const [lhs, rhs] = eq.split("="), val = lhs.replace(/ /g, "").match(/[+-]?\d*[xy]/g).reduce((t, term) => {
        const c = term.slice(0, -1), k = c === "" || c === "+" ? 1 : c === "-" ? -1 : Number(c); return t + k * (term.endsWith("x") ? x : y); }, 0);
      assert.equal(val, Number(rhs), `${sim.q} ${sim.answer}`);
    }
    const qf = T("gh-quadratics")[2](), [, b, c] = qf.q.replace(/−/g, "-").replace(/ /g, "").match(/^Solvex²([+-]\d*)x([+-]\d+)=0/) || [];
    if (b !== undefined) for (const r of qf.answer.replace(/−/g, "-").match(/-?\d+\.\d+/g).map(Number)) {
      const bb = b === "+" ? 1 : b === "-" ? -1 : Number(b);
      assert.ok(Math.abs(r * r + bb * r + Number(c)) < 0.006 * (Math.abs(2 * r + bb) + 1), `${qf.q} ${qf.answer}`); // rounded to 2 dp
    }
    const py = T("g5-pythagoras")[0](), [p, q] = py.q.match(/\d+(?= cm)/g).map(Number);
    assert.equal(Number(py.answer) ** 2, p * p + q * q, py.q);
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
      assert.doesNotMatch(b.pupil + " | " + b.answers, /undefined|NaN|null|\[object|\.\d{6,}/, s.id);
      seen.add(b.answers);
      const total = b.pupil.match(/Total ___ \/ (\d+)/);
      if (total && /^paper-gx-(?!baseline)/.test(s.id)) {
        const marks = [...b.pupil.matchAll(/\((\d) marks?\)<\/span>/g)].reduce((t, m) => t + Number(m[1]), 0);
        assert.equal(marks, Number(total[1]), `${s.id}: the marks add up to the total`);
      }
    }
    if (!/expects|tracker|route/.test(s.id)) assert.ok(seen.size > 1, `${s.id} varies`);
  }
});

test("the climb sits with key stage 4 in England's library", () => {
  runInNewContext(read("england.js"), page);
  const E = page.PopEngland;
  for (const id of ["gf-fractions", "paper-gx-fractions", "lesson-england-gcse-climb-fractions", "lesson-england-gcse-climb-mini-papers", "g5-trig", "paper-gx-g5-trig",
    "lesson-england-gcse-climb-g5-trig", "gh-vectors", "paper-gx-gh-vectors", "lesson-england-gcse-climb-gh-vectors", "lesson-england-gcse-climb-gh-mini-papers", "lesson-england-gcse-climb-my-next-step"]) {
    const w = E.forWork(id);
    assert.ok(w && w.statements.length, id);
    assert.equal(E.bandOf(w), "Key stage 4", id);
  }
});
