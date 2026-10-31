# Adds key stage 4 (Years 10 and 11) to england-statements.json, word for word, as year "10-11".
# usage: python -I tools/england_ks4.py <folder with ks4en.pdf, ks4ma.pdf> tools/england-statements.json
#
# The statutory statements are the key stage 4 programmes of study (DfE, July 2014), from gov.uk:
#   ks4en.pdf  KS4_English_PoS_FINAL_170714.pdf  (English programmes of study: key stage 4)
#   ks4ma.pdf  KS4_maths_PoS_FINAL_170714.pdf    (Mathematics programmes of study: key stage 4)
# Every "Pupils should be taught to" bullet is kept, in its domain (the same domains as key stage 3).
# English's third-level bullets (the range of reading: Shakespeare, the 19th to 21st centuries, poetry
# since 1789) stay inside their statement, after "•", as key stage 3's do. Maths keeps the bold content
# for more highly attaining pupils in its braces { }. The footnote on spelling (Appendix 1 of key stages
# 1 and 2) is left out, and "Working mathematically" is aims, not content, as at key stage 3. The maths
# formulae don't survive text extraction: build_england.py's FIX has their official wording.
#
# GCSE subject content (DfE, 2013) is added only where it's the official detail of a programme statement:
#   - GCSE English language, "Scope of study" (GCSE_English_language.pdf): its nine headings spell out
#     the key stage 4 reading, writing and spoken English statements. They're in those domains, with the
#     id slug "gcse-english-language" and "GCSE English language subject content, scope of study" as parent.
#   - GCSE mathematics, "Appendix: Mathematical formulae" (GCSE_mathematics_subject_content_and_assessment_
#     objectives.pdf): the formulae behind the statements on quadratic equations, circles, Pythagoras'
#     Theorem and trigonometry, compound interest, combined probability, mensuration and kinematics. Each is
#     in the domain of the statement it details, with the id slug "gcse-formulae" and the appendix's own
#     heading as its parent. They're typed here from the PDF, as stacked formulae don't extract.
# The rest of the GCSE content repeats the key stage 3 and 4 programmes of study, so it isn't added again.
import re, sys, json, os
from pypdf import PdfReader
sys.stdout.reconfigure(encoding="utf-8")
src, path = sys.argv[1], sys.argv[2]
BULLETS = ("", "•")
DOMAINS = {"ma": ["Number", "Algebra", "Ratio, proportion and rates of change", "Geometry and measures", "Probability", "Statistics"],
           "en": ["Reading", "Writing", "Grammar and vocabulary", "Spoken English"]}
START = {"ma": "Subject content", "en": "Key stage 4"}
YEAR = "10-11"

def clean(s):
    s = re.sub(r"\s+", " ", s).strip()
    return re.sub(r"(\w)- (\w)", r"\1-\2", s).replace(" ,", ",").replace(" .", ".").replace(" ;", ";")

def parse(pdf, subject):
    started, domain, on, foot, cur, top, items = False, None, False, False, None, None, []
    for page in PdfReader(pdf).pages:
        xs = []
        def visit(t, cm, tm, font, size):
            for b in BULLETS:
                for _ in range(t.count(b)): xs.append(tm[4] + cm[4])
        for raw in page.extract_text(visitor_text=visit).split("\n"):
            flat = clean(raw)
            if not flat: continue
            bullet = flat.startswith(BULLETS)
            x = xs.pop(0) if bullet and xs else None
            flat = flat.lstrip("".join(BULLETS) + " ").strip()
            if flat == START[subject]: started = True; continue
            if not started: continue
            if flat.startswith("©"): return items
            # The spelling footnote runs to the next page's running header
            if re.match(r"^\d+ Spelling patterns", flat): foot = True; continue
            if re.match(r"^(English|Mathematics) – key stage", flat): foot = False; continue
            if foot or re.fullmatch(r"\d+", flat) or set(flat) <= {"_"}: continue
            if flat in DOMAINS[subject]: domain, on, cur = flat, False, None; continue
            if "pupils should be taught to" in flat.lower(): on = domain is not None; continue
            if not on: continue
            if not bullet:
                if cur is not None: cur["text"] = clean(cur["text"] + " " + flat)
                continue
            level = 1 if x is None or x < 70 else 2 if x < 100 else 3
            if level == 3 and top is not None:  # the range of reading, kept inside its statement
                cur = top; cur["text"] = clean(cur["text"] + " • " + flat); continue
            cur = {"subject": subject, "year": YEAR, "domain": domain, "level": level, "text": flat}
            if level == 2: top = cur
            items.append(cur)
    return items

