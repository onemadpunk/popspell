// Tests firestore.rules against the Firebase emulator: who can read and write what.
//   npm install firebase-tools @firebase/rules-unit-testing firebase@10
//   npx firebase emulators:exec --only firestore --project demo-popspell "node rules.test.mjs"
// (run from a folder holding this file, firestore.rules and a firebase.json naming them)
import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";

const env = await initializeTestEnvironment({
  projectId: "demo-popspell",
  firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8080 }
});

const google = (uid, email, verified = true) => env.authenticatedContext(uid, {
  email, email_verified: verified, firebase: { sign_in_provider: "google.com" }
}).firestore();
const owner = google("uid-owner", "owner@example.com");
const tutor = google("uid-tutor", "tutor@example.com");
const other = google("uid-other", "other@example.com");
const stranger = google("uid-x", "stranger@example.com");
const unverified = google("uid-u", "tutor@example.com", false);
const pupil = env.authenticatedContext("anon-1", { firebase: { sign_in_provider: "anonymous" } }).firestore();
const nobody = env.unauthenticatedContext().firestore();

await env.withSecurityRulesDisabled(async ctx => {
  const db = ctx.firestore();
  await setDoc(doc(db, "teachers/tutor@example.com"), { name: "Mr Smith", role: "teacher" });
  await setDoc(doc(db, "teachers/other@example.com"), { name: "Ms Other", role: "teacher" });
  await setDoc(doc(db, "classes/ABC234"), { name: "Tuesday", teacher: "uid-tutor", teacherName: "Mr Smith", teacherEmail: "tutor@example.com" });
  await setDoc(doc(db, "classes/XYZ789"), { name: "Other's class", teacher: "uid-other", teacherName: "Ms Other", teacherEmail: "other@example.com" });
  await setDoc(doc(db, "classes/ABC234/assign/everyone"), { who: "Everyone", lists: ["tricky"] });
  await setDoc(doc(db, "classes/ABC234/live/ava"), { pupil: "Ava", status: "working" });
  await addDoc(collection(db, "classes/ABC234/sessions"), { pupil: "Ava", list: "ai", words: [] });
});

let passed = 0;
let failed = 0;
async function check(label, promise) {
  try { await promise; passed++; console.log("  ok   ", label); }
  catch (err) { failed++; console.log("  FAIL ", label, "—", err.message.split("\n")[0]); }
}
const live = { pupil: "Ava", list: "ai", status: "working", done: 1, total: 18, right: 1, missedRow: 0, notFirstRow: 0, lastWord: "rain ✓", seen: serverTimestamp() };
const session = { pupil: "Ava", list: "ai", listId: "ai", finished: true, words: [{ word: "rain" }], at: serverTimestamp() };

console.log("Teachers");
await check("owner creates their own owner record", assertSucceeds(setDoc(doc(owner, "teachers/owner@example.com"), { name: "Sara", role: "owner", invitedBy: "owner@example.com", invitedAt: serverTimestamp() })));
await check("a stranger can't make themselves an owner", assertFails(setDoc(doc(stranger, "teachers/stranger@example.com"), { name: "X", role: "owner", invitedBy: "x", invitedAt: serverTimestamp() })));
await check("a stranger can't make themselves a teacher", assertFails(setDoc(doc(stranger, "teachers/stranger@example.com"), { name: "X", role: "teacher", invitedBy: "x", invitedAt: serverTimestamp() })));
await check("a teacher can't invite others", assertFails(setDoc(doc(tutor, "teachers/new@example.com"), { name: "N", role: "teacher", invitedBy: "t", invitedAt: serverTimestamp() })));
await check("owner invites a teacher", assertSucceeds(setDoc(doc(owner, "teachers/new@example.com"), { name: "New", role: "teacher", invitedBy: "owner@example.com", invitedAt: serverTimestamp() })));
await check("a teacher reads their own record", assertSucceeds(getDoc(doc(tutor, "teachers/tutor@example.com"))));
await check("a teacher can't read another teacher's record", assertFails(getDoc(doc(tutor, "teachers/other@example.com"))));
await check("a teacher can't list teachers", assertFails(getDocs(collection(tutor, "teachers"))));
await check("owner lists teachers", assertSucceeds(getDocs(collection(owner, "teachers"))));
await check("a teacher can't promote themselves to owner", assertFails(updateDoc(doc(tutor, "teachers/tutor@example.com"), { role: "owner" })));
await check("owner can't remove themselves", assertFails(deleteDoc(doc(owner, "teachers/owner@example.com"))));
await check("owner removes a teacher", assertSucceeds(deleteDoc(doc(owner, "teachers/new@example.com"))));

