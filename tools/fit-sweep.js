/* A4 fit sweep: checks every printable sheet's pages fit one A4 page each (186 × 273 mm of content).
   It needs a browser, so it runs in the preview, not on GitHub:
     1. Open _test.html?as=owner#/teacher and the 📚 Library tab.
     2. In the console: await fetch("tools/fit-sweep.js").then(r => r.text()).then(eval)
     3. __sweep("paper") (or "lesson", "spelling", "activity") lists anything over a page.
   Each page is measured as a % of an A4 page. Letter formation is two pages on purpose (about 178%). */
(() => {
  const W = 186 * 96 / 25.4, H = 273 * 96 / 25.4;
  // Opens one entry's print preview (with its answers), measures each page, then closes it
  window.__over = id => {
    const b = [...document.querySelectorAll(`[data-print="${CSS.escape(id)}"]`)].find(x => !x.closest("dialog"));
    if (!b) return { id, out: [], err: "missing" };
    b.click();
    const d = document.querySelector("dialog.worksheet-preview[open]");
    const tick = d && d.querySelector("[data-answers]:not(:disabled), [data-words]:not(:disabled)");
    if (tick && !tick.checked && tick.closest("label").style.display !== "none") { tick.checked = true; tick.dispatchEvent(new Event("change")); }
    const page = d.querySelector(".sheet-preview-page");
    const cls = [...page.classList].filter(c => c !== "sheet-preview-page").join(" ");
    const out = [...page.querySelectorAll(":scope > .ws-page")].map(p => {
      const box = document.createElement("section");
      box.className = `sheet-preview-page ws-measure ${cls}`;
      box.innerHTML = p.innerHTML;
      Object.assign(box.style, { position: "absolute", left: "-10000px", top: "0", width: `${W}px`, padding: "0", margin: "0", minHeight: "0", boxShadow: "none" });
      document.body.append(box);
      const h = box.scrollHeight * parseFloat(p.style.zoom || 1);
      box.remove();
      return Math.round((h / H) * 100);
    });
    const codes = [...page.querySelectorAll(".ws-code")].map(e => e.textContent);
    d.close(); d.remove();
    return { id, out, codes: new Set(codes).size, ncode: codes.length };
  };
  // Every Library entry of one type, at whatever level and curriculum the Library is showing
  window.__ids = type => {
    const sel = document.querySelector("#libType");
    sel.value = type; sel.dispatchEvent(new Event("change", { bubbles: true }));
    return [...document.querySelectorAll("[data-print]")].filter(b => !b.closest("dialog")).map(b => b.dataset.print);
  };
  // Anything with a page over 100% (letter formation's two pages excepted), or a single sheet with
  // mixed sheet codes (a ready lesson's pack has several sheets, each with its own code)
  window.__sweep = type => {
    const bad = [];
    const ids = __ids(type);
    for (const id of ids) {
      try {
        const x = __over(id);
        const twoPages = /^(letter-formation|lesson-early-forming-lowercase-letters)$/.test(id);
        if (x.err || x.out.some(h => h > 100) && !twoPages || (type !== "lesson" && x.ncode && x.codes !== 1)) bad.push(x);
      } catch (e) { bad.push({ id, err: String(e) }); }
    }
    return { type, checked: ids.length, bad };
  };
  return "fit sweep ready: __sweep(\"paper\")";
})();
