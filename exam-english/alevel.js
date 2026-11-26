/*
  A LEVEL ENGLISH CLIMB (England, Years 12 and 13): A level English Literature, then A level English Language,
  as two stages. The same shape as the GCSE and SQA climbs (exam-english/gcse.js, sqa.js): each topic has
  self-marking questions (a question, the right answer, two wrong ones and the reason, with the text it is about
  and the lines it quotes), and a written exam-style question with what to look for, how it is marked and a
  model answer.

  What the exams test (the DfE's GCE AS and A level subject content for English literature and for English
  language, 2014, which AQA, Edexcel, OCR and Eduqas all follow; the papers themselves are the boards' own):
    • Literature: close analysis of how meanings are shaped (AO2), with a relevant argument (AO1), context (AO3),
      connections across texts (AO4) and other readers' interpretations (AO5): an unseen text, set poetry,
      prose and drama including Shakespeare, and a non-exam assessment (coursework) comparing two texts.
    • Language: analysis with the language levels (lexis, semantics, grammar, phonology, pragmatics, discourse,
      graphology), context (mode, audience, purpose), language change, child language acquisition, language
      diversity and identity, writing about language debates, and coursework: an investigation and original writing.
  Set texts differ by board and many are in copyright, so the practice uses public-domain texts (Austen, Brontë,
  Shelley, Chopin, Wilde, Hardy, Rossetti, Blake, Jerome) and PopSpell's own transcripts and articles. The method
  works for any set text. Nothing is copied from a past paper.
*/
window.EXAM_ENGLISH = window.EXAM_ENGLISH || {};
window.EXAM_ENGLISH.alevel = (() => {
  "use strict";
  const Q = (sk, q, a, o, why, t = "", x = "") => ({ sk, q, a, o, why, t, x });

  // A level essays and analyses are marked in levels across the assessment objectives (PopSpell's plain-words summary)
  const LIT_25 = [
    ["25–21", "Perceptive and critical: a sophisticated argument, precise terms, close analysis of how meanings are shaped, and context and other readings woven into the argument."],
    ["20–16", "Thorough and coherent: a clear argument, detailed analysis with apt quotation, and context and interpretations used with purpose."],
    ["15–11", "Clear and relevant: a straightforward argument, some analysis of methods, context mentioned and sometimes linked. About a C."],
    ["10–6", "Some relevance: more retelling than analysis; context or other readings bolted on."],
    ["5–0", "Little relevance or accuracy."]];
  const LANG_25 = [
    ["25–21", "Systematic and evaluative: language levels used precisely, insightful links between features and context, and a well-supported view of meaning."],
    ["20–16", "Detailed: accurate terms across several levels, clear links between features and context, with apt examples."],
    ["15–11", "Clear: mostly accurate terms, some features linked to context; examples given but sometimes only labelled. About a C."],
    ["10–6", "Some features identified, with few links to context; terms sometimes wrong."],
    ["5–0", "Little relevant analysis."]];
  const SHORT_10 = [["10–9", "Perceptive analysis of several features, each closely linked to meaning and context."], ["8–6", "Clear analysis of two or three features with apt references."], ["5–3", "Relevant points with some analysis; references sometimes only labelled."], ["2–0", "Description or paraphrase."]];

  /* ---------------- Stage 1: A level English Literature ---------------- */
  const S1 = [
    { id: "al1-unseen", n: 1, short: "Unseen prose", title: "Unseen prose: reading closely", paper: "Literature: unseen prose (Paper 2 or 3, by board)",
      blurb: "Read an unseen prose extract the way an examiner hopes: what it is about, how it is built, and why the writer made those choices.",
      items: [
        Q("first reading", "What should your first reading of an unseen extract aim for?", "What happens, how it feels, and what seems to matter most", ["Every technique you can spot", "The writer's biography"], "Methods matter only for what they do; you need the whole extract's meaning and effect first.", "dream-hour"),
        Q("contrast", "In the Chopin extract, what is the main contrast?", "Louise's weighed-down grief and the lively spring world outside the window", ["The town and the countryside", "Louise and her sister"], "“sank, pressed down” sits against trees “all aquiver with the new spring life”.", "dream-hour"),
        Q("imagery", "What do the “patches of blue sky” suggest?", "Hope or release breaking through a heavy mood", ["A storm is coming", "She longs to travel"], "Blue showing through piled cloud is a quiet image of release.", "dream-hour", "There were patches of blue sky showing here and there through the clouds"),
        Q("narrative voice", "How does Austen's first sentence create irony?", "It states as a universal truth what is really the families' wish to marry off their daughters", ["It describes a real law of the time", "It shows the narrator wants to marry"], "The grand “truth universally acknowledged” is undercut: it is the neighbours who want the rich man, as the next paragraph reveals.", "pride", "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."),
        Q("word choice", "What does “rightful property” suggest about the neighbourhood?", "That they treat the young man as a prize to be claimed", ["That he owns a lot of land", "That the law protects him"], "The legal, possessive phrase turns marriage into ownership: comic and critical.", "pride", "he is considered as the rightful property of some one or other of their daughters"),
        Q("structure", "Why does Brontë explain each feature of the red-room with “because”?", "The reasoning builds an atmosphere of cold, silence and secrecy step by step", ["To show Jane is bored", "To give the room's history"], "Each clause adds a cause: “chill, because…; silent, because…; solemn, because…”.", "red-room", "This room was chill, because it seldom had a fire; it was silent, because remote from the nursery and kitchen"),
        Q("argument", "An A level answer on an unseen text should be organised…", "around a line of argument about the extract's meaning, proved feature by feature", ["by technique, in the order you found them", "line by line, from beginning to end"], "Examiners reward a sustained argument (AO1) supported by analysis (AO2), not a list.")
      ],
      written: { t: "dream-hour", marks: 25, q: "Explore how Chopin presents Louise Mallard's state of mind in this extract.",
        look: ["A thesis: the setting reveals a change in Louise before she understands it herself.", "Inside versus outside: “sank, pressed down” against the “new spring life”.", "The “open window” as a threshold for feeling and possibility.", "Sound and scent: rain's “delicious breath”, the song, the sparrows.", "The child simile: grief fading to a reflex.", "Context used with purpose: a nineteenth-century wife's restricted life (AO3)."],
        levels: LIT_25,
        model: "Chopin presents Louise's state of mind indirectly: the setting knows what she is feeling before she does. The opening places her bodily weight against the world outside. She “sank, pressed down by a physical exhaustion”, the passive verbs suggesting grief as something done to her, while beyond the “open window” the trees are “all aquiver with the new spring life”. The window is the hinge of the extract: Chopin turns her chair to face it, and through it come the sounds and scents of a world that is rising, not sinking. Spring, an odd backdrop for news of a death, signals renewal; the “patches of blue sky” breaking through clouds “piled one above the other” offer a quiet image of release. Even her sobbing, compared to “a child who has cried itself to sleep”, is presented as a fading reflex rather than fresh pain. Read in the context of a nineteenth-century marriage, in which a wife's life was defined by her husband's, these images prepare for the story's shock: what grows in Louise is not despair but the possibility of freedom.",
        tip: "Write a one-sentence argument first. About 1 hour for a full answer." } },

    { id: "al1-poetry", n: 2, short: "Poetry", title: "Poetry: form, voice and sound", paper: "Literature: poetry (set and unseen)",
      blurb: "Analyse how poets shape meaning through form, voice, imagery, sound and structure.",
      items: [
        Q("form", "“Remember” is a sonnet. How does Rossetti use the turn (volta)?", "At “Yet”, the speaker turns from asking to be remembered to accepting being forgotten", ["At the last line, where she asks to be forgotten", "There is no turn"], "The octave pleads “Remember me”; the sestet, from “Yet if you should forget me”, releases the listener.", "remember", "Yet if you should forget me for a while"),
        Q("repetition", "What is the effect of repeating “Remember me”?", "It sounds like a pleading insistence that grows more anxious", ["It shows she has a poor memory", "It fills the line"], "The repeated imperative shows how much the speaker needs to be held in mind.", "remember", "Remember me when no more day by day"),
        Q("euphemism", "What does “the silent land” suggest?", "Death, described gently and as a far-off place", ["A quiet holiday destination", "A country where no one speaks her language"], "A soft euphemism keeps death distant and calm.", "remember", "Gone far away into the silent land"),
        Q("final couplet", "How does the final couplet change the poem's mood?", "It chooses the lover's happiness over the speaker's wish to be remembered", ["It insists on being remembered forever", "It blames the lover"], "“Better by far you should forget and smile” is selfless: the plea becomes a gift.", "remember", "Better by far you should forget and smile"),
        Q("imagery", "In Hardy's “Neutral Tones”, what does “the sun was white, as though chidden of God” suggest?", "A drained, punished world, matching a love gone cold", ["A bright, holy morning", "A hot summer's day"], "A white, scolded sun has lost its warmth: the landscape mirrors the relationship.", "neutral-tones", "And the sun was white, as though chidden of God"),
        Q("oxymoron", "What does “the deadest thing / Alive enough to have strength to die” show?", "The smile is lifeless, with only enough life left to fade", ["The speaker is ill", "The smile is joyful"], "The paradox shows a feeling at the very end of its life.", "neutral-tones", "The smile on your mouth was the deadest thing"),
        Q("structure", "Why does Hardy's last stanza return to the pond, sun, tree and leaves?", "The circular structure shows the memory has hardened into a lesson he cannot escape", ["To describe a different day", "To end on a hopeful note"], "The images come back as an emblem of love's deception: the poem is trapped in its memory.", "neutral-tones", "Your face, and the God-curst sun, and a tree,")
      ],
      written: { t: "neutral-tones", marks: 25, q: "Explore how Hardy presents the end of a relationship in “Neutral Tones”.",
        look: ["A thesis about memory and disillusion: the scene becomes an emblem of love's deceit.", "The drained landscape: white sun, “starving sod”, grey leaves (pathetic fallacy).", "The lovers' estrangement: eyes that rove over “tedious riddles”.", "The paradox of the smile, and the “ominous bird” simile.", "Circular structure: the final stanza recalls each image as a lesson.", "Form and sound: regular quatrains, enclosed rhyme, a weary rhythm; Hardy's context of disappointment (AO3)."],
        levels: LIT_25,
        model: "Hardy presents the end of a relationship not as a dramatic break but as a slow draining of colour, which the speaker can never afterwards stop seeing. The landscape is emptied of life: the sun is “white, as though chidden of God”, the sod is “starving”, and the few leaves have fallen and gone “gray”. Pathetic fallacy here is less decoration than diagnosis: the world has the same exhausted, neutral tone as the love. The lovers' estrangement appears in the woman's gaze, eyes that “rove / Over tedious riddles of years ago”, as if he were a puzzle she had long since stopped wanting to solve. The central paradox, the smile as “the deadest thing / Alive enough to have strength to die”, captures the cruelty of an ending that is not yet complete, and the simile of the “ominous bird a-wing” gives that bitterness a threatening flight. Structurally, the final stanza returns to the face, the “God-curst sun”, the tree and the pond: what was once a scene has become an emblem, shaped by “keen lessons that love deceives”. The circular form enacts the speaker's entrapment in memory.",
        tip: "Spend a third of your time on form and structure, not only imagery." } },

    { id: "al1-drama", n: 3, short: "Drama", title: "Drama: dialogue, stagecraft and comedy", paper: "Literature: drama, including Shakespeare",
      blurb: "Analyse drama as performance: dialogue, stage directions, timing, character and the audience's response.",
      items: [
        Q("stage directions", "What do the directions “[Gravely.]” and “[Very seriously.]” add?", "Comedy: Jack treats an absurd fact with complete seriousness", ["They show Jack is sad", "They tell the audience to be quiet"], "The deadpan delivery makes the handbag funnier.", "handbag", "JACK. [Gravely.] In a handbag."),
        Q("repetition", "Why does Lady Bracknell repeat “A handbag?”", "Her outraged disbelief gives the line its comic timing", ["She didn't hear him", "She wants to buy one"], "Echoing a word as a question is a classic comic beat for the actor.", "handbag", "LADY BRACKNELL. A handbag?"),
        Q("hyperbole", "What is Wilde satirising when Lady Bracknell mentions “the French Revolution”?", "The upper class's absurd obsession with respectability and family background", ["Revolutionary politics", "Railway travel"], "Comparing a handbag to the Revolution is hyperbole that mocks her values.", "handbag", "reminds one of the worst excesses of the French Revolution"),
        Q("detail", "Why does Jack add “The Brighton line”?", "His pointless precision makes the scene more absurd", ["To explain where he lives", "To show he travels a lot"], "Lady Bracknell's “The line is immaterial” turns his detail into a punchline.", "handbag", "JACK. Yes. The Brighton line."),
        Q("soliloquy", "In “To-morrow, and to-morrow, and to-morrow”, what does the repetition suggest about Macbeth?", "Time has become meaningless and wearying to him", ["He is planning for the future", "He is excited about tomorrow"], "The plodding repetition drags like “this petty pace from day to day”.", "tomorrow", "To-morrow, and to-morrow, and to-morrow,"),
        Q("performance", "Why should you write about a play as performance?", "Meaning is made on stage: voice, movement, timing and the audience's reaction", ["Because plays have no language", "Because examiners prefer films"], "AO2 includes dramatic methods: how a scene works in the theatre."),
        Q("context", "Which context sharpens the handbag scene most?", "Late-Victorian high society's rules on birth, class and marriage", ["The history of luggage", "Wilde's school reports"], "Lady Bracknell's horror is about class: Wilde mocks the rules she lives by.", "handbag")
      ],
      written: { t: "handbag", marks: 25, q: "Explore how Wilde creates comedy in this extract, and what it reveals about the society he presents.",
        look: ["Deadpan delivery in the stage directions against absurd content.", "Repetition and echo (“A handbag?”) as comic timing.", "Bathos: “an ordinary handbag in fact”, “The Brighton line”.", "Hyperbole: the French Revolution.", "Satire of upper-class values: birth, respectability, marriage as a transaction (AO3).", "An argument: the comedy is a weapon against snobbery."],
        levels: LIT_25,
        model: "Wilde builds the comedy of this extract on a gap between tone and content, and the gap is the satire. Jack delivers his origins “[Gravely.]” and “[Very seriously.]”, piling detail on detail (“a somewhat large, black leather handbag, with handles to it”) until the absurd fact feels almost respectable, then undercutting it with bathos: “an ordinary handbag in fact”. Lady Bracknell's echo, “A handbag?”, is a beat built for performance: the actor's pause and the audience's laughter are written into the line. Her own speech escalates through hyperbole, comparing a handbag to “the worst excesses of the French Revolution”. For a late-Victorian audience the joke cuts both ways: she is ridiculous, but her values (that birth and background decide a person's worth and marriage is a transaction) were their own. The comedy therefore makes snobbery itself look absurd.",
        tip: "Always imagine the scene staged: say what the audience sees and hears." } },

    { id: "al1-context", n: 4, short: "Context", title: "Context: how texts are shaped by when and where they are written and read", paper: "Literature, all papers (AO3)",
      blurb: "Use context as part of your argument: the conditions in which a text was written and has been read.",
      items: [
        Q("using context", "What is the best way to use context in an A level answer?", "Link it to a specific choice in the text and say how it shapes meaning", ["Write a paragraph of history at the start", "List facts about the author's life"], "Context earns marks when it explains a feature of the text, not on its own."),
        Q("Blake's London", "What context sharpens Blake's “charter’d street”?", "Commercial control of London: even streets and the river owned and regulated", ["London's beautiful architecture", "A happy holiday in the city"], "“Charter’d” suggests everything is owned and licensed: a radical protest in the 1790s.", "london", "I wander thro’ each charter’d street,"),
        Q("Blake's London", "What does “mind-forg’d manacles” suggest?", "People are chained by ideas and rules they have accepted", ["Prisoners in a London jail", "Blacksmiths at work"], "The chains are made by minds: oppression that people help to keep.", "london", "The mind-forg’d manacles I hear."),
        Q("reception", "A modern reader might read Austen's opening as a comment on women's economic position. Why?", "Women then had few ways to secure money or status except marriage", ["Because Austen says so directly", "Because the novel is set today"], "Reading the irony against women's limited rights is a contextual reading (AO3).", "pride"),
        Q("Frankenstein", "Which context helps explain Victor's horror at his creation?", "Early-nineteenth-century science and fears about overreaching nature", ["The invention of the telephone", "The First World War"], "Shelley wrote amid experiments with electricity and life: Victor's act is Promethean.", "frankenstein"),
        Q("context of reception", "What is a “context of reception”?", "The time and place in which a text is read, which can change its meaning", ["The place where the author wrote", "The text's publisher"], "Readers bring their own world to a text: a modern audience may read Lady Bracknell differently."),
        Q("bolted on", "Which sentence uses context best?", "Blake's “charter’d” echoes protests about who owned London in the 1790s, so even the river seems controlled.", ["Blake lived in London from 1757 to 1827.", "The 1790s were a time of revolution in France."], "It ties a fact to a word and its effect; the others are bolted on.")
      ],
      written: { t: "london", marks: 25, q: "Explore how Blake presents life in the city, making relevant links to the context in which the poem was written.",
        look: ["A thesis: the city is a system of control that marks everyone in it.", "“charter’d” repeated: ownership and regulation (AO3: commerce, property, rights).", "Repetition of “every” and “marks”: universal suffering.", "“mind-forg’d manacles”: self-imposed chains.", "The Church and Palace: institutions implicated in suffering (1790s radicalism).", "Sound and form: steady quatrains like a march; the speaker as a witness."],
        levels: LIT_25,
        model: "Blake presents the city as a system of control that leaves its marks on everyone it touches. The repeated “charter’d” applies to both the streets and the Thames, as if even nature had been licensed and owned; in the 1790s, when radicals were arguing about rights and property, the word carries a charge of protest. The speaker does not visit but “wander[s]”, a witness who can “mark in every face” the “Marks of weakness, marks of woe”, the pun on mark making the observer part of the record. Repetition of “every” turns individual pain into a universal condition, and the climax of the second stanza, “The mind-forg’d manacles I hear”, moves the chains inside: people are imprisoned by ideas they have accepted. In the third stanza institutions are implicated, the “black’ning Church” and the “Palace walls” stained by the soldier's sigh, suggesting that religion and monarchy profit from the suffering they should relieve.",
        tip: "Every contextual point should lead back to a word or image." } },

    { id: "al1-critics", n: 5, short: "Critical views", title: "Critical views and different interpretations", paper: "Literature, all papers (AO5)",
      blurb: "Weigh different readings of a text, including critical perspectives (feminist, Marxist, psychoanalytic, postcolonial), and argue your own.",
      items: [
        Q("AO5", "What does AO5 reward?", "Exploring different interpretations and using them to build your own argument", ["Quoting as many critics as possible", "Agreeing with the critics"], "Interpretations are tools for your argument, not a list of names."),
        Q("feminist reading", "A feminist reading of “The Dream of an Hour” would focus most on…", "how marriage restricts Louise's freedom and self", ["the weather in the extract", "the story's length"], "A feminist lens looks at gender, power and women's lives.", "dream-hour"),
        Q("Marxist reading", "A Marxist reading of the handbag scene would focus on…", "class, money and how Lady Bracknell judges people by background", ["the handbag's colour", "Jack's feelings for Gwendolen alone"], "Marxist criticism looks at class and economic power.", "handbag"),
        Q("psychoanalytic reading", "Which detail would a psychoanalytic critic notice in the Frankenstein extract?", "Victor's horror at the creature he desired to make: a repressed fear surfacing", ["The rain on the windows as weather", "The time of night"], "Psychoanalytic readings look for hidden desires and fears.", "frankenstein", "Beautiful!—Great God!"),
        Q("tentative", "Which phrasing presents an interpretation best?", "This could be read as… although another reading suggests…", ["This proves that…", "The critic is wrong because…"], "Tentative, weighed language shows you know texts can mean more than one thing."),
        Q("using a critic", "How should you use a critic's quotation?", "Briefly, then test it against the text and say how far you agree", ["At length, as the conclusion", "Instead of your own analysis"], "Critics support and sharpen your argument; they never replace it."),
        Q("reading Rossetti", "Two readers disagree: one finds “Remember” selfless, the other controlling. What would a strong answer do?", "Weigh both against the volta and the couplet, then judge", ["Pick one and ignore the other", "Say both are equally right and stop"], "AO5 is about debate: test each reading against evidence and reach a view.", "remember")
      ],
      written: { t: "frankenstein", marks: 25, q: "“Victor's horror is not at the creature, but at himself.” How far do you agree with this view of the extract?",
        look: ["A clear position on the view (agree, disagree or partly) in the introduction.", "Victor's agency: “my toils”, “I had selected his features”.", "The turn: “Beautiful!—Great God!”: the dash as a breaking point.", "Horror described through the creature's body: yellow skin, watery eyes, black lips.", "Other readings: Romantic overreaching; psychoanalytic (repressed guilt); the creature as victim.", "A judgement in the conclusion, supported by the text."],
        levels: LIT_25,
        model: "The view is persuasive, but only partly: the extract shows Victor horrified by the creature's body and, beneath that, by what his ambition has made. The emphasis on Victor's agency is relentless: “my toils”, “the instruments of life”, features he had “selected”. His exclamation, “Beautiful!—Great God!”, breaks on a dash, the moment his own word turns against him; the creature's beauty was his choice, and its failure is his. Yet the horror is also physical and directed outward, catalogued through yellow skin, “watery eyes” and “straight black lips”: Victor cannot look past the surface he made. A psychoanalytic reading supports the view, seeing the creature as Victor's repressed self returning, while a reading in the context of Romantic science sees a man appalled at having trespassed on nature. On balance, the horror at himself is there, but Victor does not yet admit it: he projects it on to the creature, which is the tragedy the novel goes on to explore.",
        tip: "Agree, disagree or partly agree in your first sentence, then prove it." } },

    { id: "al1-compare", n: 6, short: "Comparing", title: "Comparing texts", paper: "Literature: comparison questions and coursework (AO4)",
      blurb: "Compare two texts through a shared idea: how each writer presents it, and what the comparison reveals.",
      items: [
        Q("structure", "What is the best way to structure a comparison essay?", "By idea, discussing both texts in each paragraph", ["One text, then the other", "By technique, text A then text B"], "Integrated comparison earns AO4; two separate essays don't."),
        Q("connectives", "Which phrase shows a precise comparison?", "Whereas Rossetti softens death into a “silent land”, Hardy hardens love into a “God-curst sun”…", ["Both poems are about love.", "Rossetti's poem is also sad."], "It names a specific difference with evidence from both."),
        Q("shared idea", "What do “Remember” and “Neutral Tones” share?", "Both look back on love through memory, but to opposite ends", ["Both celebrate new love", "Both are set in spring"], "Rossetti releases the lover from memory; Hardy is trapped by it."),
        Q("form", "How do the two poems' forms differ in effect?", "Rossetti's sonnet turns towards release; Hardy's circular quatrains trap the speaker", ["Both are free verse", "Both are ballads"], "Form carries meaning: the volta against the circular return."),
        Q("tone", "Which word best describes Hardy's tone compared with Rossetti's?", "Bitter, where Rossetti is tender", ["Joyful, where Rossetti is angry", "Neutral, where Rossetti is excited"], "Hardy's “grin of bitterness” against Rossetti's “forget and smile”.", "neutral-tones", "And a grin of bitterness swept thereby"),
        Q("judgement", "What should the conclusion of a comparison do?", "Say what the comparison reveals that neither text shows alone", ["Repeat the introduction", "Say which poem you liked more"], "A comparison should produce an insight about both texts."),
        Q("context", "How might context sharpen this comparison?", "Rossetti's religious faith and Hardy's loss of it shape how each sees what comes after love", ["Both poets lived in London", "Both poems were set texts"], "Belief in an afterlife colours Rossetti's calm; Hardy's “God-curst” sun shows his doubt.")
      ],
      written: { texts: ["remember", "neutral-tones"], marks: 25, q: "Compare how Rossetti and Hardy present memory and the loss of love in “Remember” and “Neutral Tones”.",
        look: ["An integrated argument: Rossetti frees the lover from memory; Hardy is imprisoned by it.", "Form: the sonnet's volta against Hardy's circular quatrains.", "Imagery: the gentle “silent land” against the drained, punished landscape.", "Tone: tender selflessness against bitterness.", "Endings: “forget and smile” against “keen lessons that love deceives”.", "Context: Rossetti's faith, Hardy's doubt (AO3); a judgement on what the pairing reveals."],
        levels: LIT_25,
        model: "Both poems look back on love through memory, but they travel in opposite directions: Rossetti's speaker frees her lover from remembering, while Hardy's speaker cannot stop remembering. The forms enact this. Rossetti's sonnet pivots at its volta, “Yet if you should forget me for a while”, turning a repeated imperative, “Remember me”, into a release, so that the couplet can wish that the lover “forget and smile”. Hardy's quatrains, by contrast, circle back: the last stanza gathers up the face, the “God-curst sun”, the tree and the pond, and memory hardens into a lesson. Where Rossetti softens death into “the silent land”, Hardy hardens love's ending into a landscape that has been “chidden of God”. The difference in faith matters: Rossetti's devout calm allows her to imagine a love that outlasts its own memory, while Hardy's bitterness is of a man who no longer trusts that anything is watching over him. Read together, the poems suggest that what we do with memory is a moral choice.",
        tip: "Mention both texts in every paragraph." } },

    { id: "al1-essay", n: 7, short: "The essay", title: "Writing the A level literature essay", paper: "Literature: essays on set texts",
      blurb: "Plan and write an argued essay on a set text: thesis, topic sentences, embedded quotation and a judgement.",
      items: [
        Q("thesis", "What makes a strong thesis?", "A debatable claim that answers the whole question", ["A summary of the plot", "A list of the techniques you'll cover"], "A thesis gives the essay a direction to argue."),
        Q("topic sentence", "Which is the best topic sentence?", "Brontë's red-room is less a room than a record of the family's buried guilt.", ["The red-room is described in this paragraph.", "Brontë uses lots of techniques here."], "It makes a claim that the paragraph will prove."),
        Q("quotation", "How should quotations be used?", "Short, embedded in your sentences, then analysed", ["Long blocks, explained afterwards", "Not at all: paraphrase instead"], "Embedded quotation keeps the focus on analysis."),
        Q("terminology", "When should you use a technical term?", "When it helps explain the effect precisely", ["As often as possible", "Never, it sounds pretentious"], "Terms are tools: name the method, then explain what it does."),
        Q("the question", "The question says “How far…?”. What must the essay do?", "Reach a judgement about the extent, weighing both sides", ["Agree completely", "Describe the text"], "“How far” asks for evaluation."),
        Q("planning", "How long should you plan a 1-hour essay?", "About 5 to 10 minutes", ["No time: start writing", "Half the time"], "A short plan makes a sustained argument possible."),
        Q("conclusion", "What should a conclusion do?", "Answer the question directly and say what your argument shows", ["Introduce a new quotation", "Apologise for missing points"], "A conclusion is your judgement, not a summary.")
      ],
      written: { marks: 25, q: "Choose a novel or play you have studied. “The most powerful scenes are the quietest.” How far do you agree? Write an essay plan and your introduction and first paragraph.",
        look: ["A thesis that takes a position on the view.", "A plan of four or five paragraphs, each a step in the argument.", "A first paragraph with a topic sentence, embedded quotation and analysis.", "Context and interpretations named where they will help.", "A judgement planned for the conclusion."],
        levels: LIT_25,
        model: "Plan. Thesis: quiet scenes are powerful because they show what characters cannot say; but the loudest scenes give the quiet ones their force. 1. A quiet scene that reveals a hidden feeling (close analysis). 2. Silence and setting as meaning. 3. A loud scene that the quiet one answers. 4. Another reading: drama needs conflict to be seen. 5. Judgement.\n\nIntroduction: Quiet scenes are often where a text tells the truth its characters are hiding, but their power depends on the noise around them. In [your text], the quietest moments gain force from what has been shouted before.\n\nParagraph 1: Begin with a topic sentence naming the quiet scene and your claim, embed two short quotations, analyse word choice or staging, and end by linking back to the question.",
        tip: "Use this frame with any set text." } },

    { id: "al1-nea", n: 8, short: "Coursework", title: "Coursework (non-exam assessment): choosing texts and a question", paper: "Literature: non-exam assessment (about 20%)",
      blurb: "Plan the coursework essay: choosing two texts, framing a question, researching critics and context, and drafting.",
      items: [
        Q("question", "Which coursework question is best?", "How do Austen and Chopin present marriage as a limit on women's freedom?", ["Write about two novels.", "Is Pride and Prejudice good?"], "It is focused, comparative and arguable."),
        Q("texts", "What makes a good pair of coursework texts?", "A shared theme with real differences to explore", ["Any two texts by the same author", "Two texts nobody has written about"], "Comparison needs both connection and contrast."),
        Q("length", "Roughly how long is an A level literature coursework essay?", "About 2,500 to 3,000 words", ["About 500 words", "About 10,000 words"], "Boards set limits around this; check yours."),
        Q("referencing", "Why reference critics and sources?", "To show where ideas come from and to avoid plagiarism", ["To make the essay longer", "It isn't needed"], "Coursework must be your own work, with sources acknowledged."),
        Q("drafting", "How much help can a teacher give on a draft?", "General feedback on one draft, not corrections or rewrites", ["They can rewrite weak paragraphs", "None at all"], "Boards allow general advice only; check yours."),
        Q("bibliography", "What goes in the bibliography?", "Every text, critic and source you used", ["Only the two set texts", "Websites you didn't read"], "Full references are part of honest work."),
        Q("argument", "What should the essay's introduction contain?", "Your thesis and how the two texts connect", ["A biography of both authors", "Your reasons for choosing the course"], "Introduce the argument and the comparison.")
      ],
      written: { marks: 25, q: "Write a coursework proposal: your two texts, your question, three lines of argument, two critical or contextual sources you will use, and your plan for a draft.",
        look: ["Two texts with a real connection and real differences.", "A focused, comparative, arguable question.", "Three lines of argument, each covering both texts.", "Sources named: critics, context, or both.", "A realistic timeline: reading, plan, draft, feedback, final."],
        levels: [["Strong", "Focused question, both texts in every line of argument, sources chosen for the argument, a realistic plan."], ["Developing", "A workable question, but lines of argument treat texts separately or sources are general."], ["Not yet", "A topic rather than a question; little sense of comparison."]],
        model: "Texts: Pride and Prejudice (Austen, 1813) and The Awakening (Chopin, 1899). Question: How do Austen and Chopin present marriage as both a limit and an escape for women? Argument: 1. Marriage as economic necessity (Charlotte Lucas; Edna's household). 2. Marriage and the self: wit and independence against conformity. 3. Endings: comedy's resolution against tragedy's refusal. Sources: a feminist critic on Austen's irony; a historical source on women's property rights. Plan: read and annotate by half-term; plan with quotations; draft of 3,000 words; one round of general feedback; final with bibliography.",
        tip: "Check your board's coursework rules and word limit before you choose." } }
  ];

  /* ---------------- Stage 2: A level English Language ---------------- */
  const S2 = [
    { id: "al2-levels", n: 1, short: "Language levels", title: "The language levels: a toolkit for analysis", paper: "Language: textual variations and representations",
      blurb: "Use the language levels (lexis and semantics, grammar, phonology, pragmatics, discourse, graphology) precisely, linking features to meaning and context.",
      items: [
        Q("lexis", "Which level is about vocabulary and word meanings?", "Lexis and semantics", ["Phonology", "Discourse"], "Lexis is word choice; semantics is meaning."),
        Q("pragmatics", "What is pragmatics?", "Meaning from context: what speakers imply beyond the words", ["The sounds of speech", "Word classes"], "Pragmatics covers implicature, politeness and inference."),
        Q("discourse", "What does discourse analysis look at?", "How a whole text is structured and holds together", ["Single sounds", "Spelling"], "Discourse is structure: openings, cohesion, turn-taking."),
        Q("graphology", "In an advert, the brand name in a large bold font is a feature of…", "graphology", ["phonology", "syntax"], "Graphology is the visual design of a written text.", "ae-advert"),
        Q("feature + effect", "Which comment on the café advert is best?", "The second person “you” and imperatives (“Come in”) create a personal, direct relationship with the reader.", ["It uses lots of words.", "The advert has nouns and verbs."], "Name the feature precisely and link it to purpose.", "ae-advert", "Come in from the cold."),
        Q("phonology", "“Proper cakes, proper coffee, proper cosy” uses…", "repetition and alliteration, giving a memorable rhythm", ["onomatopoeia", "a rhetorical question"], "The repeated “proper” and the /k/ sounds make it catchy.", "ae-advert", "Proper cakes, proper coffee, proper cosy."),
        Q("register", "The café advert's register is best described as…", "informal and friendly, with some local colour", ["formal and technical", "legal and precise"], "Contractions, colloquial “proper” and direct address keep it chatty.", "ae-advert")
      ],
      written: { t: "ae-advert", marks: 25, q: "Analyse how language is used in this text to create a relationship with its audience. Use the language levels in your answer.",
        look: ["Context: a local café's web page; audience of local people and passers-by; purpose to attract and reassure.", "Direct address and imperatives: “you”, “Come in”.", "Colloquial lexis and repetition: “proper”, “cosy”.", "Phonology: alliteration and triadic rhythm.", "Pragmatics: implied values (local, welcoming, unpretentious).", "Discourse and graphology: headline, short paragraphs, a closing call to action."],
        levels: LANG_25,
        model: "The text, a small café's web page, builds a personal relationship with local readers by sounding like a friendly owner talking at the door. Direct address dominates: the second-person “you” and imperatives such as “Come in from the cold” position the reader as a guest already halfway inside. Lexically, the colloquial intensifier “proper”, repeated in a triad (“Proper cakes, proper coffee, proper cosy”), carries regional warmth and implies, pragmatically, that the café is honest and unpretentious, unlike chains. The repetition and the alliterating /k/ sounds give the slogan a memorable rhythm. At discourse level, the text moves from an inviting headline through short, reassuring paragraphs to a final call to action, mirroring the steps of a visit. Together these choices construct the café's identity as local and welcoming.",
        tip: "Link every feature to audience, purpose or context: no feature-spotting." } },

    { id: "al2-grammar", n: 2, short: "Grammar", title: "Grammar for analysis: word classes, clauses and modality", paper: "Language: all papers",
      blurb: "Name grammatical features precisely (word classes, clause types, sentence functions, modality, voice) and say what they do.",
      items: [
        Q("sentence function", "“Come in from the cold.” What sentence function is this?", "An imperative (a directive)", ["A declarative", "An interrogative"], "It gives a command or invitation.", "ae-advert", "Come in from the cold."),
        Q("modality", "Which word expresses modality?", "might", ["table", "quickly"], "Modal verbs (might, must, should) show possibility, obligation or certainty."),
        Q("clause", "“Because it was raining, we stayed in.” What kind of clause is “Because it was raining”?", "A subordinate (adverbial) clause", ["A main clause", "A noun phrase"], "It cannot stand alone and depends on the main clause."),
        Q("voice", "“Mistakes were made.” Why might a speaker choose the passive?", "To avoid saying who made them", ["To sound more casual", "To make it a question"], "The passive can hide the agent."),
        Q("pronouns", "In the accents column, the writer shifts from “I” to “we”. What is the effect?", "It turns a personal story into a shared, collective cause", ["It shows the writer is confused", "It makes the text more formal"], "Inclusive “we” recruits the reader.", "ae-accent"),
        Q("noun phrase", "What is “a soft Fife lilt” grammatically?", "A noun phrase with pre-modifiers", ["A verb phrase", "A subordinate clause"], "Determiner + adjectives + noun (head word: lilt).", "ae-accent", "a soft Fife lilt"),
        Q("tense", "Why might a news report use the present tense in its headline?", "To make events feel immediate", ["Because it is set in the future", "To sound old-fashioned"], "Headline present (“Council cuts bus routes”) gives immediacy.")
      ],
      written: { t: "ae-accent", marks: 10, q: "Analyse how the writer uses grammatical features to present her argument in this column.",
        look: ["First-person narrative to collective “we”.", "Declaratives stating views as fact.", "A rhetorical question challenging the reader.", "Short sentences for emphasis.", "Modality (“should”, “will”) for certainty and obligation."],
        levels: SHORT_10,
        model: "The writer moves grammatically from personal anecdote to public argument. Her opening uses the first-person singular and past tense to narrate a job interview, making her case concrete. The shift to the inclusive “we” recruits readers into a shared position. Declaratives present opinions as facts, and a rhetorical question challenges the reader directly. Short sentences land the key points with emphasis, while modal verbs of obligation and certainty make the conclusion sound inevitable.",
        tip: "Name the feature, quote it, say its effect." } },

    { id: "al2-context", n: 3, short: "Mode and context", title: "Mode, audience, purpose and genre", paper: "Language: textual variations",
      blurb: "Explain how mode (spoken, written, electronic), audience, purpose and genre shape language choices.",
      items: [
        Q("mode", "Which feature is typical of spontaneous speech?", "Fillers and pauses, such as “erm” and (.)", ["Paragraphs", "Footnotes"], "Unplanned speech has non-fluency features.", "ae-chat"),
        Q("overlap", "In a transcript, what does // or [ usually mark?", "Overlapping speech", ["A long pause", "A spelling mistake"], "Transcription conventions show overlaps.", "ae-chat"),
        Q("non-fluency", "Why do non-fluency features matter in analysis?", "They show the talk is unplanned and being built in real time", ["They are mistakes to correct", "They show the speaker is unintelligent"], "Analyse them neutrally, as features of spontaneous speech."),
        Q("adjacency pair", "“You coming Saturday?” / “Yeah, defo.” is…", "an adjacency pair: question and answer", ["a monologue", "a phatic tag"], "Paired turns structure conversation.", "ae-chat"),
        Q("back-channelling", "“mm” and “yeah” while someone else talks are…", "back-channelling: showing you're listening", ["interruptions", "tag questions"], "Minimal responses support the speaker.", "ae-chat"),
        Q("blended mode", "A text message conversation is often described as…", "a blended mode: written, but with many features of speech", ["purely written", "purely spoken"], "Electronic texts mix modes."),
        Q("audience", "How does audience shape the café advert?", "Local readers get informal, friendly language and local reference", ["Experts get technical terms", "Children get simple spellings"], "Audience shapes register.", "ae-advert")
      ],
      written: { t: "ae-chat", marks: 25, q: "Analyse how the speakers in this conversation use language to manage their relationship and the interaction.",
        look: ["Context: two friends, informal, spontaneous, planning a weekend.", "Turn-taking: adjacency pairs, overlaps, who leads.", "Non-fluency: fillers, pauses, false starts, read as normal.", "Pragmatics: teasing, politeness, face (“no pressure”).", "Lexis: informal and clipped (“defo”), shared reference.", "Back-channelling and supportive overlap: a cooperative conversation."],
        levels: LANG_25,
        model: "The conversation between two friends is cooperative: both speakers work to keep the plan, and the friendship, comfortable. Turn-taking moves through quick adjacency pairs (“You coming Saturday?” “Yeah, defo”), and overlaps are supportive rather than competitive. Non-fluency features such as fillers and micro-pauses are typical of spontaneous talk, but they also do pragmatic work: hesitation softens a refusal so it does not threaten the other speaker's face. Clipped informal lexis signals closeness, and teasing is mitigated by laughter. Back-channelling keeps the floor open. The language shows how friends negotiate a plan while protecting each other's feelings.",
        tip: "Treat speech as speech: don't criticise it for not being writing." } },

    { id: "al2-change", n: 4, short: "Language change", title: "Language change", paper: "Language: language change over time",
      blurb: "Explain how and why English has changed in vocabulary, meaning, grammar, spelling and style, using older texts.",
      items: [
        Q("semantic change", "When a word's meaning becomes more negative over time, this is…", "pejoration", ["amelioration", "broadening"], "“Silly” once meant blessed; it has pejorated."),
        Q("amelioration", "When a word's meaning becomes more positive, this is…", "amelioration", ["pejoration", "narrowing"], "“Nice” once meant foolish; it ameliorated."),
        Q("archaism", "In the Jerome extract, which word now sounds old-fashioned?", "distemper (for an illness)", ["museum", "advertisement"], "“Distemper” for a disease in people is now archaic.", "jerome", "I forget which was the first distemper I plunged into"),
        Q("style", "What is noticeable about Austen's first sentence compared with modern prose?", "Its long, balanced, formal syntax", ["Its use of slang", "Its text-speak abbreviations"], "Nineteenth-century literary prose favoured long periodic sentences.", "pride"),
        Q("causes", "Which is a cause of new words entering English?", "Technology, such as “selfie” or “emoji”", ["Fewer people writing", "Grammar books"], "New things need new words."),
        Q("attitudes", "A prescriptivist view of language change is that…", "change is decline and should be resisted", ["change is natural and neutral", "only spelling changes"], "Prescriptivists set rules; descriptivists describe use."),
        Q("compounding", "“Hay fever” and “patent medicine” are formed by…", "compounding: joining words", ["borrowing", "clipping"], "Compounding combines existing words.", "jerome", "hay fever")
      ],
      written: { t: "jerome", marks: 25, q: "Analyse how this extract shows features of nineteenth-century English, and compare them with English today.",
        look: ["Lexis: archaic or formal choices (“distemper”, “impelled”, “indolently”, “premonitory”).", "Syntax: long, multi-clause sentences with commas and dashes.", "Punctuation: the dash and the semicolon used more heavily.", "Register: comic formality, mock-medical vocabulary.", "Comparison: modern equivalents and reasons for change (informalisation).", "Context: print culture, patent medicine adverts."],
        levels: LANG_25,
        model: "The extract shows the comic formality of late-Victorian prose. Its lexis includes words now rare or archaic: “distemper” for an illness, “impelled”, “indolently”, the Latinate “premonitory symptoms”. Syntax is long and cumulative, with clause piled on clause and linked by commas and dashes; a modern writer would likely break these into shorter sentences, reflecting a wider trend towards informalisation. Yet the humour is recognisable: a hypochondriac reading symptoms is as familiar today, though the patent-medicine advert has become a search engine. The text shows both how English has changed and how comic voice has survived.",
        tip: "For every older feature, say what we would write now, and why it changed." } },

    { id: "al2-cla", n: 5, short: "Child language", title: "Child language acquisition", paper: "Language: children's language development",
      blurb: "Analyse young children's talk using stages, features (overgeneralisation, telegraphic speech) and theories (Skinner, Chomsky, Piaget, Bruner, Vygotsky).",
      items: [
        Q("telegraphic", "“Daddy gone work” is an example of…", "telegraphic speech", ["the holophrastic stage", "babbling"], "Content words with function words left out, typical at about 2 to 3."),
        Q("overgeneralisation", "“I goed to the park” shows…", "overgeneralisation of the past-tense -ed rule", ["copying adult speech exactly", "a speech disorder"], "The child applies a rule to an irregular verb: evidence of rule-learning.", "ae-kitchen"),
        Q("Chomsky", "Which theory says children have an innate capacity for grammar (a language acquisition device)?", "Chomsky's nativist theory", ["Skinner's behaviourism", "Bruner's LASS"], "Nativism stresses inborn ability."),
        Q("Bruner", "Bruner's “LASS” is about…", "the support adults give children's language (scaffolding)", ["a child's first word", "reading at school"], "The Language Acquisition Support System: interaction matters."),
        Q("CDS", "When the parent repeats “You went to the park?”, this is…", "an expansion or recast, typical of child-directed speech", ["a correction", "a tag question"], "Recasting models the correct form without correcting.", "ae-kitchen"),
        Q("virtuous error", "Why are errors like “mouses” called virtuous errors?", "They show the child has learned a real rule", ["They are polite", "They are rare"], "The plural rule is applied logically to an irregular noun."),
        Q("stage", "A child of about 18 months saying “juice!” to mean “I want juice” is at the…", "holophrastic stage", ["post-telegraphic stage", "cooing stage"], "One word carries a whole sentence's meaning.")
      ],
      written: { t: "ae-kitchen", marks: 25, q: "Analyse how the child and the parent use language in this conversation, referring to ideas about how children acquire language.",
        look: ["The child's stage: telegraphic and early multi-word utterances.", "Overgeneralisation (“goed”, “sheeps”) as rule-learning (nativist evidence).", "The parent's child-directed speech: recasts, questions, praise.", "Scaffolding (Bruner, Vygotsky): the parent extends the topic.", "Pragmatics: the child initiates topics and requests.", "Balanced use of theory: what the data supports and what it doesn't."],
        levels: LANG_25,
        model: "Maisie, at about 2 and a half, is in the telegraphic to early multi-word stage, combining content words while omitting some function words. Her “goed” and “sheeps” are virtuous errors: she has learned the past-tense and plural rules and applied them to irregular forms, which supports Chomsky's view that children actively construct grammar rather than simply imitating it, since no adult says “goed”. Her parent's child-directed speech provides the interaction Bruner and Vygotsky stress: recasts model the correct forms without correcting, open questions extend the topic, and praise keeps Maisie talking. Maisie also initiates topics and makes requests, showing pragmatic skill. The transcript suggests both innate rule-making and supportive interaction matter.",
        tip: "Use theories to explain the data; don't list them." } },

    { id: "al2-diversity", n: 6, short: "Diversity and identity", title: "Language diversity: accent, dialect, gender and identity", paper: "Language: language diversity",
      blurb: "Explore how language varies with region, social group, gender, age and ethnicity, and how speakers use it to express identity.",
      items: [
        Q("accent / dialect", "What is the difference between accent and dialect?", "Accent is pronunciation; dialect includes vocabulary and grammar", ["They mean the same", "Accent is written; dialect is spoken"], "A Scots speaker saying “wee” is using dialect lexis."),
        Q("RP", "What is Received Pronunciation?", "A prestige accent with no regional base, linked to class", ["The accent of London", "The way the BBC must speak"], "RP is a social, not regional, accent."),
        Q("covert prestige", "Why might a teenager keep a strong local accent at school?", "Covert prestige: it signals belonging and identity", ["They can't hear the difference", "It is easier to spell"], "Non-standard forms can carry local status."),
        Q("code-switching", "Changing between varieties depending on context is called…", "code-switching", ["convergence", "hedging"], "Speakers shift style for audience and setting."),
        Q("accommodation", "Moving your speech towards your listener's is…", "convergence (accommodation theory)", ["divergence", "pejoration"], "Giles's accommodation theory: convergence builds rapport."),
        Q("attitudes", "In the column, what attitude did the interviewer show?", "Linguistic prejudice: judging ability by accent", ["Support for regional accents", "Indifference"], "The advice to “soften” the accent judges the speaker, not her work.", "ae-accent"),
        Q("gender", "Which researcher argued that men's and women's talk shows different goals (status versus connection)?", "Deborah Tannen", ["Noam Chomsky", "B. F. Skinner"], "Tannen's difference model; Lakoff and Zimmerman and West offer other views.")
      ],
      written: { t: "ae-accent", marks: 25, q: "Evaluate the idea that people should change their accent to succeed. Refer to the column and to ideas about language and identity.",
        look: ["Represents the column's argument fairly.", "Accent and identity: belonging, covert prestige.", "Prestige and prejudice: RP, accent bias in work.", "Accommodation and code-switching as everyday flexibility.", "Descriptivist versus prescriptivist views.", "A judgement that weighs fairness and practicality."],
        levels: LANG_25,
        model: "The column argues that being told to “soften” a Fife accent was advice to erase part of herself. Research on accent bias suggests her experience is common: regional and working-class accents are often judged less competent, while RP carries overt prestige despite having no link to ability. Yet speakers already adapt: accommodation theory shows we converge towards listeners, and code-switching is a skill, not a betrayal. The real question is who is expected to change. A descriptivist view suggests the problem lies with listeners' prejudice. On balance, the column is persuasive: flexibility is useful, but no one should have to abandon an accent to be taken seriously.",
        tip: "Use the column as data and as an argument to evaluate." } },

    { id: "al2-discourses", n: 7, short: "Writing about language", title: "Writing about language: opinion articles and debates", paper: "Language: language discourses (directed writing)",
      blurb: "Write an informed opinion piece on a language debate, using linguistic research accessibly for a general audience.",
      items: [
        Q("audience", "Who is the audience for a language opinion article?", "General readers who don't know linguistic terms", ["Linguistics professors", "Exam markers only"], "Explain ideas accessibly."),
        Q("evidence", "How should you use research in the article?", "Explain one or two findings in plain words, with who found them", ["List many names", "Avoid all research"], "Accessible, accurate evidence persuades."),
        Q("form", "Which opening suits a newspaper opinion piece?", "A vivid anecdote or provocative claim", ["A dictionary definition", "A bibliography"], "Hook the general reader."),
        Q("stance", "What stance should the piece take?", "A clear, argued view that also answers the other side", ["No view at all", "Insults towards opponents"], "Persuasive but fair."),
        Q("misconception", "“Text speak is ruining children's spelling.” What does research suggest?", "Little evidence: texting can go with good literacy", ["It is certainly true", "Children no longer spell"], "Studies (e.g. Crystal, Plester) found no clear harm."),
        Q("terms", "Should you use “descriptivist” in a general article?", "Only if you explain it briefly", ["Yes, readers will know it", "Never mention ideas"], "Gloss technical words."),
        Q("ending", "A strong ending for an opinion piece…", "returns to the opening and leaves a clear message", ["introduces a new topic", "lists your sources"], "Circular structure rounds off the argument.")
      ],
      written: { marks: 25, q: "Write an opinion article for a national newspaper responding to the claim “Young people's slang is destroying English.” Use your knowledge of language change and variation.",
        look: ["An engaging opening for a general audience.", "Accurate ideas explained accessibly: language change is normal, slang is creative.", "Evidence: historical examples of panic about change; research on youth language.", "Counter-argument acknowledged: register and context matter.", "A clear, witty, persuasive voice.", "An ending that returns to the opening."],
        levels: [["Strong", "Confident voice, accurate and accessible ideas, well chosen evidence, a fair counter-argument."], ["Developing", "Clear view with some accurate ideas, but evidence thin or explained too technically."], ["Not yet", "Opinion with little linguistic knowledge."]],
        model: "Every generation discovers that the next one is ruining English. In 1712, Jonathan Swift wanted an academy to stop the language changing. It changed anyway, and gave us the words he hated. Today's target is slang: “peak”, “bare”, “lowkey”. But slang is one of the most creative parts of any language. Young people coin words to mark their group, and many settle into the mainstream. Linguists call this natural change, not decline. The fair worry is register: knowing when slang fits. Most teenagers switch styles as easily as they switch apps. English isn't being destroyed. It's being used.",
        tip: "Write for an intelligent reader who isn't a linguist." } },

    { id: "al2-original", n: 8, short: "Coursework", title: "Coursework: investigation, original writing and commentary", paper: "Language: non-exam assessment (about 20%)",
      blurb: "Plan the coursework: a language investigation with your own data, and a piece of original writing with a commentary.",
      items: [
        Q("investigation", "Which is the best investigation question?", "How do two football commentators use language differently on radio and TV?", ["Is football language good?", "Everything about sport"], "Focused, comparative, and data can answer it."),
        Q("data", "What data does an investigation need?", "Real language you collect or find, enough to analyse closely", ["Only textbook examples", "Your memories"], "The investigation is an analysis of real data."),
        Q("ethics", "Recording friends for data needs…", "their consent, and names changed in the transcript", ["nothing", "a teacher's signature only"], "Ethics: consent and anonymity."),
        Q("methodology", "Why describe your methodology?", "So a reader can see how the data was collected and judge it", ["To fill space", "It is optional"], "Method makes the findings reliable."),
        Q("original writing", "What should the commentary on original writing explain?", "The language choices you made, linked to a style model, audience and purpose", ["A summary of the story", "How long it took"], "The commentary analyses your own writing."),
        Q("style model", "Why choose a style model?", "To show the genre's conventions you adapted", ["To copy it", "It isn't needed"], "Commentary compares your choices with the model."),
        Q("conclusion", "What should the investigation's conclusion do?", "Answer the question and note the limits of the data", ["Prove the hypothesis no matter what", "Introduce new data"], "Honest about limits.")
      ],
      written: { marks: 25, q: "Write a proposal for a language investigation: your question, data, method, three features to analyse and how you will handle ethics.",
        look: ["A focused, answerable question.", "A realistic data set: what, how much, from where.", "A clear method (recording, transcription, sampling).", "Three features across language levels.", "Ethics: consent and anonymity.", "Expected limits."],
        levels: [["Strong", "Focused question, real data, clear method, apt features, ethics handled."], ["Developing", "Workable but data or method vague."], ["Not yet", "A topic, not a question, with no data plan."]],
        model: "Question: How do a parent and a 3-year-old repair misunderstandings in conversation? Data: three 10-minute recordings at home over two weeks, transcribed with standard conventions. Method: transcribe, then code every repair (who starts it, how). Features: repair strategies (clarification requests, recasts); question types; turn-taking. Ethics: written consent from the parent, names changed, recordings deleted after transcription. Limits: one family, a small sample, and the recorder may change how they talk.",
        tip: "Check your board's word limits and choices before you start." } }
  ];

  /* ---------------- Coursework writing tasks (one each), checked against a list ---------------- */
  const WRITING = [
    { id: "al1-critical", stage: "al1", kind: "Critical essay", paper: "Literature: exam essay", minutes: 60, marks: 25, grade: "A level, grade A/B",
      q: "“Literature is most powerful when it makes us uncomfortable.” Discuss with reference to one text you have studied.",
      plan: ["Decide your position: agree, partly, or disagree.", "Choose three moments in the text that test the view.", "Plan one paragraph each, with a topic sentence and two quotations.", "Add context and one other reading.", "Plan a conclusion that answers the question."],
      model: "Discomfort is often where a text does its real work, but it is not the only source of power. In Frankenstein, Victor's revulsion at his creature makes the reader uneasy precisely because we are asked to share it, and then to judge it. When he cries “Beautiful!—Great God!”, Shelley forces us to watch a creator turn on what he made... (Develop three paragraphs, then judge: power comes from discomfort that leads to understanding.)",
      notes: ["A clear position in the first sentence.", "Each paragraph tests the view against a moment in the text.", "Short, embedded quotations analysed closely.", "Context and another reading used with purpose.", "A conclusion that judges, not summarises."] },
    { id: "al2-commentary", stage: "al2", kind: "Original writing with commentary", paper: "Language: coursework", minutes: 90, marks: 25, grade: "A level, grade A/B",
      q: "Write a 500-word opinion piece for a local news website on a language issue in your area, then a 300-word commentary on your language choices.",
      plan: ["Choose an issue: accents at work, signs in Scots or Welsh, school slang rules.", "Find a style model: a real local opinion piece.", "Plan the piece: hook, argument, counter-argument, ending.", "Write, then note five deliberate choices.", "Write the commentary: choice, effect, link to audience and the style model."],
      model: "Piece (opening): “Our street signs speak two languages. Some people think that's one too many.”\n\nCommentary (extract): I opened with a short declarative and a rhetorical tension, as my style model does, to hook a reader scrolling a local news site. The inclusive “our” positions readers as part of the community...",
      notes: ["The piece fits its genre, audience and purpose.", "Choices are deliberate and varied.", "The commentary names features precisely, with examples.", "Each choice links to audience, purpose or the style model.", "Accurate and well organised throughout."] }
  ];
  const CHECK = {
    al1: { goal: "A level Literature, grade A or B", content: ["My essay answers the question from the first sentence.", "Every paragraph is a step in the argument.", "I analysed methods (language, form, structure) closely.", "Context and other readings support my argument.", "My conclusion judges."],
      accuracy: ["Quotations are short and embedded.", "Critical terms are used precisely.", "Writing is clear, formal and accurate.", "I proofread."] },
    al2: { goal: "A level Language, grade A or B", content: ["My writing fits its genre, audience and purpose.", "My choices are deliberate.", "The commentary names features precisely.", "Each choice is linked to context or the style model."],
      accuracy: ["Terms are accurate.", "Examples are quoted exactly.", "Writing is clear and accurate.", "I proofread."] }
  };
  const GRADES = [
    ["Grade C", "Clear, relevant analysis with a straightforward argument; terms mostly accurate; context mentioned and sometimes linked."],
    ["Grade B", "Detailed analysis with a clear argument; context and other readings used with purpose."],
    ["Grade A / A*", "Perceptive, sustained argument; precise terms; close analysis of how meaning is made; context, connections and interpretations woven into the argument."]];
  const EXAM = {
    papers: [
      { name: "A level English Literature", time: "Two or three exam papers (about 2 to 3 hours each) and coursework, by board", marks: "About 80% exam, 20% coursework", text: "Poetry, prose and drama (including Shakespeare and pre-1900 texts), often an unseen text, and a comparative coursework essay.",
        qs: [["Some", "Close analysis of an extract", "25 or so", "about an hour"], ["Most", "Essays on set texts", "25 or so", "about an hour each"], ["1", "Coursework: a comparative essay", "about 20%", "over several weeks"]] },
      { name: "A level English Language", time: "Two exam papers (about 2 to 2½ hours each) and coursework, by board", marks: "About 80% exam, 20% coursework", text: "Textual analysis, language change, child language acquisition, language diversity, and an investigation and original writing.",
        qs: [["Some", "Analysing texts and transcripts", "25 or so", "about an hour"], ["Some", "Essays on language topics", "25 or so", "about 45 minutes"], ["1", "Writing about a language debate", "20 or so", "about 45 minutes"]] }],
    reading: "Read the question twice, then the text. Plan for 5 to 10 minutes. Write an argued answer, not a list.",
    writing: "Coursework is about 20% of each A level: Literature is a comparative essay (about 2,500 to 3,000 words); Language is an investigation and a piece of original writing with a commentary.",
    boards: "A level English is set by AQA, Edexcel, OCR and Eduqas; each has its own set texts and papers. Check your board's specification.",
    spoken: "There is no spoken assessment at A level."
  };
  const MINI = [
    { id: "al1-paper-1", title: "Mini paper: unseen poetry (A level Literature)", minutes: 60, t: "remember",
      parts: [{ q: "How does Rossetti use the sonnet form in “Remember”? Refer to the turn (volta) and the final couplet.", marks: 10, minutes: 15,
        look: ["The octave's pleading imperative “Remember me”.", "The volta at “Yet”: from asking to releasing.", "The couplet's resolution: “forget and smile”.", "Form linked to meaning, not just named."], levels: SHORT_10 },
        { q: "Explore how Rossetti presents love and memory in “Remember”.", t: "remember", marks: 25, minutes: 45,
        look: ["A thesis about the poem's turn from pleading to release.", "The sonnet form and volta.", "Repetition of “Remember me”.", "The euphemism of “the silent land”.", "The couplet's selflessness; context of Rossetti's faith."], levels: LIT_25 }] },
    { id: "al1-paper-2", title: "Mini paper: comparison (A level Literature)", minutes: 75, texts: ["remember", "neutral-tones"],
      parts: [{ ref: "al1-compare", minutes: 75 }] },
    { id: "al2-paper-1", title: "Mini paper: textual analysis (A level Language)", minutes: 60, t: "ae-chat",
      parts: [{ q: "Identify three features of spontaneous speech in this conversation and explain what each shows about the interaction.", marks: 10, minutes: 15,
        look: ["Fillers and micro-pauses, such as “erm” and (.): planning in real time, softening.", "Overlaps (//): supportive, showing eagerness, not rudeness.", "Back-channelling (“mm”) and laughter: keeping the talk friendly.", "Each feature linked to the relationship, not just labelled."], levels: SHORT_10 },
        { ref: "al2-context", minutes: 45 }] },
    { id: "al2-paper-2", title: "Mini paper: child language (A level Language)", minutes: 60, t: "ae-kitchen",
      parts: [{ ref: "al2-cla", minutes: 60 }] }
  ];

  const STAGES = [
    { key: "al1", n: 1, grades: "A level Literature", target: "A level", goal: "A level English Literature", title: "Stage 1: A level English Literature", topics: S1,
      about: "Unseen prose, poetry, drama, context, critical views, comparison, the essay and coursework." },
    { key: "al2", n: 2, grades: "A level Language", target: "A level", goal: "A level English Language", title: "Stage 2: A level English Language", topics: S2,
      about: "The language levels, grammar, mode and context, language change, child language, diversity and identity, writing about language, and coursework." }
  ];

  return { key: "alevel", name: "A level English climb", level: "Senior", exam: "A level English Literature and English Language", STAGES, LIT: null, WRITING, CHECK, GRADES, EXAM, MINI,
    LIT_25, LANG_25, SHORT_10,
    startLabels: ["A level English Literature", "A level English Language"],
    writingWhy: "Coursework is about 20% of each A level, and exam essays are planned and written under time.",
    checkLabels: ["Content and argument", "Expression and accuracy"],
    other: ["Doing GCSEs? The GCSE English climb →", "english-climb.html"] };
})();
