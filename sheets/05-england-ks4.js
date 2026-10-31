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

