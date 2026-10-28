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
    const tabs = [["live", "Live class"], ["next", "Next steps"], ["assign", "Assignments"], ["plans", "Plans & worksheets"],
      ["diary", "Lesson diary"], ["pupils", "Pupils"], ["classes", "Classes"]];
    if (canAdmin()) tabs.push(["teachers", "Teachers"]);
    root.innerHTML = `
      <section class="t-wrap">
        <div class="t-top">
          <div>
            <h1>Hello, ${esc(shortName(me.name))}${canAdmin() ? ` <span class="t-role">${roleLabel(me.role)}</span>` : ""}</h1>
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
    const needsClass = ["live", "next", "assign", "plans", "diary", "pupils"].includes(tab);
    if (needsClass && !current) {
      body.innerHTML = `<div class="empty">Make a class first, in the <b>Classes</b> tab.</div>`;
      return;
    }
    ({ live: drawLive, next: drawNext, assign: drawAssign, plans: drawPlans, diary: drawDiary, pupils: drawPupils,
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
    groups.push(`<optgroup label="🧭 Starting checks">${checks.map(c => `<option value="${esc(c.id)}">${esc(c.title)}</option>`).join("")}</optgroup>`);
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

  function printLetters() {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    printSheet("ws-literacy", `${dotPattern}${sheetHead("Letter formation", "")}
      <p>Form each letter the way you've been shown, starting in the right place. Trace the grey letters, then the dotted ones, then write your own.</p>
      ${letters.map(c => handwritingRow(`${c} ${c} ${c}`, ["model", "grey", "dots", "blank"])).join("")}`);
  }

  function worksheetSpec(who, plan, mode) {
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
      <p><b>Pupil:</b> ${esc(who === "Everyone" ? "____________________" : who)}
        &nbsp; <b>Class:</b> ${esc(current.name)} &nbsp; <b>Date:</b> ${esc(plan.from)}</p>
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
    const sheet = worksheetSpec(who, plan, mode);
    if (!sheet) return showError(new Error("Worksheets are available for built-in spelling lists. Test this activity online instead."));
    const dialog = document.createElement("dialog");
    dialog.className = "worksheet-preview";
    dialog.innerHTML = `<div class="worksheet-preview-actions"><h2>Worksheet preview</h2>
      <button class="btn small" type="button" data-close>Close</button>
      <button class="btn small primary" type="button" data-print>Print / Save PDF</button></div>
      <section class="sheet-preview-page ${sheet.className}">${sheet.html}</section>`;
    document.body.append(dialog);
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.querySelector("[data-close]").onclick = () => dialog.close();
    dialog.querySelector("[data-print]").onclick = () => { dialog.close(); printSheet(sheet.className, sheet.html); };
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
        worksheets: 0, words: 0, right: 0, firstGo: 0, last: 0, recent: [], sounds: {} };
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
      words.forEach(w => (w.missed || []).forEach(m => { p.sounds[m] = (p.sounds[m] || 0) + 1; }));
    });
    return Object.values(pupils).map(p => Object.assign(p, {
      topSounds: Object.entries(p.sounds).sort((a, b) => b[1] - a[1]).slice(0, 6)
    })).sort((a, b) => a.pupil.localeCompare(b.pupil));
  }

  function downloadCSV(sessions) {
    const cell = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const lines = [["Date", "Time", "Pupil", "List", "Source", "Word", "Sounds", "Result", "Wrong tries", "Sounds missed"].map(cell).join(",")];
    sessions.slice().reverse().forEach(s => (s.words || []).forEach(w => {
      const d = new Date(s.at);
      const result = (w.challenge ? "New word: " : "") + (w.correct ? (w.triesUsed === 1 ? "Right first time" : `Right on try ${w.triesUsed}`) : "Missed");
      lines.push([d.toLocaleDateString("en-GB"), d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), s.pupil, s.list,
        s.source === "worksheet" ? "Worksheet" : "Online", w.word, w.sounds, result,
        (w.wrong || []).join(" "), (w.missed || []).join(" ")].map(cell).join(","));
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
    sessions.filter(s => !P().checkKind(s.listId))
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
    mine.filter(s => !P().checkKind(s.listId)).forEach(s => (s.words || []).forEach(w => {
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
        score: P().checkKind(s.listId) ? "" : `${firstTime(s)} of ${(s.words || []).length} right first time` })),
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
      <h2 class="t-h2">Pupils in ${esc(current.name)}</h2>
      <p class="hint">Add a pupil using the same name or code they type on their device. Parent contact details stay in the teacher area. Prepare reminders the day before a lesson; save a sound-map PDF and attach it to the email draft before sending.</p>
      <p class="pill">${dueTomorrow} reminder${dueTomorrow === 1 ? "" : "s"} due tomorrow</p>
      <form class="add-row" id="addPupil"><input type="text" id="rosterName" maxlength="40" placeholder="Pupil's name or code" required>
        <input type="email" id="rosterParent" placeholder="Parent email (optional)">
        <button class="btn primary" type="submit">Add pupil</button></form>
      ${roster.length ? `<div class="pupil-grid roster-grid">${roster.map(r => `<article class="pcard roster-card" data-roster="${esc(r.key)}">
        <h3>${esc(r.name)}${r.reminderOptIn && r.nextLessonDate === tomorrowKey() ? ` <span class="t-role">Reminder tomorrow</span>` : ""}</h3>
        <label>Parent email <input type="email" data-parent value="${esc(r.parentEmail || "")}" placeholder="parent@example.com"></label>
        <label class="check"><input type="checkbox" data-optin ${r.reminderOptIn ? "checked" : ""}> Parent requested reminders</label>
        <div class="add-row"><label>Next lesson <input type="date" data-lesson-date value="${esc(r.nextLessonDate || "")}"></label>
          <label>Time <input type="time" data-lesson-time value="${esc(r.lessonTime || "")}"></label></div>
        <label>Homework list <select data-homework>${catalogueOptions()}</select></label>
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
          <div class="next-head"><h3>${esc(p.pupil)}</h3><button class="btn small" data-report="${esc(p.pupil)}">📄 Progress report</button></div>
           <p class="meta">${p.lists} lists (${p.worksheets} worksheets) · ${p.right}/${p.words} words right · ${p.firstGo} first time · last ${day(p.last)}</p>
          ${p.topSounds.length ? `<div><b>Sounds to work on</b><br>${p.topSounds.map(([s, n]) => `<span class="sound-chip">${esc(s)} ×${n}</span>`).join("")}</div>` : `<div>No missed sounds 🎉</div>`}
           <ul class="recent">${p.recent.map(r => `<li>${day(r.at)} · ${esc(r.source)} · ${esc(r.list)} · ${esc(r.score)} first time</li>`).join("")}</ul>
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
      const subject = `PopSpell lesson tomorrow for ${pupil.name}`;
      const bodyText = `Hello,\n\nA reminder that ${pupil.name} has a PopSpell lesson tomorrow, ${date}`
        + (pupil.lessonTime ? ` at ${pupil.lessonTime}` : "") + `.\n\n`
        + (list ? `Homework: ${list.title}. The sound-mapping worksheet is attached. Please say each word aloud, then ask ${pupil.name} to segment it into sounds and write the matching letters in the boxes.\n\n` : "")
        + `Best wishes,\nPopSpell`;
      location.href = `mailto:${encodeURIComponent(pupil.parentEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
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
            Pupils only see the work I set (hide the rest of the library)</label>` : ""}
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

