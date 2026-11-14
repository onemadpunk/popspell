/*
  ============================================================
   SPELLING LISTS — this is the only file you need to edit.
  ============================================================

  How to change things:
   • To rename the site, change "title" and "subtitle" just below.
   • To add a word, put it in quotes with a comma:  "cake",
   • Each list can have up to 15 words (more will still work).
   • "id" must be unique, lower case, no spaces (it appears in the web address).
   • "tip" is the hint shown before starting, and again when a pupil misses
     the list's main sound. It can be left out. "tipScottish" (optional) is used
     instead when Settings is set to the Scottish accent (the r is sounded).
   • "colour" is the colour used for that stage's cards.
   • "check" (optional) is 2–3 NEW words with the same pattern, given at the end
     without being shown first, to see whether the pupil can use the rule.
   • Each word's sentence is in sentences.js.

  Sounds (graphemes):
   The site splits each word into its sounds by itself (cake → c · a–e · k)
   and draws sound buttons under them. With the Scottish accent (the default
   in Settings) the r is its own sound: car → c · a · r, hair → h · ai · r.
   With the English accent, ar, er, ir, or, ur, air, are, ear and eer are one
   sound: car → c · ar. If it gets a word wrong, write the
   sounds yourself with dashes, and a split digraph as a_e, i_e, o_e, u_e or e_e:
       "h-a-ve"     "c-oul-d"     "sc-e_e-n"
   A dash at the end keeps a whole word as one chunk, with no sound buttons:  "one-"
   "focus" (optional) lists the sounds a list is practising. Without it, the
   site uses the sounds that appear in most of the list's words.

  Font:
   Sassoon Primary is used automatically on devices where it's installed.
   If you buy a Sassoon web-font licence, put the file in a "fonts" folder and
   set fontFile below, e.g.  fontFile: "fonts/SassoonPrimary.woff2"

  Teacher accounts:
   Teachers sign in on the site with Google (👩‍🏫 Teacher, top right). The owner invites
   them by email. The settings below connect the site to its Firebase project — see
   firebase/SETUP.md. They are safe to publish: what each person can see is decided by
   the security rules in Firebase, not by these settings.

  After editing on GitHub, press "Commit changes" — the site updates in a minute or two.
*/

window.SITE = {
  title: "PopSpell",
  subtitle: "Hear it. Map it. Spell it.",
  fontFile: "",
  firebase: {
    // Paste the "firebaseConfig" values from Firebase console → Project settings → Your apps
    apiKey: "AIzaSyCV8Ns4_b2W-GBilgKzOF29u8VKeXgdNX0",
    authDomain: "popspell-a0b8d.firebaseapp.com",
    projectId: "popspell-a0b8d",
    appId: "1:849176075050:web:b9294dec4a975ec3161c53"
  }
};

