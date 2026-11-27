/* Home-school packs (#/home in the app, listed on course.html): which packs there are, and the plain
   words a parent needs that the lessons don't already have. home-packs.js makes the packs from PopSpell's
   ready lessons (lessons.js) and their own sheets, so a pack never repeats or rewrites a lesson.

   A pack is one subject, one nation and one level band. Its sessions are that band's ready lessons in
   teaching order: Scotland follows the Curriculum for Excellence levels (with the draft Know, Do,
   Understand strands named where they're known) and the SQA courses for S4 to S6; England follows the
   2014 national curriculum by year band, and the GCSE climbs for Years 10 and 11.

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
      : ["^lesson-england-english-climb-(e1-|start|what|my-next)", "^lesson-england-english-climb-e2-", "^lesson-england-english-climb-(e3-|lit-)"];
    add("england", subject, "gcse-1", `${g}: grade 1 to 3`, "Years 10 and 11, or a resit", { climb: re[0] }, { age: "older", exam: true, perWeek: 2 });
    add("england", subject, "gcse-2", `${g}: grades 4 and 5`, "Years 10 and 11, or a resit", { climb: re[1] }, { age: "older", exam: true, perWeek: 2 });
    add("england", subject, "gcse-3", `${g}: grades 6 to 9${word === "Maths" ? " (Higher)" : " and Literature"}`, "Years 10 and 11", { climb: re[2] }, { age: "older", exam: true, perWeek: 2 });
  });

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
  // The mistake to watch for in each lesson, and what to say when you see it. Matched against the
  // lesson's title (its strand's list first, then any subject's general ones); the first match wins,
  // and each strand ends with a catch-all, so every lesson has one
  const SLIPS = {
    any: [
      [/start here|baseline|check and plan/, "Doing the starting check with help, or looking answers up. Then the plan starts in the wrong place and the easy sessions get skipped.", "Do it on your own, and leave out anything you can't do. The gaps show us where to start."],
      [/mini papers|what the exam expects|exam technique|what national 5 expects/, "Writing only the final answer. A wrong answer with no working gets nothing, but the right first step often earns a mark.", "Where's your working? Which step of that would get a mark?"],
      [/my next step/, "Choosing the topic they like best, not the one their last results point to.", "Which topic lost you the most marks last time? Start there."]
    ],
    Maths: {
      "Number": [
        [/roman/, "Adding every letter, even when a smaller one comes first (IV is 4, not 6).", "Is the smaller letter before the bigger one? Then take it away."],
        [/odd and even/, "Looking at the first digit to decide (34 isn't odd just because 3 is).", "Which digit tells you if a number is odd or even? Look at the ones."],
        [/estimate, then count|counting|count|seeing how many|more, fewer|before, after/, "Missing an object, counting one twice, or saying the numbers faster than they touch the objects.", "Touch each one and move it to the side as you say its number."],
        [/complex numbers|de moivre/, "Multiplying the arguments in polar form instead of adding them, or forgetting that i² = −1.", "When you multiply, what happens to the lengths, and what happens to the angles?"],
        [/proof/, "Trying a few numbers and calling that a proof.", "Does it work for every number? How would you show it using n?"],
        [/surds|indices|powers|standard form|scientific notation|roots/, "Multiplying the powers instead of adding them (a² × a³ written as a⁶), or reading 3² as 3 × 2.", "Write it out in full. How many a's are there altogether?"],
        [/bounds|limits of accuracy|tolerance|significant figures, tolerance/, "Taking the upper bound of 7 (to the nearest whole number) as 7.4 instead of 7.5, or using the wrong bound when dividing.", "What's the biggest number that would still round to this?"],
        [/ratio|proportion|best buys/, "Treating 3 : 2 as 3 out of 2, instead of 3 parts out of 5, or adding when the amounts should be multiplied.", "How many parts are there altogether? What is one part worth?"],
        [/negative/, "Thinking −8 is bigger than −3, or that two minus signs always make a plus (−3 − 2 is −5, not −1).", "Which is colder, −8 °C or −3 °C? Show me on a number line."],
        [/round|significant/, "Looking at the wrong digit, or rounding a 5 down.", "Which two numbers is it between? Which one is it nearer to?"],
        [/order of operations|multi-step|two-step|without a calculator|calculating/, "Working from left to right whatever the signs (2 + 3 × 4 = 20), or stopping after the first step of a two-step problem.", "Which part comes first? Read the question again: have you answered what it asks?"],
        [/factor|multiple|prime/, "Mixing up factors and multiples, or thinking 1, or every odd number, is prime.", "Does it divide into the number exactly, or is it in the number's times table?"],
        [/multipl|divi|times table|sharing|grouping|×/, "Forgetting the zero when multiplying by a ten (23 × 40 is 920, not 92), or dividing the smaller number by the larger.", "Estimate first. About how big should the answer be?"],
        [/decimal/, "Thinking a longer decimal is bigger (0.25 more than 0.3), or not lining up the decimal points.", "How many tenths are there in each?"],
        [/add|subtract|taking away|bonds|doubles|splitting|in your head/, "Counting the first number again when counting on (4 + 3 = 6), or forgetting to carry or exchange.", "Which number do you start from? Do you count that one?"],
        [/place value|millions|numbers to|three-digit|digits|in words|made of|numbers in|roman/, "Reading the digit, not what it's worth (the 3 in 352 is worth 300), or leaving out a zero (four hundred and nine written as 49).", "What is this digit worth? Is every column filled, even with a 0?"],
        [/careers|inventions|research|mathematician|life, work/, "Copying facts out without showing where the maths actually is.", "Show me one calculation that this job, or this person, really uses."],
        [/./, "Rushing to an answer and not checking it.", "Does your answer make sense? How could you check it?"]
      ],
      "Fractions, decimals and percentages": [
        [/growth|decay|compound|depreciat|appreciat|iteration|interest/, "Adding the same amount every year (simple interest) when it should be compound, so each year's change is worked out on the new amount.", "Does the amount added each year stay the same or grow? What do you multiply by each year?"],
        [/reverse|percentage change|percent/, "Taking the percentage of the new amount in a reverse percentage question, or dividing by the wrong number for a percentage change (it's change ÷ original).", "Which amount is 100% here? Which number came first?"],
        [/ratio|proportion/, "Treating 3 : 2 as 3 out of 2, instead of 3 parts out of 5, or adding when the amounts should be multiplied.", "How many parts are there altogether? What is one part worth?"],
        [/surds|exact/, "Rounding too early, so the answer is a little out, or writing √12 as 6.", "Can you leave it exact, as a fraction, a surd or with π, until the very end?"],
        [/sharing|halves/, "Making 'halves' that aren't the same size.", "Are the two parts exactly the same? How could you check?"],
        [/decimal/, "Thinking a longer decimal is bigger (0.25 more than 0.3), or not lining up the decimal points.", "How many tenths are there in each?"],
        [/./, "Adding the tops and the bottoms (½ + ⅓ written as 2/5), or thinking a bigger bottom number means a bigger fraction.", "Are the pieces the same size? Draw them both and look."]
      ],
      "Money": [
        [/credit|debt|financial products/, "Comparing the monthly payment and not the total paid back, so the dearest deal looks cheapest.", "How much is paid back altogether? Which deal costs least in the end?"],
        [/earnings|net pay/, "Taking tax off the whole pay, not just the part above the tax-free allowance.", "Which part of the pay is taxed? Which part isn't?"],
        [/best value|budget|profit/, "Comparing prices for different amounts, or working out profit as the selling price.", "How much for one? Profit is what's left after paying what it cost."],
        [/./, "Counting every coin as one whatever it's worth, or mixing pounds and pence (writing £1.5 for £1.50).", "How much is this coin worth? Write it in pence, then in pounds."]
      ],
      "Time": [
        [/time zones|timetables|12- and 24|durations|how long|calendars|speed/, "Treating time like ordinary numbers: 1:50 and 20 minutes isn't 1:70, and 1.5 hours is 1 hour 30 minutes, not 1 hour 50.", "How many minutes in an hour? Count on to the next hour first."],
        [/./, "Mixing up the hour hand and the minute hand.", "Which hand is shorter? Where is that one pointing?"]
      ],
      "Measurement": [
        [/speed|density|pressure|compound units|rates/, "Dividing the wrong way round, or mixing minutes and hours (20 minutes is a third of an hour, not 0.2).", "What units should the answer have? Does your sum give those?"],
        [/arcs|sectors|cones|spheres/, "Using the whole circle's formula and forgetting the fraction of the circle (the angle ÷ 360).", "What fraction of the whole circle is this?"],
        [/volume|surface area|prisms|cylinders|3d|materials/, "Adding only the faces you can see, or giving a volume in cm² instead of cm³.", "How many faces does it really have? Which unit goes with volume?"],
        [/circle/, "Mixing up radius and diameter, or area and circumference.", "Is it the distance round, or the space inside? Have you got the radius or the diameter?"],
        [/perimeter|area/, "Mixing up perimeter (the distance round) and area (the space inside), or adding the sides to get an area.", "Are we going round the edge, or filling the inside?"],
        [/time|units|convert|imperial|metric|measur|longer|heavier|comparing|scales|jugs/, "Starting the ruler at 1 instead of 0, or multiplying when changing to a bigger unit (cm to m means fewer, bigger units, so divide).", "Bigger units or smaller ones? So will there be more of them, or fewer?"],
        [/./, "Reading a scale as going up in ones when it doesn't.", "What does each mark on this scale stand for?"]
      ],
      "Shape and angles": [
        [/circle theorems|circle angle/, "Using a fact without saying which one, or halving the angle at the centre when it should be doubled.", "Which circle fact is it? Say the reason as well as the angle."],
        [/the circle\b/, "Taking the radius as the number on the right, not its square root, or getting the signs of the centre wrong ((x − 3)² means the centre is at x = 3).", "What is r²? So what is r?"],
        [/sine rule|cosine rule|any triangle|3d trig|addition and double|wave function/, "Using the cosine rule when the sine rule would do, or having the calculator in radians.", "Do you know a side and the angle opposite it? Is the calculator showing D or DEG?"],
        [/radians|trigonometric|trig.*graphs|exact values/, "Giving only the calculator's angle, and missing the other answer in the range.", "Sketch the graph. Where else does it reach this value?"],
        [/pythagoras/, "Adding the squares to find a shorter side (you subtract), or forgetting the square root at the end.", "Is the side you want the longest one? Then add. If not, subtract."],
        [/trigonometry|trig/, "Labelling opposite and adjacent from the wrong angle, or having the calculator in radians.", "Which angle are we using? Which side is opposite it?"],
        [/circle/, "Mixing up radius and diameter, or area and circumference.", "Is it the distance round, or the space inside? Have you got the radius or the diameter?"],
        [/matrices/, "Multiplying matrices square by square, or thinking AB is the same as BA.", "Row times column: which row and which column make this number?"],
        [/vector/, "Going the wrong way along a vector: B to A is minus the vector from A to B.", "Which way are you travelling? Does the arrow go that way?"],
        [/similar|enlargement|congruen/, "Adding the difference instead of multiplying by the scale factor, or using the length scale factor for areas.", "How many times bigger is it? For area, what do you do to that number?"],
        [/bearings/, "Measuring from the wrong point or anticlockwise, or writing 45° instead of 045°.", "Where's north? Which way do you turn, and from which point?"],
        [/turns|right angles/, "Turning the wrong way, or mixing up a quarter turn and a half turn.", "Which way do the clock's hands go? How many quarter turns make a whole one?"],
        [/coordinates|grid references|compass|position/, "Going up before along: (3, 5) means 3 along and 5 up.", "Along the corridor, then up the stairs: which comes first?"],
        [/symmetry|reflect|translat|transformation|rotat/, "Sliding the shape instead of flipping it, or putting the image the wrong distance from the mirror line.", "How far is this corner from the mirror line? Its reflection must be just as far on the other side."],
        [/angle|turns/, "Reading the wrong scale on the protractor, or using 360° for angles on a straight line (it's 180°).", "Is it more or less than a right angle? Does your answer agree?"],
        [/./, "Thinking a turned square isn't a square any more, or counting only the faces you can see.", "What stays the same when it turns? What makes it that shape?"]
      ],
      "Patterns and missing numbers": [
        [/differential/, "Forgetting the + c, or finding the constants before the particular part has been added.", "Where does the + c go? When do you use the starting values?"],
        [/integration|integral/, "Leaving out + c, or forgetting to divide by the number in front of x.", "Differentiate your answer: do you get back to what you started with?"],
        [/implicit|parametric/, "Forgetting dy/dx when differentiating a y term (y² becomes 2y dy/dx).", "Which terms have a y in them? What does each one need?"],
        [/real-life graphs/, "Reading the gradient as just 'how high the graph is', or forgetting the units of a rate.", "What does one square across and one square up stand for here?"],
        [/differentiat|stationary|optimisation|rates of change/, "Forgetting to set the derivative to zero for a turning point, or not checking whether it's a maximum or a minimum.", "What is the gradient at a turning point? How will you know which kind it is?"],
        [/maclaurin|series/, "Losing a factorial or a sign in one term, or stopping before the term the question asks for.", "Write the general term first. Which term does the question want?"],
        [/partial fractions|binomial/, "Using the wrong form for a repeated factor, or dropping the minus signs in an expansion.", "Write out the form first. How many fractions does (x − 1)² need?"],
        [/gaussian|systems of equations/, "One arithmetic slip in a row operation, which spoils every step after it.", "Put your answers back into all three of the original equations."],
        [/logarithm|exponential/, "Thinking log(a + b) = log a + log b.", "Is it the log of a product, or the log of a sum? Which law fits?"],
        [/recurrence/, "Using the limit formula when the multiplier isn't between −1 and 1.", "Does a limit exist here? How do you know?"],
        [/polynomial|factor theorem/, "Leaving out a missing power in synthetic division (x³ − 2x + 1 has 0x²).", "Is every power of x there? Where does the 0 go?"],
        [/asymptote|odd and even/, "Drawing the curve crossing a vertical asymptote, or checking only one value for odd or even.", "What happens to y as x gets close to this value? What is f(−x)?"],
        [/composite|inverse|functions/, "Doing f(g(x)) in the wrong order: g comes first.", "Which function happens first? Put the number into that one."],
        [/transformations|graphs of functions/, "Moving the graph the wrong way: f(x + 2) moves it 2 to the left, not the right.", "Which x gives the old value now?"],
        [/perpendicular|straight|gradient|coordinates/, "Working out the gradient as across ÷ up instead of up ÷ across, or mixing up m and c in y = mx + c.", "How far up (or down) for each one along?"],
        [/simultaneous/, "Adding the equations when they should be subtracted (or the other way round), so the letter doesn't vanish.", "Which letter will vanish? Same signs: subtract. Different signs: add."],
        [/algebraic fractions/, "Cancelling parts of a sum: (x + 2) ÷ 2 isn't x + 1.", "Is it a factor of the whole top and the whole bottom?"],
        [/quadratic|completing the square/, "Losing a solution (x² = 9 gives x = 3 and x = −3), or getting the signs in the brackets wrong.", "Multiply your brackets out again. Do you get back where you started?"],
        [/inequ/, "Forgetting to turn the sign round when multiplying or dividing by a negative number.", "Pick a number in your answer and try it in the question. Does it work?"],
        [/sequence|nth term|pattern|counting in|square, triangular|steps/, "Using only the gap as the rule: for 5, 8, 11 the nth term is 3n + 2, not n + 3.", "What does your rule give for the 1st term? Does it match?"],
        [/expand|factoris|brackets|simplif|expressions|notation/, "Multiplying only the first term in the bracket (3(x + 2) written as 3x + 2), or adding unlike terms (2x + 3 written as 5x).", "Has everything inside the bracket been multiplied?"],
        [/graph/, "Reading each square as 1 when the scale goes up in 2s, 5s or 10s.", "What does one square on this axis stand for?"],
        [/./, "Doing the same thing instead of the opposite to undo it (adding 5 to both sides when the equation already adds 5).", "What has been done to the letter? How do you undo that?"]
      ],
      "Data and chance": [
        [/histogram|cumulative|box plot/, "Reading a histogram's bar height as the frequency (it's the area), or reading the median off the wrong axis.", "What does the area of a bar stand for? Where's halfway on the cumulative frequency?"],
        [/conditional|tree|venn|combined|set notation|sets of/, "Adding along the branches instead of multiplying, or forgetting that the second fraction changes when nothing is put back.", "Is it this AND that (multiply), or this OR that (add)?"],
        [/probab|chance|how likely|expectation|risk/, "Thinking past results change the next one (after three heads, tails is 'due'), or giving a probability bigger than 1.", "What are all the things that could happen? Are they equally likely?"],
        [/average|mean|median|spread|grouped|distribution|comparing data|statistics/, "Mixing up the mean, median and mode, or forgetting to put the numbers in order before finding the median.", "Which average does it ask for? Are they in order?"],
        [/./, "Misreading the scale, or saying a link between two things (correlation) proves one causes the other.", "What does each square or mark stand for? Could something else explain the link?"]
      ]
    },
    Literacy: {
      "Reading: phonics and tricky words": [
        [/tricky|exception/, "Trying to sound out every letter of a tricky word (s-a-i-d).", "Which part is the tricky bit? Say the word, then look at that part."],
        [/fluent|aloud|expression/, "Reading word by word, flat, or carrying on past full stops.", "Listen to me read it, then you try. Where does your voice stop?"],
        [/./, "Saying letter names instead of sounds, or guessing a word from its first letter or the picture.", "Say each sound, then push them together. Does that make a word you know?"]
      ],
      "Listening and sounds": [
        [/rhyme/, "Thinking words that start the same rhyme (cat and cup).", "Listen to the ends: c-at, h-at. Do they end the same way?"],
        [/./, "Hearing the first sound and missing the middle or the end.", "Say it slowly with me. What sound comes next?"]
      ],
      "Spelling": [
        [/homophone|confused words/, "Using the wrong one of words that sound the same (their, there, they're).", "Which one is it here? Can you swap in 'they are' or 'over there' to check?"],
        [/-ing|endings|plurals/, "Adding an ending without changing the word first (hopeing for hoping, runing for running).", "Is the vowel before it short or long? Does the word end in e?"],
        [/prefix|suffix|roots|morphology/, "Changing the root word when adding a prefix (mispell for misspell), or not using the root to work out the spelling.", "What's the root word? Write that first, then add the start or the ending."],
        [/soft c|silent/, "Using c or g with the hard sound before e, i or y, or leaving out silent letters (nock for knock).", "Which letter comes after the c? Is there a letter you can't hear?"],
        [/alphabet/, "Mixing up a letter's name with its sound, or b and d.", "What's the name of this letter? What sound does it make?"],
        [/./, "Writing a sound with its most common spelling every time (rane for rain), or missing a sound out.", "Say it slowly. Which sound is it, and which spelling of that sound does this word use?"]
      ],
      "Writing: dictation": [
        [/./, "Missing a word or a sound, or forgetting the capital letter and full stop.", "Read it back, pointing at each word. Is every word there? Where does it start and stop?"]
      ],
      "Handwriting": [
        [/./, "Starting letters in the wrong place, or making tall and short letters the same height.", "Where does this letter start? Which letters go up tall?"]
      ],
      "Writing: sentences and punctuation": [
        [/apostrophe|commas|speech marks|punctuation for|; :/, "Joining two sentences with a comma (a comma splice), or putting an apostrophe in a plain plural (apple's for apples).", "Is that two sentences? Does anything belong to anyone here?"],
        [/edit|proof|revis|checking/, "Reading what they meant to write, not what's on the page, so slips stay in.", "Read it aloud slowly, pointing at each word as you go."],
        [/./, "Sentences that run on with 'and then… and then…', or changing tense halfway through.", "Read it aloud. Where does your voice stop? Is it all in the past?"]
      ],
      "Writing: creating texts": [
        [/dissertation/, "Retelling the texts instead of arguing an answer to the question.", "What's your argument, in one sentence?"],
        [/discursive|argu|persua|rhetoric|opinion/, "Making points with no reasons or evidence, or forgetting who the reader is.", "Who are you trying to convince? Why should they believe this?"],
        [/essay|literature|textual analysis|critical/, "Retelling the story instead of answering the question, or dropping in quotations without explaining them.", "How does this quotation answer the question? What does it show?"],
        [/sources|referenc|notes/, "Copying from a source word for word, or not saying where it came from.", "Can you say that in your own words? Where did you find it?"],
        [/inform|report|explain|letters|articles|speeches|layout|information/, "Forgetting the reader: no clear opening, and facts in a muddle.", "What will the reader want to know first? Which facts go together?"],
        [/paragraph|linking/, "One long block of writing, or a new paragraph for every sentence.", "What's this part about? When does the topic, time or place change?"],
        [/./, "Telling everything that happens ('and then…') instead of showing one moment in detail.", "Pick one moment. What could you see, hear and feel just then?"]
      ],
      "Listening and talking": [
        [/listen|notes|commenting|evaluating/, "Writing down everything word for word and missing the main idea.", "What was it mostly about? Tell me in one sentence."],
        [/./, "Talking too fast or looking down, or not building on what someone else said.", "Who are you talking to? What did they just say that you can add to?"]
      ],
      "Reading: understanding stories": [
        [/choosing/, "Giving 'it was good' as the reason, with nothing from the book to back it up.", "Which part made you think that? What would you tell a friend about it?"],
        [/traditional tales|retelling/, "Retelling the events out of order, or leaving out the middle.", "What happened first? Then what? How did it end?"],
        [/words and what they mean/, "Guessing what a word means from how it looks, not from the sentence around it.", "Read the sentence again. What word could go there instead?"],
        [/scottish text|studied|novel|shakespeare|10-mark|character, setting|myths/, "Retelling the story instead of answering the question, or quoting without explaining.", "How does that part answer the question? What does it show?"],
        [/own words|understanding|main ideas|finding|summar|summing|synthes|notes|skimming/, "Copying whole phrases from the text instead of using their own words, or giving details that don't answer the question.", "Can you say that without using the writer's words?"],
        [/word choice|words|imagery|language|analys|close reading|perceptive|sentence structure/, "Naming a technique ('it's a metaphor') without saying what it suggests.", "What does that word make you picture or feel? Why that word and not a plainer one?"],
        [/tone|stance|register/, "Naming the tone with a vague word like 'good' or 'emotional'.", "If the writer read it aloud, how would they sound? Which words tell you?"],
        [/structure|openings|link/, "Saying where something happens in the text without saying why the writer put it there.", "Why put this here? What does it change for the reader?"],
        [/evaluat|effectiveness/, "Agreeing with the statement without showing how the writer creates the effect.", "How does the writer make that happen? Show me the words."],
        [/compar|viewpoints|perspectives/, "Writing about one text and then the other, with no links between them.", "How is this one the same as the other, or different?"],
        [/inference|between the lines|evidence|bias|fact|persua|credib/, "Saying what the text says outright and calling it an inference, or giving an opinion with no quotation to back it.", "How do you know? Which words made you think that?"],
        [/./, "Answering from memory or the pictures, not from the text.", "Where in the text does it say that? Show me."]
      ]
    }
  };
  const slipFor = l => {
    const key = String(l.title).toLowerCase(), subj = SLIPS[l.subject] || {};
    const hit = [...SLIPS.any, ...(subj[l.strand] || [])].find(([re]) => re.test(key));
    return hit ? { slip: hit[1], ask: hit[2] } : null;
  };
  return { PACKS: P, get: id => P.find(p => p.id === id) || null, STUCK, NEED, NEED_OLDER, WORDS, SLIPS, slipFor };
})();
