// Lists every piece of speech the site needs, so tools/make_audio.py can record them in
// Eponine's voice. Run it after changing activities.js, then run make_audio.py:
//   node tools/activity_lines.mjs && python tools/make_audio.py
// What the site says is worked out in tools/spoken.mjs.
import { writeFileSync } from "node:fs";
import { root, spoken } from "./spoken.mjs";

const { pieces, tooBig, lines } = spoken();
const out = Object.fromEntries([...pieces].map(([key, { text }]) => [key, text]).sort(([a], [b]) => (a < b ? -1 : 1)));
writeFileSync(new URL("tools/lines.json", root), JSON.stringify(out, null, 0) + "\n");
console.log(`${lines} lines → ${pieces.size} recorded pieces (+ number words)${tooBig.size ? `; ${tooBig.size} have numbers too big to build` : ""}`);
