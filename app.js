/* Spelling Practice — Look · Say · Cover · Write · Check
   Word lists live in words.js. You shouldn't need to edit this file. */
(() => {
  "use strict";

  const SITE = Object.assign({ title: "Spelling Practice", subtitle: "Look · Say · Cover · Write · Check" }, window.SITE);
  const STAGES = window.SPELLING_LISTS || [];
  const app = document.getElementById("app");
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Every list by id, so #/list/<id> can find it
  const LISTS = {};
  STAGES.forEach(stage => stage.lists.forEach(list => {
    LISTS[list.id] = Object.assign({ stage: stage.stage, accent: stage.colour }, list);
  }));

  /* ---------- Settings (kept in this browser only) ---------- */

  const DEFAULTS = { lookSeconds: 4, rate: 0.85, voice: "", tries: 3, shuffle: true, spellOut: true, sounds: true };
  const STORE_KEY = "spelling-settings-v1";
  const settings = (() => {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(STORE_KEY))); }
    catch { return Object.assign({}, DEFAULTS); }
  })();
  const saveSettings = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(settings)); } catch { /* private mode */ } };

  /* ---------- Speech ---------- */

  const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
  // Natural-sounding British voices first (Edge, Chrome, Apple), then any en-GB, then any English
  const PREFERRED = [/sonia/i, /libby/i, /maisie/i, /ryan/i, /thomas/i, /google uk english female/i,
    /google uk english male/i, /fiona/i, /kate/i, /serena/i, /stephanie/i, /daniel/i, /hazel/i, /george/i, /susan/i];
  let voices = [];

  function refreshVoices() {
    if (!synth) return;
    const rank = v => (/en[-_]GB/i.test(v.lang) ? 0 : 100) + ((i => i < 0 ? 50 : i)(PREFERRED.findIndex(r => r.test(v.name))));
    voices = synth.getVoices().filter(v => /^en/i.test(v.lang)).sort((a, b) => rank(a) - rank(b));
    fillVoiceSelect();
  }
  const currentVoice = () => voices.find(v => v.voiceURI === settings.voice) || voices[0] || null;

  // Resolves when speaking finishes (or after a safety timeout, as some browsers never fire onend)
  function speak(text, rate = settings.rate) {
    return new Promise(resolve => {
      if (!synth) return resolve();
      let timer;
      let done = false;
      const finish = () => { if (!done) { done = true; clearTimeout(timer); resolve(); } };
      const u = new SpeechSynthesisUtterance(text);
      const v = currentVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-GB"; }
      u.rate = rate;
      u.onend = finish;
      u.onerror = finish;
      timer = setTimeout(finish, 1500 + (text.length * 160) / rate);
      if (synth.speaking || synth.pending) {
        synth.cancel();
        setTimeout(() => synth.speak(u), 60); // Chrome drops an utterance queued straight after cancel()
      } else {
        synth.speak(u); // iPad needs the first speak() inside the tap itself
      }
    });
  }
  const spellOut = word => word.toUpperCase().split("").filter(c => c.trim()).join(", ");

  /* ---------- Little sounds ---------- */

  let audioCtx;
  function tones(freqs, dur) {
    if (!settings.sounds) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      let t = audioCtx.currentTime;
      for (const f of freqs) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.05);
        t += dur * 0.75;
      }
    } catch { /* no audio, no problem */ }
  }
  const chimeRight = () => tones([660, 880, 1320], 0.16);
  const chimeWrong = () => tones([330, 247], 0.18);

  /* ---------- Helpers ---------- */

  let timers = [];
  let phase = 0; // bumps on every screen change so old timers/speech callbacks do nothing
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function newScreen() {
    timers.forEach(clearTimeout);
    timers = [];
    if (synth) synth.cancel();
    return ++phase;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Words from the "make a list" box or a shared link: split on new lines or commas
  function parseWords(text) {
    const seen = new Set();
    return String(text).split(/[\n,;]+/)
      .map(w => w.trim().replace(/\s+/g, " "))
      .filter(w => /^[A-Za-z][A-Za-z' -]*$/.test(w))
      .filter(w => !seen.has(w.toLowerCase()) && seen.add(w.toLowerCase()))
      .slice(0, 30);
  }

  const normalise = s => s.trim().toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, " ");
  const stars = n => "★".repeat(Math.max(0, n));
  const PRAISE = ["Well done!", "Brilliant!", "Super spelling!", "Fantastic!", "Great job!", "You got it!", "Amazing!"];
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- Router ---------- */

  function route() {
    newScreen();
    session = null;
    const hash = location.hash.replace(/^#/, "") || "/";
    const [path, query = ""] = hash.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(query);

    if (parts[0] === "list" && LISTS[parts[1]]) showStart(LISTS[parts[1]]);
    else if (parts[0] === "custom" && parseWords(params.get("words") || "").length) {
      showStart({
        title: params.get("title") || "My spelling list",
        stage: "Your teacher's list",
        accent: "#0f766e",
        words: parseWords(params.get("words"))
      });
    }
    else if (parts[0] === "make") showMake();
    else showHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  /* ---------- Home ---------- */

  function showHome() {
    document.title = SITE.title;
    app.innerHTML = `
      <section class="hero">
        <h1>${esc(SITE.title)}</h1>
        <p class="lead">${esc(SITE.subtitle)}</p>
        <ol class="steps">
          <li><span class="step-icon" aria-hidden="true">👀</span><span><b>Look</b> at the word</span></li>
          <li><span class="step-icon" aria-hidden="true">👂</span><span><b>Listen</b> to it</span></li>
          <li><span class="step-icon" aria-hidden="true">🙈</span><span>It <b>hides</b></span></li>
          <li><span class="step-icon" aria-hidden="true">✏️</span><span><b>Spell</b> it — ${settings.tries} ${settings.tries === 1 ? "try" : "tries"}</span></li>
        </ol>
      </section>
      ${STAGES.map(stage => `
        <section class="stage" style="--accent:${esc(stage.colour)}">
          <h2>${esc(stage.stage)}</h2>
          <div class="grid">
            ${stage.lists.map(l => `
              <a class="list-card" href="#/list/${encodeURIComponent(l.id)}">
                <span class="lc-example">${esc(l.words[0] || "")}</span>
                <span class="lc-title">${esc(l.title)}</span>
                <span class="lc-count">${l.words.length} words</span>
              </a>`).join("")}
          </div>
        </section>`).join("")}`;
  }

  /* ---------- Start screen ---------- */

  function showStart(list) {
    document.title = `${list.title} · ${SITE.title}`;
    app.innerHTML = `
      <section class="panel start" style="--accent:${esc(list.accent)}">
        <a class="back" href="#/">← All lists</a>
        <p class="eyebrow">${esc(list.stage || "")}</p>
        <h1>${esc(list.title)}</h1>
        ${list.tip ? `<p class="tip">💡 ${esc(list.tip)}</p>` : ""}
        <p class="meta">${list.words.length} words · ${settings.tries} ${settings.tries === 1 ? "try" : "tries"} for each word</p>
        <button class="btn big primary" id="go">▶ Start</button>
        ${synth ? "" : `<p class="warn">This browser can't read words aloud. Please try Chrome, Edge or Safari.</p>`}
        <details class="teacher">
          <summary>Words in this list</summary>
          <p class="wordlist">${list.words.map(esc).join(", ")}</p>
        </details>
      </section>`;
    const go = $("#go");
    go.focus();
    go.onclick = () => startPractice(list, list.words);
  }

  /* ---------- Practice ---------- */

  let session = null;

  function startPractice(list, words) {
    session = { list, words: settings.shuffle ? shuffle(words) : words.slice(), i: 0, results: [] };
    showLook();
  }

  function progressHTML() {
    const n = session.words.length;
    const earned = session.results.reduce((t, r) => t + r.stars, 0);
    return `
      <div class="progress">
        <a class="stop" href="#/list/${encodeURIComponent(session.list.id || "")}" id="stopLink">✕ Stop</a>
        <span>Word ${session.i + 1} of ${n}</span>
        <span class="earned" aria-label="${earned} stars">★ ${earned}</span>
      </div>
      <div class="bar" aria-hidden="true"><span style="width:${(session.i / n) * 100}%"></span></div>`;
  }

  // The address doesn't change during practice, so "Stop" has to redraw the start screen itself
  function wireStop() {
    $("#stopLink").onclick = e => {
      e.preventDefault();
      const list = session.list;
      newScreen();
      session = null;
      showStart(list);
    };
  }

  // 1. LOOK & LISTEN: word on screen and read aloud, then it hides
  function showLook() {
    const my = newScreen();
    const word = session.words[session.i];
    const timed = settings.lookSeconds > 0;
    app.innerHTML = `
      <section class="panel practice" style="--accent:${esc(session.list.accent)}">
        ${progressHTML()}
        <p class="phase"><span class="dot look"></span>Look and listen</p>
        <div class="word-box"><span class="word" lang="en-GB">${esc(word)}</span></div>
        ${timed ? `<div class="timer" aria-hidden="true"><span id="timerFill"></span></div>` : ""}
        <div class="row center">
          <button class="btn" id="hear">🔊 Hear it again</button>
          <button class="btn primary" id="ready">I'm ready ✏️</button>
        </div>
      </section>`;
    wireStop();

    const runTimer = () => {
      if (my !== phase || !timed) return;
      const fill = $("#timerFill");
      fill.style.transition = "none";
      fill.style.width = "100%";
      void fill.offsetWidth;
      fill.style.transition = `width ${settings.lookSeconds}s linear`;
      fill.style.width = "0%";
      later(() => my === phase && showWrite(), settings.lookSeconds * 1000);
    };
    const say = () => {
      timers.forEach(clearTimeout);
      timers = [];
      speak(word).then(runTimer);
    };
    $("#hear").onclick = say;
    $("#ready").onclick = () => showWrite();
    $("#ready").focus();
    say();
  }

  // 2. COVER & WRITE: word hidden, pupil types it
  function showWrite() {
    newScreen();
    const word = session.words[session.i];
    const wrong = [];
    app.innerHTML = `
      <section class="panel practice" style="--accent:${esc(session.list.accent)}">
        ${progressHTML()}
        <p class="phase"><span class="dot write"></span>Now spell it</p>
        <div class="word-box covered" aria-hidden="true"><span>🙈</span></div>
        <form class="spell-form" id="spellForm" autocomplete="off">
          <label for="answer" class="sr-only">Type the word</label>
          <input id="answer" class="answer" type="text" autocomplete="off" autocorrect="off"
                 autocapitalize="none" spellcheck="false" enterkeyhint="done" maxlength="40">
          <button class="btn primary" type="submit">Check ✓</button>
        </form>
        <div class="tries" id="tries"></div>
        <p class="feedback" id="feedback" aria-live="polite"></p>
        <ul class="attempts" id="attempts"></ul>
        <div class="row center"><button class="btn" id="hear" type="button">🔊 Hear it again</button></div>
      </section>`;
    wireStop();

    const input = $("#answer");
    const feedback = $("#feedback");
    const drawTries = () => {
      const left = settings.tries - wrong.length;
      $("#tries").innerHTML = Array.from({ length: settings.tries }, (_, k) =>
        `<span class="try ${k < left ? "" : "used"}"></span>`).join("") +
        `<span class="tries-label">${left} ${left === 1 ? "try" : "tries"} left</span>`;
    };
    drawTries();
    input.focus();

    $("#hear").onclick = () => { speak(word); input.focus(); };

    $("#spellForm").onsubmit = e => {
      e.preventDefault();
      const answer = input.value;
      if (!answer.trim()) {
        feedback.textContent = "Type the word first, then press Check.";
        input.focus();
        return;
      }
      if (normalise(answer) === normalise(word)) {
        showResult(true, wrong);
        return;
      }
      wrong.push(answer.trim());
      if (wrong.length >= settings.tries) {
        showResult(false, wrong);
        return;
      }
      chimeWrong();
      const left = settings.tries - wrong.length;
      feedback.className = "feedback oops";
      feedback.textContent = `Not quite — listen again and have another go. ${left} ${left === 1 ? "try" : "tries"} left.`;
      $("#attempts").innerHTML = wrong.map(w => `<li>${esc(w)}</li>`).join("");
      drawTries();
      input.value = "";
      input.classList.remove("shake");
      void input.offsetWidth;
      input.classList.add("shake");
      input.focus();
      later(() => speak(word), 500);
    };
  }

  // 3. CHECK: right (with stars) or show the correct spelling
  function showResult(correct, wrong) {
    newScreen();
    const word = session.words[session.i];
    const earned = correct ? settings.tries - wrong.length : 0;
    session.results.push({ word, correct, wrong: wrong.slice(), stars: earned });
    const last = session.i === session.words.length - 1;
    const praise = pick(PRAISE);

    app.innerHTML = `
      <section class="panel practice" style="--accent:${esc(session.list.accent)}">
        ${progressHTML()}
        <p class="phase"><span class="dot ${correct ? "good" : "check"}"></span>${correct ? praise : "Let's look at it together"}</p>
        <div class="word-box ${correct ? "right pop" : "reveal"}"><span class="word" lang="en-GB">${esc(word)}</span></div>
        ${correct
          ? `<p class="stars-big" aria-label="${earned} stars">${stars(earned)}<span class="dim">${stars(settings.tries - earned)}</span></p>`
          : `<p class="feedback">This is how we spell <b>${esc(word)}</b>. Have a good look!</p>`}
        ${wrong.length ? `<p class="attempts-label">Your tries:</p><ul class="attempts">${wrong.map(w => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}
        <div class="row center">
          ${correct ? "" : `<button class="btn" id="hear">🔊 Hear it again</button>`}
          <button class="btn big primary" id="next">${last ? "See my stars 🏆" : "Next word →"}</button>
        </div>
      </section>`;
    wireStop();

    const sayIt = () => speak(settings.spellOut ? `${word}. ${spellOut(word)}. ${word}.` : `The word is ${word}.`, settings.rate * 0.9);
    if (correct) { chimeRight(); later(() => speak(praise), 350); }
    else { chimeWrong(); later(sayIt, 400); }
    if (!correct) $("#hear").onclick = sayIt;

    const next = $("#next");
    next.focus();
    next.onclick = () => {
      if (last) return showSummary();
      session.i++;
      showLook();
    };
  }

  /* ---------- Summary ---------- */

  function showSummary() {
    newScreen();
    const r = session.results;
    const right = r.filter(x => x.correct).length;
    const firstGo = r.filter(x => x.correct && !x.wrong.length).length;
    const earned = r.reduce((t, x) => t + x.stars, 0);
    const tricky = r.filter(x => !x.correct || x.wrong.length).map(x => x.word);
    const headline = right === r.length
      ? (firstGo === r.length ? "Perfect! Every word right first time!" : "You spelled every word!")
      : `You spelled ${right} out of ${r.length} words!`;

    app.innerHTML = `
      <section class="panel summary" style="--accent:${esc(session.list.accent)}">
        <p class="trophy" aria-hidden="true">${right === r.length ? "🏆" : "🌟"}</p>
        <h1>${esc(headline)}</h1>
        <p class="meta">${esc(session.list.title)} · ★ ${earned} stars · ${firstGo} right first time</p>
        <table class="results">
          <thead><tr><th>Word</th><th>Result</th><th>Tries</th></tr></thead>
          <tbody>
            ${r.map(x => `
              <tr class="${x.correct ? "" : "missed"}">
                <td class="rw">${esc(x.word)}</td>
                <td>${x.correct ? `<span class="star-cell">${stars(x.stars)}</span>` : `<span class="miss">Keep practising</span>`}</td>
                <td class="tries-cell">${x.wrong.length ? x.wrong.map(w => `<s>${esc(w)}</s>`).join(" ") : "—"}</td>
              </tr>`).join("")}
          </tbody>
        </table>
        <div class="row center no-print">
          ${tricky.length ? `<button class="btn primary" id="again-tricky">Practise the ${tricky.length} tricky ${tricky.length === 1 ? "word" : "words"}</button>` : ""}
          <button class="btn" id="again-all">Do this list again</button>
          <a class="btn" href="#/">Choose another list</a>
          <button class="btn" id="print">🖨️ Print</button>
        </div>
      </section>`;

    speak(right === r.length ? "Fantastic! You spelled every word." : `Well done. You spelled ${right} out of ${r.length} words.`);
    const list = session.list;
    if (tricky.length) $("#again-tricky").onclick = () => startPractice(Object.assign({}, list, { title: `${list.title} — tricky words` }), tricky);
    $("#again-all").onclick = () => startPractice(list, list.words);
    $("#print").onclick = () => window.print();
  }

  /* ---------- Make a list (for the teacher) ---------- */

  function showMake() {
    document.title = `Make a list · ${SITE.title}`;
    app.innerHTML = `
      <section class="panel make">
        <a class="back" href="#/">← All lists</a>
        <h1>Make your own list</h1>
        <p>Type the words for a lesson, then press <b>Make link</b>. Send the link to pupils or open it on the lesson computer — nothing is saved on the website, the words are all in the link.</p>
        <form id="makeForm" class="make-form">
          <label class="field">List name
            <input id="mkTitle" maxlength="60" placeholder="e.g. Tuesday group — ou words">
          </label>
          <label class="field">Words (one per line, or separated by commas)
            <textarea id="mkWords" rows="9" placeholder="cloud&#10;shout&#10;mouth"></textarea>
          </label>
          <p class="hint" id="mkInfo">Up to 15 words works best (30 at most).</p>
          <div class="row"><button class="btn primary" type="submit">Make link</button></div>
        </form>
        <div id="mkResult" class="mk-result" hidden>
          <label class="field">Link for pupils
            <input id="mkLink" readonly>
          </label>
          <div class="row">
            <button class="btn" id="mkCopy" type="button">📋 Copy link</button>
            <a class="btn primary" id="mkStart">▶ Start now</a>
          </div>
        </div>
      </section>`;

    const words = $("#mkWords");
    const info = $("#mkInfo");
    words.oninput = () => {
      const n = parseWords(words.value).length;
      info.textContent = n ? `${n} ${n === 1 ? "word" : "words"}${n >= 30 ? " (that's the most allowed)" : n > 15 ? " — that's quite a lot for one go" : ""}` : "Up to 15 words works best (30 at most).";
    };

    $("#makeForm").onsubmit = e => {
      e.preventDefault();
      const list = parseWords(words.value);
      if (!list.length) { info.textContent = "Please type at least one word (letters only)."; words.focus(); return; }
      const title = $("#mkTitle").value.trim() || "My spelling list";
      const hash = `#/custom?title=${encodeURIComponent(title)}&words=${list.map(encodeURIComponent).join(",")}`;
      const link = location.href.split("#")[0] + hash;
      $("#mkLink").value = link;
      $("#mkStart").href = hash;
      $("#mkResult").hidden = false;
      $("#mkLink").select();
    };

    $("#mkCopy").onclick = async () => {
      const linkBox = $("#mkLink");
      try { await navigator.clipboard.writeText(linkBox.value); }
      catch { linkBox.select(); document.execCommand("copy"); }
      $("#mkCopy").textContent = "✓ Copied";
      later(() => { const b = $("#mkCopy"); if (b) b.textContent = "📋 Copy link"; }, 2000);
    };
  }

  /* ---------- Settings dialog ---------- */

  const dlg = $("#settings");

  function fillVoiceSelect() {
    const sel = $("#setVoice");
    if (!sel) return;
    sel.innerHTML = voices.length
      ? voices.map(v => `<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)})</option>`).join("")
      : `<option value="">No voices found</option>`;
    const v = currentVoice();
    if (v) sel.value = v.voiceURI;
  }

  function openSettings() {
    fillVoiceSelect();
    $("#setRate").value = settings.rate;
    $("#setLook").value = String(settings.lookSeconds);
    $("#setTries").value = String(settings.tries);
    $("#setShuffle").checked = settings.shuffle;
    $("#setSpell").checked = settings.spellOut;
    $("#setSounds").checked = settings.sounds;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }

  $("#settingsBtn").onclick = openSettings;
  $("#setVoice").onchange = e => { settings.voice = e.target.value; saveSettings(); speak("cake"); };
  $("#setRate").onchange = e => { settings.rate = Number(e.target.value); saveSettings(); };
  $("#setLook").onchange = e => { settings.lookSeconds = Number(e.target.value); saveSettings(); };
  $("#setTries").onchange = e => { settings.tries = Number(e.target.value); saveSettings(); };
  $("#setShuffle").onchange = e => { settings.shuffle = e.target.checked; saveSettings(); };
  $("#setSpell").onchange = e => { settings.spellOut = e.target.checked; saveSettings(); };
  $("#setSounds").onchange = e => { settings.sounds = e.target.checked; saveSettings(); };
  $("#testVoice").onclick = () => speak("Can you spell the word, cake?");
  // Re-draw menus so they show the new settings; never interrupt a pupil mid-practice
  dlg.addEventListener("close", () => { if (!session) route(); });

  /* ---------- Go ---------- */

  $("#siteTitle").textContent = SITE.title;
  if (synth) {
    refreshVoices();
    synth.addEventListener?.("voiceschanged", refreshVoices);
  }
  route();
})();
