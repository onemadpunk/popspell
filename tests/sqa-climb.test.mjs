import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// The SQA maths exam climb (Scotland): National 4 skills, National 5, Higher. One question bank makes the
// online practice and the A4 sheets; every question carries its marks and an SQA-style marking (one mark a step)
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "activities.js", "lessons.js", "paper-sheets.js"].map(read).join("\n"), page);
const A = page.PopActivities, L = page.PopLessons, P = page.PopPaper, S = A.examBank.scotland;
const kit = { sheetHead: t => `<h1>${t}</h1>`, brandHead: t => `<h1>${t}</h1>`, handwritingRow: () => "", esc: x => String(x), phonicsWords: () => [] };
const num = s => Number(String(s).replace(/−/g, "-"));
const COURSE = { n4: "National 4", n5: "National 5", nh: "Higher" };

test("three stages of 14 topics, each with a lesson, online practice and an exam sheet", () => {
  assert.equal(S.STAGES.map(st => `${st.n}:${st.key}:${st.topics.length}`).join(), "1:n4:14,2:n5:14,3:nh:14");
  for (const st of S.STAGES) {
    st.topics.forEach((t, i) => {
      assert.equal(t.n, i + 1, t.id);
      const slug = t.id.slice(3), a = A.get(t.id), l = L.get(`lesson-sqa-climb-${st.key}-${slug}`);
      assert.equal(P.get(`paper-sq-${st.key}-${slug}`).title, `Exam practice (${COURSE[st.key]}) ${t.n}: ${t.title}`, `${t.id}: the sheets' topic list matches the bank`);
      assert.ok(a && a.check === false && a.level === "Senior" && /SQA maths exam climb/.test(a.organiser), t.id);
      assert.ok(l && l.use.includes(t.id) && l.level === "Senior" && !l.england && l.sqa && P.forLesson(l.id).length, `${t.id} has a lesson with its sheet`);
    });
    for (const id of ["check", "tracker", "mini-noncalc", "mini-calc", "mini-reasoning"]) assert.ok(P.get(`paper-sq-${st.key}-${id}`), `${st.key} ${id}`);
    for (const id of ["start-here", "mini-papers"]) assert.ok(L.get(`lesson-sqa-climb-${st.key}-${id}`), `${st.key} ${id}`);
    assert.equal(A.get(`${st.key}-check`).make().length, 14);
    assert.equal(A.get(`${st.key}-mixed`).make().length, 12);
  }
  for (const id of ["paper-sq-n4-expects", "paper-sq-n5-expects", "paper-sq-nh-expects", "paper-sq-technique", "paper-sq-route"]) assert.ok(P.get(id), id);
});

