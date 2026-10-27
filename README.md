# Spelling Practice

A free spelling website for pupils, using **Look · Say · Cover · Write · Check**.

1. The word appears on screen and is **read aloud** in a British voice.
2. After a few seconds the word **hides**.
3. The pupil **types** it. They get **3 tries**, with the word read again after each miss.
4. If they miss all 3, the correct spelling is shown and read out letter by letter.
5. At the end there's a results table (stars, and each wrong try) that can be printed, plus a button to practise only the tricky words again.

There are 47 ready-made lists of up to 15 words each, grouped into stages (short vowels → blends and digraphs → silent e → vowel teams → r-controlled vowels → endings and tricky words).

It's just three files (`index.html`, `style.css`, `app.js`) plus the word lists in `words.js`. Nothing to install, no logins, no data about pupils is collected.

---

## Putting it online with GitHub Pages (free)

1. Sign in at [github.com](https://github.com) (or create a free account).
2. Click **+** (top right) → **New repository**. Name it e.g. `spelling`. Choose **Public**, then **Create repository**.
3. On the new repository page click **uploading an existing file**, drag in all the files from this folder, and press **Commit changes**.
4. Go to **Settings → Pages**. Under *Build and deployment*, set **Source** to *Deploy from a branch*, branch **main**, folder **/ (root)**, and press **Save**.
5. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/spelling/`.

## Changing the word lists

Open `words.js` on GitHub, click the ✏️ pencil icon, make your changes and press **Commit changes**. The site updates in a minute or two.

Each list looks like this:

```js
{ id: "a-e", title: "a–e (silent e and long a)", tip: "The silent e makes the a say its name: cap → cape.",
  words: ["cake", "make", "wake", "gave", "brave"] },
```

- `id` — short, lower case, no spaces, must be unique (it's used in the web address, e.g. `.../#/list/a-e`).
- `title` — what pupils see.
- `tip` — optional hint shown before starting.
- `words` — each word in "quotes", separated by commas.

The site name at the top of `words.js` can be changed too.

## Lists for a single lesson (no editing needed)

Press **Make a list** on the site, type the words, and press **Make link**. The words are stored inside the link itself, so you can paste it into an email, Teams, Google Classroom, etc. Nothing is saved on the website.

## Linking pupils straight to a list

Every list has its own address, e.g.
`https://YOUR-USERNAME.github.io/spelling/#/list/oa`

## Settings

The **⚙️ Settings** button lets you choose the voice, speech speed, how long the word stays on screen (or until the pupil presses "I'm ready"), the number of tries, whether the words are shuffled, and sounds. Settings are saved on that device only.

## Voices

The site uses the voices built into the device:

- **Microsoft Edge** (Windows) has the most natural British voices (e.g. *Sonia*, *Libby*, *Ryan*).
- **Chrome** uses *Google UK English*.
- **iPad / iPhone**: for a better voice go to *Settings → Accessibility → Spoken Content → Voices → English → UK* and download an "Enhanced" voice (e.g. *Serena*, *Daniel*, or the Scottish voice *Fiona*), then pick it in the site's Settings.

## Trying it on your own computer

Double-click `index.html` to open it in a browser. Everything works offline except the Andika font, which loads from Google Fonts (it falls back to a similar font).
