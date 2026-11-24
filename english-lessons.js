/*
  ADULT ENGLISH: lessons for adults learning English, taught online by screen share or sent as a link.
  Shown by english.html (english.js draws them). Nothing is saved anywhere, so no sign-in is needed.

  Modelled on the kind of material Sara uses with her adult learners (CEFR-levelled lessons with a warm-up,
  a vocabulary task, a short reading, one grammar point, practice, speaking and a writing task, in British
  English, with a student copy and a teacher copy with answers). Every word here is PopSpell's own: no text is
  copied from any publisher.

    id        used in the link: english.html#<id>
    level     CEFR level: A1 | A2 | B1 | B2 | C1
    minutes   about how long the whole lesson takes
    aims      what the learner can do by the end (teacher copy)
    steps     in teaching order; each has type, title, minutes, a teacher note and its own fields:
      talk      questions to discuss; follow (follow-up questions for the teacher); write (a line to fill in)
      sort      groups: { name: [words] }; tip (a British/American English note)
      read      text (paragraphs); items: [statement, true|false, why]
      grammar   rule, table rows, notes; items: { text with {} for each gap, hint, answers: [[accepted…] per gap] }
      choose    items: [sentence with ___, [options], index of the right one]
      roleplay  cards: [{ who, task, phrases }], info (facts for one card)
      write     task, prompts, model (teacher copy), lines (print)
    errors    mistakes to listen for (teacher copy)
    stretch   extra questions for a stronger learner (teacher copy)
*/
window.PopEnglish = (() => {
  "use strict";
  const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
  const LEVEL_NAMES = { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper intermediate", C1: "Advanced" };

  const lessons = [
    {
      id: "a2-planning-a-trip",
      level: "A2",
      title: "Planning a trip",
      topic: "Travel",
      focus: "going to for plans",
      minutes: 60,
      aims: [
        "talk about trips they have taken and would like to take",
        "use travel words for transport, places to stay and things to do",
        "understand a short text about someone's travel plans",
        "use going to + verb to talk about plans (positive, negative and questions)",
        "book a room at a hostel or hotel desk"
      ],
      steps: [
        {
          type: "talk", title: "Warm-up", minutes: 5,
          intro: "Talk about these questions.",
          questions: [
            "Where did you go on your last trip? Who did you go with?",
            "Do you like to plan everything, or do you decide on the day?",
            "If you could go anywhere next month, where would you go? Why?"
          ],
          write: "My dream trip:",
          follow: ["What do you always take with you?", "Train or plane? Why?", "What was the best trip you ever had?"],
          note: "Keep it light. Note useful words the learner reaches for, and come back to them in step 2."
        },
        {
          type: "sort", title: "Travel words", minutes: 8,
          intro: "Put each word in the right group.",
          groups: {
            "Getting there": ["flight", "ferry", "coach"],
            "Places to stay": ["hotel", "hostel", "campsite"],
            "Things to do": ["sightseeing", "hiking", "shopping"],
            "Planning": ["ticket", "timetable", "budget"]
          },
          tip: "In British English a coach is a long-distance bus, and a holiday is a trip away (American English: vacation).",
          note: "Ask for one more word in each group, e.g. taxi, guesthouse, swimming, map. Check the stress: HOStel, TIMEtable, SIGHTseeing."
        },
        {
          type: "read", title: "Reading", minutes: 10,
          heading: "Ana's weekend in Edinburgh",
          intro: "Read the text. Are the sentences true or false?",
          text: [
            "Ana is from Lisbon, but she lives in Glasgow now and works in a café. Next month she has three days off, so she is going to visit Edinburgh with her friend Tomás.",
            "They are going to take the train, because it is quick and cheap if you book early. The journey is only fifty minutes. They are not going to stay in a hotel, because hotels in the city centre are expensive. They are going to stay in a hostel near the castle.",
            "On the first day, they are going to walk up the Royal Mile and visit the castle. On the second day, Tomás wants to climb Arthur's Seat, a big hill in the middle of the city, and Ana is going to take her camera. On the last day, they are going to visit a museum, because it is free. Their budget is £150 each."
          ],
          items: [
            ["Ana lives in Edinburgh.", false, "She lives in Glasgow."],
            ["They are going to travel by train.", true, "They are going to take the train."],
            ["The train journey takes more than an hour.", false, "It is only fifty minutes."],
            ["They are going to stay in a hotel near the castle.", false, "They are going to stay in a hostel."],
            ["Tomás wants to climb a hill.", true, "Arthur's Seat is a big hill."],
            ["The museum is expensive.", false, "It is free."]
          ],
          note: "Let the learner read silently first. Then ask: why are they not staying in a hotel? Find three plans with going to in the text."
        },
        {
          type: "grammar", title: "going to", minutes: 12,
          rule: "We use going to + verb for plans we have already made, and for things we can see are going to happen.",
          table: [
            ["I", "am ('m) going to", "am not going to", "Am I going to…?"],
            ["you / we / they", "are ('re) going to", "aren't going to", "Are you going to…?"],
            ["he / she / it", "is ('s) going to", "isn't going to", "Is she going to…?"]
          ],
          examples: ["They're going to take the train.", "Look at those clouds. It's going to rain."],
          intro: "Write the right form of going to and the verb in brackets.",
          items: [
            { text: "We {} the train to Edinburgh.", hint: "take", answers: [["are going to take", "'re going to take"]] },
            { text: "Ana {} in a hotel.", hint: "not / stay", answers: [["isn't going to stay", "is not going to stay", "'s not going to stay"]] },
            { text: "{} Tomás {} Arthur's Seat?", hint: "climb", answers: [["is"], ["going to climb"]] },
            { text: "I {} the tickets tonight.", hint: "book", answers: [["am going to book", "'m going to book"]] },
            { text: "They {} a museum on Sunday.", hint: "visit", answers: [["are going to visit", "'re going to visit"]] },
            { text: "Look at those dark clouds! It {}.", hint: "rain", answers: [["is going to rain", "'s going to rain"]] }
          ],
          note: "Drill the short forms aloud (I'm going to, she isn't going to). Point out that going to is followed by the base verb: going to take, not going to taking."
        },
        {
          type: "choose", title: "Choose the answer", minutes: 6,
          intro: "Choose the right word.",
          items: [
            ["Where ___ you going to stay?", ["is", "are", "do"], 1],
            ["She ___ going to fly. She hates planes.", ["isn't", "aren't", "doesn't"], 0],
            ["We're going to ___ a car for the weekend.", ["hire", "hiring", "hired"], 0],
            ["How long ___ the journey?", ["is", "are", "does"], 0],
            ["I'd like to book a ___ for two nights.", ["room", "ticket", "flight"], 0],
            ["What time does the train ___?", ["leave", "leaves", "leaving"], 0]
          ],
          note: "Ask why for each answer. Item 3: hire a car is British English; American English says rent a car."
        },
        {
          type: "roleplay", title: "At the hostel desk", minutes: 10,
          intro: "Practise booking a room. Then swap roles.",
          cards: [
            { who: "Guest", task: "You want a private room for you and a friend.", phrases: ["I'd like to book a room for … nights.", "How much is it per night?", "Is breakfast included?", "What time is check-out?"] },
            { who: "Receptionist", task: "Use the information below to answer.", phrases: ["How many nights would you like?", "It's £… per night.", "Breakfast is extra. It's £… each.", "Check-out is at …"] }
          ],
          info: ["Bed in a shared room: £28 a night", "Private room for two: £65 a night", "Breakfast: £6 each, 7 to 10 am", "Check-out: 11 am"],
          note: "Play the receptionist first so the learner hears the phrases, then swap. Online, the learner can read their card from the screen."
        },
        {
          type: "write", title: "My plan", minutes: 9,
          task: "Write five sentences about a trip you are going to take. Use going to.",
          prompts: ["Where?", "When?", "Who with?", "How will you travel?", "Where will you stay?", "What will you do?"],
          model: "In July I'm going to visit my sister in Dublin. We're going to fly from Glasgow because it's quick. I'm going to stay at her flat. We're going to walk by the sea and visit a museum. We aren't going to spend a lot of money.",
          lines: 5,
          note: "This can be homework. Correct only going to and the travel words, so the feedback stays focused."
        }
      ],
      errors: ["I going to… (missing am / is / are)", "I am go to… or I'm going to visiting… (the verb after going to is the base form)", "Are you going travel…? (missing to)"],
      stretch: ["What are you going to do if it rains?", "Tell me about a plan that went wrong.", "Compare: I'm going to visit Rome. / I'm visiting Rome on Friday."]
    }
  ];

  // Accepting a typed answer: case, curly apostrophes, spaces and a final full stop don't matter
  const tidy = s => String(s || "").toLowerCase().replace(/[‘’`]/g, "'").replace(/\s+/g, " ").replace(/\s+'/g, "'").trim().replace(/[.!?]+$/, "");
  const accepts = (answers, typed) => answers.some(a => tidy(a) === tidy(typed));

  return {
    LEVELS, LEVEL_NAMES,
    all: () => lessons.slice(),
    get: id => lessons.find(l => l.id === id) || null,
    tidy, accepts
  };
})();
