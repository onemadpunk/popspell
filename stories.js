/*
  DECODABLE STORIES — short stories a pupil reads by themselves, sound by sound.

  Each story only uses the sounds taught up to its stage, plus tricky words. The site works out
  which sounds every story needs, and shows each pupil the stories that only use sounds they
  have already practised ("My stories"). So a new story is matched to pupils automatically.

   • stage: the EA Literacy stage it is written for (1, 2 or 3, as in words.js).
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
    id: "d-ship", title: "Josh and the ship", stage: 1, tricky: [],
    text: "Josh has a ship. It is red and black, and it has a big mast. Josh sets the ship in the bath. Splash! The ship bobs on the top. Then Josh gets a duck and a fish. The duck tips up and sinks. The ship and the fish bob on. Josh grins. \"This is the best bath,\" he said.",
    questions: [
      { q: "What did Josh set in the bath first?", a: "His ship", others: ["His dog", "His bike"], skill: "finding information", why: "It says: Josh sets the ship in the bath." },
      { q: "What sank?", a: "The duck", others: ["The ship", "The fish"], skill: "finding information", why: "It says: The duck tips up and sinks." },
      { q: "How did Josh feel about his bath?", a: "He liked it", others: ["He was cross", "He was cold"], skill: "inference", why: "Josh grins and says it is the best bath." }
    ]
  },
  {
    id: "d-frog", title: "Fred the frog", stage: 1, tricky: [],
    text: "Fred the frog sat on a rock in the pond. He had not had his lunch. A big moth went past. Fred did a long jump and got the moth! Then a fish swam up to the rock. Fred got such a shock that he fell in with a splash. He swam back to his rock and had a rest.",
    questions: [
      { q: "Where did Fred sit?", a: "On a rock", others: ["On a log", "On a bench"], skill: "finding information", why: "It says: Fred the frog sat on a rock in the pond." },
      { q: "What did Fred catch?", a: "A moth", others: ["A fish", "A bug"], skill: "finding information", why: "It says: Fred did a long jump and got the moth!" },
      { q: "Why did Fred fall in the pond?", a: "A fish gave him a shock", others: ["He slipped on the rock", "He jumped after the moth"], skill: "cause and effect", why: "It says: Fred got such a shock that he fell in." }
    ]
  },
  {
    id: "d-gull", title: "Mike, Duke and the gull", stage: 2, tricky: [],
    text: "Mike rode his bike to the lake. His dog Duke sat in the basket on the back. At the lake, Mike and Duke ate a bit of cake. Then a big gull came and stole the cake! Duke did not like that. \"Yap! Yap!\" he went. The gull went home with the cake. Mike had to smile.",
    questions: [
      { q: "Where did Duke sit on the bike?", a: "In the basket", others: ["On the seat", "On Mike's lap"], skill: "finding information", why: "It says: Duke sat in the basket on the back." },
      { q: "What did the gull take?", a: "The cake", others: ["Mike's hat", "Duke's ball"], skill: "finding information", why: "It says: a big gull came and stole the cake!" },
      { q: "How did Duke feel about the gull?", a: "Cross", others: ["Happy", "Sleepy"], skill: "inference", why: "Duke did not like it and went \"Yap! Yap!\"" }
    ]
  },
  {
    id: "d-flute", title: "Jane's flute", stage: 2, tricky: [],
    text: "Jane has a flute. She likes to make up a tune. She can make a tune that is cute, and a tune that is rude! Jane's cat, Pete, hates the rude tune. When Jane makes the rude tune, Pete hides in a box. When she makes the cute tune, Pete pokes his nose from the box and sits next to Jane. Then he has a nap.",
    questions: [
      { q: "What does Jane have?", a: "A flute", others: ["A drum", "A bike"], skill: "finding information", why: "It says: Jane has a flute." },
      { q: "Where does Pete hide?", a: "In a box", others: ["Under the bed", "Up a tree"], skill: "finding information", why: "It says: Pete hides in a box." },
      { q: "Which tune does Pete like?", a: "The cute tune", others: ["The rude tune", "Neither tune"], skill: "inference", why: "When Jane makes the cute tune, Pete comes and sits next to her." }
    ]
  },
  {
    id: "d-boat", title: "Kay and the seal", stage: 2, tricky: [],
    text: "Kay and Grandad sail out to sea in Grandad's boat. The sea is flat and the sun is out. They take a flask of tea and lots of toast. Kay sees a seal pop up next to the boat. It looks at Kay, and Kay looks at it. Then the seal dives deep. Grandad points to a black cloud. \"Rain is on the way!\" he said. They float back to the beach just in time.",
    questions: [
      { q: "Who goes out in the boat with Kay?", a: "Grandad", others: ["Mum", "Her sister"], skill: "finding information", why: "It says: Kay and Grandad sail out to sea." },
      { q: "What do they take to eat?", a: "Toast", others: ["Cake", "Soup"], skill: "finding information", why: "It says: They take a flask of tea and lots of toast." },
      { q: "Why do they go back to the beach?", a: "Rain is on the way", others: ["The boat has a leak", "Kay sees a seal"], skill: "cause and effect", why: "Grandad says: Rain is on the way!" }
    ]
  },
  {
    id: "d-mouse", title: "The mouse and the cheese", stage: 2, tricky: [],
    text: "A mouse hid in a crack next to the sink. When the house is still at night, the mouse creeps out to get food. It sees a bit of cheese on the ground. The mouse is about to eat it when it spots our cat, Coal. Coal leaps up, but the mouse zooms back to its crack with the cheese. Coal sits by the crack till it is light, but the mouse stays in and eats its cheese.",
    questions: [
      { q: "Where does the mouse hide?", a: "In a crack next to the sink", others: ["In a box", "Under the bed"], skill: "finding information", why: "It says: A mouse hid in a crack next to the sink." },
      { q: "What does the mouse find?", a: "Cheese", others: ["Bread", "Cake"], skill: "finding information", why: "It says: It sees a bit of cheese on the ground." },
      { q: "Did Coal catch the mouse?", a: "No, the mouse got away", others: ["Yes", "Coal did not see the mouse"], skill: "inference", why: "The mouse zooms back to its crack and stays in." }
    ]
  },
  {
    id: "d-star", title: "The first star", stage: 2, tricky: [],
    text: "Carl and Bea sat in the garden after dark. They looked up for the first star. Bea saw it first, next to the fir tree in the corner. Then lots of stars came out. Carl saw stars in the shape of a cart. Bea saw stars in the shape of a bird. Then the wind got sharp and they started to shiver. So they went in for a hot drink.",
    questions: [
      { q: "Who saw the first star?", a: "Bea", others: ["Carl", "Mum"], skill: "finding information", why: "It says: Bea saw it first." },
      { q: "What shape did Carl see in the stars?", a: "A cart", others: ["A bird", "A fish"], skill: "finding information", why: "It says: Carl saw stars in the shape of a cart." },
      { q: "Why did they go in?", a: "The wind made them cold", others: ["It started to rain", "They saw a fox"], skill: "cause and effect", why: "The wind got sharp and they started to shiver." }
    ]
  },
  {
    id: "d-fair", title: "The fair", stage: 2, tricky: [],
    text: "The fair is in the park next to the church. Mark is keen to go on the big wheel. Kirsten is scared of the big wheel, so she has a turn on the horses. Then they share a bag of popcorn. From the top of the wheel, Mark can see the church, the park and his own street. He waves to Kirsten, and she waves back from her horse.",
    questions: [
      { q: "Where is the fair?", a: "In the park", others: ["On the beach", "On a farm"], skill: "finding information", why: "It says: The fair is in the park next to the church." },
      { q: "Why does Kirsten not go on the big wheel?", a: "She is scared of it", others: ["She is too small", "It is shut"], skill: "cause and effect", why: "It says: Kirsten is scared of the big wheel." },
      { q: "What do they share?", a: "Popcorn", others: ["Chips", "A pear"], skill: "finding information", why: "It says: they share a bag of popcorn." }
    ]
  },
  {
    id: "d-puddle", title: "The huge puddle", stage: 3, tricky: [],
    text: "It rained and rained. When it stopped, Dan and Molly got boots and raincoats on. Next to the gate was a huge puddle. Dan jumped in, and muddy splashes went shooting up the fence. Molly giggled. Then she jumped in too, and the splashes went up higher. Mum came out with a towel and a cross face. Then she smiled, and she jumped in as well!",
    questions: [
      { q: "What did Dan and Molly have on?", a: "Boots and raincoats", others: ["Hats and scarves", "Shorts and sandals"], skill: "finding information", why: "It says: Dan and Molly got boots and raincoats on." },
      { q: "What was next to the gate?", a: "A huge puddle", others: ["A dog", "A bike"], skill: "finding information", why: "It says: Next to the gate was a huge puddle." },
      { q: "What did Mum do at the end?", a: "She jumped in too", others: ["She sent them in", "She went to bed"], skill: "sequencing", why: "It says: she smiled, and she jumped in as well!" }
    ]
  },
  {
    id: "d-phone", title: "The missing phone", stage: 3, tricky: [],
    text: "Grace was frantic. Her phone was missing! She looked under the pillows and in the kitchen sink. Her twin, Ken, was giggling on the stairs. Grace knelt next to him and looked at his knapsack. She unzipped it. Inside, wrapped in a sock, was the phone! \"I was keeping it safe,\" said Ken, with a cheeky grin.",
    questions: [
      { q: "What was missing?", a: "Grace's phone", others: ["Ken's knapsack", "A sock"], skill: "finding information", why: "It says: Her phone was missing!" },
      { q: "Where was the phone?", a: "In Ken's knapsack", others: ["Under the pillows", "In the sink"], skill: "finding information", why: "It says: Inside, wrapped in a sock, was the phone!" },
      { q: "Why did Ken say he took the phone?", a: "To keep it safe", others: ["To play a game", "He did not take it"], skill: "inference", why: "Ken said: I was keeping it safe." }
    ]
  },
  // The EA Stage 3 sounds (soft c and g, dge, tch, ti, ie, ea, ey, ough and more)
  {
    id: "d-trip", title: "The class trip", stage: 3, tricky: [],
    text: "The class went on a trip to the city. They walked over a bridge to the station and got on a train. Kai sat by the window and watched the fields go by. \"Look, a palace!\" he cried. At the palace, a lady showed them a huge kitchen and a great hall. Ella tried on a helmet, but it was too heavy for her head. For lunch they had bread, cheese and a piece of fudge. On the way home, the train went through a tunnel, and they all felt sleepy.",
    questions: [
      { q: "How did the class get to the city?", a: "By train", others: ["By bus", "By boat"], skill: "finding information", why: "It says: They walked over a bridge to the station and got on a train." },
      { q: "Why did Ella not keep the helmet on?", a: "It was too heavy", others: ["It was too small", "It was broken"], skill: "cause and effect", why: "It says: it was too heavy for her head." },
      { q: "How did they feel on the way home?", a: "Sleepy", others: ["Cross", "Scared"], skill: "finding information", why: "It says: they all felt sleepy." }
    ]
  },
  {
    id: "d-potion", title: "Gwen's potion", stage: 3, tricky: [],
    text: "Gwen the witch had a big pot in her kitchen. \"I will make a magic potion,\" she said. She put in four frog legs, some soup and a pinch of ice. Then she added the wing of a wren and a lump of dough. The potion began to bubble and fizz, and it turned grey. Gwen tried a drop. Her nose went bright blue! \"Oh no,\" she said. \"I ought to write my potions down!\" Her cat could not stop giggling.",
    questions: [
      { q: "What did Gwen want to make?", a: "A magic potion", others: ["A cake", "Some soup"], skill: "finding information", why: "Gwen said: I will make a magic potion." },
      { q: "What happened when Gwen tried the potion?", a: "Her nose went blue", others: ["She fell asleep", "Her cat went blue"], skill: "cause and effect", why: "It says: Gwen tried a drop. Her nose went bright blue!" },
      { q: "Why do you think the cat was giggling?", a: "Gwen's nose looked funny", others: ["The cat had a drink too", "The soup was hot"], skill: "inference", why: "Gwen's nose had just gone bright blue, so she looked funny." }
    ]
  },
  // EA Stages 4 to 7: a phoneme story for each block (block: the block it goes with), full of words with that block's sound
  {
    id: "ea47-ay", title: "The great sleigh day", stage: 4, block: 1, tricky: [],
    text: "On the eighth day of the holidays, it began to snow. Jay and Kate raced to the shed to get the old sleigh. They waited on the hill while their neighbour Dave made a straight track. \"Are you afraid?\" asked Kate. \"No way!\" said Jay. They sailed down the slope, faster and faster, and crashed into a great heap of snow. They lay there laughing, with snow on every face. \"Let's play again,\" said Kate. They stayed out all day, until the sky was grey and their tea was waiting.",
    questions: [
      { q: "Who made the track down the hill?", a: "Dave, their neighbour", others: ["Kate", "Their dad"], skill: "finding information", why: "It says: their neighbour Dave made a straight track." },
      { q: "What happened at the bottom of the slope?", a: "They crashed into a heap of snow", others: ["They fell off a wall", "The sleigh broke"], skill: "finding information", why: "It says: they crashed into a great heap of snow." },
      { q: "How did Jay and Kate feel about the sleigh ride?", a: "They loved it", others: ["They were scared", "They were bored"], skill: "inference", why: "They lay there laughing and wanted to play again." }
    ]
  },
  {
    id: "ea47-a", title: "The haggis hunt", stage: 4, block: 2, tricky: [],
    text: "Alfie's aunt told him a tale about the wild haggis. \"It has short legs on one side and long legs on the other,\" she said, \"so it can run round a hill.\" Alfie packed a basket and a map and set off to find one. He searched the grass and the rocks for half the afternoon. At last he sat down, calm but cross. Then his aunt began to laugh. \"There is no wild haggis!\" she said. Alfie had to laugh too. That night they had haggis for tea, and it was fantastic.",
    questions: [
      { q: "Why did the wild haggis have different legs, in the tale?", a: "To run round a hill", others: ["To swim fast", "To jump high"], skill: "finding information", why: "His aunt said: it has short legs on one side and long legs on the other, so it can run round a hill." },
      { q: "What did Alfie take with him?", a: "A basket and a map", others: ["A net and a torch", "A bag and a phone"], skill: "finding information", why: "It says: Alfie packed a basket and a map." },
      { q: "Why did his aunt laugh?", a: "The wild haggis was just a joke", others: ["Alfie fell over", "She saw a haggis"], skill: "inference", why: "She said: There is no wild haggis!" }
    ]
  },
  {
    id: "ea47-b", title: "Bob the builder's busy day", stage: 4, block: 3, tricky: [],
    text: "Bob is a builder. Last week he had to build a cupboard for a big library. He grabbed his tools and a box of bolts. But a rabbit had got into the van and was hiding in the rubbish bag! It nibbled a bit of bubble wrap and wobbled about. Bob burst out laughing. He let the rabbit go by the bushes, and then he built the best cupboard ever. The librarian was so happy that she bought him a big blueberry bun.",
    questions: [
      { q: "What did Bob have to build?", a: "A cupboard", others: ["A bridge", "A boat"], skill: "finding information", why: "It says: he had to build a cupboard for a big library." },
      { q: "Where was the rabbit hiding?", a: "In the rubbish bag", others: ["Under a book", "In his toolbox"], skill: "finding information", why: "It says: hiding in the rubbish bag." },
      { q: "What did the librarian give Bob?", a: "A blueberry bun", others: ["A book", "Some money"], skill: "finding information", why: "It says: she bought him a big blueberry bun." }
    ]
  },
  {
    id: "ea47-d", title: "Doodle the dog", stage: 4, block: 4, tricky: [],
    text: "Doodle the dog loved puddles. One day he dashed into the biggest puddle in the park and landed with a splash. Mud splattered over the ladder of the slide and over Dad's new red jacket. \"Doodle!\" Dad shouted, but Doodle just wagged and paddled about. When they got home, Dad decided that Doodle needed a bath. Doodle hid under the bed, but Dad found him and dropped him in the tub. After that, Doodle was clean and dry, and he cuddled up for a long snooze.",
    questions: [
      { q: "What did Doodle love?", a: "Puddles", others: ["Bones", "Baths"], skill: "finding information", why: "It says: Doodle the dog loved puddles." },
      { q: "What did Dad decide when they got home?", a: "That Doodle needed a bath", others: ["That Doodle needed a walk", "To buy a new jacket"], skill: "finding information", why: "It says: Dad decided that Doodle needed a bath." },
      { q: "Where did Doodle hide?", a: "Under the bed", others: ["In the garden", "Behind the door"], skill: "finding information", why: "It says: Doodle hid under the bed." }
    ]
  },
  {
    id: "ea47-ee", title: "The secret beach", stage: 4, block: 5, tricky: [],
    text: "Every week, Neve and Eve cycled to a secret beach. It was the perfect place to read and eat their sweets in peace. One windy evening, they heard a squeak beneath a heap of seaweed. It was a tiny seal! It seemed weak and needed help. Eve called the sea rescue team, and they came quickly. The seal was cleaned and fed. A week later the team set it free, and it swam off into the deep green sea. Neve believed they had made a real friend.",
    questions: [
      { q: "What did the girls hear beneath the seaweed?", a: "A squeak", others: ["A splash", "A song"], skill: "finding information", why: "It says: they heard a squeak beneath a heap of seaweed." },
      { q: "Who did Eve call?", a: "The sea rescue team", others: ["Her mum", "The police"], skill: "finding information", why: "It says: Eve called the sea rescue team." },
      { q: "What happened to the seal in the end?", a: "It was set free", others: ["It went to a zoo", "It stayed with the girls"], skill: "finding information", why: "It says: the team set it free, and it swam off." }
    ]
  },
  {
    id: "ea47-e", title: "Ted's heavy breakfast", stage: 4, block: 6, tricky: [],
    text: "Ted was ready for the best breakfast ever. He spread jam on his bread, then added cheddar, an egg and ten slices of melon. \"That is too heavy,\" said his friend Bella. \"Any more and you will need a rest!\" Ted said he was healthy and strong. He ate every bit. Then he felt so heavy that he went back to bed, and he slept until ten. When he woke up, he said, \"Maybe Bella was right. Next time I will eat less instead.\"",
    questions: [
      { q: "What did Ted spread on his bread first?", a: "Jam", others: ["Butter", "Honey"], skill: "finding information", why: "It says: He spread jam on his bread." },
      { q: "What did Ted do after eating?", a: "He went back to bed", others: ["He went for a run", "He made more toast"], skill: "finding information", why: "It says: he went back to bed." },
      { q: "What did Ted learn?", a: "To eat less next time", others: ["To eat more next time", "To get up early"], skill: "inference", why: "He said: Next time I will eat less instead." }
    ]
  },
  {
    id: "ea47-igh", title: "The night flight", stage: 4, block: 7, tricky: [],
    text: "On a bright night in July, Myra and her dad climbed to the top of the hill to try out his new kite. The kite had tiny lights all along its sides. When the wind was right, it flew high into the sky and shone like a star. \"What a sight!\" cried Myra. Then the line slipped out of her hand. The kite drifted away over the pines. They tried to find it, but it was lost. Myra sighed. Still, it was the brightest night of her life.",
    questions: [
      { q: "What was special about the kite?", a: "It had tiny lights", others: ["It was huge", "It could talk"], skill: "finding information", why: "It says: The kite had tiny lights all along its sides." },
      { q: "What happened when the line slipped?", a: "The kite drifted away", others: ["The kite crashed", "Dad caught it"], skill: "cause and effect", why: "It says: The kite drifted away over the pines." },
      { q: "How did Myra feel at the end?", a: "Sad but happy about the night", others: ["Very angry", "Scared of the dark"], skill: "inference", why: "Myra sighed, but it was the brightest night of her life." }
    ]
  },
  {
    id: "ea47-i", title: "The village mystery", stage: 4, block: 8, tricky: [],
    text: "In a busy little village, things kept going missing. First a gift, then a crystal vase, then a big bag of biscuits. The villagers were puzzled. Lynn and Jim decided to fix the mystery. They hid in the gym and listened. At midnight they heard a little rustle. It was Mrs Smith's pet magpie, pinching shiny things for its nest! Inside the nest they found the vase, the gift and lots of tinsel. Nobody found the biscuits, though. Jim was a bit quiet about that.",
    questions: [
      { q: "Who was taking the things?", a: "A magpie", others: ["A fox", "Jim"], skill: "finding information", why: "It says: It was Mrs Smith's pet magpie." },
      { q: "Where did Lynn and Jim hide?", a: "In the gym", others: ["In a tree", "In a shop"], skill: "finding information", why: "It says: They hid in the gym and listened." },
      { q: "Why do you think Jim was quiet about the biscuits?", a: "He might have eaten them", others: ["He did not like biscuits", "He was tired"], skill: "inference", why: "Nobody found the biscuits, and Jim went quiet, so maybe he ate them." }
    ]
  },
  {
    id: "ea47-oa", title: "The old boat", stage: 4, block: 9, tricky: [],
    text: "Joe and his grandad own an old boat called Goldie. It has a yellow stripe and a hole in the floor. On a cold morning they rowed out to the island to toast marshmallows. The sea was smooth and slow. But then water began to flow in through the hole! Joe used his old coat to plug it, and they rowed home as fast as they could. Grandad laughed so much that his nose glowed. \"We will fix Goldie tomorrow,\" he said, \"though I know you will not want to row again.\"",
    questions: [
      { q: "What is the boat called?", a: "Goldie", others: ["Rosie", "Sunny"], skill: "finding information", why: "It says: an old boat called Goldie." },
      { q: "How did Joe plug the hole?", a: "With his old coat", others: ["With a stone", "With a bucket"], skill: "finding information", why: "It says: Joe used his old coat to plug it." },
      { q: "Why did they row home fast?", a: "Water was coming in", others: ["It was dark", "They were hungry"], skill: "cause and effect", why: "Water began to flow in through the hole." }
    ]
  },
  {
    id: "ea47-oo", title: "The flute at the zoo", stage: 4, block: 10, tricky: [],
    text: "Ruth could play a few tunes on her new flute. One afternoon she took it to the zoo. As she blew a cool tune, the animals began to move. The kangaroos hopped in time, a group of baboons danced in a loop, and a goose flew down to listen. A crowd grew around her. \"Who knew a flute could do that?\" said a boy. The zoo keeper gave Ruth a juicy fruit smoothie and asked her to play again soon.",
    questions: [
      { q: "What did Ruth play?", a: "A flute", others: ["A drum", "A violin"], skill: "finding information", why: "It says: her new flute." },
      { q: "What did the baboons do?", a: "Danced in a loop", others: ["Went to sleep", "Ran away"], skill: "finding information", why: "It says: a group of baboons danced in a loop." },
      { q: "What did the zoo keeper give Ruth?", a: "A fruit smoothie", others: ["A ticket", "A toy kangaroo"], skill: "finding information", why: "It says: The zoo keeper gave Ruth a juicy fruit smoothie." }
    ]
  },
  {
    id: "ea47-yoo", title: "The unicorn statue", stage: 4, block: 11, tricky: [],
    text: "In the middle of our town there is a beautiful statue of a unicorn. A few weeks ago, someone painted it blue for a joke. The town was furious. Hugh, a pupil from our school, came up with a useful idea. \"Let's rescue it!\" he said. A huge queue of people turned up with brushes and buckets. They scrubbed until the unicorn was white again. The view from the town hall was amazing. The mayor said we should continue to look after the statue. Hugh became a local hero.",
    questions: [
      { q: "What is the statue of?", a: "A unicorn", others: ["A lion", "A horse"], skill: "finding information", why: "It says: a beautiful statue of a unicorn." },
      { q: "What did the people bring?", a: "Brushes and buckets", others: ["Paint and ladders", "Flowers"], skill: "finding information", why: "It says: people turned up with brushes and buckets." },
      { q: "Why did Hugh become a hero?", a: "His idea saved the statue", others: ["He painted the statue", "He was the mayor"], skill: "inference", why: "His useful idea got everyone to clean the unicorn." }
    ]
  },
  {
    id: "ea47-u", title: "My cousin's young puppy", stage: 4, block: 12, tricky: [],
    text: "My cousin Gus has a young puppy called Bun. Bun loves to run and jump about. Last month, Bun dug up the whole garden and buried Gus's brother's football. Then a huge thunderstorm came and the rain began to flood the lawn. Bun was covered in mud from his tummy to his tail. My cousin wondered what to do. In the end he scrubbed Bun in the tub until he was clean. Bun just wanted another run in the mud. That pup is double trouble!",
    questions: [
      { q: "What is the puppy called?", a: "Bun", others: ["Gus", "Bud"], skill: "finding information", why: "It says: a young puppy called Bun." },
      { q: "What did Bun bury?", a: "A football", others: ["A bone", "A shoe"], skill: "finding information", why: "It says: buried Gus's brother's football." },
      { q: "What does double trouble mean here?", a: "Bun causes lots of problems", others: ["Bun has a twin", "Bun is very quiet"], skill: "vocabulary", why: "Bun dug up the garden and got covered in mud, so he causes a lot of trouble." }
    ]
  },
  {
    id: "ea47-le", title: "The little squirrel", stage: 4, block: 13, tricky: [],
    text: "A little squirrel lived in a tunnel under an old castle. Every morning it would nibble seeds and acorns on the castle wall. One day a gentle girl called Isabel left an apple and a handful of nuts on a metal table. The squirrel began to travel closer and closer. At first it was nervous and gave a little tremble. Then it grabbed a nut and scuttled off. By the end of the summer, the squirrel would eat out of Isabel's hand. It was the most special animal she had ever met.",
    questions: [
      { q: "Where did the squirrel live?", a: "In a tunnel under a castle", others: ["In a tree", "In a garden shed"], skill: "finding information", why: "It says: lived in a tunnel under an old castle." },
      { q: "What did Isabel leave on the table?", a: "An apple and nuts", others: ["Bread", "Seeds and water"], skill: "finding information", why: "It says: left an apple and a handful of nuts on a metal table." },
      { q: "How did the squirrel change by the end of the summer?", a: "It ate from Isabel's hand", others: ["It ran away", "It got bigger"], skill: "sequencing", why: "By the end of the summer, the squirrel would eat out of Isabel's hand." }
    ]
  },
  {
    id: "ea47-f", title: "The elephant photograph", stage: 4, block: 14, tricky: [],
    text: "Phil wanted a photograph of an elephant for his school project. He went to the safari park with his sister Fiona. The elephant was fluffy with dust and very tough looking. Phil lifted his phone. Just then, the elephant sneezed, and a puff of dust flew in his face. Phil began to cough and laugh. When he looked at the photo, it showed a huge fuzzy cloud. \"Not enough elephant!\" laughed Fiona. Phil had another go, and this time he got a perfect photograph.",
    questions: [
      { q: "Why did Phil want a photograph?", a: "For his school project", others: ["To sell it", "For his gran"], skill: "finding information", why: "It says: for his school project." },
      { q: "What happened when the elephant sneezed?", a: "Dust flew in Phil's face", others: ["Phil dropped his phone", "The elephant ran away"], skill: "cause and effect", why: "It says: a puff of dust flew in his face." },
      { q: "What did the first photo show?", a: "A fuzzy cloud", others: ["A perfect elephant", "Fiona"], skill: "finding information", why: "It says: it showed a huge fuzzy cloud." }
    ]
  },
  {
    id: "ea47-g", title: "The ghost guide", stage: 4, block: 15, tricky: [],
    text: "Our guide at the castle was called Greg. He had a big grin and a gold guitar. \"Guess what?\" he said. \"This castle has a ghost.\" We all giggled. But then the lights went off, and a ghastly grey shape glided past the window. Everyone began to scream. When the lights came on, we saw it was just Greg's dog with a sheet over its head! Greg could not stop laughing. \"That was my best example of a ghost trick,\" he said.",
    questions: [
      { q: "What was the guide's name?", a: "Greg", others: ["Gary", "Gus"], skill: "finding information", why: "It says: Our guide at the castle was called Greg." },
      { q: "What was the ghost really?", a: "Greg's dog in a sheet", others: ["A real ghost", "A curtain"], skill: "finding information", why: "It says: it was just Greg's dog with a sheet over its head!" },
      { q: "Why did Greg laugh?", a: "His trick had worked", others: ["He was scared", "He saw a ghost"], skill: "inference", why: "Greg had played a trick on the visitors, and it worked." }
    ]
  },
  {
    id: "ea47-ow", title: "The loud mountain storm", stage: 4, block: 16, tricky: [],
    text: "High on the mountain, Howard and Rowan pitched their tent beside a fountain of water. Around midnight, a loud howl woke them. Dark clouds frowned over the peaks, and thunder growled. The rain poured down. \"Our tent is about to fall down!\" shouted Rowan. They found an old stone hut and crouched inside. They counted the seconds between the flashes and the sound of the thunder. By dawn, the storm had moved out over the town below, and the sun was out.",
    questions: [
      { q: "What woke Howard and Rowan?", a: "A loud howl", others: ["An alarm", "A dog"], skill: "finding information", why: "It says: a loud howl woke them." },
      { q: "Where did they shelter?", a: "In an old stone hut", others: ["In a cave", "In the car"], skill: "finding information", why: "It says: They found an old stone hut and crouched inside." },
      { q: "What was the weather like at dawn?", a: "Sunny", others: ["Snowing", "Still stormy"], skill: "finding information", why: "It says: by dawn the sun was out." }
    ]
  },
  {
    id: "ea47-oi", title: "Roy's noisy toy", stage: 4, block: 17, tricky: [],
    text: "Roy got a royal robot toy for his birthday. It could point, join in songs and make the loudest noise you can imagine. At first everyone enjoyed it. But soon the noise began to annoy the whole family. \"Avoid pressing the big button!\" said Mum. Roy did not listen. The robot made such a noise that the dog hid in the coil of the hose. In the end, Roy made a choice. He took out the batteries and enjoyed a quiet game of quoits instead.",
    questions: [
      { q: "What could the toy do?", a: "Point, sing and make a loud noise", others: ["Fly", "Cook dinner"], skill: "finding information", why: "It says: It could point, join in songs and make the loudest noise." },
      { q: "Where did the dog hide?", a: "In the coil of the hose", others: ["Under the table", "In the car"], skill: "finding information", why: "It says: the dog hid in the coil of the hose." },
      { q: "What choice did Roy make?", a: "To take out the batteries", others: ["To buy another toy", "To press the button again"], skill: "finding information", why: "It says: He took out the batteries." }
    ]
  },
  {
    id: "ea47-k", title: "Zack's chemistry kit", stage: 4, block: 18, tricky: [],
    text: "Zack's school homework task was to make a model volcano. He picked up a kit from the chemist and set to work in the kitchen. He mixed vinegar, red food colour and a cup of baking soda. \"Stand back!\" he shouted. The volcano erupted with a fizz and a crackle. Red foam spilled over the clock, the kettle and the cat! The cat jumped onto the cooker and knocked over a cake. Zack's school project was excellent, but the kitchen was chaos.",
    questions: [
      { q: "What did Zack make?", a: "A model volcano", others: ["A rocket", "A cake"], skill: "finding information", why: "It says: make a model volcano." },
      { q: "What did the foam spill over?", a: "The clock, the kettle and the cat", others: ["The garden", "Zack's homework"], skill: "finding information", why: "It says: Red foam spilled over the clock, the kettle and the cat!" },
      { q: "What does chaos mean?", a: "A big mess", others: ["Very tidy", "Very quiet"], skill: "vocabulary", why: "The cat knocked over a cake and foam was everywhere, so the kitchen was a mess." }
    ]
  },
  {
    id: "ea47-ks", title: "The fox in the box", stage: 4, block: 19, tricky: [],
    text: "Max found a box by the rocks next to the docks. Inside was a little fox with a sore leg. Max took it to the vet in a taxi. The vet fixed its leg and said it needed six weeks of rest. Max fed it snacks and let it relax in a box of socks. After six weeks, the fox could run and jump again. Max took it back to the rocks. The fox licked his hand and then dashed off. Max watched until he could see only its tracks.",
    questions: [
      { q: "What was wrong with the fox?", a: "It had a sore leg", others: ["It was lost", "It was hungry"], skill: "finding information", why: "It says: a little fox with a sore leg." },
      { q: "How long did the fox need to rest?", a: "Six weeks", others: ["Six days", "Six months"], skill: "finding information", why: "It says: it needed six weeks of rest." },
      { q: "Where did Max take the fox at the end?", a: "Back to the rocks", others: ["To a zoo", "To his school"], skill: "finding information", why: "It says: Max took it back to the rocks." }
    ]
  },
  {
    id: "ea47-kw", title: "The quiet queen", stage: 4, block: 20, tricky: [],
    text: "Queen Quinn was very quiet. She would never shout or quarrel. One night, a squirrel squeezed into the palace and began to squeak. It ran up the curtains and quickly ate her quiche. The guards began to squabble about how to catch it. The queen just sat still. Then she put a square of cheese on the floor. The squirrel crept over, and Queen Quinn quietly put a quilt over it. She carried it outside and let it go. \"Quick thinking is better than quarrelling,\" she said.",
    questions: [
      { q: "What did the squirrel eat?", a: "The queen's quiche", others: ["Some nuts", "The curtains"], skill: "finding information", why: "It says: quickly ate her quiche." },
      { q: "How did the queen catch the squirrel?", a: "With a quilt", others: ["With a net", "With a box"], skill: "finding information", why: "It says: Queen Quinn quietly put a quilt over it." },
      { q: "What lesson does the queen give?", a: "Quick thinking is better than arguing", others: ["Shouting is best", "Squirrels are bad"], skill: "inference", why: "She said: Quick thinking is better than quarrelling." }
    ]
  },
  {
    id: "ea47-j", title: "The giant hedge", stage: 4, block: 21, tricky: [],
    text: "At the edge of our village, there is a giant hedge shaped like a dragon. Every June, the judges come to see it. This year, Jen and her gran had to trim it with huge shears. They balanced on a ladder by the bridge and worked for ages. A jogger stopped to watch. \"That is magic!\" she said. The judges gave them a gold badge for the best garden in the region. Jen stuck the badge on the fridge so she could see it every day.",
    questions: [
      { q: "What is the hedge shaped like?", a: "A dragon", others: ["A giant", "A bridge"], skill: "finding information", why: "It says: a giant hedge shaped like a dragon." },
      { q: "What did the judges give them?", a: "A gold badge", others: ["A trophy", "Some money"], skill: "finding information", why: "It says: a gold badge for the best garden in the region." },
      { q: "Where did Jen put the badge?", a: "On the fridge", others: ["In a drawer", "On her coat"], skill: "finding information", why: "It says: Jen stuck the badge on the fridge." }
    ]
  },
  {
    id: "ea47-sh", title: "The magician's special show", stage: 4, block: 22, tricky: [],
    text: "Shona went to a special show by a famous magician. He wore a shiny shirt and a long dark cape. For his first trick, he made a fish vanish from a glass of water. Then he asked for a volunteer. Shona was anxious, but she put her hand up. He shut her in a box and spun it around. When it opened, she was on the other side of the hall with a shell in her hand! Everyone shouted and clapped. It was a show she would always treasure.",
    questions: [
      { q: "What did the magician make vanish?", a: "A fish", others: ["A rabbit", "A shell"], skill: "finding information", why: "It says: he made a fish vanish from a glass of water." },
      { q: "How did Shona feel before she volunteered?", a: "Anxious", others: ["Angry", "Sleepy"], skill: "finding information", why: "It says: Shona was anxious." },
      { q: "Where did Shona end up?", a: "On the other side of the hall", others: ["On the stage", "Outside"], skill: "finding information", why: "It says: she was on the other side of the hall." }
    ]
  },
  {
    id: "ea47-ch", title: "The kitchen adventure", stage: 4, block: 23, tricky: [],
    text: "Charlie wanted to make a chocolate cake for his mum. He found a picture of one in a cookbook. He put on an apron and began to match the pictures to the steps. He chopped butter, stirred in the chocolate and stretched up to reach the sugar. The mixture looked strange, but he baked it anyway. When Mum came home, the kitchen looked like a creature had been in it. But she ate a big chunk of the cake. \"This is a natural talent!\" she said. Charlie was chuffed.",
    questions: [
      { q: "Who was the cake for?", a: "Charlie's mum", others: ["Charlie's dad", "His teacher"], skill: "finding information", why: "It says: a chocolate cake for his mum." },
      { q: "What did the kitchen look like when Mum came home?", a: "Like a creature had been in it", others: ["Very tidy", "Like a shop"], skill: "finding information", why: "It says: the kitchen looked like a creature had been in it." },
      { q: "How did Charlie feel at the end?", a: "Chuffed", others: ["Upset", "Bored"], skill: "vocabulary", why: "Chuffed means very pleased, because Mum liked the cake." }
    ]
  },
  {
    id: "ea47-s", title: "The science of the castle", stage: 4, block: 24, tricky: [],
    text: "Our class visited a castle on a cliff. Inside, the guide said the castle was haunted by a sad soldier with a sword. Sam said there was no such thing, and that science could explain any noise. That night, we stayed in sleeping bags in the great hall. Suddenly, we heard a whistle and a hiss. Sam was the first to listen. He found that the wind was whistling through a gap in the castle wall. The guide smiled. \"So the soldier was the wind all along,\" she said.",
    questions: [
      { q: "Where was the castle?", a: "On a cliff", others: ["In a forest", "In a city"], skill: "finding information", why: "It says: a castle on a cliff." },
      { q: "What was the guide's story about?", a: "A sad soldier with a sword", others: ["A dragon", "A king"], skill: "finding information", why: "It says: haunted by a sad soldier with a sword." },
      { q: "What made the noise?", a: "The wind through a gap in the wall", others: ["A ghost", "An owl"], skill: "finding information", why: "It says: the wind was whistling through a gap in the castle wall." }
    ]
  },
  {
    id: "ea47-o", title: "The naughty daughter", stage: 4, block: 25, tricky: [],
    text: "Polly was the naughty daughter of a farmer. One autumn morning, she wanted to watch the swans on the pond. She was not allowed to go alone, but she sneaked off anyway. She crawled under the fence and fell into the pond with a splash. A swan began to squawk. Her dad heard the noise and ran to help. He caught her coat and pulled her out. Polly was cold and soggy. \"I ought to have asked,\" she said. Her dad taught her a lesson she would not forget.",
    questions: [
      { q: "What did Polly want to watch?", a: "The swans", others: ["The cows", "The sheep"], skill: "finding information", why: "It says: she wanted to watch the swans on the pond." },
      { q: "How did Polly get into the pond?", a: "She fell in", others: ["She jumped in", "A swan pushed her"], skill: "finding information", why: "It says: She crawled under the fence and fell into the pond." },
      { q: "What did Polly learn?", a: "She ought to have asked first", others: ["Swans are kind", "Ponds are warm"], skill: "inference", why: "She said: I ought to have asked." }
    ]
  },
  {
    id: "ea47-m", title: "The climb in autumn", stage: 4, block: 26, tricky: [],
    text: "Mum and I like to climb hills. In the autumn, we climbed the tallest mountain in the area. My thumbs were numb with cold, and my legs ached. We stopped for a crumb of cake and some warm milk. At the top there was a column of stones, called a cairn. We added a stone to it. The view was amazing: lochs, lambs and miles of moorland. On the way down, we hummed a hymn we learned in school. It was a magical day.",
    questions: [
      { q: "What season was it?", a: "Autumn", others: ["Summer", "Spring"], skill: "finding information", why: "It says: In the autumn, we climbed." },
      { q: "What is a cairn?", a: "A column of stones", others: ["A small loch", "A kind of cake"], skill: "vocabulary", why: "It says: a column of stones, called a cairn." },
      { q: "What did they do at the top?", a: "Added a stone to the cairn", others: ["Had a nap", "Went for a swim"], skill: "finding information", why: "It says: We added a stone to it." }
    ]
  },
  {
    id: "ea47-n", title: "The knight's new knife", stage: 4, block: 27, tricky: [],
    text: "A young knight named Nina knelt before the king. \"I need a knife for my journey,\" she said. The king gave her a knife with a gold handle and a sign of a lion on it. Nina rode for nine days through snow and rain. At night she sat by the fire and knitted. On the tenth day she met a gnome who had lost his way. She used her new knife to cut a path through the brambles, and led him home. The king said she was the kindest knight he had ever known.",
    questions: [
      { q: "What did the king give Nina?", a: "A knife with a gold handle", others: ["A horse", "A crown"], skill: "finding information", why: "It says: The king gave her a knife with a gold handle." },
      { q: "What did Nina do at night?", a: "Knitted by the fire", others: ["Read a book", "Sang songs"], skill: "finding information", why: "It says: At night she sat by the fire and knitted." },
      { q: "Why did the king call her the kindest knight?", a: "She helped the lost gnome home", others: ["She won a battle", "She was fast"], skill: "inference", why: "She led the lost gnome home." }
    ]
  },
  {
    id: "ea47-ng", title: "The strong king", stage: 4, block: 28, tricky: [],
    text: "Long ago, a strong king lived in a jungle. He could lift anything with one finger. One day, he sang a song so long that the monkeys began to yawn. A young penguin wandered in and said, \"Thank you for the song, but I think it is time to sleep.\" The king was angry at first. Then he began to think. He was singing too much and not listening! From then on, the king sang just one song each evening, and everyone in the jungle had a long sleep.",
    questions: [
      { q: "What could the king lift with one finger?", a: "Anything", others: ["A banana", "A tree"], skill: "finding information", why: "It says: He could lift anything with one finger." },
      { q: "Who told the king it was time to sleep?", a: "A penguin", others: ["A monkey", "A lion"], skill: "finding information", why: "It says: A young penguin wandered in and said it." },
      { q: "What did the king learn?", a: "To listen to others", others: ["To sing louder", "To sleep less"], skill: "inference", why: "He was singing too much and not listening." }
    ]
  },
  {
    id: "ea47-r", title: "The wrong wrapping", stage: 4, block: 29, tricky: [],
    text: "Ruby wanted to wrap a present for her brother Rory. She wrapped a red rubber ball in shiny paper and wrote his name on the tag. But in a rush she wrote the wrong name. She wrote Rex, the name of their dog! On Rory's birthday, Rex ripped open the parcel and ran off with the ball. Rory started to frown. Then Ruby gave him a real present: a book of rhymes and riddles. Rory read them all morning, and Rex was very happy with his ball.",
    questions: [
      { q: "Who was the present meant for?", a: "Rory", others: ["Rex", "Ruby"], skill: "finding information", why: "It says: wrap a present for her brother Rory." },
      { q: "What name did Ruby write by mistake?", a: "Rex", others: ["Rob", "Ruth"], skill: "finding information", why: "It says: She wrote Rex, the name of their dog!" },
      { q: "What was Rory's real present?", a: "A book of rhymes and riddles", others: ["A red ball", "A kite"], skill: "finding information", why: "It says: a book of rhymes and riddles." }
    ]
  },
  {
    id: "ea47-v", title: "The vet's visit", stage: 4, block: 30, tricky: [],
    text: "Seven sheep live on Vicky's farm. One evening, the oldest sheep, Vera, would not move. Vicky gave her water and some leaves, but she would not eat. Vicky phoned the vet, who drove over in her van. The vet gave Vera some medicine and told Vicky to give her lots of love. Vicky stayed with her all evening. By the next morning, Vera was nibbling grass and leaping over the river bank. Vicky felt very brave and very proud.",
    questions: [
      { q: "How many sheep live on the farm?", a: "Seven", others: ["Six", "Eleven"], skill: "finding information", why: "It says: Seven sheep live on Vicky's farm." },
      { q: "How did the vet get to the farm?", a: "In her van", others: ["On a bike", "On a horse"], skill: "finding information", why: "It says: who drove over in her van." },
      { q: "How was Vera the next morning?", a: "Better and eating", others: ["Still ill", "Asleep"], skill: "finding information", why: "It says: Vera was nibbling grass and leaping over the river bank." }
    ]
  },
  {
    id: "ea47-w", title: "The wet penguin", stage: 4, block: 31, tricky: [],
    text: "Will went to the zoo with his class. He wanted to see the penguins once more before they went home. One penguin waddled over to the water and dived in with a splash. Water sprayed everywhere and Will was soaked! Everyone laughed, even the teacher. \"That penguin likes you,\" said a girl in his class. Will wiped his face with his woolly hat and laughed too. On the way home, he wrote a story called The Wet Penguin, and it won a prize.",
    questions: [
      { q: "Where did Will's class go?", a: "The zoo", others: ["The beach", "A farm"], skill: "finding information", why: "It says: Will went to the zoo with his class." },
      { q: "What did Will use to wipe his face?", a: "His woolly hat", others: ["A towel", "His sleeve"], skill: "finding information", why: "It says: Will wiped his face with his woolly hat." },
      { q: "What did Will's story win?", a: "A prize", others: ["A penguin", "A trip"], skill: "finding information", why: "It says: it won a prize." }
    ]
  },
  {
    id: "ea47-y", title: "The yellow yacht", stage: 4, block: 32, tricky: [],
    text: "Yasmin's family went on a yacht trip. The yacht was yellow, with a tall mast. On the first day, the sea was calm and Yasmin had a yogurt on the deck. The next day, it was very windy and the yacht rocked from side to side. Yasmin yelled, \"Yikes!\" as a wave splashed her. But her dad, who used to sail when he was young, steered them safely to a bay beyond the cliffs. There they had yummy fish for tea. Yasmin said it was the best holiday in years.",
    questions: [
      { q: "What colour was the yacht?", a: "Yellow", others: ["Blue", "Red"], skill: "finding information", why: "It says: The yacht was yellow." },
      { q: "What did Yasmin have on the first day?", a: "A yogurt", others: ["A sandwich", "An ice cream"], skill: "finding information", why: "It says: Yasmin had a yogurt on the deck." },
      { q: "Who steered them to safety?", a: "Her dad", others: ["Yasmin", "A captain"], skill: "finding information", why: "It says: her dad steered them safely to a bay." }
    ]
  },
  {
    id: "ea47-wh", title: "The whale whistle", stage: 4, block: 33, tricky: [],
    text: "Which animal can whistle? A whale can! When Whitney visited the white cliffs, she heard a strange whistle out at sea. Then a whale's tail flicked out of the water. Whitney grabbed her mum's sleeve. \"Where did it go?\" she whispered. The whale blew water into the air with a whoosh. Whitney wondered whether it was calling to its friends. When she got home, she found out that whales use whistles and clicks to talk. She now wants to study whales when she grows up.",
    questions: [
      { q: "Where did Whitney hear the whistle?", a: "At the white cliffs", others: ["At the zoo", "In a film"], skill: "finding information", why: "It says: When Whitney visited the white cliffs." },
      { q: "How do whales talk?", a: "With whistles and clicks", others: ["With songs only", "They cannot talk"], skill: "finding information", why: "It says: whales use whistles and clicks to talk." },
      { q: "What does Whitney want to do when she grows up?", a: "Study whales", others: ["Be a sailor", "Work at a zoo"], skill: "finding information", why: "It says: She now wants to study whales." }
    ]
  },
  {
    id: "ea47-th", title: "The thunder at the theatre", stage: 4, block: 34, tricky: [],
    text: "On Thursday, our class went to the theatre to see a play about a thief. In the third act, there was a crash of thunder. My brother thought it was real and grabbed my arm. Then the thief tumbled through the curtains and landed in the front row! Everyone thought it was part of the play. It was not. The actor had tripped on a thick rope. He was fine, though. He thanked the audience, then climbed back on stage, and the play went on.",
    questions: [
      { q: "What was the play about?", a: "A thief", others: ["A king", "A storm"], skill: "finding information", why: "It says: a play about a thief." },
      { q: "What did the brother think about the thunder?", a: "That it was real", others: ["That it was funny", "That it was too quiet"], skill: "finding information", why: "It says: My brother thought it was real." },
      { q: "Why did the actor fall?", a: "He tripped on a thick rope", others: ["He was pushed", "He jumped"], skill: "cause and effect", why: "It says: The actor had tripped on a thick rope." }
    ]
  },
  {
    id: "ea47-z", title: "The jazz zoo", stage: 4, block: 36, tricky: [],
    text: "Zara plays the saxophone in a jazz band. One summer, the band was asked to play at the zoo. The zebras were the first to hear the music. They began to sway. Then the bees began to buzz in time, and a lazy lion opened one eye. Zara played louder and louder. The noise was so amazing that a television crew came to film them. The zoo keeper was pleased. \"Usually the animals snooze all afternoon,\" she said. \"That was a pleasure to see!\"",
    questions: [
      { q: "What does Zara play?", a: "The saxophone", others: ["The drums", "The xylophone"], skill: "finding information", why: "It says: Zara plays the saxophone in a jazz band." },
      { q: "Which animals were first to hear the music?", a: "The zebras", others: ["The lions", "The bees"], skill: "finding information", why: "It says: The zebras were the first to hear the music." },
      { q: "Who came to film the band?", a: "A television crew", others: ["The zoo keeper", "Zara's mum"], skill: "finding information", why: "It says: a television crew came to film them." }
    ]
  }
];
