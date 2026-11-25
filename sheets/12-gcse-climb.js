  /* ===================== GCSE maths exam climb (England) =====================
     Stage 1 takes a pupil from GCSE grade 1 to grade 3 on the Foundation tier: a baseline, a tracker,
     an exam-style sheet for each of the 14 topics, the "what the exam expects" and technique sheets,
     and one-page mini papers. Questions come from the same bank as the online practice
     (PopActivities.examBank in activities.js), so each print is a fresh set and its answers page is a
     mark scheme: the answer, then which line of working earns which mark. Questions are PopSpell's own,
     not past papers; exam facts are the published GCSE (9 to 1) format, which every board shares. */

  const GX = () => window.PopActivities.examBank;
  const GX_LESSON = slug => `lesson-england-gcse-climb-${slug}`;
  const gxMk = n => `${n} mark${n > 1 ? "s" : ""}`;
  const gxStrip = (what, calc, marks) => `<p class="qd-strip gx-strip"><b>GCSE maths climb</b><span>${what}</span><span>${calc}</span>${marks ? `<span>Total ___ / ${marks}</span>` : "<span>Done ☐</span>"}</p>`;
  // One exam question on paper: the question, a picture, room for working (more for more marks), the answer line and the marks
  const gxQ = (it, i, roomy = 1) => {
    const opts = it.options ? `<p class="gx-opts">Tick one: ${shuffle([it.answer].concat(it.options)).map(o => `<span>☐ ${o}</span>`).join("")}</p>` : "";
    const work = it.options ? 0 : Math.max(0, it.marks - 1) * roomy;
    return `<div class="pp-q gx-q"><p><b>${i}.</b> ${it.q.replace(/ \((£|°C|°|cm²|cm³|cm|g|km|m|degrees|minutes|mph|miles|km\/h|m\/s|g\/cm³|N\/m²|ml|litres|days|years|m²|square units|%)\)$/, "")}${it.calc ? " <i>(calculator)</i>" : ""}</p>
      ${it.pic ? `<div class="gx-pic">${it.pic.replace('class="q-pic"', 'class="pp-pic"')}</div>` : ""}${opts}
      ${work ? `<span class="md-work gx-work" style="height:${+(work * 9).toFixed(1)}mm"></span>` : ""}
      <p class="gx-ans">${it.options ? "" : `Answer ${it.unit === "£" ? "£" : ""}${blank(6)} ${it.unit && it.unit !== "£" ? it.unit : ""}`}<span class="gx-mk">(${gxMk(it.marks)})</span></p></div>`;
  };
  const gxScheme = items => items.map(it => `<b>${it.answer}</b> <span class="gx-of">(${gxMk(it.marks)})</span><br><span class="gx-how">${it.scheme}</span>`);
  const gxTotal = items => items.reduce((t, it) => t + it.marks, 0);
  const gxAfter = `<p class="gx-note"><b>Marking like an examiner:</b> give the method marks for the right working even when the answer is wrong, but no answer marks without it.
    An answer with no working gets full marks only if it is right; a wrong answer with no working gets nothing. Mark on the sheet: ✓ M (method), ✓ A (answer).</p>`;

  // ---------- Start here: the baseline and the tracker ----------

  add("paper-gx-baseline", GX_LESSON("start-here-baseline-and-plan"), "GCSE maths climb: baseline check",
    "Two quick questions on each of the 14 Foundation topics, in the order of the climb. The answers page shows which topics to teach first.", (who, h) => {
      const items = GX().baseline(), T = GX().TOPICS;
      const row = t => { const two = items.filter(it => it.topic === t);
        return `<tr><td class="gx-topic">${t.n}. ${t.short}</td>${two.map((it, j) => `<td><b>${String.fromCharCode(97 + j)}</b> ${it.q.replace(/ \((£|°C|°|cm²|cm³|cm|g|km|m|degrees|minutes|mph|miles)\)$/, "")}${it.options ? ` <i>(${shuffle([it.answer].concat(it.options)).join(" / ")})</i>` : ""}<br><span class="gx-line">${blank(7)}</span></td>`).join("")}</tr>`; };
      return {
        pupil: `${h.sheetHead("Baseline check", who)}${gxStrip("Grade 1 to 3", "No calculator", 28)}
          <p class="gx-intro">Answer what you can, in any order. Leave a question you haven't met yet: that's useful to know, not a fail. Write working anywhere on the page.</p>
          <table class="gx-base">${T.map(row).join("")}</table>`,
        answers: `${answersPage(h, "Baseline check", T.map(t => { const two = items.filter(it => it.topic === t);
            return `<b>${t.n}. ${t.short}</b>: a ${two[0].answer}; b ${two[1].answer} &nbsp; <span class="gx-of">score ___ / 2</span>`; }),
          "One mark each. Copy each topic's score onto the tracker.")}
          <p class="gx-note"><b>What to teach first:</b> the topics scoring 0 or 1, in the climb's order (1 to 14): the early topics carry the most marks at grade 1 to 3, and later topics lean on them. A topic scoring 2 still gets its exam-style sheet as a quick check before you tick it off.</p>`
      };
    });

  add("paper-gx-tracker", GX_LESSON("start-here-baseline-and-plan"), "GCSE maths climb: tracker",
    "One page to plan and track the climb from grade 1 to grade 3: baseline score, lesson, online practice and exam-style sheet for each topic, and mini paper scores.", (who, h) => {
      const cell = '<td class="gx-cell"></td>';
      return {
        pupil: `${h.sheetHead("Road to grade 3: tracker", who)}${gxStrip("Stage 1: Foundation, grade 1 to 3", "Keep this with the pupil's work", 0)}
          <p class="gx-plan">Exam date: ${blank(7)} &nbsp; Weeks left: ${blank(3)} &nbsp; Sessions a week: ${blank(3)} &nbsp; Target grade: <b>3</b> &nbsp; Then: grade 4 and 5 (stage 2)</p>
          <table class="gx-track"><thead><tr><th>Topic, in climb order</th><th>Baseline<br>/ 2</th><th>Lesson<br>(date)</th><th>Online<br>best %</th><th>Exam sheet<br>score</th><th>Secure<br>✓</th></tr></thead>
          <tbody>${GX().TOPICS.map(t => `<tr><td>${t.n}. ${t.title}</td>${cell.repeat(5)}</tr>`).join("")}</tbody></table>
          <p class="gx-plan"><b>Secure</b> means about three-quarters of the exam sheet's marks, with working shown, on two different days.</p>
          <table class="gx-track gx-papers"><thead><tr><th>Mini paper</th><th>Date</th><th>Score</th><th>Topics to go back to</th></tr></thead>
          <tbody>${Array.from({ length: 4 }, () => `<tr>${cell.repeat(4)}</tr>`).join("")}</tbody></table>`,
        answers: lookForPage(h, "Road to grade 3: tracker", [
          "Plan with the baseline: teach topics scoring 0 or 1 first, in the climb's order. The first six (number, calculating, factors, fractions, percentages, ratio) are worth the most at grade 1 to 3.",
          "Each topic: the lesson, then the online practice (aim for 80% or more), then the exam-style sheet marked like an examiner.",
          "Every three or four sessions, a mini paper. Note the topics it shows up and go back to them.",
          "When most topics are secure and mini papers score about half or more, the pupil is working around grade 3. Move on to stage 2 (grades 4 and 5).",
          "Scores here come from PopSpell's work and your marking. They are a guide for planning, not a predicted grade."])
      };
    });

  // ---------- An exam-style sheet for each topic ----------

  // The 14 topics, as in the bank (activities.js), listed here so the sheets exist before the bank loads
  const GX_TOPICS = [["number", "Place value, negatives and rounding"], ["calc", "Calculating without a calculator"], ["factors", "Factors, multiples, primes and powers"],
    ["fractions", "Fractions"], ["percent", "Fractions, decimals and percentages"], ["ratio", "Ratio, proportion and best buys"],
    ["algebra", "Algebra: simplify, substitute and expand"], ["equations", "Equations, inequalities and sequences"], ["graphs", "Coordinates and straight-line graphs"],
    ["measures", "Units, time and speed"], ["angles", "Angles and shapes"], ["area", "Perimeter, area and volume"], ["probability", "Probability"], ["statistics", "Averages and charts"]];
  GX_TOPICS.forEach(([slug, title], i) => {
    const t = { id: `gf-${slug}`, n: i + 1, title };
    add(`paper-gx-${slug}`, GX_LESSON(slug), `Exam practice ${t.n}: ${t.title}`,
      `Seven exam-style questions with marks, easiest first, and a mark-scheme answers page. New numbers every print.`, (who, h) => {
        const items = GX().items(t.id, 7).sort((a, b) => a.marks - b.marks || (a.pic ? 1 : 0) - (b.pic ? 1 : 0));
        const anyCalc = items.some(it => it.calc), total = gxTotal(items);
        return {
          pupil: `${h.sheetHead(`Exam practice: ${t.title}`, who)}${gxStrip(`Topic ${t.n} of 14`, anyCalc ? "Calculator only where it says" : "No calculator", total)}
            ${items.map((it, i) => gxQ(it, i + 1)).join("")}`,
          answers: answersPage(h, `Exam practice: ${t.title}`, gxScheme(items), `Total ${total} marks. The answer, then where each mark comes from.`, gxAfter)
        };
      });
  });

  // ---------- What the exam expects, and exam technique ----------

  add("paper-gx-expects", GX_LESSON("what-the-exam-expects"), "What the exam expects: grade 1 to 3",
    "The GCSE maths Foundation exam in a page: the papers, what a grade 3 takes, where marks come from, and a model answer marked line by line.", (who, h) => ({
      pupil: `${h.sheetHead("What the exam expects", who)}${gxStrip("Grade 1 to 3", "Read, then talk it through", 0)}
        ${box("The exam", `<p>GCSE maths (9 to 1), Foundation tier: <b>three papers</b>, each <b>1 hour 30 minutes</b> and <b>80 marks</b>. Paper 1 is <b>non-calculator</b>; papers 2 and 3 allow a calculator. Foundation grades go from 1 to 5. Every exam board (AQA, Edexcel, OCR) uses this shape.</p>`)}
        ${box("What a grade 3 takes", `<p>Grade boundaries change every year, but a grade 3 has usually needed somewhere around a third to two-fifths of the 240 marks, and a grade 4 roughly half. So a grade 3 does <b>not</b> need every question: it needs the marks that are there for the taking.</p>
          <p>Half the marks test <b>doing maths you've been taught</b> (work out, simplify, solve). A quarter test <b>reasoning</b> (explain, show that, give a reason) and a quarter <b>solving problems</b> in context (best buys, plans, costs).</p>`)}
        ${box("Where marks come from", `<p><b>M</b> marks are for a correct method, even if the answer then goes wrong. <b>A</b> marks are for the right answer, and need the method. <b>B</b> marks are for a fact or value on its own.</p>
          <p><b>So: always write your working.</b> A wrong answer with working can still score; a wrong answer on its own scores nothing.</p>`)}
        ${box("A model answer", `<p><b>Question:</b> A jacket costs £60. It is reduced by 35% in a sale. Work out the sale price. <i>(3 marks)</i></p>
          <p><b>Answer A</b> (3 marks): 10% = £6, 30% = £18, 5% = £3, so 35% = £21 <b>M1</b>. £60 − £21 <b>M1</b> = £39 <b>A1</b>.</p>
          <p><b>Answer B</b> (2 marks): 10% = £6, 30% = £18, 5% = £3, 35% = £22 <b>M1</b> (slip in adding). £60 − £22 <b>M1</b> = £38 <b>✗</b>.</p>
          <p><b>Answer C</b> (0 marks): £38. No working, wrong answer.</p>`)}
        ${box("On the day", `<p>Read each question twice and underline what it asks for. Do the ones you can first, then come back. Never leave a gap: write the first step. Check units, money to 2 decimal places, and that the answer is sensible.</p>`)}`,
      answers: lookForPage(h, "What the exam expects", [
        "Talk through the model answers: why does B still get 2 marks? (The method was right; only the adding slipped.) Why does C get nothing?",
        "Ask the pupil to say, in their own words, what M, A and B marks are for.",
        "Exam facts are the GCSE (9 to 1) Foundation format shared by AQA, Edexcel and OCR. Check the exam board's own page for this year's dates and last year's grade boundaries.",
        "Grade boundaries quoted are rough recent ranges, to show a 3 is within reach; they are not a promise for any year."])
    }));

  const GX_WORDS = [["Write down", "The answer only. No working needed: it's usually 1 mark."], ["Work out / Calculate", "Show your working, then the answer."],
    ["Estimate", "Round each number first (usually to 1 significant figure), then work it out. An exact answer gets no marks."],
    ["Simplify", "Collect terms or cancel to the simplest form."], ["Solve", "Find the value of the letter, step by step."], ["Expand", "Multiply out the brackets."],
    ["Factorise", "Put brackets back in: take out the common factor."], ["Show that", "Every step written down, ending with the number you were given."],
    ["Explain / Give a reason", "Write a sentence. In angles, use the proper reason (\"angles on a straight line add up to 180°\")."],
    ["Is … correct? / Which is better value?", "Work it out, then say yes or no and why. The decision alone gets no marks."]];
  add("paper-gx-command-words", GX_LESSON("what-the-exam-expects"), "Exam command words and showing working",
    "What each command word asks for, then three answers for the pupil to mark like an examiner. The questions change every print.", (who, h) => {
      const pool = ["gf-percent", "gf-ratio", "gf-fractions", "gf-equations", "gf-area", "gf-statistics"].map(id => GX().items(id, 1, it => it.marks >= 2 && !it.options && !it.pic)[0]).filter(Boolean);
      const three = shuffle(pool).slice(0, 3);
      return {
        pupil: `${h.sheetHead("Command words and showing working", who)}${gxStrip("Grade 1 to 3", "No calculator", 0)}
          <table class="gx-words">${GX_WORDS.map(([w, d]) => `<tr><th>${w}</th><td>${d}</td></tr>`).join("")}</table>
          <p class="qd-task"><span class="qd-n">1</span> Underline the command word in each question below. What does it ask you to do?</p>
          <p class="qd-task"><span class="qd-n">2</span> Answer each question. Show every step: each line can earn a mark.</p>
          ${three.map((it, i) => gxQ(it, i + 1)).join("")}`,
        answers: answersPage(h, "Command words and showing working", gxScheme(three), "Mark the pupil's working against each scheme, then ask: which marks would they have kept if the last step had slipped?", gxAfter)
      };
    });

  add("paper-gx-calculator", GX_LESSON("what-the-exam-expects"), "Calculator paper skills",
    "Six calculator questions that catch people out: brackets, money, rounding at the end, time as a decimal, fractions and checking with an estimate.", (who, h) => {
      const a = rand(40) + 21, b = rand(9) + 2, c = rand(7) + 3, d = 2 + rand(8), e = rand(80) + 15, pr = (rand(400) + 120) / 100;
      const [hrs, mins] = pick([[2.75, "2 hours 45 minutes"], [1.4, "1 hour 24 minutes"], [3.2, "3 hours 12 minutes"], [0.85, "51 minutes"]]);
      const items = [
        [`Work out (${a} + ${b}) ÷ ${c}. Give your answer to 1 decimal place.`, ((a + b) / c).toFixed(1), `Type the brackets, or press = after the top: ${a + b} ÷ ${c} = ${((a + b) / c).toFixed(3)}… → ${((a + b) / c).toFixed(1)}. Without brackets the calculator does ${b} ÷ ${c} first.`],
        [`Work out ${d} × £${pr.toFixed(2)}. Give your answer in pounds.`, `£${(d * pr).toFixed(2)}`, `The display may show ${+(d * pr).toFixed(2)}: money always has 2 decimal places, £${(d * pr).toFixed(2)}.`],
        [`Work out √${e} × ${b}. Give your answer to 2 decimal places.`, (Math.sqrt(e) * b).toFixed(2), `Keep the full √${e} on the screen and round only at the end: ${(Math.sqrt(e) * b).toFixed(2)}. Rounding √${e} first gives a different answer.`],
        [`A calculator shows ${hrs} hours. Write this in hours and minutes.`, mins, `Only the decimal part is minutes: ${gfrac(hrs)} × 60. Not ${String(hrs).split(".")[1]} minutes.`],
        [`Work out 3/8 + 2/5 using the fraction button. Give your answer as a fraction.`, "31/40", "Use the fraction key (a b/c or ▭/▭). 15/40 + 16/40 = 31/40."],
        [`Kai works out 48.7 × 21.3 and gets 10 373.1. Use an estimate to show he is wrong.`, "50 × 20 = 1000, so 10 373.1 is about ten times too big (it is 1037.31)", "1 mark for the estimate 50 × 20 = 1000, 1 mark for saying it doesn't match."]];
      return {
        pupil: `${h.sheetHead("Calculator paper skills", who)}${gxStrip("Grade 1 to 3", "Calculator", 12)}
          ${box("Calculator habits that save marks", `<p>Use brackets for a sum on top of a fraction. Keep long decimals on the screen and round only at the end. Write money with 2 decimal places. A decimal of an hour is not minutes: × 60. Write down what you typed, so a slip still earns method marks. Estimate first, then check the answer is near it.</p>`)}
          ${items.map(([q], i) => `<div class="pp-q gx-q"><p><b>${i + 1}.</b> ${q}</p><span class="md-work gx-work" style="height:9mm"></span><p class="gx-ans">Answer ${blank(8)}<span class="gx-mk">(2 marks)</span></p></div>`).join("")}`,
        answers: answersPage(h, "Calculator paper skills", items.map(([, ans, how]) => `<b>${ans}</b><br><span class="gx-how">${how}</span>`), "2 marks each: 1 for the working or what was typed, 1 for the answer in the form asked.")
      };
    });
  const gfrac = x => String(Math.round((x % 1) * 100) / 100);

  // ---------- Mini papers ----------

  // One page, mixed topics in climb order, a fresh paper every print
  const gxPaper = (keep, n = 7) => {
    const T = shuffle(GX().TOPICS).slice(0, n).sort((a, b) => a.n - b.n);
    return T.map(t => GX().items(t.id, 1, keep)[0] || GX().items(t.id, 1)[0]).sort((a, b) => a.marks - b.marks);
  };
  [["noncalc", "Mini paper: non-calculator", "Seven questions from across the topics, like paper 1: no calculator. About 20 minutes.", it => !it.calc && it.marks >= 2 && !it.pic, "No calculator"],
    ["calc", "Mini paper: calculator", "Seven questions from across the topics, like papers 2 and 3, with a calculator. About 20 minutes.", it => it.marks >= 2 && !it.pic, "Calculator allowed"],
    ["problems", "Mini paper: problem solving", "Five longer problems in context (3 marks each), where the marks are for planning the steps and showing them. About 20 minutes.", it => it.ps && !it.pic, "Calculator allowed"]]
    .forEach(([slug, title, detail, keep, calc]) => add(`paper-gx-mini-${slug}`, GX_LESSON("mini-papers"), title, detail, (who, h) => {
      const items = slug === "problems"
        ? shuffle(GX().TOPICS).map(t => GX().items(t.id, 1, keep)[0]).filter(Boolean).slice(0, 5).sort((a, b) => a.marks - b.marks)
        : gxPaper(keep);
      const total = gxTotal(items);
      return {
        pupil: `${h.sheetHead(title.replace("Mini paper: ", "Mini paper, "), who)}${gxStrip("Grade 1 to 3", calc, total)}
          <p class="gx-intro">Like the real exam: show your working on every question. You may do them in any order.</p>
          ${items.map((it, i) => gxQ(Object.assign({}, it, { calc: false }), i + 1, slug === "problems" ? 1.4 : 1)).join("")}`,
        answers: answersPage(h, title, gxScheme(items), `Total ${total} marks. Note the topic of each question dropped on the tracker.`, gxAfter)
      };
    }));

  // ===================== Stages 2 and 3: grades 4 and 5, then Higher (grades 6 to 9) =====================
  // The same kinds of sheet as stage 1, for each later stage: a stage check, a tracker, an exam-style
  // sheet for each topic, what the exam expects at that stage, and mini papers.
  const GX_LATER = [
    { key: "g5", n: 2, grades: "4 and 5", name: "Grades 4 and 5", tag: "grades 4 and 5", target: 5, tier: "Foundation or Higher",
      topics: [["indices", "Index laws and standard form"], ["growth", "Percentage change, reverse percentages and interest"], ["proportion", "Ratio problems and proportion"],
        ["brackets", "Expanding and factorising"], ["solving", "Harder equations, simultaneous equations and formulae"], ["sequences", "Sequences and the nth term"],
        ["lines", "Gradients, straight lines and quadratic graphs"], ["pythagoras", "Pythagoras' theorem"], ["trig", "Trigonometry in right-angled triangles"],
        ["circles", "Circles, cylinders and prisms"], ["polygons", "Polygons, bearings and similar shapes"], ["compound", "Speed, density and pressure"],
        ["trees", "Tree diagrams, Venn diagrams and relative frequency"], ["grouped", "Grouped data and comparing distributions"]] },
    { key: "gh", n: 3, grades: "6 to 9", name: "Higher, grades 6 to 9", tag: "Higher", target: 7, tier: "Higher",
      topics: [["surds", "Surds, and negative and fractional indices"], ["quadratics", "Solving quadratic equations"], ["algebra", "Algebraic fractions and harder simultaneous equations"],
        ["functions", "Functions, iteration and harder sequences"], ["graphs", "Perpendicular lines, circles and turning points"], ["variation", "Direct and inverse proportion, and bounds"],
        ["trig", "Sine rule, cosine rule and 3D trigonometry"], ["circles", "Circle theorems"], ["solids", "Arcs, sectors, cones and spheres"],
        ["similar", "Similar shapes: lengths, areas and volumes, and congruence"], ["vectors", "Vectors"], ["probability", "Conditional probability and set notation"],
        ["statistics", "Histograms, cumulative frequency and box plots"], ["proof", "Proof, recurring decimals and quadratic inequalities"]] }
  ];
  // A later stage's topic slug is its id after the stage key: g5-indices → g5-indices (slugs repeat across stages, so the key stays)
  const gxStrip2 = (st, what, calc, marks) => gxStrip(`${st.name}${what ? `: ${what}` : ""}`, calc, marks);
  const gxPlain = q => q.replace(/ \((£|°C|°|cm²|cm³|cm|g|km|m|degrees|minutes|mph|miles|km\/h|m\/s|g\/cm³|N\/m²|ml|litres|days|years|m²|square units|%)\)$/, "");

  GX_LATER.forEach(st => {
    const L = slug => GX_LESSON(`${st.key}-${slug}`);
    const T = () => GX().stage(st.key).topics;

    add(`paper-gx-${st.key}-check`, L("start-here"), `GCSE maths climb: stage ${st.n} check (${st.tag})`,
      `One exam question on each of the 14 topics for ${st.tag}, in the order of the climb. The answers page shows which topics to work on first.`, (who, h) => {
        // A rare draw of long questions and mark schemes can push the answers onto a third A4 page, so draw
        // ten checks and keep the shortest
        const size = list => list.reduce((t, it) => t + it.q.length + it.scheme.length + (it.options ? it.options.join(" / ").length + String(it.answer).length : 0), 0);
        const items = Array.from({ length: 10 }, () => GX().check(st.key)).sort((x, y) => size(x) - size(y))[0];
        return {
          pupil: `${h.sheetHead(`Stage ${st.n} check`, who)}${gxStrip2(st, "", "Calculator allowed", gxTotal(items))}
            <p class="gx-intro">Answer what you can, in any order, and write your working beside each question. A topic you haven't met yet is useful to know, not a fail.</p>
            <table class="gx-base gx-check">${items.map(it => `<tr><td class="gx-topic">${it.topic.n}. ${it.topic.short}</td><td>${gxPlain(it.q)}${it.options ? ` <i>(${shuffle([it.answer].concat(it.options)).join(" / ")})</i>` : ""}<br><span class="gx-line">${blank(7)} <span class="gx-mk">(${gxMk(it.marks)})</span></span></td></tr>`).join("")}</table>`,
          answers: `${answersPage(h, `Stage ${st.n} check`, items.map(it => `<b>${it.topic.short}</b>: ${it.answer} <span class="gx-of">(${gxMk(it.marks)})</span><br><span class="gx-how">${it.scheme}</span>`), "Copy each topic's score onto the stage tracker. Work first on the topics that lost marks, in the climb's order.")}`
        };
      });

    add(`paper-gx-${st.key}-tracker`, L("start-here"), `GCSE maths climb: stage ${st.n} tracker (${st.tag})`,
      `One page to plan and track stage ${st.n}: the check score, lesson, online practice and exam-style sheet for each topic, and mini paper scores.`, (who, h) => {
        const cell = '<td class="gx-cell"></td>';
        return {
          pupil: `${h.sheetHead(`Road to grade ${st.target}: tracker`, who)}${gxStrip2(st, "", "Keep this with the pupil's work", 0)}
            <p class="gx-plan">Exam date: ${blank(7)} &nbsp; Tier: ${blank(5)} &nbsp; Sessions a week: ${blank(3)} &nbsp; Target grade: <b>${st.n === 2 ? "4, then 5" : "6 and up"}</b>${st.n === 2 ? " &nbsp; Then: Higher (stage 3)" : ""}</p>
            <table class="gx-track"><thead><tr><th>Topic, in climb order</th><th>Check<br>marks</th><th>Lesson<br>(date)</th><th>Online<br>best %</th><th>Exam sheet<br>score</th><th>Secure<br>✓</th></tr></thead>
            <tbody>${st.topics.map(([, title], i) => `<tr><td>${i + 1}. ${title}</td>${cell.repeat(5)}</tr>`).join("")}</tbody></table>
            <p class="gx-plan"><b>Secure</b> means about three-quarters of the exam sheet's marks, with working shown, on two different days.</p>
            <table class="gx-track gx-papers"><thead><tr><th>Mini paper</th><th>Date</th><th>Score</th><th>Topics to go back to</th></tr></thead>
            <tbody>${Array.from({ length: 4 }, () => `<tr>${cell.repeat(4)}</tr>`).join("")}</tbody></table>`,
          answers: lookForPage(h, `Road to grade ${st.target}: tracker`, [
            "Plan with the stage check: work on the topics that lost marks first, in the climb's order.",
            "Each topic: the lesson, then the online practice (aim for 80% or more), then the exam-style sheet marked like an examiner.",
            "Every three or four sessions, a mini paper. Note the topics it shows up and go back to them.",
            st.n === 2 ? "Most topics secure and mini papers at about two-thirds or more: the pupil is working around grade 5. Talk about the tier, and move to stage 3 if they're sitting Higher."
              : "Higher marks come from accuracy and full method on long questions: re-do the mini paper questions that lost marks, not just new ones.",
            "Scores here come from PopSpell's work and your marking. They are a guide for planning, not a predicted grade."])
        };
      });

    st.topics.forEach(([slug, title], i) => {
      add(`paper-gx-${st.key}-${slug}`, L(slug), `Exam practice (${st.tag}) ${i + 1}: ${title}`,
        "Six exam-style questions with marks, easiest first, and a mark-scheme answers page. New numbers every print.", (who, h) => {
          // At most two pictures, so the page fits A4 (every question says all it needs in words)
          let pics = 0;
          const items = GX().items(`${st.key}-${slug}`, 6).sort((a, b) => a.marks - b.marks || (a.pic ? 1 : 0) - (b.pic ? 1 : 0))
            .map(it => (it.pic && ++pics > 2 ? Object.assign({}, it, { pic: "" }) : it));
          const anyCalc = items.some(it => it.calc), total = gxTotal(items);
          return {
            pupil: `${h.sheetHead(`Exam practice: ${title}`, who)}${gxStrip2(st, `topic ${i + 1} of 14`, anyCalc ? "Calculator only where it says" : "No calculator", total)}
              ${items.map((it, j) => gxQ(it, j + 1)).join("")}`,
            answers: answersPage(h, `Exam practice: ${title}`, gxScheme(items), `Total ${total} marks. The answer, then where each mark comes from.`, gxAfter)
          };
        });
    });

    [["noncalc", "Mini paper: non-calculator", "Six questions from across the topics, like paper 1: no calculator. About 20 minutes.", it => !it.calc && it.marks >= 2 && !it.pic, "No calculator"],
      ["calc", "Mini paper: calculator", "Six questions from across the topics, like papers 2 and 3, with a calculator. About 20 minutes.", it => it.marks >= 2 && !it.pic, "Calculator allowed"],
      ["problems", "Mini paper: problem solving", "Five longer problems (3 marks each), where the marks are for planning the steps and showing them. About 20 minutes.", it => it.ps && !it.pic, "Calculator allowed"]]
      .forEach(([slug, title, detail, keep, calc]) => add(`paper-gx-${st.key}-mini-${slug}`, L("mini-papers"), `${title} (${st.tag})`, detail, (who, h) => {
        const pickFrom = shuffle(T());
        const items = (slug === "problems" ? pickFrom.map(t => GX().items(t.id, 1, keep)[0]).filter(Boolean).slice(0, 5)
          : pickFrom.map(t => GX().items(t.id, 1, keep)[0]).filter(Boolean).slice(0, 6)).sort((a, b) => a.marks - b.marks);
        const total = gxTotal(items);
        return {
          pupil: `${h.sheetHead(`${title.replace("Mini paper: ", "Mini paper, ")}`, who)}${gxStrip2(st, "", calc, total)}
            <p class="gx-intro">Like the real exam: show your working on every question. You may do them in any order.</p>
            ${items.map((it, j) => gxQ(Object.assign({}, it, { calc: false }), j + 1, slug === "problems" ? 1.3 : 1)).join("")}`,
          answers: answersPage(h, `${title} (${st.tag})`, gxScheme(items), `Total ${total} marks. Note the topic of each question dropped on the tracker.`, gxAfter)
        };
      }));
  });

  // ---------- What the exam expects at grades 4 and 5, and at Higher ----------

  add("paper-gx-g5-expects", GX_LESSON("g5-what-the-exam-expects"), "What the exam expects: grades 4 and 5",
    "Grades 4 and 5 in a page: what a standard and a strong pass take, choosing Foundation or Higher, the habits that earn the extra marks, and a model answer marked line by line.", (who, h) => ({
      pupil: `${h.sheetHead("What the exam expects: grades 4 and 5", who)}${gxStrip("Grades 4 and 5", "Read, then talk it through", 0)}
        ${box("Why 4 and 5 matter", `<p>A <b>4 is a standard pass</b> and a <b>5 a strong pass</b>. In England, a student without a 4 at 16 keeps studying maths and resits it after Year 11, and many college courses and sixth forms ask for a 4 or 5.</p>`)}
        ${box("Foundation or Higher?", `<p>Both tiers can give a 4 or 5. <b>Foundation</b> goes up to grade 5 and its questions are more familiar, so it is the safer road to a 4. <b>Higher</b> goes from 4 to 9 (with a 3 allowed just below), and a 4 or 5 needs fewer of its marks, but every question is harder. The topics on this stage are the ones both tiers share. Decide the tier with the teacher, using mini paper results.</p>`)}
        ${box("Roughly what it takes", `<p>Boundaries change every year. Recently, on Foundation, a 4 has needed somewhere around two-fifths to a half of the 240 marks and a 5 around three-fifths or more. On Higher, a 4 has needed around a fifth and a 5 around a third. Check last year's boundaries on the exam board's website.</p>`)}
        ${box("The habits that lift a 3 to a 4 and 5", `<p><b>Finish multi-step questions:</b> 3, 4 and 5 mark questions are where these grades are won; write each step even if you can't see the end. <b>Use multipliers</b> (× 1.15, × 0.85) for percentages. <b>Know the formulae</b>, even if a formulae sheet is given, so you spend time using them, not finding them. <b>Round only at the end</b>, and give the accuracy asked for.</p>`)}
        ${box("A model answer", `<p><b>Question:</b> After a 20% rise a bike costs £300. Work out the price before the rise. <i>(3 marks)</i></p>
          <p><b>Answer A</b> (3 marks): £300 is 120% <b>M1</b>. 1% = £300 ÷ 120 = £2.50 <b>M1</b>. 100% = £250 <b>A1</b>.</p>
          <p><b>Answer B</b> (0 marks): 20% of £300 = £60, £300 − £60 = £240. Taking 20% of the new price is the wrong method, so no method marks.</p>`)}`,
      answers: lookForPage(h, "What the exam expects: grades 4 and 5", [
        "Talk through why answer B scores nothing: the method itself is wrong, so there is nothing to give method marks for.",
        "Ask which tier the pupil is sitting and why. If unsure, compare their stage 2 mini paper scores on a Foundation-style and a Higher-style paper.",
        "Exam facts are the GCSE (9 to 1) format shared by AQA, Edexcel and OCR. Grade boundaries quoted are rough recent ranges; check the board's site for this year's details and whether a formulae sheet is given.",
        "The resit rule in England: students without a grade 4 by 16 continue maths post-16 (check the current funding guidance for the detail)."])
    }));

  add("paper-gx-gh-expects", GX_LESSON("gh-what-the-exam-expects"), "What the exam expects: Higher, grades 6 to 9",
    "The Higher paper in a page: what grades 6 to 9 take, where top marks are lost, exact answers and proof, and a model answer marked line by line.", (who, h) => ({
      pupil: `${h.sheetHead("What the exam expects: Higher", who)}${gxStrip("Higher, grades 6 to 9", "Read, then talk it through", 0)}
        ${box("The Higher papers", `<p>Three papers, each <b>1 hour 30 minutes</b> and <b>80 marks</b>; paper 1 non-calculator. Grades 4 to 9 (with a 3 allowed just below 4). Boundaries change every year: recently a 7 has needed somewhere around half the marks and a 9 around three-quarters or more. Check last year's boundaries on the exam board's website.</p>`)}
        ${box("Where top grades are won and lost", `<p><b>Accuracy:</b> keep full values on the calculator and give the accuracy asked (3 significant figures if none is given). <b>Exact answers:</b> "in terms of π" or "in surd form" means no decimals. <b>Show that:</b> every step written, ending with the value given. <b>Proof:</b> use n for any number, and finish with the form that shows the result (for example 2(n + 1) is even). An example is never a proof.</p>`)}
        ${box("The long questions", `<p>The last questions of each paper join two or three topics (for example similar shapes then volume, or a quadratic from an area). Plan first: what do I need, what do I know, which topic links them? Write each step: these questions have 4 or 5 marks, and most are for method.</p>`)}
        ${box("A model answer", `<p><b>Question:</b> Solve x² + 4x − 7 = 0, giving your answers to 2 decimal places. <i>(3 marks)</i></p>
          <p><b>Answer A</b> (3 marks): x = (−4 ± √(16 + 28)) ÷ 2 <b>M1</b> = (−4 ± √44) ÷ 2 <b>M1</b>; x = 1.32 or x = −5.32 <b>A1</b>.</p>
          <p><b>Answer B</b> (1 mark): x = −4 ± √(16 − 28) ÷ 2 <b>M1</b> for the formula, then the sign of c is lost (−4ac is +28 here) and the √ of a negative stops the answer.</p>`)}`,
      answers: lookForPage(h, "What the exam expects: Higher", [
        "Talk through answer B: where exactly did it go wrong, and which mark did it keep? (The formula was set up, then −4 × 1 × (−7) became −28.)",
        "Ask the pupil to show what \"in terms of π\", \"exact\" and \"show that\" ask for, with an example of each.",
        "Grade boundaries quoted are rough recent ranges to show what a grade takes; check the board's site for this year's details and whether a formulae sheet is given."])
    }));

  // ---------- A route for a pupil working on their own ----------

  add("paper-gx-route", GX_LESSON("my-next-step"), "GCSE maths climb: my route from grade 1 to 9",
    "One page for a pupil working on their own (at home, or homeschooled): the three stages, what to do in each session, how to mark their own work and when to move on.", (who, h) => ({
      pupil: `${h.sheetHead("My route: grade 1 to 9", who)}${gxStrip("GCSE maths climb", "Self-guided", 0)}
        ${box("The three stages", `<p><b>Stage 1, grades 1 to 3</b> (Foundation): number, fractions, percentages, ratio, basic algebra, shape and data. <b>Stage 2, grades 4 and 5</b>: what both tiers share, from standard form to trigonometry. <b>Stage 3, grades 6 to 9</b> (Higher only): surds, quadratics, circle theorems, vectors, proof and more. Start where your check says; you don't have to go to the top.</p>`)}
        ${box("Each session (about 45 minutes)", `<p><b>1.</b> Open <b>popspell.com/climb.html</b> and press <b>My next step</b>. <b>2.</b> Do what it says: the stage check, a topic's practice, or a mini paper. <b>3.</b> After every question, read the mark scheme, even when you were right: it shows which lines earn marks. <b>4.</b> Write any question you got wrong in your notebook, with the right working, and try it again next session.</p><p><b>No internet, or rather work on paper?</b> Download the pack for your stage from <b>popspell.com/pack.html</b>: every sheet, a plan to tick off, and the answers at the back.</p>`)}
        ${box("Marking your own work", `<p>Each question says its marks. Give yourself the marks for each step you wrote that matches the mark scheme, even if your final answer was wrong. No working, wrong answer: no marks. Be strict: the exam will be.</p>`)}
        ${box("When to move on", `<p>A topic is <b>secure</b> when you score about three-quarters of the marks in one set of its practice (on paper, aim to do it twice on different days). When all of a stage's topics are secure, do a mini paper. Scoring about half or more on it? Start the next stage.</p>`)}
        <p class="gx-plan">My exam date: ${blank(7)} &nbsp; My target grade: ${blank(3)} &nbsp; Stage I'm on: ${blank(3)} &nbsp; Sessions a week: ${blank(3)}</p>`,
      answers: lookForPage(h, "My route: grade 1 to 9", [
        "For the adult at home: the climb page keeps progress on this device only, in this browser. Nothing is sent anywhere, so use the same device each time.",
        "Check in once a week: look at the topics marked secure on the climb page, and ask the pupil to explain one question they got wrong and how they fixed it.",
        "If a topic stays below half its marks after three sessions, it needs teaching, not more practice: use the topic's lesson in PopSpell's library, or ask a tutor.",
        "Scores are a guide for planning, not a predicted grade."])
    }));
