/* PAPER WORKSHEETS for the ready lessons that are taught with objects, talk or writing rather than
   PopSpell's online work, so every lesson has a sheet to hand a pupil.

   Each sheet belongs to a ready lesson (lessons.js), which gives it its level, subject and strand,
   and its national curriculum statements for England. build(who, h) makes the pupil's page and,
   where there are right answers, a separate page for the adult; both come from one call, so
   anything chosen at random matches. h is the teacher area's sheet kit: sheetHead, brandHead,
   handwritingRow and esc. */
window.PopPaper = (() => {
  "use strict";
  const rand = n => Math.floor(Math.random() * n);
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = arr => arr[rand(arr.length)];

  // Shared pieces
  const answersPage = (h, title, items, note = "", after = "") => `${h.brandHead(`Answers: ${title}`, "For the adult, not the pupil.")}
    ${note ? `<p>${note}</p>` : ""}<ol class="ws-answers">${items.map(a => `<li>${a}</li>`).join("")}</ol>${after}`;
  const blank = (w = 5) => `<span class="ws-blank" style="width:${w}em"></span>`;
  // Plain writing lines (Second level), or four-line ruling (Early and First)
  const lines = n => `<div class="ws-lines">${"<span></span>".repeat(n)}</div>`;
  const ruled = (h, n) => Array.from({ length: n }, () => h.handwritingRow("", ["blank"])).join("");
  const box = (label, inner, cls = "") => `<div class="pp-box ${cls}"><b>${label}</b>${inner}</div>`;
  const tick = labels => labels.map(l => `<span class="pp-tick">☐ ${l}</span>`).join(" ");
  const svg = (w, hgt, body, cls = "pp-pic") => `<svg class="${cls}" viewBox="0 0 ${w} ${hgt}" width="${w}" height="${hgt}" role="img">${body}</svg>`;
  // A squared grid, cells × rows, s pixels a square
  const gridLines = (cols, rows, s, x0 = 0, y0 = 0) => {
    let g = "";
    for (let c = 0; c <= cols; c++) g += `<line x1="${x0 + c * s}" y1="${y0}" x2="${x0 + c * s}" y2="${y0 + rows * s}" class="pp-grid"/>`;
    for (let r = 0; r <= rows; r++) g += `<line x1="${x0}" y1="${y0 + r * s}" x2="${x0 + cols * s}" y2="${y0 + r * s}" class="pp-grid"/>`;
    return g;
  };

  const sheets = {};
  const add = (id, lesson, title, detail, build, opts = {}) => { sheets[id] = Object.assign({ id, lesson, title, detail, build }, opts); };

  /* ===================== Maths ===================== */

  add("paper-estimate", "lesson-early-estimate-then-count", "Guess, then count", "Groups of dots to estimate, then count to check.", (who, h) => {
    const counts = shuffle([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).slice(0, 6);
    const dots = n => {
      const pts = [];
      for (let tries = 0; pts.length < n && tries < 2000; tries++) {
        const p = [16 + rand(168), 16 + rand(98)];
        if (pts.every(q => (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 > 440)) pts.push(p);
      }
      return svg(200, 130, `<rect x="1" y="1" width="198" height="128" rx="12" class="pp-frame"/>${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" class="pp-dot"/>`).join("")}`);
    };
    return {
      pupil: `${h.sheetHead("Guess, then count", who)}
        <p>Look at each box for a moment. Guess how many dots, and write your guess. Then count them carefully, touching each one.</p>
        <div class="pp-grid3">${counts.map((n, i) => `<div class="pp-cell"><p><b>${i + 1}.</b></p>${dots(n)}<p>Guess: ${blank(3)} &nbsp; Count: ${blank(3)}</p></div>`).join("")}</div>
        <p>Was your guess more than, less than, or the same as the count? Tell your adult.</p>`,
      answers: answersPage(h, "Guess, then count", counts.map(n => `${n} dots`), "Any sensible guess is fine: praise guesses that get closer.")
    };
  });

  add("paper-counting-20", "lesson-early-counting-to-20-and-beyond", "Counting to 20 and beyond", "Missing numbers on a track, counting back, and what comes next.", (who, h) => {
    const gaps = new Set(shuffle([...Array(18).keys()].map(i => i + 2)).slice(0, 6));
    const track = Array.from({ length: 20 }, (_, i) => i + 1);
    const back = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11];
    const backGaps = new Set([2, 4, 5, 8]);
    const next = shuffle([3, 6, 9, 11, 14, 17, 19, 21, 24]).slice(0, 5);
    const cell = (n, hide) => `<span class="pp-num${hide ? " pp-gap" : ""}">${hide ? "" : n}</span>`;
    return {
      pupil: `${h.sheetHead("Counting to 20 and beyond", who)}
        <p><b>1.</b> Fill in the missing numbers.</p><div class="pp-track">${track.map(n => cell(n, gaps.has(n))).join("")}</div>
        <p><b>2.</b> Count back. Fill in the missing numbers.</p><div class="pp-track">${back.map((n, i) => cell(n, backGaps.has(i))).join("")}</div>
        <p><b>3.</b> What comes next?</p><div class="pp-next">${next.map(n => `<span>${n}, ${n + 1}, ${blank(2.5)}</span>`).join("")}</div>
        <p><b>4.</b> One more and one less.</p>
        <div class="pp-next">${[7, 12, 18, 20].map(n => `<span>${blank(2)} &lt; <b>${n}</b> &lt; ${blank(2)}</span>`).join("")}</div>
        <p class="hint">One less goes on the left and one more on the right.</p>`,
      answers: answersPage(h, "Counting to 20 and beyond", [
        `Missing numbers: ${[...gaps].sort((a, b) => a - b).join(", ")}`,
        `Counting back: ${back.filter((_, i) => backGaps.has(i)).join(", ")}`,
        `What comes next: ${next.map(n => n + 2).join(", ")}`,
        `One less and one more: 6 and 8; 11 and 13; 17 and 19; 19 and 21`])
    };
  });

  add("paper-sharing-halves", "lesson-early-sharing-equally-and-halves", "Sharing and halves", "Share things equally between plates, and colour half of each shape.", (who, h) => {
    const shares = shuffle([[6, 2], [8, 2], [9, 3], [10, 2], [12, 3], [8, 4]]).slice(0, 3);
    const plates = n => svg(300, 90, Array.from({ length: n }, (_, i) => `<ellipse cx="${50 + i * (200 / Math.max(1, n - 1))}" cy="45" rx="42" ry="30" class="pp-frame"/>`).join(""));
    const things = n => svg(30 * n + 10, 30, Array.from({ length: n }, (_, i) => `<circle cx="${18 + i * 30}" cy="15" r="11" class="pp-dot pp-apple"/>`).join(""));
    const halves = [
      ["equal", `<circle cx="50" cy="50" r="40" class="pp-frame"/><line x1="50" y1="10" x2="50" y2="90" class="pp-cut"/>`],
      ["equal", `<rect x="10" y="20" width="80" height="60" class="pp-frame"/><line x1="10" y1="50" x2="90" y2="50" class="pp-cut"/>`],
      ["not", `<rect x="15" y="15" width="70" height="70" class="pp-frame"/><line x1="35" y1="15" x2="35" y2="85" class="pp-cut"/>`],
      ["equal", `<rect x="15" y="15" width="70" height="70" class="pp-frame"/><line x1="15" y1="15" x2="85" y2="85" class="pp-cut"/>`]];
    return {
      pupil: `${h.sheetHead("Sharing and halves", who)}
        ${shares.map(([n, p], i) => `<div class="pp-q"><p><b>${i + 1}.</b> Share these ${n} apples equally between ${p} plates. Draw them on the plates.</p>
          ${things(n)}${plates(p)}<p>Each plate has ${blank(3)} apples.</p></div>`).join("")}
        <p><b>${shares.length + 1}.</b> Has each shape been cut into two equal halves? Colour half of the ones that have. Write yes or no.</p>
        <div class="pp-row4">${halves.map(([, d]) => `<div>${svg(100, 100, d)}<p>${blank(3)}</p></div>`).join("")}</div>`,
      answers: answersPage(h, "Sharing and halves", shares.map(([n, p]) => `${n} shared between ${p}: ${n / p} each`)
        .concat([`Halves: yes, yes, no (the two parts aren't the same size), yes`]))
    };
  });

  add("paper-measure-compare", "lesson-early-longer-heavier-and-holds-more", "Longer, taller, heavier, holds more", "Compare pairs of pictures: longer, taller, heavier, holds more.", (who, h) => {
    const pairs = shuffle([
      ["Circle the longer ribbon.", lo => svg(320, 70, `<text x="4" y="24" class="pp-lab">A</text><rect x="24" y="10" width="${lo ? 270 : 160}" height="16" rx="8" class="pp-ribbon"/>
        <text x="4" y="58" class="pp-lab">B</text><rect x="24" y="44" width="${lo ? 160 : 270}" height="16" rx="8" class="pp-ribbon"/>`), "longer"],
      ["Circle the taller tower.", lo => { const t = (x, n, l) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${130 - (i + 1) * 20}" width="30" height="20" class="pp-cube"/>`).join("") + `<text x="${x + 10}" y="148" class="pp-lab">${l}</text>`;
        return svg(200, 150, t(40, lo ? 6 : 3, "A") + t(130, lo ? 3 : 6, "B")); }, "taller"],
      ["Circle the heavier box. (The heavy side goes down.)", lo => svg(240, 120, `<polygon points="120,110 105,80 135,80" class="pp-frame"/>
        <line x1="40" y1="${lo ? 92 : 68}" x2="200" y2="${lo ? 68 : 92}" class="pp-beam"/>
        <rect x="45" y="${(lo ? 92 : 68) - 30}" width="30" height="30" class="pp-cube"/><text x="53" y="${(lo ? 92 : 68) - 8}" class="pp-lab">A</text>
        <rect x="165" y="${(lo ? 68 : 92) - 30}" width="30" height="30" class="pp-cube"/><text x="173" y="${(lo ? 68 : 92) - 8}" class="pp-lab">B</text>`), "heavier"],
      ["Circle the jug with more water.", lo => { const jug = (x, level, l) => `<rect x="${x}" y="20" width="60" height="90" rx="6" class="pp-frame"/>
        <rect x="${x + 2}" y="${108 - level}" width="56" height="${level}" class="pp-water"/><text x="${x + 24}" y="128" class="pp-lab">${l}</text>`;
        return svg(220, 132, jug(30, lo ? 70 : 30, "A") + jug(130, lo ? 30 : 70, "B")); }, "more water"],
      ["Circle the shorter pencil.", lo => svg(320, 70, `<text x="4" y="24" class="pp-lab">A</text><rect x="24" y="12" width="${lo ? 120 : 250}" height="14" class="pp-pencil"/>
        <text x="4" y="58" class="pp-lab">B</text><rect x="24" y="46" width="${lo ? 250 : 120}" height="14" class="pp-pencil"/>`), "shorter"]]).slice(0, 5)
      // draw(true) makes A the one asked for (the longer, taller, heavier, fuller or shorter)
      .map(([q, draw, word]) => { const first = Math.random() < 0.5; return { q, pic: draw(first), word, answer: first ? "A" : "B" }; });
    return {
      pupil: `${h.sheetHead("Longer, taller, heavier, holds more", who)}<p>Look carefully at each pair. Circle the right one.</p>
        <div class="pp-cols">${pairs.map((p, i) => `<div class="pp-q"><p><b>${i + 1}.</b> ${p.q}</p>${p.pic}</div>`).join("")}
        <div class="pp-q"><p><b>${pairs.length + 1}.</b> Draw something shorter than your pencil, and something heavier than a feather.</p><div class="pp-draw"></div></div></div>`,
      answers: answersPage(h, "Longer, taller, heavier, holds more", pairs.map(p => `${p.answer} is ${p.word}`).concat(["Any sensible drawings"]))
    };
  });

  add("paper-position", "lesson-early-position-direction-and-symmetry", "Where is it?", "Position words with a row of shapes, drawing to instructions, and completing a symmetrical picture.", (who, h) => {
    const shapes = shuffle(["circle", "square", "triangle", "star", "heart"]);
    const draw = (s, x) => ({ circle: `<circle cx="${x}" cy="40" r="26" class="pp-shape"/>`, square: `<rect x="${x - 25}" y="15" width="50" height="50" class="pp-shape"/>`,
      triangle: `<polygon points="${x},12 ${x + 28},66 ${x - 28},66" class="pp-shape"/>`, star: `<polygon points="${[...Array(10)].map((_, k) => { const r = k % 2 ? 12 : 28, a = Math.PI / 5 * k - Math.PI / 2; return `${(x + r * Math.cos(a)).toFixed(1)},${(40 + r * Math.sin(a)).toFixed(1)}`; }).join(" ")}" class="pp-shape"/>`,
      heart: `<path d="M${x},62 C${x - 40},35 ${x - 18},10 ${x},28 C${x + 18},10 ${x + 40},35 ${x},62 Z" class="pp-shape"/>` }[s]);
    const row = svg(420, 80, shapes.map((s, i) => draw(s, 50 + i * 80)).join(""));
    const qs = [
      [`What is first in the row?`, shapes[0]], [`What is last?`, shapes[4]],
      [`What is next to the ${shapes[1]}, on its right?`, shapes[2]], [`What is between the ${shapes[2]} and the ${shapes[4]}?`, shapes[3]],
      [`What is on the left of the ${shapes[3]}?`, shapes[2]]];
    // Half a house on a grid, to finish on the other side of the mirror line
    const s = 22, half = [[3, 2], [3, 3], [3, 4], [3, 5], [2, 3], [2, 4], [2, 5], [1, 4], [1, 5]];
    const grid = svg(8 * s + 2, 7 * s + 2, gridLines(8, 7, s, 1, 1) + half.map(([c, r]) => `<rect x="${1 + c * s}" y="${1 + r * s}" width="${s}" height="${s}" class="pp-fill"/>`).join("")
      + `<line x1="${1 + 4 * s}" y1="0" x2="${1 + 4 * s}" y2="${7 * s + 2}" class="pp-mirror"/>`);
    return {
      pupil: `${h.sheetHead("Where is it?", who)}<p><b>1.</b> Look at the row of shapes. Answer the questions.</p>${row}
        <div class="pp-cols">${qs.map(([q], i) => `<p>${String.fromCharCode(97 + i)}) ${q} ${blank(5)}</p>`).join("")}</div>
        <p><b>2.</b> Draw a sun <b>above</b> the house, a tree <b>next to</b> it, and a cat <b>in front of</b> it.</p>
        ${svg(300, 130, `<rect x="110" y="60" width="80" height="60" class="pp-frame"/><polygon points="105,60 150,25 195,60" class="pp-frame"/><rect x="140" y="90" width="20" height="30" class="pp-frame"/><line x1="0" y1="120" x2="300" y2="120" class="pp-beam"/>`)}
        <p><b>3.</b> The dotted line is a mirror. Colour squares on the right to finish the picture so both sides match.</p>${grid}`,
      answers: answersPage(h, "Where is it?", qs.map(([q, a]) => `${q} <b>${a}</b>`).concat(["2. Check the sun is above, the tree beside, and the cat in front of the house.",
        "3. The right side is a mirror image: the same squares, the same distance from the line."]))
    };
  });

  add("paper-area-squares", "lesson-first-area-by-counting-squares", "Area by counting squares", "Shapes on squared paper: count the squares to find each area, then draw your own.", (who, h) => {
    // Shapes made of joined squares, grown one square at a time
    const grow = n => { const cells = new Set(["2,2"]); const list = [[2, 2]];
      while (cells.size < n) { const [c, r] = pick(list); const [dc, dr] = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]); const nc = c + dc, nr = r + dr;
        if (nc < 0 || nr < 0 || nc > 5 || nr > 4 || cells.has(`${nc},${nr}`)) continue; cells.add(`${nc},${nr}`); list.push([nc, nr]); }
      return list; };
    const sizes = shuffle([5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 6);
    const s = 20;
    const shape = n => { const cells = grow(n); return svg(6 * s + 2, 5 * s + 2, gridLines(6, 5, s, 1, 1) + cells.map(([c, r]) => `<rect x="${1 + c * s}" y="${1 + r * s}" width="${s}" height="${s}" class="pp-fill"/>`).join("")); };
    return {
      pupil: `${h.sheetHead("Area by counting squares", who)}<p>Each shape is made of squares. Count the squares to find its area.</p>
        <div class="pp-grid3">${sizes.map((n, i) => `<div class="pp-cell"><p><b>${i + 1}.</b></p>${shape(n)}<p>Area: ${blank(3)} squares</p></div>`).join("")}</div>
        <p><b>7.</b> Draw two different shapes that each have an area of 8 squares.</p>${svg(12 * s + 2, 6 * s + 2, gridLines(12, 6, s, 1, 1))}`,
      answers: answersPage(h, "Area by counting squares", sizes.map(n => `${n} squares`).concat(["7. Any two shapes of exactly 8 squares"]))
    };
  });

  add("paper-grid-symmetry", "lesson-first-grid-references-and-symmetry", "Grid references and symmetry", "Find and write grid references, then complete a symmetrical pattern.", (who, h) => {
    const cols = "ABCDEF", s = 34;
    const marks = shuffle(["★", "♥", "●", "▲", "■", "✿"]);
    const cells = shuffle([...Array(36).keys()]).slice(0, 6).map((k, i) => ({ mark: marks[i], col: k % 6, row: Math.floor(k / 6) }));
    const ref = c => `${cols[c.col]}${6 - c.row}`;
    const grid = svg(6 * s + 30, 6 * s + 30, gridLines(6, 6, s, 26, 2)
      + [...cols].map((L, i) => `<text x="${26 + i * s + s / 2 - 5}" y="${6 * s + 22}" class="pp-lab">${L}</text>`).join("")
      + [...Array(6)].map((_, r) => `<text x="8" y="${2 + r * s + s / 2 + 6}" class="pp-lab">${6 - r}</text>`).join("")
      + cells.map(c => `<text x="${26 + c.col * s + 8}" y="${2 + c.row * s + 25}" class="pp-mark">${c.mark}</text>`).join(""));
    const ask = cells.slice(0, 3), find = cells.slice(3);
    const half = shuffle([...Array(24).keys()]).slice(0, 7).map(k => [k % 4, Math.floor(k / 4)]);
    const q = 20;
    const pattern = svg(8 * q + 2, 6 * q + 2, gridLines(8, 6, q, 1, 1) + half.map(([c, r]) => `<rect x="${1 + c * q}" y="${1 + r * q}" width="${q}" height="${q}" class="pp-fill"/>`).join("")
      + `<line x1="${1 + 4 * q}" y1="0" x2="${1 + 4 * q}" y2="${6 * q + 2}" class="pp-mirror"/>`);
    const mirrored = svg(8 * q + 2, 6 * q + 2, gridLines(8, 6, q, 1, 1) + half.flatMap(([c, r]) => [[c, r], [7 - c, r]]).map(([c, r]) => `<rect x="${1 + c * q}" y="${1 + r * q}" width="${q}" height="${q}" class="pp-fill"/>`).join("")
      + `<line x1="${1 + 4 * q}" y1="0" x2="${1 + 4 * q}" y2="${6 * q + 2}" class="pp-mirror"/>`);
    return {
      pupil: `${h.sheetHead("Grid references and symmetry", who)}<p>A grid reference gives the letter across first, then the number up.</p>
        <div class="pp-side">${grid}<div>
          ${ask.map((c, i) => `<p><b>${i + 1}.</b> What is at ${ref(c)}? ${blank(3)}</p>`).join("")}
          ${find.map((c, i) => `<p><b>${i + 4}.</b> What is the grid reference of the ${c.mark}? ${blank(3)}</p>`).join("")}
          <p><b>7.</b> Draw a smiley face at C2.</p></div></div>
        <p><b>8.</b> The dotted line is a mirror line. Shade squares on the right so the pattern is symmetrical.</p>${pattern}`,
      answers: answersPage(h, "Grid references and symmetry", ask.map(c => `${c.mark}`).concat(find.map(c => ref(c)), ["A face in column C, row 2"]),
        "", `<p><b>8.</b> The finished pattern:</p>${mirrored}`)
    };
  });

  add("paper-numbers-life", "lesson-first-numbers-in-life-work-and-history", "Numbers all around us", "A number hunt at home or outside, and Roman numerals on a clock.", (who, h) => {
    const roman = [["I", 1], ["II", 2], ["III", 3], ["IV", 4], ["V", 5], ["VI", 6], ["VII", 7], ["VIII", 8], ["IX", 9], ["X", 10], ["XI", 11], ["XII", 12]];
    const ask = shuffle(roman).slice(0, 6);
    const places = ["On a clock or watch", "On a price label", "On a bus or a road sign", "In a book", "On a front door", "On a phone, TV or oven"];
    return {
      pupil: `${h.sheetHead("Numbers all around us", who)}
        <p><b>1.</b> Number hunt: find a number in each place. Write the number and what it tells you.</p>
        <table class="pp-table"><tr><th>Where I found it</th><th>The number</th><th>What it tells us</th></tr>
          ${places.map(p => `<tr><td>${p}</td><td></td><td></td></tr>`).join("")}<tr><td>My own idea: ${blank(6)}</td><td></td><td></td></tr></table>
        <p><b>2.</b> Some clocks use Roman numerals. Write each one as a number.</p>
        <div class="pp-next">${ask.map(([r]) => `<span><b>${r}</b> = ${blank(2.5)}</span>`).join("")}</div>
        <p><b>3.</b> Why do you think people long ago needed numbers? Talk about it, then write one idea.</p>${ruled(h, 2)}`,
      answers: answersPage(h, "Numbers all around us", ["1. Any numbers found, with a sensible meaning (the time, a price, a bus route, a page, a house number…)"]
        .concat(ask.map(([r, n]) => `${r} = ${n}`), ["3. Any sensible idea: counting animals or food, trading, measuring land, telling the time…"]))
    };
  });

  add("paper-order-operations", "lesson-second-order-of-operations", "Order of operations", "Calculations with brackets and mixed operations, and putting brackets in to make a sum true.", (who, h) => {
    const r = (a, b) => a + rand(b - a + 1);
    const make = [
      () => { const a = r(2, 9), b = r(2, 9), c = r(2, 6); return [`${a} + ${b} × ${c}`, a + b * c]; },
      () => { const a = r(2, 9), b = r(2, 9), c = r(2, 5); return [`(${a} + ${b}) × ${c}`, (a + b) * c]; },
      () => { const a = r(3, 9), b = r(2, 6), c = r(2, 9); return [`${a} × ${b} − ${c}`, a * b - c]; },
      () => { const b = r(5, 12), c = r(2, 4), a = r(2, 6); return [`${a} × (${b} − ${c})`, a * (b - c)]; },
      () => { const c = r(2, 6), q = r(2, 9), a = r(2, 20); return [`${a} + ${q * c} ÷ ${c}`, a + q]; },
      () => { const c = r(2, 5), q = r(2, 8), b = r(1, 9); return [`(${q * c + b} − ${b}) ÷ ${c}`, q]; },
      () => { const a = r(4, 9), b = r(3, 9), c = r(2, 4), d = r(2, 4); return a * b > c * d ? [`${a} × ${b} − ${c} × ${d}`, a * b - c * d] : [`${c} × ${d} + ${a} × ${b}`, c * d + a * b]; },
      () => { const a = r(10, 40), b = r(2, 5), c = r(2, 5); return [`${a} − ${b} × ${c}`, a - b * c]; }];
    const qs = shuffle(make).concat(shuffle(make)).slice(0, 10).map(f => f());
    const brackets = [["3 + 4 × 2 = 14", "(3 + 4) × 2 = 14"], ["20 − 5 × 3 = 45", "(20 − 5) × 3 = 45"], ["6 × 5 − 2 = 18", "6 × (5 − 2) = 18"], ["12 ÷ 2 + 4 = 2", "12 ÷ (2 + 4) = 2"]];
    return {
      pupil: `${h.sheetHead("Order of operations", who)}<p>Remember: brackets first, then × and ÷, then + and −.</p>
        <div class="pp-cols">${qs.map(([e], i) => `<p><b>${i + 1}.</b> ${e} = ${blank(4)}</p>`).join("")}</div>
        <p><b>Put in brackets to make each one true.</b></p>
        <div class="pp-cols">${brackets.map(([e], i) => `<p><b>${qs.length + i + 1}.</b> ${e}</p>`).join("")}</div>
        <p><b>${qs.length + brackets.length + 1}.</b> Write your own calculation where brackets change the answer. Show it with and without brackets.</p>${lines(2)}`,
      answers: answersPage(h, "Order of operations", qs.map(([e, a]) => `${e} = ${a}`).concat(brackets.map(([, a]) => a), ["Any calculation where brackets change the answer"]))
    };
  });

  add("paper-lines-symmetry", "lesson-second-lines-of-symmetry", "Lines of symmetry", "Draw every line of symmetry on each shape and say how many there are.", (who, h) => {
    const poly = (n, r = 42, rot = -Math.PI / 2) => [...Array(n)].map((_, k) => { const a = rot + (2 * Math.PI * k) / n; return `${(55 + r * Math.cos(a)).toFixed(1)},${(55 + r * Math.sin(a)).toFixed(1)}`; }).join(" ");
    const shapes = shuffle([
      ["square", `<rect x="18" y="18" width="74" height="74" class="pp-frame"/>`, 4],
      ["rectangle", `<rect x="8" y="28" width="94" height="54" class="pp-frame"/>`, 2],
      ["equilateral triangle", `<polygon points="${poly(3, 48)}" class="pp-frame"/>`, 3],
      ["regular pentagon", `<polygon points="${poly(5)}" class="pp-frame"/>`, 5],
      ["regular hexagon", `<polygon points="${poly(6)}" class="pp-frame"/>`, 6],
      ["isosceles triangle", `<polygon points="55,10 85,100 25,100" class="pp-frame"/>`, 1],
      ["kite", `<polygon points="55,8 88,45 55,102 22,45" class="pp-frame"/>`, 1],
      ["parallelogram", `<polygon points="30,25 100,25 80,85 10,85" class="pp-frame"/>`, 0]]).slice(0, 6);
    return {
      pupil: `${h.sheetHead("Lines of symmetry", who)}<p>Draw every line of symmetry with a ruler. Then write how many lines each shape has. A shape may have none.</p>
        <div class="pp-grid3">${shapes.map(([name, d], i) => `<div class="pp-cell"><p><b>${i + 1}.</b> ${name}</p>${svg(110, 110, d)}<p>Lines: ${blank(3)}</p></div>`).join("")}</div>
        <p><b>7.</b> Which capital letters have a line of symmetry? Try A, B, F, H, N, T and Z, and write the ones that do.</p>${lines(1)}
        <p><b>8.</b> Draw a shape of your own with exactly two lines of symmetry.</p><div class="pp-draw"></div>`,
      answers: answersPage(h, "Lines of symmetry", shapes.map(([name, , n]) => `${name}: ${n}`).concat(["7. A (1), B (1), H (2), T (1). F, N and Z have none.", "8. For example, a rectangle or an oval"]))
    };
  });

  add("paper-maths-work", "lesson-second-maths-in-inventions-life-and-work", "Maths at work", "How people use maths in their jobs, an invention that needed maths, and an interview.", (who, h) => {
    const jobs = shuffle(["builder", "nurse", "chef", "shopkeeper", "pilot", "farmer", "game designer", "footballer"]).slice(0, 5);
    return {
      pupil: `${h.sheetHead("Maths at work", who)}
        <p><b>1.</b> How might each person use maths at work? Think about measuring, money, time, shapes and data.</p>
        <table class="pp-table"><tr><th>Job</th><th>How they use maths</th></tr>${jobs.map(j => `<tr><td>${j[0].toUpperCase() + j.slice(1)}</td><td></td></tr>`).join("")}<tr><td>A job I'd like: ${blank(6)}</td><td></td></tr></table>
        <p><b>2.</b> Choose an invention (a bridge, a phone, a rocket, a clock…). What maths did its inventors need?</p>${lines(3)}
        <p><b>3.</b> Ask an adult: "How do you use maths in your life or work?" Write their answer.</p>${lines(3)}`
    };
  });

  /* ===================== Literacy ===================== */

  add("paper-my-story", "lesson-early-telling-and-drawing-my-own-story", "My story", "Draw and write a story in three parts: beginning, middle and end.", (who, h) => ({
    pupil: `${h.sheetHead("My story", who)}<p>Draw your story in the boxes. Then write a sentence under each picture. Tell your adult the story first.</p>
      ${["At the beginning…", "In the middle…", "At the end…"].map(t => box(t, `<div class="pp-draw pp-short"></div>${ruled(h, 1)}`)).join("")}`
  }));

  add("paper-recount", "lesson-first-planning-and-writing-a-recount", "Plan a recount", "A planning frame for a recount: who, where and when, then what happened in order.", (who, h) => ({
    pupil: `${h.sheetHead("Plan a recount", who)}<p>Plan a recount of something you did. Then use your plan to write it.</p>
      <div class="pp-cols">${["Who was there?", "Where were you?", "When was it?", "How did you feel?"].map(q => box(q, ruled(h, 1))).join("")}</div>
      ${["First…", "Next…", "Then…", "Finally…"].map(q => box(q, ruled(h, 1))).join("")}
      <p class="pp-bank"><b>Words to help:</b> first, next, then, after that, later, finally, because, so, and, but</p>`
  }));

  add("paper-story-planner", "lesson-first-writing-a-story-with-characters-and-a-setting", "Plan a story", "Plan a character, a setting, a problem and an ending.", (who, h) => ({
    pupil: `${h.sheetHead("Plan a story", who)}
      <div class="pp-cols">
        ${box("My character", `<div class="pp-draw pp-short"></div><p>Name: ${blank(8)}</p><p>Looks like: ${blank(9)}</p><p>Feels: ${blank(10)}</p>`)}
        ${box("The setting", `<div class="pp-draw pp-short"></div><p>Where: ${blank(9)}</p><p>I can see: ${blank(8)}</p><p>I can hear: ${blank(8)}</p>`)}</div>
      ${box("The problem: what goes wrong?", ruled(h, 1))}${box("How is it sorted out?", ruled(h, 1))}${box("How does it end?", ruled(h, 1))}
      <p class="pp-bank"><b>Describing words:</b> tiny, enormous, gloomy, sparkling, brave, nervous, cheeky, frosty, silent, busy</p>`
  }));

  add("paper-fact-opinion", "lesson-second-fact-opinion-and-persuasion", "Fact or opinion?", "Sort statements into facts and opinions, then write persuasive sentences with reasons.", (who, h) => {
    const all = [["Water freezes at 0 °C.", "fact"], ["Football is the best sport.", "opinion"], ["Spiders have eight legs.", "fact"],
      ["Cats make better pets than dogs.", "opinion"], ["There are seven days in a week.", "fact"], ["Winter is the most boring season.", "opinion"],
      ["The Sun is a star.", "fact"], ["Chocolate ice cream tastes nicer than vanilla.", "opinion"], ["A triangle has three sides.", "fact"],
      ["Everyone should learn to swim.", "opinion"], ["Penguins cannot fly.", "fact"], ["Homework is a waste of time.", "opinion"]];
    const items = shuffle(all).slice(0, 10);
    return {
      pupil: `${h.sheetHead("Fact or opinion?", who)}<p>A <b>fact</b> can be checked and proved. An <b>opinion</b> is what someone thinks or feels. Tick one box for each.</p>
        <table class="pp-table"><tr><th>Statement</th><th>Fact</th><th>Opinion</th></tr>${items.map(([t], i) => `<tr><td>${i + 1}. ${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
        <p><b>11.</b> Write a persuasive sentence giving your opinion about school dinners. Give a reason using <b>because</b>.</p>${lines(2)}
        <p><b>12.</b> Now add a fact that supports your opinion.</p>${lines(1)}`,
      answers: answersPage(h, "Fact or opinion?", items.map(([t, k]) => `${t} <b>${k}</b>`).concat(["11–12. Any opinion with a reason, and a fact that supports it"]))
    };
  });

  add("paper-punctuation", "lesson-second-commas-speech-marks-and-apostrophes", "Commas, speech marks and apostrophes", "Rewrite sentences with capital letters, commas, speech marks and apostrophes.", (who, h) => {
    const all = [["we bought apples pears grapes and plums", "We bought apples, pears, grapes and plums."],
      ["lets go to the park said sam", "“Let’s go to the park,” said Sam."], ["the dogs bone was buried in the garden", "The dog’s bone was buried in the garden."],
      ["after lunch we played football", "After lunch, we played football."], ["where is my coat asked mia", "“Where is my coat?” asked Mia."],
      ["the childrens books are on the shelf", "The children’s books are on the shelf."], ["i cant find my shoes", "I can’t find my shoes."],
      ["my brother who is ten loves chess", "My brother, who is ten, loves chess."], ["were going to grans house on saturday", "We’re going to Gran’s house on Saturday."],
      ["mum shouted come inside now", "Mum shouted, “Come inside now!”"], ["the girls coats were wet", "The girls’ coats were wet. (or The girl’s coat was wet.)"],
      ["slowly the fox crept past the hens", "Slowly, the fox crept past the hens."]];
    const items = shuffle(all).slice(0, 8);
    return {
      pupil: `${h.sheetHead("Commas, speech marks and apostrophes", who)}<p>Write each sentence correctly. Add capital letters, full stops, commas, speech marks and apostrophes.</p>
        ${items.map(([s], i) => `<div class="pp-q"><p><b>${i + 1}.</b> ${s}</p>${lines(1)}</div>`).join("")}`,
      answers: answersPage(h, "Commas, speech marks and apostrophes", items.map(([, a]) => a))
    };
  });

  add("paper-inform-persuade", "lesson-second-writing-to-inform-or-persuade", "Plan: inform or persuade", "A planning frame for writing to inform or persuade: audience, points with evidence, and devices to use.", (who, h) => ({
    pupil: `${h.sheetHead("Plan: inform or persuade", who)}
      <div class="pp-cols">${box("My topic", lines(1))}${box("I am writing to: ☐ inform ☐ persuade", `<p>My reader is: ${blank(9)}</p>`)}</div>
      ${box("Opening: catch the reader's attention", lines(2))}
      ${[1, 2, 3].map(n => box(`Point ${n}`, `${lines(1)}<p class="hint">Evidence or example:</p>${lines(1)}`)).join("")}
      ${box("Ending: sum up, or tell the reader what to do", lines(2))}
      <p><b>I will use:</b> ${tick(["a question for the reader", "a fact or number", "strong, emotive words", "“you” to talk to the reader", "firstly, furthermore, however, therefore"])}</p>`
  }));

  add("paper-story-mountain", "lesson-second-writing-a-story-plot-character-and-setting", "Story mountain", "Plan a story on a story mountain: opening, build-up, problem, resolution and ending.", (who, h) => ({
    pupil: `${h.sheetHead("Story mountain", who)}<p>Plan your story up and down the mountain. The problem is at the top.</p>
      ${svg(560, 140, `<polyline points="10,130 140,90 280,32 420,90 550,130" class="pp-mountain"/>
        ${[["1 Opening", 14, 112], ["2 Build-up", 96, 74], ["3 Problem", 244, 22], ["4 Resolution", 408, 72], ["5 Ending", 478, 104]].map(([t, x, y]) => `<text x="${x}" y="${y}" class="pp-lab pp-halo">${t}</text>`).join("")}`, "pp-wide")}
      ${["1. Opening: who, where, when?", "2. Build-up: what starts to happen?", "3. Problem: what goes wrong?", "4. Resolution: how is it sorted out?", "5. Ending: how does it finish?"].map(t => box(t, lines(2))).join("")}
      <div class="pp-cols">${box("Main character: feelings and actions", lines(2))}${box("Setting: sights, sounds, atmosphere", lines(2))}</div>`
  }));

  add("paper-talk", "lesson-second-planning-and-giving-a-short-talk", "Plan a short talk", "Plan a two-minute talk, make cue cards, and check how it went.", (who, h) => ({
    pupil: `${h.sheetHead("Plan a short talk", who)}
      ${box("My topic", lines(1))}${box("Opening: grab the audience (a question, a fact, or a short story)", lines(2))}
      <div class="pp-cols3">${[1, 2, 3].map(n => box(`Point ${n}`, `${lines(2)}<p class="hint">Example:</p>${lines(1)}`)).join("")}</div>
      ${box("Ending: sum up, or ask the audience to think about something", lines(2))}
      <p><b>Cue cards:</b> write a few key words for each part. Cut them out and use them when you speak.</p>
      <div class="pp-cols3">${["Opening", "Points", "Ending"].map(t => `<div class="pp-card"><b>${t}</b></div>`).join("")}</div>
      <p><b>After my talk:</b> ${tick(["I looked at my audience", "I spoke loudly and clearly", "I didn't rush", "I answered a question"])}</p>`
  }));

  add("paper-handwriting-speed", "lesson-england-writing-legibly-fluently-and-at-speed-years-5-and-6", "Writing legibly and at speed", "Copy a passage in best handwriting, time a one-minute speed write, and choose print or joined for the task.", (who, h) => ({
    pupil: `${h.sheetHead("Writing legibly and at speed", who)}
      <p><b>1.</b> Copy this in your best joined handwriting.</p>
      <p class="pp-passage">The night was cold and still. Far below the castle, a light flickered in the forest, and an owl called once across the frozen lake.</p>${lines(3)}
      <p><b>2.</b> One-minute speed write. When your adult says go, copy this sentence as many times as you can, keeping it readable.</p>
      <p class="pp-passage">The quick brown fox jumps over the lazy dog.</p>${lines(4)}
      <p>Words written in one minute: ${blank(3)} &nbsp; Is it still easy to read? ☐ yes ☐ mostly ☐ not yet</p>
      <p><b>3.</b> Some writing is clearer printed. Label these parts of a plant in clear print: <b>flower, leaf, stem, root</b>.</p>
      ${svg(300, 110, `<line x1="150" y1="100" x2="150" y2="35" class="pp-beam"/><circle cx="150" cy="25" r="14" class="pp-frame"/><ellipse cx="128" cy="62" rx="20" ry="8" class="pp-frame"/>
        <path d="M150,100 L135,108 M150,100 L165,108" class="pp-beam"/>${[[20, 25], [20, 62], [230, 70], [230, 104]].map(([x, y]) => `<line x1="${x + 50}" y1="${y}" x2="${x < 150 ? 125 : 155}" y2="${y}" class="pp-cut"/><rect x="${x}" y="${y - 10}" width="50" height="18" class="pp-frame"/>`).join("")}`)}`
  }));

  add("paper-phonics-words", "lesson-england-getting-ready-for-the-phonics-check-year-1", "Read the words", "Real words and alien words to read aloud, with a marking sheet for the adult.", (who, h) => {
    const words = h.phonicsWords ? h.phonicsWords().filter((w, i) => i % 2 === 0) : [];
    const card = w => `<span class="pp-word">${w.alien ? `<i aria-hidden="true">👽</i>` : ""}${h.esc(w.word)}</span>`;
    return {
      pupil: `${h.sheetHead("Read the words", who)}<p>Read each word to your adult. Words with an alien are alien names: sound them out and blend.</p>
        <h2 class="ws-sub">Section 1</h2><div class="pp-words">${words.filter(w => w.section === 1).map(card).join("")}</div>
        <h2 class="ws-sub">Section 2</h2><div class="pp-words">${words.filter(w => w.section === 2).map(card).join("")}</div>`,
      answers: `${h.brandHead("For the adult: Read the words", "Tick each word read correctly. Note any sounds that caused trouble.")}
        <table class="pp-table"><tr><th>Word</th><th>Real or alien</th><th>✓</th><th>Sounds to practise</th></tr>
        ${words.map(w => `<tr><td>${h.esc(w.word)}</td><td>${w.alien ? "alien" : "real"}</td><td class="pp-c">☐</td><td></td></tr>`).join("")}</table>`
    };
  }, { needsAdult: true });

  return { sheets, get: id => sheets[id] || null, forLesson: lessonId => Object.values(sheets).filter(s => s.lesson === lessonId) };
})();
