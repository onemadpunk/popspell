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

Pupils type their first name before starting, so each child on a shared device has their own review words and stars. Review words and stars are stored **on that device**. The pupil's results also go to their teacher (below).

There are 48 ready-made lists of up to 15 words, grouped into stages: short vowels → blends and digraphs → split digraphs → vowel teams → r-controlled vowels → endings, silent letters and tricky words.

## Teachers

Teachers sign in **on the site** with their Google account (👩‍🏫 **Teacher**, top right). The owner invites each teacher by email. Once signed in, a teacher has:

- **Classes:** each class has a short code (e.g. `K7P2QX`) and a join link. Open the link once on each pupil's device, or type the code on the home page. Pupils never need accounts.
- **Live class:** every pupil working right now: their list, how far through, who's finding it hard, and 🙋 **Help** requests. It updates instantly.
- **Assignments:** choose lists for each pupil, or for *Everyone*. They appear on that pupil's home page as "📌 Your lists today".
- **Pupils:** each pupil's results over the last week, month, term or year, the sounds they miss most, and a **spreadsheet download** of every word (opens in Google Sheets or Excel).
- **Settings** and **Make a list**, which only appear while a teacher is signed in.
- **For the owner:** a **Teachers** tab to invite and remove teachers, and access to every class.

Accounts and results are stored in Firebase (Google's cloud database, in London). Setup is a one-off job for the site owner: see [firebase/SETUP.md](firebase/SETUP.md). Without it, the spelling lists still work, but nothing is saved for teachers.

---

## Putting it online with GitHub Pages (free)

1. Sign in at [github.com](https://github.com) (or create a free account).
2. Click **+** (top right) → **New repository**. Name it e.g. `spelling`. Choose **Public**, then **Create repository**.
3. On the new repository page click **uploading an existing file**, drag in all the files from this folder, and press **Commit changes**.
4. Go to **Settings → Pages**. Under *Build and deployment*, set **Source** to *Deploy from a branch*, branch **main**, folder **/ (root)**, and press **Save**.
5. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/REPOSITORY/`.
6. Optional, your own domain: at your domain company add A records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and a CNAME for `www` pointing to `YOUR-USERNAME.github.io`. Then type the domain in **Settings → Pages → Custom domain**, save, and tick **Enforce HTTPS**.

This site lives at **https://popspell.com**.

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

### Eponine — the recorded voice (default)

Every word in the lists, every sentence, the letter names and the praise phrases are pre-recorded with **Eponine**, a voice from [Pocket TTS](https://github.com/kyutai-labs/pocket-tts) by Kyutai, based on the VCTK corpus from the University of Edinburgh (both CC BY 4.0, which the credit line at the bottom of the site covers). The recordings are small MP3s in the `audio` folder, so they play instantly on any device.

**New words get recorded automatically.** When `words.js` or `sentences.js` is changed on GitHub, the *Make recordings* action (in the repository's **Actions** tab) records any new or changed words and sentences, and adds them to the site within a few minutes. To record on your own computer instead:

```
pip install pocket-tts lameenc
python tools/make_audio.py
```

Words in **Make a list** links that aren't in any list use the device's own voice.

**Checking the recordings:** open **popspell.com/listen.html** (also linked from Settings). Play each word, sentence and letter, mark any that sound wrong with a note, then copy the list. Those words get fixed in `tools/make_audio.py`: either a new take (`--only crash`), or a different way of writing it for the voice in `WORD_FIXES`. Takes approved by ear go in `APPROVED`, so they're never replaced.

### Device voices (fallback)

When a recording isn't available, or if you pick a different voice in Settings, the site uses the voices built into the device:

- **Microsoft Edge** (Windows) has the most natural British voices (e.g. *Sonia*, *Libby*, *Ryan*).
- **Chrome** uses *Google UK English*.
- **iPad / iPhone**: go to *Settings → Accessibility → Spoken Content → Voices → English → UK* and download an "Enhanced" voice (e.g. *Serena*, *Daniel*, or the Scottish voice *Fiona*), then pick it in the site's Settings.

Speech voices can't reliably say isolated phonemes, so the site reads whole words and letter names — the pupil says the sounds themselves.

## Trying it on your own computer

Double-click `index.html` to open it in a browser.
