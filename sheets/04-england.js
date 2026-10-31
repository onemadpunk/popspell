  /* ===================== England: sheets for the rest of the national curriculum (October 2026) ===================== */
  // The texts and poems on these sheets are written for PopSpell.

  const dotGrid = (cols, rows, s = 22) => svg(cols * s + 10, rows * s + 10, Array.from({ length: (cols + 1) * (rows + 1) }, (_, i) =>
    `<circle cx="${5 + (i % (cols + 1)) * s}" cy="${5 + Math.floor(i / (cols + 1)) * s}" r="1.8" fill="#8a9ab4"/>`).join(""), "pp-wide");

  add("paper-draw-shapes", "lesson-england-lines-and-shapes-parallel-perpendicular-and-quadrilaterals-years-3-and-4", "Draw and make shapes", "Draw shapes on a dotty grid, mark parallel sides and right angles, and make 3D shapes and draw them from different sides.", (who, h) => ({
    pupil: `${h.sheetHead("Draw and make shapes", who)}
      <p><b>1.</b> Use a ruler to draw a <b>square</b>, a <b>rectangle</b>, a <b>trapezium</b> and a <b>right-angled triangle</b> on the grid. Label each one.</p>${dotGrid(30, 9)}
      <p><b>2.</b> On your shapes, mark each <b>right angle</b> with a small square, and each pair of <b>parallel</b> sides with matching arrows.</p>
      <p><b>3.</b> Make a cube and a square-based pyramid from straws, cubes or modelling clay. Draw each one from the side and from the top.</p>
      <div class="pp-cols">${box("Cube", `<div class="pp-draw pp-short"></div>`)}${box("Square-based pyramid", `<div class="pp-draw pp-short"></div>`)}</div>
      <p><b>4.</b> Turn your cube onto another face. Is it still a cube? How do you know?</p>${ruled(h, 1)}`,
    answers: lookForPage(h, "Draw and make shapes", ["Straight sides drawn with a ruler, joining dots, and each shape correctly named",
      "Right angles marked on the square, rectangle and right-angled triangle; parallel sides marked on the square, rectangle and trapezium (the trapezium has one pair)",
      "3D shapes made with the right number of faces, edges and corners; drawings that show the square top of the cube and the triangle side of the pyramid",
      "4: Yes. Turning a shape doesn't change its faces, edges or corners."])
  }));

  add("paper-draw-accurately", "lesson-england-angles-rectangles-and-accurate-drawing-years-5-and-6", "Draw it accurately", "Draw rectangles, triangles and angles to exact lengths and angles with a ruler and protractor, and use angle facts.", (who, h) => ({
    pupil: `${h.sheetHead("Draw it accurately", who)}<p>You need a sharp pencil, a ruler and a protractor.</p>
      <p><b>1.</b> Draw a rectangle 7 cm long and 4 cm wide. Measure the diagonal: ${blank(4)} cm</p><div class="pp-draw"></div>
      <p><b>2.</b> Draw a line 6 cm long. At one end draw an angle of 50°, and at the other end an angle of 60°. Join the lines to make a triangle. Measure the third angle: ${blank(3)}°</p><div class="pp-draw"></div>
      <p><b>3.</b> Without measuring: what should the third angle be? Why?</p>${lines(1)}
      <p><b>4.</b> Draw a straight line and an angle of 135° on it. What is the angle on the other side of the line? ${blank(3)}° How do you know?</p>${lines(1)}`,
    answers: answersPage(h, "Draw it accurately", ["Diagonal about 8.1 cm (within 2 mm is fine)", "Third angle 70° (within 2°)", "180° − 50° − 60° = 70°, because the angles in a triangle add to 180°", "45°, because angles on a straight line add to 180°"],
      "Check the drawing as well as the answer: lengths within 2 mm and angles within 2°. Watch for reading the wrong scale on the protractor (130° instead of 50°).")
  }));

  add("paper-cut-draw-digits", "lesson-england-getting-ready-to-write-cutting-drawing-and-forming-digits-reception-and-year-1", "Cut, draw and write numbers", "Cut along straight, zigzag and curved lines, trace pictures carefully, then form the digits 0 to 9.", (who, h) => {
    const cut = (d, label) => `<p>${label}</p>${svg(640, 50, `<path d="${d}" fill="none" stroke="#333" stroke-width="2.5" stroke-dasharray="8 6"/><text x="0" y="34" font-size="26">✂</text>`, "pp-wide")}`;
    return {
      pupil: `${h.sheetHead("Cut, draw and write numbers", who)}
        <p><b>1.</b> Cut along each dotted line. Turn the paper, not the scissors.</p>
        ${cut("M40,25 L630,25", "A straight line")}${cut("M40,40 L100,10 L160,40 L220,10 L280,40 L340,10 L400,40 L460,10 L520,40 L580,10 L630,40", "A zigzag")}
        ${cut("M40,25 C120,-5 200,55 280,25 S440,-5 520,25 S600,45 630,25", "A wavy line")}
        <p><b>2.</b> Trace over the dotted lines slowly and carefully.</p>
        ${svg(640, 110, `<circle cx="70" cy="55" r="40" fill="none" stroke="#8a9ab4" stroke-width="3" stroke-dasharray="3 6"/>
          <path d="M180,95 L180,50 L230,15 L280,50 L280,95 Z M215,95 L215,68 L245,68 L245,95" fill="none" stroke="#8a9ab4" stroke-width="3" stroke-dasharray="3 6"/>
          <path d="M360,90 Q400,10 440,90 Q480,10 520,90 Q560,10 600,90" fill="none" stroke="#8a9ab4" stroke-width="3" stroke-dasharray="3 6"/>`, "pp-wide")}
        <p><b>3.</b> Write each number. Start at the dot your adult shows you.</p>
        ${[[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]].map(([a, b]) => h.handwritingRow(`${a} ${a}  ${b} ${b}`, ["model", "grey", "dots", "blank"])).join("")}`,
      answers: lookForPage(h, "Cut, draw and write numbers", ["Holds scissors with thumb on top, and turns the paper, not the scissors, to follow the line",
        "Cuts close to the line on the straight and zigzag lines; the curve is harder, so look for steady progress",
        "Traces slowly, staying on the line, with a comfortable pencil grip",
        "Digits started in the right place and formed the right way: watch for 2, 5, 6, 9 and 3 written backwards, which is common at this age"],
        "This sheet is about control and care, not speed. Little and often works best for cutting and drawing.")
    };
  });

  add("paper-longer-words", "lesson-england-reading-longer-words-and-checking-it-makes-sense-years-1-and-2", "Longer words", "Read two-syllable words part by part, then spot and fix the word that doesn't make sense.", (who, h) => {
    const words = [["rab", "bit"], ["gar", "den"], ["sand", "wich"], ["pic", "nic"], ["chick", "en"], ["rock", "et"], ["sun", "set"], ["pump", "kin"], ["car", "pet"], ["thun", "der"]];
    const sentences = [["I put my socks on my hands.", "feet"], ["The fish swam in the tree.", "pond (or sea, river)"], ["We ate our soup with a fork.", "spoon"], ["The sun came up at night.", "morning"], ["She rode her bike to the moon.", "park (or shop, school)"]];
    return {
      pupil: `${h.sheetHead("Longer words", who)}
        <p><b>1.</b> Read each part, then put the parts together and read the whole word. Tick it when you can read it.</p>
        <div class="pp-cols">${words.map(([a, b]) => `<p class="pp-syll"><span>${a}</span> + <span>${b}</span> = <b>${a}${b}</b> ☐</p>`).join("")}</div>
        <p><b>2.</b> One word in each sentence doesn't make sense. Read the sentence, circle the wrong word and write a better word.</p>
        ${sentences.map(([s], i) => `<p><b>${String.fromCharCode(97 + i)}.</b> ${s} &nbsp; ${blank(6)}</p>`).join("")}
        <p><b>3.</b> When something doesn't make sense as you read, what can you do?</p>${ruled(h, 1)}`,
      answers: answersPage(h, "Longer words", sentences.map(([s, a], i) => `${String.fromCharCode(97 + i)}. ${s} → ${a}`).concat(["3. Stop, go back and reread; check the sounds in the word; ask: does that make sense?"]),
        "In part 1, listen for blending each part with the sounds they know, not guessing from the first letters. Note any part that's hard to read.")
    };
  });

  const GOATS = "Once upon a time, three billy goats lived on a hillside: a little goat, a middle-sized goat and a great big goat. Across the river the grass was green and sweet, but under the bridge lived a grumpy troll. Trip, trap went the little goat over the bridge. \"Who's that trip-trapping over my bridge?\" roared the troll. \"I'm going to gobble you up!\" \"Please don't eat me,\" said the little goat. \"Wait for my brother. He's much bigger.\" So the troll let him go. Next came the middle-sized goat, and the same thing happened. Then the great big goat came over the bridge. \"Who's that trip-trapping over my bridge?\" roared the troll. \"It's me!\" said the great big goat, and he tossed the troll into the river. The three goats ate the sweet green grass, and they lived happily ever after.";
  add("paper-traditional-tale", "lesson-england-traditional-tales-retelling-and-story-language-years-1-and-2", "Three Billy Goats Gruff", "Read a retelling of a traditional tale, order the events, find its story language and retell it.", (who, h) => ({
    pupil: `${h.sheetHead("The Three Billy Goats Gruff", who)}<p class="pp-passage">${GOATS}</p>
      <p><b>1.</b> Number the events 1 to 5 in the order they happen.</p>
      ${shuffle(["The troll lets the little goat go.", "The goats eat the sweet green grass.", "The great big goat tosses the troll into the river.", "The little goat trip-traps over the bridge.", "The middle-sized goat crosses the bridge."]).map(e => `<p>☐ ${e}</p>`).join("")}
      <p><b>2.</b> Copy the line the troll says more than once.</p>${ruled(h, 1)}
      <p><b>3.</b> Tick what makes this a traditional tale: ${tick(["Once upon a time", "things in threes", "a baddie", "talking animals", "a happy ending"])}</p>
      <p><b>4.</b> Why does the troll let the first two goats go?</p>${ruled(h, 1)}
      <p><b>5.</b> Tell the story to your adult. Use <b>first</b>, <b>next</b>, <b>then</b> and <b>in the end</b>.</p>`,
    answers: answersPage(h, "Three Billy Goats Gruff", ["1. Little goat crosses (1), troll lets it go (2), middle-sized goat crosses (3), big goat tosses the troll (4), goats eat the grass (5)",
      "2. \"Who's that trip-trapping over my bridge?\"", "3. All five", "4. Each goat says a bigger brother is coming, so the troll waits for a bigger meal", "5. A retelling in order, with the repeated line and time words"],
      "Ask how the events link: each goat's promise leads to the next goat, and the biggest goat brings the ending.")
  }));

  const COLOSSAL = "The giant was colossal: his head brushed the clouds, and his boots were the size of houses. A timid mouse peeped out from a crack in the wall, too frightened to move. The giant's gleaming sword flashed in the sunlight. When he sneezed, the mouse scurried away as fast as its legs could carry it, and hid. By the evening, the giant was exhausted. He lay down and fell asleep before the sun had even set.";
  add("paper-word-meanings", "lesson-england-words-and-what-they-mean-years-1-to-6", "Word detective", "Work out word meanings from clues in the text, check them in a dictionary, and choose favourite words and phrases.", (who, h) => ({
    pupil: `${h.sheetHead("Word detective", who)}<p class="pp-passage">${COLOSSAL}</p>
      <table class="pp-table"><tr><th>Word</th><th>A clue in the text</th><th>I think it means</th><th>Dictionary says</th></tr>
        ${["colossal", "timid", "gleaming", "scurried", "exhausted"].map(w => `<tr><td><b>${w}</b></td><td></td><td></td><td></td></tr>`).join("")}</table>
      <p><b>2.</b> Which word is like a word you already know? (For example, <i>gleaming</i> is like <i>gleam</i>.)</p>${lines(1)}
      <p><b>3.</b> Copy your favourite word or phrase from the text. Why do you like it?</p>${lines(2)}`,
    answers: answersPage(h, "Word detective", ["colossal: enormous (clue: head brushed the clouds, boots the size of houses)", "timid: shy and easily frightened (clue: too frightened to move)",
      "gleaming: shining brightly (clue: flashed in the sunlight)", "scurried: ran quickly with short steps (clue: as fast as its legs could carry it)", "exhausted: very tired (clue: fell asleep before the sun set)"],
      "Accept any meaning that fits the clue. Look for the pupil using the words around the new word, and checking the dictionary rather than guessing.")
  }));

  const PUDDLES = ["Splish goes the puddle when I jump in,", "splash goes the water right up to my chin.", "Drip go the leaves when the rain comes down,", "drop go the drops on the roofs of the town.", "Swish goes the wind and it rattles the door,", "and I'm out in my wellies to jump in some more!"];
  add("paper-poems-y2", "lesson-england-poems-to-learn-say-and-write-year-2", "Poems", "Learn a short poem by heart and say it with expression, then write a poem with the same pattern.", (who, h) => ({
    pupil: `${h.sheetHead("Poems", who)}<p class="pp-passage">${PUDDLES.join("<br>")}</p>
      <p><b>1.</b> Learn the poem two lines at a time. Tick each pair when you can say it without looking. ☐ ☐ ☐</p>
      <p><b>2.</b> Say the poem to your adult. Which words will you say loudly? Underline them.</p>
      <p><b>3.</b> Write your own poem with the same pattern: two sound words, then what happens.</p>
      <p class="hint">For example: <i>Crunch goes the snow when I…</i></p>${ruled(h, 4)}`,
    answers: lookForPage(h, "Poems", ["Says the poem from memory, in order, with the rhymes landing at the end of each pair of lines",
      "Changes their voice to show meaning: louder for splash and rattles, a bouncy rhythm", "Their own poem keeps the pattern (sound word, sound word, what happens) and tries to rhyme in pairs",
      "Reads their own poem aloud with expression"], "Learning by heart is little and often: two lines a day works well.")
  }));

  const STORM_POEM = ["The fishing boat left at the break of the day,", "with Jen at the wheel and the gulls on the way.", "But the sky turned to slate and the waves grew so high", "that the mast seemed to scrape at the cracks in the sky.", "She held the wheel tight as the harbour came near,", "and the lighthouse blinked once, as if to say: here."];
  const FREE_POEM = ["Fog.", "The street has gone.", "Lamp posts float like matches", "somebody forgot to strike.", "A dog barks", "from nowhere."];
  add("paper-poetry-perform", "lesson-england-poetry-forms-and-performing-poems-years-3-to-6", "Perform a poem", "Compare a narrative poem and a free verse poem, learn one by heart, plan a performance and perform it.", (who, h) => ({
    pupil: `${h.sheetHead("Perform a poem", who)}
      <div class="pp-cols">${box("Poem A", `<p class="pp-passage">${STORM_POEM.join("<br>")}</p>`)}${box("Poem B", `<p class="pp-passage">${FREE_POEM.join("<br>")}</p>`)}</div>
      <p><b>1.</b> Which poem tells a story (a <b>narrative poem</b>)? ${blank(4)} Which is <b>free verse</b>, with no rhyme or regular pattern? ${blank(4)}</p>
      <p><b>2.</b> How can you tell? Give one clue for each.</p>${lines(2)}
      <p><b>3.</b> Choose one poem to learn by heart. Mark it up for performance: <b>/</b> for a pause, <b>↑</b> louder, <b>↓</b> quieter, and a note for any movement.</p>
      <p><b>4.</b> Perform it. Then perform a piece of your own writing. ${tick(["I knew it by heart", "my voice showed the meaning", "I paused in the right places", "I looked at my audience"])}</p>`,
    answers: `${h.brandHead("What to look for: Perform a poem", "For the adult, while you watch.")}
      <ol class="ws-answers"><li>A is narrative; B is free verse</li><li>A has characters and events, and rhyming couplets; B has no rhyme and no regular rhythm, and uses short lines and an image</li></ol>
      <table class="pp-table"><tr><th>While they perform</th><th>Not yet</th><th>Some of the time</th><th>Yes</th></tr>
        ${["Knows it by heart", "Tone suits the poem (tense for A, quiet and strange for B)", "Volume changes for effect", "Pauses where the meaning needs it", "Movement or gesture that helps, not distracts", "Looks at the audience", "Performs their own writing with the same care"].map(t => `<tr><td>${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>`
  }));

  add("paper-talk-about-writing", "lesson-england-talking-about-my-writing-saying-it-reading-it-aloud-and-improving-it-years-1-and-2", "Say it, write it, read it", "Say each sentence before writing it, read the writing aloud, then talk about it with an adult and make one change.", (who, h) => ({
    pupil: `${h.sheetHead("Say it, write it, read it", who)}<p>Write three sentences about something you did.</p>
      ${[1, 2, 3].map(n => `<p><b>${n}.</b> ☐ I said it out loud first.</p>${ruled(h, 1)}`).join("")}
      <p><b>Read it aloud</b> to your adult, clearly, so they can hear every word. ☐</p>
      <div class="pp-cols">${box("⭐ Something good", ruled(h, 1))}${box("➜ Something to change", ruled(h, 1))}</div>
      <p><b>Make your change.</b> Write the new sentence here:</p>${ruled(h, 1)}`,
    answers: lookForPage(h, "Say it, write it, read it", ["Says the whole sentence aloud before writing, and writes the same sentence (not a shorter one)",
      "Rereads to check it makes sense", "Reads aloud clearly enough to be heard, with intonation that shows the meaning",
      "Takes part in talking about it, and makes a real change: a better word, a missing word, a capital letter or full stop"],
      "Keep the talk positive: one star and one wish. The change matters more than the amount written.")
  }));

  const MOON = "Long ago, the Moon was a round, silver plate that the Sky Mother used at her table. Every night she filled it with starlight for her children. But one winter, Raven grew hungry and jealous. Each night he flew up and took one small bite of the silver plate, until only a thin curve was left. The Sky Mother was sad, but she did not shout. Instead, she began to mend the plate, one piece each night, until it was round again. Raven was ashamed, but hunger is a hard thing, and so he took his bites again. And that is why, to this day, the Moon grows thin and then grows round, month after month.";
  add("paper-myth", "lesson-england-myths-legends-and-themes-across-books-years-3-to-6", "Myths and themes", "Read an original myth, retell it, spot the conventions of myths, and compare its theme with another book.", (who, h) => ({
    pupil: `${h.sheetHead("Myths and themes: Why the Moon changes shape", who)}<p class="pp-passage">${MOON}</p>
      <p><b>1.</b> Retell the myth in three sentences.</p>${lines(3)}
      <p><b>2.</b> Tick the conventions of a myth you can find: ${tick(["long ago", "gods or magical beings", "an animal that acts like a person", "it explains something in nature", "a lesson about how to behave"])}</p>
      <p><b>3.</b> What is the <b>theme</b>? ${tick(["greed", "forgiveness", "patience", "jealousy"])} Give evidence from the text.</p>${lines(2)}
      <p><b>4.</b> Name another book or story with the same theme. How is it similar, and how is it different?</p>${lines(3)}`,
    answers: lookForPage(h, "Myths and themes", ["1. Raven bites the Moon until it's thin; the Sky Mother mends it; Raven bites it again, which is why the Moon changes shape",
      "2. All five can be found", "3. More than one theme fits: greed or jealousy (Raven), forgiveness or patience (the Sky Mother). Look for a quotation or detail as evidence",
      "4. A real comparison: a shared theme named, with one similarity and one difference in how the stories show it"],
      "Myths explain the world or show how to behave; legends are about heroes who may once have lived. Ask the pupil which this is, and why.")
  }));

  const LIGHTHOUSE = ["Old Morag had kept the lighthouse for forty years. Every evening she climbed the hundred and twelve steps, lit the great lamp, and watched its beam sweep across the dark water.",
    "One stormy night, the lamp flickered and died. Morag's heart thudded. Somewhere out there, the little ferry would be heading home. She searched the cupboard with trembling hands and found the old brass lantern her father had used.",
    "She carried it to the top window and swung it slowly, back and forth, back and forth, until her arms ached. At dawn, a horn sounded from the harbour. The ferry had come home safe."];
  add("paper-questions-reading", "lesson-england-asking-questions-and-checking-understanding-as-i-read-years-3-to-6", "Questions as I read", "Ask questions before, during and after reading, check understanding and word meanings, and discuss answers.", (who, h) => ({
    pupil: `${h.sheetHead("Questions as I read: The Lighthouse", who)}
      <p><b>Before you read.</b> The title is <i>The Lighthouse</i>. Write a question you hope it will answer.</p>${lines(1)}
      <p class="pp-passage">${LIGHTHOUSE[0]}</p><p><b>During.</b> Write a question you have now.</p>${lines(1)}
      <p class="pp-passage">${LIGHTHOUSE[1]}</p><p>What does <b>thudded</b> tell you about how Morag felt? How do you know?</p>${lines(1)}
      <p class="pp-passage">${LIGHTHOUSE[2]}</p>
      <p><b>After.</b> Was your first question answered? What are you still wondering?</p>${lines(2)}
      <p><b>Talk about it.</b> Take turns with your adult: each share one answer and one thing you're still wondering. ☐</p>`,
    answers: lookForPage(h, "Questions as I read", ["Questions that are genuine and help understanding (why, how, what if), not just checking facts", "Stops to check understanding, and rereads when something doesn't fit",
      "thudded: her heart was beating hard because she was frightened or worried; clue: the light failed and the ferry was out there",
      "Notices what's still unclear (why did the lamp fail? how did the ferry see the lantern?) and discusses it, taking turns and listening"],
      "Ask which question helped most, and why.")
  }));

  const HARBOUR = "The wind howled across the harbour. Boats tugged at their ropes like dogs on leads, and spray burst over the wall in great white fans. Finn pulled his hood tight and ran towards the last boat. \"Grandad!\" he shouted. \"The storm's getting worse!\" Grandad looked up from the tangled net. \"Then we'd better be quick,\" he said, and grinned.";
  add("paper-plan-rehearse", "lesson-england-planning-from-a-model-rehearsing-aloud-and-improving-years-3-and-4", "Learn from a model", "Discuss a model paragraph, plan a version of your own, rehearse it aloud, improve it and read it aloud.", (who, h) => ({
    pupil: `${h.sheetHead("Learn from a model", who)}<p class="pp-passage">${HARBOUR}</p>
      <p><b>1.</b> What did the writer do? ${tick(["a short opening sentence", "a simile (like dogs on leads)", "speech with speech marks", "a new line for a new speaker", "strong verbs (howled, tugged, burst)"])}</p>
      <p><b>2.</b> Plan your own paragraph about a different place in bad weather. Borrow two things from the model.</p>
      <div class="pp-cols">${box("Place and weather", lines(1))}${box("Two characters", lines(1))}${box("A simile", lines(1))}${box("What one of them says", lines(1))}</div>
      <p><b>3.</b> Say each sentence aloud before you write it. ☐ Then write your paragraph.</p>${lines(5)}
      <p><b>4.</b> Improve it: is it clear who <i>he</i> or <i>she</i> is every time? Change a pronoun to a name if it isn't. Then read it aloud to your adult. ☐</p>`,
    answers: lookForPage(h, "Learn from a model", ["1. All five are in the model", "A plan that borrows features from the model on purpose, not copying its words",
      "Sentences rehearsed aloud, then written as said, including dialogue punctuated correctly", "Pronouns clear, with a name used where 'he' or 'she' could mean two people",
      "Read aloud with intonation, so the speech sounds like speech"], "Ask which feature they borrowed and why it works.")
  }));

  const MESSY = "Last saturday, we go to the beach. The sun was shining and the sea sparkles. My brother and me builded a huge sandcastle, then a wave knock it down. We was very dissapointed, but we laughed anyway. By the time we got home, we had ate all the sandwiches and we have forgot the bucket!";
  add("paper-edit-proofread", "lesson-england-editing-and-proofreading-tense-the-perfect-form-and-effect-years-5-and-6", "Edit it", "Edit a paragraph for tense, the perfect form, spelling and punctuation, then judge and improve its effect.", (who, h) => ({
    pupil: `${h.sheetHead("Edit it", who)}<p class="pp-passage">${MESSY}</p>
      <p><b>1. Tense.</b> The paragraph is about the past. Underline every verb in the wrong tense.</p>
      <p><b>2. The perfect form.</b> Find the last sentence. Which verbs should show what <i>had</i> happened before they got home?</p>${lines(1)}
      <p><b>3. Proofread.</b> Circle the spelling, capital letter and grammar mistakes.</p>
      <p><b>4. Rewrite</b> the paragraph correctly.</p>${lines(5)}
      <p><b>5. Effect.</b> Is it interesting to read? Change or add one thing to make it better, and say why.</p>${lines(2)}`,
    answers: answersPage(h, "Edit it", ["Tense: go → went, sparkles → sparkled, builded → built, knock → knocked, was → were",
      "Perfect form: had ate → had eaten, have forgot → had forgotten", "Proofread: saturday → Saturday, me → I (my brother and I), dissapointed → disappointed",
      "Last Saturday, we went to the beach. The sun was shining and the sea sparkled. My brother and I built a huge sandcastle, then a wave knocked it down. We were very disappointed, but we laughed anyway. By the time we got home, we had eaten all the sandwiches and we had forgotten the bucket!",
      "5. Any change with a reason linked to the reader, for example a more precise verb or an expanded noun phrase"],
      "Ask the pupil to edit in passes (tense, then spelling and punctuation, then effect), and then edit a piece of their own writing the same way.")
  }));

