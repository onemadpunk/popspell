// Lists every piece of speech the activities need, so tools/make_audio.py can record them in
// Eponine's voice. Run it after changing activities.js, then run make_audio.py:
//   node tools/activity_lines.mjs && python tools/make_audio.py
// Questions are made at random, so each activity is made many times to catch every line.
import { readFileSync, writeFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const root = new URL("../", import.meta.url);
const page = {};
page.window = page;
for (const file of ["words.js", "sentences.js", "passages.js", "stories.js", "speech-text.js", "audio/index.js"])
  runInNewContext(readFileSync(new URL(file, root), "utf8"), page);
// Use the site's actual analyser and prepared lists rather than guessing phonemes.
// Previously this scanner had no PopSpell.LISTS, so early listening games couldn't
// generate their questions and their recordings were silently omitted.
page.__popspell_audio_scan = true;
page.localStorage = { getItem: () => null };
page.document = { getElementById: () => ({}) };
runInNewContext(readFileSync(new URL("app.js", root), "utf8"), page);
delete page.__popspell_audio_scan;
runInNewContext(readFileSync(new URL("activities.js", root), "utf8"), page);
const { PopActivities: A, PopSpeech: S } = page;
const recordedWords = new Set((page.POPSPELL_AUDIO || {}).words || []);

// Keep in step with app.js: which lines the activities say with the device voice unless recorded
const lines = new Set();
const hearable = q => q.kind === "choice" && q.sayOptions !== false && (q.sayOptions || q.options.some(o => /[a-z]{2}/i.test(o)));
for (const act of A.all()) {
  for (let run = 0; run < 300; run++) {
    let questions;
    try { questions = act.make(); } catch (error) { throw new Error(`Cannot generate Eponine lines for ${act.id}: ${error.message}`); }
    for (const q of questions) {
      if (q.kind && !["choice", "type", "dictation"].includes(q.kind)) continue; // games have their own recordings
      if (!q.say || (!q.say.clip && !q.say.word)) lines.add(q.say ? q.say.text : S.speakable(q.prompt));
      if (hearable(q)) q.options.forEach(o => { if (/\s/.test(o) || !recordedWords.has(o.toLowerCase())) lines.add(S.speakable(o)); });
      lines.add(S.answerLine(q));
    }
  }
}

const pieces = {};
let tooBig = 0;
for (const line of lines) {
  const parts = S.pieces(line);
  if (!parts) { tooBig++; continue; }
  parts.filter(p => p.text).forEach(p => { pieces[p.key] = pieces[p.key] || p.text; });
}
const out = new URL("tools/lines.json", root);
// Keep previous recordings as reusable speech pieces. A randomised activity must
// never delete a previously recorded line just because it was not drawn today.
const previous = JSON.parse(readFileSync(out, "utf8"));
for (const [key, text] of Object.entries(previous)) pieces[key] ||= text;
writeFileSync(out, JSON.stringify(Object.fromEntries(Object.entries(pieces).sort()), null, 0) + "\n");
console.log(`${lines.size} lines → ${Object.keys(pieces).length} recorded pieces (+ number words)${tooBig ? `; ${tooBig} have numbers too big to build` : ""}`);
