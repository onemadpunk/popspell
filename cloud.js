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
    initializeFirestore, persistentLocalCache, connectFirestoreEmulator, doc, getDoc, setDoc, updateDoc,
    addDoc, deleteDoc, collection, query, where, orderBy, getDocs, onSnapshot, serverTimestamp, Timestamp
  } = db;

  const app = initializeApp(config);
  const auth = getAuth(app);
  // Results are kept on the device until they reach the server, even if the page is closed
  const store = initializeFirestore(app, { localCache: persistentLocalCache() });
  if (SITE.firebaseEmulator && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    connectAuthEmulator(auth, `http://${location.hostname}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(store, location.hostname, 8080);
  }

  const lower = s => String(s || "").trim().toLowerCase();
  const pupilKey = name => lower(name).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "pupil";
  async function fingerprint(name) {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(lower(name)));
    return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  // Join codes avoid letters that look alike (0/O, 1/I/L)
  const CODE_LETTERS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), b => CODE_LETTERS[b % CODE_LETTERS.length]).join("");

  let user = auth.currentUser;
  let profile = null; // { email, name, role } once a teacher is signed in
  const listeners = new Set();
  const authReady = new Promise(resolve => {
    onAuthStateChanged(auth, async u => {
      user = u;
      profile = await loadProfile(u);
      listeners.forEach(fn => fn(profile));
      resolve();
    });
  });

  // A Google account is a teacher if invited, or an owner (first sign-in creates their record)
  async function loadProfile(u) {
    if (!u || u.isAnonymous || !u.email) return null;
    const email = lower(u.email);
    const ref = doc(store, "teachers", email);
    try {
      const snap = await getDoc(ref);
      if (snap.exists()) return { email, name: snap.data().name || u.displayName || email, role: snap.data().role, uid: u.uid };
    } catch { /* not invited: reading another email's record is refused */ }
    try {
      await setDoc(ref, { name: u.displayName || email, role: "owner", invitedBy: email, invitedAt: serverTimestamp() });
      return { email, name: u.displayName || email, role: "owner", uid: u.uid };
    } catch {
      return { email, name: u.displayName || email, role: null, uid: u.uid }; // signed in but not invited
    }
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
      return snap.exists() ? { id, name: snap.data().name, teacherName: snap.data().teacherName || "" } : null;
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
        try { const s = await getDoc(doc(store, "classes", classId, "assign", key)); return s.exists() ? s.data().lists || [] : []; }
        catch { return []; }
      };
      const [mine, everyone] = await Promise.all([read(await fingerprint(pupil)), read("everyone")]);
      return [...new Set(mine.concat(everyone))];
    },

    /* ---------- Teachers ---------- */

    async me() { await authReady; return profile; },
    onTeacher(fn) { listeners.add(fn); authReady.then(() => fn(profile)); return () => listeners.delete(fn); },

    async signIn() {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      try { await signInWithPopup(auth, provider); }
      catch (err) {
        if (/popup-blocked|operation-not-supported/.test(err.code || "")) return signInWithRedirect(auth, provider);
        throw err;
      }
    },
    signOut: () => signOut(auth),

    async classes() {
      const p = await api.me();
      if (!p || !p.role) return [];
      const ref = collection(store, "classes");
      const snap = await getDocs(p.role === "owner" ? ref : query(ref, where("teacher", "==", p.uid)));
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
      return snap.docs.map(d => ({ key: d.id, who: d.data().who || d.id, lists: d.data().lists || [] }))
        .sort((a, b) => (a.key === "everyone" ? -1 : b.key === "everyone" ? 1 : a.who.localeCompare(b.who)));
    },
    async saveAssignment(classId, who, lists) {
      const key = lower(who) === "everyone" ? "everyone" : await fingerprint(who);
      const ref = doc(store, "classes", classId, "assign", key);
      if (!lists.length) await deleteDoc(ref);
      else await setDoc(ref, { who: String(who).trim().slice(0, 40), lists: lists.slice(0, 20), updated: serverTimestamp() });
    },

    async sessions(classId, days = 30) {
      const since = Timestamp.fromMillis(Date.now() - days * 86400000);
      const snap = await getDocs(query(collection(store, "classes", classId, "sessions"), where("at", ">=", since), orderBy("at", "desc")));
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

  window.PopCloud = api;
  window.__popCloudResolve(api);
}
