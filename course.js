/* Tutor courses to print (course.html): a whole course for one pupil, session by session, made in the
   browser and saved as PDFs from the print window. Nothing is stored or sent anywhere.

   The plan and the tutor's notes are in course-data.js. This file makes the pages:
     - the front: a tutor's guide, the course plan (with dates, when a first date is given) and the
       pupil's tracker (topics, sessions, mock results)
     - for each session: the tutor's plan, the pupil's sheets, and the answers with mark schemes.
       Teaching sessions draw their questions from the GCSE climb's bank (PopActivities.examBank) by
       the skills the session teaches: a starter from earlier sessions, a worked example, practice,
       an exam question and an exit ticket. Progress checks and full-length mock papers (80 marks
       each, like the real Foundation papers) are drawn from the bank too. Some sessions use the
       climb's existing sheets (paper-sheets.js): the baseline, what the exam expects, command words,
       calculator skills and the mini papers.
   Every page carries the course code: a made course has its own numbers, and its answers match only
   pages with the same code. Pages are filled block by block and measured, so a long sheet runs on to
   a second A4 page instead of shrinking, then sheet-print.js fits each page to A4 as everywhere else. */
window.PopCourse = (() => {
  "use strict";
  const K = window.PopSheetPrint, PAPER = window.PopPaper, X = () => window.PopActivities.examBank, DATA = window.PopCourseData;
  const esc = K.esc;
  const rand = n => Math.floor(Math.random() * n);
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const kit = { sheetHead: K.sheetHead, brandHead: K.brandHead, handwritingRow: () => "", esc, phonicsWords: () => [] };
  const CLASS = "ws-activity";
  const mk = n => `${n} mark${n > 1 ? "s" : ""}`;
  const blank = (w = 6) => `<span class="ws-blank" style="width:${w}em"></span>`;
  const UNIT = / \((£|°C|°|cm²|cm³|cm|g|km|m|degrees|minutes|mph|miles|km\/h|m\/s|g\/cm³|N\/m²|ml|litres|days|years|m²|square units|%)\)$/;
  const block = (html, cls = "") => `<div class="cs-block${cls ? ` ${cls}` : ""}">${html}</div>`;
  const heading = (title, note = "") => `<h2 class="cs-h">${title}${note ? ` <span>${note}</span>` : ""}</h2>`;
  const box = (label, inner, cls = "") => `<div class="pp-box ${cls}"><b>${label}</b>${inner}</div>`;
  const total = items => items.reduce((t, it) => t + it.marks, 0);

  // ---------- Questions on paper ----------
  // One exam question: the question, any picture, room for working (more for more marks), the answer line and its marks
  const question = (it, label, o = {}) => {
    const opts = it.options ? `<p class="gx-opts">Tick one: ${shuffle([it.answer].concat(it.options)).map(x => `<span>☐ ${x}</span>`).join("")}</p>` : "";
    const work = it.options ? 0 : Math.max(o.min || 0, it.marks - 1) * (o.roomy || 1);
    const calc = it.calc && !o.calcPaper ? " <i>(calculator)</i>" : "";
    return `<div class="pp-q gx-q"><p><b>${label}.</b> ${it.q.replace(UNIT, "")}${calc}</p>
      ${it.pic ? `<div class="gx-pic">${it.pic.replace('class="q-pic"', 'class="pp-pic"')}</div>` : ""}${opts}
      ${work ? `<span class="md-work gx-work" style="height:${+(work * 9).toFixed(1)}mm"></span>` : ""}
      <p class="gx-ans">${it.options ? "" : `Answer ${it.unit === "£" ? "£" : ""}${blank(6)} ${it.unit && it.unit !== "£" ? it.unit : ""}`}<span class="gx-mk">(${mk(it.marks)})</span></p></div>`;
  };
  // Short one-mark questions two to a row (starters)
  const quick = (items, labels) => `<table class="cs-quick">${items.reduce((rows, it, i) => (i % 2 ? rows[rows.length - 1].push([it, labels[i]]) : rows.push([[it, labels[i]]]), rows), [])
    .map(row => `<tr>${row.map(([it, l]) => `<td><b>${l}.</b> ${it.q.replace(UNIT, "")}${it.options ? ` <i>(${shuffle([it.answer].concat(it.options)).join(" / ")})</i>` : ""}<span class="cs-line">${blank(6)}</span></td>`).join("")}${row.length < 2 ? "<td></td>" : ""}</tr>`).join("")}</table>`;
  // An answer with where its marks come from
  const answerOf = it => (it.unit === "£" && /^\d/.test(it.answer) ? `£${it.answer}` : it.unit && it.unit !== "£" && /^[−\d]/.test(it.answer) ? `${it.answer} ${it.unit}` : it.answer);
  const scheme = (it, label) => `<li><b>${label}.</b> <b>${answerOf(it)}</b> <span class="gx-of">(${mk(it.marks)})</span><br><span class="gx-how">${it.scheme}</span></li>`;
  const schemes = (title, items, labels) => items.length ? block(`${heading(title, `${total(items)} marks`)}<ul class="ws-answers cs-answers">${items.map((it, i) => scheme(it, labels[i])).join("")}</ul>`) : "";

  // ---------- Drawing questions from the bank ----------
  // n questions from the given topics and skills ([[topic id, [skills]]]), spread across the skills, none
  // seen before in this session (seen holds labels)
  function draw(from, n, keep = () => true, seen = new Set()) {
    const pool = from.flatMap(([id, skills]) => X().items(id, 40, it => (!skills || skills.includes(it.skill)) && keep(it)).map(it => Object.assign(it, { topicId: id })));
    const bySkill = new Map();
    shuffle(pool).forEach(it => { if (!seen.has(it.label)) { if (!bySkill.has(it.skill)) bySkill.set(it.skill, []); bySkill.get(it.skill).push(it); } });
    const out = [], queues = shuffle([...bySkill.values()]);
    while (out.length < n && queues.some(q => q.length)) for (const q of queues) {
      if (out.length >= n) break;
      while (q.length && seen.has(q[0].label)) q.shift();
      const it = q.shift();
      if (it) { seen.add(it.label); out.push(it); }
    }
    return out;
  }
  // The same, trying each way in turn until there are n (a session's own skills first, then its topics)
  const drawFirst = (ways, n, seen) => {
    const out = [];
    for (const [from, keep] of ways) { if (out.length >= n) break; out.push(...draw(from, n - out.length, keep, seen)); }
    return out;
  };
  const topicTitle = id => (X().topic(id) || {}).title || id;
  const topicN = id => (X().topic(id) || {}).n || 0;

  // ---------- The course's calendar ----------
  const DAY = 86400000;
  const fmtDate = d => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  // The date of session n, two (or perWeek) sessions a week from the first date
  const dateOf = (start, perWeek, n) => {
    if (!start) return "";
    const week = Math.floor((n - 1) / perWeek), k = (n - 1) % perWeek;
    return fmtDate(new Date(start.getTime() + (week * 7 + Math.floor(k * 7 / perWeek)) * DAY));
  };

  // ---------- Making a course ----------
  const code = () => {
    const d = new Date(), pad = n => String(n).padStart(2, "0");
    return `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  };
  // Mock papers: marks from each topic out of 80, roughly as the real Foundation papers weight them
  const MOCK_MARKS = { "gf-number": 7, "gf-calc": 7, "gf-factors": 5, "gf-fractions": 7, "gf-percent": 8, "gf-ratio": 9, "gf-algebra": 6, "gf-equations": 7,
    "gf-graphs": 4, "gf-measures": 4, "gf-angles": 5, "gf-area": 5, "gf-probability": 3, "gf-statistics": 3 };
  const PAPERS = { 1: { name: "Paper 1", calc: false, note: "Non-calculator" }, 2: { name: "Paper 2", calc: true, note: "Calculator" }, 3: { name: "Paper 3", calc: true, note: "Calculator" } };

  function mockPaper(set, n, seen) {
    const p = PAPERS[n], keep = it => (p.calc || !it.calc), items = [];
    for (const [id, want] of Object.entries(MOCK_MARKS)) {
      let got = 0;
      // Longer questions first, as the real papers have few one-mark questions; calculator questions first on papers 2 and 3
      const pool = draw([[id, null]], 20, keep, new Set(seen)).map(it => [it.marks + (p.calc && it.calc ? 1.5 : 0) + Math.random() * 1.5, it]).sort((x, y) => y[0] - x[0]).map(([, it]) => it);
      for (const it of pool) {
        if (got + it.marks > want) continue;
        items.push(it); seen.add(it.label); got += it.marks;
        if (got === want) break;
      }
    }
    // Make it exactly 80 with one-mark questions
    const ids = Object.keys(MOCK_MARKS);
    for (let k = 0; total(items) < 80 && k < 200; k++) items.push(...draw([[ids[rand(ids.length)], null]], 1, it => it.marks === 1 && keep(it), seen));
    // Easier first, as in the real papers: one-mark questions lead, three-mark problems come later
    const order = items.map(it => [it.marks + Math.random() * 1.6, it]).sort((a, b) => a[0] - b[0]).map(([, it]) => it);
    return { set, n, name: p.name, calc: p.calc, note: p.note, items: order };
  }

  // ---------- Paper only (no internet) ----------
  // The parent edition for a family working with no internet: no web addresses anywhere, a printed
  // homework sheet in place of the online practice, and a spare set of practice exams. The session
  // notes are rewritten here, so course-data.js stays one set of notes.
  const OFFLINE = [
    [/^Look at popspell\.com\/climb\.html and try one topic's online practice\.$/, "Read \"What the exam expects\" again and fill in the exam date on the tracker."],
    [/, then the online practice for topic \d+\./, "."],
    [/^Online practice for topic \d+( again)?(: aim for 80%)?\.$/, "The homework sheet."],
    [/; online practice for topic \d+\./, "; then the homework sheet."],
    [/^Five questions of each kind from the online practice\.$/, "The homework sheet."],
    [/for three cities online/, "for three cities from a newspaper or the weather forecast"],
    [/in a shop or online/, "in a shop"],
    [/Find a price online/, "Find a price in a shop or a catalogue"],
    [/^Revise the weakest topic with its online practice\.$/, "Redo the practice questions from the weakest topic's session."],
    [/^The weakest topic's online practice, then its Exam practice sheet\.$/, "Redo the practice and exam questions from the weakest topic's sessions."],
    [/Print that topic's Exam practice sheet \(popspell\.com\/pack\.html, or from the session pages\) for homework\./, "For homework, redo that topic's practice questions from its session pages."],
    [/the online practice for the weakest topics, and real past papers from the exam board's website \(free, with mark schemes\)/, "the practice questions of the weakest topics, the spare practice exams (set C, at the back of this pack), and real past papers with their mark schemes (ask the exam centre)"],
    [/^Real past papers from the exam board's website, one a week, marked with their mark schemes\.$/, "The spare practice exams (set C), then real past papers, one a week, marked with their mark schemes. Ask the exam centre (the school or college where your child sits the exam) for printed past papers, or write to the exam board (AQA, Edexcel or OCR)."],
    [/the online practice/gi, "the homework sheet"], [/online practice/gi, "homework sheet"]];
  const offline = t => (typeof t === "string" ? OFFLINE.reduce((x, [re, to]) => x.replace(re, to), t) : Array.isArray(t) ? t.map(offline) : t);
  const offlineSession = s => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, ["t", "from", "sheets", "topics", "kind", "set", "paper"].includes(k) ? v : offline(v)]));

  function make(courseId, who = "", opts = {}) {
    const course = DATA.get(courseId) || DATA.courses[0];
    const c = code(), perWeek = opts.perWeek || course.perWeek, start = opts.start || null, paper = Boolean(opts.paper);
    const S = course.sessions.map((s, i) => Object.assign({ n: i + 1, kind: "teach" }, paper ? offlineSession(s) : s));
    const taught = [];
    const mockSeen = { A: new Set(), B: new Set() }, mocks = {};
    const sessions = S.map(s => {
      const seen = new Set(), week = Math.ceil(s.n / perWeek), date = dateOf(start, perWeek, s.n);
      const made = { s, n: s.n, week, date, code: c };
      if (s.kind === "teach") {
        // Starter: one-mark questions from earlier sessions (one from the last), or number warm-ups at first
        const earlier = taught.slice(), last = earlier.pop();
        const warm = [["gf-calc", ["order of operations", "× and ÷ by 10, 100, 1000", "adding decimals", "subtracting decimals"]]];
        const one = it => it.marks === 1 && !it.pic;
        const starter = drawFirst([[last ? last.from : warm, one]], 1, seen)
          .concat(...shuffle(earlier).slice(0, 3).map(e => draw(e.from, 1, one, seen)));
        while (starter.length < 4) { const more = draw(warm, 1, one, seen); if (!more.length) break; starter.push(...more); }
        const topic = s.from.map(([id]) => [id, null]);
        const example = drawFirst([[s.from, it => it.marks >= 2 && !it.options], [s.from, () => true]], 1, seen);
        const practice = draw(s.from, 8, () => true, seen).sort((a, b) => a.marks - b.marks || (a.pic ? 1 : 0) - (b.pic ? 1 : 0));
        // No kind of question more than three times in a session: the exam questions look elsewhere in the topic first
        const used = new Map(), count = list => list.forEach(it => used.set(it.skill, (used.get(it.skill) || 0) + 1)), fresh = (it, cap = 3) => (used.get(it.skill) || 0) < cap;
        count(example.concat(practice));
        const exam = [];
        for (let k = 0; k < 2; k++) {
          const one = drawFirst([[s.from, it => (it.marks >= 3 || (it.ps && it.marks >= 2)) && fresh(it)], [s.from, it => it.marks >= 2 && fresh(it)], [topic, it => it.marks >= 2 && fresh(it, 2)], [s.from, it => it.marks >= 2]], 1, seen);
          count(one); exam.push(...one);
        }
        const exit = drawFirst([[s.from, it => it.marks <= 2 && !it.pic && fresh(it, 4)], [s.from, it => it.marks <= 2 && !it.pic], [topic, it => it.marks <= 2]], 3, seen);
        Object.assign(made, { starter, example: example[0], practice, exam, exit });
        // Paper only: a printed homework sheet in place of the online practice
        if (paper) made.homework = drawFirst([[s.from, () => true], [topic, () => true]], 6, seen).sort((a, b) => a.marks - b.marks);
        taught.push(s);
      } else if (s.kind === "check") {
        // A one-mark question and two (or three, when the check has three topics) longer ones from each topic
        made.sections = s.topics.map(id => {
          const items = draw([[id, null]], 1, it => it.marks === 1 && !it.options, seen), skills = new Set(items.map(it => it.skill));
          for (let k = 0; k < (s.topics.length > 3 ? 2 : 3); k++) {
            const one = drawFirst([[[[id, null]], it => it.marks >= 2 && !skills.has(it.skill)], [[[id, null]], it => !skills.has(it.skill)], [[[id, null]], () => true]], 1, seen);
            one.forEach(it => skills.add(it.skill)); items.push(...one);
          }
          return { id, items: items.sort((x, y) => x.marks - y.marks) };
        });
      } else if (s.kind === "mock") {
        made.papers = [].concat(s.paper).map(n => (mocks[`${s.set}${n}`] = mockPaper(s.set, n, mockSeen[s.set])));
      } else if (s.kind === "review" && !s.final) {
        made.round = X().TOPICS.map(t => draw([[t.id, null]], 1, it => it.marks >= 2 && !it.pic, seen)[0]).filter(Boolean);
      }
      // Paper only: a spare set of practice exams (set C) with the last session, as there are no past papers to download
      if (paper && s.final) made.papers = [1, 2, 3].map(n => (mocks[`C${n}`] = mockPaper("C", n, mockSeen.C || (mockSeen.C = new Set()))));
      if (s.sheets) made.sheets = s.sheets.filter(id => PAPER.get(id)).map(id => ({ id, title: PAPER.get(id).title, b: PAPER.get(id).build(who, kit) }));
      return made;
    });
    return { course, code: c, who, perWeek, start, sessions, mocks, paper, edition: paper || opts.edition === "parent" ? "parent" : "tutor" };
  }

  // ---------- Pages ----------
  // A document: its first page's header, the header of any page after, and blocks of content.
  // adult: for the tutor (not the pupil's look, marked as the adult's page)
  const doc = (head, more, blocks, adult = false) => ({ head, more, blocks, adult });
  const stamp = (made, line) => `<p class="ws-code">Course ${made.code}${line ? ` · ${line}` : ""}</p>`;
  const strip = (a, b, c) => `<p class="qd-strip gx-strip"><b>${a}</b><span>${b}</span><span>${c}</span></p>`;
  const sLabel = (made, m) => `Session ${m.n} of ${made.sessions.length} · Week ${m.week}${m.date ? ` · ${m.date}` : ""}`;

  // Homework: the topic's online practice (unless the session's own homework already is), then the session's task
  const homework = (made, s) => {
    const C = made.course;
    if (made.paper) return s.kind !== "teach" ? s.home || "" : `The homework sheet for this session (H1 to H6; the answers are with this session's answers).${s.home && s.home !== "The homework sheet." ? ` Then: ${s.home.replace(/^The homework sheet\.?\s*/, "").replace(/; then the homework sheet\.?$/, ".").replace(/^./, x => x.toLowerCase())}` : ""}`.replace(/ Then: $/, "");
    if (s.kind !== "teach" || /^Online practice/.test(s.home || "")) return s.home || "";
    const topics = [...new Set(s.from.map(([id]) => topicN(id)))].join(" and ");
    return `Online practice for topic ${topics} at popspell.com/${C.online}.${s.home ? ` Then: ${s.home[0].toLowerCase()}${s.home.slice(1)}` : ""}`;
  };
  function tutorPlan(made, m) {
    const s = m.s, C = made.course;
    const head = `${K.brandHead(`Tutor plan: session ${m.n}`, `${esc(s.t)}`)}${stamp(made, sLabel(made, m))}`;
    const more = `${K.brandHead(`Tutor plan: session ${m.n} (continued)`, esc(s.t))}${stamp(made)}`;
    const list = arr => `<ul class="cs-list">${arr.map(x => `<li>${x}</li>`).join("")}</ul>`;
    const blocks = [block(`<p class="cs-aim"><b>Aim:</b> ${esc(s.aim)}</p>${s.from ? `<p class="cs-skills"><b>Skills:</b> ${s.from.map(([id, sk]) => `${sk.join(", ")} <span class="gx-of">(topic ${topicN(id)})</span>`).join("; ")}</p>` : ""}`)];
    if (s.kind === "teach") {
      const ex = m.example;
      blocks.push(block(`<table class="cs-time"><tr><th>Minutes</th><th>What happens</th></tr>
        <tr><td>0 to 5</td><td><b>Starter</b>: four quick questions from earlier sessions, on the pupil's sheet. Mark them together; reteach anything missed in a minute.</td></tr>
        <tr><td>5 to 20</td><td><b>Teach</b>: the points below, then the worked example (it's on the pupil's sheet too).</td></tr>
        <tr><td>20 to 45</td><td><b>Practice</b>: eight questions, easiest first. Mark as they go; give the method marks.</td></tr>
        <tr><td>45 to 55</td><td><b>Exam question</b>: no help, timed (about a minute a mark). Mark it with the scheme together.</td></tr>
        <tr><td>55 to 60</td><td><b>Exit ticket</b> and <b>homework</b>. Note the exit ticket score on the tracker.</td></tr></table>`));
      blocks.push(block(`${heading("Teach")}${list(s.keys.map(esc))}`));
      if (ex) blocks.push(block(box("Worked example (on the pupil's sheet)", `<p>${ex.q.replace(UNIT, "")} <i>(${mk(ex.marks)})</i></p><p class="gx-how">${ex.scheme}</p><p class="cs-say">Answer: <b>${ex.answer}</b>. Model it line by line, saying which line earns which mark.</p>`)));
    } else {
      blocks.push(block(`${heading("The session")}${`<ol class="cs-list">${s.keys.map(k => `<li>${esc(k)}</li>`).join("")}</ol>`}`));
    }
    if (s.slips) blocks.push(block(`${heading("Watch for")}${list(s.slips.map(esc))}`));
    if (s.ask) blocks.push(block(`<p><b>Ask:</b> ${esc(s.ask)}</p>`));
    if (s.help || s.push) blocks.push(block(`${s.help ? `<p><b>If they're stuck:</b> ${esc(s.help)}</p>` : ""}${s.push ? `<p><b>If they're flying:</b> ${esc(s.push)}</p>` : ""}`));
    blocks.push(block(`<p><b>Homework:</b> ${esc(homework(made, s))}</p>
      ${s.merge ? `<p class="gx-of">◆ Short of weeks? This session can share a longer session with session ${m.n - 1}: do both teach parts, then half of each practice.</p>` : ""}`));
    blocks.push(block(`<div class="cs-notes"><b>Notes after the session</b> (what went well, what to revisit, exit ticket ___ / ___)</div>`, "cs-grow"));
    return doc(head, more, blocks, true);
  }

  function pupilSheets(made, m) {
    const s = m.s, docs = [];
    const head = (title, line) => `${K.sheetHead(title, made.who)}${stamp(made, sLabel(made, m))}${line}`;
    const more = title => `${K.brandHead(`${title} (continued)`)}${stamp(made)}`;
    const title = `Session ${m.n}: ${s.t}`;
    if (s.kind === "teach") {
      const anyCalc = [...m.practice, ...m.exam].some(it => it.calc);
      const blocks = [block(`<p class="cs-aim"><b>Today:</b> ${esc(s.aim)}</p>`),
        block(`${heading("Starter", "5 minutes, no calculator")}${quick(m.starter, ["a", "b", "c", "d"])}`)];
      if (m.example) blocks.push(block(box("Worked example", `<p>${m.example.q.replace(UNIT, "")} <i>(${mk(m.example.marks)})</i></p><p class="gx-how">${m.example.scheme}</p><p>Answer: <b>${m.example.answer}</b></p>`, "cs-example")));
      blocks.push(block(heading("Practice", `${total(m.practice)} marks. Show every step.`), "cs-keep"));
      m.practice.forEach((it, i) => blocks.push(block(question(it, i + 1))));
      blocks.push(block(heading("Exam question", "No help: about a minute a mark"), "cs-keep"));
      m.exam.forEach((it, i) => blocks.push(block(question(it, `E${i + 1}`, { min: 1 }))));
      blocks.push(block(heading("Exit ticket", "On your own"), "cs-keep"));
      m.exit.forEach((it, i) => blocks.push(block(question(it, `X${i + 1}`))));
      blocks.push(block(`<p class="cs-home"><b>Homework:</b> ${esc(homework(made, s))}</p>
        <p class="cs-rate">How sure do I feel? ☐ Not yet &nbsp; ☐ Getting there &nbsp; ☐ I've got it &nbsp;&nbsp; Exit ticket: ___ / ${total(m.exit)}</p>`));
      docs.push(doc(head(title, strip(made.edition === "parent" ? "Home course" : "Tutor course", made.course.short, anyCalc ? "Calculator only where it says" : "No calculator")), more(`Session ${m.n}`), blocks));
    }
    if (s.kind === "check") {
      const all = m.sections.flatMap(x => x.items);
      const blocks = [block(`<p class="gx-intro">${s.topics.length > 3 ? "40" : "35"} minutes, on your own. Show your working: method marks count. Calculator only where a question says so.</p>`)];
      let q = 0;
      m.sections.forEach(sec => {
        blocks.push(block(heading(`Topic ${topicN(sec.id)}: ${esc(topicTitle(sec.id))}`, `${total(sec.items)} marks`), "cs-keep"));
        sec.items.forEach(it => blocks.push(block(question(it, ++q))));
      });
      docs.push(doc(head(title, strip("Progress check", made.course.short, `Total ___ / ${total(all)}`)), more(s.t), blocks));
    }
    if (s.kind === "mock") m.papers.forEach(p => docs.push(...mockDocs(made, m, p).pupil));
    if (s.kind === "review" && !s.final) {
      const T = X().TOPICS;
      const blocks = [block(`<p class="gx-intro">Fill in the marks lost on each topic from the mock record, then circle your three biggest.</p>
        <table class="gx-track"><thead><tr><th>Topic</th><th>Paper 1</th><th>Paper 2</th><th>Paper 3</th><th>Marks lost</th></tr></thead>
        <tbody>${T.map(t => `<tr><td>${t.n}. ${esc(t.title)}</td>${'<td class="gx-cell"></td>'.repeat(4)}</tr>`).join("")}</tbody></table>
        <p class="gx-plan">My three topics: 1 ${blank(9)} 2 ${blank(9)} 3 ${blank(9)}</p>`),
      block(heading("Revision round", "One exam question from every topic"), "cs-keep")];
      m.round.forEach((it, i) => blocks.push(block(question(it, i + 1))));
      docs.push(doc(head(title, strip("After the mock", made.course.short, `Revision round ___ / ${total(m.round)}`)), more(s.t), blocks));
    }
    if (s.final) docs.push(doc(head(title, strip("Exam ready", made.course.short, "Keep this")), more(s.t), examDay(made)));
    if (s.final && m.papers) m.papers.forEach(p => docs.push(...mockDocs(made, m, p).pupil));
    // Paper only: the homework sheet
    if (m.homework) docs.push(doc(head(`Homework: session ${m.n}`, strip("Homework", esc(s.t), `Total ___ / ${total(m.homework)}`)), more(`Homework: session ${m.n}`),
      [block(`<p class="gx-intro">On your own, a day or two after the session. Show every step. Your parent has the answers.</p>`), ...m.homework.map((it, i) => block(question(it, `H${i + 1}`)))]));
    return docs;
  }

  // The exam-day plan, for the last session
  const examDay = made => [block(`<table class="gx-track"><thead><tr><th>Paper</th><th>Date and time</th><th>Calculator?</th></tr></thead><tbody>
      <tr><td>Paper 1</td><td></td><td>No</td></tr><tr><td>Paper 2</td><td></td><td>Yes</td></tr><tr><td>Paper 3</td><td></td><td>Yes</td></tr></tbody></table>`),
    block(box("The night before", `<p>Pack: two black pens, pencil, rubber, ruler, protractor, compasses, a scientific calculator (checked, with spare batteries if it takes them), water, and a clear pencil case. Sleep: a rested brain is worth more marks than one more hour of revision.</p>`)),
    block(box("In the exam", `<p>Read every question twice and underline what it asks. Do the ones you can first, then come back. About a minute a mark. Never leave a gap: write the first step. Units on every answer, money with 2 decimal places. Use spare time to check: put answers back into equations, estimate calculator answers.</p>`)),
    block(box("If you get stuck", `<p>Write down what you know (the numbers, a formula, a diagram). Try one step. Then move on and come back at the end. A first step often earns a mark.</p>`)),
    block(box("After each paper", `<p>Don't go through it with friends. Look at what's next: the next paper is a fresh 80 marks.</p>`)),
    block(`<table class="gx-track"><thead><tr><th></th><th>Baseline (session 1)</th><th>Mock set A</th><th>Mock set B</th></tr></thead>
      <tbody><tr><td>Score</td><td>___ / 28</td><td>___ / 240</td><td>___ / 240</td></tr></tbody></table>
      <p class="gx-plan">Something I can do now that I couldn't do in session 1: ${blank(20)}</p>`)];

  function mockDocs(made, m, p) {
    const title = `Mock exam ${p.set}, ${p.name}`;
    const head = `${K.sheetHead(title, made.who)}${stamp(made, sLabel(made, m))}${strip("Mock exam", `Foundation tier · ${p.note}`, "Total ___ / 80")}`;
    const front = block(box("Instructions", `<p><b>Time: 1 hour 30 minutes.</b> Answer all the questions. Write your answers in the spaces given, and show your working: marks are given for correct working even when the answer is wrong.
      ${p.calc ? "You may use a calculator." : "<b>You must not use a calculator.</b>"} Diagrams are not drawn accurately unless it says so. You need: a black pen, pencil, ruler, protractor and compasses${p.calc ? ", and a scientific calculator" : ""}.</p>
      <p>The marks for each question are shown in brackets. There are 80 marks. This mock uses grade 1 to 3 questions only, from PopSpell's bank: the real paper also has harder questions near the end.</p>`));
    const blocks = [front, ...p.items.map((it, i) => block(question(it, i + 1, { calcPaper: p.calc, min: 1.2, roomy: 2 })))];
    const pupil = [doc(head, `${K.brandHead(`${title} (continued)`)}${stamp(made)}`, blocks)];
    // The mark scheme, then where the marks are by topic (for the mock record)
    const byTopic = X().TOPICS.map(t => [t, p.items.filter(it => it.topicId === t.id)]).filter(([, its]) => its.length);
    const ans = [block(`<p>Mark like an examiner: method marks for each right step even when the answer is wrong; a right answer with no working gets full marks, a wrong one with no working gets none.</p>`),
      ...p.items.map((it, i) => block(`<ul class="ws-answers cs-answers">${scheme(it, i + 1)}</ul>`)),
      block(`${heading("The mock record: marks by topic")}<table class="gx-track"><thead><tr><th>Topic</th><th>Questions</th><th>Marks</th><th>Scored</th></tr></thead>
        <tbody>${byTopic.map(([t, its]) => `<tr><td>${t.n}. ${esc(t.title)}</td><td>${its.map(it => p.items.indexOf(it) + 1).join(", ")}</td><td>${total(its)}</td><td class="gx-cell"></td></tr>`).join("")}</tbody></table>
        <p class="gx-plan">Copy the marks lost on each topic onto the pupil's review sheet (session after the mock) and the total onto the tracker.</p>`)];
    const answers = [doc(`${K.brandHead(`Answers: ${title}`, made.edition === "parent" ? "Mark scheme, for you (not your child)." : "Mark scheme, for the tutor.")}${stamp(made, sLabel(made, m))}`, `${K.brandHead(`Answers: ${title} (continued)`)}${stamp(made)}`, ans, true)];
    return { pupil, answers };
  }

  function answerSheets(made, m) {
    const s = m.s, head = `${K.brandHead(`Answers: session ${m.n}`, `${esc(s.t)}. ${made.edition === "parent" ? "For you, not your child." : "For the tutor."}`)}${stamp(made, sLabel(made, m))}`;
    const more = `${K.brandHead(`Answers: session ${m.n} (continued)`)}${stamp(made)}`;
    if (s.kind === "teach") return [doc(head, more, [schemes("Starter", m.starter, ["a", "b", "c", "d"]), schemes("Practice", m.practice, m.practice.map((_, i) => i + 1)),
      schemes("Exam question", m.exam, m.exam.map((_, i) => `E${i + 1}`)), schemes("Exit ticket", m.exit, m.exit.map((_, i) => `X${i + 1}`)), m.homework ? schemes("Homework", m.homework, m.homework.map((_, i) => `H${i + 1}`)) : "",
      block(`<p class="gx-note"><b>Marking like an examiner:</b> method marks for the right working even when the answer is wrong; no answer marks without it. Exit ticket at three-quarters or more: move on. Less: start the next session's starter with this topic.</p>`)].filter(Boolean), true)];
    if (s.kind === "check") {
      let q = 0;
      const nums = m.sections.map(sec => sec.items.map(() => ++q));
      return [doc(head, more, [...m.sections.map((sec, i) => schemes(`Topic ${topicN(sec.id)}: ${esc(topicTitle(sec.id))}`, sec.items, nums[i])),
        block(`${heading("Scores for the tracker")}<table class="gx-track"><thead><tr><th>Topic</th><th>Marks</th><th>Scored</th><th>Secure (¾ or more)?</th></tr></thead>
          <tbody>${m.sections.map(sec => `<tr><td>${topicN(sec.id)}. ${esc(topicTitle(sec.id))}</td><td>${total(sec.items)}</td><td class="gx-cell"></td><td class="gx-cell"></td></tr>`).join("")}</tbody></table>`)], true)];
    }
    if (s.kind === "mock") return m.papers.flatMap(p => mockDocs(made, m, p).answers);
    if (s.kind === "review" && !s.final) return [doc(head, more, [schemes("Revision round", m.round, m.round.map((_, i) => i + 1))], true)];
    if (s.final && m.papers) return m.papers.flatMap(p => mockDocs(made, m, p).answers);
    return [];
  }

  // The climb's own sheets a session uses (already one A4 page each)
  const sheetPages = (made, m) => (m.sheets || []).map(x => ({
    pupil: K.ageLook(x.b.pupil.replace("</header>", `</header>${stamp(made, sLabel(made, m))}`), "older"),
    answers: x.b.answers ? x.b.answers.replace("</header>", `</header>${stamp(made, `Answers for session ${m.n}`)}`)
      .replace("Check the exam board's own page for", made.paper ? "Ask the exam centre for" : "Check the exam board's own page for") : "" }));

  // ---------- The parent edition (homeschool) ----------
  // For a parent who isn't confident in maths: the same sessions and sheets, but each session's plan is a
  // step-by-step page in plain words, with what to say, the worked example one step at a time, what to say
  // when the child is stuck, how to mark, and whether to move on or repeat.
  const steps = scheme => scheme.split(/\s*\((?:\d )?marks?\)\.?\s*/).map(x => x.trim()).filter(Boolean);
  const MOVE_ON = made => `<p><b>Move on or repeat?</b> Exit ticket right (or nearly right) on most of it, about three-quarters: <b>move on</b> next time. Less than that: start next session by doing the exit ticket questions again together, then carry on. If a topic goes wrong twice, <b>repeat the session</b>: ${made.paper ? "cover the answers and do its practice questions again, a few days later" : "print it again from popspell.com/course.html (One session) for fresh numbers"}.</p>`;
  function parentPlan(made, m) {
    const s = m.s, C = made.course;
    const head = `${K.brandHead(`Parent's guide: session ${m.n}`, `${esc(s.t)}. Read this page before you start.`)}${stamp(made, sLabel(made, m))}`;
    const more = `${K.brandHead(`Parent's guide: session ${m.n} (continued)`, esc(s.t))}${stamp(made)}`;
    const list = arr => `<ul class="cs-list">${arr.map(x => `<li>${x}</li>`).join("")}</ul>`;
    const step = (n, title, mins, inner) => block(`${heading(`Step ${n}: ${title}`, mins)}${inner}`);
    const blocks = [block(`<p class="cs-aim"><b>Today:</b> ${esc(s.aim)}</p>
      <p class="cs-aim"><b>You need:</b> the pupil's sheets for this session, the answers pages (keep them on your side of the table), a pencil, a rubber${s.kind === "mock" || (s.from && [...m.practice, ...m.exam].some(it => it.calc)) ? ", a scientific calculator" : ""}${/angle|shape|area|circle|graph|coordinat|transform|bearing/i.test(s.t) ? ", a ruler (and a protractor for angles)" : ""}, and an hour without screens.</p>`)];
    if (s.kind === "teach") {
      const ex = m.example;
      blocks.push(step(1, "Warm up", "5 minutes",
        `<p>Your child does the <b>Starter</b> (a to d) on their own. Check each with the answers page. All right? Say well done and move on. One wrong? Look at the answer together and ask them to show you where it went wrong. Don't spend more than a few minutes here.</p>`));
      blocks.push(step(2, "Explain", "about 15 minutes",
        `<p>Read this out, or say it in your own words. Stop after each point and ask: <i>"Does that make sense? Can you say it back to me?"</i></p>
        <div class="cs-say">${list(s.say.map(esc))}</div>`));
      if (ex) blocks.push(block(box("Then the worked example, one line at a time (it's on their sheet too)",
        `<p>${ex.q.replace(UNIT, "")} <i>(${mk(ex.marks)})</i></p><ol class="cs-list">${steps(ex.scheme).map(x => `<li>${x}</li>`).join("")}</ol>
        <p>Answer: <b>${answerOf(ex)}</b>.${ex.marks > 1 ? " Point out that each line can earn a mark, so writing every step down matters, even if the last step goes wrong." : ""}</p>`)));
      blocks.push(step(3, "Practice", "about 25 minutes",
        `<p>Your child does questions 1 to 8. Sit with them and mark each question as soon as it's done, using the answers page:</p>
        ${list(["<b>Right, with working:</b> a tick and full marks.",
          "<b>Wrong, but some working is right:</b> give the marks for the right lines (the answers page says which line earns which mark). Then ask: <i>\"Talk me through what you did.\"</i> Often they'll find the slip themselves.",
          "<b>Wrong and no working:</b> no marks. Ask them to try again, writing each step down.",
          "Don't say \"no, that's wrong\". Say <i>\"Nearly: let's look at this line\"</i>, then compare it with the answers page together."])}`));
      blocks.push(block(`${heading("If they're stuck, try saying")}${list(s.stuck.map(x => `<i>"${esc(x)}"</i>`))}
        <p>Still stuck? Do that question together using the answers page, then let them try the next one alone. It's fine to leave a question and come back.</p>`));
      blocks.push(step(4, "Exam question", "10 minutes",
        `<p>Questions E1 and E2 are like the real exam. <b>Don't help.</b> Allow about a minute per mark. Then mark them together with the answers page, line by line, and talk about which lines earned marks.</p>`));
      blocks.push(step(5, "Exit ticket and homework", "5 minutes",
        `<p>Your child does X1 to X3 alone. Mark them and write the score on the tracker (and in the box on their sheet).</p>${MOVE_ON(made)}
        <p><b>Homework:</b> ${esc(homework(made, s))}</p>`));
      if (s.slips) blocks.push(block(`${heading("Common mistakes to look out for")}${list(s.slips.map(esc))}`));
    } else {
      const what = {
        start: "This session uses the printed sheets in this pack. Follow the steps below; the answers are in this pack, after the pupil's pages.",
        check: "A progress check: a short test on the last few topics, to see what's secure. Your child works alone; you mark it afterwards.",
        mock: "A practice exam, like the real one. Your child works alone, in silence, timed. It's 1 hour 30 minutes, so you may want a longer session, or do it on a weekend morning.",
        review: "A session to look back at the practice exam and fix the gaps.",
        skills: "A session on exam skills, using the printed sheets in this pack. The answers are in this pack, after the pupil's pages."
      }[s.kind] || "";
      blocks.push(block(`<p>${what}</p>${heading("Step by step")}<ol class="cs-list">${s.keys.map(k => `<li>${esc(k)}</li>`).join("")}</ol>`));
      blocks.push(block(`${heading("Marking")}<p>Use the answers pages. Give a mark for every line of working that matches the answers page, even when the final answer is wrong. A right answer with no working gets full marks; a wrong answer with no working gets none. Then go back over every question that lost marks: look at the answers page together and let your child redo it.</p>
        ${s.kind === "check" ? "<p><b>Move on or repeat?</b> About three-quarters of a topic's marks: that topic is secure, tick it on the tracker. Less: before the next topic, print that topic's sessions again (fresh numbers) and do the practice and exit ticket parts.</p>" : ""}
        ${s.kind === "mock" ? "<p>Write the score on the tracker. A practice exam with half the marks is a good result at this stage: these papers only use grade 1 to 3 questions.</p>" : ""}`));
      if (s.slips) blocks.push(block(`${heading("Look out for")}${list(s.slips.map(esc))}`));
      blocks.push(block(`<p><b>Homework:</b> ${esc(s.home || "")}</p>`));
    }
    if (s.merge) blocks.push(block(`<p class="gx-of">◆ Short of weeks? This session can be done in one longer sitting with session ${m.n - 1}.</p>`));
    blocks.push(block(`<div class="cs-notes"><b>Your notes</b> (what went well, what to go over again, exit ticket ___ / ___)</div>`));
    return doc(head, more, blocks, true);
  }
  function parentGuide(made) {
    const C = made.course, n = made.sessions.length;
    const head = `${K.brandHead("Teaching GCSE maths at home: grade 1 to 3", made.paper ? "A parent's guide, paper only. Read this first." : "A parent's guide. Read this first.")}${stamp(made)}`;
    const blocks = [
      block(box("You don't need to be good at maths", `<p>Everything is written out for you. Each session has a <b>parent's guide page</b> that tells you what to do, step by step, and what to say. The <b>answers pages</b> show every answer and every step of working. Your job is to keep things calm, keep to time, mark with the answers pages, and ask your child to explain their thinking. Learning alongside them is fine: say so.</p>`)),
      block(box("The course", `<p>${n} sessions of about an hour, ${C.perWeek} a week for ${C.weeks} weeks. Your child starts with a check to see what they know, works through every topic that the grade 1 to 3 marks come from, does a progress check every few weeks, and finishes with two sets of practice exams (three papers each, like the real exam)${made.paper ? ", plus a spare third set. Everything is on paper: no internet needed" : ""}.</p>`)),
      block(box("Before each session (10 minutes)", `<p>Read that session's parent's guide page and its worked example. Have the pupil's sheets, the answers pages (keep them on your side), pencils, a rubber, a ruler, and a scientific calculator (with a fraction key, about £10). Sit somewhere quiet with no phones.</p>`)),
      block(box("Every teaching session has five steps", `<ol class="cs-list"><li><b>Warm up</b> (5 minutes): four quick questions from earlier topics, so nothing is forgotten.</li>
        <li><b>Explain</b> (15 minutes): read out the explanation on the guide page, then go through the worked example one line at a time.</li>
        <li><b>Practice</b> (25 minutes): eight questions, easiest first. Mark each one as it's done.</li>
        <li><b>Exam question</b> (10 minutes): two exam-style questions, no help.</li>
        <li><b>Exit ticket</b> (5 minutes): three questions on their own. The score tells you whether to move on.</li></ol>`)),
      block(box("How to mark", `<p>In the exam, marks are given for each correct step of working, not just the answer. The answers pages show which line earns which mark. So: <b>give a mark for every right line</b>, even if the final answer is wrong. A right answer with no working gets full marks, but a wrong answer with no working gets nothing. That's why your child should always write every step down.</p>`)),
      block(box("When they get it wrong", `<p>Don't say \"wrong\". Say \"Nearly, talk me through it.\" Most mistakes are one slip, and explaining finds it. Then compare with the answers page and let them try again. If they're stuck, use the \"If they're stuck\" lines on the guide page, or do the question together and let them do the next one alone. Short breaks help more than pushing on.</p>`)),
      block(box("Move on or repeat?", `<p>Use the exit ticket. About three-quarters right: move on. Less: start the next session by doing the exit ticket again together. If a topic goes wrong twice, repeat the session: ${made.paper ? "cover the answers and do its practice questions again a few days later, then its homework sheet" : "popspell.com/course.html prints any session again with new numbers"}. Progress checks and the tracker show which topics are secure.</p>`)),
      made.paper ? block(box("Between sessions", `<p>Each teaching session has a <b>homework sheet</b> (six questions, H1 to H6) to do on paper a day or two later; its answers are with that session's answers. Everything is in this pack: nothing needs the internet. After the practice exams, there is a <b>spare set of practice exams (set C)</b> at the back. For real past papers, ask the exam centre (the school or college where your child will sit the exam) for printed copies with their mark schemes, or write to or phone the exam board (AQA, Edexcel or OCR: the exam centre tells you which). If your child isn't on a school roll, ask a local school or college about sitting the exam as a private candidate, early in the year.</p>`))
        : block(box("Between sessions", `<p>Homework is the topic's free online practice at <b>popspell.com/${esc(C.online)}</b>: it marks itself and shows the working. After the practice exams, use real past papers: the exam board (AQA, Edexcel or OCR, ask the exam centre which) publishes them free with mark schemes. Ask the school or college about entering for the exam as a private candidate if your child isn't on a school roll.</p>`)),
      block(box("Maths words you'll meet", `<p><b>Numerator / denominator</b>: top / bottom of a fraction. <b>Factor</b>: divides exactly into a number. <b>Multiple</b>: in its times table. <b>Prime</b>: only divides by 1 and itself. <b>Expression</b>: letters and numbers, no equals sign. <b>Equation</b>: has an equals sign, can be solved. <b>Expand</b>: multiply out brackets. <b>Factorise</b>: put brackets back in. <b>Perimeter</b>: distance round. <b>Area</b>: space inside. <b>Mean</b>: add up and divide. <b>Median</b>: the middle one in order. <b>Mode</b>: the most common. <b>Range</b>: biggest minus smallest. <b>Estimate</b>: round first, then work out.</p>`)),
      block(box("About grades", `<p>The practice exams use grade 1 to 3 questions only, so a score isn't a predicted grade. About half the marks means the grade 1 to 3 topics are mostly in place; two-thirds or more, and a real past paper is the next test, where a grade 3 has usually needed around a third to two-fifths of the marks. Questions are PopSpell's own, not past papers.</p>`))];
    return doc(head, `${K.brandHead("A parent's guide (continued)")}${stamp(made)}`, blocks, true);
  }

  // ---------- The front: tutor's guide, course plan, tracker ----------
  function guide(made) {
    const C = made.course, n = made.sessions.length;
    const head = `${K.brandHead(C.title, `${esc(C.where)}. A tutor's guide.`)}${stamp(made)}`;
    const blocks = [
      block(box("Who it's for", `<p>${esc(C.pupil[0].toUpperCase() + C.pupil.slice(1))}. ${n} sessions of about ${C.minutes} minutes, ${C.perWeek} a week for ${C.weeks} weeks: every Foundation topic that carries the grade 1 to 3 marks, four progress checks, and two full sets of mock papers (three papers of 80 marks each, like the real exam).</p>`)),
      block(box("What's in each session", `<p><b>Tutor plan</b>: aim, timings, what to teach, a worked example, mistakes to watch for, a question to ask, homework. <b>Pupil's sheets</b>: a starter from earlier sessions, the worked example, eight practice questions, an exam question and an exit ticket. <b>Answers</b>: every mark scheme, line by line.</p>`)),
      block(box("How a session runs", `<p>Starter 5 minutes, teach 15, practice 25, exam question 10, exit ticket and homework 5. Mark as you go and talk about the method marks: a pupil at grade 1 often loses marks by not writing down what they did. Note the exit ticket score on the tracker: three-quarters or more and the topic is on its way; less, and it goes into the next starters.</p>`)),
      block(box("Marking like an examiner", `<p><b>M</b> marks are for a correct method, <b>A</b> marks for the right answer (they need the method), <b>B</b> marks for a fact on its own. Give every method mark the working shows, even after a slip. A right answer with no working gets full marks; a wrong one with no working gets none.</p>`)),
      block(box("Fitting it to the weeks you have", `<p>Sessions marked ◆ in the plan can share a longer session with the one before: that brings ${n} sessions down to ${n - made.course.sessions.filter(s => s.merge).length} (about ${Math.ceil((n - made.course.sessions.filter(s => s.merge).length) / 2)} weeks at two a week). With more time, repeat the progress checks with a fresh course or use the online practice. A missed session? Do its exit ticket as a starter next time and set its practice as homework.</p>`)),
      block(box("Between sessions", `<p>Homework is the topic's online practice at <b>popspell.com/${esc(C.online)}</b> (no login, marked instantly) and a short task. For another set of questions on any topic, make a fresh copy of this course or a stage 1 pack at popspell.com/pack.html. Real past papers and mark schemes are free on the exam board's website (AQA, Edexcel or OCR): use them after the mocks.</p>`)),
      block(box("About grades", `<p>The mocks use grade 1 to 3 questions only (PopSpell's own, not past papers), so a score here is not a predicted grade. As a guide: about half the marks means the grade 1 to 3 topics are mostly in place; two-thirds or more, and a real past paper is the next test, where a grade 3 has usually needed around a third to two-fifths of the marks. Boundaries change every year.</p>`))];
    return doc(head, `${K.brandHead(`${C.title} (continued)`)}${stamp(made)}`, blocks, true);
  }
  function planDoc(made) {
    const C = made.course, tag = { start: "Start", check: "Check", mock: "Mock", review: "Review", skills: "Exam skills", teach: "" };
    const rows = made.sessions.map(m => `<tr><td class="cs-n">${m.n}</td><td class="cs-n">${m.week}</td><td class="cs-d">${m.date || ""}</td><td>${m.s.merge ? "◆ " : ""}${esc(m.s.t)}${tag[m.s.kind] ? ` <span class="cs-tag">${tag[m.s.kind]}</span>` : ""}</td><td class="cs-tick">☐</td></tr>`);
    const chunks = [];
    for (let i = 0; i < rows.length; i += 10) chunks.push(rows.slice(i, i + 10));
    const thead = `<thead><tr><th>Session</th><th>Week</th><th>Date</th><th>What it covers</th><th>Done</th></tr></thead>`;
    return doc(`${K.brandHead("The course plan", `${esc(C.title)}: ${made.sessions.length} sessions, ${made.perWeek} a week.`)}${stamp(made)}`,
      `${K.brandHead("The course plan (continued)")}${stamp(made)}`,
      chunks.map(ch => block(`<table class="cs-plan">${thead}<tbody>${ch.join("")}</tbody></table>`)), true);
  }
  function trackerDocs(made) {
    const T = X().TOPICS, cell = '<td class="gx-cell"></td>';
    const checkOf = id => made.sessions.filter(m => m.s.kind === "check").findIndex(m => m.s.topics.includes(id)) + 1;
    const topics = doc(`${K.sheetHead("My tracker: topics", made.who)}${stamp(made)}${strip(made.edition === "parent" ? "Home course" : "Tutor course", made.course.short, "Keep this at the front")}`, `${K.brandHead("My tracker (continued)")}${stamp(made)}`, [
      block(`<p class="gx-plan">Exam date: ${blank(7)} &nbsp; Target grade: <b>3</b> &nbsp; Sessions a week: ${blank(3)}</p>
        <table class="gx-track"><thead><tr><th>Topic</th><th>Baseline<br>/ 2</th><th>Progress<br>check</th><th>Score</th><th>Mock A<br>lost</th><th>Mock B<br>lost</th><th>Secure<br>✓</th></tr></thead>
        <tbody>${T.map(t => `<tr><td>${t.n}. ${esc(t.title)}</td>${cell}<td>${checkOf(t.id) ? `Check ${checkOf(t.id)}` : ""}</td>${cell.repeat(4)}</tr>`).join("")}</tbody></table>
        <p class="gx-plan"><b>Secure</b> means about three-quarters of the marks on that topic in a progress check, and few marks lost in the mocks.</p>`),
      block(`<table class="gx-track gx-papers"><thead><tr><th>Mock</th><th>Paper 1 / 80</th><th>Paper 2 / 80</th><th>Paper 3 / 80</th><th>Total / 240</th><th>%</th></tr></thead>
        <tbody><tr><td>Set A</td>${cell.repeat(5)}</tr><tr><td>Set B</td>${cell.repeat(5)}</tr></tbody></table>`)]);
    const rows = made.sessions.map(m => `<tr><td class="cs-n">${m.n}</td><td class="cs-d">${m.date || ""}</td><td>${esc(m.s.t)}</td><td class="cs-d">${m.s.kind === "teach" ? `___ / ${total(m.exit)}` : ""}</td><td class="cs-tick">☐</td></tr>`);
    const chunks = [];
    for (let i = 0; i < rows.length; i += 15) chunks.push(rows.slice(i, i + 15));
    const log = doc(`${K.sheetHead("My tracker: sessions", made.who)}${stamp(made)}`, `${K.brandHead("My tracker: sessions (continued)")}${stamp(made)}`,
      chunks.map(ch => block(`<table class="cs-plan"><thead><tr><th>Session</th><th>Date</th><th>What it covered</th><th>Exit ticket</th><th>Homework</th></tr></thead><tbody>${ch.join("")}</tbody></table>`)));
    return [topics, log];
  }

  // ---------- Laying out pages ----------
  // Fills pages block by block, measured as printed: a block that won't fit starts a new page with the
  // shorter header. A heading marked cs-keep never ends a page on its own.
  const LIMIT = K.PAGE_H * 0.95;
  function paginate(d) {
    const look = h => (d.adult ? h : K.ageLook(h, "older"));
    if (typeof document === "undefined" || !document.body || !document.createElement) return [look(d.head + d.blocks.join(""))];
    const box = document.createElement("section");
    box.className = `sheet-preview-page ws-measure ${CLASS}`;
    Object.assign(box.style, { position: "absolute", left: "-10000px", top: "0", width: `${K.PAGE_W}px`, padding: "0", margin: "0", minHeight: "0", boxShadow: "none" });
    document.body.append(box);
    const pages = [];
    let parts, hold, from;
    const begin = h => { box.innerHTML = `${look(h)}${K.FOOT}`; from = box.querySelector(".pp-working") || box.querySelector(".ws-foot"); parts = [h]; hold = 0; };
    begin(d.head);
    d.blocks.forEach(b => {
      from.insertAdjacentHTML("beforebegin", b);
      if (box.scrollHeight > LIMIT && parts.length > 1) {
        // Carry a heading left at the bottom over to the next page with this block
        const carry = [];
        from.previousElementSibling.remove();
        for (let i = 0; i < hold; i++) { carry.unshift(parts.pop()); from.previousElementSibling.remove(); }
        pages.push(look(parts.join("")));
        begin(d.more);
        carry.concat(b).forEach(x => { from.insertAdjacentHTML("beforebegin", x); parts.push(x); });
      } else parts.push(b);
      hold = /^<div class="cs-block cs-keep"/.test(b) ? hold + 1 : 0;
    });
    pages.push(look(parts.join("")));
    box.remove();
    return pages;
  }

  // The pages to print: which = "front", "1-20" (sessions), "session-7", or "all"; copy = "tutor" (plans,
  // pupil sheets and answers), "pupil" (the pupil's sheets only) or "answers" (plans and answers)
  function pagesOf(made, which = "all", copy = "tutor") {
    const out = [], P = h => out.push({ html: h, adult: false }), A = h => out.push({ html: h, adult: true });
    const wantFront = which === "all" || which === "front";
    if (wantFront) {
      if (copy !== "pupil") { paginate(made.edition === "parent" ? parentGuide(made) : guide(made)).forEach(A); paginate(planDoc(made)).forEach(A); }
      if (copy !== "answers") trackerDocs(made).forEach(d => paginate(d).forEach(P));
    }
    const range = which === "all" ? [1, made.sessions.length] : /^\d+-\d+$/.test(which) ? which.split("-").map(Number) : /^session-\d+$/.test(which) ? [+which.slice(8), +which.slice(8)] : null;
    if (range) made.sessions.filter(m => m.n >= range[0] && m.n <= range[1]).forEach(m => {
      if (copy !== "pupil") paginate(made.edition === "parent" ? parentPlan(made, m) : tutorPlan(made, m)).forEach(A);
      if (copy !== "answers") { sheetPages(made, m).forEach(x => P(x.pupil)); pupilSheets(made, m).forEach(d => paginate(d).forEach(P)); }
      if (copy !== "pupil") { sheetPages(made, m).filter(x => x.answers).forEach(x => A(x.answers)); answerSheets(made, m).forEach(d => paginate(d).forEach(A)); }
    });
    // Paper only: no web address in the footer either
    const foot = made.paper ? `<p class="ws-foot">PopSpell · free literacy and numeracy practice</p>` : "";
    return out.map(p => `<div class="ws-page${p.adult ? " ws-adult" : ""}">${p.html}${foot}</div>`);
  }

  // ---------- Printing, or saving as PDF ----------
  const fonts = () => (document.fonts ? Promise.all(["16px Nunito", "700 16px Nunito", "16px Andika", "700 16px Andika"].map(f => document.fonts.load(f).catch(() => null))) : Promise.resolve());
  let made = null, printing = null;
  // Lays out the chosen pages, ready to print (sheet-check and the PDF tool call this too)
  async function prepare(which, copy) {
    if (printing) printing.remove();
    await fonts();
    if (document.fonts) await document.fonts.ready;
    const sheet = document.createElement("section");
    sheet.className = `worksheet-print ${CLASS}`;
    sheet.innerHTML = pagesOf(made, which, copy).join("");
    document.body.append(sheet);
    document.body.classList.add("printing-worksheet");
    printing = sheet;
    await Promise.all([...sheet.querySelectorAll("img")].map(img => (img.complete ? null : new Promise(r => { img.onload = img.onerror = r; }))));
    K.fitPages(sheet, CLASS);
    return sheet.querySelectorAll(":scope > .ws-page").length;
  }
  const GROUP = { front: "guide, plan and tracker", all: "whole course" };
  async function printPages(which, copy) {
    if (!made) return;
    await prepare(which, copy);
    const what = GROUP[which] || (which.startsWith("session-") ? `session ${which.slice(8)}` : `sessions ${which.replace("-", " to ")}`);
    document.title = `${made.course.short} course ${made.code}, ${what}${copy === "pupil" ? " (pupil)" : copy === "answers" ? " (tutor plans and answers)" : ""}`;
    window.print();
  }
  if (typeof window.addEventListener === "function") window.addEventListener("afterprint", () => {
    if (printing) printing.remove();
    printing = null;
    document.body.classList.remove("printing-worksheet");
    document.title = "Tutor courses to print · PopSpell";
  });

  // ---------- The page ----------
  const $ = id => (typeof document !== "undefined" && document.getElementById ? document.getElementById(id) : null);
  const app = $("app");
  // Home-school packs for every level (home-data.js, made in the app at #/home): a parent's guide, then
  // each session's parent's page, sheets and answers, online or paper only
  function homePacks() {
    const H = window.PopHomeData;
    if (!H) return "";
    const group = (nation, subject) => H.PACKS.filter(p => p.nation === nation && p.subject === subject)
      .map(p => `<li><a href="./#/home/${esc(p.id)}">${esc(p.title)}</a> <span class="pk-small">${esc(p.ages)}</span></li>`).join("");
    return `<section class="pk-pack cs-home" id="home-packs"><h2>Home-school packs for every level</h2>
      <p>Parent-led courses in English and maths for Scotland (Early level to Advanced Higher) and England (Reception to GCSE), made the same way as the parent edition above: a parent's guide that assumes no teaching confidence, a plan and a tracker, then for every session a page that says what to do and what to say, your child's sheets, and the answers, with a review every six lessons and a final check. Each pack comes <b>online</b> (names the free practice on PopSpell) or <b>paper only</b> (no internet, no web links).</p>
      <div class="cs-home-grid"><div><h3>Scotland: maths</h3><ul>${group("scotland", "Maths")}</ul></div><div><h3>Scotland: English</h3><ul>${group("scotland", "Literacy")}</ul></div>
        <div><h3>England: maths</h3><ul>${group("england", "Maths")}</ul></div><div><h3>England: English</h3><ul>${group("england", "Literacy")}</ul></div></div></section>`;
  }
  function render() {
    const C = DATA.courses[0], n = C.sessions.length, groups = [];
    for (let i = 1; i <= n; i += 20) groups.push(`${i}-${Math.min(n, i + 19)}`);
    const v = id => ($(id) ? $(id).value : "");
    app.innerHTML = `<header class="pk-top"><a class="pk-brand" href="./"><img src="assets/brand/app-icon-192.png" alt="" width="32" height="32"><span>PopSpell</span></a>
        <span class="pk-crumb">Tutor courses to print</span><a class="pk-link" href="pack.html">Exam packs →</a></header>
      <main class="pk-main">
        <section class="pk-intro"><h1>${esc(C.title)}</h1>
          <p>A whole course for a tutor, or a parent teaching at home, working with one pupil: ${n} one-hour sessions, ${C.perWeek} a week for ${C.weeks} weeks, from a baseline check to two full sets of mock papers. Each session has a tutor plan, the pupil's sheets, and answers with mark schemes. The <b>parent edition</b> swaps the tutor plans for step-by-step guides in plain words: what to say, the worked example one line at a time, what to say when your child is stuck, how to mark, and when to move on. Every course you make has new questions.</p></section>
        <section class="pk-make">
          <div class="cs-form">
            <label class="pk-who">Pupil's name (optional) <input id="who" maxlength="40" autocomplete="off" value="${esc(made ? made.who : v("who"))}"></label>
            <label class="pk-who">First session <input id="start" type="date" value="${esc(made && made.start ? made.start.toISOString().slice(0, 10) : v("start"))}"></label>
            <label class="pk-who">Edition <select id="edition"><option value="tutor"${made && made.edition === "parent" ? "" : " selected"}>Tutor (a teacher or tutor)</option><option value="parent"${made && made.edition === "parent" && !made.paper ? " selected" : ""}>Parent, teaching at home: step by step</option><option value="paper"${made && made.paper ? " selected" : ""}>Parent, paper only (no internet, no web links)</option></select></label>
            <label class="pk-who">Sessions a week <select id="perWeek">${[1, 2, 3].map(k => `<option${(made ? made.perWeek : C.perWeek) === k ? " selected" : ""}>${k}</option>`).join("")}</select></label>
          </div>
          <button class="pk-btn primary" id="make">${made ? "Make a new course (new questions)" : "Make the course"}</button>
          ${made ? `<div class="pk-ready" aria-live="polite">
            <p><b>Course ${made.code} is ready.</b> Print it in parts: in the print window choose <b>Save as PDF</b> to download, with A4 paper and the default margins. Pupil copies and tutor copies of the same course have matching codes.</p>
            <fieldset class="cs-copy"><legend>Which copy</legend>
              <label><input type="radio" name="copy" value="tutor" checked> ${made.edition === "parent" ? "Parent's copy: step-by-step guides" : "Tutor copy: plans"}, pupil's sheets and answers</label>
              <label><input type="radio" name="copy" value="pupil"> Pupil's sheets only</label>
              <label><input type="radio" name="copy" value="answers"> Plans and answers only</label></fieldset>
            <div class="pk-do"><button class="pk-btn primary" data-print="front">Guide, plan and tracker</button>
              ${groups.map(g => `<button class="pk-btn" data-print="${g}">Sessions ${g.replace("-", " to ")}</button>`).join("")}</div>
            <div class="pk-do"><label class="pk-who">One session <select id="one">${made.sessions.map(m => `<option value="session-${m.n}">${m.n}. ${esc(m.s.t)}</option>`).join("")}</select></label>
              <button class="pk-btn" data-print="one">Print this session</button></div></div>`
            : `<p class="pk-small">It takes a few seconds to make. Then print the guide first, and the sessions in three parts of 20.</p>`}
        </section>
        <section class="pk-pack"><h2>The ${n} sessions</h2><ol class="cs-sessions">${C.sessions.map(s => `<li>${esc(s.t)}</li>`).join("")}</ol></section>
        ${homePacks()}
        <p class="pk-foot">Questions are PopSpell's own, in the exam's style, not past papers. Nothing you type here is saved or sent anywhere.</p>
      </main>`;
    $("make").onclick = async () => {
      const btn = $("make");
      btn.disabled = true; btn.textContent = "Making the course…";
      await new Promise(r => setTimeout(r, 30));
      const d = v("start") ? new Date(`${v("start")}T12:00:00`) : null;
      made = make(C.id, v("who").trim(), { start: d && !isNaN(d) ? d : null, perWeek: Number(v("perWeek")) || C.perWeek, edition: v("edition") === "paper" ? "parent" : v("edition"), paper: v("edition") === "paper" });
      render();
      const first = app.querySelector("[data-print]");
      if (first) first.focus();
    };
    app.querySelectorAll("[data-print]").forEach(b => b.onclick = () => {
      const copy = (app.querySelector('input[name="copy"]:checked') || {}).value || "tutor";
      printPages(b.dataset.print === "one" ? $("one").value : b.dataset.print, copy);
    });
  }
  if (app) render();
  return { make, pagesOf, prepare, mockPaper, draw, use: m => { made = m; return made; }, MOCK_MARKS };
})();
