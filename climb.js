/* The maths exam climb for a pupil working on their own (climb.html): the GCSE climb, grade 1 to 9 in three
   stages, or with ?course=sqa Scotland's SQA climb (National 4 skills, National 5, Higher, Advanced Higher).
   "My next step" says what to do: the stage check first, then each topic that needs work in the climb's
   order (practice until about three-quarters of the marks), then a mini paper, then the next stage.
   Questions come from the same bank as the teacher's sheets (PopActivities.examBank); every answer shows
   its mark scheme. Progress is kept in this browser only (localStorage): nothing is sent anywhere. */
(() => {
  "use strict";
  // Two courses share this page: the GCSE climb (England), and the SQA climb (Scotland) with ?course=sqa
  // and England's A level climb (Years 12 and 13) with ?course=alevel, and Scotland's Applications of Mathematics
  // climb (National 5 and Higher) with ?course=apps, which work like the SQA one
  const AL = /[?&]course=alevel\b/.test(location.search);
  const APPS = /[?&]course=apps\b/.test(location.search);
  const SQA = AL || APPS || /[?&]course=sqa\b/.test(location.search);
  const X = AL ? window.PopActivities.examBank.alevel : APPS ? window.PopActivities.examBank.apps : SQA ? window.PopActivities.examBank.scotland : window.PopActivities.examBank;
  const NAME = AL ? "A level maths climb" : APPS ? "SQA Applications of Maths climb" : SQA ? "SQA maths climb" : "GCSE maths climb";
  const goal = st => (SQA ? st.goal : st.n === 1 ? "grade 1 to 3" : `grades ${st.grades}`);
  const $ = id => document.getElementById(id);
  const app = $("app");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s).trim().toLowerCase().replace(/[‘’]/g, "'").replace(/[−–]/g, "-").replace(/\s+/g, " ").replace(/^0+(?=\d)/, "");
  const SECURE = 0.75, PAPER_PASS = 0.5, KEY = AL ? "popspell-climb-alevel" : APPS ? "popspell-climb-apps" : SQA ? "popspell-climb-sqa" : "popspell-climb";
  const today = () => new Date().toISOString().slice(0, 10);

  // ---------- Progress, on this device ----------
  const blank = () => ({ stage: 0, checks: {}, topics: {}, papers: {} });
  let data = blank();
  try { data = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { /* a fresh start */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* private window: works until reload */ } };
  const topicState = t => data.topics[t.id] || {};
  const isSecure = t => Boolean(topicState(t).secure);
  const stageOf = n => X.STAGES[n - 1];

  // ---------- My next step ----------
  function nextStep() {
    if (!data.stage) return { kind: "start" };
    const st = stageOf(data.stage);
    if (!data.checks[st.key]) return { kind: "check", st };
    // Topics that lost marks in the check come first, then the rest, each in the climb's order
    const lost = id => (data.checks[st.key].topics[id] || [0, 1]).reduce((got, of) => got < of);
    const open = st.topics.filter(t => !isSecure(t));
    const t = open.find(x => lost(x.id)) || open[0];
    if (t) return { kind: "topic", st, t };
    const papers = data.papers[st.key] || [];
    if (!papers.some(p => p.got / p.of >= PAPER_PASS)) return { kind: "paper", st };
    if (st.n < X.STAGES.length) return { kind: "stage", st, to: stageOf(st.n + 1) };
    return { kind: "done", st };
  }
  const STEP_TEXT = {
    start: () => ["Where are you starting?", `Pick the ${SQA ? "course" : "grade"} you're working at now. Not sure? Start at stage 1: its check is quick, and the climb skips what you already know.`],
    check: s => [`Take the stage ${s.st.n} check`, `One question on each of the ${s.st.topics.length} topics for ${goal(s.st)} (${!SQA && s.st.n === 1 ? 28 : s.st.topics.length} questions). It shows which topics to work on first. Write your working on paper as you go.`],
    topic: s => [`Practise ${s.st.n}.${s.t.n}: ${s.t.title}`, `${s.t.blurb} Ten exam questions; about three-quarters of the marks makes the topic secure.${topicState(s.t).best != null ? ` Your best so far: ${Math.round(topicState(s.t).best * 100)}%.` : ""}`],
    paper: s => ["Do a mini paper", `Every stage ${s.st.n} topic is secure. Ten mixed questions, like the real exam: about half the marks or more and you're ready for the next stage. Topics that lose marks go back on your list.`],
    stage: s => [`Move up to stage ${s.to.n}`, `You've finished stage ${s.st.n}. Stage ${s.to.n} is ${s.to.title.replace(/^Stage \d: /, "")}.${AL ? " Year 13 builds on Year 12: keep its algebra and calculus sharp." : APPS ? " Higher Applications builds on National 5's finance and statistics, and adds a project." : SQA ? (s.to.n === 3 ? " Higher usually follows a National 5 at grade A or B." : s.to.n === 4 ? " Advanced Higher usually follows a Higher at grade A or B." : "") : s.to.n === 3 ? " It's for the Higher tier: check with your teacher which tier you're sitting." : ""}`],
    done: () => ["Keep your marks sharp", `You've climbed all ${["", "", "two", "three", "four"][X.STAGES.length]} stages. Keep doing mini papers, and go back to any topic that loses marks.`]
  };

  // ---------- Home ----------
  function home() {
    document.title = `${NAME} · PopSpell`;
    const s = nextStep(), [title, about] = STEP_TEXT[s.kind](s);
    const action = s.kind === "start" ? `<div class="cl-grade">${X.STAGES.map(st => `<button class="cl-btn" data-start="${st.n}">${(AL ? ["Year 12, or not sure", "Year 13"] : APPS ? ["National 5, or not sure", "Higher"] : SQA ? ["National 4, or not sure", "National 5", "Higher", "Advanced Higher"] : ["Grade 1 to 3, or not sure", "Grade 4 or 5", "Grade 6 or above"])[st.n - 1]}</button>`).join("")}</div>` : "";
    const go = { check: "Start the check", topic: "Start practising", paper: "Start the mini paper", stage: `Go to stage ${s.to ? s.to.n : ""}`, done: "Mini paper" }[s.kind];
    app.innerHTML = `${top("My next step")}
      <main class="cl-home">
        <section class="cl-next" aria-live="polite">
          <span class="cl-label">My next step</span>
          <h1>${esc(title)}</h1>
          <p>${esc(about)}</p>${action}
          ${go ? `<div class="cl-next-do"><button class="cl-btn big" id="go">${go} →</button>${s.kind === "topic" ? `<button class="cl-btn ghost" id="skip">I know this: test me</button>` : ""}</div>` : ""}
        </section>
        <div class="cl-stages${X.STAGES.length === 4 ? " four" : ""}">${X.STAGES.map(stageCard).join("")}</div>
        <div class="cl-foot"><p>Questions are PopSpell's own, ${AL ? "in the A level exam style, marked one mark a step" : SQA ? "in the SQA exam style, marked one step a mark" : "in the GCSE (9 to 1) exam style, with mark schemes"}. Your progress stays in this browser on this device.
          <a href="${SQA ? "climb.html" : "climb.html?course=sqa"}">${SQA ? "Sitting GCSEs in England? The GCSE climb" : "In Scotland? The National 5 to Advanced Higher climb"}</a>${AL ? "" : ` <a href="climb.html?course=alevel">Doing A level? The Year 12 and 13 climb</a>`}${APPS ? "" : ` <a href="climb.html?course=apps">Applications of Maths (Scotland)? Its own climb</a>`}</p>
          <a class="cl-btn small" href="pack.html?stage=${AL ? "alevel" : APPS ? "apps" : SQA ? "sqa" : "gcse"}-${data.stage || 1}">Work on paper: download a pack</a>
          <button class="cl-btn small" id="reset">Start again</button></div>
      </main>`;
    app.querySelectorAll("[data-start]").forEach(b => b.onclick = () => { data.stage = Number(b.dataset.start); save(); home(); });
    if ($("go")) $("go").onclick = () => {
      if (s.kind === "check") return runCheck(s.st);
      if (s.kind === "topic") return runTopic(s.t);
      if (s.kind === "stage") { data.stage = s.to.n; save(); return home(); }
      return runPaper(s.st);
    };
    if ($("skip")) $("skip").onclick = () => runTopic(s.t);
    app.querySelectorAll("[data-topic]").forEach(b => b.onclick = () => runTopic(X.topic(b.dataset.topic)));
    app.querySelectorAll("[data-check]").forEach(b => b.onclick = () => runCheck(stageOf(Number(b.dataset.check))));
    app.querySelectorAll("[data-paper]").forEach(b => b.onclick = () => runPaper(stageOf(Number(b.dataset.paper))));
    app.querySelectorAll("[data-here]").forEach(b => b.onclick = () => { data.stage = Number(b.dataset.here); save(); home(); });
    $("reset").onclick = e => {
      if (e.target.dataset.sure) { data = blank(); save(); return home(); }
      e.target.dataset.sure = "1"; e.target.textContent = "Sure? Press again to clear everything";
    };
  }
  function stageCard(st) {
    const secure = st.topics.filter(isSecure).length, check = data.checks[st.key];
    const row = t => { const s = topicState(t), cls = s.secure ? "secure" : s.best != null ? "started" : "todo";
      return `<li><button class="cl-topic ${cls}" data-topic="${t.id}" title="Practise this topic"><i>${s.secure ? "✓" : s.best != null ? "◐" : "○"}</i><span>${t.n}. ${esc(t.title)}</span><em>${s.best != null ? `${Math.round(s.best * 100)}%` : ""}</em></button></li>`; };
    return `<section class="cl-stage${data.stage === st.n ? " now" : ""}">
      <div class="cl-stage-head"><h2>${esc(st.title)}</h2><span>${secure} / ${st.topics.length} secure</span></div>
      <ul class="cl-topics">${st.topics.map(row).join("")}</ul>
      <div class="cl-stage-do">
        <button class="cl-btn small" data-check="${st.n}">${check ? `Check again (last ${check.got}/${check.of})` : "Stage check"}</button>
        <button class="cl-btn small" data-paper="${st.n}">Mini paper</button>
        ${data.stage === st.n ? "" : `<button class="cl-btn small" data-here="${st.n}">Work on this stage</button>`}
      </div></section>`;
  }
  function top(crumb, right = "") {
    return `<header class="cl-top"><a class="cl-brand" href="./"><img src="assets/brand/app-icon-192.png" alt="" width="32" height="32"><span>PopSpell</span></a>
      <span class="cl-crumb">${NAME} · <b>${esc(crumb)}</b></span><div class="cl-top-do">${right}</div></header>`;
  }

  // ---------- Running a set of questions: the check, a topic, a mini paper ----------
  function run(title, items, done) {
    const qs = items.map(it => ({ it, q: X.online(it) })), got = [];
    let i = 0;
    const show = () => {
      const { it, q } = qs[i], total = qs.reduce((t, x) => t + x.it.marks, 0), sofar = got.reduce((t, m) => t + m, 0);
      app.innerHTML = `${top(title, `<button class="cl-btn small" id="stop">Stop and go back</button>`)}
        <main class="cl-run">
          <div class="cl-meta"><span>Question ${i + 1} of ${qs.length}</span><span class="cl-chip">${it.marks} mark${it.marks > 1 ? "s" : ""}</span>
            <span class="cl-chip ${it.calc ? "calc" : "nocalc"}">${it.calc ? "Calculator allowed" : "No calculator"}</span>${it.topic ? `<span>${esc(it.topic.short)}</span>` : ""}</div>
          <p class="cl-q">${esc(it.q.replace(/ \([^()]*\)$/, m => (it.unit && m === ` (${it.unit})` ? "" : m)))}</p>
          ${it.pic ? `<div class="cl-pic">${it.pic}</div>` : ""}
          ${q.options ? `<div class="cl-opts">${q.options.map((o, k) => `<button class="cl-opt" data-k="${k}">${esc(o)}</button>`).join("")}</div>`
            : `<div class="cl-answer">${it.unit === "£" ? '<span class="cl-unit">£</span>' : ""}<input id="ans" autocomplete="off" inputmode="${q.input === "numeric" ? "numeric" : q.input === "decimal" ? "decimal" : "text"}" aria-label="Your answer">${it.unit && it.unit !== "£" ? `<span class="cl-unit">${esc(it.unit)}</span>` : ""}<button class="cl-btn primary" id="mark">Mark it</button></div>
              <p class="cl-hint">Work it out on paper first. Type a minus as -, a fraction as 3/4.</p>`}
          <div id="fb"></div>
        </main>
        <footer class="cl-runfoot"><div class="cl-bar" aria-hidden="true"><span style="width:${Math.round(i / qs.length * 100)}%"></span></div><span>${sofar} of ${total} marks so far</span>
          <button class="cl-btn primary" id="next" disabled>${i + 1 < qs.length ? "Next question" : "See my result"}</button></footer>`;
      $("stop").onclick = home;
      const mark = right => {
        got[i] = right ? it.marks : 0;
        $("fb").innerHTML = `<div class="cl-mark ${right ? "good" : "oops"}"><p><b>${right ? `Right: ${it.marks} mark${it.marks > 1 ? "s" : ""}.` : `Not this time. The answer is ${esc(q.answer)}.`}</b>${right ? "" : " In the exam you'd still get the marks for each right step of your working."}</p><p><b>${SQA ? "Marking" : "Mark scheme"}:</b> ${esc(it.scheme)}</p></div>`;
        $("next").disabled = false; $("next").focus();
      };
      if (q.options) app.querySelectorAll(".cl-opt").forEach(b => b.onclick = () => {
        const pick = q.options[Number(b.dataset.k)], right = pick === q.answer;
        app.querySelectorAll(".cl-opt").forEach(x => { x.disabled = true; if (q.options[Number(x.dataset.k)] === q.answer) x.classList.add("good"); });
        if (!right) b.classList.add("oops");
        mark(right);
      });
      else {
        const inp = $("ans"); inp.focus();
        const check = () => { if (!inp.value.trim()) return inp.focus(); inp.disabled = true; $("mark").disabled = true;
          mark([q.answer].concat(q.accept || []).some(a => norm(a) === norm(inp.value))); };
        $("mark").onclick = check;
        inp.onkeydown = e => { if (e.key === "Enter") check(); };
      }
      $("next").onclick = () => { if (++i < qs.length) show(); else done(qs.map((x, k) => ({ it: x.it, got: got[k] || 0 }))); };
    };
    show();
  }
  const sum = (list, f) => list.reduce((t, x) => t + f(x), 0);

  function runCheck(st) {
    const items = st.n === 1 ? X.baseline() : X.check(st.key);
    run(`Stage ${st.n} check`, items, res => {
      const topics = {};
      res.forEach(r => { const id = r.it.topic.id, t = topics[id] || [0, 0]; topics[id] = [t[0] + r.got, t[1] + r.it.marks]; });
      const got = sum(res, r => r.got), of = sum(res, r => r.it.marks);
      data.checks[st.key] = { date: today(), got, of, topics };
      if (!data.stage || data.stage < st.n) data.stage = st.n;
      save();
      const lost = st.topics.filter(t => topics[t.id] && topics[t.id][0] < topics[t.id][1]);
      result(`Stage ${st.n} check`, got, of, lost.length ? `${lost.length} topic${lost.length > 1 ? "s" : ""} to work on first, in this order. The others still get a practice set to make sure.` : "Full marks on every topic. Each topic still gets one practice set to make sure.",
        st.topics.map(t => [`${t.n}. ${t.short}`, topics[t.id] ? `${topics[t.id][0]} / ${topics[t.id][1]}` : "", topics[t.id] && topics[t.id][0] < topics[t.id][1] ? "lost" : "full"]));
    });
  }
  function runTopic(t) {
    run(`${t.stage.n}.${t.n} ${t.short}`, X.items(t.id, 10).sort((a, b) => a.marks - b.marks), res => {
      const got = sum(res, r => r.got), of = sum(res, r => r.it.marks), pc = got / of, s = data.topics[t.id] || {};
      data.topics[t.id] = { best: Math.max(s.best || 0, pc), last: pc, date: today(), secure: s.secure || pc >= SECURE };
      save();
      const skills = [...new Set(res.filter(r => !r.got).map(r => r.it.skill))];
      result(`${t.n}. ${t.title}`, got, of, pc >= SECURE ? "Secure: this topic is ticked off. Well done." : `Not secure yet (about three-quarters is the aim). Read the mark schemes for the ones you missed, note them in your notebook, and try a new set${pc < 0.5 ? ": if it's still under half after a few tries, this topic needs teaching, so ask a teacher or tutor" : ""}.`,
        skills.map(sk => [sk, "to practise", "lost"]), t);
    });
  }
  function runPaper(st) {
    const items = X.STAGES[st.n - 1].topics.slice().sort(() => Math.random() - 0.5).slice(0, 10).sort((a, b) => a.n - b.n)
      .map(t => Object.assign(X.items(t.id, 1, it => it.marks >= 2)[0] || X.items(t.id, 1)[0], { topic: t }));
    run(`Stage ${st.n} mini paper`, items, res => {
      const got = sum(res, r => r.got), of = sum(res, r => r.it.marks);
      (data.papers[st.key] = data.papers[st.key] || []).push({ date: today(), got, of });
      // A topic that lost marks goes back on the list
      res.filter(r => !r.got).forEach(r => { if (data.topics[r.it.topic.id]) data.topics[r.it.topic.id].secure = false; });
      save();
      result(`Stage ${st.n} mini paper`, got, of, got / of >= PAPER_PASS ? "A good paper: about half or more. Topics that lost marks are back on your list." : "Under half this time. The topics that lost marks are back on your list: practise them, then try another paper.",
        res.map(r => [`${r.it.topic.n}. ${r.it.topic.short}`, `${r.got} / ${r.it.marks}`, r.got ? "full" : "lost"]));
    });
  }
  function result(title, got, of, verdict, rows, again) {
    app.innerHTML = `${top(title)}
      <main class="cl-result">
        <p class="cl-score">${got} / ${of} marks (${Math.round(got / of * 100)}%)</p>
        <p class="cl-verdict">${esc(verdict)}</p>
        ${rows.length ? `<ul class="cl-rows">${rows.map(([a, b, c]) => `<li><span>${esc(a)}</span><span class="${c}">${esc(b)}</span></li>`).join("")}</ul>` : ""}
        <div class="cl-do"><button class="cl-btn primary big" id="home">My next step →</button>${again ? `<button class="cl-btn big" id="again">Another set on this topic</button>` : ""}</div>
      </main>`;
    $("home").onclick = home;
    if (again) $("again").onclick = () => runTopic(again);
    $("home").focus();
  }

  home();
})();
