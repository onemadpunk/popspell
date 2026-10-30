# Adds the EYFS Early Learning Goals for communication and language, literacy and maths to nc.json.
# usage: python -I elg_extract.py <eyfs.txt> <nc.json>
import re, sys, json
sys.stdout.reconfigure(encoding="utf-8")
text, path = open(sys.argv[1], encoding="utf-8").read(), sys.argv[2]
WANT = {"Listening, Attention and Understanding": "en", "Speaking": "en", "Comprehension": "en", "Word Reading": "en",
        "Writing": "en", "Fine Motor Skills": "en", "Number": "ma", "Numerical Patterns": "ma"}
items, goal, cur = [], None, None
for line in text.split("\n"):
    s = re.sub(r"\s+", " ", line).strip()
    m = re.match(r"^ELG: (.+)$", s)
    if m:
        goal = m.group(1) if m.group(1) in WANT else None; cur = None; n = 0; continue
    if goal is None or not s or s.startswith("Children at the expected") or re.fullmatch(r"\d+", s): continue
    if s in ("Personal, Social and Emotional Development", "Physical Development", "Literacy", "Mathematics",
             "Understanding the World", "Communication and Language") or s.startswith("ELG"):
        goal = None; continue
    if s.startswith("•"):
        n += 1
        cur = {"id": f'{WANT[goal]}-yR-{re.sub(r"[^a-z]+", "-", goal.lower()).strip("-")}-{n}', "subject": WANT[goal],
               "year": "R", "domain": f"ELG: {goal}", "level": 1, "text": s.lstrip("• ").strip()}
        items.append(cur)
    elif cur is not None:
        cur["text"] = (cur["text"] + " " + s).strip()
d = [x for x in json.load(open(path, encoding="utf-8")) if x["year"] != "R"]
json.dump(items + d, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for x in items: print(x["id"], "|", x["text"])
