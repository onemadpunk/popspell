/* Adult English · C1 (Advanced). See english-lessons.js for the format. */
(window.PopEnglishLessons = window.PopEnglishLessons || []).push(
  {
    id: "c1-looking-ahead",
    level: "C1",
    title: "Looking ahead",
    topic: "The future and careers",
    focus: "future perfect and future perfect continuous",
    minutes: 60,
    aims: [
      "discuss predictions about your life and the world",
      "use expressions for talking about the future",
      "read predictions about working life in 2040",
      "use the future perfect and future perfect continuous",
      "talk about long-term goals in a coaching conversation"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: ten years from now", minutes: 6,
        intro: "Discuss the questions.",
        questions: [
          "Where do you see yourself in ten years' time?",
          "Which change in the world do you think will affect you most?",
          "Are you someone who plans ahead, or do you prefer to see what happens?"
        ],
        follow: ["What did you expect to be doing now, ten years ago?", "Which jobs will have disappeared by 2040?", "Is it possible to plan a career any more?"],
        note: "Let the learner speculate freely. Listen for will have + past participle; most learners avoid it."
      },
      {
        type: "match", title: "Talking about the future", minutes: 8,
        intro: "Match the expressions (A–F) with their meanings (1–6).",
        pairs: [
          ["by the time", "before or when something else happens"],
          ["in the long run", "over a long period, eventually"],
          ["for the foreseeable future", "for as long as we can predict"],
          ["sooner or later", "at some time, certainly"],
          ["on the horizon", "likely to happen soon"],
          ["a decade from now", "in ten years' time"]
        ],
        challenge: "Make a prediction about your own life with three of the expressions.",
        note: "In the long run is often used to justify a short-term cost: It's expensive, but in the long run it saves money."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Work in 2040",
        intro: "Read the predictions and answer the questions.",
        text: [
          "By 2040, experts predict, artificial intelligence will have taken over many routine office tasks. Rather than disappearing, though, most jobs will have changed shape: people will spend less time processing information and more time making judgements, solving problems and dealing with people.",
          "Many of today's school leavers will have been working for fifteen years by then, and few of them will still be doing the job they started with. The average worker, researchers suggest, will have retrained at least twice.",
          "Critics warn that unless governments invest in lifelong learning, those who have been doing the same job for decades could be left behind. In the long run, they argue, the ability to keep learning may matter more than any single qualification."
        ],
        items: [
          ["Experts expect most jobs to disappear by 2040.", false, "Most jobs will have changed shape rather than disappearing."],
          ["People will spend more time making judgements.", true, "More time making judgements, solving problems and dealing with people."],
          ["Critics think governments must invest in lifelong learning.", true, "Unless governments invest in lifelong learning…"],
          { q: "How many times will the average worker have retrained?", a: "At least twice." },
          { q: "Who could be left behind, according to critics?", a: "People who have been doing the same job for decades." },
          { q: "What may matter more than a qualification?", a: "The ability to keep learning." }
        ],
        challenge: "Find all the examples of will have (been) in the text. Which describe a finished action, and which an ongoing one?",
        note: "Finished: will have taken over, will have changed, will have retrained. Ongoing: will have been working."
      },
      {
        type: "grammar", title: "Future perfect (continuous)", minutes: 12,
        rule: "Future perfect: an action finished before a point in the future. Future perfect continuous: how long an action will have been going on at that point.",
        head: ["", "Form", "Example"],
        table: [
          ["future perfect", "will have + past participle", "By June, I'll have finished my course."],
          ["future perfect continuous", "will have been + -ing", "By June, I'll have been studying for three years."],
          ["negative / question", "won't have (been)… / Will you have (been)…?", "She won't have arrived by six. How long will you have been living here?"]
        ],
        intro: "Complete the sentences with the future perfect or future perfect continuous.",
        items: [
          { text: "By the time you get here, we {} dinner.", hint: "finish", answers: [["will have finished", "'ll have finished"]] },
          { text: "Next month I {} here for ten years.", hint: "work", answers: [["will have been working", "'ll have been working"]] },
          { text: "Don't call at nine. The film {} yet.", hint: "not / end", answers: [["won't have ended", "will not have ended"]] },
          { text: "By 2030, scientists {} a cure, I hope.", hint: "find", answers: [["will have found", "'ll have found"]] },
          { text: "{} you {} the report by Friday?", hint: "write", answers: [["will"], ["have written"]] },
          { text: "When she lands, she {} for fourteen hours.", hint: "travel", answers: [["will have been travelling", "'ll have been travelling", "will have been traveling"]] }
        ],
        challenge: "Write three sentences about what you will have done, and will have been doing, by your next birthday.",
        note: "Typical time markers: by, by the time, by then, for + period. British spelling: travelling (one l in American English is also accepted)."
      },
      {
        type: "choose", title: "Choose the answer", minutes: 6,
        intro: "Choose the best answer.",
        items: [
          ["By the end of the year, I ___ all my debts.", ["will pay", "will have paid", "will be paying"], 1],
          ["In May, we ___ married for twenty years.", ["will have been", "will be being", "have been"], 0],
          ["By the time you arrive, the meeting ___.", ["will start", "will have started", "starts"], 1],
          ["How long ___ English by next year?", ["will you have been learning", "will you learn", "are you learning"], 0],
          ["Don't worry, I ___ the house before they come.", ["will have cleaned", "have cleaned", "had cleaned"], 0],
          ["This time next week, I ___ on a beach in Spain.", ["will have lain", "will be lying", "will have been lie"], 1]
        ],
        note: "Item 2: be is a state verb, so the simple form (will have been married), not the continuous. Item 6 revises the future continuous."
      },
      {
        type: "roleplay", title: "Role-play: career coaching", minutes: 10,
        intro: "One person is a career coach and the other wants to change career. Then swap.",
        cards: [
          { who: "Career coach", task: "Help your client set goals for one, five and ten years. Ask challenging follow-up questions.", phrases: ["Where would you like to be in five years' time?", "What will you need to have done by then?", "What's on the horizon in your industry?", "And in the long run?"] },
          { who: "Client", task: "Explain your situation and your hopes, honestly or as this person.", phrases: ["By then I hope I'll have…", "I'll have been working in… for…", "Sooner or later I'll have to…", "What worries me is…"] }
        ],
        info: ["Age 38, accountant for 15 years", "Wants to work with people, maybe teaching", "Has two children and a mortgage", "Can study part-time in the evenings"],
        game: { title: "Cool-down: time capsule", how: "Each person says three things they will have done by 2035 and one they will never have done. The partner says which is most likely and why." },
        note: "Push for precision: not I will work there but By 2030 I'll have been working there for five years."
      },
      {
        type: "write", title: "Homework: a letter to my future self", minutes: 8,
        task: "Write a letter to yourself ten years from now. Say what you hope you will have done and will have been doing.",
        prompts: ["work", "home and family", "learning", "a habit you'll have changed", "a question for your future self"],
        start: "Dear me, by the time you read this…",
        model: "Dear me, by the time you read this, you'll have been living in Scotland for twelve years. I hope you'll have finished your teaching qualification and that you'll have been working in a school for a while. You'll have stopped worrying so much about money, I hope. In the long run, nothing matters more than health and family. Have you finally learned to cook?",
        lines: 6,
        count: "will have",
        note: "Accept 'll have in the count by reading it aloud together. Correct tense choice and time markers."
      }
    ],
    errors: ["By next year I will finish… (when the focus is completion by a point: will have finished)", "will have been being (state verbs take the simple form)", "Missing by: Next week I'll have finished (better: By next week…)"],
    stretch: ["What will you have learned from this course by the time it ends?", "Which prediction about the future do you find most worrying?", "How have the predictions people made in 2000 turned out?"]
  },
  {
    id: "c1-living-sustainably",
    level: "C1",
    title: "Living sustainably",
    topic: "Environment and lifestyle",
    focus: "mixed conditionals",
    minutes: 60,
    aims: [
      "discuss what sustainability means in everyday life",
      "use collocations about the environment",
      "read about the rise and fall of fast fashion",
      "use mixed conditionals to talk about past choices and present results",
      "debate a proposal and reach a compromise"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: sustainable living", minutes: 6,
        intro: "Discuss the questions.",
        questions: [
          "What does living sustainably mean to you?",
          "What is one thing you do for the environment, and one thing you could do better?",
          "Who has more responsibility: individuals, companies or governments?"
        ],
        follow: ["Is recycling enough?", "Would you pay more for sustainable products?", "Has your country changed its habits in the last ten years?"],
        note: "Accept a range of views. The aim is fluent, nuanced opinion, not agreement."
      },
      {
        type: "sort", title: "Environment collocations", minutes: 8,
        intro: "Put each phrase in the right group.",
        groups: {
          "Problems": ["carbon emissions", "single-use plastic", "fast fashion"],
          "Solutions": ["renewable energy", "a circular economy", "public transport"],
          "Verbs: do more": ["reduce your footprint", "cut down on waste", "switch to green energy"],
          "Verbs: talk about it": ["raise awareness", "take responsibility", "lead by example"]
        },
        tip: "a carbon footprint is the amount of carbon dioxide your lifestyle produces. A circular economy reuses and repairs things instead of throwing them away.",
        tipLabel: "💡 Meaning",
        challenge: "Use four of the phrases to describe your own lifestyle honestly.",
        note: "Check collocations: reduce (not lower) your footprint, raise (not rise) awareness."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "The true cost of a £5 T-shirt",
        intro: "Read the article and answer the questions.",
        text: [
          "Twenty years ago, most people bought new clothes a few times a year. Today, some brands release new styles every week, and the average garment is worn only seven to ten times before it is thrown away. The fashion industry now produces more carbon emissions than international flights and shipping combined.",
          "If shoppers had realised the true cost earlier, critics argue, the industry wouldn't be so harmful today. Making a single cotton T-shirt can use around 2,700 litres of water, and much of the clothing donated to charity shops ends up in landfill abroad.",
          "There are signs of change. Second-hand apps are booming, and repair cafés are opening across the UK. If we wore each item twice as often, experts say, we could cut its footprint by almost half. The cheapest T-shirt, it seems, is the one you already own."
        ],
        items: [
          ["People buy clothes less often than twenty years ago.", false, "Some brands release new styles every week."],
          ["Fashion produces more emissions than international flights and shipping together.", true, "…more than international flights and shipping combined."],
          ["Second-hand apps are becoming less popular.", false, "Second-hand apps are booming."],
          { q: "How many times is the average garment worn?", a: "Only seven to ten times." },
          { q: "What happens to much of the clothing given to charity shops?", a: "It ends up in landfill abroad." },
          { q: "What do experts say would almost halve an item's footprint?", a: "Wearing it twice as often." }
        ],
        challenge: "Explain the last sentence in your own words. Do you agree?",
        note: "Ask: what is the writer's opinion, and how do you know? (word choices like true cost, harmful)."
      },
      {
        type: "grammar", title: "Mixed conditionals", minutes: 12,
        rule: ["Mixed conditionals link a different time in each half of the sentence.", "Most common: an unreal past condition with a present result, or an unreal present situation with a past result."],
        head: ["Type", "Form", "Example"],
        table: [
          ["past → present", "If + past perfect, would + verb", "If we had acted earlier, the planet wouldn't be so hot now."],
          ["present → past", "If + past simple, would have + past participle", "If I cared about fashion, I would have bought that jacket."],
          ["negative", "If + hadn't / didn't…", "If she didn't cycle, she would have missed the train."]
        ],
        intro: "Complete the mixed conditionals.",
        items: [
          { text: "If I {} that dress, I would have nothing to wear tonight.", hint: "not / buy", answers: [["hadn't bought", "had not bought"]] },
          { text: "If they had invested in solar power, their bills {} so high now.", hint: "not / be", answers: [["wouldn't be", "would not be"]] },
          { text: "If he {} so lazy, he would have walked to work.", hint: "not / be", answers: [["weren't", "wasn't", "were not", "was not"]] },
          { text: "If we {} the bus timetable, we'd be at the meeting now.", hint: "check", answers: [["had checked"]] },
          { text: "If I lived closer to the shops, I {} the car yesterday.", hint: "not / take", answers: [["wouldn't have taken", "would not have taken"]] },
          { text: "She {} an expert now if she hadn't studied ecology.", hint: "not / be", answers: [["wouldn't be", "would not be"]] }
        ],
        challenge: "Write two mixed conditionals about choices in your own life.",
        note: "Item 3: If he weren't is more formal; If he wasn't is common in speech. Both are accepted."
      },
      {
        type: "fix", title: "Correct the mistakes", minutes: 5,
        intro: "Each sentence has one mistake. Write it correctly.",
        items: [
          ["If we would have recycled more, there would be less waste now.", ["If we had recycled more, there would be less waste now."]],
          ["If I hadn't moved here, I wouldn't had met you.", ["If I hadn't moved here, I wouldn't have met you.", "If I had not moved here, I would not have met you."]],
          ["We need to rise awareness of the problem.", ["We need to raise awareness of the problem."]],
          ["Try to lower your carbon footprint by cycling.", ["Try to reduce your carbon footprint by cycling."]],
          ["If she wasn't so busy, she would come to the protest yesterday.", ["If she wasn't so busy, she would have come to the protest yesterday.", "If she weren't so busy, she would have come to the protest yesterday."]]
        ],
        note: "Item 4: lower is understandable, but reduce is the natural collocation."
      },
      {
        type: "roleplay", title: "Debate: a car-free city centre", minutes: 11,
        intro: "Your city plans to ban cars from the centre. Argue your side, then try to reach a compromise. Then swap sides.",
        cards: [
          { who: "For the ban", task: "Argue that the ban will improve health and the environment.", phrases: ["If we had done this years ago, our air would be cleaner now.", "In the long run, it will…", "The evidence suggests…", "Surely it's worth…"] },
          { who: "Against the ban", task: "Argue that it will hurt businesses and people who need cars.", phrases: ["That's all very well, but…", "What about people who…?", "If the buses were better, I might agree, but…", "Couldn't we…instead?"] }
        ],
        info: ["Air pollution: twice the safe level", "30% of shops say they'd lose customers", "Buses: every 20 minutes", "Plan starts in two years"],
        game: { title: "Cool-down: one small change", how: "Each person names one realistic change they will make this month and explains how it could make a difference in the long run." },
        note: "Teach a few debate phrases before starting: I take your point, but… / With respect, I disagree."
      },
      {
        type: "write", title: "Homework: for and against", minutes: 8,
        task: "Write a short for-and-against essay: Should fast fashion be taxed?",
        prompts: ["introduction", "arguments for", "arguments against", "your opinion", "a mixed conditional"],
        start: "Fast fashion has become…",
        model: "Fast fashion has become one of the most polluting industries in the world. Supporters of a tax argue that it would make brands take responsibility and raise awareness among shoppers. On the other hand, cheap clothes help families on low incomes. In my view, a small tax would be fair if it funded repair schemes. If governments had acted sooner, we wouldn't be facing such a serious problem now.",
        lines: 6,
        note: "Look for balance, clear paragraphs and at least one accurate mixed conditional."
      }
    ],
    errors: ["If I would have known… (if + past perfect)", "wouldn't had (wouldn't have)", "rise awareness / lower your footprint (raise, reduce)"],
    stretch: ["If you had grown up fifty years ago, how would your attitudes be different now?", "Is individual action pointless without government action?", "What would your city look like now if it had been designed for bikes?"]
  },
  {
    id: "c1-films-and-tv",
    level: "C1",
    title: "Films and TV",
    topic: "Reviews and recommendations",
    focus: "intensifiers with gradable and extreme adjectives",
    minutes: 60,
    aims: [
      "discuss what you watch and how you watch it",
      "learn precise words for reviewing films and series",
      "read and evaluate a short review",
      "use very, really and absolutely correctly with adjectives",
      "recommend, and argue for, a series or film"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: what are you watching?", minutes: 6,
        intro: "Discuss the questions.",
        questions: [
          "What have you watched recently that you would recommend?",
          "Do you prefer films or series? Cinema or sofa?",
          "Do you watch in English? With or without subtitles?"
        ],
        follow: ["Have you ever binge-watched a whole series?", "Which film from your country should everyone see?", "Do you read reviews before you watch?"],
        note: "Note the adjectives the learner uses (good, nice, interesting) and come back to them in step 4."
      },
      {
        type: "match", title: "Review words", minutes: 8,
        intro: "Match the words (A–F) with their meanings (1–6).",
        pairs: [
          ["gripping", "so exciting you can't stop watching"],
          ["predictable", "you know what will happen next"],
          ["far-fetched", "too unlikely to believe"],
          ["understated", "quiet and subtle, not exaggerated"],
          ["a spoiler", "information that ruins the surprise"],
          ["binge-watch", "watch many episodes one after another"]
        ],
        challenge: "Describe a film or series you know using three of these words.",
        note: "Add more if there is time: overrated, thought-provoking, a slow burn, a plot twist."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Review: The Lighthouse Keeper's Daughter",
        intro: "Read the review of an imaginary series and answer the questions.",
        text: [
          "Set on a tiny island off the west coast of Scotland, this six-part drama follows Isla, a young marine biologist who returns home after her father's sudden death. What begins as a quiet family story slowly becomes a gripping mystery.",
          "The acting is absolutely superb. Moira Grant gives an understated performance as Isla's mother, saying more with a look than most actors do with a speech. The scenery is breathtaking, and the slow pace, which some viewers may find frustrating, suits the story perfectly.",
          "It isn't flawless. The final episode is rather far-fetched, and one or two characters are frankly predictable. But these are minor complaints. If you're tired of loud, fast thrillers, this is an utterly beautiful slow burn. Four stars."
        ],
        items: [
          ["The series is set on an island in Scotland.", true, "…a tiny island off the west coast of Scotland."],
          ["The reviewer thinks the slow pace is a problem.", false, "It suits the story perfectly."],
          ["The reviewer gives it five stars.", false, "Four stars."],
          { q: "Why does Isla return home?", a: "Because of her father's sudden death." },
          { q: "What does the reviewer praise about Moira Grant's performance?", a: "It is understated: she says more with a look than others do with a speech." },
          { q: "What are the reviewer's two criticisms?", a: "The final episode is far-fetched and some characters are predictable." }
        ],
        challenge: "Find four intensifiers (words like very) in the review. Which adjectives do they go with?",
        note: "absolutely superb, rather far-fetched, frankly predictable, utterly beautiful. Talk about how rather softens a criticism."
      },
      {
        type: "grammar", title: "Very or absolutely?", minutes: 12,
        rule: ["Gradable adjectives (good, interesting, tired) can be more or less: use very, extremely, rather, fairly.", "Extreme adjectives (brilliant, awful, exhausted) already mean very: use absolutely, utterly, completely. Really works with both."],
        head: ["Adjective type", "Intensifiers", "Example"],
        table: [
          ["gradable", "very, extremely, a bit, rather, fairly", "It was very good. / It was rather slow."],
          ["extreme", "absolutely, utterly, completely", "It was absolutely brilliant."],
          ["both", "really, pretty", "It was really good. It was really brilliant."]
        ],
        intro: "Write very or absolutely.",
        items: [
          { text: "The ending was {} terrifying. I couldn't sleep.", answers: [["absolutely"]] },
          { text: "The plot was {} interesting, but too long.", answers: [["very"]] },
          { text: "I was {} exhausted after watching all ten episodes.", answers: [["absolutely"]] },
          { text: "The actors were {} good in their roles.", answers: [["very"]] },
          { text: "The special effects were {} amazing.", answers: [["absolutely"]] },
          { text: "It's a {} long film: nearly three hours.", answers: [["very"]] }
        ],
        challenge: "Give each word its extreme partner: good, bad, tired, funny, big, interesting.",
        note: "Partners: brilliant / superb, awful / terrible, exhausted, hilarious, enormous / huge, fascinating. Not: very brilliant, absolutely good."
      },
      {
        type: "choose", title: "Choose the answer", minutes: 5,
        intro: "Choose the best answer.",
        items: [
          ["The final episode was ___ hilarious.", ["very", "absolutely", "fairly"], 1],
          ["The film was ___ disappointing, but the music was great.", ["rather", "utterly", "completely"], 0],
          ["Honestly, the dialogue was ___ awful.", ["very", "a bit", "absolutely"], 2],
          ["I found the documentary ___ fascinating.", ["really", "very", "fairly"], 0],
          ["It's a ___ predictable story, but I liked it.", ["completely", "fairly", "absolutely"], 1],
          ["The cinema was ___ freezing!", ["extremely", "absolutely", "very"], 1]
        ],
        note: "Item 2: rather often softens a negative opinion in British English. Item 4: very fascinating is a common learner error."
      },
      {
        type: "roleplay", title: "Speaking: sell it to me", minutes: 11,
        intro: "Recommend a film or series to your partner, who is hard to convince. Then swap.",
        cards: [
          { who: "Recommender", task: "Persuade your partner to watch something you love, without spoilers.", phrases: ["You absolutely have to watch…", "It's set in… and it follows…", "It's a bit slow at first, but…", "Trust me, the ending is…"] },
          { who: "Sceptic", task: "Ask difficult questions and raise doubts. Decide at the end.", phrases: ["Isn't it rather predictable?", "That sounds a bit far-fetched.", "How many seasons are there?", "OK, you've convinced me. / I'm not sold."] }
        ],
        game: { title: "Cool-down: the one-sentence review", how: "Take turns describing a famous film in one sentence without its name, using at least one intensifier. The other guesses the film." },
        note: "Listen for intensifier errors and correct them at the end, not during the role-play."
      },
      {
        type: "write", title: "Homework: write a review", minutes: 8,
        task: "Write a review (120 to 150 words) of a film or series you have seen recently. End with a star rating.",
        prompts: ["the setting and story (no spoilers)", "the acting", "what works", "what doesn't", "who should watch it", "stars"],
        start: "Set in…",
        model: "Set in 1980s Glasgow, this four-part drama follows two brothers who run a failing fish-and-chip shop. The writing is absolutely brilliant: funny one minute and heartbreaking the next. The two leads are very convincing, and the soundtrack is superb. The third episode is rather slow, and the ending is a little predictable. Still, if you like character-driven stories, you'll find it utterly charming. Four stars.",
        lines: 6,
        note: "Look for precise review words from step 2 and correct intensifier choice."
      }
    ],
    errors: ["very brilliant / very fascinating (absolutely brilliant, really fascinating)", "absolutely good / absolutely interesting (very good, very interesting)", "Spoiling the ending in a review"],
    stretch: ["Are streaming services good or bad for cinema?", "Why are some books impossible to film well?", "Which film do people love that you think is overrated? Defend your view."]
  }
);
