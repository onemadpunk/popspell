# Builds england.js from the official statements and PopSpell's mapping below.
#
# The statements come from the Department for Education's documents, word for word:
#   1. Download the primary national curriculum for English and for mathematics (en.pdf, ma.pdf) and the
#      EYFS statutory framework (eyfs.pdf, its text extracted to eyfs.txt) from gov.uk into a folder.
#   2. python -I tools/england_extract.py <folder> tools/england-statements.json
#   3. python -I tools/england_elg.py <folder>/eyfs.txt tools/england-statements.json
#   4. python -I tools/build_england.py   (writes the data section of england.js)
# Check any statement FIX below against the PDF: stacked fractions don't survive text extraction.
import json, re, sys
sys.stdout.reconfigure(encoding="utf-8")
nc_path = sys.argv[1] if len(sys.argv) > 1 else "tools/england-statements.json"
out_path = sys.argv[2] if len(sys.argv) > 2 else "england.js"
nc = json.load(open(nc_path, encoding="utf-8"))

# Official wording where the PDF's stacked fractions and symbols didn't survive text extraction
FIX = {
  "ma-y2-number-fractions-1": "recognise, find, name and write fractions 1/3, 1/4, 2/4 and 3/4 of a length, shape, set of objects or quantity",
  "ma-y2-number-fractions-2": "write simple fractions for example, 1/2 of 6 = 3 and recognise the equivalence of 2/4 and 1/2.",
  "ma-y3-number-fractions-5": "add and subtract fractions with the same denominator within one whole [for example, 5/7 + 1/7 = 6/7]",
  "ma-y4-number-fractions-including-decimals-6": "recognise and write decimal equivalents to 1/4, 1/2, 3/4",
  "ma-y5-number-multiplication-and-division-8": "recognise and use square numbers and cube numbers, and the notation for squared (²) and cubed (³)",
  "ma-y5-number-fractions-including-decimals-and-percentages-3": "recognise mixed numbers and improper fractions and convert from one form to the other and write mathematical statements > 1 as a mixed number [for example, 2/5 + 4/5 = 6/5 = 1 1/5]",
  "ma-y5-number-fractions-including-decimals-and-percentages-6": "read and write decimal numbers as fractions [for example, 0.71 = 71/100]",
  "ma-y5-number-fractions-including-decimals-and-percentages-12": "solve problems which require knowing percentage and decimal equivalents of 1/2, 1/4, 1/5, 2/5, 4/5 and those fractions with a denominator of a multiple of 10 or 25.",
  "ma-y5-geometry-properties-of-shapes-6": "angles at a point on a straight line and 1/2 a turn (total 180°)",
  "ma-y6-number-fractions-including-decimals-and-percentages-4": "multiply simple pairs of proper fractions, writing the answer in its simplest form [for example, 1/4 × 1/2 = 1/8]",
  "ma-y6-number-fractions-including-decimals-and-percentages-5": "divide proper fractions by whole numbers [for example, 1/3 ÷ 2 = 1/6]",
  "ma-y6-number-fractions-including-decimals-and-percentages-6": "associate a fraction with division and calculate decimal fraction equivalents [for example, 0.375] for a simple fraction [for example, 3/8]",
}

ABBR = {
  "npv": "number-number-and-place-value", "as": "number-addition-and-subtraction", "md": "number-multiplication-and-division",
  "asmd": "number-addition-subtraction-multiplication-and-division", "fr": "number-fractions",
  "frd": "number-fractions-including-decimals", "frdp": "number-fractions-including-decimals-and-percentages",
  "me": "measurement", "gs": "geometry-properties-of-shapes", "gp": "geometry-position-and-direction", "st": "statistics",
  "rp": "ratio-and-proportion", "al": "algebra", "num": "number", "pat": "numerical-patterns",
  "sl": "spoken-language", "wr": "reading-word-reading", "rc": "reading-comprehension",
  "sp": "writing-transcription-spelling", "hw": "writing-transcription-handwriting",
  "hwp": "writing-transcription-handwriting-and-presentation", "co": "writing-composition",
  "vgp": "writing-vocabulary-grammar-and-punctuation", "lau": "listening-attention-and-understanding",
  "spk": "speaking", "fms": "fine-motor-skills", "comp": "comprehension", "wread": "word-reading", "wri": "writing",
}
def ref(s):  # "ma 3 md 1" -> ma-y3-number-multiplication-and-division-1
    subj, year, dom, n = s.split()
    return f"{subj}-y{year}-{ABBR[dom]}-{n}"

