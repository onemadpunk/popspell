#!/usr/bin/env python3
"""Record every word, sentence, letter name and phrase with Kyutai's Pocket TTS ("eponine" voice).

    pip install pocket-tts lameenc
    python tools/make_audio.py
    python tools/make_audio.py --only crash,shelf     # new takes of just these words

Each recording remembers what it says and how it was made (audio/made.json), so only new or
changed ones are made. The GitHub Action in .github/workflows/audio.yml runs this automatically.

Voice: Pocket TTS by Kyutai (CC BY 4.0), built-in voice "eponine", from the VCTK corpus
(Centre for Speech Technology Research, University of Edinburgh), CC BY 4.0.
"""
import argparse
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
MADE = AUDIO / "made.json"

ENGINE = "pocket-tts"
VOICE = "eponine"
PAD_MS = 200          # a short silence first, so the start of a word isn't clipped when it plays
WORD_TEXT = "{Word}."  # how single words are given to the voice

# Words that sound better said another way: a different spelling or punctuation for the voice
WORD_FIXES = {
}

# Recordings checked by ear and approved: never re-recorded, even with --force
APPROVED = set()

# Letter names, as the voice reads them best
LETTERS = {c: f"{c.upper()}." for c in "abcdefghijklmnopqrstuvwxyz"}

