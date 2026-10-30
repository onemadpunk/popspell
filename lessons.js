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

  add("First", L, TALK, ["LIT 1-04a", "LIT 1-07a", "LIT 1-09a"], "Listening for main ideas, and fact or opinion",
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
    ["letter-formation"], "Write a birthday card in best handwriting.", "handwriting, spacing, size, neat, legible");

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

  const LEVELS = ["Early", "First", "Second"];
  return {
    all: () => lessons.slice(),
    get: id => lessons.find(l => l.id === id) || null,
    // Lessons that use a piece of PopSpell work, for suggesting them when a pupil finds it hard
    forWork: id => lessons.filter(l => l.use.includes(id)),
    // Lessons for an area and level, in teaching order
    forArea: (subject, level) => lessons.filter(l => l.subject === subject && (!level || l.level === level)),
    LEVELS,
    MINUTES: { start: 5, teach: 10, practise: 10, check: 5 }
  };
})();
