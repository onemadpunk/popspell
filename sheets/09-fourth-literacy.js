  /* ===================== Fourth level (S3): literacy ===================== */

  add("paper-reading-purpose", T4("reading-widely-and-developing-my-own-style"), "Reading with purpose", "A reading plan that fills gaps, a response justified by the text, and an experiment with another writer's style.", (who, h) => ({
    pupil: `${h.sheetHead("Reading with purpose", who)}
      ${box("What I've read, watched or listened to this term, and what's missing (a genre, a period, non-fiction, poetry…)", lines(2))}
      <div class="pp-cols">${box("Two new sources to fill the gap, and how I found them", lines(2))}${box("Why I trust those recommendations", lines(2))}</div>
      ${box("My response to one text: my opinion, with two short quotations that justify it", lines(4))}
      ${box("A writer's style I admire: one feature and its effect", lines(2))}
      ${box("My paragraph trying that feature, for my own audience", lines(5))}
      ${box("The choice I made on purpose, and why it suits my audience", lines(1))}`,
    answers: lookForPage(h, "Reading with purpose", ["Independent, regular choices that widen the range of reading, with sources found deliberately", "An opinion justified by relevant reference to the text, not just retelling",
      "A clear judgement of how well the text met their needs", "A style feature identified accurately and used deliberately in their own paragraph", "Choices of genre, form, structure and style explained in terms of the audience"])
  }));

  add("paper-chair-toolkit", T4("leading-and-sustaining-a-discussion"), "Chair's toolkit", "Prepare to chair a discussion, track who has contributed, and evaluate how it went and the spoken language used.", (who, h) => ({
    pupil: `${h.sheetHead("Chair's toolkit", who)}
      ${box("The question for discussion", lines(1))}
      <div class="pp-cols">${box("My opening (what's at stake, and the ground rules)", lines(3))}${box("Questions to bring in other views", lines(3))}</div>
      ${box("Who has spoken? (tally) and who still needs to be invited in", `<table class="pp-table"><tr><th>Name</th><th>Contributions</th><th>Name</th><th>Contributions</th></tr>${"<tr><td></td><td></td><td></td><td></td></tr>".repeat(3)}</table>`)}
      ${box("Summaries I gave during the discussion", lines(2))}
      ${box("When I was challenged: what was said, how I responded, and whether my view changed", lines(3))}
      ${box("A feature of spoken language someone used well, and its effect on the listeners", lines(2))}
      ${box("My register: how formal was I, and was it right for this group?", lines(1))}`,
    answers: lookForPage(h, "Chair's toolkit", ["Full participation with relevant ideas and convincing evidence", "Everyone given a chance to contribute; quieter voices invited in", "A positive response to challenge, with thinking adapted where appropriate",
      "Contributions explored, expanded, clarified, summarised or challenged", "Features of spoken language identified with their effect on the listener; a register sustained to suit the group"])
  }));

  const VOICE_HEAD = "We've looked carefully at the idea of a four-day week for senior pupils, with Fridays for independent study and work placements. The appeal is real: pupils would get more time for coursework, and some would gain experience of the workplace. But there are serious questions. Not every pupil has a quiet place to study at home, and not every family can supervise a teenager on a weekday. We'd also have to fit the same teaching into fewer days, which means longer days. So our position is that we'd only consider a trial, with a study space open in school every Friday, and we'd want to hear from families first.";
  const VOICE_PARENT = "Honestly, I think it's madness. I work full time, my partner works full time, and you're telling me my fifteen-year-old is going to sit at home every Friday and study? Come on. He'll be on his games console by nine o'clock. And what about the kids who need school the most, the ones who get a proper breakfast there and a bit of calm? They're the ones who'll lose out. Work placements sound lovely, but who's checking they're real? I'm all for giving young people responsibility, but this isn't the way.";
  add("paper-two-voices", T4("listening-comparing-texts-and-synthesising-notes"), "Two voices", "Notes on two spoken texts about a four-day school week, a comparison of purpose and style, an inference, and a synthesised briefing.", (who, h) => ({
    pupil: `${h.sheetHead("Two voices", who)}<p>Your adult will read two spoken texts about the same idea: a head teacher in an interview, and a parent on a radio phone-in. Listen once, then make notes the second time.</p>
      <table class="pp-table"><tr><th></th><th>Head teacher</th><th>Parent</th></tr>${["Purpose and audience", "Main points", "Style and language (with an example)"].map(r => `<tr><th>${r}</th><td style="height:${r === "Main points" ? 70 : 44}px"></td><td></td></tr>`).join("")}</table>
      ${box("Synthesis: where do they agree, where do they differ, and whose evidence is stronger?", lines(3))}
      ${box("What does the parent suggest, without saying it directly, about who the plan would suit?", lines(2))}
      ${box("A briefing for a parents' meeting that combines both views, in your own words", lines(5))}`,
    answers: `${h.brandHead("For the adult: Two voices", "Read each text aloud twice, the second in a more heated, informal voice.")}
      <p><b>A head teacher, in an interview</b></p><p class="pp-passage" style="font-size:12pt">${VOICE_HEAD}</p>
      <p><b>A parent, on a radio phone-in</b></p><p class="pp-passage" style="font-size:12pt">${VOICE_PARENT}</p>
      <ul class="ws-answers"><li><b>Purpose:</b> the head teacher informs and sets out a cautious position for families; the parent persuades listeners against the idea.</li>
        <li><b>Agree:</b> both worry about pupils without study space or supervision at home. <b>Differ:</b> the head teacher sees real benefits and would consider a trial; the parent rejects it.</li>
        <li><b>Style:</b> formal, balanced and conditional (\"we'd only consider…\") against informal, emotive and one-sided, with rhetorical questions (\"who's checking they're real?\").</li>
        <li><b>Inference:</b> that the plan would suit families with time and space at home, and widen the gap for pupils who rely on school.</li>
        <li><b>Look for:</b> notes in their own words, a synthesis by theme rather than by speaker, and a fair briefing.</li></ul>`
  }), { needsAdult: true });

  const SPEECH_CENTRE = "Fellow residents, for too long this town has been forgotten. Our young people have nowhere to go, our older people have nowhere to swim, and our old leisure centre has been crumbling for decades. Decades! Today I am asking you to back a new centre: a pool, a gym, a sports hall and a café, open seven days a week. It will cost £14 million, but think what it will save. Every pound spent on sport saves the health service four pounds, the experts say. Every child who learns to swim is a life that might be saved. Can we really put a price on that? Our neighbours in the next town built theirs five years ago, and they have never looked back. So vote for the leisure centre on Thursday. Vote for your health. Vote for your children. Vote for a town that is forgotten no more.";
  add("paper-weigh-speech", T4("evaluating-spoken-texts-persuasion-and-credibility"), "Weighing a speech", "Identify and evaluate the persuasive techniques in a councillor's speech, and judge the credibility of its claims.", (who, h) => ({
    pupil: `${h.sheetHead("Weighing a speech", who)}<p>Your adult will read a councillor's speech aloud, twice.</p>
      <table class="pp-table"><tr><th>Technique</th><th>Example</th><th>How effective for this audience? Why?</th></tr>${["Hyperbole", "Repetition", "Emotive language", "Statistic or expert claim", "Rhetorical question", "Comparison"].map(t => `<tr><td>${t}</td><td style="height:40px"></td><td></td></tr>`).join("")}</table>
      ${box("How is the speech structured, and how effective is its ending?", lines(2))}
      ${box("Credibility: which claims could be checked, which are vague, and what interest does the speaker have?", lines(3))}
      ${box("What important information is missing? What would you ask the councillor?", lines(2))}`,
    answers: `${h.brandHead("For the adult: Weighing a speech", "Read the speech aloud twice, like a rally speech.")}
      <p class="pp-passage">${SPEECH_CENTRE}</p>
      <ul class="ws-answers"><li><b>Hyperbole:</b> \"crumbling for decades\", \"never looked back\". <b>Repetition:</b> \"Decades!\", \"Vote for…\" three times. <b>Emotive:</b> \"forgotten\", \"a life that might be saved\".
        <b>Statistic or expert claim:</b> £14 million; \"saves the health service four pounds, the experts say\". <b>Rhetorical question:</b> \"Can we really put a price on that?\" <b>Comparison:</b> the next town.</li>
        <li><b>Structure:</b> a problem, the proposal, its benefits, then a call to action ending in a triple \"Vote for…\" that echoes the opening (\"forgotten\").</li>
        <li><b>Credibility:</b> a councillor backing their own proposal. The £14 million and the other town's centre can be checked; \"the experts say\" names no source, so its figure can't be trusted as it stands.</li>
        <li><b>Missing:</b> running costs, where the money comes from, what else would be cut, and where it would be built.</li></ul>
      <p>Look for evaluation, not just naming: how well each technique works on residents, with evidence.</p>`
  }), { needsAdult: true });

  add("paper-five-minute-talk", T4("presenting-with-confidence-sustaining-a-point-of-view"), "Five-minute talk", "Plan a talk that sustains a point of view: position, hook, three sections with evidence and links, conclusion, audience and delivery.", (who, h) => ({
    pupil: `${h.sheetHead("Five-minute talk", who)}
      <div class="pp-cols">${box("My position, in one sentence", lines(2))}${box("Audience, and how I'll adapt for them", lines(2))}</div>
      ${box("Hook (and how my conclusion will echo it)", lines(2))}
      ${[1, 2, 3].map(n => box(`Section ${n}: point, evidence, and a link back to my position`, lines(2))).join("")}
      ${box("Conclusion: sum up, return to the hook, and leave them with one thought", lines(2))}
      <div class="pp-cols">${box("Resources, and why they help", lines(2))}${box("Delivery: tick when rehearsed", tick(["timing", "pauses", "eye contact", "emphasis", "tone", "notes, not a script"]))}</div>
      <div class="pp-cols">${box("Feedback: one strength", lines(1))}${box("Feedback: one target", lines(1))}</div>`,
    answers: lookForPage(h, "Five-minute talk", ["Confidence, and a point of view sustained with relevant evidence throughout", "A clear, coherent structure with signposts and concluding statements",
      "An introduction and conclusion that interest and engage the audience", "Tone, vocabulary and non-verbal skills adapted to the audience", "Well-chosen resources that add to the talk"])
  }));

  const NOTIFY = ["We have become a nation of twitchers. Not the birdwatching kind, whose patience is legendary, but the kind who flinch at every buzz in a pocket. The average notification is trivial: a sale, a 'like', a reminder about something we had not forgotten. Yet each one exacts a toll. Attention, once fractured, is slow to mend; the thought we were holding drifts off like a balloon released by a careless child.",
    "It is tempting to blame the technology, and the companies who design it to be irresistible certainly deserve scrutiny. But the remedy lies, at least partly, in our own hands. Silence is a setting. We can choose it. The question is whether we still have the discipline to do so, or whether, like the twitchers, we have trained ourselves to wait for the next small, insistent call."];
  add("paper-annotate-it", T4("reading-complex-texts-annotating-and-interrogating"), "Annotate it", "Annotate an opinion column: main claim, tone shifts, vocabulary from roots and context, imagery, summaries and questions.", (who, h) => ({
    pupil: `${h.sheetHead("Annotate it", who)}<p>Annotate the column in the margins: circle unfamiliar words, underline the main claim, mark where the tone changes, and write questions.</p>
      <div style="display:grid;grid-template-columns:1fr 34mm;gap:8px">${NOTIFY.map(p => `<p class="pp-passage" style="font-size:12.5pt;margin:0 0 6px">${p}</p><div class="pp-draw" style="height:auto"></div>`).join("")}</div>
      ${qs([`"Twitchers" has two meanings here. What are they, and why does the writer use the word?${lines(2)}`,
        `Work out from roots and context: exacts a toll ${blank(9)} fractured ${blank(9)} scrutiny ${blank(9)} remedy ${blank(9)}`,
        `Explain the simile in the first paragraph and its effect.${lines(2)}`,
        `How does the tone change in the second paragraph? Quote to support your answer.${lines(2)}`,
        `Sum up each paragraph in five words or fewer.${lines(2)}`])}`,
    answers: answersPage(h, "Annotate it", ["Birdwatchers, famous for patience, and people who twitch nervously at every alert: the pun mocks us by contrast", "costs us something; broken; close examination; a cure or solution",
      "The thought \"drifts off like a balloon released by a careless child\": once let go it can't be got back, it was lost carelessly, and it's slightly childish", "From mocking and amused to more serious and balanced: it admits companies \"deserve scrutiny\", then challenges the reader (\"Silence is a setting. We can choose it.\")",
      "1: Notifications break our attention. 2: We can choose silence"], "Look for annotations that show active questioning, not just highlighting.")
  }));

  const LIB_A = "Council report summary (Kirkbank, 2026): Kirkbank Library opened on Sundays as a one-year trial. Sunday visits averaged 180 a week, compared with 410 on a typical Saturday. Opening on Sundays cost £950 a week in staff and heating. Most Sunday visitors were families with young children and students. Officers recommend continuing Sunday opening from 11:00 to 15:00 only, which would cut the cost to about £600 a week.";
  const LIB_B = "Local newspaper: Sunday opening at Kirkbank Library has been a hit with families, with nearly 200 visitors a week. Mum of two Priya Shah said: \"It's the only day we're all free. The kids love the story sessions.\" But with the council facing a budget gap, the future of the trial is uncertain.";
  const LIB_C = "Resident's blog: I walked past the library at 4pm last Sunday and it was practically empty. Why are we paying to heat a building nobody uses? The council should put the money into fixing the roads instead.";
  add("paper-three-sources", T4("synthesising-information-from-different-sources"), "Three sources", "Sort essential information from three sources about a library's Sunday opening, synthesise by theme, and handle disagreement.", (who, h) => ({
    pupil: `${h.sheetHead("Three sources", who)}<p>Question: should Kirkbank Library keep opening on Sundays?</p>
      ${[["A", LIB_A], ["B", LIB_B], ["C", LIB_C]].map(([k, t]) => `<p class="pp-passage" style="font-size:12pt"><b>Source ${k}.</b> ${t}</p>`).join("")}
      <table class="pp-table"><tr><th>Theme</th><th>What the sources say (A, B, C)</th></tr>${["How many people use it", "Who uses it", "The cost", "Options"].map(t => `<tr><td>${t}</td><td style="height:34px"></td></tr>`).join("")}</table>
      ${box("Where the sources disagree, which do you trust more, and why?", lines(2))}
      ${box("Summary in your own words: each sentence should draw on at least two sources", lines(4))}`,
    answers: lookForPage(h, "Three sources", ["Use: A 180 a week on average (official count); B \"nearly 200\" (rounded up); C one visit late on one Sunday (not reliable as evidence of use)",
      "Who: families with young children and students (A and B)", "Cost: £950 a week, or about £600 with shorter hours (A); a budget gap (B); C suggests roads instead",
      "Trust: A is most reliable for figures (official, a year's data); B is fair but selective; C is one observation at 4pm, an hour after the shorter hours A proposes would close",
      "A synthesis by theme, in their own words, that notes the shorter-hours option as a possible middle way"])
  }));

  const MIST = ["The mist came down without warning. One moment the ridge stretched ahead of us, a knife-edge of grey rock against a pale sky; the next, the world had shrunk to a circle of wet stones and the boots of the person in front. Sound changed first. The wind, which had been roaring, seemed to hold its breath, and every footstep rang out, loud and lonely.",
    "We stopped. Nobody said what we were all thinking.",
    "I had climbed this hill a dozen times. I knew its moods, or believed I did. But a hill in mist is a stranger, and strangers owe you nothing. The path, so obvious an hour before, split and split again into sheep tracks that led nowhere in particular. Our leader took out the compass, turned it in her hands, and frowned at it as if it had told her a joke she did not find funny."];
  add("paper-close-depth", T4("close-reading-detailed-analysis-and-evaluation"), "Close reading in depth", "A passage about a hill walk in mist, with understanding, analysis of word choice, imagery and sentence structure, and evaluation.", (who, h) => ({
    pupil: `${h.sheetHead("Close reading in depth", who)}
      <div class="pp-passage" style="font-size:12.5pt">${MIST.map(p => `<p style="margin:0 0 6px">${p}</p>`).join("")}</div>
      ${qs([`<i>Understanding.</i> In your own words, explain two ways the walkers' situation changes in the first paragraph.${lines(2)}`,
        `<i>Analysis.</i> Explore the connotations of "a knife-edge of grey rock".${lines(1)}`,
        `<i>Analysis.</i> "seemed to hold its breath": name the technique and analyse its effect.${lines(1)}`,
        `<i>Analysis.</i> How does the sentence structure of the second paragraph add to the tension?${lines(1)}`,
        `<i>Analysis.</i> "a hill in mist is a stranger, and strangers owe you nothing": what does this suggest about the writer's attitude?${lines(1)}`,
        `<i>Analysis.</i> What does the final simile suggest about the leader?${lines(1)}`,
        `<i>Evaluation.</i> How effectively does the writer create a sense of danger? Refer to two techniques.${lines(2)}`])}`,
    answers: answersPage(h, "Close reading in depth", ["They can no longer see far ahead (only the stones and the boots in front); the noise of the wind stops and their own steps sound loud",
      "Sharp, narrow and dangerous: one slip could hurt you; \"grey\" is cold and bleak", "Personification: an eerie, unnatural stillness, as if the hill is waiting, which builds suspense",
      "Two very short sentences: an abrupt stop, and the unspoken fear hangs in the silence", "Humble and wary: the familiar hill has become unknowable and won't help them, so the writer's confidence has gone",
      "She's puzzled and uneasy: the compass isn't giving a clear answer, though she tries to stay calm; the dry humour masks the danger", "A judgement with evidence, such as the shrinking world, the sudden silence, the short sentences, or the paths that lead nowhere"],
      "Strong answers quote, explore connotations, and explain the effect on the reader.")
  }));

  const SLANT_A = "<b>Council invests £14m in town's future.</b> Kirkbank's future looks brighter after councillors voted last night to build a state-of-the-art leisure centre. The £14 million centre, with a pool, gym and café, is due to open in 2028. The council leader said: \"This is a once-in-a-generation investment in our young people.\" A local swimming club coach welcomed the news: \"Our members have waited years for this.\"";
  const SLANT_B = "<b>Council gambles £14m as libraries face cuts.</b> Councillors last night voted to gamble £14 million on a new leisure centre, just weeks after warning that two branch libraries may close. An opposition councillor called the decision \"reckless\". The council has not published how much the centre will cost to run each year. One resident, who asked not to be named, said: \"They've got money for a swimming pool but not for books?\"";
  add("paper-spot-slant", T4("bias-persuasion-and-credibility-in-what-i-read"), "Spot the slant", "Two news reports of the same council vote: headlines, loaded words, whose voices are heard, what's left out, and credibility.", (who, h) => ({
    pupil: `${h.sheetHead("Spot the slant", who)}
      <p class="pp-passage" style="font-size:12.5pt">A: ${SLANT_A}</p><p class="pp-passage" style="font-size:12.5pt">B: ${SLANT_B}</p>
      <table class="pp-table"><tr><th></th><th>Report A</th><th>Report B</th></tr>${["The headline's verb and its effect", "Loaded words", "Whose voices are quoted", "What it leaves out", "Its slant"].map(r => `<tr><th>${r}</th><td style="height:34px"></td><td></td></tr>`).join("")}</table>
      ${box("Facts both reports agree on", lines(1))}
      ${box("How credible is the anonymous resident in B? And the council leader in A?", lines(2))}
      ${box("Your informed view: what would you need to know to decide whether this was a good decision?", lines(3))}`,
    answers: answersPage(h, "Spot the slant", ["A: \"invests\" (positive, sensible). B: \"gambles\" (risky, irresponsible)", "A: brighter, state-of-the-art, once-in-a-generation. B: gamble, reckless, cuts",
      "A: the council leader and a swimming coach, both in favour. B: an opposition councillor and an anonymous resident, both against", "A leaves out the library warning and running costs. B leaves out what the centre offers and who supports it",
      "Both agree: a £14 million leisure centre was approved by councillors last night", "Anonymous: can't be checked, and chosen to make a point. The leader: has an interest in praising the decision. Neither is neutral",
      "A view that recognises both slants and names what's needed: running costs, funding, the library decision and the evidence of need"])
  }));

  add("paper-critical-planner", T4("critical-response-to-literature-structure-theme-and-style"), "Critical response planner", "For any text: trace the theme through key moments, evaluate structure and style with terminology, and plan a critical paragraph.", (who, h) => ({
    pupil: `${h.sheetHead("Critical response planner", who)}
      <div class="pp-cols">${box("Text and writer", lines(1))}${box("The theme, in one sentence", lines(1))}</div>
      <table class="pp-table"><tr><th>Key moment</th><th>Quotation</th><th>How it develops the theme</th></tr>${"<tr><td style=\"height:48px\"></td><td></td><td></td></tr>".repeat(3)}</table>
      <div class="pp-cols">${box("A structural choice (flashback, twist, ending…) and how effective it is", lines(3))}${box("A choice of style (voice, imagery, dialogue…) and its effect, with terminology", lines(3))}</div>
      ${box("How the theme relates to my own or others' experiences", lines(2))}
      ${box("A critical paragraph: point, evidence, analysis, evaluation, link to the theme", lines(6))}`,
    answers: lookForPage(h, "Critical response planner", ["A theme stated as an idea and traced through the text, not a plot summary", "Evaluative comments on structure, characterisation or setting, with relevant reference to the text",
      "Style and genre features identified with detailed reference and correct terminology (for example, foreshadowing, juxtaposition, first-person narration)", "A personal evaluation of effectiveness, linked to the writer's purpose",
      "A paragraph that analyses and evaluates rather than retells"])
  }));

  const SCIENCE = "In are science experiment we tested weather the temprature of water effects how quickly sugar disolves. We used a seperate beaker for each temprature and kept the amount of sugar the same, which made it a fair test. Are hypothosis was that the sugar would disolve faster in hotter water, and the results supported it. Next time we will measure more accuratly and repeat each test three times to make our evidence more reliable, and we should of recorded the time in seconds rather then minutes.";
  add("paper-spelling-log", T4("independent-spelling-accuracy"), "My spelling log", "Proofread a science report for spelling, sort errors by type with a strategy for each, and pin down easily confused pairs.", (who, h) => ({
    pupil: `${h.sheetHead("My spelling log", who)}
      <p class="pp-passage" style="font-size:12.5pt">${SCIENCE}</p>
      ${qs([`Proofread the report in a separate pass for spelling only. Underline every mistake. How many did you find? ${blank(3)}`])}
      <table class="pp-table"><tr><th>I wrote</th><th>Correct</th><th>Type of error</th><th>Strategy to fix it</th></tr>${"<tr><td></td><td></td><td></td><td></td></tr>".repeat(5)}</table>
      <p class="pp-bank"><b>Types:</b> homophone · double letter · suffix rule · unstressed vowel · specialist word · grammar (should of)</p>
      ${qs([`Write a sentence that shows the meaning of each: affect / effect ${lines(1)} practice / practise ${lines(1)} principal / principle ${lines(1)}`,
        `Look back at your own recent writing. Add three of your own errors to the log above, with strategies.`], 2)}`,
    answers: answersPage(h, "My spelling log", ["13: are → our (twice), weather → whether, temprature → temperature (twice), effects → affects, disolves → dissolves, seperate → separate, hypothosis → hypothesis, disolve → dissolve, accuratly → accurately, should of → should have, then → than",
      "Types: homophones (our, whether, affects, than), specialist words (temperature, hypothesis), double letters (dissolve), unstressed vowels (separate), suffix rule (accurately), grammar (should have)",
      "For example: affect is usually the verb, effect the noun; practice is the noun and practise the verb (in UK English); a principal is a head or main, a principle is a rule or belief", "The pupil's own errors, each with a matching strategy"])
  }));

  add("paper-punctuation-effect", T4("sentences-and-punctuation-for-effect"), "Punctuation for effect", "Semicolons, colons and dashes, a complex list, minor sentences, and revising a flat paragraph with deliberate choices.", (who, h) => ({
    pupil: `${h.sheetHead("Punctuation for effect", who)}
      ${qs([`Add a semicolon: "The rain stopped the match continued" ${lines(1)}`,
        `Use semicolons in this list: "We visited Perth, Scotland, Perth, Australia and Perth, Ontario" ${lines(1)}`,
        `Add a dash for a sharp turn: "She opened the box and found nothing" ${lines(1)}`,
        `Add a colon: "There was only one problem the door was locked" ${lines(1)}`,
        `Revise this flat paragraph. Use at least one minor sentence, one long complex sentence, and one dash or semicolon.<br><i>"We walked into the old house. It was dark and it was cold and it smelled of damp. We heard a noise upstairs. We decided to leave very quickly."</i>${lines(5)}`,
        `Explain the effect of two of your choices in question 5.${lines(3)}`,
        `Write a paragraph about a place you know, with a topic sentence and a linking phrase that signposts a turn in your line of thought (however, by contrast, even so).${lines(4)}`])}`,
    answers: answersPage(h, "Punctuation for effect", ["The rain stopped; the match continued.", "We visited Perth, Scotland; Perth, Australia; and Perth, Ontario.", "She opened the box – and found nothing.", "There was only one problem: the door was locked.",
      "For example: Darkness. As we stepped inside, the cold wrapped round us and the smell of damp rose from the boards; somewhere upstairs, something moved. We didn't wait to find out what.",
      "Effects explained: a minor sentence for impact, a long sentence building atmosphere, a semicolon linking cause and dread, a short sentence for decision", "A clear topic sentence and a signposted turn, with accurate punctuation"])
  }));

  add("paper-edit-editor", T4("independent-editing-and-justifying-layout"), "Edit like an editor", "Edit a draft of your own for structure, language and accuracy with a change log, then design and justify two layouts.", (who, h) => ({
    pupil: `${h.sheetHead("Edit like an editor", who)}<p>Use a draft of your own (at least 300 words).</p>
      <table class="pp-table"><tr><th>Level</th><th>What I changed</th><th>Why it's better</th></tr>${["Structure: order, paragraphs, what to cut or add", "Structure", "Language: precise words, varied sentences, no padding", "Language", "Accuracy: spelling, punctuation, grammar"].map(r => `<tr><td>${r}</td><td style="height:38px"></td><td></td></tr>`).join("")}</table>
      ${box("Read it once as your reader would. Does it meet its purpose at first reading? What still gets in the way?", lines(2))}
      <div class="pp-cols">${box("Sketch it as a web page", `<div class="pp-draw"></div>`)}${box("Sketch it as a printed leaflet", `<div class="pp-draw"></div>`)}</div>
      ${box("Justify two layout choices by their impact on the reader", lines(3))}`,
    answers: lookForPage(h, "Edit like an editor", ["Independent editing at structure level, not only corrections", "Improvements to content, language and structure, each with a reason",
      "A final check for clarity at first reading", "Layout features chosen for each medium (for example links and short sections online; headings and white space in print)", "Choices justified by their impact on the reader"])
  }));

  const HOLYROOD = "The Scottish Parliament first met in 1999, nearly three hundred years after the previous Parliament of Scotland was adjourned in 1707. Since 2004 it has met in its building at Holyrood in Edinburgh. There are 129 Members of the Scottish Parliament (MSPs). Each voter has two votes: one for a constituency MSP and one for a list of candidates for their region, a system intended to make the number of seats each party wins closer to its share of the vote.";
  add("paper-sources-well", T4("responsible-use-of-sources-referencing-and-synthesising"), "Using sources well", "Paraphrase, quote and summarise a source, spot plagiarism, write a reference, and plan a report organised by argument.", (who, h) => ({
    pupil: `${h.sheetHead("Using sources well", who)}
      <p class="pp-passage" style="font-size:12.5pt">${HOLYROOD}</p>
      <p class="hint">An example source for practice: "How the Scottish Parliament works", a civics website, published 2024.</p>
      ${qs([`Which student used the source responsibly? Write P (plagiarised), Q (quoted correctly) or O (own words) for each.<br>
          a) The Scottish Parliament first met in 1999, nearly three hundred years after the previous Parliament of Scotland was adjourned. ${blank(2)}<br>
          b) According to the source, the voting system is "intended to make the number of seats each party wins closer to its share of the vote". ${blank(2)}<br>
          c) Scotland had no parliament of its own from 1707 until 1999, when a new one opened. ${blank(2)}`,
        `Put the last sentence of the source into your own words.${lines(2)}`,
        `Summarise the whole source in one sentence.${lines(1)}`,
        `Write a reference for this source, including the date you accessed it.${lines(1)}`,
        `You use an AI chatbot or a search summary to find a fact. What should you do before you use it in your report, and why?${lines(2)}`])}
      <div class="pp-cols">${box("Report plan, organised by argument: introduction", lines(1))}${box("Argument 1, with sources", lines(1))}${box("Argument 2, with sources", lines(1))}${box("Conclusion", lines(1))}</div>`,
    answers: answersPage(h, "Using sources well", ["a) P (copied without quotation marks or credit)  b) Q  c) O (own words; still needs a reference)",
      "For example: each voter chooses a local MSP and also votes for a party's regional list, which helps match a party's seats to its votes", "For example: Scotland's Parliament returned in 1999 and has 129 MSPs elected by two votes each",
      "For example: \"How the Scottish Parliament works\", civics website, 2024, accessed (today's date). A real reference would add the author or organisation and web address",
      "Check it against an original, reliable source (such as the Parliament's own website), because summaries and chatbots can be wrong or out of date, and cite that source, not the tool"])
  }));

  add("paper-report-planner", T4("writing-reports-information-with-evidence"), "Report planner", "Plan a report on a real issue: purpose and reader, sections with headings, topic sentences and evidence, and an objective tone.", (who, h) => ({
    pupil: `${h.sheetHead("Report planner", who)}
      <div class="pp-cols">${box("Issue (in my school or community)", lines(1))}${box("Purpose and reader", lines(1))}</div>
      ${box("Title and introduction: what the report covers and why it matters", lines(2))}
      <table class="pp-table"><tr><th>Heading</th><th>Topic sentence</th><th>Evidence (data, quotation, example) and source</th></tr>${"<tr><td style=\"height:46px\"></td><td></td><td></td></tr>".repeat(3)}</table>
      ${box("Synthesis: where do different sources or views agree or conflict?", lines(2))}
      ${box("Conclusion and recommendations", lines(2))}
      ${box("Objective tone: three phrases I'll use, and two I'll avoid", lines(2))}`,
    answers: lookForPage(h, "Report planner", ["A style and format well suited to purpose and reader, with the features of a report", "Information and explanation supported by substantiating evidence",
      "Ideas from different sources synthesised, not listed", "A clear structure signposted with headings, topic sentences and linking phrases", "A consistently objective tone"])
  }));

  add("paper-weigh-it-up", T4("discursive-and-argumentative-essays"), "Weigh it up", "Plan a discursive essay: the debate, alternating arguments with evidence, linking phrases, and a conclusion that weighs and judges.", (who, h) => ({
    pupil: `${h.sheetHead("Weigh it up", who)}
      ${box("The issue, as a question", lines(1))}
      ${box("Introduction: why it matters, and the two sides", lines(2))}
      <table class="pp-table"><tr><th></th><th>Argument</th><th>Evidence</th><th>Linking phrase</th></tr>${["For", "Against", "For", "Against"].map(s => `<tr><th>${s}</th><td style="height:44px"></td><td></td><td></td></tr>`).join("")}</table>
      <p class="pp-bank"><b>Linking phrases:</b> Furthermore · However · On the other hand · Admittedly…, yet · Nevertheless · Consequently</p>
      ${box("Which side is stronger, and why? (Weigh it; don't just repeat the points.)", lines(3))}
      ${box("Conclusion: my justified judgement", lines(3))}
      ${box("Language I'll use for effect, and where", lines(1))}`,
    answers: lookForPage(h, "Weigh it up", ["A point of view presented or sustained with essential detail and supporting evidence", "A clear line of thought, with effective linking phrases and topic sentences",
      "An effective introduction that sets out the debate", "A conclusion that weighs the arguments and reaches a justified judgement", "Language used deliberately to create effects or influence the reader"])
  }));

  add("paper-looking-back", T4("reflective-personal-writing"), "Looking back", "Plan reflective writing around a turning point: before and after, the moment in slow motion, and reflection that goes beyond a simple lesson.", (who, h) => ({
    pupil: `${h.sheetHead("Looking back", who)}
      ${box("The turning point, in one sentence", lines(1))}
      <div class="pp-cols">${box("Before: who I was, what I thought", lines(3))}${box("After: what changed, and how I know", lines(3))}</div>
      ${box("The moment in slow motion: what I saw, heard and felt, second by second", lines(4))}
      ${box("Changing feelings: three words for how I felt, in order, and what caused each change", lines(2))}
      ${box("Reflection that goes deeper than \"I learned a lesson\": what I understand now that I didn't then", lines(3))}
      ${box("My opening: start in the moment", lines(4))}`,
    answers: lookForPage(h, "Looking back", ["Events recounted convincingly, with a clear context and setting", "Feelings and reactions conveyed as they change with the circumstances",
      "Reflection with a sense of involvement and genuine insight, not a stock moral", "Language, style and tone that engage the reader", "A structure that moves purposefully between narrating and reflecting"])
  }));

  add("paper-story-craft", T4("creative-writing-mood-dialogue-and-narrative-structure"), "Story craft", "Plan a story around a changing relationship: genre conventions, structure and narrative device, mood, and dialogue with subtext.", (who, h) => ({
    pupil: `${h.sheetHead("Story craft", who)}
      <div class="pp-cols">${box("Genre, and three conventions I'll use", lines(2))}${box("The relationship, and how it changes", lines(2))}</div>
      ${box("Structure: where I'll start (in the middle? a flashback? a change of viewpoint?) and why", lines(2))}
      ${box("Mood and atmosphere: setting, weather, pace and sentence length", lines(2))}
      ${box("Dialogue with subtext: what each character says, and what they really mean", `<table class="pp-table"><tr><th>Says</th><th>Means</th></tr>${"<tr><td></td><td></td></tr>".repeat(3)}</table>`)}
      ${box("A scene with dialogue (set out correctly)", lines(7))}`,
    answers: lookForPage(h, "Story craft", ["Conventions of the chosen genre used effectively", "An appropriate mood or atmosphere created and sustained", "Convincing relationships, actions and dialogue, with subtext",
      "Narrative structure and devices used to engage the reader and achieve particular effects", "Dialogue punctuated and set out correctly"])
  }));

