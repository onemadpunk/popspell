# Spelling Practice

A free, sounds-first spelling website for pupils, built on **systematic synthetic phonics** and **orthographic mapping**: children link each sound (phoneme) to the letters that write it (grapheme), rather than memorising the shape of a whole word.

## How a word works

1. **Listen and look** — the word is read aloud in a British voice and shown with **sound buttons**: a dot under one-letter sounds, a line under digraphs and trigraphs (sh, ai, igh), and an arc joining a split digraph (a–e in *cake*). The pupil says the word, then touches each sound button and says the sound (touching one reads out its letters).
2. **The word hides.** Sound boxes appear, one per sound. The pupil says each sound and taps a box (segmenting), then types the word, saying each sound as they write it.
3. **Feedback that teaches.** After a wrong try, the boxes show what they wrote, sound by sound: green for right, orange for the sound to fix — e.g. *rane* for *rain* shows `r ✓ | a…e ✗ | n ✓`. If the mistake is in the sound the list is practising, the list's tip is shown. They get **3 tries**.
4. **If all tries are missed**, the word is shown with the missed sounds in orange and spelled out sound by sound (Simultaneous Oral Spelling): *"rain. R. A I. N. rain."*
5. **Results** — stars for each word, every wrong try, and a **"Sounds to practise"** panel listing which graphemes went wrong on the first try and in which words (e.g. `a–e: cake, snake`). It can be printed, and there's a button to practise only the tricky words again.

### Sentences, new words and review

- **Every word comes with a sentence**, read aloud as in a spelling test: *"sail… The boat had a big white sail… sail."* On the spelling screen it's shown with a blank, so homophones (sail / sale) are never a guess. Sentences live in `sentences.js` and can be edited.
- **New-word challenges** end each list: 2–3 words with the same pattern that the pupil hasn't practised and never sees first (e.g. *flake, crate, grape* after the a–e list). They show whether the pupil can *use* the rule, not just remember 15 words. They're set per list with `check: [...]` in `words.js`.
- **Spaced review.** Every word a pupil practises is scheduled to come back: missed words the next day, then after 3, 7, 14 and 30 days as they get them right first time. The home page shows "🔁 6 words to practise again today".
- **My sounds** is each pupil's collection of every sound in the lists. A sound earns its ⭐ when it's spelled right first time at least 4 times, on 2 different days, and the last 3 times in a row. New stars are celebrated at the end of a list, and tapping a sound lets the pupil practise just that sound.

