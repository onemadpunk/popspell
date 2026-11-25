/*
  The English exam climbs' question bank, for every page that uses it:
    • activities.js makes the online practice a teacher can set (PopEnglishExam.activities)
    • english-climb.html, the self-guided "My next step" page for a pupil working alone
    • the A4 sheets (sheets/14-english-climb.js), which print the same questions with mark schemes
  Courses are in exam-english/<course>.js (window.EXAM_ENGLISH.<key>), texts in exam-english/texts.js.
*/
window.PopEnglishExam = (() => {
  "use strict";
  const TEXTS = Object.fromEntries((window.EXAM_TEXTS || []).map(t => [t.id, t]));
  const COURSES = window.EXAM_ENGLISH || {};
  const shuffle = list => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Every course's stages (the climb) and its extra topics (Literature), each topic knowing its stage and course
  const course = key => COURSES[key] || null;
  const stagesOf = c => c.STAGES.concat(c.LIT ? [c.LIT] : []);
  Object.values(COURSES).forEach(c => stagesOf(c).forEach(st => st.topics.forEach(t => {
    t.stage = st; t.course = c;
    t.items.forEach((it, i) => Object.assign(it, { topic: t, n: i }));
  })));
  const allTopics = () => Object.values(COURSES).flatMap(c => stagesOf(c).flatMap(st => st.topics));
  const topic = id => allTopics().find(t => t.id === id) || null;
  const stage = key => Object.values(COURSES).flatMap(stagesOf).find(st => st.key === key) || null;
  const text = id => TEXTS[id] || null;

  // n different questions from a topic, a new mix each time (texts kept together where they can be)
  const items = (id, n = 8) => shuffle(topic(id).items).slice(0, n);
  // A stage check: one question from every topic (two each for stage 1, so a grade 1 pupil gets a fair look)
  const check = key => { const st = stage(key); return st.topics.flatMap(t => items(t.id, st.n === 1 ? 2 : 1)); };
  // Mixed revision: questions from across a stage
  const mixed = (key, n = 10) => { const st = stage(key); return shuffle(st.topics).flatMap(t => items(t.id, 2)).slice(0, n).sort((a, b) => a.topic.n - b.topic.n); };

  // The text a question is about, as the screen shows it: the whole extract, with the lines it quotes marked
  const shown = it => {
    const t = text(it.t);
    if (!t) return null;
    return { id: `exam-${t.id}`, title: t.title, by: t.by, kind: t.kind, text: t.text, mark: it.x || "", exam: true };
  };
  // A question as the pupil app asks it (a choice), with the reason shown after
  const online = (it, choice) => {
    const extra = { label: `${it.topic.short}: ${it.q.slice(0, 60)}`, skill: it.sk, explain: it.why, exam: true };
    const p = shown(it);
    if (p) extra.passage = p;
    return choice(it.q, it.a, it.o, extra);
  };

  // The online practice for the teacher's Library and the pupil app: a set per topic, each stage's check
  // and mixed revision. activities.js passes its own choice() so the questions are the app's kind.
  function activities(kit) {
    const out = [];
    for (const c of Object.values(COURSES)) {
      const ORG = `Literacy · ${c.name}`;
      const set = (list) => list.map((it, i) => Object.assign(online(it, kit.choice), { diff: i }));
      for (const st of stagesOf(c)) {
        const tag = st.optional ? st.title : `stage ${st.n}`;
        if (!st.optional) out.push({ id: `${st.key}-check`, title: `${c.name}: ${st.title.replace(/^Stage (\d):/, "stage $1 check,")}`, level: "Fourth", organiser: ORG, check: false,
          blurb: `${st.n === 1 ? "Two questions" : "One question"} on each of the ${st.topics.length} topics, in the order of the climb. The results show which topics to work on first.`,
          make: () => set(check(st.key)) });
        for (const t of st.topics) out.push({ id: t.id, title: `${c.name} ${st.optional ? "(Literature)" : st.n + "." + t.n}: ${t.title}`, level: "Fourth", organiser: ORG, check: false,
          blurb: `${t.blurb} Eight exam-style questions with the reason for each answer.`, make: () => set(items(t.id, 8)) });
        if (!st.optional) out.push({ id: `${st.key}-mixed`, title: `${c.name}: mixed questions (${tag}, ${st.goal})`, level: "Fourth", organiser: ORG, check: false,
          blurb: `Ten questions from across the ${st.title.replace(/^Stage \d: /, "")} topics, a new mix every time, for revision.`, make: () => set(mixed(st.key)) });
      }
    }
    return out;
  }

  return { COURSES, TEXTS, course, stagesOf, topics: allTopics, topic, stage, text, items, check, mixed, shown, online, activities, shuffle };
})();
