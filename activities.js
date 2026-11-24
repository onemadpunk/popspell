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
      // A maker returns a bare { label } when its random numbers don't make a fair question: try again
      if (q.kind && !seen.has(q.label)) { seen.add(q.label); out.push(q); }
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
  const SHAPE_COLOURS = { red: "#E53935", blue: "#1E63D6", yellow: "#F5C518", green: "#2E9E4F" };
  function patternSVG(items) {
    const shape = ([kind, colour], i) => {
      const x = 30 + i * 56, fill = SHAPE_COLOURS[colour];
      return kind === "square" ? `<rect x="${x - 18}" y="12" width="36" height="36" fill="${fill}" stroke="#333" stroke-width="2"/>`
        : kind === "triangle" ? `<polygon points="${x},10 ${x + 20},48 ${x - 20},48" fill="${fill}" stroke="#333" stroke-width="2"/>`
          : `<circle cx="${x}" cy="30" r="19" fill="${fill}" stroke="#333" stroke-width="2"/>`;
    };
    const w = items.length * 56 + 60;
    return `<svg class="q-pic" viewBox="0 0 ${w} 60" width="${w}" height="60" role="img" aria-label="${items.map(([k, c]) => `${c} ${k}`).join(", ")}, then a gap">${items.map(shape).join("")}
      <text x="${30 + items.length * 56}" y="40" text-anchor="middle" font-size="30" font-weight="700" fill="#333">?</text></svg>`;
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
      make: () => distinct(10, () => { const a = rand(9) + 2, b = rand(a - 1) + 1; return typed(`${a} − ${b} =`, a - b, { label: `${a} − ${b}`, skill: "subtracting within 10", explain: `${a} take away ${b} leaves ${a - b}.` }); }) },
    { id: "n-bonds-10", title: "Number bonds to 10", level: "First", organiser: NUM, blurb: "Which number makes 10?",
      make: () => shuffle(range(1, 9)).map(a => typed(`${a} + ? = 10`, 10 - a, { label: `${a} + ? = 10`, skill: "bonds to 10", explain: `${a} and ${10 - a} make 10.` })) },
    { id: "n-bonds-20", title: "Number bonds to 20", level: "First", organiser: NUM, blurb: "Which number makes 20?",
      make: () => shuffle(range(1, 19)).slice(0, 10).map(a => typed(`${a} + ? = 20`, 20 - a, { label: `${a} + ? = 20`, skill: "bonds to 20", explain: `${a} and ${20 - a} make 20.` })) },
    { id: "n-add-20", title: "Adding within 20", level: "First", organiser: NUM, blurb: "Add numbers with answers up to 20.",
      make: () => distinct(10, () => {
        const bridge = rand(10) < 6;
        const a = bridge ? rand(5) + 5 : rand(5) + 11;                    // 5–9, or 11–15
        const b = bridge ? rand(a - 1) + (11 - a) : rand(19 - a) + 2;     // crosses ten, or stays in the teens
        return typed(`${a} + ${b} =`, a + b, { label: `${a} + ${b}`, skill: "adding within 20", explain: `${a} + ${b} = ${a + b}.` }); }) },
    { id: "n-sub-20", title: "Taking away within 20", level: "First", organiser: NUM, blurb: "Subtract from numbers up to 20.",
      make: () => distinct(10, () => {
        const bridge = rand(10) < 6;
        const a = bridge ? rand(8) + 11 : rand(7) + 13;                   // 11–18, or 13–19
        const b = bridge ? rand(19 - a) + (a - 9) : rand(a - 11) + 1;     // the answer drops below ten, or stays a teen
        return typed(`${a} − ${b} =`, a - b, { label: `${a} − ${b}`, skill: "subtracting within 20", explain: `${a} − ${b} = ${a - b}.` }); }) },
    { id: "n-doubles", title: "Doubles and halves", level: "First", organiser: NUM, blurb: "Double a number, or find half.",
      make: () => distinct(10, () => { const n = rand(9) + 2; return rand(2) ? typed(`Double ${n} =`, n * 2, { label: `double ${n}`, skill: "doubling", explain: `${n} + ${n} = ${n * 2}.` }) : typed(`Half of ${n * 2} =`, n, { label: `half of ${n * 2}`, skill: "halving", explain: `${n} + ${n} = ${n * 2}, so half of ${n * 2} is ${n}.` }); }) },
    { id: "n-tables-2-5-10", title: "2, 5 and 10 times tables", level: "First", organiser: NUM, blurb: "Multiplication facts for 2, 5 and 10.",
      make: () => distinct(10, () => { const t = pick([2, 5, 10]), n = rand(11) + 2; return typed(`${n} × ${t} =`, n * t, { label: `${n} × ${t}`, skill: `${t} times table`, explain: `${n} lots of ${t} = ${n * t}.` }); }) },
    { id: "n-tables-3-4", title: "3 and 4 times tables", level: "First", organiser: NUM, blurb: "Multiplication facts for 3 and 4.",
      make: () => distinct(10, () => { const t = pick([3, 4]), n = rand(11) + 2; return typed(`${n} × ${t} =`, n * t, { label: `${n} × ${t}`, skill: `${t} times table`, explain: `${n} lots of ${t} = ${n * t}.` }); }) },
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
        // Asking about a 0, or a digit that appears twice, has no single answer
        if (k === 0 && (t === 0 || t === h || t === o)) return { label: "unclear" };
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
    { id: "n-money-10", title: "Coins up to 10p", level: "Early", organiser: "Numeracy · Money", blurb: "Know 1p, 2p, 5p and 10p, add them up and pay for things up to 10p.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) { const [a, b] = shuffle([1, 2, 5, 10]).slice(0, 2);
          return choice(`Which coin is worth more: ${a}p or ${b}p?`, `${Math.max(a, b)}p`, [`${Math.min(a, b)}p`], { html: coinsSVG([a, b]), label: `${a}p or ${b}p`, skill: "coin values", explain: `${Math.max(a, b)}p is worth more than ${Math.min(a, b)}p, even if the coin is smaller.` }); }
        const coins = distinctCoins();
        const total = coins.reduce((t, c) => t + c, 0);
        if (k === 1) return typed("How much money altogether? (in p)", total, { html: coinsSVG(coins), label: coins.map(c => `${c}p`).join("+"), skill: "adding coins", explain: `${coins.map(c => `${c}p`).join(" + ")} = ${total}p.` });
        const cost = rand(9) + 2;
        return choice(`You have these coins. Can you buy a sticker that costs ${cost}p?`, total >= cost ? "yes" : "no", [total >= cost ? "no" : "yes"],
          { html: coinsSVG(coins), label: `${total}p for ${cost}p`, skill: "paying for things", explain: `You have ${total}p. ${total >= cost ? `That's enough for ${cost}p.` : `That's not enough: you need ${cost}p.`}` });
      }) },
    { id: "n-time-oclock", title: "O'clock and the days of the week", level: "Early", organiser: "Numeracy · Time", blurb: "Read o'clock times, and put the days of the week in order.",
      make: () => distinct(10, () => {
        const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        if (rand(2)) { const d = rand(7), after = rand(2) === 1, ans = DAYS[(d + (after ? 1 : 6)) % 7];
          return choice(`Which day comes ${after ? "after" : "before"} ${DAYS[d]}?`, ans, others2(ans, DAYS.filter(x => x !== DAYS[d])), { label: `${after ? "after" : "before"} ${DAYS[d]}`, skill: "days of the week", explain: `The days go in order: ${DAYS.join(", ")}.` }); }
        const h = rand(12) + 1, say = hh => `${hh} o'clock`;
        return choice("What time does the clock show?", say(h), [say(h % 12 + 1), say((h + 5) % 12 + 1)], { html: clockSVG(h, 0), label: say(h), skill: "o'clock", explain: `The long hand points to 12 and the short hand points to ${h}: ${say(h)}.` });
      }) },
    { id: "n-time", title: "Telling the time", level: "First", organiser: "Numeracy · Time", blurb: "O'clock, half past and quarter past/to.",
      make: () => distinct(10, () => {
        const h = rand(12) + 1, m = pick([0, 30, 15, 45]);
        const say = (hh, mm) => mm === 0 ? `${hh} o'clock` : mm === 30 ? `half past ${hh}` : mm === 15 ? `quarter past ${hh}` : `quarter to ${hh % 12 + 1}`;
        const wrong = [say(h % 12 + 1, m), say(h, (m + 30) % 60)].filter(x => x !== say(h, m));
        return choice("What time does the clock show?", say(h, m), wrong.slice(0, 2), { html: clockSVG(h, m), label: say(h, m), skill: m === 0 ? "o'clock" : m === 30 ? "half past" : "quarter past / to", explain: `The short hand points ${m === 45 ? `nearly to ${h % 12 + 1}` : `at ${h}`} and the long hand at ${m === 0 ? 12 : m === 30 ? 6 : m === 15 ? 3 : 9}.` });
      }) },
    { id: "n-fractions", title: "Halves, quarters and thirds", level: "First", organiser: "Numeracy · Fractions, decimal fractions and percentages", blurb: "Name fractions, and find a fraction of a number.",
      make: () => distinct(10, () => {
        if (rand(2)) { const [p, s] = pick([[2, 1], [4, 1], [4, 2], [4, 3], [3, 1], [3, 2]]); const name = `${s}/${p}`;
          return choice("What fraction is shaded?", name, ["1/2", "1/4", "3/4", "1/3", "2/3"].filter(x => x !== name && !(name === "2/4" && x === "1/2")).slice(0, 2), { html: fractionSVG(p, s), label: `${s}/${p} shaded`, skill: "naming fractions", explain: `${s} of the ${p} equal parts are shaded: ${s}/${p}.` }); }
        const d = pick([2, 4, 3]), n = (rand(6) + 1) * d; const word = { 2: "half", 4: "a quarter", 3: "a third" }[d];
        return typed(`What is ${word} of ${n}?`, n / d, { label: `${word} of ${n}`, skill: "fraction of a number", explain: `Share ${n} into ${d} equal groups: ${n / d} in each.` });
      }) }
  ];

  /* ---------- More pictures: ruler, jug, rectangle, tally, bar chart, counters, shapes, angles ---------- */

  const INK = "#0B2E6B";
  function rulerSVG(cm) {
    const x = c => 15 + c * 25;
    const ticks = range(0, 20).map(i => `<line x1="${x(i / 2)}" y1="50" x2="${x(i / 2)}" y2="${i % 2 ? 57 : 63}" stroke="${INK}" stroke-width="1.5"/>`
      + (i % 2 ? "" : `<text x="${x(i / 2)}" y="78" text-anchor="middle" font-size="10" fill="${INK}">${i / 2}</text>`)).join("");
    return `<svg class="q-pic" viewBox="0 0 280 90" width="300" height="96" role="img" aria-label="A strip above a centimetre ruler">
      <rect x="${x(0)}" y="22" width="${cm * 25}" height="18" rx="3" fill="#FFC837" stroke="${INK}" stroke-width="2"/>
      <rect x="5" y="48" width="270" height="36" rx="3" fill="#fff" stroke="${INK}" stroke-width="2"/>${ticks}</svg>`;
  }
  function jugSVG(ml) {
    const y = v => 165 - v * 0.14;
    const marks = range(1, 10).map(i => `<line x1="62" y1="${y(i * 100)}" x2="74" y2="${y(i * 100)}" stroke="${INK}" stroke-width="1.5"/>`
      + `<text x="56" y="${y(i * 100) + 4}" text-anchor="end" font-size="10" fill="${INK}">${i * 100}</text>`).join("");
    return `<svg class="q-pic" viewBox="0 0 170 175" width="170" height="175" role="img" aria-label="A measuring jug marked in millilitres">
      <rect x="62" y="${y(ml)}" width="76" height="${165 - y(ml)}" fill="#7CD3F7"/>
      <path d="M62 18 V165 H138 V18" fill="none" stroke="${INK}" stroke-width="3"/>${marks}
      <text x="56" y="14" text-anchor="end" font-size="10" fill="${INK}">ml</text></svg>`;
  }
  function rectSVG(w, h) {
    const s = Math.min(200 / w, 100 / h, 18), W = w * s, H = h * s;
    return `<svg class="q-pic" viewBox="0 0 ${W + 90} ${H + 50}" width="${W + 90}" height="${H + 50}" role="img" aria-label="A rectangle ${w} cm by ${h} cm">
      <rect x="20" y="10" width="${W}" height="${H}" fill="#E6F8F6" stroke="${INK}" stroke-width="3"/>
      <text x="${20 + W / 2}" y="${H + 34}" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${w} cm</text>
      <text x="${W + 28}" y="${10 + H / 2 + 5}" font-size="14" font-weight="700" fill="${INK}">${h} cm</text></svg>`;
  }
  function tallySVG(n) {
    let x = 12, lines = "";
    for (let left = n; left > 0; left -= 5) {
      for (let i = 0; i < Math.min(left, 4); i++) lines += `<line x1="${x + i * 12}" y1="12" x2="${x + i * 12}" y2="62" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
      if (left >= 5) lines += `<line x1="${x - 8}" y1="54" x2="${x + 44}" y2="20" stroke="#FF4081" stroke-width="4" stroke-linecap="round"/>`;
      x += 72;
    }
    return `<svg class="q-pic" viewBox="0 0 ${x} 74" width="${x}" height="74" role="img" aria-label="Tally marks">${lines}</svg>`;
  }
  function barSVG(title, cats, vals) {
    const base = 180, unit = 14, x0 = 40, gap = 64;
    const grid = range(0, 10).map(v => `<line x1="${x0}" y1="${base - v * unit}" x2="${x0 + cats.length * gap}" y2="${base - v * unit}" stroke="#D6E5F7"/>`
      + (v % 2 ? "" : `<text x="${x0 - 8}" y="${base - v * unit + 4}" text-anchor="end" font-size="11" fill="${INK}">${v}</text>`)).join("");
    const bars = cats.map((c, i) => `<rect x="${x0 + 12 + i * gap}" y="${base - vals[i] * unit}" width="40" height="${vals[i] * unit}" fill="${["#0EB5F2", "#FF4081", "#12C6B7", "#FFC837"][i % 4]}" stroke="${INK}"/>
      <text x="${x0 + 32 + i * gap}" y="${base + 16}" text-anchor="middle" font-size="11" fill="${INK}">${c}</text>`).join("");
    const width = x0 + cats.length * gap + 10;
    return `<svg class="q-pic" viewBox="0 0 ${width} 205" width="${width}" height="205" role="img" aria-label="${title}: a bar chart">
      <text x="${width / 2}" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${title}</text>${grid}${bars}
      <line x1="${x0}" y1="${base}" x2="${x0}" y2="${base - 10 * unit}" stroke="${INK}" stroke-width="2"/><line x1="${x0}" y1="${base}" x2="${x0 + cats.length * gap}" y2="${base}" stroke="${INK}" stroke-width="2"/></svg>`;
  }
  function countersSVG(red, blue) {
    const all = shuffle(Array(red).fill("#E11D48").concat(Array(blue).fill("#2563EB")));
    return `<svg class="q-pic" viewBox="0 0 ${all.length * 34 + 16} 50" width="${all.length * 34 + 16}" height="50" role="img" aria-label="${red} red and ${blue} blue counters">
      ${all.map((c, i) => `<circle cx="${25 + i * 34}" cy="25" r="14" fill="${c}" stroke="${INK}" stroke-width="2"/>`).join("")}</svg>`;
  }
  const SHAPES = { circle: 0, triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, octagon: 8 };
  function shapeSVG(name) {
    const style = `fill="#FFE7A3" stroke="${INK}" stroke-width="3"`;
    const corners = (n, rot) => range(0, n - 1).map(i => { const a = (rot + (i * 360) / n) * Math.PI / 180; return `${(80 + 55 * Math.cos(a)).toFixed(1)},${(70 + 55 * Math.sin(a)).toFixed(1)}`; }).join(" ");
    const body = name === "circle" ? `<circle cx="80" cy="70" r="55" ${style}/>`
      : name === "rectangle" ? `<rect x="15" y="35" width="130" height="70" ${style}/>`
      : `<polygon points="${corners(SHAPES[name], name === "square" ? 45 : -90)}" ${style}/>`;
    return `<svg class="q-pic" viewBox="0 0 160 140" width="160" height="140" role="img" aria-label="A 2D shape">${body}</svg>`;
  }
  function angleSVG(deg) {
    const r = deg * Math.PI / 180, cx = 110, cy = 110;
    const mark = deg === 90 ? `<path d="M${cx + 18} ${cy} V${cy - 18} H${cx}" fill="none" stroke="#FF4081" stroke-width="2.5"/>`
      : `<path d="M${cx + 24} ${cy} A24 24 0 0 0 ${cx + 24 * Math.cos(r)} ${cy - 24 * Math.sin(r)}" fill="none" stroke="#FF4081" stroke-width="2.5"/>`;
    return `<svg class="q-pic" viewBox="0 0 220 125" width="220" height="125" role="img" aria-label="An angle">
      <line x1="${cx}" y1="${cy}" x2="${cx + 100}" y2="${cy}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + 95 * Math.cos(r)}" y2="${cy - 95 * Math.sin(r)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>${mark}</svg>`;
  }
  const tableHTML = (head, rows) => `<table class="q-table"><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;

  /* ---------- More numeracy and maths: the rest of the organisers ---------- */

  const ROUND = "Numeracy · Estimation and rounding";
  const MFP = "Numeracy · Multiples, factors and primes";
  const FDP = "Numeracy · Fractions, decimal fractions and percentages";
  const TIME = "Numeracy · Time";
  const MEAS = "Numeracy · Measurement";
  const DATA = "Numeracy · Data and analysis";
  const CHANCE = "Numeracy · Ideas of chance and uncertainty";
  const SHAPE = "Mathematics · Properties of 2D shapes and 3D objects";
  const ANGLE = "Mathematics · Angle, symmetry and transformation";
  const PATTERN = "Mathematics · Patterns and relationships";
  const EQUATION = "Mathematics · Expressions and equations";
  const minus = n => (n < 0 ? `−${-n}` : `${n}`);
  const pad = n => String(n).padStart(2, "0");
  const roundTo = (n, to) => Math.round(n / to) * to;
  const distinctCoins = () => { for (;;) { const c = Array.from({ length: rand(2) + 2 }, () => pick([1, 2, 5])).concat(rand(4) ? [] : [5]).sort((a, b) => b - a);
    if (c.reduce((t, v) => t + v, 0) <= 10) return c; } };
  const others2 = (answer, pool) => shuffle(pool.filter(x => String(x) !== String(answer))).slice(0, 2);
  // Decimals as pupils write them: 2.5, not 2.50; also accepts .5 for 0.5
  const dec = n => String(Math.round(n * 100) / 100);
  const dec3 = n => String(Math.round(n * 1000) / 1000);
  const decAccept = n => (n > 0 && n < 1 ? [dec(n).replace(/^0/, "")] : []);

  const numeracyMore = [
    { id: "n-round-10", title: "Rounding to the nearest 10", level: "First", organiser: ROUND, blurb: "Round two-digit numbers to the nearest 10.",
      make: () => distinct(10, () => {
        const n = (rand(9) + 1) * 10 + rand(9) + 1, low = n - (n % 10);
        return typed(`Round ${n} to the nearest 10.`, roundTo(n, 10), { label: `${n} to 10`, skill: "rounding to 10",
          explain: `${n} is between ${low} and ${low + 10}. The ones digit is ${n % 10}, so round ${n % 10 >= 5 ? "up" : "down"} to ${roundTo(n, 10)}.` });
      }) },
    { id: "n-round-10-100", title: "Rounding to 10 and 100", level: "First", organiser: ROUND, blurb: "Round two- and three-digit numbers to the nearest 10 or 100.",
      make: () => distinct(10, () => {
        const n = (rand(9) + 1) * 100 + rand(99) + 1;
        if (rand(2)) { const low = n - (n % 10);
          return typed(`Round ${n} to the nearest 10.`, roundTo(n, 10), { label: `${n} to 10`, skill: "rounding to 10",
            explain: `${n} is between ${low} and ${low + 10}. The ones digit is ${n % 10}, so round ${n % 10 >= 5 ? "up" : "down"} to ${roundTo(n, 10)}.` }); }
        const low = n - (n % 100), d = Math.floor((n % 100) / 10);
        return typed(`Round ${n} to the nearest 100.`, roundTo(n, 100), { label: `${n} to 100`, skill: "rounding to 100",
          explain: `${n} is between ${low} and ${low + 100}. The tens digit is ${d}, so round ${d >= 5 ? "up" : "down"} to ${roundTo(n, 100)}.` });
      }) },
    { id: "n-round-100", title: "Rounding to 100 and 1000", level: "Second", organiser: ROUND, blurb: "Round to the nearest 100 or 1000.",
      make: () => distinct(10, () => {
        if (rand(2)) {
          const n = (rand(9) + 1) * 100 + rand(99) + 1, low = n - (n % 100), d = Math.floor((n % 100) / 10);
          return typed(`Round ${n} to the nearest 100.`, roundTo(n, 100), { label: `${n} to 100`, skill: "rounding to 100",
            explain: `${n} is between ${low} and ${low + 100}. The tens digit is ${d}, so round ${d >= 5 ? "up" : "down"} to ${roundTo(n, 100)}.` });
        }
        const n = (rand(9) + 1) * 1000 + rand(999) + 1, low = n - (n % 1000), d = Math.floor((n % 1000) / 100);
        return typed(`Round ${n} to the nearest 1000.`, roundTo(n, 1000), { label: `${n} to 1000`, skill: "rounding to 1000",
          explain: `${n} is between ${low} and ${low + 1000}. The hundreds digit is ${d}, so round ${d >= 5 ? "up" : "down"} to ${roundTo(n, 1000)}.` });
      }) },
    { id: "n-estimate", title: "Estimating answers", level: "Second", organiser: ROUND, blurb: "Round first to estimate an answer.",
      make: () => distinct(10, () => {
        if (rand(2)) {
          const a = rand(80) + 11, b = rand(80) + 11, est = roundTo(a, 10) + roundTo(b, 10);
          return choice(`Estimate ${a} + ${b} by rounding each number to the nearest 10.`, est, others2(est, [est - 10, est + 10, est + 20]),
            { label: `estimate ${a} + ${b}`, skill: "estimating sums", explain: `${a} is about ${roundTo(a, 10)} and ${b} is about ${roundTo(b, 10)}, so about ${est}.` });
        }
        const a = rand(80) + 11, b = rand(7) + 3, est = roundTo(a, 10) * b;
        return choice(`Estimate ${a} × ${b} by rounding ${a} to the nearest 10.`, est, [est - b * 10, est + b * 10],
          { label: `estimate ${a} × ${b}`, skill: "estimating products", explain: `${a} is about ${roundTo(a, 10)}, and ${roundTo(a, 10)} × ${b} = ${est}.` });
      }) },
    { id: "n-negative", title: "Negative numbers", level: "Second", organiser: NUM, blurb: "Temperatures and counting below zero.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) {
          const t = rand(6), d = t + rand(6) + 1, ans = t - d;
          return choice(`It is ${t}°C. It gets ${d} degrees colder. What is the temperature now?`, `${minus(ans)}°C`, [`${ans + 1}`, `${d - t}`, `${ans - 1}`].map(Number).filter(v => v !== ans).slice(0, 2).map(v => `${minus(v)}°C`),
            { label: `${t}°C − ${d}`, skill: "negative temperatures", explain: `Count down ${d} from ${t}: you pass 0 and reach ${minus(ans)}°C.` });
        }
        if (k === 1) {
          const a = rand(8) + 1, b = a + rand(7) + 1, ans = a - b;
          return choice(`${a} − ${b} =`, minus(ans), [minus(b - a), minus(ans - 1)], { label: `${a} − ${b}`, skill: "subtracting below zero", explain: `Start at ${a} and count back ${b}: ${minus(ans)}.` });
        }
        const a = -(rand(9) + 1), b = -(rand(9) + 1);
        if (a === b) return { label: "same" };
        return choice(`Which is colder: ${minus(a)}°C or ${minus(b)}°C?`, `${minus(Math.min(a, b))}°C`, [`${minus(Math.max(a, b))}°C`],
          { label: `${a} or ${b} colder`, skill: "comparing negative numbers", explain: `${minus(Math.min(a, b))} is further below zero, so it is colder.` });
      }).filter(q => q.kind) },
    { id: "n-multiples", title: "Multiples, factors and primes", level: "Second", organiser: MFP, blurb: "Spot multiples, factors and prime numbers.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) {
          const t = rand(7) + 3, ans = t * (rand(8) + 2);
          return choice(`Which number is a multiple of ${t}?`, ans, [ans + 1, ans + 2], { label: `multiple of ${t}: ${ans}`, skill: "multiples", explain: `${ans} = ${ans / t} × ${t}, so it is in the ${t} times table.` });
        }
        if (k === 1) {
          const n = pick([12, 18, 20, 24, 30, 36, 40, 48]), fs = range(2, n / 2).filter(f => n % f === 0), ans = pick(fs);
          return choice(`Which number is a factor of ${n}?`, ans, others2(ans, range(2, n / 2).filter(f => n % f)), { label: `factor of ${n}: ${ans}`, skill: "factors", explain: `${n} ÷ ${ans} = ${n / ans} exactly, so ${ans} is a factor of ${n}.` });
        }
        if (k === 2) {
          const ans = pick([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
          return choice("Which of these is a prime number?", ans, others2(ans, [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 25, 27]), { label: `prime ${ans}`, skill: "prime numbers", explain: `${ans} can only be divided exactly by 1 and itself, so it is prime.` });
        }
        const t = rand(8) + 2, n = t * (rand(9) + 2);
        return typed(`What is the next multiple of ${t} after ${n}?`, n + t, { label: `next multiple of ${t} after ${n}`, skill: "multiples", explain: `Add ${t}: ${n} + ${t} = ${n + t}.` });
      }) },
    { id: "n-x10", title: "Multiplying and dividing by 10 and 100", level: "Second", organiser: NUM, blurb: "Move the digits to multiply or divide by 10 and 100.",
      make: () => distinct(10, () => {
        const k = rand(4), n = rand(89) + 11;
        if (k === 0) return typed(`${n} × 10 =`, n * 10, { label: `${n} × 10`, skill: "× 10", explain: `Each digit moves one place to the left: ${n * 10}.` });
        if (k === 1) return typed(`${n} × 100 =`, n * 100, { label: `${n} × 100`, skill: "× 100", explain: `Each digit moves two places to the left: ${n * 100}.` });
        if (k === 2) return typed(`${n * 10} ÷ 10 =`, n, { label: `${n * 10} ÷ 10`, skill: "÷ 10", explain: `Each digit moves one place to the right: ${n}.` });
        return typed(`${n * 100} ÷ 100 =`, n, { label: `${n * 100} ÷ 100`, skill: "÷ 100", explain: `Each digit moves two places to the right: ${n}.` });
      }) },
    { id: "n-big-add", title: "Adding and taking away bigger numbers", level: "Second", organiser: NUM, blurb: "Add and subtract three-digit numbers.",
      make: () => distinct(10, () => {
        let a, b;
        do { a = rand(500) + 100; b = rand(399) + 100; } while (Math.abs(a - b) < 50); // no "128 − 128"
        if (rand(2)) return typed(`${a} + ${b} =`, a + b, { label: `${a} + ${b}`, skill: "adding 3-digit numbers", explain: `Add the hundreds, tens and ones: ${a} + ${b} = ${a + b}.` });
        const [x, y] = a > b ? [a, b] : [b, a];
        return typed(`${x} − ${y} =`, x - y, { label: `${x} − ${y}`, skill: "subtracting 3-digit numbers", explain: `${x} − ${y} = ${x - y}. Check: ${x - y} + ${y} = ${x}.` });
      }) },
    { id: "n-best-value", title: "Best value, budgets, profit and loss", level: "Second", organiser: "Numeracy · Money", blurb: "Compare prices, keep to a budget, and work out profit or loss.",
      make: () => distinct(8, () => {
        const k = rand(3), pounds = n => `£${n.toFixed(2)}`;
        if (k === 0) { const each = [0.4, 0.45, 0.5, 0.55, 0.6, 0.75], a = pick(each), b = pick(each.filter(x => x !== a)), na = pick([4, 5, 6]), nb = pick([8, 10, 12]);
          const pa = a * na, pb = b * nb, ans = a < b ? `pack A` : `pack B`;
          return choice(`Pack A: ${na} for ${pounds(pa)}. Pack B: ${nb} for ${pounds(pb)}. Which is better value?`, ans, [ans === "pack A" ? "pack B" : "pack A"],
            { label: `${na} for ${pa} v ${nb} for ${pb}`, skill: "best value", explain: `Find the price of one: A is ${pounds(a)} each and B is ${pounds(b)} each, so ${ans} is better value.` }); }
        if (k === 1) { const budget = pick([10, 15, 20]), x = (rand(10) + 2) + pick([0, 0.25, 0.5, 0.75]), y = (rand(5) + 1) + pick([0, 0.2, 0.5, 0.8]);
          if (x + y > budget) return { label: "over" };
          return typed(`You have £${budget}. You spend ${pounds(x)} and ${pounds(y)}. How much is left? (in £)`, dec(budget - x - y), { input: "decimal", accept: [pounds(budget - x - y), (budget - x - y).toFixed(2)],
            label: `${budget}-${x}-${y}`, skill: "keeping to a budget", explain: `${pounds(x)} + ${pounds(y)} = ${pounds(x + y)}, and £${budget} − ${pounds(x + y)} = ${pounds(budget - x - y)}.` }); }
        const cost = pick([12, 15, 18, 20, 24]), sold = cost + pick([-6, -4, -3, 3, 4, 6, 8]), diff = Math.abs(sold - cost), ans = sold > cost ? `£${diff} profit` : `£${diff} loss`;
        return choice(`A stall buys juice for £${cost} and sells it all for £${sold}. Did it make a profit or a loss, and how much?`, ans,
          [sold > cost ? `£${diff} loss` : `£${diff} profit`, `£${diff + 2} ${sold > cost ? "profit" : "loss"}`], { label: `${cost} to ${sold}`, skill: "profit and loss",
            explain: `Selling price − cost = £${sold} − £${cost} = ${sold > cost ? "" : "−"}£${diff}, so it's a ${sold > cost ? "profit" : "loss"} of £${diff}.` });
      }) },
    { id: "n-decimals", title: "Decimal fractions", level: "Second", organiser: FDP, blurb: "Tenths, hundredths and thousandths as decimals.",
      make: () => distinct(10, () => {
        const k = rand(6);
        if (k === 4) { const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), place = rand(3), n = `0.${digits.join("")}`;
          const names = (digits[place] === 1 ? ["tenth", "hundredth", "thousandth"] : ["tenths", "hundredths", "thousandths"]), ans = `${digits[place]} ${names[place]}`;
          return choice(`What is the ${digits[place]} worth in ${n}?`, ans, names.filter((_, i) => i !== place).map(x => `${digits[place]} ${x}`),
            { label: `${digits[place]} in ${n}`, skill: "decimal place value", explain: `After the point come tenths, then hundredths, then thousandths, so the ${digits[place]} in ${n} is ${ans}.` }); }
        if (k === 5) { const a = (rand(9) + 1) / 10 + (rand(9) + 1) / 1000, b = Math.round(a * 100) / 100;
          if (Math.abs(a - b) < 0.0005) return { label: "same" };
          return choice(`Which is bigger: ${dec3(a)} or ${dec3(b)}?`, dec3(Math.max(a, b)), [dec3(Math.min(a, b))], { label: `${dec3(a)} or ${dec3(b)}`, skill: "comparing decimals",
            explain: `Line up the places: compare tenths, then hundredths, then thousandths. ${dec3(Math.max(a, b))} is bigger.` }); }
        if (k === 0) { const t = rand(9) + 1; return typed(`Write ${t}/10 as a decimal.`, dec(t / 10), { input: "decimal", accept: decAccept(t / 10), label: `${t}/10 as a decimal`, skill: "tenths as decimals", explain: `${t} tenths is 0.${t}.` }); }
        if (k === 1) { const t = rand(9) + 1; return choice(`Which fraction is the same as 0.${t}?`, `${t}/10`, [`${t}/100`, `1/${t + 1}`], { label: `0.${t} as a fraction`, skill: "decimals as fractions", explain: `The first digit after the point is tenths, so 0.${t} = ${t}/10.` }); }
        if (k === 2) {
          const a = (rand(9) + 1) / 10, b = (rand(89) + 11) / 100;
          if (Math.abs(a - b) < 0.001) return { label: "same" };
          return choice(`Which is bigger: ${dec(a)} or ${dec(b)}?`, dec(Math.max(a, b)), [dec(Math.min(a, b))], { label: `${dec(a)} or ${dec(b)}`, skill: "comparing decimals", explain: `Compare the tenths first: ${dec(Math.max(a, b))} has more tenths.` });
        }
        const a = rand(5) + 1, b = rand(9 - a) + 1;
        return typed(`0.${a} + 0.${b} =`, dec((a + b) / 10), { input: "decimal", accept: decAccept((a + b) / 10), label: `0.${a} + 0.${b}`, skill: "adding decimals", explain: `${a} tenths + ${b} tenths = ${a + b} tenths = ${dec((a + b) / 10)}.` });
      }).filter(q => q.kind) },
    { id: "n-percent", title: "Percentages", level: "Second", organiser: FDP, blurb: "Simple percentages and what they mean.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) {
          const p = pick([50, 25, 10]), n = (rand(9) + 1) * { 50: 2, 25: 4, 10: 10 }[p];
          return typed(`What is ${p}% of ${n}?`, (n * p) / 100, { label: `${p}% of ${n}`, skill: "percentage of an amount", explain: `${p}% is ${{ 50: "a half", 25: "a quarter", 10: "a tenth" }[p]}, so ${n} ÷ ${100 / p} = ${(n * p) / 100}.` });
        }
        if (k === 1) {
          const map = { 50: "1/2", 25: "1/4", 75: "3/4", 10: "1/10" }, p = pick(Object.keys(map));
          return choice(`Which fraction is the same as ${p}%?`, map[p], others2(map[p], Object.values(map).concat(["1/5", "1/3"])), { label: `${p}% as a fraction`, skill: "percentages as fractions", explain: `${p}% means ${p} out of 100, which is ${map[p]}.` });
        }
        const s = rand(9) + 1;
        return typed("What percentage of the bar is shaded?", s * 10, { accept: [`${s * 10}%`], html: fractionSVG(10, s), label: `${s}/10 shaded as %`, skill: "percentages from pictures", explain: `${s} of the 10 parts are shaded. Each part is 10%, so ${s * 10}%.` });
      }) },
    { id: "n-equivalent", title: "Equivalent fractions", level: "Second", organiser: FDP, blurb: "Fractions that are worth the same.",
      make: () => distinct(10, () => {
        const [a, b] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]), m = rand(3) + 2;
        if (rand(2)) return choice(`Which fraction is the same as ${a}/${b}?`, `${a * m}/${b * m}`, [`${a * m + 1}/${b * m}`, `${a}/${b * m}`], { label: `${a}/${b} = ${a * m}/${b * m}`, skill: "equivalent fractions", explain: `Multiply the top and bottom by ${m}: ${a}/${b} = ${a * m}/${b * m}.` });
        return typed(`${a}/${b} = ?/${b * m}`, a * m, { label: `${a}/${b} = ?/${b * m}`, skill: "equivalent fractions", explain: `The bottom was multiplied by ${m}, so multiply the top by ${m} too: ${a * m}.` });
      }) },
    { id: "n-time-digital", title: "Digital time", level: "First", organiser: TIME, blurb: "Read clocks to 5 minutes and write the digital time.",
      make: () => distinct(10, () => {
        const h = rand(12) + 1, m = rand(12) * 5, ans = `${h}:${pad(m)}`;
        const wrong = [`${m / 5 || 12}:${pad((h % 12) * 5)}`, `${h % 12 + 1}:${pad(m)}`, `${h}:${pad((m + 30) % 60)}`].filter(x => x !== ans);
        return choice("What time does the clock show?", ans, [...new Set(wrong)].slice(0, 2), { html: clockSVG(h, m), label: ans, skill: "telling the time to 5 minutes",
          explain: `The short hand is ${m ? "just past" : "on"} ${h}, and the long hand is on ${m / 5 || 12}: that's ${m} minutes past, so ${ans}.` });
      }) },
    { id: "n-time-24", title: "12-hour and 24-hour time", level: "Second", organiser: TIME, blurb: "Change between am/pm and the 24-hour clock.",
      make: () => distinct(10, () => {
        const h = rand(11) + 1, m = pad(rand(12) * 5), pm = rand(2) === 1;
        const h24 = pm ? `${h + 12}:${m}` : `${pad(h)}:${m}`;
        if (rand(2)) return choice(`What is ${h}:${m} ${pm ? "pm" : "am"} in 24-hour time?`, h24, pm ? [`${pad(h)}:${m}`, `${h + 10}:${m}`] : [`${h + 12}:${m}`, `${h + 10}:${m}`],
          { label: `${h}:${m} ${pm ? "pm" : "am"}`, skill: "12 to 24-hour time", explain: pm ? `Afternoon times add 12 to the hour: ${h} + 12 = ${h + 12}, so ${h24}.` : `Morning times keep the hour, written with two digits: ${h24}.` });
        return choice(`What is ${h24} in 12-hour time?`, `${h}:${m} ${pm ? "pm" : "am"}`, [`${h}:${m} ${pm ? "am" : "pm"}`, `${(h + 1) % 12 + 1}:${m} ${pm ? "pm" : "am"}`],
          { label: `${h24} to 12-hour`, skill: "24 to 12-hour time", explain: pm ? `${h + 12} − 12 = ${h}, and it's after midday, so ${h}:${m} pm.` : `${h24} is before midday, so ${h}:${m} am.` });
      }) },
    { id: "n-durations", title: "How long? Time intervals", level: "First", organiser: TIME, blurb: "Work out how long things take, and time facts.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) {
          const h = rand(12) + 1, d = rand(4) + 1, end = ((h + d - 1) % 12) + 1;
          return choice(`It is ${h} o'clock. What time will it be in ${d} ${d === 1 ? "hour" : "hours"}?`, `${end} o'clock`, others2(`${end} o'clock`, [...new Set([end - 1, end + 1, end + 2, h].map(x => `${((x + 11) % 12) + 1} o'clock`))]),
            { label: `${h} o'clock + ${d} h`, skill: "adding hours", explain: `Count on ${d} from ${h}: ${end} o'clock.` });
        }
        if (k === 1) {
          const h = rand(8) + 1, sm = pick([0, 30]), dur = pick([15, 20, 30, 45, 60, 90]), endMin = sm + dur;
          const end = `${h + Math.floor(endMin / 60)}:${pad(endMin % 60)}`;
          return typed(`A TV show starts at ${h}:${pad(sm)} and ends at ${end}. How many minutes long is it?`, dur, { label: `${h}:${pad(sm)} to ${end}`, skill: "time intervals", explain: `From ${h}:${pad(sm)} to ${end} is ${dur} minutes.` });
        }
        const [q, a] = pick([["minutes are in an hour", 60], ["hours are in a day", 24], ["days are in a week", 7], ["months are in a year", 12], ["seconds are in a minute", 60], ["minutes are in half an hour", 30], ["minutes are in a quarter of an hour", 15]]);
        return typed(`How many ${q}?`, a, { label: q, skill: "time facts", explain: `There are ${a} ${q}.` });
      }) },
    { id: "n-measure", title: "Measuring: rulers, jugs and units", level: "First", organiser: MEAS, blurb: "Read a ruler and a jug, and choose the right unit.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) { const cm = rand(9) + 2; return typed("How long is the yellow strip? (in cm)", cm, { html: rulerSVG(cm), label: `strip ${cm} cm`, skill: "reading a ruler", explain: `The strip starts at 0 and ends at ${cm}, so it is ${cm} cm long.` }); }
        if (k === 1) { const ml = (rand(9) + 1) * 100; return typed("How much water is in the jug? (in ml)", ml, { html: jugSVG(ml), label: `jug ${ml} ml`, skill: "reading a scale", explain: `The water comes up to the ${ml} ml line.` }); }
        const [thing, unit, wrong] = pick([
          ["the length of a pencil", "centimetres", ["metres", "kilometres"]], ["the length of a football pitch", "metres", ["centimetres", "millilitres"]],
          ["the distance from Glasgow to Edinburgh", "kilometres", ["centimetres", "grams"]], ["the weight of an apple", "grams", ["kilograms", "litres"]],
          ["the weight of a bag of potatoes", "kilograms", ["grams", "metres"]], ["the water in a bath", "litres", ["millilitres", "kilograms"]],
          ["the medicine on a spoon", "millilitres", ["litres", "metres"]]]);
        return choice(`Which unit would you use to measure ${thing}?`, unit, wrong, { label: thing, skill: "choosing units", explain: `${thing[0].toUpperCase() + thing.slice(1)} is best measured in ${unit}.` });
      }) },
    { id: "n-units", title: "Changing units", level: "Second", organiser: MEAS, blurb: "Convert between mm, cm, m, g, kg, ml and litres.",
      make: () => distinct(10, () => {
        const n = rand(8) + 1, half = rand(2) ? 0.5 : 0, v = n + half;
        const conv = pick([
          [`How many centimetres are in ${dec(v)} m?`, v * 100, `1 m = 100 cm, so ${dec(v)} × 100 = ${v * 100} cm.`],
          [`${v * 100} cm = ? m`, v, `100 cm = 1 m, so ${v * 100} ÷ 100 = ${dec(v)} m.`],
          [`How many grams are in ${dec(v)} kg?`, v * 1000, `1 kg = 1000 g, so ${dec(v)} × 1000 = ${v * 1000} g.`],
          [`${v * 1000} g = ? kg`, v, `1000 g = 1 kg, so ${v * 1000} ÷ 1000 = ${dec(v)} kg.`],
          [`How many millilitres are in ${dec(v)} litres?`, v * 1000, `1 litre = 1000 ml, so ${dec(v)} × 1000 = ${v * 1000} ml.`],
          [`How many millimetres are in ${n} cm?`, n * 10, `1 cm = 10 mm, so ${n} × 10 = ${n * 10} mm.`]]);
        return typed(conv[0], dec(conv[1]), { input: "decimal", label: conv[0], skill: "converting units", explain: conv[2] });
      }) },
    { id: "n-area", title: "Area and perimeter", level: "Second", organiser: MEAS, blurb: "Find the perimeter and area of rectangles.",
      make: () => distinct(10, () => {
        const w = rand(9) + 3, h = rand(6) + 2;
        if (rand(2)) return typed("What is the perimeter of this rectangle? (in cm)", 2 * (w + h), { html: rectSVG(w, h), label: `perimeter ${w}×${h}`, skill: "perimeter", explain: `Add all four sides: ${w} + ${h} + ${w} + ${h} = ${2 * (w + h)} cm.` });
        return typed("What is the area of this rectangle? (in cm²)", w * h, { html: rectSVG(w, h), label: `area ${w}×${h}`, skill: "area", explain: `Length × breadth: ${w} × ${h} = ${w * h} cm².` });
      }) },
    { id: "n-tally", title: "Tally marks", level: "Early", organiser: DATA, blurb: "Count tally marks in fives.",
      make: () => distinct(10, () => { const n = rand(17) + 2; return typed("How many does the tally show?", n, { html: tallySVG(n), label: `tally ${n}`, skill: "reading tallies", explain: `Each gate of five counts 5: ${Math.floor(n / 5) ? `${Math.floor(n / 5)} × 5 = ${Math.floor(n / 5) * 5}, and ${n % 5} more makes ${n}` : `there are ${n} marks`}.` }); }) },
    { id: "n-bar", title: "Bar charts", level: "First", organiser: DATA, blurb: "Read and compare the bars on a chart.",
      make: () => distinct(10, () => {
        const [title, cats] = pick([["Favourite fruit", ["apples", "bananas", "grapes", "pears"]], ["Our pets", ["dogs", "cats", "fish", "rabbits"]],
          ["How we get to school", ["walk", "car", "bus", "bike"]], ["Favourite sport", ["football", "swimming", "dance", "rugby"]]]);
        const vals = shuffle(range(1, 10)).slice(0, 4);
        const html = barSVG(title, cats, vals);
        const k = rand(4), i = rand(4), j = (i + 1 + rand(3)) % 4, big = vals[i] > vals[j] ? i : j, small = big === i ? j : i;
        const top = vals.indexOf(Math.max(...vals));
        const id = `${title} ${vals.join(",")}`;
        if (k === 0) return typed(`How many chose ${cats[i]}?`, vals[i], { html, label: `${id} ${cats[i]}`, skill: "reading a bar chart", explain: `The ${cats[i]} bar reaches ${vals[i]}.` });
        if (k === 1) return choice("Which was the most popular?", cats[top], others2(cats[top], cats), { html, label: `${id} most`, skill: "comparing data", explain: `The ${cats[top]} bar is the tallest.` });
        if (k === 2) return typed(`How many more chose ${cats[big]} than ${cats[small]}?`, vals[big] - vals[small], { html, label: `${id} ${big}-${small}`, skill: "finding the difference", explain: `${vals[big]} − ${vals[small]} = ${vals[big] - vals[small]}.` });
        return typed("How many altogether?", vals.reduce((a, b) => a + b, 0), { html, label: `${id} total`, skill: "totals from data", explain: `${vals.join(" + ")} = ${vals.reduce((a, b) => a + b, 0)}.` });
      }) },
    { id: "n-table", title: "Reading tables", level: "Second", organiser: DATA, blurb: "Find and compare information in a table.",
      make: () => distinct(10, () => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], temps = shuffle(range(2, 16)).slice(0, 5);
        const html = tableHTML(["Day", "Temperature at noon"], days.map((d, i) => [d, `${temps[i]}°C`]));
        const hot = days[temps.indexOf(Math.max(...temps))], cold = days[temps.indexOf(Math.min(...temps))], i = rand(5), k = rand(3);
        const id = temps.join(",");
        if (k === 0) return choice("Which day was the warmest?", hot, others2(hot, days), { html, label: `${id} warmest`, skill: "reading a table", explain: `${hot} had the highest temperature: ${Math.max(...temps)}°C.` });
        if (k === 1) return typed("How many degrees warmer was the warmest day than the coldest day?", Math.max(...temps) - Math.min(...temps), { html, label: `${id} range`, skill: "finding the difference", explain: `${hot} was ${Math.max(...temps)}°C and ${cold} was ${Math.min(...temps)}°C: ${Math.max(...temps) - Math.min(...temps)} degrees.` });
        return choice(`On which day was it ${temps[i]}°C?`, days[i], others2(days[i], days), { html, label: `${id} ${i}`, skill: "reading a table", explain: `The table shows ${temps[i]}°C next to ${days[i]}.` });
      }) },
    { id: "n-chance", title: "How likely is it?", level: "First", organiser: CHANCE, blurb: "Certain, likely, even chance, unlikely or impossible.",
      make: () => distinct(10, () => {
        const WORDS = ["Certain", "Likely", "Even chance", "Unlikely", "Impossible"];
        if (rand(4) === 0) {
          const [event, ans] = pick([["The sun will rise tomorrow.", "Certain"], ["You roll a 7 on a normal dice.", "Impossible"], ["A coin lands on heads.", "Even chance"], ["You roll a number from 1 to 6 on a normal dice.", "Certain"], ["You roll a 6 on a normal dice.", "Unlikely"]]);
          return choice(`How likely is this? ${event}`, ans, others2(ans, WORDS), { label: event, skill: "describing chance", explain: `${event} The answer is: ${ans.toLowerCase()}.` });
        }
        const red = rand(5), blue = rand(5) + (red ? 0 : 1);
        if (!red && !blue) return { label: "none" };
        const colour = pick(["red", "blue"]), mine = colour === "red" ? red : blue, total = red + blue;
        const ans = mine === total ? "Certain" : mine === 0 ? "Impossible" : mine * 2 === total ? "Even chance" : mine * 2 > total ? "Likely" : "Unlikely";
        const bag = red && blue ? `${red} red and ${blue} blue counters` : red ? `${red} red counters and no blue ones` : `${blue} blue counters and no red ones`;
        return choice(`A bag has ${bag}. How likely is it that you pick a ${colour} one without looking?`, ans, others2(ans, WORDS),
          { html: countersSVG(red, blue), label: `${red}r ${blue}b ${colour}`, skill: "chance with counters", explain: `${mine} of the ${total} counters are ${colour}, so it is ${ans.toLowerCase()}.` });
      }).filter(q => q.kind) },
    { id: "m-shapes-2d", title: "2D shapes", level: "First", organiser: SHAPE, blurb: "Name 2D shapes and count their sides.",
      make: () => distinct(10, () => {
        const names = Object.keys(SHAPES), name = pick(names);
        if (rand(2) || name === "circle") return choice("What is this shape called?", name, others2(name, names), { html: shapeSVG(name), label: `name ${name}`, skill: "naming 2D shapes", explain: `It is a ${name}${SHAPES[name] ? `: it has ${SHAPES[name]} straight sides` : ": it is perfectly round"}.` });
        return typed(`How many sides does a ${name} have?`, SHAPES[name], { label: `sides of ${name}`, skill: "properties of 2D shapes", explain: `A ${name} has ${SHAPES[name]} sides.` });
      }) },
    { id: "m-shapes-3d", title: "3D objects", level: "First", organiser: SHAPE, blurb: "Name 3D objects from their faces, edges and corners.",
      make: () => distinct(10, () => {
        const OBJECTS = [["has 6 square faces, like a dice", "cube"], ["has 6 rectangle faces, like a cereal box", "cuboid"], ["has a square base and 4 triangle faces that meet at a point", "square-based pyramid"],
          ["is perfectly round, like a ball", "sphere"], ["has 2 circle faces and 1 curved face, like a tin of beans", "cylinder"], ["has 1 circle face and a point, like an ice cream cone", "cone"],
          ["has 2 triangle faces and 3 rectangle faces, like a tent", "triangular prism"]];
        if (rand(2)) { const [d, name] = pick(OBJECTS); return choice(`Which 3D object ${d}?`, name, others2(name, OBJECTS.map(o => o[1])), { label: `object ${name}`, skill: "naming 3D objects", explain: `A ${name} ${d.replace(/, like.*/, "")}.` }); }
        const FACTS = { cube: [6, 12, 8], cuboid: [6, 12, 8], "square-based pyramid": [5, 8, 5], "triangular prism": [5, 9, 6] };
        const name = pick(Object.keys(FACTS)), k = rand(3), what = ["faces", "edges", "corners (vertices)"][k];
        return typed(`How many ${what} does a ${name} have?`, FACTS[name][k], { label: `${what} of ${name}`, skill: "properties of 3D objects", explain: `A ${name} has ${FACTS[name][0]} faces, ${FACTS[name][1]} edges and ${FACTS[name][2]} corners.` });
      }) },
    { id: "m-angles", title: "Angles and turns", level: "Second", organiser: ANGLE, blurb: "Acute, right and obtuse angles, degrees and compass turns.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) {
          const deg = pick([20, 30, 40, 50, 60, 70, 90, 90, 110, 120, 130, 140, 150, 160]), ans = deg < 90 ? "acute" : deg === 90 ? "right angle" : "obtuse";
          return choice("What kind of angle is this?", ans, ["acute", "right angle", "obtuse"].filter(x => x !== ans), { html: angleSVG(deg), label: `angle ${deg}`, skill: "types of angle",
            explain: ans === "acute" ? "It is smaller than a right angle, so it is acute." : ans === "obtuse" ? "It is bigger than a right angle but less than a straight line, so it is obtuse." : "It makes a square corner: a right angle." });
        }
        if (k === 1) { const [q, a] = pick([["a right angle", 90], ["a straight line", 180], ["a full turn", 360], ["a half turn", 180], ["a quarter turn", 90]]); return typed(`How many degrees are in ${q}?`, a, { label: `degrees in ${q}`, skill: "degrees", explain: `There are ${a}° in ${q}.` }); }
        const DIRS = ["north", "east", "south", "west"], from = rand(4), turns = rand(3) + 1, clockwise = rand(2) === 1;
        const to = DIRS[(from + (clockwise ? turns : 4 - turns)) % 4], turn = ["a quarter", "a half", "three quarters of a"][turns - 1];
        return choice(`You face ${DIRS[from]} and make ${turn} turn ${clockwise ? "clockwise" : "anticlockwise"}. Which way do you face now?`, to, others2(to, DIRS),
          { label: `${DIRS[from]} ${turns} ${clockwise}`, skill: "compass turns", explain: `Turning ${clockwise ? "clockwise" : "anticlockwise"} from ${DIRS[from]}, ${turn} turn brings you to ${to}.` });
      }) },
    { id: "m-patterns-early", title: "Repeating patterns", level: "Early", organiser: PATTERN, blurb: "What comes next in a pattern of shapes and colours?",
      make: () => distinct(8, () => {
        const kinds = shuffle(["circle", "square", "triangle"]), colours = shuffle(["red", "blue", "yellow", "green"]);
        const unit = pick([["a", "b"], ["a", "a", "b"], ["a", "b", "b"], ["a", "b", "c"]]);
        const byColour = rand(2) === 1;
        const item = x => (byColour ? [kinds[0], colours["abc".indexOf(x)]] : [kinds["abc".indexOf(x)], colours[0]]);
        const seq = Array.from({ length: unit.length * 2 + 1 }, (_, i) => item(unit[i % unit.length]));
        const next = item(unit[seq.length % unit.length]);
        const word = it => (byColour ? it[1] : it[0]);
        const pool = byColour ? colours.slice(0, 3) : kinds;
        return choice("What comes next in the pattern?", word(next), others2(word(next), pool), { html: patternSVG(seq),
          label: `${unit.join("")} ${byColour ? "colour" : "shape"} ${seq.map(word).join(",")}`, skill: "repeating patterns", explain: `The pattern repeats ${unit.map(x => word(item(x))).join(", ")}, so next is ${word(next)}.` });
      }) },
    { id: "m-patterns", title: "Number patterns", level: "First", organiser: PATTERN, blurb: "Find the next number, or the missing one, in a pattern.",
      make: () => distinct(10, () => {
        const d = pick([2, 3, 4, 5, 10, -2, -3, -5]), s = d > 0 ? rand(20) + 1 : rand(20) + 5 * -d + 5;
        const seq = range(0, 4).map(i => s + i * d);
        if (rand(2)) return typed(`What comes next? ${seq.slice(0, 4).join(", ")}, …`, seq[4], { label: `${seq.join(",")} next`, skill: "continuing patterns", explain: `It goes ${d > 0 ? "up" : "down"} by ${Math.abs(d)} each time: ${seq[3]} ${d > 0 ? "+" : "−"} ${Math.abs(d)} = ${seq[4]}.` });
        const gap = rand(3) + 1;
        return typed(`What is the missing number? ${seq.map((v, i) => (i === gap ? "?" : v)).join(", ")}`, seq[gap], { label: `${seq.join(",")} gap ${gap}`, skill: "missing numbers in patterns", explain: `It goes ${d > 0 ? "up" : "down"} by ${Math.abs(d)} each time, so the missing number is ${seq[gap]}.` });
      }) },
    { id: "m-equations", title: "Missing numbers and signs", level: "First", organiser: EQUATION, blurb: "Find the missing number, and use <, > and =.",
      make: () => distinct(10, () => {
        const k = rand(4), a = rand(12) + 1, b = rand(12) + 1;
        if (k === 0) return typed(`? + ${b} = ${a + b}`, a, { label: `? + ${b} = ${a + b}`, skill: "missing number: adding", explain: `${a + b} − ${b} = ${a}, so ? is ${a}.` });
        if (k === 1) return typed(`${a + b} − ? = ${a}`, b, { label: `${a + b} − ? = ${a}`, skill: "missing number: taking away", explain: `${a + b} − ${a} = ${b}, so ? is ${b}.` });
        if (k === 2) { const t = rand(9) + 2, n = rand(9) + 2; return typed(`${t} × ? = ${t * n}`, n, { label: `${t} × ? = ${t * n}`, skill: "missing number: multiplying", explain: `${t * n} ÷ ${t} = ${n}, so ? is ${n}.` }); }
        const ans = a < b ? "<" : a > b ? ">" : "=";
        return choice(`Which sign makes this true? ${a} __ ${b}`, ans, ["<", ">", "="].filter(x => x !== ans), { label: `${a} ? ${b}`, skill: "using <, > and =", explain: ans === "=" ? `${a} is the same as ${b}.` : `${a} is ${ans === "<" ? "less" : "more"} than ${b}, so ${a} ${ans} ${b}.` });
      }) }
  ].map(a => Object.assign(a, { check: false })); // the starting check sticks to the core number activities

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
        return choice("Which sentence is written correctly?", s, [lower, s.slice(0, -1)], { label: w, sayOptions: false, skill: "capital letters and full stops", explain: "A sentence starts with a capital letter and ends with a full stop." });
      }) },
    { id: "w-end-marks", title: "Full stop, question mark or exclamation mark?", level: "First", organiser: WRITE, blurb: "Choose the right mark for the end of each sentence.",
      make: () => shuffle(END_MARKS.map(([s, mark], i) => [s, mark, i + 1])).slice(0, 10).map(([s, mark, n]) => choice(`${s} ___`, mark, [".", "?", "!"].filter(m => m !== mark),
        { label: s, sayOptions: false, skill: mark === "?" ? "question marks" : mark === "!" ? "exclamation marks" : "full stops", say: { text: s + mark, clip: `audio/phrases/end-mark-${n}.mp3` }, explain: mark === "?" ? "It asks something, so it needs a question mark." : mark === "!" ? "It's said with strong feeling, so it needs an exclamation mark." : "It tells us something, so it needs a full stop." })) },
    { id: "w-joining", title: "Joining words: and, but, because, so", level: "First", organiser: WRITE, blurb: "Choose the best word to join the two parts.",
      make: () => shuffle(JOINING).slice(0, 10).map(([a, b, w]) => choice(`${a} ___ ${b}`, w, ["and", "but", "because", "so"].filter(x => x !== w).slice(0, 2),
        { label: `${a} … ${w}`, skill: `using "${w}"`, explain: `"${a} ${w} ${b}"` })) },
    { id: "w-past-ed", title: "Past tense: adding -ed", level: "First", organiser: WRITE, blurb: "Today I jump. Yesterday I …",
      make: () => shuffle(PAST).slice(0, 10).map(v => Object.assign(typed(`Today I ${v}. Yesterday I ___.`, `${v}ed`, { input: "text" }),
        { label: `${v} → ${v}ed`, skill: "past tense -ed", explain: `Add -ed: ${v}ed.` })) }
  ];

  /* ---------- Grammar and punctuation by year (English Appendix 2, the national curriculum in England) ---------- */

  // Each item: [question, answer, [wrong answers], why]. Sentences to choose between aren't read
  // out as options, because hearing them gives away the punctuation.
  const GRAMMAR = "Literacy · Writing · Tools for writing";
  const bank = (items, skill, extra = {}) => () => shuffle(items).slice(0, 10).map(([q, answer, others, why]) =>
    choice(q, answer, others, Object.assign({ label: `${q} → ${answer}`, skill, explain: why }, extra)));
  const bankSentences = (prompt, items, skill) => () => shuffle(items).slice(0, 10).map(([answer, others, why]) =>
    choice(prompt, answer, others, { label: answer, skill, explain: why, sayOptions: false }));
  const g = (id, title, level, blurb, make) => ({ id, title, level, organiser: GRAMMAR, blurb, make });

  const ES = "If you can hear an extra beat at the end (wish-es), add -es. If not, just add -s.";
  const grammarByYear = [
    g("eg-y1-plurals", "Year 1: one or more (adding -s or -es)", "First", "One dog, two dogs. One wish, two wishes.", bank([
      ["One dog, two ___.", "dogs", ["doges", "dog"], ES], ["One wish, two ___.", "wishes", ["wishs", "wish"], ES],
      ["One fox, two ___.", "foxes", ["foxs", "fox"], ES], ["One cat, two ___.", "cats", ["cates", "cat"], ES],
      ["One bus, two ___.", "buses", ["buss", "bus"], ES], ["One box, two ___.", "boxes", ["boxs", "box"], ES],
      ["One hat, two ___.", "hats", ["hates", "hat"], ES], ["One dish, two ___.", "dishes", ["dishs", "dish"], ES],
      ["One church, two ___.", "churches", ["churchs", "church"], ES], ["One frog, two ___.", "frogs", ["froges", "frog"], ES],
      ["One brush, two ___.", "brushes", ["brushs", "brush"], ES], ["One bell, two ___.", "bells", ["belles", "bell"], ES]
    ], "plurals with -s and -es")),
    g("eg-y1-un", "Year 1: the prefix un-", "First", "Adding un- to the start of a word changes its meaning.", bank([
      ["Not kind is ___.", "unkind", ["kindly", "kinder"], "un- means not: unkind means not kind."],
      ["Not happy is ___.", "unhappy", ["happier", "happily"], "un- means not: unhappy means not happy."],
      ["Not fair is ___.", "unfair", ["fairer", "fairly"], "un- means not: unfair means not fair."],
      ["Not well is ___.", "unwell", ["welly", "weller"], "un- means not: unwell means not well."],
      ["Take the knot out: ___ the boat.", "untie", ["tied", "ties"], "un- can mean undoing something: untie the boat."],
      ["Open the lock: ___ the door.", "unlock", ["locked", "locks"], "un- can mean undoing something: unlock the door."],
      ["Take things out of a bag: ___ the bag.", "unpack", ["packed", "packs"], "un- can mean undoing something: unpack the bag."],
      ["Open a zip: ___ your coat.", "unzip", ["zipped", "zips"], "un- can mean undoing something: unzip your coat."],
      ["Not safe is ___.", "unsafe", ["safer", "safely"], "un- means not: unsafe means not safe."],
      ["Not able to be seen is ___.", "unseen", ["seeing", "seer"], "un- means not: unseen means not seen."]
    ], "the prefix un-")),
    g("eg-y1-capitals", "Year 1: capital letters for names and I", "First", "Names of people, places and days, and the word I, start with a capital letter.", bankSentences("Which sentence is written correctly?", [
      ["Sam and I went to the park.", ["sam and i went to the park.", "Sam and i went to the park."], "Names and the word I always have a capital letter."],
      ["On Monday I saw Gran.", ["On monday I saw gran.", "on Monday i saw Gran."], "Days of the week, names and I have capital letters."],
      ["Ben lives in Leeds.", ["ben lives in leeds.", "Ben lives in leeds."], "Names of people and places have capital letters."],
      ["Can I play with Ava?", ["can i play with ava?", "Can i play with Ava?"], "Start the sentence, the word I and names with a capital letter."],
      ["We go swimming on Friday.", ["we go swimming on friday.", "We go swimming on friday."], "Start the sentence and the days of the week with a capital letter."],
      ["My dog is called Max.", ["my dog is called max.", "My dog is called max."], "Start the sentence and names with a capital letter."],
      ["I live near London.", ["i live near london.", "I live near london."], "The word I and place names have capital letters."],
      ["Mia and I like Tuesday best.", ["mia and i like tuesday best.", "Mia and i like tuesday best."], "Names, days and the word I have capital letters."]
    ], "capital letters for names and I")),

    g("eg-y2-apostrophes", "Year 2: apostrophes for missing letters and belonging", "First", "can't, it's, the girl's name.", bank([
      ["Shorten \"do not\": ___", "don't", ["dont", "do'nt"], "The apostrophe goes where the missing letter (o) was."],
      ["Shorten \"can not\": ___", "can't", ["cant", "ca'nt"], "The apostrophe shows the missing letters."],
      ["Shorten \"I am\": ___", "I'm", ["Im", "I'am"], "The apostrophe goes where the a was."],
      ["Shorten \"it is\": ___", "it's", ["its", "it'is"], "It's means it is. The apostrophe goes where the i was."],
      ["Shorten \"did not\": ___", "didn't", ["didnt", "did'nt"], "The apostrophe goes where the o was."],
      ["Shorten \"we will\": ___", "we'll", ["well", "we'ill"], "The apostrophe goes where the letters wi were."],
      ["Shorten \"could not\": ___", "couldn't", ["couldnt", "could'nt"], "The apostrophe goes where the o was."],
      ["The name of the girl is the ___ name.", "girl's", ["girls", "girls'"], "One girl owns it, so add 's: the girl's name."],
      ["The bone that belongs to the dog is the ___ bone.", "dog's", ["dogs", "dogs'"], "One dog owns it, so add 's: the dog's bone."],
      ["The hat that belongs to Ravi is ___ hat.", "Ravi's", ["Ravis", "Ravis'"], "Ravi owns it, so add 's: Ravi's hat."],
      ["The bike that belongs to the man is the ___ bike.", "man's", ["mans", "mans'"], "One man owns it, so add 's: the man's bike."]
    ], "apostrophes")),
    g("eg-y2-suffixes", "Year 2: -ness, -ful, -less, -er, -est and -ly", "First", "kind becomes kindness, care becomes careful, quick becomes quickly.", bank([
      ["Full of care: ___", "careful", ["careless", "carer"], "-ful means full of."],
      ["Without hope: ___", "hopeless", ["hopeful", "hoping"], "-less means without."],
      ["Being kind: ___", "kindness", ["kindly", "kinder"], "-ness turns an adjective into a noun: kindness."],
      ["Being sad: ___", "sadness", ["sadly", "sadder"], "-ness turns an adjective into a noun: sadness."],
      ["She ran ___. (quick)", "quickly", ["quicker", "quickness"], "-ly turns an adjective into an adverb, telling us how she ran."],
      ["He spoke ___. (soft)", "softly", ["softer", "softness"], "-ly turns an adjective into an adverb, telling us how he spoke."],
      ["Ben is tall. Sam is ___.", "taller", ["tallest", "tallly"], "-er compares two things."],
      ["Mia is the ___ in the class. (tall)", "tallest", ["taller", "tallness"], "-est is for the most of all."],
      ["Without fear: ___", "fearless", ["fearful", "fearing"], "-less means without."],
      ["Full of play: ___", "playful", ["playless", "player"], "-ful means full of."]
    ], "suffixes")),
    g("eg-y2-sentence-types", "Year 2: statement, question, exclamation or command?", "First", "What kind of sentence is it?", bank([
      ["\"Shut the door.\" is a ___.", "command", ["question", "statement"], "It tells someone to do something, so it's a command."],
      ["\"What time is it?\" is a ___.", "question", ["command", "exclamation"], "It asks something, so it's a question."],
      ["\"What a big dog that is!\" is an ___.", "exclamation", ["question", "command"], "It starts with What and shows strong feeling, so it's an exclamation."],
      ["\"The cat is asleep.\" is a ___.", "statement", ["command", "question"], "It tells us something, so it's a statement."],
      ["\"How tall you have grown!\" is an ___.", "exclamation", ["question", "statement"], "It starts with How and shows strong feeling, so it's an exclamation."],
      ["\"Put your coat on.\" is a ___.", "command", ["statement", "exclamation"], "It tells someone to do something, so it's a command."],
      ["\"Where do you live?\" is a ___.", "question", ["statement", "command"], "It asks something, so it's a question."],
      ["\"It is sunny today.\" is a ___.", "statement", ["question", "exclamation"], "It tells us something, so it's a statement."],
      ["\"Wash your hands.\" is a ___.", "command", ["question", "statement"], "It tells someone to do something, so it's a command."],
      ["\"Can you swim?\" is a ___.", "question", ["command", "exclamation"], "It asks something, so it's a question."]
    ], "sentence types", { sayOptions: true })),
    g("eg-y2-commas-tense", "Year 2: commas in lists, and past or present", "First", "eggs, milk and bread. She is drumming. He was shouting.", () => shuffle([
      ...[["I need eggs, milk and bread.", ["I need eggs milk, and bread.", "I need, eggs milk and bread."]],
        ["We saw a cow, a pig and a hen.", ["We saw a cow a pig, and a hen.", "We saw, a cow a pig and a hen."]],
        ["Pack a hat, a coat and some boots.", ["Pack a hat a coat, and some boots.", "Pack, a hat a coat and some boots."]],
        ["Red, blue and green are colours.", ["Red blue, and green are colours.", "Red blue and, green are colours."]]]
        .map(([a, o]) => choice("Which list is punctuated correctly?", a, o, { label: a, skill: "commas in lists", sayOptions: false, explain: "Put a comma between the items, but not before and." })),
      ...[["Yesterday I ___ football.", "played", ["play", "am playing"], "Yesterday is in the past, so: played."],
        ["Right now she ___ the drum.", "is drumming", ["drummed", "was drumming"], "Right now is happening now: is drumming."],
        ["Last night he ___ for help.", "was shouting", ["is shouting", "shouts"], "Last night is in the past and went on for a while: was shouting."],
        ["Every day we ___ to school.", "walk", ["walked", "was walking"], "Every day is the present: we walk."],
        ["Last week they ___ a castle.", "visited", ["visit", "are visiting"], "Last week is in the past: visited."],
        ["At the moment I ___ a book.", "am reading", ["read", "was reading"], "At the moment is happening now: am reading."]]
        .map(([q, a, o, why]) => choice(q, a, o, { label: q, skill: "past and present tense", explain: why }))
    ]).slice(0, 10)),

    g("eg-y3-a-an", "Year 3: a or an?", "First", "a rock, an open box.", bank([
      ["___ apple", "an", ["a"], "Use an before a vowel sound: an apple."], ["___ rock", "a", ["an"], "Use a before a consonant: a rock."],
      ["___ open box", "an", ["a"], "Open starts with a vowel, so: an open box."], ["___ egg", "an", ["a"], "Egg starts with a vowel, so: an egg."],
      ["___ banana", "a", ["an"], "Banana starts with a consonant, so: a banana."], ["___ orange", "an", ["a"], "Orange starts with a vowel, so: an orange."],
      ["___ elephant", "an", ["a"], "Elephant starts with a vowel, so: an elephant."], ["___ kite", "a", ["an"], "Kite starts with a consonant, so: a kite."],
      ["___ igloo", "an", ["a"], "Igloo starts with a vowel, so: an igloo."], ["___ table", "a", ["an"], "Table starts with a consonant, so: a table."],
      ["___ ant", "an", ["a"], "Ant starts with a vowel, so: an ant."], ["___ dog", "a", ["an"], "Dog starts with a consonant, so: a dog."]
    ], "a or an")),
    g("eg-y3-prefixes", "Year 3: prefixes super-, anti-, auto- and more", "First", "supermarket, anti-clockwise, autograph.", bank([
      ["A big shop is a ___market.", "super", ["anti", "auto"], "super- means above or more: supermarket."],
      ["Going the opposite way to a clock: ___-clockwise.", "anti", ["super", "auto"], "anti- means against: anti-clockwise."],
      ["A famous person's signature is an ___graph.", "auto", ["anti", "super"], "auto- means self: autograph."],
      ["The story of your own life is an ___biography.", "auto", ["super", "anti"], "auto- means self: autobiography."],
      ["Not agree: ___agree", "dis", ["mis", "re"], "dis- has a negative meaning: disagree."],
      ["Behave badly: ___behave", "mis", ["dis", "re"], "mis- means wrongly: misbehave."],
      ["Do it again: ___do", "re", ["dis", "sub"], "re- means again: redo."],
      ["A boat that goes under the sea: ___marine", "sub", ["super", "re"], "sub- means under: submarine."],
      ["Between nations: ___national", "inter", ["sub", "anti"], "inter- means between: international."],
      ["A star who is very famous: ___star", "super", ["anti", "sub"], "super- means above: superstar."]
    ], "prefixes")),
    g("eg-y3-time-cause", "Year 3: words for when, where and why", "First", "Conjunctions, adverbs and prepositions: when, before, so, during.", bank([
      ["We stayed in ___ it was raining.", "because", ["after", "soon"], "because tells us why (cause)."],
      ["Brush your teeth ___ you go to bed.", "before", ["because", "during"], "before tells us when (time)."],
      ["We played games ___ the break.", "during", ["because", "so"], "during tells us when (a preposition of time)."],
      ["I was hungry, ___ I ate an apple.", "so", ["during", "before"], "so tells us what happened because of it."],
      ["We had lunch. ___, we went swimming.", "Then", ["Because", "During"], "Then is an adverb that tells us when."],
      ["The bus was late ___ the snow.", "because of", ["after that", "while"], "because of tells us why (a preposition of cause)."],
      ["Wait here ___ I find my coat.", "while", ["because of", "therefore"], "while tells us when, at the same time."],
      ["It was cold. ___, we wore our hats.", "Therefore", ["During", "While"], "Therefore is an adverb that shows cause."],
      ["The cat hid ___ the sofa.", "under", ["because", "so"], "under tells us where (a preposition of place)."],
      ["___ the film, we went home.", "After", ["Because", "So"], "After tells us when."]
    ], "conjunctions, adverbs and prepositions")),
    g("eg-y3-perfect-speech", "Year 3: has gone or went? and speech marks", "First", "He has gone out to play. \"Come here,\" said Mum.", () => shuffle([
      ...[["He ___ out to play. He's still outside now.", "has gone", ["went", "go"], "Use has gone when it's still true now (the present perfect)."],
        ["I ___ my homework, so I can play now.", "have finished", ["finish", "finishing"], "Use have finished when the result matters now."],
        ["Yesterday he ___ out to play.", "went", ["has gone", "goes"], "Yesterday is a finished time, so use the simple past: went."],
        ["She ___ her book. She can't find it anywhere.", "has lost", ["loses", "losing"], "It's still lost now, so: has lost."],
        ["We ___ to France last summer.", "went", ["have gone", "go"], "Last summer is a finished time, so: went."]]
        .map(([q, a, o, why]) => choice(q, a, o, { label: q, skill: "the present perfect", explain: why })),
      ...[["\"Come here,\" said Mum.", ["Come here, said Mum.", "\"Come here, said Mum.\""]],
        ["\"I like cake,\" said Ben.", ["I like cake, said Ben.", "\"I like cake, said Ben.\""]],
        ["Ava asked, \"Can I come?\"", ["Ava asked, Can I come?", "\"Ava asked, Can I come?\""]],
        ["\"Run!\" shouted Sam.", ["Run! shouted Sam.", "\"Run! shouted Sam.\""]],
        ["\"It's my turn,\" said Mia.", ["It's my turn, said Mia.", "\"It's my turn, said Mia\""]]]
        .map(([a, o]) => choice("Which uses inverted commas (speech marks) correctly?", a, o, { label: a, skill: "inverted commas", sayOptions: false, explain: "Speech marks go around only the words that are said." }))
    ]).slice(0, 10)),

    g("eg-y4-fronted", "Year 4: fronted adverbials and their commas", "Second", "Later that day, I heard the bad news.", () => shuffle([
      ...[["Later that day, I heard the bad news.", ["Later that day I, heard the bad news.", "Later, that day I heard the bad news."]],
        ["After lunch, we played football.", ["After, lunch we played football.", "After lunch we, played football."]],
        ["In the morning, the birds sang.", ["In the, morning the birds sang.", "In the morning the birds, sang."]],
        ["Without a sound, the fox crept past.", ["Without a sound the fox, crept past.", "Without, a sound the fox crept past."]],
        ["As fast as he could, Sam ran home.", ["As fast as he, could Sam ran home.", "As fast, as he could Sam ran home."]]]
        .map(([a, o]) => choice("Which sentence has the comma in the right place?", a, o, { label: a, skill: "commas after fronted adverbials", sayOptions: false, explain: "Put a comma after the fronted adverbial, the words at the start that say when, where or how." })),
      ...[["After lunch, we played football.", "After lunch", ["we played", "football"]], ["Last night, it snowed.", "Last night", ["it snowed", "snowed"]],
        ["Under the bridge, a troll was waiting.", "Under the bridge", ["a troll", "was waiting"]], ["Slowly, the door opened.", "Slowly", ["the door", "opened"]],
        ["Every Saturday, I visit Gran.", "Every Saturday", ["I visit", "Gran"]]]
        .map(([s, a, o]) => choice(`Which words are the fronted adverbial? "${s}"`, a, o, { label: s, skill: "fronted adverbials", explain: `"${a}" comes first and tells us when, where or how.` }))
    ]).slice(0, 10)),
    g("eg-y4-possessive", "Year 4: plural or possessive -s?", "Second", "the girl's name, the girls' names.", bank([
      ["The coats of the girls are the ___ coats.", "girls'", ["girl's", "girls"], "More than one girl ends in s already, so the apostrophe goes after: girls'."],
      ["The name of one girl is the ___ name.", "girl's", ["girls'", "girls"], "One girl: add 's."],
      ["Three ___ are barking.", "dogs", ["dog's", "dogs'"], "This just means more than one dog, so no apostrophe."],
      ["The toys of the children are the ___ toys.", "children's", ["childrens'", "childrens"], "Children doesn't end in s, so add 's: children's."],
      ["The bags of the boys are the ___ bags.", "boys'", ["boy's", "boys"], "More than one boy ends in s, so the apostrophe goes after: boys'."],
      ["The cheese the mice ate was the ___ cheese.", "mice's", ["mices'", "mices"], "Mice doesn't end in s, so add 's: mice's."],
      ["Two ___ sat on the wall.", "cats", ["cat's", "cats'"], "This just means more than one cat, so no apostrophe."],
      ["The pens of the teachers are the ___ pens.", "teachers'", ["teacher's", "teachers"], "More than one teacher ends in s, so the apostrophe goes after: teachers'."],
      ["The hats of the men are the ___ hats.", "men's", ["mens'", "mens"], "Men doesn't end in s, so add 's: men's."],
      ["The room of the babies is the ___ room.", "babies'", ["baby's", "babies"], "More than one baby ends in s, so the apostrophe goes after: babies'."]
    ], "possessive apostrophes")),
    g("eg-y4-standard", "Year 4: we were, I did (Standard English)", "Second", "Use we were, not we was; I did, not I done.", bank([
      ["We ___ late for school.", "were", ["was", "is"], "In Standard English it's we were, not we was."],
      ["I ___ my homework last night.", "did", ["done", "doed"], "In Standard English it's I did, not I done."],
      ["They ___ playing outside.", "were", ["was", "is"], "In Standard English it's they were."],
      ["She ___ the film yesterday.", "saw", ["seen", "seed"], "In Standard English it's she saw, not she seen."],
      ["You ___ really kind.", "were", ["was", "is"], "In Standard English it's you were."],
      ["He ___ to the shop.", "went", ["gone", "goed"], "In Standard English it's he went, not he gone."],
      ["We ___ our lunch already.", "have eaten", ["have ate", "eaten"], "In Standard English it's we have eaten, not we have ate."],
      ["I ___ a picture for Gran.", "drew", ["drawed", "drawn"], "In Standard English it's I drew."],
      ["Sam and I ___ tired.", "were", ["was", "is"], "Sam and I is more than one person, so: were."],
      ["They ___ the race.", "won", ["winned", "wined"], "In Standard English it's they won."]
    ], "Standard English verb forms")),

    g("eg-y5-relative", "Year 5: relative clauses (who, which, where, when, whose, that)", "Second", "The girl who won the race is my sister.", bank([
      ["The girl ___ won the race is my sister.", "who", ["which", "where"], "Use who for a person."],
      ["The house ___ I live is old.", "where", ["who", "whose"], "Use where for a place."],
      ["My dog, ___ is called Rex, loves walks.", "which", ["who", "where"], "Use which for an animal or thing."],
      ["The boy ___ bike was stolen felt sad.", "whose", ["who", "which"], "Use whose for belonging."],
      ["I remember the day ___ it snowed.", "when", ["where", "who"], "Use when for a time."],
      ["This is the book ___ I like best.", "that", ["who", "where"], "Use that (or which) for a thing."],
      ["Our teacher, ___ is very kind, gave us a sticker.", "who", ["which", "whose"], "Use who for a person."],
      ["The park ___ we play is near the river.", "where", ["when", "which"], "Use where for a place."],
      ["The man ___ car broke down called for help.", "whose", ["who", "which"], "Use whose for belonging."],
      ["The cake, ___ Mum made, was delicious.", "which", ["who", "where"], "Use which for a thing."]
    ], "relative clauses")),
    g("eg-y5-possibility", "Year 5: how likely? (modal verbs and adverbs)", "Second", "might, should, will, must; perhaps, surely.", bank([
      ["It ___ rain later, but I'm not sure.", "might", ["must", "will definitely"], "might shows something is possible but not certain."],
      ["You ___ wear a seatbelt in the car. It's the law.", "must", ["might", "could"], "must shows something has to happen."],
      ["___ we'll go to the beach, if it's sunny.", "Perhaps", ["Surely", "Certainly"], "Perhaps shows it's possible but not certain."],
      ["It's 2 o'clock, so the film ___ start soon.", "will", ["might not", "could never"], "will shows we're sure it will happen."],
      ["You ___ tidy your room, it's a mess!", "should", ["might", "can't"], "should shows it's a good idea or the right thing to do."],
      ["___ you know the answer, you're so clever!", "Surely", ["Perhaps", "Maybe"], "Surely shows we're very confident."],
      ["Which word shows it is certain? It ___ be dark at midnight.", "will", ["might", "could"], "will shows certainty."],
      ["Which word shows it is only possible? We ___ win the match.", "could", ["will", "must"], "could shows something is possible."],
      ["The shop ___ be open, so let's check first.", "may", ["must", "will"], "may shows it's possible."],
      ["___, the sun will rise tomorrow.", "Certainly", ["Perhaps", "Possibly"], "Certainly shows we're sure."]
    ], "modal verbs and adverbs of possibility")),
    g("eg-y5-parenthesis", "Year 5: brackets, dashes and commas (parenthesis)", "Second", "My aunt (who lives in Leeds) is visiting.", bankSentences("Which sentence is punctuated correctly?", [
      ["My aunt (who lives in Leeds) is visiting.", ["My aunt (who lives in Leeds is visiting).", "My aunt who (lives in Leeds) is visiting."], "Brackets go around the extra information, which the sentence would make sense without."],
      ["The dog – a huge, muddy one – jumped up.", ["The dog – a huge, muddy one jumped up.", "The – dog a huge, muddy one – jumped up."], "Dashes go either side of the extra information."],
      ["Mr Patel, our head teacher, gave a talk.", ["Mr Patel, our head teacher gave a talk.", "Mr Patel our, head teacher, gave a talk."], "Commas go either side of the extra information."],
      ["The castle (built in 1200) is huge.", ["The castle (built in 1200 is huge).", "The (castle built) in 1200 is huge."], "Brackets go around the extra information."],
      ["My cat – who is very lazy – sleeps all day.", ["My cat – who is very lazy sleeps all day.", "My – cat who is very lazy – sleeps all day."], "Dashes go either side of the extra information."],
      ["Ben, who is eight, loves maths.", ["Ben who is eight, loves maths.", "Ben, who is, eight loves maths."], "Commas go either side of the extra information."]
    ], "parenthesis")),
    g("eg-y5-verb-suffixes", "Year 5: making verbs with -ate, -ise and -ify", "Second", "pure becomes purify, modern becomes modernise, active becomes activate.", bank([
      ["To make something pure: ___", "purify", ["purise", "purate"], "-ify turns pure into a verb: purify."],
      ["To make something modern: ___", "modernise", ["modernify", "modernate"], "-ise turns modern into a verb: modernise."],
      ["To make something active: ___", "activate", ["activise", "activify"], "-ate turns active into a verb: activate."],
      ["To put things into classes: ___", "classify", ["classise", "classate"], "-ify turns class into a verb: classify."],
      ["To say sorry, give an apology: ___", "apologise", ["apologify", "apologate"], "-ise turns apology into a verb: apologise."],
      ["To make something solid: ___", "solidify", ["solidise", "solidate"], "-ify turns solid into a verb: solidify."],
      ["To make something real in your mind: ___", "realise", ["realify", "realate"], "-ise turns real into a verb: realise."],
      ["To put in a hyphen: ___", "hyphenate", ["hyphenise", "hyphenify"], "-ate turns hyphen into a verb: hyphenate."],
      ["To make something simple: ___", "simplify", ["simplise", "simplate"], "-ify turns simple into a verb: simplify."],
      ["To make something seem special or important: ___", "emphasise", ["emphasify", "emphasate"], "-ise turns emphasis into a verb: emphasise."]
    ], "verb suffixes -ate, -ise and -ify")),

    g("eg-y6-passive", "Year 6: active and passive", "Second", "I broke the window. The window was broken (by me).", () => shuffle([
      ...[["The window was broken by Sam.", ["Sam broke the window.", "Sam is breaking the window."]],
        ["The cake was eaten by the children.", ["The children ate the cake.", "The children eat the cake."]],
        ["The letter was posted yesterday.", ["I posted the letter yesterday.", "She posts the letter."]],
        ["The ball was kicked over the fence.", ["Ben kicked the ball over the fence.", "Ben kicks the ball."]],
        ["The thief was caught by the police.", ["The police caught the thief.", "The police catch thieves."]]]
        .map(([a, o]) => choice("Which sentence is passive?", a, o, { label: a, skill: "the passive", sayOptions: false, explain: "In a passive sentence, the thing the action happens to comes first: was broken, was eaten." })),
      ...[["The cat chased the mouse.", "The mouse was chased by the cat.", ["The cat was chased by the mouse.", "The mouse chased the cat."]],
        ["Mia painted the fence.", "The fence was painted by Mia.", ["Mia was painted by the fence.", "The fence painted Mia."]],
        ["The wind blew the tree down.", "The tree was blown down by the wind.", ["The wind was blown down by the tree.", "The tree blew the wind down."]],
        ["Our class planted the seeds.", "The seeds were planted by our class.", ["Our class was planted by the seeds.", "The seeds planted our class."]]]
        .map(([s, a, o]) => choice(`Which is the passive version of: "${s}"`, a, o, { label: s, skill: "the passive", sayOptions: false, explain: `"${a}" puts the thing the action happens to first.` }))
    ]).slice(0, 10)),
    g("eg-y6-formal", "Year 6: formal or informal? (and If I were)", "Second", "find out becomes discover, ask for becomes request, If I were you…", bank([
      ["Which is more formal than \"find out\"?", "discover", ["look up", "suss out"], "discover is the formal word for find out."],
      ["Which is more formal than \"ask for\"?", "request", ["want", "get"], "request is the formal word for ask for."],
      ["Which is more formal than \"go in\"?", "enter", ["pop in", "get in"], "enter is the formal word for go in."],
      ["If I ___ you, I would say sorry.", "were", ["was", "am"], "In formal English, use the subjunctive: If I were you."],
      ["___ they to come, we would be delighted.", "Were", ["Was", "If"], "Were they to come is the formal subjunctive."],
      ["Which is more formal than \"help\"?", "assist", ["give a hand", "sort out"], "assist is the formal word for help."],
      ["Which is more formal than \"get\"?", "obtain", ["grab", "pick up"], "obtain is the formal word for get."],
      ["In \"He's your friend, isn't he?\", the words \"isn't he\" are a ___, typical of informal speech.", "question tag", ["relative clause", "command"], "A question tag turns a statement into a question, and is typical of informal speech."],
      ["The head teacher requests that every pupil ___ on time.", "be", ["is", "are"], "In very formal writing, use the subjunctive: that every pupil be on time."],
      ["Which is more formal than \"lots of\"?", "many", ["loads of", "tons of"], "many is more formal than lots of."]
    ], "formal and informal language")),
    g("eg-y6-synonyms", "Year 6: synonyms and antonyms", "Second", "big, large (synonyms); big, little (antonyms).", bank([
      ["A synonym (same meaning) for big:", "large", ["little", "tiny"], "Synonyms mean the same or nearly the same: big, large."],
      ["An antonym (opposite) of big:", "little", ["large", "huge"], "Antonyms are opposites: big, little."],
      ["A synonym for happy:", "cheerful", ["miserable", "angry"], "happy and cheerful mean nearly the same."],
      ["An antonym of ancient:", "modern", ["old", "historic"], "ancient and modern are opposites."],
      ["A synonym for begin:", "start", ["finish", "stop"], "begin and start mean the same."],
      ["An antonym of generous:", "mean", ["kind", "giving"], "generous and mean are opposites."],
      ["A synonym for quick:", "rapid", ["slow", "lazy"], "quick and rapid mean nearly the same."],
      ["An antonym of brave:", "cowardly", ["bold", "fearless"], "brave and cowardly are opposites."],
      ["A synonym for shout:", "yell", ["whisper", "mumble"], "shout and yell mean nearly the same."],
      ["An antonym of accept:", "refuse", ["take", "agree"], "accept and refuse are opposites."]
    ], "synonyms and antonyms")),
    g("eg-y6-punctuation", "Year 6: semi-colons, colons, dashes and hyphens", "Second", "It's raining; I'm fed up. You need: a pen, a ruler and glue.", bankSentences("Which sentence is punctuated correctly?", [
      ["It's raining; I'm fed up.", ["It's raining I'm; fed up.", "It's; raining I'm fed up."], "A semi-colon joins two clauses that could each be a sentence."],
      ["You will need: a pen, a ruler and some glue.", ["You will: need a pen, a ruler and some glue.", "You will need a pen: a ruler and some glue."], "A colon can introduce a list."],
      ["We visited Paris, France; Rome, Italy; and Madrid, Spain.", ["We visited Paris; France, Rome; Italy, and Madrid; Spain.", "We visited Paris France, Rome Italy, and Madrid Spain."], "Semi-colons separate list items that already have commas."],
      ["I was late – the bus never came.", ["I was – late the bus never came.", "I – was late the bus never came."], "A dash can mark the boundary between two clauses."],
      ["Watch out for the man-eating shark!", ["Watch out for the man eating-shark!", "Watch-out for the man eating shark!"], "The hyphen shows the shark eats men, not a man eating a shark."],
      ["The film was brilliant: everyone cheered.", ["The film: was brilliant everyone cheered.", "The: film was brilliant everyone cheered."], "A colon can join two clauses when the second explains the first."],
      ["She has a well-known name.", ["She has a well known-name.", "She-has a well known name."], "The hyphen joins well and known to make one describing word."],
      ["Our team trained hard; we won the cup.", ["Our team; trained hard we won the cup.", "Our team trained; hard we won the cup."], "A semi-colon joins two clauses that could each be a sentence."]
    ], "semi-colons, colons, dashes and hyphens")),

    g("eg-terms-ks1", "Grammar words: Years 1 and 2", "First", "noun, verb, adjective, adverb, plural, suffix…", bank([
      ["In \"The red ball bounced\", which word is an adjective?", "red", ["ball", "bounced"], "An adjective describes a noun: red ball."],
      ["In \"The dog ran\", which word is a verb?", "ran", ["dog", "The"], "A verb is a doing or being word: ran."],
      ["In \"A cat sat on the mat\", which word is a noun?", "cat", ["sat", "on"], "A noun names a person, place or thing: cat."],
      ["In \"She sang loudly\", which word is an adverb?", "loudly", ["She", "sang"], "An adverb tells us how: loudly."],
      ["Which word is plural?", "trees", ["tree", "treat"], "Plural means more than one: trees."],
      ["In \"helpful\", which part is the suffix?", "-ful", ["help", "hel-"], "A suffix is added to the end of a word: -ful."],
      ["Which is a compound word?", "playground", ["playing", "player"], "A compound word is two words joined: play + ground."],
      ["Which word is singular?", "box", ["boxes", "foxes"], "Singular means just one: box."],
      ["Which is a noun phrase?", "the blue butterfly", ["ran away", "very quickly"], "A noun phrase is built around a noun: the blue butterfly."],
      ["Which punctuation mark ends a question?", "question mark", ["full stop", "comma"], "A question ends with a question mark."]
    ], "grammar terms", { sayOptions: true })),
    g("eg-terms-ks2a", "Grammar words: Years 3 and 4", "Second", "preposition, conjunction, clause, pronoun, determiner, adverbial…", bank([
      ["In \"The cat hid under the bed\", which word is a preposition?", "under", ["cat", "hid"], "A preposition shows where or when: under."],
      ["In \"I stayed in because it rained\", which word is a conjunction?", "because", ["stayed", "rained"], "A conjunction joins clauses: because."],
      ["In \"Sam lost his hat and he was sad\", which word is a pronoun?", "he", ["hat", "sad"], "A pronoun stands in for a noun: he (Sam)."],
      ["In \"The dog is mine\", which word is a possessive pronoun?", "mine", ["dog", "is"], "A possessive pronoun shows who owns something: mine."],
      ["In \"Those apples are ripe\", which word is a determiner?", "Those", ["apples", "ripe"], "A determiner comes before a noun to say which one: those."],
      ["In \"Later that day, I went home\", which words are the adverbial?", "Later that day", ["I went", "home"], "An adverbial tells us when, where or how."],
      ["In \"I smiled when I saw her\", which part is the subordinate clause?", "when I saw her", ["I smiled", "I saw"], "A subordinate clause can't stand alone: when I saw her."],
      ["Which is a vowel letter?", "e", ["t", "m"], "The vowel letters are a, e, i, o and u."],
      ["In \"solve, solution, solver\", the words are a ___.", "word family", ["compound", "suffix"], "Words related in form and meaning are a word family."],
      ["What are \" \" called when they show what someone says?", "inverted commas", ["brackets", "dashes"], "Inverted commas (speech marks) show direct speech."]
    ], "grammar terms", { sayOptions: true })),
    g("eg-terms-ks2b", "Grammar words: Years 5 and 6", "Second", "relative clause, modal verb, subject, object, active, passive…", bank([
      ["In \"The girl who won is my sister\", which part is the relative clause?", "who won", ["The girl", "is my sister"], "A relative clause adds information about a noun, starting with who, which, that…"],
      ["In \"You must listen\", which word is a modal verb?", "must", ["You", "listen"], "Modal verbs show how likely or necessary something is: must."],
      ["In \"Mia kicked the ball\", what is the subject?", "Mia", ["kicked", "the ball"], "The subject is who or what does the action: Mia."],
      ["In \"Mia kicked the ball\", what is the object?", "the ball", ["Mia", "kicked"], "The object is what the action is done to: the ball."],
      ["\"The ball was kicked by Mia\" is ___.", "passive", ["active", "a command"], "The thing the action happens to comes first, so it's passive."],
      ["Big and large are ___.", "synonyms", ["antonyms", "homophones"], "Words with the same or nearly the same meaning are synonyms."],
      ["Hot and cold are ___.", "antonyms", ["synonyms", "relative pronouns"], "Words with opposite meanings are antonyms."],
      ["In \"The man whose dog barked\", which word is the relative pronoun?", "whose", ["man", "barked"], "Relative pronouns: who, which, where, when, whose, that."],
      ["Which mark joins two clauses that could each be a sentence?", "semi-colon", ["hyphen", "apostrophe"], "A semi-colon can join two independent clauses."],
      ["Extra information in brackets is called ___.", "parenthesis", ["cohesion", "ellipsis"], "Parenthesis is extra information marked by brackets, dashes or commas."]
    ], "grammar terms", { sayOptions: true }))
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
  const storyQuestions = (p, listen) => () => p.questions.map((q, i) => choice(q.q, q.a, q.others, {
    label: `${p.title} Q${i + 1}`, skill: q.skill || "comprehension", explain: q.why || "",
    say: { text: q.q, clip: `audio/passages/${p.id}-q${i + 1}.mp3` } // read aloud, so non-readers can answer
  }));
  const passageActivities = (window.PASSAGES || []).flatMap(p => {
    const make = listen => storyQuestions(p, listen);
    const read = { id: `r-${p.id}`, title: p.title, level: p.level, organiser: READ, blurb: p.blurb || "Read the story, then answer the questions.", passage: p, make: make(false) };
    const listen = p.listen ? [{ id: `lc-${p.id}`, area: "listening", title: `Listen: ${p.title}`, level: "Early",
      organiser: LISTEN, blurb: "Listen to the story, then answer the questions.", passage: p, listen: true, make: make(true) }] : [];
    return [read].concat(listen);
  });
  const reading = [
    { id: "r-tricky", title: "Tricky word sentences", level: "Early", organiser: "Literacy · Reading · Tools for reading", blurb: "Choose the tricky word that finishes the sentence.",
      make: () => shuffle(HFW.map(([s, w], i) => [s, w, i + 1])).slice(0, 10).map(([s, w, n]) => choice(s, w, shuffle(TRICKY.filter(t => t.toLowerCase() !== w.toLowerCase())).slice(0, 2).map(t => (/^___/.test(s) ? t[0].toUpperCase() + t.slice(1) : t)),
        { label: w.toLowerCase(), skill: `tricky word "${w.toLowerCase()}"`, say: { text: s.replace("___", w), clip: `audio/phrases/hfw-${n}.mp3` }, explain: s.replace("___", w) })) }
  ].concat(passageActivities.filter(a => !a.area));

  // Decodable stories (stories.js): read alone, sound by sound. The pupil site matches them to
  // the sounds each pupil has practised.
  const stories = (window.STORIES || []).map(s => ({
    id: `s-${s.id}`, title: s.title, level: spellingLevel(s.stage - 1), organiser: "Literacy · Reading · Tools for reading",
    blurb: `EA Stage ${s.stage} sounds. Read it by yourself, then answer the questions.`,
    passage: s, decodable: true, stage: s.stage, make: storyQuestions(s, false)
  }));

  /* ---------- Sound Hopper: count the sounds, then map one grapheme to each sound ---------- */

  const MAP_ALTERNATIVES = {
    a: ["e", "o"], e: ["i", "a"], i: ["e", "u"], o: ["a", "u"], u: ["o", "i"],
    sh: ["ch", "th"], ch: ["sh", "tch"], th: ["sh", "ch"],
    ai: ["ay", "a_e"], ay: ["ai", "a_e"], a_e: ["ai", "ay"],
    ee: ["ea", "e_e"], ea: ["ee", "e_e"], e_e: ["ee", "ea"],
    ar: ["or", "er"], or: ["ar", "ur"], er: ["ir", "ur"], ir: ["er", "ur"], ur: ["er", "ir"],
    c: ["k", "ck"], k: ["c", "ck"], ck: ["c", "k"],
    b: ["d", "p"], d: ["b", "t"], p: ["b", "t"],
    f: ["v", "th"], v: ["f", "w"], m: ["n", "w"], n: ["m", "ng"],
    s: ["z", "sh"], t: ["d", "th"], g: ["j", "k"], h: ["ch", "sh"],
    l: ["r", "n"], r: ["l", "w"], w: ["v", "r"], y: ["i", "ee"],
    // Look-alike spellings for the rest, so no answer is given away by two vowel choices
    j: ["g", "dge"], x: ["ks", "cks"], z: ["s", "zz"], qu: ["kw", "cw"], ng: ["nk", "n"], nk: ["ng", "nc"],
    ll: ["l", "le"], ss: ["s", "ce"], ff: ["f", "ph"], zz: ["z", "s"], tch: ["ch", "sh"], wh: ["w", "v"],
    ph: ["f", "ff"], kn: ["n", "gn"], wr: ["r", "w"],
    oa: ["ow", "o_e"], ow: ["oa", "ou"], o_e: ["oa", "ow"], igh: ["i_e", "ie"], i_e: ["igh", "ie"],
    oo: ["ew", "ue"], ew: ["ue", "oo"], ue: ["ew", "oo"], u_e: ["ew", "oo"], ou: ["ow", "oo"],
    oi: ["oy", "o"], oy: ["oi", "y"], aw: ["au", "or"], au: ["aw", "or"],
    air: ["are", "ear"], are: ["air", "ear"], ear: ["eer", "air"], eer: ["ear", "ere"],
    // The EA Stage 3 sounds: other ways to write the same sound
    ie: ["igh", "ee"], ey: ["ay", "ai"], oe: ["oa", "ow"], dge: ["ge", "j"], dg: ["g", "j"], gn: ["n", "kn"],
    mb: ["m", "mm"], ture: ["cher", "chur"], ti: ["sh", "ch"], ough: ["or", "aw"], oul: ["oo", "u"],
    se: ["s", "ss"], ve: ["v", "f"], ce: ["s", "se"], ge: ["j", "dge"]
  };
  const fallbackOptions = token => (/[aeiouy]/.test(token) ? ["a", "e"] : ["s", "t"]);
  const mapOptions = token => shuffle([token, ...(MAP_ALTERNATIVES[token] || fallbackOptions(token))]
    .filter((v, i, a) => a.indexOf(v) === i)).slice(0, 3);
  const trailWords = (ids, keep = () => true) => {
    const lists = (window.PopSpell || {}).LISTS || {};
    return shuffle(ids.flatMap(id => (lists[id] || {}).items || [])
      .filter(it => !it.whole && it.tokens.length >= 2 && it.tokens.length <= 5 && keep(it)))
      .slice(0, 6).map(it => ({
        kind: "map", prompt: "Listen. Say each sound. Build the word, one sound at a time.",
        answer: it.spelling, spelling: it.spelling, tokens: it.tokens,
        optionsBySlot: it.tokens.map(mapOptions),
        say: { word: it.spelling.toLowerCase() },
        label: it.spelling, skill: "sound mapping"
      }));
  };
  const trailGames = [
    { id: "g-hopper-short", title: "Sound Hopper: short vowels", level: "Early", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Tap once for each sound you hear. Build each sound into a bridge and help Pip cross the river.",
      make: () => trailWords(["short-a", "short-e", "short-i", "short-o", "short-u"]) },
    { id: "g-hopper-digraphs", title: "Sound Hopper: two-letter sounds", level: "Early", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Count the sounds, then build a bridge with sh, ch, th and more.",
      make: () => trailWords(["sh", "ch", "th"]) },
    { id: "g-hopper-long-a", title: "Sound Hopper: long a", level: "First", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Count the sounds and choose between ai, ay and a–e to make a bridge.",
      make: () => trailWords(["ai", "ay", "a-e"]) },
    { id: "g-hopper-r", title: "Sound Hopper: r sounds", level: "First", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "In Scottish mode, hear the vowel then r as two sounds. Try the same words in English mode to compare.",
      make: () => trailWords(["ar", "or", "er-ir-ur"]) },
    { id: "g-hopper-ea3", title: "Sound Hopper: more ways to write sounds", level: "First", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "EA Stage 3 sounds. Count the sounds, then choose the right spelling for each one: ie or igh, ey or ay, dge or j, ti or sh.",
      // Only the lists whose words are split into sounds by hand, so every bridge has the right number of sounds
      // (not turkey and valley, whose ey is an ee sound, or badger, whose list splits e-r)
      make: () => trailWords(["ie-tried", "ea-break", "ey", "ie-field", "oe", "gn", "ture", "dge", "ough", "ti"], it => !/^(turkey|valley|badger)$/i.test(it.spelling)) }
  ];

  /* ---------- Sound Switch: change one phoneme to open Pip's next door ---------- */

  // Each pair is checked against the current Scottish or English sound map when play starts.
  // The target spelling stays out of the puzzle until the child has made the change.
  const switchRound = ([source, target, action, choices]) => {
    const analyse = window.PopSpell.analyse;
    const before = analyse(source).tokens;
    const after = analyse(target).tokens;
    let index = -1;
    if (action === "swap") {
      if (before.length !== after.length) throw new Error(`Sound Switch: ${source} → ${target} is not a swap`);
      const changed = before.map((sound, i) => sound === after[i] ? -1 : i).filter(i => i >= 0);
      if (changed.length !== 1) throw new Error(`Sound Switch: ${source} → ${target} must change one sound`);
      index = changed[0];
    } else if (action === "add") {
      if (after.length !== before.length + 1) throw new Error(`Sound Switch: ${source} → ${target} is not an addition`);
      index = after.findIndex((_, i) => before.every((sound, j) => sound === after[j < i ? j : j + 1]));
    } else {
      if (before.length !== after.length + 1) throw new Error(`Sound Switch: ${source} → ${target} is not a deletion`);
      index = before.findIndex((_, i) => after.every((sound, j) => sound === before[j < i ? j : j + 1]));
    }
    if (index < 0) throw new Error(`Sound Switch: ${source} → ${target} is not a one-sound change`);
    const answerSound = action === "remove" ? before[index] : after[index];
    if (action !== "remove" && !choices.includes(answerSound)) throw new Error(`Sound Switch: missing ${answerSound} tile`);
    return {
      kind: "switch", source, answer: target, spelling: `${source} → ${target}`,
      label: `${source} → ${target}`, tokens: after, before, after, action, index,
      choices: action === "remove" ? [] : shuffle(choices), answerSound,
      skill: action === "swap" ? (answerSound.length > 1 || before[index].length > 1 ? "changing a digraph" : "changing one sound")
        : action === "add" ? "adding a sound" : "removing a sound"
    };
  };
  const switchGames = [
    { id: "g-switch-first", title: "Sound Switch: first doors", level: "Early", organiser: "Literacy · Reading · Tools for reading",
      blurb: "Help Pip open six doors by changing one sound at a time. Hear the new word, then switch its sound tile.",
      make: () => [
        ["cat", "cot", "swap", ["o", "u", "e"]], ["cot", "cut", "swap", ["u", "a", "i"]],
        ["cut", "cup", "swap", ["p", "b", "d"]], ["cup", "cap", "swap", ["a", "e", "o"]],
        ["cap", "map", "swap", ["m", "n", "t"]], ["map", "mop", "swap", ["o", "u", "e"]]
      ].map(switchRound) },
    { id: "g-switch-digraphs", title: "Sound Switch: letter teams", level: "Early", organiser: "Literacy · Reading · Tools for reading",
      blurb: "Swap sh, ch, th and tch as one sound tile to open Pip's workshop doors.",
      make: () => [
        ["shop", "chop", "swap", ["ch", "th", "sh"]], ["ship", "chip", "swap", ["ch", "th", "sh"]],
        ["thin", "shin", "swap", ["sh", "ch", "th"]], ["chat", "that", "swap", ["th", "sh", "ch"]],
        ["cash", "catch", "swap", ["tch", "ch", "sh"]], ["with", "wish", "swap", ["sh", "ch", "th"]]
      ].map(switchRound) },
    { id: "g-switch-build", title: "Sound Switch: secret passages", level: "First", organiser: "Literacy · Reading · Tools for reading",
      blurb: "Add or remove one sound to open a secret passage. Pip needs sharp ears and careful reading.",
      make: () => [
        ["pot", "spot", "add", ["s", "f", "t"]], ["stop", "top", "remove", []],
        ["pin", "spin", "add", ["s", "f", "t"]], ["frog", "fog", "remove", []],
        ["spoon", "soon", "remove", []], ["star", "start", "add", ["t", "p", "d"]]
      ].map(switchRound) }
  ];

  /* ---------- Counting Canopy: visual number sense with Pip ---------- */

  // These questions are games, not timed tests. A pupil can replay the dots or try another
  // partition without a clock. The teacher receives the specific number skill practised.
  const canopyChoices = (answer, max) => shuffle(shuffle([answer - 2, answer - 1, answer + 1, answer + 2]
    .filter(n => n >= 0 && n <= max)).slice(0, 2).concat(answer));
  const canopyPick = values => shuffle(values)[0];
  function canopyRound(mode, total, extra = {}) {
    const q = { kind: "canopy", mode, total, tokens: [], ...extra };
    if (mode === "flash") {
      q.answer = String(total);
      q.label = `${total} fireflies at a glance`;
      q.skill = "recognising small groups at a glance";
      q.options = canopyChoices(total, 8);
    } else if (mode === "make") {
      q.answer = `make ${total}`;
      q.label = `make ${total} to cross the river`;
      q.skill = "making and splitting numbers";
    } else if (mode === "hide") {
      q.answer = String(total - q.visible);
      q.label = `${q.visible} and ? make ${total}`;
      q.skill = total > 10 ? "missing parts within 20" : "missing parts within 10";
      q.options = canopyChoices(total - q.visible, total);
    } else if (mode === "compare") {
      q.answer = q.left === q.right ? "same" : q.left > q.right ? "left" : "right";
      q.label = `compare ${q.left} and ${q.right}`;
      q.skill = "comparing quantities";
      q.options = ["left", "same", "right"];
    } else throw new Error(`Unknown Counting Canopy mode: ${mode}`);
    q.spelling = q.label;
    return q;
  }
  const canopyGames = [
    { id: "g-canopy-flash", title: "Counting Canopy: firefly flash", level: "Early", organiser: NUM,
      blurb: "Look at a small group of fireflies, then tell Pip how many you saw. Replay as often as you like.",
      make: () => shuffle(range(1, 6)).map(n => canopyRound("flash", n)) },
    { id: "g-canopy-make", title: "Counting Canopy: build a bridge", level: "Early", organiser: NUM,
      blurb: "Choose two firefly groups that make the target number. One good bridge lets Pip cross the river.",
      make: () => shuffle(range(5, 10)).map(n => canopyRound("make", n)) },
    { id: "g-canopy-hidden", title: "Counting Canopy: hidden fireflies", level: "Early", organiser: NUM,
      blurb: "Some fireflies hide under a leaf. Use the whole and the visible part to find the hidden part.",
      make: () => shuffle([[5, 2], [6, 4], [7, 3], [8, 5], [9, 6], [10, 7]])
        .map(([total, visible]) => canopyRound("hide", total, { visible })) },
    { id: "g-canopy-compare", title: "Counting Canopy: balance the branches", level: "Early", organiser: NUM,
      blurb: "Help Pip compare two groups of fireflies. Which tree has more, or are they the same?",
      make: () => shuffle([[3, 5], [6, 4], [5, 5], [8, 7], [9, 9], [10, 8]])
        .map(([left, right]) => canopyRound("compare", Math.max(left, right), { left, right })) },
    { id: "g-canopy-twenty", title: "Counting Canopy: hidden to 20", level: "First", organiser: NUM,
      blurb: "Find a missing part when the whole is bigger than ten, using a twenty-frame to help.",
      make: () => shuffle([[11, 7], [12, 8], [13, 9], [15, 10], [17, 12], [20, 14]])
        .map(([total, visible]) => canopyRound("hide", total, { visible })) },
    { id: "g-canopy-run", title: "Counting Canopy: forest run", level: "Early", organiser: NUM,
      blurb: "Guide Pip through eight different forest obstacles. Each answer opens the path to the owl.",
      make: () => {
        const [h1, v1] = canopyPick([[7, 3], [8, 5]]);
        const [h2, v2] = canopyPick([[9, 5], [10, 6]]);
        const [c1, d1] = canopyPick([[5, 7], [6, 8]]);
        const [c2, d2] = canopyPick([[9, 9], [10, 8]]);
        return [
          canopyRound("flash", canopyPick([3, 4])), canopyRound("make", canopyPick([6, 7])),
          canopyRound("hide", h1, { visible: v1 }), canopyRound("compare", Math.max(c1, d1), { left: c1, right: d1 }),
          canopyRound("flash", canopyPick([5, 6])), canopyRound("make", canopyPick([8, 9])),
          canopyRound("hide", h2, { visible: v2 }), canopyRound("compare", Math.max(c2, d2), { left: c2, right: d2 })
        ];
      } },
    // The same forest, a level up: numbers to 20, getting harder clearing by clearing
    { id: "g-canopy-run-20", title: "Counting Canopy: forest run to 20", level: "First", organiser: NUM,
      blurb: "Guide Pip through eight harder clearings with numbers up to 20. Each one is a little trickier than the last.",
      make: () => {
        const [c1, d1] = canopyPick([[13, 16], [14, 11]]);
        const [c2, d2] = canopyPick([[18, 18], [17, 19]]);
        const [h, v] = canopyPick([[13, 9], [15, 10]]);
        return [
          canopyRound("flash", 6), canopyRound("make", 9),
          canopyRound("hide", 11, { visible: 7 }), canopyRound("compare", Math.max(c1, d1), { left: c1, right: d1 }),
          canopyRound("make", 10), canopyRound("hide", h, { visible: v }),
          canopyRound("compare", Math.max(c2, d2), { left: c2, right: d2 }), canopyRound("hide", 20, { visible: 14 })
        ];
      } }
  ];

  /* ---------- England's Year 4 multiplication tables check: timed practice ---------- */

  // Built like a real check form (the Standards and Testing Agency's assessment framework): 25
  // questions from the 2 to 12 tables, so many from each table (more from 6, 7, 8, 9 and 12, the
  // hardest), 3 to 7 from the key stage 1 tables (2, 5 and 10), no repeats or reversals (3 × 8 and
  // 8 × 3), 6 seconds each and a 3-second pause between them.
  const MTC_LIMITS = { 2: [0, 2], 3: [1, 3], 4: [1, 3], 5: [1, 3], 6: [2, 4], 7: [2, 4], 8: [2, 4], 9: [2, 4], 10: [0, 2], 11: [1, 3], 12: [2, 4] };
  const KS1_TABLES = [2, 5, 10];
  function mtcForm() {
    for (let attempt = 0; attempt < 50; attempt++) {
      const count = Object.fromEntries(Object.entries(MTC_LIMITS).map(([t, [min]]) => [t, min]));
      const ks1 = () => KS1_TABLES.reduce((n, t) => n + count[t], 0);
      let total = Object.values(count).reduce((a, b) => a + b, 0);
      for (let guard = 0; total < 25 && guard < 500; guard++) {
        const t = pick(Object.keys(MTC_LIMITS).map(Number));
        const isKs1 = KS1_TABLES.includes(t);
        if (count[t] >= MTC_LIMITS[t][1] || (isKs1 && ks1() >= 7) || (!isKs1 && ks1() < 3 && 25 - total <= 3 - ks1())) continue;
        count[t]++; total++;
      }
      if (total !== 25 || ks1() < 3) continue;
      const used = new Set(), items = [];
      let ok = true;
      Object.entries(count).forEach(([t, n]) => {
        for (let k = 0; k < n && ok; k++) {
          const choices = shuffle(range(2, 12)).filter(b => !used.has(`${t}x${b}`) && !used.has(`${b}x${t}`));
          if (!choices.length) { ok = false; break; }
          used.add(`${t}x${choices[0]}`);
          items.push([Number(t), choices[0]]);
        }
      });
      if (ok) return shuffle(items); // not ordered by difficulty, as in the check
    }
    return shuffle(range(2, 12)).slice(0, 25).map(b => [pick([6, 7, 8, 9, 12]), b]);
  }
  /* ---------- England's curriculum: maths it asks for that the CfE activities don't reach ---------- */

  const UNITS_W = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen",
    "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const TENS_W = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const inWords = n => (n === 100 ? "one hundred" : n < 20 ? UNITS_W[n] : TENS_W[Math.floor(n / 10)] + (n % 10 ? `-${UNITS_W[n % 10]}` : ""));
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const frac = (n, d) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
  const mixed = (n, d) => { const g = gcd(n, d); n /= g; d /= g; const w = Math.floor(n / d), r = n % d; return w ? (r ? `${w} ${r}/${d}` : `${w}`) : `${r}/${d}`; };
  const pounds2 = n => `£${n.toFixed(2)}`;
  const big = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const ROMAN = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  const roman = n => ROMAN.reduce((s, [v, r]) => { while (n >= v) { s += r; n -= v; } return s; }, "");
  const three = (answer, wrong) => [...new Set(wrong.map(String).filter(w => w !== String(answer)))].slice(0, 2);
  const linesSVG = kind => {
    const L = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    const body = { parallel: L(20, 30, 180, 30) + L(20, 80, 180, 80), perpendicular: L(40, 90, 170, 90) + L(100, 15, 100, 90),
      neither: L(20, 30, 180, 55) + L(30, 95, 170, 75), horizontal: L(20, 55, 180, 55), vertical: L(100, 10, 100, 100), diagonal: L(30, 95, 170, 15) }[kind];
    return `<svg class="q-pic" viewBox="0 0 200 110" width="200" height="110" role="img" aria-label="Lines">${body}</svg>`;
  };

  const englandMaths = [
    { id: "en-numbers-words", title: "Numbers in words (Years 1 and 2)", level: "First", organiser: NUM, blurb: "Read and write numbers to 100 in numerals and in words.",
      make: () => distinct(10, () => {
        const n = rand(90) + 11, swap = (n % 10) * 10 + Math.floor(n / 10);
        if (rand(2)) return choice(`Which is ${n} written in words?`, inWords(n), three(inWords(n), [inWords(swap > 10 && swap !== n ? swap : n + 10 > 100 ? n - 10 : n + 10), inWords(n % 10 ? n - 1 : n + 1), inWords(n + 1 > 100 ? n - 2 : n + 1)]),
          { label: `${n} in words`, skill: "numbers in words", explain: `${n} is ${inWords(n)}: the tens first, then the ones.` });
        return typed(`What number is “${inWords(n)}”?`, n, { label: `${inWords(n)} as a number`, skill: "numbers in words", explain: `${inWords(n)} is ${n}.` });
      }) },
    { id: "en-add-2digit", title: "Adding and taking away two-digit numbers (Year 2)", level: "First", organiser: NUM, blurb: "Add and subtract a two-digit number and ones, a two-digit number and tens, two two-digit numbers, and three one-digit numbers.",
      make: () => distinct(10, () => {
        const k = rand(6);
        if (k === 0) { const a = rand(80) + 11, b = rand(9) + 1; return typed(`${a} + ${b} =`, a + b, { label: `${a}+${b}`, skill: "two-digit number and ones", explain: `Add the ones: ${a} + ${b} = ${a + b}.` }); }
        if (k === 1) { const a = rand(60) + 11, b = (rand(3) + 1) * 10; return typed(`${a} + ${b} =`, a + b, { label: `${a}+${b}`, skill: "two-digit number and tens", explain: `Add the tens: ${a} + ${b} = ${a + b}. The ones stay the same.` }); }
        if (k === 2) { const a = rand(40) + 11, b = rand(40) + 11; return typed(`${a} + ${b} =`, a + b, { label: `${a}+${b}`, skill: "two two-digit numbers", explain: `Tens first, then ones: ${a} + ${b} = ${a + b}.` }); }
        if (k === 3) { const [a, b, c] = [rand(8) + 2, rand(8) + 2, rand(8) + 2]; return typed(`${a} + ${b} + ${c} =`, a + b + c, { label: `${a}+${b}+${c}`, skill: "three one-digit numbers", explain: `Look for a pair that's easy to add first: ${a} + ${b} + ${c} = ${a + b + c}.` }); }
        if (k === 4) { const a = rand(70) + 21, b = rand(9) + 1; return typed(`${a} − ${b} =`, a - b, { label: `${a}-${b}`, skill: "two-digit number and ones", explain: `${a} − ${b} = ${a - b}. Check: ${a - b} + ${b} = ${a}.` }); }
        const [a, b] = [rand(8) + 2, rand(8) + 2]; if (a === b) return { label: "same" };
        const op = pick(["+", "×", "−", "÷"]), same = op === "+" || op === "×";
        return choice(`Is ${a} ${op} ${b} the same as ${b} ${op} ${a}?`, same ? "yes" : "no", [same ? "no" : "yes"], { label: `${a}${op}${b} order`, skill: "order of adding and multiplying",
          explain: same ? `Adding and multiplying can be done in any order: ${a} ${op} ${b} = ${b} ${op} ${a}.` : `Taking away and dividing can't be done in any order.` });
      }) },
    { id: "en-compare-measures", title: "Comparing measures, and quicker or later (Years 1 and 2)", level: "First", organiser: MEAS, blurb: "Compare lengths, masses and capacities with <, > and =, and use words such as quicker, slower, earlier and later.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k < 2) {
          const [unit, max] = pick([["cm", 99], ["m", 50], ["kg", 40], ["g", 900], ["ml", 900], ["litres", 20]]);
          const a = rand(max) + 1, b = rand(3) === 0 ? a : rand(max) + 1, sign = a < b ? "<" : a > b ? ">" : "=";
          const say = { "<": "< (is less than)", ">": "> (is more than)", "=": "= (is equal to)" };
          return choice(`${a} ${unit} ☐ ${b} ${unit}. Which sign goes in the box?`, say[sign], Object.values(say).filter(x => x !== say[sign]),
            { label: `${a}${unit} ${b}`, skill: "comparing measures", explain: `${a} ${unit} ${sign === "=" ? "is the same as" : sign === "<" ? "is less than" : "is more than"} ${b} ${unit}, so ${sign}.` });
        }
        const [q, ans, other, why] = pick([["Which takes longer: brushing your teeth or a night's sleep?", "a night's sleep", "brushing your teeth", "Sleep lasts hours; brushing takes minutes."],
          ["Which is quicker: a snail or a cheetah?", "a cheetah", "a snail", "A cheetah runs fast; a snail moves slowly."],
          ["Which happens earlier in the day: breakfast or tea?", "breakfast", "tea", "Breakfast is in the morning; tea is later."],
          ["Which happens later: going to bed or getting up?", "going to bed", "getting up", "We go to bed at night, after getting up in the morning."],
          ["Which is slower: walking or running?", "walking", "running", "Running covers the same distance in less time."],
          ["Which takes longer: a school day or a school year?", "a school year", "a school day", "A year is made of many days."]]);
        return choice(q, ans, [other], { label: q, skill: "words for time", explain: why });
      }) },
    { id: "en-mental-3digit", title: "Three-digit numbers in your head (Year 3)", level: "First", organiser: NUM, blurb: "Add and subtract ones, tens or hundreds to a three-digit number mentally.",
      make: () => distinct(10, () => {
        const a = rand(700) + 101, [part, b] = pick([["ones", rand(9) + 1], ["tens", (rand(9) + 1) * 10], ["hundreds", (rand(2) + 1) * 100]]), add = rand(2) === 1 || a - b < 100;
        return typed(`${a} ${add ? "+" : "−"} ${b} =`, add ? a + b : a - b, { label: `${a}${add ? "+" : "-"}${b}`, skill: `three-digit number and ${part}`,
          explain: `Only the ${part} change${part === "ones" ? " (or carry into the tens)" : ""}: ${a} ${add ? "+" : "−"} ${b} = ${add ? a + b : a - b}.` });
      }) },
    { id: "en-money-pounds", title: "Pounds and pence: adding and change (Year 3)", level: "First", organiser: "Numeracy · Money", blurb: "Add and subtract amounts using £ and p, and give change.",
      make: () => distinct(10, () => {
        const price = () => (rand(8) + 1) + pick([0, 0.15, 0.25, 0.4, 0.5, 0.75, 0.99]), k = rand(3);
        if (k === 0) { const a = price(), b = price(); return typed(`A book costs ${pounds2(a)} and a pen costs ${pounds2(b)}. How much altogether? (in £)`, dec(a + b),
          { input: "decimal", accept: [pounds2(a + b), (a + b).toFixed(2)], label: `${a}+${b}`, skill: "adding money", explain: `${pounds2(a)} + ${pounds2(b)} = ${pounds2(a + b)}.` }); }
        const a = price(), paid = a < 5 ? 5 : 10;
        if (k === 1) return typed(`You buy something for ${pounds2(a)} and pay with a £${paid} note. How much change? (in £)`, dec(paid - a),
          { input: "decimal", accept: [pounds2(paid - a), (paid - a).toFixed(2)], label: `${paid}-${a}`, skill: "giving change", explain: `Count on from ${pounds2(a)} to £${paid}: ${pounds2(paid - a)}.` });
        const p = (rand(8) + 1) * 10 + 5;
        return typed(`How many pence is ${pounds2(p / 100 + 1)}?`, 100 + p, { label: `${p} p`, skill: "pounds and pence", explain: `£1 is 100p, so ${pounds2(p / 100 + 1)} is ${100 + p}p.` });
      }) },
    { id: "en-fractions-add", title: "Tenths, and adding fractions (Years 3 and 4)", level: "First", organiser: FDP, blurb: "Count in tenths, and add and subtract fractions with the same denominator.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const s = rand(6) + 1; return choice(`What comes next? ${s}/10, ${s + 1}/10, ${s + 2}/10, …`, `${s + 3}/10`, [`${s + 3}/30`, `${s + 4}/10`],
          { label: `tenths from ${s}`, skill: "counting in tenths", explain: `It goes up one tenth each time: ${s + 3}/10.` }); }
        if (k === 1) { const n = (rand(9) + 1) * 10; return typed(`What is one tenth of ${n}?`, n / 10, { label: `tenth of ${n}`, skill: "dividing by 10", explain: `Divide by 10: ${n} ÷ 10 = ${n / 10}.` }); }
        const d = pick([5, 6, 7, 8, 9, 10, 12]), a = rand(d - 2) + 1, b = rand(d - a - 1) + 1;
        if (k === 2) return choice(`${a}/${d} + ${b}/${d} =`, `${a + b}/${d}`, [`${a + b}/${d * 2}`, `${a + b + 1}/${d}`], { label: `${a}/${d}+${b}/${d}`, skill: "adding fractions",
          explain: `The parts are the same size, so add the tops: ${a} + ${b} = ${a + b}, giving ${a + b}/${d}.` });
        const t = a + b;
        return choice(`Ella has ${t}/${d} of a cake. She gives away ${b}/${d}. How much is left?`, `${a}/${d}`, [`${a}/${d * 2}`, `${t + b}/${d}`], { label: `${t}/${d}-${b}/${d}`, skill: "taking away fractions",
          explain: `Take away the tops: ${t} − ${b} = ${a}, so ${a}/${d} is left.` });
      }) },
    { id: "en-lines-shapes", title: "Lines and shapes: parallel, perpendicular, quadrilaterals (Years 3 and 4)", level: "First", organiser: SHAPE, blurb: "Horizontal, vertical, parallel and perpendicular lines, and sorting quadrilaterals and triangles by their properties.",
      make: () => distinct(10, () => {
        if (rand(2)) { const kind = pick(["parallel", "perpendicular", "neither", "horizontal", "vertical", "diagonal"]);
          const pair = ["parallel", "perpendicular", "neither"].includes(kind), pool = pair ? ["parallel", "perpendicular", "neither"] : ["horizontal", "vertical", "diagonal"];
          return choice(pair ? "Are these lines parallel, perpendicular, or neither?" : "Is this line horizontal, vertical or diagonal?", kind, pool.filter(x => x !== kind),
            { html: linesSVG(kind), label: kind, skill: "types of lines", explain: { parallel: "Parallel lines stay the same distance apart and never meet.", perpendicular: "Perpendicular lines meet at a right angle.",
              neither: "They aren't the same distance apart, and they don't meet at a right angle.", horizontal: "Horizontal lines go straight across, like the horizon.", vertical: "Vertical lines go straight up and down.", diagonal: "It slopes, so it's diagonal." }[kind] }); }
        const [clue, ans] = pick([["4 equal sides and 4 right angles", "square"], ["4 right angles, and opposite sides equal but not all four", "rectangle"], ["exactly one pair of parallel sides", "trapezium"],
          ["4 equal sides but no right angles", "rhombus"], ["2 pairs of parallel sides, no right angles, and sides not all equal", "parallelogram"],
          ["3 equal sides", "equilateral triangle"], ["exactly 2 equal sides", "isosceles triangle"], ["no equal sides", "scalene triangle"], ["one right angle and 3 sides", "right-angled triangle"]]);
        const pool = ans.includes("triangle") ? ["equilateral triangle", "isosceles triangle", "scalene triangle", "right-angled triangle"] : ["square", "rectangle", "trapezium", "rhombus", "parallelogram"];
        return choice(`Which shape has ${clue}?`, ans, others2(ans, pool), { label: clue, skill: "classifying shapes", explain: `A ${ans} has ${clue}.` });
      }) },
    { id: "en-angles-rectangles", title: "Right angles, turns and rectangles (Year 5)", level: "Second", organiser: ANGLE, blurb: "Multiples of 90°, angles on a line and round a point, and missing lengths and angles in rectangles.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const n = rand(4) + 1, name = ["one right angle", "two right angles", "three right angles", "four right angles"][n - 1];
          return typed(`How many degrees are in ${name}?`, n * 90, { label: `${n} right angles`, skill: "multiples of 90°", explain: `Each right angle is 90°, so ${n} × 90 = ${n * 90}°.` }); }
        if (k === 1) { const a = (rand(15) + 2) * 10, line = rand(2) === 1, total = line ? 180 : 360;
          return typed(`Angles ${line ? "on a straight line" : "around a point"} add up to ${total}°. One angle is ${a}°${line ? "" : " and the other two are 90° each"}. What is the missing angle?`, line ? total - a : total - a - 180,
            { label: `${line ? "line" : "point"} ${a}`, skill: "angles on a line and at a point", explain: `${total}° − ${line ? a : `${a}° − 180°`} = ${line ? total - a : total - a - 180}°.` }); }
        const l = rand(9) + 4, w = rand(l - 2) + 2;
        if (k === 2) return typed(`A rectangle is ${l} cm long and ${w} cm wide. What is its perimeter? (in cm)`, 2 * (l + w), { label: `per ${l}x${w}`, skill: "properties of rectangles",
          explain: `Opposite sides are equal: ${l} + ${w} + ${l} + ${w} = ${2 * (l + w)} cm.` });
        return typed(`A rectangle has a perimeter of ${2 * (l + w)} cm. One side is ${l} cm. How long is the shorter side? (in cm)`, w, { label: `missing ${l}x${w}`, skill: "missing lengths in rectangles",
          explain: `Half the perimeter is ${l + w} cm, which is one long side and one short side: ${l + w} − ${l} = ${w} cm.` });
      }) },
    { id: "en-count-steps", title: "Counting in steps, and 1000 more or less (Years 4 and 5)", level: "Second", organiser: NUM, blurb: "Count in 6s, 7s, 9s, 25s and 1000s, find 1000 more or less, and count in powers of 10.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) { const step = pick([6, 7, 9, 25, 1000]), s = step * (rand(5) + 1), seq = range(0, 3).map(i => s + i * step);
          return typed(`What comes next? ${seq.map(big).join(", ")}, …`, s + 4 * step, { label: `step ${step} from ${s}`, skill: `counting in ${step}s`, explain: `It goes up ${step} each time: ${big(s + 4 * step)}.` }); }
        if (k === 1) { const n = rand(8000) + 1000, more = rand(2) === 1; return typed(`What is 1000 ${more ? "more" : "less"} than ${big(n)}?`, more ? n + 1000 : n - 1000,
          { label: `1000 ${more} ${n}`, skill: "1000 more or less", explain: `Change the thousands digit by one: ${big(more ? n + 1000 : n - 1000)}.` }); }
        const p = pick([10, 100, 1000, 10000, 100000]), n = rand(800000) + 100000, more = rand(2) === 1;
        return typed(`What is ${big(p)} ${more ? "more" : "less"} than ${big(n)}?`, more ? n + p : n - p, { label: `${p} ${more} ${n}`, skill: "counting in powers of 10",
          explain: `Only the digit worth ${big(p)}s changes (unless it carries): ${big(more ? n + p : n - p)}.` });
      }) },
    { id: "en-roman", title: "Roman numerals to 1000 (Years 4 and 5)", level: "Second", organiser: NUM, blurb: "Read Roman numerals to 100, then to 1000, and years written in Roman numerals.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) { const n = rand(99) + 1; return typed(`What number is ${roman(n)}?`, n, { label: `read ${n}`, skill: "reading Roman numerals",
          explain: `${roman(n)}: I = 1, V = 5, X = 10, L = 50, C = 100. A smaller numeral before a bigger one is taken away. So ${roman(n)} = ${n}.` }); }
        if (k === 1) { const n0 = rand(900) + 100, n = n0 === 100 || n0 === 500 ? n0 + 1 : n0; // C and D on their own would be said as words, not letters
          return choice(`Which is ${n} in Roman numerals?`, roman(n), three(roman(n), [roman(n + 10), roman(n - 9 > 0 ? n - 9 : n + 1), roman(n + 100 > 999 ? n - 100 : n + 100)]),
          { label: `write ${n}`, skill: "writing Roman numerals", explain: `${n} = ${roman(n)}. D = 500, M = 1000.` }); }
        const y = rand(80) + 1950; return typed(`A building has the year ${roman(y)} carved on it. What year is that?`, y, { label: `year ${y}`, skill: "years in Roman numerals",
          explain: `M = 1000, CM = 900, then the rest: ${roman(y)} = ${y}.` });
      }) },
    { id: "en-millions", title: "Numbers to ten million (Year 6)", level: "Second", organiser: NUM, blurb: "Read, write, order and compare numbers up to 10 000 000, and say what each digit is worth.",
      make: () => distinct(10, () => {
        const n = rand(8999999) + 1000000, k = rand(3);
        if (k === 0) { const digits = String(n), i = rand(4), d = Number(digits[i]); if (!d || digits.split("").filter(x => x === digits[i]).length > 1) return { label: "unclear" };
          const val = d * 10 ** (6 - i); return choice(`What is the ${d} worth in ${big(n)}?`, big(val), [big(val / 10), big(val * 10)], { label: `${d} in ${n}`, skill: "value of each digit", explain: `The ${d} is in the ${["millions", "hundred thousands", "ten thousands", "thousands"][i]} place: ${big(val)}.` }); }
        if (k === 1) { const opts = shuffle([n, n + 900000 > 9999999 ? n - 900000 : n + 900000, Number(String(n).split("").reverse().join("")) % 10000000]);
          if (new Set(opts).size < 3) return { label: "same" };
          const top = Math.max(...opts); return choice(`Which number is biggest: ${opts.map(big).join(", ")}?`, big(top), opts.filter(o => o !== top).map(big), { label: `order ${opts.join(",")}`, skill: "ordering large numbers", explain: `Compare from the millions digit first: ${big(top)} is biggest.` }); }
        const add = (rand(9) + 1) * 100000; return typed(`A city has ${big(n)} people. ${big(add)} more move there. How many people live there now?`, n + add,
          { label: `city ${n}+${add}`, skill: "problems with large numbers", explain: `${big(n)} + ${big(add)} = ${big(n + add)}.` });
      }) },
    { id: "en-mult-reasoning", title: "Multiplying: facts, the distributive law, scaling and combinations (Years 3 to 6)", level: "Second", organiser: NUM,
      blurb: "Multiply by 0 and 1, multiply three numbers, split numbers to multiply, scale up and down, and count combinations.",
      make: () => distinct(10, () => {
        const k = rand(5);
        if (k === 0) { const a = rand(90) + 10, [q, ans, why] = pick([[`${a} × 1 =`, a, "Anything times 1 stays the same."], [`${a} × 0 =`, 0, "Anything times 0 is 0."], [`${a} ÷ 1 =`, a, "Dividing by 1 leaves a number the same."]]);
          return typed(q, ans, { label: q, skill: "multiplying by 0 and 1", explain: why }); }
        if (k === 1) { const [a, b, c] = [rand(4) + 2, 5, 2]; return typed(`${a} × ${b} × ${c} =`, a * b * c, { label: `${a}x5x2`, skill: "multiplying three numbers", explain: `Do ${b} × ${c} = 10 first, then × ${a} = ${a * b * c}.` }); }
        if (k === 2) { const t = (rand(4) + 1) * 10, o = rand(8) + 1, m = rand(6) + 3; return typed(`${t + o} × ${m} = ${t} × ${m} + ${o} × ${m} =`, (t + o) * m,
          { label: `${t + o}x${m}`, skill: "the distributive law", explain: `${t} × ${m} = ${t * m} and ${o} × ${m} = ${o * m}, so ${t * m} + ${o * m} = ${(t + o) * m}.` }); }
        if (k === 3) { const a = rand(4) + 2, b = rand(4) + 2, [x, y] = pick([["tops", "skirts"], ["sandwiches", "drinks"], ["hats", "scarves"]]);
          return typed(`There are ${a} ${x} and ${b} ${y}. How many different pairs of one of each can you make?`, a * b, { label: `pairs ${a}x${b}`, skill: "combinations",
            explain: `Each of the ${a} ${x} goes with each of the ${b} ${y}: ${a} × ${b} = ${a * b}.` }); }
        const [q, ans, why] = pick([
          (() => { const p = pick([2, 4, 5]), g = (rand(3) + 1) * 100, n = p * (rand(3) + 2); return [`A recipe uses ${g} g of flour for ${p} people. How much flour is needed for ${n} people? (in g)`, g * n / p, `${n} people is ${n / p} times as many, so ${g} × ${n / p} = ${g * n / p} g.`]; })(),
          (() => { const s = pick([30, 40, 50, 60]), h = rand(3) + 2; return [`A train goes ${s} km in one hour. How far does it go in ${h} hours? (in km)`, s * h, `${s} × ${h} = ${s * h} km.`]; })(),
          (() => { const f = pick([2, 3, 4]), n = f * (rand(6) + 2); return [`Scale ${n} by 1/${f}: what is 1/${f} of ${n}?`, n / f, `1/${f} of ${n} is ${n} ÷ ${f} = ${n / f}.`]; })()]);
        return typed(q, ans, { label: q, skill: "scaling and rates", explain: why });
      }) },
    { id: "en-fractions-y5", title: "Mixed numbers and calculating with fractions (Year 5)", level: "Second", organiser: FDP,
      blurb: "Mixed numbers and improper fractions, adding and subtracting fractions with related denominators, and multiplying fractions by whole numbers.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const d = pick([3, 4, 5, 6, 8]), n = d + rand(d - 1) + 1; return choice(`Write ${n}/${d} as a mixed number.`, mixed(n, d), three(mixed(n, d), [`${n - d} ${d}/${n}`, mixed(n + 1, d), `1 ${n}/${d}`]),
          { label: `${n}/${d} mixed`, skill: "improper fractions to mixed numbers", explain: `${d}/${d} makes 1 whole, with ${n - d}/${d} left: ${mixed(n, d)}.` }); }
        if (k === 1) { const d = pick([2, 3, 4, 5]), w = rand(3) + 1, r = rand(d - 1) + 1; return choice(`Write ${w} ${r}/${d} as an improper fraction.`, `${w * d + r}/${d}`, three(`${w * d + r}/${d}`, [`${w + r}/${d}`, `${w * d}/${d}`, `${w * r + d}/${d}`]),
          { label: `${w} ${r}/${d} improper`, skill: "mixed numbers to improper fractions", explain: `${w} wholes is ${w * d}/${d}; add ${r}/${d} to make ${w * d + r}/${d}.` }); }
        if (k === 2) { const d = pick([2, 3, 4]), D = d * 2, a = rand(d - 1) + 1, b = rand(D - 2 * a > 1 ? D - 2 * a - 1 : 1) + 1, sum = 2 * a + b;
          return choice(`${a}/${d} + ${b}/${D} =`, frac(sum, D), three(frac(sum, D), [`${a + b}/${d + D}`, `${a + b}/${D}`, frac(sum + 1, D)]),
            { label: `${a}/${d}+${b}/${D}`, skill: "adding fractions with related denominators", explain: `${a}/${d} = ${2 * a}/${D}, so ${2 * a}/${D} + ${b}/${D} = ${sum}/${D}${frac(sum, D) !== `${sum}/${D}` ? ` = ${frac(sum, D)}` : ""}.` }); }
        const d = pick([3, 4, 5, 6]), n = rand(d - 1) + 1, m = rand(4) + 2;
        return choice(`${m} × ${n}/${d} =`, mixed(m * n, d), three(mixed(m * n, d), [`${m * n}/${m * d}`, mixed(n, m * d), mixed(m + n, d)]),
          { label: `${m}x${n}/${d}`, skill: "multiplying fractions by whole numbers", explain: `${m} lots of ${n}/${d} is ${m * n}/${d}${mixed(m * n, d) !== `${m * n}/${d}` ? ` = ${mixed(m * n, d)}` : ""}.` });
      }) },
    { id: "en-fractions-y6", title: "Calculating with fractions and decimals (Year 6)", level: "Second", organiser: FDP,
      blurb: "Compare fractions over 1, add with different denominators, multiply and divide fractions, fractions as division, and multiplying decimals.",
      make: () => distinct(10, () => {
        const k = rand(5);
        if (k === 0) { const [a, b] = shuffle([[7, 4], [5, 3], [9, 5], [11, 6], [8, 3]]).slice(0, 2), va = a[0] / a[1], vb = b[0] / b[1], top = va > vb ? a : b;
          return choice(`Which is bigger: ${a[0]}/${a[1]} or ${b[0]}/${b[1]}?`, `${top[0]}/${top[1]}`, [`${(top === a ? b : a)[0]}/${(top === a ? b : a)[1]}`], { label: `${a}v${b}`, skill: "comparing fractions over 1",
            explain: `As mixed numbers: ${a[0]}/${a[1]} = ${mixed(a[0], a[1])} and ${b[0]}/${b[1]} = ${mixed(b[0], b[1])}.` }); }
        if (k === 1) { const [p, q] = pick([[2, 3], [3, 4], [2, 5], [4, 5], [3, 5]]); return choice(`1/${p} + 1/${q} =`, frac(p + q, p * q), three(frac(p + q, p * q), [`2/${p + q}`, `1/${p * q}`, `2/${p * q}`]),
          { label: `1/${p}+1/${q}`, skill: "adding fractions with different denominators", explain: `Use ${p * q}ths: 1/${p} = ${q}/${p * q} and 1/${q} = ${p}/${p * q}, so the total is ${p + q}/${p * q}.` }); }
        if (k === 2) { const [a, b] = [pick([2, 3, 4]), pick([2, 3, 5])]; return choice(`1/${a} × 1/${b} =`, `1/${a * b}`, three(`1/${a * b}`, [`2/${a + b}`, `1/${a + b}`, `${a * b}`]),
          { label: `1/${a}x1/${b}`, skill: "multiplying fractions", explain: `Multiply the tops and the bottoms: 1 × 1 = 1 and ${a} × ${b} = ${a * b}, so 1/${a * b}.` }); }
        if (k === 3) { const [a, b] = [pick([2, 3, 4]), pick([2, 3])]; return choice(`1/${a} ÷ ${b} =`, `1/${a * b}`, three(`1/${a * b}`, [`${b}/${a}`, `1/${a + b}`, `${b}/${a * b}`]),
          { label: `1/${a}/${b}`, skill: "dividing fractions by whole numbers", explain: `Sharing 1/${a} into ${b} equal parts makes each part 1/${a * b}.` }); }
        if (rand(2)) { const [n, d] = pick([[3, 8], [1, 8], [5, 8], [1, 4], [3, 4], [2, 5], [7, 20]]); return typed(`Write ${n}/${d} as a decimal.`, dec3(n / d),
          { input: "decimal", accept: [dec3(n / d).replace(/^0/, "")], label: `${n}/${d} dec`, skill: "fractions as division", explain: `${n}/${d} means ${n} ÷ ${d} = ${dec3(n / d)}.` }); }
        const x = (rand(800) + 101) / 100, m = rand(7) + 2; return typed(`${x.toFixed(2)} × ${m} =`, dec(x * m), { input: "decimal", accept: [(x * m).toFixed(2)], label: `${x}x${m}`, skill: "multiplying decimals",
          explain: `${x.toFixed(2)} × ${m}: multiply as whole numbers, ${Math.round(x * 100)} × ${m} = ${Math.round(x * 100) * m}, then put back two decimal places: ${dec(x * m)}.` });
      }) },
    { id: "en-imperial", title: "Imperial units, and miles and kilometres (Years 5 and 6)", level: "Second", organiser: MEAS, blurb: "Approximate equivalences between metric and imperial units, and converting between miles and kilometres.",
      make: () => distinct(8, () => {
        const k = rand(4);
        if (k === 0) { const n = (rand(5) + 1) * 2; return typed(`1 inch is about 2.5 cm. About how many centimetres is ${n} inches?`, n * 2.5, { input: "decimal", label: `in ${n}`, skill: "inches and centimetres", explain: `${n} × 2.5 = ${n * 2.5} cm.` }); }
        if (k === 1) { const n = rand(5) + 1; return typed(`1 kg is about 2.2 pounds. About how many pounds is ${n} kg?`, dec(n * 2.2), { input: "decimal", label: `kg ${n}`, skill: "kilograms and pounds", explain: `${n} × 2.2 = ${dec(n * 2.2)} pounds.` }); }
        if (k === 2) return choice("Which is closest to 1 pint?", "about 570 ml", ["about 5 litres", "about 50 ml"], { label: "pint", skill: "pints and millilitres", explain: "A pint is a little more than half a litre: about 570 ml." });
        const m = (rand(6) + 1) * 5, toKm = rand(2) === 1;
        return typed(toKm ? `5 miles is about 8 km. About how many kilometres is ${m} miles?` : `5 miles is about 8 km. About how many miles is ${m / 5 * 8} km?`, toKm ? m / 5 * 8 : m,
          { label: `miles ${m} ${toKm}`, skill: "miles and kilometres", explain: toKm ? `${m} ÷ 5 = ${m / 5}, and ${m / 5} × 8 = ${m / 5 * 8} km.` : `${m / 5 * 8} ÷ 8 = ${m / 5}, and ${m / 5} × 5 = ${m} miles.` });
      }) },
    { id: "en-area-formulae", title: "Area of triangles and parallelograms, and formulae (Year 6)", level: "Second", organiser: MEAS, blurb: "Area of triangles and parallelograms, when to use a formula, and simple formulae.",
      make: () => distinct(10, () => {
        const k = rand(4), b = (rand(6) + 2) * 2, h = rand(8) + 3;
        if (k === 0) return typed(`A triangle has a base of ${b} cm and a height of ${h} cm. What is its area? (in cm²)`, b * h / 2, { label: `tri ${b}x${h}`, skill: "area of a triangle", explain: `A triangle is half a rectangle: ${b} × ${h} ÷ 2 = ${b * h / 2} cm².` });
        if (k === 1) return typed(`A parallelogram has a base of ${b} cm and a height of ${h} cm. What is its area? (in cm²)`, b * h, { label: `par ${b}x${h}`, skill: "area of a parallelogram", explain: `Base × height: ${b} × ${h} = ${b * h} cm². (The height is straight up, not the slanted side.)` });
        if (k === 2) { const [l, w, d] = [rand(5) + 2, rand(4) + 2, rand(4) + 2]; return typed(`Volume = length × width × height. What is the volume of a cuboid ${l} cm by ${w} cm by ${d} cm? (in cm³)`, l * w * d,
          { label: `vol ${l}${w}${d}`, skill: "using a formula for volume", explain: `${l} × ${w} × ${d} = ${l * w * d} cm³.` }); }
        const [f, a, m, x, unit] = pick([["C = 2 + 3m", 2, 3, rand(6) + 2, "£"], ["P = 4s", 0, 4, rand(9) + 2, "cm"], ["C = 5 + 2n", 5, 2, rand(8) + 2, "£"]]);
        return typed(`${f}. What is ${f[0]} when ${f.slice(-1)} = ${x}?`, a + m * x, { label: `${f} ${x}`, skill: "simple formulae", explain: `Put ${x} in place of ${f.slice(-1)}: ${a ? `${a} + ` : ""}${m} × ${x} = ${a + m * x}${unit === "cm" ? " cm" : ""}.` });
      }) },
    { id: "en-ratio", title: "Ratio and proportion (Year 6)", level: "Second", organiser: FDP, blurb: "Relative sizes, unequal sharing, and similar shapes with a scale factor.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const [r, b] = pick([[2, 3], [1, 4], [3, 5], [2, 5]]), n = r * (rand(4) + 2); return typed(`For every ${r} red beads there are ${b} blue beads. If there are ${n} red beads, how many blue beads are there?`, n / r * b,
          { label: `beads ${r}:${b} ${n}`, skill: "relative sizes", explain: `${n} red is ${n / r} lots of ${r}, so ${n / r} lots of ${b} blue = ${n / r * b}.` }); }
        if (k === 1) { const t = pick([2, 3, 4]), s = rand(6) + 3; return typed(`Ali has ${t} times as many stickers as Sam. Together they have ${s * (t + 1)}. How many does Sam have?`, s,
          { label: `share ${t} ${s}`, skill: "unequal sharing", explain: `Sam has 1 part and Ali ${t} parts: ${t + 1} parts make ${s * (t + 1)}, so 1 part = ${s}.` }); }
        if (k === 2) { const [a, b] = pick([[2, 3], [1, 3], [3, 4], [2, 5]]), u = rand(5) + 2; return typed(`Share ${u * (a + b)} sweets in the ratio ${a} : ${b}. How many are in the bigger share?`, u * b,
          { label: `ratio ${a}:${b} ${u}`, skill: "sharing in a ratio", explain: `${a + b} parts make ${u * (a + b)}, so one part is ${u}. The bigger share is ${b} × ${u} = ${u * b}.` }); }
        const [w, l] = [rand(4) + 2, rand(4) + 6], f = pick([2, 3, 4]);
        return typed(`A rectangle ${w} cm by ${l} cm is enlarged by a scale factor of ${f}. How long is its longer side now? (in cm)`, l * f, { label: `scale ${w}x${l} ${f}`, skill: "similar shapes",
          explain: `Every length is multiplied by ${f}: ${l} × ${f} = ${l * f} cm.` });
      }) },
    { id: "en-mean", title: "The mean (Year 6)", level: "Second", organiser: DATA, blurb: "Calculate and interpret the mean as an average.",
      make: () => distinct(8, () => {
        const n = rand(3) + 3, m = rand(8) + 4, vals = Array.from({ length: n - 1 }, () => m + rand(7) - 3), last = m * n - vals.reduce((a, b) => a + b, 0);
        if (last < 1) return { label: "neg" };
        const all = shuffle(vals.concat(last));
        if (rand(3)) return typed(`What is the mean of ${all.join(", ")}?`, m, { label: `mean ${all.join(",")}`, skill: "calculating the mean", explain: `Add them (${m * n}) and divide by how many there are (${n}): ${m * n} ÷ ${n} = ${m}.` });
        return typed(`The mean of ${n} numbers is ${m}. ${n - 1} of them are ${all.slice(0, -1).join(", ")}. What is the last number?`, all[n - 1], { label: `missing ${all.join(",")}`, skill: "using the mean",
          explain: `The total must be ${m} × ${n} = ${m * n}. ${m * n} − ${all.slice(0, -1).reduce((a, b) => a + b, 0)} = ${all[n - 1]}.` });
      }) },
    { id: "en-multistep", title: "Multi-step problems, and long division (Years 5 and 6)", level: "Second", organiser: NUM, blurb: "Multi-step problems with large numbers, mental calculations with mixed operations, and dividing by a two-digit number.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const a = (rand(30) + 10) * 50, b = (rand(30) + 10) * 25, goal = Math.ceil((a + b + 500) / 1000) * 1000;
          return typed(`A school raises £${big(a)} on Monday and £${big(b)} on Tuesday. It needs £${big(goal)}. How much more does it need? (in £)`, goal - a - b,
            { label: `raise ${a} ${b}`, skill: "multi-step problems", explain: `£${big(a)} + £${big(b)} = £${big(a + b)}, then £${big(goal)} − £${big(a + b)} = £${big(goal - a - b)}.` }); }
        if (k === 1) { const a = rand(8) + 2, b = rand(9) + 11, c = (rand(9) + 1) * 10; return typed(`${a} × ${b} + ${c} =`, a * b + c, { label: `${a}x${b}+${c}`, skill: "mental calculation with mixed operations", explain: `Multiply first: ${a} × ${b} = ${a * b}, then + ${c} = ${a * b + c}.` }); }
        if (k === 2) { const d = rand(14) + 12, q = rand(300) + 100; return typed(`${big(d * q)} ÷ ${d} =`, q, { label: `${d * q}/${d}`, skill: "dividing by a two-digit number", explain: `${d} × ${q} = ${big(d * q)}, so ${big(d * q)} ÷ ${d} = ${q}.` }); }
        const seats = pick([48, 52, 53, 57]), people = seats * (rand(5) + 3) + rand(seats - 2) + 1;
        return typed(`A coach holds ${seats} people. How many coaches are needed for ${people} people?`, Math.ceil(people / seats), { label: `coach ${seats} ${people}`, skill: "interpreting remainders",
          explain: `${people} ÷ ${seats} = ${Math.floor(people / seats)} remainder ${people % seats}. The people left over still need a coach, so ${Math.ceil(people / seats)}.` });
      }) },
    { id: "en-coordinates", title: "Coordinates: plotting, translating and reflecting (Years 4 to 6)", level: "Second", organiser: ANGLE, blurb: "Plot points to complete a shape, describe translations, and reflect points in the axes.",
      make: () => distinct(10, () => {
        const pt = (x, y) => `(${x}, ${y})`, k = rand(3);
        if (k === 0) { const [x, y, r, u] = [rand(5) + 1, rand(5) + 1, rand(4) + 1, rand(4) + 1]; return choice(`A point at ${pt(x, y)} moves ${r} squares right and ${u} squares up. Where is it now?`, pt(x + r, y + u),
          three(pt(x + r, y + u), [pt(x + u, y + r), pt(x + r, y - u), pt(x - r, y + u)]), { label: `move ${x}${y}${r}${u}`, skill: "translations", explain: `Right adds to the first number, up adds to the second: ${pt(x + r, y + u)}.` }); }
        if (k === 1) { const [x, y, s] = [rand(4) + 1, rand(4) + 1, rand(3) + 2]; return choice(`Three corners of a square are ${pt(x, y)}, ${pt(x + s, y)} and ${pt(x + s, y + s)}. Where is the fourth corner?`, pt(x, y + s),
          three(pt(x, y + s), [pt(y + s, x), pt(x + s, y + s + 1), pt(x - s, y)]), { label: `square ${x}${y}${s}`, skill: "plotting to complete a shape", explain: `The missing corner is above ${pt(x, y)}, level with ${pt(x + s, y + s)}: ${pt(x, y + s)}.` }); }
        const [x, y] = [rand(6) + 1, rand(6) + 1], xAxis = rand(2) === 1, ans = xAxis ? pt(x, -y) : pt(-x, y);
        return choice(`Reflect the point ${pt(x, y)} in the ${xAxis ? "x-axis" : "y-axis"}. Where does it go?`, ans, three(ans, [xAxis ? pt(-x, y) : pt(x, -y), pt(-x, -y), pt(y, x)]),
          { label: `reflect ${x}${y}${xAxis}`, skill: "reflecting in the axes", explain: `Reflecting in the ${xAxis ? "x-axis changes the sign of the second number" : "y-axis changes the sign of the first number"}: ${ans}.` });
      }) }
  ];

  /* ---------- England's curriculum: spelling and grammar it asks for that the CfE activities don't reach ---------- */
  const SPELL_ORG = "Literacy · Writing · Tools for writing (spelling)";
  const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
  const englandEnglish = [
    { id: "en-alphabet", title: "The alphabet and letter names (Year 1)", level: "First", organiser: SPELL_ORG, blurb: "Name the letters in order, and use letter names to tell spellings of the same sound apart.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) { const i = rand(24) + 1, after = rand(2) === 1, ans = ALPHABET[after ? i + 1 : i - 1];
          return choice(`Which letter comes ${after ? "after" : "before"} ${ALPHABET[i]}?`, ans, others2(ans, ALPHABET.filter(c => c !== ALPHABET[i])), { label: `${after ? "after" : "before"} ${ALPHABET[i]}`, skill: "the alphabet in order", explain: `In the alphabet: ${ALPHABET[i - 1]}, ${ALPHABET[i]}, ${ALPHABET[i + 1]}.` }); }
        if (k === 1) { const words = shuffle(["apple", "bed", "cat", "dog", "egg", "fish", "goat", "hat", "jam", "kite", "leg", "mop", "nut", "pig", "sun", "van"]).slice(0, 3), first = words.slice().sort()[0];
          // Said as the question then each word on its own ("Sun. Pig. Apple."), so every part has a recording
          return choice(`Which word comes first in alphabetical order: ${words.join(", ")}?`, first, words.filter(w => w !== first), { label: `abc ${words.join(",")}`, skill: "alphabetical order", explain: `Look at the first letters: ${first[0]} comes first in the alphabet.`,
            say: { text: `Which word comes first in alphabetical order? ${words.map(w => `${w[0].toUpperCase()}${w.slice(1)}.`).join(" ")}` } }); }
        const [word, sound, ans, wrong] = pick([["rain", "ai", "a-i", ["a-y", "a-e"]], ["play", "ai", "a-y", ["a-i", "a-e"]], ["boat", "oa", "o-a", ["o-w", "o-e"]], ["snow", "oa", "o-w", ["o-a", "o-e"]],
          ["tree", "ee", "e-e", ["e-a", "e-y"]], ["leaf", "ee", "e-a", ["e-e", "y"]], ["night", "igh", "i-g-h", ["i-e", "y"]], ["cake", "ai", "a, then e at the end", ["a-i", "a-y"]]]);
        return choice(`In the word “${word}”, which letters spell the ${sound} sound?`, ans, wrong, { label: `letters ${word}`, skill: "letter names for spellings", explain: `“${word}” uses ${ans} for the ${sound} sound.` });
      }) },
    g("eg-homophones-y2", "Year 2: homophones and near-homophones", "First", "Words that sound the same but are spelled differently: there, their and they're, see and sea, to, too and two.", bank([
      ["I can ___ the boats from here.", "see", ["sea", "si"], "See is what your eyes do; the sea is water."], ["We swam in the ___.", "sea", ["see", "si"], "The sea is the salty water; see is looking."],
      ["___ coats are on the floor.", "Their", ["There", "They're"], "Their means belonging to them."], ["Put the box over ___.", "there", ["their", "they're"], "There is a place."],
      ["___ going to the park.", "They're", ["There", "Their"], "They're is short for they are."], ["I have ___ hands.", "two", ["to", "too"], "Two is the number 2."],
      ["I want to come ___.", "too", ["two", "to"], "Too means as well."], ["We walked ___ school.", "to", ["two", "too"], "To shows where you're going."],
      ["Did you ___ that noise?", "hear", ["here", "heer"], "You hear with your ear: hear has ear in it."], ["Come over ___.", "here", ["hear", "heer"], "Here is a place, like there."],
      ["The ___ ate honey in the woods.", "bear", ["bare", "bair"], "A bear is the animal; bare means with nothing on."], ["The ___ shone all day.", "sun", ["son", "sunn"], "The sun is in the sky; a son is a boy in a family."],
      ["Please be ___ in the library.", "quiet", ["quite", "quit"], "Quiet means not loud; quite means fairly."], ["Our team ___ the match.", "won", ["one", "wun"], "Won is the past of win; one is the number 1."]
    ], "homophones")),
    g("eg-homophones-y34", "Years 3 and 4: further homophones", "Second", "Homophones from the Years 3 and 4 spelling list: accept and except, break and brake, whether and weather and more.", bank([
      ["I ___ your apology.", "accept", ["except", "axept"], "Accept means to take or agree to."], ["Everyone came ___ Ben.", "except", ["accept", "exsept"], "Except means leaving out."],
      ["Be careful not to ___ the glass.", "break", ["brake", "braik"], "Break means to smash; a brake slows a bike."], ["Pull the ___ to stop the bike.", "brake", ["break", "braik"], "A brake stops a bike or car."],
      ["The ___ is sunny today.", "weather", ["whether", "wether"], "Weather is rain or sun."], ["I don't know ___ to go.", "whether", ["weather", "wether"], "Whether means if."],
      ["Can I have a ___ of cake?", "piece", ["peace", "peice"], "A piece is a part: a piece of pie."], ["We want ___ and quiet.", "peace", ["piece", "peese"], "Peace is calm, with no fighting."],
      ["The ___ flew over the clouds.", "plane", ["plain", "plaen"], "A plane flies; plain means simple."], ["Let's ___ at the station.", "meet", ["meat", "mete"], "Meet is to get together; meat is food."],
      ["The ___ is in the post.", "mail", ["male", "mayl"], "Mail is letters; male is a boy or man."], ["The lion shook its ___.", "mane", ["main", "mayn"], "A mane is a lion's hair; main means most important."],
      ["That was a ___ film!", "great", ["grate", "grait"], "Great means very good; a grate is for a fire."], ["___ coat is this?", "Whose", ["Who's", "Hoos"], "Whose asks who owns it; who's means who is."]
    ], "homophones")),
    g("eg-homophones-y56", "Years 5 and 6: homophones and words often confused", "Second", "Homophones and words often confused from the Years 5 and 6 list: affect and effect, stationary and stationery, principal and principle.", bank([
      ["The rain will ___ the match.", "affect", ["effect", "afect"], "Affect is usually the verb (to change something)."], ["The medicine had a good ___.", "effect", ["affect", "efect"], "Effect is usually the noun (the result)."],
      ["The car was ___ at the lights.", "stationary", ["stationery", "stationry"], "Stationary means standing still (a for parked car)."], ["Pens and paper are ___.", "stationery", ["stationary", "stationry"], "Stationery is paper and pens (e for envelopes)."],
      ["The ___ of the school gave a talk.", "principal", ["principle", "princeple"], "A principal is the head of a school."], ["Honesty is an important ___.", "principle", ["principal", "princeple"], "A principle is a rule or belief."],
      ["We had ice cream for ___.", "dessert", ["desert", "dezert"], "Dessert is pudding: two s's, like strawberry shortcake."], ["Camels live in the ___.", "desert", ["dessert", "dezert"], "A desert is dry, sandy land."],
      ["She ___ the ball to me.", "passed", ["past", "parsed"], "Passed is a verb: she passed it."], ["We walked ___ the shop.", "past", ["passed", "parst"], "Past means beyond or before now."],
      ["We saw a ___ of cows in the field.", "herd", ["heard", "hurd"], "A herd is a group of animals; heard is the past of hear."], ["I ___ a strange noise.", "heard", ["herd", "hurd"], "Heard is the past of hear, and has ear in it."],
      ["You are not ___ to run in the corridor.", "allowed", ["aloud", "alowed"], "Allowed means permitted."], ["Read the poem ___.", "aloud", ["allowed", "alowd"], "Aloud means so that others can hear."]
    ], "homophones")),
    g("eg-noun-phrases", "Expanded noun phrases (Years 2 and 5 to 6)", "First", "Add words to describe and specify a noun: the blue butterfly, the old man with a stick.", bank([
      ["Which is an expanded noun phrase?", "the tiny, spotted beetle", ["the beetle", "the beetle ran"], "It adds describing words to the noun beetle."],
      ["Which describes the dog most clearly?", "the shaggy dog with muddy paws", ["the dog", "a dog"], "Adjectives and a phrase after the noun tell us more."],
      ["Choose the best words for the gap: the ___ castle", "dark, crumbling", ["very very", "ran"], "Two adjectives describe the castle."],
      ["Which noun phrase tells you which house?", "the house at the end of the street", ["the house", "a house"], "The phrase after the noun specifies which one."],
      ["Which gives the most information in the fewest words?", "a cold, wet October morning", ["a morning that was cold and was wet and in October", "a morning"], "An expanded noun phrase packs the detail in concisely."],
      ["Which is an expanded noun phrase?", "the girl in the red coat", ["the girl smiled", "she"], "The girl is described by 'in the red coat'."],
      ["Which is the noun in 'the enormous, hungry crocodile'?", "crocodile", ["enormous", "hungry"], "The noun is the thing being described."],
      ["Which phrase best describes a scientist's tool?", "a powerful microscope with three lenses", ["a microscope", "it"], "It describes and specifies the microscope."],
      ["Choose the best words for the gap: the ___ butterfly", "blue", ["quickly", "flew"], "An adjective describes the butterfly."],
      ["Which is more concise?", "the ancient oak tree by the river", ["the tree, which was an oak, which was very old, which was by the river", "the tree"], "One noun phrase says it all without repeating 'which was'."]
    ], "expanded noun phrases")),
    g("eg-pronouns", "Nouns or pronouns for clarity (Years 3 and 4)", "Second", "Choose a noun or a pronoun so the meaning is clear and the writing doesn't repeat itself.", bank([
      ["Mia and Jack went swimming. ___ had a great time.", "They", ["He", "She"], "They means Mia and Jack together."],
      ["Tom lost his hat. ___ looked everywhere for it.", "He", ["They", "It"], "He refers back to Tom."],
      ["The cat chased the mouse until ___ hid.", "the mouse", ["it", "they"], "'It' could mean the cat or the mouse, so the noun is clearer."],
      ["Gran gave Ella a book. ___ loved it.", "Ella", ["She", "They"], "'She' could be Gran or Ella; the name makes it clear."],
      ["The children ate lunch, then ___ played outside.", "they", ["the children", "she"], "'They' avoids repeating 'the children'."],
      ["My bike is old, but I love ___.", "it", ["him", "her"], "It refers to the bike."],
      ["Sam and I went to the shop. The shopkeeper smiled at ___.", "us", ["we", "them"], "Us is the pronoun for Sam and me when someone does something to us."],
      ["Which is clearer? ", "Ben told Raj that Raj had won.", ["Ben told Raj that he had won.", "He told him he had won."], "Using the name shows who won."]
    ], "nouns and pronouns")),
    g("eg-tense-perfect", "Keeping tense consistent, and the perfect form (Years 5 and 6)", "Second", "Keep the same tense through a piece of writing, and use the perfect form of verbs to show time and cause.", bank([
      ["Which sentence keeps the same tense?", "We walked to the beach and swam in the sea.", ["We walked to the beach and swim in the sea.", "We walk to the beach and swam in the sea."], "Walked and swam are both past."],
      ["She ___ her homework, so now she can play.", "has finished", ["finish", "finishing"], "The present perfect (has finished) links something done to now."],
      ["By the time we arrived, the film ___ started.", "had", ["has", "have"], "The past perfect (had started) shows it happened before we arrived."],
      ["I ___ to Spain twice.", "have been", ["am", "be"], "Have been (present perfect) talks about experience up to now."],
      ["Which sentence keeps the same tense?", "The dog barks and runs to the gate.", ["The dog barked and runs to the gate.", "The dog barks and ran to the gate."], "Barks and runs are both present."],
      ["He was tired because he ___ all night.", "had worked", ["works", "has work"], "Had worked explains the cause, from before he was tired."],
      ["They ___ the bus, so they walked home.", "had missed", ["miss", "have miss"], "The past perfect shows the earlier event that caused walking home."],
      ["Fix the tense: 'Yesterday I go to the park and played football.'", "Yesterday I went to the park and played football.", ["Yesterday I go to the park and play football.", "Yesterday I goes to the park and played football."], "Yesterday needs the past: went and played."],
      ["We ___ our tickets already, so we can go in.", "have bought", ["buy", "buying"], "Have bought shows it's done and matters now."],
      ["Which sentence keeps the same tense?", "Ella opened the door and stepped outside.", ["Ella opens the door and stepped outside.", "Ella opened the door and steps outside."], "Opened and stepped are both past."]
    ], "tense and the perfect form"))
  ];
  // Homophones are spelling, so they sit with the spelling outcomes
  englandEnglish.forEach(a => { if (/homophones/.test(a.id)) a.organiser = SPELL_ORG; });

  const englandChecks = [
    { id: "n-mtc", title: "Times tables check practice (Year 4)", level: "Second", organiser: "Numeracy · Number and number processes",
      blurb: "25 questions, 6 seconds each, like England's Year 4 multiplication tables check. Type the answer and press Enter.",
      make: () => mtcForm().map(([a, b]) => Object.assign(typed(`${a} × ${b} =`, a * b),
        { time: 6, label: `${a} × ${b}`, skill: `${a} times table`, explain: `${a} × ${b} = ${a * b}.` })) }
  ].map(a => Object.assign(a, { check: false }));

  /* ---------- The catalogue ---------- */

  // Short, auto-marked practice for older pupils. These are a first step alongside the
  // teacher-led work and paper explanations in the Third/Fourth level lessons.
  const secondary = [
    { id: "sec-linear-equations", title: "Solve linear equations", level: "Third", organiser: "Numeracy · Expressions and equations",
      blurb: "Undo two steps in an equation, then check the answer by substitution.",
      make: () => distinct(10, () => {
        const x = rand(21) - 8, a = rand(5) + 2, b = rand(19) - 9, total = a * x + b;
        const signed = b < 0 ? `− ${-b}` : `+ ${b}`;
        return typed(`Solve ${a}x ${signed} = ${total}. What is x?`, x, {
          label: `${a}x${b < 0 ? b : `+${b}`}=${total}`, skill: "solving two-step linear equations",
          explain: `${b < 0 ? `Add ${-b}` : `Subtract ${b}`} on both sides, then divide by ${a}. x = ${x}; check: ${a} × ${x} ${signed} = ${total}.`
        });
      }) },
    { id: "sec-proportion", title: "Direct and inverse proportion", level: "Fourth", organiser: "Numeracy · Fractions, decimal fractions and percentages",
      blurb: "Find the constant, then use it to solve direct and inverse proportion problems.",
      make: () => shuffle([
        ...distinct(5, () => { const k = rand(8) + 2, x = rand(8) + 2, next = rand(8) + 9;
          return typed(`y is directly proportional to x. When x = ${x}, y = ${k * x}. What is y when x = ${next}?`, k * next,
            { label: `direct ${k * x}/${x} to ${next}`, skill: "direct proportion", explain: `y ÷ x = ${k}, so y = ${k}x. When x = ${next}, y = ${k * next}.` }); }),
        ...distinct(5, () => { const first = rand(5) + 2, next = rand(5) + 7, k = first * next * (rand(3) + 2);
          return typed(`y is inversely proportional to x. When x = ${first}, y = ${k / first}. What is y when x = ${next}?`, k / next,
            { label: `inverse ${k}/${first} to ${next}`, skill: "inverse proportion", explain: `x × y stays at ${k}, so y = ${k} ÷ x. When x = ${next}, y = ${k / next}.` }); })
      ]) },
    { id: "sec-evidence-bias", title: "Evidence, inference and bias", level: "Fourth", organiser: "Literacy · Reading · Understanding",
      blurb: "Read short claims closely, spot what the evidence supports, and question bias.",
      make: () => shuffle([
        choice("A shop surveyed 12 customers on a Saturday. Ten liked its new opening hours. Which claim is justified?", "Most of the 12 people surveyed liked the hours.",
          ["Most people in the town liked the hours.", "The new hours increased sales."], { label: "shop survey", skill: "limits of evidence", explain: "The survey only tells us what those 12 customers said; it cannot prove what the town thinks or what happened to sales." }),
        choice("‘After the lights were installed, reports of accidents fell from 18 to 7.’ What else would you need before saying the lights caused the fall?", "Whether other things changed at the same time.",
          ["The colour of the lights.", "The councillor’s opinion of the lights."], { label: "lights and accidents", skill: "cause and correlation", explain: "A change after the lights were installed does not by itself prove the lights caused it." }),
        choice("‘Everyone knows our rival’s plan is a disaster.’ What is the main warning sign?", "The claim uses a sweeping assertion without evidence.",
          ["The writer uses a contraction.", "The plan is described briefly."], { label: "everyone knows", skill: "unsupported claims", explain: "‘Everyone knows’ suggests agreement without giving a source or evidence." }),
        choice("A writer calls one group ‘hard-working locals’ and another ‘troublemakers’, without describing what either did. What may this show?", "Biased word choice.",
          ["A reliable comparison of actions.", "A neutral account of both groups."], { label: "locals and troublemakers", skill: "biased language", explain: "The labels invite us to favour one group before any evidence is given." }),
        choice("‘The station was empty when Amira arrived, though the departure board said the train left in two minutes.’ Which inference has the best support?", "Amira may have missed an announcement or change.",
          ["The train was definitely cancelled.", "Amira had never travelled by train before."], { label: "empty station", skill: "supported inference", explain: "The empty station creates uncertainty. Neither a cancellation nor Amira’s history is established." }),
        choice("‘One pupil improved after using the app, so the app will improve every pupil’s marks.’ What is the weakness?", "One pupil’s result cannot establish what will happen for everyone.",
          ["The claim contains a number.", "The pupil improved rather than stayed the same."], { label: "one pupil", skill: "generalising from a small sample", explain: "A single example is too small to support a claim about all pupils." }),
        choice("A report quotes only people who support a proposal and says no one opposed it. What should a careful reader ask?", "Were opponents asked or left out?",
          ["Were the quotes short enough?", "Did everyone use the same words?"], { label: "one-sided quotes", skill: "missing viewpoints", explain: "The selection of sources may hide disagreement." }),
        choice("‘The door was still locked. Leon checked his watch for the third time and shifted his bag to the other shoulder.’ What is best supported?", "Leon is waiting and growing impatient.",
          ["Leon has lost his keys.", "Leon is going on holiday."], { label: "locked door", skill: "inference from detail", explain: "Checking the time repeatedly and shifting his bag suggest a wait; the passage does not explain why." })
      ]) }
  ];

  /* ---------- Word Builder: prefixes, roots and suffixes (word games for older pupils) ---------- */

  // A pupil reads a meaning, builds the word from its parts, then (in some words) fixes the spelling
  // where the parts join. The parts are written "un-" (prefix), "-ful" (suffix) or "graph" (root).
  // These games use a plain look with no mascot, so they suit P6 to S3.
  const PART_MEANS = {
    "un-": "not", "dis-": "not, or the opposite of", "re-": "again or back", "mis-": "wrongly", "pre-": "before",
    "im-": "not (before m or p)", "il-": "not (before l)", "ir-": "not (before r)", "in-": "not, or in",
    "sub-": "under", "inter-": "between", "non-": "not", "over-": "too much", "super-": "above or beyond",
    "anti-": "against", "auto-": "self", "tele-": "far", "trans-": "across", "micro-": "very small", "bio-": "life",
    "geo-": "earth", "de-": "undo or down", "con-": "together", "ex-": "out", "co-": "together",
    "-ful": "full of", "-less": "without", "-ness": "the state of being", "-ment": "the act or result of",
    "-ly": "in that way", "-er": "a person or thing that does it", "-or": "a person who does it", "-able": "able to be, or able to",
    "-ible": "able to be, or able to", "-ous": "full of or having", "-ion": "the act or result of", "-ation": "the act or result of",
    "-ist": "a person who does or studies it", "-ive": "tending to", "-ology": "the study of", "-al": "to do with",
    "-y": "to do with", "-ence": "the state of", "-ise": "to make",
    graph: "write or draw", port: "carry", struct: "build", dict: "say", spect: "look", rupt: "break", ject: "throw",
    scope: "look at", vis: "see", aud: "hear", phone: "sound", tract: "pull", script: "write", marine: "the sea",
    nation: "a country", fiction: "made-up stories", bio: "life", logy: "study"
  };
  const partType = p => (p.endsWith("-") ? "prefix" : p.startsWith("-") ? "suffix" : "root");
  const partText = p => p.replace(/^-|-$/g, "");
  // w: the word · p: its parts · clue: what it means · use: a sentence with ___ for the word
  // rule and trap: when the parts change as they join, the rule to learn and a likely wrong spelling
  const BUILD_PREFIXES = [
    { w: "unfair", p: "un-|fair", clue: "not fair", use: "It felt ___ that only one team got extra time." },
    { w: "rebuild", p: "re-|build", clue: "to build again", use: "After the storm, the village had to ___ the bridge." },
    { w: "disagree", p: "dis-|agree", clue: "to have a different opinion", use: "It is fine to ___ with a friend, as long as you listen." },
    { w: "misread", p: "mis-|read", clue: "to read wrongly", use: "I ___ the timetable and missed the bus." },
    { w: "preview", p: "pre-|view", clue: "a look at something before it starts", use: "We watched a short ___ of the film." },
    { w: "impossible", p: "im-|possible", clue: "not able to happen", use: "The fog made it almost ___ to see the road." },
    { w: "illegal", p: "il-|legal", clue: "not allowed by law", use: "Dropping litter is ___ in many places." },
    { w: "irregular", p: "ir-|regular", clue: "not following the usual pattern", use: "Some verbs are ___, like go and went." },
    { w: "submarine", p: "sub-|marine", clue: "a boat that travels under the sea", use: "The ___ dived deep below the waves." },
    { w: "international", p: "inter-|national", clue: "between countries", use: "The ___ match had fans from all over the world." },
    { w: "nonfiction", p: "non-|fiction", clue: "writing about real facts, not made-up stories", use: "A book about volcanoes is ___." },
    { w: "overreact", p: "over-|react", clue: "to react too strongly", use: "Try not to ___ if your plan changes." }
  ];
  const BUILD_SUFFIXES = [
    { w: "hopeful", p: "hope|-ful", clue: "full of hope", use: "She was ___ that the rain would stop." },
    { w: "careless", p: "care|-less", clue: "without enough care", use: "One ___ mistake cost us the point." },
    { w: "kindness", p: "kind|-ness", clue: "the quality of being kind", use: "Small acts of ___ make a big difference." },
    { w: "enjoyment", p: "enjoy|-ment", clue: "the feeling of enjoying something", use: "Music adds to my ___ of a long journey." },
    { w: "teacher", p: "teach|-er", clue: "a person who teaches", use: "Our ___ showed us how to check our work." },
    { w: "comfortable", p: "comfort|-able", clue: "giving a relaxed, easy feeling", use: "The old sofa was surprisingly ___." },
    { w: "carelessly", p: "care|-less|-ly", clue: "in a way that shows no care", use: "He threw his bag ___ onto the floor." },
    { w: "happiness", p: "happy|-ness", clue: "the state of being happy", use: "Her face was full of ___.",
      rule: "When a word ends in a consonant and y, change the y to i before adding a suffix.", trap: ["happyness", "hapiness"] },
    { w: "beautiful", p: "beauty|-ful", clue: "full of beauty", use: "We watched a ___ sunset over the hills.",
      rule: "When a word ends in a consonant and y, change the y to i before adding a suffix.", trap: ["beautyful", "beautifull"] },
    { w: "famous", p: "fame|-ous", clue: "known by very many people", use: "The castle is ___ for its ghost stories.",
      rule: "Drop the final e before a suffix that starts with a vowel.", trap: "fameous" },
    { w: "runner", p: "run|-er", clue: "a person who runs", use: "The fastest ___ crossed the line first.",
      rule: "After one short vowel and one consonant, double the consonant before a suffix that starts with a vowel.", trap: "runer" },
    { w: "adventurous", p: "adventure|-ous", clue: "keen to try new and exciting things", use: "An ___ cat climbed onto the roof.",
      rule: "Drop the final e before a suffix that starts with a vowel.", trap: "adventureous" }
  ];
  const BUILD_ROOTS = [
    { w: "autograph", p: "auto-|graph", clue: "a famous person's own signature", use: "She asked the player for an ___." },
    { w: "transport", p: "trans-|port", clue: "to carry from one place to another", use: "Lorries ___ food across the country." },
    { w: "microscope", p: "micro-|scope", clue: "a tool for looking at very small things", use: "Under the ___, the leaf was full of tiny cells." },
    { w: "telephone", p: "tele-|phone", clue: "a device that carries sound over a long distance", use: "She answered the ___ on the first ring." },
    { w: "interrupt", p: "inter-|rupt", clue: "to break in while someone is speaking", use: "Please don't ___ while I'm explaining." },
    { w: "audible", p: "aud|-ible", clue: "loud enough to be heard", use: "His whisper was barely ___." },
    { w: "invisible", p: "in-|vis|-ible", clue: "not able to be seen", use: "The thread was almost ___ against the white cloth." },
    { w: "prediction", p: "pre-|dict|-ion", clue: "a statement about what will happen", use: "My ___ was that the ice would melt by lunch." },
    { w: "destruction", p: "de-|struct|-ion", clue: "the act of breaking something down completely", use: "The flood left a trail of ___." },
    { w: "inspector", p: "in-|spect|-or", clue: "a person whose job is to look closely and check", use: "The ___ checked every room in the building." },
    { w: "decision", p: "decide|-ion", clue: "a choice you make after thinking", use: "It was a hard ___ to leave the team.",
      rule: "Words ending in -ide usually change to -ision: decide, decision.", trap: ["decidion", "decission"] },
    { w: "explanation", p: "explain|-ation", clue: "the reasons or details that make something clear", use: "Her ___ helped me understand the puzzle.",
      rule: "Some roots change their spelling when a suffix is added: explain loses its i in explanation.", trap: ["explaination", "explanaition"] },
    { w: "argument", p: "argue|-ment", clue: "a disagreement, or a reason for an opinion", use: "She made a strong ___ for a longer break.",
      rule: "Usually a consonant suffix keeps the e, but argue drops it: argument is an exception to learn.", trap: ["arguement", "argumant"] },
    { w: "reliable", p: "rely|-able", clue: "able to be trusted to do the same each time", use: "Our old bike is slow but ___.",
      rule: "When a word ends in a consonant and y, change the y to i before adding a suffix.", trap: ["relyable", "realiable"] },
    { w: "noticeable", p: "notice|-able", clue: "easy to see or notice", use: "There was a ___ change in the weather.",
      rule: "Keep the e after c or g before -able, so the c still says s: notice, noticeable.", trap: ["noticable", "noticeible"] }
  ];
  // A short name for each spelling rule, for the teacher's "to practise" list
  const changeName = rule => /y to i/.test(rule) ? "y to i" : /Drop the final e/.test(rule) ? "drop the e"
    : /double/.test(rule) ? "double the consonant" : /-ision/.test(rule) ? "-ide to -ision" : /Keep the e/.test(rule) ? "keep the e after c or g"
      : /argue/.test(rule) ? "argue to argument" : "root changes (explain, explanation)";
  function buildRound(spec, pool) {
    const parts = spec.p.split("|");
    const joined = parts.map(partText).join("");
    if (!spec.rule && joined !== spec.w) throw new Error(`Word Builder: ${spec.p} makes ${joined}, not ${spec.w}`);
    const traps = [].concat(spec.trap || []);
    // (noticeable keeps its e: the parts join unchanged, but the rule is still the thing to learn)
    if (spec.rule && (!traps.length || traps.includes(spec.w))) throw new Error(`Word Builder: ${spec.w} needs a likely wrong spelling to choose from`);
    // Two or three extra tiles of the same kinds, so the pupil has to think about meaning
    const kinds = new Set(parts.map(partType));
    const spare = shuffle([...new Set(pool.flatMap(s => s.p.split("|")))]
      .filter(x => !parts.includes(x) && kinds.has(partType(x)) && partType(x) !== "root"));
    const extraRoots = shuffle([...new Set(pool.flatMap(s => s.p.split("|")))].filter(x => partType(x) === "root" && !parts.includes(x)));
    const tray = shuffle(parts.concat(spare.slice(0, parts.length > 2 ? 3 : 2), extraRoots.slice(0, 1)));
    // The right spelling and up to two likely wrong ones (the parts simply stuck together comes first)
    const options = spec.rule ? shuffle([spec.w].concat([...new Set([joined].concat(traps))].filter(o => o !== spec.w).slice(0, 2))) : [];
    return {
      kind: "build", answer: spec.w, label: spec.w, spelling: spec.w, tokens: [],
      parts, tray, trayMeans: tray.map(x => PART_MEANS[x] || ""), clue: spec.clue, use: spec.use, rule: spec.rule || "", joined, options,
      means: parts.map(x => [partText(x), partType(x), PART_MEANS[x] || ""]),
      skill: spec.rule ? `spelling change: ${changeName(spec.rule)}` : parts.filter(x => partType(x) !== "root").map(x => `${partType(x)} ${x}`).join(", "),
      // Easy to hard: two parts, then three parts, then words whose spelling changes at the join
      diff: parts.length * 10 + (spec.rule ? 25 : 0) + spec.w.length
    };
  }
  const buildGame = (pool, n = 8) => shuffle(pool).slice(0, n).map(spec => buildRound(spec, pool));
  const wordGames = [
    { id: "w-build-prefixes", title: "Word Builder: prefixes", level: "Second", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Read the meaning, then build the word from a prefix and a root. Learn what un-, dis-, mis-, im- and more mean.",
      make: () => buildGame(BUILD_PREFIXES) },
    { id: "w-build-suffixes", title: "Word Builder: suffixes", level: "Second", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Build words with -ful, -less, -ness, -ment and more, then fix the spelling where y changes to i, an e drops or a letter doubles.",
      make: () => buildGame(BUILD_SUFFIXES) },
    { id: "w-build-roots", title: "Word Builder: roots and spelling changes", level: "Third", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Use Greek and Latin roots such as graph, port, spect and dict, and learn the spelling changes in words like decision and noticeable.",
      make: () => buildGame(BUILD_ROOTS) }
  ];

  /* ---------- More word games for older pupils: Code Word, Letter Hunt, Word Sort, Clue Crossword, Letter Grid ---------- */

  // Spelling-list words for the games, with the list they come from (its tip names the pattern)
  const LIST_GROUPS = {
    phonics: () => (window.SPELLING_LISTS || []).slice(1),            // EA Stages 2 and 3: vowel teams, r sounds, endings, more ways to write sounds
    y34: () => (window.ENGLAND_LISTS || []).flatMap(st => st.lists).filter(l => /^(wl-y34|cew-y2)/.test(l.id)),
    y56: () => (window.ENGLAND_LISTS || []).flatMap(st => st.lists).filter(l => /^wl-y56/.test(l.id))
  };
  function listWords(groups, test) {
    const seen = new Set();
    return groups.flatMap(g => {
      const lists = LIST_GROUPS[g]();
      return (lists[0] && lists[0].lists ? lists.flatMap(st => st.lists) : lists).flatMap(l => l.words.map(w => ({ word: String(w).replace(/-$/, ""), list: l })));
    }).filter(({ word }) => /^[a-z]+$/.test(word) && test(word) && !seen.has(word) && seen.add(word));
  }
  const tipOf = list => (list.tip || "").replace(/^From the statutory word list[^.]*\.\s*/, "");

  // Code Word: guess the hidden word in six tries; each letter shows right place, in the word, or not in it
  const codeRound = ({ word, list }) => ({
    kind: "codeword", answer: word, label: word, spelling: word, tokens: [], length: word.length, tries: 6,
    tip: tipOf(list), listTitle: list.title, skill: `spelling: ${list.title.replace(/\s*\(.*\)$/, "")}`,
    diff: word.length * 10 + new Set(word).size // longer words, then words with more different letters
  });
  const codeGame = (groups, test, n = 5) => () => shuffle(listWords(groups, test)).slice(0, n).map(codeRound);

  // Letter Hunt: guess the letters of a hidden word; each miss unlocks a clue instead of drawing anything
  const CLUE_LEVEL = { Second: "second", Third: "third" };
  function huntGame(level, n = 6) {
    return () => {
      const clues = (window.WORD_CLUES || {})[CLUE_LEVEL[level]] || {};
      const lists = level === "Third" ? ["y56"] : ["phonics", "y34"];
      const words = listWords(lists, w => clues[w] && w.length >= 5);
      return shuffle(words).slice(0, n).map(({ word, list }) => ({
        kind: "hunt", answer: word, label: word, spelling: word, tokens: [], misses: 8,
        meaning: clues[word][0], use: clues[word][1], tip: tipOf(list),
        skill: `spelling: ${list.title.replace(/\s*\(.*\)$/, "")}`,
        diff: new Set(word).size * 3 + word.length
      }));
    };
  }

  // Word Sort: put each word in the right group. Each set is one round; mistakes name the word.
  const SORT_SETS = {
    types: [
      { title: "Nouns, verbs and adjectives", bins: ["noun", "verb", "adjective"], diff: 1,
        words: [["castle", 0], ["teacher", 0], ["island", 0], ["whisper", 1], ["explore", 1], ["climb", 1], ["gloomy", 2], ["ancient", 2], ["brave", 2]] },
      { title: "Things, actions and how actions happen", bins: ["noun", "verb", "adverb"], diff: 2,
        words: [["thunder", 0], ["journey", 0], ["courage", 0], ["gallop", 1], ["shiver", 1], ["describe", 1], ["quietly", 2], ["suddenly", 2], ["carefully", 2]] },
      { title: "Joining words and position words", bins: ["conjunction (joins ideas)", "preposition (where or when)"], diff: 3,
        words: [["because", 0], ["although", 0], ["while", 0], ["unless", 0], ["beneath", 1], ["during", 1], ["between", 1], ["across", 1]] },
      { title: "Pronouns and determiners", bins: ["pronoun (stands for a noun)", "determiner (comes before a noun)"], diff: 4,
        words: [["they", 0], ["herself", 0], ["mine", 0], ["someone", 0], ["every", 1], ["those", 1], ["several", 1], ["the", 1]] },
      { title: "Words made with suffixes", bins: ["noun", "adjective", "verb"], diff: 5,
        words: [["kindness", 0], ["movement", 0], ["decision", 0], ["hopeful", 1], ["dangerous", 1], ["comfortable", 1], ["simplify", 2], ["organise", 2], ["strengthen", 2]] }
    ],
    meaning: [
      { title: "Loud or quiet ways to speak", bins: ["loud", "quiet"], diff: 1,
        words: [["bellowed", 0], ["yelled", 0], ["roared", 0], ["shrieked", 0], ["whispered", 1], ["murmured", 1], ["mumbled", 1], ["muttered", 1]] },
      { title: "Happy or unhappy feelings", bins: ["happy", "unhappy"], diff: 2,
        words: [["delighted", 0], ["cheerful", 0], ["content", 0], ["thrilled", 0], ["miserable", 1], ["gloomy", 1], ["dismayed", 1], ["glum", 1]] },
      { title: "Big or small", bins: ["big", "small"], diff: 2,
        words: [["enormous", 0], ["vast", 0], ["immense", 0], ["colossal", 0], ["tiny", 1], ["minute", 1], ["miniature", 1], ["petite", 1]] },
      { title: "Formal or informal", bins: ["formal (a letter to the council)", "informal (a chat with a friend)"], diff: 4,
        words: [["purchase", 0], ["require", 0], ["assist", 0], ["inform", 0], ["buy", 1], ["need", 1], ["help out", 1], ["let you know", 1]] },
      { title: "Fact or opinion words", bins: ["shows an opinion", "neutral"], diff: 5,
        words: [["dreadful", 0], ["superb", 0], ["pointless", 0], ["brilliant", 0], ["Tuesday", 1], ["measured", 1], ["northern", 1], ["wooden", 1]] }
    ],
    spelling: [
      { title: "-tion, -sion or -cian?", bins: ["-tion", "-sion", "-cian"], diff: 1,
        words: [["action", 0], ["station", 0], ["invention", 0], ["television", 1], ["decision", 1], ["confusion", 1], ["musician", 2], ["magician", 2], ["electrician", 2]] },
      { title: "-able or -ible?", bins: ["-able", "-ible"], diff: 2,
        words: [["comfortable", 0], ["enjoyable", 0], ["reasonable", 0], ["valuable", 0], ["terrible", 1], ["visible", 1], ["possible", 1], ["horrible", 1]] },
      { title: "-ant or -ent?", bins: ["-ant", "-ent"], diff: 3,
        words: [["important", 0], ["elegant", 0], ["hesitant", 0], ["relevant", 0], ["different", 1], ["excellent", 1], ["confident", 1], ["innocent", 1]] },
      { title: "ie or ei?", bins: ["ie", "ei"], diff: 4,
        words: [["believe", 0], ["field", 0], ["achieve", 0], ["piece", 0], ["receive", 1], ["ceiling", 1], ["deceive", 1], ["weight", 1]] },
      { title: "-ous words: keep the e, drop it, or change y to i?", bins: ["just add -ous", "drop the e", "y to i"], diff: 5,
        words: [["dangerous", 0], ["poisonous", 0], ["mountainous", 0], ["famous", 1], ["adventurous", 1], ["nervous", 1], ["various", 2], ["furious", 2], ["glorious", 2]] }
    ]
  };
  const sortRound = set => ({
    kind: "sort", answer: set.title, label: set.title, spelling: set.title, tokens: [], bins: set.bins,
    words: shuffle(set.words.map(([word, bin]) => ({ word, bin }))), skill: set.title, diff: set.diff
  });
  const sortGame = key => () => shuffle(SORT_SETS[key]).slice(0, 4).map(sortRound);

  // Clue Crossword: 6 words that cross, with their meanings as clues. Every word is one result.
  function crossword(entries, want = 6, tries = 60) {
    let best = null;
    // Very rarely every try is too big for a phone, so it keeps trying until one fits
    for (let t = 0; (t < tries || (!best && t < tries * 20)) && (!best || best.length < want); t++) {
      const pool = shuffle(entries);
      const placed = [];
      const cells = new Map(); // "r,c" → letter
      const at = (r, c) => cells.get(`${r},${c}`);
      const fits = (w, r, c, down) => {
        let crosses = 0;
        for (let i = 0; i < w.length; i++) {
          const rr = down ? r + i : r, cc = down ? c : c + i;
          const here = at(rr, cc);
          if (here && here !== w[i]) return -1;
          if (here) { crosses++; continue; }
          // no touching neighbours along the sides of a new letter
          if (down ? (at(rr, cc - 1) || at(rr, cc + 1)) : (at(rr - 1, cc) || at(rr + 1, cc))) return -1;
        }
        const before = down ? at(r - 1, c) : at(r, c - 1);
        const after = down ? at(r + w.length, c) : at(r, c + w.length);
        return before || after ? -1 : crosses;
      };
      const place = (e, r, c, down) => {
        placed.push({ ...e, r, c, down });
        for (let i = 0; i < e.word.length; i++) cells.set(`${down ? r + i : r},${down ? c : c + i}`, e.word[i]);
      };
      place(pool[0], 0, 0, false);
      for (const e of pool.slice(1)) {
        if (placed.length >= want) break;
        const spots = [];
        for (const p of placed) for (let i = 0; i < p.word.length; i++) for (let j = 0; j < e.word.length; j++) {
          if (p.word[i] !== e.word[j]) continue;
          const down = !p.down;
          const r = p.down ? p.r + i : p.r - j, c = p.down ? p.c - j : p.c + i;
          if (fits(e.word, r, c, down) > 0) spots.push([r, c, down]);
        }
        if (spots.length) place(e, ...pick(spots));
      }
      // keep it compact enough for a phone
      const rows = placed.flatMap(p => [p.r, p.down ? p.r + p.word.length - 1 : p.r]);
      const cols = placed.flatMap(p => [p.c, p.down ? p.c : p.c + p.word.length - 1]);
      const h = Math.max(...rows) - Math.min(...rows) + 1, w = Math.max(...cols) - Math.min(...cols) + 1;
      if (w > 13 || h > 13) continue;
      if (!best || placed.length > best.length) {
        const r0 = Math.min(...rows), c0 = Math.min(...cols);
        best = placed.map(p => ({ ...p, r: p.r - r0, c: p.c - c0 }));
        best.size = { rows: h, cols: w };
      }
    }
    // Number the starts in reading order, like a printed crossword
    const starts = [...new Set(best.map(p => `${p.r},${p.c}`))].sort((a, b) => { const [ar, ac] = a.split(",").map(Number), [br, bc] = b.split(",").map(Number); return ar - br || ac - bc; });
    best.forEach(p => { p.number = starts.indexOf(`${p.r},${p.c}`) + 1; });
    return best;
  }
  function crosswordGame(level) {
    return () => {
      const clues = (window.WORD_CLUES || {})[CLUE_LEVEL[level]] || {};
      const entries = Object.entries(clues).filter(([w]) => w.length >= 4 && w.length <= 10).map(([word, [meaning]]) => ({ word, meaning }));
      if (entries.length < 6) return [];
      const words = crossword(entries);
      const puzzle = { size: words.size, words: words.map(({ word, meaning, r, c, down, number }) => ({ word, meaning, r, c, down, number })) };
      return puzzle.words.slice().sort((a, b) => (a.down - b.down) || a.number - b.number).map((p, i) => ({
        kind: "crossword", answer: p.word, label: p.word, spelling: p.word, tokens: [], puzzle, index: puzzle.words.indexOf(p),
        skill: "spelling words from their meaning", diff: i // the puzzle keeps its own order
      }));
    };
  }

  // Letter Grid: find words in a grid of letters. The grid is made when the game starts (it needs the
  // word list, which loads separately); this is the one round that holds the result.
  const gridGame = (size, min) => () => [{ kind: "grid", answer: "", label: `${size} × ${size} letter grid`, spelling: "letter grid", tokens: [],
    size, min, skill: "finding and spelling words" }];

  wordGames.push(
    { id: "w-code-5", title: "Code Word: five letters", level: "Second", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Crack the hidden five-letter word from the spelling lists in six tries. Colours show which letters are in the right place.",
      make: codeGame(["phonics", "y34"], w => w.length === 5) },
    { id: "w-code-6", title: "Code Word: six letters", level: "Second", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Crack hidden six-letter words. Think about which letters can spell each sound.",
      make: codeGame(["phonics", "y34"], w => w.length === 6) },
    { id: "w-code-long", title: "Code Word: challenge words", level: "Third", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Crack seven- and eight-letter words from the challenge lists, such as achieve, average and foreign.",
      make: codeGame(["y56", "y34"], w => w.length >= 7 && w.length <= 8) },
    { id: "w-hunt-second", title: "Letter Hunt: everyday words", level: "Second", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Guess the letters of a hidden word. Each miss unlocks a clue: its meaning, a sentence, then its spelling pattern.",
      make: huntGame("Second") },
    { id: "w-hunt-third", title: "Letter Hunt: challenge words", level: "Third", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Guess the letters of longer, trickier words such as necessary and mischievous, with clues after each miss.",
      make: huntGame("Third") },
    { id: "w-sort-types", title: "Word Sort: word types", level: "Second", organiser: "Literacy · Writing · Tools for writing (grammar)",
      blurb: "Sort words into nouns, verbs, adjectives, adverbs and more.",
      make: sortGame("types") },
    { id: "w-sort-meaning", title: "Word Sort: shades of meaning", level: "Second", organiser: "Literacy · Reading · Tools for reading (vocabulary)",
      blurb: "Sort words by what they mean and how they sound: loud or quiet, big or small, formal or informal.",
      make: sortGame("meaning") },
    { id: "w-sort-spelling", title: "Word Sort: spelling choices", level: "Third", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Choose between -tion, -sion and -cian, -able and -ible, -ant and -ent, ie and ei.",
      make: sortGame("spelling") },
    { id: "w-cross-second", title: "Clue Crossword: everyday words", level: "Second", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Read the meaning, then spell the word into the crossword. Every crossword is new.",
      make: crosswordGame("Second") },
    { id: "w-cross-third", title: "Clue Crossword: challenge words", level: "Third", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "A crossword of challenge words such as conscience, neighbour and rhythm, from their meanings.",
      make: crosswordGame("Third") },
    { id: "w-grid-4", title: "Letter Grid: 4 × 4", level: "Second", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Find words of three letters or more by joining letters that touch. Longer words score more; beat your own best.",
      make: gridGame(4, 3) },
    { id: "w-grid-5", title: "Letter Grid: 5 × 5", level: "Third", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "A bigger grid: find words of four letters or more. Add endings like -ed, -ing and -er to find more.",
      make: gridGame(5, 4) }
  );

  /* ---------- Third and Fourth level numeracy and maths (S1 to S3): practice for the secondary lessons ---------- */
  // In the Numbers area with everything else, so S1 to S3 pupils find work at their level. They are
  // left out of the numbers starting check (check: false), which places pupils up to Second level.
  const MONEY = "Numeracy · Money";
  const sup = n => String(n).replace(/-/g, "⁻").replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
  const fracW = (n, d) => { const g = gcd(n, d); return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`; };
  const signed = n => (n < 0 ? `− ${-n}` : `+ ${n}`);
  const negAccept = n => (n < 0 ? [`−${-n}`] : []);
  const sf = (n, s) => Number(n.toPrecision(s));
  const termText = (a, v) => (a === 1 ? v : a === -1 ? `−${v}` : `${minus(a)}${v}`);
  const linear = (a, b, v = "x") => (b ? `${termText(a, v)} ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : termText(a, v));
  const spaced = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Two wrong options, never the same as each other
  const others2u = (answer, pool) => others2(answer, [...new Set(pool.map(String))]);
  const numeracyUpper = [
    { id: "t-negative-calc", title: "Negative numbers in calculations", level: "Third", organiser: NUM, check: false,
      blurb: "Add, subtract, multiply and divide with negative numbers, in context and on their own.",
      make: () => distinct(10, () => {
        const k = rand(5);
        if (k === 0) { const a = -(rand(9) + 2), b = rand(15) + 2, r = a + b; return typed(`${minus(a)} + ${b} = ?`, r, { accept: negAccept(r), label: `${a}+${b}`, skill: "adding with negative numbers", explain: `Start at ${minus(a)} and go up ${b}: ${minus(r)}.` }); }
        if (k === 1) { const a = rand(9) + 1, b = a + rand(9) + 2, r = a - b; return typed(`${a} − ${b} = ?`, r, { accept: negAccept(r), label: `${a}-${b}`, skill: "subtracting past zero", explain: `${a} − ${b} goes ${b - a} below zero: ${minus(r)}.` }); }
        if (k === 2) { const a = rand(8) + 1, b = -(rand(8) + 1), r = a - b; return typed(`${a} − (${minus(b)}) = ?`, r, { label: `${a}-(${b})`, skill: "subtracting a negative", explain: `Taking away a negative is the same as adding: ${a} + ${-b} = ${r}.` }); }
        if (k === 3) { const a = -(rand(7) + 2), b = rand(2) ? -(rand(7) + 2) : rand(7) + 2, r = a * b; return typed(`${minus(a)} × ${b < 0 ? `(${minus(b)})` : b} = ?`, r, { accept: negAccept(r), label: `${a}x${b}`, skill: "multiplying with negative numbers", explain: `${b < 0 ? "Negative × negative is positive" : "Negative × positive is negative"}: ${minus(r)}.` }); }
        const night = -(rand(8) + 1), rise = rand(12) + 3, r = night + rise;
        return typed(`At midnight it was ${minus(night)}°C. By noon it had risen by ${rise} degrees. What was the temperature at noon? (°C)`, r, { accept: negAccept(r), label: `temp ${night}+${rise}`, skill: "negative numbers in context", explain: `${minus(night)} + ${rise} = ${minus(r)}°C.` });
      }) },
    { id: "t-rounding-dp", title: "Rounding to decimal places", level: "Third", organiser: ROUND, check: false,
      blurb: "Round to 1 or 2 decimal places, and estimate answers by rounding first.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k < 2) {
          const dp = k + 1, n = Number(((rand(9000) + 1000) / 1000 + rand(20)).toFixed(3)), ans = Number(n.toFixed(dp));
          if (Math.abs(n * 10 ** dp - Math.round(n * 10 ** dp)) < 1e-9 || Math.abs((n * 10 ** dp) % 1 - 0.5) < 1e-9) return { label: "skip" };
          return typed(`Round ${n} to ${dp} decimal place${dp > 1 ? "s" : ""}.`, n.toFixed(dp), { input: "decimal", accept: [String(ans)], label: `${n} to ${dp}dp`, skill: "rounding to decimal places", explain: `Look at the next digit along: it rounds to ${n.toFixed(dp)}.` });
        }
        const a = rand(40) + 11 + rand(9) / 10, b = rand(8) + 2 + rand(9) / 10, est = Math.round(a) * Math.round(b);
        return choice(`Estimate ${a} × ${b} by rounding each number to the nearest whole number.`, est, others2u(est, [est + Math.round(b), est - Math.round(a), est * 10, Math.round(est / 10)]),
          { label: `est ${a}x${b}`, skill: "estimating by rounding", explain: `${Math.round(a)} × ${Math.round(b)} = ${est}.` });
      }) },
    { id: "t-powers", title: "Powers and roots", level: "Third", organiser: MFP, check: false,
      blurb: "Work out squares, cubes and other powers, and square and cube roots.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const b = rand(11) + 2; return typed(`What is ${b}² (${b} squared)?`, b * b, { label: `${b}^2`, skill: "squares", explain: `${b} × ${b} = ${b * b}.` }); }
        if (k === 1) { const b = rand(5) + 2; return typed(`What is ${b}³ (${b} cubed)?`, b ** 3, { label: `${b}^3`, skill: "cubes", explain: `${b} × ${b} × ${b} = ${b ** 3}.` }); }
        if (k === 2) { const [b, e] = pick([[2, 4], [2, 5], [2, 6], [3, 4], [10, 4], [10, 5], [5, 3], [2, 7]]); return typed(`What is ${b}${sup(e)}?`, b ** e, { label: `${b}^${e}`, skill: "powers", explain: `${b} multiplied by itself ${e} times: ${Array(e).fill(b).join(" × ")} = ${b ** e}.` }); }
        const cube = rand(2), r = cube ? rand(5) + 2 : rand(11) + 2;
        return typed(cube ? `What is the cube root of ${r ** 3}?` : `What is √${r * r}?`, r, { label: cube ? `cbrt ${r ** 3}` : `sqrt ${r * r}`, skill: "square and cube roots", explain: cube ? `${r} × ${r} × ${r} = ${r ** 3}.` : `${r} × ${r} = ${r * r}.` });
      }) },
    { id: "t-fractions-ops", title: "Adding and subtracting fractions", level: "Third", organiser: FDP, check: false,
      blurb: "Add and subtract fractions with different denominators, answers in simplest form.",
      make: () => distinct(10, () => {
        const [d1, d2] = pick([[2, 3], [2, 5], [3, 4], [4, 6], [3, 5], [2, 7], [4, 5], [6, 8], [3, 6], [5, 10]]);
        const n1 = rand(d1 - 1) + 1, n2 = rand(d2 - 1) + 1, add = rand(2), L = (d1 * d2) / gcd(d1, d2);
        const top = add ? n1 * (L / d1) + n2 * (L / d2) : n1 * (L / d1) - n2 * (L / d2);
        if (top <= 0 || fracW(n1, d1) !== `${n1}/${d1}` || fracW(n2, d2) !== `${n2}/${d2}`) return { label: "skip" };
        const ans = fracW(top, L), wrong1 = fracW(add ? n1 + n2 : Math.abs(n1 - n2) || 1, add ? d1 + d2 : Math.max(1, Math.abs(d1 - d2)) + d1), wrong2 = fracW(top + 1, L);
        return choice(`${n1}/${d1} ${add ? "+" : "−"} ${n2}/${d2} = ?`, ans, others2u(ans, [wrong1, wrong2, fracW(top, L * 2)]),
          { label: `${n1}/${d1}${add ? "+" : "-"}${n2}/${d2}`, skill: "adding and subtracting fractions", explain: `Use ${L} as the denominator: ${n1 * (L / d1)}/${L} ${add ? "+" : "−"} ${n2 * (L / d2)}/${L} = ${top}/${L}${ans !== `${top}/${L}` ? ` = ${ans}` : ""}.` });
      }) },
    { id: "t-ratio", title: "Ratio and sharing", level: "Third", organiser: FDP, check: false,
      blurb: "Simplify ratios, share amounts in a ratio, and scale recipes up and down.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) { const a = rand(5) + 1, b = rand(6) + 2, m = rand(5) + 2; if (a === b || gcd(a, b) !== 1) return { label: "skip" };
          return choice(`Write ${a * m} : ${b * m} in its simplest form.`, `${a} : ${b}`, others2u(`${a} : ${b}`, [`${b} : ${a}`, `${a + 1} : ${b + 1}`, `${a * m - a} : ${b * m - b}`]),
            { label: `${a * m}:${b * m}`, skill: "simplifying ratios", explain: `Divide both by ${m}: ${a} : ${b}.` }); }
        if (k === 1) { const a = rand(4) + 1, b = rand(4) + 1, part = (rand(9) + 2) * 5, total = (a + b) * part; if (a === b || gcd(a, b) !== 1) return { label: "skip" };
          return typed(`Share £${total} in the ratio ${a} : ${b}. How much is the bigger share? (£)`, Math.max(a, b) * part, { label: `share ${total} ${a}:${b}`, skill: "sharing in a ratio",
            explain: `${a} + ${b} = ${a + b} parts. £${total} ÷ ${a + b} = £${part} a part, so ${Math.max(a, b)} parts = £${Math.max(a, b) * part}.` }); }
        const serves = pick([2, 4, 6]), want = serves * pick([2, 3]) / pick([1, 2]), g = (rand(8) + 2) * 25, need = (g / serves) * want;
        if (want === serves || !Number.isInteger(need)) return { label: "skip" };
        return typed(`A recipe for ${serves} people uses ${g} g of flour. How much flour for ${want} people? (g)`, need, { label: `recipe ${serves} to ${want} ${g}`, skill: "direct proportion",
          explain: `${want} people is ${want / serves} times as many as ${serves}, so ${g} g × ${want / serves} = ${need} g.` });
      }) },
    { id: "t-speed", title: "Speed, distance and time", level: "Third", organiser: TIME, check: false,
      blurb: "Use speed = distance ÷ time to find speed, distance or time.",
      make: () => distinct(10, () => {
        const s = pick([4, 5, 6, 8, 12, 15, 20, 30, 40, 45, 50, 60, 70, 80]), t = pick([0.5, 1.5, 2, 2.5, 3, 4]), d = s * t, k = rand(3);
        if (!Number.isInteger(d)) return { label: "skip" };
        const hrs = t === 0.5 ? "30 minutes" : t % 1 ? `${Math.floor(t)} hour${t >= 2 ? "s" : ""} 30 minutes` : `${t} hours`;
        if (k === 0) return typed(`A car travels ${d} km in ${hrs}. What is its average speed? (km/h)`, s, { label: `speed ${d}/${t}`, skill: "finding speed", explain: `Speed = distance ÷ time = ${d} ÷ ${t} = ${s} km/h.` });
        if (k === 1) return typed(`A cyclist rides at ${s} km/h for ${hrs}. How far do they go? (km)`, d, { label: `dist ${s}x${t}`, skill: "finding distance", explain: `Distance = speed × time = ${s} × ${t} = ${d} km.` });
        return typed(`How long does a ${d} km journey take at ${s} km/h? (hours, as a decimal)`, t, { input: "decimal", label: `time ${d}/${s}`, skill: "finding time", explain: `Time = distance ÷ speed = ${d} ÷ ${s} = ${t} hours (${hrs}).` });
      }) },
    { id: "t-sequences", title: "Sequences and their rules", level: "Third", organiser: PATTERN, check: false,
      blurb: "Continue sequences, and use a rule like 3n + 2 to find any term.",
      make: () => distinct(10, () => {
        const a = rand(7) + 2, b = rand(11) - 4, seq = [1, 2, 3, 4].map(n => a * n + b), k = rand(3);
        if (k === 0) return typed(`What comes next? ${seq.map(minus).join(", ")}, …`, a * 5 + b, { accept: negAccept(a * 5 + b), label: `next ${seq.join(",")}`, skill: "continuing sequences", explain: `It goes up by ${a} each time: ${seq[3]} + ${a} = ${a * 5 + b}.` });
        if (k === 1) { const n = rand(15) + 10; return typed(`The rule for a sequence is ${linear(a, b, "n")}. What is term number ${n}?`, a * n + b, { label: `${a}n${b} t${n}`, skill: "using a rule", explain: `${a} × ${n} ${signed(b)} = ${a * n + b}.` }); }
        const rule = linear(a, b, "n");
        return choice(`Which rule gives ${seq.map(minus).join(", ")}, …?`, rule, others2u(rule, [linear(a, b + a, "n"), `n ${signed(a)}`, linear(b === 0 ? a + 1 : a, b === 0 ? 1 : 0, "n")].filter(r => r !== rule)),
          { label: `rule ${seq.join(",")}`, skill: "finding the nth term", explain: `It goes up by ${a}, so it starts ${a}n. ${a} × 1 = ${a}, and the first term is ${minus(seq[0])}, so ${b ? signed(b) : "nothing more"}: ${rule}.` });
      }) },
    { id: "t-expressions", title: "Simplifying and evaluating expressions", level: "Third", organiser: EQUATION, check: false,
      blurb: "Collect like terms, and substitute numbers into expressions.",
      make: () => distinct(10, () => {
        if (rand(2)) {
          const a = rand(7) + 2, b = rand(6) + 1, c = rand(9) + 1, d = rand(5) + 1, x = a - b;
          if (x === 0) return { label: "skip" };
          const ans = `${termText(x, "x")} ${signed(c + d)}`.replace("+ ", "+ ");
          return choice(`Simplify ${a}x + ${c} − ${b}x + ${d}.`, ans, others2u(ans, [`${termText(a + b, "x")} ${signed(c + d)}`, `${x + c + d}x`, `${termText(x, "x")} ${signed(c - d)}`]),
            { label: `${a}x+${c}-${b}x+${d}`, skill: "collecting like terms", explain: `${a}x − ${b}x = ${termText(x, "x")}, and ${c} + ${d} = ${c + d}.` });
        }
        const p = rand(5) + 2, q = rand(5) + 1, x = rand(6) + 1, y = rand(5) - 2, val = p * x + q * y;
        return typed(`Work out ${p}x + ${termText(q, "y")} when x = ${x} and y = ${minus(y)}.`, val, { accept: negAccept(val), label: `${p}x+${q}y x${x}y${y}`, skill: "substituting into expressions",
          explain: `${p} × ${x} + ${q} × ${y < 0 ? `(${minus(y)})` : y} = ${p * x} ${signed(q * y)} = ${minus(val)}.` });
      }) },
    { id: "t-angles", title: "Angles in triangles, lines and shapes", level: "Third", organiser: ANGLE, check: false,
      blurb: "Find missing angles using angles on a line, around a point, in triangles and in quadrilaterals.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const a = rand(50) + 40, b = rand(140 - a - 20) + 20; return typed(`A triangle has angles of ${a}° and ${b}°. What is the third angle? (°)`, 180 - a - b, { label: `tri ${a} ${b}`, skill: "angles in a triangle", explain: `Angles in a triangle add to 180°: 180 − ${a} − ${b} = ${180 - a - b}°.` }); }
        if (k === 1) { const a = rand(150) + 15; return typed(`Two angles sit on a straight line. One is ${a}°. What is the other? (°)`, 180 - a, { label: `line ${a}`, skill: "angles on a straight line", explain: `Angles on a straight line add to 180°: 180 − ${a} = ${180 - a}°.` }); }
        if (k === 2) { const a = rand(100) + 60, b = rand(90) + 50, c = 360 - a - b; if (c < 30 || c > 200) return { label: "skip" }; return typed(`Three angles meet at a point: ${a}°, ${b}° and one more. What is it? (°)`, c, { label: `point ${a} ${b}`, skill: "angles around a point", explain: `Angles around a point add to 360°: 360 − ${a} − ${b} = ${c}°.` }); }
        const a = rand(60) + 60, b = rand(60) + 70, c = rand(50) + 60, d = 360 - a - b - c;
        if (d < 40 || d > 170) return { label: "skip" };
        return typed(`A quadrilateral has angles of ${a}°, ${b}° and ${c}°. What is the fourth angle? (°)`, d, { label: `quad ${a} ${b} ${c}`, skill: "angles in a quadrilateral", explain: `Angles in a quadrilateral add to 360°: 360 − ${a} − ${b} − ${c} = ${d}°.` });
      }) },
    { id: "t-probability", title: "Probability from 0 to 1", level: "Third", organiser: CHANCE, check: false,
      blurb: "Write probabilities as fractions, and find the chance of something not happening.",
      make: () => distinct(10, () => {
        const r = rand(6) + 1, b = rand(6) + 2, g = rand(5) + 1, total = r + b + g, k = rand(3);
        if (k === 0) { const ans = fracW(r, total); return choice(`A bag has ${r} red, ${b} blue and ${g} green counters. What is the probability of picking red?`, ans, others2u(ans, [fracW(r, b + g), `${r}/${total + 1}`, fracW(b, total)].filter(x => x !== ans)), { label: `bag ${r}${b}${g} red`, skill: "probability as a fraction", explain: `${r} red out of ${total} counters: ${r}/${total}${ans !== `${r}/${total}` ? ` = ${ans}` : ""}.` }); }
        if (k === 1) { const ans = fracW(total - g, total); return choice(`A bag has ${r} red, ${b} blue and ${g} green counters. What is the probability of NOT picking green?`, ans, others2u(ans, [fracW(g, total), fracW(total - g, total + g), fracW(r, total)].filter(x => x !== ans)), { label: `bag ${r}${b}${g} not green`, skill: "probability of not happening", explain: `${total - g} of the ${total} counters are not green: ${total - g}/${total}${ans !== `${total - g}/${total}` ? ` = ${ans}` : ""}.` }); }
        const p = pick([0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6, 0.7, 0.85]), ans = Math.round((1 - p) * 100) / 100;
        return typed(`The probability that it rains tomorrow is ${p}. What is the probability that it doesn't rain?`, ans, { input: "decimal", accept: decAccept(ans), label: `rain ${p}`, skill: "probability of not happening", explain: `The two add up to 1: 1 − ${p} = ${ans}.` });
      }) },
    { id: "t-best-buy", title: "Best value and money problems", level: "Third", organiser: MONEY, check: false,
      blurb: "Compare unit prices, and work with discounts and simple interest.",
      make: () => distinct(8, () => {
        const k = rand(2);
        if (k === 0) { const s1 = pick([200, 250, 400, 500]), p1 = (rand(20) + 10) / 10, s2 = s1 * 2, p2 = Math.round((p1 * 2 + (rand(2) ? 0.3 : -0.3)) * 100) / 100;
          const ans = p2 / s2 < p1 / s1 ? `${s2} g for £${p2.toFixed(2)}` : `${s1} g for £${p1.toFixed(2)}`;
          return choice(`Which is better value: ${s1} g for £${p1.toFixed(2)}, or ${s2} g for £${p2.toFixed(2)}?`, ans, [ans === `${s1} g for £${p1.toFixed(2)}` ? `${s2} g for £${p2.toFixed(2)}` : `${s1} g for £${p1.toFixed(2)}`],
            { label: `best ${s1} ${p1} ${p2}`, skill: "comparing value", explain: `Twice as much for £${p2.toFixed(2)}: compare with 2 × £${p1.toFixed(2)} = £${(p1 * 2).toFixed(2)}.` }); }
        const p = pick([2, 3, 4, 5]), y = pick([2, 3, 4]), amt = pick([200, 500, 800, 1000, 1500]), i = (amt * p * y) / 100;
        return typed(`£${amt} is saved at ${p}% simple interest a year. How much interest after ${y} years? (£)`, i, { label: `interest ${amt} ${p} ${y}`, skill: "simple interest", explain: `${p}% of £${amt} is £${(amt * p) / 100} a year; × ${y} = £${i}.` });
      }) },

    { id: "f-sci-notation", title: "Scientific notation", level: "Fourth", organiser: MFP, check: false,
      blurb: "Write large and small numbers in scientific notation, and back again.",
      make: () => distinct(10, () => {
        const m = (rand(89) + 11) / 10, e = rand(2) ? rand(5) + 3 : -(rand(4) + 2);
        // The ordinary number, written out with its digits (no rounding errors), shifted by `by` places
        const plainOf = by => { const p = e + by, digits = String(m).replace(".", ""), point = 1 + p;
          return point >= digits.length ? spaced(digits + "0".repeat(point - digits.length)) : point > 0 ? `${digits.slice(0, point)}.${digits.slice(point)}` : `0.${"0".repeat(-point)}${digits}`; };
        const plain = plainOf(0), sci = `${m} × 10${sup(e)}`;
        if (rand(2)) return choice(`Write ${plain} in scientific notation.`, sci, others2u(sci, [`${m} × 10${sup(e + 1)}`, `${m} × 10${sup(e - 1)}`, `${m} × 10${sup(-e)}`]),
          { label: `to sci ${plain}`, skill: "writing in scientific notation", explain: `Move the decimal point ${Math.abs(e)} places to get ${m}: ${sci}.` });
        return choice(`Write ${sci} as an ordinary number.`, plain, others2u(plain, [plainOf(1), plainOf(-1)]),
          { label: `from sci ${sci}`, skill: "reading scientific notation", explain: `10${sup(e)} moves the point ${Math.abs(e)} places ${e > 0 ? "right" : "left"}: ${plain}.` });
      }) },
    { id: "f-sig-figs", title: "Significant figures", level: "Fourth", organiser: ROUND, check: false,
      blurb: "Round whole numbers and decimals to 1, 2 or 3 significant figures.",
      make: () => distinct(10, () => {
        const s = rand(3) + 1, big = rand(2), n = big ? rand(890000) + 10000 : Number(((rand(9000) + 1000) / 10 ** (rand(3) + 4)).toPrecision(4));
        const ans = sf(n, s);
        if (ans === n) return { label: "skip" };
        const show = x => (big ? String(x) : String(x));
        return typed(`Round ${big ? spaced(n) : n} to ${s} significant figure${s > 1 ? "s" : ""}.`, show(ans), { input: "decimal", accept: big ? [spaced(ans)] : [], label: `${n} ${s}sf`, skill: "rounding to significant figures",
          explain: `The first ${s} significant figure${s > 1 ? "s" : ""}, rounded by the next digit: ${show(ans)}.${big ? " The zeros keep the number its size." : ""}` });
      }) },
    { id: "f-percent-change", title: "Percentage increase and decrease", level: "Fourth", organiser: FDP, check: false,
      blurb: "Increase and decrease by a percentage, and find a percentage change.",
      make: () => distinct(10, () => {
        const k = rand(3), amt = pick([40, 60, 80, 120, 150, 200, 240, 300, 450]), p = pick([5, 10, 12, 15, 20, 25, 30, 35]);
        const inc = amt * (1 + p / 100), dec2 = amt * (1 - p / 100);
        if (k === 0 && Number.isInteger(inc * 100)) return typed(`Increase £${amt} by ${p}%. (£)`, dec(inc), { input: "decimal", label: `inc ${amt} ${p}`, skill: "percentage increase", explain: `${p}% of £${amt} is £${dec((amt * p) / 100)}; £${amt} + £${dec((amt * p) / 100)} = £${dec(inc)}. Or × ${1 + p / 100}.` });
        if (k === 1 && Number.isInteger(dec2 * 100)) return typed(`A £${amt} coat is reduced by ${p}%. What is the sale price? (£)`, dec(dec2), { input: "decimal", label: `dec ${amt} ${p}`, skill: "percentage decrease", explain: `${p}% of £${amt} is £${dec((amt * p) / 100)}; £${amt} − £${dec((amt * p) / 100)} = £${dec(dec2)}. Or × ${dec(1 - p / 100)}.` });
        const old = pick([20, 40, 50, 80, 120, 200, 250]), pc = pick([10, 15, 20, 25, 30, 40, 50]) * (rand(3) ? 1 : -1), now = old * (1 + pc / 100);
        if (!Number.isInteger(now)) return { label: "skip" };
        return typed(`A price changed from £${old} to £${now}. What was the percentage ${pc > 0 ? "increase" : "decrease"}? (%)`, Math.abs(pc), { label: `change ${old} ${now}`, skill: "percentage change",
          explain: `The change is £${Math.abs(now - old)}. £${Math.abs(now - old)} ÷ £${old} = ${Math.abs(pc) / 100} = ${Math.abs(pc)}%.` });
      }) },
    { id: "f-brackets", title: "Expanding brackets and factorising", level: "Fourth", organiser: EQUATION, check: false,
      blurb: "Multiply out brackets, including two brackets, and factorise expressions.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) { const a = rand(6) + 2, b = rand(9) - 4 || 3, ans = linear(a, a * b); return choice(`Expand ${a}(x ${signed(b)}).`, ans, others2u(ans, [linear(a, b), linear(a, a + b), linear(1, a * b)].filter(r => r !== ans)), { label: `${a}(x${b})`, skill: "expanding a bracket", explain: `${a} × x = ${a}x and ${a} × ${minus(b)} = ${minus(a * b)}: ${ans}.` }); }
        if (k === 1) { const p = rand(7) - 3 || 2, q = rand(7) - 3 || -1, s = p + q, pr = p * q;
          const quad = (b, c) => `x² ${b === 0 ? "" : `${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x `}${c < 0 ? "−" : "+"} ${Math.abs(c)}`.replace(/\s+/g, " ");
          const ans = quad(s, pr);
          return choice(`Expand (x ${signed(p)})(x ${signed(q)}).`, ans, others2u(ans, [quad(s, -pr), quad(pr, s), `x² ${signed(pr)}`].filter(r => r !== ans)), { label: `(x${p})(x${q})`, skill: "expanding two brackets", explain: `x × x = x², the x terms make ${minus(s)}x, and ${minus(p)} × ${minus(q)} = ${minus(pr)}: ${ans}.` }); }
        const f = pick([2, 3, 4, 5, 6]), a = rand(4) + 1, b = rand(6) + 1;
        if (gcd(a, b) !== 1) return { label: "skip" };
        const expr = `${f * a}x + ${f * b}`, ans = `${f}(${termText(a, "x")} + ${b})`;
        return choice(`Factorise ${expr} fully.`, ans, others2u(ans, [`${f * a}(x + ${b})`, `x(${f * a} + ${f * b})`, `${f}(${termText(a, "x")} + ${f * b})`].filter(r => r !== ans)), { label: `fac ${expr}`, skill: "factorising", explain: `${f} goes into both terms: ${ans}. Check by expanding.` });
      }) },
    { id: "f-pythagoras", title: "Pythagoras' theorem", level: "Fourth", organiser: SHAPE, check: false,
      blurb: "Find the longest side, or a shorter side, of a right-angled triangle.",
      make: () => distinct(10, () => {
        const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]]), m = pick([1, 1, 2, 3]);
        if (rand(2)) return typed(`A right-angled triangle has shorter sides ${a * m} cm and ${b * m} cm. How long is the hypotenuse? (cm)`, c * m, { label: `hyp ${a * m} ${b * m}`, skill: "finding the hypotenuse",
          explain: `${a * m}² + ${b * m}² = ${(a * m) ** 2} + ${(b * m) ** 2} = ${(c * m) ** 2}, and √${(c * m) ** 2} = ${c * m}.` });
        return typed(`A right-angled triangle has hypotenuse ${c * m} cm and one shorter side ${b * m} cm. How long is the other shorter side? (cm)`, a * m, { label: `leg ${c * m} ${b * m}`, skill: "finding a shorter side",
          explain: `${c * m}² − ${b * m}² = ${(c * m) ** 2} − ${(b * m) ** 2} = ${(a * m) ** 2}, and √${(a * m) ** 2} = ${a * m}.` });
      }) },
    { id: "f-circles", title: "Circumference and area of a circle", level: "Fourth", organiser: MEAS, check: false,
      blurb: "Use π (take π as 3.14) to find the circumference and area of circles.",
      make: () => distinct(10, () => {
        const r = rand(9) + 2, k = rand(3);
        if (k === 0) { const c = dec(2 * 3.14 * r); return typed(`A circle has radius ${r} cm. What is its circumference? Use π = 3.14. (cm)`, c, { input: "decimal", label: `C r${r}`, skill: "circumference", explain: `C = 2πr = 2 × 3.14 × ${r} = ${c} cm.` }); }
        if (k === 1) { const d = r * 2, c = dec(3.14 * d); return typed(`A circle has diameter ${d} cm. What is its circumference? Use π = 3.14. (cm)`, c, { input: "decimal", label: `C d${d}`, skill: "circumference", explain: `C = πd = 3.14 × ${d} = ${c} cm.` }); }
        const area = dec(3.14 * r * r);
        return typed(`A circle has radius ${r} cm. What is its area? Use π = 3.14. (cm²)`, area, { input: "decimal", label: `A r${r}`, skill: "area of a circle", explain: `A = πr² = 3.14 × ${r} × ${r} = ${area} cm².` });
      }) },
    { id: "f-averages", title: "Averages and spread", level: "Fourth", organiser: DATA, check: false,
      blurb: "Find the mean, median, mode and range, and compare two sets of data.",
      make: () => distinct(10, () => {
        const n = pick([5, 6, 7]), data = Array.from({ length: n }, () => rand(20) + 2), sorted = data.slice().sort((a, b) => a - b), k = rand(3);
        const list = data.join(", ");
        if (k === 0) { const sum = data.reduce((a, b) => a + b, 0); if (sum % n) return { label: "skip" }; return typed(`Find the mean of ${list}.`, sum / n, { label: `mean ${list}`, skill: "the mean", explain: `Total ${sum} ÷ ${n} numbers = ${sum / n}.` }); }
        if (k === 1) { const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2; return typed(`Find the median of ${list}.`, med, { input: "decimal", label: `median ${list}`, skill: "the median", explain: `In order: ${sorted.join(", ")}. The middle ${n % 2 ? "one is" : "two average to"} ${med}.` }); }
        return typed(`Find the range of ${list}.`, sorted[n - 1] - sorted[0], { label: `range ${list}`, skill: "the range", explain: `Biggest − smallest: ${sorted[n - 1]} − ${sorted[0]} = ${sorted[n - 1] - sorted[0]}.` });
      }) },
    { id: "f-nth-term", title: "The nth term", level: "Fourth", organiser: PATTERN, check: false,
      blurb: "Find the nth term of a linear sequence, and decide whether a number is in it.",
      make: () => distinct(10, () => {
        const a = rand(9) - 4 || 3, b = rand(13) - 6, seq = [1, 2, 3, 4].map(n => a * n + b), rule = linear(a, b, "n");
        if (rand(2)) return choice(`Find the nth term of ${seq.map(minus).join(", ")}, …`, rule, others2u(rule, [linear(a, b + a, "n"), linear(-a, b, "n"), linear(a, -b || 1, "n")].filter(r => r !== rule)),
          { label: `nth ${seq.join(",")}`, skill: "finding the nth term", explain: `The difference is ${minus(a)}, so ${termText(a, "n")}. When n = 1 that gives ${minus(a)}, and the first term is ${minus(seq[0])}: ${rule}.` });
        const n = rand(30) + 20, inSeq = rand(2), x = a * n + b + (inSeq ? 0 : (a > 0 ? 1 : -1));
        if (Math.abs(a) === 1) return { label: "skip" };
        return choice(`The nth term of a sequence is ${rule}. Is ${minus(x)} in the sequence?`, inSeq ? "Yes" : "No", [inSeq ? "No" : "Yes"], { label: `in ${rule} ${x}`, skill: "testing a term",
          explain: inSeq ? `${rule} = ${minus(x)} when n = ${n}, a whole number.` : `${rule} = ${minus(x)} doesn't give a whole number for n.` });
      }) }
  ];

  /* ---------- England key stage 4 (Years 10 and 11): GCSE maths practice ---------- */
  // One activity for each Years 10 and 11 maths lesson that had no online practice of its own. They sit
  // in the Numbers area in their own group, out of the starting check. Questions that need a calculator
  // say so, and accept an answer one in the last place either side, so rounding part-way doesn't count
  // against a pupil. The subject content is the national curriculum's (GCSE Foundation and Higher).
  const GCSE = "Mathematics · GCSE maths (Years 10 and 11)";
  // An expression from [coefficient, variable] terms: expr([2, "x²"], [-1, "x"], [3, ""]) is 2x² − x + 3
  const expr = (...terms) => {
    const t = terms.filter(([k]) => k !== 0);
    if (!t.length) return "0";
    return t.map(([k, v], i) => { const mag = Math.abs(k) === 1 && v ? v : `${Math.abs(k)}${v}`; return i === 0 ? (k < 0 ? `−${mag}` : mag) : `${k < 0 ? " − " : " + "}${mag}`; }).join("");
  };
  // A fraction in its simplest form, with its sign in front
  const sfrac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? minus(n) : `${n < 0 ? "−" : ""}${Math.abs(n)}/${d}`; };
  // A rounded answer, and the answers one in the last place either side
  const fixed = (x, p = 1) => (Math.round(x * 10 ** p) / 10 ** p).toFixed(p);
  const near = (x, p = 1) => { const b = Math.round(x * 10 ** p), out = new Set();
    for (const k of [b - 1, b, b + 1]) { const v = k / 10 ** p; out.add(v.toFixed(p)); out.add(String(v)); }
    out.delete(fixed(x, p)); return [...out]; };
  const bracket = n => (n < 0 ? `(${minus(n)})` : String(n));
  const rad = d => d * Math.PI / 180;
  const piOf = k => (k === 1 ? "π" : `${k}π`);
  // A small sketch of a graph, for naming its shape
  const sketch = (f, label) => {
    const P = (x, y) => `${(80 + x * 22).toFixed(1)},${(80 - y * 22).toFixed(1)}`;
    const pts = Array.from({ length: 121 }, (_, i) => -3.4 + i * 6.8 / 120).map(x => [x, f(x)]).filter(([, y]) => Number.isFinite(y) && Math.abs(y) <= 3.4);
    // Break the line where it jumps (the reciprocal graph has two parts)
    const parts = [[]];
    pts.forEach(([x, y], i) => { if (i && Math.abs(y - pts[i - 1][1]) > 1.5) parts.push([]); parts[parts.length - 1].push(P(x, y)); });
    return `<svg class="q-pic" viewBox="0 0 160 160" width="170" height="170" role="img" aria-label="${label}">
      <line x1="4" y1="80" x2="156" y2="80" stroke="#64748b" stroke-width="2"/><line x1="80" y1="4" x2="80" y2="156" stroke="#64748b" stroke-width="2"/>
      <text x="150" y="94" font-size="12" fill="#334155">x</text><text x="86" y="14" font-size="12" fill="#334155">y</text>
      ${parts.filter(p => p.length > 1).map(p => `<polyline points="${p.join(" ")}" fill="none" stroke="#2563A6" stroke-width="3"/>`).join("")}</svg>`;
  };
  const GRAPH_SHAPES = [
    ["linear", x => x + 1, () => `y = ${rand(4) + 2}x ${signed(rand(7) - 3 || 1)}`, "y = x + 1"],
    ["quadratic", x => x * x - 2, () => `y = x² ${signed(-(rand(5) + 1))}`, "y = x² − 2"],
    ["cubic", x => x * x * x, () => `y = x³ ${signed(rand(5) + 1)}`, "y = x³"],
    ["reciprocal", x => (Math.abs(x) < 0.05 ? NaN : 1 / x), () => `y = ${rand(8) + 2}/x`, "y = 1/x"],
    ["exponential", x => 2 ** x, () => `y = ${pick([2, 3, 5])}ˣ`, "y = 2ˣ"]
  ];
  const numeracyGCSE = [
    { id: "k4-indices", title: "Laws of indices and standard form (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Use the laws of indices, zero, negative and fractional powers, and calculate in standard form.",
      make: () => distinct(10, () => {
        const k = rand(6), m = rand(6) + 2, n = rand(5) + 2;
        if (k === 0) { const ans = `x${sup(m + n)}`; return choice(`Simplify x${sup(m)} × x${sup(n)}.`, ans, others2u(ans, [`x${sup(m * n)}`, `2x${sup(m + n)}`, `x${sup(m + n + 1)}`]), { label: `x${m}*x${n}`, skill: "multiplying powers", explain: `Same base, so add the indices: ${m} + ${n} = ${m + n}.` }); }
        if (k === 1) { const ans = `y${sup(m - n)}`; if (m === n) return { label: "skip" }; return choice(`Simplify y${sup(m)} ÷ y${sup(n)}.`, ans, others2u(ans, [`y${sup(n - m)}`, `y${sup(m + n)}`, `1/y${sup(m - n)}`]), { label: `y${m}/y${n}`, skill: "dividing powers", explain: `Same base, so subtract the indices: ${m} − ${n} = ${m - n}.${m < n ? ` A negative index means 1 over: y${sup(m - n)} = 1/y${sup(n - m)}.` : ""}` }); }
        if (k === 2) { const a = rand(3) + 2, ans = `${a ** n}a${sup(m * n)}`; return choice(`Simplify (${a}a${sup(m)})${sup(n)}.`, ans, others2u(ans, [`${a * n}a${sup(m * n)}`, `${a ** n}a${sup(m + n)}`, `${a}a${sup(m * n)}`]), { label: `(${a}a${m})^${n}`, skill: "a power of a power", explain: `${a}${sup(n)} = ${a ** n}, and (a${sup(m)})${sup(n)} = a${sup(m * n)}: multiply the indices.` }); }
        if (k === 3) { const [b, e] = pick([[2, 3], [2, 4], [3, 2], [4, 2], [5, 2], [10, 3], [2, 5], [6, 2]]), ans = `1/${b ** e}`;
          return choice(`What is ${b}${sup(-e)}?`, ans, others2u(ans, [`−${b ** e}`, `−${b * e}`, `1/${b * e}`]), { label: `${b}^-${e}`, skill: "negative indices", explain: `A negative index means the reciprocal: ${b}${sup(-e)} = 1/${b}${sup(e)} = 1/${b ** e}.` }); }
        if (k === 4) { const [b, top, bot, ans] = pick([[16, 1, 2, 4], [25, 1, 2, 5], [27, 1, 3, 3], [8, 1, 3, 2], [64, 1, 3, 4], [8, 2, 3, 4], [27, 2, 3, 9], [4, 3, 2, 8], [9, 3, 2, 27], [16, 3, 4, 8], [100, 3, 2, 1000], [125, 2, 3, 25]]);
          const f = `${top}/${bot}`;
          return typed(`What is ${b} to the power ${f}? (no calculator)`, ans, { label: `${b}^${f}`, skill: "fractional indices", explain: `The bottom of the power is a root and the top is a power: the ${bot === 2 ? "square" : bot === 3 ? "cube" : `${bot}th`} root of ${b} is ${Math.round(b ** (1 / bot))}${top > 1 ? `, then to the power ${top}: ${ans}` : ""}.` }); }
        const a = rand(8) + 2, b = rand(8) + 2, p = rand(5) + 2, q = rand(6) + 2, prod = a * b, big = prod >= 10;
        const ans = `${big ? prod / 10 : prod} × 10${sup(p + q + (big ? 1 : 0))}`;
        return choice(`Work out (${a} × 10${sup(p)}) × (${b} × 10${sup(q)}). Give your answer in standard form.`, ans,
          others2u(ans, [`${prod} × 10${sup(p + q)}`, `${big ? prod / 10 : prod} × 10${sup(p * q)}`, `${big ? prod / 10 : prod} × 10${sup(p + q + (big ? 0 : 1))}`]),
          { label: `sf ${a}e${p}*${b}e${q}`, skill: "standard form", explain: `${a} × ${b} = ${prod}, and 10${sup(p)} × 10${sup(q)} = 10${sup(p + q)}.${big ? ` ${prod} isn't between 1 and 10, so it becomes ${prod / 10} × 10, and the power goes up by 1.` : ""}` });
      }) },
    { id: "k4-surds", title: "Surds and recurring decimals (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Simplify surds, rationalise denominators, and change recurring decimals into fractions.",
      make: () => distinct(10, () => {
        const k = rand(5), s = pick([2, 3, 5, 6, 7]), c = rand(5) + 2;
        if (k === 0) { const ans = `${c}√${s}`; return choice(`Simplify √${c * c * s}.`, ans, others2u(ans, [`${s}√${c}`, `${c * c}√${s}`, `${c + 1}√${s}`]), { label: `sqrt${c * c * s}`, skill: "simplifying surds", explain: `${c * c * s} = ${c * c} × ${s}, and √${c * c} = ${c}: ${ans}.` }); }
        if (k === 1) { const a = rand(4) + 1, ans = `${a + c}√${s}`; return choice(`Simplify ${a === 1 ? "" : a}√${s} + √${c * c * s}.`, ans, others2u(ans, [`${a + 1}√${s + c * c * s}`, `${a * c}√${s}`, `${a + c * c}√${s}`]), { label: `${a}r${s}+r${c * c * s}`, skill: "adding surds", explain: `√${c * c * s} = ${c}√${s}, so ${a === 1 ? "" : a}√${s} + ${c}√${s} = ${ans}.` }); }
        if (k === 2) { const t = rand(4) + 2, ans = `${t}√${s}`; return choice(`Rationalise the denominator: ${t * s}/√${s}.`, ans, others2u(ans, [`${t * s}√${s}`, `${t}/√${s}`, `√${t * s}`]), { label: `${t * s}/r${s}`, skill: "rationalising the denominator", explain: `Multiply top and bottom by √${s}: ${t * s}√${s}/${s} = ${ans}.` }); }
        if (k === 3) { const a = pick([2, 3, 5, 6]), m = rand(3) + 2; return typed(`Work out √${a} × √${a * m * m}.`, a * m, { label: `r${a}*r${a * m * m}`, skill: "multiplying surds", explain: `√${a} × √${a * m * m} = √${a * a * m * m} = ${a * m}.` }); }
        if (rand(2)) { const d = rand(8) + 1, ans = fracW(d, 9); return choice(`Write 0.${String(d).repeat(4)}… (${d} recurring) as a fraction in its simplest form.`, ans, others2u(ans, [`${d}/10`, `${d}/99`, `1/${d + 1}`]), { label: `0.${d}rec`, skill: "recurring decimals to fractions", explain: `Call it x. 10x = ${d}.${d}${d}…, so 10x − x = ${d}: 9x = ${d}, x = ${d}/9${ans !== `${d}/9` ? ` = ${ans}` : ""}.` }); }
        const two = rand(89) + 10; if (two % 11 === 0) return { label: "skip" };
        const ans = fracW(two, 99);
        return choice(`Write 0.${String(two).repeat(3)}… (${two} recurring) as a fraction in its simplest form.`, ans, others2u(ans, [`${two}/100`, fracW(two, 90), `${two}/999`]), { label: `0.${two}rec`, skill: "recurring decimals to fractions", explain: `Two digits repeat, so use 100x: 100x − x = ${two}, 99x = ${two}, x = ${two}/99${ans !== `${two}/99` ? ` = ${ans}` : ""}.` });
      }) },
    { id: "k4-bounds", title: "Bounds and error intervals (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Find upper and lower bounds, write error intervals, and use bounds in a calculation.",
      make: () => distinct(10, () => {
        const k = rand(5);
        if (k === 0) { const t = rand(90) + 10, x = t / 10, up = rand(2), b = (t * 10 + (up ? 5 : -5)) / 100;
          return typed(`A length is ${x.toFixed(1)} cm, to 1 decimal place. What is its ${up ? "upper" : "lower"} bound? (cm)`, b.toFixed(2), { input: "decimal", accept: [String(b)], label: `${x} 1dp ${up}`, skill: "upper and lower bounds", explain: `Half of 0.1 is 0.05, so the length is between ${((t * 10 - 5) / 100).toFixed(2)} and ${((t * 10 + 5) / 100).toFixed(2)} cm.` }); }
        if (k === 1) { const unit = pick([10, 100]), x = (rand(80) + 12) * unit, up = rand(2), b = x + (up ? unit / 2 : -unit / 2);
          return typed(`${x} people came to a match, to the nearest ${unit}. What is the ${up ? "upper" : "lower"} bound?`, b, { label: `${x} n${unit} ${up}`, skill: "upper and lower bounds", explain: `Half of ${unit} is ${unit / 2}: from ${x - unit / 2} up to ${x + unit / 2}.` }); }
        if (k === 2) { const t = rand(80) + 11, lo = ((t * 10 - 5) / 100).toFixed(2), hi = ((t * 10 + 5) / 100).toFixed(2), x = (t / 10).toFixed(1), ans = `${lo} ≤ x < ${hi}`;
          return choice(`x = ${x}, rounded to 1 decimal place. What is the error interval for x?`, ans, others2u(ans, [`${lo} < x ≤ ${hi}`, `${x} ≤ x < ${((t + 1) / 10).toFixed(1)}`, `${((t - 1) / 10).toFixed(1)} ≤ x < ${((t + 1) / 10).toFixed(1)}`]), { label: `err ${x}`, skill: "error intervals", explain: `It could be as low as ${lo} (which rounds up to ${x}) but must be less than ${hi} (which would round up to ${((t + 1) / 10).toFixed(1)}).` }); }
        if (k === 3) { const t = rand(80) + 11, x = (t / 10).toFixed(1), ans = `${x} ≤ x < ${((t + 1) / 10).toFixed(1)}`;
          return choice(`x = ${x}, truncated to 1 decimal place. What is the error interval for x?`, ans, others2u(ans, [`${((t * 10 - 5) / 100).toFixed(2)} ≤ x < ${((t * 10 + 5) / 100).toFixed(2)}`, `${((t - 1) / 10).toFixed(1)} < x ≤ ${x}`, `${x} < x ≤ ${((t + 1) / 10).toFixed(1)}`]), { label: `trunc ${x}`, skill: "truncation", explain: `Truncating chops off the later digits, so x could be anything from ${x} up to (but not including) ${((t + 1) / 10).toFixed(1)}.` }); }
        const a = rand(9) + 4, b = rand(9) + 3, up = rand(2), area = up ? (a + 0.5) * (b + 0.5) : (a - 0.5) * (b - 0.5);
        return typed(`A rectangle is ${a} cm by ${b} cm, each to the nearest centimetre. What is the ${up ? "upper" : "lower"} bound of its area? (cm²)`, String(area), { input: "decimal", label: `rect ${a}x${b} ${up}`, skill: "calculating with bounds", explain: `Use the ${up ? "upper" : "lower"} bound of each side: ${a + (up ? 0.5 : -0.5)} × ${b + (up ? 0.5 : -0.5)} = ${area} cm².` });
      }) },
    { id: "k4-factorise", title: "Factorising quadratics (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Factorise x² + bx + c, the difference of two squares and (higher) ax² + bx + c, and simplify algebraic fractions.",
      make: () => distinct(10, () => {
        const k = rand(4), p = (rand(7) + 1) * (rand(2) ? 1 : -1), q = (rand(7) + 1) * (rand(2) ? 1 : -1);
        const br = (a, c) => `(${expr([a, "x"], [c, ""])})`;
        if (k === 0) { if (p + q === 0 || p === q) return { label: "skip" }; const ans = `${br(1, p)}${br(1, q)}`;
          return choice(`Factorise ${expr([1, "x²"], [p + q, "x"], [p * q, ""])}.`, ans, others2u(ans, [`${br(1, -p)}${br(1, -q)}`, `${br(1, p)}${br(1, -q)}`, `${br(1, -p)}${br(1, q)}`, `${br(1, p + q)}${br(1, 1)}`]),
            { label: `fac ${p},${q}`, skill: "factorising x² + bx + c", explain: `Find two numbers that multiply to ${minus(p * q)} and add to ${minus(p + q)}: ${minus(p)} and ${minus(q)}.` }); }
        if (k === 1) { const a = pick([1, 1, 2, 3]), c = rand(9) + 2, ans = `${br(a, c)}${br(a, -c)}`;
          return choice(`Factorise ${expr([a * a, "x²"], [-c * c, ""])}.`, ans, others2u(ans, [`${br(a, -c)}²`, `${br(a, c)}²`, `${br(a, -c * c)}${br(a, 1)}`]), { label: `dots ${a} ${c}`, skill: "the difference of two squares", explain: `${a === 1 ? "x² is x squared" : `${a * a}x² is (${a}x)²`} and ${c * c} is ${c}²: a difference of two squares, ${ans}.` }); }
        if (k === 2) { const a = pick([2, 3]); if (gcd(Math.abs(p), a) !== 1 || p === q) return { label: "skip" }; const ans = `${br(a, p)}${br(1, q)}`;
          return choice(`Factorise ${expr([a, "x²"], [a * q + p, "x"], [p * q, ""])}. (higher)`, ans, others2u(ans, [`${br(a, q)}${br(1, p)}`, `${br(a, -p)}${br(1, -q)}`, `${br(1, p)}${br(a, -q)}`]),
            { label: `fac${a} ${p},${q}`, skill: "factorising ax² + bx + c", explain: `Check by expanding: ${br(a, p)}${br(1, q)} = ${expr([a, "x²"], [a * q, "x"], [p, "x"], [p * q, ""])} = ${expr([a, "x²"], [a * q + p, "x"], [p * q, ""])}.` }); }
        if (p + q === 0) return { label: "skip" };
        const ans = expr([1, "x"], [q, ""]);
        return choice(`Simplify (${expr([1, "x²"], [p + q, "x"], [p * q, ""])}) ÷ (${expr([1, "x"], [p, ""])}).`, ans, others2u(ans, [expr([1, "x"], [-q, ""]), expr([1, "x"], [p + q, ""]), expr([1, "x"], [p * q, ""])]),
          { label: `alg frac ${p},${q}`, skill: "simplifying algebraic fractions", explain: `Factorise the top: ${br(1, p)}${br(1, q)}. Cancel ${br(1, p)} to leave ${ans}.` });
      }) },
    { id: "k4-functions", title: "Functions and identities (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Use function notation, inverse and composite functions, and tell an identity from an equation.",
      make: () => distinct(10, () => {
        const k = rand(5), a = rand(5) + 2, b = (rand(9) + 1) * (rand(2) ? 1 : -1), n = rand(13) - 4, f = expr([a, "x"], [b, ""]);
        if (k === 0) { const v = a * n + b; return typed(`f(x) = ${f}. Work out f(${minus(n)}).`, v, { accept: negAccept(v), label: `f ${a},${b} at ${n}`, skill: "function notation", explain: `Put ${minus(n)} in for x: ${a} × ${bracket(n)} ${signed(b)} = ${minus(v)}.` }); }
        if (k === 1) { const v = a * n + b; return typed(`f(x) = ${f}. Solve f(x) = ${minus(v)}. What is x?`, n, { accept: negAccept(n), label: `solve f ${a},${b}=${v}`, skill: "solving with functions", explain: `${f} = ${minus(v)}, so ${a}x = ${minus(v - b)} and x = ${minus(n)}.` }); }
        if (k === 2) { const ans = `(x ${signed(-b)})/${a}`; return choice(`f(x) = ${f}. What is the inverse function, f⁻¹(x)?`, ans, others2u(ans, [`(x ${signed(b)})/${a}`, `${a}x ${signed(-b)}`, `x/${a} ${signed(-b)}`]), { label: `inv ${a},${b}`, skill: "inverse functions", explain: `Undo the steps in reverse order: ${b < 0 ? `add ${-b}` : `take away ${b}`}, then divide by ${a}.` }); }
        if (k === 3) { const c = rand(6) + 1, g = `x² ${signed(-c)}`, gx = n * n - c, v = a * gx + b;
          return typed(`f(x) = ${f} and g(x) = ${g}. Work out fg(${minus(n)}).`, v, { accept: negAccept(v), label: `fg ${a},${b},${c} at ${n}`, skill: "composite functions", explain: `Do g first: g(${minus(n)}) = ${n * n} ${signed(-c)} = ${minus(gx)}. Then f(${minus(gx)}) = ${a} × ${bracket(gx)} ${signed(b)} = ${minus(v)}.` }); }
        const m = rand(6) + 2, isId = rand(2), left = `${a}(x ${signed(m)})`, right = isId ? expr([a, "x"], [a * m, ""]) : expr([a, "x"], [m, ""]);
        const ans = isId ? "An identity: true for every value of x" : "An equation: true for only some values of x";
        return choice(`Is ${left} = ${right} an identity or an equation?`, ans, [isId ? "An equation: true for only some values of x" : "An identity: true for every value of x"],
          { label: `id ${a} ${m} ${isId}`, skill: "identities and equations", explain: isId ? `${left} expands to ${right}, so the two sides are always equal: write ≡.` : `${left} expands to ${expr([a, "x"], [a * m, ""])}, which isn't the same as ${right} for every x.` });
      }) },
    { id: "k4-lines", title: "Straight-line graphs: y = mx + c (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Find gradients and intercepts, the equation of a line, and parallel and perpendicular lines.",
      make: () => distinct(10, () => {
        const k = rand(6), m = (rand(5) + 1) * (rand(3) ? 1 : -1), c = (rand(6) + 1) * (rand(2) ? 1 : -1), line = `y = ${expr([m, "x"], [c, ""])}`;
        if (k === 0) { const x1 = rand(7) - 3, dx = rand(4) + 1, dy = (rand(9) + 1) * (rand(2) ? 1 : -1), y1 = rand(9) - 4, ans = sfrac(dy, dx);
          return choice(`What is the gradient of the line through (${minus(x1)}, ${minus(y1)}) and (${minus(x1 + dx)}, ${minus(y1 + dy)})?`, ans, others2u(ans, [sfrac(dx, dy), sfrac(-dy, dx), sfrac(dy + dx, dx)]),
            { label: `grad ${x1},${y1},${dx},${dy}`, skill: "gradient from two points", explain: `Gradient = change in y ÷ change in x = ${minus(dy)} ÷ ${dx} = ${ans}.` }); }
        if (k === 1) { const t = rand(2); return typed(`What is the ${t ? "gradient" : "y-intercept"} of ${line}?`, t ? m : c, { accept: negAccept(t ? m : c), label: `${t ? "m" : "c"} ${m},${c}`, skill: "reading y = mx + c", explain: `In y = mx + c, m is the gradient and c is where the line crosses the y-axis: ${t ? `m = ${minus(m)}` : `c = ${minus(c)}`}.` }); }
        if (k === 2) { const d = pick([2, 3, 4]); return typed(`What is the gradient of the line ${d}y = ${expr([d * m, "x"], [d * c, ""])}?`, m, { accept: negAccept(m), label: `${d}y ${m},${c}`, skill: "rearranging to y = mx + c", explain: `Divide everything by ${d}: ${line}, so the gradient is ${minus(m)}.` }); }
        if (k === 3) { if (c === m) return { label: "skip" }; const c2 = c + rand(5) + 1, ans = `y = ${expr([m, "x"], [c2, ""])}`;
          return choice(`Which line is parallel to ${line}?`, ans, others2u(ans, [`y = ${expr([-m, "x"], [c, ""])}`, `y = ${expr([c || 1, "x"], [m, ""])}`, `y = ${expr([m + 1, "x"], [c, ""])}`]), { label: `par ${m},${c}`, skill: "parallel lines", explain: `Parallel lines have the same gradient, ${minus(m)}.` }); }
        if (k === 4) { const ans = sfrac(-1, m); return choice(`A line has gradient ${minus(m)}. What is the gradient of a line perpendicular to it? (higher)`, ans, others2u(ans, [minus(-m), sfrac(1, m), minus(m)]), { label: `perp ${m}`, skill: "perpendicular lines", explain: `Perpendicular gradients multiply to −1, so it's the negative reciprocal: ${ans}.` }); }
        const x1 = rand(5) - 1, x2 = x1 + rand(3) + 1, ans = line;
        return choice(`Which is the equation of the line through (${minus(x1)}, ${minus(m * x1 + c)}) and (${x2}, ${minus(m * x2 + c)})?`, ans, others2u(ans, [`y = ${expr([-m, "x"], [c, ""])}`, `y = ${expr([m, "x"], [c + m, ""])}`, `y = ${expr([m * 2, "x"], [c, ""])}`]),
          { label: `eq ${m},${c},${x1}`, skill: "the equation of a line", explain: `Gradient = ${minus(m * (x2 - x1))} ÷ ${x2 - x1} = ${minus(m)}. Then ${minus(m * x1 + c)} = ${minus(m)} × ${bracket(x1)} + c gives c = ${minus(c)}.` });
      }) },
    { id: "k4-quadratics", title: "Solving quadratic equations (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Solve quadratics by factorising and (higher) by the formula, and find turning points and intercepts.",
      make: () => distinct(10, () => {
        const k = rand(4), p = (rand(7) + 1) * (rand(2) ? 1 : -1), q = (rand(7) + 1) * (rand(2) ? 1 : -1);
        const roots = (a, b) => `x = ${minus(Math.min(a, b))} or x = ${minus(Math.max(a, b))}`;
        if (k === 0) { if (p === q || p + q === 0) return { label: "skip" }; const ans = roots(-p, -q);
          return choice(`Solve ${expr([1, "x²"], [p + q, "x"], [p * q, ""])} = 0.`, ans, others2u(ans, [roots(p, q), roots(-p, q), roots(p, -q)]), { label: `solve ${p},${q}`, skill: "solving by factorising", explain: `It factorises to (${expr([1, "x"], [p, ""])})(${expr([1, "x"], [q, ""])}) = 0, so one bracket is 0: ${ans}.` }); }
        if (k === 1) { const r = rand(10) + 2, ans = roots(-r, r);
          return choice(`Solve x² = ${r * r}.`, ans, others2u(ans, [`x = ${r}`, `x = ${r * r / 2}`, roots(-(r * r), r * r)]), { label: `sq ${r}`, skill: "solving x² = k", explain: `Both ${r} × ${r} and −${r} × −${r} make ${r * r}, so there are two answers.` }); }
        if (k === 2) { const a = rand(9) - 4, b = rand(13) - 6, ans = `(${minus(a)}, ${minus(b)})`;
          if (a === 0 || b === 0) return { label: "skip" };
          return choice(`What is the turning point of y = (x ${signed(-a)})² ${signed(b)}?`, ans, others2u(ans, [`(${minus(-a)}, ${minus(b)})`, `(${minus(a)}, ${minus(-b)})`, `(${minus(b)}, ${minus(a)})`]), { label: `tp ${a},${b}`, skill: "turning points from completed square form", explain: `The bracket is smallest (0) when x = ${minus(a)}, and then y = ${minus(b)}.` }); }
        const a = pick([1, 2, 3]), b = rand(9) - 4, c = -(rand(8) + 1), disc = b * b - 4 * a * c, r = Math.sqrt(disc);
        if (Number.isInteger(r)) return { label: "skip" };
        const big = (-b + r) / (2 * a);
        return typed(`Use the quadratic formula to solve ${expr([a, "x²"], [b, "x"], [c, ""])} = 0. Give the larger solution to 2 decimal places. (higher, calculator)`, fixed(big, 2),
          { input: "decimal", accept: near(big, 2), label: `qf ${a},${b},${c}`, skill: "the quadratic formula",
            explain: `x = (−b ± √(b² − 4ac)) ÷ 2a = (${minus(-b)} ± √${disc}) ÷ ${2 * a}. The larger uses +: ${fixed(big, 2)}.` });
      }) },
    { id: "k4-simultaneous", title: "Simultaneous equations and inequalities (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Solve a pair of equations together, solve inequalities, and count the whole numbers that fit.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k < 2) { const x = rand(11) - 4 || 3, y = rand(11) - 4, a1 = rand(4) + 1, b1 = rand(4) + 1, a2 = rand(4) + 1, b2 = -(rand(4) + 1);
          if (a1 * b2 - a2 * b1 === 0) return { label: "skip" };
          const eq = (a, b) => `${expr([a, "x"], [b, "y"])} = ${minus(a * x + b * y)}`, ans = `x = ${minus(x)}, y = ${minus(y)}`;
          return choice(`Solve together: ${eq(a1, b1)} and ${eq(a2, b2)}.`, ans, others2u(ans, [`x = ${minus(y)}, y = ${minus(x)}`, `x = ${minus(x)}, y = ${minus(-y || 1)}`, `x = ${minus(-x || 2)}, y = ${minus(y)}`]),
            { label: `sim ${a1}${b1}${a2}${b2} ${x},${y}`, skill: "simultaneous equations", explain: `Make the x or y numbers match and add or subtract to get rid of one letter. Check: ${a1} × ${bracket(x)} ${signed(b1)} × ${bracket(y)} = ${minus(a1 * x + b1 * y)}.` }); }
        if (k === 2) { const a = rand(5) + 2, b = rand(9) - 4, x = rand(9) - 2, gt = rand(2), sym = gt ? ">" : "≤", ans = `x ${sym} ${minus(x)}`;
          return choice(`Solve ${expr([a, "x"], [b, ""])} ${sym} ${minus(a * x + b)}.`, ans, others2u(ans, [`x ${gt ? "<" : "≥"} ${minus(x)}`, `x ${sym} ${minus(x + 1)}`, `x ${sym} ${minus(a * x)}`]),
            { label: `ineq ${a},${b},${x},${gt}`, skill: "solving inequalities", explain: `Solve it like an equation: ${b < 0 ? `add ${-b}` : `take away ${b}`} on both sides, then divide by ${a}. The sign stays the same because ${a} is positive.` }); }
        const a = pick([2, 3]), b = rand(7) - 3, lo = rand(5) - 6, hi = rand(6) + 4;
        const n = range(-30, 30).filter(v => lo < a * v + b && a * v + b <= hi);
        return typed(`How many whole numbers n satisfy ${minus(lo)} < ${expr([a, "n"], [b, ""])} ≤ ${hi}?`, n.length, { label: `count ${a},${b},${lo},${hi}`, skill: "integers that satisfy an inequality", explain: `${b ? `${b < 0 ? "Add" : "Take away"} ${Math.abs(b)} and ` : ""}divide by ${a}: ${sfrac(lo - b, a)} < n ≤ ${sfrac(hi - b, a)}. That's n = ${n.map(minus).join(", ")}.` });
      }) },
    { id: "k4-sequences", title: "Quadratic and geometric sequences (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Continue quadratic, geometric and Fibonacci-type sequences, and find the nth term of a quadratic sequence.",
      make: () => distinct(10, () => {
        const k = rand(5);
        if (k < 2) { const a = pick([1, 1, 2, 3]), b = rand(9) - 4, c = rand(11) - 5, t = n => a * n * n + b * n + c, seq = [1, 2, 3, 4].map(t), rule = `${expr([a, "n²"], [b, "n"], [c, ""])}`;
          if (k === 0) return typed(`What comes next? ${seq.map(minus).join(", ")}, …`, t(5), { accept: negAccept(t(5)), label: `quad next ${a},${b},${c}`, skill: "quadratic sequences", explain: `The differences go ${[1, 2, 3].map(i => minus(seq[i] - seq[i - 1])).join(", ")}, going up by ${2 * a} each time, so the next difference is ${minus(t(5) - seq[3])}.` });
          return choice(`Find the nth term of ${seq.map(minus).join(", ")}, …`, rule, others2u(rule, [expr([a, "n²"], [b + 1, "n"], [c - 1, ""]), expr([2 * a, "n²"], [b, "n"], [c, ""]), expr([a, "n²"], [c, "n"], [b, ""])].filter(r => r !== rule)),
            { label: `quad nth ${a},${b},${c}`, skill: "the nth term of a quadratic sequence", explain: `The second difference is ${2 * a}, so it starts ${a === 1 ? "" : a}n². Take ${a === 1 ? "" : a}n² away and what's left (${[1, 2, 3, 4].map(n => minus(t(n) - a * n * n)).join(", ")}) is ${expr([b, "n"], [c, ""])}.` }); }
        if (k === 2) { const a = rand(5) + 1, r = pick([2, 3, -2, 5]), seq = [0, 1, 2, 3].map(i => a * r ** i);
          return typed(`What comes next? ${seq.map(minus).join(", ")}, …`, a * r ** 4, { accept: negAccept(a * r ** 4), label: `geo ${a},${r}`, skill: "geometric sequences", explain: `Each term is the one before × ${minus(r)}: ${minus(seq[3])} × ${bracket(r)} = ${minus(a * r ** 4)}.` }); }
        if (k === 3) { const a = rand(6) + 1, b = rand(6) + 1, s = [a, b]; while (s.length < 6) s.push(s[s.length - 1] + s[s.length - 2]);
          return typed(`This is a Fibonacci-type sequence. What comes next? ${s.slice(0, 5).join(", ")}, …`, s[5], { label: `fib ${a},${b}`, skill: "Fibonacci-type sequences", explain: `Each term is the two before added: ${s[3]} + ${s[4]} = ${s[5]}.` }); }
        const n = rand(10) + 5, kind = pick(["triangular", "square", "cube"]), v = kind === "triangular" ? n * (n + 1) / 2 : kind === "square" ? n * n : n ** 3;
        return typed(`What is the ${n}th ${kind} number?`, v, { label: `${kind} ${n}`, skill: "special sequences", explain: kind === "triangular" ? `Add 1 + 2 + … + ${n}, or use n(n + 1) ÷ 2: ${n} × ${n + 1} ÷ 2 = ${v}.` : `${n}${kind === "square" ? "²" : "³"} = ${v}.` });
      }) },
    { id: "k4-graph-shapes", title: "Graph shapes and transformations (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Recognise linear, quadratic, cubic, reciprocal and exponential graphs, and how y = f(x) moves.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) { const [name, f, , eq] = pick(GRAPH_SHAPES), others = GRAPH_SHAPES.filter(s => s[0] !== name);
          return choice(`Which equation could this graph have?`, eq, shuffle(others).slice(0, 2).map(s => s[3]), { html: sketch(f, `A ${name} graph`), label: `which eq ${name}`, skill: "recognising graph shapes", explain: `This is ${name === "exponential" ? "an" : "a"} ${name} graph.` }); }
        if (k === 1) { const [name, , eqf] = pick(GRAPH_SHAPES), eq = eqf();
          return choice(`What kind of graph is ${eq}?`, name, others2u(name, GRAPH_SHAPES.map(s => s[0])), { label: `kind ${eq}`, skill: "recognising graph shapes", explain: name === "linear" ? "x to the power 1 gives a straight line." : name === "quadratic" ? "An x² term gives a U-shaped (or ∩-shaped) curve." : name === "cubic" ? "An x³ term gives an S-shaped curve." : name === "reciprocal" ? "A number over x gives two curves that never touch the axes." : "x in the power gives a curve that grows faster and faster." }); }
        const a = rand(5) + 1, moves = [
          [`y = f(x) ${signed(a)}`, `a translation ${a} up`, [`a translation ${a} to the right`, `a translation ${a} to the left`, `a stretch by ${a}`]],
          [`y = f(x) − ${a}`, `a translation ${a} down`, [`a translation ${a} to the right`, `a translation ${a} up`]],
          [`y = f(x + ${a})`, `a translation ${a} to the left`, [`a translation ${a} to the right`, `a translation ${a} up`]],
          [`y = f(x − ${a})`, `a translation ${a} to the right`, [`a translation ${a} to the left`, `a translation ${a} down`]],
          ["y = −f(x)", "a reflection in the x-axis", ["a reflection in the y-axis", "a translation 1 down"]],
          ["y = f(−x)", "a reflection in the y-axis", ["a reflection in the x-axis", "a translation 1 to the left"]]
        ], [g, ans, wrong] = pick(moves);
        return choice(`How does the graph of y = f(x) move to give ${g}? (higher)`, ans, others2u(ans, wrong), { label: `move ${g}`, skill: "transforming graphs", explain: /x[+−] |x − |x \+ /.test(g) ? "A change inside the bracket moves the graph sideways, the opposite way to the sign." : /−f|f\(−/.test(g) ? "A minus outside flips the y values (x-axis); inside flips the x values (y-axis)." : "Adding outside the bracket moves every y value up or down." });
      }) },
    { id: "k4-rates", title: "Real-life graphs and rates of change (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Gradients as speeds and accelerations, distance from the area under a graph, and the kinematics formulae.",
      make: () => distinct(10, () => {
        const k = rand(5);
        if (k === 0) { const s = pick([3, 4, 5, 6, 8, 10, 12]), t = pick([0.5, 1.5, 2, 2.5, 3]), d = s * t; if (!Number.isInteger(d * 2)) return { label: "skip" };
          return typed(`A distance–time graph is a straight line from (0, 0) to (${t} hours, ${d} km). What is the speed? (km/h)`, s, { label: `dt ${d}/${t}`, skill: "gradient as a speed", explain: `The gradient of a distance–time graph is the speed: ${d} ÷ ${t} = ${s} km/h.` }); }
        if (k === 1) { const a = pick([2, 3, 4, 5]), t = rand(6) + 2, u = pick([0, 0, 2, 4, 5]); const v = u + a * t;
          return typed(`On a speed–time graph, the speed goes in a straight line from ${u} m/s to ${v} m/s in ${t} seconds. What is the acceleration? (m/s²)`, a, { label: `acc ${u},${v},${t}`, skill: "gradient as an acceleration", explain: `Acceleration = change in speed ÷ time = ${v - u} ÷ ${t} = ${a} m/s².` }); }
        if (k === 2) { const u = pick([0, 2, 4, 6]), v = u + pick([4, 6, 8, 10]), t = rand(8) + 2, d = (u + v) / 2 * t;
          return typed(`A speed–time graph goes in a straight line from ${u} m/s to ${v} m/s over ${t} seconds. How far does the object travel? (m)`, d, { label: `area ${u},${v},${t}`, skill: "the area under a graph", explain: `Distance is the area under the graph, a ${u ? "trapezium" : "triangle"}: (${u} + ${v}) ÷ 2 × ${t} = ${d} m.` }); }
        if (k === 3) { const u = rand(10), a = rand(4) + 1, t = rand(8) + 2;
          return typed(`Use v = u + at. u = ${u} m/s, a = ${a} m/s², t = ${t} s. What is v? (m/s)`, u + a * t, { label: `v=u+at ${u},${a},${t}`, skill: "kinematics formulae", explain: `v = ${u} + ${a} × ${t} = ${u + a * t} m/s.` }); }
        const u = rand(6), a = pick([2, 4, 6]), t = rand(5) + 2, s = u * t + a * t * t / 2;
        return typed(`Use s = ut + ½at². u = ${u} m/s, a = ${a} m/s², t = ${t} s. What is s? (m)`, s, { label: `s ${u},${a},${t}`, skill: "kinematics formulae", explain: `s = ${u} × ${t} + ½ × ${a} × ${t}² = ${u * t} + ${a * t * t / 2} = ${s} m.` });
      }) },
    { id: "k4-growth", title: "Growth, decay and compound interest (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Multipliers, compound interest, depreciation, reverse percentages and iteration.",
      make: () => distinct(10, () => {
        const k = rand(5);
        if (k === 0) { const p = pick([3, 4, 5, 8, 12, 15, 20, 35]), up = rand(2), m = up ? 1 + p / 100 : 1 - p / 100, ans = String(Math.round(m * 100) / 100);
          return choice(`What do you multiply by to ${up ? "increase" : "decrease"} an amount by ${p}%?`, ans, others2u(ans, [String(Math.round((up ? 1 - p / 100 : 1 + p / 100) * 100) / 100), String(p / 100), String(p)]), { label: `mult ${p} ${up}`, skill: "percentage multipliers", explain: `${up ? "100% + " : "100% − "}${p}% = ${Math.round(m * 100)}%, which is × ${ans}.` }); }
        if (k === 1) { const P = pick([500, 800, 1000, 1200, 2000, 2500, 5000]), r = pick([2, 3, 4, 5]), n = rand(4) + 2, A = P * (1 + r / 100) ** n;
          return typed(`£${P} is invested at ${r}% compound interest a year. How much is it worth after ${n} years? (£, to the nearest penny; calculator)`, A.toFixed(2), { input: "decimal", accept: near(A, 2), label: `ci ${P},${r},${n}`, skill: "compound interest", explain: `£${P} × ${1 + r / 100}${sup(n)} = £${A.toFixed(2)}.` }); }
        if (k === 2) { const P = pick([8000, 12000, 15000, 20000]), r = pick([10, 15, 20, 25]), n = rand(3) + 2, A = P * (1 - r / 100) ** n;
          return typed(`A car costs £${P}. It loses ${r}% of its value each year. What is it worth after ${n} years? (£, to the nearest pound; calculator)`, Math.round(A), { accept: [String(Math.round(A) - 1), String(Math.round(A) + 1)], label: `dep ${P},${r},${n}`, skill: "depreciation", explain: `£${P} × ${1 - r / 100}${sup(n)} = £${A.toFixed(2)}, about £${Math.round(A)}.` }); }
        if (k === 3) { const p = pick([10, 20, 25, 40, 50]), up = rand(2), old = (rand(30) + 4) * 10, now = old * (up ? 100 + p : 100 - p) / 100;
          if (!Number.isInteger(now)) return { label: "skip" };
          return typed(`After a ${p}% ${up ? "increase" : "decrease"}, a price is £${now}. What was it before? (£)`, old, { label: `rev ${p},${up},${now}`, skill: "reverse percentages", explain: `£${now} is ${up ? 100 + p : 100 - p}% of the old price, so divide by ${(up ? 100 + p : 100 - p) / 100}: £${old}. (Not ${p}% of £${now}!)` }); }
        const c = pick([2, 3, 4, 5]), x0 = pick([1, 2, 3]), x1 = c + 1 / x0;
        return typed(`Use xₙ₊₁ = ${c} + 1/xₙ with x₀ = ${x0}. What is x₁? (higher; give it as a decimal, to 2 decimal places if needed)`, String(Math.round(x1 * 100) / 100), { input: "decimal", accept: [x1.toFixed(2)], label: `iter ${c},${x0}`, skill: "iteration", explain: `Put x₀ = ${x0} in: ${c} + 1/${x0} = ${Math.round(x1 * 100) / 100}.` });
      }) },
    { id: "k4-proportion", title: "Proportion and compound units (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Proportion to x² and 1/x², density and pressure, and fractions in ratio problems.",
      make: () => distinct(10, () => {
        const k = rand(5);
        if (k === 0) { const c = rand(4) + 1, a = rand(3) + 2, b = rand(4) + 3; if (a === b) return { label: "skip" };
          return typed(`y is directly proportional to x². When x = ${a}, y = ${c * a * a}. What is y when x = ${b}?`, c * b * b, { label: `x2 ${c},${a},${b}`, skill: "proportion to a square", explain: `y = kx²: ${c * a * a} = k × ${a * a}, so k = ${c}. Then y = ${c} × ${b * b} = ${c * b * b}.` }); }
        if (k === 1) { const a = pick([1, 2, 3]), b = pick([2, 4, 6]), y = pick([36, 72, 144]); const kk = y * a * a, ans = kk / (b * b); if (a === b || !Number.isInteger(ans)) return { label: "skip" };
          return typed(`y is inversely proportional to x². When x = ${a}, y = ${y}. What is y when x = ${b}? (higher)`, ans, { label: `inv2 ${a},${b},${y}`, skill: "inverse proportion to a square", explain: `y = k ÷ x²: k = ${y} × ${a * a} = ${kk}. Then y = ${kk} ÷ ${b * b} = ${ans}.` }); }
        if (k === 2) { const d = pick([2, 2.5, 7.8, 8, 11.3, 0.8, 1.2]), v = pick([10, 20, 25, 50, 100]), m = Math.round(d * v * 100) / 100, findM = rand(2);
          return findM ? typed(`A metal has a density of ${d} g/cm³. What is the mass of ${v} cm³ of it? (g)`, String(m), { input: "decimal", label: `mass ${d},${v}`, skill: "density", explain: `Mass = density × volume = ${d} × ${v} = ${m} g.` })
            : typed(`A ${v} cm³ block has a mass of ${m} g. What is its density? (g/cm³)`, String(d), { input: "decimal", label: `dens ${m},${v}`, skill: "density", explain: `Density = mass ÷ volume = ${m} ÷ ${v} = ${d} g/cm³.` }); }
        if (k === 3) { const A = pick([0.5, 2, 4, 5, 10]), F = A * (rand(20) + 5) * 10;
          return typed(`A force of ${F} N acts on an area of ${A} m². What is the pressure? (N/m²)`, F / A, { label: `pres ${F},${A}`, skill: "pressure", explain: `Pressure = force ÷ area = ${F} ÷ ${A} = ${F / A} N/m².` }); }
        const a = rand(6) + 1, b = rand(6) + 2; if (gcd(a, b) !== 1) return { label: "skip" };
        const ans = `${a}/${a + b}`;
        return choice(`Red and blue counters are in the ratio ${a} : ${b}. What fraction of the counters are red?`, ans, others2u(ans, [`${a}/${b}`, `${b}/${a + b}`, `${b}/${a}`]), { label: `frac ratio ${a}:${b}`, skill: "fractions in ratio problems", explain: `There are ${a} + ${b} = ${a + b} parts, and ${a} of them are red: ${ans}.` });
      }) },
    { id: "k4-similarity", title: "Similar shapes and enlargement (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Scale factors for lengths, areas and volumes, and fractional enlargements.",
      make: () => distinct(10, () => {
        const k = rand(4), s = pick([2, 3, 4, 5, 1.5, 2.5]);
        if (k === 0) { const a = pick([4, 6, 8, 10]), b = pick([3, 5, 7, 9]), big = a * s, ans = b * s;
          return typed(`Two triangles are similar. A side of ${a} cm in the small one matches a side of ${big} cm in the large one. Another side of the small one is ${b} cm. How long is the matching side? (cm)`, String(ans), { input: "decimal", label: `sim ${a},${b},${s}`, skill: "lengths in similar shapes", explain: `Scale factor = ${big} ÷ ${a} = ${s}. ${b} × ${s} = ${ans} cm.` }); }
        if (k === 1) { const n = pick([2, 3, 4, 5]), A = pick([5, 6, 8, 10, 12]);
          return typed(`A shape has an area of ${A} cm². It is enlarged by scale factor ${n}. What is the new area? (cm²)`, A * n * n, { label: `area sf ${A},${n}`, skill: "area scale factor", explain: `Areas grow by the scale factor squared: ${A} × ${n}² = ${A * n * n} cm².` }); }
        if (k === 2) { const n = pick([2, 3, 4]), V = pick([5, 8, 10, 12]);
          return typed(`Two cylinders are similar. The larger is ${n} times as tall. The smaller holds ${V} cm³. How much does the larger hold? (cm³) (higher)`, V * n ** 3, { label: `vol sf ${V},${n}`, skill: "volume scale factor", explain: `Volumes grow by the scale factor cubed: ${V} × ${n}³ = ${V * n ** 3} cm³.` }); }
        const a = rand(4) + 1, b = a + rand(4) + 1; if (gcd(a, b) !== 1) return { label: "skip" };
        const ans = `${a} : ${b}`;
        return choice(`Two similar shapes have areas in the ratio ${a * a} : ${b * b}. What is the ratio of their lengths? (higher)`, ans, others2u(ans, [`${a * a} : ${b * b}`, `${a ** 3} : ${b ** 3}`, `${a * 2} : ${b * 2 + 1}`]), { label: `ratio ${a}:${b}`, skill: "from area ratio to length ratio", explain: `Area ratio = length ratio squared, so square root both: √${a * a} : √${b * b} = ${ans}.` });
      }) },
    { id: "k4-vectors", title: "Vectors (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Add, subtract and multiply column vectors, and translate shapes by a vector. Vectors are shown across the page as (x, y).",
      make: () => distinct(10, () => {
        const k = rand(5), v = () => [rand(11) - 5 || 2, rand(11) - 5 || -3], a = v(), b = v(), V = ([x, y]) => `(${minus(x)}, ${minus(y)})`;
        const res = (p, q) => [p * a[0] + q * b[0], p * a[1] + q * b[1]];
        if (k < 3) { const [p, q] = [[1, 1], [1, -1], [2, 1], [3, -1], [2, -3]][k === 0 ? 0 : k === 1 ? 1 : 2 + rand(3)], r = res(p, q), ans = V(r);
          const name = expr([p, "a"], [q, "b"]);
          return choice(`a = ${V(a)} and b = ${V(b)}. Work out ${name}.`, ans, others2u(ans, [V(res(q, p)), V(res(p, -q)), V([r[1], r[0]])]), { label: `vec ${a},${b},${p},${q}`, skill: "column vectors", explain: `Do the top numbers and the bottom numbers separately: ${name} = (${minus(p * a[0])} ${signed(q * b[0])}, ${minus(p * a[1])} ${signed(q * b[1])}) = ${ans}.` }); }
        if (k === 3) { const [x, y, m] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [12, 5, 13]]), sx = rand(2) ? 1 : -1, sy = rand(2) ? 1 : -1;
          return typed(`What is the magnitude (length) of the vector (${minus(sx * x)}, ${minus(sy * y)})?`, m, { label: `mag ${x},${y}`, skill: "the length of a vector", explain: `Use Pythagoras: √(${x}² + ${y}²) = √${m * m} = ${m}.` }); }
        const P = v(), ans = V([P[0] + a[0], P[1] + a[1]]);
        return choice(`The point (${minus(P[0])}, ${minus(P[1])}) is translated by the vector ${V(a)}. Where does it end up?`, ans, others2u(ans, [V([P[0] - a[0], P[1] - a[1]]), V([P[0] + a[1], P[1] + a[0]]), V([P[0] + a[0], P[1] - a[1]])]), { label: `trans ${P},${a}`, skill: "translation by a vector", explain: `Move ${minus(a[0])} across and ${minus(a[1])} up: (${minus(P[0])} ${signed(a[0])}, ${minus(P[1])} ${signed(a[1])}) = ${ans}.` });
      }) },
    { id: "k4-sectors", title: "Arcs and sectors (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Arc lengths and sector areas, exactly in terms of π and rounded with a calculator.",
      make: () => distinct(10, () => {
        const k = rand(3), th = pick([30, 45, 60, 90, 120, 135, 150, 180, 240, 270]), r = pick([2, 3, 4, 6, 8, 9, 10, 12]);
        const arcK = th * 2 * r / 360, areaK = th * r * r / 360;
        if (k === 0) { if (!Number.isInteger(arcK)) return { label: "skip" }; const ans = piOf(arcK);
          return choice(`A sector has radius ${r} cm and angle ${th}°. What is its arc length? Give an exact answer.`, ans, others2u(ans, [piOf(areaK), piOf(arcK * 2), piOf(2 * r)].filter(x => x !== ans)), { label: `arc ${r},${th}`, skill: "arc length", explain: `Arc = ${th}/360 × 2π × ${r} = ${ans} cm.` }); }
        if (k === 1) { if (!Number.isInteger(areaK)) return { label: "skip" }; const ans = piOf(areaK);
          return choice(`A sector has radius ${r} cm and angle ${th}°. What is its area? Give an exact answer.`, ans, others2u(ans, [piOf(2 * r), piOf(areaK * 2), piOf(r * r)].filter(x => x !== ans)), { label: `sec ${r},${th}`, skill: "sector area", explain: `Area = ${th}/360 × π × ${r}² = ${ans} cm².` }); }
        const th2 = rand(140) + 20, r2 = rand(12) + 3, A = th2 / 360 * Math.PI * r2 * r2;
        return typed(`A sector has radius ${r2} cm and angle ${th2}°. What is its area, to 1 decimal place? (cm²; calculator)`, fixed(A), { input: "decimal", accept: near(A), label: `secc ${r2},${th2}`, skill: "sector area", explain: `${th2}/360 × π × ${r2}² = ${fixed(A, 3)}… ≈ ${fixed(A)} cm².` });
      }) },
    { id: "k4-circle-theorems", title: "Circle theorems (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Use the circle theorems to find missing angles, and name the theorem each time. (Higher)",
      make: () => distinct(10, () => {
        const k = rand(7), a = rand(50) + 20;
        const Q = [
          [`Points A, B and C are on a circle with centre O. Angle ACB = ${a}°. What is angle AOB?`, 2 * a, "The angle at the centre is twice the angle at the circumference."],
          [`AB is a diameter of a circle and C is on the circle. Angle CAB = ${a}°. What is angle CBA?`, 90 - a, "The angle in a semicircle is 90°, so 180 − 90 − " + a + "."],
          [`ABCD is a cyclic quadrilateral. Angle ABC = ${a + 50}°. What is angle ADC?`, 130 - a, "Opposite angles in a cyclic quadrilateral add to 180°."],
          [`A tangent touches a circle with centre O at T. A is a point on the tangent. Angle TOA = ${a}°. What is angle TAO?`, 90 - a, "A tangent meets a radius at 90°, so 180 − 90 − " + a + "."],
          [`A, B, C and D are on a circle. Angle ACB = ${a}°. D is on the same side of AB as C. What is angle ADB?`, a, "Angles in the same segment are equal."],
          [`Two tangents from P touch a circle with centre O at A and B. Angle APB = ${a * 2}°. What is angle AOB?`, 180 - a * 2, "Each tangent meets its radius at 90°, and the angles of OAPB add to 360°."],
          [`O is the centre of a circle, and A and B are on it. Angle AOB = ${a * 2}°. What is angle OAB?`, 90 - a, "OA and OB are both radii, so triangle OAB is isosceles: (180 − " + a * 2 + ") ÷ 2."]
        ][k];
        return typed(`${Q[0]} (°)`, Q[1], { label: `ct ${k},${a}`, skill: "circle theorems", explain: `${Q[2]} The answer is ${Q[1]}°.` });
      }) },
    { id: "k4-3d", title: "Volume and surface area: cones, spheres and pyramids (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Volumes and surface areas of cylinders, cones, spheres and pyramids, exactly in terms of π.",
      make: () => distinct(10, () => {
        const k = rand(6), r = rand(6) + 2, h = (rand(4) + 1) * 3;
        if (k === 0) { const ans = piOf(r * r * h); return choice(`A cylinder has radius ${r} cm and height ${h} cm. What is its volume, in terms of π? (cm³)`, ans, others2u(ans, [piOf(2 * r * h), piOf(r * r * h / 3), piOf(r * h)]), { label: `cyl ${r},${h}`, skill: "volume of a cylinder", explain: `V = πr²h = π × ${r * r} × ${h} = ${ans}.` }); }
        if (k === 1) { const ans = piOf(r * r * h / 3); return choice(`A cone has radius ${r} cm and height ${h} cm. What is its volume, in terms of π? (cm³)`, ans, others2u(ans, [piOf(r * r * h), piOf(r * h), piOf(2 * r * h / 3)]), { label: `cone ${r},${h}`, skill: "volume of a cone", explain: `V = ⅓πr²h = ⅓ × π × ${r * r} × ${h} = ${ans}.` }); }
        if (k === 2) { const R = pick([3, 6, 9]), ans = piOf(4 * R ** 3 / 3); return choice(`A sphere has radius ${R} cm. What is its volume, in terms of π? (cm³)`, ans, others2u(ans, [piOf(4 * R * R), piOf(R ** 3), piOf(4 * R ** 3)]), { label: `sph v ${R}`, skill: "volume of a sphere", explain: `V = ⁴⁄₃πr³ = ⁴⁄₃ × π × ${R ** 3} = ${ans}.` }); }
        if (k === 3) { const ans = piOf(4 * r * r); return choice(`A sphere has radius ${r} cm. What is its surface area, in terms of π? (cm²)`, ans, others2u(ans, [piOf(2 * r * r), piOf(r * r), piOf(4 * r)]), { label: `sph a ${r}`, skill: "surface area of a sphere", explain: `A = 4πr² = 4 × π × ${r * r} = ${ans}.` }); }
        if (k === 4) { const [rr, hh, l] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [9, 12, 15]]), ans = piOf(rr * l);
          return choice(`A cone has radius ${rr} cm and perpendicular height ${hh} cm. What is its curved surface area, in terms of π? (cm²) (Find the slant height first.)`, ans, others2u(ans, [piOf(rr * hh), piOf(rr * rr + rr * l), piOf(rr * l * 2)]), { label: `csa ${rr},${hh}`, skill: "surface area of a cone", explain: `Slant height l = √(${rr}² + ${hh}²) = ${l}. Curved area = πrl = π × ${rr} × ${l} = ${ans}.` }); }
        const s = pick([3, 4, 5, 6, 9]);
        return typed(`A pyramid has a square base of side ${s} cm and a height of ${h} cm. What is its volume? (cm³)`, s * s * h / 3, { label: `pyr ${s},${h}`, skill: "volume of a pyramid", explain: `V = ⅓ × base area × height = ⅓ × ${s * s} × ${h} = ${s * s * h / 3} cm³.` });
      }) },
    { id: "k4-trig", title: "Trigonometry and bearings (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Sine, cosine and tangent in right-angled triangles, exact values, and bearings.",
      make: () => distinct(10, () => {
        const k = rand(5);
        if (k === 0) { const EX = [["sin 30°", "1/2"], ["cos 60°", "1/2"], ["tan 45°", "1"], ["sin 90°", "1"], ["cos 0°", "1"], ["tan 0°", "0"], ["sin 0°", "0"], ["cos 90°", "0"], ["sin 60°", "√3/2"], ["cos 30°", "√3/2"], ["tan 60°", "√3"], ["sin 45°", "√2/2"], ["cos 45°", "√2/2"], ["tan 30°", "1/√3"]];
          const [q, ans] = pick(EX);
          return choice(`What is the exact value of ${q}?`, ans, others2u(ans, ["1/2", "√3/2", "√2/2", "1", "0", "√3", "1/√3"]), { label: `exact ${q}`, skill: "exact trig values", explain: `${q} = ${ans}. ${/30|60/.test(q) ? "Use half of an equilateral triangle with sides 2." : /45/.test(q) ? "Use a right-angled isosceles triangle with short sides 1." : "Think of the sine and cosine graphs."}` }); }
        const ang = rand(55) + 20, side = rand(15) + 5;
        if (k === 1) { const which = rand(2), v = which ? side * Math.sin(rad(ang)) : side * Math.cos(rad(ang));
          return typed(`A right-angled triangle has hypotenuse ${side} cm and an angle of ${ang}°. How long is the side ${which ? "opposite" : "next to (adjacent to)"} the ${ang}° angle? (cm, 1 d.p.; calculator)`, fixed(v), { input: "decimal", accept: near(v), label: `side ${side},${ang},${which}`, skill: "finding a side", explain: `${which ? "sin" : "cos"} ${ang}° = ${which ? "opposite" : "adjacent"} ÷ hypotenuse, so it's ${side} × ${which ? "sin" : "cos"} ${ang}° = ${fixed(v)} cm.` }); }
        if (k === 2) { const v = side * Math.tan(rad(ang));
          return typed(`In a right-angled triangle, the side next to a ${ang}° angle is ${side} cm. How long is the side opposite it? (cm, 1 d.p.; calculator)`, fixed(v), { input: "decimal", accept: near(v), label: `tan ${side},${ang}`, skill: "finding a side", explain: `tan ${ang}° = opposite ÷ adjacent, so it's ${side} × tan ${ang}° = ${fixed(v)} cm.` }); }
        if (k === 3) { const o = rand(9) + 3, a2 = rand(9) + 3, v = Math.atan(o / a2) * 180 / Math.PI;
          return typed(`A right-angled triangle has a side of ${o} cm opposite angle x and a side of ${a2} cm next to it. What is x? (degrees, 1 d.p.; calculator)`, fixed(v), { input: "decimal", accept: near(v), label: `ang ${o},${a2}`, skill: "finding an angle", explain: `tan x = ${o} ÷ ${a2}, so x = tan⁻¹(${o} ÷ ${a2}) = ${fixed(v)}°.` }); }
        const b = rand(340) + 10, back = (b + 180) % 360, three = n => String(n).padStart(3, "0");
        return typed(`The bearing of B from A is ${three(b)}°. What is the bearing of A from B? (°)`, three(back), { accept: [String(back)], label: `bearing ${b}`, skill: "back bearings", explain: `Turn round: ${b} ${b < 180 ? "+" : "−"} 180 = ${three(back)}°. Bearings have three figures.` });
      }) },
    { id: "k4-sine-cosine", title: "Sine rule, cosine rule and area of a triangle (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Find sides, angles and areas of any triangle with the sine rule, the cosine rule and ½ab sin C. (Higher, calculator)",
      make: () => distinct(10, () => {
        const k = rand(4), b = rand(10) + 5, c = rand(10) + 5, A = rand(100) + 25;
        if (k === 0) { const a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(rad(A)));
          return typed(`In triangle ABC, b = ${b} cm, c = ${c} cm and angle A = ${A}°. Find a. (cm, 1 d.p.)`, fixed(a), { input: "decimal", accept: near(a), label: `cos side ${b},${c},${A}`, skill: "the cosine rule for a side", explain: `a² = ${b}² + ${c}² − 2 × ${b} × ${c} × cos ${A}° = ${fixed(a * a, 2)}, so a = ${fixed(a)} cm.` }); }
        if (k === 1) { const B = rand(50) + 30; if (A + B > 160) return { label: "skip" }; const a = b * Math.sin(rad(A)) / Math.sin(rad(B));
          return typed(`In triangle ABC, angle A = ${A}°, angle B = ${B}° and b = ${b} cm. Find a. (cm, 1 d.p.)`, fixed(a), { input: "decimal", accept: near(a), label: `sin side ${A},${B},${b}`, skill: "the sine rule for a side", explain: `a/sin A = b/sin B, so a = ${b} × sin ${A}° ÷ sin ${B}° = ${fixed(a)} cm.` }); }
        if (k === 2) { const area = 0.5 * b * c * Math.sin(rad(A));
          return typed(`Two sides of a triangle are ${b} cm and ${c} cm, and the angle between them is ${A}°. What is its area? (cm², 1 d.p.)`, fixed(area), { input: "decimal", accept: near(area), label: `area ${b},${c},${A}`, skill: "area = ½ab sin C", explain: `Area = ½ × ${b} × ${c} × sin ${A}° = ${fixed(area)} cm².` }); }
        const a = rand(8) + Math.abs(b - c) + 2; if (a >= b + c) return { label: "skip" };
        const ang = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI;
        return typed(`A triangle has sides a = ${a} cm, b = ${b} cm and c = ${c} cm. Find angle A. (degrees, 1 d.p.)`, fixed(ang), { input: "decimal", accept: near(ang), label: `cos ang ${a},${b},${c}`, skill: "the cosine rule for an angle", explain: `cos A = (${b}² + ${c}² − ${a}²) ÷ (2 × ${b} × ${c}) = ${fixed((b * b + c * c - a * a) / (2 * b * c), 3)}, so A = ${fixed(ang)}°.` });
      }) },
    { id: "k4-probability", title: "Probability: missing values and expected results (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Probabilities that add to 1, expected frequency, relative frequency and spotting bias.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const parts = [rand(4) + 1, rand(4) + 1, rand(3) + 1].map(x => x * 5), rest = 100 - parts.reduce((s, x) => s + x, 0), names = ["red", "blue", "green"];
          if (rest <= 0) return { label: "skip" };
          const ans = String(rest / 100);
          return typed(`A spinner can land on red, blue, green or yellow. P(red) = ${parts[0] / 100}, P(blue) = ${parts[1] / 100} and P(green) = ${parts[2] / 100}. What is P(yellow)?`, ans, { input: "decimal", accept: decAccept(rest / 100), label: `missing ${parts}`, skill: "probabilities add to 1", explain: `The four probabilities add to 1: 1 − ${parts.map(p => p / 100).join(" − ")} = ${ans}. (${names.length + 1} outcomes, one of them must happen.)` }); }
        if (k === 1) { const p = pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.45, 0.6]), n = pick([20, 40, 60, 80, 100, 200, 300, 500]), e = Math.round(p * n * 100) / 100;
          if (!Number.isInteger(e)) return { label: "skip" };
          return typed(`The probability that a seed grows is ${p}. ${n} seeds are planted. How many would you expect to grow?`, e, { label: `exp ${p},${n}`, skill: "expected frequency", explain: `Expected number = probability × number of tries = ${p} × ${n} = ${e}.` }); }
        if (k === 2) { const n = pick([20, 40, 50, 80, 100, 200]), hits = rand(n / 2) + 1, rf = hits / n;
          if (String(rf).length > 6) return { label: "skip" };
          return typed(`A drawing pin is dropped ${n} times and lands point up ${hits} times. What is the relative frequency of point up? (as a decimal)`, String(rf), { input: "decimal", accept: decAccept(rf), label: `rf ${n},${hits}`, skill: "relative frequency", explain: `Relative frequency = ${hits} ÷ ${n} = ${rf}. More drops give a better estimate.` }); }
        const n = pick([60, 120, 300, 600]), sixes = Math.round(n / 6 * pick([1, 1, 2, 2.5])), biased = sixes > n / 6 * 1.5, ans = biased ? "It is probably biased" : "It could well be fair";
        return choice(`A dice is rolled ${n} times and lands on 6 ${sixes} times. What can you say?`, ans, [biased ? "It could well be fair" : "It is probably biased", "It is certainly fair"],
          { label: `bias ${n},${sixes}`, skill: "fairness and bias", explain: `A fair dice would give about ${n / 6} sixes. ${sixes} is ${biased ? "far more than that, over many rolls" : "about what you'd expect"}.` });
      }) },
    { id: "k4-combined", title: "Combined events and tree diagrams (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "AND and OR rules, with and without replacement, counting outcomes and conditional probability.",
      make: () => distinct(10, () => {
        const k = rand(6);
        if (k === 0) { const a = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]), b = pick([0.1, 0.2, 0.3, 0.5, 0.6, 0.9]), p = Math.round(a * b * 100) / 100;
          return typed(`P(Ali is late) = ${a} and P(Bea is late) = ${b}, independently. What is the probability that both are late?`, String(p), { input: "decimal", accept: decAccept(p), label: `and ${a},${b}`, skill: "the AND rule", explain: `Independent events: multiply. ${a} × ${b} = ${p}.` }); }
        if (k === 1) { const a = pick([0.2, 0.3, 0.4, 0.5, 0.6]), b = pick([0.1, 0.2, 0.3, 0.5]), p = Math.round((1 - (1 - a) * (1 - b)) * 100) / 100;
          return typed(`P(rain on Saturday) = ${a} and P(rain on Sunday) = ${b}, independently. What is the probability it rains on at least one day?`, String(p), { input: "decimal", accept: decAccept(p), label: `atleast ${a},${b}`, skill: "at least one", explain: `1 − P(neither) = 1 − ${Math.round((1 - a) * 100) / 100} × ${Math.round((1 - b) * 100) / 100} = ${p}.` }); }
        if (k === 2) { const r = rand(5) + 2, g = rand(5) + 2, t = r + g, ans = fracW(r * r, t * t);
          return choice(`A bag has ${r} red and ${g} green beads. One is taken, put back, and another is taken. What is P(both red)?`, ans, others2u(ans, [fracW(r * (r - 1), t * (t - 1)), fracW(2 * r, t), fracW(r * r, t * (t - 1))]), { label: `with ${r},${g}`, skill: "with replacement", explain: `${r}/${t} × ${r}/${t} = ${r * r}/${t * t}${ans !== `${r * r}/${t * t}` ? ` = ${ans}` : ""}.` }); }
        if (k === 3) { const r = rand(5) + 3, g = rand(5) + 2, t = r + g, ans = fracW(r * (r - 1), t * (t - 1));
          return choice(`A bag has ${r} red and ${g} green beads. Two are taken without putting the first back. What is P(both red)?`, ans, others2u(ans, [fracW(r * r, t * t), fracW(r * (r - 1), t * t), fracW(r - 1, t - 1)]), { label: `without ${r},${g}`, skill: "without replacement", explain: `After a red is taken, ${r - 1} reds are left out of ${t - 1}: ${r}/${t} × ${r - 1}/${t - 1} = ${r * (r - 1)}/${t * (t - 1)}${ans !== `${r * (r - 1)}/${t * (t - 1)}` ? ` = ${ans}` : ""}.` }); }
        if (k === 4) { const a = rand(4) + 2, b = rand(5) + 3, c = rand(3) + 2;
          return typed(`A café has ${a} starters, ${b} mains and ${c} puddings. How many different three-course meals can you choose?`, a * b * c, { label: `count ${a},${b},${c}`, skill: "the product rule for counting", explain: `Multiply the choices: ${a} × ${b} × ${c} = ${a * b * c}.` }); }
        const both = rand(6) + 2, onlyF = rand(8) + 2, ans = fracW(both, both + onlyF);
        return choice(`In a class, ${both + onlyF} pupils play football, and ${both} of them also play tennis. A football player is picked at random. What is the probability they play tennis? (higher)`, ans, others2u(ans, [fracW(onlyF, both + onlyF), fracW(both, 30), fracW(both, onlyF)]), { label: `cond ${both},${onlyF}`, skill: "conditional probability", explain: `Only look at the ${both + onlyF} football players: ${both} of them play tennis, ${both}/${both + onlyF}${ans !== `${both}/${both + onlyF}` ? ` = ${ans}` : ""}.` });
      }) },
    { id: "k4-statistics", title: "Grouped data, quartiles, samples and correlation (Years 10 and 11)", level: "Fourth", organiser: GCSE, check: false,
      blurb: "Estimate the mean from grouped data, find classes, frequency density and quartiles, sample fairly and describe correlation.",
      make: () => distinct(10, () => {
        const k = rand(6);
        if (k < 3) { const w = pick([5, 10, 20]), f = [rand(8) + 1, rand(12) + 3, rand(12) + 3, rand(8) + 1], n = f.reduce((s, x) => s + x, 0);
          const cls = i => `${i * w} < t ≤ ${(i + 1) * w}`;
          const table = `<table class="q-table"><tr><th>Time, t (minutes)</th><th>Frequency</th></tr>${f.map((x, i) => `<tr><td>${cls(i)}</td><td>${x}</td></tr>`).join("")}</table>`;
          if (k === 0) { const mean = f.reduce((s, x, i) => s + x * (i + 0.5) * w, 0) / n;
            return typed(`Estimate the mean time, to 1 decimal place. (minutes)`, fixed(mean), { input: "decimal", accept: near(mean), html: table, label: `gmean ${w},${f}`, skill: "estimating the mean from grouped data", explain: `Use the middle of each class: (${f.map((x, i) => `${x} × ${(i + 0.5) * w}`).join(" + ")}) ÷ ${n} = ${fixed(mean)}.` }); }
          if (k === 1) { const top = Math.max(...f); if (f.filter(x => x === top).length > 1) return { label: "skip" }; const ans = cls(f.indexOf(top));
            return choice(`Which is the modal class?`, ans, others2u(ans, [0, 1, 2, 3].map(cls)), { html: table, label: `modal ${w},${f}`, skill: "the modal class", explain: `The modal class has the highest frequency, ${top}.` }); }
          const mid = (n + 1) / 2; let run = 0, at = 0; for (; at < 4; at++) { run += f[at]; if (run >= mid) break; }
          const ans = cls(at);
          return choice(`${n} people were timed. Which class contains the median?`, ans, others2u(ans, [0, 1, 2, 3].map(cls)), { html: table, label: `medc ${w},${f}`, skill: "the class containing the median", explain: `The median is value number ${mid} of ${n}${mid % 1 ? " (halfway between the middle two)" : ""}. Counting up the frequencies, it falls in ${ans}.` }); }
        if (k === 3) { const w = pick([5, 10, 20, 25]), f = Math.round(w * pick([0.4, 0.6, 0.8, 1.2, 2, 3])); const fd = Math.round(f / w * 100) / 100;
          return typed(`A class of width ${w} has a frequency of ${f}. What is its frequency density? (higher)`, String(fd), { input: "decimal", accept: decAccept(fd), label: `fd ${w},${f}`, skill: "frequency density", explain: `Frequency density = frequency ÷ class width = ${f} ÷ ${w} = ${fd}.` }); }
        if (k === 4) { const data = Array.from({ length: 11 }, () => rand(40) + 1).sort((a, b) => a - b), iqr = data[8] - data[2];
          return typed(`Here are 11 values in order: ${data.join(", ")}. What is the interquartile range?`, iqr, { label: `iqr ${data}`, skill: "the interquartile range", explain: `The lower quartile is the 3rd value (${data[2]}) and the upper quartile is the 9th (${data[8]}): ${data[8]} − ${data[2]} = ${iqr}.` }); }
        if (rand(2)) { const total = pick([600, 800, 1000, 1200]), part = Math.round(total * pick([0.2, 0.25, 0.3, 0.4, 0.45])), s = pick([40, 50, 60, 80, 100]), ans = part / total * s;
          if (!Number.isInteger(ans)) return { label: "skip" };
          return typed(`A school has ${total} pupils, ${part} of them in Year 10. A stratified sample of ${s} pupils is taken. How many should be in Year 10?`, ans, { label: `strat ${total},${part},${s}`, skill: "stratified sampling", explain: `Year 10 is ${part}/${total} of the school, so ${part}/${total} × ${s} = ${ans}.` }); }
        const [say, ans] = pick([["As the temperature goes up, more ice creams are sold.", "Positive correlation"], ["The older a car is, the less it is worth.", "Negative correlation"], ["Shoe size and score in a spelling test.", "No correlation"], ["The more hours of practice, the faster the swim time (in seconds).", "Negative correlation"], ["Height and arm span.", "Positive correlation"], ["House number and age of the person living there.", "No correlation"]]);
        return choice(`What kind of correlation would you expect? ${say}`, ans, others2u(ans, ["Positive correlation", "Negative correlation", "No correlation"]), { label: `corr ${say}`, skill: "describing correlation", explain: `${ans}. Remember that correlation doesn't prove one thing causes the other.` });
      }) }
  ];

  /* ---------- GCSE maths exam climb (England), stage 1: Foundation, grade 1 to 3 ---------- */
  // A pupil at GCSE grade 1 who needs a 3 (for college, or a post-16 resit) climbs the Foundation topics
  // in "grade 3 first" order: the number, fractions, percentages, ratio and basic algebra that most
  // Foundation marks rest on come first. Every question is exam-shaped: it says how many marks it is
  // worth, and its answer is set out like a mark scheme (which line earns which mark), so a pupil learns
  // that working earns marks even when the last step slips. The same bank makes the online practice and
  // the A4 sheets (paper-sheets.js asks for it with PopActivities.examBank). Questions are PopSpell's own,
  // not past papers. Later stages (grades 4 and 5, then Higher) add their own topics to EXAM_STAGES.
  const GF = "Mathematics · GCSE maths exam climb";
  const gfR = (lo, hi) => lo + rand(hi - lo + 1);
  const gfM = n => (n < 0 ? `−${-n}` : `${n}`);
  const gfBig = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  // A tidy decimal: 7.6, not 7.6000000001
  const gfD = x => String(Math.round(x * 1000) / 1000).replace("-", "−");
  // Money: whole pounds as 204, pence as 4.50
  const gfP = x => { const r = Math.round(x * 100) / 100; return Number.isInteger(r) ? String(r) : r.toFixed(2); };
  const gfF = (n, d) => fracW(n, d);
  // The other ways a pupil might write a right answer: with its unit, a pound sign, 7.60 for 7.6, 7,000 for 7000
  const gfAlso = (answer, unit = "") => {
    const a = String(answer), base = new Set([a]);
    if (/^−?\d+\.\d*0$/.test(a)) base.add(String(Number(a.replace("−", "-"))).replace("-", "−"));
    if (/^−?\d+\.\d$/.test(a)) base.add(`${a}0`);
    if (/^\d+$/.test(a) && a.length > 3) { base.add(gfBig(a)); base.add(a.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); }
    if (unit === "£") { if (/^\d+$/.test(a)) base.add(`${a}.00`); [...base].forEach(b => base.add(`£${b}`)); }
    else if (unit) [...base].forEach(b => { base.add(`${b}${unit}`); base.add(`${b} ${unit}`); });
    if (/^\d+:\d+$/.test(a)) { base.add(a.replace(":", " : ")); }
    base.delete(a);
    return [...base];
  };
  // One exam question: q, the answer, its marks, and the mark scheme
  //   o: unit, accept, options (a choice), calc (calculator allowed), pic (an SVG), ps (a multi-step problem),
  //      label (short, for results), skill (what a miss means needs practice)
  const gfQ = (q, answer, marks, scheme, o = {}) => Object.assign({ q, answer: String(answer), marks, scheme, calc: false, unit: "" }, o);
  const gfMk = n => `${n} mark${n > 1 ? "s" : ""}`;
  // A straight-line graph on a squared grid, x from 0 to 6
  const gfGraph = (m, c) => {
    const top = Math.ceil((6 * m + c) / 2) * 2, sy = 150 / top, X = x => 30 + x * 25, Y = y => +(165 - y * sy).toFixed(1);
    let g = "";
    for (let x = 0; x <= 6; x++) g += `<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(top)}" stroke="#cbd5e1"/><text x="${X(x)}" y="${Y(0) + 14}" font-size="11" text-anchor="middle" fill="#334155">${x}</text>`;
    for (let y = 0; y <= top; y += 2) g += `<line x1="${X(0)}" y1="${Y(y)}" x2="${X(6)}" y2="${Y(y)}" stroke="#cbd5e1"/><text x="${X(0) - 5}" y="${Y(y) + 4}" font-size="11" text-anchor="end" fill="#334155">${y}</text>`;
    g += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(6) + 8}" y2="${Y(0)}" stroke="#334155" stroke-width="1.5"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(top) - 8}" stroke="#334155" stroke-width="1.5"/>`;
    g += `<text x="${X(6) + 12}" y="${Y(0) + 4}" font-size="12" fill="#334155">x</text><text x="${X(0) + 4}" y="${Y(top) - 10}" font-size="12" fill="#334155">y</text>`;
    g += `<line x1="${X(0)}" y1="${Y(c)}" x2="${X(6)}" y2="${Y(6 * m + c)}" stroke="#2563A6" stroke-width="3"/>`;
    return `<svg class="q-pic" viewBox="0 0 210 190" width="210" height="190" role="img" aria-label="A straight line on a grid">${g}</svg>`;
  };
  // An L-shape: a W by H rectangle with a w by h corner cut from its top right
  const gfL = (W, H, w, h) => {
    const s = +(150 / Math.max(W, H)).toFixed(2), x0 = 30, y0 = 15, P = (x, y) => `${+(x0 + x * s).toFixed(1)},${+(y0 + y * s).toFixed(1)}`;
    const pts = [P(0, 0), P(W - w, 0), P(W - w, h), P(W, h), P(W, H), P(0, H)].join(" ");
    const t = (x, y, txt, a = "middle") => `<text x="${x}" y="${y}" font-size="12" text-anchor="${a}" fill="#0f172a">${txt}</text>`;
    return `<svg class="q-pic" viewBox="0 0 ${W * s + 80} ${H * s + 40}" width="${W * s + 80}" height="${H * s + 40}" role="img" aria-label="An L-shape">
      <polygon points="${pts}" fill="#e0ecfa" stroke="#2563A6" stroke-width="2.5"/>
      ${t(x0 + W * s / 2, y0 + H * s + 16, `${W} cm`)}${t(x0 - 4, y0 + H * s / 2, `${H} cm`, "end")}
      ${t(x0 + (W - w) * s / 2, y0 - 3, `${W - w} cm`)}${t(x0 + W * s + 4, y0 + (h + H) * s / 2, `${H - h} cm`, "start")}</svg>`.replace(/(\d\.\d)\d+/g, "$1");
  };

  const GF_TOPICS = [
    { id: "gf-number", n: 1, short: "Number", title: "Place value, negatives and rounding", strand: "Number",
      blurb: "Digit values, ordering decimals, negative numbers, rounding and estimating.", makers: [
      () => { const ds = shuffle(range(1, 9)).slice(0, 5), n = Number(ds.join("")), p = gfR(1, 4), d = ds[4 - p], v = d * 10 ** p;
        return gfQ(`What is the value of the ${d} in ${gfBig(n)}?`, v, 1, `${d} is in the ${["ones", "tens", "hundreds", "thousands", "ten thousands"][p]} column, so it is worth ${gfBig(v)} (1 mark).`, { label: `${d} in ${n}`, skill: "place value" }); },
      () => { const d = gfR(3, 8), e = gfR(3, 9), f = gfR(0, e - 1), g = gfR(1, 9), A = `0.${d}`, B = `0.${d - 1}${e}`, C = `0.${d - 1}${f}${g}`, big = rand(2);
        return gfQ(`Which of these is the ${big ? "largest" : "smallest"}: ${shuffle([A, B, C]).join(", ")}?`, big ? A : C, 1, `Compare tenths first, then hundredths: ${C} < ${B} < ${A}. More digits does not mean bigger (1 mark).`, { options: big ? [B, C] : [A, B], label: `${big ? "largest" : "smallest"} ${A}`, skill: "ordering decimals" }); },
      () => { const lo = -gfR(2, 12), up = gfR(5, 20);
        return gfQ(`At 6 am the temperature was ${gfM(lo)}°C. By noon it had gone up by ${up} degrees. What was the temperature at noon? (°C)`, gfM(lo + up), 1, `Count on ${up} from ${gfM(lo)}: ${-lo} gets you to 0, then ${up + lo} more (1 mark).`, { unit: "°C", label: `${lo} up ${up}`, skill: "negative numbers" }); },
      () => { const a = -gfR(3, 15), b = gfR(2, 14);
        return gfQ(`One night it was ${gfM(a)}°C in Oslo and ${b}°C in Leeds. What is the difference between the two temperatures? (degrees)`, b - a, 1, `From ${gfM(a)} up to 0 is ${-a}, and 0 to ${b} is ${b}: ${-a} + ${b} = ${b - a} (1 mark).`, { label: `diff ${a},${b}`, skill: "negative numbers" }); },
      () => { const k = rand(3);
        if (k === 0) { let n; do n = gfR(1000, 99999); while (n % 100 === 50); const r = Math.round(n / 100) * 100;
          return gfQ(`Round ${gfBig(n)} to the nearest hundred.`, r, 1, `Look at the tens digit: ${Math.floor(n / 10) % 10} ${Math.floor(n / 10) % 10 >= 5 ? "rounds up" : "rounds down"}, giving ${gfBig(r)} (1 mark).`, { label: `round ${n} 100`, skill: "rounding" }); }
        if (k === 1) { let t; do t = gfR(1001, 99999); while (t % 100 === 50 || t % 10 === 0); const r = (Math.round(t / 100) / 10).toFixed(1);
          return gfQ(`Round ${gfD(t / 1000)} to 1 decimal place.`, r, 1, `Look at the second decimal place: ${Math.floor(t / 10) % 10} ${Math.floor(t / 10) % 10 >= 5 ? "rounds up" : "rounds down"}, giving ${r} (1 mark).`, { label: `round ${t} 1dp`, skill: "rounding" }); }
        let n; do n = gfR(110, 9900); while (String(n)[1] === "5"); const p = 10 ** (String(n).length - 1), r = Math.round(n / p) * p;
        return gfQ(`Round ${gfBig(n)} to 1 significant figure.`, r, 1, `The first significant figure is the ${String(n)[0]} (worth ${gfBig(Number(String(n)[0]) * p)}). The next digit is ${String(n)[1]}, so ${gfBig(r)} (1 mark).`, { label: `round ${n} 1sf`, skill: "significant figures" }); },
      () => { let a, b; do { a = gfR(21, 89) + gfR(1, 9) / 10; b = gfR(2, 8) + gfR(1, 9) / 10; } while (Math.floor(a) % 10 === 5 || Math.round(b * 10) % 10 === 5);
        const ra = Math.round(a / 10) * 10, rb = Math.round(b);
        return gfQ(`Estimate the value of ${a.toFixed(1)} × ${b.toFixed(1)} by rounding each number to 1 significant figure.`, ra * rb, 2, `Round both numbers: ${a.toFixed(1)} ≈ ${ra} and ${b.toFixed(1)} ≈ ${rb} (1 mark). ${ra} × ${rb} = ${ra * rb} (1 mark). Working out the exact answer gets no marks: the question asks for an estimate.`, { label: `est ${a}x${b}`, skill: "estimating" }); },
      () => { const pos = shuffle(range(1, 9)).slice(0, 2), neg = shuffle(range(2, 12)).slice(0, 2).map(x => -x), all = shuffle(pos.concat(neg, [0]));
        const up = all.slice().sort((x, y) => x - y), byAbs = all.slice().sort((x, y) => Math.abs(x) - Math.abs(y) || x - y), show = l => l.map(gfM).join(", ");
        const others = [...new Set([show(byAbs), show(up.slice().reverse())])].filter(s => s !== show(up));
        return gfQ(`Which list puts ${show(all)} in order, smallest first?`, show(up), 1, `Negative numbers are smaller than 0, and the bigger the number after the minus sign, the smaller it is: ${show(up)} (1 mark).`, { options: others, label: `order ${show(all)}`, skill: "ordering negative numbers" }); },
      () => { const h = gfR(2, 6), wage = pick([9.5, 10.5, 11.25, 12.4, 10.8]), days = gfR(3, 5), pay = wage * h * days, ticket = gfR(3, 9) * days, left = pay - ticket;
        return gfQ(`Mo earns £${wage.toFixed(2)} an hour. He works ${h} hours a day for ${days} days. His bus fare is £${ticket / days} a day. How much does he have left after paying his fares? (£)`, gfP(left), 3, `Pay for one day: ${h} × £${wage.toFixed(2)} = £${gfP(wage * h)} (1 mark). For ${days} days: £${gfP(pay)}, fares £${ticket} (1 mark). £${gfP(pay)} − £${ticket} = £${gfP(left)} (1 mark).`, { unit: "£", calc: true, ps: true, label: `wage ${wage} ${h} ${days}`, skill: "multi-step money problems" }); }
    ] },
    { id: "gf-calc", n: 2, short: "Calculating", title: "Calculating without a calculator", strand: "Number",
      blurb: "Long multiplication, short division, decimals, the order of operations and problems with remainders.", makers: [
      () => { const a = gfR(124, 489), b = gfR(23, 68), t = Math.floor(b / 10) * 10, u = b % 10;
        return gfQ(`Work out ${a} × ${b}.`, a * b, 3, `A full written method, such as a grid or long multiplication (1 mark). The parts right: ${a} × ${t} = ${gfBig(a * t)} and ${a} × ${u} = ${gfBig(a * u)} (1 mark). ${gfBig(a * t)} + ${gfBig(a * u)} = ${gfBig(a * b)} (1 mark).`, { label: `${a}x${b}`, skill: "long multiplication" }); },
      () => { const d = gfR(3, 9), q = gfR(124, 986);
        return gfQ(`Work out ${gfBig(d * q)} ÷ ${d}.`, q, 2, `Short division, carrying remainders (1 mark): ${q} (1 mark). Check: ${q} × ${d} = ${gfBig(d * q)}.`, { label: `${d * q}/${d}`, skill: "short division" }); },
      () => { const a = gfR(6, 20), b = gfR(101, a * 100 - 101), sub = rand(2);
        if (sub) return gfQ(`Work out ${a} − ${gfD(b / 100)}.`, gfD((a * 100 - b) / 100), 1, `Line up the decimal points and write ${a} as ${a}.00: ${a}.00 − ${gfD(b / 100)} = ${gfD((a * 100 - b) / 100)} (1 mark).`, { label: `${a}-${b}`, skill: "subtracting decimals" });
        const c = gfR(11, 99);
        return gfQ(`Work out ${gfD(b / 100)} + ${gfD(c / 10)}.`, gfD(b / 100 + c / 10), 1, `Line up the decimal points: ${gfD(b / 100)} + ${gfD(c / 10)} = ${gfD(b / 100 + c / 10)} (1 mark).`, { label: `${b}+${c}`, skill: "adding decimals" }); },
      () => { const a = gfR(2, 9), b = gfR(2, 9), k = rand(2);
        if (k) return gfQ(`Work out 0.${a} × 0.${b}.`, gfD(a * b / 100), 2, `${a} × ${b} = ${a * b} (1 mark). There are two decimal places in the question, so two in the answer: ${gfD(a * b / 100)} (1 mark).`, { label: `0.${a}x0.${b}`, skill: "multiplying decimals" });
        const c = gfR(11, 49);
        return gfQ(`Work out ${gfD(c / 10)} × ${a}.`, gfD(c * a / 10), 1, `${c} × ${a} = ${c * a}, and one decimal place: ${gfD(c * a / 10)} (1 mark).`, { label: `${c}x${a}`, skill: "multiplying decimals" }); },
      () => { const a = gfR(2, 12), b = gfR(2, 9), c = gfR(2, 6), k = rand(4);
        const [q, v] = [[`${a} + ${b} × ${c}`, a + b * c], [`(${a} + ${b}) × ${c}`, (a + b) * c], [`${a} + ${b}²`, a + b * b], [`${a * c} ÷ ${c} − ${b}`, a - b]][k];
        return gfQ(`Work out ${q}.`, gfM(v), 1, `Brackets, then powers, then × and ÷, then + and −: ${q} = ${gfM(v)} (1 mark).`, { label: q, skill: "order of operations" }); },
      () => { const seats = pick([12, 15, 16, 25, 30, 40, 52]), people = seats * gfR(2, 6) + gfR(1, seats - 1), what = pick(["minibuses", "coaches"]), need = Math.ceil(people / seats);
        return gfQ(`Each of the ${what} holds ${seats} people. ${people} people need to travel. How many ${what} are needed?`, need, 2, `${people} ÷ ${seats} = ${Math.floor(people / seats)} remainder ${people % seats} (1 mark). The ${people % seats} left over still need a seat, so ${need} (1 mark). Answering ${Math.floor(people / seats)} loses the second mark.`, { ps: true, label: `${people}/${seats}`, skill: "remainders in context" }); },
      () => { const a = gfR(150, 450), b = gfR(220, 520), c = gfR(80, 400), n = gfR(2, 4), spent = a * n + b + c, note = Math.ceil(spent / 1000) * 1000 + (spent % 1000 > 800 ? 1000 : 0);
        return gfQ(`Kim buys ${n} coffees at £${gfP(a / 100)} each, a sandwich at £${gfP(b / 100)} and a cake at £${gfP(c / 100)}. She pays with a £${note / 100} note. How much change should she get? (£)`, gfP((note - spent) / 100), 3, `Coffees: ${n} × £${gfP(a / 100)} = £${gfP(a * n / 100)} (1 mark). Total £${gfP(spent / 100)} (1 mark). Change £${note / 100} − £${gfP(spent / 100)} = £${gfP((note - spent) / 100)} (1 mark).`, { unit: "£", ps: true, label: `change ${a},${b},${c}`, skill: "money problems" }); },
      () => { const x = gfR(11, 99), p = pick([10, 100, 1000]), mul = rand(2);
        return mul ? gfQ(`Work out ${gfD(x / 10)} × ${p}.`, gfD(x / 10 * p), 1, `Each digit moves ${String(p).length - 1} place${p > 10 ? "s" : ""} to the left: ${gfD(x / 10 * p)} (1 mark).`, { label: `${x}x${p}`, skill: "× and ÷ by 10, 100, 1000" })
          : gfQ(`Work out ${x} ÷ ${p}.`, gfD(x / p), 1, `Each digit moves ${String(p).length - 1} place${p > 10 ? "s" : ""} to the right: ${gfD(x / p)} (1 mark).`, { label: `${x}/${p}`, skill: "× and ÷ by 10, 100, 1000" }); }
    ] },
    { id: "gf-factors", n: 3, short: "Factors and powers", title: "Factors, multiples, primes and powers", strand: "Number",
      blurb: "Primes, factors, HCF and LCM, prime factors, squares, cubes and roots.", makers: [
      () => { const p = pick([23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]), o = shuffle([21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93]).slice(0, 2);
        return gfQ(`Which of these is a prime number: ${shuffle([p, ...o]).join(", ")}?`, p, 1, `${p} has only two factors, 1 and itself. ${o.map(x => `${x} = ${[3, 7, 13, 17].find(f => x % f === 0)} × ${x / [3, 7, 13, 17].find(f => x % f === 0)}`).join(" and ")} (1 mark).`, { options: o, label: `prime ${p}`, skill: "prime numbers" }); },
      () => { const n = pick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48]), fs = range(1, n).filter(f => n % f === 0);
        return gfQ(`How many factors does ${n} have?`, fs.length, 1, `Find them in pairs: ${fs.filter(f => f * f <= n).map(f => `${f} × ${n / f}`).join(", ")}. That is ${fs.length} factors: ${fs.join(", ")} (1 mark).`, { label: `factors ${n}`, skill: "factors" }); },
      () => { let g, p, q; do { g = gfR(2, 9); p = gfR(2, 9); q = gfR(2, 9); } while (p === q || gcd(p, q) !== 1);
        return gfQ(`Find the highest common factor (HCF) of ${g * p} and ${g * q}.`, g, 2, `List the factors of both, or use prime factors (1 mark). The biggest number that divides both is ${g} (1 mark).`, { label: `hcf ${g * p},${g * q}`, skill: "highest common factor" }); },
      () => { const [a, b] = pick([[6, 8], [12, 18], [4, 10], [15, 20], [9, 12], [8, 12], [10, 25], [6, 9], [12, 20], [15, 25]]), l = a * b / gcd(a, b);
        return gfQ(`A bus leaves every ${a} minutes and a train every ${b} minutes. Both leave at 9 am. After how many minutes do they next leave at the same time?`, l, 2, `List multiples: ${a}: ${range(1, l / a).map(k => k * a).join(", ")}; ${b}: ${range(1, l / b).map(k => k * b).join(", ")} (1 mark). The lowest common multiple is ${l} (1 mark).`, { label: `lcm ${a},${b}`, skill: "lowest common multiple" }); },
      () => { const k = rand(3), a = gfR(2, 9), r = gfR(4, 12), c = gfR(2, 5);
        if (k === 0) return gfQ(`Work out ${a}³.`, a ** 3, 1, `${a} × ${a} × ${a} = ${a ** 3}, not ${a} × 3 (1 mark).`, { label: `${a}^3`, skill: "cubes" });
        if (k === 1) return gfQ(`Work out √${r * r} + ${c}³.`, r + c ** 3, 1, `√${r * r} = ${r} and ${c}³ = ${c ** 3}, so ${r + c ** 3} (1 mark).`, { label: `r${r * r}+${c}^3`, skill: "squares, cubes and roots" });
        return gfQ(`Work out ${r}² − √${a * a}.`, r * r - a, 1, `${r}² = ${r * r} and √${a * a} = ${a}, so ${r * r - a} (1 mark).`, { label: `${r}^2-r${a * a}`, skill: "squares, cubes and roots" }); },
      () => { const e = [gfR(1, 4), gfR(0, 2), gfR(0, 1), rand(4) ? 0 : 1], ps = [2, 3, 5, 7]; if (e[1] + e[2] + e[3] === 0) e[1] = 1;
        const n = ps.reduce((t, p, i) => t * p ** e[i], 1), fmt = ex => ps.map((p, i) => (ex[i] ? (ex[i] > 1 ? `${p}${sup(ex[i])}` : `${p}`) : "")).filter(Boolean).join(" × ");
        const ans = fmt(e), wrong = [fmt([e[0] + 1, ...e.slice(1)]), `2 × ${n / 2}`, fmt([e[0], e[1] + 1, e[2], e[3]])].filter(w => w !== ans);
        return gfQ(`Write ${n} as a product of its prime factors.`, ans, 2, `Split into factors until every one is prime, using a factor tree (1 mark): ${n} = ${ans} (1 mark).`, { options: wrong.slice(0, 2), label: `pf ${n}`, skill: "prime factors" }); },
      () => { const k = gfR(3, 9), m = k * gfR(4, 11), s = gfR(1, k - 2), lo = m - s, hi = lo + k - 1;
        return gfQ(`Write down the multiple of ${k} between ${lo} and ${hi}.`, m, 1, `${k} × ${m / k} = ${m} (1 mark).`, { label: `mult ${k} ${lo}`, skill: "multiples" }); },
      () => { const b = gfR(2, 9), n = gfR(3, 6), ans = `${b}${sup(n)}`;
        return gfQ(`Write ${Array(n).fill(b).join(" × ")} as a power of ${b}.`, ans, 1, `${n} lots of ${b} multiplied together is ${b} to the power ${n} (1 mark).`, { options: [`${n}${sup(b)}`, String(b * n)].filter(x => x !== ans), label: `pow ${b}^${n}`, skill: "index notation" }); }
    ] },
    { id: "gf-fractions", n: 4, short: "Fractions", title: "Fractions", strand: "Fractions, decimals and percentages",
      blurb: "Fractions of amounts, simplifying, adding, multiplying and dividing fractions, and mixed numbers.", makers: [
      () => { const d = pick([3, 4, 5, 6, 8]), n = gfR(1, d - 1), amt = d * gfR(3, 15);
        return gfQ(`Work out ${n}/${d} of ${amt}.`, amt / d * n, 2, `Divide by the bottom: ${amt} ÷ ${d} = ${amt / d} (1 mark). Multiply by the top: ${amt / d} × ${n} = ${amt / d * n} (1 mark).`, { label: `${n}/${d} of ${amt}`, skill: "fraction of an amount" }); },
      () => { let n, d; do { d = gfR(3, 12); n = gfR(1, d - 1); } while (gcd(n, d) !== 1); const k = gfR(2, 6);
        return gfQ(`Write ${n * k}/${d * k} in its simplest form.`, `${n}/${d}`, 1, `Divide top and bottom by ${k}: ${n}/${d} (1 mark).`, { label: `simp ${n * k}/${d * k}`, skill: "simplifying fractions" }); },
      () => { const [b, d] = pick([[2, 3], [3, 4], [2, 5], [4, 5], [3, 5], [2, 7], [3, 8], [4, 6], [5, 6], [3, 10]]), a = gfR(1, b - 1), c = gfR(1, d - 1), l = b * d / gcd(b, d), add = rand(2) || a * l / b <= c * l / d;
        const top = add ? a * l / b + c * l / d : a * l / b - c * l / d, ans = gfF(top, l), mix = top > l && l / gcd(top, l) > 1 ? [`${Math.floor(top / l)} ${gfF(top % l, l)}`] : [];
        return gfQ(`Work out ${a}/${b} ${add ? "+" : "−"} ${c}/${d}. Give your answer in its simplest form.`, ans, 2, `Use a common denominator: ${a * l / b}/${l} ${add ? "+" : "−"} ${c * l / d}/${l} (1 mark). = ${top}/${l}${ans !== `${top}/${l}` ? ` = ${ans}` : ""} (1 mark).`, { accept: mix, label: `${a}/${b}${add ? "+" : "-"}${c}/${d}`, skill: "adding and subtracting fractions" }); },
      () => { const a = gfR(1, 5), b = gfR(a + 1, 9), c = gfR(1, 6), d = gfR(c + 1, 9), ans = gfF(a * c, b * d);
        return gfQ(`Work out ${a}/${b} × ${c}/${d}. Give your answer in its simplest form.`, ans, 2, `Multiply the tops and the bottoms: ${a * c}/${b * d} (1 mark)${ans !== `${a * c}/${b * d}` ? `, which simplifies to ${ans}` : ", which is already in its simplest form"} (1 mark).`, { label: `${a}/${b}x${c}/${d}`, skill: "multiplying fractions" }); },
      () => { const a = gfR(1, 4), b = gfR(a + 1, 7), c = gfR(1, 4), d = gfR(c + 1, 7); if (a * d === b * c) return { label: "skip" }; const ans = gfF(a * d, b * c), top = a * d, bot = b * c;
        return gfQ(`Work out ${a}/${b} ÷ ${c}/${d}. Give your answer in its simplest form.`, ans, 2, `Flip the second fraction and multiply: ${a}/${b} × ${d}/${c} (1 mark) = ${top}/${bot}${ans !== `${top}/${bot}` ? ` = ${ans}` : ""} (1 mark).`, { accept: top > bot && bot / gcd(top, bot) > 1 ? [`${Math.floor(top / bot)} ${gfF(top % bot, bot)}`] : [], label: `${a}/${b}÷${c}/${d}`, skill: "dividing fractions" }); },
      () => { const t = pick([20, 24, 30, 36, 40, 32]), p = gfR(2, t - 2), how = pick(["walk to college", "have a part-time job", "take the bus", "are left-handed"]);
        return gfQ(`In a group of ${t} students, ${p} ${how}. What fraction of the group ${how}? Give your answer in its simplest form.`, gfF(p, t), 2, `${p} out of ${t} is ${p}/${t} (1 mark), which simplifies to ${gfF(p, t)} (1 mark).`, { label: `${p} of ${t}`, skill: "one number as a fraction of another" }); },
      () => { let a, b, c, d; do { b = gfR(3, 9); d = gfR(3, 9); a = gfR(1, b - 1); c = gfR(1, d - 1); } while (b === d || a * d === b * c); const big = a * d > b * c ? `${a}/${b}` : `${c}/${d}`;
        return gfQ(`Which is bigger, ${a}/${b} or ${c}/${d}?`, big, 1, `Use a common denominator: ${a}/${b} = ${a * d}/${b * d} and ${c}/${d} = ${b * c}/${b * d}, so ${big} is bigger (1 mark).`, { options: [big === `${a}/${b}` ? `${c}/${d}` : `${a}/${b}`, "They are the same size"], label: `cmp ${a}/${b} ${c}/${d}`, skill: "comparing fractions" }); },
      () => { const w = gfR(1, 5), d = gfR(2, 9), n = gfR(1, d - 1); if (gcd(n, d) !== 1) return { label: "skip" };
        return gfQ(`Write ${w} ${n}/${d} as an improper fraction.`, `${w * d + n}/${d}`, 1, `${w} whole${w > 1 ? "s are" : " is"} ${w * d}/${d}, plus ${n}/${d}: ${w * d + n}/${d} (1 mark).`, { label: `mixed ${w} ${n}/${d}`, skill: "mixed numbers" }); },
      () => { const d = pick([3, 4, 5, 8]), n = gfR(1, d - 1), x = d * gfR(3, 12);
        return gfQ(`${n}/${d} of a number is ${x / d * n}. What is the number?`, x, 2, `${x / d * n} ÷ ${n} = ${x / d} is one ${["", "", "half", "third", "quarter", "fifth", "", "", "eighth"][d]} (1 mark). ${x / d} × ${d} = ${x} (1 mark).`, { label: `rev ${n}/${d} ${x}`, skill: "reverse fractions" }); }
    ] },
    { id: "gf-percent", n: 5, short: "Percentages", title: "Fractions, decimals and percentages", strand: "Fractions, decimals and percentages",
      blurb: "Converting, percentages of amounts, increases and decreases, VAT, interest and percentage change.", makers: [
      () => { const k = rand(4), p = pick([5, 15, 35, 45, 65, 85, 12, 64, 28]);
        if (k === 0) return gfQ(`Write ${gfD(p / 100)} as a percentage.`, p, 1, `Multiply by 100: ${p}% (1 mark).`, { unit: "%", label: `dec ${p}`, skill: "decimals to percentages" });
        if (k === 1) { const [n, d] = pick([[3, 20], [7, 25], [9, 50], [3, 5], [7, 10], [11, 20], [3, 4], [1, 8]]);
          return gfQ(`Write ${n}/${d} as a percentage.`, gfD(n / d * 100), 1, `Make the bottom 100 (or divide): ${n}/${d} = ${gfD(n / d)} = ${gfD(n / d * 100)}% (1 mark).`, { unit: "%", label: `frac ${n}/${d}`, skill: "fractions to percentages" }); }
        if (k === 2) return gfQ(`Write ${p}% as a decimal.`, gfD(p / 100), 1, `Divide by 100: ${gfD(p / 100)} (1 mark).`, { label: `pc ${p}`, skill: "percentages to decimals" });
        const q = pick([20, 40, 60, 80, 25, 75, 10, 30]);
        return gfQ(`Write ${q}% as a fraction in its simplest form.`, gfF(q, 100), 1, `${q}/100 = ${gfF(q, 100)} (1 mark).`, { label: `pcf ${q}`, skill: "percentages to fractions" }); },
      () => { const pct = pick([10, 20, 25, 30, 5, 15, 35, 40, 60, 75, 45]), amt = 20 * gfR(2, 20), ans = amt * pct / 100;
        return gfQ(`Work out ${pct}% of £${amt}, without a calculator. (£)`, gfP(ans), 2, `Build it from 10% = £${gfP(amt / 10)}${pct % 10 ? ` and 5% = £${gfP(amt / 20)}` : ""} (1 mark). ${pct}% = £${gfP(ans)} (1 mark).`, { unit: "£", label: `${pct}% of ${amt}`, skill: "percentage of an amount" }); },
      () => { const price = gfR(12, 96) * 5, pct = pick([10, 15, 20, 25, 30, 12, 35, 8]), up = rand(2), ans = price * (100 + (up ? pct : -pct)) / 100;
        return gfQ(up ? `A phone contract costs £${price} a year. Next year it goes up by ${pct}%. What will it cost next year? (£)` : `A coat costs £${price}. In a sale, it is reduced by ${pct}%. What is the sale price? (£)`, gfP(ans), 2, `${pct}% of £${price} = £${gfP(price * pct / 100)} (1 mark). £${price} ${up ? "+" : "−"} £${gfP(price * pct / 100)} = £${gfP(ans)} (1 mark). Or in one step: £${price} × ${gfD((100 + (up ? pct : -pct)) / 100)}.`, { unit: "£", calc: true, label: `${up ? "inc" : "dec"} ${price} ${pct}`, skill: "percentage increase and decrease" }); },
      () => { const t = pick([20, 25, 40, 50, 80, 60]), pcts = range(1, 19).map(k => k * 5).filter(p => t * p % 100 === 0), pct = pick(pcts), s = t * pct / 100;
        return gfQ(`Sam scored ${s} out of ${t} in a test. What percentage is that?`, pct, 2, `${s}/${t} (1 mark) = ${gfD(s / t)} = ${pct}% (1 mark).`, { unit: "%", label: `${s}/${t} pc`, skill: "one number as a percentage of another" }); },
      () => { const set = pick([[["5/8", 0.625], ["0.6", 0.6], ["62%", 0.62]], [["3/4", 0.75], ["0.7", 0.7], ["72%", 0.72]], [["2/5", 0.4], ["0.45", 0.45], ["42%", 0.42]], [["7/20", 0.35], ["0.3", 0.3], ["33%", 0.33]], [["4/5", 0.8], ["0.85", 0.85], ["81%", 0.81]], [["1/3", 0.3333], ["0.3", 0.3], ["35%", 0.35]]]);
        const big = rand(2), sorted = set.slice().sort((x, y) => x[1] - y[1]), ans = (big ? sorted[2] : sorted[0])[0];
        return gfQ(`Which is the ${big ? "largest" : "smallest"}: ${shuffle(set).map(s => s[0]).join(", ")}?`, ans, 1, `Write them all as decimals: ${set.map(s => `${s[0]} = ${gfD(s[1])}${s[0] === "1/3" ? "…" : ""}`).join(", ")}. So ${ans} (1 mark).`, { options: set.map(s => s[0]).filter(s => s !== ans), label: `fdp ${set[0][0]} ${big}`, skill: "comparing fractions, decimals and percentages" }); },
      () => { const bill = gfR(20, 150) + pick([0, 0.5]);
        return gfQ(`A repair costs £${gfP(bill)} plus VAT at 20%. What is the total cost? (£)`, gfP(bill * 1.2), 2, `VAT: 20% of £${gfP(bill)} = £${gfP(bill * 0.2)} (1 mark). Total: £${gfP(bill * 1.2)} (1 mark).`, { unit: "£", calc: true, label: `vat ${bill}`, skill: "VAT" }); },
      () => { const P = pick([200, 500, 800, 1000, 1500, 2000]), r = gfR(2, 5), y = gfR(2, 5), i = P * r * y / 100, tot = rand(2);
        return gfQ(`£${P} is put in a savings account paying ${r}% simple interest a year. How much ${tot ? "is in the account" : "interest is earned"} after ${y} years? (£)`, gfP(tot ? P + i : i), 2, `One year's interest: ${r}% of £${P} = £${gfP(P * r / 100)} (1 mark). ${y} years: £${gfP(i)}${tot ? `, so £${P} + £${gfP(i)} = £${gfP(P + i)}` : ""} (1 mark).`, { unit: "£", label: `si ${P} ${r} ${y} ${tot}`, skill: "simple interest" }); },
      () => { const o = 20 * gfR(1, 10), pct = pick([5, 10, 15, 20, 25, 30, 35, 40]), up = rand(2), n = o * (100 + (up ? pct : -pct)) / 100;
        return gfQ(`The price of a ticket ${up ? "rose" : "fell"} from £${o} to £${gfP(n)}. What was the percentage ${up ? "increase" : "decrease"}?`, pct, 3, `The change: £${gfP(Math.abs(n - o))} (1 mark). Divide by the original price: ${gfP(Math.abs(n - o))} ÷ ${o} = ${gfD(pct / 100)} (1 mark). × 100 = ${pct}% (1 mark). Dividing by the new price is a common mistake.`, { unit: "%", calc: true, ps: true, label: `pchange ${o} ${pct} ${up}`, skill: "percentage change" }); }
    ] },
    { id: "gf-ratio", n: 6, short: "Ratio", title: "Ratio, proportion and best buys", strand: "Number",
      blurb: "Simplifying and sharing in a ratio, recipes, best buys, exchange rates and the unitary method.", makers: [
      () => { let a, b; do { a = gfR(1, 9); b = gfR(1, 9); } while (a === b || gcd(a, b) !== 1); const k = gfR(2, 9);
        return gfQ(`Write the ratio ${a * k} : ${b * k} in its simplest form.`, `${a}:${b}`, 1, `Divide both parts by ${k}: ${a} : ${b} (1 mark).`, { accept: [`${a} : ${b}`, `${a}: ${b}`, `${a} :${b}`], label: `ratio ${a * k}:${b * k}`, skill: "simplifying ratios" }); },
      () => { let a, b; do { a = gfR(1, 7); b = gfR(2, 8); } while (a === b); const k = gfR(3, 25), big = rand(2), ans = (big ? Math.max(a, b) : Math.min(a, b)) * k;
        return gfQ(`Ana and Ben share £${(a + b) * k} in the ratio ${a} : ${b}. How much does ${(a > b) === !!big ? "Ana" : "Ben"} get? (£)`, ans, 2, `Total parts: ${a} + ${b} = ${a + b}. One part: £${(a + b) * k} ÷ ${a + b} = £${k} (1 mark). ${ans / k} parts: £${ans} (1 mark).`, { unit: "£", label: `share ${a}:${b} ${k} ${big}`, skill: "sharing in a ratio" }); },
      () => { let a, b; do { a = gfR(1, 7); b = gfR(1, 7); } while (a === b); const k = gfR(2, 9);
        return gfQ(`In a club, the ratio of men to women is ${a} : ${b}. There are ${a * k} men. How many women are there?`, b * k, 2, `${a * k} ÷ ${a} = ${k} in each part (1 mark). ${b} × ${k} = ${b * k} (1 mark).`, { label: `part ${a}:${b} ${k}`, skill: "using a ratio" }); },
      () => { const s = pick([4, 6, 8]), n = pick([2, 3, 10, 12, 5].filter(x => x !== s)), k5 = 5 * gfR(2, 20), amt = s * k5, food = pick(["flour", "rice", "pasta", "minced beef"]);
        return gfQ(`A recipe for ${s} people uses ${amt} g of ${food}. How much ${food} is needed for ${n} people? (g)`, k5 * n, 2, `For 1 person: ${amt} ÷ ${s} = ${k5} g (1 mark). For ${n}: ${k5} × ${n} = ${k5 * n} g (1 mark).`, { unit: "g", label: `recipe ${s} ${amt} ${n}`, skill: "recipes and proportion" }); },
      () => { const qa = pick([4, 5, 6, 8]), qb = pick([10, 12, 15, 20]), ua = gfR(20, 90), ub = ua + (rand(2) ? 1 : -1) * gfR(2, 8), item = pick(["toilet rolls", "cans of drink", "batteries", "bread rolls"]);
        const ans = ua < ub ? "Pack A" : "Pack B";
        return gfQ(`Pack A: ${qa} ${item} for £${gfP(qa * ua / 100)}. Pack B: ${qb} ${item} for £${gfP(qb * ub / 100)}. Which pack is better value?`, ans, 3, `Price of one in pack A: £${gfP(qa * ua / 100)} ÷ ${qa} = ${ua}p (1 mark). In pack B: £${gfP(qb * ub / 100)} ÷ ${qb} = ${ub}p (1 mark). ${ans} is cheaper for each one (1 mark: you must show both prices to get it).`, { options: [ans === "Pack A" ? "Pack B" : "Pack A", "They are the same value"], calc: true, ps: true, label: `best ${qa} ${ua} ${qb} ${ub}`, skill: "best buys" }); },
      () => { const rate = pick([1.15, 1.2, 1.25, 1.4, 1.3]), p = 20 * gfR(3, 25), cur = rate === 1.15 || rate === 1.2 ? "euros" : "dollars", back = rand(2);
        return back ? gfQ(`£1 = ${rate.toFixed(2)} ${cur}. Jo changes ${gfP(p * rate)} ${cur} back into pounds. How many pounds does she get? (£)`, p, 2, `Divide by the rate (1 mark): ${gfP(p * rate)} ÷ ${rate.toFixed(2)} = £${p} (1 mark).`, { unit: "£", calc: true, label: `fx back ${rate} ${p}`, skill: "exchange rates" })
          : gfQ(`£1 = ${rate.toFixed(2)} ${cur}. How many ${cur} do you get for £${p}?`, gfP(p * rate), 2, `Multiply by the rate (1 mark): ${p} × ${rate.toFixed(2)} = ${gfP(p * rate)} ${cur} (1 mark).`, { calc: true, label: `fx ${rate} ${p}`, skill: "exchange rates" }); },
      () => { const n = gfR(3, 8), m = gfR(2, 12), u = gfR(25, 95); if (m === n) return { label: "skip" };
        return gfQ(`${n} pens cost £${gfP(n * u / 100)}. How much do ${m} of the same pens cost? (£)`, gfP(m * u / 100), 2, `One pen: £${gfP(n * u / 100)} ÷ ${n} = £${gfP(u / 100)} (1 mark). ${m} pens: £${gfP(m * u / 100)} (1 mark).`, { unit: "£", label: `unit ${n} ${u} ${m}`, skill: "the unitary method" }); },
      () => { let a, b; do { a = gfR(1, 8); b = gfR(1, 8); } while (a === b); const who = rand(2);
        return gfQ(`In a class, the ratio of boys to girls is ${a} : ${b}. What fraction of the class are ${who ? "girls" : "boys"}?`, gfF(who ? b : a, a + b), 1, `There are ${a + b} parts altogether, and ${who ? b : a} of them are ${who ? "girls" : "boys"}: ${gfF(who ? b : a, a + b)} (1 mark). Not ${who ? `${b}/${a}` : `${a}/${b}`}.`, { label: `rf ${a}:${b} ${who}`, skill: "ratios and fractions" }); }
    ] },
    { id: "gf-algebra", n: 7, short: "Algebra", title: "Algebra: simplify, substitute and expand", strand: "Patterns and missing numbers",
      blurb: "Collecting like terms, substituting into formulae, expanding and factorising, and writing expressions.", makers: [
      () => { const p = gfR(3, 9), q = gfR(2, 7), r = gfR(1, p - 1), s = gfR(1, 6), ans = expr([p - r, "a"], [q + s, "b"]);
        return gfQ(`Simplify ${p}a + ${q}b − ${r === 1 ? "" : r}a + ${s === 1 ? "" : s}b.`, ans, 1, `Collect the a terms: ${p} − ${r} = ${p - r}; the b terms: ${q} + ${s} = ${q + s}. ${ans} (1 mark).`, { options: [expr([p + r, "a"], [q + s, "b"]), `${p - r + q + s}ab`], label: `ct ${p},${q},${r},${s}`, skill: "collecting like terms" }); },
      () => { const a = gfR(2, 9), b = gfR(2, 9), k = rand(3);
        if (k === 0) return gfQ(`Simplify ${a}x × ${b}y.`, `${a * b}xy`, 1, `Multiply the numbers, then the letters: ${a * b}xy (1 mark).`, { options: [`${a + b}xy`, `${a}${b}xy`].filter(o => o !== `${a * b}xy`), label: `${a}x*${b}y`, skill: "simplifying products" });
        if (k === 1) return gfQ(`Simplify ${a}m × m.`, `${a}m²`, 1, `m × m = m², so ${a}m² (1 mark).`, { options: [`${a + 1}m`, `${a}m`], label: `${a}m*m`, skill: "simplifying products" });
        return gfQ(`Simplify ${a * b}n ÷ ${b}.`, `${a}n`, 1, `${a * b} ÷ ${b} = ${a}: ${a}n (1 mark).`, { options: [`${a * b - b}n`, `${a * b}n²`, `${a}`].filter(o => o !== `${a}n`).slice(0, 2), label: `${a * b}n/${b}`, skill: "simplifying" }); },
      () => { const a = gfR(2, 6), b = -gfR(1, 5), k = rand(3);
        const [e, v, how] = [[`4a + 3b`, 4 * a + 3 * b, `4 × ${a} + 3 × (${gfM(b)}) = ${4 * a} − ${-3 * b}`], [`a² − b`, a * a - b, `${a}² − (${gfM(b)}) = ${a * a} + ${-b}`], [`5(a + b)`, 5 * (a + b), `5 × (${a} + (${gfM(b)})) = 5 × ${gfM(a + b)}`]][k];
        return gfQ(`a = ${a} and b = ${gfM(b)}. Work out the value of ${e}.`, gfM(v), 2, `Put the numbers in: ${how} (1 mark) = ${gfM(v)} (1 mark).`, { label: `sub ${e} ${a},${b}`, skill: "substitution" }); },
      () => { const k = rand(3);
        if (k === 0) { const l = gfR(4, 15), w = gfR(2, 9); return gfQ(`P = 2l + 2w. Work out P when l = ${l} and w = ${w}.`, 2 * l + 2 * w, 2, `2 × ${l} + 2 × ${w} (1 mark) = ${2 * l + 2 * w} (1 mark).`, { label: `P ${l},${w}`, skill: "using formulae" }); }
        if (k === 1) { const u = gfR(2, 20), a = gfR(2, 9), t = gfR(2, 8); return gfQ(`v = u + at. Work out v when u = ${u}, a = ${a} and t = ${t}.`, u + a * t, 2, `${u} + ${a} × ${t} (1 mark) = ${u} + ${a * t} = ${u + a * t} (1 mark). Multiply before adding.`, { label: `v ${u},${a},${t}`, skill: "using formulae" }); }
        const f = pick([30, 35, 40, 45]), r = pick([20, 25, 30]), h = gfR(2, 6);
        return gfQ(`A plumber's charge, in pounds, is C = ${f} + ${r}h, where h is the number of hours. Work out C for a ${h}-hour job.`, f + r * h, 2, `${f} + ${r} × ${h} (1 mark) = £${f + r * h} (1 mark).`, { unit: "£", label: `C ${f},${r},${h}`, skill: "using formulae" }); },
      () => { const kk = gfR(2, 9), c = gfR(1, 9), neg = rand(2), ans = expr([kk, "x"], [neg ? -kk * c : kk * c, ""]);
        return gfQ(`Expand ${kk}(x ${neg ? "−" : "+"} ${c}).`, ans, 1, `Multiply both terms inside the bracket by ${kk}: ${ans} (1 mark).`, { options: [expr([kk, "x"], [neg ? -c : c, ""]), expr([1, "x"], [neg ? -kk * c : kk * c, ""])], label: `exp ${kk},${c},${neg}`, skill: "expanding brackets" }); },
      () => { let g, p, q; do { g = gfR(2, 6); p = gfR(2, 7); q = gfR(1, 9); } while (gcd(p, q) !== 1); const ans = `${g}(${p}x + ${q})`;
        return gfQ(`Factorise ${g * p}x + ${g * q} fully.`, ans, 2, `The biggest number that goes into ${g * p} and ${g * q} is ${g} (1 mark). ${ans} (1 mark: check by expanding).`, { options: [`${g}(${p}x + ${g * q})`, `${g * p}(x + ${g * q})`], label: `fac ${g},${p},${q}`, skill: "factorising" }); },
      () => { const pr = gfR(15, 90), extra = gfR(20, 95), ans = `np + ${extra}`;
        return gfQ(`Pens cost p pence each. A ruler costs ${extra}p. Write an expression for the cost, in pence, of n pens and one ruler.`, ans, 1, `n pens cost n × p = np, plus ${extra} for the ruler: np + ${extra} (1 mark).`, { options: [`n + p + ${extra}`, `${extra}np`], label: `words ${extra}`, skill: "writing expressions" }); },
      () => { const set = pick([["x + 5 = 9", "an equation"], ["3x + 2y", "an expression"], ["A = lw", "a formula"], ["7n − 4", "an expression"], ["2x − 1 = 11", "an equation"], ["P = 4s", "a formula"]]);
        return gfQ(`Is ${set[0]} an equation, an expression or a formula?`, set[1], 1, `An expression has no equals sign; an equation can be solved for one letter; a formula links letters that stand for quantities. ${set[0]} is ${set[1]} (1 mark).`, { options: ["an equation", "an expression", "a formula"].filter(o => o !== set[1]), label: `vocab ${set[0]}`, skill: "algebra words" }); }
    ] },
    { id: "gf-equations", n: 8, short: "Equations and sequences", title: "Equations, inequalities and sequences", strand: "Patterns and missing numbers",
      blurb: "Solving linear equations, inequalities, and the next term and nth term of a sequence.", makers: [
      () => { const x = gfR(1, 12), a = gfR(2, 9), b = gfR(1, 20), neg = rand(2) && a * x > b;
        return gfQ(`Solve ${a}x ${neg ? "−" : "+"} ${b} = ${neg ? a * x - b : a * x + b}.`, x, 2, `${neg ? "Add" : "Take away"} ${b} on both sides: ${a}x = ${a * x} (1 mark). Divide by ${a}: x = ${x} (1 mark).`, { label: `eq ${a},${b},${x},${neg}`, skill: "solving equations" }); },
      () => { const x = gfR(1, 9), a = gfR(2, 6), b = gfR(1, 8);
        return gfQ(`Solve ${a}(x + ${b}) = ${a * (x + b)}.`, x, 2, `Expand: ${a}x + ${a * b} = ${a * (x + b)}, or divide both sides by ${a} first: x + ${b} = ${x + b} (1 mark). x = ${x} (1 mark).`, { label: `eqb ${a},${b},${x}`, skill: "equations with brackets" }); },
      () => { const x = gfR(1, 10), c = gfR(1, 5), a = c + gfR(1, 5), b = gfR(-9, 9) || 4, d = (a - c) * x + b;
        const side = v => (v < 0 ? ` − ${-v}` : v > 0 ? ` + ${v}` : "");
        return gfQ(`Solve ${a}x${side(b)} = ${c === 1 ? "" : c}x${side(d)}.`, x, 3, `Take ${c === 1 ? "" : c}x from both sides: ${a - c === 1 ? "" : a - c}x${side(b)} = ${gfM(d)} (1 mark). ${b ? `${b > 0 ? "Take away" : "Add"} ${Math.abs(b)}: ` : ""}${a - c === 1 ? "" : a - c}x = ${(a - c) * x} (1 mark). x = ${x} (1 mark).`, { label: `eq2 ${a},${b},${c},${x}`, skill: "unknowns on both sides" }); },
      () => { const s = gfR(-5, 20), d = pick([2, 3, 4, 5, 6, 7, -3, -4]), t = range(0, 3).map(i => s + i * d);
        return gfQ(`Write down the next term of the sequence ${t.map(gfM).join(", ")}.`, gfM(s + 4 * d), 1, `The terms go ${d > 0 ? "up" : "down"} by ${Math.abs(d)} each time: ${gfM(s + 3 * d)} ${d > 0 ? "+" : "−"} ${Math.abs(d)} = ${gfM(s + 4 * d)} (1 mark).`, { label: `next ${s},${d}`, skill: "term-to-term rules" }); },
      () => { const d = gfR(2, 9), c = gfR(-5, 9), t = range(1, 4).map(n => d * n + c), ans = expr([d, "n"], [c, ""]);
        return gfQ(`Find an expression for the nth term of the sequence ${t.map(gfM).join(", ")}.`, ans, 2, `It goes up by ${d}, so it starts ${d}n (1 mark). ${d} × 1 = ${d}, and the first term is ${gfM(t[0])}, so ${c >= 0 ? "add" : "take away"} ${Math.abs(c)}: ${ans} (1 mark).`, { options: [expr([1, "n"], [d, ""]), expr([d, "n"], [t[0], ""])].filter(o => o !== ans), label: `nth ${d},${c}`, skill: "the nth term" }); },
      () => { const d = gfR(2, 9), c = gfR(-6, 9), n = pick([10, 20, 50, 100]);
        return gfQ(`The nth term of a sequence is ${expr([d, "n"], [c, ""])}. Work out the ${n}th term.`, gfM(d * n + c), 1, `Put n = ${n} in: ${d} × ${n} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${gfM(d * n + c)} (1 mark).`, { label: `term ${d},${c},${n}`, skill: "the nth term" }); },
      () => { const d = gfR(2, 7), c = gfR(1, 6), x = gfR(30, 99), yes = (x - c) % d === 0;
        return gfQ(`Is ${x} a term in the sequence with nth term ${d}n + ${c}?`, yes ? "Yes" : "No", 2, `Solve ${d}n + ${c} = ${x}: ${d}n = ${x - c}, n = ${gfD((x - c) / d)} (1 mark). ${yes ? `That is a whole number, so yes: it is term ${(x - c) / d}` : "That is not a whole number, so no"} (1 mark: you need the reason).`, { options: [yes ? "No" : "Yes"], label: `in ${d},${c},${x}`, skill: "is it in the sequence?" }); },
      () => { const lo = gfR(-5, 2), hi = lo + gfR(3, 7), k = rand(3), sym = [["<", "≤"], ["≤", "<"], ["<", "<"]][k], vals = range(lo, hi).filter(v => (sym[0] === "<" ? v > lo : v >= lo) && (sym[1] === "<" ? v < hi : v <= hi));
        return gfQ(`n is a whole number and ${gfM(lo)} ${sym[0]} n ${sym[1]} ${gfM(hi)}. How many possible values of n are there?`, vals.length, 2, `List them (1 mark): ${vals.map(gfM).join(", ")}. That is ${vals.length} (1 mark). ${sym[0] === "<" ? gfM(lo) + " is not included" : gfM(lo) + " is included"}; ${sym[1] === "<" ? gfM(hi) + " is not" : gfM(hi) + " is"}.`, { label: `ineq ${lo},${hi},${k}`, skill: "inequalities" }); },
      () => { const x = gfR(1, 9), a = gfR(2, 6), b = gfR(1, 12), sym = pick([">", "<", "≥", "≤"]);
        return gfQ(`Solve ${a}x + ${b} ${sym} ${a * x + b}.`, `x ${sym} ${x}`, 2, `Take away ${b}: ${a}x ${sym} ${a * x} (1 mark). Divide by ${a}: x ${sym} ${x} (1 mark).`, { accept: [`x${sym}${x}`], label: `sineq ${a},${b},${x},${sym}`, skill: "solving inequalities" }); },
      () => { const c = gfR(2, 12), k = rand(2), ans = k ? `x = y − ${c}` : `x = y/${c}`;
        return gfQ(`Make x the subject of ${k ? `y = x + ${c}` : `y = ${c}x`}.`, ans, 1, `Do the opposite to both sides: ${k ? `take away ${c}` : `divide by ${c}`}. ${ans} (1 mark).`, { options: k ? [`x = y + ${c}`, `x = ${c} − y`] : [`x = ${c}y`, `x = y − ${c}`], label: `subj ${c},${k}`, skill: "changing the subject" }); }
    ] },
    { id: "gf-graphs", n: 9, short: "Graphs", title: "Coordinates and straight-line graphs", strand: "Patterns and missing numbers",
      blurb: "Midpoints, reading straight-line graphs, gradient and intercept, and real-life graphs.", makers: [
      () => { const x1 = gfR(-4, 6), y1 = gfR(-4, 8), x2 = x1 + 2 * gfR(1, 4), y2 = y1 + 2 * gfR(-3, 4), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ans = `(${gfM(mx)}, ${gfM(my)})`;
        return gfQ(`A is (${gfM(x1)}, ${gfM(y1)}) and B is (${gfM(x2)}, ${gfM(y2)}). Find the midpoint of AB. Write it as (x, y).`, ans, 2, `Add and halve each coordinate: (${gfM(x1)} + ${gfM(x2)}) ÷ 2 = ${gfM(mx)} (1 mark), (${gfM(y1)} + ${gfM(y2)}) ÷ 2 = ${gfM(my)} (1 mark).`, { accept: [`(${gfM(mx)},${gfM(my)})`, `${gfM(mx)}, ${gfM(my)}`, `${gfM(mx)},${gfM(my)}`], label: `mid ${x1},${y1},${x2},${y2}`, skill: "midpoints" }); },
      () => { const m = gfR(1, 3), c = gfR(0, 4), x = gfR(1, 5);
        return gfQ(`The graph shows a straight line. What is the value of y when x = ${x}?`, m * x + c, 1, `Go up from x = ${x} to the line, then across to the y-axis: y = ${m * x + c} (1 mark).`, { pic: gfGraph(m, c), label: `read ${m},${c},${x}`, skill: "reading graphs" }); },
      () => { const m = gfR(1, 3), c = gfR(1, 4), ans = expr([m, "x"], [c, ""]), w = [expr([c, "x"], [m, ""]), expr([m + 1, "x"], [c, ""]), expr([m, "x"], [c + 1, ""])].filter(o => o !== ans);
        return gfQ(`Which equation matches the line on the graph? Write it as y = mx + c.`, `y = ${ans}`, 1, `It crosses the y-axis at ${c}, so c = ${c}. It goes up ${m} for each 1 across, so m = ${m}: y = ${ans} (1 mark).`, { options: w.slice(0, 2).map(o => `y = ${o}`), pic: gfGraph(m, c), label: `match ${m},${c}`, skill: "y = mx + c" }); },
      () => { const m = gfR(-5, 6) || 2, c = gfR(-9, 9), grad = rand(2), e = expr([m, "x"], [c, ""]);
        return grad ? gfQ(`What is the gradient of the line y = ${e}?`, gfM(m), 1, `In y = mx + c, the gradient is m, the number in front of x: ${gfM(m)} (1 mark).`, { label: `grad ${m},${c}`, skill: "gradient" })
          : gfQ(`The line y = ${e} crosses the y-axis. What is the y-coordinate of that point?`, gfM(c), 1, `At the y-axis, x = 0, so y = ${gfM(c)} (1 mark).`, { label: `int ${m},${c}`, skill: "y-intercept" }); },
      () => { const m = gfR(2, 5), c = gfR(-6, 6), x = gfR(-3, 3);
        return gfQ(`y = ${expr([m, "x"], [c, ""])}. Work out the value of y when x = ${gfM(x)}.`, gfM(m * x + c), 1, `${m} × ${x < 0 ? `(${gfM(x)})` : x} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${gfM(m * x + c)} (1 mark).`, { label: `tab ${m},${c},${x}`, skill: "tables of values" }); },
      () => { const m = gfR(2, 5), c = gfR(1, 6), x = gfR(1, 6), y = m * x + c, ans = `(${x}, ${y})`;
        return gfQ(`Which point lies on the line y = ${m}x + ${c}?`, ans, 1, `Put x = ${x} in: ${m} × ${x} + ${c} = ${y}, so (${x}, ${y}) is on the line (1 mark).`, { options: [`(${y}, ${x})`, `(${x}, ${y + 1})`].filter(o => o !== ans), label: `on ${m},${c},${x}`, skill: "points on a line" }); },
      () => { const k = gfR(2, 9), h = rand(2), ans = h ? `y = ${k}` : `x = ${k}`;
        return gfQ(`Which of these lines is ${h ? "horizontal" : "vertical"}?`, ans, 1, `y = ${k} is every point with y-coordinate ${k}: a horizontal line. x = ${k} is vertical (1 mark).`, { options: [h ? `x = ${k}` : `y = ${k}`, `y = ${k}x`], label: `hv ${k} ${h}`, skill: "horizontal and vertical lines" }); },
      () => { const f = pick([30, 35, 40, 45, 50]), r = pick([15, 20, 25, 30]), h = gfR(2, 7), back = rand(2);
        return back ? gfQ(`An electrician charges £${f} to come out, plus £${r} for each hour. One bill was £${f + r * h}. How many hours did the job take?`, h, 2, `Take off the call-out: £${f + r * h} − £${f} = £${r * h} (1 mark). ÷ £${r} = ${h} hours (1 mark).`, { label: `bill back ${f},${r},${h}`, skill: "real-life graphs and formulae" })
          : gfQ(`An electrician charges £${f} to come out, plus £${r} for each hour. How much is a ${h}-hour job? (£)`, f + r * h, 2, `${h} × £${r} = £${r * h} (1 mark). + £${f} = £${f + r * h} (1 mark).`, { unit: "£", label: `bill ${f},${r},${h}`, skill: "real-life graphs and formulae" }); }
    ] },
    { id: "gf-measures", n: 10, short: "Units and time", title: "Units, time and speed", strand: "Measurement",
      blurb: "Metric units, 24-hour time, durations, speed, distance and time, and converting between units.", makers: [
      () => { const [from, to, f, unit] = pick([["km", "m", 1000, "m"], ["m", "cm", 100, "cm"], ["kg", "g", 1000, "g"], ["litres", "ml", 1000, "ml"], ["cm", "mm", 10, "mm"]]), x = gfR(11, 99) / 10, down = rand(2);
        return down ? gfQ(`Change ${gfD(x * f)} ${to} into ${from}.`, gfD(x), 1, `There are ${f} ${to} in 1 ${from === "litres" ? "litre" : from}: ${gfD(x * f)} ÷ ${f} = ${gfD(x)} (1 mark).`, { unit: from === "litres" ? "" : from, label: `conv ${x}${to}`, skill: "metric units" })
          : gfQ(`Change ${gfD(x)} ${from} into ${to}.`, gfD(x * f), 1, `There are ${f} ${to} in 1 ${from === "litres" ? "litre" : from}: ${gfD(x)} × ${f} = ${gfD(x * f)} (1 mark).`, { unit, label: `conv ${x}${from}`, skill: "metric units" }); },
      () => { const s = gfR(6 * 60, 20 * 60), d = gfR(35, 150), e = s + d, t = m => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`, k = rand(2);
        return k ? gfQ(`A train leaves at ${t(s)} and arrives at ${t(e)}. How long is the journey, in minutes?`, d, 2, `Count up to the next hour, then on: ${60 - s % 60 === 60 ? 0 : 60 - s % 60} minutes to ${t(Math.ceil(s / 60) * 60)} (1 mark), then to ${t(e)}: ${d} minutes altogether (1 mark). Don't subtract times like ordinary numbers.`, { unit: "minutes", label: `dur ${s},${d}`, skill: "time durations" })
          : gfQ(`A film starts at ${t(s)} and lasts ${Math.floor(d / 60) ? `${Math.floor(d / 60)} hour${d >= 120 ? "s" : ""} ` : ""}${d % 60} minutes. What time does it finish? Give a 24-hour time.`, t(e), 2, `Add the hours, then the minutes, carrying 60 minutes into an hour (1 mark): ${t(e)} (1 mark).`, { accept: [t(e).replace(":", ""), t(e).replace(":", ".")], label: `end ${s},${d}`, skill: "time durations" }); },
      () => { const h = gfR(1, 11), m = gfR(1, 59), pm = rand(2), ans = `${String(pm ? h + 12 : h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        return gfQ(`Write ${h}:${String(m).padStart(2, "0")} ${pm ? "pm" : "am"} as a 24-hour clock time.`, ans, 1, `${pm ? `Afternoon and evening times add 12 to the hour: ${h} + 12 = ${h + 12}` : "Morning times keep their hour, with a 0 in front"}: ${ans} (1 mark).`, { accept: [ans.replace(":", ""), ans.replace(":", ".")], label: `24h ${h},${m},${pm}`, skill: "24-hour time" }); },
      () => { const t = pick([1.5, 2, 2.5, 3, 0.5, 4, 1.25]), v = pick([40, 48, 50, 60, 64, 70, 80]), d = v * t, words = `${Math.floor(t) ? `${Math.floor(t)} hour${t >= 2 ? "s" : ""}` : ""}${t % 1 ? ` ${(t % 1) * 60} minutes` : ""}`.trim();
        return gfQ(`A car travels ${d} miles in ${words}. Work out its average speed in miles per hour.`, v, 2, `${words} = ${t} hours (1 mark). Speed = distance ÷ time = ${d} ÷ ${t} = ${v} mph (1 mark).`, { unit: "mph", label: `speed ${d},${t}`, skill: "speed" }); },
      () => { const m = pick([15, 20, 30, 40, 45, 90]), v = pick([30, 45, 48, 60, 72, 90, 120]), d = v * m / 60; if (!Number.isInteger(d)) return { label: "skip" };
        return gfQ(`A cyclist rides at ${v} km/h for ${m} minutes. How far do they go? (km)`, d, 2, `${m} minutes is ${gfF(m, 60)} of an hour (1 mark). Distance = speed × time = ${v} × ${gfF(m, 60)} = ${d} km (1 mark).`, { unit: "km", label: `dist ${v},${m}`, skill: "distance from speed and time" }); },
      () => { const h = gfR(1, 5), [f, mins] = pick([[0.25, 15], [0.5, 30], [0.75, 45], [0.1, 6], [0.2, 12], [0.4, 24]]), hrs = `${h} hour${h > 1 ? "s" : ""}`, ans = `${hrs} ${mins} minutes`;
        return gfQ(`A job takes ${gfD(h + f)} hours. Write this in hours and minutes.`, ans, 1, `${gfD(f)} of an hour is ${gfD(f)} × 60 = ${mins} minutes (1 mark). It is not ${Math.round(f * 100)} minutes.`, { options: [`${hrs} ${Math.round(f * 100)} minutes`, `${hrs} ${mins + 5} minutes`], label: `dech ${h},${f}`, skill: "time as a decimal" }); },
      () => { const k = rand(2), n = 5 * gfR(2, 16);
        return k ? gfQ(`5 miles is about 8 km. Change ${n} miles into kilometres.`, n / 5 * 8, 2, `${n} ÷ 5 = ${n / 5} lots of 5 miles (1 mark). ${n / 5} × 8 = ${n / 5 * 8} km (1 mark).`, { unit: "km", label: `mi ${n}`, skill: "miles and kilometres" })
          : gfQ(`5 miles is about 8 km. Change ${n / 5 * 8} km into miles.`, n, 2, `${n / 5 * 8} ÷ 8 = ${n / 5} lots of 8 km (1 mark). ${n / 5} × 5 = ${n} miles (1 mark).`, { unit: "miles", label: `km ${n}`, skill: "miles and kilometres" }); },
      () => { const [q, ans, others, why] = pick([["How many cm² are there in 1 m²?", "10 000", ["100", "1000"], "1 m² is 100 cm by 100 cm, so 100 × 100 = 10 000 cm²"], ["How many cm³ are there in 1 litre?", "1000", ["100", "10 000"], "1 litre = 1000 ml, and 1 ml = 1 cm³"], ["How many mm² are there in 1 cm²?", "100", ["10", "1000"], "1 cm² is 10 mm by 10 mm, so 100 mm²"], ["How many seconds are there in 1 hour?", "3600", ["360", "6000"], "60 × 60 = 3600"]]);
        return gfQ(q, ans, 1, `${why} (1 mark).`, { options: others, accept: [ans.replace(" ", ""), ans.replace(" ", ",")], label: q, skill: "area, volume and time units" }); }
    ] },
    { id: "gf-angles", n: 11, short: "Angles and shapes", title: "Angles and shapes", strand: "Shape and angles",
      blurb: "Angle facts on lines, in triangles and polygons, parallel lines, shape names and bearings.", makers: [
      () => { const a = gfR(20, 160), b = rand(2) ? 0 : gfR(10, 170 - a), x = 180 - a - b;
        return gfQ(`${b ? `Three angles lie on a straight line. Two of them are ${a}° and ${b}°.` : `Two angles lie on a straight line. One of them is ${a}°.`} Work out the ${b ? "third" : "other"} angle. (°)`, x, 1, `Angles on a straight line add up to 180°: 180 − ${a}${b ? ` − ${b}` : ""} = ${x}° (1 mark).`, { unit: "°", label: `line ${a},${b}`, skill: "angles on a straight line" }); },
      () => { const a = gfR(60, 150), b = gfR(40, 120), c = gfR(20, 80), x = 360 - a - b - c; if (x < 10) return { label: "skip" };
        return gfQ(`Four angles meet at a point. Three of them are ${a}°, ${b}° and ${c}°. Work out the fourth angle. (°)`, x, 1, `Angles around a point add up to 360°: 360 − ${a} − ${b} − ${c} = ${x}° (1 mark).`, { unit: "°", label: `point ${a},${b},${c}`, skill: "angles around a point" }); },
      () => { const a = gfR(25, 100), b = gfR(20, 150 - a);
        return gfQ(`Two angles of a triangle are ${a}° and ${b}°. Work out the third angle. (°)`, 180 - a - b, 1, `Angles in a triangle add up to 180°: 180 − ${a} − ${b} = ${180 - a - b}° (1 mark).`, { unit: "°", label: `tri ${a},${b}`, skill: "angles in a triangle" }); },
      () => { const apex = 2 * gfR(10, 70), base = (180 - apex) / 2, k = rand(2);
        return k ? gfQ(`An isosceles triangle has one angle of ${apex}° between its two equal sides. Work out the size of each of the other two angles. (°)`, base, 2, `180 − ${apex} = ${180 - apex} (1 mark). The other two are equal: ${180 - apex} ÷ 2 = ${base}° (1 mark).`, { unit: "°", label: `iso apex ${apex}`, skill: "isosceles triangles" })
          : gfQ(`In an isosceles triangle, the two equal angles are each ${base}°. Work out the third angle. (°)`, apex, 2, `${base} + ${base} = ${2 * base} (1 mark). 180 − ${2 * base} = ${apex}° (1 mark).`, { unit: "°", label: `iso base ${base}`, skill: "isosceles triangles" }); },
      () => { const a = gfR(60, 130), b = gfR(50, 120), c = gfR(40, 110), x = 360 - a - b - c; if (x < 30 || x > 170) return { label: "skip" };
        return gfQ(`Three angles of a quadrilateral are ${a}°, ${b}° and ${c}°. Work out the fourth angle. (°)`, x, 1, `Angles in a quadrilateral add up to 360°: 360 − ${a} − ${b} − ${c} = ${x}° (1 mark).`, { unit: "°", label: `quad ${a},${b},${c}`, skill: "angles in a quadrilateral" }); },
      () => { const n = pick([5, 6, 8, 9, 10, 12]), ext = 360 / n, k = rand(2), name = { 5: "pentagon", 6: "hexagon", 8: "octagon", 9: "nonagon", 10: "decagon", 12: "dodecagon (12 sides)" }[n];
        return k ? gfQ(`Work out the size of each exterior angle of a regular ${name}. (°)`, ext, 2, `The exterior angles add up to 360° (1 mark). 360 ÷ ${n} = ${ext}° (1 mark).`, { unit: "°", label: `ext ${n}`, skill: "angles in polygons" })
          : gfQ(`Work out the size of each interior angle of a regular ${name}. (°)`, 180 - ext, 2, `Exterior angle: 360 ÷ ${n} = ${ext}° (1 mark). Interior = 180 − ${ext} = ${180 - ext}° (1 mark).`, { unit: "°", label: `int ${n}`, skill: "angles in polygons" }); },
      () => { const [desc, ans] = pick([["between the two parallel lines, on opposite sides of the line crossing them (a Z shape)", "Alternate angles: they are equal"], ["in matching positions at each parallel line (an F shape)", "Corresponding angles: they are equal"], ["between the two parallel lines, on the same side of the line crossing them (a C shape)", "Co-interior angles: they add up to 180°"]]);
        return gfQ(`A line crosses two parallel lines. Two angles are ${desc}. Which reason is right?`, ans, 1, `Learn the three names and what each means: alternate (Z) are equal, corresponding (F) are equal, co-interior (C) add to 180°. In the exam, the reason must use the right name (1 mark).`, { options: ["Alternate angles: they are equal", "Corresponding angles: they are equal", "Co-interior angles: they add up to 180°"].filter(o => o !== ans), label: `par ${ans.slice(0, 5)}`, skill: "angles in parallel lines" }); },
      () => { const [desc, ans, others] = pick([["a quadrilateral with exactly one pair of parallel sides", "trapezium", ["parallelogram", "kite"]], ["a quadrilateral with four equal sides and no right angles", "rhombus", ["square", "kite"]], ["a quadrilateral with two pairs of equal sides next to each other", "kite", ["rhombus", "trapezium"]], ["a triangle with no equal sides", "scalene", ["isosceles", "equilateral"]], ["a quadrilateral with two pairs of parallel sides and no right angles", "parallelogram", ["trapezium", "rectangle"]]]);
        return gfQ(`What is the name of ${desc}?`, ans, 1, `It is a ${ans} (1 mark).`, { options: others, label: `name ${ans}`, skill: "naming shapes" }); },
      () => { const [b, ans] = pick([["090°", "East"], ["180°", "South"], ["270°", "West"], ["045°", "North-east"], ["225°", "South-west"]]);
        return gfQ(`Which direction is a bearing of ${b}?`, ans, 1, `Bearings are measured clockwise from north, with three figures: ${b} is ${ans} (1 mark).`, { options: shuffle(["East", "South", "West", "North-east", "South-west", "North-west"].filter(o => o !== ans)).slice(0, 2), label: `bear ${b}`, skill: "bearings" }); },
      () => { const n = gfR(5, 10);
        return gfQ(`Work out the sum of the interior angles of a polygon with ${n} sides. (°)`, (n - 2) * 180, 2, `It splits into ${n} − 2 = ${n - 2} triangles (1 mark). ${n - 2} × 180 = ${(n - 2) * 180}° (1 mark).`, { unit: "°", label: `sum ${n}`, skill: "angles in polygons" }); },
      () => { const a = gfR(35, 75), x = 180 - 2 * a;
        return gfQ(`Triangle ABC is isosceles with AB = AC. Angle ABC is ${a}°. The side BC is extended to D. Work out angle ACD. (°)`, 180 - a, 3, `Angle ACB = ${a}° (base angles of an isosceles triangle are equal) (1 mark). Angle ACD = 180 − ${a} (angles on a straight line add to 180°) (1 mark) = ${180 - a}° (1 mark). Give a reason for each step: the reasons are marked. (Angle BAC is ${x}°, which you don't need.)`, { unit: "°", ps: true, label: `ext iso ${a}`, skill: "angle reasoning" }); }
    ] },
    { id: "gf-area", n: 12, short: "Area and volume", title: "Perimeter, area and volume", strand: "Measurement",
      blurb: "Rectangles, triangles, trapeziums, compound shapes, circles, cuboids and surface area.", makers: [
      () => { const l = gfR(4, 15), w = gfR(2, 9); if (l === w) return { label: "skip" };
        return gfQ(`A rectangle is ${l} cm long and ${w} cm wide. Work out its area. (cm²)`, l * w, 1, `Area = length × width = ${l} × ${w} = ${l * w} cm² (1 mark).`, { unit: "cm²", label: `rect a ${l},${w}`, skill: "area of a rectangle" }); },
      () => { const l = gfR(4, 15), w = gfR(2, 9); if (l === w) return { label: "skip" };
        return gfQ(`A rectangle is ${l} cm long and ${w} cm wide. Work out its perimeter. (cm)`, 2 * (l + w), 1, `Perimeter is the distance all the way round: ${l} + ${w} + ${l} + ${w} = ${2 * (l + w)} cm (1 mark). Don't confuse it with area.`, { unit: "cm", label: `rect p ${l},${w}`, skill: "perimeter" }); },
      () => { const b = gfR(3, 14), h = 2 * gfR(2, 8);
        return gfQ(`A triangle has base ${b} cm and perpendicular height ${h} cm. Work out its area. (cm²)`, b * h / 2, 2, `Area = ½ × base × height (1 mark) = ½ × ${b} × ${h} = ${b * h / 2} cm² (1 mark).`, { unit: "cm²", label: `tri ${b},${h}`, skill: "area of a triangle" }); },
      () => { const a = gfR(3, 9), b = a + 2 * gfR(1, 4), h = gfR(3, 8), k = rand(2);
        return k ? gfQ(`A trapezium has parallel sides ${a} cm and ${b} cm. The distance between them is ${h} cm. Work out its area. (cm²)`, (a + b) / 2 * h, 2, `Area = ½(a + b)h (1 mark) = ½ × (${a} + ${b}) × ${h} = ${(a + b) / 2 * h} cm² (1 mark).`, { unit: "cm²", label: `trap ${a},${b},${h}`, skill: "area of a trapezium" })
          : gfQ(`A parallelogram has base ${b} cm and perpendicular height ${h} cm. Work out its area. (cm²)`, b * h, 2, `Area = base × perpendicular height (1 mark) = ${b} × ${h} = ${b * h} cm² (1 mark). Not the slanted side.`, { unit: "cm²", label: `para ${b},${h}`, skill: "area of a parallelogram" }); },
      () => { const W = gfR(7, 12), H = gfR(6, 10), w = gfR(2, W - 3), h = gfR(2, H - 3), area = rand(2);
        return area ? gfQ(`The L-shape is made from a rectangle with a corner cut out. Work out its area. (cm²)`, W * H - w * h, 3, `Split it into two rectangles, or take the corner away from the big rectangle (1 mark): the corner is ${w} cm by ${h} cm. ${W} × ${H} = ${W * H} and ${w} × ${h} = ${w * h} (1 mark). ${W * H} − ${w * h} = ${W * H - w * h} cm² (1 mark).`, { unit: "cm²", pic: gfL(W, H, w, h), ps: true, label: `L a ${W},${H},${w},${h}`, skill: "area of compound shapes" })
          : gfQ(`The L-shape is made from a rectangle with a corner cut out. Work out its perimeter. (cm)`, 2 * (W + H), 3, `Find the two missing sides: ${W} − ${W - w} = ${w} cm and ${H} − ${H - h} = ${h} cm (1 mark). Add all six sides (1 mark): ${W} + ${H} + ${W - w} + ${h} + ${w} + ${H - h} = ${2 * (W + H)} cm (1 mark).`, { unit: "cm", pic: gfL(W, H, w, h), ps: true, label: `L p ${W},${H},${w},${h}`, skill: "perimeter of compound shapes" }); },
      () => { const r = gfR(2, 12), k = rand(3), v = k === 0 ? Math.PI * r * r : k === 1 ? 2 * Math.PI * r : Math.PI * r * r / 2;
        const q = k === 0 ? `Work out the area of a circle with radius ${r} cm. Give your answer to 1 decimal place. (cm²)` : k === 1 ? `Work out the circumference of a circle with diameter ${2 * r} cm. Give your answer to 1 decimal place. (cm)` : `Work out the area of a semicircle with radius ${r} cm. Give your answer to 1 decimal place. (cm²)`;
        return gfQ(q, fixed(v), 2, k === 0 ? `Area = πr² = π × ${r}² (1 mark) = ${fixed(v)} cm² (1 mark).` : k === 1 ? `Circumference = πd = π × ${2 * r} (1 mark) = ${fixed(v)} cm (1 mark).` : `Half of π × ${r}² (1 mark) = ${fixed(v)} cm² (1 mark).`, { unit: k === 1 ? "cm" : "cm²", accept: near(v), calc: true, label: `circ ${k},${r}`, skill: "circles" }); },
      () => { const a = gfR(2, 9), b = gfR(2, 9), c = gfR(2, 12), k = rand(2);
        return k ? gfQ(`A cuboid measures ${a} cm by ${b} cm by ${c} cm. Work out its volume. (cm³)`, a * b * c, 2, `Volume = length × width × height (1 mark) = ${a} × ${b} × ${c} = ${a * b * c} cm³ (1 mark).`, { unit: "cm³", label: `cub ${a},${b},${c}`, skill: "volume of a cuboid" })
          : gfQ(`A cube has edges of ${a} cm. Work out its total surface area. (cm²)`, 6 * a * a, 2, `One face: ${a} × ${a} = ${a * a} cm² (1 mark). Six faces: ${6 * a * a} cm² (1 mark).`, { unit: "cm²", label: `cube sa ${a}`, skill: "surface area" }); },
      () => { const w = gfR(3, 9), l = gfR(4, 12), per = rand(2);
        return per ? gfQ(`A rectangle has a perimeter of ${2 * (l + w)} cm. Its width is ${w} cm. Work out its length. (cm)`, l, 2, `Two widths: ${2 * w} cm. ${2 * (l + w)} − ${2 * w} = ${2 * l} for two lengths (1 mark). One length: ${l} cm (1 mark).`, { unit: "cm", label: `back p ${l},${w}`, skill: "working backwards from perimeter" })
          : gfQ(`A rectangle has an area of ${l * w} cm². Its width is ${w} cm. Work out its length. (cm)`, l, 2, `Area = length × width, so length = ${l * w} ÷ ${w} (1 mark) = ${l} cm (1 mark).`, { unit: "cm", label: `back a ${l},${w}`, skill: "working backwards from area" }); },
      () => { const s = pick([2, 3, 5]), a = s * gfR(2, 6), b = s * gfR(2, 5), c = s * gfR(1, 4);
        return gfQ(`A box is ${a} cm by ${b} cm by ${c} cm inside. How many cubes with ${s} cm edges fit in the box?`, (a / s) * (b / s) * (c / s), 3, `Along each edge: ${a} ÷ ${s} = ${a / s}, ${b} ÷ ${s} = ${b / s}, ${c} ÷ ${s} = ${c / s} (1 mark). ${a / s} × ${b / s} × ${c / s} (1 mark) = ${(a / s) * (b / s) * (c / s)} (1 mark).`, { ps: true, label: `box ${s},${a},${b},${c}`, skill: "volume problems" }); },
      () => { const w = gfR(3, 6), h = pick([2, 2.5, 3]), cover = pick([4, 5, 6]), area = w * h, tins = Math.ceil(area / cover); if (area % cover === 0) return { label: "skip" };
        return gfQ(`A wall is ${w} m wide and ${h} m high. One tin of paint covers ${cover} m². How many tins are needed to paint the wall once?`, tins, 3, `Area: ${w} × ${h} = ${gfD(area)} m² (1 mark). ${gfD(area)} ÷ ${cover} = ${gfD(area / cover)} (1 mark). Round up: you can't buy part of a tin, so ${tins} (1 mark).`, { ps: true, label: `paint ${w},${h},${cover}`, skill: "area problems" }); }
    ] },
    { id: "gf-probability", n: 13, short: "Probability", title: "Probability", strand: "Data and chance",
      blurb: "Probability as a fraction, events not happening, expected results, relative frequency and two dice.", makers: [
      () => { const r = gfR(1, 8), b = gfR(1, 8), g = gfR(1, 8), t = r + b + g, [c, n] = pick([["red", r], ["blue", b], ["green", g]]);
        return gfQ(`A bag has ${r} red, ${b} blue and ${g} green counters. One is taken at random. What is the probability it is ${c}? Give a fraction.`, `${n}/${t}`, 2, `There are ${t} counters (1 mark), and ${n} ${n === 1 ? "is" : "are"} ${c}: ${n}/${t}${gfF(n, t) !== `${n}/${t}` ? ` (or ${gfF(n, t)})` : ""} (1 mark).`, { accept: [gfF(n, t)], label: `bag ${r},${b},${g},${c}`, skill: "probability as a fraction" }); },
      () => { const p = gfR(5, 95);
        return gfQ(`The probability that a bus is late is ${gfD(p / 100)}. What is the probability that it is not late?`, gfD(1 - p / 100), 1, `Probabilities add up to 1: 1 − ${gfD(p / 100)} = ${gfD(1 - p / 100)} (1 mark).`, { label: `not ${p}`, skill: "probability of not happening" }); },
      () => { let ps; do ps = [gfR(5, 40), gfR(5, 40), gfR(5, 40)]; while (100 - ps[0] - ps[1] - ps[2] < 5); const x = 100 - ps.reduce((s, v) => s + v, 0);
        return gfQ(`A spinner can land on A, B, C or D. P(A) = ${gfD(ps[0] / 100)}, P(B) = ${gfD(ps[1] / 100)}, P(C) = ${gfD(ps[2] / 100)}. Work out P(D).`, gfD(x / 100), 2, `They add up to 1: ${gfD(ps[0] / 100)} + ${gfD(ps[1] / 100)} + ${gfD(ps[2] / 100)} = ${gfD((100 - x) / 100)} (1 mark). 1 − ${gfD((100 - x) / 100)} = ${gfD(x / 100)} (1 mark).`, { label: `table ${ps}`, skill: "probabilities add to 1" }); },
      () => { const [p, ps] = pick([[0.3, "0.3"], [0.25, "1/4"], [0.2, "0.2"], [0.1, "0.1"], [0.4, "0.4"], [0.125, "1/8"], [0.6, "0.6"]]), n = pick([40, 80, 120, 200, 400, 160]), e = p * n; if (!Number.isInteger(e)) return { label: "skip" };
        return gfQ(`The probability that a spinner lands on red is ${ps}. It is spun ${n} times. How many times would you expect it to land on red?`, e, 2, `Expected number = probability × number of trials (1 mark): ${ps} × ${n} = ${e} (1 mark).`, { label: `exp ${ps},${n}`, skill: "expected results" }); },
      () => { const n = pick([20, 40, 50, 80, 100, 120, 200]), k = gfR(2, n - 2), f = gfF(k, n);
        return gfQ(`A drawing pin is dropped ${n} times. It lands point up ${k} times. Estimate the probability that it lands point up next time. Give a fraction.`, `${k}/${n}`, 2, `Relative frequency = times it happened ÷ number of trials (1 mark): ${k}/${n}${f !== `${k}/${n}` ? ` = ${f}` : ""} (1 mark).`, { accept: [f, gfD(k / n)], label: `rf ${k},${n}`, skill: "relative frequency" }); },
      () => { const s = gfR(3, 11), w = 6 - Math.abs(s - 7), f = gfF(w, 36);
        return gfQ(`Two fair six-sided dice are rolled and the scores are added. What is the probability of a total of ${s}? Give a fraction.`, f, 2, `There are 36 equally likely outcomes. A total of ${s} happens ${w} ways: ${range(1, 6).filter(a => s - a >= 1 && s - a <= 6).map(a => `${a}+${s - a}`).join(", ")} (1 mark). ${w}/36${f !== `${w}/36` ? ` = ${f}` : ""} (1 mark).`, { accept: [`${w}/36`], label: `dice ${s}`, skill: "two dice" }); },
      () => { const [p, ans, others] = pick([["0", "Impossible", ["Unlikely", "Even chance"]], ["0.5", "Even chance", ["Likely", "Unlikely"]], ["1", "Certain", ["Likely", "Even chance"]], ["0.9", "Likely", ["Certain", "Even chance"]], ["0.1", "Unlikely", ["Impossible", "Even chance"]]]);
        return gfQ(`An event has a probability of ${p}. Which word describes it best?`, ans, 1, `On the scale from 0 (impossible) to 1 (certain), ${p} is ${ans.toLowerCase()} (1 mark).`, { options: others, label: `scale ${p}`, skill: "the probability scale" }); },
      () => { const [what, n, list] = pick([["two coins are thrown", 4, "HH, HT, TH, TT"], ["three coins are thrown", 8, "HHH, HHT, HTH, THH, HTT, THT, TTH, TTT"], ["a coin is thrown and a six-sided dice is rolled", 12, "H1 to H6 and T1 to T6"], ["two four-sided spinners (1 to 4) are spun", 16, "4 × 4 pairs"]]);
        return gfQ(`How many possible outcomes are there when ${what}?`, n, 1, `List them in order so none is missed: ${list}. That is ${n} (1 mark).`, { label: `outcomes ${n}`, skill: "listing outcomes" }); }
    ] },
    { id: "gf-statistics", n: 14, short: "Statistics", title: "Averages and charts", strand: "Data and chance",
      blurb: "Mean, median, mode and range, finding a missing value, frequency tables, pie charts and correlation.", makers: [
      () => { const xs = range(1, 4).map(() => gfR(2, 30)), s = xs.reduce((t, v) => t + v, 0), last = 5 - (s % 5) + gfR(0, 3) * 5, all = shuffle(xs.concat(last)), m = (s + last) / 5;
        return gfQ(`Work out the mean of ${all.join(", ")}.`, m, 2, `Add them: ${s + last} (1 mark). Divide by how many there are: ${s + last} ÷ 5 = ${m} (1 mark).`, { label: `mean ${all}`, skill: "the mean" }); },
      () => { const n = pick([5, 7, 6]), xs = range(1, n).map(() => gfR(1, 40)), sorted = xs.slice().sort((a, b) => a - b), med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        return gfQ(`Find the median of ${xs.join(", ")}.`, gfD(med), n % 2 ? 1 : 2, `Put them in order: ${sorted.join(", ")}${n % 2 ? "" : " (1 mark)"}. The middle ${n % 2 ? "one" : `is halfway between ${sorted[n / 2 - 1]} and ${sorted[n / 2]}`}: ${gfD(med)} (1 mark). Not ordering them first is the usual mistake.`, { label: `med ${xs}`, skill: "the median" }); },
      () => { const m = gfR(1, 15), others = shuffle(range(1, 20).filter(v => v !== m)).slice(0, 4), xs = shuffle(others.concat([m, m, m].slice(0, 2 + rand(2))));
        return gfQ(`Write down the mode of ${xs.join(", ")}.`, m, 1, `The mode is the most common value: ${m} (1 mark).`, { label: `mode ${xs}`, skill: "the mode" }); },
      () => { const xs = range(1, 6).map(() => gfR(3, 60)), r = Math.max(...xs) - Math.min(...xs);
        return gfQ(`Work out the range of ${xs.join(", ")}.`, r, 1, `Largest − smallest: ${Math.max(...xs)} − ${Math.min(...xs)} = ${r} (1 mark).`, { label: `range ${xs}`, skill: "the range" }); },
      () => { const n = gfR(4, 6), m = gfR(8, 20), given = range(1, n - 1).map(() => gfR(m - 6, m + 6)), x = m * n - given.reduce((t, v) => t + v, 0); if (x < 1) return { label: "skip" };
        return gfQ(`The mean of ${n} numbers is ${m}. ${n - 1} of the numbers are ${given.join(", ")}. Work out the other number.`, x, 3, `The total must be ${n} × ${m} = ${m * n} (1 mark). The ${n - 1} numbers add up to ${m * n - x} (1 mark). ${m * n} − ${m * n - x} = ${x} (1 mark).`, { ps: true, label: `miss ${n},${m},${given}`, skill: "working backwards from the mean" }); },
      () => { const f = range(0, 3).map(() => gfR(1, 9)), total = f.reduce((t, v, i) => t + v * i, 0), k = rand(2);
        return gfQ(`A football team's goals per match: 0 goals in ${f[0]} matches, 1 goal in ${f[1]}, 2 goals in ${f[2]} and 3 goals in ${f[3]}. ${k ? "How many goals did they score altogether?" : "How many matches did they play?"}`, k ? total : f.reduce((t, v) => t + v, 0), 2, k ? `Multiply each number of goals by its frequency: 0 × ${f[0]} + 1 × ${f[1]} + 2 × ${f[2]} + 3 × ${f[3]} (1 mark) = ${total} (1 mark).` : `Add the frequencies (1 mark): ${f.join(" + ")} = ${f.reduce((t, v) => t + v, 0)} (1 mark).`, { label: `freq ${f},${k}`, skill: "frequency tables" }); },
      () => { const t = pick([36, 60, 90, 120, 180, 72, 30, 45]), each = 360 / t, c = gfR(2, t - 2), what = pick(["chose tea", "walk to work", "chose football", "came by bus"]);
        return gfQ(`${t} people were asked a question, and ${c} ${what}. They are shown on a pie chart. Work out the angle for "${what}". (°)`, c * each, 2, `360 ÷ ${t} = ${gfD(each)}° for each person (1 mark). ${c} × ${gfD(each)} = ${gfD(c * each)}° (1 mark).`, { unit: "°", label: `pie ${t},${c}`, skill: "pie charts" }); },
      () => { const [say, ans] = pick([["As the temperature goes up, more ice creams are sold.", "Positive correlation"], ["As a car gets older, it is worth less.", "Negative correlation"], ["Shoe size and score in a maths test.", "No correlation"], ["The more hours of revision, the higher the test mark.", "Positive correlation"], ["The higher up a mountain, the colder it is.", "Negative correlation"]]);
        return gfQ(`What kind of correlation would a scatter graph show? ${say}`, ans, 1, `${ans} (1 mark). Positive: both go up together. Negative: one goes up as the other goes down.`, { options: ["Positive correlation", "Negative correlation", "No correlation"].filter(o => o !== ans), label: `corr ${say.slice(0, 12)}`, skill: "correlation" }); }
    ] }
  ];

  /* ---------- GCSE maths exam climb, stage 2: grades 4 and 5 (Foundation and Higher crossover) ---------- */
  // The topics where the Foundation and Higher papers overlap: what lifts a 3 to a 4 (a standard pass) and a
  // 5 (a strong pass). Same shape as stage 1: each question has its marks and a mark scheme.
  // An algebraic expression from [coefficient, letter part] pairs: [[1, "x²"], [-5, "x"], [6, ""]] is x² − 5x + 6
  const gxE = terms => {
    let out = "";
    for (const [c, v] of terms) {
      if (!c) continue;
      const a = Math.abs(c), body = a === 1 && v ? v : `${gfD(a)}${v}`;
      out += out ? ` ${c < 0 ? "−" : "+"} ${body}` : `${c < 0 ? "−" : ""}${body}`;
    }
    return out || "0";
  };
  // A bracket (px + q)
  const gxB = (p, q, v = "x") => `(${gxE([[p, v], [q, ""]])})`;
  // Standard form: 4.5 × 10⁴
  const gxOrd = n => `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th"}`;
  const gxSF = (m, e) => `${gfD(m)} × 10${sup(e)}`;
  // Fractions a pupil may write either way: 6/8 or 3/4
  const gxFr = (n, d) => { const s = gfF(n, d); return s === `${n}/${d}` ? [] : [`${n}/${d}`]; };
  // A right-angled triangle with its sides labelled (labels: [base, height, slope]; an angle at the base's far end)
  const gxTri = (base, height, slope, angle = "") => {
    const t = (x, y, s, a = "middle") => s ? `<text x="${x}" y="${y}" font-size="13" text-anchor="${a}" fill="#0f172a">${s}</text>` : "";
    return `<svg class="q-pic" viewBox="0 0 230 150" width="230" height="150" role="img" aria-label="A right-angled triangle">
      <polygon points="30,125 190,125 30,20" fill="#e0ecfa" stroke="#2563A6" stroke-width="2.5"/><polyline points="30,113 42,113 42,125" fill="none" stroke="#2563A6" stroke-width="1.5"/>
      ${t(110, 143, base)}${t(24, 77, height, "end")}${t(120, 64, slope, "start")}${angle ? `<path d="M168,125 A22,22 0 0 0 172,113" fill="none" stroke="#c2410c" stroke-width="2"/>${t(160, 119, angle, "end")}` : ""}</svg>`;
  };
  const G5 = [
    { id: "g5-indices", n: 1, short: "Indices", title: "Index laws and standard form", strand: "Number",
      blurb: "Multiplying and dividing powers, powers of powers, and numbers in standard form.", makers: [
      () => { let m, n; do { m = gfR(2, 7); n = gfR(2, 7); } while (m * n === m + n); const v = pick(["x", "a", "y"]), ans = `${v}${sup(m + n)}`;
        return gfQ(`Simplify ${v}${sup(m)} × ${v}${sup(n)}.`, ans, 1, `Multiplying: add the powers, ${m} + ${n} = ${m + n}, so ${ans} (1 mark).`, { options: [`${v}${sup(m * n)}`, `${2}${v}${sup(m + n)}`], label: `${v}${m}x${n}`, skill: "index laws" }); },
      () => { let m, n; do { m = gfR(2, 6); n = gfR(2, 5); } while (m * n === m + n); const ans = `x${sup(m * n)}`;
        return gfQ(`Simplify (x${sup(m)})${sup(n)}.`, ans, 1, `A power of a power: multiply the powers, ${m} × ${n} = ${m * n}, so ${ans} (1 mark).`, { options: [`x${sup(m + n)}`, `${n}x${sup(m)}`], label: `(x${m})${n}`, skill: "index laws" }); },
      () => { let a, b, m, n; do { a = gfR(2, 6); b = gfR(2, 6); m = gfR(2, 6); n = gfR(2, 6); } while (a + b === a * b || m + n === m * n); const ans = `${a * b}x${sup(m + n)}`;
        return gfQ(`Simplify ${a}x${sup(m)} × ${b}x${sup(n)}.`, ans, 2, `Multiply the numbers: ${a} × ${b} = ${a * b} (1 mark). Add the powers: x${sup(m + n)} (1 mark).`, { options: [`${a + b}x${sup(m + n)}`, `${a * b}x${sup(m * n)}`].filter(o => o !== ans), label: `${a}x${m}*${b}x${n}`, skill: "index laws" }); },
      () => { const b = pick([2, 3, 5, 10]), p = gfR(4, 8), q = gfR(2, 5), r = p + q - gfR(1, b === 10 ? 2 : 3), e = p + q - r;
        return gfQ(`Work out the value of ${b}${sup(p)} × ${b}${sup(q)} ÷ ${b}${sup(r)}.`, b ** e, 2, `Add, then subtract the powers: ${b}${sup(p + q - r)} (1 mark) = ${gfBig(b ** e)} (1 mark).`, { label: `${b}^${p}+${q}-${r}`, skill: "index laws" }); },
      () => { const m = gfR(11, 99) / 10, e = gfR(3, 7), n = Math.round(m * 10 ** e), ans = gxSF(m, e);
        return gfQ(`Write ${gfBig(n)} in standard form.`, ans, 1, `A number from 1 to 10 times a power of 10: ${ans} (1 mark).`, { options: [`${Math.round(m * 10)} × 10${sup(e - 1)}`, gxSF(m, e + 1)], label: `sf ${n}`, skill: "standard form" }); },
      () => { const m = gfR(11, 99) / 10, e = gfR(2, 4), v = (m / 10 ** e).toFixed(e + 1).replace(/0+$/, "");
        return gfQ(`Write ${gxSF(m, -e)} as an ordinary number.`, v, 1, `Move the digits ${e} places to the right (the number gets smaller): ${v} (1 mark).`, { label: `sf ${m}e-${e}`, skill: "standard form" }); },
      () => { const a = gfR(2, 9), b = gfR(2, 9), p = gfR(2, 6), q = gfR(2, 6), prod = a * b, big = prod >= 10, ans = gxSF(big ? prod / 10 : prod, p + q + (big ? 1 : 0));
        return gfQ(`Work out (${a} × 10${sup(p)}) × (${b} × 10${sup(q)}). Give your answer in standard form.`, ans, 2, `${a} × ${b} = ${prod} and 10${sup(p)} × 10${sup(q)} = 10${sup(p + q)} (1 mark). ${big ? `${prod} × 10${sup(p + q)} is not standard form, so ` : ""}${ans} (1 mark).`, { options: [big ? `${prod} × 10${sup(p + q)}` : gxSF(prod, p * q), gxSF(big ? prod / 10 : prod, p * q === p + q ? p + q + 2 : p * q)].filter((o, i, l) => o !== ans && l.indexOf(o) === i), label: `${a}e${p}*${b}e${q}`, skill: "standard form" }); },
      () => { const b = gfR(2, 9), a = b * gfR(2, 4), p = gfR(6, 9), q = gfR(2, 4), ans = gxSF(a / b, p - q);
        return gfQ(`Work out (${a} × 10${sup(p)}) ÷ (${b} × 10${sup(q)}). Give your answer in standard form.`, ans, 2, `${a} ÷ ${b} = ${a / b} and 10${sup(p)} ÷ 10${sup(q)} = 10${sup(p - q)} (1 mark). ${ans} (1 mark).`, { options: [gxSF(a / b, p + q), gxSF(a - b, p - q)].filter(o => o !== ans), label: `${a}e${p}/${b}e${q}`, skill: "standard form" }); }
    ] },
    { id: "g5-growth", n: 2, short: "Percentage change", title: "Percentage change, reverse percentages and interest", strand: "Fractions, decimals and percentages",
      blurb: "Multipliers, percentage increase and decrease, finding the original amount, compound interest and depreciation.", makers: [
      () => { const p = gfR(80, 480) * 5, r = pick([3, 4, 6, 12, 15, 17.5, 8]), up = rand(2), m = up ? 1 + r / 100 : 1 - r / 100, v = p * m;
        return gfQ(`${up ? "Increase" : "Decrease"} £${p} by ${r}%. (£)`, gfP(v), 2, `The multiplier is ${up ? "1 + " : "1 − "}${gfD(r / 100)} = ${gfD(m)} (1 mark). £${p} × ${gfD(m)} = £${gfP(v)} (1 mark).`, { unit: "£", calc: true, label: `${up ? "inc" : "dec"} ${p} ${r}`, skill: "percentage multipliers" }); },
      () => { const old = gfR(4, 30) * 20, p = pick([5, 10, 15, 20, 25, 30, 35, 40, 45]), up = rand(2), nw = up ? old * (1 + p / 100) : old * (1 - p / 100), what = pick(["house", "car", "bike", "season ticket"]);
        return gfQ(`The price of a ${what} changed from £${old} to £${gfP(nw)}. Work out the percentage ${up ? "increase" : "decrease"}. (%)`, p, 2, `The change is £${gfP(Math.abs(nw - old))} (1 mark). £${gfP(Math.abs(nw - old))} ÷ £${old} × 100 = ${p}% (1 mark). Divide by the original price, not the new one.`, { unit: "%", calc: true, label: `pc ${old} ${p}`, skill: "percentage change" }); },
      () => { const p = pick([10, 20, 25, 5, 15, 30]), o = gfR(3, 40) * 20, up = rand(2), now = o * (up ? 1 + p / 100 : 1 - p / 100);
        return gfQ(`In a sale, prices are ${up ? "increased" : "reduced"} by ${p}%. A coat now costs £${gfP(now)}. What was the price before the ${up ? "increase" : "sale"}? (£)`, o, 3, `£${gfP(now)} is ${up ? 100 + p : 100 - p}% of the old price (1 mark). 1% is £${gfP(now)} ÷ ${up ? 100 + p : 100 - p} (1 mark). 100% is £${o} (1 mark). Taking ${p}% of £${gfP(now)} is the usual mistake.`, { unit: "£", calc: true, ps: true, label: `rev ${o} ${p} ${up}`, skill: "reverse percentages" }); },
      () => { const p = gfR(5, 40) * 100, r = pick([2, 3, 4, 5, 2.5, 3.5]), n = gfR(2, 5), v = Math.round(p * (1 + r / 100) ** n * 100) / 100;
        return gfQ(`£${gfBig(p)} is invested at ${r}% compound interest a year. How much is it worth after ${n} years? (£)`, gfP(v), 3, `The multiplier is ${gfD(1 + r / 100)} (1 mark). £${gfBig(p)} × ${gfD(1 + r / 100)}${sup(n)} (1 mark) = £${gfP(v)} to the nearest penny (1 mark).`, { unit: "£", calc: true, label: `ci ${p} ${r} ${n}`, skill: "compound interest" }); },
      () => { const p = gfR(8, 30) * 1000, r = pick([10, 12, 15, 20, 25]), n = gfR(2, 4), v = Math.round(p * (1 - r / 100) ** n * 100) / 100;
        return gfQ(`A car costs £${gfBig(p)}. Its value goes down by ${r}% each year. What is it worth after ${n} years? (£)`, gfP(v), 3, `The multiplier is 1 − ${gfD(r / 100)} = ${gfD(1 - r / 100)} (1 mark). £${gfBig(p)} × ${gfD(1 - r / 100)}${sup(n)} (1 mark) = £${gfP(v)} (1 mark).`, { unit: "£", calc: true, label: `dep ${p} ${r} ${n}`, skill: "depreciation" }); },
      () => { const [a, b] = pick([[20, 10], [10, 10], [20, 20], [30, 10], [25, 20], [50, 10], [40, 25], [10, 5]]), tot = gfD(100 - (100 - a) * (100 - b) / 100);
        return gfQ(`A shop takes ${a}% off a price, then a further ${b}% off the new price. What is the total percentage taken off? (%)`, tot, 3, `Multipliers ${gfD(1 - a / 100)} and ${gfD(1 - b / 100)} (1 mark). ${gfD(1 - a / 100)} × ${gfD(1 - b / 100)} = ${gfD((1 - a / 100) * (1 - b / 100))} (1 mark), so ${tot}% off, not ${a + b}% (1 mark).`, { unit: "%", calc: true, ps: true, label: `two ${a} ${b}`, skill: "repeated percentage change" }); },
      () => { const r = pick([2, 3, 4, 5]), p = gfR(2, 20) * 500, n = gfR(2, 4), simple = p * r / 100 * n, comp = Math.round(p * ((1 + r / 100) ** n - 1) * 100) / 100;
        return gfQ(`Sam invests £${gfBig(p)} for ${n} years at ${r}% a year. How much more interest does compound interest give than simple interest? (£)`, gfP(comp - simple), 3, `Simple: ${n} × ${r}% of £${gfBig(p)} = £${gfP(simple)} (1 mark). Compound: £${gfBig(p)} × ${gfD(1 + r / 100)}${sup(n)} − £${gfBig(p)} = £${gfP(comp)} (1 mark). Difference £${gfP(comp - simple)} (1 mark).`, { unit: "£", calc: true, ps: true, label: `svc ${p} ${r} ${n}`, skill: "compound interest" }); }
    ] },
    { id: "g5-proportion", n: 3, short: "Ratio problems", title: "Ratio problems and proportion", strand: "Number",
      blurb: "Sharing in three-part ratios, ratio differences, combining ratios, ratio to fractions, and direct and inverse proportion.", makers: [
      () => { const [a, b, c] = [gfR(1, 5), gfR(1, 6), gfR(2, 7)], k = gfR(3, 20), tot = (a + b + c) * k, who = shuffle(["Ali", "Bea", "Cal"]);
        return gfQ(`${who.join(", ").replace(/, (\w+)$/, " and $1")} share £${tot} in the ratio ${a} : ${b} : ${c}. How much does ${who[2]} get? (£)`, c * k, 2, `${a + b + c} parts, so one part is £${tot} ÷ ${a + b + c} = £${k} (1 mark). ${who[2]} gets ${c} × £${k} = £${c * k} (1 mark).`, { unit: "£", label: `share ${a}${b}${c} ${tot}`, skill: "sharing in a ratio" }); },
      () => { let a, b; do { a = gfR(2, 7); b = gfR(3, 9); } while (a >= b || gcd(a, b) !== 1); const k = gfR(3, 12), what = pick(["marbles", "stickers", "cards", "sweets"]);
        return gfQ(`Jo and Lee share some ${what} in the ratio ${a} : ${b}. Lee gets ${(b - a) * k} more than Jo. How many ${what} are there altogether?`, (a + b) * k, 3, `The difference is ${b} − ${a} = ${b - a} parts (1 mark). One part is ${(b - a) * k} ÷ ${b - a} = ${k} (1 mark). Altogether ${a + b} × ${k} = ${(a + b) * k} (1 mark).`, { ps: true, label: `diff ${a}:${b} ${k}`, skill: "ratio problems" }); },
      () => { let a, b; do { a = gfR(1, 7); b = gfR(1, 9); } while (gcd(a, b) !== 1); const ans = gfF(b, a + b);
        return gfQ(`In a club the ratio of adults to children is ${a} : ${b}. What fraction of the club are children?`, ans, 1, `${a} + ${b} = ${a + b} parts, and ${b} of them are children: ${ans} (1 mark).`, { options: [`${a}/${a + b}`, a > 1 ? `${b}/${a}` : `${a}/${b}`].filter((o, i, l) => o !== ans && l.indexOf(o) === i), label: `frac ${a}:${b}`, skill: "ratio and fractions" }); },
      () => { const [a, b, c, d] = pick([[2, 3, 4, 5], [3, 4, 2, 5], [1, 2, 3, 4], [2, 5, 3, 7], [3, 2, 4, 3], [4, 3, 2, 5], [5, 2, 4, 3], [2, 3, 6, 5]]), l = b * c / gcd(b, c), ans = `${a * l / b}:${l}:${d * l / c}`;
        return gfQ(`A : B = ${a} : ${b} and B : C = ${c} : ${d}. Write A : B : C in its simplest form, using whole numbers.`, ans, 2, `Make the B parts the same: ${l} (1 mark). A : B : C = ${ans.replace(/:/g, " : ")} (1 mark).`, { accept: [ans.replace(/:/g, " : ")], label: `abc ${a}${b}${c}${d}`, skill: "combining ratios" }); },
      () => { const w = gfR(2, 8), d = w * gfR(2, 6) * gfR(1, 3), ms = range(2, 12).filter(x => x !== w && (w * d) % x === 0); if (!ms.length) return { label: "skip" }; const m = pick(ms);
        return gfQ(`${w} builders take ${d} days to build a wall. How long would ${m} builders take, working at the same rate? (days)`, w * d / m, 2, `One builder would take ${w} × ${d} = ${w * d} days (1 mark). ${m} builders take ${w * d} ÷ ${m} = ${w * d / m} days (1 mark). More builders means fewer days: this is inverse proportion.`, { ps: true, label: `inv ${w} ${d} ${m}`, skill: "inverse proportion" }); },
      () => { const r = pick([1.12, 1.15, 1.18, 1.2, 1.16]), e = gfR(4, 40) * 10, ans = gfP(e / r);
        return gfQ(`£1 = €${r.toFixed(2)}. A hotel room costs €${e}. How much is that in pounds? (£)`, ans, 2, `Pounds to euros is × ${r.toFixed(2)}, so euros to pounds is ÷ ${r.toFixed(2)} (1 mark). €${e} ÷ ${r.toFixed(2)} = £${ans} (1 mark).`, { unit: "£", calc: true, label: `fx ${r} ${e}`, skill: "exchange rates" }); },
      () => { let a, b; do { a = gfR(2, 7); b = gfR(2, 9); } while (gcd(a, b) !== 1 || a === b); const k = gfR(2, 9) / (rand(2) ? 2 : 1), red = a * k, white = b * k;
        return gfQ(`Pink paint is red and white mixed in the ratio ${a} : ${b}. Kit uses ${gfD(red)} litres of red. How many litres of white does Kit need? (litres)`, gfD(white), 2, `${gfD(red)} ÷ ${a} = ${gfD(k)} litres for each part (1 mark). ${b} × ${gfD(k)} = ${gfD(white)} litres (1 mark).`, { unit: "litres", label: `paint ${a}:${b} ${red}`, skill: "using a ratio" }); }
    ] },
    { id: "g5-brackets", n: 4, short: "Brackets", title: "Expanding and factorising", strand: "Patterns and missing numbers",
      blurb: "Double brackets, squaring a bracket, factorising fully, factorising quadratics and the difference of two squares.", makers: [
      () => { let a, b; do { a = gfR(-7, 7); b = gfR(-7, 7); } while (!a || !b || a + b === 0); const ans = gxE([[1, "x²"], [a + b, "x"], [a * b, ""]]);
        return gfQ(`Expand and simplify ${gxB(1, a)}${gxB(1, b)}.`, ans, 2, `Four terms: ${gxE([[1, "x²"], [a, "x"], [b, "x"], [a * b, ""]])} (1 mark). Collect the x terms: ${ans} (1 mark).`, { options: [gxE([[1, "x²"], [a * b, ""]]), gxE([[1, "x²"], [a + b, "x"], [-a * b, ""]]), gxE([[1, "x²"], [a * b, "x"], [a + b, ""]])].filter((o, i, l) => o !== ans && l.indexOf(o) === i).slice(0, 2), label: `exp ${a},${b}`, skill: "expanding double brackets" }); },
      () => { let a, b; do { a = gfR(-8, 8); b = gfR(-8, 8); } while (!a || !b || a + b === 0 || a === b || a === -b); const q = gxE([[1, "x²"], [a + b, "x"], [a * b, ""]]), ans = `${gxB(1, a)}${gxB(1, b)}`;
        return gfQ(`Factorise ${q}.`, ans, 2, `Two numbers that multiply to ${gfM(a * b)} and add to ${gfM(a + b)}: ${gfM(a)} and ${gfM(b)} (1 mark). ${ans} (1 mark).`, { options: [`${gxB(1, -a)}${gxB(1, -b)}`, `${gxB(1, a * b)}${gxB(1, 1)}`].filter((o, i, l) => o !== ans && l.indexOf(o) === i), label: `fact ${a},${b}`, skill: "factorising quadratics" }); },
      () => { const g = gfR(2, 6), p = gfR(2, 5), q = gfR(1, 7); if (gcd(p, q) !== 1) return { label: "skip" }; const ans = `${g}x(${p}x + ${q})`;
        return gfQ(`Factorise fully ${g * p}x² + ${g * q}x.`, ans, 2, `Take out the common factor ${g}x (1 mark): ${ans} (1 mark). Taking out only ${g} or only x is not "fully".`, { options: [`${g}(${p}x² + ${q}x)`, `x(${g * p}x + ${g * q})`], label: `ff ${g},${p},${q}`, skill: "factorising fully" }); },
      () => { const a = gfR(2, 6), b = gfR(1, 9), c = gfR(2, 5), d = gfR(1, 9), k = rand(2) ? 1 : -1, ans = gxE([[a * 2 - c * k, "x"], [-a * b + c * d * k, ""]]);
        if (a * 2 - c * k === 0 || -a * b + c * d * k === 0) return { label: "skip" };
        return gfQ(`Expand and simplify ${a}(2x − ${b}) ${k > 0 ? "−" : "+"} ${c}(x − ${d}).`, ans, 2, `${a * 2}x − ${a * b} ${k > 0 ? `− ${c}x + ${c * d}` : `+ ${c}x − ${c * d}`} (1 mark): watch the sign in front of the second bracket. ${ans} (1 mark).`, { options: [gxE([[a * 2 - c * k, "x"], [-a * b - c * d * k, ""]]), gxE([[a * 2 + c * k, "x"], [-a * b + c * d * k, ""]])].filter((o, i, l) => o !== ans && l.indexOf(o) === i), label: `exs ${a}${b}${c}${d}${k}`, skill: "expanding brackets" }); },
      () => { const a = gfR(2, 12), ans = `(x + ${a})(x − ${a})`;
        return gfQ(`Factorise x² − ${a * a}.`, ans, 1, `The difference of two squares: x² − ${a}² = ${ans} (1 mark).`, { options: [`(x − ${a})²`, `(x + ${a})²`], label: `dots ${a}`, skill: "difference of two squares" }); },
      () => { const a = gfR(-9, 9) || 4, ans = gxE([[1, "x²"], [2 * a, "x"], [a * a, ""]]);
        return gfQ(`Expand and simplify ${gxB(1, a)}².`, ans, 2, `Write it as ${gxB(1, a)}${gxB(1, a)} (1 mark). ${ans} (1 mark). x² + ${a * a} misses the middle term.`, { options: [gxE([[1, "x²"], [a * a, ""]]), gxE([[1, "x²"], [a, "x"], [a * a, ""]])], label: `sq ${a}`, skill: "squaring a bracket" }); },
      () => { let a, b; do { a = gfR(-6, 6); b = gfR(-6, 6); } while (!a || !b || a === b); const q = gxE([[1, "x²"], [-(a + b), "x"], [a * b, ""]]), ans = `x = ${gfM(a)} or x = ${gfM(b)}`;
        return gfQ(`Solve ${q} = 0.`, ans, 3, `Factorise: ${gxB(1, -a)}${gxB(1, -b)} = 0 (1 mark). One bracket must be 0 (1 mark): ${ans} (1 mark).`, { options: [[-a, -b], [a + b, a * b], [a * b, 1], [a, -b]].filter((pr, i, l) => [pr[0], pr[1]].sort().join() !== [a, b].sort().join() && l.findIndex(q => q.slice().sort().join() === pr.slice().sort().join()) === i && pr[0] !== pr[1]).slice(0, 2).map(([u, w]) => `x = ${gfM(u)} or x = ${gfM(w)}`), label: `solveq ${a},${b}`, skill: "solving quadratics" }); }
    ] },
    { id: "g5-solving", n: 5, short: "Equations", title: "Harder equations, simultaneous equations and formulae", strand: "Patterns and missing numbers",
      blurb: "Equations with brackets and fractions, forming equations, simultaneous equations, inequalities and changing the subject.", makers: [
      () => { const a = gfR(2, 7), x = gfR(-6, 12), b = gfR(-9, 9) || 3;
        return gfQ(`Solve ${a}${gxB(1, b)} = ${gfM(a * (x + b))}.`, gfM(x), 2, `Expand: ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(a * b)} = ${gfM(a * (x + b))}, or divide both sides by ${a} first (1 mark). x = ${gfM(x)} (1 mark).`, { label: `br ${a},${b},${x}`, skill: "equations with brackets" }); },
      () => { const d = gfR(2, 6), x = gfR(-5, 20), a = gfR(1, 9); if ((x + a) % d) return { label: "skip" };
        return gfQ(`Solve (x + ${a}) ÷ ${d} = ${gfM((x + a) / d)}.`, gfM(x), 2, `Multiply both sides by ${d}: x + ${a} = ${gfM(x + a)} (1 mark). x = ${gfM(x)} (1 mark).`, { label: `frac ${d},${a},${x}`, skill: "equations with fractions" }); },
      () => { let a, b, d, e, x, y; do { a = gfR(1, 5); b = gfR(1, 5); d = gfR(1, 5); e = gfR(-5, 5); x = gfR(-4, 6); y = gfR(-4, 6); } while (!e || a * e - b * d === 0 || (!x && !y));
        const ans = `x = ${gfM(x)}, y = ${gfM(y)}`, eq = (p, q, r) => `${gxE([[p, "x"], [q, "y"]])} = ${gfM(r)}`;
        return gfQ(`Solve the simultaneous equations ${eq(a, b, a * x + b * y)} and ${eq(d, e, d * x + e * y)}.`, ans, 3, `Make the x or y numbers match and add or subtract to get rid of one letter (1 mark). Solve for one letter (1 mark). Substitute back for the other: ${ans} (1 mark).`, { options: [`x = ${gfM(y)}, y = ${gfM(x)}`, `x = ${gfM(x)}, y = ${gfM(-y)}`, `x = ${gfM(-x)}, y = ${gfM(y)}`, `x = ${gfM(x + 1)}, y = ${gfM(y - 1)}`].filter((o, i, l) => o !== ans && l.indexOf(o) === i).slice(0, 2), ps: true, label: `sim ${a}${b}${d}${e}${x}${y}`, skill: "simultaneous equations" }); },
      () => { const a = gfR(2, 9), b = gfR(1, 12), v = pick(["y", "P", "T"]), ans = `x = (${v} − ${b}) ÷ ${a}`;
        return gfQ(`Make x the subject of ${v} = ${a}x + ${b}.`, ans, 2, `Subtract ${b} from both sides: ${v} − ${b} = ${a}x (1 mark). Divide by ${a}: ${ans} (1 mark).`, { options: [`x = ${v} ÷ ${a} − ${b}`, `x = (${v} + ${b}) ÷ ${a}`], label: `subj ${a},${b},${v}`, skill: "changing the subject" }); },
      () => { const a = gfR(2, 6), k = gfR(-4, 8), b = gfR(-9, 9) || 5, s = pick(["<", ">", "≤", "≥"]), ans = `x ${s} ${gfM(k)}`, flip = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" }[s];
        return gfQ(`Solve ${gxE([[a, "x"], [b, ""]])} ${s} ${gfM(a * k + b)}.`, ans, 2, `${b < 0 ? "Add" : "Subtract"} ${Math.abs(b)}: ${a}x ${s} ${gfM(a * k)} (1 mark). Divide by ${a}: ${ans} (1 mark).`, { options: [`x ${flip} ${gfM(k)}`, `x ${s} ${gfM(a * k + b)}`].filter(o => o !== ans), label: `ineq ${a},${k},${b},${s}`, skill: "inequalities" }); },
      () => { const x = gfR(12, 40), k = gfR(2, 3), c = 180 - (k + 2) * x; if (c <= -x + 5 || c === 0 || Math.abs(c) > 60) return { label: "skip" };
        const q = `The angles of a triangle are x°, ${k}x° and (x ${c < 0 ? "−" : "+"} ${Math.abs(c)})°. Work out the value of x.`;
        return gfQ(q, x, 3, `The angles add up to 180°: x + ${k}x + x ${c < 0 ? "−" : "+"} ${Math.abs(c)} = 180 (1 mark). ${k + 2}x = ${180 - c} (1 mark). x = ${x} (1 mark).`, { ps: true, label: `tri ${x},${k},${c}`, skill: "forming equations" }); },
      () => { const n = gfR(-3, 2), m = n + gfR(3, 5), list = range(n + 1, m).map(gfM).join(", "), ans = list;
        return gfQ(`List the integers n where ${gfM(n)} < n ≤ ${gfM(m)}.`, ans, 2, `< means ${gfM(n)} is not included; ≤ means ${gfM(m)} is (1 mark). ${list} (1 mark).`, { options: [range(n, m).map(gfM).join(", "), range(n + 1, m - 1).map(gfM).join(", ")], label: `ints ${n},${m}`, skill: "inequalities" }); }
    ] },
    { id: "g5-sequences", n: 6, short: "Sequences", title: "Sequences and the nth term", strand: "Patterns and missing numbers",
      blurb: "The nth term of a linear sequence, using it, checking whether a number is in a sequence, and geometric sequences.", makers: [
      () => { const d = gfR(-6, 9) || 4, c = gfR(-8, 10), terms = range(1, 5).map(n => d * n + c).map(gfM).join(", "), ans = gxE([[d, "n"], [c, ""]]);
        return gfQ(`Find the nth term of the sequence ${terms}, …`, ans, 2, `The terms go up by ${gfM(d)} each time, so ${gxE([[d, "n"]])} (1 mark). The zero term is ${gfM(c)}: ${ans} (1 mark).`, { options: [gxE([[c, "n"], [d, ""]]) === ans ? gxE([[d, "n"], [c + d, ""]]) : gxE([[c, "n"], [d, ""]]), gxE([[d, "n"], [c + d, ""]]), gxE([[1, "n"], [d, ""]])].filter((o, i, l) => o !== ans && l.indexOf(o) === i).slice(0, 2), label: `nth ${d},${c}`, skill: "the nth term" }); },
      () => { const d = gfR(2, 9), c = gfR(-5, 9), n = pick([20, 50, 100]);
        return gfQ(`The nth term of a sequence is ${gxE([[d, "n"], [c, ""]])}. Work out the ${gxOrd(n)} term.`, d * n + c, 1, `${d} × ${n} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${d * n + c} (1 mark).`, { label: `use ${d},${c},${n}`, skill: "using the nth term" }); },
      () => { const d = gfR(3, 9), c = gfR(-5, 8), n = gfR(12, 40), t = d * n + c;
        return gfQ(`Which term of the sequence with nth term ${gxE([[d, "n"], [c, ""]])} is equal to ${t}?`, n, 2, `Solve ${gxE([[d, "n"], [c, ""]])} = ${t} (1 mark). n = ${n}, so the ${gxOrd(n)} term (1 mark).`, { label: `which ${d},${c},${n}`, skill: "using the nth term" }); },
      () => { const d = gfR(3, 9), c = gfR(1, d - 1), t = pick([100, 150, 200, 250]), yes = (t - c) % d === 0, ans = yes ? `Yes: it is the ${gxOrd((t - c) / d)} term` : `No: ${gxE([[d, "n"], [c, ""]])} = ${t} gives n = ${gfD((t - c) / d)}, not a whole number`;
        return gfQ(`Is ${t} a term of the sequence ${gxE([[d, "n"], [c, ""]])}? Give a reason.`, ans, 2, `Solve ${gxE([[d, "n"], [c, ""]])} = ${t} (1 mark). ${yes ? `n = ${(t - c) / d}, a whole number, so yes` : `n is not a whole number, so no`} (1 mark).`, { options: yes ? [`No: ${t} is not in the ${d} times table`] : [`Yes: it is the ${gxOrd(Math.round((t - c) / d))} term`], label: `isin ${d},${c},${t}`, skill: "is it in the sequence?" }); },
      () => { const a = gfR(1, 6), r = pick([2, 3, 2, 5]), terms = range(0, 3).map(i => a * r ** i);
        return gfQ(`Write down the next term of the geometric sequence ${terms.join(", ")}, …`, a * r ** 4, 1, `Each term is ${r} times the one before: ${terms[3]} × ${r} = ${a * r ** 4} (1 mark).`, { label: `geo ${a},${r}`, skill: "geometric sequences" }); },
      () => { const c = gfR(-5, 9), n = gfR(4, 9);
        return gfQ(`The nth term of a sequence is n² ${c < 0 ? "−" : "+"} ${Math.abs(c) || 1}. Work out the ${gxOrd(n)} term.`, n * n + (c || 1), 1, `${n}² = ${n * n}, then ${c < 0 ? "−" : "+"} ${Math.abs(c) || 1}: ${n * n + (c || 1)} (1 mark).`, { label: `sq ${c},${n}`, skill: "using the nth term" }); }
    ] },
    { id: "g5-lines", n: 7, short: "Graphs", title: "Gradients, straight lines and quadratic graphs", strand: "Patterns and missing numbers",
      blurb: "Gradient and intercept, the equation of a line through two points, parallel lines, midpoints and quadratic graphs.", makers: [
      () => { const m = gfR(-5, 6) || 2, c = gfR(-9, 9), k = gfR(2, 4), what = rand(2);
        return gfQ(`What is the ${what ? "gradient" : "y-intercept"} of the line ${k}y = ${gxE([[k * m, "x"], [k * c, ""]])}?`, gfM(what ? m : c), 1, `Divide everything by ${k}: y = ${gxE([[m, "x"], [c, ""]])}, so the ${what ? `gradient is ${gfM(m)}` : `y-intercept is ${gfM(c)}`} (1 mark).`, { label: `mc ${m},${c},${k},${what}`, skill: "gradient and intercept" }); },
      () => { const m = gfR(-4, 5) || 3, x1 = gfR(-4, 3), y1 = gfR(-5, 5), dx = gfR(1, 4), x2 = x1 + dx, y2 = y1 + m * dx;
        return gfQ(`Work out the gradient of the line through (${gfM(x1)}, ${gfM(y1)}) and (${gfM(x2)}, ${gfM(y2)}).`, gfM(m), 2, `Change in y ÷ change in x (1 mark): ${gfM(y2 - y1)} ÷ ${dx} = ${gfM(m)} (1 mark).`, { label: `grad ${x1},${y1},${m},${dx}`, skill: "gradient from two points" }); },
      () => { const m = gfR(-4, 5) || 2, c = gfR(-6, 8), x1 = gfR(-2, 1), x2 = x1 + gfR(2, 4), ans = `y = ${gxE([[m, "x"], [c, ""]])}`;
        return gfQ(`Find the equation of the line through (${gfM(x1)}, ${gfM(m * x1 + c)}) and (${gfM(x2)}, ${gfM(m * x2 + c)}).`, ans, 3, `Gradient = ${gfM((m * x2 + c) - (m * x1 + c))} ÷ ${x2 - x1} = ${gfM(m)} (1 mark). Substitute a point to find c (1 mark). ${ans} (1 mark).`, { options: [`y = ${gxE([[m, "x"], [c + m, ""]])}`, `y = ${gxE([[-m, "x"], [c, ""]])}`], label: `eq ${m},${c},${x1},${x2}`, skill: "equation of a line" }); },
      () => { const m = gfR(-5, 6) || 3, c = gfR(-9, 9), ans = `y = ${gxE([[m, "x"], [c + gfR(1, 5), ""]])}`;
        return gfQ(`Which line is parallel to y = ${gxE([[m, "x"], [c, ""]])}?`, ans, 1, `Parallel lines have the same gradient, ${gfM(m)} (1 mark).`, { options: [`y = ${gxE([[c || 1, "x"], [m, ""]])}`, `y = ${gxE([[-m, "x"], [c, ""]])}`].filter(o => o !== ans), label: `par ${m},${c}`, skill: "parallel lines" }); },
      () => { const x1 = gfR(-6, 6), y1 = gfR(-6, 6), x2 = x1 + 2 * gfR(1, 5), y2 = y1 + 2 * gfR(-4, 4), ans = `(${gfM((x1 + x2) / 2)}, ${gfM((y1 + y2) / 2)})`;
        return gfQ(`Find the midpoint of (${gfM(x1)}, ${gfM(y1)}) and (${gfM(x2)}, ${gfM(y2)}).`, ans, 2, `Add the x values and halve: ${gfM((x1 + x2) / 2)} (1 mark). The same for the y values: ${gfM((y1 + y2) / 2)} (1 mark).`, { accept: [ans.replace(/ /g, ""), ans.replace(/−/g, "-"), ans.replace(/−/g, "-").replace(/ /g, "")], label: `mid ${x1},${y1},${x2},${y2}`, skill: "midpoints" }); },
      () => { const b = gfR(-5, 5), c = gfR(-6, 6), x = gfR(-3, 3);
        return gfQ(`For y = ${gxE([[1, "x²"], [b, "x"], [c, ""]])}, work out y when x = ${gfM(x)}.`, gfM(x * x + b * x + c), 2, `Substitute${x < 0 ? ", with brackets round the negative" : ""}: (${gfM(x)})² ${b < 0 ? "−" : "+"} ${Math.abs(b)} × (${gfM(x)}) ${c < 0 ? "−" : "+"} ${Math.abs(c)} (1 mark) = ${gfM(x * x + b * x + c)} (1 mark). (${gfM(x)})² is ${x * x}${x < 0 ? ", not negative" : ""}.`, { label: `quad ${b},${c},${x}`, skill: "quadratic graphs" }); },
      () => { let a, b; do { a = gfR(-6, 6); b = gfR(-6, 6); } while (a === b || !a || !b); const q = `y = ${gxE([[1, "x²"], [-(a + b), "x"], [a * b, ""]])}`, ans = `x = ${gfM(Math.min(a, b))} and x = ${gfM(Math.max(a, b))}`;
        return gfQ(`Where does the graph of ${q} cross the x-axis?`, ans, 2, `It crosses where y = 0: factorise to ${gxB(1, -a)}${gxB(1, -b)} = 0 (1 mark). ${ans} (1 mark).`, { options: [`x = ${gfM(-Math.max(a, b))} and x = ${gfM(-Math.min(a, b))}`, `x = ${gfM(a * b)} only`].filter(o => o !== ans), label: `roots ${a},${b}`, skill: "roots of quadratics" }); }
    ] },
    { id: "g5-pythagoras", n: 8, short: "Pythagoras", title: "Pythagoras' theorem", strand: "Shape and angles",
      blurb: "Finding the longest side and a shorter side, checking for a right angle, distance between points and problems in context.", makers: [
      () => { const [p, q, r] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [12, 16, 20]]);
        return gfQ(`A right-angled triangle has shorter sides ${p} cm and ${q} cm. Work out the length of the longest side. (cm)`, r, 3, `${p}² + ${q}² (1 mark) = ${p * p + q * q} (1 mark). √${p * p + q * q} = ${r} cm (1 mark).`, { unit: "cm", pic: gxTri(`${q} cm`, `${p} cm`, "x"), label: `hyp ${p},${q}`, skill: "Pythagoras: the longest side" }); },
      () => { const [p, q, r] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 40, 41], [20, 21, 29]]);
        return gfQ(`A right-angled triangle has longest side ${r} cm and one shorter side ${q} cm. Work out the other side. (cm)`, p, 3, `${r}² − ${q}² (1 mark) = ${r * r - q * q} (1 mark). √${r * r - q * q} = ${p} cm (1 mark). Adding the squares here is the usual mistake.`, { unit: "cm", pic: gxTri(`${q} cm`, "x", `${r} cm`), label: `short ${p},${q}`, skill: "Pythagoras: a shorter side" }); },
      () => { const a = gfR(3, 14), b = gfR(4, 15), c = Math.sqrt(a * a + b * b); if (Number.isInteger(c)) return { label: "skip" };
        return gfQ(`A right-angled triangle has shorter sides ${a} cm and ${b} cm. Work out the length of the longest side, to 1 decimal place. (cm)`, c.toFixed(1), 3, `${a}² + ${b}² = ${a * a + b * b} (1 mark). √${a * a + b * b} (1 mark) = ${c.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, label: `hypc ${a},${b}`, skill: "Pythagoras: the longest side" }); },
      () => { const [p, q, r] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), k = gfR(1, 3), off = rand(2) ? 0 : 1, ans = off ? "No" : "Yes";
        return gfQ(`A triangle has sides ${p * k} cm, ${q * k} cm and ${r * k + off} cm. Is it a right-angled triangle?`, ans, 2, `${p * k}² + ${q * k}² = ${(p * p + q * q) * k * k} and ${r * k + off}² = ${(r * k + off) ** 2} (1 mark). ${off ? "Not equal, so no" : "Equal, so yes"} (1 mark).`, { options: [off ? "Yes" : "No"], label: `isright ${p},${k},${off}`, skill: "checking for a right angle" }); },
      () => { const [p, q, r] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), x1 = gfR(-5, 4), y1 = gfR(-5, 4), s = rand(2) ? 1 : -1;
        return gfQ(`Work out the distance between (${gfM(x1)}, ${gfM(y1)}) and (${gfM(x1 + p)}, ${gfM(y1 + s * q)}).`, r, 3, `Across ${p}, ${s > 0 ? "up" : "down"} ${q} (1 mark). ${p}² + ${q}² = ${r * r} (1 mark). √${r * r} = ${r} (1 mark).`, { label: `dist ${x1},${y1},${p}`, skill: "distance between points" }); },
      () => { const L = gfR(5, 12), d = gfR(10, L * 4) / 10; if (d >= L * 0.6) return { label: "skip" }; const h = Math.sqrt(L * L - d * d);
        return gfQ(`A ladder ${L} m long leans against a wall. Its foot is ${gfD(d)} m from the wall. How high up the wall does it reach, to 1 decimal place? (m)`, h.toFixed(1), 3, `The ladder is the longest side: ${L}² − ${gfD(d)}² (1 mark) = ${gfD(L * L - d * d)} (1 mark). √${gfD(L * L - d * d)} = ${h.toFixed(1)} m (1 mark).`, { unit: "m", calc: true, ps: true, label: `ladder ${L},${d}`, skill: "Pythagoras in context" }); }
    ] },
    { id: "g5-trig", n: 9, short: "Trigonometry", title: "Trigonometry in right-angled triangles", strand: "Shape and angles",
      blurb: "Choosing sin, cos or tan, finding a side, finding an angle, and the exact values to know without a calculator.", makers: [
      () => { const h = gfR(5, 20), a = gfR(20, 70), x = h * Math.sin(a * Math.PI / 180);
        return gfQ(`A right-angled triangle has hypotenuse ${h} cm and an angle of ${a}°. Work out the side opposite the ${a}° angle, to 1 decimal place. (cm)`, x.toFixed(1), 3, `Opposite and hypotenuse: sin (1 mark). x = ${h} × sin ${a}° (1 mark) = ${x.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, pic: gxTri("", "x", `${h} cm`, `${a}°`), label: `sin ${h},${a}`, skill: "trigonometry: finding a side" }); },
      () => { const h = gfR(5, 20), a = gfR(20, 70), x = h * Math.cos(a * Math.PI / 180);
        return gfQ(`A right-angled triangle has hypotenuse ${h} cm and an angle of ${a}°. Work out the side next to (adjacent to) the ${a}° angle, to 1 decimal place. (cm)`, x.toFixed(1), 3, `Adjacent and hypotenuse: cos (1 mark). x = ${h} × cos ${a}° (1 mark) = ${x.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, pic: gxTri("x", "", `${h} cm`, `${a}°`), label: `cos ${h},${a}`, skill: "trigonometry: finding a side" }); },
      () => { const d = gfR(4, 18), a = gfR(20, 65), x = d * Math.tan(a * Math.PI / 180);
        return gfQ(`In a right-angled triangle, the side next to a ${a}° angle is ${d} cm. Work out the side opposite the ${a}° angle, to 1 decimal place. (cm)`, x.toFixed(1), 3, `Opposite and adjacent: tan (1 mark). x = ${d} × tan ${a}° (1 mark) = ${x.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, pic: gxTri(`${d} cm`, "x", "", `${a}°`), label: `tan ${d},${a}`, skill: "trigonometry: finding a side" }); },
      () => { const o = gfR(3, 12), d = gfR(4, 15), ang = Math.atan(o / d) * 180 / Math.PI;
        return gfQ(`In a right-angled triangle, the side opposite angle x is ${o} cm and the side next to it is ${d} cm. Work out x, to 1 decimal place. (°)`, ang.toFixed(1), 3, `Opposite and adjacent: tan x = ${o} ÷ ${d} (1 mark). x = tan⁻¹(${o} ÷ ${d}) (1 mark) = ${ang.toFixed(1)}° (1 mark).`, { unit: "°", calc: true, pic: gxTri(`${d} cm`, `${o} cm`, "", "x"), label: `ang ${o},${d}`, skill: "trigonometry: finding an angle" }); },
      () => { const [q, ans] = pick([["sin 30°", "1/2"], ["cos 60°", "1/2"], ["tan 45°", "1"], ["cos 30°", "√3/2"], ["sin 60°", "√3/2"], ["tan 60°", "√3"], ["sin 90°", "1"], ["cos 0°", "1"], ["sin 0°", "0"], ["cos 90°", "0"], ["tan 30°", "1/√3"]]);
        return gfQ(`Write down the exact value of ${q}.`, ans, 1, `One of the exact values to learn for the non-calculator paper: ${q} = ${ans} (1 mark).`, { options: shuffle(["1/2", "√3/2", "1", "0", "√3", "1/√3"].filter(o => o !== ans)).slice(0, 3), label: `exact ${q}`, skill: "exact trigonometric values" }); },
      () => { const [know, want, ans] = pick([["the hypotenuse", "the side opposite the angle", "sin"], ["the hypotenuse", "the side adjacent to the angle", "cos"], ["the side adjacent to the angle", "the side opposite the angle", "tan"], ["the side opposite the angle and the hypotenuse", "the angle", "sin"], ["the side adjacent to the angle and the hypotenuse", "the angle", "cos"]]);
        return gfQ(`In a right-angled triangle you know ${know} and want ${want}. Which ratio do you use?`, ans, 1, `SOH CAH TOA: ${ans} (1 mark). Label the sides opposite, adjacent and hypotenuse first.`, { options: ["sin", "cos", "tan"].filter(o => o !== ans), label: `which ${know}${want}`, skill: "choosing sin, cos or tan" }); }
    ] },
    { id: "g5-circles", n: 10, short: "Circles", title: "Circles, cylinders and prisms", strand: "Measurement",
      blurb: "Circumference and area, answers in terms of π, semicircles, cylinders and the volume of prisms.", makers: [
      () => { const r = gfR(3, 15), dia = rand(2), c = 2 * Math.PI * r;
        return gfQ(`A circle has ${dia ? `diameter ${2 * r}` : `radius ${r}`} cm. Work out its circumference, to 1 decimal place. (cm)`, c.toFixed(1), 2, `C = π × d = π × ${2 * r} (1 mark) = ${c.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, label: `circ ${r},${dia}`, skill: "circumference" }); },
      () => { const r = gfR(3, 15), dia = rand(2), a = Math.PI * r * r;
        return gfQ(`A circle has ${dia ? `diameter ${2 * r}` : `radius ${r}`} cm. Work out its area, to 1 decimal place. (cm²)`, a.toFixed(1), 2, `A = π × r²${dia ? `, and r is half the diameter, ${r}` : ""}: π × ${r}² (1 mark) = ${a.toFixed(1)} cm² (1 mark).`, { unit: "cm²", calc: true, label: `area ${r},${dia}`, skill: "area of a circle" }); },
      () => { const r = gfR(3, 12), area = rand(2), ans = area ? `${r * r}π` : `${2 * r}π`;
        return gfQ(`A circle has radius ${r} cm. Write its ${area ? "area" : "circumference"} in terms of π.`, ans, 1, `${area ? `π × ${r}² = ${r * r}π cm²` : `2 × π × ${r} = ${2 * r}π cm`} (1 mark). "In terms of π" means leave π in the answer.`, { options: [area ? `${2 * r}π` : `${r * r}π`, area ? `${r * 2 * r}π` : `${r}π`].filter(o => o !== ans), label: `pi ${r},${area}`, skill: "answers in terms of π" }); },
      () => { const d = gfR(4, 20), p = Math.PI * d / 2 + d;
        return gfQ(`A semicircle has diameter ${d} cm. Work out its perimeter, to 1 decimal place. (cm)`, p.toFixed(1), 3, `Half the circumference: π × ${d} ÷ 2 = ${(Math.PI * d / 2).toFixed(2)} (1 mark). Add the straight edge, the diameter ${d} (1 mark). ${p.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, ps: true, label: `semi ${d}`, skill: "semicircles" }); },
      () => { const r = gfR(2, 10), h = gfR(4, 25), v = Math.PI * r * r * h;
        return gfQ(`A cylinder has radius ${r} cm and height ${h} cm. Work out its volume, to 1 decimal place. (cm³)`, v.toFixed(1), 2, `Area of the circle × height: π × ${r}² × ${h} (1 mark) = ${v.toFixed(1)} cm³ (1 mark).`, { unit: "cm³", calc: true, label: `cyl ${r},${h}`, skill: "volume of a cylinder" }); },
      () => { const c = gfR(20, 90), r = c / (2 * Math.PI);
        return gfQ(`A circle has circumference ${c} cm. Work out its radius, to 1 decimal place. (cm)`, r.toFixed(1), 2, `C = 2πr, so r = ${c} ÷ (2π) (1 mark) = ${r.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, label: `rad ${c}`, skill: "working backwards from the circumference" }); },
      () => { const b = gfR(3, 12), h = gfR(2, 10) * (rand(2) ? 2 : 1), l = gfR(5, 20); if ((b * h) % 2) return { label: "skip" };
        return gfQ(`A prism is ${l} cm long. Its cross-section is a triangle with base ${b} cm and height ${h} cm. Work out its volume. (cm³)`, b * h / 2 * l, 2, `Area of the cross-section: ½ × ${b} × ${h} = ${b * h / 2} cm² (1 mark). × ${l} = ${b * h / 2 * l} cm³ (1 mark).`, { unit: "cm³", label: `prism ${b},${h},${l}`, skill: "volume of a prism" }); }
    ] },
    { id: "g5-polygons", n: 11, short: "Polygons and bearings", title: "Polygons, bearings and similar shapes", strand: "Shape and angles",
      blurb: "Angles in polygons, three-figure bearings, scale drawings and lengths in similar shapes.", makers: [
      () => { const [n, name] = pick([[5, "pentagon"], [6, "hexagon"], [8, "octagon"], [9, "nonagon"], [10, "decagon"], [12, "12-sided polygon"]]);
        return gfQ(`Work out the sum of the interior angles of a ${name}. (°)`, (n - 2) * 180, 2, `A ${name} splits into ${n} − 2 = ${n - 2} triangles (1 mark). ${n - 2} × 180° = ${(n - 2) * 180}° (1 mark).`, { unit: "°", label: `sum ${n}`, skill: "angles in polygons" }); },
      () => { const n = pick([5, 6, 8, 9, 10, 12, 15, 18, 20]), ext = 360 / n;
        return gfQ(`Work out the size of one interior angle of a regular polygon with ${n} sides. (°)`, 180 - ext, 2, `Exterior angle: 360° ÷ ${n} = ${ext}° (1 mark). Interior: 180° − ${ext}° = ${180 - ext}° (1 mark).`, { unit: "°", label: `int ${n}`, skill: "angles in polygons" }); },
      () => { const n = pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]), int = rand(2);
        return gfQ(`Each ${int ? "interior" : "exterior"} angle of a regular polygon is ${int ? 180 - 360 / n : 360 / n}°. How many sides does it have?`, n, 2, `${int ? `Exterior angle = 180° − ${180 - 360 / n}° = ${360 / n}°. ` : ""}Exterior angles add up to 360° (1 mark). 360 ÷ ${360 / n} = ${n} (1 mark).`, { label: `sides ${n},${int}`, skill: "angles in polygons" }); },
      () => { const b = gfR(10, 340), back = (b + 180) % 360, f = x => String(x).padStart(3, "0");
        return gfQ(`The bearing of B from A is ${f(b)}°. Work out the bearing of A from B. (°)`, f(back), 2, `The back bearing is 180° ${b < 180 ? "more" : "less"} (1 mark): ${f(back)}° (1 mark). Bearings always have three figures.`, { unit: "°", accept: [String(back)], label: `bear ${b}`, skill: "bearings" }); },
      () => { const k = pick([1.5, 2, 2.5, 3, 4]), a = gfR(2, 9) * 2, b = gfR(2, 9) * 2;
        return gfQ(`Two triangles are similar. The small one has sides ${a} cm and ${b} cm. The matching side to ${a} cm on the large triangle is ${gfD(a * k)} cm. Work out the side matching ${b} cm. (cm)`, gfD(b * k), 2, `Scale factor ${gfD(a * k)} ÷ ${a} = ${gfD(k)} (1 mark). ${b} × ${gfD(k)} = ${gfD(b * k)} cm (1 mark).`, { unit: "cm", label: `sim ${a},${b},${k}`, skill: "similar shapes" }); },
      () => { const s = pick([10000, 20000, 25000, 50000]), cm = gfR(2, 15) + (rand(2) ? 0.5 : 0), km = cm * s / 100000;
        return gfQ(`A map has a scale of 1 : ${gfBig(s)}. Two towns are ${gfD(cm)} cm apart on the map. How far apart are they in real life? (km)`, gfD(km), 2, `${gfD(cm)} × ${gfBig(s)} = ${gfBig(cm * s)} cm (1 mark). ÷ 100 000 = ${gfD(km)} km (1 mark).`, { unit: "km", label: `map ${s},${cm}`, skill: "scale drawings" }); }
    ] },
    { id: "g5-compound", n: 12, short: "Compound measures", title: "Speed, density and pressure", strand: "Measurement",
      blurb: "Speed, distance and time with minutes, average speed, density, pressure and converting compound units.", makers: [
      () => { const t = pick([15, 30, 45, 90]), s = gfR(2, 16) * 4, d = s * t / 60;
        return gfQ(`A cyclist travels ${gfD(d)} km in ${t} minutes. Work out the average speed in km/h. (km/h)`, s, 2, `${t} minutes = ${gfD(t / 60)} hours (1 mark). ${gfD(d)} ÷ ${gfD(t / 60)} = ${s} km/h (1 mark).`, { unit: "km/h", label: `spd ${d},${t}`, skill: "speed" }); },
      () => { const s = pick([40, 48, 50, 60, 64, 72]), m = pick([15, 30, 45, 75, 90, 105, 150]), d = s * m / 60;
        return gfQ(`A bus travels ${gfD(d)} km at an average speed of ${s} km/h. How many minutes does the journey take? (minutes)`, m, 2, `Time = distance ÷ speed: ${gfD(d)} ÷ ${s} = ${gfD(m / 60)} hours (1 mark). × 60 = ${m} minutes (1 mark).`, { unit: "minutes", calc: true, label: `time ${d},${s}`, skill: "speed" }); },
      () => { const dens = pick([0.8, 1.2, 2.5, 7.9, 8.9, 11.3, 19.3, 2.7]), v = gfR(5, 60), m = Math.round(dens * v * 10) / 10, what = rand(2);
        return what ? gfQ(`A block has mass ${gfD(m)} g and volume ${v} cm³. Work out its density. (g/cm³)`, gfD(dens), 2, `Density = mass ÷ volume (1 mark): ${gfD(m)} ÷ ${v} = ${gfD(dens)} g/cm³ (1 mark).`, { unit: "g/cm³", calc: true, label: `den ${m},${v}`, skill: "density" })
          : gfQ(`A metal has density ${gfD(dens)} g/cm³. Work out the mass of ${v} cm³ of it. (g)`, gfD(m), 2, `Mass = density × volume (1 mark): ${gfD(dens)} × ${v} = ${gfD(m)} g (1 mark).`, { unit: "g", calc: true, label: `mass ${dens},${v}`, skill: "density" }); },
      () => { const a = pick([0.5, 2, 4, 2.5, 0.25]), p = gfR(2, 40) * 10, f = p * a;
        return gfQ(`A force of ${gfD(f)} N acts on an area of ${gfD(a)} m². Work out the pressure. (N/m²)`, gfD(p), 2, `Pressure = force ÷ area (1 mark): ${gfD(f)} ÷ ${gfD(a)} = ${gfD(p)} N/m² (1 mark).`, { unit: "N/m²", label: `pres ${f},${a}`, skill: "pressure" }); },
      () => { const ms = gfR(2, 30) * 5, kmh = ms * 3.6, up = rand(2);
        return up ? gfQ(`Convert ${gfD(ms)} m/s to km/h. (km/h)`, gfD(kmh), 2, `In an hour: ${gfD(ms)} × 3600 = ${gfBig(ms * 3600)} m (1 mark). ÷ 1000 = ${gfD(kmh)} km/h (1 mark).`, { unit: "km/h", calc: true, label: `ms ${ms}`, skill: "converting compound units" })
          : gfQ(`Convert ${gfD(kmh)} km/h to m/s. (m/s)`, gfD(ms), 2, `${gfD(kmh)} km/h = ${gfBig(kmh * 1000)} m in 3600 seconds (1 mark). ÷ 3600 = ${gfD(ms)} m/s (1 mark).`, { unit: "m/s", calc: true, label: `kmh ${kmh}`, skill: "converting compound units" }); },
      () => { const s1 = pick([30, 40, 60]), t1 = pick([0.5, 1, 1.5, 2]), s2 = pick([50, 70, 80]), t2 = pick([0.5, 1, 1.5]), d = s1 * t1 + s2 * t2, av = d / (t1 + t2);
        if (!Number.isInteger(av * 10)) return { label: "skip" };
        return gfQ(`Amy drives for ${gfD(t1)} hour${t1 === 1 ? "" : "s"} at ${s1} km/h, then ${gfD(t2)} hour${t2 === 1 ? "" : "s"} at ${s2} km/h. Work out her average speed for the whole journey. (km/h)`, gfD(av), 3, `Distances: ${gfD(s1 * t1)} km and ${gfD(s2 * t2)} km (1 mark). Total ${gfD(d)} km in ${gfD(t1 + t2)} hours (1 mark). ${gfD(d)} ÷ ${gfD(t1 + t2)} = ${gfD(av)} km/h (1 mark). Averaging ${s1} and ${s2} is the usual mistake.`, { unit: "km/h", calc: true, ps: true, label: `avs ${s1},${t1},${s2},${t2}`, skill: "average speed" }); }
    ] },
    { id: "g5-trees", n: 13, short: "Probability", title: "Tree diagrams, Venn diagrams and relative frequency", strand: "Data and chance",
      blurb: "Independent events, the AND and OR rules, at least one, relative frequency, expected results and Venn diagrams.", makers: [
      () => { const a = gfR(1, 9) / 10, b = gfR(1, 9) / 10;
        return gfQ(`The probability it rains on Monday is ${gfD(a)}. The probability Kim's bus is late is ${gfD(b)}. The two are independent. Work out the probability that it rains and the bus is late.`, gfD(a * b), 2, `AND means multiply (1 mark): ${gfD(a)} × ${gfD(b)} = ${gfD(a * b)} (1 mark).`, { label: `and ${a},${b}`, skill: "independent events" }); },
      () => { const r = gfR(2, 7), b = gfR(2, 7), n = r + b, ans = gfF(r * r, n * n);
        return gfQ(`A bag has ${r} red and ${b} blue counters. A counter is taken, put back, then a second is taken. Work out the probability that both are red.`, ans, 2, `P(red) = ${r}/${n} each time (1 mark). ${r}/${n} × ${r}/${n} = ${ans} (1 mark).`, { accept: gxFr(r * r, n * n), label: `rr ${r},${b}`, skill: "tree diagrams" }); },
      () => { const p = gfR(1, 8) / 10, q = 1 - p, n = gfR(2, 3), ans = gfD(1 - q ** n);
        return gfQ(`The probability a light is red when Jo reaches it is ${gfD(p)}. She passes it ${n === 2 ? "twice" : "three times"}. Work out the probability it is red at least once.`, ans, 3, `P(not red) = ${gfD(q)} (1 mark). P(never red) = ${gfD(q)}${sup(n)} = ${gfD(q ** n)} (1 mark). P(at least once) = 1 − ${gfD(q ** n)} = ${ans} (1 mark).`, { calc: true, ps: true, label: `atleast ${p},${n}`, skill: "at least one" }); },
      () => { const n = pick([50, 80, 120, 200, 250, 400]), k = gfR(3, Math.floor(n / 3)), what = pick(["landed on red", "came up heads", "showed a 6", "was a winning ticket"]), ans = gfD(k / n); if (Math.abs(k * 1000 / n - Math.round(k * 1000 / n)) > 1e-9) return { label: "skip" };
        return gfQ(`In ${n} trials, the result ${what} ${k} times. Estimate the probability of this result.`, ans, 1, `Relative frequency = ${k} ÷ ${n} = ${ans} (1 mark).`, { accept: [`${k}/${n}`, gfF(k, n)], label: `rf ${n},${k}`, skill: "relative frequency" }); },
      () => { const p = gfR(1, 9) / 10, n = pick([50, 100, 200, 300, 500, 150]);
        return gfQ(`The probability a seed grows is ${gfD(p)}. Rob plants ${n} seeds. How many would he expect to grow?`, gfD(p * n), 1, `${gfD(p)} × ${n} = ${gfD(p * n)} (1 mark).`, { label: `exp ${p},${n}`, skill: "expected results" }); },
      () => { const both = gfR(2, 9), f = both + gfR(3, 12), s = both + gfR(3, 12), neither = gfR(1, 8), tot = f + s - both + neither;
        return gfQ(`In a class of ${tot}, ${f} study French, ${s} study Spanish, and ${both} study both. How many study neither?`, neither, 2, `French or Spanish or both: ${f} + ${s} − ${both} = ${f + s - both}; the ${both} who do both are counted once (1 mark). ${tot} − ${f + s - both} = ${neither} (1 mark).`, { ps: true, label: `venn ${f},${s},${both},${neither}`, skill: "Venn diagrams" }); },
      () => { const a = gfR(1, 4) / 10, b = gfR(1, 3) / 10 + 0.05, rest = Math.round((1 - a - b) * 100) / 100, x = rest / 3; if (Math.abs(x * 100 - Math.round(x * 100)) > 1e-9) return { label: "skip" };
        return gfQ(`A spinner lands on red with probability ${gfD(a)}, blue ${gfD(b)}, green x and yellow 2x. Work out the value of x.`, gfD(x), 3, `The probabilities add up to 1, so 3x = 1 − ${gfD(a)} − ${gfD(b)} (1 mark) = ${gfD(rest)} (1 mark). x = ${gfD(x)} (1 mark).`, { ps: true, label: `px ${a},${b}`, skill: "probabilities add up to 1" }); }
    ] },
    { id: "g5-grouped", n: 14, short: "Grouped data", title: "Grouped data and comparing distributions", strand: "Data and chance",
      blurb: "Estimating the mean from a grouped table, modal class, the median's class, combined means and comparing two sets of data.", makers: [
      () => { const w = pick([5, 10, 20]), f = range(1, 4).map(() => gfR(2, 12)), mids = f.map((_, i) => i * w + w / 2), sum = f.reduce((t, v, i) => t + v * mids[i], 0), n = f.reduce((t, v) => t + v, 0), m = (sum / n).toFixed(1);
        const tbl = f.map((v, i) => `${i * w} < t ≤ ${(i + 1) * w}: ${v}`).join("; ");
        return gfQ(`Times in minutes, with frequencies: ${tbl}. Estimate the mean time, to 1 decimal place. (minutes)`, m, 3, `Use the midpoints ${mids.join(", ")} (1 mark). Sum of midpoint × frequency = ${gfD(sum)}, total frequency ${n} (1 mark). ${gfD(sum)} ÷ ${n} = ${m} (1 mark).`, { unit: "minutes", calc: true, label: `gmean ${w},${f}`, skill: "mean from grouped data" }); },
      () => { const w = pick([5, 10, 20]), f = shuffle([3, 7, 12, 5]), mx = f.indexOf(12), cls = i => `${i * w} < h ≤ ${(i + 1) * w}`;
        return gfQ(`Heights in cm, with frequencies: ${f.map((v, i) => `${cls(i)}: ${v}`).join("; ")}. Which is the modal class?`, cls(mx), 1, `The class with the highest frequency, 12 (1 mark).`, { options: f.map((_, i) => cls(i)).filter(c => c !== cls(mx)).slice(0, 2), label: `modal ${w},${f}`, skill: "modal class" }); },
      () => { const w = 10, f = range(1, 4).map(() => gfR(3, 12)), n = f.reduce((t, v) => t + v, 0), pos = (n + 1) / 2; let c = 0, k = 0; while (c + f[k] < pos) c += f[k++];
        const cls = i => `${i * w} < m ≤ ${(i + 1) * w}`;
        return gfQ(`Marks, with frequencies: ${f.map((v, i) => `${cls(i)}: ${v}`).join("; ")}. Which class contains the median?`, cls(k), 2, `There are ${n} values, so the median is the ${Number.isInteger(pos) ? gxOrd(pos) : `${gfD(pos)}th`} value (1 mark). Running totals ${f.map((_, i) => f.slice(0, i + 1).reduce((t, v) => t + v, 0)).join(", ")} put it in ${cls(k)} (1 mark).`, { options: f.map((_, i) => cls(i)).filter(x => x !== cls(k)).slice(0, 2), label: `medc ${f}`, skill: "median of grouped data" }); },
      () => { const n1 = gfR(10, 30), n2 = gfR(10, 30), m1 = gfR(40, 80), m2 = gfR(40, 80), tot = n1 * m1 + n2 * m2, m = tot / (n1 + n2); if (!Number.isInteger(m * 10)) return { label: "skip" };
        return gfQ(`Class A (${n1} pupils) has a mean score of ${m1}. Class B (${n2} pupils) has a mean of ${m2}. Work out the mean score of all ${n1 + n2} pupils.`, gfD(m), 3, `Totals: ${n1} × ${m1} = ${n1 * m1} and ${n2} × ${m2} = ${n2 * m2} (1 mark). Together ${tot} (1 mark). ${tot} ÷ ${n1 + n2} = ${gfD(m)} (1 mark). Not the mean of ${m1} and ${m2}.`, { calc: true, ps: true, label: `comb ${n1},${m1},${n2},${m2}`, skill: "combined means" }); },
      () => { const ma = gfR(20, 40), mb = ma + gfR(2, 8) * (rand(2) ? 1 : -1), ra = gfR(5, 20), rb = ra + gfR(3, 10) * (rand(2) ? 1 : -1); if (rb <= 0 || rb === ra) return { label: "skip" };
        const hi = mb > ma ? "B" : "A", con = rb < ra ? "B" : "A", ans = `On average ${hi} scored higher, and ${con}'s scores were more consistent (smaller range)`;
        return gfQ(`Team A: median ${ma}, range ${ra}. Team B: median ${mb}, range ${rb}. Which comparison is right?`, ans, 2, `Compare an average: the higher median, ${hi} (1 mark). Compare the spread: the smaller range is more consistent, ${con} (1 mark). Each comparison must say what it means in context.`, { options: [`On average ${hi === "A" ? "B" : "A"} scored higher, and ${con}'s scores were more consistent (smaller range)`, `On average ${hi} scored higher, and ${con === "A" ? "B" : "A"}'s scores were more consistent (larger range)`], label: `cmp ${ma},${mb},${ra},${rb}`, skill: "comparing distributions" }); },
      () => { const bw = gfR(5, 15), bg = gfR(5, 15), gw = gfR(5, 15), gg = gfR(5, 15);
        return gfQ(`${bw + bg + gw + gg} pupils were asked if they walk or get a lift to school. ${bw + bg} are boys. ${bw} boys walk. ${bw + gw} pupils walk altogether. How many girls get a lift?`, gg, 2, `Girls: ${bw + bg + gw + gg} − ${bw + bg} = ${gw + gg}; girls who walk: ${bw + gw} − ${bw} = ${gw} (1 mark). Girls who get a lift: ${gw + gg} − ${gw} = ${gg} (1 mark).`, { ps: true, label: `twoway ${bw},${bg},${gw},${gg}`, skill: "two-way tables" }); }
    ] }
  ];

  /* ---------- GCSE maths exam climb, stage 3: Higher, grades 6 to 9 ---------- */
  // The Higher-only topics, for a pupil secure at grade 5 who is sitting the Higher tier. Same shape again.
  const gxSurd = (k, m) => (m === 1 ? String(k) : `${k === 1 ? "" : k}√${m}`);
  const GH = [
    { id: "gh-surds", n: 1, short: "Surds and indices", title: "Surds, and negative and fractional indices", strand: "Number",
      blurb: "Simplifying surds, rationalising denominators, expanding brackets with surds, and negative and fractional powers.", makers: [
      () => { const k = gfR(2, 7), m = pick([2, 3, 5, 6, 7]), ans = gxSurd(k, m);
        return gfQ(`Simplify √${k * k * m}.`, ans, 2, `Find a square factor: ${k * k * m} = ${k * k} × ${m} (1 mark). √${k * k} × √${m} = ${ans} (1 mark).`, { options: [gxSurd(m, k * k), gxSurd(k * k, m)].filter(o => o !== ans), label: `surd ${k},${m}`, skill: "simplifying surds" }); },
      () => { const m = pick([2, 3, 5]), [a, b] = shuffle([2, 3, 4, 5]).slice(0, 2), ans = gxSurd(a + b, m);
        return gfQ(`Simplify √${a * a * m} + √${b * b * m}.`, ans, 2, `√${a * a * m} = ${gxSurd(a, m)} and √${b * b * m} = ${gxSurd(b, m)} (1 mark). Like surds add: ${ans} (1 mark).`, { options: [`√${(a * a + b * b) * m}`, gxSurd(a * b, m)].filter(o => o !== ans), label: `addsurd ${a},${b},${m}`, skill: "simplifying surds" }); },
      () => { const a = gfR(2, 9), b = pick([2, 3, 5, 6, 7, 10, 11]);
        return gfQ(`Expand and simplify (${a} + √${b})(${a} − √${b}).`, a * a - b, 2, `${a * a} − ${a}√${b} + ${a}√${b} − ${b} (1 mark). The surd terms cancel: ${a * a - b} (1 mark).`, { label: `dots ${a},${b}`, skill: "expanding brackets with surds" }); },
      () => { const n = pick([2, 3, 5, 6, 7]), k = n * gfR(1, 4), ans = gxSurd(k / n, n);
        return gfQ(`Rationalise the denominator of ${k}/√${n}. Simplify your answer.`, ans, 2, `Multiply top and bottom by √${n} (1 mark): ${k}√${n}/${n} = ${ans} (1 mark).`, { options: [`${k}√${n}`, `√${n}/${k}`].filter(o => o !== ans), label: `rat ${k},${n}`, skill: "rationalising denominators" }); },
      () => { const [base, q, r] = pick([[8, 3, 2], [27, 3, 3], [16, 4, 2], [64, 3, 4], [125, 3, 5], [32, 5, 2], [81, 4, 3], [9, 2, 3], [25, 2, 5], [4, 2, 2], [36, 2, 6], [16, 2, 4], [49, 2, 7], [100, 2, 10], [1000, 3, 10], [64, 2, 8]]);
        const p = gfR(1, 3) === 1 && q > 2 ? 1 : gfR(2, 3), val = r ** p, neg = rand(2), ans = neg ? `1/${val}` : String(val), dec = 1 / val;
        if (val > 1000 || p === q) return { label: "skip" };
        return gfQ(`Work out the value of ${base}^(${neg ? "−" : ""}${p}/${q}).`, ans, 2, `The bottom of the power is a root: ${q === 2 ? "√" : q === 3 ? "∛" : `the ${gxOrd(q)} root of `}${base} = ${r} (1 mark). Then the power ${p}${neg ? ", and the minus sign means 1 over" : ""}: ${ans} (1 mark).`, { accept: neg && Number.isInteger(dec * 1000) ? [gfD(dec)] : [], label: `frac ${base},${p},${q},${neg}`, skill: "fractional and negative indices" }); },
      () => { const b = gfR(2, 9), p = gfR(1, 3), ans = `1/${b ** p}`, dec = 1 / b ** p;
        return gfQ(`Work out the value of ${b}${sup(-p)}.`, ans, 1, `A negative power means 1 over: 1/${b}${sup(p)} = ${ans} (1 mark).`, { accept: Number.isInteger(dec * 1000) ? [gfD(dec)] : [], label: `neg ${b},${p}`, skill: "negative indices" }); }
    ] },
    { id: "gh-quadratics", n: 2, short: "Quadratics", title: "Solving quadratic equations", strand: "Patterns and missing numbers",
      blurb: "Factorising when x² has a number in front, the quadratic formula, completing the square and the discriminant.", makers: [
      () => { let p, q, r, s; do { p = pick([2, 3]); r = 1; q = gfR(-5, 5); s = gfR(-5, 5); } while (!q || !s || gcd(Math.abs(q), p) !== 1 || p * s + q === 0);
        const ans = `${gxB(p, q)}${gxB(r, s)}`, poly = gxE([[p, "x²"], [p * s + q * r, "x"], [q * s, ""]]);
        return gfQ(`Factorise ${poly}.`, ans, 2, `Find two numbers that multiply to ${p} × ${gfM(q * s)} = ${gfM(p * q * s)} and add to ${gfM(p * s + q)}, then split the middle term (1 mark). ${ans} (1 mark).`, { options: [`${gxB(p, s)}${gxB(1, q)}`, `${gxB(p, -q)}${gxB(1, -s)}`].filter((o, i, l) => o !== ans && l.indexOf(o) === i), label: `fa ${p},${q},${s}`, skill: "factorising harder quadratics" }); },
      () => { let p, q, s; do { p = pick([2, 3, 4]); q = gfR(-7, 7); s = gfR(-6, 6); } while (!q || !s || gcd(Math.abs(q), p) !== 1);
        const poly = gxE([[p, "x²"], [p * s + q, "x"], [q * s, ""]]), r1 = gfF(Math.abs(q), p), ans = `x = ${q > 0 ? "−" : ""}${r1} or x = ${gfM(-s)}`;
        return gfQ(`Solve ${poly} = 0.`, ans, 3, `Factorise: ${gxB(p, q)}${gxB(1, s)} = 0 (1 mark). Set each bracket to 0 (1 mark). ${ans} (1 mark).`, { options: [`x = ${q > 0 ? "" : "−"}${r1} or x = ${gfM(s)}`, `x = ${gfM(-q)} or x = ${gfM(-s)}`].filter(o => o !== ans), label: `sq ${p},${q},${s}`, skill: "solving quadratics" }); },
      () => { let b, c, d; do { b = gfR(-9, 9); c = gfR(-9, 9); d = b * b - 4 * c; } while (d <= 0 || Number.isInteger(Math.sqrt(d)));
        const r1 = ((-b + Math.sqrt(d)) / 2).toFixed(2), r2 = ((-b - Math.sqrt(d)) / 2).toFixed(2), f = x => x.replace("-", "−"), ans = `x = ${f(r1)} or x = ${f(r2)}`;
        return gfQ(`Solve ${gxE([[1, "x²"], [b, "x"], [c, ""]])} = 0. Give your answers to 2 decimal places.`, ans, 3, `a = 1, b = ${gfM(b)}, c = ${gfM(c)} in the formula (1 mark). b² − 4ac = ${d} (1 mark). ${ans} (1 mark).`, { calc: true, options: [`x = ${f(((b + Math.sqrt(d)) / 2).toFixed(2))} or x = ${f(((b - Math.sqrt(d)) / 2).toFixed(2))}`, `x = ${f((-b + Math.sqrt(d)).toFixed(2))} or x = ${f((-b - Math.sqrt(d)).toFixed(2))}`].filter(o => o !== ans), label: `qf ${b},${c}`, skill: "the quadratic formula" }); },
      () => { const p = gfR(-6, 6) || 3, q = gfR(-12, 15), ans = `(x ${p < 0 ? "−" : "+"} ${Math.abs(p)})² ${q - p * p < 0 ? "−" : "+"} ${Math.abs(q - p * p)}`;
        return gfQ(`Write ${gxE([[1, "x²"], [2 * p, "x"], [q, ""]])} in the form (x + a)² + b.`, ans, 2, `Half of ${gfM(2 * p)} is ${gfM(p)}: (x ${p < 0 ? "−" : "+"} ${Math.abs(p)})² gives an extra ${p * p} (1 mark). Take it away: ${ans} (1 mark).`, { options: [`(x ${p < 0 ? "−" : "+"} ${Math.abs(2 * p)})² ${q - 4 * p * p < 0 ? "−" : "+"} ${Math.abs(q - 4 * p * p)}`, `(x ${p < 0 ? "−" : "+"} ${Math.abs(p)})² ${q + p * p < 0 ? "−" : "+"} ${Math.abs(q + p * p)}`].filter(o => o !== ans), label: `cts ${p},${q}`, skill: "completing the square" }); },
      () => { const kind = rand(3), b = kind === 1 ? 2 * gfR(-4, 4) : gfR(-8, 8), c = kind === 1 ? b * b / 4 : Math.floor(b * b / 4) + (kind === 2 ? -gfR(1, 6) : gfR(1, 6)), d = b * b - 4 * c, ans = d > 0 ? "2" : d === 0 ? "1" : "0";
        return gfQ(`How many real solutions does ${gxE([[1, "x²"], [b, "x"], [c, ""]])} = 0 have?`, ans, 2, `The discriminant b² − 4ac = ${b * b} ${4 * c < 0 ? "+" : "−"} ${Math.abs(4 * c)} = ${gfM(d)} (1 mark). ${d > 0 ? "Positive: two" : d === 0 ? "Zero: one (a repeated root)" : "Negative: none"} (1 mark).`, { options: ["0", "1", "2"].filter(o => o !== ans), label: `disc ${b},${c}`, skill: "the discriminant" }); },
      () => { const a = gfR(3, 12), b = gfR(1, a - 1), area = a * b, x = b;
        return gfQ(`A rectangle is (x + ${a - b}) cm long and x cm wide. Its area is ${area} cm². Work out x. (cm)`, x, 3, `x(x + ${a - b}) = ${area}, so ${gxE([[1, "x²"], [a - b, "x"], [-area, ""]])} = 0 (1 mark). (x + ${a})(x − ${b}) = 0 (1 mark). x = ${x}: a length cannot be −${a} (1 mark).`, { unit: "cm", ps: true, label: `rect ${a},${b}`, skill: "forming quadratics" }); }
    ] },
    { id: "gh-algebra", n: 3, short: "Algebra", title: "Algebraic fractions and harder simultaneous equations", strand: "Patterns and missing numbers",
      blurb: "Simplifying and adding algebraic fractions, equations with fractions, rearranging when the letter appears twice, and a line meeting a curve.", makers: [
      () => { let a, b; do { a = gfR(-6, 6); b = gfR(-6, 6); } while (!a || !b || a === b); const num = gxE([[1, "x²"], [a + b, "x"], [a * b, ""]]), ans = gxB(1, b).slice(1, -1);
        return gfQ(`Simplify (${num}) ÷ ${gxB(1, a)}.`, ans, 2, `Factorise the top: ${gxB(1, a)}${gxB(1, b)} (1 mark). Cancel ${gxB(1, a)}: ${ans} (1 mark).`, { options: [gxB(1, -b).slice(1, -1), gxE([[1, "x"], [a * b, ""]])].filter((o, i, l) => o !== ans && l.indexOf(o) === i), label: `af ${a},${b}`, skill: "simplifying algebraic fractions" }); },
      () => { let a, b; do { a = gfR(1, 6); b = gfR(-5, 6); } while (!b || a === b); const ans = `(${gxE([[2, "x"], [a + b, ""]])}) / (${gxB(1, a)}${gxB(1, b)})`;
        return gfQ(`Write 1/${gxB(1, a)} + 1/${gxB(1, b)} as a single fraction.`, ans, 3, `Common denominator ${gxB(1, a)}${gxB(1, b)} (1 mark). Top: ${gxB(1, b)} + ${gxB(1, a)} (1 mark) = ${gxE([[2, "x"], [a + b, ""]])} (1 mark).`, { options: [`2 / (${gxE([[2, "x"], [a + b, ""]])})`, `(${gxE([[2, "x"], [a + b, ""]])}) / (${gxE([[1, "x"], [a * b, ""]])})`], label: `addaf ${a},${b}`, skill: "adding algebraic fractions" }); },
      () => { const [a, b] = pick([[2, 3], [3, 4], [2, 5], [4, 5], [3, 5], [3, 6], [4, 6], [2, 6]]), x = a * b / gcd(a, b) * gfR(1, 4), c = x / a + x / b;
        return gfQ(`Solve x/${a} + x/${b} = ${c}.`, x, 3, `Multiply every term by ${a * b / gcd(a, b)} (1 mark): ${b / gcd(a, b)}x + ${a / gcd(a, b)}x = ${c * a * b / gcd(a, b)} (1 mark). x = ${x} (1 mark).`, { label: `fe ${a},${b},${x}`, skill: "equations with fractions" }); },
      () => { const a = gfR(2, 6), b = gfR(1, 9), ans = `x = (${b}y + ${a}) / (y − 1)`;
        return gfQ(`Make x the subject of y = (x + ${a}) / (x − ${b}).`, ans, 3, `Multiply out: xy − ${b}y = x + ${a} (1 mark). Get the x terms together: xy − x = ${b}y + ${a} (1 mark). Factorise and divide: ${ans} (1 mark).`, { options: [`x = (${b}y − ${a}) / (y − 1)`, `x = (${a}y + ${b}) / (y + 1)`], label: `subj2 ${a},${b}`, skill: "changing the subject" }); },
      () => { let r1, r2, m, n; do { r1 = gfR(-4, 4); r2 = gfR(-4, 4); m = gfR(-3, 3); n = gfR(-5, 5); } while (r1 >= r2 || !m || !n);
        const b = m - (r1 + r2), c = n + r1 * r2, pt = x => `(${gfM(x)}, ${gfM(m * x + n)})`, ans = `${pt(r1)} and ${pt(r2)}`;
        return gfQ(`Solve the simultaneous equations y = ${gxE([[m, "x"], [n, ""]])} and y = ${gxE([[1, "x²"], [b, "x"], [c, ""]])}.`, ans, 3, `Set them equal: ${gxE([[1, "x²"], [b - m, "x"], [c - n, ""]])} = 0 (1 mark). x = ${gfM(r1)} or x = ${gfM(r2)} (1 mark). Substitute for y: ${ans} (1 mark).`, { options: [`(${gfM(r1)}, ${gfM(m * r2 + n)}) and (${gfM(r2)}, ${gfM(m * r1 + n)})`, `(${gfM(-r1)}, ${gfM(-m * r1 + n)}) and (${gfM(-r2)}, ${gfM(-m * r2 + n)})`].filter(o => o !== ans), ps: true, label: `lq ${r1},${r2},${m},${n}`, skill: "a line and a curve" }); }
    ] },
    { id: "gh-functions", n: 4, short: "Functions", title: "Functions, iteration and harder sequences", strand: "Patterns and missing numbers",
      blurb: "Composite and inverse functions, iteration with a formula, the nth term of quadratic sequences and geometric sequences.", makers: [
      () => { const a = gfR(2, 5), b = gfR(-6, 6), c = gfR(-5, 5), k = gfR(-3, 4), fk = a * k + b, ans = fk * fk + c;
        return gfQ(`f(x) = ${gxE([[a, "x"], [b, ""]])} and g(x) = ${gxE([[1, "x²"], [c, ""]])}. Work out gf(${gfM(k)}).`, gfM(ans), 2, `f first: f(${gfM(k)}) = ${gfM(fk)} (1 mark). Then g(${gfM(fk)}) = ${gfM(ans)} (1 mark).`, { label: `gf ${a},${b},${c},${k}`, skill: "composite functions" }); },
      () => { const a = gfR(2, 9), b = gfR(-9, 9) || 4, ans = `f⁻¹(x) = (x ${b < 0 ? "+" : "−"} ${Math.abs(b)}) / ${a}`;
        return gfQ(`f(x) = ${gxE([[a, "x"], [b, ""]])}. Find f⁻¹(x).`, ans, 2, `Write y = ${gxE([[a, "x"], [b, ""]])} and rearrange for x: x = (y ${b < 0 ? "+" : "−"} ${Math.abs(b)}) / ${a} (1 mark). ${ans} (1 mark).`, { options: [`f⁻¹(x) = 1 / (${gxE([[a, "x"], [b, ""]])})`, `f⁻¹(x) = (x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) / ${a}`], label: `inv ${a},${b}`, skill: "inverse functions" }); },
      () => { const a = gfR(1, 6) * (rand(2) ? 1 : -1), ans = `(${gxE([[1, "x"], [a, ""]])})²`;
        return gfQ(`f(x) = ${gxE([[1, "x"], [a, ""]])} and g(x) = x². Find gf(x).`, ans, 1, `Put f(x) into g: ${ans} (1 mark). fg(x) would be ${gxE([[1, "x²"], [a, ""]])}: the order matters.`, { options: [gxE([[1, "x²"], [a, ""]]), gxE([[1, "x²"], [a * a, ""]]), gxE([[1, "x²"], [2 * a, "x"]])].filter((o, i, l) => l.indexOf(o) === i).slice(0, 2), label: `gfx ${a}`, skill: "composite functions" }); },
      () => { const a = gfR(1, 3), b = gfR(-5, 5), c = gfR(-6, 8) || 3, terms = range(1, 5).map(n => a * n * n + b * n + c).map(gfM).join(", "), ans = gxE([[a, "n²"], [b, "n"], [c, ""]]);
        return gfQ(`Find the nth term of the quadratic sequence ${terms}, …`, ans, 3, `Second differences are ${2 * a}, so ${gxE([[a, "n²"]])} (1 mark). Subtract ${gxE([[a, "n²"]])} and find the linear part, ${gxE([[b, "n"], [c, ""]])} (1 mark). ${ans} (1 mark).`, { options: [gxE([[2 * a, "n²"], [b, "n"], [c, ""]]), gxE([[a, "n²"], [b + 1, "n"], [c - 1, ""]])].filter(o => o !== ans), label: `qseq ${a},${b},${c}`, skill: "quadratic sequences" }); },
      () => { const a = gfR(3, 12), x0 = gfR(2, 4), it = x => Math.sqrt(a + x), x1 = it(x0), x2 = it(x1), x3 = it(x2); if (x0 * x0 === a + x0) return { label: "skip" };
        return gfQ(`Use the iteration formula xₙ₊₁ = √(${a} + xₙ) with x₀ = ${x0} to find x₃, to 3 decimal places.`, x3.toFixed(3), 3, `x₁ = √${a + x0} = ${x1.toFixed(4)}… (1 mark). x₂ = ${x2.toFixed(4)}… (1 mark). x₃ = ${x3.toFixed(3)} (1 mark). Keep the full value on the calculator with the ANS key.`, { calc: true, label: `iter ${a},${x0}`, skill: "iteration" }); },
      () => { const a = gfR(1, 5), r = pick([2, 3, -2]), n = pick([6, 7, 8]), v = a * r ** (n - 1);
        return gfQ(`The geometric sequence ${range(0, 3).map(i => gfM(a * r ** i)).join(", ")}, … has nth term ${a === 1 ? "" : `${a} × `}${r < 0 ? `(${gfM(r)})` : r}^(n − 1). Work out the ${gxOrd(n)} term.`, gfM(v), 2, `${a === 1 ? "" : `${a} × `}${r < 0 ? `(${gfM(r)})` : r}${sup(n - 1)} (1 mark) = ${gfM(v)} (1 mark).`, { label: `geon ${a},${r},${n}`, skill: "geometric sequences" }); }
    ] },
    { id: "gh-graphs", n: 5, short: "Graphs", title: "Perpendicular lines, circles and turning points", strand: "Patterns and missing numbers",
      blurb: "Perpendicular gradients, the equation of a circle and its tangent, turning points, graph transformations and the area under a graph.", makers: [
      () => { const m = pick([2, 3, 4, 5, -2, -3, -4, 1 / 2, -1 / 3, 2 / 3]), show = x => (Number.isInteger(x) ? gfM(x) : `${x < 0 ? "−" : ""}${gfF(Math.round(Math.abs(x) * 60), 60)}`), perp = -1 / m, ans = show(perp);
        return gfQ(`A line has gradient ${show(m)}. What is the gradient of a line perpendicular to it?`, ans, 1, `The negative reciprocal: −1 ÷ ${show(m)} = ${ans} (1 mark).`, { accept: [ans.replace("−", "-")], label: `perp ${m}`, skill: "perpendicular gradients" }); },
      () => { const m = pick([2, 3, -2, -3, 4]), M = Math.abs(m), x0 = gfR(-3, 3) * M, y0 = gfR(-5, 5), c = y0 + x0 / m, c2 = y0 - x0 / m;
        const line = (sign, k) => `y = ${sign < 0 ? "−" : ""}x/${M}${k ? ` ${k < 0 ? "−" : "+"} ${Math.abs(k)}` : ""}`, ans = line(-m, c);
        return gfQ(`Find the equation of the line perpendicular to y = ${gxE([[m, "x"], [1, ""]])} that passes through (${gfM(x0)}, ${gfM(y0)}).`, ans, 3, `Perpendicular gradient ${m > 0 ? "−" : ""}1/${M} (1 mark). Substitute (${gfM(x0)}, ${gfM(y0)}) to find c = ${gfM(c)} (1 mark). ${ans} (1 mark).`, { options: [`y = ${gxE([[m, "x"], [y0 - m * x0, ""]])}`, line(m, c2)].filter(o => o !== ans), label: `perpeq ${m},${x0},${y0}`, skill: "perpendicular lines" }); },
      () => { const r = gfR(2, 12), what = rand(2);
        return what ? gfQ(`A circle has equation x² + y² = ${r * r}. Write down its radius.`, r, 1, `x² + y² = r², so r = √${r * r} = ${r} (1 mark).`, { label: `circ ${r}`, skill: "the equation of a circle" })
          : gfQ(`Write down the equation of the circle with centre (0, 0) and radius ${r}.`, `x² + y² = ${r * r}`, 1, `x² + y² = r² = ${r * r} (1 mark).`, { options: [`x² + y² = ${r}`, `x² + y² = ${2 * r}`, `x² + y² = ${2 * r * r}`].filter((o, i, l) => o !== `x² + y² = ${r * r}` && l.indexOf(o) === i).slice(0, 2), label: `circeq ${r}`, skill: "the equation of a circle" }); },
      () => { const [a, b] = pick([[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6], [1, 2], [2, 1]]), sx = pick([1, -1]), sy = pick([1, -1]), x = a * sx, y = b * sy, rr = a * a + b * b, ans = `${gxE([[x, "x"], [y, "y"]])} = ${rr}`;
        return gfQ(`The point (${gfM(x)}, ${gfM(y)}) is on the circle x² + y² = ${rr}. Find the equation of the tangent at this point, in the form ax + by = c.`, ans, 3, `Gradient of the radius: ${x * y < 0 ? "−" : ""}${gfF(Math.abs(y), Math.abs(x))} (1 mark). The tangent is perpendicular: gradient ${x * y > 0 ? "−" : ""}${gfF(Math.abs(x), Math.abs(y))} (1 mark). Through (${gfM(x)}, ${gfM(y)}): ${ans} (1 mark).`, { options: [`${gxE([[y, "x"], [x, "y"]])} = ${rr}`, `${gxE([[x, "x"], [-y, "y"]])} = ${rr}`].filter(o => o !== ans), label: `tan ${x},${y}`, skill: "tangents to circles" }); },
      () => { const p = gfR(-6, 6) || 2, q = gfR(-10, 10), ans = `(${gfM(-p)}, ${gfM(q - p * p)})`;
        return gfQ(`Find the turning point of y = ${gxE([[1, "x²"], [2 * p, "x"], [q, ""]])}.`, ans, 2, `Complete the square: (x ${p < 0 ? "−" : "+"} ${Math.abs(p)})² ${q - p * p < 0 ? "−" : "+"} ${Math.abs(q - p * p)} (1 mark). The turning point is ${ans} (1 mark).`, { options: [`(${gfM(p)}, ${gfM(q - p * p)})`, `(${gfM(-p)}, ${gfM(q)})`].filter(o => o !== ans), label: `tp ${p},${q}`, skill: "turning points" }); },
      () => { const a = gfR(1, 6), [f, ans, o] = pick([[`f(x + ${a})`, `Left ${a}`, [`Right ${a}`, `Up ${a}`]], [`f(x − ${a})`, `Right ${a}`, [`Left ${a}`, `Down ${a}`]], [`f(x) + ${a}`, `Up ${a}`, [`Left ${a}`, `Down ${a}`]], [`f(x) − ${a}`, `Down ${a}`, [`Right ${a}`, `Up ${a}`]], ["−f(x)", "Reflected in the x-axis", ["Reflected in the y-axis", `Down ${a}`]], ["f(−x)", "Reflected in the y-axis", ["Reflected in the x-axis", `Left ${a}`]]]);
        return gfQ(`How does the graph of y = ${f} compare with the graph of y = f(x)?`, ans, 1, `${ans} (1 mark). Inside the bracket works the opposite way to what it looks like.`, { options: o, label: `trans ${f}`, skill: "graph transformations" }); },
      () => { const v1 = gfR(2, 10), v2 = v1 + gfR(2, 10), t = gfR(2, 8) * 5;
        return gfQ(`A car speeds up steadily from ${v1} m/s to ${v2} m/s in ${t} seconds. Use the area under the speed-time graph to work out how far it travels. (m)`, gfD((v1 + v2) / 2 * t), 2, `The area is a trapezium: ½ × (${v1} + ${v2}) × ${t} (1 mark) = ${gfD((v1 + v2) / 2 * t)} m (1 mark).`, { unit: "m", label: `vt ${v1},${v2},${t}`, skill: "area under a graph" }); }
    ] },
    { id: "gh-variation", n: 6, short: "Proportion and bounds", title: "Direct and inverse proportion, and bounds", strand: "Number",
      blurb: "Proportion with squares and roots, inverse proportion, error intervals, upper and lower bounds in calculations, and growth over time.", makers: [
      () => { const k = gfR(2, 6), x1 = gfR(2, 5), x2 = gfR(6, 10);
        return gfQ(`y is directly proportional to x². When x = ${x1}, y = ${k * x1 * x1}. Work out y when x = ${x2}.`, k * x2 * x2, 3, `y = kx² (1 mark). ${k * x1 * x1} = k × ${x1 * x1}, so k = ${k} (1 mark). y = ${k} × ${x2}² = ${k * x2 * x2} (1 mark).`, { label: `dp ${k},${x1},${x2}`, skill: "direct proportion" }); },
      () => { const x1 = gfR(2, 6), x2 = pick([2, 3, 4, 5, 6, 8, 10, 12].filter(v => v !== x1)), k = x1 * x2 * gfR(1, 4);
        return gfQ(`y is inversely proportional to x. When x = ${x1}, y = ${k / x1}. Work out y when x = ${x2}.`, k / x2, 3, `y = k/x (1 mark). k = ${x1} × ${k / x1} = ${k} (1 mark). y = ${k} ÷ ${x2} = ${k / x2} (1 mark).`, { label: `ip ${x1},${x2},${k}`, skill: "inverse proportion" }); },
      () => { const [n, d, unit] = pick([[gfR(5, 90), 1, "cm"], [gfR(10, 99) * 10, 10, "g"], [gfR(21, 99) / 10, 0.1, "m"], [gfR(2, 40) * 100, 100, "people"]]), lo = gfD(n - d / 2), hi = gfD(n + d / 2), ans = `${lo} ≤ x < ${hi}`;
        const how = d === 1 ? "the nearest whole number" : d === 0.1 ? "1 decimal place" : `the nearest ${d}`;
        return gfQ(`A value x is ${gfD(n)} ${unit}, rounded to ${how}. Write down its error interval.`, ans, 2, `Half of ${gfD(d)} is ${gfD(d / 2)} either side (1 mark). ${ans} (1 mark): the upper bound uses <.`, { options: [`${lo} < x ≤ ${hi}`, `${gfD(n - d)} ≤ x < ${gfD(n + d)}`], label: `err ${n},${d}`, skill: "error intervals" }); },
      () => { const a = gfR(4, 15), b = gfR(4, 15), up = rand(2), v = up ? (a + 0.5) * (b + 0.5) : (a - 0.5) * (b - 0.5);
        return gfQ(`A rectangle is ${a} cm by ${b} cm, each to the nearest cm. Work out the ${up ? "upper" : "lower"} bound of its area. (cm²)`, gfD(v), 2, `The ${up ? "upper" : "lower"} bounds of the sides are ${gfD(a + (up ? 0.5 : -0.5))} and ${gfD(b + (up ? 0.5 : -0.5))} (1 mark). ${gfD(a + (up ? 0.5 : -0.5))} × ${gfD(b + (up ? 0.5 : -0.5))} = ${gfD(v)} cm² (1 mark).`, { unit: "cm²", calc: true, label: `ba ${a},${b},${up}`, skill: "bounds in calculations" }); },
      () => { const d = gfR(80, 200), t = gfR(15, 40) / 10, r = ((d + 0.5) / (t - 0.05)).toFixed(2);
        return gfQ(`A car travels ${d} km (to the nearest km) in ${gfD(t)} hours (to 1 decimal place). Work out the upper bound of its average speed, to 2 decimal places. (km/h)`, r, 3, `The upper bound of speed uses the biggest distance and the smallest time (1 mark): ${gfD(d + 0.5)} ÷ ${gfD(t - 0.05)} (1 mark) = ${r} km/h (1 mark).`, { unit: "km/h", calc: true, ps: true, label: `bs ${d},${t}`, skill: "bounds in calculations" }); },
      () => { const r = pick([5, 8, 10, 12, 15, 20]), target = pick([2, 3]); let n = 0, v = 1; while (v < target) { v *= 1 + r / 100; n++; }
        return gfQ(`A population grows by ${r}% a year. After how many whole years will it first be more than ${target === 2 ? "double" : "three times"} its size now?`, n, 3, `The multiplier is ${gfD(1 + r / 100)} (1 mark). Try powers: ${gfD(1 + r / 100)}${sup(n - 1)} = ${(v / (1 + r / 100)).toFixed(3)} and ${gfD(1 + r / 100)}${sup(n)} = ${v.toFixed(3)} (1 mark). ${n} years (1 mark).`, { calc: true, ps: true, label: `grow ${r},${target}`, skill: "growth over time" }); }
    ] },
    { id: "gh-trig", n: 7, short: "Sine and cosine rules", title: "Sine rule, cosine rule and 3D trigonometry", strand: "Shape and angles",
      blurb: "The sine and cosine rules for any triangle, the area ½ab sin C, and lengths in three dimensions.", makers: [
      () => { const A = gfR(30, 80), B = gfR(30, 80), b = gfR(5, 20), a = b * Math.sin(A * Math.PI / 180) / Math.sin(B * Math.PI / 180);
        return gfQ(`In triangle ABC, angle A = ${A}°, angle B = ${B}° and side b = ${b} cm. Work out side a, to 1 decimal place. (cm)`, a.toFixed(1), 3, `Sine rule: a/sin ${A}° = ${b}/sin ${B}° (1 mark). a = ${b} × sin ${A}° ÷ sin ${B}° (1 mark) = ${a.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, label: `sr ${A},${B},${b}`, skill: "the sine rule" }); },
      () => { const a = gfR(5, 15), b = gfR(5, 15), C = gfR(30, 120), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * Math.PI / 180));
        return gfQ(`In triangle ABC, a = ${a} cm, b = ${b} cm and angle C = ${C}°. Work out side c, to 1 decimal place. (cm)`, c.toFixed(1), 3, `Cosine rule: c² = ${a}² + ${b}² − 2 × ${a} × ${b} × cos ${C}° (1 mark) = ${(c * c).toFixed(2)} (1 mark). c = ${c.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, label: `cr ${a},${b},${C}`, skill: "the cosine rule" }); },
      () => { let a, b, c; do { a = gfR(4, 12); b = gfR(4, 12); c = gfR(4, 12); } while (a + b <= c || a + c <= b || b + c <= a); const C = Math.acos((a * a + b * b - c * c) / (2 * a * b)) * 180 / Math.PI;
        return gfQ(`A triangle has sides a = ${a} cm, b = ${b} cm and c = ${c} cm. Work out angle C, opposite side c, to 1 decimal place. (°)`, C.toFixed(1), 3, `cos C = (${a}² + ${b}² − ${c}²) ÷ (2 × ${a} × ${b}) (1 mark) = ${gfD((a * a + b * b - c * c) / (2 * a * b))} (1 mark). C = ${C.toFixed(1)}° (1 mark).`, { unit: "°", calc: true, label: `ca ${a},${b},${c}`, skill: "the cosine rule for an angle" }); },
      () => { const a = gfR(4, 15), b = gfR(4, 15), C = gfR(25, 140), area = 0.5 * a * b * Math.sin(C * Math.PI / 180);
        return gfQ(`Work out the area of a triangle with sides ${a} cm and ${b} cm and an angle of ${C}° between them, to 1 decimal place. (cm²)`, area.toFixed(1), 2, `Area = ½ab sin C = ½ × ${a} × ${b} × sin ${C}° (1 mark) = ${area.toFixed(1)} cm² (1 mark).`, { unit: "cm²", calc: true, label: `area ${a},${b},${C}`, skill: "area of a triangle" }); },
      () => { const A = gfR(30, 70), a = gfR(8, 15), b = gfR(4, a - 1), B = Math.asin(b * Math.sin(A * Math.PI / 180) / a) * 180 / Math.PI;
        return gfQ(`In triangle ABC, angle A = ${A}°, a = ${a} cm and b = ${b} cm. Work out the acute angle B, to 1 decimal place. (°)`, B.toFixed(1), 3, `Sine rule: sin B / ${b} = sin ${A}° / ${a} (1 mark). sin B = ${(b * Math.sin(A * Math.PI / 180) / a).toFixed(4)} (1 mark). B = ${B.toFixed(1)}° (1 mark).`, { unit: "°", calc: true, label: `sa ${A},${a},${b}`, skill: "the sine rule for an angle" }); },
      () => { const [know, ans] = pick([["two angles and a side", "Sine rule"], ["two sides and the angle between them, and you want the third side", "Cosine rule"], ["all three sides, and you want an angle", "Cosine rule"], ["two sides and an angle opposite one of them", "Sine rule"], ["two sides and the angle between them, and you want the area", "½ab sin C"]]);
        return gfQ(`A triangle has no right angle. You know ${know}. What do you use?`, ans, 1, `${ans} (1 mark). Sine rule for opposite pairs; cosine rule for three sides, or two sides and the angle between.`, { options: ["Sine rule", "Cosine rule", "½ab sin C", "SOH CAH TOA"].filter(o => o !== ans).slice(0, 2), label: `which ${know}`, skill: "choosing a rule" }); },
      () => { const a = gfR(3, 12), b = gfR(3, 12), c = gfR(3, 12), d = Math.sqrt(a * a + b * b + c * c);
        if (Number.isInteger(d)) return { label: "skip" };
        return gfQ(`A cuboid is ${a} cm by ${b} cm by ${c} cm. Work out the length of its longest diagonal, to 1 decimal place. (cm)`, d.toFixed(1), 3, `The base diagonal² = ${a}² + ${b}² = ${a * a + b * b} (1 mark). Diagonal² = ${a * a + b * b} + ${c}² = ${a * a + b * b + c * c} (1 mark). √${a * a + b * b + c * c} = ${d.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, ps: true, label: `3d ${a},${b},${c}`, skill: "3D Pythagoras" }); }
    ] },
    { id: "gh-circles", n: 8, short: "Circle theorems", title: "Circle theorems", strand: "Shape and angles",
      blurb: "The angle at the centre, angles in a semicircle and the same segment, cyclic quadrilaterals, tangents and the alternate segment theorem.", makers: [
      () => { const x = gfR(20, 85);
        return gfQ(`A, B and C are on a circle with centre O. Angle ACB = ${x}°. Work out angle AOB, and give a reason. (°)`, 2 * x, 2, `${2 * x}° (1 mark). The angle at the centre is twice the angle at the circumference (1 mark).`, { unit: "°", label: `centre ${x}`, skill: "angle at the centre" }); },
      () => { const x = gfR(15, 75);
        return gfQ(`AB is a diameter of a circle and C is on the circle. Angle CAB = ${x}°. Work out angle CBA. (°)`, 90 - x, 2, `Angle ACB = 90°: the angle in a semicircle is a right angle (1 mark). 180° − 90° − ${x}° = ${90 - x}° (1 mark).`, { unit: "°", label: `semi ${x}`, skill: "angle in a semicircle" }); },
      () => { const x = gfR(50, 130);
        return gfQ(`ABCD is a cyclic quadrilateral. Angle ABC = ${x}°. Work out angle ADC, and give a reason. (°)`, 180 - x, 2, `${180 - x}° (1 mark). Opposite angles of a cyclic quadrilateral add up to 180° (1 mark).`, { unit: "°", label: `cyc ${x}`, skill: "cyclic quadrilaterals" }); },
      () => { const x = gfR(20, 70);
        return gfQ(`A, B, C and D are on a circle. Angle ACB = ${x}°. C and D are on the same side of AB. Work out angle ADB, and give a reason. (°)`, x, 2, `${x}° (1 mark). Angles in the same segment are equal (1 mark).`, { unit: "°", label: `seg ${x}`, skill: "angles in the same segment" }); },
      () => { const x = gfR(20, 70);
        return gfQ(`A tangent touches a circle, centre O, at A. T is on the tangent. Angle AOT = ${x}°. Work out angle ATO. (°)`, 90 - x, 2, `Angle OAT = 90°: a tangent meets a radius at 90° (1 mark). 180° − 90° − ${x}° = ${90 - x}° (1 mark).`, { unit: "°", label: `tanrad ${x}`, skill: "tangent and radius" }); },
      () => { const x = gfR(35, 80);
        return gfQ(`A tangent touches a circle at A. B and C are on the circle. The angle between the tangent and chord AB is ${x}°. Work out angle ACB, and give a reason. (°)`, x, 2, `${x}° (1 mark). The alternate segment theorem: the angle between a tangent and a chord equals the angle in the alternate segment (1 mark).`, { unit: "°", label: `alt ${x}`, skill: "alternate segment theorem" }); },
      () => { const p = gfR(30, 110);
        return gfQ(`Two tangents from a point P touch a circle, centre O, at A and B. Angle APB = ${p}°. Work out angle AOB. (°)`, 180 - p, 2, `Angles OAP and OBP are 90°: tangent meets radius (1 mark). The angles in quadrilateral OAPB add up to 360°: 360° − 90° − 90° − ${p}° = ${180 - p}° (1 mark).`, { unit: "°", ps: true, label: `twotan ${p}`, skill: "tangents from a point" }); }
    ] },
    { id: "gh-solids", n: 9, short: "Sectors and solids", title: "Arcs, sectors, cones and spheres", strand: "Measurement",
      blurb: "Arc length and sector area, the volume and surface area of cones and spheres, and answers in terms of π.", makers: [
      () => { const r = gfR(4, 15), t = pick([30, 40, 45, 60, 72, 80, 100, 120, 135, 150]), l = t / 360 * 2 * Math.PI * r;
        return gfQ(`A sector has radius ${r} cm and angle ${t}°. Work out its arc length, to 1 decimal place. (cm)`, l.toFixed(1), 2, `${t}/360 × 2 × π × ${r} (1 mark) = ${l.toFixed(1)} cm (1 mark).`, { unit: "cm", calc: true, label: `arc ${r},${t}`, skill: "arc length" }); },
      () => { const r = gfR(4, 15), t = pick([30, 40, 45, 60, 72, 80, 100, 120, 135, 150]), a = t / 360 * Math.PI * r * r;
        return gfQ(`A sector has radius ${r} cm and angle ${t}°. Work out its area, to 1 decimal place. (cm²)`, a.toFixed(1), 2, `${t}/360 × π × ${r}² (1 mark) = ${a.toFixed(1)} cm² (1 mark).`, { unit: "cm²", calc: true, label: `sec ${r},${t}`, skill: "sector area" }); },
      () => { const r = gfR(2, 12), v = 4 / 3 * Math.PI * r ** 3;
        return gfQ(`Work out the volume of a sphere with radius ${r} cm, to 1 decimal place. (cm³)`, v.toFixed(1), 2, `4/3 × π × ${r}³ (1 mark) = ${v.toFixed(1)} cm³ (1 mark).`, { unit: "cm³", calc: true, label: `sph ${r}`, skill: "volume of a sphere" }); },
      () => { const r = gfR(2, 10), h = gfR(4, 20), v = Math.PI * r * r * h / 3;
        return gfQ(`A cone has radius ${r} cm and height ${h} cm. Work out its volume, to 1 decimal place. (cm³)`, v.toFixed(1), 2, `⅓ × π × ${r}² × ${h} (1 mark) = ${v.toFixed(1)} cm³ (1 mark).`, { unit: "cm³", calc: true, label: `cone ${r},${h}`, skill: "volume of a cone" }); },
      () => { const [r, h, l] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]]), s = Math.PI * r * l;
        return gfQ(`A cone has radius ${r} cm and vertical height ${h} cm. Work out its curved surface area, to 1 decimal place. (cm²)`, s.toFixed(1), 3, `Slant height by Pythagoras: √(${r}² + ${h}²) = ${l} cm (1 mark). Curved area = π × ${r} × ${l} (1 mark) = ${s.toFixed(1)} cm² (1 mark).`, { unit: "cm²", calc: true, ps: true, label: `csa ${r},${h}`, skill: "surface area of a cone" }); },
      () => { const r = gfR(2, 10), ans = `${3 * r * r}π`;
        return gfQ(`A solid hemisphere has radius ${r} cm. Work out its total surface area, in terms of π. (cm²)`, ans, 2, `The curved part is half of 4π × ${r}² = ${2 * r * r}π (1 mark). Add the flat circle, ${r * r}π: ${ans} cm² (1 mark).`, { options: [`${2 * r * r}π`, `${4 * r * r}π`], label: `hemi ${r}`, skill: "surface area of a sphere" }); }
    ] },
    { id: "gh-similar", n: 10, short: "Similarity", title: "Similar shapes: lengths, areas and volumes, and congruence", strand: "Shape and angles",
      blurb: "Area and volume scale factors, working back from an area or volume to a length, and the conditions for congruent triangles.", makers: [
      () => { const k = gfR(2, 5), a = gfR(3, 30);
        return gfQ(`Two shapes are similar. The lengths of the larger are ${k} times the smaller. The smaller has area ${a} cm². Work out the area of the larger. (cm²)`, a * k * k, 2, `The area scale factor is ${k}² = ${k * k} (1 mark). ${a} × ${k * k} = ${a * k * k} cm² (1 mark).`, { unit: "cm²", label: `as ${k},${a}`, skill: "area scale factor" }); },
      () => { const [p, q] = pick([[1, 2], [2, 3], [1, 3], [3, 4], [2, 5]]), v = p ** 3 * gfR(1, 8);
        return gfQ(`Two similar bottles have heights in the ratio ${p} : ${q}. The small one holds ${v} ml. How much does the large one hold? (ml)`, v / p ** 3 * q ** 3, 2, `The volume scale factor is (${q}/${p})³ = ${gfF(q ** 3, p ** 3)} (1 mark). ${v} × ${gfF(q ** 3, p ** 3)} = ${v / p ** 3 * q ** 3} ml (1 mark).`, { unit: "ml", label: `vs ${p},${q},${v}`, skill: "volume scale factor" }); },
      () => { const [p, q] = pick([[2, 3], [3, 4], [4, 5], [2, 5], [3, 5], [5, 7]]), L = p * gfR(1, 5);
        return gfQ(`Two similar shapes have areas in the ratio ${p * p} : ${q * q}. A side on the smaller shape is ${L} cm. Work out the matching side on the larger. (cm)`, gfD(L / p * q), 3, `The length scale factor is the square root: √${p * p} : √${q * q} = ${p} : ${q} (1 mark). ${L} ÷ ${p} × ${q} (1 mark) = ${gfD(L / p * q)} cm (1 mark).`, { unit: "cm", ps: true, label: `al ${p},${q},${L}`, skill: "working back to lengths" }); },
      () => { const [p, q] = pick([[1, 2], [2, 3], [1, 3], [3, 4]]), A = p * p * gfR(2, 9);
        return gfQ(`Two similar solids have volumes in the ratio ${p ** 3} : ${q ** 3}. The smaller has surface area ${A} cm². Work out the surface area of the larger. (cm²)`, A / (p * p) * q * q, 3, `Length ratio ${p} : ${q}, the cube root (1 mark). Area ratio ${p * p} : ${q * q} (1 mark). ${A} ÷ ${p * p} × ${q * q} = ${A / (p * p) * q * q} cm² (1 mark).`, { unit: "cm²", ps: true, label: `va ${p},${q},${A}`, skill: "volume to area" }); },
      () => { const [d, ans] = pick([["all three sides equal", "SSS"], ["two sides and the angle between them equal", "SAS"], ["two angles and the side between them equal", "ASA"], ["a right angle, the hypotenuse and one other side equal", "RHS"]]);
        return gfQ(`Two triangles have ${d}. Which condition shows they are congruent?`, ans, 1, `${ans} (1 mark). AAA is not a condition: equal angles only show triangles are similar.`, { options: ["SSS", "SAS", "ASA", "RHS", "AAA"].filter(o => o !== ans).slice(0, 2).concat(["AAA"]).filter((o, i, l) => l.indexOf(o) === i && o !== ans), label: `cong ${ans}`, skill: "congruent triangles" }); }
    ] },
    { id: "gh-vectors", n: 11, short: "Vectors", title: "Vectors", strand: "Shape and angles",
      blurb: "Adding and multiplying column vectors, magnitude, writing vectors along a path, midpoints and parallel vectors.", makers: [
      () => { const a = [gfR(-5, 5), gfR(-5, 5)], b = [gfR(-5, 5), gfR(-5, 5)], p = gfR(2, 3), q = gfR(1, 3), r = [p * a[0] - q * b[0], p * a[1] - q * b[1]], v = x => `(${gfM(x[0])}, ${gfM(x[1])})`;
        return gfQ(`a = ${v(a)} and b = ${v(b)}, written across as (x, y). Work out ${p}a − ${q === 1 ? "" : q}b.`, v(r), 2, `${p}a = ${v([p * a[0], p * a[1]])} and ${q === 1 ? "" : q}b = ${v([q * b[0], q * b[1]])} (1 mark). Subtract: ${v(r)} (1 mark).`, { options: [v([p * a[0] + q * b[0], p * a[1] + q * b[1]]), v([a[0] - b[0], a[1] - b[1]]), v([r[1], r[0]]), v([r[0] + 1, r[1]])].filter((o, i, l) => o !== v(r) && l.indexOf(o) === i).slice(0, 2), label: `vec ${a},${b},${p},${q}`, skill: "column vectors" }); },
      () => { const [x, y, m] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [-3, 4, 5], [12, -5, 13], [-6, -8, 10]]);
        return gfQ(`Work out the magnitude (length) of the vector (${gfM(x)}, ${gfM(y)}).`, m, 2, `Pythagoras: √(${gfM(x)}² + ${gfM(y)}²) (1 mark) = √${m * m} = ${m} (1 mark).`, { label: `mag ${x},${y}`, skill: "magnitude" }); },
      () => { const ans = "b − a";
        return gfQ(`OA = a and OB = b. Write the vector AB in terms of a and b.`, ans, 1, `Go from A back to O, then out to B: −a + b = b − a (1 mark).`, { options: ["a − b", "a + b"], label: "ab", skill: "vectors along a path" }); },
      () => { const ans = "½a + ½b";
        return gfQ(`OA = a and OB = b. M is the midpoint of AB. Write OM in terms of a and b.`, ans, 2, `AB = b − a (1 mark). OM = a + ½(b − a) = ½a + ½b (1 mark).`, { options: ["½b − ½a", "a + b"], label: "mid", skill: "vectors along a path" }); },
      () => { const [p, q] = pick([[1, 2], [1, 3], [2, 1], [3, 1]]), n = p + q, ans = `${gfF(q, n)}a + ${gfF(p, n)}b`.replace(/^1a/, "a").replace(/\+ 1b$/, "+ b");
        return gfQ(`OA = a and OB = b. P is on AB with AP : PB = ${p} : ${q}. Write OP in terms of a and b.`, ans, 3, `AB = b − a (1 mark). AP = ${gfF(p, n)}(b − a) (1 mark). OP = a + ${gfF(p, n)}(b − a) = ${ans} (1 mark).`, { options: [`${gfF(p, n)}a + ${gfF(q, n)}b`, `${gfF(p, q)}a + b`].filter(o => o !== ans), label: `ratio ${p},${q}`, skill: "vectors and ratio" }); },
      () => { const a = gfR(1, 5), b = gfR(1, 6), k = gfR(2, 5);
        return gfQ(`The vectors (${a}, ${b}) and (x, ${k * b}) are parallel. Work out x.`, k * a, 2, `Parallel vectors are multiples of each other: ${k * b} = ${k} × ${b} (1 mark). x = ${k} × ${a} = ${k * a} (1 mark).`, { label: `par ${a},${b},${k}`, skill: "parallel vectors" }); }
    ] },
    { id: "gh-probability", n: 12, short: "Conditional probability", title: "Conditional probability and set notation", strand: "Data and chance",
      blurb: "Taking without replacing, conditional probability from tables and Venn diagrams, set notation and testing for independence.", makers: [
      () => { const r = gfR(3, 8), b = gfR(2, 7), n = r + b, ans = gfF(r * (r - 1), n * (n - 1));
        return gfQ(`A bag has ${r} red and ${b} blue counters. Two are taken without replacement. Work out the probability that both are red.`, ans, 3, `First red: ${r}/${n} (1 mark). Second red: ${r - 1}/${n - 1}, one fewer of each (1 mark). ${r}/${n} × ${r - 1}/${n - 1} = ${ans} (1 mark).`, { accept: gxFr(r * (r - 1), n * (n - 1)), label: `wr ${r},${b}`, skill: "without replacement" }); },
      () => { const r = gfR(3, 7), b = gfR(3, 7), n = r + b, top = r * (r - 1) + b * (b - 1), ans = gfF(top, n * (n - 1));
        return gfQ(`A box has ${r} milk and ${b} dark chocolates. Two are eaten, one after the other. Work out the probability that they are the same kind.`, ans, 3, `Both milk: ${r}/${n} × ${r - 1}/${n - 1} (1 mark). Both dark: ${b}/${n} × ${b - 1}/${n - 1} (1 mark). Add: ${ans} (1 mark).`, { accept: gxFr(top, n * (n - 1)), ps: true, label: `same ${r},${b}`, skill: "without replacement" }); },
      () => { const a = gfR(5, 20), b = gfR(5, 20), c = gfR(5, 20), d = gfR(5, 20), ans = gfF(a, a + c);
        return gfQ(`Of ${a + b} boys, ${a} play football; of ${c + d} girls, ${c} play football. A pupil who plays football is picked at random. Work out the probability it is a boy.`, ans, 2, `Only the ${a + c} who play football count (1 mark). ${a}/${a + c}${ans === `${a}/${a + c}` ? "" : ` = ${ans}`} (1 mark).`, { accept: gxFr(a, a + c), label: `cond ${a},${b},${c},${d}`, skill: "conditional probability" }); },
      () => { const ab = gfR(2, 9), a = ab + gfR(2, 10), b = ab + gfR(2, 10), out = gfR(1, 9), tot = a + b - ab + out, what = rand(3);
        const [q, num, how] = [[`P(A ∪ B)`, a + b - ab, `A ∪ B means in A or B or both: ${a} + ${b} − ${ab} = ${a + b - ab}`], [`P(A ∩ B′)`, a - ab, `A ∩ B′ means in A but not B: ${a} − ${ab} = ${a - ab}`], [`P(A′)`, tot - a, `A′ means not in A: ${tot} − ${a} = ${tot - a}`]][what];
        return gfQ(`In a group of ${tot}, ${a} are in set A, ${b} are in set B and ${ab} are in both. One person is chosen at random. Work out ${q}.`, gfF(num, tot), 2, `${how} (1 mark). ${gfF(num, tot)} (1 mark).`, { accept: gxFr(num, tot), label: `set ${a},${b},${ab},${out},${what}`, skill: "set notation" }); },
      () => { const pa = pick([0.2, 0.3, 0.4, 0.5, 0.6]), pb = pick([0.2, 0.5, 0.25, 0.4]), ind = rand(2), pab = ind ? pa * pb : pa * pb + (pa * pb < 0.1 ? 0.05 : pick([0.05, -0.05])), ans = ind ? "Yes" : "No";
        return gfQ(`P(A) = ${gfD(pa)}, P(B) = ${gfD(pb)} and P(A and B) = ${gfD(pab)}. Are A and B independent?`, ans, 2, `For independent events P(A and B) = P(A) × P(B) = ${gfD(pa * pb)} (1 mark). ${ind ? "It matches, so yes" : `${gfD(pab)} is not ${gfD(pa * pb)}, so no`} (1 mark).`, { options: [ind ? "No" : "Yes"], label: `ind ${pa},${pb},${ind}`, skill: "independence" }); },
      () => { const pa = pick([0.4, 0.5, 0.6, 0.8, 0.25]), pba = pick([0.2, 0.3, 0.5, 0.6, 0.4]), pab = Math.round(pa * pba * 1000) / 1000;
        return gfQ(`P(A) = ${gfD(pa)} and P(A and B) = ${gfD(pab)}. Work out P(B given A).`, gfD(pba), 2, `P(B | A) = P(A and B) ÷ P(A) (1 mark) = ${gfD(pab)} ÷ ${gfD(pa)} = ${gfD(pba)} (1 mark).`, { label: `cba ${pa},${pba}`, skill: "conditional probability" }); }
    ] },
    { id: "gh-statistics", n: 13, short: "Histograms", title: "Histograms, cumulative frequency and box plots", strand: "Data and chance",
      blurb: "Frequency density, reading histograms, quartiles and the interquartile range, box plots, and capture-recapture.", makers: [
      () => { const w = pick([5, 10, 20, 15, 25]), fd = gfR(1, 12) / (rand(2) ? 1 : 2), f = fd * w; if (!Number.isInteger(f)) return { label: "skip" };
        return gfQ(`A class is ${w} cm wide and has frequency ${f}. Work out its frequency density.`, gfD(fd), 1, `Frequency ÷ class width: ${f} ÷ ${w} = ${gfD(fd)} (1 mark).`, { label: `fd ${w},${f}`, skill: "frequency density" }); },
      () => { const a = gfR(1, 6) * 10, w = pick([5, 10, 20]), fd = gfR(2, 9) / (w === 5 ? 1 : 2), f = fd * w;
        return gfQ(`On a histogram, the bar for ${a} < t ≤ ${a + w} has frequency density ${gfD(fd)}. How many values are in this class?`, gfD(f), 2, `Frequency = frequency density × class width (1 mark): ${gfD(fd)} × ${w} = ${gfD(f)} (1 mark).`, { label: `freq ${a},${w},${fd}`, skill: "reading histograms" }); },
      () => { const xs = range(1, 11).map(() => gfR(10, 60)).sort((p, q) => p - q), lq = xs[2], uq = xs[8];
        return gfQ(`Find the interquartile range of ${xs.join(", ")}.`, uq - lq, 2, `There are 11 values: the lower quartile is the 3rd, ${lq}, and the upper quartile the 9th, ${uq} (1 mark). ${uq} − ${lq} = ${uq - lq} (1 mark).`, { label: `iqr ${xs}`, skill: "interquartile range" }); },
      () => { const mn = gfR(5, 20), lq = mn + gfR(3, 10), md = lq + gfR(2, 8), uq = md + gfR(2, 9), mx = uq + gfR(3, 12), what = rand(2);
        return gfQ(`A box plot shows: lowest ${mn}, lower quartile ${lq}, median ${md}, upper quartile ${uq}, highest ${mx}. Work out the ${what ? "interquartile range" : "range"}.`, what ? uq - lq : mx - mn, 1, `${what ? `${uq} − ${lq}` : `${mx} − ${mn}`} = ${what ? uq - lq : mx - mn} (1 mark).`, { label: `box ${mn},${lq},${md},${uq},${mx},${what}`, skill: "box plots" }); },
      () => { const m1 = gfR(30, 50), m2 = m1 + gfR(3, 10) * (rand(2) ? 1 : -1), i1 = gfR(6, 15), i2 = i1 + gfR(2, 8) * (rand(2) ? 1 : -1); if (i2 <= 0 || i1 === i2) return { label: "skip" };
        const hi = m2 > m1 ? "Year 11" : "Year 10", con = i2 < i1 ? "Year 11" : "Year 10", ans = `${hi} did better on average (higher median), and ${con} were more consistent (smaller interquartile range)`;
        return gfQ(`Test scores. Year 10: median ${m1}, IQR ${i1}. Year 11: median ${m2}, IQR ${i2}. Which comparison is right?`, ans, 2, `Higher median: ${hi} (1 mark). Smaller IQR is more consistent: ${con} (1 mark).`, { options: [`${hi === "Year 10" ? "Year 11" : "Year 10"} did better on average (higher median), and ${con} were more consistent (smaller interquartile range)`, `${hi} did better on average (higher median), and ${con === "Year 10" ? "Year 11" : "Year 10"} were more consistent (larger interquartile range)`], label: `cmpbox ${m1},${m2},${i1},${i2}`, skill: "comparing box plots" }); },
      () => { const N = gfR(20, 80) * 10, M = gfR(3, 8) * 10, n = gfR(4, 10) * 10, m = M * n / N; if (!Number.isInteger(m) || m < 2) return { label: "skip" };
        return gfQ(`${M} fish in a lake are caught, tagged and released. Later, ${n} fish are caught and ${m} of them are tagged. Estimate the number of fish in the lake.`, N, 2, `The fraction tagged in the sample, ${m}/${n}, matches ${M}/N (1 mark). N = ${M} × ${n} ÷ ${m} = ${N} (1 mark).`, { ps: true, label: `cr ${M},${n},${m}`, skill: "capture-recapture" }); }
    ] },
    { id: "gh-proof", n: 14, short: "Proof", title: "Proof, recurring decimals and quadratic inequalities", strand: "Patterns and missing numbers",
      blurb: "Algebraic proof, counterexamples, recurring decimals as fractions, expanding three brackets and quadratic inequalities.", makers: [
      () => { let ab; do ab = gfR(1, 98); while (ab % 11 === 0); const s = String(ab).padStart(2, "0"), ans = gfF(ab, 99);
        return gfQ(`Write 0.${s}${s}… (the ${s} recurring) as a fraction in its simplest form.`, ans, 3, `Let x = 0.${s}${s}…, so 100x = ${ab}.${s}${s}… (1 mark). Subtract: 99x = ${ab} (1 mark). x = ${ab}/99${ans === `${ab}/99` ? "" : ` = ${ans}`} (1 mark).`, { accept: gxFr(ab, 99), label: `rec ${ab}`, skill: "recurring decimals" }); },
      () => { let a, b; do { a = gfR(1, 8); b = gfR(1, 9); } while (a === b); const ans = gfF(9 * a + b, 90);
        return gfQ(`Write 0.${a}${b}${b}${b}… (only the ${b} recurring) as a fraction in its simplest form.`, ans, 3, `Let x = 0.${a}${b}${b}…, then 10x = ${a}.${b}${b}… and 100x = ${a}${b}.${b}${b}… (1 mark). 90x = ${10 * a + b} − ${a} = ${9 * a + b} (1 mark). x = ${ans} (1 mark).`, { accept: gxFr(9 * a + b, 90), label: `rec1 ${a},${b}`, skill: "recurring decimals" }); },
      () => { let a, b; do { a = gfR(-6, 5); b = gfR(-4, 7); } while (a >= b); const poly = gxE([[1, "x²"], [-(a + b), "x"], [a * b, ""]]), lt = rand(2), ans = lt ? `${gfM(a)} < x < ${gfM(b)}` : `x ≤ ${gfM(a)} or x ≥ ${gfM(b)}`;
        return gfQ(`Solve ${poly} ${lt ? "<" : "≥"} 0.`, ans, 3, `Factorise: ${gxB(1, -a)}${gxB(1, -b)} (1 mark). The critical values are ${gfM(a)} and ${gfM(b)} (1 mark). The graph is a U shape, ${lt ? "below" : "on or above"} the x-axis ${lt ? "between" : "outside"} them: ${ans} (1 mark).`, { options: (lt ? [`x < ${gfM(a)} or x > ${gfM(b)}`, `${gfM(-b)} < x < ${gfM(-a)}`, `x < ${gfM(b)}`] : [`${gfM(a)} ≤ x ≤ ${gfM(b)}`, `x ≤ ${gfM(-b)} or x ≥ ${gfM(-a)}`, `x ≥ ${gfM(b)}`]).filter(o => o !== ans).slice(0, 2), label: `qi ${a},${b},${lt}`, skill: "quadratic inequalities" }); },
      () => { const [claim, ans, wrong] = pick([
          ["the sum of two consecutive odd numbers is a multiple of 4", "(2n + 1) + (2n + 3) = 4n + 4 = 4(n + 1)", ["3 + 5 = 8, which is a multiple of 4", "(2n + 1) + (2n + 1) = 4n + 2"]],
          ["the sum of three consecutive whole numbers is a multiple of 3", "n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1)", ["4 + 5 + 6 = 15, which is a multiple of 3", "n + n + n = 3n"]],
          ["the difference between the squares of two consecutive whole numbers is odd", "(n + 1)² − n² = 2n + 1, which is odd", ["5² − 4² = 9, which is odd", "(n + 1)² − n² = 1"]],
          ["the product of two odd numbers is odd", "(2m + 1)(2n + 1) = 4mn + 2m + 2n + 1 = 2(2mn + m + n) + 1", ["3 × 5 = 15, which is odd", "(2n + 1)(2n + 1) = 4n² + 4n + 1"]]]);
        return gfQ(`Which of these proves that ${claim}?`, ans, 2, `Use letters for any number (1 mark), and end with a form that shows the result, such as 4 × something (1 mark). An example is not a proof.`, { options: wrong, label: `proof ${claim.slice(0, 20)}`, skill: "algebraic proof" }); },
      () => { const [claim, ans, others] = pick([["n² − n + 11 is always prime", "11", ["3", "5"]], ["n² + n + 1 is always prime", "4", ["1", "2"]], ["2ⁿ − 1 is always prime", "4", ["2", "3"]], ["every number ending in 7 is prime", "27", ["17", "37"]], ["n² + 1 is always odd", "3", ["2", "4"]]]);
        return gfQ(`Which value of n (or number) shows that "${claim}" is false?`, ans, 1, `${ans} is a counterexample (1 mark): one example that breaks the rule is enough to disprove it.`, { options: others, label: `counter ${claim.slice(0, 12)}`, skill: "counterexamples" }); },
      () => { const a = gfR(1, 5), b = gfR(-4, 5) || 2, c = gfR(-4, 4) || -1, ans = gxE([[1, "x³"], [a + b + c, "x²"], [a * b + b * c + a * c, "x"], [a * b * c, ""]]);
        return gfQ(`Expand and simplify ${gxB(1, a)}${gxB(1, b)}${gxB(1, c)}.`, ans, 3, `Expand two brackets first: ${gxE([[1, "x²"], [a + b, "x"], [a * b, ""]])} (1 mark). Multiply by ${gxB(1, c)}: six terms (1 mark). Collect: ${ans} (1 mark).`, { options: [gxE([[1, "x³"], [a + b + c, "x²"], [a * b * c, ""]]), gxE([[1, "x³"], [a * b + b * c + a * c, "x²"], [a + b + c, "x"], [a * b * c, ""]])].filter((o, i, l) => o !== ans && l.indexOf(o) === i), label: `three ${a},${b},${c}`, skill: "expanding three brackets" }); }
    ] }
  ];

  // The stages of the climb: a pupil starts at the stage their check (or last grade) puts them in and works up
  const EXAM_STAGES = [
    { id: "foundation-1-3", n: 1, key: "gf", grades: "1 to 3", target: 3, tier: "Foundation", title: "Stage 1: Foundation, grade 1 to 3", topics: GF_TOPICS },
    { id: "crossover-4-5", n: 2, key: "g5", grades: "4 and 5", target: 5, tier: "Foundation or Higher", title: "Stage 2: grades 4 and 5", topics: G5 },
    { id: "higher-6-9", n: 3, key: "gh", grades: "6 to 9", target: 7, tier: "Higher", title: "Stage 3: Higher, grades 6 to 9", topics: GH }
  ];
  EXAM_STAGES.forEach(st => st.topics.forEach(t => { t.stage = st; }));
  const GX_ALL = EXAM_STAGES.flatMap(st => st.topics);

  // A bank question as an online one: the marks and calculator note shown, the mark scheme as the explanation
  const gfOnline = (it, prefix = "") => {
    const prompt = `${it.q} [${gfMk(it.marks)}${it.calc ? ", calculator allowed" : ""}]`;
    const extra = { label: `${prefix}${it.label}`, skill: it.skill, explain: `Mark scheme: ${it.scheme}`, marks: it.marks };
    if (it.pic) extra.html = it.pic;
    if (it.options) return choice(prompt, it.answer, it.options, extra);
    const plainNumber = /^\d+(\.\d+)?$/.test(it.answer);
    return typed(prompt, it.answer, Object.assign(extra, { input: plainNumber ? (it.answer.includes(".") ? "decimal" : "numeric") : "text",
      accept: [...new Set((it.accept || []).concat(gfAlso(it.answer, it.unit)))] }));
  };
  // n bank questions from one topic, all different, using as many kinds of question as it can
  function gfItems(topic, n, keep = () => true) {
    const out = [], seen = new Set();
    for (let round = 0; out.length < n && round < 12; round++)
      for (const maker of shuffle(topic.makers)) {
        if (out.length >= n) break;
        for (let tries = 0; tries < 8; tries++) {
          const it = maker();
          if (!it.q || seen.has(it.label) || !keep(it)) continue;
          seen.add(it.label); out.push(it); break;
        }
      }
    return out;
  }
  const gfTopic = id => GX_ALL.find(t => t.id === id);
  const gfStage = key => EXAM_STAGES.find(st => st.key === key || st.id === key || st.n === key);
  // The baseline: two one-mark questions from every stage 1 topic, in the order of the climb
  const gfBaseline = () => GF_TOPICS.flatMap(t => gfItems(t, 2, it => it.marks === 1 && !it.pic).map(it => Object.assign(it, { topic: t })));
  // A later stage's check: one short question from every topic, in the order of the climb
  const gfCheck = st => st.n === 1 ? gfBaseline() : st.topics.map(t => Object.assign(gfItems(t, 1, it => it.marks <= 2 && !it.pic)[0] || gfItems(t, 1)[0], { topic: t }));
  const GX_NAME = { gf: "", g5: " (grades 4 and 5)", g5n: "grade 4 and 5", gh: " (Higher)", ghn: "Higher" };
  /* ---------- SQA maths exam climb (Scotland): National 4 skills, National 5, then Higher ---------- */
  // Scotland's version of the climb, for S4 to S6 (and adults resitting): the same shape as the GCSE climb
  // above (a check, 14 topics a stage in climb order, exam-style questions with marks and a mark scheme,
  // mini papers), with SQA's course content and names. Stage 1 is the National 4 / Fourth level skills that
  // National 5 takes for granted, so it reuses the climb's own Foundation questions; stage 2 is National 5
  // (it shares much with the GCSE grade 4 to 9 topics, so it reuses those questions where they match the
  // SQA course and adds its own); stage 3 is Higher, all new. New questions write their mark schemes the SQA
  // way, one bullet a mark (•1, •2...). Questions are PopSpell's own, never SQA past papers.
  const SQ = "Mathematics · SQA maths exam climb (Scotland)";
  // Makers borrowed from a GCSE climb topic: all of them, or the ones at these places
  const sqFrom = (id, at) => { const m = gfTopic(id).makers; return at ? at.map(i => m[i]) : m.slice(); };
  // A signed fraction in its simplest form: −3/2, 4, 1/3
  const sqFr = (n, d) => { if (d < 0) { n = -n; d = -d; } const s = fracW(Math.abs(n), d); return n < 0 && n !== 0 ? `−${s}` : s; };
  // The decimal a pupil may type for a fraction that ends: −3/2 → −1.5
  const sqDec = (n, d) => { const v = n / d; return Number.isInteger(v) || Math.round(v * 1000) / 1000 !== v ? [] : [gfD(v)]; };
  // x − 3, x + 2, x (for the equation of a line through a point)
  const sqMinus = (v, a) => (a === 0 ? v : a > 0 ? `${v} − ${a}` : `${v} + ${-a}`);
  // y − b = m(x − a), with m a fraction [n, d]
  const sqLine = (n, d, a, b) => { const m = sqFr(n, d), x = a === 0 || m === "1" ? sqMinus("x", a) : `(${sqMinus("x", a)})`;
    return `${sqMinus("y", b)} = ${m === "1" ? "" : m === "−1" ? "−" : m}${x}`; };
  // Rounding that won't sit on a knife edge (so the answer can't depend on how a calculator rounds)
  const sqSafe = (x, dp) => { const f = Math.abs(x) * 10 ** dp % 1; return f > 0.06 && f < 0.44 || f > 0.56 && f < 0.94; };
  const sqR = (x, dp) => x.toFixed(dp).replace("-", "−");
  const sqDeg = r => r * 180 / Math.PI, sqRad = d => d * Math.PI / 180;
  const sqUniq = (ans, list) => [...new Set(list.map(String))].filter(o => o !== String(ans));
  // A point (a, b)
  const sqP = (a, b, c) => `(${gfM(a)}, ${gfM(b)}${c === undefined ? "" : `, ${gfM(c)}`})`;
  // Mixed numbers: 49/12 → 4 1/12
  const sqMix = (n, d) => { const g = gcd(n, d); n /= g; d /= g; const w = Math.floor(n / d), r = n % d; return r ? (w ? `${w} ${r}/${d}` : `${r}/${d}`) : String(w); };

  // ----- Stage 1: National 4 skills (Fourth level), the climb's Foundation questions with SQA names -----
  const SQ_N4 = [
    ["number", "Number", "Whole numbers, negatives, rounding and significant figures", "Number", "Place value, negative numbers, rounding to decimal places and significant figures, and estimating.", sqFrom("gf-number")],
    ["calc", "Calculating", "Calculating without a calculator", "Number", "Written methods, decimals, the order of operations and problems with remainders, as Paper 1 needs.", sqFrom("gf-calc")],
    ["fractions", "Fractions", "Fractions and mixed numbers", "Fractions, decimals and percentages", "Fractions of amounts, simplifying, the four operations and mixed numbers.", sqFrom("gf-fractions")],
    ["percent", "Percentages", "Percentages", "Fractions, decimals and percentages", "Percentages of amounts, increases and decreases, VAT, interest and percentage change.", sqFrom("gf-percent")],
    ["ratio", "Ratio", "Ratio and proportion", "Number", "Simplifying and sharing in a ratio, recipes, best buys and exchange rates.", sqFrom("gf-ratio")],
    ["algebra", "Expressions", "Expressions and formulae", "Patterns and missing numbers", "Simplifying, substituting into formulae, expanding brackets and factorising.", sqFrom("gf-algebra")],
    ["equations", "Equations", "Equations and inequations", "Patterns and missing numbers", "Solving equations and inequations, and patterns and sequences.", sqFrom("gf-equations")],
    ["graphs", "Graphs", "Coordinates, straight-line graphs and gradient", "Patterns and missing numbers", "Coordinates, drawing and reading straight-line graphs, and the gradient of a line.", sqFrom("gf-graphs").concat(sqFrom("g5-lines", [0, 1]))],
    ["measures", "Measures", "Time, speed and measurement", "Measurement", "Units, time intervals, and speed, distance and time.", sqFrom("gf-measures")],
    ["angles", "Angles", "Angles, shapes, bearings and scale", "Shape and angles", "Angle facts, shapes, three-figure bearings and scale drawings.", sqFrom("gf-angles").concat(sqFrom("g5-polygons", [3, 5]))],
    ["area", "Area and volume", "Area, volume and circles", "Measurement", "Perimeter and area, circles, and volumes of prisms and cylinders.", sqFrom("gf-area").concat(sqFrom("g5-circles", [0, 1, 4]))],
    ["pythagoras", "Pythagoras", "Pythagoras' theorem", "Shape and angles", "Finding a missing side in a right-angled triangle, and the distance between two points.", sqFrom("g5-pythagoras")],
    ["trig", "Trigonometry", "Right-angled trigonometry", "Shape and angles", "SOH CAH TOA: missing sides and angles in right-angled triangles.", sqFrom("g5-trig")],
    ["data", "Statistics and chance", "Statistics and probability", "Data and chance", "Averages and range, charts, scatter graphs and probability.", sqFrom("gf-statistics").concat(sqFrom("gf-probability"))]
  ].map(([slug, short, title, strand, blurb, makers], i) => ({ id: `n4-${slug}`, n: i + 1, short, title, strand, blurb, makers }));

  // ----- Stage 2: National 5 -----
  // Scientific notation, as SQA calls standard form
  const sqSci1 = () => { const m = gfR(11, 99) / 10, e = rand(2) ? -gfR(3, 4) : gfR(4, 8), ord = e < 0 ? (m * 10 ** e).toFixed(1 - e).replace(/0+$/, "") : gfBig(Math.round(m * 10 ** e));
    const ans = gxSF(m, e);
    return gfQ(`Write ${ord} in scientific notation.`, ans, 1, `•1 ${ans}: a number from 1 up to 10, times a power of 10; the decimal point moves ${Math.abs(e)} places, and ${e < 0 ? "a small number has a negative power" : "a big number has a positive power"} (1 mark).`,
      { options: sqUniq(ans, [gxSF(m, -e), `${gfD(m * 10)} × 10${sup(e - 1)}`]), label: `sci ${ord}`, skill: "scientific notation" }); };
  const sqSci2 = () => { const [what, s] = pick([["a day", 8.64], ["an hour", 3.6], ["a week", 6.05], ["a year", 3.15]]), p = { "a day": 4, "an hour": 3, "a week": 5, "a year": 7 }[what];
    let m = 3 * s, e = 5 + p; if (m >= 10) { m /= 10; e += 1; } const ans = gxSF(Number(m.toFixed(3)), e);
    return gfQ(`Light travels about 3 × 10⁵ km in one second. There are ${gfD(s)} × 10${sup(p)} seconds in ${what}. How far does light travel in ${what}? Give your answer in scientific notation. (km)`, ans, 2,
      `•1 multiply: 3 × 10⁵ × ${gfD(s)} × 10${sup(p)} (1 mark). •2 ${ans} km, in scientific notation (1 mark).`,
      { calc: true, options: sqUniq(ans, [gxSF(Number(m.toFixed(3)), 5 * p), `${gfD(Number((3 * s).toFixed(3)))} × 10${sup(5 + p)}`, gxSF(Number(m.toFixed(3)), e - 1)]).slice(0, 2), label: `light ${what}`, skill: "scientific notation in context" }); };
  // Mixed numbers: add, subtract, multiply, divide
  const sqMixQ = () => { const k = rand(4), d1 = pick([2, 3, 4, 5, 6]), d2 = pick([2, 3, 4, 5, 8].filter(x => x !== d1)), w1 = gfR(1, 4), w2 = gfR(1, 3), n1 = gfR(1, d1 - 1), n2 = gfR(1, d2 - 1);
    const A = [w1 * d1 + n1, d1], B = [w2 * d2 + n2, d2], show = (w, n, d) => `${w} ${n}/${d}`;
    let N, D, op;
    if (k === 0) { N = A[0] * B[1] + B[0] * A[1]; D = A[1] * B[1]; op = "+"; }
    else if (k === 1) { if (A[0] * B[1] <= B[0] * A[1]) return {}; N = A[0] * B[1] - B[0] * A[1]; D = A[1] * B[1]; op = "−"; }
    else if (k === 2) { N = A[0] * B[0]; D = A[1] * B[1]; op = "×"; }
    else { N = A[0] * B[1]; D = A[1] * B[0]; op = "÷"; }
    const ans = sqMix(N, D), imp = fracW(N, D);
    return gfQ(`Work out ${show(w1, n1, d1)} ${op} ${show(w2, n2, d2)}. Give your answer as a mixed number in its simplest form.`, ans, 3,
      `•1 ${k < 2 ? "a common denominator, or " : ""}improper fractions: ${A[0]}/${A[1]} and ${B[0]}/${B[1]} (1 mark). •2 ${k === 3 ? `flip and multiply: ${A[0]}/${A[1]} × ${B[1]}/${B[0]} = ` : ""}${N}/${D} (1 mark). •3 ${ans}, as a mixed number in its simplest form (1 mark).`,
      { accept: imp !== ans ? [imp] : [], label: `mix ${w1}${n1}${d1}${op}${w2}${n2}${d2}`, skill: "mixed numbers" }); };
  // (x + a)(x² + bx + c)
  const sqCubicExp = () => { let a, b, c; // both middle coefficients 0 or ±1 would make rare spoken lines
    do { a = gfR(-5, 5) || 2; b = gfR(-4, 4) || -1; c = gfR(-6, 6) || 3; } while (Math.abs(a + b) <= 1 && Math.abs(a * b + c) <= 1);
    const ans = gxE([[1, "x³"], [a + b, "x²"], [a * b + c, "x"], [a * c, ""]]);
    return gfQ(`Expand and simplify ${gxB(1, a)}(${gxE([[1, "x²"], [b, "x"], [c, ""]])}).`, ans, 3,
      `•1 x × each term: ${gxE([[1, "x³"], [b, "x²"], [c, "x"]])} (1 mark). •2 ${gfM(a)} × each term: ${gxE([[a, "x²"], [a * b, "x"], [a * c, ""]])} (1 mark). •3 collect like terms: ${ans} (1 mark).`,
      { options: sqUniq(ans, [gxE([[1, "x³"], [a + b, "x²"], [c, "x"], [a * c, ""]]), gxE([[1, "x³"], [b, "x²"], [a * b + c, "x"], [a * c, ""]]), gxE([[1, "x³"], [a + b, "x²"], [a * b - c, "x"], [a * c, ""]])]).slice(0, 2), label: `cubexp ${a},${b},${c}`, skill: "expanding brackets" }); };
  const sqCtsq = () => { const p = pick([-10, -8, -6, -4, -2, 2, 4, 6, 8, 10]), q = gfR(-9, 15), h = p / 2, k = q - h * h;
    const sq = `${gxB(1, h)}²`, ans = `${sq}${k ? ` ${k < 0 ? "−" : "+"} ${Math.abs(k)}` : ""}`;
    return gfQ(`Write x² ${p < 0 ? "−" : "+"} ${Math.abs(p)}x ${q < 0 ? "−" : "+"} ${Math.abs(q)} in the form (x + p)² + q.`, ans, 2,
      `•1 the bracket: half of ${gfM(p)} is ${gfM(h)}, so ${sq} (1 mark). •2 take away the ${h * h} that ${sq} adds: ${gfM(q)} − ${h * h} = ${gfM(k)} (1 mark).`,
      { options: sqUniq(ans, [`${sq} ${q + h * h < 0 ? "−" : "+"} ${Math.abs(q + h * h)}`, `${gxB(1, p)}² ${q - p * p < 0 ? "−" : "+"} ${Math.abs(q - p * p)}`]), label: `ctsq ${p},${q}`, skill: "completing the square" }); };
  // Algebraic fractions
  const sqAf1 = () => { const a = gfR(1, 7), b = gfR(-6, 6) || 4; if (a === -b) return {};
    const ans = `${gxB(1, a)} / ${gxB(1, b)}`.replace(/^\((.*)\) \/ /, "($1) / ");
    return gfQ(`Simplify ${gxB(1, a)}² / (${gxE([[1, "x²"], [a + b, "x"], [a * b, ""]])}).`, ans, 2,
      `•1 factorise the denominator: ${gxB(1, a)}${gxB(1, b)} (1 mark). •2 cancel the common factor ${gxB(1, a)}: ${ans} (1 mark).`,
      { options: sqUniq(ans, [`${gxB(1, a)} / ${gxB(1, -b)}`, `${gxB(1, a)}² / ${gxB(1, b)}`]), label: `af1 ${a},${b}`, skill: "simplifying algebraic fractions" }); };
  const sqAf2 = () => { const a = gfR(2, 9), b = gfR(2, 9), [u, v] = pick([["x", "y"], ["a", "b"], ["p", "q"]]), op = rand(2) ? "+" : "−";
    const ans = `(${a}${v} ${op} ${b}${u}) / ${u}${v}`;
    return gfQ(`Express ${a}/${u} ${op} ${b}/${v} as a single fraction in its simplest form.`, ans, 2,
      `•1 common denominator ${u}${v} (1 mark). •2 ${ans} (1 mark).`,
      { options: sqUniq(ans, [`(${a} ${op} ${b}) / (${u} + ${v})`, `(${a}${u} ${op} ${b}${v}) / ${u}${v}`]), label: `af2 ${a}${b}${u}${op}`, skill: "adding algebraic fractions" }); };
  const sqAf3 = () => { const a = gfR(2, 9), b = gfR(2, 9) * pick([1, 2]); if (a === b) return {};
    const g = gcd(a, b), top = a / g === 1 ? "x" : `${a / g}x`, ans = b / g === 1 ? top : `${top} / ${b / g}`;
    return gfQ(`Simplify ${a}/x ÷ ${b}/x².`, ans, 2, `•1 flip and multiply: ${a}/x × x²/${b} (1 mark). •2 cancel: ${ans} (1 mark).`,
      { options: sqUniq(ans, [b / g === 1 ? `${a / g} / x` : `${a / g} / ${b / g}x`, `${a * b}/x³`]), label: `af3 ${a},${b}`, skill: "dividing algebraic fractions" }); };
  const sqAf4 = () => { const p = pick([2, 3, 4, 5]), q = pick([3, 4, 5, 6].filter(x => x !== p && gcd(x, p) === 1)), r = gfR(1, 6), s = gfR(1, 6);
    const c = q * r + p * s, ord = t => (q - p < 0 ? t.reverse() : t), ans = `(${gxE(ord([[q - p, "x"], [c, ""]]))}) / ${p * q}`;
    return gfQ(`Express (x + ${r})/${p} − (x − ${s})/${q} as a single fraction in its simplest form.`, ans, 3,
      `•1 common denominator ${p * q}: ${q}(x + ${r}) − ${p}(x − ${s}) over ${p * q} (1 mark). •2 expand: ${q}x + ${q * r} − ${p}x + ${p * s} (1 mark). Watch the sign: − × − is +. •3 ${ans} (1 mark).`,
      { options: sqUniq(ans, [`(${gxE(ord([[q - p, "x"], [q * r - p * s, ""]]))}) / ${p * q}`, `(${gxE(ord([[q - p, "x"], [c, ""]]))}) / ${p + q}`]), label: `af4 ${p}${q}${r}${s}`, skill: "subtracting algebraic fractions" }); };
  const sqIneq = () => { const b = gfR(2, 6), x = gfR(-6, 6), a = gfR(1, 12), c = a - b * x, gt = rand(2), sym = gt ? ">" : "<", flip = gt ? "<" : ">";
    const ans = `x ${flip} ${gfM(x)}`;
    return gfQ(`Solve the inequation ${a} − ${b}x ${sym} ${gfM(c)}.`, ans, 2, `•1 −${b}x ${sym} ${gfM(c - a)} (1 mark). •2 divide by −${b}, which turns the sign round: ${ans} (1 mark).`,
      { options: sqUniq(ans, [`x ${sym} ${gfM(x)}`, `x ${flip} ${gfM(-x)}`]), label: `ineq ${a},${b},${c}`, skill: "inequations" }); };
  // Simultaneous equations
  const sqSimWord = () => { const [thing, A, B] = pick([["tickets", "adult", "child"], ["meals", "large", "small"], ["coffees", "large", "regular"]]);
    const a = gfR(4, 12), c = gfR(2, a - 1), p = gfR(2, 5), q = gfR(1, 4), r = gfR(1, 3), s = gfR(2, 5); if (p * s === q * r) return {};
    const T1 = p * a + q * c, T2 = r * a + s * c, ans = `${A} £${a}, ${B} £${c}`;
    return gfQ(`${p} ${A} and ${q} ${B} ${thing} cost £${T1}. ${r} ${A} and ${s} ${B} ${thing} cost £${T2}. Find the cost of one ${A} and one ${B} ${thing.replace(/s$/, "")}.`, ans, 4,
      `•1 form the equations: ${p}a + ${q}c = ${T1} and ${r}a + ${s}c = ${T2} (1 mark). •2 scale and eliminate one letter (1 mark). •3 one value (1 mark). •4 the other value, both stated in context: ${ans} (1 mark).`,
      { calc: rand(2) === 0, ps: true, options: sqUniq(ans, [`${A} £${c}, ${B} £${a}`, `${A} £${a + 1}, ${B} £${c - 1}`]), label: `simw ${p}${q}${r}${s}${a}${c}`, skill: "simultaneous equations in context" }); };
  const sqSimGraph = () => { const m1 = gfR(1, 4), m2 = -gfR(1, 3), x = gfR(-3, 4), c1 = gfR(-5, 5), y = m1 * x + c1, c2 = y - m2 * x; if (!x || !y || x === y || x === -y) return {};
    const ans = sqP(x, y), line = (m, c) => `y = ${gxE([[m, "x"], [c, ""]])}`;
    return gfQ(`The lines ${line(m1, c1)} and ${line(m2, c2)} are drawn on the same axes. Find the point where they cross.`, ans, 2,
      `•1 equate: ${gxE([[m1, "x"], [c1, ""]])} = ${gxE([[m2, "x"], [c2, ""]])}, so x = ${gfM(x)} (1 mark). •2 y = ${gfM(y)}: ${ans} (1 mark).`,
      { options: sqUniq(ans, [sqP(y, x), sqP(x, -y), sqP(-x, y)]).slice(0, 2), label: `simg ${m1},${c1},${m2}`, skill: "simultaneous equations by graph" }); };
  // Straight lines
  const sqYbm = () => { const n = gfR(-5, 5) || 3, d = pick([1, 1, 2, 3]), a = gfR(-6, 6) || 2, b = gfR(-6, 6) || -3; if (gcd(n, d) !== 1 || a === b) return {};
    const ans = sqLine(n, d, a, b);
    return gfQ(`Find the equation of the line with gradient ${sqFr(n, d)} that passes through ${sqP(a, b)}. Give it in the form y − b = m(x − a).`, ans, 2,
      `•1 substitute m = ${sqFr(n, d)} and the point ${sqP(a, b)} into y − b = m(x − a) (1 mark). •2 ${ans}, signs right (1 mark).`,
      { options: sqUniq(ans, [sqLine(n, d, -a, -b), sqLine(n, d, b, a)]), label: `ybm ${n}/${d},${a},${b}`, skill: "the equation of a line" }); };
  const sqGradEq = () => { const a = gfR(1, 6) * pick([1, -1]), b = gfR(1, 6), c = gfR(1, 30), m = sqFr(-a, b);
    return gfQ(`Find the gradient of the line ${gxE([[a, "x"], [b, "y"]])} = ${c}.`, m, 2, `•1 make y the subject: y = ${sqFr(-a, b)}x + ${sqFr(c, b)} (1 mark). •2 the gradient is the number in front of x: ${m} (1 mark).`,
      { accept: sqDec(-a, b), label: `grad ${a},${b},${c}`, skill: "gradient from an equation" }); };
  // Quadratics
  const sqTp = () => { const a = gfR(-6, 6), b = gfR(-9, 9), up = rand(2), core = a ? `${gxB(1, -a)}²` : "x²";
    const eq = `y = ${up ? "" : "−"}${core}${b ? ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : ""}`;
    const ans = `${up ? "minimum" : "maximum"} turning point ${sqP(a, b)}; axis of symmetry x = ${gfM(a)}`;
    return gfQ(`A parabola has equation ${eq}. Write down the nature and coordinates of its turning point, and the equation of its axis of symmetry.`, ans, 2,
      `•1 turning point ${sqP(a, b)}, a ${up ? "minimum (the x² term is positive)" : "maximum (the x² term is negative)"} (1 mark). •2 axis of symmetry x = ${gfM(a)} (1 mark).`,
      { options: sqUniq(ans, [`${up ? "minimum" : "maximum"} turning point ${sqP(-a, b)}; axis of symmetry x = ${gfM(-a)}`, `${up ? "maximum" : "minimum"} turning point ${sqP(a, b)}; axis of symmetry y = ${gfM(b)}`]), label: `tp ${a},${b},${up}`, skill: "turning points" }); };
  const SQ_ROOTS = ["two real and distinct roots", "equal roots (one repeated root)", "no real roots"];
  const sqNature = () => { const k = rand(3); let a, b, c;
    if (k === 1) { const m = gfR(1, 4), n = gfR(-5, 5) || 1; a = m * m; b = 2 * m * n; c = n * n; } else { a = gfR(1, 4); b = gfR(-7, 7); c = gfR(-8, 8) || 2; }
    const D = b * b - 4 * a * c, ans = SQ_ROOTS[D > 0 ? 0 : D === 0 ? 1 : 2];
    return gfQ(`Use the discriminant to find the nature of the roots of ${gxE([[a, "x²"], [b, "x"], [c, ""]])} = 0.`, ans, 2,
      `•1 b² − 4ac = ${b < 0 ? `(${gfM(b)})` : b}² − 4 × ${a} × ${gfM(c)} = ${gfM(D)} (1 mark). •2 ${D > 0 ? "positive" : D === 0 ? "zero" : "negative"}, so ${ans} (1 mark).`,
      { options: SQ_ROOTS.filter(o => o !== ans), label: `nat ${a},${b},${c}`, skill: "the discriminant" }); };
  const sqKx2 = () => { const k = gfR(-5, 6) || 2, p = gfR(2, 5) * pick([1, -1]), q = k * p * p;
    return gfQ(`The parabola y = kx² passes through the point ${sqP(p, q)}. Find the value of k.`, gfM(k), 2, `•1 substitute: ${gfM(q)} = k × ${gfM(p)}² = ${p * p}k (1 mark). •2 k = ${gfM(k)} (1 mark).`,
      { label: `kx2 ${p},${q}`, skill: "equations of parabolas" }); };
  // Shape: the chord in a circle (the classic pipe question)
  const sqChord = () => { const [h, d, r] = pick([[12, 5, 13], [8, 6, 10], [24, 7, 25], [15, 8, 17], [12, 9, 15], [16, 12, 20], [20, 15, 25]]), s = pick([1, 2, 3]);
    const R = r * s, half = h * s, dist = d * s, depth = R - dist;
    return gfQ(`A pipe has a circular cross-section of radius ${R} cm. The water surface is a chord ${2 * half} cm wide, below the centre. How deep is the water? (cm)`, depth, 3,
      `•1 half the chord is ${half} cm, and a radius to its end makes a right angle (1 mark). •2 Pythagoras: √(${R}² − ${half}²) = ${dist} cm from the centre to the surface (1 mark). •3 depth ${R} − ${dist} = ${depth} cm (1 mark).`,
      { ps: true, unit: "cm", label: `chord ${R},${half}`, skill: "Pythagoras in circles" }); };
  // Solids
  const sqPyramid = () => { const x = gfR(3, 12), h = 3 * gfR(2, 8), v = x * x * h / 3;
    return gfQ(`A pyramid has a square base ${x} cm by ${x} cm and a height of ${h} cm. Find its volume. (cm³)`, v, 2, `•1 V = ⅓ × base area × height = ⅓ × ${x * x} × ${h} (1 mark). •2 ${v} cm³ (1 mark).`,
      { unit: "cm³", label: `pyr ${x},${h}`, skill: "volume of a pyramid" }); };
  const sqArcAngle = () => { const r = gfR(4, 15), ang = gfR(25, 160), L = Number((ang / 360 * 2 * Math.PI * r).toFixed(1)), back = L / (2 * Math.PI * r) * 360;
    if (Math.round(back) !== ang || !sqSafe(back, 0)) return {};
    return gfQ(`A sector of a circle of radius ${r} cm has an arc length of ${gfD(L)} cm. Find the angle at the centre, to the nearest degree. (°)`, ang, 3,
      `•1 arc = angle/360 × πd: ${gfD(L)} = angle/360 × π × ${2 * r} (1 mark). •2 angle = ${gfD(L)} ÷ (π × ${2 * r}) × 360 (1 mark). •3 ${ang}° (1 mark).`,
      { calc: true, unit: "°", label: `arcang ${r},${ang}`, skill: "working back from an arc" }); };
  // Trig graphs and equations
  const sqTrigGraph = () => { const a = gfR(2, 9), b = pick([2, 3, 4, 5, 6]), f = pick(["sin", "cos"]), P = 360 / b;
    const ans = `maximum ${a}, period ${gfD(P)}°`;
    return gfQ(`For the graph of y = ${a} ${f} ${b}x°, write down its maximum value and its period.`, ans, 2,
      `•1 the maximum is the amplitude, ${a} (1 mark). •2 the period is 360° ÷ ${b} = ${gfD(P)}° (1 mark).`,
      { options: sqUniq(ans, [`maximum ${b}, period ${gfD(360 / a)}°`, `maximum ${a}, period ${360 * b}°`, `maximum ${a * b}, period ${gfD(P)}°`]).slice(0, 2), label: `tg ${a}${f}${b}`, skill: "trigonometric graphs" }); };
  const sqTrigEq = () => { const f = pick(["sin", "cos", "tan"]), a = gfR(2, 7), b = gfR(-4, 4), c = gfR(-5, 9); const s = (c - b) / a;
    if (s === 0 || (f !== "tan" && Math.abs(s) >= 1)) return {};
    const base = f === "sin" ? sqDeg(Math.asin(Math.abs(s))) : f === "cos" ? sqDeg(Math.acos(Math.abs(s))) : sqDeg(Math.atan(Math.abs(s)));
    if (!sqSafe(base, 1)) return {};
    const q = {
      sin: s > 0 ? [base, 180 - base] : [180 + base, 360 - base],
      cos: s > 0 ? [base, 360 - base] : [180 - base, 180 + base],
      tan: s > 0 ? [base, 180 + base] : [180 - base, 360 - base] }[f], show = l => `x = ${sqR(l[0], 1)} or x = ${sqR(l[1], 1)}`;
    const ans = show(q), wrong = [show([base, 360 - base]), show([base, 180 + base]), show([180 - base, 360 - base]), show([base, 180 - base])];
    return gfQ(`Solve ${a} ${f} x° ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${gfM(c)}, for 0 ≤ x < 360.`.replace(/ \+ 0 =/, " ="), ans, 3,
      `•1 ${f} x° = ${sqFr(c - b, a)} (1 mark). •2 the first solution, x = ${sqR(q[0], 1)} (1 mark). •3 the second, from the quadrants where ${f} is ${s > 0 ? "positive" : "negative"}: x = ${sqR(q[1], 1)} (1 mark).`,
      { calc: true, options: sqUniq(ans, wrong).slice(0, 2), label: `teq ${f}${a}${b}${c}`, skill: "trigonometric equations" }); };
  const sqTrigId = () => { const [q, ans, wrong] = pick([["sin²x° / (1 − sin²x°)", "tan²x°", ["1", "cos²x°"]], ["sin x° / tan x°", "cos x°", ["sin²x°", "1"]], ["(1 − cos²x°) / cos²x°", "tan²x°", ["sin²x°", "1"]],
      ["sin²x° + cos²x° + tan x° cos x°", "1 + sin x°", ["2 sin x°", "1 + tan x°"]], ["cos x° tan x°", "sin x°", ["1", "cos²x°"]]]);
    return gfQ(`Simplify ${q}.`, ans, 2, `•1 use sin²x° + cos²x° = 1 or tan x° = sin x° / cos x° (1 mark). •2 ${ans} (1 mark).`, { options: wrong, label: `tid ${q}`, skill: "trigonometric identities" }); };
  const sqTrigFit = () => { const a = gfR(2, 8), c = pick([20, 30, 40, 45, 50, 60, 70, 80]), f = rand(2) ? "cos" : "sin", at = f === "cos" ? c : c + 90;
    const ans = `y = ${a} ${f}(x − ${c})°`;
    return gfQ(`A graph has the shape of y = ${f} x°, stretched and moved to the right. Its maximum value is ${a}, at x = ${at}. Which is its equation?`, ans, 2,
      `•1 the amplitude: ${a} (1 mark). •2 y = ${f} x° has its maximum at x = ${f === "cos" ? 0 : 90}, so it has moved ${c}° right: (x − ${c}) (1 mark).`,
      { options: [`y = ${a} ${f}(x + ${c})°`, `y = ${c} ${f}(x − ${a})°`], label: `tfit ${a}${f}${c}`, skill: "trigonometric graphs" }); };
  // Vectors in three dimensions
  const SQ_TRIPLES = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [2, 10, 11, 15], [3, 4, 12, 13]];
  const sqMag3 = () => { const [a, b, c, m] = pick(SQ_TRIPLES), s = pick([1, 1, 2]), v = shuffle([a, b, c]).map(x => x * s * pick([1, -1]));
    return gfQ(`Find the magnitude of the vector ${sqP(...v)}, written across as (x, y, z).`, m * s, 2, `•1 √(${v.map(x => `${gfM(x)}²`).join(" + ")}) = √${v.reduce((t, x) => t + x * x, 0)} (1 mark). •2 ${m * s} (1 mark).`,
      { label: `mag ${v}`, skill: "magnitude of a vector" }); };
  const sqComp3 = () => { const A = [gfR(-5, 6), gfR(-5, 6), gfR(0, 6)], B = [gfR(-5, 6), gfR(-5, 6), gfR(0, 8)], ab = B.map((b, i) => b - A[i]), ans = sqP(...ab);
    return gfQ(`A is the point ${sqP(...A)} and B is ${sqP(...B)}. Find the components of the vector AB, written across as (x, y, z).`, ans, 2,
      `•1 AB = b − a (1 mark). •2 ${ans} (1 mark).`, { options: sqUniq(ans, [sqP(...ab.map(x => -x)), sqP(...B.map((b, i) => b + A[i]))]), label: `comp ${A}${B}`, skill: "vector components" }); };
  // Statistics: standard deviation, comparing, and the line of best fit
  const sqSd = () => { const n = gfR(5, 6), xs = Array.from({ length: n }, () => gfR(2, 30)), mean = xs.reduce((t, x) => t + x, 0) / n;
    const sd = Math.sqrt(xs.reduce((t, x) => t + (x - mean) ** 2, 0) / (n - 1)); if (!sqSafe(sd, 1) || !Number.isInteger(mean * 10)) return {};
    return gfQ(`Find the standard deviation of ${xs.join(", ")}. Give your answer to 1 decimal place.`, sqR(sd, 1), 3,
      `•1 the mean: ${gfD(mean)} (1 mark). •2 Σ(x − mean)² = ${gfD(xs.reduce((t, x) => t + (x - mean) ** 2, 0))} (1 mark). •3 s = √(${gfD(xs.reduce((t, x) => t + (x - mean) ** 2, 0))} ÷ ${n - 1}) = ${sqR(sd, 1)} (1 mark).`,
      { calc: true, label: `sd ${xs}`, skill: "standard deviation" }); };
  const sqSdCompare = () => { const [what, A, B] = pick([["Test marks", "Class A", "Class B"], ["Delivery times in minutes", "Van A", "Van B"], ["Daily sales", "Shop A", "Shop B"]]);
    const m1 = gfR(30, 70), m2 = m1 + pick([-1, 1]) * gfR(3, 9), s1 = gfR(20, 60) / 10, s2 = s1 + pick([-1, 1]) * gfR(15, 40) / 10; if (s2 <= 0.5) return {};
    const hi = m1 > m2 ? A : B, steady = s1 < s2 ? A : B, ans = `On average ${hi} is higher, and ${steady} is more consistent (smaller standard deviation)`;
    return gfQ(`${what}. ${A}: mean ${m1}, standard deviation ${gfD(s1)}. ${B}: mean ${m2}, standard deviation ${gfD(s2)}. Which comparison is right?`, ans, 2,
      `•1 compare the means, in context (1 mark). •2 compare the standard deviations: the smaller one is more consistent (1 mark).`,
      { options: [`On average ${hi} is higher, and ${steady === A ? B : A} is more consistent (bigger standard deviation)`, `On average ${hi === A ? B : A} is higher, and ${steady} is more consistent (smaller standard deviation)`], label: `sdc ${m1}${m2}${s1}${s2}`, skill: "comparing data sets" }); };
  const sqBestFit = () => { const c = gfR(5, 40), m = gfR(2, 9), p = gfR(4, 10), r = gfR(2, 12); if (r === p) return {};
    const q = c + m * p, est = c + m * r;
    return gfQ(`On a scattergraph of hours of revision (x) against test mark (y), a line of best fit passes through (0, ${c}) and (${p}, ${q}). Find its equation, and use it to estimate the mark for ${r} hours.`, est, 3,
      `•1 gradient (${q} − ${c}) ÷ ${p} = ${m} (1 mark). •2 y = ${m}x + ${c} (1 mark). •3 ${m} × ${r} + ${c} = ${est} (1 mark).`,
      { label: `bf ${c},${m},${p},${r}`, skill: "the line of best fit" }); };

  const SQ_N5 = [
    ["surds", "Surds and indices", "Surds, indices and scientific notation", "Number", "Simplifying surds, rationalising denominators, the laws of indices, and scientific notation.", sqFrom("gh-surds").concat(sqFrom("g5-indices", [0, 1, 2, 3]), [sqSci1, sqSci2])],
    ["percent", "Percentages and fractions", "Percentages, appreciation and depreciation, and mixed numbers", "Fractions, decimals and percentages", "Reverse percentages, compound interest, appreciation and depreciation, and calculating with mixed numbers.", sqFrom("g5-growth", [0, 1, 2, 3, 4, 6]).concat([sqMixQ, sqMixQ])],
    ["brackets", "Brackets", "Expanding, factorising and completing the square", "Patterns and missing numbers", "Expanding brackets, factorising (common factor, difference of two squares, trinomials) and completing the square.", sqFrom("g5-brackets", [0, 1, 2, 4, 5]).concat(sqFrom("gh-quadratics", [0]), [sqCubicExp, sqCtsq])],
    ["fractions", "Algebraic fractions", "Algebraic fractions", "Patterns and missing numbers", "Simplifying algebraic fractions, and adding, subtracting, multiplying and dividing them.", sqFrom("gh-algebra", [0, 1]).concat([sqAf1, sqAf2, sqAf3, sqAf4])],
    ["equations", "Equations", "Equations, inequations and changing the subject", "Patterns and missing numbers", "Linear equations and inequations, equations with fractions, and changing the subject of a formula.", sqFrom("g5-solving", [0, 1, 3, 5]).concat(sqFrom("gh-algebra", [2, 3]), [sqIneq])],
    ["simultaneous", "Simultaneous equations", "Simultaneous equations", "Patterns and missing numbers", "Solving simultaneous equations by elimination and by graph, and in context.", sqFrom("g5-solving", [2, 2]).concat([sqSimWord, sqSimGraph])],
    ["lines", "Straight lines", "Straight lines and gradient", "Patterns and missing numbers", "Gradient, y = mx + c, y − b = m(x − a), and the gradient from an equation.", sqFrom("g5-lines", [0, 1, 2, 3]).concat([sqYbm, sqGradEq])],
    ["quadratics", "Quadratics", "Quadratic functions and equations", "Patterns and missing numbers", "Parabolas and turning points, solving quadratics by factorising and the formula, and the discriminant.", sqFrom("g5-brackets", [6]).concat(sqFrom("gh-quadratics", [1, 2]), [sqTp, sqNature, sqKx2])],
    ["shapes", "Shape", "Pythagoras, angles and similarity", "Shape and angles", "Pythagoras in 2D and 3D and its converse, angles in polygons and circles, and similar shapes.", sqFrom("g5-pythagoras", [3]).concat(sqFrom("gh-trig", [6]), sqFrom("g5-polygons", [1, 4]), sqFrom("gh-circles", [1, 4]), sqFrom("gh-similar", [0, 1, 2]), [sqChord])],
    ["solids", "Arcs and volumes", "Arcs, sectors and volumes", "Measurement", "Arc length and sector area, and volumes of spheres, cones, pyramids and cylinders.", sqFrom("gh-solids", [0, 1, 2, 3]).concat(sqFrom("g5-circles", [4]), [sqPyramid, sqArcAngle])],
    ["trig", "Trigonometry", "Trigonometry: area, sine rule, cosine rule and bearings", "Shape and angles", "Area = ½ab sin C, the sine rule, the cosine rule, and bearings.", sqFrom("gh-trig", [0, 1, 2, 3, 4, 5]).concat(sqFrom("g5-polygons", [3]))],
    ["trigeq", "Trig graphs and equations", "Trigonometric graphs, equations and identities", "Shape and angles", "Amplitude and period, the equation of a trig graph, solving trig equations from 0° to 360°, and simple identities.", [sqTrigGraph, sqTrigEq, sqTrigEq, sqTrigId, sqTrigFit]],
    ["vectors", "Vectors", "Vectors", "Shape and angles", "Vectors in two and three dimensions: components, adding, magnitude and paths.", sqFrom("gh-vectors", [0, 1, 2, 3]).concat([sqMag3, sqComp3])],
    ["statistics", "Statistics", "Statistics: comparing data and lines of best fit", "Data and chance", "Mean, interquartile range and standard deviation, comparing data sets in context, and the line of best fit.", sqFrom("gf-statistics", [0]).concat(sqFrom("gh-statistics", [2]), [sqSd, sqSdCompare, sqBestFit])]
  ].map(([slug, short, title, strand, blurb, makers], i) => ({ id: `n5-${slug}`, n: i + 1, short, title, strand, blurb, makers }));

  // ----- Stage 3: Higher -----
  // Polynomials in x from coefficients, highest power first: [1, −2, 0, 5] is x³ − 2x² + 5
  const sqPoly = cs => gxE(cs.map((c, i) => [c, ["", "x", "x²", "x³", "x⁴"][cs.length - 1 - i]]));
  // A coefficient of 2 to n either way: a 1 or 0 makes rare spoken pieces ("x³ add x² add x") nobody recorded
  const sqBig = n => gfR(2, n) * pick([1, -1]);
  const sqAt = (cs, x) => cs.reduce((t, c) => t * x + c, 0);
  const sqFact = rs => rs.slice().sort((a, b) => (a === 0 ? -1 : b === 0 ? 1 : b - a)).map(r => (r === 0 ? "x" : gxB(1, -r))).join("");
  const sqRoots3 = () => { const rs = shuffle([-4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 3); return { rs, cs: [1, -(rs[0] + rs[1] + rs[2]), rs[0] * rs[1] + rs[1] * rs[2] + rs[0] * rs[2], -rs[0] * rs[1] * rs[2]] }; };
  // A fraction coefficient for x: 3/2x → "3/2x"
  const sqC = (n, d, v) => { const f = sqFr(n, d); return f === "1" ? v : f === "−1" ? `−${v}` : `${f}${v}`; };

  // 1. Straight lines
  const shPerp = () => { const [p, q] = pick([[1, 1], [2, 1], [1, 2], [3, 1], [1, 3], [3, 2], [2, 3], [4, 1]]), sg = pick([1, -1]), A = [gfR(-6, 2), gfR(-6, 4)], k = gfR(1, 2);
    const B = [A[0] + q * k, A[1] + sg * p * k], C = [gfR(-5, 6), gfR(-5, 6)], ans = sqLine(-sg * q, p, C[0], C[1]);
    return gfQ(`A is ${sqP(...A)}, B is ${sqP(...B)} and C is ${sqP(...C)}. Find the equation of the line through C perpendicular to AB.`, ans, 3,
      `•1 gradient of AB = ${sqFr(sg * p, q)} (1 mark). •2 perpendicular gradient ${sqFr(-sg * q, p)}, as m₁ × m₂ = −1 (1 mark). •3 ${ans} (1 mark).`,
      { options: sqUniq(ans, [sqLine(sg * p, q, C[0], C[1]), sqLine(sg * q, p, C[0], C[1])]), label: `perp ${A}${B}${C}`, skill: "perpendicular lines" }); };
  const shAngle = () => { const A = [gfR(-5, 3), gfR(-5, 3)], dx = gfR(1, 6), dy = gfR(-7, 7) || 3, B = [A[0] + dx, A[1] + dy], m = dy / dx;
    let th = sqDeg(Math.atan(m)); if (th < 0) th += 180; if (!sqSafe(th, 1)) return {};
    return gfQ(`Find the angle the line through ${sqP(...A)} and ${sqP(...B)} makes with the positive direction of the x-axis, to 1 decimal place. (°)`, sqR(th, 1), 3,
      `•1 m = ${sqFr(dy, dx)} (1 mark). •2 m = tan θ, so θ = tan⁻¹(${sqFr(dy, dx)})${m < 0 ? `, which is negative, so add 180°` : ""} (1 mark). •3 ${sqR(th, 1)}° (1 mark).`,
      { calc: true, unit: "°", label: `ang ${A}${B}`, skill: "gradient and angle" }); };
  const shCollinear = () => { const A = [gfR(-5, 2), gfR(-5, 2)], d = [gfR(1, 3), gfR(-3, 3) || 2], k = gfR(1, 3), j = gfR(1, 3), yes = rand(2);
    const B = [A[0] + k * d[0], A[1] + k * d[1]], C = [B[0] + j * d[0], B[1] + j * d[1] + (yes ? 0 : pick([1, -1]))];
    const ans = yes ? "Yes: AB and BC have the same gradient and share the point B" : "No: AB and BC have different gradients";
    return gfQ(`Are the points A${sqP(...A)}, B${sqP(...B)} and C${sqP(...C)} collinear?`, ans, 2,
      `•1 gradient AB = ${sqFr(d[1], d[0])} and gradient BC = ${sqFr(C[1] - B[1], C[0] - B[0])} (1 mark). •2 ${yes ? "equal, with B common to both, so collinear" : "different, so not collinear"} (1 mark).`,
      { options: [yes ? "No: AB and BC have different gradients" : "Yes: AB and BC have the same gradient and share the point B", "Yes: the three points have whole-number coordinates"], label: `col ${A}${B}${C}`, skill: "collinearity" }); };
  const shPerpBis = () => { const A = [gfR(-6, 4), gfR(-6, 4)], dx = 2 * gfR(1, 4), dy = 2 * (gfR(-4, 4) || 1), B = [A[0] + dx, A[1] + dy], M = [A[0] + dx / 2, A[1] + dy / 2];
    const ans = sqLine(-dx, dy, M[0], M[1]);
    return gfQ(`A is ${sqP(...A)} and B is ${sqP(...B)}. Find the equation of the perpendicular bisector of AB.`, ans, 3,
      `•1 midpoint of AB ${sqP(...M)} (1 mark). •2 gradient of AB ${sqFr(dy, dx)}, so the perpendicular gradient is ${sqFr(-dx, dy)} (1 mark). •3 ${ans} (1 mark).`,
      { options: sqUniq(ans, [sqLine(dy, dx, M[0], M[1]), sqLine(-dx, dy, A[0], A[1])]), label: `pb ${A}${B}`, skill: "perpendicular bisectors" }); };
  const shMedian = () => { const A = [gfR(-6, 0), gfR(-4, 6)], B = [A[0] + 2 * gfR(2, 5), gfR(-4, 6) * 2 - A[1] % 2], C = [gfR(-4, 6), gfR(-8, 8)];
    if ((A[1] + B[1]) % 2) B[1] += 1; const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; if (M[0] === C[0]) return {};
    const ans = sqFr(M[1] - C[1], M[0] - C[0]);
    return gfQ(`Triangle ABC has vertices A${sqP(...A)}, B${sqP(...B)} and C${sqP(...C)}. Find the gradient of the median from C.`, ans, 2,
      `•1 the median goes to the midpoint of AB: ${sqP(...M)} (1 mark). •2 gradient ${ans} (1 mark).`,
      { accept: sqDec(M[1] - C[1], M[0] - C[0]), label: `med ${A}${B}${C}`, skill: "medians" }); };

  // 2. Functions
  const shComp = () => { const a = gfR(2, 5) * pick([1, -1]), b = gfR(-6, 6) || 1, c = gfR(-5, 5) || 2;
    const ans = gxE([[a, "x²"], [a * c + b, ""]]), gf = `${gxB(a, b)}² ${c < 0 ? "−" : "+"} ${Math.abs(c)}`;
    return gfQ(`f(x) = ${gxE([[a, "x"], [b, ""]])} and g(x) = ${gxE([[1, "x²"], [c, ""]])}. Find an expression for f(g(x)).`, ans, 2,
      `•1 substitute g(x) into f: ${gfM(a)}(${gxE([[1, "x²"], [c, ""]])}) ${b < 0 ? "−" : "+"} ${Math.abs(b)} (1 mark). •2 ${ans} (1 mark).`,
      { options: sqUniq(ans, [gf, gxE([[a, "x²"], [c + b, ""]])]), label: `comp ${a},${b},${c}`, skill: "composite functions" }); };
  const shEval = () => { const a = gfR(2, 5), b = gfR(-6, 6), c = gfR(-9, 9), p = gfR(-3, 4), fp = a * p + b, ans = fp * fp + c;
    return gfQ(`f(x) = ${gxE([[a, "x"], [b, ""]])} and g(x) = ${gxE([[1, "x²"], [c, ""]])}. Evaluate g(f(${gfM(p)})).`, gfM(ans), 2,
      `•1 f(${gfM(p)}) = ${gfM(fp)} (1 mark). •2 g(${gfM(fp)}) = ${gfM(ans)} (1 mark).`, { label: `ev ${a}${b}${c}${p}`, skill: "composite functions" }); };
  const shInv = () => { const a = gfR(2, 7), b = gfR(-9, 9) || 4, ans = `f⁻¹(x) = (${gxE([[1, "x"], [-b, ""]])}) / ${a}`;
    return gfQ(`f(x) = ${gxE([[a, "x"], [b, ""]])}. Find the inverse function f⁻¹(x).`, ans, 3,
      `•1 write y = ${gxE([[a, "x"], [b, ""]])} and swap, or start to change the subject (1 mark). •2 x = (${gxE([[1, "y"], [-b, ""]])}) / ${a} (1 mark). •3 ${ans} (1 mark).`,
      { options: sqUniq(ans, [`f⁻¹(x) = (${gxE([[1, "x"], [b, ""]])}) / ${a}`, `f⁻¹(x) = 1 / (${gxE([[a, "x"], [b, ""]])})`]), label: `inv ${a},${b}`, skill: "inverse functions" }); };
  const shDomain = () => { const k = gfR(2, 9), [q, ans, wrong] = pick([[`f(x) = 1 / (x² − ${k * k})`, `x = ${k} and x = −${k}`, [`x = ${k * k} only`, `x = ${k} only`]], [`f(x) = √(x − ${k})`, `x ≥ ${k}`, [`x > ${k}`, `x ≤ ${k}`]], [`f(x) = 3 / (x + ${k})`, `x = −${k}`, [`x = ${k}`, `x = 0`]]]);
    return gfQ(`${q}. ${q.includes("√") ? "Which values of x can be in a suitable domain?" : "Which value or values of x must be left out of the domain?"}`, ans, 2,
      `•1 ${q.includes("√") ? "the square root needs a number that is not negative" : "the denominator can't be zero"} (1 mark). •2 ${ans} (1 mark).`, { options: wrong, label: `dom ${q}`, skill: "domain" }); };
  const shExpInv = () => { const b = pick([2, 3, 4, 5, 10]), ans = b === 10 ? "f⁻¹(x) = log₁₀ x" : `f⁻¹(x) = log${String(b).replace(/\d/g, d => "₀₁₂₃₄₅₆₇₈₉"[d])} x`;
    return gfQ(`f(x) = ${b}ˣ. Write down f⁻¹(x).`, ans, 1, `•1 the inverse of an exponential is a logarithm to the same base: ${ans} (1 mark).`,
      { options: [`f⁻¹(x) = x^(1/${b})`, `f⁻¹(x) = 1 / ${b}ˣ`], label: `expinv ${b}`, skill: "inverse functions" }); };

  // 3. Graphs and transformations
  const shShift = () => { const a = gfR(-5, 5), b = gfR(-5, 5), h = gfR(-4, 4) || 2, k = gfR(-4, 4) || -1, ans = sqP(a + h, b + k);
    const inner = h > 0 ? `x − ${h}` : `x + ${-h}`;
    return gfQ(`The point ${sqP(a, b)} lies on the graph of y = f(x). Where is its image on the graph of y = f(${inner}) ${k < 0 ? "−" : "+"} ${Math.abs(k)}?`, ans, 2,
      `•1 f(${inner}) moves the graph ${Math.abs(h)} ${h > 0 ? "right" : "left"}: x becomes ${gfM(a + h)} (1 mark). •2 ${k < 0 ? "−" : "+"} ${Math.abs(k)} moves it ${Math.abs(k)} ${k > 0 ? "up" : "down"}: ${ans} (1 mark).`,
      { options: sqUniq(ans, [sqP(a - h, b + k), sqP(a + h, b - k), sqP(a - h, b - k)]).slice(0, 2), label: `shift ${a}${b}${h}${k}`, skill: "graph transformations" }); };
  const shReflect = () => { const a = gfR(-6, 6) || 3, b = gfR(-6, 6) || -2, [f, img, how] = pick([["−f(x)", [a, -b], "reflects in the x-axis"], ["f(−x)", [-a, b], "reflects in the y-axis"], ["2f(x)", [a, 2 * b], "doubles every y-coordinate"], ["f(x) + 3", [a, b + 3], "moves it 3 up"]]);
    const ans = sqP(...img);
    return gfQ(`The point ${sqP(a, b)} lies on y = f(x). Write down its image on y = ${f}.`, ans, 1, `•1 y = ${f} ${how}: ${ans} (1 mark).`,
      { options: sqUniq(ans, [sqP(-a, b), sqP(a, -b), sqP(-a, -b), sqP(2 * a, b)]).slice(0, 2), label: `refl ${a}${b}${f}`, skill: "graph transformations" }); };
  const shExpBase = () => { const a = pick([2, 3, 4, 5, 6, 7]), n = gfR(2, 3);
    return gfQ(`The graph of y = aˣ passes through the point (${n}, ${a ** n}). Find a.`, a, 2, `•1 ${a ** n} = a${sup(n)} (1 mark). •2 a = ${a} (1 mark).`, { label: `expb ${a}${n}`, skill: "exponential graphs" }); };
  const shLogBase = () => { const a = pick([2, 3, 4, 5]), n = gfR(2, 4);
    return gfQ(`The graph of y = logₐ x passes through the point (${a ** n}, ${n}). Find a.`, a, 2, `•1 ${n} = logₐ ${a ** n}, so a${sup(n)} = ${a ** n} (1 mark). •2 a = ${a} (1 mark).`, { label: `logb ${a}${n}`, skill: "logarithmic graphs" }); };

  // 4. Polynomials
  const shRem = () => { const cs = [1, sqBig(5), sqBig(9), sqBig(9)], k = gfR(-3, 3) || 2, r = sqAt(cs, k);
    return gfQ(`Find the remainder when ${sqPoly(cs)} is divided by ${gxB(1, -k)}.`, gfM(r), 2, `•1 synthetic division by ${gfM(k)}, or f(${gfM(k)}) (1 mark). •2 remainder ${gfM(r)} (1 mark).`,
      { label: `rem ${cs}${k}`, skill: "the remainder theorem" }); };
  const shFactorK = () => { const { rs, cs } = sqRoots3(), r = rs[0];
    return gfQ(`${gxB(1, -r)} is a factor of x³ + px² ${cs[2] < 0 ? "−" : "+"} ${Math.abs(cs[2])}x ${cs[3] < 0 ? "−" : "+"} ${Math.abs(cs[3])}. Find the value of p.`, gfM(cs[1]), 3,
      `•1 f(${gfM(r)}) = 0, because ${gxB(1, -r)} is a factor (1 mark). •2 ${gfM(r ** 3)} + ${r * r}p ${cs[2] * r + cs[3] < 0 ? "−" : "+"} ${Math.abs(cs[2] * r + cs[3])} = 0 (1 mark). •3 p = ${gfM(cs[1])} (1 mark).`,
      { label: `fk ${rs}`, skill: "the factor theorem" }); };
  const shFactorise = () => { const { rs, cs } = sqRoots3(), ans = sqFact(rs);
    return gfQ(`${gxB(1, -rs[0])} is a factor of ${sqPoly(cs)}. Factorise ${sqPoly(cs)} fully.`, ans, 3,
      `•1 synthetic division by ${gfM(rs[0])}, remainder 0 (1 mark). •2 the quotient: ${sqPoly([1, -(rs[1] + rs[2]), rs[1] * rs[2]])} (1 mark). •3 ${ans} (1 mark).`,
      { options: sqUniq(ans, [sqFact(rs.map(r => -r)), sqFact([rs[0], -rs[1], -rs[2]])]), label: `fz ${rs}`, skill: "factorising cubics" }); };
  const shSolve3 = () => { const { rs, cs } = sqRoots3(), so = rs.slice().sort((a, b) => a - b), show = l => `x = ${l.map(gfM).join(", ")}`, ans = show(so);
    return gfQ(`Solve ${sqPoly(cs)} = 0.`, ans, 4, `•1 find a root by trying factors of ${Math.abs(cs[3])}: f(${gfM(rs[0])}) = 0 (1 mark). •2 synthetic division: ${sqPoly([1, -(rs[1] + rs[2]), rs[1] * rs[2]])} (1 mark). •3 factorise fully: ${sqFact(rs)} (1 mark). •4 ${ans} (1 mark).`,
      { options: sqUniq(ans, [show(so.map(r => -r).sort((a, b) => a - b)), show([so[0], so[1], -so[2]].sort((a, b) => a - b))]), label: `s3 ${rs}`, skill: "solving cubics" }); };

  // 5. Quadratic theory
  const shEqualRoots = () => { const m = gfR(1, 7), c = m * m;
    return gfQ(`x² + kx + ${c} = 0 has equal roots, and k is positive. Find k.`, 2 * m, 3, `•1 equal roots: b² − 4ac = 0 (1 mark). •2 k² − ${4 * c} = 0 (1 mark). •3 k = ${2 * m} (1 mark).`, { label: `eq ${c}`, skill: "the discriminant" }); };
  const shNoRoots = () => { const b = 2 * gfR(1, 6) * pick([1, -1]), lim = b * b / 4, ans = `p > ${lim}`;
    return gfQ(`Find the values of p for which x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x + p = 0 has no real roots.`, ans, 3,
      `•1 no real roots: b² − 4ac < 0 (1 mark). •2 ${b * b} − 4p < 0 (1 mark). •3 ${ans} (1 mark).`, { options: [`p < ${lim}`, `p > ${b * b}`], label: `nr ${b}`, skill: "the discriminant" }); };
  const shQIneq = () => { const a = gfR(-6, 3), b = a + gfR(1, 7); if (a + b === 0) return {}; const lt = rand(2), ans = lt ? `${gfM(a)} < x < ${gfM(b)}` : `x < ${gfM(a)} or x > ${gfM(b)}`;
    return gfQ(`Solve ${sqPoly([1, -(a + b), a * b])} ${lt ? "<" : ">"} 0.`, ans, 3,
      `•1 roots ${gfM(a)} and ${gfM(b)}, by factorising: ${sqFact([a, b])} (1 mark). •2 a sketch: a U-shape crossing at ${gfM(a)} and ${gfM(b)} (1 mark). •3 ${ans} (1 mark).`,
      { options: [lt ? `x < ${gfM(a)} or x > ${gfM(b)}` : `${gfM(a)} < x < ${gfM(b)}`, lt ? `${gfM(-b)} < x < ${gfM(-a)}` : `x < ${gfM(-b)} or x > ${gfM(-a)}`], label: `qi ${a}${b}${lt}`, skill: "quadratic inequations" }); };
  const shTangent = () => { const p = gfR(-4, 4), q = gfR(-5, 5), x0 = gfR(-3, 3), y0 = x0 * x0 + p * x0 + q, m = 2 * x0 + p, c = y0 - m * x0, ans = sqP(x0, y0); if (!x0 || !y0 || x0 === y0) return {};
    return gfQ(`Show that the line y = ${gxE([[m, "x"], [c, ""]])} is a tangent to the curve y = ${sqPoly([1, p, q])}, and find the point of contact.`, ans, 4,
      `•1 equate and rearrange: ${sqPoly([1, p - m, q - c])} = 0 (1 mark). •2 the discriminant is 0, so one point of contact: a tangent (1 mark). •3 x = ${gfM(x0)} (1 mark). •4 ${ans} (1 mark).`,
      { options: sqUniq(ans, [sqP(-x0, y0), sqP(x0, -y0), sqP(y0, x0)]).slice(0, 2), label: `tan ${p}${q}${x0}`, skill: "tangency" }); };

  // 6. Recurrence relations
  const shRec = () => { const a = pick([0.5, 0.2, 0.4, 2, 3, 0.8]), b = gfR(-6, 12), u0 = gfR(1, 20), u1 = a * u0 + b, u2 = a * u1 + b;
    return gfQ(`A sequence is defined by uₙ₊₁ = ${gfD(a)}uₙ ${b < 0 ? "−" : "+"} ${Math.abs(b)}, with u₀ = ${u0}. Find u₂.`, gfD(u2), 2, `•1 u₁ = ${gfD(a)} × ${u0} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${gfD(u1)} (1 mark). •2 u₂ = ${gfD(u2)} (1 mark).`,
      { label: `rec ${a}${b}${u0}`, skill: "recurrence relations" }); };
  const shLimit = () => { const a = pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]), L = gfR(2, 15) * 20, b = Number((L * (1 - a)).toFixed(2));
    return gfQ(`uₙ₊₁ = ${gfD(a)}uₙ + ${gfD(b)}. Explain why this sequence has a limit, and find it.`, String(L), 3,
      `•1 a limit exists because −1 < ${gfD(a)} < 1 (1 mark). •2 L = ${gfD(a)}L + ${gfD(b)} (1 mark). •3 L = ${gfD(b)} ÷ ${gfD(1 - a)} = ${L} (1 mark).`, { label: `lim ${a}${L}`, skill: "limits of sequences" }); };
  const shWhichLimit = () => { const good = pick([0.3, 0.6, 0.9, -0.5]), bad = shuffle([1.2, -1.5, 2, 1.05]).slice(0, 2), f = a => `uₙ₊₁ = ${gfD(a)}uₙ + 4`;
    return gfQ(`Which of these recurrence relations has a limit?`, f(good), 1, `•1 a limit exists only when −1 < a < 1: ${f(good)} (1 mark).`, { options: bad.map(f), label: `wl ${good}${bad}`, skill: "limits of sequences" }); };
  const shTank = () => { const p = pick([20, 25, 40, 50]), L = gfR(3, 20) * 40, add = L * p / 100, keep = (100 - p) / 100;
    return gfQ(`A pond loses ${p}% of its water each week, and then ${add} litres are added. In the long run, how much water will the pond hold? (litres)`, L, 3,
      `•1 uₙ₊₁ = ${gfD(keep)}uₙ + ${add} (1 mark). •2 −1 < ${gfD(keep)} < 1, so a limit exists; L = ${gfD(keep)}L + ${add} (1 mark). •3 L = ${add} ÷ ${gfD(1 - keep)} = ${L} litres (1 mark).`,
      { ps: true, unit: "litres", label: `tank ${p}${L}`, skill: "recurrence relations in context" }); };

  // 7. Differentiation
  const shDiffPoly = () => { const a = gfR(1, 5) * pick([1, -1]), b = sqBig(6), c = sqBig(9), d = sqBig(9);
    const ans = sqPoly([3 * a, 2 * b, c]);
    return gfQ(`Differentiate y = ${sqPoly([a, b, c, d])} with respect to x.`, `dy/dx = ${ans}`, 2, `•1 multiply by the power and take 1 off it, term by term (1 mark). •2 dy/dx = ${ans}: the constant goes (1 mark).`,
      { options: sqUniq(`dy/dx = ${ans}`, [`dy/dx = ${sqPoly([3 * a, 2 * b, c, d])}`, `dy/dx = ${sqPoly([a, b, c])}`, `dy/dx = ${sqPoly([3 * a, 2 * b, 0])}`]).slice(0, 2), label: `dp ${a}${b}${c}${d}`, skill: "differentiating" }); };
  const shDiffIdx = () => { if (rand(2)) { const p = gfR(1, 3), k = gfR(1, 4), a = k * p * p;
      return gfQ(`f(x) = ${a}/x, x ≠ 0. Find f′(${p}).`, sqFr(-a, p * p), 3,
        `•1 write f(x) = ${a}x⁻¹ (1 mark). •2 f′(x) = −${a}x⁻² (1 mark). •3 f′(${p}) = −${a}/${p * p} = ${sqFr(-a, p * p)} (1 mark).`, { accept: sqDec(-a, p * p), label: `di1 ${a}${p}`, skill: "differentiating negative powers" }); }
    const s = gfR(1, 4), k = gfR(1, 3), a = 2 * s * k;
    return gfQ(`f(x) = ${a}√x. Find f′(${s * s}).`, String(k), 3, `•1 write f(x) = ${a}x^(1/2) (1 mark). •2 f′(x) = ${a / 2}x^(−1/2) (1 mark). •3 f′(${s * s}) = ${a / 2} ÷ ${s} = ${k} (1 mark).`,
      { label: `di2 ${a}${s}`, skill: "differentiating fractional powers" }); };
  const shTanLine = () => { const p = gfR(-5, 5), q = gfR(-6, 6), x0 = gfR(-3, 3), y0 = x0 * x0 + p * x0 + q, m = 2 * x0 + p, ans = sqLine(m, 1, x0, y0).replace(/= 0\(.*\)$/, "= 0");
    if (!m) return {};
    return gfQ(`Find the equation of the tangent to the curve y = ${sqPoly([1, p, q])} at the point where x = ${gfM(x0)}.`, ans, 4,
      `•1 y = ${gfM(y0)} at x = ${gfM(x0)} (1 mark). •2 dy/dx = ${sqPoly([2, p])} (1 mark). •3 gradient at x = ${gfM(x0)}: ${gfM(m)} (1 mark). •4 ${ans} (1 mark).`,
      { options: sqUniq(ans, [sqLine(2 * x0, 1, x0, y0), sqLine(m, 1, -x0, -y0), sqLine(-1, m, x0, y0)]).slice(0, 2), label: `tl ${p}${q}${x0}`, skill: "equations of tangents" }); };
  const shChain = () => { const a = gfR(2, 5), b = gfR(-7, 7) || 1, n = gfR(3, 6), co = n * a, ans = `dy/dx = ${co}${gxB(a, b)}${sup(n - 1)}`;
    return gfQ(`Differentiate y = ${gxB(a, b)}${sup(n)}.`, ans, 2, `•1 the power: ${n}${gxB(a, b)}${sup(n - 1)} (1 mark). •2 the chain rule: × ${a}, so ${ans.replace("dy/dx = ", "")} (1 mark).`,
      { options: [`dy/dx = ${n}${gxB(a, b)}${sup(n - 1)}`, `dy/dx = ${co}${gxB(a, b)}${sup(n + 1)}`], label: `ch ${a}${b}${n}`, skill: "the chain rule" }); };
  const shDiffTrig = () => { const a = gfR(2, 6), b = gfR(2, 5), sn = rand(2), ans = sn ? `${a * b} cos ${b}x` : `−${a * b} sin ${b}x`;
    return gfQ(`Differentiate ${a} ${sn ? "sin" : "cos"} ${b}x with respect to x.`, ans, 2, `•1 ${sn ? "sin → cos" : "cos → −sin"} (1 mark). •2 × ${b} by the chain rule: ${ans} (1 mark).`,
      { options: sn ? [`${a} cos ${b}x`, `−${a * b} cos ${b}x`] : [`${a * b} sin ${b}x`, `−${a} sin ${b}x`], label: `dt ${a}${b}${sn}`, skill: "differentiating sin and cos" }); };

  // 8. Using differentiation
  const shCubicSP = () => { const r1 = gfR(-4, 2), r2 = r1 + 2 * gfR(1, 3), d = gfR(-9, 9), cs = [1, -1.5 * (r1 + r2), 3 * r1 * r2, d], y1 = sqAt(cs, r1), y2 = sqAt(cs, r2);
    return { cs, r1, r2, y1, y2 }; };
  const shStat = () => { const { cs, r1, r2, y1, y2 } = shCubicSP(), ans = `${sqP(r1, y1)} and ${sqP(r2, y2)}`;
    return gfQ(`Find the coordinates of the stationary points on the curve y = ${sqPoly(cs)}.`, ans, 4,
      `•1 dy/dx = ${sqPoly([3, 2 * cs[1], cs[2]])} (1 mark). •2 set dy/dx = 0 (1 mark). •3 x = ${gfM(r1)} and x = ${gfM(r2)} (1 mark). •4 the y-values: ${ans} (1 mark).`,
      { options: sqUniq(ans, [`${sqP(r1, y2)} and ${sqP(r2, y1)}`, `${sqP(r1, -y1)} and ${sqP(r2, -y2)}`]), label: `st ${cs}`, skill: "stationary points" }); };
  const shNature = () => { const { cs, r1, r2, y1, y2 } = shCubicSP(), ans = `${sqP(r1, y1)} is a maximum and ${sqP(r2, y2)} is a minimum`;
    return gfQ(`The curve y = ${sqPoly(cs)} has stationary points ${sqP(r1, y1)} and ${sqP(r2, y2)}. Determine their nature.`, ans, 2,
      `•1 a nature table (or the second derivative) for dy/dx = 3${sqFact([r1, r2])} (1 mark). •2 ${ans} (1 mark).`,
      { options: [`${sqP(r1, y1)} is a minimum and ${sqP(r2, y2)} is a maximum`, "both are points of inflection"], label: `na ${cs}`, skill: "the nature of stationary points" }); };
  const shIncr = () => { const p = 2 * gfR(-5, 5), q = gfR(-9, 9), up = rand(2), v = -p / 2, ans = `x ${up ? ">" : "<"} ${gfM(v)}`;
    return gfQ(`For which values of x is y = ${sqPoly([1, p, q])} ${up ? "increasing" : "decreasing"}?`, ans, 2, `•1 dy/dx = ${sqPoly([2, p])} (1 mark). •2 dy/dx ${up ? ">" : "<"} 0 when ${ans} (1 mark).`,
      { options: [`x ${up ? "<" : ">"} ${gfM(v)}`, `x ${up ? ">" : "<"} ${gfM(-v)}`].filter(o => o !== ans), label: `inc ${p}${q}${up}`, skill: "increasing and decreasing functions" }); };
  const shOptim = () => { const L = 4 * gfR(5, 25), x = L / 4, A = L * L / 8;
    return gfQ(`A farmer has ${L} m of fencing to make a rectangular pen against a wall, so only three sides need fencing. With width x m, the area is A = x(${L} − 2x). Find the largest possible area. (m²)`, A, 4,
      `•1 A = ${L}x − 2x² (1 mark). •2 dA/dx = ${L} − 4x (1 mark). •3 dA/dx = 0 when x = ${x}, a maximum (1 mark). •4 A = ${x} × ${L - 2 * x} = ${A} m² (1 mark).`,
      { ps: true, unit: "m²", label: `opt ${L}`, skill: "optimisation" }); };
  const shRate = () => { const a = gfR(10, 40), b = gfR(2, 5), t = gfR(1, 4), r = a - 2 * b * t;
    return gfQ(`The height of a ball t seconds after it is thrown is h(t) = ${a}t − ${b}t² metres. Find the rate of change of its height when t = ${t}. (m/s)`, gfM(r), 2,
      `•1 h′(t) = ${a} − ${2 * b}t (1 mark). •2 h′(${t}) = ${gfM(r)} m/s (1 mark).`, { unit: "m/s", label: `rate ${a}${b}${t}`, skill: "rates of change" }); };

  // 9. Integration
  const shIntPoly = () => { const a = 3 * gfR(1, 4), b = 2 * (gfR(-5, 5) || 1), c = gfR(-9, 9) || 2, ans = `${sqPoly([a / 3, b / 2, c, 0])} + C`;
    return gfQ(`Find ∫(${sqPoly([a, b, c])}) dx.`, ans, 2, `•1 add 1 to each power and divide by the new power (1 mark). •2 ${ans}, with the constant of integration (1 mark).`,
      { options: [`${sqPoly([a / 3, b / 2, c, 0])}`, `${sqPoly([2 * a, b])} + C`, `${sqPoly([a, b, c, 0])} + C`].filter(o => o !== ans).slice(0, 2), label: `ip ${a}${b}${c}`, skill: "integrating" }); };
  const shDefInt = () => { const k = gfR(1, 4), b = gfR(-4, 4), v = k ** 3 + b * k * k;
    return gfQ(`Evaluate the integral of ${sqPoly([3, 2 * b, 0])} with respect to x, from x = 0 to x = ${k}.`, gfM(v), 3,
      `•1 integrate: ${sqPoly([1, b, 0, 0])} (1 mark). •2 substitute the limits: (${k ** 3} ${b * k * k < 0 ? "−" : "+"} ${Math.abs(b * k * k)}) − 0 (1 mark). •3 ${gfM(v)} (1 mark).`, { label: `di ${k}${b}`, skill: "definite integrals" }); };
  const shArea = () => { const r1 = gfR(-3, 2), d = gfR(1, 6), r2 = r1 + d, ans = sqFr(d ** 3, 6);
    return gfQ(`The curve y = ${sqPoly([1, -(r1 + r2), r1 * r2])} crosses the x-axis at x = ${gfM(r1)} and x = ${gfM(r2)}. Find the area enclosed by the curve and the x-axis. (square units)`, ans, 4,
      `•1 integrate between ${gfM(r1)} and ${gfM(r2)} (1 mark). •2 the integral: ${sqC(1, 3, "x³")} ${-(r1 + r2) / 2 < 0 ? "−" : "+"} ${sqC(Math.abs(r1 + r2), 2, "x²")} ${r1 * r2 < 0 ? "−" : "+"} ${Math.abs(r1 * r2)}x (1 mark). •3 the value ${sqFr(-(d ** 3), 6)}: negative, as the region is below the x-axis (1 mark). •4 area ${ans} square units (1 mark).`.replace(/ \+ 0x| [+−] 0x²|  /g, " "),
      { accept: sqDec(d ** 3, 6).concat([sqMix(d ** 3, 6)]), label: `ar ${r1}${d}`, skill: "area under a curve" }); };
  const shDiffEq = () => { const a = 3 * gfR(1, 3), b = 2 * gfR(-3, 3), x0 = gfR(-2, 2) || 1, base = sqAt([a / 3, b / 2, 0, 0], x0), y0 = base + (gfR(-9, 9) || 4), c = y0 - base, ans = `y = ${sqPoly([a / 3, b / 2, 0, c])}`;
    return gfQ(`dy/dx = ${sqPoly([a, b, 0])}, and the curve passes through ${sqP(x0, y0)}. Find y in terms of x.`, ans, 3,
      `•1 integrate: y = ${sqPoly([a / 3, b / 2, 0, 0])} + C (1 mark). •2 substitute ${sqP(x0, y0)} (1 mark). •3 C = ${gfM(c)}: ${ans} (1 mark).`,
      { options: sqUniq(ans, [`y = ${sqPoly([a / 3, b / 2, 0, y0])}`, `y = ${sqPoly([a / 3, b / 2, 0, -c])}`, `y = ${sqPoly([a, b, 0, c])}`]).slice(0, 2), label: `de ${a}${b}${x0}${y0}`, skill: "differential equations" }); };
  const shIntChain = () => { const a = gfR(2, 5), b = gfR(-6, 6) || 1, n = gfR(2, 5), den = a * (n + 1), ans = `${gxB(a, b)}${sup(n + 1)} / ${den} + C`;
    return gfQ(`Find ∫${gxB(a, b)}${sup(n)} dx.`, ans, 2, `•1 ${gxB(a, b)}${sup(n + 1)} ÷ ${n + 1} (1 mark). •2 ÷ ${a} as well (the coefficient of x): ${ans} (1 mark).`,
      { options: [`${gxB(a, b)}${sup(n + 1)} / ${n + 1} + C`, `${a * n}${gxB(a, b)}${sup(n - 1)} + C`], label: `ic ${a}${b}${n}`, skill: "integrating (ax + b)ⁿ" }); };
  const shIntTrig = () => { const b = gfR(2, 5), a = b * gfR(1, 4), cs = rand(2), ans = cs ? `${a / b === 1 ? "" : a / b} sin ${b}x + C` : `−${a / b === 1 ? "" : a / b} cos ${b}x + C`;
    return gfQ(`Find ∫${a} ${cs ? "cos" : "sin"} ${b}x dx.`, ans, 2, `•1 ${cs ? "cos → sin" : "sin → −cos"} (1 mark). •2 ÷ ${b}: ${ans} (1 mark).`,
      { options: sqUniq(ans, cs ? [`${a * b} sin ${b}x + C`, `−${a / b === 1 ? "" : a / b} sin ${b}x + C`] : [`${a / b === 1 ? "" : a / b} cos ${b}x + C`, `−${a * b} cos ${b}x + C`]), label: `it ${a}${b}${cs}`, skill: "integrating sin and cos" }); };

  // 10. Trigonometry: radians, exact values and equations
  const SQ_RAD = { 30: "π/6", 45: "π/4", 60: "π/3", 90: "π/2", 120: "2π/3", 135: "3π/4", 150: "5π/6", 180: "π", 210: "7π/6", 225: "5π/4", 240: "4π/3", 270: "3π/2", 300: "5π/3", 315: "7π/4", 330: "11π/6" };
  const shRadians = () => { const d = pick(Object.keys(SQ_RAD).map(Number)), ans = SQ_RAD[d];
    return gfQ(`Write ${d}° in radians.`, ans, 1, `•1 × π/180: ${ans} (1 mark).`, { options: sqUniq(ans, [SQ_RAD[d === 30 ? 60 : 30], SQ_RAD[(d + 90) % 360] || "2π"]), label: `rad ${d}`, skill: "radians" }); };
  const SQ_EXACT = [["sin", 30, "1/2"], ["cos", 60, "1/2"], ["sin", 60, "√3/2"], ["cos", 30, "√3/2"], ["tan", 45, "1"], ["tan", 60, "√3"], ["tan", 30, "1/√3"], ["sin", 45, "1/√2"], ["cos", 45, "1/√2"],
    ["sin", 150, "1/2"], ["cos", 120, "−1/2"], ["sin", 240, "−√3/2"], ["cos", 330, "√3/2"], ["tan", 135, "−1"], ["sin", 225, "−1/√2"], ["cos", 150, "−√3/2"]];
  const shExact = () => { const [f, d, ans] = pick(SQ_EXACT);
    return gfQ(`Find the exact value of ${f}(${SQ_RAD[d]}).`, ans, 2, `•1 ${SQ_RAD[d]} is ${d}°, and the related acute angle gives the size (1 mark). •2 the quadrant gives the sign: ${ans} (1 mark).`,
      { options: sqUniq(ans, [ans.startsWith("−") ? ans.slice(1) : `−${ans}`, { "1/2": "√3/2", "√3/2": "1/2", "1": "√3", "√3": "1/√3", "1/√3": "√3", "1/√2": "1/2" }[ans.replace("−", "")] || "1/2"]), label: `ex ${f}${d}`, skill: "exact values" }); };
  const shRadEq = () => { const [f, v, ds] = pick([["sin", "1/2", [30, 150]], ["sin", "√3/2", [60, 120]], ["cos", "1/2", [60, 300]], ["cos", "√3/2", [30, 330]], ["cos", "−1/2", [120, 240]], ["sin", "−1/2", [210, 330]], ["tan", "1", [45, 225]], ["tan", "√3", [60, 240]]]);
    const show = l => `x = ${l.map(d => SQ_RAD[d]).join(" or x = ")}`, ans = show(ds), k = { "1/2": 2, "√3/2": 2, "−1/2": 2 }[v], lhs = k ? `${k} ${f} x` : `${f} x`, rhs = k ? v.replace("/2", "") : v;
    return gfQ(`Solve ${lhs} = ${rhs} for 0 ≤ x < 2π.`, ans, 3, `•1 ${f} x = ${v} (1 mark). •2 the first solution ${SQ_RAD[ds[0]]} (1 mark). •3 the second, from the right quadrant: ${SQ_RAD[ds[1]]} (1 mark).`,
      { options: sqUniq(ans, [show([ds[0], (360 - ds[0]) % 360 || 180]), show([ds[0], (180 + ds[0]) % 360])]).slice(0, 2), label: `re ${f}${v}`, skill: "trigonometric equations in radians" }); };
  const shDoubleEq = () => { const a = gfR(2, 5), b = gfR(1, a - 1) * pick([1, -1]), s = b / a, base = sqDeg(Math.acos(s)), x1 = base / 2, x2 = (360 - base) / 2;
    if (!sqSafe(x1, 1) || !sqSafe(x2, 1)) return {};
    const show = (p, q) => `x = ${sqR(p, 1)} or x = ${sqR(q, 1)}`, ans = show(x1, x2);
    return gfQ(`Solve ${a} cos 2x° = ${gfM(b)}, for 0 ≤ x ≤ 180.`, ans, 3, `•1 cos 2x° = ${sqFr(b, a)} (1 mark). •2 2x = ${sqR(base, 1)} or ${sqR(360 - base, 1)} (1 mark). •3 ${ans} (1 mark).`,
      { calc: true, options: sqUniq(ans, [show(base, 360 - base), show(x1, 180 - x1)]), label: `de2 ${a}${b}`, skill: "trigonometric equations with 2x" }); };
  const shQuadTrig = () => { const [q, fac, ans, wrong] = pick([
      ["2sin²x° − sin x° − 1 = 0", "(2 sin x° + 1)(sin x° − 1) = 0", "x = 90, 210 or 330", ["x = 30, 150 or 270", "x = 90 or 210"]],
      ["2cos²x° − cos x° − 1 = 0", "(2 cos x° + 1)(cos x° − 1) = 0", "x = 0, 120 or 240", ["x = 0, 60 or 300", "x = 120 or 240"]],
      ["2sin²x° + 3 sin x° + 1 = 0", "(2 sin x° + 1)(sin x° + 1) = 0", "x = 210, 270 or 330", ["x = 30, 90 or 150", "x = 210 or 330"]],
      ["2cos²x° + cos x° − 1 = 0", "(2 cos x° − 1)(cos x° + 1) = 0", "x = 60, 180 or 300", ["x = 120, 180 or 240", "x = 60 or 300"]]]);
    return gfQ(`Solve ${q}, for 0 ≤ x < 360.`, ans, 4, `•1 treat it as a quadratic (1 mark). •2 factorise: ${fac} (1 mark). •3 the solutions from one bracket (1 mark). •4 all of them: ${ans} (1 mark).`,
      { options: wrong, label: `qt ${q}`, skill: "quadratic trigonometric equations" }); };

  // 11. Trig formulae and the wave function
  const SQ_PY = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  const shWave = () => { const [p, q, k] = pick(SQ_PY), [a, b] = shuffle([p, q]).map(x => x * pick([1, -1]));
    let al = sqDeg(Math.atan2(b, a)); if (al < 0) al += 360; if (!sqSafe(al, 1)) return {};
    const show = x => `k = ${k}, α = ${sqR(x, 1)}°`, ans = show(al);
    return gfQ(`Write ${gfM(a)} cos x° ${b < 0 ? "−" : "+"} ${Math.abs(b)} sin x° in the form k cos(x − α)°, where k > 0 and 0 ≤ α < 360.`, ans, 4,
      `•1 expand: k cos x° cos α° + k sin x° sin α° (1 mark). •2 compare: k cos α = ${gfM(a)}, k sin α = ${gfM(b)} (1 mark). •3 k = √(${a * a} + ${b * b}) = ${k} (1 mark). •4 tan α = ${sqFr(b, a)}, in the quadrant where cos is ${a > 0 ? "+" : "−"} and sin is ${b > 0 ? "+" : "−"}: α = ${sqR(al, 1)} (1 mark).`,
      { calc: true, options: sqUniq(ans, [show((al + 180) % 360), show(360 - al), `k = ${Math.abs(a) + Math.abs(b)}, α = ${sqR(al, 1)}°`]).slice(0, 2), label: `wave ${a}${b}`, skill: "the wave function" }); };
  const shDouble = () => { const [p, q, r] = pick(SQ_PY), s = rand(2), ans = s ? sqFr(2 * p * q, r * r) : sqFr(q * q - p * p, r * r);
    return gfQ(`A is an acute angle with sin A = ${p}/${r}. Find the exact value of ${s ? "sin 2A" : "cos 2A"}.`, ans, 3,
      `•1 cos A = ${q}/${r}, from a right-angled triangle (1 mark). •2 ${s ? "sin 2A = 2 sin A cos A" : "cos 2A = cos²A − sin²A"} (1 mark). •3 ${ans} (1 mark).`, { label: `dbl ${p}${r}${s}`, skill: "double angle formulae" }); };
  const shAdd = () => { const [[a, b, c], [d, e, f]] = shuffle(SQ_PY).slice(0, 2), s = rand(2), top = s ? a * e + b * d : b * e - a * d, ans = sqFr(top, c * f);
    return gfQ(`P and Q are acute angles. sin P = ${a}/${c}, cos P = ${b}/${c}, sin Q = ${d}/${f} and cos Q = ${e}/${f}. Find the exact value of ${s ? "sin(P + Q)" : "cos(P + Q)"}.`, ans, 3,
      `•1 ${s ? "sin P cos Q + cos P sin Q" : "cos P cos Q − sin P sin Q"} (1 mark). •2 substitute: ${s ? `${a}/${c} × ${e}/${f} + ${b}/${c} × ${d}/${f}` : `${b}/${c} × ${e}/${f} − ${a}/${c} × ${d}/${f}`} (1 mark). •3 ${ans} (1 mark).`,
      { label: `add ${a}${d}${s}`, skill: "addition formulae" }); };
  const shIdent = () => { const [q, ans, wrong] = pick([["cos 2x", "2cos²x − 1", ["2cos x − 1", "cos²x + sin²x"]], ["sin 2x", "2 sin x cos x", ["2 sin x", "sin²x − cos²x"]], ["cos 2x", "1 − 2sin²x", ["1 − 2sin x", "2sin²x − 1"]], ["sin(x + 90)°", "cos x°", ["sin x° + 1", "−cos x°"]]]);
    return gfQ(`Which of these is equal to ${q}?`, ans, 1, `•1 ${q} = ${ans} (1 mark).`, { options: wrong, label: `id ${q}${ans}`, skill: "trigonometric identities" }); };
  const shWaveMax = () => { const k = gfR(2, 13), al = gfR(10, 80), c = gfR(-5, 5), ans = `maximum ${k + c}, at x = ${al}`;
    return gfQ(`f(x) = ${k} cos(x − ${al})° ${c < 0 ? "−" : "+"} ${Math.abs(c)}, for 0 ≤ x < 360. Find the maximum value of f(x) and the value of x where it occurs.`, ans, 2,
      `•1 cos is at most 1, so the maximum is ${k} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${k + c} (1 mark). •2 when x − ${al} = 0: x = ${al} (1 mark).`,
      { options: [`maximum ${k + c}, at x = ${180 + al}`, `maximum ${k}, at x = ${al}`].filter(o => o !== ans), label: `wm ${k}${al}${c}`, skill: "the wave function" }); };

  // 12. Circles
  const shCentre = () => { const a = gfR(-6, 6), b = gfR(-6, 6), r = gfR(1, 9), c = a * a + b * b - r * r, ans = `centre ${sqP(a, b)}, radius ${r}`;
    return gfQ(`A circle has equation ${gxE([[1, "x²"], [1, "y²"], [-2 * a, "x"], [-2 * b, "y"], [c, ""]])} = 0. Write down its centre and radius.`, ans, 2,
      `•1 centre (−g, −f) = ${sqP(a, b)} (1 mark). •2 radius √(g² + f² − c) = √(${a * a} + ${b * b} ${c < 0 ? "+" : "−"} ${Math.abs(c)}) = ${r} (1 mark).`,
      { options: sqUniq(ans, [`centre ${sqP(-a, -b)}, radius ${r}`, `centre ${sqP(2 * a, 2 * b)}, radius ${r * r}`]), label: `cen ${a}${b}${r}`, skill: "the equation of a circle" }); };
  const shCircEq = () => { const a = gfR(-5, 5), b = gfR(-5, 5), [p, q, r] = pick([[3, 4, 5], [0, 5, 5], [5, 12, 13], [6, 8, 10], [0, 3, 3], [2, 0, 2]]), P = [a + p, b + q], ans = `${a ? gxB(1, -a) : "x"}² + ${b ? gxB(1, -b).replace("x", "y") : "y"}² = ${r * r}`;
    return gfQ(`A circle has centre ${sqP(a, b)} and passes through ${sqP(...P)}. Find its equation.`, ans, 2,
      `•1 radius² = ${p}² + ${q}² = ${r * r} (1 mark). •2 ${ans} (1 mark).`,
      { options: sqUniq(ans, [`${a ? gxB(1, a) : "x"}² + ${b ? gxB(1, b).replace("x", "y") : "y"}² = ${r * r}`, ans.replace(/= \d+$/, `= ${r}`)]), label: `ce ${a}${b}${p}${q}`, skill: "the equation of a circle" }); };
  const shCircTan = () => { const a = gfR(-4, 4), b = gfR(-4, 4), [p, q] = pick([[3, 4], [4, 3], [-3, 4], [3, -4], [-4, -3], [5, 12], [12, -5]]), P = [a + p, b + q], ans = sqLine(-p, q, P[0], P[1]);
    return gfQ(`The point P${sqP(...P)} lies on the circle with centre C${sqP(a, b)}. Find the equation of the tangent at P.`, ans, 3,
      `•1 gradient of the radius CP: ${sqFr(q, p)} (1 mark). •2 the tangent is perpendicular: ${sqFr(-p, q)} (1 mark). •3 ${ans} (1 mark).`,
      { options: sqUniq(ans, [sqLine(q, p, P[0], P[1]), sqLine(-p, q, a, b)]), label: `ct ${a}${b}${p}${q}`, skill: "tangents to circles" }); };
  const shTwoCircles = () => { const [p, q, d] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [0, 7, 7], [8, 6, 10]]), r1 = gfR(1, d - 1), k = rand(3), r2 = k === 0 ? d - r1 : k === 1 ? d - r1 + gfR(1, 3) : Math.max(1, d - r1 - gfR(1, 2));
    if ((k === 2 && r1 + r2 >= d) || Math.abs(r1 - r2) >= d) return {};
    const ans = ["They touch externally", "They meet at two points", "They don't meet"][k];
    return gfQ(`Circle A has centre (0, 0) and radius ${r1}. Circle B has centre ${sqP(p, q)} and radius ${r2}. How do the circles meet?`, ans, 3,
      `•1 distance between centres √(${p}² + ${q}²) = ${d} (1 mark). •2 the sum of the radii: ${r1} + ${r2} = ${r1 + r2} (1 mark). •3 ${k === 0 ? "the same as the distance" : k === 1 ? "more than the distance" : "less than the distance"}, so: ${ans} (1 mark).`,
      { options: ["They touch externally", "They meet at two points", "They don't meet"].filter(o => o !== ans), label: `tc ${p}${q}${r1}${r2}`, skill: "intersecting circles" }); };
  const shInside = () => { const a = gfR(-4, 4), b = gfR(-4, 4), r = gfR(3, 8), P = [a + gfR(-4, 4), b + gfR(-4, 4)], d2 = (P[0] - a) ** 2 + (P[1] - b) ** 2;
    const ans = d2 < r * r ? "inside the circle" : d2 === r * r ? "on the circle" : "outside the circle";
    return gfQ(`Is the point ${sqP(...P)} inside, on or outside the circle ${a ? gxB(1, -a) : "x"}² + ${b ? gxB(1, -b).replace("x", "y") : "y"}² = ${r * r}?`, ans, 2,
      `•1 substitute: (${gfM(P[0])} ${a < 0 ? "+" : "−"} ${Math.abs(a)})² + (${gfM(P[1])} ${b < 0 ? "+" : "−"} ${Math.abs(b)})² = ${d2} (1 mark). •2 compare with ${r * r}: ${ans} (1 mark).`,
      { options: ["inside the circle", "on the circle", "outside the circle"].filter(o => o !== ans), label: `in ${a}${b}${r}${P}`, skill: "points and circles" }); };

  // 13. Vectors in three dimensions
  const shDot = () => { const a = [gfR(-5, 5), gfR(-5, 5), gfR(-5, 5)], b = [gfR(-5, 5), gfR(-5, 5), gfR(-5, 5)], v = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    return gfQ(`a = ${sqP(...a)} and b = ${sqP(...b)}, written across. Find the scalar product a.b.`, gfM(v), 2, `•1 a₁b₁ + a₂b₂ + a₃b₃ (1 mark). •2 ${gfM(v)} (1 mark).`, { label: `dot ${a}${b}`, skill: "the scalar product" }); };
  const shVAngle = () => { const [x, y, z, m] = pick(SQ_TRIPLES), [u, v, w, n] = pick(SQ_TRIPLES), a = shuffle([x, y, z]).map(t => t * pick([1, -1])), b = shuffle([u, v, w]).map(t => t * pick([1, -1]));
    const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], th = sqDeg(Math.acos(dot / (m * n))); if (!sqSafe(th, 1)) return {};
    return gfQ(`Find the angle between the vectors ${sqP(...a)} and ${sqP(...b)}, written across, to 1 decimal place. (°)`, sqR(th, 1), 4,
      `•1 a.b = ${gfM(dot)} (1 mark). •2 |a| = ${m} and |b| = ${n} (1 mark). •3 cos θ = ${gfM(dot)} ÷ ${m * n} (1 mark). •4 θ = ${sqR(th, 1)}° (1 mark).`, { calc: true, unit: "°", label: `va ${a}${b}`, skill: "the angle between vectors" }); };
  const shPerpV = () => { const p = pick([1, 2, 3, -1, -2]), a = [p, gfR(-5, 5) || 1, gfR(-5, 5) || 2], s = gfR(-4, 4), u = gfR(-4, 4), t = gfR(-6, 6), need = -(a[1] * s + a[2] * u) / p;
    if (!Number.isInteger(need)) return {};
    return gfQ(`a = ${sqP(...a)} and b = (t, ${gfM(s)}, ${gfM(u)}). Find t so that a and b are perpendicular.`, gfM(need), 3,
      `•1 perpendicular means a.b = 0 (1 mark). •2 ${p}t ${a[1] * s + a[2] * u < 0 ? "−" : "+"} ${Math.abs(a[1] * s + a[2] * u)} = 0 (1 mark). •3 t = ${gfM(need)} (1 mark).`, { label: `pv ${a}${s}${u}${t}`, skill: "perpendicular vectors" }); };
  const shColV = () => { const A = [gfR(-4, 4), gfR(-4, 4), gfR(-4, 4)], d = [gfR(-3, 3) || 1, gfR(-3, 3), gfR(1, 3)], k = gfR(1, 4), m = gfR(1, 4), g = gcd(k, m);
    const B = A.map((x, i) => x + k * d[i]), C = B.map((x, i) => x + m * d[i]), ans = `${k / g} : ${m / g}`;
    return gfQ(`A is ${sqP(...A)}, B is ${sqP(...B)} and C is ${sqP(...C)}. Show that A, B and C are collinear, and find the ratio in which B divides AC.`, ans, 3,
      `•1 AB = ${sqP(...d.map(x => k * x))} and BC = ${sqP(...d.map(x => m * x))} (1 mark). •2 AB = ${sqFr(k, m)} BC, parallel with B in common, so collinear (1 mark). •3 ${ans} (1 mark).`,
      { options: sqUniq(ans, [`${m / g} : ${k / g}`, `${k / g} : ${(k + m) / g}`]), label: `cv ${A}${d}${k}${m}`, skill: "collinearity in 3D" }); };
  const shDivide = () => { const m = gfR(1, 3), n = gfR(1, 3), A = [gfR(-4, 4), gfR(-4, 4), gfR(-4, 4)], d = [gfR(-2, 2) || 1, gfR(-2, 2), gfR(1, 2)].map(x => x * (m + n));
    const B = A.map((x, i) => x + d[i]), P = A.map((x, i) => x + d[i] * m / (m + n)), ans = sqP(...P);
    return gfQ(`A is ${sqP(...A)} and B is ${sqP(...B)}. P divides AB in the ratio ${m} : ${n}. Find the coordinates of P.`, ans, 3,
      `•1 AP = ${m}/${m + n} of AB (1 mark). •2 AB = ${sqP(...d)} (1 mark). •3 P = A + ${m}/${m + n} AB = ${ans} (1 mark).`,
      { options: sqUniq(ans, [sqP(...A.map((x, i) => x + d[i] * n / (m + n))), sqP(...A.map((x, i) => x - d[i] * m / (m + n)))]).slice(0, 2), label: `dv ${A}${d}${m}${n}`, skill: "dividing a line in a ratio" }); };

  // 14. Logarithms and exponentials
  const SQ_SUB = n => String(n).replace(/\d/g, d => "₀₁₂₃₄₅₆₇₈₉"[d]);
  const shLogVal = () => { const b = pick([2, 3, 4, 5, 10]), n = gfR(-2, 4), x = n >= 0 ? String(b ** n) : `1/${b ** -n}`;
    return gfQ(`Evaluate log${SQ_SUB(b)} ${x}.`, gfM(n), 1, `•1 ${b}${sup(n)} = ${x}, so log${SQ_SUB(b)} ${x} = ${gfM(n)} (1 mark).`, { label: `lv ${b}${n}`, skill: "logarithms" }); };
  const shLogLaws = () => { const b = pick([2, 3, 5]), k = gfR(1, 3), z = pick([2, 3, 4, 5, 6]), y = pick([2, 3, 4, 6]), xy = b ** k * z; if (xy % y || y === z || xy / y === z) return {};
    const x = xy / y;
    return gfQ(`Evaluate log${SQ_SUB(b)} ${x} + log${SQ_SUB(b)} ${y} − log${SQ_SUB(b)} ${z}.`, String(k), 3,
      `•1 add the logs: log${SQ_SUB(b)} ${x * y} (1 mark). •2 subtract: log${SQ_SUB(b)} ${x * y / z} (1 mark). •3 ${k} (1 mark).`, { label: `ll ${b}${x}${y}${z}`, skill: "laws of logarithms" }); };
  const shExpEq = () => { const a = pick([2, 3, 4, 5, 6, 7]), b = gfR(5, 200), x = Math.log(b) / Math.log(a); if (!sqSafe(x, 2) || Number.isInteger(x)) return {};
    return gfQ(`Solve ${a}ˣ = ${b}. Give x to 2 decimal places.`, sqR(x, 2), 2, `•1 take logs: x log ${a} = log ${b} (1 mark). •2 x = ${sqR(x, 2)} (1 mark).`, { calc: true, label: `ee ${a}${b}`, skill: "exponential equations" }); };
  const shLogEq = () => { const b = pick([2, 3, 5]), n = gfR(2, 4), c = gfR(-5, 6) || 1, x = b ** n - c;
    return gfQ(`Solve log${SQ_SUB(b)}(x ${c < 0 ? "−" : "+"} ${Math.abs(c)}) = ${n}.`, gfM(x), 2, `•1 write it without logs: x ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${b}${sup(n)} (1 mark). •2 x = ${gfM(x)} (1 mark).`, { label: `le ${b}${n}${c}`, skill: "logarithmic equations" }); };
  const shHalfLife = () => { const k = pick([0.012, 0.025, 0.031, 0.045, 0.058, 0.07, 0.085]), t = Math.log(2) / k; if (!sqSafe(t, 1)) return {};
    return gfQ(`A substance decays so that Mₜ = M₀e^(−${k}t), with t in years. How long does it take for half of it to decay? Give your answer to 1 decimal place. (years)`, sqR(t, 1), 3,
      `•1 ½M₀ = M₀e^(−${k}t) (1 mark). •2 ln ½ = −${k}t (1 mark). •3 t = ${sqR(t, 1)} years (1 mark).`, { calc: true, ps: true, unit: "years", label: `hl ${k}`, skill: "exponential decay" }); };
  const shLogLine = () => { const c = gfR(0, 2), n = gfR(2, 4), k = 10 ** c, ans = `y = ${k === 1 ? "" : k}x${sup(n)}`;
    return gfQ(`The graph of log₁₀y against log₁₀x is a straight line through (0, ${c}) with gradient ${n}. Express y in terms of x.`, ans, 3,
      `•1 log₁₀y = ${n} log₁₀x + ${c} (1 mark). •2 log₁₀y = log₁₀x${sup(n)} + log₁₀${k} (1 mark). •3 ${ans} (1 mark).`,
      { options: sqUniq(ans, [`y = x${sup(n)} + ${k}`, `y = ${k * n}x`]), label: `lline ${c}${n}`, skill: "logarithmic graphs" }); };

  const SQ_NH = [
    ["lines", "Straight lines", "The straight line", "Patterns and missing numbers", "Gradients and angles, perpendicular lines, collinearity, and medians, altitudes and perpendicular bisectors.", [shPerp, shAngle, shCollinear, shPerpBis, shMedian]],
    ["functions", "Functions", "Functions: composite, inverse and domain", "Patterns and missing numbers", "Composite and inverse functions, and suitable domains.", [shComp, shEval, shInv, shDomain, shExpInv]],
    ["graphs", "Graphs", "Graphs of functions and transformations", "Patterns and missing numbers", "Transforming graphs (f(x + a), f(x) + a, −f(x), f(−x), kf(x)), and exponential and log graphs.", [shShift, shReflect, shExpBase, shLogBase]],
    ["polynomials", "Polynomials", "Polynomials and the factor theorem", "Patterns and missing numbers", "Synthetic division, the remainder and factor theorems, factorising and solving cubics.", [shRem, shFactorK, shFactorise, shSolve3]],
    ["quadratics", "Quadratic theory", "Quadratic theory: discriminant, inequations and tangency", "Patterns and missing numbers", "The discriminant and the nature of roots, quadratic inequations, and tangency.", [shEqualRoots, shNoRoots, shQIneq, shTangent]],
    ["recurrence", "Recurrence relations", "Recurrence relations", "Patterns and missing numbers", "Linear recurrence relations, when a limit exists, finding it, and using them in context.", [shRec, shLimit, shWhichLimit, shTank]],
    ["differentiation", "Differentiation", "Differentiation", "Patterns and missing numbers", "Differentiating powers (negative and fractional too), the chain rule, sin and cos, and tangents.", [shDiffPoly, shDiffIdx, shTanLine, shChain, shDiffTrig]],
    ["calculus", "Using differentiation", "Stationary points, optimisation and rates of change", "Patterns and missing numbers", "Stationary points and their nature, increasing and decreasing functions, optimisation and rates of change.", [shStat, shNature, shIncr, shOptim, shRate]],
    ["integration", "Integration", "Integration and area", "Patterns and missing numbers", "Integrating powers, (ax + b)ⁿ, sin and cos, definite integrals, areas and differential equations.", [shIntPoly, shDefInt, shArea, shDiffEq, shIntChain, shIntTrig]],
    ["trig", "Trig equations", "Radians, exact values and trigonometric equations", "Shape and angles", "Radians, exact values, and solving trig equations, including with 2x and quadratic ones.", [shRadians, shExact, shRadEq, shDoubleEq, shQuadTrig]],
    ["formulae", "Trig formulae", "Addition and double angle formulae, and the wave function", "Shape and angles", "Addition and double angle formulae, identities, and writing a cos x + b sin x as k cos(x − α).", [shWave, shDouble, shAdd, shIdent, shWaveMax]],
    ["circles", "Circles", "The circle", "Shape and angles", "Equations of circles, centre and radius, tangents, and how lines and circles meet.", [shCentre, shCircEq, shCircTan, shTwoCircles, shInside]],
    ["vectors", "Vectors", "Vectors in three dimensions", "Shape and angles", "The scalar product, the angle between vectors, perpendicular vectors, collinearity and dividing a line.", [shDot, shVAngle, shPerpV, shColV, shDivide]],
    ["logs", "Logs and exponentials", "Logarithms and exponentials", "Patterns and missing numbers", "The laws of logs, exponential and log equations, exponential growth and decay, and log graphs.", [shLogVal, shLogLaws, shExpEq, shLogEq, shHalfLife, shLogLine]]
  ].map(([slug, short, title, strand, blurb, makers], i) => ({ id: `nh-${slug}`, n: i + 1, short, title, strand, blurb, makers }));

  const SQA_STAGES = [
    { id: "n4-skills", n: 1, key: "n4", course: "National 4", grades: "National 4", goal: "the National 4 / Fourth level skills National 5 takes for granted", title: "Stage 1: National 4 skills", topics: SQ_N4 },
    { id: "national-5", n: 2, key: "n5", course: "National 5", grades: "National 5", goal: "National 5 Mathematics", title: "Stage 2: National 5", topics: SQ_N5 },
    { id: "higher", n: 3, key: "nh", course: "Higher", grades: "Higher", goal: "Higher Mathematics", title: "Stage 3: Higher", topics: SQ_NH }
  ];
  SQA_STAGES.forEach(st => st.topics.forEach(t => { t.stage = st; }));
  const SQ_ALL = SQA_STAGES.flatMap(st => st.topics);
  const sqTopic = id => SQ_ALL.find(t => t.id === id);
  const sqStage = key => SQA_STAGES.find(st => st.key === key || st.id === key || st.n === key);
  // A stage's check: one short question from each topic, in climb order
  const sqCheck = st => st.topics.map(t => Object.assign(gfItems(t, 1, it => it.marks <= 2 && !it.pic)[0] || gfItems(t, 1)[0], { topic: t }));
  const numeracySQA = [
    ...SQA_STAGES.map(st => ({ id: `${st.key}-check`, title: `SQA maths climb: ${st.course} check`, level: "Senior", organiser: SQ, check: false,
      blurb: `One exam question on each of the 14 ${st.course} topics, in the order of the climb. The results show which topics to work on first.`,
      make: () => sqCheck(st).map((it, i) => Object.assign(gfOnline(it, `${it.topic.n}. ${it.topic.short}: `), { skill: `${it.topic.n}. ${it.topic.short}`, diff: i })) })),
    ...SQ_ALL.map(t => ({ id: t.id, title: `SQA maths climb (${t.stage.course}) ${t.n}: ${t.title}`, level: "Senior", organiser: SQ, check: false, blurb: `${t.blurb} Exam-style questions with marks and SQA-style marking.`,
      make: () => gfItems(t, 10).map(it => Object.assign(gfOnline(it), { diff: it.marks * 100 + (it.ps ? 50 : 0) + rand(50) })) })),
    ...SQA_STAGES.map(st => ({ id: `${st.key}-mixed`, title: `SQA maths climb: mixed exam questions (${st.course})`, level: "Senior", organiser: SQ, check: false,
      blurb: `Twelve exam-style questions from across the 14 ${st.course} topics, a new mix every time, for revision once topics have been taught.`,
      make: () => shuffle(st.topics).slice(0, 12).sort((a, b) => a.n - b.n).map((t, i) => Object.assign(gfOnline(gfItems(t, 1)[0], `${t.short}: `), { diff: i })) }))
  ];

  const numeracyExam = [
    { id: "gf-baseline", title: "GCSE maths climb: baseline check (grade 1 to 3)", level: "Fourth", organiser: GF, check: false,
      blurb: "Two quick questions on each of the 14 Foundation topics, in the order of the climb. The results show which topics to teach first.",
      make: () => gfBaseline().map((it, i) => Object.assign(gfOnline(it, `${it.topic.n}. ${it.topic.short}: `), { skill: `${it.topic.n}. ${it.topic.short}`, diff: i })) },
    ...EXAM_STAGES.slice(1).map(st => ({ id: `${st.key}-check`, title: `GCSE maths climb: stage ${st.n} check (grades ${st.grades})`, level: "Fourth", organiser: GF, check: false,
      blurb: `One exam question on each of the 14 ${st.title.replace(/^Stage \d: /, "")} topics, in the order of the climb. The results show which topics to work on first.`,
      make: () => gfCheck(st).map((it, i) => Object.assign(gfOnline(it, `${it.topic.n}. ${it.topic.short}: `), { skill: `${it.topic.n}. ${it.topic.short}`, diff: i })) })),
    ...GX_ALL.map(t => ({ id: t.id, title: `GCSE maths climb${GX_NAME[t.stage.key]} ${t.n}: ${t.title}`, level: "Fourth", organiser: GF, check: false, blurb: `${t.blurb} Exam-style questions with marks and mark-scheme answers.`,
      make: () => gfItems(t, 10).map(it => Object.assign(gfOnline(it), { diff: it.marks * 100 + (it.ps ? 50 : 0) + rand(50) })) })),
    ...EXAM_STAGES.map(st => ({ id: `${st.key}-mixed`, title: `GCSE maths climb: mixed exam questions (grade${st.n === 1 ? "" : "s"} ${st.grades})`, level: "Fourth", organiser: GF, check: false,
      blurb: `Twelve exam-style questions from across the 14 ${st.n === 1 ? "" : `${st.title.replace(/^Stage \d: /, "")} `}topics, a new mix every time, for revision once topics have been taught.`,
      make: () => shuffle(st.topics).slice(0, 12).sort((a, b) => a.n - b.n).map((t, i) => Object.assign(gfOnline(gfItems(t, 1)[0], `${t.short}: `), { diff: i })) }))
  ];

  /* ---------- More Third and Fourth level practice: the S1 to S3 (and England Years 7 to 9) lessons that had none at their level ---------- */
  const numeracyUpperMore = [
    { id: "t-calc", title: "Decimals and the order of operations", level: "Third", organiser: NUM, check: false,
      blurb: "Multiply and divide with decimals without a calculator, and use the order of operations (brackets first).",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const a = rand(8) + 2, b = rand(8) + 2, pa = pick([1, 10]), pb = pick([10, 100]), ans = String(Number((a * b / (pa * pb)).toFixed(4)));
          const A = String(a / pa), B = String(b / pb);
          return typed(`${A} × ${B} = ?`, ans, { input: "decimal", accept: decAccept(Number(ans)), label: `${A}x${B}`, skill: "multiplying decimals", explain: `${a} × ${b} = ${a * b}. There ${pa * pb === 10 ? "is 1 decimal place" : `are ${String(pa * pb).length - 1} decimal places`} in the question, so ${ans}.` }); }
        if (k === 1) { const b = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8]), q = rand(12) + 2, a = dec(b * q);
          return typed(`${a} ÷ ${b} = ?`, q, { label: `${a}/${b}`, skill: "dividing by a decimal", explain: `Multiply both by 10: ${dec(a * 10)} ÷ ${b * 10} = ${q}.` }); }
        const a = rand(9) + 2, b = rand(9) + 2, c = rand(6) + 2;
        const forms = [[`${a} + ${b} × ${c}`, a + b * c, `Multiply first: ${b} × ${c} = ${b * c}, then ${a} + ${b * c}.`],
          [`(${a} + ${b}) × ${c}`, (a + b) * c, `Brackets first: ${a + b}, then × ${c}.`],
          [`${a * c} ÷ ${c} + ${b}²`, a + b * b, `Powers and division before adding: ${a} + ${b * b}.`],
          [`${a + b * c} − ${b} × ${c}`, a, `Multiply first: ${b} × ${c} = ${b * c}, then ${a + b * c} − ${b * c}.`]];
        const [sum, v, why] = pick(forms);
        return typed(`${sum} = ?`, v, { label: sum, skill: "the order of operations", explain: `${why} = ${v}.` });
      }) },
    { id: "t-factors", title: "HCF, LCM and prime factors", level: "Third", organiser: MFP, check: false,
      blurb: "Find highest common factors and lowest common multiples, write numbers as products of primes, and spot primes.",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const h = rand(9) + 2, a = h * (rand(5) + 1), b = h * (rand(5) + 2); if (a === b) return { label: "skip" }; const H = gcd(a, b);
          return typed(`What is the highest common factor (HCF) of ${a} and ${b}?`, H, { label: `hcf ${a},${b}`, skill: "highest common factor", explain: `${H} is the biggest number that goes into both ${a} and ${b}.` }); }
        if (k === 1) { const a = rand(10) + 3, b = rand(10) + 3; if (a === b) return { label: "skip" }; const L = a * b / gcd(a, b);
          return typed(`What is the lowest common multiple (LCM) of ${a} and ${b}?`, L, { label: `lcm ${a},${b}`, skill: "lowest common multiple", explain: `${L} is the first number in both times tables: ${L} = ${a} × ${L / a} = ${b} × ${L / b}.` }); }
        if (k === 2) { const e = [rand(4), rand(3), rand(2), rand(2)], ps = [2, 3, 5, 7], n = ps.reduce((t, p, i) => t * p ** e[i], 1);
          if (n < 12 || e.filter(Boolean).length < 2) return { label: "skip" };
          const show = ex => ps.map((p, i) => (ex[i] ? `${p}${ex[i] > 1 ? sup(ex[i]) : ""}` : "")).filter(Boolean).join(" × ");
          const ans = show(e), w1 = e.slice(), w2 = e.slice(), i = e.findIndex(Boolean), j = e.length - 1 - e.slice().reverse().findIndex(Boolean);
          w1[i] += 1; w2[j] = e[j] === 1 ? 2 : e[j] - 1;
          return choice(`Write ${n} as a product of its prime factors.`, ans, others2u(ans, [show(w1), show(w2), `${n / ps[i]} × ${ps[i]}`]), { label: `pf ${n}`, skill: "prime factors", explain: `Keep dividing by primes: ${n} = ${ans}.` }); }
        const n = rand(80) + 20, prime = range(2, Math.floor(Math.sqrt(n))).every(d => n % d), f = range(2, n - 1).find(d => n % d === 0);
        return choice(`Is ${n} a prime number?`, prime ? "Yes" : "No", [prime ? "No" : "Yes"], { label: `prime ${n}`, skill: "prime numbers", explain: prime ? `Nothing but 1 and ${n} goes into ${n}.` : `${n} = ${f} × ${n / f}, so it isn't prime.` });
      }) },
    { id: "t-fdp", title: "Fractions, decimals and percentages", level: "Third", organiser: FDP, check: false,
      blurb: "Change between fractions, decimals and percentages, put them in order, and find one amount as a percentage of another.",
      make: () => distinct(10, () => {
        const k = rand(4), F = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [1, 10], [3, 10], [7, 10], [1, 20], [7, 20], [9, 25], [3, 50]];
        if (k === 0) { const [n, d] = pick(F), p = n * 100 / d;
          return typed(`Write ${n}/${d} as a percentage. (%)`, String(p), { input: "decimal", label: `pc ${n}/${d}`, skill: "fractions to percentages", explain: `${n} ÷ ${d} = ${n / d}, and × 100 gives ${p}%.` }); }
        if (k === 1) { const [n, d] = pick(F);
          return typed(`Write ${n}/${d} as a decimal.`, String(n / d), { input: "decimal", accept: decAccept(n / d), label: `dec ${n}/${d}`, skill: "fractions to decimals", explain: `${n} ÷ ${d} = ${n / d}.` }); }
        if (k === 2) { const three = shuffle(F).slice(0, 3).filter((x, i, all) => all.findIndex(y => y[0] / y[1] === x[0] / x[1]) === i);
          if (three.length < 3) return { label: "skip" };
          const shown = three.map(([n, d], i) => [i === 0 ? `${n}/${d}` : i === 1 ? String(n / d) : `${n * 100 / d}%`, n / d]), small = shown.slice().sort((a, b) => a[1] - b[1])[0][0];
          return choice(`Which is the smallest: ${shown.map(s => s[0]).join(", ")}?`, small, shown.map(s => s[0]).filter(s => s !== small), { label: `order ${shown.map(s => s[0])}`, skill: "ordering fractions, decimals and percentages", explain: `As decimals: ${shown.map(s => `${s[0]} = ${s[1]}`).join(", ")}.` }); }
        const whole = pick([20, 25, 40, 50, 80, 200, 250, 400]), [n, d] = pick(F), part = whole * n / d;
        if (!Number.isInteger(part)) return { label: "skip" };
        return typed(`A pupil scores ${part} out of ${whole}. What percentage is that? (%)`, String(n * 100 / d), { input: "decimal", label: `of ${part}/${whole}`, skill: "one amount as a percentage of another", explain: `${part}/${whole} = ${n}/${d} = ${n * 100 / d}%.` });
      }) },
    { id: "t-area-volume", title: "Area and volume", level: "Third", organiser: MEAS, check: false,
      blurb: "Areas of triangles, parallelograms, trapeziums and compound shapes, and volumes of cuboids and prisms.",
      make: () => distinct(10, () => {
        const k = rand(6), b = rand(10) + 3, h = rand(8) + 2;
        if (k === 0) { if ((b * h) % 2) return { label: "skip" }; return typed(`A triangle has a base of ${b} cm and a height of ${h} cm. What is its area? (cm²)`, b * h / 2, { label: `tri ${b},${h}`, skill: "area of a triangle", explain: `½ × base × height = ½ × ${b} × ${h} = ${b * h / 2} cm².` }); }
        if (k === 1) return typed(`A parallelogram has a base of ${b} cm and a perpendicular height of ${h} cm. What is its area? (cm²)`, b * h, { label: `par ${b},${h}`, skill: "area of a parallelogram", explain: `Base × perpendicular height = ${b} × ${h} = ${b * h} cm².` });
        if (k === 2) { const a = rand(8) + 2; if (((a + b) * h) % 2) return { label: "skip" }; return typed(`A trapezium has parallel sides of ${a} cm and ${b} cm, ${h} cm apart. What is its area? (cm²)`, (a + b) * h / 2, { label: `trap ${a},${b},${h}`, skill: "area of a trapezium", explain: `½ × (a + b) × h = ½ × ${a + b} × ${h} = ${(a + b) * h / 2} cm².` }); }
        if (k === 3) { const W = rand(6) + 6, H = rand(6) + 6, w = rand(W - 3) + 2, hh = rand(H - 3) + 2;
          return typed(`An L-shape is a ${W} m by ${H} m rectangle with a ${w} m by ${hh} m rectangle cut from one corner. What is its area? (m²)`, W * H - w * hh, { label: `L ${W},${H},${w},${hh}`, skill: "area of compound shapes", explain: `Whole rectangle minus the corner: ${W * H} − ${w * hh} = ${W * H - w * hh} m².` }); }
        if (k === 4) { const l = rand(8) + 2, w = rand(6) + 2, d = rand(6) + 2;
          return typed(`A cuboid is ${l} cm by ${w} cm by ${d} cm. What is its volume? (cm³)`, l * w * d, { label: `cub ${l},${w},${d}`, skill: "volume of a cuboid", explain: `${l} × ${w} × ${d} = ${l * w * d} cm³.` }); }
        const A = pick([6, 8, 12, 15, 20, 24]), L = rand(10) + 3;
        return typed(`A prism has a cross-section of area ${A} cm² and a length of ${L} cm. What is its volume? (cm³)`, A * L, { label: `prism ${A},${L}`, skill: "volume of a prism", explain: `Area of cross-section × length = ${A} × ${L} = ${A * L} cm³.` });
      }) },
    { id: "t-transform", title: "Coordinates and transformations", level: "Third", organiser: ANGLE, check: false,
      blurb: "Points in four quadrants: reflect, translate and rotate them, and find midpoints.",
      make: () => distinct(10, () => {
        const x = (rand(6) + 1) * (rand(2) ? 1 : -1), y = (rand(6) + 1) * (rand(2) ? 1 : -1), P = (a, b) => `(${minus(a)}, ${minus(b)})`, k = rand(5);
        const ask = (how, to, wrong, why, skill) => choice(`The point ${P(x, y)} is ${how}. Where does it end up?`, to, others2u(to, wrong), { label: `${skill} ${x},${y} ${how}`, skill, explain: why });
        if (k === 0) return ask("reflected in the x-axis", P(x, -y), [P(-x, y), P(-x, -y), P(y, x)], "Reflecting in the x-axis keeps x and changes the sign of y.", "reflection");
        if (k === 1) return ask("reflected in the y-axis", P(-x, y), [P(x, -y), P(-x, -y), P(y, x)], "Reflecting in the y-axis keeps y and changes the sign of x.", "reflection");
        if (k === 2) { const dx = rand(9) - 4 || 3, dy = rand(9) - 4 || -2;
          return ask(`moved ${Math.abs(dx)} ${dx > 0 ? "right" : "left"} and ${Math.abs(dy)} ${dy > 0 ? "up" : "down"}`, P(x + dx, y + dy), [P(x - dx, y - dy), P(x + dy, y + dx), P(x + dx, y - dy)], `Add ${minus(dx)} to x and ${minus(dy)} to y.`, "translation"); }
        if (k === 3) return ask("rotated 180° about the origin", P(-x, -y), [P(-x, y), P(x, -y), P(y, x)], "A half turn about the origin changes the sign of both coordinates.", "rotation");
        const x2 = x + 2 * (rand(4) + 1), y2 = y - 2 * (rand(4) + 1);
        return choice(`What is the midpoint of ${P(x, y)} and ${P(x2, y2)}?`, P((x + x2) / 2, (y + y2) / 2), others2u(P((x + x2) / 2, (y + y2) / 2), [P(x2 - x, y2 - y), P((x2 - x) / 2, (y2 - y) / 2), P((x + x2) / 2, (y - y2) / 2)]),
          { label: `mid ${x},${y},${x2},${y2}`, skill: "midpoints", explain: `Average the x values and the y values: ${P((x + x2) / 2, (y + y2) / 2)}.` });
      }) },
    { id: "t-venn", title: "Sets and Venn diagrams", level: "Third", organiser: CHANCE, check: false,
      blurb: "Count what is in each part of a Venn diagram, and find unions and intersections of sets.",
      make: () => distinct(10, () => {
        const k = rand(3);
        if (k === 0) { const both = rand(8) + 2, a = both + rand(10) + 2, b = both + rand(10) + 2, none = rand(6) + 1, total = a + b - both + none;
          return typed(`In a class of ${total}, ${a} have a dog, ${b} have a cat and ${both} have both. How many have neither?`, none, { label: `venn ${a},${b},${both},${total}`, skill: "Venn diagrams", explain: `Dog only ${a - both}, cat only ${b - both}, both ${both}: ${a + b - both} have a pet, so ${total} − ${a + b - both} = ${none}.` }); }
        if (k === 1) { const both = rand(8) + 2, a = both + rand(10) + 2, b = both + rand(10) + 2;
          return typed(`${a} pupils play football and ${b} play hockey. ${both} play both. How many play only football?`, a - both, { label: `only ${a},${b},${both}`, skill: "Venn diagrams", explain: `Take the ${both} who play both out of the ${a}: ${a - both}.` }); }
        const m = pick([3, 4, 5]), n = pick([2, 6, 7]), top = pick([20, 24, 30]), A = range(1, top).filter(v => v % m === 0), B = range(1, top).filter(v => v % n === 0);
        if (m === n) return { label: "skip" };
        const inter = A.filter(v => B.includes(v)), uni = new Set(A.concat(B)), un = rand(2);
        return typed(`A = multiples of ${m} up to ${top}, and B = multiples of ${n} up to ${top}. How many numbers are in A ${un ? "∪" : "∩"} B?`, un ? uni.size : inter.length, { label: `set ${m},${n},${top},${un}`, skill: un ? "union of sets" : "intersection of sets",
          explain: un ? `A ∪ B is everything in A or B (or both): ${[...uni].sort((p, q) => p - q).join(", ")}.` : `A ∩ B is what is in both: ${inter.length ? inter.join(", ") : "nothing"}.` });
      }) },
    { id: "f-fraction-calc", title: "Multiplying and dividing fractions", level: "Fourth", organiser: FDP, check: false,
      blurb: "Multiply and divide fractions and mixed numbers, giving answers in simplest form.",
      make: () => distinct(10, () => {
        const k = rand(4), a = rand(5) + 1, b = rand(6) + 2, c = rand(5) + 1, d = rand(6) + 2;
        if (a >= b || c >= d) return { label: "skip" };
        const mixed = (n, dd) => { const g = gcd(n, dd); n /= g; dd /= g; const w = Math.floor(n / dd), r = n % dd; return dd === 1 ? String(n) : w ? `${w} ${r}/${dd}` : `${r}/${dd}`; };
        if (k === 0) { const ans = mixed(a * c, b * d); return choice(`${a}/${b} × ${c}/${d} = ?`, ans, others2u(ans, [mixed(a + c, b + d), mixed(a * d, b * c), mixed(a * c, b + d)]), { label: `${a}/${b}x${c}/${d}`, skill: "multiplying fractions", explain: `Multiply the tops and the bottoms: ${a * c}/${b * d}${ans !== `${a * c}/${b * d}` ? ` = ${ans}` : ""}.` }); }
        if (k === 1) { const ans = mixed(a * d, b * c); return choice(`${a}/${b} ÷ ${c}/${d} = ?`, ans, others2u(ans, [mixed(a * c, b * d), mixed(b * c, a * d), mixed(a * d, b * d)]), { label: `${a}/${b}/${c}/${d}`, skill: "dividing fractions", explain: `Flip the second fraction and multiply: ${a}/${b} × ${d}/${c} = ${a * d}/${b * c}${ans !== `${a * d}/${b * c}` ? ` = ${ans}` : ""}.` }); }
        if (k === 2) { const w = rand(3) + 1, top = w * b + a, ans = `${top}/${b}`; if (gcd(a, b) !== 1) return { label: "skip" };
          return choice(`Write ${w} ${a}/${b} as an improper fraction.`, ans, others2u(ans, [`${w * a + b}/${b}`, `${w + a}/${b}`, `${top}/${w * b}`]), { label: `imp ${w},${a},${b}`, skill: "mixed numbers", explain: `${w} × ${b} = ${w * b}, plus ${a}: ${ans}.` }); }
        const w1 = rand(2) + 1, w2 = rand(2) + 1, n = (w1 * b + a) * (w2 * d + c), dd = b * d, ans = mixed(n, dd);
        if (gcd(a, b) !== 1 || gcd(c, d) !== 1) return { label: "skip" };
        return choice(`${w1} ${a}/${b} × ${w2} ${c}/${d} = ?`, ans, others2u(ans, [mixed(w1 * w2 * b * d + a * c, b * d), mixed(n + dd, dd), mixed(n, dd * 2)]), { label: `mix ${w1}${a}${b}${w2}${c}${d}`, skill: "multiplying mixed numbers", explain: `Make them improper first: ${w1 * b + a}/${b} × ${w2 * d + c}/${d} = ${n}/${dd} = ${ans}.` });
      }) },
    { id: "f-equations", title: "Harder equations and inequalities", level: "Fourth", organiser: EQUATION, check: false,
      blurb: "Solve equations with the unknown on both sides, with brackets and with fractions, and solve inequalities.",
      make: () => distinct(10, () => {
        const k = rand(4), x = rand(13) - 4;
        if (k === 0) { const c = rand(4) + 1, a = c + rand(4) + 1, b = rand(13) - 6, d = (a - c) * x + b;
          return typed(`Solve ${expr([a, "x"], [b, ""])} = ${expr([c, "x"], [d, ""])}. What is x?`, x, { accept: negAccept(x), label: `both ${a},${b},${c},${d}`, skill: "unknowns on both sides", explain: `Take ${c}x from both sides: ${expr([a - c, "x"], [b, ""])} = ${minus(d)}, so ${a - c === 1 ? "x" : `${a - c}x`} = ${minus(d - b)} and x = ${minus(x)}.` }); }
        if (k === 1) { const a = rand(5) + 2, b = rand(11) - 5; if (!b) return { label: "skip" };
          return typed(`Solve ${a}(x ${signed(b)}) = ${minus(a * (x + b))}. What is x?`, x, { accept: negAccept(x), label: `br ${a},${b},${x}`, skill: "equations with brackets", explain: `Divide by ${a}: x ${signed(b)} = ${minus(x + b)}, so x = ${minus(x)}.` }); }
        if (k === 2) { const a = rand(4) + 2, b = rand(9) + 1, X = a * (rand(8) + 1);
          return typed(`Solve x/${a} + ${b} = ${X / a + b}. What is x?`, X, { label: `fr ${a},${b},${X}`, skill: "equations with fractions", explain: `Take ${b}: x/${a} = ${X / a}. Multiply by ${a}: x = ${X}.` }); }
        const a = rand(4) + 2, b = rand(9) + 1, ans = `x < ${minus(x)}`;
        return choice(`Solve ${b} − ${a}x > ${minus(b - a * x)}.`, ans, others2u(ans, [`x > ${minus(x)}`, `x < ${minus(-x)}`, `x > ${minus(-x)}`]), { label: `neg ineq ${a},${b},${x}`, skill: "inequalities", explain: `−${a}x > ${minus(-a * x)}. Dividing by a negative number flips the sign: x < ${minus(x)}.` });
      }) },
    { id: "f-prisms", title: "Volume and surface area of prisms and cylinders", level: "Fourth", organiser: MEAS, check: false,
      blurb: "Volumes of prisms and cylinders, and the surface area of cuboids and cylinders (take π as 3.14).",
      make: () => distinct(10, () => {
        const k = rand(4);
        if (k === 0) { const r = rand(6) + 2, h = rand(10) + 3, v = dec(3.14 * r * r * h);
          return typed(`A cylinder has radius ${r} cm and height ${h} cm. What is its volume? Use π = 3.14. (cm³)`, v, { input: "decimal", label: `cylv ${r},${h}`, skill: "volume of a cylinder", explain: `V = πr²h = 3.14 × ${r * r} × ${h} = ${v} cm³.` }); }
        if (k === 1) { const b = rand(6) + 2, h = 2 * (rand(4) + 1), L = rand(10) + 3;
          return typed(`A triangular prism is ${L} cm long. Its triangle end has a base of ${b} cm and a height of ${h} cm. What is its volume? (cm³)`, b * h / 2 * L, { label: `tprism ${b},${h},${L}`, skill: "volume of a prism", explain: `End area = ½ × ${b} × ${h} = ${b * h / 2} cm². × ${L} = ${b * h / 2 * L} cm³.` }); }
        if (k === 2) { const l = rand(8) + 2, w = rand(6) + 2, d = rand(6) + 2, sa = 2 * (l * w + l * d + w * d);
          return typed(`A cuboid is ${l} cm by ${w} cm by ${d} cm. What is its total surface area? (cm²)`, sa, { label: `sa ${l},${w},${d}`, skill: "surface area of a cuboid", explain: `Three pairs of faces: 2 × (${l * w} + ${l * d} + ${w * d}) = ${sa} cm².` }); }
        const r = rand(5) + 2, h = rand(8) + 3, sa = dec(2 * 3.14 * r * r + 2 * 3.14 * r * h);
        return typed(`A closed cylinder has radius ${r} cm and height ${h} cm. What is its total surface area? Use π = 3.14. (cm²)`, sa, { input: "decimal", label: `cylsa ${r},${h}`, skill: "surface area of a cylinder", explain: `Two circles (2 × 3.14 × ${r}²) plus the curved side (2 × 3.14 × ${r} × ${h}) = ${sa} cm².` });
      }) }
  ];

  /* ---------- Number games for older pupils: Make the Target, Equal Pairs and Number Line ---------- */
  // Plain screens like the word games (no mascot), for P5 to S3. Each round is one result.

  // Make the Target: join number tiles with + − × ÷ to make the target. Every target is made by
  // joining the tiles at random first, so there is always a way (shown if the pupil asks)
  const TARGET_SPEC = {
    Second: { small: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], big: [10, 20, 25], tiles: 4, use: [3, 3, 4, 4, 4], lo: 12, hi: 120, ops: ["+", "−", "×"] },
    Third: { small: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], big: [25, 50, 75, 100], tiles: 5, use: [3, 4, 4, 5, 5], lo: 101, hi: 999, ops: ["+", "−", "×", "÷"] }
  };
  const applyOp = (a, op, b) => (op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : b && a % b === 0 ? a / b : NaN);
  function targetRound(level, use) {
    const s = TARGET_SPEC[level];
    for (let tries = 0; tries < 400; tries++) {
      const tiles = shuffle(s.small).slice(0, s.tiles - 1).concat(pick(s.big)).sort((a, b) => a - b);
      const order = shuffle(tiles).slice(0, use);
      let value = order[0];
      const steps = [];
      let ok = true;
      for (const t of order.slice(1)) {
        const op = pick(s.ops);
        // Keep each step a whole number that isn't negative, and never × 1 or ÷ 1 (they don't change anything)
        let [a, b] = op === "−" || op === "÷" ? [Math.max(value, t), Math.min(value, t)] : [value, t];
        if ((op === "×" || op === "÷") && Math.min(a, b) === 1) { ok = false; break; }
        const r = applyOp(a, op, b);
        if (!Number.isInteger(r) || r <= 0) { ok = false; break; }
        steps.push([a, op, b, r]);
        value = r;
      }
      if (!ok || value < s.lo || value > s.hi || tiles.includes(value)) continue;
      return { kind: "target", tiles, target: value, steps, answer: String(value), label: `Make ${value} from ${tiles.join(", ")}`,
        spelling: `Make ${value}`, tokens: [], skill: "calculating: choosing + − × ÷ to reach a target", ops: s.ops.length === 4 ? s.ops : ["+", "−", "×", "÷"],
        diff: use * 1000 + value };
    }
    return null;
  }
  const targetGame = level => () => {
    const rounds = [];
    for (const use of TARGET_SPEC[level].use) {
      for (let t = 0; t < 20; t++) { const r = targetRound(level, use); if (r && !rounds.some(x => x.target === r.target)) { rounds.push(r); break; } }
    }
    return rounds;
  };

  // Equal Pairs: twelve cards face up; pair each card with the one worth the same
  const nf = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace("-", "−");
  const PAIR_SETS = {
    Second: [
      { title: "Fractions and decimals", diff: 1, pairs: () => [["1/2", "0.5"], ["1/4", "0.25"], ["3/4", "0.75"], ["1/10", "0.1"], ["3/10", "0.3"], ["1/5", "0.2"],
        ["2/5", "0.4"], ["7/10", "0.7"], ["1/100", "0.01"], ["3/5", "0.6"], ["9/10", "0.9"], ["4/5", "0.8"]] },
      { title: "Fractions and percentages", diff: 2, pairs: () => [["1/2", "50%"], ["1/4", "25%"], ["3/4", "75%"], ["1/10", "10%"], ["1/5", "20%"], ["2/5", "40%"],
        ["3/10", "30%"], ["1/100", "1%"], ["9/10", "90%"], ["3/5", "60%"], ["7/10", "70%"], ["4/5", "80%"]] },
      { title: "Times tables and division", diff: 3, pairs: () => {
        const out = [], seen = new Set();
        for (let t = 0; t < 200 && out.length < 12; t++) {
          const a = 3 + rand(7), b = 3 + rand(7), p = a * b;
          if (seen.has(p)) continue;
          seen.add(p);
          out.push(rand(3) ? [`${a} × ${b}`, String(p)] : [`${p} ÷ ${a}`, String(b)]);
        }
        // A division's answer can't also be another card's answer
        const vals = new Set();
        return out.filter(([, v]) => !vals.has(v) && vals.add(v));
      } },
      { title: "Metric units", diff: 4, pairs: () => [["1.5 km", "1500 m"], ["250 cm", "2.5 m"], ["3 kg", "3000 g"], ["750 ml", "0.75 l"], ["0.5 kg", "500 g"],
        ["42 mm", "4.2 cm"], ["2 l", "2000 ml"], ["3.25 km", "3250 m"], ["80 cm", "0.8 m"], ["1.2 kg", "1200 g"], ["5 cm", "50 mm"], ["0.1 l", "100 ml"]] }
    ],
    Third: [
      { title: "Negative numbers", diff: 1, pairs: () => {
        const out = [], vals = new Set();
        const makers = [
          () => { const a = -(2 + rand(9)), b = 2 + rand(12); return [`${nf(a)} + ${b}`, a + b]; },
          () => { const a = 1 + rand(8), b = a + 2 + rand(8); return [`${a} − ${b}`, a - b]; },
          () => { const a = -(2 + rand(6)), b = 2 + rand(6); return [`${nf(a)} × ${b}`, a * b]; },
          () => { const a = -(2 + rand(6)), b = -(2 + rand(5)); return [`${nf(a)} × (${nf(b)})`, a * b]; },
          () => { const b = 2 + rand(5), q = -(2 + rand(6)); return [`${nf(q * b)} ÷ ${b}`, q]; },
          () => { const a = 1 + rand(9), b = 2 + rand(9); return [`${a} − (${nf(-b)})`, a + b]; }
        ];
        for (let t = 0; t < 300 && out.length < 12; t++) { const [e, v] = pick(makers)(); if (!vals.has(v)) { vals.add(v); out.push([e, nf(v)]); } }
        return out;
      } },
      { title: "Powers and roots", diff: 2, pairs: () => [["2^5", "32"], ["3^3", "27"], ["10^4", "10 000"], ["5^2", "25"], ["4^3", "64"], ["√81", "9"],
        ["√144", "12"], ["2^3", "8"], ["√49", "7"], ["6^2", "36"], ["10^3", "1000"], ["3^4", "81"], ["√400", "20"], ["2^7", "128"]] },
      { title: "Ratios in simplest form", diff: 3, pairs: () => {
        const out = [], seen = new Set();
        for (let t = 0; t < 300 && out.length < 12; t++) {
          const a = 1 + rand(6), b = 2 + rand(7), k = 2 + rand(5);
          const g = (x, y) => (y ? g(y, x % y) : x);
          if (a === b || g(a, b) !== 1 || seen.has(`${a}:${b}`)) continue;
          seen.add(`${a}:${b}`);
          out.push([`${a * k} : ${b * k}`, `${a} : ${b}`]);
        }
        return out;
      } },
      { title: "Percentages of amounts", diff: 4, pairs: () => {
        const out = [], vals = new Set();
        for (let t = 0; t < 300 && out.length < 12; t++) {
          const p = pick([5, 10, 15, 20, 25, 30, 40, 75]), n = pick([20, 40, 60, 80, 120, 140, 160, 200, 240, 300, 360]);
          const v = (p * n) / 100;
          if (!Number.isInteger(v) || vals.has(v)) continue;
          vals.add(v);
          out.push([`${p}% of ${n}`, String(v)]);
        }
        return out;
      } },
      { title: "Fractions, decimals and percentages", diff: 5, pairs: () => [["3/8", "0.375"], ["5/8", "62.5%"], ["1/3", "0.333…"], ["2/3", "66.7%"], ["7/20", "35%"],
        ["1/8", "0.125"], ["11/20", "0.55"], ["3/25", "12%"], ["0.04", "1/25"], ["1.5", "150%"], ["9/50", "18%"], ["2.25", "2 1/4"]] }
    ]
  };
  const pairsGame = level => () => {
    const sets = PAIR_SETS[level];
    const chosen = level === "Third" ? shuffle(sets).slice(0, 4).sort((a, b) => a.diff - b.diff) : sets;
    return chosen.map(set => {
      const pairs = shuffle(set.pairs()).slice(0, 6);
      return { kind: "pairs", title: set.title, pairs, answer: set.title, label: set.title, spelling: set.title, tokens: [],
        skill: `equal values: ${set.title.toLowerCase()}`, diff: set.diff };
    }).filter(r => r.pairs.length === 6);
  };

  // Number Line: tap where the number goes. Close (within 2% of the line) earns two stars, near (5%) one
  const roundTo2 = n => Math.round(n * 1000) / 1000;
  const LINE_ROUNDS = {
    Second: [
      () => { const v = 5 + rand(91); return { min: 0, max: 100, step: 10, value: v, show: String(v) }; },
      () => { const v = (1 + rand(19)) * 50 - rand(2) * 20 + 10; return { min: 0, max: 1000, step: 100, value: v, show: String(v) }; },
      () => { const v = roundTo2((1 + rand(98)) / 100); return { min: 0, max: 1, step: 0.1, value: v, show: String(v) }; },
      () => { const [n, d] = pick([[1, 4], [3, 4], [2, 5], [3, 5], [1, 3], [2, 3], [7, 10], [3, 8], [5, 8], [1, 5], [4, 5], [5, 6]]); return { min: 0, max: 1, step: 0.1, value: n / d, show: `${n}/${d}` }; },
      () => { let v = 0; while (!v) v = rand(39) - 19; return { min: -20, max: 20, step: 5, value: v, show: nf(v) }; },
      () => { const v = roundTo2((1 + rand(98)) / 10); return { min: 0, max: 10, step: 1, value: v, show: String(v) }; }
    ],
    Third: [
      () => { let v = 0; while (!v) v = roundTo2((rand(19) - 9) / 10 + (rand(2) ? 0.05 : 0)); return { min: -1, max: 1, step: 0.25, value: v, show: nf(v) }; },
      () => { const w = rand(3), [n, d] = pick([[1, 4], [3, 4], [1, 3], [2, 3], [1, 2], [2, 5], [5, 8]]); return { min: 0, max: 3, step: 0.5, value: w + n / d, show: w ? `${w} ${n}/${d}` : `${n}/${d}` }; },
      () => { const n = pick([2, 3, 5, 7, 10, 12, 18, 20, 30, 40, 50, 60, 70, 80, 90]); return { min: 0, max: 10, step: 1, value: Math.sqrt(n), show: `√${n}` }; },
      () => { const v = roundTo2((5 + rand(91)) / 1000); return { min: 0, max: 0.1, step: 0.01, value: v, show: String(v) }; },
      () => { let v = 0; while (!v) v = (rand(99) - 49) + (rand(2) ? 0.5 : 0); return { min: -50, max: 50, step: 10, value: v, show: nf(v) }; },
      () => { const v = pick([[0.125, "12.5%"], [0.375, "37.5%"], [0.625, "62.5%"], [0.05, "5%"], [0.875, "87.5%"], [1 / 3, "1/3"], [2 / 3, "2/3"], [0.15, "15%"], [0.45, "45%"], [0.8, "80%"], [0.35, "35%"]]);
        return { min: 0, max: 1, step: 0.1, value: v[0], show: v[1] }; }
    ]
  };
  const lineGame = level => () => LINE_ROUNDS[level].map((make, i) => Object.assign(make(), { kind: "numline", tokens: [], diff: i + 1 }))
    .map(q => Object.assign(q, { answer: q.show, label: `${q.show} on a line from ${nf(q.min)} to ${nf(q.max)}`, spelling: q.show,
      skill: "placing numbers on a number line" }));

  const numberGames = [
    { id: "ng-target-second", title: "Make the Target", level: "Second", organiser: NUM,
      blurb: "Join four number tiles with +, −, × and ÷ to make the target number. There's always a way.", make: targetGame("Second") },
    { id: "ng-target-third", title: "Make the Target: bigger numbers", level: "Third", organiser: NUM,
      blurb: "Five tiles, a target in the hundreds and all four operations. Plan a few steps ahead.", make: targetGame("Third") },
    { id: "ng-pairs-second", title: "Equal Pairs", level: "Second", organiser: FDP,
      blurb: "Match cards worth the same: fractions and decimals, percentages, tables facts and metric units.", make: pairsGame("Second") },
    { id: "ng-pairs-third", title: "Equal Pairs: ratios, powers and percentages", level: "Third", organiser: FDP,
      blurb: "Match negative number sums, powers and roots, ratios in simplest form and percentages of amounts.", make: pairsGame("Third") },
    { id: "ng-line-second", title: "Number Line", level: "Second", organiser: NUM,
      blurb: "Tap where each number goes: whole numbers, decimals, fractions and negative numbers.", make: lineGame("Second") },
    { id: "ng-line-third", title: "Number Line: roots, fractions and negatives", level: "Third", organiser: NUM,
      blurb: "Place square roots, mixed numbers, thousandths and negative decimals on a line.", make: lineGame("Third") }
  ];

  const AREAS = [
    { id: "games", title: "Games with Pip", colour: "#0F766E", icon: "🎮", activities: trailGames.concat(switchGames, canopyGames), game: true },
    { id: "word-games", title: "Word games", colour: "#334155", icon: "🧩", activities: wordGames, game: true, older: true },
    // Number games: plain like the word games, for P5 to S3; on every pupil's home page, whatever their look
    { id: "number-games", title: "Number games", colour: "#9D174D", icon: "🎯", activities: numberGames, game: true, older: true, allLooks: true },
    { id: "writing", title: "Writing: sentences and punctuation", colour: "#8B5CF6", icon: "✍️", activities: writing },
    // England's grammar by year: found by teachers in the Library and set as work, not shown on every pupil's home page
    { id: "grammar", title: "Grammar and punctuation by year (England)", colour: "#7C3AED", icon: "🔤", activities: grammarByYear, assignedOnly: true, england: true },
    { id: "england-checks", title: "Practice for England's national checks", colour: "#B45309", icon: "⏱️", activities: englandChecks, assignedOnly: true, england: true },
    // More of England's curriculum, beyond what the CfE activities reach: set by the teacher, like the grammar
    { id: "england-maths", title: "More maths from England's curriculum", colour: "#9333EA", icon: "📐", activities: englandMaths, assignedOnly: true, england: true },
    { id: "england-english", title: "More spelling and grammar from England's curriculum", colour: "#6D28D9", icon: "📝", activities: englandEnglish, assignedOnly: true, england: true },
    { id: "secondary", title: "Secondary practice", colour: "#2563A6", icon: "📘", activities: secondary.filter(a => !/^Numeracy/.test(a.organiser)), assignedOnly: true },
    { id: "reading", title: "Reading", colour: "#0EB5F2", icon: "📖", activities: reading },
    { id: "stories", title: "Stories to read by myself", colour: "#F59E0B", icon: "📚", activities: stories },
    { id: "listening", title: "Listening and sounds", colour: "#12C6B7", icon: "👂", activities: listening.concat(passageActivities.filter(a => a.area === "listening")) },
    { id: "numeracy", title: "Numeracy and maths", colour: "#FF4081", icon: "🔢", activities: numeracy.concat(numeracyMore, numeracyUpper, numeracyUpperMore, numeracyGCSE, numeracyExam, numeracySQA, secondary.filter(a => /^Numeracy/.test(a.organiser)).map(a => Object.assign(a, { check: false }))) }
  ];
  AREAS.forEach(area => area.activities.forEach(a => { a.area = area.id; a.colour = area.colour; a.icon = area.icon; if (area.game) a.game = true; }));
  function difficulty(q) {
    if (Number.isFinite(q.difficulty)) return q.difficulty;
    // Clock times: o'clock, then half past, then quarter past and quarter to
    const said = String(q.label || "");
    if (/o'clock/.test(said)) return 1;
    if (/half past/.test(said)) return 2;
    if (/quarter (past|to)/.test(said)) return /to/.test(said) ? 4 : 3;
    const nums = String(q.label || q.prompt || "").match(/\d+(\.\d+)?/g);
    const answer = Number(q.answer);
    if (!nums || !Number.isFinite(answer)) return null;
    const values = nums.map(Number).concat(answer);
    const crossesTen = /[+−]/.test(q.label || "") && Math.floor(values[0] / 10) !== Math.floor(answer / 10);
    return Math.max(...values) + answer / 10 + (crossesTen ? 6 : 0);
  }
  const easyFirst = qs => {
    const scored = qs.map(q => [difficulty(q), q]);
    return scored.every(([d]) => d !== null) ? scored.sort((x, y) => x[0] - y[0]).map(([, q]) => q) : qs;
  };
  AREAS.filter(area => !area.game).forEach(area => area.activities.forEach(a => {
    if (!/^Numeracy/.test(a.organiser || "")) return;
    const make = a.make;
    a.make = (...args) => easyFirst(make(...args));
  }));
  const ALL = AREAS.flatMap(a => a.activities);

  // Questions are made in a random order, so each activity puts them easy to hard: a child starts with the
  // smaller numbers, shorter words and simpler sentences and builds up, instead of meeting a hard one first, an
  // easy one next and a hard one again. Stories with questions in the order of the passage, listening work and the
  // Year 4 times tables check (which is deliberately not ordered) and the Counting Canopy runs (a planned mix of
  // four kinds of puzzle) keep their own order.
  const demand = q => {
    if (typeof q.diff === "number") return q.diff;
    const text = String(q.prompt || q.label || "");
    const numbers = `${text} ${q.answer == null ? "" : q.answer}`.match(/\d+(?:\.\d+)?/g) || [];
    const size = Math.max(0, ...numbers.map(Number), q.total || 0, q.target || 0, q.count || 0);
    return size + (q.tokens || []).length * 5 + text.length * 0.05 + String(q.answer == null ? "" : q.answer).length * 0.3;
  };
  const easyToHard = qs => (Array.isArray(qs) && qs.length > 3
    ? qs.map((q, i) => [q, i]).sort((x, y) => demand(x[0]) - demand(y[0]) || x[1] - y[1]).map(x => x[0]) : qs);
  ALL.forEach(act => {
    if (act.passage || act.listen || act.id === "n-mtc" || /^g-canopy-run/.test(act.id) || typeof act.make !== "function") return;
    const make = act.make;
    act.make = () => easyToHard(make());
  });

  // The Curriculum for Excellence Experiences and Outcomes each piece of work builds towards, so
  // lesson plans and the library can quote them. These are the current codes: the refreshed
  // curriculum (from August 2028) replaces them with its Know-Do-Understand model.
  const EO_BY_ORGANISER = [
    [/spelling/, ["ENG 0-12a", "LIT 0-13a", "LIT 0-21a"], ["LIT 1-21a"], ["LIT 2-21a"]],
    [/Tools for reading/, ["ENG 0-12a", "LIT 0-13a"], ["ENG 1-12a", "LIT 1-13a"], ["ENG 2-12a", "LIT 2-13a"]],
    [/Understanding/, ["ENG 0-17a", "LIT 0-19a"], ["LIT 1-16a", "ENG 1-17a"], ["LIT 2-16a", "ENG 2-17a"]],
    [/Tools for writing/, ["ENG 0-12a", "LIT 0-13a", "LIT 0-21a"], ["LIT 1-22a"], ["LIT 2-22a"]],
    [/Listening/, ["LIT 0-01a", "LIT 0-04a"], ["LIT 1-04a"], ["LIT 2-04a"]],
    [/Estimation/, ["MNU 0-01a"], ["MNU 1-01a"], ["MNU 2-01a"]],
    [/Number and number/, ["MNU 0-02a", "MNU 0-03a"], ["MNU 1-02a", "MNU 1-03a"], ["MNU 2-02a", "MNU 2-03a"]],
    [/Multiples/, [], [], ["MTH 2-05a"]],
    [/Fractions/, ["MNU 0-07a"], ["MNU 1-07a", "MNU 1-07b", "MTH 1-07c"], ["MNU 2-07a", "MNU 2-07b", "MTH 2-07c"]],
    [/Money/, ["MNU 0-09a"], ["MNU 1-09a", "MNU 1-09b"], ["MNU 2-09a"]],
    [/Time/, ["MNU 0-10a"], ["MNU 1-10a"], ["MNU 2-10a"]],
    [/Measurement/, ["MNU 0-11a"], ["MNU 1-11a"], ["MNU 2-11a", "MNU 2-11b"]],
    [/Data/, ["MNU 0-20a"], ["MNU 1-20a"], ["MNU 2-20a"]],
    [/chance/, [], ["MNU 1-22a"], ["MNU 2-22a"]],
    [/2D shapes/, ["MTH 0-16a"], ["MTH 1-16a"], ["MTH 2-16a"]],
    [/Angle/, ["MTH 0-17a"], ["MTH 1-17a"], ["MTH 2-17a", "MTH 2-17c"]],
    [/Patterns/, ["MTH 0-13a"], ["MTH 1-13a", "MTH 1-13b"], ["MTH 2-13a"]],
    [/Expressions/, [], ["MTH 1-15a", "MTH 1-15b"], ["MTH 2-15a"]]
  ];
  const EO_FOR_ID = {
    "n-negative": ["MNU 2-04a"], "n-durations": ["MNU 1-10c"], "n-area": ["MNU 2-11c"], "n-units": ["MNU 2-11b"],
    "n-decimals": ["MNU 2-02a", "MNU 2-03b"], "n-percent": ["MNU 2-07a", "MNU 2-07b"], "n-equivalent": ["MTH 2-07c", "MNU 2-07b"],
    "sec-linear-equations": ["MTH 3-15a", "MTH 3-15b"], "sec-proportion": ["MNU 4-08a"], "sec-evidence-bias": ["LIT 4-16a", "ENG 4-17a", "LIT 4-18a"],
    "w-build-prefixes": ["LIT 2-21a", "LIT 2-13a"], "w-build-suffixes": ["LIT 2-21a", "LIT 2-13a"], "w-build-roots": ["LIT 3-21a", "LIT 3-13a"],
    "w-code-5": ["LIT 2-21a"], "w-code-6": ["LIT 2-21a"], "w-code-long": ["LIT 3-21a"],
    "w-hunt-second": ["LIT 2-21a", "LIT 2-13a"], "w-hunt-third": ["LIT 3-21a", "LIT 3-13a"],
    "w-sort-types": ["LIT 2-22a"], "w-sort-meaning": ["LIT 2-13a", "ENG 2-12a"], "w-sort-spelling": ["LIT 3-21a"],
    "w-cross-second": ["LIT 2-21a", "LIT 2-13a"], "w-cross-third": ["LIT 3-21a", "LIT 3-13a"],
    "w-grid-4": ["LIT 2-21a"], "w-grid-5": ["LIT 3-21a"],
    "t-negative-calc": ["MNU 3-04a"], "t-rounding-dp": ["MNU 3-01a"], "t-powers": ["MTH 3-06a"], "t-fractions-ops": ["MTH 3-07b"],
    "t-ratio": ["MNU 3-08a"], "t-speed": ["MNU 3-10a"], "t-sequences": ["MTH 3-13a"], "t-expressions": ["MTH 3-14a"], "t-angles": ["MTH 3-17a"],
    "t-probability": ["MNU 3-22a"], "t-best-buy": ["MNU 3-09a"], "f-sci-notation": ["MTH 4-06b"], "f-sig-figs": ["MNU 4-01a"],
    "f-percent-change": ["MNU 4-07a"], "f-brackets": ["MTH 4-14a", "MTH 4-14b"], "f-pythagoras": ["MTH 4-16a"], "f-circles": ["MTH 4-16b"],
    "f-averages": ["MTH 4-20b"], "f-nth-term": ["MTH 4-13a"],
    "t-calc": ["MNU 3-03a", "MNU 3-03b"], "t-factors": ["MTH 3-05a"], "t-fdp": ["MNU 3-07a", "MTH 3-07c"], "t-area-volume": ["MNU 3-11a", "MTH 3-11b"],
    "t-transform": ["MTH 3-18a", "MTH 3-19a"], "t-venn": ["MNU 3-22a"], "f-fraction-calc": ["MTH 4-07b"], "f-equations": ["MTH 4-15a"], "f-prisms": ["MTH 4-11b", "MTH 4-11c"],
    "ng-target-second": ["MNU 2-03a"], "ng-target-third": ["MNU 3-03a"],
    "ng-pairs-second": ["MNU 2-07a", "MNU 2-07b", "MNU 2-11b"], "ng-pairs-third": ["MNU 3-04a", "MTH 3-06a", "MNU 3-08a", "MNU 3-07a"],
    "ng-line-second": ["MNU 2-02a", "MNU 2-04a", "MTH 2-07c"], "ng-line-third": ["MNU 3-04a", "MTH 3-06a", "MNU 3-07a"]
  };
  function eo(organiser, level, id) {
    if (EO_FOR_ID[id]) return EO_FOR_ID[id].slice();
    const row = EO_BY_ORGANISER.find(([test]) => test.test(organiser || ""));
    const codes = row ? (row[1 + ["Early", "First", "Second"].indexOf(level)] || []).slice() : [];
    // Dictation is spelling and punctuation together
    return String(id).startsWith("dictate:") ? [...new Set(eo(SPELLING_ORGANISER, level, "").concat(codes))] : codes;
  }

  // The organiser for a spelling list, by its stage (spelling is Tools for writing)
  const SPELLING_ORGANISER = "Literacy · Writing · Tools for writing (spelling)";
  // Each EA stage names its own level (Stage 1 Early, Stages 2 and 3 First); otherwise by its place
  function spellingLevel(stageIndex) {
    const own = ((window.SPELLING_LISTS || [])[stageIndex] || {}).level;
    return own || (stageIndex <= 0 ? "Early" : "First");
  }

  return {
    AREAS,
    // The GCSE maths exam climb's question bank, for the A4 sheets (paper-sheets.js): its stages and topics,
    // n questions from a topic (keep filters them), and the baseline's two one-mark questions a topic
    examBank: { STAGES: EXAM_STAGES, TOPICS: GF_TOPICS, ALL: GX_ALL, topic: gfTopic, stage: gfStage, items: (id, n, keep) => gfItems(gfTopic(id), n, keep), baseline: gfBaseline, check: key => gfCheck(gfStage(key)), online: gfOnline,
      // Scotland's version: the SQA climb (National 4 skills, National 5, Higher), the same shape
      scotland: { STAGES: SQA_STAGES, TOPICS: SQ_N4, ALL: SQ_ALL, topic: sqTopic, stage: sqStage, items: (id, n, keep) => gfItems(sqTopic(id), n, keep), baseline: () => sqCheck(SQA_STAGES[0]), check: key => sqCheck(sqStage(key)), online: gfOnline } },
    demand, // how demanding a question is: activities put their questions easy to hard by this
    // Spellings a child might mix up with this sound (ai → ay, a–e): the assessment's near-misses
    alternatives: token => (MAP_ALTERNATIVES[token] || fallbackOptions(token)).slice(),
    get(id) { return ALL.find(a => a.id === id) || (String(id).startsWith("dictate:") ? dictation(String(id).slice(8)) : null); },
    order() { return ALL.map(a => a.id); },
    all() { return ALL.slice(); },
    dictation,
    eo,
    // Level, organiser and CfE outcomes for anything a pupil can do: an activity id, a dictation, or a spelling list
    tag(id) {
      const a = this.get(id);
      if (a) return { level: a.level, organiser: a.organiser, area: a.area, game: !!a.game, eo: eo(a.organiser, a.level, a.id) };
      const stages = window.SPELLING_LISTS || [];
      const s = stages.findIndex(st => st.lists.some(l => l.id === id));
      if (s >= 0) return { level: spellingLevel(s), organiser: SPELLING_ORGANISER, area: "spelling", eo: eo(SPELLING_ORGANISER, spellingLevel(s), id) };
      // England's statutory words: common exception words and the Year 1 days of the week are First level
      // spelling in CfE terms, the Years 3 to 6 word lists Second level (LIT 1-21a / 2-21a)
      // PopSpell's own first lists (kept apart from the EA journey): the level their group names
      const ea = (window.MORE_LISTS || []).find(st => st.lists.some(l => l.id === id));
      if (ea) return { level: ea.level, organiser: SPELLING_ORGANISER, area: "spelling", eo: eo(SPELLING_ORGANISER, ea.level, id) };
      const extra = (window.ENGLAND_LISTS || []).some(st => st.lists.some(l => l.id === id));
      if (!extra) return null;
      const level = /^(cew|y1)-/.test(id) ? "First" : "Second";
      return { level, organiser: SPELLING_ORGANISER, area: "spelling", eo: eo(SPELLING_ORGANISER, level, id) };
    }
  };
})();
