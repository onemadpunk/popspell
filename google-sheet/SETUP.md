# Pupil reports and the teacher dashboard — setup

This takes about 15 minutes, once per tutor. Afterwards:

- every list a pupil finishes (or stops) is saved in **your own Google Sheet**;
- your **private class dashboard** shows every pupil live — who needs help, who's finding it hard, who's finished;
- you choose **each pupil's lists**, which appear on their screen as *"📌 Your lists today"*.

Only you can open the sheet and the dashboard. Google's sign-in protects them.

## 1. Make the sheet and paste in the code

1. Go to [sheets.new](https://sheets.new), signed in to your Google account. Name it e.g. **PopSpell — Mrs Green**.
2. Click **Extensions → Apps Script**.
3. Delete everything in `Code.gs`, then paste in the whole of [`Code.gs`](Code.gs) from this folder.
4. Click **＋** next to *Files* → **HTML**, name it exactly **Dashboard** (Google adds `.html`), delete what's in it, and paste in the whole of [`Dashboard.html`](Dashboard.html).
5. Optional: to stop anyone else sending junk to your sheet, type a password between the quotes in `const KEY = "";` (e.g. `"sunflower"`).
6. Click 💾 **Save**.
7. Choose **setup** in the function list at the top and press ▶ **Run**. Google asks for permission: **Review permissions** → your account → **Advanced → Go to (project)** → **Allow**. (The warning appears because you wrote the script yourself. It can read and write this spreadsheet, and read the website's list of spellings.)

## 2. Publish it as a web app

1. **Deploy → New deployment** → ⚙️ → **Web app**.
2. **Execute as: Me**, **Who has access: Anyone**. (*Anyone* lets pupils send results without signing in. They can only add results and fetch their own list names. They can't see the sheet or the dashboard.)
3. **Deploy**, and copy the **Web app URL** (it ends in `/exec`).
4. Paste that URL into your browser. You should see `"Spelling reports are working."`

## 3. Connect the website

Open `words.js` on GitHub, click ✏️ and fill in:

```js
reportUrl: "https://script.google.com/macros/s/....../exec",
reportKey: "sunflower",   // only if you set a KEY in step 1.5
teacherPin: "4821",       // optional: hides Settings and Make a list from pupils
```

Commit the change. The site updates in a minute or two.

## 4. Open your dashboard

Either:

- **In the sheet:** reload it, then use the new **Spelling → Open class dashboard** menu. This always works.
- **As its own page:** add `?page=teacher` to the end of your web app URL and bookmark it. It only opens for the Google account that owns the sheet. If it says *"only for the teacher"*, you're signed in to Google with a different account in that browser. Use the menu in the sheet instead.

The dashboard has three tabs and refreshes every 10 seconds:

| Tab | What it does |
|---|---|
| **Live class** | A card for every pupil working today: their list, how far through, how many right first time, the last word. 🙋 **Help** requests pulse at the top. Press **Done** when you've helped. Pupils who've missed 2 words in a row, or haven't got 3 in a row first time, show as *Finding it hard*. |
| **Assignments** | Choose lists for each pupil. A row called **Everyone** is shown to all pupils. You can also paste a link from *Make a list* for a one-off list. |
| **Pupils** | Each pupil's totals, their most-missed sounds over the last 30 days, and recent lists. |

## The sheet's tabs

| Tab | What's in it |
|---|---|
| **Pupils** | One line per pupil: lists done, words tried, words right, right first time, last practised |
| **Struggles** | For each pupil, the sounds they miss most often |
| **Assignments** | Who has which lists (the dashboard edits this, but you can type here too) |
| **Sessions** | Every list attempt: when, pupil, list, score, sounds missed, finished or stopped early |
| **Words** | Every word: its sounds (r·ai·n), the result (*New word:* marks challenge words), each wrong spelling |
| **Sounds** | Every sound missed on a first try (feeds *Struggles*) |

## More than one tutor

Each tutor does steps 1–2 with **their own Google account and their own sheet**, so each tutor only ever sees their own pupils. Then, in `words.js`, give each tutor a short code:

```js
tutors: {
  green: { name: "Mrs Green's class", reportUrl: "https://script.google.com/macros/s/AAA.../exec", reportKey: "", pin: "4821" },
  smith: { name: "Mr Smith's class",  reportUrl: "https://script.google.com/macros/s/BBB.../exec", reportKey: "", pin: "1357" },
},
```

On each pupil device, open the tutor's **join link** once, e.g. `https://onemadpunk.github.io/popspell/#/join/smith`. The home page then shows *"Mr Smith's class"*, and that device's results, help requests and assignments all go to Mr Smith's sheet. To move a device to another class, open the other tutor's join link.

To let the business owner see another tutor's class, that tutor shares their sheet with her (**Share** → her Gmail). She can then open their dashboard from the **Spelling** menu in that sheet.

## Good practice with pupil data

- Use **first names plus an initial**, or give each pupil a **code** (e.g. *Owl 3*), rather than full names.
- Pupils' devices look up "Your lists today" using a scrambled fingerprint of the name, so names never appear in web addresses. The sheet only ever returns that pupil's list names, never the class list.
- Live dashboard data is kept by Google for 6 hours, then forgotten. The sheet keeps results until you delete them, so tidy away old rows when they're no longer needed.
- If you use this with pupils from an organisation (a school or tutoring company), check their data policy first.

## The teacher PIN

`teacherPin` in `words.js` hides **Settings** and **Make a list** behind a 🔒 **Teacher** button. Unlocking lasts until the browser is closed. It stops pupils changing settings, but it isn't real security: anyone who reads `words.js` can see it. Your pupils' results are protected by your Google account, not by the PIN. Pupils can still switch names ("Not Ava?") so shared devices work.

## If you change Code.gs or Dashboard.html later

**Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.** The URL stays the same, so nothing changes on the website.

## Troubleshooting

- **Nothing arrives:** open the web app URL in a browser. It should say *working*. Check `reportUrl` in `words.js` is exactly that URL, and that access is set to *Anyone*.
- **The dashboard's "Add a list" menu is empty:** check `SITE_URL` near the top of `Code.gs` is your website's address. Until then you can paste list codes (e.g. `a-e`) or *Make a list* links.
- **Results appear late:** if a device was offline, results are saved and sent the next time the site is opened. (Live updates aren't saved up, so the board catches up at the pupil's next word.)