console.log("Classes");
await check("a pupil's device can look up a class code", assertSucceeds(getDoc(doc(pupil, "classes/ABC234"))));
await check("signed-out visitors can't look up classes", assertFails(getDoc(doc(nobody, "classes/ABC234"))));
await check("a pupil's device can't list classes", assertFails(getDocs(collection(pupil, "classes"))));
await check("a teacher lists their own classes", assertSucceeds(getDocs(query(collection(tutor, "classes"), where("teacher", "==", "uid-tutor")))));
await check("a teacher can't list every class", assertFails(getDocs(collection(tutor, "classes"))));
await check("owner lists every class", assertSucceeds(getDocs(collection(owner, "classes"))));
await check("a teacher makes a class", assertSucceeds(setDoc(doc(tutor, "classes/NEW111"), { name: "Friday", teacher: "uid-tutor", teacherName: "Mr Smith", teacherEmail: "tutor@example.com", createdAt: serverTimestamp() })));
await check("a teacher can't make a class for someone else", assertFails(setDoc(doc(tutor, "classes/NEW222"), { name: "Fake", teacher: "uid-other", teacherName: "x", teacherEmail: "x", createdAt: serverTimestamp() })));
await check("a stranger can't make a class", assertFails(setDoc(doc(stranger, "classes/NEW333"), { name: "Fake", teacher: "uid-x", teacherName: "x", teacherEmail: "x", createdAt: serverTimestamp() })));
await check("an unverified Google email isn't a teacher", assertFails(setDoc(doc(unverified, "classes/NEW444"), { name: "Fake", teacher: "uid-u", teacherName: "x", teacherEmail: "x", createdAt: serverTimestamp() })));
await check("a pupil's device can't make a class", assertFails(setDoc(doc(pupil, "classes/NEW555"), { name: "Fake", teacher: "anon-1", teacherName: "x", teacherEmail: "x", createdAt: serverTimestamp() })));
await check("a teacher renames their class", assertSucceeds(updateDoc(doc(tutor, "classes/ABC234"), { name: "Tuesday 4pm" })));
await check("a teacher can't rename another's class", assertFails(updateDoc(doc(tutor, "classes/XYZ789"), { name: "Mine now" })));
await check("a teacher can't hand a class to someone else", assertFails(updateDoc(doc(tutor, "classes/ABC234"), { teacher: "uid-other" })));
await check("owner renames any class", assertSucceeds(updateDoc(doc(owner, "classes/XYZ789"), { name: "Renamed by owner" })));

console.log("Live class");
await check("a pupil's device updates its live progress", assertSucceeds(setDoc(doc(pupil, "classes/ABC234/live/ava"), live, { merge: true })));
await check("a pupil's device asks for help", assertSucceeds(setDoc(doc(pupil, "classes/ABC234/live/ava"), { pupil: "Ava", help: true, helpAt: Date.now(), seen: serverTimestamp() }, { merge: true })));
await check("a pupil's device can't add other fields", assertFails(setDoc(doc(pupil, "classes/ABC234/live/ava"), { pupil: "Ava", hack: true }, { merge: true })));
await check("a pupil's device can't write to a made-up class", assertFails(setDoc(doc(pupil, "classes/NOPE99/live/ava"), live)));
await check("a pupil's device can't read the live class", assertFails(getDocs(collection(pupil, "classes/ABC234/live"))));
await check("signed-out visitors can't write", assertFails(setDoc(doc(nobody, "classes/ABC234/live/ava"), live)));
await check("a teacher watches their class", assertSucceeds(getDocs(collection(tutor, "classes/ABC234/live"))));
await check("a teacher can't watch another's class", assertFails(getDocs(collection(tutor, "classes/XYZ789/live"))));
await check("a teacher clears a help request", assertSucceeds(updateDoc(doc(tutor, "classes/ABC234/live/ava"), { help: false, helpAt: null })));
await check("owner watches any class", assertSucceeds(getDocs(collection(owner, "classes/ABC234/live"))));

console.log("Results");
await check("a pupil's device sends a finished list", assertSucceeds(addDoc(collection(pupil, "classes/ABC234/sessions"), session)));
await check("a pupil's device can't read results", assertFails(getDocs(collection(pupil, "classes/ABC234/sessions"))));
await check("a pupil's device can't send a huge result", assertFails(addDoc(collection(pupil, "classes/ABC234/sessions"), Object.assign({}, session, { words: Array(61).fill({ word: "x" }) }))));
await check("a teacher reads their class's results", assertSucceeds(getDocs(collection(tutor, "classes/ABC234/sessions"))));
await check("a teacher can't read another class's results", assertFails(getDocs(collection(other, "classes/ABC234/sessions"))));
await check("owner reads any class's results", assertSucceeds(getDocs(collection(owner, "classes/ABC234/sessions"))));

console.log("Assignments");
await check("a pupil's device fetches its lists", assertSucceeds(getDoc(doc(pupil, "classes/ABC234/assign/everyone"))));
await check("a pupil's device can't list everyone's assignments", assertFails(getDocs(collection(pupil, "classes/ABC234/assign"))));
await check("a pupil's device can't set lists", assertFails(setDoc(doc(pupil, "classes/ABC234/assign/everyone"), { who: "Everyone", lists: [] })));
await check("a teacher sets lists", assertSucceeds(setDoc(doc(tutor, "classes/ABC234/assign/everyone"), { who: "Everyone", lists: ["ai"] })));
await check("a teacher can't set lists in another's class", assertFails(setDoc(doc(tutor, "classes/XYZ789/assign/everyone"), { who: "Everyone", lists: ["ai"] })));

console.log(`\n${passed} passed, ${failed} failed`);
await env.cleanup();
process.exit(failed ? 1 : 0);
