/*
  ADULT ENGLISH: lessons for adults learning English, taught online by screen share or sent as a link.
  Shown by english.html (english.js draws them). Nothing is saved anywhere, so no sign-in is needed.

  The lessons themselves are in english/a1.js … english/c1.js (one file per CEFR level), which load before
  this file and add to window.PopEnglishLessons.

  They follow the material Sara uses with her adult learners, above all her own "Planning Trips" sheet:
  numbered sections (warm-up chat, vocabulary sort with "add more", reading with questions and an extra
  challenge, a grammar focus with a gap fill, spelling or word practice, a role-play with a cool-down game,
  and homework), in British English, with a student copy and a teacher copy with answers. Upper levels
  use matching and discussion more, as her B1–C1 lessons do. Every word is PopSpell's own: nothing is
  copied from any publisher.

    id        used in the link: english.html#<id>
    level     CEFR level: A1 | A2 | B1 | B2 | C1
    minutes   about how long the whole lesson takes (the steps' minutes add up to it)
    aims      what the learner will do ("In this lesson, you will…")
    steps     in teaching order (7); each has type, title, minutes, a teacher note, and maybe a challenge:
      talk      intro, questions; write (a line to fill in); follow (more questions, teacher view)
      sort      intro, groups: { name: [words] }; tip (+ tipLabel, default British English)
      match     intro, pairs: [[left, right]] (the right side is shown in a fixed mixed order)
      read      heading, intro, text (paragraphs); items: [statement, true|false, why] or { q, a } (open question)
      grammar   rule (one or more lines), head (table headings), table rows, examples;
                intro, items: { text with {} for each gap, hint, answers: [[accepted…] per gap] }
      choose    intro, items: [sentence with ___, [options], index of the right one]
      jumble    intro, words (shown with their letters mixed up)
      fix       intro, items: [sentence with a mistake, [accepted corrections]]
      roleplay  intro, cards: [{ who, task, phrases }], info (facts for card B), game: { title, how }
      write     task, prompts, model (teacher copy), lines (print), start (placeholder), count (a phrase to count)
    errors    mistakes to listen for (teacher copy)
    stretch   extra questions for a stronger learner (teacher copy)
    pages     which steps go on which A4 page (default: steps 1–3, then the rest)
*/
window.PopEnglish = (() => {
  "use strict";
  const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
  const LEVEL_NAMES = { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper intermediate", C1: "Advanced" };
  const lessons = (window.PopEnglishLessons || []).slice().sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level));

  // Accepting a typed answer: case, curly apostrophes, spaces and a final full stop don't matter
  const tidy = s => String(s || "").toLowerCase().replace(/[‘’`]/g, "'").replace(/\s+/g, " ").replace(/\s+'/g, "'").trim().replace(/[.!?]+$/, "").trim();
  const accepts = (answers, typed) => answers.some(a => tidy(a) === tidy(typed));

  // The same mixed order every time for the same seed, so the screen and both printed copies agree
  const seeded = seed => {
    let h = 2166136261;
    for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => { h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  };
  const order = (list, seed) => {
    const out = list.slice(), rnd = seeded(seed);
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    if (out.length > 1 && out.every((x, i) => x === list[i])) out.push(out.shift());
    return out;
  };
  const scramble = word => {
    let out = order([...word.toLowerCase()], word).join("");
    for (let k = 1; out === word.toLowerCase() && k < word.length; k++) out = word.slice(k) + word.slice(0, k);
    return out;
  };

  return {
    LEVELS, LEVEL_NAMES,
    all: () => lessons.slice(),
    get: id => lessons.find(l => l.id === id) || null,
    tidy, accepts, order, scramble
  };
})();