window.SPELLING_LISTS = [
  {
    stage: "Stage 1 · Short vowels",
    colour: "#0f766e",
    lists: [
      { id: "short-a", title: "Short a", tip: "Listen for the short 'a' sound in the middle, like in apple.",
        words: ["cat", "bag", "man", "hat", "map", "ran", "sad", "pan", "jam", "tap", "van", "cap", "bat", "dad", "rag"],
        check: ["fan", "wag", "ham"] },
      { id: "short-e", title: "Short e", tip: "Listen for the short 'e' sound in the middle, like in egg.",
        words: ["bed", "hen", "leg", "net", "pet", "red", "ten", "web", "jet", "men", "peg", "wet", "beg", "fed", "yes"],
        check: ["den", "vet", "pen"] },
      { id: "short-i", title: "Short i", tip: "Listen for the short 'i' sound in the middle, like in insect.",
        words: ["bin", "dig", "fin", "hip", "kit", "lip", "pig", "sit", "tin", "win", "zip", "big", "fix", "mix", "rib"],
        check: ["pin", "wig", "lid"] },
      { id: "short-o", title: "Short o", tip: "Listen for the short 'o' sound in the middle, like in octopus.",
        words: ["cot", "dog", "fox", "hop", "jog", "log", "mop", "pot", "rod", "top", "box", "hot", "nod", "got", "cob"],
        check: ["fog", "cod", "lot"] },
      { id: "short-u", title: "Short u", tip: "Listen for the short 'u' sound in the middle, like in umbrella.",
        words: ["bun", "bus", "cup", "cut", "fun", "gum", "hug", "jug", "mud", "nut", "rug", "sun", "tub", "bug", "hut"],
        check: ["pup", "hum", "dug"] },
      { id: "initial-y", title: "y at the start (as in yes)", tip: "At the start, y says the first sound in yes, yell, you, yoga and yo-yo. Start with the short words.", focus: ["y"], ordered: true,
        words: ["yam", "yak", "yap", "yes", "yet", "yum", "yell", "yawn", "yard", "yarn", "yellow", "yoga"],
        check: ["yip", "yuck"] }
    ]
  },
  {
    stage: "Stage 2 · Blends and digraphs",
    colour: "#2563eb",
    lists: [
      { id: "l-blends", title: "Starting blends: bl cl fl gl pl sl", tip: "Two consonants at the start — say both sounds.",
        words: ["black", "clap", "flag", "glad", "plum", "slip", "blob", "clip", "flat", "glum", "plan", "sled", "flip", "plot", "slug"],
        check: ["flop", "plug", "clog"] },
      { id: "r-s-blends", title: "Starting blends: r and s", tip: "Two consonants at the start — say both sounds.",
        words: ["crab", "drum", "frog", "grin", "pram", "trip", "brag", "snap", "spin", "stop", "swim", "skip", "smug", "scab", "step"],
        check: ["grub", "stem", "spot"] },
      { id: "end-blends", title: "Ending blends", tip: "Two consonants at the end — listen carefully for both.",
        words: ["best", "hand", "jump", "lamp", "milk", "pond", "tent", "belt", "desk", "gift", "help", "mask", "nest", "sand", "list"],
        check: ["mist", "bump", "golf"] },
      { id: "sh", title: "sh", tip: "Two letters, one sound: s + h makes 'sh'.",
        words: ["ship", "shop", "shed", "shut", "shin", "fish", "dish", "wish", "cash", "rush", "bash", "mash", "gush", "shelf", "crash"],
        check: ["shot", "rash", "shrub"] },
      { id: "ch", title: "ch", tip: "Two letters, one sound: c + h makes 'ch'.",
        words: ["chip", "chop", "chat", "chin", "chest", "chick", "rich", "much", "such", "lunch", "bench", "munch", "pinch", "champ", "chug"],
        check: ["chimp", "chess", "crunch"] },
      { id: "th", title: "th", tip: "Two letters, one sound: t + h makes 'th'. Pop your tongue out!",
        words: ["thin", "thick", "then", "that", "this", "them", "moth", "bath", "path", "with", "cloth", "think", "thud", "maths", "thump"],
        check: ["thing", "thank", "broth"] },
      { id: "wh", title: "wh", tip: "Two letters, one sound: w + h makes 'w' at the start of these words.",
        words: ["when", "which", "whip", "what", "whisk", "whiff", "whizz", "wheel", "wheat", "white", "whale", "while", "why", "where", "whisper"],
        check: ["whack", "whim"] },
      { id: "ck", title: "ck", tip: "After a short vowel, the 'k' sound is usually spelled ck.",
        words: ["back", "duck", "kick", "lock", "neck", "pack", "rock", "sock", "tick", "luck", "deck", "pick", "black", "truck", "stick"],
        check: ["snack", "sack", "frock"] },
      { id: "ng-nk", title: "ng and nk", tip: "Listen to the end: ring has 'ng', pink has 'n' then 'k'.", focus: ["ng", "n"],
        words: ["ring", "sing", "king", "long", "song", "bang", "hung", "wing", "bank", "pink", "sunk", "wink", "honk", "think", "drink"],
        check: ["fang", "junk", "plank"] },
      { id: "floss", title: "The floss rule: ff ll ss zz", tip: "After a short vowel, f, l, s and z are often doubled at the end.", focus: ["ff", "ll", "ss", "zz"],
        words: ["bell", "doll", "fill", "hill", "well", "cuff", "puff", "off", "miss", "kiss", "boss", "less", "buzz", "fizz", "jazz"],
        check: ["grill", "fluff", "cross"] },
      { id: "tch", title: "tch", tip: "After a short vowel, the 'ch' sound at the end is usually spelled tch.",
        words: ["catch", "match", "patch", "fetch", "ditch", "witch", "pitch", "hutch", "notch", "stitch", "sketch", "clutch", "crutch", "scratch", "switch"],
        check: ["hatch", "latch", "snatch"] },
      { id: "qu-x", title: "qu and x", tip: "qu is the code for two sounds, k and w: quick, quiz. x is the code for two sounds too, k and s: fox, six.", focus: ["qu", "x"],
        words: ["quick", "quiz", "quilt", "quest", "quack", "quit", "squid", "liquid", "fox", "box", "six", "fix", "wax", "next", "exit"],
        check: ["quip", "flex"] }
    ]
  },
  {
    stage: "Stage 3 · Silent e (split digraphs)",
    colour: "#7c3aed",
    lists: [
      { id: "a-e", title: "a–e (silent e and long a)", tip: "The silent e makes the a say its name: cap → cape.",
        words: ["cake", "make", "wake", "gave", "brave", "came", "name", "date", "safe", "sale", "tape", "plate", "game", "shade", "snake"],
        check: ["flake", "crate", "grape"] },
      { id: "i-e", title: "i–e (silent e and long i)", tip: "The silent e makes the i say its name: kit → kite.",
        words: ["bike", "like", "time", "line", "kite", "ride", "five", "hide", "pipe", "fine", "smile", "slide", "prize", "white", "shine"],
        check: ["spine", "bride", "stripe"] },
      { id: "o-e", title: "o–e (silent e and long o)", tip: "The silent e makes the o say its name: hop → hope.",
        words: ["home", "bone", "hope", "rope", "note", "nose", "rode", "hole", "joke", "stone", "smoke", "those", "globe", "broke", "spoke"],
        check: ["drove", "throne", "slope"] },
      { id: "u-e", title: "u–e (silent e and long u)", tip: "The silent e makes the u say its name: cub → cube.",
        words: ["cube", "tube", "mule", "cute", "huge", "rule", "flute", "tune", "dune", "prune", "use", "fume", "rude", "crude", "mute"],
        check: ["fuse", "flume"] },
      { id: "e-e", title: "e–e (silent e and long e)", tip: "The silent e makes the e say its name. This one is rarer!",
        words: ["these", "theme", "sc-e_e-n", "complete", "delete", "compete", "extreme", "concrete", "athlete", "stampede"],
        check: ["trapeze"] }
    ]
  },
  {
    stage: "Stage 4 · Vowel teams",
    colour: "#db2777",
    lists: [
      { id: "ee", title: "ee", tip: "When two e's go walking, they say 'ee'.",
        words: ["tree", "feet", "seed", "green", "sleep", "week", "bee", "see", "deep", "keep", "need", "sheep", "street", "three", "cheek"],
        check: ["sweet", "creep", "sheet"] },
      { id: "ea", title: "ea (long e)", tip: "e + a can also make the 'ee' sound.",
        words: ["sea", "tea", "leaf", "meat", "beach", "clean", "dream", "eat", "team", "seat", "peach", "speak", "cream", "heat", "bean"],
        check: ["beak", "cheap", "steam"] },
      { id: "ai", title: "ai", tip: "ai makes the long 'a' sound, usually in the middle of a word.",
        words: ["rain", "train", "paint", "tail", "snail", "wait", "chain", "brain", "nail", "paid", "main", "sail", "drain", "plain", "rail"],
        check: ["faint", "grain", "stain"] },
      { id: "ay", title: "ay", tip: "ay makes the long 'a' sound, usually at the end of a word.",
        words: ["day", "play", "stay", "say", "may", "way", "tray", "spray", "clay", "pray", "a-w-ay", "today", "crayon", "delay", "sway"],
        check: ["hay", "stray", "payday"] },
      { id: "oa", title: "oa", tip: "oa makes the long 'o' sound, usually in the middle of a word.",
        words: ["boat", "coat", "goat", "road", "soap", "toad", "foam", "loaf", "float", "toast", "coach", "cloak", "groan", "throat", "moan"],
        check: ["load", "roam", "coast"] },
      { id: "ow-long", title: "ow (as in snow)", tip: "ow can make the long 'o' sound, often at the end of a word.",
        words: ["snow", "grow", "blow", "show", "slow", "low", "glow", "flow", "crow", "throw", "window", "yellow", "follow", "elbow", "a-rr-ow"],
        check: ["mow", "shown", "rainbow"] },
      { id: "igh", title: "igh", tip: "Three letters, one sound: igh says the long 'i'.",
        words: ["high", "night", "light", "right", "sight", "fight", "might", "bright", "flight", "fright", "tight", "sigh", "thigh", "slight", "delight"],
        check: ["tonight", "mighty"] },
      { id: "y-sky", title: "y at the end (as in sky)", tip: "At the end of a short word, y is the code for the long i sound: sky, fly, cry, my.", focus: ["y"],
        words: ["fly", "sky", "spy", "cry", "fry", "dry", "try", "why", "shy", "my", "by", "flying"],
        check: ["sly", "reply"] },
      { id: "i-kind", title: "i (as in kind)", tip: "Before nd or ld, the letter i is often the code for the long i sound: kind, find, child, wild.", focus: ["i"],
        words: ["hi", "k-i-n-d", "f-i-n-d", "m-i-n-d", "blind", "b-e-h-i-n-d", "ch-i-l-d", "w-i-l-d", "mild", "pint", "grind"],
        check: ["rind", "remind"] },
      { id: "oo-long", title: "oo (as in moon)", tip: "oo can make a long sound, like in moon.",
        words: ["moon", "food", "room", "soon", "spoon", "zoo", "pool", "roof", "boot", "cool", "tooth", "broom", "school", "stool", "noon"],
        check: ["hoop", "bloom", "scoop"] },
      { id: "oo-short", title: "oo (as in book)", tip: "oo can make a short sound, like in book.",
        words: ["book", "look", "cook", "good", "foot", "wood", "hook", "took", "wool", "shook", "brook", "crook", "hood", "stood", "nook"],
        check: ["wooden", "footprint"] },
      { id: "ou", title: "ou (as in cloud)", tip: "ou makes the 'ow' sound, usually in the middle of a word.",
        words: ["out", "loud", "cloud", "shout", "house", "mouse", "round", "found", "sound", "mouth", "south", "ground", "count", "proud", "pound"],
        check: ["pouch", "snout", "cloudy"] },
      { id: "ow-cow", title: "ow (as in cow)", tip: "ow can make the 'ow' sound too — often at the end, or before n or l.",
        words: ["cow", "how", "now", "town", "brown", "clown", "down", "owl", "crown", "flower", "frown", "gown", "howl", "growl", "tower"],
        check: ["drown", "scowl", "towel"] },
      { id: "oi-oy", title: "oi and oy", tip: "oi goes in the middle of a word, oy goes at the end.", focus: ["oi", "oy"],
        words: ["coin", "join", "oil", "boil", "soil", "point", "noise", "voice", "spoil", "foil", "boy", "toy", "joy", "enjoy", "annoy"],
        check: ["moist", "toilet", "royal"] },
      { id: "aw-au", title: "aw and au", tip: "aw and au make the same sound. aw is often at the end.", focus: ["aw", "au"],
        words: ["saw", "paw", "draw", "straw", "claw", "crawl", "yawn", "dawn", "lawn", "jaw", "haul", "sauce", "author", "au-t-u-mn", "fault"],
        check: ["hawk", "shawl", "launch"] },
      { id: "ew-ue", title: "ew and ue", tip: "ew and ue both make the long 'oo' or 'yoo' sound.", focus: ["ew", "ue"],
        words: ["new", "few", "grew", "chew", "blew", "flew", "drew", "crew", "stew", "screw", "blue", "glue", "clue", "true", "rescue"],
        check: ["threw", "statue", "newt"] }
    ]
  },
  {
    stage: "Stage 5 · Vowels with r",
    colour: "#ea580c",
    lists: [
      { id: "ar", title: "ar", tipScottish: "Say both sounds: a, then r. Car is c-a-r.", tip: "a + r work together to make the 'ar' sound.",
        words: ["car", "star", "park", "farm", "card", "hard", "dark", "shark", "start", "garden", "jar", "arm", "cart", "smart", "scarf"],
        check: ["harp", "march", "sharp"] },
      { id: "or", title: "or", tipScottish: "Say both sounds: o, then r. Fork is f-o-r-k.", tip: "o + r work together to make the 'or' sound.",
        words: ["for", "fork", "corn", "horse", "short", "sport", "storm", "born", "horn", "torch", "north", "morning", "cord", "snort", "thorn"],
        check: ["porch", "stork", "sort"] },
      { id: "er-ir-ur", title: "er, ir and ur", tipScottish: "You can hear the vowel before the r: h-e-r, b-i-r-d, f-u-r. Listen for it, and look carefully at which one each word uses.", tip: "er, ir and ur can sound alike. Look carefully at which one each word uses.", focus: ["er", "ir", "ur"],
        words: ["her", "term", "fern", "herd", "bird", "girl", "first", "shirt", "third", "skirt", "burn", "fur", "hurt", "turn", "church"],
        check: ["perch", "twirl", "curl"] },
      { id: "air-are", title: "air and are", tipScottish: "Say the sound before the r, then the r. air and are say the same thing, so look carefully!", tip: "air and are make the same sound. Look carefully!", focus: ["air", "are"],
        words: ["hair", "chair", "fair", "pair", "stair", "care", "share", "stare", "scare", "square", "dare", "spare", "bare", "flare", "glare"],
        check: ["repair", "beware"] },
      { id: "ear-eer", title: "ear and eer", tipScottish: "You hear ee, then r: n-ea-r, d-ee-r. ear and eer say the same thing, so look carefully!", tip: "ear and eer make the same sound. Look carefully!", focus: ["ear", "eer"],
        words: ["ear", "hear", "near", "fear", "year", "clear", "beard", "dear", "gear", "spear", "deer", "cheer", "steer", "peer", "sneer"],
        check: ["smear", "cheerful"] }
    ]
  },
  {
    stage: "Stage 6 · Endings and tricky bits",
    colour: "#15803d",
    lists: [
      { id: "ing", title: "Adding -ing", tip: "Keep the whole word, then add ing.",
        words: ["jumping", "singing", "playing", "reading", "eating", "sleeping", "helping", "looking", "g-o-i-ng", "w-al-k-i-ng", "fishing", "drinking", "kicking", "standing", "melting"],
        check: ["camping", "rocking", "sending"] },
      { id: "s-es", title: "Plurals: -s and -es", tip: "Add es after s, x, sh and ch. Add s to everything else.",
        words: ["cats", "dogs", "hats", "beds", "boxes", "foxes", "dishes", "wishes", "buses", "brushes", "churches", "benches", "glasses", "watches", "kisses"],
        check: ["cups", "buzzes", "lunches"] },
      { id: "y-ee", title: "y at the end (as in happy)", tip: "At the end of a longer word, y often makes the 'ee' sound, as in happy, baby, silly, angry and copy.", ordered: true,
        words: ["baby", "copy", "happy", "silly", "funny", "sunny", "jelly", "puppy", "bunny", "lucky", "penny", "teddy", "windy", "angry", "hungry"],
        check: ["jolly", "sandy", "foggy"] },
      { id: "le", title: "-le endings", tip: "Lots of words end with le.",
        words: ["table", "apple", "bottle", "little", "middle", "puddle", "candle", "j-u-n-g-le", "purple", "simple", "giggle", "bubble", "pebble", "handle", "tickle"],
        check: ["paddle", "wobble", "nibble"] },
      { id: "soft-c-g", title: "Soft c and soft g", tip: "Before e, i or y, c usually says 's' and g often says 'j'.", focus: ["c", "g", "ce", "ge"],
        words: ["city", "cent", "ice", "rice", "face", "race", "place", "mice", "gem", "giant", "page", "cage", "huge", "stage", "large"],
        check: ["pencil", "fence", "gentle"] },
      { id: "kn-wr", title: "Silent letters: kn and wr", tip: "The k in kn and the w in wr are silent.", focus: ["kn", "wr"],
        words: ["knee", "knit", "knock", "knot", "know", "knife", "knight", "kneel", "write", "wrap", "wrist", "wrong", "wren", "wreck", "wriggle"],
        check: ["knob", "wrote"] },
      { id: "mb", title: "Silent b: mb", tip: "At the end of a word, mb is one way to write the m sound. The b is silent: lamb, thumb, climb.", focus: ["mb"],
        words: ["l-a-mb", "th-u-mb", "n-u-mb", "b-o-mb", "c-r-u-mb", "l-i-mb", "c-l-i-mb", "c-o-mb"],
        check: ["d-u-mb", "l-a-mb-s"] },
      { id: "ph", title: "ph", tip: "p + h makes the 'f' sound.",
        words: ["phone", "photo", "graph", "dolphin", "elephant", "alphabet", "phonics", "trophy", "sphere", "nephew", "orphan", "microphone"],
        check: ["photograph"] },
      { id: "tricky", title: "Tricky words", tip: "These words have a tricky part that doesn't follow the usual rules.", focus: [],
        // Wherever these words appear they're kept whole, with a heart instead of sound buttons
        words: ["the", "said", "was", "they", "have", "come", "some", "one", "do", "you", "were", "there", "could", "would", "people"] },
      // The rest of the tricky words in the EA Literacy Stage 1 lists (Blocks 1 to 9)
      { id: "tricky-2", title: "More tricky words (1 of 2)", tip: "Words to know by sight. Sound out the parts you can, then learn the tricky part by heart.", focus: [], tricky: ["are", "of", "to"],
        words: ["I", "is", "are", "of", "be", "me", "we", "he", "to", "so", "go", "no"] },
      { id: "tricky-3", title: "More tricky words (2 of 2)", tip: "Words to know by sight. Sound out the parts you can, then learn the tricky part by heart.", focus: [],
        words: ["her", "she", "my", "by", "his", "what", "if", "came", "into", "like", "all", "here"] }
    ]
  },
  {
    // Sara's EA Literacy Stage 3 phoneme word lists, block by block (Blocks 1 to 9). Each list is one
    // more way to write a sound pupils already know. Words keep the list's grapheme as one sound
    // button, so some are written with dashes (t-ie-d). The tips follow the EA advice: letters are
    // the code for speech sounds, so they don't "make" or "say" sounds.
    stage: "Stage 7 · More ways to write sounds (EA Stage 3)",
    colour: "#a16207",
    level: "First",
    lists: [
      { id: "wr", title: "wr (as in write)", tip: "wr is one way to write the r sound at the start of a word. The w is silent: write, wrong, wrap.", focus: ["wr"],
        words: ["write", "wrist", "wrote", "wrong", "wren", "wreck", "wrap", "written"],
        check: ["wrench", "wriggle"] },
      { id: "wa", title: "wa (as in was)", tip: "After w, the letter a is often the code for the o sound, as in was, wash and swan. It isn't a digraph: w and a are two sounds.", focus: ["a"],
        words: ["w-a-s", "walk", "wash", "wall", "warm", "swan", "wasp", "swallow", "wander"],
        check: ["want", "swap"] },
      { id: "all", title: "a before ll (as in all)", tip: "Before ll, l or lk, the letter a is often the code for the aw sound: all, call, talk, always.", focus: ["a"],
        words: ["all", "call", "fall", "tall", "hall", "ball", "mall", "talk", "also", "always", "small"],
        check: ["stall", "chalk"] },
      { id: "ea-bread", title: "ea (as in bread)", tip: "ea can be the code for the short e sound, as in head, bread and feather.", focus: ["ea"],
        words: ["head", "dead", "bread", "deaf", "read", "ready", "weather", "feather", "health", "spread"],
        check: ["breath", "heavy"] },
      { id: "ie-tried", title: "ie (as in tried)", tip: "ie is one way to write the long i sound, as in pie, tie and tried.", focus: ["ie"],
        words: ["p-ie", "l-ie", "d-ie", "t-ie", "t-ie-d", "c-r-ie-d", "t-r-ie-d", "f-r-ie-s", "d-r-ie-d", "l-ie-d"],
        check: ["f-r-ie-d", "s-p-ie-d"] },
      { id: "u-push", title: "u (as in push)", tip: "The letter u can be the code for the oo sound in book, as in push, pull and full.", focus: ["u"],
        words: ["p-u-sh", "b-u-sh", "p-u-ll", "f-u-ll", "b-u-ll"],
        check: ["p-u-t", "b-u-sh-e-s"] },
      { id: "u-unit", title: "u (as in unit)", tip: "The letter u can be the code for the yoo sound, as in unit, music and human.", focus: ["u"],
        words: ["unit", "computer", "music", "human", "stupid", "tulip"],
        check: ["pupil", "menu"] },
      { id: "tch-itch", title: "tch (as in itch)", tip: "tch is one way to write the ch sound, straight after a short vowel: itch, catch, kitchen.", focus: ["tch"],
        words: ["itch", "witch", "ditch", "stitch", "catch", "hatch", "patch", "snatch", "watch", "scratch", "kitchen"],
        check: ["fetch", "hutch", "sketch"] },
      { id: "se", title: "se at the end (as in nurse)", tip: "At the end of a word, the s sound or the z sound is often written se: nurse, house, please, cheese.", focus: ["se"],
        words: ["nurse", "purse", "curse", "mouse", "house", "horse", "loose", "please", "noise", "cheese", "l-o-se"],
        check: ["goose", "tease"] },
      { id: "ve", title: "ve at the end (as in have)", tip: "English words don't end in v, so the v sound at the end is written ve: have, give, sleeve.", focus: ["ve"],
        words: ["h-a-ve", "g-i-ve", "l-i-ve", "leave", "m-o-ve", "sleeve", "starve", "curve"],
        check: ["carve", "g-l-o-ve"] },
      { id: "c-city", title: "Soft c (as in city)", tip: "When c comes before e, i or y, it is usually the code for the s sound: city, cell, ice.", focus: ["c", "ce"],
        words: ["city", "icy", "cent", "circle", "circus", "cell", "place", "face", "race", "ice", "rice"],
        check: ["pencil", "fence", "mice"] },
      { id: "g-gem", title: "Soft g (as in gem)", tip: "When g comes before e, i or y, it is often the code for the j sound: gem, cage, magic.", focus: ["g", "ge"],
        words: ["gem", "gel", "age", "cage", "rage", "stage", "angel", "huge", "magic"],
        check: ["giant", "gentle"] },
      { id: "ea-break", title: "ea (as in break)", tip: "In just a few words, ea is the code for the ay sound: break, great and steak.", focus: ["ea"],
        words: ["b-r-ea-k", "g-r-ea-t", "s-t-ea-k"] },
      { id: "ey", title: "ey (as in they)", tip: "ey is one way to write the ay sound, as in they, grey and obey. In some accents it's the ay sound in turkey, valley and trolley too.", focus: ["ey"],
        words: ["th-ey", "g-r-ey", "o-b-ey", "p-r-ey", "t-u-r-k-ey", "v-a-ll-ey", "t-r-o-ll-ey"],
        check: ["h-ey", "m-o-n-k-ey"] },
      { id: "ie-field", title: "ie (as in field)", tip: "ie can be the code for the ee sound, as in field, piece and chief.", focus: ["ie"],
        words: ["f-ie-l-d", "sh-ie-l-d", "p-ie-ce", "n-ie-ce", "th-ie-f", "ch-ie-f"],
        check: ["b-r-ie-f", "g-r-ie-f"] },
      { id: "ou-four", title: "ou (as in four)", tip: "ou can be the code for the sound in four and pour, and the oa sound in soul and shoulder.", focus: ["ou"],
        words: ["four", "pour", "course", "soul", "boulder", "shoulder"],
        check: ["court", "mould"] },
      { id: "oe", title: "oe (as in toe)", tip: "oe is one way to write the long o sound, usually at the end of a word: toe, hoe, goes.", focus: ["oe"],
        words: ["t-oe", "f-oe", "d-oe", "h-oe", "g-oe-s"],
        check: ["w-oe", "t-i-p-t-oe"] },
      { id: "ou-you", title: "ou (as in you)", tip: "ou can be the code for the oo sound, as in you, soup and group. In could, would and should, oul is the code for the oo sound in book.", focus: ["ou", "oul"],
        words: ["y-ou", "y-ou-r", "soup", "group", "wound", "yourself", "route", "youth", "c-oul-d", "w-oul-d", "sh-oul-d"],
        check: ["coupon", "yours"] },
      { id: "ch-school", title: "ch (as in school)", tip: "In some words, ch is the code for the k sound: school, echo, chorus, ache.", focus: ["ch"],
        words: ["s-ch-oo-l", "echo", "choir", "chord", "chorus", "a_e-ch"],
        check: ["anchor", "stomach"] },
      { id: "y-gym", title: "y (as in gym)", tip: "In the middle of a word, y can be the code for the short i sound: gym, myth, pyramid.", focus: ["y"],
        words: ["gym", "lynx", "myth", "syrup", "pyramid"],
        check: ["crystal", "cymbal"] },
      { id: "gn", title: "gn (as in sign)", tip: "gn is one way to write the n sound. At the start (gnat) or the end (sign) of a word, the g is silent.", focus: ["gn"],
        words: ["s-i-gn", "d-e-s-i-gn", "gn-aw", "gn-o_e-m", "gn-a-t"],
        check: ["gn-a-sh", "s-i-gn-p-o-s-t"] },
      { id: "ture", title: "ture (as in picture)", tip: "At the end of a word, ture is said like 'cher': picture, nature. In century, the t is the code for the ch sound too.", focus: ["ture", "t"],
        words: ["p-i-c-ture", "c-a-p-ture", "m-i-x-ture", "n-a-ture", "c-e-n-t-u-r-y"],
        check: ["f-u-ture", "a-d-v-e-n-ture"] },
      { id: "dge", title: "dge (as in edge)", tip: "dge is one way to write the j sound, straight after a short vowel: edge, fudge, bridge.", focus: ["dge", "dg"],
        words: ["e-dge", "h-e-dge", "l-e-dge", "f-u-dge", "j-u-dge", "b-r-i-dge", "b-a-dg-e-r", "f-r-i-dge"],
        check: ["b-a-dge", "s-m-u-dge"] },
      { id: "o-some", title: "o (as in some)", tip: "The letter o can be the code for the short u sound, as in son, come, mother and love.", focus: ["o"],
        words: ["son", "won", "d-o-ne", "work", "c-o-me", "s-o-me", "month", "other", "mother", "front", "l-o-ve"],
        check: ["o-v-e-n", "d-o-z-e-n"] },
      { id: "ough", title: "ough (as in thought)", tip: "ough is a tricky one: it is the code for different sounds in thought, through and dough. Learn each word.", focus: ["ough"],
        words: ["th-ough-t", "b-ough-t", "f-ough-t", "th-r-ough", "d-ough"],
        check: ["b-r-ough-t", "ough-t"] },
      { id: "ch-chef", title: "ch (as in chef)", tip: "In some words that came from French, ch is the code for the sh sound: chef, chalet, parachute.", focus: ["ch"],
        words: ["chef", "chalet", "chute", "p-a-r-a-ch-u_e-t", "machine"],
        check: ["b-r-o-ch-u-r-e"] },
      { id: "ti", title: "ti (as in nation)", tip: "Before on, ti is the code for the sh sound: station, nation, action, fraction.", focus: ["ti"],
        words: ["s-t-a-ti-o-n", "n-a-ti-o-n", "a-c-ti-o-n", "f-r-a-c-ti-o-n", "s-e-c-ti-o-n"],
        check: ["m-o-ti-o-n", "p-o-ti-o-n"] }
    ]
  }
];

