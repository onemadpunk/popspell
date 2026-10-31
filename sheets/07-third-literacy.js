  /* ===================== Third level (S1 to S3): literacy ===================== */

  add("paper-reading-viewing", T3("choosing-texts-and-explaining-how-well-they-meet-my-needs"), "My reading and viewing", "A log of texts chosen, a review with evidence, and a plan for a text of my own.", (who, h) => ({
    pupil: `${h.sheetHead("My reading and viewing", who)}
      <table class="pp-table"><tr><th>Date</th><th>Title and type (book, article, podcast, film…)</th><th>Why I chose it</th><th>Met my needs? (1–5)</th></tr>${"<tr><td></td><td></td><td></td><td></td></tr>".repeat(4)}</table>
      <h2 class="ws-sub">Review one of them</h2>
      ${box("What I expected or wanted from it", lines(1))}
      ${box("How well it met my needs, with evidence: an example or a short quotation", lines(3))}
      ${box("Who else it would suit, and why", lines(1))}
      ${box("Where I could find more like it, and how far I'd trust that source", lines(1))}
      <h2 class="ws-sub">Plan a text of my own</h2>
      <div class="pp-cols">${box("Subject", lines(1))}${box("Purpose and audience", lines(1))}</div>
      ${box("Form and style (review, blog post, story, report…), and why they suit my audience", lines(2))}`,
    answers: lookForPage(h, "My reading and viewing", ["Texts chosen regularly, for enjoyment or for information", "A personal response justified with evidence from the text, not just \"it was good\"",
      "A clear judgement of how well the text met their needs and expectations", "Some thought about where to find more and how reliable those sources are", "A plan where the form and style clearly suit the purpose and audience"])
  }));

  add("paper-discussion-third", T3("discussion-contributing-building-on-others-and-respecting-other-views"), "Discussion: plan and reflect", "Plan points with evidence before a discussion, track how you built on others, and reflect on spoken language and register.", (who, h) => ({
    pupil: `${h.sheetHead("Discussion: plan and reflect", who)}
      <h2 class="ws-sub">Before</h2>
      ${box("The issue", lines(1))}
      <div class="pp-cols">${box("My view", lines(2))}${box("My evidence (facts, examples, experience)", lines(2))}</div>
      ${box("A question I could ask others", lines(1))}
      <h2 class="ws-sub">During: tick what you used</h2>
      <p>${tick(["\"Building on that…\"", "\"Can you clarify…?\"", "\"I see it differently because…\"", "\"So far we've said…\"", "\"That's a good point, but…\""])}</p>
      <h2 class="ws-sub">After</h2>
      ${box("Someone else's point that made me think again, and how my view changed or grew", lines(2))}
      ${box("Spoken language I used on purpose", tick(["eye contact", "gesture", "pace", "pauses", "emphasis", "tone", "rhetorical question"]))}
      ${box("Was my register formal or informal? Did it suit the audience? Why?", lines(2))}`,
    answers: lookForPage(h, "Discussion: plan and reflect", ["Relevant contributions backed by evidence, not just opinion", "Building on others: asking, clarifying, summarising, supporting or challenging, politely",
      "Respect for the right to hold a different view, even while disagreeing", "A specific example of how their thinking developed or changed", "Features of spoken language used deliberately, and a register suited to the audience"])
  }));

  const TALK_COUNCIL = "Good evening. From the first of March, the High Street will be closed to cars between ten in the morning and four in the afternoon, as a six-month trial. Buses, bikes and blue badge holders will still be able to use it, and deliveries can be made before ten or after four. The council is running the trial because traffic on the High Street has been rising, and many people have told us they would like more space to walk and sit. We will count visitors and ask shops and shoppers for their views every month. At the end of the trial, councillors will look at the results and decide whether to keep the scheme.";
  const TALK_BAKER = "I've run the bakery on the High Street for twenty years, and I'm worried. Lots of my customers are older people who drive in, park for ten minutes and pick up their bread. Where will they go now? To the supermarket on the ring road, that's where. The council says people want more space to sit. Well, I'd like to see who they asked. Nobody asked me, and nobody asked my customers. A trial sounds harmless, but six months is a long time for a small shop. If the street goes quiet, some of us won't be here to see the results.";
  add("paper-listen-note-compare", T3("listening-for-purpose-and-main-ideas-and-making-notes"), "Listen, note, compare", "Notes on two short talks about one issue, comparing their purpose and style, an inference, and a summary.", (who, h) => ({
    pupil: `${h.sheetHead("Listen, note, compare", who)}<p>Your adult will read two short talks about the same plan. Listen once, then make notes the second time: key words, not sentences.</p>
      <table class="pp-table"><tr><th></th><th>Talk 1</th><th>Talk 2</th></tr>
        ${["Who is speaking?", "Purpose", "Main points", "Style: formal or informal? facts or opinions?"].map(r => `<tr><th>${r}</th><td style="height:${r === "Main points" ? 70 : 34}px"></td><td></td></tr>`).join("")}</table>
      ${box("One way the talks are similar, and one way they're different", lines(2))}
      ${box("The second speaker says \"I'd like to see who they asked.\" What is the speaker suggesting?", lines(2))}
      ${box("Use your notes: sum up the plan and the views on it for someone who missed both talks", lines(4))}`,
    answers: `${h.brandHead("For the adult: Listen, note, compare", "Read each talk aloud twice: once to listen, once for notes.")}
      <p><b>Talk 1: a council officer</b></p><p class="pp-passage">${TALK_COUNCIL}</p>
      <p><b>Talk 2: a baker on the High Street</b></p><p class="pp-passage">${TALK_BAKER}</p>
      <ul class="ws-answers"><li><b>Purpose:</b> Talk 1 informs about the trial; Talk 2 gives an opinion and tries to persuade.</li>
        <li><b>Main points:</b> closed to cars 10 to 4 for six months; buses, bikes, blue badges and early or late deliveries allowed; traffic rising; checked monthly, then councillors decide. Talk 2: older customers drive in; they'll go to the supermarket; not consulted; small shops may close.</li>
        <li><b>Style:</b> Talk 1 formal and factual; Talk 2 informal and personal, with a rhetorical question.</li>
        <li><b>Inference:</b> that the council didn't ask people fairly, or only asked people who agreed, so its claim may not be reliable.</li></ul>
      <p>Look for notes in key words, an accurate account of each purpose, and a summary that is balanced and in the pupil's own words.</p>`
  }), { needsAdult: true });

  const SPEECH_PARK = "Friends, neighbours, everyone who has ever kicked a ball on Millfield Green: thank you for coming. Imagine our town without its only park. Imagine children with nowhere to play but the street. That is what will happen if the plan to build forty flats on the green goes ahead. We are not against new homes. We are against losing the one place where everyone, young and old, can breathe. Eight hundred people have already signed our petition. Eight hundred! Doctors tell us that time outdoors makes us healthier and happier. So why would anyone take it away? The council meets on Thursday. Come with us. Bring your family. Bring your voice. Together, we can save Millfield Green.";
  add("paper-spot-persuasion", T3("commenting-on-spoken-texts-and-recognising-persuasion"), "Spot the persuasion", "Name the persuasive techniques in a campaign speech, explain their effect, and judge how reliable it is.", (who, h) => ({
    pupil: `${h.sheetHead("Spot the persuasion", who)}<p>Your adult will read a campaign speech aloud, twice. Listen for how the speaker tries to persuade you.</p>
      ${box("What does the speaker want the audience to do?", lines(1))}
      <table class="pp-table"><tr><th>Technique</th><th>What the speaker said</th><th>The effect on the audience</th></tr>
        ${["Emotive language", "Repetition", "Rhetorical question", "Statistic", "Speaking directly to the audience", "Appeal to experts"].map(t => `<tr><td>${t}</td><td style="height:38px"></td><td></td></tr>`).join("")}</table>
      ${box("Comment on the speech's form and style: how is it organised, and how does it end?", lines(2))}
      ${box("How reliable is this speaker as a source? Which claims could you check, and which are vague?", lines(3))}
      ${box("What would you want to hear from the other side before deciding?", lines(2))}`,
    answers: `${h.brandHead("For the adult: Spot the persuasion", "Read the speech aloud twice, with expression.")}
      <p class="pp-passage">${SPEECH_PARK}</p>
      <ul class="ws-answers"><li><b>Wants:</b> people to come to the council meeting on Thursday and oppose the flats.</li>
        <li><b>Emotive:</b> \"children with nowhere to play but the street\", \"breathe\". <b>Repetition:</b> \"Imagine…\", \"Bring your…\", \"Eight hundred\". <b>Rhetorical question:</b> \"So why would anyone take it away?\"
          <b>Statistic:</b> 800 signatures. <b>Direct address:</b> \"Friends, neighbours\", \"Come with us\". <b>Experts:</b> \"Doctors tell us\".</li>
        <li><b>Form:</b> a greeting, a picture of the loss, the facts, then a call to action, ending on short commands and \"Together\".</li>
        <li><b>Reliability:</b> a campaigner, so one-sided. The petition total and the council date can be checked; \"doctors tell us\" is vague (which doctors?); \"nowhere to play\" may exaggerate.</li>
        <li><b>Other side:</b> why the flats are needed, who would live there, and whether any green space would be kept.</li></ul>`
  }), { needsAdult: true });

  add("paper-talk-planner", T3("giving-a-talk-clear-structured-and-engaging"), "Talk planner", "Plan a three-minute talk: hook, signposted points with evidence, conclusion, resources, delivery, and feedback.", (who, h) => ({
    pupil: `${h.sheetHead("Talk planner", who)}
      <div class="pp-cols">${box("Topic", lines(1))}${box("Audience and purpose", lines(1))}</div>
      ${box("Hook: how I'll grab attention in the first 15 seconds", lines(2))}
      ${[1, 2, 3].map(n => box(`Point ${n}: signpost words, the point, and my evidence or example`, lines(2))).join("")}
      ${box("Conclusion: sum up and leave them thinking", lines(2))}
      <div class="pp-cols">${box("Resource (picture, object, slides) and how it helps", lines(2))}${box("Delivery: tick when rehearsed", tick(["pace", "pauses", "eye contact", "emphasis", "tone"]))}</div>
      <div class="pp-cols">${box("Feedback: one strength", lines(1))}${box("Feedback: one next step", lines(1))}</div>`,
    answers: lookForPage(h, "Talk planner", ["An opening that tries to engage the audience", "Points in a logical order, with clear signposts (topic sentences, linking phrases)",
      "Ideas backed by detail or evidence", "A conclusion that sums up", "Tone, vocabulary and non-verbal techniques suited to the audience", "A resource that helps rather than distracts"])
  }));

  const BELL_ROCK = ["Eleven miles off the coast of Angus lies the Inchcape reef, a treacherous ridge of rock that is submerged by the sea at every high tide. For centuries, ships struck it in the dark and were wrecked.",
    "In 1807, the engineer Robert Stevenson began a project many people thought impossible: a stone lighthouse on the reef itself. The perilous work could only be done at low tide, for a few hours at a time, and the men lived on a ship anchored nearby. Each granite block was cut on land and shaped so that it dovetailed into its neighbours, locking the tower together against the waves.",
    "The ingenious design worked. The Bell Rock Lighthouse was first lit in 1810, and it still stands today: the oldest surviving sea-washed lighthouse in the world."];
  add("paper-reading-toolkit", T3("reading-fluently-and-using-reading-strategies"), "Reading toolkit", "Skim, scan, work out new words from roots and context, read aloud with expression, and summarise.", (who, h) => ({
    pupil: `${h.sheetHead("Reading toolkit", who)}
      ${BELL_ROCK.map((p, i) => `<p class="pp-passage"><b>${i + 1}</b> &nbsp;${p}</p>`).join("")}
      ${qs([`<b>Skim</b> the text in 20 seconds. What is it about, in one sentence?${lines(1)}`,
        `<b>Scan</b> for the facts: when was the lighthouse first lit? ${blank(4)} Who built it? ${blank(7)}`,
        `<b>Word work.</b> Use roots and context clues to explain: submerged (sub- means under) ${blank(10)} treacherous ${blank(10)} perilous ${blank(10)} dovetailed ${blank(10)} ingenious ${blank(10)}`,
        `<b>Read aloud.</b> In paragraph 2, mark / where you'd pause and underline two words to stress. Read it aloud twice.`,
        `<b>Summarise</b> each paragraph in one sentence.${lines(3)}`,
        `<b>Question.</b> Write one thing you'd still like to find out, and where you'd look.${lines(1)}`])}`,
    answers: answersPage(h, "Reading toolkit", ["The building of a lighthouse on a dangerous reef that's underwater at high tide", "1810; the engineer Robert Stevenson",
      "submerged: under the water; treacherous: dangerous, ready to cause harm; perilous: full of danger; dovetailed: fitted together tightly like interlocking pieces; ingenious: very clever and inventive",
      "Pauses at commas and full stops; stress words such as impossible, low tide, locking", "1: A hidden reef wrecked ships for centuries. 2: Stevenson built a lighthouse on it, working at low tide with interlocking stone blocks. 3: It worked, and it's still standing as the oldest of its kind.",
      "Any sensible question and a suitable source"], "Ask which strategy helped most, and listen to the reading for pace, pauses and expression.")
  }));

  const SOURCE_A = "The Forth Bridge carries the railway across the Firth of Forth between South Queensferry and North Queensferry. It opened in 1890 and was one of the first major structures in Britain built mainly of steel. Its design is called a cantilever bridge: three huge diamond-shaped towers support arms that reach out towards each other. The bridge is about 2.5 kilometres long. In 2015 it was named a UNESCO World Heritage Site.";
  const SOURCE_B = "Honestly, photos don't do it justice. Standing under the Forth Bridge, you feel tiny: it's this enormous red monster of steel stretching off across the water. Trains still rattle over it all day; we watched one from the beach at South Queensferry and it took ages to cross. People say painting it is a job that never ends, but a guide told us it was given a new coat between 2002 and 2011 that should last for decades. Definitely worth a day trip!";
  add("paper-two-sources", T3("finding-summarising-and-noting-information-from-more-than-one-source"), "Two sources", "Make linked notes from an information board and a travel blog, judge each source, then write a summary from both.", (who, h) => ({
    pupil: `${h.sheetHead("Two sources", who)}
      <p><b>Source A: a visitor information board</b></p><p class="pp-passage">${SOURCE_A}</p>
      <p><b>Source B: a travel blog</b></p><p class="pp-passage">${SOURCE_B}</p>
      <table class="pp-table"><tr><th>Question</th><th>Source A</th><th>Source B</th></tr>
        ${["When was it built, and what of?", "How long is it, and what is its design?", "Painting and colour", "What it's like to visit"].map(q => `<tr><td>${q}</td><td></td><td></td></tr>`).join("")}</table>
      ${box("Which source is better for facts, and which for what it's like? Why?", lines(2))}
      ${box("Summary in your own words, using both sources. Say which source each point came from.", lines(4))}`,
    answers: lookForPage(h, "Two sources", ["A: opened 1890, mainly steel, cantilever, about 2.5 km, World Heritage Site 2015. B: steel, red, repainted 2002 to 2011 to last decades, trains still use it, feels enormous, worth a visit",
      "Both: steel, railway, South Queensferry", "A is better for facts: it's an official information board giving dates and figures. B is better for the experience, but is personal opinion, and its painting fact is second-hand (\"a guide told us\"), so check it",
      "A summary in their own words that links both sources and names them, not copied sentences"])
  }));

  const STORM = ["The storm had been building all afternoon. By six o'clock, the sky over the harbour was the colour of a bruise, and the wind screamed through the rigging of the moored boats. Isla stood at the window, her hands pressed flat against the cold glass.",
    "Her father's boat was not in the harbour.",
    "She had checked three times. She checked again. The other boats rocked and tugged at their ropes like nervous dogs, but the space at the end of the pier, where the Morning Star always sat, was empty: a gap of black water.",
    "Behind her, the radio crackled. Isla did not turn round. If she did not hear the message, she told herself, it could not be bad news."];
  add("paper-close-reading", T3("close-reading-purpose-inference-and-language"), "Close reading", "A short story opening with literal, inferential, language and evaluative questions.", (who, h) => ({
    pupil: `${h.sheetHead("Close reading", who)}
      <div class="pp-passage" style="font-size:12.5pt">${STORM.map(p => `<p style="margin:0 0 6px">${p}</p>`).join("")}</div>
      ${qs([`<i>Literal.</i> What time is it, and where is Isla standing? ${lines(1)}`,
        `<i>Inferential.</i> How is Isla feeling? Give two pieces of evidence. ${lines(2)}`,
        `<i>Inferential.</i> Why does Isla not turn round when the radio crackles? ${lines(1)}`,
        `<i>Language.</i> "the wind screamed": name the technique and explain its effect. ${lines(1)}`,
        `<i>Language.</i> "the sky … was the colour of a bruise": what does this suggest about the storm? ${lines(1)}`,
        `<i>Language.</i> Why is "Her father's boat was not in the harbour." a paragraph on its own? ${lines(1)}`,
        `<i>Evaluative.</i> How well does this opening build tension? Refer to two techniques. ${lines(2)}`])}`,
    answers: answersPage(h, "Close reading", ["Six o'clock; at a window overlooking the harbour", "Afraid or anxious: hands pressed flat against the glass; checking again and again; not turning round to the radio",
      "She fears it's bad news about her father; while she doesn't hear it, she can still hope", "Personification: the wind sounds human, violent and frightening, adding to the danger and fear",
      "Dark, purple and painful-looking: the storm is threatening, and it hints at injury or harm", "It's short and stark, so the key fact stands out, shocks the reader and builds tension",
      "A judgement with evidence, such as the short paragraph, the personification, the simile \"like nervous dogs\", or the delayed radio message"],
      "Good language answers quote, name the technique, then explain the effect on the reader.")
  }));

  const SPRINT_ADVERT = "NEW SprintMax trainers! Run faster from the very first step. Our revolutionary FlexSpring sole gives you the edge every champion needs. Why settle for second best? 9 out of 10 runners agree: SprintMax makes you faster!* Don't get left behind: get yours today!<br><small>*Survey of 20 SprintMax staff, March.</small>";
  const SPRINT_TEST = "We tested SprintMax against three other running shoes priced between £50 and £90. Six club runners ran the same 5 km course in each pair, on different days. Their average times in SprintMax were within a few seconds of the other shoes, a difference too small to show the shoe made them faster. Testers found SprintMax comfortable, but the sole wore down after about 300 km, sooner than two of the others. Our verdict: a comfortable shoe at a fair price, but no evidence for the speed claims.";
  add("paper-trust-this", T3("persuasion-and-reliable-sources-in-reading"), "Can I trust this?", "An advert and a product test about the same trainers: persuasive techniques, facts and claims, reliability, and an informed view.", (who, h) => ({
    pupil: `${h.sheetHead("Can I trust this?", who)}
      <p><b>Text A: an advert</b></p><div class="pp-advert">${SPRINT_ADVERT}</div>
      <p><b>Text B: a product test in a consumer magazine</b></p><p class="pp-passage">${SPRINT_TEST}</p>
      <table class="pp-table"><tr><th>Technique in Text A</th><th>Quotation</th><th>Effect on the reader</th></tr>${"<tr><td></td><td></td><td></td></tr>".repeat(3)}</table>
      ${box("Read the small print in Text A. Why does it matter?", lines(2))}
      <table class="pp-table"><tr><th></th><th>Text A</th><th>Text B</th></tr>${["Who wrote it, and why?", "What evidence does it give?", "How reliable is it? (1–5)"].map(r => `<tr><th>${r}</th><td></td><td></td></tr>`).join("")}</table>
      ${box("Your informed view: would you buy SprintMax to run faster? Use both texts.", lines(3))}`,
    answers: answersPage(h, "Can I trust this?", ["Techniques: exaggerated word choice (\"revolutionary\", \"every champion\"), rhetorical question (\"Why settle for second best?\"), statistic (\"9 out of 10\"), commands and urgency (\"Don't get left behind\"), direct address (\"you\")",
      "The \"9 out of 10\" is from just 20 people, all working for SprintMax, so it's biased and tells us nothing", "A: the company, to sell trainers; no fair evidence; low. B: a consumer tester, to inform buyers; a test with six runners on the same course; higher, though six runners is a small test",
      "No for speed: the fair test found no real difference; a good answer may still choose them for comfort or price, weighing up both texts"])
  }));

  add("paper-under-surface", T3("character-setting-theme-and-the-writer-s-style"), "Under the surface", "For any story or novel: how a character changes, setting and mood, structure, theme, and the writer's style, with evidence.", (who, h) => ({
    pupil: `${h.sheetHead("Under the surface", who)}
      ${box("Text and author", lines(1))}
      <div class="pp-cols3">${["At the start", "In the middle", "At the end"].map(t => box(`Main character: ${t.toLowerCase()} (a quotation)`, lines(3))).join("")}</div>
      ${box("How and why the character changes", lines(2))}
      <div class="pp-cols">${box("Setting: a quotation", lines(2))}${box("The mood it creates, and how", lines(2))}</div>
      ${box("Structure: how the story is organised (order, chapters, viewpoint), and why the writer might have chosen it", lines(2))}
      ${box("Theme in one sentence, and how it links to my life or others' experiences", lines(2))}
      ${box("One feature of the writer's style or the genre, an example, and its effect", lines(2))}`,
    answers: lookForPage(h, "Under the surface", ["Evaluative comments on character, setting and structure, backed by quotations", "A theme stated as an idea, not a plot summary, and linked to real experience",
      "A feature of style or genre identified, with an example and its effect explained", "Evidence chosen from across the text, not just the opening"])
  }));

  const SUBJECT_WORDS = [["Science", ["hypothesis", "experiment", "temperature"]], ["Maths", ["perpendicular", "parallel", "equation"]], ["Social subjects", ["parliament", "government", "environment"]], ["English", ["rhythm"]]];
  add("paper-subject-spellings", T3("spelling-specialist-and-tricky-words-accurately"), "Subject spellings", "Syllables, roots, memory tricks, a dictation of specialist words, self-checking, and what a spellchecker misses.", (who, h) => ({
    pupil: `${h.sheetHead("Subject spellings", who)}
      ${qs([`<b>Syllables.</b> Split each word: photosynthesis ${blank(9)} temperature ${blank(8)} vocabulary ${blank(8)} environment ${blank(8)}`,
        `<b>Roots.</b> Write two words for each root: photo (light) ${blank(9)} graph (write) ${blank(9)} tele (far) ${blank(9)} bio (life) ${blank(9)} micro (small) ${blank(9)}`,
        `<b>Memory tricks.</b> Make up a trick for two of these: necessary, separate, rhythm, definitely, government.${lines(2)}`])}
      <div class="pp-q"><p><b>4. Dictation.</b> Your adult will say ten words. Write them, then circle any you're unsure of and check them in a dictionary.</p>
        <div class="pp-cols">${Array.from({ length: 10 }, (_, i) => `<p>${i + 1}. ${blank(10)}</p>`).join("")}</div></div>
      ${qs([`<b>Spellcheckers.</b> Correct this sentence: "Their going too the libary to by a knew dictionary." Which mistakes would a spellchecker miss, and why?${lines(2)}`,
        `<b>My list.</b> Five specialist words from my subjects this week:${lines(1)}`], 5)}`,
    answers: `${h.brandHead("For the adult: Subject spellings", "Say each word, use it in a sentence, then say it again.")}
      <table class="pp-table"><tr><th>Subject</th><th>Words to say</th></tr>${SUBJECT_WORDS.map(([s, ws]) => `<tr><td>${s}</td><td>${ws.join(", ")}</td></tr>`).join("")}</table>
      <ol class="ws-answers"><li>pho-to-syn-the-sis; tem-per-a-ture; vo-cab-u-la-ry; en-vi-ron-ment</li><li>For example photograph, photocopy; autograph, paragraph; telephone, television; biology, biography; microscope, microphone</li>
        <li>Any trick that works for the pupil, such as \"necessary: one collar, two sleeves\" or \"rhythm helps your two hips move\"</li><li>The ten words above</li>
        <li>They're going to the library to buy a new dictionary. A spellchecker misses their, too, by and knew because they're real words; it would catch libary.</li><li>Words from the pupil's own subjects</li></ol>`
  }), { needsAdult: true });

  add("paper-sentence-workshop", T3("sentences-punctuation-and-paragraphs"), "Sentence workshop", "Fix run-on sentences, build complex sentences, use colons, brackets, semicolons, ellipses and inverted commas, vary openings, and plan a paragraph.", (who, h) => ({
    pupil: `${h.sheetHead("Sentence workshop", who)}
      ${qs([`Fix this run-on sentence in three ways (a full stop, a semicolon, a conjunction): "The match was cancelled, it rained all day."${lines(3)}`,
        `Join into one complex sentence: "It was late. We kept walking. We wanted to reach the hut."${lines(1)}`,
        `Punctuate: <br>a) You will need three things a torch, a map and a warm coat.${lines(1)}b) My cousin who lives in Oban is visiting next week.${lines(1)}c) Where are you going asked Mum${lines(1)}d) I love summer my brother prefers winter.${lines(1)}`,
        `Write a sentence that ends with an ellipsis to build suspense.${lines(1)}`,
        `Rewrite so each sentence starts differently: "I got up late. I ran to the bus stop. I saw the bus leave."${lines(2)}`,
        `Write a paragraph on <i>the best way to spend a Saturday</i>. Include a topic sentence, one complex sentence, a colon, a pair of brackets and a linking phrase (However, As a result, In addition…).${lines(5)}`])}`,
    answers: answersPage(h, "Sentence workshop", ["The match was cancelled. It rained all day. / The match was cancelled; it rained all day. / The match was cancelled because it rained all day.",
      "For example: Although it was late, we kept walking because we wanted to reach the hut.", "a) things: a torch…  b) My cousin (who lives in Oban) is visiting next week.  c) \"Where are you going?\" asked Mum.  d) I love summer; my brother prefers winter.",
      "Any sentence where the ellipsis creates suspense, such as \"The door creaked open, and there, in the dark…\"", "For example: Waking up late, I ran to the bus stop. Just as I got there, the bus pulled away.",
      "A clear topic sentence, a complex sentence, and the colon, brackets and linking phrase used correctly"])
  }));

  const LITTER = "On saturday our class done a litter pick in the park. we picked up loads and loads of litter. there was crisp packets, cans, and loads of plastic bottles. It was good. Mr Reid said we had collected 14 bags wich is the most ever. The park looked much better after, people walking there thanked us. We are going to do it agian next term and anyone can come";
  add("paper-edit-design", T3("editing-and-layout-that-helps-the-reader"), "Edit and design", "Edit a report in three passes (meaning, language, accuracy), then design a poster for a different reader and explain the layout.", (who, h) => ({
    pupil: `${h.sheetHead("Edit and design", who)}
      <p class="pp-passage">${LITTER}</p>
      ${qs([`<b>Pass 1: meaning.</b> What would a reader from another school need to know that's missing?${lines(1)}`,
        `<b>Pass 2: language.</b> Replace the vague or repeated words (loads, good) with better ones.${lines(1)}`,
        `<b>Pass 3: accuracy.</b> Mark every spelling, punctuation and grammar mistake on the text.`,
        `Rewrite the report so it's clear at first reading.${lines(5)}`])}
      <div class="pp-side"><div class="pp-draw" style="width:70mm;height:60mm"></div><div class="pp-q"><p><b>5.</b> Sketch a poster inviting families to the next litter pick. Use a heading, bullet points and a picture.</p>
        <p><b>6.</b> Explain two of your layout choices: what does each do for your reader?</p>${lines(3)}</div></div>`,
    answers: answersPage(h, "Edit and design", ["Which park, why the class did it, and when the next one is and how to join", "For example: dozens of, a huge amount of; worthwhile, satisfying",
      "saturday → Saturday; done → did; we → We; there → There; was → were; wich → which; after, people → after. People; agian → again; full stop at the end",
      "For example: On Saturday, our class held a litter pick in Victoria Park. We collected a huge amount of rubbish: crisp packets, cans and dozens of plastic bottles. Mr Reid said our 14 bags were the most ever collected. The park looked much better afterwards, and people walking there thanked us. We will do it again next term, and anyone is welcome to join us.",
      "A heading, key details in bullet points (when, where, what to bring) and a picture", "Choices explained by their effect on the reader, such as finding the date quickly"])
  }));

  const BEES = "Honeybees live together in colonies. In summer, a strong colony can have more than 50,000 bees, but only one of them is the queen, who lays the eggs. The worker bees, which are all female, collect nectar and pollen from flowers. When a worker finds a good patch of flowers, she returns to the hive and performs a \"waggle dance\" that tells the others which direction to fly and how far to go. As they move from flower to flower, bees carry pollen with them, which helps many plants, including fruit crops such as apples, to produce seeds and fruit.";
  add("paper-notes-to-writing", T3("using-notes-and-sources-in-my-writing"), "From notes to writing", "Make notes from a source, put a point in your own words, quote correctly, record sources, and plan and start a short report.", (who, h) => ({
    pupil: `${h.sheetHead("From notes to writing", who)}
      <p><b>Source: an information leaflet</b></p><p class="pp-passage">${BEES}</p>
      ${qs([`Make notes: key words only, under headings you choose.${lines(3)}`,
        `Put this in your own words: "When a worker finds a good patch of flowers, she returns to the hive and performs a 'waggle dance'."${lines(2)}`,
        `Choose a short phrase worth quoting exactly. Write a sentence that uses it, in quotation marks.${lines(1)}`,
        `Find a second source on bees. Record it: title, author or organisation, date, web address.${lines(2)}`])}
      <div class="pp-cols">${box("Report plan: introduction", lines(1))}${box("Point 1, with detail", lines(1))}${box("Point 2, with detail", lines(1))}${box("Conclusion", lines(1))}</div>
      ${box("Write your opening paragraph", lines(3))}`,
    answers: lookForPage(h, "From notes to writing", ["Notes in key words, organised under headings, not copied sentences", "A rewording that keeps the meaning but changes the words and sentence structure",
      "A short, well-chosen quotation, correctly punctuated and fitted into the pupil's sentence", "A second source recorded with enough detail for someone else to find it, and a sensible choice of source",
      "A plan in a logical order, and an opening that introduces the topic for the reader"])
  }));

  add("paper-explain-it", T3("writing-to-inform-describe-and-explain"), "Explain it", "Plan and write an explanation of a process: reader, stages with topic sentences, cause and effect words, technical words and a diagram.", (who, h) => ({
    pupil: `${h.sheetHead("Explain it", who)}
      <div class="pp-cols">${box("The process I'll explain", lines(1))}${box("My reader, and what they know already", lines(1))}</div>
      ${box("Title, and an introduction: what it is and why it matters", lines(2))}
      ${[1, 2, 3].map(n => box(`Stage ${n}: topic sentence and detail`, lines(2))).join("")}
      <p class="pp-bank"><b>Linking words:</b> because, so, as a result, this means that, which causes, first, next, finally</p>
      <div class="pp-cols">${box("Technical words, and what they mean", lines(3))}${box("Diagram", `<div class="pp-draw pp-short"></div>`)}</div>
      ${box("Conclusion", lines(1))}`,
    answers: lookForPage(h, "Explain it", ["A style and format suited to the reader, with features of an explanation (title, introduction, stages, technical words, diagram)",
      "Relevant information with supporting detail, in a logical order", "Topic sentences that signpost each paragraph", "Linking words that show sequence and cause and effect", "A tone and vocabulary that suit the reader"])
  }));

  add("paper-make-case", T3("writing-to-persuade-and-argue"), "Make your case", "Plan a persuasive article: hook, view, points with evidence, the other side and an answer, techniques, and a conclusion.", (who, h) => ({
    pupil: `${h.sheetHead("Make your case", who)}
      ${box("Issue (for example: should the school day start later?)", lines(1))}
      <div class="pp-cols">${box("My view", lines(1))}${box("Hook to open with", lines(1))}</div>
      ${[1, 2, 3].map(n => box(`Point ${n}: point, evidence (a fact, statistic, expert or example), and why it matters`, lines(2))).join("")}
      ${box("The other side says… and my answer is…", lines(2))}
      ${box("Techniques I'll use", tick(["rhetorical question", "repetition", "emotive language", "statistic", "direct address"]))}
      ${box("Conclusion: sum up my line of thought, and end strongly", lines(2))}`,
    answers: lookForPage(h, "Make your case", ["A clear point of view, stated early, with an introduction that engages", "Points in a logical order with relevant evidence, signposted by topic sentences and linking phrases",
      "The other side answered, not ignored", "Persuasive language used on purpose, without relying on it instead of evidence", "A conclusion that sums up the argument"])
  }));

  add("paper-moment-mattered", T3("writing-about-a-personal-experience"), "A moment that mattered", "Plan personal writing: a feelings timeline, setting from the senses, showing not telling, and reflection.", (who, h) => ({
    pupil: `${h.sheetHead("A moment that mattered", who)}
      ${box("The experience, in one sentence", lines(1))}
      <h2 class="ws-sub">Feelings timeline</h2>
      <div class="pp-cols3">${["Before", "When it started", "The turning point", "Straight after", "Now, looking back"].map(t => box(t, lines(2))).join("")}</div>
      <div class="pp-cols3">${box("I could see…", lines(1))}${box("I could hear…", lines(1))}${box("I could feel or smell…", lines(1))}</div>
      ${box("Show, don't tell: rewrite \"I was nervous\" in two ways", lines(2))}
      ${box("Reflection: Looking back, I realise… / It taught me…", lines(2))}
      ${box("My opening paragraph", lines(3))}`,
    answers: lookForPage(h, "A moment that mattered", ["A clear context and setting for the events", "Events described with feelings and reactions made clear, changing as the experience goes on",
      "Feelings shown through actions, thoughts and the senses, not only named", "Some reflection on the experience", "Language, style and tone that engage the reader"])
  }));

  add("paper-story-builder", T3("creating-texts-in-a-genre-characters-and-settings"), "Story builder", "Plan a story in a chosen genre: its features, a convincing character, a setting with mood, a structure, then the opening scene.", (who, h) => ({
    pupil: `${h.sheetHead("Story builder", who)}
      <div class="pp-cols">${box("Genre", lines(1))}${box("Features readers expect from it", lines(1))}</div>
      <div class="pp-cols">${box("Character: name, what they want, what they fear", lines(2))}${box("A secret, how they speak, and a line of their dialogue", lines(2))}</div>
      ${box("Setting: three senses, and one detail that hints at the mood", lines(2))}
      <div class="pp-cols3">${["Hook", "Problem", "Rising tension", "Turning point", "Ending or cliffhanger"].map(t => box(t, lines(1))).join("")}</div>
      ${box("The opening scene", lines(7))}`,
    answers: lookForPage(h, "Story builder", ["Key features of the chosen genre used on purpose", "A character with believable wants, fears and a voice of their own",
      "A setting that comes to life through detail, and creates mood", "A structure planned to engage the reader, with an opening hook", "Language chosen for effect"])
  }));

