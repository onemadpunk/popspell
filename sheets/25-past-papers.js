  /* ===================== Real past papers: tracker and topic map =====================
     PopSpell never prints, copies or rewords an exam board's papers or mark schemes: they belong to the
     boards. What it adds is the part around them. For each stage of each climb, one sheet: how to sit a real
     past paper well, a question-by-question tracker, and a map from the paper's topics to the climb's own
     numbered topics (each has a ready lesson and an Exam practice sheet), so every lost
     mark turns into a next step. The back tells the adult where the free papers come from and how to read
     that board's mark scheme. It's attached to each stage's mini papers lesson, so it's in the packs. */

  const PP_MATHS_BANK = { gcse: () => window.PopActivities && window.PopActivities.examBank, sqa: () => window.PopActivities && window.PopActivities.examBank.scotland,
    alevel: () => window.PopActivities && window.PopActivities.examBank.alevel, apps: () => window.PopActivities && window.PopActivities.examBank.apps };
  const PP_WHERE = {
    england: "From the school or college first: ask the subject teacher or the exams officer. They can print papers for you, including the most recent ones, which the boards often keep for teachers only for a year. The exam board itself publishes past papers, mark schemes and examiner reports free of charge, and a library can print them. Check which board and tier (or paper) the pupil is entered for: it's on their timetable or exam entry, or the school can tell you.",
    scotland: "From the school or college first: ask the subject teacher, who can also tell you which past papers the class has already used. SQA publishes past papers and their marking instructions free of charge, and a library can print them. SQA also publishes a course report each year saying where candidates lost marks: it's worth reading with the paper."
  };
  const PP_COURSES = [
    { id: "gcse", nation: "england", subject: "maths", exam: "GCSE Mathematics", boards: "AQA, Edexcel (Pearson) or OCR", rows: 30,
      stages: [["s1", "lesson-england-gcse-climb-mini-papers", "Foundation tier"], ["s2", "lesson-england-gcse-climb-g5-mini-papers", "Foundation (late questions) or Higher (early questions)"], ["s3", "lesson-england-gcse-climb-gh-mini-papers", "Higher tier"]],
      scheme: ["<b>M</b> marks are for a correct method, even if the answer is wrong. <b>A</b> marks are for an accurate answer, and usually need the M mark first. <b>B</b> marks stand alone.",
        "<b>ft</b> (follow through): a later mark can still be earned using an earlier wrong answer. <b>oe</b>: or equivalent. <b>cao</b>: correct answer only.",
        "A right answer with no working can lose marks when the question says \"show\" or \"you must show your working\"."] },
    { id: "sqa", nation: "scotland", subject: "maths", exam: "SQA Mathematics", boards: "SQA", rows: 30,
      stages: [["s1", "lesson-sqa-climb-n4-mini-papers", "National 5 papers (questions worth 1 or 2 marks), as National 4 has no final exam"], ["s2", "lesson-sqa-climb-n5-mini-papers", "National 5"], ["s3", "lesson-sqa-climb-nh-mini-papers", "Higher"], ["s4", "lesson-sqa-climb-ah-mini-papers", "Advanced Higher"]],
      scheme: ["Each mark is a numbered bullet (•1, •2, •3) for one step, given in order in the marking instructions' \"expected response\".",
        "The general marking principles at the start come first: they say when an error can be followed through, and what a bullet needs.",
        "A correct answer with no working may get no marks: the working is where the marks are."] },
    { id: "alevel", nation: "england", subject: "maths", exam: "A level Mathematics", boards: "AQA, Edexcel (Pearson), OCR A or OCR B (MEI)", rows: 20,
      stages: [["s1", "lesson-alevel-maths-y12-mini-papers", "AS papers, or the A level questions on Year 12 content"], ["s2", "lesson-alevel-maths-y13-mini-papers", "A level papers"]],
      scheme: ["<b>M</b> method, <b>A</b> accuracy (needs the M), <b>B</b> independent marks; <b>dM</b> is a method mark that needs an earlier M.",
        "In a \"show that\" question the answer is given: every step must be written, or the marks are lost.",
        "<b>ft</b>, <b>oe</b> and <b>cao</b> mean follow through, or equivalent and correct answer only."] },
    { id: "apps", nation: "scotland", subject: "maths", exam: "SQA Applications of Mathematics", boards: "SQA", rows: 20,
      stages: [["s1", "lesson-sqa-apps-ap5-mini-papers", "National 5 Applications of Mathematics"], ["s2", "lesson-sqa-apps-aph-mini-papers", "Higher Applications of Mathematics"]],
      scheme: ["Each mark is a numbered bullet (•1, •2) for one step. Questions that ask for a decision need a reason that comes from the working.",
        "The general marking principles at the start of the marking instructions say when an error can be followed through.",
        "Rounding: round only at the end, to what the question asks; money to the nearest penny."] },
    { id: "gcse", nation: "england", subject: "english", exam: "GCSE English Language", boards: "AQA, Edexcel (Pearson), OCR or Eduqas", rows: 10,
      stages: [["s1", "lesson-england-english-climb-e1-mini-papers"], ["s2", "lesson-england-english-climb-e2-mini-papers"], ["s3", "lesson-england-english-climb-e3-mini-papers"]],
      scheme: ["Short questions (finding information) get a mark a correct point.", "Longer questions are marked in <b>levels</b>: read each level's description, find the one that fits best overall, then decide whether it's at the top or bottom of that level.",
        "The examiner report shows real answers at each level: compare the pupil's answer with them."] },
    { id: "sqa", nation: "scotland", subject: "english", exam: "SQA English", boards: "SQA", rows: 12,
      stages: [["s1", "lesson-sqa-english-climb-en4-mini-papers", "National 5 Reading for Understanding, Analysis and Evaluation (as practice; National 4 has no final exam)"], ["s2", "lesson-sqa-english-climb-en5-mini-papers"], ["s3", "lesson-sqa-english-climb-enh-mini-papers"], ["s4", "lesson-sqa-english-climb-enah-mini-papers"]],
      scheme: ["Reading questions: marks go to each point that is explained, usually 1 mark for a reference with a basic comment and 2 for a more detailed one; quoting alone gets nothing.",
        "Essays and the Scottish text question are marked in bands: find the band that fits best overall, then the mark within it.",
        "The marking instructions list possible answers: other answers that make the same point also get the marks."] },
    { id: "alevel", nation: "england", subject: "english", exam: "A level English Literature or Language", boards: "AQA, Edexcel (Pearson), OCR or Eduqas", rows: 8,
      stages: [["s1", "lesson-alevel-english-al1-mini-papers", "A level English Literature"], ["s2", "lesson-alevel-english-al2-mini-papers", "A level English Language"]],
      scheme: ["Answers are marked in levels against the assessment objectives (AO1 to AO5): the mark scheme says which ones each question tests, and how much each counts.",
        "Find the level that fits best overall, then the mark within it. An answer that ignores one of the question's objectives is capped.",
        "Set texts differ by board: use only questions on the texts the pupil has studied, or the unseen sections."] }
  ];
  // The climb's topics for a stage, as "n. title" (and where they come up in the exam, for English)
  const ppTopics = (c, i) => {
    if (c.subject === "maths") { const b = PP_MATHS_BANK[c.id](); const st = b && b.STAGES[i]; return st ? st.topics.map(t => ({ n: t.n, title: t.title, where: "" })) : []; }
    const E = window.PopEnglishExam, course = E && E.course(c.id), st = course && E.stagesOf(course)[i];
    return st ? st.topics.map(t => ({ n: t.n, title: t.title, where: t.paper || "" })) : [];
  };
  const ppStage = (c, i) => {
    if (c.subject === "maths") { const b = PP_MATHS_BANK[c.id](); return b && b.STAGES[i] ? b.STAGES[i].title : `Stage ${i + 1}`; }
    const E = window.PopEnglishExam, course = E && E.course(c.id), st = course && E.stagesOf(course)[i];
    return st ? st.title : `Stage ${i + 1}`;
  };
  const ppRows = (n, from) => Array.from({ length: n }, (_, k) => `<tr><td>${from + k}</td><td></td><td></td><td></td></tr>`).join("");
  const PP_NAMES = { "gcse maths": "GCSE maths climb", "sqa maths": "SQA maths climb", "alevel maths": "A level maths climb", "apps maths": "SQA Applications of Maths climb",
    "gcse english": "GCSE English climb", "sqa english": "SQA English climb", "alevel english": "A level English climb" };
  PP_COURSES.forEach(c => c.stages.forEach(([sk, lesson, papers], i) => {
    const climb = PP_NAMES[`${c.id} ${c.subject}`];
    add(`paper-pp-${c.subject}-${c.id}-${sk}`, lesson, `Real past papers (${climb}, stage ${i + 1}): tracker and topic map`,
      `For a real ${c.exam} past paper from ${c.boards}: how to sit it, a question-by-question tracker, and a map from its topics to the climb's numbered topics, so every lost mark becomes a next step. The back says where the free papers come from and how to read the mark scheme. PopSpell doesn't reprint any board's papers.`, (who, h) => {
        const topics = ppTopics(c, i), half = Math.ceil(c.rows / 2), eng = c.subject === "english";
        return {
          pupil: `${h.sheetHead("Real past paper: tracker", who)}<p class="qd-strip gx-strip"><b>Real past paper</b><span>${exEsc(ppStage(c, i))}</span><span>Paper: ${blank(6)} Year: ${blank(3)}</span></p>
            <p class="pp-pp-how"><b>1.</b> Sit it like the real thing: a clear table, a timer, no help. <b>2.</b> When time's up, draw a line, then finish in a different colour, so you can see what extra time would have given. <b>3.</b> Mark it with the board's mark scheme, strictly. <b>4.</b> Fill in the tracker: for every question, write the topic number from the map. <b>5.</b> Circle the topics where you lost the most marks: they're your next steps.</p>
            <div class="${eng ? "" : "pp-pp-two"}">${(eng ? [[c.rows, 1]] : [[half, 1], [c.rows - half, half + 1]]).map(([n, from]) => `<table class="gx-track pp-pp-t"><thead><tr><th>Q</th><th>Marks</th><th>I got</th><th>Topic no.</th></tr></thead><tbody>${ppRows(n, from)}</tbody></table>`).join("")}</div>
            <p class="pp-pp-total"><b>Total:</b> ${blank(3)} out of ${blank(3)} = ${blank(3)} %${eng ? "" : `&nbsp;&nbsp; <b>Before the line:</b> ${blank(3)} &nbsp; <b>After:</b> ${blank(3)}`}</p>
            ${box("Topic map: the climb's topics for this stage", `<ol class="pp-pp-map${eng ? "" : " pp-pp-cols"}">${topics.map(t => `<li value="${t.n}">${exEsc(t.title)}${t.where ? ` <span class="gx-how">(${exEsc(t.where)})</span>` : ""}</li>`).join("")}</ol>`)}
            ${box("My next steps", `<p>The topics where I lost most marks: ${blank(3)} ${blank(3)} ${blank(3)}. For each: the climb's lesson for that topic, then its Exam practice sheet. Then try another paper.</p>`)}`,
          answers: lookForPage(h, `Real past papers: ${c.exam}`, [
            `<b>Which papers:</b> ${papers || c.exam}, from ${c.boards}. Use the papers for the board and level the pupil will sit.`,
            `<b>Where to get them, free:</b> ${PP_WHERE[c.nation]}`,
            `<b>Timing:</b> the stage's "what the exam expects" sheet in the climb gives the papers, times and marks. Sit the whole paper timed when you can; when you can't, do one section timed, at the same pace.`,
            `<b>Reading the mark scheme:</b> ${c.scheme.join(" ")}`,
            `<b>Filling in the map:</b> some questions use two topics: write both numbers. A question on something not in the map is from another stage: look it up in the climb's other stages.`,
            `<b>How often:</b> one paper every two or three weeks is plenty in the months before the exam. In between, work on the circled topics: that's where the marks come from.`],
            `PopSpell doesn't reprint or reword any board's papers or mark schemes: they belong to the boards, and the board's own versions are the ones to trust. This sheet is the tracker and map that go with them.`)
        };
      });
  }));
