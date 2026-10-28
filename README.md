# PopSpell

A free, sounds-first spelling website for pupils, built on **systematic synthetic phonics** and **orthographic mapping**: children link each sound (phoneme) to the letters that write it (grapheme), rather than memorising the shape of a whole word.

## How a word works

1. **Hear and segment.** The word is read aloud without showing its spelling. A blank box represents each sound. The pupil says the word slowly and taps a box for every sound heard.
2. **Map and spell.** The sound boxes stay visible while the pupil types the graphemes, saying each sound as they write it. New-word challenges use the same approach.
3. **Feedback that teaches.** After a wrong try, the boxes show what they wrote, sound by sound: green for right, orange for the sound to fix — e.g. *rane* for *rain* shows `r ✓ | a…e ✗ | n ✓`. If the mistake is in the sound the list is practising, the list's tip is shown. They get **3 tries**.
4. **If all tries are missed**, the word is shown with the missed sounds in orange and spelled out sound by sound (Simultaneous Oral Spelling): *"rain. R. A I. N. rain."* Sound markers show one-letter sounds, digraphs and split digraphs.
5. **Results** — stars for each word, every wrong try, and a **"Sounds to practise"** panel listing which graphemes went wrong on the first try and in which words (e.g. `a–e: cake, snake`). It can be printed, and there's a button to practise only the tricky words again.

### Sentences, new words and review

- **Every word comes with a sentence**, read aloud as in a spelling test: *"sail… The boat had a big white sail… sail."* On the spelling screen it's shown with a blank, so homophones (sail / sale) are never a guess. Sentences live in `sentences.js` and can be edited.
- **New-word challenges** end each list: 2–3 words with the same pattern that the pupil hasn't practised and never sees first (e.g. *flake, crate, grape* after the a–e list). They show whether the pupil can *use* the rule, not just remember 15 words. They're set per list with `check: [...]` in `words.js`.
- **Spaced review.** Every word a pupil practises is scheduled to come back: missed words the next day, then after 3, 7, 14 and 30 days as they get them right first time. The home page shows "🔁 6 words to practise again today".
- **My sounds** is each pupil's collection of every sound in the lists. A sound earns its ⭐ when it's spelled right first time at least 4 times, on 2 different days, and the last 3 times in a row. New stars are celebrated at the end of a list, and tapping a sound lets the pupil practise just that sound.

- **My bests.** Pupils only ever compete with themselves. Every word and question they try is a "go", right or wrong, so effort counts as well as accuracy. The results screen celebrates a new best score on a list or activity (most right first time), a best week ever (most goes), and weeks in a row of practice. When it isn't a best, it says how close they are ("4 more to beat your best week!"). There are no leaderboards. The **🏅 My bests** page shows each best score with a "Beat it" button.

Pupils type their first name before starting, so each child on a shared device has their own review words, stars and bests. Review words, stars and bests are stored **on that device**. The pupil's results also go to their teacher (below).

There are 48 ready-made lists of up to 15 words, grouped into stages: short vowels → blends and digraphs → split digraphs → vowel teams → r-controlled vowels → endings, silent letters and tricky words.

## Beyond spelling: writing, reading, listening and numeracy

Alongside the spelling lists, [`activities.js`](activities.js) adds activities that make fresh questions each time, all using the same stars, Help button, live class and teacher results:

