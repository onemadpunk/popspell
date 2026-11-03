import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const root = new URL("../", import.meta.url);
const read = name => readFileSync(new URL(name, root), "utf8");
const window = {};
const context = { window };
for (const file of ["words.js", "sentences.js", "workbook.js"])
  runInNewContext(read(file), context, { filename: file });

const { PopWorksheets: W, SPELLING_LISTS, ENGLAND_LISTS } = window;
const raw = [...SPELLING_LISTS, ...ENGLAND_LISTS].flatMap(stage =>
  stage.lists.map(list => ({ ...list, stage:stage.stage,
    items:list.words.map(w => ({
      spelling:w.replace(/-/g,""),
      tokens:w.endsWith("-") ? [w.slice(0,-1)] : w.replace(/-/g,"").split("")
    })),
    checks:(list.check||[]).map(spelling=>({spelling}))
  })));

test("every supplied spelling list builds three original age-appropriate worksheet variants", () => {
  assert.equal(raw.length, 73);
  const families = new Set();
  for (const list of raw) {
    for (const level of ["core","support","stretch"]) {
      const result = W.build(list,{who:"Pupil",date:"2026-11-03",level});
      assert.equal(result.id,list.id);
      assert.equal(result.variant,level==="core"?"Independent":level==="support"?"Supported":"Extend");
      assert.equal(result.taskCount,level==="stretch"?6:5,"task count "+list.id);
      assert.ok(result.html.includes("Learning intention"),list.id);
      assert.ok(result.html.includes("Before you finish"),list.id);
      assert.ok(result.answers.includes("Assessment and next steps"),list.id);
      assert.ok(result.html.includes("ws-wb-task"),list.id);
      assert.ok(!result.html.includes('class="sound-boxes"'),"not the legacy template: "+list.id);
      assert.ok(!result.html.includes("undefined") && !result.html.includes("NaN"),
        "valid printable HTML "+list.id);
      assert.ok(result.html.length>1250 && result.answers.length>550,"has substance: "+list.id);
      if(level==="core") families.add(result.family);
    }
  }
  assert.deepEqual([...families].sort(),[
    "endings","exception","r-vowels","short","split-e","teams","vowels","word-study"
  ]);
});

test("early spelling is sounds-based, split-e contrasts word pairs and older words are proofread", () => {
  const build = (id,level="core") => W.build(raw.find(l=>l.id===id),{level});
  assert.match(build("short-a").html,/Build it from sounds/);
  assert.match(build("initial-y").html,/Pattern detective/);
  assert.match(build("e-e").html,/Two e's working together/);
  assert.match(build("a-e").html,/cap/);
  assert.match(build("oi-oy").html,/Sort by spelling/);
  assert.match(build("er-ir-ur").html,/Scottish speech/);
  assert.match(build("ing").html,/Word structure detective/);
  assert.match(build("wl-y56-1").html,/Proofreading clinic/);
  assert.match(build("wl-y56-1","stretch").html,/Explain and transfer/);
  assert.match(build("cew-y1-1","support").html,/Look, say, cover, write, check/);
});

test("sentences are contextual and keys do not expose pupil answers in the practice page", () => {
  const result = W.build(raw.find(l=>l.id==="short-a"),{level:"support"});
  assert.match(result.html,/ws-wb-cloze/);
  assert.match(result.html,/Word bank/);
  assert.match(result.answers,/The cat sat on my lap/);
  assert.match(result.answers,/Try an unfamiliar word/);
  const older = W.build(raw.find(l=>l.id==="wl-y56-1"),{level:"stretch"});
  assert.match(older.html,/Word investigation/);
  assert.match(older.answers,/Open responses/);
});