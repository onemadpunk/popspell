/* Adult English (english.html): the lesson list, each lesson one step per screen, and its A4 copies.
   Lessons are in english-lessons.js. Each step fits a 1366 × 650 window without scrolling, so it works
   on a shared screen; the learner can try every task and press Check. Teacher view shows the answers and
   the teacher's notes. Nothing is saved: a reload starts the lesson again. */
(() => {
  "use strict";
  const E = window.PopEnglish;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const app = $("app");
  const printArea = $("printArea");

  let teacher = false;
  try { teacher = localStorage.getItem("popspell-english-teacher") === "1"; } catch { /* off */ }
  // What the learner has done in each lesson this visit: work[lessonId][stepIndex]
  const work = {};
  const stepWork = (lesson, i) => ((work[lesson.id] = work[lesson.id] || {})[i] = work[lesson.id][i] || { checked: false });

  const STEP_ICON = { talk: "💬", sort: "🗂️", read: "📖", grammar: "✏️", choose: "☑️", roleplay: "🎭", write: "📝" };

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
    app.innerHTML = `
      <header class="en-top">
        <a class="en-brand" href="./"><img src="assets/brand/app-icon-192.png" alt="" width="32" height="32"><span>PopSpell</span></a>
        <span class="en-crumb">Adult English</span>
      </header>
      <main class="en-list">
        <h1>Adult English</h1>
        <p class="en-lead">Lessons for adults learning English, in British English. Share your screen and go through a lesson one step at a time, or send the learner the lesson's link.
          Every lesson prints as a student copy and a teacher copy with the answers.</p>
        ${E.LEVELS.map(level => {
          const here = lessons.filter(l => l.level === level);
          if (!here.length) return "";
          return `<section class="en-level"><h2><span class="en-cefr">${level}</span> ${esc(E.LEVEL_NAMES[level])}</h2>
            <div class="en-cards">${here.map(card).join("")}</div></section>`;
        }).join("")}
        <p class="en-more">This is the first lesson. More lessons, at A1 to C1, follow once this one has been tried with a learner.</p>
      </main>`;
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
        <button class="en-btn" type="button" data-print="student" data-lesson="${l.id}">Print student copy</button>
        <button class="en-btn" type="button" data-print="teacher" data-lesson="${l.id}">Print teacher copy</button>
        <button class="en-btn" type="button" data-copy="${l.id}">Copy link for the learner</button>
      </div>
    </article>`;

  function copyLink(btn) {
    const url = `${location.origin}${location.pathname}#${btn.dataset.copy}/1`;
    const done = () => { btn.textContent = "Link copied"; setTimeout(() => { btn.textContent = "Copy link for the learner"; }, 2000); };
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

  // The arrow keys move between steps, except while typing
  document.addEventListener("keydown", e => {
    if (e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const [id, n] = decodeURIComponent(location.hash.slice(1)).split("/");
    const lesson = id && E.get(id);
    if (!lesson) return;
    const k = (Number(n) || 1) + (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0);
    if (k !== (Number(n) || 1) && k >= 1 && k <= lesson.steps.length) { location.hash = `${lesson.id}/${k}`; e.preventDefault(); }
  });

  const checkRow = (w, extra = "") => `<div class="en-check">
      <button class="en-btn primary" type="button" data-act="check">Check</button>
      <button class="en-btn" type="button" data-act="reset">Start again</button>
      ${extra}<span class="en-result" role="status">${w.result || ""}</span></div>`;

  function drawStep(lesson, i) {
    const step = lesson.steps[i];
    const w = stepWork(lesson, i);
    const body = $("body");
    const show = teacher; // answers are shown in teacher view
    const again = () => drawStep(lesson, i);
    const on = (sel, ev, fn) => body.querySelectorAll(sel).forEach(el => el.addEventListener(ev, e => fn(el, e)));
    const actions = (check) => {
      on('[data-act="check"]', "click", () => { w.checked = true; w.result = check(); again(); });
      on('[data-act="reset"]', "click", () => { Object.keys(w).forEach(k => delete w[k]); w.checked = false; again(); });
    };

    if (step.type === "talk") {
      body.innerHTML = `<p class="en-intro">${esc(step.intro)}</p>
        <ol class="en-talk-q">${step.questions.map(q => `<li>${esc(q)}</li>`).join("")}</ol>
        ${step.write ? `<label class="en-line"><span>${esc(step.write)}</span><input type="text" id="talkWrite" value="${esc(w.text || "")}" autocomplete="off"></label>` : ""}
        ${show ? `<div class="en-teach"><b>More questions:</b> ${step.follow.map(esc).join(" · ")}</div>` : ""}`;
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
      const bank = words.filter(x => !w.place[x]);
      body.innerHTML = `<p class="en-intro">${esc(step.intro)} <span class="en-how">Choose a word, then choose its group.</span></p>
        <div class="en-bank" aria-label="Words to sort">${bank.length ? bank.map(chip).join("") : '<span class="en-how">All sorted.</span>'}</div>
        <div class="en-groups">${Object.keys(step.groups).map(g => `
          <div class="en-group${w.pick ? " ready" : ""}" data-group="${esc(g)}"><button class="en-group-name" type="button" data-group="${esc(g)}">${esc(g)}</button>
            <span class="en-group-words">${words.filter(x => w.place[x] === g).map(chip).join("")}</span></div>`).join("")}</div>
        <p class="en-tip"><b>🇬🇧 British English:</b> ${esc(step.tip)}</p>
        ${checkRow(w)}`;
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
        return `${ok} of ${words.length} right${ok === words.length ? " 🎉" : ". Tap a red word to move it."}`;
      });
    }

    if (step.type === "read") {
      w.tf = w.tf || {};
      body.innerHTML = `<div class="en-read-text"><h2>${esc(step.heading)}</h2>${step.text.map(p => `<p>${esc(p)}</p>`).join("")}</div>
        <div class="en-read-q"><p class="en-intro">${esc(step.intro)}</p>
          <ol class="en-tf">${step.items.map(([s, truth, why], k) => {
            const pick = show ? truth : w.tf[k];
            const mark = (w.checked || show) && pick !== undefined ? (pick === truth ? "good" : "oops") : "";
            return `<li class="${mark}"><span><b class="en-n">${k + 1}.</b>${esc(s)}</span>
              <span class="en-tf-do">${[true, false].map(v => `<button type="button" class="en-pill${pick === v ? " on" : ""}" data-k="${k}" data-v="${v}" aria-pressed="${pick === v}">${v ? "True" : "False"}</button>`).join("")}</span>
              ${(w.checked && mark === "oops") || show ? `<small class="en-why">${esc(why)}</small>` : ""}</li>`;
          }).join("")}</ol>
          ${checkRow(w)}</div>`;
      on(".en-pill", "click", el => { w.tf[el.dataset.k] = el.dataset.v === "true"; w.checked = false; w.result = ""; again(); });
      actions(() => { const ok = step.items.filter(([, t], k) => w.tf[k] === t).length; return `${ok} of ${step.items.length} right${ok === step.items.length ? " 🎉" : ""}`; });
    }

    if (step.type === "grammar") {
      w.gap = w.gap || {};
      let n = 0;
      const sentence = (item, k) => esc(item.text).split("{}").map((part, j, all) => {
        if (j === all.length - 1) return part;
        const key = `${k}-${j}`;
        const val = show ? item.answers[j][0] : (w.gap[key] || "");
        const mark = (w.checked || show) && val ? (E.accepts(item.answers[j], val) ? " good" : " oops") : "";
        n += 1;
        return `${part}<input class="en-gap${mark}" data-key="${key}" value="${esc(val)}" aria-label="Gap ${n}" autocomplete="off" autocapitalize="off" spellcheck="false" size="${Math.max(...item.answers[j].map(a => a.length)) + 1}">`;
      }).join("");
      body.innerHTML = `<div class="en-rule"><p>${esc(step.rule)}</p>
          <table class="en-table"><thead><tr><th></th><th>Positive</th><th>Negative</th><th>Question</th></tr></thead>
          <tbody>${step.table.map(r => `<tr>${r.map((c, k) => k ? `<td>${esc(c)}</td>` : `<th>${esc(c)}</th>`).join("")}</tr>`).join("")}</tbody></table>
          <p class="en-eg">${step.examples.map(x => `<i>${esc(x)}</i>`).join(" ")}</p></div>
        <div class="en-gaps"><p class="en-intro">${esc(step.intro)}</p>
          <ol>${step.items.map((item, k) => `<li>${sentence(item, k)} <span class="en-hint">(${esc(item.hint)})</span></li>`).join("")}</ol>
          ${checkRow(w)}</div>`;
      on(".en-gap", "input", el => { w.gap[el.dataset.key] = el.value; });
      on(".en-gap", "keydown", (el, e) => { if (e.key === "Enter") body.querySelector('[data-act="check"]').click(); });
      actions(() => {
        const keys = step.items.flatMap((item, k) => item.answers.map((a, j) => [`${k}-${j}`, a]));
        const ok = keys.filter(([key, a]) => E.accepts(a, w.gap[key])).length;
        return `${ok} of ${keys.length} right${ok === keys.length ? " 🎉" : ""}`;
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
        ${checkRow(w)}`;
      on(".en-pill", "click", el => { w.pick[el.dataset.k] = Number(el.dataset.j); w.checked = false; w.result = ""; again(); });
      actions(() => { const ok = step.items.filter(([, , r], k) => w.pick[k] === r).length; return `${ok} of ${step.items.length} right${ok === step.items.length ? " 🎉" : ""}`; });
    }

    if (step.type === "roleplay") {
      body.innerHTML = `<p class="en-intro">${esc(step.intro)}</p>
        <div class="en-cards2">${step.cards.map((c, k) => `<section class="en-role">
          <h2>${k ? "B" : "A"}: ${esc(c.who)}</h2><p>${esc(c.task)}</p>
          <ul>${c.phrases.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
          ${k === 1 ? `<div class="en-info">${step.info.map(x => `<span>${esc(x)}</span>`).join("")}</div>` : ""}</section>`).join("")}</div>`;
    }

    if (step.type === "write") {
      const count = t => (String(t || "").toLowerCase().replace(/[‘’]/g, "'").match(/\bgoing to\b/g) || []).length;
      body.innerHTML = `<div class="en-write-l"><p class="en-intro">${esc(step.task)}</p>
          <p class="en-prompts">${step.prompts.map(p => `<span>${esc(p)}</span>`).join("")}</p>
          ${show ? `<div class="en-teach"><b>Example:</b> ${esc(step.model)}</div>` : ""}</div>
        <div class="en-write-r"><textarea id="writeBox" aria-label="Your sentences" placeholder="In July I'm going to…">${esc(w.text || "")}</textarea>
          <p class="en-result" id="writeCount" role="status"></p></div>`;
      const box = $("writeBox"), out = $("writeCount");
      const tell = () => { const c = count(box.value); out.textContent = c ? `going to used ${c} time${c === 1 ? "" : "s"}${c >= 5 ? " 🎉" : ""}` : ""; };
      box.addEventListener("input", () => { w.text = box.value; tell(); });
      tell();
    }
  }

  // ---------- A4 copies ----------
  // Pages of the student copy: steps 1 to 3 on the first, the rest on the second. The teacher copy is the
  // same pages with the answers in, then a page of notes.
  const PAGES = [[0, 1, 2], [3, 4, 5, 6]];
  const line = (n = 1) => Array.from({ length: n }, () => '<div class="p-line"></div>').join("");

  function printStep(step, k, ans) {
    const h = `<h2><b>${k + 1}</b> ${esc(step.title)} <small>${esc(step.intro || step.task || "")}</small></h2>`;
    const A = x => `<span class="p-ans">${esc(x)}</span>`;
    switch (step.type) {
      case "talk": return `${h}<ol class="p-q">${step.questions.map(q => `<li>${esc(q)}</li>`).join("")}</ol>
        <p class="p-fill">${esc(step.write)} ${ans ? A("(the learner's own answer)") : '<span class="p-blank wide"></span>'}</p>`;
      case "sort": {
        const words = Object.values(step.groups).flat().slice().sort();
        return `${h}<p class="p-bank">${words.map(esc).join(" · ")}</p>
          <table class="p-sort"><tr>${Object.keys(step.groups).map(g => `<th>${esc(g)}</th>`).join("")}</tr>
          ${[0, 1, 2, 3].map(r => `<tr>${Object.values(step.groups).map(ws => `<td>${ans && ws[r] ? A(ws[r]) : ""}</td>`).join("")}</tr>`).join("")}</table>
          <p class="p-tip"><b>British English:</b> ${esc(step.tip)} <i>Add one more word to each group.</i></p>`;
      }
      case "read": return `${h}<div class="p-text"><h3>${esc(step.heading)}</h3>${step.text.map(p => `<p>${esc(p)}</p>`).join("")}</div>
        <ol class="p-tf">${step.items.map(([s, t, why]) => `<li><span>${esc(s)}</span><span class="p-boxes">${ans ? A(`${t ? "True" : "False"}: ${why}`) : "True ☐&nbsp;&nbsp; False ☐"}</span></li>`).join("")}</ol>`;
      case "grammar": return `${h}<div class="p-rule"><p>${esc(step.rule)}</p>
          <table class="p-table"><tr><th></th><th>Positive</th><th>Negative</th><th>Question</th></tr>
          ${step.table.map(r => `<tr>${r.map((c, j) => j ? `<td>${esc(c)}</td>` : `<th>${esc(c)}</th>`).join("")}</tr>`).join("")}</table>
          <p><i>${step.examples.map(esc).join(" &nbsp; ")}</i></p></div>
        <ol class="p-gaps">${step.items.map(item => `<li>${esc(item.text).split("{}").map((part, j, all) =>
          j === all.length - 1 ? part : part + (ans ? A(item.answers[j][0]) : '<span class="p-blank"></span>')).join("")} <span class="p-hint">(${esc(item.hint)})</span></li>`).join("")}</ol>`;
      case "choose": return `${h}<ol class="p-choose">${step.items.map(([s, opts, r]) => `<li><span>${esc(s)}</span>
          <span>${opts.map((o, j) => ans && j === r ? A(`${"abc"[j]}) ${o}`) : `${"abc"[j]}) ${esc(o)}`).join("&nbsp;&nbsp; ")}</span></li>`).join("")}</ol>`;
      case "roleplay": return `${h}<div class="p-roles">${step.cards.map((c, j) => `<div class="p-role"><h3>${j ? "B" : "A"}: ${esc(c.who)}</h3>
          <p>${esc(c.task)}</p><ul>${c.phrases.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
          ${j === 1 ? `<p class="p-info">${step.info.map(x => `<span>${esc(x)}</span>`).join("")}</p>` : ""}</div>`).join("")}</div>`;
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
      <p class="p-namedate"><span>Name <span class="p-blank wide"></span></span><span>Date <span class="p-blank"></span></span></p>` : ""}`;
  }

  function sheets(lesson, copy) {
    const ans = copy === "teacher";
    const pages = PAGES.map((steps, n) => `<section class="a4">${pageHead(lesson, copy, n)}
      ${steps.map(k => lesson.steps[k] ? `<div class="p-step p-${lesson.steps[k].type}">${printStep(lesson.steps[k], k, ans)}</div>` : "").join("")}
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

  route();
})();
