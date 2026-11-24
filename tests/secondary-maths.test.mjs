import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// Years 7 to 11 maths: the GCSE practice in the Numbers area and the maths quick drills
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "activities.js", "lessons.js", "paper-sheets.js"].map(read).join("\n"), page);
const A = page.PopActivities, L = page.PopLessons, P = page.PopPaper;
const gcse = A.AREAS.find(a => a.id === "numeracy").activities.filter(a => /GCSE/.test(a.organiser));
const num = s => Number(String(s).replace(/−/g, "-"));

test("GCSE maths practice is in the Numbers area, out of the starting check, and every Years 10 and 11 maths lesson has some", () => {
  assert.ok(gcse.length >= 20, `${gcse.length} activities`);
  for (const a of gcse) {
    assert.equal(a.check, false, a.id);
    assert.equal(a.level, "Fourth", a.id);
    assert.match(a.title, /\(Years 10 and 11\)$/, a.id);
  }
  const ks4 = L.all().filter(l => /years-10-and-11$/.test(l.id) && l.subject === "Maths");
  assert.ok(ks4.length >= 24);
  for (const l of ks4) assert.ok(l.use.some(u => A.get(u)), `${l.id} has online practice`);
  for (const a of gcse) assert.ok(ks4.some(l => l.use.includes(a.id)), `${a.id} belongs to a lesson`);
});

test("every GCSE question is fair: enough of them, the answer among distinct options, and an explanation", () => {
  for (const a of gcse) for (let run = 0; run < 40; run++) {
    const qs = a.make();
    assert.ok(qs.length >= 8, `${a.id}: ${qs.length} questions`);
    for (const q of qs) {
      assert.ok(q.prompt && q.answer !== "" && q.skill && q.explain, `${a.id}: ${q.prompt}`);
      assert.doesNotMatch(q.prompt + q.answer + q.explain + (q.options || []).join(), /NaN|undefined|Infinity|\.\d{9,}/, `${a.id}: ${q.prompt}`);
      if (q.kind === "choice") {
        assert.ok(q.options.includes(q.answer), `${a.id}: ${q.prompt}`);
        assert.equal(new Set(q.options).size, q.options.length, `${a.id}: ${q.prompt} ${q.options}`);
      }
    }
  }
});

test("worked answers check out", () => {
  for (let run = 0; run < 40; run++) {
    for (const q of A.get("k4-simultaneous").make()) {
      const m = q.answer.replace(/−/g, "-").match(/^x = (-?\d+), y = (-?\d+)$/);
      if (!m) continue;
      const [x, y] = [+m[1], +m[2]];
      for (const eq of q.prompt.replace(/^Solve together: /, "").replace(/\.$/, "").split(" and ")) {
        const e = eq.replace(/−/g, "-").replace(/ /g, ""), [lhs, rhs] = e.split("=");
        const val = [...lhs.matchAll(/([+-]?)(\d*)([xy])/g)].reduce((t, [, sg, k, v]) => t + (sg === "-" ? -1 : 1) * (k ? +k : 1) * (v === "x" ? x : y), 0);
        assert.equal(val, +rhs, `${q.prompt} → ${q.answer}`);
      }
    }
    for (const q of A.get("k4-circle-theorems").make()) assert.ok(num(q.answer) > 0 && num(q.answer) < 180, q.prompt);
    for (const q of A.get("k4-trig").make()) if (/hypotenuse \d+ cm and an angle/.test(q.prompt)) {
      const [h] = q.prompt.match(/\d+(?= cm)/).map(Number);
      assert.ok(num(q.answer) < h, q.prompt);
    }
  }
});

test("maths quick drills cover Years 7 to 11, fit the drill shape and change between prints", () => {
  const kit = { sheetHead: t => `<h1>${t}</h1>`, brandHead: t => `<h1>${t}</h1>`, handwritingRow: () => "", esc: x => String(x), phonicsWords: () => [] };
  const drills = Object.values(P.sheets).filter(s => /^paper-drill-ks[34]-/.test(s.id));
  assert.ok(drills.filter(d => d.id.startsWith("paper-drill-ks3-")).length >= 10);
  assert.ok(drills.filter(d => d.id.startsWith("paper-drill-ks4-")).length >= 8);
  for (const d of drills) {
    assert.ok(L.get(d.lesson), `${d.id}'s lesson exists`);
    const seen = new Set();
    for (let run = 0; run < 60; run++) {
      const b = d.build("Pupil", kit), items = (b.pupil.match(/<li>/g) || []).length, answers = (b.answers.match(/<li>/g) || []).length;
      assert.ok(b.pupil.includes("Quick drill") && /Years (7 to 9|10 and 11)/.test(b.pupil), d.id);
      assert.equal(items, answers, `${d.id}: every question has an answer`);
      assert.doesNotMatch(b.pupil + b.answers, /undefined|NaN|null|\[object|\.\d{6,}/, d.id);
      seen.add(b.answers);
    }
    assert.ok(seen.size > 1, `${d.id} varies`);
  }
});