| Area | Activities |
|---|---|
| 🎮 **Sound Hopper games** | Three six-word river crossings: short vowels, two-letter sounds, and long **a**. Hear a word, tap one drum beat per sound, then tap or drag grapheme tiles into sound boxes to build a bridge for Pip. A wrong choice points to that sound; correct bridge pieces lock in place. Pip hops across when the word is mapped. The game uses the usual stars, personal bests and teacher results. |
| ✍️ **Writing** | Capital letters and full stops · full stop, question or exclamation mark · joining words (and, but, because, so) · past tense -ed · **sentence dictation** for any spelling list (hear it, write it all: spellings, capital letter and full stop are each checked) |
| 📖 **Reading** | Tricky-word sentences · six short stories matched to the phonics stages (short vowels → digraphs → silent e → vowel teams → r-vowels → a longer Second-level story), with questions on finding information, inference and vocabulary. Every story can be read aloud. |
| 👂 **Listening and sounds** (Early level) | Rhyming words · first sounds · counting sounds · two "listen to the story" activities. The questions are spoken, and every answer has a 🔊 button, so non-readers can do them on their own. |
| 🔢 **Numeracy and maths** | **Number:** adding and taking away within 10 and 20 · number bonds to 10 and 20 · doubles and halves · times tables (2/5/10, 3/4, 6–9) · division facts · tens and ones · hundreds, tens and ones · bigger or smaller · adding and taking away three-digit numbers · × and ÷ by 10 and 100 · negative numbers<br>**Estimation and rounding:** nearest 10, 100 and 1000 · estimating answers<br>**Multiples, factors and primes**<br>**Fractions, decimal fractions and percentages:** halves, quarters and thirds · equivalent fractions · tenths and hundredths · simple percentages<br>**Money:** adding coins, change<br>**Time:** o'clock to quarter to · digital time to 5 minutes · 12- and 24-hour time · how long things take<br>**Measurement:** reading a ruler and a jug · choosing units · changing units · area and perimeter<br>**Data and analysis:** tally marks · bar charts · tables<br>**Chance:** certain, likely, even chance, unlikely, impossible<br>**Shape, position and pattern:** 2D shapes · 3D objects · angles and compass turns · number patterns · missing numbers and <, >, = |

Every list and activity is labelled with a **Curriculum for Excellence level** (Early, First or Second) and **organiser** (e.g. *Literacy · Writing · Tools for writing*, *Numeracy · Money*). Teachers' reports are grouped by these. They're a starting guide; teachers should check them against their own planning.

**Game plan:** Sound Hopper is the first game mode. It uses a character, a musical river, beat tapping, a tile bridge, and a crossing payoff. The six rounds have large touch targets and no timer or public leaderboard. The score rewards accurate mapping; speed does not affect progress. A teacher can assign a level like any other activity. Try it with pupils before expanding to modes such as an endless music run or a word-building sandbox, and check whether they can explain the sounds they hear.

The stories and their questions are in [`passages.js`](passages.js) and can be edited there. New or changed stories are recorded in Eponine's voice automatically.

### 📚 My stories: decodable stories matched to each pupil

[`stories.js`](stories.js) holds 12 short decodable stories, two for each spelling stage, each with three questions.