# Each piece of PopSpell work -> the official statements it practises, the main one first
MAP_SOURCE = open(__file__, encoding="utf-8").read()
MAP = {
  # Maths: games
  "g-canopy-flash": "ma R num 2", "g-canopy-make": "ma R num 1; ma R num 3", "g-canopy-hidden": "ma R num 3; ma 1 as 2",
  "g-canopy-compare": "ma R pat 2; ma 1 npv 4", "g-canopy-twenty": "ma 1 as 2; ma 1 as 3",
  "g-canopy-run": "ma R pat 1; ma 1 npv 3", "g-canopy-run-20": "ma 1 npv 1; ma 1 npv 3",
  # Maths: activities
  "n-add-10": "ma 1 as 3; ma 1 as 1", "n-sub-10": "ma 1 as 3; ma 1 as 1", "n-bonds-10": "ma R num 3; ma 1 as 2",
  "n-bonds-20": "ma 1 as 2; ma 2 as 4", "n-add-20": "ma 1 as 3; ma 2 as 4", "n-sub-20": "ma 1 as 3; ma 2 as 4",
  "n-doubles": "ma 1 md 1; ma R pat 3; ma 1 fr 1", "n-tables-2-5-10": "ma 2 md 1; ma 2 md 2",
  "n-tables-3-4": "ma 3 md 1; ma 3 md 2", "n-tables-6-9": "ma 4 md 1", "n-division": "ma 4 md 1; ma 3 md 1",
  "n-place-value": "ma 2 npv 2; ma 2 npv 3", "n-hundreds": "ma 3 npv 2; ma 3 npv 5", "n-compare": "ma R pat 2; ma 1 npv 4",
  "n-money": "ma 1 me 11; ma 2 me 3; ma 2 me 4; ma 2 me 5", "n-time": "ma 1 me 14; ma 2 me 7",
  "n-fractions": "ma 1 fr 1; ma 1 fr 2; ma 2 fr 1", "n-round-10": "ma 4 npv 7", "n-round-100": "ma 4 npv 7; ma 5 npv 4",
  "n-estimate": "ma 3 as 6; ma 5 as 3", "n-negative": "ma 4 npv 3; ma 5 npv 3; ma 6 npv 3",
  "n-multiples": "ma 5 md 1; ma 5 md 2; ma 5 md 3; ma 6 asmd 5", "n-x10": "ma 4 frd 7; ma 5 md 7",
  "n-big-add": "ma 3 as 5; ma 4 as 1; ma 5 as 1", "n-decimals": "ma 4 frd 5; ma 5 frdp 6; ma 5 frdp 9",
  "n-percent": "ma 5 frdp 11; ma 5 frdp 12; ma 6 rp 2", "n-equivalent": "ma 3 fr 4; ma 4 frd 1; ma 5 frdp 2",
  "n-time-digital": "ma 3 me 4; ma 4 me 5", "n-time-24": "ma 4 me 5; ma 3 me 4", "n-durations": "ma 2 me 6; ma 3 me 7; ma 4 me 6",
  "n-measure": "ma 2 me 1; ma 1 me 7; ma 1 me 8; ma 1 me 9", "n-units": "ma 4 me 1; ma 5 me 1",
  "n-area": "ma 4 me 3; ma 3 me 2; ma 4 me 2; ma 5 me 4", "n-tally": "ma 2 st 1; ma 2 st 2", "n-bar": "ma 3 st 1; ma 3 st 2; ma 2 st 1",
  "n-table": "ma 5 st 2; ma 3 st 1", "n-chance": "",
  "m-shapes-2d": "ma 1 gs 2; ma 2 gs 1", "m-shapes-3d": "ma 1 gs 3; ma 2 gs 2", "m-angles": "ma 3 gs 3; ma 3 gs 2; ma 4 gs 2; ma 5 gs 2",
  "m-patterns": "ma 2 npv 1; ma 1 npv 2; ma 3 npv 1; ma 6 al 2", "m-equations": "ma 2 as 11; ma 1 as 4; ma 3 as 7; ma 6 al 3",
  # Literacy: games and activities
  "g-hopper-short": "en R wread 1; en 1 wr 2", "g-hopper-digraphs": "en R wread 1; en 1 wr 2",
  "g-hopper-long-a": "en 1 wr 2; en 1 sp 2", "g-hopper-r": "en 1 wr 2; en 1 sp 2",
  "g-switch-first": "en R wread 2; en R wri 2; en 1 wr 3", "g-switch-digraphs": "en 1 wr 3; en R wri 2",
  "g-switch-build": "en 1 wr 3; en 2 sp 2",
  "w-capitals": "en 1 vgp 4; en 1 vgp 5", "w-end-marks": "en 1 vgp 4; en 2 vgp 4",
  "w-joining": "en 2 vgp 7; en 1 vgp 3; en 3-4 vgp 5", "w-past-ed": "en 2 vgp 6; en 1 sp 11",
  "r-tricky": "en R wread 3; en 1 wr 4",
  "r-bus": "en 1 rc 8; en R wread 3", "r-shell-shop": "en 1 rc 8; en R wread 3",
  "r-kite": "en 2 rc 14; en 2 rc 13", "r-rain": "en 2 rc 14; en 2 rc 13", "r-storm": "en 2 rc 14; en 3-4 rc 17",
  "r-puppy": "en 3-4 rc 13; en 3-4 rc 14; en 5-6 rc 13",
  "s-d-hen": "en R wread 3; en 1 wr 8", "s-d-jam": "en R wread 3; en 1 wr 8", "s-d-ship": "en 1 wr 8; en R wread 3",
  "s-d-frog": "en 1 wr 8; en R wread 3", "s-d-gull": "en 1 wr 8", "s-d-flute": "en 1 wr 8", "s-d-boat": "en 1 wr 8",
  "s-d-mouse": "en 1 wr 8", "s-d-star": "en 1 wr 8", "s-d-fair": "en 1 wr 8", "s-d-puddle": "en 2 wr 7; en 2 wr 4",
  "s-d-phone": "en 2 wr 7; en 2 wr 4",
  "l-rhyme": "en R comp 3; en 1 rc 6", "l-first-sound": "en R wri 2; en R wread 1", "l-count-sounds": "en R wri 2; en 2 sp 2",
  "lc-bus": "en R lau 1; en R comp 1; en 1 rc 2; en 1-6 sl 1", "lc-shell-shop": "en R lau 1; en R comp 1; en 1 rc 2; en 1-6 sl 1",
  "letter-formation": "en R wri 1; en R fms 1; en 1 hw 2; en 1 hw 3",
  # Spelling lists (Appendix 1 places each pattern in a year)
  "short-a": "en R wri 2; en 1 sp 2", "short-e": "en R wri 2; en 1 sp 2", "short-i": "en R wri 2; en 1 sp 2",
  "short-o": "en R wri 2; en 1 sp 2", "short-u": "en R wri 2; en 1 sp 2",
  "l-blends": "en 1 sp 2", "r-s-blends": "en 1 sp 2", "end-blends": "en 1 sp 2", "sh": "en 1 sp 2", "ch": "en 1 sp 2",
  "th": "en 1 sp 2", "wh": "en 1 sp 12; en 1 sp 2", "ck": "en 1 sp 12", "ng-nk": "en 1 sp 12", "floss": "en 1 sp 12", "tch": "en 1 sp 12",
  "a-e": "en 1 sp 2", "i-e": "en 1 sp 2", "o-e": "en 1 sp 2", "u-e": "en 1 sp 2", "e-e": "en 1 sp 2",
  "ee": "en 1 sp 2", "ea": "en 1 sp 2", "ai": "en 1 sp 2", "ay": "en 1 sp 2", "oa": "en 1 sp 2", "ow-long": "en 1 sp 2",
  "igh": "en 1 sp 2", "oo-long": "en 1 sp 2", "oo-short": "en 1 sp 2", "ou": "en 1 sp 2", "ow-cow": "en 1 sp 2",
  "oi-oy": "en 1 sp 2", "aw-au": "en 1 sp 2", "ew-ue": "en 1 sp 2",
  "ar": "en 1 sp 2", "or": "en 1 sp 2", "er-ir-ur": "en 1 sp 2", "air-are": "en 1 sp 2", "ear-eer": "en 1 sp 2",
  "ing": "en 1 sp 11; en 2 sp 9", "s-es": "en 1 sp 9", "y-ee": "en 1 sp 12", "le": "en 2 sp 9", "soft-c-g": "en 2 sp 9",
  "kn-wr": "en 2 sp 9", "ph": "en 1 sp 12", "tricky": "en 1 sp 3; en 2 sp 4; en 1 wr 4",
  # Ready lessons: extra statements on top of the work each lesson uses
  # Lessons whose own statements set their year (Second-level maths is mostly Years 5 and 6 in England)
  "lesson-early-copying-and-continuing-patterns": "ma R pat 3; ma 1 npv 2",
  "lesson-first-multiplication-facts-2-3-4-5-and-10": "ma 2 md 1; ma 3 md 1",
  "lesson-first-division-sharing-and-grouping": "ma 2 md 2; ma 2 md 4; ma 3 md 2",
  "lesson-first-fractions-of-amounts-and-equivalent-fractions": "ma 3 fr 2; ma 3 fr 4",
  "lesson-first-paying-and-change-within-10": "ma 2 me 5",
  "lesson-first-half-past-quarter-past-and-quarter-to": "ma 2 me 7",
  "lesson-second-rounding-large-numbers-and-decimals": "ma 5 npv 4; ma 5 frdp 8; ma 6 npv 2",
  "lesson-second-place-value-to-a-million": "ma 5 npv 1",
  "lesson-second-decimals-to-three-places": "ma 5 frdp 7; ma 5 frdp 9",
  "lesson-second-adding-and-subtracting-large-numbers-and-decimals": "ma 5 as 1; ma 5 frdp 10",
  "lesson-second-multiplication-and-division-facts-and-10-100-1000": "ma 4 md 1; ma 5 md 7",
  "lesson-second-negative-numbers": "ma 4 npv 3; ma 5 npv 3; ma 6 npv 3",
  "lesson-second-fractions-decimals-and-percentages-are-linked": "ma 5 frdp 11; ma 5 frdp 12; ma 6 frdp 11",
  "lesson-second-percentages-and-fractions-of-amounts": "ma 6 rp 2; ma 5 frdp 12",
  "lesson-second-equivalent-fractions-and-simplest-form": "ma 5 frdp 2; ma 6 frdp 1",
  "lesson-second-12-and-24-hour-time-and-timetables": "ma 4 me 5; ma 5 st 2",
  "lesson-second-estimate-measure-and-convert-metric-units": "ma 5 me 1; ma 6 me 2",
  "lesson-second-classifying-and-measuring-angles": "ma 5 gs 2; ma 5 gs 3",
  "lesson-early-sharing-equally-and-halves": "ma 1 md 1; ma 1 fr 1; ma R pat 3",
  "lesson-early-longer-heavier-and-holds-more": "ma 1 me 2; ma 1 me 3; ma 1 me 4",
  "lesson-early-position-direction-and-symmetry": "ma 1 gp 1",
  "lesson-early-estimate-then-count": "ma R num 2", "lesson-early-counting-to-20-and-beyond": "ma R pat 1; ma 1 npv 1",
  "lesson-early-before-after-and-in-between": "ma 1 npv 3", "lesson-early-days-routines-and-o-clock": "ma 1 me 12; ma 1 me 13",
  "lesson-first-area-by-counting-squares": "ma 4 me 3", "lesson-first-grid-references-and-symmetry": "ma 4 gp 1; ma 4 gs 3",
  "lesson-first-calendars-dates-and-how-long": "ma 1 me 13; ma 3 me 6", "lesson-first-solving-two-step-problems": "ma 4 as 3",
  "lesson-first-turns-right-angles-and-compass-points": "ma 2 gp 2", "lesson-first-numbers-in-life-work-and-history": "",
  "lesson-first-how-likely-is-it": "",
  "lesson-second-order-of-operations": "ma 6 asmd 6", "lesson-second-lines-of-symmetry": "ma 4 gs 3; ma 4 gs 4",
  "lesson-second-maths-in-inventions-life-and-work": "", "lesson-second-probability-and-chance-experiments": "",
  "lesson-second-shape-properties-nets-and-circles": "ma 6 gs 2; ma 6 gs 4", "lesson-second-compass-points-scale-and-coordinates": "ma 6 gp 1",
  "lesson-second-solving-simple-equations": "ma 6 al 3; ma 6 al 4", "lesson-second-square-triangular-and-fibonacci-numbers": "ma 5 md 8; ma 6 al 2",
  "lesson-second-budgets-best-value-profit-and-loss": "ma 4 frd 10; ma 6 asmd 8", "lesson-second-multiplying-by-2-digits-and-dividing-with-decimal-answers": "ma 6 asmd 1; ma 6 asmd 2",
  "lesson-second-graphs-pie-charts-and-reliable-data": "ma 6 st 1", "lesson-second-perimeter-area-and-volume": "ma 5 me 3; ma 6 me 7",
  "lesson-second-durations-units-of-time-speed-and-distance": "ma 5 me 6",
  "lesson-early-talking-about-a-story": "en R comp 1; en R comp 2; en 1 rc 13",
  "lesson-early-listening-taking-turns-and-following-instructions": "en R lau 3; en 1-6 sl 6",
  "lesson-early-writing-a-sentence": "en R wri 3; en 1 co 3; en 1 sp 13",
  "lesson-early-telling-and-drawing-my-own-story": "en R spk 3; en 1 co 4",
  "lesson-early-rhyme-and-patterns-in-words": "en R comp 3; en 1 rc 5; en 1 rc 6",
  "lesson-first-reading-aloud-with-expression": "en 2 wr 6; en 1-6 sl 8",
  "lesson-first-answering-questions-about-a-text": "en 2 rc 17",
  "lesson-first-finding-information-and-making-notes": "en 3-4 rc 17; en 2 co 8",
  "lesson-first-dictation-spelling-and-punctuation-together": "en 1 sp 13; en 2 sp 10",
  "lesson-first-planning-and-writing-a-recount": "en 2 co 3; en 2 co 7",
  "lesson-first-writing-a-story-with-characters-and-a-setting": "en 3-4 co 7; en 2 co 2",
  "lesson-first-listening-for-main-ideas-and-fact-or-opinion": "en 1-6 sl 1; en 1-6 sl 2",
  "lesson-first-clear-legible-handwriting": "en 2 hw 1; en 2 hw 4",
  "lesson-first-common-words-and-spelling-strategies": "en 2 sp 4; en 3-4 sp 3",
  "lesson-first-past-tense-and-checking-my-writing": "en 2 co 12",
  "lesson-second-reading-fluently-with-pace-and-expression": "en 3-4 rc 7",
  "lesson-second-inference-reading-between-the-lines": "en 5-6 rc 13",
  "lesson-second-fact-opinion-and-persuasion": "en 5-6 rc 18; en 5-6 rc 17",
  "lesson-second-skimming-scanning-and-notes-in-own-words": "en 5-6 rc 19; en 3-4 rc 15",
  "lesson-second-commas-speech-marks-and-apostrophes": "en 3-4 vgp 11; en 3-4 vgp 10; en 2 sp 6",
  "lesson-second-varying-sentences-and-using-paragraphs": "en 3-4 co 6; en 5-6 co 9",
  "lesson-second-dictation-longer-sentences": "en 3-4 sp 6",
  "lesson-second-writing-to-inform-or-persuade": "en 5-6 co 2; en 5-6 co 10; en 3-4 co 8",
  "lesson-second-writing-a-story-plot-character-and-setting": "en 5-6 co 4; en 5-6 co 7; en 3-4 co 7",
  "lesson-second-planning-and-giving-a-short-talk": "en 1-6 sl 5; en 1-6 sl 9; en 1-6 sl 10",
  "lesson-second-spelling-rules-ing-plurals-and-endings": "en 2 sp 9; en 3-4 sp 1",
  "lesson-second-tricky-spelling-patterns-soft-c-and-g-silent-letters-ph": "en 2 sp 9; en 5-6 sp 2",
}

