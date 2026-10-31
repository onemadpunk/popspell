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

  return { sheets, get: id => sheets[id] || null, forLesson: lessonId => Object.values(sheets).filter(s => s.lesson === lessonId) };
})();
