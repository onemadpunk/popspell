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