keys = re.findall(r'^  "([^"]+)":', MAP_SOURCE.split("MAP = {")[1].split("\n}")[0], re.M)
dupes = sorted({k for k in keys if keys.count(k) > 1})
if dupes:
    print("WORK MAPPED TWICE:", dupes); sys.exit(1)
ids = {x["id"] for x in nc}
for_id, bad = {}, []
for work, refs in MAP.items():
    out = []
    for r in [r.strip() for r in refs.split(";") if r.strip()]:
        full = ref(r)
        (out if full in ids else bad).append(full)
    for_id[work] = out
if bad:
    print("UNKNOWN STATEMENTS:", bad); sys.exit(1)

def text_of(x):
    t = FIX.get(x["id"], x["text"])
    t = re.sub(r"(\d)o\b", r"\1°", t).replace("(o)", "(°)")
    return t
stmts = [[x["id"], x["year"], x["subject"], x["domain"], text_of(x), x.get("parent", "")] for x in nc]

js = open(out_path, encoding="utf-8").read()
start = js.index("  // BEGIN DATA")
end = js.index("  // END DATA")
data = ("  // BEGIN DATA (written by tools/build_england.py; don't edit by hand)\n"
        "  const STATEMENTS = " + json.dumps(stmts, ensure_ascii=False, separators=(",", ":")).replace("],[", "],\n    [") + ";\n"
        "  const FOR_ID = " + json.dumps(for_id, ensure_ascii=False, separators=(",", ":")).replace('],"', '],\n    "') + ";\n")
open(out_path, "w", encoding="utf-8").write(js[:start] + data + js[end:])
print(len(stmts), "statements;", len(for_id), "mapped;", sum(1 for v in for_id.values() if not v), "with no England statement")
