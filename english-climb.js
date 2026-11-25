/* The English exam climb for a pupil working on their own (english-climb.html): GCSE English Language from
   grade 1 to 9 in three stages, with English Literature alongside; with ?course=sqa, Scotland's climb.
   "My next step" says what to do: the stage check first, then each topic that needs work in the climb's
   order (practice until about three-quarters right), then the stage's writing tasks (planned, written on
   paper or here, checked against a list, then compared with a model answer), then a mini paper, then the
   next stage. Questions come from the same bank as the teacher's sheets (PopEnglishExam); every answer
   shows why. Progress is kept in this browser only (localStorage): nothing is sent anywhere. */
(() => {
  "use strict";
  const X = window.PopEnglishExam;
  const KEY_COURSE = /[?&]course=sqa\b/.test(location.search) && X.course("sqa") ? "sqa" : "gcse";
  const C = X.course(KEY_COURSE);
  const NAME = C.name;
  const $ = id => document.getElementById(id);
  const app = $("app");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const SECURE = 0.75, PAPER_PASS = 0.6, KEY = KEY_COURSE === "sqa" ? "popspell-english-climb-sqa" : "popspell-english-climb";
  const today = () => new Date().toISOString().slice(0, 10);
  const STAGES = C.STAGES, LIT = C.LIT;

  // ---------- Progress, on this device ----------
  const blank = () => ({ stage: 0, checks: {}, topics: {}, papers: {}, writing: {}, drafts: {} });
  let data = blank();
  try { data = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { /* a fresh start */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* private window: works until reload */ } };
  const topicState = t => data.topics[t.id] || {};
  const isSecure = t => Boolean(topicState(t).secure);
  const stageOf = n => STAGES[n - 1];
  const tasksOf = st => C.WRITING.filter(w => w.stage === st.key);

  // ---------- My next step ----------
  function nextStep() {
    if (!data.stage) return { kind: "start" };
    const st = stageOf(data.stage);
    if (!data.checks[st.key]) return { kind: "check", st };
    // Topics that lost marks in the check come first, then the rest, each in the climb's order
    const lost = id => { const r = data.checks[st.key].topics[id]; return r ? r[0] < r[1] : true; };
    const open = st.topics.filter(t => !isSecure(t));
    const t = open.find(x => lost(x.id)) || open[0];
    if (t) return { kind: "topic", st, t };
    const w = tasksOf(st).find(task => !data.writing[task.id]);
    if (w) return { kind: "write", st, w };
    const papers = data.papers[st.key] || [];
    if (!papers.some(p => p.got / p.of >= PAPER_PASS)) return { kind: "paper", st };
    if (st.n < STAGES.length) return { kind: "stage", st, to: stageOf(st.n + 1) };
    return { kind: "done", st };
  }
  const STEP_TEXT = {
    start: () => ["Where are you starting?", "Pick the grade you’re working at now. Not sure? Start at stage 1: its check is quick, and the climb skips what you already know."],
    check: s => [`Take the stage ${s.st.n} check`, `${s.st.n === 1 ? "Two questions" : "One question"} on each of the ${s.st.topics.length} topics for ${s.st.goal}. It shows which topics to work on first.`],
    topic: s => [`Practise ${s.st.n}.${s.t.n}: ${s.t.title}`, `${s.t.blurb} Eight exam-style questions; six or more right makes the topic secure.${topicState(s.t).best != null ? ` Your best so far: ${Math.round(topicState(s.t).best * 100)}%.` : ""}`],
    write: s => [`Writing task: ${s.w.kind.toLowerCase()}`, `Half of every paper is the writing question. Plan, write for about ${s.w.minutes - 10} minutes, check your work against a list, then compare it with a model answer at ${s.w.grade}.`],
    paper: s => ["Do a mini paper", `Every stage ${s.st.n} topic is secure. Ten mixed questions: six or more right and you’re ready for the next stage. Topics that lose marks go back on your list. For a full paper with longer answers, print the mini paper from your teacher’s pack.`],
    stage: s => [`Move up to stage ${s.to.n}`, `You’ve finished stage ${s.st.n}. Stage ${s.to.n} is ${s.to.title.replace(/^Stage \d: /, "")}: ${s.to.about}`],
    done: () => ["Keep your marks sharp", "You’ve climbed every stage. Keep doing mini papers and writing tasks, and go back to any topic that loses marks."]
  };

  // ---------- Home ----------
  function home() {
    document.title = `${NAME} · PopSpell`;
    const s = nextStep(), [title, about] = STEP_TEXT[s.kind](s);
    const action = s.kind === "start" ? `<div class="cl-grade">${STAGES.map(st => `<button class="cl-btn" data-start="${st.n}">${esc(C.startLabels ? C.startLabels[st.n - 1] : ["Grade 1 to 3, or not sure", "Grade 4 or 5", "Grade 6 or above"][st.n - 1])}</button>`).join("")}</div>` : "";
    const go = { check: "Start the check", topic: "Start practising", write: "Start the writing task", paper: "Start the mini paper", stage: `Go to stage ${s.to ? s.to.n : ""}`, done: "Mini paper" }[s.kind];
    app.innerHTML = `${top("My next step", `<button class="cl-btn small" id="exam">What the exam expects</button>`)}
      <main class="cl-home">
        <section class="cl-next" aria-live="polite">
          <span class="cl-label">My next step</span>
          <h1>${esc(title)}</h1>
          <p>${esc(about)}</p>${action}
          ${go ? `<div class="cl-next-do"><button class="cl-btn big" id="go">${go} →</button>${s.kind === "topic" ? `<button class="cl-btn ghost" id="skip">I know this: test me</button>` : ""}</div>` : ""}
        </section>
        <div class="cl-stages">${STAGES.map(stageCard).join("")}</div>
        ${LIT ? litCard() : ""}
        <div class="cl-foot"><p>Questions are PopSpell’s own, on PopSpell’s own texts and public-domain extracts, in the ${esc(C.exam)} exam style. Your progress stays in this browser on this device.${C.other ? ` <a href="${C.other[1]}">${esc(C.other[0])}</a>` : ""}</p>
          <button class="cl-btn small" id="reset">Start again</button></div>
      </main>`;
    app.querySelectorAll("[data-start]").forEach(b => b.onclick = () => { data.stage = Number(b.dataset.start); save(); home(); });
    if ($("go")) $("go").onclick = () => {
      if (s.kind === "check") return runCheck(s.st);
      if (s.kind === "topic") return runTopic(s.t);
      if (s.kind === "write") return writeTask(s.w);
      if (s.kind === "stage") { data.stage = s.to.n; save(); return home(); }
      return runPaper(s.st);
    };
    if ($("skip")) $("skip").onclick = () => runTopic(s.t);
    $("exam").onclick = examPage;
    app.querySelectorAll("[data-topic]").forEach(b => b.onclick = () => runTopic(X.topic(b.dataset.topic)));
    app.querySelectorAll("[data-check]").forEach(b => b.onclick = () => runCheck(stageOf(Number(b.dataset.check))));
    app.querySelectorAll("[data-paper]").forEach(b => b.onclick = () => runPaper(stageOf(Number(b.dataset.paper))));
    app.querySelectorAll("[data-write]").forEach(b => b.onclick = () => writeTask(C.WRITING.find(w => w.id === b.dataset.write)));
    app.querySelectorAll("[data-here]").forEach(b => b.onclick = () => { data.stage = Number(b.dataset.here); save(); home(); });
    $("reset").onclick = e => {
      if (e.target.dataset.sure) { data = blank(); save(); return home(); }
      e.target.dataset.sure = "1"; e.target.textContent = "Sure? Press again to clear everything";
    };
  }
  const topicRow = t => { const s = topicState(t), cls = s.secure ? "secure" : s.best != null ? "started" : "todo";
    return `<li><button class="cl-topic ${cls}" data-topic="${t.id}" title="Practise this topic"><i>${s.secure ? "✓" : s.best != null ? "◐" : "○"}</i><span>${t.n}. ${esc(t.title)}</span><em>${s.best != null ? `${Math.round(s.best * 100)}%` : ""}</em></button></li>`; };
  function stageCard(st) {
    const secure = st.topics.filter(isSecure).length, check = data.checks[st.key];
    return `<section class="cl-stage${data.stage === st.n ? " now" : ""}">
      <div class="cl-stage-head"><h2>${esc(st.title)}</h2><span>${secure} / ${st.topics.length} secure</span></div>
      <ul class="cl-topics">${st.topics.map(topicRow).join("")}</ul>
      <div class="cl-stage-do">
        <button class="cl-btn small" data-check="${st.n}">${check ? `Check again (last ${check.got}/${check.of})` : "Stage check"}</button>
        ${tasksOf(st).map(w => `<button class="cl-btn small" data-write="${w.id}">${data.writing[w.id] ? "✓ " : ""}${esc(w.kind)}</button>`).join("")}
        <button class="cl-btn small" data-paper="${st.n}">Mini paper</button>
        ${data.stage === st.n ? "" : `<button class="cl-btn small" data-here="${st.n}">Work here</button>`}
      </div></section>`;
  }
  function litCard() {
    return `<section class="cl-stage ec-lit"><div class="cl-stage-head"><h2>${esc(LIT.title)}</h2><span>${esc(LIT.about)}</span></div>
      <ul class="cl-topics ec-lit-topics">${LIT.topics.map(topicRow).join("")}</ul></section>`;
  }
  function top(crumb, right = "") {
    return `<header class="cl-top"><a class="cl-brand" href="./"><img src="assets/brand/app-icon-192.png" alt="" width="32" height="32"><span>PopSpell</span></a>
      <span class="cl-crumb">${esc(NAME)} · <b>${esc(crumb)}</b></span><div class="cl-top-do">${right}</div></header>`;
  }

  // ---------- A text beside its question ----------
  function textHTML(it) {
    const p = X.shown(it);
    if (!p) return "";
    let body = p.text.split(/\n\n+/).map(par => `<p>${esc(par).replace(/\n/g, "<br>")}</p>`).join("");
    if (p.mark) body = body.replace(esc(p.mark), m => `<mark>${m}</mark>`);
    return `<article class="ec-text${p.kind === "poem" || p.kind === "play" ? " verse" : ""}"><p class="ec-src"><b>${esc(p.title)}</b> · ${esc(p.by)}</p>${body}</article>`;
  }

  // ---------- Running a set of questions: the check, a topic, a mini paper ----------
  function run(title, items, done) {
    const got = [];
    let i = 0;
    const show = () => {
      const it = items[i], opts = X.shuffle([it.a].concat(it.o)), text = textHTML(it);
      app.innerHTML = `${top(title, `<button class="cl-btn small" id="stop">Stop and go back</button>`)}
        <main class="cl-run ec-run${text ? " with-text" : ""}">
          ${text}
          <div class="ec-side">
            <div class="cl-meta"><span>Question ${i + 1} of ${items.length}</span><span class="cl-chip">${esc(it.topic.short)}</span></div>
            <p class="cl-q">${esc(it.q)}</p>
            <div class="cl-opts ec-opts">${opts.map((o, k) => `<button class="cl-opt" data-k="${k}">${esc(o)}</button>`).join("")}</div>
            <div id="fb"></div>
          </div>
        </main>
        <footer class="cl-runfoot"><div class="cl-bar" aria-hidden="true"><span style="width:${Math.round(i / items.length * 100)}%"></span></div><span>${got.filter(Boolean).length} right so far</span>
          <button class="cl-btn primary" id="next" disabled>${i + 1 < items.length ? "Next question" : "See my result"}</button></footer>`;
      $("stop").onclick = home;
      app.querySelectorAll(".cl-opt").forEach(b => b.onclick = () => {
        const right = opts[Number(b.dataset.k)] === it.a;
        app.querySelectorAll(".cl-opt").forEach(x => { x.disabled = true; if (opts[Number(x.dataset.k)] === it.a) x.classList.add("good"); });
        if (!right) b.classList.add("oops");
        got[i] = right ? 1 : 0;
        $("fb").innerHTML = `<div class="cl-mark ${right ? "good" : "oops"}"><p><b>${right ? "Right." : "Not this time."}</b> ${esc(it.why)}</p></div>`;
        $("next").disabled = false; $("next").focus();
      });
      $("next").onclick = () => { if (++i < items.length) show(); else done(items.map((it2, k) => ({ it: it2, got: got[k] || 0 }))); };
    };
    show();
  }
  const sum = (list, f) => list.reduce((t, x) => t + f(x), 0);

  function runCheck(st) {
    run(`Stage ${st.n} check`, X.check(st.key), res => {
      const topics = {};
      res.forEach(r => { const id = r.it.topic.id, t = topics[id] || [0, 0]; topics[id] = [t[0] + r.got, t[1] + 1]; });
      const got = sum(res, r => r.got), of = res.length;
      data.checks[st.key] = { date: today(), got, of, topics };
      if (!data.stage || data.stage < st.n) data.stage = st.n;
      save();
      const lost = st.topics.filter(t => topics[t.id] && topics[t.id][0] < topics[t.id][1]);
      result(`Stage ${st.n} check`, got, of, lost.length ? `${lost.length} topic${lost.length > 1 ? "s" : ""} to work on first, in this order. The others still get one practice set to make sure.` : "Every question right. Each topic still gets one practice set to make sure.",
        st.topics.map(t => [`${t.n}. ${t.short}`, topics[t.id] ? `${topics[t.id][0]} / ${topics[t.id][1]}` : "", topics[t.id] && topics[t.id][0] < topics[t.id][1] ? "lost" : "full"]));
    });
  }
  function runTopic(t) {
    run(`${t.stage.optional ? "Literature" : `${t.stage.n}.${t.n}`} ${t.short}`, X.items(t.id, 8), res => {
      const got = sum(res, r => r.got), of = res.length, pc = got / of, s = data.topics[t.id] || {};
      data.topics[t.id] = { best: Math.max(s.best || 0, pc), last: pc, date: today(), secure: s.secure || pc >= SECURE };
      save();
      const skills = [...new Set(res.filter(r => !r.got).map(r => r.it.sk))];
      result(`${t.n}. ${t.title}`, got, of, pc >= SECURE ? "Secure: this topic is ticked off. Now try its exam question on paper (your teacher’s pack has it, with a model answer)." : `Not secure yet (six out of eight is the aim). Read the reasons for the ones you missed, note them, and try a new set${pc < 0.5 ? ": if it’s still under half after a few tries, this topic needs teaching, so ask a teacher or tutor" : ""}.`,
        skills.map(sk => [sk, "to practise", "lost"]), t);
    });
  }
  function runPaper(st) {
    run(`Stage ${st.n} mini paper`, X.mixed(st.key, 10), res => {
      const got = sum(res, r => r.got), of = res.length;
      (data.papers[st.key] = data.papers[st.key] || []).push({ date: today(), got, of });
      res.filter(r => !r.got).forEach(r => { if (data.topics[r.it.topic.id]) data.topics[r.it.topic.id].secure = false; });
      save();
      result(`Stage ${st.n} mini paper`, got, of, got / of >= PAPER_PASS ? "A good paper. Topics that lost marks are back on your list." : "Under six this time. The topics that lost marks are back on your list: practise them, then try another paper.",
        res.map(r => [`${r.it.topic.n}. ${r.it.topic.short}`, r.got ? "right" : "missed", r.got ? "full" : "lost"]));
    });
  }
  function result(title, got, of, verdict, rows, again) {
    app.innerHTML = `${top(title)}
      <main class="cl-result">
        <p class="cl-score">${got} / ${of} (${Math.round(got / of * 100)}%)</p>
        <p class="cl-verdict">${esc(verdict)}</p>
        ${rows.length ? `<ul class="cl-rows">${rows.map(([a, b, c]) => `<li><span>${esc(a)}</span><span class="${c}">${esc(b)}</span></li>`).join("")}</ul>` : ""}
        <div class="cl-do"><button class="cl-btn primary big" id="home">My next step →</button>${again ? `<button class="cl-btn big" id="again">Another set on this topic</button>` : ""}</div>
      </main>`;
    $("home").onclick = home;
    if (again) $("again").onclick = () => runTopic(again);
    $("home").focus();
  }

  // ---------- A writing task: plan, write, check against the list, compare with the model ----------
  function writeTask(w) {
    const st = STAGES.find(x => x.key === w.stage), list = C.CHECK[w.stage];
    let step = "plan", started = 0, timer = 0;
    const draft = () => data.drafts[w.id] || "";
    const words = s => (s.trim().match(/\S+/g) || []).length;
    const show = () => {
      clearInterval(timer);
      const head = `<div class="ec-task"><span class="cl-chip">${esc(w.paper)} · ${w.minutes} minutes · 40 marks</span><h1>${esc(w.q)}</h1></div>`;
      let body = "", foot = "";
      if (step === "plan") {
        body = `${head}<div class="ec-cols"><section><h2>Plan (about 5 minutes)</h2><ol class="ec-list">${w.plan.map(p => `<li>${esc(p)}</li>`).join("")}</ol></section>
          <section><h2>How it’s marked</h2><p class="ec-small">${esc(C.EXAM.writing)}</p><h2>This stage’s list (${esc(list.goal)})</h2><ul class="ec-list ec-small">${list.content.slice(0, 4).concat(list.accuracy.slice(0, 3)).map(p => `<li>${esc(p)}</li>`).join("")}</ul></section></div>`;
        foot = `<button class="cl-btn" id="paper">I’ll write on paper</button><button class="cl-btn primary" id="here">Write it here →</button>`;
      } else if (step === "write") {
        body = `${head}<textarea id="draft" class="ec-draft" spellcheck="false" aria-label="Your writing">${esc(draft())}</textarea>`;
        foot = `<span id="clock" class="ec-clock"></span><span id="count" class="ec-small"></span><button class="cl-btn primary" id="done">I’ve finished: check it →</button>`;
      } else if (step === "check") {
        const box = (items, set) => items.map((p, k) => `<label class="ec-tick"><input type="checkbox" data-set="${set}" data-k="${k}"> <span>${esc(p)}</span></label>`).join("");
        body = `${head}<p class="ec-small">Read your writing again${draft() ? " (it’s saved on this device)" : ""}. Tick only what is really true. Be honest: it’s for you.</p>
          <div class="ec-cols"><section><h2>Content and organisation</h2>${box(list.content, "c")}</section><section><h2>Accuracy</h2>${box(list.accuracy, "a")}</section></div>`;
        foot = `<button class="cl-btn primary" id="model">See the model answer →</button>`;
      } else {
        const ticked = data.writing[w.id] ? data.writing[w.id].ticked : 0, total = list.content.length + list.accuracy.length;
        body = `${head}<div class="ec-cols ec-model-cols"><section class="ec-model"><h2>Model answer (${esc(w.grade)})</h2>${w.model.split(/\n\n+/).map(p => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("")}</section>
          <section><h2>You ticked ${ticked} of ${total}</h2><p class="ec-small">${ticked >= total - 2 ? `That’s the ${esc(list.goal)} standard for this list. Ask a teacher to mark it to be sure.` : "Pick the two unticked points that matter most and use them in your next piece."}</p><h2>Why the model works</h2><ul class="ec-list ec-small">${w.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul></section></div>`;
        foot = `<button class="cl-btn primary" id="home2">My next step →</button>`;
      }
      app.innerHTML = `${top(`${st.title.replace(/:.*/, "")} writing: ${w.kind}`, `<button class="cl-btn small" id="stop">Stop and go back</button>`)}
        <main class="cl-run ec-write">${body}</main><footer class="cl-runfoot ec-foot">${foot}</footer>`;
      $("stop").onclick = () => { clearInterval(timer); home(); };
      if ($("paper")) $("paper").onclick = () => { step = "check"; show(); };
      if ($("here")) $("here").onclick = () => { step = "write"; started = Date.now(); show(); };
      if ($("draft")) {
        const d = $("draft"), tick = () => {
          const left = Math.max(0, (w.minutes - 5) * 60 - Math.round((Date.now() - started) / 1000));
          $("clock").textContent = left ? `About ${Math.ceil(left / 60)} minutes left (5 to check)` : "Time to check your work";
          $("count").textContent = `${words(d.value)} words`;
        };
        d.oninput = () => { data.drafts[w.id] = d.value; save(); tick(); };
        tick(); timer = setInterval(tick, 15000); d.focus();
      }
      if ($("done")) $("done").onclick = () => { step = "check"; show(); };
      if ($("model")) $("model").onclick = () => {
        const ticked = app.querySelectorAll(".ec-tick input:checked").length;
        data.writing[w.id] = { date: today(), ticked }; save(); step = "model"; show();
      };
      if ($("home2")) $("home2").onclick = home;
    };
    show();
  }

  // ---------- What the exam expects ----------
  function examPage() {
    const E = C.EXAM;
    app.innerHTML = `${top("What the exam expects", `<button class="cl-btn small" id="stop">Back</button>`)}
      <main class="cl-run ec-exam">
        <div class="ec-cols">${E.papers.map(p => `<section><h2>${esc(p.name)}</h2><p class="ec-small">${esc(p.time)} · ${p.marks} marks · ${esc(p.text)}</p>
          <table class="ec-table"><tr><th>Q</th><th>What it asks</th><th>Marks</th><th>Time</th></tr>${p.qs.map(q => `<tr><td>${esc(q[0])}</td><td>${esc(q[1])}</td><td>${q[2]}</td><td>${esc(q[3])}</td></tr>`).join("")}</table></section>`).join("")}</div>
        <div class="ec-cols"><section><h2>What each grade looks like</h2>${C.GRADES.map(([g, d]) => `<p class="ec-small"><b>${esc(g)}:</b> ${esc(d)}</p>`).join("")}</section>
          <section><h2>On the day</h2><ul class="ec-list ec-small"><li>${esc(E.reading)}</li><li>${esc(E.writing)}</li><li>About a minute a mark. Never leave a question blank: a short answer can still score.</li><li>${esc(E.boards)}</li></ul></section></div>
      </main>`;
    $("stop").onclick = home;
  }

  // For the screen check (tools/exam-fit.mjs): one question of the bank on screen, by "topic-id:index"
  window.__climbShow = key => { const [id, n] = key.split(":"); const t = X.topic(id); run(t.title, [t.items[Number(n)]], home); };

  home();
})();
