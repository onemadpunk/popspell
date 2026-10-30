/*
  READY LESSONS — a lesson for every area of the Curriculum for Excellence literacy and numeracy
  benchmarks, at Early, First and Second level, so a tutor can support any gap straight away.

  Each lesson is built from the official guidance only (Education Scotland's Experiences and
  Outcomes and Benchmarks, June 2017): the success criteria are the benchmark statements for that
  area, in "I can" form. A lesson is about 30 minutes: start (5), teach (10), practise (10),
  check (5). It links to PopSpell's online work and printable sheets where they fit ("use"), and
  ends with something to do at home.

    level     Early | First | Second
    subject   Literacy | Maths
    strand    the library strand it appears under
    codes     the Experiences and Outcomes it covers
    use       PopSpell activity or spelling list ids for the practice
*/
window.PopLessons = (() => {
  "use strict";
  const lessons = [];
  const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  function add(level, subject, strand, codes, title, intention, criteria, steps, use = [], home = "", vocab = "") {
    let id = `lesson-${level.toLowerCase()}-${slug(title)}`;
    while (lessons.some(l => l.id === id)) id += "-2";
    lessons.push({ id, level, subject, strand, codes, title, intention, criteria, steps, use, home, vocab });
  }
  const M = "Maths", L = "Literacy";
  const NUM = "Number", FDP = "Fractions, decimals and percentages", MONEY = "Money", TIME = "Time",
    MEAS = "Measurement", DATA = "Data and chance", SHAPE = "Shape and angles", PAT = "Patterns and missing numbers";
  const SPELL = "Spelling", PHON = "Reading: phonics and tricky words", READ = "Reading: understanding stories",
    WRITE = "Writing: sentences and punctuation", DICT = "Writing: dictation", CREATE = "Writing: creating texts",
    HAND = "Handwriting", LISTEN = "Listening and sounds", TALK = "Listening and talking";

  /* ===================== Numeracy and mathematics: Early level ===================== */

  add("Early", M, NUM, ["MNU 0-01a"], "Estimate, then count",
    "We are learning to estimate how many, then count to check.",
    ["I can say how many are in a small group without counting.", "I can estimate how many, then count to check.", "I can use the words more than, less than and the same."],
    { start: "Flash a dice pattern or a few counters for two seconds. How many? How did you know without counting?",
      teach: "Put up to 20 objects in a clear tub. Ask for an estimate, then count together, touching and moving each one. Compare: was it more than, less than or the same as the guess?",
      practise: "Play the firefly game: say how many lit up without counting.",
      check: "Scatter 4 or 5 counters, cover after two seconds: how many? Then estimate a bigger group and check by counting." },
    ["g-canopy-flash"], "Guess how many grapes, pegs or spoons, then count to check.", "estimate, guess, count, more than, less than, the same");

  add("Early", M, NUM, ["MNU 0-02a"], "Counting to 20 and beyond",
    "We are learning to count objects and say the number sequence forwards and backwards.",
    ["I can count forwards to 30 from any number.", "I can count backwards from 20.", "I can touch and count objects to 20, and the last number tells me how many.", "I know zero means none."],
    { start: "Count forwards together from 0 to 30, then start from a different number (7, 12, 18).",
      teach: "Count a set of up to 20 objects, touching and moving each one. Ask: how many altogether? Show that counting in a different order gives the same total. Count back from 20 to 0, and talk about 0 meaning none.",
      practise: "Build the bridge in the Counting Canopy, counting each piece.",
      check: "Give a pile of 14 objects: count them. Then count back from 15." },
    ["g-canopy-make"], "Count stairs, steps or socks together, forwards and backwards.", "count, how many, altogether, zero, none, forwards, backwards");

  add("Early", M, NUM, ["MNU 0-02a"], "Before, after and in between",
    "We are learning to read, order and find numbers to 20.",
    ["I can recognise numbers from 0 to 20.", "I can say the number before, after and in between.", "I can put numbers to 20 in order and find missing numbers.", "I can use first, second and third."],
    { start: "Hold up number cards 0–20 in a muddle. Which do you know?",
      teach: "Peg numbers on a line to 20. Hide one: which is missing? Ask: what comes after 9? before 14? between 11 and 13? Line toys up and use first, second, third.",
      practise: "Bigger or smaller: compare two numbers.",
      check: "Give five number cards to put in order, then ask for the number before and after one of them." },
    ["n-compare"], "Find house or bus numbers: what comes before and after?", "before, after, between, first, second, third, order");

  add("Early", M, NUM, ["MNU 0-03a"], "Adding and taking away within 10",
    "We are learning to add and take away by counting on and back.",
    ["I can count on to add and count back to take away.", "I can use the signs +, − and =.", "I can add and take away in my head to 10.", "I can solve a simple missing number problem."],
    { start: "Five frame flash: show 3, add 2 more. How many now?",
      teach: "Use counters and a ten frame. Model 4 + 3 by counting on from 4. Model 7 − 2 by counting back. Write each as a number sentence with + − =. Try 5 + ? = 8 with counters hidden under a cup.",
      practise: "Adding within 10, then Taking away within 10.",
      check: "Ask 6 + 3, 9 − 4 and 2 + ? = 7, with counters if needed." },
    ["n-add-10", "n-sub-10"], "Make up number stories with toys: 3 cars park, 2 more arrive.", "add, plus, take away, minus, equals, makes, how many left");

  add("Early", M, NUM, ["MNU 0-03a"], "Doubles and splitting numbers to 10",
    "We are learning that numbers can be split into parts, and to double.",
    ["I can split 10 into two parts in different ways.", "I can double numbers to make up to 10.", "I know the total stays the same when I move the parts."],
    { start: "Show 5 fingers on one hand and 2 on the other: how many? Do it with different numbers.",
      teach: "Take 10 counters and split them into two groups in every way you can (7 and 3, 6 and 4…). Record them. Then use a mirror or both hands to double 1 to 5.",
      practise: "Hidden fireflies: work out how many are hiding.",
      check: "Ask: 10 is 6 and how many? What is double 4?" },
    ["g-canopy-hidden", "n-bonds-10"], "Share 10 pasta pieces between two plates in different ways.", "double, split, part, whole, altogether");

  add("Early", M, FDP, ["MNU 0-07a"], "Sharing equally and halves",
    "We are learning to share equally and find half.",
    ["I can share a group of things out equally.", "I can split a whole into parts and know equal parts are the same size.", "I can find half of a shape or a group."],
    { start: "Two teddies want to share 6 sweets. Is it fair if one gets 4?",
      teach: "Share objects one at a time onto two plates. Fold a paper shape in half and check the parts match. Show a sandwich cut fairly and unfairly: which is halves?",
      practise: "Share sets of 4, 6, 8 and 10 between two, then between three or four.",
      check: "Show a shape cut into two unequal pieces: is it halves? Why not?" },
    [], "Cut toast or fruit in half at snack time: are the halves the same size?", "share, equal, fair, half, halves, whole");

  add("Early", M, MONEY, ["MNU 0-09a"], "Coins and paying up to 10p",
    "We are learning to know our coins and pay for things up to 10p.",
    ["I can name all the coins to £2.", "I can pay the exact amount up to 10p using 1p, 2p, 5p and 10p coins.", "I can say if I have given too much, not enough or the right amount."],
    { start: "Tip out real or toy coins. Sort them. Which do you know?",
      teach: "Name each coin up to £2. Set up a shop with prices up to 10p. Show paying 7p as 5p and 2p, or seven 1p coins. Talk about giving too much and getting change.",
      practise: "Counting money: add up the coins.",
      check: "Price a toy at 8p: pay for it two different ways." },
    ["n-money"], "Let your child pay for something small and talk about the coins.", "coin, pence, pound, pay, price, change, enough");

  add("Early", M, TIME, ["MNU 0-10a"], "Days, routines and o'clock",
    "We are learning about the order of our day, the days of the week and o'clock.",
    ["I can put the events of my day in order.", "I can say the days of the week in order and know the months and seasons.", "I can read o'clock times on a clock and a digital display.", "I know the hour hand and the minute hand."],
    { start: "What did you do first today? What happens next? What happens at night?",
      teach: "Order picture cards of a day (wake up, breakfast, school, tea, bed). Say the days of the week and talk about the seasons. On a clock, show the minute hand pointing to 12 for o'clock and move the hour hand.",
      practise: "Telling the time: the o'clock questions.",
      check: "Set 3 o'clock on a clock: what time is it? What day comes after Tuesday?" },
    ["n-time"], "Point out o'clock times at home and talk about tomorrow's day.", "o'clock, hour hand, minute hand, morning, afternoon, night, days, months, seasons");

  add("Early", M, MEAS, ["MNU 0-11a"], "Longer, heavier and holds more",
    "We are learning to compare sizes and measure with everyday things.",
    ["I can compare length, height, weight and how much things hold.", "I can use longer, shorter, taller, heavier, lighter, more and less.", "I can estimate and then measure with things like cubes or hand spans."],
    { start: "Which is taller, you or the door? Which is heavier, a book or a feather?",
      teach: "Compare two pencils (longer/shorter), two bags (heavier/lighter using hands as a balance), and two cups of water (holds more/less). Estimate how many cubes long a book is, then measure.",
      practise: "Measure three objects in cubes or hand spans and put them in order.",
      check: "Give two objects: which is longer? How many cubes long is it?" },
    [], "Baking: talk about full, empty, more and less when measuring.", "long, short, tall, heavy, light, full, empty, more, less, measure");

  add("Early", M, PAT, ["MTH 0-13a"], "Copying and continuing patterns",
    "We are learning to copy, continue and make patterns.",
    ["I can copy and continue a pattern with objects, shapes or numbers.", "I can make my own pattern.", "I can find missing numbers on a number line to 20."],
    { start: "Clap–stamp–clap–stamp: what comes next?",
      teach: "Make a red–blue–red–blue bead pattern. Continue it, then make AAB patterns. Count in ones along a number line and find gaps.",
      practise: "Number patterns: find the next number.",
      check: "Show a pattern with a gap: what is missing?" },
    ["m-patterns"], "Spot patterns on clothes, tiles and fences.", "pattern, repeat, next, missing");

  add("Early", M, SHAPE, ["MTH 0-16a"], "Sorting 2D shapes and 3D objects",
    "We are learning to name, describe and sort shapes.",
    ["I can name common 2D shapes and 3D objects.", "I can describe them as straight, round, flat or curved.", "I can sort shapes in different ways."],
    { start: "Feely bag: describe a shape you can feel without looking.",
      teach: "Name circle, square, triangle, rectangle; cube, sphere, cone, cylinder. Sort them: flat or not, rolls or not, straight or curved sides.",
      practise: "2D shapes: name the shape and count the sides.",
      check: "Give three shapes to name and say one thing about each." },
    ["m-shapes-2d"], "Go on a shape hunt in the kitchen or on a walk.", "circle, square, triangle, rectangle, cube, sphere, cone, cylinder, flat, curved");

  add("Early", M, SHAPE, ["MTH 0-17a", "MTH 0-19a"], "Position, direction and symmetry",
    "We are learning words for position and direction, and to make symmetrical pictures.",
    ["I can use in front, behind, above, below, left, right, forwards and backwards.", "I can follow and give simple directions.", "I can make a picture with one line of symmetry."],
    { start: "Simon says: put your hand above your head, behind your back.",
      teach: "Hide a toy and give directions to find it. Fold paper, paint on one side and press to make a symmetrical butterfly.",
      practise: "Give the pupil directions to move a toy on a grid, then swap roles.",
      check: "Where is the cup? (in front of / behind the book). Is this picture the same on both sides?" },
    [], "Play a hide-and-seek game giving directions.", "in front, behind, above, below, left, right, forwards, backwards, symmetry");

  add("Early", M, DATA, ["MNU 0-20a", "MNU 0-20b", "MNU 0-20c"], "Sorting and simple charts",
    "We are learning to sort things and show what we found.",
    ["I can sort objects by colour, shape or size.", "I can ask a question and collect answers.", "I can make a picture chart where one picture is one thing.", "I can answer questions about a simple chart."],
    { start: "Sort a pile of buttons or toys: how did you sort them?",
      teach: "Ask family members their favourite fruit. Show each answer with one picture. Which has most? Least? Count tally marks in fives.",
      practise: "Tally marks: count them in fives.",
      check: "Look at a picture chart: which has the most? How many like apples?" },
    ["n-tally"], "Sort the washing or toys and count each group.", "sort, group, most, least, chart, tally");

  /* ===================== Numeracy and mathematics: First level ===================== */

  add("First", M, NUM, ["MNU 1-01a"], "Rounding to estimate",
    "We are learning to round to the nearest 10 and 100 to estimate and check answers.",
    ["I can round whole numbers to the nearest 10 and 100.", "I can use rounding or doubling to estimate an answer.", "I can check if my answer is sensible."],
    { start: "Is 48 nearer 40 or 50? Show it on a number line.",
      teach: "Use a number line to round 2-digit numbers to 10, then 3-digit numbers to 100. Model estimating 38 + 41 as 40 + 40, then working it out and comparing.",
      practise: "Rounding to the nearest 10.",
      check: "Round 67 and 352. Estimate 29 + 52, then check." },
    ["n-round-10", "n-round-100"], "Round prices in the shop to estimate the total.", "round, nearest, estimate, about, check, sensible");

  add("First", M, NUM, ["MNU 1-02a"], "Place value to 1000",
    "We are learning what each digit is worth in numbers to 1000.",
    ["I can read, write and order numbers to 1000.", "I know zero holds a place, as in 405.", "I can say what each digit is worth, as in 867 = 800 + 60 + 7."],
    { start: "Make 34 with tens and ones. How many tens? How many ones?",
      teach: "Use hundreds, tens and ones (blocks or place value cards) to build 3-digit numbers. Show 405 and why the zero matters. Order four 3-digit numbers.",
      practise: "Tens and ones, then Hundreds, tens and ones.",
      check: "What is the 6 worth in 263? Write 'four hundred and nine' in digits." },
    ["n-place-value", "n-hundreds"], "Read big numbers on signs and prices together.", "digit, place, value, hundreds, tens, ones, zero");

  add("First", M, PAT, ["MNU 1-02a", "MTH 1-13b"], "Counting in 2s, 5s, 10s and 100s",
    "We are learning to count forwards and backwards in steps.",
    ["I can count forwards and backwards in 2s, 5s and 10s from any number to 1000.", "I can count in 100s.", "I can spot the pattern in the steps."],
    { start: "Count in 10s from 0, then from 3 (3, 13, 23…).",
      teach: "Use a hundred square to show counting in 2s, 5s and 10s. Count back too. Count in 100s from 50.",
      practise: "Number patterns.",
      check: "Count on in 5s from 35. Count back in 2s from 20." },
    ["m-patterns"], "Count in 2s using pairs of socks or shoes.", "count on, count back, steps, pattern, multiple");

  add("First", M, NUM, ["MNU 1-02a", "MNU 1-03a"], "Adding and subtracting within 20",
    "We are learning to add and subtract quickly within 20.",
    ["I know number bonds to 10 and 20.", "I can add and subtract within 20 using what I know.", "I know addition can be done in any order, as in 6 + 3 = 3 + 6."],
    { start: "Quick-fire bonds to 10: 7 and ? make 10.",
      teach: "Use a bead string or ten frames. Show bridging through 10: 8 + 5 = 8 + 2 + 3. Show 6 + 3 = 3 + 6. Use 'I know 7 + 3 = 10, so 17 + 3 = 20'.",
      practise: "Number bonds to 20, Adding within 20, Taking away within 20.",
      check: "Ask 9 + 6, 15 − 7 and 13 + ? = 20, and how they worked it out." },
    ["n-bonds-20", "n-add-20", "n-sub-20"], "Play a quick bonds game in the car: I say 6, you say 4.", "add, subtract, sum, total, difference, bond, bridge");

  add("First", M, NUM, ["MNU 1-02a", "MNU 1-03a"], "Adding and subtracting to 1000",
    "We are learning to add and subtract 3-digit numbers.",
    ["I can add and subtract multiples of 10 and 100 to and from numbers to 1000.", "I can add and subtract 3-digit numbers.", "I can use the inverse to check."],
    { start: "What is 340 + 100? 340 + 10? 340 − 20?",
      teach: "Model partitioning: 253 + 125 = 200 + 100, 50 + 20, 3 + 5. Then a written method. Check 378 − 125 = 253 by adding back.",
      practise: "Adding and taking away bigger numbers.",
      check: "Work out 436 + 251 and 587 − 230, and check one with the inverse." },
    ["n-big-add"], "Add up two prices or two distances from a map.", "add, subtract, partition, inverse, check");

  add("First", M, NUM, ["MNU 1-02a", "MNU 1-03a"], "Multiplication facts: 2, 3, 4, 5 and 10",
    "We are learning to work out and remember multiplication facts.",
    ["I can work out multiplication facts using repeated addition, groups and arrays.", "I know 2 × 4 = 4 × 2.", "I can recall facts for the 2, 3, 4, 5 and 10 times tables."],
    { start: "Count in 5s to 50 on your fingers.",
      teach: "Build arrays with counters: 3 rows of 4. Write it as 4 + 4 + 4 and 3 × 4, then turn it to show 4 × 3. Link doubles to the 2 and 4 times tables.",
      practise: "2, 5 and 10 times tables, then 3 and 4 times tables.",
      check: "Show an array: write two multiplication facts. Ask 4 × 5 and 3 × 6." },
    ["n-tables-2-5-10", "n-tables-3-4", "n-doubles"], "Spot arrays at home: egg boxes, muffin trays, windows.", "multiply, times, groups of, lots of, array, product");

  add("First", M, NUM, ["MNU 1-02a", "MNU 1-03a"], "Division: sharing and grouping",
    "We are learning to divide by sharing and grouping.",
    ["I can divide by sharing equally and by making equal groups.", "I can use multiplication facts to divide.", "I know division undoes multiplication."],
    { start: "Share 12 counters between 3 people. How many each?",
      teach: "Show 12 ÷ 3 two ways: sharing into 3 groups, and making groups of 3. Link to 3 × 4 = 12. Try a remainder: 13 ÷ 3.",
      practise: "Division facts.",
      check: "Ask 20 ÷ 5 and 18 ÷ 2, and which times table fact helps." },
    ["n-division"], "Share snacks fairly between the family.", "divide, share, equal groups, shared equally, remainder");

  add("First", M, NUM, ["MNU 1-03a"], "Multiplying and dividing by 10 and 100",
    "We are learning to multiply and divide whole numbers by 10 and 100.",
    ["I can multiply and divide whole numbers by 10 and 100.", "I can explain how the digits move."],
    { start: "What is 10 lots of 3? 10 lots of 30?",
      teach: "Use a place value grid. Show 23 × 10 = 230: the digits move one place left. ×100 moves two places. Dividing moves them right.",
      practise: "Multiplying and dividing by 10 and 100.",
      check: "Ask 45 × 10, 6 × 100 and 700 ÷ 10." },
    ["n-x10"], "How many 10p coins make £3? How many pence in £5?", "multiply, divide, place, digit, ten times");

  add("First", M, NUM, ["MNU 1-03a"], "Solving two-step problems",
    "We are learning to choose what to do in a problem and solve it in two steps.",
    ["I can decide which calculation a problem needs.", "I can solve two-step problems.", "I can check my answer makes sense."],
    { start: "Tell a one-step story: 5 apples, 3 more. Now add a second step: then 2 are eaten.",
      teach: "Read a problem together. Underline the important numbers. Draw a bar model or picture. Decide step 1 and step 2. Check with an estimate.",
      practise: "Missing numbers and signs, then make up a two-step problem for the tutor to solve.",
      check: "Sam has 24 stickers, gets 10 more and gives away 8. How many now?" },
    ["m-equations"], "Make up shopping problems: two things, then change.", "problem, calculate, step, total, left, more, fewer");

  add("First", M, FDP, ["MNU 1-07a"], "What fractions are",
    "We are learning to name, write and compare fractions.",
    ["I can explain what a fraction is using pictures or objects.", "I know the more equal parts, the smaller each part.", "I can write fractions like ½, ⅔ and ⅝, and say what the numerator and denominator mean.", "I can compare fractions and place them on a number line."],
    { start: "Fold a paper strip in half, then quarters, then eighths. What happens to the parts?",
      teach: "Use fraction strips. Write ½, ¼, ⅛ and show which is biggest. Explain numerator (parts we have) and denominator (equal parts in the whole). Place ½ and ¼ on a 0–1 number line.",
      practise: "Halves, quarters and thirds.",
      check: "Which is bigger, ⅓ or ⅕? Show ¾ of a shape." },
    ["n-fractions"], "Cut a pizza or cake into equal parts and name the fractions.", "fraction, half, quarter, third, numerator, denominator, equal parts");

  add("First", M, FDP, ["MNU 1-07b", "MTH 1-07c"], "Fractions of amounts and equivalent fractions",
    "We are learning to find a fraction of a number and to spot fractions that are the same.",
    ["I can find a fraction of an amount using division, as in ¼ of 12.", "I can show simple equivalent fractions, as in ½ = 2/4."],
    { start: "Share 12 sweets into 4 equal groups. What is ¼ of 12?",
      teach: "Link ¼ of 20 to 20 ÷ 4. Then use fraction strips to show ½ = 2/4 = 4/8.",
      practise: "Halves, quarters and thirds, then Equivalent fractions.",
      check: "Ask ⅓ of 15 and draw a picture to show ½ = 3/6." },
    ["n-fractions", "n-equivalent"], "Find half or a quarter of a bag of pasta shapes.", "fraction of, share, equivalent, same as");

  add("First", M, MONEY, ["MNU 1-09a", "MNU 1-09b"], "Paying and change within £10",
    "We are learning to pay for things and work out change.",
    ["I know all coins and notes to £20.", "I can write amounts correctly, as in 149p = £1·49.", "I can pay for things and work out change within £10.", "I know things can be paid for with cards and phones."],
    { start: "Make £1 in three different ways with coins.",
      teach: "Write prices both ways (75p, £0·75). Total two items. Count on to find change from £5 or £10 (from £3·60: 40p makes £4, then £1 makes £5).",
      practise: "Counting money.",
      check: "A book costs £3·45. What change from £5?" },
    ["n-money"], "Let your child work out the change when you pay.", "pounds, pence, total, change, cost, note, card");

  add("First", M, TIME, ["MNU 1-10a"], "Half past, quarter past and quarter to",
    "We are learning to tell the time to the quarter hour.",
    ["I can tell half past, quarter past and quarter to on analogue and digital clocks.", "I can use am and pm.", "I know 24-hour times are used on phones and computers."],
    { start: "Show o'clock times and read them.",
      teach: "Show the clock face split into quarters. Move the minute hand: quarter past, half past, quarter to. Show the matching digital times (2:15, 2:30, 2:45). Talk about am and pm.",
      practise: "Telling the time, then Digital time.",
      check: "Set quarter to 4 on a clock. What is 7:30 on an analogue clock?" },
    ["n-time", "n-time-digital"], "Ask your child the time at quarter past, half past and quarter to.", "quarter past, half past, quarter to, am, pm, analogue, digital");

  add("First", M, TIME, ["MNU 1-10b", "MNU 1-10c"], "Calendars, dates and how long",
    "We are learning to use calendars and work out how long things take.",
    ["I can write the date in words and numbers.", "I can use a calendar to plan.", "I know seconds in a minute, minutes in an hour, hours in a day, days in each month and in a year.", "I can choose and use a timer."],
    { start: "What is today's date? Write it two ways.",
      teach: "Use a calendar to find birthdays and count days between. Learn the time facts. Use a timer: how many star jumps in 30 seconds?",
      practise: "How long? Time intervals.",
      check: "How many days in June? How many minutes in an hour? What is the date one week from today?" },
    ["n-durations"], "Put family birthdays on a calendar and count down.", "date, calendar, month, season, minute, hour, second, timer");

  add("First", M, MEAS, ["MNU 1-11a"], "Measuring with rulers, scales and jugs",
    "We are learning to estimate and measure in standard units.",
    ["I can estimate length, height, weight and capacity.", "I can measure with rulers, metre sticks, scales and jugs to the nearest unit.", "I can make simple conversions, as in 1 m 58 cm = 158 cm.", "I can read scales, including halves."],
    { start: "Estimate how long a pencil is in cm. Measure it.",
      teach: "Show starting a ruler at 0. Weigh fruit in grams, measure water in ml. Read a jug scale with ½ litre marked. Convert 1 m 20 cm to 120 cm.",
      practise: "Measuring: rulers, jugs and units.",
      check: "Measure a book in cm. Read a scale at 250 ml." },
    ["n-measure"], "Bake together, measuring grams and millilitres.", "estimate, measure, centimetre, metre, gram, kilogram, millilitre, litre, scale");

  add("First", M, MEAS, ["MNU 1-11b"], "Area by counting squares",
    "We are learning to find area by counting squares.",
    ["I can estimate and count squares to find the area of a shape, to the nearest half square.", "I can make shapes with a given area.", "I know different shapes can have the same area."],
    { start: "How many squares cover this sticky note?",
      teach: "Draw shapes on squared paper. Count whole squares, then pair up halves. Make two different shapes with an area of 6 squares.",
      practise: "Draw three shapes with an area of 8 squares on squared paper.",
      check: "Count the area of a shape with some half squares." },
    [], "Count the tiles on a floor or wall to find its area.", "area, square, cover, half square");

  add("First", M, PAT, ["MTH 1-13a", "MTH 1-13b"], "Number patterns and rules",
    "We are learning to continue number patterns and explain the rule.",
    ["I can continue and make repeating patterns with shapes and symbols.", "I can describe patterns in tables and the hundred square.", "I can continue a number sequence and say its rule."],
    { start: "2, 4, 6, 8… what comes next? What is the rule?",
      teach: "Show sequences that add, subtract, double and halve. Find the rule and the next two numbers. Colour the 5 times table on a hundred square.",
      practise: "Number patterns.",
      check: "Continue 30, 27, 24… and say the rule." },
    ["m-patterns"], "Make up a number pattern for someone at home to solve.", "pattern, sequence, rule, next, double, halve");

  add("First", M, PAT, ["MTH 1-15a", "MTH 1-15b"], "Equals, greater than and missing numbers",
    "We are learning to compare numbers and find missing numbers.",
    ["I can use =, ≠, < and > correctly.", "I know the equals sign means both sides balance.", "I can find a missing number, as in □ + 17 = 30."],
    { start: "Which is bigger, 45 or 54? Show it with < or >.",
      teach: "Use a balance picture: 8 + 2 = 5 + 5. Then □ + 6 = 15 and □ × 6 = 30, using number facts and the inverse.",
      practise: "Missing numbers and signs.",
      check: "Fill in 23 □ 32 and □ − 8 = 12." },
    ["m-equations"], "Make balance puzzles with coins.", "equals, not equal to, less than, greater than, balance, missing");

  add("First", M, SHAPE, ["MTH 1-16a", "MTH 1-16b"], "Describing 2D shapes and 3D objects",
    "We are learning to name and describe shapes and objects.",
    ["I can name and sort 2D shapes and 3D objects in any size or way round.", "I can use side, face, edge, vertex, base and angle.", "I can find 2D shapes in 3D objects.", "I can make a tiling pattern with two shapes."],
    { start: "Show a triangle upside down: is it still a triangle?",
      teach: "Count faces, edges and vertices of a cube and a cylinder. Find the 2D faces of 3D objects. Tile with squares and triangles.",
      practise: "2D shapes, then 3D objects.",
      check: "How many faces, edges and vertices on a cuboid?" },
    ["m-shapes-2d", "m-shapes-3d"], "Find cuboids, cylinders and spheres in the kitchen.", "side, face, edge, vertex, base, angle, tiling");

  add("First", M, SHAPE, ["MTH 1-17a"], "Turns, right angles and compass points",
    "We are learning to describe turns and directions.",
    ["I can describe full, half and quarter turns, clockwise and anticlockwise.", "I know a right angle is 90°.", "I can use North, South, East and West.", "I can find right angles in shapes and around me."],
    { start: "Stand up: make a quarter turn clockwise, then a half turn.",
      teach: "Make a right-angle checker by folding paper. Find right angles in the room. Mark N, S, E, W on the walls and give directions.",
      practise: "Angles and turns.",
      check: "Face North, turn a quarter turn clockwise: which way now?" },
    ["m-angles"], "Give directions on a walk: turn left, quarter turn right.", "turn, clockwise, anticlockwise, right angle, North, South, East, West");

  add("First", M, SHAPE, ["MTH 1-18a", "MTH 1-19a"], "Grid references and symmetry",
    "We are learning to use grid references and to make symmetrical designs.",
    ["I know where grid references are used.", "I can find and give two-figure grid references.", "I can find symmetry in pictures, nature and shapes.", "I can make a design with more than one line of symmetry."],
    { start: "Look at a simple map with a grid. Where is the park?",
      teach: "Draw a 5 × 5 grid with letters along and numbers up. Place items and name their squares (along the corridor, then up the stairs). Fold shapes to find lines of symmetry.",
      practise: "Play a grid hide-and-seek: hide treasure in a square and guess each other's.",
      check: "Which square is the tree in? Draw the other half of a symmetrical pattern." },
    [], "Look at a street map together and find places by their squares.", "grid, reference, along, up, symmetry, line of symmetry");

  add("First", M, DATA, ["MNU 1-20a", "MNU 1-20b", "MTH 1-21a"], "Collecting and showing data",
    "We are learning to collect, sort and show data, and answer questions about it.",
    ["I can answer questions using charts, bar graphs and tables.", "I can collect data with a survey or tally.", "I can show data in bar graphs, tables, Carroll diagrams and Venn diagrams.", "I can give a graph a title, labels and a sensible scale."],
    { start: "What is the favourite pet of people you know?",
      teach: "Collect answers with a tally. Draw a bar graph with a title, labelled axes and a scale going up in 2s. Sort numbers in a Venn diagram (even / more than 10).",
      practise: "Tally marks, then Bar charts.",
      check: "Ask three questions about a bar graph, including one about the difference between two bars." },
    ["n-tally", "n-bar"], "Do a family survey and make a chart.", "data, survey, tally, bar graph, table, axis, scale, Venn diagram, Carroll diagram");

  add("First", M, DATA, ["MNU 1-22a"], "How likely is it?",
    "We are learning to describe how likely things are.",
    ["I can use likely, unlikely, certain, uncertain, possible, impossible, fair and unfair.", "I can use what I know to predict how likely something is."],
    { start: "Will it snow tomorrow? Will the sun rise tomorrow?",
      teach: "Put events on a line from impossible to certain. Is a game with one red and five blue counters fair?",
      practise: "How likely is it?",
      check: "Give three events to place on the likelihood line, with reasons." },
    ["n-chance"], "Talk about the weather forecast: how likely is rain?", "likely, unlikely, certain, possible, impossible, fair, unfair, chance");

  add("First", M, NUM, ["MTH 1-12a"], "Numbers in life, work and history",
    "We are learning how numbers are used in the world and in the past.",
    ["I can talk about how numbers are used in learning, life and work.", "I can explore a number system from history, such as Roman numerals."],
    { start: "Where did you see numbers today?",
      teach: "List jobs that use numbers. Show Roman numerals I to XX on clocks and old buildings. Write today's day number in Roman numerals.",
      practise: "Write five numbers in Roman numerals and five jobs that use maths.",
      check: "What is XIV? Name a job that uses measuring." },
    [], "Spot Roman numerals on clocks, films or buildings.", "number system, Roman numerals");

  /* ===================== Numeracy and mathematics: Second level ===================== */

  add("Second", M, NUM, ["MNU 2-01a"], "Rounding large numbers and decimals",
    "We are learning to round to estimate and check calculations.",
    ["I can round whole numbers to the nearest 1000, 10 000 and 100 000.", "I can round decimals to the nearest whole number, 1 and 2 decimal places.", "I can estimate an answer that suits the problem."],
    { start: "Round 4 682 to the nearest 1000. How do you know?",
      teach: "Use number lines for large numbers and for decimals (3·46 → 3·5 → 3). Estimate 598 × 4 as 600 × 4. Talk about when to round up (buying enough paint).",
      practise: "Rounding to 100 and 1000, then Estimating answers.",
      check: "Round 56 349 to the nearest 10 000 and 7·286 to 2 decimal places." },
    ["n-round-100", "n-estimate"], "Estimate the shopping bill before you get to the till.", "round, nearest, estimate, decimal place, approximately");

  add("Second", M, NUM, ["MNU 2-02a"], "Place value to a million",
    "We are learning to read, write and order numbers to 1 000 000.",
    ["I can read, write and order whole numbers to 1 000 000.", "I can explain what each digit is worth.", "I can add and subtract multiples of 10, 100 and 1000."],
    { start: "Read 305 061 aloud. What is the 5 worth?",
      teach: "Use a place value chart to a million. Partition 482 350. Order five large numbers. Add 3000 to 67 400.",
      practise: "Hundreds, tens and ones, then build bigger numbers on the chart.",
      check: "Write 'two hundred and six thousand and forty' in digits." },
    ["n-hundreds"], "Read populations or prices of houses and cars.", "million, thousand, digit, value, place, partition");

  add("Second", M, FDP, ["MNU 2-02a", "MNU 2-03b"], "Decimals to three places",
    "We are learning what each digit is worth in decimals.",
    ["I can read, write and order decimals to three places.", "I can explain the value of tenths, hundredths and thousandths.", "I can partition decimals, as in 3·6 = 3 ones and 6 tenths = 36 tenths."],
    { start: "Show 0·5 and ½ on a number line. Are they the same?",
      teach: "Extend the place value chart past the decimal point. Order 0·45, 0·405 and 0·5. Partition 3·6 in different ways.",
      practise: "Decimal fractions.",
      check: "Which is larger, 0·7 or 0·65? Why?" },
    ["n-decimals"], "Compare prices and times in a race to the hundredth of a second.", "decimal point, tenths, hundredths, thousandths");

  add("Second", M, NUM, ["MNU 2-03a", "MNU 2-03b"], "Adding and subtracting large numbers and decimals",
    "We are learning to add and subtract whole numbers and decimals.",
    ["I can add and subtract whole numbers to 1 000 000.", "I can add and subtract decimals to two places.", "I can choose a mental or written method and explain it."],
    { start: "What is 4·5 + 2·7? How did you do it?",
      teach: "Model a written method lining up place values, then with decimals (lining up the point). Compare with a mental method for 3 000 − 1 998.",
      practise: "Adding and taking away bigger numbers.",
      check: "Work out 24 587 + 6 345 and 12·5 − 3·75." },
    ["n-big-add"], "Add up the receipt and check the total.", "add, subtract, method, decimal point, total, difference");

  add("Second", M, NUM, ["MNU 2-03a"], "Multiplication and division facts, and ×÷ 10, 100, 1000",
    "We are learning to use all the times tables and to multiply and divide by 10, 100 and 1000.",
    ["I can use multiplication and division facts to 10 × 10.", "I can multiply and divide whole numbers and decimals by 10, 100 and 1000."],
    { start: "Quick-fire 6, 7, 8 and 9 times tables.",
      teach: "Use known facts to work out others (7 × 8 = 7 × 4 doubled). Use a place value chart for 3·45 × 100 and 560 ÷ 1000.",
      practise: "6, 7, 8 and 9 times tables, Division facts, then Multiplying and dividing by 10 and 100.",
      check: "Ask 8 × 7, 63 ÷ 9 and 2·5 × 100." },
    ["n-tables-6-9", "n-division", "n-x10"], "Practise one times table a day, out loud, for five minutes.", "multiply, divide, product, quotient, factor");

  add("Second", M, NUM, ["MNU 2-03a", "MNU 2-03b"], "Multiplying by 2 digits and dividing with decimal answers",
    "We are learning to multiply by two-digit numbers and divide by a single digit.",
    ["I can multiply whole numbers by two-digit numbers.", "I can multiply decimals by a single digit.", "I can divide by a single digit, giving decimal answers, as in 43 ÷ 5 = 8·6."],
    { start: "What is 23 × 10? And 23 × 2?",
      teach: "Model 23 × 12 as 23 × 10 + 23 × 2, then with a grid or written method. Show 43 ÷ 5 as 8 remainder 3, then 8·6.",
      practise: "Work through a set of 6 calculations on paper, checking with estimates.",
      check: "Work out 34 × 15 and 27 ÷ 4." },
    ["n-division"], "Work out costs for several of the same item.", "multiply, product, divide, remainder, decimal");

  add("Second", M, NUM, ["MTH 2-03c"], "Order of operations",
    "We are learning the order to do calculations in.",
    ["I can apply the correct order of operations, including brackets, in multi-step calculations."],
    { start: "Is 2 + 3 × 4 equal to 20 or 14?",
      teach: "Explain the order: brackets, then multiply and divide, then add and subtract. Work through examples with and without brackets.",
      practise: "Solve 8 calculations, then write two of your own with brackets that change the answer.",
      check: "Work out (6 + 2) × 3 and 6 + 2 × 3." },
    [], "Make up number puzzles with brackets for the family.", "brackets, order of operations, multiply, divide, add, subtract");

  add("Second", M, NUM, ["MNU 2-04a"], "Negative numbers",
    "We are learning about numbers less than zero.",
    ["I can say where negative numbers are used, such as temperatures.", "I can order negative numbers and place them on a number line."],
    { start: "What happens to the temperature at night in winter?",
      teach: "Draw a vertical number line like a thermometer from −10 to 10. Count back through zero. Order −3, 2, −7, 0. Find differences in temperature.",
      practise: "Negative numbers.",
      check: "Which is colder, −4°C or −1°C? What is 3 less than 1?" },
    ["n-negative"], "Check the weather forecast for temperatures below zero.", "negative, minus, below zero, temperature, number line");

  add("Second", M, NUM, ["MTH 2-05a"], "Multiples, factors and primes",
    "We are learning to find multiples and factors.",
    ["I can find multiples and factors of whole numbers.", "I can use them to solve problems.", "I can recognise prime numbers."],
    { start: "List the first five multiples of 6.",
      teach: "Find all factors of 24 using arrays or factor pairs. Show a prime has only two factors. Use a common multiple to solve a problem (buses every 4 and 6 minutes).",
      practise: "Multiples, factors and primes.",
      check: "List the factors of 18. Is 21 prime?" },
    ["n-multiples"], "Find the factors of the house number.", "multiple, factor, factor pair, prime, common multiple");

  add("Second", M, FDP, ["MNU 2-07b"], "Fractions, decimals and percentages are linked",
    "We are learning that fractions, decimals and percentages can show the same amount.",
    ["I can show equivalent forms, as in ¾ = 0·75 = 75%.", "I can choose the easiest form for a problem and explain why."],
    { start: "What is ½ as a decimal? As a percentage?",
      teach: "Use a 100 square: shade 25 squares and write ¼, 0·25 and 25%. Build a table for ½, ¼, ¾, ⅒, ⅕.",
      practise: "Percentages, then Decimal fractions.",
      check: "Write 0·2 as a fraction and a percentage." },
    ["n-percent", "n-decimals"], "Spot percentages on food labels and sales signs.", "equivalent, fraction, decimal, percentage, per cent");

  add("Second", M, FDP, ["MNU 2-07a"], "Percentages and fractions of amounts",
    "We are learning to find fractions and percentages of amounts.",
    ["I can find simple fractions of a quantity, as in ⅗ of 60.", "I can find simple percentages of a quantity and use them, as in a 15% discount."],
    { start: "What is ½ of 80? 10% of 80?",
      teach: "Find ⅕ of 60 then ⅗ of 60. Find 10% and 5% of £40, then 15%. Work out a sale price.",
      practise: "Percentages, then Halves, quarters and thirds.",
      check: "A £30 game has 20% off. What is the sale price?" },
    ["n-percent", "n-fractions"], "Work out sale prices when shopping.", "fraction of, percentage of, discount, sale price");

  add("Second", M, FDP, ["MTH 2-07c"], "Equivalent fractions and simplest form",
    "We are learning to make equivalent fractions, simplify and order them.",
    ["I can create equivalent fractions.", "I can write a fraction in its simplest form.", "I can put common fractions in order."],
    { start: "Fold a strip: show ½ = 2/4 = 4/8.",
      teach: "Multiply or divide top and bottom by the same number. Simplify 12/16 using common factors. Order ⅔, ¾ and 5/8 using equivalent fractions.",
      practise: "Equivalent fractions.",
      check: "Simplify 15/20. Put ½, ⅖ and 3/4 in order." },
    ["n-equivalent"], "Share a pizza: is 2/8 the same as 1/4?", "equivalent, simplest form, numerator, denominator, common factor");

  add("Second", M, MONEY, ["MNU 2-09a", "MNU 2-09b", "MNU 2-09c"], "Budgets, best value, profit and loss",
    "We are learning to manage money, compare costs and work out profit and loss.",
    ["I can do money calculations with all four operations.", "I can compare costs and decide what I can afford in a budget.", "I understand the benefits and risks of bank cards and paying digitally.", "I can work out profit and loss."],
    { start: "You have £20 for a party. What would you buy?",
      teach: "Compare two pack sizes to find the better value. Plan a budget with a list of prices. Sell 20 cakes at 50p that cost £6 to make: profit or loss? Talk about card payments and keeping PINs safe.",
      practise: "Counting money, then plan a £25 budget from a price list.",
      check: "Which is better value: 6 for £1·50 or 10 for £2·20?" },
    ["n-money"], "Compare unit prices together when shopping.", "budget, afford, best value, profit, loss, bank card");

  add("Second", M, TIME, ["MNU 2-10a"], "12- and 24-hour time and timetables",
    "We are learning to use 12- and 24-hour time and read timetables.",
    ["I can read and write time in 12- and 24-hour notation and change between them.", "I can use timetables and calendars to plan and solve problems."],
    { start: "What is 3:45 pm in 24-hour time?",
      teach: "Show a 24-hour clock line from 00:00 to 23:59. Convert times both ways. Read a bus or train timetable: which bus gets there by 14:30?",
      practise: "12-hour and 24-hour time.",
      check: "Write 18:20 in 12-hour time. Which train arrives first?" },
    ["n-time-24"], "Plan a trip using a real bus or train timetable.", "24-hour, am, pm, timetable, depart, arrive");

  add("Second", M, TIME, ["MNU 2-10a", "MNU 2-10b", "MNU 2-10c"], "Durations, units of time, speed and distance",
    "We are learning to work out durations and how long journeys take.",
    ["I can convert units of time, as in 1¾ hours = 105 minutes.", "I can work out durations across hours, in 12- and 24-hour time.", "I can choose the right timer and unit, including hundredths of a second.", "I can estimate journey times using speed, distance and time."],
    { start: "How many minutes in 2½ hours?",
      teach: "Use a time line to find 10:45 to 13:20. Convert hours and minutes. If a car goes 50 km in an hour, how long for 150 km?",
      practise: "How long? Time intervals.",
      check: "A film starts at 18:50 and lasts 1 hour 45 minutes. When does it end?" },
    ["n-durations"], "Time a journey and work out how long it took.", "duration, hours, minutes, speed, distance, time");

  add("Second", M, MEAS, ["MNU 2-11a", "MNU 2-11b"], "Estimate, measure and convert metric units",
    "We are learning to estimate, measure accurately and convert units.",
    ["I can estimate using familiar objects.", "I can measure length, mass and capacity in the right units.", "I can convert between units using decimals, as in 550 cm = 5·5 m.", "I can read a range of scales accurately."],
    { start: "Estimate the height of the door in metres.",
      teach: "Measure to the nearest mm. Convert km–m–cm–mm, kg–g and l–ml using the place value chart. Read scales with different steps.",
      practise: "Changing units, then Measuring: rulers, jugs and units.",
      check: "Convert 3·009 kg to grams and 2 400 m to km." },
    ["n-units", "n-measure"], "Read food labels: how many grams? Convert to kilograms.", "millimetre, centimetre, metre, kilometre, gram, kilogram, millilitre, litre, convert");

  add("Second", M, MEAS, ["MNU 2-11b", "MNU 2-11c"], "Perimeter, area and volume",
    "We are learning to calculate perimeter, area and volume.",
    ["I can calculate the perimeter of straight-sided shapes.", "I can calculate the area of squares, rectangles and right-angled triangles.", "I can calculate the volume of cubes and cuboids.", "I can draw shapes with a given perimeter or area."],
    { start: "How could you find the distance round the table?",
      teach: "Find perimeter by adding sides. Find area of a rectangle as length × breadth, and a right-angled triangle as half of that. Build a cuboid with cubes to show length × breadth × height.",
      practise: "Area and perimeter.",
      check: "A rectangle is 7 cm by 4 cm: find its perimeter and area." },
    ["n-area"], "Measure a room and work out the area of carpet needed.", "perimeter, area, volume, square centimetre, cubic centimetre, length, breadth, height");

  add("Second", M, PAT, ["MTH 2-13a"], "Square, triangular and Fibonacci numbers",
    "We are learning to explain and use the rules for famous number sequences.",
    ["I can extend square, triangular and Fibonacci sequences and explain the rule.", "I can use multiples, square and triangular numbers to make patterns."],
    { start: "Build squares with counters: 1, 4, 9… what comes next?",
      teach: "Build square and triangular numbers with counters. Show Fibonacci (each number is the sum of the two before). Find the rule for sequences like 3, 7, 11, 15.",
      practise: "Number patterns.",
      check: "Give the next two numbers of 1, 3, 6, 10 and of 1, 1, 2, 3, 5, with the rule." },
    ["m-patterns"], "Look for Fibonacci spirals in pinecones and flowers.", "sequence, rule, square number, triangular number, Fibonacci");

  add("Second", M, PAT, ["MTH 2-15a"], "Solving simple equations",
    "We are learning to find an unknown value shown by a letter or symbol.",
    ["I can solve simple equations with one unknown, as in a − 30 = 40 and 4b = 20."],
    { start: "I'm thinking of a number. I add 8 and get 20. What's my number?",
      teach: "Use a balance: what you do to one side you do to the other. Solve a + 15 = 40, b − 30 = 40, 4c = 20 using inverse operations.",
      practise: "Missing numbers and signs.",
      check: "Solve 3n = 27 and x − 12 = 19." },
    ["m-equations"], "Play 'think of a number' puzzles.", "equation, unknown, solve, inverse, balance");

  add("Second", M, SHAPE, ["MTH 2-16a", "MTH 2-16b", "MTH 2-16c"], "Shape properties, nets and circles",
    "We are learning to describe shapes precisely and link 3D objects to their nets.",
    ["I can use regular, irregular, diagonal, radius, diameter and circumference.", "I know the radius is half the diameter.", "I can match 3D objects to their nets.", "I can draw 2D shapes and represent 3D objects."],
    { start: "Is a square a regular shape? Why?",
      teach: "Compare regular and irregular shapes. Measure the radius and diameter of a circle. Unfold a cereal box to see its net, and draw a net for a cube.",
      practise: "3D objects, then draw two different nets for a cube.",
      check: "A circle's diameter is 12 cm: what is its radius? Which net makes a cube?" },
    ["m-shapes-3d"], "Unfold boxes at home to see their nets.", "regular, irregular, diagonal, radius, diameter, circumference, net");

  add("Second", M, SHAPE, ["MTH 2-17a", "MTH 2-17b"], "Classifying and measuring angles",
    "We are learning to name, measure and calculate angles.",
    ["I can classify angles as acute, right, obtuse, straight and reflex.", "I can measure and draw angles to within 2°.", "I know complementary angles make 90° and supplementary angles make 180°, and can find missing angles."],
    { start: "Find an acute and an obtuse angle in the room.",
      teach: "Classify angles. Show how to use a protractor (zero line, which scale). Find a missing angle on a straight line.",
      practise: "Angles and turns, then measure and draw five angles.",
      check: "Measure an angle. Two angles on a straight line: one is 115°, what is the other?" },
    ["m-angles"], "Spot angles in roofs, scissors and clock hands.", "acute, obtuse, reflex, straight, protractor, degree, complementary, supplementary");

  add("Second", M, SHAPE, ["MTH 2-17c", "MTH 2-17d", "MTH 2-18a"], "Compass points, scale and coordinates",
    "We are learning to use eight compass points, maps with scales and coordinates.",
    ["I can use the eight compass points and their angles.", "I can read maps and plans with simple scales, as in 1 cm : 2 km.", "I can plot and describe points with coordinates in the first quadrant."],
    { start: "Which direction is halfway between North and East?",
      teach: "Draw the eight compass points with angles between them. Measure on a map and use the scale. Plot (3, 5) and (5, 3) — along first, then up.",
      practise: "Angles and turns, then plot a shape from coordinates.",
      check: "On a 1 cm : 2 km map, 4·5 cm is how far? Plot (2, 6)." },
    ["m-angles"], "Use a map on a walk and work out real distances.", "North-East, South-West, scale, coordinates, axis, plot");

  add("Second", M, SHAPE, ["MTH 2-19a"], "Lines of symmetry",
    "We are learning to find lines of symmetry and complete symmetrical patterns.",
    ["I can draw lines of symmetry on 2D shapes.", "I can complete symmetrical pictures and patterns."],
    { start: "How many lines of symmetry does a square have?",
      teach: "Fold and use mirrors to find lines of symmetry in regular and irregular shapes. Complete patterns on squared paper across vertical, horizontal and diagonal lines.",
      practise: "Complete three symmetrical patterns on squared paper.",
      check: "Draw the lines of symmetry on a rectangle and a regular hexagon." },
    [], "Look for symmetry in flags, logos and leaves.", "symmetry, line of symmetry, reflect, mirror line");

  add("Second", M, DATA, ["MNU 2-20a", "MNU 2-20b", "MTH 2-21a"], "Graphs, pie charts and reliable data",
    "We are learning to collect, display and interpret data, and judge if it's reliable.",
    ["I can collect data in a suitable way.", "I can display data in tables, bar graphs, line graphs, frequency tables and simple pie charts, with a suitable scale.", "I can draw conclusions from data.", "I can judge how reliable data is, thinking about who made it and the sample size."],
    { start: "Is a survey of 3 people enough to know the favourite food of a whole school?",
      teach: "Make a frequency table, then a bar graph and a line graph for change over time. Read a simple pie chart. Spot a misleading graph scale.",
      practise: "Reading tables, then Bar charts.",
      check: "Read values from a line graph and explain one conclusion." },
    ["n-table", "n-bar"], "Look at a graph in the news: is it fair or misleading?", "frequency table, line graph, pie chart, scale, reliable, sample");

  add("Second", M, DATA, ["MNU 2-22a"], "Probability and chance experiments",
    "We are learning to describe probability and test it with experiments.",
    ["I can describe likelihood with equal chance, fifty-fifty, one in two, percentages and fractions like ⅙.", "I can plan and carry out experiments with repeated trials.", "I can use data to predict outcomes."],
    { start: "What is the chance of rolling a 6? Of an even number?",
      teach: "Predict how many 6s in 30 rolls, then test it. Record results in a tally. Compare with the prediction and talk about why they differ.",
      practise: "How likely is it?",
      check: "A bag has 3 red and 1 blue counter. What is the chance of blue, as a fraction and a percentage?" },
    ["n-chance"], "Flip a coin 20 times and record heads and tails.", "probability, chance, fifty-fifty, one in, likely, outcome, trial");

  add("Second", M, NUM, ["MTH 2-12a"], "Maths in inventions, life and work",
    "We are learning how maths shapes the world, now and in the past.",
    ["I can find and present examples of how maths is used in life and work.", "I can discuss the part maths played in important inventions."],
    { start: "Which jobs need maths? Which inventions needed it?",
      teach: "Choose an invention (bridges, computers, GPS) and find the maths it needs. Plan a short presentation.",
      practise: "Make a fact poster or slide about one example.",
      check: "Explain one way maths is used in a job you'd like." },
    [], "Ask family members how they use maths at work or at home.", "invention, engineer, data, measurement");

  /* ===================== Literacy and English: Early level ===================== */

  add("Early", L, LISTEN, ["LIT 0-01a", "LIT 0-11a", "LIT 0-20a"], "Rhyme and patterns in words",
    "We are learning to hear and make rhymes.",
    ["I can hear and say rhyming words.", "I can make a rhyme for a word.", "I can join in with songs, rhymes and stories."],
    { start: "Say a nursery rhyme together. Which words sound the same at the end?",
      teach: "Say pairs: cat–hat (rhyme?), cat–dog (rhyme?). Give a word and make up rhymes, real or silly.",
      practise: "Rhyming words.",
      check: "Ask for a word that rhymes with 'pig' and with 'sun'." },
    ["l-rhyme"], "Read rhyming books and pause so your child says the rhyming word.", "rhyme, sound, word");

  add("Early", L, LISTEN, ["ENG 0-12a", "LIT 0-13a"], "Hearing the sounds in words",
    "We are learning to hear the first sound and all the sounds in a word.",
    ["I can hear and say the single sounds letters make.", "I can hear the first sound in a word.", "I can count the sounds in a short word."],
    { start: "I spy with my little eye something beginning with /m/.",
      teach: "Say a word slowly, stretching each sound (m-a-p). Push a counter for each sound. Find the first sound of objects in a bag.",
      practise: "First sounds, then How many sounds?",
      check: "What's the first sound in 'fish'? How many sounds in 'dog'?" },
    ["l-first-sound", "l-count-sounds"], "Play I spy using sounds, not letter names.", "sound, first sound, word, stretch");

  add("Early", L, PHON, ["ENG 0-12a", "LIT 0-13a", "LIT 0-21a"], "Letter sounds and blending to read",
    "We are learning to say letter sounds and blend them to read words.",
    ["I know the sounds of lowercase letters.", "I can blend sounds to read a word.", "I read from left to right and top to bottom."],
    { start: "Flash letter cards: say the sound for each.",
      teach: "Show s, a, t, p, i, n. Blend s-a-t → sat, pointing left to right. Change one sound to make a new word (sat → pat).",
      practise: "Sound Switch: first doors, then the Short a list.",
      check: "Read five words such as pin, tap, sit, nap, tin." },
    ["g-switch-first", "short-a"], "Point to words left to right when you read together.", "sound, letter, blend, read");

  add("Early", L, PHON, ["ENG 0-12a", "LIT 0-13a"], "Two letters, one sound: sh, ch and th",
    "We are learning that two letters can make one sound.",
    ["I can hear and say sounds made by two letters together.", "I can read words with sh, ch and th."],
    { start: "Make a 'shh' sound. What letters do you think make it?",
      teach: "Show sh, ch and th as one sound tile each. Blend sh-o-p, ch-i-p, th-i-n. Sort pictures by sound.",
      practise: "Sound Hopper: two-letter sounds, then the sh list.",
      check: "Read ship, chin, moth and point to the two-letter sound." },
    ["g-hopper-digraphs", "sh"], "Hunt for sh, ch and th in signs and books.", "digraph, sound, two letters");

  add("Early", L, PHON, ["ENG 0-12a", "LIT 0-13a"], "Reading tricky words",
    "We are learning to read tricky words we can't sound out.",
    ["I can read familiar tricky words in sentences.", "I know the difference between a letter, a word and a number."],
    { start: "Is this a letter, a word or a number? (a, 7, cat)",
      teach: "Show the, said, was, you. Spot the tricky part. Read each in a sentence. Hide them around the room to find and read.",
      practise: "Tricky word sentences.",
      check: "Read five tricky words on cards, then in a short sentence." },
    ["r-tricky"], "Make tricky word cards and play snap or pairs.", "tricky word, letter, word, sentence");

  add("Early", L, READ, ["ENG 0-17a", "LIT 0-19a"], "Talking about a story",
    "We are learning to talk about stories and predict what happens.",
    ["I can ask and answer questions about a story.", "I can say what might happen next.", "I can retell a story in my own way.", "I can share what I liked and link it to my life."],
    { start: "Look at the cover: what do you think this story is about?",
      teach: "Read the story together, stopping to ask: who is in it? What happened? What will happen next? Retell it with props or pictures.",
      practise: "Read and answer the questions on a first story.",
      check: "Ask who, where and what happened, and what they liked." },
    ["r-bus", "s-d-hen"], "Read a bedtime story every night and talk about it.", "story, character, beginning, middle, end, predict");

  add("Early", L, TALK, ["LIT 0-02a", "ENG 0-03a", "LIT 0-04a"], "Listening, taking turns and following instructions",
    "We are learning to listen, take turns and follow instructions.",
    ["I can take turns when listening and talking.", "I can look at the person talking.", "I can ask and answer questions.", "I can follow and give simple instructions."],
    { start: "Play a quick game: touch your nose, then your knees, then clap.",
      teach: "Take turns with a talking object. Follow two-step instructions to make something. Listen to a short story and answer questions about it.",
      practise: "Listen to the story, then answer the questions.",
      check: "Give a three-step instruction to follow. Ask one question about what they heard." },
    ["lc-bus", "lc-shell-shop"], "Ask your child to give you instructions to make a sandwich.", "listen, turn, instruction, question, answer");

  add("Early", L, HAND, ["LIT 0-21a"], "Forming lowercase letters",
    "We are learning to hold a pencil well and form letters.",
    ["I can hold a pencil with control.", "I can form most lowercase letters clearly.", "I can leave a space between words."],
    { start: "Air-write big letters with your finger.",
      teach: "Show where each letter starts and the direction of movement. Trace grey letters, then dotted ones, then write alone. Use a finger space between words.",
      practise: "The letter formation sheet.",
      check: "Write their name and three letters you choose, starting each in the right place." },
    ["letter-formation"], "Draw letters in sand, shaving foam or with chalk.", "letter, start, finger space, pencil grip");

  add("Early", L, WRITE, ["ENG 0-12a", "LIT 0-21a", "LIT 0-21b"], "Writing a sentence",
    "We are learning to write a sentence with a capital letter and full stop.",
    ["I can try to spell familiar words.", "I can write words from left to right with spaces.", "I can try to use a capital letter and a full stop in a sentence."],
    { start: "Say a sentence about your weekend. Count the words on your fingers.",
      teach: "Model writing the sentence: capital letter to start, sound out each word, finger spaces, full stop. Read it back together.",
      practise: "Capital letters and full stops, then a short dictation.",
      check: "Write one sentence of their own and check for a capital and full stop." },
    ["w-capitals", "dictate:short-a"], "Write shopping lists or cards together.", "sentence, capital letter, full stop, finger space");

  add("Early", L, CREATE, ["LIT 0-09b", "LIT 0-26a", "LIT 0-31a"], "Telling and drawing my own story",
    "We are learning to make up and share our own stories.",
    ["I can tell a story in order.", "I can share ideas in pictures, words and talk.", "I can use new words I've learned."],
    { start: "Tell me about something you did yesterday, from start to finish.",
      teach: "Plan a story in three pictures (beginning, middle, end). Talk it through, then label or write a sentence for each picture.",
      practise: "Draw and tell a three-part story.",
      check: "Retell the story in order, using first, then, at the end." },
    [], "Make up a story together at bedtime.", "story, beginning, middle, end, character");

  add("Early", L, READ, ["LIT 0-01b", "LIT 0-11b", "LIT 0-01c"], "Choosing and sharing stories I like",
    "We are learning to choose stories we enjoy and share what we think about them.",
    ["I can choose a story using its cover, title, author or illustrator.", "I can share what I like and don't like about stories, songs and rhymes.",
      "I can retell or act out a story in different ways, for example with puppets or props."],
    { start: "Lay out three or four books. Which one would you like? What made you pick it: the cover, the title, the pictures?",
      teach: "Read the chosen story. Stop to talk about the characters and what happens. Then retell it together with props, puppets or the pictures, and say which part was best and which part they didn't like, and why.",
      practise: "The \"My favourite story\" sheet: draw a favourite part and colour a face for how they felt about it.",
      check: "Ask them to choose between two books and tell you why. Can they retell one part of the story in their own way?" },
    [], "Visit the library together and let your child choose a book. Ask what made them pick it.", "story, cover, title, author, illustrator, character, like, dislike");

  add("Early", L, READ, ["LIT 0-07a", "LIT 0-16a"], "Asking questions about stories",
    "We are learning to ask and answer questions about stories, and link them to what we already know.",
    ["I can ask and answer questions about a story to show I understand it.", "I can make a simple prediction about what might happen.",
      "I can link a story to something I already know or have done."],
    { start: "Show the cover. What do you think will happen? Have you ever been somewhere like this?",
      teach: "Read or listen to a short story. Model asking a question (\"I wonder why…\"), then let the child ask one. Stop before the end: what will happen next? Afterwards, link it to their life: has that ever happened to you?",
      practise: "Read a story and answer its questions, then listen to a story and answer.",
      check: "Ask one who, one what and one why question, and ask them to ask you one about the story." },
    ["r-bus", "lc-shell-shop"], "At story time, ask your child to ask you a question about the story.", "question, ask, answer, predict, I wonder, remember");

  add("Early", L, TALK, ["LIT 0-09a", "LIT 0-10a"], "Sharing my news and new words",
    "We are learning to share our experiences, feelings and ideas, and to use new words we have learned.",
    ["I can talk clearly to others, sharing my feelings, ideas and thoughts.", "I can tell about something that happened in the right order.",
      "I can share ideas in play and pretend situations.", "I can use new words and phrases I have learned."],
    { start: "Share some news of your own in three parts: first, then, at the end. How did it make you feel?",
      teach: "The child shares their news, using first, then and at the end. Teach two or three new words that fit it (for example delighted, enormous, crowded) and use them back. Then act out a pretend situation, such as a shop or a vet, where they explain what they want.",
      practise: "The \"My news\" sheet: draw the news in order, then tell it to an adult using a new word.",
      check: "Ask them to tell you about something they did, in order, using at least one new word." },
    [], "At teatime, ask about the day: what happened first, next and at the end?", "news, first, then, at the end, feeling, new word");

  add("Early", L, READ, ["LIT 0-14a"], "Finding information in signs and books",
    "We are learning to find useful information in signs, books and other texts, and use it.",
    ["I can find information in a sign, book or other text to learn something new.", "I can tell a storybook from an information book.",
      "I can use what I find to make a choice or a plan."],
    { start: "Show a sign (a toilet sign, a shop sign, an exit). What does it tell us? How do you know?",
      teach: "Put a storybook beside an information book. How are they different (photographs, labels, facts)? Find one fact in the information book together. Then read a simple poster or menu and use it to choose or plan something.",
      practise: "The \"Find it\" sheet: read a poster and a menu with an adult, find the information and make a choice.",
      check: "Show a new sign or a page of an information book. What does it tell us? What could we do with that?" },
    [], "Point out signs on a walk or in a shop, and ask what each one tells you.", "sign, information, fact, label, storybook, information book");

  /* ===================== Literacy and English: First level ===================== */

  add("First", L, PHON, ["ENG 1-12a", "LIT 1-13a", "LIT 1-21a"], "Silent e: a–e, i–e, o–e, u–e",
    "We are learning to read and spell words with a split vowel sound.",
    ["I can decode words with familiar letter patterns.", "I can spell words with split vowel sounds using what I know about phonics."],
    { start: "Read cap, then cape. What changed?",
      teach: "Show how the e at the end changes the vowel sound (hop → hope). Map the sounds: c-a_e-k. Sort words by short and long vowel.",
      practise: "Sound Hopper: long a, then the a–e and i–e lists.",
      check: "Read and spell five words with a split vowel." },
    ["g-hopper-long-a", "a-e", "i-e"], "Find words with a magic e in a book.", "vowel, long vowel, split digraph, silent e");

  add("First", L, PHON, ["ENG 1-12a", "LIT 1-13a", "LIT 1-21a"], "Vowel teams: ai, ee, oa, igh",
    "We are learning to read and spell words with vowel teams.",
    ["I can decode words with vowel teams.", "I can choose a sensible spelling for a long vowel sound."],
    { start: "Say rain, tree, boat, night. What sound is in the middle of each?",
      teach: "Show each team as one sound tile. Map r-ai-n, t-r-ee. Talk about ai in the middle and ay at the end of words.",
      practise: "The ai and ee lists.",
      check: "Read and spell train, sheep, coat, light." },
    ["ai", "ee"], "Spot vowel teams on cereal boxes and signs.", "vowel team, long vowel sound");

  add("First", L, PHON, ["ENG 1-12a", "LIT 1-21a"], "Vowels with r: ar, or, er, ir, ur",
    "We are learning to read and spell words where r changes the vowel.",
    ["I can read words with ar, or, er, ir and ur.", "I can choose between er, ir and ur, and check spellings in a word list."],
    { start: "Say car, fork, her, bird, fur.",
      teach: "Show each spelling. Sort words into er, ir and ur. Build a reminder list for tricky ones.",
      practise: "Sound Hopper: r sounds, then the ar list.",
      check: "Read and spell star, storm, girl, turn." },
    ["g-hopper-r", "ar"], "Play 'r sound' I spy around the house.", "vowel, r sound");

  add("First", L, SPELL, ["LIT 1-21a"], "Common words and spelling strategies",
    "We are learning to spell common words and use strategies for tricky ones.",
    ["I can spell most commonly used words.", "I can use phonics and spelling strategies for new words.", "I can use alphabetical order to find a word in a dictionary or word list."],
    { start: "Try to spell 'because'. Which part is tricky?",
      teach: "Look, say, cover, write, check. Split words into syllables (be-cause). Practise alphabetical order with first and second letters, then find words in a dictionary.",
      practise: "The Tricky words list.",
      check: "Spell five common words. Put five words in alphabetical order." },
    ["tricky"], "Practise three tricky words a day with look, say, cover, write, check.", "spelling, syllable, alphabetical order, dictionary");

  add("First", L, PHON, ["ENG 1-12a", "LIT 1-13a"], "Reading aloud with expression",
    "We are learning to read aloud fluently and with expression.",
    ["I can read a familiar text aloud with expression.", "I can work out new words using letter patterns and context.", "I use punctuation to help me read with meaning."],
    { start: "Read 'Help!' in a calm voice, then a frightened one. Which fits?",
      teach: "Model reading a page with expression. Show how question marks and exclamation marks change your voice. Show how to work out a new word from its sounds and the sentence.",
      practise: "Read a story by yourself, then answer the questions.",
      check: "Read a short passage aloud and explain how a word was worked out." },
    ["s-d-gull", "s-d-boat"], "Take turns reading pages aloud, using funny voices for characters.", "expression, fluency, punctuation, context");

  add("First", L, READ, ["LIT 1-16a", "ENG 1-17a", "ENG 1-19a"], "Answering questions about a text",
    "We are learning to answer literal, inferential and evaluative questions.",
    ["I can find the main ideas of a text.", "I can answer questions where the answer is in the text and where I have to think.", "I can tell fact from opinion.", "I can share ideas about characters and the writer's message."],
    { start: "What's the difference between 'What colour was the kite?' and 'How did Jake feel?'",
      teach: "Read a passage. Ask a 'right there' question, a 'think and search' question, and an 'on my own' question. Show how to find evidence in the text.",
      practise: "Read the story, then answer the questions.",
      check: "Ask one question of each kind and ask them to point to the evidence." },
    ["r-kite", "r-rain"], "Ask 'why do you think…?' questions about books.", "main idea, fact, opinion, character, evidence");

  add("First", L, READ, ["LIT 1-14a", "LIT 1-15a"], "Finding information and making notes",
    "We are learning to find key information and make notes.",
    ["I can find key information using contents, headings and pictures.", "I can make notes under headings and use them."],
    { start: "How would you find out about sharks in a book?",
      teach: "Show contents, headings and captions. Read a short non-fiction page and make notes under 'where they live', 'what they eat'.",
      practise: "Read a passage and fill in notes under three headings.",
      check: "Use notes to tell three facts about the topic." },
    ["r-storm"], "Read a leaflet or website together to find one fact.", "contents, heading, caption, notes, fact");

  add("First", L, WRITE, ["LIT 1-22a"], "Full stops, question marks and exclamation marks",
    "We are learning to punctuate the ends of sentences.",
    ["I can start sentences with a capital letter.", "I can end sentences with a full stop, question mark or exclamation mark."],
    { start: "Read 'where is my bag' — what's missing?",
      teach: "Show a statement, a question and an exclamation. Read each aloud with the right voice. Fix sentences with missing punctuation.",
      practise: "Full stop, question mark or exclamation mark?, then Capital letters and full stops.",
      check: "Write a question, a statement and an exclamation." },
    ["w-end-marks", "w-capitals"], "Write a note with a question in it for someone at home.", "capital letter, full stop, question mark, exclamation mark");

  add("First", L, WRITE, ["LIT 1-22a"], "Joining sentences: and, but, because, so",
    "We are learning to link ideas with conjunctions.",
    ["I can link sentences with and, but, because and so.", "I can start sentences in different ways."],
    { start: "'I was hungry. I ate a sandwich.' Join them with one word.",
      teach: "Show how each joining word changes meaning. Practise finishing sentence starters. Try different openers: Then, After that, Suddenly.",
      practise: "Joining words: and, but, because, so.",
      check: "Write two sentences joined with because, and one with a new opener." },
    ["w-joining"], "Play 'because' — say a sentence and add a reason.", "conjunction, join, because, but, so, and, opener");

  add("First", L, WRITE, ["LIT 1-22a", "LIT 1-23a"], "Past tense, and checking my writing",
    "We are learning to write in the past tense and check our writing makes sense.",
    ["I can add -ed to show something happened in the past.", "I can check my writing makes sense and correct it."],
    { start: "Today I jump. Yesterday I…?",
      teach: "Show adding -ed. Write three sentences about yesterday. Read them back to check they make sense and fix one mistake.",
      practise: "Past tense: adding -ed.",
      check: "Write two past-tense sentences and correct a sentence with a mistake." },
    ["w-past-ed"], "Talk about what happened today using past-tense words.", "past tense, -ed, check, edit");

  add("First", L, DICT, ["LIT 1-21a", "LIT 1-22a"], "Dictation: spelling and punctuation together",
    "We are learning to write a whole sentence we hear, with correct spelling and punctuation.",
    ["I can spell the words in a sentence using what I know.", "I can punctuate the sentence accurately."],
    { start: "Spell three words from this week's list.",
      teach: "Say a sentence twice. Count the words. Write it, then check capital letter, spellings and full stop together.",
      practise: "Sentence dictation.",
      check: "Dictate one new sentence and mark it together." },
    ["dictate:ai"], "Dictate a short sentence for your child to write.", "dictation, sentence, capital letter, full stop");

  add("First", L, CREATE, ["LIT 1-26a", "ENG 1-30a"], "Planning and writing a recount",
    "We are learning to plan and write about something that happened to us.",
    ["I can plan my ideas using a simple format.", "I can write about an experience in a logical order.", "I can use interesting words."],
    { start: "Tell me about a day out. What happened first?",
      teach: "Plan with four boxes: who, where, what happened, how I felt. Use time words (first, next, after that, finally). Write it up from the plan.",
      practise: "Write a short recount from the plan.",
      check: "Check the order is clear and there are time words." },
    [], "Keep a weekend diary together.", "recount, plan, order, time words");

  add("First", L, CREATE, ["ENG 1-31a", "LIT 1-28a"], "Writing a story with characters and a setting",
    "We are learning to write a story with a clear structure.",
    ["I can create a story with a beginning, middle and end.", "I can describe a character's feelings and actions.", "I can describe where it happens."],
    { start: "Who could be the main character? Where could it happen?",
      teach: "Plan a story mountain: opening, problem, solution, ending. Describe the character with feelings and actions, not just looks.",
      practise: "Write the opening and the problem of the story.",
      check: "Point to the opening, problem and ending, and a feeling word." },
    [], "Make up stories with toys and write one down.", "character, setting, beginning, problem, ending");

  add("First", L, TALK, ["LIT 1-04a", "LIT 1-07a", "LIT 1-08a", "LIT 1-09a"], "Listening for main ideas, and fact or opinion",
    "We are learning to listen for main ideas and tell fact from opinion.",
    ["I can find the purpose and main ideas of something I hear.", "I can answer different types of questions about it.", "I can tell simple facts from opinions."],
    { start: "'Dogs have four legs.' 'Dogs are the best pets.' Which is a fact?",
      teach: "Listen to a short recording or story. Note three main ideas. Sort statements into fact or opinion.",
      practise: "Listen to the story, then answer the questions.",
      check: "Retell the main idea and give one fact and one opinion." },
    ["lc-bus"], "Listen to a radio clip or audiobook together and talk about it.", "main idea, purpose, fact, opinion");

  add("First", L, HAND, ["LIT 1-24a"], "Clear, legible handwriting",
    "We are learning to present writing clearly for a reader.",
    ["I can write clearly so others can read it.", "I can lay out my work neatly, using pictures or headings where they help."],
    { start: "Look at two pieces of writing. Which is easier to read? Why?",
      teach: "Practise letters on four-line ruling, with even size and spacing. Copy a short piece neatly with a heading.",
      practise: "Handwriting sheet for this week's spelling list.",
      check: "Copy a sentence neatly with even spacing." },
    ["handwriting-spacing"], "Write a birthday card in best handwriting.", "handwriting, spacing, size, neat, legible");

  add("First", L, READ, ["LIT 1-01a", "LIT 1-11a", "LIT 1-20a"], "Choosing texts and explaining why",
    "We are learning to choose texts we enjoy, explain why, and choose how to make our own.",
    ["I can choose texts to listen to, watch or read, for enjoyment or to find something out.", "I can use the cover, title, author, illustrator or blurb to help me choose.",
      "I can explain why I prefer certain texts and authors.", "I can choose my own subject, purpose and format when I create a text."],
    { start: "What's the best book, programme or podcast you've read, watched or listened to lately? What made it good?",
      teach: "Look at three books together. Use the cover, title, author and blurb to predict what each is like, then choose one and explain why. Talk about favourite authors and what they have in common. Then plan a text of their own choice: what will it be about, who is it for, and will it be a poster, a comic, a story or a letter?",
      practise: "The \"My choices\" sheet: a reading and listening log with reasons, then a plan for a text of their own choosing.",
      check: "Ask them to recommend a text to you and give two reasons. Ask why they chose the format for their own text." },
    [], "Keep a list of books and programmes your child enjoys, and talk about why.", "choose, prefer, author, blurb, genre, format, recommend");

  add("First", L, TALK, ["LIT 1-02a", "ENG 1-03a", "LIT 1-10a"], "Listening and talking in a group",
    "We are learning when and how to listen and talk with others, and to talk clearly so others are interested.",
    ["I can take turns and talk at the right time.", "I can listen and respond respectfully, for example by nodding, agreeing, asking and answering questions.",
      "I can use eye contact, expression and body language to engage others.", "I can speak clearly and audibly, choosing objects or pictures to help if I need them."],
    { start: "Say \"I like pizza\" in a bored voice, then in an excited voice. Which is more interesting to listen to? Why?",
      teach: "Agree the rules for talking together: one speaker at a time, look at the speaker, wait for a pause, ask a question that fits. Discuss a simple question together (Should we have school on Saturdays?). Model pace, expression and gesture, then the pupil explains something to you with an object or picture to help.",
      practise: "The \"Talking together\" sheet: a short talk about a chosen object, and a checklist for how the talk went.",
      check: "Have a two-minute conversation. Do they wait their turn, respond to what you said and speak clearly?" },
    [], "Play a game of \"tell me about it\" at dinner: everyone takes a turn and asks one question.", "turn, listen, respond, eye contact, expression, gesture, clearly");

  add("First", L, TALK, ["LIT 1-05a", "LIT 1-06a", "LIT 1-25a"], "Notes from listening, then using them",
    "We are learning to make notes under headings as we listen, then use them to create something new.",
    ["I can find the purpose and main ideas of something I listen to or watch.", "I can make notes under given headings.",
      "I can use my notes to put ideas in a logical order and create a new text."],
    { start: "Listen to two sentences about hedgehogs. Which words are the most important to remember?",
      teach: "Explain notes are key words, not whole sentences. Read the short talk on the adult's sheet aloud twice. The first time, just listen for the main idea. The second time, write key words under the headings. Then turn the notes into three sentences, in order, for someone who didn't hear it.",
      practise: "The \"Notes from listening\" sheet: notes under headings while the adult reads, then sentences from the notes.",
      check: "From their notes alone, can they tell you the main ideas in a sensible order?" },
    [], "Listen to the weather or a short news clip and jot down three key words together.", "notes, heading, key word, main idea, purpose, order");

  add("First", L, READ, ["LIT 1-18a"], "Fact and opinion in what I read",
    "We are learning to recognise the difference between fact and opinion in what we read.",
    ["I can tell a fact from an opinion in a text.", "I can explain how I know: a fact can be checked, an opinion is what someone thinks.",
      "I can spot words that often show an opinion, such as best, I think and should."],
    { start: "\"Penguins are birds.\" \"Penguins are the cutest animals.\" Which one could we check in a book?",
      teach: "Read a short text about an animal or place. Underline the facts in one colour and the opinions in another. Collect opinion words (best, worst, I think, amazing, should). Ask: why might a writer put opinions in?",
      practise: "The \"Fact or opinion?\" sheet: sort sentences from a short text, then write one fact and one opinion of their own.",
      check: "Give three new sentences. Which are facts and which are opinions, and how do they know?" },
    [], "Spot facts and opinions on food packets and adverts together.", "fact, opinion, true, check, think, believe");

  add("First", L, CREATE, ["LIT 1-29a"], "Writing to share information or an opinion",
    "We are learning to write to give information, describe something, share our opinion or persuade.",
    ["I can choose and organise information and share it in different ways.", "I can use words that suit what I'm writing for.",
      "I can give my own opinion and try to persuade the reader."],
    { start: "Show a poster and an information leaflet. What is each one trying to do?",
      teach: "Choose a topic the pupil knows well (a pet, a game, a place). First write two or three facts to inform. Then write their opinion with a reason, and add one sentence to persuade the reader (You should… because…). Talk about how the words change between informing and persuading.",
      practise: "The \"Inform or persuade\" sheet: facts in one box, an opinion and reasons in another, then a short poster.",
      check: "Can they tell you which sentences inform and which persuade, and why?" },
    [], "Make a poster together for something at home: a family film night, or a room tidy rota.", "inform, describe, opinion, persuade, reason, because, should");

  /* ===================== Literacy and English: Second level ===================== */

  add("Second", L, SPELL, ["LIT 2-21a"], "Spelling rules: -ing, plurals and endings",
    "We are learning to apply spelling rules to spell most words correctly.",
    ["I can apply spelling rules for -ing and plurals.", "I can self-correct using spelling strategies."],
    { start: "Spell 'running' and 'hoping'. Why is one doubled?",
      teach: "Teach the rules: double the consonant after a short vowel (run → running), drop the e (hope → hoping), add -es after s, x, sh, ch. Check a piece of writing for errors.",
      practise: "The Adding -ing and Plurals lists.",
      check: "Spell five words with endings and explain one rule." },
    ["ing", "s-es"], "Spot rule-breakers in a book and talk about them.", "rule, suffix, plural, double, self-correct");

  add("Second", L, SPELL, ["LIT 2-21a"], "Tricky spelling patterns: soft c and g, silent letters, ph",
    "We are learning to spell words with tricky letter patterns.",
    ["I can use spelling patterns and rules for soft c and g, silent letters and ph.", "I can use resources to check spellings."],
    { start: "Why does 'c' sound different in 'cat' and 'city'?",
      teach: "Show c and g are soft before e, i or y. Show silent k and w (knock, write) and ph making /f/. Use a dictionary to check.",
      practise: "The Soft c and soft g, Silent letters and ph lists.",
      check: "Spell city, giant, knee, wrist, phone." },
    ["soft-c-g", "kn-wr", "ph"], "Make a family list of words with silent letters.", "soft c, soft g, silent letter, pattern");

  add("Second", L, PHON, ["ENG 2-12a", "LIT 2-13a"], "Reading fluently, with pace and expression",
    "We are learning to read unfamiliar texts fluently and with understanding.",
    ["I can read with fluency, understanding and expression.", "I use context clues, punctuation, grammar and layout to read unfamiliar texts."],
    { start: "Read a sentence with no punctuation. Then with it. What changes?",
      teach: "Model reading a passage at the right pace. Show how commas and dialogue change reading. Work out unfamiliar words from context.",
      practise: "Read the story, then answer the questions.",
      check: "Read a passage aloud and explain an unfamiliar word using context." },
    ["r-puppy", "s-d-puddle"], "Read aloud to a younger child or a pet.", "fluency, pace, expression, context");

  add("Second", L, READ, ["LIT 2-16a", "ENG 2-17a", "ENG 2-19a"], "Inference: reading between the lines",
    "We are learning to make inferences and support them with evidence.",
    ["I can answer literal, inferential and evaluative questions.", "I can find the main ideas with supporting detail.", "I can comment on characters, setting and the writer's language."],
    { start: "'She slammed the door.' How is she feeling? How do you know?",
      teach: "Read a passage. Model 'I think… because the text says…'. Find clues about a character's feelings. Comment on a word choice and its effect.",
      practise: "Read the story, then answer the questions.",
      check: "Answer an inference question and give the evidence." },
    ["r-puppy", "s-d-phone"], "Ask 'how do you know?' when talking about books.", "infer, evidence, clue, character, setting, word choice");

  add("Second", L, READ, ["LIT 2-16a", "LIT 2-18a"], "Fact, opinion and persuasion",
    "We are learning to spot fact, opinion and techniques used to persuade.",
    ["I can tell fact from opinion and explain why.", "I can spot word choice and techniques used to influence readers.", "I can judge which sources are most reliable."],
    { start: "Look at an advert. What does it want you to do?",
      teach: "Sort statements into fact and opinion. Highlight persuasive words in an advert. Compare two sources on one topic: which is more reliable and why?",
      practise: "Highlight facts and opinions in a short persuasive text.",
      check: "Give one fact, one opinion and one persuasive technique from the text." },
    [], "Talk about adverts on TV: what tricks are they using?", "fact, opinion, persuade, reliable, source, bias");

  add("Second", L, READ, ["LIT 2-14a", "LIT 2-15a"], "Skimming, scanning and notes in own words",
    "We are learning to skim, scan and make notes in our own words.",
    ["I can skim to find the purpose and main ideas.", "I can scan for key information.", "I can make notes in my own words and use them to write."],
    { start: "Find the date in this leaflet as fast as you can.",
      teach: "Show skimming (first lines, headings) and scanning (looking for a key word). Turn a paragraph into three bullet-point notes in your own words.",
      practise: "Make notes from a short non-fiction text, then write a summary.",
      check: "Write a two-sentence summary from the notes." },
    ["r-storm"], "Find information for a family trip from a website.", "skim, scan, notes, summary, own words");

  add("Second", L, WRITE, ["LIT 2-22a"], "Commas, speech marks and apostrophes",
    "We are learning to use a range of punctuation accurately.",
    ["I can use commas in lists and after openers.", "I can punctuate speech with speech marks.", "I can use apostrophes for contractions and possession."],
    { start: "Punctuate: I bought eggs milk bread and jam.",
      teach: "Show commas in lists. Model setting out speech: \"Look out!\" shouted Sam. Show apostrophes in don't and the dog's bone.",
      practise: "Correct the punctuation in five sentences, then write a short conversation.",
      check: "Punctuate a sentence of speech and one with a possessive apostrophe." },
    [], "Spot speech marks in a book and read the dialogue in character.", "comma, speech marks, inverted commas, apostrophe, possession");

  add("Second", L, WRITE, ["LIT 2-22a", "LIT 2-23a"], "Varying sentences and using paragraphs",
    "We are learning to vary sentences and organise writing into paragraphs.",
    ["I can use sentences of different lengths and types.", "I can vary sentence openings and link sentences with a range of conjunctions.", "I can use paragraphs to separate ideas.", "I can review and correct my writing."],
    { start: "Make this more interesting: 'The dog ran. The dog barked.'",
      teach: "Show short sentences for effect, longer ones with although, while, since. Plan three paragraphs on a topic. Edit a paragraph together.",
      practise: "Joining words, then write and edit a three-paragraph piece.",
      check: "Point to a short sentence, a long sentence and a new paragraph." },
    ["w-joining"], "Write a short review of a film in three paragraphs.", "sentence, conjunction, opener, paragraph, edit");

  add("Second", L, DICT, ["LIT 2-21a", "LIT 2-22a"], "Dictation: longer sentences",
    "We are learning to write longer dictated sentences accurately.",
    ["I can spell most words correctly using rules and strategies.", "I can punctuate sentences accurately, including commas."],
    { start: "Spell five words from the soft c and g list.",
      teach: "Say a sentence twice. Write it. Check spellings, capital letter, commas and full stop. Correct mistakes using a word list.",
      practise: "Sentence dictation.",
      check: "Dictate one new sentence and mark it together." },
    ["dictate:soft-c-g"], "Dictate a sentence from a favourite book.", "dictation, spelling, punctuation, check");

  add("Second", L, CREATE, ["LIT 2-26a", "LIT 2-28a", "LIT 2-29a"], "Writing to inform or persuade",
    "We are learning to write an information text or a persuasive piece.",
    ["I can plan and organise information logically.", "I can use an introduction and a conclusion.", "I can use language to persuade, such as word choice and questions to the reader."],
    { start: "Should children have longer playtimes? Give one reason.",
      teach: "Plan with a box for each point and a piece of evidence. Model an introduction, linking phrases (firstly, furthermore, however) and a conclusion.",
      practise: "Write a persuasive letter or an information leaflet from the plan.",
      check: "Find the introduction, two linking phrases and the conclusion." },
    [], "Write a persuasive note asking for a family treat.", "inform, persuade, introduction, conclusion, linking phrase, evidence");

  add("Second", L, CREATE, ["ENG 2-27a", "ENG 2-30a", "ENG 2-31a"], "Writing a story: plot, character and setting",
    "We are learning to write a story with convincing characters and a clear plot.",
    ["I can create interesting characters through their feelings and actions.", "I can describe a setting with detail.", "I can use figurative language such as similes.", "I can structure a plot with an opening, turning point and ending."],
    { start: "Describe this picture of a forest using your five senses.",
      teach: "Plan a plot with a turning point. Show characterisation through actions and speech. Add a simile or metaphor to describe the setting.",
      practise: "Write the opening paragraph and the turning point.",
      check: "Point to a description of feelings, a simile and the turning point." },
    [], "Read a story together and talk about how the writer builds tension.", "plot, character, setting, simile, metaphor, turning point");

  add("Second", L, TALK, ["LIT 2-09a", "LIT 2-10a"], "Planning and giving a short talk",
    "We are learning to plan and deliver a short talk.",
    ["I can plan an organised talk with relevant content.", "I can speak clearly, audibly and with expression.", "I can use vocabulary that suits my audience."],
    { start: "What makes a good speaker? Think of someone you like listening to.",
      teach: "Plan a two-minute talk on a hobby: opening, three points, ending. Practise eye contact, volume and pace.",
      practise: "Give the talk and answer one question.",
      check: "Did it have an opening, three points and an ending? Was it clear?" },
    [], "Give your talk to the family at teatime.", "talk, audience, eye contact, volume, pace");

  add("Second", L, READ, ["LIT 2-01a", "LIT 2-11a", "LIT 2-20a"], "Choosing texts and authors, and writing my own choice",
    "We are learning to choose texts for enjoyment or information, explain our preferences with detail, and choose the right form for our own writing.",
    ["I can choose texts to read, listen to or watch, for enjoyment or to find information for a purpose.", "I can explain my preferences for texts, authors or sources with supporting detail.",
      "I can choose the genre, form, structure and style of my own texts to suit my purpose and audience."],
    { start: "Which author or series would you recommend to a friend? Convince me in one sentence.",
      teach: "Compare two texts the pupil knows: what does each author do that they like (characters, humour, facts, layout)? Talk about choosing sources for information: a website, a book, a podcast. Then choose a purpose and audience for their own text and decide the best form (a review, a blog post, a comic, a set of instructions).",
      practise: "The \"Recommend it\" sheet: a review with evidence, then a plan for their own text with its audience and form.",
      check: "Ask them to justify a preference with a detail from the text, and explain why the form they chose suits the audience." },
    [], "Swap book recommendations as a family, each giving a reason.", "genre, author, source, preference, review, audience, purpose, form");

  add("Second", L, TALK, ["LIT 2-02a", "ENG 2-03a"], "Group discussion: building on others' ideas",
    "We are learning to take part in discussions, value others' ideas and build on them, and use features of spoken language well.",
    ["I can contribute relevant ideas, information and opinions in a discussion.", "I can show respect for others' views and offer my own.",
      "I can build on what others say by asking or answering questions, clarifying points or supporting their ideas.",
      "I can use vocabulary, eye contact, body language, emphasis, pace and tone when I talk, and spot techniques speakers use to influence me."],
    { start: "Agree or disagree: \"Every child should learn to cook.\" Give one reason.",
      teach: "Teach discussion moves with sentence starters: I agree with… because…; Building on what you said…; Can you explain what you mean by…?; I see it differently because…. Discuss a question together, taking turns, and use at least three moves each. Then listen to a short persuasive speech (or perform one) and spot the techniques: emphasis, pace, tone, rhetorical questions.",
      practise: "The \"Discussion\" sheet: plan points for a discussion, use the starters, and note techniques heard.",
      check: "In a short discussion, do they build on what you said rather than just giving their own point?" },
    [], "Have a family debate on something light, like the best pizza topping, with everyone building on the last speaker.", "discussion, agree, disagree, build on, clarify, viewpoint, tone, emphasis, rhetorical question");

  add("Second", L, TALK, ["LIT 2-04a", "LIT 2-05a", "LIT 2-06a", "LIT 2-25a"], "Notes from listening, in my own words",
    "We are learning to make notes in our own words as we listen, organise them, and use them to create new texts, crediting our sources.",
    ["I can find the purpose and main ideas of something I listen to or watch, with supporting detail.", "I can make relevant notes in my own words and organise them under suitable headings.",
      "I can use my notes to create a new text for a purpose.", "I can say where my information came from."],
    { start: "Listen to one sentence. Write it in three words. Did you keep the meaning?",
      teach: "Read the short talk on the adult's sheet aloud twice. First listen for the purpose and main ideas. The second time, the pupil makes notes in their own words and chooses their own headings. Then they use the notes to write a short paragraph for a younger reader, and add where the information came from.",
      practise: "The \"Notes in my own words\" sheet: notes under their own headings, then a short paragraph with its source.",
      check: "Compare their notes to the talk: are the main ideas there, in their own words, with the source credited?" },
    [], "Watch a short documentary clip together and each jot down three facts in your own words.", "notes, own words, heading, purpose, main idea, detail, source");

  add("Second", L, TALK, ["LIT 2-07a", "LIT 2-08a"], "Questions, fact and opinion in what I hear",
    "We are learning to show we understand what we hear by answering and asking different kinds of questions, and to tell fact from opinion and spot when a source is trying to influence us.",
    ["I can answer literal, inferential and evaluative questions about something I listen to or watch.", "I can ask different kinds of questions of my own.",
      "I can tell fact from opinion and explain how I know.", "I can recognise when a source is trying to influence me, and say how useful it is."],
    { start: "\"Our juice is the tastiest in Scotland!\" Who might say this? Why?",
      teach: "Explain the three kinds of question: literal (it says so), inferential (clues tell you) and evaluative (what do you think, and why?). Read the radio advert on the adult's sheet aloud. The pupil answers one of each kind, sorts facts from opinions, and decides how the advert tries to influence the listener and whether it's a useful source.",
      practise: "The \"What I heard\" sheet: questions on a spoken advert, fact and opinion, and how it tries to influence.",
      check: "Ask them to write one literal, one inferential and one evaluative question about something they've heard." },
    [], "When an advert comes on, ask: what is it trying to make us do? Is everything in it a fact?", "literal, inferential, evaluative, fact, opinion, influence, source, reliable");

  /* ===================== England: lessons for the national curriculum's own requirements ===================== */
  // Grammar by year (English Appendix 2), the statutory spelling words (Appendix 1), joined
  // handwriting, and the Year 1 phonics and Year 4 multiplication tables checks. "level" and "codes"
  // place each one in CfE too (England's Year 1 is about P2), so Scottish pupils can use them; the
  // national curriculum statements they cover are in england.js.
  function addEngland(level, subject, strand, codes, title, intention, criteria, steps, use = [], home = "", vocab = "") {
    lessons.push({ id: `lesson-england-${slug(title)}`, england: true, level, subject, strand, codes, title, intention, criteria, steps, use, home, vocab });
  }

  addEngland("First", L, WRITE, ["LIT 1-22a"], "Year 1 grammar: plurals, un- and capital letters",
    "We are learning to add -s or -es for more than one, use un- to change a word's meaning, and use capital letters for names and I.",
    ["I can add -s or -es to make a plural.", "I can add un- to make a word mean not, or undo something.", "I can use a capital letter for names, days of the week and the word I."],
    { start: "Hold up one pencil, then two. One pencil, two…? One box, two…? Listen: which needs an extra beat?",
      teach: "Sort words into -s and -es by clapping the beats: cats, foxes, dogs, wishes. Then add un- to kind, happy and tie, and act them out. Write a sentence about yourself with I and a friend's name: point to every capital letter.",
      practise: "The three Year 1 grammar sets on PopSpell.",
      check: "Write the plural of bus, cat and dish, and one sentence using I, a name and a day of the week." },
    ["eg-y1-plurals", "eg-y1-un", "eg-y1-capitals"], "Spot plurals on a walk (cars, buses, trees) and say whether they need -s or -es.", "plural, singular, prefix, capital letter, sentence");

  addEngland("First", L, WRITE, ["LIT 1-22a"], "Year 2 grammar: apostrophes, suffixes and sentence types",
    "We are learning to use apostrophes, suffixes and the four kinds of sentence.",
    ["I can use an apostrophe for missing letters (can't) and to show one owner (the girl's book).", "I can add -ness, -ful, -less, -er, -est and -ly.", "I can tell a statement, question, exclamation and command apart.", "I can use commas in a list."],
    { start: "Say \"do not\" quickly. What do we write? Where do the missing letters go?",
      teach: "Write can't, I'm and it's, then cover the apostrophe and say which letters are missing. Show the girl's book against two girls. Build words with suffixes: care, careful, careless; kind, kindness, kindly. Read four sentences in different voices: statement, question, exclamation (What a…!), command.",
      practise: "The Year 2 grammar sets on PopSpell.",
      check: "Write one of each kind of sentence, using a list with commas in one of them." },
    ["eg-y2-apostrophes", "eg-y2-suffixes", "eg-y2-sentence-types", "eg-y2-commas-tense"], "Find apostrophes in a book or on a cereal box: is it missing letters or belonging?", "apostrophe, suffix, statement, question, exclamation, command, comma");

  addEngland("First", L, WRITE, ["LIT 1-22a"], "Year 3 grammar: a or an, prefixes, and words for time and cause",
    "We are learning to choose a or an, use prefixes, and use conjunctions, adverbs and prepositions to say when and why.",
    ["I can choose a or an.", "I can use prefixes such as super-, anti- and auto-.", "I can use words like when, before, because and during to show time and cause.", "I can punctuate direct speech with inverted commas."],
    { start: "Say: a apple, an apple. Which sounds right, and why?",
      teach: "Sort words by their first letter: a rock, an open box. Build prefixed words (supermarket, anti-clockwise, autograph). Tell a short story of your day using before, after, because and during. Write one line of speech with inverted commas around the words said.",
      practise: "The Year 3 grammar sets on PopSpell.",
      check: "Write two sentences about your weekend using before and because, and one with speech marks." },
    ["eg-y3-a-an", "eg-y3-prefixes", "eg-y3-time-cause", "eg-y3-perfect-speech"], "Retell a favourite film using then, after, because and during.", "conjunction, preposition, adverb, prefix, inverted commas, direct speech");

  addEngland("Second", L, WRITE, ["LIT 2-22a"], "Year 4 grammar: fronted adverbials, possessive apostrophes and Standard English",
    "We are learning to start sentences with fronted adverbials, show plural possession, and use Standard English verbs.",
    ["I can start a sentence with a fronted adverbial and a comma.", "I can tell girl's from girls'.", "I can use we were and I did in Standard English."],
    { start: "Change \"I heard the bad news later that day\" so it starts with when.",
      teach: "Move adverbials to the front and add the comma: After lunch, we played. Show the dog's bone against the dogs' bones, and children's toys. Spot and fix: \"we was late\", \"I done it\".",
      practise: "The Year 4 grammar sets on PopSpell.",
      check: "Write three sentences that start with a fronted adverbial, one using a plural possessive." },
    ["eg-y4-fronted", "eg-y4-possessive", "eg-y4-standard"], "Write a recount of the day with every sentence starting a different way.", "fronted adverbial, comma, possession, plural, Standard English");

  addEngland("Second", L, WRITE, ["LIT 2-22a"], "Year 5 grammar: relative clauses, possibility and parenthesis",
    "We are learning to add information with relative clauses and parenthesis, and show how likely something is.",
    ["I can add a relative clause with who, which, where, when, whose or that.", "I can use modal verbs and adverbs to show how likely something is.", "I can use brackets, dashes or commas for parenthesis."],
    { start: "\"The girl won the race.\" Add who she is without starting a new sentence.",
      teach: "Build sentences with relative clauses for people (who), things (which), places (where) and owners (whose). Put a weather forecast on a scale: will, should, might, could. Add extra information to a sentence three ways: brackets, dashes and commas.",
      practise: "The Year 5 grammar sets on PopSpell.",
      check: "Write a sentence with a relative clause, one with a modal verb and one with parenthesis." },
    ["eg-y5-relative", "eg-y5-possibility", "eg-y5-parenthesis", "eg-y5-verb-suffixes"], "Write a weather forecast for tomorrow using might, will and perhaps.", "relative clause, relative pronoun, modal verb, parenthesis, bracket, dash");

  addEngland("Second", L, WRITE, ["LIT 2-22a"], "Year 6 grammar: passive, formal language and punctuation between clauses",
    "We are learning to use the passive, formal language and the subjunctive, and semi-colons, colons and dashes.",
    ["I can turn an active sentence into the passive.", "I can choose formal words and use the subjunctive (If I were…).", "I can use a semi-colon, colon or dash between clauses, and a hyphen to avoid ambiguity."],
    { start: "\"I broke the window.\" How could you say it without saying who did it?",
      teach: "Flip active sentences into the passive and notice what comes first. Swap informal words for formal ones (find out: discover, ask for: request). Join two clauses with a semi-colon (It's raining; I'm fed up), introduce a list with a colon, and compare man eating shark with man-eating shark.",
      practise: "The Year 6 grammar sets on PopSpell.",
      check: "Write a formal letter opening that uses the passive, the subjunctive and a semi-colon." },
    ["eg-y6-passive", "eg-y6-formal", "eg-y6-punctuation", "eg-y6-synonyms"], "Rewrite a text message to a friend as a formal letter.", "active, passive, subjunctive, formal, semi-colon, colon, hyphen");

  addEngland("First", L, SPELL, ["LIT 1-21a"], "Year 1 common exception words",
    "We are learning to read and spell common exception words, noticing the tricky part.",
    ["I can read the Year 1 common exception words.", "I can spot the tricky part of a word.", "I can spell some of them from memory."],
    { start: "Read the, said and was from cards. Which part doesn't sound the way it looks?",
      teach: "For each word, sound out the parts that follow the rules and put a heart over the tricky part (said: s, d are regular; ai is tricky). Say it, spell it aloud, write it, then check it.",
      practise: "A Year 1 common exception words list on PopSpell, then read the Tricky word sentences.",
      check: "Read five words from the list, then write three from memory in a short dictated sentence." },
    ["cew-y1-1", "cew-y1-2", "cew-y1-3", "r-tricky"], "Pin three tricky words on the fridge: read them every morning.", "tricky word, common exception word, sound, letter");

  addEngland("First", L, SPELL, ["LIT 1-21a"], "Year 2 common exception words",
    "We are learning to read and spell the Year 2 common exception words.",
    ["I can read the Year 2 common exception words.", "I can explain which part of a word is tricky.", "I can spell them in my writing."],
    { start: "Read because, people and water. Which letters don't make their usual sound?",
      teach: "Group words that share a pattern (find, kind, mind, behind; old, cold, gold, hold, told). Mark the tricky part of the rest with a heart. Say, cover, write and check.",
      practise: "A Year 2 common exception words list on PopSpell.",
      check: "Write a sentence the tutor says that uses three of the words." },
    ["cew-y2-1", "cew-y2-2", "cew-y2-3", "cew-y2-4", "cew-y2-5"], "Spot these words in a reading book and read each one twice.", "common exception word, tricky part, pattern");

  addEngland("Second", L, SPELL, ["LIT 2-21a"], "Years 3 and 4 word list: roots, prefixes and suffixes",
    "We are learning to spell words from the Years 3 and 4 word list, using syllables, root words and the tricky part.",
    ["I can break a long word into syllables.", "I can find the root word and add prefixes and suffixes.", "I can spell words from the Years 3 and 4 list."],
    { start: "Clap the syllables of February, different and library. Which ones do people often miss out?",
      teach: "Take five words from the list. Say each in syllables, find any root word (accident, accidentally; possess, possession), and underline the tricky part. Use the first two or three letters to check a word in a dictionary.",
      practise: "The first Years 3 and 4 word lists on PopSpell; carry on through the rest over later lessons.",
      check: "Spell five words from today in a dictated sentence, then check them with the dictionary." },
    ["wl-y34-1", "wl-y34-2"], "Choose three words from the list and write them in a sentence each.", "syllable, root word, prefix, suffix, dictionary");

  addEngland("Second", L, SPELL, ["LIT 2-21a"], "Years 5 and 6 word list: morphology and etymology",
    "We are learning to spell words from the Years 5 and 6 word list, using word parts and where words come from.",
    ["I can use root words, prefixes and suffixes to spell long words.", "I can use where a word comes from to help spell it.", "I can check a spelling and meaning in a dictionary or thesaurus."],
    { start: "Which letters are doubled in accommodate, embarrass and necessary? How could you remember?",
      teach: "Take five words from the list. Split them into parts (environment: environ + ment), link related words (criticise, critic), and talk about where they come from (rhythm and rhyme are from Greek). Make a memory trick for the hardest one.",
      practise: "The first Years 5 and 6 word lists on PopSpell; carry on through the rest over later lessons.",
      check: "Spell five words from today, then look up one in a dictionary and one in a thesaurus." },
    ["wl-y56-1", "wl-y56-2"], "Find two of the words in a newspaper or online article.", "morphology, etymology, root word, prefix, suffix, thesaurus");

  addEngland("First", L, HAND, ["LIT 1-24a"], "Joined handwriting (Years 3 and 4)",
    "We are learning to join letters with diagonal and horizontal strokes, and keep our writing even.",
    ["I can join letters with diagonal and horizontal strokes.", "I know which letters are best left unjoined.", "I keep my letters the same size and my lines parallel."],
    { start: "Write your name your best way. Which letters already join?",
      teach: "Model a diagonal join (a to n, as in an) and a horizontal join (o to n, as in on). Practise joining pairs, then short words. Talk about letters many schools leave unjoined, such as capitals. Check that ascenders and descenders don't touch.",
      practise: "Use the letter formation sheet for any letters still formed the wrong way, then copy a short sentence in joined writing.",
      check: "Copy a sentence in joined writing: are the letters even, the joins smooth, and the lines parallel?" },
    ["handwriting-joins"], "Write a shopping list in joined handwriting.", "join, diagonal, horizontal, ascender, descender");

  addEngland("Second", L, HAND, ["LIT 2-24a"], "Writing legibly, fluently and at speed (Years 5 and 6)",
    "We are learning to write legibly and fluently, getting faster, and choosing the right style for the job.",
    ["I can write legibly and fluently at a good speed.", "I can choose when to join and when to print, such as for labels.", "I can choose the right pen or pencil for the task."],
    { start: "Write the alphabet joined as fast as you can while staying neat. Time it.",
      teach: "Compare a quick note, a neat final copy and a labelled diagram: which style fits each? Practise speed in short bursts, keeping letters legible. Talk about choosing a pen or pencil that suits the task.",
      practise: "Copy a paragraph in your best joined writing, then write the same in a quick note style.",
      check: "Time the alphabet again. Is it faster and still easy to read?" },
    [], "Write a birthday card in your best handwriting.", "legible, fluent, joined, print, presentation");

  addEngland("Second", M, NUM, ["MNU 2-03a"], "Getting ready for the times tables check (Year 4)",
    "We are learning to recall multiplication facts up to 12 × 12 quickly.",
    ["I can recall multiplication facts up to 12 × 12.", "I can use facts I know to work out ones I'm stuck on.", "I can answer within 6 seconds."],
    { start: "Quick-fire: 6 × 4, 7 × 8, 9 × 6, 12 × 3. Which felt hardest?",
      teach: "Find the facts still to learn (often the 6, 7, 8, 9 and 12 tables). Use derived facts: 6 × 7 is 5 × 7 plus 7; 9 × 8 is 10 × 8 take 8; 12 × 4 is 10 × 4 plus 2 × 4. Show that 3 × 8 and 8 × 3 are the same fact.",
      practise: "6, 7, 8 and 9 times tables on PopSpell, then the timed times tables check practice: 25 questions, 6 seconds each.",
      check: "Do the timed practice again. Which facts were missed? They go on the list for next time." },
    ["n-tables-6-9", "n-mtc"], "Five minutes of tables a day: in the car, at teatime or before bed.", "multiply, times table, fact, product, commutative");

  addEngland("First", L, PHON, ["ENG 1-12a", "LIT 1-13a"], "Getting ready for the phonics check (Year 1)",
    "We are learning to read real and made-up words by saying the sounds and blending them.",
    ["I can say the sound for each letter and digraph quickly.", "I can blend sounds to read real words and alien words.", "I can read words with longer vowel sounds, such as ai, ee and igh."],
    { start: "Flash grapheme cards: sh, ch, th, ai, ee, igh, oa, ar. Say the sound as fast as you can.",
      teach: "Read real words, then alien words that use the same sounds (ship, then shup). Remind them alien words have no meaning, so sound out every grapheme and blend: there's no guessing from a picture or a word they know.",
      practise: "Sound Switch on PopSpell, then the phonics check practice with you (Pupils → 🔤 Phonics check practice).",
      check: "Read ten words, a mix of real and alien. Which graphemes caused trouble?" },
    ["g-switch-first", "g-switch-build"], "Make up alien names together and read them aloud.", "sound, grapheme, blend, real word, alien word");

  // Checking understanding, not just the right answer: a question to ask at the end of each lesson,
  // and what a pupil who understands will say or do. (Know: the words to use. Do: the success criteria.)
  const UNDERSTAND = {
    "early-estimate-then-count": ["Why is it fine if your guess wasn't exactly right?", "Knows a guess is a sensible estimate, then counting checks it; can say if the count was more or less than the guess."],
    "early-counting-to-20-and-beyond": ["If I count these again starting from a different one, will I get the same number? Why?", "Knows the total doesn't change with the order, and that the last number counted tells how many."],
    "early-before-after-and-in-between": ["How do you know 14 comes after 13 and not before?", "Uses the counting order or a number line: after means one more."],
    "early-adding-and-taking-away-within-10": ["Here is 6 + 2. Can you tell me a story that matches it?", "Makes up a sensible story: something is added to a group, and the total is bigger."],
    "early-doubles-and-splitting-numbers-to-10": ["Can 7 be split another way? How many ways can you find?", "Finds more than one split (5 and 2, 4 and 3) and sees both parts together make 7."],
    "early-sharing-equally-and-halves": ["Is this half? How do you know?", "Checks both parts are the same size or the same number, not just that there are two parts."],
    "early-coins-and-paying-up-to-10p": ["Which is worth more, one 5p coin or three 1p coins? Why?", "Knows a coin's value isn't how many coins there are: 5p is worth more than 3p."],
    "early-days-routines-and-o-clock": ["What happens before lunch? What happens after?", "Orders real events in their day and uses before, after, next."],
    "early-longer-heavier-and-holds-more": ["How could we check which is longer fairly?", "Lines the ends up together, or uses the same thing to measure both."],
    "early-copying-and-continuing-patterns": ["What comes next? How do you know?", "Names the part that repeats and uses it to say what comes next."],
    "early-sorting-2d-shapes-and-3d-objects": ["Is this still a triangle if I turn it round? Why?", "Knows turning a shape doesn't change it: it still has 3 sides and 3 corners."],
    "early-position-direction-and-symmetry": ["Tell me how to get from the door to your chair.", "Gives clear directions using forwards, turn, next to, behind."],
    "early-sorting-and-simple-charts": ["What does our chart tell us? Which has the most?", "Reads the chart to answer a question, not just describing the pictures."],
    "first-rounding-to-estimate": ["Why would you round before you work it out?", "Uses rounding to check whether an answer is sensible."],
    "first-place-value-to-1000": ["What is the 4 worth in 346? What if it moved to the hundreds?", "Explains the value of a digit depends on its place."],
    "first-counting-in-2s-5s-10s-and-100s": ["What do you notice about numbers when you count in 5s?", "Spots the pattern (they end in 0 or 5) and uses it to continue or check."],
    "first-adding-and-subtracting-within-20": ["If 8 + 6 = 14, what else do you know?", "Uses the fact to find others: 6 + 8 = 14, 14 − 6 = 8, 14 − 8 = 6."],
    "first-adding-and-subtracting-to-1000": ["How could you check your answer?", "Uses the inverse (adds back) or an estimate to check, and explains why the check works."],
    "first-multiplication-facts-2-3-4-5-and-10": ["How could 2 × 5 help you work out 4 × 5?", "Uses doubling or facts they know to find a new fact, rather than counting from the start."],
    "first-division-sharing-and-grouping": ["Here is 12 ÷ 3. Show it as sharing, then as grouping.", "Can show both and knows the answer is the same."],
    "first-multiplying-and-dividing-by-10-and-100": ["What happens to the digits when you multiply by 10?", "Says the digits move one place bigger, rather than just \"add a zero\"."],
    "first-solving-two-step-problems": ["Before you work it out: what are the two steps, and why that order?", "Explains which operation each step needs and why."],
    "first-what-fractions-are": ["Which is bigger, one half or one quarter of the same pizza? Why?", "Explains more equal parts means each part is smaller."],
    "first-fractions-of-amounts-and-equivalent-fractions": ["How do you find a quarter of 20? Why does that work?", "Links finding a quarter to sharing into 4 equal groups."],
    "first-paying-and-change-within-10": ["You pay with 10p for something that costs 7p. How much change? How did you work it out?", "Counts on from the cost to the amount paid, or takes away, and explains which."],
    "first-half-past-quarter-past-and-quarter-to": ["Why is the hour hand between two numbers at half past?", "Knows the hour hand moves on through the hour, not just the minute hand."],
    "first-calendars-dates-and-how-long": ["How long is it from Monday to Thursday? How do you know?", "Counts the gaps (days passing), not the days named."],
    "first-measuring-with-rulers-scales-and-jugs": ["Why do we use centimetres instead of hand spans?", "Explains standard units give the same answer whoever measures."],
    "first-area-by-counting-squares": ["Can two different shapes have the same area?", "Yes: area is how many squares are covered, not what the shape looks like."],
    "first-number-patterns-and-rules": ["What's the rule? What will the 10th number be?", "States the rule in words and uses it to predict, without listing every number."],
    "first-equals-greater-than-and-missing-numbers": ["What does = mean in 7 + 3 = 6 + 4?", "Explains both sides are worth the same, not \"the answer comes next\"."],
    "first-describing-2d-shapes-and-3d-objects": ["How is a cube different from a square?", "Knows a cube is 3D with faces, edges and corners, and its faces are squares."],
    "first-turns-right-angles-and-compass-points": ["If you face north and make a quarter turn clockwise, which way do you face?", "Says east, and can show the turn with their body or a pointer."],
    "first-grid-references-and-symmetry": ["Why does the order of a grid reference matter?", "Explains B3 and 3B point to different places if the order is swapped: across first, then up."],
    "first-collecting-and-showing-data": ["What question could someone answer from your chart?", "Asks and answers a question the data really shows, such as which is most popular."],
    "first-how-likely-is-it": ["Is it impossible or just unlikely that it will snow tomorrow? Why?", "Explains the difference: unlikely can still happen, impossible can't."],
    "first-numbers-in-life-work-and-history": ["Where have you seen numbers used today? What were they for?", "Gives real examples and what the number told someone (time, price, a bus number)."],
    "second-rounding-large-numbers-and-decimals": ["When is rounding useful, and when do you need the exact number?", "Gives sensible examples: estimating a shopping total vs. paying the exact amount."],
    "second-place-value-to-a-million": ["Is 300 000 bigger than 299 999? How can you tell without counting?", "Compares from the biggest place value first."],
    "second-decimals-to-three-places": ["Which is bigger, 0.4 or 0.35? Why?", "Explains 0.4 is 4 tenths and 0.35 is 3 tenths and 5 hundredths, so 0.4 is bigger."],
    "second-adding-and-subtracting-large-numbers-and-decimals": ["Why do the decimal points need to line up?", "Explains digits of the same value must be added together."],
    "second-multiplication-and-division-facts-and-10-100-1000": ["What is 3.5 × 10? Why doesn't \"add a zero\" work here?", "Says 35, explaining each digit becomes ten times bigger."],
    "second-multiplying-by-2-digits-and-dividing-with-decimal-answers": ["Estimate 38 × 21 first. Is your answer close?", "Rounds to 40 × 20 = 800 and uses it to check."],
    "second-order-of-operations": ["Why does 2 + 3 × 4 not equal 20?", "Explains multiplication is done before addition unless brackets say otherwise."],
    "second-negative-numbers": ["Which is warmer, −2 °C or −7 °C? Why?", "Uses a number line or thermometer: −2 is nearer zero, so warmer."],
    "second-multiples-factors-and-primes": ["Why is 9 not a prime number?", "Explains 9 has a factor other than 1 and itself (3)."],
    "second-fractions-decimals-and-percentages-are-linked": ["Show me a half three different ways.", "Writes 1/2, 0.5 and 50%, and explains they are the same amount."],
    "second-percentages-and-fractions-of-amounts": ["Is 25% of 80 the same as a quarter of 80? Why?", "Yes: 25% and a quarter are the same proportion."],
    "second-equivalent-fractions-and-simplest-form": ["Why are 2/4 and 1/2 the same?", "Draws or explains the same amount split into more parts."],
    "second-budgets-best-value-profit-and-loss": ["Is the bigger pack always better value? How can you tell?", "Compares the price per item or per gram, not just the total."],
    "second-12-and-24-hour-time-and-timetables": ["What time is 15:45 on a 12-hour clock? How did you work it out?", "Takes 12 off the hours: quarter to four in the afternoon."],
    "second-durations-units-of-time-speed-and-distance": ["Why can't you subtract 10:50 from 11:20 like ordinary numbers?", "Explains there are 60 minutes in an hour, so counts on through the hour."],
    "second-estimate-measure-and-convert-metric-units": ["How many millimetres in 4.5 cm? How do you know?", "Says 45 and explains there are 10 mm in each centimetre."],
    "second-perimeter-area-and-volume": ["Can two rectangles have the same perimeter but a different area?", "Yes, with an example: 1 × 5 and 2 × 4 both have a perimeter of 12 but areas of 5 and 8."],
    "second-square-triangular-and-fibonacci-numbers": ["Why are they called square numbers?", "Shows the number as a square array of dots."],
    "second-solving-simple-equations": ["In 3n + 2 = 14, how do you find n? How can you check?", "Undoes the steps in reverse, then puts the value back in to check."],
    "second-shape-properties-nets-and-circles": ["Will this net fold into a cube? How do you know?", "Imagines or tests the folding and spots faces that would overlap."],
    "second-classifying-and-measuring-angles": ["Without measuring, is this angle more or less than 90°?", "Compares to a right angle first, then measures to check."],
    "second-compass-points-scale-and-coordinates": ["On a scale of 1 cm to 2 km, how far is 3.5 cm?", "Multiplies by the scale: 7 km, and explains why."],
    "second-lines-of-symmetry": ["Does a rectangle have a diagonal line of symmetry? Prove it.", "Folds or reflects to show the halves don't match, so no."],
    "second-graphs-pie-charts-and-reliable-data": ["Could this data be misleading? Why?", "Looks at the sample size, who collected it and the scale."],
    "second-probability-and-chance-experiments": ["You flipped 4 heads in a row. Is tails more likely next? Why?", "Knows each flip is still an even chance: what happened before doesn't change it."],
    "second-maths-in-inventions-life-and-work": ["What maths would someone use in this job? Give an example.", "Names the maths (measuring, angles, money, data) and a real task it's used for."],
    "early-rhyme-and-patterns-in-words": ["Do cat and cup rhyme? Why not?", "Says they start the same but end differently; rhymes have the same ending sound."],
    "early-hearing-the-sounds-in-words": ["How many sounds in ship? Show me.", "Says 3 (sh-i-p) and knows two letters can make one sound."],
    "early-letter-sounds-and-blending-to-read": ["Here's a word you haven't seen: sip. How will you read it?", "Says each sound and blends them, without guessing from a picture."],
    "early-two-letters-one-sound-sh-ch-and-th": ["Why do we say s-h as one sound in shop?", "Knows the two letters work together to make one sound."],
    "early-reading-tricky-words": ["Which part of the word is tricky? Which part can you sound out?", "Points to the tricky part (the heart part) and sounds out the rest."],
    "early-talking-about-a-story": ["What do you think will happen next? What makes you think that?", "Gives a prediction and a reason from the story or the pictures."],
    "early-listening-taking-turns-and-following-instructions": ["What did your partner just say? Tell me in your own words.", "Repeats the main idea, showing they listened."],
    "early-forming-lowercase-letters": ["Where does this letter start? Show me with your finger.", "Starts in the right place and moves the right way without a model."],
    "early-writing-a-sentence": ["How do you know where your sentence starts and ends?", "Points to the capital letter and full stop, and reads the sentence back."],
    "early-choosing-and-sharing-stories-i-like": ["Why did you choose that book? What did you like or not like about it?", "Gives a reason linked to the book (the cover, the characters, a funny part), not just \"it's good\"."],
    "early-asking-questions-about-stories": ["What question would you ask the character? Why?", "Asks a real question about the story, and links it to something they know or have done."],
    "early-sharing-my-news-and-new-words": ["Tell me your news again, using our new word.", "Tells events in order and uses the new word correctly, in a way that fits."],
    "early-finding-information-in-signs-and-books": ["How did this sign or page help us? What can we do now we know that?", "Explains what the information tells them and uses it to choose or plan something."],
    "early-telling-and-drawing-my-own-story": ["What's the problem in your story, and how does it end?", "Tells a beginning, middle and end in order."],
    "first-silent-e-a-e-i-e-o-e-u-e": ["What does the e do in hope? Read hop and hope.", "Explains the e changes the vowel sound, and reads both correctly."],
    "first-vowel-teams-ai-ee-oa-igh": ["How do you know whether to write ai or ay?", "Knows ay usually comes at the end of a word and ai in the middle."],
    "first-vowels-with-r-ar-or-er-ir-ur": ["Bird, her and turn all have the same sound. Why are they spelled differently?", "Knows one sound can be written in more than one way, and learns which way each word uses."],
    "first-common-words-and-spelling-strategies": ["You're stuck on a word. What could you try?", "Names a strategy: sound it out, think of a word like it, write it and check if it looks right."],
    "first-reading-aloud-with-expression": ["Why did you change your voice there?", "Links expression to the punctuation or a character's feelings."],
    "first-answering-questions-about-a-text": ["How do you know? Show me the words that tell you.", "Points to evidence in the text, not just memory."],
    "first-finding-information-and-making-notes": ["Why didn't you copy the whole sentence?", "Explains notes keep the key words only."],
    "first-full-stops-question-marks-and-exclamation-marks": ["Why did you use a question mark here?", "Explains the sentence asks something."],
    "first-joining-sentences-and-but-because-so": ["What's the difference between \"I was cold so I wore a coat\" and \"I was cold but I wore a coat\"?", "Explains so gives a result and but shows a contrast."],
    "first-past-tense-and-checking-my-writing": ["How do you know this sentence is about the past?", "Points to the past-tense verbs, and spots one that doesn't match."],
    "first-dictation-spelling-and-punctuation-together": ["Read your sentence back. What did you check?", "Checks capital letter, spellings and full stop without being told."],
    "first-planning-and-writing-a-recount": ["Why does a recount need time words?", "Explains they show the order things happened in."],
    "first-writing-a-story-with-characters-and-a-setting": ["How did you show your character was scared, without saying \"scared\"?", "Points to actions, words or feelings that show it."],
    "first-listening-for-main-ideas-and-fact-or-opinion": ["Is \"dogs are the best pets\" a fact or an opinion? How do you know?", "Explains an opinion can't be proved true; a fact can be checked."],
    "first-choosing-texts-and-explaining-why": ["Why would you recommend that book to a friend, and not this one?", "Gives reasons about the text itself (the author's style, the topic, the pictures), comparing the two."],
    "first-listening-and-talking-in-a-group": ["What did I just say? What would be a good question to ask me about it?", "Sums up what you said and asks a question that follows on from it."],
    "first-notes-from-listening-then-using-them": ["Why are notes just key words? Could someone else understand your notes?", "Explains notes save time and keep the main ideas; uses them to retell in order."],
    "first-fact-and-opinion-in-what-i-read": ["Is \"Edinburgh is the best city\" a fact or an opinion? How could you check?", "Explains it's an opinion because it can't be checked; a fact can be found in a reliable book."],
    "first-writing-to-share-information-or-an-opinion": ["Which of your sentences informs, and which persuades? How can you tell?", "Points to facts that inform and to reasons and \"you should\" that persuade."],
    "first-clear-legible-handwriting": ["Why does it matter that your letters are the right size?", "Explains it helps a reader read it easily."],
    "second-spelling-rules-ing-plurals-and-endings": ["Why does hop become hopping but jump becomes jumping?", "Explains doubling after a short vowel with one consonant."],
    "second-tricky-spelling-patterns-soft-c-and-g-silent-letters-ph": ["Why does the c in city sound like s?", "Knows c is usually soft before e, i or y."],
    "second-reading-fluently-with-pace-and-expression": ["How did the way you read help a listener understand?", "Links pace, pauses and emphasis to the meaning."],
    "second-inference-reading-between-the-lines": ["The text doesn't say it. What makes you think so?", "Gives a clue from the text and explains what it suggests."],
    "second-fact-opinion-and-persuasion": ["Why might an advert use opinions and not just facts?", "Explains opinions persuade, and that facts can be chosen to suit the writer."],
    "second-skimming-scanning-and-notes-in-own-words": ["When would you skim, and when would you scan?", "Skim for the gist, scan for a specific detail, with an example of each."],
    "second-commas-speech-marks-and-apostrophes": ["What's the difference between the girl's coats and the girls' coats?", "Explains one owner vs. more than one owner."],
    "second-varying-sentences-and-using-paragraphs": ["Why did you start a new paragraph here?", "Gives a reason: new time, place, person or idea."],
    "second-dictation-longer-sentences": ["Which part was hardest to remember, and how did you hold it in your head?", "Uses a strategy: repeating it, chunking it, saying it while writing."],
    "second-writing-to-inform-or-persuade": ["Who is your reader, and how did that change what you wrote?", "Links word choice and tone to the audience and purpose."],
    "second-writing-a-story-plot-character-and-setting": ["How does the setting add to the mood of your story?", "Points to description that creates atmosphere and fits what happens."],
    "second-choosing-texts-and-authors-and-writing-my-own-choice": ["Why did you choose that form for your own text?", "Links the form and style to the audience and purpose, for example a comic for younger readers."],
    "second-group-discussion-building-on-others-ideas": ["How did what I said change your thinking?", "Refers to your point and builds on it or disagrees respectfully with a reason."],
    "second-notes-from-listening-in-my-own-words": ["Why does it matter to say where your information came from?", "Explains it shows the information can be checked and gives credit to the source."],
    "second-questions-fact-and-opinion-in-what-i-hear": ["Was the advert a useful source? Why or why not?", "Weighs it up: it wants to sell, so it chooses facts and adds opinions, so check elsewhere."],
    "second-planning-and-giving-a-short-talk": ["What did you do to keep your audience interested?", "Names techniques: a question, an example, eye contact, changing their voice."],
    "england-year-1-grammar-plurals-un-and-capital-letters": ["Why does box need -es but cat only -s?", "Hears the extra beat (boxes), or knows -es comes after s, x, z, sh and ch."],
    "england-year-2-grammar-apostrophes-suffixes-and-sentence-types": ["Why is there an apostrophe in can't?", "Explains it shows where letters are missed out (cannot)."],
    "england-year-3-grammar-a-or-an-prefixes-and-words-for-time-and-cause": ["Why do we say an apple but a banana?", "Explains an goes before a vowel sound."],
    "england-year-4-grammar-fronted-adverbials-possessive-apostrophes-and-standard-english": ["Why is there a comma after \"Later that day\"?", "Explains the comma comes after a fronted adverbial."],
    "england-year-5-grammar-relative-clauses-possibility-and-parenthesis": ["What does the relative clause add to this sentence?", "Explains it gives extra information about the noun."],
    "england-year-6-grammar-passive-formal-language-and-punctuation-between-clauses": ["Why might a writer use the passive: \"The window was broken\"?", "Explains it hides or doesn't need who did it."],
    "england-year-1-common-exception-words": ["Which part of said is tricky?", "Points to the ai (it doesn't make its usual sound) and sounds out the rest."],
    "england-year-2-common-exception-words": ["How will you remember the tricky part of because?", "Uses a strategy: saying it in syllables, a phrase or noticing the tricky part."],
    "england-years-3-and-4-word-list-roots-prefixes-and-suffixes": ["Which root word is in disappear? How does that help you spell it?", "Finds the root (appear) and adds the prefix without changing it."],
    "england-years-5-and-6-word-list-morphology-and-etymology": ["Where does the word come from, and does that help you spell it?", "Uses a word family or origin to explain a spelling."],
    "england-joined-handwriting-years-3-and-4": ["Which letters don't join? Why not?", "Names the letters their school doesn't join (often capitals and some after letters such as b, g, j, p, x, y)."],
    "england-writing-legibly-fluently-and-at-speed-years-5-and-6": ["When would you use neat print, and when quick joined writing?", "Matches style to the task: labels or a final copy vs. notes."],
    "england-getting-ready-for-the-times-tables-check-year-4": ["You don't know 7 × 8. What fact could help?", "Uses a known fact: 7 × 8 is double 7 × 4, or 7 × 7 + 7."],
    "england-getting-ready-for-the-phonics-check-year-1": ["Why can't you guess an alien word?", "Explains alien words aren't real, so you have to sound out every part."]
  };
  lessons.forEach(l => { const u = UNDERSTAND[l.id.replace(/^lesson-/, "")]; if (u) [l.understand, l.lookFor] = u; });

  const LEVELS = ["Early", "First", "Second"];
  return {
    all: () => lessons.slice(),
    get: id => lessons.find(l => l.id === id) || null,
    // Lessons that use a piece of PopSpell work, for suggesting them when a pupil finds it hard
    forWork: id => lessons.filter(l => l.use.includes(id)),
    // Lessons for an area and CfE level, in teaching order (England's own lessons come last)
    forArea: (subject, level) => lessons.filter(l => l.subject === subject && (!level || l.level === level)),
    LEVELS,
    MINUTES: { start: 5, teach: 10, practise: 10, check: 5 }
  };
})();
