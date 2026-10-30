# Adds the key stage 3 programmes of study (English and mathematics) to england-statements.json,
# word for word, as year "7-9".
# usage: python -I tools/england_ks3.py <folder with ks3en.pdf, ks3ma.pdf> tools/england-statements.json
import re, sys, json, os
from pypdf import PdfReader
sys.stdout.reconfigure(encoding="utf-8")
src, path = sys.argv[1], sys.argv[2]
BUL = ""
DOMAINS = {"ma": ["Number", "Algebra", "Ratio, proportion and rates of change", "Geometry and measures", "Probability", "Statistics"],
           "en": ["Reading", "Writing", "Grammar and vocabulary", "Spoken English"]}
START = {"ma": "Subject content", "en": "Key stage 3"}

def clean(s):
    s = re.sub(r"\s+", " ", s).strip()
    return re.sub(r"(\w)- (\w)", r"\1-\2", s).replace(" ,", ",").replace(" .", ".")

def parse(pdf, subject):
    started, domain, on, cur, items = False, None, False, None, []
    for page in PdfReader(pdf).pages:
        xs = []
        def visit(t, cm, tm, font, size):
            for _ in range(t.count(BUL)): xs.append(tm[4] + cm[4])
        for raw in page.extract_text(visitor_text=visit).split("\n"):
            flat = clean(raw)
            if not flat: continue
            bullet = flat.startswith(BUL)
            x = xs.pop(0) if bullet and xs else None
            flat = flat.lstrip(BUL + " ").strip()
            if flat == START[subject]: started = True; continue
            if not started: continue
            if flat.startswith("©") or flat == "Key stage 4" or flat.startswith("Glossary for"): return items
            if flat in DOMAINS[subject]: domain, on, cur = flat, False, None; continue
            if flat.startswith("Pupils should be taught to"): on = domain is not None; continue
            if not on or re.match(r"^(English|Mathematics) – key stage", flat) or re.fullmatch(r"\d+", flat): continue
            if not bullet:
                if cur is not None: cur["text"] = clean(cur["text"] + " " + flat)
                continue
            level = 2 if x is not None and 80 <= x < 120 else 1
            cur = {"subject": subject, "year": "7-9", "domain": domain, "level": level, "text": flat}
            items.append(cur)
    return items

# A footnote at the foot of a page gets read as part of the statement above it
def unfoot(t):
    t = re.sub(r"\s*\d?\s*Teachers should refer to the Glossary.*$", "", t)
    return re.sub(r"\.\d+$", ".", t).strip()

out, n, parent = [], {}, None
for subject, pdf in (("en", "ks3en.pdf"), ("ma", "ks3ma.pdf")):
    for it in parse(os.path.join(src, pdf), subject):
        if it["level"] == 1: parent = it
        key = (subject, it["domain"])
        n[key] = n.get(key, 0) + 1
        slug = re.sub(r"[^a-z]+", "-", it["domain"].lower()).strip("-")
        it["text"] = unfoot(it["text"])
        rec = dict(id=f"{subject}-y7-9-{slug}-{n[key]}", **it)
        if it["level"] == 2 and parent is not None and parent["domain"] == it["domain"]: rec["parent"] = parent["text"]
        out.append(rec)
d = [x for x in json.load(open(path, encoding="utf-8")) if x["year"] != "7-9"]
json.dump(d + out, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
print(Counter((x["subject"], x["domain"]) for x in out))
