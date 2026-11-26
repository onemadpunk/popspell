  /* ===================== Spoken assessment: GCSE Spoken Language and SQA talk =====================
     Support for the parts of GCSE English Language and SQA English that are assessed by talking, not writing:
     England's Spoken Language endorsement (a prepared presentation, questions and feedback, in Standard English,
     reported as Pass, Merit or Distinction) and SQA's spoken language performance in National 5 and Higher English
     (an individual presentation or a group discussion, which must be achieved for the course award). A guide in
     plain words, a planner, a rehearsal record, topics, and a group discussion sheet. The criteria are PopSpell's
     plain-words summaries of the DfE's GCSE subject content and SQA's course specifications, not the boards' wording.
     Private candidates: the endorsement and the talk performance are assessed by a teacher at the centre. */

  const spStrip = (what, how) => `<p class="qd-strip gx-strip"><b>Spoken assessment</b><span>${what}</span><span>${how}</span><span>Done ☐</span></p>`;
  const spTable = rows => `<table class="ex-levels">${rows.map(([a, b]) => `<tr><th>${a}</th><td>${b}</td></tr>`).join("")}</table>`;
  const spTicks = items => `<ul class="ex-ticks">${items.map(s => `<li>☐ ${s}</li>`).join("")}</ul>`;
  const SP_GCSE = "lesson-england-english-climb-spoken", SP_N5 = "lesson-sqa-talk-n5", SP_H = "lesson-sqa-talk-higher";

  add("paper-sp-gcse-guide", SP_GCSE, "GCSE Spoken Language: what the endorsement asks",
    "England's Spoken Language endorsement in a page: the presentation, the questions and feedback, Standard English, and what Pass, Merit and Distinction look like, in plain words.", (who, h) => ({
      pupil: `${h.sheetHead("GCSE Spoken Language: the endorsement", who)}${spStrip("GCSE English Language", "Read, then talk it through")}
        ${box("What it is", `<p>Alongside the GCSE English Language exams, every student gives a <b>prepared spoken presentation</b> to an audience, then <b>answers questions and responds to feedback</b>. It is assessed by a teacher and reported separately from the 9 to 1 grade, as <b>Pass, Merit or Distinction</b> (or Not Classified). Some presentations are filmed so the board can check the marking.</p>`)}
        ${box("What you must do", spTicks(["Choose a topic you can speak about with knowledge and interest.", "Plan it for a real audience and purpose: to inform, persuade or explain.", "Speak in <b>Standard English</b> (no slang, full sentences, clear grammar).", "Use notes or prompt cards, not a script to read.", "Listen to questions and answer them properly, adding detail.", "Take feedback and respond to it."]))}
        ${box("What each level looks like", spTable([
          ["Pass", "A prepared presentation on a topic, in Standard English; listens to questions and answers them, even if briefly."],
          ["Merit", "Well organised and well expressed, with the audience in mind; answers questions with relevant, developed detail."],
          ["Distinction", "Sophisticated ideas, skilfully organised and delivered; answers questions perceptively and engages with the audience throughout."]]))}
        ${box("Good topics", `<p>Something you care about and can explain: a hobby, a job you'd like, a local issue, a book or film that changed your mind, a debate (should…?). You'll need three clear points, evidence or examples for each, and an ending.</p>`)}`,
      answers: lookForPage(h, "GCSE Spoken Language: the endorsement", [
        "The endorsement doesn't change the GCSE grade, but colleges and employers see it on the certificate, and Not Classified looks poor: it is worth preparing for properly.",
        "Standard English is the most common reason for missing a Pass: listen for slang, \"like\" as a filler, and dropped sentence endings in practice.",
        "Private candidates: the endorsement must be assessed by a teacher at the exam centre. Ask the centre early how and when they arrange it.",
        "Level descriptions here are PopSpell's plain-words summary of the DfE's GCSE English Language subject content, not any board's own wording."])
    }));

  add("paper-sp-plan", SP_GCSE, "Spoken presentation planner",
    "One page to plan a talk or presentation: purpose and audience, an opening hook, three points with evidence, a counter-argument, an ending, and the questions to expect. Works for GCSE, SQA and everyday talks.", (who, h) => ({
      pupil: `${h.sheetHead("Presentation planner", who)}${spStrip("GCSE and SQA talk", "Plan, then make prompt cards")}
        <p class="gx-plan">Topic: ${blank(16)} &nbsp; Purpose (inform / persuade / explain): ${blank(6)}</p>
        <p class="gx-plan">Audience: ${blank(10)} &nbsp; Time: about ${blank(2)} minutes &nbsp; Visual aid (optional): ${blank(8)}</p>
        ${box("Opening hook (a question, a fact, a short story)", lines(2))}
        ${box("Point 1, and its evidence or example", lines(2))}
        ${box("Point 2, and its evidence or example", lines(2))}
        ${box("Point 3, and its evidence or example", lines(2))}
        ${box("What someone who disagrees would say, and my answer", lines(2))}
        ${box("Ending (a summary, a call to action, or back to the hook)", lines(2))}
        ${box("Three questions I might be asked, and the gist of my answers", lines(3))}
        <p class="ex-more"><b>Prompt cards:</b> one card per section, with key words only. If you can read it out in full, there's too much on it.</p>`,
      answers: lookForPage(h, "Presentation planner", [
        "Check the purpose and audience are clear: a talk to persuade classmates sounds different from one to inform adults.",
        "Each point needs its own evidence or example. Ask \"how do you know?\" for each one.",
        "The counter-argument shows thinking at Merit or Distinction (GCSE) and helps SQA's \"content\" criterion.",
        "Rehearse answering the three questions out loud: answers are assessed too, and short answers lose credit."])
    }));

  add("paper-sp-rehearse", SP_GCSE, "Spoken presentation: rehearsal record",
    "Three rehearsals, each with a checklist for the listener (voice, pace, eye contact, Standard English, structure, answering questions) and one thing to improve next time. Works for GCSE and SQA.", (who, h) => {
      const CHECK = ["Clear and loud enough to hear at the back", "Steady pace, with pauses at the important points", "Looks at the audience, not only at the cards", "Standard English: no slang or fillers (\"like\", \"basically\")", "A clear opening, three points and an ending", "Uses evidence or examples", "Answers questions with detail, not one word"];
      return {
        pupil: `${h.sheetHead("Rehearsal record", who)}${spStrip("GCSE and SQA talk", "Rehearse three times")}
          <p class="gx-intro">Give your talk to a listener (or film it and watch it back). The listener ticks what went well, then you both agree <b>one</b> thing to improve.</p>
          <table class="gx-track"><thead><tr><th>Checklist</th><th>Rehearsal 1</th><th>Rehearsal 2</th><th>Rehearsal 3</th></tr></thead>
          <tbody>${CHECK.map(c => `<tr><td>${c}</td>${'<td class="gx-cell"></td>'.repeat(3)}</tr>`).join("")}
          <tr><td>Time taken</td>${'<td class="gx-cell"></td>'.repeat(3)}</tr>
          <tr><td><b>One thing to improve</b></td>${'<td class="gx-cell"></td>'.repeat(3)}</tr></tbody></table>
          ${box("After rehearsal 3: what I'm most confident about, and what I'll watch for on the day", lines(3))}`,
        answers: lookForPage(h, "Rehearsal record", [
          "Be the audience: sit at the far side of the room, and ask two real questions at the end.",
          "Give one target at a time. Pace and Standard English usually improve fastest; eye contact comes with knowing the talk well.",
          "Filming on a phone and watching it back together is the quickest way for a student to hear their own fillers.",
          "By rehearsal 3 the talk should run to time with prompt cards only."])
      };
    });

  add("paper-sp-topics", SP_GCSE, "Presentation topics and the questions to expect",
    "Twelve presentation topics, each with the questions an audience might ask, to choose from or to practise answering on the spot.", (who, h) => {
      const TOPICS = [
        ["Should the school day start later for teenagers?", "What would it cost? Wouldn't you just stay up later?"],
        ["The job I'd most like to do, and how to get there", "What would you do if it didn't work out? What's the hardest part?"],
        ["A book, film or game that changed how I think", "Who else should read or play it? Did anything about it annoy you?"],
        ["Should mobile phones be banned in schools?", "What about emergencies? Who would enforce it?"],
        ["A local place that deserves more visitors", "Why don't more people go? What would you change?"],
        ["Is it better to be good at one thing or several?", "Which are you? Can you give a real example?"],
        ["A skill everyone should learn before 18", "Why isn't it taught already? Who should teach it?"],
        ["Should young people have to do volunteering?", "Would forcing people make it worse? How many hours?"],
        ["The best invention of the last hundred years", "What would life be like without it? Has it caused problems?"],
        ["Fast fashion: should we buy fewer clothes?", "Isn't it cheaper for families who need it? What can one person do?"],
        ["My hobby, and why you should try it", "How much does it cost to start? What's the hardest bit?"],
        ["Should voting age be 16 everywhere in the UK?", "Do most 16-year-olds know enough? What happened in Scotland?"]];
      return {
        pupil: `${h.sheetHead("Topics and questions to expect", who)}${spStrip("GCSE and SQA talk", "Choose one, or practise answering")}
          <table class="ex-levels">${TOPICS.map(([t, q], i) => `<tr><th>${i + 1}</th><td><b>${t}</b><br><i>Questions to expect: ${q}</i></td></tr>`).join("")}</table>
          <p class="ex-more"><b>Practice game:</b> an adult picks a topic and asks one of its questions. Answer for 30 seconds, in Standard English, with a reason and an example.</p>`,
        answers: lookForPage(h, "Topics and questions to expect", [
          "The best topic is one the student already knows and cares about: they'll speak more naturally and answer questions better.",
          "Debate topics (\"should…?\") make it easy to include a counter-argument.",
          "In the 30-second game, listen for a clear answer first, then a reason, then an example.",
          "The topics are PopSpell's own suggestions; any topic the centre agrees is fine."])
      };
    });

  add("paper-sp-sqa-guide", SP_N5, "SQA talk: what the spoken language performance asks",
    "SQA's spoken language performance for National 5 and Higher English in a page: what counts, the individual presentation or group discussion, and what an assessor looks for, in plain words.", (who, h) => ({
      pupil: `${h.sheetHead("SQA English: the spoken language performance", who)}${spStrip("National 5 and Higher English", "Read, then talk it through")}
        ${box("What it is", `<p>National 5 and Higher English include a <b>spoken language performance</b>, assessed by your teacher. It isn't marked out of a number: it must be <b>achieved</b>, and you can't get the course award without it. It can be an <b>individual presentation</b> or a <b>group discussion</b>, on a topic linked to your course or your interests.</p>`)}
        ${box("What the assessor looks for", spTable([
          ["Content", "Ideas and information that suit the purpose and audience, developed with detail."],
          ["Structure", "A clear order: an opening, ideas that link together, and an ending."],
          ["Language", "Words and expressions chosen for the purpose and audience; accurate and clear."],
          ["Non-verbal", "Eye contact, gesture, posture and voice that help the listener."],
          ["Listening and responding", "In a discussion: listening, building on others' ideas, asking and answering questions, supporting and challenging politely."]]))}
        ${box("National 5 or Higher?", `<p><b>Higher</b> asks for more: ideas that are more complex, more precisely expressed, and (in a discussion) more skilful at moving the talk on and challenging others' views.</p>`)}
        ${box("What helps", spTicks(["Plan with the presentation planner.", "Rehearse at least three times with the rehearsal record.", "For a discussion, prepare facts and two questions to ask others.", "Use prompt cards, not a script."]))}`,
      answers: lookForPage(h, "SQA English: the spoken language performance", [
        "The performance must be achieved for the National 5 or Higher English award, so plan it early rather than leave it to the end of the year.",
        "Private candidates: it is assessed by a teacher at the centre. Ask the exam centre how they arrange it (some use a recorded presentation).",
        "Group discussion is often easier for quieter learners: they can prepare questions and build on others' points.",
        "The criteria here are PopSpell's plain-words summary of SQA's course specification, not SQA's own wording."])
    }));

  add("paper-sp-sqa-discussion", SP_N5, "Group discussion: plan, roles and observation",
    "For a group discussion assessment or practice: a short plan, the roles people can take, phrases for building on and challenging ideas, and an observation grid for the adult.", (who, h) => {
      const PHRASES = [["Building on", "\"That's a good point, and it also means…\""], ["Asking", "\"What makes you think that?\" \"Can you give an example?\""], ["Challenging politely", "\"I see why you'd say that, but…\""], ["Bringing someone in", "\"What do you think, Sam?\""], ["Summarising", "\"So far we've agreed… but we still disagree about…\""]];
      const OBS = ["Makes relevant points with detail", "Listens and builds on others' ideas", "Asks questions", "Challenges politely", "Brings others in or summarises", "Clear voice and eye contact"];
      return {
        pupil: `${h.sheetHead("Group discussion", who)}${spStrip("National 5 and Higher English", "Plan, then discuss")}
          <p class="gx-plan">Question for discussion: ${blank(22)}</p>
          ${box("My view, and two reasons", lines(3))}
          ${box("Two facts or examples I can bring in", lines(2))}
          ${box("Two questions I'll ask the others", lines(2))}
          ${box("Phrases that earn credit", spTable(PHRASES))}
          <table class="gx-track"><thead><tr><th>Observation (for the adult)</th><th>Often</th><th>Sometimes</th><th>Not yet</th></tr></thead>
          <tbody>${OBS.map(o => `<tr><td>${o}</td>${'<td class="gx-cell"></td>'.repeat(3)}</tr>`).join("")}</tbody></table>`,
        answers: lookForPage(h, "Group discussion", [
          "At home, a discussion can be the learner, an adult and one other person (or a video call with a friend). Pick a question with two sides.",
          "Tick the observation grid during the discussion, then share one strength and one target.",
          "A learner who only gives their own view and never responds won't meet the listening and responding criterion: prompt them to use the building-on phrases.",
          "Good questions for practice: Should school uniform be scrapped? Is social media good for young people? Should Scotland have more four-day weeks?"])
      };
    });

  add("paper-sp-sqa-higher", SP_H, "Higher talk: developing and challenging an argument",
    "For Higher English's spoken language performance: how to develop an idea in depth, use evidence, handle a counter-argument and challenge others' views with precision, with practice prompts.", (who, h) => ({
      pupil: `${h.sheetHead("Higher talk: developing an argument", who)}${spStrip("Higher English", "Plan, then practise aloud")}
        ${box("Develop each idea in three steps", `<p><b>Claim</b> (what you think) → <b>evidence</b> (a fact, example or quotation) → <b>so what?</b> (why it matters, or what follows). A Higher talk does this for every main point.</p>${lines(2)}`)}
        ${box("Answer the other side", `<p>Name the strongest counter-argument fairly, then explain why your view still holds, or adjust it: "It's true that…, but…"</p>${lines(2)}`)}
        ${box("Precise language", `<p>Swap vague words for exact ones: not "a lot of people" but "about a third of S5 pupils in a survey"; not "bad" but "unfair", "costly" or "short-sighted".</p>${lines(2)}`)}
        ${box("Practice prompts (two minutes each, then questions)", `<ol class="ex-plan"><li>Should exams be replaced by coursework?</li><li>Is it ever right to break a rule?</li><li>Has the internet made us better informed?</li><li>Should Scots be taught in every Scottish school?</li></ol>`)}`,
      answers: lookForPage(h, "Higher talk: developing an argument", [
        "Listen for the \"so what?\" step: it is what lifts a National 5 point to Higher.",
        "Ask one challenging question after each practice talk, and see if the learner defends or refines their view rather than repeating it.",
        "Precision matters in talk as in writing: praise exact words and numbers.",
        "The performance must be achieved for the Higher English award; check with the centre how it will be assessed."])
    }));
