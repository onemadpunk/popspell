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
  const [{ initializeApp, deleteApp }, authLib, db] = await Promise.all([
    import(`${base}/firebase-app.js`),
    import(`${base}/firebase-auth.js`),
    import(`${base}/firebase-firestore.js`)
  ]);
  const {
    getAuth, onAuthStateChanged, signInAnonymously, signInWithPopup, signInWithRedirect,
    GoogleAuthProvider, signOut, connectAuthEmulator, setPersistence, browserSessionPersistence,
    inMemoryPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword
  } = authLib;
  const {
    initializeFirestore, persistentLocalCache, connectFirestoreEmulator, doc, getDoc, getDocFromServer, setDoc,
    updateDoc, addDoc, deleteDoc, collection, query, where, orderBy, limit, getDocs, getDocsFromServer,
    onSnapshot, serverTimestamp, Timestamp, writeBatch, waitForPendingWrites, terminate, clearIndexedDbPersistence
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
  const newPupilCode = () => Array.from(crypto.getRandomValues(new Uint8Array(10)), b => CODE_LETTERS[b % CODE_LETTERS.length]).join("");
  const pupilEmail = code => `${code.toLowerCase()}@pupils.popspell.com`;
  const pupilPassword = (code, pin) => `${code}:${pin}`;
  const classPupilEmail = (classId, key) => `c.${String(classId).toLowerCase()}.${key.slice(0, 24)}@pupils.popspell.com`;
  const classPupilPassword = (classId, key) => `PopSpell:${String(classId).toUpperCase()}:${key.slice(0, 32)}`;
  const canonicalNames = new Map();
  const classView = snap => ({ id: snap.id, name: snap.data().name, teacherName: snap.data().teacherName || "",
    assignedOnly: !!snap.data().assignedOnly,
    accent: ["scottish", "english"].includes(snap.data().accent) ? snap.data().accent : "" });

  const PREVIEW_TEACHER_KEY = "popspell-preview-teacher-v1";
  const PREVIEW_DB_KEY = "popspell-preview-db-v1";
  const isPreviewHost = () => !/^(?:www\.)?popspell\.com$/i.test(location.hostname);
  function loadPreviewDb() {
    try {
      const raw = JSON.parse(localStorage.getItem(PREVIEW_DB_KEY) || "null");
      if (raw && raw.classes) return raw;
    } catch { /* use default */ }
    const seed = {
      classes: {
        HTCEBJ: { id: "HTCEBJ", name: "tuesday", teacher: "preview-owner", teacherName: "Steven Green", teacherEmail: "one.mad.punk@gmail.com", assignedOnly: false, accent: "scottish" }
      },
      assign: {
        HTCEBJ: {
          bob: { who: "bob", lists: ["e-e"], plans: [], look: "", lookChoice: "auto" },
          jimmy: { who: "jimmy", lists: ["o-e"], plans: [], look: "", lookChoice: "auto" }
        }
      },
      pupils: {
        HTCEBJ: {
          bob: { name: "bob", parentEmail: "", reminderOptIn: false, nextLessonDate: "", lessonTime: "", homeworkList: "" },
          jimmy: { name: "jimmy", parentEmail: "", reminderOptIn: false, nextLessonDate: "", lessonTime: "", homeworkList: "" }
        }
      },
      sessions: {},
      diary: {},
      paperEvidence: {},
      progress: {},
      live: {}
    };
    try { localStorage.setItem(PREVIEW_DB_KEY, JSON.stringify(seed)); } catch { /* ignore */ }
    return seed;
  }
  function savePreviewDb(dbObj) {
    try { localStorage.setItem(PREVIEW_DB_KEY, JSON.stringify(dbObj)); } catch { /* ignore */ }
  }
  function isPreviewTeacher() {
    if (!isPreviewHost()) return false;
    try { return localStorage.getItem(PREVIEW_TEACHER_KEY) !== "0"; } catch { return true; }
  }
  const previewProfile = { email: "one.mad.punk@gmail.com", name: "Steven Green", role: "owner", uid: "preview-owner", preview: true };

  let profile = isPreviewTeacher() ? previewProfile : null; // { email, name, role } once a teacher is signed in
  let profileReady = null; // the invitation check for whoever signed in last
  const listeners = new Set();
  const liveListeners = new Map();
  const notifyLive = classId => {
    const dbObj = loadPreviewDb();
    const list = Object.entries(dbObj.live?.[classId] || {}).map(([key, v]) => Object.assign({ key }, v));
    (liveListeners.get(classId) || []).forEach(fn => fn(list));
  };
  const pupilCodes = new Map();
  const authReady = new Promise(resolve => {
    onAuthStateChanged(auth, u => {
      if (isPreviewTeacher()) {
        profile = previewProfile;
        listeners.forEach(fn => fn(profile));
        resolve();
        return;
      }
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
    if (!u || u.isAnonymous || !u.email || u.email.endsWith("@pupils.popspell.com")) return null;
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

  let pupilSignInPromise = null;
  async function pupilAuth(classId = "", pupil = "") {
    await authReady;
    const u = auth.currentUser;
    const provider = u?.providerData?.[0]?.providerId;
    if (provider === "google.com") return; // teacher signed in on this browser
    if (provider === "password" && u?.email && !u.email.startsWith("c.")) return; // personal PIN session
    if (classId && pupil && lower(pupil) !== "everyone") {
      const key = await fingerprint(pupil);
      const wantEmail = classPupilEmail(classId, key);
      if (auth.currentUser?.email !== wantEmail) {
        if (pupilSignInPromise) await pupilSignInPromise.catch(() => {});
        if (auth.currentUser?.email !== wantEmail) {
          pupilSignInPromise = signInWithEmailAndPassword(auth, wantEmail, classPupilPassword(classId, key)).catch(() => {});
          await pupilSignInPromise;
          pupilSignInPromise = null;
        }
      }
    }
    if (!auth.currentUser) await signInAnonymously(auth).catch(() => {});
  }

  async function resolvePupilName(classId, pupil) {
    const key = await fingerprint(pupil);
    const cacheKey = `${classId}:${key}`;
    if (canonicalNames.has(cacheKey)) return canonicalNames.get(cacheKey);
    if (isPreviewHost()) {
      const dbObj = loadPreviewDb();
      const row = dbObj.assign?.[classId]?.[lower(pupil)] || dbObj.pupils?.[classId]?.[lower(pupil)];
      if (row && (row.who || row.name)) return row.who || row.name;
    }
    try {
      const snap = await getDoc(doc(store, "classes", classId, "assign", key));
      if (snap.exists() && snap.data().who) {
        canonicalNames.set(cacheKey, snap.data().who);
        return snap.data().who;
      }
    } catch { /* use typed name */ }
    return String(pupil).trim().slice(0, 40);
  }

  const api = {
    /* ---------- Pupils' devices ---------- */

    // The short code is a random account identifier, not a password. A child only enters
    // their four-digit PIN; Firebase Authentication checks code + PIN on its server.
    async pupilLogin(code, pin) {
      code = String(code || "").trim().toUpperCase();
      if (!/^[A-Z2-9]{10}$/.test(code) || !/^\d{4}$/.test(String(pin))) throw new Error("Check the pupil link and four-digit PIN.");
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, pupilEmail(code), pupilPassword(code, pin));
      try {
        const link = await getDocFromServer(doc(store, "pupilLinks", code));
        if (!link.exists() || link.data().loginUid !== auth.currentUser?.uid) throw new Error("This pupil link has been replaced. Ask your teacher for the new one.");
        const info = await getDocFromServer(doc(store, "classes", link.data().classId));
        if (!info.exists()) throw new Error("This class is no longer available.");
        return { code, pupil: link.data().pupil, pupilKey: link.data().pupilKey, classInfo: classView(info) };
      } catch (err) { await signOut(auth); throw err; }
    },
    async restorePupil(code) {
      await authReady;
      code = String(code || "").trim().toUpperCase();
      if (!/^[A-Z2-9]{10}$/.test(code) || auth.currentUser?.providerData?.[0]?.providerId !== "password") return null;
      try {
        const link = await getDocFromServer(doc(store, "pupilLinks", code));
        if (!link.exists() || link.data().loginUid !== auth.currentUser.uid) return null;
        const info = await getDocFromServer(doc(store, "classes", link.data().classId));
        return info.exists() ? { code, pupil: link.data().pupil, pupilKey: link.data().pupilKey,
          classInfo: classView(info) } : null;
      } catch { return null; }
    },

    async classInfo(code) {
      const id = String(code || "").trim().toUpperCase();
      if (!/^[A-Z0-9]{4,12}$/.test(id)) return null;
      if (isPreviewHost()) {
        const local = loadPreviewDb().classes?.[id];
        if (local) return { id: local.id, name: local.name, teacherName: local.teacherName || "",
          assignedOnly: !!local.assignedOnly, accent: ["scottish", "english"].includes(local.accent) ? local.accent : "" };
      }
      await pupilAuth();
      const snap = await getDoc(doc(store, "classes", id));
      return snap.exists() ? classView(snap) : null;
    },

    async live(classId, pupil, fields) {
      const key = await fingerprint(pupil);
      const name = await resolvePupilName(classId, pupil);
      if (isPreviewHost()) {
        const dbObj = loadPreviewDb();
        dbObj.live = dbObj.live || {};
        dbObj.live[classId] = dbObj.live[classId] || {};
        dbObj.live[classId][key] = Object.assign({}, dbObj.live[classId][key] || {}, fields,
          { pupil: String(name).slice(0, 40), pupilKey: key, seen: Date.now() });
        savePreviewDb(dbObj);
        notifyLive(classId);
        if (isPreviewTeacher()) return;
      }
      await pupilAuth(classId, pupil);
      await setDoc(doc(store, "classes", classId, "live", key),
        Object.assign({}, fields, { pupil: String(name).slice(0, 40), pupilKey: key, seen: serverTimestamp() }), { merge: true });
    },

    // Resolves once the server has it. Until then it's kept on the device and retried.
    async session(classId, payload) {
      const name = await resolvePupilName(classId, payload.pupil);
      const key = await fingerprint(payload.pupil);
      if (isPreviewHost()) {
        const dbObj = loadPreviewDb();
        dbObj.sessions = dbObj.sessions || {};
        dbObj.sessions[classId] = dbObj.sessions[classId] || [];
        dbObj.sessions[classId].unshift(Object.assign({ id: crypto.randomUUID() }, payload,
          { pupil: String(name).slice(0, 40), pupilKey: key, at: Date.now() }));
        savePreviewDb(dbObj);
        if (isPreviewTeacher()) return;
      }
      await pupilAuth(classId, payload.pupil);
      await addDoc(collection(store, "classes", classId, "sessions"), Object.assign({}, payload,
        { pupil: String(name).slice(0, 40), pupilKey: key, at: serverTimestamp() }));
    },

    // The look the teacher has set for this pupil's screens ("older" or "")
    async look(classId, pupil) {
      if (isPreviewHost()) {
        const local = loadPreviewDb().assign?.[classId]?.[lower(pupil)];
        if (local) return local.look === "older" ? "older" : "";
      }
      await pupilAuth(classId, pupil);
      try {
        const key = await fingerprint(pupil);
        const s = await getDoc(doc(store, "classes", classId, "assign", key));
        if (s.exists() && s.data().who) canonicalNames.set(`${classId}:${key}`, s.data().who);
        return s.exists() && s.data().look === "older" ? "older" : "";
      } catch { return null; }
    },
    async assigned(classId, pupil) {
      const today = todayKey();
      const fromRow = data => (data.lists || []).concat((data.plans || [])
        .filter(p => p.from <= today && today <= p.until).map(p => p.list));
      let localLists = [];
      if (isPreviewHost()) {
        const clsAssign = loadPreviewDb().assign?.[classId] || {};
        const mineLocal = clsAssign[lower(pupil)];
        const allLocal = clsAssign.everyone;
        if (mineLocal) localLists = localLists.concat(fromRow(mineLocal));
        if (allLocal) localLists = localLists.concat(fromRow(allLocal));
        if (isPreviewTeacher() || localLists.length) return [...new Set(localLists)];
      }
      await pupilAuth(classId, pupil);
      const read = async key => {
        try {
          const s = await getDoc(doc(store, "classes", classId, "assign", key));
          if (!s.exists()) return [];
          const data = s.data();
          if (key !== "everyone" && data.who) canonicalNames.set(`${classId}:${key}`, data.who);
          return fromRow(data);
        }
        catch { return []; }
      };
      const [mine, everyone] = await Promise.all([read(await fingerprint(pupil)), read("everyone")]);
      return [...new Set(localLists.concat(mine, everyone))];
    },

    // A pupil's own progress (stars, review words, bests), so it follows them between devices
    async progress(classId, pupil) {
      if (isPreviewHost()) {
        const local = loadPreviewDb().progress?.[classId]?.[lower(pupil)];
        if (local) return local;
        if (isPreviewTeacher()) return null;
      }
      await pupilAuth(classId, pupil);
      const snap = await getDoc(doc(store, "classes", classId, "progress", await fingerprint(pupil)));
      return snap.exists() ? snap.data() : null;
    },
    async saveProgress(classId, pupil, prog) {
      const name = await resolvePupilName(classId, pupil);
      if (isPreviewHost()) {
        const dbObj = loadPreviewDb();
        dbObj.progress = dbObj.progress || {};
        dbObj.progress[classId] = dbObj.progress[classId] || {};
        dbObj.progress[classId][lower(pupil)] = {
          pupil: String(name).trim().slice(0, 40), words: prog.words || {}, sounds: prog.sounds || {},
          bests: prog.bests || { weeks: {}, lists: {} }, updated: Date.now()
        };
        savePreviewDb(dbObj);
        if (isPreviewTeacher()) return;
      }
      await pupilAuth(classId, pupil);
      await setDoc(doc(store, "classes", classId, "progress", await fingerprint(pupil)), {
        pupil: String(name).trim().slice(0, 40), words: prog.words || {}, sounds: prog.sounds || {},
        bests: prog.bests || { weeks: {}, lists: {} }, updated: serverTimestamp()
      });
    },

    /* ---------- Teachers ---------- */

    // Waits until the invitation check has caught up with whoever is signed in right now
    async me() {
      if (isPreviewTeacher()) {
        profile = previewProfile;
        return profile;
      }
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

    async signInPreview() {
      try { localStorage.setItem(PREVIEW_TEACHER_KEY, "1"); } catch { /* ignore */ }
      loadPreviewDb();
      profile = previewProfile;
      listeners.forEach(fn => fn(profile));
      return profile;
    },

    async signIn() {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      try { await signInWithPopup(auth, provider); await api.me(); }
      catch (err) {
        if (err?.code === "auth/unauthorized-domain" && isPreviewHost()) {
          return api.signInPreview();
        }
        if (/popup-blocked|operation-not-supported/.test(err.code || "")) return signInWithRedirect(auth, provider);
        throw err;
      }
    },
    // The device's copy of the classes goes too, so the next person on a shared computer can't find
    // pupils' records in the browser's storage. Anything not yet saved gets a few seconds to send first.
    async signOut() {
      try { localStorage.removeItem(PREVIEW_TEACHER_KEY); } catch { /* ignore */ }
      profile = null;
      sessionStorage.removeItem("popspell-calendar-token");
      await Promise.race([waitForPendingWrites(store), new Promise(r => setTimeout(r, 5000))]).catch(() => {});
      await signOut(auth).catch(() => {});
      await terminate(store).then(() => clearIndexedDbPersistence(store)).catch(() => {});
      history.replaceState(null, "", "#/");
      location.reload();
      return new Promise(() => {}); // the page is reloading
    },

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
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        return Object.values(dbObj.classes || {})
          .sort((a, b) => (a.teacherName || "").localeCompare(b.teacherName || "") || a.name.localeCompare(b.name));
      }
      const ref = collection(store, "classes");
      const snap = await getDocs(["owner", "admin"].includes(p.role) ? ref : query(ref, where("teacher", "==", p.uid)));
      return snap.docs.map(d => Object.assign({ id: d.id }, d.data()))
        .sort((a, b) => (a.teacherName || "").localeCompare(b.teacherName || "") || a.name.localeCompare(b.name));
    },

    // Issuing a new link and PIN replaces the old pupil account's access to records.
    // The PIN is never saved in Firestore. This uses Firebase Auth on the no-cost Spark plan.
    async issuePupilLogin(classId, pupil, pin) {
      const teacher = await api.me();
      if (!teacher?.role) throw new Error("Sign in as a teacher first.");
      pin = String(pin || "");
      if (!/^\d{4}$/.test(pin) || /^(\d)\1{3}$/.test(pin) || ["1234", "4321", "0123", "9876"].includes(pin))
        throw new Error("Choose four different or mixed digits, avoiding simple runs such as 1234.");
      if (isPreviewTeacher()) {
        const code = newPupilCode();
        const dbObj = loadPreviewDb();
        dbObj.pupils[classId] = dbObj.pupils[classId] || {};
        const k = lower(pupil);
        dbObj.pupils[classId][k] = Object.assign({ name: pupil }, dbObj.pupils[classId][k] || {}, { loginCode: code });
        savePreviewDb(dbObj);
        if (!pupilCodes.has(classId)) pupilCodes.set(classId, new Map());
        pupilCodes.get(classId).set(k, code);
        return { code, pupil };
      }
      const pupilKey = await fingerprint(pupil);
      const rosterRef = doc(store, "classes", classId, "pupils", pupilKey);
      const roster = await getDocFromServer(rosterRef);
      if (!roster.exists() || lower(roster.data().name) !== lower(pupil)) throw new Error("Add this pupil to the class first.");
      const code = newPupilCode();
      const provisionApp = initializeApp(config, `pupil-provision-${crypto.randomUUID()}`);
      const provisionAuth = getAuth(provisionApp);
      if (emulator) connectAuthEmulator(provisionAuth, `http://${location.hostname}:9099`, { disableWarnings: true });
      let user;
      try {
        await setPersistence(provisionAuth, inMemoryPersistence);
        user = (await createUserWithEmailAndPassword(provisionAuth, pupilEmail(code), pupilPassword(code, pin))).user;
        const batch = writeBatch(store);
        batch.update(rosterRef, { loginUid: user.uid, loginCode: code });
        batch.set(doc(store, "pupilLinks", code), { classId, pupilKey, pupil: roster.data().name,
          loginUid: user.uid, createdAt: serverTimestamp() });
        if (roster.data().loginCode) batch.delete(doc(store, "pupilLinks", roster.data().loginCode));
        await batch.commit();
        if (!pupilCodes.has(classId)) pupilCodes.set(classId, new Map());
        pupilCodes.get(classId).set(lower(roster.data().name), code);
        return { code, pupil: roster.data().name };
      } finally {
        await signOut(provisionAuth).catch(() => {});
        await deleteApp(provisionApp).catch(() => {});
      }
    },

    async createClass(name) {
      const p = await api.me();
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        const id = newCode();
        dbObj.classes[id] = { id, name: String(name).trim().slice(0, 60), teacher: p.uid, teacherName: p.name, teacherEmail: p.email, assignedOnly: false, accent: "scottish" };
        savePreviewDb(dbObj);
        return id;
      }
      for (let tries = 0; tries < 5; tries++) {
        const id = newCode();
        const ref = doc(store, "classes", id);
        if ((await getDoc(ref)).exists()) continue;
        await setDoc(ref, { name: String(name).trim().slice(0, 60), teacher: p.uid, teacherName: p.name, teacherEmail: p.email, createdAt: serverTimestamp() });
        return id;
      }
      throw new Error("Couldn't make a class code — please try again.");
    },
    renameClass: async (id, name) => {
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        if (dbObj.classes[id]) { dbObj.classes[id].name = String(name).trim().slice(0, 60); savePreviewDb(dbObj); }
        return;
      }
      return updateDoc(doc(store, "classes", id), { name: String(name).trim().slice(0, 60) });
    },
    // On: pupils in this class see only the work set for them, not the whole library
    setAssignedOnly: async (id, on) => {
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        if (dbObj.classes[id]) { dbObj.classes[id].assignedOnly = !!on; savePreviewDb(dbObj); }
        return;
      }
      return updateDoc(doc(store, "classes", id), { assignedOnly: !!on });
    },
    // Scottish (the r is sounded: c·a·r) or English (c·ar), for every pupil device in the class
    setAccent: async (id, accent) => {
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        if (dbObj.classes[id]) { dbObj.classes[id].accent = accent === "english" ? "english" : "scottish"; savePreviewDb(dbObj); }
        return;
      }
      return updateDoc(doc(store, "classes", id), { accent: accent === "english" ? "english" : "scottish" });
    },

    watchLive(classId, fn) {
      if (isPreviewTeacher()) {
        const arr = liveListeners.get(classId) || [];
        arr.push(fn);
        liveListeners.set(classId, arr);
        notifyLive(classId);
        return () => {
          liveListeners.set(classId, (liveListeners.get(classId) || []).filter(f => f !== fn));
        };
      }
      return onSnapshot(collection(store, "classes", classId, "live"),
        snap => fn(snap.docs.map(d => {
          const v = d.data();
          return Object.assign({ key: d.id }, v, { seen: v.seen ? v.seen.toMillis() : Date.now(), helpAt: v.helpAt || null });
        })),
        err => fn(null, err));
    },
    clearHelp: async (classId, key) => {
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        if (dbObj.live?.[classId]?.[key]) {
          dbObj.live[classId][key].help = false;
          dbObj.live[classId][key].helpAt = null;
          savePreviewDb(dbObj);
          notifyLive(classId);
        }
        return;
      }
      return updateDoc(doc(store, "classes", classId, "live", key), { help: false, helpAt: null });
    },

    async ensureRosterPupil(classId, who) {
      const clean = String(who || "").trim().slice(0, 40);
      if (!clean || lower(clean) === "everyone") return;
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        dbObj.pupils = dbObj.pupils || {};
        dbObj.pupils[classId] = dbObj.pupils[classId] || {};
        const k = lower(clean);
        if (!dbObj.pupils[classId][k]) {
          dbObj.pupils[classId][k] = { name: clean, parentEmail: "", reminderOptIn: false, nextLessonDate: "", lessonTime: "", homeworkList: "" };
          savePreviewDb(dbObj);
        }
        return;
      }
      const key = await fingerprint(clean);
      const cacheKey = `${classId}:${key}`;
      if (pupilCodes.get(`ensured:${cacheKey}`)) return;
      try {
        const rosterRef = doc(store, "classes", classId, "pupils", key);
        const snap = await getDoc(rosterRef);
        const existing = snap.exists() ? snap.data() : null;
        if (existing && existing.loginUid) {
          pupilCodes.set(`ensured:${cacheKey}`, true);
          return;
        }
        let loginUid = existing?.loginUid || "";
        if (!loginUid) {
          const provisionApp = initializeApp(config, `pupil-auto-${crypto.randomUUID()}`);
          const provisionAuth = getAuth(provisionApp);
          if (emulator) connectAuthEmulator(provisionAuth, `http://${location.hostname}:9099`, { disableWarnings: true });
          try {
            await setPersistence(provisionAuth, inMemoryPersistence);
            const email = classPupilEmail(classId, key);
            const pass = classPupilPassword(classId, key);
            let cred;
            try {
              cred = await createUserWithEmailAndPassword(provisionAuth, email, pass);
            } catch {
              cred = await signInWithEmailAndPassword(provisionAuth, email, pass);
            }
            loginUid = cred?.user?.uid || "";
          } finally {
            await signOut(provisionAuth).catch(() => {});
            await deleteApp(provisionApp).catch(() => {});
          }
        }
        if (!existing) {
          await setDoc(rosterRef, {
            name: clean, parentEmail: "", reminderOptIn: false,
            nextLessonDate: "", lessonTime: "", homeworkList: "",
            ...(loginUid ? { loginUid } : {}),
            updated: serverTimestamp()
          });
        } else if (loginUid && !existing.loginUid) {
          await updateDoc(rosterRef, { loginUid, updated: serverTimestamp() });
        }
        pupilCodes.set(`ensured:${cacheKey}`, true);
      } catch (err) {
        console.warn("PopSpell: couldn't sync pupil roster record", err);
      }
    },

    async assignments(classId) {
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        const clsAssign = dbObj.assign?.[classId] || {};
        const rows = [];
        for (const [k, v] of Object.entries(clsAssign)) {
          const key = k === "everyone" ? "everyone" : await fingerprint(v.who || k);
          rows.push({ key, who: v.who || k, lists: v.lists || [], plans: v.plans || [], look: v.look || "", lookChoice: v.lookChoice || "auto" });
          if (k !== "everyone") await api.ensureRosterPupil(classId, v.who || k);
        }
        return rows.sort((a, b) => (a.key === "everyone" ? -1 : b.key === "everyone" ? 1 : a.who.localeCompare(b.who)));
      }
      const snap = await getDocs(collection(store, "classes", classId, "assign"));
      const rows = snap.docs.map(d => ({ key: d.id, who: d.data().who || d.id,
        lists: d.data().lists || [], plans: d.data().plans || [], look: d.data().look || "", lookChoice: d.data().lookChoice || "auto" }))
        .sort((a, b) => (a.key === "everyone" ? -1 : b.key === "everyone" ? 1 : a.who.localeCompare(b.who)));
      Promise.all(rows.filter(r => r.key !== "everyone").map(r => api.ensureRosterPupil(classId, r.who))).catch(() => {});
      return rows;
    },
    async saveAssignment(classId, who, lists) {
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        dbObj.assign = dbObj.assign || {};
        dbObj.assign[classId] = dbObj.assign[classId] || {};
        const k = lower(who) === "everyone" ? "everyone" : lower(who);
        const existing = dbObj.assign[classId][k] || { who: String(who).trim().slice(0, 40), lists: [], plans: [], look: "", lookChoice: "auto" };
        existing.who = existing.who || String(who).trim().slice(0, 40);
        existing.lists = lists.slice(0, 20);
        dbObj.assign[classId][k] = existing;
        savePreviewDb(dbObj);
        if (k !== "everyone") await api.ensureRosterPupil(classId, existing.who);
        return;
      }
      const key = lower(who) === "everyone" ? "everyone" : await fingerprint(who);
      const ref = doc(store, "classes", classId, "assign", key);
      await setDoc(ref, { who: String(who).trim().slice(0, 40), lists: lists.slice(0, 20),
        updated: serverTimestamp() }, { merge: true });
      if (key !== "everyone") await api.ensureRosterPupil(classId, who);
    },
    // How the pupil's screens look: "older" (no mascot or stickers, calmer colours) or "" (PopSpell's
    // usual look). choice is the teacher's setting ("auto" follows the year group); look is the result,
    // which the pupil's device reads with its assigned work.
    async saveLook(classId, who, choice, look) {
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        dbObj.assign = dbObj.assign || {};
        dbObj.assign[classId] = dbObj.assign[classId] || {};
        const k = lower(who);
        const existing = dbObj.assign[classId][k] || { who: String(who).trim().slice(0, 40), lists: [], plans: [] };
        existing.lookChoice = ["auto", "younger", "older"].includes(choice) ? choice : "auto";
        existing.look = look === "older" ? "older" : "";
        dbObj.assign[classId][k] = existing;
        savePreviewDb(dbObj);
        return;
      }
      const key = await fingerprint(who);
      await setDoc(doc(store, "classes", classId, "assign", key), { who: String(who).trim().slice(0, 40),
        lookChoice: ["auto", "younger", "older"].includes(choice) ? choice : "auto", look: look === "older" ? "older" : "",
        updated: serverTimestamp() }, { merge: true });
    },
    async savePlans(classId, who, plans) {
      const cleanPlans = plans.slice(0, 30).map(p => ({ list: String(p.list).slice(0, 400), from: p.from, until: p.until }));
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        dbObj.assign = dbObj.assign || {};
        dbObj.assign[classId] = dbObj.assign[classId] || {};
        const k = lower(who) === "everyone" ? "everyone" : lower(who);
        const existing = dbObj.assign[classId][k] || { who: String(who).trim().slice(0, 40), lists: [], plans: [], look: "", lookChoice: "auto" };
        existing.plans = cleanPlans;
        dbObj.assign[classId][k] = existing;
        savePreviewDb(dbObj);
        if (k !== "everyone") await api.ensureRosterPupil(classId, existing.who);
        return;
      }
      const key = lower(who) === "everyone" ? "everyone" : await fingerprint(who);
      await setDoc(doc(store, "classes", classId, "assign", key), {
        who: String(who).trim().slice(0, 40),
        plans: cleanPlans, updated: serverTimestamp()
      }, { merge: true });
      if (key !== "everyone") await api.ensureRosterPupil(classId, who);
    },
    async recordWorksheet(classId, pupil, listId, listName, words) {
      const p = await api.me();
      if (!p || !p.role) throw new Error("Sign in as a teacher first.");
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        dbObj.sessions[classId] = dbObj.sessions[classId] || [];
        dbObj.sessions[classId].unshift({ id: crypto.randomUUID(), pupil: String(pupil).trim().slice(0, 40),
          list: String(listName).slice(0, 100), listId: String(listId).slice(0, 100), finished: true, words,
          source: "worksheet", markedBy: p.email, at: Date.now() });
        savePreviewDb(dbObj);
        return;
      }
      await addDoc(collection(store, "classes", classId, "sessions"), {
        pupil: String(pupil).trim().slice(0, 40), list: String(listName).slice(0, 100),
        listId: String(listId).slice(0, 100), finished: true, words,
        source: "worksheet", markedBy: p.email, at: serverTimestamp()
      });
    },

    // A teacher's judgement from a ready lesson's paper work. Kept apart from auto-marked
    // answers so it can appear in reports without changing right-first-time percentages.
    async recordPaperEvidence(classId, pupil, lesson, sheet, status, criteria, note) {
      const teacher = await api.me();
      if (!teacher || !teacher.role) throw new Error("Sign in as a teacher first.");
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        dbObj.paperEvidence[classId] = dbObj.paperEvidence[classId] || [];
        dbObj.paperEvidence[classId].unshift({ id: crypto.randomUUID(), pupil: String(pupil).trim().slice(0, 40),
          lessonId: String(lesson.id).slice(0, 100), lessonTitle: String(lesson.title).slice(0, 120),
          sheetId: String(sheet?.id || "").slice(0, 100), sheetTitle: String(sheet?.title || "").slice(0, 120),
          status, criteria: criteria.slice(0, 12), note: String(note || "").trim().slice(0, 1000),
          by: teacher.email, at: Date.now() });
        savePreviewDb(dbObj);
        return;
      }
      await addDoc(collection(store, "classes", classId, "paperEvidence"), {
        pupil: String(pupil).trim().slice(0, 40), lessonId: String(lesson.id).slice(0, 100),
        lessonTitle: String(lesson.title).slice(0, 120),
        sheetId: String(sheet?.id || "").slice(0, 100), sheetTitle: String(sheet?.title || "").slice(0, 120),
        status, criteria: criteria.slice(0, 12),
        note: String(note || "").trim().slice(0, 1000), by: teacher.email, at: serverTimestamp()
      });
    },
    async paperEvidence(classId, days = 365) {
      if (isPreviewTeacher()) {
        const since = Date.now() - days * 86400000;
        return (loadPreviewDb().paperEvidence?.[classId] || []).filter(e => e.at >= since);
      }
      const since = Timestamp.fromMillis(Date.now() - days * 86400000);
      const snap = await getDocs(query(collection(store, "classes", classId, "paperEvidence"), where("at", ">=", since), orderBy("at", "desc")));
      return snap.docs.map(d => Object.assign({ id: d.id }, d.data(), { at: d.data().at ? d.data().at.toMillis() : Date.now() }));
    },

    // Phonics check practice, marked live: the teacher's screen sets the word on show, and the
    // pupil's device (which only knows its own key, as with assigned work) shows it
    async setDrive(classId, pupil, state) {
      if (isPreviewTeacher()) return;
      const ref = doc(store, "classes", classId, "drive", await fingerprint(pupil));
      if (!state) return deleteDoc(ref);
      await setDoc(ref, { kind: "phonics", word: String(state.word).slice(0, 30), n: state.n, total: state.total,
        alien: !!state.alien, section: state.section, at: serverTimestamp() });
    },
    async watchDrive(classId, pupil, fn) {
      if (isPreviewTeacher()) return () => {};
      await pupilAuth(classId, pupil);
      return onSnapshot(doc(store, "classes", classId, "drive", await fingerprint(pupil)),
        snap => fn(snap.exists() ? snap.data() : null), err => fn(null, err));
    },
    async recordPhonicsCheck(classId, pupil, words) {
      const p = await api.me();
      if (!p || !p.role) throw new Error("Sign in as a teacher first.");
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        dbObj.sessions[classId] = dbObj.sessions[classId] || [];
        dbObj.sessions[classId].unshift({ id: crypto.randomUUID(), pupil: String(pupil).trim().slice(0, 40),
          list: "Phonics check practice", listId: "phonics-check", finished: true,
          words: words.slice(0, 60), source: "phonics-check", markedBy: p.email, at: Date.now() });
        savePreviewDb(dbObj);
        return;
      }
      await addDoc(collection(store, "classes", classId, "sessions"), {
        pupil: String(pupil).trim().slice(0, 40), list: "Phonics check practice", listId: "phonics-check",
        finished: true, words: words.slice(0, 60), source: "phonics-check", markedBy: p.email, at: serverTimestamp()
      });
    },

    async diary(classId) {
      if (isPreviewTeacher()) return loadPreviewDb().diary?.[classId] || [];
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
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        dbObj.diary[classId] = dbObj.diary[classId] || [];
        dbObj.diary[classId].unshift({ id: crypto.randomUUID(), pupil, lessonDate: entry.lessonDate,
          lastWork: String(entry.lastWork || "").trim().slice(0, 2000),
          nextLesson: String(entry.nextLesson || "").trim().slice(0, 2000),
          nextList, nextDate, by: p.email, at: Date.now() });
        savePreviewDb(dbObj);
        await api.ensureRosterPupil(classId, pupil);
        return;
      }
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
      await api.ensureRosterPupil(classId, pupil);
    },

    async pupils(classId) {
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        const clsPupils = dbObj.pupils?.[classId] || {};
        const clsAssign = dbObj.assign?.[classId] || {};
        const rows = [];
        const seen = new Set();
        for (const [k, v] of Object.entries(clsPupils)) {
          const key = await fingerprint(v.name || k);
          seen.add(lower(v.name || k));
          rows.push(Object.assign({ key }, v));
        }
        for (const [k, v] of Object.entries(clsAssign)) {
          if (k === "everyone" || seen.has(lower(v.who || k))) continue;
          const name = String(v.who || k).trim().slice(0, 40);
          if (!name) continue;
          const key = await fingerprint(name);
          rows.push({ key, name, parentEmail: "", reminderOptIn: false, nextLessonDate: "", lessonTime: "", homeworkList: "" });
        }
        rows.sort((a, b) => a.name.localeCompare(b.name));
        pupilCodes.set(classId, new Map(rows.filter(r => r.loginCode).map(r => [lower(r.name), r.loginCode])));
        return rows;
      }
      const [snap, assignSnap] = await Promise.all([
        getDocs(collection(store, "classes", classId, "pupils")),
        getDocs(collection(store, "classes", classId, "assign")).catch(() => ({ docs: [] }))
      ]);
      const rows = snap.docs.map(d => ({ key: d.id, ...d.data() }));
      const haveKeys = new Set(rows.map(r => r.key));
      for (const d of assignSnap.docs) {
        if (d.id === "everyone" || haveKeys.has(d.id)) continue;
        const name = String(d.data().who || "").trim().slice(0, 40);
        if (!name) continue;
        rows.push({ key: d.id, name, parentEmail: "", reminderOptIn: false, nextLessonDate: "", lessonTime: "", homeworkList: "" });
        api.ensureRosterPupil(classId, name).catch(() => {});
      }
      rows.sort((a, b) => a.name.localeCompare(b.name));
      pupilCodes.set(classId, new Map(rows.filter(r => r.loginCode).map(r => [lower(r.name), r.loginCode])));
      Promise.all(rows.filter(r => !r.loginUid).map(r => api.ensureRosterPupil(classId, r.name))).catch(() => {});
      return rows;
    },
    pupilLoginCode: (classId, name) => pupilCodes.get(classId)?.get(lower(name)) || "",
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
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        dbObj.pupils = dbObj.pupils || {};
        dbObj.pupils[classId] = dbObj.pupils[classId] || {};
        const k = lower(name);
        dbObj.pupils[classId][k] = Object.assign({}, dbObj.pupils[classId][k] || {}, {
          name, parentEmail: lower(pupil.parentEmail).slice(0, 254),
          reminderOptIn: !!pupil.reminderOptIn,
          nextLessonDate: String(pupil.nextLessonDate || "").slice(0, 10),
          lessonTime: String(pupil.lessonTime || "").slice(0, 5),
          homeworkList: String(pupil.homeworkList || "").slice(0, 100),
          ...(pupil.parentNote !== undefined ? { parentNote: String(pupil.parentNote).trim().slice(0, 1000) } : {}),
          ...(pupil.yearGroup !== undefined ? { yearGroup: String(pupil.yearGroup).slice(0, 10) } : {}),
          ...(pupil.needs !== undefined ? { needs: String(pupil.needs).trim().slice(0, 500) } : {}),
          ...(pupil.likes !== undefined ? { likes: String(pupil.likes).trim().slice(0, 300) } : {}),
          ...(pupil.reports !== undefined ? { reports: pupil.reports.map(Number).filter(Number.isFinite).slice(-12) } : {}),
          ...(pupil.programme !== undefined ? { programme: cleanProgramme(pupil.programme) } : {})
        });
        savePreviewDb(dbObj);
        return;
      }
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
      await api.ensureRosterPupil(classId, name);
    },

    /* ---------- Parent pages (parent.html) ---------- */

    // 24 random bytes: a link nobody can guess. It goes after a # so it's never sent to a server.
    newParentLink: () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24))))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
    // Writes the summary the link shows, and remembers the link (and when) on the pupil's record
    async publishParent(classId, pupilName, link, summary, note) {
      const p = await api.me();
      if (!p || !p.role) throw new Error("Sign in as a teacher first.");
      if (isPreviewTeacher()) return;
      const batch = writeBatch(store);
      batch.set(doc(store, "parents", link), { classId, pupil: String(pupilName).trim().slice(0, 40),
        summary, note: String(note || "").trim().slice(0, 1000), updated: serverTimestamp(), by: p.email });
      batch.update(doc(store, "classes", classId, "pupils", await fingerprint(pupilName)),
        { parentLink: link, parentAt: Date.now(), updated: serverTimestamp() });
      await batch.commit();
    },
    // Everything kept about one pupil in a class: results, saved progress, live status, plans, lesson
    // notes, phonics check screen, parent page and roster record. Results are matched however the name was typed.
    async deletePupilRecords(classId, name, parentLink) {
      const same = v => lower(v) === lower(name);
      if (isPreviewTeacher()) {
        const dbObj = loadPreviewDb();
        const k = lower(name);
        if (dbObj.pupils?.[classId]) delete dbObj.pupils[classId][k];
        if (dbObj.assign?.[classId]) delete dbObj.assign[classId][k];
        if (dbObj.progress?.[classId]) delete dbObj.progress[classId][k];
        const before = (dbObj.sessions?.[classId] || []).length;
        if (dbObj.sessions?.[classId]) dbObj.sessions[classId] = dbObj.sessions[classId].filter(s => !same(s.pupil));
        if (dbObj.diary?.[classId]) dbObj.diary[classId] = dbObj.diary[classId].filter(d => !same(d.pupil));
        savePreviewDb(dbObj);
        return before - (dbObj.sessions?.[classId] || []).length;
      }
      const [sessions, diary, paperEvidence, key] = await Promise.all([
        getDocs(collection(store, "classes", classId, "sessions")),
        getDocs(collection(store, "classes", classId, "diary")),
        getDocs(collection(store, "classes", classId, "paperEvidence")),
        fingerprint(name)]);
      const roster = await getDoc(doc(store, "classes", classId, "pupils", key));
      // The parent page goes first, on its own: it may already have been turned off
      if (parentLink) await deleteDoc(doc(store, "parents", parentLink)).catch(() => {});
      const refs = [
        ...sessions.docs.filter(d => same(d.data().pupil)).map(d => d.ref),
        ...diary.docs.filter(d => same(d.data().pupil)).map(d => d.ref),
        ...paperEvidence.docs.filter(d => same(d.data().pupil)).map(d => d.ref),
        ...(roster.data()?.loginCode ? [doc(store, "pupilLinks", roster.data().loginCode)] : []),
        ...["progress", "assign", "pupils", "drive"].map(c => doc(store, "classes", classId, c, key)),
        doc(store, "classes", classId, "live", await fingerprint(name)),
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
      if (isPreviewTeacher()) return;
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
      if (isPreviewTeacher()) {
        const since = Date.now() - days * 86400000;
        return (loadPreviewDb().sessions?.[classId] || []).filter(s => s.at >= since);
      }
      const since = Timestamp.fromMillis(Date.now() - days * 86400000);
      const snap = await getDocs(query(collection(store, "classes", classId, "sessions"), where("at", ">=", since), orderBy("at", "desc")));
      return snap.docs.map(d => Object.assign({ id: d.id }, d.data(), { at: d.data().at ? d.data().at.toMillis() : Date.now() }));
    },

    // Every starting-assessment result, however old, so a report can compare the start with now
    async assessments(classId, listIds) {
      if (isPreviewTeacher()) {
        const set = new Set(listIds.slice(0, 30));
        return (loadPreviewDb().sessions?.[classId] || []).filter(s => set.has(s.listId));
      }
      const snap = await getDocs(query(collection(store, "classes", classId, "sessions"), where("listId", "in", listIds.slice(0, 30))));
      return snap.docs.map(d => Object.assign({ id: d.id }, d.data(), { at: d.data().at ? d.data().at.toMillis() : Date.now() }));
    },

    async teachers() {
      if (isPreviewTeacher()) return [{ email: previewProfile.email, name: previewProfile.name, role: previewProfile.role }];
      const snap = await getDocs(collection(store, "teachers"));
      return snap.docs.map(d => Object.assign({ email: d.id }, d.data())).sort((a, b) => a.email.localeCompare(b.email));
    },
    inviteTeacher: async (email, name, role = "teacher") => {
      if (isPreviewTeacher()) return;
      return setDoc(doc(store, "teachers", lower(email)),
        { name: String(name || "").trim().slice(0, 60) || lower(email), role, invitedBy: profile.email, invitedAt: serverTimestamp() });
    },
    removeTeacher: async email => {
      if (isPreviewTeacher()) return;
      return deleteDoc(doc(store, "teachers", lower(email)));
    }
  };

  // Testing on this computer only: the emulator accepts a made-up Google sign-in
  if (emulator) {
    api._testSignIn = email => authLib.signInWithCredential(auth,
      GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true, name: email.split("@")[0] })));
  }

  window.PopCloud = api;
  window.__popCloudResolve(api);
}

