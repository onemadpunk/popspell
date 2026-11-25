  /* ===================== SQA English exam climb (Scotland) =====================
     The GCSE English climb's sheets (14-english-climb.js), for Scotland: stage 1 builds the National 4
     skills that National 5 takes for granted, stage 2 is National 5, stage 3 is Higher, stage 4 is Advanced
     Higher (textual analysis, the Literary Study essay, the dissertation and one portfolio piece). For each stage: a
     check, a tracker and "what the exam expects"; an exam practice sheet for each topic (the passage, quick
     questions, then an RUAE, Scottish text or critical essay question, with an answers page of reasons,
     what to look for, SQA-style marking and a model answer); two portfolio (folio) writing tasks with a
     plan, self-check and a model; and two mini papers. Plus both exams in a page and a route for a pupil
     working alone. The helpers (exText, exQuick, exWritten…) are 14-english-climb.js's, in the same scope.
     Questions and texts are exam-english/sqa.js's and texts.js's: PopSpell's own passages, Burns and
     Stevenson; nothing comes from an SQA past paper. */

  if (EXB && EXB.course("sqa")) {
    const EX = EXB, SC = EX.course("sqa");
    const SE_LESSON = slug => `lesson-sqa-english-climb-${slug}`;
    const seStrip = (what, how, marks) => exStrip(what, how, marks, "SQA English climb");
    const seTag = st => st.n === 1 ? "National 4 skills" : st.goal;
    // Portfolio pieces are marked out of 15 (PopSpell's plain-words summary of SQA's bands)
    const SE_FOLIO = [
      ["15–13", "Skilfully done: a clear, sustained purpose; a confident structure; expression that is precise and varied; techniques that work; very few errors."],
      ["12–10", "Done well: a clear purpose; a structure that helps the reader; expression that is effective; techniques used with some skill; few errors."],
      ["9–7", "Done adequately (about a pass at C): a purpose that's mostly clear; a sensible structure; some effective expression; errors don't get in the way."],
      ["6–4", "Some attempt: purpose and structure unclear in places; plain expression; errors that sometimes get in the way."],
      ["3–1", "Little sense of purpose or structure; errors that make it hard to follow."]];
    const seEssayLevels = `<p class="ex-sub">How a full critical essay is marked (out of 20)</p>${exLevels(SC.ESSAY_20)}`;
    // Advanced Higher's written tasks: the Literary Study essay has its own bands; the portfolio piece has the folio's
    const seWriteLevels = t => t.stage.key !== "enah" ? seEssayLevels
      : t.id === "enah-essay" ? `<p class="ex-sub">How a Literary Study essay is marked (out of 20)</p>${exLevels(SC.LIT_20)}`
      : t.id === "enah-portfolio" ? `<p class="ex-sub">How the portfolio piece is marked (out of 15, doubled to 30)</p>${exLevels(SE_FOLIO)}` : "";

    // ---------- An exam practice sheet for each topic ----------
    SC.STAGES.forEach(st => st.topics.forEach(t => {
      const w = t.written, on = exTextsOf(w), where = `Stage ${st.n}, topic ${t.n} of ${st.topics.length}`;
      const nQuick = on.length > 1 ? 3 : on.length ? 4 : w.given ? 4 : 5;
      add(`paper-ex-${t.id}`, SE_LESSON(t.id), `SQA English practice ${st.n}.${t.n}: ${t.title}`,
        `${on.length ? `${on.length > 1 ? "Two passages" : "A passage"} to read, ` : ""}${nQuick} quick questions, then an exam-style question (${t.paper}). The answers page has the reasons, what to look for, how SQA-style marking works and a model answer.`, (who, h) => {
          const quick = exPick(t, on, nQuick);
          return {
            pupil: `${h.sheetHead(`Exam practice: ${t.title}`, who)}${seStrip(where, t.paper, 0)}
              ${exTexts(on)}
              <p class="ex-h"><b>Quick questions</b> Tick one answer each.</p>
              <div class="ex-quick">${quick.map((it, i) => exQuick(it, i + 1, on)).join("")}</div>
              <p class="ex-h"><b>Exam question</b></p>${exWritten(w, quick.length + 1)}`,
            answers: answersPage(h, `Exam practice: ${t.title}`, quick.map(exQuickAns), "Quick questions: the answer, and why.",
              exWrittenAns(w, quick.length + 1) + (w.kind === "write" ? seWriteLevels(t) : ""))
          };
        });
    }));

    // ---------- Each stage: the check, the tracker, what the exam expects, the folio tasks and the mini papers ----------
    SC.STAGES.forEach(st => {
      const tag = seTag(st);
      const L = slug => SE_LESSON(`${st.key}-${slug}`);
      const writing = SC.WRITING.filter(w => w.stage === st.key);
      const minis = SC.MINI.filter(m => m.id.startsWith(`${st.key}-`));

      add(`paper-ex-${st.key}-check`, L("start-here"), `SQA English climb: ${tag} check`,
        `One question on each of the ${st.topics.length} stage ${st.n} topics, in the order of the climb, with the reasons on the answers page. It shows which topics to work on first.`, (who, h) => {
          const items = st.topics.map(t => shuffle(t.items.filter(it => exUsable(it, [])))[0]);
          return {
            pupil: `${h.sheetHead(`${tag}: check`, who)}${seStrip(st.title, "About 15 minutes", items.length)}
              <p class="gx-intro">Tick one answer for each question. A question you can't do yet is useful to know, not a fail: leave it and move on.</p>
              ${items.map((it, i) => `<div class="ex-check"><p class="ex-topic">${it.topic.n}. ${exEsc(it.topic.short)}</p>${exQuick(it, i + 1, [])}</div>`).join("")}`,
            answers: `${answersPage(h, `${tag}: check`, items.map(it => `<b>${it.topic.n}. ${exEsc(it.topic.short)}</b>: ${exQuickAns(it)}`), "One mark each. Put ✓ or ✗ beside each topic on the stage tracker.")}
              <p class="gx-note"><b>What to work on first:</b> the topics marked ✗, in the climb's order. One question is a quick look, not a verdict: a topic marked ✓ still gets its exam practice sheet before it's ticked off. The online check asks ${st.n === 1 ? "two questions" : "one question"} a topic and marks itself.</p>`
          };
        });

      add(`paper-ex-${st.key}-tracker`, L("start-here"), `SQA English climb: ${tag} tracker`,
        `One page to plan and track stage ${st.n}: each topic's check, lesson, online practice and exam sheet, the two folio pieces and the mini papers.`, (who, h) => ({
          pupil: `${h.sheetHead(`Road to ${st.goal}: tracker`, who)}${seStrip(st.title, "Keep this with the pupil's work", 0)}
            <p class="gx-plan">Exam date: ${blank(7)} &nbsp; Folio deadline: ${blank(7)} &nbsp; Sessions a week: ${blank(3)} &nbsp; Aim: <b>${st.n === 1 ? "National 4, ready for 5" : `${st.goal}, grade ${blank(2)}`}</b></p>
            ${exTrack(st.topics.map(t => `${t.n}. ${exEsc(t.title)}`))}
            <table class="gx-track gx-papers"><thead><tr><th>Folio piece or mini paper</th><th>Date</th><th>Self-check ✓</th><th>Marks</th><th>What to work on next</th></tr></thead>
            <tbody>${writing.map(w => `${w.kind}: ${exEsc(w.q.length > 60 ? `${w.q.slice(0, 57)}…` : w.q)}`).concat(minis.map(m => exEsc(m.title))).map(r => `<tr><td>${r}</td>${'<td class="gx-cell"></td>'.repeat(4)}</tr>`).join("")}</tbody></table>
            <p class="gx-plan"><b>Secure</b> means about three-quarters of the online practice right, and the exam sheet's question answered at the level the answers page describes for ${st.goal}.</p>`,
          answers: lookForPage(h, `Road to ${st.goal}: tracker`, [
            "Plan with the check: start with the topics marked ✗, in the climb's order. Reading topics and writing topics alternate well: one of each a session.",
            "Each topic: the lesson, then the online practice (aim for 75% or more), then the exam practice sheet. Mark its exam question with the marking on the answers page, then compare with the model together.",
            st.n === 1 ? "National 4 is assessed in class, with no exam. The two writing pieces here are good evidence for it, and the habit National 5's folio needs."
              : st.n === 4 ? "The portfolio piece and the dissertation are 30% of the course mark each, written over the year. Use the two writing tasks to practise for the portfolio (only one piece is submitted), and the dissertation topic to plan early."
              : "The two folio pieces are 30% of the course mark, written in class over weeks. Use these tasks to practise: plan, draft, self-check, then redraft once.",
            "Then the mini papers. About 50% or more on a mini paper is roughly a C; 60% or more is a good sign the stage is done.",
            "Marks here come from PopSpell's work and your marking. They are a guide for planning, not a predicted grade."])
        }));

      const grade = SC.GRADES[st.n - 1];
      add(`paper-ex-${st.key}-expects`, L("start-here"), `What the exam expects: SQA ${tag} English`,
        `What ${st.goal} English takes: the kinds of question, how SQA-style marking works (own words, analysis, the Scottish text and the essay), and the stage's folio checklist.`, (who, h) => ({
          pupil: `${h.sheetHead(`What the exam expects: ${tag}`, who)}${seStrip(st.title, "Read, then talk it through", 0)}
            ${box(`What ${grade[0]} looks like`, `<p>${exEsc(grade[1]).replace("Writing:", "<br><b>Writing:</b>").replace("Reading:", "<b>Reading:</b>")}</p>`)}
            ${box("This stage", `<p>${exEsc(st.about)}</p>
              ${st.n === 1 ? "<p>National 4 has no exam: your teacher assesses reading, writing, talking and listening in class, plus an added value unit. Every skill here is one National 5's RUAE and essay expect you to have already.</p>"
                : st.n === 2 ? "<p>National 5 is two exam papers (RUAE 30 marks, Critical Reading 40) plus the folio (30). Most RUAE marks come from own-words and analysis questions: a reference plus a clear comment, every time.</p>"
                : st.n === 3 ? "<p>Higher has the same three parts as National 5, but the RUAE has two passages and ends with a 5-mark comparison, and every answer needs more precise, insightful comment.</p>"
                : "<p>Advanced Higher is four parts: two question papers of 1 hour 30 minutes and 20 marks each (Literary Study: one critical essay on texts you've studied; Textual Analysis: a critical analysis of one unseen text), a portfolio piece (30 marks) and a 2,500 to 3,500 word dissertation (30 marks).</p>"}`)}
            ${box("How answers are marked", st.n === 1
              ? `<p><b>Own words:</b></p>${exLevels(SC.OWN_WORDS)}<p><b>Analysis (word choice, imagery, sentence structure, tone):</b></p>${exLevels(SC.MARKS_2)}`
              : st.n === 4 ? `<p><b>Textual Analysis</b> (out of 20):</p>${exLevels(SC.TA_20)}<p><b>Literary Study</b> (out of 20):</p>${exLevels(SC.LIT_20)}`
              : `<p><b>Analysis:</b> up to 2 marks for each reference with its comment.</p>${exLevels(SC.MARKS_2)}<p><b>The Scottish text's final 10-mark question:</b></p>${exLevels(SC.FINAL_10)}<p><b>The critical essay</b> is marked out of 20; 10 is about a pass.</p>`)}
            ${box(st.n === 1 ? "Writing: what to check" : st.n === 4 ? "The portfolio: one piece, 15 marks doubled" : "The folio: two pieces, 15 marks each", `${st.n === 1 ? "" : `<p>${exEsc((SC.writingFor || {})[st.key] || SC.EXAM.writing)}</p>`}
              <div class="ex-cols">${exTicks(SC.CHECK[st.key].content)}${exTicks(SC.CHECK[st.key].accuracy)}</div>`)}`,
          answers: lookForPage(h, `What the exam expects: ${tag}`, [
            `Read the "${grade[0]}" box together and ask the pupil to put it in their own words: what does their reading need, and their writing?`,
            "Look at how analysis is marked: a reference alone gets nothing. Take an answer the pupil wrote recently and count its marks together: which comment was basic (1) and which detailed (2)?",
            "The writing checklist is the same one on the stage's folio task sheets and on the My next step page. Use it before every draft is handed in.",
            `Exam facts are from SQA's published course specifications for ${st.n === 4 ? "Advanced Higher English (2025 onwards)" : "National 5 and Higher English"}. Check SQA's website for this year's dates${st.n === 4 ? " and rules" : " and set Scottish texts"}.`,
            "Grade descriptions and marking here are PopSpell's plain-words summary, not SQA's own wording."])
        }));

      writing.forEach(w => {
        const check = SC.CHECK[st.key];
        add(`paper-ex-write-${w.id}`, L("writing"), `SQA English folio task: ${w.kind.toLowerCase()} (${tag})`,
          `${w.paper}: plan, draft in about ${w.minutes} minutes, then check against the stage's list. The answers page has a model with notes and the 15-mark folio bands.`, (who, h) => ({
            pupil: `${h.sheetHead(`Folio task: ${w.kind.toLowerCase()}`, who)}${seStrip(`${st.title}, aiming at ${w.grade}`, `${w.paper} · first draft ${w.minutes} minutes`, w.marks)}
              ${box("The task", `<p class="ex-big">${exEsc(w.q)}</p><p><i>(${w.marks} marks: content, structure, expression and technical accuracy${st.n === 1 ? "" : st.n === 4 ? ". At Advanced Higher there is no word limit, and the mark is doubled" : `. A final folio piece is up to ${st.n === 2 ? "1,000" : "1,300"} words`})</i></p>`)}
              ${box("Plan (10 minutes)", `<ol class="ex-plan">${w.plan.map(p => `<li>${exEsc(p)}</li>`).join("")}</ol><div class="pp-draw ex-planbox"></div>`)}
              <p class="ex-more"><b>Draft</b> on lined paper, or on the My next step page. Then <b>check</b>: tick each line you can honestly tick, and fix what you can't. A folio piece is redrafted: one redraft after feedback is normal.</p>
              <div class="ex-cols ex-self">${exTicks(check.content)}${exTicks(check.accuracy)}</div>`,
            answers: `${h.brandHead(`Model and marking: ${w.kind.toLowerCase()}`, "For the adult, not the pupil.")}
              ${exModel(`A model, about ${w.grade}`, w.model)}
              <p class="ex-sub">Why it works</p>${exList(w.notes)}
              <p class="ex-sub">How a folio piece is marked (out of 15)</p>${exLevels(SE_FOLIO)}
              <p class="gx-note">Find the band that fits best overall, then go up or down within it. In feedback, name one thing that would lift it, not ten: a folio draft is for improving. Bands are PopSpell's plain-words summary of SQA's marking.</p>`
          }));
      });

      minis.forEach(m => {
        const on = m.texts || (m.t ? [m.t] : []);
        // The parts of a mini paper: a topic's question (ref), a question of its own, or a critical essay
        const parts = m.parts.map(p => {
          if (p.ref) { const w = EX.topic(p.ref).written; return { ref: p.ref, q: w.q, marks: w.marks, minutes: p.minutes, w }; }
          return { q: p.q, marks: p.marks, minutes: p.minutes, w: p, essay: p.essay };
        });
        const total = parts.reduce((s, p) => s + p.marks, 0);
        // The short questions' marking (own words, 2 marks a reference) is shown once at the top, not under every part
        const SHARED = [[SC.OWN_WORDS, "Own-words questions"], [SC.MARKS_2, "Analysis questions: each reference with its comment"]];
        const shared = SHARED.filter(([lv]) => parts.some(p => !p.ref && p.w.levels === lv));
        const partLevels = p => SHARED.some(([lv]) => p.w.levels === lv) || p.essay || p.ref ? { levels: [] } : {};
        add(`paper-ex-${m.id}`, L("mini-papers"), `${m.title} (SQA English)`,
          `${m.minutes} minutes, like a paper cut down: ${parts.map(p => `${p.marks} marks`).join(", ")}. Answers on lined paper; the answers page has what to look for and the marking.`, (who, h) => ({
            pupil: `${h.sheetHead(m.title.replace("Mini paper: ", "Mini paper, "), who)}${seStrip(st.title, `${m.minutes} minutes · answer on lined paper`, total)}
              ${exTexts(on)}
              ${parts.map((p, i) => `<div class="pp-q ex-mq"><p><b>${i + 1}.</b> ${exEsc(p.q)} <span class="gx-mk">(${exMk(p.marks)}, about ${p.minutes} minutes)</span></p>
                ${p.essay ? `<p class="ex-tip">Plan for 5 minutes: a line of thought and three or four points. Check for the last 3.</p>` : ""}</div>`).join("")}`,
            answers: `${h.brandHead(`Marking: ${m.title}`, "For the adult, not the pupil.")}
              <p class="gx-note">Total ${total} marks. About 50% is roughly a C; 60% or more and the stage is going well. Note each part's marks on the stage tracker.</p>
              ${shared.length ? `<div class="ex-cols">${shared.map(([lv, name]) => `<div><p class="ex-sub">${name}</p>${exLevels(lv)}</div>`).join("")}</div>` : ""}
              <div class="ex-mini">${parts.map((p, i) => exWrittenAns(Object.assign({}, p.w, { q: p.q, marks: p.marks }, partLevels(p), p.ref ? { model: "" } : {}), i + 1)
                + (p.essay ? `<p class="ex-tip">Mark out of 20 with the critical essay bands on the answers page of "${exEsc(EX.topic(`${st.key}-essay`).title)}" (SQA English practice ${st.n}.${EX.topic(`${st.key}-essay`).n}). 10 is about a pass.</p>` : "")
                + (p.ref ? `<p class="ex-tip">The marking and a model answer are on the answers page of "${exEsc(EX.topic(p.ref).title)}" (SQA English practice ${EX.topic(p.ref).stage.n}.${EX.topic(p.ref).n}).</p>` : "")).join("")}</div>`
          }));
      });
    });

    // ---------- Both exams in a page, and a route for a pupil working alone ----------
    add("paper-ex-sqa-exam", SE_LESSON("en5-start-here"), "SQA National 5 and Higher English: the exams in a page",
      "Both question papers and the folio at a glance: what each part asks, its marks and how long to spend, plus what National 4, 5 and Higher look like.", (who, h) => ({
        pupil: `${h.sheetHead("National 5 and Higher English: the exams", who)}${seStrip("All stages", "Read, then keep it in your folder", 0)}
          ${SC.EXAM.papers.map(p => box(`${exEsc(p.name)} (${p.marks} marks)`, `<p><i>${exEsc(p.time)}. ${exEsc(p.text)}</i></p>
            <table class="ex-paper"><thead><tr><th>Q</th><th>What it asks</th><th>Marks</th><th>Time</th></tr></thead><tbody>${p.qs.map(([n, what, mk, time]) => `<tr><td>${n}</td><td>${exEsc(what)}</td><td>${mk}</td><td>${time}</td></tr>`).join("")}</tbody></table>`)).join("")}
          ${box("The portfolio (30 marks)", `<p>${exEsc(SC.EXAM.writing)} Up to 1,000 words a piece at National 5, 1,300 at Higher.</p>`)}
          ${box("Good to know", `<p>${exEsc(SC.EXAM.reading)}</p><p>${exEsc(SC.EXAM.spoken)}</p>`)}
          ${box("What each level looks like", `<table class="ex-levels">${SC.GRADES.map(([g, d]) => `<tr><th>${g}</th><td>${exEsc(d)}</td></tr>`).join("")}</table>`)}`,
        answers: lookForPage(h, "National 5 and Higher English: the exams", [
          SC.EXAM.boards,
          "Ask the pupil: how many marks is the folio worth? (30, as much as the RUAE paper.) How long should a 2-mark question take? (About two minutes: a minute a mark.)",
          "The critical essay must be on a different genre from the Scottish text answered in Section 1. Check which texts the pupil has studied for each.",
          "A common way to lose marks is writing long answers to 2-mark questions and running out of time for the final question. Practise to the times in the tables.",
          "Level descriptions are PopSpell's plain-words summary, not SQA's own wording."])
      }));

    add("paper-ex-sqa-route", SE_LESSON("my-next-step"), "SQA English climb: my route from National 4 to Advanced Higher",
      "One page for a pupil working on their own (at home, or homeschooled): the four stages, what to do each session, marking your own answers honestly, and when to move on.", (who, h) => ({
        pupil: `${h.sheetHead("My route: SQA English, National 4 to Advanced Higher", who)}${seStrip("SQA English climb", "Self-guided", 0)}
          ${box("The four stages", `${SC.STAGES.map(s => `<p><b>${exEsc(s.title)}.</b> ${exEsc(s.about)}</p>`).join("")}<p>Start where your check says. You don't have to go to the top: a National 5 pass is a fine place to stop.</p>`)}
          ${box("Each session (about 45 minutes)", `<p><b>1.</b> Open <b>popspell.com/english-climb.html?course=sqa</b> and press <b>My next step</b>. <b>2.</b> Do what it says: a check, a topic's questions, a folio task, or a mini paper. <b>3.</b> Read the reason after every question, even when you were right. <b>4.</b> For written answers, count your marks honestly: a reference with no comment scores nothing.</p>`)}
          ${box("Reading every day", `<p>Ten minutes a day of good journalism (a long read in a Scottish or UK newspaper) is the best RUAE practice there is. Pick one sentence a day and ask: why did the writer choose that word?</p>`)}
          ${box("When to move on", `<p>A topic is <b>secure</b> when you get about three-quarters of a set of its questions right. When a stage's topics are secure and you've drafted its two folio pieces, take a mini paper. About 60% or more? Start the next stage.</p>`)}
          <p class="gx-plan">My exam date: ${blank(7)} &nbsp; My course: ${blank(5)} &nbsp; My Scottish text: ${blank(6)} &nbsp; Stage I'm on: ${blank(3)}</p>`,
        answers: lookForPage(h, "My route: SQA English, National 4 to Advanced Higher", [
          "For the adult at home: the climb page keeps progress on this device only, in this browser. Nothing is sent anywhere, so use the same device each time.",
          "Once a week, ask to see one written answer and count its marks together with the marking on the answers page.",
          "Folio pieces and essays can't mark themselves. The bands and models make self-marking honest, but a teacher or tutor's look now and then is worth a lot.",
          "Scottish set texts are chosen by the school from SQA's list. The Scottish text practice here uses Burns and Stevenson; the method (extract questions, then the 10-mark question) is the same for any set text.",
          "Scores are a guide for planning, not a predicted grade."])
      }));
  }
