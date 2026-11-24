  /* ===================== Quick drills =====================
     Short one-page drills for a tutoring session, in the way Sara's tutoring sheets work: a strip
     that says it is a quick drill, a rule or word box where one helps, then two or three short tasks
     that practise one thing. Every word and sentence is PopSpell's own. Each print picks a fresh mix
     from the drill's pool, so the same drill can be done again next week, and the answers page
     always matches the sheet it came with. */

  const drillStrip = (level, mins = 10) => `<p class="qd-strip"><b>Quick drill</b><span>${level} level</span><span>About ${mins} minutes</span><span>Done ☐</span></p>`;
  const drillHead = (h, title, who, level, mins) => `${h.sheetHead(title, who)}${drillStrip(level, mins)}`;
  const task = (n, text) => `<p class="qd-task"><span class="qd-n">${n}</span> ${text}</p>`;
  const cells = (arr, cls = "") => `<span class="qd-cells ${cls}">${arr.map(c => `<span class="qd-cell${c === "" ? " qd-gap" : ""}">${c}</span>`).join("")}</span>`;
  const soundBoxes = n => `<span class="qd-cells">${"<span class=\"qd-cell qd-gap\"></span>".repeat(n)}</span>`;
  const pickN = (arr, n) => shuffle(arr).slice(0, n);
  const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

  // ---------- Early level ----------

  add("paper-drill-missing-letters", "lesson-early-letter-sounds-and-blending-to-read", "Quick drill: missing letters",
    "Fill the gaps in runs of the alphabet, small letters then capitals, and say each letter's sound. A fresh mix every print.", (who, h) => {
      const run = upper => {
        const start = rand(ALPHABET.length - 5), letters = [...ALPHABET.slice(start, start + 5)].map(c => upper ? c.toUpperCase() : c);
        const gaps = pickN([1, 2, 3, 4], 2);
        return { show: letters.map((c, i) => gaps.includes(i) ? "" : c), all: letters };
      };
      const rows = [false, false, false, true, true, true].map(run);
      const around = pickN([...ALPHABET.slice(1, 25)], 4);
      return {
        pupil: `${drillHead(h, "Missing letters", who, "Early")}
        ${task(1, "Write the missing letters. Say the sound of each letter as you go.")}
        <div class="qd-rows">${rows.map(r => `<div class="qd-row">${cells(r.show)}</div>`).join("")}</div>
        ${task(2, "Write the letter that comes before and the letter that comes after.")}
        <div class="qd-rows qd-two">${around.map(c => `<div class="qd-row">${cells(["", c, ""])}</div>`).join("")}</div>`,
        answers: answersPage(h, "Missing letters", rows.map(r => r.all.join(" ")).concat(around.map(c => {
          const i = ALPHABET.indexOf(c); return `${ALPHABET[i - 1]} ${c} ${ALPHABET[i + 1]}`;
        })), "Rows 1 to 6 are task 1; the last four are task 2. Listen for the sound as well as the letter name.")
      };
    });

  add("paper-drill-different-one", "lesson-early-reading-tricky-words", "Quick drill: circle the different one",
    "Look along each row and circle the one that is not the same: letters that look alike (b and d, p and q) and words that are easy to mix up (was and saw).", (who, h) => {
      const PAIRS = [["b", "d"], ["d", "b"], ["p", "q"], ["q", "p"], ["m", "n"], ["n", "u"], ["h", "n"], ["f", "t"], ["i", "j"],
        ["was", "saw"], ["on", "no"], ["it", "in"], ["my", "by"], ["the", "he"], ["pat", "tap"], ["dog", "bog"], ["and", "an"], ["big", "dig"], ["top", "pot"], ["of", "off"]];
      const rows = pickN(PAIRS, 8).map(([same, odd]) => { const at = rand(5); return { items: Array.from({ length: 5 }, (_, i) => i === at ? odd : same), at, odd }; });
      return {
        pupil: `${drillHead(h, "Circle the different one", who, "Early")}
        ${task(1, "Look along each row. Four are the same. Circle the one that is different.")}
        <ol class="qd-odd">${rows.map(r => `<li>${r.items.map(x => `<span>${x}</span>`).join("")}</li>`).join("")}</ol>
        ${task(2, "Pick two of the different ones. Write each one carefully.")}${ruled(h, 1)}`,
        answers: answersPage(h, "Circle the different one", rows.map(r => `<b>${r.odd}</b> (number ${r.at + 1} along)`),
          "If a pupil circles the wrong one, ask them to point to each one and say it aloud: b and d mix-ups usually show up here.")
      };
    });

  add("paper-drill-sh-ch-th", "lesson-early-two-letters-one-sound-sh-ch-and-th", "Quick drill: sh, ch and th",
    "Two letters, one sound: finish words with sh, ch or th from a clue, then put each sound of a word in its own box.", (who, h) => {
      const CLUES = [["a boat", "", "sh", "ip"], ["you sit on it", "", "ch", "air"], ["it swims in the sea", "fi", "sh", ""], ["the opposite of thick", "", "th", "in"],
        ["a baby hen", "", "ch", "ick"], ["you buy things in it", "", "sh", "op"], ["one, two, ...", "", "th", "ree"], ["you wash in it", "ba", "th", ""],
        ["a lot", "mu", "ch", ""], ["you eat your dinner from it", "di", "sh", ""], ["it is below your mouth", "", "ch", "in"], ["you do this to a door", "", "sh", "ut"]]
        .map(([clue, before, gap, after]) => ({ clue, before, gap, after }));
      const clues = pickN(CLUES, 5);
      const BOX = [["shop", 3], ["chin", 3], ["moth", 3], ["fish", 3], ["chip", 3], ["path", 3], ["shed", 3], ["much", 3], ["thick", 3], ["rush", 3], ["chat", 3], ["with", 3]];
      const boxes = pickN(BOX, 4);
      return {
        pupil: `${drillHead(h, "sh, ch and th", who, "Early")}
        <div class="pp-box qd-rule"><b>Two letters, one sound</b><p class="qd-big">sh &nbsp; ch &nbsp; th</p></div>
        ${task(1, "Read the clue. Write <b>sh</b>, <b>ch</b> or <b>th</b> to finish the word.")}
        <ol class="qd-list">${clues.map(c => `<li>${c.clue}: <span class="qd-word">${c.before}${blank(2.2)}${c.after}</span></li>`).join("")}</ol>
        ${task(2, "Say the word. Write one sound in each box. Two letters that make one sound go in one box.")}
        <div class="qd-rows qd-two">${boxes.map(([w, n]) => `<div class="qd-row"><span class="qd-say">${w}</span>${soundBoxes(n)}</div>`).join("")}</div>`,
        answers: answersPage(h, "sh, ch and th", clues.map(c => `${c.before}<b>${c.gap}</b>${c.after}`).concat(boxes.map(([w]) => {
          const parts = w.match(/sh|ch|th|ck|[a-z]/g); return `${w}: ${parts.map(p => `[${p}]`).join(" ")}`;
        })), "The first answers are task 1, then the sound boxes for task 2.")
      };
    });

  add("paper-drill-tiny-story", "lesson-early-writing-a-sentence", "Quick drill: read, draw and find",
    "Read a three-sentence story, draw it, then find and circle the little words that come up again and again.", (who, h) => {
      const STORIES = [
        ["The cat sat on a mat.", "A dog ran to the cat.", "The cat ran up to the top of a tree."],
        ["Sam had a red hat.", "The wind got the hat.", "Sam ran and got the hat back."],
        ["I can see a big ship.", "It is on the sea.", "I wish I was on the ship."],
        ["Mum got a box.", "In the box was a pup.", "The pup was for me!"],
        ["We went to the shop.", "I got a bun and a jam pot.", "The bun was the best."]];
      const story = pick(STORIES), text = story.join(" ").toLowerCase();
      const look = ["the", "a", "to", "was", "i", "and", "is", "on", "we"].filter(w => new RegExp(`\\b${w}\\b`).test(text)).slice(0, 3);
      const count = w => (text.match(new RegExp(`\\b${w}\\b`, "g")) || []).length;
      return {
        pupil: `${drillHead(h, "Read, draw and find", who, "Early")}
        ${task(1, "Read the story to your adult.")}
        <div class="pp-passage qd-story">${story.map(s => `<p>${s}</p>`).join("")}</div>
        ${task(2, "Draw the story.")}<div class="pp-draw"></div>
        ${task(3, `Find these words in the story and circle them: <b class="qd-look">${look.map(w => w === "i" ? "I" : w).join(" &nbsp; ")}</b>`)}
        ${task(4, "Copy one sentence.")}${ruled(h, 1)}`,
        answers: answersPage(h, "Read, draw and find", look.map(w => `<b>${w === "i" ? "I" : w}</b>: ${count(w)} time${count(w) > 1 ? "s" : ""} (count "The" at the start of a sentence too)`),
          "Look for: reading the story in order, a drawing that shows what happened, and a copied sentence with a capital letter, finger spaces and a full stop.")
      };
    });

  // ---------- First level ----------

  add("paper-drill-word-box", "lesson-first-common-words-and-spelling-strategies", "Quick drill: words from the word box",
    "Ten sentences, each missing one common tricky word: choose it from the word box and spell it right. A fresh mix every print.", (who, h) => {
      const SENT = [["said", "\"Come and play,\" ___ Mia."], ["were", "We ___ late for the bus."], ["there", "Is ___ any milk left?"], ["because", "I put my coat on ___ it was cold."],
        ["could", "She ___ not reach the top shelf."], ["would", "___ you like a drink?"], ["friend", "My best ___ lives next door."], ["people", "Lots of ___ came to the party."],
        ["once", "___ upon a time, there was a king."], ["again", "Can we play that game ___?"], ["does", "Where ___ your gran live?"], ["water", "Plants need sun and ___."],
        ["school", "We walk to ___ every morning."], ["many", "How ___ sweets are in the jar?"], ["laugh", "Funny jokes make me ___."], ["who", "___ ate the last biscuit?"],
        ["were", "The shops ___ shut on Sunday."], ["any", "Have you got ___ pens?"], ["they", "The birds sing when ___ wake up."], ["come", "Please ___ in and sit down."]];
      const used = new Set(), pickd = shuffle(SENT).filter(([w]) => used.has(w) ? false : (used.add(w), true)).slice(0, 10);
      const fill = s => s.replace("___", blank(5.5));
      return {
        pupil: `${drillHead(h, "Words from the word box", who, "First")}
        <div class="pp-box qd-rule"><b>Word box</b><p class="qd-bank">${shuffle(pickd.map(([w]) => w)).join(" &nbsp; · &nbsp; ")}</p></div>
        ${task(1, "Choose a word from the box to finish each sentence. Use each word once.")}
        <ol class="qd-list">${pickd.map(([, s]) => `<li>${fill(s)}</li>`).join("")}</ol>
        ${task(2, "Pick two words from the box. Write a sentence of your own with each.")}${ruled(h, 2)}`,
        answers: answersPage(h, "Words from the word box", pickd.map(([w, s]) => s.replace("___", `<b>${w}</b>`)),
          "A capital letter is right where the word starts the sentence. Spelling counts: the word is copied from the box.")
      };
    });

  add("paper-drill-vowel-teams", "lesson-first-vowel-teams-ai-ee-oa-igh", "Quick drill: ai, ee, oa and igh",
    "Sort words by their vowel team, then use a clue to add the missing team. A fresh mix every print.", (who, h) => {
      const TEAMS = { ai: ["rain", "tail", "snail", "paint", "wait", "train"], ee: ["tree", "feet", "sleep", "green", "sheep", "seed"],
        oa: ["boat", "coat", "road", "goat", "soap", "toast"], igh: ["night", "light", "high", "right", "fight", "bright"] };
      const sort = shuffle(Object.entries(TEAMS).flatMap(([t, ws]) => pickN(ws, 2).map(w => [w, t])));
      const CLUES = [["it falls from clouds", "r", "ai", "n"], ["you have two of them on your legs", "f", "ee", "t"], ["it floats on water", "b", "oa", "t"],
        ["the sun gives us this", "l", "igh", "t"], ["a dog wags it", "t", "ai", "l"], ["you do this in bed", "sl", "ee", "p"], ["you wash with it", "s", "oa", "p"],
        ["the opposite of day", "n", "igh", "t"], ["the colour of grass", "gr", "ee", "n"], ["a farm animal with a beard", "g", "oa", "t"], ["it runs on a track", "tr", "ai", "n"]];
      const clues = pickN(CLUES, 6);
      return {
        pupil: `${drillHead(h, "ai, ee, oa and igh", who, "First")}
        ${task(1, "Read each word. Write it in the right column.")}
        <p class="qd-bank">${sort.map(([w]) => w).join(" &nbsp; · &nbsp; ")}</p>
        <table class="pp-table qd-sort"><thead><tr>${Object.keys(TEAMS).map(t => `<th>${t}</th>`).join("")}</tr></thead>
          <tbody>${"<tr><td></td><td></td><td></td><td></td></tr>".repeat(2)}</tbody></table>
        ${task(2, "Read the clue. Write the missing letters: <b>ai</b>, <b>ee</b>, <b>oa</b> or <b>igh</b>.")}
        <ol class="qd-list">${clues.map(([c, a, , z]) => `<li>${c}: <span class="qd-word">${a}${blank(2.4)}${z}</span></li>`).join("")}</ol>`,
        answers: answersPage(h, "ai, ee, oa and igh", Object.keys(TEAMS).map(t => `<b>${t}</b>: ${sort.filter(([, x]) => x === t).map(([w]) => w).join(", ")}`)
          .concat(clues.map(([, a, t, z]) => `${a}<b>${t}</b>${z}`)), "The first four lines are the columns for task 1; then the words for task 2.")
      };
    });

  add("paper-drill-magic-e", "lesson-first-silent-e-a-e-i-e-o-e-u-e", "Quick drill: add an e",
    "Add a silent e to change a word (cap to cape), read both, then choose the right word for a clue.", (who, h) => {
      const PAIRS = [["kit", "kite"], ["hop", "hope"], ["cub", "cube"], ["tap", "tape"], ["pin", "pine"], ["rod", "rode"], ["man", "mane"],
        ["tub", "tube"], ["hat", "hate"], ["not", "note"], ["cut", "cute"], ["fin", "fine"], ["rip", "ripe"], ["can", "cane"], ["us", "use"]];
      const adds = pickN(PAIRS, 6);
      const CLUES = [["you fly it on a windy day", "kit", "kite"], ["a little message", "not", "note"], ["a lion has one round its neck", "man", "mane"],
        ["a baby bear or lion", "cub", "cube"], ["fruit that is ready to eat", "rip", "ripe"], ["water comes out of it", "tap", "tape"],
        ["you wear it on your head", "hat", "hate"], ["a box shape with six square sides", "cub", "cube"], ["you have a bath in it", "tub", "tube"], ["a tall tree with needles", "pin", "pine"]];
      const seen = new Set(), clues = shuffle(CLUES).filter(([, a]) => seen.has(a) ? false : (seen.add(a), true)).slice(0, 5)
        .map(([c, a, b, right = ["a baby bear or lion", "water comes out of it", "you wear it on your head", "you have a bath in it"].includes(c) ? a : b]) => ({ c, opts: shuffle([a, b]), right }));
      return {
        pupil: `${drillHead(h, "Add an e", who, "First")}
        <div class="pp-box qd-rule"><b>Silent e</b><p>An <b>e</b> on the end is silent, but it makes the vowel say its name: c<b>a</b>p → c<b>a</b>p<b>e</b>.</p></div>
        ${task(1, "Read the word. Add an <b>e</b> and write the new word. Read both words.")}
        <div class="qd-rows qd-two">${adds.map(([a]) => `<div class="qd-row"><span class="qd-say">${a}</span> → ${blank(5)}</div>`).join("")}</div>
        ${task(2, "Read the clue. Circle the right word.")}
        <ol class="qd-list">${clues.map(c => `<li>${c.c}: <span class="qd-pick">${c.opts.join("</span> <span class=\"qd-pick\">")}</span></li>`).join("")}</ol>`,
        answers: answersPage(h, "Add an e", adds.map(([a, b]) => `${a} → <b>${b}</b>`).concat(clues.map(c => `${c.c}: <b>${c.right}</b>`)),
          "Listen for the vowel changing from its short sound to its name.")
      };
    });

  add("paper-drill-joining-words", "lesson-first-joining-sentences-and-but-because-so", "Quick drill: and, but, because, so",
    "Join two short sentences with the right joining word, then write one of your own.", (who, h) => {
      const PAIRS = [["It was raining", "we took an umbrella", "so"], ["I like apples", "I don't like pears", "but"], ["We went to the park", "we played on the swings", "and"],
        ["The baby cried", "she was hungry", "because"], ["I was tired", "I went to bed early", "so"], ["Tom ran fast", "he still missed the bus", "but"],
        ["I put on my coat", "it was cold outside", "because"], ["We had soup", "then we had ice cream", "and"], ["The road was icy", "Dad drove slowly", "so"],
        ["I wanted to play", "it was time for tea", "but"], ["The dog barked", "it heard a noise", "because"], ["She picked up her bag", "she ran to school", "and"]];
      const rows = shuffle(["and", "but", "because", "so"].flatMap(j => pickN(PAIRS.filter(p => p[2] === j), 2)));
      return {
        pupil: `${drillHead(h, "and, but, because, so", who, "First")}
        <div class="pp-box qd-rule"><b>Joining words</b><p><b>and</b> adds more &nbsp; · &nbsp; <b>but</b> something different &nbsp; · &nbsp; <b>because</b> gives a reason &nbsp; · &nbsp; <b>so</b> says what happened next</p></div>
        ${task(1, "Write the best joining word in each gap.")}
        <ol class="qd-list">${rows.map(([a, b]) => `<li>${a} ${blank(5)} ${b}.</li>`).join("")}</ol>
        ${task(2, "Finish these with your own idea.")}
        <p class="qd-finish">I was happy because ${blank(16)}</p><p class="qd-finish">I wanted to go out, but ${blank(14)}</p>`,
        answers: answersPage(h, "and, but, because, so", rows.map(([a, b, j]) => `${a} <b>${j}</b> ${b}.`),
          "Task 2: any ending that gives a reason after because, and something different after but.")
      };
    });

  add("paper-drill-end-marks", "lesson-first-full-stops-question-marks-and-exclamation-marks", "Quick drill: sentence endings",
    "Choose a full stop, question mark or exclamation mark for each sentence, then put capital letters and full stops into three sentences.", (who, h) => {
      const S = [["Where is my bag", "?"], ["I had toast for breakfast", "."], ["Watch out", "!"], ["What time is it", "?"], ["The cat is asleep", "."], ["Help", "!"],
        ["Can I have a turn", "?"], ["We went to the beach", "."], ["Ouch, that hurt", "!"], ["Do you like pizza", "?"], ["My sister is seven", "."], ["Who is at the door", "?"],
        ["Look at that huge spider", "!"], ["It is my birthday today", "."]];
      const rows = pickN(S, 8);
      const FIX = [["my dog is called max", "My dog is called Max."], ["on saturday we went to the zoo", "On Saturday we went to the zoo."], ["amy and i like to read", "Amy and I like to read."],
        ["we live in glasgow", "We live in Glasgow."], ["tom has a new bike", "Tom has a new bike."]];
      const fix = pickN(FIX, 3);
      return {
        pupil: `${drillHead(h, "Sentence endings", who, "First")}
        <div class="pp-box qd-rule"><b>Sentence endings</b><p><b>.</b> tells you something &nbsp; · &nbsp; <b>?</b> asks something &nbsp; · &nbsp; <b>!</b> shows a strong feeling or a warning</p></div>
        ${task(1, "Put <b>.</b> <b>?</b> or <b>!</b> in the box.")}
        <ol class="qd-list qd-cols2">${rows.map(([s]) => `<li>${s}<span class="qd-cell qd-gap qd-mark"></span></li>`).join("")}</ol>
        ${task(2, "Write each sentence again with capital letters and a full stop.")}
        ${fix.map(([s]) => `<p class="qd-copy">${s}</p>${ruled(h, 1)}`).join("")}`,
        answers: answersPage(h, "Sentence endings", rows.map(([s, m]) => `${s}<b>${m}</b>`).concat(fix.map(([, s]) => s)),
          "In task 1 an exclamation mark is fine for a sentence said with strong feeling, if the pupil can say why.")
      };
    });

  add("paper-drill-past-tense", "lesson-first-past-tense-and-checking-my-writing", "Quick drill: yesterday I…",
    "Write verbs in the past tense, using the -ed rules, then match words that change in their own way (go, went).", (who, h) => {
      const ED = [["play", "played"], ["walk", "walked"], ["smile", "smiled"], ["clap", "clapped"],
        ["carry", "carried"], ["help", "helped"], ["skip", "skipped"], ["like", "liked"], ["tidy", "tidied"], ["shout", "shouted"]];
      const ed = pickN(ED, 8);
      const ODD = [["go", "went"], ["see", "saw"], ["eat", "ate"], ["run", "ran"], ["have", "had"], ["come", "came"], ["sit", "sat"], ["make", "made"]];
      const odd = pickN(ODD, 5), shown = shuffle(odd.map(([, b]) => b));
      return {
        pupil: `${drillHead(h, "Yesterday I…", who, "First")}
        <div class="pp-box qd-rule"><b>Adding -ed</b><p>Most words: add <b>ed</b> (jump → jumped). Ends in e: add <b>d</b> (bake → baked).
          Short vowel and one last letter: double it (hop → hopped). Ends in a consonant then y: y becomes <b>ied</b> (cry → cried).</p></div>
        ${task(1, "Write each word as if it happened yesterday.")}
        <div class="qd-rows qd-two">${ed.map(([a]) => `<div class="qd-row"><span class="qd-say">${a}</span> → ${blank(5.5)}</div>`).join("")}</div>
        ${task(2, "These words change in their own way. Draw a line to match each one.")}
        <div class="qd-match">${odd.map(([a], i) => `<span>${a}</span><span></span><span>${shown[i]}</span>`).join("")}</div>`,
        answers: answersPage(h, "Yesterday I…", ed.map(([a, b]) => `${a} → <b>${b}</b>`).concat(odd.map(([a, b]) => `${a} → <b>${b}</b>`)),
          "Mistakes here usually show which rule to practise: doubling (hoped / hopped) or y to ied.")
      };
    });

  add("paper-drill-quick-read", "lesson-first-answering-questions-about-a-text", "Quick drill: read and answer",
    "A short text with its key words in a box, then questions to find the answers in the text and one to think about.", (who, h) => {
      const TEXTS = [
        { title: "The lost kitten", key: ["kitten", "shed", "noise", "torch", "milk"], text: "Ava heard a small noise coming from the shed. She took a torch and looked inside. Behind a pile of old pots was a tiny grey kitten. It was shaking. Ava gave it a saucer of milk, and soon it began to purr.",
          qs: [["Where did the noise come from?", "the shed"], ["What did Ava take with her?", "a torch"], ["What colour was the kitten?", "grey"], ["What did Ava give it?", "a saucer of milk"]],
          think: ["How do you know the kitten felt better at the end?", "It began to purr (and stopped shaking)."] },
        { title: "Sports day", key: ["race", "sack", "fell", "cheered", "medal"], text: "It was sports day at school. Leo was in the sack race. Halfway down the track he fell over, but he got back up and kept hopping. He came last, but everyone cheered. His teacher gave him a medal for not giving up.",
          qs: [["Which race was Leo in?", "the sack race"], ["What happened halfway?", "he fell over"], ["Where did Leo come?", "last"], ["Why did he get a medal?", "for not giving up"]],
          think: ["Why do you think everyone cheered?", "Because he kept going after he fell (any sensible reason)."] },
        { title: "The snow day", key: ["snow", "window", "sledge", "hill", "cocoa"], text: "When Isla woke up, the world outside her window was white. Snow had fallen all night. She found her sledge in the garage and ran to the hill behind her house. After hours of sledging, her hands were frozen, so Gran made her a mug of hot cocoa.",
          qs: [["What did Isla see from her window?", "snow / everything was white"], ["Where was her sledge?", "in the garage"], ["Where did she go sledging?", "the hill behind her house"], ["Who made the cocoa?", "Gran"]],
          think: ["Why did Gran make her hot cocoa?", "Her hands were frozen / she was cold."] }];
      const t = pick(TEXTS);
      return {
        pupil: `${drillHead(h, "Read and answer", who, "First", 15)}
        <div class="pp-box qd-rule"><b>Key words: read these first</b><p class="qd-bank">${t.key.join(" &nbsp; · &nbsp; ")}</p></div>
        ${task(1, `Read “${t.title}”.`)}<div class="pp-passage">${t.text}</div>
        ${task(2, "Find the answers in the text.")}
        <ol class="qd-list">${t.qs.map(([q]) => `<li>${q}<br>${blank(18)}</li>`).join("")}</ol>
        ${task(3, t.think[0])}${lines(2)}`,
        answers: answersPage(h, `Read and answer: ${t.title}`, t.qs.map(([q, a]) => `${q} <b>${a}</b>`).concat([`${t.think[0]} <b>${t.think[1]}</b>`]),
          "Short answers are fine for task 2. For task 3, look for a reason that comes from the text.")
      };
    });

  // ---------- Second level ----------

  add("paper-drill-plurals-ing", "lesson-second-spelling-rules-ing-plurals-and-endings", "Quick drill: plurals and -ing",
    "Make plurals with the s, es, ies and ves rules, then add -ing with the doubling and drop-the-e rules. A fresh mix every print.", (who, h) => {
      const PL = [["cat", "cats"], ["bus", "buses"], ["box", "boxes"], ["church", "churches"], ["wish", "wishes"], ["baby", "babies"], ["city", "cities"], ["day", "days"],
        ["leaf", "leaves"], ["knife", "knives"], ["fox", "foxes"], ["party", "parties"], ["toy", "toys"], ["wolf", "wolves"], ["glass", "glasses"], ["lorry", "lorries"]];
      const ING = [["read", "reading"], ["run", "running"], ["ride", "riding"], ["jump", "jumping"], ["shop", "shopping"], ["smile", "smiling"],
        ["play", "playing"], ["write", "writing"], ["sit", "sitting"], ["cook", "cooking"]];
      const pl = pickN(PL, 8), ing = pickN(ING, 8);
      return {
        pupil: `${drillHead(h, "Plurals and -ing", who, "Second")}
        <div class="pp-cols">
          <div class="pp-box qd-rule"><b>More than one</b><p>Most words add <b>s</b>. After s, x, ch, sh add <b>es</b>. Consonant + y: change y to <b>ies</b>. Most f or fe endings: <b>ves</b>. Vowel + y: just add s.</p></div>
          <div class="pp-box qd-rule"><b>Adding -ing</b><p>Short vowel and one last consonant: double it (swim → swimming). Ends in e: drop the e (make → making). Otherwise just add <b>ing</b>.</p></div></div>
        ${task(1, "Write the plural.")}
        <div class="qd-rows qd-two">${pl.map(([a]) => `<div class="qd-row"><span class="qd-say">${a}</span> → ${blank(6)}</div>`).join("")}</div>
        ${task(2, "Add <b>ing</b>.")}
        <div class="qd-rows qd-two">${ing.map(([a]) => `<div class="qd-row"><span class="qd-say">${a}</span> → ${blank(6)}</div>`).join("")}</div>
        ${task(3, "Write one sentence using a plural and an -ing word from this sheet.")}${lines(2)}`,
        answers: answersPage(h, "Plurals and -ing", pl.map(([a, b]) => `${a} → <b>${b}</b>`).concat(ing.map(([a, b]) => `${a} → <b>${b}</b>`)),
          "The first eight are task 1. Ask which rule each one used: knowing the rule matters more than the one word.")
      };
    });

  add("paper-drill-prefixes", "lesson-england-years-3-and-4-word-list-roots-prefixes-and-suffixes", "Quick drill: un, dis, re, mis and pre",
    "Learn what five prefixes mean, write the prefix that fits each meaning, then circle the prefix in longer words.", (who, h) => {
      const P = [["not happy", "un", "happy"], ["not kind", "un", "kind"], ["do again", "re", "do"], ["not agree", "dis", "agree"], ["spell wrongly", "mis", "spell"],
        ["heat before", "pre", "heat"], ["fill again", "re", "fill"], ["not honest", "dis", "honest"], ["not lucky", "un", "lucky"], ["behave badly", "mis", "behave"],
        ["not appear (vanish)", "dis", "appear"], ["view before", "pre", "view"], ["build again", "re", "build"], ["not lock", "un", "lock"], ["understand wrongly", "mis", "understand"]];
      const rows = pickN(P, 8);
      const CIRCLE = ["unfair", "rewrite", "disobey", "misread", "prepay", "untidy", "replay", "dislike", "mistake", "preschool"];
      const circ = pickN(CIRCLE, 6);
      return {
        pupil: `${drillHead(h, "un, dis, re, mis and pre", who, "Second")}
        <div class="pp-box qd-rule"><b>Prefixes go at the start of a word and change its meaning</b>
          <p><b>un</b> and <b>dis</b> = not &nbsp; · &nbsp; <b>re</b> = again &nbsp; · &nbsp; <b>mis</b> = wrongly or badly &nbsp; · &nbsp; <b>pre</b> = before</p></div>
        ${task(1, "Write the prefix that gives the meaning. Then write the whole word.")}
        <table class="pp-table qd-prefix"><thead><tr><th>Meaning</th><th>Prefix</th><th>Word</th><th>Whole word</th></tr></thead>
          <tbody>${rows.map(([m, , w]) => `<tr><td>${m}</td><td></td><td>${w}</td><td></td></tr>`).join("")}</tbody></table>
        ${task(2, "Circle the prefix in each word.")}
        <p class="qd-bank">${circ.join(" &nbsp; · &nbsp; ")}</p>
        ${task(3, "Write a sentence that uses two of your whole words.")}${lines(3)}`,
        answers: answersPage(h, "un, dis, re, mis and pre", rows.map(([m, p, w]) => `${m}: <b>${p}</b> → ${p}${w}`)
          .concat([`Circle: ${circ.map(w => { const p = ["pre", "dis", "mis", "un", "re"].find(x => w.startsWith(x)); return `<b>${p}</b>${w.slice(p.length)}`; }).join(", ")}`]),
          "The spelling of the root word never changes: dis + satisfied, mis + spell (two s's).")
      };
    });

  add("paper-drill-syllables", "lesson-second-reading-fluently-with-pace-and-expression", "Quick drill: chop it into syllables",
    "Clap and split longer words into syllables with a line, count the beats, then sort words by how many syllables they have.", (who, h) => {
      const W = [["rabbit", "rab/bit"], ["sandwich", "sand/wich"], ["tomato", "to/ma/to"], ["elephant", "el/e/phant"], ["umbrella", "um/brel/la"], ["computer", "com/pu/ter"],
        ["helicopter", "hel/i/cop/ter"], ["fantastic", "fan/tas/tic"], ["dinosaur", "di/no/saur"], ["kitten", "kit/ten"], ["calculator", "cal/cu/la/tor"], ["banana", "ba/na/na"],
        ["hospital", "hos/pi/tal"], ["caterpillar", "cat/er/pil/lar"], ["pencil", "pen/cil"], ["remember", "re/mem/ber"], ["alligator", "al/li/ga/tor"]];
      const split = pickN(W, 8), rest = shuffle(W.filter(w => !split.includes(w))).slice(0, 8);
      const beats = w => w[1].split("/").length;
      return {
        pupil: `${drillHead(h, "Chop it into syllables", who, "Second")}
        <div class="pp-box qd-rule"><b>Syllables</b><p>A syllable is one beat in a word. Clap it, and every syllable has a vowel sound: but/ter/fly has 3.</p></div>
        ${task(1, "Clap each word. Write it with a line between the syllables, then the number of beats.")}
        <div class="qd-rows qd-two">${split.map(([w]) => `<div class="qd-row"><span class="qd-say">${w}</span> ${blank(7.5)} <span class="qd-cell qd-gap"></span></div>`).join("")}</div>
        ${task(2, "Sort these words by their number of syllables.")}
        <p class="qd-bank">${rest.map(([w]) => w).join(" &nbsp; · &nbsp; ")}</p>
        <table class="pp-table qd-sort"><thead><tr><th>2 syllables</th><th>3 syllables</th><th>4 syllables</th></tr></thead><tbody>${"<tr><td></td><td></td><td></td></tr>".repeat(3)}</tbody></table>`,
        answers: answersPage(h, "Chop it into syllables", split.map(w => `${w[1]} <b>(${beats(w)})</b>`)
          .concat([2, 3, 4].map(n => `<b>${n} syllables</b>: ${rest.filter(w => beats(w) === n).map(w => w[0]).join(", ") || "none this time"}`)),
          "Where to split can vary a little (ele/phant); the number of beats is what to check.")
      };
    });

  add("paper-drill-apostrophes", "lesson-second-commas-speech-marks-and-apostrophes", "Quick drill: apostrophes",
    "Shorten words with an apostrophe (do not, don't), then use an apostrophe to show who something belongs to.", (who, h) => {
      const SHORT = [["I am", "I'm"], ["cannot", "can't"], ["it is", "it's"], ["we are", "we're"], ["they have", "they've"], ["did not", "didn't"],
        ["she will", "she'll"], ["you are", "you're"], ["is not", "isn't"], ["I would", "I'd"], ["could not", "couldn't"], ["we have", "we've"], ["he is", "he's"]];
      const short = pickN(SHORT, 8);
      const OWN = [["the bike belonging to Sam", "Sam's bike"], ["the ball belonging to the dog", "the dog's ball"], ["the coat belonging to my mum", "my mum's coat"],
        ["the nest belonging to the bird", "the bird's nest"], ["the house belonging to Gran", "Gran's house"], ["the tail belonging to the cat", "the cat's tail"], ["the book belonging to Leo", "Leo's book"]];
      const own = pickN(OWN, 5);
      return {
        pupil: `${drillHead(h, "Apostrophes", who, "Second")}
        <div class="pp-cols">
          <div class="pp-box qd-rule"><b>Shortening</b><p>The apostrophe goes where letters are missed out: do n<b>o</b>t → don<b>'</b>t.</p></div>
          <div class="pp-box qd-rule"><b>Belonging</b><p>Add <b>'s</b> to the owner: the bike of Sam → Sam<b>'s</b> bike.</p></div></div>
        ${task(1, "Write the short form.")}
        <div class="qd-rows qd-two">${short.map(([a]) => `<div class="qd-row"><span class="qd-say">${a}</span> → ${blank(5.5)}</div>`).join("")}</div>
        ${task(2, "Write it a shorter way, using an apostrophe.")}
        <ol class="qd-list">${own.map(([a]) => `<li>${a} → ${blank(9)}</li>`).join("")}</ol>
        ${task(3, "Write a sentence with one short form and one belonging apostrophe.")}${lines(2)}`,
        answers: answersPage(h, "Apostrophes", short.map(([a, b]) => `${a} → <b>${b}</b>`).concat(own.map(([a, b]) => `${a} → <b>${b}</b>`)),
          "Watch for it's: it only has an apostrophe when it means it is or it has.")
      };
    });

  add("paper-drill-build-sentences", "lesson-second-varying-sentences-and-using-paragraphs", "Quick drill: build a better sentence",
    "Put jumbled words in order to make a sentence, then improve plain sentences with describing words and a when or where opener.", (who, h) => {
      const JUMBLE = ["The old fox crept quietly into the farmyard.", "After lunch, we walked to the river.", "My little brother hid under the stairs.",
        "Suddenly, the lights went out.", "A huge wave crashed onto the rocks.", "Every morning, the baker opens his shop.", "The children laughed at the silly clown.",
        "Last night, a storm blew our fence down."];
      const jum = pickN(JUMBLE, 4).map(s => ({ s, tiles: shuffle(s.replace(/[.,]/g, "").split(" ")) }));
      const PLAIN = ["The dog ran.", "A car stopped.", "The girl smiled.", "The door opened.", "A bird sang.", "The boy shouted."];
      const plain = pickN(PLAIN, 3);
      return {
        pupil: `${drillHead(h, "Build a better sentence", who, "Second")}
        ${task(1, "Put the words in order to make a sentence. Remember the capital letter, commas and full stop.")}
        ${jum.map(j => `<p class="qd-tiles">${j.tiles.map(t => `<span>${t}</span>`).join("")}</p>${lines(1)}`).join("")}
        ${task(2, "Make each sentence better: add a describing word and start with when or where it happened.")}
        <p class="qd-example">The cat slept. → <i>In the warm kitchen, the fat cat slept.</i></p>
        ${plain.map(s => `<p class="qd-copy">${s}</p>${lines(1)}`).join("")}`,
        answers: answersPage(h, "Build a better sentence", jum.map(j => j.s),
          "Some jumbles can go another way that still makes sense (moving the opener to the end): accept it if the punctuation fits. Task 2: look for an adjective, a when or where opener, and a comma after it.")
      };
    });
