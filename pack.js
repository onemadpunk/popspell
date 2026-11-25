/* Maths packs to download (pack.html): every sheet for one stage of a climb in one printable pack, for a
   pupil working at home without a login or the internet. The page builds the pack in the browser from
   the same sheets the teacher prints (paper-sheets.js), fits each page to A4 (sheet-print.js), and the
   browser's print window saves it as a PDF. Nothing is stored on the server and nothing is sent anywhere.

   A pack is: a cover with a plan to tick off, then the stage's sheets in study order (what to read, the
   check, the tracker, a sheet for each topic, the mini papers), then the answers and mark schemes at the
   back. Every page carries the pack's code, because each pack has new numbers and its answers only
   match pages with the same code.

   PACKS lists the climbs. Another climb (for example Scotland's National 5 and Higher) joins with one
   more add({...}) below: each stage names its sheet ids from paper-sheets.js, in the order to work
   through them, and the page, the plan and the answers section follow from those. */
window.PopPacks = (() => {
  "use strict";
  const K = window.PopSheetPrint, PAPER = window.PopPaper, X = () => window.PopActivities.examBank;
  const esc = K.esc;
  const $ = id => document.getElementById(id);
  const app = $("app");
  // The kit the sheets are built with, as in the teacher area (the climb's sheets use only the header)
  const kit = { sheetHead: K.sheetHead, brandHead: K.brandHead, handwritingRow: () => "", esc, phonicsWords: () => [] };
  const CLASS = "ws-activity";

  // ---------- The packs ----------
  // Each stage: read (sheets to read first), check, tracker, topics, papers: sheet ids, in study order.
  // secure and pass are what the plan asks for; next says where the pupil goes after the stage.
  const PACKS = [];
  const add = pack => { PACKS.push(pack); return pack; };
  const gcseTopics = n => X().STAGES[n - 1].topics.map(t => `paper-gx-${n === 1 ? t.id.replace(/^gf-/, "") : t.id}`);
  add({
    id: "gcse", title: "GCSE maths climb", where: "England, GCSE (9 to 1)", online: "climb.html",
    stages: () => [
      { id: "gcse-1", title: "Stage 1: Foundation, grade 1 to 3", short: "Grade 1 to 3", about: "Number, fractions, percentages, ratio, basic algebra, shape and data: the Foundation topics that carry most marks at grades 1 to 3.",
        read: ["paper-gx-route", "paper-gx-expects", "paper-gx-command-words", "paper-gx-calculator"], check: "paper-gx-baseline", tracker: "paper-gx-tracker",
        topics: gcseTopics(1), papers: ["paper-gx-mini-noncalc", "paper-gx-mini-calc", "paper-gx-mini-problems"], next: "stage 2 (grades 4 and 5)" },
      { id: "gcse-2", title: "Stage 2: grades 4 and 5", short: "Grades 4 and 5", about: "What Foundation and Higher share: standard form, percentage change, simultaneous equations, Pythagoras, trigonometry, tree diagrams and more.",
        read: ["paper-gx-route", "paper-gx-g5-expects"], check: "paper-gx-g5-check", tracker: "paper-gx-g5-tracker",
        topics: gcseTopics(2), papers: ["paper-gx-g5-mini-noncalc", "paper-gx-g5-mini-calc", "paper-gx-g5-mini-problems"], next: "stage 3 (Higher), if you're sitting the Higher tier" },
      { id: "gcse-3", title: "Stage 3: Higher, grades 6 to 9", short: "Higher, grades 6 to 9", about: "Surds, quadratics, functions, circle theorems, the sine and cosine rules, vectors, histograms and proof.",
        read: ["paper-gx-route", "paper-gx-gh-expects"], check: "paper-gx-gh-check", tracker: "paper-gx-gh-tracker",
        topics: gcseTopics(3), papers: ["paper-gx-gh-mini-noncalc", "paper-gx-gh-mini-calc", "paper-gx-gh-mini-problems"], next: "" }
    ]
  });
  // The GCSE English climb (exam-english/, PopEnglishExam): only on pages that load its bank. Written
  // answers can't be marked line by line, so its plan and marking notes are its own (words below).
  const EN = () => window.PopEnglishExam && window.PopEnglishExam.course("gcse");
  if (EN()) add({
    id: "english", title: "GCSE English climb", where: "England, GCSE English Language", online: "english-climb.html",
    words: {
      work: "Read the text first, then answer. For the exam question, every point needs a short quotation and what it shows.",
      again: "Not secure yet? Compare your answer with the levels and the model answer at the back, then try the exam question again a few days later.",
      papers: "Do each writing task in 45 minutes, then check it against its list. Then the mini papers, an hour each.",
      pass: "About 60% or more",
      paperTodo: "An hour, like the real exam. Plan the writing for 5 minutes and check it for the last 5.",
      writeTodo: "45 minutes: plan, write on lined paper, then tick the checklist honestly.",
      topicTodo: "Tick the quick questions, then write the exam answer. Mark it with the levels at the back; three-quarters of the quick questions and a good level makes it secure.",
      marking: "Quick questions have one right answer and a reason. Written answers are marked in levels: find the level that fits best, then compare with the model answer. Writing is marked out of 40: 24 for content and organisation, 16 for accuracy."
    },
    stages: () => EN().STAGES.map(st => ({
      id: `english-${st.n}`, title: st.title, short: `English ${st.goal}`, about: st.about,
      read: ["paper-ex-route", ...(st.n === 1 ? ["paper-ex-exam"] : []), `paper-ex-${st.key}-expects`], check: `paper-ex-${st.key}-check`, tracker: `paper-ex-${st.key}-tracker`,
      topics: st.topics.map(t => `paper-ex-${t.id}`),
      papers: EN().WRITING.filter(w => w.id.startsWith(`${st.key}-`)).map(w => `paper-ex-write-${w.id}`).concat(EN().MINI.filter(m => m.id.startsWith(`${st.key}-`)).map(m => `paper-ex-${m.id}`)),
      next: st.n < 3 ? `stage ${st.n + 1} (${EN().STAGES[st.n].goal})` : "" }))
  });
  // Scotland's SQA English climb (National 4 skills, National 5, Higher): the same shape, SQA's marking
  const SQ = () => window.PopEnglishExam && window.PopEnglishExam.course("sqa");
  if (SQ()) add({
    id: "english-sqa", title: "SQA English climb", where: "Scotland, National 5 and Higher English", online: "english-climb.html?course=sqa",
    words: {
      work: "Read the passage first, then answer. Every analysis point needs a reference (a short quotation) and a comment on it.",
      again: "Not secure yet? Count your marks with the marking at the back and compare with the model answer, then try the exam question again a few days later.",
      papers: "Draft each folio task, check it against its list, and redraft once. Then the mini papers, timed.",
      pass: "About 60% or more",
      paperTodo: "Timed, like the real exam: about a minute a mark.",
      writeTodo: "Plan, draft on lined paper, tick the checklist honestly, then redraft once.",
      topicTodo: "Tick the quick questions, then write the exam answer. Count its marks with the marking at the back; three-quarters of the quick questions and good marks makes it secure.",
      marking: "Quick questions have one right answer and a reason. Analysis answers get up to 2 marks for each reference with its comment: a quotation alone gets nothing. The Scottish text's last question is out of 10, the critical essay out of 20 and each folio piece out of 15."
    },
    stages: () => SQ().STAGES.map(st => ({
      id: `english-sqa-${st.n}`, title: st.title, short: st.n === 1 ? "National 4 skills" : st.goal, about: st.about,
      read: ["paper-ex-sqa-route", ...(st.n === 2 ? ["paper-ex-sqa-exam"] : []), `paper-ex-${st.key}-expects`], check: `paper-ex-${st.key}-check`, tracker: `paper-ex-${st.key}-tracker`,
      topics: st.topics.map(t => `paper-ex-${t.id}`),
      papers: SQ().WRITING.filter(w => w.stage === st.key).map(w => `paper-ex-write-${w.id}`).concat(SQ().MINI.filter(m => m.id.startsWith(`${st.key}-`)).map(m => `paper-ex-${m.id}`)),
      next: st.n < 3 ? `stage ${st.n + 1} (${SQ().STAGES[st.n].goal})` : "" }))
  });
  const allStages = () => PACKS.flatMap(p => p.stages().map(st => Object.assign({ pack: p }, st)));
  const sheetsOf = st => [...st.read, st.check, st.tracker, ...st.topics, ...st.papers];

  // ---------- Making a pack ----------
  const code = () => {
    const d = new Date(), pad = n => String(n).padStart(2, "0");
    return `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  };
  const stamp = (html, line) => html.replace("</header>", `</header><p class="ws-code">${line}</p>`);
  // What each part asks the pupil to do, for the plan
  const todo = (st, id) => st.pack.words && st.topics.includes(id) ? st.pack.words.topicTodo
    : st.pack.words && st.papers.includes(id) ? (/-write-/.test(id) ? st.pack.words.writeTodo : st.pack.words.paperTodo)
    : id === st.check ? "Do it on your own, then mark it with its answers at the back. Copy the marks onto the tracker."
    : id === st.tracker ? "Keep it at the front. Fill it in as you go."
    : st.read.includes(id) ? (id === st.read[0] ? "Read it and fill in your exam date and target." : /calculator|command/.test(id) ? "Read the tips, then do the questions." : "Read it, then talk it through with an adult.")
    : st.papers.includes(id) ? "Like the real exam: about 20 minutes. Half the marks or more is a good paper."
    : "Show your working. Three-quarters of the marks makes the topic secure: tick it on the tracker.";

  function make(st, who) {
    const c = code(), ids = sheetsOf(st).filter(id => PAPER.get(id));
    const parts = ids.map((id, i) => {
      const sh = PAPER.get(id), b = sh.build(who, kit), n = i + 1;
      const plain = sh.title.replace(/^(GCSE|SQA) (maths|English) climb: /, "").replace(/ \((grades 4 and 5|Higher|grade 1 to 3|grades 6 to 9)\)/, ""), title = plain[0].toUpperCase() + plain.slice(1);
      return { id, n, title, todo: todo(st, id),
        work: K.ageLook(stamp(b.pupil, `Pack ${c} · Part ${n} of ${ids.length}`), "older"),
        answers: b.answers ? stamp(b.answers, `Pack ${c} · Answers for part ${n}: ${esc(title)}`) : "" };
    });
    return { st, code: c, who, parts, cover: cover(st, c, parts, who), divider: divider(st, c, parts) };
  }

  function cover(st, c, parts, who) {
    const w = st.pack.words || {};
    const first = parts.find(p => st.topics.includes(p.id));
    const check = parts.find(p => p.id === st.check);
    const papers = parts.filter(p => st.papers.includes(p.id));
    const row = p => `<tr><td class="pk-n">${p.n}</td><td><b>${esc(p.title)}</b><br><span class="pk-what">${esc(p.todo)}</span></td><td class="pk-tick">☐</td><td></td><td></td></tr>`;
    return `${K.sheetHead(`${st.pack.title}: my pack`, who)}<p class="ws-code">Pack ${c} · ${esc(st.title)}</p>
      <div class="pk-how"><b>How to use this pack</b>
        <ol><li>Start with part 1: where you're heading, and how long you have.</li>
          <li>Do the check (part ${check ? check.n : ""}) on your own. Mark it with the answers at the back: they're for the adult, or for you once a part is finished.</li>
          <li>Work through the topics from part ${first ? first.n : ""}, in order, but do the ones that lost marks in the check first. ${w.work || "Show every step: the marks are for the working."}</li>
          <li>${w.again || "Not secure yet? Read the mark scheme, then do the questions you lost again a few days later. Make a new pack for fresh numbers."}</li>
          <li>When every topic is ticked: ${w.papers ? `${w.papers} (parts ${papers.map(p => p.n).join(", ")})` : `do the mini papers (parts ${papers.map(p => p.n).join(", ")}).`}${st.next ? ` ${w.pass || "About half the marks"} or more: you're ready for ${esc(st.next)}.` : ""}</li></ol>
        <p>The answers only match pages with the same pack code, <b>${c}</b>. Online, <b>popspell.com/${esc(st.pack.online)}</b> marks your answers and picks your next step.</p></div>
      <table class="pk-plan"><thead><tr><th>Part</th><th>My plan: tick off as you go</th><th>Done</th><th>Date</th><th>Marks</th></tr></thead>
        <tbody>${parts.map(row).join("")}</tbody></table>`;
  }
  function divider(st, c, parts) {
    const with_ = parts.filter(p => p.answers);
    return `${K.brandHead("Answers and mark schemes", `${esc(st.pack.title)}: ${esc(st.title)}. For the adult, or for marking a part once it's finished.`)}<p class="ws-code">Pack ${c}</p>
      <div class="pk-how"><b>Marking like an examiner</b>
        <p>${st.pack.words ? st.pack.words.marking : "Each answer shows where the marks come from. Give the method marks for each right step of working, even when the final answer is wrong. A right answer with no working gets full marks; a wrong answer with no working gets none."}</p>
        <p>Keep these pages apart from the work, and look only after a part is finished. These answers match pack <b>${c}</b> only.</p></div>
      <table class="pk-plan"><thead><tr><th>Part</th><th>Answers in this section</th></tr></thead>
        <tbody>${with_.map(p => `<tr><td class="pk-n">${p.n}</td><td>${esc(p.title)}</td></tr>`).join("")}</tbody></table>`;
  }
  // The pages to print: "all" (the work, then the answers), "work" or "answers"
  const pagesOf = (made, which) => [
    ...(which === "answers" ? [] : [made.cover, ...made.parts.map(p => p.work)]).map(h => `<div class="ws-page">${h}</div>`),
    ...(which === "work" ? [] : [made.divider, ...made.parts.filter(p => p.answers).map(p => p.answers)]).map(h => `<div class="ws-page ws-adult">${h}</div>`)
  ];

  // ---------- Printing, or saving as PDF ----------
  const fonts = document.fonts ? Promise.all(["16px Nunito", "700 16px Nunito", "16px Andika", "700 16px Andika"].map(f => document.fonts.load(f).catch(() => null))) : Promise.resolve();
  let made = null, printing = null;
  async function printPages(which) {
    if (!made) return;
    const sheet = document.createElement("section");
    sheet.className = `worksheet-print ${CLASS}`;
    sheet.innerHTML = pagesOf(made, which).join("");
    document.body.append(sheet);
    document.body.classList.add("printing-worksheet");
    printing = sheet;
    await Promise.all([...sheet.querySelectorAll("img")].map(img => (img.complete ? null : new Promise(r => { img.onload = img.onerror = r; }))));
    await fonts;
    if (document.fonts) await document.fonts.ready;
    K.fitPages(sheet, CLASS);
    document.title = `${made.st.pack.title} ${made.st.short} pack ${made.code}${which === "work" ? " (work)" : which === "answers" ? " (answers)" : ""}`;
    window.print();
  }
  window.addEventListener("afterprint", () => {
    if (printing) printing.remove();
    printing = null;
    document.body.classList.remove("printing-worksheet");
    document.title = "Maths packs to download · PopSpell";
  });
  // Ctrl+P on this page prints the whole pack, not the page around it
  window.addEventListener("beforeprint", () => {
    if (printing || !made) return;
    const sheet = document.createElement("section");
    sheet.className = `worksheet-print ${CLASS}`;
    sheet.innerHTML = pagesOf(made, "all").join("");
    document.body.append(sheet);
    document.body.classList.add("printing-worksheet");
    printing = sheet;
    K.fitPages(sheet, CLASS);
  });

  // ---------- The page ----------
  let chosen = null;
  try { chosen = new URLSearchParams(location.search).get("stage"); } catch { /* none */ }
  function render() {
    const stages = allStages();
    if (!stages.some(st => st.id === chosen)) chosen = stages[0].id;
    const st = stages.find(s => s.id === chosen);
    const count = made && made.st.id === st.id ? made.parts.length : sheetsOf(st).filter(id => PAPER.get(id)).length;
    app.innerHTML = `<header class="pk-top"><a class="pk-brand" href="./"><img src="assets/brand/app-icon-192.png" alt="" width="32" height="32"><span>PopSpell</span></a>
        <span class="pk-crumb">Exam packs to download</span><a class="pk-link" href="${esc(st.pack.online)}">${esc(st.pack.title)} online →</a></header>
      <main class="pk-main">
        <section class="pk-intro">
          <h1>Download an exam pack</h1>
          <p>Everything for one stage on paper, to work on at home with no login and no internet: a plan to tick off, a check, a tracker, exam-style practice on every topic, mini papers, and the answers and mark schemes at the back. Each pack has new questions.</p>
        </section>
        ${PACKS.map(p => `<section class="pk-pack"><h2>${esc(p.title)} <span>${esc(p.where)}</span></h2>
          <div class="pk-stages" role="radiogroup" aria-label="${esc(p.title)} stage">${p.stages().map(s => `<button class="pk-stage${s.id === chosen ? " on" : ""}" role="radio" aria-checked="${s.id === chosen}" data-stage="${s.id}">
            <b>${esc(s.title)}</b><span>${esc(s.about)}</span></button>`).join("")}</div></section>`).join("")}
        <section class="pk-make">
          <label class="pk-who">Name on the sheets (optional) <input id="who" maxlength="40" autocomplete="off" value="${esc((made && made.who) || "")}"></label>
          <button class="pk-btn primary" id="make">${made && made.st.id === st.id ? "Make a new pack (new questions)" : `Make the ${esc(st.short)} pack`}</button>
          ${made && made.st.id === st.id ? `<div class="pk-ready" aria-live="polite">
            <p><b>Pack ${made.code} is ready:</b> ${made.parts.length} parts, ${made.parts.filter(p => p.answers).length} answer pages. In the print window, choose <b>Save as PDF</b> as the printer to download it, with A4 paper and the default margins.</p>
            <div class="pk-do"><button class="pk-btn primary" data-print="all">Save or print the whole pack</button>
              <button class="pk-btn" data-print="work">Just the work</button><button class="pk-btn" data-print="answers">Just the answers</button></div>
            <p class="pk-small">Printing the work and the answers separately? Use the same pack for both, so the codes match.</p></div>`
            : `<p class="pk-small">${count} parts, about ${count * 2 + 2} A4 pages with the answers. It takes a few seconds to make.</p>`}
        </section>
        <p class="pk-foot">Questions are PopSpell's own, in the exam's style, not past papers. Nothing you type here is saved or sent anywhere.</p>
      </main>`;
    app.querySelectorAll("[data-stage]").forEach(b => b.onclick = () => { chosen = b.dataset.stage; render(); });
    $("make").onclick = async () => {
      const btn = $("make");
      btn.disabled = true; btn.textContent = "Making your pack…";
      await new Promise(r => setTimeout(r, 30));
      made = make(st, $("who").value.trim());
      render();
      const first = app.querySelector("[data-print]");
      if (first) first.focus();
    };
    app.querySelectorAll("[data-print]").forEach(b => b.onclick = () => printPages(b.dataset.print));
  }

  if (app) render();
  return { add, PACKS, stages: allStages, make, pagesOf, sheetsOf };
})();
