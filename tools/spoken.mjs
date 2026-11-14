// Everything PopSpell can say, worked out from the site's own content, so tools/activity_lines.mjs
// can list the pieces Eponine has to record and tools/audio_check.mjs can find any line the site
// would have to say in the device voice. Keep in step with the speech in app.js.
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

export const root = new URL("../", import.meta.url);
export const read = file => readFileSync(new URL(file, root), "utf8");

// The site's content scripts, run as the browser runs them
export function loadSite() {
  const page = {};
  page.window = page;
  for (const file of ["words.js", "sentences.js", "passages.js", "stories.js", "activities.js", "speech-text.js", "audio/index.js"])
    runInNewContext(read(file), page);
  return page;
}

// Questions are made at random, so each activity is made until a long run of goes brings no new
// lines (at least MIN_RUNS goes, at most MAX_RUNS). That catches the rare questions too.
const MIN_RUNS = 300;
const QUIET_RUNS = 400;
const MAX_RUNS = 6000;

// Keep in step with app.js: which kinds of question show answer buttons that read themselves out
const hearable = q => q.kind === "choice" && q.sayOptions !== false && (q.sayOptions || q.options.some(o => /[a-z]{2}/i.test(o)));
// Word games that say their word (sayWord in showSoundSwitch, showWordBuilder, showCodeWord, showLetterHunt)
const SAYS_WORDS = { switch: ["source", "answer"], build: ["answer"], codeword: ["answer"], hunt: ["answer"] };

// Sentences one at a time, as sentencesOf in app.js
export const sentencesOf = text => (text.match(/[\s\S]+?[.!?]+["”]?(?=\s+["“]?[A-Z]|\s*$)/g) || [text]).map(s => s.trim()).filter(Boolean);

/* What the site says, by the way it says it, each with where it's said:
     pieces   lines said with sayLine are joined from recorded pieces (speech-text.js): {key: {text, where}}
     numbers  the number words those lines use: {word: where}
     tooBig   lines that can't be joined from pieces, so the device voice says them: {line: where}
     words    words said with sayWord (a word recording; a word without one is a line): {word: where}
     clips    recordings played by name (audio/…): {url: where}
     phrases  phrases/<key> recordings asked for by key: {key: where}
     lines    how many different lines were found                                                */
export function spoken(page = loadSite()) {
  const { PopActivities: A, PopSpeech: S } = page;
  const recordedWords = new Set((page.POPSPELL_AUDIO || {}).words || []);
  const pieces = new Map(), numbers = new Map(), tooBig = new Map(), words = new Map(), clips = new Map(), phrases = new Map();
  const add = (map, key, where) => { if (key && !map.has(key)) map.set(key, where); };
  const seen = new Set();
  const say = (text, where) => {
    const line = String(text || "").trim();
    if (!line || seen.has(line)) return;
    seen.add(line);
    const parts = S.pieces(line);
    if (!parts) return add(tooBig, line, where);
    for (const part of parts) {
      if (part.text) add(pieces, part.key, { text: part.text, where });
      else if (part.number) part.number.forEach(n => add(numbers, n, where));
    }
  };
  const sayWord = (w, where) => (recordedWords.has(String(w).toLowerCase()) ? add(words, String(w).toLowerCase(), where) : say(String(w), where));
  const sayOption = (o, where) => (/\s/.test(o) || !recordedWords.has(o.toLowerCase()) ? say(S.speakable(o), where) : add(words, o.toLowerCase(), where));

  const question = (q, where) => {
    if (q.say) {
      if (q.say.word) { if (q.say.intro) add(phrases, q.say.intro, where); sayWord(q.say.word, where); }
      else if (q.say.clip) add(clips, q.say.clip, where);
      else say(q.say.text, where);
    } else if (q.prompt && (!q.kind || ["choice", "type", "dictation"].includes(q.kind))) say(S.speakable(q.prompt), where);
    if (!q.kind || ["choice", "type", "dictation"].includes(q.kind)) {
      if (hearable(q)) q.options.forEach(o => sayOption(String(o), where));
      say(S.answerLine(q), where);
    }
    for (const field of SAYS_WORDS[q.kind] || []) if (q[field]) sayWord(q[field], where);
    if (q.kind === "canopy") add(phrases, q.mode === "make" ? `canopy-make-${q.total}` : q.mode === "hide" ? `canopy-hide-${q.total}-${q.visible}` : `canopy-${q.mode}`, where);
    if (q.kind === "switch") { add(phrases, `switch-${q.action}`, where); add(phrases, "switch-make", where); }
  };

  for (const act of A.all()) {
    const where = `activity ${act.id}`;
    let quiet = 0;
    for (let run = 0; run < MAX_RUNS && (run < MIN_RUNS || quiet < QUIET_RUNS); run++) {
      let questions;
      try { questions = act.make(); } catch { break; }
      const before = pieces.size + tooBig.size + words.size + clips.size + phrases.size;
      for (const q of questions) question(q, where);
      quiet = pieces.size + tooBig.size + words.size + clips.size + phrases.size === before ? quiet + 1 : 0;
    }
  }

  // Story Cove in Pip's Sound Quest asks a story's questions itself (questionSay and sayOption in app.js)
  for (const p of (page.STORIES || []).concat((page.PASSAGES || []).filter(p => p.level === "Second"))) {
    for (const q of p.questions || []) {
      say(S.speakable(q.q), `Sound Quest story ${p.id}`);
      [q.a].concat(q.others || []).forEach(o => sayOption(String(o), `Sound Quest story ${p.id}`));
    }
  }
  // Tapping a word in a decodable story says it (storyHTML in app.js)
  for (const p of page.STORIES || []) {
    for (const m of p.text.matchAll(/[A-Za-z]+/g)) sayWord(m[0].toLowerCase(), `story words ${p.id}`);
  }
  // Pip's home lines past the 12 that have their own recording (dueLine and setLine in app.js)
  say("You've got 13 words to practise again. Let's go!", "Pip on the home page");
  say("Your teacher has set you 13 things for today. They're just below!", "Pip on the home page");
  return { pieces, numbers, tooBig, words, clips, phrases, lines: seen.size };
}
