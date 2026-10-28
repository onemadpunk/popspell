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
    "finished": "Well done! Have a look at your stars.",
    "test": "Can you spell the word, cake?",
    # Spoken questions for the early-level listening games (activities.js)
    "q-rhyme": "Which word rhymes with this word? Listen.",
    "q-first": "Which word starts with the same sound as this word? Listen.",
    "q-count": "How many sounds can you hear in this word? Listen.",
}


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
    for pid, story, questions in list_passages(ROOT / "passages.js"):
        jobs[f"passages/{pid}"] = story
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

    # Tell the website which recordings exist, so it never waits on a missing file
    stems = lambda folder: sorted(p.stem for p in (AUDIO / folder).glob("*.mp3"))
    manifest = {
        "voice": f"{ENGINE} {VOICE}",
        "words": stems("words"),
        "letters": len(stems("letters")) == len(LETTERS),
        "phrases": stems("phrases"),
        "sentences": stems("sentences"),
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