# GCSE English language: Scope of study, word for word, with the domain each heading details
GCSE_EN = [
  ("Reading", "critical reading and comprehension: identifying and interpreting themes, ideas and information in a range of literature and other high-quality writing; reading in different ways for different purposes, and comparing and evaluating the usefulness, relevance and presentation of content for these purposes; drawing inferences and justifying these with evidence; supporting a point of view by referring to evidence within the text; identifying bias and misuse of evidence, including distinguishing between statements that are supported by evidence and those that are not; reflecting critically and evaluatively on text, using the context of the text and drawing on knowledge and skills gained from wider reading; recognising the possibility of different responses to a text"),
  ("Reading", "summary and synthesis: identifying the main theme or themes; summarising ideas and information from a single text; synthesising from more than one text"),
  ("Reading", "evaluation of a writer’s choice of vocabulary, form, grammatical and structural features: explaining and illustrating how vocabulary and grammar contribute to effectiveness and impact, using linguistic and literary terminology accurately to do so and paying attention to detail; analysing and evaluating how form and structure contribute to the effectiveness and impact of a text"),
  ("Reading", "comparing texts: comparing two or more texts critically with respect to the above."),
  ("Writing", "producing clear and coherent text: writing effectively for different purposes and audiences: to describe, narrate, explain, instruct, give and respond to information, and argue; selecting vocabulary, grammar, form, and structural and organisational features judiciously to reflect audience, purpose and context; using language imaginatively and creatively; using information provided by others to write in different forms; maintaining a consistent point of view; maintaining coherence and consistency across a text"),
  ("Writing", "writing for impact: selecting, organising and emphasising facts, ideas and key points; citing evidence and quotation effectively and pertinently to support views; creating emotional impact; using language creatively, imaginatively and persuasively, including rhetorical devices (such as rhetorical questions, antithesis, parenthesis)."),
  ("Spoken English", "presenting information and ideas: selecting and organising information and ideas effectively and persuasively for prepared spoken presentations; planning effectively for different purposes and audiences; making presentations and speeches"),
  ("Spoken English", "responding to spoken language: listening to and responding appropriately to any questions and feedback"),
  ("Spoken English", "spoken Standard English: expressing ideas using Standard English whenever and wherever appropriate."),
]
# GCSE mathematics: Appendix: Mathematical formulae, with the domain each formula details
KNOW = "GCSE mathematics, Appendix: Mathematical formulae. Formulae included in the subject content. Candidates are expected to know these formulae; they must not be given in the assessment."
DERIVE = "GCSE mathematics, Appendix: Mathematical formulae. The following formulae are not specified in the content but should be derived or informally understood by candidates. These formulae must not be given in the examination."
GIVEN = "GCSE mathematics, Appendix: Mathematical formulae. Formulae that candidates should be able to use, but need not memorise. These can be given in the exam, either in the relevant question, or in a list from which candidates select and apply as appropriate."
GCSE_MA = [
  ("Algebra", KNOW, "The quadratic formula: The solutions of ax² + bx + c = 0 where a ≠ 0: x = (−b ± √(b² − 4ac)) / 2a"),
  ("Geometry and measures", KNOW, "Circumference and area of a circle: Where r is the radius and d is the diameter: Circumference of a circle = 2πr = πd; Area of a circle = πr²"),
  ("Geometry and measures", KNOW, "Pythagoras’s theorem: In any right-angled triangle where a, b and c are the length of the sides and c is the hypotenuse: a² + b² = c²"),
  ("Geometry and measures", KNOW, "Trigonometry formulae: In any right-angled triangle ABC where a, b and c are the length of the sides and c is the hypotenuse: sin A = a/c, cos A = b/c, tan A = a/b. In any triangle ABC where a, b and c are the length of the sides: sine rule: a/sin A = b/sin B = c/sin C; cosine rule: a² = b² + c² − 2bc cos A; Area = ½ab sin C"),
  ("Geometry and measures", DERIVE, "Perimeter, area, surface area and volume formulae: Where a and b are the lengths of the parallel sides and h is their perpendicular separation: Area of a trapezium = ½(a + b)h; Volume of a prism = area of cross section × length"),
  ("Ratio, proportion and rates of change", DERIVE, "Compound interest: Where P is the principal amount, r is the interest rate over a given period and n is number of times that the interest is compounded: Total accrued = P(1 + r/100)ⁿ"),
  ("Probability", DERIVE, "Probability: Where P(A) is the probability of outcome A and P(B) is the probability of outcome B: P(A or B) = P(A) + P(B) − P(A and B); P(A and B) = P(A given B)P(B)"),
  ("Geometry and measures", GIVEN, "Perimeter, area, surface area and volume formulae: Where r is the radius of the sphere or cone, l is the slant height of a cone and h is the perpendicular height of a cone: Curved surface area of a cone = πrl; Surface area of a sphere = 4πr²; Volume of a sphere = 4/3 πr³; Volume of a cone = 1/3 πr²h"),
  ("Algebra", GIVEN, "Kinematics formulae: Where a is constant acceleration, u is initial velocity, v is final velocity, s is displacement from the position when t = 0 and t is time taken: v = u + at; s = ut + ½at²; v² = u² + 2as"),
]

out, n, parent = [], {}, None
for subject, pdf in (("en", "ks4en.pdf"), ("ma", "ks4ma.pdf")):
    for it in parse(os.path.join(src, pdf), subject):
        if it["level"] == 1: parent = it
        key = (subject, it["domain"])
        n[key] = n.get(key, 0) + 1
        slug = re.sub(r"[^a-z]+", "-", it["domain"].lower()).strip("-")
        rec = dict(id=f"{subject}-y{YEAR}-{slug}-{n[key]}", **it)
        if it["level"] == 2 and parent is not None and parent["domain"] == it["domain"]: rec["parent"] = parent["text"]
        out.append(rec)
for i, (domain, text) in enumerate(GCSE_EN, 1):
    out.append({"id": f"en-y{YEAR}-gcse-english-language-{i}", "subject": "en", "year": YEAR, "domain": domain, "level": 2, "text": text,
                "parent": "GCSE English language subject content, scope of study –"})
for i, (domain, head, text) in enumerate(GCSE_MA, 1):
    out.append({"id": f"ma-y{YEAR}-gcse-formulae-{i}", "subject": "ma", "year": YEAR, "domain": domain, "level": 2, "text": text, "parent": head})
d = [x for x in json.load(open(path, encoding="utf-8")) if x["year"] != YEAR]
json.dump(d + out, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), Counter((x["subject"], x["domain"]) for x in out))
