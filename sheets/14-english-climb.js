  /* ===================== GCSE English exam climb (England) =====================
     The same climb as the maths one, for GCSE English Language (and Literature where it's practical):
     stage 1 takes a pupil from grade 1 to 3, stage 2 to grades 4 and 5, stage 3 to grades 6 to 9.
     For each stage: a stage check, a tracker and "what the exam expects"; an exam practice sheet for
     each topic (the text, quick questions, then the exam-style written question, with an answers page of
     reasons, what to look for, the marking levels and a model answer); the stage's two writing tasks with
     a plan, self-check list and a model; and two mini papers. Plus the whole exam in a page, a route for a
     pupil working alone, and four Literature sheets.
     The questions and texts come from exam-english/ (PopEnglishExam), the same bank as the online practice.
     Texts are PopSpell's own or out of copyright; nothing comes from a past paper. Pages that print sheets
     without that bank (it loads before paper-sheets.js in index.html) just don't list these. */

  // Shared by both English climbs' sheets (this file, GCSE; 15-sqa-english-climb.js, SQA), so they're out here
  const EXB = window.PopEnglishExam;
  const exEsc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const exMk = n => `${n} mark${n === 1 ? "" : "s"}`;
  const exStrip = (what, how, marks, label = "GCSE English climb") => `<p class="qd-strip gx-strip"><b>${label}</b><span>${what}</span><span>${how}</span>${marks ? `<span>Total ___ / ${marks}</span>` : "<span>Done ☐</span>"}</p>`;
  // Prose in paragraphs (a blank line between), lines of a poem or play kept as lines
  const exParas = s => String(s).split(/\n\s*\n/).map(p => `<p>${exEsc(p).replace(/\n/g, "<br>")}</p>`).join("");
  // A text as the exam prints it: title, writer and date, then the extract
  const exText = (id, cls = "") => {
    const t = EXB.text(id);
    // a long poem (over 20 lines) goes in two columns, so it leaves room for the questions
    const long = t && t.kind === "poem" && t.text.split("\n").length > 20 ? "ex-long" : "";
    return t ? `<div class="ex-text ${t.kind === "poem" || t.kind === "play" ? "ex-verse" : ""} ${long} ${cls}"><p class="ex-src"><b>${exEsc(t.title)}</b> · ${exEsc(t.by)}</p>${exParas(t.text)}</div>` : "";
  };
  const exTexts = ids => ids.length > 1 ? `<div class="ex-two">${ids.map(id => exText(id)).join("")}</div>` : ids.map(id => exText(id)).join("");
  const exTextsOf = w => (w.texts || (w.t ? [w.t] : []));

  // A quick question on paper: a question about a text on the sheet, about no text, or about lines quoted
  // from another text (printed with it). A question about the whole of a text that isn't on the sheet can't be asked.
  const exUsable = (it, on) => !it.t || on.includes(it.t) || it.x;
  const exQuick = (it, i, on) => {
    const quote = it.t && !on.includes(it.t) ? `<p class="ex-quote">From “${exEsc(EXB.text(it.t).title)}”: “${exEsc(it.x)}”</p>` : "";
    return `<div class="pp-q ex-q"><p><b>${i}.</b> ${exEsc(it.q)}</p>${quote}
      <p class="ex-opts">${shuffle([it.a].concat(it.o)).map(o => `<span>☐ ${exEsc(o)}</span>`).join("")}</p></div>`;
  };
  const exQuickAns = it => `<b>${exEsc(it.a)}</b><br><span class="gx-how">${exEsc(it.why)}</span>`;
  // Quick questions for a sheet: the ones about its own texts first, then the rest, in the bank's order
  const exPick = (t, on, n) => {
    const ok = shuffle(t.items.filter(it => exUsable(it, on)));
    return ok.filter(it => it.t && on.includes(it.t)).concat(ok.filter(it => !(it.t && on.includes(it.t)))).slice(0, n).sort((a, b) => a.n - b.n);
  };
  const exLevels = levels => levels && levels.length ? `<table class="ex-levels">${levels.map(([m, d]) => `<tr><th>${exEsc(m)}</th><td>${exEsc(d)}</td></tr>`).join("")}</table>` : "";
  const exModel = (label, s) => s ? `<div class="pp-box ex-model"><b>${label}</b>${exParas(s)}</div>` : "";
  const exList = (items, cls = "ex-look") => `<ul class="${cls}">${items.map(s => `<li>${exEsc(s)}</li>`).join("")}</ul>`;
  const exTicks = items => `<ul class="ex-ticks">${items.map(s => `<li>☐ ${exEsc(s)}</li>`).join("")}</ul>`;
  const exLinesFor = marks => marks >= 8 ? 8 : marks >= 4 ? 5 : 7; // the page's spare room is added as more lines
  // The exam question part of a sheet: the task (and a paragraph to correct, for an edit), then room to write
  const exWritten = (w, n) => {
    const more = w.marks >= 8 || w.kind === "write" ? `<p class="ex-more">Carry on on lined paper if you need more room.</p>` : "";
    return `<div class="ex-task"><p><b>${n}.</b> ${exEsc(w.q)}${w.marks ? ` <span class="gx-mk">(${exMk(w.marks)})</span>` : ""}</p>
      ${w.given ? `<div class="ex-given">${exParas(w.given)}</div>` : ""}
      ${w.tip ? `<p class="ex-tip"><b>Tip:</b> ${exEsc(w.tip)}</p>` : ""}
      ${lines(exLinesFor(w.marks))}${more}
      ${w.check ? `<div class="ex-self"><b>Check your answer:</b>${exTicks(w.check)}</div>` : ""}</div>`;
  };
  const exWrittenAns = (w, n) => `<div class="ex-ans-part"><p class="ex-h"><b>${n}. The exam question${w.marks ? `, ${exMk(w.marks)}` : ""}</b></p>
    ${w.look && w.look.length ? `<p class="ex-sub">${w.kind === "edit" ? "The corrections" : "Look for"}</p>${exList(w.look)}` : ""}
    ${exLevels(w.levels)}${exModel(w.kind === "write" ? "A model to compare with" : w.kind === "edit" ? "Corrected" : "A model answer", w.model)}</div>`;

  const exTrack = rows => `<table class="gx-track"><thead><tr><th>Topic, in climb order</th><th>Check<br>✓ / ✗</th><th>Lesson<br>(date)</th><th>Online<br>best %</th><th>Exam sheet<br>marks</th><th>Secure<br>✓</th></tr></thead>
    <tbody>${rows.map(r => `<tr><td>${r}</td>${'<td class="gx-cell"></td>'.repeat(5)}</tr>`).join("")}</tbody></table>`;

  if (EXB && EXB.course("gcse")) {
    const EX = EXB, EC = EX.course("gcse");
    const EX_LESSON = slug => `lesson-england-english-climb-${slug}`;
    // Writing is marked in two parts on every paper: content and organisation (24), accuracy (16)
    const EX_WRITING_LEVELS = [
      ["Content and organisation, 24 marks", ""],
      ["19–24", "Compelling and crafted: tone matched to the reader all the way through, ambitious and precise words, structure used for effect."],
      ["13–18", "Clear and engaging: suits the task and reader, words chosen for effect, paragraphs linked and ideas developed."],
      ["7–12", "Some success: mostly suits the task, some words chosen for effect, paragraphs used, some links."],
      ["1–6", "Simple: an attempt at the task, simple words, ideas in a list more than paragraphs."],
      ["Accuracy, 16 marks", ""],
      ["13–16", "A wide range of sentences and punctuation used accurately for effect; ambitious words spelled right."],
      ["9–12", "Sentences varied and mostly accurate; a range of punctuation; most spelling right, including harder words."],
      ["5–8", "Mostly secure sentence ends; some variety; simple punctuation and spelling mostly right."],
      ["1–4", "Sentence ends sometimes missing; little variety; frequent spelling errors."]];
    // The two scales side by side, so they fit under a model answer
    const exWritingLevels = () => `<div class="ex-cols ex-wlevels">${[EX_WRITING_LEVELS.slice(0, 5), EX_WRITING_LEVELS.slice(5)].map(band => `<table class="ex-levels">${band.map(([m, d]) => d ? `<tr><th>${m}</th><td>${d}</td></tr>` : `<tr><th colspan="2" class="ex-band">${m}</th></tr>`).join("")}</table>`).join("")}</div>`;

    // ---------- An exam practice sheet for each topic (stages 1 to 3, then Literature) ----------
    EX.stagesOf(EC).forEach(st => st.topics.forEach(t => {
      const w = t.written, on = exTextsOf(w), where = st.optional ? "English Literature" : `Stage ${st.n}, topic ${t.n} of ${st.topics.length}`;
      const nQuick = on.length > 1 ? 3 : on.length ? 4 : w.given ? 4 : 5;
      add(`paper-ex-${t.id}`, EX_LESSON(t.id), `English exam practice ${st.optional ? "(Literature)" : `${st.n}.${t.n}`}: ${t.title}`,
        `${on.length ? `${on.length > 1 ? "Two texts" : "A text"} to read, ` : ""}${nQuick} quick questions, then an exam-style question (${t.paper}). The answers page has the reasons, what to look for, the marking levels and a model answer.`, (who, h) => {
          const quick = exPick(t, on, nQuick);
          return {
            pupil: `${h.sheetHead(`Exam practice: ${t.title}`, who)}${exStrip(where, t.paper, 0)}
              ${exTexts(on)}
              <p class="ex-h"><b>Quick questions</b> Tick one answer each.</p>
              <div class="ex-quick">${quick.map((it, i) => exQuick(it, i + 1, on)).join("")}</div>
              <p class="ex-h"><b>Exam question</b></p>${exWritten(w, quick.length + 1)}`,
            answers: answersPage(h, `Exam practice: ${t.title}`, quick.map(exQuickAns), "Quick questions: the answer, and why.", exWrittenAns(w, quick.length + 1))
          };
        });
    }));

    // ---------- Each stage: the check, the tracker, what the exam expects, the writing tasks and the mini papers ----------
    EC.STAGES.forEach(st => {
      const tag = `grade${st.n === 1 ? " 1 to 3" : st.n === 2 ? "s 4 and 5" : "s 6 to 9"}`;
      const L = slug => EX_LESSON(`${st.key}-${slug}`);
      const writing = EC.WRITING.filter(w => w.id.startsWith(`${st.key}-`));
      const minis = EC.MINI.filter(m => m.id.startsWith(`${st.key}-`));

      add(`paper-ex-${st.key}-check`, L("start-here"), `GCSE English climb: stage ${st.n} check (${tag})`,
        `One question on each of the ${st.topics.length} stage ${st.n} topics, in the order of the climb, with the reasons on the answers page. It shows which topics to work on first.`, (who, h) => {
          const items = st.topics.map(t => shuffle(t.items.filter(it => exUsable(it, [])))[0]);
          return {
            pupil: `${h.sheetHead(`Stage ${st.n} check`, who)}${exStrip(st.title, "About 15 minutes", items.length)}
              <p class="gx-intro">Tick one answer for each question. A question you can't do yet is useful to know, not a fail: leave it and move on.</p>
              ${items.map((it, i) => `<div class="ex-check"><p class="ex-topic">${it.topic.n}. ${exEsc(it.topic.short)}</p>${exQuick(it, i + 1, [])}</div>`).join("")}`,
            answers: `${answersPage(h, `Stage ${st.n} check`, items.map(it => `<b>${it.topic.n}. ${exEsc(it.topic.short)}</b>: ${exQuickAns(it)}`), "One mark each. Put ✓ or ✗ beside each topic on the stage tracker.")}
              <p class="gx-note"><b>What to work on first:</b> the topics marked ✗, in the climb's order. One question is a quick look, not a verdict: a topic marked ✓ still gets its exam practice sheet before it's ticked off. The online stage check asks ${st.n === 1 ? "two questions" : "one question"} a topic and marks itself.</p>`
          };
        });

      add(`paper-ex-${st.key}-tracker`, L("start-here"), `GCSE English climb: stage ${st.n} tracker (${tag})`,
        `One page to plan and track stage ${st.n}: each topic's check, lesson, online practice and exam sheet, the two writing tasks and the mini papers.`, (who, h) => ({
          pupil: `${h.sheetHead(`Road to grade ${st.target}: tracker`, who)}${exStrip(st.title, "Keep this with the pupil's work", 0)}
            <p class="gx-plan">Exam date: ${blank(7)} &nbsp; Exam board: ${blank(5)} &nbsp; Sessions a week: ${blank(3)} &nbsp; Target grade: <b>${st.n === 1 ? "3 (or 4)" : st.n === 2 ? "4, then 5" : "6 and up"}</b></p>
            ${exTrack(st.topics.map(t => `${t.n}. ${exEsc(t.title)}`))}
            <table class="gx-track gx-papers"><thead><tr><th>Writing task or mini paper</th><th>Date</th><th>Self-check ✓</th><th>Marks</th><th>What to work on next</th></tr></thead>
            <tbody>${writing.map(w => `${w.kind}: ${exEsc(w.q.length > 60 ? `${w.q.slice(0, 57)}…` : w.q)}`).concat(minis.map(m => exEsc(m.title))).map(r => `<tr><td>${r}</td>${'<td class="gx-cell"></td>'.repeat(4)}</tr>`).join("")}</tbody></table>
            <p class="gx-plan"><b>Secure</b> means about three-quarters of the online practice right, and the exam sheet's question answered at the level the answers page describes for ${st.goal}.</p>`,
          answers: lookForPage(h, `Road to grade ${st.target}: tracker`, [
            "Plan with the stage check: start with the topics marked ✗, in the climb's order. Reading topics and writing topics alternate well: one of each a session.",
            "Each topic: the lesson, then the online practice (aim for 75% or more), then the exam practice sheet. Mark its exam question with the levels on the answers page, then compare with the model together.",
            "The two writing tasks are the most valuable work of the stage: the writing question is half of each paper. Do each one, timed, after the writing topics.",
            "Then the mini papers. A mini paper at about 60% or more, and both writing tasks ticked off on the self-check, means the stage is done.",
            "Marks here come from PopSpell's work and your marking. They are a guide for planning, not a predicted grade."])
        }));

      const grade = EC.GRADES[st.n - 1];
      add(`paper-ex-${st.key}-expects`, L("start-here"), `What the exam expects: English ${tag}`,
        `What ${st.goal} takes in GCSE English Language, in reading and in writing: the questions to aim at, how answers are marked in levels, and the stage's writing checklist.`, (who, h) => ({
          pupil: `${h.sheetHead(`What the exam expects: ${tag}`, who)}${exStrip(st.title, "Read, then talk it through", 0)}
            ${box(`What ${grade[0].toLowerCase()} looks like`, `<p>${exEsc(grade[1]).replace("Writing:", "<br><b>Writing:</b>").replace("Reading:", "<b>Reading:</b>")}</p>`)}
            ${box("This stage", `<p>${exEsc(st.about)} The topics: ${st.topics.map(t => exEsc(t.short.toLowerCase())).join(", ")}.</p>
              ${st.n === 1 ? "<p>A grade 3 does not need every question. Questions 1 and 2 on each paper are quick marks for careful reading, and the writing question is half the paper: clear, accurate writing in paragraphs is the biggest step to a 3 or 4.</p>"
                : st.n === 2 ? "<p>Grades 4 and 5 are won on the analysis questions (how does the writer…?) and on writing that is organised and varied. Every point needs a short quotation and an explanation of its effect.</p>"
                : "<p>Grades 6 to 9 are won with a judgement: why the writer chose this, how it shapes the whole text, and how well it works. In writing, every choice is deliberate.</p>"}`)}
            ${box("Reading answers are marked in levels", `<p>An 8-mark question is marked like this (longer questions use the same steps, with more marks):</p>${exLevels(EC.LEVELS_8)}`)}
            ${box("The writing question: 40 marks on each paper", `<p>${exEsc(EC.EXAM.writing)} For ${st.goal}, check your writing for:</p>
              <div class="ex-cols">${exTicks(EC.CHECK[st.key].content)}${exTicks(EC.CHECK[st.key].accuracy)}</div>`)}`,
          answers: lookForPage(h, `What the exam expects: ${tag}`, [
            `Read the "${grade[0]}" box together and ask the pupil to put it in their own words: what does their reading need, and their writing?`,
            "Look at the 8-mark levels. Take an answer the pupil wrote recently and decide together which level it reaches, and what would lift it one level.",
            "The writing checklist is the same one on the stage's writing task sheets and on the My next step page. Use it before every piece of writing is handed in.",
            "Exam facts are AQA's GCSE English Language papers, the most widely sat. Edexcel and OCR test the same skills with their own question numbers: check the board's specification.",
            "Grade descriptions here are PopSpell's plain-words summary, not the board's own wording."])
        }));

      writing.forEach(w => {
        const check = EC.CHECK[st.key];
        add(`paper-ex-write-${w.id}`, L("writing"), `English writing task: ${w.kind.toLowerCase()} (${tag})`,
          `${w.paper}, ${w.minutes} minutes: plan, write, then check against the stage's list. The answers page has a model answer with notes and the two marking scales.`, (who, h) => ({
            pupil: `${h.sheetHead(`Writing task: ${w.kind.toLowerCase()}`, who)}${exStrip(`${st.title}, aiming at ${w.grade}`, `${w.paper} · ${w.minutes} minutes`, 40)}
              ${box("The task", `<p class="ex-big">${exEsc(w.q)}</p><p><i>(40 marks: 24 for content and organisation, 16 for accuracy)</i></p>`)}
              ${box("Plan (5 minutes)", `<ol class="ex-plan">${w.plan.map(p => `<li>${exEsc(p)}</li>`).join("")}</ol><div class="pp-draw ex-planbox"></div>`)}
              <p class="ex-more"><b>Write (about 30 minutes)</b> on lined paper, or on the My next step page. Then <b>check (5 minutes)</b>: tick each line you can honestly tick, and fix what you can't.</p>
              <div class="ex-cols ex-self">${exTicks(check.content)}${exTicks(check.accuracy)}</div>`,
            answers: `${h.brandHead(`Model and marking: ${w.kind.toLowerCase()}`, "For the adult, not the pupil.")}
              ${exModel(`A model answer, about ${w.grade}`, w.model)}
              <p class="ex-sub">Why it works</p>${exList(w.notes)}
              <p class="ex-sub">How writing is marked (both papers)</p>${exWritingLevels()}
              <p class="gx-note">Mark content and organisation first, then accuracy. Find the level that fits best, then go up or down within it. Talk about one thing that would lift it, not ten.</p>`
          }));
      });

      minis.forEach(m => {
        const on = m.texts || (m.t ? [m.t] : []);
        // The parts of a mini paper, as questions: a written question of its own, a topic's question (ref),
        // true-or-false statements (tf), or a writing task (write)
        const parts = m.parts.map(p => {
          if (p.ref) { const w = EX.topic(p.ref).written; return { kind: "read", ref: p.ref, q: w.q, marks: w.marks, minutes: p.minutes, w, texts: exTextsOf(w) }; }
          if (p.write) { const w = EC.WRITING.find(x => x.id === p.write); return { kind: "write", q: w.q, marks: 40, minutes: p.minutes, writing: w }; }
          if (p.tf) return { kind: "tf", q: `Read “${EX.text(p.tf).title}” again. Choose four statements below that are TRUE. Tick the boxes of the ones you think are true; choose a maximum of four.`, marks: 4, minutes: p.minutes, statements: p.statements };
          return { kind: "read", q: p.q, marks: p.marks, minutes: p.minutes, w: p, texts: p.texts || (p.t ? [p.t] : []) };
        });
        const total = parts.reduce((s, p) => s + p.marks, 0);
        add(`paper-ex-${m.id}`, L("mini-papers"), `${m.title} (${tag})`,
          `An hour, like one paper cut down: ${parts.map(p => `${p.marks} marks`).join(", ")}. Answers on lined paper; the answers page has what to look for, the levels and models.`, (who, h) => ({
            pupil: `${h.sheetHead(m.title.replace("Mini paper: ", "Mini paper, "), who)}${exStrip(st.title, `${m.minutes} minutes · answer on lined paper`, total)}
              ${exTexts(on)}
              ${parts.map((p, i) => `<div class="pp-q ex-mq"><p><b>${i + 1}.</b> ${exEsc(p.q)} <span class="gx-mk">(${exMk(p.marks)}, about ${p.minutes} minutes)</span></p>
                ${p.kind === "tf" ? `<p class="ex-opts ex-tf">${p.statements.map(([s], j) => `<span>☐ ${String.fromCharCode(65 + j)}. ${exEsc(s)}</span>`).join("")}</p>` : ""}
                ${p.kind === "write" ? `<p class="ex-tip">Plan for 5 minutes. Check for the last 5.</p>` : ""}</div>`).join("")}`,
            answers: `${h.brandHead(`Mark scheme: ${m.title}`, "For the adult, not the pupil.")}
              <p>Total ${total} marks. Pass mark for the climb: about 60%. Note each part's marks on the stage tracker.</p>
              <div class="ex-mini">${parts.map((p, i) => p.kind === "tf" ? `<div class="ex-ans-part"><p class="ex-h"><b>${i + 1}. True statements, 4 marks</b></p><p>${p.statements.map(([, ok], j) => ok ? String.fromCharCode(65 + j) : "").filter(Boolean).join(", ")}. One mark for each true statement ticked. More than four ticked: mark only the first four.</p></div>`
                : p.kind === "write" ? `<div class="ex-ans-part"><p class="ex-h"><b>${i + 1}. Writing, 40 marks</b></p><p>Mark with the two writing scales: 24 for content and organisation, 16 for accuracy. The task's own sheet ("English writing task: ${exEsc(p.writing.kind.toLowerCase())}") has a model answer and the scales in full.</p></div>`
                : exWrittenAns(Object.assign({}, p.w, { q: p.q, marks: p.marks }, p.ref ? { model: "" } : {}), i + 1)
                  + (p.ref ? `<p class="ex-tip">A model answer is on the answers page of "${exEsc(EX.topic(p.ref).title)}" (English exam practice ${EX.topic(p.ref).stage.n}.${EX.topic(p.ref).n}).</p>` : "")).join("")}</div>`
          }));
      });
    });

    // ---------- The whole exam in a page, and a route for a pupil working alone ----------
    add("paper-ex-exam", EX_LESSON("e1-start-here"), "GCSE English Language: the exam in a page",
      "Both papers at a glance: what each question asks, its marks and how long to spend, plus what grades 3, 5 and 7 look like.", (who, h) => ({
        pupil: `${h.sheetHead("GCSE English Language: the exam", who)}${exStrip("All stages", "Read, then keep it in your folder", 0)}
          ${EC.EXAM.papers.map(p => box(`${exEsc(p.name)} (${p.time}, ${p.marks} marks)`, `<p><i>${exEsc(p.text)}</i></p>
            <table class="ex-paper"><thead><tr><th>Q</th><th>What it asks</th><th>Marks</th><th>Time</th></tr></thead><tbody>${p.qs.map(([n, what, mk, time]) => `<tr><td>${n}</td><td>${exEsc(what)}</td><td>${mk}</td><td>${time}</td></tr>`).join("")}</tbody></table>`)).join("")}
          ${box("Good to know", `<p>${exEsc(EC.EXAM.reading)} ${exEsc(EC.EXAM.writing)}</p><p>${exEsc(EC.EXAM.spoken)}</p>`)}
          ${box("What the grades look like", `<table class="ex-levels">${EC.GRADES.map(([g, d]) => `<tr><th>${g}</th><td>${exEsc(d)}</td></tr>`).join("")}</table>`)}`,
        answers: lookForPage(h, "GCSE English Language: the exam", [
          "These are AQA's two papers, the most widely sat. " + EC.EXAM.boards,
          "Ask the pupil: which question carries the most marks on each paper? (The writing, 40 marks: half the paper.) How long should question 1 take? (About 5 minutes: it's 4 marks.)",
          "A common way to lose marks is spending 30 minutes on a 4-mark question and rushing the writing. Practise to the times in the tables.",
          "Grade descriptions are PopSpell's plain-words summary, not the board's own wording. Check the board's website for this year's dates."])
      }));

    add("paper-ex-route", EX_LESSON("my-next-step"), "GCSE English climb: my route from grade 1 to 9",
      "One page for a pupil working on their own (at home, or homeschooled): the three stages, what to do each session, marking your own answers against the levels and models, and when to move on.", (who, h) => ({
        pupil: `${h.sheetHead("My route: GCSE English, grade 1 to 9", who)}${exStrip("GCSE English climb", "Self-guided", 0)}
          ${box("The three stages", `${EC.STAGES.map(s => `<p><b>${exEsc(s.title)}.</b> ${exEsc(s.about)}</p>`).join("")}<p>Start where your stage check says. You don't have to go to the top: a 4 for college is a fine place to stop.</p>`)}
          ${box("Each session (about 45 minutes)", `<p><b>1.</b> Open <b>popspell.com/english-climb.html</b> and press <b>My next step</b>. <b>2.</b> Do what it says: the stage check, a topic's questions, a writing task, or a mini paper. <b>3.</b> Read the reason after every question, even when you were right. <b>4.</b> For written answers, compare yours with the levels and the model: which level is yours at, and what one thing would lift it?</p>`)}
          ${box("Reading every day", `<p>Ten minutes a day of anything well written (a news article, a novel, a long read online) does more for your reading marks than any trick. Pick one sentence a day and ask: why did the writer choose that word?</p>`)}
          ${box("When to move on", `<p>A topic is <b>secure</b> when you get about three-quarters of a set of its questions right. When a stage's topics are secure and you've done its two writing tasks, take a mini paper. About 60% or more? Start the next stage.</p>`)}
          <p class="gx-plan">My exam date: ${blank(7)} &nbsp; My exam board: ${blank(5)} &nbsp; My target grade: ${blank(3)} &nbsp; Stage I'm on: ${blank(3)}</p>`,
        answers: lookForPage(h, "My route: GCSE English, grade 1 to 9", [
          "For the adult at home: the climb page keeps progress on this device only, in this browser. Nothing is sent anywhere, so use the same device each time.",
          "Once a week, ask to see one piece of writing and the self-check list beside it. Ask which line of the list was hardest to tick.",
          "Written answers can't mark themselves. The levels and model answers make self-marking honest, but a teacher or tutor's look at the writing tasks now and then is worth a lot.",
          "If a topic stays below half its questions right after three sessions, it needs teaching, not more practice: use the topic's lesson in PopSpell's library, or ask a tutor.",
          "Scores are a guide for planning, not a predicted grade."])
      }));
  }