# Number words, joined to say any number: keep in step with NUMBER_WORDS in speech-text.js
NUMBER_WORDS = dict(enumerate(["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
                               "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]))
NUMBER_WORDS.update({(i + 2) * 10: w for i, w in enumerate(["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"])})
NUMBER_WORDS = {str(k): v for k, v in NUMBER_WORDS.items()}
NUMBER_WORDS.update({"hundred": "hundred", "thousand": "thousand", "and": "and", "point": "point"})

# Keep in step with PHRASES in app.js
PHRASES = {
    "well-done": "Well done!",
    "brilliant": "Brilliant!",
    "super": "Super spelling!",
    "fantastic": "Fantastic!",
    "great-job": "Great job!",
    "got-it": "You got it!",
    "amazing": "Amazing!",
    "all-right": "Fantastic! You spelled every word.",
    "all-done": "Fantastic! You got every one right.",
    "try-again": "Not quite. Have another go.",
    # Pip's speech bubbles (PIP_LINES in app.js reads them out): keep the wording in step
    "pip-name": "Hi! I'm Pip. What's your name?",
    "pip-journey": "Pick a stop on our journey. I'll hop along with you!",
    "pip-quest": "Hi! Will you help me visit my five islands?",
    "pip-quest-done": "We did it! Thank you for helping me!",
    "pip-start": "Ready? Press the big button to start!",
    "pip-island-listen": "Pip's friends love sounds! Listen to each word, then tap your answer. Tap the speaker to hear a word again.",
    "pip-island-read": "Pip will say a word. Find it and tap it! Say the sounds in each word to help you.",
    "pip-island-spell": "Pip will say a word, then use it in a sentence. Write it in the sand! Some words get tricky, so just have a go.",
    "pip-island-story": "Read Pip's story all by yourself, then answer the questions about it.",
    "pip-island-numbers": "Climb Number Peak! Answer each question. Some get tricky, so just have a go.",
    "finished": "Well done! Have a look at your stars.",
    "test": "Can you spell the word, cake?",
    # Spoken questions for the early-level listening games (activities.js)
    "q-rhyme": "Which word rhymes with this word? Listen.",
    "q-first": "Which word starts with the same sound as this word? Listen.",
    "q-count": "How many sounds can you hear in this word? Listen.",
    # Pip's games use the same Eponine recording as the rest of PopSpell.
    "switch-swap": "Change one sound. Listen to the first word.",
    "switch-add": "Add one sound. Listen to the first word.",
    "switch-remove": "Take away one sound. Listen to the first word.",
    "switch-make": "Make this word.",
    "canopy-flash": "The fireflies light Pip's path. How many flashed? Look again whenever you like.",
    "canopy-compare": "Pip has reached a fork. Which tree has more fireflies, or are they the same?",
}
PHRASES.update({f"pip-due-{n}": f"You've got {n} {'word' if n == 1 else 'words'} to practise again. Let's go!" for n in range(1, 13)})
PHRASES.update({f"pip-set-{n}": f"Your teacher has set you {n} {'thing' if n == 1 else 'things'} for today. {'It' if n == 1 else 'They'}'{'s' if n == 1 else 're'} just below!"
                for n in range(1, 13)})
PHRASES.update({
    f"canopy-make-{n}":
        f"Pip needs one bridge of {n} fireflies. Pick a group for each side so they make {n} altogether."
    for n in range(5, 11)
})
PHRASES.update({
    f"canopy-hide-{total}-{visible}":
        f"Some fireflies are behind the leaves. There are {total} altogether and {visible} are showing. How many are hidden?"
    for total, visible in [(5, 2), (6, 4), (7, 3), (8, 5), (9, 6), (10, 7),
                           (11, 7), (12, 8), (13, 9), (15, 10), (17, 12), (20, 14),
                           (9, 5), (10, 6)]
})


def spelling(entry):
    """'c-a_e-k' -> 'cake', using the same rules as analyse() in app.js."""
    entry = entry.strip().lower()
    if "-" not in entry:
        return entry
    letters, pending = [], False
    for tok in [t for t in entry.split("-") if t]:
        split = re.fullmatch(r"([aeiou])_e", tok)
        letters.append(split.group(1) if split else tok)
        if pending:
            letters.append("e")
            pending = False
        if split:
            pending = True
    if pending:
        letters.append("e")
    return "".join(letters)


def list_words(words_js):
    text = re.sub(r"/\*.*?\*/", "", words_js.read_text(encoding="utf-8"), flags=re.S)  # skip the help comment
    found = set()
    for block in re.findall(r"(?:words|check):\s*\[(.*?)\]", text, flags=re.S):
        for entry in re.findall(r'"([^"]+)"', block):
            word = spelling(entry)
            if re.fullmatch(r"[a-z]+", word):
                found.add(word)
    return sorted(found)


def list_sentences(sentences_js):
    """{word: sentence} from sentences.js."""
    if not sentences_js.exists():
        return {}
    text = re.sub(r"/\*.*?\*/", "", sentences_js.read_text(encoding="utf-8"), flags=re.S)
    return {w.lower(): s for w, s in re.findall(r'^\s*([A-Za-z]+):\s*"([^"]*)"', text, flags=re.M)}


def activity_phrases(activities_js):
    """Record the fixed writing and tricky-word prompts in activities.js."""
    text = activities_js.read_text(encoding="utf-8")
    end_block = re.search(r"const END_MARKS = \[(.*?)\];", text, flags=re.S).group(1)
    hfw_block = re.search(r"const HFW = \[(.*?)\];", text, flags=re.S).group(1)
    end_marks = re.findall(r'\["([^"]+)", "([.?!])"\]', end_block)
    hfw = re.findall(r'\["([^"]+)", "([^"]+)"\]', hfw_block)
    if len(end_marks) != 18 or len(hfw) != 20:
        raise ValueError("Activity voice list changed; check its recording keys")
    jobs = {f"phrases/end-mark-{i}": s + mark for i, (s, mark) in enumerate(end_marks, 1)}
    jobs.update({f"phrases/hfw-{i}": s.replace("___", word) for i, (s, word) in enumerate(hfw, 1)})
    return jobs


JS_STRING = r'"((?:[^"\\]|\\.)*)"'


def list_passages(passages_js):
    """[(id, story, [questions])] from passages.js: each story and its questions get recorded."""
    if not passages_js.exists():
        return []
    text = re.sub(r"/\*.*?\*/", "", passages_js.read_text(encoding="utf-8"), flags=re.S)
    unescape = lambda s: s.replace('\\"', '"').replace("\\'", "'")
    out = []
    for block in re.split(r"\n\s*\{\s*\n\s*id:", text)[1:]:
        pid = re.match(r'\s*' + JS_STRING, block).group(1)
        story = re.search(r"\btext:\s*" + JS_STRING, block).group(1)
        questions = re.findall(r"\bq:\s*" + JS_STRING, block)
        out.append((pid, unescape(story), [unescape(q) for q in questions]))
    return out


def split_sentences(text):
    """The sentences the website reads one at a time. Keep in step with sentencesOf in app.js:
    a sentence ends at . ! or ? (and a closing quote) before a capital letter, or at the end."""
    parts = re.findall(r'.+?[.!?]+["”]?(?=\s+["“]?[A-Z]|\s*$)', text, flags=re.S)
    return [p.strip() for p in parts if p.strip()] or [text.strip()]


ALIASES = {}  # lines/<key> said by an older recording: {key: "sentences/ran"}


def said(text):
    """The words alone, as said() in speech-text.js: capitals and punctuation don't count."""
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9' ]", "", text.lower())).strip()


def plan():
    """Every recording the site needs: {"words/cake": text}."""
    jobs = {}
    for w in list_words(ROOT / "words.js"):
        jobs[f"words/{w}"] = WORD_FIXES.get(w, WORD_TEXT.format(Word=w.capitalize(), word=w))
    for w, sentence in list_sentences(ROOT / "sentences.js").items():
        jobs[f"sentences/{w}"] = sentence
    for c, text in LETTERS.items():
        jobs[f"letters/{c}"] = text
    for key, text in PHRASES.items():
        jobs[f"phrases/{key}"] = text
    jobs.update(activity_phrases(ROOT / "activities.js"))
    # Everything else the activities say (tools/activity_lines.mjs lists it), and the number
    # words sums are built from (speech-text.js)
    # A piece Eponine already says in another recording (a list sentence, a phrase, a story
    # question) isn't recorded again: the site plays that recording instead (ALIASES)
    lines = ROOT / "tools" / "lines.json"
    already = {said(text): key for key, text in jobs.items()}
    ALIASES.clear()
    if lines.exists():
        for key, text in json.loads(lines.read_text(encoding="utf-8")).items():
            if said(text) in already:
                ALIASES[key] = already[said(text)]
            else:
                jobs[f"lines/{key}"] = text
    for key, text in NUMBER_WORDS.items():
        jobs[f"numbers/{key}"] = text
    for pid, story, questions in list_passages(ROOT / "passages.js") + list_passages(ROOT / "stories.js"):
        jobs[f"passages/{pid}"] = story
        # Read-along: each sentence on its own, so pupils can follow at their own speed
        for n, sentence in enumerate(split_sentences(story), 1):
            jobs[f"passages/{pid}-s{n}"] = sentence
        for n, q in enumerate(questions, 1):
            jobs[f"passages/{pid}-q{n}"] = q
    return jobs


def signature(text):
    return json.dumps([ENGINE, VOICE, PAD_MS, text], ensure_ascii=False)


def load_voice():
    import numpy as np
    from pocket_tts import TTSModel

    model = TTSModel.load_model()
    state = model.get_state_for_audio_prompt(VOICE)
    rate = model.sample_rate

    def synth(text):
        audio = model.generate_audio(state, text).numpy()
        pcm = (np.clip(audio, -1, 1) * 32767).astype("<i2").tobytes()
        return b"\x00\x00" * int(rate * PAD_MS / 1000) + pcm, rate

    return synth


def to_mp3(pcm, rate):
    import lameenc

    enc = lameenc.Encoder()
    enc.set_bit_rate(64)
    enc.set_in_sample_rate(rate)
    enc.set_channels(1)
    enc.set_quality(2)
    return bytes(enc.encode(pcm) + enc.flush())


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--force", action="store_true", help="re-record everything except APPROVED recordings")
    parser.add_argument("--only", default="", help="comma-separated words to re-record (word and sentence)")
    args = parser.parse_args()

    made = json.loads(MADE.read_text(encoding="utf-8")) if MADE.exists() else {}
    only = {w.strip().lower() for w in args.only.split(",") if w.strip()}
    todo = []
    for key, text in sorted(plan().items()):
        path = AUDIO / f"{key}.mp3"
        if key in APPROVED and path.exists():
            continue
        folder, name = key.split("/")
        wanted = args.force or (name in only and folder in ("words", "sentences"))
        if wanted or not path.exists() or made.get(key) != signature(text):
            todo.append((key, path, text))

    if todo:
        synth = load_voice()
        for n, (key, path, text) in enumerate(todo, 1):
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(to_mp3(*synth(text)))
            made[key] = signature(text)
            print(f"[{n}/{len(todo)}] audio/{key}.mp3  ({text})")
            if n % 50 == 0:  # save progress, so a stopped run can carry on
                MADE.write_text(json.dumps(made, indent=0, sort_keys=True, ensure_ascii=False), encoding="utf-8")
        MADE.write_text(json.dumps(made, indent=0, sort_keys=True, ensure_ascii=False), encoding="utf-8")

    # Pieces the activities no longer say are removed (only in lines/, which is all generated)
    wanted_lines = {key.split("/", 1)[1] for key in plan() if key.startswith("lines/")}
    for old in (AUDIO / "lines").glob("*.mp3"):
        if old.stem not in wanted_lines:
            old.unlink()
            made.pop(f"lines/{old.stem}", None)
    MADE.write_text(json.dumps(made, indent=0, sort_keys=True, ensure_ascii=False), encoding="utf-8")

    # Tell the website which recordings exist, so it never waits on a missing file
    stems = lambda folder: sorted(p.stem for p in (AUDIO / folder).glob("*.mp3"))
    manifest = {
        "voice": f"{ENGINE} {VOICE}",
        "words": stems("words"),
        "letters": len(stems("letters")) == len(LETTERS),
        "phrases": stems("phrases"),
        "sentences": stems("sentences"),
        "lines": stems("lines"),
        "numbers": stems("numbers"),
        "aliases": {key: target for key, target in sorted(ALIASES.items()) if (AUDIO / f"{target}.mp3").exists()},
    }
    AUDIO.mkdir(exist_ok=True)
    (AUDIO / "index.js").write_text(
        "// Made by tools/make_audio.py — lists the recordings in this folder.\n"
        f"window.POPSPELL_AUDIO = {json.dumps(manifest, separators=(',', ':'))};\n",
        encoding="utf-8",
    )
    print(f"{len(todo)} new recordings; {len(manifest['words'])} words available.")


if __name__ == "__main__":
    main()
