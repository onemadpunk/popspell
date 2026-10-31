/* PAPER WORKSHEETS for the ready lessons that are taught with objects, talk or writing rather than
   PopSpell's online work, so every lesson has a sheet to hand a pupil.

   Each sheet belongs to a ready lesson (lessons.js), which gives it its level, subject and strand,
   and its national curriculum statements for England. build(who, h) makes the pupil's page and,
   where there are right answers, a separate page for the adult; both come from one call, so
   anything chosen at random matches. h is the teacher area's sheet kit: sheetHead, brandHead,
   handwritingRow and esc.

   WRITTEN BY tools/build.mjs (npm run build) from the files in sheets/, joined in name order: edit
   those, not paper-sheets.js. */
window.PopPaper = (() => {
  "use strict";
  const rand = n => Math.floor(Math.random() * n);
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = arr => arr[rand(arr.length)];

  // Shared pieces
  const answersPage = (h, title, items, note = "", after = "") => `${h.brandHead(`Answers: ${title}`, "For the adult, not the pupil.")}
    ${note ? `<p>${note}</p>` : ""}<ol class="ws-answers">${items.map(a => `<li>${a}</li>`).join("")}</ol>${after}`;
  const lookForPage = (h, title, items, note = "") => `${h.brandHead(`What to look for: ${title}`, "For the adult, not the pupil.")}
    ${note ? `<p>${note}</p>` : ""}<ul class="ws-answers">${items.map(a => `<li>${a}</li>`).join("")}</ul>`;
  const blank = (w = 5) => `<span class="ws-blank" style="width:${w}em"></span>`;
  // Plain writing lines (Second level), or four-line ruling (Early and First)
  const lines = n => `<div class="ws-lines">${"<span></span>".repeat(n)}</div>`;
  const ruled = (h, n) => Array.from({ length: n }, () => h.handwritingRow("", ["blank"])).join("");
  const box = (label, inner, cls = "") => `<div class="pp-box ${cls}"><b>${label}</b>${inner}</div>`;
  const tick = labels => labels.map(l => `<span class="pp-tick">☐ ${l}</span>`).join(" ");
  const svg = (w, hgt, body, cls = "pp-pic") => `<svg class="${cls}" viewBox="0 0 ${w} ${hgt}" width="${w}" height="${hgt}" role="img">${body}</svg>`;
  // A squared grid, cells × rows, s pixels a square
  const gridLines = (cols, rows, s, x0 = 0, y0 = 0) => {
    let g = "";
    for (let c = 0; c <= cols; c++) g += `<line x1="${x0 + c * s}" y1="${y0}" x2="${x0 + c * s}" y2="${y0 + rows * s}" class="pp-grid"/>`;
    for (let r = 0; r <= rows; r++) g += `<line x1="${x0}" y1="${y0 + r * s}" x2="${x0 + cols * s}" y2="${y0 + r * s}" class="pp-grid"/>`;
    return g;
  };

  const sheets = {};
  const add = (id, lesson, title, detail, build, opts = {}) => { sheets[id] = Object.assign({ id, lesson, title, detail, build }, opts); };

