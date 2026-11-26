  /* ===================== SQA Applications of Mathematics climb (Scotland: National 5 and Higher) =====================
     The SQA and A level maths climbs' sheets for Applications of Mathematics: stage 1 is National 5, stage 2 is Higher.
     For each stage: a check, a tracker, an exam-style sheet for each topic and two mini papers; then "what the exam
     expects" and a route for a learner working alone. Questions come from PopActivities.examBank.apps (activities.js),
     so every print is a fresh set. Content follows SQA's National 5 and Higher Applications of Mathematics course
     specifications. Questions are PopSpell's own, never SQA past papers. */

  const APX = () => window.PopActivities.examBank.apps;
  const AP_LESSON = slug => `lesson-sqa-apps-${slug}`;
  const apStrip = (what, calc, marks) => `<p class="qd-strip gx-strip"><b>SQA Applications of Maths climb</b><span>${what}</span><span>${calc}</span>${marks ? `<span>Total ___ / ${marks}</span>` : "<span>Done ☐</span>"}</p>`;
  const apAfter = `<p class="gx-note"><b>Marking the SQA way:</b> each bullet (•1, •2…) is one mark, for one step. A slip is followed through: later steps done correctly with a wrong value still earn their marks. Money answers need units and two decimal places, and a decision (which deal, is it acceptable) needs a reason from the working.</p>`;

  const AP_STAGE_LIST = [
    { key: "ap5", n: 1, course: "National 5", name: "National 5 Applications of Mathematics",
      topics: [["numeracy", "Numeracy: rounding, estimating and calculating in context"], ["pay", "Finance: pay, deductions and budgets"], ["deals", "Finance: best deals, exchange rates, saving and borrowing"],
        ["statistics", "Statistics: averages, spread and comparing data sets"], ["scatter", "Scattergraphs, probability and expected frequency"], ["geometry", "Geometry: Pythagoras, gradient and area"],
        ["volume", "Measurement: volume, surface area and packing"], ["scale", "Scale drawings, bearings and navigation"], ["time", "Time, speed, time zones and planning tasks"],
        ["logic", "Tolerance, tariffs, flowcharts and reading charts"]] },
    { key: "aph", n: 2, course: "Higher", name: "Higher Applications of Mathematics",
      topics: [["borrowing", "Finance: borrowing, loans and mortgages"], ["saving", "Finance: saving, investing and inflation"], ["sampling", "Statistics: sampling, summaries and outliers"],
        ["regression", "Correlation and linear regression"], ["probability", "Probability, conditional probability and expected value"], ["planning", "Planning and decision making: critical paths and float"],
        ["modelling", "Mathematical modelling: linear and exponential"]] }
  ];

  AP_STAGE_LIST.forEach(st => {
    const L = slug => AP_LESSON(`${st.key}-${slug}`);
    const T = () => APX().stage(st.key).topics, nT = st.topics.length;

    add(`paper-ap-${st.key}-check`, L("start-here"), `SQA Applications of Maths climb: ${st.course} check`,
      `One exam question on each of the ${nT} ${st.name} topics, in the order of the climb. The answers page shows which topics to work on first.`, (who, h) => {
        const items = APX().check(st.key);
        return {
          pupil: `${h.sheetHead(`${st.course} Applications: check`, who)}${apStrip(st.name, "Calculator allowed", gxTotal(items))}
            <p class="gx-intro">Answer what you can, in any order, and write your working beside each question. A topic you haven't met yet is useful to know, not a fail.</p>
            <table class="gx-base gx-check">${items.map(it => `<tr><td class="gx-topic">${it.topic.n}. ${it.topic.short}</td><td>${gxPlain(it.q)}${it.options ? ` <i>(${shuffle([it.answer].concat(it.options)).join(" / ")})</i>` : ""}<br><span class="gx-line">${blank(7)} <span class="gx-mk">(${gxMk(it.marks)})</span></span></td></tr>`).join("")}</table>`,
          answers: answersPage(h, `${st.course} Applications: check`, items.map(it => `<b>${it.topic.short}</b>: ${it.answer} <span class="gx-of">(${gxMk(it.marks)})</span><br><span class="gx-how">${it.scheme.replace(/ \(1 mark\)/g, "")}</span>`), "Each bullet is one mark. Copy each topic's score onto the tracker. Work first on the topics that lost marks, in the climb's order.")
        };
      });

    add(`paper-ap-${st.key}-tracker`, L("start-here"), `SQA Applications of Maths climb: ${st.course} tracker`,
      `One page to plan and track ${st.name}: the check score, lesson, online practice and exam-style sheet for each topic, and mini paper scores.`, (who, h) => {
        const cell = '<td class="gx-cell"></td>';
        return {
          pupil: `${h.sheetHead(`${st.name}: tracker`, who)}${apStrip(st.name, "Keep this with the learner's work", 0)}
            <p class="gx-plan">Exam date: ${blank(6)} &nbsp; Exam centre: ${blank(6)} &nbsp; Sessions a week: ${blank(3)} &nbsp; Target grade: ${blank(3)}</p>
            <table class="gx-track"><thead><tr><th>Topic, in climb order</th><th>Check<br>marks</th><th>Lesson<br>(date)</th><th>Online<br>best %</th><th>Exam sheet<br>score</th><th>Secure<br>✓</th></tr></thead>
            <tbody>${st.topics.map(([, title], i) => `<tr><td>${i + 1}. ${title}</td>${cell.repeat(5)}</tr>`).join("")}</tbody></table>
            <p class="gx-plan"><b>Secure</b> means about three-quarters of the exam sheet's marks, with working shown, on two different days.</p>
            <table class="gx-track gx-papers"><thead><tr><th>Mini paper</th><th>Date</th><th>Score</th><th>Topics to go back to</th></tr></thead>
            <tbody>${Array.from({ length: 4 }, () => `<tr>${cell.repeat(4)}</tr>`).join("")}</tbody></table>`,
          answers: lookForPage(h, `${st.name}: tracker`, [
            "Plan with the check: work on the topics that lost marks first, in the climb's order.",
            "Each topic: the lesson, then the online practice (aim for 80% or more), then the exam-style sheet marked one bullet a mark.",
            "Every three or four sessions, a mini paper. Note the topics it shows up and go back to them.",
            st.n === 1 ? "Applications questions are set in real contexts: ask the learner to say what each answer means (is the deal cheaper, is the part acceptable) as well as working it out."
              : "Higher Applications leans on National 5's finance and statistics: when a topic loses marks, check the National 5 skill under it first. The course also has a project (a statistical or modelling investigation): plan it early with the school or exam centre.",
            "Scores here come from PopSpell's work and your marking. They are a guide for planning, not a predicted grade."])
        };
      });

    st.topics.forEach(([slug, title], i) => {
      add(`paper-ap-${st.key}-${slug}`, L(slug), `Exam practice (${st.course} Applications) ${i + 1}: ${title}`,
        "Six exam-style questions with marks, easiest first, and an answers page marked one bullet a mark. New numbers every print.", (who, h) => {
          let pics = 0;
          const items = APX().items(`${st.key}-${slug}`, 6).sort((a, b) => a.marks - b.marks || (a.pic ? 1 : 0) - (b.pic ? 1 : 0))
            .map(it => (it.pic && ++pics > 2 ? Object.assign({}, it, { pic: "" }) : it));
          const total = gxTotal(items);
          return {
            pupil: `${h.sheetHead(`Exam practice: ${title}`, who)}${apStrip(`${st.course}: topic ${i + 1} of ${nT}`, "Calculator allowed", total)}
              ${items.map((it, j) => gxQ(Object.assign({}, it, { calc: false }), j + 1)).join("")}`,
            answers: answersPage(h, `Exam practice: ${title}`, gxScheme(items), `Total ${total} marks. The answer, then where each mark comes from.`, apAfter)
          };
        });
    });

    [["mixed", "Mini paper: mixed questions", "Six questions from across the stage, like a paper cut down. About 25 minutes.", it => it.marks >= 2 && !it.pic, 6],
      ["reasoning", "Mini paper: longer questions", "Four longer questions, where most marks are for the steps and the decision at the end. About 20 minutes.", it => it.marks >= 3 && !it.pic, 4]]
      .forEach(([slug, title, detail, keep, n]) => add(`paper-ap-${st.key}-mini-${slug}`, L("mini-papers"), `${title} (${st.course} Applications)`, detail, (who, h) => {
        const items = shuffle(T()).map(t => APX().items(t.id, 1, keep)[0]).filter(Boolean).slice(0, n).sort((a, b) => a.marks - b.marks);
        const total = gxTotal(items);
        return {
          pupil: `${h.sheetHead(`${title.replace("Mini paper: ", "Mini paper, ")}`, who)}${apStrip(st.name, "Calculator allowed", total)}
            <p class="gx-intro">Like the real exam: show your working on every question, give money to two decimal places, and say what each answer means.</p>
            ${items.map((it, j) => gxQ(Object.assign({}, it, { calc: false }), j + 1, slug === "reasoning" ? 1.3 : 1)).join("")}`,
          answers: answersPage(h, `${title} (${st.course} Applications)`, gxScheme(items), `Total ${total} marks. Note the topic of each question that lost marks on the tracker.`, apAfter)
        };
      }));
  });

  add("paper-ap-expects", AP_LESSON("what-the-exam-expects"), "What the exam expects: SQA Applications of Mathematics",
    "National 5 and Higher Applications of Mathematics in a page: the papers, the Higher project, how marks are given, and a model answer marked step by step.", (who, h) => ({
      pupil: `${h.sheetHead("What the exam expects: Applications of Mathematics", who)}${apStrip("National 5 and Higher", "Read, then talk it through", 0)}
        ${box("What the course is for", `<p>Applications of Mathematics is maths for life, work and further study: money, statistics, measurement, planning and modelling, always in a real context. It suits learners who want strong practical maths rather than the algebra and calculus of National 5 and Higher Mathematics.</p>`)}
        ${box("National 5", `<p>Two question papers: <b>Paper 1</b>, no calculator, and <b>Paper 2</b>, calculator allowed. Questions mix numeracy, finance, statistics, geometry and measurement, often several in one context (a holiday, a job, a building project).</p>`)}
        ${box("Higher", `<p>Two question papers (finance, statistics, planning and decision making, modelling) and a <b>project</b>: a statistical or modelling investigation the learner plans, carries out and writes up. A private candidate needs to agree how the project will be supervised with their exam centre.</p>`)}
        ${box("How marks are given", `<p>One mark for each step (•1, •2…). Show the calculation, not just the answer. Money to two decimal places with £. When a question asks you to decide or compare, the last mark is for the decision <b>with a reason from your working</b>.</p>`)}
        ${box("A model answer", `<p><b>Question:</b> Contract A: £50 up front, then £18 a month. Contract B: £21 a month. Which is cheaper over 24 months? <i>(3 marks)</i></p>
          <p><b>Answer A</b> (3 marks): •1 A: £50 + 24 × £18 = £482 •2 B: 24 × £21 = £504 •3 A is cheaper, by £22.</p>
          <p><b>Answer B</b> (2 marks): the same totals, then "A". With no reason or comparison, the last mark is lost.</p>`)}`,
      answers: lookForPage(h, "What the exam expects: Applications of Mathematics", [
        "Talk through answer B: the working is right, but the decision mark needs a reason that comes from the working.",
        "Get the current course specification and specimen papers from SQA (or through the school or exam centre), and check this year's exam dates.",
        "A private candidate needs an exam centre that accepts them: ask early in the year. For Higher, agree how the project will be supervised.",
        "Paper details here are a plain-words summary of SQA's course specifications, not SQA's own wording."])
    }));

  add("paper-ap-route", AP_LESSON("my-next-step"), "SQA Applications of Maths climb: my route through National 5 and Higher",
    "One page for a learner working on their own (homeschooled, or an adult): the two stages, what to do each session, how to mark their own work and when to move on.", (who, h) => ({
      pupil: `${h.sheetHead("My route: Applications of Mathematics", who)}${apStrip("SQA Applications of Maths climb", "Self-guided", 0)}
        ${box("The two stages", `<p><b>Stage 1, National 5</b>: numeracy, pay and budgets, best deals and borrowing, statistics, scattergraphs and probability, geometry, volume and packing, scale and bearings, time and planning, and tolerance and charts. <b>Stage 2, Higher</b>: borrowing and mortgages, saving and inflation, sampling, regression, probability, critical paths and modelling.</p>`)}
        ${box("Each session (about 45 minutes)", `<p><b>1.</b> Open <b>popspell.com/climb.html?course=apps</b> and press <b>My next step</b>. <b>2.</b> Do what it says: a check, a topic's practice, or a mini paper. <b>3.</b> After every question, read the marking, even when you were right. <b>4.</b> Copy any question you got wrong into a notebook with the right working. <b>5.</b> Once a week, an exam-style sheet on paper.</p>`)}
        ${box("Marking your own work", `<p>Each question says its marks, and the marking lists one bullet (•1, •2…) for each. Give yourself every bullet your working shows, even after a slip. No working, wrong answer: no marks.</p>`)}
        ${box("When to move on", `<p>A topic is <b>secure</b> at about three-quarters of the marks in one set of its practice. When all of a stage's topics are secure, do a mini paper: about half or more, and you're ready for the next stage. Then SQA's specimen and past papers (ask SQA, your school or your exam centre for copies).</p>`)}
        <p class="gx-plan">Exam centre: ${blank(6)} &nbsp; Exam date: ${blank(6)} &nbsp; Target grade: ${blank(3)} &nbsp; Sessions a week: ${blank(3)}</p>`,
      answers: lookForPage(h, "My route: Applications of Mathematics", [
        "For the adult at home: the climb page keeps progress on this device only. Nothing is sent anywhere, so use the same device each time.",
        "Check in once a week: look at the topics marked secure, and ask the learner to explain one question they got wrong and how they fixed it.",
        "If a topic stays below half its marks after three sessions, it needs teaching, not more practice: use the topic's lesson, or a tutor.",
        "Scores are a guide for planning, not a predicted grade."])
    }));
