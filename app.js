/* Spelling Practice — sounds first: hear the word, say its sounds, see how each sound
   is written, then spell it sound by sound.
   Word lists live in words.js. You shouldn't need to edit this file. */
(() => {
  "use strict";

  const SITE = Object.assign({ title: "PopSpell", subtitle: "Hear it. Map it. Spell it." }, window.SITE);
  const STAGES = window.SPELLING_LISTS || [];
  const SENTENCES = window.SENTENCES || {};
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

  const currentVoice = () => voices.find(v => v.voiceURI === settings.voice) || voices[0] || null;

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
  const useRecorded = () => recWords.size > 0 && (settings.voice === RECORDED_ID || !settings.voice);

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
    finished: ["finished", "Well done! Have a look at your stars."],
    test: ["test", "Can you spell the word, cake?"]
  };
  const PRAISE = [["well-done", "Well done!"], ["brilliant", "Brilliant!"], ["super", "Super spelling!"],
    ["fantastic", "Fantastic!"], ["great-job", "Great job!"], ["got-it", "You got it!"], ["amazing", "Amazing!"]];

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
        triesUsed: r.correct ? (r.item.kind === "map" ? (r.wrong.length ? 2 : 1) : r.wrong.length + 1) : null,
        wrong: r.wrong,
        missed: r.missed.map(label),
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
    if (!s.ended) livePing(s, "stop");
    s.ended = true;
    sendReport(s, false);
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
    else if (parts[0] === "join") joinClass(decodeURIComponent(parts[1] || ""));
    else if (parts[0] === "teacher" && window.PopTeacher) window.PopTeacher.show(app, decodeURIComponent(parts[1] || ""));
    else if (parts[0] === "make" && teacherUnlocked()) showMake();
    else if (parts[0] === "make") { history.replaceState(null, "", "#/"); showHome(); } // locked: back to the lists
    else if (parts[0] === "sounds") showSounds();
    else if (parts[0] === "bests") showBests();
    else if (parts[0] === "stories") showStories();
    else if (parts[0] === "check" && CHECKS[parts[1]] && (parts[1] === "spelling" || window.PopActivities)) showCheckStart(parts[1]);
    else if (parts[0] === "review" && dueItems().length) showStart(reviewList());
    else if (parts[0] === "sound" && soundList(decodeURIComponent(parts[1] || ""))) showStart(soundList(decodeURIComponent(parts[1])));
    else showHome();
    window.scrollTo(0, 0);
  }

  // A class link (#/join/K7P2QX) or a typed code puts this device in that teacher's class
  async function joinClass(code, onDone) {
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
    justJoined = true;
    if (!onDone) history.replaceState(null, "", "#/");
    if (reloadForAccent()) return; // the class uses the other accent
    if (onDone) return onDone(true);
    showHome();
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
    box.innerHTML = name
      ? `<p>${esc(lead)} <b>${esc(name)}</b> · <button type="button" class="linklike not-me">Not ${esc(name)}?</button></p>`
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

  /* ---------- Home ---------- */

  function showHome() {
    document.title = SITE.title;
    // A class can be set so its pupils see only the work set for them (teachers still see everything)
    const locked = !!(CLASS && CLASS.assignedOnly) && !teacherUnlocked();
    app.innerHTML = `
      <section class="hero">
        <div class="hero-copy">
          <p class="hero-kicker">Sounds become spellings</p>
          <h1>${esc(SITE.subtitle)}</h1>
          <p class="lead">Listen to each word, find its sounds, and choose the letters that spell them.</p>
        </div>
        <img class="hero-children" src="assets/brand/children.png" alt="Two children listening to sounds and building a word" width="516" height="516">
        <div class="hero-actions">
        ${CLASS ? `<p class="class-name">${esc(CLASS.name)}${CLASS.teacherName ? ` · ${esc(CLASS.teacherName)}` : ""}${justJoined ? " — this device has joined ✓" : ""}</p>` : ""}
        ${CLOUD_CONFIGURED && !CLASS ? `
          <form class="join-box" id="joinForm">
            <label>Got a class code? <input id="joinCode" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="e.g. K7P2QX"></label>
            <button class="btn" type="submit">Join</button>
            <span class="hint" id="joinHint"></span>
          </form>` : ""}
        <ol class="steps">
          <li><span class="step-icon" aria-hidden="true">👂</span><span><b>Hear</b> the word</span></li>
          <li><span class="step-icon" aria-hidden="true">🗣️</span><span><b>Say</b> each sound</span></li>
          <li><span class="step-icon" aria-hidden="true">🟦</span><span><b>Map</b> sounds to letters</span></li>
          <li><span class="step-icon" aria-hidden="true">✏️</span><span><b>Spell</b> and check</span></li>
        </ol>
        </div>
      </section>
      <section class="me">
        <div class="pupil" id="homePupil"></div>
        <div class="me-cards" id="meCards"></div>
      </section>
      ${locked || !window.PopActivities ? "" : window.PopActivities.AREAS.filter(area => area.id === "games").map(area => `
        <section class="stage" style="--accent:${esc(area.colour)}">
          <h2>${area.icon} ${esc(area.title)}</h2>
          <div class="grid">${area.activities.map(a => `
            <a class="list-card" href="#/activity/${encodeURIComponent(a.id)}">
              <span class="lc-example" aria-hidden="true">${a.icon}</span>
              <span class="lc-title">${esc(a.title)}</span>
              <span class="lc-count">${esc(a.level)} level · 6 words</span>
            </a>`).join("")}</div>
        </section>`).join("")}
      ${locked ? `<p class="hint locked-note" id="lockedNote">Your teacher chooses your work. ${getPupil() ? "Looking for today's work…" : "Type your name to see it."}</p>` : STAGES.map(stage => `
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
        </section>`).join("")}
      ${locked || !window.PopActivities ? "" : window.PopActivities.AREAS.filter(area => area.id !== "stories" && area.id !== "games").map(area => `
        <section class="stage" style="--accent:${esc(area.colour)}">
          <h2>${area.icon} ${esc(area.title)}</h2>
          <div class="grid">
            ${area.activities.map(a => `
              <a class="list-card" href="#/activity/${encodeURIComponent(a.id)}">
                <span class="lc-example" aria-hidden="true">${a.icon}</span>
                <span class="lc-title">${esc(a.title)}</span>
                <span class="lc-count">${esc(a.level)} level</span>
              </a>`).join("")}
          </div>
        </section>`).join("")}
      ${locked ? "" : `
        <section class="stage" style="--accent:#0f766e">
          <h2>🧭 Starting checks</h2>
          <p class="hint">For a new pupil's first lesson: about 10 minutes, and the results go to the teacher's Next steps.</p>
          <div class="grid">
            ${Object.entries(CHECKS).filter(([k]) => k === "spelling" || window.PopActivities).map(([k, c]) => `
              <a class="list-card" href="#/check/${k}" style="--accent:${esc(c.accent)}">
                <span class="lc-example" aria-hidden="true">${c.icon}</span>
                <span class="lc-title">${esc(c.title.replace("Starting check: ", ""))}</span>
                <span class="lc-count">Starting check</span>
              </a>`).join("")}
          </div>
        </section>`}`;

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
    mountPupil(box, { lead: "Hello,", onChange: showHome, onEnter: save });
    if (!getPupil()) {
      $("#meCards").innerHTML = `<button class="btn primary" id="saveName">Save my name</button>`;
      $("#saveName").onclick = save;
      return;
    }
    const prog = loadProgress();
    const due = dueItems(prog).length;
    const secure = secureSounds(prog).size;
    const week = weekStats(loadBests(prog));
    $("#meCards").innerHTML = `
      ${due
        ? `<a class="me-card review" href="#/review"><span class="me-icon" aria-hidden="true">🔁</span><span><b>${plural(due, "word", "words")}</b> to practise again today</span></a>`
        : `<div class="me-card quiet"><span class="me-icon" aria-hidden="true">✅</span><span>No review words today</span></div>`}
      <a class="me-card" href="#/sounds"><span class="me-icon" aria-hidden="true">⭐</span><span><b>My sounds</b> · ${plural(secure, "star", "stars")}</span></a>
      <a class="me-card" href="#/bests"><span class="me-icon" aria-hidden="true">🏅</span><span><b>My bests</b> · ${plural(week.thisWeek, "go", "goes")} this week</span></a>
      ${locked ? "" : `<a class="me-card" href="#/activity/g-hopper-short"><span class="me-icon" aria-hidden="true">🎮</span><span><b>Play Sound Hopper</b> · tap beats and build bridges</span></a>`}
      ${storyActivities().length && !locked ? `<a class="me-card" href="#/stories"><span class="me-icon" aria-hidden="true">📚</span><span><b>My stories</b> · ${readyStories(prog).length} ready to read</span></a>` : ""}`;

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
      const section = document.createElement("div");
      section.className = "assigned";
      section.innerHTML = `
        <h2>📌 Your lists today</h2>
        <div class="grid">${lists.map(l => `
          <a class="list-card" href="${esc(l.href)}" style="--accent:${esc(l.accent)}">
            <span class="lc-example">${esc(l.example || "")}</span>
            <span class="lc-title">${esc(l.title)}</span>
          </a>`).join("")}</div>`;
      $("#meCards").after(section);
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
        <h1>${name ? `${esc(name)}'s sounds` : "My sounds"}</h1>
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
        <h1>${name ? `${esc(name)}'s stories` : "My stories"}</h1>
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
        <h1>${name ? `${esc(name)}'s bests` : "My bests"}</h1>
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

  /* ---------- Start screen ---------- */

  function showStart(list) {
    document.title = `${list.title} · ${SITE.title}`;
    app.innerHTML = `
      <section class="panel start" style="--accent:${esc(list.accent)}">
        <a class="back" href="#/">← All lists</a>
        ${previewBanner()}
        <p class="eyebrow">${esc(list.stage || "")}</p>
        <h1>${esc(list.title)}</h1>
        ${list.tip ? `<p class="tip">💡 ${esc(list.tip)}</p>` : ""}
        <p class="meta">${plural(list.items.length, "word", "words")}${checksFor(list).length ? ` + ${plural(checksFor(list).length, "new-word challenge", "new-word challenges")}` : ""} · ${plural(settings.tries, "try", "tries")} for each word</p>
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
        <span>${session.activity && session.items[session.i]?.kind === "map" ? "Crossing" : session.activity ? "Question" : "Word"} ${session.i + 1} of ${n}</span>
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
      leaveSession(session); // the words done so far still count
      newScreen();
      session = null;
      if (check) showCheckStart(check); else if (activity) showActivityStart(activity); else showStart(list);
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

  // 1. LISTEN & SEGMENT: hear the word and count its phonemes before any graphemes appear.
  function showLook() {
    const item = session.items[session.i];
    newScreen();
    if (item.challenge) return showWrite();
    app.innerHTML = `
      <section class="panel practice" style="--accent:${esc(session.list.accent)}">
        ${progressHTML()}
        <p class="phase"><span class="dot look"></span>Look, listen and segment</p>
        <!-- The word is on screen while it's spoken, and hidden again when it's time to spell it -->
        <div class="look-word" id="lookWord">${wordHTML(item)}</div>
        <p class="hint look-hint">Look at the word while you hear it. It will hide when you spell it.</p>
        ${item.whole ? `<p class="prompt">Listen carefully. This word has a tricky part, so look closely at it.</p>` : `
          <p class="sound-count">${plural(item.tokens.length, "sound", "sounds")}</p>
          <div class="boxes segment-boxes" aria-label="${plural(item.tokens.length, "sound box", "sound boxes")}">${boxesHTML(item)}</div>
          <p class="prompt">Say the word slowly. Tap one box for each sound you hear.</p>`}
        <div class="row center">
          <button class="btn" id="hear">🔊 Hear it again</button>
          <button class="btn primary" id="ready">Map the sounds →</button>
        </div>
      </section>`;
    wireStop();
    wireSoundButtons($("#lookWord"), item);
    $("#hear").onclick = () => sayWordInSentence(item);
    $("#ready").onclick = () => showWrite();
    app.querySelectorAll(".segment-boxes button.box").forEach(b => {
      b.onclick = () => b.classList.toggle("lit");
    });
    $("#ready").focus();
    sayWordInSentence(item);
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
    const showBoxes = !item.whole;
    const wrong = [];
    const firstMissed = [];
    app.innerHTML = `
      <section class="panel practice" style="--accent:${esc(session.list.accent)}">
        ${progressHTML()}
        ${item.challenge
          ? `<p class="phase challenge"><span aria-hidden="true">🔍</span> New word! You haven't seen this one</p>
             <p class="prompt">Listen carefully, say the sounds, and use what you've learned.</p>`
          : `<p class="phase"><span class="dot write"></span>Map and spell it</p>`}
        ${sentenceHTML(item, true)}
        ${showBoxes
          ? `<div class="boxes" id="boxes">${boxesHTML(item)}</div>
             <p class="prompt" id="prompt">Say each sound and tap a box. Then write it, saying each sound as you type.</p>`
          : `<p class="prompt">Listen again, then write the sounds you hear.</p>`}
        <form class="spell-form" id="spellForm" autocomplete="off">
          <label for="answer" class="sr-only">Type the word</label>
          <input id="answer" class="answer" type="text" autocomplete="off" autocorrect="off"
                 autocapitalize="none" spellcheck="false" enterkeyhint="done" maxlength="40">
          <button class="btn primary" type="submit">Check ✓</button>
        </form>
        <div class="tries" id="tries"></div>
        <p class="feedback" id="feedback" aria-live="polite"></p>
        <ul class="attempts" id="attempts"></ul>
        <div class="row center">
          <button class="btn" id="hear" type="button">🔊 Hear the word</button>
          ${wantSentence(item) ? `<button class="btn" id="hearSentence" type="button">💬 Hear the sentence</button>` : ""}
        </div>
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
    if ($("#hearSentence")) $("#hearSentence").onclick = () => { saySentence(item); input.focus(); };
    sayWordInSentence(item);

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
    if (!session.preview) recordProgress(item, correct, wrong.length, firstMissed);
    livePing(session, "word", { word: item.spelling, ok: correct && !wrong.length });
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
        <p class="trophy" aria-hidden="true">${right === r.length ? "🏆" : "🌟"}</p>
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
        <p class="eyebrow">${act.icon} ${esc(act.level)} level · ${esc(act.organiser)}</p>
        <h1>${esc(act.title)}</h1>
        <p class="tip">${esc(act.blurb)}</p>
        ${act.area === "games" && teacherUnlocked() ? `<label class="field hopper-accent">How do you say r sounds?
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
  const READ_SPEEDS = [["slow", 0.65, "🐢 Slow"], ["steady", 0.8, "🙂 Steady"], ["normal", 1, "🐇 Normal"]];
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
    const [, speed] = readSpeed();
    const parts = sentencesOf(p.text);
    const mark = n => box && box.querySelectorAll(".ra-s").forEach(el => el.classList.toggle("reading", Number(el.dataset.s) === n));
    for (let n = from; n < parts.length; n++) {
      if (run !== readRun || my !== phase) return;
      mark(n);
      const ok = await orSpeak([sentenceClipOf(p, n)], parts[n], settings.rate * speed, speed);
      if (run !== readRun || my !== phase || ok === null) return;
      await new Promise(r => setTimeout(r, 350 / speed)); // a breath between sentences
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
        ${q.sayOptions ? `<button type="button" class="q-hear" data-hear="${i}" aria-label="Hear ${esc(opt)}">🔊</button>` : ""}
      </div>`;
    app.innerHTML = `
      <section class="panel practice activity" style="--accent:${esc(act.colour)}">
        ${progressHTML()}
        ${passageBox}
        <p class="phase q-prompt">${esc(q.prompt)}</p>
        ${q.html || ""}
        ${q.say ? `<div class="row center"><button class="btn" id="hearQ">🔊 Hear it${q.say.word ? "" : " again"}</button></div>` : ""}
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
        ? `${esc(pick(PRAISE)[1])} <span class="stars-inline">${stars(earned)}</span>`
        : q.kind === "dictation"
          ? `The sentence was: <b>${esc(q.answer)}</b>`
          : `The answer is <b>${esc(q.answer)}</b>${/[.!?]$/.test(q.answer) ? "" : "."} ${esc(q.explain || "")}`;
      if (correct) chimeRight(); else chimeWrong();
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
    };

    if (q.kind === "choice") {
      app.querySelectorAll("[data-hear]").forEach(b => { b.onclick = () => sayWord(q.options[Number(b.dataset.hear)]); });
      app.querySelectorAll(".q-option").forEach(b => {
        b.onclick = () => {
          const value = q.options[Number(b.dataset.opt)];
          if (norm(value) === norm(q.answer)) { b.classList.add("right"); return finish(true); }
          wrong.push(value);
          b.classList.add("wrong");
          b.disabled = true;
          if (wrong.length >= ACTIVITY_TRIES) return finish(false);
          tryAgain("Not quite — have another look.");
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
          return tryAgain("Not quite — have another go.");
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
          <div class="hopper-creature" id="hopperCreature" role="img" aria-label="Pip, the sound hopper">
            <span class="hopper-ear one"></span><span class="hopper-ear two"></span>
            <span class="hopper-eye one"></span><span class="hopper-eye two"></span>
            <span class="hopper-cheek"></span><span class="hopper-foot one"></span><span class="hopper-foot two"></span>
          </div>
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

  function showActivitySummary() {
    newScreen();
    const r = session.results;
    const right = r.filter(x => x.correct).length;
    const firstGo = r.filter(x => x.correct && !x.wrong.length).length;
    const earned = r.reduce((t, x) => t + x.stars, 0);
    const skills = {};
    r.forEach(x => x.missed.forEach(s => { skills[s] = (skills[s] || 0) + 1; }));
    const act = session.activity;
    const bestNotes = personalBests(session, firstGo, r.length);
    app.innerHTML = `
      <section class="panel summary" style="--accent:${esc(act.colour)}">
        ${previewBanner()}
        <p class="trophy" aria-hidden="true">${right === r.length ? "🏆" : "🌟"}</p>
        <h1>${right === r.length ? (firstGo === r.length ? "Perfect — all right first time!" : "You got them all!") : `You got ${right} out of ${r.length}!`}</h1>
        <p class="meta">${session.pupil ? `${esc(session.pupil)} · ` : ""}${esc(act.title)} · ★ ${earned} stars · ${firstGo} right first time</p>
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
    sayPhrase(right === r.length ? PHRASES.allRight : PHRASES.finished);
    livePing(session, "end");
    session.ended = true;
    const my = phase;
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

  // Each yields the next question; the answer to it is in results by the time it resumes
  function* spellingQuestions(results) {
    const lastRight = () => results[results.length - 1].correct;
    let gaps = 0;
    for (const stage of STAGES) {
      const ids = stage.lists.map(l => l.id);
      const tried = {};
      let missed = false;
      for (const id of spread(ids, CHECK_SCREEN)) {
        yield checkWord(id);
        tried[id] = lastRight();
        if (!tried[id]) { missed = true; break; }
      }
      if (!missed) continue;
      for (const id of ids) {
        if (!(id in tried)) { yield checkWord(id); tried[id] = lastRight(); }
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
    if (step.done) return showCheckEnd();
    session.items.push(step.value);
    session.i = session.items.length - 1;
    showCheckQuestion();
  }

  function showCheckQuestion() {
    newScreen();
    const q = session.items[session.i];
    const spelling = session.check === "spelling";
    app.innerHTML = `
      <section class="panel practice activity" style="--accent:${esc(session.list.accent)}">
        ${previewBanner()}
        <div class="progress">
          <a class="stop" href="#/" id="stopLink">✕ Stop</a>
          <span>${spelling ? "Word" : "Question"} ${session.i + 1}</span>
          ${helpHTML()}
        </div>
        <p class="phase q-prompt">${spelling ? "Listen, then spell the word" : esc(q.prompt)}</p>
        ${spelling ? sentenceHTML(q, true) : q.html || ""}
        ${q.kind === "choice"
          ? `<div class="q-options">${q.options.map((opt, i) => `<div class="q-option-wrap"><button type="button" class="q-option" data-opt="${i}">${esc(opt)}</button></div>`).join("")}</div>`
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
      nextCheckQuestion();
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
        <p class="trophy" aria-hidden="true">🌟</p>
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
    const recorded = recWords.size ? `<option value="${RECORDED_ID}">Eponine (recorded, recommended)</option>` : "";
    const device = voices.map(v => `<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)})</option>`).join("");
    sel.innerHTML = recorded + device || `<option value="">No voices found</option>`;
    if (useRecorded()) sel.value = RECORDED_ID;
    else if (currentVoice()) sel.value = currentVoice().voiceURI;
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
  $("#setVoice").onchange = e => { settings.voice = e.target.value; saveSettings(); sayWord("cake"); };
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
    LISTS, STAGES, esc, label, plural, analyse, wordHTML, parseWords, resolveAssigned, CHECKS, checkKind, checkGaps,
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

