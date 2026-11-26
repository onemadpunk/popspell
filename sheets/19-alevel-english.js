  /* ===================== A level English climb (England, Years 12 and 13) =====================
     The GCSE and SQA English climbs' sheets (14-english-climb.js, 15-sqa-english-climb.js), for A level:
     stage 1 is English Literature, stage 2 is English Language. For each stage: a check, a tracker and
     "what the exam expects"; an exam practice sheet for each topic (the text, quick questions, then an
     A level question, with an answers page of reasons, what to look for, mark bands and a model answer);
     a writing task with a plan, self-check and a model; and two mini papers. Plus a route for a student
     working alone. The helpers (exText, exQuick, exWritten…) are 14-english-climb.js's, in the same scope.
     Questions and texts are exam-english/alevel.js's and texts.js's: PopSpell's own transcripts and articles
     and public-domain literature; nothing comes from any board's past paper. */

  if (EXB && EXB.course("alevel")) {
    const EX = EXB, AC = EX.course("alevel");
    const AE_LESSON = slug => `lesson-alevel-english-${slug}`;
    const aeStrip = (what, how, marks) => exStrip(what, how, marks, "A level English climb");
    const aeShort = st => st.n === 1 ? "Literature" : "Language";

    // ---------- An exam practice sheet for each topic ----------
    AC.STAGES.forEach(st => st.topics.forEach(t => {
      const w = t.written, on = exTextsOf(w), where = `${aeShort(st)}, topic ${t.n} of ${st.topics.length}`;
      const nQuick = on.length > 1 ? 3 : on.length ? 4 : 5;
      add(`paper-ex-${t.id}`, AE_LESSON(t.id), `A level English practice ${st.n}.${t.n}: ${t.title}`,
        `${on.length ? `${on.length > 1 ? "Two texts" : "A text"} to read, ` : ""}${nQuick} quick questions, then an A level question (${t.paper}). The answers page has the reasons, what to look for, the mark bands and a model answer.`, (who, h) => {
          const quick = exPick(t, on, nQuick);
          return {
            pupil: `${h.sheetHead(`A level practice: ${t.title}`, who)}${aeStrip(where, t.paper, 0)}
              ${exTexts(on)}
              <p class="ex-h"><b>Quick questions</b> Tick one answer each.</p>
              <div class="ex-quick">${quick.map((it, i) => exQuick(it, i + 1, on)).join("")}</div>
              <p class="ex-h"><b>Exam question</b></p>${exWritten(w, quick.length + 1)}`,
            answers: answersPage(h, `A level practice: ${t.title}`, quick.map(exQuickAns), "Quick questions: the answer, and why.",
              exWrittenAns(w, quick.length + 1) + `<p class="gx-note">Find the band that fits best overall, then go up or down within it. Bands are PopSpell's plain-words summary of how A level answers are marked, not any board's own wording.</p>`)
          };
        });
    }));

    // ---------- Each stage: the check, the tracker, what the exam expects, the writing task and the mini papers ----------
    AC.STAGES.forEach(st => {
      const short = aeShort(st);
      const L = slug => AE_LESSON(`${st.key}-${slug}`);
      const writing = AC.WRITING.filter(w => w.stage === st.key);
      const minis = AC.MINI.filter(m => m.id.startsWith(`${st.key}-`));
      const check = AC.CHECK[st.key];

      add(`paper-ex-${st.key}-check`, L("start-here"), `A level English climb: ${short} check`,
        `One question on each of the ${st.topics.length} ${short} topics, in the order of the climb, with the reasons on the answers page. It shows which topics to work on first.`, (who, h) => {
          const items = st.topics.map(t => shuffle(t.items.filter(it => exUsable(it, [])))[0]);
          return {
            pupil: `${h.sheetHead(`A level ${short}: check`, who)}${aeStrip(st.title, "About 15 minutes", items.length)}
              <p class="gx-intro">Tick one answer for each question. A question you can't do yet is useful to know, not a fail: leave it and move on.</p>
              ${items.map((it, i) => `<div class="ex-check"><p class="ex-topic">${it.topic.n}. ${exEsc(it.topic.short)}</p>${exQuick(it, i + 1, [])}</div>`).join("")}`,
            answers: `${answersPage(h, `A level ${short}: check`, items.map(it => `<b>${it.topic.n}. ${exEsc(it.topic.short)}</b>: ${exQuickAns(it)}`), "One mark each. Put ✓ or ✗ beside each topic on the tracker.")}
              <p class="gx-note"><b>What to work on first:</b> the topics marked ✗, in the climb's order. One question is a quick look, not a verdict: a topic marked ✓ still gets its practice sheet before it's ticked off. The online check asks two questions a topic and marks itself.</p>`
          };
        });

      add(`paper-ex-${st.key}-tracker`, L("start-here"), `A level English climb: ${short} tracker`,
        `One page to plan and track ${st.goal}: each topic's check, lesson, online practice and practice sheet, the writing task and the mini papers.`, (who, h) => ({
          pupil: `${h.sheetHead(`${st.goal}: tracker`, who)}${aeStrip(st.title, "Keep this with the student's work", 0)}
            <p class="gx-plan">Exam board: ${blank(6)} &nbsp; Exam dates: ${blank(7)} &nbsp; Coursework deadline: ${blank(6)} &nbsp; Target grade: ${blank(2)}</p>
            ${exTrack(st.topics.map(t => `${t.n}. ${exEsc(t.title)}`))}
            <table class="gx-track gx-papers"><thead><tr><th>Writing task or mini paper</th><th>Date</th><th>Self-check ✓</th><th>Marks</th><th>What to work on next</th></tr></thead>
            <tbody>${writing.map(w => exEsc(w.kind)).concat(minis.map(m => exEsc(m.title))).map(r => `<tr><td>${r}</td>${'<td class="gx-cell"></td>'.repeat(4)}</tr>`).join("")}</tbody></table>
            <p class="gx-plan"><b>Secure</b> means about three-quarters of the online practice right, and the practice sheet's question answered in the 16–20 band or above.</p>`,
          answers: lookForPage(h, `${st.goal}: tracker`, [
            "Plan with the check: start with the topics marked ✗, in the climb's order. One topic a week suits most sixth-form timetables.",
            "Each topic: the lesson, then the online practice (aim for 75% or more), then the practice sheet. Mark its exam question with the bands on the answers page, then compare with the model together.",
            "Coursework is about 20% of the A level. Use the coursework topic early in the year: choosing texts or data takes time.",
            "Then the mini papers. About 60% or more is a good sign the stage is going well.",
            "Marks here come from PopSpell's work and your marking. They are a guide for planning, not a predicted grade."])
        }));

      add(`paper-ex-${st.key}-expects`, L("start-here"), `What the exam expects: ${st.goal}`,
        `What ${st.goal} takes: the papers and coursework, how answers are marked in bands, what each grade looks like, and the writing checklist.`, (who, h) => {
          const paper = AC.EXAM.papers[st.n - 1];
          return {
            pupil: `${h.sheetHead(`What the exam expects: ${st.goal}`, who)}${aeStrip(st.title, "Read, then talk it through", 0)}
              ${box(`${exEsc(paper.name)}`, `<p><i>${exEsc(paper.time)}. ${exEsc(paper.marks)}.</i> ${exEsc(paper.text)}</p>
                <table class="ex-paper"><thead><tr><th>Q</th><th>What it asks</th><th>Marks</th><th>Time</th></tr></thead><tbody>${paper.qs.map(([n, what, mk, time]) => `<tr><td>${n}</td><td>${exEsc(what)}</td><td>${mk}</td><td>${time}</td></tr>`).join("")}</tbody></table>`)}
              ${box("How long answers are marked (out of 25)", exLevels(st.n === 1 ? AC.LIT_25 : AC.LANG_25))}
              ${box("What each grade looks like", `<table class="ex-levels">${AC.GRADES.map(([g, d]) => `<tr><th>${g}</th><td>${exEsc(d)}</td></tr>`).join("")}</table>`)}
              ${box("Writing: what to check", `<div class="ex-cols">${exTicks(check.content)}${exTicks(check.accuracy)}</div>`)}`,
            answers: lookForPage(h, `What the exam expects: ${st.goal}`, [
              AC.EXAM.boards,
              "Ask the student to find their board's specification (from their school or college, or the board) and note the set texts or topics, the papers and the coursework rules.",
              "Look at the bands together: take an answer the student wrote recently and find its band. What would lift it to the next?",
              AC.EXAM.writing,
              "Exam facts are from the DfE's subject content, which every board follows. Band and grade descriptions are PopSpell's plain-words summary, not any board's own wording."])
          };
        });

      writing.forEach(w => {
        add(`paper-ex-write-${w.id}`, L("writing"), `A level English writing task: ${w.kind.toLowerCase()} (${st.goal})`,
          `${w.paper}: plan, draft in about ${w.minutes} minutes, then check against the list. The answers page has a model with notes and the bands.`, (who, h) => ({
            pupil: `${h.sheetHead(`Writing task: ${w.kind.toLowerCase()}`, who)}${aeStrip(`${st.title}, aiming at ${w.grade}`, `${w.paper} · about ${w.minutes} minutes`, w.marks)}
              ${box("The task", `<p class="ex-big">${exEsc(w.q)}</p>`)}
              ${box("Plan (10 minutes)", `<ol class="ex-plan">${w.plan.map(p => `<li>${exEsc(p)}</li>`).join("")}</ol><div class="pp-draw ex-planbox"></div>`)}
              <p class="ex-more"><b>Draft</b> on lined paper, or on the My next step page. Then <b>check</b>: tick each line you can honestly tick, and fix what you can't.</p>
              <div class="ex-cols ex-self">${exTicks(check.content)}${exTicks(check.accuracy)}</div>`,
            answers: `${h.brandHead(`Model and marking: ${w.kind.toLowerCase()}`, "For the adult, not the student.")}
              ${exModel(`A model, about ${w.grade}`, w.model)}
              <p class="ex-sub">Why it works</p>${exList(w.notes)}
              <p class="ex-sub">How it is marked (out of ${w.marks})</p>${exLevels(st.n === 1 ? AC.LIT_25 : AC.LANG_25)}
              <p class="gx-note">Find the band that fits best overall, then go up or down within it. In feedback, name one thing that would lift it, not ten. Coursework rules on feedback differ by board: check before commenting on a final draft.</p>`
          }));
      });

      minis.forEach(m => {
        const on = m.texts || (m.t ? [m.t] : []);
        const parts = m.parts.map(p => {
          if (p.ref) { const w = EX.topic(p.ref).written; return { ref: p.ref, q: w.q, marks: w.marks, minutes: p.minutes, w }; }
          return { q: p.q, marks: p.marks, minutes: p.minutes, w: p };
        });
        const total = parts.reduce((s, p) => s + p.marks, 0);
        add(`paper-ex-${m.id}`, L("mini-papers"), m.title,
          `${m.minutes} minutes, like a paper cut down: ${parts.map(p => `${p.marks} marks`).join(", ")}. Answers on lined paper; the answers page has what to look for and the bands.`, (who, h) => ({
            pupil: `${h.sheetHead(m.title.replace("Mini paper: ", "Mini paper, "), who)}${aeStrip(st.title, `${m.minutes} minutes · answer on lined paper`, total)}
              ${exTexts(on)}
              ${parts.map((p, i) => `<div class="pp-q ex-mq"><p><b>${i + 1}.</b> ${exEsc(p.q)} <span class="gx-mk">(${exMk(p.marks)}, about ${p.minutes} minutes)</span></p></div>`).join("")}
              <p class="ex-tip">Plan before you write: a one-sentence argument and three or four points.</p>`,
            answers: `${h.brandHead(`Marking: ${m.title}`, "For the adult, not the student.")}
              <p class="gx-note">Total ${total} marks. About 60% or more and the stage is going well. Note each part's marks on the tracker.</p>
              <div class="ex-mini">${parts.map((p, i) => exWrittenAns(Object.assign({}, p.w, { q: p.q, marks: p.marks }, p.ref ? { model: "" } : {}), i + 1)
                + (p.ref ? `<p class="ex-tip">A model answer is on the answers page of "${exEsc(EX.topic(p.ref).title)}" (A level English practice ${EX.topic(p.ref).stage.n}.${EX.topic(p.ref).n}).</p>` : "")).join("")}</div>`
          }));
      });
    });

    // ---------- A route for a student working alone ----------
    add("paper-ex-alevel-route", AE_LESSON("my-next-step"), "A level English climb: my route through Years 12 and 13",
      "One page for a student working on their own (at home, or homeschooled): the two courses, what to do each session, marking your own answers honestly with the bands, and when to move on.", (who, h) => ({
        pupil: `${h.sheetHead("My route: A level English", who)}${aeStrip("A level English climb", "Self-guided", 0)}
          ${box("The two stages", `${AC.STAGES.map(s => `<p><b>${exEsc(s.title)}.</b> ${exEsc(s.about)}</p>`).join("")}<p>Most students take one of the two A levels: do the stage for yours. Both share close reading and argued writing.</p>`)}
          ${box("Each session (about an hour)", `<p><b>1.</b> Open <b>popspell.com/english-climb.html?course=alevel</b> and press <b>My next step</b>. <b>2.</b> Do what it says: a check, a topic's questions, a writing task, or a mini paper. <b>3.</b> Read the reason after every question, even when you were right. <b>4.</b> Mark written answers with the bands honestly: find the best fit, then say what would lift it.</p>`)}
          ${box("Reading every day", `<p>Literature: your set texts, plus one poem or short story a week you haven't studied (unseen practice). Language: one article and one piece of real talk (a podcast, a conversation) a day, noticing one feature of each.</p>`)}
          ${box("When to move on", `<p>A topic is <b>secure</b> when you get about three-quarters of its questions right and its practice answer reaches the 16–20 band. When a stage's topics are secure and you've done its writing task, take a mini paper.</p>`)}
          ${box("Sitting A levels as a private candidate", `<p>Homeschooled students sit the exams at an exam centre that accepts private candidates; ask early, as places and fees vary. Coursework (about 20%) must be supervised and marked by the centre, so agree it with them before you start.</p>`)}
          <p class="gx-plan">My board: ${blank(6)} &nbsp; My exam centre: ${blank(7)} &nbsp; Exam dates: ${blank(6)} &nbsp; Target: ${blank(2)}</p>`,
        answers: lookForPage(h, "My route: A level English", [
          "For the adult at home: the climb page keeps progress on this device only, in this browser. Nothing is sent anywhere, so use the same device each time.",
          "Once a week, ask to see one written answer and find its band together with the answers page.",
          "Essays can't mark themselves. The bands and models make self-marking honest, but a teacher or tutor's look now and then is worth a lot.",
          "Set texts are chosen from the board's list. The practice here uses public-domain texts and PopSpell's own; the method works for any set text.",
          "Scores are a guide for planning, not a predicted grade."])
      }));
  }
