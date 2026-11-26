import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// The A level maths exam climb (England, Years 12 and 13). One question bank makes the online practice and the A4
// sheets; every question carries its marks and one marking bullet a mark.
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "activities.js", "lessons.js", "england.js", "paper-sheets.js"].map(read).join("\n"), page);
const A = page.PopActivities, L = page.PopLessons, P = page.PopPaper, E = page.PopEngland, S = A.examBank.alevel;
const kit = { sheetHead: t => `<h1>${t}</h1>`, brandHead: t => `<h1>${t}</h1>`, handwritingRow: () => "", esc: x => String(x), phonicsWords: () => [] };

test("two stages of 14 topics, each with a lesson, online practice and an exam sheet", () => {
  assert.equal(S.STAGES.map(st => `${st.n}:${st.key}:${st.topics.length}`).join(), "1:y12:14,2:y13:14");
  for (const st of S.STAGES) {
    st.topics.forEach((t, i) => {
      const slug = t.id.slice(4), a = A.get(t.id), l = L.get(`lesson-alevel-maths-${st.key}-${slug}`);
      assert.equal(P.get(`paper-al-${t.id}`).title, `Exam practice (A level ${st.course}) ${i + 1}: ${t.title}`, `${t.id}: the sheets' topic list matches the bank`);
      assert.ok(a && a.level === "Senior" && /A level maths/.test(a.organiser), t.id);
      assert.ok(l && l.use.includes(t.id) && l.england && l.alevel && P.forLesson(l.id).length, `${t.id} has a lesson with its sheet`);
    });
    for (const id of ["check", "tracker", "mini-pure", "mini-applied", "mini-reasoning"]) assert.ok(P.get(`paper-al-${st.key}-${id}`), `${st.key} ${id}`);
    assert.equal(A.get(`${st.key}-check`).make().length, 14);
    assert.equal(A.get(`${st.key}-mixed`).make().length, 12);
  }
  for (const id of ["paper-al-expects", "paper-al-technique", "paper-al-route"]) assert.ok(P.get(id), id);
});

test("every question has marks, one marking bullet a mark, and a fair answer", () => {
  for (const t of S.ALL) t.makers.forEach((make, k) => {
    for (let run = 0; run < 60; run++) {
      const it = make();
      if (!it.q) continue;
      assert.ok([1, 2, 3, 4].includes(it.marks), `${t.id}[${k}]: ${it.q}`);
      assert.equal((it.scheme.match(/\(1 mark/g) || []).length, it.marks, `${t.id}[${k}]: ${it.scheme}`);
      assert.ok(it.answer !== "" && it.skill && it.label, `${t.id}[${k}]: ${it.q}`);
      assert.doesNotMatch([it.q, it.answer, it.scheme, ...(it.options || [])].join(" | "), /NaN|undefined|Infinity|null|\[object|\.\d{6,}/, `${t.id}[${k}]: ${it.q}`);
      if (it.options) assert.ok(new Set([it.answer, ...it.options]).size === it.options.length + 1, `${t.id}[${k}]: ${it.answer} | ${it.options}`);
    }
  });
});

test("statistics and mechanics answers check out", () => {
  const T = id => S.topic(id).makers;
  for (let run = 0; run < 100; run++) {
    const nw = T("y12-mechanics")[4](), [m, D, R] = nw.q.replace(/(\d) (\d{3})/g, "$1$2").match(/mass (\d+) kg.*force is (\d+) N.*motion is (\d+) N/).slice(1).map(Number);
    assert.ok(Math.abs((D - R) / m - Number(nw.answer)) < 1e-9, nw.q);
    const z = T("y13-normal")[0](), [mu, sd] = z.q.match(/N\((\d+), (\d+)²\)/).slice(1).map(Number);
    assert.ok(Number(z.answer) > 0 && Number(z.answer) < 1 && mu > 0 && sd > 0, z.q);
  }
});

test("every sheet prints, and Years 12 and 13 are England year groups in the sixth form band", () => {
  for (const id of Object.keys(P.sheets).filter(x => x.startsWith("paper-al-"))) {
    const out = P.get(id).build("Sam", kit);
    assert.ok(out.pupil.length > 200 && out.answers.length > 100, id);
    assert.doesNotMatch(out.pupil + out.answers, /undefined|NaN/, id);
  }
  assert.ok(E.isEngland("Year 12") && E.isEngland("Year 13"));
  assert.equal(E.bandOf(E.forWork("lesson-alevel-maths-y13-normal")), "Sixth form (A level)");
});
