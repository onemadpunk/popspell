
  /* ===== England key stage 3: the statements the Third and Fourth level lessons don't cover ===== */

  const KS3 = id => `lesson-england-${id}-years-7-to-9`;
  // A Venn diagram: two overlapping circles in a box, with set names and optional numbers in each region
  // (only A, both, only B, neither)
  const venn = (a, b, [onlyA = "", both = "", onlyB = "", neither = ""] = [], w = 300, hgt = 150) => svg(w, hgt,
    `<rect x="2" y="2" width="${w - 4}" height="${hgt - 4}" rx="6" class="pp-shape" style="fill:none"/>
    <circle cx="${w / 2 - 40}" cy="${hgt / 2 + 6}" r="52" class="pp-shape" style="fill:none"/><circle cx="${w / 2 + 40}" cy="${hgt / 2 + 6}" r="52" class="pp-shape" style="fill:none"/>
    <text x="${w / 2 - 80}" y="20" text-anchor="middle" class="pp-small">${a}</text><text x="${w / 2 + 80}" y="20" text-anchor="middle" class="pp-small">${b}</text>
    <text x="${w / 2 - 62}" y="${hgt / 2 + 11}" text-anchor="middle" class="pp-lab">${onlyA}</text><text x="${w / 2}" y="${hgt / 2 + 11}" text-anchor="middle" class="pp-lab">${both}</text>
    <text x="${w / 2 + 62}" y="${hgt / 2 + 11}" text-anchor="middle" class="pp-lab">${onlyB}</text><text x="${w - 22}" y="${hgt - 14}" text-anchor="middle" class="pp-lab">${neither}</text>`);

  add("paper-ks3-algebra", KS3("algebraic-notation-and-expanding-double-brackets"), "Algebra the short way", "Writing algebra the short way, fractions as coefficients, and expanding double brackets with a grid.", (who, h) => ({
    pupil: `${h.sheetHead("Algebra the short way", who)}
      ${q4([`Write each one the short way: &nbsp; p × q = ${blank(3)} &nbsp; n + n + n + n = ${blank(3)} &nbsp; 5 × a × b = ${blank(3)} &nbsp; m ÷ 4 = ${blank(3)} &nbsp; x × x × y = ${blank(3)} &nbsp; 0.5 × t = ${blank(3)}`,
        `Write each one out in full, using ×, ÷ and +: &nbsp; 3ab = ${blank(6)} &nbsp; c²d = ${blank(6)} &nbsp; ⅓y = ${blank(6)} &nbsp; k/2 = ${blank(6)}`,
        `Complete the grid to expand (x + 4)(x + 3), then simplify.
          <table class="pp-table" style="margin:4px 0;width:auto"><tr><th>×</th><th>x</th><th>+3</th></tr><tr><th>x</th><td style="width:4em"></td><td style="width:4em"></td></tr><tr><th>+4</th><td></td><td></td></tr></table>
          (x + 4)(x + 3) = ${blank(9)}`,
        `Expand and simplify: &nbsp; (x + 2)(x + 7) = ${blank(8)} &nbsp; (x + 5)(x − 1) = ${blank(8)} &nbsp; (x − 3)(x − 4) = ${blank(8)} &nbsp; (2x + 1)(x + 3) = ${blank(8)}`,
        `A rectangle is (x + 6) cm long and (x + 2) cm wide. Sketch it split into four parts, label each part's area, and write the total area as an expression.<div class="pp-draw pp-short"></div>`,
        `Expand (x + 5)². ${blank(8)} &nbsp; Ali says (x + 5)² = x² + 25. Explain what Ali has missed.${lines(1)}`,
        `Expand (x + 1)(x + 2)(x + 3). Do two brackets first.${lines(2)}`])}`,
    answers: answersPage(h, "Algebra the short way", ["pq, 4n, 5ab, m/4, x²y, ½t (not 0.5t)", "3 × a × b, c × c × d, ⅓ × y (or y ÷ 3), k ÷ 2",
      "x², 3x, 4x, 12: x² + 7x + 12", "x² + 9x + 14, x² + 4x − 5, x² − 7x + 12, 2x² + 7x + 3",
      "Parts x², 2x, 6x and 12: area = x² + 8x + 12 cm²", "x² + 10x + 25. Ali has missed the two 5x parts (the middle term): (x + 5)² means (x + 5)(x + 5)",
      "(x + 1)(x + 2) = x² + 3x + 2, then × (x + 3) = x³ + 6x² + 11x + 6"], "In question 4, watch the signs: −3 × −4 = +12.")
  }));

  add("paper-ks3-graphs", KS3("using-graphs-to-estimate-and-solve-and-geometric-sequences"), "Read it from the graph", "Estimating from graphs, solving simultaneous equations where lines cross, real-life graphs, and geometric sequences.", (who, h) => ({
    pupil: `${h.sheetHead("Read it from the graph", who)}
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="flex:none">${plot(-1, 4, -1, 10, 30, 14, 1, 2, (X, Y) => curve(X, Y, x => x * x, -1, 3.15), ["x", "y"], 0.5, 1)}<p class="pp-small" style="margin:0;text-align:center">y = x²</p></div>
        <div>${q4([`Use the graph of y = x² to estimate: &nbsp; y when x = 1.5: ${blank(3)} &nbsp; y when x = 2.5: ${blank(3)} &nbsp; x when y = 3 (x is positive): ${blank(3)} &nbsp; x when y = 8 (x is positive): ${blank(3)}`,
          `On the grid, draw the lines y = x + 1 and y = 7 − x. Where do they cross? ${blank(5)} &nbsp; So the solution of y = x + 1 and y = 7 − x is x = ${blank(2)}, y = ${blank(2)}.`])}</div></div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="flex:none">${plot(0, 10, 0, 14, 22, 9, 2, 2, (X, Y) => `<polyline points="${X(0)},${Y(3)} ${X(2)},${Y(3)} ${X(10)},${Y(13)}" class="pp-shape"/>`, ["miles", "£"], 1, 1)}<p class="pp-small" style="margin:0;text-align:center">A taxi fare</p></div>
        <div>${q4([`The graph shows a taxi fare. &nbsp; How much is a 6-mile journey? ${blank(3)} &nbsp; How far can you go for £10.50? ${blank(3)} &nbsp; Why is the graph flat at the start?${lines(1)}`], 3)}</div></div>
      ${q4([`Write the next two terms and the multiplier: &nbsp; 3, 6, 12, 24, ${blank(2)}, ${blank(2)} &nbsp; (× ${blank(2)}) &nbsp;&nbsp; 81, 27, 9, ${blank(2)}, ${blank(2)} &nbsp; (× ${blank(2)}) &nbsp;&nbsp; 5, 10, 20, ${blank(2)}, ${blank(2)} &nbsp; (× ${blank(2)})`,
        `Sort these into geometric (multiply each time), arithmetic (add each time) or other: &nbsp; 2, 4, 8, 16 &nbsp;·&nbsp; 2, 4, 6, 8 &nbsp;·&nbsp; 1, 4, 9, 16 &nbsp;·&nbsp; 1, 1, 2, 3, 5 &nbsp;·&nbsp; 100, 50, 25, 12.5${lines(2)}`,
        `A bacteria colony doubles every hour. It starts with 50. How many are there after 5 hours? Is this geometric or arithmetic?${lines(1)}`], 4)}`,
    answers: answersPage(h, "Read it from the graph", ["About 2.2 (exactly 2.25), about 6.2 (6.25), about 1.7, about 2.8 (any answers close to these)",
      "They cross at (3, 4), so x = 3, y = 4", "£8; 8 miles; the first 2 miles cost a fixed £3 whatever the distance, so the fare doesn't rise yet",
      "48, 96 (× 2); 3, 1 (× ⅓, or ÷ 3); 40, 80 (× 2)", "Geometric: 2, 4, 8, 16 and 100, 50, 25, 12.5. Arithmetic: 2, 4, 6, 8. Other: 1, 4, 9, 16 (square numbers) and 1, 1, 2, 3, 5 (each term adds the two before)",
      "50 × 2⁵ = 1600. Geometric: it multiplies by 2 each hour"], "Answers read from a graph are estimates: accept anything close.")
  }));

  add("paper-ks3-fraction-of", KS3("one-quantity-as-a-fraction-of-another-and-ratios-as-fractions"), "What fraction of?", "One quantity as a fraction of another (less than and greater than 1), ratios as fractions, and ratio graphs.", (who, h) => ({
    pupil: `${h.sheetHead("What fraction of?", who)}
      ${q4([`Write the first amount as a fraction of the second, in its simplest form: &nbsp; 15 of 20: ${blank(3)} &nbsp; 18 of 12: ${blank(3)} &nbsp; 40p of £2: ${blank(3)} &nbsp; 45 minutes of 1 hour: ${blank(3)} &nbsp; 750 g of 2 kg: ${blank(3)} &nbsp; 3 m of 50 cm: ${blank(3)}`,
        `A rope is 8 m long and a ribbon is 5 m long. &nbsp; The ribbon is ${blank(3)} of the rope. &nbsp; The rope is ${blank(3)} of the ribbon, or ${blank(3)} times as long.`,
        `Paint is mixed blue : yellow in the ratio 3 : 5. &nbsp; What fraction of the paint is blue? ${blank(3)} &nbsp; Yellow? ${blank(3)} &nbsp; There is ${blank(3)} as much blue as yellow.`,
        `In a class, boys : girls = 4 : 7. There are 33 pupils. How many are girls? Show your working with fractions.${lines(2)}`,
        `Complete the table for blue : yellow = 3 : 5, then plot the points on the grid. <table class="pp-table" style="margin:4px 0;width:auto"><tr><th>Blue (litres)</th><td>0</td><td>3</td><td>6</td><td>9</td></tr><tr><th>Yellow (litres)</th><td>0</td><td>5</td><td style="width:3em"></td><td style="width:3em"></td></tr></table>
          ${plot(0, 10, 0, 16, 24, 9, 2, 2, () => "", ["blue", "yellow"], 1, 1)}
          What shape do the points make? ${blank(6)} &nbsp; Complete: yellow = ${blank(3)} × blue.`,
        `Jo says that in the ratio 3 : 5, blue is ⅗ of the paint. Explain Jo's mistake.${lines(1)}`])}`,
    answers: answersPage(h, "What fraction of?", ["¾, 3/2 (1½), ⅕ (40/200), ¾ (45/60), 3/8 (750/2000), 6 (300/50)",
      "⅝; 8/5, or 1⅗ times", "⅜ blue, ⅝ yellow; ⅗ as much blue as yellow", "11 parts, each 3 pupils: girls are 7/11 of 33 = 21",
      "Yellow 10 and 15. A straight line through (0, 0). Yellow = 5/3 × blue", "⅗ compares blue with yellow. There are 8 parts in total, so blue is ⅜ of the paint"],
      "Check the units are the same before writing a fraction: 40p of £2 is 40/200.")
  }));

  add("paper-ks3-venn", KS3("sets-of-numbers-and-venn-diagrams"), "Sort it in a Venn", "Listing outcomes systematically, Venn diagrams with unions and intersections, probabilities from them, and infinite sets.", (who, h) => ({
    pupil: `${h.sheetHead("Sort it in a Venn", who)}
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="flex:none">${venn("A: even numbers", "B: multiples of 3")}</div>
        <div>${q4([`Put the numbers 1 to 12 in the Venn diagram. Then list: &nbsp; A ∩ B (in both): ${blank(5)} &nbsp; A ∪ B (in A or B or both): ${blank(8)} &nbsp; In neither: ${blank(6)}`,
          `A number from 1 to 12 is picked at random. Find: &nbsp; P(A ∩ B) = ${blank(3)} &nbsp; P(A ∪ B) = ${blank(3)} &nbsp; P(neither) = ${blank(3)}`])}</div></div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="flex:none">${venn("Football", "Tennis", ["", "", "", ""])}</div>
        <div>${q4([`30 pupils were asked. 18 play football, 12 play tennis and 5 play both. Fill in the Venn diagram (start with the overlap). &nbsp; How many play only football? ${blank(2)} &nbsp; Only tennis? ${blank(2)} &nbsp; Neither? ${blank(2)} &nbsp; P(a pupil plays football or tennis) = ${blank(3)}`], 3)}</div></div>
      ${q4([`A coin is flipped and a 1–4 spinner is spun. List every outcome systematically in a grid. How many are there? ${blank(2)}<div class="pp-draw pp-short"></div>`,
        `Is there a biggest whole number? Explain.${lines(1)}`,
        `Write three fractions between ½ and ¾. ${blank(8)} &nbsp; Could you keep going for ever? Explain how.${lines(1)}`], 4)}`,
    answers: answersPage(h, "Sort it in a Venn", ["Only A: 2, 4, 8, 10. Both: 6, 12. Only B: 3, 9. Neither: 1, 5, 7, 11. A ∩ B = {6, 12}; A ∪ B = {2, 3, 4, 6, 8, 9, 10, 12}",
      "2/12 = ⅙, 8/12 = ⅔, 4/12 = ⅓", "Both 5, only football 13, only tennis 7, neither 5. P = 25/30 = ⅚",
      "8 outcomes: H1, H2, H3, H4, T1, T2, T3, T4", "No: whatever number you name, you can add 1 to it, so the whole numbers go on for ever",
      "For example 5/8, 2/3, 7/10 (any between 0.5 and 0.75). Yes: halfway between any two fractions there is always another one, so there is no end"],
      "In question 3, the 18 who play football include the 5 who play both: only football is 18 − 5 = 13.")
  }));
