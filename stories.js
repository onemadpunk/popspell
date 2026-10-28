/*
  DECODABLE STORIES — short stories a pupil reads by themselves, sound by sound.

  Each story only uses the sounds taught up to its stage, plus tricky words. The site works out
  which sounds every story needs, and shows each pupil the stories that only use sounds they
  have already practised ("My stories"). So a new story is matched to pupils automatically.

   • stage: the spelling stage it is written for (1–6, as in words.js).
   • tricky: words in the story that can't be sounded out, beyond the early tricky words
     every pupil learns (the, a, I, to, no, go, so, into, he, she, we, me, be, was, my, you, they,
     said, of). Pupils need to have practised these before the story counts as ready.
   • questions: q (the question), a (the right answer), others (two wrong answers),
     skill (what it checks), why (shown if the answer is missed).

  Stories and questions are recorded in the Eponine voice automatically on GitHub.
*/
window.STORIES = [
  {
    id: "d-hen", title: "Pip and the hen", stage: 1, tricky: [],
    text: "Pip has a red hen. The hen is big and fat. It can dig and it can run. Pip and the hen sit in the sun. The hen gets a bug. Yum! Up hops the hen on to a log. Pip pats the hen and the hen naps.",
    questions: [
      { q: "What colour is the hen?", a: "Red", others: ["Black", "Brown"], skill: "finding information", why: "It says: Pip has a red hen." },
      { q: "What did the hen get?", a: "A bug", others: ["A bun", "A nut"], skill: "finding information", why: "It says: The hen gets a bug." },
      { q: "What did the hen do at the end?", a: "It had a nap", others: ["It ran off", "It got a bug"], skill: "sequencing", why: "It says: Pip pats the hen and the hen naps." }
    ]
  },
  {
    id: "d-jam", title: "Sid and the jam", stage: 1, tricky: [],
    text: "Mum has a pot of jam. Sid the cat is on the rug. Sid jumps up and tips the pot. The jam is on the rug and on Sid! \"Get the cat!\" said Mum. Sid ran and hid in the bed. Mum got Sid, and Dad got a wet rag to rub him. Bad cat, Sid!",
    questions: [
      { q: "What did Sid tip over?", a: "The pot of jam", others: ["A cup of milk", "A box of pens"], skill: "finding information", why: "It says: Sid jumps up and tips the pot." },
      { q: "Where did Sid hide?", a: "In the bed", others: ["Up a tree", "In a box"], skill: "finding information", why: "It says: Sid ran and hid in the bed." },
      { q: "How did Mum feel when the jam went on the rug?", a: "Cross", others: ["Happy", "Sleepy"], skill: "inference", why: "Mum said \"Get the cat!\", so she was cross." }
    ]
  },
  {
    id: "d-ship", title: "Josh and the ship", stage: 2, tricky: [],
    text: "Josh has a ship. It is red and black, and it has a big mast. Josh sets the ship in the bath. Splash! The ship bobs on the top. Then Josh gets a duck and a fish. The duck tips up and sinks. The ship and the fish bob on. Josh grins. \"This is the best bath,\" he said.",
    questions: [
      { q: "What did Josh set in the bath first?", a: "His ship", others: ["His dog", "His bike"], skill: "finding information", why: "It says: Josh sets the ship in the bath." },
      { q: "What sank?", a: "The duck", others: ["The ship", "The fish"], skill: "finding information", why: "It says: The duck tips up and sinks." },
      { q: "How did Josh feel about his bath?", a: "He liked it", others: ["He was cross", "He was cold"], skill: "inference", why: "Josh grins and says it is the best bath." }
    ]
  },
  {
    id: "d-frog", title: "Fred the frog", stage: 2, tricky: [],
    text: "Fred the frog sat on a rock in the pond. He had not had his lunch. A big moth went past. Fred did a long jump and got the moth! Then a fish swam up to the rock. Fred got such a shock that he fell in with a splash. He swam back to his rock and had a rest.",
    questions: [
      { q: "Where did Fred sit?", a: "On a rock", others: ["On a log", "On a bench"], skill: "finding information", why: "It says: Fred the frog sat on a rock in the pond." },
      { q: "What did Fred catch?", a: "A moth", others: ["A fish", "A bug"], skill: "finding information", why: "It says: Fred did a long jump and got the moth!" },
      { q: "Why did Fred fall in the pond?", a: "A fish gave him a shock", others: ["He slipped on the rock", "He jumped after the moth"], skill: "cause and effect", why: "It says: Fred got such a shock that he fell in." }
    ]
  },
  {
    id: "d-gull", title: "Mike, Duke and the gull", stage: 3, tricky: [],
    text: "Mike rode his bike to the lake. His dog Duke sat in the basket on the back. At the lake, Mike and Duke ate a bit of cake. Then a big gull came and stole the cake! Duke did not like that. \"Yap! Yap!\" he went. The gull went home with the cake. Mike had to smile.",
    questions: [
      { q: "Where did Duke sit on the bike?", a: "In the basket", others: ["On the seat", "On Mike's lap"], skill: "finding information", why: "It says: Duke sat in the basket on the back." },
      { q: "What did the gull take?", a: "The cake", others: ["Mike's hat", "Duke's ball"], skill: "finding information", why: "It says: a big gull came and stole the cake!" },
      { q: "How did Duke feel about the gull?", a: "Cross", others: ["Happy", "Sleepy"], skill: "inference", why: "Duke did not like it and went \"Yap! Yap!\"" }
    ]
  },
  {
    id: "d-flute", title: "Jane's flute", stage: 3, tricky: [],
    text: "Jane has a flute. She likes to make up a tune. She can make a tune that is cute, and a tune that is rude! Jane's cat, Pete, hates the rude tune. When Jane makes the rude tune, Pete hides in a box. When she makes the cute tune, Pete pokes his nose from the box and sits next to Jane. Then he has a nap.",
    questions: [
      { q: "What does Jane have?", a: "A flute", others: ["A drum", "A bike"], skill: "finding information", why: "It says: Jane has a flute." },
      { q: "Where does Pete hide?", a: "In a box", others: ["Under the bed", "Up a tree"], skill: "finding information", why: "It says: Pete hides in a box." },
      { q: "Which tune does Pete like?", a: "The cute tune", others: ["The rude tune", "Neither tune"], skill: "inference", why: "When Jane makes the cute tune, Pete comes and sits next to her." }
    ]
  },
  {
    id: "d-boat", title: "Kay and the seal", stage: 4, tricky: [],
    text: "Kay and Grandad sail out to sea in Grandad's boat. The sea is flat and the sun is out. They take a flask of tea and lots of toast. Kay sees a seal pop up next to the boat. It looks at Kay, and Kay looks at it. Then the seal dives deep. Grandad points to a black cloud. \"Rain is on the way!\" he said. They float back to the beach just in time.",
    questions: [
      { q: "Who goes out in the boat with Kay?", a: "Grandad", others: ["Mum", "Her sister"], skill: "finding information", why: "It says: Kay and Grandad sail out to sea." },
      { q: "What do they take to eat?", a: "Toast", others: ["Cake", "Soup"], skill: "finding information", why: "It says: They take a flask of tea and lots of toast." },
      { q: "Why do they go back to the beach?", a: "Rain is on the way", others: ["The boat has a leak", "Kay sees a seal"], skill: "cause and effect", why: "Grandad says: Rain is on the way!" }
    ]
  },
  {
    id: "d-mouse", title: "The mouse and the cheese", stage: 4, tricky: [],
    text: "A mouse hid in a crack next to the sink. When the house is still at night, the mouse creeps out to get food. It sees a bit of cheese on the ground. The mouse is about to eat it when it spots our cat, Coal. Coal leaps up, but the mouse zooms back to its crack with the cheese. Coal sits by the crack till it is light, but the mouse stays in and eats its cheese.",
    questions: [
      { q: "Where does the mouse hide?", a: "In a crack next to the sink", others: ["In a box", "Under the bed"], skill: "finding information", why: "It says: A mouse hid in a crack next to the sink." },
      { q: "What does the mouse find?", a: "Cheese", others: ["Bread", "Cake"], skill: "finding information", why: "It says: It sees a bit of cheese on the ground." },
      { q: "Did Coal catch the mouse?", a: "No, the mouse got away", others: ["Yes", "Coal did not see the mouse"], skill: "inference", why: "The mouse zooms back to its crack and stays in." }
    ]
  },
  {
    id: "d-star", title: "The first star", stage: 5, tricky: [],
    text: "Carl and Bea sat in the garden after dark. They looked up for the first star. Bea saw it first, next to the fir tree in the corner. Then lots of stars came out. Carl saw stars in the shape of a cart. Bea saw stars in the shape of a bird. Then the wind got sharp and they started to shiver. So they went in for a hot drink.",
    questions: [
      { q: "Who saw the first star?", a: "Bea", others: ["Carl", "Mum"], skill: "finding information", why: "It says: Bea saw it first." },
      { q: "What shape did Carl see in the stars?", a: "A cart", others: ["A bird", "A fish"], skill: "finding information", why: "It says: Carl saw stars in the shape of a cart." },
      { q: "Why did they go in?", a: "The wind made them cold", others: ["It started to rain", "They saw a fox"], skill: "cause and effect", why: "The wind got sharp and they started to shiver." }
    ]
  },
  {
    id: "d-fair", title: "The fair", stage: 5, tricky: [],
    text: "The fair is in the park next to the church. Mark is keen to go on the big wheel. Kirsten is scared of the big wheel, so she has a turn on the horses. Then they share a bag of popcorn. From the top of the wheel, Mark can see the church, the park and his own street. He waves to Kirsten, and she waves back from her horse.",
    questions: [
      { q: "Where is the fair?", a: "In the park", others: ["On the beach", "On a farm"], skill: "finding information", why: "It says: The fair is in the park next to the church." },
      { q: "Why does Kirsten not go on the big wheel?", a: "She is scared of it", others: ["She is too small", "It is shut"], skill: "cause and effect", why: "It says: Kirsten is scared of the big wheel." },
      { q: "What do they share?", a: "Popcorn", others: ["Chips", "A pear"], skill: "finding information", why: "It says: they share a bag of popcorn." }
    ]
  },
  {
    id: "d-puddle", title: "The huge puddle", stage: 6, tricky: [],
    text: "It rained and rained. When it stopped, Dan and Molly got boots and raincoats on. Next to the gate was a huge puddle. Dan jumped in, and muddy splashes went shooting up the fence. Molly giggled. Then she jumped in too, and the splashes went up higher. Mum came out with a towel and a cross face. Then she smiled, and she jumped in as well!",
    questions: [
      { q: "What did Dan and Molly have on?", a: "Boots and raincoats", others: ["Hats and scarves", "Shorts and sandals"], skill: "finding information", why: "It says: Dan and Molly got boots and raincoats on." },
      { q: "What was next to the gate?", a: "A huge puddle", others: ["A dog", "A bike"], skill: "finding information", why: "It says: Next to the gate was a huge puddle." },
      { q: "What did Mum do at the end?", a: "She jumped in too", others: ["She sent them in", "She went to bed"], skill: "sequencing", why: "It says: she smiled, and she jumped in as well!" }
    ]
  },
  {
    id: "d-phone", title: "The missing phone", stage: 6, tricky: [],
    text: "Grace was frantic. Her phone was missing! She looked under the pillows and in the kitchen sink. Her twin, Ken, was giggling on the stairs. Grace knelt next to him and looked at his knapsack. She unzipped it. Inside, wrapped in a sock, was the phone! \"I was keeping it safe,\" said Ken, with a cheeky grin.",
    questions: [
      { q: "What was missing?", a: "Grace's phone", others: ["Ken's knapsack", "A sock"], skill: "finding information", why: "It says: Her phone was missing!" },
      { q: "Where was the phone?", a: "In Ken's knapsack", others: ["Under the pillows", "In the sink"], skill: "finding information", why: "It says: Inside, wrapped in a sock, was the phone!" },
      { q: "Why did Ken say he took the phone?", a: "To keep it safe", others: ["To play a game", "He did not take it"], skill: "inference", why: "Ken said: I was keeping it safe." }
    ]
  }
];
