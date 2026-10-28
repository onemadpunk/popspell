/*
  ACTIVITIES — everything beyond the spelling lists: writing, reading, listening and numeracy.

  Each activity makes a fresh set of questions every time (make()), and is labelled with its
  Curriculum for Excellence level and organiser so teachers' reports can group progress the way
  Scottish schools do. The levels and organisers are a starting guide for the teacher to check.

  A question looks like:
    { kind: "choice" | "type" | "dictation",
      prompt: "What is 7 + 3?",           shown on screen
      say: { word, text, clip },           optional audio: a recorded word, text for the device
                                           voice, or a recording's address
      html: "<svg…>",                      optional picture (clock, coins, shapes)
      options: ["a", "b", "c"],            for choice questions
      answer: "10",                        the right answer
      accept: ["ten"],                     other answers that count as right
      input: "numeric",                    for typed questions: "numeric" or "text"
      label: "7 + 3",                      short name used in results
      skill: "bonds to 10",                what a miss means needs practice
      explain: "7 and 3 make 10." }        shown when the answer is missed
*/
window.PopActivities = (() => {
  "use strict";

  /* ---------- Helpers ---------- */

  const rand = n => Math.floor(Math.random() * n);
  const pick = arr => arr[rand(arr.length)];
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  // n different questions from a maker, skipping repeats of the same label
  function distinct(n, maker, tries = 200) {
    const out = [];
    const seen = new Set();
    while (out.length < n && tries-- > 0) {
      const q = maker();
      if (!seen.has(q.label)) { seen.add(q.label); out.push(q); }
    }
    return out;
  }
  const choice = (prompt, answer, others, extra = {}) =>
    Object.assign({ kind: "choice", prompt, answer: String(answer), options: shuffle([String(answer)].concat(others.map(String))) }, extra);
  const typed = (prompt, answer, extra = {}) =>
    Object.assign({ kind: "type", prompt, answer: String(answer), input: "numeric" }, extra);
  const nearby = (answer, spread, min = 0) => {
    const set = new Set();
    while (set.size < 2) { const v = answer + (rand(spread * 2 + 1) - spread); if (v !== answer && v >= min) set.add(v); }
    return [...set];
  };
  const wordsOf = () => Object.values(window.PopSpell ? window.PopSpell.LISTS : {}).flatMap(l => l.items);
  const recorded = () => new Set(((window.POPSPELL_AUDIO || {}).words) || []);

  /* ---------- Pictures: clocks, coins and fraction shapes ---------- */

  function clockSVG(h, m) {
    const hand = (deg, len, w) => { const r = (deg - 90) * Math.PI / 180; return `<line x1="60" y1="60" x2="${60 + len * Math.cos(r)}" y2="${60 + len * Math.sin(r)}" stroke="#0B2E6B" stroke-width="${w}" stroke-linecap="round"/>`; };
    const nums = range(1, 12).map(n => { const r = (n * 30 - 90) * Math.PI / 180; return `<text x="${60 + 42 * Math.cos(r)}" y="${64 + 42 * Math.sin(r)}" text-anchor="middle" font-size="11" font-weight="700" fill="#142A56">${n}</text>`; }).join("");
    return `<svg class="q-pic" viewBox="0 0 120 120" width="180" height="180" role="img" aria-label="A clock">
      <circle cx="60" cy="60" r="56" fill="#fff" stroke="#0B2E6B" stroke-width="4"/>${nums}
      ${hand((h % 12) * 30 + m * 0.5, 28, 5)}${hand(m * 6, 42, 3)}<circle cx="60" cy="60" r="4" fill="#FF4081"/></svg>`;
  }
  const COINS = { 1: "1p", 2: "2p", 5: "5p", 10: "10p", 20: "20p", 50: "50p", 100: "£1", 200: "£2" };
  function coinsSVG(values) {
    const coin = (v, i) => { const big = v >= 10; const r = big ? 26 : 20; const gold = v === 1 || v === 2 ? "#D98C4A" : v === 100 || v === 200 ? "#E8C04A" : "#C9CED6";
      return `<g transform="translate(${34 + i * 62},40)"><circle r="${r}" fill="${gold}" stroke="#555" stroke-width="2"/><text y="5" text-anchor="middle" font-size="${big ? 14 : 12}" font-weight="700" fill="#222">${COINS[v]}</text></g>`; };
    return `<svg class="q-pic" viewBox="0 0 ${values.length * 62 + 10} 80" width="${values.length * 62 + 10}" height="80" role="img" aria-label="Coins: ${values.map(v => COINS[v]).join(", ")}">${values.map(coin).join("")}</svg>`;
  }
  function fractionSVG(parts, shaded) {
    const cells = range(0, parts - 1).map(i => `<rect x="${10 + i * (200 / parts)}" y="10" width="${200 / parts}" height="60" fill="${i < shaded ? "#12C6B7" : "#fff"}" stroke="#0B2E6B" stroke-width="3"/>`).join("");
    return `<svg class="q-pic" viewBox="0 0 220 80" width="260" height="95" role="img" aria-label="A bar in ${parts} equal parts, ${shaded} shaded">${cells}</svg>`;
  }

  /* ---------- Numeracy ---------- */

  const NUM = "Numeracy · Number and number processes";
  const numeracy = [
    { id: "n-add-10", title: "Adding within 10", level: "Early", organiser: NUM, blurb: "Add two small numbers.",
      make: () => distinct(10, () => { const a = rand(8) + 1, b = rand(10 - a) + 1; return typed(`${a} + ${b} =`, a + b, { label: `${a} + ${b}`, skill: "adding within 10", explain: `${a} and ${b} make ${a + b}.` }); }) },
    { id: "n-sub-10", title: "Taking away within 10", level: "Early", organiser: NUM, blurb: "Take away from numbers up to 10.",
      make: () => distinct(10, () => { const a = rand(9) + 2, b = rand(a) + 1; return typed(`${a} − ${b} =`, a - b, { label: `${a} − ${b}`, skill: "subtracting within 10", explain: `${a} take away ${b} leaves ${a - b}.` }); }) },
    { id: "n-bonds-10", title: "Number bonds to 10", level: "First", organiser: NUM, blurb: "Which number makes 10?",
      make: () => shuffle(range(0, 10)).slice(0, 10).map(a => typed(`${a} + ? = 10`, 10 - a, { label: `${a} + ? = 10`, skill: "bonds to 10", explain: `${a} and ${10 - a} make 10.` })) },
    { id: "n-bonds-20", title: "Number bonds to 20", level: "First", organiser: NUM, blurb: "Which number makes 20?",
      make: () => shuffle(range(1, 19)).slice(0, 10).map(a => typed(`${a} + ? = 20`, 20 - a, { label: `${a} + ? = 20`, skill: "bonds to 20", explain: `${a} and ${20 - a} make 20.` })) },
    { id: "n-add-20", title: "Adding within 20", level: "First", organiser: NUM, blurb: "Add numbers with answers up to 20.",
      make: () => distinct(10, () => { const a = rand(12) + 3, b = rand(20 - a) + 1; return typed(`${a} + ${b} =`, a + b, { label: `${a} + ${b}`, skill: "adding within 20", explain: `${a} + ${b} = ${a + b}.` }); }) },
    { id: "n-sub-20", title: "Taking away within 20", level: "First", organiser: NUM, blurb: "Subtract from numbers up to 20.",
      make: () => distinct(10, () => { const a = rand(10) + 11, b = rand(a - 1) + 1; return typed(`${a} − ${b} =`, a - b, { label: `${a} − ${b}`, skill: "subtracting within 20", explain: `${a} − ${b} = ${a - b}.` }); }) },
    { id: "n-doubles", title: "Doubles and halves", level: "First", organiser: NUM, blurb: "Double a number, or find half.",
      make: () => distinct(10, () => { const n = rand(10) + 1; return rand(2) ? typed(`Double ${n} =`, n * 2, { label: `double ${n}`, skill: "doubling", explain: `${n} + ${n} = ${n * 2}.` }) : typed(`Half of ${n * 2} =`, n, { label: `half of ${n * 2}`, skill: "halving", explain: `${n} + ${n} = ${n * 2}, so half of ${n * 2} is ${n}.` }); }) },
    { id: "n-tables-2-5-10", title: "2, 5 and 10 times tables", level: "First", organiser: NUM, blurb: "Multiplication facts for 2, 5 and 10.",
      make: () => distinct(10, () => { const t = pick([2, 5, 10]), n = rand(12) + 1; return typed(`${n} × ${t} =`, n * t, { label: `${n} × ${t}`, skill: `${t} times table`, explain: `${n} lots of ${t} = ${n * t}.` }); }) },
    { id: "n-tables-3-4", title: "3 and 4 times tables", level: "First", organiser: NUM, blurb: "Multiplication facts for 3 and 4.",
      make: () => distinct(10, () => { const t = pick([3, 4]), n = rand(12) + 1; return typed(`${n} × ${t} =`, n * t, { label: `${n} × ${t}`, skill: `${t} times table`, explain: `${n} lots of ${t} = ${n * t}.` }); }) },
    { id: "n-tables-6-9", title: "6, 7, 8 and 9 times tables", level: "Second", organiser: NUM, blurb: "The trickier tables.",
      make: () => distinct(10, () => { const t = pick([6, 7, 8, 9]), n = rand(11) + 2; return typed(`${n} × ${t} =`, n * t, { label: `${n} × ${t}`, skill: `${t} times table`, explain: `${n} × ${t} = ${n * t}.` }); }) },
    { id: "n-division", title: "Division facts", level: "Second", organiser: NUM, blurb: "Use your tables to divide.",
      make: () => distinct(10, () => { const t = rand(9) + 2, n = rand(10) + 2; return typed(`${n * t} ÷ ${t} =`, n, { label: `${n * t} ÷ ${t}`, skill: "division facts", explain: `${n} × ${t} = ${n * t}, so ${n * t} ÷ ${t} = ${n}.` }); }) },
    { id: "n-place-value", title: "Tens and ones", level: "First", organiser: NUM, blurb: "Place value with two-digit numbers.",
      make: () => distinct(10, () => {
        const t = rand(9) + 1, o = rand(10), n = t * 10 + o, k = rand(3);
        if (k === 0) return typed(`How many tens are in ${n}?`, t, { label: `tens in ${n}`, skill: "place value: tens", explain: `${n} is ${t} tens and ${o} ones.` });
        if (k === 1) return typed(`What number is ${t} tens and ${o} ones?`, n, { label: `${t} tens ${o} ones`, skill: "place value: making numbers", explain: `${t} tens is ${t * 10}, add ${o} ones: ${n}.` });
        return typed(`${t * 10} + ${o} =`, n, { label: `${t * 10} + ${o}`, skill: "place value: partitioning", explain: `${t * 10} and ${o} make ${n}.` });
      }) },
    { id: "n-hundreds", title: "Hundreds, tens and ones", level: "Second", organiser: NUM, blurb: "Place value with three-digit numbers.",
      make: () => distinct(10, () => {
        const h = rand(9) + 1, t = rand(10), o = rand(10), n = h * 100 + t * 10 + o, k = rand(3);
        if (k === 0) return choice(`What is the value of the ${t} in ${n}?`, t * 10, [t, t * 100], { label: `value of ${t} in ${n}`, skill: "place value: hundreds", explain: `The ${t} is in the tens place, so it is worth ${t * 10}.` });
        if (k === 1) return typed(`${h * 100} + ${t * 10} + ${o} =`, n, { label: `${h * 100} + ${t * 10} + ${o}`, skill: "place value: partitioning", explain: `That makes ${n}.` });
        return typed(`What is 10 more than ${n}?`, n + 10, { label: `10 more than ${n}`, skill: "10 more / less", explain: `Add one to the tens: ${n + 10}.` });
      }) },
    { id: "n-compare", title: "Bigger or smaller", level: "Early", organiser: NUM, blurb: "Which number is bigger?",
      make: () => distinct(10, () => { const a = rand(20), b = rand(20); if (a === b) return { label: "same" }; return choice(`Which number is bigger: ${a} or ${b}?`, Math.max(a, b), [Math.min(a, b)], { label: `${a} or ${b}`, skill: "comparing numbers", explain: `${Math.max(a, b)} is more than ${Math.min(a, b)}.` }); }).filter(q => q.kind) },
    { id: "n-money", title: "Counting money", level: "First", organiser: "Numeracy · Money", blurb: "Add up coins, and work out change.",
      make: () => distinct(10, () => {
        if (rand(3) === 0) { const cost = (rand(9) + 1) * 5; return typed(`You pay with a 50p coin for something that costs ${cost}p. How much change? (in p)`, 50 - cost, { html: coinsSVG([50]), label: `change from 50p for ${cost}p`, skill: "giving change", explain: `50p − ${cost}p = ${50 - cost}p.` }); }
        const coins = Array.from({ length: rand(3) + 2 }, () => pick([1, 2, 5, 10, 20])).sort((a, b) => b - a);
        const total = coins.reduce((s, c) => s + c, 0);
        return typed("How much money altogether? (in p)", total, { html: coinsSVG(coins), label: coins.map(c => `${c}p`).join("+"), skill: "adding coins", explain: `${coins.map(c => `${c}p`).join(" + ")} = ${total}p.` });
      }) },
    { id: "n-time", title: "Telling the time", level: "First", organiser: "Numeracy · Time", blurb: "O'clock, half past and quarter past/to.",
      make: () => distinct(10, () => {
        const h = rand(12) + 1, m = pick([0, 30, 15, 45]);
        const say = (hh, mm) => mm === 0 ? `${hh} o'clock` : mm === 30 ? `half past ${hh}` : mm === 15 ? `quarter past ${hh}` : `quarter to ${hh % 12 + 1}`;
        const wrong = [say(h % 12 + 1, m), say(h, (m + 30) % 60)].filter(x => x !== say(h, m));
        return choice("What time does the clock show?", say(h, m), wrong.slice(0, 2), { html: clockSVG(h, m), label: say(h, m), skill: m === 0 ? "o'clock" : m === 30 ? "half past" : "quarter past / to", explain: `The short hand points ${m === 45 ? `nearly to ${h % 12 + 1}` : `at ${h}`} and the long hand at ${m === 0 ? 12 : m === 30 ? 6 : m === 15 ? 3 : 9}.` });
      }) },
    { id: "n-fractions", title: "Halves, quarters and thirds", level: "First", organiser: "Numeracy · Fractions, decimals, percentages and ratio", blurb: "Name fractions, and find a fraction of a number.",
      make: () => distinct(10, () => {
        if (rand(2)) { const [p, s] = pick([[2, 1], [4, 1], [4, 2], [4, 3], [3, 1], [3, 2]]); const name = `${s}/${p}`;
          return choice("What fraction is shaded?", name, ["1/2", "1/4", "3/4", "1/3", "2/3"].filter(x => x !== name && !(name === "2/4" && x === "1/2")).slice(0, 2), { html: fractionSVG(p, s), label: `${s}/${p} shaded`, skill: "naming fractions", explain: `${s} of the ${p} equal parts are shaded: ${s}/${p}.` }); }
        const d = pick([2, 4, 3]), n = (rand(6) + 1) * d; const word = { 2: "half", 4: "a quarter", 3: "a third" }[d];
        return typed(`What is ${word} of ${n}?`, n / d, { label: `${word} of ${n}`, skill: "fraction of a number", explain: `Share ${n} into ${d} equal groups: ${n / d} in each.` });
      }) }
  ];

  /* ---------- Writing: punctuation, grammar and dictation ---------- */

  const WRITE = "Literacy · Writing · Tools for writing";
  const END_MARKS = [
    ["Where is my bag", "?"], ["The dog is asleep", "."], ["Can you help me", "?"], ["I like red apples", "."],
    ["What is your name", "?"], ["We went to the beach", "."], ["Is it time for lunch", "?"], ["The sun is hot today", "."],
    ["Who ate the cake", "?"], ["My gran lives in Ayr", "."], ["Do you like jam", "?"], ["The frog jumped into the pond", "."],
    ["How old are you", "?"], ["Look out", "!"], ["Why is the sky blue", "?"], ["That was amazing", "!"],
    ["Mum made soup for tea", "."], ["When is your birthday", "?"]
  ];
  const JOINING = [
    ["I wanted to play outside", "it was raining.", "but"], ["We got wet", "it was raining.", "because"],
    ["I have a cat", "a dog.", "and"], ["She was tired", "she went to bed.", "so"], ["He ran fast", "he still missed the bus.", "but"],
    ["I like apples", "pears.", "and"], ["We wore coats", "it was cold.", "because"], ["The shop was shut", "we went home.", "so"],
    ["I can swim", "I can't dive.", "but"], ["The baby cried", "she was hungry.", "because"], ["Sam fed the ducks", "the geese.", "and"],
    ["It was sunny", "we went to the park.", "so"], ["I looked for my shoe", "I could not find it.", "but"], ["The plant grew", "we watered it.", "because"]
  ];
  const PAST = ["jump", "play", "help", "look", "walk", "kick", "fish", "paint", "wash", "open", "pull", "push", "climb", "call", "shout", "laugh"];
  const sentencesFor = () => Object.entries(window.SENTENCES || {});
  const writing = [
    { id: "w-capitals", title: "Capital letters and full stops", level: "Early", organiser: WRITE, blurb: "Which sentence is written correctly?",
      make: () => shuffle(sentencesFor()).filter(([, s]) => /\.$/.test(s) && s.split(" ").length >= 4).slice(0, 10).map(([w, s]) => {
        const lower = s[0].toLowerCase() + s.slice(1);
        return choice("Which sentence is written correctly?", s, [lower, s.slice(0, -1)], { label: w, skill: "capital letters and full stops", explain: "A sentence starts with a capital letter and ends with a full stop." });
      }) },
    { id: "w-end-marks", title: "Full stop, question mark or exclamation mark?", level: "First", organiser: WRITE, blurb: "Choose the right mark for the end of each sentence.",
      make: () => shuffle(END_MARKS).slice(0, 10).map(([s, mark]) => choice(`${s} ___`, mark, [".", "?", "!"].filter(m => m !== mark),
        { label: s, skill: mark === "?" ? "question marks" : mark === "!" ? "exclamation marks" : "full stops", say: { text: s + mark }, explain: mark === "?" ? "It asks something, so it needs a question mark." : mark === "!" ? "It's said with strong feeling, so it needs an exclamation mark." : "It tells us something, so it needs a full stop." })) },
    { id: "w-joining", title: "Joining words: and, but, because, so", level: "First", organiser: WRITE, blurb: "Choose the best word to join the two parts.",
      make: () => shuffle(JOINING).slice(0, 10).map(([a, b, w]) => choice(`${a} ___ ${b}`, w, ["and", "but", "because", "so"].filter(x => x !== w).slice(0, 2),
        { label: `${a} … ${w}`, skill: `using "${w}"`, explain: `"${a} ${w} ${b}"` })) },
    { id: "w-past-ed", title: "Past tense: adding -ed", level: "First", organiser: WRITE, blurb: "Today I jump. Yesterday I …",
      make: () => shuffle(PAST).slice(0, 10).map(v => Object.assign(typed(`Today I ${v}. Yesterday I ___.`, `${v}ed`, { input: "text" }),
        { label: `${v} → ${v}ed`, skill: "past tense -ed", explain: `Add -ed: ${v}ed.` })) }
  ];

  // Sentence dictation for any spelling list: hear a sentence, write it all (activity id "dictate:<list id>")
  function dictation(listId) {
    const list = window.PopSpell && window.PopSpell.LISTS[listId];
    if (!list) return null;
    return { id: `dictate:${listId}`, area: "writing", title: `Sentence dictation: ${list.title}`, level: "First", organiser: WRITE,
      blurb: "Listen to the sentence, then write it all — capital letter, spellings and full stop.",
      make: () => shuffle(list.items.filter(it => it.sentence)).slice(0, 5).map(it => ({
        kind: "dictation", prompt: "Listen, then write the whole sentence.", answer: it.sentence,
        say: { text: it.sentence, clip: `audio/sentences/${encodeURIComponent(it.spelling.toLowerCase())}.mp3` },
        label: it.spelling, skill: "dictation", explain: `The sentence was: ${it.sentence}` })) };
  }

  /* ---------- Listening and sounds (early level) ---------- */

  const LISTEN = "Literacy · Listening and talking · Tools for listening and talking";
  const cvc = () => wordsOf().filter(it => !it.whole && it.spelling.length <= 5 && recorded().has(it.spelling.toLowerCase()));
  const rime = w => w.slice(w.search(/[aeiou]/));
  const listening = [
    { id: "l-rhyme", title: "Rhyming words", level: "Early", organiser: LISTEN, blurb: "Listen, then find the word that rhymes.",
      make: () => {
        const words = [...new Set(cvc().filter(it => it.spelling.length === 3).map(it => it.spelling.toLowerCase()))];
        return distinct(10, () => {
          const target = pick(words);
          const rhymes = words.filter(w => w !== target && rime(w) === rime(target));
          const others = shuffle(words.filter(w => rime(w) !== rime(target) && w[w.length - 1] !== target[target.length - 1])).slice(0, 2);
          if (!rhymes.length || others.length < 2) return { label: "skip" };
          return choice("Which word rhymes with this word?", pick(rhymes), others, { say: { word: target, intro: "q-rhyme" }, sayOptions: true, label: target, skill: "rhyme", explain: `${target} rhymes with words ending in -${rime(target)}.` });
        }).filter(q => q.kind);
      } },
    { id: "l-first-sound", title: "First sounds", level: "Early", organiser: LISTEN, blurb: "Which word starts with the same sound?",
      make: () => {
        const items = cvc();
        return distinct(10, () => {
          const target = pick(items);
          const first = target.tokens[0];
          const same = items.filter(it => it.tokens[0] === first && it.spelling !== target.spelling);
          const diff = shuffle(items.filter(it => it.tokens[0] !== first)).slice(0, 2).map(it => it.spelling.toLowerCase());
          if (!same.length || diff.length < 2) return { label: "skip" };
          return choice("Which word starts with the same sound as this word?", pick(same).spelling.toLowerCase(), diff,
            { say: { word: target.spelling.toLowerCase(), intro: "q-first" }, sayOptions: true, label: target.spelling.toLowerCase(), skill: "first sounds", explain: `${target.spelling} starts with "${first}".` });
        }).filter(q => q.kind);
      } },
    { id: "l-count-sounds", title: "How many sounds?", level: "Early", organiser: LISTEN, blurb: "Listen to the word and count its sounds.",
      make: () => distinct(10, () => {
        const it = pick(cvc());
        const n = it.tokens.length;
        return choice("How many sounds can you hear in this word?", n, nearby(n, 2, 1).slice(0, 2), { say: { word: it.spelling.toLowerCase(), intro: "q-count" }, label: it.spelling.toLowerCase(), skill: "counting sounds", explain: `${it.spelling}: ${it.tokens.join(" · ")} — ${n} sounds.` });
      }) }
  ];

  /* ---------- Reading (passages are in passages.js) ---------- */

  const READ = "Literacy · Reading · Understanding, analysing and evaluating";
  const TRICKY = ["the", "said", "was", "they", "have", "come", "some", "one", "do", "you", "were", "there", "could", "would", "people", "what", "where", "my", "her", "your"];
  const HFW = [
    ["___ cat sat on the mat.", "The"], ["Mum ___ it was time for bed.", "said"], ["It ___ a sunny day.", "was"],
    ["___ went to the park together.", "They"], ["I ___ a red coat.", "have"], ["Can you ___ to my party?", "come"],
    ["Can I have ___ juice, please?", "some"], ["I have ___ brother and two sisters.", "one"], ["What ___ you want to play?", "do"],
    ["Are ___ ready to go?", "you"], ["We ___ late for school.", "were"], ["Put the box over ___.", "there"],
    ["___ you help me, please?", "Could"], ["___ you like a biscuit?", "Would"], ["Lots of ___ came to the show.", "people"],
    ["___ is your name?", "What"], ["___ are my shoes?", "Where"], ["This is ___ bike.", "my"], ["I gave ___ a book.", "her"],
    ["Is this ___ hat?", "your"]
  ];
  const passageActivities = (window.PASSAGES || []).flatMap(p => {
    const make = listen => () => p.questions.map((q, i) => choice(q.q, q.a, q.others, {
      label: `${p.title} Q${i + 1}`, skill: q.skill || "comprehension", explain: q.why || "",
      say: listen ? { text: q.q, clip: `audio/passages/${p.id}-q${i + 1}.mp3` } : undefined
    }));
    const read = { id: `r-${p.id}`, title: p.title, level: p.level, organiser: READ, blurb: p.blurb || "Read the story, then answer the questions.", passage: p, make: make(false) };
    const listen = p.listen ? [{ id: `lc-${p.id}`, area: "listening", title: `Listen: ${p.title}`, level: "Early",
      organiser: LISTEN, blurb: "Listen to the story, then answer the questions.", passage: p, listen: true, make: make(true) }] : [];
    return [read].concat(listen);
  });
  const reading = [
    { id: "r-tricky", title: "Tricky word sentences", level: "Early", organiser: "Literacy · Reading · Tools for reading", blurb: "Choose the tricky word that finishes the sentence.",
      make: () => shuffle(HFW).slice(0, 10).map(([s, w]) => choice(s, w, shuffle(TRICKY.filter(t => t.toLowerCase() !== w.toLowerCase())).slice(0, 2).map(t => (/^___/.test(s) ? t[0].toUpperCase() + t.slice(1) : t)),
        { label: w.toLowerCase(), skill: `tricky word "${w.toLowerCase()}"`, say: { text: s.replace("___", w) }, explain: s.replace("___", w) })) }
  ].concat(passageActivities.filter(a => !a.area));

  /* ---------- The catalogue ---------- */

  const AREAS = [
    { id: "writing", title: "Writing: sentences and punctuation", colour: "#8B5CF6", icon: "✍️", activities: writing },
    { id: "reading", title: "Reading", colour: "#0EB5F2", icon: "📖", activities: reading },
    { id: "listening", title: "Listening and sounds", colour: "#12C6B7", icon: "👂", activities: listening.concat(passageActivities.filter(a => a.area === "listening")) },
    { id: "numeracy", title: "Numeracy", colour: "#FF4081", icon: "🔢", activities: numeracy }
  ];
  AREAS.forEach(area => area.activities.forEach(a => { a.area = area.id; a.colour = area.colour; a.icon = area.icon; }));
  const ALL = AREAS.flatMap(a => a.activities);

  // The organiser for a spelling list, by its stage (spelling is Tools for writing)
  const SPELLING_ORGANISER = "Literacy · Writing · Tools for writing (spelling)";
  function spellingLevel(stageIndex) { return stageIndex <= 1 ? "Early" : stageIndex <= 4 ? "First" : "Second"; }

  return {
    AREAS,
    get(id) { return ALL.find(a => a.id === id) || (String(id).startsWith("dictate:") ? dictation(String(id).slice(8)) : null); },
    order() { return ALL.map(a => a.id); },
    all() { return ALL.slice(); },
    dictation,
    // Level and organiser for anything a pupil can do: an activity id, a dictation, or a spelling list
    tag(id) {
      const a = this.get(id);
      if (a) return { level: a.level, organiser: a.organiser, area: a.area };
      const stages = window.SPELLING_LISTS || [];
      const s = stages.findIndex(st => st.lists.some(l => l.id === id));
      return s >= 0 ? { level: spellingLevel(s), organiser: SPELLING_ORGANISER, area: "spelling" } : null;
    }
  };
})();
