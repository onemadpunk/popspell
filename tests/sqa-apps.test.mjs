import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// The SQA Applications of Mathematics climb (Scotland: National 5 and Higher). One question bank makes the online
// practice and the A4 sheets; every question carries its marks and one marking bullet a mark.
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "activities.js", "lessons.js", "paper-sheets.js"].map(read).join("\n"), page);
const A = page.PopActivities, L = page.PopLessons, P = page.PopPaper, S = A.examBank.apps;
const kit = { sheetHead: t => `<h1>${t}</h1>`, brandHead: t => `<h1>${t}</h1>`, handwritingRow: () => "", esc: x => String(x), phonicsWords: () => [] };

test("two stages (National 5 with 10 topics, Higher with 7), each topic with a lesson, online practice and an exam sheet", () => {
  assert.equal(S.STAGES.map(st => `${st.n}:${st.key}:${st.topics.length}`).join(), "1:ap5:10,2:aph:7");
  for (const st of S.STAGES) {
    st.topics.forEach((t, i) => {
      const a = A.get(t.id), l = L.get(`lesson-sqa-apps-${t.id}`);
      assert.equal(P.get(`paper-ap-${t.id}`).title, `Exam practice (${st.course} Applications) ${i + 1}: ${t.title}`, `${t.id}: the sheets' topic list matches the bank`);
      assert.ok(a && a.level === "Senior" && /Applications/.test(a.organiser), t.id);
      assert.ok(l && l.use.includes(t.id) && l.sqa === st.goal && P.forLesson(l.id).length, `${t.id} has a lesson with its sheet`);
    });
    for (const id of ["check", "tracker", "mini-mixed", "mini-reasoning"]) assert.ok(P.get(`paper-ap-${st.key}-${id}`), `${st.key} ${id}`);
    assert.equal(A.get(`${st.key}-check`).make().length, st.topics.length);
    assert.equal(A.get(`${st.key}-mixed`).make().length, 10);
  }
});

test("every question has marks, one marking bullet a mark, and a fair answer", () => {
  for (const t of S.ALL) t.makers.forEach((make, k) => {
    let made = 0;
    for (let run = 0; run < 80; run++) {
      const it = make();
      if (!it.q) continue;
      made++;
      assert.ok([1, 2, 3, 4].includes(it.marks), `${t.id}[${k}]: ${it.q}`);
      assert.equal((it.scheme.match(/\(1 mark/g) || []).length, it.marks, `${t.id}[${k}]: ${it.scheme}`);
      assert.ok(it.answer !== "" && it.skill && it.label, `${t.id}[${k}]: ${it.q}`);
      assert.doesNotMatch([it.q, it.answer, it.scheme, ...(it.options || [])].join(" | "), /NaN|undefined|Infinity|null|\[object|\.\d{6,}/, `${t.id}[${k}]: ${it.q}`);
      if (it.options) assert.ok(new Set([it.answer, ...it.options]).size === it.options.length + 1, `${t.id}[${k}]: ${it.answer} | ${it.options}`);
    }
    assert.ok(made > 20, `${t.id}[${k}] makes questions`);
  });
});

test("finance and planning answers check out", () => {
  const T = id => S.topic(id).makers;
  for (let run = 0; run < 100; run++) {
    const ot = T("ap5-pay")[0](), [r, basic, h] = ot.q.match(/£([\d.]+) an hour for a ([\d.]+)-hour week.*works (\d+) hours/).slice(1).map(Number);
    assert.ok(Math.abs(r * basic + 1.5 * r * h - Number(ot.answer)) < 0.011, ot.q);
    const cp = T("aph-planning")[1]();
    if (cp.q) { const [a, b, c, d, e] = cp.q.match(/\((\d+)\)/g).map(x => Number(x.slice(1, -1))); assert.equal(Number(cp.answer), a + Math.max(b + d, c) + e, cp.q); }
  }
});

test("every sheet prints", () => {
  for (const id of Object.keys(P.sheets).filter(x => x.startsWith("paper-ap-"))) {
    const out = P.get(id).build("Sam", kit);
    assert.ok(out.pupil.length > 200 && out.answers.length > 100, id);
    assert.doesNotMatch(out.pupil + out.answers, /undefined|NaN/, id);
  }
});
