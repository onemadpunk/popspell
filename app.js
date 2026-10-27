/* Spelling Practice — sounds first: hear the word, say its sounds, see how each sound
   is written, then spell it sound by sound.
   Word lists live in words.js. You shouldn't need to edit this file. */
(() => {
  "use strict";

  const SITE = Object.assign({ title: "Spelling Practice", subtitle: "Listen · Say the sounds · Spell it" }, window.SITE);
  const STAGES = window.SPELLING_LISTS || [];
  const app = document.getElementById("app");
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Phonics: splitting words into graphemes ---------- */

  const VOWELS = "aeiou";
  const TRIGRAPHS = ["tch", "igh", "air", "are", "ear", "eer", "ere"];
  const DIGRAPHS = ["sh", "ch", "th", "wh", "ph", "ck", "ng", "qu", "kn", "wr",
    "ai", "ay", "ee", "ea", "oa", "ow", "oo", "ou", "oi", "oy", "aw", "au", "ew", "ue",
    "ar", "or", "er", "ir", "ur", "bb", "dd", "ff", "gg", "ll", "mm", "nn", "pp", "rr", "ss", "tt", "zz"];

  // "cake" -> ["c", "a_e", "k"]; longest grapheme first, split digraphs at the end of a word
  function autoSplit(w) {
    const out = [];
    let i = 0;
    let claimedE = -1;
    while (i < w.length) {
      if (i === claimedE) { i++; continue; }
      const c = w[i];
      const free = len => claimedE < i || claimedE >= i + len; // don't swallow a split digraph's e
      const three = free(3) ? w.substr(i, 3) : "";
      const two = free(2) ? w.substr(i, 2) : "";
      if (TRIGRAPHS.includes(three)) { out.push(three); i += 3; continue; }
      if (VOWELS.includes(c) && i + 2 === w.length - 1 && w[i + 2] === "e" && !VOWELS.includes(w[i + 1]) && !"wy".includes(w[i + 1])) {
        out.push(c + "_e");
        claimedE = i + 2;
        i++;
        continue;
      }
      if (two === "le" && i > 0 && i + 2 === w.length) { out.push("le"); i += 2; continue; }
      if (DIGRAPHS.includes(two)) { out.push(two); i += 2; continue; }
      out.push(c);
      i++;
    }
    // A leftover final e after s, c, g, v or z belongs to it: house -> h-ou-se
    const last = out.length - 1;
    if (last >= 2 && out[last] === "e" && /^[scgvz]$/.test(out[last - 1])) out.splice(last - 1, 2, out[last - 1] + "e");
    return out;
  }

  // "cake" or "c-a_e-k" -> the spelling, its graphemes, and the written chunks in order
  function analyse(entry) {
    const raw = String(entry).trim();
    const hasDashes = raw.includes("-");
    const tokens = hasDashes ? raw.toLowerCase().split("-").filter(Boolean) : autoSplit(raw.toLowerCase());
    const chunks = [];
    let pendingE = null;
    tokens.forEach((tok, g) => {
      const split = /^([aeiou])_e$/.exec(tok);
      chunks.push({ text: split ? split[1] : tok, g, split: split ? "start" : "" });
      if (pendingE !== null) { chunks.push({ text: "e", g: pendingE, split: "end" }); pendingE = null; }
      if (split) pendingE = g;
    });
    if (pendingE !== null) chunks.push({ text: "e", g: pendingE, split: "end" });
    // Keep capital letters the teacher typed (e.g. Monday)
    if (!hasDashes) {
      let k = 0;
      chunks.forEach(ch => { ch.text = raw.substr(k, ch.text.length); k += ch.text.length; });
    }
    const spelling = chunks.map(ch => ch.text).join("");
    const charG = [];
    chunks.forEach(ch => { for (let k = 0; k < ch.text.length; k++) charG.push(ch.g); });
    return { spelling, tokens, chunks, charG, whole: hasDashes && tokens.length === 1 };
  }

  const label = tok => tok.replace("_", "–");
  const letterNames = text => text.toUpperCase().split("").join(" ");

  // Sounds a list is practising: its "focus", or graphemes found in most of its words
  function listFocus(list) {
    if (Array.isArray(list.focus)) return new Set(list.focus);
    const counts = {};
    list.items.forEach(it => new Set(it.tokens).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    return new Set(Object.keys(counts).filter(t => counts[t] >= list.items.length * 0.6));
  }

  // Line up a pupil's attempt with the real spelling, sound by sound
  function compare(attempt, item) {
    const a = normalise(attempt);
    const t = item.spelling.toLowerCase();
    const n = a.length;
    const m = t.length;
    const d = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === t[j - 1] ? 0 : 1));
      }
    }
    const ok = new Array(m).fill(false);
    const got = new Array(m).fill("");
    const extra = new Array(m).fill(false);
    let i = n;
    let j = m;
    let silentE = false; // an e added at the end, as in "rane" for "rain"
    // Walk back through the table, preferring matching letters, so "tale" for "tail" lines up as t · a(i) · l(e)
    while (i > 0 || j > 0) {
      const same = i > 0 && j > 0 && a[i - 1] === t[j - 1];
      if (same && d[i][j] === d[i - 1][j - 1]) {
        ok[j - 1] = true;
        got[j - 1] = a[i - 1] + got[j - 1];
        i--; j--;
      } else if (j > 0 && d[i][j] === d[i][j - 1] + 1) {
        j--; // letter missing from the attempt
      } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
        if (i === n && j === m && a[i - 1] === "e" && !silentE) { silentE = true; i--; continue; }
        const k = Math.max(0, j - 1); // extra letter: blame the sound it sits next to
        extra[k] = true;
        got[k] = a[i - 1] + got[k];
        i--;
      } else {
        got[j - 1] = a[i - 1] + got[j - 1]; // wrong letter
        i--; j--;
      }
    }
    const boxes = item.tokens.map((tok, g) => {
      const idx = item.charG.map((gg, k) => (gg === g ? k : -1)).filter(k => k >= 0);
      const parts = idx.map(k => got[k]);
      return {
        tok,
        ok: idx.every(k => ok[k] && !extra[k]),
        text: tok.includes("_") && parts.every(Boolean) ? parts.join("…") : parts.join("")
      };
    });
    // A stray silent e is really a mistake in the vowel sound, so show it there (a…e); otherwise on the last sound
    if (silentE && boxes.length) {
      const vowel = boxes.find(b => !b.ok && /[aeiou]/.test(b.tok)) || boxes[boxes.length - 1];
      vowel.ok = false;
      vowel.text += "…e";
    }
    return { right: a === t, boxes };
  }

  // Every list by id, so #/list/<id> can find it
  const LISTS = {};
  const prepare = (list, extras) => {
    const ready = Object.assign({}, extras, list, { items: list.words.map(analyse) });
    ready.focusSet = listFocus(ready);
    return ready;
  };
  STAGES.forEach(stage => stage.lists.forEach(list => {
    LISTS[list.id] = prepare(list, { stage: stage.stage, accent: stage.colour });
  }));

  /* ---------- Settings (kept in this browser only) ---------- */

  const DEFAULTS = { lookSeconds: 8, rate: 0.85, voice: "", tries: 3, shuffle: true, spellOut: true, sounds: true, boxes: true };
  const STORE_KEY = "spelling-settings-v2";
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
    stopAlba();
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

  // Simultaneous Oral Spelling: the word, then the letters sound by sound, then the word
  const sos = item => `${item.spelling}. ${item.chunks.map(ch => letterNames(ch.text)).join(". ")}. ${item.spelling}.`;

  /* ---------- Alba: the recorded Scottish voice (made by tools/make_audio.py) ---------- */

  const ALBA = Object.assign({ words: [], letters: false, phrases: [] }, window.ALBA_AUDIO);
  const albaWords = new Set(ALBA.words);
  const albaPhrases = new Set(ALBA.phrases);
  const ALBA_ID = "alba";
  const useAlba = () => albaWords.size > 0 && (settings.voice === ALBA_ID || !settings.voice);

  // One shared player: iPads only allow sound from an element that first played during a tap
  const player = new Audio();
  player.preload = "auto";
  let playToken = 0;
  function stopAlba() {
    playToken++;
    player.pause();
  }

  function playClip(url, token) {
    return new Promise(resolve => {
      let done = false;
      const finish = ok => { if (!done) { done = true; clearTimeout(guard); resolve(ok); } };
      const guard = setTimeout(() => finish(true), 8000);
      player.onended = () => finish(true);
      player.onerror = () => finish(false);
      player.src = url;
      player.defaultPlaybackRate = player.playbackRate = settings.rate / DEFAULTS.rate;
      if (token !== playToken) return finish(null);
      player.play().catch(() => finish(false));
    });
  }

  // Steps are clip addresses or pauses in ms. Resolves true when done, false if a clip
  // couldn't play (so the device voice can take over), null if something else interrupted it.
  async function playSteps(steps) {
    if (synth) synth.cancel();
    const token = ++playToken;
    for (const step of steps) {
      if (token !== playToken) return null;
      if (typeof step === "number") { await new Promise(r => setTimeout(r, step)); continue; }
      const ok = await playClip(step, token);
      if (ok !== true) return token === playToken ? ok : null;
    }
    return token === playToken ? true : null;
  }
  const orSpeak = (steps, text, rate) => playSteps(steps).then(ok => (ok === false ? speak(text, rate) : ok));

  const wordClip = w => `audio/words/${encodeURIComponent(w.toLowerCase())}.mp3`;
  const hasWordClip = w => useAlba() && albaWords.has(w.toLowerCase());
  const hasLetterClips = text => useAlba() && ALBA.letters && /^[a-z]+$/i.test(text);
  const letterSteps = text => text.toLowerCase().split("").flatMap((c, n) => (n ? [150, `audio/letters/${c}.mp3`] : [`audio/letters/${c}.mp3`]));

  const sayWord = w => (hasWordClip(w) ? orSpeak([wordClip(w)], w) : speak(w));
  const sayLetters = text => (hasLetterClips(text) ? orSpeak(letterSteps(text), letterNames(text)) : speak(letterNames(text)));
  const sayPhrase = ([key, text]) => (useAlba() && albaPhrases.has(key) ? orSpeak([`audio/phrases/${key}.mp3`], text) : speak(text));
  function saySOS(item) {
    const w = item.spelling;
    if (!hasWordClip(w) || !hasLetterClips(w)) return speak(sos(item), settings.rate * 0.9);
    const steps = [wordClip(w), 500];
    item.chunks.forEach(ch => steps.push(...letterSteps(ch.text), 500));
    steps.push(wordClip(w));
    return orSpeak(steps, sos(item), settings.rate * 0.9);
  }

  // Keep in step with PHRASES in tools/make_audio.py
  const PHRASES = {
    allRight: ["all-right", "Fantastic! You spelled every word."],
    finished: ["finished", "Well done! Have a look at your stars."],
    test: ["test", "Can you spell the word, cake?"]
  };
  const PRAISE = [["well-done", "Well done!"], ["brilliant", "Brilliant!"], ["super", "Super spelling!"],
    ["fantastic", "Fantastic!"], ["great-job", "Great job!"], ["got-it", "You got it!"], ["amazing", "Amazing!"]];

  /* ---------- Reports to the teacher's Google Sheet ---------- */

  const REPORTING = /^https?:\/\//.test(SITE.reportUrl || "");
  const PUPIL_KEY = "spelling-pupil-v1";
  const OUTBOX_KEY = "spelling-outbox-v1";
  const getPupil = () => { try { return localStorage.getItem(PUPIL_KEY) || ""; } catch { return ""; } };
  const setPupil = name => { try { if (name) localStorage.setItem(PUPIL_KEY, name); else localStorage.removeItem(PUPIL_KEY); } catch { /* private mode */ } };
  const cleanName = s => String(s).replace(/[^\p{L}\p{N}' .-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 30);

  // Reports that couldn't be sent (e.g. the Wi-Fi dropped) wait here and are retried later
  const readOutbox = () => { try { return JSON.parse(localStorage.getItem(OUTBOX_KEY)) || []; } catch { return []; } };
  const writeOutbox = box => { try { localStorage.setItem(OUTBOX_KEY, JSON.stringify(box.slice(-50))); } catch { /* full or private */ } };

  // Apps Script can't answer cross-site requests, so this is sent "no-cors": we learn the
  // request went out, not what the sheet said. Plain text avoids a blocked pre-flight check.
  const post = payload => fetch(SITE.reportUrl, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });

  async function flushOutbox() {
    if (!REPORTING || !navigator.onLine) return;
    const box = readOutbox();
    const left = [];
    for (const payload of box) {
      try { await post(payload); } catch { left.push(payload); }
    }
    if (left.length !== box.length) writeOutbox(left);
  }

  function sendReport(s, finished) {
    if (!REPORTING || s.sent || !s.results.length) return Promise.resolve(null);
    s.sent = true;
    const payload = {
      key: SITE.reportKey || "",
      pupil: s.pupil,
      list: s.list.title,
      listId: s.list.id || "custom",
      finished,
      words: s.results.map(r => ({
        word: r.item.spelling,
        sounds: r.item.tokens.map(label).join("·"),
        correct: r.correct,
        triesUsed: r.correct ? r.wrong.length + 1 : null,
        wrong: r.wrong,
        missed: r.missed.map(label)
      }))
    };
    return post(payload).then(() => true, () => { writeOutbox(readOutbox().concat([payload])); return false; });
  }

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
    stopAlba();
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
      .map(w => w.trim().replace(/\s+/g, ""))
      .filter(w => /^[A-Za-z][A-Za-z_-]*$/.test(w))
      .filter(w => { const key = analyse(w).spelling.toLowerCase(); return !seen.has(key) && seen.add(key); })
      .slice(0, 30);
  }

  const normalise = s => s.trim().toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, " ");
  const stars = n => "★".repeat(Math.max(0, n));
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // The word with sound buttons: a dot under one-letter sounds, a line under
  // two- or three-letter sounds, and an arc joining a split digraph
  function wordHTML(item, missed = new Set()) {
    if (item.whole) return `<span class="g whole">${esc(item.spelling)}</span>`;
    const g = ch => `<span class="g ${ch.split ? "sv" : ch.text.length > 1 ? "multi" : "single"}${missed.has(ch.g) ? " missed" : ""}" data-g="${ch.g}">${esc(ch.text)}</span>`;
    let html = "";
    for (let k = 0; k < item.chunks.length; k++) {
      const ch = item.chunks[k];
      if (ch.split === "start" && item.chunks[k + 2]?.split === "end") {
        html += `<span class="split${missed.has(ch.g) ? " missed" : ""}">${g(ch)}${g(item.chunks[k + 1])}${g(item.chunks[k + 2])}</span>`;
        k += 2;
      } else {
        html += g(ch);
      }
    }
    return html;
  }

  /* ---------- Router ---------- */

  function route() {
    newScreen();
    if (session) sendReport(session, false); // left part-way through a list
    session = null;
    const hash = location.hash.replace(/^#/, "") || "/";
    const [path, query = ""] = hash.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(query);

    if (parts[0] === "list" && LISTS[parts[1]]) showStart(LISTS[parts[1]]);
    else if (parts[0] === "custom" && parseWords(params.get("words") || "").length) {
      showStart(prepare({
        title: params.get("title") || "My spelling list",
        words: parseWords(params.get("words"))
      }, { stage: "Your teacher's list", accent: "#0f766e" }));
    }
    else if (parts[0] === "make") showMake();
    else showHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  window.addEventListener("pagehide", () => { if (session) sendReport(session, false); });

  /* ---------- Home ---------- */

  function showHome() {
    document.title = SITE.title;
    app.innerHTML = `
      <section class="hero">
        <h1>${esc(SITE.title)}</h1>
        <p class="lead">${esc(SITE.subtitle)}</p>
        <ol class="steps">
          <li><span class="step-icon" aria-hidden="true">👂</span><span><b>Listen</b> to the word</span></li>
          <li><span class="step-icon" aria-hidden="true">🗣️</span><span><b>Say</b> each sound</span></li>
          <li><span class="step-icon" aria-hidden="true">🔤</span><span><b>See</b> how each sound is written</span></li>
          <li><span class="step-icon" aria-hidden="true">✏️</span><span><b>Spell</b> it sound by sound</span></li>
        </ol>
      </section>
      ${STAGES.map(stage => `
        <section class="stage" style="--accent:${esc(stage.colour)}">
          <h2>${esc(stage.stage)}</h2>
          <div class="grid">
            ${stage.lists.map(l => `
              <a class="list-card" href="#/list/${encodeURIComponent(l.id)}">
                <span class="lc-example">${esc(LISTS[l.id].items[0]?.spelling || "")}</span>
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
        <p class="meta">${plural(list.items.length, "word", "words")} · ${plural(settings.tries, "try", "tries")} for each word</p>
        ${REPORTING ? `<div class="pupil" id="pupilBox"></div>` : ""}
        <button class="btn big primary" id="go">▶ Start</button>
        ${synth ? "" : `<p class="warn">This browser can't read words aloud. Please try Chrome, Edge or Safari.</p>`}
        <details class="teacher">
          <summary>Words in this list</summary>
          <ul class="wordlist">${list.items.map(it => `<li class="mini-word">${wordHTML(it)}</li>`).join("")}</ul>
        </details>
      </section>`;
    const go = $("#go");

    // With reports switched on, pupils say who they are first (remembered on this device)
    const drawPupil = () => {
      const box = $("#pupilBox");
      if (!box) return;
      const name = getPupil();
      box.innerHTML = name
        ? `<p>Spelling as <b>${esc(name)}</b> · <button type="button" class="linklike" id="notMe">Not ${esc(name)}?</button></p>`
        : `<label class="field pupil-field">What's your name?
             <input id="pupilName" maxlength="30" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="First name">
           </label>
           <p class="hint" id="pupilHint"></p>`;
      if (name) {
        $("#notMe").onclick = () => { setPupil(""); drawPupil(); $("#pupilName").focus(); };
        go.focus();
      } else {
        const input = $("#pupilName");
        input.onkeydown = e => { if (e.key === "Enter") go.click(); };
        input.focus();
      }
    };
    drawPupil();
    if (!REPORTING) go.focus();

    go.onclick = () => {
      if (REPORTING && !getPupil()) {
        const name = cleanName($("#pupilName").value);
        if (!name) {
          $("#pupilHint").textContent = "Type your name first, so your teacher can see how you did.";
          $("#pupilName").focus();
          return;
        }
        setPupil(name);
      }
      startPractice(list, list.items);
    };
  }

  /* ---------- Practice ---------- */

  let session = null;

  function startPractice(list, items) {
    session = { list, items: settings.shuffle ? shuffle(items) : items.slice(), i: 0, results: [], pupil: getPupil(), sent: false };
    showLook();
  }

  function progressHTML() {
    const n = session.items.length;
    const earned = session.results.reduce((t, r) => t + r.stars, 0);
    return `
      <div class="progress">
        <a class="stop" href="#/" id="stopLink">✕ Stop</a>
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
      sendReport(session, false); // the words done so far still count
      newScreen();
      session = null;
      showStart(list);
    };
  }

  // Tapping a sound button reads out its letters and lights it up
  function wireSoundButtons(root, item, onTap) {
    root.querySelectorAll(".g[data-g]").forEach(el => {
      el.onclick = () => {
        const g = Number(el.dataset.g);
        root.querySelectorAll(`.g[data-g="${g}"]`).forEach(x => {
          x.classList.remove("lit");
          void x.offsetWidth;
          x.classList.add("lit");
        });
        sayLetters(item.chunks.filter(ch => ch.g === g).map(ch => ch.text).join(""));
        if (onTap) onTap();
      };
    });
  }

  // 1. LISTEN, SAY & SEE: the word with its sound buttons, read aloud, then it hides
  function showLook() {
    const my = newScreen();
    const item = session.items[session.i];
    const timed = settings.lookSeconds > 0;
    const sounds = item.whole ? "" : `<p class="sound-count">${plural(item.tokens.length, "sound", "sounds")}</p>`;
    app.innerHTML = `
      <section class="panel practice" style="--accent:${esc(session.list.accent)}">
        ${progressHTML()}
        <p class="phase"><span class="dot look"></span>Listen and look</p>
        <div class="word-box"><span class="word sounds" lang="en-GB">${wordHTML(item)}</span></div>
        ${sounds}
        <p class="prompt">${item.whole ? "This is a tricky word. Say it, then look closely at the letters." : "Say the word. Then touch each sound button and say the sound."}</p>
        ${timed ? `<div class="timer" aria-hidden="true"><span id="timerFill"></span></div>` : ""}
        <div class="row center">
          <button class="btn" id="hear">🔊 Hear it again</button>
          <button class="btn primary" id="ready">I'm ready ✏️</button>
        </div>
      </section>`;
    wireStop();

    const runTimer = () => {
      if (my !== phase || !timed) return;
      timers.forEach(clearTimeout);
      timers = [];
      const fill = $("#timerFill");
      fill.style.transition = "none";
      fill.style.width = "100%";
      void fill.offsetWidth;
      fill.style.transition = `width ${settings.lookSeconds}s linear`;
      fill.style.width = "0%";
      later(() => my === phase && showWrite(), settings.lookSeconds * 1000);
    };
    const say = () => sayWord(item.spelling).then(runTimer);
    $("#hear").onclick = say;
    $("#ready").onclick = () => showWrite();
    wireSoundButtons($(".word"), item, runTimer); // touching the sounds gives them more time
    $("#ready").focus();
    say();
  }

  // Sound boxes: one per sound. Empty to start with; after a try they show what was written
  function boxesHTML(item, result) {
    return item.tokens.map((tok, g) => {
      if (!result) return `<button type="button" class="box" aria-label="Sound ${g + 1}"></button>`;
      const b = result.boxes[g];
      return `<span class="box ${b.ok ? "ok" : "bad"}">${esc(b.text || "?")}</span>`;
    }).join("");
  }

  // 2. SPELL: word hidden, pupil spells it sound by sound
  function showWrite() {
    newScreen();
    const item = session.items[session.i];
    const showBoxes = settings.boxes && !item.whole;
    const wrong = [];
    const firstMissed = [];
    app.innerHTML = `
      <section class="panel practice" style="--accent:${esc(session.list.accent)}">
        ${progressHTML()}
        <p class="phase"><span class="dot write"></span>Now spell it</p>
        ${showBoxes
          ? `<div class="boxes" id="boxes">${boxesHTML(item)}</div>
             <p class="prompt" id="prompt">Say each sound and tap a box. Then write it, saying each sound as you type.</p>`
          : `<div class="word-box covered" aria-hidden="true"><span>🙈</span></div>`}
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
    const wireBoxes = () => document.querySelectorAll("#boxes button.box").forEach(b => {
      b.onclick = () => { b.classList.toggle("lit"); input.focus({ preventScroll: true }); };
    });
    const drawTries = () => {
      const left = settings.tries - wrong.length;
      $("#tries").innerHTML = Array.from({ length: settings.tries }, (_, k) =>
        `<span class="try ${k < left ? "" : "used"}"></span>`).join("") +
        `<span class="tries-label">${plural(Math.max(0, left), "try", "tries")} left</span>`;
    };
    wireBoxes();
    drawTries();
    input.focus();

    $("#hear").onclick = () => { sayWord(item.spelling); input.focus(); };

    $("#spellForm").onsubmit = e => {
      e.preventDefault();
      const answer = input.value;
      if (!answer.trim()) {
        feedback.textContent = "Type the word first, then press Check.";
        input.focus();
        return;
      }
      const result = compare(answer, item);
      if (!wrong.length) result.boxes.forEach(b => { if (!b.ok) firstMissed.push(b.tok); });
      if (result.right) { showResult(true, wrong, firstMissed, result); return; }
      wrong.push(answer.trim());
      if (wrong.length >= settings.tries) { showResult(false, wrong, firstMissed, result); return; }

      chimeWrong();
      const bad = result.boxes.filter(b => !b.ok);
      const left = settings.tries - wrong.length;
      let msg = item.whole || !bad.length
        ? "Not quite — listen again and have another go."
        : bad.length === 1
          ? "So close! One sound needs fixing — look at the orange box."
          : `${bad.length} sounds need fixing. Say the word slowly and listen for each sound.`;
      msg += ` ${plural(left, "try", "tries")} left.`;
      const focusTip = session.list.tip && bad.some(b => session.list.focusSet.has(b.tok));
      feedback.className = "feedback oops";
      feedback.innerHTML = esc(msg) + (focusTip ? `<span class="tip-inline">💡 ${esc(session.list.tip)}</span>` : "");
      if (showBoxes) {
        $("#boxes").innerHTML = boxesHTML(item, result);
        $("#prompt").textContent = "Green sounds are right. Fix the orange ones.";
      }
      $("#attempts").innerHTML = wrong.map(w => `<li>${esc(w)}</li>`).join("");
      drawTries();
      input.value = "";
      input.classList.remove("shake");
      void input.offsetWidth;
      input.classList.add("shake");
      input.focus();
      later(() => sayWord(item.spelling), 500);
    };
  }

  // 3. CHECK: right (with stars), or see the word sound by sound and hear it spelled out
  function showResult(correct, wrong, firstMissed, last) {
    newScreen();
    const item = session.items[session.i];
    const earned = correct ? settings.tries - wrong.length : 0;
    session.results.push({ item, correct, wrong: wrong.slice(), stars: earned, missed: [...new Set(firstMissed)] });
    const isLast = session.i === session.items.length - 1;
    const praise = pick(PRAISE);
    const missed = correct ? new Set() : new Set(last.boxes.map((b, g) => (b.ok ? -1 : g)).filter(g => g >= 0));

    app.innerHTML = `
      <section class="panel practice" style="--accent:${esc(session.list.accent)}">
        ${progressHTML()}
        <p class="phase"><span class="dot ${correct ? "good" : "check"}"></span>${correct ? praise[1] : "Let's look at it together"}</p>
        <div class="word-box ${correct ? "right pop" : "reveal"}"><span class="word sounds" lang="en-GB">${wordHTML(item, missed)}</span></div>
        ${correct
          ? `<p class="stars-big" aria-label="${earned} stars">${stars(earned)}<span class="dim">${stars(settings.tries - earned)}</span></p>`
          : `<p class="feedback">This is how we spell <b>${esc(item.spelling)}</b>.${missed.size ? " The orange sounds are the ones to practise." : ""}<br>Say each sound and write it in the air with your finger.</p>`}
        ${wrong.length ? `<p class="attempts-label">Your tries:</p><ul class="attempts">${wrong.map(w => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}
        <div class="row center">
          ${correct ? "" : `<button class="btn" id="hear">🔊 Hear it spelled</button>`}
          <button class="btn big primary" id="next">${isLast ? "See my stars 🏆" : "Next word →"}</button>
        </div>
      </section>`;
    wireStop();
    wireSoundButtons($(".word"), item);

    const sayIt = () => (settings.spellOut ? saySOS(item) : sayWord(item.spelling));
    if (correct) { chimeRight(); later(() => sayPhrase(praise), 350); }
    else { chimeWrong(); later(sayIt, 400); $("#hear").onclick = sayIt; }

    const next = $("#next");
    next.focus();
    next.onclick = () => {
      if (isLast) return showSummary();
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
    const tricky = r.filter(x => !x.correct || x.wrong.length).map(x => x.item);
    const headline = right === r.length
      ? (firstGo === r.length ? "Perfect! Every word right first time!" : "You spelled every word!")
      : `You spelled ${right} out of ${plural(r.length, "word", "words")}!`;

    // Which sounds went wrong on the first try, and in which words — the useful bit for the teacher
    const bySound = {};
    r.forEach(x => x.missed.forEach(tok => { (bySound[tok] = bySound[tok] || []).push(x.item.spelling); }));
    const soundRows = Object.entries(bySound).sort((a, b) => b[1].length - a[1].length);

    app.innerHTML = `
      <section class="panel summary" style="--accent:${esc(session.list.accent)}">
        <p class="trophy" aria-hidden="true">${right === r.length ? "🏆" : "🌟"}</p>
        <h1>${esc(headline)}</h1>
        <p class="meta">${session.pupil && REPORTING ? `${esc(session.pupil)} · ` : ""}${esc(session.list.title)} · ★ ${earned} stars · ${firstGo} right first time</p>
        ${REPORTING ? `<p class="sent no-print" id="sent" aria-live="polite">📤 Sending to your teacher…</p>` : ""}
        ${soundRows.length ? `
          <div class="sound-report">
            <h2>Sounds to practise</h2>
            <ul>${soundRows.map(([tok, words]) => `
              <li><span class="chip">${esc(label(tok))}</span> ${esc(words.join(", "))}</li>`).join("")}
            </ul>
          </div>` : ""}
        <table class="results">
          <thead><tr><th>Word</th><th>Result</th><th>Tries</th></tr></thead>
          <tbody>
            ${r.map(x => `
              <tr class="${x.correct ? "" : "missed"}">
                <td class="rw">${esc(x.item.spelling)}</td>
                <td>${x.correct ? `<span class="star-cell">${stars(x.stars)}</span>` : `<span class="miss">Keep practising</span>`}</td>
                <td class="tries-cell">${x.wrong.length ? x.wrong.map(w => `<s>${esc(w)}</s>`).join(" ") : "—"}</td>
              </tr>`).join("")}
          </tbody>
        </table>
        <div class="row center no-print">
          ${tricky.length ? `<button class="btn primary" id="again-tricky">Practise the ${plural(tricky.length, "tricky word", "tricky words")}</button>` : ""}
          <button class="btn" id="again-all">Do this list again</button>
          <a class="btn" href="#/">Choose another list</a>
          <button class="btn" id="print">🖨️ Print</button>
        </div>
      </section>`;

    sayPhrase(right === r.length ? PHRASES.allRight : PHRASES.finished);
    const my = phase;
    sendReport(session, true).then(sent => {
      const note = $("#sent");
      if (!note || my !== phase || sent === null) return;
      note.textContent = sent ? "✓ Sent to your teacher" : "Couldn't send just now — it will be sent next time.";
      if (sent) flushOutbox();
    });
    const list = session.list;
    if (tricky.length) $("#again-tricky").onclick = () => startPractice(Object.assign({}, list, { title: `${list.title} — tricky words` }), tricky);
    $("#again-all").onclick = () => startPractice(list, list.items);
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
          <div class="mk-preview" id="mkPreview"></div>
          <p class="hint">Check the sound buttons above. If a word is split wrongly, type its sounds with dashes, e.g. <b>h-a-ve</b> or <b>c-oul-d</b>.</p>
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
      const list = parseWords(words.value);
      const n = list.length;
      info.textContent = n ? `${plural(n, "word", "words")}${n >= 30 ? " (that's the most allowed)" : n > 15 ? " — that's quite a lot for one go" : ""}` : "Up to 15 words works best (30 at most).";
      $("#mkPreview").innerHTML = list.map(w => `<span class="mini-word">${wordHTML(analyse(w))}</span>`).join("");
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
    const alba = albaWords.size ? `<option value="${ALBA_ID}">Alba — Scottish (recorded, recommended)</option>` : "";
    const device = voices.map(v => `<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)})</option>`).join("");
    sel.innerHTML = alba + device || `<option value="">No voices found</option>`;
    if (useAlba()) sel.value = ALBA_ID;
    else if (currentVoice()) sel.value = currentVoice().voiceURI;
  }

  function openSettings() {
    fillVoiceSelect();
    $("#setRate").value = settings.rate;
    $("#setLook").value = String(settings.lookSeconds);
    $("#setTries").value = String(settings.tries);
    $("#setShuffle").checked = settings.shuffle;
    $("#setBoxes").checked = settings.boxes;
    $("#setSpell").checked = settings.spellOut;
    $("#setSounds").checked = settings.sounds;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }

  $("#settingsBtn").onclick = openSettings;
  $("#setVoice").onchange = e => { settings.voice = e.target.value; saveSettings(); sayWord("cake"); };
  $("#setRate").onchange = e => { settings.rate = Number(e.target.value); saveSettings(); };
  $("#setLook").onchange = e => { settings.lookSeconds = Number(e.target.value); saveSettings(); };
  $("#setTries").onchange = e => { settings.tries = Number(e.target.value); saveSettings(); };
  $("#setShuffle").onchange = e => { settings.shuffle = e.target.checked; saveSettings(); };
  $("#setBoxes").onchange = e => { settings.boxes = e.target.checked; saveSettings(); };
  $("#setSpell").onchange = e => { settings.spellOut = e.target.checked; saveSettings(); };
  $("#setSounds").onchange = e => { settings.sounds = e.target.checked; saveSettings(); };
  $("#testVoice").onclick = () => sayPhrase(PHRASES.test);
  // Re-draw menus so they show the new settings; never interrupt a pupil mid-practice
  dlg.addEventListener("close", () => { if (!session) route(); });

  /* ---------- Go ---------- */

  if (SITE.fontFile) {
    const face = document.createElement("style");
    face.textContent = `@font-face { font-family: "Sassoon Web"; src: url("${encodeURI(SITE.fontFile)}"); font-display: swap; }`;
    document.head.appendChild(face);
  }
  $("#siteTitle").textContent = SITE.title;
  $("#credits").hidden = !albaWords.size;
  flushOutbox();
  window.addEventListener("online", flushOutbox);
  if (synth) {
    refreshVoices();
    synth.addEventListener?.("voiceschanged", refreshVoices);
  }
  route();
})();
