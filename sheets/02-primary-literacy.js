  /* ===================== Literacy ===================== */

  add("paper-my-story", "lesson-early-telling-and-drawing-my-own-story", "My story", "Draw and write a story in three parts: beginning, middle and end.", (who, h) => ({
    pupil: `${h.sheetHead("My story", who)}<p>Draw your story in the boxes. Then write a sentence under each picture. Tell your adult the story first.</p>
      ${["At the beginning…", "In the middle…", "At the end…"].map(t => box(t, `<div class="pp-draw pp-short"></div>${ruled(h, 1)}`)).join("")}`,
    answers: lookForPage(h, "My story", ["Telling the story aloud first, in order, before drawing and writing", "A clear beginning, middle and end that follow on from each other",
      "Story words such as once upon a time, then, suddenly, in the end", "Sentences that can be read back (sounding out is fine)"],
      "The telling matters as much as the page: jot down what the pupil says as they tell the story.")
  }));

  add("paper-recount", "lesson-first-planning-and-writing-a-recount", "Plan a recount", "A planning frame for a recount: who, where and when, then what happened in order.", (who, h) => ({
    pupil: `${h.sheetHead("Plan a recount", who)}<p>Plan a recount of something you did. Then use your plan to write it.</p>
      <div class="pp-cols">${["Who was there?", "Where were you?", "When was it?", "How did you feel?"].map(q => box(q, ruled(h, 1))).join("")}</div>
      ${["First…", "Next…", "Then…", "Finally…"].map(q => box(q, ruled(h, 1))).join("")}
      <p class="pp-bank"><b>Words to help:</b> first, next, then, after that, later, finally, because, so, and, but</p>`,
    answers: lookForPage(h, "Plan a recount", ["Events in the order they happened, not just a list", "Who, where and when answered, so a reader could picture it",
      "Relevant detail and a feeling, not every small thing", "Time words (first, next, then, finally) joining the events"],
      "Judge the order and the detail, not how many boxes are filled.")
  }));

  add("paper-story-planner", "lesson-first-writing-a-story-with-characters-and-a-setting", "Plan a story", "Plan a character, a setting, a problem and an ending.", (who, h) => ({
    pupil: `${h.sheetHead("Plan a story", who)}
      <div class="pp-cols">
        ${box("My character", `<div class="pp-draw pp-short"></div><p>Name: ${blank(8)}</p><p>Looks like: ${blank(9)}</p><p>Feels: ${blank(10)}</p>`)}
        ${box("The setting", `<div class="pp-draw pp-short"></div><p>Where: ${blank(9)}</p><p>I can see: ${blank(8)}</p><p>I can hear: ${blank(8)}</p>`)}</div>
      ${box("The problem: what goes wrong?", ruled(h, 1))}${box("How is it sorted out?", ruled(h, 1))}${box("How does it end?", ruled(h, 1))}
      <p class="pp-bank"><b>Describing words:</b> tiny, enormous, gloomy, sparkling, brave, nervous, cheeky, frosty, silent, busy</p>
      <p class="hint">You can draw or tell your plan too.</p>`,
    answers: lookForPage(h, "Plan a story", ["A character with a name, a look and a feeling", "A setting described with what you can see or hear",
      "A problem that matters to the character, and an ending that sorts it out", "How the parts connect: does the setting or the character cause the problem?"],
      "A drawn or spoken plan counts as much as a written one.")
  }));

  add("paper-fact-opinion", "lesson-second-fact-opinion-and-persuasion", "Fact or opinion?", "Sort statements into facts and opinions, then write persuasive sentences with reasons.", (who, h) => {
    const all = [["Water freezes at 0 °C.", "fact"], ["Football is the best sport.", "opinion"], ["Spiders have eight legs.", "fact"],
      ["Cats make better pets than dogs.", "opinion"], ["There are seven days in a week.", "fact"], ["Winter is the most boring season.", "opinion"],
      ["The Sun is a star.", "fact"], ["Chocolate ice cream tastes nicer than vanilla.", "opinion"], ["A triangle has three sides.", "fact"],
      ["Everyone should learn to swim.", "opinion"], ["Penguins cannot fly.", "fact"], ["Homework is a waste of time.", "opinion"]];
    const items = shuffle(all).slice(0, 8);
    return {
      pupil: `${h.sheetHead("Fact or opinion?", who)}<p>A <b>fact</b> can be checked and proved. An <b>opinion</b> is what someone thinks or feels. Tick one box for each.</p>
        <table class="pp-table"><tr><th>Statement</th><th>Fact</th><th>Opinion</th></tr>${items.map(([t], i) => `<tr><td>${i + 1}. ${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
        <p><b>9.</b> Read this advert.</p>
        <p class="pp-advert"><b>CRUNCHO cereal!</b> The tastiest breakfast in the world! 9 out of 10 children love it. Every bowl has added vitamins. Buy CRUNCHO today!</p>
        <p>a) What does the advert want you to do? ${blank(10)}</p>
        <p>b) Write one opinion from the advert. ${blank(10)}</p>
        <p>c) "9 out of 10 children love it." How could you check if this is true? Who might have asked the children?</p>${lines(1)}
        <p>d) Would you trust this advert? Why or why not?</p>${lines(1)}
        <p><b>10.</b> Give your opinion about school dinners, with a reason using <b>because</b>, and a fact that supports it.</p>${lines(2)}`,
      answers: answersPage(h, "Fact or opinion?", items.map(([t, k]) => `${t} <b>${k}</b>`).concat([
        "9a. Buy CRUNCHO cereal.", "9b. The tastiest breakfast in the world (it can't be proved).",
        "9c. Ask how many children were asked, and who asked them: the cereal company might only have asked a few, or children who already liked it.",
        "9d. Any reasoned answer: the advert is trying to sell, so it chooses what to tell you.", "10. Any opinion with a reason, and a fact that supports it"]))
    };
  });

  add("paper-punctuation", "lesson-second-commas-speech-marks-and-apostrophes", "Commas, speech marks and apostrophes", "Rewrite sentences with capital letters, commas, speech marks and apostrophes.", (who, h) => {
    const all = [["we bought apples pears grapes and plums", "We bought apples, pears, grapes and plums."],
      ["lets go to the park said sam", "“Let’s go to the park,” said Sam."], ["the dogs bone was buried in the garden", "The dog’s bone was buried in the garden."],
      ["after lunch we played football", "After lunch, we played football."], ["where is my coat asked mia", "“Where is my coat?” asked Mia."],
      ["the childrens books are on the shelf", "The children’s books are on the shelf."], ["i cant find my shoes", "I can’t find my shoes."],
      ["my brother who is ten loves chess", "My brother, who is ten, loves chess."], ["were going to grans house on saturday", "We’re going to Gran’s house on Saturday."],
      ["mum shouted come inside now", "Mum shouted, “Come inside now!”"], ["the two girls coats were wet", "The two girls’ coats were wet."],
      ["slowly the fox crept past the hens", "Slowly, the fox crept past the hens."]];
    const items = shuffle(all).slice(0, 7);
    return {
      pupil: `${h.sheetHead("Commas, speech marks and apostrophes", who)}<p>Write each sentence correctly. Add capital letters, full stops, commas, speech marks and apostrophes.</p>
        ${items.map(([s], i) => `<div class="pp-q"><p><b>${i + 1}.</b> ${s}</p>${lines(2)}</div>`).join("")}`,
      answers: answersPage(h, "Commas, speech marks and apostrophes", items.map(([, a]) => a))
    };
  });

  add("paper-inform-persuade", "lesson-second-writing-to-inform-or-persuade", "Plan: inform or persuade", "A planning frame for writing to inform or persuade: audience, points with evidence, and devices to use.", (who, h) => ({
    pupil: `${h.sheetHead("Plan: inform or persuade", who)}
      <div class="pp-cols">${box("My topic", lines(1))}${box("I am writing to: ☐ inform ☐ persuade", `<p>My reader is: ${blank(9)}</p>`)}</div>
      ${box("Opening: catch the reader's attention", lines(2))}
      ${[1, 2, 3].map(n => box(`Point ${n}`, `${lines(1)}<p class="hint">Evidence or example:</p>${lines(1)}`)).join("")}
      ${box("Ending: sum up, or tell the reader what to do", lines(2))}
      <p><b>I will use:</b> ${tick(["a question for the reader", "a fact or number", "strong, emotive words", "“you” to talk to the reader", "firstly, furthermore, however, therefore"])}</p>`,
    answers: lookForPage(h, "Plan: inform or persuade", ["A clear purpose (inform or persuade) and a named reader", "Each point backed by evidence or an example that really supports it",
      "Language chosen for that reader and purpose", "An opening that hooks and an ending that sums up or asks the reader to act"],
      "Check the finished writing too: does the evidence support each point, or just repeat it?")
  }));

  add("paper-story-mountain", "lesson-second-writing-a-story-plot-character-and-setting", "Story mountain", "Plan a story on a story mountain: opening, build-up, problem, resolution and ending.", (who, h) => ({
    pupil: `${h.sheetHead("Story mountain", who)}<p>Plan your story up and down the mountain. The problem is at the top.</p>
      ${svg(560, 140, `<polyline points="10,130 140,90 280,32 420,90 550,130" class="pp-mountain"/>
        ${[["1 Opening", 14, 112], ["2 Build-up", 96, 74], ["3 Problem", 244, 22], ["4 Resolution", 408, 72], ["5 Ending", 478, 104]].map(([t, x, y]) => `<text x="${x}" y="${y}" class="pp-lab pp-halo">${t}</text>`).join("")}`, "pp-wide")}
      ${["1. Opening: who, where, when?", "2. Build-up: what starts to happen?", "3. Problem: what goes wrong?", "4. Resolution: how is it sorted out?", "5. Ending: how does it finish?"].map(t => box(t, lines(2))).join("")}
      <div class="pp-cols">${box("Main character: feelings and actions", lines(2))}${box("Setting: sights, sounds, atmosphere", lines(2))}</div>
      ${box("How does the problem change your character by the end?", lines(1))}`,
    answers: lookForPage(h, "Story mountain", ["Each stage leads to the next: the build-up sets up the problem", "A problem with real tension, and a resolution that follows from what has happened",
      "A character who changes or learns something because of the problem", "A setting that adds atmosphere, not just a place name"])
  }));

  add("paper-talk", "lesson-second-planning-and-giving-a-short-talk", "Plan a short talk", "Plan a two-minute talk, make cue cards, and check how it went.", (who, h) => ({
    pupil: `${h.sheetHead("Plan a short talk", who)}
      ${box("My topic", lines(1))}${box("Opening: grab the audience (a question, a fact, or a short story)", lines(2))}
      <div class="pp-cols3">${[1, 2, 3].map(n => box(`Point ${n}`, `${lines(2)}<p class="hint">Example:</p>${lines(1)}`)).join("")}</div>
      ${box("Ending: sum up, or ask the audience to think about something", lines(2))}
      <p><b>Cue cards:</b> write a few key words for each part. Cut them out and use them when you speak.</p>
      <div class="pp-cols3">${["Opening", "Points", "Ending"].map(t => `<div class="pp-card"><b>${t}</b></div>`).join("")}</div>
      <p><b>After my talk:</b> ${tick(["I looked at my audience", "I spoke loudly and clearly", "I didn't rush", "I answered a question"])}</p>`,
    answers: `${h.brandHead("What to look for: Plan a short talk", "For the adult, while you listen.")}
      <table class="pp-table"><tr><th>While they speak</th><th>Not yet</th><th>Some of the time</th><th>Yes</th></tr>
        ${["Clear opening that catches the listener", "Three points, each with an example", "Looks at the audience", "Loud and clear enough", "A steady pace, with pauses",
          "Words chosen for this audience", "A clear ending", "Answers a question thoughtfully"].map(t => `<tr><td>${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
      <p>As a listener, ask one question and note how they respond.</p>`
  }));

  add("paper-handwriting-speed", "lesson-england-writing-legibly-fluently-and-at-speed-years-5-and-6", "Writing legibly and at speed", "Copy a passage in best handwriting, time a one-minute speed write, and choose print or joined for the task.", (who, h) => ({
    pupil: `${h.sheetHead("Writing legibly and at speed", who)}
      <p><b>1.</b> Copy this in your best joined handwriting.</p>
      <p class="pp-passage">The night was cold and still. Far below the castle, a light flickered in the forest, and an owl called once across the frozen lake.</p>${lines(3)}
      <p><b>2.</b> One-minute speed write. When your adult says go, copy this sentence as many times as you can, keeping it readable.</p>
      <p class="pp-passage">The quick brown fox jumps over the lazy dog.</p>${lines(4)}
      <p>Words written in one minute: ${blank(3)}</p>
      <p>Is it still easy to read? ☐ yes ☐ mostly ☐ not yet &nbsp; (Speed and how easy it is to read are judged separately.)</p>
      <p><b>3.</b> Some writing is clearer printed. Label these parts of a plant in clear print: <b>flower, leaf, stem, root</b>.</p>
      ${svg(300, 110, `<line x1="150" y1="100" x2="150" y2="35" class="pp-beam"/><circle cx="150" cy="25" r="14" class="pp-frame"/><ellipse cx="128" cy="62" rx="20" ry="8" class="pp-frame"/>
        <path d="M150,100 L135,108 M150,100 L165,108" class="pp-beam"/>${[[20, 25], [20, 62], [230, 70], [230, 104]].map(([x, y]) => `<line x1="${x + 50}" y1="${y}" x2="${x < 150 ? 125 : 155}" y2="${y}" class="pp-cut"/><rect x="${x}" y="${y - 10}" width="50" height="18" class="pp-frame"/>`).join("")}`)}`,
    answers: lookForPage(h, "Writing legibly and at speed", [
      "1. Joins used consistently, letters the right size and evenly spaced, and a clear finish to each word",
      "2. Speed: count the words, and compare with their last go rather than with other pupils",
      "2. Legibility, judged separately: could someone else read every word? Note any letters that break down at speed (often a, d, e, o, r and t)",
      "3. Clear, unjoined print for the labels, because labels need to be read at a glance"],
      "Time exactly one minute. If speed rises but legibility falls, slow down and practise the letters that broke down, then time again another day.")
  }));

  add("paper-phonics-words", "lesson-england-getting-ready-for-the-phonics-check-year-1", "Read the words", "Real words and alien words to read aloud, with a marking sheet for the adult.", (who, h) => {
    const words = h.phonicsWords ? h.phonicsWords().filter((w, i) => i % 2 === 0) : [];
    const card = w => `<span class="pp-word">${w.alien ? `<i aria-hidden="true">👽</i>` : ""}${h.esc(w.word)}</span>`;
    return {
      pupil: `${h.sheetHead("Read the words", who)}<p>Read each word to your adult. Words with an alien are alien names: sound them out and blend.</p>
        <h2 class="ws-sub">Section 1</h2><div class="pp-words">${words.filter(w => w.section === 1).map(card).join("")}</div>
        <h2 class="ws-sub">Section 2</h2><div class="pp-words">${words.filter(w => w.section === 2).map(card).join("")}</div>`,
      answers: `${h.brandHead("For the adult: Read the words", "Tick each word read correctly. Note any sounds that caused trouble.")}
        <table class="pp-table"><tr><th>Word</th><th>Real or alien</th><th>✓</th><th>Sounds to practise</th></tr>
        ${words.map(w => `<tr><td>${h.esc(w.word)}</td><td>${w.alien ? "alien" : "real"}</td><td class="pp-c">☐</td><td></td></tr>`).join("")}</table>`
    };
  }, { needsAdult: true });

