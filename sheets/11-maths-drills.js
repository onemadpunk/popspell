  /* ===================== Quick drills: secondary maths (Years 7 to 11) =====================
     The same one-page shape as the quick drills above (strip, a box of what to remember, short numbered
     tasks), for the maths that England's Years 7 to 9 (key stage 3) and Years 10 and 11 (GCSE)
     cover, and the Third and Fourth level lessons that match. Every print is a fresh set of numbers,
     and the answers page gives each answer by task and letter (1a, 1b …) so marking is quick. */

  const mdHead = (h, title, who, years, mins) => `${h.sheetHead(title, who)}<p class="qd-strip"><b>Quick drill</b><span>Maths · ${years}</span><span>About ${mins} minutes</span><span>Done ☐</span></p>`;
  const mdR = (lo, hi) => lo + rand(hi - lo + 1);
  const mdNZ = (lo, hi) => { for (;;) { const v = mdR(lo, hi); if (v) return v; } };
  const mdM = n => (n < 0 ? `−${-n}` : `${n}`);
  const mdB = n => (n < 0 ? `(−${-n})` : `${n}`);
  const mdGcd = (a, b) => (b ? mdGcd(b, a % b) : Math.abs(a));
  const mdSup = n => String(n).replace(/-/g, "⁻").replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
  const mdD = (x, p = 2) => String(Math.round(x * 10 ** p) / 10 ** p).replace("-", "−");
  // A fraction in simplest form, as a mixed number when it is bigger than 1
  const mdFrac = (n, d, mixed = true) => {
    if (d < 0) { n = -n; d = -d; }
    const g = mdGcd(n, d) || 1; n /= g; d /= g;
    if (d === 1) return mdM(n);
    const sign = n < 0 ? "−" : "", a = Math.abs(n);
    return mixed && a > d ? `${sign}${Math.floor(a / d)} ${a % d}/${d}` : `${sign}${a}/${d}`;
  };
  // An expression from [coefficient, letter] terms, in order: mdX([3, "x"], [-2, ""]) is 3x − 2
  const mdX = (...terms) => {
    const t = terms.filter(([k]) => k !== 0);
    if (!t.length) return "0";
    return t.map(([k, v], i) => { const mag = Math.abs(k) === 1 && v ? v : `${Math.abs(k)}${v}`; return i ? `${k < 0 ? " − " : " + "}${mag}` : (k < 0 ? `−${mag}` : mag); }).join("");
  };
  const mdRule = (title, html) => `<div class="pp-box qd-rule"><b>${title}</b>${html}</div>`;
  // n items from a maker, no two the same question
  const mdMany = (n, maker) => { const out = [], seen = new Set(); for (let i = 0; out.length < n && i < 400; i++) { const it = maker(); if (it && !seen.has(it[0])) { seen.add(it[0]); out.push(it); } } return out; };
  const LETTERS = "abcdefghijklmnop";

  // A drill: build() gives { rule, tasks: [{ text, items: [[question, answer]], cols, work, w }], note }
  const mdDrill = (id, lesson, name, detail, years, mins, build) => add(id, lesson, `Quick drill: ${name}`, detail, (who, h) => {
    const { rule = "", tasks, note = "" } = build(), title = name[0].toUpperCase() + name.slice(1);
    // A sum gets "= ____"; a question or instruction gets the space after it; w: 0 is no space (the pupil writes on the question)
    const space = (t, q) => (t.w === 0 ? "" : `${/[?.:]$/.test(q.trim()) ? " " : " = "}${blank(t.w || 4)}`);
    const item = t => ([q]) => `<li>${q}${t.work ? `<span class="md-work" style="height:${t.work * 7}mm"></span>` : space(t, q)}</li>`;
    return {
      pupil: `${mdHead(h, title, who, years, mins)}${rule}
        ${tasks.map((t, i) => `${task(i + 1, t.text)}<ol class="qd-list md-list${t.cols === 1 ? "" : " qd-cols2"}" type="a">${t.items.map(item(t)).join("")}</ol>`).join("")}`,
      answers: answersPage(h, title, tasks.flatMap((t, i) => t.items.map(([, a], j) => `<b>${i + 1}${LETTERS[j]}</b> &nbsp;${a}`)), note)
        .replace('class="ws-answers"', 'class="ws-answers md-answers"')
    };
  });
  const Y79 = "Years 7 to 9", Y1011 = "Years 10 and 11 (GCSE)";

  // ---------- Years 7 to 9 (key stage 3; Third and Fourth level) ----------

  mdDrill("paper-drill-ks3-negatives", "lesson-third-negative-numbers-in-calculations", "negative numbers",
    "Add, subtract, multiply and divide with negative numbers, put numbers in order, and solve temperature problems.", Y79, 10, () => {
      const calc = mdMany(10, () => {
        const a = mdNZ(-12, 12), b = mdNZ(-9, 9), k = rand(4);
        if (k === 0) return [`${mdM(a)} + ${mdB(b)}`, mdM(a + b)];
        if (k === 1) return [`${mdM(a)} − ${mdB(b)}`, mdM(a - b)];
        if (k === 2) return [`${mdM(a)} × ${mdB(b)}`, mdM(a * b)];
        return [`${mdM(a * b)} ÷ ${mdB(b)}`, mdM(a)];
      });
      const sets = Array.from({ length: 2 }, () => { const s = new Set(); while (s.size < 5) s.add(mdR(-15, 15)); return [...s]; });
      const temps = mdMany(2, () => { const lo = mdR(-12, -2), hi = mdR(1, 14); return [`At night it was ${mdM(lo)}°C. By midday it was ${hi}°C. How many degrees did it rise?`, `${hi - lo}°C`]; });
      return {
        rule: mdRule("Remember", `<p>Taking away a negative is the same as adding: 5 − (−3) = 5 + 3. When you multiply or divide, two signs the same give a positive answer; two different signs give a negative.</p>`),
        tasks: [{ text: "Work these out.", items: calc, w: 3.5 },
          { text: "Write each set of numbers in order, smallest first.", cols: 1, items: sets.map(s => [shuffle(s).map(mdM).join(", &nbsp;"), s.slice().sort((p, q) => p - q).map(mdM).join(", ")]), w: 14 },
          { text: "Answer these.", cols: 1, items: temps, w: 4 }]
      };
    });

  mdDrill("paper-drill-ks3-order-of-operations", "lesson-fourth-multi-step-problems-and-the-order-of-operations", "order of operations",
    "Brackets, powers, then × and ÷, then + and −: work out mixed calculations, and put brackets in to make a sum true.", Y79, 10, () => {
      const calc = mdMany(10, () => {
        const a = mdR(2, 12), b = mdR(2, 9), c = mdR(2, 6), k = rand(6);
        return [[`${a} + ${b} × ${c}`, a + b * c], [`(${a} + ${b}) × ${c}`, (a + b) * c], [`${a * c} ÷ ${c} − ${b}`, a - b], [`${a} + ${b}²`, a + b * b],
          [`${b * c} − ${b} × ${c} + ${a}`, a], [`(${a + b} − ${b})²`, a * a]][k].map(String);
      }).map(([q, v]) => [q, mdM(Number(v))]);
      const fix = mdMany(3, () => { const a = mdR(2, 9), b = mdR(2, 9), c = mdR(2, 6); return [`${a} + ${b} × ${c} = ${(a + b) * c}`, `(${a} + ${b}) × ${c} = ${(a + b) * c}`]; });
      return {
        rule: mdRule("The order", `<p><b>B</b>rackets → <b>I</b>ndices (powers and roots) → <b>D</b>ivision and <b>M</b>ultiplication, left to right → <b>A</b>ddition and <b>S</b>ubtraction, left to right.</p>`),
        tasks: [{ text: "Work these out. Do them in the right order.", items: calc, w: 3.5 },
          { text: "Put one pair of brackets in each calculation to make it true.", cols: 1, items: fix, w: 0 }],
        note: "Task 2: the brackets go round the addition."
      };
    });

  mdDrill("paper-drill-ks3-fractions", "lesson-fourth-calculating-with-fractions-and-mixed-numbers", "fractions: the four operations",
    "Add, subtract, multiply and divide fractions and mixed numbers, and find fractions of amounts, with answers in simplest form.", Y79, 15, () => {
      const pf = () => { const d = mdR(2, 9), n = mdR(1, d - 1); return mdGcd(n, d) === 1 ? [n, d] : [1, d]; };
      const addSub = mdMany(4, () => { const [a, b] = pf(), [c, d] = pf(), plus = rand(2); if (b === d && !plus && a <= c) return null;
        const n = plus ? a * d + c * b : a * d - c * b; if (n <= 0) return null; return [`${a}/${b} ${plus ? "+" : "−"} ${c}/${d}`, mdFrac(n, b * d)]; });
      const mulDiv = mdMany(4, () => { const [a, b] = pf(), [c, d] = pf(), times = rand(2); return times ? [`${a}/${b} × ${c}/${d}`, mdFrac(a * c, b * d)] : [`${a}/${b} ÷ ${c}/${d}`, mdFrac(a * d, b * c)]; });
      const mixed = mdMany(2, () => { const w = mdR(1, 3), [a, b] = pf(), v = mdR(2, 4); return [`${w} ${a}/${b} × ${v}`, mdFrac((w * b + a) * v, b)]; });
      const of = mdMany(4, () => { const [a, b] = pf(), amt = b * mdR(2, 12); return [`${a}/${b} of ${amt}`, String(amt / b * a)]; });
      return {
        rule: mdRule("Remember", `<p><b>+ and −</b>: make the denominators the same first. <b>×</b>: multiply the tops and the bottoms. <b>÷</b>: flip the second fraction and multiply. Change mixed numbers to improper fractions before × or ÷.</p>`),
        tasks: [{ text: "Add or subtract.", items: addSub }, { text: "Multiply or divide.", items: mulDiv.concat(mixed) }, { text: "Find these amounts.", items: of, w: 3 }]
      };
    });

  mdDrill("paper-drill-ks3-percentages", "lesson-third-fractions-decimals-and-percentages-in-real-life", "percentages without a calculator",
    "Find percentages of amounts by building from 10% and 1%, change between fractions, decimals and percentages, and increase or decrease.", Y79, 15, () => {
      const pc = mdMany(6, () => { const p = pick([10, 20, 5, 15, 25, 30, 75, 1, 2.5, 35, 60]), a = pick([40, 60, 80, 120, 160, 240, 300, 360, 420, 500]); const v = p * a / 100; return Number.isInteger(v * 10) ? [`${p}% of £${a}`, `£${mdD(v)}`] : null; });
      const F = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 10], [7, 10], [1, 8], [3, 8], [1, 20], [9, 20], [3, 25]];
      const conv = mdMany(4, () => { const [n, d] = pick(F), k = rand(3), dec = n / d, p = n * 100 / d;
        return k === 0 ? [`${n}/${d} as a decimal`, String(dec)] : k === 1 ? [`${p}% as a fraction (simplest form)`, `${n}/${d}`] : [`${dec} as a percentage`, `${p}%`]; });
      const change = mdMany(4, () => { const p = pick([10, 20, 25, 5, 15, 30]), a = pick([20, 40, 60, 80, 120, 200, 360]), up = rand(2), v = a * (100 + (up ? p : -p)) / 100;
        return [`${up ? "Increase" : "Decrease"} £${a} by ${p}%`, `£${mdD(v)}`]; });
      return {
        rule: mdRule("Build it up", `<p>10% = ÷ 10 &nbsp;·&nbsp; 1% = ÷ 100 &nbsp;·&nbsp; 5% = half of 10% &nbsp;·&nbsp; 50% = ÷ 2 &nbsp;·&nbsp; 25% = ÷ 4. So 35% = 10% + 10% + 10% + 5%.</p>`),
        tasks: [{ text: "Work out.", items: pc }, { text: "Change these.", items: conv }, { text: "Find the new amount.", items: change }]
      };
    });

  mdDrill("paper-drill-ks3-ratio", "lesson-third-proportion-and-ratio", "ratio",
    "Simplify ratios, share amounts in a ratio, and scale recipes up and down.", Y79, 10, () => {
      const simp = mdMany(4, () => { const a = mdR(1, 6), b = mdR(1, 7), m = mdR(2, 8); if (a === b || mdGcd(a, b) !== 1) return null; return [`${a * m} : ${b * m}`, `${a} : ${b}`]; });
      const share = mdMany(4, () => { const a = mdR(1, 5), b = mdR(1, 5), p = mdR(2, 15) * 5; if (a === b) return null; return [`Share £${(a + b) * p} in the ratio ${a} : ${b}.`, `£${a * p} and £${b * p}`]; });
      const rec = mdMany(2, () => { const s = pick([2, 4, 6]), w = pick([3, 8, 9, 12]), g = pick([150, 200, 300, 240, 120]); const n = g / s * w; return Number.isInteger(n) && w !== s ? [`A recipe for ${s} people uses ${g} g of flour. How much for ${w} people?`, `${n} g`] : null; });
      return {
        rule: mdRule("Remember", `<p>To share in a ratio, add the parts, find what one part is worth, then multiply. £40 in 3 : 1 → 4 parts → £10 a part → £30 and £10.</p>`),
        tasks: [{ text: "Write each ratio in its simplest form.", items: simp, w: 3 }, { text: "Share these amounts.", cols: 1, items: share, w: 8 }, { text: "Solve.", cols: 1, items: rec, w: 4 }]
      };
    });

  mdDrill("paper-drill-ks3-algebra", "lesson-england-algebraic-notation-and-expanding-double-brackets-years-7-to-9", "simplify, expand and factorise",
    "Collect like terms, multiply out single and double brackets, and factorise by taking out a common factor.", Y79, 15, () => {
      const like = mdMany(4, () => { const a = mdR(2, 9), b = mdNZ(-6, 6), c = mdR(1, 9), d = mdNZ(-8, 8); if (a + b === 0) return null; return [`${a}x + ${c} ${b < 0 ? "−" : "+"} ${Math.abs(b)}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}`, mdX([a + b, "x"], [c + d, ""])]; });
      const single = mdMany(3, () => { const a = mdR(2, 7), b = mdNZ(-9, 9), v = pick(["x", "y", "a"]); return [`${a}(${v} ${b < 0 ? "−" : "+"} ${Math.abs(b)})`, mdX([a, v], [a * b, ""])]; });
      const dbl = mdMany(3, () => { const p = mdNZ(-7, 7), q = mdNZ(-7, 7); return [`(x ${p < 0 ? "−" : "+"} ${Math.abs(p)})(x ${q < 0 ? "−" : "+"} ${Math.abs(q)})`, mdX([1, "x²"], [p + q, "x"], [p * q, ""])]; });
      const fac = mdMany(4, () => { const f = mdR(2, 6), a = mdR(1, 5), b = mdR(1, 9); if (mdGcd(a, b) !== 1) return null; return [`${f * a}x + ${f * b}`, `${f}(${mdX([a, "x"], [b, ""])})`]; });
      return {
        rule: mdRule("Remember", `<p>Like terms have the same letters: 3x and 5x, not 3x and 5. In (x + 2)(x + 5), multiply each term in one bracket by each term in the other: x² + 5x + 2x + 10 = x² + 7x + 10.</p>`),
        tasks: [{ text: "Simplify.", items: like, w: 5 }, { text: "Multiply out the brackets and simplify.", items: single.concat(dbl), w: 6 }, { text: "Factorise fully.", items: fac, w: 5 }]
      };
    });

  mdDrill("paper-drill-ks3-equations", "lesson-third-solving-equations-and-using-formulae", "solving equations",
    "Solve two-step equations, equations with brackets and with the unknown on both sides, and use a formula.", Y79, 15, () => {
      const two = mdMany(4, () => { const a = mdR(2, 9), x = mdNZ(-6, 12), b = mdNZ(-15, 15); return [`${mdX([a, "x"], [b, ""])} = ${mdM(a * x + b)}`, `x = ${mdM(x)}`]; });
      const brk = mdMany(2, () => { const a = mdR(2, 6), b = mdNZ(-7, 7), x = mdR(-4, 10); return [`${a}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) = ${mdM(a * (x + b))}`, `x = ${mdM(x)}`]; });
      const both = mdMany(3, () => { const c = mdR(1, 5), a = c + mdR(1, 5), b = mdNZ(-9, 9), x = mdR(-3, 9), d = (a - c) * x + b; return [`${mdX([a, "x"], [b, ""])} = ${mdX([c, "x"], [d, ""])}`, `x = ${mdM(x)}`]; });
      const form = mdMany(2, () => { const u = mdR(0, 12), a = mdR(2, 6), t = mdR(2, 9); return [`v = u + at. Find v when u = ${u}, a = ${a} and t = ${t}.`, `v = ${u + a * t}`]; });
      return {
        rule: mdRule("Remember", `<p>Do the same to both sides. Undo + and − first, then × and ÷. With x on both sides, take the smaller number of x's from both sides first. Check by putting your answer back in.</p>`),
        tasks: [{ text: "Solve.", items: two.concat(brk), w: 4 }, { text: "Solve. These have x on both sides.", items: both, w: 4 }, { text: "Use the formula.", cols: 1, items: form, w: 4 }]
      };
    });

  mdDrill("paper-drill-ks3-angles", "lesson-third-angles-in-shapes-and-with-parallel-lines", "angle facts",
    "Find missing angles on a line, around a point, in triangles, quadrilaterals and polygons, and with parallel lines, giving the reason.", Y79, 15, () => {
      const qsList = mdMany(10, () => {
        const a = mdR(25, 80), b = mdR(30, 75), k = rand(9);
        return [[`Two angles on a straight line. One is ${a + 40}°. The other?`, `${140 - a}° (angles on a line add to 180°)`],
          [`Angles around a point: ${a + 60}°, ${b + 90}° and x. Find x.`, `${210 - a - b}° (angles round a point add to 360°)`],
          [`A triangle has angles ${a}° and ${b}°. The third angle?`, `${180 - a - b}° (angles in a triangle add to 180°)`],
          [`An isosceles triangle has a top angle of ${2 * a}°. Each base angle?`, `${90 - a}° ((180 − ${2 * a}) ÷ 2)`],
          [`A quadrilateral has angles ${a + 50}°, ${b + 40}° and ${a + b}°. The fourth?`, `${270 - 2 * a - 2 * b}° (angles in a quadrilateral add to 360°)`],
          [`Two parallel lines are crossed by a line. One angle is ${a + 30}°. What is the alternate angle?`, `${a + 30}° (alternate angles are equal)`],
          [`Two parallel lines are crossed by a line. One angle is ${a + 30}°. What is the co-interior angle?`, `${150 - a}° (co-interior angles add to 180°)`],
          [`What do the interior angles of a ${pick(["pentagon", "hexagon", "octagon"])} add up to?`, null],
          [`What is each exterior angle of a regular ${pick(["pentagon", "hexagon", "octagon", "decagon"])}?`, null]][k];
      }).map(([q, ans]) => {
        if (ans) return [q, ans];
        const n = { pentagon: 5, hexagon: 6, octagon: 8, decagon: 10 }[q.match(/(pentagon|hexagon|octagon|decagon)/)[1]];
        return [q, /exterior/.test(q) ? `${360 / n}° (360 ÷ ${n})` : `${(n - 2) * 180}° ((${n} − 2) × 180)`];
      });
      return {
        rule: mdRule("Angle facts", `<p>Line 180° · point 360° · triangle 180° · quadrilateral 360° · polygon (n − 2) × 180° · vertically opposite, alternate and corresponding angles are equal · co-interior angles add to 180°.</p>`),
        tasks: [{ text: "Find each angle. Say which fact you used.", cols: 1, items: qsList, w: 7 }]
      };
    });

  mdDrill("paper-drill-ks3-area-volume", "lesson-third-area-and-volume-including-compound-shapes", "area and volume",
    "Areas of rectangles, triangles, parallelograms, trapeziums and circles, and volumes of cuboids and prisms.", Y79, 15, () => {
      const its = mdMany(10, () => {
        const a = mdR(3, 12), b = mdR(2, 10), c = mdR(2, 9), k = rand(7);
        if (k === 0) return (a * b) % 2 ? null : [`Triangle: base ${a} cm, height ${b} cm. Area?`, `${a * b / 2} cm²`];
        if (k === 1) return [`Parallelogram: base ${a} cm, perpendicular height ${b} cm. Area?`, `${a * b} cm²`];
        if (k === 2) return ((a + b) * c) % 2 ? null : [`Trapezium: parallel sides ${a} cm and ${b} cm, height ${c} cm. Area?`, `${(a + b) * c / 2} cm²`];
        if (k === 3) return [`Circle: radius ${c} cm. Area? (π = 3.14)`, `${mdD(3.14 * c * c)} cm²`];
        if (k === 4) return [`Circle: diameter ${2 * c} cm. Circumference? (π = 3.14)`, `${mdD(3.14 * 2 * c)} cm`];
        if (k === 5) return [`Cuboid: ${a} cm by ${b} cm by ${c} cm. Volume?`, `${a * b * c} cm³`];
        const A = pick([6, 8, 12, 15, 20]); return [`Prism: cross-section ${A} cm², length ${a} cm. Volume?`, `${A * a} cm³`];
      });
      return {
        rule: mdRule("Formulae", `<p>Triangle ½ × b × h · parallelogram b × h · trapezium ½(a + b)h · circle area πr², circumference πd · cuboid l × w × h · prism area of cross-section × length.</p>`),
        tasks: [{ text: "Work these out. Give the units.", cols: 1, items: its, w: 6 }]
      };
    });

  mdDrill("paper-drill-ks3-sequences", "lesson-fourth-sequences-finding-the-nth-term", "sequences and the nth term",
    "Continue sequences, find the nth term of linear sequences, and use an nth term to find terms.", Y79, 10, () => {
      const lin = () => { const a = mdNZ(-5, 9), b = mdR(-8, 10); return [a, b, [1, 2, 3, 4].map(n => a * n + b)]; };
      const next = mdMany(3, () => { const [a, b, s] = lin(); return [`${s.map(mdM).join(", ")}, …, … &nbsp;(next two)`, `${mdM(a * 5 + b)}, ${mdM(a * 6 + b)}`]; });
      const nth = mdMany(4, () => { const [a, b, s] = lin(); return [`${s.map(mdM).join(", ")}, …`, mdX([a, "n"], [b, ""])]; });
      const use = mdMany(3, () => { const a = mdR(2, 9), b = mdNZ(-9, 9), n = mdR(10, 30); return [`nth term ${mdX([a, "n"], [b, ""])}: the ${n}th term`, mdM(a * n + b)]; });
      return {
        rule: mdRule("The nth term", `<p>Find the difference between terms: that is the number in front of n. Then compare with the first term. 5, 8, 11, 14: difference 3 → 3n; 3 × 1 = 3 and the first term is 5, so add 2: <b>3n + 2</b>.</p>`),
        tasks: [{ text: "Write the next two terms.", cols: 1, items: next, w: 6 }, { text: "Find the nth term.", items: nth, w: 4 }, { text: "Use the nth term.", items: use, w: 3 }]
      };
    });

  mdDrill("paper-drill-ks3-averages", "lesson-fourth-averages-and-spread", "averages and range",
    "Find the mean, median, mode and range of small sets of data, and use them to compare.", Y79, 15, () => {
      const sets = Array.from({ length: 3 }, () => {
        for (;;) {
          const n = pick([5, 6, 7]), d = Array.from({ length: n }, () => mdR(1, 20)); d[rand(n)] = d[0];
          const s = d.slice().sort((p, q) => p - q), sum = d.reduce((t, v) => t + v, 0), counts = {}; d.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
          const top = Math.max(...Object.values(counts)), modes = Object.keys(counts).filter(k => counts[k] === top);
          if (sum % n || modes.length > 1) continue;
          const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
          return { d, mean: sum / n, med, mode: modes[0], range: s[n - 1] - s[0] };
        }
      });
      const [p, q] = sets;
      const items = sets.map(s => [`<b>${s.d.join(", &nbsp;")}</b><br>mean ${blank(3)} &nbsp; median ${blank(3)} &nbsp; mode ${blank(3)} &nbsp; range ${blank(3)}`,
        `mean ${s.mean}, median ${s.med}, mode ${s.mode}, range ${s.range}`]);
      const higher = p => p.mean === q.mean ? `The means are the same (${p.mean})` : `Set ${p.mean > q.mean ? 1 : 2} has the higher mean (${p.mean} and ${q.mean})`;
      return {
        rule: mdRule("Remember", `<p><b>Mean</b>: add them up and divide by how many. <b>Median</b>: the middle one when in order. <b>Mode</b>: the most common. <b>Range</b>: biggest − smallest (it measures spread).</p>`),
        tasks: [{ text: "For each set, find the mean, median, mode and range.", cols: 1, items, w: 0 },
          { text: "Compare sets 1 and 2: which is higher on average, and which is more spread out?", cols: 1, items: [["Answer with the mean (or median) and the range", `${higher(p)}; ${p.range === q.range ? "the ranges are the same" : `set ${p.range > q.range ? 1 : 2} is more spread out`} (ranges ${p.range} and ${q.range})`]], work: 2 }]
      };
    });

  // ---------- Years 10 and 11 (GCSE) ----------

  mdDrill("paper-drill-ks4-indices", "lesson-england-powers-roots-indices-and-standard-form-years-10-and-11", "indices and standard form",
    "Use the laws of indices, zero, negative and fractional indices, and calculate in standard form.", Y1011, 15, () => {
      const laws = mdMany(6, () => { const m = mdR(2, 9), n = mdR(2, 6), k = rand(3), v = pick(["x", "a", "y"]);
        return k === 0 ? [`${v}${mdSup(m)} × ${v}${mdSup(n)}`, `${v}${mdSup(m + n)}`] : k === 1 ? [`${v}${mdSup(m)} ÷ ${v}${mdSup(n)}`, `${v}${mdSup(m - n)}`] : [`(${v}${mdSup(m)})${mdSup(n)}`, `${v}${mdSup(m * n)}`]; });
      const vals = mdMany(5, () => pick([["7⁰", "1"], ["5⁻¹", "1/5"], ["2⁻³", "1/8"], ["10⁻²", "1/100"], ["49<sup>1/2</sup>", "7"], ["64<sup>1/3</sup>", "4"], ["8<sup>2/3</sup>", "4"], ["27<sup>2/3</sup>", "9"], ["16<sup>3/4</sup>", "8"], ["(1/4)<sup>−1/2</sup>", "2"], ["25<sup>−1/2</sup>", "1/5"], ["4<sup>3/2</sup>", "8"]]));
      const sf = mdMany(5, () => { const a = mdR(2, 9), b = mdR(2, 9), p = mdR(2, 7), q = mdR(-4, 6), k = rand(2);
        if (k === 0) { const pr = a * b; return [`(${a} × 10${mdSup(p)}) × (${b} × 10${mdSup(q)})`, pr >= 10 ? `${pr / 10} × 10${mdSup(p + q + 1)}` : `${pr} × 10${mdSup(p + q)}`]; }
        const n = mdR(11, 99) * 10 ** mdR(2, 6), dg = String(n).replace(/0+$/, ""), e = String(n).length - 1; return [n.toLocaleString("en-GB").replace(/,/g, " "), `${dg[0]}${dg.length > 1 ? "." + dg.slice(1) : ""} × 10${mdSup(e)}`]; });
      return {
        rule: mdRule("Laws of indices", `<p>aᵐ × aⁿ = aᵐ⁺ⁿ · aᵐ ÷ aⁿ = aᵐ⁻ⁿ · (aᵐ)ⁿ = aᵐⁿ · a⁰ = 1 · a⁻ⁿ = 1/aⁿ · a<sup>1/n</sup> = ⁿ√a. Standard form: A × 10ⁿ with 1 ≤ A &lt; 10.</p>`),
        tasks: [{ text: "Simplify.", items: laws, w: 3 }, { text: "Work out, without a calculator.", items: vals, w: 3 }, { text: "Give each answer in standard form.", cols: 1, items: sf, w: 6 }]
      };
    });

  mdDrill("paper-drill-ks4-quadratics", "lesson-england-quadratics-roots-turning-points-and-solving-years-10-and-11", "factorise and solve quadratics",
    "Factorise x² + bx + c and the difference of two squares, then solve quadratic equations by factorising.", Y1011, 15, () => {
      const br = c => `(x ${c < 0 ? "−" : "+"} ${Math.abs(c)})`;
      const fac = mdMany(4, () => { const p = mdNZ(-8, 8), q = mdNZ(-8, 8); if (p + q === 0) return null; return [mdX([1, "x²"], [p + q, "x"], [p * q, ""]), `${br(p)}${br(q)}`]; });
      const dots = mdMany(2, () => { const a = pick([1, 1, 2, 3]), c = mdR(2, 9); return [mdX([a * a, "x²"], [-c * c, ""]), `(${mdX([a, "x"], [c, ""])})(${mdX([a, "x"], [-c, ""])})`]; });
      const solve = mdMany(4, () => { const p = mdNZ(-7, 7), q = mdNZ(-7, 7); if (p === q) return null; return [`${mdX([1, "x²"], [p + q, "x"], [p * q, ""])} = 0`, `x = ${mdM(-p)} or x = ${mdM(-q)}`]; });
      return {
        rule: mdRule("Remember", `<p>x² + bx + c: find two numbers that multiply to c and add to b. x² − a² = (x + a)(x − a). To solve, get 0 on one side, factorise, then set each bracket to 0.</p>`),
        tasks: [{ text: "Factorise.", items: fac.concat(dots), w: 6 }, { text: "Solve.", items: solve, w: 6 }]
      };
    });

  mdDrill("paper-drill-ks4-simultaneous", "lesson-england-simultaneous-equations-and-inequalities-years-10-and-11", "simultaneous equations and inequalities",
    "Solve pairs of linear simultaneous equations by elimination, and solve linear inequalities.", Y1011, 15, () => {
      const pairs = mdMany(4, () => { const x = mdR(-4, 8), y = mdR(-4, 8), a = mdR(1, 5), b = mdR(1, 5), c = mdR(1, 5), d = -mdR(1, 5); if (a * d - b * c === 0) return null;
        return [`${mdX([a, "x"], [b, "y"])} = ${mdM(a * x + b * y)} &nbsp; and &nbsp; ${mdX([c, "x"], [d, "y"])} = ${mdM(c * x + d * y)}`, `x = ${mdM(x)}, y = ${mdM(y)}`]; });
      const ineq = mdMany(3, () => { const a = mdR(2, 6), b = mdNZ(-9, 9), x = mdR(-3, 8), s = pick(["<", ">", "≤", "≥"]); return [`${mdX([a, "x"], [b, ""])} ${s} ${mdM(a * x + b)}`, `x ${s} ${mdM(x)}`]; });
      return {
        rule: mdRule("Elimination", `<p>Make the number in front of x (or y) the same in both equations, then add or subtract to get rid of it. Solve, then put your answer back in to find the other letter. Check in the other equation.</p>`),
        tasks: [{ text: "Solve each pair. Show your working.", cols: 1, items: pairs, work: 3 }, { text: "Solve.", items: ineq, w: 4 }]
      };
    });

  mdDrill("paper-drill-ks4-graphs", "lesson-england-straight-line-graphs-y-mx-c-parallel-and-perpendicular-lines-years-10-and-11", "straight-line graphs",
    "Gradients and intercepts, the equation of a line through two points, and parallel and perpendicular lines.", Y1011, 15, () => {
      const read = mdMany(4, () => { const m = mdNZ(-5, 5), c = mdR(-8, 8), d = pick([1, 1, 2, 3]); return [`${d === 1 ? "y" : `${d}y`} = ${mdX([m * d, "x"], [c * d, ""])}: gradient and y-intercept`, `${mdM(m)} and ${mdM(c)}`]; });
      const grad = mdMany(3, () => { const x1 = mdR(-4, 4), y1 = mdR(-5, 5), dx = mdR(1, 6), dy = mdNZ(-8, 8); return [`gradient through (${mdM(x1)}, ${mdM(y1)}) and (${mdM(x1 + dx)}, ${mdM(y1 + dy)})`, mdFrac(dy, dx, false)]; });
      const eq = mdMany(2, () => { const m = mdNZ(-4, 4), c = mdR(-6, 6), x1 = mdR(-2, 2), x2 = x1 + mdR(1, 3); return [`the equation of the line through (${mdM(x1)}, ${mdM(m * x1 + c)}) and (${mdM(x2)}, ${mdM(m * x2 + c)})`, `y = ${mdX([m, "x"], [c, ""])}`]; });
      const perp = mdMany(2, () => { const m = mdNZ(-5, 5); return [`the gradient of a line perpendicular to y = ${mdX([m, "x"], [mdR(-5, 5), ""])} (higher)`, mdFrac(-1, m, false)]; });
      return {
        rule: mdRule("y = mx + c", `<p>m is the gradient (change in y ÷ change in x) and c is where the line crosses the y-axis. Parallel lines have the same gradient. Perpendicular gradients multiply to −1.</p>`),
        tasks: [{ text: "Write down the gradient and the y-intercept.", cols: 1, items: read, w: 6 }, { text: "Find…", cols: 1, items: grad.concat(eq, perp), w: 6 }]
      };
    });

  mdDrill("paper-drill-ks4-trigonometry", "lesson-england-pythagoras-trigonometry-and-bearings-years-10-and-11", "Pythagoras and trigonometry",
    "Use Pythagoras' theorem and sin, cos and tan to find sides and angles in right-angled triangles. Calculator needed.", Y1011, 15, () => {
      const T = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
      const py = mdMany(3, () => { const [a, b, c] = pick(T); return rand(2) ? [`Shorter sides ${a} cm and ${b} cm. The hypotenuse?`, `${c} cm`] : [`Hypotenuse ${c} cm, one side ${a} cm. The other side?`, `${b} cm`]; });
      const rad = d => d * Math.PI / 180;
      const trig = mdMany(5, () => { const ang = mdR(20, 70), s = mdR(5, 20), k = rand(4);
        if (k === 0) return [`Hypotenuse ${s} cm, angle ${ang}°. The side opposite the angle?`, `${mdD(s * Math.sin(rad(ang)), 1)} cm`];
        if (k === 1) return [`Hypotenuse ${s} cm, angle ${ang}°. The side next to the angle?`, `${mdD(s * Math.cos(rad(ang)), 1)} cm`];
        if (k === 2) return [`Side next to a ${ang}° angle is ${s} cm. The side opposite it?`, `${mdD(s * Math.tan(rad(ang)), 1)} cm`];
        const o = mdR(3, 12), a = mdR(3, 12); return [`Opposite ${o} cm, adjacent ${a} cm. The angle?`, `${mdD(Math.atan(o / a) * 180 / Math.PI, 1)}°`]; });
      return {
        rule: mdRule("Right-angled triangles", `<p>a² + b² = c² (c is the hypotenuse) · <b>SOH</b> sin = opp ÷ hyp · <b>CAH</b> cos = adj ÷ hyp · <b>TOA</b> tan = opp ÷ adj. To find an angle, use sin⁻¹, cos⁻¹ or tan⁻¹.</p>`),
        tasks: [{ text: "Use Pythagoras' theorem.", cols: 1, items: py, w: 5 }, { text: "Use trigonometry. Give answers to 1 decimal place.", cols: 1, items: trig, w: 5 }],
        note: "Accept answers 0.1 either side if the pupil rounded part-way through."
      };
    });

  mdDrill("paper-drill-ks4-growth", "lesson-england-growth-decay-compound-interest-and-iteration-years-10-and-11", "multipliers, compound interest and reverse percentages",
    "Write percentage changes as multipliers, work out compound interest and depreciation, and find the original amount. Calculator needed.", Y1011, 15, () => {
      const mult = mdMany(4, () => { const p = pick([3, 4, 5, 12, 15, 20, 35, 2.5, 7]), up = rand(2); return [`${up ? "Increase" : "Decrease"} by ${p}%`, `× ${mdD(up ? 1 + p / 100 : 1 - p / 100, 3)}`]; });
      const ci = mdMany(3, () => { const P = pick([500, 800, 1000, 2000, 2500]), r = pick([2, 3, 4, 5]), n = mdR(2, 5), up = rand(2);
        return up ? [`£${P} at ${r}% compound interest for ${n} years`, `£${(P * (1 + r / 100) ** n).toFixed(2)}`] : [`A £${P * 10} car loses ${r * 3}% a year. Its value after ${n} years`, `£${(P * 10 * (1 - r * 3 / 100) ** n).toFixed(2)}`]; });
      const rev = mdMany(3, () => { const p = pick([10, 20, 25, 40, 15]), up = rand(2), old = mdR(4, 40) * 20, now = old * (100 + (up ? p : -p)) / 100;
        return [`After a ${p}% ${up ? "rise" : "cut"} a price is £${mdD(now)}. The original price?`, `£${old}`]; });
      return {
        rule: mdRule("Multipliers", `<p>Up 6% → × 1.06 · down 6% → × 0.94. Compound: amount × multiplierⁿ. Reverse: new amount ÷ multiplier (not take the percentage off the new amount).</p>`),
        tasks: [{ text: "Write the multiplier.", items: mult, w: 3 }, { text: "Work out.", cols: 1, items: ci, w: 5 }, { text: "Find the original.", cols: 1, items: rev, w: 4 }]
      };
    });

  mdDrill("paper-drill-ks4-probability", "lesson-england-combined-events-listing-tree-diagrams-and-conditional-probability-years-10-and-11", "combined events",
    "Use the AND and OR rules, tree diagrams with and without replacement, and the product rule for counting.", Y1011, 15, () => {
      const r = mdR(3, 7), g = mdR(2, 6), t = r + g;
      const bag = [[`P(red, then red), putting the first back`, mdFrac(r * r, t * t, false)], [`P(red, then red), not putting it back`, mdFrac(r * (r - 1), t * (t - 1), false)],
        [`P(one of each colour), not putting it back`, mdFrac(2 * r * g, t * (t - 1), false)], [`P(at least one green), not putting it back`, mdFrac(t * (t - 1) - r * (r - 1), t * (t - 1), false)]];
      const pa = pick([0.2, 0.3, 0.4, 0.6, 0.7]), pb = pick([0.1, 0.2, 0.5, 0.8]);
      const rules = [[`P(A) = ${pa}, P(B) = ${pb}, independent. P(A and B)`, mdD(pa * pb)], [`P(A) = ${pa}. P(not A)`, mdD(1 - pa)],
        [`P(rain) = ${pb} each day, independently. P(no rain on two days)`, mdD((1 - pb) ** 2, 4)]];
      const a = mdR(2, 5), b = mdR(3, 6), c = mdR(2, 4), pin = mdR(3, 4);
      const count = [[`${a} shirts, ${b} pairs of trousers and ${c} jackets. How many outfits?`, String(a * b * c)], [`How many ${pin}-digit codes use the digits 0 to 9?`, String(10 ** pin)]];
      return {
        rule: mdRule("Rules", `<p><b>AND</b>: multiply along the branches · <b>OR</b>: add the results · without replacement, the second fraction has one fewer on top and bottom · P(not A) = 1 − P(A).</p>`),
        tasks: [{ text: `A bag has ${r} red and ${g} green counters. Two are taken. Find (as fractions):`, cols: 1, items: bag, w: 4 }, { text: "Work out.", cols: 1, items: rules, w: 4 }, { text: "Count.", cols: 1, items: count, w: 4 }]
      };
    });

  mdDrill("paper-drill-ks4-bounds", "lesson-england-limits-of-accuracy-rounding-truncating-and-bounds-years-10-and-11", "bounds and error intervals",
    "Write error intervals for rounded and truncated numbers, and use upper and lower bounds in calculations.", Y1011, 10, () => {
      const err = mdMany(4, () => { const k = rand(3);
        if (k === 0) { const t = mdR(11, 99); return [`x = ${(t / 10).toFixed(1)} to 1 decimal place`, `${((t * 10 - 5) / 100).toFixed(2)} ≤ x &lt; ${((t * 10 + 5) / 100).toFixed(2)}`]; }
        if (k === 1) { const v = mdR(12, 95) * 10; return [`y = ${v} to the nearest 10`, `${v - 5} ≤ y &lt; ${v + 5}`]; }
        const t = mdR(11, 99); return [`z = ${(t / 10).toFixed(1)}, truncated to 1 decimal place`, `${(t / 10).toFixed(1)} ≤ z &lt; ${((t + 1) / 10).toFixed(1)}`]; });
      const calc = mdMany(3, () => { const a = mdR(4, 15), b = mdR(3, 12), k = rand(3);
        if (k === 0) return [`A rectangle is ${a} cm by ${b} cm, both to the nearest cm. Upper bound of the area?`, `${(a + 0.5) * (b + 0.5)} cm²`];
        if (k === 1) return [`A square has sides of ${a} cm to the nearest cm. Lower bound of the perimeter?`, `${4 * (a - 0.5)} cm`];
        const d = a * 10, tt = b; return [`${d} m (nearest 10 m) in ${tt} s (nearest second). Upper bound of the speed? (2 d.p.)`, `${mdD((d + 5) / (tt - 0.5))} m/s`]; });
      return {
        rule: mdRule("Remember", `<p>Rounded to the nearest 10: half of 10 either side, so 70 → 65 ≤ x &lt; 75. Truncated: from the number up to the next one. For the biggest answer to a ÷ b, use the upper bound of a and the lower bound of b.</p>`),
        tasks: [{ text: "Write the error interval.", items: err, w: 6 }, { text: "Use bounds.", cols: 1, items: calc, w: 5 }]
      };
    });
