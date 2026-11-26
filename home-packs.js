/* Home-school packs (#/home): a whole course for a parent teaching their own child at home, for one
   subject, one nation and one level band, made from PopSpell's ready lessons. Nothing is stored or sent.

   The packs are listed in home-data.js. Each session is one ready lesson (lessons.js): a parent's page in
   plain words (what it's for, what to have ready, the four steps with what to do and say, a worked
   example where the lesson's practice has one, what to say if they're stuck, how to mark, and whether to
   move on or repeat), then the lesson's own pupil sheets and answer pages, made exactly as the Library
   makes them (teacher.js lessonPages). Every sixth lesson is followed by a review, with a short sheet of
   questions from those lessons and the lessons' checks to do again, and the pack ends with a final check.
   The front is a parent's guide that assumes no teaching (or maths) confidence, a plan with dates, and a
   tracker.

   Two editions: online (names the free practice on popspell.com, with no login) and paper only (no web
   address anywhere, and anything a lesson does online is done from its printed sheet).
   Every page carries the pack's code: a made pack has its own questions, and its answers match only
   pages with the same code. */
window.PopHome = (() => {
  "use strict";
  const D = window.PopHomeData, K = window.PopSheetPrint, T = () => window.PopTeacher;
  const L = () => window.PopLessons, E = () => window.PopEngland, A = () => window.PopActivities;
  const esc = K.esc;
  const rand = n => Math.floor(Math.random() * n);
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const CLASS = "ws-activity";
  const REVIEW_EVERY = 6;

  // ---------- Which lessons, in what order ----------
  // Exam courses: the start-here lesson first, then what the exam expects, the topics, and the mini papers last
  const rank = id => (/start-here/.test(id) ? 0 : /what-the-e|what-natio/.test(id) ? 1 : /mini-paper/.test(id) ? 9 : /my-next-step/.test(id) ? 10 : 5);
  const byRank = list => list.map((l, i) => [l, i]).sort((a, b) => rank(a[0].id) - rank(b[0].id) || a[1] - b[1]).map(([l]) => l);
  const climbLesson = id => /-climb-/.test(id);
  function lessonsFor(pack) {
    const all = L().all().filter(l => l.subject === pack.subject), p = pack.pick;
    if (p.level) {
      const level = all.filter(l => !l.sqa && (l.england ? l.cfe && l.cfe.level === p.level : l.level === p.level));
      return (p.part === undefined ? level : yearOf(level, p)).map(l => T().viewOf(l, ""));
    }
    if (p.sqa) return byRank(all.filter(l => l.sqa === p.sqa));
    if (typeof p.climb === "string") { const re = new RegExp(p.climb); return byRank(all.filter(l => re.test(l.id))); }
    // England's year bands: the lessons the Library puts in that band, earliest year first
    const inBand = all.map((l, i) => ({ l, i, w: E().forWork(l.id) })).filter(x => x.w && E().bandOf(x.w) === p.band && !(p.climb === false && climbLesson(x.l.id)));
    return inBand.sort((a, b) => (a.w.lo - b.w.lo) || (a.i - b.i)).map(x => x.l);
  }
  // One school year of a CfE level (First: P2 to P4, Second: P5 to P7). Each lesson gets a place in the level:
  // the England year it's mapped to (P3 is Year 2), or, with no mapping, how far along its strand it comes.
  // The level's lessons are put in that order and cut into three equal parts; each part keeps teaching order.
  const YEARS = { First: 1, Second: 4 };
  function yearOf(level, p) {
    const lo = YEARS[p.level], strandAt = {};
    level.forEach(l => { (strandAt[l.strand] = strandAt[l.strand] || []).push(l.id); });
    const place = l => {
      const w = E() && E().forWork(l.id);
      if (w && w.lo !== null && Number.isFinite(w.lo)) return Math.min(lo + 2.99, Math.max(lo, (w.lo + Math.min(w.hi, w.lo + 1)) / 2));
      const st = strandAt[l.strand];
      return lo + 3 * st.indexOf(l.id) / st.length;
    };
    const sorted = level.map((l, i) => ({ l, i, at: place(l) })).sort((a, b) => a.at - b.at || a.i - b.i);
    const n = sorted.length, from = Math.round(n * p.part / 3), to = Math.round(n * (p.part + 1) / 3);
    return sorted.slice(from, to).sort((a, b) => a.i - b.i).map(x => x.l);
  }
  const cur = pack => (pack.nation === "england" ? "england" : "");

  // ---------- Words for paper only ----------
  // A lesson written for class can send the pupil to PopSpell's online work. On paper, those sentences
  // go, and the printed sheet takes their place.
  const ONLINE = /PopSpell|online|on screen|on the screen|tablet|computer|\bapp\b|\bgames?\b|Canopy|Hopper|Sound Switch|Sound Trail|Quest|popspell\.com|https?:/i;
  const sentences = t => String(t || "").match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) || [];
  const paperText = (t, instead = "") => {
    const kept = sentences(t).filter(s => !ONLINE.test(s)).join("").trim();
    return kept || instead;
  };
  const textFor = (made, t, instead = "") => (made.paper ? paperText(t, instead) : String(t || ""));

  // ---------- Questions for reviews (from the lessons' own online practice, printed) ----------
  const printable = q => q && (q.kind === "choice" || q.kind === "type") && q.prompt && q.answer !== undefined && q.answer !== ""
    && !/this word|you hear|listen/i.test(q.prompt) && String(q.prompt).length <= 140 && !q.html;
  function itemsOf(l, n) {
    const out = [];
    for (const id of shuffle(l.use || [])) {
      const act = A() && A().get(id);
      if (!act || act.game || act.area === "listening" || act.passage) continue;
      let qs = [];
      try { qs = act.make() || []; } catch { qs = []; }
      for (const q of shuffle(qs.filter(printable))) { if (out.length >= n) break; if (!out.some(o => o.prompt === q.prompt)) out.push(Object.assign({ lesson: l }, q)); }
      if (out.length >= n) break;
    }
    return out;
  }
  // A worked example to show first: a practice question that comes with an explanation
  function exampleOf(l) {
    for (const id of l.use || []) {
      const act = A() && A().get(id);
      if (!act || act.game || act.area === "listening" || act.passage) continue;
      let qs = [];
      try { qs = act.make() || []; } catch { qs = []; }
      const q = qs.filter(printable).find(x => x.explain && x.explain.length > 12);
      if (q) return q;
    }
    return null;
  }

  // ---------- Making a pack ----------
  const DAY = 86400000;
  const fmtDate = d => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const dateOf = (start, perWeek, n) => {
    if (!start) return "";
    const week = Math.floor((n - 1) / perWeek), k = (n - 1) % perWeek;
    return fmtDate(new Date(start.getTime() + (week * 7 + Math.floor(k * 7 / perWeek)) * DAY));
  };
  const code = () => {
    const d = new Date(), pad = n => String(n).padStart(2, "0");
    return `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  };
  function plan(pack) {
    const lessons = lessonsFor(pack), out = [];
    let since = [];
    lessons.forEach((l, i) => {
      out.push({ kind: "lesson", l, t: l.title });
      since.push(l);
      if (since.length === REVIEW_EVERY && i < lessons.length - 1) { out.push({ kind: "review", from: since, t: `Review: ${since.length} lessons` }); since = []; }
    });
    if (lessons.length) out.push({ kind: "final", from: lessons, t: "Final check" });
    return out;
  }
  function make(packId, who = "", opts = {}) {
    const pack = D.get(packId);
    if (!pack) return null;
    const perWeek = opts.perWeek || pack.perWeek, start = opts.start || null, paper = Boolean(opts.paper);
    const c = code();
    const sessions = plan(pack).map((s, i) => Object.assign({ n: i + 1, week: Math.ceil((i + 1) / perWeek), date: dateOf(start, perWeek, i + 1) }, s));
    const made = { pack, who, code: c, perWeek, start, paper, sessions };
    sessions.forEach(m => {
      if (m.kind === "lesson") {
        m.example = pack.subject === "Maths" || /grammar|punctuat|spell|sentence|word/i.test(m.l.title) ? exampleOf(m.l) : null;
        m.lp = T().lessonPages(m.l, who, cur(pack));
        m.number = sessions.filter(x => x.kind === "lesson" && x.n <= m.n).length;
      } else {
        const per = m.kind === "final" ? Math.max(1, Math.min(2, Math.floor(30 / m.from.length))) : 2;
        // a review is one page of ten; a final check up to three
        const pool = m.from.map(l => itemsOf(l, per)), items = [];
        // One from each lesson first, then a second, so every lesson is checked; a final check stops at 30
        for (let k = 0; k < per; k++) pool.forEach(list => { if (list[k] && items.length < (m.kind === "final" ? 30 : PER_PAGE)) items.push(list[k]); });
        m.items = items;
      }
    });
    return made;
  }

  // ---------- Pages ----------
  const block = (html, cls = "") => `<div class="cs-block${cls ? ` ${cls}` : ""}">${html}</div>`;
  const heading = (title, note = "") => `<h2 class="cs-h">${title}${note ? ` <span>${note}</span>` : ""}</h2>`;
  const box = (label, inner) => `<div class="pp-box"><b>${label}</b>${inner}</div>`;
  const list = arr => `<ul class="cs-list">${arr.map(x => `<li>${x}</li>`).join("")}</ul>`;
  const doc = (head, more, blocks, adult = false, age = "older") => ({ head, more, blocks, adult, age });
  const stamp = (made, line) => `<p class="ws-code">Pack ${made.code}${line ? ` · ${line}` : ""}</p>`;
  const sLabel = (made, m) => `Session ${m.n} of ${made.sessions.length} · Week ${m.week}${m.date ? ` · ${m.date}` : ""}`;
  const child = made => (made.who ? esc(made.who) : "your child");
  const Child = made => (made.who ? esc(made.who) : "Your child");
  const parentVoice = t => String(t).replace(/^We are learning/, "Learning").replace(/\bour\b/g, "their").replace(/\bwe\b/g, "they").replace(/\bus\b/g, "them");
  const STEP_MINUTES = pack => (pack.age === "young" ? [5, 10, 10, 5] : pack.exam ? [5, 15, 30, 10] : [5, 10, 20, 5]);
  const minutes = pack => STEP_MINUTES(pack).reduce((a, b) => a + b, 0);
  const stuckFor = (pack, l) => ((D.STUCK[pack.subject] || {})[l.strand] || {})[pack.age] || ((D.STUCK[pack.subject] || {})[l.strand] || {}).older || [];
  const sayList = arr => list(arr.map(x => `<i>“${esc(x)}”</i>`));
  // Online work a lesson uses, with the address that opens it with no login
  const onlineOf = l => (l.use || []).map(id => {
    const act = A() && A().get(id);
    if (act) return `${esc(act.title)} (popspell.com/#/activity/${esc(id)})`;
    const list = Object.values((window.PopSpell && window.PopSpell.LISTS) || {}).find(x => x.id === id);
    return list ? `${esc(list.title)} spelling list (popspell.com/#/list/${esc(id)})` : "";
  }).filter(Boolean);

  function lessonPage(made, m) {
    const pack = made.pack, l = m.l, mins = STEP_MINUTES(pack);
    const head = `${K.brandHead(`Parent's page: session ${m.n}`, `${esc(l.title)}. Read this before you start.`)}${stamp(made, sLabel(made, m))}`;
    const more = `${K.brandHead(`Parent's page: session ${m.n} (continued)`, esc(l.title))}${stamp(made)}`;
    const sheets = m.lp.pupil.map(p => esc(p.label));
    const answers = m.lp.adult.filter(p => p.label !== "Lesson plan" && (!p.has || p.has()));
    const need = [sheets.length ? `the printed sheet${sheets.length > 1 ? "s" : ""} for this session (${sheets.join("; ")})` : "", answers.length ? "the answer pages (keep them on your side of the table)" : "",
      "a pencil and a rubber", (pack.age === "older" ? D.NEED_OLDER : D.NEED)[l.strand] || "", "about " + minutes(pack) + " minutes somewhere quiet, with no screens on"].filter(Boolean);
    const kdu = pack.nation === "scotland" && T().kduOf ? T().kduOf(l) : "";
    const step = (n, title, min, inner) => block(`${heading(`Step ${n}: ${title}`, `${min} minutes`)}${inner}`);
    const blocks = [block(`<p class="cs-aim"><b>Today:</b> ${esc(parentVoice(l.intention))}</p>
      <p class="cs-aim"><b>By the end, ${child(made)} can:</b></p>${list(l.criteria.map(esc))}
      <p class="cs-aim"><b>You need:</b> ${need.join("; ")}.</p>
      ${l.vocab ? `<p class="cs-aim"><b>Words to use today:</b> ${esc(l.vocab)}. Say them often, and ask ${child(made)} to use them too.</p>` : ""}`)];
    blocks.push(step(1, "Warm up", mins[0], `<p>${esc(textFor(made, l.steps.start, "Ask what they remember from last time, and do one question from it together."))}</p>`));
    blocks.push(step(2, "Show and explain", mins[1], `<p>${esc(textFor(made, l.steps.teach, "Explain the idea using the first part of the sheet, one step at a time."))}</p>
      <p>Say it in your own words. Stop after each part and ask: <i>“Can you tell me that back?”</i> It's fine to read from this page.</p>`));
    if (m.example) blocks.push(block(box("Do this one together first", `<p>${esc(m.example.prompt)}${m.example.options ? ` <i>(${m.example.options.map(esc).join(" / ")})</i>` : ""}</p>
      <p>Answer: <b>${esc(m.example.answer)}</b>. How to explain it: ${esc(m.example.explain)}</p>`)));
    const practise = textFor(made, l.steps.practise, "");
    blocks.push(step(3, "Practise", mins[2], `${sheets.length ? `<p>${Child(made)} works through ${sheets.length > 1 ? "the sheets" : "the sheet"} (${sheets.join("; ")}). Sit alongside and mark each answer as soon as it's done, with the answer page.</p>` : `<p>There's no sheet for this one: it's done by talking, listening or doing, together.</p>`}
      ${practise ? `<p>${sheets.length ? "Also: " : ""}${esc(practise)}</p>` : ""}
      ${!made.paper && onlineOf(l).length ? `<p>Online, free and with no login: ${onlineOf(l).join("; ")}.</p>` : ""}
      ${list([`<b>Right:</b> a tick, and say what was good (<i>“You checked it: well done”</i>).`, `<b>Not right:</b> don't say “wrong”. Say <i>“Nearly. Talk me through it.”</i> Often they find the slip themselves. Then look at the answer page together and try again.`,
        pack.exam ? `<b>Exam questions:</b> give a mark for each right step of working, even if the final answer is wrong. The answer page says where each mark comes from.` : `<b>Lots wrong in a row?</b> Stop the sheet, go back to step 2 with one question, then let them try the next one alone.`])}`));
    blocks.push(block(`${heading("If they're stuck, try saying")}${sayList(stuckFor(pack, l))}<p>Still stuck? Do that question together, then let them do the next one alone. Leaving one and coming back is fine, and so is a short break.</p>`));
    blocks.push(step(4, "Check", mins[3], `<p>${esc(textFor(made, l.steps.check, "Ask a question like the ones on the sheet, without help."))}</p>
      ${l.understand ? `<p><b>Then ask:</b> <i>“${esc(l.understand)}”</i><br><b>Listen for:</b> ${esc(l.lookFor)}</p>` : ""}`));
    blocks.push(block(`<p><b>Move on or repeat?</b> Managed the check on their own, and most of the sheet right (about three-quarters): tick <b>secure</b> on the tracker and move on. Nearly: tick <b>nearly</b>, move on, and do the check again at the start of the next session. Not yet: do this session again in a day or two${made.paper ? ", with the answers covered" : " (make the pack again for fresh questions)"}. A review comes every ${REVIEW_EVERY} lessons and catches anything that slipped.</p>
      ${textFor(made, l.home, "") ? `<p><b>During the week:</b> ${esc(textFor(made, l.home, ""))}</p>` : ""}
      ${kdu ? `<p class="gx-of">Curriculum for Excellence: ${esc(l.level)} level${l.codes && l.codes.length ? ` (${esc(l.codes.join(", "))})` : ""}. Draft Know, Do, Understand strand: ${esc(kdu)}.</p>` : ""}`));
    blocks.push(block(`<div class="cs-notes"><b>Your notes</b> (what went well, what to go over again)</div>`));
    return doc(head, more, blocks, true);
  }

  // Reviews and the final check: a sheet of questions from those lessons, and their checks to do again
  const lessonNo = (made, l) => (made.sessions.find(x => x.kind === "lesson" && x.l.id === l.id) || {}).n;
  function reviewPage(made, m) {
    const pack = made.pack, final = m.kind === "final";
    const what = final ? "the final check" : `a review of sessions ${lessonNo(made, m.from[0])} to ${lessonNo(made, m.from[m.from.length - 1])}`;
    const head = `${K.brandHead(`Parent's page: session ${m.n}`, `${final ? "Final check" : "Review"}. Read this before you start.`)}${stamp(made, sLabel(made, m))}`;
    const more = `${K.brandHead(`Parent's page: session ${m.n} (continued)`)}${stamp(made)}`;
    const blocks = [block(`<p class="cs-aim"><b>Today:</b> ${what}, to find what's secure and what needs going over again. ${Child(made)} works alone; you mark afterwards. It isn't a test to pass: it shows you where to spend the next few sessions.</p>`)];
    blocks.push(block(`${heading("Step 1: The questions", m.items.length ? "about 20 minutes" : "")}${m.items.length ? `<p>${Child(made)} does the ${final ? "final check" : "review"} sheet (${m.items.length} questions) on their own. Then mark it together with the answer page, and talk about any that went wrong.</p>` : "<p>There's no question sheet this time: these lessons are about talking, reading and writing, so step 2 is the review.</p>"}`));
    const checks = m.from.map(l => `<li><b>${esc(l.title)}</b> (session ${lessonNo(made, l)}): ${esc(textFor(made, l.steps.check, "ask a question like the ones on its sheet"))}</li>`);
    blocks.push(block(`${heading("Step 2: Ask again", final ? "pick 5 or 6" : "about 15 minutes")}<p>For each lesson, do its check again, out loud or on scrap paper.${final ? " Choose the ones that were nearly or not yet on the tracker first." : ""} Then tick secure, nearly or not yet on the tracker.</p><ul class="cs-list">${checks.join("")}</ul>`));
    blocks.push(block(`${heading("What next")}<p>Secure: well done, carry on. Nearly: do its check again as the warm-up next session. Not yet: do that session again before going on${made.paper ? " (cover the answers and redo its sheet)" : " (make the pack again for fresh questions, or do its online practice)"}. ${final ? `All or nearly all secure? ${Child(made)} is ready for the next pack.` : ""}</p>`));
    blocks.push(block(`<div class="cs-notes"><b>Your notes</b> (score ___ / ${m.items.length || "—"}; lessons to go over again)</div>`));
    return doc(head, more, blocks, true);
  }
  // The child's sheet: ten questions a page, laid out like the Library's activity sheets
  const PER_PAGE = 10;
  function reviewSheets(made, m) {
    const title = m.kind === "final" ? "Final check" : "Review", pages = [];
    for (let i = 0; i < m.items.length; i += PER_PAGE) {
      const part = m.items.slice(i, i + PER_PAGE), more = m.items.length > PER_PAGE ? ` (part ${i / PER_PAGE + 1})` : "";
      const qs = part.map((q, k) => `<div class="ws-q"><p><b>${i + k + 1}.</b> ${esc(q.prompt)}</p>${q.options ? `<div class="ws-options">${q.options.map(o => `<span><i></i>${esc(o)}</span>`).join("")}</div>` : `<div class="ws-answer"><span class="ws-blank"></span></div>`}</div>`);
      const short = part.every(q => String(q.prompt).length <= 60 && (!q.options || q.options.every(o => String(o).length <= 24)));
      pages.push(K.ageLook(`${K.sheetHead(`${title}${more}`, made.who)}${stamp(made, sLabel(made, m))}
        <p>${made.pack.age === "young" ? "Your adult can read the questions to you. " : ""}Answer each question on your own. Do the ones you know first.</p>
        <div class="ws-qs${short ? " ws-cols" : ""}" data-cols="no">${qs.join("")}</div>`, made.pack.age));
    }
    return pages;
  }
  function reviewAnswers(made, m) {
    if (!m.items.length) return null;
    const title = m.kind === "final" ? "Final check" : "Review";
    const head = `${K.brandHead(`Answers: ${title.toLowerCase()}, session ${m.n}`, "For you, not your child.")}${stamp(made, sLabel(made, m))}`;
    const rows = m.items.map((q, i) => `<li><b>${esc(q.answer)}</b>${q.explain ? ` · ${esc(q.explain)}` : ""} <span class="gx-of">(${esc(q.lesson.title)}, session ${lessonNo(made, q.lesson)})</span></li>`);
    return doc(head, `${K.brandHead(`Answers: ${title.toLowerCase()} (continued)`)}${stamp(made)}`, [block(`<ol class="ws-answers">${rows.join("")}</ol>`),
      block(`<p class="gx-note">A wrong answer points to the lesson in brackets: do that lesson's check again (step 2 on the parent's page).</p>`)], true);
  }

  // ---------- The front: parent's guide, plan, tracker ----------
  function guideDoc(made) {
    const pack = made.pack, n = made.sessions.length, lessons = made.sessions.filter(m => m.kind === "lesson").length, weeks = Math.ceil(n / made.perWeek);
    const maths = pack.subject === "Maths", words = (D.WORDS[pack.subject] || {})[pack.age] || [];
    const scot = pack.nation === "scotland";
    const head = `${K.brandHead(`Teaching ${pack.title} at home`, `${esc(pack.ages)}. ${made.paper ? "A parent's guide, paper only." : "A parent's guide."} Read this first.`)}${stamp(made)}`;
    const blocks = [
      block(box(`You don't need to be a teacher${maths ? ", or good at maths" : ""}`, `<p>Everything is written out for you. Each session has a <b>parent's page</b> that says what to do, step by step, and what to say. The <b>answer pages</b> have every answer. Your job is to keep it calm and short, mark with the answer pages, and ask your child to explain their thinking. Learning alongside them is fine: say so.</p>`)),
      block(box("The pack", `<p>${n} sessions of about ${minutes(pack)} minutes: ${lessons} lessons, a review after every ${REVIEW_EVERY}, and a final check. At ${made.perWeek} a week that's about ${weeks} weeks. ${made.paper ? "Everything is on paper: no internet needed." : "Each lesson also names free online practice on popspell.com that marks itself (no login)."}</p>`)),
      block(box("Before each session (5 minutes)", `<p>Read that session's parent's page. Put out the pupil's sheets, the answer pages (on your side of the table), a pencil and anything in “You need”. Phones away, TV off.</p>`)),
      block(box("Every lesson has four steps", `<ol class="cs-list"><li><b>Warm up</b> (${STEP_MINUTES(pack)[0]} minutes): something quick to get going.</li><li><b>Show and explain</b> (${STEP_MINUTES(pack)[1]} minutes): read the explanation out or say it your way, then do one together.</li>
        <li><b>Practise</b> (${STEP_MINUTES(pack)[2]} minutes): the sheet, marked as you go.</li><li><b>Check</b> (${STEP_MINUTES(pack)[3]} minutes): one or two questions on their own, and a question to see if they understand why. This tells you whether to move on.</li></ol>`)),
      block(box("When they get it wrong", `<p>Don't say “wrong”. Say <i>“Nearly. Talk me through it.”</i> Most mistakes are one slip, and explaining finds it. Each parent's page has lines to say if they're stuck. If they're tired or upset, stop: two short sessions beat one long one.${pack.age === "young" ? " At this age, 20 to 30 minutes is plenty; use real objects, and play." : ""}</p>`)),
      block(box("Move on or repeat?", `<p>Use the check at the end of each lesson. Secure: move on. Nearly: move on, and do the check again as the next warm-up. Not yet: do the session again a day or two later${made.paper ? ", with the answers covered" : ", or make the pack again for fresh questions"}. Tick it on the tracker each time. The reviews catch anything that slipped.</p>`)),
      block(box("Where to start", `<p>Not sure the level is right? Do the <b>Check</b> step of the first three lessons. If they're all easy, try the check of a few later lessons and start where it gets hard. If the first ones are hard, go to the pack before this one.</p>`)),
      block(box("What it covers", scot ? (pack.pick.sqa ? `<p>The ${esc(pack.pick.sqa)} course, written from SQA's course specification, with questions in the exam's style (PopSpell's own, not past papers).</p>`
        : `<p>Scotland's Curriculum for Excellence, ${esc(pack.pick.level)} level: every lesson's “can do” list is from the benchmarks. The parent's pages also name the strand of the new draft Know, Do, Understand framework where it's known (the draft may still change).</p>`)
        : pack.exam ? `<p>The GCSE course, with questions in the exam's style (PopSpell's own, not past papers)${pack.subject === "Maths" && /gcse-1$/.test(pack.id) ? ". For a full 60-session version with mock exams, see the GCSE maths grade 1 to 3 course" : ""}.</p>`
          : `<p>England's national curriculum (2014): the lessons cover the ${esc(pack.pick.band)} programme of study.</p>`)),
      pack.exam ? block(box("Sitting the exam", `<p>A child who isn't on a school roll can usually sit the exam as a private candidate at a school, college or exam centre near you. Ask early in the school year: entries close months before the exam, and there is a fee.${scot ? " In Scotland, ask a local secondary school or college (SQA itself doesn't take private entries)." : " The centre will tell you which exam board (AQA, Edexcel or OCR) it uses."}${made.paper ? " Ask the centre for printed past papers and mark schemes." : " Past papers and mark schemes are free on the exam board's website."}</p>`)) : "",
      words.length ? block(box("Words you'll meet", `<p>${words.map(([w, m]) => `<b>${esc(w)}</b>: ${esc(m)}.`).join(" ")}</p>`)) : ""].filter(Boolean);
    return doc(head, `${K.brandHead("A parent's guide (continued)")}${stamp(made)}`, blocks, true);
  }
  function planDoc(made) {
    const tag = { review: "Review", final: "Check", lesson: "" };
    const rows = made.sessions.map(m => `<tr><td class="cs-n">${m.n}</td><td class="cs-n">${m.week}</td><td class="cs-d">${m.date || ""}</td><td>${esc(m.kind === "lesson" ? m.l.title : m.t)}${tag[m.kind] ? ` <span class="cs-tag">${tag[m.kind]}</span>` : ""}</td><td class="cs-tick">☐</td></tr>`);
    const chunks = [];
    for (let i = 0; i < rows.length; i += 12) chunks.push(rows.slice(i, i + 12));
    const thead = `<thead><tr><th>Session</th><th>Week</th><th>Date</th><th>What it covers</th><th>Done</th></tr></thead>`;
    return doc(`${K.brandHead("The plan", `${esc(made.pack.title)}: ${made.sessions.length} sessions, ${made.perWeek} a week.`)}${stamp(made)}`, `${K.brandHead("The plan (continued)")}${stamp(made)}`,
      chunks.map(ch => block(`<table class="cs-plan">${thead}<tbody>${ch.join("")}</tbody></table>`)), true);
  }
  function trackerDoc(made) {
    const rows = made.sessions.map(m => m.kind === "lesson"
      ? `<tr><td class="cs-n">${m.n}</td><td>${esc(m.l.title)}<br><span class="gx-of">${esc(m.l.criteria[0] || "")}</span></td><td class="cs-tick">☐</td><td class="cs-tick">☐</td><td class="cs-tick">☐</td></tr>`
      : `<tr><td class="cs-n">${m.n}</td><td><b>${esc(m.t)}</b></td><td colspan="3">Score ___ / ${m.items.length || "—"}</td></tr>`);
    const chunks = [];
    for (let i = 0; i < rows.length; i += 14) chunks.push(rows.slice(i, i + 14));
    const thead = `<thead><tr><th>Session</th><th>What I'm learning</th><th>Secure</th><th>Nearly</th><th>Not yet</th></tr></thead>`;
    return doc(`${K.sheetHead("My tracker", made.who)}${stamp(made, esc(made.pack.title))}`, `${K.sheetHead("My tracker (continued)", made.who)}${stamp(made)}`,
      chunks.map(ch => block(`<table class="cs-plan">${thead}<tbody>${ch.join("")}</tbody></table>`)), false, made.pack.age);
  }

  // ---------- Laying out pages ----------
  // Fills pages block by block, measured as printed: a block that won't fit starts a new page
  // A parent's page may run a little long: fitPages then shrinks it (to 80% at most) rather than leave a few lines on a page of their own
  const LIMIT = K.PAGE_H * 0.95, LIMIT_ADULT = K.PAGE_H * 1.18;
  function paginate(d) {
    if (!d) return [];
    const look = h => (d.adult ? h : K.ageLook(h, d.age || "older"));
    if (typeof document === "undefined" || !document.body || !document.createElement) return [look(d.head + d.blocks.join(""))];
    const area = document.createElement("section");
    area.className = `sheet-preview-page ws-measure ${CLASS}`;
    Object.assign(area.style, { position: "absolute", left: "-10000px", top: "0", width: `${K.PAGE_W}px`, padding: "0", margin: "0", minHeight: "0", boxShadow: "none" });
    document.body.append(area);
    const pages = [];
    let parts, from;
    const begin = h => { area.innerHTML = `${look(h)}${K.FOOT}`; from = area.querySelector(".pp-working") || area.querySelector(".ws-foot"); parts = [h]; };
    begin(d.head);
    d.blocks.forEach(b => {
      from.insertAdjacentHTML("beforebegin", b);
      if (area.scrollHeight > (d.adult ? LIMIT_ADULT : LIMIT) && parts.length > 1) {
        from.previousElementSibling.remove();
        pages.push(look(parts.join("")));
        begin(d.more);
        from.insertAdjacentHTML("beforebegin", b);
      }
      parts.push(b);
    });
    pages.push(look(parts.join("")));
    area.remove();
    return pages;
  }

  // The pages to print: which = "front", "1-15" (sessions), "session-7" or "all"; copy = "parent" (parent's
  // pages, the pupil's sheets and the answers), "pupil" (the pupil's sheets only) or "answers" (parent's pages and answers)
  function pagesOf(made, which = "all", copy = "parent") {
    const out = [], P = h => h && out.push({ html: h, adult: false }), Ad = h => h && out.push({ html: h, adult: true });
    if (which === "all" || which === "front") {
      if (copy !== "pupil") { paginate(guideDoc(made)).forEach(Ad); paginate(planDoc(made)).forEach(Ad); }
      if (copy !== "answers") paginate(trackerDoc(made)).forEach(P);
    }
    const range = which === "all" ? [1, made.sessions.length] : /^\d+-\d+$/.test(which) ? which.split("-").map(Number) : /^session-\d+$/.test(which) ? [+which.slice(8), +which.slice(8)] : null;
    const tag = (h, made, m) => h.replace("</header>", `</header>${stamp(made, sLabel(made, m))}`);
    if (range) made.sessions.filter(m => m.n >= range[0] && m.n <= range[1]).forEach(m => {
      if (m.kind === "lesson") {
        if (copy !== "pupil") paginate(lessonPage(made, m)).forEach(Ad);
        if (copy !== "answers") m.lp.pupil.forEach(p => P(tag(p.html(), made, m)));
        if (copy !== "pupil") m.lp.adult.filter(p => p.label !== "Lesson plan" && (!p.has || p.has())).forEach(p => Ad(tag(p.html(), made, m)));
      } else {
        if (copy !== "pupil") paginate(reviewPage(made, m)).forEach(Ad);
        if (copy !== "answers") reviewSheets(made, m).forEach(P);
        if (copy !== "pupil") paginate(reviewAnswers(made, m)).forEach(Ad);
      }
    });
    const foot = made.paper ? `<p class="ws-foot">PopSpell · free literacy and numeracy practice</p>` : "";
    const clean = h => (made.paper ? offline(h) : h);
    return out.map(p => `<div class="ws-page${p.adult ? " ws-adult" : ""}">${clean(p.html)}${foot}</div>`);
  }
  // Paper only: no web address on any page. Sheets made for class can mention PopSpell's online work.
  const offline = html => html
    .replace(/<a [^>]*>([\s\S]*?)<\/a>/g, "$1")
    .replace(/<span class="hint">PopSpell: [^<]*<\/span>/g, "")
    .replace(/<th>Online<br>best %<\/th>/g, "<th>Sheet<br>score</th>")
    .replace(/ ?The online (?:stage )?check asks [^.<]*\./g, "")
    .replace(/Each topic: the lesson, then the online practice \(aim for \d+% or more\), then/g, "Each topic: the lesson, then")
    .replace(/, online practice and exam/g, " and exam").replace(/, lesson, online practice and/g, ", lesson and")
    .replace(/about three-quarters of the online practice right, and/g, "about three-quarters of the topic's sheet right, and")
    .replace(/Check (?:last year's boundaries on )?(?:the exam board's|the board's|SQA's) website(?: for)?/g, m => (/boundaries/.test(m) ? "Ask the exam centre about last year's boundaries" : "Ask the exam centre for"))
    .replace(/on SQA's website|\(SQA's website has past papers\)/g, m => (m.startsWith("(") ? "(ask the exam centre for a printed past paper)" : "from the exam centre"))
    .replace(/\s*\(?(?:at |on |from )?(?:https?:\/\/)?(?:www\.)?popspell\.com[^\s<)]*\)?/gi, "")
    .replace(/(?:Then )?(?:do |try )?(?:the |its )?online practice[^.<]*\./gi, "");

  // ---------- Printing, or saving as PDF ----------
  let made = null, printing = null;
  async function prepare(which, copy) {
    if (printing) printing.remove();
    if (T().sheetFonts) await T().sheetFonts;
    if (document.fonts) await document.fonts.ready;
    const sheet = document.createElement("section");
    sheet.className = `worksheet-print ${T().sheetClass(CLASS)}`;
    sheet.innerHTML = pagesOf(made, which, copy).join("");
    document.body.append(sheet);
    document.body.classList.add("printing-worksheet");
    printing = sheet;
    await Promise.all([...sheet.querySelectorAll("img")].map(img => (img.complete ? null : new Promise(r => { img.onload = img.onerror = r; }))));
    K.fitPages(sheet, T().sheetClass(CLASS));
    // A sheet that fitting splits in two gets the usual footer on its new page: paper only has no web address
    if (made.paper) sheet.querySelectorAll(".ws-foot").forEach(f => { f.textContent = "PopSpell · free literacy and numeracy practice"; });
    return sheet.querySelectorAll(":scope > .ws-page").length;
  }
  async function printPages(which, copy) {
    if (!made) return;
    await prepare(which, copy);
    const what = which === "front" ? "guide, plan and tracker" : which.startsWith("session-") ? `session ${which.slice(8)}` : `sessions ${which.replace("-", " to ")}`;
    document.title = `${made.pack.title} ${made.code}, ${what}${copy === "pupil" ? " (pupil)" : copy === "answers" ? " (parent's pages and answers)" : ""}`;
    const done = () => { if (printing) printing.remove(); printing = null; document.body.classList.remove("printing-worksheet"); document.title = "Home-school packs · PopSpell"; };
    window.addEventListener("afterprint", done, { once: true });
    window.print();
  }

  // ---------- The page ----------
  const GROUP = 15;
  function show(app, id = "") {
    const pack = D.get(id);
    document.title = "Home-school packs · PopSpell";
    if (!pack) return showList(app);
    if (made && made.pack.id !== pack.id) made = null;
    const sessions = plan(pack), n = sessions.length, groups = [];
    for (let i = 1; i <= n; i += GROUP) groups.push(`${i}-${Math.min(n, i + GROUP - 1)}`);
    const v = k => (app.querySelector(`#${k}`) ? app.querySelector(`#${k}`).value : "");
    app.innerHTML = `<section class="panel hm-panel"><p><a href="#/home">← All home-school packs</a></p>
      <h1>${esc(pack.title)}</h1><p class="hint">${pack.nation === "scotland" ? "Scotland" : "England"} · ${esc(pack.ages)} · ${n} sessions (${sessions.filter(s => s.kind === "lesson").length} lessons, reviews and a final check)</p>
      <p>A whole course for a parent teaching at home: a parent's guide, a plan and a tracker, then for each session a page that says what to do and what to say, your child's sheets, and the answers. <b>Online</b> names the free practice on popspell.com; <b>paper only</b> has no web links at all. Every pack you make has new questions.</p>
      <div class="hm-form">
        <label>Child's name (optional) <input id="who" maxlength="40" autocomplete="off" value="${esc(made ? made.who : v("who"))}"></label>
        <label>First session <input id="start" type="date" value="${esc(made && made.start ? made.start.toISOString().slice(0, 10) : v("start"))}"></label>
        <label>Edition <select id="edition"><option value="online"${made && made.paper ? "" : " selected"}>Online: names the free practice</option><option value="paper"${made && made.paper ? " selected" : ""}>Paper only: no internet, no web links</option></select></label>
        <label>Sessions a week <select id="perWeek">${[1, 2, 3, 4, 5].map(k => `<option${(made ? made.perWeek : pack.perWeek) === k ? " selected" : ""}>${k}</option>`).join("")}</select></label>
      </div>
      <p><button class="btn primary" id="make">${made ? "Make it again (new questions)" : "Make the pack"}</button></p>
      ${made ? `<div aria-live="polite"><p><b>Pack ${esc(made.code)} is ready.</b> Print it in parts. In the print window choose <b>Save as PDF</b> to download it, A4 paper, default margins.</p>
        <fieldset class="hm-copy"><legend>Which copy</legend>
          <label><input type="radio" name="copy" value="parent" checked> Parent's copy: parent's pages, sheets and answers</label>
          <label><input type="radio" name="copy" value="pupil"> Child's sheets only (a workbook)</label>
          <label><input type="radio" name="copy" value="answers"> Parent's pages and answers only</label></fieldset>
        <p class="hm-do"><button class="btn primary" data-print="front">Guide, plan and tracker</button>
          ${groups.map(g => `<button class="btn" data-print="${g}">Sessions ${g.replace("-", " to ")}</button>`).join("")}</p>
        <p class="hm-do"><label>One session <select id="one">${made.sessions.map(m => `<option value="session-${m.n}">${m.n}. ${esc(m.kind === "lesson" ? m.l.title : m.t)}</option>`).join("")}</select></label>
          <button class="btn" data-print="one">Print this session</button></p></div>`
        : `<p class="hint">It takes a few seconds to make.</p>`}
      <h2>The sessions</h2><ol class="hm-sessions">${sessions.map(s => `<li>${esc(s.kind === "lesson" ? s.l.title : s.t)}</li>`).join("")}</ol>
      <p class="hint">Nothing you type here is saved or sent anywhere.</p></section>`;
    app.querySelector("#make").onclick = async () => {
      const btn = app.querySelector("#make");
      btn.disabled = true; btn.textContent = "Making the pack…";
      await new Promise(r => setTimeout(r, 30));
      const d = v("start") ? new Date(`${v("start")}T12:00:00`) : null;
      made = make(pack.id, v("who").trim(), { start: d && !isNaN(d) ? d : null, perWeek: Number(v("perWeek")) || pack.perWeek, paper: v("edition") === "paper" });
      show(app, pack.id);
    };
    app.querySelectorAll("[data-print]").forEach(b => { b.onclick = () => {
      const copy = (app.querySelector('input[name="copy"]:checked') || {}).value || "parent";
      printPages(b.dataset.print === "one" ? app.querySelector("#one").value : b.dataset.print, copy);
    }; });
  }
  function showList(app) {
    const group = (nation, subject) => D.PACKS.filter(p => p.nation === nation && p.subject === subject)
      .map(p => `<li><a href="#/home/${p.id}">${esc(p.title)}</a> <span class="hint">${esc(p.ages)}</span></li>`).join("");
    app.innerHTML = `<section class="panel hm-panel"><h1>Home-school packs</h1>
      <p>Free courses for a parent teaching their own child at home, from the first year of school to the last. Each one is a parent's guide, a plan and a tracker, then a session at a time: what to do and say, your child's sheets, and the answers. Choose online (names free practice on PopSpell) or paper only (no internet needed).</p>
      <div class="hm-grid"><div><h2>Scotland: maths</h2><ul>${group("scotland", "Maths")}</ul></div><div><h2>Scotland: English</h2><ul>${group("scotland", "Literacy")}</ul></div>
        <div><h2>England: maths</h2><ul>${group("england", "Maths")}</ul></div><div><h2>England: English</h2><ul>${group("england", "Literacy")}</ul></div></div>
      <p class="hint">Scotland follows the Curriculum for Excellence levels and the SQA courses; England follows the 2014 national curriculum and GCSE. Years 12 and 13 (A level) aren't covered yet.</p></section>`;
  }

  return { show, make, plan, lessonsFor, pagesOf, prepare, use: m => { made = m; return made; }, offline, paperText };
})();
