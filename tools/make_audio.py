#!/usr/bin/env python3
"""Record every word in words.js with the Scottish "alba" Piper voice.

    pip install piper-tts lameenc
    python tools/make_audio.py --model voice/en_GB-alba-medium.onnx

Only missing recordings are made, so re-running after editing words.js is quick.
The GitHub Action in .github/workflows/audio.yml runs this automatically.

Voice: Piper en_GB-alba-medium, trained on the Alba speech corpus
(University of Edinburgh DataShare), licensed CC BY 4.0.
"""
import argparse
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
LENGTH_SCALE = 1.15  # a little slower than normal speech, for young listeners

# Letter names, written so the voice says the name rather than the sound
LETTERS = {
    "a": "ay", "b": "bee", "c": "see", "d": "dee", "e": "ee", "f": "eff", "g": "jee",
    "h": "aitch", "i": "eye", "j": "jay", "k": "kay", "l": "ell", "m": "em", "n": "en",
    "o": "oh", "p": "pee", "q": "cue", "r": "ar", "s": "ess", "t": "tee", "u": "you",
    "v": "vee", "w": "double you", "x": "ex", "y": "why", "z": "zed",
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
    """{word: sentence} from sentences.js. A sentence's recording is redone if its text changes."""
    if not sentences_js.exists():
        return {}
    text = re.sub(r"/\*.*?\*/", "", sentences_js.read_text(encoding="utf-8"), flags=re.S)
    return {w.lower(): s for w, s in re.findall(r'^\s*([A-Za-z]+):\s*"([^"]*)"', text, flags=re.M)}


def load_voice(model):
    from piper import PiperVoice

    voice = PiperVoice.load(str(model))
    try:
        from piper import SynthesisConfig  # piper-tts 1.3+

        config = SynthesisConfig(length_scale=LENGTH_SCALE)

        def synth(text):
            chunks = list(voice.synthesize(text, syn_config=config))
            return b"".join(c.audio_int16_bytes for c in chunks), chunks[0].sample_rate
    except ImportError:  # piper-tts 1.2

        def synth(text):
            pcm = b"".join(voice.synthesize_stream_raw(text, length_scale=LENGTH_SCALE))
            return pcm, voice.config.sample_rate

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
    parser.add_argument("--force", action="store_true", help="re-record everything, not just missing files")
    args = parser.parse_args()

    jobs = [(AUDIO / "words" / f"{w}.mp3", f"{w}.") for w in list_words(ROOT / "words.js")]
    jobs += [(AUDIO / "letters" / f"{c}.mp3", f"{name}.") for c, name in LETTERS.items()]
    jobs += [(AUDIO / "phrases" / f"{key}.mp3", text) for key, text in PHRASES.items()]
    todo = [(path, text) for path, text in jobs if args.force or not path.exists()]

    # Sentences can be edited, so remember what each recording says and redo changed ones
    said_file = AUDIO / "sentences" / "said.json"
    said = json.loads(said_file.read_text(encoding="utf-8")) if said_file.exists() else {}
    sentences = list_sentences(ROOT / "sentences.js")
    for word, sentence in sorted(sentences.items()):
        path = AUDIO / "sentences" / f"{word}.mp3"
        if args.force or not path.exists() or said.get(word) != sentence:
            todo.append((path, sentence))
            said[word] = sentence

    if todo:
        synth = load_voice(args.model)
        for n, (path, text) in enumerate(todo, 1):
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(to_mp3(*synth(text)))
            print(f"[{n}/{len(todo)}] {path.relative_to(ROOT)}")
    if sentences:
        said_file.parent.mkdir(parents=True, exist_ok=True)
        said_file.write_text(json.dumps(said, indent=0, sort_keys=True), encoding="utf-8")

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
