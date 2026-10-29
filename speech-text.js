/* How PopSpell turns a spoken line into Eponine recordings. The site (app.js) plays the pieces;
   tools/activity_lines.mjs uses the same rules to list every piece tools/make_audio.py records.

   A line without numbers is one recording (audio/lines/<key>.mp3). A line with numbers is the
   words between them (audio/lines/…) plus each number built from number words
   (audio/numbers/…): 583 is five · hundred · and · eighty · three. */
(function () {
  const tidy = text => String(text || "").replace(/\s+/g, " ").trim();

  // How a written question sounds read out: symbols and units become words, so "3 + ? = 10" is
  // "3 add what equals 10"
  const speakable = text => tidy(String(text || "")
    .replace(/_{2,}/g, " blank ").replace(/(^|\s)\?(?=\s|$|\/)/g, "$1what")
    .replace(/×/g, " times ").replace(/÷/g, " divided by ").replace(/−/g, " take away ").replace(/\+/g, " add ")
    .replace(/=\s*$/, " makes what?").replace(/=/g, " equals ").replace(/(\d)\/(\d)/g, "$1 over $2")
    .replace(/£1\b(?!\.)/g, "1 pound").replace(/£(\d+(?:\.\d+)?)/g, "$1 pounds")
    .replace(/\bkg\b/g, "kilograms").replace(/\bcm\b/g, "centimetres").replace(/\bmm\b/g, "millimetres")
    .replace(/\bkm\b/g, "kilometres").replace(/\bml\b/g, "millilitres").replace(/(\d)p\b/g, "$1 pence").replace(/(\d)\s?%/g, "$1 percent")
    .replace(/°C/g, " degrees").replace(/(\d)\s?cm\b/g, "$1 centimetres").replace(/(\d)\s?mm\b/g, "$1 millimetres")
    .replace(/(\d)\s?km\b/g, "$1 kilometres").replace(/(\d)\s?kg\b/g, "$1 kilograms").replace(/(\d)\s?ml\b/g, "$1 millilitres")
    .replace(/(\d)\s?m\b/g, "$1 metres").replace(/(\d)\s?g\b/g, "$1 grams").replace(/(\d)\s?l\b/g, "$1 litres"));

  // Emoji aren't read out: 🔊 becomes "the speaker", the rest are dropped
  const forSpeech = text => tidy(String(text || "").replace(/🔊/g, "the speaker")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, ""));

  // What's said when a pupil runs out of tries
  const answerLine = q => forSpeech(`The answer is ${speakable(q.answer)}${/[.!?]$/.test(String(q.answer)) ? "" : "."} ${q.kind === "dictation" ? "" : speakable(q.explain || "")}`);

  // The words alone, for naming and matching recordings: capitals and punctuation don't count,
  // so "circle" and "Circle." are one recording. Keep in step with said() in tools/make_audio.py
  const said = text => String(text || "").toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
  // A short, stable name for each recorded piece of text (FNV-1a of its words)
  const keyOf = text => {
    let h = 0x811c9dc5;
    for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(16).padStart(8, "0");
  };

  // A number as recorded number words: 4755 → 4 thousand 7 hundred and 50 5; 0.25 → 0 point 2 5
  function numberParts(str) {
    if (str.includes(".")) {
      const [whole, decimals] = str.split(".");
      return numberParts(whole).concat("point", decimals.split(""));
    }
    let n = Number(str);
    if (!Number.isInteger(n) || n > 999999) return null;
    const upTo999 = m => {
      const p = [];
      if (m >= 100) { p.push(String(Math.floor(m / 100)), "hundred"); m %= 100; if (m) p.push("and"); }
      if (m >= 20) { p.push(String(m - (m % 10))); if (m % 10) p.push(String(m % 10)); }
      else if (m > 0 || !p.length) p.push(String(m));
      return p;
    };
    const out = [];
    if (n >= 1000) {
      out.push(...upTo999(Math.floor(n / 1000)), "thousand");
      n %= 1000;
      if (!n) return out;
      if (n < 100) out.push("and");
    }
    return out.concat(upTo999(n));
  }
  const NUMBER_WORDS = Object.assign(
    Object.fromEntries(["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
      "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"].map((w, i) => [String(i), w])),
    Object.fromEntries(["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"].map((w, i) => [String((i + 2) * 10), w])),
    { hundred: "hundred", thousand: "thousand", and: "and", point: "point" });

  // The pieces of a line, in order: { text, key } for words, { number: [parts] } for numbers.
  // Each sentence is its own piece (so an explanation is recorded once, not after every answer),
  // and so is "The answer is". Pieces that are only punctuation aren't said.
  function pieces(line) {
    const out = [];
    for (const sentence of tidy(line).split(/(?<=[.!?]["”]?)\s+(?=["“]?[A-Z0-9])/)) {
      const lead = sentence.match(/^The answer is (?=\S)/);
      if (lead) out.push({ text: "The answer is", key: keyOf(said("The answer is")) });
      const rest = numberedPieces(lead ? sentence.slice(lead[0].length) : sentence);
      if (!rest) return null;
      out.push(...rest);
    }
    return out;
  }
  function numberedPieces(text) {
    const out = [];
    let last = 0;
    for (const m of text.matchAll(/\d+(?:\.\d+)?/g)) {
      const before = text.slice(last, m.index).trim();
      if (/[a-z]/i.test(before)) out.push({ text: before, key: keyOf(said(before)) });
      const parts = numberParts(m[0]);
      if (!parts) return null; // too big to build: the device voice says it
      out.push({ number: parts });
      last = m.index + m[0].length;
    }
    const rest = text.slice(last).trim();
    if (/[a-z]/i.test(rest)) out.push({ text: rest, key: keyOf(said(rest)) });
    return out;
  }

  const api = { speakable, forSpeech, answerLine, said, keyOf, numberParts, pieces, NUMBER_WORDS };
  (typeof window !== "undefined" ? window : globalThis).PopSpeech = api;
})();
