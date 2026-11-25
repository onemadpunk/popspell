/*
  SQA ENGLISH CLIMB (Scotland): National 4 skills, then National 5, then Higher English, in three stages.
  The same shape as the GCSE climb (exam-english/gcse.js): each topic has self-marking questions (a question,
  the right answer, two wrong ones and the reason, with the text it is about and the lines it quotes), and a
  written exam-style question with what to look for, how it is marked and a model answer.

  What the exams test (SQA's published course specifications; the question papers are SQA's own):
    • Reading for Understanding, Analysis and Evaluation (RUAE): one non-fiction passage at National 5,
      two at Higher, with questions on understanding (in your own words), analysis (word choice, imagery,
      sentence structure, tone) and evaluation, and a final question: a summary at National 5, a comparison
      of the two writers at Higher.
    • Critical Reading: a Scottish set text (short questions on an extract, then a 10-mark question that
      links it to the rest of the text) and a critical essay on a text studied in class.
    • The portfolio (folio): two pieces of writing, one broadly creative and one broadly discursive.
  National 4 has no exam: it is assessed in class, so stage 1 builds the reading and writing skills that
  National 5 takes for granted. Scotland's set texts are mostly still in copyright, so Scottish text
  practice here uses Robert Burns and Robert Louis Stevenson (both out of copyright), and the method works
  for any set text. Every question and passage is PopSpell's own; nothing is copied from a past paper.
*/
window.EXAM_ENGLISH = window.EXAM_ENGLISH || {};
window.EXAM_ENGLISH.sqa = (() => {
  "use strict";
  const Q = (sk, q, a, o, why, t = "", x = "") => ({ sk, q, a, o, why, t, x });

  // How SQA marks an analysis answer: up to 2 marks for each reference with its comment
  const MARKS_2 = [
    ["2 marks", "A relevant reference (a short quotation or a close reference) with a detailed, insightful comment on its effect."],
    ["1 mark", "A relevant reference with a more basic comment."],
    ["0 marks", "A quotation or reference on its own, or a comment with no reference."]];
  const OWN_WORDS = [
    ["1 mark each point", "A point from the lines named, put in your own words (lifting the writer’s words gets nothing)."],
    ["0 marks", "Copying the text, or points from outside the lines named."]];
  // The 10-mark Scottish text question
  const FINAL_10 = [
    ["2 marks", "Identifying what the extract and the rest of the text have in common (the idea, theme or technique the question names)."],
    ["2 marks", "A reference to the extract with a relevant comment (or 1 mark for a more basic one)."],
    ["6 marks", "References to at least one other part of the text (or other poems by the poet) with comments: 2 marks each for detailed ones, 1 for basic."]];
  // The critical essay, out of 20
  const ESSAY_20 = [
    ["20–19", "Very detailed, perceptive knowledge of the text; a convincing line of thought; insightful analysis of techniques; consistently relevant to the question."],
    ["18–16", "Detailed knowledge; a clear line of thought; detailed analysis of techniques; relevant throughout."],
    ["15–13", "Clear knowledge; a line of thought; some detailed analysis; mostly relevant."],
    ["12–10", "Adequate knowledge; some sense of a line of thought; some analysis; generally relevant. The pass mark."],
    ["9–6", "Limited knowledge or relevance; more retelling than analysis."],
    ["5–0", "Very little knowledge or relevance, or technical accuracy too weak to follow."]];

  /* ---------------- STAGE 1: National 4 skills (the step up to National 5) ---------------- */
  const S1 = [
    { id: "en4-understand", n: 1, short: "Main ideas", title: "Main ideas and key details", paper: "Reading (National 4 unit), RUAE understanding questions",
      blurb: "Find what a writer is mainly saying, and the details that back it up. Every reading question starts here.",
      items: [
        Q("main idea", "What is the writer’s main point about libraries?", "They are free, welcoming places for anyone, not just places for facts.", ["They are the best place to find facts quickly.", "They should sell more books."], "“A library is not really about facts. It is about being allowed to sit somewhere warm, for free”.", "library"),
        Q("key detail", "Who took the writer to the library as a child?", "Their gran", ["Their mother", "Mrs Reid"], "“Every Saturday, my gran took me to the library”. Mrs Reid was the librarian.", "library", "Every Saturday, my gran took me to the library on Duke Street."),
        Q("key detail", "How old is the writer now?", "Twenty-six", ["Sixteen", "Sixty-two"], "“I still go now, at twenty-six”.", "library", "I still go now, at twenty-six, though I own a phone that can find any fact in seconds."),
        Q("main idea", "What does the writer think councils get wrong?", "They measure libraries by books borrowed, not by the people who need them.", ["They spend too much money on books.", "They open libraries on Tuesdays."], "“They count the books borrowed. They should count the people who had nowhere else to go.”", "library", "They count the books borrowed. They should count the people who had nowhere else to go."),
        Q("main idea", "What is the main point of the second paragraph of “The last ferry”?", "The ferry is essential to island life, not a luxury.", ["Ferries are a good holiday treat.", "Island teenagers do not sit exams."], "“For the islands, the ferry is not a holiday treat. It is a lifeline”.", "ferry", "For the islands, the ferry is not a holiday treat. It is a lifeline"),
        Q("key detail", "What happens on an island when a boat breaks down?", "Shops run out and appointments are cancelled.", ["Everyone goes on holiday.", "A new boat arrives the same day."], "“It empties its shelves, cancels its appointments and holds its breath.”", "ferry", "It empties its shelves, cancels its appointments and holds its breath."),
        Q("main idea", "What do islanders want most?", "A reliable service they can trust", ["More sympathy from the mainland", "Cheaper holidays"], "“What they want is not sympathy but reliability”.", "ferry", "What they want is not sympathy but reliability"),
        Q("reading the question", "A question says “Look at lines 1 to 5.” Where should your answer come from?", "Only from lines 1 to 5", ["Anywhere in the passage", "From your own knowledge"], "Points from outside the lines named get no marks, even if they are true."),
        Q("main idea", "What is a topic sentence?", "The sentence, often the first, that says what a paragraph is about", ["The last sentence of a passage", "Any sentence with a quotation"], "Finding each paragraph’s topic sentence is the quickest way to the main ideas.")
      ],
      written: { t: "library", marks: 3, q: "Look at the third paragraph (“That is rarer than it sounds…”). Give three examples of people the writer sees in the library on a wet Tuesday.",
        look: ["Students revising.", "A man reading the newspapers.", "A mother with a buggy.", "Two pensioners arguing (gently) about a crossword."],
        levels: [["1 mark each", "Any three of the people named in the third paragraph."]],
        model: "1. Students revising. 2. A man reading the newspapers. 3. Two pensioners doing a crossword.",
        tip: "Three short points. No need to explain: the question asks you to find, not analyse." } },

    { id: "en4-ownwords", n: 2, short: "Own words", title: "Putting it in your own words", paper: "RUAE understanding questions",
      blurb: "Show you understand by saying it differently. Copying the writer’s words gets no marks.",
      items: [
        Q("own words", "“the weary patience of a conductor”. Which is the best own-words version of “weary”?", "Tired", ["Patient", "Musical"], "“Weary” means tired. Your own words must keep the meaning but change the words.", "ferry", "waves everyone forward with the weary patience of a conductor"),
        Q("own words", "Which answer puts “What they want is not sympathy but reliability” in your own words?", "They don’t want people to feel sorry for them; they want a service that always runs.", ["They want reliability, not sympathy.", "They want sympathy and reliability."], "The first just repeats the writer’s words. Own words show you understand.", "ferry", "What they want is not sympathy but reliability"),
        Q("own words", "“a library is not really about facts”. Which is an own-words answer?", "Libraries aren’t mainly for finding information.", ["A library is not really about facts.", "Libraries are about facts."], "“Information” replaces “facts”; the meaning stays the same.", "library", "The answer is that a library is not really about facts."),
        Q("own words", "Why might “It is a lifeline” not count as an own-words answer?", "It copies the writer’s words without explaining them.", ["It is too short.", "It is not in the passage."], "Explain it: the islands depend on the ferry to survive.", "ferry"),
        Q("own words", "“Islanders have heard it all before.” What does this suggest in your own words?", "They no longer believe the promises because they have been made many times.", ["They have good hearing.", "They have never heard of the problem."], "It suggests repeated, broken promises: they are sceptical.", "ferry", "Islanders have heard it all before."),
        Q("own words", "Which is a good own-words version of “without anyone asking you to buy anything”?", "Nobody expects you to spend money.", ["Without anyone asking you to buy anything", "You must buy something."], "Keep the meaning, change the words.", "library", "without anyone asking you to buy anything"),
        Q("own words", "A question is worth 2 marks. How many separate points should you make?", "Two", ["One", "Four"], "In RUAE understanding questions, each mark is usually one clear point."),
        Q("own words", "What can you keep from the writer’s words in an own-words answer?", "Small, everyday words that have no simple alternative", ["Every key word", "Nothing at all, not even “the”"], "You don’t have to change “island” or “ferry”, but the key ideas must be in your words."),
        Q("own words", "“new vessels are coming, lessons have been learned”. In your own words, what are islanders promised?", "New boats, and that past mistakes won’t happen again", ["Free tickets", "Lessons at school"], "“Vessels” are boats; “lessons have been learned” promises improvement.", "ferry", "new vessels are coming, lessons have been learned")
      ],
      written: { t: "ferry", marks: 2, q: "Look at the second paragraph. Explain in your own words two reasons why the ferry is so important to the islands.",
        look: ["People need it to get to hospital / medical care.", "Food and supplies (bread) are brought by it.", "Young people need it to get to school or sit exams."],
        levels: OWN_WORDS,
        model: "Islanders depend on the ferry to reach medical care on the mainland, and every bit of food in the shops arrives on it.",
        tip: "Two marks, two points. Change the key words: “hospital” can stay, but explain rather than copy “lifeline”." } },

    { id: "en4-words", n: 3, short: "Word choice", title: "Word choice: what words suggest", paper: "RUAE analysis questions",
      blurb: "Pick out a word, say what it suggests (its connotations), and link that to what the writer wants you to think.",
      items: [
        Q("connotations", "What does “panic” suggest in “what a panic’s in thy breastie”?", "The mouse is terrified.", ["The mouse is calm.", "The mouse is curious."], "Panic suggests sudden, overwhelming fear.", "to-a-mouse", "O, what a panic’s in thy breastie!"),
        Q("word choice", "In “The last ferry”, what does “gamble” suggest about every crossing?", "It is risky: you can’t be sure it will happen.", ["It is fun and exciting.", "It costs a lot of money."], "A gamble might be lost: the ferry may not sail.", "ferry", "every crossing will feel less like a journey than a gamble."),
        Q("word choice", "Why does the writer call the library “the most important building in Glasgow”?", "To show how much it meant to them as a child", ["Because it is the largest building in Glasgow", "Because it is the oldest building"], "It is exaggeration from a child’s point of view, showing love for the place.", "library", "I thought it was the most important building in Glasgow."),
        Q("word choice", "What does “arguing gently” suggest about the pensioners?", "They are friendly and comfortable, not angry.", ["They are about to fight.", "They are shy."], "“Gently” softens “arguing”: it’s a friendly, relaxed scene.", "library", "two pensioners arguing gently about a crossword"),
        Q("connotations", "What does “lifeline” suggest about the ferry?", "Islanders’ survival depends on it.", ["It is a fishing line.", "It is optional."], "A lifeline is thrown to someone drowning: without it, they don’t survive.", "ferry", "It is a lifeline"),
        Q("word choice", "Which word in “holds its breath” suggests anxiety?", "The whole phrase: people wait tensely, hoping things will be all right.", ["“its”: it is about the island", "None: it means people stop breathing"], "Holding your breath is what you do when you are nervously waiting.", "ferry", "cancels its appointments and holds its breath"),
        Q("how to answer", "What makes a good word choice answer?", "Quote the word, give its connotations, and explain what they show", ["Quote as much as possible", "Name the word class only"], "Reference + connotation + link to the writer’s point."),
        Q("word choice", "What does “weary” suggest about the man in the hi-vis jacket?", "He has done this so often he is tired of it.", ["He is excited.", "He is new to the job."], "Weary suggests long, repeated effort.", "ferry", "with the weary patience of a conductor"),
        Q("word choice", "What does “Nobody is a customer. Everybody is welcome.” suggest?", "The library treats people as people, not as shoppers.", ["The library has no visitors.", "Customers are not allowed in."], "“Customer” suggests buying; “welcome” suggests belonging.", "library", "Nobody is a customer. Everybody is welcome.")
      ],
      written: { t: "ferry", marks: 4, q: "Look at the first paragraph. By referring to two examples of word choice, explain how the writer makes the terminal seem busy and chaotic.",
        look: ["“queue nose to tail”: so close together there’s no space; crowded.", "“leans on his horn”: impatience and noise.", "“busiest place”: superlative, the busiest of all.", "“waves everyone forward”: constant movement, a crowd to manage."],
        levels: MARKS_2,
        model: "“Vans queue nose to tail” suggests the vehicles are packed tightly together with no gaps, so the terminal feels crowded. “A crofter leans on his horn” suggests constant, impatient noise, as people are frustrated at waiting.",
        tip: "Two examples, two marks each: quote a word, say what it suggests, and link it to “busy and chaotic”." } },

    { id: "en4-imagery", n: 4, short: "Imagery", title: "Imagery: similes, metaphors and personification", paper: "RUAE analysis questions",
      blurb: "Imagery compares one thing to another. Say what the comparison is, and what it shows about the real thing.",
      items: [
        Q("simile", "Which is a simile?", "with the weary patience of a conductor whose orchestra will not stop tuning up", ["Vans queue nose to tail.", "It is a lifeline"], "It compares the man to a conductor; it suggests he is managing chaos patiently.", "ferry", "with the weary patience of a conductor whose orchestra will not stop tuning up"),
        Q("metaphor", "“It is a lifeline” is a metaphor. What is being compared to what?", "The ferry to a rope thrown to someone drowning", ["The island to a boat", "A fish to a line"], "Root: a lifeline saves life. Effect: the islands could not survive without it.", "ferry", "It is a lifeline"),
        Q("personification", "“an island … holds its breath”. What technique is this?", "Personification", ["Simile", "Alliteration"], "An island can’t breathe: it is given human qualities to show the islanders’ anxiety.", "ferry", "It empties its shelves, cancels its appointments and holds its breath."),
        Q("imagery", "What does the conductor image suggest about the vehicles?", "They are noisy and won’t settle down, like an orchestra tuning up.", ["They are playing music.", "They are perfectly organised."], "An orchestra tuning up is a chaotic noise before order: the queue is the same.", "ferry", "a conductor whose orchestra will not stop tuning up"),
        Q("imagery", "How should you explain an image?", "Say what the real thing is compared to, what that thing is like, and so what it shows", ["Name it and move on", "Say if you like it"], "SQA wants the “root” of the image (what it literally is) and how it is used."),
        Q("simile", "“as surely as the tide” is a simile. What does it suggest about the timetable islanders want?", "Completely reliable, always on time", ["Wet and stormy", "Changing every day"], "The tide comes in and out at times you can predict exactly.", "ferry", "a timetable they can trust as surely as the tide"),
        Q("metaphor", "Which is a metaphor?", "A gamble (for every crossing)", ["like a journey", "as surely as the tide"], "“Like” and “as” mark similes. The crossing is called a gamble.", "ferry", "every crossing will feel less like a journey than a gamble."),
        Q("personification", "Which is personification?", "The hills put on a show of emptiness.", ["The hills are brown.", "The hills are very high."], "Hills can’t “put on a show”: they’re made to act like performers.", "rewild-for", "Drive north from Perth and the hills put on a show of emptiness."),
        Q("imagery", "Why do writers use imagery?", "To help the reader see or feel something more vividly", ["To make sentences longer", "To fill space"], "An image links something new to something we already know and feel about.")
      ],
      written: { t: "ferry", marks: 2, q: "“It is a lifeline”. Explain what this image suggests about the ferry.",
        look: ["Root: a lifeline is a rope thrown to save someone from drowning.", "So: the islands depend on the ferry to survive / are in danger without it."],
        levels: MARKS_2,
        model: "A lifeline is a rope thrown to someone who would otherwise drown. Calling the ferry a lifeline suggests that the islands depend on it completely: without it, they cannot survive.",
        tip: "Two steps: what a lifeline really is, then what that shows about the ferry." } },

    { id: "en4-sentences", n: 5, short: "Sentence structure", title: "Sentence structure: lists, short sentences, colons and dashes", paper: "RUAE analysis questions",
      blurb: "How a sentence is built can make a point: a list piles things up, a short sentence hits hard, a colon introduces, a dash adds.",
      items: [
        Q("short sentence", "Why is “Nobody is a customer.” so short?", "To make the point stand out and sound certain", ["Because the writer ran out of ideas", "To list examples"], "A short sentence after longer ones lands with emphasis.", "library", "Nobody is a customer. Everybody is welcome."),
        Q("list", "What is the effect of the list “students revising, a man reading the newspapers, a mother with a buggy, two pensioners…”?", "It shows the wide range of people who use the library.", ["It shows the library is empty.", "It shows only students go there."], "A list builds up variety: everyone uses it.", "library", "you will find students revising, a man reading the newspapers, a mother with a buggy"),
        Q("colon", "What does the colon do in “It is a lifeline: the road to hospital…”?", "It introduces examples that explain why it’s a lifeline.", ["It ends the paragraph.", "It shows speech."], "A colon says “here’s what I mean”.", "ferry", "It is a lifeline: the road to hospital"),
        Q("dash", "What does the dash in “reliability — a timetable they can trust” do?", "It adds an explanation of what reliability means.", ["It shows the sentence is unfinished.", "It replaces a full stop."], "A dash adds extra information, often an explanation or a dramatic addition.", "ferry", "What they want is not sympathy but reliability — a timetable they can trust as surely as the tide."),
        Q("repetition", "“Each winter brings a fresh round of cancellations, and each round of cancellations brings…” What is the effect of the repetition?", "It shows a never-ending cycle of the same problems and promises.", ["It is a mistake.", "It shows things are improving."], "Repeating “each … round of cancellations” mirrors the repeating problem.", "ferry", "Each winter brings a fresh round of cancellations, and each round of cancellations brings the same promises"),
        Q("short sentences", "Why does the writer use short sentences: “Vans queue nose to tail. A crofter leans on his horn.”?", "Quick snapshots build a sense of busy activity.", ["To slow the reader down", "To show the writer is bored"], "Short, separate images make the scene feel like rapid glimpses.", "ferry", "Vans queue nose to tail. A crofter leans on his horn."),
        Q("how to answer", "What is NOT enough in a sentence structure answer?", "Naming the feature, e.g. “there is a list”", ["Explaining what the list shows", "Linking the effect to the question"], "Name it, then explain its effect: naming alone gets no marks."),
        Q("contrast", "What does the structure of “Nobody is a customer. Everybody is welcome.” highlight?", "The contrast between “nobody” and “everybody”", ["A list of customers", "A question to the reader"], "Two balanced sentences put opposite words side by side.", "library", "Nobody is a customer. Everybody is welcome."),
        Q("climax", "In “It empties its shelves, cancels its appointments and holds its breath”, why is “holds its breath” last?", "It builds to the most emotional effect: the anxiety of waiting", ["It is the least important", "It is alphabetical"], "Lists often build to a climax.", "ferry", "It empties its shelves, cancels its appointments and holds its breath.")
      ],
      written: { t: "library", marks: 2, q: "Look at the final paragraph. Explain how the writer uses sentence structure to make their point about councils clear.",
        look: ["Two short sentences, “They count the books borrowed. They should count the people…”, are balanced against each other.", "The repetition of “count” highlights the contrast between what councils measure and what matters.", "Ending on “nowhere else to go” leaves the reader with the human cost."],
        levels: MARKS_2,
        model: "The writer uses two short, balanced sentences, “They count the books borrowed. They should count the people who had nowhere else to go.” Repeating “count” sets the two side by side, so the reader sees clearly that councils are measuring the wrong thing.",
        tip: "Name the feature (balance, repetition, short sentences), quote it, then say what it does." } },

    { id: "en4-tone", n: 6, short: "Tone", title: "Tone and the writer’s attitude", paper: "RUAE analysis questions",
      blurb: "Tone is the writer’s voice: angry, warm, ironic, sad. Identify it, then quote the words that create it.",
      items: [
        Q("tone", "What is the tone of the library passage’s first paragraph?", "Warm and nostalgic", ["Angry", "Sarcastic"], "Memories of gran, Mrs Reid and polish: fond looking back.", "library", "It smelled of floor polish and damp coats"),
        Q("tone", "What is the tone of “Islanders have heard it all before”?", "Weary and sceptical", ["Excited", "Grateful"], "It suggests tired disbelief at repeated promises.", "ferry", "Islanders have heard it all before."),
        Q("tone", "What is the tone of “a single rodent can do more for a wetland than a committee of engineers”?", "Mocking and humorous", ["Respectful", "Sad"], "Comparing a beaver favourably with engineers pokes fun at officials.", "rewild-for", "a single rodent can do more for a wetland than a committee of engineers"),
        Q("tone", "Which word best describes the tone of the library passage’s final paragraph?", "Critical", ["Joyful", "Neutral"], "The writer criticises councils for “counting the wrong thing”.", "library", "they are counting the wrong thing"),
        Q("tone", "How do you prove a tone?", "Name it, then quote the words that create it and explain how", ["Say what you feel about the topic", "Count the full stops"], "Tone needs evidence like any other analysis."),
        Q("tone", "What is the tone of “When people from the city tell me it is a wasteland, I want to take them out at lambing time… and let them tell me again”?", "Defiant and challenging", ["Polite and gentle", "Confused"], "He dares the critics to see what his life is really like.", "rewild-against", "let them tell me again"),
        Q("tone", "Which word means “not believing something easily”?", "Sceptical", ["Nostalgic", "Optimistic"], "A useful tone word for writers who doubt promises."),
        Q("tone", "Which word means “fondly remembering the past”?", "Nostalgic", ["Ironic", "Bitter"], "The library’s opening is nostalgic."),
        Q("attitude", "What is the writer’s attitude to library closures?", "Strongly against them", ["In favour of them", "Doesn’t care"], "They argue councils are “counting the wrong thing”.", "library")
      ],
      written: { t: "library", marks: 2, q: "Look at the first paragraph. Identify the writer’s tone and explain how one example of their language creates it.",
        look: ["Tone: warm, fond, nostalgic.", "“my gran took me”: a family memory, affectionate.", "“floor polish and damp coats”: specific sensory memories, fondly recalled.", "“knew every child by name”: a caring, personal place.", "“the most important building in Glasgow”: a child’s loving exaggeration."],
        levels: MARKS_2,
        model: "The tone is warm and nostalgic. The writer remembers that the library “smelled of floor polish and damp coats”: recalling such small, homely details suggests they look back on these visits with real affection.",
        tip: "One mark is not for naming the tone alone: quote and explain to get both." } },

    { id: "en4-accuracy", n: 7, short: "Accurate writing", title: "Writing accurately: sentences, paragraphs and spelling", paper: "Portfolio (technical accuracy)",
      blurb: "Your folio pieces and your critical essay must be accurate enough to follow: sentences, paragraphs, spelling and punctuation.",
      items: [
        Q("comma splices", "Which is written correctly?", "We missed the ferry. The next one was at six.", ["We missed the ferry, the next one was at six.", "we missed the ferry the next one was at six."], "Two sentences need a full stop (or a joining word), not a comma."),
        Q("homophones", "Which is correct?", "They’re going to their gran’s over there.", ["Their going to there gran’s over they’re.", "There going to they’re gran’s over their."], "They’re = they are; their = belongs to them; there = place."),
        Q("Standard English", "Which is Standard English?", "We were going to the shops.", ["We was going to the shops.", "We wis gaun tae the shops."], "In formal writing, use Standard English (Scots is welcome in creative writing, used deliberately)."),
        Q("apostrophes", "Which is correct?", "The island’s school is small.", ["The islands school is small.", "The island’s’ school is small."], "One island owns the school: apostrophe before the s."),
        Q("paragraphs", "When should you start a new paragraph?", "A new time, place, topic or person speaking", ["Every two sentences", "Only at the end"], "TiPToP: time, place, topic, person."),
        Q("spelling", "Which is spelled correctly?", "definitely", ["definately", "defiantly"], "Remember: de-FINITE-ly."),
        Q("Scots in writing", "When can you use Scots words in your folio?", "Deliberately, for voice or dialogue, especially in creative writing", ["Never", "Only by mistake"], "Scots used with purpose is a strength; slips in formal writing are not."),
        Q("capital letters", "Which is correct?", "On Monday we sailed to Mull.", ["On monday we sailed to mull.", "on Monday we sailed to Mull."], "Days and place names need capitals."),
        Q("proofreading", "What is the best way to proofread?", "Read slowly, sentence by sentence, as if someone else wrote it", ["Read it once quickly", "Only check the first paragraph"], "Read each sentence on its own to spot missing full stops and slips.")
      ],
      written: { kind: "edit", marks: 8, q: "Proofread this paragraph. Find and correct eight mistakes.",
        given: "last summer me and my cousin got the ferry to arran, it was roasting. we should of brung sun cream. there was alot of people on the boat and the seagulls was everywhere",
        look: ["last → Last", "me and my cousin → my cousin and I", "arran → Arran", "Arran, it → Arran. It", "we should of brung → We should have brought", "alot → a lot", "seagulls was → seagulls were", "full stop at the end"],
        levels: [["1 mark each", "One mark for each mistake found and corrected."]],
        model: "Last summer, my cousin and I got the ferry to Arran. It was roasting. We should have brought sun cream. There were a lot of people on the boat and the seagulls were everywhere.",
        tip: "Read it aloud in your head: where does your voice stop? That’s a full stop." } },

    { id: "en4-text", n: 8, short: "A text you’ve studied", title: "Writing about a text you’ve studied", paper: "Critical reading (National 4 unit, then the National 5 essay)",
      blurb: "Say what a writer does with character, setting or theme, and back it up with a quotation: the start of every critical essay.",
      items: [
        Q("character", "What does “cold, scanty and embarrassed in discourse” tell us about Mr Utterson?", "He is reserved and says little.", ["He is chatty and warm.", "He is always angry."], "“Scanty” and “embarrassed” in “discourse” (talk) show he speaks little.", "utterson", "cold, scanty and embarrassed in discourse"),
        Q("character", "Which detail shows Utterson has a kind side?", "“in any extremity inclined to help rather than to reprove”", ["“never lighted by a smile”", "“lean, long, dusty, dreary”"], "In a crisis he helps people rather than tells them off.", "utterson", "in any extremity inclined to help rather than to reprove"),
        Q("setting", "What is “setting”?", "Where and when a story takes place, and its atmosphere", ["The main character", "The writer’s life"], "Setting often creates mood."),
        Q("theme", "What is a “theme”?", "A big idea the text explores, like loss, power or identity", ["The title", "The plot summary"], "Themes are what the text is about underneath the story."),
        Q("evidence", "Which is the best evidence for “Hyde is cruel”?", "“the man trampled calmly over the child’s body”", ["“a little man who was stumping along”", "“a girl of maybe eight or ten”"], "“Calmly” shows he feels nothing as he hurts a child.", "hyde-street", "the man trampled calmly over the child’s body"),
        Q("analysis", "Why is “calmly” so shocking in “trampled calmly”?", "It shows he feels no guilt at all.", ["It shows he was walking slowly.", "It shows he was calm about being late."], "The calm contrasts horribly with the violence.", "hyde-street", "the man trampled calmly over the child’s body"),
        Q("retelling", "What is the biggest mistake in writing about a text?", "Retelling the story instead of analysing it", ["Using quotations", "Naming techniques"], "The marks are for how and why, not what happens."),
        Q("quotations", "How long should most quotations be?", "A few words, built into your sentence", ["A whole paragraph", "Never quote"], "Short, embedded quotations let you analyse closely."),
        Q("Scottish writers", "Robert Louis Stevenson, who wrote Jekyll and Hyde, was born in which city?", "Edinburgh", ["Glasgow", "London"], "Stevenson was from Edinburgh; many readers see its old and new towns in the novel’s double city.")
      ],
      written: { t: "utterson", marks: 4, q: "How does Stevenson present Mr Utterson as a contradictory character? Refer to two examples from the extract.",
        look: ["“never lighted by a smile … and yet somehow lovable”: contradiction stated outright.", "“austere with himself” but “an approved tolerance for others”.", "“inclined to help rather than to reprove”: kinder than he looks.", "“something eminently human beaconed from his eye”: warmth hidden behind the cold surface."],
        levels: MARKS_2,
        model: "Stevenson describes Utterson as “dusty, dreary and yet somehow lovable”: the word “yet” shows that beneath his dull, cold exterior there is something warm. He is also “austere with himself” but tolerant of others, suggesting he is strict with his own behaviour but kind about other people’s faults.",
        tip: "Point, quotation, explanation, twice. Keep quotations short." } }
  ];

  /* ---------------- STAGE 2: National 5 ---------------- */
  const S2 = [
    { id: "en5-ownwords", n: 1, short: "Understanding", title: "RUAE: understanding in your own words", paper: "RUAE (National 5)",
      blurb: "Most National 5 RUAE marks are for understanding: one clear point in your own words for each mark.",
      items: [
        Q("own words", "Why does the writer say the terminal is the busiest place “that nobody has heard of”?", "It is very busy but most people outside the area don’t know about it.", ["Nobody uses it.", "It is the most famous place in Scotland."], "The paradox: busy, yet unknown to the rest of the country.", "ferry", "the ferry terminal at Oban is the busiest place on the west coast that nobody has heard of"),
        Q("own words", "In your own words, why is the ferry important for teenagers?", "It is how they can reach a bigger school to take exams.", ["It takes them on holiday.", "They work on the ferry."], "“the only way a teenager … can sit an exam in a school with more than a handful of pupils”.", "ferry", "the only way a teenager on a small island can sit an exam in a school with more than a handful of pupils"),
        Q("own words", "“Much of the fleet is older than the people who crew it.” What does this mean?", "Many of the boats are very old.", ["The crews are very young.", "The boats are new."], "The boats have been in service longer than the crew have been alive.", "ferry", "Much of the fleet is older than the people who crew it."),
        Q("own words", "What do islanders hear “from the mainland” every winter?", "The same promises of new boats and improvements", ["Weather warnings", "News about exams"], "“the same promises from the mainland: new vessels are coming, lessons have been learned.”", "ferry"),
        Q("own words", "In “Switch them off”, what does the writer say critics claim?", "A ban is outdated, phones are useful and young people must learn to manage them.", ["Phones should be banned everywhere.", "Pencil cases are useless."], "“Critics say a ban is old-fashioned, that phones are useful tools and that young people must learn to manage them.”", "phones", "Critics say a ban is old-fashioned, that phones are useful tools and that young people must learn to manage them."),
        Q("own words", "Why does the writer say phones are “built to steal” attention?", "They are deliberately designed to keep people using them.", ["They are often stolen.", "They break easily."], "“designed by some of the cleverest engineers on the planet to keep us scrolling.”", "phones", "Learning needs attention, and phones are built to steal it."),
        Q("own words", "What have schools that lock phones away reported?", "Calmer corridors and more talking at lunch", ["Higher exam results", "More phones being stolen"], "“calmer corridors and more conversation at lunchtime”.", "phones", "Schools that lock phones away during the day often report calmer corridors and more conversation at lunchtime."),
        Q("technique", "A question says “Explain in your own words”. Which answer scores?", "Islanders don’t want pity; they want a service they can depend on.", ["They want not sympathy but reliability.", "Reliability — a timetable they can trust."], "Only the first is in your own words.", "ferry"),
        Q("technique", "How long should a 2-mark own-words answer be?", "Two short, clear points: a sentence or two", ["A full page", "One word"], "About a minute a mark: be precise, not long.")
      ],
      written: { t: "phones", marks: 3, q: "Look at the second and third paragraphs. Explain in your own words three arguments the writer makes or responds to about phones in school.",
        look: ["Studying requires concentration, and phones are designed to take it away.", "Apps are deliberately designed by experts to keep you using them.", "Opponents say banning is outdated / phones can be useful tools / pupils need to learn self-control.", "The writer replies that a pencil case does most of the same jobs without distractions."],
        levels: OWN_WORDS,
        model: "1. Pupils need to concentrate to learn, and phones are deliberately designed to pull concentration away. 2. Some people think banning phones is outdated because they can be helpful tools. 3. The writer answers that ordinary school equipment can do most of those jobs without constant interruptions.",
        tip: "Number your points. Three marks, three separate points, each in your own words." } },

    { id: "en5-wordchoice", n: 2, short: "Word choice", title: "RUAE: analysing word choice", paper: "RUAE (National 5)",
      blurb: "Quote a single word or short phrase, give its connotations, and explain how it creates the effect the question asks about.",
      items: [
        Q("word choice", "In “phones are built to steal it”, what does “steal” suggest?", "Phones take attention away without permission, like a thief.", ["Phones are expensive.", "Phones are often stolen."], "“Steal” suggests something taken dishonestly, against your will.", "phones", "phones are built to steal it"),
        Q("word choice", "What does “It is time to admit that it has not worked” suggest about the writer’s view?", "Schools have failed and should face the truth.", ["Schools are succeeding.", "Phones work well in class."], "“Admit” suggests confessing a failure people have avoided facing.", "phones", "It is time to admit that it has not worked."),
        Q("word choice", "In “thirty heads turning towards it”, what does the writer want to show?", "How easily one buzz distracts a whole class", ["That the class is very large", "That pupils are polite"], "Every pupil is distracted at once.", "phones", "thirty heads turning towards it"),
        Q("word choice", "What does “cleverest engineers on the planet” suggest about the challenge pupils face?", "It’s an unfair fight against experts.", ["Engineers are friendly.", "Pupils should become engineers."], "Superlative + “on the planet”: pupils are up against the best in the world.", "phones", "designed by some of the cleverest engineers on the planet to keep us scrolling"),
        Q("word choice", "In “The last ferry”, what does “gamble” suggest?", "Uncertainty and risk: islanders can’t know if they will get there.", ["Fun and luck", "Expensive tickets"], "A gamble may be lost.", "ferry", "every crossing will feel less like a journey than a gamble."),
        Q("word choice", "What does “empties its shelves” suggest?", "Food runs out quickly, showing how dependent the island is.", ["People are tidying up.", "Shops are closing for good."], "Physical, visible shortage.", "ferry", "It empties its shelves"),
        Q("word choice", "Why is “Childhood is short” effective as word choice?", "The plain, simple words make the point feel undeniable.", ["It uses complex vocabulary.", "It is a question."], "Simple diction can sound like an obvious truth.", "phones", "Childhood is short."),
        Q("how to answer", "Which answer would score 2 marks?", "“Steal” suggests phones take our attention dishonestly and without our permission, showing how harmful the writer thinks they are.", ["The writer uses the word “steal”.", "“Steal” is a good word."], "Reference + connotation + link to the question."),
        Q("word choice", "What do “calmer corridors” and “more conversation” suggest about schools without phones?", "They are more peaceful and sociable.", ["They are noisier.", "Pupils are silent."], "Positive words for a better atmosphere.", "phones", "calmer corridors and more conversation at lunchtime")
      ],
      written: { t: "phones", marks: 4, q: "Look at the first two paragraphs. By referring to two examples of word choice, analyse how the writer makes clear their negative view of phones in school.",
        look: ["“buzz”: an irritating, distracting noise.", "“steal”: phones dishonestly take attention.", "“admit … has not worked”: confessing a failure.", "“keep us scrolling”: endless, mindless use.", "“fire alarm”: impossible to ignore (imagery, can be credited as word choice)."],
        levels: MARKS_2,
        model: "The writer says phones are “built to steal” attention. “Steal” suggests something taken dishonestly and against our will, so phones are presented as thieves rather than tools. They also say apps are designed to “keep us scrolling”, which suggests endless, mindless activity that traps pupils rather than helping them learn.",
        tip: "Choose single, strong words. Two examples, two detailed comments: 4 marks." } },

    { id: "en5-imagery", n: 3, short: "Imagery", title: "RUAE: analysing imagery", paper: "RUAE (National 5)",
      blurb: "Explain the root of the image (what it literally means), then what the comparison shows about the real thing.",
      items: [
        Q("imagery", "“like asking them to ignore a fire alarm”. What does this simile suggest about phones?", "Their alerts are impossible to ignore.", ["Phones can start fires.", "Phones are safe."], "A fire alarm is designed to grab attention urgently: so is a notification.", "phones", "Asking a fourteen-year-old to ignore that in a maths lesson is like asking them to ignore a fire alarm."),
        Q("imagery", "What is the root of the “conductor” image in “The last ferry”?", "A conductor tries to bring an orchestra into order.", ["A conductor checks tickets on a bus.", "A conductor carries electricity."], "Here the orchestra “will not stop tuning up”: noise that won’t settle.", "ferry", "the weary patience of a conductor whose orchestra will not stop tuning up"),
        Q("imagery", "“as surely as the tide”. Why is this image apt for islanders?", "The tide is a reliable, natural rhythm they live by every day.", ["Islanders dislike the sea.", "Tides are unpredictable."], "It links reliability to something islanders know intimately.", "ferry", "a timetable they can trust as surely as the tide"),
        Q("imagery", "What does “holds its breath” suggest about the island?", "The whole community waits anxiously.", ["The island is underwater.", "People are swimming."], "Personification: tense waiting.", "ferry", "It empties its shelves, cancels its appointments and holds its breath."),
        Q("imagery", "“a pencil case … does not send notifications”. What is the effect?", "It humorously shows simple tools don’t distract you.", ["It praises phones.", "It shows pencil cases are useless."], "Deflating comparison: the low-tech option wins.", "phones", "But a pencil case can do most of that too, and it does not send notifications."),
        Q("how to answer", "What scores 0 for an imagery question?", "Just naming it: “This is a simile.”", ["Explaining the root and its effect", "Linking it to the question"], "The comparison must be explained."),
        Q("imagery", "In “Let the glens grow wild”, what does “forgotten what it used to be” suggest?", "The land has lost its true nature, like someone with lost memory.", ["The land is newly made.", "People have forgotten the glens."], "Personification: the landscape has lost its identity.", "rewild-for", "It is a landscape that has been grazed, burned and drained until it has forgotten what it used to be."),
        Q("imagery", "“mistake it for beauty”. Which is the best comment?", "We’ve been fooled into seeing a damaged landscape as beautiful.", ["The landscape is beautiful.", "Beauty is a mistake."], "The writer claims our perception has been distorted.", "rewild-for", "We have grown so used to the bareness that we mistake it for beauty."),
        Q("imagery", "What makes an imagery answer score 2?", "Explaining what the image literally is AND how it applies here", ["Quoting a long passage", "Saying the image is effective"], "Root + application.")
      ],
      written: { t: "ferry", marks: 4, q: "By referring to two examples of imagery, analyse how the writer conveys the importance of the ferry and the difficulties islanders face.",
        look: ["“lifeline”: a rope that saves someone drowning; the islands’ survival depends on the ferry.", "“holds its breath”: personification; tense, anxious waiting.", "“as surely as the tide”: the tide is utterly reliable; islanders want that certainty.", "“gamble”: every crossing is a risk that may be lost."],
        levels: MARKS_2,
        model: "The ferry is called “a lifeline”. A lifeline is a rope thrown to someone in danger of drowning, so the image suggests that the islands’ survival depends completely on the ferry. The writer also says every crossing feels like “a gamble”: just as a gamble can be lost, islanders can never be sure the boat will sail, showing how uncertain their lives are.",
        tip: "Root, then application. “A lifeline is… so the ferry…”" } },

    { id: "en5-structure", n: 4, short: "Sentence structure", title: "RUAE: sentence structure and punctuation", paper: "RUAE (National 5)",
      blurb: "Lists, repetition, short sentences, questions, colons and dashes: name the feature, quote it, and explain its effect.",
      items: [
        Q("short sentence", "What is the effect of “The case is simple.”?", "It sounds confident, as if the argument is obvious.", ["It shows doubt.", "It asks a question."], "A short declarative sentence projects certainty.", "phones", "The case is simple."),
        Q("contrast", "What is the effect of the sentence structure in “They have a point: … But a pencil case can do most of that too”?", "The writer concedes a point, then dismisses it.", ["The writer changes their mind.", "The writer agrees completely."], "Concession followed by “But” turns the argument.", "phones", "But a pencil case can do most of that too, and it does not send notifications."),
        Q("list", "What does the list “a calculator, a dictionary and a camera” do?", "It fairly lists the useful jobs phones can do (before the writer dismisses them).", ["It shows phones are useless.", "It lists banned items."], "The list concedes the critics’ point.", "phones", "a phone can be a calculator, a dictionary and a camera"),
        Q("colon", "In “The case is simple. Learning needs attention, and phones are built to steal it.”, why is the second sentence balanced?", "Two halves set what learning needs against what phones do.", ["It is a list of three.", "It asks a question."], "Balance highlights the conflict.", "phones", "Learning needs attention, and phones are built to steal it."),
        Q("short sentences", "Why does the article end “Childhood is short. It should not be spent looking down.”?", "Two short, emphatic sentences make a memorable final point.", ["To list more facts", "Because the writer ran out of space"], "Short sentences give the ending punch.", "phones", "Childhood is short. It should not be spent looking down."),
        Q("repetition", "In “The last ferry”, what does the repetition of “round of cancellations” suggest?", "The problem keeps happening in a frustrating cycle.", ["The cancellations have ended.", "It is a printing error."], "Structure mirrors meaning.", "ferry", "Each winter brings a fresh round of cancellations, and each round of cancellations brings the same promises"),
        Q("dash", "What does the dash do in “survive mainly in place names and old stories” after “— the lynx, the beaver, the wolf —”?", "The dashes insert a list of lost animals for emphasis.", ["They end the sentence.", "They show speech."], "A pair of dashes adds a parenthesis.", "rewild-for", "— the lynx, the beaver, the wolf —"),
        Q("how to answer", "Which comment on a list would score?", "The list of people shows the library welcomes everyone, of every age.", ["There is a list.", "The writer uses commas."], "Effect, linked to meaning."),
        Q("question", "What is a rhetorical question?", "A question asked for effect, not to get an answer", ["A question in an exam", "A question with no question mark"], "It makes the reader think or agree.")
      ],
      written: { t: "phones", marks: 4, q: "Look at the third and fourth paragraphs. By referring to two examples of sentence structure, analyse how the writer strengthens their argument.",
        look: ["“They have a point: …”: the colon introduces the concession fairly.", "“But a pencil case…”: the sentence opener “But” turns the argument against the critics.", "The list “a calculator, a dictionary and a camera” concedes, then is undercut.", "“Those are not small things.” Short sentence gives emphasis.", "“Childhood is short. It should not be spent looking down.” Short, punchy ending."],
        levels: MARKS_2,
        model: "The writer begins a sentence with “But a pencil case can do most of that too”. Starting with “But” turns the argument: after fairly listing what phones can do, the writer dismisses it, making their case seem stronger for having considered the other side. The short sentence “Those are not small things.” stands out after a longer one and insists that calmer corridors really matter.",
        tip: "Name the structure (list, short sentence, opener, colon), quote it, explain what it does for the argument." } },

    { id: "en5-tone", n: 5, short: "Tone and links", title: "RUAE: tone, and how a writer links ideas", paper: "RUAE (National 5)",
      blurb: "Identify the writer’s tone and prove it; and explain how a sentence links back to one idea and on to the next.",
      items: [
        Q("link", "How does “And boats do break down.” link the second and third paragraphs?", "“break down” refers back to the breakdowns just mentioned; the paragraph then explains why they happen.", ["It starts a new topic about holidays.", "It has no link."], "A link sentence looks back and forward.", "ferry", "And boats do break down."),
        Q("link", "What does a “link question” ask you to do?", "Show how a sentence refers back to the previous idea and introduces the next", ["Find a website", "Summarise the whole passage"], "Quote the words that look back and the words that look forward."),
        Q("tone", "What is the tone of “Islanders have heard it all before”?", "Cynical and weary", ["Hopeful", "Excited"], "Repeated broken promises make them disbelieving.", "ferry", "Islanders have heard it all before."),
        Q("tone", "What is the tone of “a single rodent can do more for a wetland than a committee of engineers”?", "Humorous and mocking", ["Formal and respectful", "Angry and violent"], "It makes fun of committees.", "rewild-for", "a single rodent can do more for a wetland than a committee of engineers"),
        Q("tone", "Which phrase creates a confident, persuasive tone in “Switch them off”?", "“It is time to admit”", ["“They have a point”", "“often report”"], "A firm call to face facts.", "phones", "It is time to admit that it has not worked."),
        Q("link", "In “Switch them off”, how does “Critics say…” work as a link?", "It moves from the writer’s case to the opposing view.", ["It repeats the opening.", "It ends the article."], "A turn in the argument.", "phones", "Critics say a ban is old-fashioned"),
        Q("tone", "What tone does “Those are not small things.” create?", "Firm and serious", ["Joking", "Uncertain"], "Insisting on importance.", "phones", "Those are not small things."),
        Q("tone", "How many marks is a tone question usually worth?", "2: identify the tone and explain it with a reference", ["10", "0"], "Naming alone isn’t enough."),
        Q("link", "Which words in “The objections are familiar, and some are fair” link back?", "“The objections”, referring to criticism of rewilding", ["“familiar”", "“fair”"], "“The objections” assumes the argument just made, and introduces the other side.", "rewild-for", "The objections are familiar, and some are fair.")
      ],
      written: { t: "ferry", marks: 2, q: "Explain how the sentence “And boats do break down.” helps to link the second and third paragraphs.",
        look: ["“break down” refers back to “When a boat breaks down” in the previous paragraph.", "It introduces the third paragraph’s point: the boats are old and break down often."],
        levels: [["2 marks", "Reference back (with quotation) and a clear explanation of what is introduced."], ["1 mark", "Only one direction explained, or a basic explanation."]],
        model: "“break down” links back to the previous paragraph’s description of what happens to an island “when a boat breaks down”. “And … do” then insists this is common, introducing the new point that the ageing fleet fails often.",
        tip: "Two moves: what it looks back to (quote it), what it introduces." } },

    { id: "en5-summary", n: 6, short: "Summary", title: "RUAE: the final question (summarising)", paper: "RUAE (National 5), last question",
      blurb: "Pick out the key points across the whole passage and sum them up in your own words, one mark a point.",
      items: [
        Q("summary", "In the final question, what should each point be?", "A separate key idea from anywhere in the passage", ["A quotation", "Your opinion"], "Usually five points for five marks, in your own words."),
        Q("summary", "Which is a key point of “The last ferry”?", "The ferry service is unreliable because the boats are old.", ["A crofter leans on his horn.", "The terminal is at Oban."], "Key points are the argument, not small details.", "ferry"),
        Q("summary", "Which is a key point of “Switch them off”?", "Phones damage concentration, so schools should lock them away.", ["Phones can be a camera.", "There are thirty pupils in a class."], "The main argument.", "phones"),
        Q("summary", "How should you set out a summary answer?", "Bullet points or numbered points are fine", ["One long quotation", "A poem"], "SQA accepts bullet points for summary questions."),
        Q("summary", "Which is NOT a key point of the library passage?", "The library smelled of floor polish.", ["Libraries give free, warm space to everyone.", "Councils measure the wrong thing when closing libraries."], "A detail, not a key point."),
        Q("summary", "Why should summary points be in your own words?", "To show you understand the ideas", ["Because quotations are banned", "To make it longer"], "Copied points often score nothing."),
        Q("summary", "A summary question says “Identify five key points”. How many should you aim for?", "Five clear, different points (a sixth if unsure)", ["One detailed point", "Twenty points"], "Don’t repeat the same idea twice."),
        Q("summary", "Which key point does the final paragraph of “The last ferry” make?", "Until the service is reliable, every journey feels risky.", ["Ferries are cheap.", "The tide is high."], "“every crossing will feel less like a journey than a gamble”.", "ferry"),
        Q("summary", "What’s the best way to find key points?", "Find the topic sentence of each paragraph", ["Find the longest words", "Read only the first line"], "Each paragraph usually carries one key point.")
      ],
      written: { t: "ferry", marks: 5, q: "Look at the whole passage. Identify five key points the writer makes about the ferry service and island life. Use your own words as far as possible.",
        look: ["The terminal is very busy but little known.", "The ferry is essential for islanders (not a luxury).", "Islanders depend on it for medical care, food and education.", "When it fails, island life comes to a stop.", "The boats are old and break down often, especially in winter.", "Officials keep making promises that aren’t kept.", "Islanders want a dependable service, not pity."],
        levels: [["1 mark each", "Any five key points, in your own words."]],
        model: "• The port is busy, though few people beyond the area know it. • Islanders depend on the ferry for healthcare, food and schooling. • When it fails, normal life stops. • The ageing boats break down often in winter. • Islanders are tired of promises and simply want a service they can rely on.",
        tip: "About 5 minutes. Short bullet points, one per mark." } },

    { id: "en5-scottish", n: 7, short: "Scottish text", title: "The Scottish text: short questions and the 10-mark question", paper: "Critical Reading, Section 1 (National 5)",
      blurb: "Answer short analysis questions on an extract, then the 10-mark question that links it to the rest of the text.",
      items: [
        Q("analysis", "How does Stevenson make Hyde’s act seem horrifying?", "“trampled calmly” contrasts violence with total calm", ["He describes the weather", "He uses a long list of names"], "The calmness shows no conscience.", "hyde-street", "the man trampled calmly over the child’s body"),
        Q("analysis", "What does “Juggernaut” suggest about Hyde?", "He is an unstoppable, inhuman force that crushes everything", ["He is a gentle giant", "He is a lorry driver"], "A juggernaut crushes all in its path.", "hyde-street", "It wasn’t like a man; it was like some damned Juggernaut."),
        Q("analysis", "What is the effect of “It sounds nothing to hear, but it was hellish to see”?", "It stresses that the horror can only be understood by witnessing it.", ["It shows the event was quiet.", "It shows Enfield is lying."], "Contrast between hearing and seeing.", "hyde-street", "It sounds nothing to hear, but it was hellish to see."),
        Q("10-mark question", "How are the 10 marks in the final Scottish text question split?", "2 for commonality, 2 for the extract, 6 for elsewhere in the text", ["10 for the extract", "5 and 5"], "Most of the marks come from your knowledge of the whole text."),
        Q("10-mark question", "What does “commonality” mean in the final question?", "What the extract and the rest of the text have in common (the theme or idea in the question)", ["A list of characters", "The writer’s biography"], "Say it clearly, e.g. “Throughout the novel, Hyde is presented as less than human.”"),
        Q("analysis", "What does “a man of a rugged countenance that was never lighted by a smile” suggest?", "Utterson is serious and stern.", ["Utterson is always laughing.", "Utterson is young."], "“Never lighted by a smile” = never smiles.", "utterson", "a man of a rugged countenance that was never lighted by a smile"),
        Q("analysis", "What is the effect of the long list “lean, long, dusty, dreary and yet somehow lovable”?", "The dull words pile up, then “yet” turns to a surprising warmth.", ["It shows he is exciting.", "It describes his house."], "A turn at the end of the list.", "utterson", "lean, long, dusty, dreary and yet somehow lovable"),
        Q("technique", "For the 6 “elsewhere” marks, how many other references should you make?", "At least three, each with a comment (2 marks each)", ["One", "None"], "Plan three moments from elsewhere in the text before writing."),
        Q("Scottish texts", "Why does this climb use Stevenson and Burns for Scottish text practice?", "They are out of copyright; the same method works for any set text", ["They are the only Scottish writers", "SQA sets only them"], "Use your own set text for real practice; the question types are the same.")
      ],
      written: { t: "hyde-street", marks: 10, q: "By referring to this extract and to elsewhere in the novel, show how Stevenson presents Hyde as inhuman or evil.",
        look: ["Commonality (2): throughout the novel Hyde is presented as less than human, an embodiment of evil.", "Extract (2): “trampled calmly”, the calm cruelty; “It wasn’t like a man”, “Juggernaut”.", "Elsewhere (6): the murder of Sir Danvers Carew (“ape-like fury”); people feel instant loathing of him without knowing why; his deformity that cannot be named; Jekyll’s own account of Hyde as pure evil."],
        levels: FINAL_10,
        model: "Throughout the novel, Stevenson presents Hyde as an inhuman embodiment of evil (2). In the extract, he “trampled calmly” over a child: the calmness shows he feels no human pity (2). Later, he murders Sir Danvers Carew with “ape-like fury”, the animal imagery suggesting he is less than human (2). Everyone who meets him feels a loathing they cannot explain, as though he is wrong in some deep, unnatural way (2). In his final statement Jekyll describes Hyde as the evil part of himself alone, “pure evil” with nothing good mixed in (2).",
        tip: "Spend about 20 minutes. Commonality first, then the extract, then three other moments." } },

    { id: "en5-essay", n: 8, short: "Critical essay", title: "The critical essay", paper: "Critical Reading, Section 2 (National 5)",
      blurb: "Answer one essay question on a text you’ve studied: an argument with a clear line of thought, analysis and evidence.",
      items: [
        Q("essay", "How long do you have for the critical essay?", "About 45 minutes", ["Two hours", "Ten minutes"], "The Critical Reading paper is 1 hour 30 minutes: about half for each section."),
        Q("essay", "What must your introduction do?", "Name the text and writer, and answer the question in a sentence", ["Summarise the whole plot", "Describe your feelings"], "A thesis gives your essay a line of thought."),
        Q("essay", "What is a “line of thought”?", "Your argument, followed through every paragraph", ["A list of quotations", "The plot in order"], "Each paragraph develops your answer to the question."),
        Q("essay", "What should each paragraph start with?", "A topic sentence linked to the question", ["A quotation", "A new plot event"], "Topic sentence, evidence, analysis, link back."),
        Q("essay", "What does “analysis” mean in an essay?", "Explaining how the writer’s techniques create effects", ["Retelling events", "Copying quotations"], "Techniques + effects = analysis."),
        Q("essay", "Why does the question matter so much?", "Relevance to the question is in every mark band", ["It doesn’t; write what you prepared", "Only the first paragraph needs it"], "Adapt your prepared knowledge to the question asked."),
        Q("essay", "What should your conclusion do?", "Sum up your argument and answer the question directly", ["Introduce a new point", "Retell the ending"], "Close the line of thought."),
        Q("essay", "Which is the best topic sentence for “a character who changes”?", "At the start of the novel, Scrooge is cold and isolated, but Dickens shows this is a choice he can unmake.", ["Scrooge is in A Christmas Carol.", "Here is a quotation about Scrooge."], "It answers the question and sets up the change."),
        Q("essay", "What about technical accuracy?", "It must be good enough to follow; poor accuracy can keep an essay below the pass", ["It doesn’t count", "Only spelling counts"], "Proofread your essay in the last few minutes.")
      ],
      written: { kind: "write", marks: 0, q: "Choose a novel or short story you have studied in which a character changes. Write the introduction and one full body paragraph of an essay explaining how the writer shows this change.",
        look: ["Introduction: title, writer, and a thesis that answers the question.", "Topic sentence that links to the question.", "Short embedded quotation(s) with analysis of technique.", "A link back to the question at the end of the paragraph."],
        check: ["My introduction names the text and writer.", "My introduction answers the question in one sentence.", "My paragraph starts with a topic sentence.", "I used at least one short quotation and analysed it.", "My paragraph links back to the question."],
        model: "In A Christmas Carol, Charles Dickens shows Ebenezer Scrooge changing from a cold, isolated miser into a generous man. Dickens presents this change as a choice, made possible by facing the past, the present and the future.\n\nAt the start of the novel, Dickens presents Scrooge as completely shut off from other people. He is “secret, and self-contained, and solitary as an oyster”. The simile suggests a creature sealed inside a hard shell: Scrooge protects himself from others, and nothing can get in. The list of three adjectives, each adding to his isolation, emphasises how far he has cut himself off. This makes his later warmth all the more striking, as the reader sees how much he has to change.",
        tip: "Plan: thesis + three points before you write. Spend about 45 minutes on a full essay." } }
  ];

  /* ---------------- STAGE 3: Higher ---------------- */
  const S3 = [
    { id: "enh-ownwords", n: 1, short: "Understanding", title: "Higher RUAE: understanding and summarising", paper: "RUAE (Higher)",
      blurb: "Higher understanding questions want precise points in your own words, often about the writer’s argument or stance.",
      items: [
        Q("understanding", "In “Let the glens grow wild”, why does the writer say the landscape is not “unspoiled”?", "It has been damaged by grazing, burning and draining.", ["It has never been touched.", "Tourists have spoiled it."], "“grazed, burned and drained until it has forgotten what it used to be”.", "rewild-for", "It is a landscape that has been grazed, burned and drained until it has forgotten what it used to be."),
        Q("understanding", "What does the writer claim about the animals that once lived in the forests?", "They are now extinct here, remembered only in names and stories.", ["They are common today.", "They never lived in Scotland."], "“survive mainly in place names and old stories”.", "rewild-for", "survive mainly in place names and old stories"),
        Q("understanding", "What does rewilding mean, according to the writer?", "Stepping back and letting nature recover", ["Planting crops", "Building new farms"], "“what if we stepped back?”", "rewild-for", "Rewilding asks a simple question: what if we stepped back?"),
        Q("understanding", "In “Not on our hill”, what is the farmer against?", "The idea that local people are the problem and should be removed", ["Planting trees", "Cleaner rivers"], "“What I am against is the idea … that the people who live on the land are the problem to be removed.”", "rewild-against", "What I am against is the idea, popular in certain offices far from here, that the people who live on the land are the problem to be removed."),
        Q("understanding", "What does the farmer say rewilding can mean “on the ground”?", "Communities shrinking, so a village school closes", ["More tourists", "Cheaper land"], "“a village school closing because the families … have sold up and gone.”", "rewild-against", "On the ground it can mean a village school closing"),
        Q("understanding", "How does the farmer see stone dykes and paths?", "As signs of the people who made a living on hard land", ["As damage to nature", "As tourist attractions"], "“not scars but signatures”.", "rewild-against", "these are not scars but signatures"),
        Q("understanding", "What does the farmer propose?", "Restore nature with local people, not against them", ["Stop all tree planting", "Remove all sheep"], "“with the people of the glens, not over their heads.”", "rewild-against", "But let us do it with the people of the glens, not over their heads."),
        Q("technique", "What does “in your own words” rule out at Higher?", "Lifting key phrases from the passage", ["Using any word from the passage", "Bullet points"], "Gloss the key ideas: show you understand them."),
        Q("understanding", "Why does the farmer mention lambing at four in the morning in the sleet?", "To show the hard reality of working the land that city critics don’t see", ["To describe a holiday", "To complain about the weather only"], "It challenges the “wasteland” view.", "rewild-against", "I want to take them out at lambing time, at four in the morning, in the sleet")
      ],
      written: { t: "rewild-for", marks: 4, q: "Look at the first two paragraphs. Identify, in your own words, four criticisms the writer makes of the current Scottish landscape.",
        look: ["It only looks natural; it isn’t.", "It has been damaged by grazing, burning and draining.", "Little native forest remains.", "Native animals have vanished.", "People now wrongly think the bare land is beautiful."],
        levels: OWN_WORDS,
        model: "• It looks natural but has been shaped by people. • Animals, fire and drainage have damaged it. • Very little original forest is left. • We have become so used to its bareness that we wrongly find it beautiful.",
        tip: "Four marks, four separate points, each glossed in your own words." } },

    { id: "enh-analysis", n: 2, short: "Language", title: "Higher analysis: language working together", paper: "RUAE (Higher)",
      blurb: "At Higher, analyse word choice, imagery and sentence structure in depth, and link each to the writer’s purpose.",
      items: [
        Q("word choice", "What do “show of emptiness” suggest?", "The landscape is putting on a performance: its emptiness is not natural but staged.", ["The hills are empty and natural.", "A show is being performed there."], "“Show” implies something false.", "rewild-for", "Drive north from Perth and the hills put on a show of emptiness."),
        Q("sentence structure", "What is the effect of “Visitors call it unspoiled. It is nothing of the kind.”?", "The short, blunt contradiction dismisses the visitors’ view.", ["It agrees with visitors.", "It asks a question."], "Short counter-statement for force.", "rewild-for", "Visitors call it unspoiled. It is nothing of the kind."),
        Q("imagery", "“not scars but signatures”. Analyse this image.", "Marks on the land are not damage but proud evidence of the people who worked it.", ["The land is injured.", "The farmer signs documents."], "Scars = damage; signatures = identity and authorship.", "rewild-against", "these are not scars but signatures"),
        Q("word choice", "What does “sold up and gone” suggest?", "Families have been forced to give up and leave for good.", ["Families have gone on holiday.", "Families have made a profit."], "Finality and loss.", "rewild-against", "have sold up and gone"),
        Q("sentence structure", "What is the effect of the triple “Let the trees return… Let rivers bend… Bring back the beaver”?", "Repeated commands build a rousing, visionary call to act.", ["A list of questions", "A complaint"], "Imperatives in sequence create momentum.", "rewild-for", "Let the trees return to the glens. Let rivers bend and flood as rivers should. Bring back the beaver"),
        Q("word choice", "What do “certain offices far from here” suggest about the farmer’s view of rewilding’s supporters?", "They are distant officials who don’t understand the land.", ["They are local farmers.", "They work very hard on the land."], "Contempt for remote decision-makers.", "rewild-against", "popular in certain offices far from here"),
        Q("imagery", "“a warning we have chosen not to read”. Analyse the image.", "The dying landscape is like a written warning we deliberately ignore.", ["We cannot read.", "Warnings are hard to find."], "Root: a sign or message; we choose blindness.", "rewild-for", "It is a warning we have chosen not to read."),
        Q("technique", "What makes a Higher analysis answer insightful?", "Exploring connotations precisely and linking them to the writer’s purpose", ["Naming many techniques briefly", "Quoting long sections"], "Depth over breadth."),
        Q("sentence structure", "What is the effect of ending “It is simply abandoned.”?", "A short, stark final verdict that turns the word “wild” against rewilders", ["A question to the reader", "A list of examples"], "Short final sentence with a sting.", "rewild-against", "A landscape without its people is not wild. It is simply abandoned.")
      ],
      written: { t: "rewild-for", marks: 4, q: "Look at paragraphs 1 and 2. Analyse how the writer’s use of language creates a critical view of the landscape. You should refer to at least two features such as word choice, imagery or sentence structure.",
        look: ["“show of emptiness”: the emptiness is a performance, not natural.", "“Visitors call it unspoiled. It is nothing of the kind.”: blunt contradiction.", "“grazed, burned and drained”: list of damaging verbs; deliberate destruction.", "“forgotten what it used to be”: personification; loss of identity.", "“mistake it for beauty”: our perception has been corrupted."],
        levels: MARKS_2,
        model: "The writer says the hills “put on a show of emptiness”. “Show” suggests a performance, something staged and not genuine, so the apparent wildness is presented as false. The list of verbs “grazed, burned and drained” builds up the damage done by people, each verb an action against the land, so the reader sees the bareness as the result of deliberate harm rather than nature.",
        tip: "At Higher, 2 marks need a detailed, insightful comment: explore what the word suggests and why that matters to the argument." } },

    { id: "enh-link", n: 3, short: "Structure", title: "Higher: structure and the link question", paper: "RUAE (Higher)",
      blurb: "How the writer moves the argument on: links between paragraphs, turning points, and the role a paragraph plays.",
      items: [
        Q("link", "How does “The objections are familiar, and some are fair.” work in the argument?", "It turns from the writer’s case to acknowledge the other side, then rejects it.", ["It ends the article without a view.", "It repeats the opening."], "A concession that sets up a counter.", "rewild-for", "The objections are familiar, and some are fair."),
        Q("structure", "Why does the farmer open with his family’s four generations?", "To establish his authority and personal stake", ["To complain about his family", "To describe the weather"], "Credibility from experience.", "rewild-against", "My family has farmed this hill for four generations."),
        Q("structure", "What turning point comes with “I am not against trees.”?", "He sets aside a misunderstanding before stating his real objection.", ["He changes his mind entirely.", "He agrees with all rewilding."], "Clarifies his position.", "rewild-against", "I am not against trees."),
        Q("structure", "What role does the final paragraph of “Not on our hill” play?", "It offers a compromise and ends with a memorable reversal of “wild”.", ["It introduces a new topic.", "It lists statistics."], "Concession plus closing punch.", "rewild-against"),
        Q("link", "What does a strong link answer quote?", "Words that refer back and words that introduce the new idea", ["Only the first word", "The whole paragraph"], "Two directions, both supported."),
        Q("structure", "Why does the rewilding writer use a question: “what if we stepped back?”", "It invites the reader to imagine the alternative before it is described.", ["The writer doesn’t know the answer.", "It is a mistake."], "A hinge between problem and solution.", "rewild-for", "Rewilding asks a simple question: what if we stepped back?"),
        Q("structure", "What is a “cyclical” structure?", "An ending that returns to the opening idea or image", ["A random order", "A list of points"], "It gives a sense of completion."),
        Q("structure", "How does “But a landscape that is slowly dying is not a heritage worth protecting.” answer the objections?", "It turns the critics’ value (heritage) against them.", ["It agrees with the critics.", "It introduces the beaver."], "Reframing the opposing argument.", "rewild-for", "But a landscape that is slowly dying is not a heritage worth protecting."),
        Q("structure", "What is the function of “Rewilding is a lovely word.”?", "A concession, immediately undercut by what it can mean in practice", ["Praise for rewilding", "A definition"], "Ironic concession.", "rewild-against", "Rewilding is a lovely word.")
      ],
      written: { t: "rewild-against", marks: 3, q: "Explain how the sentence “I am not against trees.” helps to develop the writer’s argument.",
        look: ["It anticipates and rejects a likely accusation (that farmers oppose all trees).", "“I have planted thousands of them” gives evidence for it.", "It clears the way for his real objection: people being treated as the problem."],
        levels: [["3 marks", "A clear explanation of how it looks back or answers an assumption, and how it introduces the real objection, with references."], ["2 marks", "One direction explained clearly, the other basic."], ["1 mark", "A basic explanation."]],
        model: "The sentence answers the assumption, implied by the rewilding debate, that hill farmers are simply opposed to trees, and he backs it with evidence: “I have planted thousands of them”. Having set that misunderstanding aside, he can introduce his real objection: “What I am against is the idea … that the people who live on the land are the problem.”",
        tip: "Ask: what does this sentence do for the argument at this point?" } },

    { id: "enh-tone", n: 4, short: "Tone", title: "Higher: tone, register and stance", paper: "RUAE (Higher)",
      blurb: "Higher writers shift tone deliberately: irony, defiance, anger, humour. Name the tone precisely and prove it.",
      items: [
        Q("tone", "What is the tone of “Rewilding is a lovely word.”?", "Ironic", ["Sincere and admiring", "Neutral"], "“Lovely” is undercut by what follows.", "rewild-against", "Rewilding is a lovely word."),
        Q("tone", "What is the tone of “let them tell me again”?", "Defiant and challenging", ["Polite", "Uncertain"], "A dare to the critics.", "rewild-against", "let them tell me again"),
        Q("tone", "What tone does “a single rodent can do more for a wetland than a committee of engineers” create?", "Wry humour that mocks bureaucracy", ["Respect for engineers", "Fear of rodents"], "Gentle mockery.", "rewild-for", "a single rodent can do more for a wetland than a committee of engineers"),
        Q("tone", "What is the tone of the rewilding writer’s final sentence?", "Grave and accusing", ["Playful", "Hopeful and light"], "“a warning we have chosen not to read”: we are to blame.", "rewild-for", "It is a warning we have chosen not to read."),
        Q("register", "What is the register of both passages?", "Largely formal, with some conversational touches", ["Slang throughout", "Technical scientific language"], "Journalism mixes formal argument with a personal voice."),
        Q("tone", "How does the farmer’s tone change in the final paragraph?", "From defiant to conciliatory, offering cooperation", ["From calm to furious", "It doesn’t change"], "“By all means let us have more woodland”.", "rewild-against", "By all means let us have more woodland and cleaner rivers."),
        Q("tone", "Which word best fits “Visitors call it unspoiled. It is nothing of the kind.”?", "Dismissive", ["Sentimental", "Hesitant"], "Bluntly rejects the visitors’ view.", "rewild-for", "Visitors call it unspoiled. It is nothing of the kind."),
        Q("stance", "What is the farmer’s overall stance?", "For nature recovery, but only if local people are part of it", ["Against all change", "Entirely in favour of rewilding as it is"], "Nuanced position.", "rewild-against"),
        Q("tone", "What must a tone answer include to score full marks at Higher?", "A precise tone word, a reference, and analysis of how the language creates the tone", ["Only the tone word", "Only a quotation"], "Identify, reference, analyse.")
      ],
      written: { t: "rewild-against", marks: 4, q: "Analyse how the writer creates a tone of defiance in the first two paragraphs.",
        look: ["“let them tell me again”: a challenge to critics.", "“at lambing time, at four in the morning, in the sleet”: a list that builds the harsh reality, daring critics to face it.", "“I am not against trees.”: blunt, confident rebuttal.", "“certain offices far from here”: contempt for distant officials.", "“Rewilding is a lovely word.”: ironic dismissal."],
        levels: MARKS_2,
        model: "The farmer says he wants to take critics out “at lambing time, at four in the morning, in the sleet”. The list piles up the hardships, each detail harsher than the last, daring those critics to call the land a wasteland after facing them. He dismisses the idea’s supporters as belonging to “certain offices far from here”: the vague “certain offices” sneers at faceless officials who are physically and emotionally distant from the land.",
        tip: "Two references, each with detailed analysis linked to the tone." } },

    { id: "enh-evaluate", n: 5, short: "Evaluation", title: "Higher: evaluating effectiveness", paper: "RUAE (Higher)",
      blurb: "Evaluate how effective a part of the passage is (often the ending): what it does, and how well, with evidence.",
      items: [
        Q("evaluation", "Why is “A landscape without its people is not wild. It is simply abandoned.” an effective ending?", "It redefines “wild” and leaves the reader with a stark image of loss.", ["It introduces new facts.", "It asks the reader a question."], "Reversal plus finality.", "rewild-against", "A landscape without its people is not wild. It is simply abandoned."),
        Q("evaluation", "How does the rewilding writer’s ending link to the opening?", "The “emptiness” of the opening becomes a “warning” we ignore.", ["It doesn’t link at all.", "It repeats the first sentence."], "Cyclical structure strengthens the conclusion.", "rewild-for"),
        Q("evaluation", "What makes an ending effective, in general?", "It sums up, links back, and leaves an impact", ["It is the longest paragraph", "It introduces a new argument"], "Use these three tests."),
        Q("evaluation", "How effective is the beaver example?", "Very: it is a concrete, memorable illustration with humour.", ["Not at all: beavers are irrelevant.", "It is a statistic."], "Specific examples persuade.", "rewild-for", "Bring back the beaver, which is already busy proving that a single rodent can do more for a wetland than a committee of engineers."),
        Q("evaluation", "How does the farmer’s personal experience affect his argument’s effectiveness?", "It gives authority and emotional force.", ["It weakens it completely.", "It has no effect."], "First-hand experience persuades.", "rewild-against"),
        Q("evaluation", "Which answer evaluates rather than describes?", "The ending is effective because the short final sentence turns “wild” into “abandoned”, leaving the reader with an image of loss.", ["The ending is about abandoned land.", "The ending has two sentences."], "Evaluation judges effect and explains why."),
        Q("evaluation", "Why is “Let rivers bend and flood as rivers should.” persuasive?", "It presents flooding as natural and right, making rewilding seem obvious.", ["It warns about floods.", "It is a list of rivers."], "Reframes a fear as natural order.", "rewild-for", "Let rivers bend and flood as rivers should."),
        Q("evaluation", "What does “By all means” signal about the farmer’s tone at the end?", "Generous concession, making him seem reasonable", ["Total refusal", "Confusion"], "Concession builds credibility.", "rewild-against", "By all means let us have more woodland and cleaner rivers."),
        Q("evaluation", "How many marks does an evaluation question usually carry at Higher?", "2 to 4", ["10", "20"], "One or two well-explained references.")
      ],
      written: { t: "rewild-against", marks: 3, q: "Evaluate the effectiveness of the final paragraph as a conclusion to the passage.",
        look: ["It concedes common ground (“more woodland and cleaner rivers”), making the farmer seem reasonable.", "“with the people of the glens, not over their heads”: a balanced contrast summing up his central point.", "The final two short sentences redefine “wild” as “abandoned”: a memorable reversal that links back to the “wasteland” of the opening."],
        levels: [["3 marks", "Detailed evaluation of one feature, or two features evaluated more briefly, with references."], ["2 marks", "Clear evaluation with a reference."], ["1 mark", "Basic evaluation."]],
        model: "The conclusion is effective because the farmer first concedes common ground (“By all means let us have more woodland”), which makes him seem reasonable rather than stubborn. He then sums up his central point with the balanced contrast “with the people of the glens, not over their heads”. Finally, the short sentences “A landscape without its people is not wild. It is simply abandoned.” turn the rewilders’ favourite word against them, leaving a stark image of loss that answers the opening claim that his land is a “wasteland”.",
        tip: "Judge, don’t describe: say why each feature works as an ending." } },

    { id: "enh-compare", n: 6, short: "Comparison", title: "Higher: the comparison question", paper: "RUAE (Higher), last question (5 marks)",
      blurb: "Identify the key areas where the two writers agree or disagree, with evidence from both passages.",
      items: [
        Q("comparison", "Where do the two writers AGREE?", "Both want more woodland and healthier rivers.", ["Both want all farming stopped.", "Both think the land is a wasteland."], "The farmer: “By all means let us have more woodland and cleaner rivers.”"),
        Q("comparison", "Where do they DISAGREE about the bare land?", "One sees damage; the other sees a working landscape with human history.", ["Both see damage.", "Both see beauty only."], "“grazed, burned and drained” against “not scars but signatures”."),
        Q("comparison", "Where do they disagree about people?", "The rewilder says little about locals; the farmer says they must be central.", ["Both want locals removed.", "Neither mentions people."], "“with the people of the glens, not over their heads”."),
        Q("comparison", "What does the final question usually ask?", "Identify key areas of agreement or disagreement, with evidence", ["Analyse one word", "Summarise one passage only"], "Usually 5 marks."),
        Q("comparison", "How can you set out the comparison answer?", "Bullet points, each a key area with evidence from both passages", ["One quotation", "A poem"], "Bullets are fine; each must cover both writers."),
        Q("comparison", "Which is a key area of disagreement?", "Whether the current landscape is natural or damaged", ["Whether Scotland has hills", "Which city is bigger"], "A central point of the debate."),
        Q("comparison", "How do both writers treat the word “wild”?", "The rewilder sees wildness as recovery; the farmer says wild without people is abandonment.", ["They use it identically.", "Neither uses it."], "The key word is contested."),
        Q("comparison", "What gets the most marks in the comparison question?", "Clear key areas, each supported by evidence from both passages", ["Long quotations from one passage", "Your opinion on rewilding"], "Evidence from both is essential."),
        Q("comparison", "Which is the best start to a comparison bullet?", "Both writers want nature to recover: the first calls to “Let the trees return”; the second says “By all means let us have more woodland”.", ["The first passage is about trees.", "I agree with the farmer."], "Key area, then evidence from each.")
      ],
      written: { texts: ["rewild-for", "rewild-against"], marks: 5, q: "Look at both passages. The writers disagree about rewilding. Identify three key areas on which they disagree. You should support the points you make by referring to important ideas in both passages.",
        look: ["Whether the land is damaged and empty (passage 1: “grazed, burned and drained”) or a worked, living landscape (passage 2: “not scars but signatures”).", "Who rewilding affects: passage 1 focuses on nature; passage 2 says local communities lose out (“a village school closing”).", "What “wild” means: passage 1 sees recovery; passage 2: “not wild … simply abandoned”.", "Possible agreement: both want more woodland and cleaner rivers."],
        levels: [["5 marks", "Three key areas, each clearly supported by evidence from both passages (or a more detailed treatment of fewer areas)."], ["3–4 marks", "Key areas identified, with some evidence from both."], ["1–2 marks", "A general point, or evidence from one passage only."]],
        model: "• The state of the land: the first writer sees the bare hills as damaged, “grazed, burned and drained”, while the farmer sees a working landscape whose marks are “not scars but signatures”.\n• People: the first writer’s vision centres on nature returning, while the farmer insists rewilding must be done “with the people of the glens, not over their heads”, warning of schools closing.\n• What “wild” means: for the first writer, a wild landscape is a recovered one; for the farmer, land without people is “not wild. It is simply abandoned.”",
        tip: "About 10 to 15 minutes. Plan a quick table: key area, passage 1 evidence, passage 2 evidence." } },

    { id: "enh-scottish", n: 7, short: "Scottish text", title: "Higher Scottish text: Burns and the 10-mark question", paper: "Critical Reading, Section 1 (Higher)",
      blurb: "Analyse a Scottish poem closely (here, Burns’s “To a Mouse”), then link it to other poems by the same poet.",
      items: [
        Q("analysis", "What is the effect of the list of adjectives in “Wee, sleekit, cow’rin, tim’rous beastie”?", "It builds sympathy for the small, frightened mouse.", ["It shows the mouse is dangerous.", "It describes the plough."], "Each word stresses smallness and fear.", "to-a-mouse", "Wee, sleekit, cow’rin, tim’rous beastie,"),
        Q("analysis", "What does “man’s dominion / Has broken Nature’s social union” suggest?", "Humans’ power over nature has destroyed a natural harmony.", ["Mice rule the world.", "Nature is at peace."], "Dominion = control; social union = partnership, now broken.", "to-a-mouse", "Has broken Nature’s social union"),
        Q("analysis", "Why does the speaker call the mouse “fellow-mortal”?", "To show humans and mice share the same fragile, mortal condition", ["To insult the mouse", "To show the mouse is immortal"], "Equality in mortality.", "to-a-mouse", "An’ fellow-mortal!"),
        Q("theme", "What is the meaning of “The best-laid schemes o’ mice an’ men / Gang aft agley”?", "However carefully we plan, things often go wrong.", ["Mice are better planners than men.", "Plans always succeed."], "The poem’s most famous lines: a universal truth.", "to-a-mouse", "The best-laid schemes o’ mice an’ men"),
        Q("analysis", "How does the final verse change the poem’s focus?", "From the mouse’s misfortune to the speaker’s own fears about past and future", ["To a new animal", "To the plough"], "“Still thou art blest, compar’d wi’ me”.", "to-a-mouse", "Still thou art blest, compar’d wi’ me!"),
        Q("analysis", "Why is the mouse “blest” compared to the speaker?", "It only lives in the present, while he regrets the past and fears the future.", ["It has a new house.", "It can see the future."], "“The present only toucheth thee”.", "to-a-mouse", "The present only toucheth thee:"),
        Q("form", "What is the effect of the short lines (e.g. “Wi’ bickering brattle!”) in each verse?", "They add punch and a lively, rhythmic snap to each stanza", ["They slow the poem to a stop", "They are mistakes"], "The “Burns stanza” ends with short, emphatic lines.", "to-a-mouse", "Wi’ bickering brattle!"),
        Q("language", "Why does Burns write in Scots?", "It gives an authentic, intimate rural voice", ["Because English didn’t exist", "To confuse readers"], "Scots makes the speaker a real farmer speaking to a real mouse."),
        Q("10-mark question", "For the 10-mark question on Burns, what must you refer to?", "This poem and at least one other Burns poem you have studied", ["Only this poem", "Burns’s biography only"], "Commonality, the extract, then elsewhere in his work.")
      ],
      written: { t: "to-a-mouse", marks: 10, q: "By referring to this poem and to at least one other poem by Burns, discuss how he explores the relationship between people and the world around them.",
        look: ["Commonality (2): Burns often questions human pride and shows sympathy for the powerless.", "Extract (2): “man’s dominion / Has broken Nature’s social union”; “fellow-mortal”; the speaker’s own fear in the last verse.", "Elsewhere (6), e.g.: “To a Louse” (O wad some Pow’r the giftie gie us / To see oursels as ithers see us!) mocks human vanity; “Holy Willie’s Prayer” exposes hypocrisy; “A Man’s a Man for a’ That” sees worth in all people regardless of rank."],
        levels: FINAL_10,
        model: "Burns repeatedly questions human pride and shows sympathy with those who have no power (2). In “To a Mouse”, the speaker regrets that “man’s dominion / Has broken Nature’s social union”, suggesting humans have abused their power, and he calls the mouse his “fellow-mortal”, putting them on equal terms (2). In “To a Louse”, a louse on a fine lady’s bonnet exposes her vanity, ending with the wish that we could “see oursels as ithers see us”, again humbling human pride (2). In “Holy Willie’s Prayer”, the self-righteous speaker condemns others while excusing his own sins, so Burns exposes hypocrisy (2). In “A Man’s a Man for a’ That”, he insists that rank and wealth are worth nothing beside honest character (2).",
        tip: "About 20 minutes: 2 + 2 + 6. Know three or four quotations from each Burns poem you study." } },

    { id: "enh-essay", n: 8, short: "Critical essay", title: "The Higher critical essay", paper: "Critical Reading, Section 2 (Higher)",
      blurb: "A sustained argument that answers the question exactly, with detailed analysis and an evaluative stance.",
      items: [
        Q("essay", "What lifts a Higher essay into the top bands?", "A convincing line of thought, insightful analysis and a clear evaluative stance", ["More plot detail", "Longer quotations"], "Argue, analyse, evaluate."),
        Q("essay", "How should you deal with the question’s two parts (e.g. “… and how this contributes to the text as a whole”)?", "Address both, throughout the essay", ["Answer only the first", "Answer the second in the last sentence"], "Many Higher questions have two parts."),
        Q("essay", "What is an “evaluative stance”?", "Your judgement on how effectively the writer achieves their purpose", ["Your opinion of the characters", "A summary"], "E.g. “Dickens’s most powerful technique is…”"),
        Q("essay", "How should context be used?", "Woven in where it deepens analysis", ["As a separate history section", "Not at all"], "Context should serve the argument."),
        Q("essay", "What is the best way to prepare for unpredictable questions?", "Know key scenes, quotations and themes, then adapt them to the question", ["Memorise one essay", "Read the plot summary only"], "Prepared essays often lose relevance."),
        Q("essay", "Which is a strong Higher thesis?", "In Macbeth, Shakespeare presents ambition as a force that destroys the very order it seeks to command.", ["Macbeth is about a man called Macbeth.", "I like Macbeth."], "A clear, arguable claim."),
        Q("essay", "Why use short, embedded quotations?", "They let you analyse specific words closely", ["They save space", "They are required by law"], "Precision supports insight."),
        Q("essay", "How long should you spend planning a 45-minute essay?", "About 5 minutes", ["None", "30 minutes"], "Thesis plus four or five points."),
        Q("essay", "What does “relevance” mean in the marking?", "Every paragraph answers the question asked", ["Using all your notes", "Writing a lot"], "Irrelevance can sink an otherwise strong essay.")
      ],
      written: { kind: "write", marks: 0, q: "Choose a play, novel or poem you have studied. Write the introduction and a full body paragraph for this question: “Choose a text in which a central character makes a decision with serious consequences. Discuss how the writer presents the decision and how it contributes to your understanding of the text as a whole.”",
        look: ["Introduction: text, writer, the decision, and a thesis covering both parts of the question.", "Topic sentence that links to the question.", "Embedded quotations analysed in detail (technique and effect).", "An evaluative comment and a link to the text as a whole."],
        check: ["My thesis answers both parts of the question.", "My paragraph starts with a clear topic sentence.", "I analysed at least two short quotations in detail.", "I made an evaluative comment (how effectively the writer does it).", "I linked back to the text as a whole."],
        model: "In Macbeth, Shakespeare presents Macbeth’s decision to murder King Duncan as the moment he chooses ambition over conscience. The decision drives the whole tragedy: it shows how unchecked ambition destroys not only the natural order of kingship but the self.\n\nBefore the murder, Shakespeare shows that Macbeth knows exactly what he is choosing. In his soliloquy he admits he has “no spur / To prick the sides of my intent, but only / Vaulting ambition”. The image of ambition as a rider vaulting onto a horse and overshooting suggests a leap that carries him past the point of control, and the fact that he says it alone, to the audience, makes his guilt clear: he cannot claim he was misled. Shakespeare’s choice to let him see his own motives so clearly is what makes the play a tragedy rather than a simple story of a villain, because we watch an intelligent man destroy himself with his eyes open.",
        tip: "45 minutes. Plan both parts of the question into your thesis." } }
  ];

  /* ---------------- The portfolio (folio): two pieces at each level ---------------- */
  const WRITING = [
    { id: "en4-reflective", stage: "en4", kind: "Personal reflective writing", paper: "Portfolio (creative)", minutes: 60, marks: 15, grade: "National 4 to 5",
      q: "Write a personal reflective piece about a place that matters to you.",
      plan: ["Choose one place and one moment there you remember clearly.", "Note three senses for that moment: sight, sound, smell.", "Ask: why does it matter to me now? That’s your reflection.", "Plan four paragraphs: the place; the moment; what happened next; what it means to you now."],
      model: "The bench at the end of Largs promenade has my grandad’s name on a little brass plate. I sit there most Sundays.\n\nWhen I was seven, he bought me a 99 from Nardini’s and we watched the ferry slide across to Cumbrae. The ice cream dripped down my wrist faster than I could lick it, and he laughed so much his hat fell off. The gulls screamed at us for the flake.\n\nHe died the winter I turned twelve. For a long time I couldn’t walk past the bench.\n\nNow I go on purpose. The sea is the same grey-green, and the ferry still slides across, back and forth, as if nothing has changed. Sitting there, I realise that he gave me more than ice cream. He taught me to notice things: the colour of the water, the way the gulls hang in the wind. When I notice them now, he is there.",
      notes: ["Opens with a specific, concrete detail (the brass plate).", "Senses bring the memory alive: dripping ice cream, screaming gulls.", "A short paragraph marks the turning point (his death).", "The ending reflects: what the place means now, not just what happened.", "To lift it: more varied sentence structures and one sustained image."] },
    { id: "en4-persuasive", stage: "en4", kind: "Persuasive writing", paper: "Portfolio (discursive)", minutes: 60, marks: 15, grade: "National 4 to 5",
      q: "Write a persuasive essay arguing that every young person in Scotland should have free bus travel. (Or argue against it.)",
      plan: ["Decide your view and write it in one sentence.", "Three reasons, each with an example or fact you can explain.", "One counter-argument, and your answer to it.", "A conclusion that calls for action."],
      model: "For a teenager in a small town, the bus is freedom. Free bus travel for young people should be protected and extended, because it opens up education, work and independence.\n\nFirstly, free travel helps young people get to school, college and training. Not every course is on the doorstep. A free bus pass means a pupil in a village can take a subject only taught in the next town.\n\nSecondly, it helps families. Bus fares add up quickly, and for many households they are a real cost. Free travel removes one worry.\n\nSome people argue that it costs too much. However, a generation that can reach education and jobs is an investment, not an expense.\n\nThe bus pass is a ticket to opportunity. Scotland should make sure every young person can use one.",
      notes: ["Clear view stated in the first paragraph.", "Each paragraph has one reason with explanation.", "Counter-argument acknowledged and answered.", "Persuasive ending: “a ticket to opportunity”.", "To lift it: more evidence and more varied persuasive techniques."] },
    { id: "en5-creative", stage: "en5", kind: "Prose fiction", paper: "Portfolio (creative)", minutes: 75, marks: 15, grade: "National 5, grade A/B",
      q: "Write a short story set in one place over a short time, in which a character has to make a choice.",
      plan: ["One setting, one or two characters, one choice.", "Decide the choice first, then work back to the opening.", "Plan five beats: hook, situation, pressure, choice, consequence.", "Choose one image or object to return to at the end."],
      model: "The last bus out of Ullapool left at 6.15. Kirsty had her ticket in one hand and her phone in the other, and neither of them was making the decision for her.\n\n“You’ll come back,” her mum had said that morning, not looking up from the dishes. It wasn’t a question.\n\nThe college letter was in her bag, folded so many times it had gone soft at the creases. Glasgow. A course in marine biology. A room in halls with a window that looked at another window.\n\nThe bus pulled in with a hiss. The driver nodded at her. Behind her, the harbour was pink with the evening and a fishing boat she’d known all her life was nosing in past the pier.\n\nShe thought of her mum’s hands in the hot water. She thought of the soft letter.\n\nKirsty climbed the steps, sat by the window, and watched the harbour until the road bent and it was gone. Then she unfolded the letter one more time and read it, slowly, as if for the first time.",
      notes: ["Strong opening with a clear time and tension.", "Dialogue used sparingly and with subtext (“It wasn’t a question.”).", "Concrete details (soft creases, the window facing a window) carry emotion.", "Structure builds to a single choice, shown not told.", "The letter returns at the end: a satisfying, controlled close."] },
    { id: "en5-discursive", stage: "en5", kind: "Argumentative essay", paper: "Portfolio (discursive)", minutes: 75, marks: 15, grade: "National 5, grade A/B",
      q: "“Mobile phones should be banned in Scottish secondary schools.” Write an argumentative essay considering both sides and reaching a conclusion.",
      plan: ["Introduction: the issue and why it matters now.", "Two arguments for a ban, with evidence.", "Two arguments against, with evidence.", "Conclusion: weigh them and give your judgement."],
      model: "Few objects divide a school staffroom like the smartphone. To some teachers, it is the greatest threat to concentration in a generation; to others, a powerful learning tool. Should Scotland’s secondary schools ban them?\n\nThose in favour of a ban point first to attention. Notifications are designed to interrupt, and every interruption costs time to refocus. They also point to wellbeing: schools that have locked phones away often report calmer corridors and more conversation at lunchtime.\n\nHowever, opponents argue that phones can support learning: as dictionaries, calculators and research tools. They also argue that young people must learn to manage technology rather than avoid it, since they will use it for the rest of their lives.\n\nOn balance, a full ban seems the clearer path in lessons, where attention matters most, but schools should teach responsible use too. The aim should not be to pretend phones don’t exist, but to give pupils space to think without them.",
      notes: ["The introduction frames the debate fairly.", "Both sides are given with reasons and evidence.", "Linking words (However, On balance) signal structure.", "The conclusion weighs the arguments rather than just repeating them.", "Formal register maintained throughout."] },
    { id: "enh-creative", stage: "enh", kind: "Personal reflective essay", paper: "Portfolio (creative)", minutes: 90, marks: 15, grade: "Higher, grade A/B",
      q: "Write a reflective essay about an experience that changed the way you see yourself or others.",
      plan: ["Choose an experience with a real change in understanding.", "Plan the shape: the before, the moment, the after.", "Find one image or motif to carry the reflection.", "Leave room for honest, nuanced reflection: not a neat moral."],
      model: "I used to think my grandmother’s Gaelic was a kind of furniture: old, solid, belonging to another room in the house. She spoke it on the phone to her sister in Lewis, a quick, rising music I tuned out like the radio.\n\nThe summer she was ill, I sat with her in the hospital in Inverness. On the third day she woke frightened and spoke to me, urgently, in Gaelic. I didn’t understand a word. She looked at me as if I were a stranger, and in that moment I was.\n\nI have been learning since. Slowly, badly, with an app and a patient teacher on a Tuesday night. I am not fluent. I may never be. But last month I phoned her sister and said, haltingly, who I was. There was a silence, then a laugh, and then that quick, rising music, slowed down for me.\n\nIt was not furniture after all. It was a door. I had been living beside it all my life.",
      notes: ["An opening image (language as furniture) is developed and overturned at the end (a door).", "Honest reflection: “I am not fluent. I may never be.”", "Short sentences at key moments for impact.", "Specific, controlled details (Lewis, Inverness, Tuesday night).", "The ending reframes the whole piece: a crafted cyclical structure."] },
    { id: "enh-discursive", stage: "enh", kind: "Persuasive essay", paper: "Portfolio (discursive)", minutes: 90, marks: 15, grade: "Higher, grade A/B",
      q: "Write a persuasive essay on whether Scotland should rewild large areas of its land.",
      plan: ["Take a clear, nuanced stance (not simply for or against).", "Research: two pieces of evidence for each main point.", "Plan a structure that builds: strongest point last or a turning point.", "Concede and reframe the strongest opposing argument."],
      model: "Scotland likes to sell itself as wild. The tourist board’s glens are empty and majestic, and the heather glows purple in every advert. But emptiness is not the same as wildness, and Scotland’s next great project should be to let some of its land recover.\n\nThe case begins with what has been lost. Much of the Highlands once carried woodland; today most of it is open, grazed hillside. Native species have gone. What remains is beautiful, but it is a beauty we have learned to see, not the land’s natural state.\n\nYet any honest argument must face the people who live there. Hill farmers have every right to be angry when distant offices talk about “empty” land. Rewilding that clears communities would simply repeat an old Scottish injustice in green clothing.\n\nThe answer is not to choose between nature and people, but to design recovery with them: woodland and wages, beavers and jobs. A wilder Scotland can be a more lived-in one.",
      notes: ["A provocative opening that challenges a familiar image.", "Evidence-led argument with clear topic sentences.", "The counter-argument is not dismissed but taken seriously and reframed.", "Historical resonance (“an old Scottish injustice”) without lecturing.", "A balanced, memorable conclusion with antithesis (“woodland and wages”)."] }
  ];

  // The self-check list for folio writing at each stage
  const CHECK = {
    en4: { goal: "National 4, on the way to 5", content: ["My piece does what the task asks (reflective, or persuasive).", "I planned before writing.", "I wrote in paragraphs, each about one thing.", "I used details (senses, examples) to bring ideas alive.", "My ending reflects or calls for action."],
      accuracy: ["Every sentence starts with a capital letter and ends with a full stop.", "No comma splices.", "Their/there/they’re and to/too are right.", "I used Standard English (except deliberate Scots).", "I proofread it slowly at the end."] },
    en5: { goal: "National 5, grade A or B", content: ["My piece has a clear purpose and suits its genre.", "My structure is deliberate (a turning point, a return at the end).", "I used techniques with purpose: imagery, dialogue, varied sentences.", "Discursive: I covered both sides with evidence, and concluded.", "My vocabulary is precise and varied."],
      accuracy: ["My punctuation includes colons, semicolons and dashes used correctly.", "Spelling is secure, including harder words.", "Paragraphing is clear and purposeful.", "My expression is fluent: varied sentence openings and lengths."] },
    enh: { goal: "Higher, grade A or B", content: ["My piece has a distinctive voice that holds throughout.", "Its structure is crafted: an image or idea developed and resolved.", "Reflection is honest and insightful, not a neat moral.", "Discursive: my stance is nuanced and I reframe the strongest counter-argument.", "Every paragraph moves the piece forward."],
      accuracy: ["Sentences are crafted for effect, not just correct.", "Punctuation shapes meaning and pace.", "There are almost no errors, even in complex sentences.", "Vocabulary is ambitious and precise."] }
  };

  const GRADES = [
    ["National 4", "Reading: finds main ideas and explains some language in a simple way, with evidence. Writing: clear, organised in paragraphs, mostly accurate. (Assessed in class: no exam.)"],
    ["National 5", "Reading: understands ideas in its own words; analyses word choice, imagery and structure with relevant references; sums up key points. Writing: well organised, with techniques used for effect and secure accuracy. Grade C needs about half the marks; A about 70%."],
    ["Higher", "Reading: detailed, insightful analysis and evaluation; compares two writers’ ideas precisely. Writing: crafted, with a distinctive voice and a nuanced stance. Critical essays sustain a convincing line of thought."]];

  const EXAM = {
    papers: [
      { name: "Reading for Understanding, Analysis and Evaluation (RUAE)", time: "National 5: 1 hour · Higher: 1 hour 30 minutes", marks: 30, text: "National 5: one non-fiction passage. Higher: two passages on the same topic.",
        qs: [["Most", "Understanding, in your own words", "2–4 each", "a minute a mark"], ["Several", "Analysis: word choice, imagery, sentence structure, tone", "2–4 each", "a minute a mark"], ["Some", "Evaluation, and the link question", "2–3 each", "a minute a mark"], ["Last", "N5: summary of key points · Higher: compare the two writers", 5, "about 10 minutes"]] },
      { name: "Critical Reading", time: "1 hour 30 minutes", marks: 40, text: "Section 1: a Scottish set text. Section 2: a critical essay on a text studied in class.",
        qs: [["1", "Scottish text: short questions on an extract", 10, "about 20 minutes"], ["1", "Scottish text: the final question (extract + rest of text)", 10, "about 25 minutes"], ["2", "Critical essay (on a different genre from the Scottish text)", 20, "about 45 minutes"]] }],
    reading: "Read the RUAE passage(s) once for the argument, then answer question by question; each question tells you which lines to look at.",
    writing: "The portfolio is two pieces, one broadly creative and one broadly discursive, written during the course. Each is marked out of 15 for content, structure, expression and technical accuracy.",
    boards: "National 5 and Higher English are set by SQA; check SQA’s website for this year’s course specification, dates and set Scottish texts.",
    spoken: "There is also a spoken language assessment (a presentation or discussion), marked pass or fail in class."
  };

  /* MINI PAPERS: one hour each, a shortened RUAE paper and a shortened Critical Reading paper. */
  const MINI = [
    { id: "en4-paper-1", title: "Mini paper: reading (National 4 skills)", minutes: 45, t: "library",
      parts: [{ ref: "en4-understand", minutes: 5 }, { ref: "en4-tone", minutes: 5 }, { ref: "en4-sentences", minutes: 5 },
        { q: "Explain in your own words why the writer still goes to the library, even though they own a phone.", t: "library", marks: 2, minutes: 5, look: ["A library isn’t mainly for information.", "It gives free, warm space to stay as long as you like.", "Nobody expects you to spend money."], levels: OWN_WORDS, model: "The library isn’t really for looking things up. It is a warm place where you can stay for free without being pressured to spend anything." }] },
    { id: "en4-paper-2", title: "Mini paper: reading and a text (National 4 skills)", minutes: 45, t: "ferry",
      parts: [{ ref: "en4-ownwords", minutes: 5 }, { ref: "en4-words", minutes: 10 }, { ref: "en4-imagery", minutes: 5 },
        { q: "What is the writer’s attitude to the people on the mainland who make promises? Give a quotation to support your answer.", t: "ferry", marks: 2, minutes: 5, look: ["Sceptical, critical or weary.", "“Islanders have heard it all before.”", "“the same promises”"], levels: MARKS_2, model: "The writer is sceptical: “Islanders have heard it all before” suggests the promises have been made and broken many times." }] },
    { id: "en5-paper-1", title: "Mini paper: RUAE (like National 5)", minutes: 60, t: "phones",
      parts: [{ ref: "en5-ownwords", minutes: 10 }, { ref: "en5-wordchoice", minutes: 10 }, { ref: "en5-structure", minutes: 10 },
        { q: "Look at the whole passage. Identify five key points the writer makes about phones in schools. Use your own words as far as possible.", t: "phones", marks: 5, minutes: 10, look: ["Schools have tried to accept phones and it has failed.", "Learning needs concentration, which phones are designed to destroy.", "Apps are deliberately addictive.", "Phones can be useful tools, but simpler items do the same jobs.", "Schools without phones are calmer and more sociable.", "Childhood is short and shouldn’t be wasted on screens."], levels: [["1 mark each", "Any five key points, in your own words."]], model: "• Letting phones into schools hasn’t worked. • Phones are designed to break concentration. • Their apps are made to be addictive. • Their useful functions can be done by other equipment. • Phone-free schools are calmer and more sociable." }] },
    { id: "en5-paper-2", title: "Mini paper: Critical Reading (like National 5)", minutes: 60, t: "hyde-street",
      parts: [{ q: "Explain how Stevenson uses language to make the incident seem shocking. Refer to two examples.", t: "hyde-street", marks: 4, minutes: 8, look: ["“trampled calmly”: calm cruelty.", "“hellish to see”: horror.", "“It wasn’t like a man”: inhuman.", "“damned Juggernaut”: unstoppable, crushing force."], levels: MARKS_2, model: "“Trampled calmly” shocks because the calmness contrasts with the violence, showing Hyde feels nothing. Comparing him to “some damned Juggernaut” suggests an unstoppable, inhuman force that crushes all in its path." },
        { ref: "en5-scottish", minutes: 15 }, { q: "Section 2, critical essay. Choose a novel or short story you have studied in which a character changes. Briefly say how they change, then discuss how the writer shows this change and how it adds to your understanding of the text as a whole.", marks: 20, minutes: 35, essay: true,
          look: ["An introduction naming the text and writer, with a line of thought that answers the question.", "Three or four paragraphs, each opening with a topic sentence linked to the question.", "Short quotations or close references, with the technique named and its effect analysed.", "A conclusion that answers the question directly.", "Relevance to the question all the way through; accuracy good enough to follow."], levels: ESSAY_20 }] },
    { id: "enh-paper-1", title: "Mini paper: RUAE (like Higher)", minutes: 50, texts: ["rewild-for", "rewild-against"],
      parts: [{ ref: "enh-ownwords", minutes: 8 }, { ref: "enh-analysis", minutes: 10 }, { ref: "enh-evaluate", minutes: 6 }, { ref: "enh-compare", minutes: 15 }] },
    { id: "enh-paper-2", title: "Mini paper: Critical Reading (like Higher)", minutes: 75, t: "to-a-mouse",
      parts: [{ q: "Analyse how Burns creates sympathy for the mouse in the first verse.", t: "to-a-mouse", marks: 4, minutes: 8, look: ["“Wee, sleekit, cow’rin, tim’rous”: a list stressing smallness and fear.", "“what a panic’s in thy breastie”: exclamation shows concern; the diminutive “breastie” is tender.", "“I wad be laith to rin an’ chase thee”: the speaker doesn’t want to hurt it.", "“murd’ring pattle”: he sees his own tool as a weapon."], levels: MARKS_2, model: "The list of adjectives “Wee, sleekit, cow’rin, tim’rous” stresses how small and frightened the mouse is, each word adding to its vulnerability. The diminutive “breastie” is tender and affectionate, so the speaker sounds gentle rather than threatening." },
        { ref: "enh-scottish", minutes: 25 }, { q: "Section 2, critical essay. Choose a play, novel or poem you have studied in which a central character makes a decision with serious consequences. Discuss how the writer presents the decision and how it contributes to your understanding of the text as a whole.", marks: 20, minutes: 40, essay: true,
          look: ["A thesis that answers the whole question: the decision and the text as a whole.", "A convincing line of thought from paragraph to paragraph, not a list of points.", "Analysis of techniques (structure, imagery, dialogue, symbolism) with short, well-chosen references.", "Evaluation: how the decision shapes the text’s themes.", "A conclusion that answers the question; fluent, accurate expression."], levels: ESSAY_20 }] }
  ];

  const STAGES = [
    { key: "en4", n: 1, grades: "National 4", target: "N4", goal: "National 4", title: "Stage 1: National 4 skills", topics: S1,
      about: "The reading and writing skills National 5 takes for granted: main ideas, own words, word choice, imagery, sentence structure, tone, accurate writing and writing about a text." },
    { key: "en5", n: 2, grades: "National 5", target: "N5", goal: "National 5", title: "Stage 2: National 5", topics: S2,
      about: "The National 5 exam: RUAE (own words, word choice, imagery, structure, tone, summary), the Scottish text and the critical essay." },
    { key: "enh", n: 3, grades: "Higher", target: "Higher", goal: "Higher", title: "Stage 3: Higher", topics: S3,
      about: "Higher English: deeper analysis and evaluation of two passages, the comparison question, the Scottish text’s 10-mark question and a sustained critical essay." }
  ];

  return { key: "sqa", name: "SQA English climb", level: "Senior", exam: "SQA National 5 and Higher English", STAGES, LIT: null, WRITING, CHECK, GRADES, EXAM, MINI,
    MARKS_2, OWN_WORDS, FINAL_10, ESSAY_20,
    startLabels: ["National 4, or not sure", "National 5", "Higher"],
    writingWhy: "The portfolio is two pieces of writing, each marked out of 15: 30% of the final mark.",
    checkLabels: ["Content and structure", "Expression and accuracy"],
    other: ["Studying in England? The GCSE English climb →", "english-climb.html"] };
})();
