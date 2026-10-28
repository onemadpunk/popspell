/*
  READING PASSAGES — short stories with questions, written to match the phonics stages.

   • text: the story. Keep it to sounds the pupils have been taught at that stage.
   • listen: true also makes a "Listen" version for early level, where the story is heard,
     not read.
   • questions: q (the question), a (the right answer), others (two wrong answers),
     skill (what it checks), why (shown if the answer is missed).

  Stories and questions are recorded in the Eponine voice automatically on GitHub.
*/
window.PASSAGES = [
  {
    id: "bus", title: "The big red bus", level: "Early", listen: true,
    blurb: "Short vowels: a, e, i, o, u.",
    text: "Sam and his dad got on the big red bus. The bus went up a hill. Sam had a bag on his lap. In the bag was a hat and a cup. At the top of the hill, Sam and Dad got off. They ran to the pond. A duck sat on a log in the sun.",
    questions: [
      { q: "Who got on the bus with Sam?", a: "His dad", others: ["His mum", "His gran"], skill: "finding information", why: "It says: Sam and his dad got on the big red bus." },
      { q: "What was in the bag?", a: "A hat and a cup", others: ["A cat and a dog", "A pen and a map"], skill: "finding information", why: "It says: In the bag was a hat and a cup." },
      { q: "Where did they run to?", a: "The pond", others: ["The shop", "The bus stop"], skill: "finding information", why: "It says: They ran to the pond." },
      { q: "What was the duck sitting on?", a: "A log", others: ["A rock", "A bed"], skill: "finding information", why: "It says: A duck sat on a log in the sun." }
    ]
  },
  {
    id: "shell-shop", title: "The shell shop", level: "Early", listen: true,
    blurb: "Digraphs: sh, ch, th, ck.",
    text: "Beth and Chip went to a shop by the sea. The shop had shells, fish and a big red ship in a box. Beth got a pink shell. Chip got a shell with a black spot. Then they sat on a bench to munch their lunch. A crab ran past them and Chip got such a shock!",
    questions: [
      { q: "What colour was Beth's shell?", a: "Pink", others: ["Black", "Red"], skill: "finding information", why: "It says: Beth got a pink shell." },
      { q: "Where did they eat their lunch?", a: "On a bench", others: ["On the ship", "In the shop"], skill: "finding information", why: "It says: they sat on a bench to munch their lunch." },
      { q: "What ran past them?", a: "A crab", others: ["A fish", "A dog"], skill: "finding information", why: "It says: A crab ran past them." },
      { q: "How did Chip feel when the crab ran past?", a: "Shocked", others: ["Sleepy", "Cross"], skill: "inference", why: "Chip got such a shock, so he was surprised." }
    ]
  },
  {
    id: "kite", title: "Jake's kite", level: "First",
    blurb: "Silent e: a–e, i–e, o–e, u–e.",
    text: "Jake has a white kite with a long blue tail. On a fine day, Jake and his sister Rose take the kite to the top of the slope. Jake holds the rope and runs. The wind lifts the kite up and up. It glides above the trees like a huge bird. Then the wind drops and the kite dives into a hole in the hedge. Rose helps Jake to get it out. They both smile. \"Let's do it again!\" says Rose.",
    questions: [
      { q: "What colour is Jake's kite?", a: "White", others: ["Blue", "Red"], skill: "finding information", why: "It says: Jake has a white kite with a long blue tail." },
      { q: "Who is Rose?", a: "Jake's sister", others: ["Jake's mum", "Jake's dog"], skill: "finding information", why: "It says: Jake and his sister Rose." },
      { q: "Why did the kite dive into the hedge?", a: "The wind dropped", others: ["Jake let go of the rope", "A bird hit it"], skill: "cause and effect", why: "It says: the wind drops and the kite dives." },
      { q: "How do Jake and Rose feel at the end?", a: "Happy", others: ["Sad", "Angry"], skill: "inference", why: "They both smile and want to do it again." }
    ]
  },
  {
    id: "rain", title: "Waiting in the rain", level: "First",
    blurb: "Vowel teams: ai, ay, ee, ea, oa, ow.",
    text: "Gail and Lee wait for the train. It is a grey day and the rain will not stop. Lee has a green coat and Gail has a yellow scarf. They stand under a tree to keep dry. At last the train comes down the line. They jump on and find a seat by the window. Gail reads a book. Lee eats a toasted bun and looks at the boats on the sea.",
    questions: [
      { q: "What were Gail and Lee waiting for?", a: "A train", others: ["A bus", "A boat"], skill: "finding information", why: "It says: Gail and Lee wait for the train." },
      { q: "What was the weather like?", a: "Grey and rainy", others: ["Hot and sunny", "Snowy"], skill: "finding information", why: "It says: It is a grey day and the rain will not stop." },
      { q: "Why did they stand under a tree?", a: "To keep dry", others: ["To hide", "To find shells"], skill: "cause and effect", why: "It says: They stand under a tree to keep dry." },
      { q: "Where does the train go along, near the end?", a: "By the sea", others: ["Up a mountain", "Under a city"], skill: "inference", why: "Lee looks at the boats on the sea from the window." }
    ]
  },
  {
    id: "storm", title: "The storm on the farm", level: "First",
    blurb: "Vowels with r: ar, or, er, ir, ur.",
    text: "Carl lives on a farm in the north of Scotland. One morning a storm began. The wind roared and the barn door banged. Carl's sister Fern heard the horses snorting in the dark. Carl put on his warm shirt and boots and ran to the barn with a torch. He shut the door and gave the horses some corn. By the time the storm was over, the sun was out and the horses were calm.",
    questions: [
      { q: "Where is Carl's farm?", a: "In the north of Scotland", others: ["By the sea in England", "In a big city"], skill: "finding information", why: "It says: a farm in the north of Scotland." },
      { q: "What did Carl take to the barn?", a: "A torch", others: ["A cart", "A fork"], skill: "finding information", why: "It says: ran to the barn with a torch." },
      { q: "Why were the horses snorting?", a: "They were scared of the storm", others: ["They were hungry for apples", "They wanted to play"], skill: "inference", why: "The wind roared and the door banged in the dark, so the horses were frightened." },
      { q: "What word tells us the horses felt better at the end?", a: "Calm", others: ["Dark", "Warm"], skill: "vocabulary", why: "It says: the horses were calm." }
    ]
  },
  {
    id: "puppy", title: "The lost puppy", level: "Second",
    blurb: "A longer story with clues to work out.",
    text: "On the way home from school, Isla heard a faint whimper coming from behind the wall of the old church. She peered over and saw a small brown puppy, shivering and soaked from the rain. There was no collar on its neck. Isla wrapped the puppy in her scarf and carried it carefully home. Her dad phoned the vet, who checked the puppy for a microchip. It belonged to Mrs Reid, who lived three streets away. When Mrs Reid arrived, she hugged Isla and the puppy at the same time. \"Bramble has been missing for two days,\" she said, wiping her eyes. \"You are a real hero.\"",
    questions: [
      { q: "Where did Isla find the puppy?", a: "Behind the wall of the old church", others: ["In the school playground", "Outside the vet's"], skill: "finding information", why: "It says: from behind the wall of the old church." },
      { q: "How did the vet find out who owned the puppy?", a: "By checking for a microchip", others: ["By reading its collar", "By asking at the school"], skill: "finding information", why: "There was no collar, so the vet checked for a microchip." },
      { q: "Why was Mrs Reid wiping her eyes?", a: "She was so relieved she was crying", others: ["She had a cold", "The rain was in her eyes"], skill: "inference", why: "Bramble had been lost for two days, so she cried with relief." },
      { q: "What does \"faint\" mean in \"a faint whimper\"?", a: "Quiet and hard to hear", others: ["Very loud", "Happy"], skill: "vocabulary", why: "Isla had to listen carefully: the sound was quiet." }
    ]
  }
];
