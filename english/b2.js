/* Adult English · B2 (Upper intermediate). See english-lessons.js for the format. */
(window.PopEnglishLessons = window.PopEnglishLessons || []).push(
  {
    id: "b2-phrasal-verbs-get",
    level: "B2",
    title: "Phrasal verbs with get",
    topic: "Keeping in touch",
    focus: "phrasal verbs with get, and where the object goes",
    minutes: 60,
    aims: [
      "talk about the many meanings of get",
      "learn eight common phrasal verbs with get",
      "read two phone calls, one formal and one informal",
      "put objects and pronouns in the right place with phrasal verbs",
      "catch up with a friend using phrasal verbs naturally"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: get", minutes: 6,
        intro: "Discuss the questions.",
        questions: [
          "What does the word get mean to you? How many ways can you use it?",
          "If someone says, \"I need to get over a bad cold\", what do they mean?",
          "What might a friend mean by \"I can't get through to you\"?"
        ],
        follow: ["Is get formal or informal?", "What's the hardest thing about phrasal verbs?", "Do you have anything like phrasal verbs in your language?"],
        note: "Collect meanings: receive, buy, become, arrive, understand. Point out that get is very common in spoken British English."
      },
      {
        type: "match", title: "Phrasal verbs", minutes: 10,
        intro: "Match each phrasal verb (A–H) with its meaning (1–8).",
        pairs: [
          ["get over", "recover from an illness or a bad experience"],
          ["get through to", "make someone understand, or reach them by phone"],
          ["get along with", "have a friendly relationship with"],
          ["get out of", "avoid doing something you should do"],
          ["get back to", "reply to someone later"],
          ["get by", "manage with very little money or knowledge"],
          ["get round to", "finally do something after a delay"],
          ["get on with", "continue doing something, especially work"]
        ],
        challenge: "Choose three phrasal verbs and say a true sentence about your life with each.",
        note: "Get on with has two meanings: be friendly with (= get along with) and continue (Let's get on with the meeting)."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Two phone calls",
        intro: "Read the two calls. Which is more formal? Answer the questions.",
        text: [
          "Call A · Receptionist: Good morning, Harper and Lee. · Jake: Hello, I've been trying to reach Ms Lee all morning, but I can't seem to get through. · Receptionist: I'm afraid she's in meetings until three. Can I take a message? · Jake: Yes, please ask her to get back to me about the contract when she can.",
          "Call B · Mia: Jake! Finally! How are you? Did you get over that cold? · Jake: Just about, thanks. Work's been crazy, though. I tried to get out of a meeting today but my boss said no. · Mia: Oh no! And how's your new flatmate? Do you get along? · Jake: Yeah, really well. Listen, I still haven't got round to booking the restaurant for Saturday. Can I get back to you tonight?"
        ],
        items: [
          ["Jake can't speak to Ms Lee because she is in meetings.", true, "She's in meetings until three."],
          ["Jake has a cold now.", false, "He has just about got over it."],
          ["Jake doesn't like his new flatmate.", false, "They get along really well."],
          { q: "Which call is more formal? Find two phrases that show it.", a: "Call A: I'm afraid…, Can I take a message?, please ask her to…" },
          { q: "What did Jake try to do at work today?", a: "Get out of a meeting." },
          { q: "What hasn't he got round to doing?", a: "Booking the restaurant for Saturday." }
        ],
        challenge: "Find six phrasal verbs with get in the two calls.",
        note: "Phrasal verbs are not only informal: get through and get back to are fine in polite business English too."
      },
      {
        type: "grammar", title: "Where does the object go?", minutes: 12,
        rule: ["Most phrasal verbs with get are inseparable: the object always comes after the whole verb.", "With three-part verbs (get on with, get round to), the object comes at the end. A pronoun (it, her, them) can never go in the middle."],
        head: ["Type", "✓ Right", "✗ Wrong"],
        table: [
          ["two parts", "She got over the shock. She got over it.", "She got the shock over."],
          ["three parts", "I'll get back to you. We get along with them.", "I'll get back you to."],
          ["+ -ing", "I haven't got round to calling him.", "I haven't got round to call him."]
        ],
        intro: "Complete each sentence with the right phrasal verb in the right form.",
        items: [
          { text: "It took me months to {} the break-up.", answers: [["get over"]] },
          { text: "Sorry, I'm busy. Can I {} you tomorrow?", answers: [["get back to"]] },
          { text: "I tried to call the bank, but I couldn't {}.", answers: [["get through"]] },
          { text: "He always manages to {} the washing-up!", answers: [["get out of"]] },
          { text: "My Spanish isn't great, but I can {}.", answers: [["get by"]] },
          { text: "I finally {} fixing the shelf last weekend.", answers: [["got round to", "got around to"]] }
        ],
        challenge: "Rewrite three sentences from the reading so they are more formal, without phrasal verbs.",
        note: "Formal alternatives: recover from (get over), contact / reply to (get back to), avoid (get out of), manage (get by)."
      },
      {
        type: "fix", title: "Correct the mistakes", minutes: 5,
        intro: "Each sentence has one mistake. Write it correctly.",
        items: [
          ["I'll get you back to on Monday.", ["I'll get back to you on Monday.", "I will get back to you on Monday."]],
          ["She hasn't got over it the flu yet.", ["She hasn't got over the flu yet.", "She has not got over the flu yet."]],
          ["Do you get along your boss?", ["Do you get along with your boss?", "Do you get on with your boss?"]],
          ["I never get round to clean the car.", ["I never get round to cleaning the car.", "I never get around to cleaning the car."]],
          ["We got by with only a little money for us.", ["We got by with only a little money."]]
        ],
        note: "Ask the learner to say why each one is wrong: word order, a missing particle, or -ing after to."
      },
      {
        type: "roleplay", title: "Speaking: catching up", minutes: 9,
        intro: "You are old friends who haven't spoken for months. Catch up on the phone. Use at least five phrasal verbs with get. Then swap.",
        cards: [
          { who: "Friend A", task: "You've had a hard few months but things are better now.", phrases: ["I was ill, but I've got over it.", "I'm just getting by on…", "I've been meaning to… but haven't got round to it."] },
          { who: "Friend B", task: "You've started a new job and moved house.", phrases: ["I get along really well with…", "I tried to get out of…", "Let me get back to you about…"] }
        ],
        game: { title: "Cool-down: find someone who…", how: "Ask your partner: Have you ever tried to get out of a wedding? Is there something you never get round to? Who do you get along with best in your family? Give one more detail for each answer." },
        note: "Keep a tally of the phrasal verbs used and give feedback at the end."
      },
      {
        type: "write", title: "Homework: a catch-up email", minutes: 8,
        task: "Write an email to a friend you haven't seen for a long time. Use at least five phrasal verbs with get.",
        prompts: ["say sorry for the silence", "news about work or home", "something you got over", "something you haven't got round to", "suggest meeting"],
        start: "Hi…, I'm so sorry I haven't been in touch…",
        model: "Hi Sam, I'm so sorry I haven't been in touch. Work has been mad and I'm only just getting by. I had a horrible flu in March, but I've finally got over it. I get along really well with my new team, which helps! I still haven't got round to visiting you in Leeds. Are you free next month? Get back to me when you can. Love, Ana",
        lines: 6,
        count: "get",
        note: "Underline the phrasal verbs in the learner's email and check the object position."
      }
    ],
    errors: ["get back you to / get over it the flu (word order)", "get round to do (get round to doing)", "Overusing get in formal writing"],
    stretch: ["Which phrasal verbs with get would you avoid in a job interview? What would you say instead?", "Tell a story about a time you tried to get out of something.", "Explain the difference between get on, get on with and get on to."]
  },
  {
    id: "b2-food-and-mood",
    level: "B2",
    title: "Food is more than fuel",
    topic: "Food, health and feelings",
    focus: "comparatives: much / slightly, and the more…, the more…",
    minutes: 60,
    aims: [
      "discuss the role of food in your life and culture",
      "learn words for nutrients and how food makes us feel",
      "read about the link between food and mood",
      "use modified comparatives and the more…, the more…",
      "plan a healthy menu with a partner"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: food is more than fuel", minutes: 6,
        intro: "Discuss the questions.",
        questions: [
          "What do you think the saying \"food is more than just fuel\" means? Do you agree?",
          "Is there a food that makes you feel happy, calm or homesick?",
          "Do you eat differently when you're stressed?"
        ],
        follow: ["What is comfort food in your country?", "Do families in your country eat together?", "Have your eating habits changed since moving?"],
        note: "Bring out the cultural and emotional side of food, not only health."
      },
      {
        type: "sort", title: "Food words", minutes: 8,
        intro: "Put each word in the right group.",
        groups: {
          "Nutrients": ["protein", "carbohydrate", "fibre"],
          "Vitamins and minerals": ["vitamin C", "iron", "zinc"],
          "Feelings": ["sluggish", "energetic", "irritable"],
          "Ways of eating": ["snacking", "grazing", "comfort eating"]
        },
        tip: "fibre is spelt fibre in British English and fiber in American English. Hangry (hungry + angry) is a popular informal word.",
        challenge: "Name a food that is rich in each nutrient, vitamin or mineral.",
        note: "Teach the stress: CARbohydrate, PROtein, IRritable, eNERgetic. Grazing = eating small amounts all day."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Your gut and your mood",
        intro: "Read the article and answer the questions.",
        text: [
          "Most of us know that food affects our bodies, but scientists are discovering that it also has a much bigger effect on our minds than we thought. Around 90% of serotonin, a chemical that helps control mood, is made in the gut.",
          "Studies suggest that people who eat plenty of vegetables, beans and fish feel slightly calmer and less anxious than people who eat a lot of sugar and processed food. Sugar gives us quick energy, but the higher it rises, the harder it falls, which can leave us sluggish and irritable.",
          "But food isn't only chemistry. A meal shared with friends or a dish from our childhood can make us feel far happier than the healthiest salad eaten alone at a desk. The more we see food as part of our social life, experts say, the better our relationship with it becomes."
        ],
        items: [
          ["Most serotonin is made in the brain.", false, "Around 90% is made in the gut."],
          ["Sugar can leave us feeling tired and irritable.", true, "…which can leave us sluggish and irritable."],
          ["The article says a healthy salad is always the best choice.", false, "A shared meal can make us feel far happier."],
          { q: "What kind of diet is linked to feeling calmer?", a: "Plenty of vegetables, beans and fish." },
          { q: "Why does sugar make us feel bad after a while?", a: "The higher our sugar rises, the harder it falls." },
          { q: "What improves our relationship with food, according to experts?", a: "Seeing food as part of our social life." }
        ],
        challenge: "Find three comparatives in the text that have a word in front of them (much bigger…).",
        note: "Challenge: much bigger, slightly calmer, far happier (also: the higher…, the harder…; the more…, the better…)."
      },
      {
        type: "grammar", title: "Comparatives", minutes: 12,
        rule: ["We can make a comparative stronger or weaker with a word in front: much / far / a lot (big difference), slightly / a bit / a little (small difference).", "The + comparative, the + comparative shows that two things change together."],
        head: ["", "Example", "Meaning"],
        table: [
          ["big difference", "Fish is much / far healthier than chips.", "a large difference"],
          ["small difference", "I feel slightly / a bit calmer today.", "a small difference"],
          ["not as … as", "Frozen fruit isn't as expensive as fresh.", "less"],
          ["the …, the …", "The more sugar you eat, the more you want.", "two things change together"]
        ],
        intro: "Complete the sentences.",
        items: [
          { text: "Home cooking is {} cheaper than eating out. It's half the price!", answers: [["much", "far", "a lot"]] },
          { text: "This bread is {} sweeter than the other one, but only a little.", answers: [["slightly", "a bit", "a little"]] },
          { text: "The more vegetables I eat, the {} I feel.", hint: "good", answers: [["better"]] },
          { text: "The {} you sleep, the hungrier you get.", hint: "little", answers: [["less"]] },
          { text: "Tea isn't {} strong {} coffee.", answers: [["as"], ["as"]] },
          { text: "Her new diet makes her feel far {}.", hint: "energetic", answers: [["more energetic"]] }
        ],
        challenge: "Make three the …, the … sentences about food, sleep or exercise.",
        note: "Not: very healthier or more better. Remind the learner that very goes with adjectives, much with comparatives."
      },
      {
        type: "choose", title: "Choose the answer", minutes: 5,
        intro: "Choose the best answer.",
        items: [
          ["Salmon is ___ healthier than sausages.", ["very", "much", "more"], 1],
          ["The longer you cook it, ___ it gets.", ["the softer", "softer", "the more soft"], 0],
          ["This café is ___ busier than usual. Only a few more people.", ["far", "slightly", "a lot"], 1],
          ["I'm not ___ hungry as I was.", ["so", "such", "more"], 0],
          ["Fresh juice is ___ than fizzy drinks.", ["more better", "a lot better", "very better"], 1],
          ["The ___ I eat late, the worse I sleep.", ["more", "most", "much"], 0]
        ],
        note: "Item 4: not so … as is also correct, a little more formal."
      },
      {
        type: "roleplay", title: "Speaking: plan a menu", minutes: 11,
        intro: "Together, plan a day of meals for a busy person who is always tired. Agree on each meal, then swap roles for a second person.",
        cards: [
          { who: "Nutrition coach", task: "Suggest healthy changes and explain why.", phrases: ["It would be much better to…", "The more…, the more…", "How about swapping… for…?", "That's slightly healthier, but…"] },
          { who: "Busy client", task: "Explain your habits and what you can realistically change.", phrases: ["I usually grab… on the way to work.", "I'm far too busy to…", "I'd rather… because…", "I could try…"] }
        ],
        info: ["Breakfast: coffee only", "Lunch: a sandwich at the desk", "Afternoon: biscuits and energy drinks", "Dinner: a takeaway at 10 pm"],
        game: { title: "Cool-down: food memories", how: "Each person describes a meal they'll never forget: where, who with, and how it made them feel. The other asks two questions." },
        note: "Encourage hedging and negotiation: That's a good idea, but… / Maybe if I…"
      },
      {
        type: "write", title: "Homework: an opinion paragraph", minutes: 8,
        task: "Write a paragraph: Is it more important to eat healthily or to enjoy your food? Give reasons and examples.",
        prompts: ["your opinion", "reason 1", "reason 2", "an example from your life", "a conclusion"],
        start: "In my opinion…",
        model: "In my opinion, enjoying food is slightly more important than eating perfectly. Firstly, the more stressed we are about food, the less we enjoy it. Secondly, meals are a far bigger part of family life than just fuel. For example, my grandmother's soup isn't very healthy, but it makes me much happier than any salad. In conclusion, balance is the key.",
        lines: 6,
        note: "Correct comparatives and linking words (Firstly, However, In conclusion)."
      }
    ],
    errors: ["very healthier / more better (much healthier, better)", "The more you eat, more you want. (the more…, the more…)", "less calories (fewer calories, in careful English)"],
    stretch: ["Should governments tax sugar? Why / why not?", "How does food connect people from different cultures?", "Describe how a traditional dish from your country is made."]
  },
  {
    id: "b2-ideas-at-work",
    level: "B2",
    title: "Ideas at work",
    topic: "Business English: brainstorming",
    focus: "making, accepting and rejecting suggestions",
    minutes: 60,
    aims: [
      "talk about how teams come up with ideas",
      "learn idioms about ideas and thinking",
      "read tips for a good brainstorming session",
      "make, accept and politely reject suggestions",
      "run a short brainstorming meeting"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: ideas", minutes: 6,
        intro: "Discuss the questions.",
        questions: [
          "Have you ever been in a brainstorming session? How did it go?",
          "Where do you get your best ideas: at a desk, in the shower, on a walk?",
          "Are you better at having ideas or at making them happen?"
        ],
        follow: ["What makes a meeting useful?", "Do people in your country say no directly at work?", "What's the best idea you've had at work?"],
        note: "If the learner doesn't work, use a club, a family or a community group as the team."
      },
      {
        type: "match", title: "Idioms about ideas", minutes: 9,
        intro: "Match the idioms (A–F) with their meanings (1–6).",
        pairs: [
          ["think outside the box", "think in a new, creative way"],
          ["blue-sky thinking", "ideas with no limits, not yet practical"],
          ["back to the drawing board", "start planning again because it failed"],
          ["on the same page", "agreeing and understanding each other"],
          ["food for thought", "something worth thinking about"],
          ["a ballpark figure", "a rough number, not exact"]
        ],
        challenge: "Use two idioms to describe a project you worked on.",
        note: "Ballpark comes from American English but is common in British offices too."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Five rules for a better brainstorm",
        intro: "Read the tips and answer the questions.",
        text: [
          "1. Start alone. People often have more ideas when they write them down quietly for five minutes before the group talks. 2. No idea is a bad idea. Judging ideas too early stops people from sharing; there is plenty of time to choose later.",
          "3. Go for numbers. Aim for fifty ideas, not five. The first ideas are usually the obvious ones, and the creative ones come later. 4. Build on each other. Instead of saying \"Yes, but…\", try \"Yes, and…\" to develop a colleague's idea.",
          "5. Finish with a plan. Before the meeting ends, choose the three best ideas and agree who will do what. Without this step, even brilliant ideas are forgotten by Friday."
        ],
        items: [
          ["The article suggests everyone talks together from the start.", false, "Start alone, writing ideas quietly first."],
          ["The first ideas are usually the most creative.", false, "The first ideas are usually the obvious ones."],
          ["You should agree on actions before the meeting ends.", true, "Finish with a plan."],
          { q: "Why shouldn't you judge ideas early?", a: "It stops people from sharing ideas." },
          { q: "What is the difference between \"Yes, but…\" and \"Yes, and…\"?", a: "Yes, but stops an idea; yes, and develops it further." },
          { q: "What happens to ideas without a plan?", a: "They are forgotten (by Friday)." }
        ],
        challenge: "Which rule would help your team most? Why?",
        note: "Ask the learner to rank the five rules from most to least useful and explain."
      },
      {
        type: "grammar", title: "Making suggestions", minutes: 12,
        rule: ["Each way of making a suggestion is followed by a different verb form. Learn them as patterns."],
        head: ["Pattern", "Verb form", "Example"],
        table: [
          ["How about / What about…?", "-ing", "How about asking the customers?"],
          ["Why don't we…? / Let's…", "base verb", "Why don't we try a survey?"],
          ["I suggest (that) we… / We could…", "base verb", "I suggest we start with a budget."],
          ["What if we…?", "past simple", "What if we moved the launch to June?"]
        ],
        intro: "Complete the suggestions with the right form of the verb.",
        items: [
          { text: "How about {} a free trial?", hint: "offer", answers: [["offering"]] },
          { text: "Why don't we {} the meeting to Friday?", hint: "move", answers: [["move"]] },
          { text: "What if we {} prices for students?", hint: "lower", answers: [["lowered"]] },
          { text: "I suggest we {} a ballpark figure first.", hint: "agree on", answers: [["agree on"]] },
          { text: "Let's {} for fifty ideas!", hint: "aim", answers: [["aim"]] },
          { text: "What about {} the sales team?", hint: "ask", answers: [["asking"]] }
        ],
        challenge: "Practise three polite ways to say no: That's interesting, but… / I'm not sure that would work because… / Could we look at… instead?",
        note: "Common error: I suggest to do. Also: How about we…? is fine in informal speech."
      },
      {
        type: "fix", title: "Correct the mistakes", minutes: 5,
        intro: "Each suggestion has one mistake. Write it correctly.",
        items: [
          ["How about to ask the team?", ["How about asking the team?"]],
          ["I suggest to start with the budget.", ["I suggest starting with the budget.", "I suggest we start with the budget.", "I suggest that we start with the budget."]],
          ["Why we don't try something new?", ["Why don't we try something new?"]],
          ["What if we change the name? It might help.", ["What if we changed the name? It might help."]],
          ["Let's to think outside the box.", ["Let's think outside the box."]]
        ],
        note: "Item 4: What if we change… is heard in speech, but What if we changed… is the more tentative, polite form."
      },
      {
        type: "roleplay", title: "Role-play: the meeting", minutes: 10,
        intro: "Your small café is losing customers. Brainstorm ideas, then choose the best three. Then swap roles.",
        cards: [
          { who: "Manager", task: "Run the meeting. Ask for ideas, build on them, and finish with a plan.", phrases: ["Let's start with five minutes of blue-sky thinking.", "Yes, and we could also…", "Are we on the same page?", "So who's going to…?"] },
          { who: "Team member", task: "Suggest at least four ideas and react to the manager's.", phrases: ["How about…?", "What if we…?", "That's food for thought, but…", "I'm not sure that would work because…"] }
        ],
        info: ["Customers down 30% since a chain café opened", "Budget for changes: £2,000", "Strengths: good cakes, friendly staff", "Weakness: slow Wi-Fi, no seats outside"],
        game: { title: "Cool-down: yes, and…", how: "Build a silly idea together. One person suggests something; the other must start with Yes, and… Keep going for two minutes." },
        note: "At the end, ask the learner to summarise the plan in three sentences."
      },
      {
        type: "write", title: "Homework: meeting summary", minutes: 8,
        task: "Write a short email to your team summarising the meeting: the problem, the three ideas you chose, and the next steps.",
        prompts: ["the problem", "idea 1", "idea 2", "idea 3", "who does what", "the next meeting"],
        start: "Hi all, thanks for a great meeting today…",
        model: "Hi all, thanks for a great meeting today. As we discussed, we've lost about 30% of our customers since the new chain café opened. We agreed on three ideas: offering a loyalty card, putting two tables outside, and upgrading the Wi-Fi. Maria will get a ballpark figure for the tables by Friday. Let's meet again next Tuesday to check our progress. Best, Tom",
        lines: 6,
        note: "Look for a clear structure and a polite, friendly business tone."
      }
    ],
    errors: ["I suggest to… / How about to… (-ing or that we + verb)", "Why we don't…? (Why don't we…?)", "Too direct: No, that's bad. (That's interesting, but…)"],
    stretch: ["Is brainstorming in a group better than thinking alone?", "How do you disagree with a manager politely in your culture?", "Pitch your own business idea in one minute."]
  }
);