test("every question has marks, one marking bullet a mark, and a fair answer", () => {
  for (const t of S.ALL) t.makers.forEach((make, k) => {
    for (let run = 0; run < 80; run++) {
      const it = make();
      if (!it.q) continue;
      assert.ok([1, 2, 3, 4].includes(it.marks), `${t.id}[${k}]: ${it.q}`);
      const marks = (it.scheme.match(/\(1 mark/g) || []).length;
      assert.equal(marks, it.marks, `${t.id}[${k}]: the scheme gives ${marks} of ${it.marks} marks: ${it.scheme}`);
      assert.ok(it.answer !== "" && it.skill && it.label, `${t.id}[${k}]: ${it.q}`);
      assert.doesNotMatch([it.q, it.answer, it.scheme, ...(it.options || [])].join(" | "), /NaN|undefined|Infinity|null|\[object|\.\d{6,}/, `${t.id}[${k}]: ${it.q}`);
      if (it.options) assert.ok(it.options.length && new Set([it.answer, ...it.options]).size === it.options.length + 1, `${t.id}[${k}]: ${it.answer} | ${it.options}`);
    }
  });
});

test("National 5 and Higher questions use SQA's marking bullets", () => {
  for (const t of S.ALL.filter(x => x.id.startsWith("nh-"))) for (const make of t.makers) {
    let it = make();
    for (let i = 0; i < 20 && !it.q; i++) it = make();
    assert.match(it.scheme, /^•1 /, `${t.id}: ${it.scheme}`);
  }
});

test("worked answers check out", () => {
  const T = id => S.topic(id).makers;
  for (let run = 0; run < 200; run++) {
    // A remainder is f(k)
    const rem = T("nh-polynomials")[0]();
    const km = rem.q.match(/divided by \(x ([−+]) (\d+)\)/), k = km[1] === "−" ? Number(km[2]) : -Number(km[2]);
    const terms = rem.q.match(/Find the remainder when (.*) is divided/)[1].replace(/−/g, "-").replace(/ /g, "");
    const f = x => Function("x", `return ${terms.replace(/x³/g, "x**3").replace(/x²/g, "x**2").replace(/(\d)x/g, "$1*x")};`)(x);
    assert.equal(f(k), num(rem.answer), `${rem.q} ${rem.answer}`);
    // A trig equation's solutions satisfy it
    const te = T("n5-trigeq")[1]();
    if (te.q) {
      const [, a, fn, sign, b, c] = te.q.replace(/−/g, "-").match(/Solve (\d+) (sin|cos|tan) x°(?: ([+-]) (\d+))? = (-?\d+)/);
      for (const x of te.answer.match(/\d+\.\d/g).map(Number)) {
        const v = Number(a) * Math[fn](x * Math.PI / 180) + (sign === "-" ? -1 : 1) * Number(b || 0);
        assert.ok(Math.abs(v - Number(c)) < 0.05 * Number(a) + 0.01, `${te.q} ${te.answer}`);
      }
    }
    // A recurrence's limit is a fixed point
    const lim = T("nh-recurrence")[1](), [a2, b2] = lim.q.match(/= ([\d.]+)uₙ \+ ([\d.]+)/).slice(1).map(Number);
    assert.ok(Math.abs(a2 * Number(lim.answer) + b2 - Number(lim.answer)) < 1e-9, lim.q);
    // Stationary points have a zero derivative
    const sp = T("nh-calculus")[0](), cs = sp.q.match(/y = (.*)\.$/)[1];
    const xs = sp.answer.replace(/−/g, "-").match(/\((-?\d+), (-?\d+)\)/g).map(p => p.match(/-?\d+/g).map(Number));
    const g = Function("x", `return ${cs.replace(/−/g, "-").replace(/ /g, "").replace(/x³/g, "x**3").replace(/x²/g, "x**2").replace(/(\d)x/g, "$1*x")};`);
    for (const [x, y] of xs) { assert.equal(g(x), y, `${sp.q} ${sp.answer}`); assert.ok(Math.abs(g(x + 1e-4) - g(x - 1e-4)) < 1e-5, `${sp.q} at ${x}`); }
  }
});

test("sheets: every SQA climb sheet builds, has an answers page, its marks add up, and changes between prints", () => {
  const sheets = Object.values(P.sheets).filter(s => s.id.startsWith("paper-sq-"));
  assert.equal(sheets.length, 3 * (14 + 6) + 2, `${sheets.length} sheets`);
  for (const s of sheets) {
    assert.ok(L.get(s.lesson), `${s.id}'s lesson`);
    const seen = new Set();
    for (let run = 0; run < 20; run++) {
      const b = s.build("Pupil", kit);
      assert.ok(b.pupil.includes("SQA maths climb") && b.answers, s.id);
      assert.doesNotMatch(b.pupil + " | " + b.answers, /undefined|NaN|null|\[object|GCSE/, s.id);
      seen.add(b.answers);
      const total = b.pupil.match(/Total ___ \/ (\d+)/);
      if (total) {
        const marks = [...b.pupil.matchAll(/\((\d) marks?\)<\/span>/g)].reduce((t, m) => t + Number(m[1]), 0);
        assert.equal(marks, Number(total[1]), `${s.id}: the marks add up to the total`);
      }
    }
    if (!/expects|tracker|route/.test(s.id)) assert.ok(seen.size > 1, `${s.id} varies`);
  }
});

test("the senior phase is a level of Scotland's library, and S5 and S6 can be chosen", () => {
  const t = read("teacher.js");
  assert.match(t, /\["Senior", "S4–S6"\]/);
  assert.match(t, /"S4", "S5", "S6"\]/);
  const climb = read("climb.js");
  assert.match(climb, /course=sqa/);
  assert.match(climb, /popspell-climb-sqa/);
});
