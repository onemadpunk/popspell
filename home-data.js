/* Home-school packs (#/home in the app, listed on course.html): which packs there are, and the plain
   words a parent needs that the lessons don't already have. home-packs.js makes the packs from PopSpell's
   ready lessons (lessons.js) and their own sheets, so a pack never repeats or rewrites a lesson.

   A pack is one subject, one nation and one level band. Its sessions are that band's ready lessons in
   teaching order: Scotland follows the Curriculum for Excellence levels (with the draft Know, Do,
   Understand strands named where they're known) and the SQA courses for S4 to S6; England follows the
   2014 national curriculum by year band, the GCSE climbs for Years 10 and 11, and the A level climbs for Years 12 and 13.

   pick says which lessons: { level } a CfE level (Scotland's view of each lesson; with part, one of its three
   school years), { sqa } an SQA course,
   { band } an England library band (england.js), { climb } a GCSE climb stage (lesson ids), { not } ids
   to leave out. This file needs nothing else loaded, so course.html can list the packs on its own. */
window.PopHomeData = (() => {
  "use strict";
  const P = [];
  const add = (nation, subject, id, title, ages, pick, opts = {}) => P.push(Object.assign({ id: `${nation === "scotland" ? "sc" : "en"}-${subject === "Maths" ? "maths" : "english"}-${id}`,
    nation, subject, title, ages, pick, perWeek: 3, age: "young" }, opts));
  // Scotland: CfE levels, then the SQA courses (senior phase)
  [["Maths", "Maths"], ["Literacy", "English"]].forEach(([subject, word]) => {
    add("scotland", subject, "early", `${word === "Maths" ? "Numeracy and maths" : "Literacy and English"}: Early level`, "P1 (age 4 to 6)", { level: "Early" });
    // First and Second level each cover three school years: one pack a year (home-packs.js splits the level's lessons)
    ["P2", "P3", "P4"].forEach((p, i) => add("scotland", subject, p.toLowerCase(), `${word === "Maths" ? "Numeracy and maths" : "Literacy and English"}: ${p} (First level)`, `${p} (age ${5 + i} to ${7 + i})`, { level: "First", part: i }));
    ["P5", "P6", "P7"].forEach((p, i) => add("scotland", subject, p.toLowerCase(), `${word === "Maths" ? "Numeracy and maths" : "Literacy and English"}: ${p} (Second level)`, `${p} (age ${8 + i} to ${10 + i})`, { level: "Second", part: i }, { age: "middle" }));
    add("scotland", subject, "third", `${word === "Maths" ? "Numeracy and maths" : "Literacy and English"}: Third level`, "S1 to S2 (age 11 to 14)", { level: "Third" }, { age: "older" });
    add("scotland", subject, "fourth", `${word === "Maths" ? "Numeracy and maths" : "Literacy and English"}: Fourth level`, "S3 (age 13 to 15)", { level: "Fourth" }, { age: "older" });
    const sqa = word === "Maths" ? "Mathematics" : "English";
    add("scotland", subject, "n4", `National 4 ${sqa}`, "S4 (age 14 to 16)", { sqa: `National 4 ${sqa}` }, { age: "older", exam: true, perWeek: 2 });
    add("scotland", subject, "n5", `National 5 ${sqa}`, "S4 to S5 (age 14 to 17)", { sqa: `National 5 ${sqa}` }, { age: "older", exam: true, perWeek: 2 });
    add("scotland", subject, "higher", `Higher ${sqa}`, "S5 to S6 (age 15 to 18)", { sqa: `Higher ${sqa}` }, { age: "older", exam: true, perWeek: 2 });
    add("scotland", subject, "ah", `Advanced Higher ${sqa}`, "S6 (age 16 to 18)", { sqa: `Advanced Higher ${sqa}` }, { age: "older", exam: true, perWeek: 2 });
  });
  // Scotland's other maths course: Applications of Mathematics (the SQA Applications climb)
  add("scotland", "Maths", "apps-n5", "National 5 Applications of Mathematics", "S4 to S5 (age 14 to 17)", { sqa: "National 5 Applications of Mathematics" }, { age: "older", exam: true, perWeek: 2 });
  add("scotland", "Maths", "apps-higher", "Higher Applications of Mathematics", "S5 to S6 (age 15 to 18)", { sqa: "Higher Applications of Mathematics" }, { age: "older", exam: true, perWeek: 2 });
  // England: the national curriculum's own year bands, then the GCSE climbs
  [["Maths", "Maths"], ["Literacy", "English"]].forEach(([subject, word]) => {
    add("england", subject, "reception", `${word}: Reception`, "Reception (age 4 to 5)", { band: "Reception" });
    add("england", subject, "y1", `${word}: Year 1`, "Year 1 (age 5 to 6)", { band: "Year 1" });
    add("england", subject, "y2", `${word}: Year 2`, "Year 2 (age 6 to 7)", { band: "Year 2" });
    add("england", subject, "y34", `${word}: Years 3 and 4`, "Years 3 and 4 (age 7 to 9)", { band: "Years 3–4" }, { age: "middle" });
    add("england", subject, "y56", `${word}: Years 5 and 6`, "Years 5 and 6 (age 9 to 11)", { band: "Years 5–6" }, { age: "middle" });
    add("england", subject, "ks3", `${word}: Key stage 3`, "Years 7 to 9 (age 11 to 14)", { band: "Key stage 3" }, { age: "older" });
    add("england", subject, "ks4", `${word}: Key stage 4, the GCSE content`, "Years 10 and 11 (age 14 to 16)", { band: "Key stage 4", climb: false }, { age: "older", perWeek: 2 });
    const g = word === "Maths" ? "GCSE maths" : "GCSE English Language";
    const re = word === "Maths" ? ["^lesson-england-gcse-climb-(?!g5-|gh-|my-next)", "^lesson-england-gcse-climb-g5-", "^lesson-england-gcse-climb-gh-"]
      : ["^lesson-england-english-climb-(e1-|start|what|my-next)", "^lesson-england-english-climb-(e2-|spoken)", "^lesson-england-english-climb-(e3-|lit-)"];
    add("england", subject, "gcse-1", `${g}: grade 1 to 3`, "Years 10 and 11, or a resit", { climb: re[0] }, { age: "older", exam: true, perWeek: 2 });
    add("england", subject, "gcse-2", `${g}: grades 4 and 5`, "Years 10 and 11, or a resit", { climb: re[1] }, { age: "older", exam: true, perWeek: 2 });
    add("england", subject, "gcse-3", `${g}: grades 6 to 9${word === "Maths" ? " (Higher)" : " and Literature"}`, "Years 10 and 11", { climb: re[2] }, { age: "older", exam: true, perWeek: 2 });
  });
  // England's sixth form: A level, one pack a year (the A level climbs)
  add("england", "Maths", "alevel-y12", "A level Mathematics: Year 12", "Year 12 (age 16 to 17)", { climb: "^lesson-alevel-maths-(y12-|what-the-exam|exam-technique)" }, { age: "older", exam: true, perWeek: 1, note: "Each A level session is a whole topic: spread it over a week, with the lesson on day 1, practice on days 2 and 3 (make the pack again for fresh questions), and the exam sheet at the end of the week." });
  add("england", "Maths", "alevel-y13", "A level Mathematics: Year 13", "Year 13 (age 17 to 18)", { climb: "^lesson-alevel-maths-(y13-|my-next-step)" }, { age: "older", exam: true, perWeek: 1, note: "Each A level session is a whole topic: spread it over a week, with the lesson on day 1, practice on days 2 and 3 (make the pack again for fresh questions), and the exam sheet at the end of the week." });
  add("england", "Literacy", "alevel-lit", "A level English Literature", "Years 12 and 13 (age 16 to 18)", { climb: "^lesson-alevel-english-(al1-|my-next-step)" }, { age: "older", exam: true, perWeek: 1, note: "Each A level session is a whole topic: spread it over a week, with the lesson on day 1, the online practice on days 2 and 3, and the exam question written and marked with the bands at the end of the week." });
  add("england", "Literacy", "alevel-lang", "A level English Language", "Years 12 and 13 (age 16 to 18)", { climb: "^lesson-alevel-english-(al2-|my-next-step)" }, { age: "older", exam: true, perWeek: 1, note: "Each A level session is a whole topic: spread it over a week, with the lesson on day 1, the online practice on days 2 and 3, and the exam question written and marked with the bands at the end of the week." });

  // ---------- Plain words for the parent ----------
  // When a child is stuck, by strand and age: things to say. Each lesson page adds its own "look for".
  const STUCK = {
    Maths: {
      "Number": { young: ["Let's count them together, touching each one.", "Show me with your fingers.", "What number comes just before? Just after?"],
        middle: ["Can you make it with coins or counters first?", "What's an easier number you could try first, then change?", "Draw it: a number line, or tens and ones."],
        older: ["What do you know already? Write that down first.", "Try it with small, easy numbers, then use the same steps.", "Estimate first: about how big should the answer be?"] },
      "Fractions, decimals and percentages": { young: ["Let's share them out: one for you, one for me.", "Are the two pieces the same size?"],
        middle: ["Draw a bar and split it into equal parts.", "What's one part worth? Then how many parts do you need?", "Is it more or less than a half?"],
        older: ["Find 10% or 1% first, then build up.", "Write it as a fraction, a decimal and a percentage: which is easiest here?", "Draw a bar model."] },
      "Money": { young: ["Let's use real coins.", "Which coin is worth the most?"], middle: ["Count the biggest coins first.", "Count on from the price to find the change."],
        older: ["Write it in pence first if it helps.", "What would one cost? Then scale up."] },
      "Time": { young: ["What do you do at that time of day?", "Where is the short hand pointing?"], middle: ["Count on in hours first, then the minutes.", "Draw a time line."],
        older: ["Count on to the next hour, then on again.", "Write the times on a line and count the gaps."] },
      "Measurement": { young: ["Which one is longer? Put them side by side.", "Let's measure with cubes or hand spans."],
        middle: ["Start the ruler at zero.", "Does the answer make sense? Is a pencil really 2 metres long?", "Which unit is it in?"],
        older: ["Write the units in every line.", "Change everything to the same unit first.", "Sketch it and label what you know."] },
      "Patterns and missing numbers": { young: ["What comes next? Say the pattern out loud.", "Can you make the pattern with blocks?"],
        middle: ["What changes each time? Write it between the numbers.", "Try a number and check: does it work?"],
        older: ["What's the same on both sides? Do the same thing to both.", "Put a number in for the letter and check.", "Write down the rule in words first."] },
      "Shape and angles": { young: ["Let's feel the edges and count the corners.", "Can you find one like it in the room?"],
        middle: ["Is it more or less than a square corner?", "Turn the page round: does that help?", "Draw it."],
        older: ["Sketch it and mark what you know.", "Which fact do you know about angles here (a straight line, a triangle, round a point)?", "Write the reason next to each angle."] },
      "Data and chance": { young: ["Let's sort them into groups first.", "Which group has the most?"],
        middle: ["Read the labels on the sides first.", "What does one square stand for?"],
        older: ["Put the numbers in order first.", "Write what each part of the chart means before you answer.", "Could it be more likely, less likely, or even?"] }
    },
    Literacy: {
      "Reading: phonics and tricky words": { young: ["Say each sound, then blend them together fast.", "Put your finger under each sound.", "That's a tricky word: we just have to know it. Let's look, say, cover, write."],
        middle: ["Break it into syllables and clap them.", "Is there a part of the word you know?"], older: ["Break it into chunks: prefix, root, suffix.", "Read past it and come back: what would make sense?"] },
      "Reading: understanding stories": { young: ["Let's look at the picture: what's happening?", "Who's in the story? What did they do?"],
        middle: ["Find the sentence that tells you. Put your finger on it.", "How do you know? Which words show it?", "What would you do?"],
        older: ["Find a short quote, then say what it shows.", "Why might the writer have chosen that word?", "Read the question again: what is it really asking?"] },
      "Listening and talking": { young: ["Say it to me in your own words.", "Look at me while I speak, then tell me one thing I said."],
        middle: ["Start with: I think… because…", "What's one thing you'd ask about that?"], older: ["Make one point, then give a reason and an example.", "What would someone who disagrees say?"] },
      "Listening and sounds": { young: ["Listen again: what's the first sound you hear?", "Clap the beats with me."], middle: ["Listen again and count the sounds on your fingers."], older: ["Listen again and note just the key words."] },
      "Handwriting": { young: ["Start at the top. Which way does the letter go?", "Trace it with your finger first."], middle: ["Keep the small letters sitting on the line.", "Slow down: neat first, then speed."], older: ["Slow down for the first line, then keep that size."] },
      "Writing: sentences and punctuation": { young: ["Say the sentence out loud first, then write it.", "Where does a sentence start? Where does it stop?"],
        middle: ["Read it aloud: where do you take a breath?", "Who or what is the sentence about? What do they do?"], older: ["Read it aloud: does it make sense on its own?", "Could you join these with because, although or which?"] },
      "Writing: creating texts": { young: ["Tell me your idea first. Now let's write the first bit.", "Draw it, then write a word or two about it."],
        middle: ["Plan first: beginning, middle, end in three boxes.", "What would the reader want to know next?", "Say your sentence out loud before you write it."],
        older: ["Plan in a quick list first: three points.", "Who's reading this? What do you want them to think or do?", "Write one paragraph, then read it back."] },
      "Spelling": { young: ["Say the word slowly and count the sounds.", "Write a line for each sound, then fill them in."],
        middle: ["Is there a rule? What happens to the end of the word?", "Which bit is tricky? Let's look, say, cover, write, check."],
        older: ["Break it into prefix, root and suffix.", "Is it like another word you know?", "Say it in a silly way to remember it (Wed-nes-day)."] },
      "Writing: dictation": { young: ["Say the sentence back to me first.", "Count the words on your fingers."], middle: ["Say it back, then write it a few words at a time."], older: ["Write it, then read it back against what you heard."] }
    }
  };
  // What to have ready, by strand (plus a pencil and the printed pages, always)
  const NEED = {
    "Number": "counters, buttons or dried pasta to count with", "Fractions, decimals and percentages": "paper to fold or cut, and coloured pencils",
    "Money": "real coins (a few of each)", "Time": "a clock with hands (a real one, or a paper plate with card hands)", "Measurement": "a ruler, a tape measure, and kitchen scales or a jug if you have them",
    "Patterns and missing numbers": "counters or blocks for patterns", "Shape and angles": "a ruler, and boxes or tins from the cupboard to look at", "Data and chance": "coloured pencils and a dice or a coin",
    "Reading: phonics and tricky words": "small cards or scraps of paper to write sounds and words on", "Reading: understanding stories": "a picture book or story your child likes",
    "Handwriting": "a sharp pencil and lined paper", "Writing: creating texts": "lined paper for writing", "Spelling": "a small whiteboard or scrap paper for having a go"
  };
  // The same for older pupils (secondary and the exam courses)
  const NEED_OLDER = {
    "Measurement": "a ruler and a calculator", "Shape and angles": "a ruler, a protractor, a pair of compasses and a calculator", "Data and chance": "a ruler and a calculator",
    "Number": "a calculator (a scientific one, about £10, for the exam courses)", "Fractions, decimals and percentages": "a calculator", "Patterns and missing numbers": "a calculator and squared paper",
    "Money": "a calculator", "Time": "a calculator", "Reading: understanding stories": "a highlighter or coloured pencils for marking up the text", "Writing: creating texts": "lined paper for writing",
    "Spelling": "scrap paper for having a go"
  };
  // Words a parent will meet, for the guide's word list
  const WORDS = {
    Maths: {
      young: [["Digit", "one of 0 to 9; 25 has two digits"], ["Add / take away", "put together / take some away"], ["Double", "two lots of the same number"], ["Half", "two equal parts"],
        ["Number bond", "two numbers that make another (3 and 7 make 10)"], ["Number line", "numbers in order on a line, for counting on and back"], ["2D / 3D", "flat shapes / solid shapes"], ["Tally", "a mark for each one, in fives"]],
      middle: [["Place value", "what a digit is worth by where it is (the 4 in 245 is 40)"], ["Product", "the answer to a multiplication"], ["Factor / multiple", "divides exactly into / in the times table of"],
        ["Numerator / denominator", "top / bottom number of a fraction"], ["Equivalent", "worth the same (½ = 2/4)"], ["Perimeter / area", "distance round / space inside"], ["Acute / obtuse", "less than / more than a right angle"], ["Mean", "add them up, divide by how many"]],
      older: [["Expression / equation", "letters and numbers / the same with an equals sign, to solve"], ["Expand / factorise", "multiply out brackets / put brackets back"], ["Prime", "only divides by 1 and itself"],
        ["Ratio", "how much of one for each of another (2 : 3)"], ["Gradient", "how steep a line is"], ["Median / mode / range", "the middle / the most common / biggest minus smallest"], ["Hypotenuse", "the longest side of a right-angled triangle"], ["Method marks", "marks for each right step, even if the answer is wrong"]]
    },
    Literacy: {
      young: [["Phoneme", "a sound in a word (cat has 3: c-a-t)"], ["Grapheme", "the letters that write a sound (sh, ee, igh)"], ["Blend", "push the sounds together to read a word"], ["Segment", "split a word into its sounds to spell it"],
        ["Tricky word", "a word you can't sound out yet (the, said): learn it by sight"], ["Digraph", "two letters, one sound (sh, ai)"], ["Capital letter / full stop", "where a sentence starts / ends"], ["Finger space", "the gap between words"]],
      middle: [["Noun / verb / adjective / adverb", "a thing / an action / describes a noun / describes a verb"], ["Prefix / suffix", "added to the start / end of a word (un-, -ful)"], ["Conjunction", "a joining word (and, because, when)"],
        ["Inference", "working out what the writer means but doesn't say"], ["Paragraph", "a group of sentences about one idea"], ["Fact / opinion", "can be checked / what someone thinks"], ["Speech marks", "\"…\" around words someone says"], ["Skim / scan", "read quickly for the gist / look for one detail"]],
      older: [["Quotation", "a few exact words from the text, in speech marks"], ["Analyse", "say how the words create an effect, not just what they say"], ["Theme", "a big idea a text keeps coming back to"], ["Purpose / audience", "why it was written / who it's for"],
        ["Persuasive techniques", "ways of convincing (rhetorical questions, facts, lists of three)"], ["Imagery", "simile, metaphor, personification: word pictures"], ["Tone", "the writer's attitude (angry, playful, serious)"], ["Evaluate", "say how well something works, and why"]]
    }
  };
  return { PACKS: P, get: id => P.find(p => p.id === id) || null, STUCK, NEED, NEED_OLDER, WORDS };
})();
