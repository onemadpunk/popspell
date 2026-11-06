import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../activities.js", import.meta.url), "utf8");
const browser = { window: { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] } };
runInNewContext(source, browser);
const catalogue = browser.window.PopActivities;
const IDS = ["w-build-prefixes", "w-build-suffixes", "w-build-roots"];

test("Word Builder games are word games for older pupils, online only", () => {
  const area = catalogue.AREAS.find(a => a.id === "word-games");
  assert.ok(area && area.game && area.older);
  for (const id of IDS) {
    const tag = catalogue.tag(id);
    assert.equal(tag.area, "word-games");
    assert.equal(tag.game, true);
    assert.ok(tag.eo.length, `${id} has CfE outcomes`);
  }
});

test("every Word Builder round can be built from its tray and is in easy-to-hard order", () => {
  for (const id of IDS) {
    for (let run = 0; run < 60; run++) {
      const rounds = catalogue.get(id).make();
      assert.equal(rounds.length, 8);
      rounds.forEach((q, i) => {
        assert.equal(q.kind, "build");
        q.parts.forEach(p => assert.ok(q.tray.includes(p), `${q.answer}: ${p} is in the tray`));
        assert.ok(q.tray.length > q.parts.length, `${q.answer} has extra tiles to think about`);
        assert.equal(new Set(q.tray).size, q.tray.length, `${q.answer} has no repeated tiles`);
        const joined = q.parts.map(p => p.replace(/^-|-$/g, "")).join("");
        if (q.rule) {
          assert.ok(q.options.includes(q.answer), `${q.answer} is one of the spellings`);
          assert.ok(q.options.length >= 2 && q.options.length <= 3);
          assert.equal(new Set(q.options).size, q.options.length);
        } else {
          assert.equal(joined, q.answer);
          assert.equal(q.options.length, 0);
        }
        q.parts.filter(p => /^-|-$/.test(p)).forEach(p => assert.ok(q.means.find(m => m[0] === p.replace(/^-|-$/g, ""))[2], `${p} has a meaning`));
        if (i) assert.ok(rounds[i - 1].diff <= q.diff, `${id}: ${rounds[i - 1].answer} before ${q.answer}`);
        assert.ok(q.use.includes("___"), `${q.answer} has a sentence with a gap`);
      });
    }
  }
});
