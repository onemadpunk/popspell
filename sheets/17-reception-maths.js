  // England's Reception maths (the Early Learning Goals): one sheet for each lesson in
  // content/lessons/20-england-reception-maths.json. Big, simple pictures; the adult reads the instructions.
  // Pictures at a set printed size (young sheets otherwise stretch them to the page width)
  const sized = (mm, html) => `<span style="display:inline-block;width:${mm}mm;vertical-align:middle">${html}</span>`;
  const DICE = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]] };
  const dotsBox = (pts, w = 100) => svg(w, w, `<rect x="2" y="2" width="${w - 4}" height="${w - 4}" rx="14" class="pp-frame"/>${pts.map(([x, y]) => `<circle cx="${x * w / 100}" cy="${y * w / 100}" r="${w / 11}" class="pp-dot"/>`).join("")}`);
  const scatter = (n, w = 100) => {
    const pts = [];
    for (let tries = 0; pts.length < n && tries < 3000; tries++) {
      const p = [16 + rand(68), 16 + rand(68)];
      if (pts.every(q => (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 > 380)) pts.push(p);
    }
    return pts;
  };
  // A ten frame: filled counters first, then a second colour (open circles), then empty squares
  const tenFrame = (filled, other = 0) => svg(250, 104, `${[0, 1].map(r => [0, 1, 2, 3, 4].map(c => {
    const i = r * 5 + c, x = 5 + c * 48, y = 5 + r * 48;
    return `<rect x="${x}" y="${y}" width="48" height="48" class="pp-frame"/>${i < filled ? `<circle cx="${x + 24}" cy="${y + 24}" r="16" class="pp-dot"/>` : i < filled + other ? `<circle cx="${x + 24}" cy="${y + 24}" r="16" fill="none" stroke="#333" stroke-width="3"/>` : ""}`;
  }).join("")).join("")}`);

  add("paper-r-how-many", "lesson-england-reception-seeing-how-many-up-to-5", "How many dots?", "Dice patterns and jumbles of 1 to 5 dots: say how many without counting, then write it.", (who, h) => {
    const boxes = shuffle([1, 2, 3, 4, 5].map(n => ({ n, pts: DICE[n] })).concat(shuffle([2, 3, 4, 5]).slice(0, 4).map(n => ({ n, pts: scatter(n) })))).slice(0, 9);
    return {
      pupil: `${h.sheetHead("How many dots?", who)}
        <p>Look quickly. How many dots? Say it, then write the number.</p>
        <div class="pp-grid3">${boxes.map((b, i) => `<div class="pp-cell"><p><b>${i + 1}.</b></p>${dotsBox(b.pts)}<p>${blank(3)}</p></div>`).join("")}</div>
        <p><b>10.</b> Draw 4 dots in your own pattern.</p><div class="pp-draw pp-short"></div>`,
      answers: answersPage(h, "How many dots?", boxes.map(b => `${b.n}`).concat(["Any 4 dots. Ask: how would someone see 4 quickly? (2 and 2, or 3 and 1)"]),
        "Watch: do they see the number, or point and count each dot? Seeing it is the goal; counting is fine to check.")
    };
  });

  add("paper-r-number-parts", "lesson-england-reception-what-numbers-are-made-of", "What's inside the number?", "Ten frames with two colours: write the two parts and the whole.", (who, h) => {
    const rows = shuffle([[3, 2], [4, 1], [2, 3], [5, 2], [4, 3], [6, 2], [5, 4], [3, 3]]).slice(0, 6);
    return {
      pupil: `${h.sheetHead("What's inside the number?", who)}
        <p>Count the full circles, then the empty circles. Write the two parts, then how many altogether.</p>
        <div class="pp-grid3">${rows.map(([a, b], i) => `<div class="pp-cell"><p><b>${i + 1}.</b></p>${sized(52, tenFrame(a, b))}<p>${blank(2)} and ${blank(2)} make ${blank(2)}</p></div>`).join("")}</div>`,
      answers: answersPage(h, "What's inside the number?", rows.map(([a, b]) => `${a} and ${b} make ${a + b}`),
        "Ask: can you make the same number a different way? (For 5: 4 and 1, 3 and 2, 5 and 0.)")
    };
  });

  add("paper-r-bonds-5", "lesson-england-reception-number-bonds-to-5", "Pairs that make 5", "Missing parts of 5 with dots, and take-away pictures within 5.", (who, h) => {
    const parts = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4);
    const takes = shuffle([[5, 2], [4, 1], [5, 3], [3, 1], [4, 2]]).slice(0, 3);
    const apples = (n, gone) => svg(230, 50, Array.from({ length: n }, (_, i) => `<circle cx="${25 + i * 45}" cy="25" r="18" fill="none" stroke="#333" stroke-width="3"/>${i >= n - gone ? `<line x1="${9 + i * 45}" y1="9" x2="${41 + i * 45}" y2="41" stroke="#333" stroke-width="3"/>` : ""}`).join(""));
    return {
      pupil: `${h.sheetHead("Pairs that make 5", who)}
        <p><b>Make 5.</b> How many more dots make 5? Draw them, then write the number.</p>
        <div class="pp-grid3">${parts.map((p, i) => `<div class="pp-cell"><p><b>${i + 1}.</b></p>${dotsBox(DICE[p] || [], 100)}<p>${p} and ${blank(2)} make 5</p></div>`).join("")}</div>
        <p><b>Take away.</b> Some have been eaten (crossed out). How many are left?</p>
        ${takes.map(([n, g], i) => `<div class="pp-cell"><p><b>${i + 5}.</b> ${sized(55, apples(n, g))} &nbsp; ${n} take away ${g} leaves ${blank(2)}</p></div>`).join("")}`,
      answers: answersPage(h, "Pairs that make 5", parts.map(p => `${p} and ${5 - p} make 5`).concat(takes.map(([n, g]) => `${n} take away ${g} leaves ${n - g}`)),
        "The pairs to know by heart: 0 and 5, 1 and 4, 2 and 3 (and the other way round).")
    };
  });

  add("paper-r-ten-frames", "lesson-england-reception-number-bonds-to-10-and-doubles", "Ten frames and doubles", "How many more to make 10 on a ten frame, and doubles with dice.", (who, h) => {
    const tens = shuffle([9, 8, 7, 6, 5, 3]).slice(0, 4);
    const dbl = shuffle([1, 2, 3, 4, 5]).slice(0, 3);
    return {
      pupil: `${h.sheetHead("Ten frames and doubles", who)}
        <p><b>Make 10.</b> How many empty squares? Write the pair that makes 10.</p>
        <div class="pp-grid3">${tens.map((n, i) => `<div class="pp-cell"><p><b>${i + 1}.</b></p>${sized(52, tenFrame(n))}<p>${n} and ${blank(2)} make 10</p></div>`).join("")}</div>
        <p><b>Doubles.</b> Both dice are the same. How many altogether?</p>
        <div class="pp-grid3">${dbl.map((n, i) => `<div class="pp-cell"><p><b>${i + 5}.</b></p>${sized(22, dotsBox(DICE[n], 70))} ${sized(22, dotsBox(DICE[n], 70))}<p>double ${n} is ${blank(2)}</p></div>`).join("")}</div>`,
      answers: answersPage(h, "Ten frames and doubles", tens.map(n => `${n} and ${10 - n} make 10`).concat(dbl.map(n => `double ${n} is ${2 * n}`)),
        "Count the empty squares, or see them: a full row is 5.")
    };
  });

  add("paper-r-more-fewer", "lesson-england-reception-more-fewer-the-same", "More, fewer or the same", "Two groups of dots: circle the one with more (or tick the same), then compare numbers.", (who, h) => {
    const pairs = shuffle([[3, 5], [6, 4], [7, 7], [2, 6], [8, 5], [4, 4]]).slice(0, 4);
    const nums = shuffle([[4, 7], [9, 6], [3, 8], [10, 5]]).slice(0, 3);
    return {
      pupil: `${h.sheetHead("More, fewer or the same", who)}
        <p>Circle the box with <b>more</b> dots. If they are the same, tick ☐ the same.</p>
        ${pairs.map(([a, b], i) => `<div class="pp-cell"><p><b>${i + 1}.</b> ${sized(32, dotsBox(scatter(a), 90))} &nbsp; ${sized(32, dotsBox(scatter(b), 90))} &nbsp; ☐ the same</p></div>`).join("")}
        <p>Circle the number that is <b>more</b>.</p>
        ${nums.map(([a, b], i) => `<p><b>${i + 5}.</b> <span style="font: 700 22pt Arial, sans-serif">${a}</span> &nbsp; or &nbsp; <span style="font: 700 22pt Arial, sans-serif">${b}</span></p>`).join("")}`,
      answers: answersPage(h, "More, fewer or the same", pairs.map(([a, b]) => (a === b ? `The same (${a} and ${b})` : `The ${a > b ? "first" : "second"} box (${Math.max(a, b)} is more than ${Math.min(a, b)})`))
        .concat(nums.map(([a, b]) => `${Math.max(a, b)}`)), "Ask them to check by matching dots one to one, or counting.")
    };
  });

  add("paper-r-pairs-sharing", "lesson-england-reception-odd-and-even-and-sharing", "Pairs and sharing", "Ring dots in pairs to see odd or even, and share things fairly between two plates.", (who, h) => {
    const ns = shuffle([4, 5, 6, 7, 8, 9]).slice(0, 4);
    const share = shuffle([4, 6, 8, 10]).slice(0, 2);
    return {
      pupil: `${h.sheetHead("Pairs and sharing", who)}
        <p>Ring the dots in pairs. Is there one left over? Tick <b>odd</b> (one left over) or <b>even</b> (all in pairs).</p>
        <div class="pp-grid3">${ns.map((n, i) => `<div class="pp-cell"><p><b>${i + 1}.</b></p>${dotsBox(scatter(n))}<p>☐ odd ☐ even</p></div>`).join("")}</div>
        ${share.map((n, i) => `<p><b>${i + 5}.</b> Share ${n} sweets fairly between the two plates. Draw them. Each plate gets ${blank(2)}</p>
          ${sized(115, svg(300, 90, `<ellipse cx="75" cy="45" rx="68" ry="38" class="pp-frame"/><ellipse cx="225" cy="45" rx="68" ry="38" class="pp-frame"/>`))}`).join("")}`,
      answers: answersPage(h, "Pairs and sharing", ns.map(n => `${n}: ${n % 2 ? "odd (one left over)" : "even (all in pairs)"}`).concat(share.map(n => `${n} shared between 2: ${n / 2} each`)),
        "Even numbers share fairly between two; odd numbers leave one over.")
    };
  });

  add("paper-r-past-20", "lesson-england-reception-counting-past-20", "Counting past 20", "Fill the gaps on number tracks from 18 to 40, and what comes next.", (who, h) => {
    const start = pick([18, 20, 21]);
    const track = Array.from({ length: 20 }, (_, i) => start + i);
    const gaps = new Set(shuffle(track.slice(1)).slice(0, 7));
    const next = shuffle([19, 23, 26, 29, 31, 35, 39]).slice(0, 4).sort((a, b) => a - b);
    const cell = (n, hide) => `<span class="pp-num${hide ? " pp-gap" : ""}">${hide ? "" : n}</span>`;
    return {
      pupil: `${h.sheetHead("Counting past 20", who)}
        <p><b>1.</b> Count along. Fill in the missing numbers.</p><div class="pp-track">${track.map(n => cell(n, gaps.has(n))).join("")}</div>
        <p><b>2.</b> What comes next?</p>${next.map(n => `<p>${n}, ${blank(3)}</p>`).join("")}
        <p><b>3.</b> What comes just before 30? ${blank(3)}</p>`,
      answers: answersPage(h, "Counting past 20", [`Missing: ${[...gaps].sort((a, b) => a - b).join(", ")}`, ...next.map(n => `${n}, ${n + 1}`), "29"],
        "Listen for twenty-nine, thirty: the tens change and the ones start again.")
    };
  });
