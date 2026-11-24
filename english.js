/* Adult English (english.html): the lesson list, each lesson one step per screen, and its A4 copies.
   Lessons are in english/*.js, gathered by english-lessons.js. Each step fits a 1366 × 650 window without
   scrolling, so it works on a shared screen; the learner can try every task and press Check. Teacher view
   shows the answers and the teacher's notes. Nothing is saved: a reload starts the lesson again. */
(() => {
  "use strict";
  const E = window.PopEnglish;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const app = $("app");
  const printArea = $("printArea");

  let teacher = false;
  try { teacher = localStorage.getItem("popspell-english-teacher") === "1"; } catch { /* off */ }
  let levelPick = "all";
  try { levelPick = localStorage.getItem("popspell-english-level") || "all"; } catch { /* all */ }
  // What the learner has done in each lesson this visit: work[lessonId][stepIndex]
  const work = {};
  const stepWork = (lesson, i) => ((work[lesson.id] = work[lesson.id] || {})[i] = work[lesson.id][i] || { checked: false });

  const STEP_ICON = { talk: "💬", sort: "🗂️", match: "🔗", read: "📖", grammar: "✏️", choose: "☑️", jumble: "🔤", fix: "🛠️", roleplay: "🎭", write: "📝" };
  const ABC = "ABCDEFGH";

  // ---------- Routes: #  (all lessons)  ·  #<lesson id>/<step number> ----------
  function route() {
    const [id, n] = decodeURIComponent(location.hash.slice(1)).split("/");
    const lesson = id && E.get(id);
    if (!lesson) return home();
    const step = Math.min(Math.max((Number(n) || 1) - 1, 0), lesson.steps.length - 1);
    showLesson(lesson, step);
  }
  window.addEventListener("hashchange", route);

  // ---------- The lesson list ----------
  function home() {
    document.body.className = "en-home";
    document.title = "Adult English · PopSpell";
    const lessons = E.all();
    const levels = E.LEVELS.filter(l => lessons.some(x => x.level === l));
    if (levelPick !== "all" && !levels.includes(levelPick)) levelPick = "all";
    app.innerHTML = `
      <header class="en-top">
        <a class="en-brand" href="./"><img src="assets/brand/app-icon-192.png" alt="" width="32" height="32"><span>PopSpell</span></a>
        <span class="en-crumb">Adult English</span>
      </header>
      <main class="en-list">
        <h1>Adult English</h1>
        <p class="en-lead">Lessons for adults learning English, in British English, from A1 (beginner) to C1 (advanced). Share your screen and go through a lesson one step at a time, or send the learner the lesson's link.
          Every lesson prints as a student copy and a teacher copy with the answers.</p>
        <div class="en-filter" role="group" aria-label="Level">
          <button type="button" class="en-pill${levelPick === "all" ? " on" : ""}" data-level="all" aria-pressed="${levelPick === "all"}">All levels</button>
          ${levels.map(l => `<button type="button" class="en-pill${levelPick === l ? " on" : ""}" data-level="${l}" aria-pressed="${levelPick === l}">${l} ${esc(E.LEVEL_NAMES[l])}</button>`).join("")}
        </div>
        ${levels.filter(l => levelPick === "all" || levelPick === l).map(level => `<section class="en-level"><h2><span class="en-cefr">${level}</span> ${esc(E.LEVEL_NAMES[level])}</h2>
            <div class="en-cards">${lessons.filter(l => l.level === level).map(card).join("")}</div></section>`).join("")}
      </main>`;
    app.querySelectorAll("[data-level]").forEach(b => b.addEventListener("click", () => {
      levelPick = b.dataset.level;
      try { localStorage.setItem("popspell-english-level", levelPick); } catch { /* this visit only */ }
      home();
    }));
    app.querySelectorAll("[data-print]").forEach(b => b.addEventListener("click", () => print(E.get(b.dataset.lesson), b.dataset.print)));
    app.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", () => copyLink(b)));
  }

  const card = l => `
    <article class="en-card">
      <p class="en-card-meta"><span class="en-cefr">${l.level}</span> ${esc(l.topic)} · ${l.minutes} minutes</p>
      <h3>${esc(l.title)}</h3>
      <p class="en-card-focus">Grammar: <b>${esc(l.focus)}</b></p>
      <p class="en-card-steps">${l.steps.map(s => `${STEP_ICON[s.type]} ${esc(s.title)}`).join(" · ")}</p>
      <div class="en-card-do">
        <a class="en-btn primary" href="#${l.id}/1">Start the lesson</a>
        <button class="en-btn" type="button" data-print="student" data-lesson="${l.id}">Student copy</button>
        <button class="en-btn" type="button" data-print="teacher" data-lesson="${l.id}">Teacher copy</button>
        <button class="en-btn" type="button" data-copy="${l.id}">Copy link</button>
      </div>
    </article>`;

  function copyLink(btn) {
    const url = `${location.origin}${location.pathname}#${btn.dataset.copy}/1`;
    const label = btn.textContent;
    const done = () => { btn.textContent = "Link copied"; setTimeout(() => { btn.textContent = label; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => prompt("Copy this link:", url));
    else prompt("Copy this link:", url);
  }

  // ---------- A lesson, one step per screen ----------
  function showLesson(lesson, i) {
    document.body.className = "en-lesson" + (teacher ? " en-teacher" : "");
    document.title = `${lesson.title} · Adult English · PopSpell`;
    const step = lesson.steps[i];
    const last = lesson.steps.length - 1;
    app.innerHTML = `
      <header class="en-top">
        <a class="en-brand" href="#" title="All lessons"><img src="assets/brand/app-icon-192.png" alt="" width="32" height="32"><span>PopSpell</span></a>
        <span class="en-crumb"><a href="#">Adult English</a> › <b>${esc(lesson.title)}</b> <span class="en-cefr">${lesson.level}</span></span>
        <span class="en-top-do">
          <label class="en-switch"><input type="checkbox" id="teacherView"${teacher ? " checked" : ""}> Teacher view</label>
          <button class="en-btn small" type="button" id="printStudent">Print student copy</button>
          <button class="en-btn small" type="button" id="printTeacher">Print teacher copy</button>
        </span>
      </header>
      <nav class="en-steps" aria-label="Lesson steps">${lesson.steps.map((s, k) =>
        `<a href="#${lesson.id}/${k + 1}" class="en-step${k === i ? " now" : ""}"${k === i ? ' aria-current="step"' : ""}><b>${k + 1}</b> ${esc(s.title)}</a>`).join("")}</nav>
      <main class="en-stage" id="stage">
        <div class="en-stage-head"><h1><span aria-hidden="true">${STEP_ICON[step.type]}</span> ${i + 1}. ${esc(step.title)}</h1>
          <span class="en-mins">about ${step.minutes} min</span></div>
        <div class="en-body is-${step.type}" id="body"></div>
      </main>
      ${teacher ? `<aside class="en-note"><b>Teacher note:</b> ${esc(step.note)}</aside>` : ""}
      <footer class="en-foot">
        ${i > 0 ? `<a class="en-btn" href="#${lesson.id}/${i}">← Back</a>` : `<a class="en-btn" href="#">← All lessons</a>`}
        <span class="en-count">Step ${i + 1} of ${lesson.steps.length}</span>
        ${i < last ? `<a class="en-btn primary" href="#${lesson.id}/${i + 2}" id="nextStep">Next →</a>` : `<a class="en-btn primary" href="#">Finish</a>`}
      </footer>`;
    $("teacherView").addEventListener("change", e => {
      teacher = e.target.checked;
      try { localStorage.setItem("popspell-english-teacher", teacher ? "1" : "0"); } catch { /* this visit only */ }
      showLesson(lesson, i);
    });
    $("printStudent").addEventListener("click", () => print(lesson, "student"));
    $("printTeacher").addEventListener("click", () => print(lesson, "teacher"));
    drawStep(lesson, i);
  }

  // The arrow keys move between steps, except while typing or choosing
  document.addEventListener("keydown", e => {
    if (e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const [id, n] = decodeURIComponent(location.hash.slice(1)).split("/");
    const lesson = id && E.get(id);
    if (!lesson) return;
    const k = (Number(n) || 1) + (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0);
    if (k !== (Number(n) || 1) && k >= 1 && k <= lesson.steps.length) { location.hash = `${lesson.id}/${k}`; e.preventDefault(); }
  });

  const checkRow = w => `<div class="en-check">
      <button class="en-btn primary" type="button" data-act="check">Check</button>
      <button class="en-btn" type="button" data-act="reset">Start again</button>
      <span class="en-result" role="status">${w.result || ""}</span></div>`;
  const score = (ok, n) => `${ok} of ${n} right${ok === n ? " 🎉" : ""}`;
  const challenge = step => step.challenge ? `<p class="en-challenge"><b>Extra challenge:</b> ${esc(step.challenge)}</p>` : "";
  const after = (step, w) => `<div class="en-after">${checkRow(w)}${challenge(step)}</div>`;
  // A typed box that is marked after Check (or filled in teacher view)
  const typed = (w, key, answers, show, label, size) => {
    const val = show ? answers[0] : (w.typed[key] || "");
    const mark = (w.checked || show) && val ? (E.accepts(answers, val) ? " good" : " oops") : "";
    return `<input class="en-gap${mark}" data-key="${key}" value="${esc(val)}" aria-label="${esc(label)}" autocomplete="off" autocapitalize="off" spellcheck="false" size="${size || Math.max(4, Math.min(...answers.map(a => a.length)) - 2)}">`;
  };

  function drawStep(lesson, i) {
    const step = lesson.steps[i];
    const w = stepWork(lesson, i);
    w.typed = w.typed || {};
    const body = $("body");
    const show = teacher; // answers are shown in teacher view
    const again = () => drawStep(lesson, i);
    const on = (sel, ev, fn) => body.querySelectorAll(sel).forEach(el => el.addEventListener(ev, e => fn(el, e)));
    const actions = check => {
      on(".en-gap", "input", el => { w.typed[el.dataset.key] = el.value; });
      on(".en-gap", "keydown", (el, e) => { if (e.key === "Enter") body.querySelector('[data-act="check"]').click(); });
      on('[data-act="check"]', "click", () => { w.checked = true; w.result = check(); again(); });
      on('[data-act="reset"]', "click", () => { Object.keys(w).forEach(k => delete w[k]); w.checked = false; again(); });
    };
    const pickReset = () => { w.checked = false; w.result = ""; again(); };

    if (step.type === "talk") {
      body.innerHTML = `<div class="en-talk-l"><p class="en-intro">${esc(step.intro)}</p>
          <ol class="en-talk-q">${step.questions.map(q => `<li>${esc(q)}</li>`).join("")}</ol>
          ${step.write ? `<label class="en-line"><span>${esc(step.write)}</span><input type="text" id="talkWrite" value="${esc(w.text || "")}" autocomplete="off"></label>` : ""}
          ${show ? `<div class="en-teach"><b>More questions:</b> ${step.follow.map(esc).join(" · ")}</div>` : ""}</div>
        <aside class="en-aims"><h2>In this lesson, you will…</h2><ul>${lesson.aims.map(a => `<li>${esc(a)}</li>`).join("")}</ul></aside>`;
      on("#talkWrite", "input", el => { w.text = el.value; });
    }

    if (step.type === "sort") {
      const words = Object.values(step.groups).flat();
      const right = word => Object.keys(step.groups).find(g => step.groups[g].includes(word));
      w.place = w.place || {};
      if (show) words.forEach(x => { w.place[x] = right(x); });
      const chip = word => {
        const mark = w.checked && w.place[word] ? (w.place[word] === right(word) ? " good" : " oops") : "";
        return `<button class="en-chip${w.pick === word ? " picked" : ""}${mark}" type="button" data-word="${esc(word)}" aria-pressed="${w.pick === word}">${esc(word)}</button>`;
      };
      const bank = E.order(words, `${lesson.id}-${i}`).filter(x => !w.place[x]);
      body.innerHTML = `<p class="en-intro">${esc(step.intro)} <span class="en-how">Choose a word, then choose its group.</span></p>
        <div class="en-bank" aria-label="Words to sort">${bank.length ? bank.map(chip).join("") : '<span class="en-how">All sorted.</span>'}</div>
        <div class="en-groups">${Object.keys(step.groups).map(g => `
          <div class="en-group${w.pick ? " ready" : ""}" data-group="${esc(g)}"><button class="en-group-name" type="button" data-group="${esc(g)}">${esc(g)}</button>
            <span class="en-group-words">${words.filter(x => w.place[x] === g).map(chip).join("")}</span></div>`).join("")}</div>
        ${step.tip ? `<p class="en-tip"><b>${esc(step.tipLabel || "🇬🇧 British English")}:</b> ${esc(step.tip)}</p>` : ""}
        ${after(step, w)}`;
      on(".en-chip", "click", (el, e) => {
        e.stopPropagation();
        const word = el.dataset.word;
        if (w.place[word]) { delete w.place[word]; w.checked = false; w.result = ""; } // a placed word goes back to the bank
        else w.pick = w.pick === word ? null : word;
        again();
      });
      on(".en-group", "click", el => { // the whole box, or its name for the keyboard
        if (!w.pick) return;
        w.place[w.pick] = el.dataset.group; w.pick = null; w.checked = false; w.result = "";
        again();
      });
      actions(() => {
        const ok = words.filter(x => w.place[x] === right(x)).length;
        return ok === words.length ? score(ok, words.length) : `${ok} of ${words.length} right. Tap a red word to move it.`;
      });
    }

    if (step.type === "match") {
      // Left A, B, C… each takes the number of its partner on the right (shown in a fixed mixed order)
      const rights = E.order(step.pairs.map((p, k) => k), `${lesson.id}-${i}`);
      w.pick = w.pick || {};
      body.innerHTML = `<p class="en-intro">${esc(step.intro)}</p>
        <div class="en-match">
          <ol class="en-match-l">${step.pairs.map(([l], k) => {
            const pick = show ? rights.indexOf(k) + 1 : w.pick[k];
            const mark = (w.checked || show) && pick ? (rights[pick - 1] === k ? " good" : " oops") : "";
            return `<li class="${mark}"><b>${ABC[k]}</b> <span>${esc(l)}</span>
              <select data-k="${k}" aria-label="${ABC[k]} goes with"><option value="">–</option>${rights.map((r, n) => `<option value="${n + 1}"${pick === n + 1 ? " selected" : ""}>${n + 1}</option>`).join("")}</select></li>`;
          }).join("")}</ol>
          <ol class="en-match-r">${rights.map((k, n) => `<li><b>${n + 1}</b> ${esc(step.pairs[k][1])}</li>`).join("")}</ol>
        </div>${after(step, w)}`;
      on("select", "change", el => { w.pick[el.dataset.k] = Number(el.value) || undefined; pickReset(); });
      actions(() => score(step.pairs.filter((p, k) => rights[w.pick[k] - 1] === k).length, step.pairs.length));
    }

    if (step.type === "read") {
      w.tf = w.tf || {};
      const tf = step.items.filter(x => Array.isArray(x));
      body.innerHTML = `<div class="en-read-text"><h2>${esc(step.heading)}</h2>${step.text.map(p => `<p>${esc(p)}</p>`).join("")}</div>
        <div class="en-read-q"><p class="en-intro">${esc(step.intro)}</p>
          <ol class="en-tf">${step.items.map((item, k) => {
            if (!Array.isArray(item)) { // an open question: the learner answers, then sees a model answer
              return `<li class="en-open"><span><b class="en-n">${k + 1}.</b>${esc(item.q)}</span>
                ${w.checked || show ? `<small class="en-why">${esc(item.a)}</small>` : ""}</li>`;
            }
            const [s, truth, why] = item;
            const pick = show ? truth : w.tf[k];
            const mark = (w.checked || show) && pick !== undefined ? (pick === truth ? "good" : "oops") : "";
            return `<li class="${mark}"><span><b class="en-n">${k + 1}.</b>${esc(s)}</span>
              <span class="en-tf-do">${[true, false].map(v => `<button type="button" class="en-pill${pick === v ? " on" : ""}" data-k="${k}" data-v="${v}" aria-pressed="${pick === v}">${v ? "True" : "False"}</button>`).join("")}</span>
              ${(w.checked && mark === "oops") || show ? `<small class="en-why">${esc(why)}</small>` : ""}</li>`;
          }).join("")}</ol>
          ${after(step, w)}</div>`;
      on(".en-pill", "click", el => { w.tf[el.dataset.k] = el.dataset.v === "true"; pickReset(); });
      actions(() => {
        const ok = step.items.filter((x, k) => Array.isArray(x) && w.tf[k] === x[1]).length;
        return tf.length ? `${score(ok, tf.length)}${tf.length < step.items.length ? " · compare your other answers" : ""}` : "Compare your answers";
      });
    }

    if (step.type === "grammar") {
      let n = 0;
      const sentence = (item, k) => esc(item.text).split("{}").map((part, j, all) => {
        if (j === all.length - 1) return part;
        n += 1;
        return part + typed(w, `${k}-${j}`, item.answers[j], show, `Gap ${n}`);
      }).join("");
      const head = step.head || ["", "Positive", "Negative", "Question"];
      body.innerHTML = `<div class="en-rule">${[].concat(step.rule).map(r => `<p>${esc(r)}</p>`).join("")}
          <table class="en-table"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead>
          <tbody>${step.table.map(r => `<tr>${r.map((c, k) => k ? `<td>${esc(c)}</td>` : `<th>${esc(c)}</th>`).join("")}</tr>`).join("")}</tbody></table>
          ${step.examples ? `<p class="en-eg">${step.examples.map(x => `<i>${esc(x)}</i>`).join(" ")}</p>` : ""}</div>
        <div class="en-gaps"><p class="en-intro">${esc(step.intro)}</p>
          <ol>${step.items.map((item, k) => `<li>${sentence(item, k)}${item.hint ? ` <span class="en-hint">(${esc(item.hint)})</span>` : ""}</li>`).join("")}</ol>
          ${after(step, w)}</div>`;
      actions(() => {
        const keys = step.items.flatMap((item, k) => item.answers.map((a, j) => [`${k}-${j}`, a]));
        return score(keys.filter(([key, a]) => E.accepts(a, w.typed[key])).length, keys.length);
      });
    }

    if (step.type === "choose") {
      w.pick = w.pick || {};
      body.innerHTML = `<p class="en-intro">${esc(step.intro)}</p>
        <ol class="en-choose">${step.items.map(([s, opts, right], k) => {
          const pick = show ? right : w.pick[k];
          const mark = (w.checked || show) && pick !== undefined ? (pick === right ? "good" : "oops") : "";
          return `<li class="${mark}"><span><b class="en-n">${k + 1}.</b>${esc(s)}</span><span class="en-opts">${opts.map((o, j) =>
            `<button type="button" class="en-pill${pick === j ? " on" : ""}" data-k="${k}" data-j="${j}" aria-pressed="${pick === j}">${"abc"[j]}) ${esc(o)}</button>`).join("")}</span></li>`;
        }).join("")}</ol>
        ${after(step, w)}`;
      on(".en-pill", "click", el => { w.pick[el.dataset.k] = Number(el.dataset.j); pickReset(); });
      actions(() => score(step.items.filter(([, , r], k) => w.pick[k] === r).length, step.items.length));
    }

    if (step.type === "jumble") {
      body.innerHTML = `<p class="en-intro">${esc(step.intro)}</p>
        <ol class="en-jumble">${step.words.map((word, k) =>
          `<li><span class="en-mixed">${esc(E.scramble(word))}</span> → ${typed(w, String(k), [word], show, `Word ${k + 1}`, word.length + 3)}</li>`).join("")}</ol>
        ${after(step, w)}`;
      actions(() => score(step.words.filter((word, k) => E.accepts([word], w.typed[k])).length, step.words.length));
    }

    if (step.type === "fix") {
      body.innerHTML = `<p class="en-intro">${esc(step.intro)}</p>
        <ol class="en-fix">${step.items.map(([wrong, right], k) =>
          `<li><span class="en-wrong"><b class="en-n">${k + 1}.</b>${esc(wrong)}</span>${typed(w, String(k), right, show, `Sentence ${k + 1} corrected`, 44)}</li>`).join("")}</ol>
        ${after(step, w)}`;
      actions(() => score(step.items.filter(([, right], k) => E.accepts(right, w.typed[k])).length, step.items.length));
    }

    if (step.type === "roleplay") {
      body.innerHTML = `<p class="en-intro">${esc(step.intro)}</p>
        <div class="en-cards2">${step.cards.map((c, k) => `<section class="en-role">
          <h2>${ABC[k]}: ${esc(c.who)}</h2><p>${esc(c.task)}</p>
          ${c.phrases ? `<ul>${c.phrases.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
          ${k === 1 && step.info ? `<div class="en-info">${step.info.map(x => `<span>${esc(x)}</span>`).join("")}</div>` : ""}</section>`).join("")}</div>
        ${step.game ? `<p class="en-game"><b>${esc(step.game.title)}:</b> ${esc(step.game.how)}</p>` : ""}`;
    }

    if (step.type === "write") {
      const want = step.count ? new RegExp(`\\b${step.count.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, "['’]")}\\b`, "gi") : null;
      body.innerHTML = `<div class="en-write-l"><p class="en-intro">${esc(step.task)}</p>
          <p class="en-prompts">${step.prompts.map(p => `<span>${esc(p)}</span>`).join("")}</p>
          ${show ? `<div class="en-teach"><b>Example:</b> ${esc(step.model)}</div>` : ""}</div>
        <div class="en-write-r"><textarea id="writeBox" aria-label="Your writing" placeholder="${esc(step.start || "")}">${esc(w.text || "")}</textarea>
          <p class="en-result" id="writeCount" role="status"></p></div>`;
      const box = $("writeBox"), out = $("writeCount");
      const tell = () => {
        const words = (box.value.match(/[A-Za-z’']+/g) || []).length;
        const c = want ? (box.value.match(want) || []).length : 0;
        out.textContent = words ? `${words} words${want ? ` · ${step.count} used ${c} time${c === 1 ? "" : "s"}` : ""}` : "";
      };
      box.addEventListener("input", () => { w.text = box.value; tell(); });
      tell();
    }
  }

  // ---------- A4 copies ----------
  // The student copy: the first three steps on page 1, the rest on page 2 (a lesson can set its own pages).
  // The teacher copy is the same pages with the answers in, then a page of notes.
  const line = (n = 1) => Array.from({ length: n }, () => '<div class="p-line"></div>').join("");
  const A = x => `<span class="p-ans">${esc(x)}</span>`;

  function printStep(lesson, step, k, ans) {
    const h = `<h2><b>${k + 1}</b> ${esc(step.title)} <small>${esc(step.intro || step.task || "")}</small></h2>`;
    const extra = step.challenge ? `<p class="p-challenge"><b>Extra challenge:</b> ${esc(step.challenge)}</p>` : "";
    switch (step.type) {
      case "talk": return `${h}<ol class="p-q">${step.questions.map(q => `<li>${esc(q)}</li>`).join("")}</ol>
        ${step.write ? `<p class="p-fill">${esc(step.write)} ${ans ? A("(the learner's own answer)") : '<span class="p-blank wide"></span>'}</p>` : ""}`;
      case "sort": {
        const groups = Object.values(step.groups);
        const rows = Math.max(...groups.map(g => g.length)) + 1; // a spare row to add a word of their own
        return `${h}<p class="p-bank">${E.order(groups.flat(), `${lesson.id}-${k}`).map(esc).join(" · ")}</p>
          <table class="p-sort"><tr>${Object.keys(step.groups).map(g => `<th>${esc(g)}</th>`).join("")}</tr>
          ${Array.from({ length: rows }, (_, r) => `<tr>${groups.map(ws => `<td>${ans && ws[r] ? A(ws[r]) : ""}</td>`).join("")}</tr>`).join("")}</table>
          ${step.tip ? `<p class="p-tip"><b>${esc((step.tipLabel || "British English").replace(/^\S*\s(?=British)/, ""))}:</b> ${esc(step.tip)}</p>` : ""}${extra}`;
      }
      case "match": {
        const rights = E.order(step.pairs.map((p, j) => j), `${lesson.id}-${k}`);
        return `${h}<div class="p-match"><ol>${step.pairs.map(([l], j) => `<li><b>${ABC[j]}</b> ${esc(l)} ${ans ? A(`→ ${rights.indexOf(j) + 1}`) : '<span class="p-box"></span>'}</li>`).join("")}</ol>
          <ol>${rights.map((j, n) => `<li><b>${n + 1}</b> ${esc(step.pairs[j][1])}</li>`).join("")}</ol></div>${extra}`;
      }
      case "read": return `${h}<div class="p-text"><h3>${esc(step.heading)}</h3>${step.text.map(p => `<p>${esc(p)}</p>`).join("")}</div>
        <ol class="p-tf">${step.items.map((item, j) => Array.isArray(item)
          ? `<li><span><b>${j + 1}.</b> ${esc(item[0])}</span><span class="p-boxes">${ans ? A(`${item[1] ? "True" : "False"}: ${item[2]}`) : "True ☐&nbsp;&nbsp; False ☐"}</span></li>`
          : `<li class="p-open"><span><b>${j + 1}.</b> ${esc(item.q)}</span> ${ans ? A(item.a) : '<span class="p-blank grow"></span>'}</li>`).join("")}</ol>${extra}`;
      case "grammar": {
        const head = step.head || ["", "Positive", "Negative", "Question"];
        return `${h}<div class="p-rule">${[].concat(step.rule).map(r => `<p>${esc(r)}</p>`).join("")}
          <table class="p-table"><tr>${head.map(x => `<th>${esc(x)}</th>`).join("")}</tr>
          ${step.table.map(r => `<tr>${r.map((c, j) => j ? `<td>${esc(c)}</td>` : `<th>${esc(c)}</th>`).join("")}</tr>`).join("")}</table>
          ${step.examples ? `<p><i>${step.examples.map(esc).join(" &nbsp; ")}</i></p>` : ""}</div>
        <ol class="p-gaps">${step.items.map(item => `<li>${esc(item.text).split("{}").map((part, j, all) =>
          j === all.length - 1 ? part : part + (ans ? A(item.answers[j][0]) : '<span class="p-blank"></span>')).join("")}${item.hint ? ` <span class="p-hint">(${esc(item.hint)})</span>` : ""}</li>`).join("")}</ol>${extra}`;
      }
      case "choose": return `${h}<ol class="p-choose">${step.items.map(([s, opts, r], j) => `<li><span><b>${j + 1}.</b> ${esc(s)}</span>
          <span>${opts.map((o, j) => ans && j === r ? A(`${"abc"[j]}) ${o}`) : `${"abc"[j]}) ${esc(o)}`).join("&nbsp;&nbsp; ")}</span></li>`).join("")}</ol>${extra}`;
      case "jumble": return `${h}<ol class="p-jumble">${step.words.map(word => `<li><span class="p-mixed">${esc(E.scramble(word))}</span> → ${ans ? A(word) : '<span class="p-blank"></span>'}</li>`).join("")}</ol>${extra}`;
      case "fix": return `${h}<ol class="p-fix">${step.items.map(([wrong, right], j) => `<li><span><b>${j + 1}.</b> ${esc(wrong)}</span> ${ans ? A(right[0]) : '<span class="p-blank grow"></span>'}</li>`).join("")}</ol>${extra}`;
      case "roleplay": return `${h}<div class="p-roles">${step.cards.map((c, j) => `<div class="p-role"><h3>${ABC[j]}: ${esc(c.who)}</h3>
          <p>${esc(c.task)}</p>${c.phrases ? `<ul>${c.phrases.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
          ${j === 1 && step.info ? `<p class="p-info">${step.info.map(x => `<span>${esc(x)}</span>`).join("")}</p>` : ""}</div>`).join("")}</div>
          ${step.game ? `<p class="p-game"><b>${esc(step.game.title)}:</b> ${esc(step.game.how)}</p>` : ""}`;
      case "write": return `${h}<p class="p-prompts">${step.prompts.map(esc).join(" · ")}</p>
        ${ans ? `<p class="p-model">${A(step.model)}</p>` : line(step.lines)}`;
      default: return h;
    }
  }

  function pageHead(lesson, copy, n) {
    return `<header class="p-head"><span class="p-brand">PopSpell · Adult English</span>
      <span class="p-level">${lesson.level} · ${esc(E.LEVEL_NAMES[lesson.level])}</span>
      ${copy === "teacher" ? '<span class="p-tcopy">Teacher copy</span>' : ""}</header>
      ${n === 0 ? `<h1 class="p-title">${esc(lesson.title)}</h1>
      <p class="p-namedate"><span>Name <span class="p-blank wide"></span></span><span>Date <span class="p-blank"></span></span></p>
      <p class="p-aims"><b>In this lesson, you will</b> ${lesson.aims.map(esc).join("; ")}.</p>` : ""}`;
  }

  const pagesOf = lesson => lesson.pages || [[0, 1], [2, 3], lesson.steps.map((s, k) => k).slice(4)];

  function sheets(lesson, copy) {
    const ans = copy === "teacher";
    const pages = pagesOf(lesson).map((steps, n) => `<section class="a4">${pageHead(lesson, copy, n)}
      ${steps.map(k => `<div class="p-step ps-${lesson.steps[k].type}">${printStep(lesson, lesson.steps[k], k, ans)}</div>`).join("")}
      <div class="p-notes" aria-hidden="true"><span>Notes</span></div>
      <footer class="p-foot">${esc(lesson.title)} · page ${n + 1}</footer></section>`);
    if (ans) pages.push(`<section class="a4">${pageHead(lesson, copy, 1)}
      <h1 class="p-title">Teacher notes: ${esc(lesson.title)}</h1>
      <p><b>Level:</b> ${lesson.level} (${esc(E.LEVEL_NAMES[lesson.level])}) · <b>Time:</b> about ${lesson.minutes} minutes · <b>Grammar:</b> ${esc(lesson.focus)}</p>
      <h2>By the end, the learner can</h2><ul>${lesson.aims.map(a => `<li>${esc(a)}</li>`).join("")}</ul>
      <h2>Step by step</h2><ol class="p-plan">${lesson.steps.map(s => `<li><b>${esc(s.title)}</b> (${s.minutes} min). ${esc(s.note)}
        ${s.follow ? `<br><i>More questions:</i> ${s.follow.map(esc).join(" · ")}` : ""}</li>`).join("")}</ol>
      <h2>Listen for</h2><ul>${lesson.errors.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <h2>For a stronger learner</h2><ul>${lesson.stretch.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <footer class="p-foot">${esc(lesson.title)} · teacher notes</footer></section>`);
    return pages.join("");
  }

  function print(lesson, copy) {
    printArea.innerHTML = sheets(lesson, copy);
    printArea.dataset.copy = copy;
    window.print();
  }
  // For the fit check (tools/english-fit.mjs)
  window.__englishSheets = (id, copy) => { printArea.innerHTML = sheets(E.get(id), copy); return printArea.children.length; };
  window.__englishPages = id => pagesOf(E.get(id)).length;

  route();
})();
