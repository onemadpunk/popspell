# Pupil reports in Google Sheets — setup

This takes about 10 minutes, once. After that, every time a pupil finishes (or stops) a list, their results appear in a Google Sheet that only you can see.

## 1. Make the sheet

1. Go to [sheets.new](https://sheets.new) (signed in to your Google account). Name it e.g. **Spelling reports**.
2. Click **Extensions → Apps Script**.
3. Delete everything in the editor, then paste in the whole of `Code.gs` from this folder.
4. Optional: to stop anyone else sending junk to your sheet, type a password between the quotes in `const KEY = "";` — e.g. `const KEY = "sunflower";`
5. Click 💾 **Save**.
6. In the toolbar, choose **setup** from the function list and press ▶ **Run**. Google will ask for permission — click **Review permissions**, choose your account, then **Advanced → Go to (project name)** → **Allow**. (Google shows a warning because you wrote the script yourself; it only touches this one spreadsheet.) Your sheet now has the tabs *Pupils, Struggles, Sessions, Words, Sounds*.

## 2. Publish it as a web app

1. Click **Deploy → New deployment**. Click the ⚙️ next to *Select type* and choose **Web app**.
2. Set **Execute as: Me** and **Who has access: Anyone**. (*Anyone* is needed so pupils can send results without signing in. They can only add rows — they can't see the sheet.)
3. Click **Deploy**, and copy the **Web app URL** (it ends in `/exec`).
4. Paste that URL into your browser — you should see `"Spelling reports are working."`

## 3. Connect the website

In `words.js` (on GitHub: open the file, click ✏️), fill in:

```js
reportUrl: "https://script.google.com/macros/s/....../exec",
reportKey: "sunflower",   // only if you set a KEY in step 1.4, otherwise leave ""
```

Commit the change. From now on, the start screen asks **"What's your name?"**. The name is remembered on that device, with a **"Not Ava?"** button so pupils sharing a computer can switch.

## What you'll see

| Tab | What's in it |
|---|---|
| **Pupils** | One line per pupil: lists done, words tried, words right, right first time, last practised |
| **Struggles** | For each pupil, the sounds they miss most often — e.g. *Ava · a–e · 6 times* |
| **Sessions** | Every list attempt: when, pupil, list, score, which sounds were missed, finished or stopped early |
| **Words** | Every word: its sounds (r·ai·n), the result, and each wrong spelling (e.g. *rane*) |
| **Sounds** | Every sound missed on a first try — this feeds *Struggles* |

*Pupils* and *Struggles* update themselves. Use **Data → Create a filter** on *Words* to look at one pupil or one list.

"Sounds missed" counts the pupil's **first** try at each word, which shows what they really know before any hints.

## Good practice with pupil data

- Use **first names plus an initial**, or give each pupil a **code** (e.g. *Owl 3*), rather than full names.
- The sheet is in your own Google account. Don't share it with anyone who doesn't need it, and delete old rows when they're no longer needed.
- If you use this with pupils from an organisation (a school or tutoring company), check their data policy first.

## If you change Code.gs later

Use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. This keeps the same URL, so nothing needs changing on the website.

## Troubleshooting

- **Nothing arrives:** open the web app URL in a browser — it should say *working*. Check `reportUrl` in `words.js` is exactly that URL, and that access is set to *Anyone*.
- **Results appear late:** if a device was offline, results are saved and sent the next time the site is opened.
