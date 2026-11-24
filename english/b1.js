/* Adult English · B1 (Intermediate). See english-lessons.js for the format. */
(window.PopEnglishLessons = window.PopEnglishLessons || []).push(
  {
    id: "b1-text-or-call",
    level: "B1",
    title: "Text or call?",
    topic: "Communication and phones",
    focus: "would rather and prefer",
    minutes: 60,
    aims: [
      "talk about how you keep in touch with people",
      "understand common texting abbreviations",
      "read about texting habits and tone",
      "use would rather and prefer to give preferences",
      "write and answer short text messages"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: my phone", minutes: 6,
        intro: "Discuss the questions.",
        questions: [
          "Look at a text you sent recently. Who was it to, and what was it about?",
          "How much time do you spend texting every day?",
          "Do you prefer texting, calling or sending voice messages? Why?"
        ],
        follow: ["Are there any texting rules you follow?", "Do you ever turn your phone off?", "Is it rude to text during a meal?"],
        note: "Let the learner talk. Note phrases for preferences (I like… more, I'd rather…) to use in step 4."
      },
      {
        type: "match", title: "Texting abbreviations", minutes: 8,
        intro: "Match each abbreviation (A–F) with its meaning (1–6).",
        pairs: [
          ["atm", "at the moment"],
          ["btw", "by the way"],
          ["tbh", "to be honest"],
          ["imo", "in my opinion"],
          ["lmk", "let me know"],
          ["nvm", "never mind"]
        ],
        challenge: "Which of these do you use in your own language? Are there others?",
        note: "Abbreviations are informal: fine with friends, not in a work email. Ask which ones the learner would use with a manager."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Sure. Sure! Sure…",
        intro: "Read the article and answer the questions.",
        text: [
          "When we talk face to face, people can see our smile and hear our voice. In a text message, they can't, so small things like punctuation can change the meaning.",
          "Imagine you ask a friend, \"Can you come at seven?\" If they answer \"Sure!\", they sound happy. If they answer \"Sure.\" with a full stop, some people think they sound a bit annoyed. And \"Sure…\" can sound as if they are not really sure at all!",
          "Younger people often use emojis to show how they feel. Many older people prefer to write full sentences, and they would rather call than send ten short messages. Experts say there is no right or wrong way, but if a message could upset someone, it's better to pick up the phone."
        ],
        items: [
          ["In a text, people can hear our voice.", false, "They can't see our smile or hear our voice."],
          ["\"Sure!\" sounds happy.", true, "If they answer \"Sure!\", they sound happy."],
          ["Experts say there is one right way to text.", false, "There is no right or wrong way."],
          { q: "Why can punctuation change the meaning of a text?", a: "Because people can't see our face or hear our voice." },
          { q: "What do many older people prefer?", a: "Writing full sentences, and calling instead of sending lots of short messages." },
          { q: "What should you do if a message could upset someone?", a: "Pick up the phone (call them)." }
        ],
        challenge: "Find two phrases in the text that show a preference.",
        note: "Challenge: prefer to write, would rather call. Ask: do you agree that a full stop sounds annoyed?"
      },
      {
        type: "grammar", title: "would rather and prefer", minutes: 12,
        rule: ["We use prefer and would rather to talk about what we like more.", "prefer + noun or -ing (to compare: prefer X to Y). would rather + base verb (to compare: would rather X than Y)."],
        head: ["", "Form", "Example"],
        table: [
          ["general preference", "prefer + -ing / noun … to …", "I prefer texting to calling."],
          ["now / in this case", "would ('d) rather + verb … than …", "I'd rather call than text tonight."],
          ["negative", "would rather not + verb", "I'd rather not talk about it."],
          ["question", "Would you rather…?", "Would you rather text or call?"]
        ],
        intro: "Fill in the gaps.",
        items: [
          { text: "I {} texting to calling.", answers: [["prefer"]] },
          { text: "I'd rather {} you than send a long message.", hint: "call", answers: [["call"]] },
          { text: "She prefers tea {} coffee.", answers: [["to"]] },
          { text: "{} you rather meet on Friday or Saturday?", answers: [["would"]] },
          { text: "We'd rather {} out tonight. We're tired.", hint: "not / go", answers: [["not go"]] },
          { text: "He prefers {} voice messages.", hint: "send", answers: [["sending", "to send"]] }
        ],
        challenge: "Write three sentences about your own preferences with prefer and three with would rather.",
        note: "Common errors: I'd rather to call, I prefer call than text. Contrast the patterns: prefer A to B, would rather A than B."
      },
      {
        type: "fix", title: "Correct the mistakes", minutes: 6,
        intro: "Each sentence has one mistake. Write it correctly.",
        items: [
          ["I'd rather to text you later.", ["I'd rather text you later.", "I would rather text you later."]],
          ["She prefers calling than texting.", ["She prefers calling to texting."]],
          ["Would you rather to stay in?", ["Would you rather stay in?"]],
          ["I prefer to send a message to call.", ["I prefer sending a message to calling.", "I'd rather send a message than call.", "I would rather send a message than call."]],
          ["We'd rather not to go by car.", ["We'd rather not go by car.", "We would rather not go by car."]]
        ],
        note: "Sentence 4 has two good corrections; both are accepted."
      },
      {
        type: "roleplay", title: "Speaking: text chat", minutes: 10,
        intro: "Write a short text message for each situation. Your partner replies. Use an abbreviation where it fits. Then swap.",
        cards: [
          { who: "Write first", task: "Choose a situation and write the first message.", phrases: ["Ask about dinner plans for tonight.", "Say you got their call but you're busy at the shops.", "Ask what they thought of a new film.", "Check if they're coming to your party."] },
          { who: "Reply", task: "Reply to each message. Say what you'd rather do.", phrases: ["Sorry, can't talk atm…", "Tbh I'd rather…", "Lmk when you're free.", "Sounds great! / Nvm, maybe next time."] }
        ],
        game: { title: "Cool-down: would you rather…?", how: "Take turns asking questions: Would you rather live without your phone or without your car? Give a reason for every answer." },
        note: "Online, type the messages in the chat box. Read each reply aloud and talk about the tone."
      },
      {
        type: "write", title: "Homework: my rules", minutes: 8,
        task: "Write your own five texting rules, with a reason for each. Use prefer and would rather.",
        prompts: ["when to call", "full stops and emojis", "late at night", "at work", "in a group chat"],
        start: "1. I'd rather call than text when…",
        model: "1. I'd rather call than text when the news is important, because a call feels more personal. 2. I prefer short messages to long ones. 3. I'd rather not text after ten at night. 4. At work, I prefer full sentences and no abbreviations. 5. In a group chat, I always reply with an emoji so people know I've read it.",
        lines: 6,
        count: "rather",
        note: "Correct the would rather / prefer patterns. Discuss the rules next lesson."
      }
    ],
    errors: ["I'd rather to call. (no to after would rather)", "I prefer calling than texting. (prefer … to …)", "Would you prefer call? (prefer to call / calling)"],
    stretch: ["Would you rather lose your phone or your wallet? Why?", "How has texting changed the way people write?", "Is it ever OK to end a relationship by text?"]
  },
  {
    id: "b1-problems-and-solutions",
    level: "B1",
    title: "Problems and solutions",
    topic: "Everyday problems",
    focus: "present perfect with just, already and yet",
    minutes: 60,
    aims: [
      "talk about problems and how you deal with them",
      "use common expressions with problem and trouble",
      "read about a very bad morning",
      "use the present perfect with just, already and yet",
      "ask for help and suggest solutions"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: problems", minutes: 6,
        intro: "Discuss the questions.",
        questions: [
          "When you hear the word problem, what is the first thing you think of?",
          "What was the last problem you had? How did you deal with it?",
          "Do you ask for help quickly, or try to fix things yourself?"
        ],
        follow: ["What's a common problem with technology?", "Who do you call when something breaks?", "Are you calm in a crisis?"],
        note: "Keep it everyday: a lost key, a late train, a broken phone. Collect the problems the learner mentions for the role-play."
      },
      {
        type: "match", title: "Problem expressions", minutes: 8,
        intro: "Match the expressions (A–F) with their meanings (1–6).",
        pairs: [
          ["have trouble with", "find something difficult"],
          ["deal with a problem", "take action to fix it"],
          ["sort something out", "organise or fix it (informal)"],
          ["cause a problem", "make a problem happen"],
          ["run out of", "have none left"],
          ["get worse", "become more serious"]
        ],
        challenge: "Use three of the expressions in sentences about your week.",
        note: "Point out sort out and run out of are phrasal verbs. Sort it out (not sort out it)."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "The worst morning ever",
        intro: "Read Ben's email to his manager and answer the questions.",
        text: [
          "Hi Claire, I'm really sorry, but I'm going to be late today. It has been a terrible morning! First my alarm didn't go off, so I woke up at eight. Then I found that we had run out of coffee.",
          "I've just gone out to the car, but it won't start. I've already called a mechanic and he's coming at ten. I haven't had breakfast yet, and now it has started to rain!",
          "I've sent you the report for the meeting, so you can start without me. I'll take the bus and I should be in the office by eleven. Sorry again! Ben"
        ],
        items: [
          ["Ben's alarm didn't go off.", true, "My alarm didn't go off."],
          ["Ben has had breakfast.", false, "He hasn't had breakfast yet."],
          ["The mechanic is coming at ten.", true, "He's coming at ten."],
          { q: "What did Ben run out of?", a: "Coffee." },
          { q: "What has he already done to help the meeting?", a: "He has sent the report." },
          { q: "How is he going to get to work?", a: "By bus." }
        ],
        challenge: "Find four examples of the present perfect in the email.",
        note: "Examples: It has been, I've just gone out, I've already called, I haven't had… yet, it has started, I've sent."
      },
      {
        type: "grammar", title: "Present perfect: just, already, yet", minutes: 12,
        rule: ["We use the present perfect (have / has + past participle) for recent actions that matter now.", "just = a very short time ago. already = sooner than expected. yet = in questions and negatives, at the end."],
        head: ["", "Example", "Where it goes"],
        table: [
          ["just", "I've just left the house.", "between have and the verb"],
          ["already", "She's already called the mechanic.", "between have and the verb"],
          ["yet (−)", "I haven't had breakfast yet.", "at the end"],
          ["yet (?)", "Has the bus come yet?", "at the end"]
        ],
        intro: "Write the present perfect of the verb, with the word given.",
        items: [
          { text: "I {} my keys! Can you help me look?", hint: "just / lose", answers: [["have just lost", "'ve just lost"]] },
          { text: "{} you {} the plumber yet?", hint: "call", answers: [["have"], ["called"]] },
          { text: "Don't worry, I {} the problem.", hint: "already / sort out", answers: [["have already sorted out", "'ve already sorted out"]] },
          { text: "The heating {} yet. It's still cold.", hint: "not / come on", answers: [["hasn't come on", "has not come on"]] },
          { text: "She {} her phone. The screen is broken.", hint: "just / drop", answers: [["has just dropped", "'s just dropped"]] },
          { text: "We {} of milk again!", hint: "run out", answers: [["have run out", "'ve run out"]] }
        ],
        challenge: "Write three things you have already done today and two you haven't done yet.",
        note: "Contrast with the past simple: I lost my keys yesterday (finished time) / I've lost my keys (and I still can't find them)."
      },
      {
        type: "choose", title: "Choose the answer", minutes: 6,
        intro: "Choose the right word.",
        items: [
          ["Have you finished the report ___?", ["already", "just", "yet"], 2],
          ["I've ___ arrived. Give me two minutes.", ["yet", "just", "ever"], 1],
          ["We ___ the problem yesterday.", ["have solved", "solved", "solve"], 1],
          ["She has ___ fixed the light. It works now.", ["yet", "already", "still"], 1],
          ["They haven't paid the bill ___.", ["already", "just", "yet"], 2],
          ["The printer ___ again! Who can fix it?", ["has broken", "broke yesterday", "is break"], 0]
        ],
        note: "Item 3: yesterday is a finished time, so past simple."
      },
      {
        type: "roleplay", title: "Role-play: can you help me?", minutes: 10,
        intro: "One person has a problem; the other suggests solutions. Then swap.",
        cards: [
          { who: "Person with a problem", task: "Choose a problem and explain what has happened.", phrases: ["I've just… and I don't know what to do.", "I've already tried…", "I haven't… yet.", "That's a good idea. / I don't think that will work."] },
          { who: "Helper", task: "Ask questions and suggest at least three solutions.", phrases: ["What's happened?", "Have you tried…-ing?", "Why don't you…?", "If I were you, I'd…"] }
        ],
        info: ["Lost your bank card", "Your flatmate never washes up", "Your laptop has stopped working", "You've missed the last bus"],
        game: { title: "Cool-down: the worst day", how: "Take turns adding one problem to a story: This morning I've just woken up and… The other person adds the next problem. Who can make the worst day?" },
        note: "Push for the present perfect in the problem and Have you tried…? in the solutions."
      },
      {
        type: "write", title: "Homework: an email", minutes: 8,
        task: "Write a short email to a friend, a landlord or a manager about a problem. Say what has happened and what you've already done.",
        prompts: ["what has happened", "what you've already done", "what you haven't done yet", "what you need", "a polite ending"],
        start: "Hi…, I'm writing because…",
        model: "Hi Mr Brown, I'm writing because the boiler in my flat has stopped working. I've already checked the switch and I've turned it off and on again, but there is still no hot water. I haven't called a plumber yet because I wanted to ask you first. Could you send someone this week, please? Thank you, Elena",
        lines: 6,
        count: "already",
        note: "Correct the present perfect and polite requests (Could you…?)."
      }
    ],
    errors: ["I have lost my keys yesterday. (past simple with a finished time)", "I've yet called. / Have you called already yet? (word position)", "He have just left. (has)"],
    stretch: ["What's the biggest problem you've ever solved?", "Are people better at solving problems alone or in groups?", "Explain a problem in your city and what should be done about it."]
  },
  {
    id: "b1-hobbies-how-long",
    level: "B1",
    title: "How long have you been…?",
    topic: "Hobbies and habits",
    focus: "present perfect continuous with for and since",
    minutes: 60,
    aims: [
      "talk about your hobbies and how long you have done them",
      "learn words for hobbies and how you feel about them",
      "read about someone's new hobby",
      "use the present perfect continuous with for and since",
      "interview a partner about their interests"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: free time", minutes: 6,
        intro: "Discuss the questions.",
        questions: [
          "What do you like doing in your free time?",
          "Is there a hobby you have done for a long time?",
          "What hobby would you like to start?"
        ],
        follow: ["Did you have a hobby as a child?", "Do you prefer hobbies at home or outside?", "Do you spend money on your hobby?"],
        note: "Listen for How long…? answers. Most learners say I play since five years; note it for step 4."
      },
      {
        type: "sort", title: "Hobby words", minutes: 8,
        intro: "Put each hobby in the right group.",
        groups: {
          "Creative": ["painting", "knitting", "photography"],
          "Active": ["climbing", "cycling", "yoga"],
          "Social": ["choir", "board games", "volunteering"],
          "Quiet": ["reading", "gardening", "puzzles"]
        },
        tip: "we often say go + -ing for sports (go climbing, go cycling), do for yoga, and play for games (play board games).",
        tipLabel: "💡 Tip",
        challenge: "Say which hobbies you have tried, and for how long.",
        note: "Some hobbies fit more than one group. Ask the learner to give a reason for their choice."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Never too old",
        intro: "Read about Rosa and answer the questions.",
        text: [
          "Rosa is sixty-eight. Two years ago her daughter gave her a cheap guitar for her birthday. \"I laughed,\" says Rosa. \"I thought I was too old to learn.\"",
          "But she has been playing every day since then. She has been taking lessons online for eighteen months, and she has joined a group of older beginners who meet in a café on Thursdays. \"We aren't very good,\" she smiles, \"but we have so much fun.\"",
          "Rosa has also been learning to read music. It's hard, and her fingers hurt sometimes, but she says the guitar has changed her life. \"I've made new friends, and my memory is better. I've been telling everyone: it's never too late to start something new!\""
        ],
        items: [
          ["Rosa bought the guitar herself.", false, "Her daughter gave it to her."],
          ["She plays every day.", true, "She has been playing every day."],
          ["Her group meets on Thursdays.", true, "They meet in a café on Thursdays."],
          { q: "How long has Rosa been taking lessons?", a: "For eighteen months." },
          { q: "What is difficult for her?", a: "Reading music, and her fingers hurt sometimes." },
          { q: "How has the guitar changed her life?", a: "She has made new friends and her memory is better." }
        ],
        challenge: "Find three examples of has / have been + -ing in the text.",
        note: "Ask: what did Rosa think at first? Do you agree that it's never too late?"
      },
      {
        type: "grammar", title: "Present perfect continuous", minutes: 12,
        rule: ["We use the present perfect continuous (have / has been + -ing) for an activity that started in the past and is still going on.", "Use for with a period of time and since with a starting point."],
        head: ["", "Example", "Note"],
        table: [
          ["positive", "I've been playing for two years.", "for + period: for ten minutes, for ages"],
          ["negative", "She hasn't been sleeping well.", "since + start: since 2020, since Monday"],
          ["question", "How long have you been learning?", "Not with know, like, have (= own): I've known her for years."]
        ],
        intro: "Write the present perfect continuous, or for / since.",
        items: [
          { text: "I {} yoga for six months.", hint: "do", answers: [["have been doing", "'ve been doing"]] },
          { text: "How long {} you {} English?", hint: "learn", answers: [["have"], ["been learning"]] },
          { text: "She has been painting {} she retired.", answers: [["since"]] },
          { text: "We've been waiting {} forty minutes!", answers: [["for"]] },
          { text: "He {} well recently. He's always tired.", hint: "not / sleep", answers: [["hasn't been sleeping", "has not been sleeping"]] },
          { text: "They {} together since 2019.", hint: "climb", answers: [["have been climbing", "'ve been climbing"]] }
        ],
        challenge: "Write three sentences about things you have been doing for a long time.",
        note: "Contrast: I've read your book (finished) / I've been reading your book (not finished)."
      },
      {
        type: "choose", title: "Choose the answer", minutes: 6,
        intro: "Choose the best answer.",
        items: [
          ["I've been learning the piano ___ 2021.", ["for", "since", "from"], 1],
          ["How long ___ you known your best friend?", ["have", "have been", "are"], 0],
          ["She's tired because she ___ all day.", ["has been working", "works", "has worked yet"], 0],
          ["We've been friends ___ twenty years.", ["since", "for", "during"], 1],
          ["Your hands are dirty! What ___?", ["have you done", "have you been doing", "did you do"], 1],
          ["I ___ three books this month.", ["have read", "have been reading", "read since"], 0]
        ],
        note: "Item 2: know is a state verb, so no continuous. Item 6: a finished number of things uses the present perfect simple."
      },
      {
        type: "roleplay", title: "Speaking: hobby interview", minutes: 10,
        intro: "Interview your partner about a hobby. Then swap.",
        cards: [
          { who: "Interviewer", task: "Ask at least six questions.", phrases: ["What's your favourite hobby?", "How long have you been doing it?", "How did you start?", "What do you like most about it?", "Have you ever wanted to stop?"] },
          { who: "Hobby person", task: "Answer about your real hobby, or be Rosa from the text.", phrases: ["I've been… for / since…", "I started when…", "The best thing is…", "It's hard because…"] }
        ],
        game: { title: "Cool-down: guess the hobby", how: "Say what you have been doing, without saying the hobby: I've been getting up early, I've been carrying a heavy bag and I've been looking at birds all day. Your partner guesses (birdwatching!)." },
        note: "Correct How long are you doing…? to How long have you been doing…? when it comes up."
      },
      {
        type: "write", title: "Homework: my hobby", minutes: 8,
        task: "Write a short paragraph about a hobby: how you started, how long you've been doing it, and why you like it.",
        prompts: ["the hobby", "how you started", "for / since", "what you've learned", "why you like it"],
        start: "I've been… since…",
        model: "I've been running since 2020. I started during lockdown because I was bored at home. At first I could only run for five minutes, but I've been training three times a week and now I can run ten kilometres. I love it because it clears my head, and I've met some great people at my running club.",
        lines: 6,
        count: "been",
        note: "Correct for / since and the continuous form. Ask the learner to read it aloud next lesson."
      }
    ],
    errors: ["I'm learning English since three years. (I've been learning … for three years)", "I've been knowing her for years. (state verb: I've known)", "since two years (for two years)"],
    stretch: ["What would you like to start doing, and why?", "Should schools teach more hobbies?", "Describe a hobby that is popular in your country but not in the UK."]
  }
);
