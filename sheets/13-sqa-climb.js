
  /* ===================== SQA maths exam climb (Scotland) =====================
     The GCSE climb's sheets in Scotland's terms, for S4 to S6: National 4 skills, then National 5, then
     Higher. For each stage: a check, a tracker, an exam-style sheet for each of its 14 topics, "what the
     exam expects", and mini papers; then an exam technique sheet and a route for a pupil working alone.
     Questions come from PopActivities.examBank.scotland (activities.js), so every print is a fresh set, and
     the answers pages are marked the SQA way, one bullet a mark. Questions are PopSpell's own, never SQA
     past papers. Exam facts are from SQA's course specifications (2023 onwards). */

  const SQX = () => window.PopActivities.examBank.scotland;
  const SQ_LESSON = slug => `lesson-sqa-climb-${slug}`;
  const sqStrip = (what, calc, marks) => `<p class="qd-strip gx-strip"><b>SQA maths climb</b><span>${what}</span><span>${calc}</span>${marks ? `<span>Total ___ / ${marks}</span>` : "<span>Done ☐</span>"}</p>`;
  const sqAfter = `<p class="gx-note"><b>Marking the SQA way:</b> each bullet (•1, •2…) is one mark for one step, so give each step its mark even when the final answer is wrong.
    An error is followed through: later steps done correctly with a wrong value still earn their marks. An answer with no working may get no marks at all. Tick each bullet you award.</p>`;

  // The stages and their 14 topics, as in the bank (activities.js), listed here so the sheets exist before the bank loads
  const SQ_STAGE_LIST = [
    { key: "n4", n: 1, course: "National 4", name: "National 4 skills", next: "National 5",
      topics: [["number", "Whole numbers, negatives, rounding and significant figures"], ["calc", "Calculating without a calculator"], ["fractions", "Fractions and mixed numbers"],
        ["percent", "Percentages"], ["ratio", "Ratio and proportion"], ["algebra", "Expressions and formulae"], ["equations", "Equations and inequations"],
        ["graphs", "Coordinates, straight-line graphs and gradient"], ["measures", "Time, speed and measurement"], ["angles", "Angles, shapes, bearings and scale"],
        ["area", "Area, volume and circles"], ["pythagoras", "Pythagoras' theorem"], ["trig", "Right-angled trigonometry"], ["data", "Statistics and probability"]] },
    { key: "n5", n: 2, course: "National 5", name: "National 5", next: "Higher",
      topics: [["surds", "Surds, indices and scientific notation"], ["percent", "Percentages, appreciation and depreciation, and mixed numbers"], ["brackets", "Expanding, factorising and completing the square"],
        ["fractions", "Algebraic fractions"], ["equations", "Equations, inequations and changing the subject"], ["simultaneous", "Simultaneous equations"], ["lines", "Straight lines and gradient"],
        ["quadratics", "Quadratic functions and equations"], ["shapes", "Pythagoras, angles and similarity"], ["solids", "Arcs, sectors and volumes"],
        ["trig", "Trigonometry: area, sine rule, cosine rule and bearings"], ["trigeq", "Trigonometric graphs, equations and identities"], ["vectors", "Vectors"], ["statistics", "Statistics: comparing data and lines of best fit"]] },
    { key: "nh", n: 3, course: "Higher", name: "Higher", next: "",
      topics: [["lines", "The straight line"], ["functions", "Functions: composite, inverse and domain"], ["graphs", "Graphs of functions and transformations"],
        ["polynomials", "Polynomials and the factor theorem"], ["quadratics", "Quadratic theory: discriminant, inequations and tangency"], ["recurrence", "Recurrence relations"],
        ["differentiation", "Differentiation"], ["calculus", "Stationary points, optimisation and rates of change"], ["integration", "Integration and area"],
        ["trig", "Radians, exact values and trigonometric equations"], ["formulae", "Addition and double angle formulae, and the wave function"], ["circles", "The circle"],
        ["vectors", "Vectors in three dimensions"], ["logs", "Logarithms and exponentials"]] }
  ];

  SQ_STAGE_LIST.forEach(st => {
    const L = slug => SQ_LESSON(`${st.key}-${slug}`);
    const T = () => SQX().stage(st.key).topics;

    add(`paper-sq-${st.key}-check`, L("start-here"), `SQA maths climb: ${st.course} check`,
      `One exam question on each of the 14 ${st.course} topics, in the order of the climb. The answers page shows which topics to work on first.`, (who, h) => {
        // A rare draw of long questions and mark schemes can push a page onto another sheet, so draw again (up to 40 times)
        // until the questions are no longer than a normal check
        const size = list => list.reduce((t, it) => t + it.q.length + it.scheme.length + (it.options ? it.options.join(" / ").length + String(it.answer).length : 0), 0);
        let items = SQX().check(st.key);
        for (let i = 0; i < 40 && size(items) > 2500; i++) items = SQX().check(st.key);
        return {
          pupil: `${h.sheetHead(`${st.course} check`, who)}${sqStrip(st.name, "Calculator allowed", gxTotal(items))}
            <p class="gx-intro">Answer what you can, in any order, and write your working beside each question. A topic you haven't met yet is useful to know, not a fail.</p>
            <table class="gx-base gx-check">${items.map(it => `<tr><td class="gx-topic">${it.topic.n}. ${it.topic.short}</td><td>${gxPlain(it.q)}${it.options ? ` <i>(${shuffle([it.answer].concat(it.options)).join(" / ")})</i>` : ""}<br><span class="gx-line">${blank(7)} <span class="gx-mk">(${gxMk(it.marks)})</span></span></td></tr>`).join("")}</table>`,
          answers: `${answersPage(h, `${st.course} check`, items.map(it => `<b>${it.topic.n}. ${it.topic.short}</b>: ${it.answer} <span class="gx-of">(${gxMk(it.marks)})</span><br><span class="gx-how">${it.scheme}</span>`), "Copy each topic's score onto the tracker.")}
            <p class="gx-note"><b>What to work on first:</b> the topics that lost marks, in the climb's order (the early ones are used by the later ones). A topic with full marks still gets its exam-style sheet as a check before it's ticked off.</p>`
        };
      });

    add(`paper-sq-${st.key}-tracker`, L("start-here"), `SQA maths climb: ${st.course} tracker`,
      `One page to plan and track ${st.name}: the check score, lesson, online practice and exam-style sheet for each topic, and mini paper scores.`, (who, h) => {
        const cell = '<td class="gx-cell"></td>';
        return {
          pupil: `${h.sheetHead(`${st.name}: tracker`, who)}${sqStrip(st.name, "Keep this with the pupil's work", 0)}
            <p class="gx-plan">${st.n === 1 ? "Aiming for National 5 in: " : "Exam date: "}${blank(7)} &nbsp; Sessions a week: ${blank(3)} &nbsp; Target grade: ${blank(3)}${st.next ? ` &nbsp; Then: ${st.next}` : ""}</p>
            <table class="gx-track"><thead><tr><th>Topic, in climb order</th><th>Check<br>marks</th><th>Lesson<br>(date)</th><th>Online<br>best %</th><th>Exam sheet<br>score</th><th>Secure<br>✓</th></tr></thead>
            <tbody>${st.topics.map(([, title], i) => `<tr><td>${i + 1}. ${title}</td>${cell.repeat(5)}</tr>`).join("")}</tbody></table>
            <p class="gx-plan"><b>Secure</b> means about three-quarters of the exam sheet's marks, with working shown, on two different days.</p>
            <table class="gx-track gx-papers"><thead><tr><th>Mini paper</th><th>Date</th><th>Score</th><th>Topics to go back to</th></tr></thead>
            <tbody>${Array.from({ length: 4 }, () => `<tr>${cell.repeat(4)}</tr>`).join("")}</tbody></table>`,
          answers: lookForPage(h, `${st.name}: tracker`, [
            "Plan with the check: work on the topics that lost marks first, in the climb's order.",
            "Each topic: the lesson, then the online practice (aim for 80% or more), then the exam-style sheet marked the SQA way.",
            "Every three or four sessions, a mini paper. Note the topics it shows up and go back to them.",
            st.n === 1 ? "When most topics are secure and mini papers score about half or more, the pupil has the skills National 5 assumes. Move on to the National 5 stage."
              : st.n === 2 ? "Most topics secure and mini papers at about two-thirds or more: the pupil is working at a secure pass. Higher needs a strong National 5 (usually an A or B), so talk about that before moving on."
              : "Higher marks come from complete, accurate working on long questions: re-do the mini paper questions that lost marks, not just new ones.",
            "Scores here come from PopSpell's work and your marking. They are a guide for planning, not an estimate of an SQA grade."])
        };
      });

    st.topics.forEach(([slug, title], i) => {
      add(`paper-sq-${st.key}-${slug}`, L(slug), `Exam practice (${st.course}) ${i + 1}: ${title}`,
        "Six exam-style questions with marks, easiest first, and an answers page marked the SQA way. New numbers every print.", (who, h) => {
          let pics = 0;
          const items = SQX().items(`${st.key}-${slug}`, 6).sort((a, b) => a.marks - b.marks || (a.pic ? 1 : 0) - (b.pic ? 1 : 0))
            .map(it => (it.pic && ++pics > 2 ? Object.assign({}, it, { pic: "" }) : it));
          const anyCalc = items.some(it => it.calc), total = gxTotal(items);
          return {
            pupil: `${h.sheetHead(`Exam practice: ${title}`, who)}${sqStrip(`${st.name}: topic ${i + 1} of 14`, anyCalc ? "Calculator only where it says" : "No calculator", total)}
              ${items.map((it, j) => gxQ(it, j + 1)).join("")}`,
            answers: answersPage(h, `Exam practice: ${title}`, gxScheme(items), `Total ${total} marks. The answer, then where each mark comes from.`, sqAfter)
          };
        });
    });

    [["noncalc", "Mini paper: non-calculator", "Six questions from across the topics, like Paper 1: no calculator. About 20 minutes.", it => !it.calc && it.marks >= 2 && !it.pic, "No calculator"],
      ["calc", "Mini paper: calculator", "Six questions from across the topics, like Paper 2, with a calculator. About 20 minutes.", it => it.marks >= 2 && !it.pic, "Calculator allowed"],
      ["reasoning", "Mini paper: longer questions", "Four longer questions (3 or 4 marks each), where most marks are for the steps of working. About 20 minutes.", it => it.marks >= 3 && !it.pic, "Calculator allowed"]]
      .forEach(([slug, title, detail, keep, calc]) => add(`paper-sq-${st.key}-mini-${slug}`, L("mini-papers"), `${title} (SQA ${st.course})`, detail, (who, h) => {
        const items = shuffle(T()).map(t => SQX().items(t.id, 1, keep)[0]).filter(Boolean).slice(0, slug === "reasoning" ? 4 : 6).sort((a, b) => a.marks - b.marks);
        const total = gxTotal(items);
        return {
          pupil: `${h.sheetHead(`${title.replace("Mini paper: ", "Mini paper, ")}`, who)}${sqStrip(st.name, calc, total)}
            <p class="gx-intro">Like the real exam: show your working on every question. You may do them in any order.</p>
            ${items.map((it, j) => gxQ(Object.assign({}, it, { calc: false }), j + 1, slug === "reasoning" ? 1.3 : 1)).join("")}`,
          answers: answersPage(h, `${title} (SQA ${st.course})`, gxScheme(items), `Total ${total} marks. Note the topic of each question that lost marks on the tracker.`, sqAfter)
        };
      }));
  });

  // ---------- What the exam expects, for each stage ----------

  add("paper-sq-n4-expects", SQ_LESSON("n4-what-national-5-expects"), "What National 5 expects: the National 4 skills",
    "From National 4 to National 5 in a page: how National 4 is passed, what National 5's papers assume you can already do, and the habits to start now.", (who, h) => ({
      pupil: `${h.sheetHead("What National 5 expects", who)}${sqStrip("National 4 skills", "Read, then talk it through", 0)}
        ${box("National 4", `<p>National 4 Mathematics has <b>no exam</b>. It is passed (or not) through assessments done and marked in school, including an added value unit test. There are no grades: it is a pass.</p>`)}
        ${box("What National 5 takes for granted", `<p>National 5's Paper 1 has <b>no calculator</b>. It expects you to calculate with whole numbers, decimals, fractions and percentages by hand, to round, to work with negative numbers, and to use Pythagoras and SOH CAH TOA without being shown how. Nearly every National 5 question uses one of this stage's 14 topics as a step.</p>`)}
        ${box("Habits to start now", `<p><b>Write every step.</b> In SQA marking, each step earns its own mark, and an answer with no working may get nothing. <b>Set out working down the page</b>, one step a line, with = signs that are true. <b>Give units</b> and round only at the end. <b>Check</b> the answer is sensible.</p>`)}
        ${box("A model answer", `<p><b>Question:</b> A jacket costs £60. It is reduced by 35%. Find the sale price. <i>(3 marks)</i></p>
          <p><b>Answer A</b> (3 marks): •1 10% = £6, so 35% = £18 + £3 = £21. •2 £60 − £21. •3 £39.</p>
          <p><b>Answer B</b> (2 marks): •1 35% = £22 ✗ (an adding slip). •2 £60 − £22 ✓. •3 £38 ✓ followed through: correct for their £22.</p>
          <p><b>Answer C</b> (0 marks): £38. No working, wrong answer.</p>`)}`,
      answers: lookForPage(h, "What National 5 expects", [
        "Talk through answer B: the slip cost one mark, and the steps after it still earned theirs. That is follow-through, and it's why working matters.",
        "Ask the pupil which of this stage's topics they would least like to do without a calculator. Start there.",
        "National 4 is assessed in school: check with the school which unit assessments are still to do."])
    }));

  add("paper-sq-n5-expects", SQ_LESSON("n5-what-the-exam-expects"), "What the exam expects: National 5",
    "The National 5 Mathematics exam in a page: the two papers, what a pass takes, how SQA marks working, the formulae list, and a model answer marked bullet by bullet.", (who, h) => ({
      pupil: `${h.sheetHead("What the exam expects: National 5", who)}${sqStrip("National 5", "Read, then talk it through", 0)}
        ${box("The exam", `<p>Two papers. <b>Paper 1</b>: non-calculator, <b>1 hour</b>, <b>40 marks</b>. <b>Paper 2</b>: calculator allowed, <b>1 hour 30 minutes</b>, <b>50 marks</b>. That's 90 marks, all from the exam, graded A to D (A to C are passes).</p>`)}
        ${box("What a pass takes", `<p>SQA sets the grade boundaries each year after marking. It aims for a C at about half the marks and an A at about 70%, and the real boundaries move from year to year, so a C does <b>not</b> need every question. It needs the marks that are there for the taking: the first parts of questions, and every step you can write down.</p>`)}
        ${box("How SQA marks", `<p>Every mark is a bullet: <b>•1, •2, •3</b>, one for each step (a strategy, then each process, then the answer). An error is <b>followed through</b>: after a slip, correct steps still earn their marks. A correct answer with <b>no working may get no marks</b>. Answers need units and the rounding asked for, and "justify" or "give a reason" needs a sentence.</p>`)}
        ${box("The formulae list", `<p>The paper gives some formulae (such as the quadratic formula, the sine and cosine rules, the area of a triangle, the volumes of a sphere, cone and pyramid, and standard deviation). Look at the list in a past paper on SQA's website, and learn the ones it doesn't give: Pythagoras, circles, gradient, SOH CAH TOA.</p>`)}
        ${box("A model answer", `<p><b>Question:</b> Express x² − 8x + 3 in the form (x − a)² + b. <i>(2 marks)</i></p>
          <p><b>Answer A</b> (2 marks): •1 (x − 4)² •2 (x − 4)² − 13.</p>
          <p><b>Answer B</b> (1 mark): •1 (x − 4)² ✓ •2 (x − 4)² + 3 ✗: the 16 that (x − 4)² adds wasn't taken away.</p>`)}`,
      answers: lookForPage(h, "What the exam expects: National 5", [
        "Ask the pupil to explain follow-through in their own words, and why it means they should never leave a question blank.",
        "Look at a real National 5 paper's formulae list together (SQA's website has past papers): which formulae must they know by heart?",
        "Paper times and marks are from SQA's National 5 Mathematics course specification (2023 onwards). Grade boundaries change every year: check SQA's site."])
    }));

  add("paper-sq-nh-expects", SQ_LESSON("nh-what-the-exam-expects"), "What the exam expects: Higher",
    "The Higher Mathematics exam in a page: the two papers, what a pass takes, where marks are won and lost, and a model answer marked bullet by bullet.", (who, h) => ({
      pupil: `${h.sheetHead("What the exam expects: Higher", who)}${sqStrip("Higher", "Read, then talk it through", 0)}
        ${box("The exam", `<p>Two papers. <b>Paper 1</b>: non-calculator, <b>1 hour 15 minutes</b>, <b>55 marks</b>. <b>Paper 2</b>: calculator allowed, <b>1 hour 30 minutes</b>, <b>65 marks</b>. That's 120 marks, graded A to D (A to C are passes). Boundaries are set each year; SQA aims for a C at about half the marks.</p>`)}
        ${box("Where marks are won and lost", `<p><b>State what you're doing:</b> "dy/dx = 0 for stationary points", "for a limit, −1 < a < 1", "a.b = 0 as they're perpendicular": these statements are often a mark on their own. <b>Exact values</b> in Paper 1: surds and π, not decimals. <b>Radians or degrees:</b> answer in the units the question uses. <b>Nature tables</b> need the signs of the derivative either side, and a conclusion.</p>`)}
        ${box("Long questions", `<p>Many questions have parts (a), (b), (c) that build: "hence" means use the part before. If you can't do part (a), use the value it asked you to show and carry on with (b).</p>`)}
        ${box("The formulae list", `<p>The paper gives the circle's general equation, the scalar product, the addition and double angle formulae, and the derivatives and integrals of sin ax and cos ax. Everything else, such as the laws of logs and the wave function method, you need to know.</p>`)}
        ${box("A model answer", `<p><b>Question:</b> Find the stationary points of y = x³ − 3x² + 4. <i>(4 marks)</i></p>
          <p><b>Answer A</b> (4 marks): •1 dy/dx = 3x² − 6x •2 3x² − 6x = 0 •3 x = 0 and x = 2 •4 (0, 4) and (2, 0).</p>
          <p><b>Answer B</b> (3 marks): 3x² − 6x, then x = 0 and x = 2, then (0, 4) and (2, 0). Setting the derivative to 0 was never written, so •2 is lost.</p>`)}`,
      answers: lookForPage(h, "What the exam expects: Higher", [
        "Talk through answer B: the maths is right, but a step that wasn't written can't be given a mark.",
        "Ask the pupil for three statements that are worth a mark on their own (for example dy/dx = 0, −1 < a < 1, a.b = 0).",
        "Paper times and marks are from SQA's Higher Mathematics course specification (2023 onwards). Check SQA's site for the current formulae list and grade boundaries."])
    }));

  // ---------- Exam technique: SQA command words, then three questions to set out properly ----------

  const SQ_WORDS = [["State / Write down", "The answer only, usually 1 mark."], ["Calculate / Find / Evaluate", "Working, then the answer. Evaluate means give a value."],
    ["Solve", "Find every value that works, step by step, in the range given."], ["Simplify", "As far as it goes: collect terms, cancel, use the laws of indices."],
    ["Express … in the form …", "Your answer must look exactly like the form given."], ["Hence", "Use the part before. \"Hence, or otherwise\" lets you use another method."],
    ["Show that", "Every step written, ending with exactly what you were given."], ["Justify / Give a reason / Explain", "A sentence, with the maths that supports it."],
    ["Determine the nature", "Say which kind (maximum, minimum, real and distinct roots…) and show the reason."], ["Sketch", "The right shape, with the key points labelled (roots, intercepts, turning points)."]];
  add("paper-sq-technique", SQ_LESSON("exam-technique"), "SQA exam technique: command words and setting out",
    "What each SQA command word asks for, then three questions to set out step by step, one bullet a mark. The questions change every print.", (who, h) => {
      const pool = ["n5-percent", "n5-brackets", "n5-equations", "n5-quadratics", "n5-trig", "n5-solids", "n5-statistics"].map(id => SQX().items(id, 1, it => it.marks >= 2 && !it.options && !it.pic)[0]).filter(Boolean);
      const three = shuffle(pool).slice(0, 3);
      return {
        pupil: `${h.sheetHead("Command words and setting out", who)}${sqStrip("National 5 and Higher", "Calculator only where it says", 0)}
          <table class="gx-words">${SQ_WORDS.map(([w, d]) => `<tr><th>${w}</th><td>${d}</td></tr>`).join("")}</table>
          <p class="qd-task"><span class="qd-n">1</span> Underline the command word in each question below.</p>
          <p class="qd-task"><span class="qd-n">2</span> Set out each answer one step a line. Number the steps •1, •2… to match the marks.</p>
          ${three.map((it, i) => gxQ(it, i + 1)).join("")}`,
        answers: answersPage(h, "Command words and setting out", gxScheme(three), "Compare the pupil's bullets with the scheme: does each step they wrote match a mark?", sqAfter)
      };
    });

  // ---------- A route for a pupil working on their own ----------

  add("paper-sq-route", SQ_LESSON("my-next-step"), "SQA maths climb: my route to National 5 and Higher",
    "One page for a pupil working on their own (at home, homeschooled or resitting): the three stages, what to do each session, how to mark their own work and when to move on.", (who, h) => ({
      pupil: `${h.sheetHead("My route: National 5 and Higher", who)}${sqStrip("SQA maths climb", "Self-guided", 0)}
        ${box("The three stages", `<p><b>Stage 1, National 4 skills</b>: what National 5 takes for granted, from fractions and percentages to Pythagoras and SOH CAH TOA. <b>Stage 2, National 5</b>: the full course, from surds to standard deviation. <b>Stage 3, Higher</b>: from the straight line to calculus, vectors and logs. Start where your check says.</p>`)}
        ${box("Each session (about 45 minutes)", `<p><b>1.</b> Open <b>popspell.com/climb.html?course=sqa</b> and press <b>My next step</b>. <b>2.</b> Do what it says: a check, a topic's practice, or a mini paper. <b>3.</b> After every question, read the marking, even when you were right: it shows which steps earn marks. <b>4.</b> Copy any question you got wrong into your notebook with the right working, and try it again next session.</p>`)}
        ${box("Marking your own work", `<p>Each question says its marks, and the marking lists one bullet (•1, •2…) for each. Give yourself every bullet your working shows, even after a slip: SQA follows errors through. No working, wrong answer: no marks.</p>`)}
        ${box("When to move on", `<p>A topic is <b>secure</b> at about three-quarters of the marks in one set of its practice. When all of a stage's topics are secure, do a mini paper: about half or more, and you're ready for the next stage.</p>`)}
        <p class="gx-plan">My exam: ${blank(6)} &nbsp; Date: ${blank(6)} &nbsp; Target grade: ${blank(3)} &nbsp; Sessions a week: ${blank(3)}</p>`,
      answers: lookForPage(h, "My route: National 5 and Higher", [
        "For the adult at home: the climb page keeps progress on this device only, in this browser. Nothing is sent anywhere, so use the same device each time.",
        "Check in once a week: look at the topics marked secure, and ask the pupil to explain one question they got wrong and how they fixed it.",
        "If a topic stays below half its marks after three sessions, it needs teaching, not more practice: use the topic's lesson in PopSpell's library, or ask a tutor.",
        "A pupil sitting National 5 or Higher as a private candidate needs an SQA exam centre: ask a local school or college early in the year.",
        "Scores are a guide for planning, not an estimate of an SQA grade."])
    }));
