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
     the list's main sound. It can be left out.
   • "colour" is the colour used for that stage's cards.
   • "check" (optional) is 2–3 NEW words with the same pattern, given at the end
     without being shown first, to see whether the pupil can use the rule.
   • Each word's sentence is in sentences.js.

  Sounds (graphemes):
   The site splits each word into its sounds by itself (cake → c · a–e · k)
   and draws sound buttons under them. If it gets a word wrong, write the
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
  title: "Spelling Practice",
  subtitle: "Listen · Say the sounds · Spell it",
  fontFile: "",
  firebase: {
    // Paste the "firebaseConfig" values from Firebase console → Project settings → Your apps
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: ""
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
        check: ["pup", "hum", "dug"] }
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
        check: ["hatch", "latch", "snatch"] }
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
      { id: "ar", title: "ar", tip: "a + r work together to make the 'ar' sound.",
        words: ["car", "star", "park", "farm", "card", "hard", "dark", "shark", "start", "garden", "jar", "arm", "cart", "smart", "scarf"],
        check: ["harp", "march", "sharp"] },
      { id: "or", title: "or", tip: "o + r work together to make the 'or' sound.",
        words: ["for", "fork", "corn", "horse", "short", "sport", "storm", "born", "horn", "torch", "north", "morning", "cord", "snort", "thorn"],
        check: ["porch", "stork", "sort"] },
      { id: "er-ir-ur", title: "er, ir and ur", tip: "er, ir and ur can sound alike. Look carefully at which one each word uses.", focus: ["er", "ir", "ur"],
        words: ["her", "term", "fern", "herd", "bird", "girl", "first", "shirt", "third", "skirt", "burn", "fur", "hurt", "turn", "church"],
        check: ["perch", "twirl", "curl"] },
      { id: "air-are", title: "air and are", tip: "air and are make the same sound. Look carefully!", focus: ["air", "are"],
        words: ["hair", "chair", "fair", "pair", "stair", "care", "share", "stare", "scare", "square", "dare", "spare", "bare", "flare", "glare"],
        check: ["repair", "beware"] },
      { id: "ear-eer", title: "ear and eer", tip: "ear and eer make the same sound. Look carefully!", focus: ["ear", "eer"],
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
      { id: "y-ee", title: "y at the end (as in happy)", tip: "At the end of a longer word, y often makes the 'ee' sound.",
        words: ["happy", "funny", "sunny", "puppy", "bunny", "jelly", "silly", "windy", "party", "lucky", "messy", "muddy", "penny", "hobby", "teddy"],
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
      { id: "ph", title: "ph", tip: "p + h makes the 'f' sound.",
        words: ["phone", "photo", "graph", "dolphin", "elephant", "alphabet", "phonics", "trophy", "sphere", "nephew", "orphan", "microphone"],
        check: ["photograph"] },
      { id: "tricky", title: "Tricky words", tip: "These words have a tricky part that doesn't follow the usual rules.", focus: [],
        words: ["the", "said", "was", "th-ey", "h-a-ve", "c-o-me", "s-o-me", "one-", "do", "you", "were", "there", "c-oul-d", "w-oul-d", "p-eo-p-le"] }
    ]
  }
];
