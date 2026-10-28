# Teacher accounts — one-off Firebase setup

PopSpell keeps teacher accounts, classes and pupils' results in **Firebase**, Google's service for app sign-in and data. Setting it up is a one-off job for the site owner, about 15 minutes. It's free on Firebase's **Spark** plan, with no bank card, and that's far more than a tutoring business needs.

Afterwards:

- the **owner** signs in on popspell.com (👩‍🏫 **Teacher**) with Google and can invite a **site admin**;
- the **site admin** can manage every class, invite teachers, add pupils, schedule work, keep a lesson diary and review results;
- **teachers** sign in the same way, manage their classes, and give pupils a class code;
- **pupils** never need accounts. Their device joins a class once, and they type their first name.

## 1. Create the project

1. Go to <https://console.firebase.google.com>, signed in with the **owner's** Google account.
2. **Create a project** → name it `popspell` → you can turn **Google Analytics off** (it isn't needed) → **Create project**.

## 2. Switch on sign-in

1. In the left menu, **Build → Authentication → Get started**.
2. **Sign-in method** tab:
   - **Google** → **Enable** → choose the support email → **Save**.
   - **Anonymous** → **Enable** → **Save**. Pupils' devices use this, so they can send results without accounts.
3. **Settings** tab → **Authorized domains** → **Add domain** → `popspell.com`, then add `www.popspell.com` too.

## 3. Create the database

1. **Build → Firestore Database → Create database**.
2. **Location: `europe-west2 (London)`**. This can't be changed later, and it keeps pupils' data in the UK.
3. **Start in production mode** → **Create**.
4. Open the **Rules** tab. Delete what's there, and paste in the whole of [`firestore.rules`](firestore.rules) from this folder.
5. On the line `function owners() { return ['owner@example.com']; }`, put the **owner's Google email in lower case** between the quotes, e.g. `['sara.green@gmail.com']`.
6. **Publish**.

## 4. Connect the website

1. Click the ⚙️ next to *Project Overview* → **Project settings** → scroll to **Your apps** → the **`</>`** (web) button.
2. Nickname `PopSpell` → leave *Firebase Hosting* unticked → **Register app**.
3. You'll see a block called `firebaseConfig`. Copy the four values into `words.js` on GitHub (✏️ → edit → **Commit changes**):

```js
firebase: {
  apiKey: "AIza…",
  authDomain: "popspell-xxxxx.firebaseapp.com",
  projectId: "popspell-xxxxx",
  appId: "1:…:web:…"
}
```

These values are meant to be public. They only say *which* database to use. Who can read or change anything is decided by the rules you published in step 3.

## 5. Sign in as the owner

1. Go to **https://popspell.com** → **👩‍🏫 Teacher** → **Sign in with Google**, using the owner's email from step 3.
2. You'll see **Hello, … Owner**. Open the **Classes** tab and make your first class.
3. Open the **Teachers** tab. To give a trusted person full site control, invite their Google email with role **Site admin**. They then sign in the same way. Only the owner can grant or remove site admin access.

## Using it day to day

| Who | What they do |
|---|---|
| **Teacher** | 👩‍🏫 Teacher → **Classes**: copy the class link (e.g. `https://popspell.com/#/join/K7P2QX`) and open it once on each pupil device, or the pupil types the code on the home page. |
| **Pupil** | Types their first name, picks a list (or one of *"📌 Your lists today"*), and presses 🙋 **Help** if stuck. |
| **Teacher** | **Live class** shows every pupil instantly. **Assignments** sets lists. **Pupils** shows results for the last week, month, term or year, with a **spreadsheet download** for records. |
| **Owner** | Everything a teacher sees, for every class, plus the **Teachers** tab to invite and remove tutors. |
| **Site admin** | Manages all classes, teachers, pupils, plans, worksheets, diary notes and results. Cannot grant another site admin role. |
| **Teacher** | Adds pupils to their classes, sets online assignments and dated plans, and marks paper worksheets so their results appear with online work. |

## Sound-mapping worksheets and lesson diary

In **Plans & worksheets**, choose a pupil, a list and the dates when the work should appear online. **Print sound map / Save PDF** creates a pupil sheet with one blank box per sound, without showing the whole word. An adult says each word aloud; the child segments it and writes the grapheme for each sound. A separate **teacher key** shows the words and sound map. **Mark worksheet** records right-first-time, right-with-help or missed for each word, plus any sounds to revisit. These marks appear in **Pupils** results and the spreadsheet export alongside online results.

The **Lesson diary** shows recent recorded work beside teacher-only notes for the last lesson and the next one. Choosing a next list and date also schedules that list online. The **Pupils** tab holds the class roster, parent email (if provided), the next lesson date and optional homework list. Pupil devices cannot read parent contact details or diary notes.

## Next steps and "assigned work only"

**Next steps** (👩‍🏫 Teacher → Next steps) shows one card per pupil: their next lesson date, the work planned for it, how they did last time, the sounds to work on, and a suggestion that follows the teaching order. It suggests moving on after 80% or more right first time, practising again at 50–79%, and re-teaching below that. **Plan it** puts the chosen list on the pupil's schedule for that date and sets it as their homework list. Pupils with nothing planned are outlined in orange.

In **Classes**, tick **Pupils only see the work I set** to hide the rest of the library from that class's devices. Pupils then see only *"📌 Your lists today"*, their review words and My sounds. Teachers signed in on the device still see everything.

## Manual parent reminders (no paid service)

If a parent requests reminders, save their email and tick **Parent requested reminders** on the pupil's roster card. The **Pupils** tab highlights lessons due tomorrow. **Prepare reminder email** opens a draft in the computer's mail app; the teacher checks and sends it. If there is homework, use **Print homework / Save PDF** first and attach the saved PDF to the draft. PopSpell does not send email automatically, so no paid email provider or Firebase billing upgrade is needed.

**Settings** and **Make a list** only appear while a teacher is signed in on that device. If a teacher signs in on a pupil's device to change settings, they should **sign out** afterwards (👩‍🏫 → Sign out).

## Looking after pupils' data

- Use first names plus an initial, or pupil codes (e.g. *Owl 3*), rather than full names.
- The data is held by Google (Firebase) in London. The business is the *data controller*, and Google is its *processor*. Firebase's data processing terms cover this; tell parents in the business's privacy notice that spelling results are stored this way.
- Pupils' devices can only add results to a class whose code they know. They can never read other pupils' results or the class list.
- To delete old records, use **Firestore Database → Data** in the Firebase console: `classes → (class code) → sessions`.

## Free plan limits

PopSpell stays on the no-cost **Spark** plan with no billing account. The Firestore free quota is 50,000 document reads and 20,000 writes per day, plus 1 GiB of stored data. If usage reaches a free limit, the affected service can stop accepting requests until its quota resets; it does not start charging automatically. Check **Firestore Database → Usage** in Firebase if usage grows.

## If the rules are ever changed

[`rules.test.mjs`](rules.test.mjs) checks 95 situations on Firebase's local emulator. Examples: "a teacher can't read another teacher's pupils", "a pupil's device can't read results" and "nobody can list parent pages". Run it after any change to `firestore.rules` (instructions are at the top of the file).

When `firestore.rules` changes on GitHub, paste the new version into **Firestore Database → Rules** again and publish. Keep your own email in `owners()`. Parent pages need the version from October 2026 or later: until then, parent links show "This link isn't working".

## Optional: lock the key to popspell.com

In <https://console.cloud.google.com> → your project → **APIs & Services → Credentials** → the *Browser key* → **Website restrictions** → add `https://popspell.com/*` and `https://www.popspell.com/*`. This stops other websites using your project's key.

