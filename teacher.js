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
    const tabs = [["library", "📚", "Library"], ["live", "🟢", "Live"], ["next", "🧭", "Next steps"], ["assign", "📌", "Assign"],
      ["plans", "🗓️", "Plans & sheets"], ["diary", "📝", "Diary"], ["pupils", "👧", "Pupils"], ["classes", "🏫", "Classes"]];
    if (canAdmin()) tabs.push(["teachers", "👩‍🏫", "Teachers"]);
    root.innerHTML = `
      <section class="t-wrap">
        <div class="t-top">
          <img class="t-pip" src="assets/brand/pip-mascot-small.webp" alt="" width="64" height="64">
          <div class="t-hello">
            <h1>Hello, ${esc(shortName(me.name))}${canAdmin() ? ` <span class="t-role">${roleLabel(me.role)}</span>` : ""}</h1>
            <p class="meta">${esc(me.email)} · <button class="linklike" id="signOut">Sign out</button></p>
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
    const needsClass = ["live", "next", "assign", "plans", "diary", "pupils"].includes(tab);
    if (needsClass && !current) {
      body.innerHTML = `<div class="empty">Make a class first, in the <b>Classes</b> tab.</div>`;
      return;
    }
    ({ library: drawLibrary, live: drawLive, next: drawNext, assign: drawAssign, plans: drawPlans, diary: drawDiary, pupils: drawPupils,
      classes: drawClasses, teachers: drawTeachers })[tab](body);
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
  function catalogueOptions() {
    const checks = Object.values(P().CHECKS).filter(c => c.id === "check-spelling" || window.PopActivities);
    const groups = [];
    const A = window.PopActivities;
    const gameArea = A && A.AREAS.find(area => area.id === "games");
    if (gameArea) groups.push(`<optgroup label="${gameArea.icon} ${esc(gameArea.title)}">${gameArea.activities
      .map(a => `<option value="${esc(a.id)}">${esc(a.title)} (${esc(a.level)})</option>`).join("")}</optgroup>`);
    groups.push(`<optgroup label="🧭 Starting checks"><option value="assess">🌟 Pip's Sound Quest (full assessment)</option>${checks.map(c => `<option value="${esc(c.id)}">${esc(c.title)}</option>`).join("")}</optgroup>`);
    P().STAGES.forEach(st => groups.push(`<optgroup label="${esc(st.stage)}">${st.lists.map(l => `<option value="${esc(l.id)}">${esc(l.title)}</option>`).join("")}</optgroup>`));
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

  // Entries in the order they come, one section per group name
  const groupsOf = entries => entries.reduce((groups, e) => {
    const g = groups.find(x => x.name === e.group) || (groups.push({ name: e.group, items: [] }), groups[groups.length - 1]);
    g.items.push(e);
    return groups;
  }, []);

  function drawLibrary(body) {
    const spelling = P().STAGES.flatMap(stage => stage.lists.map(item => {
      const list = catalogueList(item.id);
      return { id: item.id, title: list.title, group: stage.stage, kind: "spelling",
        detail: list.tip || `${list.items.length} words to hear, segment and spell`, list };
    }));
    const checks = Object.values(P().CHECKS).filter(c => c.id === "check-spelling" || window.PopActivities)
      .map(c => ({ id: c.id, title: c.title, group: "Starting checks", kind: "check", detail: c.blurb }));
    const activities = (window.PopActivities?.AREAS || []).flatMap(area => area.activities.map(act => ({
      id: act.id, title: act.title, group: `${area.icon} ${area.title}`, level: act.level,
      kind: area.id === "games" ? "game" : "online", detail: act.blurb || act.organiser
    })));
    const dictation = spelling.map(item => ({ id: `dictate:${item.id}`, title: `Dictation: ${item.title}`,
      group: "Sentence dictation", kind: "dictation", detail: "Listen to the sentence, then write it." }));
    const entries = checks.concat(spelling, activities, dictation, [{ id: "letter-formation",
      title: "Letter formation (a–z)", group: "Paper practice", kind: "paper",
      detail: "Trace and write every lower-case letter on four-line ruling." }]);
    body.innerHTML = `<div class="work-flow">
      <h2>Explore all work</h2>
      <p class="hint">Browse and test lessons before choosing a class or pupil. Test runs do not save pupil results.</p>
      <div class="add-row"><input id="librarySearch" type="search" placeholder="Search words, sounds or skills" aria-label="Search work">
        <select id="libraryKind" aria-label="Type of work"><option value="">All work</option>
          <option value="spelling">Spelling lists</option><option value="check">Starting checks</option>
          <option value="game">Games</option><option value="online">Other online work</option>
          <option value="dictation">Sentence dictation</option><option value="paper">Paper practice</option></select></div>
      <p class="hint" id="libraryCount"></p></div>
      ${groupsOf(entries).map(g => `<details class="lib-group">
        <summary><span>${esc(g.name)}</span><span class="lib-count" data-count>${g.items.length}</span></summary>
        <div class="library-grid">${g.items.map(entry => `<article class="pcard library-card"
        data-kind="${entry.kind}" data-search="${esc(`${entry.title} ${entry.group} ${entry.level || ""} ${entry.detail}`.toLowerCase())}">
        <p class="meta">${esc(entry.level ? `${entry.level} level` : entry.group)}</p><h3>${esc(entry.title)}</h3>
        <p>${esc(entry.detail)}</p>
        ${entry.list ? `<details><summary>See ${entry.list.items.length} words and their sound maps</summary>
          <ul class="wordlist">${entry.list.items.map(item => `<li class="mini-word">${P().wordHTML(item)}</li>`).join("")}</ul></details>` : ""}
        <div class="row">${entry.kind === "paper" ? "" : `<a class="btn small" href="${esc(previewHref(entry.id))}" target="_blank" rel="noopener">▶ Test online</a>`}
          ${entry.list || entry.kind === "paper" ? `<button class="btn small" type="button" data-library-sheet="${esc(entry.id)}">👀 Preview paper sheet</button>` : ""}</div>
      </article>`).join("")}</div></details>`).join("")}`;
    // Sections start closed; a search or a type of work opens every section with a match
    const filter = () => {
      const query = $("#librarySearch").value.trim().toLowerCase();
      const kind = $("#libraryKind").value;
      let shown = 0;
      body.querySelectorAll(".lib-group").forEach(group => {
        let inGroup = 0;
        group.querySelectorAll(".library-card").forEach(card => {
          card.hidden = !!((kind && card.dataset.kind !== kind) || (query && !card.dataset.search.includes(query)));
          if (!card.hidden) inGroup++;
        });
        shown += inGroup;
        group.hidden = inGroup === 0;
        group.querySelector("[data-count]").textContent = inGroup;
        if (query || kind) group.open = true;
      });
      $("#libraryCount").textContent = query || kind ? `${shown} of ${entries.length} shown` : `${entries.length} pieces of work in ${body.querySelectorAll(".lib-group").length} sections. Open a section, or search.`;
    };
    $("#librarySearch").oninput = filter;
    $("#libraryKind").onchange = filter;
    body.querySelectorAll("[data-library-sheet]").forEach(button => {
      button.onclick = () => previewWorksheet("", { list: button.dataset.librarySheet, from: todayKey() }, "mapping");
    });
    filter();
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

  // Length and repeat, then Google (one lesson) or a file (one or many). Remembers the choices.
  function calendarDialog(pupils) {
    const single = pupils.length === 1;
    const prefs = calendarPrefs();
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview cal-dialog";
    const when = r => `${new Date(`${r.nextLessonDate}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}${r.lessonTime ? ` at ${r.lessonTime}` : " (all day: no time set)"}`;
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>📅 Add ${single ? `${esc(pupils[0].name)}'s lesson` : `${pupils.length} lessons`} to a calendar</h2>
        <button class="btn small" type="button" data-close>Close</button></div>
      <ul class="cal-list">${pupils.map(r => `<li><b>${esc(r.name)}</b> · ${esc(when(r))}</li>`).join("")}</ul>
      <div class="cal-options">
        <label>Lesson length <select data-length>${LESSON_LENGTHS.map(n => `<option value="${n}"${n === Number(prefs.length) ? " selected" : ""}>${n} minutes</option>`).join("")}</select></label>
        <label>Repeat <select data-repeat><option value="once">Just this lesson</option>
          <option value="weekly"${prefs.repeat === "weekly" ? " selected" : ""}>Every week until the summer holidays</option></select></label>
      </div>
      <div class="row cal-actions">
        ${single ? `<a class="btn primary" data-google target="_blank" rel="noopener">Google Calendar</a>` : ""}
        <button class="btn${single ? "" : " primary"}" type="button" data-ics>⬇ ${single ? "Outlook or Apple Calendar (.ics)" : "Download all lessons (.ics)"}</button>
      </div>
      <p class="hint">${single ? "Google opens the event ready to save. The .ics file opens in Outlook or Apple Calendar." :
        "Open the file to add every lesson to Outlook or Apple Calendar. In Google Calendar, use Settings → Import and choose the file."}
        If a lesson date changes, add it again: the calendar moves the lesson instead of adding a second one.</p>`;
    document.body.append(dialog);
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    const opts = () => ({ length: Number(dialog.querySelector("[data-length]").value), repeat: dialog.querySelector("[data-repeat]").value });
    const refresh = () => {
      saveCalendarPrefs(opts());
      if (single) dialog.querySelector("[data-google]").href = googleCalendarLink(lessonEvent(pupils[0], opts()));
    };
    dialog.querySelectorAll("select").forEach(s => { s.onchange = refresh; });
    dialog.querySelector("[data-ics]").onclick = () =>
      downloadICS(pupils.map(r => lessonEvent(r, opts())), single ? `popspell-lesson-${pupils[0].name}` : `popspell-lessons-${current.name}`);
    refresh();
    dialog.showModal();
  }

  // Puts a sheet on the page just for printing (or saving as PDF), then removes it
  function printSheet(className, html) {
    const sheet = document.createElement("section");
    sheet.className = `worksheet-print ${className}`;
    sheet.innerHTML = html;
    document.body.append(sheet);
    document.body.classList.add("printing-worksheet");
    const clean = () => { sheet.remove(); document.body.classList.remove("printing-worksheet"); };
    window.addEventListener("afterprint", clean, { once: true });
    window.print();
  }

  // One handwriting row on four-line ruling: model, grey to trace, dotted to trace, then space to write.
  // Lines follow the letter shapes: top of tall letters, middle (x-height), baseline, and tails.
  function handwritingRow(text, cells = ["model", "grey", "dots", "blank"]) {
    const width = 1000 / cells.length;
    const size = Math.min(62, (width - 26) / (Math.max(text.length, 2) * 0.56));
    const base = 78, mid = base - size * 0.5, top = base - size * 0.74, tail = base + size * 0.26;
    const line = (y, style) => `<line x1="0" x2="1000" y1="${y}" y2="${y}" class="${style}"/>`;
    const word = (x, kind) => kind === "blank" ? "" :
      `<text x="${x + 12}" y="${base}" font-size="${size}" class="ws-${kind}">${esc(text)}</text>`;
    return `<svg class="ws-row" viewBox="0 0 1000 108" role="img" aria-label="${esc(text)}">
      ${line(top, "ws-top")}${line(mid, "ws-mid")}${line(base, "ws-base")}${line(tail, "ws-tail")}
      ${cells.map((kind, i) => (i ? `<line x1="${i * width}" x2="${i * width}" y1="${top - 6}" y2="${tail + 4}" class="ws-sep"/>` : "") + word(i * width, kind)).join("")}
    </svg>`;
  }
  const dotPattern = `<svg width="0" height="0" style="position:absolute"><defs>
    <pattern id="wsDots" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.6" r="0.95" fill="#555"/></pattern></defs></svg>`;
  const sheetHead = (title, who, extra = "") => `<h1>PopSpell · ${esc(title)}</h1>
    <p><b>Name:</b> ${esc(!who || who === "Everyone" ? "____________________" : who)} &nbsp; <b>Date:</b> ____________ ${extra}</p>`;

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
    const html = `<h1>PopSpell · ${esc(list.title)}${mode === "key" ? " · teacher key" : ""}</h1>
      <p><b>Pupil:</b> ${esc(!who || who === "Everyone" ? "____________________" : who)}
        ${current ? `&nbsp; <b>Class:</b> ${esc(current.name)}` : ""} &nbsp; <b>Date:</b> ${esc(plan.from)}</p>
      <p>${mode === "key" ? "Read each word aloud. One box represents one sound; the letters shown are the matching grapheme." :
        mode === "dictation" ? "Listen, say the sounds, then write the word your teacher or adult says." :
        "Listen to the word. Say it, stretch it, tap one box for each sound, then write the letters for each sound in its box."}</p>
      ${list.tip ? `<p><b>Sound focus:</b> ${esc(list.tip)}</p>` : ""}
      <table><thead><tr><th>#</th><th>${mode === "key" ? "Word" : mode === "dictation" ? "Write the word" : "Map each sound to letters"}</th>
        <th>${mode === "key" ? "Sound map" : "Check"}</th></tr></thead><tbody>${lines}</tbody></table>`;
    return { className: "", html };
  }

  function printWorksheet(who, plan, mode) {
    const sheet = worksheetSpec(who, plan, mode);
    if (!sheet) return showError(new Error("Worksheets are available for built-in spelling lists."));
    printSheet(sheet.className, sheet.html);
  }

  function previewWorksheet(who, plan, mode) {
    if (!worksheetSpec(who, plan, mode)) return showError(new Error("Worksheets are available for built-in spelling lists. Test this activity online instead."));
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>Worksheet preview</h2>
      ${plan.list === "letter-formation" ? "" : `<label>Sheet type <select data-mode><option value="mapping">Sound mapping</option><option value="dictation">Dictation</option>
        <option value="handwriting">Handwriting</option><option value="sentences">Sentences</option><option value="key">Teacher key</option></select></label>`}
      <button class="btn small" type="button" data-close>Close</button>
      <button class="btn small primary" type="button" data-print>Print / Save PDF</button></div>
      <section class="sheet-preview-page"></section>`;
    document.body.append(dialog);
    const picker = dialog.querySelector("[data-mode]");
    if (picker) picker.value = mode;
    const render = () => {
      const sheet = worksheetSpec(who, plan, picker ? picker.value : mode);
      const page = dialog.querySelector(".sheet-preview-page");
      page.className = `sheet-preview-page ${sheet.className}`;
      page.innerHTML = sheet.html;
    };
    if (picker) picker.onchange = render;
    render();
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.querySelector("[data-print]").onclick = () => {
      const sheet = worksheetSpec(who, plan, picker ? picker.value : mode);
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
    const spellingOptions = P().STAGES.map(st => `<optgroup label="${esc(st.stage)}">${st.lists.map(l => `<option value="${esc(l.id)}">${esc(l.title)}</option>`).join("")}</optgroup>`).join("");
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
            <option value="handwriting">Handwriting</option><option value="sentences">Sentences</option><option value="key">Teacher key</option></select></label>
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
            <button class="btn small" data-print-key="${rowIndex}-${planIndex}">Print teacher key</button>
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
          drawNext(body);
        } catch (err) { showError(err); }
      };
    });
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
        worksheets: 0, words: 0, right: 0, firstGo: 0, last: 0, recent: [], sounds: {}, lastSwitch: null };
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
      words.forEach(w => (w.missed || []).forEach(m => { p.sounds[m] = (p.sounds[m] || 0) + 1; }));
    });
    return Object.values(pupils).map(p => Object.assign(p, {
      topSounds: Object.entries(p.sounds).sort((a, b) => b[1] - a[1]).slice(0, 6)
    })).sort((a, b) => a.pupil.localeCompare(b.pupil));
  }

  function downloadCSV(sessions) {
    const cell = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const lines = [["Date", "Time", "Pupil", "List", "Source", "Word", "Sounds", "Result", "Wrong tries", "Sounds missed", "Seconds"].map(cell).join(",")];
    sessions.slice().reverse().forEach(s => (s.words || []).forEach(w => {
      const d = new Date(s.at);
      const result = (w.challenge ? "New word: " : "") + (w.correct ? (w.triesUsed === 1 ? "Right first time" : `Right on try ${w.triesUsed}`) : "Missed");
      lines.push([d.toLocaleDateString("en-GB"), d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), s.pupil, s.list,
        s.source === "worksheet" ? "Worksheet" : "Online", w.word, w.sounds, result,
        (w.wrong || []).join(" "), (w.missed || []).join(" "), w.seconds ?? ""].map(cell).join(","));
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

  function cfeRows(sessions, pupilName) {
    const A = window.PopActivities;
    const rows = {};
    // Starting checks deliberately go past what a pupil can do, so they'd drag the status down
    sessions.filter(s => !P().isAssessment(s.listId))
      .filter(s => !pupilName || String(s.pupil || "").trim().toLowerCase() === pupilName.toLowerCase()).forEach(s => {
      const tag = (A && A.tag(s.listId)) || { organiser: "Other work", level: "" };
      const r = rows[tag.organiser] = rows[tag.organiser] || { organiser: tag.organiser, levels: new Set(), work: new Set(), items: 0, first: 0, days: new Set(), skills: {} };
      if (tag.level) r.levels.add(tag.level);
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
      levelText: levelOrder.filter(l => r.levels.has(l)).join(", "),
      topSkills: Object.entries(r.skills).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s]) => s)
    })).sort((a, b) => a.organiser.localeCompare(b.organiser));
  }

  function printReport(pupilName, sessions) {
    const rows = cfeRows(sessions, pupilName);
    const period = (PERIODS.find(([d]) => d === days) || [0, ""])[1];
    printSheet("ws-report", `<h1>PopSpell progress report</h1>
      <p><b>Pupil:</b> ${esc(pupilName)} &nbsp; <b>Class:</b> ${esc(current.name)} &nbsp; <b>Period:</b> ${esc(period)} &nbsp; <b>Printed:</b> ${esc(new Date().toLocaleDateString("en-GB"))}</p>
      <p>Grouped by Curriculum for Excellence organiser. “Right first time” counts questions answered correctly without help.
        Secure means 85% or more right first time, on at least 10 questions over two or more days.</p>
      <table><thead><tr><th>Organiser</th><th>Level</th><th>Work done</th><th>Questions</th><th>Right first time</th><th>Status</th><th>To work on</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td>${esc(r.organiser)}</td><td>${esc(r.levelText)}</td><td>${esc([...r.work].slice(0, 6).join(", "))}${r.work.size > 6 ? "…" : ""}</td>
        <td>${r.items}</td><td>${r.pct}%</td><td><b>${esc(r.status.text)}</b></td><td>${esc(r.topSkills.join(", ") || "—")}</td></tr>`).join("")
        || `<tr><td colspan="7">No work recorded in this period.</td></tr>`}</tbody></table>
      <p><b>Teacher's comment:</b></p><p class="ws-comment"></p>`);
  }

  /* ---------- New pupil: profile, Pip's Sound Quest, and the starting assessment report ---------- */

  const YEAR_GROUPS = ["Nursery", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "S1", "S2", "S3"];
  const NEED_CHIPS = ["Dyslexia (or suspected)", "English as an additional language", "ADHD", "Speech and language", "Hearing", "Sight", "Anxious about learning", "Needs short tasks"];
  // The quest's link: joins the class, signs the device in as the child, and opens the quest
  const assessLink = name => `${homeLink(name)}&then=assess`;
  const stageOf = listId => P().STAGES.findIndex(st => st.lists.some(l => l.id === listId));
  const levelOfStage = i => (i <= 1 ? "Early" : i <= 4 ? "First" : "Second"); // as the lists' CfE labels
  const LEVEL_ORDER = ["Early", "First", "Second"];

  // The latest go at each island, from the results the teacher already has
  function questSessions(name, sessions) {
    const mine = sessions.filter(s => sameName(s.pupil, name)).sort((a, b) => b.at - a.at);
    return Object.fromEntries(P().QUEST.map(isl => [isl.key, mine.find(s => s.listId === isl.id) || null]));
  }

  // What each island shows: a CfE level (where it can say), a plain-English finding, and a next step
  function questFindings(found) {
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
      out.listen = { area: "Listening for sounds (phonological awareness)", level: "Early", status: status(pct(right, words.length)),
        detail: Object.entries(by).map(([k, [r, n]]) => `${name[k] || k} ${r} of ${n}`).join(" · "),
        next: pct(right, words.length) >= 80 ? "Secure: no extra sound games needed." : "Short daily sound games: rhyme, first sounds and tapping out sounds." };
    }
    // Reading and spelling are placed on the phonics stages: secure up to the stage before the first gap
    const phonics = (s, area, verb) => {
      if (!s) return null;
      const gaps = P().checkGaps(s.words || []);
      if (!gaps.length) return { area, level: "Second", status: "Secure", gap: null,
        detail: `${verb} every stage tested, through Stage 6 (endings and tricky words).`, next: "Move on to Second-level spelling rules and longer texts." };
      const g = stageOf(gaps[0]);
      const st = P().STAGES[g];
      return { area, level: levelOfStage(g), status: g === 0 ? "Needs support" : "Developing", gap: gaps[0],
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
      out.story = { area: "Reading: understanding a story", level, status: status(pct(right, words.length)),
        detail: `${story ? `"${story.title}"` : "A story"} read alone: ${right} of ${words.length} questions right.`,
        next: pct(right, words.length) >= 80 ? "Understanding is secure at this level: build up to longer texts." : "Talk about stories together: who, where, what happened, and why." };
    }
    if (found.numbers) {
      const gaps = P().checkGaps(found.numbers.words || []);
      const act = gaps.length && A ? A.get(gaps[0]) : null;
      out.numbers = { area: "Numeracy: number and number processes", level: act ? act.level : "Second", status: act ? (act.level === "Early" ? "Needs support" : "Developing") : "Secure",
        detail: act ? `Starts to find it tricky at ${act.title} (${act.level} level)${gaps.length > 1 ? `; also ${gaps.slice(1, 3).map(id => (A.get(id) || {}).title || id).join(", ")}` : ""}.` : "Answered every number question tested, through Second level.",
        next: act ? `Start number practice at ${act.title}.` : "Move on to Second-level measurement, fractions and data." };
    }
    return out;
  }

  function assessmentReport(pupil, sessions) {
    const found = questSessions(pupil.name, sessions);
    const f = questFindings(found);
    const rows = ["listen", "read", "story", "spell", "numbers"].filter(k => f[k]);
    const dates = Object.values(found).filter(Boolean).map(s => s.at);
    const lower = (...ls) => ls.filter(Boolean).sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b))[0];
    const literacy = lower(f.read && f.read.level, f.spell && f.spell.level);
    const badge = s => `<span class="ar-status ar-${s.toLowerCase().replace(/\s+/g, "-")}">${esc(s)}</span>`;
    const strengths = rows.filter(k => f[k].status === "Secure").map(k => f[k].area);
    return `<div class="ar">
      <div class="ar-head"><img src="assets/brand/wordmark.png" alt="PopSpell" width="96">
        <div><h1>Starting assessment</h1><p class="ar-sub">Pip's Sound Quest · ${esc(current.name)}</p></div>
        <img src="assets/brand/pip-mascot.png" alt="" width="70"></div>
      <table class="ar-facts"><tr><th>Pupil</th><td>${esc(pupil.name)}</td><th>Year group</th><td>${esc(pupil.yearGroup || "—")}</td></tr>
        <tr><th>Assessed</th><td>${dates.length ? esc([...new Set(dates.sort().map(day))].join(", ")) : "—"}</td><th>Teacher</th><td>${esc(current.teacherName || me.name || "")}</td></tr></table>
      ${literacy || f.numbers ? `<div class="ar-summary">
        ${literacy ? `<div><span>Literacy</span><b>Working within ${esc(literacy)} level</b></div>` : ""}
        ${f.numbers ? `<div><span>Numeracy</span><b>Working within ${esc(f.numbers.level)} level</b></div>` : ""}
      </div>` : ""}
      <h2>What we found</h2>
      ${rows.length ? `<table class="ar-table"><thead><tr><th>Area</th><th>CfE level</th><th>Status</th><th>What we found</th><th>Next step</th></tr></thead><tbody>
        ${rows.map(k => `<tr><td><b>${esc(f[k].area)}</b></td><td>${esc(f[k].level || "—")}</td><td>${badge(f[k].status)}</td><td>${esc(f[k].detail)}</td><td>${esc(f[k].next)}</td></tr>`).join("")}
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
      <p class="ar-note"><b>About this assessment.</b> Pip's Sound Quest is a short, adaptive check played as a game. Each part stops as soon as the work becomes too hard, so the child is never left struggling, and it shows a starting point rather than everything they can do. CfE levels are indicative: they should be confirmed by the teacher's own judgement against the Curriculum for Excellence benchmarks.</p>
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

  /* ---------- Parents' night: a year of progress, trends, and what's changed since the last report ---------- */

  const DAY_MS = 864e5;
  const longDay = ms => new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  // Scottish school years start in August
  const schoolYearStart = (now = new Date()) => new Date(now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1, 7, 1).getTime();
  const REPORT_PERIODS = [["year", "This school year (since 1 August)"], ["last", "Since the last parents' night report"],
    ["12m", "The last 12 months"], ["date", "Since a date I choose"]];
  let reportPeriod = "year", reportDate = "";
  const lastReportOf = r => Math.max(0, ...((r && r.reports) || []));
  function reportFrom(r) {
    if (reportPeriod === "12m") return Date.now() - 365 * DAY_MS;
    if (reportPeriod === "date" && reportDate) return new Date(`${reportDate}T00:00:00`).getTime();
    if (reportPeriod === "last" && lastReportOf(r)) return lastReportOf(r);
    return schoolYearStart();
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
  const QUEST_ORGANISER = {
    listen: o => o.startsWith("Literacy · Listening"), read: o => o.startsWith("Literacy · Reading"),
    story: o => o.startsWith("Literacy · Reading"), spell: o => o.includes("(spelling)"),
    numbers: o => o === "Numeracy · Number and number processes"
  };

  // Everything the report says, worked out from the pupil's results. "Now" means the last 8 weeks.
  function yearProgress(name, sessions, from, to, lastReport) {
    const A = window.PopActivities;
    const all = sessions.filter(s => sameName(s.pupil, name) && !P().isAssessment(s.listId)).sort((a, b) => a.at - b.at);
    const mine = all.filter(s => s.at >= from && s.at <= to);
    const recentCut = Math.max(from, to - 56 * DAY_MS);
    const recent = mine.filter(s => s.at > recentCut);
    const organiserOf = s => ((A && A.tag(s.listId)) || { organiser: "Other work" }).organiser;

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

    const nowRows = cfeRows(recent, name);
    const areas = cfeRows(mine, name).map(row => {
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
    const y = yearProgress(pupil.name, sessions, from, to, last);
    const start = questFindings(questSessions(pupil.name, assessments));
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
      const now = y.areas.filter(a => QUEST_ORGANISER[k](a.organiser)).sort((a, b) => b.items - a.items)[0];
      const stage = (k === "spell" || k === "read") && y.stageNow >= 0 ? `Now practising ${P().STAGES[y.stageNow].stage}. ` : "";
      return `<tr><td><b>${esc(start[k].area)}</b></td><td>${statusBadge(start[k].status)} <span class="meta">${esc(start[k].level || "")}</span><br>${esc(start[k].detail)}</td>
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
        <table class="ar-table"><thead><tr><th>Area</th><th>CfE level</th><th>Questions</th><th>Trend over the period</th><th>Now</th><th>To work on</th></tr></thead><tbody>
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
        CfE levels are indicative and should be confirmed by the teacher's own judgement against the benchmarks.</p>
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
          <label>Year group <select id="flowYear"><option value="">Choose…</option>${YEAR_GROUPS.map(y => `<option${r && r.yearGroup === y ? " selected" : ""}>${y}</option>`).join("")}</select></label>
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
      const f = questFindings(questSessions(r.name, sessions));
      const keys = Object.keys(f).filter(k => f[k]);
      frame(`${keys.length ? `<ul class="flow-findings">${keys.map(k => `<li><b>${esc(f[k].area)}</b> · ${f[k].level ? `${esc(f[k].level)} level · ` : ""}${esc(f[k].status)}<br><span class="meta">${esc(f[k].detail)}</span></li>`).join("")}</ul>`
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
      cfe: cfeRows(sessions, name).filter(x => x.status.key !== "none")
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
            <button class="btn small" data-pn="${esc(r.name)}">📅 Parents' night report</button></div></div>
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
          ${r.homeworkList ? `<button class="btn small" data-print-homework="${esc(r.key)}">Print homework / Save PDF</button>` : ""}</div>
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
          ${p.topSounds.length ? `<div><b>Sounds to work on</b><br>${p.topSounds.map(([s, n]) => `<span class="sound-chip">${esc(s)} ×${n}</span>`).join("")}</div>` : `<div>No missed sounds 🎉</div>`}
           <ul class="recent">${p.recent.map(r => `<li>${day(r.at)} · ${esc(r.source)} · ${esc(r.list)} · ${esc(r.score)} first time</li>`).join("")}</ul>
           ${p.lastSwitch ? `<details class="game-review"><summary>🎮 Last Sound Switch game · ${day(p.lastSwitch.at)}</summary>
             <p class="hint">Time includes listening and thinking; it is never used to score the child.</p>
             <ul>${p.lastSwitch.words.map(w => `<li><b>${esc(w.word)}</b> · ${w.triesUsed === 1 ? "first go" : "with support"}
               ${Number.isFinite(w.seconds) ? ` · ${w.seconds}s` : ""}
               ${(w.wrong || []).length ? `<br><span class="meta">${esc(w.wrong.join(", "))}</span>` : ""}</li>`).join("")}</ul></details>` : ""}
        </article>`).join("")}</div>` : `<div class="empty">No results yet. Each pupil appears here after finishing (or stopping) a list.</div>`}
      ${pupils.length ? (() => {
        const organisers = [...new Set(cfeRows(sessions).map(r => r.organiser))];
        return `<h2 class="t-h2">Curriculum for Excellence overview</h2>
          <p class="hint">Each pupil's status for each organiser in this period. Secure = 85%+ right first time on 10+ questions over 2+ days; Developing = 60%+.</p>
          <div class="t-scroll"><table class="t-table cfe-table"><thead><tr><th>Pupil</th>${organisers.map(o => `<th>${esc(o.replace(/^(Literacy|Numeracy) · /, ""))}</th>`).join("")}</tr></thead>
          <tbody>${pupils.map(p => { const rows = cfeRows(sessions, p.pupil);
            return `<tr><td class="who">${esc(p.pupil)}</td>${organisers.map(o => { const r = rows.find(x => x.organiser === o);
              return `<td>${r ? `<span class="cfe ${r.status.key}">${esc(r.status.text)}</span><br><span class="meta">${r.pct}% · ${r.items} q</span>` : "—"}</td>`; }).join("")}</tr>`; }).join("")}</tbody></table></div>`;
      })() : ""}`;
    if ($("#csv")) $("#csv").onclick = () => downloadCSV(sessions);
    body.querySelectorAll("[data-report]").forEach(b => { b.onclick = () => printReport(b.dataset.report, sessions); });
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
        drawPupils(body);
      } catch (err) { showError(err); }
    }; });
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
      calendarDialog(due);
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

