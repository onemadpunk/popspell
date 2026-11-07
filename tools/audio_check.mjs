// Finds anything the site would say in the device voice instead of Eponine's: a spoken line with
// a piece nobody recorded, a word or sentence without its recording, a recording that's listed but
// missing or empty, or one made from older wording.
//   node tools/audio_check.mjs            report what's missing, by area
//   node tools/audio_check.mjs --strict   the same, and fail if anything is missing
// The recordings robot (.github/workflows/audio.yml) runs it with --strict after recording, so a
// line it couldn't record shows as a red cross on GitHub.
import { existsSync, statSync, readFileSync } from "node:fs";
import { root, read, loadSite, spoken, sentencesOf } from "./spoken.mjs";

const page = loadSite();
const S = page.PopSpeech;
const R = Object.assign({ words: [], phrases: [], sentences: [], lines: [], numbers: [], aliases: {} }, page.POPSPELL_AUDIO);
const made = JSON.parse(read("audio/made.json"));
const madeText = key => { try { return JSON.parse(made[key])[3]; } catch { return null; } };
const has = { words: new Set(R.words), phrases: new Set(R.phrases), sentences: new Set(R.sentences), lines: new Set(R.lines), numbers: new Set(R.numbers) };
const file = path => new URL(path, root);
const usable = path => existsSync(file(path)) && statSync(file(path)).size > 1000;

const problems = {}; // area → [what]
const problem = (area, what) => (problems[area] = problems[area] || []).push(what);

// 1. Every recording the site is told about is there and not empty
for (const folder of ["words", "phrases", "sentences", "lines", "numbers"])
  for (const name of R[folder]) if (!usable(`audio/${folder}/${name}.mp3`)) problem("Missing or empty files", `audio/${folder}/${name}.mp3`);
for (const [key, target] of Object.entries(R.aliases)) if (!usable(`audio/${target}.mp3`)) problem("Missing or empty files", `${target}.mp3 (for lines/${key})`);
if (!R.letters) problem("Missing or empty files", "the letter names (audio/letters)");
for (const c of "abcdefghijklmnopqrstuvwxyz") if (!usable(`audio/letters/${c}.mp3`)) problem("Missing or empty files", `audio/letters/${c}.mp3`);

// 2. Spelling lists: each word, and the sentence it's said in (words.js, sentences.js)
const spelling = entry => {
  entry = entry.trim().toLowerCase();
  if (!entry.includes("-")) return entry;
  let out = "", pendingE = false;
  for (const tok of entry.split("-").filter(Boolean)) {
    const split = /^([aeiou])_e$/.exec(tok);
    out += split ? split[1] : tok;
    if (pendingE) { out += "e"; pendingE = false; }
    if (split) pendingE = true;
  }
  return out + (pendingE ? "e" : "");
};
const listWords = new Set();
for (const stage of (page.SPELLING_LISTS || []).concat(page.ENGLAND_LISTS || []))
  for (const list of stage.lists) for (const entry of (list.words || []).concat(list.check || [])) {
    const w = spelling(entry);
    if (/^[a-z]+$/.test(w)) listWords.add(w); else problem("Spelling words", `"${entry}" in ${list.id} can't be recorded as written`);
  }
for (const w of listWords) {
  if (!has.words.has(w)) problem("Spelling words", `${w} (no recording)`);
  const sentence = (page.SENTENCES || {})[w];
  if (sentence && !has.sentences.has(w)) problem("Spelling sentences", `${w}: "${sentence}" (no recording)`);
  else if (sentence && madeText(`sentences/${w}`) !== S.voiced(sentence)) problem("Spelling sentences", `${w}: recorded as "${madeText(`sentences/${w}`)}", now "${sentence}"`);
}

// 3. Stories and passages: the whole text, each sentence for reading along, and each question
for (const p of (page.PASSAGES || []).concat(page.STORIES || [])) {
  const check = (name, text) => {
    if (!usable(`audio/passages/${name}.mp3`)) problem("Stories and passages", `${name}: "${text}" (no recording)`);
    else if (madeText(`passages/${name}`) !== S.voiced(text)) problem("Stories and passages", `${name}: recorded as "${madeText(`passages/${name}`)}", now "${text}"`);
  };
  check(p.id, p.text);
  sentencesOf(p.text).forEach((s, n) => check(`${p.id}-s${n + 1}`, s));
  (p.questions || []).forEach((q, n) => check(`${p.id}-q${n + 1}`, q.q));
}

