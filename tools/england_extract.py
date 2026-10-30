# Pulls the statutory statements out of the national curriculum PDFs, keeping the official wording.
# usage: python -I nc_extract.py <dir with en.pdf, ma.pdf> <out.json>
import re, sys, json, os
from pypdf import PdfReader
sys.stdout.reconfigure(encoding="utf-8")
src, out = sys.argv[1], sys.argv[2]
BUL = ""

YEAR_RE = re.compile(r"^\s*(Year (\d)|Years (\d) and (\d)) programme of study\s*$")
EN_DOMAINS = ["Spoken language", "Reading – word reading", "Reading – comprehension", "Writing – transcription",
              "Writing – composition", "Writing – vocabulary, grammar and punctuation", "Writing – handwriting and presentation",
              "Writing – handwriting"]
MA_DOMAINS = ["Number – number and place value", "Number – addition and subtraction", "Number – multiplication and division",
              "Number – addition, subtraction, multiplication and division", "Number – fractions (including decimals and percentages)",
              "Number – fractions (including decimals)", "Number – fractions", "Measurement", "Geometry – properties of shapes",
              "Geometry – position and direction", "Statistics", "Ratio and proportion", "Algebra"]

def clean(s):
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"(\w)- (\w)", r"\1-\2", s)          # "three- quarter" -> "three-quarter"
    s = s.replace(" ,", ",").replace(" .", ".").replace("[ ", "[").replace(" ]", "]")
    return s

def parse(pdf, subject, domains):
    year, domain, sub, on = None, None, None, False
    items, cur = [], None
    for page in PdfReader(pdf).pages:
        xs = []
        def visit(t, cm, tm, font, size):
            for _ in range(t.count(BUL)): xs.append(tm[4] + cm[4])
        text = page.extract_text(visitor_text=visit)
        for raw in text.split("\n"):
            flat = clean(raw)
            if not flat: continue
            if flat == "Spelling – work for year 1": return items  # English Appendix 1 starts here
            if flat == "Spoken language – years 1 to 6":
                year, domain, on, cur = "1-6", "Spoken language", False, None; continue
            m = YEAR_RE.match(flat)
            if m:
                year = m.group(2) or f"{m.group(3)}-{m.group(4)}"; domain = None; on = False; cur = None; continue
            bullet = flat.startswith(BUL)
            x = xs.pop(0) if bullet and xs else None
            flat = flat.lstrip(BUL + " ").strip()
            if year is None: continue
            hit = next((d for d in domains if flat == d), None)
            if hit: domain, on, cur, sub = hit, False, None, None; continue
            if flat in ("Spelling (see English Appendix 1)", "Handwriting", "Handwriting and presentation"):
                sub = flat.split(" (")[0]; continue
            if flat.startswith("Statutory requirements"): on = True; continue
            if flat.startswith("Notes and guidance"): on = False; cur = None; continue
            if not on or domain is None: continue
            if flat.startswith("Pupils should be taught") or re.match(r"^(English|Mathematics) – key stage", flat) or re.fullmatch(r"\d+", flat):
                continue
            if not bullet:
                if cur is not None: cur["text"] = clean(cur["text"] + " " + flat)
                continue
            level = 2 if x is not None and 80 <= x < 120 else 1
            dom = domain + (f" ({sub})" if sub and domain == "Writing – transcription" else "")
            cur = {"subject": subject, "year": year, "domain": dom, "level": level, "text": flat, "x": round(x or 0)}
            items.append(cur)
    return items

def ids(items):
    out, parent, n = [], None, {}
    for it in items:
        if it["level"] == 1: parent = it
        key = (it["subject"], it["year"], it["domain"])
        n[key] = n.get(key, 0) + 1
        slug = re.sub(r"[^a-z]+", "-", it["domain"].lower()).strip("-")
        rec = dict(id=f'{it["subject"]}-y{it["year"]}-{slug}-{n[key]}', **it)
        if it["level"] == 2 and parent is not None and parent["domain"] == it["domain"]:
            rec["parent"] = parent["text"]
        out.append(rec)
    return out

allit = ids(parse(os.path.join(src, "en.pdf"), "en", EN_DOMAINS)) + ids(parse(os.path.join(src, "ma.pdf"), "ma", MA_DOMAINS))
json.dump(allit, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
c = Counter((x["subject"], x["year"], x["domain"]) for x in allit)
for k, v in sorted(c.items()): print(k, v)
print(len(allit), Counter(x["x"] for x in allit))