- **Matched automatically.** The site sounds out every word in a story to find the sounds it needs. **My stories** (on the pupil's home page) then sorts them:
  - **Ready to read:** every sound has been spelled right at least once. ⭐ means every sound is one of the pupil's star sounds.
  - **Nearly ready:** one or two sounds still to learn.
  - **Coming later:** everything else.
- **Tricky words count too.** Early ones (the, to, said, was, they…) are allowed from the start. A story can list others in `tricky`, and the pupil needs to have practised those first.
- **The reader.** Pupils read the story themselves before the questions, with sound buttons under every word (dots, lines and arcs, which can be switched off) and a ♥ on tricky words. Tapping a word reads it aloud for when they're stuck. During the questions the story can be re-read or read aloud.
- **Adding a story.** A new story in `stories.js` is matched to pupils with no extra work. Keep it to the sounds of its stage.

Stories can also be set as work from the teacher area.

## Teachers

Teachers sign in **on the site** with their Google account (👩‍🏫 **Teacher**, top right). The owner invites each teacher by email. Once signed in, a teacher has:

- **Classes:** each class has a short code (e.g. `K7P2QX`) and a join link. Open the link once on each pupil's device, or type the code on the home page. Pupils never need accounts.
- **Live class:** every pupil working right now: their list, how far through, who's finding it hard, and 🙋 **Help** requests. It updates instantly.
- **Assignments and plans:** choose lists for each pupil or for *Everyone*, and schedule lists between dates.
- **Starting checks** (🧭 on the home page, or set one as work): a placement check for a new pupil's first lesson, about 10 minutes, with one try per question and no marks shown.
  - **Spelling** uses new words the pupil hasn't practised. It tries a few lists spread through each stage, and goes through a stage list by list only once a word is missed.
  - **Numbers** asks two questions from each of the core number, money, time and fraction activities, from Early level up.
  - **Both stop after 3 gaps.** Next steps then suggests starting at the first gap and names the others. Checks are left out of the Curriculum for Excellence overview, because they deliberately go past what the pupil can do yet.
- **Next steps:** one card per pupil showing their next lesson, what's planned, how they did last time, what to work on, their starting check, and a suggestion that follows the teaching order. **Plan it** schedules it in one click. Pupils with nothing planned stand out.
- **Plans & worksheets:** print a sound-mapping worksheet with one box per phoneme, a dictation worksheet, a teacher key, a **handwriting** sheet (model, grey trace, dotted trace, own go on four-line ruling), a **sentence** sheet (fill the blank, then copy the sentence), and a **letter formation** sheet. Handwriting sheets use the reading font (Sassoon or Andika). Mark printed work by word and missed grapheme; worksheet results appear alongside online results.
- **"Pupils only see the work I set":** a per-class setting (in Classes) that hides the rest of the library from that class's devices.
- **Lesson diary:** record what a pupil did, what they need next, and optionally schedule their next list and lesson date. Diary notes stay in the teacher area.
- **Pupil roster:** add pupils, lesson dates, optional parent email and reminder preference. The day before a lesson, prepare a reminder email draft and save the homework worksheet as a PDF to attach manually.
- **👪 Parent pages:** for any pupil in the roster, **Make a parent link** creates a private page (`parent.html#…`) for the family.
  - **Sharing:** copy the link and send it by WhatsApp, text or email. Parents need no account or password.
  - **What's on it:** the pupil's first name, a note for home, what's coming up, sounds to practise, sounds getting there and sounds known well, recent work, Curriculum for Excellence progress, and tips for helping at home. The private lesson diary, parent email and other pupils' results are never on it.
  - **Sounds:** these are worked out from the results that reach the teacher, using the same rule as My sounds, and cover about the last four months. Starting checks are left out.
  - **Staying up to date:** the page updates itself whenever the teacher area loads newer work (Next steps), when **Plan it** changes what's coming up, or with **Update now**.
  - **Turning it off:** **Make a new link** replaces it and **Turn off** stops it. Either way, the old link stops working at once.
  - **Cost:** each parent visit is one read on the free Firebase plan.
- **Pupils:** each pupil's results over the last week, month, term or year, the sounds they miss most, a **spreadsheet download** of every word (opens in Google Sheets or Excel), a **Curriculum for Excellence overview** (each pupil's status per organiser: *Secure* = 85%+ right first time on 10+ questions over 2+ days, *Developing* = 60%+, otherwise *Needs support*), and a printable **📄 Progress report** per pupil with space for a teacher's comment.
- **Settings** and **Make a list**, which only appear while a teacher is signed in.
- **Site admin:** manages every class and can invite teachers. Only the owner can grant or revoke Site admin access.
- **For the owner:** a **Teachers** tab to invite teachers and Site admins and access every class.

Accounts and results are stored in Firebase (Google's cloud database, in London). Setup is a one-off job for the site owner: see [firebase/SETUP.md](firebase/SETUP.md). Without it, the spelling lists still work, but nothing is saved for teachers.

The site uses GitHub Pages and Firebase Spark. Reminder emails are drafted for a teacher to send manually; no paid scheduler or email service is required. Parent contact details and lesson notes are readable only by the class teacher and Site admins.

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

**Scottish or English accent** (⚙️ Settings, Scottish by default). In a Scottish accent the r is sounded, so the site splits *car* as `c · a · r`, *her* as `h · e · r`, *hair* as `h · ai · r` and *care* as `c · a–e · r`. The English setting treats ar, er, ir, or, ur, air, are, ear and eer as one sound each (`c · ar`). This setting changes the sound buttons, sound boxes, worksheets, My sounds and which stories are ready. The r-vowel lists get their own tips for each accent (`tipScottish` in `words.js`). It's set on each device.

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

**⚙️ Settings** lets a teacher choose the voice, speech speed, number of tries, shuffling, spelling-out, and sounds. Sound boxes are part of the lesson flow. Settings are saved on that device only.

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

