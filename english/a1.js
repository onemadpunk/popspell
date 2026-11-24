/* Adult English · A1 (Beginner). See english-lessons.js for the format. */
(window.PopEnglishLessons = window.PopEnglishLessons || []).push(
  {
    id: "a1-all-about-me",
    level: "A1",
    title: "All about me",
    topic: "People and introductions",
    focus: "the verb be: am, is, are",
    minutes: 60,
    aims: [
      "say hello and introduce yourself",
      "learn words for countries, jobs and family",
      "read a short introduction",
      "use am, is and are",
      "ask and answer questions about yourself"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: hello!", minutes: 5,
        intro: "Answer the questions.",
        questions: ["What's your name?", "Where are you from?", "Where do you live now?"],
        write: "My name is",
        follow: ["How do you spell your name?", "Is your city big or small?", "What languages do you speak?"],
        note: "Model the answers first (My name's Sara. I'm from Scotland.). Ask the learner to spell their name to check the alphabet."
      },
      {
        type: "sort", title: "Words about me", minutes: 8,
        intro: "Put each word in the right group.",
        groups: {
          "Countries": ["Spain", "Poland", "Brazil"],
          "Jobs": ["teacher", "nurse", "driver"],
          "Family": ["mother", "brother", "son"],
          "Numbers": ["twelve", "twenty", "thirty"]
        },
        tip: "we say Mr (a man), Mrs (a married woman) or Ms (any woman) before a family name: Mr Smith, Ms Green.",
        tipLabel: "🇬🇧 In the UK",
        challenge: "Add one more word to each group.",
        note: "Say each word and let the learner repeat it. Check the stress: TEACHer, BROther, TWENty, thirTEEN or THIRty."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Hello, I'm Marta",
        intro: "Read the text. Are the sentences true or false?",
        text: [
          "Hello! My name is Marta. I'm thirty-four years old and I'm from Poland. Now I live in Aberdeen, in Scotland.",
          "I'm a nurse. My job is busy but I like it. My husband is Tomasz. He's a driver. We have two children. Our son is ten and our daughter is six. They are at school here.",
          "Aberdeen is a beautiful city, but it is very cold in winter! My English isn't very good yet, but I'm learning every week."
        ],
        items: [
          ["Marta is from Poland.", true, "I'm from Poland."],
          ["She lives in Glasgow.", false, "She lives in Aberdeen."],
          ["Marta is a teacher.", false, "She's a nurse."],
          ["Her husband is a driver.", true, "He's a driver."],
          ["They have three children.", false, "They have two children."],
          ["Aberdeen is cold in winter.", true, "It is very cold in winter."]
        ],
        challenge: "Find all the examples of am, is and are ('m, 's, 're) in the text.",
        note: "Read the text aloud first, then let the learner read. Ask: How old is Marta? How old is her son?"
      },
      {
        type: "grammar", title: "am, is, are", minutes: 12,
        rule: "We use the verb be to talk about names, ages, countries and jobs.",
        table: [
          ["I", "am ('m)", "am not ('m not)", "Am I…?"],
          ["you / we / they", "are ('re)", "aren't", "Are you…?"],
          ["he / she / it", "is ('s)", "isn't", "Is she…?"]
        ],
        examples: ["I'm from Spain.", "She isn't a teacher.", "Are you married?"],
        intro: "Write am, is or are.",
        items: [
          { text: "I {} a teacher.", answers: [["am"]] },
          { text: "My brother {} twenty-five.", answers: [["is"]] },
          { text: "We {} from Brazil.", answers: [["are"]] },
          { text: "{} you a nurse?", answers: [["are"]] },
          { text: "They {} at school today.", answers: [["are"]] },
          { text: "My city {} big and beautiful.", answers: [["is"]] }
        ],
        challenge: "Write three sentences about you with I'm and one with I'm not.",
        note: "Practise the short forms aloud: I'm, you're, she's. Then ask yes/no questions: Are you from Spain? No, I'm not."
      },
      {
        type: "jumble", title: "Spelling: word jumble", minutes: 5,
        intro: "Unscramble the words.",
        words: ["name", "family", "brother", "teacher", "country", "married"],
        challenge: "Use each word in a sentence about you.",
        note: "Say each word after it is unscrambled. Watch the double letters in married and the -er ending in brother and teacher."
      },
      {
        type: "roleplay", title: "Speaking: nice to meet you", minutes: 12,
        intro: "Meet a new person. Ask and answer. Then swap roles.",
        cards: [
          { who: "New student", task: "Ask the questions. Answer with the information on card B.", phrases: ["Hi, I'm… What's your name?", "Where are you from?", "What's your job?", "Are you married?", "Nice to meet you!"] },
          { who: "Your new name", task: "Be this person. Answer the questions.", phrases: ["My name's…", "I'm from…", "I'm a…", "Yes, I am. / No, I'm not."] }
        ],
        info: ["Name: Ali Hassan", "From: Egypt", "Job: chef", "Age: 29", "Married: yes, two children"],
        game: { title: "Cool-down: who am I?", how: "Think of a famous person. Your partner asks yes/no questions (Are you a man? Are you from the USA? Are you a singer?) and guesses who you are." },
        note: "Play card A first so the learner hears the questions. Then the learner asks you. Finish with the game."
      },
      {
        type: "write", title: "Homework: about me", minutes: 8,
        task: "Write five or six sentences about you. Use I'm, my… is and I'm not.",
        prompts: ["Name", "Age", "Country", "City", "Job", "Family"],
        start: "Hello! My name is…",
        model: "Hello! My name is Carlos. I'm forty years old. I'm from Spain, but I live in Edinburgh now. I'm a chef in a hotel. I'm married and my wife is a teacher. I'm not very good at English, but I'm learning!",
        lines: 6,
        note: "Correct only am / is / are and capital letters for names and countries."
      }
    ],
    errors: ["I from Spain. (missing am)", "She are a teacher. / They is… (wrong form)", "Lower-case countries and names: spain, marta"],
    stretch: ["Tell me about your best friend.", "What is your favourite place in your city? Why?", "Ask me five questions about my family."]
  },
  {
    id: "a1-my-day",
    level: "A1",
    title: "My day",
    topic: "Daily routines",
    focus: "present simple and do / does",
    minutes: 60,
    aims: [
      "talk about your day from morning to night",
      "learn words for daily routines and times",
      "read about someone's day",
      "use the present simple with do and does",
      "ask a partner about their routine"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: my morning", minutes: 5,
        intro: "Talk about these questions.",
        questions: ["What time do you get up?", "What do you have for breakfast?", "Do you like mornings or evenings?"],
        write: "I get up at",
        follow: ["How do you go to work?", "What do you do at the weekend?", "Do you drink tea or coffee?"],
        note: "Show times on a clock or with numbers: seven o'clock, half past seven, quarter to eight."
      },
      {
        type: "sort", title: "Routine words", minutes: 8,
        intro: "Put each phrase in the right part of the day.",
        groups: {
          "Morning": ["get up", "have a shower", "have breakfast"],
          "Day": ["go to work", "have lunch", "do the shopping"],
          "Evening": ["cook dinner", "watch TV", "wash the dishes"],
          "Night": ["brush my teeth", "read a book", "go to bed"]
        },
        tip: "we say have breakfast, have lunch, have a shower (not take breakfast). Lunch is the meal in the middle of the day; dinner or tea is in the evening.",
        challenge: "Add one more thing you do in each part of the day.",
        note: "Some phrases can go in more than one group. If the learner explains a different choice well, accept it."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "Sam's day",
        intro: "Read the text. Are the sentences true or false?",
        text: [
          "Sam is a bus driver in Glasgow. He gets up at half past five every day. He has a shower and drinks a cup of tea, but he doesn't eat breakfast at home.",
          "He starts work at half past six. At eleven o'clock he has breakfast in a café near the bus station. He finishes work at three o'clock in the afternoon.",
          "In the evening, Sam cooks dinner with his wife, Leila. They watch TV or go for a walk. Sam goes to bed at half past nine. \"I'm always tired!\" he says."
        ],
        items: [
          ["Sam is a taxi driver.", false, "He is a bus driver."],
          ["He gets up at half past five.", true, "He gets up at half past five every day."],
          ["He eats breakfast at home.", false, "He doesn't eat breakfast at home."],
          ["He finishes work at three o'clock.", true, "He finishes at three o'clock in the afternoon."],
          ["Sam and Leila cook dinner together.", true, "Sam cooks dinner with his wife."],
          ["Sam goes to bed at ten o'clock.", false, "He goes to bed at half past nine."]
        ],
        challenge: "Find the verbs in the text that end in -s or -es (gets, has…).",
        note: "Ask: When does Sam have breakfast? Why is he always tired? Point out he / she / it + -s."
      },
      {
        type: "grammar", title: "Present simple: do and does", minutes: 12,
        rule: ["We use the present simple for things we do every day.", "With he, she and it we add -s to the verb, and we use does in questions and negatives."],
        table: [
          ["I / you / we / they", "I work.", "I don't work.", "Do you work?"],
          ["he / she / it", "She works.", "She doesn't work.", "Does she work?"]
        ],
        examples: ["He gets up at six.", "We don't eat meat.", "Does it start at nine?"],
        intro: "Write do, does, don't or doesn't.",
        items: [
          { text: "{} you drink coffee in the morning?", answers: [["do"]] },
          { text: "My sister {} like cooking. She hates it.", answers: [["doesn't", "does not"]] },
          { text: "{} he work on Saturdays?", answers: [["does"]] },
          { text: "We {} watch TV in the morning.", answers: [["don't", "do not"]] },
          { text: "What time {} the shop open?", answers: [["does"]] },
          { text: "I {} have a car. I take the bus.", answers: [["don't", "do not"]] }
        ],
        challenge: "Write two sentences about your partner's day: He / She…",
        note: "Only third person singular uses does. After does and doesn't the verb has no -s: Does she work? (not works)."
      },
      {
        type: "jumble", title: "Spelling: word jumble", minutes: 5,
        intro: "Unscramble the routine words.",
        words: ["breakfast", "shower", "lunch", "dinner", "morning", "evening"],
        challenge: "Write a sentence with each word: I have breakfast at…",
        note: "Breakfast has an ea that sounds like e (BREK-fast). Dinner has double n."
      },
      {
        type: "roleplay", title: "Speaking: your day", minutes: 12,
        intro: "Ask your partner about their day. Then swap roles.",
        cards: [
          { who: "Ask", task: "Ask the questions and write the times.", phrases: ["What time do you get up?", "Do you have breakfast?", "How do you go to work?", "When do you finish work?", "What do you do in the evening?"] },
          { who: "Answer", task: "Answer with your own day, or be this person.", phrases: ["I get up at…", "Yes, I do. / No, I don't.", "I go by bus / car / on foot.", "I finish at…"] }
        ],
        info: ["Get up: 6.30", "Breakfast: no, only coffee", "Work: by train, 8.00 to 4.00", "Evening: gym, then dinner"],
        game: { title: "Cool-down: guess the job", how: "Describe a day: I get up at four. I make bread. I start work very early… Your partner guesses the job (a baker!)." },
        note: "After the role-play, the learner tells you about card B: She gets up at half past six…, so they practise he / she + -s."
      },
      {
        type: "write", title: "Homework: my day", minutes: 8,
        task: "Write about your normal day. Use the present simple and times.",
        prompts: ["get up", "breakfast", "work or study", "lunch", "evening", "go to bed"],
        start: "I get up at…",
        model: "I get up at seven o'clock. I have a shower and I have toast and coffee for breakfast. I go to work by bus. I have lunch at one o'clock. In the evening I cook dinner and I talk to my family on the phone. I go to bed at eleven.",
        lines: 6,
        note: "Correct only the present simple and times. A stronger learner can add a paragraph about a friend (he / she + -s)."
      }
    ],
    errors: ["She work… (missing -s)", "Does she works? / She doesn't works. (extra -s)", "I am get up at seven. (be + verb)"],
    stretch: ["What do you do at the weekend that you don't do on weekdays?", "How is your day different from ten years ago?", "Describe the day of someone in your family."]
  },
  {
    id: "a1-food-and-drink",
    level: "A1",
    title: "Food and drink",
    topic: "Food, cafés and shopping",
    focus: "a, an, some and any",
    minutes: 60,
    aims: [
      "talk about food you like and don't like",
      "learn words for food and drink",
      "read a café menu and a conversation",
      "use a, an, some and any",
      "order food and drink in a café"
    ],
    steps: [
      {
        type: "talk", title: "Warm-up: favourite food", minutes: 5,
        intro: "Talk about these questions.",
        questions: ["What is your favourite food?", "What food don't you like?", "What do you usually drink in the morning?"],
        write: "My favourite food is",
        follow: ["What is a typical dish from your country?", "Do you like cooking?", "Do you eat out often?"],
        note: "Teach I love… / I like… / I don't like… / I hate… with a quick scale on the screen."
      },
      {
        type: "sort", title: "Food words", minutes: 8,
        intro: "Put each word in the right group.",
        groups: {
          "Fruit": ["apple", "banana", "orange"],
          "Vegetables": ["carrot", "potato", "onion"],
          "Drinks": ["tea", "juice", "water"],
          "Other food": ["bread", "cheese", "eggs"]
        },
        tip: "crisps are thin and come in a bag; chips are hot and thick (American English: chips and fries).",
        challenge: "Add two more words to each group.",
        note: "Check a or an: an apple, an orange, an onion, an egg (they start with a vowel sound)."
      },
      {
        type: "read", title: "Reading", minutes: 10,
        heading: "At the Corner Café",
        intro: "Read the menu and the conversation. Are the sentences true or false?",
        text: [
          "MENU · Soup of the day £4.50 · Cheese sandwich £5.00 · Egg roll £3.50 · Tea £2.00 · Coffee £2.50 · Orange juice £2.20",
          "Waiter: Hello! What would you like? · Nadia: Can I have a cheese sandwich, please? · Waiter: Of course. Anything to drink? · Nadia: Yes, a coffee, please. Do you have any milk? · Waiter: Yes, we do. · Nadia: And some water, please. · Waiter: That's £7.50, please."
        ],
        items: [
          ["Nadia orders a cheese sandwich.", true, "Can I have a cheese sandwich, please?"],
          ["She orders a tea.", false, "She orders a coffee."],
          ["The café has some milk.", true, "Yes, we do."],
          ["Soup costs £5.00.", false, "Soup costs £4.50."],
          ["The coffee is £2.50.", true, "Coffee £2.50."],
          ["Nadia pays £10.00.", false, "It's £7.50."]
        ],
        challenge: "You have £6. What can you buy from the menu?",
        note: "Read the conversation together, one part each. Point out Can I have…? and Would you like…?"
      },
      {
        type: "grammar", title: "a, an, some, any", minutes: 12,
        rule: ["Use a or an with one thing: a banana, an apple.", "Use some and any with more than one, or with things we can't count (water, bread, milk). Use any in questions and negatives."],
        head: ["", "Positive (+)", "Negative (−)", "Question (?)"],
        table: [
          ["one thing", "I have an apple.", "I don't have an apple.", "Do you have an apple?"],
          ["more / can't count", "I have some eggs.", "I don't have any milk.", "Do you have any bread?"]
        ],
        intro: "Write a, an, some or any.",
        items: [
          { text: "Can I have {} orange juice, please?", answers: [["an", "some"]] },
          { text: "I'd like {} egg sandwich.", answers: [["an"]] },
          { text: "Do you have {} milk?", answers: [["any"]] },
          { text: "There is {} bread on the table.", answers: [["some"]] },
          { text: "We don't have {} potatoes.", answers: [["any"]] },
          { text: "I want {} banana.", answers: [["a"]] }
        ],
        challenge: "Look in your kitchen. Write three things you have and two you don't have.",
        note: "Item 1: an orange juice (a glass) and some orange juice are both right; talk about why."
      },
      {
        type: "jumble", title: "Spelling: word jumble", minutes: 5,
        intro: "Unscramble the food words.",
        words: ["cheese", "potato", "banana", "carrot", "coffee", "sandwich"],
        challenge: "Write each word in a sentence with I like or I don't like.",
        note: "Double letters: cheese, carrot, coffee. Sandwich has a silent d in quick speech."
      },
      {
        type: "roleplay", title: "Role-play: in a café", minutes: 12,
        intro: "Order food and drink. Then swap roles.",
        cards: [
          { who: "Customer", task: "You have £8. Order something to eat and something to drink.", phrases: ["Can I have…, please?", "I'd like…", "Do you have any…?", "How much is that?"] },
          { who: "Waiter", task: "Use the menu from step 3. Take the order and say the price.", phrases: ["Hello! What would you like?", "Anything to drink?", "Sorry, we don't have any…", "That's £…, please."] }
        ],
        info: ["There is no soup today", "There are no eggs today", "Milk: yes", "Sugar: yes"],
        game: { title: "Cool-down: what am I?", how: "Think of a food. Say three clues: I'm yellow. I'm long. Monkeys like me. Your partner guesses (a banana!)." },
        note: "Play the waiter first. Make it real: say sorry, we don't have any soup today, so the learner has to choose again."
      },
      {
        type: "write", title: "Homework: my shopping list", minutes: 8,
        task: "Write a shopping list for a meal you like, then write five sentences about it.",
        prompts: ["the meal", "what you have", "what you don't have", "what you need to buy", "how much it costs"],
        start: "I want to cook…",
        model: "I want to cook pasta with tomato sauce. I have some pasta and an onion. I don't have any tomatoes. I need some cheese and a bottle of olive oil. It costs about ten pounds.",
        lines: 6,
        note: "Correct a / an / some / any and plurals (tomatoes, potatoes)."
      }
    ],
    errors: ["a apple / a egg (an before a vowel sound)", "I have any milk. (any is for negatives and questions)", "Can I have a water? (some water, or a glass of water)"],
    stretch: ["Describe a meal from your country step by step.", "What's the difference between I like coffee and I'd like a coffee?", "Plan a menu for a party of six people."]
  }
);
