# Teacher accounts — one-off Firebase setup

PopSpell keeps teacher accounts, classes and pupils' results in **Firebase**, Google's service for app sign-in and data. Setting it up is a one-off job for the site owner, about 15 minutes. It's free on Firebase's **Spark** plan, with no bank card, and that's far more than a tutoring business needs.

Afterwards:

- the **owner** signs in on popspell.com (👩‍🏫 **Teacher**) with Google, and invites tutors by email;
- **tutors** sign in the same way, make classes, and give pupils a class code;
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
3. Open the **Teachers** tab and invite each tutor by their Google email. They then sign in the same way.

## Using it day to day

| Who | What they do |
|---|---|
| **Teacher** | 👩‍🏫 Teacher → **Classes**: copy the class link (e.g. `https://popspell.com/#/join/K7P2QX`) and open it once on each pupil device, or the pupil types the code on the home page. |
| **Pupil** | Types their first name, picks a list (or one of *"📌 Your lists today"*), and presses 🙋 **Help** if stuck. |
| **Teacher** | **Live class** shows every pupil instantly. **Assignments** sets lists. **Pupils** shows results for the last week, month, term or year, with a **spreadsheet download** for records. |
| **Owner** | Everything a teacher sees, for every class, plus the **Teachers** tab to invite and remove tutors. |

**Settings** and **Make a list** only appear while a teacher is signed in on that device. If a teacher signs in on a pupil's device to change settings, they should **sign out** afterwards (👩‍🏫 → Sign out).

## Looking after pupils' data

- Use first names plus an initial, or pupil codes (e.g. *Owl 3*), rather than full names.
- The data is held by Google (Firebase) in London. The business is the *data controller*, and Google is its *processor*. Firebase's data processing terms cover this; tell parents in the business's privacy notice that spelling results are stored this way.
- Pupils' devices can only add results to a class whose code they know. They can never read other pupils' results or the class list.
- To delete old records, use **Firestore Database → Data** in the Firebase console: `classes → (class code) → sessions`.

## Free plan limits

The Spark plan allows about 50,000 reads and 20,000 writes a day. A pupil doing a 15-word list uses roughly 20 writes, so that's about 1,000 lists a day. If PopSpell ever grows beyond that, Firebase shows a warning, and the **Blaze** plan charges only for what's used past the free amount.

## Optional: lock the key to popspell.com

In <https://console.cloud.google.com> → your project → **APIs & Services → Credentials** → the *Browser key* → **Website restrictions** → add `https://popspell.com/*` and `https://www.popspell.com/*`. This stops other websites using your project's key.
