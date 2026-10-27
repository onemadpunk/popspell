#!/usr/bin/env python3
"""Record every word, sentence, letter name and phrase with the Scottish "alba" Piper voice.

    pip install piper-tts lameenc
    python tools/make_audio.py --model voice/en_GB-alba-medium.onnx
    python tools/make_audio.py --model ... --only crash,shelf     # new takes of just these words

Each recording remembers what it says and how it was spoken (audio/made.json), so only new or
changed ones are made. The GitHub Action in .github/workflows/audio.yml runs this automatically.

Voice: Piper en_GB-alba-medium, trained on the Alba speech corpus
(University of Edinburgh DataShare), licensed CC BY 4.0.
"""
import argparse
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
MADE = AUDIO / "made.json"

# How recordings are spoken, chosen by listening: a short silence first (so the start of a word
# isn't clipped when it plays), a steadier voice, a little slower than normal for young listeners,
# and single words said with energy ("Shelf!"), which keeps sounds like "sh" crisp.
STYLE = {"pad_ms": 200, "length_scale": 1.15, "noise_scale": 0.4, "noise_w_scale": 0.5}
WORD_TEXT = "{Word}!"

# Words that sound better said another way. "text" can be a respelling, or raw phonemes
# in [[ ]], e.g. "[[ kɹˈaʃ ]]". Any STYLE setting can be changed too.
WORD_FIXES = {
}

# Recordings checked by ear and approved: never re-recorded, even with --force.
APPROVED = {"words/shelf", "words/ship", "words/shop", "words/shed", "words/sheep", "words/shout", "words/fish",
            "words/crash"}

# Letter names as exact sounds (phonemes), because spellings get misread:
# "ay" was said as "eye", and "eff" as "ee-eff-eff"
LETTERS = {
    "a": "ˈeɪ", "b": "bˈiː", "c": "sˈiː", "d": "dˈiː", "e": "ˈiː", "f": "ˈɛf", "g": "dʒˈiː",
    "h": "ˈeɪtʃ", "i": "ˈaɪ", "j": "dʒˈeɪ", "k": "kˈeɪ", "l": "ˈɛl", "m": "ˈɛm", "n": "ˈɛn",
    "o": "ˈəʊ", "p": "pˈiː", "q": "kjˈuː", "r": "ˈɑː", "s": "ˈɛs", "t": "tˈiː", "u": "jˈuː",
    "v": "vˈiː", "w": "dˈʌbəljuː", "x": "ˈɛks", "y": "wˈaɪ", "z": "zˈɛd",
}

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


def plan():
    """Every recording the site needs: {"words/cake": (text, style)}."""
    jobs = {}
    for w in list_words(ROOT / "words.js"):
        fix = dict(WORD_FIXES.get(w, {}))
        text = fix.pop("text", WORD_TEXT.format(Word=w.capitalize(), word=w))
        jobs[f"words/{w}"] = (text, {**STYLE, **fix})
    for w, sentence in list_sentences(ROOT / "sentences.js").items():
        jobs[f"sentences/{w}"] = (sentence, STYLE)
    for c, sounds in LETTERS.items():
        jobs[f"letters/{c}"] = (f"[[ {sounds} ]]", STYLE)
    for key, text in PHRASES.items():
        jobs[f"phrases/{key}"] = (text, STYLE)
    return jobs


def signature(text, style):
    return json.dumps([text, style], sort_keys=True, ensure_ascii=False)


def load_voice(model):
    from piper import PiperVoice, SynthesisConfig

    voice = PiperVoice.load(str(model))

    def synth(text, style):
        style = dict(style)
        pad_ms = style.pop("pad_ms", 0)
        chunks = list(voice.synthesize(text, syn_config=SynthesisConfig(**style)))
        rate = chunks[0].sample_rate
        silence = b"\x00\x00" * int(rate * pad_ms / 1000)
        return silence + b"".join(c.audio_int16_bytes for c in chunks), rate

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
    parser.add_argument("--model", required=True, help="path to en_GB-alba-medium.onnx (its .onnx.json must sit beside it)")
    parser.add_argument("--force", action="store_true", help="re-record everything except APPROVED recordings")
    parser.add_argument("--only", default="", help="comma-separated words to re-record (word and sentence)")
    args = parser.parse_args()

    made = json.loads(MADE.read_text(encoding="utf-8")) if MADE.exists() else {}
    only = {w.strip().lower() for w in args.only.split(",") if w.strip()}
    jobs = plan()
    todo = []
    for key, (text, style) in sorted(jobs.items()):
        path = AUDIO / f"{key}.mp3"
        if key in APPROVED and path.exists():
            continue
        wanted = args.force or (only and key.split("/")[1] in only and key.split("/")[0] in ("words", "sentences"))
        if wanted or not path.exists() or made.get(key) != signature(text, style):
            todo.append((key, path, text, style))

    if todo:
        synth = load_voice(args.model)
        for n, (key, path, text, style) in enumerate(todo, 1):
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(to_mp3(*synth(text, style)))
            made[key] = signature(text, style)
            print(f"[{n}/{len(todo)}] audio/{key}.mp3  ({text})")
        MADE.write_text(json.dumps(made, indent=0, sort_keys=True, ensure_ascii=False), encoding="utf-8")

    # Tell the website which recordings exist, so it never waits on a missing file
    stems = lambda folder: sorted(p.stem for p in (AUDIO / folder).glob("*.mp3"))
    manifest = {
        "voice": "Piper en_GB-alba-medium",
        "words": stems("words"),
        "letters": len(stems("letters")) == len(LETTERS),
        "phrases": stems("phrases"),
        "sentences": stems("sentences"),
    }
    AUDIO.mkdir(exist_ok=True)
    (AUDIO / "index.js").write_text(
        "// Made by tools/make_audio.py — lists the alba recordings in this folder.\n"
        f"window.ALBA_AUDIO = {json.dumps(manifest, separators=(',', ':'))};\n",
        encoding="utf-8",
    )
    print(f"{len(todo)} new recordings; {len(manifest['words'])} words available.")


if __name__ == "__main__":
    main()
