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