Pupils type their first name before starting, so each child on a shared device has their own review words and stars. This progress is stored **on that device**. (With reports switched on, the teacher's Google Sheet has everything from every device.)

There are 48 ready-made lists of up to 15 words, grouped into stages: short vowels → blends and digraphs → split digraphs → vowel teams → r-controlled vowels → endings, silent letters and tricky words.

It's just `index.html`, `style.css`, `app.js` and the word lists in `words.js`. Nothing to install and no logins.

## Reports and the teacher dashboard (optional)

Connect **your own Google Sheet** (about 15 minutes, see [google-sheet/SETUP.md](google-sheet/SETUP.md)) and you get:

- **Reports:** every pupil's results, the sounds each struggles with most, and every wrong spelling.
- **A private class dashboard**, protected by your Google sign-in. It shows every pupil live: who has pressed 🙋 **Help**, who's finding it hard, who has finished.
- **Assignments:** choose lists for each pupil (or *Everyone*). They appear on that pupil's home page as "📌 Your lists today".
- **A teacher PIN** that hides Settings and Make a list from pupils.
- **More than one tutor:** each tutor has their own sheet and dashboard, and pupil devices join a class once with a link like `#/join/smith`.

With nothing connected (the default), nothing is sent anywhere.

---

## Putting it online with GitHub Pages (free)

1. Sign in at [github.com](https://github.com) (or create a free account).
2. Click **+** (top right) → **New repository**. Name it e.g. `spelling`. Choose **Public**, then **Create repository**.
3. On the new repository page click **uploading an existing file**, drag in all the files from this folder, and press **Commit changes**.
4. Go to **Settings → Pages**. Under *Build and deployment*, set **Source** to *Deploy from a branch*, branch **main**, folder **/ (root)**, and press **Save**.
5. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/spelling/`.

## Changing the word lists

Open `words.js` on GitHub, click the ✏️ pencil icon, make your changes and press **Commit changes**. The site updates in a minute or two.

```js
{ id: "a-e", title: "a–e (silent e and long a)", tip: "The silent e makes the a say its name: cap → cape.",
  words: ["cake", "make", "wake", "gave", "brave"] },
```

- `id` — short, lower case, no spaces, unique (used in the web address, e.g. `.../#/list/a-e`).
- `title` — what pupils see. `tip` — optional hint.
- `words` — each word in "quotes", separated by commas.
- `focus` — optional: the graphemes the list is practising, e.g. `focus: ["oi", "oy"]`. Without it, the site uses the graphemes found in most of the list's words.

### Sounds (graphemes)

The site splits words into sounds by itself, and gets the common patterns right. Open a list and click **Words in this list** to check the sound buttons. If a word is split wrongly (usually tricky words), write its sounds with dashes, and a split digraph as `a_e`, `i_e`, `o_e`, `u_e` or `e_e`:

```
"h-a-ve"   "c-oul-d"   "p-eo-p-le"   "sc-e_e-n"   "one-"
```

A dash at the end (`"one-"`) keeps the whole word as one chunk with no sound buttons.

## Lists for a single lesson

Press **Make a list** on the site, type the words, check the sound buttons in the preview, and press **Make link**. The words are stored inside the link, so it can be pasted into an email, Teams or Google Classroom. Nothing is saved on the website. Dashes work here too.

## The font: Sassoon

The site uses **Sassoon Primary / Sassoon Infant** wherever it's installed — many school computers already have it. Sassoon is a paid font, so it can't be included in a public website without a web-font licence. Without it, the site uses **Andika**, a free font also designed for early readers (single-storey *a* and *g*).

To use Sassoon for everyone (including pupils at home), buy a **web-font** licence, put the `.woff2` file in a `fonts` folder, and in `words.js` set:

```js
fontFile: "fonts/SassoonPrimary.woff2"
```

## Settings

**⚙️ Settings** lets you choose the voice, speech speed, how long the word stays on screen (or until the pupil presses "I'm ready"), the number of tries, shuffling, sound boxes, spelling-out, and sounds. Settings are saved on that device only.

## Voices

### Alba — the Scottish voice (default)

Every word in the lists, the letter names and the praise phrases are pre-recorded with **Alba**, a Scottish neural voice from the [Piper](https://github.com/rhasspy/piper) project, trained on the Alba speech corpus from the University of Edinburgh (CC BY 4.0 — the credit line at the bottom of the site covers this). The recordings are small MP3s in the `audio` folder, so they play instantly on any device.

**New words get recorded automatically.** When `words.js` is changed on GitHub, the *Make alba recordings* action (in the repository's **Actions** tab) records any new words and adds them to the site within a few minutes. To record on your own computer instead:

```
pip install piper-tts lameenc
python tools/make_audio.py --model voice/en_GB-alba-medium.onnx
```

(download `en_GB-alba-medium.onnx` and `.onnx.json` from [rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_GB/alba/medium) into a `voice` folder first). Words in **Make a list** links that aren't in any list use the device's own voice.

To check how a word sounds, open `audio/words/<word>.mp3`. If one sounds wrong, delete it and run the tool again with a different spelling in `PHRASES` / `LETTERS`, or re-record everything with `--force`.

### Device voices (fallback)

When a recording isn't available, or if you pick a different voice in Settings, the site uses the voices built into the device:

- **Microsoft Edge** (Windows) has the most natural British voices (e.g. *Sonia*, *Libby*, *Ryan*).
- **Chrome** uses *Google UK English*.
- **iPad / iPhone**: go to *Settings → Accessibility → Spoken Content → Voices → English → UK* and download an "Enhanced" voice (e.g. *Serena*, *Daniel*, or the Scottish voice *Fiona*), then pick it in the site's Settings.

Speech voices can't reliably say isolated phonemes, so the site reads whole words and letter names — the pupil says the sounds themselves.

## Trying it on your own computer

Double-click `index.html` to open it in a browser.
