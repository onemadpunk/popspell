# Spelling Practice

A free, sounds-first spelling website for pupils, built on **systematic synthetic phonics** and **orthographic mapping**: children link each sound (phoneme) to the letters that write it (grapheme), rather than memorising the shape of a whole word.

## How a word works

1. **Listen and look** — the word is read aloud in a British voice and shown with **sound buttons**: a dot under one-letter sounds, a line under digraphs and trigraphs (sh, ai, igh), and an arc joining a split digraph (a–e in *cake*). The pupil says the word, then touches each sound button and says the sound (touching one reads out its letters).
2. **The word hides.** Sound boxes appear, one per sound. The pupil says each sound and taps a box (segmenting), then types the word, saying each sound as they write it.
3. **Feedback that teaches.** After a wrong try, the boxes show what they wrote, sound by sound: green for right, orange for the sound to fix — e.g. *rane* for *rain* shows `r ✓ | a…e ✗ | n ✓`. If the mistake is in the sound the list is practising, the list's tip is shown. They get **3 tries**.
4. **If all tries are missed**, the word is shown with the missed sounds in orange and spelled out sound by sound (Simultaneous Oral Spelling): *"rain. R. A I. N. rain."*
5. **Results** — stars for each word, every wrong try, and a **"Sounds to practise"** panel listing which graphemes went wrong on the first try and in which words (e.g. `a–e: cake, snake`). It can be printed, and there's a button to practise only the tricky words again.

There are 48 ready-made lists of up to 15 words, grouped into stages: short vowels → blends and digraphs → split digraphs → vowel teams → r-controlled vowels → endings, silent letters and tricky words.

It's just `index.html`, `style.css`, `app.js` and the word lists in `words.js`. Nothing to install, no logins, and no data about pupils is collected.

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

The site uses the voices built into the device:

- **Microsoft Edge** (Windows) has the most natural British voices (e.g. *Sonia*, *Libby*, *Ryan*).
- **Chrome** uses *Google UK English*.
- **iPad / iPhone**: go to *Settings → Accessibility → Spoken Content → Voices → English → UK* and download an "Enhanced" voice (e.g. *Serena*, *Daniel*, or the Scottish voice *Fiona*), then pick it in the site's Settings.

Speech voices can't reliably say isolated phonemes, so the site reads whole words and letter names — the pupil says the sounds themselves.

## Trying it on your own computer

Double-click `index.html` to open it in a browser.
