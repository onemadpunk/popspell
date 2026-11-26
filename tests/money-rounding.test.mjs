import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// Money answers must round the way a calculator does. 9000 × 0.85³ = 5527.125 exactly, which rounds to
// £5527.13, but plain floating point rounding stores it as 5527.12499… and gives £5527.12, marking a right
// pupil wrong. These tests redo the percentage questions in exact arithmetic and compare to the answer key.
const read = f => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = { PopSpell: { LISTS: {} }, PASSAGES: [], STORIES: [] };
page.window = page;
runInNewContext(["words.js", "activities.js"].map(read).join("\n"), page);
const X = page.PopActivities.examBank;

// Exact decimals as BigInt numerators over 10^S
const S = 12n, ONE = 10n ** S;
const dec = str => { const [w, f = ""] = String(str).replace(/\s/g, "").split("."); return BigInt(w + f.padEnd(Number(S), "0")); };
const mul = (a, b) => (a * b) / ONE;
const pence = v => { const q = v / 10n ** (S - 2n), r = v % 10n ** (S - 2n); return r * 2n >= 10n ** (S - 2n) ? q + 1n : q; };
const money = p => `${p / 100n}${p % 100n ? `.${String(p % 100n).padStart(2, "0")}` : ""}`;

test("percentage change, compound interest and depreciation answers are right to the penny", () => {
  const growth = X.ALL.find(t => t.id === "g5-growth");
  let checked = 0;
  for (let i = 0; i < 4000; i++) {
    const q = growth.makers[i % growth.makers.length]();
    if (!q.q) continue;
    let m, want;
    if ((m = q.q.match(/^(Increase|Decrease) £([\d ]+) by ([\d.]+)%/))) {
      const r = dec(m[3]) / 100n, k = m[1] === "Increase" ? ONE + r : ONE - r;
      want = mul(dec(m[2]), k);
    } else if ((m = q.q.match(/^£([\d ]+) is invested at ([\d.]+)% compound interest a year\. How much is it worth after (\d) years/))) {
      want = dec(m[1]); for (let n = 0; n < Number(m[3]); n++) want = mul(want, ONE + dec(m[2]) / 100n);
    } else if ((m = q.q.match(/^A car costs £([\d ]+)\. Its value goes down by (\d+)% each year\. What is it worth after (\d) years/))) {
      want = dec(m[1]); for (let n = 0; n < Number(m[3]); n++) want = mul(want, ONE - dec(m[2]) / 100n);
    } else continue;
    const p = pence(want), key = String(q.answer);
    assert.ok(key === money(p) || key === `${p / 100n}.${String(p % 100n).padStart(2, "0")}`, `${q.q} → key ${key}, exact £${money(p)}`);
    checked++;
  }
  assert.ok(checked > 1000, `checked ${checked}`);
});
