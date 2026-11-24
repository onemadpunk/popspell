/* PopSpell's printed sheets, shared by the teacher area (teacher.js) and the stand-alone pages that
   print sheets without signing in (pack.html, the downloadable GCSE maths packs): the header every sheet
   starts with, its age look, and fitPages, which lays each page out to fit one A4 sheet. */
window.PopSheetPrint = (() => {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // A4 with 12 mm margins (see @page in style.css), in CSS pixels
  const MM = 96 / 25.4, PAGE_W = 186 * MM, PAGE_H = 273 * MM;
  const FOOT = `<p class="ws-foot">PopSpell · free literacy and numeracy practice · popspell.com</p>`;
  // Lays each page out to waste as little paper as possible: a footer on each, short questions in
  // two columns, a sheet that's only a little over a page shrunk to fit on one, and questions left off
  // the end if it still won't fit. Measured on a copy laid out like the printed page.
  function fitPages(root, className = "") {
    const parts = root.querySelectorAll(":scope > .ws-page, :scope > .pn-page").length
      ? [...root.querySelectorAll(":scope > .ws-page, :scope > .pn-page")] : [root];
    for (let at = 0; at < parts.length; at++) {
      const part = parts[at];
      // Shrinking stops at 76%, so the print stays easy to read; 3% is kept spare for the printer.
      // Younger pupils would rather have fewer questions than tiny ones, so their questions are left
      // off until the sheet fits at 88% or more (it can still shrink to 76% if it has 6 left)
      const fits = (h, least = 0.76) => h <= PAGE_H * 0.97 / least;
      const keepSize = part.querySelector(".ws-age-young") ? 0.88 : 0.76;
      // Fitting again starts from the page as it was made
      const zoomed = part.querySelector(":scope > .ws-zoom");
      if (zoomed) zoomed.replaceWith(...zoomed.childNodes);
      if (!part.querySelector(":scope > .ws-foot")) part.insertAdjacentHTML("beforeend", FOOT);
      const measure = () => {
        const box = document.createElement("section");
        box.className = `sheet-preview-page ws-measure ${className}`;
        box.innerHTML = part.innerHTML;
        Object.assign(box.style, { position: "absolute", left: "-10000px", top: "0", width: `${PAGE_W}px`, padding: "0", margin: "0", minHeight: "0", boxShadow: "none" });
        document.body.append(box);
        const h = box.scrollHeight;
        box.remove();
        return h;
      };
      let h = measure();
      // Questions that overflow try two columns, and keep them if that's shorter
      const qsBox = part.querySelector(".ws-qs");
      if (qsBox && !qsBox.classList.contains("ws-cols") && qsBox.dataset.cols !== "no" && h > PAGE_H * 0.97) {
        qsBox.classList.add("ws-cols");
        const h2 = measure();
        if (h2 < h * 0.9) h = h2; else qsBox.classList.remove("ws-cols");
      }
      // Still too long for one page: leave off questions from the end, down to 6
      // (activityPages makes the answers for the ones that stay)
      const questions = () => part.querySelectorAll(".ws-qs > .ws-q");
      while (qsBox && !fits(h, keepSize) && questions().length > 6) {
        [...questions()].pop().remove();
        h = measure();
      }
      // Rows marked ws-drop (sentences to write) go from the end, down to 6, until the page fits
      // without shrinking: writing on ruled lines needs them full size
      const drops = () => part.querySelectorAll(".ws-drop");
      while (h > PAGE_H * 0.97 && drops().length > 6) {
        [...drops()].pop().remove();
        h = measure();
      }
      // Still too long even shrunk: the extra parts at the end (Show your thinking, Thinking about the
      // story…) move to a page of their own, with the same header, rather than spilling over the page
      // break with their instructions on one page and the task on the next
      const extras = [...part.querySelectorAll(".ws-extra")];
      if (!fits(h) && extras.length && !part.classList.contains("ws-adult")) {
        const page = document.createElement("div");
        page.className = part.className;
        let holder = page; // inside the same wrappers (the age look) as on the first page
        const wraps = [];
        for (let el = extras[0].parentElement; el && el !== part; el = el.parentElement) wraps.unshift(el);
        wraps.forEach(w => { const c = w.cloneNode(false); c.classList.add("ws-more"); holder.append(c); holder = c; });
        part.querySelectorAll(".ws-brand, .ws-code").forEach(el => holder.append(el.cloneNode(true)));
        holder.append(...extras);
        part.after(page);
        parts.splice(at + 1, 0, page);
        h = measure();
      }
      // Last tries before running over two pages: two columns if that's any shorter, then shrinking
      // further, down to 70% (a sheet longer than that, like letter formation, keeps its pages)
      if (!fits(h) && qsBox && !qsBox.classList.contains("ws-cols") && qsBox.dataset.cols !== "no") {
        qsBox.classList.add("ws-cols");
        const h2 = measure();
        if (h2 < h) h = h2; else qsBox.classList.remove("ws-cols");
      }
      const shrink = fits(h, 0.7) ? PAGE_H * 0.97 / h : 1; // longer still (letter formation): it has its own pages
      // A page a little too long is shrunk to fit. The shrinking goes on a box round the page's
      // contents (.ws-zoom) that the printer can't split: Chrome decides page breaks before zoom, so a
      // zoomed page could still break where it would have unshrunk. The box keeps the printed width
      // inside, or anything sized by the width (handwriting rows, pictures) wouldn't shrink.
      if (h > PAGE_H * 0.97 && shrink < 1) {
        const box = document.createElement("div");
        box.className = "ws-zoom";
        Object.assign(box.style, { zoom: String(Math.floor(shrink * 100) / 100), width: `${PAGE_W}px` });
        box.append(...part.childNodes);
        part.append(box);
        // Shrunk text can wrap differently (a choice dropping to the next line), so it's measured
        // again shrunk, and shrunk a little more until it fits
        for (let z = parseFloat(box.style.zoom); measure() > PAGE_H * 0.97 && z > 0.62;) box.style.zoom = String((z = Math.round((z - 0.02) * 100) / 100));
      }
      // A pupil's page with paper to spare gives it to the places they draw and write
      else if (!part.classList.contains("ws-adult") && h < PAGE_H * 0.965) growSpaces(part, h, measure, className);
      // A page that fits prints as one A4 page of its own, which the printer can't split (see .ws-page
      // in style.css). One that still doesn't (letter formation, a long report) runs on over its pages.
      part.classList.toggle("ws-flow", measure() > PAGE_H * 0.97);
    }
    return root;
  }
  // Spare paper at the bottom of a pupil's page goes to its drawing and working boxes (.pp-draw,
  // .ps-draw, .ws-think, [data-grow], and younger pupils' question cards), which get taller, and its
  // writing lines (.ws-lines, .ps-lines), which get more lines at the same spacing, so a "draw it and
  // write about it" box isn't tiny above half a page of nothing. A box gets three shares to a block
  // of lines' one. Backed off if the page would overflow.
  const GROW_DRAW = ".pp-draw, .ps-draw, .ws-think, [data-grow], .ws-age-young > .ws-qs.ws-cols > .ws-q", GROW_LINES = ".ws-lines, .ps-lines";
  function growSpaces(part, h, measure, className) {
    const inUse = el => !el.closest(".ws-brand, .pp-working") && !el.parentElement.closest(GROW_DRAW);
    const draws = [...part.querySelectorAll(GROW_DRAW)].filter(inUse);
    const lines = [...part.querySelectorAll(GROW_LINES)].filter(inUse);
    if (!draws.length && !lines.length) return;
    // Heights, line spacing and rows, read from a copy laid out at the printed width
    const box = document.createElement("section");
    box.className = `sheet-preview-page ws-measure ${className}`;
    box.innerHTML = part.innerHTML;
    Object.assign(box.style, { position: "absolute", left: "-10000px", top: "0", width: `${PAGE_W}px`, padding: "0", margin: "0", minHeight: "0", boxShadow: "none" });
    document.body.append(box);
    const copyDraws = [...box.querySelectorAll(GROW_DRAW)].filter(inUse), copyLines = [...box.querySelectorAll(GROW_LINES)].filter(inUse);
    const drawH = copyDraws.map(el => el.getBoundingClientRect().height);
    const drawRow = copyDraws.map(el => Math.round(el.getBoundingClientRect().top / 8));
    const pitch = copyLines.map(el => {
      const spans = el.querySelectorAll(":scope > span");
      if (spans.length > 1) return spans[1].getBoundingClientRect().top - spans[0].getBoundingClientRect().top;
      return spans.length ? spans[0].getBoundingClientRect().height + 20 : 0;
    });
    // Boxes side by side share one row's growth, so each row counts once
    const rows = els => new Set(els.map(el => Math.round(el.getBoundingClientRect().top / 8))).size;
    const shares = rows(copyDraws) * 3 + rows(copyLines);
    box.remove();
    const apply = spare => {
      const unit = spare / shares;
      draws.forEach((el, i) => { el.style.height = `${Math.round(drawH[i] + Math.min(unit * 3, 120 * MM))}px`; el.style.minHeight = "0"; el.style.flex = "none"; });
      lines.forEach((el, i) => {
        const more = pitch[i] > 4 ? Math.min(8, Math.floor(unit / pitch[i])) : 0;
        el.insertAdjacentHTML("beforeend", '<span class="ws-grown"></span>'.repeat(more));
      });
    };
    const undo = () => {
      draws.forEach(el => { el.style.height = el.style.minHeight = el.style.flex = ""; });
      lines.forEach(el => el.querySelectorAll(":scope > .ws-grown").forEach(x => x.remove()));
    };
    const FULL = PAGE_H * 0.985;
    let spare = FULL - h;
    for (let tries = 0; tries < 6 && spare > 10; tries++, spare *= 0.75) {
      apply(spare);
      if (measure() <= FULL) break;
      undo();
    }
    // Paper still spare (lines only come whole, and the shares above are cautious) goes to the
    // drawing boxes lowest on the page, so the box reaches down to the lines and footer below it
    const lowest = Math.max(...drawRow, -Infinity);
    const last = draws.filter((_, i) => drawRow[i] === lowest);
    const heightOf = el => parseFloat(el.style.height) || drawH[draws.indexOf(el)];
    for (let tries = 0; tries < 4 && last.length; tries++) {
      const gap = FULL - measure();
      if (gap < 3) break;
      const before = last.map(heightOf);
      last.forEach((el, i) => { el.style.height = `${Math.round(before[i] + gap)}px`; el.style.minHeight = "0"; el.style.flex = "none"; });
      if (measure() > FULL) { last.forEach((el, i) => { el.style.height = `${before[i]}px`; }); break; }
    }
  }

  // Every printed sheet starts the same way: the PopSpell logo, its title, a line for the name and
  // date (or the details given), and Pip
  const brandHead = (title, line = "") => `<header class="ws-brand"><img class="ws-logo" src="assets/brand/wordmark-print.webp" alt="PopSpell">
    <div class="ws-brand-text"><h1>${esc(title)}</h1>${line ? `<p>${line}</p>` : ""}</div>
    <img class="ws-pip" src="assets/brand/pip-mascot-small.webp" alt=""></header>`;
  // Name and Date on one line with their write-on lines: each label stays with its line, so the
  // Date line never drops under the Name and pushes the sheet down
  const nameDate = (who = "") => `<span class="ws-nd"><b>Name:</b> ${who ? `<span class="ws-nd-who">${esc(who)}</span>` : '<span class="ws-fill ws-fill-name"></span>'}</span>
    <span class="ws-nd"><b>Date:</b> <span class="ws-fill ws-fill-date"></span></span>`;
  const sheetHead = (title, who, extra = "") => brandHead(title, `${nameDate(!who || who === "Everyone" ? "" : who)} ${extra}`);

  // Any printed sheet in its age look: bigger and friendlier for younger pupils, plainer for older
  // ones (no mascot). The sheet's content is unchanged.
  const ageLook = (html, band) => (!html ? html : `<div class="ws-age ws-age-${band}">${band === "older" ? html.replace(/<img class="ws-pip"[^>]*>/g, "") + (/pp-working|ws-practice|ps-sheet/.test(html) ? "" : `<div class="pp-working"><b>Working out and notes</b></div>`) : html}</div>`);

  return { MM, PAGE_W, PAGE_H, FOOT, fitPages, growSpaces, brandHead, nameDate, sheetHead, ageLook, esc };
})();
