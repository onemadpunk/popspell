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
const admin = google("uid-admin", "admin@example.com");
const tutor = google("uid-tutor", "tutor@example.com");
const other = google("uid-other", "other@example.com");
const stranger = google("uid-x", "stranger@example.com");
const unverified = google("uid-u", "tutor@example.com", false);
const pupil = env.authenticatedContext("anon-1", { firebase: { sign_in_provider: "anonymous" } }).firestore();
const nobody = env.unauthenticatedContext().firestore();

await env.withSecurityRulesDisabled(async ctx => {
  const db = ctx.firestore();
  await setDoc(doc(db, "teachers/tutor@example.com"), { name: "Mr Smith", role: "teacher" });
  await setDoc(doc(db, "teachers/admin@example.com"), { name: "Site admin", role: "admin" });
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
const worksheet = { ...session, source: "worksheet", markedBy: "tutor@example.com" };

console.log("Teachers");
await check("owner creates their own owner record", assertSucceeds(setDoc(doc(owner, "teachers/owner@example.com"), { name: "Sara", role: "owner", invitedBy: "owner@example.com", invitedAt: serverTimestamp() })));
await check("a stranger can't make themselves an owner", assertFails(setDoc(doc(stranger, "teachers/stranger@example.com"), { name: "X", role: "owner", invitedBy: "x", invitedAt: serverTimestamp() })));
await check("a stranger can't make themselves a teacher", assertFails(setDoc(doc(stranger, "teachers/stranger@example.com"), { name: "X", role: "teacher", invitedBy: "x", invitedAt: serverTimestamp() })));
await check("a teacher can't invite others", assertFails(setDoc(doc(tutor, "teachers/new@example.com"), { name: "N", role: "teacher", invitedBy: "t", invitedAt: serverTimestamp() })));
await check("owner invites a teacher", assertSucceeds(setDoc(doc(owner, "teachers/new@example.com"), { name: "New", role: "teacher", invitedBy: "owner@example.com", invitedAt: serverTimestamp() })));
await check("owner grants site admin", assertSucceeds(setDoc(doc(owner, "teachers/wife@example.com"), { name: "Wife", role: "admin", invitedBy: "owner@example.com", invitedAt: serverTimestamp() })));
await check("site admin invites a teacher", assertSucceeds(setDoc(doc(admin, "teachers/admin-invite@example.com"), { name: "New", role: "teacher", invitedBy: "admin@example.com", invitedAt: serverTimestamp() })));
await check("site admin can't grant site admin", assertFails(setDoc(doc(admin, "teachers/rogue@example.com"), { name: "Rogue", role: "admin", invitedBy: "admin@example.com", invitedAt: serverTimestamp() })));
await check("site admin can't promote a teacher", assertFails(updateDoc(doc(admin, "teachers/tutor@example.com"), { role: "admin" })));
await check("site admin can't demote another admin", assertFails(updateDoc(doc(admin, "teachers/wife@example.com"), { role: "teacher" })));
await check("site admin can't remove the owner", assertFails(deleteDoc(doc(admin, "teachers/owner@example.com"))));
await check("a teacher reads their own record", assertSucceeds(getDoc(doc(tutor, "teachers/tutor@example.com"))));
await check("a teacher can't read another teacher's record", assertFails(getDoc(doc(tutor, "teachers/other@example.com"))));
await check("a teacher can't list teachers", assertFails(getDocs(collection(tutor, "teachers"))));
await check("owner lists teachers", assertSucceeds(getDocs(collection(owner, "teachers"))));
await check("site admin lists teachers", assertSucceeds(getDocs(collection(admin, "teachers"))));
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
await check("site admin lists every class", assertSucceeds(getDocs(collection(admin, "classes"))));
await check("a teacher makes a class", assertSucceeds(setDoc(doc(tutor, "classes/NEW111"), { name: "Friday", teacher: "uid-tutor", teacherName: "Mr Smith", teacherEmail: "tutor@example.com", createdAt: serverTimestamp() })));
await check("a teacher can't make a class for someone else", assertFails(setDoc(doc(tutor, "classes/NEW222"), { name: "Fake", teacher: "uid-other", teacherName: "x", teacherEmail: "x", createdAt: serverTimestamp() })));
await check("a stranger can't make a class", assertFails(setDoc(doc(stranger, "classes/NEW333"), { name: "Fake", teacher: "uid-x", teacherName: "x", teacherEmail: "x", createdAt: serverTimestamp() })));
await check("an unverified Google email isn't a teacher", assertFails(setDoc(doc(unverified, "classes/NEW444"), { name: "Fake", teacher: "uid-u", teacherName: "x", teacherEmail: "x", createdAt: serverTimestamp() })));
await check("a pupil's device can't make a class", assertFails(setDoc(doc(pupil, "classes/NEW555"), { name: "Fake", teacher: "anon-1", teacherName: "x", teacherEmail: "x", createdAt: serverTimestamp() })));
await check("a teacher renames their class", assertSucceeds(updateDoc(doc(tutor, "classes/ABC234"), { name: "Tuesday 4pm" })));
await check("a teacher can't rename another's class", assertFails(updateDoc(doc(tutor, "classes/XYZ789"), { name: "Mine now" })));
await check("a teacher can't hand a class to someone else", assertFails(updateDoc(doc(tutor, "classes/ABC234"), { teacher: "uid-other" })));
await check("owner renames any class", assertSucceeds(updateDoc(doc(owner, "classes/XYZ789"), { name: "Renamed by owner" })));
await check("site admin renames any class", assertSucceeds(updateDoc(doc(admin, "classes/XYZ789"), { name: "Renamed by admin" })));
await check("a teacher sets 'assigned work only' on their class", assertSucceeds(updateDoc(doc(tutor, "classes/ABC234"), { assignedOnly: true })));
await check("'assigned work only' must be on or off", assertFails(updateDoc(doc(tutor, "classes/ABC234"), { assignedOnly: "yes" })));
await check("a pupil's device can't change class settings", assertFails(updateDoc(doc(pupil, "classes/ABC234"), { assignedOnly: false })));
await check("a teacher sets their class to English", assertSucceeds(updateDoc(doc(tutor, "classes/ABC234"), { accent: "english" })));
await check("a teacher sets their class to Scottish", assertSucceeds(updateDoc(doc(tutor, "classes/ABC234"), { accent: "scottish" })));
await check("the accent must be Scottish or English", assertFails(updateDoc(doc(tutor, "classes/ABC234"), { accent: "welsh" })));
await check("a pupil's device can't change the accent", assertFails(updateDoc(doc(pupil, "classes/ABC234"), { accent: "english" })));
await check("another teacher can't change the accent", assertFails(updateDoc(doc(other, "classes/ABC234"), { accent: "english" })));
await check("a pupil's device sees the class setting", assertSucceeds(getDoc(doc(pupil, "classes/ABC234"))));

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
await check("teacher records a worksheet for their class", assertSucceeds(addDoc(collection(tutor, "classes/ABC234/sessions"), worksheet)));
await check("pupil can't forge teacher worksheet marks", assertFails(addDoc(collection(pupil, "classes/ABC234/sessions"), worksheet)));
await check("other teacher can't mark this class", assertFails(addDoc(collection(other, "classes/ABC234/sessions"), { ...worksheet, markedBy: "other@example.com" })));
await check("site admin marks any class", assertSucceeds(addDoc(collection(admin, "classes/ABC234/sessions"), { ...worksheet, markedBy: "admin@example.com" })));

console.log("Assignments");
await check("a pupil's device fetches its lists", assertSucceeds(getDoc(doc(pupil, "classes/ABC234/assign/everyone"))));
await check("a pupil's device can't list everyone's assignments", assertFails(getDocs(collection(pupil, "classes/ABC234/assign"))));
await check("a pupil's device can't set lists", assertFails(setDoc(doc(pupil, "classes/ABC234/assign/everyone"), { who: "Everyone", lists: [] })));
await check("a teacher sets lists", assertSucceeds(setDoc(doc(tutor, "classes/ABC234/assign/everyone"), { who: "Everyone", lists: ["ai"] })));
await check("a teacher can't set lists in another's class", assertFails(setDoc(doc(tutor, "classes/XYZ789/assign/everyone"), { who: "Everyone", lists: ["ai"] })));

console.log("Lesson diary");
const note = { pupil: "Ava", lessonDate: "2026-10-28", lastWork: "Practised ai",
  nextLesson: "Revisit ai", nextList: "ai", nextDate: "2026-10-29",
  by: "tutor@example.com", at: serverTimestamp() };
await check("teacher records their pupil's lesson", assertSucceeds(addDoc(collection(tutor, "classes/ABC234/diary"), note)));
await check("pupil can't read teacher diary", assertFails(getDocs(collection(pupil, "classes/ABC234/diary"))));
await check("other teacher can't read diary", assertFails(getDocs(collection(other, "classes/ABC234/diary"))));
await check("site admin reads diary", assertSucceeds(getDocs(collection(admin, "classes/ABC234/diary"))));
await check("teacher can't write diary in another class", assertFails(addDoc(collection(tutor, "classes/XYZ789/diary"), note)));
await check("teacher can't forge another author's note", assertFails(addDoc(collection(tutor, "classes/ABC234/diary"), { ...note, by: "other@example.com" })));

console.log("Pupil roster");
const roster = { name: "Ava", parentEmail: "parent@example.com", reminderOptIn: true,
  nextLessonDate: "2026-10-29", lessonTime: "16:00", homeworkList: "ai", updated: serverTimestamp() };
await check("teacher adds a pupil and parent contact", assertSucceeds(setDoc(doc(tutor, "classes/ABC234/pupils/ava"), roster)));
await check("pupil device can't read parent contact", assertFails(getDoc(doc(pupil, "classes/ABC234/pupils/ava"))));
await check("other teacher can't read parent contact", assertFails(getDoc(doc(other, "classes/ABC234/pupils/ava"))));
await check("site admin reads pupil roster", assertSucceeds(getDocs(collection(admin, "classes/ABC234/pupils"))));
await check("pupil device can't add roster data", assertFails(setDoc(doc(pupil, "classes/ABC234/pupils/fake"), roster)));
await check("teacher changes next lesson", assertSucceeds(updateDoc(doc(tutor, "classes/ABC234/pupils/ava"), { nextLessonDate: "2026-10-30" })));
await check("teacher can't rename a roster identity", assertFails(updateDoc(doc(tutor, "classes/ABC234/pupils/ava"), { name: "Someone else" })));

await check("teacher saves a parent link and note", assertSucceeds(updateDoc(doc(tutor, "classes/ABC234/pupils/ava"), { parentLink: "abcdefghijklmnopqrstuvwxyz012345", parentAt: Date.now(), parentNote: "Well done!" })));
await check("teacher saves a pupil's profile", assertSucceeds(updateDoc(doc(tutor, "classes/ABC234/pupils/ava"), { yearGroup: "P3", needs: "Dyslexia; likes short tasks", likes: "Dinosaurs" })));
await check("a profile note can't be huge", assertFails(updateDoc(doc(tutor, "classes/ABC234/pupils/ava"), { needs: "x".repeat(501) })));
await check("a pupil device can't change the profile", assertFails(updateDoc(doc(pupil, "classes/ABC234/pupils/ava"), { yearGroup: "P7" })));
await check("teacher saves parents' night report dates", assertSucceeds(updateDoc(doc(tutor, "classes/ABC234/pupils/ava"), { reports: [Date.now() - 2e10, Date.now()] })));
await check("report dates are kept to twelve", assertFails(updateDoc(doc(tutor, "classes/ABC234/pupils/ava"), { reports: Array(13).fill(1) })));
await check("a pupil device can't change report dates", assertFails(updateDoc(doc(pupil, "classes/ABC234/pupils/ava"), { reports: [] })));
await check("teacher loads every starting assessment", assertSucceeds(getDocs(query(collection(tutor, "classes/ABC234/sessions"), where("listId", "in", ["assess-read", "check-spelling"])))));
await check("a pupil device can't load the class's assessments", assertFails(getDocs(query(collection(pupil, "classes/ABC234/sessions"), where("listId", "in", ["assess-read"])))));
await check("parent note can't be huge", assertFails(updateDoc(doc(tutor, "classes/ABC234/pupils/ava"), { parentNote: "x".repeat(1001) })));

console.log("Pupils' own progress");
const prog = { pupil: "Ava", words: { rain: { box: 2, right: 1, missed: 0 } }, sounds: { ai: { right: 1, wrong: 0 } }, bests: { weeks: {}, lists: {} }, updated: serverTimestamp() };
await check("a pupil device saves its progress", assertSucceeds(setDoc(doc(pupil, "classes/ABC234/progress/fp-ava"), prog)));
await check("a pupil device loads its progress by name", assertSucceeds(getDoc(doc(pupil, "classes/ABC234/progress/fp-ava"))));
await check("a pupil device can't list everyone's progress", assertFails(getDocs(collection(pupil, "classes/ABC234/progress"))));
await check("signed-out visitors can't read progress", assertFails(getDoc(doc(nobody, "classes/ABC234/progress/fp-ava"))));
await check("progress can't carry other fields", assertFails(setDoc(doc(pupil, "classes/ABC234/progress/fp-ava"), { ...prog, parentEmail: "x@example.com" })));
await check("progress needs a real class", assertFails(setDoc(doc(pupil, "classes/NOPE99/progress/fp-ava"), prog)));
await check("the class teacher can see pupils' progress", assertSucceeds(getDocs(collection(tutor, "classes/ABC234/progress"))));
await check("another teacher can't list it", assertFails(getDocs(collection(other, "classes/ABC234/progress"))));

console.log("Parent pages");
const LINK = "abcdefghijklmnopqrstuvwxyz012345";
const parentDoc = { classId: "ABC234", pupil: "Ava", summary: { sounds: { secure: ["ai"] } }, note: "Well done!", updated: serverTimestamp(), by: "tutor@example.com" };
await check("teacher publishes their pupil's parent page", assertSucceeds(setDoc(doc(tutor, `parents/${LINK}`), parentDoc)));
await check("anyone with the link can open it, signed in or not", assertSucceeds(getDoc(doc(nobody, `parents/${LINK}`))));
await check("a pupil device can open it too", assertSucceeds(getDoc(doc(pupil, `parents/${LINK}`))));
await check("nobody can list parent pages", assertFails(getDocs(collection(nobody, "parents"))));
await check("a pupil device can't list parent pages", assertFails(getDocs(collection(pupil, "parents"))));
await check("a short, guessable link is refused", assertFails(setDoc(doc(tutor, "parents/abc"), parentDoc)));
await check("a pupil device can't write a parent page", assertFails(setDoc(doc(pupil, "parents/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"), parentDoc)));
await check("a parent can't change the page", assertFails(updateDoc(doc(nobody, `parents/${LINK}`), { note: "changed" })));
await check("another teacher can't write a page for this class", assertFails(setDoc(doc(other, "parents/yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"), { ...parentDoc, by: "other@example.com" })));
await check("another teacher can't overwrite this page", assertFails(setDoc(doc(other, `parents/${LINK}`), { ...parentDoc, classId: "XYZ789", by: "other@example.com" })));
await check("teacher can't move a page to another class", assertFails(setDoc(doc(tutor, `parents/${LINK}`), { ...parentDoc, classId: "XYZ789" })));
await check("teacher can't sign a page as someone else", assertFails(setDoc(doc(tutor, `parents/${LINK}`), { ...parentDoc, by: "other@example.com" })));
await check("site admin updates the page", assertSucceeds(setDoc(doc(admin, `parents/${LINK}`), { ...parentDoc, by: "admin@example.com" })));
await check("another teacher can't turn the page off", assertFails(deleteDoc(doc(other, `parents/${LINK}`))));
await check("teacher turns the page off", assertSucceeds(deleteDoc(doc(tutor, `parents/${LINK}`))));

console.log("Deleting a pupil's records");
const diaryRef = await addDoc(collection(tutor, "classes/ABC234/diary"), { pupil: "Ava", lessonDate: "2026-10-01", lastWork: "", nextLesson: "", nextList: "", nextDate: "", by: "tutor@example.com", at: serverTimestamp() });
await check("a pupil device can't delete the roster record", assertFails(deleteDoc(doc(pupil, "classes/ABC234/pupils/ava"))));
await check("another teacher can't delete the roster record", assertFails(deleteDoc(doc(other, "classes/ABC234/pupils/ava"))));
await check("a pupil device can't delete lesson notes", assertFails(deleteDoc(doc(pupil, diaryRef.path))));
await check("another teacher can't delete lesson notes", assertFails(deleteDoc(doc(other, diaryRef.path))));
await check("teacher deletes their pupil's lesson notes", assertSucceeds(deleteDoc(diaryRef)));
await check("teacher deletes their pupil's live status", assertSucceeds(deleteDoc(doc(tutor, "classes/ABC234/live/ava"))));
await check("teacher deletes their pupil's roster record", assertSucceeds(deleteDoc(doc(tutor, "classes/ABC234/pupils/ava"))));

console.log(`\n${passed} passed, ${failed} failed`);
await env.cleanup();
process.exit(failed ? 1 : 0);