// 4. Phrases: praise, Pip's speech bubbles and game instructions, with the wording app.js uses
const appJS = read("app.js");
const appPhrases = new Map();
const phraseBlocks = [/const PHRASES = \{([\s\S]*?)\n {2}\};/, /const PRAISE = \[([\s\S]*?)\];/].map(re => appJS.match(re)[1]).join("\n");
for (const m of phraseBlocks.matchAll(/\["([a-z0-9-]+)", "((?:[^"\\]|\\.)*)"\]/g)) appPhrases.set(m[1], m[2].replace(/\\"/g, '"'));
const pipBlock = appJS.match(/pipKeys = new Map\(\[([\s\S]*?)\]\);/)[1];
for (const m of pipBlock.matchAll(/\["((?:[^"\\]|\\.)*)", "([a-z0-9-]+)"\]/g)) appPhrases.set(m[2], m[1]);
const LINES = { START_LINE: "pip-start", PRACTISE_LINE: "pip-practise" };
for (const [name, key] of Object.entries(LINES)) appPhrases.set(key, appJS.match(new RegExp(`const ${name} = "([^"]+)"`))[1]);
for (const m of appJS.matchAll(/key: "([a-z]+)", id: "[^"]+", title: "[^"]+"[^\n]*\n\s*intro: "([^"]+)"/g))
  appPhrases.set(`pip-island-${m[1]}`, S.forSpeech(m[2]));
for (const [key, text] of appPhrases) {
  if (!has.phrases.has(key)) problem("Phrases", `${key}: "${text}" (no recording)`);
  else if (madeText(`phrases/${key}`) !== S.voiced(text)) problem("Phrases", `${key}: recorded as "${madeText(`phrases/${key}`)}", app.js says "${text}"`);
}

// 5. Everything the activities, games and Pip's Sound Quest say (tools/spoken.mjs)
const said = spoken(page);
const area = where => (/^activity (g|ng|w)-/.test(where) ? "Games" : /^activity /.test(where) ? "Activities"
  : /^Sound Quest/.test(where) ? "Sound Quest stories" : /^story words/.test(where) ? "Tapping a word in a story" : where);
for (const [key, { text, where }] of said.pieces)
  if (!has.lines.has(key) && !R.aliases[key]) problem(area(where), `${where}: "${text}"`);
for (const [n, where] of said.numbers) if (!has.numbers.has(n)) problem("Number words", `"${n}" (used in ${where})`);
for (const [line, where] of said.tooBig) problem(area(where), `${where}: "${line}" (a number too big to build)`);
for (const [w, where] of said.words) if (!has.words.has(w)) problem(area(where), `${where}: the word "${w}"`);
for (const [url, where] of said.clips) if (!usable(url.split("?")[0])) problem(area(where), `${where}: ${url}`);
for (const [key, where] of said.phrases) if (!has.phrases.has(key)) problem(area(where), `${where}: phrases/${key}`);

// Report
const total = Object.values(problems).reduce((n, list) => n + list.length, 0);
console.log(`Checked ${listWords.size} spelling words, ${(page.PASSAGES || []).length + (page.STORIES || []).length} stories and passages, ${appPhrases.size} phrases, and ${said.lines} spoken lines from the activities and games (${said.pieces.size} recorded pieces).`);
if (!total) console.log("Everything the site says has an Eponine recording.");
for (const [name, list] of Object.entries(problems).sort()) {
  console.log(`\n${name}: ${list.length} missing`);
  list.slice(0, process.argv.includes("--all") ? Infinity : 15).forEach(what => console.log(`  ${what}`));
  if (list.length > 15 && !process.argv.includes("--all")) console.log(`  … and ${list.length - 15} more (--all lists them all)`);
}
if (total && process.argv.includes("--strict")) {
  console.error(`\n${total} things would be said in the device voice. The recordings robot makes them when content changes; run it again, or see tools/make_audio.py.`);
  process.exit(1);
}
