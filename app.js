/* Spelling Practice — sounds first: hear the word, say its sounds, see how each sound
   is written, then spell it sound by sound.
   Word lists live in words.js. You shouldn't need to edit this file. */
(() => {
  "use strict";

  const SITE = Object.assign({ title: "PopSpell", subtitle: "Hear it. Map it. Spell it." }, window.SITE);
  const STAGES = window.SPELLING_LISTS || [];
  const SENTENCES = window.SENTENCES || {};
  const FOREST = window.PopForest;
  const app = document.getElementById("app");
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Phonics: splitting words into graphemes ---------- */

  // Scottish accents sound the r, so "car" is c·a·r and "hair" is h·ai·r. In most English accents
  // the r is silent and "ar" is one sound: c·ar. The class's teacher sets it for every device in the
  // class; a device that isn't in one uses Settings. Read here, before the lists are split.
  const accentOf = (cls, set) => (cls && cls.accent) || (set && set.accent) || "scottish";
  const ACCENT = (() => {
    const read = key => { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; } };
    return accentOf(read("popspell-class-v1"), read("spelling-settings-v2"));
  })();
  const R_SOUNDED = ACCENT !== "english";
  const R_GRAPHEMES = ["air", "are", "ear", "eer", "ere", "ar", "or", "er", "ir", "ur"];
  const keepR = g => !(R_SOUNDED && R_GRAPHEMES.includes(g));
  // The part a pupil has to choose when the r is sounded: er, ir or ur is the vowel before the r
  const R_VOWEL = { ar: "a", or: "o", er: "e", ir: "i", ur: "u", air: "ai", are: "a_e", ear: "ea", eer: "ee", ere: "e_e" };

  const VOWELS = "aeiou";
  const TRIGRAPHS = ["tch", "igh", "air", "are", "ear", "eer", "ere"].filter(keepR);
  const DIGRAPHS = ["sh", "ch", "th", "wh", "ph", "ck", "ng", "qu", "kn", "wr",
    "ai", "ay", "ee", "ea", "oa", "ow", "oo", "ou", "oi", "oy", "aw", "au", "ew", "ue",
    "ar", "or", "er", "ir", "ur", "bb", "dd", "ff", "gg", "ll", "mm", "nn", "pp", "rr", "ss", "tt", "zz"].filter(keepR);

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
      // With the r sounded, "scared" and "cares" keep their split digraph too: sc·a_e·r·d
      const endE = i + 2 === w.length - 1 || (R_SOUNDED && w[i + 1] === "r" && i + 2 === w.length - 2 && "ds".includes(w[w.length - 1]));
      if (VOWELS.includes(c) && endE && w[i + 2] === "e" && !VOWELS.includes(w[i + 1]) && !"wy".includes(w[i + 1])) {
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
    return {
      entry: raw, spelling, tokens, chunks, charG,
      whole: hasDashes && tokens.length === 1,
      sentence: SENTENCES[spelling.toLowerCase()] || ""
    };
  }

  const label = tok => tok.replace("_", "–");
  const letterNames = text => text.toUpperCase().split("").join(" ");

  // Sounds a list is practising: its "focus", or graphemes found in most of its words
  function listFocus(list) {
    if (Array.isArray(list.focus)) return new Set(list.focus.map(g => (keepR(g) ? g : R_VOWEL[g])));
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
    const ready = Object.assign({}, extras, list, {
      tip: R_SOUNDED && list.tipScottish ? list.tipScottish : list.tip,
      items: list.words.map(analyse),
      // New words with the same pattern, never shown first: can the pupil use the rule?
      checks: (list.check || []).map(w => Object.assign(analyse(w), { challenge: true }))
    });
    ready.focusSet = listFocus(ready);
    return ready;
  };
  STAGES.forEach(stage => stage.lists.forEach(list => {
    LISTS[list.id] = prepare(list, { stage: stage.stage, accent: stage.colour });
  }));

  /* ---------- Settings (kept in this browser only) ---------- */

  const DEFAULTS = { rate: 0.85, voice: "", accent: "scottish", tries: 3, shuffle: true, spellOut: true, sounds: true,
    sentences: true, checks: true };
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

  const currentVoice = () => voices[0] || null;

  // Resolves when speaking finishes (or after a safety timeout, as some browsers never fire onend)
  function speak(text, rate = settings.rate) {
    stopRecorded();
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

  /* ---------- Recorded voice (Pocket TTS "eponine", made by tools/make_audio.py) ---------- */

  const RECORDED = Object.assign({ words: [], letters: false, phrases: [], sentences: [] }, window.POPSPELL_AUDIO);
  const recWords = new Set(RECORDED.words);
  const recPhrases = new Set(RECORDED.phrases);
  const recSentences = new Set(RECORDED.sentences);
  const RECORDED_ID = "alba"; // the saved setting's name from before; kept so devices keep their choice
  const useRecorded = () => recWords.size > 0;

  // One shared player: iPads only allow sound from an element that first played during a tap
  const player = new Audio();
  player.preload = "auto";
  let playToken = 0;
  function stopRecorded() {
    playToken++;
    player.pause();
  }

  // speed: 1 is the Settings speed; reading aloud can go slower (see readSpeed)
  function playClip(url, token, speed = 1) {
    return new Promise(resolve => {
      let done = false;
      const finish = ok => { if (!done) { done = true; clearTimeout(guard); resolve(ok); } };
      // A safety net in case "ended" never fires, stretched to the clip's length once it's known
      let guard = setTimeout(() => finish(true), 8000);
      player.onloadedmetadata = () => {
        if (!isFinite(player.duration)) return;
        clearTimeout(guard);
        guard = setTimeout(() => finish(true), (player.duration / player.playbackRate) * 1000 + 1500);
      };
      player.onended = () => finish(true);
      player.onerror = () => finish(false);
      player.src = url;
      player.defaultPlaybackRate = player.playbackRate = (settings.rate / DEFAULTS.rate) * speed;
      if (token !== playToken) return finish(null);
      player.play().catch(() => finish(false));
    });
  }

  // Steps are clip addresses or pauses in ms. Resolves true when done, false if a clip
  // couldn't play (so the device voice can take over), null if something else interrupted it.
  async function playSteps(steps, speed = 1) {
    if (synth) synth.cancel();
    const token = ++playToken;
    for (const step of steps) {
      if (token !== playToken) return null;
      if (typeof step === "number") { await new Promise(r => setTimeout(r, step)); continue; }
      const ok = await playClip(step, token, speed);
      if (ok !== true) return token === playToken ? ok : null;
    }
    return token === playToken ? true : null;
  }
  const orSpeak = (steps, text, rate, speed = 1) => playSteps(steps, speed).then(ok => (ok === false ? speak(text, rate) : ok));

  const wordClip = w => `audio/words/${encodeURIComponent(w.toLowerCase())}.mp3`;
  const hasWordClip = w => useRecorded() && recWords.has(w.toLowerCase());
  const hasLetterClips = text => useRecorded() && RECORDED.letters && /^[a-z]+$/i.test(text);
  const letterSteps = text => text.toLowerCase().split("").flatMap((c, n) => (n ? [150, `audio/letters/${c}.mp3`] : [`audio/letters/${c}.mp3`]));

  const sayWord = w => (hasWordClip(w) ? orSpeak([wordClip(w)], w) : speak(w));
  const sayLetters = text => (hasLetterClips(text) ? orSpeak(letterSteps(text), letterNames(text)) : speak(letterNames(text)));
  const sayPhrase = ([key, text]) => (useRecorded() && recPhrases.has(key) ? orSpeak([`audio/phrases/${key}.mp3`], text) : speak(text));
  function saySOS(item) {
    const w = item.spelling;
    if (!hasWordClip(w) || !hasLetterClips(w)) return speak(sos(item), settings.rate * 0.9);
    const steps = [wordClip(w), 500];
    item.chunks.forEach(ch => steps.push(...letterSteps(ch.text), 500));
    steps.push(wordClip(w));
    return orSpeak(steps, sos(item), settings.rate * 0.9);
  }

  const sentenceClip = w => `audio/sentences/${encodeURIComponent(w.toLowerCase())}.mp3`;
  const hasSentenceClip = item => hasWordClip(item.spelling) && recSentences.has(item.spelling.toLowerCase());
  const wantSentence = item => settings.sentences && !!item.sentence;

  // Like a spelling test: the word, the word in its sentence, then the word again
  function sayWordInSentence(item) {
    const w = item.spelling;
    if (!wantSentence(item)) return sayWord(w);
    const text = `${w}. ${item.sentence} ${w}.`;
    return hasSentenceClip(item) ? orSpeak([wordClip(w), 600, sentenceClip(w), 600, wordClip(w)], text) : speak(text);
  }
  const saySentence = item => (hasSentenceClip(item) ? orSpeak([sentenceClip(item.spelling)], item.sentence) : speak(item.sentence));

  // The sentence on screen, with the word picked out (look) or left blank (spell)
  function sentenceHTML(item, blank) {
    if (!wantSentence(item)) return "";
    const re = new RegExp(`\\b${item.spelling}\\b`, "gi");
    const html = esc(item.sentence).replace(re, m => (blank ? `<span class="blank" aria-label="blank">______</span>` : `<b>${m}</b>`));
    return `<p class="sentence">${html}</p>`;
  }

  // Keep in step with PHRASES in tools/make_audio.py
  const PHRASES = {
    allRight: ["all-right", "Fantastic! You spelled every word."],
    // Games and number work: not every question is a word to spell
    allDone: ["all-done", "Fantastic! You got every one right."],
    tryAgain: ["try-again", "Not quite. Have another go."],
    finished: ["finished", "Well done! Have a look at your stars."],
    test: ["test", "Can you spell the word, cake?"]
  };
  const PRAISE = [["well-done", "Well done!"], ["brilliant", "Brilliant!"], ["super", "Super spelling!"],
    ["fantastic", "Fantastic!"], ["great-job", "Great job!"], ["got-it", "You got it!"], ["amazing", "Amazing!"]];
  // The same, without "Super spelling!", for games and number questions
  const ACTIVITY_PRAISE = PRAISE.filter(([key]) => key !== "super");

  /* ---------- Classes: results go to the pupil's teacher (stored in Firebase, see cloud.js) ---------- */

  // A device joins a class once, with a link (#/join/CODE) or by typing the class code,
  // and from then on its pupils' results, live progress and help requests go to that class.
  const CLOUD_CONFIGURED = !!(SITE.firebase && SITE.firebase.apiKey);
  const CLASS_KEY = "popspell-class-v1";
  const PUPIL_KEY = "spelling-pupil-v1";
  const getPupil = () => { try { return localStorage.getItem(PUPIL_KEY) || ""; } catch { return ""; } };
  const setPupil = name => { try { if (name) localStorage.setItem(PUPIL_KEY, name); else localStorage.removeItem(PUPIL_KEY); } catch { /* private mode */ } };
  const cleanName = s => String(s).replace(/[^\p{L}\p{N}' .-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 30);

  let cloud = null;    // window.PopCloud once connected
  let TEACHER = null;  // the signed-in teacher on this device, if any
  let CLASS = (() => { try { return JSON.parse(localStorage.getItem(CLASS_KEY)) || null; } catch { return null; } })();
  let REPORTING = false;
  let previewMode = false;
  const previewBanner = () => previewMode ? `<p class="preview-banner">👀 Teacher preview · Nothing here is saved to a pupil. Close this tab to return to planning.</p>` : "";
  const updateReporting = () => { REPORTING = !!(cloud && CLASS); };
  function saveClass(c) {
    CLASS = c;
    try { if (c) localStorage.setItem(CLASS_KEY, JSON.stringify(c)); else localStorage.removeItem(CLASS_KEY); } catch { /* not remembered */ }
    updateReporting();
  }
  // Joining or leaving a class (or the teacher changing it) can change the accent; the lists are
  // split into sounds when the page loads, so it takes a fresh start. Never mid-practice.
  const accentChanged = () => accentOf(CLASS, settings) !== ACCENT;
  const reloadForAccent = () => { if (accentChanged() && !session) { location.reload(); return true; } return false; };

  // Resolves true once the teacher has it, false if it's still waiting (it's kept on the
  // device and sent when the connection is back), null if there's nothing to send
  function sendReport(s, finished) {
    if (!REPORTING || s.preview || s.sent || !s.results.length) return Promise.resolve(null);
    s.sent = true;
    const payload = {
      pupil: s.pupil,
      list: s.list.title,
      listId: s.list.id || "custom",
      finished,
      words: s.results.map(r => ({
        word: r.item.spelling,
        sounds: r.item.tokens.map(label).join("·"),
        correct: r.correct,
        challenge: !!r.item.challenge,
        triesUsed: r.correct ? (["map", "switch", "canopy"].includes(r.item.kind) ? (r.wrong.length ? 2 : 1) : r.wrong.length + 1) : null,
        wrong: r.wrong,
        missed: r.missed.map(label),
        ...(Number.isFinite(r.seconds) ? { seconds: r.seconds } : {}),
        ...(r.methods?.length ? { methods: r.methods } : {}),
        // Starting checks: the list or activity each word was testing
        ...(r.item.from ? { from: r.item.from } : {})
      }))
    };
    const saved = cloud.session(CLASS.id, payload).then(() => true, err => { console.warn("PopSpell: report not sent", err); return false; });
    return Promise.race([saved, new Promise(r => setTimeout(() => r(false), 8000))]);
  }

  // Live class: tells the teacher's dashboard where this pupil is up to (best effort, never queued)
  function liveStats(s) {
    const firstTry = x => x.correct && !x.wrong.length;
    const run = test => { let n = 0; for (let k = s.results.length - 1; k >= 0 && test(s.results[k]); k--) n++; return n; };
    return {
      done: s.results.length,
      right: s.results.filter(firstTry).length,
      missedRow: run(x => !x.correct),
      notFirstRow: run(x => !firstTry(x))
    };
  }
  function livePing(s, event, extra = {}) {
    if (!REPORTING || !s || s.preview || !s.pupil) return;
    const stats = event === "start" ? { done: 0, right: 0, missedRow: 0, notFirstRow: 0 } : liveStats(s);
    const fields = Object.assign({
      list: s.list.title,
      total: s.items.length,
      status: { start: "working", word: "working", end: "finished", stop: "stopped" }[event] || "working"
    }, stats);
    if (extra.word) fields.lastWord = `${extra.word} ${extra.ok ? "✓" : "✗"}`;
    if (event === "start") fields.lastWord = "";
    cloud.live(CLASS.id, s.pupil, fields).catch(() => { /* the next update will catch up */ });
  }
  function askForHelp(on) {
    if (!REPORTING || previewMode || !getPupil()) return;
    cloud.live(CLASS.id, getPupil(), { help: on, helpAt: on ? Date.now() : null }).catch(() => {});
  }
  // Leaving a list part-way: the report and the dashboard both hear about it
  function leaveSession(s) {
    if (!s) return;
    const wasRunning = !s.ended;
    if (wasRunning) livePing(s, "stop");
    s.ended = true;
    sendReport(s, false);
    if (wasRunning && !s.preview) syncProgress(); // the words done so far count on every device
  }

  // "Your lists today": looked up by a fingerprint (SHA-256) of the pupil's name, so a device
  // can only ever fetch the lists for the name typed on it
  async function fetchAssigned(name) {
    if (!REPORTING || !name) return [];
    try { return await cloud.assigned(CLASS.id, name); } catch { return []; }
  }

  // An assigned entry can be a list id, an activity id (activities.js), a list title, or a "Make a list" link
  function resolveAssigned(entry) {
    const text = String(entry).trim();
    if (LISTS[text]) return { href: `#/list/${encodeURIComponent(text)}`, title: LISTS[text].title, example: LISTS[text].items[0]?.spelling, accent: LISTS[text].accent };
    if (text === QUEST_ID) return { href: "#/assess", title: "Pip's Sound Quest", example: "🌟", accent: "#F59E0B" };
    const check = checkKind(text);
    if (check) return { href: `#/check/${check}`, title: CHECKS[check].title, example: CHECKS[check].icon, accent: CHECKS[check].accent };
    const act = window.PopActivities && window.PopActivities.get(text);
    if (act) return { href: `#/activity/${encodeURIComponent(act.id)}`, title: act.title, example: act.icon, accent: act.colour };
    const byTitle = Object.values(LISTS).find(l => l.title.toLowerCase() === text.toLowerCase());
    if (byTitle) return { href: `#/list/${encodeURIComponent(byTitle.id)}`, title: byTitle.title, example: byTitle.items[0]?.spelling, accent: byTitle.accent };
    const at = text.indexOf("#/custom?");
    if (at >= 0) {
      const hash = text.slice(at);
      const params = new URLSearchParams(hash.split("?")[1]);
      const words = parseWords(params.get("words") || "");
      if (words.length) return { href: hash, title: params.get("title") || "Your teacher's list", example: analyse(words[0]).spelling, accent: "#0f766e" };
    }
    return null;
  }

  /* ---------- Each pupil's progress: spaced review and "My sounds" (kept on this device) ---------- */

  const PROGRESS_KEY = "spelling-progress-v1";
  // Days until a word comes back, by box: missed words return tomorrow, secure ones after a month
  const INTERVALS = [0, 1, 3, 7, 14, 30];
  const REVIEW_SIZE = 10;

  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const addDays = (key, n) => { const [y, m, d] = key.split("-").map(Number); return dayKey(new Date(y, m - 1, d + n)); };
  const pupilKey = () => (getPupil() || "this device").toLowerCase();

  const readAllProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch { return {}; } };
  const loadProgress = () => Object.assign({ words: {}, sounds: {} }, readAllProgress()[pupilKey()]);
  function saveProgress(prog) {
    const all = readAllProgress();
    all[pupilKey()] = prog;
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); } catch { /* full or private mode */ }
  }

  /* ---------- Progress follows the pupil between devices in their class (school and home) ---------- */

  // Two copies of a pupil's progress made one, keeping the newest of everything: each word's most
  // recent practice, each sound's fuller history, and the higher of every best.
  function mergeProgress(a, b) {
    const union = (x, y) => [...new Set(Object.keys(x || {}).concat(Object.keys(y || {})))];
    const pick = (x, y, better) => (!x ? y : !y ? x : better(x, y) ? x : y);
    const words = {};
    union(a.words, b.words).forEach(k => {
      words[k] = pick((a.words || {})[k], (b.words || {})[k], (x, y) =>
        (x.last || "") > (y.last || "") || ((x.last || "") === (y.last || "") && x.right + x.missed >= y.right + y.missed));
    });
    const sounds = {};
    union(a.sounds, b.sounds).forEach(k => {
      const x = (a.sounds || {})[k], y = (b.sounds || {})[k];
      const best = pick(x, y, (p, q) => p.right + p.wrong >= q.right + q.wrong);
      sounds[k] = Object.assign({}, best, { days: [...new Set(((x || {}).days || []).concat((y || {}).days || []))].sort().slice(-10) });
    });
    const ab = Object.assign({ weeks: {}, lists: {} }, a.bests), bb = Object.assign({ weeks: {}, lists: {} }, b.bests);
    const weeks = {};
    union(ab.weeks, bb.weeks).forEach(k => { weeks[k] = Math.max(ab.weeks[k] || 0, bb.weeks[k] || 0); });
    const lists = {};
    union(ab.lists, bb.lists).forEach(k => { lists[k] = pick(ab.lists[k], bb.lists[k], (x, y) => x.best >= y.best); });
    return { words, sounds, bests: { weeks, lists, forest: FOREST.merge(ab.forest, bb.forest) } };
  }

  // Fetches the class's copy, merges it with this device's, and saves both. Resolves true if this
  // device learned something new (so the screen can redraw). Offline, it simply waits for next time.
  let syncedFor = null;
  let progressSyncQueue = Promise.resolve();
  function syncProgress() {
    const next = progressSyncQueue.then(syncProgressOnce, syncProgressOnce);
    progressSyncQueue = next.then(() => {}, () => {});
    return next;
  }
  async function syncProgressOnce() {
    const name = getPupil();
    if (!REPORTING || !name || previewMode) return false;
    syncedFor = name;
    try {
      const remote = await cloud.progress(CLASS.id, name);
      if (name !== getPupil()) return false;
      const local = loadProgress();
      const merged = remote ? mergeProgress(local, remote) : local;
      const learned = JSON.stringify(mergeProgress(local, local)) !== JSON.stringify(mergeProgress(merged, merged));
      saveProgress(merged);
      if (Object.keys(merged.words).length || FOREST.earned(merged.bests?.forest))
        await cloud.saveProgress(CLASS.id, name, merged);
      return learned;
    } catch (err) {
      console.warn("PopSpell: progress not synced", err);
      return false;
    }
  }

  const forestState = (prog = loadProgress()) => FOREST.normalise(prog.bests?.forest);
  function saveForestState(state) {
    const prog = loadProgress();
    prog.bests = Object.assign({ weeks: {}, lists: {} }, prog.bests, { forest: FOREST.normalise(state) });
    saveProgress(prog);
  }

  // A sound is secure once it's been spelled right first time at least 4 times, on 2+ different
  // days, and the last 3 times in a row — so one lucky day doesn't count
  function soundLevel(s) {
    if (!s) return "new";
    const recent = s.recent || [];
    if (s.right >= 4 && (s.days || []).length >= 2 && recent.length >= 3 && recent.slice(-3).every(Boolean)) return "secure";
    return recent.slice(-2).includes(false) ? "tricky" : "learning";
  }
  const secureSounds = prog => new Set(Object.keys(prog.sounds).filter(t => soundLevel(prog.sounds[t]) === "secure"));

  // Called once per word with how the pupil did on their first try
  function recordProgress(item, correct, wrongCount, firstMissed) {
    const prog = loadProgress();
    const today = dayKey();
    const key = item.spelling.toLowerCase();
    const firstTry = correct && wrongCount === 0;
    const w = prog.words[key] || { entry: item.entry, box: 0, right: 0, missed: 0 };
    w.box = firstTry ? (w.box === 0 ? 2 : Math.min(w.box + 1, INTERVALS.length - 1)) : 1;
    w.due = addDays(today, INTERVALS[w.box]);
    w.entry = item.entry;
    w.last = today;
    if (firstTry) w.right++; else w.missed++;
    prog.words[key] = w;

    if (!item.whole) {
      const missed = new Set(firstMissed);
      new Set(item.tokens).forEach(tok => {
        const s = prog.sounds[tok] || { right: 0, wrong: 0, days: [], recent: [], words: [] };
        const ok = !missed.has(tok);
        if (ok) s.right++; else s.wrong++;
        s.recent = s.recent.concat(ok).slice(-5);
        if (ok && !s.days.includes(today)) s.days = s.days.concat(today).slice(-10);
        s.words = [key].concat(s.words.filter(x => x !== key)).slice(0, 8);
        prog.sounds[tok] = s;
      });
    }
    tally(prog);
    saveProgress(prog);
  }

  // Words due for review today, most overdue first
  function dueItems(prog = loadProgress()) {
    const today = dayKey();
    return Object.values(prog.words)
      .filter(w => w.due <= today)
      .sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.box - b.box))
      .slice(0, REVIEW_SIZE)
      .map(w => analyse(w.entry));
  }

  /* ---------- Personal bests: each pupil only ever races their own record ---------- */

  // Kept with the pupil's progress. "Goes" counts every word and question tried, right or wrong,
  // so effort counts as well as accuracy. Weeks start on Monday. Only the lists and activities
  // with a fixed id keep a best score (review and "Make a list" words change each time).
  const weekKey = (d = new Date()) => dayKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() + 6) % 7));
  const loadBests = (prog = loadProgress()) => Object.assign({ weeks: {}, lists: {} }, prog.bests);
  const bestTitle = id => (LISTS[id] && LISTS[id].title) || (window.PopActivities && window.PopActivities.get(id) || {}).title || "";

  function tally(prog) {
    const b = loadBests(prog);
    const wk = weekKey();
    b.weeks[wk] = (b.weeks[wk] || 0) + 1;
    b.weeks = Object.fromEntries(Object.entries(b.weeks).sort().slice(-60));
    prog.bests = b;
  }
  function countGo() {
    const prog = loadProgress();
    tally(prog);
    saveProgress(prog);
  }

  // This week's goes, the best earlier week, and how many weeks in a row (this week counts once started)
  function weekStats(b) {
    const wk = weekKey();
    const thisWeek = b.weeks[wk] || 0;
    const bestWeek = Math.max(0, ...Object.entries(b.weeks).filter(([k]) => k !== wk).map(([, n]) => n));
    let run = 0;
    for (let k = thisWeek ? wk : addDays(wk, -7); b.weeks[k]; k = addDays(k, -7)) run++;
    return { thisWeek, bestWeek, run };
  }

  // Taken when a list starts, so the results screen can tell what this go has beaten
  function bestsSnapshot(list, full) {
    const b = loadBests();
    const scored = full && !!bestTitle(list.id);
    return Object.assign(weekStats(b), { scored, best: scored ? b.lists[list.id] || null : null });
  }

  // On the results screen: saves a new best score and returns what's worth celebrating
  function personalBests(s, firstGo, total) {
    if (s.preview) return [];
    const before = s.bestsBefore;
    if (!before) return [];
    const prog = loadProgress();
    const b = loadBests(prog);
    const now = weekStats(b);
    const notes = [];
    const old = before.best;
    if (before.scored) {
      if (!old) notes.push({ big: true, text: `First go: ${firstGo} right first time. That's your score to beat!` });
      else if (firstGo > old.best) notes.push({ big: true, text: `New personal best: ${firstGo} right first time! Your old best was ${old.best}.` });
      else if (firstGo === old.best) notes.push({ big: true, text: `You matched your best: ${firstGo} right first time!` });
      else notes.push({ text: `Your best here is ${old.best} right first time. Have another go to beat it!` });
      if (!old || firstGo > old.best) {
        b.lists[s.list.id] = { best: firstGo, of: total, day: dayKey() };
        prog.bests = b;
        saveProgress(prog);
      }
    }
    if (!before.bestWeek) notes.push({ text: `${plural(now.thisWeek, "go", "goes")} this week.` });
    else if (now.thisWeek > before.bestWeek && before.thisWeek <= before.bestWeek) notes.push({ big: true, text: `Your best week ever: ${plural(now.thisWeek, "go", "goes")}!` });
    else if (now.thisWeek > before.bestWeek) notes.push({ text: `Best week ever: ${plural(now.thisWeek, "go", "goes")} and counting!` });
    else notes.push({ text: `${plural(now.thisWeek, "go", "goes")} this week. ${before.bestWeek - now.thisWeek + 1} more to beat your best week!` });
    if (now.run >= 2 && now.run > before.run) notes.push({ big: true, text: `${now.run} weeks in a row! 🔥` });
    return notes;
  }
  const bestsHTML = notes => notes.length ? `
    <div class="bests${notes.some(n => n.big) ? " pop" : ""}">
      ${notes.map(n => `<p class="${n.big ? "pb-big" : ""}">${n.big ? "🏅 " : ""}${esc(n.text)}</p>`).join("")}
      <a class="linklike" href="#/bests">See my bests</a>
    </div>` : "";

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
    document.body.classList.remove("playing-game");
    if (synth) synth.cancel();
    stopRecorded();
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
    // A newer PopSpell is out and nothing is part-way through: load it instead of the next page.
    // (If a list was left part-way, its results are saved first and the update waits for the next move.)
    if (updateReady && !busy()) { location.reload(); return; }
    newScreen();
    leaveSession(session); // left part-way through a list
    session = null;
    const hash = location.hash.replace(/^#/, "") || "/";
    const [path, query = ""] = hash.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(query);
    previewMode = params.get("preview") === "1";

    const activity = parts[0] === "activity" && window.PopActivities ? window.PopActivities.get(decodeURIComponent(parts[1] || "")) : null;
    if (parts[0] === "list" && LISTS[parts[1]]) showStart(LISTS[parts[1]]);
    else if (activity) showActivityStart(activity);
    else if (parts[0] === "custom" && parseWords(params.get("words") || "").length) {
      showStart(prepare({
        title: params.get("title") || "My spelling list",
        words: parseWords(params.get("words"))
      }, { stage: "Your teacher's list", accent: "#0f766e" }));
    }
    // A home login link (#/join/CODE?pupil=Ava) also signs this device in as that pupil
    // then=assess (the teacher's New pupil link) goes straight on to Pip's Sound Quest
    else if (parts[0] === "join") joinClass(decodeURIComponent(parts[1] || ""), null, cleanName(params.get("pupil") || ""), params.get("then") === "assess" ? "#/assess" : "#/");
    else if (parts[0] === "assess") showQuest();
    else if (parts[0] === "teacher" && window.PopTeacher) window.PopTeacher.show(app, decodeURIComponent(parts[1] || ""));
    else if (parts[0] === "make" && teacherUnlocked()) showMake();
    else if (parts[0] === "make") { history.replaceState(null, "", "#/"); showHome(); } // locked: back to the lists
    else if (parts[0] === "sounds") showSounds();
    else if (parts[0] === "bests") showBests();
    else if (parts[0] === "forest") showForest();
    else if (parts[0] === "stories") showStories();
    else if (parts[0] === "check" && CHECKS[parts[1]] && (parts[1] === "spelling" || window.PopActivities)) showCheckStart(parts[1]);
    else if (parts[0] === "review" && dueItems().length) showStart(reviewList());
    else if (parts[0] === "sound" && soundList(decodeURIComponent(parts[1] || ""))) showStart(soundList(decodeURIComponent(parts[1])));
    else showHome();
    window.scrollTo(0, 0);
  }

  // A class link (#/join/K7P2QX) or a typed code puts this device in that teacher's class
  async function joinClass(code, onDone, pupil = "", then = "#/") {
    const my = phase;
    if (!onDone) app.innerHTML = `<section class="panel start"><h1>Joining the class…</h1></section>`;
    const api = await window.PopCloudReady;
    const info = api ? await api.classInfo(code).catch(() => null) : null;
    if (my !== phase && !onDone) return;
    if (!info) {
      if (onDone) return onDone(false);
      app.innerHTML = `<section class="panel start"><h1>Hmm, that class code didn't work</h1>
        <p>Please check the code with your teacher.</p><a class="btn primary" href="#/">Go to the lists</a></section>`;
      return;
    }
    saveClass(info);
    if (pupil) setPupil(pupil); // their progress and homework load on the home page
    justJoined = true;
    if (!onDone) history.replaceState(null, "", then);
    if (reloadForAccent()) return; // the class uses the other accent
    if (onDone) return onDone(true);
    if (then === "#/assess") showQuest(); else showHome();
  }
  let justJoined = false;

  // Today's review: words from any list that are due to come back
  const reviewList = () => ({
    id: "review", title: "Review", stage: "Words to practise again", accent: "#0f766e",
    tip: "These words are from earlier lessons. Let's see if you remember them!",
    items: dueItems(), checks: [], focusSet: new Set()
  });

  // Practise one sound: the pupil's own words with it first, then others from the lists
  function soundList(tok) {
    if (!tok || !SOUND_ORDER.includes(tok)) return null;
    const mine = new Set((loadProgress().sounds[tok] || {}).words || []);
    const seen = new Set();
    const all = [];
    STAGES.forEach(st => st.lists.forEach(l => LISTS[l.id].items.forEach(it => {
      const key = it.spelling.toLowerCase();
      if (!it.whole && it.tokens.includes(tok) && !seen.has(key)) { seen.add(key); all.push(it); }
    })));
    const pick = all.filter(it => mine.has(it.spelling.toLowerCase())).concat(shuffle(all.filter(it => !mine.has(it.spelling.toLowerCase()))));
    const home = Object.values(LISTS).find(l => l.focusSet.has(tok));
    return {
      id: `sound-${tok}`, title: `Practise ${label(tok)}`, stage: "My sounds", accent: home?.accent || "#0f766e",
      tip: home?.tip || "", items: pick.slice(0, REVIEW_SIZE), checks: [], focusSet: new Set([tok])
    };
  }

  // Every grapheme used in the lists, in teaching order
  const SOUND_ORDER = (() => {
    const seen = [];
    STAGES.forEach(st => st.lists.forEach(l => LISTS[l.id].items.forEach(it => {
      if (!it.whole) it.tokens.forEach(t => { if (!seen.includes(t)) seen.push(t); });
    })));
    return seen;
  })();

  // "What's your name?" or "Spelling as Ava · Not Ava?" — the name is remembered on this device
  function mountPupil(box, { onChange, onEnter, lead = "Spelling as" } = {}) {
    const name = getPupil();
    // lead "" (the home page, which already greets them by name) leaves just "Not Ava?"
    box.innerHTML = name
      ? `<p>${lead ? `${esc(lead)} <b>${esc(name)}</b> · ` : ""}<button type="button" class="linklike not-me">Not ${esc(name)}?</button></p>`
      : `<label class="field pupil-field">What's your name?
           <input class="pupil-name" maxlength="30" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="First name">
         </label>
         <p class="hint pupil-hint"></p>`;
    if (name) {
      box.querySelector(".not-me").onclick = () => {
        setPupil("");
        if (onChange) onChange();
        else { mountPupil(box, { onChange, onEnter, lead }); box.querySelector(".pupil-name").focus(); }
      };
    } else {
      box.querySelector(".pupil-name").onkeydown = e => { if (e.key === "Enter" && onEnter) onEnter(); };
    }
  }

  // Saves the typed name; false (with a nudge) if there isn't one yet
  function takePupilName(box) {
    if (getPupil()) return true;
    const input = box.querySelector(".pupil-name");
    const name = cleanName(input.value);
    if (!name) {
      box.querySelector(".pupil-hint").textContent = REPORTING
        ? "Type your name first, so your teacher can see how you did."
        : "Type your name first, so your stars and sounds are saved.";
      input.focus();
      return false;
    }
    setPupil(name);
    return true;
  }
  window.addEventListener("hashchange", route);
  window.addEventListener("pagehide", () => leaveSession(session));

  /* ---------- Updates: tablets left open pick up a new version by themselves ---------- */

  // The version this page loaded, from app.js?v=…; the test pages have none, so they never check
  const LOADED_VERSION = (([...document.scripts].find(s => /app\.js\?v=/.test(s.src)) || {}).src || "").split("?v=")[1] || "";
  let updateReady = false;
  const inTeacherArea = () => /^#\/(teacher|make)/.test(location.hash);
  const busy = () => !!(session && !session.ended);
  // Pupils' pages update at their next move between pages (see route) or when the tablet wakes,
  // never in the middle of a list, game or story. Teachers get a Refresh button instead.
  function offerUpdate() {
    if (inTeacherArea()) {
      if ($("#updateBar")) return;
      const bar = document.createElement("div");
      bar.id = "updateBar";
      bar.className = "update-bar";
      bar.setAttribute("role", "status");
      bar.innerHTML = `✨ PopSpell has been updated. <button type="button" class="btn small primary">Refresh</button>`;
      bar.querySelector("button").onclick = () => location.reload();
      document.body.append(bar);
    } else if (document.hidden && !busy()) location.reload();
  }
  async function checkForUpdate() {
    if (!LOADED_VERSION || updateReady || !navigator.onLine) return;
    try {
      const html = await (await fetch(`./?version=${Date.now()}`, { cache: "no-store" })).text();
      const live = (html.match(/app\.js\?v=([\w.-]+)/) || [])[1];
      if (live && live !== LOADED_VERSION) { updateReady = true; offerUpdate(); }
    } catch { /* offline: try again next time */ }
  }
  if (LOADED_VERSION) {
    setTimeout(checkForUpdate, 30e3);
    setInterval(checkForUpdate, 5 * 60e3);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) return;
      if (updateReady && !busy() && !inTeacherArea()) location.reload();
      else checkForUpdate();
    });
  }

  /* ---------- Home ---------- */

  /* ---------- Home: Pip's welcome, today's work, the sound journey and more to explore ---------- */

  // Pip, the PopSpell mascot (art in assets/brand). pose is the picture: mascot (welcome), hop
  // (on the journey), listen (before starting), think (checks, sounds, stories) or celebrate
  // (results, bests). mood is the animation: bob, hop or cheer.
  const pipHTML = (size, mood = "bob", says = "", pose = "mascot") => `
    <div class="pip-wrap pip-${size}">
      <img class="pip ${mood}" src="assets/brand/pip-${pose}${size === "small" ? "-small" : ""}.webp" alt="Pip" width="${size === "small" ? 80 : 180}" height="${size === "small" ? 80 : 180}">
      ${says ? `<p class="speech" aria-live="polite">${says}</p>` : ""}
    </div>`;

  // Pip says what's in his speech bubble whenever it appears or changes, and tapping Pip (or the
  // bubble) says it again, so children who can't read yet know what he's saying. Fixed lines are
  // Eponine recordings: keep in step with PIP_LINES in tools/make_audio.py. A child's name is left
  // out of the recording ("Hi Ava! …" plays "Hi! …"); anything else uses the device voice.
  const START_LINE = "Ready? Press the big button to start!";
  const dueLine = n => `You've got ${plural(n, "word", "words")} to practise again. Let's go!`;
  const setLine = n => `Your teacher has set you ${plural(n, "thing", "things")} for today. ${n === 1 ? "It's" : "They're"} just below!`;
  let pipKeys = null; // built on first use, once QUEST exists
  function pipKeyFor(text) {
    if (!pipKeys) {
      pipKeys = new Map([["Hi! I'm Pip. What's your name?", "pip-name"], ["Pick a stop on our journey. I'll hop along with you!", "pip-journey"],
        ["Hi! Will you help me visit my five islands?", "pip-quest"], ["We did it! Thank you for helping me!", "pip-quest-done"], [START_LINE, "pip-start"]]);
      for (let n = 1; n <= 12; n++) { pipKeys.set(dueLine(n), `pip-due-${n}`); pipKeys.set(setLine(n), `pip-set-${n}`); }
      QUEST.forEach(isl => pipKeys.set(isl.intro, `pip-island-${isl.key}`));
    }
    return pipKeys.get(text) || pipKeys.get(text.replace(/^Hi [^!]{1,40}! /, "Hi! "));
  }
  // Emoji aren't read out: 🔊 becomes "the speaker", the rest are dropped
  const forSpeech = text => text.replace(/🔊/g, "the speaker").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "").replace(/\s+/g, " ").trim();
  function sayPip(text) {
    const key = pipKeyFor(text);
    return key ? sayPhrase([key, forSpeech(text)]) : speak(forSpeech(text));
  }
  const bubbleText = el => el.textContent.replace(/\s+/g, " ").trim();
  let pipSaid = "";
  new MutationObserver(() => {
    const bubble = app.querySelector(".speech");
    const text = bubble ? bubbleText(bubble) : "";
    if (!text) { pipSaid = ""; return; }
    if (text !== pipSaid) { pipSaid = text; later(() => sayPip(text), 300); }
  }).observe(app, { childList: true, subtree: true, characterData: true });
  app.addEventListener("click", e => {
    const wrap = e.target.closest(".pip-wrap");
    const bubble = wrap && wrap.querySelector(".speech");
    if (bubble) sayPip(bubbleText(bubble));
  });

  let homeStage = null; // the journey stop being looked at (this visit)
  let homeArea = "games"; // the "More to explore" tab
  const stageDone = (stage, b) => stage.lists.filter(l => b.lists[l.id]).length;
  // The child's current stop: the first stage they haven't finished every list of
  const currentStage = b => Math.max(0, STAGES.findIndex(st => stageDone(st, b) < st.lists.length));

  function exploreAreas() {
    const A = window.PopActivities;
    // Short tab names, so the tabs fit on a phone
    const SHORT = { games: "Games", writing: "Writing", reading: "Reading", listening: "Listening", numeracy: "Numbers" };
    const areas = A ? A.AREAS.filter(a => a.id !== "stories").map(a => ({ id: a.id, icon: a.icon, title: SHORT[a.id] || a.title.replace(/:.*$/, ""), colour: a.colour, items: a.activities })) : [];
    areas.push({ id: "checks", icon: "🧭", title: "Checks", colour: "#0f766e",
      items: Object.entries(CHECKS).filter(([k]) => k === "spelling" || A).map(([k, c]) => ({ id: `check:${k}`, href: `#/check/${k}`, title: c.title.replace("Starting check: ", ""), icon: c.icon, level: "About 10 minutes", colour: c.accent })) });
    return areas;
  }
  const activityCard = (a, colour) => `
    <a class="list-card tile-card" href="${a.href || `#/activity/${encodeURIComponent(a.id)}`}" style="--accent:${esc(a.colour || colour)}">
      <span class="lc-icon" aria-hidden="true">${a.icon}</span>
      <span class="lc-title">${esc(a.title)}</span>
      <span class="lc-count">${esc(a.level)}${a.level && !/level|minutes/i.test(a.level) ? " level" : ""}</span>
    </a>`;
  // Big areas (numbers has dozens) are shown in groups by curriculum organiser
  function exploreGrid(area) {
    if (area.items.length <= 12) return `<div class="grid">${area.items.map(a => activityCard(a, area.colour)).join("")}</div>`;
    const groups = {};
    area.items.forEach(a => { const g = (a.organiser || "More").replace(/^(Numeracy|Mathematics|Literacy) · /, ""); (groups[g] = groups[g] || []).push(a); });
    return Object.entries(groups).map(([g, items]) => `<h3 class="explore-group">${esc(g)}</h3>
      <div class="grid">${items.map(a => activityCard(a, area.colour)).join("")}</div>`).join("");
  }

  function drawJourney(b) {
    const box = $("#journey");
    if (!box) return;
    const here = currentStage(b);
    if (homeStage === null) homeStage = here;
    box.innerHTML = `
      <ol class="journey-map">${STAGES.map((st, i) => {
        const done = stageDone(st, b);
        return `<li class="stop${i === homeStage ? " open" : ""}${done === st.lists.length ? " finished" : ""}" style="--accent:${esc(st.colour)}">
          ${i === here ? `<img class="stop-pip hop" src="assets/brand/pip-hop-small.webp" alt="" width="44" height="44">` : ""}
          <button type="button" class="stop-btn" data-stage="${i}" aria-expanded="${i === homeStage}">
            <span class="stop-num">${done === st.lists.length ? "★" : i + 1}</span>
            <span class="stop-name">${esc(st.stage.replace(/^Stage \d+ · /, "").replace(/\s*\(.*\)$/, ""))}</span>
            <span class="stop-count">${done} of ${st.lists.length} done</span>
          </button></li>`;
      }).join("")}</ol>
      <div class="stop-lists" style="--accent:${esc(STAGES[homeStage].colour)}">
        <h3>${esc(STAGES[homeStage].stage)}</h3>
        <div class="grid">${STAGES[homeStage].lists.map(l => `
          <a class="list-card${b.lists[l.id] ? " done" : ""}" href="#/list/${encodeURIComponent(l.id)}">
            <span class="lc-example">${esc(LISTS[l.id].items[0]?.spelling || "")}</span>
            <span class="lc-title">${esc(l.title)}</span>
            <span class="lc-count">${b.lists[l.id] ? `✓ Best: ${b.lists[l.id].best} of ${b.lists[l.id].of}` : `${l.words.length} words`}</span>
          </a>`).join("")}</div>
      </div>`;
    box.querySelectorAll("[data-stage]").forEach(btn => { btn.onclick = () => { homeStage = Number(btn.dataset.stage); drawJourney(b); }; });
  }

  function drawExplore() {
    const box = $("#explore");
    if (!box) return;
    const areas = exploreAreas();
    const area = areas.find(a => a.id === homeArea) || areas[0];
    box.innerHTML = `
      <div class="area-tabs" role="tablist">${areas.map(a => `<button type="button" role="tab" class="area-tab" data-area="${a.id}" aria-selected="${a.id === area.id}" style="--accent:${esc(a.colour)}">${a.icon} ${esc(a.title)}</button>`).join("")}</div>
      <div class="area-body" style="--accent:${esc(area.colour)}">
        ${area.id === "checks" ? `<p class="hint">For a new pupil's first lesson. The results go to the teacher's Next steps.</p>` : ""}
        ${exploreGrid(area)}
      </div>`;
    box.querySelectorAll("[data-area]").forEach(btn => { btn.onclick = () => { homeArea = btn.dataset.area; drawExplore(); }; });
  }

  function showHome() {
    document.title = SITE.title;
    // A class can be set so its pupils see only the work set for them (teachers still see everything)
    const locked = !!(CLASS && CLASS.assignedOnly) && !teacherUnlocked();
    const name = getPupil();
    app.innerHTML = `
      <section class="welcome">
        ${pipHTML("big", "bob", name ? "" : "Hi! I'm Pip. What's your name?")}
        <div class="welcome-main">
          <p class="hero-kicker">${name ? "Sounds become spellings" : esc(SITE.subtitle)}</p>
          <h1>${name ? `Hi, ${esc(name)}!` : "Let's pop some sounds!"}</h1>
          ${CLASS ? `<p class="class-name">${esc(CLASS.name)}${CLASS.teacherName ? ` · ${esc(CLASS.teacherName)}` : ""}${justJoined ? " — this device has joined ✓" : ""}</p>` : ""}
          <div class="pupil" id="homePupil"></div>
          <div class="me-cards" id="meCards"></div>
          ${CLOUD_CONFIGURED && !CLASS ? `
            <form class="join-box" id="joinForm">
              <label>Got a class code? <input id="joinCode" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="e.g. K7P2QX"></label>
              <button class="btn" type="submit">Join</button>
              <span class="hint" id="joinHint"></span>
            </form>` : ""}
        </div>
      </section>
      ${name ? "" : `
        <ol class="steps">
          <li><span class="step-icon" aria-hidden="true">👂</span><span><b>Hear</b> the word</span></li>
          <li><span class="step-icon" aria-hidden="true">🗣️</span><span><b>Say</b> each sound</span></li>
          <li><span class="step-icon" aria-hidden="true">🟦</span><span><b>Map</b> sounds to letters</span></li>
          <li><span class="step-icon" aria-hidden="true">✏️</span><span><b>Spell</b> and check</span></li>
        </ol>`}
      ${locked ? `<p class="hint locked-note" id="lockedNote">Your teacher chooses your work. ${name ? "Looking for today's work…" : "Type your name to see it."}</p>` : `
        <section class="home-section journey-section">
          <h2>🗺️ Pip's sound journey</h2>
          <p class="hint">Six stops, from short vowels to tricky endings. Tap a stop to see its lists.</p>
          <div id="journey"></div>
        </section>
        <section class="home-section">
          <h2>✨ More to explore</h2>
          <div id="explore"></div>
        </section>`}`;
    if (!locked) { drawJourney(loadBests()); drawExplore(); }

    const joinForm = $("#joinForm");
    if (joinForm) {
      joinForm.onsubmit = e => {
        e.preventDefault();
        const code = $("#joinCode").value.trim();
        if (!code) return $("#joinCode").focus();
        $("#joinHint").textContent = "Checking…";
        joinClass(code, ok => {
          if (ok) showHome();
          else if ($("#joinHint")) $("#joinHint").textContent = "That code didn't work — check it with your teacher.";
        });
      };
    }

    // The pupil's own corner: review words due today and their sound collection
    const box = $("#homePupil");
    const save = () => { if (takePupilName(box)) showHome(); };
    mountPupil(box, { lead: "", onChange: showHome, onEnter: save });
    if (!getPupil()) {
      $("#meCards").innerHTML = `<button class="btn primary big" id="saveName">Save my name</button>`;
      $("#saveName").onclick = save;
      return;
    }
    // Once per pupil per visit, pick up any progress made on another device (e.g. at school)
    if (REPORTING && syncedFor !== getPupil()) {
      const shown = phase;
      syncProgress().then(learned => { if (learned && shown === phase && $("#homePupil")) showHome(); });
    }
    const prog = loadProgress();
    const due = dueItems(prog).length;
    const secure = secureSounds(prog).size;
    const week = weekStats(loadBests(prog));
    const tile = (href, icon, title, detail, extra = "") => `<a class="me-card${extra}" href="${href}">
      <span class="me-icon" aria-hidden="true">${icon}</span><span class="me-text"><b>${title}</b><span>${detail}</span></span></a>`;
    $("#meCards").innerHTML = `
      ${due ? tile("#/review", "🔁", "Practise again", `${plural(due, "word", "words")} waiting`, " review")
        : `<div class="me-card quiet"><span class="me-icon" aria-hidden="true">✅</span><span class="me-text"><b>All caught up</b><span>No review words today</span></span></div>`}
      ${tile("#/sounds", "⭐", "My sounds", plural(secure, "star", "stars"))}
      ${tile("#/bests", "🏅", "My bests", `${plural(week.thisWeek, "go", "goes")} this week`)}
      ${tile("#/forest", "🌲", "Pip's Forest", `${FOREST.balance(forestState(prog))} glow seeds to use`)}
      ${storyActivities().length && !locked ? tile("#/stories", "📚", "My stories", `${readyStories(prog).length} ready to read`) : ""}
      ${locked ? "" : tile("#/activity/g-hopper-short", "🎮", "Sound Hopper", "Build Pip's bridge")}
      ${locked ? "" : tile("#/activity/g-switch-first", "🔑", "Sound Switch", "Open Pip's doors")}
      ${locked ? "" : tile("#/activity/g-canopy-run", "✨", "Counting Canopy", "Explore numbers with Pip")}`;
    // Pip says what's most useful right now (and changes if the teacher has set work)
    const say = text => { const bubble = app.querySelector(".welcome .speech") || (() => {
      const p = document.createElement("p"); p.className = "speech"; p.setAttribute("aria-live", "polite");
      app.querySelector(".welcome .pip-wrap").append(p); return p; })(); bubble.textContent = text; };
    say(due ? dueLine(due) : "Pick a stop on our journey. I'll hop along with you!");

    // Lists the teacher has set for this pupil, if the sheet is connected
    const my = phase;
    fetchAssigned(getPupil()).then(entries => {
      const lists = entries.map(resolveAssigned).filter(Boolean);
      if (my !== phase || !$("#homePupil")) return;
      if ($("#lockedNote")) {
        $("#lockedNote").textContent = lists.length
          ? "Your teacher chooses your work — it's all above."
          : "There's no new work set for you today. Practise your review words, or ask your teacher.";
      }
      if (!lists.length) return;
      say(setLine(lists.length));
      const section = document.createElement("section");
      section.className = "assigned home-section";
      section.innerHTML = `
        <h2>📌 Your work today</h2>
        <div class="grid">${lists.map(l => `
          <a class="list-card" href="${esc(l.href)}" style="--accent:${esc(l.accent)}">
            <span class="lc-example">${esc(l.example || "")}</span>
            <span class="lc-title">${esc(l.title)}</span>
          </a>`).join("")}</div>`;
      app.querySelector(".welcome").after(section);
    });
  }

  /* ---------- My sounds ---------- */

  function soundCard(tok, s) {
    const level = soundLevel(s);
    const dots = Math.min(4, s ? s.right : 0);
    const badge = level === "secure" ? "⭐"
      : level === "new" ? ""
      : `<span class="dots" aria-hidden="true">${"●".repeat(dots)}<span class="dim">${"●".repeat(4 - dots)}</span></span>`;
    const words = { secure: "secure", learning: "learning", tricky: "needs practice", new: "not tried yet" }[level];
    return `<button type="button" class="sound-card ${level}" data-tok="${esc(tok)}" aria-label="${esc(label(tok))}: ${words}">
      <span class="sc-label">${esc(label(tok))}</span><span class="sc-badge">${badge}</span></button>`;
  }

  function showSounds() {
    document.title = `My sounds · ${SITE.title}`;
    const name = getPupil();
    const prog = loadProgress();
    const levels = SOUND_ORDER.map(t => soundLevel(prog.sounds[t]));
    const count = lv => levels.filter(x => x === lv).length;
    const groups = [
      ["Single letters", t => /^[a-z]$/.test(t)],
      ["Two or three letters, one sound", t => t.length > 1 && !t.includes("_")],
      ["Split digraphs", t => t.includes("_")]
    ];
    app.innerHTML = `
      <section class="panel sounds-page">
        <a class="back" href="#/">← All lists</a>
        <div class="page-head">${pipHTML("small", "hop", "", "think")}<h1>${name ? `${esc(name)}'s sounds` : "My sounds"}</h1></div>
        <p class="meta">⭐ ${count("secure")} secure · 🌱 ${count("learning")} learning · 🔶 ${count("tricky")} to practise</p>
        <p class="hint">Spell a sound right first time on two different days to win its star. Tap a sound to hear it and practise it.</p>
        <div class="sound-detail" id="soundDetail" hidden></div>
        ${groups.map(([title, test]) => `
          <h2>${title}</h2>
          <div class="sound-grid">${SOUND_ORDER.filter(test).map(t => soundCard(t, prog.sounds[t])).join("")}</div>`).join("")}
      </section>`;

    app.querySelectorAll(".sound-card").forEach(card => {
      card.onclick = () => {
        const tok = card.dataset.tok;
        const s = prog.sounds[tok];
        sayLetters(tok.replace("_", ""));
        const detail = $("#soundDetail");
        detail.hidden = false;
        detail.innerHTML = `
          <span class="chip big">${esc(label(tok))}</span>
          <span>${s && s.words.length ? `Your words: <b>${esc(s.words.join(", "))}</b>` : "You haven't spelled this sound yet."}</span>
          <a class="btn primary" href="#/sound/${encodeURIComponent(tok)}">Practise ${esc(label(tok))} →</a>`;
        detail.scrollIntoView({ block: "nearest", behavior: "smooth" });
      };
    });
  }

  /* ---------- My stories: decodable stories matched to the sounds each pupil knows ---------- */

  // Early tricky words every pupil learns alongside the first sounds; others are listed per story
  const STARTER_TRICKY = new Set("the a i to no go so into he she we me be was my you they said of".split(" "));
  const storyWords = text => text.toLowerCase().replace(/['’]s\b/g, "").match(/[a-z']+/g) || [];
  const storyActivities = () => window.PopActivities ? window.PopActivities.all().filter(a => a.decodable) : [];

  const storyNeeds = {};
  function needsFor(story) {
    if (storyNeeds[story.id]) return storyNeeds[story.id];
    const sounds = new Set();
    const tricky = new Set();
    storyWords(story.text).forEach(w => {
      if (STARTER_TRICKY.has(w)) return;
      const it = analyse(w);
      if ((story.tricky || []).includes(w) || it.whole) tricky.add(w);
      else it.tokens.forEach(t => sounds.add(t));
    });
    return (storyNeeds[story.id] = { sounds, tricky });
  }

  // Ready once every sound has been spelled right at least once (a double letter like "pp" counts
  // as its single letter), and every extra tricky word practised. ⭐ when every sound is secure.
  function storyMatch(story, prog) {
    const { sounds, tricky } = needsFor(story);
    const single = t => (t.length === 2 && t[0] === t[1] && !SOUND_ORDER.includes(t) ? t[0] : t);
    const has = t => !SOUND_ORDER.includes(single(t)) || (prog.sounds[single(t)] && prog.sounds[single(t)].right > 0);
    const missing = [...sounds].filter(t => !has(t)).map(label)
      .concat([...tricky].filter(w => !(prog.words[w] && prog.words[w].right > 0)).map(w => `"${w}"`));
    const stars = [...sounds].every(t => !SOUND_ORDER.includes(single(t)) || soundLevel(prog.sounds[single(t)]) === "secure");
    return { missing: [...new Set(missing)], ready: !missing.length, stars: !missing.length && stars };
  }
  const readyStories = prog => storyActivities().filter(a => storyMatch(a.passage, prog).ready);

  function showStories() {
    document.title = `My stories · ${SITE.title}`;
    const name = getPupil();
    const prog = loadProgress();
    const b = loadBests(prog);
    const rows = storyActivities().map(a => Object.assign({ act: a }, storyMatch(a.passage, prog)));
    const card = x => `
      <a class="list-card story-card" href="#/activity/${encodeURIComponent(x.act.id)}" style="--accent:${esc(x.act.colour)}">
        <span class="lc-example" aria-hidden="true">${x.stars ? "⭐" : "📖"}</span>
        <span class="lc-title">${esc(x.act.title)}</span>
        <span class="lc-count">${x.ready ? (b.lists[x.act.id] ? `Best: ${b.lists[x.act.id].best} of ${b.lists[x.act.id].of}` : `Stage ${x.act.stage}`) : `Needs: ${esc(x.missing.slice(0, 4).join(", "))}${x.missing.length > 4 ? "…" : ""}`}</span>
      </a>`;
    const ready = rows.filter(x => x.ready);
    const nearly = rows.filter(x => !x.ready && x.missing.length <= 2);
    const later = rows.filter(x => !x.ready && x.missing.length > 2);
    app.innerHTML = `
      <section class="panel sounds-page stories-page">
        <a class="back" href="#/">← All lists</a>
        <div class="page-head">${pipHTML("small", "hop", "", "think")}<h1>${name ? `${esc(name)}'s stories` : "My stories"}</h1></div>
        <p class="hint">Stories that only use sounds you've practised, so you can read them all by yourself. ⭐ means every sound in it is one of your star sounds.</p>
        <h2>Ready to read</h2>
        ${ready.length ? `<div class="grid">${ready.map(card).join("")}</div>`
          : `<p>Practise some spelling lists and your first stories will appear here. You can still try any story below.</p>`}
        ${nearly.length ? `<h2>Nearly ready</h2><p class="hint">Just one or two new sounds to learn first.</p><div class="grid">${nearly.map(card).join("")}</div>` : ""}
        ${later.length ? `<details class="later"><summary>Coming later (${later.length})</summary><div class="grid">${later.map(card).join("")}</div></details>` : ""}
      </section>`;
  }

  // The story with sound buttons under every word. Tricky words have a heart and no buttons.
  function storyHTML(story) {
    return story.text.split(/(\s+)/).map(chunk => {
      const m = /^([^A-Za-z']*)([A-Za-z]+)(['’]s)?([^A-Za-z]*)$/.exec(chunk);
      if (!m) return esc(chunk);
      const [, before, word, poss, after] = m;
      const lower = word.toLowerCase();
      // "a" and "I" are tricky-word list members but sound out fine, so they keep their dot
      const tricky = (STARTER_TRICKY.has(lower) && lower !== "a" && lower !== "i") || (story.tricky || []).includes(lower);
      let inner;
      const it = tricky ? null : analyse(lower);
      if (!it || it.whole) inner = `<span class="g whole">${esc(word)}</span>`;
      else {
        const cap = word[0] !== lower[0];
        inner = wordHTML(cap ? Object.assign({}, it, { chunks: it.chunks.map((c, k) => (k ? c : Object.assign({}, c, { text: c.text[0].toUpperCase() + c.text.slice(1) }))) }) : it);
      }
      // Kept together so punctuation never wraps onto the next line on its own
      return `<span class="sw-wrap">${esc(before)}<button type="button" class="sw${tricky ? " tricky" : ""}" data-word="${esc(lower)}">${inner}${poss ? esc(poss) : ""}</button>${esc(after)}</span>`;
    }).join("");
  }

  function showStoryRead() {
    newScreen();
    const act = session.activity;
    app.innerHTML = `
      <section class="panel practice story-read" style="--accent:${esc(act.colour)}">
        <div class="progress">
          <a class="stop" href="#/" id="stopLink">✕ Stop</a>
          <span>Read, then ${plural(session.items.length, "question", "questions")}</span>
          ${helpHTML()}
        </div>
        <p class="phase">📖 Read the story by yourself</p>
        <p class="hint">Say the sounds and blend them into words. ♥ words are tricky words. Stuck? Tap the word to hear it.</p>
        <h2 class="story-title">${esc(act.passage.title)}</h2>
        <div class="story-text" id="storyText">${storyHTML(act.passage)}</div>
        <label class="toggle"><input type="checkbox" id="soundButtons" checked> Show sound buttons</label>
        <div class="row center"><button class="btn big primary" id="readDone">I've read it →</button></div>
      </section>`;
    wireStop();
    app.querySelectorAll(".sw").forEach(b => { b.onclick = () => sayWord(b.dataset.word); });
    $("#soundButtons").onchange = e => $("#storyText").classList.toggle("plain", !e.target.checked);
    $("#readDone").onclick = () => showQuestion();
  }

  /* ---------- My bests ---------- */

  function showBests() {
    document.title = `My bests · ${SITE.title}`;
    const name = getPupil();
    const b = loadBests();
    const w = weekStats(b);
    const scores = Object.entries(b.lists)
      .filter(([id]) => bestTitle(id))
      .sort((x, y) => (x[1].day < y[1].day ? 1 : x[1].day > y[1].day ? -1 : 0));
    const href = id => LISTS[id] ? `#/list/${encodeURIComponent(id)}` : `#/activity/${encodeURIComponent(id)}`;
    app.innerHTML = `
      <section class="panel sounds-page bests-page">
        <a class="back" href="#/">← All lists</a>
        <div class="page-head">${pipHTML("small", "hop", "", "celebrate")}<h1>${name ? `${esc(name)}'s bests` : "My bests"}</h1></div>
        <p class="hint">Every word and question you try is a go, right or wrong. Beat your own best. Nobody else's counts!</p>
        <div class="bests-stats">
          <div><b>${w.thisWeek}</b><span>${w.thisWeek === 1 ? "go" : "goes"} this week</span></div>
          <div><b>${Math.max(w.bestWeek, w.thisWeek)}</b><span>goes in my best week</span></div>
          <div><b>${w.run}</b><span>${w.run === 1 ? "week" : "weeks"} in a row</span></div>
        </div>
        <h2>My best scores</h2>
        ${scores.length ? `
          <table class="results">
            <thead><tr><th>List or activity</th><th>Best</th><th></th></tr></thead>
            <tbody>${scores.map(([id, s]) => `
              <tr><td class="rw">${esc(bestTitle(id))}</td>
                <td>${s.best} of ${s.of} right first time</td>
                <td><a class="btn small" href="${href(id)}">Beat it</a></td></tr>`).join("")}</tbody>
          </table>` : `<p>Finish a list or an activity to set your first best score.</p>`}
      </section>`;
  }

  /* ---------- Counting Canopy: collect glow seeds and build Pip's Forest ---------- */

  function awardForestClearing(s) {
    if (s.preview) return;
    s.forestRunId ||= `canopy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    // One entry per game, counting its clearings, so saved progress stays small. Seeds from
    // older one-per-clearing entries still count.
    saveForestState(FOREST.award(forestState(), s.forestRunId, s.i + 1));
  }

  function renderForestCollection(root, preview = false, notice = "") {
    const state = forestState(), balance = FOREST.balance(state);
    const owned = new Set(state.unlocked);
    root.innerHTML = `
      <div class="forest-wallet"><b>✨ ${balance}</b> glow seeds ready to use
        <span>· ${FOREST.earned(state)} collected altogether</span></div>
      ${notice ? `<p class="forest-notice" role="status">${esc(notice)}</p>` : ""}
      <div class="forest-home-scene" role="img" aria-label="Pip's forest with ${state.unlocked.length} unlocked decorations">
        <span class="forest-home-sun" aria-hidden="true"></span><span class="forest-home-tree" aria-hidden="true"></span>
        <span class="forest-home-stream" aria-hidden="true"></span>
        <img src="assets/brand/pip-hop-small.webp" alt="" class="forest-home-pip" width="120" height="120">
        ${FOREST.ITEMS.filter(item => owned.has(item.id)).map(item =>
          `<span class="forest-decor ${item.id}" aria-hidden="true">${item.icon}</span>`).join("")}
        <span class="forest-home-owl" aria-hidden="true">🦉</span>
      </div>
      <h3>Choose what to add to your forest</h3>
      <div class="forest-shop">${FOREST.ITEMS.map(item => {
        const has = owned.has(item.id), need = Math.max(0, item.cost - balance);
        return `<div class="forest-item${has ? " owned" : ""}"><span class="forest-item-icon" aria-hidden="true">${item.icon}</span>
          <b>${esc(item.name)}</b><small>${esc(item.description)}</small>
          <button type="button" class="btn small" data-forest-buy="${item.id}" ${has || preview || need ? "disabled" : ""}>
            ${has ? "Built!" : preview ? `${item.cost} glow seeds` : need ? `Need ${need} more` : `Build for ${item.cost}`}</button></div>`;
      }).join("")}</div>`;
    root.querySelectorAll("[data-forest-buy]:not(:disabled)").forEach(button => {
      button.onclick = () => {
        const item = FOREST.ITEMS.find(x => x.id === button.dataset.forestBuy);
        const current = forestState(), next = FOREST.unlock(current, item.id);
        if (next.unlocked.length === current.unlocked.length) return;
        saveForestState(next);
        renderForestCollection(root, false, `${item.name} is now part of your forest!`);
        syncProgress();
      };
    });
  }

  function showForest() {
    document.title = `Pip's Forest · ${SITE.title}`;
    if (!getPupil()) {
      app.innerHTML = `<section class="panel start"><h1>Pip's Forest</h1><p>Save your name on the home page to keep your forest.</p><a class="btn primary" href="#/">Go home</a></section>`;
      return;
    }
    app.innerHTML = `<section class="panel forest-page"><a class="back" href="#/">← Home</a>
      <h1>🌲 ${esc(getPupil())}'s Forest</h1><p>Play Counting Canopy to collect glow seeds. Choose what Pip builds here.</p>
      <div id="forestCollection"></div><a class="btn primary" href="#/activity/g-canopy-run">Play Counting Canopy →</a></section>`;
    renderForestCollection($("#forestCollection"), previewMode);
    if (REPORTING && syncedFor !== getPupil())
      syncProgress().then(learned => { if (learned && $("#forestCollection")) renderForestCollection($("#forestCollection"), previewMode); });
  }

  /* ---------- Start screen ---------- */

  function showStart(list) {
    document.title = `${list.title} · ${SITE.title}`;
    app.innerHTML = `
      <section class="panel start" style="--accent:${esc(list.accent)}">
        <a class="back" href="#/">← All lists</a>
        ${previewBanner()}
        <div class="start-pip">${pipHTML("small", "bob", previewMode ? "" : START_LINE, "listen")}</div>
        ${forTeacher() ? `<p class="eyebrow">${esc(list.stage || "")}</p>` : ""}
        <h1>${esc(list.title)}</h1>
        ${forTeacher() ? `${list.tip ? `<p class="tip">💡 ${esc(list.tip)}</p>` : ""}
          <p class="meta">${plural(list.items.length, "word", "words")}${checksFor(list).length ? ` + ${plural(checksFor(list).length, "new-word challenge", "new-word challenges")}` : ""} · ${plural(settings.tries, "try", "tries")} for each word</p>` : ""}
        ${previewMode ? "" : `<div class="pupil" id="pupilBox"></div>`}
        <button class="btn big primary" id="go">${previewMode ? "▶ Test this work" : "▶ Start"}</button>
        ${LISTS[list.id] && list.items.some(it => it.sentence) && window.PopActivities
          ? `<p><a class="btn" href="#/activity/${encodeURIComponent(`dictate:${list.id}`)}${previewMode ? "?preview=1" : ""}">✍️ Sentence dictation with these words</a></p>` : ""}
        ${synth ? "" : `<p class="warn">This browser can't read words aloud. Please try Chrome, Edge or Safari.</p>`}
        <details class="teacher">
          <summary>Words in this list</summary>
          <ul class="wordlist">${list.items.map(it => `<li class="mini-word">${wordHTML(it)}</li>`).join("")}</ul>
        </details>
      </section>`;
    const go = $("#go");
    if (previewMode) { go.onclick = () => startPractice(list, list.items, checksFor(list)); go.focus(); return; }

    // Pupils say who they are first, so their progress (and any report) is theirs
    const box = $("#pupilBox");
    mountPupil(box, { onEnter: () => go.click() });
    (getPupil() ? go : box.querySelector(".pupil-name")).focus();

    go.onclick = () => {
      if (!takePupilName(box)) return;
      startPractice(list, list.items, checksFor(list));
    };
  }

  // Curriculum labels, tips and word counts are for teachers; pupils get Pip and one big button
  const forTeacher = () => previewMode || teacherUnlocked();
  const checksFor = list => (settings.checks ? list.checks || [] : []);

  /* ---------- Practice ---------- */

  let session = null;

  // New-word challenges always come last, after the practised words
  function startPractice(list, items, checks = []) {
    session = {
      list, i: 0, results: [], pupil: previewMode ? "" : getPupil(), sent: false, preview: previewMode,
      items: (settings.shuffle ? shuffle(items) : items.slice()).concat(checks),
      secureBefore: secureSounds(loadProgress()),
      // Practising just the tricky words doesn't count towards the list's best score
      bestsBefore: bestsSnapshot(list, items.length === (list.items || []).length)
    };
    livePing(session, "start");
    showLook();
  }

  let helpOn = false; // the pupil has asked for help; the teacher clears it on the dashboard

  const helpHTML = () => REPORTING
    && !previewMode ? `<button type="button" class="help-btn${helpOn ? " on" : ""}" id="helpBtn" aria-pressed="${helpOn}">${helpOn ? "🙋 Help is coming" : "🙋 Help"}</button>`
    : "";

  function progressHTML() {
    const n = session.items.length;
    const earned = session.results.reduce((t, r) => t + r.stars, 0);
    return `
      ${previewBanner()}
      <div class="progress">
        <a class="stop" href="#/" id="stopLink">✕ Stop</a>
        <span>${session.activity && session.items[session.i]?.kind === "map" ? "Crossing" : session.activity && session.items[session.i]?.kind === "switch" ? "Door" : session.activity && session.items[session.i]?.kind === "canopy" ? "Clearing" : session.activity ? "Question" : "Word"} ${session.i + 1} of ${n}</span>
        ${helpHTML()}
        <span class="earned" aria-label="${earned} stars">★ ${earned}</span>
      </div>
      <div class="bar" aria-hidden="true"><span style="width:${(session.i / n) * 100}%"></span></div>`;
  }

  // The address doesn't change during practice, so "Stop" has to redraw the start screen itself.
  // Every practice screen calls this, so it also wires up the help button.
  function wireStop() {
    const helpBtn = $("#helpBtn");
    if (helpBtn) {
      helpBtn.onclick = () => {
        helpOn = !helpOn;
        askForHelp(helpOn);
        helpBtn.classList.toggle("on", helpOn);
        helpBtn.setAttribute("aria-pressed", helpOn);
        helpBtn.textContent = helpOn ? "🙋 Help is coming" : "🙋 Help";
      };
    }
    $("#stopLink").onclick = e => {
      e.preventDefault();
      const list = session.list;
      const activity = session.activity;
      const check = session.check;
      const quest = session.quest;
      leaveSession(session); // the words done so far still count
      newScreen();
      session = null;
      if (quest) showQuest(); // back to Pip's map; the island can be done again later
      else if (check) showCheckStart(check); else if (activity) showActivityStart(activity); else showStart(list);
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

  // One page per word, built for children who can't read yet: the word is shown (with its sound
  // markings) while it's spoken, then hides by itself, or as soon as they start typing. 👀 shows it
  // again. Typing, checking and the result all happen on this page, with icons rather than text.
  function showLook() {
    newScreen();
    const item = session.items[session.i];
    const showBoxes = !item.whole;
    const seeable = !item.challenge; // a new-word challenge is never shown first
    const wrong = [];
    const firstMissed = [];
    const my = phase;
    app.innerHTML = `
      <section class="panel practice one-page" style="--accent:${esc(session.list.accent)}">
        ${progressHTML()}
        ${item.challenge ? `<p class="phase challenge"><span aria-hidden="true">🔍</span> New word!</p>` : ""}
        <div class="word-stage" id="stage">
          ${seeable ? `<div class="look-word" id="lookWord">${wordHTML(item)}</div>
            <button type="button" class="peek-btn" id="peek" hidden><span aria-hidden="true">👀</span> See it again</button>`
            : `<button type="button" class="peek-btn" id="hearBig"><span aria-hidden="true">🔊</span> Listen</button>`}
        </div>
        ${sentenceHTML(item, true)}
        ${showBoxes ? `<div class="boxes" id="boxes" aria-label="${plural(item.tokens.length, "sound", "sounds")}">${boxesHTML(item)}</div>` : ""}
        <form class="spell-form" id="spellForm" autocomplete="off">
          <label for="answer" class="sr-only">Type the word</label>
          <input id="answer" class="answer" type="text" autocomplete="off" autocorrect="off"
                 autocapitalize="none" spellcheck="false" enterkeyhint="done" maxlength="40">
          <button class="btn primary check-btn" type="submit" aria-label="Check"><span aria-hidden="true">✓</span></button>
        </form>
        <div class="tries" id="tries"></div>
        <p class="feedback" id="feedback" aria-live="polite"></p>
        <div class="row center tools" id="tools">
          <button class="btn icon-btn" id="hear" type="button"><span aria-hidden="true">🔊</span>Hear</button>
          ${wantSentence(item) ? `<button class="btn icon-btn" id="hearSentence" type="button"><span aria-hidden="true">💬</span>Sentence</button>` : ""}
        </div>
      </section>`;
    wireStop();

    const input = $("#answer");
    const feedback = $("#feedback");
    const word = $("#lookWord");
    const peek = $("#peek");
    let showing = 0; // each showing gets a number, so an old timer can't hide a newer one
    const hide = () => {
      if (!word || word.hidden) return;
      word.hidden = true;
      peek.hidden = false;
    };
    // Show the word while it's said, then hide it after 3 seconds (or at the first key press).
    // The timer doesn't wait for the speech: not every device says when it has finished.
    const SHOW_MS = 3000;
    const show = say => {
      if (!word) return;
      const n = ++showing;
      word.hidden = false;
      peek.hidden = true;
      say();
      later(() => { if (n === showing && my === phase) hide(); }, SHOW_MS);
    };
    if (word) {
      wireSoundButtons(word, item);
      peek.onclick = () => { show(() => sayWord(item.spelling)); input.focus({ preventScroll: true }); };
    }
    input.addEventListener("keydown", hide);
    input.addEventListener("input", hide); // on-screen keyboards don't always send key presses
    if ($("#hearBig")) $("#hearBig").onclick = () => { sayWordInSentence(item); input.focus({ preventScroll: true }); };

    const wireBoxes = () => document.querySelectorAll("#boxes button.box").forEach(b => {
      b.onclick = () => { b.classList.toggle("lit"); input.focus({ preventScroll: true }); };
    });
    const drawTries = () => {
      const left = settings.tries - wrong.length;
      $("#tries").innerHTML = Array.from({ length: settings.tries }, (_, k) =>
        `<span class="try ${k < left ? "" : "used"}"></span>`).join("") +
        `<span class="sr-only">${plural(Math.max(0, left), "try", "tries")} left</span>`;
    };
    wireBoxes();
    drawTries();
    input.focus();

    $("#hear").onclick = () => { sayWord(item.spelling); input.focus({ preventScroll: true }); };
    if ($("#hearSentence")) $("#hearSentence").onclick = () => { saySentence(item); input.focus({ preventScroll: true }); };
    if (seeable) show(() => sayWordInSentence(item)); else sayWordInSentence(item);

    $("#spellForm").onsubmit = e => {
      e.preventDefault();
      const answer = input.value;
      if (!answer.trim()) { input.focus(); return; }
      const result = compare(answer, item);
      if (!wrong.length) result.boxes.forEach(b => { if (!b.ok) firstMissed.push(b.tok); });
      if (result.right) { showResult(true, wrong, firstMissed, result); return; }
      wrong.push(answer.trim());
      if (wrong.length >= settings.tries) { showResult(false, wrong, firstMissed, result); return; }

      chimeWrong();
      hide();
      const bad = result.boxes.filter(b => !b.ok);
      const focusTip = session.list.tip && bad.some(b => session.list.focusSet.has(b.tok));
      feedback.className = "feedback oops";
      feedback.innerHTML = `<span aria-hidden="true">🔁</span> Not quite. Have another go.` + (focusTip ? `<span class="tip-inline">💡 ${esc(session.list.tip)}</span>` : "");
      if (showBoxes) $("#boxes").innerHTML = boxesHTML(item, result); // green sounds are right, orange need fixing
      drawTries();
      input.value = "";
      input.classList.remove("shake");
      void input.offsetWidth;
      input.classList.add("shake");
      input.focus();
      later(() => Promise.resolve(sayPhrase(PHRASES.tryAgain)).then(() => { if (my === phase) sayWord(item.spelling); }), 300);
    };
  }

  // Sound boxes: one per sound. Empty to start with; after a try they show what was written
  function boxesHTML(item, result) {
    return item.tokens.map((tok, g) => {
      if (!result) return `<button type="button" class="box" aria-label="Sound ${g + 1}"></button>`;
      const b = result.boxes[g];
      return `<span class="box ${b.ok ? "ok" : "bad"}">${esc(b.text || "?")}</span>`;
    }).join("");
  }

  // Right (with stars), or the word shown sound by sound and spelled out: on the same page
  function showResult(correct, wrong, firstMissed, last) {
    newScreen(); // stops anything still being said; the page itself stays
    const item = session.items[session.i];
    const earned = correct ? settings.tries - wrong.length : 0;
    session.results.push({ item, correct, wrong: wrong.slice(), stars: earned, missed: [...new Set(firstMissed)] });
    if (!session.preview) recordProgress(item, correct, wrong.length, firstMissed);
    livePing(session, "word", { word: item.spelling, ok: correct && !wrong.length });
    const isLast = session.i === session.items.length - 1;
    const praise = pick(PRAISE);
    const missed = correct ? new Set() : new Set(last.boxes.map((b, g) => (b.ok ? -1 : g)).filter(g => g >= 0));

    ["#boxes", "#spellForm", "#tries", "#feedback", "#tools", ".sentence"].forEach(sel => { const el = app.querySelector(sel); if (el) el.remove(); });
    $("#stage").innerHTML = `
      <div class="word-box ${correct ? "right pop" : "reveal"}"><span class="word sounds" lang="en-GB">${wordHTML(item, missed)}</span></div>
      ${correct ? `<p class="stars-big" aria-label="${earned} stars">${stars(earned)}<span class="dim">${stars(settings.tries - earned)}</span></p>` : ""}
      <div class="row center">
        ${correct ? "" : `<button class="btn icon-btn" id="hear" type="button"><span aria-hidden="true">🔊</span>Hear it</button>`}
        <button class="btn big primary next-btn" id="next" type="button">${isLast ? `<span aria-hidden="true">🏆</span> My stars` : `Next <span aria-hidden="true">➜</span>`}</button>
      </div>`;
    wireSoundButtons($(".word"), item);
    // Stop and Help stay as they were; the top bar shows the new score
    app.querySelector(".progress .earned").textContent = `★ ${session.results.reduce((t, r) => t + r.stars, 0)}`;

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
    const all = session.results;
    const r = all.filter(x => !x.item.challenge);
    const challenges = all.filter(x => x.item.challenge);
    const right = r.filter(x => x.correct).length;
    const firstGo = r.filter(x => x.correct && !x.wrong.length).length;
    const earned = all.reduce((t, x) => t + x.stars, 0);
    const tricky = all.filter(x => !x.correct || x.wrong.length).map(x => x.item);
    const headline = right === r.length
      ? (firstGo === r.length ? "Perfect! Every word right first time!" : "You spelled every word!")
      : `You spelled ${right} out of ${plural(r.length, "word", "words")}!`;
    const challengeRight = challenges.filter(x => x.correct).length;
    const newStars = [...secureSounds(loadProgress())].filter(t => !session.secureBefore.has(t));
    const comingBack = session.preview ? 0 : all.filter(x => !(x.correct && !x.wrong.length)).length;
    const bestNotes = personalBests(session, firstGo, r.length);

    // Which sounds went wrong on the first try, and in which words — the useful bit for the teacher
    const bySound = {};
    all.forEach(x => x.missed.forEach(tok => { (bySound[tok] = bySound[tok] || []).push(x.item.spelling); }));
    const soundRows = Object.entries(bySound).sort((a, b) => b[1].length - a[1].length);

    app.innerHTML = `
      <section class="panel summary" style="--accent:${esc(session.list.accent)}">
        ${previewBanner()}
        ${pipHTML("big", "cheer", "", "celebrate")}
        <h1>${esc(headline)}</h1>
        <p class="meta">${session.pupil ? `${esc(session.pupil)} · ` : ""}${esc(session.list.title)} · ★ ${earned} stars · ${firstGo} right first time</p>
        ${REPORTING && !session.preview ? `<p class="sent no-print" id="sent" aria-live="polite">📤 Sending to your teacher…</p>` : ""}
        ${newStars.length ? `
          <div class="new-stars pop">
            <p>🎉 New sound ${newStars.length === 1 ? "star" : "stars"} for your collection!</p>
            ${newStars.map(t => `<span class="star-badge">⭐ ${esc(label(t))}</span>`).join("")}
            <a class="linklike" href="#/sounds">See all my sounds</a>
          </div>` : ""}
        ${bestsHTML(bestNotes)}
        ${challenges.length ? `
          <p class="challenge-result">🔍 New words: <b>${challengeRight} of ${challenges.length}</b> right${challengeRight === challenges.length ? " — you can use the rule!" : ""}</p>` : ""}
        ${comingBack ? `<p class="hint">🔁 ${plural(comingBack, "word", "words")} will come back tomorrow for more practice.</p>` : ""}
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
            ${all.map(x => `
              <tr class="${x.correct ? "" : "missed"}">
                <td class="rw">${esc(x.item.spelling)}${x.item.challenge ? ` <span class="new-tag">new</span>` : ""}</td>
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
    livePing(session, "end");
    session.ended = true;
    const my = phase;
    if (!session.preview) syncProgress(); // so the review words and stars are there on any device
    sendReport(session, true).then(sent => {
      const note = $("#sent");
      if (!note || my !== phase || sent === null) return;
      note.textContent = sent ? "✓ Sent to your teacher" : "Saved — it will reach your teacher when the internet is back.";
    });
    const list = session.list;
    if (tricky.length) $("#again-tricky").onclick = () => startPractice(Object.assign({}, list, { title: `${list.title} — tricky words` }), tricky);
    $("#again-all").onclick = () => startPractice(list, list.items, checksFor(list));
    $("#print").onclick = () => window.print();
  }

  /* ---------- Activities: writing, reading, listening and numeracy (content in activities.js) ---------- */

  const ACTIVITY_TRIES = 2;
  const norm = s => String(s).trim().toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, " ").replace(/^0+(?=\d)/, "");

  function showActivityStart(act) {
    document.title = `${act.title} · ${SITE.title}`;
    app.innerHTML = `
      <section class="panel start" style="--accent:${esc(act.colour)}">
        <a class="back" href="#/">← All activities</a>
        ${previewBanner()}
        <div class="start-pip">${pipHTML("small", "bob", previewMode ? "" : START_LINE, "listen")}</div>
        ${forTeacher() ? `<p class="eyebrow">${act.icon} ${esc(act.level)} level · ${esc(act.organiser)}</p>` : ""}
        <h1>${act.icon ? `<span aria-hidden="true">${act.icon}</span> ` : ""}${esc(act.title)}</h1>
        ${forTeacher() ? `<p class="tip">${esc(act.blurb)}</p>` : ""}
        ${act.id === "g-canopy-run" ? `<div class="canopy-mission"><strong>🌲 Pip's mission: reach the owl!</strong>
          <span>Catch lights ✦ · Cross rivers 🌉 · Find hidden friends 🍃 · Choose the path ↗</span>
          <small>Every answer opens the forest. Take your time; replay or use a clue whenever you need one.</small></div>`
          : /^g-canopy-/.test(act.id) ? `<div class="canopy-mission"><strong>🌟 Focused number practice with Pip</strong>
          <small>Six quick challenges for one skill. Replay or use a clue whenever you need one.</small></div>` : ""}
        ${/^g-(hopper|switch)-/.test(act.id) && teacherUnlocked() ? `<label class="field hopper-accent">How do you say r sounds?
          <select id="hopperAccent"${CLASS && CLASS.accent ? " disabled" : ""}>
            <option value="scottish">Scottish: hear the vowel and r separately (c · a · r)</option>
            <option value="english">English: ar, er, ir, or, ur count as one sound (c · ar)</option>
          </select></label>
          ${CLASS && CLASS.accent ? `<p class="hint">Set for ${esc(CLASS.name)} in Teacher → Classes.</p>` : ""}` : ""}
        ${previewMode ? "" : `<div class="pupil" id="pupilBox"></div>`}
        <button class="btn big primary" id="go">${previewMode ? "▶ Test this work" : "▶ Start"}</button>
      </section>`;
    const go = $("#go");
    const box = $("#pupilBox");
    const accent = $("#hopperAccent");
    if (accent) {
      accent.value = R_SOUNDED ? "scottish" : "english";
      accent.onchange = () => { settings.accent = accent.value; saveSettings(); location.reload(); };
    }
    if (previewMode) { go.onclick = () => startActivity(act); go.focus(); return; }
    mountPupil(box, { onEnter: () => go.click() });
    (getPupil() ? go : box.querySelector(".pupil-name")).focus();
    go.onclick = () => { if (takePupilName(box)) startActivity(act); };
  }

  function startActivity(act) {
    const questions = act.make();
    if (!questions.length) { app.innerHTML = `<section class="panel start"><h1>Nothing to practise here yet</h1><a class="btn primary" href="#/">Back</a></section>`; return; }
    session = {
      list: { id: act.id, title: act.title, accent: act.colour }, activity: act, i: 0, results: [],
      pupil: previewMode ? "" : getPupil(), sent: false, preview: previewMode, secureBefore: new Set(),
      bestsBefore: bestsSnapshot({ id: act.id }, true),
      items: questions.map(q => Object.assign({ spelling: q.label, tokens: [] }, q))
    };
    livePing(session, "start");
    if (act.decodable) showStoryRead(); else showQuestion();
  }

  // Plays a question's sound: a recorded word, a recording (with the device voice as back-up), or text
  // How a written question sounds read out: symbols become words, so "3 + ? = 10" is
  // "3 add what equals 10"
  const speakable = text => String(text || "")
    .replace(/_{2,}/g, " blank ").replace(/(^|\s)\?(?=\s|$|\/)/g, "$1what")
    .replace(/×/g, " times ").replace(/÷/g, " divided by ").replace(/−/g, " take away ").replace(/\+/g, " add ")
    .replace(/=\s*$/, " makes what?").replace(/=/g, " equals ").replace(/(\d)\/(\d)/g, "$1 over $2")
    .replace(/\s+/g, " ").trim();
  // Every question is read out, so a child who can't read yet can still answer it
  const questionSay = q => q.say || (q.prompt ? { text: speakable(q.prompt) } : null);
  // An answer choice read out: a recorded word where there is one
  const sayOption = o => (/\s/.test(o) ? speak(speakable(o)) : sayWord(o));

  function sayQuestion(q) {
    if (!q.say) return Promise.resolve();
    if (q.say.word) {
      // e.g. "Which word rhymes with this word?" (recorded), then the word itself
      const intro = q.say.intro && recPhrases.has(q.say.intro) ? [`audio/phrases/${q.say.intro}.mp3`, 350] : [];
      return hasWordClip(q.say.word) ? orSpeak(intro.concat(wordClip(q.say.word)), q.say.word) : sayWord(q.say.word);
    }
    if (q.say.clip) return orSpeak([q.say.clip], q.say.text || "");
    return speak(q.say.text);
  }
  /* ---------- Reading aloud: one sentence at a time, at the pupil's own speed ---------- */

  // Pupils choose the speed themselves, so they can read along rather than be read to.
  // It's remembered on the device.
  // Stretching the recording makes it muddy. Slow keeps Eponine at her natural pace
  // and gives the pupil a longer pause between sentences instead. A device voice is made on the
  // spot, so it can slow down cleanly: that's the last number.
  const READ_SPEEDS = [["slow", 1, "🐢 Slow", 0.65], ["steady", 0.94, "🙂 Steady", 0.8], ["normal", 1, "🐇 Normal", 1]];
  const READ_KEY = "popspell-read-speed";
  const readSpeed = () => {
    let key = "";
    try { key = localStorage.getItem(READ_KEY) || ""; } catch { /* private mode */ }
    return READ_SPEEDS.find(s => s[0] === key) || READ_SPEEDS[1];
  };
  // Sentences end at . ! or ? (and a closing quote) before a capital letter, so speech stays
  // with its speaker: "Get the cat!" said Mum. Keep in step with split_sentences in tools/make_audio.py
  const sentencesOf = text => (text.match(/[\s\S]+?[.!?]+["”]?(?=\s+["“]?[A-Z]|\s*$)/g) || [text]).map(s => s.trim()).filter(Boolean);
  const sentenceClipOf = (p, n) => `audio/passages/${encodeURIComponent(p.id)}-s${n + 1}.mp3`;
  const readAlongHTML = p => sentencesOf(p.text).map((s, n) => `<span class="ra-s" data-s="${n}">${esc(s)}</span>`).join(" ");

  let readRun = 0; // each reading gets a number, so a newer one (or Stop) ends the old one
  async function readAlong(p, box, from = 0) {
    const run = ++readRun;
    const my = phase; // moving to another screen ends the reading too
    const [mode, speed, , deviceSpeed] = readSpeed();
    const parts = sentencesOf(p.text);
    const mark = n => box && box.querySelectorAll(".ra-s").forEach(el => el.classList.toggle("reading", Number(el.dataset.s) === n));
    for (let n = from; n < parts.length; n++) {
      if (run !== readRun || my !== phase) return;
      mark(n);
      const ok = !useRecorded()
        ? await speak(parts[n], settings.rate * deviceSpeed)
        : await orSpeak([sentenceClipOf(p, n)], parts[n], settings.rate * deviceSpeed, speed);
      if (run !== readRun || my !== phase || ok === null) return;
      await new Promise(r => setTimeout(r, mode === "slow" ? 1100 : mode === "steady" ? 450 : 300));
    }
    if (run === readRun) mark(-1);
  }
  const stopReading = () => { readRun++; stopRecorded(); if (synth) synth.cancel(); };

  const readControlsHTML = label => `
    <div class="read-controls">
      <button type="button" class="btn small" data-read="go">${label}</button>
      <button type="button" class="btn small" data-read="stop" hidden>⏹ Stop</button>
      <span class="read-speed" role="group" aria-label="Reading speed">${READ_SPEEDS.map(([key, , text]) =>
        `<button type="button" class="speed-btn" data-speed="${key}" aria-pressed="${readSpeed()[0] === key}">${text}</button>`).join("")}</span>
      <small class="read-speed-note" aria-live="polite">${readSpeed()[0] === "slow" ? "Slow keeps Eponine clear and adds a longer pause after each sentence." : ""}</small>
    </div>`;
  // Read it / Stop, the speed buttons, and tapping a sentence to hear it from there
  function wireReadAlong(box, p) {
    const go = box.querySelector('[data-read="go"]');
    const stop = box.querySelector('[data-read="stop"]');
    const reading = on => { go.hidden = on; stop.hidden = !on; };
    const start = from => {
      reading(true);
      const done = readAlong(p, box, from);
      const mine = readRun;
      return done.then(() => { if (mine === readRun) reading(false); });
    };
    go.onclick = () => start(0);
    stop.onclick = () => { stopReading(); reading(false); box.querySelectorAll(".ra-s").forEach(el => el.classList.remove("reading")); };
    box.querySelectorAll(".ra-s").forEach(el => { el.onclick = () => start(Number(el.dataset.s)); });
    box.querySelectorAll("[data-speed]").forEach(b => {
      b.onclick = () => {
        try { localStorage.setItem(READ_KEY, b.dataset.speed); } catch { /* private mode */ }
        box.querySelectorAll("[data-speed]").forEach(x => x.setAttribute("aria-pressed", x === b));
        box.querySelector(".read-speed-note").textContent = b.dataset.speed === "slow"
          ? "Slow keeps Eponine clear and adds a longer pause after each sentence." : "";
        // Already reading? Carry on from the same sentence at the new speed
        const now = box.querySelector(".ra-s.reading");
        if (!stop.hidden) start(now ? Number(now.dataset.s) : 0);
      };
    });
    return { start };
  }

  // Dictation: every word spelled right (in any order), a capital letter at the start, an end mark
  function markDictation(attempt, answer) {
    const clean = w => w.toLowerCase().replace(/[^a-z']/g, "");
    const pool = attempt.split(/\s+/).map(clean).filter(Boolean);
    const wrongWords = [];
    answer.split(/\s+/).forEach(w => {
      const c = clean(w);
      if (!c) return;
      const at = pool.indexOf(c);
      if (at >= 0) pool.splice(at, 1); else wrongWords.push(w.replace(/[^A-Za-z']/g, ""));
    });
    const capital = /^[A-Z]/.test(attempt.trim());
    const endMark = /[.!?]["”]?$/.test(attempt.trim());
    const problems = wrongWords.map(w => `spelling: ${w.toLowerCase()}`)
      .concat(capital ? [] : ["capital letters"]).concat(endMark ? [] : ["full stops"]);
    return { right: !problems.length, wrongWords, capital, endMark, problems };
  }

  function showQuestion() {
    const my = newScreen();
    const act = session.activity;
    const q = session.items[session.i];
    if (q.kind === "map") return showSoundHopper(q);
    if (q.kind === "switch") return showSoundSwitch(q);
    if (q.kind === "canopy") return showCountingCanopy(q);
    if (!q.say) q.say = questionSay(q);
    // Answers made of words can be heard too (not bare numbers or punctuation)
    const hearOptions = q.kind === "choice" && (q.sayOptions || q.options.some(o => /[a-z]{2}/i.test(o)));
    const wrong = [];
    let missed = [];
    const passage = act.passage;
    const passageBox = passage ? (act.listen
      ? `<div class="passage listen" id="passageBox">${readControlsHTML("🔊 Play the story again")}</div>`
      : `<details class="passage" id="passageBox"${session.i === 0 ? " open" : ""}><summary>📖 ${esc(passage.title)} — read the story</summary>
          <p class="read-along">${readAlongHTML(passage)}</p>${readControlsHTML("🔊 Read it to me")}</details>`) : "";
    const optionHTML = (opt, i) => `
      <div class="q-option-wrap">
        <button type="button" class="q-option" data-opt="${i}">${esc(opt)}</button>
        ${hearOptions ? `<button type="button" class="q-hear" data-hear="${i}" aria-label="Hear ${esc(opt)}">🔊</button>` : ""}
      </div>`;
    app.innerHTML = `
      <section class="panel practice activity" style="--accent:${esc(act.colour)}">
        ${progressHTML()}
        ${passageBox}
        <p class="phase q-prompt">${esc(q.prompt)}</p>
        ${q.html || ""}
        ${q.say ? `<div class="row center"><button class="btn icon-btn" id="hearQ"><span aria-hidden="true">🔊</span>Hear it</button></div>` : ""}
        ${q.kind === "choice"
          ? `<div class="q-options">${q.options.map(optionHTML).join("")}</div>`
          : `<form class="spell-form" id="qForm" autocomplete="off">
              <label for="qAnswer" class="sr-only">Your answer</label>
              ${q.kind === "dictation"
                ? `<textarea id="qAnswer" class="answer dictation" rows="2" autocapitalize="sentences" spellcheck="false"></textarea>`
                : `<input id="qAnswer" class="answer" type="text" inputmode="${q.input === "numeric" || q.input === "decimal" ? q.input : "text"}" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" maxlength="40">`}
              <button class="btn primary" type="submit">Check ✓</button></form>`}
        <p class="feedback" id="feedback" aria-live="polite"></p>
      </section>`;
    wireStop();
    if ($("#hearQ")) $("#hearQ").onclick = () => sayQuestion(q);
    const reader = $("#passageBox") ? wireReadAlong($("#passageBox"), passage) : null;
    // Listening activities start with the story (first question) or the question's own sound
    if (act.listen && session.i === 0) reader.start(0).then(() => my === phase && sayQuestion(q));
    else sayQuestion(q);

    const finish = correct => {
      const earned = correct ? ACTIVITY_TRIES - wrong.length : 0;
      session.results.push({ item: q, correct, wrong: wrong.slice(), stars: earned,
        missed: correct && !wrong.length ? [] : (missed.length ? missed : [q.skill]) });
      if (!session.preview) countGo();
      livePing(session, "word", { word: q.label, ok: correct && !wrong.length });
      const isLast = session.i === session.items.length - 1;
      const fb = $("#feedback");
      fb.className = `feedback ${correct ? "good" : "oops"}`;
      fb.innerHTML = correct
        ? `${esc(pick(q.kind === "dictation" ? PRAISE : ACTIVITY_PRAISE)[1])} <span class="stars-inline">${stars(earned)}</span>`
        : q.kind === "dictation"
          ? `The sentence was: <b>${esc(q.answer)}</b>`
          : `The answer is <b>${esc(q.answer)}</b>${/[.!?]$/.test(q.answer) ? "" : "."} ${esc(q.explain || "")}`;
      if (correct) chimeRight(); else chimeWrong();
      // Said as well as shown: praise, or the answer and why
      later(() => (correct ? sayPhrase(pick(q.kind === "dictation" ? PRAISE : ACTIVITY_PRAISE))
        : speak(forSpeech(`The answer is ${speakable(q.answer)}. ${q.kind === "dictation" ? "" : q.explain || ""}`))), 350);
      app.querySelectorAll(".q-option, #qForm button, #qAnswer").forEach(el => { el.disabled = true; });
      const next = document.createElement("div");
      next.className = "row center";
      next.innerHTML = `<button class="btn big primary" id="nextQ">${isLast ? "See my stars 🏆" : "Next →"}</button>`;
      fb.after(next);
      $("#nextQ").focus();
      $("#nextQ").onclick = () => {
        if (isLast) return showActivitySummary();
        session.i++;
        showQuestion();
      };
    };
    const tryAgain = text => {
      chimeWrong();
      $("#feedback").className = "feedback oops";
      $("#feedback").textContent = text;
      later(() => sayPhrase(PHRASES.tryAgain), 300);
    };

    if (q.kind === "choice") {
      app.querySelectorAll("[data-hear]").forEach(b => { b.onclick = () => sayOption(q.options[Number(b.dataset.hear)]); });
      app.querySelectorAll(".q-option").forEach(b => {
        b.onclick = () => {
          const value = q.options[Number(b.dataset.opt)];
          if (norm(value) === norm(q.answer)) { b.classList.add("right"); return finish(true); }
          wrong.push(value);
          b.classList.add("wrong");
          b.disabled = true;
          if (wrong.length >= ACTIVITY_TRIES) return finish(false);
          tryAgain("🔁 Not quite. Have another go.");
        };
      });
      return;
    }

    const input = $("#qAnswer");
    input.focus();
    $("#qForm").onsubmit = e => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return input.focus();
      let right;
      if (q.kind === "dictation") {
        const m = markDictation(value, q.answer);
        right = m.right;
        missed = m.problems;
        if (!right && wrong.length + 1 < ACTIVITY_TRIES) {
          wrong.push(value);
          const tips = [];
          if (m.wrongWords.length) tips.push(`check the spelling of ${m.wrongWords.length === 1 ? "one word" : `${m.wrongWords.length} words`}`);
          if (!m.capital) tips.push("start with a capital letter");
          if (!m.endMark) tips.push("end with a full stop");
          tryAgain(`Nearly — ${tips.join(", ")}. Listen again and try once more.`);
          later(() => sayQuestion(q), 400);
          return;
        }
      } else {
        right = [q.answer].concat(q.accept || []).some(a => norm(a) === norm(value));
        if (!right && wrong.length + 1 < ACTIVITY_TRIES) {
          wrong.push(value);
          input.value = "";
          input.focus();
          return tryAgain("🔁 Not quite. Have another go.");
        }
      }
      if (!right) wrong.push(value);
      finish(right);
    };
  }

  // A separate play scene for Sound Hopper. The activity result still uses the usual
  // teacher report, help button, personal best and class progress flow.
  let hopperAudio = null;
  function hopperTone(pitch) {
    if (!settings.sounds) return; // Settings: "Play sounds for right and wrong answers"
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      hopperAudio = hopperAudio || new Audio();
      const tone = hopperAudio.createOscillator();
      const volume = hopperAudio.createGain();
      tone.type = "sine";
      tone.frequency.value = pitch;
      volume.gain.setValueAtTime(0.001, hopperAudio.currentTime);
      volume.gain.exponentialRampToValueAtTime(0.11, hopperAudio.currentTime + 0.015);
      volume.gain.exponentialRampToValueAtTime(0.001, hopperAudio.currentTime + 0.16);
      tone.connect(volume).connect(hopperAudio.destination);
      tone.start();
      tone.stop(hopperAudio.currentTime + 0.17);
      navigator.vibrate?.(12);
    } catch { /* sound and haptics are optional */ }
  }

  function showSoundHopper(q) {
    const act = session.activity;
    const wrong = [];
    const missed = new Set();
    const rejected = q.tokens.map(() => new Set());
    const locked = new Set();
    let beats = 0;
    let active = 0;
    let finished = false;
    app.innerHTML = `
      <section class="panel practice activity hopper" style="--accent:${esc(act.colour)}">
        ${progressHTML()}
        <div class="game-trail" aria-label="River crossings">${session.items.map((_, i) =>
          `<span class="trail-stone ${i < session.i ? "done" : i === session.i ? "current" : ""}" aria-label="Crossing ${i + 1}${i < session.i ? " complete" : i === session.i ? " current" : ""}">${i < session.i ? "✓" : i + 1}</span>`).join("")}</div>
        <div class="hopper-scene" id="hopperScene" aria-label="Help Pip cross the musical river">
          <div class="hopper-wave" id="hopperWave" aria-hidden="true"><span></span><span></span><span></span></div>
          <div class="hopper-river" aria-hidden="true">♪ &nbsp; ♫ &nbsp; ♪ &nbsp; ♫</div>
          <div class="hopper-bank left" aria-hidden="true"></div><div class="hopper-bank right" aria-hidden="true"></div>
          <div class="hopper-bridge" aria-hidden="true">${q.tokens.map((_, i) => `<span class="bridge-plank" data-plank="${i}"></span>`).join("")}</div>
          <img class="hopper-creature" id="hopperCreature" src="assets/brand/pip-hop-small.webp"
            alt="Pip, the sound hopper" width="88" height="88">
          <div class="hopper-reward" id="hopperReward" aria-live="polite"></div>
        </div>
        <h1 class="hopper-title">${session.i === 0 ? "Help Pip cross!" : "Another river to cross!"}</h1>
        <div class="hopper-head">
          <p class="hopper-instruction" id="hopperInstruction">Listen to the word. Tap one beat for every sound you hear.</p>
          <button type="button" class="btn small" id="hearQ">🔊 Hear it again</button>
        </div>
        <div class="hopper-beats" id="beatPhase">
          <button type="button" class="beat-pad" id="beatPad" aria-label="Tap one beat for a sound">🥁<span>Tap a beat</span></button>
          <div class="beat-side">
            <div class="beat-dots" id="beatDots" aria-live="polite">No beats yet</div>
            <div class="row center"><button type="button" class="btn" id="beatUndo" disabled>Undo a beat</button>
              <button type="button" class="btn primary" id="beatCheck" disabled>Check my beats</button></div>
          </div>
        </div>
        <div class="map-game" id="mapPhase" hidden>
          <p class="hint">Tap a tile, or drag it into the highlighted sound box.</p>
          <div class="map-slots" role="group" aria-label="Sound boxes">${q.tokens.map((_, i) =>
            `<button type="button" class="map-slot" data-slot="${i}" aria-label="Sound ${i + 1}, empty"><span class="map-number">Sound ${i + 1}</span><span class="map-value">?</span></button>`).join("")}</div>
          <div class="map-choices" id="mapChoices" role="group" aria-label="Letter tiles"></div>
        </div>
        <p class="feedback" id="feedback" aria-live="polite"></p>
      </section>`;
    // The game fills the screen: the site's top bar and footer step aside until the next screen
    document.body.classList.add("playing-game");
    window.scrollTo(0, 0);
    wireStop();
    const scene = $("#hopperScene");
    const feedback = $("#feedback");
    const slots = [...app.querySelectorAll(".map-slot")];
    const sayAgain = () => {
      const wave = $("#hopperWave");
      wave.classList.remove("pulse");
      void wave.offsetWidth;
      wave.classList.add("pulse");
      sayQuestion(q);
    };
    $("#hearQ").onclick = sayAgain;
    sayAgain();

    const renderBeats = () => {
      $("#beatDots").textContent = beats ? "● ".repeat(beats).trim() : "No beats yet";
      $("#beatUndo").disabled = beats === 0;
      $("#beatCheck").disabled = beats === 0;
    };
    $("#beatPad").onclick = () => {
      if (beats >= 8) return;
      beats++;
      hopperTone(240 + beats * 45);
      renderBeats();
    };
    $("#beatUndo").onclick = () => { beats = Math.max(0, beats - 1); renderBeats(); };
    $("#beatCheck").onclick = () => {
      if (beats !== q.tokens.length) {
        if (wrong.length < 6) wrong.push(`counted ${beats} sounds`);
        missed.add("segmenting sounds");
        feedback.className = "feedback oops";
        feedback.textContent = `You tapped ${beats}. Listen once more and tap a beat for each sound.`;
        beats = 0;
        renderBeats();
        hopperTone(190);
        sayAgain();
        return;
      }
      hopperTone(540);
      $("#beatPhase").hidden = true;
      $("#mapPhase").hidden = false;
      scene.classList.add("mapping");
      $("#hopperInstruction").textContent = `${beats} sounds! Now choose the letters for each one.`;
      feedback.className = "feedback good";
      feedback.textContent = "Great listening. Build Pip's bridge!";
      renderChoices();
      slots[0].focus();
    };

    const renderChoices = () => {
      slots.forEach((slot, i) => {
        slot.classList.toggle("active", i === active && !locked.has(i));
        slot.classList.toggle("ok", locked.has(i));
        slot.disabled = locked.has(i);
        slot.setAttribute("aria-label", `Sound ${i + 1}${locked.has(i) ? `, ${label(q.tokens[i])}, correct` : ", empty"}`);
      });
      const choices = q.optionsBySlot[active] || [];
      $("#mapChoices").innerHTML = choices.map((token, i) =>
        `<button type="button" class="map-choice" data-choice="${i}" draggable="true" ${rejected[active].has(token) ? "disabled" : ""}>${esc(label(token))}</button>`).join("");
      app.querySelectorAll(".map-choice").forEach(button => {
        const token = choices[Number(button.dataset.choice)];
        button.onclick = () => chooseTile(token);
        button.ondragstart = event => event.dataTransfer.setData("text/plain", token);
      });
    };
    const chooseTile = token => {
      if (finished || locked.has(active) || rejected[active].has(token) || !q.optionsBySlot[active].includes(token)) return;
      if (token !== q.tokens[active]) {
        if (wrong.length < 6) wrong.push(`sound ${active + 1}: ${label(token)}`);
        missed.add(q.tokens[active]);
        rejected[active].add(token);
        feedback.className = "feedback oops";
        feedback.textContent = `That tile doesn't write sound ${active + 1} in this word. Listen and try another.`;
        hopperTone(190);
        renderChoices();
        return;
      }
      locked.add(active);
      const slot = slots[active];
      slot.querySelector(".map-value").textContent = label(token);
      const plank = app.querySelector(`[data-plank="${active}"]`);
      plank.textContent = label(token);
      plank.classList.add("built", token.includes("_") || /[aeiou]/.test(token) ? "vowel" : token.length > 1 ? "digraph" : "consonant");
      hopperTone(390 + locked.size * 65);
      feedback.className = "feedback good";
      feedback.textContent = token.length > 1 ? `${label(token)} writes one sound. The bridge is growing!` : "That sound is mapped. Keep building!";
      if (locked.size === q.tokens.length) return finishHopper();
      active = q.tokens.findIndex((_, i) => !locked.has(i));
      renderChoices();
      slots[active].focus();
    };
    slots.forEach((slot, i) => {
      slot.onclick = () => { if (!locked.has(i)) { active = i; renderChoices(); } };
      slot.ondragover = event => { if (!locked.has(i)) event.preventDefault(); };
      slot.ondrop = event => {
        event.preventDefault();
        if (!locked.has(i)) { active = i; chooseTile(event.dataTransfer.getData("text/plain")); }
      };
    });

    function finishHopper() {
      if (finished) return;
      finished = true;
      const earned = wrong.length ? 1 : 2;
      session.results.push({ item: q, correct: true, wrong: wrong.slice(), stars: earned, missed: [...missed] });
      if (!session.preview) countGo();
      livePing(session, "word", { word: q.label, ok: !wrong.length });
      scene.classList.add("crossed");
      $("#hopperCreature").src = "assets/brand/pip-celebrate-small.webp";
      $("#hopperReward").textContent = wrong.length ? "♪ Bridge built!" : "✨ 💎 Perfect bridge!";
      feedback.className = "feedback good";
      feedback.innerHTML = `You built <b>${esc(q.answer)}</b> — ${q.tokens.map(t => `<span class="chip">${esc(label(t))}</span>`).join("")} <span class="stars-inline">${stars(earned)}</span>`;
      chimeRight();
      app.querySelectorAll(".map-slot, .map-choice").forEach(el => { el.disabled = true; });
      const next = document.createElement("div");
      next.className = "row center";
      const isLast = session.i === session.items.length - 1;
      next.innerHTML = `<button class="btn big primary" id="nextQ">${isLast ? "See my stars 🏆" : "Next river →"}</button>`;
      feedback.after(next);
      $("#nextQ").focus();
      $("#nextQ").onclick = () => {
        if (isLast) return showActivitySummary();
        session.i++;
        showQuestion();
      };
    }
  }

  // Pip keeps the same face as Sound Hopper, but each puzzle changes a spoken word
  // rather than counting beats. The target spelling is only shown after a solution or hint.
  function showSoundSwitch(q) {
    document.body.classList.add("playing-game");
    const act = session.activity;
    const wrong = [];
    const missed = new Set();
    const rejected = new Set();
    const startedAt = Date.now();
    let selected = -1;
    let finished = false;
    const step = q.action === "swap" ? "Change one sound" : q.action === "add" ? "Add one sound" : "Take away one sound";
    const blocks = q.action === "add"
      ? Array.from({ length: q.before.length + 1 }, (_, i) =>
          `<button type="button" class="switch-gap" data-place="${i}" aria-label="Add a sound ${i === 0 ? "at the start" : i === q.before.length ? "at the end" : `after sound ${i}`}">＋</button>`
          + (i < q.before.length ? `<span class="switch-block">${esc(label(q.before[i]))}</span>` : "")).join("")
      : q.before.map((sound, i) => `<button type="button" class="switch-block" data-place="${i}" aria-label="Sound ${i + 1}: ${esc(label(sound))}">${esc(label(sound))}</button>`).join("");
    app.innerHTML = `
      <section class="panel practice activity sound-switch" style="--accent:${esc(act.colour)}">
        ${progressHTML()}
        <div class="game-trail" aria-label="Workshop doors">${session.items.map((_, i) =>
          `<span class="trail-stone ${i < session.i ? "done" : i === session.i ? "current" : ""}" aria-label="Door ${i + 1}${i < session.i ? " complete" : i === session.i ? " current" : ""}">${i < session.i ? "✓" : i + 1}</span>`).join("")}</div>
        <div class="switch-scene" id="switchScene" role="img" aria-label="Pip beside a locked workshop door">
          <div class="switch-cloud one"></div><div class="switch-cloud two"></div>
          <div class="switch-floor"></div>
          <img class="hopper-creature" src="assets/brand/pip-think-small.webp"
            alt="" width="88" height="88">
          <div class="switch-door-frame"><div class="switch-door"><span class="switch-lock">🔒</span></div></div>
          <span class="switch-spark" aria-hidden="true">✦ ✧ ✦</span>
        </div>
        <h1>Help Pip open the door!</h1>
        <p class="switch-instruction">${step} in <b>${esc(q.source)}</b> to make the word you hear.</p>
        <div class="row center"><button type="button" class="btn" id="hearSwitch">🔊 Hear the new word</button>
          <button type="button" class="btn" id="hintSwitch">👀 Show the word</button></div>
        <div class="switch-work" aria-label="Change the sound blocks">
          <p class="hint">${q.action === "add" ? "Tap a + where the new sound belongs, then choose its tile." : q.action === "remove" ? "Tap the sound block to take away." : "Tap the sound block that changes, then choose its new tile."}</p>
          <div class="switch-blocks" role="group" aria-label="${esc(q.source)} sound blocks">${blocks}</div>
          <div class="switch-choices" id="switchChoices" role="group" aria-label="New sound tiles" hidden></div>
        </div>
        <p class="feedback" id="feedback" aria-live="polite"></p>
      </section>`;
    wireStop();
    const scene = $("#switchScene");
    const feedback = $("#feedback");
    const positions = [...app.querySelectorAll("[data-place]")];
    const hear = async () => {
      const here = phase;
      await sayPhrase([`switch-${q.action}`, `${step}. Listen to the first word.`]);
      if (here !== phase || finished) return;
      await sayWord(q.source);
      if (here !== phase || finished) return;
      await sayPhrase(["switch-make", "Make this word."]);
      if (here === phase && !finished) sayWord(q.answer);
    };
    $("#hearSwitch").onclick = hear;
    hear();

    const markMistake = (text, skill, message) => {
      if (wrong.length < 8) wrong.push(text);
      missed.add(skill);
      hopperTone(190);
      feedback.className = "feedback oops";
      feedback.textContent = message || (wrong.length >= 2 ? "Listen again. The glowing place is the sound to change." : "Listen again and try another sound.");
      if (wrong.length >= 2) positions[q.index].classList.add("hinted");
    };
    const chooseSound = sound => {
      if (finished || selected !== q.index || rejected.has(sound) || !q.choices.includes(sound)) return;
      if (sound !== q.answerSound) {
        rejected.add(sound);
        markMistake(`tried ${label(sound)} for ${label(q.answerSound)}`, q.answerSound,
          "That tile does not make the word you heard. Listen and try another tile.");
        renderChoices();
        return;
      }
      finish();
    };
    const renderChoices = () => {
      const box = $("#switchChoices");
      if (selected < 0 || finished || q.action === "remove") { box.hidden = true; return; }
      box.hidden = false;
      box.innerHTML = q.choices.map((sound, i) => `<button type="button" class="switch-choice" data-choice="${i}" draggable="true" ${rejected.has(sound) ? "disabled" : ""}>${esc(label(sound))}</button>`).join("");
      box.querySelectorAll("[data-choice]").forEach(button => {
        const sound = q.choices[Number(button.dataset.choice)];
        button.onclick = () => chooseSound(sound);
        button.ondragstart = event => event.dataTransfer.setData("text/plain", sound);
      });
    };
    positions.forEach(button => {
      button.onclick = () => {
        if (finished) return;
        const index = Number(button.dataset.place);
        if (index !== q.index) {
          markMistake(`picked place ${index + 1}`, q.skill);
          return;
        }
        if (q.action === "remove") return finish();
        selected = index;
        positions.forEach(p => p.classList.toggle("selected", p === button));
        feedback.className = "feedback good";
        feedback.textContent = "You found the sound! Choose its new tile.";
        renderChoices();
        $("#switchChoices button:not(:disabled)")?.focus();
      };
      button.ondragover = event => { if (!finished && q.action !== "remove") event.preventDefault(); };
      button.ondrop = event => {
        event.preventDefault();
        if (finished || q.action === "remove") return;
        if (Number(button.dataset.place) !== q.index) { button.click(); return; }
        button.click();
        chooseSound(event.dataTransfer.getData("text/plain"));
      };
    });
    $("#hintSwitch").onclick = () => {
      if (finished) return;
      if (!wrong.includes("used written word hint")) wrong.push("used written word hint");
      missed.add("needed a written word hint");
      feedback.className = "feedback good";
      feedback.innerHTML = `The new word is <b>${esc(q.answer)}</b>. Say it, then find the sound that changes.`;
      positions[q.index].classList.add("hinted");
    };

    function finish() {
      if (finished) return;
      finished = true;
      const earned = wrong.length ? 1 : 2;
      session.results.push({ item: q, correct: true, wrong: wrong.slice(), stars: earned, missed: [...missed],
        seconds: Math.min(3600, Math.max(1, Math.round((Date.now() - startedAt) / 1000))) });
      if (!session.preview) countGo();
      livePing(session, "word", { word: q.label, ok: !wrong.length });
      positions.forEach(p => { p.disabled = true; });
      $("#switchChoices").hidden = true;
      $("#hintSwitch").disabled = true;
      scene.classList.add("open");
      scene.querySelector(".hopper-creature").src = "assets/brand/pip-celebrate-small.webp";
      scene.setAttribute("aria-label", "The door opens and Pip walks through");
      hopperTone(660);
      chimeRight();
      feedback.className = "feedback good";
      feedback.innerHTML = `Door open! <b>${esc(q.source)} → ${esc(q.answer)}</b><br>Read the new word: ${q.after.map(sound => `<span class="chip">${esc(label(sound))}</span>`).join("")} <span class="stars-inline">${stars(earned)}</span>`;
      sayWord(q.answer);
      const next = document.createElement("div");
      next.className = "row center";
      const last = session.i === session.items.length - 1;
      next.innerHTML = `<button class="btn" id="hearResult">🔊 Hear ${esc(q.answer)}</button><button class="btn big primary" id="nextQ">${last ? "See my stars 🏆" : "Next door →"}</button>`;
      feedback.after(next);
      $("#hearResult").onclick = () => sayWord(q.answer);
      $("#nextQ").focus();
      $("#nextQ").onclick = () => { if (last) showActivitySummary(); else { session.i++; showQuestion(); } };
    }
  }

  /* ---------- Counting Canopy: four ways to think about number ---------- */

  const CANOPY_FLASH = { 1: [0], 2: [0, 1], 3: [0, 1, 2],
    4: [0, 1, 5, 6], 5: [0, 1, 2, 3, 4], 6: [0, 1, 2, 5, 6, 7] };
  function canopyFrame(count, size = 10, flash = false) {
    const spots = new Set(flash ? CANOPY_FLASH[count] : Array.from({ length: count }, (_, i) => i));
    return `<div class="canopy-frame${size === 20 ? " twenty" : ""}" role="img" aria-label="${count} ${count === 1 ? "firefly" : "fireflies"} in a ${size}-frame">
      ${Array.from({ length: size }, (_, i) => `<span class="canopy-cell${spots.has(i) ? " lit" : ""}">${spots.has(i) ? "✦" : ""}</span>`).join("")}</div>`;
  }

  function showCountingCanopy(q) {
    document.body.classList.add("playing-game");
    const act = session.activity;
    const wrong = [];
    const missed = new Set();
    const rejected = new Set();
    const startedAt = Date.now();
    let finished = false;
    let hinted = false;
    let keepFlash = false;
    let flashTimer = null;
    let revealFlash = () => {};
    let left = 0;
    const instructions = {
      flash: "The fireflies light Pip's path. How many flashed? Look again whenever you like.",
      make: `Pip needs one bridge of ${q.total} fireflies. Pick a group for each side so they make ${q.total} altogether.`,
      hide: `Some fireflies are behind the leaves. There are ${q.total} altogether and ${q.visible} are showing. How many are hidden?`,
      compare: "Pip has reached a fork. Which tree has more fireflies, or are they the same?"
    };
    const headings = { flash: "Light the path", make: "Cross the river", hide: "Find the hidden fireflies", compare: "Choose Pip's path" };
    const sceneNames = { flash: "Firefly meadow", make: "River crossing", hide: "Leafy hideout", compare: "Forest fork" };
    const sceneIcons = { flash: "✦", make: "", hide: "🍃", compare: "↗" };
    app.innerHTML = `
      <section class="panel practice activity counting-canopy" style="--accent:${esc(act.colour)}">
        ${progressHTML()}
        <div class="game-trail" aria-label="Forest clearings">${session.items.map((round, i) =>
          `<span class="trail-stone ${i < session.i ? "done" : i === session.i ? "current" : ""}" aria-label="Clearing ${i + 1}: ${sceneNames[round.mode]}${i < session.i ? " complete" : i === session.i ? " current" : ""}">${i < session.i ? "✓" : ({ flash: "✦", make: "🌉", hide: "🍃", compare: "↗" })[round.mode]}</span>`).join("")}</div>
        <p class="canopy-glow">✨ <b id="canopySeeds">${session.results.length}</b> glow seeds collected this run</p>
        <div class="canopy-scene ${q.mode}" id="canopyScene" role="img" aria-label="Pip at the ${sceneNames[q.mode].toLowerCase()}">
          <span class="canopy-sun" aria-hidden="true"></span><span class="canopy-tree one" aria-hidden="true"></span>
          <span class="canopy-tree two" aria-hidden="true"></span><span class="canopy-stream" aria-hidden="true"></span>
          <span class="canopy-bridge" aria-hidden="true">${Array.from({ length: 8 }, () => "<i></i>").join("")}</span>
          <img class="canopy-pip" id="canopyPip" src="assets/brand/pip-listen-small.webp" alt="" width="100" height="100">
          <span class="canopy-obstacle" aria-hidden="true">${sceneIcons[q.mode]}</span>
          <span class="canopy-goal" aria-hidden="true">${session.i === session.items.length - 1 ? "🦉" : "⭐"}</span>
          <span class="canopy-scene-name">${sceneNames[q.mode]}</span>
        </div>
        <div class="canopy-head"><h1>${headings[q.mode]}</h1>
          <button type="button" class="btn small" id="canopyHear">🔊 Hear Pip</button></div>
        <p class="canopy-instruction">${esc(instructions[q.mode])}</p>
        <div class="canopy-work" id="canopyWork"></div>
        <div class="row center"><button type="button" class="btn small" id="canopyHint">💡 Show a clue</button></div>
        <p class="feedback" id="feedback" aria-live="polite"></p>
      </section>`;
    wireStop();
    const work = $("#canopyWork");
    const feedback = $("#feedback");
    const scene = $("#canopyScene");
    const cue = q.mode === "make" ? `canopy-make-${q.total}`
      : q.mode === "hide" ? `canopy-hide-${q.total}-${q.visible}` : `canopy-${q.mode}`;
    const listen = () => sayPhrase([cue, instructions[q.mode]]);
    $("#canopyHear").onclick = listen;
    listen();

    function mistake(value, message) {
      if (wrong.length < 8) wrong.push(value);
      missed.add(q.skill);
      feedback.className = "feedback oops";
      feedback.textContent = message;
      hopperTone(210);
    }
    function finish(methods = []) {
      if (finished) return;
      finished = true;
      if (flashTimer) clearTimeout(flashTimer);
      const earned = wrong.length ? 1 : 2;
      session.results.push({ item: q, correct: true, wrong: wrong.slice(), stars: earned,
        missed: [...missed], methods, seconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)) });
      awardForestClearing(session);
      $("#canopySeeds").textContent = String(session.results.length);
      if (!session.preview) countGo();
      livePing(session, "word", { word: q.label, ok: !wrong.length });
      scene.classList.add("solved");
      $("#canopyPip").src = "assets/brand/pip-celebrate-small.webp";
      const result = q.mode === "make" ? `${methods[0]} makes ${q.total}. The whole bridge is ready!`
        : q.mode === "hide" ? `${q.visible} and ${q.answer} make ${q.total}`
        : q.mode === "compare" ? `${q.left} and ${q.right}: ${q.answer === "same" ? "the same amount" : `${q.answer} has more`}`
        : `${q.total} ${q.total === 1 ? "firefly" : "fireflies"}`;
      const payoff = { flash: "The path lights up!", make: "Pip crosses the river!", hide: "The fireflies come out!", compare: "Pip found the way!" }[q.mode];
      feedback.className = "feedback good";
      feedback.innerHTML = `${payoff} <b>${esc(result)}</b> <span class="stars-inline">${stars(earned)}</span>`;
      chimeRight();
      app.querySelectorAll("#canopyWork button, #canopyHint").forEach(button => { button.disabled = true; });
      const next = document.createElement("div");
      next.className = "row center";
      const last = session.i === session.items.length - 1;
      next.innerHTML = `<button class="btn big primary" id="nextQ" disabled>${last ? "See the forest celebration 🏆" : "Keep exploring →"}</button>`;
      feedback.after(next);
      const nextButton = $("#nextQ");
      nextButton.onclick = () => { if (last) showActivitySummary(); else { session.i++; showQuestion(); } };
      setTimeout(() => { if (app.contains(nextButton)) { nextButton.disabled = false; nextButton.focus(); } },
        matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1900);
    }
    function choices(options, labelFor, wrongMessage, visual = false) {
      const box = $("#canopyChoices");
      box.innerHTML = options.map((value, i) => `<button type="button" class="canopy-choice${visual ? " visual" : ""}" data-choice="${i}" ${rejected.has(String(value)) ? "disabled" : ""}>
        ${visual ? `<span class="canopy-choice-stars" aria-hidden="true">${"✦".repeat(Number(value))}</span><b>${esc(labelFor(value))}</b>` : esc(labelFor(value))}</button>`).join("");
      box.querySelectorAll("[data-choice]").forEach(button => {
        const value = String(options[Number(button.dataset.choice)]);
        button.onclick = () => {
          if (finished || rejected.has(value)) return;
          if (value === q.answer) return finish();
          rejected.add(value);
          mistake(labelFor(value), wrongMessage);
          button.disabled = true;
          if (rejected.size >= 2) box.querySelectorAll("button").forEach(b => {
            if (String(options[Number(b.dataset.choice)]) === q.answer) b.classList.add("hinted");
          });
        };
      });
    }
    function renderMake() {
      const group = (n, side) => `<button type="button" class="canopy-group-card" data-side="${side}" data-count="${n}"
        aria-label="Choose ${n} ${n === 1 ? "firefly" : "fireflies"} for ${side === "left" ? "the first" : "the second"} side">
        <span class="canopy-group-stars" aria-hidden="true">${"✦".repeat(n)}</span><strong>${n}</strong></button>`;
      const firstOptions = [1, 2, 3, 4].filter(n => n < q.total);
      const needed = q.total - left;
      const secondOptions = left ? shuffle([needed, ...[needed - 2, needed - 1, needed + 1, needed + 2]
        .filter(n => n > 0 && n < q.total).slice(0, 2)]) : [];
      work.innerHTML = `<p class="canopy-target">Light the bridge with <b>${q.total}</b> fireflies</p>
        <div class="canopy-bridge-builder"><div class="canopy-selected"><span>First side</span>
          <b>${left ? `${"✦".repeat(left)} <small>${left}</small>` : "?"}</b></div>
          <span class="canopy-plus">+</span><div class="canopy-selected"><span>Second side</span><b>?</b></div></div>
        <p class="canopy-pick">${left ? `Choose a second group to make ${q.total} altogether.` : "Choose a first group of fireflies."}</p>
        <div class="canopy-group-options" role="group" aria-label="${left ? "Choose the second firefly group" : "Choose the first firefly group"}">
          ${(left ? secondOptions : firstOptions).map(n => group(n, left ? "right" : "left")).join("")}</div>
        ${left ? `<button type="button" class="btn small canopy-change" id="canopyChange">↩ Change first group</button>` : ""}`;
      work.querySelectorAll("[data-count]").forEach(button => {
        button.onclick = () => {
          const n = Number(button.dataset.count);
          if (button.dataset.side === "left") {
            left = n;
            feedback.textContent = "";
            hopperTone(390);
            renderMake();
            work.querySelector("[data-side=right]")?.focus();
          } else if (left + n === q.total) {
            work.querySelectorAll(".canopy-selected b")[1].innerHTML = `${"✦".repeat(n)} <small>${n}</small>`;
            finish([`${left} + ${n}`]);
          }
          else {
            mistake(`${left} + ${n}`, `${left} and ${n} make ${left + n}. Pip needs ${q.total}. Try another group.`);
            button.disabled = true;
          }
        };
      });
      if (left) $("#canopyChange").onclick = () => { left = 0; renderMake(); };
    }
    if (q.mode === "make") renderMake();
    else if (q.mode === "flash") {
      work.innerHTML = `<div class="canopy-flash" id="canopyFlash">${canopyFrame(q.total, 10, true)}
        <span class="canopy-cover" aria-hidden="true">🍃</span></div>
        <button type="button" class="btn small" id="canopyAgain">👀 Look again</button>
        <div class="canopy-choices" id="canopyChoices" role="group" aria-label="How many fireflies?"></div>`;
      const flash = $("#canopyFlash");
      revealFlash = () => {
        flash.classList.remove("covered");
        if (flashTimer) clearTimeout(flashTimer);
        if (!keepFlash) flashTimer = setTimeout(() => { if (!finished && app.contains(flash)) flash.classList.add("covered"); }, 1800);
      };
      $("#canopyAgain").onclick = revealFlash;
      choices(q.options, n => String(n), "Look again at the fireflies. You can replay them as often as you like.", true);
      revealFlash();
    } else if (q.mode === "hide") {
      work.innerHTML = `<p class="canopy-target"><b>${q.total}</b> fireflies in all</p>
        <div class="canopy-groups"><div><h2>I can see ${q.visible}</h2>${canopyFrame(q.visible, q.total > 10 ? 20 : 10)}</div>
          <div class="canopy-hidden"><span aria-hidden="true">🍃</span><b>How many are hiding?</b></div></div>
        <div class="canopy-choices" id="canopyChoices" role="group" aria-label="How many are hiding?"></div>`;
      choices(q.options, n => String(n), `Count on from ${q.visible} to ${q.total}. How many more?`, true);
    } else {
      work.innerHTML = `<div class="canopy-groups compare"><div><h2>Owl's tree</h2>${canopyFrame(q.left)}</div>
        <div><h2>Fox's tree</h2>${canopyFrame(q.right)}</div></div>
        <div class="canopy-choices" id="canopyChoices" role="group" aria-label="Compare the two groups"></div>`;
      choices(q.options, v => ({ left: "Owl has more", same: "The same", right: "Fox has more" })[v],
        "Look again. Line up the fireflies in both groups and see which has extras.");
    }
    $("#canopyHint").onclick = () => {
      if (finished) return;
      if (!hinted) { hinted = true; if (wrong.length < 8) wrong.push("used a clue"); missed.add(q.skill); }
      feedback.className = "feedback good";
      if (q.mode === "flash") {
        keepFlash = true; revealFlash();
        feedback.textContent = "The fireflies will stay visible. Look for groups you know.";
      } else if (q.mode === "make") {
        feedback.textContent = left ? `Start with ${left}. Count on until ${q.total}. How many more fireflies do you need?`
          : `Choose a first group. Then count how many more you need to make ${q.total}.`;
      } else if (q.mode === "hide") {
        feedback.textContent = `Count on: ${Array.from({ length: q.total - q.visible + 1 }, (_, i) => q.visible + i).join(", ")}. How many hops?`;
      } else {
        feedback.textContent = `Owl has ${q.left}; Fox has ${q.right}. Which has more, or are they equal?`;
      }
    };
  }

  function showActivitySummary() {
    newScreen();
    const r = session.results;
    const right = r.filter(x => x.correct).length;
    const firstGo = r.filter(x => x.correct && !x.wrong.length).length;
    const earned = r.reduce((t, x) => t + x.stars, 0);
    const skills = {};
    r.forEach(x => x.missed.forEach(s => { skills[s] = (skills[s] || 0) + 1; }));
    const act = session.activity;
    const canopy = String(act.id || "").startsWith("g-canopy-");
    const glowEarned = canopy ? r.length : 0;
    const bestNotes = personalBests(session, firstGo, r.length);
    app.innerHTML = `
      <section class="panel summary" style="--accent:${esc(act.colour)}">
        ${previewBanner()}
        ${pipHTML("big", "cheer", "", "celebrate")}
        <h1>${right === r.length ? (firstGo === r.length ? "Perfect — all right first time!" : "You got them all!") : `You got ${right} out of ${r.length}!`}</h1>
        <p class="meta">${session.pupil ? `${esc(session.pupil)} · ` : ""}${esc(act.title)} · ★ ${earned} stars · ${firstGo} right first time</p>
        ${canopy ? `<div class="canopy-victory" role="status">
          <span aria-hidden="true">✨ 🦉 ✨</span><h2>Forest Explorer!</h2>
          <p>Pip reached the owl and opened ${r.length} forest clearings. The whole path is glowing!</p>
          <p>${session.preview ? "Teacher preview: no glow seeds are saved." : `You collected ${glowEarned} glow seeds to build Pip's Forest!`}</p></div>
          <div id="forestCollection"></div>
          ${session.preview ? "" : `<p><a class="btn small" href="#/forest">Visit my forest →</a></p>`}` : ""}
        ${REPORTING && !session.preview ? `<p class="sent no-print" id="sent" aria-live="polite">📤 Sending to your teacher…</p>` : ""}
        ${bestsHTML(bestNotes)}
        ${Object.keys(skills).length ? `<div class="sound-report"><h2>To practise</h2><ul>${Object.entries(skills).sort((a, b) => b[1] - a[1])
          .map(([s, n]) => `<li><span class="chip">${esc(s)}</span> ×${n}</li>`).join("")}</ul></div>` : ""}
        <table class="results">
          <thead><tr><th>Question</th><th>Result</th><th>Your answers</th></tr></thead>
          <tbody>${r.map(x => `<tr class="${x.correct ? "" : "missed"}"><td class="rw">${esc(x.item.label)}</td>
            <td>${x.correct ? `<span class="star-cell">${stars(x.stars)}</span>` : `<span class="miss">Answer: ${esc(x.item.answer)}</span>`}</td>
            <td class="tries-cell">${x.wrong.length ? x.wrong.map(w => `<s>${esc(w)}</s>`).join(" ") : "—"}</td></tr>`).join("")}</tbody>
        </table>
        <div class="row center no-print">
          <button class="btn primary" id="againAct">Have another go</button>
          <a class="btn" href="#/">Choose something else</a>
        </div>
      </section>`;
    if (canopy) renderForestCollection($("#forestCollection"), session.preview);
    sayPhrase(right === r.length ? PHRASES.allDone : PHRASES.finished);
    livePing(session, "end");
    session.ended = true;
    const my = phase;
    if (!session.preview) syncProgress(); // so the stars and bests are there on any device
    sendReport(session, true).then(sent => {
      const note = $("#sent");
      if (!note || my !== phase || sent === null) return;
      note.textContent = sent ? "✓ Sent to your teacher" : "Saved — it will reach your teacher when the internet is back.";
    });
    $("#againAct").onclick = () => startActivity(act);
  }

  /* ---------- Starting checks: where each pupil starts in the teaching order ---------- */

  // One try per question, no help and no marks shown, so the teacher's Next steps can start each
  // pupil in the right place. Spelling uses new words (each list's challenge words): it tries a few
  // lists spread through each stage, and only goes through a stage list by list once one is missed.
  // Numbers tries two questions from each numeracy activity, easiest level first. Both stop after
  // 3 gaps, as the work beyond them is too hard for now.
  const CHECK_GAPS = 3;
  const CHECK_SCREEN = 4;
  const CHECKS = {
    spelling: { id: "check-spelling", title: "Starting check: spelling", icon: "🔤", accent: "#0f766e",
      blurb: "Listen to each word and spell it. Some words get tricky. That's fine, just have a go!" },
    numbers: { id: "check-numbers", title: "Starting check: numbers", icon: "🔢", accent: "#FF4081",
      blurb: "Answer each question. Some get tricky. That's fine, just have a go!" }
  };
  const checkKind = id => Object.keys(CHECKS).find(k => CHECKS[k].id === id) || null;
  // Placement work (starting checks and Pip's Sound Quest) deliberately goes past what a pupil
  // can do yet, so it's kept out of progress figures, stars and the CfE overview
  const isAssessment = id => !!checkKind(id) || /^assess-/.test(String(id || ""));

  const LEVELS = ["Early", "First", "Second"];
  const numberOrder = () => {
    const area = window.PopActivities && window.PopActivities.AREAS.find(a => a.id === "numeracy");
    return area ? area.activities.filter(a => a.check !== false).sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level)) : [];
  };
  // Up to n lists spread evenly through a stage, always including its first and last
  const spread = (ids, n) => ids.length <= n ? ids : Array.from({ length: n }, (_, k) => ids[Math.round((k * (ids.length - 1)) / (n - 1))]);

  function checkWord(id) {
    const l = LISTS[id];
    const pool = l.checks.length ? l.checks : l.items;
    return Object.assign({}, pool[Math.floor(Math.random() * pool.length)], { challenge: false, from: id });
  }

  // Each yields the next question; the answer to it is in results by the time it resumes.
  // ask makes the question for a list: a word to spell, or (Pip's Sound Quest) a word to read.
  function* spellingQuestions(results, ask = checkWord) {
    const lastRight = () => results[results.length - 1].correct;
    let gaps = 0;
    for (const stage of STAGES) {
      const ids = stage.lists.map(l => l.id);
      const tried = {};
      let missed = false;
      for (const id of spread(ids, CHECK_SCREEN)) {
        yield ask(id);
        tried[id] = lastRight();
        if (!tried[id]) { missed = true; break; }
      }
      if (!missed) continue;
      for (const id of ids) {
        if (!(id in tried)) { yield ask(id); tried[id] = lastRight(); }
        if (!tried[id] && ++gaps >= CHECK_GAPS) return;
      }
    }
  }
  function* numberQuestions(results) {
    let gaps = 0;
    for (const act of numberOrder()) {
      let missed = false;
      for (const q of act.make().slice(0, 2)) {
        yield Object.assign({ spelling: q.label, tokens: [] }, q, { from: act.id });
        if (!results[results.length - 1].correct) missed = true;
      }
      if (missed && ++gaps >= CHECK_GAPS) return;
    }
  }

  // The lists or activities with a gap (any word or question missed), in teaching order
  function checkGaps(words) {
    const order = STAGES.flatMap(st => st.lists.map(l => l.id)).concat(numberOrder().map(a => a.id));
    return [...new Set(words.filter(w => w.from && !w.correct).map(w => w.from))]
      .sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }

  function showCheckStart(kind) {
    const c = CHECKS[kind];
    document.title = `${c.title} · ${SITE.title}`;
    app.innerHTML = `
      <section class="panel start" style="--accent:${esc(c.accent)}">
        <a class="back" href="#/">← All lists</a>
        ${previewBanner()}
        <div class="start-pip">${pipHTML("small", "bob", "", "think")}</div>
        <p class="eyebrow">${c.icon} Starting check</p>
        <h1>${esc(c.title.replace("Starting check: ", "Let's see what you know: "))}</h1>
        <p class="tip">${esc(c.blurb)}</p>
        <p class="hint">You get one go at each question, and it stops by itself when the questions get too hard. It takes about 10 minutes.</p>
        ${previewMode ? "" : `<div class="pupil" id="pupilBox"></div>`}
        <button class="btn big primary" id="go">${previewMode ? "▶ Test this check" : "▶ Start"}</button>
      </section>`;
    const go = $("#go");
    if (previewMode) { go.onclick = () => startCheck(kind); go.focus(); return; }
    const box = $("#pupilBox");
    mountPupil(box, { onEnter: () => go.click() });
    (getPupil() ? go : box.querySelector(".pupil-name")).focus();
    go.onclick = () => { if (takePupilName(box)) startCheck(kind); };
  }

  function startCheck(kind) {
    const c = CHECKS[kind];
    const results = [];
    session = {
      list: { id: c.id, title: c.title, accent: c.accent }, check: kind, i: -1, results, items: [],
      pupil: previewMode ? "" : getPupil(), sent: false, preview: previewMode, secureBefore: new Set(),
      questions: kind === "spelling" ? spellingQuestions(results) : numberQuestions(results)
    };
    livePing(session, "start");
    nextCheckQuestion();
  }

  function nextCheckQuestion() {
    const step = session.questions.next();
    if (step.done) return session.quest ? showIslandEnd() : showCheckEnd();
    session.items.push(step.value);
    session.i = session.items.length - 1;
    showCheckQuestion();
  }

  function showCheckQuestion() {
    newScreen();
    const q = session.items[session.i];
    const spelling = session.check === "spelling";
    const quest = session.quest;
    if (!spelling && !q.say) q.say = questionSay(q); // read out, as in every activity
    const hearOptions = q.kind === "choice" && (q.sayOptions || q.options.some(o => /[a-z]{2}/i.test(o)));
    app.innerHTML = `
      <section class="panel practice activity${quest ? " quest-q" : ""}" style="--accent:${esc(session.list.accent)}">
        ${previewBanner()}
        <div class="progress">
          <a class="stop" href="#/" id="stopLink">✕ ${quest ? "Map" : "Stop"}</a>
          <span>${quest ? `${quest.icon} ${esc(quest.title)}` : `${spelling ? "Word" : "Question"} ${session.i + 1}`}</span>
          ${helpHTML()}
        </div>
        ${quest ? `<div class="quest-stones" aria-hidden="true">${session.items.map((_, k) => `<span class="${k < session.i ? "done" : "now"}"></span>`).join("")}</div>
          <div class="quest-pip">${pipHTML("small", "bob", "", quest.pose)}</div>` : ""}
        <p class="phase q-prompt">${spelling ? "Listen, then spell the word" : esc(q.prompt)}</p>
        ${spelling ? sentenceHTML(q, true) : q.html || ""}
        ${q.kind === "choice"
          ? `<div class="q-options${q.readWords ? " read-words" : ""}">${q.options.map((opt, i) => `<div class="q-option-wrap"><button type="button" class="q-option" data-opt="${i}">${esc(opt)}</button>
              ${hearOptions ? `<button type="button" class="q-hear" data-hear="${i}" aria-label="Hear ${esc(opt)}">🔊</button>` : ""}</div>`).join("")}</div>`
          : `<form class="spell-form" id="checkForm" autocomplete="off">
              <label for="checkAnswer" class="sr-only">Your answer</label>
              <input id="checkAnswer" class="answer" type="text" inputmode="${q.input === "numeric" || q.input === "decimal" ? q.input : "text"}" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" maxlength="40">
              <button class="btn primary" type="submit">Next →</button></form>`}
        ${spelling ? `<div class="row center">
          <button class="btn" id="hear" type="button">🔊 Hear the word</button>
          ${wantSentence(q) ? `<button class="btn" id="hearSentence" type="button">💬 Hear the sentence</button>` : ""}
        </div>` : q.say ? `<div class="row center"><button class="btn" id="hearQ" type="button">🔊 Hear it again</button></div>` : ""}
      </section>`;
    wireStop();

    // No marks during the check: the answer is kept and the next question comes straight away
    const answer = value => {
      let correct;
      let missed = [];
      if (spelling) {
        const res = compare(value, q);
        correct = res.right;
        if (!correct) missed = res.boxes.filter(b => !b.ok).map(b => b.tok);
      } else {
        correct = [q.answer].concat(q.accept || []).some(a => norm(a) === norm(value));
        if (!correct) missed = [q.skill];
      }
      session.results.push({ item: q, correct, wrong: correct ? [] : [value], stars: 0, missed });
      livePing(session, "word", { word: q.label || q.spelling, ok: correct });
      if (!quest) return nextCheckQuestion();
      // The quest never says right or wrong: every answer gets the same friendly sparkle
      tones([587, 784], 0.12);
      app.querySelectorAll(".q-option, .q-hear, #checkForm button, #checkAnswer").forEach(el => { el.disabled = true; });
      const sparkle = document.createElement("p");
      sparkle.className = "quest-sparkle pop";
      sparkle.textContent = `✨ ${pick(CHEERS)}`;
      app.querySelector(".practice").append(sparkle);
      later(() => nextCheckQuestion(), 750);
    };

    if (spelling) {
      $("#hear").onclick = () => { sayWord(q.spelling); $("#checkAnswer").focus(); };
      if ($("#hearSentence")) $("#hearSentence").onclick = () => { saySentence(q); $("#checkAnswer").focus(); };
      sayWordInSentence(q);
    } else {
      if ($("#hearQ")) $("#hearQ").onclick = () => sayQuestion(q);
      sayQuestion(q);
    }
    if (q.kind === "choice") {
      app.querySelectorAll("[data-hear]").forEach(b => { b.onclick = () => sayOption(q.options[Number(b.dataset.hear)]); });
      app.querySelectorAll(".q-option").forEach(b => { b.onclick = () => answer(q.options[Number(b.dataset.opt)]); });
      return;
    }
    const input = $("#checkAnswer");
    input.focus();
    $("#checkForm").onsubmit = e => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return input.focus();
      answer(value);
    };
  }

  function showCheckEnd() {
    newScreen();
    const n = session.results.length;
    app.innerHTML = `
      <section class="panel summary" style="--accent:${esc(session.list.accent)}">
        ${previewBanner()}
        ${pipHTML("big", "cheer", "", "celebrate")}
        <h1>All done, thank you!</h1>
        <p class="meta">${session.pupil ? `${esc(session.pupil)} · ` : ""}${esc(session.list.title)} · ${plural(n, session.check === "spelling" ? "word" : "question", session.check === "spelling" ? "words" : "questions")}</p>
        <p class="tip">You worked really hard. Your teacher will use this to choose the right work for you.</p>
        ${REPORTING && !session.preview ? `<p class="sent" id="sent" aria-live="polite">📤 Sending to your teacher…</p>` : ""}
        <div class="row center"><a class="btn primary" href="#/">Back to the start</a></div>
      </section>`;
    sayPhrase(PHRASES.finished);
    livePing(session, "end");
    session.ended = true;
    const my = phase;
    sendReport(session, true).then(sent => {
      const note = $("#sent");
      if (!note || my !== phase || sent === null) return;
      note.textContent = sent ? "✓ Sent to your teacher" : "Saved — it will reach your teacher when the internet is back.";
    });
  }

  /* ---------- Pip's Sound Quest: a full starting assessment, played as five islands ---------- */

  // A professional placement check that feels like a game. No marks are ever shown: every answer
  // gets a sparkle. Each island stops by itself once it gets too hard, so a child is never left
  // struggling, and each is sent to the teacher on its own, so the quest can be split across
  // lessons. Spelling and numbers use the starting checks' ids, so Next steps uses them as well.
  const QUEST_ID = "assess";
  const QUEST = [
    { key: "listen", id: "assess-listen", title: "Listening Lagoon", icon: "👂", colour: "#12C6B7", pose: "listen",
      intro: "Pip's friends love sounds! Listen to each word, then tap your answer. Tap 🔊 to hear a word again." },
    { key: "read", id: "assess-read", title: "Reading Reef", icon: "📖", colour: "#0EB5F2", pose: "think",
      intro: "Pip will say a word. Find it and tap it! Say the sounds in each word to help you." },
    { key: "spell", id: "check-spelling", title: "Spelling Sands", icon: "✏️", colour: "#0f766e", pose: "listen",
      intro: "Pip will say a word, then use it in a sentence. Write it in the sand! Some words get tricky, so just have a go." },
    { key: "story", id: "assess-story", title: "Story Cove", icon: "📚", colour: "#F59E0B", pose: "think",
      intro: "Read Pip's story all by yourself, then answer the questions about it." },
    { key: "numbers", id: "check-numbers", title: "Number Peak", icon: "🔢", colour: "#FF4081", pose: "hop",
      intro: "Climb Number Peak! Answer each question. Some get tricky, so just have a go." }
  ];
  const QUEST_KEY = "popspell-quest-v1";
  const readQuestAll = () => { try { return JSON.parse(localStorage.getItem(QUEST_KEY)) || {}; } catch { return {}; } };
  const loadQuest = () => readQuestAll()[pupilKey()] || {};
  function saveQuest(state) {
    const all = readQuestAll();
    all[pupilKey()] = state;
    try { localStorage.setItem(QUEST_KEY, JSON.stringify(all)); } catch { /* private mode */ }
  }
  const CHEERS = ["Nice one!", "Thank you!", "Great trying!", "Keep going!", "Super!", "Brilliant effort!"];

  // Listening Lagoon: three each of rhyme, first sounds and counting sounds (all spoken)
  function* listenQuestions() {
    const A = window.PopActivities;
    for (const id of ["l-rhyme", "l-first-sound", "l-count-sounds"]) {
      const act = A && A.get(id);
      if (act) for (const q of act.make().slice(0, 3)) yield Object.assign({ spelling: q.label, tokens: [] }, q, { from: id });
    }
  }

  // Sounds back into a spelling, putting a split digraph's e after the next sound: c a_e k → cake
  const spellOf = toks => {
    let out = "";
    let pendingE = false;
    toks.forEach(t => {
      const split = /^([aeiou])_e$/.exec(t);
      if (split) { out += split[1]; pendingE = true; return; }
      out += t;
      if (pendingE) { out += "e"; pendingE = false; }
    });
    return out + (pendingE ? "e" : "");
  };
  // Reading Reef: Pip says a word and the child finds it among near-misses that change one sound,
  // vowel sounds first, as a misreading would (ship → shop, chip)
  function readItem(id) {
    const item = checkWord(id);
    const target = item.spelling.toLowerCase();
    const options = new Set([target]);
    if (!item.whole && window.PopActivities) {
      const vowelFirst = item.tokens.map((_, i) => i).sort((a, b) => /[aeiou]/.test(item.tokens[b]) - /[aeiou]/.test(item.tokens[a]));
      for (const i of vowelFirst) {
        for (const alt of window.PopActivities.alternatives(item.tokens[i])) {
          if (options.size < 3) options.add(spellOf(item.tokens.map((t, k) => (k === i ? alt : t))));
        }
      }
    }
    // Too few near-misses (a tricky word): other words from the same list
    shuffle(LISTS[id].items.map(it => it.spelling.toLowerCase())).forEach(w => { if (options.size < 3) options.add(w); });
    return { kind: "choice", prompt: "Which word did Pip say?", answer: target, options: shuffle([...options]), readWords: true,
      say: { word: target }, spelling: target, tokens: item.tokens, label: target, skill: `reading: ${LISTS[id].title}`, from: id };
  }

  // Story Cove: a story at the child's reading level, the stage below their first Reading Reef gap
  // (no gaps: a longer Second-level story). Read alone, with no read-aloud, as it checks reading.
  function questStory() {
    const read = loadQuest().read;
    if (read && read.gapStage === -1) {
      const harder = (window.PASSAGES || []).filter(p => p.level === "Second");
      if (harder.length) return pick(harder);
    }
    const stage = read ? Math.max(1, read.gapStage) : 3;
    const stories = window.STORIES || [];
    const atLevel = stories.filter(s => s.stage === stage);
    return atLevel.length ? pick(atLevel) : stories.filter(s => s.stage <= stage).pop() || stories[0];
  }
  function* storyQuestions() {
    const p = questStory();
    if (!p) return;
    const html = `<div class="passage quest-story"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`;
    for (const [i, q] of p.questions.entries()) {
      yield { kind: "choice", prompt: q.q, answer: q.a, options: shuffle([q.a].concat(q.others)), html,
        spelling: `${p.title} Q${i + 1}`, tokens: [], label: `${p.title} Q${i + 1}`, skill: q.skill || "comprehension", from: `story:${p.id}` };
    }
  }
  const QUEST_QUESTIONS = {
    listen: listenQuestions, read: results => spellingQuestions(results, readItem),
    spell: results => spellingQuestions(results), story: storyQuestions, numbers: results => numberQuestions(results)
  };

  function showQuest() {
    document.title = `Pip's Sound Quest · ${SITE.title}`;
    const state = previewMode ? {} : loadQuest();
    const next = QUEST.find(isl => !state[isl.key]);
    const name = getPupil();
    app.innerHTML = `
      <section class="panel quest-panel">
        <a class="back" href="#/">← Home</a>
        ${previewBanner()}
        <div class="quest-head">
          ${pipHTML("big", next ? "bob" : "cheer", next ? (name && !previewMode ? `Hi ${esc(name)}! Will you help me visit my five islands?` : "Hi! Will you help me visit my five islands?") : "We did it! Thank you for helping me!", next ? "hop" : "celebrate")}
          <div class="quest-intro">
            <p class="eyebrow">🌟 Pip's Sound Quest</p>
            <h1>${next ? "Visit Pip's five islands" : "Quest complete!"}</h1>
            <p class="tip">${next ? "Each island is a short game. There are no wrong answers here: just do your best, and Pip will give you a sticker for every island." : "You've collected all five stickers! Your teacher will use your quest to choose the best work for you."}</p>
            ${previewMode ? "" : `<div class="pupil" id="pupilBox"></div>`}
          </div>
        </div>
        <ol class="quest-islands">${QUEST.map((isl, i) => `
          <li class="island${state[isl.key] ? " done" : ""}${isl === next ? " next" : ""}" style="--accent:${isl.colour}">
            <button type="button" class="island-btn" data-island="${isl.key}">
              <span class="island-icon" aria-hidden="true">${state[isl.key] ? "⭐" : isl.icon}</span>
              <span class="island-name">${i + 1}. ${esc(isl.title)}</span>
              <span class="island-state">${state[isl.key] ? "Sticker earned!" : isl === next ? "Next stop" : "Still to visit"}</span>
            </button></li>`).join("")}</ol>
        <div class="row center">${next ? `<button class="btn big primary" id="questGo">▶ Go to ${esc(next.title)}</button>` : `<a class="btn big primary" href="#/">Back home</a>`}</div>
      </section>`;
    const box = $("#pupilBox");
    if (box) mountPupil(box, { lead: "Exploring as", onChange: showQuest });
    const go = isl => { if (box && !takePupilName(box)) return; showIslandIntro(isl); };
    app.querySelectorAll("[data-island]").forEach(b => { b.onclick = () => go(QUEST.find(x => x.key === b.dataset.island)); });
    if ($("#questGo")) $("#questGo").onclick = () => go(next);
  }

  function showIslandIntro(island) {
    newScreen();
    document.title = `${island.title} · ${SITE.title}`;
    app.innerHTML = `
      <section class="panel start island-intro" style="--accent:${esc(island.colour)}">
        <a class="back" href="#/assess">← Pip's map</a>
        ${previewBanner()}
        ${pipHTML("big", "bob", esc(island.intro), island.pose)}
        <p class="eyebrow">${island.icon} Pip's Sound Quest</p>
        <h1>${esc(island.title)}</h1>
        <p class="hint">It stops by itself when it gets tricky. Take your time!</p>
        <button class="btn big primary" id="go">▶ Let's go!</button>
      </section>`;
    $("#go").onclick = () => startQuestIsland(island);
    $("#go").focus();
  }

  function startQuestIsland(island) {
    const results = [];
    session = {
      list: { id: island.id, title: `Pip's Sound Quest: ${island.title}`, accent: island.colour },
      check: island.key === "spell" ? "spelling" : "quest", quest: island, i: -1, results, items: [],
      pupil: previewMode ? "" : getPupil(), sent: false, preview: previewMode, secureBefore: new Set(),
      questions: QUEST_QUESTIONS[island.key](results)
    };
    livePing(session, "start");
    nextCheckQuestion();
  }

  function showIslandEnd() {
    newScreen();
    const island = session.quest;
    const state = loadQuest();
    const entry = { done: dayKey() };
    if (island.key === "read") {
      // Where reading gets tricky: the stage of the first list with a miss (-1: no gaps at all)
      const gaps = checkGaps(session.results.map(r => ({ from: r.item.from, correct: r.correct })));
      entry.gapStage = gaps.length ? STAGES.findIndex(st => st.lists.some(l => l.id === gaps[0])) : -1;
    }
    if (!session.preview) { state[island.key] = entry; saveQuest(state); }
    const next = QUEST.find(isl => isl !== island && !state[isl.key]);
    app.innerHTML = `
      <section class="panel summary island-end" style="--accent:${esc(island.colour)}">
        ${previewBanner()}
        ${pipHTML("big", "cheer", "", "celebrate")}
        <div class="sticker pop" aria-hidden="true">${island.icon}</div>
        <h1>${esc(island.title)}: sticker earned!</h1>
        <p class="tip">${esc(pick(["You were brilliant!", "Pip loved exploring with you!", "What a great explorer you are!"]))}</p>
        ${REPORTING && !session.preview ? `<p class="sent" id="sent" aria-live="polite">📤 Sending to your teacher…</p>` : ""}
        <div class="row center">
          ${next ? `<button class="btn big primary" id="nextIsland">▶ On to ${esc(next.title)}</button>` : ""}
          <a class="btn${next ? "" : " big primary"}" href="#/assess">🗺️ Pip's map</a>
        </div>
      </section>`;
    chimeRight();
    livePing(session, "end");
    session.ended = true;
    const my = phase;
    sendReport(session, true).then(sent => {
      const note = $("#sent");
      if (!note || my !== phase || sent === null) return;
      note.textContent = sent ? "✓ Sent to your teacher" : "Saved — it will reach your teacher when the internet is back.";
    });
    if (next) $("#nextIsland").onclick = () => showIslandIntro(next);
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

  /* ---------- Teacher mode: Settings and Make a list only show while a teacher is signed in ---------- */

  // Without Firebase set up there are no accounts, so everything is shown
  const teacherUnlocked = () => !CLOUD_CONFIGURED || !!(TEACHER && TEACHER.role);

  function applyTeacherMode() {
    const open = teacherUnlocked();
    document.querySelectorAll(".teacher-only").forEach(el => { el.hidden = !open; });
    const link = $("#teacherLink");
    link.hidden = !CLOUD_CONFIGURED;
    const short = window.PopTeacherShortName || (n => n.split(" ")[0]);
    link.textContent = TEACHER && TEACHER.role ? `👩‍🏫 ${short(TEACHER.name)}` : "👩‍🏫 Teacher";
  }

  /* ---------- Settings dialog ---------- */

  const dlg = $("#settings");

  function fillVoiceSelect() {
    const sel = $("#setVoice");
    if (!sel) return;
    sel.innerHTML = `<option value="${RECORDED_ID}">Eponine (recorded)</option>`;
    sel.value = RECORDED_ID;
    sel.disabled = true;
  }

  function openSettings() {
    if (!teacherUnlocked()) return;
    fillVoiceSelect();
    $("#setRate").value = settings.rate;
    $("#setTries").value = String(settings.tries);
    $("#setShuffle").checked = settings.shuffle;
    $("#setSentences").checked = settings.sentences;
    $("#setChecks").checked = settings.checks;
    $("#setSpell").checked = settings.spellOut;
    $("#setSounds").checked = settings.sounds;
    $("#setAccent").value = R_SOUNDED ? "scottish" : "english";
    $("#setAccent").disabled = !!(CLASS && CLASS.accent);
    $("#accentHint").textContent = CLASS && CLASS.accent
      ? `Set for ${CLASS.name} by its teacher, in Teacher → Classes.`
      : "Changes the sound buttons, sound boxes, worksheets and My sounds on this device.";
    const line = $("#classLine");
    line.hidden = !CLOUD_CONFIGURED;
    line.innerHTML = CLASS
      ? `This device is in <b>${esc(CLASS.name)}</b> (code ${esc(CLASS.id)}). <button type="button" class="linklike" id="leaveClass">Leave this class</button>`
      : "This device isn't in a class yet. Open a class link, or type the code on the home page.";
    if ($("#leaveClass")) $("#leaveClass").onclick = () => { saveClass(null); dlg.close(); reloadForAccent(); };
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }

  $("#settingsBtn").onclick = openSettings;
  $("#setRate").onchange = e => { settings.rate = Number(e.target.value); saveSettings(); };
  $("#setTries").onchange = e => { settings.tries = Number(e.target.value); saveSettings(); };
  $("#setShuffle").onchange = e => { settings.shuffle = e.target.checked; saveSettings(); };
  $("#setSentences").onchange = e => { settings.sentences = e.target.checked; saveSettings(); };
  $("#setChecks").onchange = e => { settings.checks = e.target.checked; saveSettings(); };
  $("#setSpell").onchange = e => { settings.spellOut = e.target.checked; saveSettings(); };
  $("#setSounds").onchange = e => { settings.sounds = e.target.checked; saveSettings(); };
  // Every list is split into sounds when the page loads, so a new accent needs a fresh start
  $("#setAccent").onchange = e => { settings.accent = e.target.value; saveSettings(); location.reload(); };
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
  $("#credits").hidden = !recWords.size;
  applyTeacherMode();
  if (synth) {
    refreshVoices();
    synth.addEventListener?.("voiceschanged", refreshVoices);
  }

  // What the teacher pages (teacher.js) need from here
  window.PopSpell = {
    LISTS, STAGES, esc, label, plural, analyse, wordHTML, parseWords, resolveAssigned, CHECKS, checkKind, checkGaps, isAssessment, QUEST,
    get teacher() { return TEACHER; }
  };

  // Firebase connects in the background; the lists work straight away without it
  (window.PopCloudReady || Promise.resolve(null)).then(api => {
    cloud = api;
    updateReporting();
    if (!api) return;
    // The class's settings may have changed since this device joined (e.g. "assigned work only")
    if (CLASS) api.classInfo(CLASS.id).then(info => {
      if (!info) return;
      const changed = info.assignedOnly !== !!CLASS.assignedOnly || info.name !== CLASS.name;
      saveClass(info);
      if (reloadForAccent()) return;
      if (changed && !session && (location.hash === "" || location.hash === "#/")) route();
    }).catch(() => { /* offline: keep what we have */ });
    api.onTeacher(profile => {
      TEACHER = profile;
      applyTeacherMode();
      const h = location.hash;
      // show the right tools (a game's start page has a teacher-only accent choice)
      if (!session && (h === "" || h === "#/" || h === "#/make" || h.startsWith("#/teacher") || h.startsWith("#/activity/g-"))) route();
    });
    if (!session && (location.hash === "" || location.hash === "#/")) route();
  });
  route();
})();