/* England's statutory spelling words (English Appendix 1: Spelling, the national curriculum in England).
   They're kept apart from the phonics stages above, so the journey every pupil sees doesn't change:
   teachers find them in the Library, Assign and the Programme. "tricky" words are shown whole with a
   heart; "trickyEnglish" ones only with the English accent, where their a says "ar". */
window.ENGLAND_LISTS = [
  {
    stage: "England · Statutory spelling words",
    colour: "#7c3aed",
    england: true,
    lists: [
      { id: "cew-y1-1", title: "Year 1 common exception words (1 of 3)", tip: "Common exception words: sound out the parts that follow the rules, and learn the tricky part (♥) by heart.", focus: [],
        words: ["the", "a", "do", "to", "today", "of", "said", "says", "are", "were", "was", "is", "his", "has", "I"], tricky: ["the", "do", "to", "today", "of", "said", "says", "are", "were", "was"] },
      { id: "cew-y1-2", title: "Year 1 common exception words (2 of 3)", tip: "Common exception words: sound out the parts that follow the rules, and learn the tricky part (♥) by heart.", focus: [],
        words: ["you", "your", "they", "be", "he", "me", "she", "we", "no", "go", "so", "by", "my", "here", "there"], tricky: ["you", "your", "they", "be", "he", "me", "she", "we", "no", "go", "so", "by", "my", "here", "there"] },
      { id: "cew-y1-3", title: "Year 1 common exception words (3 of 3)", tip: "Common exception words: sound out the parts that follow the rules, and learn the tricky part (♥) by heart.", focus: [],
        words: ["where", "love", "come", "some", "one", "once", "ask", "friend", "school", "put", "push", "pull", "full", "house", "our"], tricky: ["where", "love", "come", "some", "one", "once", "friend", "school", "put", "push", "pull", "full", "our"] },
      { id: "y1-days", title: "Year 1: the days of the week", tip: "English Appendix 1 asks Year 1 to spell the days of the week. Each starts with a capital letter. Sound out the regular parts and learn the tricky part (♥): the o in Monday, the d in Wednesday.", focus: [],
        words: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], tricky: ["Monday", "Wednesday"] },
      { id: "cew-y2-1", title: "Year 2 common exception words (1 of 5)", tip: "Common exception words: sound out the parts that follow the rules, and learn the tricky part (♥) by heart.", focus: [],
        words: ["door", "floor", "poor", "because", "find", "kind", "mind", "behind", "child", "children", "wild", "climb", "most"], tricky: ["door", "floor", "poor", "because", "find", "kind", "mind", "behind", "child", "wild", "climb", "most"] },
      { id: "cew-y2-2", title: "Year 2 common exception words (2 of 5)", tip: "Common exception words: sound out the parts that follow the rules, and learn the tricky part (♥) by heart.", focus: [],
        words: ["only", "both", "old", "cold", "gold", "hold", "told", "every", "everybody", "even", "great", "break", "steak"], tricky: ["only", "both", "old", "cold", "gold", "hold", "told", "every", "everybody", "even", "great", "break", "steak"] },
      { id: "cew-y2-3", title: "Year 2 common exception words (3 of 5)", tip: "Common exception words: sound out the parts that follow the rules, and learn the tricky part (♥) by heart.", focus: [],
        words: ["pretty", "beautiful", "after", "fast", "last", "past", "father", "class", "grass", "pass", "plant", "path", "bath"], tricky: ["pretty", "beautiful"], trickyEnglish: ["after", "fast", "last", "past", "father", "class", "grass", "pass", "plant", "path", "bath"] },
      { id: "cew-y2-4", title: "Year 2 common exception words (4 of 5)", tip: "Common exception words: sound out the parts that follow the rules, and learn the tricky part (♥) by heart.", focus: [],
        words: ["hour", "move", "prove", "improve", "sure", "sugar", "eye", "could", "should", "would", "who", "whole", "any"], tricky: ["hour", "move", "prove", "improve", "sure", "sugar", "eye", "could", "should", "would", "who", "whole", "any"] },
      { id: "cew-y2-5", title: "Year 2 common exception words (5 of 5)", tip: "Common exception words: sound out the parts that follow the rules, and learn the tricky part (♥) by heart.", focus: [],
        words: ["many", "clothes", "busy", "people", "water", "again", "half", "money", "Mr", "Mrs", "parents", "Christmas"], tricky: ["many", "clothes", "busy", "people", "water", "again", "half", "money", "Mr", "Mrs", "parents", "Christmas"] },
      { id: "wl-y34-1", title: "Years 3 and 4 word list (1 of 8)", tip: "From the statutory word list for Years 3 and 4. Say it in syllables, spot the tricky part, then look, cover, write and check.", focus: [],
        words: ["accident-", "accidentally-", "actual-", "actually-", "address-", "answer-", "appear-", "arrive-", "believe-", "bicycle-", "breath-", "breathe-", "build-", "busy-"] },
      { id: "wl-y34-2", title: "Years 3 and 4 word list (2 of 8)", tip: "From the statutory word list for Years 3 and 4. Say it in syllables, spot the tricky part, then look, cover, write and check.", focus: [],
        words: ["business-", "calendar-", "caught-", "centre-", "century-", "certain-", "circle-", "complete-", "consider-", "continue-", "decide-", "describe-", "different-", "difficult-"] },
      { id: "wl-y34-3", title: "Years 3 and 4 word list (3 of 8)", tip: "From the statutory word list for Years 3 and 4. Say it in syllables, spot the tricky part, then look, cover, write and check.", focus: [],
        words: ["disappear-", "early-", "earth-", "eight-", "eighth-", "enough-", "exercise-", "experience-", "experiment-", "extreme-", "famous-", "favourite-", "February-", "forward-"] },
      { id: "wl-y34-4", title: "Years 3 and 4 word list (4 of 8)", tip: "From the statutory word list for Years 3 and 4. Say it in syllables, spot the tricky part, then look, cover, write and check.", focus: [],
        words: ["forwards-", "fruit-", "grammar-", "group-", "guard-", "guide-", "heard-", "heart-", "height-", "history-", "imagine-", "increase-", "important-", "interest-"] },
      { id: "wl-y34-5", title: "Years 3 and 4 word list (5 of 8)", tip: "From the statutory word list for Years 3 and 4. Say it in syllables, spot the tricky part, then look, cover, write and check.", focus: [],
        words: ["island-", "knowledge-", "learn-", "length-", "library-", "material-", "medicine-", "mention-", "minute-", "natural-", "naughty-", "notice-", "occasion-", "occasionally-"] },
      { id: "wl-y34-6", title: "Years 3 and 4 word list (6 of 8)", tip: "From the statutory word list for Years 3 and 4. Say it in syllables, spot the tricky part, then look, cover, write and check.", focus: [],
        words: ["often-", "opposite-", "ordinary-", "particular-", "peculiar-", "perhaps-", "popular-", "position-", "possess-", "possession-", "possible-", "potatoes-", "pressure-", "probably-"] },
      { id: "wl-y34-7", title: "Years 3 and 4 word list (7 of 8)", tip: "From the statutory word list for Years 3 and 4. Say it in syllables, spot the tricky part, then look, cover, write and check.", focus: [],
        words: ["promise-", "purpose-", "quarter-", "question-", "recent-", "regular-", "reign-", "remember-", "sentence-", "separate-", "special-", "straight-", "strange-", "strength-"] },
      { id: "wl-y34-8", title: "Years 3 and 4 word list (8 of 8)", tip: "From the statutory word list for Years 3 and 4. Say it in syllables, spot the tricky part, then look, cover, write and check.", focus: [],
        words: ["suppose-", "surprise-", "therefore-", "though-", "although-", "thought-", "through-", "various-", "weight-", "woman-", "women-"] },
      { id: "wl-y56-1", title: "Years 5 and 6 word list (1 of 7)", tip: "From the statutory word list for Years 5 and 6. Say it in syllables, look for a root word you know, then look, cover, write and check.", focus: [],
        words: ["accommodate-", "accompany-", "according-", "achieve-", "aggressive-", "amateur-", "ancient-", "apparent-", "appreciate-", "attached-", "available-", "average-", "awkward-", "bargain-", "bruise-"] },
      { id: "wl-y56-2", title: "Years 5 and 6 word list (2 of 7)", tip: "From the statutory word list for Years 5 and 6. Say it in syllables, look for a root word you know, then look, cover, write and check.", focus: [],
        words: ["category-", "cemetery-", "committee-", "communicate-", "community-", "competition-", "conscience-", "conscious-", "controversy-", "convenience-", "correspond-", "criticise-", "curiosity-", "definite-", "desperate-"] },
      { id: "wl-y56-3", title: "Years 5 and 6 word list (3 of 7)", tip: "From the statutory word list for Years 5 and 6. Say it in syllables, look for a root word you know, then look, cover, write and check.", focus: [],
        words: ["determined-", "develop-", "dictionary-", "disastrous-", "embarrass-", "environment-", "equip-", "equipped-", "equipment-", "especially-", "exaggerate-", "excellent-", "existence-", "explanation-", "familiar-"] },
      { id: "wl-y56-4", title: "Years 5 and 6 word list (4 of 7)", tip: "From the statutory word list for Years 5 and 6. Say it in syllables, look for a root word you know, then look, cover, write and check.", focus: [],
        words: ["foreign-", "forty-", "frequently-", "government-", "guarantee-", "harass-", "hindrance-", "identity-", "immediate-", "immediately-", "individual-", "interfere-", "interrupt-", "language-", "leisure-"] },
      { id: "wl-y56-5", title: "Years 5 and 6 word list (5 of 7)", tip: "From the statutory word list for Years 5 and 6. Say it in syllables, look for a root word you know, then look, cover, write and check.", focus: [],
        words: ["lightning-", "marvellous-", "mischievous-", "muscle-", "necessary-", "neighbour-", "nuisance-", "occupy-", "occur-", "opportunity-", "parliament-", "persuade-", "physical-", "prejudice-", "privilege-"] },
      { id: "wl-y56-6", title: "Years 5 and 6 word list (6 of 7)", tip: "From the statutory word list for Years 5 and 6. Say it in syllables, look for a root word you know, then look, cover, write and check.", focus: [],
        words: ["profession-", "programme-", "pronunciation-", "queue-", "recognise-", "recommend-", "relevant-", "restaurant-", "rhyme-", "rhythm-", "sacrifice-", "secretary-", "shoulder-", "signature-", "sincere-"] },
      { id: "wl-y56-7", title: "Years 5 and 6 word list (7 of 7)", tip: "From the statutory word list for Years 5 and 6. Say it in syllables, look for a root word you know, then look, cover, write and check.", focus: [],
        words: ["sincerely-", "soldier-", "stomach-", "sufficient-", "suggest-", "symbol-", "system-", "temperature-", "thorough-", "twelfth-", "variety-", "vegetable-", "vehicle-", "yacht-"] }
    ]
  }
];
