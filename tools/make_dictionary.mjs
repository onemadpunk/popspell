// Writes assets/words/dictionary.txt: the words the word games accept (Code Word guesses, Letter
// Grid words). It is the ENABLE word list (public domain), 3 to 8 letters, plus every word in
// PopSpell's own spelling lists, minus rude and offensive words. Run it again after changing the
// lists or the blocked words:
//   curl -o /tmp/enable1.txt https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt
//   node tools/make_dictionary.mjs /tmp/enable1.txt
import { readFileSync, writeFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = process.argv[2];
if (!source) { console.error("Usage: node tools/make_dictionary.mjs path/to/enable1.txt"); process.exit(1); }
const root = new URL("../", import.meta.url);
const page = {}; page.window = page;
runInNewContext(readFileSync(new URL("words.js", root), "utf8"), page);
const own = (page.SPELLING_LISTS || []).concat(page.ENGLAND_LISTS || [])
  .flatMap(st => st.lists.flatMap(l => l.words.concat(l.checks || [])))
  .map(w => String(w).replace(/-$/, "")).filter(w => /^[a-z]+$/.test(w));

// Words a pupil should never be rewarded for finding. Whole words, plus roots blocked inside longer words.
const BLOCKED = new Set(`arse arses arsed ass asses bastard bastards bitch bitched bitches bitchy bloody bollock bollocks boner
  boob boobs booby bugger buggers buggered butt butts clit coitus condom condoms crap crappy crapped cum cums cunt
  dago dick dicks dildo dyke dykes fag fags faggot fart farts farted fatso fellate gook gooks homo homos
  horny hussy jism jiz kike kikes knob knobs lesbo nazi nazis negro nigga nookie nooky orgasm orgy pecker penis
  pervert pimp piss pissed pisses poof poofs poofter porn porno prick pricks pube pubes rape raped
  rapes rapist shag shags shagged shit shits shitty slag slags slut sluts smut spastic spaz spic sperm
  suck sucks sucked tit tits titty tosser turd turds twat twats vagina wank wanked wanker wanks whore whores
  wog wogs`.split(/\s+/).filter(Boolean));
const BLOCKED_PARTS = ["fuck", "shit", "cunt", "nigg", "wank", "whore", "slut", "porn", "dildo", "fagg", "bitch", "penis", "vagin", "orgasm", "sperm", "twat", "bollock"];
const ok = w => !BLOCKED.has(w) && !BLOCKED_PARTS.some(p => w.includes(p));

const words = new Set(readFileSync(source, "utf8").split(/\r?\n/).map(w => w.trim().toLowerCase())
  .filter(w => /^[a-z]{3,8}$/.test(w)));
own.filter(w => w.length >= 3).forEach(w => words.add(w));
const out = [...words].filter(ok).sort();
writeFileSync(new URL("assets/words/dictionary.txt", root), out.join("\n") + "\n");
console.log(`${out.length} words`);
