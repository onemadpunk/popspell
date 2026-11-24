/* Adult English · A2 (Elementary). See english-lessons.js for the format. */
(window.PopEnglishLessons = window.PopEnglishLessons || []).push(
  {
    id: "a2-planning-a-trip",
    level: "A2",
    title: "Planning a trip",
    topic: "Travel",
    focus: "future forms: going to, will and the present continuous",
    minutes: 60,
    aims: [
      "talk about your dream trip",
      "learn travel words for transport, places to stay, activities and planning",
      "read about someone's travel plans",
      "use going to, will and the present continuous to talk about the future",
      "plan a trip with a travel agent"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: dream trip", minutes: 5,
        intro: "Quick chat. Talk about these questions.",
        questions: [
          "If you could go anywhere in the world next week, where would you go? Why?",
          "Who would you take with you?",
          "What would you do there?"
        ],
        write: "My dream trip:",
        follow: ["Where did you go on your last trip?", "Do you like to plan everything, or decide on the day?", "Train or plane? Why?"],
        note: "Keep it light. Note useful words the learner reaches for, and come back to them in step 2."
      },
      {
        type: "sort", title: "Travel words", minutes: 8,
        intro: "Match the travel words to the right group.",
        groups: {
          "Transport": ["flight", "ferry", "coach", "underground"],
          "Places to stay": ["hotel", "hostel", "campsite", "guesthouse"],
          "Activities": ["sightseeing", "hiking", "shopping", "swimming"],
          "Planning": ["itinerary", "map", "timetable", "budget"]
        },
        tip: "a coach is a long-distance bus, the underground is the train under a city (American English: subway), and a holiday is a trip away (American English: vacation).",
        challenge: "Add two more words to each group.",
        note: "For the challenge, accept anything sensible (taxi, tram, B&B, Airbnb, museum, guidebook). Check the stress: HOStel, TIMEtable, SIGHTseeing, iTINerary."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Ana's weekend in Edinburgh",
        intro: "Read the text and answer the questions.",
        text: [
          "Ana is from Lisbon, but she lives in Glasgow now and works in a café. Next month she has three days off, so she is going to visit Edinburgh with her friend Tomás. They booked their train tickets online a month in advance, because tickets are cheaper if you book early. The journey is only fifty minutes.",
          "They aren't going to stay in a hotel, because hotels in the city centre are expensive. They are staying in a small hostel near the castle. Ana has organised the first day: they are going to walk up the Royal Mile and visit the castle. Tomás has planned the second day. They are meeting his cousin for lunch at one o'clock, and then they want to climb Arthur's Seat, a big hill in the middle of the city.",
          "Tomás checked the weather forecast. It is going to be cold and windy, so they will pack warm jackets. \"Maybe we'll visit a museum on the last day,\" says Ana. \"Most of them are free!\""
        ],
        items: [
          ["Ana lives in Edinburgh.", false, "She lives in Glasgow."],
          ["They are going to travel by train.", true, "They booked train tickets."],
          ["They are staying in a hotel near the castle.", false, "They are staying in a hostel."],
          { q: "Why did they book their tickets early?", a: "Because tickets are cheaper if you book early." },
          { q: "Who are they meeting on the second day?", a: "Tomás's cousin." },
          { q: "Why will they pack warm jackets?", a: "Because it is going to be cold and windy." }
        ],
        challenge: "Find three words in the text that mean plan or organise something.",
        note: "Let the learner read silently first. Challenge answers: booked, organised, planned. Then ask: which plans are fixed, and which are only maybe?"
      },
      {
        type: "grammar", title: "Future forms", minutes: 12,
        rule: "There are three common ways to talk about the future.",
        head: ["Form", "We use it for…", "Example"],
        table: [
          ["going to", "plans we made before speaking", "We're going to visit the castle."],
          ["will ('ll)", "decisions we make now, and with maybe or I think", "It's cold. I think I'll take a jacket."],
          ["present continuous", "fixed arrangements with a time or other people", "We're meeting his cousin at one o'clock."]
        ],
        intro: "Fill in the gaps with the right future form of the verb.",
        items: [
          { text: "We {} the castle on Saturday. It's our plan.", hint: "visit", answers: [["are going to visit", "'re going to visit"]] },
          { text: "It's cold. I think I {} a jumper.", hint: "take", answers: [["will take", "'ll take"]] },
          { text: "We {} at 8 o'clock tomorrow. The tickets are booked.", hint: "leave", answers: [["are leaving", "'re leaving", "are going to leave", "'re going to leave"]] },
          { text: "Maybe I {} some local food.", hint: "try", answers: [["will try", "'ll try"]] },
          { text: "They {} Tomás's cousin at one o'clock.", hint: "meet", answers: [["are meeting", "'re meeting", "are going to meet", "'re going to meet"]] },
          { text: "She {} a lot of photos. She has already bought a new camera.", hint: "take", answers: [["is going to take", "'s going to take"]] }
        ],
        challenge: "Write one sentence about your next trip with each future form.",
        note: "Drill the short forms aloud (we're going to, I'll, we're meeting). The present continuous and going to are both fine for 3 and 5; accept either."
      },
      {
        type: "jumble", title: "Spelling: word jumble", minutes: 5,
        intro: "Unscramble the travel words.",
        words: ["hotel", "flight", "airport", "luggage", "passport", "itinerary"],
        challenge: "Use each word in a sentence about a trip.",
        note: "Watch the double letters (luggage, passport) and the vowels in itinerary (i-t-i-n-e-r-a-r-y)."
      },
      {
        type: "roleplay", title: "Role-play: travel agent", minutes: 12,
        intro: "One of you is a travel agent and one is a customer. Then swap roles.",
        cards: [
          { who: "Travel agent", task: "Ask about the customer's destination, budget and interests. Offer three activities and two places to stay.", phrases: ["Where would you like to go?", "What's your budget?", "What do you like doing on holiday?", "How about…? / You could…", "There's a hotel… or a hostel…"] },
          { who: "Customer", task: "Answer the questions. Choose one place to stay and two activities, and explain why.", phrases: ["I'd like to go to…", "My budget is about £…", "I think I'll take the… because…", "That sounds great / too expensive."] }
        ],
        info: ["A city break: 3 nights", "Budget: about £400", "You like museums and food", "You don't like early mornings"],
        game: { title: "Cool-down: two truths and a lie", how: "Say three sentences about a trip (real or imaginary). Two are true and one is false. Your partner guesses the lie." },
        note: "Play the travel agent first so the learner hears the questions, then swap. In the cool-down, ask a follow-up question about each sentence before guessing."
      },
      {
        type: "write", title: "Homework: plan a trip", minutes: 8,
        task: "Plan a three-day trip to a city of your choice. Use will, going to and the present continuous.",
        prompts: ["Destination", "Dates", "Transport", "Where you're staying", "Day 1", "Day 2", "Day 3"],
        start: "In March I'm going to visit…",
        model: "In March I'm going to visit Dublin for three days. I'm flying from Glasgow on Friday morning. I'm staying at a small guesthouse near the river. On day 1 I'm going to walk around the old town. On day 2 I'm meeting a friend for lunch. On day 3 I think I'll visit a museum, and maybe I'll buy some presents.",
        lines: 6,
        note: "Start it in the lesson and finish it as homework. Correct only the future forms and the travel words, so the feedback stays focused."
      }
    ],
    errors: ["I going to… (missing am / is / are)", "I will to go… or I'm going to visiting… (the verb after will and going to is the base form)", "Using will for a plan already made: Next week I will visit my sister. (better: I'm going to visit / I'm visiting)"],
    stretch: ["What will you do if your flight is cancelled?", "Tell me about a trip that went wrong.", "What's the difference? I'm visiting Rome on Friday. / I'm going to visit Rome one day."]
  },
  {
    id: "a2-last-weekend",
    level: "A2",
    title: "What did you do last weekend?",
    topic: "Free time",
    focus: "past simple: regular and irregular verbs, questions",
    minutes: 60,
    aims: [
      "talk about what you did last weekend",
      "learn words for free-time activities",
      "read a message about a weekend",
      "use the past simple in sentences and questions",
      "ask a partner about their weekend"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: the weekend", minutes: 5,
        intro: "Talk about these questions.",
        questions: ["What do you usually do at the weekend?", "Was last weekend busy or quiet?", "What is your perfect weekend?"],
        write: "Last weekend I",
        follow: ["Did you see your family?", "Did you go out on Saturday night?", "What did you eat on Sunday?"],
        note: "Don't correct the past tense yet. Note the verbs the learner tries, and return to them in step 4."
      },
      {
        type: "sort", title: "Free-time words", minutes: 8,
        intro: "Which verb goes with each phrase? Put the phrases in the right group.",
        groups: {
          "go…": ["swimming", "for a walk", "to the cinema"],
          "have…": ["a party", "a barbecue", "a lie-in"],
          "play…": ["football", "cards", "the guitar"],
          "do…": ["yoga", "the housework", "some gardening"]
        },
        tip: "a lie-in is when you stay in bed late in the morning, usually at the weekend.",
        challenge: "Add one more phrase to each group.",
        note: "Point out the pattern: go + -ing (go swimming) but go to + a place (go to the cinema)."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "A message from Kasia",
        intro: "Read Kasia's message to her friend and answer the questions.",
        text: [
          "Hi Joanna! How was your weekend? Mine was great. On Saturday morning I had a lie-in, and then I went swimming with my sister. In the afternoon we visited our cousins and had a barbecue in their garden. The weather was lovely!",
          "On Saturday night I watched a film at home. I wanted to go to the cinema, but I was too tired. On Sunday I did the housework and cooked a big lunch for my parents. My dad didn't like the fish, but he loved the cake!",
          "What did you do? Did you go to the concert? Let's meet for coffee this week. Kasia"
        ],
        items: [
          ["Kasia went swimming on Saturday morning.", true, "She had a lie-in, then went swimming."],
          ["She went to the cinema on Saturday night.", false, "She watched a film at home."],
          ["The weather was bad.", false, "The weather was lovely."],
          { q: "Who did she visit on Saturday afternoon?", a: "Her cousins." },
          { q: "What did she do on Sunday?", a: "She did the housework and cooked lunch for her parents." },
          { q: "What did her dad love?", a: "The cake." }
        ],
        challenge: "Find six past simple verbs in the text. Which are regular (-ed) and which are irregular?",
        note: "Regular: visited, watched, wanted, cooked, loved. Irregular: had, went, was, did."
      },
      {
        type: "grammar", title: "Past simple", minutes: 12,
        rule: ["Regular verbs add -ed: watch → watched, visit → visited. Many common verbs are irregular: go → went, have → had, do → did.", "In questions and negatives we use did / didn't + the base verb."],
        table: [
          ["all people", "I watched TV. She went out.", "I didn't watch TV. She didn't go out.", "Did you watch TV? Did she go out?"],
          ["be", "I was / we were tired.", "It wasn't / they weren't busy.", "Was it good? Were they there?"]
        ],
        examples: ["Short answers: Yes, I did. / No, I didn't."],
        intro: "Write the verb in the past simple.",
        items: [
          { text: "On Saturday we {} to the beach.", hint: "go", answers: [["went"]] },
          { text: "I {} my grandmother on Sunday.", hint: "visit", answers: [["visited"]] },
          { text: "{} you {} a good weekend?", hint: "have", answers: [["did"], ["have"]] },
          { text: "She {} the film. It was boring.", hint: "not like", answers: [["didn't like", "did not like"]] },
          { text: "We {} very tired after the party.", hint: "be", answers: [["were"]] },
          { text: "What {} you {} on Friday night?", hint: "do", answers: [["did"], ["do"]] }
        ],
        challenge: "Write three questions to ask your teacher about their weekend.",
        note: "Common mistakes: Did you went…? and I didn't went… After did, the verb goes back to the base form."
      },
      {
        type: "choose", title: "Choose the answer", minutes: 5,
        intro: "Choose the right word.",
        items: [
          ["Yesterday I ___ a new phone.", ["buy", "bought", "buyed"], 1],
          ["___ you see the match on Saturday?", ["Did", "Do", "Were"], 0],
          ["We didn't ___ anything on Sunday.", ["did", "do", "done"], 1],
          ["The party ___ really good!", ["was", "were", "did"], 0],
          ["Where ___ you go last summer?", ["did", "were", "was"], 0],
          ["She ___ her keys at the shop.", ["leaved", "left", "leave"], 1]
        ],
        note: "Ask the learner to say the base form of each irregular verb: bought → buy, left → leave."
      },
      {
        type: "roleplay", title: "Speaking: your weekend", minutes: 12,
        intro: "Ask your partner about their weekend. Then swap roles.",
        cards: [
          { who: "Ask", task: "Ask at least five questions, and one more question about each answer.", phrases: ["What did you do on Saturday?", "Did you go out?", "Who did you see?", "What did you eat?", "Was it fun?"] },
          { who: "Answer", task: "Answer about your real weekend, or use this weekend.", phrases: ["On Saturday I…", "Yes, I did. / No, I didn't.", "It was great / boring / tiring.", "And you? What did you do?"] }
        ],
        info: ["Saturday: a 10 km run, then pizza with friends", "Saturday night: a concert", "Sunday: a lie-in, then a family lunch", "Feeling: tired but happy"],
        game: { title: "Cool-down: true or false?", how: "Say three sentences about last week. One is false. Your partner asks a question about each one and then guesses the false one." },
        note: "Push for follow-up questions: Who did you go with? Where did you eat? This keeps the conversation going."
      },
      {
        type: "write", title: "Homework: a message", minutes: 8,
        task: "Write a message to a friend about your weekend. Ask them two questions about theirs.",
        prompts: ["Saturday", "Sunday", "who you were with", "how it was", "two questions"],
        start: "Hi! How was your weekend? Mine was…",
        model: "Hi Marco! How was your weekend? Mine was quiet. On Saturday I went for a walk by the river and I bought some flowers at the market. In the evening I cooked dinner for my neighbour. On Sunday I had a lie-in and watched a film. What did you do? Did you go to the party?",
        lines: 6,
        count: "did",
        note: "Correct the past simple forms and question word order (What did you do?)."
      }
    ],
    errors: ["Did you went…? / I didn't saw… (base form after did)", "I goed / buyed (irregular verbs)", "Where you went? (missing did)"],
    stretch: ["Tell me about the best weekend you ever had.", "What did you do last weekend that you don't usually do?", "Compare: I watched TV. / I was watching TV when you called."]
  },
  {
    id: "a2-around-town",
    level: "A2",
    title: "Around town",
    topic: "Places in a town",
    focus: "prepositions of place and there is / there are",
    minutes: 60,
    aims: [
      "talk about your town or city",
      "learn words for places in a town",
      "read a description of a town centre",
      "use prepositions of place and there is / there are",
      "ask for and give directions"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: my town", minutes: 5,
        intro: "Talk about these questions.",
        questions: ["Do you live in a town, a city or a village?", "What is your favourite place near your home?", "What is missing from your area?"],
        write: "Near my home there is",
        follow: ["How do you get to the shops?", "Is it quiet or noisy where you live?", "Where do you meet friends?"],
        note: "Note places the learner names, and check them against the words in step 2."
      },
      {
        type: "sort", title: "Places in town", minutes: 8,
        intro: "Where can you do these things? Put each place in the right group.",
        groups: {
          "Buy things": ["chemist", "bakery", "post office"],
          "Eat and drink": ["café", "pub", "takeaway"],
          "Get help": ["hospital", "police station", "bank"],
          "Have fun": ["cinema", "park", "leisure centre"]
        },
        tip: "a chemist sells medicine (American English: drugstore or pharmacy), and a takeaway sells hot food to eat at home.",
        challenge: "Add one more place to each group.",
        note: "Some places fit two groups (a post office is also somewhere to get help). Accept a good reason."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Welcome to Millbank",
        intro: "Read about the town centre. Are the sentences true or false?",
        text: [
          "Millbank is a small town by the sea. In the centre there is a market square with a big clock. On Saturdays there is a market in the square.",
          "The café is between the bank and the bakery. Opposite the café, there is a small park with a playground. The post office is next to the library, and the bus station is behind the library.",
          "There are two supermarkets, but there isn't a cinema. If you want to see a film, you can take the bus to the city. It takes about twenty minutes."
        ],
        items: [
          ["There is a market in the square on Saturdays.", true, "On Saturdays there is a market."],
          ["The café is next to the park.", false, "The café is between the bank and the bakery; the park is opposite."],
          ["The post office is next to the library.", true, "The post office is next to the library."],
          ["The bus station is in front of the library.", false, "It is behind the library."],
          ["There are two supermarkets.", true, "There are two supermarkets."],
          ["There is a cinema in Millbank.", false, "There isn't a cinema."]
        ],
        challenge: "Draw a simple map of the centre of Millbank from the text.",
        note: "Ask the learner to draw the map while you read the text aloud. It checks understanding without more questions."
      },
      {
        type: "grammar", title: "Prepositions and there is / are", minutes: 12,
        rule: ["Prepositions of place say where something is: next to, between, opposite, behind, in front of, near, on, in.", "Use there is with one thing and there are with more than one."],
        head: ["", "Positive (+)", "Negative (−)", "Question (?)"],
        table: [
          ["one", "There is ('s) a bank.", "There isn't a cinema.", "Is there a café?"],
          ["more", "There are two parks.", "There aren't any shops.", "Are there any buses?"]
        ],
        intro: "Look at the text in step 3. Fill in the gaps.",
        items: [
          { text: "The café is {} the bank and the bakery.", answers: [["between"]] },
          { text: "The bus station is {} the library.", answers: [["behind"]] },
          { text: "The park is {} the café.", answers: [["opposite"]] },
          { text: "{} a market on Saturdays.", answers: [["there is", "there's"]] },
          { text: "{} two supermarkets.", answers: [["there are"]] },
          { text: "{} a cinema in Millbank? No, there isn't.", answers: [["is there"]] }
        ],
        challenge: "Write three sentences about the street where you live.",
        note: "Say in town, in the park, on the corner, at the bus stop. Use your hands or objects on the desk to show next to, between and behind."
      },
      {
        type: "fix", title: "Correct the mistakes", minutes: 5,
        intro: "Each sentence has one mistake. Write it correctly.",
        items: [
          ["On my town there is a big park.", ["In my town there is a big park.", "In my town there's a big park."]],
          ["There are a bank next to the café.", ["There is a bank next to the café.", "There's a bank next to the café."]],
          ["The bakery is next the post office.", ["The bakery is next to the post office."]],
          ["Is there any shops near your house?", ["Are there any shops near your house?"]],
          ["The car is in front the hotel.", ["The car is in front of the hotel."]]
        ],
        note: "Ask the learner to explain each mistake before writing. Accept there's for there is."
      },
      {
        type: "roleplay", title: "Speaking: directions", minutes: 12,
        intro: "Use the map of Millbank you drew. Ask for and give directions. Then swap roles.",
        cards: [
          { who: "Visitor", task: "You are at the bus station. Ask how to get to three places.", phrases: ["Excuse me, is there a… near here?", "How do I get to the…?", "Is it far?", "Thank you very much!"] },
          { who: "Local person", task: "Give directions with the phrases below.", phrases: ["Go straight on.", "Turn left / right at the…", "It's on your left / right.", "It's next to / opposite the…"] }
        ],
        info: ["Places to find: the café, the post office, the park", "The bus station is behind the library", "It's a five-minute walk to the square"],
        game: { title: "Cool-down: where am I?", how: "Describe where you are in your home without saying the room: I'm next to the window. There's a sofa behind me. Your partner guesses the room." },
        note: "If the learner didn't draw the map, sketch it quickly and share it."
      },
      {
        type: "write", title: "Homework: my area", minutes: 8,
        task: "Write about the area where you live. Use there is / there are and prepositions.",
        prompts: ["shops", "places to eat", "transport", "parks", "what is missing", "your favourite place"],
        start: "I live in…",
        model: "I live in a quiet street near the centre of Leith. There is a small shop on the corner, and there are two cafés opposite my flat. The bus stop is in front of the library. There isn't a cinema near me, but there is a big park behind my building. My favourite place is the café next to the river.",
        lines: 6,
        note: "Correct prepositions and there is / are. Praise any new place words from step 2."
      }
    ],
    errors: ["There is two banks. (there are)", "next the / in front the (next to, in front of)", "on the town / in the corner (in the town, on the corner)"],
    stretch: ["Describe how your town has changed in the last ten years.", "What would you add to your town if you could?", "Give directions from your home to your favourite café."]
  }
);
