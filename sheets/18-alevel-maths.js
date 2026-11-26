
  /* ===================== A level maths exam climb (England, Years 12 and 13) =====================
     The GCSE and SQA climbs' sheets for A level Mathematics: stage 1 is Year 12 (the AS content), stage 2 is
     Year 13. For each stage: a check, a tracker, an exam-style sheet for each of its 14 topics and mini papers;
     then "what the exam expects", exam technique and a route for a student working alone. Questions come from
     PopActivities.examBank.alevel (activities.js), so every print is a fresh set. Pure, statistics and
     mechanics follow the DfE's GCE AS and A level subject content for mathematics (2016), which every exam
     board (AQA, Edexcel, OCR, OCR MEI) follows. Questions are PopSpell's own, never exam board papers. */

  const ALX = () => window.PopActivities.examBank.alevel;
  const AL_LESSON = slug => `lesson-alevel-maths-${slug}`;
  const alStrip = (what, calc, marks) => `<p class="qd-strip gx-strip"><b>A level maths climb</b><span>${what}</span><span>${calc}</span>${marks ? `<span>Total ___ / ${marks}</span>` : "<span>Done ☐</span>"}</p>`;
  const alAfter = `<p class="gx-note"><b>Marking the A level way:</b> each bullet (•1, •2…) is one mark. Exam boards call them M marks (a correct method), A marks (an accurate answer from a correct method) and B marks (a fact or result on its own).
    A slip is followed through: later steps done correctly with a wrong value still earn their method marks. An answer with no working may get no marks, and "show that" needs every step.</p>`;

  const AL_STAGE_LIST = [
    { key: "y12", n: 1, course: "Year 12", name: "Year 12 (AS content)", next: "Year 13",
      topics: [["proof", "Proof, surds and indices"], ["quadratics", "Quadratics, the discriminant and inequalities"], ["polynomials", "Polynomials, the factor theorem and graphs"],
        ["coordinates", "Coordinate geometry: lines and circles"], ["binomial", "The binomial expansion"], ["trig", "Trigonometry: the sine and cosine rules, graphs and equations"],
        ["logs", "Exponentials and logarithms"], ["differentiation", "Differentiation from first principles to stationary points"], ["integration", "Integration and the area under a curve"],
        ["vectors", "Vectors in two dimensions"], ["sampling", "Statistical sampling and data"], ["probability", "Probability and the binomial distribution"],
        ["hypothesis", "Hypothesis testing with the binomial distribution"], ["mechanics", "Mechanics: kinematics and Newton's laws"]] },
    { key: "y13", n: 2, course: "Year 13", name: "Year 13 (the full A level)", next: "",
      topics: [["proof", "Proof by contradiction and disproof"], ["functions", "Functions, inverses and the modulus"], ["algebra", "Partial fractions and the binomial series"],
        ["sequences", "Sequences and series"], ["radians", "Radians, small angles and reciprocal trig functions"], ["identities", "Trig identities: compound and double angles, and R cos(x − α)"],
        ["differentiation", "Differentiation: chain, product and quotient rules"], ["implicit", "Implicit and parametric differentiation, and rates of change"],
        ["integration", "Integration: substitution, by parts and partial fractions"], ["differential", "Differential equations"], ["numerical", "Numerical methods"],
        ["normal", "The normal distribution"], ["testing", "Conditional probability, and testing a mean and correlation"], ["mechanics", "Mechanics: projectiles, friction, moments and variable acceleration"]] }
  ];

  const AL_APPLIED = /-(sampling|probability|hypothesis|mechanics|normal|testing)$/;
  AL_STAGE_LIST.forEach(st => {
    const L = slug => AL_LESSON(`${st.key}-${slug}`);
    const T = () => ALX().stage(st.key).topics;

    add(`paper-al-${st.key}-check`, L("start-here"), `A level maths climb: ${st.course} check`,
      `One exam question on each of the 14 ${st.course} topics, in the order of the climb. The answers page shows which topics to work on first.`, (who, h) => {
        const size = list => list.reduce((t, it) => t + it.q.length + 2 * (it.scheme.length + String(it.answer).length) + (it.options ? it.options.join(" / ").length + String(it.answer).length : 0), 0);
        let items = ALX().check(st.key);
        for (let i = 0; i < 80 && size(items) > 3300; i++) { const next = ALX().check(st.key); if (size(next) < size(items)) items = next; }
        return {
          pupil: `${h.sheetHead(`${st.course} check`, who)}${alStrip(st.name, "Calculator allowed", gxTotal(items))}
            <p class="gx-intro">Answer what you can, in any order, and write your working beside each question. A topic you haven't met yet is useful to know, not a fail.</p>
            <table class="gx-base gx-check">${items.map(it => `<tr><td class="gx-topic">${it.topic.n}. ${it.topic.short}</td><td>${gxPlain(it.q)}${it.options ? ` <i>(${shuffle([it.answer].concat(it.options)).join(" / ")})</i>` : ""}<br><span class="gx-line">${blank(7)} <span class="gx-mk">(${gxMk(it.marks)})</span></span></td></tr>`).join("")}</table>`,
          answers: `${answersPage(h, `${st.course} check`, items.map(it => `<b>${it.topic.short}</b>: ${it.answer} <span class="gx-of">(${gxMk(it.marks)})</span><br><span class="gx-how">${it.scheme.replace(/ \(1 mark\)/g, "")}</span>`), "Each bullet is one mark. Copy each topic's score onto the tracker. Work first on the topics that lost marks, in the climb's order.")}`
        };
      });

    add(`paper-al-${st.key}-tracker`, L("start-here"), `A level maths climb: ${st.course} tracker`,
      `One page to plan and track ${st.name}: the check score, lesson, online practice and exam-style sheet for each topic, and mini paper scores.`, (who, h) => {
        const cell = '<td class="gx-cell"></td>';
        return {
          pupil: `${h.sheetHead(`${st.name}: tracker`, who)}${alStrip(st.name, "Keep this with the student's work", 0)}
            <p class="gx-plan">Exam board: ${blank(5)} &nbsp; Exam dates: ${blank(6)} &nbsp; Sessions a week: ${blank(3)} &nbsp; Target grade: ${blank(3)}</p>
            <table class="gx-track"><thead><tr><th>Topic, in climb order</th><th>Check<br>marks</th><th>Lesson<br>(date)</th><th>Online<br>best %</th><th>Exam sheet<br>score</th><th>Secure<br>✓</th></tr></thead>
            <tbody>${st.topics.map(([, title], i) => `<tr><td>${i + 1}. ${title}</td>${cell.repeat(5)}</tr>`).join("")}</tbody></table>
            <p class="gx-plan"><b>Secure</b> means about three-quarters of the exam sheet's marks, with working shown, on two different days.</p>
            <table class="gx-track gx-papers"><thead><tr><th>Mini paper</th><th>Date</th><th>Score</th><th>Topics to go back to</th></tr></thead>
            <tbody>${Array.from({ length: 4 }, () => `<tr>${cell.repeat(4)}</tr>`).join("")}</tbody></table>`,
          answers: lookForPage(h, `${st.name}: tracker`, [
            "Plan with the check: work on the topics that lost marks first, in the climb's order.",
            "Each topic: the lesson, then the online practice (aim for 80% or more), then the exam-style sheet marked one bullet a mark.",
            "Every three or four sessions, a mini paper. Note the topics it shows up and go back to them.",
            st.n === 1 ? "Year 12 is the AS content: pure maths about two-thirds, statistics and mechanics a sixth each. When most topics are secure and mini papers score about half or more, move on to Year 13."
              : "Year 13 questions lean on Year 12's algebra, trigonometry and calculus: when a topic loses marks, check the Year 12 skill under it before practising more.",
            "Scores here come from PopSpell's work and your marking. They are a guide for planning, not a predicted grade."])
        };
      });

    st.topics.forEach(([slug, title], i) => {
      add(`paper-al-${st.key}-${slug}`, L(slug), `Exam practice (A level ${st.course}) ${i + 1}: ${title}`,
        "Six exam-style questions with marks, easiest first, and an answers page marked one bullet a mark. New numbers every print.", (who, h) => {
          let pics = 0;
          const items = ALX().items(`${st.key}-${slug}`, 6).sort((a, b) => a.marks - b.marks || (a.pic ? 1 : 0) - (b.pic ? 1 : 0))
            .map(it => (it.pic && ++pics > 2 ? Object.assign({}, it, { pic: "" }) : it));
          const anyCalc = items.some(it => it.calc), total = gxTotal(items);
          return {
            pupil: `${h.sheetHead(`Exam practice: ${title}`, who)}${alStrip(`${st.course}: topic ${i + 1} of 14`, anyCalc ? "Calculator only where it says" : "No calculator", total)}
              ${items.map((it, j) => gxQ(it, j + 1)).join("")}`,
            answers: answersPage(h, `Exam practice: ${title}`, gxScheme(items), `Total ${total} marks. The answer, then where each mark comes from.`, alAfter)
          };
        });
    });

    [["pure", "Mini paper: pure maths", "Six questions from the pure topics, like Paper 1. About 25 minutes.", it => it.marks >= 2 && !it.pic, "Calculator allowed", t => !AL_APPLIED.test(t.id)],
      ["applied", "Mini paper: statistics and mechanics", "Five questions from the statistics and mechanics topics, like the applied paper. About 20 minutes.", it => it.marks >= 2 && !it.pic, "Calculator allowed", t => AL_APPLIED.test(t.id)],
      ["reasoning", "Mini paper: longer questions", "Four longer questions (3 or 4 marks each), where most marks are for the steps of working. About 20 minutes.", it => it.marks >= 3 && !it.pic, "Calculator allowed", () => true]]
      .forEach(([slug, title, detail, keep, calc, which]) => add(`paper-al-${st.key}-mini-${slug}`, L("mini-papers"), `${title} (A level ${st.course})`, detail, (who, h) => {
        const items = shuffle(T().filter(which)).map(t => ALX().items(t.id, 1, keep)[0]).filter(Boolean).slice(0, slug === "reasoning" ? 4 : slug === "applied" ? 5 : 6).sort((a, b) => a.marks - b.marks);
        const total = gxTotal(items);
        return {
          pupil: `${h.sheetHead(`${title.replace("Mini paper: ", "Mini paper, ")}`, who)}${alStrip(st.name, calc, total)}
            <p class="gx-intro">Like the real exam: show your working on every question, and give answers to 3 significant figures unless the question says otherwise.</p>
            ${items.map((it, j) => gxQ(Object.assign({}, it, { calc: false }), j + 1, slug === "reasoning" ? 1.3 : 1)).join("")}`,
          answers: answersPage(h, `${title} (A level ${st.course})`, gxScheme(items), `Total ${total} marks. Note the topic of each question that lost marks on the tracker.`, alAfter)
        };
      }));
  });

  // ---------- What the exam expects ----------
  add("paper-al-expects", AL_LESSON("what-the-exam-expects"), "What the exam expects: A level Mathematics",
    "A level Mathematics in a page: the three papers, what each board shares, the large data set, how marks are given, and a model answer marked step by step.", (who, h) => ({
      pupil: `${h.sheetHead("What the exam expects: A level Mathematics", who)}${alStrip("Years 12 and 13", "Read, then talk it through", 0)}
        ${box("The exams", `<p>All of A level Mathematics is examined at the end of Year 13: <b>three papers of 2 hours</b>, each 100 marks, all calculator allowed. Most boards give two papers to pure maths and one to statistics and mechanics (OCR MEI and AQA split them a little differently). Grades are A* to E. There's no coursework.</p>`)}
        ${box("AS level, if you take it", `<p>Some students sit AS Mathematics at the end of Year 12: two papers on the Year 12 content. AS marks don't count towards the A level; the A level exams cover everything again.</p>`)}
        ${box("What every board shares", `<p>The content is the same for AQA, Edexcel, OCR and OCR MEI (it's set by the Department for Education). The boards differ in the order of papers, the formulae booklet and the <b>large data set</b>: a real data set (weather, cars, countries…) that statistics questions use. Download your board's large data set and get to know it: questions assume you've explored it.</p>`)}
        ${box("How marks are given", `<p>M marks for a correct method, A marks for accurate answers (which depend on the M mark before them), B marks for a fact or result on its own. Give answers to 3 significant figures unless told otherwise, and keep full accuracy until the end. "Show that" means every step, ending exactly where the question does. Statistics conclusions must be <b>in context</b>.</p>`)}
        ${box("A model answer", `<p><b>Question:</b> X ~ B(20, 0.3). Test H₀: p = 0.3 against H₁: p > 0.3 at the 5% level, given x = 10. <i>(4 marks)</i></p>
          <p><b>Answer A</b> (4 marks): •1 X ~ B(20, 0.3) under H₀ •2 P(X ≥ 10) = 1 − P(X ≤ 9) = 0.0480 •3 0.0480 < 0.05, reject H₀ •4 there is evidence that the probability is greater than 0.3.</p>
          <p><b>Answer B</b> (3 marks): the same, but ends "reject H₀". With no conclusion in context, the last mark is lost.</p>`)}`,
      answers: lookForPage(h, "What the exam expects: A level Mathematics", [
        "Talk through answer B: the maths is right, but statistics marks need a conclusion in the words of the question.",
        "Find out which exam board the student will sit, download its specification, formulae booklet and large data set, and keep them with the tracker.",
        "A student sitting A levels as a private candidate needs an exam centre: contact one early in Year 12 (centres take bookings months ahead).",
        "Paper details are from the DfE's subject content (2016) and the boards' specifications: check your board's site for this year's dates."])
    }));

  add("paper-al-technique", AL_LESSON("exam-technique"), "A level exam technique: command words and setting out",
    "What each A level command word asks for, then three questions to set out step by step, one bullet a mark. The questions change every print.", (who, h) => {
      const WORDS = [["Write down / State", "The answer only; little or no working needed."], ["Find / Calculate / Determine", "Working, then the answer."], ["Show that", "Every step, ending with exactly what's given."],
        ["Hence", "Use the part before."], ["Hence or otherwise", "Use the part before, or another method."], ["Prove", "A complete logical argument, with a conclusion."],
        ["Exact", "Surds, fractions, π, ln and e: no decimals."], ["Sketch", "The right shape, with intercepts, turning points and asymptotes labelled."],
        ["Interpret / In context", "Say what it means in the situation, in its words and units."], ["Criticise / Comment on the model", "Name an assumption and why it might not hold."]];
      const pool = ["y12-differentiation", "y12-integration", "y12-probability", "y12-mechanics", "y13-integration", "y13-normal", "y13-numerical"].map(id => ALX().items(id, 1, it => it.marks >= 2 && !it.options && !it.pic)[0]).filter(Boolean);
      const three = shuffle(pool).slice(0, 3);
      return {
        pupil: `${h.sheetHead("Command words and setting out", who)}${alStrip("Years 12 and 13", "Calculator allowed", 0)}
          <table class="gx-words">${WORDS.map(([w, d]) => `<tr><th>${w}</th><td>${d}</td></tr>`).join("")}</table>
          <p class="qd-task"><span class="qd-n">1</span> Underline the command word in each question below.</p>
          <p class="qd-task"><span class="qd-n">2</span> Set out each answer one step a line. Number the steps •1, •2… to match the marks.</p>
          ${three.map((it, i) => gxQ(it, i + 1)).join("")}`,
        answers: answersPage(h, "Command words and setting out", gxScheme(three), "Compare the student's bullets with the scheme: does each step they wrote match a mark?", alAfter)
      };
    });

  add("paper-al-route", AL_LESSON("my-next-step"), "A level maths climb: my route through Years 12 and 13",
    "One page for a student working on their own (homeschooled or studying independently): the two stages, what to do each session, how to mark their own work and when to move on.", (who, h) => ({
      pupil: `${h.sheetHead("My route: A level Mathematics", who)}${alStrip("A level maths climb", "Self-guided", 0)}
        ${box("The two stages", `<p><b>Stage 1, Year 12</b>: proof, algebra, coordinate geometry, the binomial expansion, trig, logs, differentiation, integration, vectors, sampling, probability, hypothesis testing and kinematics. <b>Stage 2, Year 13</b>: functions, series, trig identities, more calculus, differential equations, numerical methods, the normal distribution and harder mechanics.</p>`)}
        ${box("Each session (about an hour)", `<p><b>1.</b> Open <b>popspell.com/climb.html?course=alevel</b> and press <b>My next step</b>. <b>2.</b> Do what it says: a check, a topic's practice, or a mini paper. <b>3.</b> After every question, read the marking, even when you were right. <b>4.</b> Copy any question you got wrong into a notebook with the right working. <b>5.</b> Once a week, an exam-style sheet on paper.</p>`)}
        ${box("Marking your own work", `<p>Each question says its marks, and the marking lists one bullet (•1, •2…) for each. Give yourself every bullet your working shows, even after a slip. No working, wrong answer: no marks.</p>`)}
        ${box("When to move on", `<p>A topic is <b>secure</b> at about three-quarters of the marks in one set of its practice. When all of a stage's topics are secure, do a mini paper: about half or more, and you're ready for the next stage. Then real past papers from your board.</p>`)}
        <p class="gx-plan">Exam board: ${blank(5)} &nbsp; Exam centre: ${blank(6)} &nbsp; Target grade: ${blank(3)} &nbsp; Sessions a week: ${blank(3)}</p>`,
      answers: lookForPage(h, "My route: A level Mathematics", [
        "For the adult at home: the climb page keeps progress on this device only. Nothing is sent anywhere, so use the same device each time.",
        "Check in once a week: look at the topics marked secure, and ask the student to explain one question they got wrong and how they fixed it.",
        "If a topic stays below half its marks after three sessions, it needs teaching, not more practice: use the topic's lesson, or a tutor.",
        "Private candidates need an exam centre: book early in Year 12.",
        "Scores are a guide for planning, not a predicted grade."])
    }));
