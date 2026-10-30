/* PopSpell parent page (parent.html#<link>): one pupil's progress, for their family.
   The teacher area writes the summary (teacher.js); this page only reads it, with no sign-in. */
(() => {
  "use strict";

  const app = document.getElementById("app");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const day = ms => new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const date = key => new Date(`${key}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const chips = (list, kind) => list.map(s => `<span class="chip ${kind}">${esc(s)}</span>`).join(" ");
  const STATUS = { Secure: "secure", Developing: "developing", "Needs support": "support" };

  const notWorking = () => {
    document.title = "PopSpell · Link not working";
    app.innerHTML = `<section class="panel start"><h1>This link isn't working</h1>
      <p>It may have been turned off or replaced. Please ask your child's tutor for a new link.</p></section>`;
  };

  function show(p) {
    const s = p.summary || {};
    const name = p.pupil;
    const sounds = s.sounds || { secure: [], learning: [], practise: [] };
    const week = s.week || { done: 0, questions: 0 };
    const upcoming = s.upcoming || [];
    document.title = `${name} · PopSpell progress`;
    app.innerHTML = `
      <section class="panel parent-page">
        <p class="eyebrow">👪 Progress at home</p>
        <div class="page-head"><img class="pip" src="assets/brand/pip-celebrate-small.webp" alt="Pip" width="64" height="64"><h1>${esc(name)}'s progress</h1></div>
        <p class="meta">${s.teacher ? `From ${esc(s.teacher)} · ` : ""}updated ${esc(day(p.updated))}</p>

        ${p.note ? `<div class="parent-note"><b>💬 A note from ${esc(s.teacher || "the tutor")}</b><p>${esc(p.note)}</p></div>` : ""}

        <div class="bests-stats">
          <div><b>${week.done}</b><span>${week.done === 1 ? "piece of work" : "pieces of work"} this week</span></div>
          <div><b>${week.questions}</b><span>words and questions this week</span></div>
          <div><b>${sounds.secure.length}</b><span>${sounds.secure.length === 1 ? "sound" : "sounds"} known well ⭐</span></div>
        </div>

        ${s.nextLesson || s.homework || upcoming.length ? `
          <h2>📌 Coming up</h2>
          <ul class="parent-list">
            ${s.nextLesson ? `<li>Next lesson: <b>${esc(date(s.nextLesson))}</b></li>` : ""}
            ${s.homework ? `<li>Homework: <b>${esc(s.homework)}</b></li>` : ""}
            ${upcoming.map(u => `<li>${esc(date(u.from))}: ${esc(u.title)}</li>`).join("")}
          </ul>` : ""}

        <h2>🔶 Sounds to practise at home</h2>
        ${sounds.practise.length ? `<p>${chips(sounds.practise, "practise")}</p>` : `<p class="hint">Nothing to catch up on right now. Well done!</p>`}
        ${sounds.learning.length ? `<h2>🌱 Getting there</h2><p>${chips(sounds.learning, "learn")}</p>` : ""}
        ${sounds.secure.length ? `<h2>⭐ Sounds ${esc(name)} knows well</h2><p>${chips(sounds.secure, "good")}</p>` : ""}
        <p class="hint">A sound counts as known well once it has been spelled right first time at least four times, on two different days, and the last three times in a row.</p>

        ${(s.recent || []).length ? `
          <h2>Recent work</h2>
          <ul class="parent-list">${s.recent.map(r => `<li>${esc(day(r.at))} · ${esc(r.title)}${r.worksheet ? " (worksheet)" : ""}${r.score ? ` · ${esc(r.score)}` : ""}</li>`).join("")}</ul>` : ""}

        ${(s.cfe || []).length ? `
          <h2>${s.curriculum === "england" ? "National curriculum (England)" : "Curriculum for Excellence"}</h2>
          <div class="t-scroll"><table class="t-table cfe-table">
            <thead><tr><th>Area</th><th>${s.curriculum === "england" ? "Year" : "Level"}</th><th>Progress</th></tr></thead>
            <tbody>${s.cfe.map(c => `<tr><td>${esc(c.organiser)}</td><td>${esc(c.level)}</td>
              <td><span class="cfe ${STATUS[c.status] || ""}">${esc(c.status)}</span></td></tr>`).join("")}</tbody>
          </table></div>
          <p class="hint">Secure means 85% or more right first time, on at least 10 questions over two or more days. This is a guide from PopSpell work only, not a school report.</p>` : ""}

        <h2>How to help at home</h2>
        <ul class="parent-list">
          <li><b>Say the sounds, not the letter names.</b> "c-a-t", not "see-ay-tee".</li>
          <li><b>For spelling:</b> say the word, count its sounds on your fingers, then write the letter or letters for each sound.</li>
          <li><b>For reading:</b> point under each sound, say it, then blend them together into the word.</li>
          <li><b>Little and often:</b> ten minutes a day helps more than an hour once a week.</li>
          <li><b>Praise the effort.</b> Mistakes show which sound to practise next.</li>
        </ul>

        <p class="hint">This page covers about the last ${Math.round((s.days || 120) / 30)} months and is brought up to date whenever ${esc(name)}'s tutor looks at the latest work. The link is private to your family, so please don't share it.</p>
      </section>`;
  }

  (window.PopCloudReady || Promise.resolve(null)).then(async api => {
    const link = location.hash.replace(/^#\/?/, "");
    if (!api || !link) return notWorking();
    try {
      const p = await api.parentPage(link);
      if (p) show(p); else notWorking();
    } catch (err) {
      console.warn("PopSpell: parent page", err);
      notWorking();
    }
  });
})();
