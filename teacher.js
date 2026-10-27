/* PopSpell teacher area (#/teacher): Google sign-in, live class, assignments, results,
   class links and, for owners, inviting teachers. Data comes from cloud.js (window.PopCloud). */
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

  const P = () => window.PopSpell;
  const esc = s => P().esc(s == null ? "" : s);
  const $ = sel => root.querySelector(sel);
  const ago = ms => { const m = Math.round(ms / 60000); return m < 1 ? "just now" : m === 1 ? "1 min ago" : m < 60 ? `${m} mins ago` : `${Math.round(m / 60)} h ago`; };
  const day = ms => new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const joinLink = code => `${location.origin}${location.pathname}#/join/${code}`;

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
    if (!classes.length && tab !== "teachers") tab = "classes";
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
    const tabs = [["live", "Live class"], ["assign", "Assignments"], ["pupils", "Pupils"], ["classes", "Classes"]];
    if (me.role === "owner") tabs.push(["teachers", "Teachers"]);
    root.innerHTML = `
      <section class="t-wrap">
        <div class="t-top">
          <div>
            <h1>Hello, ${esc(me.name.split(" ")[0])}${me.role === "owner" ? ` <span class="t-role">Owner</span>` : ""}</h1>
            <p class="meta">${esc(me.email)} · <button class="linklike" id="signOut">Sign out</button></p>
          </div>
          ${classes.length ? `
            <label class="t-class">Class
              <select id="classPick">${classes.map(c => `<option value="${esc(c.id)}"${current && c.id === current.id ? " selected" : ""}>${esc(c.name)}${c.teacher !== me.uid ? ` — ${esc(c.teacherName)}` : ""}</option>`).join("")}</select>
            </label>` : ""}
        </div>
        <nav class="t-tabs" role="tablist">${tabs.map(([k, t]) => `<button class="t-tab" role="tab" data-tab="${k}" aria-selected="${k === tab}">${t}</button>`).join("")}</nav>
        <div class="t-error" id="tError" hidden></div>
        <div id="tBody"></div>
      </section>`;
    $("#signOut").onclick = async () => { stopWatching(); await cloud.signOut(); location.hash = "#/"; };
    root.querySelectorAll(".t-tab").forEach(b => { b.onclick = () => { tab = b.dataset.tab; draw(); }; });
    const pick = $("#classPick");
    if (pick) pick.onchange = () => {
      current = classes.find(c => c.id === pick.value);
      try { localStorage.setItem(CLASS_KEY, current.id); } catch { /* not remembered */ }
      draw();
    };
    const body = $("#tBody");
    const needsClass = ["live", "assign", "pupils"].includes(tab);
    if (needsClass && !current) {
      body.innerHTML = `<div class="empty">Make a class first, in the <b>Classes</b> tab.</div>`;
      return;
    }
    ({ live: drawLive, assign: drawAssign, pupils: drawPupils, classes: drawClasses, teachers: drawTeachers })[tab](body);
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

  function catalogueOptions() {
    const groups = P().STAGES.map(st => `<optgroup label="${esc(st.stage)}">${st.lists.map(l => `<option value="${esc(l.id)}">${esc(l.title)}</option>`).join("")}</optgroup>`);
    return `<option value="">Choose a list…</option>${groups.join("")}`;
  }
  const listTitle = entry => { const r = P().resolveAssigned(entry); return r ? r.title : entry; };

  async function drawAssign(body) {
    body.innerHTML = `<div class="empty">Loading…</div>`;
    let rows;
    try { rows = await cloud.assignments(current.id); } catch (err) { return showError(err); }
    if (tab !== "assign") return;
    const options = catalogueOptions();
    body.innerHTML = `
      <p class="hint">Choose lists for each pupil in <b>${esc(current.name)}</b>. They appear at the top of the pupil's home page as <b>"📌 Your lists today"</b>.
        A row called <b>Everyone</b> is shown to every pupil in the class. Type names exactly as pupils type them.</p>
      <table class="t-table">
        <thead><tr><th>Pupil</th><th>Lists</th><th>Add a list</th></tr></thead>
        <tbody>${rows.length ? rows.map((a, i) => `
          <tr>
            <td class="who">${esc(a.who)}</td>
            <td><div class="chips">${a.lists.map((l, j) => `<span class="t-chip">${esc(listTitle(l))}<button title="Remove" data-row="${i}" data-remove="${j}">×</button></span>`).join("") || "<i>none</i>"}</div></td>
            <td><select data-add="${i}">${options}</select></td>
          </tr>`).join("") : `<tr><td colspan="3" class="empty">No assignments yet. Add a pupil below.</td></tr>`}</tbody>
      </table>
      <form class="add-row" id="addForm">
        <input type="text" id="newWho" placeholder="Pupil's first name (or Everyone)" maxlength="30">
        <select id="newList">${options}</select>
        <input type="text" id="newLink" placeholder="…or paste a Make a list link">
        <button class="btn primary" type="submit">Add</button>
      </form>`;
    const save = async (who, lists) => {
      try { await cloud.saveAssignment(current.id, who, lists); drawAssign(body); } catch (err) { showError(err); }
    };
    body.querySelectorAll("[data-remove]").forEach(b => {
      b.onclick = () => { const a = rows[b.dataset.row]; save(a.who, a.lists.filter((_, j) => j !== Number(b.dataset.remove))); };
    });
    body.querySelectorAll("[data-add]").forEach(s => {
      s.onchange = () => { const a = rows[s.dataset.add]; if (s.value && !a.lists.includes(s.value)) save(a.who, a.lists.concat(s.value)); };
    });
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

  /* ---------- Pupils' results ---------- */

  function summarise(sessions) {
    const pupils = {};
    sessions.forEach(s => {
      const key = String(s.pupil || "").trim().toLowerCase();
      const p = pupils[key] = pupils[key] || { pupil: String(s.pupil || "").trim(), lists: 0, words: 0, right: 0, firstGo: 0, last: 0, recent: [], sounds: {} };
      const words = s.words || [];
      p.lists++;
      p.words += words.length;
      p.right += words.filter(w => w.correct).length;
      const first = words.filter(w => w.correct && w.triesUsed === 1).length;
      p.firstGo += first;
      p.last = Math.max(p.last, s.at);
      if (p.recent.length < 4) p.recent.push({ at: s.at, list: s.list, score: `${first}/${words.length}` });
      words.forEach(w => (w.missed || []).forEach(m => { p.sounds[m] = (p.sounds[m] || 0) + 1; }));
    });
    return Object.values(pupils).map(p => Object.assign(p, {
      topSounds: Object.entries(p.sounds).sort((a, b) => b[1] - a[1]).slice(0, 6)
    })).sort((a, b) => a.pupil.localeCompare(b.pupil));
  }

  function downloadCSV(sessions) {
    const cell = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const lines = [["Date", "Time", "Pupil", "List", "Word", "Sounds", "Result", "Wrong tries", "Sounds missed"].map(cell).join(",")];
    sessions.slice().reverse().forEach(s => (s.words || []).forEach(w => {
      const d = new Date(s.at);
      const result = (w.challenge ? "New word: " : "") + (w.correct ? (w.triesUsed === 1 ? "Right first time" : `Right on try ${w.triesUsed}`) : "Missed");
      lines.push([d.toLocaleDateString("en-GB"), d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), s.pupil, s.list, w.word, w.sounds, result,
        (w.wrong || []).join(" "), (w.missed || []).join(" ")].map(cell).join(","));
    }));
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `popspell-${current.name.replace(/[^\w]+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  let days = 30;
  const PERIODS = [[7, "Last 7 days"], [30, "Last 30 days"], [91, "Last 3 months (a term)"], [365, "Last year"], [3650, "Everything"]];

  async function drawPupils(body) {
    body.innerHTML = `<div class="empty">Loading…</div>`;
    let sessions;
    try { sessions = await cloud.sessions(current.id, days); } catch (err) { return showError(err); }
    if (tab !== "pupils") return;
    const pupils = summarise(sessions);
    body.innerHTML = `
      <div class="row t-row">
        <label class="t-class">Show <select id="days">${PERIODS.map(([d, t]) => `<option value="${d}"${d === days ? " selected" : ""}>${t}</option>`).join("")}</select></label>
        <p class="hint">${esc(current.name)}: ${sessions.length} lists done by ${pupils.length} pupils.</p>
        ${sessions.length ? `<button class="btn" id="csv">⬇ Download every word (spreadsheet)</button>` : ""}</div>
      ${pupils.length ? `<div class="pupil-grid">${pupils.map(p => `
        <article class="pcard">
          <h3>${esc(p.pupil)}</h3>
          <p class="meta">${p.lists} lists · ${p.right}/${p.words} words right · ${p.firstGo} first time · last ${day(p.last)}</p>
          ${p.topSounds.length ? `<div><b>Sounds to work on</b><br>${p.topSounds.map(([s, n]) => `<span class="sound-chip">${esc(s)} ×${n}</span>`).join("")}</div>` : `<div>No missed sounds 🎉</div>`}
          <ul class="recent">${p.recent.map(r => `<li>${day(r.at)} · ${esc(r.list)} · ${esc(r.score)} first time</li>`).join("")}</ul>
        </article>`).join("")}</div>` : `<div class="empty">No results yet. Each pupil appears here after finishing (or stopping) a list.</div>`}`;
    if ($("#csv")) $("#csv").onclick = () => downloadCSV(sessions);
    $("#days").onchange = e => { days = Number(e.target.value); drawPupils(body); };
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
        ${c.teacher === me.uid || me.role === "owner" ? `<div class="add-row"><input type="text" maxlength="60" value="${esc(c.name)}" data-rename-input="${esc(c.id)}">
          <button class="btn" data-rename="${esc(c.id)}">Rename</button></div>` : ""}
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
    body.querySelectorAll("[data-rename]").forEach(b => {
      b.onclick = async () => {
        const input = body.querySelector(`[data-rename-input="${b.dataset.rename}"]`);
        try { await cloud.renameClass(b.dataset.rename, input.value); classes = await cloud.classes(); draw(); } catch (err) { showError(err); }
      };
    });
  }

  /* ---------- Teachers (owners only) ---------- */

  async function drawTeachers(body) {
    body.innerHTML = `<div class="empty">Loading…</div>`;
    let list;
    try { list = await cloud.teachers(); } catch (err) { return showError(err); }
    if (tab !== "teachers") return;
    const count = email => classes.filter(c => (c.teacherEmail || "").toLowerCase() === email).length;
    body.innerHTML = `
      <p class="hint">Invite a tutor by their <b>Google</b> email address (Gmail or a Google Workspace account). They can then sign in on this site with 👩‍🏫 Teacher.</p>
      <form class="add-row" id="invite">
        <input type="email" id="invEmail" placeholder="tutor@gmail.com" required>
        <input type="text" id="invName" placeholder="Name, e.g. Mrs Green" maxlength="60">
        <button class="btn primary" type="submit">Invite</button>
      </form>
      <table class="t-table">
        <thead><tr><th>Teacher</th><th>Email</th><th>Classes</th><th></th></tr></thead>
        <tbody>${list.map(t => `
          <tr>
            <td class="who">${esc(t.name)}${t.role === "owner" ? ` <span class="t-role">Owner</span>` : ""}</td>
            <td>${esc(t.email)}</td>
            <td>${count(t.email)}</td>
            <td>${t.email !== me.email ? `<button class="btn small" data-remove-teacher="${esc(t.email)}">Remove</button>` : ""}</td>
          </tr>`).join("")}</tbody>
      </table>
      <p class="hint">Removing a teacher stops them signing in. Their classes and pupils' results stay, and you can still see them.</p>`;
    $("#invite").onsubmit = async e => {
      e.preventDefault();
      const email = $("#invEmail").value.trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return $("#invEmail").focus();
      try { await cloud.inviteTeacher(email, $("#invName").value); drawTeachers(body); } catch (err) { showError(err); }
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
