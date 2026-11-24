  /* ===================== Quick drills: Third and Fourth level =====================
     The same one-page shape as the Early to Second drills (10-quick-drills.js), for older pupils:
     the harder spelling rules, word meaning in a short text, sentence building and punctuation,
     and reading for bias and word choice. Every word and text is PopSpell's own. */

  const meaningRow = (label, opts) => `<span class="qd-opts">${label}${opts.map(o => `<span class="qd-pick">${o}</span>`).join("")}</span>`;

  // ---------- Third level ----------

  add("paper-drill-number-prefixes", "lesson-third-spelling-specialist-and-tricky-words-accurately", "Quick drill: number prefixes",
    "Prefixes that count (uni, bi, tri, quad, oct, cent, multi): underline them, say what number they mean, and build words from definitions.", (who, h) => {
      const PRE = { uni: "one", mono: "one", bi: "two", tri: "three", quad: "four", oct: "eight", dec: "ten", cent: "a hundred", multi: "many" };
      const SPOT = ["unicycle", "monorail", "biannual", "tripod", "quadruple", "octopus", "decade", "century", "multicoloured", "bilingual", "triangle", "uniform",
        "monologue", "quadrilateral", "octagon", "centipede", "multistorey", "decathlon"];
      const spot = pickN(SPOT, 9).map(w => [w, Object.keys(PRE).find(p => w.startsWith(p))]);
      const BUILD = [["having one common form", "uni", "form"], ["a vehicle with two wheels", "bi", "cycle"], ["able to speak two languages", "bi", "lingual"],
        ["a shape with three sides", "tri", "angle"], ["a speech by one person", "mono", "logue"], ["a shape with eight sides", "oct", "agon"],
        ["a period of ten years", "dec", "ade"], ["a hundred years", "cent", "ury"], ["with many colours", "multi", "coloured"], ["a stand with three legs", "tri", "pod"],
        ["four times as much", "quad", "ruple"], ["a rail with one track", "mono", "rail"]];
      const build = pickN(BUILD.filter(b => !spot.some(([w]) => w === b[1] + b[2])), 6);
      return {
        pupil: `${drillHead(h, "Number prefixes", who, "Third")}
        <div class="pp-box qd-rule"><b>Some prefixes count</b><p>${Object.entries(PRE).map(([p, n]) => `<b>${p}</b> = ${n}`).join(" &nbsp; · &nbsp; ")}</p></div>
        ${task(1, "Underline the prefix in each word, then write the number it means.")}
        <div class="qd-rows qd-three">${spot.map(([w]) => `<div class="qd-row"><span class="qd-say">${w}</span> ${blank(4)}</div>`).join("")}</div>
        ${task(2, "Write the prefix and the whole word that match each definition.")}
        <table class="pp-table qd-prefix"><thead><tr><th>Definition</th><th>Prefix</th><th>Root</th><th>Whole word</th></tr></thead>
          <tbody>${build.map(([d, , r]) => `<tr><td>${d}</td><td></td><td>${r}</td><td></td></tr>`).join("")}</tbody></table>
        ${task(3, "Think of one more word for any two of the prefixes. Use each in a sentence.")}${lines(2)}`,
        answers: answersPage(h, "Number prefixes", spot.map(([w, p]) => `<b>${p}</b>${w.slice(p.length)}: ${PRE[p]}`).concat(build.map(([d, p, r]) => `${d}: <b>${p}</b> + ${r} = <b>${p}${r}</b>`)),
          "The first nine are task 1. Task 3: any real word that uses the prefix with its number meaning (bicentenary, triplet, monotone…).")
      };
    });

  add("paper-drill-suffix-rules", "lesson-third-spelling-specialist-and-tricky-words-accurately", "Quick drill: adding suffixes",
    "Add suffixes such as -able, -ful, -ity, -ness, -ment and -ous using the y to i, drop the e and doubling rules, then use the new words.", (who, h) => {
      const SUM = [["happy", "ness", "happiness"], ["plenty", "ful", "plentiful"], ["rely", "able", "reliable"], ["beauty", "ful", "beautiful"], ["vary", "ous", "various"],
        ["adore", "able", "adorable"], ["fame", "ous", "famous"], ["secure", "ity", "security"], ["value", "able", "valuable"], ["popular", "ity", "popularity"],
        ["enjoy", "ment", "enjoyment"], ["hope", "ful", "hopeful"], ["forget", "able", "forgettable"], ["begin", "er", "beginner"], ["equip", "ment", "equipment"],
        ["adapt", "able", "adaptable"], ["lazy", "ness", "laziness"], ["pity", "ful", "pitiful"], ["care", "less", "careless"], ["admire", "ation", "admiration"]];
      const sums = pickN(SUM, 10);
      const CHOOSE = [["The old map was very", ["valuable", "valueable"], 0], ["She showed great", ["couragous", "courageous"], 1], ["The weather here is", ["changeable", "changable"], 0],
        ["He gave a", ["truthful", "truthfull"], 0], ["The rules caused a lot of", ["argument", "arguement"], 0], ["The puppy was", ["adoreable", "adorable"], 1]];
      const choose = pickN(CHOOSE, 4);
      return {
        pupil: `${drillHead(h, "Adding suffixes", who, "Third")}
        <div class="pp-box qd-rule"><b>Suffix rules</b><p>Consonant + y: change y to <b>i</b> (happy → happiness), but keep y before -ing.
          Ends in e and the suffix starts with a vowel: drop the <b>e</b> (fame → famous); keep it after soft c or g (courage → courageous) and before a consonant (hope → hopeful).
          Stressed last syllable ending in one vowel + one consonant: <b>double</b> it (forget → forgettable).</p></div>
        ${task(1, "Add the suffix. Write the new word.")}
        <div class="qd-rows qd-two">${sums.map(([b, s]) => `<div class="qd-row"><span class="qd-say">${b} + ${s}</span> = ${blank(8)}</div>`).join("")}</div>
        ${task(2, "Circle the correct spelling.")}
        <ol class="qd-list">${choose.map(([s, o]) => `<li>${meaningRow(`${s} `, o)}</li>`).join("")}</ol>
        ${task(3, "Use two of your new words from task 1 in one sentence.")}${lines(2)}`,
        answers: answersPage(h, "Adding suffixes", sums.map(([b, s, w]) => `${b} + ${s} = <b>${w}</b>`).concat(choose.map(([s, o, k]) => `${s} <b>${o[k]}</b>`)),
          "Ask which rule each word used. Mistakes cluster: y to i, the dropped e, or doubling.")
      };
    });

  add("paper-drill-homophones", "lesson-third-editing-and-layout-that-helps-the-reader", "Quick drill: homophones",
    "Words that sound the same but are spelt differently (their, there, they're; affect, effect): choose the right one, then correct a short paragraph.", (who, h) => {
      const S = [["___ going to be late.", ["Their", "There", "They're"], 2], ["Leave your bags over ___.", ["their", "there", "they're"], 1], ["The team lost ___ match.", ["their", "there", "they're"], 0],
        ["Is this ___ coat?", ["your", "you're"], 0], ["___ the tallest in the class.", ["Your", "You're"], 1], ["The dog wagged ___ tail.", ["its", "it's"], 0], ["___ been raining all day.", ["Its", "It's"], 1],
        ["I don't know ___ to laugh or cry.", ["weather", "whether"], 1], ["The cold ___ the crops.", ["affected", "effected"], 0], ["The medicine had no ___.", ["affect", "effect"], 1],
        ["She was ___ tired to walk.", ["to", "too", "two"], 1], ["I ___ the ball over the fence.", ["threw", "through"], 0], ["We walked ___ the forest.", ["threw", "through"], 1],
        ["Please be ___ in the library.", ["quiet", "quite"], 0], ["The film was ___ good.", ["quiet", "quite"], 1], ["He ___ the race easily.", ["one", "won"], 1]];
      const rows = pickN(S, 10);
      const PARA = [["Their going to the park after school, but its to cold to stay long. Your welcome to join them if you bring you're coat.",
        "They're going to the park after school, but it's too cold to stay long. You're welcome to join them if you bring your coat.", 5],
        ["The whether was so bad that the match was cancelled. The team new there coach would be disappointed, but it was the right choice for they're safety.",
        "The weather was so bad that the match was cancelled. The team knew their coach would be disappointed, but it was the right choice for their safety.", 4]];
      const para = pick(PARA);
      return {
        pupil: `${drillHead(h, "Homophones", who, "Third")}
        ${task(1, "Circle the word that fits.")}
        <ol class="qd-list qd-cols2">${rows.map(([s, o]) => `<li>${s.replace("___", blank(3))}<br>${o.map(x => `<span class="qd-pick">${x}</span>`).join("")}</li>`).join("")}</ol>
        ${task(2, `This paragraph has ${para[2]} homophone mistakes. Underline them, then write it out correctly.`)}
        <div class="pp-passage">${para[0]}</div>${lines(3)}`,
        answers: answersPage(h, "Homophones", rows.map(([s, o, k]) => s.replace("___", `<b>${o[k]}</b>`)).concat([para[1]]),
          "Quick checks to teach: they're and you're can be read as they are and you are; it's as it is or it has; affect is usually the verb, effect the noun.")
      };
    });

  add("paper-drill-complex-sentences", "lesson-third-sentences-punctuation-and-paragraphs", "Quick drill: although, unless, while",
    "Join ideas into complex sentences with subordinating conjunctions (although, because, unless, while, since, when), with a comma when the clause comes first.", (who, h) => {
      const P = [["I enjoyed the film", "it was very long", "although"], ["We will miss the bus", "we leave now", "unless"], ["Dad cooked dinner", "I set the table", "while"],
        ["The match was cancelled", "the pitch was flooded", "because"], ["I have lived here", "I was five", "since"], ["You can go out", "you have finished your homework", "when"],
        ["She kept running", "her legs ached", "although"], ["The plant will die", "you water it", "unless"], ["I read a book", "I waited for the train", "while"],
        ["Our team won", "we practised every day", "because"]];
      const rows = pickN(P, 6);
      const FRONT = pickN(P.filter(p => !rows.includes(p)), 3);
      const cap = s => s[0].toUpperCase() + s.slice(1), low = s => (/^I\b/.test(s) ? s : s[0].toLowerCase() + s.slice(1));
      return {
        pupil: `${drillHead(h, "Although, unless, while", who, "Third")}
        <div class="pp-box qd-rule"><b>Complex sentences</b><p>A subordinating conjunction starts a clause that can't stand alone: <b>although, because, unless, while, since, when, if, until</b>.
          When that clause comes first, put a comma after it: <i>Although it rained, we played outside.</i></p></div>
        ${task(1, "Choose the best conjunction to fill each gap.")}
        <p class="qd-bank">although · unless · while · because · since · when</p>
        <ol class="qd-list">${rows.map(([a, b]) => `<li>${a} ${blank(6)} ${b}.</li>`).join("")}</ol>
        ${task(2, "Write each pair as one sentence, starting with the conjunction. Remember the comma.")}
        ${FRONT.map(([a, b, c]) => `<p class="qd-copy">${a}. ${cap(b)}. <i>(${c})</i></p>${lines(1)}`).join("")}`,
        answers: answersPage(h, "Although, unless, while", rows.map(([a, b, c]) => `${a} <b>${c}</b> ${b}.`).concat(FRONT.map(([a, b, c]) => `${cap(c)} ${b}, ${low(a)}.`)),
          "Task 1: accept another conjunction if the meaning works (when / while). Task 2: check the comma after the first clause.")
      };
    });

  add("paper-drill-word-meaning", "lesson-third-close-reading-purpose-inference-and-language", "Quick drill: words in a text",
    "A short text with harder words: choose the best meaning from the text, give synonyms, split words into syllables and circle suffixes.", (who, h) => {
      const TEXTS = [
        { title: "The night ferry", text: "The ferry left the harbour just after midnight. Mara stood on the deck, gripping the cold rail as the lights of the town grew faint. The sea was <u>tranquil</u> at first, but soon a <u>relentless</u> wind began to rise. Passengers hurried inside, clutching their bags. Mara stayed, <u>fascinated</u> by the white spray. By the time the island appeared, a pale glow was <u>gradually</u> spreading across the sky.",
          mean: [["tranquil", ["calm and still", "very deep", "freezing cold"], 0], ["relentless", ["gentle", "never stopping", "sudden"], 1]],
          syn: [["faint", "dim, weak"], ["clutching", "gripping, holding tightly"]], syl: ["fascinated", "gradually", "passengers"], suf: ["gradually", "relentless", "fascinated"] },
        { title: "The allotment", text: "Grandad's allotment looked <u>neglected</u> when he first took it on: brambles everywhere and a shed with half a roof. He worked on it every weekend, <u>persistent</u> even in the rain. By the second summer it was <u>abundant</u> with beans, potatoes and enormous marrows. Neighbours stopped to admire it, and Grandad, usually so <u>modest</u>, could not hide his pride.",
          mean: [["neglected", ["not looked after", "very small", "recently built"], 0], ["abundant", ["empty", "full of plenty", "expensive"], 1]],
          syn: [["enormous", "huge, vast"], ["admire", "look at with approval, praise"]], syl: ["persistent", "neighbours", "enormous"], suf: ["neglected", "usually", "persistent"] },
        { title: "The museum visit", text: "The class filed into the museum hall in silence. Above them hung the <u>immense</u> skeleton of a whale, its bones pale and <u>fragile</u>. A guide explained that the whale had been found on a beach over a hundred years ago. Jonah felt <u>insignificant</u> beneath it. He took out his notebook and began sketching, <u>determined</u> to remember every detail.",
          mean: [["immense", ["very old", "extremely large", "very heavy"], 1], ["fragile", ["easily broken", "very white", "strong"], 0]],
          syn: [["explained", "described, told"], ["sketching", "drawing"]], syl: ["skeleton", "insignificant", "determined"], suf: ["explained", "sketching", "insignificant"] }];
      const t = pick(TEXTS);
      const SUF = /(ly|ing|ed|ness|ful|less|ent|ant|ous|ive|ion|able)$/;
      return {
        pupil: `${drillHead(h, "Words in a text", who, "Third")}
        ${task(1, `Read “${t.title}”.`)}<div class="pp-passage">${t.text}</div>
        ${task(2, "Circle the best meaning of each word as it is used in the text.")}
        <ol class="qd-list">${t.mean.map(([w, o]) => `<li><b>${w}</b>: ${o.map(x => `<span class="qd-pick">${x}</span>`).join("")}</li>`).join("")}</ol>
        ${task(3, "Write a synonym for each word.")}
        <div class="qd-rows qd-two">${t.syn.map(([w]) => `<div class="qd-row"><span class="qd-say">${w}</span> ${blank(9)}</div>`).join("")}</div>
        ${task(4, "Split each word into syllables (fas/ci/nat/ed).")}
        <div class="qd-rows qd-three">${t.syl.map(w => `<div class="qd-row"><span class="qd-say">${w}</span> ${blank(7)}</div>`).join("")}</div>
        ${task(5, `Circle the suffix in: <b>${t.suf.join(" &nbsp; · &nbsp; ")}</b>`)}
        ${task(6, "Find another underlined word. What does it tell you about the place or the person?")}${lines(2)}`,
        answers: answersPage(h, `Words in a text: ${t.title}`, t.mean.map(([w, o, k]) => `${w}: <b>${o[k]}</b>`)
          .concat(t.syn.map(([w, s]) => `${w}: <b>${s}</b> (or any word with the same meaning)`))
          .concat([`Syllables: ${t.syl.map(w => ({ fascinated: "fas/ci/nat/ed", gradually: "grad/u/al/ly", passengers: "pas/sen/gers", persistent: "per/sis/tent", neighbours: "neigh/bours", enormous: "e/nor/mous", skeleton: "skel/e/ton", insignificant: "in/sig/nif/i/cant", determined: "de/ter/mined" })[w] || w).join(", ")}`,
            `Suffixes: ${t.suf.map(w => { const m = w.match(SUF); return m ? `${w.slice(0, -m[1].length)}<b>${m[1]}</b>` : w; }).join(", ")}`]),
          "Task 2: the clue is in the sentence around the word; ask the pupil which words helped. Syllable splits can vary a little.")
      };
    });

  add("paper-drill-cause-effect", "lesson-third-reading-fluently-and-using-reading-strategies", "Quick drill: cause and effect",
    "Match causes to their effects, then link them with because, as a result, therefore and so that.", (who, h) => {
      const CE = [["The river burst its banks", "the town centre flooded"], ["The factory closed", "many people lost their jobs"], ["She trained every morning", "she won the race"],
        ["The bridge was icy", "a lorry skidded off the road"], ["The ticket prices went up", "fewer people came to the concert"], ["The power went off", "the freezer began to defrost"],
        ["Bees are disappearing", "some crops are not being pollinated"], ["He forgot his password", "he could not log in"], ["The road was closed", "the bus took a longer route"]];
      const rows = pickN(CE, 5), effects = shuffle(rows.map(([, e]) => e));
      const LINK = pickN(CE.filter(c => !rows.includes(c)), 3);
      const linkers = ["As a result,", "Therefore,", "because"];
      return {
        pupil: `${drillHead(h, "Cause and effect", who, "Third")}
        <div class="pp-box qd-rule"><b>Cause and effect</b><p>The <b>cause</b> is why something happens. The <b>effect</b> is what happens. Writers link them with
          <b>because, so, as a result, therefore, due to, which meant that</b>.</p></div>
        ${task(1, "Match each cause to its effect. Write the letter.")}
        <div class="qd-ce">${rows.map(([c], i) => `<span>${i + 1}. ${c}</span><span class="qd-cell qd-gap qd-mark"></span><span>${"ABCDE"[i]}. ${effects[i]}</span>`).join("")}</div>
        ${task(2, "Join each cause and effect into one or two sentences, using the linking words given.")}
        ${LINK.map(([c, e], i) => `<p class="qd-copy">${c} / ${e} <i>(${linkers[i]})</i></p>${lines(1)}`).join("")}`,
        answers: answersPage(h, "Cause and effect", rows.map(([c, e], i) => `${i + 1} → <b>${"ABCDE"[effects.indexOf(e)]}</b> (${e})`)
          .concat(LINK.map(([c, e], i) => i === 2 ? `${e[0].toUpperCase() + e.slice(1)} <b>because</b> ${c[0].toLowerCase() + c.slice(1)}.` : `${c}. <b>${linkers[i]}</b> ${e}.`)),
          "Task 2 with because puts the effect first. Check that the pupil can say which part is the cause.")
      };
    });

  // ---------- Fourth level ----------

  add("paper-drill-roots", "lesson-fourth-independent-spelling-accuracy", "Quick drill: Greek and Latin roots",
    "Use word roots (bio, graph, tele, port, scrib, aud, dict, chron, geo, phon) to work out and spell unfamiliar words.", (who, h) => {
      const R = { bio: "life", graph: "write, draw", tele: "far", port: "carry", scrib: "write", aud: "hear", dict: "say", chron: "time", geo: "earth", phon: "sound",
        spect: "look", rupt: "break", struct: "build", vis: "see" };
      const WORDS = [["biography", ["bio", "graph"]], ["telephone", ["tele", "phon"]], ["portable", ["port"]], ["inscription", ["scrib"]], ["audience", ["aud"]],
        ["prediction", ["dict"]], ["chronological", ["chron"]], ["geography", ["geo", "graph"]], ["spectator", ["spect"]], ["eruption", ["rupt"]], ["construct", ["struct"]],
        ["visible", ["vis"]], ["transport", ["port"]], ["autograph", ["graph"]], ["dictionary", ["dict"]], ["synchronise", ["chron"]], ["microphone", ["phon"]], ["television", ["tele", "vis"]]];
      const roots = pickN(Object.keys(R), 6);
      const words = pickN(WORDS, 6);
      const GUESS = [["A chronometer is a device that measures…", "time"], ["Audible means able to be…", "heard"], ["A biologist studies…", "living things"],
        ["Something disruptive breaks up…", "order or an activity"], ["Geology is the study of the…", "earth (rocks)"], ["Retrospective means looking…", "back"]];
      const guess = pickN(GUESS, 3);
      return {
        pupil: `${drillHead(h, "Greek and Latin roots", who, "Fourth")}
        ${task(1, "Write what each root means. Then write one word that uses it.")}
        <table class="pp-table qd-roots"><thead><tr><th>Root</th><th>Meaning</th><th>A word with it</th></tr></thead>
          <tbody>${roots.map(r => `<tr><td><b>${r}</b></td><td></td><td></td></tr>`).join("")}</tbody></table>
        <p class="qd-example">Roots to choose meanings from: ${shuffle(roots.map(r => R[r])).join(" · ")}</p>
        ${task(2, "Underline the root (or roots) in each word and explain the word's meaning using the root.")}
        <div class="qd-rows qd-two">${words.map(([w]) => `<div class="qd-row"><span class="qd-say">${w}</span> ${blank(9)}</div>`).join("")}</div>
        ${task(3, "Use the root to finish each definition.")}
        <ol class="qd-list">${guess.map(([g]) => `<li>${g} ${blank(9)}</li>`).join("")}</ol>`,
        answers: answersPage(h, "Greek and Latin roots", roots.map(r => `<b>${r}</b>: ${R[r]}`).concat(words.map(([w, rs]) => `${w}: <b>${rs.join(" + ")}</b> (${rs.map(r => R[r]).join(" + ")})`))
          .concat(guess.map(([g, a]) => `${g} <b>${a}</b>`)), "Any real word with the root counts in task 1. Explanations in task 2 should use the root's meaning.")
      };
    });

  add("paper-drill-tricky-plurals", "lesson-fourth-independent-spelling-accuracy", "Quick drill: tricky plurals",
    "Plurals that break the usual rules: -o words, -f words, words from Latin and Greek, compound nouns and nouns that don't change.", (who, h) => {
      const PL = [["volcano", "volcanoes"], ["studio", "studios"], ["piano", "pianos"], ["potato", "potatoes"], ["echo", "echoes"], ["chief", "chiefs"], ["thief", "thieves"],
        ["roof", "roofs"], ["half", "halves"], ["cactus", "cacti"], ["fungus", "fungi"], ["crisis", "crises"], ["analysis", "analyses"], ["phenomenon", "phenomena"],
        ["criterion", "criteria"], ["sister-in-law", "sisters-in-law"], ["passer-by", "passers-by"], ["sheep", "sheep"], ["series", "series"], ["aircraft", "aircraft"],
        ["mystery", "mysteries"], ["journey", "journeys"], ["appendix", "appendices"], ["medium", "media"]];
      const rows = pickN(PL, 12);
      const FIX = [["The scientist checked all the datas before writing her analysises.", "data · analyses"], ["Three thiefs climbed onto the roofs of the studioes.", "thieves · studios"],
        ["Both of my brother-in-laws grow potatos.", "brothers-in-law · potatoes"], ["The criterias for the competition were unclear.", "criteria"],
        ["We saw two volcanos and several cactuses.", "volcanoes · cacti (cactuses is also accepted)"]];
      const fix = pickN(FIX, 3);
      return {
        pupil: `${drillHead(h, "Tricky plurals", who, "Fourth")}
        <div class="pp-box qd-rule"><b>When s or es is not enough</b><p>Consonant + o often adds <b>es</b> (potatoes), vowel + o adds <b>s</b> (studios). Some f words take <b>ves</b> (halves), others just s (roofs).
          Latin and Greek words keep their own endings (cactus → cacti, crisis → crises, phenomenon → phenomena). Compound nouns pluralise the main word (sisters-in-law). Some never change (sheep).</p></div>
        ${task(1, "Write the plural.")}
        <div class="qd-rows qd-three">${rows.map(([s]) => `<div class="qd-row"><span class="qd-say">${s}</span> ${blank(6)}</div>`).join("")}</div>
        ${task(2, "Each sentence has plural mistakes. Write the correct plurals.")}
        <ol class="qd-list">${fix.map(([s]) => `<li>${s}<br>${blank(20)}</li>`).join("")}</ol>`,
        answers: answersPage(h, "Tricky plurals", rows.map(([s, p]) => `${s} → <b>${p}</b>`).concat(fix.map(([s, a]) => `${s} → <b>${a}</b>`)),
          "Some words have two accepted plurals (cactuses, funguses, mediums in some senses); accept them if the pupil can say so.")
      };
    });

  add("paper-drill-colons-semicolons", "lesson-fourth-sentences-and-punctuation-for-effect", "Quick drill: colons and semicolons",
    "Decide whether a sentence needs a colon, a semicolon or a comma, then write sentences that use each for effect.", (who, h) => {
      const S = [["The rain didn't stop ^ the match went ahead anyway.", ";"], ["You will need three things ^ a torch, a map and a whistle.", ":"],
        ["She had one goal ^ to win.", ":"], ["I love the coast ^ my brother prefers the mountains.", ";"], ["After the storm ^ the streets were covered in branches.", ","],
        ["The results were clear ^ the plan had worked.", ":"], ["Some people read on trains ^ others stare out of the window.", ";"], ["Although it was late ^ nobody wanted to leave.", ","],
        ["There was only one problem ^ nobody had the key.", ":"], ["The museum opens at nine ^ the café opens at ten.", ";"], ["We visited Paris, France ^ Rome, Italy; and Vienna, Austria.", ";"]];
      const rows = pickN(S, 8);
      return {
        pupil: `${drillHead(h, "Colons and semicolons", who, "Fourth")}
        <div class="pp-box qd-rule"><b>Colon or semicolon?</b><p>A <b>colon</b> introduces what comes next: a list, an explanation or a dramatic reveal. What comes before it is a full sentence.
          A <b>semicolon</b> joins two full sentences that are closely linked, or separates items in a list that already has commas.</p></div>
        ${task(1, "Write a colon, semicolon or comma in each box.")}
        <ol class="qd-list">${rows.map(([s]) => `<li>${s.replace(" ^ ", `<span class="qd-cell qd-gap qd-mark"></span> `)}</li>`).join("")}</ol>
        ${task(2, "Write your own sentences.")}
        <p class="qd-copy">A colon before a dramatic reveal:</p>${lines(1)}
        <p class="qd-copy">A semicolon joining two contrasting ideas:</p>${lines(1)}
        ${task(3, "Why might a writer choose a semicolon instead of a full stop? Explain in one sentence.")}${lines(1)}`,
        answers: answersPage(h, "Colons and semicolons", rows.map(([s, m]) => s.replace(" ^ ", `<b>${m}</b> `)),
          "Task 1: a full stop would also be correct where a semicolon is shown; the point is that a comma alone would not. Task 3: it shows the two ideas are closely linked or contrasting.")
      };
    });

  add("paper-drill-fact-opinion-bias", "lesson-fourth-bias-persuasion-and-credibility-in-what-i-read", "Quick drill: fact, opinion and bias",
    "Sort statements into fact and opinion, find the loaded words that show bias, and rewrite a biased sentence neutrally.", (who, h) => {
      const ST = [["The new leisure centre opened in March.", "F"], ["The new leisure centre is a shocking waste of money.", "O"], ["Over 2,000 people signed the petition.", "F"],
        ["Only a handful of selfish residents complained.", "O"], ["The bus fare will rise by 20p next year.", "F"], ["This greedy fare rise will hurt ordinary families.", "O"],
        ["Scotland has over 30,000 lochs.", "F"], ["Our town has the most beautiful beach in Scotland.", "O"], ["The council voted 7 to 5 in favour.", "F"],
        ["Everyone knows the plan is a disaster.", "O"]];
      const rows = pickN(ST, 8);
      const LOADED = [["Protesters stormed the meeting, shouting their ridiculous demands.", "stormed · ridiculous", "Protesters entered the meeting and called out their demands."],
        ["The heroic volunteers bravely rescued the helpless animals.", "heroic · bravely · helpless", "The volunteers rescued the animals."],
        ["The council has finally admitted its embarrassing mistake.", "finally · admitted · embarrassing", "The council has said the decision was a mistake."]];
      const loaded = pick(LOADED);
      return {
        pupil: `${drillHead(h, "Fact, opinion and bias", who, "Fourth")}
        <div class="pp-box qd-rule"><b>Spotting bias</b><p>A <b>fact</b> can be checked. An <b>opinion</b> is a view or judgement. <b>Bias</b> shows in loaded words that push you to feel one way, in what is left out, and in opinions presented as facts.</p></div>
        ${task(1, "Write F for fact or O for opinion.")}
        <ol class="qd-list">${rows.map(([s]) => `<li>${s}<span class="qd-cell qd-gap qd-mark"></span></li>`).join("")}</ol>
        ${task(2, "Underline the loaded words in this sentence.")}
        <div class="pp-passage">${loaded[0]}</div>
        ${task(3, "Rewrite it so it is neutral.")}${lines(1)}
        ${task(4, "Choose one opinion from task 1. What would you need to know to check whether it is fair?")}${lines(2)}`,
        answers: answersPage(h, "Fact, opinion and bias", rows.map(([s, a]) => `${s} <b>${a}</b>`).concat([`Loaded words: <b>${loaded[1]}</b>`, `Neutral, for example: ${loaded[2]}`]),
          "A fact can be wrong and still be a fact statement (it can be checked). Task 4: look for evidence the pupil would ask for: costs, numbers, who says so.")
      };
    });

  add("paper-drill-word-choice", "lesson-fourth-close-reading-detailed-analysis-and-evaluation", "Quick drill: word choice",
    "Analyse a writer's word choice: what a word suggests (connotation), its effect on the reader, and how changing it would change the meaning.", (who, h) => {
      const TEXTS = [
        { title: "The city at dawn", text: "The city <u>crawled</u> awake. Buses <u>groaned</u> along the empty streets, and the first commuters <u>shuffled</u> towards the station, clutching coffee like a lifeline. Above them, the office towers stood <u>cold and indifferent</u>, their windows still dark.",
          words: [["crawled", "slow, reluctant, like an animal or a baby; the city is tired"], ["groaned", "the buses seem to complain, like tired people; it is noisy and effortful"], ["shuffled", "people are slow and sleepy, not walking with purpose"], ["cold and indifferent", "the towers seem not to care about the people; a lonely, uncaring place"]],
          swap: ["walked", "shuffled"] },
        { title: "The storm", text: "By evening the storm had <u>arrived</u> in earnest. Wind <u>hurled</u> rain against the windows, and the old oak at the end of the garden <u>writhed</u> as if in pain. Somewhere a gate <u>slammed</u>, again and again, like someone trying to get in.",
          words: [["hurled", "violent and deliberate, as if the wind is attacking"], ["writhed", "twisting in pain; the tree is personified and seems to suffer"], ["slammed", "loud, sudden, aggressive; creates tension"], ["like someone trying to get in", "a simile that makes the noise threatening"]],
          swap: ["moved", "writhed"] }];
      const t = pick(TEXTS), ws = pickN(t.words, 3);
      return {
        pupil: `${drillHead(h, "Word choice", who, "Fourth", 15)}
        <div class="pp-box qd-rule"><b>Analysing word choice</b><p>Quote the word, say what it <b>suggests</b> (its connotations), then say the <b>effect</b> on the reader. Avoid "it makes you want to read on".</p></div>
        ${task(1, `Read “${t.title}”.`)}<div class="pp-passage">${t.text}</div>
        ${task(2, "For each underlined word, write what it suggests and its effect.")}
        <table class="pp-table qd-tall"><thead><tr><th>Word</th><th>What it suggests</th><th>Effect on the reader</th></tr></thead>
          <tbody>${ws.map(([w]) => `<tr><td><b>${w}</b></td><td></td><td></td></tr>`).join("")}</tbody></table>
        ${task(3, `If the writer had used <b>${t.swap[0]}</b> instead of <b>${t.swap[1]}</b>, what would be lost?`)}${lines(2)}
        ${task(4, "What mood does the whole paragraph create? Give one piece of evidence.")}${lines(2)}`,
        answers: lookForPage(h, `Word choice: ${t.title}`, ws.map(([w, a]) => `<b>${w}</b>: ${a}`).concat([`Task 3: ${t.swap[0]} is neutral; ${t.swap[1]} carries the feeling (tired, pained) the writer wants.`,
          "Task 4: a clear mood word (bleak, tense, weary, threatening) backed by a quotation and a comment on it."]),
          "Credit any well-explained connotation; the comment matters more than matching these words.")
      };
    });

  add("paper-drill-formal-register", "lesson-fourth-writing-reports-information-with-evidence", "Quick drill: formal or informal",
    "Spot informal language and rewrite it formally for a report: no contractions or slang, precise vocabulary, and the passive where it fits.", (who, h) => {
      const S = [["Loads of kids reckon the canteen food is rubbish.", "Many pupils consider the quality of the canteen food to be poor."],
        ["We asked a bunch of people and most of them said yes.", "A survey was carried out and the majority of respondents agreed."],
        ["The results were way better than we thought they'd be.", "The results were considerably better than expected."],
        ["It's pretty obvious the bins need emptying more.", "It is clear that the bins need to be emptied more often."],
        ["Tons of litter gets chucked on the field after lunch.", "A large amount of litter is dropped on the field after lunch."],
        ["Basically, the bus is always late so folk get annoyed.", "The bus is frequently late, which causes frustration among passengers."],
        ["We didn't get enough money to buy all the stuff.", "Insufficient funds were raised to purchase all the equipment."]];
      const rows = pickN(S, 4);
      const WORDS = [["get", "obtain / receive"], ["find out", "discover / establish"], ["a lot of", "a large number of / considerable"], ["kids", "children / young people"],
        ["show", "demonstrate / indicate"], ["help", "assist / support"], ["start", "begin / commence"], ["enough", "sufficient / adequate"], ["about", "approximately"], ["think", "consider / believe"]];
      const words = pickN(WORDS, 6);
      return {
        pupil: `${drillHead(h, "Formal or informal", who, "Fourth")}
        <div class="pp-box qd-rule"><b>Formal register</b><p>Formal writing avoids contractions (it's → it is), slang and chatty words (loads, stuff, basically). It uses precise vocabulary and often the passive voice (<i>a survey was carried out</i>) to keep the focus on the facts.</p></div>
        ${task(1, "Write a more formal word or phrase for each.")}
        <div class="qd-rows qd-three">${words.map(([w]) => `<div class="qd-row"><span class="qd-say">${w}</span> ${blank(6)}</div>`).join("")}</div>
        ${task(2, "Underline the informal language, then rewrite each sentence for a report.")}
        ${rows.map(([s]) => `<p class="qd-copy">${s}</p>${lines(1)}`).join("")}`,
        answers: answersPage(h, "Formal or informal", words.map(([w, f]) => `${w} → <b>${f}</b>`).concat(rows.map(([s, f]) => `For example: ${f}`)),
          "Task 2 has many right answers: check that contractions, slang and vague words have gone and the meaning is kept.")
      };
    });
