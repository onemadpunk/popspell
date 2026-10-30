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
  const lookForPage = (h, title, items, note = "") => `${h.brandHead(`What to look for: ${title}`, "For the adult, not the pupil.")}
    ${note ? `<p>${note}</p>` : ""}<ul class="ws-answers">${items.map(a => `<li>${a}</li>`).join("")}</ul>`;
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
        <div class="pp-grid3">${counts.map((n, i) => `<div class="pp-cell"><p><b>${i + 1}.</b></p>${dots(n)}<p>Guess: ${blank(3)}</p><p>Count: ${blank(3)}</p></div>`).join("")}</div>
        <p><b>7.</b> Choose one box. How did you know how many, or how did you count them? Tell your adult, or draw it here.</p><div class="pp-draw pp-short"></div>`,
      answers: answersPage(h, "Guess, then count", counts.map(n => `${n} dots`).concat(["Listen for how they knew: seeing a pattern without counting (subitising), counting in twos or groups, or touching each dot once. Note if they count a dot twice or miss one."]),
        "Any sensible guess is fine: praise guesses that get closer.")
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
      answers: answersPage(h, "Counting to 20 and beyond", ["Mark each part separately: counting on, counting back, and one more or less are different skills.",
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
        <p><b>${shares.length + 1}.</b> Has each shape been cut into two equal halves? Colour half of the ones that have. Write yes or no. Tell your adult why.</p>
        <div class="pp-row4">${halves.map(([, d]) => `<div>${svg(100, 100, d)}<p>${blank(3)}</p></div>`).join("")}</div>`,
      answers: answersPage(h, "Sharing and halves", shares.map(([n, p]) => `${n} shared between ${p}: ${n / p} each`)
        .concat([`Halves: yes, yes, no (the two parts aren't the same size), yes. Listen for "both parts are the same size", not just "it's cut in two".`]))
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
      answers: answersPage(h, "Longer, taller, heavier, holds more", pairs.map(p => `${p.answer} is ${p.word}`).concat(["Any sensible drawings"]),
        "", "<p>Pictures are a quick check. For stronger evidence, compare real objects: two pencils side by side, two toys in the hands or on scales, two cups filled with water.</p>")
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
        "3. The right side is a mirror image: the same squares, the same distance from the line."]), "",
        "<p>Follow up: ask the pupil to give you directions to find something in the room (behind, next to, under), and note any position words they mix up.</p>")
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
        <p><b>7.</b> Draw two different shapes that each have an area of 8 squares.</p>${svg(12 * s + 2, 6 * s + 2, gridLines(12, 6, s, 1, 1))}
        <p><b>8.</b> Can two different shapes have the same area? How do you know?</p>${ruled(h, 1)}`,
      answers: answersPage(h, "Area by counting squares", sizes.map(n => `${n} squares`).concat(["7. Any two shapes of exactly 8 squares", "8. Yes: area is how many squares, not the shape, so different shapes can cover the same number of squares."]),
        "Watch for counting the edges (the perimeter) instead of the squares inside.")
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
        "Note the kind of mistake: number before letter (order), or the right letter but the wrong row (misreading an axis).", `<p><b>8.</b> The finished pattern:</p>${mirrored}`)
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
        <p><b>${qs.length + brackets.length + 1}.</b> Cinema tickets cost £6 each. Mia buys 3 tickets and a £4 box of popcorn. Write one calculation for the total, then work it out.</p>${lines(1)}
        <p><b>${qs.length + brackets.length + 2}.</b> Ben says 2 + 3 × 4 = 20. Amy says it's 14. Who is right? Explain why the order matters.</p>${lines(2)}`,
      answers: answersPage(h, "Order of operations", qs.map(([e, a]) => `${e} = ${a}`).concat(brackets.map(([, a]) => a),
        ["3 × 6 + 4 = £22 (or 6 × 3 + 4)", "Amy is right: multiply before adding, so 3 × 4 = 12, then 2 + 12 = 14. Ben worked from left to right."]),
        "Watch for working left to right every time. Ask: which part do we do first, and why?")
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
      ["parallelogram", `<polygon points="30,25 100,25 80,85 10,85" class="pp-frame"/>`, 0]]).slice(0, 5)
      // One shape turned on its corner, so lines of symmetry aren't only ever up and down or across
      .concat([["square, turned", `<polygon points="55,8 102,55 55,102 8,55" class="pp-frame"/>`, 4]]);
    return {
      pupil: `${h.sheetHead("Lines of symmetry", who)}<p>Draw every line of symmetry with a ruler. Then write how many lines each shape has. A shape may have none.</p>
        <div class="pp-grid3">${shapes.map(([name, d], i) => `<div class="pp-cell"><p><b>${i + 1}.</b> ${name}</p>${svg(110, 110, d)}<p>Lines: ${blank(3)}</p></div>`).join("")}</div>
        <p><b>7.</b> Which of these capital letters have a line of symmetry, as they're printed here? <span class="pp-letters">A B F H N T Z</span></p>${lines(1)}
        <p><b>8.</b> Draw a shape of your own with exactly two lines of symmetry.</p><div class="pp-draw"></div>`,
      answers: answersPage(h, "Lines of symmetry", shapes.map(([name, , n]) => `${name}: ${n}`).concat(["7. A (1), B (1), H (2), T (1). F, N and Z have none. In some handwriting styles letters differ, so accept a reasoned answer.", "8. For example, a rectangle or an oval"]))
    };
  });

  add("paper-maths-work", "lesson-second-maths-in-inventions-life-and-work", "Maths at work", "How people use maths in their jobs, an invention that needed maths, and an interview.", (who, h) => {
    const jobs = shuffle(["builder", "nurse", "chef", "shopkeeper", "pilot", "farmer", "game designer", "footballer"]).slice(0, 5);
    return {
      pupil: `${h.sheetHead("Maths at work", who)}
        <p><b>1.</b> How might each person use maths at work? Think about measuring, money, time, shapes and data.</p>
        <table class="pp-table"><tr><th>Job</th><th>How they use maths</th></tr>${jobs.map(j => `<tr><td>${j[0].toUpperCase() + j.slice(1)}</td><td></td></tr>`).join("")}<tr><td>A job I'd like: ${blank(6)}</td><td></td></tr></table>
        <p><b>2.</b> Choose an invention (a bridge, a phone, a rocket, a clock…). What maths did its inventors need?</p>${lines(3)}
        <p><b>3.</b> Ask an adult: "How do you use maths in your life or work?" Write their answer.</p>${lines(3)}`,
      answers: lookForPage(h, "Maths at work", ["The maths itself, named: measuring, money, time, shape, data or calculating", "A real example for each job, not just \"they count things\"",
        "For the invention: a specific bit of maths (measuring lengths, angles, timing, scale)", "The interview: what the adult said, in the pupil's own words"],
        "Assess the mathematical explanation, not how much they know about the job.")
    };
  });

  /* ===================== Literacy ===================== */

  add("paper-my-story", "lesson-early-telling-and-drawing-my-own-story", "My story", "Draw and write a story in three parts: beginning, middle and end.", (who, h) => ({
    pupil: `${h.sheetHead("My story", who)}<p>Draw your story in the boxes. Then write a sentence under each picture. Tell your adult the story first.</p>
      ${["At the beginning…", "In the middle…", "At the end…"].map(t => box(t, `<div class="pp-draw pp-short"></div>${ruled(h, 1)}`)).join("")}`,
    answers: lookForPage(h, "My story", ["Telling the story aloud first, in order, before drawing and writing", "A clear beginning, middle and end that follow on from each other",
      "Story words such as once upon a time, then, suddenly, in the end", "Sentences that can be read back (sounding out is fine)"],
      "The telling matters as much as the page: jot down what the pupil says as they tell the story.")
  }));

  add("paper-recount", "lesson-first-planning-and-writing-a-recount", "Plan a recount", "A planning frame for a recount: who, where and when, then what happened in order.", (who, h) => ({
    pupil: `${h.sheetHead("Plan a recount", who)}<p>Plan a recount of something you did. Then use your plan to write it.</p>
      <div class="pp-cols">${["Who was there?", "Where were you?", "When was it?", "How did you feel?"].map(q => box(q, ruled(h, 1))).join("")}</div>
      ${["First…", "Next…", "Then…", "Finally…"].map(q => box(q, ruled(h, 1))).join("")}
      <p class="pp-bank"><b>Words to help:</b> first, next, then, after that, later, finally, because, so, and, but</p>`,
    answers: lookForPage(h, "Plan a recount", ["Events in the order they happened, not just a list", "Who, where and when answered, so a reader could picture it",
      "Relevant detail and a feeling, not every small thing", "Time words (first, next, then, finally) joining the events"],
      "Judge the order and the detail, not how many boxes are filled.")
  }));

  add("paper-story-planner", "lesson-first-writing-a-story-with-characters-and-a-setting", "Plan a story", "Plan a character, a setting, a problem and an ending.", (who, h) => ({
    pupil: `${h.sheetHead("Plan a story", who)}
      <div class="pp-cols">
        ${box("My character", `<div class="pp-draw pp-short"></div><p>Name: ${blank(8)}</p><p>Looks like: ${blank(9)}</p><p>Feels: ${blank(10)}</p>`)}
        ${box("The setting", `<div class="pp-draw pp-short"></div><p>Where: ${blank(9)}</p><p>I can see: ${blank(8)}</p><p>I can hear: ${blank(8)}</p>`)}</div>
      ${box("The problem: what goes wrong?", ruled(h, 1))}${box("How is it sorted out?", ruled(h, 1))}${box("How does it end?", ruled(h, 1))}
      <p class="pp-bank"><b>Describing words:</b> tiny, enormous, gloomy, sparkling, brave, nervous, cheeky, frosty, silent, busy</p>
      <p class="hint">You can draw or tell your plan too.</p>`,
    answers: lookForPage(h, "Plan a story", ["A character with a name, a look and a feeling", "A setting described with what you can see or hear",
      "A problem that matters to the character, and an ending that sorts it out", "How the parts connect: does the setting or the character cause the problem?"],
      "A drawn or spoken plan counts as much as a written one.")
  }));

  add("paper-fact-opinion", "lesson-second-fact-opinion-and-persuasion", "Fact or opinion?", "Sort statements into facts and opinions, then write persuasive sentences with reasons.", (who, h) => {
    const all = [["Water freezes at 0 °C.", "fact"], ["Football is the best sport.", "opinion"], ["Spiders have eight legs.", "fact"],
      ["Cats make better pets than dogs.", "opinion"], ["There are seven days in a week.", "fact"], ["Winter is the most boring season.", "opinion"],
      ["The Sun is a star.", "fact"], ["Chocolate ice cream tastes nicer than vanilla.", "opinion"], ["A triangle has three sides.", "fact"],
      ["Everyone should learn to swim.", "opinion"], ["Penguins cannot fly.", "fact"], ["Homework is a waste of time.", "opinion"]];
    const items = shuffle(all).slice(0, 8);
    return {
      pupil: `${h.sheetHead("Fact or opinion?", who)}<p>A <b>fact</b> can be checked and proved. An <b>opinion</b> is what someone thinks or feels. Tick one box for each.</p>
        <table class="pp-table"><tr><th>Statement</th><th>Fact</th><th>Opinion</th></tr>${items.map(([t], i) => `<tr><td>${i + 1}. ${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
        <p><b>9.</b> Read this advert.</p>
        <p class="pp-advert"><b>CRUNCHO cereal!</b> The tastiest breakfast in the world! 9 out of 10 children love it. Every bowl has added vitamins. Buy CRUNCHO today!</p>
        <p>a) What does the advert want you to do? ${blank(10)}</p>
        <p>b) Write one opinion from the advert. ${blank(10)}</p>
        <p>c) "9 out of 10 children love it." How could you check if this is true? Who might have asked the children?</p>${lines(1)}
        <p>d) Would you trust this advert? Why or why not?</p>${lines(1)}
        <p><b>10.</b> Give your opinion about school dinners, with a reason using <b>because</b>, and a fact that supports it.</p>${lines(2)}`,
      answers: answersPage(h, "Fact or opinion?", items.map(([t, k]) => `${t} <b>${k}</b>`).concat([
        "9a. Buy CRUNCHO cereal.", "9b. The tastiest breakfast in the world (it can't be proved).",
        "9c. Ask how many children were asked, and who asked them: the cereal company might only have asked a few, or children who already liked it.",
        "9d. Any reasoned answer: the advert is trying to sell, so it chooses what to tell you.", "10. Any opinion with a reason, and a fact that supports it"]))
    };
  });

  add("paper-punctuation", "lesson-second-commas-speech-marks-and-apostrophes", "Commas, speech marks and apostrophes", "Rewrite sentences with capital letters, commas, speech marks and apostrophes.", (who, h) => {
    const all = [["we bought apples pears grapes and plums", "We bought apples, pears, grapes and plums."],
      ["lets go to the park said sam", "“Let’s go to the park,” said Sam."], ["the dogs bone was buried in the garden", "The dog’s bone was buried in the garden."],
      ["after lunch we played football", "After lunch, we played football."], ["where is my coat asked mia", "“Where is my coat?” asked Mia."],
      ["the childrens books are on the shelf", "The children’s books are on the shelf."], ["i cant find my shoes", "I can’t find my shoes."],
      ["my brother who is ten loves chess", "My brother, who is ten, loves chess."], ["were going to grans house on saturday", "We’re going to Gran’s house on Saturday."],
      ["mum shouted come inside now", "Mum shouted, “Come inside now!”"], ["the two girls coats were wet", "The two girls’ coats were wet."],
      ["slowly the fox crept past the hens", "Slowly, the fox crept past the hens."]];
    const items = shuffle(all).slice(0, 7);
    return {
      pupil: `${h.sheetHead("Commas, speech marks and apostrophes", who)}<p>Write each sentence correctly. Add capital letters, full stops, commas, speech marks and apostrophes.</p>
        ${items.map(([s], i) => `<div class="pp-q"><p><b>${i + 1}.</b> ${s}</p>${lines(2)}</div>`).join("")}`,
      answers: answersPage(h, "Commas, speech marks and apostrophes", items.map(([, a]) => a))
    };
  });

  add("paper-inform-persuade", "lesson-second-writing-to-inform-or-persuade", "Plan: inform or persuade", "A planning frame for writing to inform or persuade: audience, points with evidence, and devices to use.", (who, h) => ({
    pupil: `${h.sheetHead("Plan: inform or persuade", who)}
      <div class="pp-cols">${box("My topic", lines(1))}${box("I am writing to: ☐ inform ☐ persuade", `<p>My reader is: ${blank(9)}</p>`)}</div>
      ${box("Opening: catch the reader's attention", lines(2))}
      ${[1, 2, 3].map(n => box(`Point ${n}`, `${lines(1)}<p class="hint">Evidence or example:</p>${lines(1)}`)).join("")}
      ${box("Ending: sum up, or tell the reader what to do", lines(2))}
      <p><b>I will use:</b> ${tick(["a question for the reader", "a fact or number", "strong, emotive words", "“you” to talk to the reader", "firstly, furthermore, however, therefore"])}</p>`,
    answers: lookForPage(h, "Plan: inform or persuade", ["A clear purpose (inform or persuade) and a named reader", "Each point backed by evidence or an example that really supports it",
      "Language chosen for that reader and purpose", "An opening that hooks and an ending that sums up or asks the reader to act"],
      "Check the finished writing too: does the evidence support each point, or just repeat it?")
  }));

  add("paper-story-mountain", "lesson-second-writing-a-story-plot-character-and-setting", "Story mountain", "Plan a story on a story mountain: opening, build-up, problem, resolution and ending.", (who, h) => ({
    pupil: `${h.sheetHead("Story mountain", who)}<p>Plan your story up and down the mountain. The problem is at the top.</p>
      ${svg(560, 140, `<polyline points="10,130 140,90 280,32 420,90 550,130" class="pp-mountain"/>
        ${[["1 Opening", 14, 112], ["2 Build-up", 96, 74], ["3 Problem", 244, 22], ["4 Resolution", 408, 72], ["5 Ending", 478, 104]].map(([t, x, y]) => `<text x="${x}" y="${y}" class="pp-lab pp-halo">${t}</text>`).join("")}`, "pp-wide")}
      ${["1. Opening: who, where, when?", "2. Build-up: what starts to happen?", "3. Problem: what goes wrong?", "4. Resolution: how is it sorted out?", "5. Ending: how does it finish?"].map(t => box(t, lines(2))).join("")}
      <div class="pp-cols">${box("Main character: feelings and actions", lines(2))}${box("Setting: sights, sounds, atmosphere", lines(2))}</div>
      ${box("How does the problem change your character by the end?", lines(1))}`,
    answers: lookForPage(h, "Story mountain", ["Each stage leads to the next: the build-up sets up the problem", "A problem with real tension, and a resolution that follows from what has happened",
      "A character who changes or learns something because of the problem", "A setting that adds atmosphere, not just a place name"])
  }));

  add("paper-talk", "lesson-second-planning-and-giving-a-short-talk", "Plan a short talk", "Plan a two-minute talk, make cue cards, and check how it went.", (who, h) => ({
    pupil: `${h.sheetHead("Plan a short talk", who)}
      ${box("My topic", lines(1))}${box("Opening: grab the audience (a question, a fact, or a short story)", lines(2))}
      <div class="pp-cols3">${[1, 2, 3].map(n => box(`Point ${n}`, `${lines(2)}<p class="hint">Example:</p>${lines(1)}`)).join("")}</div>
      ${box("Ending: sum up, or ask the audience to think about something", lines(2))}
      <p><b>Cue cards:</b> write a few key words for each part. Cut them out and use them when you speak.</p>
      <div class="pp-cols3">${["Opening", "Points", "Ending"].map(t => `<div class="pp-card"><b>${t}</b></div>`).join("")}</div>
      <p><b>After my talk:</b> ${tick(["I looked at my audience", "I spoke loudly and clearly", "I didn't rush", "I answered a question"])}</p>`,
    answers: `${h.brandHead("What to look for: Plan a short talk", "For the adult, while you listen.")}
      <table class="pp-table"><tr><th>While they speak</th><th>Not yet</th><th>Some of the time</th><th>Yes</th></tr>
        ${["Clear opening that catches the listener", "Three points, each with an example", "Looks at the audience", "Loud and clear enough", "A steady pace, with pauses",
          "Words chosen for this audience", "A clear ending", "Answers a question thoughtfully"].map(t => `<tr><td>${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
      <p>As a listener, ask one question and note how they respond.</p>`
  }));

  add("paper-handwriting-speed", "lesson-england-writing-legibly-fluently-and-at-speed-years-5-and-6", "Writing legibly and at speed", "Copy a passage in best handwriting, time a one-minute speed write, and choose print or joined for the task.", (who, h) => ({
    pupil: `${h.sheetHead("Writing legibly and at speed", who)}
      <p><b>1.</b> Copy this in your best joined handwriting.</p>
      <p class="pp-passage">The night was cold and still. Far below the castle, a light flickered in the forest, and an owl called once across the frozen lake.</p>${lines(3)}
      <p><b>2.</b> One-minute speed write. When your adult says go, copy this sentence as many times as you can, keeping it readable.</p>
      <p class="pp-passage">The quick brown fox jumps over the lazy dog.</p>${lines(4)}
      <p>Words written in one minute: ${blank(3)}</p>
      <p>Is it still easy to read? ☐ yes ☐ mostly ☐ not yet &nbsp; (Speed and how easy it is to read are judged separately.)</p>
      <p><b>3.</b> Some writing is clearer printed. Label these parts of a plant in clear print: <b>flower, leaf, stem, root</b>.</p>
      ${svg(300, 110, `<line x1="150" y1="100" x2="150" y2="35" class="pp-beam"/><circle cx="150" cy="25" r="14" class="pp-frame"/><ellipse cx="128" cy="62" rx="20" ry="8" class="pp-frame"/>
        <path d="M150,100 L135,108 M150,100 L165,108" class="pp-beam"/>${[[20, 25], [20, 62], [230, 70], [230, 104]].map(([x, y]) => `<line x1="${x + 50}" y1="${y}" x2="${x < 150 ? 125 : 155}" y2="${y}" class="pp-cut"/><rect x="${x}" y="${y - 10}" width="50" height="18" class="pp-frame"/>`).join("")}`)}`,
    answers: lookForPage(h, "Writing legibly and at speed", [
      "1. Joins used consistently, letters the right size and evenly spaced, and a clear finish to each word",
      "2. Speed: count the words, and compare with their last go rather than with other pupils",
      "2. Legibility, judged separately: could someone else read every word? Note any letters that break down at speed (often a, d, e, o, r and t)",
      "3. Clear, unjoined print for the labels, because labels need to be read at a glance"],
      "Time exactly one minute. If speed rises but legibility falls, slow down and practise the letters that broke down, then time again another day.")
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

  /* ===================== Literacy: choice, listening and talking, finding information ===================== */

  const faces = `<span class="pp-tick">☐ 😀 I liked it</span> <span class="pp-tick">☐ 😐 It was OK</span> <span class="pp-tick">☐ 🙁 I didn't like it</span>`;

  add("paper-favourite-story", "lesson-early-choosing-and-sharing-stories-i-like", "My favourite story", "Draw a favourite part of a story, say how it felt and why the book was chosen.", (who, h) => ({
    pupil: `${h.sheetHead("My favourite story", who)}<p>Your adult can write your words for you.</p>
      ${box("My story is called", ruled(h, 1))}
      ${box("I chose it because of the… (tick)", tick(["cover", "title", "pictures", "author", "someone told me about it"]))}
      ${box("Draw your favourite part", `<div class="pp-draw"></div>`)}
      ${box("How did the story make you feel?", faces)}
      ${box("Tell your adult why. Then act out a part with toys or puppets.", ruled(h, 1))}`,
    answers: lookForPage(h, "My favourite story", ["A reason for choosing that's about the book: its cover, title, pictures or author",
      "Likes and dislikes shared, with a reason (\"I didn't like it when the wolf…\")", "Retelling or acting out a part in their own way, in order",
      "Talking about the characters and events, not just naming them"], "Most of this is talk: note what the pupil says as they explain and act it out.")
  }));

  add("paper-my-news", "lesson-early-sharing-my-news-and-new-words", "My news", "Draw your news in order, then tell it using a new word.", (who, h) => ({
    pupil: `${h.sheetHead("My news", who)}<p>Draw what happened, in order. Then tell your news to your adult.</p>
      <div class="pp-cols3">${["First…", "Then…", "At the end…"].map(t => box(t, `<div class="pp-draw"></div>`)).join("")}</div>
      ${box("How did I feel?", tick(["happy", "excited", "proud", "worried", "sad", "surprised"]))}
      ${box("My new word", `${ruled(h, 1)}<p class="hint">Use it when you tell your news.</p>`)}
      ${box("Let's pretend: I am in a shop. I tell the shopkeeper what I want and why.", tick(["I spoke clearly", "I said please and thank you", "I used my new word"]))}`,
    answers: lookForPage(h, "My news", ["Events told in the right order (first, then, at the end)", "Feelings and ideas shared, not just what happened",
      "Talking clearly enough to be understood", "The new word used in a way that fits", "In the pretend shop: explaining what they want so the listener understands"],
      "Jot down a phrase or two the pupil says: it's the best evidence of their talk.")
  }));

  add("paper-find-it", "lesson-early-finding-information-in-signs-and-books", "Find it!", "Read a poster and a menu with an adult, find information and use it to choose.", (who, h) => ({
    pupil: `${h.sheetHead("Find it!", who)}<p>Read the poster and the menu with your adult.</p>
      <div class="pp-cols">${box("Poster", `<p class="pp-advert"><b>PET SHOW</b><br>Saturday<br>10 o'clock<br>In the park<br>Bring your pet! 🐶 🐱 🐰</p>`)}
        ${box("Café menu", `<p class="pp-advert">🥪 Sandwich 3p<br>🍎 Apple 1p<br>🍪 Biscuit 2p<br>🥛 Milk 2p</p>`)}</div>
      <p><b>1.</b> What day is the pet show? ${blank(6)}</p>
      <p><b>2.</b> Where is it? ${blank(6)}</p>
      <p><b>3.</b> What pet would you take? Draw it.</p><div class="pp-draw pp-short"></div>
      <p><b>4.</b> You have 3p. Choose what to buy from the menu. Draw or write it.</p><div class="pp-draw pp-short"></div>
      <p><b>5.</b> Is this a story or information? Circle one: &nbsp; <b>story</b> &nbsp; <b>information</b></p>`,
    answers: answersPage(h, "Find it!", ["Saturday", "In the park", "Any pet, and a reason if they give one", "Anything that costs 3p or less in total, for example a sandwich, or an apple and a biscuit",
      "Information: it tells you facts, not a story"], "Read the poster and menu aloud with the pupil if needed: the skill here is finding and using the information.")
  }));

  add("paper-my-choices", "lesson-first-choosing-texts-and-explaining-why", "My choices", "A log of texts chosen for enjoyment or information, with reasons, then a plan for a text of your own.", (who, h) => ({
    pupil: `${h.sheetHead("My choices", who)}
      <table class="pp-table"><tr><th>What I read, watched or listened to</th><th>Who made it</th><th>For fun or to find out?</th><th>Why I liked it, or didn't</th></tr>
        ${[1, 2, 3].map(() => "<tr><td></td><td></td><td></td><td></td></tr>").join("")}</table>
      ${box("My favourite author or series, and why", lines(2))}
      ${box("I chose a book by looking at its… (tick)", tick(["cover", "title", "author", "illustrator", "blurb on the back"]))}
      <h2 class="ws-sub">Now plan a text of your own choice</h2>
      <div class="pp-cols">${box("It's about…", lines(1))}${box("It's for… (who will read it?)", lines(1))}</div>
      ${box("It will be a…", tick(["story", "comic", "poster", "letter", "fact file", "something else"]))}
      ${box("I chose that because…", lines(2))}`,
    answers: lookForPage(h, "My choices", ["Choosing for different reasons: for fun and to find something out", "Reasons about the text itself, such as the author's style, the topic or the pictures",
      "Using the cover, title, author or blurb to choose", "For their own text: a subject, a reader and a format that suit each other, with a reason"])
  }));

  add("paper-talking-together", "lesson-first-listening-and-talking-in-a-group", "Talking together", "Prepare a short talk about an object, then check how the talk and the listening went.", (who, h) => ({
    pupil: `${h.sheetHead("Talking together", who)}
      ${box("My object or picture is", lines(1))}
      ${box("Three things I will say about it", lines(3))}
      ${box("A question I could ask my listener", lines(1))}
      <h2 class="ws-sub">When I talk</h2><p>${tick(["I spoke clearly and loudly enough", "I looked at my listener", "I used my voice and face to make it interesting", "I showed my object or picture"])}</p>
      <h2 class="ws-sub">When I listen</h2><p>${tick(["I waited for my turn", "I looked at the speaker", "I nodded or agreed", "I asked a question that fitted"])}</p>
      ${box("Next time I will…", lines(1))}`,
    answers: `${h.brandHead("What to look for: Talking together", "For the adult, while you listen and talk.")}
      <table class="pp-table"><tr><th></th><th>Not yet</th><th>Some of the time</th><th>Yes</th></tr>
        ${["Takes turns and talks at the right time", "Listens and responds respectfully (nods, agrees, asks, answers)", "Speaks clearly and audibly", "Uses eye contact, expression and body language",
          "Shares ideas in a sensible order, with useful words", "Uses the object or picture to help the listener"].map(t => `<tr><td>${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
      <p>Ask one question after the talk, and note how the pupil answers.</p>`
  }));

  const HEDGEHOGS = "Hedgehogs are small, spiny animals that live in gardens, parks and woods. They come out at night to find food. They eat beetles, worms, slugs and caterpillars. In winter, when there's less food, hedgehogs hibernate in a nest of leaves. You can help them by leaving a gap under your fence so they can travel between gardens.";
  add("paper-notes-listening", "lesson-first-notes-from-listening-then-using-them", "Notes from listening", "Make notes under headings while an adult reads a short talk, then use them to write.", (who, h) => ({
    pupil: `${h.sheetHead("Notes from listening", who)}<p>Your adult will read a short talk twice. The first time, just listen. The second time, write <b>key words</b> under each heading.</p>
      <p><b>The talk is about:</b> ${blank(12)}</p>
      <div class="pp-cols">${["Where they live", "What they eat", "What they do in winter", "How we can help"].map(t => box(t, lines(2))).join("")}</div>
      ${box("Now use your notes: write three sentences, in order, for someone who didn't hear the talk.", ruled(h, 3))}`,
    answers: `${h.brandHead("For the adult: Notes from listening", "Read this aloud twice: once to listen, once for notes.")}
      <p class="pp-passage">${HEDGEHOGS}</p>
      <ul class="ws-answers"><li><b>About:</b> hedgehogs</li><li><b>Where:</b> gardens, parks, woods</li><li><b>Eat:</b> beetles, worms, slugs, caterpillars</li>
        <li><b>Winter:</b> hibernate in a nest of leaves</li><li><b>Help:</b> a gap under the fence</li></ul>
      <p>Look for key words, not whole sentences, and three sentences that follow a sensible order and make sense to a new reader.</p>`
  }), { needsAdult: true });

  add("paper-fact-opinion-first", "lesson-first-fact-and-opinion-in-what-i-read", "Fact or opinion? Penguins", "Read a short text, sort facts from opinions, and write one of each.", (who, h) => {
    const items = [["Penguins are birds.", "fact"], ["Penguins cannot fly.", "fact"], ["Penguins are the cutest animals in the world.", "opinion"],
      ["Penguins use their wings to swim.", "fact"], ["Watching penguins is the best thing to do at the zoo.", "opinion"], ["I think penguins look funny when they walk.", "opinion"]];
    return {
      pupil: `${h.sheetHead("Fact or opinion? Penguins", who)}<p>Read the text.</p>
        <p class="pp-passage">${items.map(i => i[0]).join(" ")}</p>
        <p>A <b>fact</b> can be checked. An <b>opinion</b> is what someone thinks. Tick one for each sentence.</p>
        <table class="pp-table"><tr><th>Sentence</th><th>Fact</th><th>Opinion</th></tr>${items.map(([t]) => `<tr><td>${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
        <p><b>Circle</b> the words in the text that show an opinion.</p>
        <p><b>Write a fact</b> about an animal you know:</p>${ruled(h, 1)}
        <p><b>Write your opinion</b> about the same animal:</p>${ruled(h, 1)}`,
      answers: answersPage(h, "Fact or opinion? Penguins", items.map(([t, k]) => `${t} <b>${k}</b>`).concat(["Opinion words: cutest, best, I think, funny",
        "Any fact that could be checked in a book, and any opinion"]), "Ask how they know: a fact can be checked; an opinion is what someone thinks.")
    };
  });

  add("paper-inform-persuade-first", "lesson-first-writing-to-share-information-or-an-opinion", "Inform or persuade", "Facts in one box, an opinion and reasons in another, then a short poster.", (who, h) => ({
    pupil: `${h.sheetHead("Inform or persuade", who)}
      ${box("My topic (a pet, a game, a place…)", ruled(h, 1))}
      ${box("Inform: three facts about it", ruled(h, 3))}
      ${box("My opinion, and a reason (I think… because…)", ruled(h, 1))}
      ${box("Persuade: make your poster. Use \"You should…\" and a reason.", `<div class="pp-draw"></div>`)}`,
    answers: lookForPage(h, "Inform or persuade", ["Facts chosen and organised clearly, not a mixed list of facts and opinions", "Words suited to the job: plain and clear to inform, strong and personal to persuade",
      "An opinion with a reason, using because", "At least one attempt to persuade the reader (you should…, don't miss…)"])
  }));

  add("paper-recommend-it", "lesson-second-choosing-texts-and-authors-and-writing-my-own-choice", "Recommend it", "A review with evidence, a note on sources, and a plan for a text of your own with its audience and form.", (who, h) => ({
    pupil: `${h.sheetHead("Recommend it", who)}
      <div class="pp-cols">${box("Title and author", lines(1))}${box("I read, watched or listened to it for…", tick(["enjoyment", "information"]))}</div>
      ${box("What the author does well, with an example from the text", lines(3))}
      ${box("Who would enjoy it, and why?", lines(2))}
      ${box("For information, I'd use this source because… (is it up to date? who made it?)", lines(2))}
      <h2 class="ws-sub">Plan a text of your own</h2>
      <div class="pp-cols">${box("Purpose (to entertain, inform, persuade, explain)", lines(1))}${box("Audience", lines(1))}</div>
      ${box("Form and style (a review, blog, comic, instructions…), and why it suits the audience", lines(2))}`,
    answers: lookForPage(h, "Recommend it", ["Preferences explained with supporting detail: an example of what the author does", "A reader who'd enjoy it, with a reason",
      "Thinking about how useful and reliable a source is", "A genre, form, structure and style that suit the purpose and audience, with a reason"])
  }));

  add("paper-discussion", "lesson-second-group-discussion-building-on-others-ideas", "Discussion: building on ideas", "Plan points for a discussion, use the starters, and note the techniques a speaker uses.", (who, h) => ({
    pupil: `${h.sheetHead("Discussion: building on ideas", who)}
      ${box("The question we're discussing", lines(1))}
      <div class="pp-cols">${box("My view and two reasons", lines(3))}${box("A view someone else might have", lines(3))}</div>
      ${box("Starters to use (tick each one you use)", tick(["I agree with… because…", "Building on what you said…", "Can you explain what you mean by…?", "I see it differently because…", "So what we're saying is…"]))}
      ${box("Something someone else said that changed or added to my thinking", lines(2))}
      ${box("Listening to a speaker: techniques they used to influence me", tick(["emphasis on key words", "changing pace", "tone of voice", "a rhetorical question", "strong vocabulary"]))}`,
    answers: `${h.brandHead("What to look for: Discussion", "For the adult, while you discuss.")}
      <table class="pp-table"><tr><th></th><th>Not yet</th><th>Some of the time</th><th>Yes</th></tr>
        ${["Contributes relevant ideas, information and opinions", "Shows respect for others' views and offers their own", "Builds on others' contributions (asks, clarifies, supports)",
          "Uses vocabulary, eye contact, body language, emphasis, pace and tone", "Spots techniques used to engage or influence a listener"].map(t => `<tr><td>${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
      <p>The strongest evidence is a pupil changing or adding to their view because of what someone else said.</p>`
  }));

  const PLASTIC = "Every year, millions of tonnes of plastic end up in the sea. Some comes from rubbish dropped on beaches, and some is washed down rivers from towns. Sea animals can mistake plastic bags for jellyfish and eat them. Tiny pieces, called microplastics, have been found in fish that people eat. Scientists say that using less single-use plastic, such as straws and bags, and recycling more, would help. Some towns now hold beach clean-ups every month. This information comes from a radio programme about the ocean.";
  add("paper-notes-own-words", "lesson-second-notes-from-listening-in-my-own-words", "Notes in my own words", "Notes in your own words under your own headings while an adult reads, then a paragraph with its source.", (who, h) => ({
    pupil: `${h.sheetHead("Notes in my own words", who)}<p>Your adult will read a short talk twice. First listen for the <b>purpose</b> and <b>main ideas</b>. Then make notes in <b>your own words</b> under headings you choose.</p>
      <p><b>Purpose of the talk:</b> ${blank(16)}</p>
      <div class="pp-cols">${[1, 2, 3, 4].map(n => box(`Heading ${n}: ${blank(8)}`, lines(2))).join("")}</div>
      ${box("Use your notes: write a short paragraph explaining this to a younger pupil.", lines(4))}
      <p><b>Source:</b> where did this information come from? ${blank(14)}</p>`,
    answers: `${h.brandHead("For the adult: Notes in my own words", "Read this aloud twice: once to listen, once for notes.")}
      <p class="pp-passage">${PLASTIC}</p>
      <ul class="ws-answers"><li><b>Purpose:</b> to inform listeners about plastic in the sea and how to help</li>
        <li><b>Main ideas:</b> where the plastic comes from; how it harms sea animals; microplastics in fish; what helps (less single-use plastic, recycling, clean-ups)</li>
        <li><b>Source:</b> a radio programme about the ocean</li></ul>
      <p>Look for notes in the pupil's own words (not copied phrases), sensible headings, a paragraph that suits a younger reader, and the source credited.</p>`
  }), { needsAdult: true });

  const ADVERT = "Are you tired of boring breakfasts? Try new Sunny Crunch! Sunny Crunch is made with oats and dried fruit, and each bowl has 5 grams of fibre. It's the tastiest cereal you'll ever eat! Kids everywhere love it. Ask for Sunny Crunch at your local shop today: you won't be disappointed!";
  add("paper-what-i-heard", "lesson-second-questions-fact-and-opinion-in-what-i-hear", "What I heard", "Questions on a radio advert read aloud: literal, inferential and evaluative, fact and opinion, and how it tries to influence.", (who, h) => ({
    pupil: `${h.sheetHead("What I heard", who)}<p>Your adult will read a radio advert aloud. Listen carefully. You can hear it twice.</p>
      <p><b>1. Literal</b> (it says so): What is the cereal made with?</p>${lines(1)}
      <p><b>2. Inferential</b> (clues tell you): Who do you think the advert is aimed at? How can you tell?</p>${lines(1)}
      <p><b>3. Evaluative</b> (what do you think?): Would this advert make you want to buy Sunny Crunch? Why?</p>${lines(2)}
      <p><b>4.</b> Write one <b>fact</b> and one <b>opinion</b> from the advert.</p>${lines(2)}
      <p><b>5.</b> How does the advert try to influence you? ${tick(["a question to start", "strong words like tastiest", "saying everyone loves it", "telling you what to do"])}</p>
      <p><b>6.</b> How useful is the advert if you want to know whether the cereal is healthy? Why?</p>${lines(2)}
      <p><b>7.</b> Write your own questions about the advert: one literal, one inferential and one evaluative.</p>${lines(3)}`,
    answers: `${h.brandHead("For the adult: What I heard", "Read this aloud, like a radio advert. Read it again if asked.")}
      <p class="pp-passage">${ADVERT}</p>
      <ol class="ws-answers"><li>Oats and dried fruit</li><li>Children and families: \"kids everywhere\", \"boring breakfasts\", a fun name</li><li>Any answer with a reason</li>
        <li>Fact: made with oats and dried fruit, or 5 grams of fibre. Opinion: the tastiest cereal, kids everywhere love it, you won't be disappointed</li>
        <li>All four: a question, strong words, saying everyone loves it, telling you to buy it</li>
        <li>Not very useful on its own: it's trying to sell, so it chooses what to tell you. Check the label or another source.</li>
        <li>Three questions of the right kinds</li></ol>`
  }), { needsAdult: true });

  const HAMSTER = "Hamsters are small animals that make good pets. They sleep in the day and are busy at night, so their cage should be somewhere quiet. A hamster needs a big cage with deep bedding to dig in, a wheel to run on and a place to hide. Give your hamster fresh water every day and a small amount of hamster food. They also like small pieces of carrot or apple. Never give a hamster chocolate or sweets. Clean the cage once a week, and handle your hamster gently, close to the floor, in case it jumps.";
  add("paper-layout-page", "lesson-second-layout-and-presentation-to-engage-a-reader", "Design a page", "Turn a plain text into a leaflet page for a younger reader: headings, bullet points, pictures and captions, then explain the choices.", (who, h) => ({
    pupil: `${h.sheetHead("Design a page", who)}<p>This information is all in one block, so it's hard to read. Your reader is a child aged 7 who is getting a hamster.</p>
      <p class="pp-passage">${HAMSTER}</p>
      <p><b>1.</b> Underline the most important ideas. Which ones belong together? Group them, for example <i>home</i>, <i>food</i>, <i>care</i>.</p>
      <p><b>2.</b> Design the page in the box. Sketch where everything goes and write the words for your headings and bullet points.</p>
      <div class="pp-draw" style="height:78mm"></div>
      <p><b>I used:</b> ${tick(["a heading", "sub-headings", "bullet points", "a picture", "a caption", "a font or colour to make something stand out"])}</p>
      <p><b>3.</b> Choose one thing you used. Why does it help your reader?</p>${lines(2)}`,
    answers: lookForPage(h, "Design a page", [
      "The main ideas picked out and grouped (home, food, care and handling), not every sentence copied",
      "Features chosen for a purpose: a heading that says what the page is about, sub-headings for each group, bullet points for lists such as foods",
      "Pictures with captions that add information, not just decoration",
      "Something important made to stand out, such as never giving chocolate or sweets",
      "A reason for a choice that is about the 7-year-old reader: finding things quickly, seeing what matters most, wanting to read on"],
      "A version made on a computer or tablet counts just as much. Ask which choice helps the reader most, and whether there's a better way to show one idea.")
  }));

  /* ===================== England: sheets for the rest of the national curriculum (October 2026) ===================== */
  // The texts and poems on these sheets are written for PopSpell.

  const dotGrid = (cols, rows, s = 22) => svg(cols * s + 10, rows * s + 10, Array.from({ length: (cols + 1) * (rows + 1) }, (_, i) =>
    `<circle cx="${5 + (i % (cols + 1)) * s}" cy="${5 + Math.floor(i / (cols + 1)) * s}" r="1.8" fill="#8a9ab4"/>`).join(""), "pp-wide");

  add("paper-draw-shapes", "lesson-england-lines-and-shapes-parallel-perpendicular-and-quadrilaterals-years-3-and-4", "Draw and make shapes", "Draw shapes on a dotty grid, mark parallel sides and right angles, and make 3D shapes and draw them from different sides.", (who, h) => ({
    pupil: `${h.sheetHead("Draw and make shapes", who)}
      <p><b>1.</b> Use a ruler to draw a <b>square</b>, a <b>rectangle</b>, a <b>trapezium</b> and a <b>right-angled triangle</b> on the grid. Label each one.</p>${dotGrid(30, 9)}
      <p><b>2.</b> On your shapes, mark each <b>right angle</b> with a small square, and each pair of <b>parallel</b> sides with matching arrows.</p>
      <p><b>3.</b> Make a cube and a square-based pyramid from straws, cubes or modelling clay. Draw each one from the side and from the top.</p>
      <div class="pp-cols">${box("Cube", `<div class="pp-draw pp-short"></div>`)}${box("Square-based pyramid", `<div class="pp-draw pp-short"></div>`)}</div>
      <p><b>4.</b> Turn your cube onto another face. Is it still a cube? How do you know?</p>${ruled(h, 1)}`,
    answers: lookForPage(h, "Draw and make shapes", ["Straight sides drawn with a ruler, joining dots, and each shape correctly named",
      "Right angles marked on the square, rectangle and right-angled triangle; parallel sides marked on the square, rectangle and trapezium (the trapezium has one pair)",
      "3D shapes made with the right number of faces, edges and corners; drawings that show the square top of the cube and the triangle side of the pyramid",
      "4: Yes. Turning a shape doesn't change its faces, edges or corners."])
  }));

  add("paper-draw-accurately", "lesson-england-angles-rectangles-and-accurate-drawing-years-5-and-6", "Draw it accurately", "Draw rectangles, triangles and angles to exact lengths and angles with a ruler and protractor, and use angle facts.", (who, h) => ({
    pupil: `${h.sheetHead("Draw it accurately", who)}<p>You need a sharp pencil, a ruler and a protractor.</p>
      <p><b>1.</b> Draw a rectangle 7 cm long and 4 cm wide. Measure the diagonal: ${blank(4)} cm</p><div class="pp-draw"></div>
      <p><b>2.</b> Draw a line 6 cm long. At one end draw an angle of 50°, and at the other end an angle of 60°. Join the lines to make a triangle. Measure the third angle: ${blank(3)}°</p><div class="pp-draw"></div>
      <p><b>3.</b> Without measuring: what should the third angle be? Why?</p>${lines(1)}
      <p><b>4.</b> Draw a straight line and an angle of 135° on it. What is the angle on the other side of the line? ${blank(3)}° How do you know?</p>${lines(1)}`,
    answers: answersPage(h, "Draw it accurately", ["Diagonal about 8.1 cm (within 2 mm is fine)", "Third angle 70° (within 2°)", "180° − 50° − 60° = 70°, because the angles in a triangle add to 180°", "45°, because angles on a straight line add to 180°"],
      "Check the drawing as well as the answer: lengths within 2 mm and angles within 2°. Watch for reading the wrong scale on the protractor (130° instead of 50°).")
  }));

  add("paper-cut-draw-digits", "lesson-england-getting-ready-to-write-cutting-drawing-and-forming-digits-reception-and-year-1", "Cut, draw and write numbers", "Cut along straight, zigzag and curved lines, trace pictures carefully, then form the digits 0 to 9.", (who, h) => {
    const cut = (d, label) => `<p>${label}</p>${svg(640, 50, `<path d="${d}" fill="none" stroke="#333" stroke-width="2.5" stroke-dasharray="8 6"/><text x="0" y="34" font-size="26">✂</text>`, "pp-wide")}`;
    return {
      pupil: `${h.sheetHead("Cut, draw and write numbers", who)}
        <p><b>1.</b> Cut along each dotted line. Turn the paper, not the scissors.</p>
        ${cut("M40,25 L630,25", "A straight line")}${cut("M40,40 L100,10 L160,40 L220,10 L280,40 L340,10 L400,40 L460,10 L520,40 L580,10 L630,40", "A zigzag")}
        ${cut("M40,25 C120,-5 200,55 280,25 S440,-5 520,25 S600,45 630,25", "A wavy line")}
        <p><b>2.</b> Trace over the dotted lines slowly and carefully.</p>
        ${svg(640, 110, `<circle cx="70" cy="55" r="40" fill="none" stroke="#8a9ab4" stroke-width="3" stroke-dasharray="3 6"/>
          <path d="M180,95 L180,50 L230,15 L280,50 L280,95 Z M215,95 L215,68 L245,68 L245,95" fill="none" stroke="#8a9ab4" stroke-width="3" stroke-dasharray="3 6"/>
          <path d="M360,90 Q400,10 440,90 Q480,10 520,90 Q560,10 600,90" fill="none" stroke="#8a9ab4" stroke-width="3" stroke-dasharray="3 6"/>`, "pp-wide")}
        <p><b>3.</b> Write each number. Start at the dot your adult shows you.</p>
        ${[[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]].map(([a, b]) => h.handwritingRow(`${a} ${a}  ${b} ${b}`, ["model", "grey", "dots", "blank"])).join("")}`,
      answers: lookForPage(h, "Cut, draw and write numbers", ["Holds scissors with thumb on top, and turns the paper, not the scissors, to follow the line",
        "Cuts close to the line on the straight and zigzag lines; the curve is harder, so look for steady progress",
        "Traces slowly, staying on the line, with a comfortable pencil grip",
        "Digits started in the right place and formed the right way: watch for 2, 5, 6, 9 and 3 written backwards, which is common at this age"],
        "This sheet is about control and care, not speed. Little and often works best for cutting and drawing.")
    };
  });

  add("paper-longer-words", "lesson-england-reading-longer-words-and-checking-it-makes-sense-years-1-and-2", "Longer words", "Read two-syllable words part by part, then spot and fix the word that doesn't make sense.", (who, h) => {
    const words = [["rab", "bit"], ["gar", "den"], ["sand", "wich"], ["pic", "nic"], ["chick", "en"], ["rock", "et"], ["sun", "set"], ["pump", "kin"], ["car", "pet"], ["thun", "der"]];
    const sentences = [["I put my socks on my hands.", "feet"], ["The fish swam in the tree.", "pond (or sea, river)"], ["We ate our soup with a fork.", "spoon"], ["The sun came up at night.", "morning"], ["She rode her bike to the moon.", "park (or shop, school)"]];
    return {
      pupil: `${h.sheetHead("Longer words", who)}
        <p><b>1.</b> Read each part, then put the parts together and read the whole word. Tick it when you can read it.</p>
        <div class="pp-cols">${words.map(([a, b]) => `<p class="pp-syll"><span>${a}</span> + <span>${b}</span> = <b>${a}${b}</b> ☐</p>`).join("")}</div>
        <p><b>2.</b> One word in each sentence doesn't make sense. Read the sentence, circle the wrong word and write a better word.</p>
        ${sentences.map(([s], i) => `<p><b>${String.fromCharCode(97 + i)}.</b> ${s} &nbsp; ${blank(6)}</p>`).join("")}
        <p><b>3.</b> When something doesn't make sense as you read, what can you do?</p>${ruled(h, 1)}`,
      answers: answersPage(h, "Longer words", sentences.map(([s, a], i) => `${String.fromCharCode(97 + i)}. ${s} → ${a}`).concat(["3. Stop, go back and reread; check the sounds in the word; ask: does that make sense?"]),
        "In part 1, listen for blending each part with the sounds they know, not guessing from the first letters. Note any part that's hard to read.")
    };
  });

  const GOATS = "Once upon a time, three billy goats lived on a hillside: a little goat, a middle-sized goat and a great big goat. Across the river the grass was green and sweet, but under the bridge lived a grumpy troll. Trip, trap went the little goat over the bridge. \"Who's that trip-trapping over my bridge?\" roared the troll. \"I'm going to gobble you up!\" \"Please don't eat me,\" said the little goat. \"Wait for my brother. He's much bigger.\" So the troll let him go. Next came the middle-sized goat, and the same thing happened. Then the great big goat came over the bridge. \"Who's that trip-trapping over my bridge?\" roared the troll. \"It's me!\" said the great big goat, and he tossed the troll into the river. The three goats ate the sweet green grass, and they lived happily ever after.";
  add("paper-traditional-tale", "lesson-england-traditional-tales-retelling-and-story-language-years-1-and-2", "Three Billy Goats Gruff", "Read a retelling of a traditional tale, order the events, find its story language and retell it.", (who, h) => ({
    pupil: `${h.sheetHead("The Three Billy Goats Gruff", who)}<p class="pp-passage">${GOATS}</p>
      <p><b>1.</b> Number the events 1 to 5 in the order they happen.</p>
      ${shuffle(["The troll lets the little goat go.", "The goats eat the sweet green grass.", "The great big goat tosses the troll into the river.", "The little goat trip-traps over the bridge.", "The middle-sized goat crosses the bridge."]).map(e => `<p>☐ ${e}</p>`).join("")}
      <p><b>2.</b> Copy the line the troll says more than once.</p>${ruled(h, 1)}
      <p><b>3.</b> Tick what makes this a traditional tale: ${tick(["Once upon a time", "things in threes", "a baddie", "talking animals", "a happy ending"])}</p>
      <p><b>4.</b> Why does the troll let the first two goats go?</p>${ruled(h, 1)}
      <p><b>5.</b> Tell the story to your adult. Use <b>first</b>, <b>next</b>, <b>then</b> and <b>in the end</b>.</p>`,
    answers: answersPage(h, "Three Billy Goats Gruff", ["1. Little goat crosses (1), troll lets it go (2), middle-sized goat crosses (3), big goat tosses the troll (4), goats eat the grass (5)",
      "2. \"Who's that trip-trapping over my bridge?\"", "3. All five", "4. Each goat says a bigger brother is coming, so the troll waits for a bigger meal", "5. A retelling in order, with the repeated line and time words"],
      "Ask how the events link: each goat's promise leads to the next goat, and the biggest goat brings the ending.")
  }));

  const COLOSSAL = "The giant was colossal: his head brushed the clouds, and his boots were the size of houses. A timid mouse peeped out from a crack in the wall, too frightened to move. The giant's gleaming sword flashed in the sunlight. When he sneezed, the mouse scurried away as fast as its legs could carry it, and hid. By the evening, the giant was exhausted. He lay down and fell asleep before the sun had even set.";
  add("paper-word-meanings", "lesson-england-words-and-what-they-mean-years-1-to-6", "Word detective", "Work out word meanings from clues in the text, check them in a dictionary, and choose favourite words and phrases.", (who, h) => ({
    pupil: `${h.sheetHead("Word detective", who)}<p class="pp-passage">${COLOSSAL}</p>
      <table class="pp-table"><tr><th>Word</th><th>A clue in the text</th><th>I think it means</th><th>Dictionary says</th></tr>
        ${["colossal", "timid", "gleaming", "scurried", "exhausted"].map(w => `<tr><td><b>${w}</b></td><td></td><td></td><td></td></tr>`).join("")}</table>
      <p><b>2.</b> Which word is like a word you already know? (For example, <i>gleaming</i> is like <i>gleam</i>.)</p>${lines(1)}
      <p><b>3.</b> Copy your favourite word or phrase from the text. Why do you like it?</p>${lines(2)}`,
    answers: answersPage(h, "Word detective", ["colossal: enormous (clue: head brushed the clouds, boots the size of houses)", "timid: shy and easily frightened (clue: too frightened to move)",
      "gleaming: shining brightly (clue: flashed in the sunlight)", "scurried: ran quickly with short steps (clue: as fast as its legs could carry it)", "exhausted: very tired (clue: fell asleep before the sun set)"],
      "Accept any meaning that fits the clue. Look for the pupil using the words around the new word, and checking the dictionary rather than guessing.")
  }));

  const PUDDLES = ["Splish goes the puddle when I jump in,", "splash goes the water right up to my chin.", "Drip go the leaves when the rain comes down,", "drop go the drops on the roofs of the town.", "Swish goes the wind and it rattles the door,", "and I'm out in my wellies to jump in some more!"];
  add("paper-poems-y2", "lesson-england-poems-to-learn-say-and-write-year-2", "Poems", "Learn a short poem by heart and say it with expression, then write a poem with the same pattern.", (who, h) => ({
    pupil: `${h.sheetHead("Poems", who)}<p class="pp-passage">${PUDDLES.join("<br>")}</p>
      <p><b>1.</b> Learn the poem two lines at a time. Tick each pair when you can say it without looking. ☐ ☐ ☐</p>
      <p><b>2.</b> Say the poem to your adult. Which words will you say loudly? Underline them.</p>
      <p><b>3.</b> Write your own poem with the same pattern: two sound words, then what happens.</p>
      <p class="hint">For example: <i>Crunch goes the snow when I…</i></p>${ruled(h, 4)}`,
    answers: lookForPage(h, "Poems", ["Says the poem from memory, in order, with the rhymes landing at the end of each pair of lines",
      "Changes their voice to show meaning: louder for splash and rattles, a bouncy rhythm", "Their own poem keeps the pattern (sound word, sound word, what happens) and tries to rhyme in pairs",
      "Reads their own poem aloud with expression"], "Learning by heart is little and often: two lines a day works well.")
  }));

  const STORM_POEM = ["The fishing boat left at the break of the day,", "with Jen at the wheel and the gulls on the way.", "But the sky turned to slate and the waves grew so high", "that the mast seemed to scrape at the cracks in the sky.", "She held the wheel tight as the harbour came near,", "and the lighthouse blinked once, as if to say: here."];
  const FREE_POEM = ["Fog.", "The street has gone.", "Lamp posts float like matches", "somebody forgot to strike.", "A dog barks", "from nowhere."];
  add("paper-poetry-perform", "lesson-england-poetry-forms-and-performing-poems-years-3-to-6", "Perform a poem", "Compare a narrative poem and a free verse poem, learn one by heart, plan a performance and perform it.", (who, h) => ({
    pupil: `${h.sheetHead("Perform a poem", who)}
      <div class="pp-cols">${box("Poem A", `<p class="pp-passage">${STORM_POEM.join("<br>")}</p>`)}${box("Poem B", `<p class="pp-passage">${FREE_POEM.join("<br>")}</p>`)}</div>
      <p><b>1.</b> Which poem tells a story (a <b>narrative poem</b>)? ${blank(4)} Which is <b>free verse</b>, with no rhyme or regular pattern? ${blank(4)}</p>
      <p><b>2.</b> How can you tell? Give one clue for each.</p>${lines(2)}
      <p><b>3.</b> Choose one poem to learn by heart. Mark it up for performance: <b>/</b> for a pause, <b>↑</b> louder, <b>↓</b> quieter, and a note for any movement.</p>
      <p><b>4.</b> Perform it. Then perform a piece of your own writing. ${tick(["I knew it by heart", "my voice showed the meaning", "I paused in the right places", "I looked at my audience"])}</p>`,
    answers: `${h.brandHead("What to look for: Perform a poem", "For the adult, while you watch.")}
      <ol class="ws-answers"><li>A is narrative; B is free verse</li><li>A has characters and events, and rhyming couplets; B has no rhyme and no regular rhythm, and uses short lines and an image</li></ol>
      <table class="pp-table"><tr><th>While they perform</th><th>Not yet</th><th>Some of the time</th><th>Yes</th></tr>
        ${["Knows it by heart", "Tone suits the poem (tense for A, quiet and strange for B)", "Volume changes for effect", "Pauses where the meaning needs it", "Movement or gesture that helps, not distracts", "Looks at the audience", "Performs their own writing with the same care"].map(t => `<tr><td>${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>`
  }));

  add("paper-talk-about-writing", "lesson-england-talking-about-my-writing-saying-it-reading-it-aloud-and-improving-it-years-1-and-2", "Say it, write it, read it", "Say each sentence before writing it, read the writing aloud, then talk about it with an adult and make one change.", (who, h) => ({
    pupil: `${h.sheetHead("Say it, write it, read it", who)}<p>Write three sentences about something you did.</p>
      ${[1, 2, 3].map(n => `<p><b>${n}.</b> ☐ I said it out loud first.</p>${ruled(h, 1)}`).join("")}
      <p><b>Read it aloud</b> to your adult, clearly, so they can hear every word. ☐</p>
      <div class="pp-cols">${box("⭐ Something good", ruled(h, 1))}${box("➜ Something to change", ruled(h, 1))}</div>
      <p><b>Make your change.</b> Write the new sentence here:</p>${ruled(h, 1)}`,
    answers: lookForPage(h, "Say it, write it, read it", ["Says the whole sentence aloud before writing, and writes the same sentence (not a shorter one)",
      "Rereads to check it makes sense", "Reads aloud clearly enough to be heard, with intonation that shows the meaning",
      "Takes part in talking about it, and makes a real change: a better word, a missing word, a capital letter or full stop"],
      "Keep the talk positive: one star and one wish. The change matters more than the amount written.")
  }));

  const MOON = "Long ago, the Moon was a round, silver plate that the Sky Mother used at her table. Every night she filled it with starlight for her children. But one winter, Raven grew hungry and jealous. Each night he flew up and took one small bite of the silver plate, until only a thin curve was left. The Sky Mother was sad, but she did not shout. Instead, she began to mend the plate, one piece each night, until it was round again. Raven was ashamed, but hunger is a hard thing, and so he took his bites again. And that is why, to this day, the Moon grows thin and then grows round, month after month.";
  add("paper-myth", "lesson-england-myths-legends-and-themes-across-books-years-3-to-6", "Myths and themes", "Read an original myth, retell it, spot the conventions of myths, and compare its theme with another book.", (who, h) => ({
    pupil: `${h.sheetHead("Myths and themes: Why the Moon changes shape", who)}<p class="pp-passage">${MOON}</p>
      <p><b>1.</b> Retell the myth in three sentences.</p>${lines(3)}
      <p><b>2.</b> Tick the conventions of a myth you can find: ${tick(["long ago", "gods or magical beings", "an animal that acts like a person", "it explains something in nature", "a lesson about how to behave"])}</p>
      <p><b>3.</b> What is the <b>theme</b>? ${tick(["greed", "forgiveness", "patience", "jealousy"])} Give evidence from the text.</p>${lines(2)}
      <p><b>4.</b> Name another book or story with the same theme. How is it similar, and how is it different?</p>${lines(3)}`,
    answers: lookForPage(h, "Myths and themes", ["1. Raven bites the Moon until it's thin; the Sky Mother mends it; Raven bites it again, which is why the Moon changes shape",
      "2. All five can be found", "3. More than one theme fits: greed or jealousy (Raven), forgiveness or patience (the Sky Mother). Look for a quotation or detail as evidence",
      "4. A real comparison: a shared theme named, with one similarity and one difference in how the stories show it"],
      "Myths explain the world or show how to behave; legends are about heroes who may once have lived. Ask the pupil which this is, and why.")
  }));

  const LIGHTHOUSE = ["Old Morag had kept the lighthouse for forty years. Every evening she climbed the hundred and twelve steps, lit the great lamp, and watched its beam sweep across the dark water.",
    "One stormy night, the lamp flickered and died. Morag's heart thudded. Somewhere out there, the little ferry would be heading home. She searched the cupboard with trembling hands and found the old brass lantern her father had used.",
    "She carried it to the top window and swung it slowly, back and forth, back and forth, until her arms ached. At dawn, a horn sounded from the harbour. The ferry had come home safe."];
  add("paper-questions-reading", "lesson-england-asking-questions-and-checking-understanding-as-i-read-years-3-to-6", "Questions as I read", "Ask questions before, during and after reading, check understanding and word meanings, and discuss answers.", (who, h) => ({
    pupil: `${h.sheetHead("Questions as I read: The Lighthouse", who)}
      <p><b>Before you read.</b> The title is <i>The Lighthouse</i>. Write a question you hope it will answer.</p>${lines(1)}
      <p class="pp-passage">${LIGHTHOUSE[0]}</p><p><b>During.</b> Write a question you have now.</p>${lines(1)}
      <p class="pp-passage">${LIGHTHOUSE[1]}</p><p>What does <b>thudded</b> tell you about how Morag felt? How do you know?</p>${lines(1)}
      <p class="pp-passage">${LIGHTHOUSE[2]}</p>
      <p><b>After.</b> Was your first question answered? What are you still wondering?</p>${lines(2)}
      <p><b>Talk about it.</b> Take turns with your adult: each share one answer and one thing you're still wondering. ☐</p>`,
    answers: lookForPage(h, "Questions as I read", ["Questions that are genuine and help understanding (why, how, what if), not just checking facts", "Stops to check understanding, and rereads when something doesn't fit",
      "thudded: her heart was beating hard because she was frightened or worried; clue: the light failed and the ferry was out there",
      "Notices what's still unclear (why did the lamp fail? how did the ferry see the lantern?) and discusses it, taking turns and listening"],
      "Ask which question helped most, and why.")
  }));

  const HARBOUR = "The wind howled across the harbour. Boats tugged at their ropes like dogs on leads, and spray burst over the wall in great white fans. Finn pulled his hood tight and ran towards the last boat. \"Grandad!\" he shouted. \"The storm's getting worse!\" Grandad looked up from the tangled net. \"Then we'd better be quick,\" he said, and grinned.";
  add("paper-plan-rehearse", "lesson-england-planning-from-a-model-rehearsing-aloud-and-improving-years-3-and-4", "Learn from a model", "Discuss a model paragraph, plan a version of your own, rehearse it aloud, improve it and read it aloud.", (who, h) => ({
    pupil: `${h.sheetHead("Learn from a model", who)}<p class="pp-passage">${HARBOUR}</p>
      <p><b>1.</b> What did the writer do? ${tick(["a short opening sentence", "a simile (like dogs on leads)", "speech with speech marks", "a new line for a new speaker", "strong verbs (howled, tugged, burst)"])}</p>
      <p><b>2.</b> Plan your own paragraph about a different place in bad weather. Borrow two things from the model.</p>
      <div class="pp-cols">${box("Place and weather", lines(1))}${box("Two characters", lines(1))}${box("A simile", lines(1))}${box("What one of them says", lines(1))}</div>
      <p><b>3.</b> Say each sentence aloud before you write it. ☐ Then write your paragraph.</p>${lines(5)}
      <p><b>4.</b> Improve it: is it clear who <i>he</i> or <i>she</i> is every time? Change a pronoun to a name if it isn't. Then read it aloud to your adult. ☐</p>`,
    answers: lookForPage(h, "Learn from a model", ["1. All five are in the model", "A plan that borrows features from the model on purpose, not copying its words",
      "Sentences rehearsed aloud, then written as said, including dialogue punctuated correctly", "Pronouns clear, with a name used where 'he' or 'she' could mean two people",
      "Read aloud with intonation, so the speech sounds like speech"], "Ask which feature they borrowed and why it works.")
  }));

  const MESSY = "Last saturday, we go to the beach. The sun was shining and the sea sparkles. My brother and me builded a huge sandcastle, then a wave knock it down. We was very dissapointed, but we laughed anyway. By the time we got home, we had ate all the sandwiches and we have forgot the bucket!";
  add("paper-edit-proofread", "lesson-england-editing-and-proofreading-tense-the-perfect-form-and-effect-years-5-and-6", "Edit it", "Edit a paragraph for tense, the perfect form, spelling and punctuation, then judge and improve its effect.", (who, h) => ({
    pupil: `${h.sheetHead("Edit it", who)}<p class="pp-passage">${MESSY}</p>
      <p><b>1. Tense.</b> The paragraph is about the past. Underline every verb in the wrong tense.</p>
      <p><b>2. The perfect form.</b> Find the last sentence. Which verbs should show what <i>had</i> happened before they got home?</p>${lines(1)}
      <p><b>3. Proofread.</b> Circle the spelling, capital letter and grammar mistakes.</p>
      <p><b>4. Rewrite</b> the paragraph correctly.</p>${lines(5)}
      <p><b>5. Effect.</b> Is it interesting to read? Change or add one thing to make it better, and say why.</p>${lines(2)}`,
    answers: answersPage(h, "Edit it", ["Tense: go → went, sparkles → sparkled, builded → built, knock → knocked, was → were",
      "Perfect form: had ate → had eaten, have forgot → had forgotten", "Proofread: saturday → Saturday, me → I (my brother and I), dissapointed → disappointed",
      "Last Saturday, we went to the beach. The sun was shining and the sea sparkled. My brother and I built a huge sandcastle, then a wave knocked it down. We were very disappointed, but we laughed anyway. By the time we got home, we had eaten all the sandwiches and we had forgotten the bucket!",
      "5. Any change with a reason linked to the reader, for example a more precise verb or an expanded noun phrase"],
      "Ask the pupil to edit in passes (tense, then spelling and punctuation, then effect), and then edit a piece of their own writing the same way.")
  }));

  return { sheets, get: id => sheets[id] || null, forLesson: lessonId => Object.values(sheets).filter(s => s.lesson === lessonId) };
})();
