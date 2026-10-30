/* PopSpell teacher area (#/teacher): classes, scheduled assignments, printable
   worksheets, marking and results. Data comes from cloud.js (window.PopCloud). */
(() => {
  "use strict";

  const STUCK_MISSES = 2;      // words missed in a row
  const STUCK_NOT_FIRST = 3;   // words not right first time in a row
  const IDLE_MS = 3 * 60 * 1000;
  const LIVE_HOURS = 6;
  const CLASS_KEY = "popspell-teacher-class";

  let root = null;
  let cloud = null;
  let me = null;
  let classes = [];
  let current = null;   // selected class
  let tab = "live";
  let stopLive = null;  // unsubscribes the live board
  let liveTimer = null;
  let liveData = [];
  let marking = null;

  const P = () => window.PopSpell;
  const esc = s => P().esc(s == null ? "" : s);
  const plural = (n, one, many) => P().plural(n, one, many);
  const $ = sel => root.querySelector(sel);
  const ago = ms => { const m = Math.round(ms / 60000); return m < 1 ? "just now" : m === 1 ? "1 min ago" : m < 60 ? `${m} mins ago` : `${Math.round(m / 60)} h ago`; };
  const day = ms => new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  // "Sara Green" → "Sara", but "Mr Smith" stays "Mr Smith"
  const shortName = n => { const w = String(n || "").trim().split(/\s+/); return /^(mr|mrs|ms|miss|mx|dr)\.?$/i.test(w[0]) ? w.slice(0, 2).join(" ") : w[0]; };
  window.PopTeacherShortName = shortName;
  const joinLink = code => `${location.origin}${location.pathname}#/join/${code}`;
  // Joins the class and signs the device in as the pupil (app.js), for use at home
  const homeLink = name => `${joinLink(current.id)}?pupil=${encodeURIComponent(String(name).trim())}`;
  const canAdmin = () => me && ["owner", "admin"].includes(me.role);
  const roleLabel = role => role === "owner" ? "Owner" : role === "admin" ? "Site admin" : "Teacher";

  function stopWatching() {
    if (stopLive) { stopLive(); stopLive = null; }
    clearInterval(liveTimer);
    liveTimer = null;
  }
  window.addEventListener("hashchange", () => { if (!location.hash.startsWith("#/teacher")) stopWatching(); });

  function message(html) {
    root.innerHTML = `<section class="panel start t-message">${html}</section>`;
  }

  async function show(container) {
    root = container;
    stopWatching();
    document.title = "Teacher · PopSpell";
    message(`<h1>Teacher</h1><p class="meta">Connecting…</p>`);
    cloud = await window.PopCloudReady;
    if (root !== container) return;
    if (!cloud) {
      message(`<h1>Teacher accounts aren't switched on yet</h1>
        <p>This site hasn't been connected to its Firebase project. The steps are in <b>firebase/SETUP.md</b>.</p>
        <a class="btn primary" href="#/">Back to the lists</a>`);
      return;
    }
    me = await cloud.me();
    if (!me) return showSignIn();
    if (!me.role) return showNotInvited();
    classes = await cloud.classes();
    const saved = (() => { try { return localStorage.getItem(CLASS_KEY); } catch { return null; } })();
    current = classes.find(c => c.id === saved) || classes.find(c => c.teacher === me.uid) || classes[0] || null;
    if (!classes.length && tab !== "teachers") tab = "library";
    draw();
  }

  /* ---------- Signing in ---------- */

  function showSignIn() {
    message(`
      <h1>👩‍🏫 Teacher sign in</h1>
      <p>Sign in with the Google account your invitation was sent to.</p>
      <button class="btn big primary" id="signIn"><span aria-hidden="true">G</span>&nbsp; Sign in with Google</button>
      <p class="hint" id="signHint"></p>
      <p class="hint">Pupils don't need to sign in — they just type their first name.</p>`);
    $("#signIn").onclick = async () => {
      $("#signHint").textContent = "Opening Google…";
      try { await cloud.signIn(); show(root); }
      catch (err) { $("#signHint").textContent = /popup-closed|cancelled/.test(err.code || "") ? "" : `Couldn't sign in: ${err.message}`; }
    };
  }

  function showNotInvited() {
    message(`
      <h1>You haven't been invited yet</h1>
      <p>You're signed in as <b>${esc(me.email)}</b>, but this account hasn't been invited as a PopSpell teacher.</p>
      <p>Ask the owner to invite this email address, then sign in again.</p>
      <div class="row center"><button class="btn" id="signOut">Sign out</button><a class="btn" href="#/">Back to the lists</a></div>`);
    $("#signOut").onclick = async () => { await cloud.signOut(); show(root); };
  }

  /* ---------- The dashboard frame ---------- */

  function draw() {
    stopWatching();
    // Short names with icons, so every tab fits on one row (it scrolls sideways on a phone)
    const tabs = [["library", "📚", "Library"], ["live", "🟢", "Live"], ["next", "🧭", "Next steps"], ["programme", "📘", "Programme"], ["assign", "📌", "Assign"],
      ["plans", "🗓️", "Plans & sheets"], ["diary", "📝", "Diary"], ["pupils", "👧", "Pupils"], ["classes", "🏫", "Classes"]];
    if (canAdmin()) tabs.push(["teachers", "👩‍🏫", "Teachers"]);
    root.innerHTML = `
      <section class="t-wrap">
        <div class="t-top">
          <img class="t-pip" src="assets/brand/pip-mascot-small.webp" alt="" width="64" height="64">
          <div class="t-hello">
            <h1>Hello, ${esc(shortName(me.name))}${canAdmin() ? ` <span class="t-role">${roleLabel(me.role)}</span>` : ""}</h1>
            <p class="meta">${esc(me.email)} · <a href="help.html" target="_blank" rel="noopener">❓ Help</a> · <button class="linklike" id="signOut">Sign out</button></p>
          </div>
          ${classes.length ? `
            <label class="t-class">Class
              <select id="classPick">${classes.map(c => `<option value="${esc(c.id)}"${current && c.id === current.id ? " selected" : ""}>${esc(c.name)}${c.teacher !== me.uid ? ` — ${esc(c.teacherName)}` : ""}</option>`).join("")}</select>
            </label>` : ""}
        </div>
        <nav class="t-tabs" role="tablist">${tabs.map(([k, icon, t]) => `<button class="t-tab" role="tab" data-tab="${k}" aria-selected="${k === tab}"><span aria-hidden="true">${icon}</span> ${t}</button>`).join("")}</nav>
        <div class="t-error" id="tError" hidden></div>
        <div id="tBody" class="t-body"></div>
      </section>`;
    $("#signOut").onclick = async () => { stopWatching(); await cloud.signOut(); location.hash = "#/"; };
    root.querySelectorAll(".t-tab").forEach(b => { b.onclick = () => { tab = b.dataset.tab; draw(); }; });
    // On a phone the tab row scrolls sideways: keep the chosen tab in view
    const chosen = root.querySelector('.t-tab[aria-selected="true"]');
    if (chosen) chosen.parentElement.scrollLeft = chosen.offsetLeft - 24;
    const pick = $("#classPick");
    if (pick) pick.onchange = () => {
      current = classes.find(c => c.id === pick.value);
      try { localStorage.setItem(CLASS_KEY, current.id); } catch { /* not remembered */ }
      draw();
    };
    const body = $("#tBody");
    const needsClass = ["live", "next", "programme", "assign", "plans", "diary", "pupils"].includes(tab);
    if (needsClass && !current) {
      body.innerHTML = `<div class="empty">Make a class first, in the <b>Classes</b> tab.</div>`;
      return;
    }
    ({ library: drawLibrary, live: drawLive, next: drawNext, programme: drawProgramme, assign: drawAssign, plans: drawPlans, diary: drawDiary, pupils: drawPupils,
      classes: drawClasses, teachers: drawTeachers })[tab](body);
  }

  // A plain message in the same place as errors, for things the teacher should know about
  function notice(text) {
    const box = $("#tError");
    if (!box) return;
    box.hidden = false;
    box.textContent = text;
  }

  function showError(err) {
    const box = $("#tError");
    if (!box) return;
    box.hidden = false;
    box.textContent = `Something went wrong: ${err && err.message ? err.message : err}`;
  }

  /* ---------- Live class ---------- */

  function liveState(p, now) {
    if (p.help) return "help";
    if (p.status === "working" && now - p.seen > IDLE_MS) return "idle";
    if (p.status === "working" && ((p.missedRow || 0) >= STUCK_MISSES || (p.notFirstRow || 0) >= STUCK_NOT_FIRST)) return "stuck";
    return p.status || "working";
  }

  function drawLive(body) {
    body.innerHTML = `<div class="summary-bar" id="liveSummary"></div><div class="live-grid" id="liveGrid"><div class="empty">Loading…</div></div>`;
    const render = () => {
      if (!$("#liveGrid")) return;
      const now = Date.now();
      const kids = liveData.filter(p => now - p.seen < LIVE_HOURS * 3600000).map(p => Object.assign({ state: liveState(p, now) }, p));
      const order = { help: 0, stuck: 1, working: 2, idle: 3, stopped: 4, finished: 5 };
      kids.sort((a, b) => (order[a.state] - order[b.state]) || (a.helpAt || 0) - (b.helpAt || 0) || a.pupil.localeCompare(b.pupil));
      const count = s => kids.filter(k => k.state === s).length;
      $("#liveSummary").innerHTML = kids.length ? `
        <span class="pill">👩‍🎓 ${kids.length} today</span>
        ${count("help") ? `<span class="pill help">🙋 ${count("help")} need help</span>` : ""}
        ${count("stuck") ? `<span class="pill stuck">🔶 ${count("stuck")} finding it hard</span>` : ""}
        <span class="pill">✏️ ${count("working")} working</span>
        <span class="pill">✅ ${count("finished")} finished</span>` : "";
      if (!kids.length) {
        $("#liveGrid").innerHTML = `<div class="empty">No pupils yet today. When a pupil in <b>${esc(current.name)}</b> starts a list, they appear here straight away.
          <br>Pupils' devices join with the class link — see the <b>Classes</b> tab.</div>`;
        return;
      }
      const label = { help: "Needs help", stuck: "Finding it hard", working: "Working", idle: "Quiet for a while", stopped: "Stopped", finished: "Finished" };
      $("#liveGrid").innerHTML = kids.map(p => {
        const pct = p.total ? Math.round(((p.done || 0) / p.total) * 100) : 0;
        return `
          <article class="kid ${p.state}">
            <div class="kid-top"><span class="kid-name">${esc(p.pupil)}</span>
              <span class="badge ${p.state === "help" ? "stuck" : p.state}">${label[p.state]}</span></div>
            ${p.help ? `<div class="help-row">🙋 Asked for help ${ago(now - (p.helpAt || p.seen))}
              <button class="btn small" data-done="${esc(p.key)}">Done</button></div>` : ""}
            <div class="kid-list">${esc(p.list || "Choosing a list")}</div>
            <div class="kid-bar"><span style="width:${pct}%"></span></div>
            <div class="kid-stats"><span>${p.done || 0} of ${p.total || 0} words · ${p.right || 0} right first time</span></div>
            <div class="kid-stats"><span>${p.lastWord ? `Last: ${esc(p.lastWord)}` : ""}</span><span>${ago(now - p.seen)}</span></div>
          </article>`;
      }).join("");
      root.querySelectorAll("[data-done]").forEach(b => {
        b.onclick = () => { b.disabled = true; cloud.clearHelp(current.id, b.dataset.done).catch(showError); };
      });
    };
    stopLive = cloud.watchLive(current.id, (rows, err) => {
      if (err) return showError(err);
      liveData = rows;
      render();
    });
    liveTimer = setInterval(render, 20000); // keeps "2 mins ago" and "quiet for a while" up to date
  }

  /* ---------- Assignments ---------- */

  // Everything a teacher can set: spelling lists by stage, then writing, reading, listening and
  // numeracy activities (activities.js), then sentence dictation for any spelling list
  // The phonics stages, then England's statutory spelling words (words.js keeps them apart)
  const ALL_STAGES = () => P().STAGES.concat(P().EXTRA_STAGES || []);
  function catalogueOptions() {
    const checks = Object.values(P().CHECKS).filter(c => c.id === "check-spelling" || window.PopActivities);
    const groups = [];
    const A = window.PopActivities;
    const gameArea = A && A.AREAS.find(area => area.id === "games");
    if (gameArea) groups.push(`<optgroup label="${gameArea.icon} ${esc(gameArea.title)}">${gameArea.activities
      .map(a => `<option value="${esc(a.id)}">${esc(a.title)} (${esc(a.level)})</option>`).join("")}</optgroup>`);
    groups.push(`<optgroup label="🧭 Starting checks"><option value="assess">🌟 Pip's Sound Quest (full assessment)</option>${checks.map(c => `<option value="${esc(c.id)}">${esc(c.title)}</option>`).join("")}</optgroup>`);
    ALL_STAGES().forEach(st => groups.push(`<optgroup label="${esc(st.stage)}">${st.lists.map(l => `<option value="${esc(l.id)}">${esc(l.title)}</option>`).join("")}</optgroup>`));
    if (A) {
      A.AREAS.filter(area => area.id !== "games").forEach(area => groups.push(`<optgroup label="${area.icon} ${esc(area.title)}">${area.activities
        .map(a => `<option value="${esc(a.id)}">${esc(a.title)} (${esc(a.level)})</option>`).join("")}</optgroup>`));
      groups.push(`<optgroup label="✍️ Sentence dictation">${P().STAGES.flatMap(st => st.lists)
        .map(l => `<option value="dictate:${esc(l.id)}">Dictation: ${esc(l.title)}</option>`).join("")}</optgroup>`);
    }
    return `<option value="">Choose work…</option>${groups.join("")}`;
  }
  const listTitle = entry => { const r = P().resolveAssigned(entry); return r ? r.title : entry; };
  const previewHref = entry => {
    const work = P().resolveAssigned(entry);
    if (!work) return "";
    return work.href + (work.href.includes("?") ? "&" : "?") + "preview=1";
  };

  /* ---------- Library: every resource, found by level, subject, strand and type ---------- */

  const LIB_LEVELS = [["Early", "Nursery–P1"], ["First", "P2–P4"], ["Second", "P5–P7"]];
  const LIB_SUBJECTS = ["Literacy", "Maths"];
  const LIB_TYPES = { lesson: "Ready lesson", check: "Starting check", spelling: "Spelling list", activity: "Activity", story: "Story",
    game: "Game", dictation: "Dictation", paper: "Paper sheet" };
  const FIND_LEVEL = "Find their level";
  // The strand a teacher looks for, from the CfE organiser
  function strandOf(organiser) {
    const o = String(organiser || "");
    if (/spelling/.test(o)) return "Spelling";
    if (/Tools for writing/.test(o)) return "Writing: sentences and punctuation";
    if (/Tools for reading/.test(o)) return "Reading: phonics and tricky words";
    if (/Reading/.test(o)) return "Reading: understanding stories";
    if (/Listening/.test(o)) return "Listening and sounds";
    if (/Fractions/.test(o)) return "Fractions, decimals and percentages";
    if (/Money|Time|Measurement/.test(o)) return o.replace(/^Numeracy · /, "");
    if (/Data|chance/.test(o)) return "Data and chance";
    if (/2D|Angle/.test(o)) return "Shape and angles";
    if (/Patterns|Expressions/.test(o)) return "Patterns and missing numbers";
    return "Number";
  }
  const STRANDS = [FIND_LEVEL, "Spelling", "Reading: phonics and tricky words", "Reading: understanding stories",
    "Writing: sentences and punctuation", "Writing: dictation", "Writing: creating texts", "Handwriting", "Listening and sounds", "Listening and talking",
    "Number", "Fractions, decimals and percentages", "Money", "Time", "Measurement", "Data and chance", "Shape and angles",
    "Patterns and missing numbers"];

  // Everything in PopSpell, tagged so it can be found: starting checks, spelling lists, activities,
  // stories, games, sentence dictation and paper sheets
  function libraryEntries() {
    const A = window.PopActivities;
    const tag = id => (A && A.tag(id)) || {};
    const checks = [{ id: "assess", title: "Pip's Sound Quest", subject: "Literacy",
      detail: "The full phonics assessment. It finds the sounds each pupil knows, and the spelling stage to start on." },
    { id: "check-spelling", title: P().CHECKS.spelling.title, subject: "Literacy",
      detail: "Words get harder until the pupil finds them tricky. It shows which spelling stage to start on." }]
      .concat(A ? [{ id: "check-numbers", title: P().CHECKS.numbers.title, subject: "Maths",
        detail: "Questions from first counting to upper primary (CfE Early to Second level, or Reception to Year 6 in England). It shows where to start in maths." }] : [])
      .map(c => Object.assign(c, { type: "check", strand: FIND_LEVEL, level: "" }));
    const spelling = ALL_STAGES().flatMap(stage => stage.lists.map(item => {
      const list = catalogueList(item.id);
      return { id: item.id, title: list.title, type: "spelling", level: tag(item.id).level, subject: "Literacy", strand: "Spelling",
        stage: stage.england ? "England statutory words" : stage.stage.split(" · ")[0], england: !!stage.england, detail: list.tip || `${list.items.length} words to hear, segment and spell`, list, print: true };
    }));
    const activities = (A ? A.AREAS : []).flatMap(area => area.activities.map(act => ({
      id: act.id, title: act.title, level: act.level, subject: /^Literacy/.test(act.organiser) ? "Literacy" : "Maths",
      strand: strandOf(act.organiser), organiser: act.organiser, type: area.id === "games" ? "game" : act.passage ? "story" : "activity",
      england: area.id === "grammar" || area.id === "england-checks",
      detail: act.blurb || "", print: area.id !== "games"
    })));
    // Dictation needs sentences, which the phonics lists have
    const dictation = A ? spelling.filter(item => item.list.items.some(it => it.sentence)).map(item => ({ id: `dictate:${item.id}`, title: `Dictation: ${item.title}`, type: "dictation",
      level: item.level, subject: "Literacy", strand: "Writing: dictation",
      detail: "Listen to each sentence, then write it all: capital letter, spellings and full stop.", print: true })) : [];
    const paper = [{ id: "letter-formation", title: "Letter formation (a–z)", type: "paper", level: "Early", subject: "Literacy",
      strand: "Handwriting", detail: "Trace and write every lower-case letter on four-line ruling.", print: true }];
    // Ready lessons (lessons.js): one for every area of the benchmarks
    const lessons = (window.PopLessons ? window.PopLessons.all() : []).map(l => ({ id: l.id, title: l.title, type: "lesson",
      level: l.level, subject: l.subject, strand: l.strand, detail: l.intention, lesson: l, codes: l.codes, ids: lessonOnline(l), print: true, england: !!l.england }));
    const all = checks.concat(lessons, spelling, activities, dictation, paper);
    all.forEach((e, i) => {
      e.order = i;
      e.codes = e.codes || (e.type === "check" || e.type === "paper" ? [] : codesOf(e.id, e.level));
      // England: the national curriculum year, band and strand for the same work
      const w = e.type === "check" ? null : enWork(e.id);
      e.en = w;
      e.band = w ? E_().bandOf(w) || EN_NONE : "";
      e.enStrand = e.type === "check" ? FIND_LEVEL : w && w.strand ? w.strand : EN_NONE;
      e.search = `${e.title} ${e.strand} ${e.organiser || ""} ${e.codes.join(" ")} ${e.level} ${LIB_TYPES[e.type]} ${e.detail} ${e.list ? e.list.items.map(it => it.spelling).join(" ") : ""}
        ${w ? `${w.label} ${w.domain} ${w.strand} ${w.statements.map(s => s.wording).join(" ")}` : ""}`.toLowerCase();
    });
    return all;
  }
  const EN_NONE = "Not in England's curriculum";

  const LIB_KEY = "popspell-library";
  const LIB_BLANK = { cur: "", level: "", subject: "", strand: "", type: "" };
  function libraryPrefs() {
    try { return Object.assign({}, LIB_BLANK, JSON.parse(localStorage.getItem(LIB_KEY))); }
    catch { return Object.assign({}, LIB_BLANK); }
  }
  const saveLibraryPrefs = p => { try { localStorage.setItem(LIB_KEY, JSON.stringify(p)); } catch { /* fine */ } };

  const BAND_AGES = { Reception: "Age 4–5", "Year 1": "Age 5–6", "Year 2": "Age 6–7", "Years 3–4": "Age 7–9", "Years 5–6": "Age 9–11", "Key stage 3": "Age 11–14" };
  function drawLibrary(body) {
    const prefs = libraryPrefs();
    // Scotland (CfE levels and organisers) or England (national curriculum years and domains).
    // England's own work (grammar by year, statutory words, the national checks, its lessons) shows in
    // both, placed by CfE level and strand in Scotland's view and tagged as from England's curriculum.
    const en = prefs.cur === "england" && Boolean(E_());
    const entries = libraryEntries();
    const order = en ? [FIND_LEVEL, ...E_().STRAND_ORDER, EN_NONE] : STRANDS;
    const strandOfEntry = e => (en ? e.enStrand : e.strand);
    const levelOfEntry = e => (en ? e.band : e.level);
    const levels = en ? E_().BANDS.map(([b]) => [b, b, BAND_AGES[b]]) : LIB_LEVELS.map(([l, years]) => [l, l, years]);
    const segment = (name, label, options, cls = "") => `<div class="lib-seg${cls}" role="group" aria-label="${label}">${options.map(([value, text, small]) =>
      `<button type="button" data-${name}="${esc(value)}" aria-pressed="${prefs[name] === value}"><span>${esc(text).replace(/^All (.+)/, "All<span class=\"lib-wide\"> $1</span>")}</span>${small ? `<small>${esc(small)}</small>` : ""}</button>`).join("")}</div>`;
    body.innerHTML = `<div class="work-flow lib-find">
      <h2>Find work</h2>
      <p class="hint">Choose a curriculum, a ${en ? "year" : "level"} and a subject, then test, assign or print anything. Not sure of a pupil's level? Start with <b>${FIND_LEVEL}</b>. Test runs do not save pupil results.</p>
      ${E_() ? `<div class="lib-seg lib-cur" role="group" aria-label="Curriculum">
        <button type="button" data-cur="" aria-pressed="${!en}"><span>Scotland</span><small>CfE levels</small></button>
        <button type="button" data-cur="england" aria-pressed="${en}"><span>England</span><small>National curriculum</small></button></div>` : ""}
      ${segment("level", en ? "Year" : "Level", [["", en ? "All years" : "All levels"]].concat(levels), en ? " lib-years" : "")}
      ${segment("subject", "Subject", [["", "All subjects"]].concat(LIB_SUBJECTS.map(s => [s, s])))}
      <div class="add-row lib-more">
        <label>Strand <select id="libStrand"></select></label>
        <label>Type <select id="libType"><option value="">All types</option>${Object.entries(LIB_TYPES).map(([k, t]) => `<option value="${k}">${t}</option>`).join("")}</select></label>
        <label>Search <input id="librarySearch" type="search" placeholder="Words, sounds or skills"></label>
      </div>
      <p class="hint" id="libraryCount"></p></div>
      <div id="libResults"></div>`;
    const tagOf = e => (en
      ? `<span class="lib-level lv-${(e.band || "any").toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${esc(e.type === "check" ? "Any year" : e.en ? e.en.label : "Any year")}</span>`
      : `<span class="lib-level${e.level ? ` lv-${e.level.toLowerCase()}` : ""}">${e.level ? `${esc(e.level)} level` : "Any level"}</span>`);
    const codesLine = e => (en ? (e.en && e.en.statements.length ? `<p class="prog-codes">${esc(ncSource(e.en))}: ${esc(e.en.label)} · ${esc(e.en.domain)}</p>` : "")
      : e.codes.length ? `<p class="prog-codes">CfE ${esc(e.codes.join(", "))}</p>` : "");
    const card = e => `<article class="pcard library-card">
        <p class="lib-tags">${tagOf(e)}
          <span class="lib-type">${LIB_TYPES[e.type]}</span>${e.stage && !(e.england && !en) ? `<span class="lib-type">${esc(e.stage)}</span>` : ""}
          ${e.england && !en ? `<span class="lib-type lib-from-en">From England's curriculum</span>` : ""}</p>
        <h3>${esc(e.title)}</h3>
        <p>${esc(e.detail)}</p>
        ${codesLine(e)}
        ${e.list ? `<details><summary>See ${e.list.items.length} words and their sound maps</summary>
          <ul class="wordlist">${e.list.items.map(item => `<li class="mini-word">${P().wordHTML(item)}</li>`).join("")}</ul></details>` : ""}
        <div class="row">${e.type === "lesson" ? `<button class="btn small primary" type="button" data-lesson="${esc(e.id)}">📖 Open lesson</button>
          ${e.ids.length ? `<button class="btn small" type="button" data-assign="${esc(e.id)}">📌 Assign</button>` : ""}`
          : e.type === "paper" ? "" : `<a class="btn small" href="${esc(previewHref(e.id))}" target="_blank" rel="noopener">▶ Test</a>
          <button class="btn small" type="button" data-assign="${esc(e.id)}">📌 Assign</button>`}
          ${e.print ? `<button class="btn small" type="button" data-print="${esc(e.id)}">🖨️ Print</button>` : `<span class="lib-online">Online only</span>`}</div>
      </article>`;
    const levelRank = e => (levelOfEntry(e) ? levels.findIndex(([l]) => l === levelOfEntry(e)) : -1);
    const render = () => {
      const strands = order.filter(s => entries.some(e => strandOfEntry(e) === s && (!prefs.subject || e.subject === prefs.subject)));
      if (prefs.strand && !strands.includes(prefs.strand)) prefs.strand = "";
      $("#libStrand").innerHTML = `<option value="">All strands</option>${strands.map(s => `<option${s === prefs.strand ? " selected" : ""}>${esc(s)}</option>`).join("")}`;
      $("#libType").value = prefs.type;
      body.querySelectorAll("[data-level]").forEach(b => b.setAttribute("aria-pressed", b.dataset.level === prefs.level));
      body.querySelectorAll("[data-subject]").forEach(b => b.setAttribute("aria-pressed", b.dataset.subject === prefs.subject));
      const query = $("#librarySearch").value.trim().toLowerCase();
      // Starting checks show at every level: they're how a teacher finds the level
      // Starting checks have no level, so they show at every one; in England, work beyond the
      // primary curriculum shows only under "All years"
      const levelFits = e => !prefs.level || (e.type === "check" ? true : en ? e.band === prefs.level : !e.level || e.level === prefs.level);
      const shown = entries.filter(e => levelFits(e) && (!prefs.subject || e.subject === prefs.subject)
        && (!prefs.strand || strandOfEntry(e) === prefs.strand) && (!prefs.type || e.type === prefs.type) && (!query || e.search.includes(query)))
        .sort((a, b) => order.indexOf(strandOfEntry(a)) - order.indexOf(strandOfEntry(b)) || levelRank(a) - levelRank(b)
          || (en && a.en && b.en ? (a.en.lo ?? 99) - (b.en.lo ?? 99) : 0)
          || (b.type === "lesson") - (a.type === "lesson") || (a.type === "game") - (b.type === "game") || a.order - b.order); // ready lessons first, games last
      const narrowed = !!(prefs.level || prefs.subject || prefs.strand || prefs.type || query);
      const groups = order.map(s => ({ name: s, items: shown.filter(e => strandOfEntry(e) === s) })).filter(g => g.items.length);
      $("#libResults").innerHTML = groups.length ? groups.map(g => `<details class="lib-group"${narrowed || g.name === FIND_LEVEL ? " open" : ""}>
          <summary><span>${esc(g.name)}</span><span class="lib-count">${g.items.length}</span></summary>
          <div class="library-grid">${g.items.map(card).join("")}</div></details>`).join("")
        : `<div class="empty">Nothing matches. Try <button class="linklike" type="button" data-clear>showing everything</button>.</div>`;
      $("#libraryCount").textContent = narrowed ? `${shown.length} of ${entries.length} resources shown.`
        : `${entries.length} resources in ${groups.length} strands. Choose a level and subject, or open a strand.`;
      saveLibraryPrefs(prefs);
    };
    // Switching curriculum changes the year or level buttons and the strands, so it redraws
    body.querySelectorAll("[data-cur]").forEach(b => { b.onclick = () => {
      if (b.dataset.cur === prefs.cur) return;
      saveLibraryPrefs(Object.assign(prefs, { cur: b.dataset.cur, level: "", strand: "" }));
      drawLibrary(body);
    }; });
    body.querySelectorAll("[data-level]").forEach(b => { b.onclick = () => { prefs.level = b.dataset.level; render(); }; });
    body.querySelectorAll("[data-subject]").forEach(b => { b.onclick = () => { prefs.subject = b.dataset.subject; render(); }; });
    $("#libStrand").onchange = e => { prefs.strand = e.target.value; render(); };
    $("#libType").onchange = e => { prefs.type = e.target.value; render(); };
    $("#librarySearch").oninput = render;
    $("#libResults").onclick = e => {
      const button = e.target.closest("button");
      if (!button) return;
      const entry = entries.find(x => x.id === (button.dataset.assign || button.dataset.print || button.dataset.lesson));
      if (button.dataset.lesson) lessonDialog(entry.lesson, prefs.cur);
      else if (button.dataset.clear !== undefined) { Object.assign(prefs, { level: "", subject: "", strand: "", type: "" }); $("#librarySearch").value = ""; render(); }
      else if (button.dataset.assign) assignDialog(entry);
      else if (button.dataset.print) printEntry(entry, en ? "england" : "");
    };
    render();
  }

  // Print from the library: spelling lists and letter formation have their own sheets; activities,
  // stories and dictation get a paper version of their questions
  function printEntry(entry, cur = "") {
    if (entry.type === "lesson") return lessonPrintDialog(entry.lesson, "", cur);
    if (entry.type === "spelling" || entry.type === "paper") return previewWorksheet("", { list: entry.id, from: todayKey() }, "mapping");
    previewActivitySheet(entry.id, cur === "england" ? (entry.en ? entry.en.label : "") : entry.level);
  }

  /* ---------- Ready lessons (lessons.js): open, print and assign ---------- */

  const workTitle = id => (id === "letter-formation" ? "Letter formation sheet" : listTitle(id));
  // A lesson's work a pupil can do on their device (not paper sheets)
  const lessonOnline = l => l.use.filter(id => id !== "letter-formation" && previewHref(id));
  const LESSON_STEPS = [["start", "Start"], ["teach", "Teach"], ["practise", "Practise"], ["check", "Check"]];
  // A lesson in Scotland's terms (CfE benchmarks and outcomes) or England's (the national curriculum's
  // statutory statements for the years it covers)
  const lessonLevel = (l, cur) => (cur === "england" ? (enWork(l.id) || {}).label || "" : `${l.level} level`);
  const lessonBand = (l, cur) => (cur === "england" ? (E_().bandOf(enWork(l.id)) || "none").toLowerCase().replace(/[^a-z0-9]+/g, "-") : l.level.toLowerCase());
  // The statements within the lesson's own years (the work it uses can reach further back)
  const lessonStatements = en => {
    const inside = en.statements.filter(s => { if (s.year === "1-6") return en.hi >= 1; const [lo, hi] = E_().span(s.year); return hi >= en.lo && lo <= en.hi; });
    return inside.length ? inside : en.statements;
  };
  function lessonBodyHTML(l, forPrint, cur = "") {
    const M = window.PopLessons.MINUTES;
    const work = id => (forPrint || !previewHref(id) ? esc(workTitle(id)) : `<a href="${esc(previewHref(id))}" target="_blank" rel="noopener">${esc(workTitle(id))}</a>`);
    const en = cur === "england" ? enWork(l.id) : null;
    const curriculum = !en ? (l.england
      ? `<p class="hint">Written for England's national curriculum. In CfE terms it's ${esc(l.level)} level work.</p>
        <p><b>Success criteria:</b></p><ul class="lesson-criteria">${l.criteria.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
        <p><b>CfE experiences and outcomes it supports:</b> ${esc(l.codes.join(", "))}</p>`
      : `<p><b>Success criteria</b> (from the CfE benchmarks):</p><ul class="lesson-criteria">${l.criteria.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
      <p><b>CfE experiences and outcomes:</b> ${esc(l.codes.join(", "))}</p>`)
      : en.statements.length ? `${l.england ? `<p><b>Success criteria:</b></p><ul class="lesson-criteria">${l.criteria.map(c => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}<p><b>${en.hi === 0 ? "EYFS Early Learning Goals" : en.lo === 0 ? "EYFS Early Learning Goals and national curriculum (England)" : "National curriculum (England)"}, ${esc(en.label)}.</b>
        ${en.hi === 0 ? "Children at the expected level of development will:" : en.lo === 0 ? "What children are expected to do (Reception) and be taught (Year 1 on):" : "Pupils should be taught to:"}</p>
        <ul class="lesson-criteria">${lessonStatements(en).slice(0, 6).map(s => `<li>${esc(s.wording)} <span class="hint">(${esc(E_().yearLabel(s.year))} · ${esc(E_().domainLabel(s.domain))})</span></li>`).join("")}</ul>`
      : `<p><b>National curriculum (England):</b> ${esc(en.label)}. This lesson goes beyond what England's primary curriculum sets out, so use it as enrichment.</p>`;
    return `<p><b>Learning intention:</b> ${esc(l.intention)}</p>
      ${curriculum}
      ${l.vocab ? `<p><b>Words to use:</b> ${esc(l.vocab)}</p>` : ""}
      <table class="t-table lesson-steps"><thead><tr><th>Part</th><th>Time</th><th>What to do</th></tr></thead><tbody>
        ${LESSON_STEPS.map(([k, name]) => `<tr><td><b>${name}</b></td><td>${M[k]} min</td><td>${esc(l.steps[k])}${k === "practise" && l.use.length
          ? `<br><span class="hint">PopSpell: ${l.use.map(work).join(", ")}</span>` : ""}</td></tr>`).join("")}</tbody></table>
      ${l.home ? `<p><b>At home:</b> ${esc(l.home)}</p>` : ""}`;
  }
  function lessonDialog(l, cur = "") {
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview cal-dialog lesson-dialog";
    const strand = cur === "england" ? (enWork(l.id) || {}).strand || l.strand : l.strand;
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>📖 ${esc(l.title)}</h2>
        <button class="btn small" type="button" data-close>Close</button></div>
      <p class="lib-tags"><span class="lib-level lv-${lessonBand(l, cur)}">${esc(lessonLevel(l, cur))}</span><span class="lib-type">${esc(l.subject)}</span><span class="lib-type">${esc(strand)}</span><span class="lib-type">About 30 minutes</span>${l.england && cur !== "england" ? `<span class="lib-type lib-from-en">From England's curriculum</span>` : ""}</p>
      ${lessonBodyHTML(l, false, cur)}
      <div class="row end"><button class="btn small" type="button" data-print>🖨️ Print the pupil's worksheet</button>
        ${lessonOnline(l).length ? `<button class="btn small primary" type="button" data-assign>📌 Assign the online work</button>` : ""}</div>`;
    document.body.append(dialog);
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.querySelector("[data-print]").onclick = () => { dialog.close(); lessonPrintDialog(l, "", cur); };
    const assign = dialog.querySelector("[data-assign]");
    if (assign) assign.onclick = () => { dialog.close(); assignDialog({ title: l.title, ids: lessonOnline(l) }); };
    dialog.showModal();
  }
  // The lesson plan, then a sheet for each piece of work it uses (games are online only)
  function lessonPrintDialog(l, who = "", cur = "") {
    const A = window.PopActivities;
    const strand = cur === "england" ? (enWork(l.id) || {}).strand || l.strand : l.strand;
    const pupil = [], adult = [];
    l.use.forEach(id => {
      if (id === "letter-formation") return pupil.push({ label: "Letter formation", html: () => letterFormationHTML(who), checked: true });
      if (catalogueList(id)) {
        adult.push({ label: `Words to say: ${workTitle(id)}`, html: () => worksheetSpec(who, { list: id, from: todayKey() }, "key").html, checked: true, adult: true });
        return pupil.push({ label: `Sound map: ${workTitle(id)}`, html: () => worksheetSpec(who, { list: id, from: todayKey() }, "mapping").html, checked: true });
      }
      const act = A && A.get(id);
      if (!act || act.area === "games") return;
      const qs = act.make();
      const level = cur === "england" ? (enWork(id) || {}).label || "" : l.level;
      let made = null;
      const pages = () => (made = made || activityPages(act, qs, level, who));
      pupil.push({ label: workTitle(id), html: () => pages().pupil, checked: true });
      adult.push({ label: `${heardOnly(act) ? "To read aloud" : "Answers"}: ${workTitle(id)}`, html: () => pages().answers, checked: heardOnly(act), adult: true });
    });
    adult.push({ label: "Lesson plan", adult: true, checked: !pupil.length,
      html: () => `${brandHead(l.title, `<b>${esc(lessonLevel(l, cur))}</b> · ${esc(l.subject)} · ${esc(strand)} · about 30 minutes${who ? ` · ${esc(who)}` : ""}`)}
      ${lessonBodyHTML(l, true, cur)}<p><b>Notes</b> (what went well, what to revisit):</p><div class="ws-comment"></div>` });
    packDialog(l.title, pupil, adult, pupil.length ? "" : "This lesson's practice is online or with you, so there's no pupil worksheet to print. You can print the lesson plan.");
  }
  // Preview sheets, choose which to print, and print them together: the pupil's sheets, then any
  // pages for the tutor (answers, lesson plan), each on its own page
  function packDialog(heading, pupilPages, adultPages = [], note = "") {
    const pages = pupilPages.concat(adultPages);
    const box = (pg, i) => `<label class="check"><input type="checkbox" data-page="${i}"${pg.checked ? " checked" : ""}> ${esc(pg.label)}</label>`;
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>🖨️ ${esc(heading)}</h2>
      <button class="btn small" type="button" data-close>Close</button>
      <button class="btn small primary" type="button" data-print>Print / Save PDF</button></div>
      <div class="pack-choices">
        ${pupilPages.length ? `<div><b>For the pupil</b>${pupilPages.map((pg, i) => box(pg, i)).join("")}</div>` : ""}
        ${adultPages.length ? `<div><b>For you</b>${adultPages.map((pg, i) => box(pg, i + pupilPages.length)).join("")}</div>` : ""}
        ${note ? `<p class="hint">${esc(note)}</p>` : ""}
      </div>
      <section class="sheet-preview-page ws-activity"></section>`;
    document.body.append(dialog);
    const html = () => pages.filter((pg, i) => dialog.querySelector(`[data-page="${i}"]`).checked)
      .map(pg => `<div class="ws-page${pg.adult ? " ws-adult" : ""}">${pg.html()}</div>`).join("");
    const render = () => {
      const page = dialog.querySelector(".sheet-preview-page");
      const h = html();
      page.innerHTML = h || `<p class="hint">Tick something to print.</p>`;
      if (h) fitPages(page, "ws-activity");
    };
    dialog.querySelectorAll("[data-page]").forEach(el => { el.onchange = render; });
    render();
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.querySelector("[data-print]").onclick = () => { const sheet = html(); dialog.close(); if (sheet) printSheet("ws-activity", sheet); };
    dialog.showModal();
  }

  // Assign one piece of work from the library to pupils in the chosen class, or to Everyone
  async function assignDialog(entry) {
    if (!current) return notice("Make a class first, in the Classes tab. Then you can assign work from the library.");
    let rows, roster;
    try { [rows, roster] = await Promise.all([cloud.assignments(current.id), cloud.pupils(current.id)]); } catch (err) { return showError(err); }
    const rowOf = who => rows.find(a => sameName(a.who, who));
    const names = [];
    roster.map(r => r.name).concat(rows.map(a => a.who)).forEach(n => {
      if (n && !sameName(n, "Everyone") && !names.some(m => sameName(m, n))) names.push(n);
    });
    names.sort((a, b) => a.localeCompare(b));
    const ids = entry.ids || [entry.id];
    const has = who => !!(rowOf(who) && ids.every(id => rowOf(who).lists.includes(id)));
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview cal-dialog assign-dialog";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>📌 Assign ${esc(entry.title)}</h2>
        <button class="btn small" type="button" data-close>Close</button></div>
      <p class="hint">Class: <b>${esc(current.name)}</b>${classes.length > 1 ? " (change it at the top of the page)" : ""}. Pupils see it the next time they open PopSpell.</p>
      ${entry.ids ? `<p class="hint">This puts the lesson's online work on their device: ${esc(entry.ids.map(workTitle).join(", "))}.</p>` : ""}
      <div class="assign-names">${["Everyone"].concat(names).map(n => `<label class="check"><input type="checkbox" value="${esc(n)}"${has(n) ? " checked disabled" : ""}>
        ${n === "Everyone" ? "<b>Everyone</b> in the class" : esc(n)}${has(n) ? ` <span class="hint">already set</span>` : ""}</label>`).join("")}</div>
      <label class="assign-new">Someone else <input type="text" maxlength="30" placeholder="Pupil's first name" data-new></label>
      <div class="row end"><button class="btn primary" type="button" data-go>Assign</button></div>`;
    document.body.append(dialog);
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.querySelector("[data-go]").onclick = async () => {
      const typed = dialog.querySelector("[data-new]").value.trim();
      const chosen = [...dialog.querySelectorAll("input[type=checkbox]:checked:not(:disabled)")].map(el => el.value);
      if (typed && !chosen.some(n => sameName(n, typed)) && !has(typed)) chosen.push(typed);
      if (!chosen.length) return dialog.querySelector("input[type=checkbox]:not(:disabled), [data-new]").focus();
      const go = dialog.querySelector("[data-go]");
      go.disabled = true;
      try {
        await Promise.all(chosen.map(who => {
          const row = rowOf(who);
          const lists = row ? row.lists : [];
          return cloud.saveAssignment(current.id, row ? row.who : who, lists.concat(ids.filter(id => !lists.includes(id))));
        }));
        dialog.close();
        const who = chosen.map(n => (sameName(n, "Everyone") ? "everyone in the class" : n));
        notice(`Assigned ${entry.title} to ${who.length > 1 ? `${who.slice(0, -1).join(", ")} and ${who[who.length - 1]}` : who[0]}.`);
      } catch (err) { go.disabled = false; showError(err); }
    };
    dialog.showModal();
  }

  // A paper version of an activity: fresh questions, then a page for the adult. Anything a pupil
  // would hear (listening, dictation, a story to listen to) goes on the adult's page to read aloud.
  const heardOnly = act => act.area === "listening" || String(act.id).startsWith("dictate:");
  // A CfE level ("First") or an England year ("Year 3", "Reception"), for a sheet's header
  const levelTag = level => (level ? `&nbsp; <b>${esc(level)}${/^(Year|Reception|Not |Key )/.test(level) ? "" : " level"}</b>` : "");

  // The pupil's sheet: the questions and room to answer them, nothing for the adult
  function activitySheetHTML(act, qs, level = act.level, who = "") {
    const heard = heardOnly(act);
    const question = (q, i) => {
      const answer = q.kind === "dictation" ? handwritingRow("", ["blank"]) + handwritingRow("", ["blank"])
        : q.kind === "choice" ? `<div class="ws-options">${q.options.map(o => `<span><i></i>${esc(o)}</span>`).join("")}</div>`
          : `<div class="ws-answer"><span class="ws-blank"></span></div>`;
      const prompt = heard ? q.prompt.replace(/this word/, "the word you hear") : q.prompt;
      return `<div class="ws-q"><p><b>${i + 1}.</b> ${esc(prompt)}</p>${q.html || ""}${answer}</div>`;
    };
    const story = act.passage && !act.listen ? `<div class="ws-passage"><h2>${esc(act.passage.title)}</h2><p>${esc(act.passage.text)}</p></div>` : "";
    // Short questions (most maths) sit in two columns, so a sheet fits one page
    const short = !act.passage && qs.every(q => q.kind !== "dictation" && String(q.prompt || "").length <= 60
      && (!q.options || q.options.every(o => String(o).length <= 24)));
    return `${dotPattern}${sheetHead(act.title, who, levelTag(level))}
      <p>${qs.some(q => q.kind === "dictation") ? "Your adult reads each sentence to you. Listen, then write it." :
        heard ? "Your adult reads each one to you. Listen, then answer." : act.passage ? "Read the story. Then answer the questions." : "Answer each question."}</p>
      ${story}
      <div class="ws-qs${short ? " ws-cols" : ""}"${act.passage || qs.some(q => q.kind === "dictation") ? ` data-cols="no"` : ""}>${qs.map(question).join("")}</div>`;
  }
  // The adult's sheet: the answers, and for listening work and dictation what to read aloud
  function answersSheetHTML(act, qs, level = act.level, who = "") {
    const heard = heardOnly(act);
    const spoken = q => (q.say && (q.say.word || q.say.text)) || "";
    const keyLine = q => [heard && spoken(q) ? `<b>Say:</b> “${esc(spoken(q))}”` : "",
      q.kind === "dictation" ? "" : `<b>${esc(q.answer)}</b>${q.explain ? ` · ${esc(q.explain)}` : ""}`].filter(Boolean).join("<br>");
    const story = act.listen && act.passage ? `<p>Read this story aloud, then read each question.</p><div class="ws-passage"><h2>${esc(act.passage.title)}</h2><p>${esc(act.passage.text)}</p></div>` : "";
    return `${brandHead(`${heard ? "For the adult" : "Answers"}: ${act.title}`, `${heard ? "Read aloud from this sheet. The answers are below." : "For the adult, not the pupil."}${who ? ` &nbsp; ${esc(who)}` : ""}${levelTag(level)}`)}
      ${story}<ol class="ws-answers">${qs.map(q => `<li>${keyLine(q)}</li>`).join("")}</ol>`;
  }
  // Both, as print pages. The answers match the questions the pupil's sheet keeps once it's fitted to the page.
  function activityPages(act, qs, level, who = "") {
    const pupil = activitySheetHTML(act, qs, level, who);
    const kept = keptQuestions(pupil);
    return { pupil, answers: answersSheetHTML(act, qs.slice(0, kept || qs.length), level, who) };
  }

  function previewActivitySheet(id, level) {
    const act = window.PopActivities && window.PopActivities.get(id);
    if (!act) return showError(new Error("That work has no paper version."));
    let qs = act.make();
    const heard = heardOnly(act);
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>Worksheet preview</h2>
      <label class="check"><input type="checkbox" data-answers${heard ? " checked disabled" : ""}> ${heard ? "A page for you to read aloud from (needed)" : "Also print the answers, on a separate page for you"}</label>
      ${act.passage ? "" : `<button class="btn small" type="button" data-new>🔀 New questions</button>`}
      <button class="btn small" type="button" data-close>Close</button>
      <button class="btn small primary" type="button" data-print>Print / Save PDF</button></div>
      <section class="sheet-preview-page ws-activity"></section>`;
    document.body.append(dialog);
    const html = () => {
      const p = activityPages(act, qs, level || act.level);
      return `<div class="ws-page">${p.pupil}</div>${dialog.querySelector("[data-answers]").checked ? `<div class="ws-page ws-adult">${p.answers}</div>` : ""}`;
    };
    const render = () => { const page = dialog.querySelector(".sheet-preview-page"); page.innerHTML = html(); fitPages(page, "ws-activity"); };
    dialog.querySelector("[data-answers]").onchange = render;
    const fresh = dialog.querySelector("[data-new]");
    if (fresh) fresh.onclick = () => { qs = act.make(); render(); };
    render();
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.querySelector("[data-print]").onclick = () => { const sheet = html(); dialog.close(); printSheet("ws-activity", sheet); };
    dialog.showModal();
  }

  async function drawAssign(body) {
    body.innerHTML = `<div class="empty">Loading…</div>`;
    let rows;
    try { rows = await cloud.assignments(current.id); } catch (err) { return showError(err); }
    if (tab !== "assign") return;
    const options = catalogueOptions();
    body.innerHTML = `
      <p class="hint">Choose work for each pupil in <b>${esc(current.name)}</b>. Use <b>Test online</b> before assigning it; previews do not save results. A row called <b>Everyone</b> is shown to every pupil in the class. Type names exactly as pupils type them.</p>
      <table class="t-table">
        <thead><tr><th>Pupil</th><th>Lists</th><th>Add a list</th></tr></thead>
        <tbody>${rows.length ? rows.map((a, i) => `
          <tr>
            <td class="who">${esc(a.who)}</td>
            <td><div class="chips">${a.lists.map((l, j) => `<span class="t-chip">${esc(listTitle(l))}<button title="Remove" data-row="${i}" data-remove="${j}">×</button></span>`).join("") || "<i>none</i>"}</div></td>
            <td><div class="preview-picker"><select data-add="${i}">${options}</select>
              <a class="btn small" data-preview-row="${i}" target="_blank" rel="noopener" hidden>▶ Test online</a>
              <button class="btn small primary" data-assign-row="${i}" type="button" disabled>Assign</button></div></td>
          </tr>`).join("") : `<tr><td colspan="3" class="empty">No assignments yet. Add a pupil below.</td></tr>`}</tbody>
      </table>
      <form class="add-row" id="addForm">
        <input type="text" id="newWho" placeholder="Pupil's first name (or Everyone)" maxlength="30">
        <select id="newList">${options}</select>
        <input type="text" id="newLink" placeholder="…or paste a Make a list link">
        <a class="btn small" id="newPreview" target="_blank" rel="noopener" hidden>▶ Test online</a>
        <button class="btn primary" type="submit">Add</button>
      </form>`;
    const save = async (who, lists) => {
      try { await cloud.saveAssignment(current.id, who, lists); drawAssign(body); } catch (err) { showError(err); }
    };
    body.querySelectorAll("[data-remove]").forEach(b => {
      b.onclick = () => { const a = rows[b.dataset.row]; save(a.who, a.lists.filter((_, j) => j !== Number(b.dataset.remove))); };
    });
    body.querySelectorAll("[data-add]").forEach(s => {
      const index = s.dataset.add;
      const preview = body.querySelector(`[data-preview-row="${index}"]`);
      const assign = body.querySelector(`[data-assign-row="${index}"]`);
      s.onchange = () => {
        const href = previewHref(s.value);
        preview.hidden = !href;
        if (href) preview.href = href;
        assign.disabled = !s.value;
      };
      assign.onclick = () => {
        const a = rows[index];
        if (s.value && !a.lists.includes(s.value)) save(a.who, a.lists.concat(s.value));
      };
    });
    const updateNewPreview = () => {
      const link = $("#newLink").value.trim();
      const entry = link ? (link.includes("#/") ? link.slice(link.indexOf("#/")) : link) : $("#newList").value;
      const href = previewHref(entry);
      $("#newPreview").hidden = !href;
      if (href) $("#newPreview").href = href;
    };
    $("#newList").onchange = updateNewPreview;
    $("#newLink").oninput = updateNewPreview;
    $("#addForm").onsubmit = e => {
      e.preventDefault();
      const who = $("#newWho").value.trim();
      const link = $("#newLink").value.trim();
      const list = link ? (link.includes("#/") ? link.slice(link.indexOf("#/")) : link) : $("#newList").value;
      if (!who) return $("#newWho").focus();
      if (!list) return $("#newList").focus();
      const existing = rows.find(a => a.who.toLowerCase() === who.toLowerCase());
      save(existing ? existing.who : who, existing ? existing.lists.concat(existing.lists.includes(list) ? [] : [list]) : [list]);
    };
  }

  /* ---------- Dated plans, printable worksheets and teacher marking ---------- */

  const todayKey = () => new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());
  const tomorrowKey = () => {
    const date = new Date(`${todayKey()}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
  };
  const catalogueList = id => P().LISTS[id] || null;

  /* ---------- Calendar: lessons into Google, Outlook or Apple calendars, with no sign-in ---------- */

  const LESSON_LENGTHS = [30, 45, 60, 90];
  function calendarPrefs() {
    try { return Object.assign({ length: 45, repeat: "once" }, JSON.parse(localStorage.getItem("popspell-calendar") || "{}")); }
    catch { return { length: 45, repeat: "once" }; }
  }
  const saveCalendarPrefs = p => { try { localStorage.setItem("popspell-calendar", JSON.stringify(p)); } catch { /* fine */ } };
  const pad2 = n => String(n).padStart(2, "0");
  // Weekly lessons run until the summer holidays: 30 June of this school year
  const summerEnd = date => { const d = new Date(`${date}T12:00:00Z`); return `${d.getUTCMonth() >= 7 ? d.getUTCFullYear() + 1 : d.getUTCFullYear()}0630`; };

  // A lesson in UK time (so it stays right through the clock changes). Without a time it's an all-day event.
  function lessonEvent(r, { length, repeat }, forParent = false) {
    const date = r.nextLessonDate;
    const timed = /^\d\d:\d\d$/.test(r.lessonTime || "");
    const ymd = date.replace(/-/g, "");
    let start = ymd, end;
    if (timed) {
      const [h, m] = r.lessonTime.split(":").map(Number);
      const finish = new Date(Date.UTC(2000, 0, 1, h, m + Number(length)));
      start = `${ymd}T${pad2(h)}${pad2(m)}00`;
      end = `${ymd}T${pad2(finish.getUTCHours())}${pad2(finish.getUTCMinutes())}00`;
    } else {
      const next = new Date(`${date}T12:00:00Z`);
      next.setUTCDate(next.getUTCDate() + 1);
      end = next.toISOString().slice(0, 10).replace(/-/g, "");
    }
    const list = catalogueList(r.homeworkList);
    const details = forParent
      ? [`${r.name}'s PopSpell lesson${current.teacherName ? ` with ${shortName(current.teacherName)}` : ""}.`, `Practise at home: ${homeLink(r.name)}`]
      : [list ? `Homework: ${list.title}` : "", `Class: ${current.name}`, `Teacher area: ${SITE_ROOT}#/teacher`].filter(Boolean);
    return { uid: `popspell-${current.id}-${(r.key || "").slice(0, 16) || r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, timed, start, end,
      title: forParent ? `PopSpell lesson for ${r.name}` : `PopSpell: ${r.name}`, details: details.join("\n"),
      // A timed lesson's end date is in UTC, an all-day one's is just the date
      rrule: repeat === "weekly" ? `FREQ=WEEKLY;UNTIL=${summerEnd(date)}${timed ? "T235959Z" : ""}` : "" };
  }

  // Google's "add event" page: opens filled in, ready to save
  function googleCalendarLink(e) {
    const q = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${e.start}/${e.end}`, details: e.details });
    if (e.timed) q.set("ctz", "Europe/London");
    if (e.rrule) q.set("recur", `RRULE:${e.rrule}`);
    return `https://calendar.google.com/calendar/render?${q}`;
  }

  // An .ics file for Outlook, Apple Calendar or Google's Import. Each pupil keeps the same event id,
  // so importing again after the date changes moves the lesson instead of adding a second one.
  function icsFile(events) {
    const text = s => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const fold = line => {
      const out = [];
      let cur = "";
      for (const ch of line) {
        if (new TextEncoder().encode(cur + ch).length > (out.length ? 74 : 75)) { out.push(cur); cur = ""; }
        cur += ch;
      }
      return [...out, cur].join("\r\n ");
    };
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const seq = Math.floor(Date.now() / 1000);
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PopSpell//Lessons//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VTIMEZONE", "TZID:Europe/London",
      "BEGIN:DAYLIGHT", "TZOFFSETFROM:+0000", "TZOFFSETTO:+0100", "TZNAME:BST", "DTSTART:19700329T010000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU", "END:DAYLIGHT",
      "BEGIN:STANDARD", "TZOFFSETFROM:+0100", "TZOFFSETTO:+0000", "TZNAME:GMT", "DTSTART:19701025T020000", "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU", "END:STANDARD",
      "END:VTIMEZONE",
      ...events.flatMap(e => ["BEGIN:VEVENT", `UID:${e.uid}@popspell.com`, `DTSTAMP:${stamp}`, `SEQUENCE:${seq}`,
        e.timed ? `DTSTART;TZID=Europe/London:${e.start}` : `DTSTART;VALUE=DATE:${e.start}`,
        e.timed ? `DTEND;TZID=Europe/London:${e.end}` : `DTEND;VALUE=DATE:${e.end}`,
        ...(e.rrule ? [`RRULE:${e.rrule}`] : []),
        `SUMMARY:${text(e.title)}`, `DESCRIPTION:${text(e.details)}`, "END:VEVENT"]),
      "END:VCALENDAR"];
    return lines.map(fold).join("\r\n") + "\r\n";
  }

  function downloadICS(events, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([icsFile(events)], { type: "text/calendar;charset=utf-8" }));
    a.download = `${name.replace(/[^\w]+/g, "-").toLowerCase()}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  /* Google Calendar sync: straight into the signed-in teacher's own calendar, with their permission */

  const GCAL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
  const hexOf = t => [...new TextEncoder().encode(t)].map(b => b.toString(16).padStart(2, "0")).join("");
  // Google event ids use only 0-9 and a-v, and the same pupil always gets the same event
  const gcalId = r => `popspell${hexOf(current.id.toLowerCase())}${String(r.key || hexOf(r.name.toLowerCase())).slice(0, 32)}`;
  function gcalBody(r, opts) {
    const e = lessonEvent(r, opts);
    const iso = v => `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}${v.length > 8 ? `T${v.slice(9, 11)}:${v.slice(11, 13)}:00` : ""}`;
    const when = v => (e.timed ? { dateTime: iso(v), timeZone: "Europe/London" } : { date: iso(v) });
    return { id: gcalId(r), summary: e.title, description: e.details, start: when(e.start), end: when(e.end),
      recurrence: e.rrule ? [`RRULE:${e.rrule}`] : [], status: "confirmed", extendedProperties: { private: { popspell: current.id } } };
  }
  async function gcalCall(token, method, url, body) {
    const res = await fetch(url, { method, headers: Object.assign({ Authorization: `Bearer ${token}` }, body ? { "Content-Type": "application/json" } : {}),
      body: body ? JSON.stringify(body) : undefined });
    if (res.ok) return res.status === 204 ? null : res.json();
    const info = (await res.json().catch(() => ({}))).error || {};
    const err = new Error(info.message || `Google Calendar said ${res.status}.`);
    err.status = res.status;
    err.reason = ((info.errors || [])[0] || {}).reason || info.status || "";
    throw err;
  }
  // Update the pupil's event, or add it if it isn't there yet (an update also brings back a deleted one)
  async function gcalPut(token, r, opts) {
    const body = gcalBody(r, opts);
    try { await gcalCall(token, "PUT", `${GCAL}/${body.id}`, body); }
    catch (err) { if (err.status !== 404) throw err; await gcalCall(token, "POST", GCAL, body); }
  }
  async function gcalRemove(token, r) {
    try { await gcalCall(token, "DELETE", `${GCAL}/${gcalId(r)}`); }
    catch (err) { if (![404, 410].includes(err.status)) throw err; }
  }
  function calendarError(err) {
    if (err.status === 401) { cloud.forgetCalendarToken(); return new Error("Google's permission has run out. Press Sync again."); }
    if (/accessNotConfigured|SERVICE_DISABLED/i.test(err.reason || "") || /has not been used|is disabled/i.test(err.message || ""))
      return new Error("The Google Calendar API isn't turned on for PopSpell yet. The site owner turns it on once in Google Cloud (see firebase/SETUP.md).");
    if (/insufficient|SCOPE/i.test(err.reason || "")) { cloud.forgetCalendarToken(); return new Error("Google didn't give PopSpell calendar permission. Press Sync again and tick the calendar box."); }
    if (/popup-blocked/.test(err.code || "")) return new Error("Your browser blocked Google's window. Allow pop-ups for PopSpell, then press Sync again.");
    if (/popup-closed|cancelled-popup/.test(err.code || "")) return new Error("Google's window was closed before you allowed calendar access.");
    return err;
  }
  // Lessons from today on go in or move; a pupil with no lesson date has their event taken out.
  // Past lessons are left alone.
  async function gcalSync(token, pupils, opts) {
    let n = 0;
    for (const r of pupils) {
      if (!r.nextLessonDate) await gcalRemove(token, r);
      else if (r.nextLessonDate >= todayKey()) { await gcalPut(token, r, opts); n++; }
    }
    saveCalendarPrefs(Object.assign(calendarPrefs(), { google: true, syncedAt: Date.now() }));
    return n;
  }
  // After a lesson date is saved: keeps Google Calendar up to date once the teacher has synced,
  // while Google's permission lasts. When it has run out, says so rather than opening a window.
  async function calendarAfterSave(r) {
    if (!calendarPrefs().google) return;
    const token = await cloud.calendarToken();
    if (!token) return notice("🗓️ Saved. Your Google Calendar wasn't updated: press Lessons to my calendar, then Sync.");
    try { await gcalSync(token, [r], calendarPrefs()); }
    catch (err) { showError(calendarError(err)); }
  }

  // Length and repeat, then sync to Google Calendar, or a file for any calendar. Remembers the choices.
  // From the class button, everyone on the roster is passed so lessons that were taken off come out too.
  function calendarDialog(pupils, roster = pupils) {
    const single = pupils.length === 1;
    const prefs = calendarPrefs();
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview cal-dialog";
    const when = r => `${new Date(`${r.nextLessonDate}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}${r.lessonTime ? ` at ${r.lessonTime}` : " (all day: no time set)"}`;
    const synced = at => `Last synced ${new Date(at).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}.`;
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>🗓️ ${single ? `${esc(pupils[0].name)}'s lesson` : `${pupils.length} lessons`} to my calendar</h2>
        <button class="btn small" type="button" data-close>Close</button></div>
      <ul class="cal-list">${pupils.map(r => `<li><b>${esc(r.name)}</b> · ${esc(when(r))}</li>`).join("")}</ul>
      <div class="cal-options">
        <label>Lesson length <select data-length>${LESSON_LENGTHS.map(n => `<option value="${n}"${n === Number(prefs.length) ? " selected" : ""}>${n} minutes</option>`).join("")}</select></label>
        <label>Repeat <select data-repeat><option value="once">Just this lesson</option>
          <option value="weekly"${prefs.repeat === "weekly" ? " selected" : ""}>Every week until the summer holidays</option></select></label>
      </div>
      <div class="cal-sync">
        <button class="btn primary" type="button" data-sync>🔄 Sync to my Google Calendar</button>
        <p class="hint" data-sync-status>${prefs.syncedAt ? `${esc(synced(prefs.syncedAt))} ` : ""}Goes into the Google Calendar of ${esc(me.email || "the account you signed in with")}.
          The first time, Google asks you to allow it. After that, saving a lesson date on a pupil's card updates your calendar too.</p>
      </div>
      <p class="cal-or"><b>Or, for Outlook or Apple Calendar:</b></p>
      <div class="row cal-actions">
        <button class="btn" type="button" data-ics>⬇ ${single ? "Download the lesson (.ics)" : "Download all lessons (.ics)"}</button>
      </div>
      <p class="hint">Open the file to add ${single ? "the lesson" : "every lesson"}. If a lesson date changes, add it again: the calendar moves the lesson instead of adding a second one.</p>`;
    document.body.append(dialog);
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    const opts = () => ({ length: Number(dialog.querySelector("[data-length]").value), repeat: dialog.querySelector("[data-repeat]").value });
    dialog.querySelectorAll("select").forEach(el => { el.onchange = () => saveCalendarPrefs(Object.assign(calendarPrefs(), opts())); });
    dialog.querySelector("[data-ics]").onclick = () =>
      downloadICS(pupils.map(r => lessonEvent(r, opts())), single ? `popspell-lesson-${pupils[0].name}` : `popspell-lessons-${current.name}`);
    const status = dialog.querySelector("[data-sync-status]");
    dialog.querySelector("[data-sync]").onclick = e => {
      const b = e.currentTarget;
      b.disabled = true;
      status.textContent = "Asking Google…";
      // Straight from the click, so Google's window isn't blocked
      cloud.calendarToken(true)
        .then(token => { status.textContent = "Adding lessons…"; return gcalSync(token, single ? pupils : roster, opts()); })
        .then(n => { status.textContent = `✓ ${n} lesson${n === 1 ? "" : "s"} in your Google Calendar. ${synced(Date.now())} Saving a lesson date now updates it too.`; })
        .catch(err => { status.textContent = calendarError(err).message; })
        .finally(() => { b.disabled = false; });
    };
    dialog.showModal();
  }

  // A4 with 12 mm margins (see @page in style.css), in CSS pixels
  const MM = 96 / 25.4, PAGE_W = 186 * MM, PAGE_H = 273 * MM;
  const FOOT = `<p class="ws-foot">PopSpell · free literacy and numeracy practice · popspell.com</p>`;
  // Lays each page out to waste as little paper as possible: a footer on each, short questions in
  // two columns, a sheet that's only a little over a page shrunk to fit on one, and questions left off
  // the end if it still won't fit. Measured on a copy laid out like the printed page.
  function fitPages(root, className = "") {
    const parts = root.querySelectorAll(":scope > .ws-page, :scope > .pn-page").length
      ? [...root.querySelectorAll(":scope > .ws-page, :scope > .pn-page")] : [root];
    // Shrinking stops at 76%, so the print stays easy to read; 3% is kept spare for the printer
    const fits = h => h <= PAGE_H * 0.97 / 0.76;
    parts.forEach(part => {
      part.style.zoom = "";
      if (!part.querySelector(":scope > .ws-foot")) part.insertAdjacentHTML("beforeend", FOOT);
      const measure = () => {
        const box = document.createElement("section");
        box.className = `sheet-preview-page ws-measure ${className}`;
        box.innerHTML = part.innerHTML;
        Object.assign(box.style, { position: "absolute", left: "-10000px", top: "0", width: `${PAGE_W}px`, padding: "0", margin: "0", minHeight: "0", boxShadow: "none" });
        document.body.append(box);
        const h = box.scrollHeight;
        box.remove();
        return h;
      };
      let h = measure();
      // Questions that overflow try two columns, and keep them if that's shorter
      const qsBox = part.querySelector(".ws-qs");
      if (qsBox && !qsBox.classList.contains("ws-cols") && qsBox.dataset.cols !== "no" && h > PAGE_H * 0.97) {
        qsBox.classList.add("ws-cols");
        const h2 = measure();
        if (h2 < h * 0.9) h = h2; else qsBox.classList.remove("ws-cols");
      }
      // Still too long for one page: leave off questions from the end, down to 6
      // (activityPages makes the answers for the ones that stay)
      const questions = () => part.querySelectorAll(".ws-qs > .ws-q");
      while (qsBox && !fits(h) && questions().length > 6) {
        [...questions()].pop().remove();
        h = measure();
      }
      if (h > PAGE_H * 0.97 && fits(h)) part.style.zoom = String(Math.floor((PAGE_H * 0.97 / h) * 100) / 100);
    });
    return root;
  }
  // How many questions a pupil's sheet keeps once it's fitted to one page, so its answers match
  function keptQuestions(html) {
    const box = document.createElement("div");
    box.innerHTML = `<div class="ws-page">${html}</div>`;
    Object.assign(box.style, { position: "absolute", left: "-10000px", top: "0" });
    document.body.append(box);
    fitPages(box, "ws-activity");
    const n = box.querySelectorAll(".ws-qs > .ws-q").length;
    box.remove();
    return n;
  }
  // Puts a sheet on the page just for printing (or saving as PDF), then removes it
  async function printSheet(className, html) {
    const sheet = document.createElement("section");
    sheet.className = `worksheet-print ${className}`;
    sheet.innerHTML = html;
    document.body.append(sheet);
    document.body.classList.add("printing-worksheet");
    // The logo and Pip have to be loaded before the page is printed
    await Promise.all([...sheet.querySelectorAll("img")].map(img => (img.complete ? null : new Promise(r => { img.onload = img.onerror = r; }))));
    fitPages(sheet, className);
    const clean = () => { sheet.remove(); document.body.classList.remove("printing-worksheet"); };
    window.addEventListener("afterprint", clean, { once: true });
    window.print();
  }

  // One handwriting row on four-line ruling: model, grey to trace, dotted to trace, then space to write.
  // Lines follow the letter shapes: top of tall letters, middle (x-height), baseline, and tails.
  function handwritingRow(text, cells = ["model", "grey", "dots", "blank"]) {
    const width = 1000 / cells.length;
    const size = Math.min(62, (width - 26) / (Math.max(text.length, 2) * 0.56));
    const base = 70, mid = base - size * 0.5, top = base - size * 0.74, tail = base + size * 0.26;
    const line = (y, style) => `<line x1="0" x2="1000" y1="${y}" y2="${y}" class="${style}"/>`;
    const word = (x, kind) => kind === "blank" ? "" :
      `<text x="${x + 12}" y="${base}" font-size="${size}" class="ws-${kind}">${esc(text)}</text>`;
    return `<svg class="ws-row" viewBox="0 0 1000 92" role="img" aria-label="${esc(text)}">
      ${line(top, "ws-top")}${line(mid, "ws-mid")}${line(base, "ws-base")}${line(tail, "ws-tail")}
      ${cells.map((kind, i) => (i ? `<line x1="${i * width}" x2="${i * width}" y1="${top - 6}" y2="${tail + 4}" class="ws-sep"/>` : "") + word(i * width, kind)).join("")}
    </svg>`;
  }
  const dotPattern = `<svg width="0" height="0" style="position:absolute"><defs>
    <pattern id="wsDots" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.6" r="0.95" fill="#555"/></pattern></defs></svg>`;
  // Every printed sheet starts the same way: the PopSpell logo, its title, a line for the name and
  // date (or the details given), and Pip
  const brandHead = (title, line = "") => `<header class="ws-brand"><img class="ws-logo" src="assets/brand/wordmark-print.webp" alt="PopSpell">
    <div class="ws-brand-text"><h1>${esc(title)}</h1>${line ? `<p>${line}</p>` : ""}</div>
    <img class="ws-pip" src="assets/brand/pip-mascot-small.webp" alt=""></header>`;
  const sheetHead = (title, who, extra = "") => brandHead(title,
    `<b>Name:</b> ${esc(!who || who === "Everyone" ? "____________________" : who)} &nbsp; <b>Date:</b> ____________ ${extra}`);

  function handwritingHTML(who, list) {
    return `${dotPattern}${sheetHead(`${list.title} · handwriting`, who)}
      <p>Look at the word and say its sounds. Trace the grey word, then the dotted word, then write it on your own.</p>
      ${list.items.map(item => handwritingRow(item.spelling)).join("")}`;
  }

  function sentencesHTML(who, list) {
    const sentences = window.SENTENCES || {};
    const rows = list.items.filter(item => sentences[item.spelling.toLowerCase()]).map((item, i) => {
      const sentence = sentences[item.spelling.toLowerCase()];
      const blanked = esc(sentence).replace(new RegExp(`\\b${item.spelling}\\b`, "i"), `<span class="ws-blank"></span>`);
      return `<div class="ws-sentence"><p><b>${i + 1}.</b> ${blanked}</p>${handwritingRow("", ["blank"])}</div>`;
    });
    return `${sheetHead(`${list.title} · sentences`, who)}
      <p>Words to use: <b>${list.items.map(i => esc(i.spelling)).join(", ")}</b></p>
      <p>Fill in the missing word. Then write the whole sentence on the lines, with a capital letter and a full stop.</p>
      ${rows.join("")}`;
  }

  function letterFormationHTML(who) {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    return `${dotPattern}${sheetHead("Letter formation", who)}
      <p>Form each letter the way you've been shown, starting in the right place. Trace the grey letters, then the dotted ones, then write your own.</p>
      ${letters.map(c => handwritingRow(`${c} ${c} ${c}`, ["model", "grey", "dots", "blank"])).join("")}`;
  }

  function printLetters() {
    printSheet("ws-literacy", letterFormationHTML(""));
  }

  function worksheetSpec(who, plan, mode) {
    if (plan.list === "letter-formation") return { className: "ws-literacy", html: letterFormationHTML(who) };
    const list = catalogueList(plan.list);
    if (!list) return null;
    if (mode === "handwriting") return { className: "ws-literacy", html: handwritingHTML(who, list) };
    if (mode === "sentences") return { className: "ws-literacy", html: sentencesHTML(who, list) };
    const lines = list.items.map((item, i) => mode === "key"
      ? `<tr><td>${i + 1}</td><td>${esc(item.spelling)}</td><td>${esc(item.tokens.join(" · "))}</td></tr>`
      : mode === "dictation"
        ? `<tr><td>${i + 1}</td><td class="write-line"></td><td class="check-box">□</td></tr>`
        : `<tr><td>${i + 1}</td><td><div class="sound-boxes">${item.tokens.map(() => "<span></span>").join("")}</div></td>
          <td class="check-box">□</td></tr>`).join("");
    const html = `${mode === "key" ? brandHead(`Words to say: ${list.title}`, `For the adult, not the pupil.${who && who !== "Everyone" ? ` &nbsp; ${esc(who)}` : ""} &nbsp; <b>Date:</b> ${esc(plan.from)}`)
      : brandHead(list.title, `<b>Pupil:</b> ${esc(!who || who === "Everyone" ? "____________________" : who)}
        ${current ? `&nbsp; <b>Class:</b> ${esc(current.name)}` : ""} &nbsp; <b>Date:</b> ${esc(plan.from)}`)}
      <p>${mode === "key" ? "Read each word aloud for the pupil to write. The sound map shows each sound and the letters for it, for checking their work." :
        mode === "dictation" ? "Listen, say the sounds, then write the word your teacher or adult says." :
        "Listen to the word. Say it, stretch it, tap one box for each sound, then write the letters for each sound in its box."}</p>
      ${list.tip ? `<p><b>Sound focus:</b> ${esc(list.tip)}</p>` : ""}
      <table><thead><tr><th>#</th><th>${mode === "key" ? "Word" : mode === "dictation" ? "Write the word" : "Map each sound to letters"}</th>
        <th>${mode === "key" ? "Sound map" : "Check"}</th></tr></thead><tbody>${lines}</tbody></table>`;
    return { className: "", html };
  }
  // The pupil can't do these without someone reading the words out, so the words come too, on their own page
  const needsWords = (plan, mode) => plan.list !== "letter-formation" && (mode === "mapping" || mode === "dictation");
  const withWords = (who, plan, mode, words = needsWords(plan, mode)) => {
    const sheet = worksheetSpec(who, plan, mode);
    return { className: sheet.className, html: `<div class="ws-page">${sheet.html}</div>${words ? `<div class="ws-page ws-adult">${worksheetSpec(who, plan, "key").html}</div>` : ""}` };
  };

  function printWorksheet(who, plan, mode) {
    if (!worksheetSpec(who, plan, mode)) return showError(new Error("Worksheets are available for built-in spelling lists."));
    const sheet = withWords(who, plan, mode);
    printSheet(sheet.className, sheet.html);
  }

  function previewWorksheet(who, plan, mode) {
    if (!worksheetSpec(who, plan, mode)) return showError(new Error("Worksheets are available for built-in spelling lists. Test this activity online instead."));
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>Worksheet preview</h2>
      ${plan.list === "letter-formation" ? "" : `<label>Sheet type <select data-mode><option value="mapping">Sound mapping</option><option value="dictation">Dictation</option>
        <option value="handwriting">Handwriting</option><option value="sentences">Sentences</option><option value="key">Words to say (for you)</option></select></label>`}
      <label class="check" data-words-box><input type="checkbox" data-words checked> The words to say, on a separate page for you</label>
      <button class="btn small" type="button" data-close>Close</button>
      <button class="btn small primary" type="button" data-print>Print / Save PDF</button></div>
      <section class="sheet-preview-page"></section>`;
    document.body.append(dialog);
    const picker = dialog.querySelector("[data-mode]");
    if (picker) picker.value = mode;
    const chosenMode = () => (picker ? picker.value : mode);
    const words = () => needsWords(plan, chosenMode()) && dialog.querySelector("[data-words]").checked;
    const render = () => {
      dialog.querySelector("[data-words-box]").hidden = !needsWords(plan, chosenMode());
      const sheet = withWords(who, plan, chosenMode(), words());
      const page = dialog.querySelector(".sheet-preview-page");
      page.className = `sheet-preview-page ${sheet.className}`;
      page.innerHTML = sheet.html;
      fitPages(page, sheet.className);
    };
    dialog.querySelector("[data-words]").onchange = render;
    if (picker) picker.onchange = render;
    render();
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.querySelector("[data-print]").onclick = () => {
      const sheet = withWords(who, plan, chosenMode(), words());
      dialog.close(); printSheet(sheet.className, sheet.html);
    };
    dialog.showModal();
  }

  function drawMark(body) {
    const list = catalogueList(marking.list);
    if (!list) { marking = null; return drawPlans(body); }
    body.innerHTML = `<div class="row t-row"><h2 class="t-h2">Mark ${esc(list.title)} · ${esc(marking.who)}</h2>
      <button class="btn" id="cancelMark">Back to plans</button></div>
      <p class="hint">Mark every word. “Right with help” counts as correct, but not first time. Tick any sound-to-spelling choices that need practice; they will appear in the pupil's progress summary.</p>
      <form id="markForm"><table class="t-table"><thead><tr><th>Word</th><th>Result</th><th>Sounds to revisit</th></tr></thead>
        <tbody>${list.items.map((item, i) => `<tr><td class="who">${esc(item.spelling)}</td>
          <td><select data-mark="${i}" required><option value="">Choose…</option><option value="first">Right first time</option>
            <option value="help">Right with help</option><option value="miss">Missed</option></select></td>
          <td><div class="sound-choices">${[...new Set(item.tokens)].map(tok => `<label><input type="checkbox" data-sound="${i}" value="${esc(tok)}"> ${esc(tok)}</label>`).join("")}</div></td></tr>`).join("")}</tbody></table>
        <div class="row end"><button class="btn primary" type="submit">Save worksheet results</button></div></form>`;
    $("#cancelMark").onclick = () => { marking = null; drawPlans(body); };
    $("#markForm").onsubmit = async e => {
      e.preventDefault();
      const words = list.items.map((item, i) => {
        const status = body.querySelector(`[data-mark="${i}"]`).value;
        const missed = [...body.querySelectorAll(`[data-sound="${i}"]:checked`)].map(el => el.value);
        return { word: item.spelling, sounds: item.tokens.join(" · "), correct: status !== "miss",
          triesUsed: status === "first" ? 1 : status === "help" ? 2 : 3, wrong: [], missed };
      });
      try { await cloud.recordWorksheet(current.id, marking.who, marking.list, list.title, words);
        marking = null; drawPlans(body); } catch (err) { showError(err); }
    };
  }

  async function drawPlans(body) {
    if (marking) return drawMark(body);
    body.innerHTML = `<div class="empty">Loading…</div>`;
    let rows;
    try { rows = await cloud.assignments(current.id); } catch (err) { return showError(err); }
    if (tab !== "plans") return;
    const plans = rows.flatMap((row, rowIndex) => row.plans.map((plan, planIndex) =>
      ({ row, rowIndex, plan, planIndex })));
    const spellingOptions = ALL_STAGES().map(st => `<optgroup label="${esc(st.stage)}">${st.lists.map(l => `<option value="${esc(l.id)}">${esc(l.title)}</option>`).join("")}</optgroup>`).join("");
    const games = (window.PopActivities?.AREAS.find(area => area.id === "games") || {}).activities || [];
    body.innerHTML = `<div class="work-flow">
      <h2>💻 Online work</h2>
      <p class="hint">Choose a list or activity, test it as a pupil, then schedule when it appears on the child's device.</p>
      <form class="add-row" id="planForm">
        <input type="text" id="planWho" placeholder="Pupil's name (or Everyone)" maxlength="40" required>
        <select id="planList" required>${catalogueOptions()}</select>
        <label>From <input type="date" id="planFrom" value="${todayKey()}" required></label>
        <label>Through <input type="date" id="planUntil" value="${todayKey()}" required></label>
        <a class="btn small" id="planOnlinePreview" target="_blank" rel="noopener" hidden>▶ Test online</a>
        <button class="btn primary" type="submit">Schedule online</button>
      </form></div>
      <div class="work-flow">
        <h2>🖨️ Paper worksheets</h2>
        <p class="hint">Preview the sheet before printing. After the child completes it, enter the marks here; this adds the findings to their progress without assigning online work.</p>
        <div class="add-row" id="paperTools">
          <input type="text" id="paperWho" placeholder="Pupil's name" maxlength="40">
          <select id="paperList"><option value="">Choose a spelling list…</option>${spellingOptions}</select>
          <label>Sheet type <select id="paperMode"><option value="mapping">Sound mapping</option><option value="dictation">Dictation</option>
            <option value="handwriting">Handwriting</option><option value="sentences">Sentences</option><option value="key">Words to say (for you)</option></select></label>
          <button class="btn small" id="paperPreview" type="button" disabled>👀 Preview sheet</button>
          <button class="btn small" id="paperPrint" type="button" disabled>🖨️ Print / Save PDF</button>
          <button class="btn small primary" id="paperMark" type="button" disabled>✍️ Enter marks</button>
        </div>
        <div class="row"><button class="btn small" id="printLetters" type="button">Print letter formation (a–z)</button></div>
      </div>
      <div class="work-flow">
        <h2>🎮 Quick game</h2>
        <p class="hint">Test a game first, then give it to one pupil for today. It disappears from their assigned work after today.</p>
        <form class="add-row" id="quickGameForm">
          <input type="text" id="quickWho" placeholder="Pupil's name" maxlength="40" required>
          <select id="quickGame">${games.map(g => `<option value="${esc(g.id)}">${esc(g.title)}</option>`).join("")}</select>
          <a class="btn small" id="quickPreview" target="_blank" rel="noopener" href="${esc(games.length ? previewHref(games[0].id) : "#")}">▶ Test game</a>
          <button class="btn primary" type="submit">Assign for today</button>
        </form>
      </div>
      <h2 class="t-h2">Scheduled work</h2>
      ${plans.length ? `<div class="pupil-grid">${plans.map(({ row, rowIndex, plan, planIndex }) => `
        <article class="pcard t-plancard">
          <h3>${esc(row.who)} · ${esc(listTitle(plan.list))}</h3>
          <div class="add-row"><label>From <input type="date" data-from="${rowIndex}-${planIndex}" value="${esc(plan.from)}"></label>
            <label>Through <input type="date" data-until="${rowIndex}-${planIndex}" value="${esc(plan.until)}"></label>
            <button class="btn small" data-save-plan="${rowIndex}-${planIndex}">Save dates</button></div>
          <div class="row"><a class="btn small" href="${esc(previewHref(plan.list))}" target="_blank" rel="noopener">▶ Test online</a>
            ${catalogueList(plan.list) ? `<button class="btn small" data-preview-plan="${rowIndex}-${planIndex}">👀 Preview worksheet</button>
            <button class="btn small" data-print-mapping="${rowIndex}-${planIndex}">Print sound map / Save PDF</button>
            <button class="btn small" data-print-dictation="${rowIndex}-${planIndex}">Print dictation / Save PDF</button>
            <button class="btn small" data-print-key="${rowIndex}-${planIndex}">Print words to say</button>
            <button class="btn small" data-print-handwriting="${rowIndex}-${planIndex}">Print handwriting</button>
            <button class="btn small" data-print-sentences="${rowIndex}-${planIndex}">Print sentences</button>
            ${row.who.toLowerCase() === "everyone" ? "" : `<button class="btn small" data-mark-plan="${rowIndex}-${planIndex}">Mark worksheet</button>`}` : `<span class="hint">Online activity · no paper sheet</span>`}
            <button class="btn small" data-remove-plan="${rowIndex}-${planIndex}">Remove</button></div>
        </article>`).join("")}</div>` : `<div class="empty">No plans yet — schedule one above.</div>`}`;
    const ref = key => { const [r, p] = key.split("-").map(Number); return { row: rows[r], index: p, plan: rows[r].plans[p] }; };
    $("#planList").onchange = () => {
      const href = previewHref($("#planList").value);
      $("#planOnlinePreview").hidden = !href;
      if (href) $("#planOnlinePreview").href = href;
    };
    const paperSelection = () => {
      const ready = !!$("#paperList").value;
      $("#paperPreview").disabled = !ready;
      $("#paperPrint").disabled = !ready;
      $("#paperMark").disabled = !ready;
    };
    $("#paperList").onchange = paperSelection;
    const paperPlan = () => ({ list: $("#paperList").value, from: todayKey() });
    $("#paperPreview").onclick = () => previewWorksheet($("#paperWho").value.trim(), paperPlan(), $("#paperMode").value);
    $("#paperPrint").onclick = () => printWorksheet($("#paperWho").value.trim(), paperPlan(), $("#paperMode").value);
    $("#paperMark").onclick = () => {
      const who = $("#paperWho").value.trim();
      if (!who || who.toLowerCase() === "everyone") return showError(new Error("Enter the pupil's name before recording marks."));
      marking = { who, list: $("#paperList").value };
      drawMark(body);
    };
    $("#quickGame").onchange = () => { $("#quickPreview").href = previewHref($("#quickGame").value); };
    $("#quickGameForm").onsubmit = async e => {
      e.preventDefault();
      const who = $("#quickWho").value.trim();
      const game = $("#quickGame").value;
      if (!who || !game) return;
      const existing = rows.find(r => r.who.toLowerCase() === who.toLowerCase());
      const today = todayKey();
      const gameIds = new Set(games.map(g => g.id));
      const prior = (existing ? existing.plans : []).filter(p =>
        p.until >= today || !gameIds.has(p.list) || p.from !== p.until);
      if ((existing?.lists || []).includes(game) || prior.some(p => p.list === game && p.from <= today && today <= p.until))
        return showError(new Error("This game is already assigned to that pupil for today."));
      if (prior.length >= 30) return showError(new Error("This pupil has the maximum of 30 plans."));
      try { await cloud.savePlans(current.id, existing ? existing.who : who, prior.concat({ list: game, from: today, until: today }));
        drawPlans(body); } catch (err) { showError(err); }
    };
    $("#planForm").onsubmit = async e => {
      e.preventDefault();
      const who = $("#planWho").value.trim();
      const list = $("#planList").value;
      const from = $("#planFrom").value;
      const until = $("#planUntil").value;
      if (from > until) return showError(new Error("The end date must be on or after the start date."));
      const existing = rows.find(r => r.who.toLowerCase() === who.toLowerCase());
      const prior = existing ? existing.plans : [];
      if (prior.length >= 30) return showError(new Error("This pupil has the maximum of 30 plans."));
      try { await cloud.savePlans(current.id, existing ? existing.who : who, prior.concat({ list, from, until }));
        drawPlans(body); } catch (err) { showError(err); }
    };
    body.querySelectorAll("[data-save-plan]").forEach(b => { b.onclick = async () => {
      const { row, index } = ref(b.dataset.savePlan);
      const from = body.querySelector(`[data-from="${b.dataset.savePlan}"]`).value;
      const until = body.querySelector(`[data-until="${b.dataset.savePlan}"]`).value;
      if (!from || !until || from > until) return showError(new Error("Choose a valid date range."));
      try { await cloud.savePlans(current.id, row.who, row.plans.map((p, i) => i === index ? { ...p, from, until } : p));
        drawPlans(body); } catch (err) { showError(err); }
    }; });
    body.querySelectorAll("[data-remove-plan]").forEach(b => { b.onclick = async () => {
      const { row, index } = ref(b.dataset.removePlan);
      try { await cloud.savePlans(current.id, row.who, row.plans.filter((_, i) => i !== index));
        drawPlans(body); } catch (err) { showError(err); }
    }; });
    $("#printLetters").onclick = printLetters;
    body.querySelectorAll("[data-preview-plan]").forEach(b => { b.onclick = () => {
      const { row, plan } = ref(b.dataset.previewPlan);
      previewWorksheet(row.who, plan, "mapping");
    }; });
    ["mapping", "dictation", "key", "handwriting", "sentences"].forEach(mode => body.querySelectorAll(`[data-print-${mode}]`).forEach(b => {
      b.onclick = () => { const { row, plan } = ref(b.dataset[`print${mode[0].toUpperCase() + mode.slice(1)}`]);
        printWorksheet(row.who, plan, mode); };
    }));
    body.querySelectorAll("[data-mark-plan]").forEach(b => { b.onclick = () => {
      const { row, plan } = ref(b.dataset.markPlan);
      marking = { who: row.who, list: plan.list };
      drawMark(body);
    }; });
  }

  /* ---------- Next steps: each pupil's next lesson, what's planned, and a suggestion ---------- */

  // The teaching order: spelling lists stage by stage, then any other activities in their order
  const teachingOrder = () => P().STAGES.flatMap(st => st.lists.map(l => l.id))
    .concat((window.PopActivities ? window.PopActivities.order() : []));
  const titleOf = id => listTitle(id);

  // What to do next, from the pupil's latest result on the planned sequence
  function suggestFor(latest, summary) {
    const order = teachingOrder();
    if (!latest || !order.includes(latest.listId)) {
      return { kind: "start", list: order[0], text: `Nothing recorded yet — start with ${titleOf(order[0])}` };
    }
    const words = latest.words || [];
    const first = words.filter(w => w.correct && w.triesUsed === 1).length;
    const pct = words.length ? Math.round((first / words.length) * 100) : 0;
    const top = summary && summary.topSounds && summary.topSounds[0] ? summary.topSounds[0][0] : "";
    const next = order[order.indexOf(latest.listId) + 1];
    if (pct >= 80) {
      return next
        ? { kind: "next", list: next, text: `Move on to ${titleOf(next)} — ${pct}% right first time on ${latest.list}` }
        : { kind: "done", list: latest.listId, text: `${pct}% on the last list in the sequence — revise tricky words` };
    }
    if (pct >= 50) return { kind: "again", list: latest.listId, text: `Practise ${latest.list} again — ${pct}% right first time` };
    return { kind: "reteach", list: latest.listId,
      text: `Re-teach ${latest.list} — only ${pct}% right first time${top ? `; ${top} missed most` : ""}` };
  }

  // A starting check (app.js) places the pupil at the first list or activity with a gap
  function checkResult(check) {
    const area = P().checkKind(check.listId) === "spelling" ? "Spelling" : "Numbers";
    const gaps = P().checkGaps(check.words || []);
    const unfinished = check.finished === false ? " (stopped early)" : "";
    if (!gaps.length) {
      return { kind: "check", list: "", short: `${area}: no gaps found${unfinished}`,
        text: `Starting check on ${day(check.at)}: no gaps found in ${area.toLowerCase()}${unfinished}. Choose the next work yourself` };
    }
    const also = gaps.length > 1 ? `; also gaps in ${gaps.slice(1).map(titleOf).join(", ")}` : "";
    return { kind: "check", list: gaps[0], short: `${area}: start with ${titleOf(gaps[0])}${unfinished}`,
      text: `Starting check on ${day(check.at)}: start ${area.toLowerCase()} with ${titleOf(gaps[0])}${also}` };
  }

  async function drawNext(body) {
    body.innerHTML = `<div class="empty">Loading…</div>`;
    let sessions, roster, assignments;
    try { [sessions, roster, assignments] = await Promise.all([
      cloud.sessions(current.id, 120), cloud.pupils(current.id), cloud.assignments(current.id)]); }
    catch (err) { return showError(err); }
    if (tab !== "next") return;
    const today = todayKey();
    const key = n => String(n || "").trim().toLowerCase();
    const names = new Map();
    roster.forEach(r => names.set(key(r.name), r.name));
    assignments.forEach(a => { if (key(a.who) !== "everyone") names.set(key(a.who), names.get(key(a.who)) || a.who); });
    sessions.forEach(s => { if (s.pupil && !names.has(key(s.pupil))) names.set(key(s.pupil), s.pupil); });
    const summaries = summarise(sessions);
    const rows = [...names.entries()].map(([k, name]) => {
      const r = roster.find(x => key(x.name) === k) || null;
      const a = assignments.find(x => key(x.who) === k) || null;
      const upcoming = (a ? a.plans : []).filter(p => p.until >= today).sort((x, y) => x.from.localeCompare(y.from))[0] || null;
      const latest = sessions.find(s => key(s.pupil) === k) || null; // newest first
      // Suggestions follow the teaching order, so they ignore extras like dictation or teachers' own lists
      const order = teachingOrder();
      const latestInOrder = sessions.find(s => key(s.pupil) === k && order.includes(s.listId)) || null;
      const summary = summaries.find(x => key(x.pupil) === k) || null;
      const lessonDate = r && r.nextLessonDate >= today ? r.nextLessonDate : "";
      // The newest starting check of each kind; it leads the suggestion until newer work comes in
      const checks = Object.values(P().CHECKS).map(c => sessions.find(s => key(s.pupil) === k && s.listId === c.id)).filter(Boolean);
      const newestCheck = checks.slice().sort((x, y) => y.at - x.at)[0];
      const suggestion = newestCheck && (!latestInOrder || newestCheck.at > latestInOrder.at)
        ? checkResult(newestCheck) : suggestFor(latestInOrder, summary);
      return { k, name, r, a, upcoming, latest, summary, lessonDate, checks, suggestion };
    }).sort((x, y) => (x.lessonDate || "9999").localeCompare(y.lessonDate || "9999") || x.name.localeCompare(y.name));
    refreshParents(roster, sessions, assignments);
    const when = d => d ? new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "";
    const unplanned = rows.filter(x => !x.upcoming).length;
    body.innerHTML = `
      <p class="hint">Each pupil's next lesson, what's planned for it, how they did last time, and a suggestion that follows the teaching order.
        <b>Plan it</b> puts the suggestion on the pupil's schedule for that date (and as their homework list), or choose something else.</p>
      ${rows.length ? `<p class="pill${unplanned ? " stuck" : ""}">${unplanned ? `⚠ ${plural(unplanned, "pupil has", "pupils have")} nothing planned` : "✓ Every pupil has work planned"}</p>
      <div class="next-list">${rows.map((x, i) => `
        <article class="pcard next-card${x.upcoming ? "" : " unplanned"}">
          <div class="next-head"><h3>${esc(x.name)}</h3>
            <span class="meta">${x.lessonDate ? `Next lesson ${esc(when(x.lessonDate))}${x.r && x.r.lessonTime ? ` at ${esc(x.r.lessonTime)}` : ""}` : "No lesson date set"}</span></div>
          <p><b>Planned:</b> ${x.upcoming ? `${esc(titleOf(x.upcoming.list))} · ${esc(when(x.upcoming.from))}${x.upcoming.until !== x.upcoming.from ? `–${esc(when(x.upcoming.until))}` : ""}` : `<span class="miss">Nothing planned</span>`}</p>
          <p><b>Last time:</b> ${x.latest ? `${esc(x.latest.list)} · ${(x.latest.words || []).filter(w => w.correct && w.triesUsed === 1).length}/${(x.latest.words || []).length} first time · ${esc(day(x.latest.at))}${x.latest.source === "worksheet" ? " (worksheet)" : ""}` : "—"}</p>
          ${x.checks.length ? `<p><b>🧭 Starting check:</b> ${x.checks.map(c => esc(checkResult(c).short)).join(" · ")}</p>` : ""}
          ${x.summary && x.summary.topSounds.length ? `<p><b>To work on:</b> ${x.summary.topSounds.slice(0, 3).map(([s, n]) => `<span class="sound-chip">${esc(s)} ×${n}</span>`).join("")}</p>` : ""}
          <div class="next-suggest"><span>💡 ${esc(x.suggestion.text)}</span></div>
          <form class="add-row" data-plan-row="${i}">
            <select data-plan-list>${catalogueOptions()}</select>
            <input type="date" data-plan-date value="${esc(x.lessonDate || today)}" min="${today}" required>
            <button class="btn primary small" type="submit">Plan it</button>
          </form>
        </article>`).join("")}</div>`
      : `<div class="empty">No pupils yet. Add them in the <b>Pupils</b> tab, or they appear here after their first list.</div>`}`;
    body.querySelectorAll("[data-plan-row]").forEach(form => {
      const x = rows[Number(form.dataset.planRow)];
      form.querySelector("[data-plan-list]").value = x.suggestion.list || "";
      form.onsubmit = async e => {
        e.preventDefault();
        const list = form.querySelector("[data-plan-list]").value;
        const date = form.querySelector("[data-plan-date]").value;
        if (!list) return form.querySelector("[data-plan-list]").focus();
        const plans = x.a ? x.a.plans : [];
        if (plans.length >= 30) return showError(new Error("This pupil has the maximum of 30 plans — remove old ones in Plans & worksheets."));
        try {
          await cloud.savePlans(current.id, x.a ? x.a.who : x.name, plans.concat({ list, from: date, until: date }));
          if (x.r) await cloud.savePupil(current.id, Object.assign({}, x.r, { homeworkList: list, nextLessonDate: date }));
          // The parent page shows what's coming next, so it changes with the plan
          if (x.r && x.r.parentLink) {
            const [s, a] = await parentData();
            await publishParent(Object.assign({}, x.r, { homeworkList: list, nextLessonDate: date }), s, a);
          }
          if (x.r && date !== x.r.nextLessonDate) await calendarAfterSave(Object.assign({}, x.r, { homeworkList: list, nextLessonDate: date }));
          drawNext(body);
        } catch (err) { showError(err); }
      };
    });
  }

  /* ---------- Lesson programme: a lesson-by-lesson plan for each pupil ---------- */

  // Each lesson rotates between work with the teacher, on the device and on paper. Its spelling
  // list and maths activity move on when the pupil is ready (the teacher decides at the end of the
  // lesson); the warm-up, story and number facts are chosen to match. The shape follows Making
  // Maths Count (short, frequent revisiting of number facts, talking about thinking) and Reading
  // Schools (reading for pleasure every lesson), and each part names its CfE outcomes.
  const LEVEL_ORDER = ["Early", "First", "Second"];
  const spellingOrder = () => P().STAGES.flatMap(st => st.lists.map(l => l.id));
  const englandOrder = () => (P().EXTRA_STAGES || []).flatMap(st => st.lists.map(l => l.id));
  // A pupil moves on within the sequence their list is in, never from one into the other
  const orderFor = id => (englandOrder().includes(id) ? englandOrder() : spellingOrder());
  // Stories and games for an England list: the phonics stage its words are closest to
  const phonicsStageOf = id => (stageOf(id) >= 0 ? stageOf(id) : /^cew-y1/.test(id) ? 2 : /^cew-y2/.test(id) ? 4 : P().STAGES.length - 1);
  const mathsOrder = () => {
    const area = window.PopActivities && window.PopActivities.AREAS.find(a => a.id === "numeracy");
    return area ? area.activities.slice().sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)).map(a => a.id) : [];
  };
  const firstPct = s => { const ws = (s && s.words) || []; return ws.length ? Math.round((ws.filter(w => w.correct && w.triesUsed === 1).length / ws.length) * 100) : null; };
  // What CfE expects for each year group: most children achieve Early level by the end of P1,
  // First by the end of P4, Second by the end of P7 and Third in S1 to S3. Some get there sooner
  // and some need longer; teachers judge it using the benchmarks.
  const EXPECTED = {
    Nursery: ["Early", "most children achieve it by the end of P1"], P1: ["Early", "to be achieved by the end of P1"],
    P2: ["First", "working through it, to achieve it by the end of P4"], P3: ["First", "working through it, to achieve it by the end of P4"],
    P4: ["First", "to be achieved by the end of P4"], P5: ["Second", "working through it, to achieve it by the end of P7"],
    P6: ["Second", "working through it, to achieve it by the end of P7"], P7: ["Second", "to be achieved by the end of P7"],
    S1: ["Third", "working through it, to achieve it by the end of S3"], S2: ["Third", "working through it, to achieve it by the end of S3"],
    S3: ["Third", "to be achieved by the end of S3"],
    // S4 to S6 are the senior phase, after the broad general education, so they're compared with Third level
    S4: ["Third", "the senior phase: compared with Third level, the end of the broad general education"],
    S5: ["Third", "the senior phase: compared with Third level, the end of the broad general education"],
    S6: ["Third", "the senior phase: compared with Third level, the end of the broad general education"]
  };
  const ALL_LEVELS = ["Early", "First", "Second", "Third"];
  const yearLevel = year => { const e = EXPECTED[year]; return e ? (e[0] === "Third" ? "Second" : e[0]) : ""; };
  const LEVEL_STATUS = { below: "Below expected", at: "As expected", beyond: "Beyond expected" };
  const YEAR_STATUS = { below: "Below their year", at: "In line with their year", beyond: "Beyond their year" };
  // Years 7 to 11 are compared with the end of key stage 2, as PopSpell's work is mostly primary
  const SECONDARY_STATUS = { below: "Below the end of key stage 2", at: "At the end of key stage 2", beyond: "Key stage 3 work" };
  const yearStatus = (yearGroup, status) => ((E_() && E_().pupilYear(yearGroup) >= 7 ? SECONDARY_STATUS : YEAR_STATUS)[status] || "");
  // England (england.js): the year and statements a piece of work covers
  const E_ = () => window.PopEngland;
  const inEngland = r => Boolean(r && E_() && E_().isEngland(r.yearGroup));
  const enWork = id => (E_() ? E_().forWork(id) : null);
  // "National curriculum: Year 3 · Number – multiplication and division"
  const ncLine = id => { const w = enWork(id); return !w ? "" : w.statements.length ? `${w.label} · ${w.domain}` : w.label; };
  // Reception follows the EYFS framework rather than the national curriculum
  const ncSource = w => (w && w.statements.length && w.statements[0].year === "R" ? "EYFS" : "National curriculum");
  const ncRef = id => (ncLine(id) ? `${ncSource(enWork(id))}: ${ncLine(id)}` : "");
  // Where the pupil is working, against what's expected for their year group
  function levelCheck(r, prog) {
    if (inEngland(r)) {
      const exp = E_().expected(r.yearGroup);
      const areas = [prog.focus !== "maths" && ["Literacy", prog.spelling], prog.focus !== "literacy" && ["Maths", prog.maths]].filter(Boolean)
        .map(([area, id]) => ({ area, id, work: enWork(id) })).filter(a => a.work && a.work.lo !== null);
      return { england: true, year: r.yearGroup, expected: exp,
        areas: areas.map(a => ({ area: a.area, level: a.work.label, domain: a.work.domain, status: E_().status(r.yearGroup, a.work) })) };
    }
    const exp = EXPECTED[r.yearGroup];
    const A = A_();
    const areas = [prog.focus !== "maths" && ["Literacy", levelOfStage(stageOf(prog.spelling))],
      prog.focus !== "literacy" && ["Maths", ((A && A.get(prog.maths)) || {}).level]].filter(a => a && a[1]);
    return { year: r.yearGroup, expected: exp, areas: areas.map(([area, level]) => {
      const gap = exp ? ALL_LEVELS.indexOf(level) - ALL_LEVELS.indexOf(exp[0]) : 0;
      return { area, level, status: !exp ? "" : gap < 0 ? "below" : gap > 0 ? "beyond" : "at" };
    }) };
  }
  function levelsHTML(r, prog) {
    const c = levelCheck(r, prog);
    if (!c.expected) return `<p class="hint prog-levels">Add ${esc(r.name)}'s year group (in Pupils) to see what's expected for their age next to where they're working: a CfE level for P1–S6, or a national curriculum year for Reception–Year 11.</p>`;
    if (c.england) return `<div class="prog-levels"><p><b>🎯 Expected for ${esc(c.year)}</b> (${esc(c.expected.stage)}): ${esc(c.expected.text)}.</p>
      ${c.areas.map(a => `<p><span class="lv-badge lv-${a.status}">${yearStatus(c.year, a.status)}</span> <b>${a.area}:</b> working on ${esc(a.level)} work (${esc(a.domain)})</p>`).join("")}</div>`;
    return `<div class="prog-levels"><p><b>🎯 Expected for ${esc(c.year)}:</b> ${c.expected[0]} level (${esc(c.expected[1])}).</p>
      ${c.areas.map(a => `<p><span class="lv-badge lv-${a.status}">${LEVEL_STATUS[a.status]}</span> <b>${a.area}:</b> working at ${a.level} level</p>`).join("")}</div>`;
  }
  // Sound games that practise each spelling stage (stage 1 is short vowels)
  const STAGE_GAMES = [["g-hopper-short", "g-switch-first"], ["g-hopper-digraphs", "g-switch-digraphs", "g-switch-build"],
    ["g-switch-build", "g-hopper-short"], ["g-hopper-long-a", "g-switch-build"], ["g-hopper-r"], ["g-hopper-r", "g-switch-build"]];
  const CANOPY_GAMES = { Early: ["g-canopy-flash", "g-canopy-make", "g-canopy-hidden", "g-canopy-compare", "g-canopy-run"], First: ["g-canopy-twenty", "g-canopy-run-20"] };

  // Where a pupil's programme starts: the newest of Pip's Sound Quest, a starting check or their
  // practice, and for maths with nothing yet, the start of their year group's CfE level
  function programmeStart(r, sessions) {
    const mine = sessions.filter(s => sameName(s.pupil, r.name)); // newest first
    const quest = questSessions(r.name, sessions);
    const gap = s => P().checkGaps(s.words || [])[0];
    const pickNewest = options => options.filter(o => o.s).sort((a, b) => b.s.at - a.s.at)[0];
    const sOrder = spellingOrder(), mOrder = mathsOrder();
    const nextAfter = (order, s) => { const i = order.indexOf(s.listId); return firstPct(s) >= 80 && order[i + 1] ? order[i + 1] : s.listId; };
    const spellingCheck = mine.find(s => s.listId === P().CHECKS.spelling.id);
    const spellingPractice = mine.find(s => sOrder.includes(s.listId));
    const spelling = pickNewest([
      { s: quest.spell, list: quest.spell && (gap(quest.spell) || sOrder[sOrder.length - 1]), why: "Pip's Sound Quest" },
      { s: spellingCheck, list: spellingCheck && (gap(spellingCheck) || sOrder[sOrder.length - 1]), why: "the spelling starting check" },
      { s: spellingPractice, list: spellingPractice && nextAfter(sOrder, spellingPractice), why: "their last spelling result" }]);
    const mathsCheck = mine.find(s => s.listId === P().CHECKS.numbers.id);
    const mathsPractice = mine.find(s => mOrder.includes(s.listId));
    const maths = pickNewest([
      { s: quest.numbers, list: quest.numbers && (gap(quest.numbers) || mOrder[mOrder.length - 1]), why: "Pip's Sound Quest" },
      { s: mathsCheck, list: mathsCheck && (gap(mathsCheck) || mOrder[mOrder.length - 1]), why: "the numbers starting check" },
      { s: mathsPractice, list: mathsPractice && nextAfter(mOrder, mathsPractice), why: "their last maths result" }]);
    const level = yearLevel(r.yearGroup);
    // England: the first activity from their year's programme (or the nearest year before it)
    const enYear = inEngland(r) ? E_().expected(r.yearGroup).compare : null;
    const enStart = enYear === null ? null : mOrder.map(id => [id, enWork(id)]).filter(([, w]) => w && w.lo !== null && w.lo <= enYear)
      .sort((a, b) => b[1].lo - a[1].lo || mOrder.indexOf(a[0]) - mOrder.indexOf(b[0]))[0];
    const mathsByYear = enStart ? enStart[0] : level && mOrder.find(id => window.PopActivities.get(id).level === level);
    const yearWhy = enStart ? `${enStart[1].label} work, for ${r.yearGroup}` : `the start of ${level} level, for ${r.yearGroup}`;
    return {
      spelling: spelling ? spelling.list : sOrder[0], spellingWhy: spelling ? spelling.why : "the first spelling list",
      maths: maths ? maths.list : mathsByYear || mOrder[0],
      mathsWhy: maths ? maths.why : mathsByYear ? yearWhy : "the first maths activity"
    };
  }

  // "Add two small numbers." → "I can add two small numbers."
  const canDo = (blurb, title) => (/[.!]$/.test(blurb || "") ? `I can ${blurb[0].toLowerCase()}${blurb.slice(1)}` : `I can answer questions about ${title.toLowerCase()}.`);
  const A_ = () => window.PopActivities;
  const codesOf = (id, level) => {
    const A = A_();
    const act = A && A.get(id);
    if (catalogueList(id)) return (A.tag(id) || {}).eo || [];
    return act ? A.eo(act.organiser, level || act.level, id) : [];
  };

  // The parts of one lesson, with minutes shared out to fit the lesson length
  function lessonParts(prog, n, length) {
    const A = A_();
    const list = prog.focus !== "maths" ? catalogueList(prog.spelling) : null;
    const act = prog.focus !== "literacy" && A ? A.get(prog.maths) : null;
    const stage = list ? phonicsStageOf(prog.spelling) : -1;
    const level = list ? levelOfStage(stage) : "";
    const rotate = arr => arr.filter(Boolean)[(n - 1) % Math.max(1, arr.filter(Boolean).length)] || null;
    const parts = [];
    const game = list ? rotate((STAGE_GAMES[stage] || []).map(id => A.get(id))) : act ? rotate((CANOPY_GAMES[act.level] || []).map(id => A.get(id))) : null;
    if (game) parts.push({ key: "warm", icon: "🎮", where: "device", weight: 1, title: `Warm-up: ${game.title}`, id: game.id,
      how: "A quick game to get going. Praise effort and sharp listening." });
    if (list) {
      const words = list.items.slice(0, 4).map(it => it.spelling).join(", ");
      parts.push({ key: "sounds", icon: "👩‍🏫", where: "you", weight: 2, title: `Teach: ${list.title}`, id: list.id, sheet: { kind: "mapping", id: list.id },
        how: `${list.tip || "Introduce the sound."} Say ${words}… Tap out each sound, then map the letters on the sound map sheet.`,
        intention: `We are learning to read and spell words with ${list.title.replace(/ \(.*\)$/, "")}.`,
        criteria: ["I can hear each sound in a word.", "I can write the letters for each sound."], codes: codesOf(list.id) });
      parts.push({ key: "spell", icon: "💻", where: "device", weight: 1, title: `Spell: ${list.title}`, id: list.id,
        how: "The pupil hears each word, maps its sounds and spells it. Watch which sounds they miss." });
      const stories = A ? A.AREAS.find(a => a.id === "stories").activities : [];
      const passages = A ? A.AREAS.find(a => a.id === "reading").activities.filter(a => a.passage) : [];
      const fits = stories.filter(s => s.stage === stage + 1);
      const story = rotate(fits.length ? fits.concat(stage >= 4 ? passages.filter(p => p.level === level) : [])
        : stories.filter(s => s.stage <= stage + 1).concat(passages.filter(p => p.level === level)));
      if (story) parts.push({ key: "read", icon: "📖", where: "device", weight: 2, title: `Read: ${story.title}`, id: story.id, sheet: { kind: "activity", id: story.id },
        how: "Read it together or alone, on screen or on paper, then answer the questions. Ask: what did you like? What might happen next?",
        codes: codesOf(story.id) });
    }
    if (act) {
      const secured = (prog.log || []).filter(l => l.mathsNext && l.maths && l.maths !== act.id).map(l => l.maths);
      const facts = A.get(secured[secured.length - 1]) || null;
      if (facts) parts.push({ key: "facts", icon: "⚡", where: "device", weight: 1, title: `Number facts: ${facts.title}`, id: facts.id,
        how: "A few minutes of quick-fire facts they've already secured, to keep them fluent." });
      parts.push({ key: "maths", icon: "👩‍🏫", where: "you", weight: 3, title: `Teach: ${act.title}`, id: act.id, sheet: { kind: "activity", id: act.id },
        how: `Model one or two with objects, pictures or a number line, then the pupil does the sheet. Talk about it: “How did you work that out? Is there another way?” Mistakes are how we learn.`,
        intention: `We are learning about ${act.title.charAt(0).toLowerCase()}${act.title.slice(1)}.`, criteria: [canDo(act.blurb, act.title)], codes: codesOf(act.id) });
      parts.push({ key: "practise", icon: "💻", where: "device", weight: 1, title: `Practise: ${act.title}`, id: act.id,
        how: "Questions get harder as they go. Every question is read aloud." });
    }
    if (list && list.items.some(it => it.sentence)) parts.push({ key: "dictation", icon: "📝", where: "paper", weight: 1, title: `Dictation: ${list.title}`,
      id: `dictate:${list.id}`, sheet: { kind: "activity", id: `dictate:${list.id}` },
      how: "Read each sentence aloud twice. The pupil writes it: capital letter, spellings and full stop.", codes: codesOf(`dictate:${list.id}`, level) });
    parts.push({ key: "wrap", icon: "⭐", where: "you", weight: 1, title: "Story time, praise and home",
      how: `Share a book the pupil chooses, for the joy of it. Say what they did well. At home: ${list ? `${list.title} on PopSpell, and 10 minutes reading together` : `${act ? act.title : "maths"} on PopSpell, and spotting numbers out and about (prices, clocks, house numbers)`}.` });
    // Short lessons drop the extras first, so the main parts get time to breathe
    const dropFirst = ["facts", "warm", "dictation", "practise", "spell", "read"];
    let use = parts;
    while (use.length > Math.floor((length / 5) * 0.8)) {
      const key = dropFirst.find(k => use.some(p => p.key === k));
      if (!key) break;
      use = use.filter(p => p.key !== key);
    }
    const units = Math.round(length / 5);
    const total = use.reduce((sum, p) => sum + p.weight, 0);
    const exact = use.map(p => (p.weight / total) * units);
    const share = exact.map(x => Math.max(1, Math.floor(x)));
    while (share.reduce((a, b) => a + b, 0) < units) {
      const i = exact.map((x, j) => x - share[j]).reduce((best, x, j, all) => (x > all[best] ? j : best), 0);
      share[i]++;
    }
    while (share.reduce((a, b) => a + b, 0) > units) share[share.indexOf(Math.max(...share))]--;
    return use.map((p, i) => Object.assign(p, { minutes: share[i] * 5 }));
  }

  // The programme moved on one lesson: the next list and maths activity, if the pupil moves on
  function advanced(prog, spellingNext, mathsNext) {
    const mOrder = mathsOrder();
    const next = (order, id, go) => (go && order.includes(id) && order[order.indexOf(id) + 1]) || id;
    return Object.assign({}, prog, { lesson: prog.lesson + 1,
      spelling: prog.focus === "maths" ? prog.spelling : next(orderFor(prog.spelling), prog.spelling, spellingNext),
      maths: prog.focus === "literacy" ? prog.maths : next(mOrder, prog.maths, mathsNext) });
  }
  const WHERE = { you: "👩‍🏫 With you", device: "💻 On the device", paper: "📝 On paper" };
  const lessonTopics = prog => [prog.focus !== "maths" ? titleOf(prog.spelling) : "", prog.focus !== "literacy" ? titleOf(prog.maths) : ""].filter(Boolean).join(" · ");

  let openProgramme = "";
  async function drawProgramme(body) {
    body.innerHTML = `<div class="empty">Loading…</div>`;
    let sessions, roster, assignments;
    try { [sessions, roster, assignments] = await Promise.all([cloud.sessions(current.id, 365), cloud.pupils(current.id), cloud.assignments(current.id)]); }
    catch (err) { return showError(err); }
    if (tab !== "programme") return;
    const prefs = calendarPrefs();
    const length = LESSON_LENGTHS.includes(Number(prefs.length)) ? Number(prefs.length) : 60;
    const today = todayKey();
    const when = d => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    const rows = roster.map(r => ({ r, a: assignments.find(x => sameName(x.who, r.name)) || null, prog: r.programme || null, start: programmeStart(r, sessions) }))
      .sort((x, y) => (!!y.prog - !!x.prog) || ((x.r.nextLessonDate >= today ? x.r.nextLessonDate : "9999").localeCompare(y.r.nextLessonDate >= today ? y.r.nextLessonDate : "9999")) || x.r.name.localeCompare(y.r.name));
    const listOptions = chosen => ALL_STAGES().map(st => `<optgroup label="${esc(st.stage)}">${st.lists.map(l => `<option value="${esc(l.id)}"${l.id === chosen ? " selected" : ""}>${esc(l.title)}</option>`).join("")}</optgroup>`).join("");
    const mathsOptions = chosen => LEVEL_ORDER.map(lv => `<optgroup label="${lv} level">${mathsOrder().map(id => A_().get(id)).filter(a => a.level === lv)
      .map(a => `<option value="${esc(a.id)}"${a.id === chosen ? " selected" : ""}>${esc(a.title)}</option>`).join("")}</optgroup>`).join("");
    const focusOptions = chosen => [["both", "Literacy and maths"], ["literacy", "Literacy only"], ["maths", "Maths only"]]
      .map(([v, t]) => `<option value="${v}"${v === chosen ? " selected" : ""}>${t}</option>`).join("");
    const startForm = (x, i) => `<div class="add-row prog-start" data-start-form="${i}">
        <label>Spelling and reading <select data-start-spelling>${listOptions(x.prog ? x.prog.spelling : x.start.spelling)}</select></label>
        <label>Maths <select data-start-maths>${mathsOptions(x.prog ? x.prog.maths : x.start.maths)}</select></label>
        <label>Covers <select data-start-focus>${focusOptions(x.prog ? x.prog.focus : "both")}</select></label>
        <button class="btn primary" type="button" data-start="${i}">${x.prog ? "Save changes" : "Start the programme"}</button>
        ${x.prog ? `<button class="btn" type="button" data-stop="${i}">Stop the programme</button>` : ""}</div>`;
    const partCodes = (p, x) => (!p.codes ? "" : inEngland(x.r) ? (ncRef(p.id) ? `<br><span class="prog-codes">${esc(ncRef(p.id))}</span>` : "")
      : p.codes.length ? `<br><span class="prog-codes">CfE ${esc(p.codes.join(", "))}</span>` : "");
    const planTable = (parts, x) => `<table class="t-table prog-plan"><thead><tr><th>Part</th><th>Time</th><th>What to do</th><th></th></tr></thead><tbody>
      ${parts.map(p => `<tr><td><b>${p.icon} ${esc(p.title)}</b><br><span class="hint">${WHERE[p.where]}</span></td><td>${p.minutes} min</td>
        <td>${esc(p.how)}${partCodes(p, x)}</td>
        <td>${p.id && previewHref(p.id) ? `<a class="btn small" href="${esc(previewHref(p.id))}" target="_blank" rel="noopener">▶ Test</a>` : ""}</td></tr>`).join("")}</tbody></table>`;
    // Ready lessons for the gaps a pupil's checks found and the work they're on now; if none
    // match, lessons at the level they're working at
    const readyFor = x => {
      const L = window.PopLessons;
      if (!L) return [];
      const prog = x.prog || { spelling: x.start.spelling, maths: x.start.maths, focus: "both" };
      const mine = sessions.filter(s => sameName(s.pupil, x.r.name));
      const quest = questSessions(x.r.name, sessions);
      const ids = [quest.spell, quest.numbers, mine.find(s => s.listId === P().CHECKS.spelling.id), mine.find(s => s.listId === P().CHECKS.numbers.id)]
        .filter(Boolean).flatMap(s => P().checkGaps(s.words || []).slice(0, 3));
      if (prog.focus !== "maths") ids.push(prog.spelling);
      if (prog.focus !== "literacy") ids.push(prog.maths);
      const out = [];
      const addLesson = l => { if (!out.some(o => o.id === l.id)) out.push(l); };
      // A spelling list with no lesson of its own matches the lessons for its stage's other lists
      const sameStage = id => (stageOf(id) < 0 ? [] : P().STAGES[stageOf(id)].lists.map(l => l.id));
      ids.forEach(id => { const direct = L.forWork(id); (direct.length ? direct : sameStage(id).flatMap(L.forWork)).forEach(addLesson); });
      if (!out.length) {
        const c = levelCheck(x.r, prog);
        // England: lessons covering the year of the work they're on
        if (c.england) [[prog.focus !== "maths" && "Literacy", prog.spelling], [prog.focus !== "literacy" && "Maths", prog.maths]].forEach(([area, id]) => {
          const w = area && enWork(id);
          if (w && w.lo !== null) L.all().filter(l => l.subject === area && enWork(l.id) && enWork(l.id).lo !== null
            && enWork(l.id).lo <= w.lo && enWork(l.id).hi >= w.lo).slice(0, 2).forEach(addLesson);
        });
        else c.areas.forEach(a => L.forArea(a.area, a.level).slice(0, 2).forEach(addLesson));
      }
      return out.slice(0, 4);
    };
    const readyHTML = x => {
      const list = readyFor(x);
      const prog = x.prog || { spelling: x.start.spelling, maths: x.start.maths, focus: "both" };
      const c = levelCheck(x.r, prog);
      const where = l => (c.england ? (enWork(l.id) || {}).label || "" : `${l.level}`);
      // England: browse the library at the band of the work they're on (Reception, Year 1, Year 2, Years 3–4, Years 5–6)
      const browse = c.england
        ? [[prog.focus !== "maths" && "Literacy", prog.spelling], [prog.focus !== "literacy" && "Maths", prog.maths]].filter(([a]) => a)
          .map(([area, id]) => [area, E_().bandOf(enWork(id))]).filter(([, band]) => band)
          .map(([area, band]) => `<button class="linklike" type="button" data-browse="${esc(area)}|${esc(band)}|england">Every ${esc(band)} ${esc(area.toLowerCase())} lesson</button>`)
        : c.areas.map(a => `<button class="linklike" type="button" data-browse="${esc(a.area)}|${esc(a.level)}">Every ${esc(a.level)} level ${esc(a.area.toLowerCase())} lesson</button>`);
      return `<details class="prog-more prog-ready" open><summary>📚 Ready lessons for ${esc(x.r.name)}</summary>
        ${list.length ? `<ul>${list.map(l => `<li><b>${esc(l.title)}</b> <span class="hint">${esc(where(l))} · ${esc(l.subject)}</span>
          <button class="linklike" type="button" data-open-lesson="${esc(l.id)}">Open</button> ·
          <button class="linklike" type="button" data-print-lesson="${esc(l.id)}">Print</button></li>`).join("")}</ul>` : ""}
        <p>${browse.join(" · ")}</p></details>`;
    };
    const card = (x, i) => {
      const name = x.r.name;
      const date = x.r.nextLessonDate >= today ? x.r.nextLessonDate : "";
      if (!x.prog) return `<details class="lib-group prog-card" data-name="${esc(name)}"${openProgramme === name ? " open" : ""}>
        <summary><span>${esc(name)}</span><span class="hint">No programme yet</span></summary>
        <div class="prog-body">${levelsHTML(x.r, { spelling: x.start.spelling, maths: x.start.maths, focus: "both" })}${readyHTML(x)}<p>Suggested start: <b>${esc(titleOf(x.start.spelling))}</b> (from ${esc(x.start.spellingWhy)}) and <b>${esc(titleOf(x.start.maths))}</b> (from ${esc(x.start.mathsWhy)}). Change either if you know better.</p>
          ${startForm(x, i)}</div></details>`;
      const parts = lessonParts(x.prog, x.prog.lesson, length);
      const intentions = parts.filter(p => p.intention);
      let ahead = x.prog;
      const coming = [1, 2, 3].map(() => { ahead = advanced(ahead, true, true); return `<li>Lesson ${ahead.lesson}: ${esc(lessonTopics(ahead))}</li>`; }).join("");
      const log = (x.prog.log || []).slice(-6).reverse();
      return `<details class="lib-group prog-card" data-name="${esc(name)}"${openProgramme === name ? " open" : ""}>
        <summary><span>${esc(name)} · Lesson ${x.prog.lesson}</span><span class="hint">${esc(lessonTopics(x.prog))}${date ? ` · ${esc(when(date))}` : ""}</span></summary>
        <div class="prog-body">
          ${levelsHTML(x.r, x.prog)}
          ${readyHTML(x)}
          <h3>Lesson ${x.prog.lesson} · ${length} minutes${date ? ` · ${esc(when(date))}${x.r.lessonTime ? ` at ${esc(x.r.lessonTime)}` : ""}` : ""}</h3>
          ${intentions.map(p => `<p class="prog-li"><b>${esc(p.intention)}</b> ${p.criteria.map(c => `<span class="t-chip">${esc(c)}</span>`).join(" ")}</p>`).join("")}
          ${planTable(parts, x)}
          <div class="row prog-actions">
            <label>Lesson date <input type="date" data-date="${i}" value="${esc(date || today)}" min="${today}"></label>
            <button class="btn primary small" type="button" data-schedule="${i}">📌 Put on ${esc(name)}'s device</button>
            <button class="btn small" type="button" data-pack="${i}">🖨️ Print lesson pack</button>
            <button class="btn small" type="button" data-done="${i}">✅ Lesson done</button>
          </div>
          <details class="prog-more"><summary>Coming up, and lessons so far</summary>
            <p><b>Coming up</b> (if ${esc(name)} is ready to move on):</p><ul>${coming}</ul>
            ${log.length ? `<p><b>Lessons so far</b></p><ul>${log.map(l => `<li>Lesson ${l.n} · ${esc(day(l.at))}: ${[
              l.spelling ? `${esc(titleOf(l.spelling))} (${l.spellingNext ? "moved on" : "practise again"})` : "",
              l.maths ? `${esc(titleOf(l.maths))} (${l.mathsNext ? "moved on" : "practise again"})` : ""].filter(Boolean).join(" · ")}</li>`).join("")}</ul>` : ""}
            <p><b>Change the programme</b></p>${startForm(x, i)}
          </details>
        </div></details>`;
    };
    body.innerHTML = `<div class="work-flow">
        <h2>📘 Lesson programme</h2>
        <p class="hint">A lesson-by-lesson programme for each pupil, starting from their Sound Quest, starting checks or practice. Each lesson mixes work with you, on the device and on paper, and names its CfE outcomes, or for a pupil with an England year group, its national curriculum year and statements. At the end of a lesson, press <b>Lesson done</b> and choose whether they move on.</p>
        <label>Lesson length <select id="progLength">${LESSON_LENGTHS.map(n => `<option value="${n}"${n === length ? " selected" : ""}>${n} minutes</option>`).join("")}</select></label>
      </div>
      ${rows.length ? rows.map(card).join("") : `<div class="empty">Add pupils in the <b>Pupils</b> tab first, then give each one a programme here.</div>`}`;
    // A lesson opened for a pupil follows their curriculum
    const curOf = el => { const x = rows.find(y => y.r.name === el.closest(".prog-card").dataset.name); return x && inEngland(x.r) ? "england" : ""; };
    body.querySelectorAll("[data-open-lesson]").forEach(b => { b.onclick = () => lessonDialog(window.PopLessons.get(b.dataset.openLesson), curOf(b)); });
    body.querySelectorAll("[data-print-lesson]").forEach(b => { b.onclick = () => {
      lessonPrintDialog(window.PopLessons.get(b.dataset.printLesson), b.closest(".prog-card").dataset.name, curOf(b));
    }; });
    // Opens the library at every ready lesson for that subject and level (or England band)
    body.querySelectorAll("[data-browse]").forEach(b => { b.onclick = () => {
      const [subject, level, cur = ""] = b.dataset.browse.split("|");
      saveLibraryPrefs({ cur, level, subject, strand: "", type: "lesson" });
      tab = "library";
      draw();
    }; });
    $("#progLength").onchange = e => { saveCalendarPrefs(Object.assign(calendarPrefs(), { length: Number(e.target.value) })); drawProgramme(body); };
    body.querySelectorAll(".prog-card").forEach(d => d.addEventListener("toggle", () => { if (d.open) openProgramme = d.dataset.name; }));
    const save = async (x, programme) => {
      openProgramme = x.r.name;
      try { await cloud.savePupil(current.id, Object.assign({}, x.r, { programme })); drawProgramme(body); } catch (err) { showError(err); }
    };
    body.querySelectorAll("[data-start]").forEach(b => { b.onclick = () => {
      const x = rows[Number(b.dataset.start)];
      const form = b.closest("[data-start-form]");
      const pick = sel => form.querySelector(sel).value;
      save(x, Object.assign({ lesson: 1, started: Date.now(), log: [] }, x.prog || {},
        { spelling: pick("[data-start-spelling]"), maths: pick("[data-start-maths]"), focus: pick("[data-start-focus]") }));
    }; });
    body.querySelectorAll("[data-stop]").forEach(b => { b.onclick = () => {
      const x = rows[Number(b.dataset.stop)];
      if (confirm(`Stop ${x.r.name}'s programme? Their results stay; only the lesson plan is removed.`)) save(x, null);
    }; });
    body.querySelectorAll("[data-schedule]").forEach(b => { b.onclick = async () => {
      const x = rows[Number(b.dataset.schedule)];
      const date = body.querySelector(`[data-date="${b.dataset.schedule}"]`).value;
      if (!date || date < today) return showError(new Error("Choose today or a later date."));
      const parts = lessonParts(x.prog, x.prog.lesson, length);
      const online = [...new Set(parts.filter(p => p.where === "device" && p.id).map(p => p.id))];
      b.disabled = true;
      try {
        await scheduleLesson(x, online, date, x.prog.focus === "maths" ? x.prog.maths : x.prog.spelling);
        openProgramme = x.r.name;
        notice(`Lesson ${x.prog.lesson} is on ${x.r.name}'s device for ${when(date)}: ${online.map(titleOf).join(", ")}.`);
        drawProgramme(body);
      } catch (err) { b.disabled = false; showError(err); }
    }; });
    body.querySelectorAll("[data-pack]").forEach(b => { b.onclick = () => {
      const x = rows[Number(b.dataset.pack)];
      const date = body.querySelector(`[data-date="${b.dataset.pack}"]`).value || today;
      lessonPackDialog(x, lessonParts(x.prog, x.prog.lesson, length), date, length);
    }; });
    body.querySelectorAll("[data-done]").forEach(b => { b.onclick = () => {
      const x = rows[Number(b.dataset.done)];
      lessonDoneDialog(x, sessions, programme => save(x, programme));
    }; });
  }

  // Puts the lesson's online work on the pupil's device for its date, sets homework, and keeps
  // the parent page and calendar up to date (as Next steps does)
  async function scheduleLesson(x, lists, date, homework) {
    const today = todayKey();
    let plans = (x.a ? x.a.plans : []).filter(p => !(lists.includes(p.list) && p.from === date && p.until === date));
    // Old plans make room when a pupil reaches the limit of 30
    while (plans.length + lists.length > 30 && plans.some(p => p.until < today)) plans.splice(plans.findIndex(p => p.until < today), 1);
    if (plans.length + lists.length > 30) throw new Error("This pupil has the maximum of 30 plans. Remove some in Plans & sheets.");
    await cloud.savePlans(current.id, x.a ? x.a.who : x.r.name, plans.concat(lists.map(list => ({ list, from: date, until: date }))));
    const updated = Object.assign({}, x.r, { homeworkList: homework, nextLessonDate: date });
    await cloud.savePupil(current.id, updated);
    if (x.r.parentLink) { const [s, a] = await parentData(); await publishParent(updated, s, a); }
    if (date !== x.r.nextLessonDate) await calendarAfterSave(updated);
  }

  // End of lesson: how the pupil did on PopSpell since the last lesson, and whether each part moves on
  function lessonDoneDialog(x, sessions, done) {
    const prog = x.prog;
    const since = (prog.log || []).length ? prog.log[prog.log.length - 1].at : prog.started;
    const tracks = [prog.focus !== "maths" && { key: "spelling", id: prog.spelling, order: orderFor(prog.spelling) },
      prog.focus !== "literacy" && { key: "maths", id: prog.maths, order: mathsOrder() }].filter(Boolean).map(t => {
      const s = sessions.find(ss => sameName(ss.pupil, x.r.name) && ss.listId === t.id && ss.at >= since);
      const pct = firstPct(s);
      const next = t.order[t.order.indexOf(t.id) + 1];
      return Object.assign(t, { pct, next, moveOn: !!next && (pct === null || pct >= 80),
        result: s ? `${pct}% right first time on PopSpell${s.source === "worksheet" ? " (marked worksheet)" : ""}` : "No PopSpell result since the last lesson" });
    });
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview cal-dialog";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>✅ ${esc(x.r.name)} · Lesson ${prog.lesson} done</h2>
        <button class="btn small" type="button" data-close>Close</button></div>
      ${tracks.map(t => `<fieldset class="prog-track"><legend><b>${esc(titleOf(t.id))}</b></legend>
        <p class="hint">${esc(t.result)}${t.pct !== null && t.pct < 80 ? ". Under 80%, so practising again is suggested." : t.pct !== null ? ". Ready to move on." : ". Choose practise again if it wasn't secure."}</p>
        <label class="check"><input type="radio" name="${t.key}" value="next"${t.moveOn ? " checked" : ""}${t.next ? "" : " disabled"}> ${t.next ? `Move on to ${esc(titleOf(t.next))}` : "This is the last one in the programme"}</label>
        <label class="check"><input type="radio" name="${t.key}" value="again"${t.moveOn ? "" : " checked"}> Practise ${esc(titleOf(t.id))} again</label></fieldset>`).join("")}
      <div class="row end"><button class="btn primary" type="button" data-save>Save and plan lesson ${prog.lesson + 1}</button></div>`;
    document.body.append(dialog);
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.querySelector("[data-save]").onclick = () => {
      const go = key => { const el = dialog.querySelector(`input[name="${key}"]:checked`); return !!el && el.value === "next"; };
      const spellingNext = go("spelling"), mathsNext = go("maths");
      const log = (prog.log || []).concat({ n: prog.lesson, at: Date.now(), spelling: prog.focus !== "maths" ? prog.spelling : "",
        maths: prog.focus !== "literacy" ? prog.maths : "", spellingNext, mathsNext }).slice(-30);
      dialog.close();
      done(Object.assign(advanced(prog, spellingNext, mathsNext), { log }));
    };
    dialog.showModal();
  }

  // The lesson plan for the teacher, then every sheet the lesson uses, ready to print together
  function lessonPlanHTML(x, parts, date, length) {
    const prog = x.prog;
    const when = new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    const intentions = parts.filter(p => p.intention);
    const codes = [...new Set(parts.flatMap(p => p.codes || []))];
    const levels = levelCheck(x.r, prog);
    // England: each part's year, domain and the official statement it practises
    const ncParts = levels.england ? parts.filter(p => p.codes && enWork(p.id) && enWork(p.id).statements.length)
      .map(p => { const w = enWork(p.id); return `${w.label} · ${w.domain}: ${w.statements[0].wording}`; }) : [];
    return `${brandHead(`${x.r.name} · Lesson ${prog.lesson}`, `<b>${esc(when)}</b>${x.r.lessonTime ? ` at ${esc(x.r.lessonTime)}` : ""} · ${length} minutes${current ? ` · ${esc(current.name)}` : ""}`)}
      ${!levels.expected ? "" : levels.england
        ? `<p><b>Expected for ${esc(levels.year)}:</b> ${esc(levels.expected.text)}. ${levels.areas.map(a => `<b>${a.area}:</b> ${esc(a.level)} work (${yearStatus(levels.year, a.status).toLowerCase()}).`).join(" ")}</p>`
        : `<p><b>Expected for ${esc(levels.year)}:</b> ${levels.expected[0]} level. ${levels.areas.map(a => `<b>${a.area}:</b> working at ${a.level} level (${LEVEL_STATUS[a.status].toLowerCase()}).`).join(" ")}</p>`}
      ${intentions.map(p => `<p><b>Learning intention:</b> ${esc(p.intention)}<br><b>Success criteria:</b> ${p.criteria.map(esc).join(" ")}</p>`).join("")}
      ${levels.england ? (ncParts.length ? `<p><b>${ncParts.some(t => t.startsWith("Reception")) ? "EYFS and national curriculum (England)" : "National curriculum (England)"}:</b></p><ul>${[...new Set(ncParts)].map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : "")
        : codes.length ? `<p><b>CfE experiences and outcomes:</b> ${esc(codes.join(", "))}</p>` : ""}
      <table><thead><tr><th>Part</th><th>Time</th><th>Where</th><th>What to do</th><th>✓</th></tr></thead><tbody>
        ${parts.map(p => `<tr><td><b>${esc(p.title)}</b></td><td>${p.minutes} min</td><td>${WHERE[p.where].replace(/^\S+ /, "")}</td><td>${esc(p.how)}</td><td class="check-box">□</td></tr>`).join("")}</tbody></table>
      <p><b>Notes</b> (what went well, sounds or facts to revisit):</p><div class="ws-comment"></div>`;
  }
  function lessonPackDialog(x, parts, date, length) {
    const A = A_();
    const sheets = parts.filter(p => p.sheet).map(p => {
      const act = p.sheet.kind === "activity" ? A.get(p.sheet.id) : null;
      const label = { sounds: "Sound map", read: "Story", maths: "Maths sheet", dictation: "Dictation" }[p.key];
      return { title: `${label}: ${p.title.replace(/^[^:]+: /, "")}`, kind: p.sheet.kind, id: p.sheet.id, act, qs: act ? act.make() : null };
    });
    const sheetLevel = s => (inEngland(x.r) ? (enWork(s.id) || {}).label || "" : s.id.startsWith("dictate:") ? levelOfStage(stageOf(s.id.slice(8))) : s.act.level);
    const made = {};
    const pagesOf = (s, i) => (made[i] = made[i] || activityPages(s.act, s.qs, sheetLevel(s), x.r.name));
    const sheetHTML = (s, i) => (s.kind === "mapping" ? worksheetSpec(x.r.name, { list: s.id, from: date }, "mapping").html : pagesOf(s, i).pupil);
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>Lesson ${x.prog.lesson} pack</h2>
      <label class="check"><input type="checkbox" data-sheet="plan" checked> Lesson plan (for you)</label>
      ${sheets.map((s, i) => `<label class="check"><input type="checkbox" data-sheet="${i}" checked> ${esc(s.title)}</label>`).join("")}
      ${sheets.map((s, i) => (s.act ? `<label class="check"><input type="checkbox" data-sheet="a${i}"${heardOnly(s.act) ? " checked" : ""}> ${heardOnly(s.act) ? "To read aloud" : "Answers"} (for you): ${esc(s.title.replace(/^[^:]+: /, ""))}</label>`
        : `<label class="check"><input type="checkbox" data-sheet="a${i}" checked> Words to say (for you): ${esc(s.title.replace(/^[^:]+: /, ""))}</label>`)).join("")}
      <button class="btn small" type="button" data-close>Close</button>
      <button class="btn small primary" type="button" data-print>Print / Save PDF</button></div>
      <section class="sheet-preview-page ws-activity"></section>`;
    document.body.append(dialog);
    const chosen = key => dialog.querySelector(`[data-sheet="${key}"]`).checked;
    const html = () => [chosen("plan") ? lessonPlanHTML(x, parts, date, length) : ""].concat(sheets.map((s, i) => (chosen(i) ? sheetHTML(s, i) : "")),
      sheets.map((s, i) => (!chosen(`a${i}`) ? "" : s.act ? pagesOf(s, i).answers : worksheetSpec(x.r.name, { list: s.id, from: date }, "key").html)))
      .filter(Boolean).map(h => `<div class="ws-page">${h}</div>`).join("");
    const render = () => { const page = dialog.querySelector(".sheet-preview-page"); page.innerHTML = html(); fitPages(page, "ws-activity"); };
    dialog.querySelectorAll("[data-sheet]").forEach(el => { el.onchange = render; });
    render();
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.querySelector("[data-print]").onclick = () => { const sheet = html(); dialog.close(); if (sheet) printSheet("ws-activity", sheet); };
    dialog.showModal();
  }

  /* ---------- Private lesson diary ---------- */

  async function drawDiary(body) {
    body.innerHTML = `<div class="empty">Loading…</div>`;
    let entries, sessions, assignments;
    try { [entries, sessions, assignments] = await Promise.all([
      cloud.diary(current.id), cloud.sessions(current.id, 365), cloud.assignments(current.id)
    ]); } catch (err) { return showError(err); }
    if (tab !== "diary") return;
    const names = [...new Set(sessions.map(s => s.pupil).concat(assignments.map(a => a.who))
      .concat(entries.map(e => e.pupil)).filter(n => n && n.toLowerCase() !== "everyone"))]
      .sort((a, b) => a.localeCompare(b));
    const summaries = summarise(sessions);
    body.innerHTML = `<p class="hint">Keep a private record of what each pupil did and what to cover next. Choose a next list and date to put it on their online schedule automatically. These notes are visible to teachers and site admins only.</p>
      <form class="t-diary-form" id="diaryForm">
        <div class="add-row"><label>Pupil <input type="text" id="diaryPupil" list="diaryNames" maxlength="40" required></label>
          <datalist id="diaryNames">${names.map(n => `<option value="${esc(n)}">`).join("")}</datalist>
          <label>Lesson date <input type="date" id="diaryDate" value="${todayKey()}" required></label></div>
        <div class="empty" id="diaryProgress">Choose a pupil to see their recorded progress.</div>
        <label>Last work and progress <textarea id="diaryLast" rows="4" maxlength="2000" placeholder="What did the pupil practise? What went well or needs more work?"></textarea></label>
        <button class="btn small" type="button" id="useProgress">Use latest result as a starting note</button>
        <label>Next lesson <textarea id="diaryNext" rows="4" maxlength="2000" placeholder="What should happen next lesson?"></textarea></label>
        <div class="add-row"><label>Next spelling list (optional) <select id="diaryNextList">${catalogueOptions()}</select></label>
          <label>On this date <input type="date" id="diaryNextDate"></label></div>
        <div class="row end"><button class="btn primary" type="submit">Save diary entry</button></div>
      </form>
      <h2 class="t-h2">Recent diary entries</h2>
      ${entries.length ? `<div class="pupil-grid">${entries.map(e => `<article class="pcard diary-entry" data-pupil="${esc(e.pupil.toLowerCase())}">
        <h3>${esc(e.pupil)} · ${esc(e.lessonDate)}</h3>
        <p><b>Last work:</b> ${esc(e.lastWork || "—")}</p><p><b>Next lesson:</b> ${esc(e.nextLesson || "—")}</p>
        ${e.nextList ? `<p class="meta">Scheduled: ${esc(listTitle(e.nextList))} · ${esc(e.nextDate)}</p>` : ""}
        <p class="meta">Recorded by ${esc(e.by)}</p></article>`).join("")}</div>` : `<div class="empty">No diary entries yet.</div>`}`;
    const progress = () => {
      const name = $("#diaryPupil").value.trim().toLowerCase();
      const p = summaries.find(x => x.pupil.toLowerCase() === name);
      const latest = sessions.find(s => String(s.pupil || "").trim().toLowerCase() === name);
      $("#diaryProgress").innerHTML = p ? `<b>Recorded progress:</b> ${p.lists} lists, ${p.right}/${p.words} words right,
        ${p.firstGo} first time. ${p.topSounds.length ? `Sounds to revisit: ${p.topSounds.map(([s]) => esc(s)).join(", ")}.` : ""}
        ${latest ? `Latest: ${esc(latest.list)} on ${day(latest.at)} (${latest.source === "worksheet" ? "worksheet" : "online"}).` : ""}`
        : "No recorded work yet for this pupil.";
      return latest;
    };
    $("#diaryPupil").oninput = progress;
    $("#useProgress").onclick = () => {
      const latest = progress();
      if (!latest) return;
      const words = latest.words || [];
      const first = words.filter(w => w.correct && w.triesUsed === 1).length;
      const right = words.filter(w => w.correct).length;
      const missed = [...new Set(words.flatMap(w => w.missed || []))];
      $("#diaryLast").value = `${latest.list} (${latest.source === "worksheet" ? "worksheet" : "online"}): ${right}/${words.length} correct, ${first} first time.`
        + (missed.length ? ` Sounds to revisit: ${missed.join(", ")}.` : "");
    };
    $("#diaryForm").onsubmit = async e => {
      e.preventDefault();
      const entry = { pupil: $("#diaryPupil").value.trim(), lessonDate: $("#diaryDate").value,
        lastWork: $("#diaryLast").value.trim(), nextLesson: $("#diaryNext").value.trim(),
        nextList: $("#diaryNextList").value, nextDate: $("#diaryNextDate").value };
      if (!entry.lastWork && !entry.nextLesson) return showError(new Error("Write at least one lesson note."));
      if (entry.nextList && !entry.nextDate) return $("#diaryNextDate").focus();
      if (entry.nextDate && !entry.nextList) return $("#diaryNextList").focus();
      try { await cloud.saveDiary(current.id, entry); drawDiary(body); } catch (err) { showError(err); }
    };
  }

  /* ---------- Pupils' results ---------- */

  function summarise(sessions) {
    const pupils = {};
    sessions.forEach(s => {
      const key = String(s.pupil || "").trim().toLowerCase();
      const p = pupils[key] = pupils[key] || { pupil: String(s.pupil || "").trim(), lists: 0,
        worksheets: 0, words: 0, right: 0, firstGo: 0, last: 0, recent: [], sounds: {}, lastSwitch: null, lastCanopy: null };
      const words = s.words || [];
      p.lists++;
      if (s.source === "worksheet") p.worksheets++;
      p.words += words.length;
      p.right += words.filter(w => w.correct).length;
      const first = words.filter(w => w.correct && w.triesUsed === 1).length;
      p.firstGo += first;
      p.last = Math.max(p.last, s.at);
      if (p.recent.length < 4) p.recent.push({ at: s.at, list: s.list,
        source: s.source === "worksheet" ? "Worksheet" : "Online", score: `${first}/${words.length}` });
      if (String(s.listId || "").startsWith("g-switch-") && (!p.lastSwitch || s.at > p.lastSwitch.at))
        p.lastSwitch = { at: s.at, list: s.list, words };
      if (String(s.listId || "").startsWith("g-canopy-") && (!p.lastCanopy || s.at > p.lastCanopy.at))
        p.lastCanopy = { at: s.at, list: s.list, words };
      words.forEach(w => (w.missed || []).forEach(m => { p.sounds[m] = (p.sounds[m] || 0) + 1; }));
    });
    return Object.values(pupils).map(p => Object.assign(p, {
      topSounds: Object.entries(p.sounds).sort((a, b) => b[1] - a[1]).slice(0, 6)
    })).sort((a, b) => a.pupil.localeCompare(b.pupil));
  }

  function downloadCSV(sessions) {
    const cell = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const lines = [["Date", "Time", "Pupil", "List", "Source", "Word", "Sounds", "Result", "Wrong tries", "Skills missed", "Seconds", "Number groups"].map(cell).join(",")];
    sessions.slice().reverse().forEach(s => (s.words || []).forEach(w => {
      const d = new Date(s.at);
      const result = (w.challenge ? "New word: " : "") + (w.correct ? (w.triesUsed === 1 ? "Right first time" : `Right on try ${w.triesUsed}`) : "Missed");
      lines.push([d.toLocaleDateString("en-GB"), d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), s.pupil, s.list,
        s.source === "worksheet" ? "Worksheet" : "Online", w.word, w.sounds, result,
        (w.wrong || []).join(" "), (w.missed || []).join(" "), w.seconds ?? "", (w.methods || []).join("; ")].map(cell).join(","));
    }));
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `popspell-${current.name.replace(/[^\w]+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  /* ---------- Curriculum for Excellence: progress by organiser ---------- */

  // Secure: 85%+ right first time on 10+ questions over 2+ days. Developing: 60%+. Below that: needs support.
  function cfeStatus(row) {
    if (row.items < 5) return { key: "none", text: "Not enough yet" };
    const pct = row.first / row.items;
    if (pct >= 0.85 && row.items >= 10 && row.days.size >= 2) return { key: "secure", text: "Secure" };
    if (pct >= 0.6) return { key: "developing", text: "Developing" };
    return { key: "support", text: "Needs support" };
  }

  // England pupils' rows are national curriculum strands with the years of the work done in them
  const enStrandOf = id => { const w = enWork(id); return w && w.strand ? w.strand : "Other work"; };
  function cfeRows(sessions, pupilName, en = false) {
    const A = window.PopActivities;
    const rows = {};
    // Starting checks deliberately go past what a pupil can do, so they'd drag the status down
    sessions.filter(s => !P().isAssessment(s.listId))
      .filter(s => !pupilName || String(s.pupil || "").trim().toLowerCase() === pupilName.toLowerCase()).forEach(s => {
      const tag = (A && A.tag(s.listId)) || { organiser: "Other work", level: "" };
      const key = en ? enStrandOf(s.listId) : tag.organiser;
      const r = rows[key] = rows[key] || { organiser: key, levels: new Set(), years: new Set(), work: new Set(), items: 0, first: 0, days: new Set(), skills: {} };
      if (tag.level) r.levels.add(tag.level);
      const w = en ? enWork(s.listId) : null;
      if (w && w.lo !== null) r.years.add(w.lo);
      r.work.add(s.list);
      r.days.add(new Date(s.at).toDateString());
      (s.words || []).forEach(w => {
        r.items++;
        if (w.correct && w.triesUsed === 1) r.first++;
        (w.missed || []).forEach(m => { r.skills[m] = (r.skills[m] || 0) + 1; });
      });
    });
    const levelOrder = ["Early", "First", "Second"];
    return Object.values(rows).map(r => Object.assign(r, {
      status: cfeStatus(r), pct: r.items ? Math.round((r.first / r.items) * 100) : 0,
      levelText: en ? (r.years.size ? E_().rangeLabel(Math.min(...r.years), Math.max(...r.years)) : "")
        : levelOrder.filter(l => r.levels.has(l)).join(", "),
      topSkills: Object.entries(r.skills).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s]) => s)
    })).sort((a, b) => (en ? E_().STRAND_ORDER.indexOf(a.organiser) - E_().STRAND_ORDER.indexOf(b.organiser) : 0) || a.organiser.localeCompare(b.organiser));
  }

  function printReport(pupilName, sessions, en = false) {
    const rows = cfeRows(sessions, pupilName, en);
    const period = (PERIODS.find(([d]) => d === days) || [0, ""])[1];
    printSheet("ws-report", `${brandHead("Progress report")}
      <p><b>Pupil:</b> ${esc(pupilName)} &nbsp; <b>Class:</b> ${esc(current.name)} &nbsp; <b>Period:</b> ${esc(period)} &nbsp; <b>Printed:</b> ${esc(new Date().toLocaleDateString("en-GB"))}</p>
      <p>Grouped by ${en ? "national curriculum (England) strand, with the years the work comes from" : "Curriculum for Excellence organiser"}. “Right first time” counts questions answered correctly without help.
        Secure means 85% or more right first time, on at least 10 questions over two or more days.</p>
      <table><thead><tr><th>${en ? "Strand" : "Organiser"}</th><th>${en ? "Year" : "Level"}</th><th>Work done</th><th>Questions</th><th>Right first time</th><th>Status</th><th>To work on</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td>${esc(r.organiser)}</td><td>${esc(r.levelText)}</td><td>${esc([...r.work].slice(0, 6).join(", "))}${r.work.size > 6 ? "…" : ""}</td>
        <td>${r.items}</td><td>${r.pct}%</td><td><b>${esc(r.status.text)}</b></td><td>${esc(r.topSkills.join(", ") || "—")}</td></tr>`).join("")
        || `<tr><td colspan="7">No work recorded in this period.</td></tr>`}</tbody></table>
      <p><b>Teacher's comment:</b></p><p class="ws-comment"></p>`);
  }

  /* ---------- New pupil: profile, Pip's Sound Quest, and the starting assessment report ---------- */

  // A pupil's year group also says which curriculum they follow: P1 to S6 are Scotland's,
  // Reception and Year 1 to Year 11 are England's
  const YEAR_GROUPS = ["Nursery", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "S1", "S2", "S3", "S4", "S5", "S6"];
  const ENGLAND_YEARS = () => (E_() ? E_().YEARS.map(y => y[0]) : []);
  const yearOptions = chosen => `<optgroup label="Scotland (Curriculum for Excellence)">${YEAR_GROUPS.map(y => `<option${chosen === y ? " selected" : ""}>${y}</option>`).join("")}</optgroup>
    ${ENGLAND_YEARS().length ? `<optgroup label="England (national curriculum)">${ENGLAND_YEARS().map(y => `<option${chosen === y ? " selected" : ""}>${y}</option>`).join("")}</optgroup>` : ""}`;
  const NEED_CHIPS = ["Dyslexia (or suspected)", "English as an additional language", "ADHD", "Speech and language", "Hearing", "Sight", "Anxious about learning", "Needs short tasks"];
  // The quest's link: joins the class, signs the device in as the child, and opens the quest
  const assessLink = name => `${homeLink(name)}&then=assess`;
  const stageOf = listId => P().STAGES.findIndex(st => st.lists.some(l => l.id === listId));
  const levelOfStage = i => (i <= 1 ? "Early" : i <= 4 ? "First" : "Second"); // as the lists' CfE labels

  // The latest go at each island, from the results the teacher already has
  function questSessions(name, sessions) {
    const mine = sessions.filter(s => sameName(s.pupil, name)).sort((a, b) => b.at - a.at);
    return Object.fromEntries(P().QUEST.map(isl => [isl.key, mine.find(s => s.listId === isl.id) || null]));
  }

  // What each island shows: a CfE level (where it can say), a plain-English finding, and a next step
  function questFindings(found, en = false) {
    const A = window.PopActivities;
    const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
    const status = p => (p >= 80 ? "Secure" : p >= 50 ? "Developing" : "Needs support");
    const out = {};
    if (found.listen) {
      const words = found.listen.words || [];
      const by = {};
      words.forEach(w => { const k = w.from || "other"; by[k] = by[k] || [0, 0]; by[k][1]++; if (w.correct) by[k][0]++; });
      const name = { "l-rhyme": "Rhyme", "l-first-sound": "First sounds", "l-count-sounds": "Counting sounds" };
      const right = words.filter(w => w.correct).length;
      out.listen = { area: "Listening for sounds (phonological awareness)", level: "Early", id: "l-count-sounds", status: status(pct(right, words.length)),
        detail: Object.entries(by).map(([k, [r, n]]) => `${name[k] || k} ${r} of ${n}`).join(" · "),
        next: pct(right, words.length) >= 80 ? "Secure: no extra sound games needed." : "Short daily sound games: rhyme, first sounds and tapping out sounds." };
    }
    // Reading and spelling are placed on the phonics stages: secure up to the stage before the first gap
    const phonics = (s, area, verb) => {
      if (!s) return null;
      const gaps = P().checkGaps(s.words || []);
      if (!gaps.length) return { area, level: "Second", top: "kn-wr", status: "Secure", gap: null,
        detail: `${verb} every stage tested, through Stage 6 (endings and tricky words).`,
        next: en ? "Move on to the Years 3–4 spelling rules and word list, and longer texts." : "Move on to Second-level spelling rules and longer texts." };
      const g = stageOf(gaps[0]);
      const st = P().STAGES[g];
      return { area, level: levelOfStage(g), id: gaps[0], status: g === 0 ? "Needs support" : "Developing", gap: gaps[0],
        detail: `${g ? `Secure up to ${P().STAGES[g - 1].stage}. ` : ""}Starts to find it tricky at ${st.stage}: ${gaps.map(titleOf).slice(0, 3).join(", ")}.`,
        next: `Start ${verb === "Read" ? "reading" : "spelling"} practice at ${titleOf(gaps[0])}.` };
    };
    out.read = phonics(found.read, "Reading: sounding out words (decoding)", "Read");
    out.spell = phonics(found.spell, "Spelling", "Spelt");
    if (found.story) {
      const words = found.story.words || [];
      const id = String((words.find(w => w.from) || {}).from || "").replace(/^story:/, "");
      const story = (window.STORIES || []).find(s => s.id === id) || (window.PASSAGES || []).find(p => p.id === id);
      const level = story ? story.level || levelOfStage((story.stage || 1) - 1) : "";
      const right = words.filter(w => w.correct).length;
      const storyAct = story ? `${(window.STORIES || []).includes(story) ? "s" : "r"}-${story.id}` : "";
      out.story = { area: "Reading: understanding a story", level, id: storyAct, status: status(pct(right, words.length)),
        detail: `${story ? `"${story.title}"` : "A story"} read alone: ${right} of ${words.length} questions right.`,
        next: pct(right, words.length) >= 80 ? "Understanding is secure at this level: build up to longer texts." : "Talk about stories together: who, where, what happened, and why." };
    }
    if (found.numbers) {
      const gaps = P().checkGaps(found.numbers.words || []);
      const act = gaps.length && A ? A.get(gaps[0]) : null;
      out.numbers = { area: en ? "Maths: number and calculation" : "Numeracy: number and number processes", level: act ? act.level : "Second", id: act ? act.id : "", top: act ? "" : "n-percent", status: act ? (act.level === "Early" ? "Needs support" : "Developing") : "Secure",
        detail: act ? `Starts to find it tricky at ${act.title} (${en ? ncLine(act.id) || act.level : `${act.level} level`})${gaps.length > 1 ? `; also ${gaps.slice(1, 3).map(id => (A.get(id) || {}).title || id).join(", ")}` : ""}.` : `Answered every number question tested, through ${en ? "Year 5 and 6 work" : "Second level"}.`,
        next: act ? `Start number practice at ${act.title}.` : en ? "Move on to Year 5 and 6 measurement, fractions and statistics." : "Move on to Second-level measurement, fractions and data." };
    }
    return out;
  }

  function assessmentReport(pupil, sessions) {
    const found = questSessions(pupil.name, sessions);
    const f = questFindings(found, inEngland(pupil));
    const rows = ["listen", "read", "story", "spell", "numbers"].filter(k => f[k]);
    const dates = Object.values(found).filter(Boolean).map(s => s.at);
    const lower = (...ls) => ls.filter(Boolean).sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b))[0];
    const literacy = lower(f.read && f.read.level, f.spell && f.spell.level);
    const badge = s => `<span class="ar-status ar-${s.toLowerCase().replace(/\s+/g, "-")}">${esc(s)}</span>`;
    const strengths = rows.filter(k => f[k].status === "Secure").map(k => f[k].area);
    // England: national curriculum years instead of CfE levels
    const en = inEngland(pupil);
    const enLabel = x => { const w = enWork(x.id || x.top); return !w || w.lo === null ? "—" : x.top && !x.id ? `Secure through ${w.label}` : w.label; };
    const enLow = (...xs) => xs.filter(x => x && enWork(x.id || x.top)).map(x => enWork(x.id || x.top)).sort((a, b) => a.lo - b.lo)[0];
    const exp = en ? E_().expected(pupil.yearGroup) : null;
    const lit = en ? enLow(f.read, f.spell) : null, num = en && f.numbers ? enWork(f.numbers.id || f.numbers.top) : null;
    return `<div class="ar">
      <div class="ar-head"><img src="assets/brand/wordmark.png" alt="PopSpell" width="96">
        <div><h1>Starting assessment</h1><p class="ar-sub">Pip's Sound Quest · ${esc(current.name)}</p></div>
        <img src="assets/brand/pip-mascot.png" alt="" width="70"></div>
      <table class="ar-facts"><tr><th>Pupil</th><td>${esc(pupil.name)}</td><th>Year group</th><td>${esc(pupil.yearGroup || "—")}</td></tr>
        <tr><th>Assessed</th><td>${dates.length ? esc([...new Set(dates.sort().map(day))].join(", ")) : "—"}</td><th>Teacher</th><td>${esc(current.teacherName || me.name || "")}</td></tr></table>
      ${en ? (lit || num ? `<div class="ar-summary">
        ${lit ? `<div><span>Literacy</span><b>Working on ${esc(lit.label)} work</b>${exp ? `<small>${esc(yearStatus(pupil.yearGroup, E_().status(pupil.yearGroup, lit)))}</small>` : ""}</div>` : ""}
        ${num ? `<div><span>Maths</span><b>Working on ${esc(num.label)} work</b>${exp ? `<small>${esc(yearStatus(pupil.yearGroup, E_().status(pupil.yearGroup, num)))}</small>` : ""}</div>` : ""}
      </div>${exp ? `<p class="hint">Expected for ${esc(pupil.yearGroup)}: ${esc(exp.text)}.</p>` : ""}` : "")
      : literacy || f.numbers ? `<div class="ar-summary">
        ${literacy ? `<div><span>Literacy</span><b>Working within ${esc(literacy)} level</b></div>` : ""}
        ${f.numbers ? `<div><span>Numeracy</span><b>Working within ${esc(f.numbers.level)} level</b></div>` : ""}
      </div>` : ""}
      <h2>What we found</h2>
      ${rows.length ? `<table class="ar-table"><thead><tr><th>Area</th><th>${en ? "Curriculum year" : "CfE level"}</th><th>Status</th><th>What we found</th><th>Next step</th></tr></thead><tbody>
        ${rows.map(k => `<tr><td><b>${esc(f[k].area)}</b></td><td>${esc(en ? enLabel(f[k]) : f[k].level || "—")}</td><td>${badge(f[k].status)}</td><td>${esc(f[k].detail)}</td><td>${esc(f[k].next)}</td></tr>`).join("")}
      </tbody></table>` : `<p>No islands finished yet.</p>`}
      ${strengths.length ? `<h2>Strengths</h2><ul>${strengths.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
      <h2>Recommended starting points</h2><ul>
        ${f.read && f.read.gap ? `<li>Reading practice: <b>${esc(titleOf(f.read.gap))}</b></li>` : ""}
        ${f.spell && f.spell.gap ? `<li>Spelling list: <b>${esc(titleOf(f.spell.gap))}</b></li>` : ""}
        ${f.numbers && f.numbers.status !== "Secure" ? `<li>${esc(f.numbers.next)}</li>` : ""}
        ${f.listen && f.listen.status !== "Secure" ? `<li>${esc(f.listen.next)}</li>` : ""}
        <li>These are planned with one click in PopSpell's Next steps.</li></ul>
      ${pupil.needs || pupil.likes ? `<h2>About ${esc(pupil.name)}</h2>
        ${pupil.needs ? `<p><b>Things to bear in mind:</b> ${esc(pupil.needs)}</p>` : ""}
        ${pupil.likes ? `<p><b>Enjoys:</b> ${esc(pupil.likes)}</p>` : ""}` : ""}
      <h2>Teacher's comments</h2><div class="ws-comment"></div>
      <p class="ar-note"><b>About this assessment.</b> Pip's Sound Quest is a short, adaptive check played as a game. Each part stops as soon as the work becomes too hard, so the child is never left struggling, and it shows a starting point rather than everything they can do. ${en
      ? "Curriculum years are indicative: they show which year of England's national curriculum (or, for Reception, the Early Learning Goals) the work comes from, and should be confirmed by the teacher's own judgement against the programmes of study."
      : "CfE levels are indicative: they should be confirmed by the teacher's own judgement against the Curriculum for Excellence benchmarks."}</p>
    </div>`;
  }

  function previewReport(pupil, sessions) {
    const html = assessmentReport(pupil, sessions);
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>Assessment report</h2>
        <button class="btn small" type="button" data-close>Close</button>
        <button class="btn small primary" type="button" data-print>🖨️ Print / Save PDF</button></div>
      <section class="sheet-preview-page ws-report">${html}</section>`;
    document.body.append(dialog);
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.querySelector("[data-print]").onclick = () => { dialog.close(); printSheet("ws-report", html); };
    dialog.showModal();
  }

  /* ---------- Phonics check practice, marked live (England's Year 1 phonics screening check) ---------- */

  // Like the real check: 40 words in two sections, a mix of real words and pseudo-words (shown with
  // an alien), read aloud by the child and marked by the teacher. Section 2 has harder graphemes and
  // more letters. Real words come from PopSpell's phonics stages; the pseudo-words follow the same
  // patterns but aren't English words.
  const PSEUDO_1 = ["vot", "jat", "fep", "zid", "yop", "keb", "shum", "thig", "chab", "quen", "zell", "vock", "gax", "thep", "shob",
    "nump", "jeck", "lom", "wib", "chiv", "zang"];
  const PSEUDO_2 = ["zort", "thurk", "prowt", "fleak", "skoid", "glurn", "trime", "zoam", "strom", "blurd", "thrail", "splog", "dright",
    "glaim", "snoath", "frelp", "jeest", "scrund", "whid", "koil", "vurt", "plew", "quaib", "sporl", "jound", "chaib"];
  function phonicsCheckWords() {
    const realFrom = stages => shuffle([...new Set(stages.flatMap(i => (P().STAGES[i] || { lists: [] }).lists)
      .flatMap(l => (catalogueList(l.id) || { items: [] }).items).filter(it => !it.whole && /^[a-z]{3,6}$/.test(it.spelling))
      .map(it => it.spelling))]);
    const section = (n, real, pseudo) => shuffle(real.slice(0, 10).map(word => ({ word, alien: false }))
      .concat(shuffle(pseudo).slice(0, 10).map(word => ({ word, alien: true })))).map(w => Object.assign(w, { section: n }));
    return section(1, realFrom([0, 1]), PSEUDO_1).concat(section(2, realFrom([2, 3, 4]), PSEUDO_2));
  }
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function phonicsCheckDialog(r) {
    const words = phonicsCheckWords();
    const marks = [];   // { correct, missed: [graphemes] } per word
    let i = -1, onMyScreen = false, saved = false;
    const link = `${homeLink(r.name)}&then=phonics`;
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview cal-dialog phonics-dialog";
    document.body.append(dialog);
    const push = () => cloud.setDrive(current.id, r.name, i >= 0 && i < words.length
      ? { word: words[i].word, n: i + 1, total: words.length, alien: words[i].alien, section: words[i].section } : null)
      .catch(err => showError(err));
    const close = () => { if (i >= 0 && !saved) cloud.setDrive(current.id, r.name, null).catch(() => {}); dialog.close(); };
    const head = title => `<div class="worksheet-preview-actions"><h2>🔤 ${esc(title)}</h2><button class="btn small" type="button" data-close>Close</button></div>`;

    const intro = () => {
      dialog.innerHTML = `${head(`Phonics check practice: ${r.name}`)}
        <p>Practice for England's Year 1 <b>phonics screening check</b>: 40 words in two sections, a mix of real words and pseudo-words (made-up words, shown with an alien). ${esc(r.name)} reads each word aloud and you mark it. Section 2 is harder.</p>
        <ol class="help-steps">
          <li>On ${esc(r.name)}'s device, open this link. It shows each word as you move through: <span class="t-link-row"><input class="t-link" readonly value="${esc(link)}"> <button class="btn small" type="button" data-copy>Copy</button></span></li>
          <li>Or, if they're not on a device, share your screen and press <b>Show on my screen</b> during the check.</li>
          <li>Mark each word: <b>✓ Right</b> (key 1) or <b>✗ Not right</b> (key 2). If you like, tap the sound they got wrong first, so it shows in their results.</li>
        </ol>
        <p class="hint">Mark a word right if it's read correctly, sounded out and blended or not. A pseudo-word is right for any reading that fits its letters' sounds.</p>
        <div class="row end"><button class="btn primary" type="button" data-start>▶ Start the check</button></div>`;
      dialog.querySelector("[data-copy]").onclick = async e => { try { await navigator.clipboard.writeText(link); e.target.textContent = "✓ Copied"; } catch { dialog.querySelector(".t-link").select(); } };
      dialog.querySelector("[data-start]").onclick = () => { i = 0; push(); word(); };
      dialog.querySelector("[data-close]").onclick = close;
    };

    const word = () => {
      const w = words[i];
      const item = P().analyse(w.word);
      const missed = new Set((marks[i] && marks[i].missed) || []);
      dialog.innerHTML = `${head(`Phonics check: ${r.name}`)}
        <p class="meta">Word ${i + 1} of ${words.length} · Section ${w.section} · ${w.alien ? "👽 Pseudo-word" : "Real word"}</p>
        <div class="phonics-mark"><div class="phonics-word">${P().wordHTML(item, new Set([...missed].map(g => item.tokens.indexOf(g))))}</div>
          <p class="hint">Tap a sound they got wrong (optional).</p></div>
        <div class="row center"><button class="btn primary big" type="button" data-mark="1">✓ Right <small>(1)</small></button>
          <button class="btn big" type="button" data-mark="0">✗ Not right <small>(2)</small></button></div>
        <div class="row"><button class="btn small" type="button" data-back${i ? "" : " disabled"}>← Back</button>
          <button class="btn small" type="button" data-screen>${onMyScreen ? "Hide from my screen" : "🖥️ Show on my screen"}</button>
          <span class="meta">${marks.filter(m => m && m.correct).length} right so far</span></div>
        ${onMyScreen ? `<div class="phonics-share">${w.alien ? `<div class="phonics-alien">👽</div>` : ""}<div class="phonics-word">${esc(w.word)}</div>
          <button class="btn small" type="button" data-screen>Hide</button></div>` : ""}`;
      dialog.querySelector("[data-close]").onclick = close;
      dialog.querySelectorAll(".phonics-mark .g").forEach(el => { el.onclick = () => {
        const g = item.tokens[Number(el.dataset.g)];
        if (missed.has(g)) missed.delete(g); else missed.add(g);
        marks[i] = Object.assign({ correct: false }, marks[i], { missed: [...missed] });
        el.classList.toggle("missed");
      }; });
      const mark = correct => {
        marks[i] = { correct, missed: correct ? [] : [...missed] };
        i++;
        if (i >= words.length) return finish();
        push(); word();
      };
      dialog.querySelectorAll("[data-mark]").forEach(b => { b.onclick = () => mark(b.dataset.mark === "1"); });
      dialog.querySelector("[data-back]").onclick = () => { if (i) { i--; push(); word(); } };
      dialog.querySelectorAll("[data-screen]").forEach(b => { b.onclick = () => { onMyScreen = !onMyScreen; word(); }; });
    };
    dialog.addEventListener("keydown", e => {
      if (i < 0 || i >= words.length || e.target.closest("input")) return;
      if (e.key === "1") dialog.querySelector('[data-mark="1"]').click();
      if (e.key === "2") dialog.querySelector('[data-mark="0"]').click();
    });

    const finish = async () => {
      push(); // clears the child's screen
      const results = words.map((w, k) => {
        const item = P().analyse(w.word);
        return { word: w.word, correct: !!marks[k].correct, triesUsed: 1, sounds: item.tokens.join(" · "), missed: marks[k].missed || [],
          wrong: marks[k].correct ? [] : ["read wrongly"], from: w.alien ? "pseudo" : "real", section: w.section };
      });
      const right = results.filter(x => x.correct);
      const of = f => `${results.filter(x => f(x) && x.correct).length} of ${results.filter(f).length}`;
      const sounds = [...new Set(results.flatMap(x => x.missed))];
      try { await cloud.recordPhonicsCheck(current.id, r.name, results); saved = true; } catch (err) { showError(err); }
      dialog.innerHTML = `${head(`Phonics check: ${r.name}`)}
        <div class="ar-summary"><div><span>Words read correctly</span><b>${right.length} of ${results.length}</b></div>
          <div><span>Section 1</span><b>${of(x => x.section === 1)}</b></div><div><span>Section 2</span><b>${of(x => x.section === 2)}</b></div>
          <div><span>Real words / pseudo-words</span><b>${of(x => x.from === "real")} · ${of(x => x.from === "pseudo")}</b></div></div>
        ${right.length < results.length ? `<p><b>Not read correctly:</b> ${results.filter(x => !x.correct).map(x => `${esc(x.word)}${x.from === "pseudo" ? " 👽" : ""}`).join(", ")}</p>` : `<p>Every word read correctly. 🎉</p>`}
        ${sounds.length ? `<p><b>Sounds to practise:</b> ${sounds.map(g => `<span class="sound-chip">${esc(g)}</span>`).join(" ")}</p>` : ""}
        <p class="hint">${saved ? `Saved to ${esc(r.name)}'s results as a phonics check you marked.` : "Not saved."} The Department for Education sets the national pass mark each year and publishes it after the check in June, so this practice gives a score, not a pass or fail.</p>
        <div class="row end"><button class="btn" type="button" data-again>Do another</button><button class="btn primary" type="button" data-done>Done</button></div>`;
      dialog.querySelector("[data-close]").onclick = () => dialog.close();
      dialog.querySelector("[data-done]").onclick = () => dialog.close();
      dialog.querySelector("[data-again]").onclick = () => { dialog.close(); phonicsCheckDialog(r); };
    };

    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.addEventListener("cancel", e => { e.preventDefault(); close(); });
    intro();
    dialog.showModal();
  }

  /* ---------- Parents' night: a year of progress, trends, and what's changed since the last report ---------- */

  const DAY_MS = 864e5;
  const longDay = ms => new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  // Scottish school years start in August, English ones in September
  const schoolYearStart = (now = new Date(), en = false) => {
    const m = en ? 8 : 7;
    return new Date(now.getMonth() >= m ? now.getFullYear() : now.getFullYear() - 1, m, 1).getTime();
  };
  const REPORT_PERIODS = [["year", "This school year (from 1 August in Scotland, 1 September in England)"], ["last", "Since the last parents' night report"],
    ["12m", "The last 12 months"], ["date", "Since a date I choose"]];
  let reportPeriod = "year", reportDate = "";
  const lastReportOf = r => Math.max(0, ...((r && r.reports) || []));
  function reportFrom(r) {
    if (reportPeriod === "12m") return Date.now() - 365 * DAY_MS;
    if (reportPeriod === "date" && reportDate) return new Date(`${reportDate}T00:00:00`).getTime();
    if (reportPeriod === "last" && lastReportOf(r)) return lastReportOf(r);
    return schoolYearStart(new Date(), inEngland(r));
  }
  const firstTimePct = ws => (ws.length ? Math.round((ws.filter(w => w.correct && w.triesUsed === 1).length / ws.length) * 100) : null);
  const weekOf = ms => { const d = new Date(ms); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() + 6) % 7).getTime(); };
  const wordsOf = list => list.flatMap(s => s.words || []);
  // The first half of an area's questions against the second half: ▲ up, ▼ down, or steady
  function trendOf(ws) {
    if (ws.length < 10) return null;
    const half = Math.floor(ws.length / 2);
    const before = firstTimePct(ws.slice(0, half)), after = firstTimePct(ws.slice(half));
    return { before, after, key: after - before >= 8 ? "up" : before - after >= 8 ? "down" : "steady" };
  }
  // How often each sound came up in literacy work, and how often it was missed
  function soundTally(list) {
    const A = window.PopActivities;
    const t = {};
    const at = x => (t[x] = t[x] || { seen: 0, missed: 0 });
    wordsOf(list.filter(s => String(((A && A.tag(s.listId)) || {}).organiser || "").startsWith("Literacy"))).forEach(w => {
      String(w.sounds || "").split("·").map(x => x.trim()).filter(Boolean).forEach(x => { at(x).seen++; });
      (w.missed || []).forEach(x => { at(x).missed++; });
    });
    return t;
  }
  // Missed at least twice before, then met three or more times since without a slip
  const securedSounds = (before, after) => {
    const a = soundTally(before), b = soundTally(after);
    return Object.keys(a).filter(x => a[x].missed >= 2 && b[x] && b[x].seen >= 3 && !b[x].missed);
  };
  // Which CfE organisers each part of the starting assessment belongs to
  const QUEST_STRAND = {
    listen: o => o === "Spoken language", read: o => o === "Word reading", story: o => o === "Comprehension", spell: o => o === "Spelling",
    numbers: o => ["Number and place value", "Addition and subtraction", "Multiplication and division"].includes(o)
  };
  const QUEST_ORGANISER = {
    listen: o => o.startsWith("Literacy · Listening"), read: o => o.startsWith("Literacy · Reading"),
    story: o => o.startsWith("Literacy · Reading"), spell: o => o.includes("(spelling)"),
    numbers: o => o === "Numeracy · Number and number processes"
  };

  // Everything the report says, worked out from the pupil's results. "Now" means the last 8 weeks.
  function yearProgress(name, sessions, from, to, lastReport, en = false) {
    const A = window.PopActivities;
    const all = sessions.filter(s => sameName(s.pupil, name) && !P().isAssessment(s.listId)).sort((a, b) => a.at - b.at);
    const mine = all.filter(s => s.at >= from && s.at <= to);
    const recentCut = Math.max(from, to - 56 * DAY_MS);
    const recent = mine.filter(s => s.at > recentCut);
    const organiserOf = s => (en ? enStrandOf(s.listId) : ((A && A.tag(s.listId)) || { organiser: "Other work" }).organiser);

    const months = [];
    const first = new Date(from);
    for (let d = new Date(first.getFullYear(), first.getMonth(), 1); d.getTime() <= to; d.setMonth(d.getMonth() + 1)) {
      const start = d.getTime(), end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
      const these = mine.filter(s => s.at >= start && s.at < end);
      const ws = wordsOf(these);
      months.push({ start, sessions: these.length, items: ws.length, pct: ws.length >= 5 ? firstTimePct(ws) : null });
    }
    const long = months.length > 12;
    months.forEach(m => { m.label = new Date(m.start).toLocaleDateString("en-GB", long ? { month: "short", year: "2-digit" } : { month: "short" }); });

    const weeks = new Set(mine.map(s => weekOf(s.at)));
    let run = 0, bestRun = 0, totalWeeks = 0;
    for (let w = weekOf(from); w <= to; w = weekOf(w + 8 * DAY_MS)) { totalWeeks++; run = weeks.has(w) ? run + 1 : 0; bestRun = Math.max(bestRun, run); }

    const nowRows = cfeRows(recent, name, en);
    const areas = cfeRows(mine, name, en).map(row => {
      const now = nowRows.find(x => x.organiser === row.organiser);
      const ws = wordsOf(mine.filter(s => organiserOf(s) === row.organiser));
      const useNow = now && now.status.key !== "none";
      return Object.assign({}, row, { now: useNow ? now : null, statusNow: useNow ? now.status : row.status,
        trend: trendOf(ws), focus: (useNow ? now : row).topSkills });
    });

    // Since the last parents' night: the year before it against the time since
    let since = null;
    if (lastReport && lastReport < to) {
      const before = all.filter(s => s.at <= lastReport && s.at > lastReport - 365 * DAY_MS);
      const after = all.filter(s => s.at > lastReport && s.at <= to);
      since = { at: lastReport, sessions: after.length, before: firstTimePct(wordsOf(before)), after: firstTimePct(wordsOf(after)),
        sounds: securedSounds(before, after),
        areas: [...new Set(after.map(organiserOf))].map(o => ({ organiser: o,
          before: firstTimePct(wordsOf(before.filter(s => organiserOf(s) === o))),
          after: firstTimePct(wordsOf(after.filter(s => organiserOf(s) === o))),
          items: wordsOf(after.filter(s => organiserOf(s) === o)).length })).filter(a => a.items >= 5) };
    }

    const tally = soundTally(recent.length ? recent : mine);
    const focusSounds = Object.entries(tally).filter(([, v]) => v.missed).sort((a, b) => b[1].missed - a[1].missed).slice(0, 6).map(([x]) => x);
    const phonicsNow = (recent.length ? recent : mine).map(s => stageOf(s.listId)).filter(i => i >= 0);
    const pcts = months.filter(m => m.pct != null);
    return { mine, months, weeks: weeks.size, totalWeeks, bestRun, areas, since, focusSounds,
      secured: securedSounds(mine.filter(s => s.at <= recentCut), recent),
      stageNow: phonicsNow.length ? Math.max(...phonicsNow) : -1,
      pct: firstTimePct(wordsOf(mine)), startPct: pcts.length > 1 ? pcts[0] : null, endPct: pcts.length > 1 ? pcts[pcts.length - 1] : null,
      quiet: !mine.some(s => s.at > to - 28 * DAY_MS) };
  }

  // Two small charts rather than one with two scales: how much was practised, and how much was right first time
  function monthChart(months, kind) {
    const W = 340, H = 150, L = 34, R = 10, T = 14, B = 24;
    const pw = (W - L - R) / Math.max(months.length, 1);
    const base = H - B, h = base - T;
    const x = i => L + pw * i + pw / 2;
    const every = months.length > 8 ? 2 : 1;
    const labels = months.map((m, i) => (i % every ? "" : `<text x="${x(i)}" y="${H - 7}" class="pn-tick" text-anchor="middle">${esc(m.label)}</text>`)).join("");
    if (kind === "practice") {
      const top = Math.max(10, ...months.map(m => m.items));
      const max = Math.ceil(top / 10) * 10;
      const bw = Math.min(26, pw - 6);
      const bars = months.map((m, i) => {
        if (!m.items) return "";
        const bh = Math.max(2, (m.items / max) * h), bx = x(i) - bw / 2, by = base - bh, r = Math.min(4, bh);
        return `<path class="pn-bar" d="M${bx},${base} V${by + r} Q${bx},${by} ${bx + r},${by} H${bx + bw - r} Q${bx + bw},${by} ${bx + bw},${by + r} V${base} Z"><title>${esc(m.label)}: ${m.items} questions in ${m.sessions} session${m.sessions === 1 ? "" : "s"}</title></path>`;
      }).join("");
      return `<svg class="pn-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Questions answered each month">
        ${[0, max / 2, max].map(v => `<line x1="${L}" x2="${W - R}" y1="${base - (v / max) * h}" y2="${base - (v / max) * h}" class="pn-grid"/>
          <text x="${L - 6}" y="${base - (v / max) * h + 4}" class="pn-tick" text-anchor="end">${v}</text>`).join("")}
        ${bars}${labels}</svg>`;
    }
    const y = p => base - (p / 100) * h;
    const segs = [];
    let seg = [];
    months.forEach((m, i) => { if (m.pct == null) { if (seg.length) segs.push(seg); seg = []; } else seg.push([x(i), y(m.pct)]); });
    if (seg.length) segs.push(seg);
    const lastI = months.map(m => m.pct != null).lastIndexOf(true);
    return `<svg class="pn-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Right first time each month">
      ${[0, 50, 100].map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="pn-grid"/>
        <text x="${L - 6}" y="${y(v) + 4}" class="pn-tick" text-anchor="end">${v}%</text>`).join("")}
      <line x1="${L}" x2="${W - R}" y1="${y(85)}" y2="${y(85)}" class="pn-ref"/>
      <text x="${L + 4}" y="${y(85) - 4}" class="pn-tick">Secure 85%</text>
      ${segs.map(s => `<polyline class="pn-line" points="${s.map(p => p.join(",")).join(" ")}"/>`).join("")}
      ${months.map((m, i) => (m.pct == null ? "" : `<circle class="pn-dot" cx="${x(i)}" cy="${y(m.pct)}" r="4.5"><title>${esc(m.label)}: ${m.pct}% right first time (${m.items} questions)</title></circle>`)).join("")}
      ${lastI >= 0 ? `<text x="${x(lastI)}" y="${y(months[lastI].pct) - 9}" class="pn-value" text-anchor="middle">${months[lastI].pct}%</text>` : ""}
      ${labels}</svg>`;
  }

  const ARROW = { up: ["▲", "Improving"], down: ["▼", "Slipping"], steady: ["▶", "Steady"] };
  const shortArea = o => o.replace(/^(Literacy|Numeracy) · /, "").replace(/ · Tools for (reading|writing|listening and talking)/, "");
  const statusBadge = s => `<span class="ar-status ar-${s.toLowerCase().replace(/\s+/g, "-")}">${esc(s)}</span>`;

  function parentsNightReport(pupil, sessions, assessments, { from, to, comment }) {
    const last = lastReportOf(pupil);
    const en = inEngland(pupil);
    const y = yearProgress(pupil.name, sessions, from, to, last, en);
    const start = questFindings(questSessions(pupil.name, assessments), inEngland(pupil));
    const startAt = Math.min(...Object.values(questSessions(pupil.name, assessments)).filter(Boolean).map(s => s.at));
    const name = esc(pupil.name);
    const change = (a, b) => (a == null || b == null ? "" : b > a ? `up from ${a}%` : b < a ? `down from ${a}%` : `same as ${a}%`);
    const trendCell = t => (t ? `<span class="pn-trend pn-${t.key}">${ARROW[t.key][0]} ${ARROW[t.key][1]}</span><br><span class="meta">${t.before}% → ${t.after}%</span>` : `<span class="meta">Not enough yet</span>`);

    const strengths = [
      ...y.areas.filter(a => a.statusNow.key === "secure").map(a => `${shortArea(a.organiser)} is secure (${(a.now || a).pct}% right first time).`),
      ...y.areas.filter(a => a.trend && a.trend.key === "up" && a.statusNow.key !== "secure").map(a => `${shortArea(a.organiser)} is improving: ${a.trend.before}% to ${a.trend.after}%.`),
      ...(y.secured.length ? [`Sounds now secure: ${y.secured.slice(0, 8).join(", ")}.`] : []),
      ...(y.bestRun >= 3 ? [`Practised ${y.bestRun} weeks in a row.`] : [])
    ];
    const support = [
      ...y.areas.filter(a => a.statusNow.key === "support").map(a => `<b>${esc(shortArea(a.organiser))}</b>: ${(a.now || a).pct}% right first time${a.focus.length ? `, especially ${esc(a.focus.slice(0, 4).join(", "))}` : ""}.`),
      ...y.areas.filter(a => a.trend && a.trend.key === "down" && a.statusNow.key !== "support").map(a => `<b>${esc(shortArea(a.organiser))}</b> has slipped from ${a.trend.before}% to ${a.trend.after}%: worth a closer look.`),
      ...(y.focusSounds.length ? [`Sounds still being missed: <b>${esc(y.focusSounds.join(", "))}</b>.`] : []),
      ...(y.mine.length && y.quiet ? ["Little or no practice in the last four weeks."] : [])
    ];
    const next = [
      ...(y.focusSounds.length ? [`Practise ${esc(y.focusSounds.slice(0, 3).join(", "))} for a few minutes most days: reading words with them aloud, then spelling them.`] : []),
      ...y.areas.filter(a => a.statusNow.key === "support").slice(0, 2).map(a => `Short, regular practice in ${esc(shortArea(a.organiser).toLowerCase())}, at a level where most answers are right.`),
      ...(y.stageNow >= 0 && y.stageNow < P().STAGES.length - 1 && y.areas.some(a => a.organiser.includes("(spelling)") && a.statusNow.key === "secure")
        ? [`Move on to ${esc(P().STAGES[y.stageNow + 1].stage)} in spelling.`] : []),
      ...(y.totalWeeks && y.weeks / y.totalWeeks < 0.5 ? ["Little and often works best: aim for two or three short PopSpell sessions a week."] : []),
      ...(!y.mine.length ? ["Start with a few short PopSpell sessions so progress can be tracked."] : [])
    ];
    const startRows = ["listen", "read", "story", "spell", "numbers"].filter(k => start[k]).map(k => {
      const now = y.areas.filter(a => (en ? QUEST_STRAND : QUEST_ORGANISER)[k](a.organiser)).sort((a, b) => b.items - a.items)[0];
      const stage = (k === "spell" || k === "read") && y.stageNow >= 0 ? `Now practising ${P().STAGES[y.stageNow].stage}. ` : "";
      const startLevel = en ? ((enWork(start[k].id || start[k].top) || {}).label || "") : start[k].level || "";
      return `<tr><td><b>${esc(start[k].area)}</b></td><td>${statusBadge(start[k].status)} <span class="meta">${esc(startLevel)}</span><br>${esc(start[k].detail)}</td>
        <td>${now ? `${statusBadge(now.statusNow.text)} ${(now.now || now).pct}% right first time<br>` : ""}${esc(stage)}${!now && !stage ? `<span class="meta">No practice in this area yet</span>` : ""}</td></tr>`;
    });

    return `<div class="ar pn">
      <div class="ar-head"><img src="assets/brand/wordmark.png" alt="PopSpell" width="96">
        <div><h1>Parents' night report</h1><p class="ar-sub">${esc(current.name)} · ${esc(longDay(from))} to ${esc(longDay(to))}</p></div>
        <img src="assets/brand/pip-celebrate.png" alt="" width="70"></div>
      <table class="ar-facts"><tr><th>Pupil</th><td>${name}</td><th>Year group</th><td>${esc(pupil.yearGroup || "—")}</td></tr>
        <tr><th>Teacher</th><td>${esc(current.teacherName || me.name || "")}</td><th>Last report</th><td>${last ? esc(longDay(last)) : "This is the first"}</td></tr></table>
      <div class="ar-summary pn-tiles">
        <div><span>Right first time</span><b>${y.pct == null ? "—" : `${y.pct}%`}</b>${y.startPct ? `<small>${esc(y.startPct.label)} ${y.startPct.pct}% → ${esc(y.endPct.label)} ${y.endPct.pct}%</small>` : ""}</div>
        <div><span>Practice</span><b>${y.mine.length} session${y.mine.length === 1 ? "" : "s"}</b><small>in ${y.weeks} of ${y.totalWeeks} weeks</small></div>
        <div><span>Sounds now secure</span><b>${y.secured.length}</b><small>${y.focusSounds.length} still to work on</small></div>
        <div><span>Best run</span><b>${y.bestRun} week${y.bestRun === 1 ? "" : "s"}</b><small>in a row</small></div>
      </div>
      ${y.mine.length ? `<h2>Progress through the year</h2>
        <div class="pn-charts"><figure><figcaption>Questions answered each month</figcaption>${monthChart(y.months, "practice")}</figure>
          <figure><figcaption>Right first time each month</figcaption>${monthChart(y.months, "score")}</figure></div>
        <table class="pn-months"><tr><th>Month</th>${y.months.map(m => `<th>${esc(m.label)}</th>`).join("")}</tr>
          <tr><th>Sessions</th>${y.months.map(m => `<td>${m.sessions || "–"}</td>`).join("")}</tr>
          <tr><th>Right first time</th>${y.months.map(m => `<td>${m.pct == null ? "–" : `${m.pct}%`}</td>`).join("")}</tr></table>` : `<p>No PopSpell work recorded in this period.</p>`}
      ${y.since ? `<h2>Since the last report (${esc(longDay(y.since.at))})</h2><ul>
        <li>${y.since.sessions} session${y.since.sessions === 1 ? "" : "s"} done.${y.since.after != null ? ` Right first time: ${y.since.after}%${y.since.before != null ? `, ${change(y.since.before, y.since.after)} before then` : ""}.` : ""}</li>
        ${y.since.sounds.length ? `<li>Sounds now secure: ${esc(y.since.sounds.join(", "))}.</li>` : ""}
        ${y.since.areas.filter(a => a.before != null).map(a => `<li>${esc(shortArea(a.organiser))}: ${a.after}%, ${change(a.before, a.after)}.</li>`).join("")}
        ${y.since.areas.filter(a => a.before == null).map(a => `<li>New since then: ${esc(shortArea(a.organiser))} (${a.after}% right first time).</li>`).join("")}</ul>` : ""}
      ${startRows.length ? `<h2>Starting point and now</h2>
        <table class="ar-table"><thead><tr><th>Area</th><th>At the start (${esc(longDay(startAt))})</th><th>Now</th></tr></thead><tbody>${startRows.join("")}</tbody></table>` : ""}
      ${y.areas.length ? `<h2>How each area is going</h2>
        <table class="ar-table"><thead><tr><th>Area</th><th>${en ? "Curriculum year" : "CfE level"}</th><th>Questions</th><th>Trend over the period</th><th>Now</th><th>To work on</th></tr></thead><tbody>
        ${y.areas.map(a => `<tr class="${a.statusNow.key === "support" || (a.trend && a.trend.key === "down") ? "pn-flag" : ""}"><td><b>${esc(shortArea(a.organiser))}</b></td><td>${esc(a.levelText || "—")}</td>
          <td>${a.items}</td><td>${trendCell(a.trend)}</td><td>${statusBadge(a.statusNow.text)}${a.now ? `<br><span class="meta">${a.now.pct}%, last 8 weeks</span>` : ""}</td>
          <td>${esc(a.focus.slice(0, 5).join(", ") || "—")}</td></tr>`).join("")}</tbody></table>` : ""}
      <div class="pn-boxes">
        <div class="pn-box pn-good"><h2>Strengths</h2>${strengths.length ? `<ul>${strengths.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : `<p class="meta">Building up: more practice will show strengths here.</p>`}</div>
        <div class="pn-box pn-support"><h2>Needs further support</h2>${support.length ? `<ul>${support.map(s => `<li>${s}</li>`).join("")}</ul>` : `<p>Nothing stands out: keep going!</p>`}</div>
      </div>
      <h2>Next steps</h2>${next.length ? `<ul>${next.map(s => `<li>${s}</li>`).join("")}</ul>` : `<p>Keep up the good work, and keep stretching with new lists.</p>`}
      <h2>Teacher's comment</h2>${comment ? `<p class="pn-comment">${esc(comment).replace(/\n/g, "<br>")}</p>` : `<div class="ws-comment"></div>`}
      <p class="ar-note"><b>About this report.</b> It is worked out from ${name}'s PopSpell results. “Right first time” counts questions answered correctly without help.
        Secure means 85% or more right first time, on at least 10 questions over two or more days; “Now” uses the last 8 weeks. Trends compare the first half of the period's questions in an area with the second half.
        ${en ? "Curriculum years show which year of England's national curriculum the work comes from. They are indicative and should be confirmed by the teacher's own judgement against the programmes of study."
          : "CfE levels are indicative and should be confirmed by the teacher's own judgement against the benchmarks."}</p>
    </div>`;
  }

  // One pupil, or the whole class one per page. Loads enough history for the period, the
  // comparison with each pupil's last report, and the starting assessment however long ago it was.
  function parentsNight(pupils) {
    const single = pupils.length === 1;
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview pn-dialog";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>Parents' night report${single ? `: ${esc(pupils[0].name)}` : `s · ${pupils.length} pupils`}</h2>
        <button class="btn small" type="button" data-close>Close</button>
        <button class="btn small primary" type="button" data-print disabled>🖨️ Print / Save PDF</button></div>
      <div class="pn-controls">
        <label>Covering <select data-period>${REPORT_PERIODS.map(([k, t]) => `<option value="${k}"${k === reportPeriod ? " selected" : ""}>${t}</option>`).join("")}</select></label>
        <label data-date-wrap ${reportPeriod === "date" ? "" : "hidden"}>From <input type="date" data-date value="${esc(reportDate)}"></label>
        ${single ? `<label class="pn-comment-box">Teacher's comment, printed on the report (leave blank to write by hand)
          <textarea data-comment rows="3" maxlength="1500"></textarea></label>` : ""}
        <label class="check"><input type="checkbox" data-mark checked> When printing, save today as ${single ? `${esc(pupils[0].name)}'s` : "each pupil's"} latest report, so the next one shows what's changed</label>
      </div>
      <div data-pages><div class="empty">Loading a year of results…</div></div>`;
    document.body.append(dialog);
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.showModal();

    let loaded = null, loadedFrom = Infinity, html = "";
    const pages = dialog.querySelector("[data-pages]");
    const earliest = () => Math.min(...pupils.map(r => Math.min(reportFrom(r), lastReportOf(r) ? lastReportOf(r) - 365 * DAY_MS : Infinity)));
    async function render() {
      const need = earliest();
      try {
        if (!loaded || need < loadedFrom) {
          pages.innerHTML = `<div class="empty">Loading a year of results…</div>`;
          const days = Math.min(3650, Math.ceil((Date.now() - need) / DAY_MS) + 1);
          const [sessions, assessments] = await Promise.all([cloud.sessions(current.id, days), cloud.assessments(current.id, P().QUEST.map(q => q.id))]);
          loaded = { sessions, assessments };
          loadedFrom = need;
        }
      } catch (err) { pages.innerHTML = `<div class="empty">${esc(err.message || "Couldn't load the results.")}</div>`; return; }
      const comment = single ? dialog.querySelector("[data-comment]").value.trim() : "";
      const reports = pupils.map(r => parentsNightReport(r, loaded.sessions, loaded.assessments, { from: reportFrom(r), to: Date.now(), comment }));
      html = reports.map(h => `<section class="pn-page">${h}</section>`).join("");
      pages.innerHTML = reports.map(h => `<section class="sheet-preview-page ws-report">${h}</section>`).join("");
      dialog.querySelector("[data-print]").disabled = false;
    }
    dialog.querySelector("[data-period]").onchange = e => {
      reportPeriod = e.target.value;
      dialog.querySelector("[data-date-wrap]").hidden = reportPeriod !== "date";
      render();
    };
    dialog.querySelector("[data-date]").onchange = e => { reportDate = e.target.value; render(); };
    if (single) dialog.querySelector("[data-comment]").oninput = () => { if (loaded) render(); };
    dialog.querySelector("[data-print]").onclick = async () => {
      const mark = dialog.querySelector("[data-mark]").checked;
      dialog.close();
      if (mark) {
        const now = Date.now();
        await Promise.all(pupils.filter(r => r.key).map(r => cloud.savePupil(current.id, Object.assign({}, r, { reports: [...(r.reports || []), now].slice(-12) }))
          .then(() => { r.reports = [...(r.reports || []), now].slice(-12); }))).catch(showError);
      }
      printSheet("ws-report", html);
    };
    render();
  }

  // Three steps: about the child, Pip's Sound Quest, then the report and first lessons.
  // Opened from the Pupils tab, blank for a new child or at step 2 for one already in the class.
  function newPupilFlow(pupil, roster, done, startStep = 1) {
    let r = pupil ? Object.assign({}, pupil) : null;
    let step = r ? startStep : 1;
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview pupil-flow";
    document.body.append(dialog);
    dialog.addEventListener("close", () => { dialog.remove(); done(); }, { once: true });
    const steps = ["About the child", "Pip's Sound Quest", "Report and first lessons"];
    const frame = inner => {
      dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>🌟 ${r ? esc(r.name) : "New pupil"}</h2>
          <button class="btn small" type="button" data-close>Close</button></div>
        <ol class="flow-steps">${steps.map((s, i) => `<li class="${i + 1 === step ? "now" : i + 1 < step ? "done" : ""}"><button type="button" data-step="${i + 1}" ${!r && i ? "disabled" : ""}>${i + 1}. ${s}</button></li>`).join("")}</ol>
        <div class="flow-body">${inner}</div>`;
      dialog.querySelector("[data-close]").onclick = () => dialog.close();
      dialog.querySelectorAll("[data-step]").forEach(b => { b.onclick = () => { step = Number(b.dataset.step); render(); }; });
    };
    const render = () => (step === 1 ? drawAbout() : step === 2 ? drawQuest() : drawResults());
    // Errors show inside the window, where the teacher is looking
    const fail = err => dialog.querySelector(".flow-body").insertAdjacentHTML("afterbegin", `<div class="t-error">${esc(err.message || err)}</div>`);

    function drawAbout() {
      frame(`<p class="hint">A few details help PopSpell (and you) plan for this child. Only teachers can see them.</p>
        <form class="t-diary-form" id="flowAbout">
          <label>First name, as the child will type it ${r ? `<input type="text" value="${esc(r.name)}" disabled>` : `<input type="text" id="flowName" maxlength="40" required>`}</label>
          <label>Year group <select id="flowYear"><option value="">Choose…</option>${yearOptions(r && r.yearGroup)}</select></label>
          <label>Parent email (optional) <input type="email" id="flowEmail" value="${esc(r ? r.parentEmail || "" : "")}" placeholder="parent@example.com"></label>
          <label>Things to bear in mind <textarea id="flowNeeds" rows="2" maxlength="500" placeholder="e.g. diagnosed dyslexia, gets tired quickly">${esc(r ? r.needs || "" : "")}</textarea></label>
          <div class="chips">${NEED_CHIPS.map(c => `<button type="button" class="t-chip need-chip" data-need="${esc(c)}">＋ ${esc(c)}</button>`).join("")}</div>
          <label>What they enjoy (for choosing stories and keeping it fun) <input type="text" id="flowLikes" maxlength="300" value="${esc(r ? r.likes || "" : "")}" placeholder="e.g. football, dinosaurs, drawing"></label>
          <div class="row end"><button class="btn primary" type="submit">Save and continue →</button></div>
        </form>`);
      dialog.querySelectorAll("[data-need]").forEach(b => { b.onclick = () => {
        const box = dialog.querySelector("#flowNeeds");
        if (!box.value.includes(b.dataset.need)) box.value = box.value.trim() ? `${box.value.trim()}; ${b.dataset.need}` : b.dataset.need;
      }; });
      dialog.querySelector("#flowAbout").onsubmit = async e => {
        e.preventDefault();
        const name = r ? r.name : dialog.querySelector("#flowName").value.trim();
        if (!name) return;
        if (!r && roster.some(p => sameName(p.name, name))) return fail(new Error("This pupil is already in the class. Use the Assessment and report button on their card."));
        const details = Object.assign({}, r || {}, { name, yearGroup: dialog.querySelector("#flowYear").value,
          parentEmail: dialog.querySelector("#flowEmail").value.trim(), needs: dialog.querySelector("#flowNeeds").value, likes: dialog.querySelector("#flowLikes").value });
        try { await cloud.savePupil(current.id, details); r = details; step = 2; render(); } catch (err) { fail(err); }
      };
    }

    async function drawQuest() {
      frame(`<div class="empty">Loading…</div>`);
      let sessions = [];
      try { sessions = await cloud.sessions(current.id, 365); } catch (err) { return fail(err); }
      const found = questSessions(r.name, sessions);
      const link = assessLink(r.name);
      frame(`<div class="flow-quest">
          <img src="assets/brand/pip-hop-small.webp" alt="" width="80" height="80">
          <div><p><b>Pip's Sound Quest</b> is a 15–25 minute assessment that ${esc(r.name)} plays as a game: five short islands for listening, reading, a story, spelling and numbers. There are no marks on screen, and each island stops by itself when it gets too hard. Islands can be done across more than one lesson.</p>
          <p>Open this link on the device ${esc(r.name)} will use. It joins your class, signs in as ${esc(r.name)}, and opens Pip's map.</p></div></div>
        <div class="add-row"><input type="text" readonly class="t-link" value="${esc(link)}" aria-label="Assessment link">
          <button class="btn small" type="button" data-copy-assess>📋 Copy</button>
          <a class="btn small primary" href="${esc(link)}" target="_blank" rel="noopener">▶ Open the quest</a></div>
        <h3 class="t-h2">Islands</h3>
        <ul class="flow-islands">${P().QUEST.map(isl => `<li class="${found[isl.key] ? "done" : ""}"><span>${isl.icon}</span> ${esc(isl.title)}
          <b>${found[isl.key] ? `✓ ${esc(day(found[isl.key].at))}` : "Not yet"}</b></li>`).join("")}</ul>
        <div class="row"><button class="btn small" type="button" data-refresh>↻ Check again</button>
          <button class="btn primary" type="button" data-next ${Object.values(found).some(Boolean) ? "" : "disabled"}>See the report →</button></div>`);
      dialog.querySelector("[data-copy-assess]").onclick = async e => {
        try { await navigator.clipboard.writeText(link); e.target.textContent = "✓ Copied"; } catch { dialog.querySelector(".t-link").select(); }
      };
      dialog.querySelector("[data-refresh]").onclick = () => drawQuest();
      dialog.querySelector("[data-next]").onclick = () => { step = 3; render(); };
    }

    async function drawResults() {
      frame(`<div class="empty">Loading…</div>`);
      let sessions = [];
      try { sessions = await cloud.sessions(current.id, 365); } catch (err) { return fail(err); }
      const en = inEngland(r);
      const f = questFindings(questSessions(r.name, sessions), en);
      const keys = Object.keys(f).filter(k => f[k]);
      const levelOf = x => (en ? ((enWork(x.id || x.top) || {}).label || "") : x.level ? `${x.level} level` : "");
      frame(`${keys.length ? `<ul class="flow-findings">${keys.map(k => `<li><b>${esc(f[k].area)}</b> · ${levelOf(f[k]) ? `${esc(levelOf(f[k]))} · ` : ""}${esc(f[k].status)}<br><span class="meta">${esc(f[k].detail)}</span></li>`).join("")}</ul>`
          : `<div class="empty">No islands finished yet. Go back a step to start the quest.</div>`}
        <div class="row">
          <button class="btn primary" type="button" data-report ${keys.length ? "" : "disabled"}>📄 View the assessment report</button>
          <button class="btn" type="button" data-plan>🧭 Plan the first lessons</button>
          <button class="btn" type="button" data-email>✉️ Email the home login</button>
        </div>
        <p class="hint">Next steps already suggests where to start from the spelling and number islands.</p>`);
      dialog.querySelector("[data-report]").onclick = () => previewReport(r, sessions);
      // The teacher area's own draw(): over to Next steps, which suggests where to start
      dialog.querySelector("[data-plan]").onclick = () => { tab = "next"; dialog.close(); draw(); };
      dialog.querySelector("[data-email]").onclick = () => previewEmail(r.parentEmail || "", homeLoginEmail(r));
    }

    render();
    dialog.showModal();
  }

  /* ---------- Branded emails the teacher sends from their own email app ---------- */

  // No email service (it stays free): the teacher previews the email here, copies it with its
  // logo, colours and button, and pastes it into their own email. Inline styles and table layout,
  // because that's what email apps keep; pictures load from the website.
  const SITE_ROOT = `${location.origin}${location.pathname.replace(/[^/]*$/, "")}`;
  function brandedEmail({ title, paragraphs, button, boxes = [], sign }) {
    const p = html => `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#142a56;">${html}</p>`;
    return `<div style="background:#eaf3ff;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#142a56;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #d6e5f7;border-radius:18px;border-collapse:separate;">
<tr><td style="padding:20px 24px 14px;text-align:center;border-bottom:4px solid #ffc837;">
  <img src="${SITE_ROOT}assets/brand/wordmark.png" alt="PopSpell" width="150" style="display:block;margin:0 auto 8px;border:0;width:150px;height:auto;">
  <img src="${SITE_ROOT}assets/brand/pip-mascot.png" alt="Pip" width="110" style="display:block;margin:0 auto;border:0;width:110px;height:auto;">
</td></tr>
<tr><td style="padding:22px 28px 10px;">
  <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#0b2e6b;">${title}</h1>
  ${paragraphs.map(p).join("")}
  ${button ? `<p style="margin:22px 0 8px;text-align:center;"><a href="${button.href}" style="display:inline-block;background:#0eb5f2;color:#ffffff;text-decoration:none;font-weight:bold;font-size:18px;padding:14px 28px;border-radius:999px;">${button.text}</a></p>
  <p style="margin:0 0 18px;text-align:center;font-size:12px;color:#5b6b8c;word-break:break-all;">Or open this link: <a href="${button.href}" style="color:#0b2e6b;">${button.href}</a></p>` : ""}
  ${boxes.map(box => `<div style="background:#fff6df;border:2px solid #ffc837;border-radius:14px;padding:12px 16px;margin:0 0 14px;font-size:15px;line-height:1.5;color:#142a56;">${box}</div>`).join("")}
  ${p(`Best wishes,<br><b>${sign}</b>`)}
</td></tr>
<tr><td style="padding:14px 24px;background:#f5f9ff;border-top:1px solid #d6e5f7;border-radius:0 0 18px 18px;text-align:center;font-size:12px;line-height:1.5;color:#5b6b8c;">
  PopSpell · Hear it. Map it. Spell it. · <a href="${SITE_ROOT}" style="color:#0b2e6b;">popspell.com</a><br>Please keep these links private to your family.
</td></tr>
</table></div>`;
  }

  function homeLoginEmail(pupil) {
    const name = esc(pupil.name);
    const link = homeLink(pupil.name);
    const homework = pupil.homeworkList ? esc(listTitle(pupil.homeworkList)) : "";
    const boxes = [];
    if (homework) boxes.push(`📌 <b>This week's homework: ${homework}</b><br>It's at the top of the PopSpell home page, under "Your lists today".`);
    if (pupil.parentLink) boxes.push(`👪 <b>See ${name}'s progress</b><br><a href="${parentURL(pupil.parentLink)}" style="color:#0b2e6b;">${name}'s progress page</a> shows their sounds, recent work and what to practise.`);
    const html = brandedEmail({
      title: `${name}'s PopSpell login for home`,
      paragraphs: [
        "Hello,",
        `Here is ${name}'s own PopSpell link for practising at home. Please open it <b>once</b> on the device ${name} will use at home (a tablet, laptop or phone).`,
        `PopSpell will then remember ${name} on that device. ${name}'s homework, stars and review words will be there, carrying on from our lessons, and work done at home comes back to me too.`
      ],
      button: { href: link, text: `▶ Open PopSpell as ${name}` },
      boxes,
      sign: esc(shortName(me.name))
    });
    const text = `Hello,\n\nHere is ${pupil.name}'s PopSpell link for practising at home:\n${link}\n\n`
      + `Please open it once on the device ${pupil.name} will use at home. PopSpell will then remember ${pupil.name}, and their homework, stars and review words will be there.\n\n`
      + (pupil.homeworkList ? `This week's homework: ${listTitle(pupil.homeworkList)}.\n\n` : "")
      + (pupil.parentLink ? `${pupil.name}'s progress: ${parentURL(pupil.parentLink)}\n\n` : "")
      + `Please keep these links private to your family.\n\nBest wishes,\n${shortName(me.name)}`;
    return { subject: `${pupil.name}'s PopSpell login for home`, html, text };
  }

  // Preview, then copy (with pictures and styling) and paste into the teacher's own email
  function previewEmail(to, email) {
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview email-preview";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>Email preview</h2>
        <button class="btn small" type="button" data-close>Close</button>
        <button class="btn small" type="button" data-open>✉️ Open email app</button>
        <button class="btn small primary" type="button" data-copy>📋 Copy email</button></div>
      <p class="hint email-steps"><b>1.</b> Copy email &nbsp; <b>2.</b> Open email app (the parent's address${to ? ` <b>${esc(to)}</b>` : ""} and subject are filled in) &nbsp; <b>3.</b> Paste into the message and send.</p>
      <p class="email-subject"><b>Subject:</b> ${esc(email.subject)}</p>
      <section class="email-page">${email.html}</section>`;
    document.body.append(dialog);
    const page = dialog.querySelector(".email-page");
    const copyBtn = dialog.querySelector("[data-copy]");
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.write([new ClipboardItem({
          "text/html": new Blob([email.html], { type: "text/html" }),
          "text/plain": new Blob([email.text], { type: "text/plain" })
        })]);
      } catch {
        // Older browsers: copy what's on screen, which keeps the formatting too
        const range = document.createRange();
        range.selectNodeContents(page);
        const sel = getSelection();
        sel.removeAllRanges(); sel.addRange(range);
        document.execCommand("copy");
        sel.removeAllRanges();
      }
      copyBtn.textContent = "✓ Copied — now paste it";
    };
    dialog.querySelector("[data-open]").onclick = () => {
      location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(email.subject)}`;
    };
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.showModal();
  }

  /* ---------- Parent pages: a private progress link for each pupil's family (parent.html) ---------- */

  const PARENT_DAYS = 120; // the parent page covers about the last four months
  const parentURL = link => `${location.origin}${location.pathname.replace(/[^/]*$/, "")}parent.html#${link}`;
  const sameName = (a, b) => String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();

  // What the parent page shows, worked out from the results that reach the teacher. Stars are kept
  // on the pupil's own device, so sounds are counted here with the same rule as My sounds.
  function parentSummary(name, sessions, assignment, r) {
    const mine = sessions.filter(s => sameName(s.pupil, name)).sort((a, b) => a.at - b.at);
    const sounds = {};
    // Starting checks deliberately go past what's been taught, so they don't count here
    mine.filter(s => !P().isAssessment(s.listId)).forEach(s => (s.words || []).forEach(w => {
      const missed = new Set(w.missed || []);
      const d = new Date(s.at).toDateString();
      new Set(String(w.sounds || "").split("·").filter(t => t && t.length <= 3)).forEach(snd => {
        const x = sounds[snd] = sounds[snd] || { right: 0, days: new Set(), recent: [] };
        const ok = !missed.has(snd);
        if (ok) { x.right++; x.days.add(d); }
        x.recent.push(ok);
      });
    }));
    const level = x => (x.right >= 4 && x.days.size >= 2 && x.recent.length >= 3 && x.recent.slice(-3).every(Boolean)) ? "secure"
      : x.recent.slice(-2).includes(false) ? "practise" : "learning";
    const soundsAt = lv => Object.keys(sounds).filter(s => level(sounds[s]) === lv).slice(0, 60);
    const weekAgo = Date.now() - 7 * 86400000;
    const thisWeek = mine.filter(s => s.at >= weekAgo);
    const firstTime = s => (s.words || []).filter(w => w.correct && w.triesUsed === 1).length;
    const today = todayKey();
    return {
      teacher: shortName(current.teacherName || (me && me.name) || ""),
      days: PARENT_DAYS,
      week: { done: thisWeek.length, questions: thisWeek.reduce((t, s) => t + (s.words || []).length, 0) },
      sounds: { secure: soundsAt("secure"), learning: soundsAt("learning"), practise: soundsAt("practise") },
      recent: mine.slice(-8).reverse().map(s => ({ title: s.list, at: s.at, worksheet: s.source === "worksheet",
        score: P().isAssessment(s.listId) ? "" : `${firstTime(s)} of ${(s.words || []).length} right first time` })),
      homework: r && r.homeworkList ? titleOf(r.homeworkList) : "",
      nextLesson: r && r.nextLessonDate >= today ? r.nextLessonDate : "",
      upcoming: (assignment ? assignment.plans : []).filter(p => p.until >= today)
        .sort((a, b) => a.from.localeCompare(b.from)).slice(0, 3).map(p => ({ title: titleOf(p.list), from: p.from })),
      curriculum: inEngland(r) ? "england" : "scotland",
      cfe: cfeRows(sessions, name, inEngland(r)).filter(x => x.status.key !== "none")
        .map(x => ({ organiser: x.organiser, level: x.levelText, status: x.status.text }))
    };
  }

  async function publishParent(r, sessions, assignments, link = r.parentLink || cloud.newParentLink()) {
    const a = assignments.find(x => sameName(x.who, r.name)) || null;
    await cloud.publishParent(current.id, r.name, link, parentSummary(r.name, sessions, a, r), r.parentNote || "");
    return link;
  }

  // Whenever the teacher area loads results, any parent page with newer work behind it is updated
  function refreshParents(roster, sessions, assignments) {
    roster.filter(r => r.parentLink).forEach(r => {
      const latest = Math.max(0, ...sessions.filter(s => sameName(s.pupil, r.name)).map(s => s.at));
      if (latest > (r.parentAt || 0)) publishParent(r, sessions, assignments).catch(err => console.warn("PopSpell: parent page not updated", err));
    });
  }
  // The Pupils tab shows any period, but a parent page always covers the same months
  const parentData = () => Promise.all([cloud.sessions(current.id, PARENT_DAYS), cloud.assignments(current.id)]);

  let days = 30;
  const PERIODS =[[7, "Last 7 days"], [30, "Last 30 days"], [91, "Last 3 months (a term)"], [365, "Last year"], [3650, "Everything"]];

  async function drawPupils(body) {
    body.innerHTML = `<div class="empty">Loading…</div>`;
    let sessions, roster;
    try { [sessions, roster] = await Promise.all([cloud.sessions(current.id, days), cloud.pupils(current.id)]); }
    catch (err) { return showError(err); }
    if (tab !== "pupils") return;
    const pupils = summarise(sessions);
    const dueTomorrow = roster.filter(r => r.reminderOptIn && r.parentEmail && r.nextLessonDate === tomorrowKey()).length;
    body.innerHTML = `
      <div class="next-head"><h2 class="t-h2">Pupils in ${esc(current.name)}</h2><div class="row">
        <button class="btn" id="calAll">🗓️ Lessons to my calendar</button>
        <button class="btn" id="pnAll">📅 Parents' night reports (whole class)</button>
        <button class="btn primary" id="newPupil">🌟 New pupil: profile and assessment</button></div></div>
      <p class="hint">Add a pupil using the same name or code they type on their device. Parent contact details stay in the teacher area. Prepare reminders the day before a lesson; save a sound-map PDF and attach it to the email draft before sending.</p>
      <p class="pill">${dueTomorrow} reminder${dueTomorrow === 1 ? "" : "s"} due tomorrow</p>
      <form class="add-row" id="addPupil"><input type="text" id="rosterName" maxlength="40" placeholder="Pupil's name or code" required>
        <input type="email" id="rosterParent" placeholder="Parent email (optional)">
        <button class="btn primary" type="submit">Add pupil</button></form>
      ${roster.length ? `<div class="pupil-grid roster-grid">${roster.map(r => `<article class="pcard roster-card" data-roster="${esc(r.key)}">
        <div class="next-head"><h3>${esc(r.name)}${r.yearGroup ? ` <span class="meta">${esc(r.yearGroup)}</span>` : ""}${r.reminderOptIn && r.nextLessonDate === tomorrowKey() ? ` <span class="t-role">Reminder tomorrow</span>` : ""}</h3>
          <div class="row"><button class="btn small" data-assess="${esc(r.key)}">🌟 Assessment and report</button>
            <button class="btn small" data-pn="${esc(r.name)}">📅 Parents' night report</button>
            <button class="btn small" data-phonics="${esc(r.key)}">🔤 Phonics check practice</button></div></div>
        <label>Parent email <input type="email" data-parent value="${esc(r.parentEmail || "")}" placeholder="parent@example.com"></label>
        <label class="check"><input type="checkbox" data-optin ${r.reminderOptIn ? "checked" : ""}> Parent requested reminders</label>
        <div class="add-row"><label>Next lesson <input type="date" data-lesson-date value="${esc(r.nextLessonDate || "")}"></label>
          <label>Time <input type="time" data-lesson-time value="${esc(r.lessonTime || "")}"></label>
          <button class="btn small" type="button" data-calendar="${esc(r.key)}">🗓️ Add to calendar</button></div>
        <label>Homework list <select data-homework>${catalogueOptions()}</select></label>
        <div class="parent-box">
          <p><b>🏠 Home login</b></p>
          <p class="hint">Opening this link once on ${esc(r.name)}'s own device signs it in as ${esc(r.name)} in this class, so homework, stars and review words carry on at home.</p>
          <div class="add-row"><input type="text" readonly class="t-link" value="${esc(homeLink(r.name))}" aria-label="Home login link">
            <button class="btn small" data-home-copy="${esc(r.key)}">📋 Copy</button>
            <button class="btn small primary" data-home-email="${esc(r.key)}">✉️ Email home login</button></div>
        </div>
        <div class="parent-box">
          <p><b>👪 Parent page</b>${r.parentLink ? ` <span class="meta">· updated ${r.parentAt ? esc(day(r.parentAt)) : "—"}</span>` : ""}</p>
          <label>Note for home, shown on the parent page
            <textarea data-parent-note rows="2" maxlength="1000" placeholder="e.g. Great effort this week! Practise the ai words at bedtime.">${esc(r.parentNote || "")}</textarea></label>
          ${r.parentLink ? `
            <div class="add-row"><input type="text" readonly class="t-link" value="${esc(parentURL(r.parentLink))}" aria-label="Parent link">
              <button class="btn small" data-parent-copy="${esc(r.key)}">📋 Copy</button>
              <a class="btn small" href="${esc(parentURL(r.parentLink))}" target="_blank" rel="noopener">Open</a></div>
            <div class="row"><button class="btn small" data-parent="update" data-key="${esc(r.key)}">Update now</button>
              <button class="btn small" data-parent="new" data-key="${esc(r.key)}">Make a new link</button>
              <button class="btn small" data-parent="off" data-key="${esc(r.key)}">Turn off</button></div>`
          : `<button class="btn small" data-parent="make" data-key="${esc(r.key)}">Make a parent link</button>`}
        </div>
        <div class="row"><button class="btn small" data-save-pupil="${esc(r.key)}">Save details</button>
          ${r.reminderOptIn && r.parentEmail && r.nextLessonDate === tomorrowKey() ? `<button class="btn small" data-email-pupil="${esc(r.key)}">Prepare tomorrow's reminder</button>` : ""}
          ${r.homeworkList ? `<button class="btn small" data-print-homework="${esc(r.key)}">Print homework / Save PDF</button>` : ""}
          <button class="btn small danger" data-delete-pupil="${esc(r.key)}">🗑️ Delete pupil and records</button></div>
      </article>`).join("")}</div>` : `<div class="empty">No pupils added yet.</div>`}
      <div class="row t-row">
        <label class="t-class">Show <select id="days">${PERIODS.map(([d, t]) => `<option value="${d}"${d === days ? " selected" : ""}>${t}</option>`).join("")}</select></label>
        <p class="hint">${esc(current.name)}: ${sessions.length} lists done by ${pupils.length} pupils.</p>
        ${sessions.length ? `<button class="btn" id="csv">⬇ Download every word (spreadsheet)</button>` : ""}</div>
      ${pupils.length ? `<div class="pupil-grid">${pupils.map(p => `
        <article class="pcard">
          <div class="next-head"><h3>${esc(p.pupil)}</h3><div class="row"><button class="btn small" data-report="${esc(p.pupil)}">📄 Progress report</button>
            <button class="btn small" data-pn="${esc(p.pupil)}">📅 Parents' night</button></div></div>
           <p class="meta">${p.lists} lists (${p.worksheets} worksheets) · ${p.right}/${p.words} words right · ${p.firstGo} first time · last ${day(p.last)}</p>
          ${p.topSounds.length ? `<div><b>Skills to practise</b><br>${p.topSounds.map(([s, n]) => `<span class="sound-chip">${esc(s)} ×${n}</span>`).join("")}</div>` : `<div>No missed skills 🎉</div>`}
           <ul class="recent">${p.recent.map(r => `<li>${day(r.at)} · ${esc(r.source)} · ${esc(r.list)} · ${esc(r.score)} first time</li>`).join("")}</ul>
           ${p.lastSwitch ? `<details class="game-review"><summary>🎮 Last Sound Switch game · ${day(p.lastSwitch.at)}</summary>
             <p class="hint">Time includes listening and thinking; it is never used to score the child.</p>
             <ul>${p.lastSwitch.words.map(w => `<li><b>${esc(w.word)}</b> · ${w.triesUsed === 1 ? "first go" : "with support"}
               ${Number.isFinite(w.seconds) ? ` · ${w.seconds}s` : ""}
               ${(w.wrong || []).length ? `<br><span class="meta">${esc(w.wrong.join(", "))}</span>` : ""}</li>`).join("")}</ul></details>` : ""}
           ${p.lastCanopy ? `<details class="game-review"><summary>✨ Last Counting Canopy game · ${day(p.lastCanopy.at)}</summary>
             <p class="hint">Time shows thinking time only; it never changes the score.</p>
             <ul>${p.lastCanopy.words.map(w => `<li><b>${esc(w.word)}</b> · ${w.triesUsed === 1 ? "first go" : "with support"}
               ${Number.isFinite(w.seconds) ? ` · ${w.seconds}s` : ""}
               ${(w.methods || []).length ? `<br><span class="meta">Firefly groups: ${esc(w.methods.join(" and "))}</span>` : ""}
               ${(w.wrong || []).length ? `<br><span class="meta">Tried: ${esc(w.wrong.join(", "))}</span>` : ""}</li>`).join("")}</ul></details>` : ""}
        </article>`).join("")}</div>` : `<div class="empty">No results yet. Each pupil appears here after finishing (or stopping) a list.</div>`}
      ${pupils.length ? (() => {
        // Scottish pupils by CfE organiser, English pupils by national curriculum strand
        const isEn = p => inEngland(roster.find(r => sameName(r.name, p.pupil)));
        const table = (group, en) => {
          const names = new Set(group.map(p => p.pupil.trim().toLowerCase()));
          const areas = [...new Set(cfeRows(sessions.filter(s => names.has(String(s.pupil || "").trim().toLowerCase())), "", en).map(r => r.organiser))];
          return `<div class="t-scroll"><table class="t-table cfe-table"><thead><tr><th>Pupil</th>${areas.map(o => `<th>${esc(o.replace(/^(Literacy|Numeracy) · /, ""))}</th>`).join("")}</tr></thead>
          <tbody>${group.map(p => { const rows = cfeRows(sessions, p.pupil, en);
            return `<tr><td class="who">${esc(p.pupil)}</td>${areas.map(o => { const r = rows.find(x => x.organiser === o);
              return `<td>${r ? `<span class="cfe ${r.status.key}">${esc(r.status.text)}</span><br><span class="meta">${r.pct}% · ${r.items} q</span>` : "—"}</td>`; }).join("")}</tr>`; }).join("")}</tbody></table></div>`;
        };
        const scots = pupils.filter(p => !isEn(p)), english = pupils.filter(isEn);
        const key = "Secure = 85%+ right first time on 10+ questions over 2+ days; Developing = 60%+.";
        return `${scots.length ? `<h2 class="t-h2">Curriculum for Excellence overview</h2>
          <p class="hint">Each pupil's status for each organiser in this period. ${key}</p>${table(scots, false)}` : ""}
          ${english.length ? `<h2 class="t-h2">National curriculum (England) overview</h2>
          <p class="hint">Pupils with an England year group, by national curriculum strand, in this period. ${key}</p>${table(english, true)}` : ""}`;
      })() : ""}
      <h2 class="t-h2">🧹 Old records</h2>
      <p class="hint">PopSpell's privacy page promises to delete a child's records within 12 months of their last lesson.
        This checks every result ever saved in ${esc(current.name)} and lists anyone with no lessons or results for over a year.</p>
      <button class="btn" id="checkOld">Check for records over 12 months old</button>
      <div id="oldRecords"></div>`;
    if ($("#csv")) $("#csv").onclick = () => downloadCSV(sessions);
    body.querySelectorAll("[data-report]").forEach(b => { b.onclick = () => printReport(b.dataset.report, sessions, inEngland(roster.find(r => sameName(r.name, b.dataset.report)))); });
    $("#days").onchange = e => { days = Number(e.target.value); drawPupils(body); };
    $("#newPupil").onclick = () => newPupilFlow(null, roster, () => drawPupils(body));
    // Roster pupils, plus anyone with results who isn't on the roster yet
    const reportPupil = name => roster.find(r => sameName(r.name, name)) || { name };
    body.querySelectorAll("[data-pn]").forEach(b => { b.onclick = () => parentsNight([reportPupil(b.dataset.pn)]); });
    $("#pnAll").onclick = () => {
      const everyone = [...roster, ...pupils.filter(p => !roster.some(r => sameName(r.name, p.pupil))).map(p => ({ name: p.pupil }))]
        .sort((a, b) => a.name.localeCompare(b.name));
      if (!everyone.length) return showError(new Error("Add pupils first: each one gets a page."));
      parentsNight(everyone);
    };
    body.querySelectorAll("[data-phonics]").forEach(b => { b.onclick = () => phonicsCheckDialog(roster.find(r => r.key === b.dataset.phonics)); });
    body.querySelectorAll("[data-assess]").forEach(b => {
      b.onclick = () => newPupilFlow(roster.find(r => r.key === b.dataset.assess), roster, () => drawPupils(body), 2);
    });
    $("#addPupil").onsubmit = async e => {
      e.preventDefault();
      const name = $("#rosterName").value.trim();
      const parentEmail = $("#rosterParent").value.trim();
      if (roster.some(p => p.name.toLowerCase() === name.toLowerCase()))
        return showError(new Error("This pupil is already in the class roster."));
      try { await cloud.savePupil(current.id, { name, parentEmail }); drawPupils(body); }
      catch (err) { showError(err); }
    };
    body.querySelectorAll("[data-homework]").forEach((el, i) => { el.value = roster[i].homeworkList || ""; });
    body.querySelectorAll("[data-save-pupil]").forEach(b => { b.onclick = async () => {
      const pupil = roster.find(r => r.key === b.dataset.savePupil);
      const card = b.closest(".roster-card");
      const parentEmail = card.querySelector("[data-parent]").value.trim();
      const reminderOptIn = card.querySelector("[data-optin]").checked;
      if (reminderOptIn && !parentEmail) return showError(new Error("Add a parent email before enabling reminders."));
      const details = { name: pupil.name, parentEmail, reminderOptIn,
        nextLessonDate: card.querySelector("[data-lesson-date]").value,
        lessonTime: card.querySelector("[data-lesson-time]").value,
        homeworkList: card.querySelector("[data-homework]").value,
        parentNote: card.querySelector("[data-parent-note]").value };
      try {
        await cloud.savePupil(current.id, details);
        if (pupil.parentLink) { const [s, a] = await parentData(); await publishParent(Object.assign({}, pupil, details), s, a); }
        if (details.nextLessonDate !== (pupil.nextLessonDate || "") || details.lessonTime !== (pupil.lessonTime || "") || details.homeworkList !== (pupil.homeworkList || ""))
          await calendarAfterSave(Object.assign({}, pupil, details));
        drawPupils(body);
      } catch (err) { showError(err); }
    }; });
    // Deleting is for good, so the teacher types the pupil's name to confirm
    async function deletePupil(name, record, button) {
      const typed = prompt(`This permanently deletes everything PopSpell holds about ${name} in ${current.name}: their results, saved progress, plans, lesson notes, parent page and roster details. It can't be undone.\n\nType ${name} to confirm.`);
      if (typed == null) return;
      if (!sameName(typed, name)) return notice("The name didn't match, so nothing was deleted.");
      if (button) button.disabled = true;
      try {
        const n = await cloud.deletePupilRecords(current.id, name, record && record.parentLink);
        // Their lesson comes out of Google Calendar too, while Google's permission lasts
        if (record && calendarPrefs().google) {
          const token = await cloud.calendarToken();
          if (token) await gcalRemove(token, record).catch(() => {});
        }
        await drawPupils(body);
        notice(`🗑️ Deleted everything PopSpell held about ${name} (${plural(n, "result", "results")}).`);
      } catch (err) { if (button) button.disabled = false; showError(err); }
    }
    body.querySelectorAll("[data-delete-pupil]").forEach(b => {
      b.onclick = () => { const r = roster.find(x => x.key === b.dataset.deletePupil); deletePupil(r.name, r, b); };
    });
    // Everyone with results or on the roster, and when they last had a lesson or a result
    $("#checkOld").onclick = async () => {
      const button = $("#checkOld"), out = $("#oldRecords");
      button.disabled = true;
      out.innerHTML = `<div class="empty">Checking every result in ${esc(current.name)}…</div>`;
      try {
        const all = await cloud.sessions(current.id, 3650);
        const yearAgo = Date.now() - 365 * DAY_MS;
        const people = new Map();
        const add = n => {
          const k = String(n || "").trim().toLowerCase();
          if (!people.has(k)) people.set(k, { name: String(n || "").trim(), last: 0, results: 0, record: null });
          return people.get(k);
        };
        roster.forEach(r => {
          const p = add(r.name);
          p.record = r;
          if (r.nextLessonDate) p.last = Math.max(p.last, new Date(`${r.nextLessonDate}T12:00:00`).getTime());
        });
        all.forEach(x => { const p = add(x.pupil); p.results++; p.last = Math.max(p.last, x.at); });
        const rows = [...people.values()].filter(p => p.name).map(p => Object.assign(p, { old: !!p.last && p.last < yearAgo }))
          .sort((a, b) => b.old - a.old || a.last - b.last);
        const old = rows.filter(p => p.old).length;
        out.innerHTML = `<p class="pill${old ? " stuck" : ""}">${old ? `⚠ ${plural(old, "pupil has", "pupils have")} had no lessons or results for over 12 months` : "✓ Nobody's records are over 12 months old"}</p>
          ${rows.length ? `<div class="t-scroll"><table class="t-table old-table"><thead><tr><th>Pupil</th><th>Last lesson or result</th><th>Results</th><th></th></tr></thead><tbody>
          ${rows.map((p, i) => `<tr${p.old ? ` class="old-row"` : ""}><td class="who">${esc(p.name)}${p.record ? "" : ` <span class="meta">(not on the roster)</span>`}</td>
            <td>${p.last ? esc(longDay(p.last)) : "No lessons yet"}${p.old ? " ⚠ over 12 months" : ""}</td><td>${p.results}</td>
            <td><button class="btn small danger" data-old="${i}">🗑️ Delete</button></td></tr>`).join("")}</tbody></table></div>` : ""}`;
        out.querySelectorAll("[data-old]").forEach(b => { b.onclick = () => deletePupil(rows[b.dataset.old].name, rows[b.dataset.old].record, b); });
      } catch (err) { out.innerHTML = ""; showError(err); }
      button.disabled = false;
    };
    // Uses what's on the card now, saved or not
    body.querySelectorAll("[data-calendar]").forEach(b => { b.onclick = () => {
      const card = b.closest(".roster-card");
      const pupil = Object.assign({}, roster.find(r => r.key === b.dataset.calendar), {
        nextLessonDate: card.querySelector("[data-lesson-date]").value, lessonTime: card.querySelector("[data-lesson-time]").value,
        homeworkList: card.querySelector("[data-homework]").value });
      if (!pupil.nextLessonDate) return showError(new Error(`Set ${pupil.name}'s next lesson date first.`));
      calendarDialog([pupil]);
    }; });
    $("#calAll").onclick = () => {
      const due = roster.filter(r => r.nextLessonDate && r.nextLessonDate >= todayKey())
        .sort((a, b) => (a.nextLessonDate + (a.lessonTime || "")).localeCompare(b.nextLessonDate + (b.lessonTime || "")));
      if (!due.length) return showError(new Error("No upcoming lessons yet. Set a next lesson date on a pupil's card and save it."));
      calendarDialog(due, roster);
    };
    body.querySelectorAll("[data-home-copy]").forEach(b => { b.onclick = async () => {
      const pupil = roster.find(r => r.key === b.dataset.homeCopy);
      try { await navigator.clipboard.writeText(homeLink(pupil.name)); b.textContent = "✓ Copied"; }
      catch { b.closest(".add-row").querySelector("input").select(); }
    }; });
    body.querySelectorAll("[data-home-email]").forEach(b => { b.onclick = () => {
      const pupil = roster.find(r => r.key === b.dataset.homeEmail);
      const to = b.closest(".roster-card").querySelector("[data-parent]").value.trim() || pupil.parentEmail || "";
      previewEmail(to, homeLoginEmail(pupil));
    }; });
    body.querySelectorAll("[data-parent-copy]").forEach(b => { b.onclick = async () => {
      const pupil = roster.find(r => r.key === b.dataset.parentCopy);
      try { await navigator.clipboard.writeText(parentURL(pupil.parentLink)); b.textContent = "✓ Copied"; }
      catch { b.closest(".add-row").querySelector("input").select(); }
    }; });
    // Make, update, replace or turn off a pupil's parent page. The note is saved with it.
    body.querySelectorAll("[data-parent]").forEach(b => { b.onclick = async () => {
      const pupil = roster.find(r => r.key === b.dataset.key);
      const action = b.dataset.parent;
      const parentNote = b.closest(".roster-card").querySelector("[data-parent-note]").value;
      if (action === "off" && !confirm(`Turn off ${pupil.name}'s parent page? The link will stop working.`)) return;
      if (action === "new" && !confirm(`Make a new link for ${pupil.name}? The old link will stop working.`)) return;
      b.disabled = true;
      try {
        if (action !== "make" && action !== "update") await cloud.stopParent(current.id, pupil.name, pupil.parentLink);
        if (action !== "off") {
          const withNote = Object.assign({}, pupil, { parentNote }, action === "new" ? { parentLink: "" } : {});
          await cloud.savePupil(current.id, withNote);
          const [s, a] = await parentData();
          await publishParent(withNote, s, a);
        }
        drawPupils(body);
      } catch (err) { b.disabled = false; showError(err); }
    }; });
    body.querySelectorAll("[data-print-homework]").forEach(b => { b.onclick = () => {
      const pupil = roster.find(r => r.key === b.dataset.printHomework);
      printWorksheet(pupil.name, { list: pupil.homeworkList, from: pupil.nextLessonDate || todayKey() }, "mapping");
    }; });
    body.querySelectorAll("[data-email-pupil]").forEach(b => { b.onclick = () => {
      const pupil = roster.find(r => r.key === b.dataset.emailPupil);
      const date = new Date(`${pupil.nextLessonDate}T12:00:00Z`).toLocaleDateString("en-GB",
        { weekday: "long", day: "numeric", month: "long" });
      const list = catalogueList(pupil.homeworkList);
      const name = esc(pupil.name);
      const when = `${date}${pupil.lessonTime ? ` at ${pupil.lessonTime}` : ""}`;
      const subject = `PopSpell lesson tomorrow for ${pupil.name}`;
      const calendar = googleCalendarLink(lessonEvent(pupil, Object.assign(calendarPrefs(), { repeat: "once" }), true));
      const boxes = [...(list ? [`📌 <b>Homework: ${esc(list.title)}</b><br>The sound-mapping worksheet is attached. Please say each word aloud, then ask ${name} to say its sounds and write the matching letters in the boxes.`] : []),
        `📅 <a href="${esc(calendar)}">Add this lesson to Google Calendar</a>`];
      const html = brandedEmail({
        title: `${name}'s lesson is tomorrow`,
        paragraphs: ["Hello,", `A reminder that ${name} has a PopSpell lesson tomorrow, <b>${esc(when)}</b>.`],
        button: { href: homeLink(pupil.name), text: `▶ Practise on PopSpell as ${name}` },
        boxes, sign: esc(shortName(me.name))
      });
      const text = `Hello,\n\nA reminder that ${pupil.name} has a PopSpell lesson tomorrow, ${when}.\n\n`
        + (list ? `Homework: ${list.title}. The sound-mapping worksheet is attached.\n\n` : "")
        + `Practise on PopSpell: ${homeLink(pupil.name)}\n\nAdd this lesson to Google Calendar: ${calendar}\n\nBest wishes,\n${shortName(me.name)}`;
      previewEmail(pupil.parentEmail, { subject, html, text });
    }; });
  }

  /* ---------- Classes ---------- */

  function drawClasses(body) {
    const mine = classes.filter(c => c.teacher === me.uid);
    const others = classes.filter(c => c.teacher !== me.uid);
    const card = c => `
      <article class="pcard t-classcard">
        <h3>${esc(c.name)}</h3>
        ${c.teacher !== me.uid ? `<p class="meta">${esc(c.teacherName)}</p>` : ""}
        <p class="t-code" aria-label="Class code">${esc(c.id)}</p>
        <p class="hint">Open this link once on each pupil's device (or type the code on the home page):</p>
        <div class="add-row"><input type="text" readonly value="${esc(joinLink(c.id))}" class="t-link">
          <button class="btn" data-copy="${esc(c.id)}">📋 Copy</button></div>
        ${c.teacher === me.uid || canAdmin() ? `<div class="add-row"><input type="text" maxlength="60" value="${esc(c.name)}" data-rename-input="${esc(c.id)}">
          <button class="btn" data-rename="${esc(c.id)}">Rename</button></div>
          <label class="check"><input type="checkbox" data-assigned-only="${esc(c.id)}"${c.assignedOnly ? " checked" : ""}>
            Pupils only see the work I set (hide the rest of the library)</label>
          <label class="field">Accent for sounds
            <select data-class-accent="${esc(c.id)}">
              <option value="scottish"${c.accent !== "english" ? " selected" : ""}>Scottish: the r is its own sound (c·a·r, h·e·r)</option>
              <option value="english"${c.accent === "english" ? " selected" : ""}>English: ar, er, ir, or, ur are one sound (c·ar, h·er)</option>
            </select></label>
          <p class="hint">Every pupil device in this class uses it, from the next time PopSpell opens. Pupils can't change it.</p>` : ""}
      </article>`;
    body.innerHTML = `
      <form class="add-row" id="newClass">
        <input type="text" id="className" maxlength="60" placeholder="New class name, e.g. Tuesday 4pm group">
        <button class="btn primary" type="submit">＋ Make class</button>
      </form>
      <h2 class="t-h2">My classes</h2>
      ${mine.length ? `<div class="pupil-grid">${mine.map(card).join("")}</div>` : `<div class="empty">No classes yet — make one above.</div>`}
      ${others.length ? `<h2 class="t-h2">Other teachers' classes</h2><div class="pupil-grid">${others.map(card).join("")}</div>` : ""}`;
    $("#newClass").onsubmit = async e => {
      e.preventDefault();
      const name = $("#className").value.trim();
      if (!name) return $("#className").focus();
      try {
        const id = await cloud.createClass(name);
        classes = await cloud.classes();
        current = classes.find(c => c.id === id);
        try { localStorage.setItem(CLASS_KEY, id); } catch { /* not remembered */ }
        draw();
      } catch (err) { showError(err); }
    };
    body.querySelectorAll("[data-copy]").forEach(b => {
      b.onclick = async () => {
        const link = joinLink(b.dataset.copy);
        try { await navigator.clipboard.writeText(link); b.textContent = "✓ Copied"; } catch { prompt("Copy this link:", link); }
      };
    });
    body.querySelectorAll("[data-assigned-only]").forEach(box => {
      box.onchange = async () => {
        try { await cloud.setAssignedOnly(box.dataset.assignedOnly, box.checked); classes = await cloud.classes(); }
        catch (err) { box.checked = !box.checked; showError(err); }
      };
    });
    body.querySelectorAll("[data-class-accent]").forEach(select => {
      select.onchange = async () => {
        try { await cloud.setAccent(select.dataset.classAccent, select.value); classes = await cloud.classes(); }
        catch (err) { showError(err); drawClasses(body); }
      };
    });
    body.querySelectorAll("[data-rename]").forEach(b => {
      b.onclick = async () => {
        const input = body.querySelector(`[data-rename-input="${b.dataset.rename}"]`);
        try { await cloud.renameClass(b.dataset.rename, input.value); classes = await cloud.classes(); draw(); } catch (err) { showError(err); }
      };
    });
  }

  /* ---------- Teachers (owner and site admins) ---------- */

  async function drawTeachers(body) {
    body.innerHTML = `<div class="empty">Loading…</div>`;
    let list;
    try { list = await cloud.teachers(); } catch (err) { return showError(err); }
    if (tab !== "teachers") return;
    const count = email => classes.filter(c => (c.teacherEmail || "").toLowerCase() === email).length;
    body.innerHTML = `
      <p class="hint">Invite someone by their <b>Google</b> email address. Teachers see their own classes; site admins can manage all classes, plans, results and teachers. Only the owner can grant site admin access.</p>
      <form class="add-row" id="invite">
        <input type="email" id="invEmail" placeholder="tutor@gmail.com" required>
        <input type="text" id="invName" placeholder="Name, e.g. Mrs Green" maxlength="60">
        ${me.role === "owner" ? `<select id="invRole"><option value="teacher">Teacher</option><option value="admin">Site admin</option></select>` : ""}
        <button class="btn primary" type="submit">Invite</button>
      </form>
      <table class="t-table">
        <thead><tr><th>Teacher</th><th>Email</th><th>Classes</th><th></th></tr></thead>
        <tbody>${list.map(t => `
          <tr>
            <td class="who">${esc(t.name)}${t.role !== "teacher" ? ` <span class="t-role">${roleLabel(t.role)}</span>` : ""}</td>
            <td>${esc(t.email)}</td>
            <td>${count(t.email)}</td>
            <td>${t.email !== me.email && t.role !== "owner" && (t.role !== "admin" || me.role === "owner")
              ? `<button class="btn small" data-remove-teacher="${esc(t.email)}">Remove</button>` : ""}</td>
          </tr>`).join("")}</tbody>
      </table>
      <p class="hint">Removing a teacher stops them signing in. Their classes and pupils' results stay, and you can still see them.</p>`;
    $("#invite").onsubmit = async e => {
      e.preventDefault();
      const email = $("#invEmail").value.trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return $("#invEmail").focus();
      const role = $("#invRole") ? $("#invRole").value : "teacher";
      try { await cloud.inviteTeacher(email, $("#invName").value, role); drawTeachers(body); } catch (err) { showError(err); }
    };
    body.querySelectorAll("[data-remove-teacher]").forEach(b => {
      b.onclick = async () => {
        if (!confirm(`Stop ${b.dataset.removeTeacher} signing in as a teacher?`)) return;
        try { await cloud.removeTeacher(b.dataset.removeTeacher); drawTeachers(body); } catch (err) { showError(err); }
      };
    });
  }

  window.PopTeacher = { show };
})();

