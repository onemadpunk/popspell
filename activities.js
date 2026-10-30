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
  const others2 = (answer, pool) => shuffle(pool.filter(x => String(x) !== String(answer))).slice(0, 2);
  // Decimals as pupils write them: 2.5, not 2.50; also accepts .5 for 0.5
  const dec = n => String(Math.round(n * 100) / 100);
  const decAccept = n => (n > 0 && n < 1 ? [dec(n).replace(/^0/, "")] : []);

  const numeracyMore = [
    { id: "n-round-10", title: "Rounding to the nearest 10", level: "First", organiser: ROUND, blurb: "Round two-digit numbers to the nearest 10.",
      make: () => distinct(10, () => {
        const n = (rand(9) + 1) * 10 + rand(9) + 1, low = n - (n % 10);
        return typed(`Round ${n} to the nearest 10.`, roundTo(n, 10), { label: `${n} to 10`, skill: "rounding to 10",
          explain: `${n} is between ${low} and ${low + 10}. The ones digit is ${n % 10}, so round ${n % 10 >= 5 ? "up" : "down"} to ${roundTo(n, 10)}.` });
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
    { id: "n-decimals", title: "Decimal fractions", level: "Second", organiser: FDP, blurb: "Tenths and hundredths as decimals.",
      make: () => distinct(10, () => {
        const k = rand(4);
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
    blurb: `Stage ${s.stage} sounds. Read it by yourself, then answer the questions.`,
    passage: s, decodable: true, stage: s.stage, make: storyQuestions(s, false)
  }));

  /* ---------- Sound Hopper: count the beats, then map one grapheme to each sound ---------- */

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
    air: ["are", "ear"], are: ["air", "ear"], ear: ["eer", "air"], eer: ["ear", "ere"]
  };
  const fallbackOptions = token => (/[aeiouy]/.test(token) ? ["a", "e"] : ["s", "t"]);
  const mapOptions = token => shuffle([token, ...(MAP_ALTERNATIVES[token] || fallbackOptions(token))]
    .filter((v, i, a) => a.indexOf(v) === i)).slice(0, 3);
  const trailWords = ids => {
    const lists = (window.PopSpell || {}).LISTS || {};
    return shuffle(ids.flatMap(id => (lists[id] || {}).items || [])
      .filter(it => !it.whole && it.tokens.length >= 2 && it.tokens.length <= 5))
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
      blurb: "Tap the beats you hear. Build each sound into a bridge and help Pip cross the river.",
      make: () => trailWords(["short-a", "short-e", "short-i", "short-o", "short-u"]) },
    { id: "g-hopper-digraphs", title: "Sound Hopper: two-letter sounds", level: "Early", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Count the sounds, then build a bridge with sh, ch, th and more.",
      make: () => trailWords(["sh", "ch", "th"]) },
    { id: "g-hopper-long-a", title: "Sound Hopper: long a", level: "First", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "Hear the beats and choose between ai, ay and a–e to make a bridge.",
      make: () => trailWords(["ai", "ay", "a-e"]) },
    { id: "g-hopper-r", title: "Sound Hopper: r sounds", level: "First", organiser: "Literacy · Writing · Tools for writing (spelling)",
      blurb: "In Scottish mode, hear the vowel then r as two sounds. Try the same words in English mode to compare.",
      make: () => trailWords(["ar", "or", "er-ir-ur"]) }
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

  /* ---------- The catalogue ---------- */

  const AREAS = [
    { id: "games", title: "Games with Pip", colour: "#0F766E", icon: "🎮", activities: trailGames.concat(switchGames, canopyGames) },
    { id: "writing", title: "Writing: sentences and punctuation", colour: "#8B5CF6", icon: "✍️", activities: writing },
    { id: "reading", title: "Reading", colour: "#0EB5F2", icon: "📖", activities: reading },
    { id: "stories", title: "Stories to read by myself", colour: "#F59E0B", icon: "📚", activities: stories },
    { id: "listening", title: "Listening and sounds", colour: "#12C6B7", icon: "👂", activities: listening.concat(passageActivities.filter(a => a.area === "listening")) },
    { id: "numeracy", title: "Numeracy and maths", colour: "#FF4081", icon: "🔢", activities: numeracy.concat(numeracyMore) }
  ];
  AREAS.forEach(area => area.activities.forEach(a => { a.area = area.id; a.colour = area.colour; a.icon = area.icon; }));
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
  AREAS.filter(area => area.id !== "games").forEach(area => area.activities.forEach(a => {
    if (!/^Numeracy/.test(a.organiser || "")) return;
    const make = a.make;
    a.make = (...args) => easyFirst(make(...args));
  }));
  const ALL = AREAS.flatMap(a => a.activities);

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
    "n-decimals": ["MNU 2-02a", "MNU 2-03b"], "n-percent": ["MNU 2-07a", "MNU 2-07b"], "n-equivalent": ["MTH 2-07c", "MNU 2-07b"]
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
  function spellingLevel(stageIndex) { return stageIndex <= 1 ? "Early" : stageIndex <= 4 ? "First" : "Second"; }

  return {
    AREAS,
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
      if (a) return { level: a.level, organiser: a.organiser, area: a.area, eo: eo(a.organiser, a.level, a.id) };
      const stages = window.SPELLING_LISTS || [];
      const s = stages.findIndex(st => st.lists.some(l => l.id === id));
      return s >= 0 ? { level: spellingLevel(s), organiser: SPELLING_ORGANISER, area: "spelling", eo: eo(SPELLING_ORGANISER, spellingLevel(s), id) } : null;
    }
  };
})();
