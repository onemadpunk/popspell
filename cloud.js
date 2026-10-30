/* PopSpell cloud: teacher accounts, classes and pupils' results, stored in Firebase.
   app.js and teacher.js use this through window.PopCloud once window.PopCloudReady resolves.
   With no firebase settings in words.js, PopCloudReady resolves to null and the site works on its own. */
const SITE = window.SITE || {};
const config = SITE.firebase;
const VERSION = "10.12.2";

if (!config || !config.apiKey) {
  window.__popCloudResolve(null);
} else {
  start().catch(err => {
    console.error("PopSpell: couldn't connect to Firebase", err);
    window.__popCloudResolve(null);
  });
}

async function start() {
  const base = `https://www.gstatic.com/firebasejs/${VERSION}`;
  const [{ initializeApp }, authLib, db] = await Promise.all([
    import(`${base}/firebase-app.js`),
    import(`${base}/firebase-auth.js`),
    import(`${base}/firebase-firestore.js`)
  ]);
  const {
    getAuth, onAuthStateChanged, signInAnonymously, signInWithPopup, signInWithRedirect,
    GoogleAuthProvider, signOut, connectAuthEmulator
  } = authLib;
  const {
    initializeFirestore, persistentLocalCache, connectFirestoreEmulator, doc, getDoc, getDocFromServer, setDoc,
    updateDoc, addDoc, deleteDoc, collection, query, where, orderBy, limit, getDocs, getDocsFromServer,
    onSnapshot, serverTimestamp, Timestamp, writeBatch
  } = db;

  const app = initializeApp(config);
  const auth = getAuth(app);
  // Results are kept on the device until they reach the server, even if the page is closed
  const store = initializeFirestore(app, { localCache: persistentLocalCache() });
  const emulator = !!SITE.firebaseEmulator && /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  if (emulator) {
    connectAuthEmulator(auth, `http://${location.hostname}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(store, location.hostname, 8080);
  }

  const lower = s => String(s || "").trim().toLowerCase();
  const todayKey = () => new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());
  const pupilKey = name => lower(name).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "pupil";
  async function fingerprint(name) {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(lower(name)));
    return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  // Join codes avoid letters that look alike (0/O, 1/I/L)
  const CODE_LETTERS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), b => CODE_LETTERS[b % CODE_LETTERS.length]).join("");

  let profile = null; // { email, name, role } once a teacher is signed in
  let profileReady = null; // the invitation check for whoever signed in last
  const listeners = new Set();
  const authReady = new Promise(resolve => {
    onAuthStateChanged(auth, u => {
      const check = loadProfile(u);
      profileReady = check;
      check.then(p => {
        if (profileReady !== check) return; // someone else has signed in since
        profile = p;
        listeners.forEach(fn => fn(profile));
        resolve();
      });
    });
  });

  // A Google account is a teacher if it has been invited, or an owner if the security rules
  // name it. Always asked of the server, never the device's copy, and without trial writes:
  // a refused write can linger in the device's copy and make it look as if it worked.
  async function loadProfile(u) {
    if (!u || u.isAnonymous || !u.email) return null;
    const email = lower(u.email);
    const name = u.displayName || email;
    const ref = doc(store, "teachers", email);
    try {
      const snap = await getDocFromServer(ref);
      if (snap.exists()) return { email, name: snap.data().name || name, role: snap.data().role, uid: u.uid };
    } catch { return { email, name, role: null, uid: u.uid }; }
    try {
      await getDocsFromServer(query(collection(store, "teachers"), limit(1))); // only owners may list teachers
    } catch {
      return { email, name, role: null, uid: u.uid }; // signed in, but not invited
    }
    // An owner's first sign-in: make their record so they appear in the Teachers tab
    await setDoc(ref, { name, role: "owner", invitedBy: email, invitedAt: serverTimestamp() }).catch(() => {});
    return { email, name, role: "owner", uid: u.uid };
  }

  async function pupilAuth() {
    await authReady;
    if (!auth.currentUser) await signInAnonymously(auth);
  }

  const api = {
    /* ---------- Pupils' devices ---------- */

    async classInfo(code) {
      await pupilAuth();
      const id = String(code || "").trim().toUpperCase();
      if (!/^[A-Z0-9]{4,12}$/.test(id)) return null;
      const snap = await getDoc(doc(store, "classes", id));
      return snap.exists() ? { id, name: snap.data().name, teacherName: snap.data().teacherName || "",
        assignedOnly: !!snap.data().assignedOnly,
        accent: ["scottish", "english"].includes(snap.data().accent) ? snap.data().accent : "" } : null;
    },

    async live(classId, pupil, fields) {
      await pupilAuth();
      await setDoc(doc(store, "classes", classId, "live", pupilKey(pupil)),
        Object.assign({}, fields, { pupil: String(pupil).slice(0, 40), seen: serverTimestamp() }), { merge: true });
    },

    // Resolves once the server has it. Until then it's kept on the device and retried.
    async session(classId, payload) {
      await pupilAuth();
      await addDoc(collection(store, "classes", classId, "sessions"), Object.assign({}, payload, { at: serverTimestamp() }));
    },

    async assigned(classId, pupil) {
      await pupilAuth();
      const read = async key => {
        try {
          const s = await getDoc(doc(store, "classes", classId, "assign", key));
          if (!s.exists()) return [];
          const data = s.data();
          const today = todayKey();
          return (data.lists || []).concat((data.plans || [])
            .filter(p => p.from <= today && today <= p.until).map(p => p.list));
        }
        catch { return []; }
      };
      const [mine, everyone] = await Promise.all([read(await fingerprint(pupil)), read("everyone")]);
      return [...new Set(mine.concat(everyone))];
    },

    // A pupil's own progress (stars, review words, bests), so it follows them between devices
    async progress(classId, pupil) {
      await pupilAuth();
      const snap = await getDoc(doc(store, "classes", classId, "progress", await fingerprint(pupil)));
      return snap.exists() ? snap.data() : null;
    },
    async saveProgress(classId, pupil, prog) {
      await pupilAuth();
      await setDoc(doc(store, "classes", classId, "progress", await fingerprint(pupil)), {
        pupil: String(pupil).trim().slice(0, 40), words: prog.words || {}, sounds: prog.sounds || {},
        bests: prog.bests || { weeks: {}, lists: {} }, updated: serverTimestamp()
      });
    },

    /* ---------- Teachers ---------- */

    // Waits until the invitation check has caught up with whoever is signed in right now
    async me() {
      await authReady;
      for (let waited = 0; waited < 8000; waited += 100) {
        await profileReady;
        const u = auth.currentUser;
        const settled = !u || u.isAnonymous || (profile && profile.uid === u.uid);
        if (settled) break;
        await new Promise(r => setTimeout(r, 100));
      }
      return profile;
    },
    onTeacher(fn) { listeners.add(fn); authReady.then(() => fn(profile)); return () => listeners.delete(fn); },

    async signIn() {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      try { await signInWithPopup(auth, provider); await api.me(); }
      catch (err) {
        if (/popup-blocked|operation-not-supported/.test(err.code || "")) return signInWithRedirect(auth, provider);
        throw err;
      }
    },
    signOut: () => { sessionStorage.removeItem("popspell-calendar-token"); return signOut(auth); },

    // Asked for only when a teacher syncs lessons, never at sign-in, so signing in is unchanged.
    // Google's permission lasts about an hour; it's kept for this tab only.
    calendarToken(ask = false) {
      try {
        const saved = JSON.parse(sessionStorage.getItem("popspell-calendar-token") || "null");
        if (saved && saved.uid === (auth.currentUser || {}).uid && saved.expires > Date.now()) return Promise.resolve(saved.token);
      } catch { /* ask again */ }
      if (!ask) return Promise.resolve(null);
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/calendar.events");
      provider.setCustomParameters({ login_hint: (auth.currentUser || {}).email || "" });
      // The popup has to open straight from the click, so nothing is awaited before it
      return authLib.reauthenticateWithPopup(auth.currentUser, provider).then(result => {
        const token = GoogleAuthProvider.credentialFromResult(result).accessToken;
        sessionStorage.setItem("popspell-calendar-token", JSON.stringify({ token, uid: auth.currentUser.uid, expires: Date.now() + 55 * 60000 }));
        return token;
      });
    },
    forgetCalendarToken: () => sessionStorage.removeItem("popspell-calendar-token"),

    async classes() {
      const p = await api.me();
      if (!p || !p.role) return [];
      const ref = collection(store, "classes");
      const snap = await getDocs(["owner", "admin"].includes(p.role) ? ref : query(ref, where("teacher", "==", p.uid)));
      return snap.docs.map(d => Object.assign({ id: d.id }, d.data()))
        .sort((a, b) => (a.teacherName || "").localeCompare(b.teacherName || "") || a.name.localeCompare(b.name));
    },

    async createClass(name) {
      const p = await api.me();
      for (let tries = 0; tries < 5; tries++) {
        const id = newCode();
        const ref = doc(store, "classes", id);
        if ((await getDoc(ref)).exists()) continue;
        await setDoc(ref, { name: String(name).trim().slice(0, 60), teacher: p.uid, teacherName: p.name, teacherEmail: p.email, createdAt: serverTimestamp() });
        return id;
      }
      throw new Error("Couldn't make a class code — please try again.");
    },
    renameClass: (id, name) => updateDoc(doc(store, "classes", id), { name: String(name).trim().slice(0, 60) }),
    // On: pupils in this class see only the work set for them, not the whole library
    setAssignedOnly: (id, on) => updateDoc(doc(store, "classes", id), { assignedOnly: !!on }),
    // Scottish (the r is sounded: c·a·r) or English (c·ar), for every pupil device in the class
    setAccent: (id, accent) => updateDoc(doc(store, "classes", id), { accent: accent === "english" ? "english" : "scottish" }),

    watchLive(classId, fn) {
      return onSnapshot(collection(store, "classes", classId, "live"),
        snap => fn(snap.docs.map(d => {
          const v = d.data();
          return Object.assign({ key: d.id }, v, { seen: v.seen ? v.seen.toMillis() : Date.now(), helpAt: v.helpAt || null });
        })),
        err => fn(null, err));
    },
    clearHelp: (classId, key) => updateDoc(doc(store, "classes", classId, "live", key), { help: false, helpAt: null }),

    async assignments(classId) {
      const snap = await getDocs(collection(store, "classes", classId, "assign"));
      return snap.docs.map(d => ({ key: d.id, who: d.data().who || d.id,
        lists: d.data().lists || [], plans: d.data().plans || [] }))
        .sort((a, b) => (a.key === "everyone" ? -1 : b.key === "everyone" ? 1 : a.who.localeCompare(b.who)));
    },
    async saveAssignment(classId, who, lists) {
      const key = lower(who) === "everyone" ? "everyone" : await fingerprint(who);
      const ref = doc(store, "classes", classId, "assign", key);
      await setDoc(ref, { who: String(who).trim().slice(0, 40), lists: lists.slice(0, 20),
        updated: serverTimestamp() }, { merge: true });
    },
    async savePlans(classId, who, plans) {
      const key = lower(who) === "everyone" ? "everyone" : await fingerprint(who);
      await setDoc(doc(store, "classes", classId, "assign", key), {
        who: String(who).trim().slice(0, 40),
        plans: plans.slice(0, 30).map(p => ({ list: String(p.list).slice(0, 400),
          from: p.from, until: p.until })), updated: serverTimestamp()
      }, { merge: true });
    },
    async recordWorksheet(classId, pupil, listId, listName, words) {
      const p = await api.me();
      if (!p || !p.role) throw new Error("Sign in as a teacher first.");
      await addDoc(collection(store, "classes", classId, "sessions"), {
        pupil: String(pupil).trim().slice(0, 40), list: String(listName).slice(0, 100),
        listId: String(listId).slice(0, 100), finished: true, words,
        source: "worksheet", markedBy: p.email, at: serverTimestamp()
      });
    },

    // Phonics check practice, marked live: the teacher's screen sets the word on show, and the
    // pupil's device (which only knows its own key, as with assigned work) shows it
    async setDrive(classId, pupil, state) {
      const ref = doc(store, "classes", classId, "drive", await fingerprint(pupil));
      if (!state) return deleteDoc(ref);
      await setDoc(ref, { kind: "phonics", word: String(state.word).slice(0, 30), n: state.n, total: state.total,
        alien: !!state.alien, section: state.section, at: serverTimestamp() });
    },
    async watchDrive(classId, pupil, fn) {
      await pupilAuth();
      return onSnapshot(doc(store, "classes", classId, "drive", await fingerprint(pupil)),
        snap => fn(snap.exists() ? snap.data() : null), err => fn(null, err));
    },
    async recordPhonicsCheck(classId, pupil, words) {
      const p = await api.me();
      if (!p || !p.role) throw new Error("Sign in as a teacher first.");
      await addDoc(collection(store, "classes", classId, "sessions"), {
        pupil: String(pupil).trim().slice(0, 40), list: "Phonics check practice", listId: "phonics-check",
        finished: true, words: words.slice(0, 60), source: "phonics-check", markedBy: p.email, at: serverTimestamp()
      });
    },

    async diary(classId) {
      const snap = await getDocs(query(collection(store, "classes", classId, "diary"),
        orderBy("at", "desc"), limit(100)));
      return snap.docs.map(d => ({ id: d.id, ...d.data(),
        at: d.data().at ? d.data().at.toMillis() : Date.now() }));
    },
    async saveDiary(classId, entry) {
      const p = await api.me();
      if (!p || !p.role) throw new Error("Sign in as a teacher first.");
      const pupil = String(entry.pupil || "").trim().slice(0, 40);
      const nextList = String(entry.nextList || "").slice(0, 100);
      const nextDate = String(entry.nextDate || "");
      const batch = writeBatch(store);
      const ref = doc(collection(store, "classes", classId, "diary"));
      batch.set(ref, { pupil, lessonDate: entry.lessonDate,
        lastWork: String(entry.lastWork || "").trim().slice(0, 2000),
        nextLesson: String(entry.nextLesson || "").trim().slice(0, 2000),
        nextList, nextDate, by: p.email, at: serverTimestamp() });
      if (nextList && nextDate) {
        const key = await fingerprint(pupil);
        const assignRef = doc(store, "classes", classId, "assign", key);
        const current = await getDoc(assignRef);
        const plans = current.exists() ? current.data().plans || [] : [];
        if (plans.length >= 30) throw new Error("This pupil already has 30 plans.");
        batch.set(assignRef, { who: pupil, plans: plans.concat({ list: nextList,
          from: nextDate, until: nextDate }), updated: serverTimestamp() }, { merge: true });
        const pupilRef = doc(store, "classes", classId, "pupils", key);
        if ((await getDoc(pupilRef)).exists())
          batch.update(pupilRef, { nextLessonDate: nextDate, homeworkList: nextList,
            updated: serverTimestamp() });
      }
      await batch.commit();
    },

    async pupils(classId) {
      const snap = await getDocs(collection(store, "classes", classId, "pupils"));
      return snap.docs.map(d => ({ key: d.id, ...d.data() }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    async savePupil(classId, pupil) {
      const cleanProgramme = p => (!p ? null : {
        spelling: String(p.spelling || "").slice(0, 60), maths: String(p.maths || "").slice(0, 60),
        focus: ["both", "literacy", "maths"].includes(p.focus) ? p.focus : "both",
        lesson: Math.min(1000, Math.max(1, Math.round(Number(p.lesson) || 1))), started: Number(p.started) || Date.now(),
        log: (p.log || []).slice(-30).map(l => ({ n: Math.round(Number(l.n) || 0), at: Number(l.at) || 0,
          spelling: String(l.spelling || "").slice(0, 60), maths: String(l.maths || "").slice(0, 60),
          spellingNext: !!l.spellingNext, mathsNext: !!l.mathsNext })) });
      const name = String(pupil.name || "").trim().slice(0, 40);
      if (!name) throw new Error("Enter the pupil's name or code.");
      const key = await fingerprint(name);
      await setDoc(doc(store, "classes", classId, "pupils", key), {
        name, parentEmail: lower(pupil.parentEmail).slice(0, 254),
        reminderOptIn: !!pupil.reminderOptIn,
        nextLessonDate: String(pupil.nextLessonDate || "").slice(0, 10),
        lessonTime: String(pupil.lessonTime || "").slice(0, 5),
        homeworkList: String(pupil.homeworkList || "").slice(0, 100),
        ...(pupil.parentNote !== undefined ? { parentNote: String(pupil.parentNote).trim().slice(0, 1000) } : {}),
        // The New pupil profile (teacher-only, like the rest of the roster)
        ...(pupil.yearGroup !== undefined ? { yearGroup: String(pupil.yearGroup).slice(0, 10) } : {}),
        ...(pupil.needs !== undefined ? { needs: String(pupil.needs).trim().slice(0, 500) } : {}),
        ...(pupil.likes !== undefined ? { likes: String(pupil.likes).trim().slice(0, 300) } : {}),
        // When each parents' night report was printed, so the next one can say what's changed
        ...(pupil.reports !== undefined ? { reports: pupil.reports.map(Number).filter(Number.isFinite).slice(-12) } : {}),
        // Where the pupil is in their lesson programme (null when it's stopped)
        ...(pupil.programme !== undefined ? { programme: cleanProgramme(pupil.programme) } : {}),
        updated: serverTimestamp()
      }, { merge: true });
    },

    /* ---------- Parent pages (parent.html) ---------- */

    // 24 random bytes: a link nobody can guess. It goes after a # so it's never sent to a server.
    newParentLink: () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24))))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
    // Writes the summary the link shows, and remembers the link (and when) on the pupil's record
    async publishParent(classId, pupilName, link, summary, note) {
      const p = await api.me();
      if (!p || !p.role) throw new Error("Sign in as a teacher first.");
      const batch = writeBatch(store);
      batch.set(doc(store, "parents", link), { classId, pupil: String(pupilName).trim().slice(0, 40),
        summary, note: String(note || "").trim().slice(0, 1000), updated: serverTimestamp(), by: p.email });
      batch.update(doc(store, "classes", classId, "pupils", await fingerprint(pupilName)),
        { parentLink: link, parentAt: Date.now(), updated: serverTimestamp() });
      await batch.commit();
    },
    // Everything kept about one pupil in a class: results, saved progress, live status, plans, lesson
    // notes, parent page and roster record. Results are matched however the name was typed.
    async deletePupilRecords(classId, name, parentLink) {
      const same = v => lower(v) === lower(name);
      const [sessions, diary, key] = await Promise.all([
        getDocs(collection(store, "classes", classId, "sessions")),
        getDocs(collection(store, "classes", classId, "diary")),
        fingerprint(name)]);
      // The parent page goes first, on its own: it may already have been turned off
      if (parentLink) await deleteDoc(doc(store, "parents", parentLink)).catch(() => {});
      const refs = [
        ...sessions.docs.filter(d => same(d.data().pupil)).map(d => d.ref),
        ...diary.docs.filter(d => same(d.data().pupil)).map(d => d.ref),
        ...["progress", "assign", "pupils"].map(c => doc(store, "classes", classId, c, key)),
        doc(store, "classes", classId, "live", pupilKey(name))
      ];
      // Firestore takes up to 500 changes at once
      for (let i = 0; i < refs.length; i += 400) {
        const batch = writeBatch(store);
        refs.slice(i, i + 400).forEach(r => batch.delete(r));
        await batch.commit();
      }
      return sessions.docs.filter(d => same(d.data().pupil)).length;
    },

    async stopParent(classId, pupilName, link) {
      const batch = writeBatch(store);
      batch.delete(doc(store, "parents", link));
      batch.update(doc(store, "classes", classId, "pupils", await fingerprint(pupilName)),
        { parentLink: "", parentAt: 0, updated: serverTimestamp() });
      await batch.commit();
    },
    // For the parent page: no sign-in, just the link
    async parentPage(link) {
      if (!/^[A-Za-z0-9_-]{24,64}$/.test(String(link || ""))) return null;
      const snap = await getDocFromServer(doc(store, "parents", link));
      return snap.exists() ? Object.assign({}, snap.data(), { updated: snap.data().updated ? snap.data().updated.toMillis() : Date.now() }) : null;
    },

    async sessions(classId, days = 30) {
      const since = Timestamp.fromMillis(Date.now() - days * 86400000);
      const snap = await getDocs(query(collection(store, "classes", classId, "sessions"), where("at", ">=", since), orderBy("at", "desc")));
      return snap.docs.map(d => Object.assign({ id: d.id }, d.data(), { at: d.data().at ? d.data().at.toMillis() : Date.now() }));
    },

    // Every starting-assessment result, however old, so a report can compare the start with now
    async assessments(classId, listIds) {
      const snap = await getDocs(query(collection(store, "classes", classId, "sessions"), where("listId", "in", listIds.slice(0, 30))));
      return snap.docs.map(d => Object.assign({ id: d.id }, d.data(), { at: d.data().at ? d.data().at.toMillis() : Date.now() }));
    },

    async teachers() {
      const snap = await getDocs(collection(store, "teachers"));
      return snap.docs.map(d => Object.assign({ email: d.id }, d.data())).sort((a, b) => a.email.localeCompare(b.email));
    },
    inviteTeacher: (email, name, role = "teacher") => setDoc(doc(store, "teachers", lower(email)),
      { name: String(name || "").trim().slice(0, 60) || lower(email), role, invitedBy: profile.email, invitedAt: serverTimestamp() }),
    removeTeacher: email => deleteDoc(doc(store, "teachers", lower(email)))
  };

  // Testing on this computer only: the emulator accepts a made-up Google sign-in
  if (emulator) {
    api._testSignIn = email => authLib.signInWithCredential(auth,
      GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true, name: email.split("@")[0] })));
  }

  window.PopCloud = api;
  window.__popCloudResolve(api);
}

