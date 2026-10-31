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

  /* ===== England key stage 4 ===== */

  // Numbered questions (the Third level sections below have their own, qs), and each sheet's lesson
  const q4 = (items, from = 1) => items.map((q, i) => `<div class="pp-q"><p><b>${from + i}.</b> ${q}</p></div>`).join("");
  const KS4 = id => `lesson-england-${id}-years-10-and-11`;
  const HI = " <i>(higher)</i>";
  const read4 = t => `<p class="pp-passage" style="font-size:11pt">${t}</p>`;
  // A column vector
  const cv = (a, b) => `<span style="display:inline-block;vertical-align:middle;text-align:center;line-height:1.1;border-left:1.5px solid #222;border-right:1.5px solid #222;border-radius:7px;padding:0 5px">${a}<br>${b}</span>`;
  // A graph: a squared grid with axes and labels, x from x0 to x1 and y from y0 to y1 (sx and sy pixels a
  // unit, labelled every lx and ly, with grid lines every gx and gy), and draw(X, Y) adds lines and points in graph units
  const plot = (x0, x1, y0, y1, sx, sy, lx, ly, draw = () => "", names = ["x", "y"], gx = lx, gy = ly) => {
    const pad = 26, w = (x1 - x0) * sx + pad * 2, hgt = (y1 - y0) * sy + pad * 2;
    const X = x => +(pad + (x - x0) * sx).toFixed(1), Y = y => +(pad + (y1 - y) * sy).toFixed(1);
    let g = "";
    for (let x = x0; x <= x1; x += gx) g += `<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" class="pp-grid"/>`;
    for (let y = y0; y <= y1; y += gy) g += `<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" class="pp-grid"/>`;
    g += `<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1) + 8}" y2="${Y(0)}" class="pp-axis"/><line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1) - 8}" class="pp-axis"/>`;
    for (let x = x0; x <= x1; x += lx) if (x) g += `<text x="${X(x)}" y="${Y(0) + 14}" text-anchor="middle" class="pp-small">${x}</text>`;
    for (let y = y0; y <= y1; y += ly) if (y) g += `<text x="${X(0) - 4}" y="${Y(y) + 4}" text-anchor="end" class="pp-small">${y}</text>`;
    g += `<text x="${X(x1) + 10}" y="${Y(0) + 4}" class="pp-small">${names[0]}</text><text x="${X(0) + 4}" y="${Y(y1) - 10}" class="pp-small">${names[1]}</text>`;
    return svg(w + 30, hgt, g + draw(X, Y));
  };
  const curve = (X, Y, f, a, b, n = 60) => `<polyline points="${Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n).map(x => `${X(x)},${Y(f(x))}`).join(" ")}" class="pp-shape"/>`;
  const dotAt = (X, Y, x, y) => `<circle cx="${X(x)}" cy="${Y(y)}" r="3.5" class="pp-dot"/>`;
  // A small sketch of a graph shape, for matching
  const mini = (...parts) => {
    const P = (x, y) => `${(50 + x * 14).toFixed(1)},${(50 - y * 14).toFixed(1)}`;
    const line = ([f, a, b]) => `<polyline points="${Array.from({ length: 41 }, (_, i) => a + (b - a) * i / 40).map(x => [x, f(x)])
      .filter(([, y]) => Math.abs(y) <= 3.3).map(([x, y]) => P(x, y)).join(" ")}" class="pp-shape" style="stroke-width:2"/>`;
    return svg(100, 100, `<line x1="4" y1="50" x2="96" y2="50" class="pp-axis"/><line x1="50" y1="4" x2="50" y2="96" class="pp-axis"/>${parts.map(line).join("")}`);
  };
  const numLine = (a = -6, b = 6, s = 24) => svg((b - a) * s + 30, 34, `<line x1="15" y1="12" x2="${(b - a) * s + 15}" y2="12" class="pp-axis"/>${Array.from({ length: b - a + 1 }, (_, i) =>
    `<line x1="${15 + i * s}" y1="7" x2="${15 + i * s}" y2="17" class="pp-axis"/><text x="${15 + i * s}" y="31" text-anchor="middle" class="pp-small">${a + i}</text>`).join("")}`);

  add("paper-ks4-powers", KS4("powers-roots-indices-and-standard-form"), "Powers, roots and standard form", "Zero, negative and fractional indices, the laws of indices, standard form, and estimating roots.", (who, h) => ({
    pupil: `${h.sheetHead("Powers, roots and standard form", who)}
      ${q4([`Work out, without a calculator: &nbsp; 5⁰ = ${blank(2)} &nbsp; 3⁻² = ${blank(2)} &nbsp; 2⁻³ = ${blank(2)} &nbsp; 16<sup>½</sup> = ${blank(2)} &nbsp; 27<sup>⅓</sup> = ${blank(2)} &nbsp; 8<sup>⅔</sup> = ${blank(2)}${HI}`,
        `Simplify: &nbsp; a⁴ × a⁵ = ${blank(3)} &nbsp; b⁹ ÷ b³ = ${blank(3)} &nbsp; (c²)⁴ = ${blank(3)} &nbsp; (2d³)³ = ${blank(3)} &nbsp; 6e⁵ × 3e⁻² = ${blank(3)}`,
        `Write in standard form: &nbsp; 340 000 = ${blank(5)} &nbsp; 0.000 72 = ${blank(5)} &nbsp; 6 020 000 000 = ${blank(5)} &nbsp; 0.05 = ${blank(5)}`,
        `Write as ordinary numbers: &nbsp; 4.1 × 10³ = ${blank(4)} &nbsp; 9 × 10⁻³ = ${blank(4)}`,
        `Work out, giving each answer in standard form: &nbsp; (3 × 10⁴) × (5 × 10⁶) = ${blank(6)} &nbsp; (8 × 10⁹) ÷ (2 × 10³) = ${blank(6)} &nbsp; (6.5 × 10⁵) + (3 × 10⁴) = ${blank(6)}`,
        `Light travels about 3 × 10⁸ metres every second. Sunlight takes about 500 seconds to reach the Earth. Estimate the distance from the Sun to the Earth, in standard form.${lines(1)}`,
        `Without a calculator, estimate √80 and ∛30 to 1 decimal place. Explain how you know.${HI}${lines(2)}`,
        `Sam says 2⁻¹ is a negative number. Explain why Sam is wrong.${lines(1)}`])}`,
    answers: answersPage(h, "Powers, roots and standard form", ["1, ⅑, ⅛, 4, 3, 4 (8<sup>⅔</sup> = (∛8)² = 2² = 4)", "a⁹, b⁶, c⁸, 8d⁹, 18e³",
      "3.4 × 10⁵, 7.2 × 10⁻⁴, 6.02 × 10⁹, 5 × 10⁻²", "4100, 0.009", "1.5 × 10¹¹ (not 15 × 10¹⁰), 4 × 10⁶, 6.8 × 10⁵ (650 000 + 30 000 = 680 000)",
      "3 × 10⁸ × 500 = 1500 × 10⁸ = 1.5 × 10¹¹ m", "√80 ≈ 8.9: 9² = 81, so just under 9. ∛30 ≈ 3.1: 3³ = 27, so just over 3",
      "A negative index means a reciprocal: 2⁻¹ = 1/2, which is positive"], "Watch for answers like 15 × 10¹⁰ that aren't in standard form: the first number must be at least 1 and less than 10.")
  }));

  add("paper-ks4-exact", KS4("exact-calculation-fractions-surds-and-recurring-decimals"), "Exact answers", "Answers in terms of π, fractions, surds, rationalising denominators, and recurring decimals.", (who, h) => ({
    pupil: `${h.sheetHead("Exact answers", who)}
      ${q4([`Give exact answers, in terms of π. &nbsp; The area of a circle with radius 5 cm: ${blank(4)} &nbsp; The circumference of a circle with diameter 7 cm: ${blank(4)} &nbsp; The area of a semicircle with radius 4 cm: ${blank(4)}`,
        `Work out, giving each answer as a fraction in its simplest form: &nbsp; ⅔ + ¾ = ${blank(3)} &nbsp; ⅚ − ¼ = ${blank(3)} &nbsp; 4/9 × 3/8 = ${blank(3)} &nbsp; 2½ ÷ ¾ = ${blank(3)}`,
        `Simplify:${HI} &nbsp; √18 = ${blank(3)} &nbsp; √75 = ${blank(3)} &nbsp; √2 × √8 = ${blank(3)} &nbsp; (√5)² = ${blank(3)} &nbsp; 3√2 + √50 = ${blank(3)}`,
        `Rationalise the denominator:${HI} &nbsp; 10/√5 = ${blank(4)} &nbsp; 3/√6 = ${blank(4)}`,
        `Expand and simplify (2 + √3)(2 − √3).${HI}${lines(1)}`,
        `Write each fraction as a recurring decimal: &nbsp; ⅓ = ${blank(4)} &nbsp; 5/11 = ${blank(4)} &nbsp; 2/7 = ${blank(6)}`,
        `Write each recurring decimal as a fraction in its simplest form. Show your method for one of them.${HI}<br>0.555… = ${blank(3)} &nbsp; 0.272727… = ${blank(3)} &nbsp; 0.1666… = ${blank(3)}${lines(2)}`,
        `A square has an area of 20 cm². Find the exact length of its side, as a simplified surd.${HI}${lines(1)}`])}`,
    answers: answersPage(h, "Exact answers", ["25π cm², 7π cm, 8π cm²", "17/12 (or 1 5/12), 7/12, 1/6, 10/3 (or 3⅓)", "3√2, 5√3, 4, 5, 8√2",
      "2√5 (10√5/5), √6/2 (3√6/6)", "4 − 3 = 1 (the √3 terms cancel: 2√3 − 2√3)", "0.333…, 0.4545…, 0.285714285714…",
      "5/9, 3/11 (27/99), 1/6. For example: x = 0.1666…, so 10x = 1.666…, 9x = 1.5, x = 1.5/9 = 15/90 = 1/6", "√20 = √(4 × 5) = 2√5 cm"])
  }));

  add("paper-ks4-bounds", KS4("limits-of-accuracy-rounding-truncating-and-bounds"), "How accurate?", "Error intervals for rounding and truncating, and upper and lower bounds in calculations.", (who, h) => ({
    pupil: `${h.sheetHead("How accurate?", who)}
      ${q4([`Write the error interval for each, using inequality notation.<br>a) A length of 12 cm, rounded to the nearest centimetre: ${blank(8)}<br>b) A mass of 3.7 kg, rounded to 1 decimal place: ${blank(8)}<br>c) A crowd of 600 people, rounded to the nearest 100: ${blank(8)}<br>d) A time of 9.2 seconds, truncated to 1 decimal place: ${blank(8)}`,
        `A number is truncated to 1 decimal place, giving 5.8. Is 5.86 a possible value? Is 5.75? Explain.${lines(1)}`,
        `A rectangle is 15 cm long and 8 cm wide, each measured to the nearest centimetre. Find the lower and upper bounds of its perimeter.${lines(1)}`,
        `A car travels 120 km, to the nearest 10 km, in 1.5 hours, to the nearest 0.1 of an hour. Find the upper and lower bounds of its average speed, to 1 decimal place.${HI}${lines(2)}`,
        `a = 7.2 and b = 2.4, both rounded to 1 decimal place. Find the upper bound of a − b.${HI}${lines(1)}`,
        `The upper bound of 12 cm (to the nearest centimetre) is 12.5 cm, but 12.5 would round to 13. Explain why we still use 12.5.${lines(2)}`])}`,
    answers: answersPage(h, "How accurate?", ["a) 11.5 ≤ l < 12.5 &nbsp; b) 3.65 ≤ m < 3.75 &nbsp; c) 550 ≤ n < 650 &nbsp; d) 9.2 ≤ t < 9.3",
      "5.86: yes (it truncates to 5.8). 5.75: no (it truncates to 5.7). The interval is 5.8 ≤ x < 5.9", "Lower: 2 × (14.5 + 7.5) = 44 cm. Upper: 2 × (15.5 + 8.5) = 48 cm",
      "Upper: 125 ÷ 1.45 = 86.2 km/h (the largest distance over the shortest time). Lower: 115 ÷ 1.55 = 74.2 km/h", "7.25 − 2.35 = 4.9 (the largest a minus the smallest b)",
      "The length can be as close to 12.5 as you like without reaching it; the &lt; sign shows 12.5 itself isn't included"])
  }));

  add("paper-ks4-factorise", KS4("factorising-quadratics-and-algebraic-fractions"), "Factorise it", "Factorising x² + bx + c, the difference of two squares, ax² + bx + c, and algebraic fractions.", (who, h) => ({
    pupil: `${h.sheetHead("Factorise it", who)}
      <p>Check every answer by expanding the brackets.</p>
      ${q4([`Factorise: &nbsp; x² + 9x + 20 = ${blank(6)} &nbsp; x² + 2x − 15 = ${blank(6)} &nbsp; x² − 10x + 21 = ${blank(6)} &nbsp; x² − 6x − 16 = ${blank(6)}`,
        `Factorise, using the difference of two squares: &nbsp; x² − 36 = ${blank(6)} &nbsp; y² − 1 = ${blank(6)} &nbsp; 4x² − 25 = ${blank(6)}`,
        `Take out a common factor first, then factorise fully: &nbsp; 2x² + 14x + 24 = ${blank(8)} &nbsp; 3x² − 27 = ${blank(8)}`,
        `Factorise:${HI} &nbsp; 2x² + 7x + 6 = ${blank(6)} &nbsp; 3x² − 7x + 2 = ${blank(6)} &nbsp; 6x² + x − 2 = ${blank(6)}`,
        `Simplify fully: (x² + 5x + 6) / (x² − 4)${HI}${lines(2)}`,
        `Write as a single fraction: 2/x + 3/(x + 1)${HI}${lines(2)}`,
        `Kim factorised x² − 3x − 10 as (x − 2)(x + 5). Explain the mistake and correct it.${lines(2)}`])}`,
    answers: answersPage(h, "Factorise it", ["(x + 4)(x + 5), (x + 5)(x − 3), (x − 3)(x − 7), (x − 8)(x + 2)", "(x + 6)(x − 6), (y + 1)(y − 1), (2x + 5)(2x − 5)",
      "2(x + 3)(x + 4), 3(x + 3)(x − 3)", "(2x + 3)(x + 2), (3x − 1)(x − 2), (3x + 2)(2x − 1)", "(x + 2)(x + 3) / ((x + 2)(x − 2)) = (x + 3)/(x − 2)",
      "(2(x + 1) + 3x) / (x(x + 1)) = (5x + 2) / (x(x + 1))", "(x − 2)(x + 5) expands to x² + 3x − 10: the signs are the wrong way round. It should be (x − 5)(x + 2)"])
  }));

  add("paper-ks4-prove", KS4("identities-algebraic-proof-and-functions"), "Prove it", "Equations and identities, algebraic proof, counter-examples, and functions, including inverse and composite functions.", (who, h) => ({
    pupil: `${h.sheetHead("Prove it", who)}
      ${q4([`Write = (an equation, true for some values) or ≡ (an identity, true for all values) in each box.<div class="pp-next"><span>4(x − 2) ☐ 4x − 8</span><span>2x + 5 ☐ 11</span><span>(x + 3)² ☐ x² + 6x + 9</span><span>x² ☐ 25</span><span>5x − 2x ☐ 3x</span></div>`,
        `Show that (n + 4)² − (n + 2)² ≡ 4n + 12. What does this tell you about the answer for any whole number n?${lines(2)}`,
        `Prove that the sum of any three consecutive even numbers is a multiple of 6.${lines(2)}`,
        `Prove that the difference between the squares of two consecutive whole numbers is always odd.${lines(2)}`,
        `f(x) = 3x − 4. Find f(5) = ${blank(3)} and f(−2) = ${blank(3)}. Solve f(x) = 20: ${blank(4)}`,
        `f(x) = 3x − 4 and g(x) = x². Find f⁻¹(x) = ${blank(5)}, fg(2) = ${blank(3)}, gf(2) = ${blank(3)} and gf(x) = ${blank(6)}${HI}`,
        `Kai says n² + n + 1 is always a prime number. Find a value of n that proves Kai wrong.${lines(1)}`])}`,
    answers: answersPage(h, "Prove it", ["≡, =, ≡, =, ≡", "n² + 8n + 16 − (n² + 4n + 4) = 4n + 12 = 4(n + 3), so the answer is always a multiple of 4",
      "2n + (2n + 2) + (2n + 4) = 6n + 6 = 6(n + 1), a multiple of 6", "(n + 1)² − n² = n² + 2n + 1 − n² = 2n + 1, which is odd (an even number plus 1)",
      "11, −10, x = 8", "f⁻¹(x) = (x + 4)/3; fg(2) = f(4) = 8; gf(2) = g(2) = 4; gf(x) = (3x − 4)²", "n = 4 gives 21 = 3 × 7 (n = 7 gives 57 = 3 × 19, also not prime)"],
      "A proof must work for every n. Checking examples is a good start, but it isn't a proof.")
  }));

  add("paper-ks4-lines", KS4("straight-line-graphs-y-mx-c-parallel-and-perpendicular-lines"), "Lines and gradients", "Gradients and intercepts, parallel and perpendicular lines, equations of lines, rates of change, and tangents to circles.", (who, h) => ({
    pupil: `${h.sheetHead("Lines and gradients", who)}
      ${q4([`Write down the gradient and the y-intercept of each line. &nbsp; y = 4x − 3: ${blank(5)} &nbsp; y = 7 − 2x: ${blank(5)} &nbsp; 2y = 6x + 10: ${blank(5)}`,
        `A: y = 3x + 2 &nbsp; B: y = 2 − 3x &nbsp; C: 2y = 6x − 8 &nbsp; D: y = ⅓x + 1 &nbsp; E: 3y = 12 − x<br>Which two lines are parallel? ${blank(4)} Which line is perpendicular to A?${HI} ${blank(3)}`,
        `Find the equation of the line through (2, 3) with a gradient of 4.${lines(1)}`,
        `Find the equation of the line through (1, 2) and (4, 11).${lines(2)}`,
        `Find the equation of the line perpendicular to y = 2x + 1 that passes through (4, 1).${HI}${lines(2)}`,
        `A plumber charges C = 40h + 60, where C is the cost in pounds and h is the number of hours. What do the 40 and the 60 mean?${lines(1)}`,
        `A circle has the equation x² + y² = 100. What is its radius? Show that (6, 8) is on the circle, then find the equation of the tangent to the circle at (6, 8).${HI}${lines(3)}`])}`,
    answers: answersPage(h, "Lines and gradients", ["4 and −3; −2 and 7; 3 and 5 (y = 3x + 5)", "A and C (both have gradient 3). E: its gradient is −⅓, and 3 × −⅓ = −1",
      "3 = 4 × 2 + c, so c = −5: y = 4x − 5", "m = (11 − 2) ÷ (4 − 1) = 3; 2 = 3 + c, so c = −1: y = 3x − 1", "m = −½; 1 = −½ × 4 + c, so c = 3: y = −½x + 3",
      "£40 for each hour (the rate of change, or gradient), plus a fixed £60 call-out charge (the intercept)",
      "Radius 10. 6² + 8² = 36 + 64 = 100. The radius to (6, 8) has gradient 8/6 = 4/3, so the tangent's gradient is −¾: 8 = −¾ × 6 + c, c = 12.5, so y = −¾x + 12.5 (or 3x + 4y = 50)"])
  }));

  add("paper-ks4-quadratics", KS4("quadratics-roots-turning-points-and-solving"), "Solve the quadratic", "Solving by factorising, roots and turning points from graphs, completing the square, and the quadratic formula.", (who, h) => ({
    pupil: `${h.sheetHead("Solve the quadratic", who)}
      ${q4([`Solve by factorising: &nbsp; x² + 7x + 10 = 0: ${blank(5)} &nbsp; x² − 3x − 18 = 0: ${blank(5)} &nbsp; x² − 25 = 0: ${blank(5)} &nbsp; x² − 8x = 0: ${blank(5)}`,
        `Rearrange, then solve: x² = 3x + 10${lines(1)}`,
        `For y = x² − 2x − 8, find the roots, the y-intercept and the turning point.${lines(2)}`])}
      <div class="pp-q pp-side" style="grid-template-columns:1fr auto"><div><p><b>4.</b> This is the graph of y = x² − 4x + 1.</p><p>a) Use it to estimate the solutions of x² − 4x + 1 = 0, to 1 decimal place. ${blank(6)}</p>
        <p>b) Write down the coordinates of the turning point. ${blank(4)}</p><p>c) Use the graph to solve x² − 4x + 1 = 3. ${blank(6)}</p></div>
        ${plot(-1, 5, -4, 7, 44, 22, 1, 1, (X, Y) => curve(X, Y, x => x * x - 4 * x + 1, -0.9, 4.9), ["x", "y"], 0.5, 1)}</div>
      ${q4([`Write x² + 6x + 4 in the form (x + p)² + q. Write down its turning point, and solve x² + 6x + 4 = 0, leaving your answers as surds.${HI}${lines(2)}`,
        `Use the quadratic formula to solve 3x² − 5x − 1 = 0. Give your answers to 2 decimal places.${HI}${lines(2)}`,
        `Solve 2x² + 3x − 2 = 0 by any method.${HI}${lines(1)}`], 5)}`,
    answers: answersPage(h, "Solve the quadratic", ["x = −2 or −5; x = 6 or −3; x = 5 or −5; x = 0 or 8", "x² − 3x − 10 = 0, (x − 5)(x + 2) = 0, so x = 5 or −2",
      "(x − 4)(x + 2): roots x = 4 and x = −2; y-intercept (0, −8); turning point halfway between the roots at x = 1, y = 1 − 2 − 8 = −9, so (1, −9)",
      "a) x ≈ 0.3 and x ≈ 3.7 (exactly 2 ± √3) &nbsp; b) (2, −3) &nbsp; c) where the curve meets y = 3: x ≈ −0.4 and x ≈ 4.4 (exactly 2 ± √6)",
      "(x + 3)² − 5; turning point (−3, −5); x = −3 ± √5", "x = (5 ± √37) / 6, so x ≈ 1.85 or x ≈ −0.18", "(2x − 1)(x + 2) = 0, so x = ½ or x = −2"])
  }));

  add("paper-ks4-two-unknowns", KS4("simultaneous-equations-and-inequalities"), "Two unknowns", "Simultaneous equations by elimination, substitution and graph, a problem to form and solve, and inequalities on a number line.", (who, h) => ({
    pupil: `${h.sheetHead("Two unknowns", who)}
      ${q4([`Solve: &nbsp; 3x + y = 14 and x − y = 2 ${lines(1)}`, `Solve: &nbsp; 2x + 3y = 13 and 4x + y = 11 ${lines(1)}`, `Solve: &nbsp; 5x − 2y = 4 and 3x + 4y = 18 ${lines(1)}`,
        `3 adult tickets and 2 child tickets cost £36. 1 adult ticket and 4 child tickets cost £32. Write two equations, and find the cost of each ticket.${lines(2)}`])}
      <div class="pp-q pp-side" style="grid-template-columns:1fr auto"><div><p><b>5.</b> The graph shows y = x + 1 and y = 5 − x. Use it to solve the simultaneous equations y = x + 1 and y = 5 − x.</p><p>x = ${blank(2)} &nbsp; y = ${blank(2)}</p></div>
        ${plot(0, 5, 0, 6, 22, 22, 1, 1, (X, Y) => curve(X, Y, x => x + 1, 0, 5, 1) + curve(X, Y, x => 5 - x, 0, 5, 1))}</div>
      ${q4([`Solve each inequality, and show the solution on the number line.<br>a) 2x + 3 > 11 ${blank(4)}${numLine()}b) 5 − 3x ≤ 17 ${blank(4)}${numLine()}c) −2 < x + 1 ≤ 4 ${blank(5)} List the integers that satisfy it: ${blank(6)}${numLine()}`,
        `Solve x² − x − 6 < 0. Write the answer in set notation.${HI}${lines(1)}`,
        `Solve the simultaneous equations y = x + 2 and x² + y² = 20.${HI}${lines(2)}`], 6)}`,
    answers: answersPage(h, "Two unknowns", ["Add: 4x = 16, so x = 4, y = 2", "y = 11 − 4x; 2x + 33 − 12x = 13, so x = 2, y = 3", "Double the first and add: 13x = 26, so x = 2, y = 3",
      "3a + 2c = 36 and a + 4c = 32: adult £8, child £6", "x = 2, y = 3 (where the lines cross)",
      "a) x > 4 (open circle at 4, arrow right) &nbsp; b) x ≥ −4 (dividing by −3 turns the sign round; filled circle at −4, arrow right) &nbsp; c) −3 < x ≤ 3 (open circle at −3, filled at 3); integers −2, −1, 0, 1, 2, 3",
      "(x − 3)(x + 2) < 0, so −2 < x < 3: {x : −2 < x < 3}", "x² + (x + 2)² = 20 gives x² + 2x − 8 = 0, (x + 4)(x − 2) = 0: x = 2, y = 4 or x = −4, y = −2"])
  }));

  add("paper-ks4-sequences", KS4("sequences-quadratic-geometric-and-the-nth-term"), "Sequence detective", "Name types of sequence, find nth terms of linear and quadratic sequences, and work with Fibonacci-type and geometric sequences.", (who, h) => ({
    pupil: `${h.sheetHead("Sequence detective", who)}
      <div class="pp-q"><p><b>1.</b> Name each type of sequence (arithmetic, geometric, Fibonacci type, square, cube or triangular) and write the next two terms.</p>
        <table class="pp-table"><tr><th>Sequence</th><th>Type</th><th>Next two terms</th></tr>
          ${["3, 7, 11, 15, …", "5, 15, 45, 135, …", "2, 3, 5, 8, 13, …", "1, 3, 6, 10, 15, …", "1, 8, 27, 64, …", "64, 32, 16, 8, …"].map(s => `<tr><td>${s}</td><td></td><td></td></tr>`).join("")}</table></div>
      ${q4([`Find the nth term: &nbsp; 6, 11, 16, 21, …: ${blank(4)} &nbsp; 20, 17, 14, 11, …: ${blank(4)} &nbsp; 1.5, 2, 2.5, 3, …: ${blank(4)}`,
        `Is 100 a term of the sequence with nth term 5n + 1? Explain.${lines(1)}`,
        `Find the nth term of each quadratic sequence:${HI} &nbsp; 2, 5, 10, 17, 26: ${blank(4)} &nbsp; 4, 10, 18, 28, 40: ${blank(4)} &nbsp; 3, 10, 21, 36, 55: ${blank(5)}`,
        `A Fibonacci-type sequence starts a, b, … Its 3rd term is 7 and its 5th term is 18. Find a and b.${lines(2)}`,
        `A geometric sequence starts at 2 and has a common ratio of √3. Write the next three terms, as simply as you can.${HI}${lines(1)}`], 2)}`,
    answers: answersPage(h, "Sequence detective", ["Arithmetic: 19, 23. Geometric (× 3): 405, 1215. Fibonacci type: 21, 34. Triangular: 21, 28. Cube: 125, 216. Geometric (× ½): 4, 2",
      "5n + 1, 23 − 3n, 0.5n + 1", "No: 5n + 1 = 100 gives n = 19.8, which isn't a whole number", "n² + 1; n² + 3n; 2n² + n",
      "The terms are a, b, a + b, a + 2b, 2a + 3b. a + b = 7 and 2a + 3b = 18, so b = 4 and a = 3 (3, 4, 7, 11, 18)", "2√3, 6, 6√3"])
  }));

  add("paper-ks4-graph-gallery", KS4("graphs-of-functions-and-their-transformations"), "Graph gallery", "Match equations to graph shapes, plot a cubic and a reciprocal graph, the sine graph, and transformations of graphs.", (who, h) => {
    const shapes = [["A", [x => x ** 3 / 3, -3, 3]], ["B", [x => 2 * x - 1, -3, 3]], ["C", [x => 1 / x, -3, -0.3], [x => 1 / x, 0.3, 3]], ["D", [x => 2 * Math.sin(x * Math.PI / 3), -3, 3]],
      ["E", [x => x * x - 3, -3, 3]], ["F", [x => 2 ** x / 2, -3, 3]]];
    return {
      pupil: `${h.sheetHead("Graph gallery", who)}
        <div class="pp-q"><p><b>1.</b> Match each equation to its sketch. Write the letter.</p>
          <div class="pp-row4" style="grid-template-columns:repeat(6,1fr)">${shapes.map(([l, ...parts]) => `<div>${mini(...parts)}<b>${l}</b></div>`).join("")}</div>
          <div class="pp-next"><span>y = x² − 3 ${blank(2)}</span><span>y = 1/x ${blank(2)}</span><span>y = 2x − 1 ${blank(2)}</span><span>y = x³ ${blank(2)}</span><span>y = 2ˣ ${blank(2)}${HI}</span><span>y = sin x ${blank(2)}${HI}</span></div></div>
        <div class="pp-q pp-side" style="grid-template-columns:1fr auto"><div><p><b>2.</b> Complete the table for y = x³ − 3x, then plot the graph.</p>
          <table class="pp-table"><tr><th>x</th>${[-2, -1, 0, 1, 2].map(x => `<td class="pp-c">${x}</td>`).join("")}</tr><tr><th>y</th>${"<td></td>".repeat(5)}</tr></table>
          <p><b>3.</b> Complete the table for y = 12/x.</p>
          <table class="pp-table"><tr><th>x</th>${[1, 2, 3, 4, 6, 12].map(x => `<td class="pp-c">${x}</td>`).join("")}</tr><tr><th>y</th>${"<td></td>".repeat(6)}</tr></table>
          <p>Why is there no value of y when x = 0? ${lines(1)}</p></div>
          ${plot(-3, 3, -3, 3, 34, 34, 1, 1)}</div>
        ${q4([`For y = sin x, between 0° and 360°: where is sin x = 0? ${blank(6)} What is its greatest value, and where? ${blank(5)} Which angle between 90° and 180° has the same sine as 30°? ${blank(3)}${HI}`,
          `Describe how the graph of y = x² is transformed to give: &nbsp; y = x² + 5 ${blank(6)} &nbsp; y = (x − 2)² ${blank(6)} &nbsp; y = −x² ${blank(6)} &nbsp; y = (x + 1)² − 4 ${blank(8)}${HI}`,
          `The graph of y = f(x) has a maximum point at (3, 7). Write down the maximum point of: &nbsp; y = f(x) − 2 ${blank(3)} &nbsp; y = f(x + 3) ${blank(3)} &nbsp; y = f(−x) ${blank(3)}${HI}`], 4)}`,
      answers: answersPage(h, "Graph gallery", ["y = x² − 3: E; y = 1/x: C; y = 2x − 1: B; y = x³: A; y = 2ˣ: F; y = sin x: D", "y = −2, 2, 0, −2, 2: an S-shaped cubic through the origin, crossing the x-axis at 0 and about ±1.7",
        "y = 12, 6, 4, 3, 2, 1. There's no value at x = 0 because you can't divide by 0: the curve never touches the y-axis",
        "0°, 180° and 360°; greatest value 1, at 90°; 150°", "Up 5 (translation by the vector 0 over 5); right 2; reflected in the x-axis; left 1 and down 4, with its turning point at (−1, −4)",
        "(3, 5), (0, 7), (−3, 7)"])
    };
  });

  add("paper-ks4-motion", KS4("real-life-graphs-gradients-areas-and-rates-of-change"), "Graphs in motion", "A velocity-time graph (acceleration and distance), the kinematics formulae, and tangents and chords on a curve.", (who, h) => ({
    pupil: `${h.sheetHead("Graphs in motion", who)}
      <div class="pp-q pp-side" style="grid-template-columns:1fr auto"><div><p><b>1.</b> The graph shows a cyclist's velocity over 16 seconds.</p>
        <p>a) Find the acceleration in the first 4 seconds. ${blank(4)}</p><p>b) Find the deceleration in the last 6 seconds. ${blank(4)}</p>
        <p>c) Use the area under the graph to find the total distance travelled. ${lines(1)}</p><p>d) Find the average speed for the whole journey. ${blank(4)}</p></div>
        ${plot(0, 16, 0, 14, 20, 18, 2, 2, (X, Y) => `<polyline points="${X(0)},${Y(0)} ${X(4)},${Y(12)} ${X(10)},${Y(12)} ${X(16)},${Y(0)}" class="pp-shape"/>`, ["t (s)", "v (m/s)"])}</div>
      ${q4([`Use the kinematics formulae v = u + at, s = ut + ½at² and v² = u² + 2as.<br>a) u = 5 m/s, a = 3 m/s², t = 4 s. Find v. ${blank(4)}<br>b) u = 0, a = 4 m/s², s = 50 m. Find v. ${blank(4)}<br>c) u = 2 m/s, a = 3 m/s², t = 4 s. Find s. ${blank(4)}`], 2)}
      <div class="pp-q pp-side" style="grid-template-columns:1fr auto"><div><p><b>3.</b> The graph shows the distance d metres of a ball rolling down a slope after t seconds.${HI}</p>
        <p>a) Draw a tangent at t = 4 and use it to estimate the speed at 4 seconds. ${blank(4)}</p><p>b) Draw a chord from t = 2 to t = 6 and find the average speed over that time. ${blank(4)}</p>
        <p>c) What do you notice? ${lines(1)}</p></div>
        ${plot(0, 6, 0, 18, 40, 12, 1, 2, (X, Y) => curve(X, Y, t => t * t / 2, 0, 6), ["t (s)", "d (m)"], 0.5, 1)}</div>`,
    answers: answersPage(h, "Graphs in motion", ["a) 12 ÷ 4 = 3 m/s² &nbsp; b) 12 ÷ 6 = 2 m/s² &nbsp; c) ½ × 4 × 12 + 6 × 12 + ½ × 6 × 12 = 24 + 72 + 36 = 132 m &nbsp; d) 132 ÷ 16 = 8.25 m/s",
      "a) v = 5 + 12 = 17 m/s &nbsp; b) v² = 0 + 400, v = 20 m/s &nbsp; c) s = 8 + 24 = 32 m",
      "a) about 4 m/s (accept 3.5 to 4.5 from a drawn tangent) &nbsp; b) (18 − 2) ÷ 4 = 4 m/s &nbsp; c) they're the same here: on this curve (d = ½t²) the average speed over 2 to 6 seconds equals the speed at the midpoint, 4 seconds"])
  }));

  add("paper-ks4-growth", KS4("growth-decay-compound-interest-and-iteration"), "Growing and shrinking", "Multipliers, compound and simple interest, depreciation, growth, reverse percentages, and iteration.", (who, h) => ({
    pupil: `${h.sheetHead("Growing and shrinking", who)}
      ${q4([`Write the multiplier for: &nbsp; an increase of 6% ${blank(3)} &nbsp; a decrease of 12% ${blank(3)} &nbsp; an increase of 150% ${blank(3)} &nbsp; a decrease of 2.5% ${blank(3)}`,
        `£3000 is invested at 4% compound interest a year. How much is it worth after 3 years? Use total = P(1 + r/100)ⁿ.${lines(1)}`,
        `How much more is that than 4% simple interest on £3000 for 3 years?${lines(1)}`,
        `A car worth £18 000 loses 15% of its value each year. What is it worth after 4 years?${lines(1)}`,
        `A colony of 50 bacteria doubles every hour. How many are there after 6 hours? Write a formula for the number after t hours.${lines(1)}`,
        `After a 20% increase, a price is £84. What was the price before the increase?${lines(1)}`,
        `£1000 is invested at 5% compound interest a year. After how many whole years is it first worth more than £1500?${lines(1)}`,
        `Use the iteration xₙ₊₁ = ∛(5 − 2xₙ) with x₀ = 1 to find x₁, x₂ and x₃, to 4 decimal places. Which equation is it helping to solve?${HI}${lines(2)}`])}`,
    answers: answersPage(h, "Growing and shrinking", ["1.06, 0.88, 2.5, 0.975", "3000 × 1.04³ = £3374.59", "Simple interest is £360 (£3360 in all), so compound interest gives £14.59 more",
      "18 000 × 0.85⁴ = £9396.11", "50 × 2⁶ = 3200; N = 50 × 2ᵗ", "84 ÷ 1.2 = £70 (not 84 − 20% = £67.20)", "1.05⁸ ≈ 1.477 (£1477.46) but 1.05⁹ ≈ 1.551 (£1551.33), so 9 years",
      "x₁ = 1.4422, x₂ = 1.2837, x₃ = 1.3449 (it settles towards about 1.328). It solves x³ = 5 − 2x, that is, x³ + 2x − 5 = 0"])
  }));

  add("paper-ks4-proportion", KS4("proportion-compound-units-and-fractions-in-ratio"), "Proportion and units", "Direct and inverse proportion, converting compound units, density and pressure, and fractions in ratio problems.", (who, h) => ({
    pupil: `${h.sheetHead("Proportion and units", who)}
      ${q4([`y is directly proportional to x, and y = 21 when x = 3. Write a formula for y in terms of x. ${blank(4)} Find y when x = 10. ${blank(3)} Find x when y = 49. ${blank(3)}`,
        `y is inversely proportional to x, and y = 10 when x = 6. Write a formula for y in terms of x. ${blank(4)} Find y when x = 4. ${blank(3)} Find x when y = 2. ${blank(3)}`,
        `d is proportional to t², and d = 45 when t = 3. Find a formula for d in terms of t, and find d when t = 4.${HI}${lines(1)}`,
        `Sketch the graph of y = kx and the graph of y = k/x for positive x. How can you tell them apart?<div class="pp-cols"><div class="pp-draw pp-short"></div><div class="pp-draw pp-short"></div></div>`,
        `Convert: &nbsp; 54 km/h to m/s: ${blank(3)} &nbsp; 8 m/s to km/h: ${blank(3)} &nbsp; 2.5 g/cm³ to kg/m³: ${blank(4)}<br>Pay of £12.60 an hour: how much for 37.5 hours? ${blank(4)}`,
        `A block of metal has a mass of 2.7 kg and a volume of 1000 cm³. Find its density in g/cm³. ${blank(3)} A force of 600 N acts on an area of 1.5 m². Find the pressure in N/m². ${blank(3)}`,
        `The ratio of pupils who walk to school to those who don't is 2 : 7. What fraction walk? ${blank(2)} ⅜ of the sweets in a bag are red. Write the ratio red : not red. ${blank(3)}`,
        `Ali and Ben share some money, and Ali gets ⅗ of it. Write the ratio Ali : Ben. If Ben gets £48, how much does Ali get?${lines(1)}`])}`,
    answers: answersPage(h, "Proportion and units", ["y = 7x; 70; 7", "y = 60/x; 15; 30", "d = 5t²; 80", "y = kx is a straight line through the origin; y = k/x is a curve that gets closer to both axes without touching them",
      "15 m/s; 28.8 km/h; 2500 kg/m³; £472.50", "2700 g ÷ 1000 cm³ = 2.7 g/cm³; 600 ÷ 1.5 = 400 N/m²", "2/9; 3 : 5", "3 : 2; each part is £24, so Ali gets £72"])
  }));

  add("paper-ks4-similar", KS4("similarity-and-enlargement"), "Similar shapes", "Missing sides in similar shapes, area and volume scale factors, and enlargement by fractional and negative scale factors.", (who, h) => ({
    pupil: `${h.sheetHead("Similar shapes", who)}
      ${q4([`Triangles ABC and PQR are similar, with A matching P, B matching Q and C matching R. AB = 6 cm, BC = 9 cm and PQ = 10 cm. Find QR.${lines(1)}`,
        `Two rectangles are similar. The small one is 4 cm by 6 cm. The long side of the large one is 15 cm. Find its short side, the length scale factor, the area scale factor, and the area of the large rectangle.${lines(2)}`,
        `Two similar bottles are 12 cm and 18 cm tall. The small one holds 400 ml. How much does the large one hold?${HI}${lines(1)}`,
        `Two similar solids have surface areas of 50 cm² and 200 cm². The smaller one has a volume of 30 cm³. Find the volume of the larger one.${HI}${lines(2)}`])}
      <div class="pp-q pp-side" style="grid-template-columns:1fr auto"><div><p><b>5.</b> Enlarge triangle T by scale factor ½, centre O. Label the image A.</p><p>Then enlarge T by scale factor −½, centre O. Label the image B.${HI}</p>
        <p>Write the coordinates of the corners of A: ${blank(8)}</p><p>and of B: ${blank(8)}</p></div>
        ${plot(0, 16, 0, 12, 20, 20, 2, 2, (X, Y) => `<polygon points="${X(12)},${Y(10)} ${X(16)},${Y(10)} ${X(16)},${Y(6)}" class="pp-shape"/><text x="${X(14.6)}" y="${Y(8.6)}" class="pp-lab">T</text>${dotAt(X, Y, 8, 6)}<text x="${X(8) - 14}" y="${Y(6) - 6}" class="pp-lab">O</text>`)}</div>
      ${q4([`Explain why all circles are similar, but not all rectangles are.${lines(2)}`], 6)}`,
    answers: answersPage(h, "Similar shapes", ["Scale factor 10/6 = 5/3, so QR = 9 × 5/3 = 15 cm", "10 cm; 2.5; 2.5² = 6.25; 24 × 6.25 = 150 cm² (or 10 × 15)", "Length factor 1.5, volume factor 1.5³ = 3.375: 400 × 3.375 = 1350 ml",
      "Area factor 4, so length factor 2 and volume factor 8: 240 cm³", "O is (8, 6) and T is (12, 10), (16, 10), (16, 6). A: (10, 8), (12, 8), (12, 6). B: (6, 4), (4, 4), (4, 6), on the other side of O and upside down",
      "A circle has only one shape (only its radius changes), so any circle is an enlargement of any other. Rectangles can have different ratios of length to width"])
  }));

  add("paper-ks4-vectors", KS4("vectors-and-combined-transformations"), "Vectors", "Calculating with column vectors, translations, vectors in a parallelogram, vector proof, and combining reflections.", (who, h) => ({
    pupil: `${h.sheetHead("Vectors", who)}
      ${q4([`a = ${cv(3, 1)}, b = ${cv(-2, 4)} and c = ${cv(0, -5)}. Work out: &nbsp; a + b ${blank(3)} &nbsp; a − b ${blank(3)} &nbsp; 3a ${blank(3)} &nbsp; 2b + c ${blank(3)} &nbsp; a − 2c ${blank(3)}`,
        `The point P(2, 3) is translated by the vector ${cv(4, -1)}. Where does it end up? ${blank(4)} Which vector would take it back? ${blank(3)}`])}
      <div class="pp-q pp-side" style="grid-template-columns:1fr auto"><div><p><b>3.</b> OABC is a parallelogram. <b>OA</b> = a and <b>OC</b> = c. M is the midpoint of OB. Write in terms of a and c:</p>
        <p><b>OB</b> = ${blank(4)} &nbsp; <b>AC</b> = ${blank(4)}</p><p><b>CB</b> = ${blank(4)} &nbsp; <b>OM</b> = ${blank(4)}</p></div>
        ${svg(230, 130, `<polygon points="20,110 150,110 210,25 80,25" class="pp-shape"/><line x1="20" y1="110" x2="210" y2="25" class="pp-dash"/><line x1="150" y1="110" x2="80" y2="25" class="pp-dash"/>
          <text x="6" y="124" class="pp-lab">O</text><text x="150" y="126" class="pp-lab">A</text><text x="214" y="24" class="pp-lab">B</text><text x="66" y="22" class="pp-lab">C</text>
          <text x="80" y="104" class="pp-lab">a</text><text x="34" y="66" class="pp-lab">c</text><text x="104" y="76" class="pp-lab">M</text>`)}</div>
      ${q4([`<b>OA</b> = a and <b>OB</b> = b. M is the midpoint of AB. Show that <b>OM</b> = ½(a + b).${HI}${lines(2)}`,
        `Show that the vectors 2a + 6b and 3a + 9b are parallel.${HI}${lines(1)}`,
        `A shape is reflected in the x-axis, then the image is reflected in the y-axis. Describe the single transformation that does the same. Which point is invariant (stays where it is)?${HI}${lines(2)}`], 4)}`,
    answers: answersPage(h, "Vectors", [`${cv(1, 5)}, ${cv(5, -3)}, ${cv(9, 3)}, ${cv(-4, 3)}, ${cv(3, 11)}`, `(6, 2); ${cv(-4, 1)}`, "OB = a + c; AC = c − a; CB = a; OM = ½(a + c)",
      "AB = b − a, so AM = ½(b − a), and OM = a + ½(b − a) = ½a + ½b = ½(a + b)", "3a + 9b = 1.5(2a + 6b): one is a multiple of the other, so they're parallel",
      "A rotation of 180° about the origin (0, 0). The origin is the only invariant point"])
  }));

  add("paper-ks4-sectors", KS4("circles-parts-arc-lengths-and-sectors"), "Arcs and sectors", "The parts of a circle, circumference and area, and arc lengths, perimeters, angles and areas of sectors.", (who, h) => ({
    pupil: `${h.sheetHead("Arcs and sectors", who)}
      <div class="pp-q"><p><b>1.</b> Name each part of a circle.</p>
        <table class="pp-table">${["A straight line from the centre to the edge", "A straight line joining two points on the circle", "A chord that passes through the centre", "A straight line that touches the circle at one point",
          "A part of the circumference", "The region between two radii and an arc", "The region between a chord and an arc", "The distance all the way round"].map(d => `<tr><td>${d}</td><td style="width:30%"></td></tr>`).join("")}</table></div>
      ${q4([`A circle has a radius of 7 cm. Find, in terms of π, its circumference ${blank(4)} and its area ${blank(4)}`,
        `A sector has a radius of 10 cm and an angle of 72°. Find its arc length and its area, in terms of π and to 2 decimal places.${lines(2)}`,
        `A sector has a radius of 6 cm and an angle of 150°. Find its perimeter, to 1 decimal place.${lines(2)}`,
        `A sector has an area of 12π cm² and a radius of 6 cm. Find its angle.${lines(1)}`,
        `An arc is 11 cm long, on a circle of radius 9 cm. Find the angle of the sector, to 1 decimal place.${lines(1)}`], 2)}`,
    answers: answersPage(h, "Arcs and sectors", ["Radius; chord; diameter; tangent; arc; sector; segment; circumference", "14π cm; 49π cm²", "Arc: 72/360 × 20π = 4π ≈ 12.57 cm. Area: 72/360 × 100π = 20π ≈ 62.83 cm²",
      "Arc: 150/360 × 12π = 5π ≈ 15.71 cm. Perimeter: 5π + 6 + 6 ≈ 27.7 cm (don't forget the two radii)", "θ/360 × 36π = 12π, so θ/360 = ⅓ and θ = 120°", "θ = 11 ÷ 18π × 360 ≈ 70.0°"])
  }));

  add("paper-ks4-circle-theorems", KS4("circle-theorems"), "Circle theorems", "Complete the theorems, use them to find angles with reasons, and prove the angle at the centre theorem.", (who, h) => ({
    pupil: `${h.sheetHead("Circle theorems", who)}
      <div class="pp-q"><p><b>1.</b> Complete each theorem.</p>
        <p>a) The angle at the centre is ${blank(5)} the angle at the circumference. &nbsp; b) The angle in a semicircle is ${blank(3)}</p>
        <p>c) Angles in the same segment are ${blank(4)} &nbsp; d) Opposite angles of a cyclic quadrilateral add up to ${blank(3)}</p>
        <p>e) A tangent and the radius meet at ${blank(3)} &nbsp; f) The two tangents from a point outside a circle are ${blank(5)}</p>
        <p>g) The perpendicular from the centre to a chord ${blank(4)} the chord. &nbsp; h) The angle between a tangent and a chord equals the angle in the ${blank(5)}</p></div>
      <p>For questions 2 to 6, sketch the diagram, find the angle, and give a reason for each step.</p>
      ${q4([`O is the centre of a circle. A, B and C are on the circle, and angle ACB = 38°. Find angle AOB.${lines(1)}`,
        `AB is a diameter of a circle, and C is on the circle. Angle CAB = 27°. Find angle ABC.${lines(1)}`,
        `PQRS is a cyclic quadrilateral. Angle P = 74° and angle Q = 101°. Find angles R and S.${lines(1)}`,
        `A tangent from T touches a circle, centre O, at A. Angle AOT = 58°. Find angle ATO.${lines(1)}`,
        `Two tangents from T touch a circle, centre O, at A and B. Angle ATB = 50°. Find angle TAB and angle AOB.${lines(2)}`,
        `Prove that the angle at the centre is twice the angle at the circumference. Hint: draw the line from C through O, and look for isosceles triangles.${lines(4)}`], 2)}`,
    answers: answersPage(h, "Circle theorems", ["a) twice b) 90° c) equal d) 180° e) 90° (a right angle) f) equal in length g) bisects h) alternate segment",
      "76°: the angle at the centre is twice the angle at the circumference", "63°: angle ACB = 90° (angle in a semicircle), and angles in a triangle add up to 180°",
      "R = 106° and S = 79°: opposite angles of a cyclic quadrilateral add up to 180°", "32°: angle OAT = 90° (tangent meets radius at 90°), and angles in a triangle add up to 180°",
      "TA = TB (tangents from a point), so triangle TAB is isosceles: angle TAB = (180 − 50) ÷ 2 = 65°. OATB has two right angles, so angle AOB = 360 − 90 − 90 − 50 = 130°",
      "OA = OC = OB (radii), so triangles OAC and OBC are isosceles. If angle OCA = x and angle OCB = y, then angle ACB = x + y. The exterior angle of triangle OAC at O is 2x, and of triangle OBC is 2y, so angle AOB = 2x + 2y = 2(x + y)"],
      "These questions are for more highly attaining pupils (bold content at GCSE).")
  }));

  add("paper-ks4-solids", KS4("3d-shapes-plans-elevations-surface-area-and-volume"), "Solid shapes", "Plans and elevations, cones, spheres, pyramids, prisms and a composite solid.", (who, h) => ({
    pupil: `${h.sheetHead("Solid shapes", who)}
      <div class="pp-q"><p><b>1.</b> A solid is made from 4 cubes: 3 in a row, and 1 on top of the cube at the left-hand end. Draw its plan, its front elevation (looking along the row from the front) and its side elevation (from the right).</p>
        <div class="pp-cols3">${["Plan", "Front elevation", "Side elevation"].map(t => `<div><p>${t}</p>${svg(130, 90, gridLines(8, 5, 16, 1, 1))}</div>`).join("")}</div></div>
      <p class="hint">For a sphere: V = 4/3πr³ and surface area = 4πr². For a cone: V = 1/3πr²h and curved surface area = πrl, where l is the slant height.</p>
      ${q4([`A cone has a radius of 6 cm, a height of 8 cm and a slant height of 10 cm. Find its volume and its total surface area, in terms of π.${lines(2)}`,
        `A sphere has a radius of 6 cm. Find its volume and its surface area, to 1 decimal place.${lines(1)}`,
        `A pyramid has a square base of side 9 cm and a height of 10 cm. Find its volume.${lines(1)}`,
        `A solid is a cylinder of radius 5 cm and height 12 cm, with a hemisphere of radius 5 cm on top. Find its volume, to 1 decimal place.${lines(2)}`,
        `A prism has a cross section in the shape of a trapezium with parallel sides of 4 cm and 10 cm, 5 cm apart. It is 20 cm long. Find its volume.${lines(1)}`,
        `A metal sphere of radius 3 cm is melted down and made into a cone with a radius of 3 cm. How tall is the cone?${lines(2)}`], 2)}`,
    answers: answersPage(h, "Solid shapes", ["Plan: 3 squares in a row. Front elevation: 3 squares in a row with 1 square on top of the left-hand one. Side elevation: 2 squares, one above the other",
      "V = ⅓ × π × 36 × 8 = 96π cm³. Surface area = π × 6 × 10 + π × 36 = 96π cm²", "V = 288π ≈ 904.8 cm³; surface area = 144π ≈ 452.4 cm²", "⅓ × 81 × 10 = 270 cm³",
      "300π + ⅔ × 125π = 383⅓π ≈ 1204.3 cm³", "Cross section ½ × (4 + 10) × 5 = 35 cm², so the volume is 35 × 20 = 700 cm³", "Sphere: 36π cm³. ⅓ × π × 9 × h = 36π, so 3h = 36 and h = 12 cm"])
  }));

  add("paper-ks4-trig", KS4("pythagoras-trigonometry-and-bearings"), "Right-angled triangles", "Pythagoras' Theorem, finding sides and angles with trigonometry, exact values, bearings, and a 3D problem.", (who, h) => ({
    pupil: `${h.sheetHead("Right-angled triangles", who)}
      <p>Sketch each triangle before you start. In every triangle ABC below, angle C = 90°.</p>
      ${q4([`Find the missing side. &nbsp; a) AC = 9 cm, BC = 12 cm: AB = ${blank(3)} &nbsp; b) AB = 13 cm, BC = 5 cm: AC = ${blank(3)} &nbsp; c) AC = 4 cm, BC = 7 cm: AB = ${blank(4)} (to 2 d.p.)`,
        `Find the length, to 2 decimal places. &nbsp; a) AB = 15 cm, angle A = 40°: BC = ${blank(4)} &nbsp; b) AB = 20 cm, angle A = 25°: AC = ${blank(4)} &nbsp; c) BC = 8 cm, angle A = 32°: AC = ${blank(4)}`,
        `Find angle A, to 1 decimal place. &nbsp; a) BC = 5 cm, AC = 9 cm: ${blank(4)} &nbsp; b) AC = 6 cm, AB = 11 cm: ${blank(4)}`,
        `Write the exact value, without a calculator: &nbsp; sin 30° ${blank(2)} &nbsp; cos 60° ${blank(2)} &nbsp; tan 45° ${blank(2)} &nbsp; sin 60° ${blank(2)} &nbsp; cos 30° ${blank(2)} &nbsp; tan 60° ${blank(2)} &nbsp; cos 0° ${blank(2)} &nbsp; sin 90° ${blank(2)} &nbsp; tan 30° ${blank(2)} &nbsp; sin 45° ${blank(2)}`,
        `Without a calculator: AB = 10 cm and angle A = 30°. Find BC and AC exactly.${lines(1)}`,
        `A ship sails 12 km on a bearing of 090°, then 5 km on a bearing of 000°. How far is it from where it started? What is its bearing from the start, and the bearing of the start from the ship?${lines(2)}`,
        `The bearing of B from A is 130°. What is the bearing of A from B? ${blank(3)}`,
        `A cuboid is 3 cm by 4 cm by 12 cm. Find the length of the diagonal from a bottom corner to the opposite top corner, and the angle it makes with the base.${HI}${lines(2)}`])}`,
    answers: answersPage(h, "Right-angled triangles", ["a) 15 cm b) 12 cm c) √65 ≈ 8.06 cm", "a) 15 sin 40° = 9.64 cm b) 20 cos 25° = 18.13 cm c) 8 ÷ tan 32° = 12.80 cm", "a) tan⁻¹(5/9) = 29.1° b) cos⁻¹(6/11) = 56.9°",
      "½, ½, 1, √3/2, √3/2, √3, 1, 1, 1/√3 (or √3/3), 1/√2 (or √2/2)", "BC = 10 sin 30° = 5 cm; AC = 10 cos 30° = 5√3 cm",
      "√(12² + 5²) = 13 km. Bearing from the start: 90° − tan⁻¹(5/12) ≈ 067°. Bearing of the start from the ship: 067° + 180° = 247°", "310° (130° + 180°)",
      "Base diagonal √(3² + 4²) = 5 cm; diagonal √(5² + 12²) = 13 cm; angle with the base tan⁻¹(12/5) ≈ 67.4°"])
  }));

  add("paper-ks4-any-triangle", KS4("the-sine-rule-cosine-rule-and-area-of-any-triangle"), "Any triangle", "The sine rule, the cosine rule, the area of any triangle, choosing a method, and a bearings problem.", (who, h) => ({
    pupil: `${h.sheetHead("Any triangle", who)}
      <p>In triangle ABC, side a is opposite angle A, side b is opposite angle B and side c is opposite angle C. Sketch each triangle first. Give lengths to 2 decimal places and angles to 1 decimal place.</p>
      <p class="hint">a/sin A = b/sin B = c/sin C &nbsp; · &nbsp; a² = b² + c² − 2bc cos A &nbsp; · &nbsp; Area = ½ab sin C</p>
      ${q4([`A = 50°, B = 70° and b = 12 cm. Find a.${lines(1)}`, `a = 9 cm, b = 7 cm and A = 80°. Find B.${lines(1)}`, `b = 8 cm, c = 11 cm and A = 35°. Find a.${lines(1)}`,
        `The sides of a triangle are 7 cm, 8 cm and 10 cm. Find its largest angle.${lines(1)}`, `Find the area of a triangle with sides of 9 cm and 14 cm and an angle of 120° between them.${lines(1)}`,
        `A triangle has an area of 30 cm², and two sides of 8 cm and 10 cm. Find the acute angle between those two sides.${lines(1)}`,
        `Which would you use: the sine rule, the cosine rule, or sin, cos and tan? &nbsp; a) Two sides and the angle between them; find the third side: ${blank(5)} &nbsp; b) A right-angled triangle with a side and an angle: ${blank(5)} &nbsp; c) Two angles and a side: ${blank(5)} &nbsp; d) Three sides; find an angle: ${blank(5)}`,
        `Two boats leave a harbour. One sails 6 km on a bearing of 040°, the other 9 km on a bearing of 110°. How far apart are they?${lines(2)}`])}`,
    answers: answersPage(h, "Any triangle", ["a = 12 sin 50° ÷ sin 70° = 9.78 cm", "sin B = 7 sin 80° ÷ 9 = 0.766, so B = 50.0°", "a² = 64 + 121 − 176 cos 35° = 40.83, so a = 6.39 cm",
      "Opposite the 10 cm side: cos C = (49 + 64 − 100) ÷ 112 = 13/112, so C = 83.3°", "½ × 9 × 14 × sin 120° = 54.56 cm²", "½ × 8 × 10 × sin C = 30, so sin C = 0.75 and C = 48.6°",
      "a) cosine rule b) sin, cos and tan c) sine rule d) cosine rule", "The angle between their paths is 110° − 40° = 70°: d² = 36 + 81 − 108 cos 70° = 80.06, so d = 8.95 km"],
      "These questions are for more highly attaining pupils (bold content at GCSE).")
  }));

  add("paper-ks4-predict", KS4("probability-exhaustive-events-models-and-predictions"), "Predict and test", "Probabilities that sum to 1, expected outcomes, relative frequency and sample size, and mutually exclusive events.", (who, h) => ({
    pupil: `${h.sheetHead("Predict and test", who)}
      <div class="pp-q"><p><b>1.</b> A spinner can land on red, blue, green or yellow. Find the probability of green.</p>
        <table class="pp-table"><tr><th>Colour</th><td class="pp-c">Red</td><td class="pp-c">Blue</td><td class="pp-c">Green</td><td class="pp-c">Yellow</td></tr><tr><th>Probability</th><td class="pp-c">0.2</td><td class="pp-c">0.35</td><td></td><td class="pp-c">0.15</td></tr></table></div>
      <div class="pp-q"><p><b>2.</b> Find x, then the probabilities of B and C.</p>
        <table class="pp-table"><tr><th>Outcome</th><td class="pp-c">A</td><td class="pp-c">B</td><td class="pp-c">C</td><td class="pp-c">D</td></tr><tr><th>Probability</th><td class="pp-c">0.1</td><td class="pp-c">2x</td><td class="pp-c">3x</td><td class="pp-c">0.3</td></tr></table>${lines(1)}</div>
      ${q4([`The probability that it rains tomorrow is 0.35. What is the probability that it doesn't? ${blank(3)}`,
        `How many times would you expect: a fair dice to land on 5 in 240 rolls? ${blank(3)} A biased coin with P(heads) = 0.6 to land on heads in 150 throws? ${blank(3)}`], 3)}
      <div class="pp-q"><p><b>5.</b> A drawing pin is dropped and lands point up or point down.</p>
        <table class="pp-table"><tr><th>Number of drops</th><td class="pp-c">20</td><td class="pp-c">100</td><td class="pp-c">500</td></tr><tr><th>Point up</th><td class="pp-c">13</td><td class="pp-c">58</td><td class="pp-c">302</td></tr><tr><th>Relative frequency</th><td></td><td></td><td></td></tr></table>
        <p>Which is the best estimate of P(point up), and why? About how many times would it land point up in 1000 drops?</p>${lines(2)}</div>
      ${q4([`A spinner has 5 equal sections numbered 1 to 5. Ellie spins it 50 times and gets an even number 26 times. Does this show the spinner is biased? Explain.${lines(2)}`,
        `Are these pairs of events mutually exclusive? Write yes or no. &nbsp; a) Rolling a 2 and rolling an odd number, on one roll ${blank(2)} &nbsp; b) Picking a king and picking a heart, from a pack of cards ${blank(2)} &nbsp; c) A bus being late and the same bus being on time ${blank(2)}`], 6)}`,
    answers: answersPage(h, "Predict and test", ["1 − (0.2 + 0.35 + 0.15) = 0.3", "0.1 + 2x + 3x + 0.3 = 1, so 5x = 0.6 and x = 0.12: P(B) = 0.24, P(C) = 0.36", "0.65", "40; 90",
      "0.65, 0.58, 0.604. 0.604, from the most drops: the more trials, the closer the relative frequency gets to the true probability. About 604",
      "Not on its own: the theoretical probability of even is 2/5 = 0.4, and 26/50 = 0.52 is higher, but 50 spins is a small sample. Spin it many more times; if the relative frequency stays well above 0.4, it's probably biased",
      "a) yes b) no (the king of hearts is both) c) yes"])
  }));

  add("paper-ks4-combined", KS4("combined-events-listing-tree-diagrams-and-conditional-probability"), "Combined events", "The product rule, listing outcomes, tree diagrams with and without replacement, and conditional probability.", (who, h) => ({
    pupil: `${h.sheetHead("Combined events", who)}
      ${q4([`A café offers 4 sandwiches, 3 drinks and 2 snacks. How many different meal deals (one of each) are there? ${blank(3)} How many 3-digit codes can be made from the digits 0 to 9? ${blank(3)} In how many orders can the letters A, B, C and D be arranged?${HI} ${blank(3)}`,
        `A coin is flipped and a 4-sided dice (1 to 4) is rolled. List all the outcomes, then find P(heads and an even number).${lines(2)}`,
        `The probability of rain on any day is 0.3, and days are independent. Draw a tree diagram for Monday and Tuesday. Find P(rain on both days), P(rain on exactly one day) and P(rain on at least one day).<div class="pp-draw"></div>`,
        `A bag holds 5 red and 3 blue counters. Two are taken out, one after the other, without replacement. Find P(both blue) and P(both the same colour).<div class="pp-draw pp-short"></div>`,
        `Would your answers to question 4 be the same with replacement? Explain what assumption each method makes.${lines(1)}`,
        `In a group of 80 pupils, 35 have a dog, 20 have a cat and 8 have both. Show this in a two-way table or a Venn diagram. Find P(has a cat, given that they have a dog) and P(has a dog, given that they have a cat).${HI}<div class="pp-draw pp-short"></div>`,
        `P(A) = 0.5, P(B) = 0.4 and P(A and B) = 0.2. Find P(A or B) and P(A given B). Are A and B independent? How do you know?${HI}${lines(2)}`])}`,
    answers: answersPage(h, "Combined events", ["24; 1000; 24 (4 × 3 × 2 × 1)", "H1, H2, H3, H4, T1, T2, T3, T4 (8 outcomes); P(H and even) = 2/8 = ¼", "0.3 × 0.3 = 0.09; 2 × 0.3 × 0.7 = 0.42; 1 − 0.7 × 0.7 = 0.51",
      "3/8 × 2/7 = 6/56 = 3/28; 5/8 × 4/7 + 3/28 = 20/56 + 6/56 = 26/56 = 13/28", "No. With replacement the second pick doesn't depend on the first (independent: 3/8 × 3/8); without replacement it does (dependent), because there's one counter fewer",
      "Dog only 27, cat only 12, both 8, neither 33. P(cat given dog) = 8/35; P(dog given cat) = 8/20 = ⅖", "P(A or B) = 0.5 + 0.4 − 0.2 = 0.7; P(A given B) = 0.2 ÷ 0.4 = 0.5. Yes: P(A) × P(B) = 0.2 = P(A and B), and P(A given B) = P(A)"])
  }));

  const SCATTER = [[1, 32], [2, 38], [2, 45], [3, 40], [3, 50], [4, 52], [5, 55], [5, 61], [6, 58], [7, 70], [8, 68], [8, 76], [9, 80], [10, 84]];
  const SALES = [12, 30, 41, 15, 14, 33, 45, 17];
  add("paper-ks4-samples", KS4("samples-time-series-and-scatter-graphs"), "Data and samples", "Fair samples, estimating for a population, a time series graph, and a scatter graph with correlation, prediction and causation.", (who, h) => ({
    pupil: `${h.sheetHead("Data and samples", who)}
      ${q4([`A council wants to know how much exercise teenagers in a town do. Which sample is best, and why? &nbsp; A: 50 people at a gym &nbsp; B: 50 pupils chosen at random from each secondary school's register &nbsp; C: your friends${lines(1)}`,
        `In a random sample of 80 pupils, 15 are left-handed. Estimate how many of the school's 1200 pupils are left-handed. ${blank(3)} What could make this estimate unreliable? ${lines(1)}`])}
      <div class="pp-q"><p><b>3.</b> Ice cream sales (thousands) each quarter for two years:</p>
        <table class="pp-table"><tr><th>Quarter</th>${["Y1 Q1", "Q2", "Q3", "Q4", "Y2 Q1", "Q2", "Q3", "Q4"].map(q => `<td class="pp-c" style="font-size:10pt">${q}</td>`).join("")}</tr><tr><th>Sales</th>${SALES.map(s => `<td class="pp-c">${s}</td>`).join("")}</tr></table>
        <div class="pp-side">${plot(0, 8, 0, 50, 34, 3.6, 1, 10, () => "", ["quarter", "sales"], 1, 5)}<div><p>Plot the time series. Describe the trend and the seasonal pattern.</p>${lines(3)}</div></div></div>
      <div class="pp-q pp-side" style="grid-template-columns:1fr auto"><div><p><b>4.</b> The scatter graph shows hours of revision and test scores.</p><p>a) Describe the correlation. ${blank(5)}</p><p>b) Draw a line of best fit. Estimate the score for 6½ hours. ${blank(3)}</p>
        <p>c) Why shouldn't you use the line to predict a score for 30 hours?${lines(1)}</p><p>d) Does this prove that revising more causes higher scores? Explain.${lines(1)}</p></div>
        ${plot(0, 10, 0, 100, 28, 2.4, 1, 10, (X, Y) => SCATTER.map(([x, y]) => dotAt(X, Y, x, y)).join(""), ["hours", "score"], 0.5, 5)}</div>`,
    answers: answersPage(h, "Data and samples", ["B: it's random and from every school, so it represents the population. A and C are biased: gym-goers exercise more than most, and friends are alike",
      "15/80 × 1200 = 225. The sample might not be random, or 80 might be too small to represent the school", "Points plotted and joined. The trend rises slightly (each quarter is a little higher in year 2); sales peak in Q3 (summer) and are lowest in Q1",
      "a) strong positive correlation b) about 65 (accept 61 to 68) c) 30 hours is far outside the data (extrapolation), and scores can't go above 100 d) No: correlation doesn't show cause. Other factors (interest, ability, attendance) may affect both"])
  }));

  add("paper-ks4-distributions", KS4("histograms-cumulative-frequency-and-box-plots"), "Distributions", "Grouped data, a cumulative frequency graph with median and quartiles, comparing box plots, and a histogram with unequal classes.", (who, h) => ({
    pupil: `${h.sheetHead("Distributions", who)}
      <div class="pp-q"><p><b>1.</b> The times 40 people took to finish a puzzle.</p>
        <table class="pp-table"><tr><th>Time t (minutes)</th>${["0 < t ≤ 10", "10 < t ≤ 20", "20 < t ≤ 30", "30 < t ≤ 40", "40 < t ≤ 50"].map(c => `<td class="pp-c" style="font-size:10pt">${c}</td>`).join("")}</tr>
          <tr><th>Frequency</th>${[4, 10, 14, 8, 4].map(f => `<td class="pp-c">${f}</td>`).join("")}</tr><tr><th>Cumulative frequency</th>${"<td></td>".repeat(5)}</tr></table>
        <p>a) Which is the modal class? ${blank(4)} b) Estimate the mean time. ${blank(4)}</p></div>
      <div class="pp-q pp-side">${plot(0, 50, 0, 40, 6, 5.5, 10, 5, () => "", ["t", "cf"], 2, 2)}<div><p><b>2.</b> Complete the cumulative frequency row, and draw the cumulative frequency graph.${HI}</p>
        <p>Estimate the median ${blank(3)}, the lower quartile ${blank(3)}, the upper quartile ${blank(3)} and the interquartile range ${blank(3)}</p></div></div>
      ${q4([`Draw box plots for two classes' test scores on one scale, then compare the classes in two ways.${HI}<br>Class A: lowest 12, lower quartile 20, median 26, upper quartile 31, highest 40. &nbsp; Class B: lowest 15, lower quartile 22, median 24, upper quartile 27, highest 35.
          ${svg(560, 60, `<line x1="20" y1="45" x2="540" y2="45" class="pp-axis"/>${[10, 15, 20, 25, 30, 35, 40, 45].map(v => `<line x1="${20 + (v - 10) * 14.8}" y1="40" x2="${20 + (v - 10) * 14.8}" y2="50" class="pp-axis"/><text x="${20 + (v - 10) * 14.8}" y="60" text-anchor="middle" class="pp-small">${v}</text>`).join("")}`, "pp-wide")}${lines(2)}`,
        `Heights of 90 plants: 150 < h ≤ 160: 20; 160 < h ≤ 165: 15; 165 < h ≤ 170: 25; 170 < h ≤ 185: 30. Work out the frequency density of each class, to draw a histogram.${HI} ${blank(10)}`,
        `A histogram bar for 30 < t ≤ 45 has a frequency density of 2.4. How many values are in that class? ${blank(3)}`,
        `Why does a histogram show continuous data better than a bar chart?${lines(1)}`], 3)}`,
    answers: answersPage(h, "Distributions", ["Cumulative frequencies 4, 14, 28, 36, 40. a) 20 < t ≤ 30 b) (5 × 4 + 15 × 10 + 25 × 14 + 35 × 8 + 45 × 4) ÷ 40 = 980 ÷ 40 = 24.5 minutes",
      "Plotted at (10, 4), (20, 14), (30, 28), (40, 36), (50, 40), starting at (0, 0). Median (20th value) about 24; lower quartile (10th) about 16; upper quartile (30th) about 32.5; interquartile range about 16.5 (accept readings within 1 minute)",
      "Class A has the higher median (26 against 24), so did better on average; Class B has the smaller interquartile range (5 against 11) and range (20 against 28), so its scores were more consistent",
      "20 ÷ 10 = 2; 15 ÷ 5 = 3; 25 ÷ 5 = 5; 30 ÷ 15 = 2", "2.4 × 15 = 36", "There are no gaps between the bars, so it covers every value, and with frequency density the area shows the frequency, even when the classes are different widths"])
  }));

  add("paper-ks4-shakespeare", KS4("shakespeare-language-character-and-context"), "Shakespeare scene study", "For any scene from the play being studied: what happens, a character in quotations, context, staging and a paragraph.", (who, h) => ({
    pupil: `${h.sheetHead("Shakespeare scene study", who)}
      <div class="pp-cols">${box("Play, act and scene", lines(1))}${box("What happens, in three steps", lines(2))}</div>
      <h2 class="ws-sub">Character focus: ${blank(10)}</h2>
      <table class="pp-table"><tr><th>Quotation</th><th>What it shows about the character</th><th>A key word, and what it suggests</th></tr>${"<tr><td style=\"height:44px\"></td><td></td><td></td></tr>".repeat(3)}</table>
      ${box("A method Shakespeare uses (soliloquy, aside, dramatic irony, imagery, a change in verse or prose…) and its effect", lines(2))}
      ${box("Context: one belief or idea from Shakespeare's time that shapes this scene, and how it changes what the scene means", lines(2))}
      <div class="pp-cols">${box("How I'd stage the key moment (movement, voice, silence)", lines(2))}${box("How the audience then might react, and how we react now", lines(2))}</div>
      ${box("How does Shakespeare present this character in the scene? Write a paragraph.", lines(6))}`,
    answers: lookForPage(h, "Shakespeare scene study", ["An accurate account of what happens, in sequence", "Short, well-chosen quotations, with comments on what they show, not just what they say",
      "A key word explored for its connotations or double meaning", "A dramatic method named accurately, with its effect on the audience", "Context linked to a specific moment, not bolted on as general history",
      "A personal, thoughtful view of how the scene could be staged and received", "A paragraph with a clear point, evidence, analysis of method and a link to context"])
  }));

  const POEM_BECK = ["Above the farm the little beck", "Runs singing down its bed of stone,", "And there I knelt, a ragged speck,", "And drank the cold, and was alone.", "",
    "The hills stood round like patient kings,", "The heather burned with purple light;", "I did not know the names of things,", "But knew the world was large and bright.", "",
    "Now grey streets hold me, year on year,", "And yet, when all the noise is gone,", "I hear that water, cold and clear,", "Still singing, singing, running on."];
  const POEM_CANAL = ["Someone has dropped a trolley in the canal.", "It lies on its side like a tired animal,", "one wheel turning when the barges pass.", "",
    "Under the bridge, a heron", "stands in its grey coat, waiting", "for the city to forget it is there.", "",
    "I stop here every morning.", "Not for long. Long enough", "to watch the water carry the light", "somewhere I am not going."];
  const poem = (title, ls) => `<p class="pp-passage" style="font-size:11pt"><b>${title}</b><br>${ls.map(l => l || "&nbsp;").join("<br>")}</p>`;
  add("paper-ks4-two-poems", KS4("poetry-analysing-and-comparing-poems"), "Two poems", "Two original poems about water and memory: language, form and structure in each, then a critical comparison.", (who, h) => ({
    pupil: `${h.sheetHead("Two poems", who)}
      <div class="pp-cols">${poem("The Beck", POEM_BECK)}${poem("Canal, Monday", POEM_CANAL)}</div>
      ${q4([`What is each poem about on the surface, and what is it really about? ${lines(2)}`,
        `Choose an image from each poem. What does it suggest, and why is it effective?${lines(2)}`,
        `Compare the form and structure: rhyme, rhythm, stanzas and line breaks. How does each poem's form suit what it says?${lines(2)}`,
        `Look again at the last stanza of each poem. How does each speaker feel about where they are now? Use a quotation from each.${lines(2)}`,
        `Which poem do you find more powerful? Explain, comparing the poets' methods.${lines(2)}`])}`,
    answers: lookForPage(h, "Two poems", ["The Beck: a remembered childhood moment in nature, and how that memory still sustains the speaker in a grey city. Canal, Monday: a moment of stillness in a city, and quiet longing for a different life",
      "Images such as \"patient kings\" (the hills as calm, protective, powerful), \"heather burned\" (vivid, alive), the trolley \"like a tired animal\" (the city's neglect, and perhaps the speaker's weariness), the heron \"waiting / for the city to forget it\" (nature surviving unnoticed)",
      "The Beck uses regular quatrains, rhyme (ABAB) and steady iambic rhythm, like the steady stream and the security of memory. Canal, Monday is free verse in tercets, with enjambment and short sentences (\"Not for long.\") that feel like real, hesitant thought",
      "Both turn in the last stanza from the place to the speaker. The Beck ends with comfort: the water is \"Still singing, singing, running on\". Canal, Monday ends with regret: the light goes \"somewhere I am not going\"",
      "A comparison that links method to effect in both poems, with a clear personal judgement; accept either poem if it's justified"],
      "Both poems were written for PopSpell. The Beck echoes the Romantic poets' memory of nature; Canal, Monday is contemporary free verse.")
  }));

  const HARRIET = "My dear Sister,<br>You will scarcely credit it, but I have travelled upon the railway, and I am alive to tell of it. We left the station at a quarter past eight, and within a few minutes the engine had gathered such a speed that the hedges flew past like the pages of a book turned by the wind. A gentleman opposite assured me that we were going at near thirty miles in the hour. I confess I held very tightly to my seat. The noise was considerable, and a great quantity of smoke and cinders blew in at the window, so that my new bonnet is quite spoiled. Yet I cannot pretend I was not thrilled. The journey which once took our father the best part of a day by coach was accomplished in less than three hours. Mother fears that such speed cannot be good for the constitution. I believe the world is changing, and I would rather change with it than be left upon the platform.<br>Your affectionate sister, Harriet";
  const COMMUTER = "<b>Commuter diary: day 212</b><br>The 7:42 was cancelled again this morning, so I squeezed onto the 7:58 with what felt like half the town. Forty minutes standing with my face in a stranger's rucksack. To be fair, when the trains run, they're quick: 60 miles in under an hour, which my grandad says would have been unthinkable when he started work. The wifi worked for exactly four minutes. I spend £4,200 a year on my season ticket, and most days I feel like I'm paying for the privilege of being late. And yet. Somewhere past the reservoir, the sun came up over the fields and everyone in the carriage went quiet and looked out of the window, just for a moment. I'll complain again tomorrow. But I did notice.";
  add("paper-ks4-two-journeys", KS4("summary-and-synthesis-across-two-non-fiction-texts"), "Two journeys", "A 19th-century letter and a 21st-century blog about train journeys: true statements, a summary of differences, and usefulness.", (who, h) => ({
    pupil: `${h.sheetHead("Two journeys", who)}
      ${read4(`<b>Source A, a letter written in the 1840s.</b> ${HARRIET}`)}
      ${read4(`<b>Source B, a blog post written this century.</b> ${COMMUTER}`)}
      <div class="pp-q"><p><b>1.</b> Read Source A again. Tick the <b>four</b> statements that are true.</p>
        <div class="pp-cols">${["A The train left at a quarter past eight.", "B Harriet sat beside a gentleman.", "C A passenger said the train was going at nearly thirty miles an hour.", "D Harriet's bonnet was damaged by smoke and cinders.",
          "E The train took longer than the coach.", "F Harriet's mother approves of the railway.", "G Harriet found the journey exciting.", "H The train was quiet."].map(s => `<span class="pp-tick">☐ ${s}</span>`).join("")}</div></div>
      ${q4([`Both writers describe a train journey. Write a summary of the differences between their experiences, using details from both sources.${lines(4)}`,
        `Scan Source B for two facts and two opinions. ${lines(1)}`,
        `A historian wants to know how people felt about train travel. How useful is each source, and why?${lines(2)}`], 2)}`,
    answers: answersPage(h, "Two journeys", ["A, C, D and G",
      "Differences such as: Harriet is new to the railway and thrilled by its speed (\"I cannot pretend I was not thrilled\"); the blogger takes it every day and is frustrated (\"cancelled again\"). Harriet compares it with a coach and sees progress; the blogger compares it with the cost and sees poor value. Harriet's discomfort is smoke and noise; the blogger's is crowding and delays. Both are moved by the view: Harriet by the speed, the blogger by a sunrise. Look for synthesis (both texts together), inference, and the pupil's own words",
      "Facts: the 7:42 was cancelled; 60 miles in under an hour; the season ticket costs £4,200. Opinions: \"they're quick\" (to be fair…), \"paying for the privilege of being late\", the wifi comment as a complaint",
      "Both are personal and one-sided, so they show feelings rather than typical facts. Source A shows the excitement and fears of early rail travel; Source B shows a modern commuter's view. Each is one person's experience on one day"],
      "Both sources were written for PopSpell: Source A in the style of the 1840s.")
  }));

  const FOUR_DAY = "<b>It's time for a four-day school week</b><br>Everyone knows that pupils are exhausted by Friday. In fact, a survey of 40 pupils at one school found that 9 out of 10 would prefer a four-day week, which proves that the whole country wants change. Schools that have tried it report happier pupils, and happier pupils obviously learn more. Critics will say that parents would struggle to find childcare on the fifth day, but these are the same people who have opposed every change in education for the last fifty years. Teachers, too, are worn out: one head teacher told me her staff \"have never been more tired\". A longer weekend would give families time together, cut energy bills for schools and reduce traffic on the roads. The only people who could possibly object are those who care more about tradition than about children. The four-day week is not a dream. It is common sense.";
  add("paper-ks4-weigh-evidence", KS4("evidence-inference-and-bias"), "Weighing the evidence", "An opinion piece to test: supported and unsupported claims, misused evidence, bias, inference and another reader's view.", (who, h) => ({
    pupil: `${h.sheetHead("Weighing the evidence", who)}${read4(FOUR_DAY)}
      ${q4([`Copy one claim that has some evidence, and one that has none.${lines(2)}`,
        `How is the survey evidence misused? Give two reasons.${lines(2)}`,
        `Find an example of bias or an unfair attack on people who disagree. Why is it unfair?${lines(2)}`,
        `What can you infer about the writer's attitude to critics? Support your inference with a quotation.${lines(2)}`,
        `What evidence would you want before you agreed with the writer?${lines(2)}`,
        `Another reader might find this article convincing. Why might they? Do you agree with them?${lines(2)}`])}`,
    answers: lookForPage(h, "Weighing the evidence", ["Some evidence: the survey, or the head teacher's quotation. No evidence: \"Everyone knows…\", \"happier pupils obviously learn more\", the claims about energy bills and traffic",
      "40 pupils at one school is a tiny, unrepresentative sample; pupils aren't the whole country; a survey of preferences can't \"prove\" anything; we don't know how the question was asked",
      "\"the same people who have opposed every change…\" and \"The only people who could possibly object…\" attack people rather than answering their argument; the childcare worry is raised and then dismissed",
      "Contempt or impatience, for example \"could possibly object\" or \"care more about tradition than about children\", with the inference explained",
      "Large, fair studies of results, attendance and wellbeing in schools that tried it; parents' and employers' views; costs",
      "A fair account of why it might persuade (confident tone, rhetorical techniques, appealing benefits, a feeling many share), weighed against its weaknesses"],
      "The article was written for PopSpell.")
  }));

  add("paper-ks4-theme-tracker", KS4("whole-novels-themes-characters-and-a-personal-response"), "Theme tracker", "For the novel being read: a theme traced through the book, a character's change, a personal response and another reading.", (who, h) => ({
    pupil: `${h.sheetHead("Theme tracker", who)}
      <div class="pp-cols">${box("Novel and writer", lines(1))}${box("The theme I'm tracking", lines(1))}</div>
      <table class="pp-table"><tr><th>Where</th><th>What happens</th><th>Quotation</th><th>What it shows about the theme</th></tr>${["Beginning", "Middle", "End"].map(w => `<tr><td>${w}</td><td style="height:48px"></td><td></td><td></td></tr>`).join("")}</table>
      <div class="pp-cols">${box("A character at the start", lines(2))}${box("The same character at the end, and what changed them", lines(2))}</div>
      ${box("How a setting or event links to the theme", lines(2))}
      ${box("My reading: what I think the writer is saying about this theme", lines(3))}
      ${box("A different reading someone could make, with evidence, and how convincing I find it", lines(3))}
      ${box("Another book I chose to read for interest, and whether I'd recommend it", lines(1))}`,
    answers: lookForPage(h, "Theme tracker", ["A theme stated as an idea (such as \"power corrupts\" or \"loneliness\"), not just a topic or the plot", "Moments from across the novel, showing how the theme develops",
      "Well-chosen quotations with comments on what they suggest", "A character's change explained, with its cause", "A personal response that is informed by the text",
      "A different interpretation stated fairly, with evidence, and evaluated rather than dismissed", "Evidence of independent reading for challenge and enjoyment"])
  }));

  add("paper-ks4-describe-narrate", KS4("descriptive-and-narrative-writing"), "Describe and narrate", "Plan and open a description or a story: purpose and viewpoint, senses, structure, sentence variety and an opening paragraph.", (who, h) => ({
    pupil: `${h.sheetHead("Describe and narrate", who)}
      <p>Choose one task. &nbsp; <b>A:</b> Describe a railway station late at night. &nbsp; <b>B:</b> Write a story that begins: \"The letter had been waiting for three days.\"</p>
      <div class="pp-cols">${box("My task, purpose and audience", lines(1))}${box("Viewpoint (first or third person) and tense", lines(1))}</div>
      <div class="pp-cols3">${box("I see…", lines(2))}${box("I hear…", lines(2))}${box("I feel, smell or taste…", lines(2))}</div>
      ${box("Structure: how will it open, shift (in time, place or focus) and end? An echo of the opening?", `<div class="pp-cols3">${["Opening", "Shift or turning point", "Ending"].map(t => `<div><p>${t}</p>${lines(1)}</div>`).join("")}</div>`)}
      ${box("One strong image (a metaphor or simile) I will use", lines(1))}
      ${box("Sentences for effect: a short one, a long one that builds, and one that starts with a verb or adverb", lines(3))}
      ${box("My opening paragraph", lines(7))}`,
    answers: lookForPage(h, "Describe and narrate", ["A clear sense of purpose and audience, with a consistent viewpoint and tense", "Detail from more than one sense, chosen for effect rather than listed",
      "A deliberate structure: a shift in focus or time, and an ending that links back", "Imagery that is original and fits the mood", "Sentences varied on purpose, for pace and emphasis",
      "Accurate spelling, punctuation and paragraphing", "Emotional impact: the reader is made to feel something"])
  }));

  add("paper-ks4-argument", KS4("writing-to-argue-and-persuade"), "Make the argument", "Name rhetorical devices in examples, then plan and open an argument about voting at 16.", (who, h) => ({
    pupil: `${h.sheetHead("Make the argument", who)}
      <div class="pp-q"><p><b>1.</b> Name the device in each sentence: rhetorical question, antithesis, parenthesis, list of three, anecdote or statistic.</p>
        <table class="pp-table">${["Is a few minutes of convenience really worth a lifetime of litter?", "We were promised a park; we were given a car park.", "The council – which, remember, closed the youth club last year – now says it cares about young people.",
          "It is cheaper, it is cleaner and it is fairer.", "Last winter, my neighbour waited two hours in the cold for a bus that never came.", "Three in five young people say they have nowhere safe to meet."].map(s => `<tr><td>${s}</td><td style="width:28%"></td></tr>`).join("")}</table></div>
      <h2 class="ws-sub">2. Plan: \"Young people should be allowed to vote at 16.\" Argue your view.</h2>
      <div class="pp-cols">${box("Form (letter, article or speech) and audience", lines(1))}${box("My view, in one sentence", lines(1))}</div>
      <table class="pp-table"><tr><th>Point, in order of strength</th><th>Evidence or example</th><th>Device I'll use</th></tr>${"<tr><td style=\"height:40px\"></td><td></td><td></td></tr>".repeat(3)}</table>
      ${box("The best argument against my view, and my answer to it", lines(2))}
      ${box("My opening paragraph", lines(6))}`,
    answers: answersPage(h, "Make the argument", ["Rhetorical question; antithesis; parenthesis; list of three; anecdote; statistic",
      "Look for: a clear view; points in a deliberate order, each with evidence; a counter-argument dealt with fairly; devices chosen for the audience, not as a checklist; Standard English and a register that suits the form"],
      "In question 1, the statistic is made up for the exercise. Ask where a real one would come from.")
  }));

  add("paper-ks4-from-notes", KS4("writing-from-notes-and-information-provided-by-others"), "From key points to a letter", "Key points from a presentation about a youth centre: choose and order them, then write a formal letter.", (who, h) => ({
    pupil: `${h.sheetHead("From key points to a letter", who)}
      ${box("Key points from a presentation by the Riverside Youth Centre", `<ul style="margin:2px 0;padding-left:20px">${["Open Monday to Friday, 4pm to 8pm", "About 120 young people use it each week", "Proposal: open on Saturdays, 10am to 4pm",
        "Saturday opening would cost £9,000 a year, for staff and heating", "Local businesses have offered £3,000", "Ideas for Saturdays: a cooking club, homework help, five-a-side football",
        "In a survey of members, 85 of 120 said they would come on Saturdays", "Some neighbours worry about noise; activities would move indoors after 3pm", "The centre's minibus is 12 years old"].map(p => `<li>${p}</li>`).join("")}</ul>`)}
      <p><b>Task:</b> Write a letter to the council's leisure committee asking it to pay for Saturday opening.</p>
      <div class="pp-cols">${box("Points I'll use, numbered in order", lines(3))}${box("Points I'll leave out, and why", lines(3))}</div>
      ${box("Turn one note into a full sentence for the letter", lines(2))}
      ${box("My letter: the address, date and greeting, then the opening paragraph", lines(6))}
      ${box("My closing paragraph: the request, and the sign-off", lines(3))}`,
    answers: lookForPage(h, "From key points to a letter", ["Points chosen for the purpose: demand (85 of 120), the cost and the £3,000 offered (so £6,000 is needed), the activities, and the plan for noise",
      "Points left out for a reason (the minibus is off the point)", "Notes turned into fluent sentences in the pupil's own words, with figures used accurately",
      "Formal letter layout, an appropriate greeting and sign-off (Dear… / Yours faithfully or sincerely)", "A logical order, with paragraphs", "Standard English and a polite, persuasive register",
      "A clear request at the end"])
  }));

  const SHELTER = "Their are lots of reasons to volunteer at Hilltop Animal Shelter. You get to help animals. Its really good. Last year we look after over 300 dogs and cats and alot of them was found new homes. Volunteers walks the dogs, clean the kennels and they also helped with fundraising. Also the shelter is easy to get to as the number 12 bus stops outside. If you only have an hour a week, you could still make a difference. we need you're help. Volunteering looks good on a CV to. Please sign up today.";
  add("paper-ks4-edit", KS4("revising-editing-and-proof-reading"), "Edit for impact", "Revise, edit and proof-read a leaflet paragraph in three passes, then improve the whole piece.", (who, h) => ({
    pupil: `${h.sheetHead("Edit for impact", who)}
      <p>This is a draft of a leaflet asking people to volunteer at an animal shelter.</p>${read4(SHELTER)}
      ${box("Pass 1, revise: does it persuade? What's weak, missing, or in the wrong place?", lines(3))}
      ${box("Pass 2, edit: rewrite the first three sentences so they grab the reader", lines(3))}
      ${box("Pass 3, proof-read: find and correct at least eight errors in spelling, punctuation and grammar", lines(4))}
      ${box("Now write the whole paragraph again, improved", lines(7))}`,
    answers: answersPage(h, "Edit for impact", ["Revise: the opening is flat; \"You get to help animals. Its really good.\" is vague; the bus detail interrupts the reasons and belongs near the end; there's no emotional appeal or detail",
      "Corrections: Their → There; Its → It's; look → looked; alot → a lot; was → were; Volunteers walks → walk; helped → help (keep the present tense); we → We; you're → your; to → too",
      "A stronger version starts with impact (for example, a question or a fact: \"Last year, over 300 dogs and cats found new homes at Hilltop. Could you help the next 300?\"), groups what volunteers do, keeps one tense, puts practical details and the request together at the end"],
      "Ask the pupil to explain three changes: one for impact, one for clarity and one for accuracy.")
  }));

  add("paper-ks4-grammar-effect", KS4("grammar-and-vocabulary-for-effect"), "Grammar for effect", "Name grammatical features in short extracts and explain their effect, rewrite a sentence for three effects, and use new vocabulary.", (who, h) => ({
    pupil: `${h.sheetHead("Grammar for effect", who)}
      <div class="pp-q"><p><b>1.</b> Name the grammatical feature in each extract and explain its effect.</p>
        <table class="pp-table"><tr><th>Extract</th><th>Feature</th><th>Effect</th></tr>${["He waited. Nothing. Then the handle turned.", "Mistakes were made, and the money was lost.", "Although the storm had passed, the village did not sleep.",
          "The old, cracked, forgotten lighthouse leaned into the wind.", "You must act now; tomorrow may be too late.", "Slowly, painfully, she climbed."].map(s => `<tr><td>${s}</td><td style="width:22%"></td><td style="width:38%;height:40px"></td></tr>`).join("")}</table></div>
      <div class="pp-q"><p><b>2.</b> Rewrite \"The dog ran across the road.\" three ways.</p><p>To build tension: ${lines(1)}</p><p>To be funny: ${lines(1)}</p><p>As a formal report: ${lines(1)}</p></div>
      <div class="pp-q"><p><b>3.</b> Match each term to its example: &nbsp; subordinate clause &nbsp; · &nbsp; modal verb &nbsp; · &nbsp; noun phrase &nbsp; · &nbsp; passive voice &nbsp; · &nbsp; adverbial</p>
        <div class="pp-next"><span>a) \"the girl in the red coat\" ${blank(5)}</span><span>b) \"might\" ${blank(5)}</span><span>c) \"The window was broken.\" ${blank(5)}</span><span>d) \"after the match\" ${blank(5)}</span><span>e) \"because it was late\" ${blank(5)}</span></div></div>
      ${box("4. A new word or construction from my reading, what it means or does, and my own sentence using it", lines(3))}`,
    answers: answersPage(h, "Grammar for effect", ["Short sentences and a minor sentence (\"Nothing.\"): slow the pace and build tension. Passive voice: hides who made the mistakes, avoiding blame. Fronted subordinate clause: delays the main point and sets up a contrast. Expanded noun phrase (a list of adjectives): a detailed image of neglect. Modal verbs (must, may) and a semicolon: urgency, and the contrast between certainty and possibility. Fronted adverbials: slow the sentence down, so we feel the effort",
      "Look for deliberate choices: short sentences or delay for tension; exaggeration or an unexpected detail for humour; the passive, formal vocabulary and no emotion for a report",
      "a) noun phrase b) modal verb c) passive voice d) adverbial e) subordinate clause", "A word or construction used accurately and on purpose in their own sentence"])
  }));

  const TRANSCRIPT = "so basically right (.) me and my mate was walking home yeah and (.) there's this like massive dog (.) and it just (.) it just comes running at us (.) I was like no way (.) honestly I ain't never ran so fast in my life";
  add("paper-ks4-registers", KS4("spoken-and-written-language-registers-and-standard-english"), "Spoken, written and Standard English", "A transcript of spontaneous speech: spoken features, non-standard forms, rewriting in Standard English, and choosing a register.", (who, h) => ({
    pupil: `${h.sheetHead("Spoken, written and Standard English", who)}
      <p>A transcript of someone telling a story to a friend. (.) shows a short pause.</p>${read4(TRANSCRIPT)}
      ${q4([`Find examples of these features of spontaneous speech: &nbsp; fillers ${blank(5)} &nbsp; a false start or repetition ${blank(5)} &nbsp; the present tense for past events ${blank(5)} &nbsp; a way of reporting what someone said or thought ${blank(4)}`,
        `Find two forms that aren't Standard English, and write the Standard English version of each.${lines(2)}`,
        `Rewrite the story in written Standard English, as if for a school magazine.${lines(3)}`,
        `Is \"I ain't never ran\" wrong? Explain when it would and wouldn't be appropriate.${lines(2)}`,
        `Write two messages saying you'll be late: one text to a friend, and one email to an employer. Then explain two differences in register.${lines(4)}`])}`,
    answers: answersPage(h, "Spoken, written and Standard English", ["Fillers: so, basically, right, yeah, like, honestly. False start or repetition: \"it just (.) it just\". Present tense for the past: \"there's\", \"comes\". Reporting: \"I was like\"",
      "\"me and my mate was\" → \"my friend and I were\"; \"I ain't never ran\" → \"I have never run\" (also \"massive\" is informal)",
      "For example: \"My friend and I were walking home when a huge dog came running towards us. I have never run so fast in my life.\"",
      "It isn't Standard English, but it follows the regular rules of some spoken varieties of English, so it's fine with friends or in dialogue in a story. It isn't appropriate where Standard English is expected: formal writing, an interview, an exam",
      "The friend's text: informal, short, maybe abbreviations or emoji. The email: Standard English, a greeting, full sentences, an apology and a reason, a polite sign-off"])
  }));

  add("paper-ks4-speech-planner", KS4("formal-presentations-and-debates"), "Speech planner", "Plan a formal presentation or debate speech, prepare for questions, and act on feedback.", (who, h) => ({
    pupil: `${h.sheetHead("Speech planner", who)}
      <div class="pp-cols">${box("Topic", lines(1))}${box("Purpose and audience", lines(1))}</div>
      ${box("Hook: the first thing I'll say (a question, a story, a striking fact)", lines(2))}
      <table class="pp-table"><tr><th>Point</th><th>Evidence or example</th></tr>${"<tr><td style=\"height:40px\"></td><td></td></tr>".repeat(3)}</table>
      ${box("For a debate: the other side's best point, and my rebuttal", lines(2))}
      ${box("Ending and call to action", lines(2))}
      ${box("Delivery: tick what I'll practise", tick(["volume", "pace", "pauses", "eye contact", "gesture", "Standard English", "cue cards, not a script"]))}
      <table class="pp-table"><tr><th>A question I might be asked</th><th>My answer</th></tr>${"<tr><td style=\"height:34px\"></td><td></td></tr>".repeat(3)}</table>
      ${box("After: feedback I was given, and what I'll do differently", lines(2))}`,
    answers: lookForPage(h, "Speech planner", ["Information and ideas selected and organised for the purpose and audience", "An opening that engages, and an ending with a clear call to action",
      "Evidence for each point; for a debate, a fair rebuttal", "Confident, audible delivery: varied pace and pauses, eye contact, Standard English", "Questions answered relevantly and politely, and feedback listened to and acted on"])
  }));

  const CHARITY = [["Maya (chair)", "We've got ten minutes to choose one idea for the charity day. Let's hear everyone first. Josh?"], ["Josh", "Sponsored silence. Easy, and it raises loads."],
    ["Priya", "That's a good start, but would people actually pay for that? Last year's quiz raised £300."], ["Josh", "The quiz was boring."],
    ["Maya", "Let's stick to the ideas, not whether things were boring. Priya, what made the quiz work?"], ["Priya", "Everyone could join in, and parents came too."],
    ["Sam", "Building on that, what if we did a quiz with a sponsored silence round?"], ["Maya", "So far we have two ideas, a sponsored silence and a quiz, and Sam's suggested combining them. Josh, could that work?"],
    ["Josh", "Yeah, actually. As long as the silence bit is short."]];
  add("paper-ks4-discussion", KS4("group-discussion-leading-listening-and-challenging"), "Leading a discussion", "Evaluate a group discussion (leading, building on, challenging), then plan and lead one of your own.", (who, h) => ({
    pupil: `${h.sheetHead("Leading a discussion", who)}
      <p class="pp-passage" style="font-size:11pt">${CHARITY.map(([w, t]) => `<b>${w}:</b> ${t}`).join("<br>")}</p>
      ${q4([`Give two things Maya does to lead and manage the discussion.${lines(2)}`,
        `Find an example of someone building on another's idea, and of someone challenging courteously.${lines(2)}`,
        `Which contribution doesn't help the group? How did Maya deal with it?${lines(1)}`,
        `Who uses evidence, and how does it help?${lines(1)}`])}
      <h2 class="ws-sub">Your turn: lead a discussion</h2>
      <div class="pp-cols">${box("The question and the goal", lines(1))}${box("Time limit and roles (chair, summariser, questioner)", lines(1))}</div>
      ${box("Phrases I'll use", tick(["\"Let's hear from…\"", "\"Building on that…\"", "\"Can you clarify…?\"", "\"I see it differently, because…\"", "\"So far we've agreed…\"", "\"We've got two minutes left.\""]))}
      ${box("After: what we decided, one point I challenged, and how I involved everyone", lines(3))}`,
    answers: lookForPage(h, "Leading a discussion", ["Maya sets the goal and time, invites everyone in turn, keeps to the ideas when Josh is dismissive, asks a question to draw Priya out, summarises, and checks Josh agrees",
      "Building on: Sam (\"Building on that…\"). Challenging courteously: Priya (\"That's a good start, but…\"), with evidence", "Josh's \"The quiz was boring.\" is dismissive and gives no reason; Maya steers back to the ideas without attacking him",
      "Priya: the £300 from last year's quiz gives a fact to compare against, not just opinion", "In their own discussion: a clear goal and time limit, everyone involved, ideas built on and challenged politely, a summary and a decision reached"],
      "The discussion was written for PopSpell.")
  }));

  const LAST_BUS = [["", "A bus stop at night. ALEX is sitting. JO runs on, out of breath."], ["JO", "Has it gone?"], ["ALEX", "(not looking up) Ten minutes ago."], ["JO", "Ten minutes. (Pause.) You could have said."],
    ["ALEX", "Said what? I didn't know you were coming."], ["JO", "You always know. (Silence.) You always know, Alex."], ["ALEX", "(standing) Don't start. Not here."], ["JO", "Where, then? Where would you like me to start?"],
    ["", "A long silence. Headlights sweep across them both."], ["ALEX", "That's not ours."], ["JO", "No. (Sitting down.) None of them are."]];
  add("paper-ks4-perform", KS4("performing-scripts-and-poetry"), "Perform it", "A short original script to mark up and perform two ways, then a poem to perform, with reflection on how choices change meaning.", (who, h) => ({
    pupil: `${h.sheetHead("Perform it", who)}
      <p><b>The Last Bus</b> &nbsp; Mark up the script: underline words to stress, / for a pause, // for a silence, and write tone, volume and movement in the margin.</p>
      <table class="pp-table">${LAST_BUS.map(([w, t]) => `<tr><td style="width:14%">${w ? `<b>${w}</b>` : ""}</td><td>${w ? t : `<i>${t}</i>`}</td><td style="width:30%"></td></tr>`).join("")}</table>
      ${box("Improvise: what happened between Alex and Jo before this scene?", lines(2))}
      <div class="pp-cols">${box("Performance 1: Jo is…", lines(2))}${box("Performance 2: Jo is…", lines(2))}</div>
      ${box("How did the meaning of \"None of them are\" change between the two performances?", lines(2))}
      ${box("A poem I will perform, where its silences and stillness go, and why", lines(3))}`,
    answers: lookForPage(h, "Perform it", ["Mark-up that shows deliberate choices of stress, pause, silence, tone and volume", "An improvisation that gives the characters a believable history (it may not be stated in the script)",
      "Two clearly different performances, for example Jo hurt in one and angry in the other", "An explanation of how the choices changed the meaning: \"None of them are\" can sound hopeless, bitter or gently sad",
      "Silence and stillness used for impact in the poem, with reasons linked to its meaning"],
      "The script was written for PopSpell.")
  }));

  /* ===================== Third level (S1 to S3): maths ===================== */

  // Numbered questions, each with an answer space
  const qs = (items, from = 1) => items.map((q, i) => `<div class="pp-q"><p><b>${from + i}.</b> ${q}</p></div>`).join("");
  const T3 = id => `lesson-third-${id}`;

  add("paper-round-sensibly", T3("rounding-to-decimal-places-and-estimating"), "Round it sensibly", "Round to 1, 2 and 3 decimal places, round to suit the problem, and estimate before calculating.", (who, h) => ({
    pupil: `${h.sheetHead("Round it sensibly", who)}
      ${qs([`Round to <b>1 decimal place</b>: 6·47 → ${blank(3)} &nbsp; 12·349 → ${blank(3)} &nbsp; 0·96 → ${blank(3)}`,
        `Round to <b>2 decimal places</b>: 3·1416 → ${blank(3)} &nbsp; 8·995 → ${blank(3)} &nbsp; 0·0749 → ${blank(3)}`,
        `Round to <b>3 decimal places</b>: 2·71828 → ${blank(3)} &nbsp; 0·66666 → ${blank(3)} &nbsp; 5·0004 → ${blank(3)}`,
        `245 pupils are going on a trip in 52-seat coaches. How many coaches are needed? Explain how you rounded.${lines(1)}`,
        `A 2 m plank is cut into 3 equal pieces. How long is each piece, to a sensible degree of accuracy? Why that accuracy?${lines(1)}`])}
      <div class="pp-q"><p><b>6.</b> Estimate first, then calculate (a calculator is fine for the exact answer).</p>
        <table class="pp-table"><tr><th>Calculation</th><th>Rounded to</th><th>Estimate</th><th>Exact answer</th></tr>
          ${["38·7 × 5·2", "61·8 ÷ 2·9", "4·96 × 19·8"].map(c => `<tr><td>${c}</td><td></td><td></td><td></td></tr>`).join("")}</table></div>
      ${qs([`A calculator shows 312·5 for 29·6 × 1·05. Use an estimate to say whether it's right.${lines(2)}`], 7)}`,
    answers: answersPage(h, "Round it sensibly", ["6·5, 12·3, 1·0", "3·14, 9·00, 0·07", "2·718, 0·667, 5·000",
      "245 ÷ 52 = 4·71…, so 5 coaches: round up, or some pupils have no seat", "0·666… m, so 0·667 m (66·7 cm): to the nearest millimetre, as that's as accurately as a saw can cut",
      "40 × 5 = 200, exact 201·24; 60 ÷ 3 = 20, exact 21·31 (to 2 d.p.); 5 × 20 = 100, exact 98·208", "No: 30 × 1 = 30, so the answer should be about 30 (it's 31·08). The point is in the wrong place."],
      "Ask why 8·995 rounds to 9·00: the 5 thousandths round the 9 hundredths up, which carries into the tenths and the units.")
  }));

  add("paper-decimal-calcs", T3("calculating-with-whole-numbers-and-decimals"), "Decimal calculations", "Quick facts, then adding, subtracting, multiplying and dividing decimals, with a problem and an explanation.", (who, h) => ({
    pupil: `${h.sheetHead("Decimal calculations", who)}
      <p><b>Quick facts:</b> 8 × 7 = ${blank(2)} &nbsp; 9 × 12 = ${blank(2)} &nbsp; 132 ÷ 11 = ${blank(2)} &nbsp; 96 ÷ 8 = ${blank(2)} &nbsp; 7 × 12 = ${blank(2)} &nbsp; 81 ÷ 9 = ${blank(2)}</p>
      <p>Show your working. Estimate first so you can check the answer.</p>
      <div class="pp-grid3">${["12·45 + 3·078", "20 − 6·375", "15·8 − 7·256", "4·26 × 7", "3·45 × 6", "0·125 × 8", "9·36 ÷ 4", "17·5 ÷ 7", "6·03 ÷ 3"]
        .map((c, i) => `<div class="pp-cell"><p><b>${i + 1}.</b> ${c} =</p><div class="pp-draw pp-short"></div></div>`).join("")}</div>
      ${qs([`Three tickets cost £12·85 each and a programme costs £4·50. How much change from £50?${lines(2)}`,
        `Choose one question above. Explain your method in a sentence, and how you checked it.${lines(2)}`], 10)}`,
    answers: answersPage(h, "Decimal calculations", ["15·528", "13·625", "8·544", "29·82", "20·7", "1", "2·34", "2·5", "2·01",
      "3 × 12·85 = 38·55; + 4·50 = 43·05; change £6·95", "A clear method (lining up the points, or working in whole numbers and placing the point by estimating) and a check by estimating or the inverse"], "Quick facts: 56, 108, 12, 12, 84, 9.")
  }));

  add("paper-below-zero", T3("negative-numbers-in-calculations"), "Below zero", "Adding, subtracting, multiplying and dividing with negative numbers, then temperature, depth and money problems.", (who, h) => ({
    pupil: `${h.sheetHead("Below zero", who)}
      <div class="pp-q"><p><b>1.</b> Add and subtract. A number line may help.</p><div class="pp-next">${["−3 + 8", "4 − 9", "−6 − 4", "5 − (−3)", "−2 + (−7)", "−8 − (−10)"].map(c => `<span>${c} = ${blank(2)}</span>`).join("")}</div></div>
      <div class="pp-q"><p><b>2.</b> Multiply and divide.</p><div class="pp-next">${["−4 × 3", "−12 ÷ −4", "−5 × −6", "20 ÷ −5", "−3 × −3", "−18 ÷ 6"].map(c => `<span>${c} = ${blank(2)}</span>`).join("")}</div></div>
      <div class="pp-q"><p><b>3.</b> Midday temperatures one day in January:</p>
        <table class="pp-table"><tr><th>Edinburgh</th><th>Moscow</th><th>Oslo</th><th>Reykjavik</th></tr><tr><td>4°C</td><td>−12°C</td><td>−5°C</td><td>−1°C</td></tr></table>
        <p>a) Put the cities in order, coldest first. ${lines(1)}</p><p>b) What is the difference between the warmest and the coldest? ${blank(4)}</p>
        <p>c) Moscow warms up by 9 degrees. What is its temperature now? ${blank(4)}</p></div>
      ${qs([`A diver is at −12 m (12 m below the surface). They rise 7 m. Where are they now? ${blank(5)}`,
        `Kai has £25 in the bank and spends £40 with a card. What is the balance now? Then £30 is paid in. What is it now? ${lines(1)}`,
        `Explain why −5 × −6 is positive, using a pattern or an example.${lines(2)}`], 4)}`,
    answers: answersPage(h, "Below zero", ["5, −5, −10, 8, −9, 2", "−12, 3, 30, −4, 9, −3", "a) Moscow, Oslo, Reykjavik, Edinburgh  b) 16 degrees  c) −3°C", "−5 m (5 m below the surface)",
      "−£15 (overdrawn by £15), then £15", "A pattern such as 2 × −6 = −12, 1 × −6 = −6, 0 × −6 = 0, so −1 × −6 = 6: each step goes up by 6"])
  }));

  add("paper-factor-trees", T3("common-multiples-common-factors-and-primes"), "Factor trees and primes", "Highest common factors, lowest common multiples, factor trees, primes, and a bus timetable problem.", (who, h) => ({
    pupil: `${h.sheetHead("Factor trees and primes", who)}
      ${qs([`List the factors of 36: ${lines(1)} and of 48: ${lines(1)} Circle the common factors. The highest common factor is ${blank(3)}`,
        `List the multiples of 6 and of 8 up to 50. The lowest common multiple is ${blank(3)}${lines(1)}`,
        `Find the highest common factor and the lowest common multiple of 18 and 24. HCF ${blank(3)} LCM ${blank(3)}`])}
      <div class="pp-q"><p><b>4.</b> Draw a factor tree for each number, then write it as a product of primes.</p>
        <div class="pp-cols3">${[60, 84, 90].map(n => `<div class="pp-cell"><p><b>${n}</b></p><div class="pp-draw pp-short"></div><p>${n} = ${blank(6)}</p></div>`).join("")}</div></div>
      ${qs([`Circle the prime numbers: &nbsp; 2 &nbsp; 9 &nbsp; 17 &nbsp; 21 &nbsp; 29 &nbsp; 39 &nbsp; 41 &nbsp; 51 &nbsp; 57 &nbsp; 61 &nbsp; 87 &nbsp; 97`,
        `Buses to the city leave every 12 minutes and buses to the coast every 18 minutes. Both leave together at 9:00. When do they next leave together? Show how you know.${lines(1)}`,
        `Is 91 prime? Explain.${lines(1)}`], 5)}`,
    answers: answersPage(h, "Factor trees and primes", ["36: 1, 2, 3, 4, 6, 9, 12, 18, 36. 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48. Common: 1, 2, 3, 4, 6, 12. HCF 12",
      "6, 12, 18, 24, 30, 36, 42, 48 and 8, 16, 24, 32, 40, 48: LCM 24", "HCF 6, LCM 72", "60 = 2 × 2 × 3 × 5; 84 = 2 × 2 × 3 × 7; 90 = 2 × 3 × 3 × 5",
      "Primes: 2, 17, 29, 41, 61, 97 (9 = 3 × 3, 21 = 3 × 7, 39 = 3 × 13, 51 = 3 × 17, 57 = 3 × 19, 87 = 3 × 29)", "9:36: the LCM of 12 and 18 is 36", "No: 91 = 7 × 13"])
  }));

  add("paper-powers", T3("powers-and-indices"), "Powers", "Index notation, evaluating powers, writing numbers as powers, and a paper-folding pattern.", (who, h) => ({
    pupil: `${h.sheetHead("Powers", who)}
      ${qs([`Write in index form: 5 × 5 × 5 = ${blank(3)} &nbsp; 2 × 2 × 2 × 2 × 2 × 2 = ${blank(3)} &nbsp; 10 × 10 × 10 × 10 = ${blank(3)}`,
        `In 7⁵, the base is ${blank(2)} and the index (exponent) is ${blank(2)}. 7⁵ means ${blank(10)}`,
        `Work out: 2⁴ = ${blank(3)} &nbsp; 3³ = ${blank(3)} &nbsp; 5³ = ${blank(3)} &nbsp; 10⁴ = ${blank(4)} &nbsp; 6² = ${blank(3)} &nbsp; 1⁹ = ${blank(3)} &nbsp; 2⁷ = ${blank(3)}`,
        `Write each number as a power. Find two ways where you can. 27 = ${blank(4)} &nbsp; 81 = ${blank(6)} &nbsp; 64 = ${blank(8)} &nbsp; 1000 = ${blank(4)} &nbsp; 49 = ${blank(4)}`,
        `Which is bigger, 2⁵ or 5²? Show how you know.${lines(1)}`])}
      <div class="pp-q"><p><b>6.</b> Fold a sheet of paper in half again and again. Complete the table.</p>
        <table class="pp-table"><tr><th>Folds</th>${[1, 2, 3, 4, 5, 6].map(n => `<td class="pp-c">${n}</td>`).join("")}<th>10</th></tr>
          <tr><th>Layers</th><td class="pp-c">2</td>${"<td></td>".repeat(6)}</tr><tr><th>As a power</th><td class="pp-c">2¹</td>${"<td></td>".repeat(6)}</tr></table></div>
      ${qs([`Sam says 4³ = 12. Explain the mistake and give the right answer.${lines(2)}`], 7)}`,
    answers: answersPage(h, "Powers", ["5³, 2⁶, 10⁴", "Base 7, index 5: 7 × 7 × 7 × 7 × 7", "16, 27, 125, 10 000, 36, 1, 128", "3³; 3⁴ or 9²; 2⁶, 4³ or 8²; 10³; 7²", "2⁵ = 32 and 5² = 25, so 2⁵",
      "Layers 2, 4, 8, 16, 32, 64, and 1024 after 10 folds; powers 2¹ to 2⁶ and 2¹⁰", "4³ means 4 × 4 × 4 = 64, not 4 × 3"])
  }));

  add("paper-which-deal", T3("fractions-decimals-and-percentages-in-real-life"), "Which deal?", "Convert between fractions, decimals and percentages, calculate with them, and choose the better offer.", (who, h) => ({
    pupil: `${h.sheetHead("Which deal?", who)}
      <div class="pp-q"><p><b>1.</b> Complete the table.</p>
        <table class="pp-table"><tr><th>Fraction</th><th>Decimal</th><th>Percentage</th></tr>
          ${[["3/8", "", ""], ["", "0·875", ""], ["", "", "40%"], ["3/20", "", ""], ["", "", "12·5%"]].map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>
      ${qs([`Complete: 2¾ = ${blank(2)}/4 = ${blank(3)} &nbsp; 17/5 = ${blank(4)} (mixed number) = ${blank(3)} &nbsp; 1·6 = ${blank(4)} (mixed number) = ${blank(3)} (improper)`,
        `Put in order, smallest first: ⅜ &nbsp; 0·4 &nbsp; 35% &nbsp; 0·38 ${lines(1)}`,
        `Work out: 17·5% of £240 = ${blank(4)} &nbsp; 12% of £35 = ${blank(4)} &nbsp; ⅗ of 85 = ${blank(3)} &nbsp; 42 out of 56 as a percentage = ${blank(3)}`,
        `A jacket costs £45. Shop A: ⅓ off. Shop B: 30% off. Which is cheaper, and by how much?${lines(2)}`,
        `A £60 game: 25% off, or £14 off? Which would you choose, and why?${lines(2)}`], 2)}`,
    answers: answersPage(h, "Which deal?", ["3/8 = 0·375 = 37·5%; 7/8 = 0·875 = 87·5%; 2/5 = 0·4 = 40%; 3/20 = 0·15 = 15%; 1/8 = 0·125 = 12·5%",
      "11/4 = 2·75; 3⅖ = 3·4; 1⅗ = 8/5", "35%, ⅜ (0·375), 0·38, 0·4", "£42, £4·20, 51, 75%", "Shop A: £30; Shop B: £31·50. Shop A is cheaper by £1·50", "25% off (£45) is cheaper than £14 off (£46)"])
  }));

  add("paper-fraction-sums", T3("adding-and-subtracting-fractions"), "Fraction sums", "Add and subtract fractions and mixed numbers with different denominators, a jug problem and a mistake to spot.", (who, h) => ({
    pupil: `${h.sheetHead("Fraction sums", who)}
      <p>Find a common denominator first. Simplify your answers, and write improper fractions as mixed numbers.</p>
      <div class="pp-grid3">${["⅓ + ¼", "⅖ + ⅓", "⅚ − ¼", "¾ + ⅝", "7/10 − ⅖", "2½ + 1⅔", "3¼ − 1⅔", "5 − 2⅜", "1⅚ + 2¾"]
        .map((c, i) => `<div class="pp-cell"><p><b>${i + 1}.</b> ${c} =</p><div class="pp-draw pp-short"></div></div>`).join("")}</div>
      ${qs([`A jug holds 2 litres. ¾ litre of juice and ⅖ litre of lemonade are poured in. How much more will fit?${lines(2)}`,
        `Ali says ½ + ⅓ = 2/5. Explain the mistake and give the right answer.${lines(2)}`], 10)}`,
    answers: answersPage(h, "Fraction sums", ["7/12", "11/15", "7/12", "1⅜", "3/10", "4⅙", "1 7/12", "2⅝", "4 7/12",
      "¾ + ⅖ = 15/20 + 8/20 = 1 3/20 litres; 2 − 1 3/20 = 17/20 litre", "The parts are different sizes, so you can't add tops and bottoms: 3/6 + 2/6 = 5/6"])
  }));

  add("paper-recipe-crowd", T3("proportion-and-ratio"), "Recipe for a crowd", "Scale a recipe, use the unitary method, simplify and share in a ratio, and find the best buy.", (who, h) => ({
    pupil: `${h.sheetHead("Recipe for a crowd", who)}
      <div class="pp-q"><p><b>1.</b> Pasta bake for 4 people. Scale the recipe.</p>
        <table class="pp-table"><tr><th>Ingredient</th><th>For 4</th><th>For 2</th><th>For 6</th><th>For 10</th></tr>
          ${[["Pasta", "300 g"], ["Chopped tomatoes", "400 g"], ["Onions", "2"], ["Cheese", "120 g"], ["Basil leaves", "8"]].map(([i, q]) => `<tr><td>${i}</td><td>${q}</td><td></td><td></td><td></td></tr>`).join("")}</table></div>
      ${qs([`5 pens cost £3·60. How much do 8 pens cost? Show the unitary method.${lines(1)}`,
        `Simplify: 18 : 24 = ${blank(3)} &nbsp; 15 : 35 = ${blank(3)} &nbsp; 6 : 60 = ${blank(3)}`,
        `A school has 6 teachers and 60 children. Write the ratio of teachers to everyone in the school, in its simplest form. ${blank(4)}`,
        `Share £45 in the ratio 2 : 3. ${blank(8)} &nbsp; Share 35 sweets in the ratio 2 : 5. ${blank(8)}`,
        `Which is the better buy: 500 g of cereal for £1·85, or 750 g for £2·70? Show your working.${lines(2)}`,
        `A taxi costs £3 plus £1·20 a mile. Does 2 miles cost twice as much as 1 mile? Explain.${lines(2)}`], 2)}`,
    answers: answersPage(h, "Recipe for a crowd", ["For 2: 150 g, 200 g, 1, 60 g, 4. For 6: 450 g, 600 g, 3, 180 g, 12. For 10: 750 g, 1000 g, 5, 300 g, 20",
      "1 pen costs 72p, so 8 cost £5·76", "3 : 4, 3 : 7, 1 : 10", "6 : 66 = 1 : 11", "£18 and £27; 10 and 25", "500 g: 37p per 100 g; 750 g: 36p per 100 g, so 750 g is the better buy",
      "No: 1 mile is £4·20 and 2 miles is £5·40, not £8·40, because the £3 is charged once. They aren't in proportion."])
  }));

  add("paper-plan-budget", T3("best-value-budgets-and-money-words"), "Plan a budget", "A monthly budget with a saving goal, comparing two phone deals, financial words and changing currency.", (who, h) => ({
    pupil: `${h.sheetHead("Plan a budget", who)}
      <div class="pp-q"><p><b>1.</b> Jo gets £60 a month from a weekend job. Jo's phone costs £10 a month (paid by direct debit) and a bus pass costs £16 a month. Jo wants headphones costing £120 in 6 months.</p>
        <table class="pp-table"><tr><th>Each month</th><th>Amount</th></tr>${["Income", "Phone", "Bus pass", "Saving for headphones", "Left to spend"].map(r => `<tr><td>${r}</td><td></td></tr>`).join("")}</table></div>
      ${qs([`Phone A: £12 a month for 24 months. Phone B: £180 now, then £5 a month for 24 months. Work out the total cost of each. Which would you choose, and why?${lines(2)}`], 2)}
      <div class="pp-q"><p><b>3.</b> Match each word to its meaning. Write the letter.</p>
        <div class="pp-cols"><div>${["APR", "per annum", "direct debit", "standing order", "debit", "credit", "interest rate"].map(w => `<p>${w} ${blank(2)}</p>`).join("")}</div>
          <div>${["A. money coming into an account", "B. the percentage charged on borrowing, or paid on savings", "C. a regular, fixed payment you set up from your account",
            "D. the yearly cost of borrowing, including fees, as a percentage", "E. money going out of an account", "F. each year", "G. a regular payment a company collects from your account; the amount can change"].map(d => `<p>${d}</p>`).join("")}</div></div></div>
      ${qs([`£1 = €1·16. How many euros do you get for £250? ${blank(4)} How many pounds is €58? ${blank(4)}`], 4)}`,
    answers: answersPage(h, "Plan a budget", ["Income £60, phone £10, bus pass £16, saving £20 (£120 ÷ 6), left to spend £14",
      "A: £12 × 24 = £288. B: £180 + £5 × 24 = £300. A costs £12 less; a good answer also weighs paying up front, data or the phone itself",
      "APR D, per annum F, direct debit G, standing order C, debit E, credit A, interest rate B", "€290; £50"])
  }));

  add("paper-journey-planner", T3("speed-distance-and-time"), "Journey planner", "Speed, distance and time problems in hours and minutes, and durations across midnight and days.", (who, h) => ({
    pupil: `${h.sheetHead("Journey planner", who)}
      ${qs([`Complete: distance = ${blank(6)} &nbsp; speed = ${blank(6)} &nbsp; time = ${blank(6)}`,
        `A car travels at 60 mph for 2½ hours. How far does it go? ${blank(5)}`,
        `How long does it take to drive 150 km at 60 km/h? ${blank(5)}`,
        `A cyclist rides 36 km in 1 hour 30 minutes. What is the average speed? ${blank(5)}`,
        `A train travels 210 km in 1 hour 45 minutes. What is its average speed? ${blank(5)}`,
        `Lena walks at 5 km/h for 45 minutes. How far does she walk? ${blank(5)}`])}
      <div class="pp-q"><p><b>7.</b> How long is each?</p>
        <table class="pp-table"><tr><th>From</th><th>To</th><th>Duration</th></tr>
          ${[["22:40 Monday", "06:15 Tuesday"], ["21:50 Friday", "07:20 Saturday"], ["09:15 Saturday", "16:40 Sunday"]].map(([a, b]) => `<tr><td>${a}</td><td>${b}</td><td></td></tr>`).join("")}</table></div>
      ${qs([`A coach leaves at 08:45 for a 270 km journey. Its average speed is 72 km/h. When does it arrive?${lines(2)}`,
        `Plan a journey you know: how far, how long, and the average speed.${lines(2)}`], 8)}`,
    answers: answersPage(h, "Journey planner", ["speed × time; distance ÷ time; distance ÷ speed", "150 miles", "2½ hours (2 hours 30 minutes)", "24 km/h", "120 km/h", "3·75 km",
      "7 h 35 min; 9 h 30 min; 31 h 25 min", "270 ÷ 72 = 3·75 hours = 3 h 45 min, so 12:30", "Any sensible journey with the calculation shown"],
      "Watch for minutes written as decimals: 1 hour 30 minutes is 1·5 hours, not 1·3.")
  }));

  add("paper-floor-plans", T3("area-and-volume-including-compound-shapes"), "Floor plans and boxes", "Area of compound shapes, mixed units, volume of a compound solid, conversions and choosing units.", (who, h) => {
    const lShape = svg(270, 212, `<polygon points="10,190 250,190 250,70 160,70 160,10 10,10" class="pp-shape"/>
      <text x="120" y="208" class="pp-lab">8 m</text><text x="16" y="104" class="pp-lab">6 m</text>
      <text x="70" y="28" class="pp-lab">5 m</text><text x="212" y="134" class="pp-lab">4 m</text><text x="195" y="64" class="pp-lab">3 m</text><text x="166" y="44" class="pp-lab">2 m</text>`);
    const house = svg(215, 185, `<rect x="25" y="75" width="150" height="90" class="pp-shape"/><polygon points="25,75 175,75 100,15" class="pp-shape"/>
      <line x1="100" y1="15" x2="100" y2="75" class="pp-dash"/><text x="104" y="52" class="pp-lab">4 cm</text>
      <text x="82" y="182" class="pp-lab">10 cm</text><text x="180" y="125" class="pp-lab">6 cm</text>`);
    return {
      pupil: `${h.sheetHead("Floor plans and boxes", who)}
        <div class="pp-cols"><div class="pp-q"><p><b>1.</b> Find the area of this floor plan. Show how you split it.</p>${lShape}<p>Area = ${blank(5)}</p></div>
          <div class="pp-q"><p><b>2.</b> Find the area of this shape: a rectangle with a triangle on top.</p>${house}<p>Area = ${blank(5)}</p></div></div>
        ${qs([`A rug is 2·5 m long and 80 cm wide. Find its area in m² and in cm².${lines(1)}`,
          `A step is made from two cuboids: one 6 cm long, 4 cm wide and 2 cm high, with one 3 cm long, 4 cm wide and 3 cm high on top. Find the volume of the step.${lines(1)}`,
          `Convert: 2·5 m = ${blank(3)} cm &nbsp; 1500 ml = ${blank(3)} litres &nbsp; 3·25 kg = ${blank(3)} g &nbsp; 0·75 km = ${blank(3)} m &nbsp; 84 cm³ = ${blank(3)} ml`,
          `Which units would you use for the area of a stamp, a classroom and a farm, and for the volume of a swimming pool?${lines(1)}`], 3)}`,
      answers: answersPage(h, "Floor plans and boxes", ["8 × 6 = 48 m², minus the 3 × 2 = 6 m² cut-out: 42 m² (or split into 5 × 6 + 3 × 4 = 30 + 12 = 42 m²)", "10 × 6 = 60, plus ½ × 10 × 4 = 20: 80 cm²",
        "2·5 × 0·8 = 2 m², or 250 × 80 = 20 000 cm²", "6 × 4 × 2 = 48 and 3 × 4 × 3 = 36: 84 cm³", "250 cm, 1·5 litres, 3250 g, 750 m, 84 ml", "mm² or cm²; m²; hectares or km²; m³ or litres"])
    };
  });

  add("paper-maths-changed-world", T3("researching-a-mathematician-or-a-maths-topic"), "Maths that changed the world", "Notes from two sources, the maths with a worked example, its impact, and a plan for a short talk.", (who, h) => ({
    pupil: `${h.sheetHead("Maths that changed the world", who)}
      ${box("My mathematician or topic", lines(1))}
      <div class="pp-cols">${box("Source 1: what is it, and who made it?", lines(2))}${box("Source 2: what is it, and who made it?", lines(2))}</div>
      ${box("Key facts (notes, in my own words). Tick each fact both sources agree on.", lines(4))}
      ${box("The maths: explain it with one worked example, using the right words and notation", `<div class="pp-draw"></div>`)}
      ${box("Its impact: how it changed things then, and why it matters now", lines(2))}
      <div class="pp-cols3">${box("Opening hook", lines(2))}${box("Three main points", lines(2))}${box("Ending", lines(2))}</div>`,
    answers: lookForPage(h, "Maths that changed the world", ["Two sources noted, with a sensible choice of reliable ones; facts checked against each other",
      "Notes in the pupil's own words, not copied sentences", "A correct worked example using the right vocabulary and notation", "A clear link between the maths and its impact on society, then and now",
      "A talk plan with a hook, three points in order, and an ending that sums up"])
  }));

  add("paper-find-rule", T3("sequences-and-their-rules"), "Find the rule", "Generate sequences from rules, find rules in algebra, and use them for matchsticks, car hire and gym costs.", (who, h) => ({
    pupil: `${h.sheetHead("Find the rule", who)}
      <div class="pp-q"><p><b>1.</b> Write the first five terms (n = 1, 2, 3, 4, 5).</p>
        <p>T = 4n + 6: ${blank(12)} &nbsp; T = 3n − 2: ${blank(12)} &nbsp; T = 10 − 2n: ${blank(12)}</p></div>
      <div class="pp-q"><p><b>2.</b> Find the rule for each sequence, then use it to find the 20th term.</p>
        <table class="pp-table"><tr><th>Sequence</th><th>Rule</th><th>20th term</th></tr>${["5, 9, 13, 17 …", "7, 12, 17, 22 …", "3, 9, 15, 21 …", "20, 17, 14, 11 …"].map(s => `<tr><td>${s}</td><td></td><td></td></tr>`).join("")}</table></div>
      <div class="pp-q"><p><b>3.</b> Squares made from matchsticks in a row:</p>
        ${svg(300, 50, [0, 1, 2].map(k => `<rect x="${10 + k * 100}" y="10" width="${(k + 1) * 26}" height="26" class="pp-shape"/>${Array.from({ length: k }, (_, j) => `<line x1="${10 + k * 100 + (j + 1) * 26}" y1="10" x2="${10 + k * 100 + (j + 1) * 26}" y2="36" class="pp-shape"/>`).join("")}`).join(""))}
        <p>Squares: 1, 2, 3 &nbsp; Matches: 4, 7, 10. Write a rule for the number of matches, M, for s squares. ${blank(6)}</p>
        <p>How many matches for 10 squares? ${blank(3)} How many squares can you make with 61 matches? ${blank(3)}</p></div>
      ${qs([`Car hire costs £75 plus 5p a mile: C = 0·05m + 75. Find the cost for 200 miles ${blank(4)} and 500 miles ${blank(4)}`,
        `A gym costs £20 to join, then £15 a month. Write a rule for the cost, C, for m months, and find the cost for a year.${lines(1)}`], 4)}`,
    answers: answersPage(h, "Find the rule", ["10, 14, 18, 22, 26; 1, 4, 7, 10, 13; 8, 6, 4, 2, 0", "T = 4n + 1, 81; T = 5n + 2, 102; T = 6n − 3, 117; T = 23 − 3n, −37",
      "M = 3s + 1; 31 matches; 20 squares", "£85; £100", "C = 15m + 20; £200 for 12 months"])
  }));

  add("paper-simplify-substitute", T3("simplifying-and-evaluating-expressions"), "Simplify and substitute", "Collect like terms, including squared terms, and evaluate expressions with positive and negative values.", (who, h) => ({
    pupil: `${h.sheetHead("Simplify and substitute", who)}
      <div class="pp-q"><p><b>1.</b> Simplify by collecting like terms.</p>
        <div class="pp-cols">${["3a + 2b + 4a", "6p − 2q + p + 5q", "5x² + 3x − 2x² + x", "4y − 7 + 2y + 10", "2ab + 3a − ab", "8m − 3n − 8m"].map((e, i) => `<p>${String.fromCharCode(97 + i)}) ${e} = ${blank(7)}</p>`).join("")}</div></div>
      <div class="pp-q"><p><b>2.</b> a = 3 and b = −2. Work out:</p>
        <div class="pp-cols">${["4a − 3b", "a² + 2b", "ab", "2a + b²", "5b − a"].map((e, i) => `<p>${String.fromCharCode(97 + i)}) ${e} = ${blank(5)}</p>`).join("")}</div></div>
      <div class="pp-q"><p><b>3.</b> x = −3 and y = 4. Work out:</p>
        <div class="pp-cols">${["2x² − y", "x + y", "3y − x", "xy"].map((e, i) => `<p>${String.fromCharCode(97 + i)}) ${e} = ${blank(5)}</p>`).join("")}</div></div>
      ${qs([`A rectangle is 3x long and x + 2 wide. Write an expression for its perimeter and simplify it. Find the perimeter when x = 5.${lines(2)}`,
        `Rory writes 2x + 3x² = 5x³. Explain the mistake.${lines(2)}`], 4)}`,
    answers: answersPage(h, "Simplify and substitute", ["a) 7a + 2b  b) 7p + 3q  c) 3x² + 4x  d) 6y + 3  e) ab + 3a  f) −3n", "a) 18  b) 5  c) −6  d) 10  e) −13", "a) 14  b) 1  c) 15  d) −12",
      "2 × 3x + 2 × (x + 2) = 8x + 4; 44", "x and x² are unlike terms, so 2x + 3x² can't be simplified"],
      "Check substitutions use brackets for negatives: (−3)² = 9, so 2 × 9 − 4 = 14.")
  }));

  add("paper-equations-formulae", T3("solving-equations-and-using-formulae"), "Equations and formulae", "Solve linear equations, write equations for problems, and create and use formulae.", (who, h) => ({
    pupil: `${h.sheetHead("Equations and formulae", who)}
      <div class="pp-q"><p><b>1.</b> Solve. Show each step.</p>
        <div class="pp-grid3">${["3x + 5 = 26", "4x − 7 = −15", "5y − 9 = 16", "2a + 11 = 3", "x/4 + 3 = 8", "6p − 4 = 2p + 12"].map((e, i) => `<div class="pp-cell"><p>${String.fromCharCode(97 + i)}) ${e}</p><div class="pp-draw pp-short"></div></div>`).join("")}</div></div>
      ${qs([`I think of a number, double it and subtract 7. The answer is 15. Write an equation and solve it.${lines(1)}`,
        `A rectangle's perimeter is 30 cm, and its length is twice its width. Write an equation and find the length and width.${lines(1)}`,
        `A taxi costs £3 plus £1·20 a mile. Write a formula for the cost, C, of m miles. ${blank(6)} Find the cost of 8 miles ${blank(4)}. How far can you go for £18? ${blank(4)}`,
        `Write a formula for the number of legs, L, on c chairs (4 legs each) and t stools (3 legs each). ${blank(6)} Use it for 6 chairs and 4 stools. ${blank(3)}`,
        `Write a formula for the perimeter, P, of a regular hexagon with sides of length s. ${blank(5)}`], 2)}`,
    answers: answersPage(h, "Equations and formulae", ["a) 7  b) −2  c) 5  d) −4  e) 20  f) 4", "2n − 7 = 15, n = 11", "2w + 2(2w) = 30, so 6w = 30: width 5 cm, length 10 cm",
      "C = 1·2m + 3; £12·60; 12·5 miles", "L = 4c + 3t; 36", "P = 6s"])
  }));

  add("paper-construct-shapes", T3("drawing-shapes-accurately"), "Triangles and polygons, accurately", "Draw triangles with a protractor or compasses, a regular hexagon, and measure to check.", (who, h) => ({
    pupil: `${h.sheetHead("Triangles and polygons, accurately", who)}<p>You need a sharp pencil, a ruler, a protractor and compasses. Label each shape.</p>
      <div class="pp-cols">
        <div class="pp-q"><p><b>1.</b> Triangle ABC: AB = 7 cm, angle A = 50°, AC = 5 cm. Measure BC: ${blank(3)}</p><div class="pp-draw" style="height:50mm"></div></div>
        <div class="pp-q"><p><b>2.</b> Triangle PQR (use compasses): PQ = 8 cm, QR = 6 cm, PR = 5 cm. Measure angle P: ${blank(3)}</p><div class="pp-draw" style="height:50mm"></div></div>
        <div class="pp-q"><p><b>3.</b> Triangle XYZ: XY = 6 cm, angle X = 40°, angle Y = 75°. Measure XZ: ${blank(3)}. What is angle Z? ${blank(3)}</p><div class="pp-draw" style="height:50mm"></div></div>
        <div class="pp-q"><p><b>4.</b> A regular hexagon with sides of 4 cm. Each interior angle is 120°.</p><div class="pp-draw" style="height:50mm"></div></div></div>
      ${qs([`Can you draw a triangle with sides of 3 cm, 4 cm and 10 cm? Explain.${lines(2)}`], 5)}`,
    answers: answersPage(h, "Triangles and polygons, accurately", ["BC ≈ 5·4 cm", "Angle P ≈ 49°", "XZ ≈ 6·4 cm; angle Z = 65°", "Six equal sides of 4 cm; each angle 120°; it should close up exactly",
      "No: 3 + 4 = 7, which is shorter than 10, so the two short sides can't meet"], "Allow 2 mm and 2° either way. Check lines are sharp and construction arcs are left showing.")
  }));

  add("paper-missing-angles", T3("angles-in-shapes-and-with-parallel-lines"), "Missing angles", "Corresponding, alternate and vertically opposite angles, angles in triangles and quadrilaterals, and naming angles.", (who, h) => {
    const lines2 = svg(300, 180, `<line x1="10" y1="60" x2="290" y2="60" class="pp-shape"/><line x1="10" y1="130" x2="290" y2="130" class="pp-shape"/>
      <line x1="60" y1="170" x2="240" y2="10" class="pp-shape"/>
      <path d="M36 54 L44 60 L36 66 M36 124 L44 130 L36 136" class="pp-shape"/>
      <text x="208" y="52" class="pp-lab">65°</text><text x="150" y="52" class="pp-lab">b</text><text x="140" y="80" class="pp-lab">c</text><text x="200" y="80" class="pp-lab">d</text>
      <text x="124" y="122" class="pp-lab">e</text><text x="76" y="122" class="pp-lab">f</text><text x="64" y="150" class="pp-lab">g</text><text x="120" y="150" class="pp-lab">h</text>`);
    return {
      pupil: `${h.sheetHead("Missing angles", who)}<p>Diagrams are not drawn to scale. Give a reason for every answer.</p>
        <div class="pp-side"><div>${lines2}<p class="hint">The arrows show the two lines are parallel.</p></div>
          <div class="pp-q"><p><b>1.</b> Find angles b to h.</p>${["b", "c", "d", "e", "f", "g", "h"].map(a => `<p>${a} = ${blank(2)}° because ${blank(12)}</p>`).join("")}</div></div>
        ${qs([`A triangle has angles of 47° and 68°. Find the third angle, and give a reason.${lines(1)}`,
          `An isosceles triangle has a top angle of 40°. Find the other two angles.${lines(1)}`,
          `A quadrilateral has angles of 90°, 110° and 75°. Find the fourth angle.${lines(1)}`,
          `Three angles meet at a point: 150°, 95° and x. Find x.${lines(1)}`,
          `In triangle PQR, the angle at Q is written ∠PQR. Write the three-letter name for the angle at R. ${blank(5)}`], 2)}`,
      answers: answersPage(h, "Missing angles", ["b = 115° (angles on a straight line), c = 65° (vertically opposite), d = 115° (vertically opposite b), e = 65° (corresponding), f = 115° (corresponding to b), g = 65° (vertically opposite e), h = 115° (vertically opposite f)",
        "65° (angles in a triangle add to 180°)", "70° and 70° (180 − 40 = 140, shared equally)", "85° (angles in a quadrilateral add to 360°)", "115° (angles at a point add to 360°)", "∠PRQ (or ∠QRP)"])
    };
  });

  add("paper-route-scale", T3("bearings-scale-drawings-and-enlargement"), "Route and scale", "Three-figure bearings, a scale drawing of a route, map scales, and enlarging and reducing shapes.", (who, h) => {
    const s = 26;
    const route = svg(10 * s + 4, 7 * s + 4, `${gridLines(10, 7, s, 2, 2)}<circle cx="${2 + s}" cy="${2 + 4 * s}" r="4" class="pp-dot"/><text x="${s - 4}" y="${4 * s + 20}" class="pp-lab">Start</text>
      <line x1="${2 + s}" y1="${2 + 4 * s}" x2="${2 + s}" y2="${2 + 4 * s - 40}" class="pp-shape"/><text x="${s - 2}" y="${4 * s - 42}" class="pp-lab">N</text>`);
    const shape = svg(10 * s + 4, 7 * s + 4, `${gridLines(10, 7, s, 2, 2)}<polygon points="${[[1, 1], [3, 1], [3, 2], [2, 2], [2, 4], [1, 4]].map(([x, y]) => `${2 + x * s},${2 + y * s}`).join(" ")}" class="pp-fill"/>`);
    return {
      pupil: `${h.sheetHead("Route and scale", who)}
        ${qs([`Give the three-figure bearing of: north ${blank(3)} east ${blank(3)} south ${blank(3)} west ${blank(3)} north-east ${blank(3)} south-west ${blank(3)}`])}
        <div class="pp-side"><div>${route}</div><div class="pp-q"><p><b>2.</b> 1 square = 1 km. From Start, draw the route: 4 km on a bearing of 060°, then 3 km on a bearing of 150°.</p>
          <p>How far is the end from Start? ${blank(4)}</p><p>What bearing takes you back to Start? ${blank(4)}</p></div></div>
        ${qs([`A map's scale is 1 : 50 000. What does 1 cm on the map stand for? ${blank(5)} Two villages are 7 cm apart on the map. How far apart are they really? ${blank(4)}`], 3)}
        <div class="pp-side"><div>${shape}</div><div class="pp-q"><p><b>4.</b> Enlarge the shape by scale factor 2 on the same grid.</p>
          <p><b>5.</b> A 3 cm by 5 cm photo is enlarged by scale factor 3. New size: ${blank(5)}</p>
          <p><b>6.</b> A 12 cm by 8 cm drawing is reduced by scale factor ½. New size: ${blank(5)}</p></div></div>`,
      answers: answersPage(h, "Route and scale", ["000°, 090°, 180°, 270°, 045°, 225°", "5 km (the two legs are at right angles); about 277°", "500 m; 3·5 km",
        "Every side twice as long: 4, 2, 2, 4, 2 and 6 squares (the L is 4 wide and 6 tall)", "9 cm by 15 cm", "6 cm by 4 cm"], "Allow 2° and 2 mm either way on the scale drawing.")
    };
  });

  add("paper-four-quadrants", T3("coordinates-in-four-quadrants-and-symmetry"), "Four quadrants and symmetry", "Read and plot coordinates in all four quadrants, reflect a shape, count lines of symmetry and complete a pattern.", (who, h) => {
    const s = 22, o = 6 * s + 14;
    const nums = Array.from({ length: 13 }, (_, i) => i - 6).filter(n => n);
    const axes = svg(12 * s + 28, 12 * s + 28, `${gridLines(12, 12, s, 14, 14)}
      <line x1="14" y1="${o}" x2="${12 * s + 14}" y2="${o}" class="pp-axis"/><line x1="${o}" y1="14" x2="${o}" y2="${12 * s + 14}" class="pp-axis"/>
      ${nums.filter(n => n % 2 === 0).map(n => `<text x="${o + n * s - 4}" y="${o + 12}" class="pp-small">${n}</text><text x="${o - 16}" y="${o - n * s + 4}" class="pp-small">${n}</text>`).join("")}
      <text x="${12 * s + 16}" y="${o + 4}" class="pp-small">x</text><text x="${o - 3}" y="11" class="pp-small">y</text>
      ${[["P", -5, 4], ["Q", 3, -4], ["R", 0, -3]].map(([l, x, y]) => `<circle cx="${o + x * s}" cy="${o - y * s}" r="3" class="pp-dot"/><text x="${o + x * s + 4}" y="${o - y * s - 4}" class="pp-lab pp-halo">${l}</text>`).join("")}`);
    const pat = svg(8 * 16 + 4, 8 * 16 + 4, `${gridLines(8, 8, 16, 2, 2)}${[[0, 0], [1, 0], [0, 1], [2, 1], [1, 2], [3, 3], [2, 3], [0, 3]].map(([x, y]) => `<rect x="${2 + x * 16}" y="${2 + y * 16}" width="16" height="16" class="pp-fill"/>`).join("")}
      <line x1="${2 + 64}" y1="0" x2="${2 + 64}" y2="132" class="pp-dash"/><line x1="0" y1="${2 + 64}" x2="132" y2="${2 + 64}" class="pp-dash"/>`);
    return {
      pupil: `${h.sheetHead("Four quadrants and symmetry", who)}
        <div class="pp-side"><div>${axes}</div><div>
          ${qs([`Write the coordinates of P ${blank(3)} Q ${blank(3)} R ${blank(3)}`,
            `Plot A(2, 3), B(−4, 1), C(−3, −5) and D(5, −2) on the grid.`,
            `Plot (1, 1), (4, 1) and (4, 3) and join them to make a triangle. Reflect it in the y-axis. Write the new coordinates: ${lines(1)}`,
            `Reflect (2, −3) in the y-axis: ${blank(3)} In the x-axis: ${blank(3)}`])}</div></div>
        <div class="pp-q"><p><b>5.</b> How many lines of symmetry?</p>
          <div class="pp-next">${["square", "rectangle", "kite", "regular hexagon", "regular pentagon", "parallelogram", "equilateral triangle"].map(n => `<span>${n} ${blank(2)}</span>`).join("")}</div></div>
        <div class="pp-side"><div>${pat}</div><p><b>6.</b> The dashed lines are lines of symmetry. Shade squares to make the whole pattern symmetrical about both lines.</p></div>`,
      answers: answersPage(h, "Four quadrants and symmetry", ["P(−5, 4), Q(3, −4), R(0, −3)", "A top right, B top left, C bottom left, D bottom right", "(−1, 1), (−4, 1), (−4, 3)", "(−2, −3); (2, 3)",
        "4, 2, 1, 6, 5, 0, 3", "Each shaded square mirrored into the other three quarters: 32 squares shaded in all"])
    };
  });

  add("paper-trust-data", T3("data-fair-samples-clear-graphs-and-misleading-claims"), "Can you trust it?", "Judge claims, graphs and samples as robust, vague or misleading, describe a trend, and work out a pie chart.", (who, h) => {
    const bar = (lo, label) => svg(140, 130, `<line x1="30" y1="10" x2="30" y2="110" class="pp-axis"/><line x1="30" y1="110" x2="130" y2="110" class="pp-axis"/>
      ${[[48, "A", 50], [52, "B", 90]].map(([v, n, x]) => { const top = 110 - ((v - lo) / (55 - lo)) * 95; return `<rect x="${x}" y="${top}" width="26" height="${110 - top}" class="pp-fill"/><text x="${x + 8}" y="124" class="pp-small">${n}</text>`; }).join("")}
      <text x="2" y="114" class="pp-small">${lo}</text><text x="2" y="18" class="pp-small">55</text><text x="44" y="8" class="pp-small">${label}</text>`);
    return {
      pupil: `${h.sheetHead("Can you trust it?", who)}
        ${qs([`An advert says: "9 out of 10 people prefer Fizz!" The small print says 10 people were asked, at a Fizz launch party. Is the claim robust, vague or misleading? Why?${lines(2)}`])}
        <div class="pp-side"><div class="pp-cols">${bar(0, "Graph 1")}${bar(45, "Graph 2")}</div><div class="pp-q"><p><b>2.</b> Both graphs show sales (thousands) of brands A and B. Which one is misleading, and why?</p>${lines(2)}</div></div>
        ${qs([`To find the most popular sport in the year group, Lewis asks members of the football club. Why is this biased? How should he choose his sample?${lines(2)}`,
          `A town's average temperature (°C) from January to June: 3, 4, 6, 9, 12, 15. Describe the trend.${lines(1)}`], 3)}
        <div class="pp-side"><div>${svg(130, 130, `<circle cx="65" cy="65" r="60" class="pp-shape"/><circle cx="65" cy="65" r="2" class="pp-dot"/>`)}</div>
          <div class="pp-q"><p><b>5.</b> 36 pupils were asked how they get to school. Work out each angle, then draw the pie chart.</p>
            <table class="pp-table"><tr><th>Walk</th><th>Bus</th><th>Car</th><th>Cycle</th></tr><tr><td>18</td><td>9</td><td>6</td><td>3</td></tr><tr>${"<td>°</td>".repeat(4)}</tr></table></div></div>`,
      answers: answersPage(h, "Can you trust it?", ["Misleading: a tiny sample of 10, all at a Fizz event, so they're likely to favour Fizz", "Graph 2: its scale starts at 45, so B looks more than twice as tall as A, though 52 is only a little more than 48",
        "Football club members are likely to choose football. Choose a representative sample, such as names picked at random from the whole year group", "An increasing trend: it rises every month, by more each month from March",
        "Walk 180°, bus 90°, car 60°, cycle 30° (each pupil is 360 ÷ 36 = 10°)"])
    };
  });

  add("paper-chances", T3("probability-from-0-to-1"), "Chances and choices", "The probability scale, probabilities of simple events as fractions and decimals, expected numbers, an experiment, and decisions.", (who, h) => ({
    pupil: `${h.sheetHead("Chances and choices", who)}
      <div class="pp-q"><p><b>1.</b> Mark each letter on the probability scale.</p>
        ${svg(560, 46, `<line x1="20" y1="20" x2="540" y2="20" class="pp-axis"/>${[0, 0.25, 0.5, 0.75, 1].map(p => `<line x1="${20 + p * 520}" y1="13" x2="${20 + p * 520}" y2="27" class="pp-axis"/><text x="${12 + p * 520}" y="42" class="pp-small">${p}</text>`).join("")}`)}
        <p>A: rolling a 7 on a normal dice &nbsp; B: a coin landing heads &nbsp; C: picking red from a bag of 3 red and 1 blue &nbsp; D: rolling a 6 on a normal dice &nbsp; E: the sun rising tomorrow</p></div>
      ${qs([`A 12-sided dice is numbered 1 to 12. Find the probability, as a fraction, of: a prime ${blank(3)} an even number ${blank(3)} a multiple of 3 ${blank(3)} a 13 ${blank(3)}`,
        `A bag has 3 red, 5 blue and 2 green counters. Find each probability as a fraction and a decimal: blue ${blank(5)} red ${blank(5)} not green ${blank(5)}. Do the probabilities of red, blue and green add up to 1? ${blank(3)}`,
        `You pick a counter from the bag 50 times, putting it back each time. About how many times would you expect blue? ${blank(3)}`,
        `The probability of rain on a June day is 0·25. About how many rainy days would you expect in June (30 days)? ${blank(4)}`,
        `Toss a coin 30 times and tally the heads. Heads: ${blank(3)} out of 30. How does this compare with a probability of ½?${lines(1)}`,
        `There's a 10% chance of a storm tomorrow. Would that change your plans for a sailing trip? For a trip to the cinema? Explain.${lines(2)}`], 2)}`,
    answers: answersPage(h, "Chances and choices", ["A at 0, D at about 0·17, B at 0·5, C at 0·75, E at 1", "5/12 (2, 3, 5, 7, 11); 6/12 = ½; 4/12 = ⅓; 0",
      "½ = 0·5; 3/10 = 0·3; 8/10 = 0·8; yes: 0·3 + 0·5 + 0·2 = 1", "About 25", "7·5, so about 7 or 8 days", "Close to 15 but rarely exactly: the more tosses, the closer the frequency usually gets to ½",
      "A good answer weighs the consequences as well as the probability: a storm at sea is dangerous, so even 10% matters; at the cinema it hardly matters"])
  }));

  /* ===================== Third level (S1 to S3): literacy ===================== */

  add("paper-reading-viewing", T3("choosing-texts-and-explaining-how-well-they-meet-my-needs"), "My reading and viewing", "A log of texts chosen, a review with evidence, and a plan for a text of my own.", (who, h) => ({
    pupil: `${h.sheetHead("My reading and viewing", who)}
      <table class="pp-table"><tr><th>Date</th><th>Title and type (book, article, podcast, film…)</th><th>Why I chose it</th><th>Met my needs? (1–5)</th></tr>${"<tr><td></td><td></td><td></td><td></td></tr>".repeat(4)}</table>
      <h2 class="ws-sub">Review one of them</h2>
      ${box("What I expected or wanted from it", lines(1))}
      ${box("How well it met my needs, with evidence: an example or a short quotation", lines(3))}
      ${box("Who else it would suit, and why", lines(1))}
      ${box("Where I could find more like it, and how far I'd trust that source", lines(1))}
      <h2 class="ws-sub">Plan a text of my own</h2>
      <div class="pp-cols">${box("Subject", lines(1))}${box("Purpose and audience", lines(1))}</div>
      ${box("Form and style (review, blog post, story, report…), and why they suit my audience", lines(2))}`,
    answers: lookForPage(h, "My reading and viewing", ["Texts chosen regularly, for enjoyment or for information", "A personal response justified with evidence from the text, not just \"it was good\"",
      "A clear judgement of how well the text met their needs and expectations", "Some thought about where to find more and how reliable those sources are", "A plan where the form and style clearly suit the purpose and audience"])
  }));

  add("paper-discussion-third", T3("discussion-contributing-building-on-others-and-respecting-other-views"), "Discussion: plan and reflect", "Plan points with evidence before a discussion, track how you built on others, and reflect on spoken language and register.", (who, h) => ({
    pupil: `${h.sheetHead("Discussion: plan and reflect", who)}
      <h2 class="ws-sub">Before</h2>
      ${box("The issue", lines(1))}
      <div class="pp-cols">${box("My view", lines(2))}${box("My evidence (facts, examples, experience)", lines(2))}</div>
      ${box("A question I could ask others", lines(1))}
      <h2 class="ws-sub">During: tick what you used</h2>
      <p>${tick(["\"Building on that…\"", "\"Can you clarify…?\"", "\"I see it differently because…\"", "\"So far we've said…\"", "\"That's a good point, but…\""])}</p>
      <h2 class="ws-sub">After</h2>
      ${box("Someone else's point that made me think again, and how my view changed or grew", lines(2))}
      ${box("Spoken language I used on purpose", tick(["eye contact", "gesture", "pace", "pauses", "emphasis", "tone", "rhetorical question"]))}
      ${box("Was my register formal or informal? Did it suit the audience? Why?", lines(2))}`,
    answers: lookForPage(h, "Discussion: plan and reflect", ["Relevant contributions backed by evidence, not just opinion", "Building on others: asking, clarifying, summarising, supporting or challenging, politely",
      "Respect for the right to hold a different view, even while disagreeing", "A specific example of how their thinking developed or changed", "Features of spoken language used deliberately, and a register suited to the audience"])
  }));

  const TALK_COUNCIL = "Good evening. From the first of March, the High Street will be closed to cars between ten in the morning and four in the afternoon, as a six-month trial. Buses, bikes and blue badge holders will still be able to use it, and deliveries can be made before ten or after four. The council is running the trial because traffic on the High Street has been rising, and many people have told us they would like more space to walk and sit. We will count visitors and ask shops and shoppers for their views every month. At the end of the trial, councillors will look at the results and decide whether to keep the scheme.";
  const TALK_BAKER = "I've run the bakery on the High Street for twenty years, and I'm worried. Lots of my customers are older people who drive in, park for ten minutes and pick up their bread. Where will they go now? To the supermarket on the ring road, that's where. The council says people want more space to sit. Well, I'd like to see who they asked. Nobody asked me, and nobody asked my customers. A trial sounds harmless, but six months is a long time for a small shop. If the street goes quiet, some of us won't be here to see the results.";
  add("paper-listen-note-compare", T3("listening-for-purpose-and-main-ideas-and-making-notes"), "Listen, note, compare", "Notes on two short talks about one issue, comparing their purpose and style, an inference, and a summary.", (who, h) => ({
    pupil: `${h.sheetHead("Listen, note, compare", who)}<p>Your adult will read two short talks about the same plan. Listen once, then make notes the second time: key words, not sentences.</p>
      <table class="pp-table"><tr><th></th><th>Talk 1</th><th>Talk 2</th></tr>
        ${["Who is speaking?", "Purpose", "Main points", "Style: formal or informal? facts or opinions?"].map(r => `<tr><th>${r}</th><td style="height:${r === "Main points" ? 70 : 34}px"></td><td></td></tr>`).join("")}</table>
      ${box("One way the talks are similar, and one way they're different", lines(2))}
      ${box("The second speaker says \"I'd like to see who they asked.\" What is the speaker suggesting?", lines(2))}
      ${box("Use your notes: sum up the plan and the views on it for someone who missed both talks", lines(4))}`,
    answers: `${h.brandHead("For the adult: Listen, note, compare", "Read each talk aloud twice: once to listen, once for notes.")}
      <p><b>Talk 1: a council officer</b></p><p class="pp-passage">${TALK_COUNCIL}</p>
      <p><b>Talk 2: a baker on the High Street</b></p><p class="pp-passage">${TALK_BAKER}</p>
      <ul class="ws-answers"><li><b>Purpose:</b> Talk 1 informs about the trial; Talk 2 gives an opinion and tries to persuade.</li>
        <li><b>Main points:</b> closed to cars 10 to 4 for six months; buses, bikes, blue badges and early or late deliveries allowed; traffic rising; checked monthly, then councillors decide. Talk 2: older customers drive in; they'll go to the supermarket; not consulted; small shops may close.</li>
        <li><b>Style:</b> Talk 1 formal and factual; Talk 2 informal and personal, with a rhetorical question.</li>
        <li><b>Inference:</b> that the council didn't ask people fairly, or only asked people who agreed, so its claim may not be reliable.</li></ul>
      <p>Look for notes in key words, an accurate account of each purpose, and a summary that is balanced and in the pupil's own words.</p>`
  }), { needsAdult: true });

  const SPEECH_PARK = "Friends, neighbours, everyone who has ever kicked a ball on Millfield Green: thank you for coming. Imagine our town without its only park. Imagine children with nowhere to play but the street. That is what will happen if the plan to build forty flats on the green goes ahead. We are not against new homes. We are against losing the one place where everyone, young and old, can breathe. Eight hundred people have already signed our petition. Eight hundred! Doctors tell us that time outdoors makes us healthier and happier. So why would anyone take it away? The council meets on Thursday. Come with us. Bring your family. Bring your voice. Together, we can save Millfield Green.";
  add("paper-spot-persuasion", T3("commenting-on-spoken-texts-and-recognising-persuasion"), "Spot the persuasion", "Name the persuasive techniques in a campaign speech, explain their effect, and judge how reliable it is.", (who, h) => ({
    pupil: `${h.sheetHead("Spot the persuasion", who)}<p>Your adult will read a campaign speech aloud, twice. Listen for how the speaker tries to persuade you.</p>
      ${box("What does the speaker want the audience to do?", lines(1))}
      <table class="pp-table"><tr><th>Technique</th><th>What the speaker said</th><th>The effect on the audience</th></tr>
        ${["Emotive language", "Repetition", "Rhetorical question", "Statistic", "Speaking directly to the audience", "Appeal to experts"].map(t => `<tr><td>${t}</td><td style="height:38px"></td><td></td></tr>`).join("")}</table>
      ${box("Comment on the speech's form and style: how is it organised, and how does it end?", lines(2))}
      ${box("How reliable is this speaker as a source? Which claims could you check, and which are vague?", lines(3))}
      ${box("What would you want to hear from the other side before deciding?", lines(2))}`,
    answers: `${h.brandHead("For the adult: Spot the persuasion", "Read the speech aloud twice, with expression.")}
      <p class="pp-passage">${SPEECH_PARK}</p>
      <ul class="ws-answers"><li><b>Wants:</b> people to come to the council meeting on Thursday and oppose the flats.</li>
        <li><b>Emotive:</b> \"children with nowhere to play but the street\", \"breathe\". <b>Repetition:</b> \"Imagine…\", \"Bring your…\", \"Eight hundred\". <b>Rhetorical question:</b> \"So why would anyone take it away?\"
          <b>Statistic:</b> 800 signatures. <b>Direct address:</b> \"Friends, neighbours\", \"Come with us\". <b>Experts:</b> \"Doctors tell us\".</li>
        <li><b>Form:</b> a greeting, a picture of the loss, the facts, then a call to action, ending on short commands and \"Together\".</li>
        <li><b>Reliability:</b> a campaigner, so one-sided. The petition total and the council date can be checked; \"doctors tell us\" is vague (which doctors?); \"nowhere to play\" may exaggerate.</li>
        <li><b>Other side:</b> why the flats are needed, who would live there, and whether any green space would be kept.</li></ul>`
  }), { needsAdult: true });

  add("paper-talk-planner", T3("giving-a-talk-clear-structured-and-engaging"), "Talk planner", "Plan a three-minute talk: hook, signposted points with evidence, conclusion, resources, delivery, and feedback.", (who, h) => ({
    pupil: `${h.sheetHead("Talk planner", who)}
      <div class="pp-cols">${box("Topic", lines(1))}${box("Audience and purpose", lines(1))}</div>
      ${box("Hook: how I'll grab attention in the first 15 seconds", lines(2))}
      ${[1, 2, 3].map(n => box(`Point ${n}: signpost words, the point, and my evidence or example`, lines(2))).join("")}
      ${box("Conclusion: sum up and leave them thinking", lines(2))}
      <div class="pp-cols">${box("Resource (picture, object, slides) and how it helps", lines(2))}${box("Delivery: tick when rehearsed", tick(["pace", "pauses", "eye contact", "emphasis", "tone"]))}</div>
      <div class="pp-cols">${box("Feedback: one strength", lines(1))}${box("Feedback: one next step", lines(1))}</div>`,
    answers: lookForPage(h, "Talk planner", ["An opening that tries to engage the audience", "Points in a logical order, with clear signposts (topic sentences, linking phrases)",
      "Ideas backed by detail or evidence", "A conclusion that sums up", "Tone, vocabulary and non-verbal techniques suited to the audience", "A resource that helps rather than distracts"])
  }));

  const BELL_ROCK = ["Eleven miles off the coast of Angus lies the Inchcape reef, a treacherous ridge of rock that is submerged by the sea at every high tide. For centuries, ships struck it in the dark and were wrecked.",
    "In 1807, the engineer Robert Stevenson began a project many people thought impossible: a stone lighthouse on the reef itself. The perilous work could only be done at low tide, for a few hours at a time, and the men lived on a ship anchored nearby. Each granite block was cut on land and shaped so that it dovetailed into its neighbours, locking the tower together against the waves.",
    "The ingenious design worked. The Bell Rock Lighthouse was first lit in 1810, and it still stands today: the oldest surviving sea-washed lighthouse in the world."];
  add("paper-reading-toolkit", T3("reading-fluently-and-using-reading-strategies"), "Reading toolkit", "Skim, scan, work out new words from roots and context, read aloud with expression, and summarise.", (who, h) => ({
    pupil: `${h.sheetHead("Reading toolkit", who)}
      ${BELL_ROCK.map((p, i) => `<p class="pp-passage"><b>${i + 1}</b> &nbsp;${p}</p>`).join("")}
      ${qs([`<b>Skim</b> the text in 20 seconds. What is it about, in one sentence?${lines(1)}`,
        `<b>Scan</b> for the facts: when was the lighthouse first lit? ${blank(4)} Who built it? ${blank(7)}`,
        `<b>Word work.</b> Use roots and context clues to explain: submerged (sub- means under) ${blank(10)} treacherous ${blank(10)} perilous ${blank(10)} dovetailed ${blank(10)} ingenious ${blank(10)}`,
        `<b>Read aloud.</b> In paragraph 2, mark / where you'd pause and underline two words to stress. Read it aloud twice.`,
        `<b>Summarise</b> each paragraph in one sentence.${lines(3)}`,
        `<b>Question.</b> Write one thing you'd still like to find out, and where you'd look.${lines(1)}`])}`,
    answers: answersPage(h, "Reading toolkit", ["The building of a lighthouse on a dangerous reef that's underwater at high tide", "1810; the engineer Robert Stevenson",
      "submerged: under the water; treacherous: dangerous, ready to cause harm; perilous: full of danger; dovetailed: fitted together tightly like interlocking pieces; ingenious: very clever and inventive",
      "Pauses at commas and full stops; stress words such as impossible, low tide, locking", "1: A hidden reef wrecked ships for centuries. 2: Stevenson built a lighthouse on it, working at low tide with interlocking stone blocks. 3: It worked, and it's still standing as the oldest of its kind.",
      "Any sensible question and a suitable source"], "Ask which strategy helped most, and listen to the reading for pace, pauses and expression.")
  }));

  const SOURCE_A = "The Forth Bridge carries the railway across the Firth of Forth between South Queensferry and North Queensferry. It opened in 1890 and was one of the first major structures in Britain built mainly of steel. Its design is called a cantilever bridge: three huge diamond-shaped towers support arms that reach out towards each other. The bridge is about 2.5 kilometres long. In 2015 it was named a UNESCO World Heritage Site.";
  const SOURCE_B = "Honestly, photos don't do it justice. Standing under the Forth Bridge, you feel tiny: it's this enormous red monster of steel stretching off across the water. Trains still rattle over it all day; we watched one from the beach at South Queensferry and it took ages to cross. People say painting it is a job that never ends, but a guide told us it was given a new coat between 2002 and 2011 that should last for decades. Definitely worth a day trip!";
  add("paper-two-sources", T3("finding-summarising-and-noting-information-from-more-than-one-source"), "Two sources", "Make linked notes from an information board and a travel blog, judge each source, then write a summary from both.", (who, h) => ({
    pupil: `${h.sheetHead("Two sources", who)}
      <p><b>Source A: a visitor information board</b></p><p class="pp-passage">${SOURCE_A}</p>
      <p><b>Source B: a travel blog</b></p><p class="pp-passage">${SOURCE_B}</p>
      <table class="pp-table"><tr><th>Question</th><th>Source A</th><th>Source B</th></tr>
        ${["When was it built, and what of?", "How long is it, and what is its design?", "Painting and colour", "What it's like to visit"].map(q => `<tr><td>${q}</td><td></td><td></td></tr>`).join("")}</table>
      ${box("Which source is better for facts, and which for what it's like? Why?", lines(2))}
      ${box("Summary in your own words, using both sources. Say which source each point came from.", lines(4))}`,
    answers: lookForPage(h, "Two sources", ["A: opened 1890, mainly steel, cantilever, about 2.5 km, World Heritage Site 2015. B: steel, red, repainted 2002 to 2011 to last decades, trains still use it, feels enormous, worth a visit",
      "Both: steel, railway, South Queensferry", "A is better for facts: it's an official information board giving dates and figures. B is better for the experience, but is personal opinion, and its painting fact is second-hand (\"a guide told us\"), so check it",
      "A summary in their own words that links both sources and names them, not copied sentences"])
  }));

  const STORM = ["The storm had been building all afternoon. By six o'clock, the sky over the harbour was the colour of a bruise, and the wind screamed through the rigging of the moored boats. Isla stood at the window, her hands pressed flat against the cold glass.",
    "Her father's boat was not in the harbour.",
    "She had checked three times. She checked again. The other boats rocked and tugged at their ropes like nervous dogs, but the space at the end of the pier, where the Morning Star always sat, was empty: a gap of black water.",
    "Behind her, the radio crackled. Isla did not turn round. If she did not hear the message, she told herself, it could not be bad news."];
  add("paper-close-reading", T3("close-reading-purpose-inference-and-language"), "Close reading", "A short story opening with literal, inferential, language and evaluative questions.", (who, h) => ({
    pupil: `${h.sheetHead("Close reading", who)}
      <div class="pp-passage" style="font-size:12.5pt">${STORM.map(p => `<p style="margin:0 0 6px">${p}</p>`).join("")}</div>
      ${qs([`<i>Literal.</i> What time is it, and where is Isla standing? ${lines(1)}`,
        `<i>Inferential.</i> How is Isla feeling? Give two pieces of evidence. ${lines(2)}`,
        `<i>Inferential.</i> Why does Isla not turn round when the radio crackles? ${lines(1)}`,
        `<i>Language.</i> "the wind screamed": name the technique and explain its effect. ${lines(1)}`,
        `<i>Language.</i> "the sky … was the colour of a bruise": what does this suggest about the storm? ${lines(1)}`,
        `<i>Language.</i> Why is "Her father's boat was not in the harbour." a paragraph on its own? ${lines(1)}`,
        `<i>Evaluative.</i> How well does this opening build tension? Refer to two techniques. ${lines(2)}`])}`,
    answers: answersPage(h, "Close reading", ["Six o'clock; at a window overlooking the harbour", "Afraid or anxious: hands pressed flat against the glass; checking again and again; not turning round to the radio",
      "She fears it's bad news about her father; while she doesn't hear it, she can still hope", "Personification: the wind sounds human, violent and frightening, adding to the danger and fear",
      "Dark, purple and painful-looking: the storm is threatening, and it hints at injury or harm", "It's short and stark, so the key fact stands out, shocks the reader and builds tension",
      "A judgement with evidence, such as the short paragraph, the personification, the simile \"like nervous dogs\", or the delayed radio message"],
      "Good language answers quote, name the technique, then explain the effect on the reader.")
  }));

  const SPRINT_ADVERT = "NEW SprintMax trainers! Run faster from the very first step. Our revolutionary FlexSpring sole gives you the edge every champion needs. Why settle for second best? 9 out of 10 runners agree: SprintMax makes you faster!* Don't get left behind: get yours today!<br><small>*Survey of 20 SprintMax staff, March.</small>";
  const SPRINT_TEST = "We tested SprintMax against three other running shoes priced between £50 and £90. Six club runners ran the same 5 km course in each pair, on different days. Their average times in SprintMax were within a few seconds of the other shoes, a difference too small to show the shoe made them faster. Testers found SprintMax comfortable, but the sole wore down after about 300 km, sooner than two of the others. Our verdict: a comfortable shoe at a fair price, but no evidence for the speed claims.";
  add("paper-trust-this", T3("persuasion-and-reliable-sources-in-reading"), "Can I trust this?", "An advert and a product test about the same trainers: persuasive techniques, facts and claims, reliability, and an informed view.", (who, h) => ({
    pupil: `${h.sheetHead("Can I trust this?", who)}
      <p><b>Text A: an advert</b></p><div class="pp-advert">${SPRINT_ADVERT}</div>
      <p><b>Text B: a product test in a consumer magazine</b></p><p class="pp-passage">${SPRINT_TEST}</p>
      <table class="pp-table"><tr><th>Technique in Text A</th><th>Quotation</th><th>Effect on the reader</th></tr>${"<tr><td></td><td></td><td></td></tr>".repeat(3)}</table>
      ${box("Read the small print in Text A. Why does it matter?", lines(2))}
      <table class="pp-table"><tr><th></th><th>Text A</th><th>Text B</th></tr>${["Who wrote it, and why?", "What evidence does it give?", "How reliable is it? (1–5)"].map(r => `<tr><th>${r}</th><td></td><td></td></tr>`).join("")}</table>
      ${box("Your informed view: would you buy SprintMax to run faster? Use both texts.", lines(3))}`,
    answers: answersPage(h, "Can I trust this?", ["Techniques: exaggerated word choice (\"revolutionary\", \"every champion\"), rhetorical question (\"Why settle for second best?\"), statistic (\"9 out of 10\"), commands and urgency (\"Don't get left behind\"), direct address (\"you\")",
      "The \"9 out of 10\" is from just 20 people, all working for SprintMax, so it's biased and tells us nothing", "A: the company, to sell trainers; no fair evidence; low. B: a consumer tester, to inform buyers; a test with six runners on the same course; higher, though six runners is a small test",
      "No for speed: the fair test found no real difference; a good answer may still choose them for comfort or price, weighing up both texts"])
  }));

  add("paper-under-surface", T3("character-setting-theme-and-the-writer-s-style"), "Under the surface", "For any story or novel: how a character changes, setting and mood, structure, theme, and the writer's style, with evidence.", (who, h) => ({
    pupil: `${h.sheetHead("Under the surface", who)}
      ${box("Text and author", lines(1))}
      <div class="pp-cols3">${["At the start", "In the middle", "At the end"].map(t => box(`Main character: ${t.toLowerCase()} (a quotation)`, lines(3))).join("")}</div>
      ${box("How and why the character changes", lines(2))}
      <div class="pp-cols">${box("Setting: a quotation", lines(2))}${box("The mood it creates, and how", lines(2))}</div>
      ${box("Structure: how the story is organised (order, chapters, viewpoint), and why the writer might have chosen it", lines(2))}
      ${box("Theme in one sentence, and how it links to my life or others' experiences", lines(2))}
      ${box("One feature of the writer's style or the genre, an example, and its effect", lines(2))}`,
    answers: lookForPage(h, "Under the surface", ["Evaluative comments on character, setting and structure, backed by quotations", "A theme stated as an idea, not a plot summary, and linked to real experience",
      "A feature of style or genre identified, with an example and its effect explained", "Evidence chosen from across the text, not just the opening"])
  }));

  const SUBJECT_WORDS = [["Science", ["hypothesis", "experiment", "temperature"]], ["Maths", ["perpendicular", "parallel", "equation"]], ["Social subjects", ["parliament", "government", "environment"]], ["English", ["rhythm"]]];
  add("paper-subject-spellings", T3("spelling-specialist-and-tricky-words-accurately"), "Subject spellings", "Syllables, roots, memory tricks, a dictation of specialist words, self-checking, and what a spellchecker misses.", (who, h) => ({
    pupil: `${h.sheetHead("Subject spellings", who)}
      ${qs([`<b>Syllables.</b> Split each word: photosynthesis ${blank(9)} temperature ${blank(8)} vocabulary ${blank(8)} environment ${blank(8)}`,
        `<b>Roots.</b> Write two words for each root: photo (light) ${blank(9)} graph (write) ${blank(9)} tele (far) ${blank(9)} bio (life) ${blank(9)} micro (small) ${blank(9)}`,
        `<b>Memory tricks.</b> Make up a trick for two of these: necessary, separate, rhythm, definitely, government.${lines(2)}`])}
      <div class="pp-q"><p><b>4. Dictation.</b> Your adult will say ten words. Write them, then circle any you're unsure of and check them in a dictionary.</p>
        <div class="pp-cols">${Array.from({ length: 10 }, (_, i) => `<p>${i + 1}. ${blank(10)}</p>`).join("")}</div></div>
      ${qs([`<b>Spellcheckers.</b> Correct this sentence: "Their going too the libary to by a knew dictionary." Which mistakes would a spellchecker miss, and why?${lines(2)}`,
        `<b>My list.</b> Five specialist words from my subjects this week:${lines(1)}`], 5)}`,
    answers: `${h.brandHead("For the adult: Subject spellings", "Say each word, use it in a sentence, then say it again.")}
      <table class="pp-table"><tr><th>Subject</th><th>Words to say</th></tr>${SUBJECT_WORDS.map(([s, ws]) => `<tr><td>${s}</td><td>${ws.join(", ")}</td></tr>`).join("")}</table>
      <ol class="ws-answers"><li>pho-to-syn-the-sis; tem-per-a-ture; vo-cab-u-la-ry; en-vi-ron-ment</li><li>For example photograph, photocopy; autograph, paragraph; telephone, television; biology, biography; microscope, microphone</li>
        <li>Any trick that works for the pupil, such as \"necessary: one collar, two sleeves\" or \"rhythm helps your two hips move\"</li><li>The ten words above</li>
        <li>They're going to the library to buy a new dictionary. A spellchecker misses their, too, by and knew because they're real words; it would catch libary.</li><li>Words from the pupil's own subjects</li></ol>`
  }), { needsAdult: true });

  add("paper-sentence-workshop", T3("sentences-punctuation-and-paragraphs"), "Sentence workshop", "Fix run-on sentences, build complex sentences, use colons, brackets, semicolons, ellipses and inverted commas, vary openings, and plan a paragraph.", (who, h) => ({
    pupil: `${h.sheetHead("Sentence workshop", who)}
      ${qs([`Fix this run-on sentence in three ways (a full stop, a semicolon, a conjunction): "The match was cancelled, it rained all day."${lines(3)}`,
        `Join into one complex sentence: "It was late. We kept walking. We wanted to reach the hut."${lines(1)}`,
        `Punctuate: <br>a) You will need three things a torch, a map and a warm coat.${lines(1)}b) My cousin who lives in Oban is visiting next week.${lines(1)}c) Where are you going asked Mum${lines(1)}d) I love summer my brother prefers winter.${lines(1)}`,
        `Write a sentence that ends with an ellipsis to build suspense.${lines(1)}`,
        `Rewrite so each sentence starts differently: "I got up late. I ran to the bus stop. I saw the bus leave."${lines(2)}`,
        `Write a paragraph on <i>the best way to spend a Saturday</i>. Include a topic sentence, one complex sentence, a colon, a pair of brackets and a linking phrase (However, As a result, In addition…).${lines(5)}`])}`,
    answers: answersPage(h, "Sentence workshop", ["The match was cancelled. It rained all day. / The match was cancelled; it rained all day. / The match was cancelled because it rained all day.",
      "For example: Although it was late, we kept walking because we wanted to reach the hut.", "a) things: a torch…  b) My cousin (who lives in Oban) is visiting next week.  c) \"Where are you going?\" asked Mum.  d) I love summer; my brother prefers winter.",
      "Any sentence where the ellipsis creates suspense, such as \"The door creaked open, and there, in the dark…\"", "For example: Waking up late, I ran to the bus stop. Just as I got there, the bus pulled away.",
      "A clear topic sentence, a complex sentence, and the colon, brackets and linking phrase used correctly"])
  }));

  const LITTER = "On saturday our class done a litter pick in the park. we picked up loads and loads of litter. there was crisp packets, cans, and loads of plastic bottles. It was good. Mr Reid said we had collected 14 bags wich is the most ever. The park looked much better after, people walking there thanked us. We are going to do it agian next term and anyone can come";
  add("paper-edit-design", T3("editing-and-layout-that-helps-the-reader"), "Edit and design", "Edit a report in three passes (meaning, language, accuracy), then design a poster for a different reader and explain the layout.", (who, h) => ({
    pupil: `${h.sheetHead("Edit and design", who)}
      <p class="pp-passage">${LITTER}</p>
      ${qs([`<b>Pass 1: meaning.</b> What would a reader from another school need to know that's missing?${lines(1)}`,
        `<b>Pass 2: language.</b> Replace the vague or repeated words (loads, good) with better ones.${lines(1)}`,
        `<b>Pass 3: accuracy.</b> Mark every spelling, punctuation and grammar mistake on the text.`,
        `Rewrite the report so it's clear at first reading.${lines(5)}`])}
      <div class="pp-side"><div class="pp-draw" style="width:70mm;height:60mm"></div><div class="pp-q"><p><b>5.</b> Sketch a poster inviting families to the next litter pick. Use a heading, bullet points and a picture.</p>
        <p><b>6.</b> Explain two of your layout choices: what does each do for your reader?</p>${lines(3)}</div></div>`,
    answers: answersPage(h, "Edit and design", ["Which park, why the class did it, and when the next one is and how to join", "For example: dozens of, a huge amount of; worthwhile, satisfying",
      "saturday → Saturday; done → did; we → We; there → There; was → were; wich → which; after, people → after. People; agian → again; full stop at the end",
      "For example: On Saturday, our class held a litter pick in Victoria Park. We collected a huge amount of rubbish: crisp packets, cans and dozens of plastic bottles. Mr Reid said our 14 bags were the most ever collected. The park looked much better afterwards, and people walking there thanked us. We will do it again next term, and anyone is welcome to join us.",
      "A heading, key details in bullet points (when, where, what to bring) and a picture", "Choices explained by their effect on the reader, such as finding the date quickly"])
  }));

  const BEES = "Honeybees live together in colonies. In summer, a strong colony can have more than 50,000 bees, but only one of them is the queen, who lays the eggs. The worker bees, which are all female, collect nectar and pollen from flowers. When a worker finds a good patch of flowers, she returns to the hive and performs a \"waggle dance\" that tells the others which direction to fly and how far to go. As they move from flower to flower, bees carry pollen with them, which helps many plants, including fruit crops such as apples, to produce seeds and fruit.";
  add("paper-notes-to-writing", T3("using-notes-and-sources-in-my-writing"), "From notes to writing", "Make notes from a source, put a point in your own words, quote correctly, record sources, and plan and start a short report.", (who, h) => ({
    pupil: `${h.sheetHead("From notes to writing", who)}
      <p><b>Source: an information leaflet</b></p><p class="pp-passage">${BEES}</p>
      ${qs([`Make notes: key words only, under headings you choose.${lines(3)}`,
        `Put this in your own words: "When a worker finds a good patch of flowers, she returns to the hive and performs a 'waggle dance'."${lines(2)}`,
        `Choose a short phrase worth quoting exactly. Write a sentence that uses it, in quotation marks.${lines(1)}`,
        `Find a second source on bees. Record it: title, author or organisation, date, web address.${lines(2)}`])}
      <div class="pp-cols">${box("Report plan: introduction", lines(1))}${box("Point 1, with detail", lines(1))}${box("Point 2, with detail", lines(1))}${box("Conclusion", lines(1))}</div>
      ${box("Write your opening paragraph", lines(3))}`,
    answers: lookForPage(h, "From notes to writing", ["Notes in key words, organised under headings, not copied sentences", "A rewording that keeps the meaning but changes the words and sentence structure",
      "A short, well-chosen quotation, correctly punctuated and fitted into the pupil's sentence", "A second source recorded with enough detail for someone else to find it, and a sensible choice of source",
      "A plan in a logical order, and an opening that introduces the topic for the reader"])
  }));

  add("paper-explain-it", T3("writing-to-inform-describe-and-explain"), "Explain it", "Plan and write an explanation of a process: reader, stages with topic sentences, cause and effect words, technical words and a diagram.", (who, h) => ({
    pupil: `${h.sheetHead("Explain it", who)}
      <div class="pp-cols">${box("The process I'll explain", lines(1))}${box("My reader, and what they know already", lines(1))}</div>
      ${box("Title, and an introduction: what it is and why it matters", lines(2))}
      ${[1, 2, 3].map(n => box(`Stage ${n}: topic sentence and detail`, lines(2))).join("")}
      <p class="pp-bank"><b>Linking words:</b> because, so, as a result, this means that, which causes, first, next, finally</p>
      <div class="pp-cols">${box("Technical words, and what they mean", lines(3))}${box("Diagram", `<div class="pp-draw pp-short"></div>`)}</div>
      ${box("Conclusion", lines(1))}`,
    answers: lookForPage(h, "Explain it", ["A style and format suited to the reader, with features of an explanation (title, introduction, stages, technical words, diagram)",
      "Relevant information with supporting detail, in a logical order", "Topic sentences that signpost each paragraph", "Linking words that show sequence and cause and effect", "A tone and vocabulary that suit the reader"])
  }));

  add("paper-make-case", T3("writing-to-persuade-and-argue"), "Make your case", "Plan a persuasive article: hook, view, points with evidence, the other side and an answer, techniques, and a conclusion.", (who, h) => ({
    pupil: `${h.sheetHead("Make your case", who)}
      ${box("Issue (for example: should the school day start later?)", lines(1))}
      <div class="pp-cols">${box("My view", lines(1))}${box("Hook to open with", lines(1))}</div>
      ${[1, 2, 3].map(n => box(`Point ${n}: point, evidence (a fact, statistic, expert or example), and why it matters`, lines(2))).join("")}
      ${box("The other side says… and my answer is…", lines(2))}
      ${box("Techniques I'll use", tick(["rhetorical question", "repetition", "emotive language", "statistic", "direct address"]))}
      ${box("Conclusion: sum up my line of thought, and end strongly", lines(2))}`,
    answers: lookForPage(h, "Make your case", ["A clear point of view, stated early, with an introduction that engages", "Points in a logical order with relevant evidence, signposted by topic sentences and linking phrases",
      "The other side answered, not ignored", "Persuasive language used on purpose, without relying on it instead of evidence", "A conclusion that sums up the argument"])
  }));

  add("paper-moment-mattered", T3("writing-about-a-personal-experience"), "A moment that mattered", "Plan personal writing: a feelings timeline, setting from the senses, showing not telling, and reflection.", (who, h) => ({
    pupil: `${h.sheetHead("A moment that mattered", who)}
      ${box("The experience, in one sentence", lines(1))}
      <h2 class="ws-sub">Feelings timeline</h2>
      <div class="pp-cols3">${["Before", "When it started", "The turning point", "Straight after", "Now, looking back"].map(t => box(t, lines(2))).join("")}</div>
      <div class="pp-cols3">${box("I could see…", lines(1))}${box("I could hear…", lines(1))}${box("I could feel or smell…", lines(1))}</div>
      ${box("Show, don't tell: rewrite \"I was nervous\" in two ways", lines(2))}
      ${box("Reflection: Looking back, I realise… / It taught me…", lines(2))}
      ${box("My opening paragraph", lines(3))}`,
    answers: lookForPage(h, "A moment that mattered", ["A clear context and setting for the events", "Events described with feelings and reactions made clear, changing as the experience goes on",
      "Feelings shown through actions, thoughts and the senses, not only named", "Some reflection on the experience", "Language, style and tone that engage the reader"])
  }));

  add("paper-story-builder", T3("creating-texts-in-a-genre-characters-and-settings"), "Story builder", "Plan a story in a chosen genre: its features, a convincing character, a setting with mood, a structure, then the opening scene.", (who, h) => ({
    pupil: `${h.sheetHead("Story builder", who)}
      <div class="pp-cols">${box("Genre", lines(1))}${box("Features readers expect from it", lines(1))}</div>
      <div class="pp-cols">${box("Character: name, what they want, what they fear", lines(2))}${box("A secret, how they speak, and a line of their dialogue", lines(2))}</div>
      ${box("Setting: three senses, and one detail that hints at the mood", lines(2))}
      <div class="pp-cols3">${["Hook", "Problem", "Rising tension", "Turning point", "Ending or cliffhanger"].map(t => box(t, lines(1))).join("")}</div>
      ${box("The opening scene", lines(7))}`,
    answers: lookForPage(h, "Story builder", ["Key features of the chosen genre used on purpose", "A character with believable wants, fears and a voice of their own",
      "A setting that comes to life through detail, and creates mood", "A structure planned to engage the reader, with an opening hook", "Language chosen for effect"])
  }));

  /* ===================== Fourth level (S3): maths ===================== */

  const T4 = id => `lesson-fourth-${id}`;
  // A four-quadrant grid, -n to n each way, s pixels a square, with optional labelled points
  const axesGrid = (n, s, pts = []) => {
    const o = n * s + 14, w = 2 * n * s + 28;
    return svg(w, w, `${gridLines(2 * n, 2 * n, s, 14, 14)}
      <line x1="14" y1="${o}" x2="${w - 14}" y2="${o}" class="pp-axis"/><line x1="${o}" y1="14" x2="${o}" y2="${w - 14}" class="pp-axis"/>
      ${Array.from({ length: 2 * n + 1 }, (_, i) => i - n).filter(k => k && k % 2 === 0).map(k => `<text x="${o + k * s - 4}" y="${o + 12}" class="pp-small">${k}</text><text x="${o - 16}" y="${o - k * s + 4}" class="pp-small">${k}</text>`).join("")}
      <text x="${w - 12}" y="${o + 4}" class="pp-small">x</text><text x="${o - 3}" y="11" class="pp-small">y</text>
      ${pts.map(([l, x, y]) => `<circle cx="${o + x * s}" cy="${o - y * s}" r="3" class="pp-dot"/><text x="${o + x * s + 4}" y="${o - y * s - 4}" class="pp-lab pp-halo">${l}</text>`).join("")}`);
  };

  add("paper-accurate-enough", T4("significant-figures-tolerance-and-error"), "Accurate enough?", "Significant figures, the cost of rounding too early, sensible accuracy, and checking measurements against a tolerance.", (who, h) => ({
    pupil: `${h.sheetHead("Accurate enough?", who)}
      <div class="pp-q"><p><b>1.</b> Round to the number of significant figures (s.f.) given.</p>
        <div class="pp-cols">${[["48 263", 1], ["48 263", 3], ["0·004 72", 2], ["0·060 49", 3], ["7·996", 3], ["152 841", 2]].map(([n, f]) => `<p>${n} to ${f} s.f. = ${blank(5)}</p>`).join("")}</div></div>
      ${qs([`A square floor has sides of 3·64 m. Find its area exactly. Then round the side to 1 decimal place first and find the area again. What is the difference, and what does it show?${lines(2)}`,
        `Fuel costs 142·9p a litre. A car uses 6·4 litres for every 100 km. How much does fuel cost for a 350 km trip? Give your answer to a sensible accuracy.${lines(2)}`,
        `A machine part must be 235 mm ± 1 mm. What are the smallest and largest acceptable lengths? ${blank(8)}`], 2)}
      <div class="pp-q"><p><b>5.</b> Bolts must be 50 mm ± 0·5 mm. Tick the ones that pass.</p>
        <table class="pp-table"><tr><th>Bolt</th>${["A", "B", "C", "D", "E"].map(b => `<th>${b}</th>`).join("")}</tr><tr><td>Length</td>${["49·3 mm", "49·5 mm", "50·2 mm", "50·6 mm", "49·9 mm"].map(l => `<td>${l}</td>`).join("")}</tr><tr><td>Pass?</td>${"<td class=\"pp-c\">☐</td>".repeat(5)}</tr></table></div>
      ${qs([`Why might a part need a tighter tolerance in an aircraft than in a garden shed?${lines(2)}`], 6)}`,
    answers: answersPage(h, "Accurate enough?", ["50 000; 48 300; 0·0047; 0·0605; 8·00; 150 000", "13·2496 m² exactly; 3·6 × 3·6 = 12·96 m²; difference 0·2896 m², nearly 0·3 m²: rounding early carries the error through",
      "6·4 × 3·5 = 22·4 litres; 22·4 × £1·429 = £32·0096, so £32·01", "234 mm and 236 mm", "B, C and E pass (49·5 to 50·5 mm is acceptable); A and D fail", "A small error matters far more where safety depends on parts fitting exactly"])
  }));

  add("paper-step-by-step", T4("multi-step-problems-and-the-order-of-operations"), "Plan it step by step", "The order of operations with brackets and powers, placing brackets, and multi-step problems with a written plan.", (who, h) => ({
    pupil: `${h.sheetHead("Plan it step by step", who)}
      ${qs([`Work out: 8 + 4 × 3 = ${blank(3)} &nbsp; (8 + 4) × 3 = ${blank(3)} &nbsp; 36 ÷ (4 + 2) × 3 − 2² = ${blank(3)} &nbsp; 5 + 3² × 2 − (10 − 4) ÷ 3 = ${blank(3)}`,
        `Put brackets into 2 + 6 × 5 − 3 to make each answer: 37 ${blank(9)} 14 ${blank(9)} 16 ${blank(9)}`,
        `A class of 28 pupils goes on a trip. The coach costs £540 for the group. Entry is £12·50 each, with a 10% group discount. A £150 deposit has already been paid. How much is still to pay in total, and how much is that per pupil?${lines(3)}`,
        `A garden is 12 m by 8 m. A path 1 m wide runs all the way round inside the edge. Turf for the area inside the path costs £4·75 per m². How much does the turf cost?${lines(3)}`,
        `Choose question 3 or 4. Write your plan: what you knew, what you needed, and the steps in order. Which earlier problem was it like?${lines(3)}`])}`,
    answers: answersPage(h, "Plan it step by step", ["20; 36; 14; 21", "(2 + 6) × 5 − 3 = 37; 2 + 6 × (5 − 3) = 14; (2 + 6) × (5 − 3) = 16",
      "Entry 28 × £12·50 = £350, less 10% = £315; total £540 + £315 = £855; less £150 deposit = £705 to pay; £705 ÷ 28 = £25·18 each (rounding up, so the total is covered)",
      "Inside the path: 10 m by 6 m = 60 m²; 60 × £4·75 = £285", "A clear plan in order, naming what was known and needed, and a sensible link to an earlier problem"])
  }));

  add("paper-big-small", T4("powers-roots-and-scientific-notation"), "Big and small numbers", "Roots as the inverse of powers, positive and negative square roots, and scientific notation in context.", (who, h) => ({
    pupil: `${h.sheetHead("Big and small numbers", who)}
      ${qs([`Evaluate. Give both answers where there are two: √81 = ${blank(3)} &nbsp; ∛64 = ${blank(3)} &nbsp; ∛125 = ${blank(3)} &nbsp; ⁴√81 = ${blank(3)} &nbsp; √0·25 = ${blank(3)} &nbsp; ∛(−8) = ${blank(3)}`,
        `2⁵ = 32. What is the fifth root of 32? Explain how you know.${lines(1)}`,
        `Write in scientific notation: 3 200 000 = ${blank(5)} &nbsp; 0·000 46 = ${blank(5)} &nbsp; 150 000 000 = ${blank(5)} &nbsp; 0·000 008 = ${blank(5)} &nbsp; 72 000 = ${blank(5)}`,
        `Write as ordinary numbers: 6·02 × 10⁵ = ${blank(7)} &nbsp; 9·1 × 10⁻³ = ${blank(7)} &nbsp; 1·08 × 10⁹ = ${blank(9)}`,
        `Use a calculator. Give the answers in scientific notation: (3 × 10⁴) × (2·5 × 10³) = ${blank(6)} &nbsp; (8·4 × 10⁶) ÷ (2·1 × 10²) = ${blank(6)}`,
        `Light travels about 3 × 10⁸ metres every second. How far does it travel in one minute?${lines(1)}`,
        `Put in order, smallest first: 4·5 × 10⁻³ &nbsp; 4·5 × 10² &nbsp; 5 × 10⁻⁴ &nbsp; 3·9 × 10²${lines(1)}`,
        `Why does √16 have two answers but ∛27 only one?${lines(2)}`])}`,
    answers: answersPage(h, "Big and small numbers", ["±9; 4; 5; 3; ±0·5; −2", "2: taking the fifth root undoes raising to the power 5", "3·2 × 10⁶; 4·6 × 10⁻⁴; 1·5 × 10⁸; 8 × 10⁻⁶; 7·2 × 10⁴",
      "602 000; 0·0091; 1 080 000 000", "7·5 × 10⁷; 4 × 10⁴", "1·8 × 10¹⁰ m", "5 × 10⁻⁴, 4·5 × 10⁻³, 3·9 × 10², 4·5 × 10²", "A negative times a negative is positive, so 4² and (−4)² are both 16; a cube of a negative is negative, so only 3 cubes to 27"])
  }));

  add("paper-up-or-down", T4("percentage-change-and-choosing-the-best-form"), "Up or down?", "Choose the quickest form, calculate percentage increases and decreases, use multipliers, and compare price changes.", (who, h) => ({
    pupil: `${h.sheetHead("Up or down?", who)}
      <div class="pp-q"><p><b>1.</b> Work these out in your head. Write the form you used (fraction, decimal or percentage).</p>
        <div class="pp-cols">${["25% of 48", "0·125 × 64", "20% of 35", "⅗ of 45"].map(c => `<p>${c} = ${blank(3)} &nbsp; form: ${blank(5)}</p>`).join("")}</div></div>
      <div class="pp-q"><p><b>2.</b> Find each percentage change. Say whether it is an increase or a decrease.</p>
        <table class="pp-table"><tr><th>Before</th><th>After</th><th>Change (%)</th></tr>${[["£240", "£276"], ["£450", "£378"], ["80 kg", "68 kg"], ["1250 visitors", "1400 visitors"]].map(([a, b]) => `<tr><td>${a}</td><td>${b}</td><td></td></tr>`).join("")}</table></div>
      ${qs([`Use a multiplier: increase £80 by 12·5% ${blank(4)} &nbsp; decrease £65 by 20% ${blank(4)} &nbsp; increase 360 by 5% ${blank(4)}`,
        `Shop A's £50 trainers go up 8%. Shop B's £48 trainers go up 12%. Which are cheaper now, and by how much?${lines(2)}`,
        `A £200 coat goes up 10%, then down 10%. Is it back to £200? Explain.${lines(2)}`], 3)}`,
    answers: answersPage(h, "Up or down?", ["12 (¼); 8 (⅛); 7 (⅕ or 10% doubled); 27 (⅕ is 9, × 3)", "+15%; −16%; −15%; +12%", "£90 (× 1·125); £52 (× 0·8); 378 (× 1·05)",
      "A: £54; B: £53·76. B is cheaper by 24p", "No: £200 × 1·1 = £220, then × 0·9 = £198. The fall is 10% of a bigger amount, so overall it's 1% lower"])
  }));

  add("paper-fractions-at-work", T4("calculating-with-fractions-and-mixed-numbers"), "Fractions at work", "Add, subtract and multiply fractions and mixed numbers, then solve problems with lengths, recipes, distances and pay.", (who, h) => ({
    pupil: `${h.sheetHead("Fractions at work", who)}
      <div class="pp-grid3">${["2⅓ + 1¾", "5⅙ − 2¾", "⅔ × ¾", "2⅖ × 1¼", "1½ × 2½", "4 × 2⅝"].map((c, i) => `<div class="pp-cell"><p><b>${i + 1}.</b> ${c} =</p><div class="pp-draw pp-short"></div></div>`).join("")}</div>
      ${qs([`A plank is 3¾ m long. ⅖ of it is cut off. How long is the piece cut off, and how much is left?${lines(2)}`,
        `A recipe needs 1½ cups of flour. You make 2½ times the recipe. How much flour do you need?${lines(1)}`,
        `Mo runs 2⅓ km on Monday and 3½ km on Tuesday. The target for the week is 8 km. How much further does Mo need to run?${lines(2)}`,
        `A tutor charges £12 an hour. How much is a 1¾-hour session?${lines(1)}`], 7)}`,
    answers: answersPage(h, "Fractions at work", ["4 1/12", "2 5/12", "½", "3", "3¾", "10½", "15/4 × 2/5 = 1½ m cut off; 2¼ m left", "3¾ cups", "2⅓ + 3½ = 5⅚ km; 8 − 5⅚ = 2⅙ km", "£21"])
  }));

  add("paper-proportion-problems", T4("direct-and-inverse-proportion"), "Proportion problems", "Direct and inverse proportion problems, sorting real situations, and a question to make you think.", (who, h) => ({
    pupil: `${h.sheetHead("Proportion problems", who)}
      ${qs([`A car uses 6 litres of fuel to travel 84 km. How far will it go on 10 litres?${lines(1)}`,
        `A journey takes 3 hours at 60 km/h. How long does it take at 45 km/h?${lines(1)}`,
        `250 g of flour makes 12 biscuits. How much flour do you need for 30 biscuits?${lines(1)}`,
        `5 workers take 12 days to build a wall. How many workers would build it in 4 days?${lines(1)}`,
        `4 painters take 6 days to paint a school. How long would 8 painters take? How much paint would they use, compared with 4 painters?${lines(2)}`])}
      <div class="pp-q"><p><b>6.</b> Direct proportion, inverse proportion, or neither?</p>
        <table class="pp-table"><tr><th>Situation</th><th>Direct</th><th>Inverse</th><th>Neither</th></tr>${["the cost of apples and how many you buy", "the time to fill a pool and the number of hoses", "a person's age and their height", "pay and hours worked, at a fixed hourly rate", "speed and journey time, for a fixed distance", "a taxi fare (with a fixed charge) and the miles travelled"].map(s => `<tr><td>${s}</td>${"<td class=\"pp-c\">☐</td>".repeat(3)}</tr>`).join("")}</table></div>`,
    answers: answersPage(h, "Proportion problems", ["140 km (14 km per litre)", "4 hours (the distance is 180 km)", "625 g", "15 workers (60 worker-days of work)", "3 days; the same amount of paint: it's the same school",
      "Direct, inverse, neither, direct, inverse, neither (the fixed charge means double the miles isn't double the fare)"])
  }));

  add("paper-my-payslip", T4("earnings-deductions-and-net-pay"), "My payslip", "Hourly pay against salary, overtime, commission, and working out net pay from a payslip with practice rates.", (who, h) => ({
    pupil: `${h.sheetHead("My payslip", who)}<p class="hint">The rates on this sheet are for practice only. Real tax and National Insurance rates change, and are published by the government each year.</p>
      ${qs([`Job A pays £11·50 an hour for 30 hours a week. Job B pays £18 000 a year. Which pays more each week, and by how much?${lines(2)}`,
        `Ali works 37 hours at £12 an hour, and 4 hours' overtime at time and a half. Find Ali's gross pay. If £68·40 is deducted, what is the net pay?${lines(2)}`])}
      <div class="pp-q"><p><b>3.</b> Complete this monthly payslip. Practice rates: income tax 20% and National Insurance 8%, each on pay above £1 048 a month; pension 5% of gross pay.</p>
        <table class="pp-table"><tr><th>Gross pay</th><td>£1 950·00</td></tr>${["Income tax", "National Insurance", "Pension", "Total deductions", "Net pay"].map(r => `<tr><th>${r}</th><td></td></tr>`).join("")}</table></div>
      ${qs([`A salesperson earns £1 400 a month plus 3% commission on sales. One month they sell £12 500. What is their gross pay?${lines(1)}`,
        `Using your answer to question 3, what is the net pay for a whole year?${lines(1)}`], 4)}`,
    answers: answersPage(h, "My payslip", ["A: £345 a week; B: £18 000 ÷ 52 = £346·15 a week, so B pays £1·15 more", "37 × £12 = £444; 4 × £18 = £72; gross £516; net £447·60",
      "Pay above £1 048: £902. Tax £180·40; NI £72·16; pension £97·50; total deductions £350·06; net pay £1 599·94", "£375 commission; £1 775 gross", "£1 599·94 × 12 = £19 199·28"])
  }));

  add("paper-borrow-save", T4("credit-debt-and-choosing-financial-products"), "Borrow, save or wait?", "The real cost of credit, comparing savings accounts and exchange offers, and deciding what someone can afford.", (who, h) => ({
    pupil: `${h.sheetHead("Borrow, save or wait?", who)}
      ${qs([`A laptop costs £600 now, or £55 a month for 12 months. How much more does paying monthly cost? As a percentage?${lines(1)}`,
        `Option 1: borrow £900 now and repay £80 a month for 12 months. Option 2: save £75 a month for 12 months, then buy. Compare the cost of each, and say what else matters.${lines(2)}`])}
      <div class="pp-q"><p><b>3.</b> Two savings accounts for one year. Which earns more for each amount?</p>
        <table class="pp-table"><tr><th>Saved</th><th>Account A: 3% a year</th><th>Account B: 2·5% a year + £10 bonus</th><th>Better</th></tr>${["£1 000", "£3 000"].map(a => `<tr><td>${a}</td><td></td><td></td><td></td></tr>`).join("")}</table></div>
      <div class="pp-q"><p><b>4.</b> Holiday money. Exchange A: €1·15 for every £1, no fee. Exchange B: €1·18 for every £1, but a £5 fee is taken first.</p>
        <table class="pp-table"><tr><th>Change</th><th>A gives</th><th>B gives</th><th>Better</th></tr>${["£300", "£100"].map(a => `<tr><td>${a}</td><td></td><td></td><td></td></tr>`).join("")}</table></div>
      ${qs([`Jamie's net income is £1 600 a month. Rent £650, bills £220, food £250, travel £90, and an existing loan of £120. Can Jamie afford car finance at £180 a month? Explain the impact.${lines(3)}`], 5)}`,
    answers: answersPage(h, "Borrow, save or wait?", ["£660 in all: £60 more, 10%", "Borrowing costs £960 but you have it now; saving costs £900 but you wait a year. Also: interest, the risk of missing payments, and whether you need it now",
      "£1 000: A £30, B £35, so B. £3 000: A £90, B £85, so A", "£300: A €345, B €348·10, so B. £100: A €115, B €112·10, so A",
      "Costs £1 330, leaving £270. Finance would leave only £90 for everything else and no savings, so it's risky: one unexpected bill could mean missed payments and more debt"])
  }));

  add("paper-around-world", T4("time-zones-planning-and-speed-with-decimal-hours"), "Around the world", "Time zones and midnight, decimal hours, speed, distance and time, durations across months, and a revision plan.", (who, h) => ({
    pupil: `${h.sheetHead("Around the world", who)}
      ${qs([`A flight leaves Glasgow at 21:40 and takes 7 hours 50 minutes. New York is 5 hours behind the UK. What is the time in New York when it lands?${lines(2)}`,
        `In winter, Tokyo is 9 hours ahead of the UK. A meeting is at 19:00 in Tokyo. What time is that in the UK? ${blank(4)}`,
        `Convert: 36 minutes = ${blank(3)} hours &nbsp; 1 hour 24 minutes = ${blank(3)} hours &nbsp; 2·75 hours = ${blank(6)} &nbsp; 0·2 hours = ${blank(4)}`,
        `A train travels 186 km in 1 hour 33 minutes. What is its average speed?${lines(1)}`,
        `A cyclist rides at 18 km/h for 2 hours 20 minutes. How far do they go?${lines(1)}`,
        `How long does it take to travel 165 km at 66 km/h?${lines(1)}`,
        `How many days is it from 18 March to 4 May?${lines(1)}`])}
      ${box("8. Plan a revision evening from 16:30 to 21:30: include fixed times (tea at 18:00 for 45 minutes), three study blocks with breaks, and the time spent studying in hours as a decimal.", lines(3))}`,
    answers: answersPage(h, "Around the world", ["It lands at 05:30 UK time the next day, which is 00:30 in New York", "10:00", "0·6; 1·4; 2 hours 45 minutes; 12 minutes", "1 hour 33 minutes = 1·55 hours; 186 ÷ 1·55 = 120 km/h",
      "2⅓ hours × 18 = 42 km", "2·5 hours (2 hours 30 minutes)", "13 + 30 + 4 = 47 days", "Any workable plan that adds up, with study time correctly given in decimal hours"])
  }));

  add("paper-wrap-it-up", T4("surface-area-and-using-materials-efficiently"), "Wrap it up", "Areas of trapeziums, kites and parallelograms, and surface areas of cuboids, prisms and cylinders, for packaging.", (who, h) => ({
    pupil: `${h.sheetHead("Wrap it up", who)}
      ${qs([`Find the area of: a trapezium with parallel sides 7 cm and 11 cm, and height 5 cm ${blank(4)}; a kite with diagonals 10 cm and 6 cm ${blank(4)}; a parallelogram with base 9 cm and height 4 cm ${blank(4)}`,
        `Two boxes both hold 1000 cm³: a 10 cm cube, and a cuboid 20 cm × 10 cm × 5 cm. Find the surface area of each. Which needs less card?${lines(2)}`,
        `A triangular prism is 10 cm long. Its ends are right-angled triangles with sides 3 cm, 4 cm and 5 cm. Find its surface area. Sketch the net first.${lines(1)}<div class="pp-draw pp-short"></div>`,
        `Find the surface area of a closed cylinder with radius 3 cm and height 10 cm.${lines(2)}`,
        `A label wraps round the curved side of a tin with radius 4 cm and height 11 cm. What area of paper does each label need?${lines(1)}`,
        `Why should you keep full accuracy (and use the π key) until the last step?${lines(1)}`])}`,
    answers: answersPage(h, "Wrap it up", ["45 cm²; 30 cm²; 36 cm²", "Cube: 6 × 100 = 600 cm². Cuboid: 2(200 + 50 + 100) = 700 cm². The cube needs less card", "Two triangles 2 × 6 = 12, plus rectangles 30 + 40 + 50 = 120: 132 cm²",
      "Curved 60π, ends 18π: 78π ≈ 245·0 cm²", "2π × 4 × 11 = 88π ≈ 276·5 cm²", "Rounding early (for example using π = 3·14 or rounding a radius) adds errors that grow through the calculation"])
  }));

  add("paper-fill-it-up", T4("volume-of-prisms-and-cylinders"), "Fill it up", "Volumes of triangular and trapezium prisms and cylinders, converting to litres, and working backwards.", (who, h) => ({
    pupil: `${h.sheetHead("Fill it up", who)}
      ${qs([`Find the volume of a triangular prism: triangle base 6 cm, triangle height 4 cm, length 15 cm.${lines(1)}`,
        `Find the volume of a cylinder with radius 5 cm and height 12 cm.${lines(1)}`,
        `A tent is a triangular prism. Its end is a triangle 2 m wide and 1·5 m high, and it is 3 m long. How much air does it hold?${lines(1)}`,
        `A skip's end is a trapezium with parallel sides 1·2 m and 2 m, and height 0·8 m. The skip is 3 m long. Find its volume.${lines(2)}`,
        `A cylindrical tank has radius 20 cm and height 50 cm. How many litres does it hold? How many full 330 ml cans would it fill?${lines(2)}`,
        `Convert: 1500 cm³ = ${blank(3)} litres &nbsp; 1 m³ = ${blank(4)} litres`,
        `A 1 litre cylinder has radius 5 cm. How tall must it be?${lines(2)}`])}`,
    answers: answersPage(h, "Fill it up", ["12 × 15 = 180 cm³", "300π ≈ 942·5 cm³", "1·5 × 3 = 4·5 m³", "½ × 3·2 × 0·8 = 1·28 m²; × 3 = 3·84 m³", "20 000π ≈ 62 832 cm³ ≈ 62·8 litres; 190 full cans",
      "1·5; 1000", "1000 ÷ (25π) ≈ 12·7 cm"])
  }));

  add("paper-maths-at-work", T4("maths-in-careers-and-the-workplace"), "Maths in careers", "Research the maths in three careers, with a worked example from one, then plan a presentation with others.", (who, h) => ({
    pupil: `${h.sheetHead("Maths in careers", who)}
      <table class="pp-table"><tr><th>Career</th><th>Maths used, and what for</th><th>Where I found this</th></tr>${"<tr><td style=\"height:52px\"></td><td></td><td></td></tr>".repeat(3)}</table>
      ${box("A worked example of the maths in one of these jobs", `<div class="pp-draw"></div>`)}
      ${box("Which maths skill came up most? Why might that be?", lines(2))}
      <div class="pp-cols">${box("Presentation: who does which part", lines(3))}${box("Our opening, our three points, and our ending", lines(3))}</div>
      ${box("A STEM career I hadn't thought of, and the maths it needs", lines(2))}`,
    answers: lookForPage(h, "Maths in careers", ["Three careers researched from reliable sources, such as official careers information", "Maths described accurately and linked to real tasks in each job",
      "A correct worked example using the right vocabulary", "A sensible conclusion about the skills that matter most", "A shared presentation with a clear structure and contributions from each person"])
  }));

  add("paper-nth-term", T4("sequences-finding-the-nth-term"), "nth term", "Find nth-term formulae for linear sequences, use them forwards and backwards, and decide whether a number is in a sequence.", (who, h) => ({
    pupil: `${h.sheetHead("nth term", who)}
      <div class="pp-q"><p><b>1.</b> Tables in a row: 1 table seats 6, 2 tables seat 10, 3 tables seat 14.</p>
        ${svg(330, 60, [1, 2, 3].map((k, i) => { const x0 = [10, 80, 190][i]; return `${Array.from({ length: k }, (_, j) => `<rect x="${x0 + j * 30}" y="20" width="30" height="20" class="pp-shape"/>`).join("")}`; }).join(""))}
        <p>Formula for the seats, S, for n tables: ${blank(5)} &nbsp; Seats for 25 tables: ${blank(3)} &nbsp; Tables needed to seat 150: ${blank(3)}</p></div>
      <div class="pp-q"><p><b>2.</b> Find the nth term, then use it.</p>
        <table class="pp-table"><tr><th>Sequence</th><th>nth term</th><th>Question</th><th>Answer</th></tr>
          ${[["7, 11, 15, 19 …", "Which term is 123?"], ["5, 8, 11, 14 …", "Find the 100th term."], ["20, 17, 14, 11 …", "Find the 15th term."], ["−3, 2, 7, 12 …", "Find the 10th term."]].map(([s, q]) => `<tr><td>${s}</td><td></td><td>${q}</td><td></td></tr>`).join("")}</table></div>
      ${qs([`Is 200 in the sequence 7, 11, 15, 19 …? Is 99 in 5, 8, 11, 14 …? Explain each answer.${lines(2)}`,
        `Make up a growing pattern of your own. Draw the first three, and write its nth term.<div class="pp-draw pp-short"></div>`], 3)}`,
    answers: answersPage(h, "nth term", ["S = 4n + 2; 102 seats; 4n + 2 = 150 gives n = 37 tables", "4n + 3, 30th term; 3n + 2, 302; 23 − 3n, −22; 5n − 8, 42",
      "No: 4n + 3 = 200 gives n = 49·25, not a whole number. No: 3n + 2 = 99 gives n = 32⅓", "Any pattern with a correct linear nth term"])
  }));

  add("paper-slopes-lines", T4("gradient-and-straight-line-graphs"), "Slopes and lines", "Gradients from coordinates, ramps against a building rule, horizontal and vertical lines, and plotting y = 2x − 1.", (who, h) => ({
    pupil: `${h.sheetHead("Slopes and lines", who)}
      <div class="pp-side"><div>${axesGrid(6, 15)}</div><div>
        ${qs([`Find the gradient of the line through: (1, 2) and (5, 10) ${blank(3)}; (−2, 5) and (4, 2) ${blank(3)}; (0, 3) and (6, 3) ${blank(3)}`,
          `Write the equation of: the line through (3, −1) and (3, 4) ${blank(4)}; the horizontal line through (2, −4) ${blank(4)}`,
          `Complete the table for y = 2x − 1, plot the points on the grid and join them.
            <table class="pp-table"><tr><th>x</th>${[-2, -1, 0, 1, 2, 3].map(x => `<td class="pp-c">${x}</td>`).join("")}</tr><tr><th>y</th>${"<td></td>".repeat(6)}</tr></table>`,
          `From your graph: y when x = 2·5 ${blank(3)}; x when y = 0 ${blank(3)}`])}</div></div>
      ${qs([`A rule says a ramp can be no steeper than 1 in 12 (a gradient of 1 ÷ 12). Ramp A rises 0·5 m over 5 m. Ramp B rises 0·4 m over 6 m. Does each meet the rule? Show your working.${lines(3)}`,
        `Why does a vertical line have no gradient?${lines(1)}`], 5)}`,
    answers: answersPage(h, "Slopes and lines", ["2; −½; 0", "x = 3; y = −4", "y = −5, −3, −1, 1, 3, 5: a straight line through (0, −1) with gradient 2", "4; 0·5",
      "A: 0·5 ÷ 5 = 0·1, steeper than 1 ÷ 12 ≈ 0·083, so it fails. B: 0·4 ÷ 6 ≈ 0·067 (1 in 15), so it meets the rule", "The horizontal change is 0, and you can't divide by 0"])
  }));

  add("paper-expand-factorise", T4("brackets-and-factorising"), "Expand and factorise", "Expand brackets with the distributive law, simplify, evaluate, and factorise using the highest common factor.", (who, h) => ({
    pupil: `${h.sheetHead("Expand and factorise", who)}
      <div class="pp-q"><p><b>1.</b> Expand.</p><div class="pp-cols">${["3(x + 5)", "4(2a − 3)", "−2(x − 3)", "x(x + 4)"].map((e, i) => `<p>${String.fromCharCode(97 + i)}) ${e} = ${blank(7)}</p>`).join("")}</div></div>
      <div class="pp-q"><p><b>2.</b> Expand and simplify.</p><div class="pp-cols">${["5(2y + 1) − 3y", "2(3a − 4) + 5a", "4(2x + 1) − 3(x − 2)", "3(p + 2) + 2(p − 5)"].map((e, i) => `<p>${String.fromCharCode(97 + i)}) ${e} = ${blank(7)}</p>`).join("")}</div></div>
      <div class="pp-q"><p><b>3.</b> Factorise fully.</p><div class="pp-cols">${["6x + 9", "8y − 12", "15a − 20", "14 + 21m", "12x − 18", "10ab + 15a"].map((e, i) => `<p>${String.fromCharCode(97 + i)}) ${e} = ${blank(7)}</p>`).join("")}</div></div>
      ${qs([`Find 5(2p − 3) when p = −1 ${blank(4)}, and 2(a − b) when a = 3 and b = −4 ${blank(4)}`,
        `A rectangle is 4 cm wide and (x + 7) cm long. Write and simplify an expression for its area. ${blank(8)}`,
        `Sam factorises 12x − 18 as 2(6x − 9). Is that fully factorised? Explain.${lines(2)}`], 4)}`,
    answers: answersPage(h, "Expand and factorise", ["a) 3x + 15  b) 8a − 12  c) −2x + 6  d) x² + 4x", "a) 7y + 5  b) 11a − 8  c) 5x + 10  d) 5p − 4",
      "a) 3(2x + 3)  b) 4(2y − 3)  c) 5(3a − 4)  d) 7(2 + 3m)  e) 6(2x − 3)  f) 5a(2b + 3)", "−25; 14", "4(x + 7) = 4x + 28 cm²", "No: 6 is the highest common factor, so 6(2x − 3)"])
  }));

  add("paper-balance-it", T4("harder-equations-and-inequalities"), "Balance it", "Equations with unknowns on both sides and brackets, inequalities on a number line, and real problems.", (who, h) => ({
    pupil: `${h.sheetHead("Balance it", who)}
      <div class="pp-q"><p><b>1.</b> Solve.</p><div class="pp-grid3">${["5x + 4 = 2x + 19", "7x − 3 = 4x + 9", "2x + 10 = 5x − 8", "3(x − 2) = x + 8", "4(x + 1) = 2(x + 7)", "5(2x − 1) = 3(2x + 5)"].map((e, i) => `<div class="pp-cell"><p>${String.fromCharCode(97 + i)}) ${e}</p><div class="pp-draw pp-short"></div></div>`).join("")}</div></div>
      ${qs([`Solve and show each on a number line: 4x − 3 > 13 ${blank(4)} &nbsp; 3x − 5 ≤ 16 ${blank(4)} &nbsp; 2x + 7 ≥ 1 ${blank(4)}`,
        `Solve −2 ≤ x + 3 < 5 and list the whole numbers that fit.${lines(1)}`,
        `Phone plan A: £15 plus £2 a gigabyte. Plan B: £25 plus £1 a gigabyte. Write an equation to find when they cost the same, and solve it. When is plan A cheaper?${lines(2)}`,
        `A rectangle's length is 3 cm more than its width, and its perimeter is 46 cm. Write an equation and find its length and width.${lines(2)}`,
        `Solve −2x > 6. Why does the sign change?${lines(1)}`], 2)}`,
    answers: answersPage(h, "Balance it", ["a) 5  b) 4  c) 6  d) 7  e) 5  f) 5", "x > 4; x ≤ 7; x ≥ −3", "−5 ≤ x < 2: −5, −4, −3, −2, −1, 0, 1", "15 + 2g = 25 + g, so g = 10 GB; A is cheaper below 10 GB",
      "2w + 2(w + 3) = 46: width 10 cm, length 13 cm", "x < −3: dividing by a negative reverses the order (for example 2 < 3 but −2 > −3)"])
  }));

  add("paper-right-triangles", T4("pythagoras-and-trigonometry-in-right-angled-triangles"), "Pythagoras and trigonometry", "Pythagoras' theorem for any side, trigonometry for sides and angles, and choosing the right tool in context.", (who, h) => ({
    pupil: `${h.sheetHead("Pythagoras and trigonometry", who)}<p>Sketch and label each triangle first. Give lengths to 1 decimal place and angles to the nearest 0·1°.</p>
      ${qs([`Find the hypotenuse when the other two sides are 9 cm and 12 cm ${blank(3)}, and when they are 5 cm and 12 cm ${blank(3)}`,
        `The hypotenuse is 10 cm and one side is 6 cm. Find the other side. ${blank(3)}`,
        `A 5 m ladder leans against a wall with its foot 3 m from the wall. How high up the wall does it reach?${lines(1)}`,
        `A TV screen is 80 cm wide and 45 cm tall. How long is its diagonal?${lines(1)}`,
        `An angle is 35° and the side next to it (not the hypotenuse) is 8 cm. Find the side opposite the angle.${lines(1)}`,
        `The hypotenuse is 12 cm and one angle is 40°. Find the side opposite that angle.${lines(1)}`,
        `A ramp rises 1·2 m over a horizontal distance of 6 m. Find the angle it makes with the ground.${lines(1)}`,
        `A kite is flown on a 30 m string. It is 18 m above the ground. Find the angle between the string and the ground.${lines(1)}`,
        `Is a triangle with sides 7 cm, 24 cm and 25 cm right-angled? Show how you know.${lines(1)}`])}`,
    answers: answersPage(h, "Pythagoras and trigonometry", ["15 cm; 13 cm", "8 cm", "4 m", "√8425 ≈ 91·8 cm", "8 × tan 35° ≈ 5·6 cm", "12 × sin 40° ≈ 7·7 cm", "tan⁻¹(1·2 ÷ 6) ≈ 11·3°", "sin⁻¹(18 ÷ 30) ≈ 36·9°", "Yes: 7² + 24² = 49 + 576 = 625 = 25²"])
  }));

  add("paper-round-and-round", T4("circles-circumference-and-area"), "Round and round", "Circumference and area of circles, working back to the radius or diameter, and a wheel problem.", (who, h) => ({
    pupil: `${h.sheetHead("Round and round", who)}<p>Use the π key. Give answers to 1 decimal place.</p>
      <table class="pp-table"><tr><th>Circle</th><th>Circumference</th><th>Area</th></tr>${["diameter 14 cm", "radius 6 m", "radius 2·5 cm"].map(c => `<tr><td>${c}</td><td></td><td></td></tr>`).join("")}</table>
      ${qs([`A circle has a circumference of 50 cm. Find its diameter.${lines(1)}`,
        `A circular pond has an area of 50 m². Find its radius.${lines(1)}`,
        `A bike wheel has a diameter of 66 cm. How far does the bike travel, in metres, when the wheel turns 100 times?${lines(2)}`,
        `Find the area of a semicircle with radius 10 cm.${lines(1)}`], 2)}
      <div class="pp-q"><p><b>6.</b> Measure three round objects at home or school.</p>
        <table class="pp-table"><tr><th>Object</th><th>Circumference</th><th>Diameter</th><th>Circumference ÷ diameter</th></tr>${"<tr><td></td><td></td><td></td><td></td></tr>".repeat(3)}</table></div>`,
    answers: answersPage(h, "Round and round", ["Diameter 14 cm: C ≈ 44·0 cm, A ≈ 153·9 cm². Radius 6 m: C ≈ 37·7 m, A ≈ 113·1 m². Radius 2·5 cm: C ≈ 15·7 cm, A ≈ 19·6 cm²",
      "50 ÷ π ≈ 15·9 cm", "√(50 ÷ π) ≈ 4·0 m", "66π ≈ 207·3 cm per turn; 100 turns ≈ 207·3 m", "½ × π × 100 ≈ 157·1 cm²", "Each ratio should be close to 3·14"])
  }));

  add("paper-circles-similar", T4("circle-angle-facts-and-similar-shapes"), "Circles and similar shapes", "Tangent and semicircle angle facts, isosceles triangles from radii, and lengths and areas of similar shapes.", (who, h) => {
    const fig = svg(220, 170, `<circle cx="90" cy="85" r="60" class="pp-shape"/><circle cx="90" cy="85" r="2.5" class="pp-dot"/><text x="78" y="82" class="pp-lab">O</text>
      <line x1="30" y1="85" x2="150" y2="85" class="pp-shape"/><line x1="30" y1="85" x2="126" y2="37" class="pp-shape"/><line x1="150" y1="85" x2="126" y2="37" class="pp-shape"/>
      <text x="14" y="90" class="pp-lab">A</text><text x="154" y="98" class="pp-lab">B</text><text x="126" y="30" class="pp-lab">C</text><text x="52" y="81" class="pp-lab">35°</text>`);
    return {
      pupil: `${h.sheetHead("Circles and similar shapes", who)}<p>Diagrams are not to scale. Give a reason for each angle.</p>
        ${qs([`A tangent touches a circle at T. O is the centre. A point P on the tangent is joined to O. Angle TOP = 52°. Sketch it, then find angle OPT.${lines(1)}`])}
        <div class="pp-side"><div>${fig}</div><div class="pp-q"><p><b>2.</b> AB is a diameter and C is on the circle. Angle CAB = 35°. Find angle ACB ${blank(2)} and angle CBA ${blank(2)}, with reasons.</p>${lines(2)}</div></div>
        ${qs([`O is the centre, and A and B are on the circle. Angle AOB = 110°. Find angle OAB. Why is triangle AOB isosceles?${lines(2)}`,
          `Two similar photos are 6 cm and 15 cm wide. The small one is 4 cm tall. How tall is the large one? How many times bigger is its area?${lines(2)}`,
          `A triangle with sides 3 cm, 4 cm and 5 cm is enlarged so its shortest side is 7·5 cm. Find the other two sides.${lines(1)}`,
          `A 5 cm by 8 cm rectangle is enlarged to a similar rectangle with an area of 360 cm². What is the scale factor?${lines(2)}`], 3)}`,
      answers: answersPage(h, "Circles and similar shapes", ["38° (angle OTP = 90°, as a tangent meets a radius at right angles; 180 − 90 − 52)", "ACB = 90° (angle in a semicircle); CBA = 55° (angles in a triangle)",
        "35°: OA and OB are both radii, so the base angles are equal: (180 − 110) ÷ 2", "Scale factor 2·5: 10 cm tall; area 2·5² = 6·25 times bigger", "Scale factor 2·5: 10 cm and 12·5 cm", "Area 40 → 360 is × 9, so the scale factor is 3"])
    };
  });

  add("paper-move-turn", T4("transformations-and-rotational-symmetry"), "Move it and turn it", "Reflect and translate on a four-quadrant grid, describe transformations, and find orders of rotational symmetry.", (who, h) => {
    const pat = svg(8 * 16 + 4, 8 * 16 + 4, `${gridLines(8, 8, 16, 2, 2)}${[[1, 0], [2, 1], [3, 1], [0, 2], [3, 2], [2, 3]].map(([x, y]) => `<rect x="${2 + x * 16}" y="${2 + y * 16}" width="16" height="16" class="pp-fill"/>`).join("")}<circle cx="66" cy="66" r="3" class="pp-dot"/>`);
    return {
      pupil: `${h.sheetHead("Move it and turn it", who)}
        <div class="pp-side"><div>${axesGrid(6, 15, [["P", 1, 1], ["Q", 3, 1], ["R", 3, 4]])}</div><div>
          ${qs([`Reflect triangle PQR in the x-axis. New coordinates: ${blank(9)}`,
            `Reflect PQR in the y-axis. New coordinates: ${blank(9)}`,
            `Translate PQR 2 left and 5 down. New coordinates: ${blank(9)}`,
            `A triangle at (1, 1), (2, 1), (1, 3) moves to (4, −1), (5, −1), (4, 1). Describe the transformation fully.${lines(1)}`,
            `Reflect the point (2, 5) in the line x = 1. ${blank(3)}`])}</div></div>
        <div class="pp-q"><p><b>6.</b> Give the order of rotational symmetry.</p>
          <div class="pp-next">${["square", "regular hexagon", "rectangle", "equilateral triangle", "letter S", "letter H", "kite", "parallelogram"].map(n => `<span>${n} ${blank(2)}</span>`).join("")}</div></div>
        <div class="pp-side"><div>${pat}</div><p><b>7.</b> Complete the design so it has rotational symmetry of order 4 about the dot in the centre. Tracing paper helps.</p></div>`,
      answers: answersPage(h, "Move it and turn it", ["(1, −1), (3, −1), (3, −4)", "(−1, 1), (−3, 1), (−3, 4)", "(−1, −4), (1, −4), (1, −1)", "A translation 3 right and 2 down", "(0, 5)",
        "4, 6, 2, 3, 2, 2, 1 (no rotational symmetry), 2", "The six shaded squares rotated a quarter, half and three-quarter turn about the centre: 24 squares shaded in all"])
    };
  });

  add("paper-which-average", T4("averages-and-spread"), "Which average?", "Mean, median, mode and range, choosing the right average, comparing spread, and a missing value.", (who, h) => ({
    pupil: `${h.sheetHead("Which average?", who)}
      ${qs([`For 4, 7, 7, 9, 12, 15 find: mean ${blank(3)} median ${blank(3)} mode ${blank(3)} range ${blank(3)}`,
        `Five people earn £18 000, £20 000, £21 000, £22 000 and £150 000. Find the mean and the median. A company says its "average" pay is the mean. Why could that mislead?${lines(3)}`,
        `A shoe shop sold these sizes: 5, 6, 6, 7, 7, 7, 8, 8, 9, 10. Which average helps the shop decide what to order? Find it. ${lines(1)}`,
        `Class A and class B both have a mean test score of 62. Class A's range is 20 and class B's is 55. What does this tell you?${lines(2)}`])}
      <div class="pp-q"><p><b>5.</b> Which average would you use, and why?</p>
        <table class="pp-table"><tr><th>Situation</th><th>Average</th><th>Why</th></tr>${["house prices in a town", "the most popular coat size", "the average temperature over a week"].map(s => `<tr><td>${s}</td><td></td><td></td></tr>`).join("")}</table></div>
      ${qs([`Five numbers have a mean of 8. Four of them are 6, 9, 10 and 4. What is the fifth?${lines(1)}`], 6)}`,
    answers: answersPage(h, "Which average?", ["Mean 9; median 8; mode 7; range 11", "Mean £46 200; median £21 000. One very high salary pulls the mean up: four of the five earn far less than £46 200", "The mode, size 7: the size sold most",
      "Same average, but class B's scores are much more spread out (less consistent)", "Median (a few very expensive houses distort the mean); mode (the size people buy most); mean (no extreme values)", "5 × 8 = 40; 40 − 29 = 11"])
  }));

  add("paper-data-says", T4("interpreting-data-correlation-and-choosing-diagrams"), "What does the data say?", "Describe correlation on a scatter graph, make a stem and leaf diagram, sort data types and choose diagrams.", (who, h) => {
    const pts = [[150, 22], [155, 23], [158, 23], [160, 24], [162, 24], [165, 25], [168, 26], [170, 25], [172, 27], [175, 27], [178, 28], [182, 29], [163, 26], [176, 26]];
    const scatter = svg(250, 190, `<line x1="40" y1="160" x2="240" y2="160" class="pp-axis"/><line x1="40" y1="10" x2="40" y2="160" class="pp-axis"/>
      ${pts.map(([x, y]) => `<circle cx="${40 + (x - 145) * 5.5}" cy="${160 - (y - 21) * 17}" r="3" class="pp-dot"/>`).join("")}
      <text x="96" y="182" class="pp-small">Height (cm), 145 to 180</text><text x="2" y="90" class="pp-small">Foot</text><text x="2" y="102" class="pp-small">(cm)</text>`);
    return {
      pupil: `${h.sheetHead("What does the data say?", who)}
        <div class="pp-side"><div>${scatter}</div><div>${qs([`Describe the correlation between height and foot length. How strong is it?${lines(2)}`,
          `Ice cream sales and sunburn cases are positively correlated. Does ice cream cause sunburn? Explain.${lines(2)}`])}</div></div>
        <div class="pp-q"><p><b>3.</b> Reaction times (hundredths of a second): 23, 31, 27, 35, 42, 29, 33, 38, 25, 31, 44, 36, 28, 31, 39. Make an ordered stem and leaf diagram, then find the median, mode and range.</p>
          <div class="pp-cols"><div class="pp-draw pp-short"></div><div><p>Median ${blank(3)}</p><p>Mode ${blank(3)}</p><p>Range ${blank(3)}</p></div></div></div>
        <div class="pp-q"><p><b>4.</b> Discrete or continuous? shoe size ${blank(5)} height ${blank(5)} reaction time ${blank(5)} number of pets ${blank(5)}</p></div>
        <div class="pp-q"><p><b>5.</b> Choose the best diagram and justify it.</p>
          <table class="pp-table"><tr><th>Data</th><th>Diagram</th><th>Why</th></tr>${["30 reaction times", "favourite colours of a class", "temperature every hour for a day", "height and arm span of 20 people"].map(d => `<tr><td>${d}</td><td></td><td></td></tr>`).join("")}</table></div>`,
      answers: answersPage(h, "What does the data say?", ["Positive correlation, fairly strong: taller people tend to have longer feet", "No: correlation doesn't show cause. Both rise in hot, sunny weather",
        "2 | 3 5 7 8 9; 3 | 1 1 1 3 5 6 8 9; 4 | 2 4 (key 2 | 3 = 0·23 s). Median 31; mode 31; range 21", "discrete; continuous; continuous; discrete",
        "Stem and leaf or grouped frequency (shows every value and the spread); bar chart or pie chart (categories); line graph (change over time); scatter graph (relationship between two variables)"])
    };
  });

  add("paper-risky-business", T4("probability-expectation-and-risk"), "Risky business", "Expected outcomes of a game, faults in a batch, relative frequency, a spinner, and weighing risk and consequence.", (who, h) => ({
    pupil: `${h.sheetHead("Risky business", who)}
      ${qs([`A game costs £1 to play. You win £5 if you roll a 6. If you play 60 times, how many wins do you expect? Would you expect to win or lose money overall, and how much?${lines(2)}`,
        `The probability a phone is faulty is 0·02. How many faulty phones would you expect in a batch of 1500?${lines(1)}`,
        `A drawing pin landed point up 63 times in 150 throws. Estimate the probability it lands point up. How many times would you expect it in 400 throws?${lines(2)}`,
        `A spinner: P(red) = 0·3, P(blue) = 0·45, and the rest is green. Find P(green). How many greens would you expect in 200 spins?${lines(2)}`,
        `Choice A: a 1% chance of losing £1 000. Choice B: a 50% chance of losing £10. Work out the expected loss for each. Which would you choose, and why?${lines(3)}`,
        `There's a 70% chance of heavy rain during an outdoor football final. What would you decide, and what would you put in place? Think about probability and consequences.${lines(3)}`])}`,
    answers: answersPage(h, "Risky business", ["About 10 wins: £50 won, £60 paid, so about £10 lost", "30", "63 ÷ 150 = 0·42; about 168 times", "0·25; about 50", "A: £10; B: £5. A good answer weighs the consequence too: losing £1 000 may be unaffordable, so B is safer even though both are losses",
      "A reasoned decision weighing the high probability against the consequences (safety, the pitch, spectators), with a back-up plan"])
  }));

  /* ===================== Fourth level (S3): literacy ===================== */

  add("paper-reading-purpose", T4("reading-widely-and-developing-my-own-style"), "Reading with purpose", "A reading plan that fills gaps, a response justified by the text, and an experiment with another writer's style.", (who, h) => ({
    pupil: `${h.sheetHead("Reading with purpose", who)}
      ${box("What I've read, watched or listened to this term, and what's missing (a genre, a period, non-fiction, poetry…)", lines(2))}
      <div class="pp-cols">${box("Two new sources to fill the gap, and how I found them", lines(2))}${box("Why I trust those recommendations", lines(2))}</div>
      ${box("My response to one text: my opinion, with two short quotations that justify it", lines(4))}
      ${box("A writer's style I admire: one feature and its effect", lines(2))}
      ${box("My paragraph trying that feature, for my own audience", lines(5))}
      ${box("The choice I made on purpose, and why it suits my audience", lines(1))}`,
    answers: lookForPage(h, "Reading with purpose", ["Independent, regular choices that widen the range of reading, with sources found deliberately", "An opinion justified by relevant reference to the text, not just retelling",
      "A clear judgement of how well the text met their needs", "A style feature identified accurately and used deliberately in their own paragraph", "Choices of genre, form, structure and style explained in terms of the audience"])
  }));

  add("paper-chair-toolkit", T4("leading-and-sustaining-a-discussion"), "Chair's toolkit", "Prepare to chair a discussion, track who has contributed, and evaluate how it went and the spoken language used.", (who, h) => ({
    pupil: `${h.sheetHead("Chair's toolkit", who)}
      ${box("The question for discussion", lines(1))}
      <div class="pp-cols">${box("My opening (what's at stake, and the ground rules)", lines(3))}${box("Questions to bring in other views", lines(3))}</div>
      ${box("Who has spoken? (tally) and who still needs to be invited in", `<table class="pp-table"><tr><th>Name</th><th>Contributions</th><th>Name</th><th>Contributions</th></tr>${"<tr><td></td><td></td><td></td><td></td></tr>".repeat(3)}</table>`)}
      ${box("Summaries I gave during the discussion", lines(2))}
      ${box("When I was challenged: what was said, how I responded, and whether my view changed", lines(3))}
      ${box("A feature of spoken language someone used well, and its effect on the listeners", lines(2))}
      ${box("My register: how formal was I, and was it right for this group?", lines(1))}`,
    answers: lookForPage(h, "Chair's toolkit", ["Full participation with relevant ideas and convincing evidence", "Everyone given a chance to contribute; quieter voices invited in", "A positive response to challenge, with thinking adapted where appropriate",
      "Contributions explored, expanded, clarified, summarised or challenged", "Features of spoken language identified with their effect on the listener; a register sustained to suit the group"])
  }));

  const VOICE_HEAD = "We've looked carefully at the idea of a four-day week for senior pupils, with Fridays for independent study and work placements. The appeal is real: pupils would get more time for coursework, and some would gain experience of the workplace. But there are serious questions. Not every pupil has a quiet place to study at home, and not every family can supervise a teenager on a weekday. We'd also have to fit the same teaching into fewer days, which means longer days. So our position is that we'd only consider a trial, with a study space open in school every Friday, and we'd want to hear from families first.";
  const VOICE_PARENT = "Honestly, I think it's madness. I work full time, my partner works full time, and you're telling me my fifteen-year-old is going to sit at home every Friday and study? Come on. He'll be on his games console by nine o'clock. And what about the kids who need school the most, the ones who get a proper breakfast there and a bit of calm? They're the ones who'll lose out. Work placements sound lovely, but who's checking they're real? I'm all for giving young people responsibility, but this isn't the way.";
  add("paper-two-voices", T4("listening-comparing-texts-and-synthesising-notes"), "Two voices", "Notes on two spoken texts about a four-day school week, a comparison of purpose and style, an inference, and a synthesised briefing.", (who, h) => ({
    pupil: `${h.sheetHead("Two voices", who)}<p>Your adult will read two spoken texts about the same idea: a head teacher in an interview, and a parent on a radio phone-in. Listen once, then make notes the second time.</p>
      <table class="pp-table"><tr><th></th><th>Head teacher</th><th>Parent</th></tr>${["Purpose and audience", "Main points", "Style and language (with an example)"].map(r => `<tr><th>${r}</th><td style="height:${r === "Main points" ? 70 : 44}px"></td><td></td></tr>`).join("")}</table>
      ${box("Synthesis: where do they agree, where do they differ, and whose evidence is stronger?", lines(3))}
      ${box("What does the parent suggest, without saying it directly, about who the plan would suit?", lines(2))}
      ${box("A briefing for a parents' meeting that combines both views, in your own words", lines(5))}`,
    answers: `${h.brandHead("For the adult: Two voices", "Read each text aloud twice, the second in a more heated, informal voice.")}
      <p><b>A head teacher, in an interview</b></p><p class="pp-passage" style="font-size:12pt">${VOICE_HEAD}</p>
      <p><b>A parent, on a radio phone-in</b></p><p class="pp-passage" style="font-size:12pt">${VOICE_PARENT}</p>
      <ul class="ws-answers"><li><b>Purpose:</b> the head teacher informs and sets out a cautious position for families; the parent persuades listeners against the idea.</li>
        <li><b>Agree:</b> both worry about pupils without study space or supervision at home. <b>Differ:</b> the head teacher sees real benefits and would consider a trial; the parent rejects it.</li>
        <li><b>Style:</b> formal, balanced and conditional (\"we'd only consider…\") against informal, emotive and one-sided, with rhetorical questions (\"who's checking they're real?\").</li>
        <li><b>Inference:</b> that the plan would suit families with time and space at home, and widen the gap for pupils who rely on school.</li>
        <li><b>Look for:</b> notes in their own words, a synthesis by theme rather than by speaker, and a fair briefing.</li></ul>`
  }), { needsAdult: true });

  const SPEECH_CENTRE = "Fellow residents, for too long this town has been forgotten. Our young people have nowhere to go, our older people have nowhere to swim, and our old leisure centre has been crumbling for decades. Decades! Today I am asking you to back a new centre: a pool, a gym, a sports hall and a café, open seven days a week. It will cost £14 million, but think what it will save. Every pound spent on sport saves the health service four pounds, the experts say. Every child who learns to swim is a life that might be saved. Can we really put a price on that? Our neighbours in the next town built theirs five years ago, and they have never looked back. So vote for the leisure centre on Thursday. Vote for your health. Vote for your children. Vote for a town that is forgotten no more.";
  add("paper-weigh-speech", T4("evaluating-spoken-texts-persuasion-and-credibility"), "Weighing a speech", "Identify and evaluate the persuasive techniques in a councillor's speech, and judge the credibility of its claims.", (who, h) => ({
    pupil: `${h.sheetHead("Weighing a speech", who)}<p>Your adult will read a councillor's speech aloud, twice.</p>
      <table class="pp-table"><tr><th>Technique</th><th>Example</th><th>How effective for this audience? Why?</th></tr>${["Hyperbole", "Repetition", "Emotive language", "Statistic or expert claim", "Rhetorical question", "Comparison"].map(t => `<tr><td>${t}</td><td style="height:40px"></td><td></td></tr>`).join("")}</table>
      ${box("How is the speech structured, and how effective is its ending?", lines(2))}
      ${box("Credibility: which claims could be checked, which are vague, and what interest does the speaker have?", lines(3))}
      ${box("What important information is missing? What would you ask the councillor?", lines(2))}`,
    answers: `${h.brandHead("For the adult: Weighing a speech", "Read the speech aloud twice, like a rally speech.")}
      <p class="pp-passage">${SPEECH_CENTRE}</p>
      <ul class="ws-answers"><li><b>Hyperbole:</b> \"crumbling for decades\", \"never looked back\". <b>Repetition:</b> \"Decades!\", \"Vote for…\" three times. <b>Emotive:</b> \"forgotten\", \"a life that might be saved\".
        <b>Statistic or expert claim:</b> £14 million; \"saves the health service four pounds, the experts say\". <b>Rhetorical question:</b> \"Can we really put a price on that?\" <b>Comparison:</b> the next town.</li>
        <li><b>Structure:</b> a problem, the proposal, its benefits, then a call to action ending in a triple \"Vote for…\" that echoes the opening (\"forgotten\").</li>
        <li><b>Credibility:</b> a councillor backing their own proposal. The £14 million and the other town's centre can be checked; \"the experts say\" names no source, so its figure can't be trusted as it stands.</li>
        <li><b>Missing:</b> running costs, where the money comes from, what else would be cut, and where it would be built.</li></ul>
      <p>Look for evaluation, not just naming: how well each technique works on residents, with evidence.</p>`
  }), { needsAdult: true });

  add("paper-five-minute-talk", T4("presenting-with-confidence-sustaining-a-point-of-view"), "Five-minute talk", "Plan a talk that sustains a point of view: position, hook, three sections with evidence and links, conclusion, audience and delivery.", (who, h) => ({
    pupil: `${h.sheetHead("Five-minute talk", who)}
      <div class="pp-cols">${box("My position, in one sentence", lines(2))}${box("Audience, and how I'll adapt for them", lines(2))}</div>
      ${box("Hook (and how my conclusion will echo it)", lines(2))}
      ${[1, 2, 3].map(n => box(`Section ${n}: point, evidence, and a link back to my position`, lines(2))).join("")}
      ${box("Conclusion: sum up, return to the hook, and leave them with one thought", lines(2))}
      <div class="pp-cols">${box("Resources, and why they help", lines(2))}${box("Delivery: tick when rehearsed", tick(["timing", "pauses", "eye contact", "emphasis", "tone", "notes, not a script"]))}</div>
      <div class="pp-cols">${box("Feedback: one strength", lines(1))}${box("Feedback: one target", lines(1))}</div>`,
    answers: lookForPage(h, "Five-minute talk", ["Confidence, and a point of view sustained with relevant evidence throughout", "A clear, coherent structure with signposts and concluding statements",
      "An introduction and conclusion that interest and engage the audience", "Tone, vocabulary and non-verbal skills adapted to the audience", "Well-chosen resources that add to the talk"])
  }));

  const NOTIFY = ["We have become a nation of twitchers. Not the birdwatching kind, whose patience is legendary, but the kind who flinch at every buzz in a pocket. The average notification is trivial: a sale, a 'like', a reminder about something we had not forgotten. Yet each one exacts a toll. Attention, once fractured, is slow to mend; the thought we were holding drifts off like a balloon released by a careless child.",
    "It is tempting to blame the technology, and the companies who design it to be irresistible certainly deserve scrutiny. But the remedy lies, at least partly, in our own hands. Silence is a setting. We can choose it. The question is whether we still have the discipline to do so, or whether, like the twitchers, we have trained ourselves to wait for the next small, insistent call."];
  add("paper-annotate-it", T4("reading-complex-texts-annotating-and-interrogating"), "Annotate it", "Annotate an opinion column: main claim, tone shifts, vocabulary from roots and context, imagery, summaries and questions.", (who, h) => ({
    pupil: `${h.sheetHead("Annotate it", who)}<p>Annotate the column in the margins: circle unfamiliar words, underline the main claim, mark where the tone changes, and write questions.</p>
      <div style="display:grid;grid-template-columns:1fr 34mm;gap:8px">${NOTIFY.map(p => `<p class="pp-passage" style="font-size:12.5pt;margin:0 0 6px">${p}</p><div class="pp-draw" style="height:auto"></div>`).join("")}</div>
      ${qs([`"Twitchers" has two meanings here. What are they, and why does the writer use the word?${lines(2)}`,
        `Work out from roots and context: exacts a toll ${blank(9)} fractured ${blank(9)} scrutiny ${blank(9)} remedy ${blank(9)}`,
        `Explain the simile in the first paragraph and its effect.${lines(2)}`,
        `How does the tone change in the second paragraph? Quote to support your answer.${lines(2)}`,
        `Sum up each paragraph in five words or fewer.${lines(2)}`])}`,
    answers: answersPage(h, "Annotate it", ["Birdwatchers, famous for patience, and people who twitch nervously at every alert: the pun mocks us by contrast", "costs us something; broken; close examination; a cure or solution",
      "The thought \"drifts off like a balloon released by a careless child\": once let go it can't be got back, it was lost carelessly, and it's slightly childish", "From mocking and amused to more serious and balanced: it admits companies \"deserve scrutiny\", then challenges the reader (\"Silence is a setting. We can choose it.\")",
      "1: Notifications break our attention. 2: We can choose silence"], "Look for annotations that show active questioning, not just highlighting.")
  }));

  const LIB_A = "Council report summary (Kirkbank, 2026): Kirkbank Library opened on Sundays as a one-year trial. Sunday visits averaged 180 a week, compared with 410 on a typical Saturday. Opening on Sundays cost £950 a week in staff and heating. Most Sunday visitors were families with young children and students. Officers recommend continuing Sunday opening from 11:00 to 15:00 only, which would cut the cost to about £600 a week.";
  const LIB_B = "Local newspaper: Sunday opening at Kirkbank Library has been a hit with families, with nearly 200 visitors a week. Mum of two Priya Shah said: \"It's the only day we're all free. The kids love the story sessions.\" But with the council facing a budget gap, the future of the trial is uncertain.";
  const LIB_C = "Resident's blog: I walked past the library at 4pm last Sunday and it was practically empty. Why are we paying to heat a building nobody uses? The council should put the money into fixing the roads instead.";
  add("paper-three-sources", T4("synthesising-information-from-different-sources"), "Three sources", "Sort essential information from three sources about a library's Sunday opening, synthesise by theme, and handle disagreement.", (who, h) => ({
    pupil: `${h.sheetHead("Three sources", who)}<p>Question: should Kirkbank Library keep opening on Sundays?</p>
      ${[["A", LIB_A], ["B", LIB_B], ["C", LIB_C]].map(([k, t]) => `<p class="pp-passage" style="font-size:12pt"><b>Source ${k}.</b> ${t}</p>`).join("")}
      <table class="pp-table"><tr><th>Theme</th><th>What the sources say (A, B, C)</th></tr>${["How many people use it", "Who uses it", "The cost", "Options"].map(t => `<tr><td>${t}</td><td style="height:34px"></td></tr>`).join("")}</table>
      ${box("Where the sources disagree, which do you trust more, and why?", lines(2))}
      ${box("Summary in your own words: each sentence should draw on at least two sources", lines(4))}`,
    answers: lookForPage(h, "Three sources", ["Use: A 180 a week on average (official count); B \"nearly 200\" (rounded up); C one visit late on one Sunday (not reliable as evidence of use)",
      "Who: families with young children and students (A and B)", "Cost: £950 a week, or about £600 with shorter hours (A); a budget gap (B); C suggests roads instead",
      "Trust: A is most reliable for figures (official, a year's data); B is fair but selective; C is one observation at 4pm, an hour after the shorter hours A proposes would close",
      "A synthesis by theme, in their own words, that notes the shorter-hours option as a possible middle way"])
  }));

  const MIST = ["The mist came down without warning. One moment the ridge stretched ahead of us, a knife-edge of grey rock against a pale sky; the next, the world had shrunk to a circle of wet stones and the boots of the person in front. Sound changed first. The wind, which had been roaring, seemed to hold its breath, and every footstep rang out, loud and lonely.",
    "We stopped. Nobody said what we were all thinking.",
    "I had climbed this hill a dozen times. I knew its moods, or believed I did. But a hill in mist is a stranger, and strangers owe you nothing. The path, so obvious an hour before, split and split again into sheep tracks that led nowhere in particular. Our leader took out the compass, turned it in her hands, and frowned at it as if it had told her a joke she did not find funny."];
  add("paper-close-depth", T4("close-reading-detailed-analysis-and-evaluation"), "Close reading in depth", "A passage about a hill walk in mist, with understanding, analysis of word choice, imagery and sentence structure, and evaluation.", (who, h) => ({
    pupil: `${h.sheetHead("Close reading in depth", who)}
      <div class="pp-passage" style="font-size:12.5pt">${MIST.map(p => `<p style="margin:0 0 6px">${p}</p>`).join("")}</div>
      ${qs([`<i>Understanding.</i> In your own words, explain two ways the walkers' situation changes in the first paragraph.${lines(2)}`,
        `<i>Analysis.</i> Explore the connotations of "a knife-edge of grey rock".${lines(1)}`,
        `<i>Analysis.</i> "seemed to hold its breath": name the technique and analyse its effect.${lines(1)}`,
        `<i>Analysis.</i> How does the sentence structure of the second paragraph add to the tension?${lines(1)}`,
        `<i>Analysis.</i> "a hill in mist is a stranger, and strangers owe you nothing": what does this suggest about the writer's attitude?${lines(1)}`,
        `<i>Analysis.</i> What does the final simile suggest about the leader?${lines(1)}`,
        `<i>Evaluation.</i> How effectively does the writer create a sense of danger? Refer to two techniques.${lines(2)}`])}`,
    answers: answersPage(h, "Close reading in depth", ["They can no longer see far ahead (only the stones and the boots in front); the noise of the wind stops and their own steps sound loud",
      "Sharp, narrow and dangerous: one slip could hurt you; \"grey\" is cold and bleak", "Personification: an eerie, unnatural stillness, as if the hill is waiting, which builds suspense",
      "Two very short sentences: an abrupt stop, and the unspoken fear hangs in the silence", "Humble and wary: the familiar hill has become unknowable and won't help them, so the writer's confidence has gone",
      "She's puzzled and uneasy: the compass isn't giving a clear answer, though she tries to stay calm; the dry humour masks the danger", "A judgement with evidence, such as the shrinking world, the sudden silence, the short sentences, or the paths that lead nowhere"],
      "Strong answers quote, explore connotations, and explain the effect on the reader.")
  }));

  const SLANT_A = "<b>Council invests £14m in town's future.</b> Kirkbank's future looks brighter after councillors voted last night to build a state-of-the-art leisure centre. The £14 million centre, with a pool, gym and café, is due to open in 2028. The council leader said: \"This is a once-in-a-generation investment in our young people.\" A local swimming club coach welcomed the news: \"Our members have waited years for this.\"";
  const SLANT_B = "<b>Council gambles £14m as libraries face cuts.</b> Councillors last night voted to gamble £14 million on a new leisure centre, just weeks after warning that two branch libraries may close. An opposition councillor called the decision \"reckless\". The council has not published how much the centre will cost to run each year. One resident, who asked not to be named, said: \"They've got money for a swimming pool but not for books?\"";
  add("paper-spot-slant", T4("bias-persuasion-and-credibility-in-what-i-read"), "Spot the slant", "Two news reports of the same council vote: headlines, loaded words, whose voices are heard, what's left out, and credibility.", (who, h) => ({
    pupil: `${h.sheetHead("Spot the slant", who)}
      <p class="pp-passage" style="font-size:12.5pt">A: ${SLANT_A}</p><p class="pp-passage" style="font-size:12.5pt">B: ${SLANT_B}</p>
      <table class="pp-table"><tr><th></th><th>Report A</th><th>Report B</th></tr>${["The headline's verb and its effect", "Loaded words", "Whose voices are quoted", "What it leaves out", "Its slant"].map(r => `<tr><th>${r}</th><td style="height:34px"></td><td></td></tr>`).join("")}</table>
      ${box("Facts both reports agree on", lines(1))}
      ${box("How credible is the anonymous resident in B? And the council leader in A?", lines(2))}
      ${box("Your informed view: what would you need to know to decide whether this was a good decision?", lines(3))}`,
    answers: answersPage(h, "Spot the slant", ["A: \"invests\" (positive, sensible). B: \"gambles\" (risky, irresponsible)", "A: brighter, state-of-the-art, once-in-a-generation. B: gamble, reckless, cuts",
      "A: the council leader and a swimming coach, both in favour. B: an opposition councillor and an anonymous resident, both against", "A leaves out the library warning and running costs. B leaves out what the centre offers and who supports it",
      "Both agree: a £14 million leisure centre was approved by councillors last night", "Anonymous: can't be checked, and chosen to make a point. The leader: has an interest in praising the decision. Neither is neutral",
      "A view that recognises both slants and names what's needed: running costs, funding, the library decision and the evidence of need"])
  }));

  add("paper-critical-planner", T4("critical-response-to-literature-structure-theme-and-style"), "Critical response planner", "For any text: trace the theme through key moments, evaluate structure and style with terminology, and plan a critical paragraph.", (who, h) => ({
    pupil: `${h.sheetHead("Critical response planner", who)}
      <div class="pp-cols">${box("Text and writer", lines(1))}${box("The theme, in one sentence", lines(1))}</div>
      <table class="pp-table"><tr><th>Key moment</th><th>Quotation</th><th>How it develops the theme</th></tr>${"<tr><td style=\"height:48px\"></td><td></td><td></td></tr>".repeat(3)}</table>
      <div class="pp-cols">${box("A structural choice (flashback, twist, ending…) and how effective it is", lines(3))}${box("A choice of style (voice, imagery, dialogue…) and its effect, with terminology", lines(3))}</div>
      ${box("How the theme relates to my own or others' experiences", lines(2))}
      ${box("A critical paragraph: point, evidence, analysis, evaluation, link to the theme", lines(6))}`,
    answers: lookForPage(h, "Critical response planner", ["A theme stated as an idea and traced through the text, not a plot summary", "Evaluative comments on structure, characterisation or setting, with relevant reference to the text",
      "Style and genre features identified with detailed reference and correct terminology (for example, foreshadowing, juxtaposition, first-person narration)", "A personal evaluation of effectiveness, linked to the writer's purpose",
      "A paragraph that analyses and evaluates rather than retells"])
  }));

  const SCIENCE = "In are science experiment we tested weather the temprature of water effects how quickly sugar disolves. We used a seperate beaker for each temprature and kept the amount of sugar the same, which made it a fair test. Are hypothosis was that the sugar would disolve faster in hotter water, and the results supported it. Next time we will measure more accuratly and repeat each test three times to make our evidence more reliable, and we should of recorded the time in seconds rather then minutes.";
  add("paper-spelling-log", T4("independent-spelling-accuracy"), "My spelling log", "Proofread a science report for spelling, sort errors by type with a strategy for each, and pin down easily confused pairs.", (who, h) => ({
    pupil: `${h.sheetHead("My spelling log", who)}
      <p class="pp-passage" style="font-size:12.5pt">${SCIENCE}</p>
      ${qs([`Proofread the report in a separate pass for spelling only. Underline every mistake. How many did you find? ${blank(3)}`])}
      <table class="pp-table"><tr><th>I wrote</th><th>Correct</th><th>Type of error</th><th>Strategy to fix it</th></tr>${"<tr><td></td><td></td><td></td><td></td></tr>".repeat(5)}</table>
      <p class="pp-bank"><b>Types:</b> homophone · double letter · suffix rule · unstressed vowel · specialist word · grammar (should of)</p>
      ${qs([`Write a sentence that shows the meaning of each: affect / effect ${lines(1)} practice / practise ${lines(1)} principal / principle ${lines(1)}`,
        `Look back at your own recent writing. Add three of your own errors to the log above, with strategies.`], 2)}`,
    answers: answersPage(h, "My spelling log", ["13: are → our (twice), weather → whether, temprature → temperature (twice), effects → affects, disolves → dissolves, seperate → separate, hypothosis → hypothesis, disolve → dissolve, accuratly → accurately, should of → should have, then → than",
      "Types: homophones (our, whether, affects, than), specialist words (temperature, hypothesis), double letters (dissolve), unstressed vowels (separate), suffix rule (accurately), grammar (should have)",
      "For example: affect is usually the verb, effect the noun; practice is the noun and practise the verb (in UK English); a principal is a head or main, a principle is a rule or belief", "The pupil's own errors, each with a matching strategy"])
  }));

  add("paper-punctuation-effect", T4("sentences-and-punctuation-for-effect"), "Punctuation for effect", "Semicolons, colons and dashes, a complex list, minor sentences, and revising a flat paragraph with deliberate choices.", (who, h) => ({
    pupil: `${h.sheetHead("Punctuation for effect", who)}
      ${qs([`Add a semicolon: "The rain stopped the match continued" ${lines(1)}`,
        `Use semicolons in this list: "We visited Perth, Scotland, Perth, Australia and Perth, Ontario" ${lines(1)}`,
        `Add a dash for a sharp turn: "She opened the box and found nothing" ${lines(1)}`,
        `Add a colon: "There was only one problem the door was locked" ${lines(1)}`,
        `Revise this flat paragraph. Use at least one minor sentence, one long complex sentence, and one dash or semicolon.<br><i>"We walked into the old house. It was dark and it was cold and it smelled of damp. We heard a noise upstairs. We decided to leave very quickly."</i>${lines(5)}`,
        `Explain the effect of two of your choices in question 5.${lines(3)}`,
        `Write a paragraph about a place you know, with a topic sentence and a linking phrase that signposts a turn in your line of thought (however, by contrast, even so).${lines(4)}`])}`,
    answers: answersPage(h, "Punctuation for effect", ["The rain stopped; the match continued.", "We visited Perth, Scotland; Perth, Australia; and Perth, Ontario.", "She opened the box – and found nothing.", "There was only one problem: the door was locked.",
      "For example: Darkness. As we stepped inside, the cold wrapped round us and the smell of damp rose from the boards; somewhere upstairs, something moved. We didn't wait to find out what.",
      "Effects explained: a minor sentence for impact, a long sentence building atmosphere, a semicolon linking cause and dread, a short sentence for decision", "A clear topic sentence and a signposted turn, with accurate punctuation"])
  }));

  add("paper-edit-editor", T4("independent-editing-and-justifying-layout"), "Edit like an editor", "Edit a draft of your own for structure, language and accuracy with a change log, then design and justify two layouts.", (who, h) => ({
    pupil: `${h.sheetHead("Edit like an editor", who)}<p>Use a draft of your own (at least 300 words).</p>
      <table class="pp-table"><tr><th>Level</th><th>What I changed</th><th>Why it's better</th></tr>${["Structure: order, paragraphs, what to cut or add", "Structure", "Language: precise words, varied sentences, no padding", "Language", "Accuracy: spelling, punctuation, grammar"].map(r => `<tr><td>${r}</td><td style="height:38px"></td><td></td></tr>`).join("")}</table>
      ${box("Read it once as your reader would. Does it meet its purpose at first reading? What still gets in the way?", lines(2))}
      <div class="pp-cols">${box("Sketch it as a web page", `<div class="pp-draw"></div>`)}${box("Sketch it as a printed leaflet", `<div class="pp-draw"></div>`)}</div>
      ${box("Justify two layout choices by their impact on the reader", lines(3))}`,
    answers: lookForPage(h, "Edit like an editor", ["Independent editing at structure level, not only corrections", "Improvements to content, language and structure, each with a reason",
      "A final check for clarity at first reading", "Layout features chosen for each medium (for example links and short sections online; headings and white space in print)", "Choices justified by their impact on the reader"])
  }));

  const HOLYROOD = "The Scottish Parliament first met in 1999, nearly three hundred years after the previous Parliament of Scotland was adjourned in 1707. Since 2004 it has met in its building at Holyrood in Edinburgh. There are 129 Members of the Scottish Parliament (MSPs). Each voter has two votes: one for a constituency MSP and one for a list of candidates for their region, a system intended to make the number of seats each party wins closer to its share of the vote.";
  add("paper-sources-well", T4("responsible-use-of-sources-referencing-and-synthesising"), "Using sources well", "Paraphrase, quote and summarise a source, spot plagiarism, write a reference, and plan a report organised by argument.", (who, h) => ({
    pupil: `${h.sheetHead("Using sources well", who)}
      <p class="pp-passage" style="font-size:12.5pt">${HOLYROOD}</p>
      <p class="hint">An example source for practice: "How the Scottish Parliament works", a civics website, published 2024.</p>
      ${qs([`Which student used the source responsibly? Write P (plagiarised), Q (quoted correctly) or O (own words) for each.<br>
          a) The Scottish Parliament first met in 1999, nearly three hundred years after the previous Parliament of Scotland was adjourned. ${blank(2)}<br>
          b) According to the source, the voting system is "intended to make the number of seats each party wins closer to its share of the vote". ${blank(2)}<br>
          c) Scotland had no parliament of its own from 1707 until 1999, when a new one opened. ${blank(2)}`,
        `Put the last sentence of the source into your own words.${lines(2)}`,
        `Summarise the whole source in one sentence.${lines(1)}`,
        `Write a reference for this source, including the date you accessed it.${lines(1)}`,
        `You use an AI chatbot or a search summary to find a fact. What should you do before you use it in your report, and why?${lines(2)}`])}
      <div class="pp-cols">${box("Report plan, organised by argument: introduction", lines(1))}${box("Argument 1, with sources", lines(1))}${box("Argument 2, with sources", lines(1))}${box("Conclusion", lines(1))}</div>`,
    answers: answersPage(h, "Using sources well", ["a) P (copied without quotation marks or credit)  b) Q  c) O (own words; still needs a reference)",
      "For example: each voter chooses a local MSP and also votes for a party's regional list, which helps match a party's seats to its votes", "For example: Scotland's Parliament returned in 1999 and has 129 MSPs elected by two votes each",
      "For example: \"How the Scottish Parliament works\", civics website, 2024, accessed (today's date). A real reference would add the author or organisation and web address",
      "Check it against an original, reliable source (such as the Parliament's own website), because summaries and chatbots can be wrong or out of date, and cite that source, not the tool"])
  }));

  add("paper-report-planner", T4("writing-reports-information-with-evidence"), "Report planner", "Plan a report on a real issue: purpose and reader, sections with headings, topic sentences and evidence, and an objective tone.", (who, h) => ({
    pupil: `${h.sheetHead("Report planner", who)}
      <div class="pp-cols">${box("Issue (in my school or community)", lines(1))}${box("Purpose and reader", lines(1))}</div>
      ${box("Title and introduction: what the report covers and why it matters", lines(2))}
      <table class="pp-table"><tr><th>Heading</th><th>Topic sentence</th><th>Evidence (data, quotation, example) and source</th></tr>${"<tr><td style=\"height:46px\"></td><td></td><td></td></tr>".repeat(3)}</table>
      ${box("Synthesis: where do different sources or views agree or conflict?", lines(2))}
      ${box("Conclusion and recommendations", lines(2))}
      ${box("Objective tone: three phrases I'll use, and two I'll avoid", lines(2))}`,
    answers: lookForPage(h, "Report planner", ["A style and format well suited to purpose and reader, with the features of a report", "Information and explanation supported by substantiating evidence",
      "Ideas from different sources synthesised, not listed", "A clear structure signposted with headings, topic sentences and linking phrases", "A consistently objective tone"])
  }));

  add("paper-weigh-it-up", T4("discursive-and-argumentative-essays"), "Weigh it up", "Plan a discursive essay: the debate, alternating arguments with evidence, linking phrases, and a conclusion that weighs and judges.", (who, h) => ({
    pupil: `${h.sheetHead("Weigh it up", who)}
      ${box("The issue, as a question", lines(1))}
      ${box("Introduction: why it matters, and the two sides", lines(2))}
      <table class="pp-table"><tr><th></th><th>Argument</th><th>Evidence</th><th>Linking phrase</th></tr>${["For", "Against", "For", "Against"].map(s => `<tr><th>${s}</th><td style="height:44px"></td><td></td><td></td></tr>`).join("")}</table>
      <p class="pp-bank"><b>Linking phrases:</b> Furthermore · However · On the other hand · Admittedly…, yet · Nevertheless · Consequently</p>
      ${box("Which side is stronger, and why? (Weigh it; don't just repeat the points.)", lines(3))}
      ${box("Conclusion: my justified judgement", lines(3))}
      ${box("Language I'll use for effect, and where", lines(1))}`,
    answers: lookForPage(h, "Weigh it up", ["A point of view presented or sustained with essential detail and supporting evidence", "A clear line of thought, with effective linking phrases and topic sentences",
      "An effective introduction that sets out the debate", "A conclusion that weighs the arguments and reaches a justified judgement", "Language used deliberately to create effects or influence the reader"])
  }));

  add("paper-looking-back", T4("reflective-personal-writing"), "Looking back", "Plan reflective writing around a turning point: before and after, the moment in slow motion, and reflection that goes beyond a simple lesson.", (who, h) => ({
    pupil: `${h.sheetHead("Looking back", who)}
      ${box("The turning point, in one sentence", lines(1))}
      <div class="pp-cols">${box("Before: who I was, what I thought", lines(3))}${box("After: what changed, and how I know", lines(3))}</div>
      ${box("The moment in slow motion: what I saw, heard and felt, second by second", lines(4))}
      ${box("Changing feelings: three words for how I felt, in order, and what caused each change", lines(2))}
      ${box("Reflection that goes deeper than \"I learned a lesson\": what I understand now that I didn't then", lines(3))}
      ${box("My opening: start in the moment", lines(4))}`,
    answers: lookForPage(h, "Looking back", ["Events recounted convincingly, with a clear context and setting", "Feelings and reactions conveyed as they change with the circumstances",
      "Reflection with a sense of involvement and genuine insight, not a stock moral", "Language, style and tone that engage the reader", "A structure that moves purposefully between narrating and reflecting"])
  }));

  add("paper-story-craft", T4("creative-writing-mood-dialogue-and-narrative-structure"), "Story craft", "Plan a story around a changing relationship: genre conventions, structure and narrative device, mood, and dialogue with subtext.", (who, h) => ({
    pupil: `${h.sheetHead("Story craft", who)}
      <div class="pp-cols">${box("Genre, and three conventions I'll use", lines(2))}${box("The relationship, and how it changes", lines(2))}</div>
      ${box("Structure: where I'll start (in the middle? a flashback? a change of viewpoint?) and why", lines(2))}
      ${box("Mood and atmosphere: setting, weather, pace and sentence length", lines(2))}
      ${box("Dialogue with subtext: what each character says, and what they really mean", `<table class="pp-table"><tr><th>Says</th><th>Means</th></tr>${"<tr><td></td><td></td></tr>".repeat(3)}</table>`)}
      ${box("A scene with dialogue (set out correctly)", lines(7))}`,
    answers: lookForPage(h, "Story craft", ["Conventions of the chosen genre used effectively", "An appropriate mood or atmosphere created and sustained", "Convincing relationships, actions and dialogue, with subtext",
      "Narrative structure and devices used to engage the reader and achieve particular effects", "Dialogue punctuated and set out correctly"])
  }));

  return { sheets, get: id => sheets[id] || null, forLesson: lessonId => Object.values(sheets).filter(s => s.lesson === lessonId) };
})();
