/*
  READY LESSONS — a lesson for every area of the Curriculum for Excellence literacy and numeracy
  benchmarks, at Early, First, Second and Third level, so a tutor can support any gap straight away.

  Each lesson is built from the official guidance only (Education Scotland's Experiences and
  Outcomes and Benchmarks, June 2017): the success criteria are the benchmark statements for that
  area, in "I can" form. A lesson is about 30 minutes: start (5), teach (10), practise (10),
  check (5). It links to PopSpell's online work and printable sheets where they fit ("use"), and
  ends with something to do at home.

    level     Early | First | Second | Third
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
    ["n-money-10"], "Let your child pay for something small and talk about the coins.", "coin, pence, pound, pay, price, change, enough");

  add("Early", M, TIME, ["MNU 0-10a"], "Days, routines and o'clock",
    "We are learning about the order of our day, the days of the week and o'clock.",
    ["I can put the events of my day in order.", "I can say the days of the week in order and know the months and seasons.", "I can read o'clock times on a clock and a digital display.", "I know the hour hand and the minute hand."],
    { start: "What did you do first today? What happens next? What happens at night?",
      teach: "Order picture cards of a day (wake up, breakfast, school, tea, bed). Say the days of the week and talk about the seasons. On a clock, show the minute hand pointing to 12 for o'clock and move the hour hand.",
      practise: "Telling the time: the o'clock questions.",
      check: "Set 3 o'clock on a clock: what time is it? What day comes after Tuesday?" },
    ["n-time-oclock"], "Point out o'clock times at home and talk about tomorrow's day.", "o'clock, hour hand, minute hand, morning, afternoon, night, days, months, seasons");

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
    ["m-patterns-early"], "Spot patterns on clothes, tiles and fences.", "pattern, repeat, next, missing");

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
    ["n-round-10", "n-round-10-100"], "Round prices in the shop to estimate the total.", "round, nearest, estimate, about, check, sensible");

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
    ["n-best-value", "n-money"], "Compare unit prices together when shopping.", "budget, afford, best value, profit, loss, bank card");

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

  /* ===================== Numeracy and mathematics: Third level (S1 to S3) ===================== */

  add("Third", M, NUM, ["MNU 3-01a"], "Rounding to decimal places and estimating",
    "We are learning to round to a sensible degree of accuracy and to estimate answers.",
    ["I can round decimal fractions to three decimal places.", "I can choose how accurately to round, thinking about the problem.", "I can round to estimate the answer to a calculation, then use the estimate to check."],
    { start: "Round 4·276 to the nearest whole number, then to one decimal place.",
      teach: "Zoom in on a number line between 4·27 and 4·28 to show why 4·276 rounds to 4·28. Round 3·14159 to 1, 2 and 3 decimal places. Talk about context: money to 2 places, a shelf to the nearest centimetre, buses for 130 people always rounded up. Estimate 38·7 × 5·2 as 40 × 5 = 200 before calculating.",
      practise: "Rounding to 100 and 1000, then Estimating answers, then the \"Round it sensibly\" sheet.",
      check: "Round 7·0459 to 2 decimal places. Estimate 61·8 ÷ 2·9: how does the estimate tell you a calculator answer is sensible?" },
    ["n-round-100", "n-estimate"], "Estimate the shopping bill before you reach the till, then compare.", "round, decimal place, degree of accuracy, estimate, approximately");

  add("Third", M, NUM, ["MNU 3-03a", "MNU 3-03b"], "Calculating with whole numbers and decimals",
    "We are learning to recall facts quickly, choose a method, calculate accurately with decimals and explain our working.",
    ["I can recall multiplication and division facts quickly, and use facts to the 12 times table.", "I can add and subtract whole numbers and decimals to three decimal places.", "I can multiply and divide whole numbers and decimals to three decimal places.", "I can explain my method and my answer clearly."],
    { start: "Quick fire: 7 × 8, 72 ÷ 9, 11 × 12, 144 ÷ 12.",
      teach: "Line up the decimal points for 12·45 + 3·078 and 20 − 6·375, filling gaps with zeros. Multiply 4·26 × 7 by working out 426 × 7, then placing the point by estimating. Divide 9·36 ÷ 4 by short division. Ask the pupil to say each step aloud, then write a one-line explanation of the method.",
      practise: "6, 7, 8 and 9 times tables and Division facts for speed, then the \"Decimal calculations\" sheet.",
      check: "Work out 15·8 − 7·256 and 3·45 × 6. How did you check each answer?" },
    ["n-tables-6-9", "n-division", "n-big-add"], "Split a bill, or work out the cost of several items with prices in pounds and pence.", "decimal point, place value, method, estimate, inverse, check");

  add("Third", M, NUM, ["MNU 3-04a"], "Negative numbers in calculations",
    "We are learning to add, subtract, multiply and divide with negative numbers, and use them to solve problems.",
    ["I can add and subtract with integers, as in −3 + 8 and 4 − 9.", "I can multiply and divide with integers, as in −4 × 3 and −12 ÷ −4.", "I can use negative numbers to solve problems about temperature, money or height."],
    { start: "The temperature is −2°C and falls 5 degrees. What is it now?",
      teach: "Use a vertical number line, like a thermometer, for adding and subtracting. Show subtracting a negative as finding the gap: 3 − (−2) is the distance from −2 up to 3, which is 5. Find the multiplying rules from a pattern: 3 × −2 = −6, 2 × −2 = −4, 1 × −2 = −2, 0 × −2 = 0, so −1 × −2 = 2. Link division to the multiplication facts.",
      practise: "Negative numbers, then the \"Below zero\" sheet.",
      check: "Work out −6 − 4, 5 − (−3) and −20 ÷ 5. A diver is 12 m below the surface and rises 7 m: where are they now?" },
    ["n-negative"], "Look up temperatures in cold places around the world and find the differences.", "integer, negative, positive, below zero, difference, number line");

  add("Third", M, NUM, ["MTH 3-05a", "MTH 3-05b"], "Common multiples, common factors and primes",
    "We are learning to find common multiples and factors, identify primes, and use them to solve problems.",
    ["I can find common multiples, including the lowest common multiple, and explain my method.", "I can find common factors, including the highest common factor, and explain my method.", "I can identify prime numbers to 100 and explain how I know.", "I can write a number as a product of its prime factors.", "I can solve problems using multiples and factors."],
    { start: "Is 51 prime? Convince me.",
      teach: "List multiples of 6 and 8 to find the lowest common multiple (24), and factor pairs of 36 and 48 to find the highest common factor (12). Draw a factor tree for 60 to write it as 2 × 2 × 3 × 5. Sieve a 100 square for primes. Solve: buses every 12 and 18 minutes leave together at 9:00. When do they next leave together?",
      practise: "Multiples, factors and primes, then the \"Factor trees and primes\" sheet.",
      check: "Find the highest common factor and lowest common multiple of 18 and 24. Write 84 as a product of primes." },
    ["n-multiples"], "Find the prime dates on this month's calendar.", "multiple, factor, common, lowest common multiple, highest common factor, prime, prime factor, factor tree");

  add("Third", M, NUM, ["MTH 3-06a"], "Powers and indices",
    "We are learning what powers mean, and to work them out mentally or with a calculator.",
    ["I can explain index notation and use the words index, exponent, power and base.", "I can evaluate whole number powers, as in 2⁴ = 16.", "I can write whole numbers as powers, as in 27 = 3³."],
    { start: "Fold a sheet of paper in half, again and again. How many layers after 1, 2, 3 and 4 folds?",
      teach: "Record the folds as 2, 2 × 2, 2 × 2 × 2 and write 2³: the base is 2 and the index (or exponent) is 3. Contrast 3² = 9 with 3 × 2 = 6. Work out powers mentally, then with a calculator's power key. Write 64 as 8², 4³ and 2⁶. Talk about why powers are useful: they're short, and show fast growth and very big numbers.",
      practise: "The \"Powers\" sheet, then check the answers with a calculator.",
      check: "Work out 5³ and 10⁴. Write 81 as a power of 3, and as a power of 9." },
    [], "Work out how many great-great-grandparents you have, using powers of 2.", "power, index, exponent, base, squared, cubed");

  add("Third", M, FDP, ["MNU 3-07a", "MTH 3-07c"], "Fractions, decimals and percentages in real life",
    "We are learning to convert between fractions, decimals and percentages, and use them to make choices.",
    ["I can convert fractions, decimal fractions and percentages into each other.", "I can convert between whole or mixed numbers, improper fractions and decimal fractions.", "I can calculate with fractions, decimals and percentages, with and without a calculator.", "I can use my answers to compare and make informed choices."],
    { start: "Which is bigger: ⅜, 0·4 or 35%?",
      teach: "Divide to turn ⅜ into 0·375 and 37·5%. Change 2¾ into 11/4 and 2·75 with a bar model. Find 17·5% of £240 by building it from 10%, 5% and 2·5%, then by calculator (0·175 × 240). Compare two offers on a £45 jacket: ⅓ off, or 30% off?",
      practise: "Percentages and Equivalent fractions, then the \"Which deal?\" sheet.",
      check: "Write 7/8 as a decimal and as a percentage. Which is better: 25% off £60, or £14 off?" },
    ["n-percent", "n-equivalent", "en-fractions-y6"], "Compare discounts on a shopping website or in a shop window.", "equivalent, convert, mixed number, improper fraction, decimal fraction, percentage, discount");

  add("Third", M, FDP, ["MTH 3-07b"], "Adding and subtracting fractions",
    "We are learning to add and subtract fractions with different denominators.",
    ["I can use equivalent fractions and common multiples to find a common denominator.", "I can add and subtract whole numbers and fractions, including when I need to change a denominator.", "I can simplify my answer, and change an improper fraction to a mixed number."],
    { start: "Shade ⅓ and ¼ of the same bar. Why can't we just add the tops and the bottoms?",
      teach: "Use the lowest common multiple of 3 and 4 to rename both: 4/12 + 3/12 = 7/12. Work through ⅚ − ¼, then 2½ + 1⅔ (whole numbers first, then the fractions). Simplify, and change improper answers into mixed numbers.",
      practise: "Mixed numbers and calculating with fractions, then the \"Fraction sums\" sheet.",
      check: "Work out ⅖ + ⅓ and 3¼ − 1⅔." },
    ["en-fractions-y5", "n-equivalent"], "Follow a recipe with fractions of a cup or spoon, and add up the total.", "denominator, numerator, common denominator, lowest common multiple, equivalent, simplify, mixed number");

  add("Third", M, FDP, ["MNU 3-08a"], "Proportion and ratio",
    "We are learning to increase and decrease quantities in proportion, and to use ratio.",
    ["I can solve problems where related quantities increase or decrease in proportion.", "I can write quantities as a ratio and simplify it.", "I can use proportion and ratio in everyday problems, such as recipes and prices."],
    { start: "A recipe for 4 people uses 300 g of pasta. How much for 6 people?",
      teach: "Use the unitary method (find one, then many) and a ratio table for the recipe. Write the ratio of 6 teachers to 60 children as 6 : 60 = 1 : 10, and of teachers to everyone in the school as 6 : 66 = 1 : 11. Share £45 in the ratio 2 : 3 by counting parts. Talk about when things are not in proportion, such as a taxi with a fixed charge.",
      practise: "Ratio and proportion, then the \"Recipe for a crowd\" sheet.",
      check: "5 pens cost £3·60. What do 8 cost? Simplify 18 : 24." },
    ["en-ratio"], "Scale a family recipe up or down for a different number of people.", "ratio, proportion, simplify, unitary method, scale up, scale down, share");

  add("Third", M, MONEY, ["MNU 3-09a", "MNU 3-09b"], "Best value, budgets and money words",
    "We are learning to compare deals, plan a budget, and understand financial words.",
    ["I can compare products, contracts and services to find the best value for me, and justify my choice.", "I can make a budget, using technology where it helps, and plan for future costs.", "I know financial words such as debit, credit, APR, per annum, direct debit, standing order and interest rate.", "I can convert between currencies."],
    { start: "Phone A: £12 a month for 24 months. Phone B: £180 now, then £5 a month for 24 months. Which costs less overall?",
      teach: "Work out the total cost of each deal over the contract, then discuss what else matters: data, how long you're tied in, paying up front. Build a monthly budget in a spreadsheet or table with income, fixed costs and saving for a future cost. Explain each financial word with an everyday example. Convert £150 to euros at a given rate, then back.",
      practise: "Best value, budgets, profit and loss, then the \"Plan a budget\" sheet.",
      check: "Explain the difference between a direct debit and a standing order. At €1·16 to £1, how many euros do you get for £250?" },
    ["n-best-value"], "Compare two phone or streaming deals at home and work out the yearly cost of each.", "budget, income, expense, contract, APR, interest, per annum, debit, credit, direct debit, standing order, exchange rate");

  add("Third", M, TIME, ["MNU 3-10a"], "Speed, distance and time",
    "We are learning to use the link between speed, distance and time, and to work out durations.",
    ["I can use the link between speed, distance and time to find any one of them.", "I can calculate durations across hours and days.", "I can work out how long a journey will take, how far it is, or the average speed."],
    { start: "A car travels 60 miles in one hour. How far does it go in 2½ hours?",
      teach: "Show where distance = speed × time comes from (60 mph means 60 miles every hour), then rearrange it to find speed and time. Work in hours: 45 minutes = 0·75 hours. Find the time for 150 km at 60 km/h. Work out durations across midnight and across days on a timeline, such as 22:40 on Monday to 06:15 on Tuesday.",
      practise: "12-hour and 24-hour time, then the \"Journey planner\" sheet.",
      check: "A cyclist rides 36 km in 1 hour 30 minutes. What is their average speed? How long is it from 21:50 on Friday to 07:20 on Saturday?" },
    ["n-time-24", "n-durations"], "Plan a real journey with a timetable or map: distance, time and average speed.", "speed, distance, time, average speed, km/h, mph, duration");

  add("Third", M, MEAS, ["MNU 3-11a", "MTH 3-11b"], "Area and volume, including compound shapes",
    "We are learning to choose units, convert them, and find the area and volume of compound shapes.",
    ["I can choose sensible units for length, area and volume.", "I can convert between units, as in 2·5 m = 250 cm and 1500 ml = 1·5 litres, and use them in calculations.", "I can find an area when the measurements are in different units.", "I can find the area of compound 2D shapes made from squares, rectangles and triangles.", "I can find the volume of compound 3D objects made from cubes and cuboids."],
    { start: "Which unit would you use for the area of a stamp, a classroom, and a farm?",
      teach: "Split an L-shape into two rectangles in two different ways, and check both give the same area. Add a triangle (½ × base × height). Convert first when lengths are in metres and centimetres. Build a compound solid from cubes and find its volume by splitting it into cuboids (length × breadth × height). Link 1 cm³ to 1 ml.",
      practise: "Area and perimeter and Changing units, then the \"Floor plans and boxes\" sheet.",
      check: "Find the area of an L-shape and the volume of a step made from two cuboids. Which units did you use, and why?" },
    ["n-area", "n-units", "en-area-formulae"], "Measure a room and work out how much flooring it would need.", "area, volume, compound, cm², m², cm³, litre, length, breadth, height, formula");

  add("Third", M, NUM, ["MTH 3-12a"], "Researching a mathematician or a maths topic",
    "We are learning to research a mathematician or a maths topic, and present its impact on the world.",
    ["I can research a famous mathematician or a maths topic, using reliable sources.", "I can explain the maths using the right words and notation.", "I can explain the difference it has made to society.", "I can prepare and give a short presentation."],
    { start: "What do GPS, music streaming and weather forecasts have in common? (They all depend on maths.)",
      teach: "Agree a choice, such as Mary Somerville, John Napier, Ada Lovelace, Katherine Johnson or al-Khwarizmi, or a topic such as codes or logarithms. Model making notes from two sources and checking they agree. Plan a three-minute talk: who or what, the maths itself with one worked example, and its impact today. Rehearse with the tutor as the audience.",
      practise: "The \"Maths that changed the world\" sheet: notes, one worked example and a plan for the talk.",
      check: "Give the talk. Ask: what was the maths, and why does it still matter?" },
    [], "Give the talk to someone at home and ask them one thing they learned.", "research, source, notation, impact, presentation");

  add("Third", M, PAT, ["MTH 3-13a"], "Sequences and their rules",
    "We are learning to make sequences from rules, and to find and write the rule for a sequence.",
    ["I can generate a sequence from a rule, as in T = 4n + 6.", "I can extend a pattern and describe its rule.", "I can write a sequence rule in algebra, as in C = 0·05m + 75."],
    { start: "Squares made from matchsticks in a row use 4, 7, 10 … matches. How many for 10 squares?",
      teach: "Make the pattern, record it in a table of n and T, and spot the difference (+3). Show the rule T = 3n + 1 and why the +1 is needed. Generate terms from T = 4n + 6. Write a car-hire rule (£75 plus 5p a mile) as C = 0·05m + 75 and use it.",
      practise: "Number patterns, then the \"Find the rule\" sheet.",
      check: "Find the rule for 5, 9, 13, 17 … and use it to find the 20th term." },
    ["m-patterns"], "Find a pattern at home (stairs, tiles, fence posts) and write its rule.", "sequence, term, rule, nth term, difference, formula");

  add("Third", M, PAT, ["MTH 3-14a"], "Simplifying and evaluating expressions",
    "We are learning to collect like terms, and to evaluate expressions by substituting.",
    ["I can collect like terms, including squared terms, to simplify an expression.", "I can evaluate an expression with two variables, using positive and negative numbers."],
    { start: "3 apples + 2 bananas + 4 apples. How could you write that more simply?",
      teach: "Simplify 3a + 2b + 4a = 7a + 2b, then 5x² + 3x − 2x² + x = 3x² + 4x, stressing that x and x² are unlike terms. Substitute a = 3 and b = −2 into 4a − 3b and a² + 2b, writing each step with brackets.",
      practise: "The \"Simplify and substitute\" sheet.",
      check: "Simplify 6p − 2q + p + 5q. Find 2x² − y when x = −3 and y = 4." },
    [], "Write an expression for a family shop (a apples, b loaves) and work it out with real prices.", "term, like terms, expression, simplify, variable, substitute, evaluate");

  add("Third", M, PAT, ["MTH 3-15a", "MTH 3-15b"], "Solving equations and using formulae",
    "We are learning to write and solve equations, and to create and use formulae.",
    ["I can solve linear equations, as in 3x + 5 = 26 and 4x − 7 = −15.", "I can write an equation for a problem and solve it.", "I can create a simple formula from a diagram, problem or statement.", "I can evaluate a formula, as in C = 0·05m + 75."],
    { start: "I think of a number, multiply it by 3 and add 5. I get 26. What was my number?",
      teach: "Use a balance: whatever you do to one side, do to the other. Solve 3x + 5 = 26, then 4x − 7 = −15. Turn a word problem into an equation: a rectangle's perimeter is 30 cm and its length is twice its width. Write a formula for a taxi fare of £3 plus £1·20 a mile, then use it.",
      practise: "Missing numbers and signs, then the \"Equations and formulae\" sheet.",
      check: "Solve 5y − 9 = 16. Write a formula for the number of legs on c chairs (4 legs) and t stools (3 legs)." },
    ["m-equations", "en-area-formulae"], "Write a formula for a phone plan or taxi fare and check it against a real price.", "equation, solve, balance, inverse, formula, variable, substitute");

  add("Third", M, SHAPE, ["MTH 3-16a"], "Drawing shapes accurately",
    "We are learning to draw triangles and regular polygons accurately with mathematical instruments.",
    ["I can draw triangles accurately with a ruler and protractor, or a ruler and compasses.", "I can draw a regular polygon when I know its interior angle.", "I can choose the right instruments and method for the shape."],
    { start: "Can you draw a triangle with sides of 3 cm, 4 cm and 10 cm? Why not?",
      teach: "Model drawing a triangle from two sides and the angle between them with a protractor, then from three sides with compasses. Draw a regular hexagon (interior angle 120°) one side at a time with a protractor, then inside a circle with compasses. Check by measuring.",
      practise: "The \"Triangles and polygons, accurately\" sheet. Measure and check each other's drawings.",
      check: "Draw triangle ABC with AB = 7 cm, angle A = 50° and AC = 5 cm. Measure BC." },
    ["m-angles"], "Draw a regular pentagon (interior angle 108°) and turn it into a badge.", "protractor, compasses, construct, interior angle, regular polygon, accurate");

  add("Third", M, SHAPE, ["MTH 3-17a"], "Angles in shapes and with parallel lines",
    "We are learning to name angles and find missing angles using angle facts.",
    ["I can name angles with three letters, as in angle ABC.", "I can identify corresponding, alternate and vertically opposite angles, and use them to find missing angles.", "I can use the angle properties of triangles and quadrilaterals to find missing angles."],
    { start: "Tear the three corners off a paper triangle and put them together. What do you notice?",
      teach: "Name angles with three letters. Draw two parallel lines crossed by a third line and mark the F (corresponding), Z (alternate) and X (vertically opposite) angles. Find all eight angles from one. Use 180° in a triangle and 360° in a quadrilateral to find missing angles, giving a reason each time.",
      practise: "Angles and turns, then the \"Missing angles\" sheet.",
      check: "Find the missing angles and give a reason for each: which fact did you use?" },
    ["m-angles"], "Spot parallel lines and their angles on a gate, a window or road markings.", "corresponding, alternate, vertically opposite, parallel, transversal, angle sum");

  add("Third", M, SHAPE, ["MTH 3-17b", "MTH 3-17c"], "Bearings, scale drawings and enlargement",
    "We are learning to use bearings and scale to read and make plans, and to enlarge and reduce shapes.",
    ["I can use and give three-figure bearings.", "I can read maps and plans, and make accurate scale drawings of routes.", "I can enlarge and reduce shapes using a scale factor."],
    { start: "A map's scale is 1 : 50 000. What does 1 cm on the map stand for?",
      teach: "Measure bearings clockwise from north as three figures (east is 090°). Draw a route at 1 cm to 1 km: 4 km on a bearing of 060°, then 3 km on 150°. Measure the distance and bearing back to the start. Enlarge a shape on squared paper by scale factor 2 and reduce it by ½, comparing the lengths.",
      practise: "The \"Route and scale\" sheet: a scale drawing from bearings, then an enlargement.",
      check: "What is the bearing of west? A 3 cm by 5 cm photo is enlarged by scale factor 3. What size is it now?" },
    ["en-ratio"], "Use a map of your area to find the bearing and distance from home to school.", "bearing, north, clockwise, scale, scale drawing, scale factor, enlarge, reduce");

  add("Third", M, SHAPE, ["MTH 3-18a", "MTH 3-19a"], "Coordinates in four quadrants, and symmetry",
    "We are learning to plot and describe points anywhere on a grid, and to use lines of symmetry.",
    ["I can plot and describe the position of points in all four quadrants.", "I can identify all the lines of symmetry in 2D shapes.", "I can create and complete symmetrical patterns and pictures."],
    { start: "Where is (−3, 2)? Which way do you go first?",
      teach: "Draw axes from −6 to 6. Plot points in all four quadrants and join them to make a shape. Reflect it in the y-axis: what happens to the coordinates? Find every line of symmetry of a square, a rectangle, a kite and a regular hexagon. Complete a pattern that is symmetrical about two lines.",
      practise: "Coordinates: plotting, translating and reflecting, then the \"Four quadrants and symmetry\" sheet.",
      check: "Plot (2, −3) and reflect it in the y-axis. How many lines of symmetry does a regular pentagon have?" },
    ["en-coordinates"], "Find symmetrical logos or flags and draw in their lines of symmetry.", "coordinates, quadrant, axis, origin, reflect, line of symmetry");

  add("Third", M, DATA, ["MNU 3-20a", "MTH 3-20b", "MTH 3-21a"], "Data: fair samples, clear graphs and misleading claims",
    "We are learning to collect and display data fairly, and to judge whether information can be trusted.",
    ["I can find or collect data, using technology where it helps.", "I can interpret data and describe trends, as in an increasing trend.", "I can decide if information is robust, vague or misleading, thinking about the source, scale, sample size and how it is shown.", "I can choose a representative sample to avoid bias.", "I can display data clearly, choosing graphs such as compound bar charts, line graphs and pie charts."],
    { start: "\"9 out of 10 people prefer Fizz!\" What would you want to know before you believed it?",
      teach: "Show two graphs of the same data, one with an axis that doesn't start at zero. Which looks misleading, and why? Discuss sample size and how a sample was chosen (asking only a football club about favourite sports). Plan a fair survey. Draw a line graph of temperatures and describe the trend, then a pie chart of a small survey (angle = fraction × 360°).",
      practise: "Reading tables and Bar charts, then the \"Can you trust it?\" sheet.",
      check: "Give two reasons a graph or claim might mislead. Describe the trend in a line graph." },
    ["n-table", "n-bar", "en-mean"], "Find a graph in a news story or advert and decide if it's fair.", "data, sample, bias, representative, robust, misleading, trend, pie chart, line graph, compound bar chart");

  add("Third", M, DATA, ["MNU 3-22a"], "Probability from 0 to 1",
    "We are learning to calculate probabilities and use them to make decisions.",
    ["I can use the probability scale from 0 to 1, writing probability as a fraction or a decimal.", "I can calculate the probability of a simple event, as in throwing a prime number on a 12-sided dice.", "I can list all the outcomes of an event and find the probability of each.", "I can use a probability to work out an expected number, as in days of rain.", "I can explain how the consequences of an event, as well as its probability, affect decisions."],
    { start: "Put these on a line from 0 to 1: rolling a 7 on a normal dice, a coin landing heads, the sun rising tomorrow.",
      teach: "Probability = favourable outcomes ÷ all outcomes. Find the probability of a prime on a 12-sided dice (5/12). List all the outcomes of a spinner and check the probabilities add to 1. Toss a coin 50 times and compare the frequency of heads with ½. Expected number: if the probability of rain on a June day is 0·25, expect about 7 or 8 rainy days in June. Discuss decisions: a 10% chance of a storm matters more for a sailing trip than a cinema trip.",
      practise: "How likely is it?, then the \"Chances and choices\" sheet.",
      check: "A bag has 3 red, 5 blue and 2 green counters. Find the probability of blue as a fraction and as a decimal. In 50 picks (putting it back each time), about how many blues?" },
    ["n-chance"], "Look at the forecast's chance of rain and decide what to plan.", "probability, outcome, event, equally likely, expected, frequency, fraction, decimal");

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

  add("Second", L, CREATE, ["LIT 2-24a"], "Layout and presentation to engage a reader",
    "We are learning to choose a layout and presentation, such as headings, bullet points, fonts, pictures and captions, that help and interest our reader.",
    ["I can make choices about layout and presentation, on paper or on screen, to engage my reader.",
      "I can use headings, sub-headings, bullet points, fonts, pictures and captions for a purpose.",
      "I can explain why my layout suits my reader."],
    { start: "Show the same information twice: once as one block of text, once as a page with a heading, bullet points and a picture. Which would you rather read? Why?",
      teach: "Name the features on a real leaflet, poster or web page: heading, sub-headings, bullet points, fonts, pictures, captions. For each, ask what it does for the reader (find things fast, see what matters most, want to read on). Plan a page for a younger reader from a plain piece of text: choose the main ideas, then the features that will show them best.",
      practise: "The \"Design a page\" sheet: turn a plain text into a leaflet page for a younger reader, then explain the choices. It can also be made on a computer or tablet.",
      check: "Ask: which feature helps your reader most, and why? Could you show the same idea a better way?" },
    [], "Look at a cereal box, a leaflet or a web page together: what makes you want to read it, and what makes it easy to find things?", "layout, presentation, heading, sub-heading, bullet point, font, caption, picture, reader");

  /* ===================== Literacy and English: Third level (S1 to S3) ===================== */

  add("Third", L, READ, ["LIT 3-01a", "LIT 3-11a", "LIT 3-20a"], "Choosing texts and explaining how well they meet my needs",
    "We are learning to choose texts regularly, explain how well they meet our needs, and choose the form of our own texts.",
    ["I can regularly choose texts to read, watch or listen to, for enjoyment or to find information.", "I can give a personal response to a text, with reasons and evidence.", "I can explain how well a text or source met my needs and expectations.", "I can choose the purpose, form and style of a text of my own to suit my audience."],
    { start: "What's the last thing you read, watched or listened to by choice? Would you recommend it?",
      teach: "Model a short review of a podcast, article or novel: what I wanted from it, what it gave me, an example or quotation as evidence, and who else it would suit. Look at ways to find more (library catalogues, author pages, review sites) and how far to trust each. Choose a form for the pupil's own text (a review, blog post, short story or report) and discuss why it suits the audience.",
      practise: "The \"My reading and viewing\" sheet: a log, a review with evidence, and a plan for a text of my own.",
      check: "Ask: did it meet your expectations? What in the text shows that?" },
    [], "Keep a reading and viewing log for a fortnight, with a line on how well each one met your needs.", "genre, review, evidence, purpose, audience, expectations, source");

  add("Third", L, TALK, ["LIT 3-02a", "ENG 3-03a"], "Discussion: contributing, building on others and respecting other views",
    "We are learning to contribute to discussions with evidence, build on others' ideas, and use features of spoken language.",
    ["I can contribute relevant ideas, knowledge or opinions with supporting evidence.", "I can respond to others' views, and develop or adapt my own thinking.", "I can build on others' contributions by asking, clarifying, summarising, supporting or challenging.", "I can identify features of spoken language, such as body language, emphasis, pace, tone and rhetorical devices, and use them.", "I can use a register that suits my purpose and audience."],
    { start: "Should mobile phones be allowed in school? Give one point and a reason.",
      teach: "Agree discussion roles (chair, summariser, challenger). Model phrases: \"Building on that…\", \"Can you clarify…?\", \"I see it differently because…\". Watch a short clip of a debate or interview and name the features of spoken language: gesture, emphasis, pace, pauses, rhetorical questions. Compare registers by making the same point to a friend and to a head teacher.",
      practise: "Hold a 10-minute discussion on a real issue, using the \"Discussion: plan and reflect\" sheet before and after.",
      check: "Ask: when did you change or add to your thinking? Which feature of spoken language did you use on purpose?" },
    [], "Watch part of a debate or interview and note one technique each speaker uses.", "contribute, evidence, clarify, summarise, challenge, register, tone, pace, emphasis, rhetorical question");

  add("Third", L, TALK, ["LIT 3-04a", "LIT 3-05a", "LIT 3-06a"], "Listening for purpose and main ideas, and making notes",
    "We are learning to identify the purpose and main ideas of what we hear, compare spoken texts, and make and use notes.",
    ["I can give an accurate account of the purpose and main ideas of a spoken text, and justify it.", "I can make inferences from key statements.", "I can identify similarities and differences between spoken texts in content, style or language.", "I can make and organise notes in my own words, selecting key information.", "I can use my notes to create a new text that shows I understand the subject."],
    { start: "Listen to a one-minute news item. In one sentence, what was it for?",
      teach: "Model notes while listening: headings, key words, abbreviations and arrows, not full sentences. Listen to two short talks on one topic (a factual report and a personal opinion) and compare purpose, content and style in a two-column table. Pick out a key statement and infer what the speaker believes. Turn the notes into a short summary for someone who missed it.",
      practise: "The \"Listen, note, compare\" sheet: the adult reads the two short talks aloud.",
      check: "Ask: what was each speaker's purpose? What did one suggest without saying it?" },
    [], "Listen to a radio or podcast item and tell someone the main points from your notes.", "purpose, main idea, infer, key statement, notes, summarise, compare");

  add("Third", L, TALK, ["LIT 3-07a", "LIT 3-08a"], "Commenting on spoken texts and recognising persuasion",
    "We are learning to comment on what we hear with evidence, recognise persuasion, and judge our sources.",
    ["I can comment on the content, form and style of spoken texts, with evidence.", "I can identify persuasive techniques, such as word choice, emotive language, repetition, rhetorical questions and statistics.", "I can comment on how reliable and useful a source is."],
    { start: "Play or read out an advert. What does it want you to do? How does it try to make you?",
      teach: "Name persuasive techniques in a charity appeal or campaign speech: emotive words, repetition, rhetorical questions, statistics, speaking directly to \"you\". Ask of each: what effect is this meant to have on me? Compare a campaign video with a news report about the same issue: who made each, why, and which is more reliable?",
      practise: "The \"Spot the persuasion\" sheet: the adult reads a short campaign speech aloud.",
      check: "Ask: name two techniques and their effect. Is the speaker a reliable source on this? Why?" },
    [], "Watch adverts with someone and score each for how many persuasive techniques it uses.", "persuade, emotive language, repetition, rhetorical question, statistic, bias, reliable, source");

  add("Third", L, TALK, ["LIT 3-09a", "LIT 3-10a"], "Giving a talk: clear, structured and engaging",
    "We are learning to plan and give a talk that is clear, well structured and engaging for the audience.",
    ["I can communicate information, ideas or opinions, explain a process, and summarise or draw conclusions.", "I can organise a talk in a logical order, with signposts such as topic sentences and linking phrases.", "I can open and close a talk in a way that engages my audience.", "I can use tone, vocabulary and non-verbal techniques to suit my audience.", "I can choose resources that help my audience."],
    { start: "Think of a good talk or video you've watched. What made you keep listening?",
      teach: "Plan a three-minute talk: a hook, three signposted points (\"Firstly…\", \"This leads to…\"), and a conclusion that sums up. Choose one resource: a picture, an object, or three slides with few words. Practise pace, pauses, eye contact and stressing key words. Give one strength and one next step.",
      practise: "Plan with the \"Talk planner\" sheet, rehearse, then give the talk.",
      check: "Ask: how did your opening grab attention? Where did you signpost a new point?" },
    [], "Give the talk to someone at home and ask them to tell you your three main points.", "hook, signpost, topic sentence, conclusion, audience, tone, pace, eye contact, resource");

  add("Third", L, READ, ["ENG 3-12a", "LIT 3-13a"], "Reading fluently and using reading strategies",
    "We are learning to read unfamiliar texts with fluency and expression, and to choose strategies that help us understand.",
    ["I can read aloud with fluency, understanding and expression, at a suitable pace and tone.", "I can use context clues, word roots, grammar, punctuation and text structure to understand unfamiliar texts.", "I can choose strategies such as skimming, scanning, predicting, clarifying, summarising and analysing, before and as I read."],
    { start: "Here's a word you may not know: benevolent. What clues help you work out what it means?",
      teach: "Model skimming an article for the gist, then scanning it for one fact. Work out unfamiliar words from roots (bene means well, as in benefit) and context. Read a paragraph aloud, marking pauses for punctuation and words to stress, then read it again with more expression. Stop after each paragraph to clarify anything unclear and sum it up in a sentence.",
      practise: "The \"Reading toolkit\" sheet.",
      check: "Ask: which strategy helped most, and when? Read a new paragraph aloud with expression." },
    [], "Read a newspaper article aloud to someone, then sum up each paragraph in a sentence.", "skim, scan, predict, clarify, summarise, context clue, word root, fluency, expression");

  add("Third", L, READ, ["LIT 3-14a", "LIT 3-15a"], "Finding, summarising and noting information from more than one source",
    "We are learning to find and sort information from different sources, summarise it, and make linked notes.",
    ["I can find, select and sort relevant information from different sources.", "I can summarise key information in my own words.", "I can make and organise notes, linking ideas from more than one source.", "I can use my notes to create a new text that draws on more than one source."],
    { start: "You need to find out how much plastic reaches the sea each year. Where would you look first?",
      teach: "Use the features of non-fiction (headings, contents, index, captions, tables) to find information fast. Read two short sources on one question, mark the key points, and make linked notes in a grid: source 1, source 2, and where they agree. Write a short summary in your own words that uses both, naming the sources.",
      practise: "The \"Two sources\" sheet.",
      check: "Ask: where did the sources agree or differ? Which point in your summary came from each?" },
    [], "Research a question for a family decision on two websites, and sum up what you found.", "source, select, sort, summarise, notes, link, own words");

  add("Third", L, READ, ["LIT 3-16a", "ENG 3-17a"], "Close reading: purpose, inference and language",
    "We are learning to work out purpose and main ideas, make inferences, and explain the effect of a writer's language.",
    ["I can identify the purpose and audience of a text, and justify my answer.", "I can give an accurate account of the main ideas.", "I can make inferences and deductions, with evidence.", "I can compare texts and comment on content, style and language.", "I can answer literal, inferential and evaluative questions, and explain the effect of word choice, sentence structure, punctuation and imagery."],
    { start: "\"The wind screamed through the trees.\" What is the writer doing here, and why?",
      teach: "Sort questions into literal (it's in the text), inferential (read between the lines) and evaluative (judge it). Model answering a language question in three steps: quote, name the technique, explain the effect. Look at a short sentence after long ones, a colon introducing a list, and a metaphor. Compare the openings of two texts on the same topic.",
      practise: "The \"Close reading\" sheet.",
      check: "Ask a question of each type about a new paragraph. Listen for the quotation, the technique and the effect." },
    [], "Choose a line from a song or an advert and explain why the writer chose those words.", "literal, inferential, evaluative, word choice, sentence structure, imagery, effect, purpose, audience");

  add("Third", L, READ, ["LIT 3-18a"], "Persuasion and reliable sources in reading",
    "We are learning to recognise persuasion in what we read and judge how far to trust a source.",
    ["I can identify persuasive language, such as word choice, emotive language, repetition, rhetorical questions and statistics, and comment on it.", "I can judge how reliable, relevant and useful a source is, and justify my view.", "I can use this to form an informed view of my own."],
    { start: "Two web pages about an energy drink: one from the company that makes it, one from a health service. Which do you trust more? Why?",
      teach: "Make a checklist for sources: who wrote it, why, when, what evidence it gives, and whether other sources agree. Mark the persuasive language in an article and explain its effect. Separate facts from claims. Write an informed view that weighs up both sources.",
      practise: "The \"Can I trust this?\" sheet.",
      check: "Ask: name a technique, quote it and explain how it works on the reader. How reliable is the source, and why?" },
    [], "Read the same news story on two different websites and compare how each tells it.", "persuasive, emotive, bias, reliable, credible, relevant, claim, evidence, informed view");

  add("Third", L, READ, ["ENG 3-19a"], "Character, setting, theme and the writer's style",
    "We are learning to evaluate character, setting and structure, identify the theme, and comment on the writer's style.",
    ["I can make evaluative comments about structure, characterisation and setting, referring to the text.", "I can identify the theme and link it to my own or others' experiences.", "I can comment on the writer's style and language, and the features of the genre, with evidence."],
    { start: "Think of a story you know well. Underneath the plot, what is it really about?",
      teach: "Read a short story or extract. Track how a character changes, with a quotation from the start, middle and end. Ask how the setting builds the mood. Put the theme into a sentence (\"Fear can stop us from…\") and connect it to real life. Comment on one feature of the writer's style, such as first-person narration, short chapters or dialogue, and its effect.",
      practise: "The \"Under the surface\" sheet, with any short story or novel the pupil is reading.",
      check: "Ask: what is the theme, and which moment shows it most clearly? Why might the writer have structured it this way?" },
    [], "Talk about a film or series at home: what's its theme, and which character changes most?", "character, characterisation, setting, mood, structure, theme, style, genre, evidence");

  add("Third", L, SPELL, ["LIT 3-21a"], "Spelling specialist and tricky words accurately",
    "We are learning to use strategies and resources to spell most words correctly, including specialist vocabulary.",
    ["I can use a range of strategies and resources to spell most words correctly.", "I can spell unfamiliar and specialist words from different subjects.", "I can check and correct my own spelling."],
    { start: "Spell photosynthesis, parliament, rhythm and necessary. Which strategy did you use for each?",
      teach: "Teach the strategies: break words into syllables (pho-to-syn-the-sis), spot roots and affixes (photo means light), use memory tricks (necessary has one collar and two sleeves: one c, two s's), and look, say, cover, write, check. Show when to use a dictionary or spellchecker, and what a spellchecker misses (their or there). Start a personal list of specialist words from the pupil's subjects.",
      practise: "The \"Subject spellings\" sheet: words from science, maths, social subjects and English, with a strategy for each.",
      check: "Say five new specialist words for the pupil to spell. Ask them to check them and explain one correction." },
    [], "Collect five tricky words from homework each week and test each other.", "syllable, root, prefix, suffix, memory trick, specialist vocabulary, proofread");

  add("Third", L, WRITE, ["LIT 3-22a"], "Sentences, punctuation and paragraphs",
    "We are learning to write accurate, varied sentences, use more complex punctuation, and structure writing in paragraphs.",
    ["I can write almost all sentences in a grammatically accurate way.", "I can vary my sentence structures, openings and lengths.", "I can use more complex punctuation, such as colons, brackets, ellipses and inverted commas, mostly accurately.", "I can use paragraphs, topic sentences and linking phrases to show the structure of my writing.", "I can write fluently and legibly."],
    { start: "Fix this: \"the match was cancelled, it rained all day, we went home\".",
      teach: "Fix run-on sentences with full stops, semicolons or conjunctions. Combine simple sentences into complex ones (\"Although it rained, …\"). Practise colons for lists and explanations, brackets for extra information, and an ellipsis for suspense. Plan three paragraphs with topic sentences, and link them (\"However,\", \"As a result,\").",
      practise: "The \"Sentence workshop\" sheet.",
      check: "Ask the pupil to write a paragraph with a topic sentence, one complex sentence, a colon and a pair of brackets." },
    [], "Write a short paragraph about your day, starting each sentence in a different way.", "simple sentence, complex sentence, run-on sentence, colon, semicolon, brackets, ellipsis, topic sentence, paragraph, linking phrase");

  add("Third", L, WRITE, ["LIT 3-23a", "LIT 3-24a"], "Editing, and layout that helps the reader",
    "We are learning to review and edit our writing, and to choose layout and presentation for our reader.",
    ["I can review and edit my writing so that it is clear, accurate and meets its purpose.", "I can improve the content and language of my writing.", "I can choose layout and presentation features, including in digital texts, to suit my purpose and audience."],
    { start: "Read this paragraph once. Was the meaning clear first time? What got in the way?",
      teach: "Edit in three passes: meaning first (does it make sense, is anything missing?), then language (stronger words, no repetition), then accuracy (spelling, punctuation, grammar). Then plan a layout of the same content for a different reader, with headings, bullet points, text boxes or graphics, and explain each choice.",
      practise: "The \"Edit and design\" sheet.",
      check: "Ask: which edit improved it most? Why did you choose that layout for that reader?" },
    [], "Before sending a message or email, read it once as the person who'll receive it, and edit it.", "review, edit, proofread, clarity, layout, heading, bullet point, text box, graphic, audience");

  add("Third", L, CREATE, ["LIT 3-25a", "LIT 3-26a"], "Using notes and sources in my writing",
    "We are learning to use notes and sources to create new writing, quoting or using our own words, and acknowledging sources.",
    ["I can use notes and other sources to generate ideas and support new writing.", "I can decide when to quote from a source and when to put points in my own words.", "I can acknowledge my sources.", "I can select relevant ideas, information and supporting detail, and organise them in a logical order."],
    { start: "Why does it matter where information came from?",
      teach: "Show the difference between copying, putting it in your own words and quoting, with a short source. Practise rewording a sentence, and quoting a short phrase in quotation marks. Record each source: title, author or organisation, date and web address. Sort notes into an order for a short report: introduction, two or three points with detail, and a conclusion.",
      practise: "The \"From notes to writing\" sheet.",
      check: "Ask: when did you quote and when did you use your own words, and why? Where is your list of sources?" },
    [], "Write a short fact file for a younger relative from two sources, listing them at the end.", "source, quote, quotation marks, own words, acknowledge, list of sources, plan");

  add("Third", L, CREATE, ["LIT 3-28a", "ENG 3-27a"], "Writing to inform, describe and explain",
    "We are learning to write clear information and explanations that suit our reader.",
    ["I can write to convey information, describe events, or explain processes or ideas.", "I can use a style and format that suit my purpose and audience, with features of the genre.", "I can include relevant information and supporting detail in a logical order, with linking words.", "I can use topic sentences to signpost my paragraphs.", "I can engage my reader through my language, style and tone."],
    { start: "How does a dishwasher get plates clean? Explain it to me in three sentences.",
      teach: "Read a model explanation and label its features: title, introduction, paragraphs in order with topic sentences, linking words for cause (because, as a result, this means), technical words, and a diagram. Plan an explanation of a process the pupil knows (how bike gears work, how a law is made) and write the first two paragraphs together.",
      practise: "The \"Explain it\" sheet: plan, then write the explanation.",
      check: "Ask: who is your reader, and how did you make it clear for them? Point to a topic sentence and a linking word." },
    [], "Write an explanation of something you can do that someone at home can't.", "inform, explain, process, sequence, topic sentence, linking word, technical vocabulary, format");

  add("Third", L, CREATE, ["LIT 3-29a"], "Writing to persuade and argue",
    "We are learning to write persuasive and argumentative texts with a clear line of thought and evidence.",
    ["I can present a point of view with relevant supporting detail or evidence.", "I can organise my ideas in a logical order, with signposts such as topic sentences and linking phrases.", "I can write an introduction that makes my purpose clear and engages the reader, and a conclusion that sums up my line of thought.", "I can use language to persuade, such as word choice, repetition, rhetorical questions and emotive language."],
    { start: "Should the school day start later? Give your view and your best reason.",
      teach: "Read a model persuasive article and label its structure: hook, clear view, points with evidence, the other side and an answer to it, and conclusion. Collect evidence: a statistic, an expert, an example. Plan each paragraph as point, evidence, explain. Write the introduction and one paragraph together, using one persuasive technique on purpose.",
      practise: "The \"Make your case\" sheet: plan, then write the article.",
      check: "Ask: where is your strongest evidence? How did you answer the other side?" },
    [], "Write to your local council about something you'd like changed where you live.", "persuade, argue, point of view, evidence, counter-argument, rhetorical question, emotive language, conclusion");

  add("Third", L, CREATE, ["ENG 3-30a"], "Writing about a personal experience",
    "We are learning to write about a personal experience so the reader shares our feelings and reflections.",
    ["I can set a clear context and setting for the events.", "I can describe events, making my feelings and reactions clear.", "I can reflect on my experience and feelings.", "I can engage my reader through language, style and tone."],
    { start: "Think of a time something didn't go as planned. Where were you, and how did you feel?",
      teach: "Read a short personal piece and find where the writer sets the scene, shows feelings (not just \"I was scared\" but what their body did), and reflects (\"Looking back, I realise…\"). Plan a timeline of the experience, with the feelings at each point. Write the opening together using details from the senses.",
      practise: "The \"A moment that mattered\" sheet: plan with a feelings timeline, then write.",
      check: "Ask: where does the reader feel what you felt? Where do you reflect on it?" },
    [], "Tell someone at home about the experience before you write, and notice which details they ask about.", "personal, reflective, setting, context, feelings, reaction, reflect, sensory detail, tone");

  add("Third", L, CREATE, ["ENG 3-31a"], "Creating texts in a genre: characters and settings",
    "We are learning to write in a chosen genre, with convincing characters and settings that come to life.",
    ["I can use the key features of my chosen genre.", "I can create interesting and convincing characters.", "I can create a clear sense of setting with descriptive detail.", "I can engage the reader through the structure of my story, its mood and my language."],
    { start: "Name a genre: mystery, science fiction, horror or adventure. What do readers expect from it?",
      teach: "List the features of the chosen genre. Build a character from the inside out: what they want, what they fear, a secret, and how they speak. Describe a setting with three senses and one detail that hints at the mood. Plan the structure: a hook, a problem, rising tension, a turning point, and an ending or cliffhanger.",
      practise: "The \"Story builder\" sheet: plan the genre, character and setting, then write the opening scene.",
      check: "Ask: which features of the genre did you use? What makes your character convincing?" },
    [], "Read the opening of a book in the same genre and compare it with yours.", "genre, convention, character, motive, setting, mood, atmosphere, structure, tension, cliffhanger");

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

  /* ----- England: lessons for the rest of the national curriculum's statements (October 2026) ----- */

  addEngland("First", M, NUM, ["MNU 1-02a"], "Numbers in words (Years 1 and 2)",
    "We are learning to read and write numbers to 100 in numerals and in words.",
    ["I can read and write numbers to 20 in words.", "I can read and write numbers to 100 in words.", "I can match a number in words to its numerals."],
    {"start": "Show 14 and fourteen on cards. Which part of the word tells you the ones?", "teach": "Build tens words (twenty, thirty… ninety), then add ones with a hyphen: thirty-seven. Point out the tricky ones: eleven, twelve, fifteen, forty (no u).", "practise": "Numbers in words on PopSpell.", "check": "Write 19, 40 and 63 in words, and read 'seventy-two' as a number."},
    ["en-numbers-words"], "Read numbers on signs, cheques or price tags in words.", "numeral, digit, tens, ones, hyphen");

  addEngland("First", M, NUM, ["MNU 1-03a"], "Adding and subtracting two-digit numbers in your head (Year 2)",
    "We are learning to add and subtract two-digit numbers in our heads, and to know which calculations can be done in any order.",
    ["I can add and subtract a two-digit number and ones, and a two-digit number and tens.", "I can add two two-digit numbers and three one-digit numbers.", "I know adding and multiplying can be done in any order, but taking away and dividing can't."],
    {"start": "Quick-fire: 34 + 5, 34 + 50, 6 + 3 + 4. Which was easiest, and why?", "teach": "Use a hundred square or bead string: add tens by jumping down a row, ones by moving along. For two two-digit numbers, add tens then ones. For three numbers, find a pair that makes 10 first. Show 3 + 5 = 5 + 3 but 8 − 3 isn't 3 − 8.", "practise": "Two-digit numbers on PopSpell.", "check": "Ask for 47 + 30, 28 + 35 and 7 + 5 + 3, explaining one method aloud."},
    ["en-add-2digit"], "Add prices or scores in your head in the car or at the shop.", "tens, ones, add, subtract, any order, commutative");

  addEngland("First", M, MEAS, ["MNU 1-11a", "MNU 1-10a"], "Comparing measures, and quicker or later (Years 1 and 2)",
    "We are learning to compare lengths, masses and capacities using <, > and =, and to use words for time such as quicker and later.",
    ["I can compare and order lengths, masses and capacities.", "I can record a comparison with <, > or =.", "I can use quicker, slower, earlier and later."],
    {"start": "Hold up two pencils: which is longer? How could we write that with a sign?", "teach": "Measure pairs of objects, then record: 23 cm > 15 cm. Show the sign 'eats' the bigger number. Order three containers by how much they hold. Talk about events in the day using earlier and later, and which takes longer.", "practise": "Comparing measures on PopSpell.", "check": "Give three lengths to order and write with signs, and ask which is quicker: a snail or a horse."},
    ["en-compare-measures"], "Compare two cups or two shoes at home and say which is bigger with a sign.", "longer, shorter, heavier, lighter, more than, less than, equal, quicker, slower, earlier, later");

  addEngland("First", M, NUM, ["MNU 1-03a"], "Three-digit numbers in your head (Year 3)",
    "We are learning to add and subtract ones, tens and hundreds to a three-digit number in our heads.",
    ["I can add and subtract ones to a three-digit number.", "I can add and subtract tens and hundreds to a three-digit number.", "I can say which digit changes and why."],
    {"start": "Show 452 with place value cards. What happens if we add 3? 30? 300?", "teach": "Model each kind on a place value chart: only the column you add to changes, unless it goes past 9 and carries. Practise crossing a hundred, such as 395 + 10.", "practise": "Three-digit numbers on PopSpell.", "check": "Ask 527 + 40, 683 − 200 and 395 + 7, and which digit changed each time."},
    ["en-mental-3digit"], "Add 10s and 100s to door numbers or page numbers.", "hundreds, tens, ones, add, subtract, digit");

  addEngland("First", M, MONEY, ["MNU 1-09a"], "Pounds and pence: adding and change (Year 3)",
    "We are learning to add and subtract amounts of money in pounds and pence, and to give change.",
    ["I can add two amounts using £ and p.", "I can work out change from £5 or £10.", "I know £1 is 100p, and can change between pounds and pence."],
    {"start": "Lay out £2.35 in coins. How many pence is that?", "teach": "Add prices by adding pounds, then pence, regrouping 100p as £1. Find change by counting on from the price to the next pound, then to the note.", "practise": "Pounds and pence on PopSpell.", "check": "Ask the total of £2.45 and £1.70, and the change from £5."},
    ["en-money-pounds"], "Let your child work out the change at the shop before the cashier does.", "pounds, pence, total, change, count on");

  addEngland("First", M, FDP, ["MNU 1-07a"], "Tenths, and adding fractions with the same denominator (Years 3 and 4)",
    "We are learning to count in tenths, and to add and subtract fractions with the same denominator.",
    ["I can count up and down in tenths.", "I know tenths come from dividing into 10 equal parts, or dividing by 10.", "I can add and subtract fractions with the same denominator, and solve problems with them."],
    {"start": "Fold a strip into 10 equal parts. How many tenths is half?", "teach": "Count in tenths on a number line from 0 to 1. Add 2/7 + 3/7 with a bar model: the parts are the same size, so add the tops. Take away the same way. Solve a cake or pizza problem.", "practise": "Tenths and adding fractions on PopSpell.", "check": "Ask 3/8 + 4/8, 9/10 − 3/10 and one tenth of 60."},
    ["en-fractions-add"], "Cut a pizza or a bar of chocolate into equal parts and add the pieces eaten.", "tenth, numerator, denominator, equal parts, fraction");

  addEngland("First", M, SHAPE, ["MTH 1-16a", "MTH 2-16a"], "Lines and shapes: parallel, perpendicular and quadrilaterals (Years 3 and 4)",
    "We are learning to spot horizontal, vertical, parallel and perpendicular lines, and to sort shapes by their properties.",
    ["I can find horizontal, vertical, parallel and perpendicular lines.", "I can sort quadrilaterals and triangles by their sides and angles.", "I can draw 2D shapes and make 3D shapes, and recognise them turned round."],
    {"start": "Look round the room: where are lines that never meet? Lines that meet at a right angle?", "teach": "Name horizontal and vertical, then parallel and perpendicular, with a right-angle checker. Sort quadrilaterals (square, rectangle, rhombus, parallelogram, trapezium) and triangles (equilateral, isosceles, scalene, right-angled) by their properties. Make a cube and a pyramid from straws or modelling clay, and turn them to show they're the same shape.", "practise": "Lines and shapes on PopSpell, then the \"Draw and make shapes\" sheet.", "check": "Ask for a shape with one pair of parallel sides, and a triangle with two equal sides."},
    ["en-lines-shapes"], "Spot parallel lines on roads, doors and books.", "horizontal, vertical, parallel, perpendicular, quadrilateral, trapezium, rhombus, isosceles");

  addEngland("Second", M, SHAPE, ["MTH 2-17a", "MTH 2-16a"], "Angles, rectangles and accurate drawing (Years 5 and 6)",
    "We are learning to use multiples of 90°, angles on a line and round a point, the properties of rectangles, and to draw shapes accurately.",
    ["I know a right angle is 90°, and use multiples of 90°.", "I can find missing angles on a line and round a point.", "I can use the properties of rectangles to find missing lengths and angles.", "I can draw 2D shapes with given lengths and angles."],
    {"start": "Turn on the spot: quarter, half, three-quarters, whole. How many degrees each time?", "teach": "Show 90°, 180°, 270° and 360° as turns. Angles on a straight line add to 180° and round a point to 360°. Use a rectangle's equal opposite sides and right angles to find missing lengths. Draw a rectangle and a triangle with a ruler and protractor to exact measurements.", "practise": "Angles and rectangles on PopSpell, then the \"Draw it accurately\" sheet.", "check": "Ask the missing angle on a line with 125°, and the short side of a rectangle with perimeter 26 cm and long side 9 cm."},
    ["en-angles-rectangles"], "Look for right angles at home and count how many in a room.", "right angle, degrees, straight line, perimeter, protractor, rectangle");

  addEngland("Second", M, NUM, ["MNU 2-02a"], "Counting in steps and Roman numerals (Years 4 and 5)",
    "We are learning to count in steps of 6, 7, 9, 25, 1000 and powers of 10, and to read Roman numerals to 1000.",
    ["I can count in multiples of 6, 7, 9, 25 and 1000.", "I can find 1000 more or less, and count in steps of powers of 10.", "I can read Roman numerals to 1000 and years written in them.", "I know the Roman system had no zero, and place value changed how we write numbers."],
    {"start": "Count in 25s from 0 to 200. Where have you seen 25s before?", "teach": "Count forwards and back in each step, spotting patterns. Find 1000 and 10 000 more or less on a place value chart. Read Roman numerals by adding (VI) and subtracting (IV), then years on buildings and films. Talk about how Roman numerals have no zero, and why our system with place value is easier for calculating.", "practise": "Counting in steps and Roman numerals on PopSpell.", "check": "Ask the next two numbers after 63, 70, 77, and what MCMXCV means."},
    ["en-count-steps", "en-roman"], "Look for Roman numerals on clocks, buildings and at the end of TV programmes.", "multiple, step, thousand, Roman numeral, place value, zero");

  addEngland("Second", M, NUM, ["MNU 2-02a"], "Numbers to ten million (Year 6)",
    "We are learning to read, write, order and compare numbers up to 10 000 000 and say what each digit is worth.",
    ["I can read and write numbers up to 10 000 000.", "I can order and compare them.", "I can say what each digit is worth.", "I can solve problems with large numbers."],
    {"start": "Read the population of Scotland or England from a news report. How do you say it?", "teach": "Use a place value chart with millions, hundred thousands and so on. Group digits in threes to read them. Order numbers by comparing from the left. Solve population and distance problems.", "practise": "Numbers to ten million on PopSpell.", "check": "Ask the value of the 4 in 6 482 105, and to order three seven-digit numbers."},
    ["en-millions"], "Find big numbers in the news and read them together.", "million, place value, digit, order, compare");

  addEngland("Second", M, NUM, ["MNU 2-03a"], "Multiplication reasoning: facts, splitting, scaling and combinations (Years 3 to 6)",
    "We are learning to use known facts, the distributive law, scaling and combinations to solve multiplication problems.",
    ["I know what happens when multiplying by 0 and 1, and can multiply three numbers.", "I can split a number to multiply, as in 23 × 4 = 20 × 4 + 3 × 4.", "I can solve scaling, rate and correspondence problems."],
    {"start": "How many outfits can you make with 3 tops and 2 pairs of trousers? Draw them.", "teach": "Show × 1 and × 0 with arrays. Multiply three numbers in an easy order. Split a two-digit number to multiply. Scale a recipe up and down, use rates (60 km in 1 hour), and count combinations with a table.", "practise": "Multiplication reasoning on PopSpell.", "check": "Ask 34 × 6 by splitting, how much flour for 12 people if 4 people need 200 g, and how many sandwich and drink pairs from 4 and 3."},
    ["en-mult-reasoning"], "Double or halve a recipe together.", "multiply, distributive, scale, rate, combination, correspondence");

  addEngland("Second", M, FDP, ["MNU 2-07a", "MTH 2-07c"], "Mixed numbers and calculating with fractions (Years 5 and 6)",
    "We are learning to use mixed numbers and improper fractions, and to add, subtract, multiply and divide fractions.",
    ["I can change between mixed numbers and improper fractions.", "I can add and subtract fractions, using equivalent fractions when the denominators are different.", "I can multiply fractions by whole numbers and by other fractions, and divide fractions by whole numbers.", "I can write a fraction as a division and as a decimal."],
    {"start": "Draw 7 quarters. How many wholes is that?", "teach": "Use bar models for each step: mixed and improper, then common denominators (1/3 + 1/4 = 4/12 + 3/12). Multiply by a whole number as repeated addition, and fraction by fraction as a part of a part. Divide a fraction by a whole number by sharing. Show 3/8 = 3 ÷ 8 = 0.375.", "practise": "Fractions on PopSpell: Year 5, then Year 6.", "check": "Ask 2 3/4 as an improper fraction, 1/2 + 1/3, 1/4 × 1/2 and 3/8 as a decimal."},
    ["en-fractions-y5", "en-fractions-y6"], "Cook with fractions: half of three quarters of a cup.", "mixed number, improper fraction, numerator, denominator, equivalent, common denominator");

  addEngland("Second", M, MEAS, ["MNU 2-11a", "MNU 2-11c"], "Imperial units, area of triangles and simple formulae (Years 5 and 6)",
    "We are learning to use approximate imperial equivalents, convert miles and kilometres, find the area of triangles and parallelograms, and use simple formulae.",
    ["I know rough equivalents for inches, pounds and pints.", "I can convert between miles and kilometres.", "I can find the area of triangles and parallelograms.", "I can use a simple formula and know when a formula helps."],
    {"start": "Your height in feet and inches, or in centimetres: which do you know? Why are there two systems?", "teach": "Use 1 inch ≈ 2.5 cm, 1 kg ≈ 2.2 pounds, 1 pint ≈ 570 ml and 5 miles ≈ 8 km. Cut a rectangle diagonally to show a triangle is half: base × height ÷ 2. Cut and slide a parallelogram into a rectangle: base × height. Write formulae in words, then letters, and substitute.", "practise": "Imperial units and area and formulae on PopSpell.", "check": "Ask the area of a triangle with base 10 cm and height 6 cm, and 25 miles in kilometres."},
    ["en-imperial", "en-area-formulae"], "Compare road signs in miles with distances in km on a map.", "inch, pound, pint, mile, kilometre, base, height, formula");

  addEngland("Second", M, FDP, [], "Ratio and proportion (Year 6)",
    "We are learning to solve problems with relative sizes, unequal sharing and similar shapes.",
    ["I can solve problems where one quantity is a multiple of another.", "I can share in a ratio and solve unequal sharing problems.", "I can use a scale factor with similar shapes."],
    {"start": "For every 2 cups of flour you need 1 egg. How many eggs for 6 cups?", "teach": "Use bar models: 'Ali has 3 times as many as Sam' becomes 1 bar and 3 bars. Share in a ratio by counting parts. Enlarge a shape on squared paper by a scale factor and compare the sides.", "practise": "Ratio on PopSpell.", "check": "Ask to share 35 in the ratio 2 : 5, and the new length when a 4 cm side is enlarged by 3."},
    ["en-ratio"], "Mix squash or paint in a ratio, such as 1 part to 4.", "ratio, proportion, share, part, scale factor, similar");

  addEngland("Second", M, DATA, ["MNU 2-20a", "MNU 2-03a"], "The mean, multi-step problems and long division (Years 5 and 6)",
    "We are learning to calculate and interpret the mean, solve multi-step problems, and divide by a two-digit number.",
    ["I can calculate the mean and say what it tells us.", "I can solve multi-step problems, choosing the operations and methods.", "I can do mental calculations with mixed operations.", "I can divide by a two-digit number and interpret remainders."],
    {"start": "Three friends have 4, 6 and 8 sweets. How could they share fairly?", "teach": "Show the mean as levelling out towers of cubes, then as total ÷ how many. Model multi-step problems with a bar model and say each step. Divide 4-digit numbers by 2-digit numbers, and decide whether to round a remainder up or down in context.", "practise": "The mean, and multi-step problems on PopSpell.", "check": "Ask the mean of 12, 15 and 9, and how many 52-seat coaches carry 300 people."},
    ["en-mean", "en-multistep"], "Work out the mean of the family's ages or the week's temperatures.", "mean, average, total, remainder, multi-step, operation");

  addEngland("Second", M, SHAPE, ["MTH 2-18a"], "Coordinates: plotting, translating and reflecting (Years 4 to 6)",
    "We are learning to plot points to complete shapes, describe translations, and reflect shapes in the axes.",
    ["I can plot points to complete a polygon.", "I can describe a translation, such as 3 right and 2 up.", "I can draw and translate shapes on a coordinate grid, and reflect them in the axes."],
    {"start": "Along the corridor, then up the stairs: which coordinate comes first?", "teach": "Plot three corners of a rectangle and find the fourth. Move a shape and describe the translation. Extend the axes to negative numbers and reflect a point in each axis: which number changes sign?", "practise": "Coordinates on PopSpell.", "check": "Ask where (2, 5) goes after moving 3 right and 4 down, and its reflection in the x-axis."},
    ["en-coordinates"], "Play battleships on squared paper.", "coordinate, axis, plot, translation, reflection, quadrant");

  addEngland("Early", L, HAND, ["LIT 0-21a"], "Getting ready to write: cutting, drawing and forming digits (Reception and Year 1)",
    "We are learning to use scissors and other small tools with care, draw carefully, and form the digits 0 to 9.",
    ["I can use scissors, a paintbrush and cutlery safely.", "I can draw with care and accuracy.", "I can form the digits 0 to 9, starting in the right place."],
    {"start": "Squeeze and stretch: playdough, pegs and tweezers to warm up your fingers.", "teach": "Show how to hold scissors and turn the paper, not the scissors, to cut along a line. Draw carefully, slowly and inside the lines. Model each digit, saying where it starts, and trace it in the air.", "practise": "The \"Cut, draw and write numbers\" sheet.", "check": "Watch them cut a curved line and write 0 to 9, starting each digit in the right place."},
    [], "Cut out pictures from a catalogue, and help to set the table with a knife and fork.", "scissors, cut, draw, careful, digit, start");

  addEngland("First", L, SPELL, ["LIT 1-21a"], "The alphabet, letter names and the days of the week (Year 1)",
    "We are learning to name the letters of the alphabet in order, use letter names to talk about spellings, and spell the days of the week.",
    ["I can name the letters of the alphabet in order.", "I can use letter names to tell different spellings of the same sound apart.", "I can spell the days of the week."],
    {"start": "Sing or say the alphabet. Which letter comes after p? Before k?", "teach": "Lay out letter cards in order and play 'what's missing'. Show that rain and play have the same sound spelled a-i and a-y, saying the letter names. Learn the days of the week, noticing the tricky parts (the d in Wednesday) and that each starts with a capital letter.", "practise": "The alphabet on PopSpell, then the days of the week list.", "check": "Ask what comes before m, which letters spell the sound in 'boat', and to write Monday and Wednesday."},
    ["en-alphabet", "y1-days"], "Say the days of the week at breakfast, and find words in a children's dictionary.", "alphabet, letter name, sound, capital letter, days of the week");

  addEngland("First", L, PHON, ["ENG 1-12a", "LIT 1-13a"], "Reading longer words, and checking it makes sense (Years 1 and 2)",
    "We are learning to read longer words by splitting them into parts, and to check that what we read makes sense.",
    ["I can read words with two or more syllables by splitting them into parts.", "I can use the sounds I know to read new words until it's automatic.", "I can notice when a sentence doesn't make sense and fix my reading."],
    {"start": "Clap the beats: rab-bit, gar-den, sand-wich. How many parts?", "teach": "Split long words into syllables, read each part with the sounds you know, then blend the parts. Read a sentence with a mistake in it and ask: does that make sense? Go back and reread the word.", "practise": "The \"Longer words\" sheet, then read a decodable story.", "check": "Ask them to read five two-syllable words, and to spot and fix the wrong word in a sentence."},
    ["s-d-boat", "s-d-puddle"], "When reading together, stop if something doesn't make sense and ask what went wrong.", "syllable, blend, reread, check, makes sense");

  addEngland("First", L, READ, ["ENG 1-17a", "LIT 1-16a"], "Traditional tales: retelling and story language (Years 1 and 2)",
    "We are learning to retell traditional tales, notice their story language, and talk about how events link together.",
    ["I can retell a traditional tale in order.", "I can spot story language, such as once upon a time and repeated lines.", "I can say what is typical of a traditional tale.", "I can say how the events in a story are linked."],
    {"start": "Who's that trip-trapping over my bridge? Do you know the story?", "teach": "Read the tale on the sheet together. Act it out with puppets, saying the repeated lines. Put the events in order and talk about why each one leads to the next. Compare with another traditional tale: what's the same?", "practise": "The \"Three Billy Goats Gruff\" sheet: order the events, story language, and retell it.", "check": "Ask them to retell the tale in order using first, next, then and in the end."},
    [], "Read a different traditional tale at bedtime and compare it with this one.", "traditional tale, retell, once upon a time, repeat, beginning, middle, end");

  addEngland("First", L, READ, ["LIT 1-16a"], "Words and what they mean (Years 1 to 6)",
    "We are learning to work out what words mean, talk about favourite words and phrases, and check meanings in a dictionary.",
    ["I can work out what a word means from the words around it.", "I can link a new word to words I already know.", "I can talk about words and phrases I like and why.", "I can check a word's meaning in a dictionary."],
    {"start": "'The giant was colossal.' What might colossal mean? What helped you?", "teach": "Read the short text on the sheet. For each new word, look for clues around it, think of a word like it, then check in a dictionary. Collect favourite words and phrases and say what they add.", "practise": "The \"Word detective\" sheet.", "check": "Ask them to explain two words from the text and how they worked them out."},
    [], "Pick a 'word of the day' from a book and try to use it at teatime.", "meaning, clue, context, dictionary, definition, phrase");

  addEngland("First", L, CREATE, ["ENG 1-31a"], "Poems to learn, say and write (Year 2)",
    "We are learning to learn poems by heart and say them with expression, and to write a poem of our own.",
    ["I can learn a short poem by heart.", "I can say it with the right intonation so the meaning is clear.", "I can write a short poem of my own."],
    {"start": "Say a rhyme you know. How did you remember it?", "teach": "Read the poem on the sheet together. Learn it a line at a time, with actions. Practise saying it with expression: loud, quiet, slow, fast. Then write your own poem using the same pattern.", "practise": "The \"Poems\" sheet: learn the poem, then write one of your own.", "check": "Listen to them say the poem from memory with expression, and read their own poem."},
    [], "Say the poem together on the way to school until it's learned.", "poem, rhyme, rhythm, verse, line, expression");

  addEngland("Second", L, READ, ["ENG 2-19a", "ENG 2-31a"], "Poetry forms, and performing poems (Years 3 to 6)",
    "We are learning to recognise different forms of poetry, learn poems by heart, and perform poems and our own writing to an audience.",
    ["I can recognise some forms of poetry, such as free verse and narrative poetry.", "I can learn a wider range of poems by heart.", "I can perform a poem or my own writing with intonation, tone, volume and movement so the meaning is clear."],
    {"start": "Is a poem always rhyming? What else can make it a poem?", "teach": "Compare the two poems on the sheet: one tells a story (narrative), one doesn't rhyme or keep a pattern (free verse). Learn one by heart, then mark the performance: where to pause, get louder or quieter, and gesture. Perform it, then perform a piece of your own writing.", "practise": "The \"Perform a poem\" sheet.", "check": "Watch the performance and ask: what form is it, and how did your performance show its meaning?"},
    [], "Perform the poem for the family after tea.", "free verse, narrative poem, form, perform, intonation, tone, volume");

  addEngland("First", L, CREATE, ["LIT 1-23a", "LIT 1-10a"], "Talking about my writing: saying it, reading it aloud and improving it (Years 1 and 2)",
    "We are learning to say our sentences before we write them, read our writing aloud, and talk about how to improve it.",
    ["I can say each sentence out loud before I write it.", "I can read my writing aloud clearly, with the right intonation.", "I can talk about my writing with an adult and make changes."],
    {"start": "Tell me one sentence about your weekend. Say it again in the same words.", "teach": "Say a sentence, hold it in your head, write it, then read it back. Read your writing aloud to the adult, clearly and with expression. Talk about one thing that's good and one thing to change, then make the change.", "practise": "The \"Say it, write it, read it\" sheet.", "check": "Ask them to read their writing aloud, and say one change they made and why."},
    [], "Ask your child to read their homework to you, and say what you liked.", "say, write, read aloud, check, improve, change");

  addEngland("First", L, WRITE, ["LIT 1-22a"], "Expanded noun phrases (Years 2, 5 and 6)",
    "We are learning to add words before and after a noun to describe and specify it.",
    ["I can add adjectives to describe a noun, as in the blue butterfly.", "I can add a phrase after the noun, as in the man with a stick.", "I can use expanded noun phrases to give lots of information in few words."],
    {"start": "Show a picture. 'A dog.' Can you tell me more about it in the same phrase?", "teach": "Build noun phrases on a frame: determiner, adjectives, noun, then a phrase after it. Compare 'the house' with 'the old house at the end of the lane'. For older pupils, rewrite a long sentence as one concise noun phrase.", "practise": "Expanded noun phrases on PopSpell.", "check": "Ask them to expand 'the car' two ways, and say which tells the reader more."},
    ["eg-noun-phrases"], "Describe things in the street with as much detail as you can in one phrase.", "noun, adjective, noun phrase, expand, describe, specify");

  addEngland("Second", L, SPELL, ["LIT 2-21a"], "Homophones (Years 2 to 6)",
    "We are learning to spell homophones and words that are often confused, and choose the right one for the meaning.",
    ["I can spell common homophones, such as there, their and they're.", "I can spell further homophones from the Years 3 and 4 list.", "I can tell apart words that are often confused, such as affect and effect."],
    {"start": "'I can see the sea.' Which see is which? How do you know?", "teach": "Sort homophone pairs into sentences. Make a memory trick for each, such as 'hear' has 'ear' in it, or stationery has e for envelopes. Use each in a sentence of your own.", "practise": "Homophones on PopSpell: the set for the pupil's year.", "check": "Dictate three sentences with homophones in them and check the choice."},
    ["eg-homophones-y2", "eg-homophones-y34", "eg-homophones-y56"], "Spot homophones on signs and menus, and check they're right.", "homophone, sound the same, spelled differently, meaning");

  addEngland("Second", L, READ, ["LIT 2-16a", "ENG 2-19a"], "Myths, legends and themes across books (Years 3 to 6)",
    "We are learning to read myths and legends, retell them, and identify and compare themes and conventions across books.",
    ["I can retell a myth or legend in my own words.", "I can spot the conventions of myths and legends.", "I can identify themes, such as courage or greed, and compare them across books.", "I can read a wide range of books, including stories from other cultures."],
    {"start": "What's the difference between a myth and a legend? Have you heard of any?", "teach": "Read the myth on the sheet. Retell it aloud. Note its conventions: gods or magic, an explanation of something in nature. Talk about its theme, then compare it with another story the pupil knows that has the same theme.", "practise": "The \"Myths and themes\" sheet.", "check": "Ask them to name the theme, give evidence, and compare it with another book."},
    [], "Read a myth or legend from another culture together.", "myth, legend, theme, convention, compare, culture");

  addEngland("Second", L, READ, ["LIT 2-16a", "LIT 2-13a"], "Asking questions and checking understanding as I read (Years 3 to 6)",
    "We are learning to ask questions as we read, check the text makes sense, and discuss our understanding.",
    ["I can ask questions before, during and after reading to help me understand.", "I can check the text makes sense and explain words in context.", "I can take part in discussion about books, taking turns and listening."],
    {"start": "Look at a title. What questions do you have before you read?", "teach": "Read the text on the sheet in parts. Before: what do you expect? During: stop and ask a question, and check you understand. After: what's still puzzling? Discuss your answers, taking turns.", "practise": "The \"Questions as I read\" sheet.", "check": "Ask for one question from before, during and after reading, and how they found the answers."},
    [], "When reading together, each ask one question about the story.", "question, predict, check, understand, discuss, context");

  addEngland("Second", L, CREATE, ["LIT 2-23a", "LIT 2-26a"], "Planning from a model, rehearsing aloud and improving (Years 3 and 4)",
    "We are learning to plan by studying a model text, rehearse sentences aloud, and improve our writing, including using pronouns for clarity.",
    ["I can discuss a model text to learn from its structure and vocabulary.", "I can say my sentences aloud before I write them, including dialogue.", "I can improve my writing, choosing nouns or pronouns for clarity.", "I can read my writing aloud with the right intonation."],
    {"start": "Read a short paragraph. What did the writer do that you could borrow?", "teach": "Discuss the model on the sheet: structure, vocabulary, sentence types. Plan your own version. Say each sentence aloud before writing it. Then improve it: is it clear who 'he' or 'she' is? Read the final version aloud.", "practise": "Nouns or pronouns on PopSpell, then the \"Learn from a model\" sheet.", "check": "Listen to them read their writing aloud and ask what they changed and why."},
    ["eg-pronouns"], "Read a favourite author's paragraph and talk about the words they chose.", "model, structure, rehearse, pronoun, clarity, improve");

  addEngland("Second", L, WRITE, ["LIT 2-23a"], "Editing and proofreading: tense, the perfect form and effect (Years 5 and 6)",
    "We are learning to edit our writing for consistent tense and the perfect form, proofread for errors, and judge how effective it is.",
    ["I can keep the tense consistent throughout a piece of writing.", "I can use the perfect form of verbs to show time and cause.", "I can proofread for spelling and punctuation errors.", "I can assess how effective my own and others' writing is."],
    {"start": "Read: 'Yesterday I go to the park and played football.' What's wrong?", "teach": "Edit the paragraph on the sheet in three passes: tense, then spelling and punctuation, then effect (does it do what the writer wanted?). Use the perfect form to show what had happened first. Then edit a piece of your own writing the same way.", "practise": "Tense and the perfect form on PopSpell, then the \"Edit it\" sheet.", "check": "Ask them to edit a paragraph and explain each change."},
    ["eg-tense-perfect"], "Proofread a shopping list or a birthday card together.", "tense, perfect form, proofread, edit, effective");

  /* ===================== England: key stage 4 (Years 10 and 11) ===================== */
  // The key stage 4 programmes of study (DfE, 2014), with the GCSE subject content's own detail where
  // it spells a statement out (the GCSE English language scope of study and the GCSE maths formulae).
  // Content for more highly attaining pupils (in braces in the programme of study, bold in the GCSE
  // content) is marked "(higher)". "Fourth" places them after CfE Third level; with no CfE outcomes,
  // they're England's only. The statements each one covers are in england.js.

  addEngland("Fourth", M, NUM, [], "Powers, roots, indices and standard form (Years 10 and 11)",
    "We are learning to calculate with powers and roots, use the laws of indices, and calculate with numbers in standard form.",
    ["I can calculate with roots, and with integer indices, including zero and negative indices.", "I can use the laws of indices to simplify expressions involving sums, products and powers.", "I can calculate with numbers in standard form A × 10ⁿ, where 1 ≤ A < 10 and n is an integer.", "I can estimate powers and roots of any given positive number, and calculate with fractional indices (higher)."],
    { start: "Which is bigger, 2¹⁰ or 10³? How can you tell without a calculator?",
      teach: "Build the laws from what a power means: 2³ × 2⁴ is seven 2s multiplied, so add the indices; dividing subtracts them; (2³)² = 2⁶. Halve down the pattern 2³, 2², 2¹, 2⁰, 2⁻¹ to show that 2⁰ = 1 and 2⁻¹ = ½. Use the laws in algebra: x⁵ × x³ = x⁸ and (3a²)³ = 27a⁶. Write 45 000 and 0.0062 in standard form, then multiply and divide in standard form by dealing with the numbers and the powers of 10 separately, adjusting the answer if needed. Higher: 8^⅔ is (∛8)² = 4, and √50 is just over 7, as 7² = 49.",
      practise: "The \"Powers, roots and standard form\" sheet.",
      check: "Ask for 5⁰, 4⁻², (2 × 10³) × (6 × 10⁴) in standard form, and y⁷ ÷ y² simplified." },
    [], "Find very large and very small numbers in science or the news (the distance to the Sun, the width of a hair) and write them in standard form.", "power, index, indices, root, reciprocal, standard form, estimate");

  addEngland("Fourth", M, FDP, [], "Exact calculation: fractions, surds, π and recurring decimals (Years 10 and 11)",
    "We are learning to give exact answers using fractions, surds and multiples of π, and to change between recurring decimals and fractions.",
    ["I can calculate exactly with fractions and multiples of π.", "I can calculate exactly with surds, simplify surd expressions involving squares, and rationalise denominators (higher).", "I can change recurring decimals into their corresponding fractions and vice versa (higher)."],
    { start: "A circle has a radius of 3 cm. What is its area, exactly, without a calculator?",
      teach: "Show why 9π cm² is more accurate than 28.27 cm², and keep answers as fractions: ⅔ of ⅗ is ⅖. Higher: a surd is a root that isn't a whole number. Simplify using square factors: √12 = √(4 × 3) = √4 × √3 = 2√3; then √3 × √3 = 3, so 6/√3 = 6√3/3 = 2√3. Divide 7 by 11 to get 0.636363…, then go back the other way: if x = 0.4545…, then 100x = 45.4545…, so 99x = 45 and x = 45/99 = 5/11.",
      practise: "The \"Exact answers\" sheet.",
      check: "Ask for the exact circumference of a circle with diameter 8, √50 simplified, and 0.777… as a fraction." },
    [], "Use a calculator's fraction or exact mode to check some answers, and talk about when an exact answer matters.", "exact, surd, rationalise, multiple of π, recurring decimal, terminating decimal");

  addEngland("Fourth", M, NUM, [], "Limits of accuracy: rounding, truncating and bounds (Years 10 and 11)",
    "We are learning to say how accurate a measurement is, and to find the largest and smallest values a calculation could give.",
    ["I can apply and interpret limits of accuracy when rounding or truncating.", "I can write an error interval using inequality notation.", "I can use upper and lower bounds in calculations (higher)."],
    { start: "A length is 7 cm to the nearest centimetre. What could it actually be?",
      teach: "Show 6.5 ≤ l < 7.5 on a number line: half a unit either side, with the upper value not included. Compare truncating, which just cuts digits off: a number truncated to 7 could be anything from 7 up to (but not including) 8. Higher: ask which values make an answer as big as possible. For a perimeter, add the upper bounds; for a speed (distance ÷ time), divide the upper bound of the distance by the lower bound of the time.",
      practise: "The \"How accurate?\" sheet.",
      check: "A mass is 4.3 kg to 1 decimal place: write its error interval. A rectangle is 8 cm by 5 cm, both to the nearest centimetre: find the upper bound of its area." },
    [], "Look at a food label. If the pack says 500 g, what range of masses might it really hold?", "limit of accuracy, error interval, round, truncate, upper bound, lower bound");

  addEngland("Fourth", M, PAT, [], "Factorising quadratics and algebraic fractions (Years 10 and 11)",
    "We are learning to factorise quadratic expressions and to simplify expressions, including algebraic fractions.",
    ["I can simplify and manipulate algebraic expressions, including those involving surds and algebraic fractions (higher).", "I can factorise quadratic expressions of the form x² + bx + c, including the difference of two squares.", "I can factorise quadratic expressions of the form ax² + bx + c (higher)."],
    { start: "Expand (x + 3)(x + 5). Now work backwards: what multiplies out to x² + 8x + 15?",
      teach: "Expand with a grid, then reverse it: for x² + bx + c, find two numbers that multiply to c and add to b, so x² + 7x + 12 = (x + 3)(x + 4) and x² − 2x − 15 = (x − 5)(x + 3). Show the difference of two squares: x² − 49 = (x + 7)(x − 7). Higher: for 2x² + 7x + 3, split the middle term: 2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3). Simplify an algebraic fraction by factorising and then cancelling: (x² − 9)/(x + 3) = x − 3.",
      practise: "The \"Factorise it\" sheet.",
      check: "Ask them to factorise x² + 5x + 6 and x² − 16 (and 3x² + 10x + 8, higher), checking each by expanding." },
    [], "Make up a quadratic by expanding two brackets, and challenge someone at home to factorise it.", "expand, factorise, quadratic, coefficient, difference of two squares, algebraic fraction");

  addEngland("Fourth", M, PAT, [], "Identities, algebraic proof and functions (Years 10 and 11)",
    "We are learning the difference between an equation and an identity, to use algebra to prove things, and to think of expressions as functions.",
    ["I know the difference between an equation and an identity.", "I can argue mathematically to show algebraic expressions are equivalent, and use algebra to support and construct arguments and proofs.", "I can interpret simple expressions as functions with inputs and outputs.", "I can interpret the reverse process as the inverse function, and the succession of two functions as a composite function (higher)."],
    { start: "Is 3(x + 2) = 3x + 6 true for every value of x? Is 3x + 2 = 11?",
      teach: "Sort statements into equations (true for some values) and identities (true for every value, written with ≡). Prove that the sum of three consecutive whole numbers is a multiple of 3: n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1). Use 2n for an even number and 2n + 1 for an odd one. Show a function as a machine: f(x) = 2x + 3, so f(4) = 11. Higher: run the machine backwards for the inverse, f⁻¹(x) = (x − 3)/2, and join machines for a composite: if g(x) = x², then fg(x) = 2x² + 3 but gf(x) = (2x + 3)².",
      practise: "The \"Prove it\" sheet.",
      check: "Is (x + 1)² ≡ x² + 1? Why? Prove that the sum of two odd numbers is even." },
    [], "Try a number trick (think of a number, double it, add 6, halve it, take away the number you started with) and prove with algebra why the answer is always 3.", "equation, identity, proof, consecutive, function, input, output, inverse, composite");

  addEngland("Fourth", M, PAT, [], "Straight-line graphs: y = mx + c, parallel and perpendicular lines (Years 10 and 11)",
    "We are learning to use y = mx + c to find and compare straight lines, and to read a gradient as a rate of change.",
    ["I can use the form y = mx + c to identify parallel lines, and perpendicular lines (higher).", "I can find the equation of the line through two given points, or through one point with a given gradient.", "I can interpret the gradient of a straight line graph as a rate of change.", "I can recognise and use the equation of a circle with centre at the origin, and find the equation of a tangent to a circle at a given point (higher)."],
    { start: "Which of these lines are parallel: y = 3x + 1, y = 2x + 3, y = 3x − 4? How do you know?",
      teach: "Gradient = change in y ÷ change in x. For the line through (1, 5) and (3, 9), m = 4 ÷ 2 = 2; substitute a point to find c: 5 = 2 × 1 + c, so c = 3 and y = 2x + 3. Parallel lines have the same gradient. On a graph of a taxi fare, the gradient is the cost per mile and the intercept is the fixed charge. Higher: perpendicular gradients multiply to −1 (2 and −½). x² + y² = 25 is a circle of radius 5; the tangent at (3, 4) is perpendicular to the radius, whose gradient is 4/3, so the tangent's gradient is −¾ and its equation is y − 4 = −¾(x − 3).",
      practise: "The \"Lines and gradients\" sheet.",
      check: "Ask for the equation of the line through (0, −1) and (2, 7), and the gradient of a line perpendicular to it (higher)." },
    [], "Find a real straight-line relationship (a phone plan, a taxi fare) and say what its gradient and intercept mean.", "gradient, intercept, parallel, perpendicular, rate of change, tangent, radius");

  addEngland("Fourth", M, PAT, [], "Quadratics: roots, turning points and solving (Years 10 and 11)",
    "We are learning to solve quadratic equations and to link their solutions to the graph.",
    ["I can solve quadratic equations algebraically by factorising, and find approximate solutions using a graph.", "I can identify and interpret roots, intercepts and turning points of quadratic functions graphically, and deduce roots algebraically.", "I can solve quadratic equations by completing the square and by using the quadratic formula, and deduce turning points by completing the square (higher).", "I know the quadratic formula: the solutions of ax² + bx + c = 0 are x = (−b ± √(b² − 4ac)) / 2a."],
    { start: "If a × b = 0, what can you say about a or b?",
      teach: "Factorise and use the zero product: x² − 5x + 6 = 0 gives (x − 2)(x − 3) = 0, so x = 2 or x = 3. Sketch y = x² − 5x + 6: the roots are where it crosses the x-axis, the y-intercept is 6, and the turning point is halfway between the roots, at x = 2.5. Higher: complete the square, x² − 6x + 2 = (x − 3)² − 7, so the turning point is (3, −7) and x = 3 ± √7. When it won't factorise, use the formula: 2x² + 3x − 4 = 0 gives x = (−3 ± √41)/4, so x ≈ 0.85 or x ≈ −2.35.",
      practise: "The \"Solve the quadratic\" sheet.",
      check: "Solve x² + x − 12 = 0. Where does y = x² + x − 12 cross each axis?" },
    [], "Throw a ball and sketch its path. Where would the roots and the turning point be, and what do they mean?", "quadratic, root, solution, intercept, turning point, factorise, completing the square, quadratic formula");

  addEngland("Fourth", M, PAT, [], "Simultaneous equations and inequalities (Years 10 and 11)",
    "We are learning to form and solve simultaneous equations and inequalities, and to show the solutions.",
    ["I can solve two simultaneous equations in two variables (linear/linear) algebraically, and find approximate solutions using a graph.", "I can translate simple situations into an equation or two simultaneous equations, solve them and interpret the solution.", "I can solve linear inequalities in one variable and represent the solution set on a number line.", "I can solve linear/quadratic simultaneous equations, linear inequalities in two variables and quadratic inequalities in one variable, using set notation and a graph (higher)."],
    { start: "Two coffees and a cake cost £8. One coffee and a cake cost £5.50. How much is a coffee?",
      teach: "Write the start problem as 2c + k = 8 and c + k = 5.5, then subtract to remove k: c = 2.5 and k = 3. Solve 3x + 2y = 16 and x − 2y = 0 by adding: 4x = 16, so x = 4 and y = 2. Draw both lines: the solution is where they cross. Solve 3x − 5 < 10 like an equation, x < 5, and show it with an open circle on a number line; turn the sign round when multiplying or dividing by a negative. Higher: substitute y = x + 1 into x² + y² = 13 to find where a line meets a circle; solve x² < 9 as −3 < x < 3, written {x : −3 < x < 3}.",
      practise: "The \"Two unknowns\" sheet.",
      check: "Solve 2x + y = 11 and x − y = 1. Solve 4 − 2x ≥ 10 and show it on a number line." },
    [], "Find a \"two prices\" puzzle on a café menu and set it up as simultaneous equations.", "simultaneous, eliminate, substitute, inequality, solution set, set notation, region");

  addEngland("Fourth", M, PAT, [], "Sequences: quadratic, geometric and the nth term (Years 10 and 11)",
    "We are learning to recognise different kinds of sequence and to find a rule for the nth term.",
    ["I can deduce expressions to calculate the nth term of linear sequences, and of quadratic sequences (higher).", "I can recognise and use sequences of triangular, square and cube numbers, simple arithmetic progressions, Fibonacci type sequences, quadratic sequences, and simple geometric progressions.", "I can use geometric progressions where the common ratio is a surd, and other sequences (higher)."],
    { start: "What comes next, and why: 1, 4, 9, 16…; 2, 6, 18, 54…; 1, 1, 2, 3, 5…?",
      teach: "Sort sequences by type: arithmetic (add the same each time), geometric (multiply by the same ratio), Fibonacci type (add the two before), square, cube and triangular numbers, and quadratic (the second differences are the same). The nth term of 5, 8, 11, 14 goes up in 3s, so it's 3n + 2. Higher: for 3, 9, 19, 33, 51 the second difference is 4, so it starts 2n²; take 2n² away (2, 8, 18, 32, 50) to leave 1 each time, so the nth term is 2n² + 1.",
      practise: "The \"Sequence detective\" sheet.",
      check: "Find the nth term of 7, 11, 15, 19. Is 2, 6, 12, 20, 30 arithmetic, geometric or quadratic? Find its nth term (higher)." },
    [], "Look for growing patterns in tiles, stacks of cans or bricks, and predict the 10th one.", "sequence, term, nth term, arithmetic, geometric, common ratio, Fibonacci, quadratic, second difference");

  addEngland("Fourth", M, PAT, [], "Graphs of functions and their transformations (Years 10 and 11)",
    "We are learning to recognise and sketch the shapes of important graphs, and to translate and reflect them.",
    ["I can recognise, sketch and interpret graphs of linear functions, quadratic functions, simple cubic functions, and the reciprocal function y = 1/x with x ≠ 0.", "I can recognise, sketch and interpret graphs of the exponential function y = kˣ for positive values of k, and the trigonometric functions y = sin x, y = cos x and y = tan x for angles of any size (higher).", "I can sketch translations and reflections of the graph of a given function (higher)."],
    { start: "Match y = 2x + 1, y = x², y = x³ and y = 1/x to four sketches. What gave each one away?",
      teach: "Make a graph gallery. For each family, plot a few points and describe the shape: a straight line, a ∪-shaped parabola, an S-shaped cubic, a reciprocal graph in two parts that never touches the axes. Higher: exponential growth that never reaches the x-axis, and sine and cosine waves repeating every 360°. y = f(x) + a moves a graph up a; y = f(x + a) moves it left a; y = −f(x) reflects it in the x-axis; y = f(−x) reflects it in the y-axis. Test each rule on y = x².",
      practise: "The \"Graph gallery\" sheet.",
      check: "Sketch y = x² and y = x² − 4 on the same axes. What happens to y = 1/x at x = 0, and why?" },
    [], "Spot graph shapes in real life: the path of a ball, a cup of tea cooling, the tide going in and out.", "linear, quadratic, cubic, reciprocal, exponential, asymptote, translation, reflection");

  addEngland("Fourth", M, PAT, [], "Real-life graphs: gradients, areas and rates of change (Years 10 and 11)",
    "We are learning to use graphs of real situations, including distance-time and velocity-time graphs, to find and interpret rates of change.",
    ["I can plot and interpret graphs, including reciprocal graphs and graphs of non-standard functions in real contexts, to find approximate solutions to problems such as simple kinematic problems involving distance, speed and acceleration.", "I can calculate or estimate gradients of graphs and areas under graphs, and interpret them in cases such as distance-time and velocity-time graphs (higher).", "I can interpret the gradient at a point on a curve as the instantaneous rate of change, and apply average and instantaneous rates of change (higher).", "I can use the kinematics formulae v = u + at, s = ut + ½at² and v² = u² + 2as when they're given."],
    { start: "On a distance-time graph, what does a flat line mean? A steeper line?",
      teach: "On a distance-time graph, the gradient is the speed. On a velocity-time graph, the gradient is the acceleration and the area under the graph is the distance travelled: split it into triangles and rectangles. Higher: for a curve, draw a tangent and find its gradient for the rate of change at that instant; a chord between two points gives the average rate over that time. Use v = u + at: a car at 10 m/s accelerating at 2 m/s² for 5 seconds reaches 20 m/s.",
      practise: "The \"Graphs in motion\" sheet.",
      check: "A cyclist speeds up steadily from rest to 8 m/s in 4 seconds, then rides at 8 m/s for 6 seconds. What is the acceleration, and how far do they go?" },
    [], "Sketch a distance-time graph of a journey to school, showing the stops.", "gradient, rate of change, velocity, acceleration, area under a graph, tangent, chord");

  addEngland("Fourth", M, FDP, [], "Growth, decay, compound interest and iteration (Years 10 and 11)",
    "We are learning to set up and solve problems where an amount grows or shrinks by the same percentage each time, and to use iteration.",
    ["I can set up, solve and interpret the answers in growth and decay problems, including compound interest.", "I can use the formula for compound interest: total accrued = P(1 + r/100)ⁿ.", "I can work with general iterative processes, and find approximate solutions to equations numerically using iteration (higher)."],
    { start: "£100 earns 10% interest each year, added on at the end of the year. Is it £120 after 2 years?",
      teach: "Use multipliers: an increase of 4% is × 1.04, and a decrease of 15% is × 0.85. Compound interest on £2000 at 3% for 5 years is 2000 × 1.03⁵ = £2318.55; compare it with simple interest (£300). A £12 000 car that loses 20% of its value a year is worth 12 000 × 0.8³ = £6144 after 3 years. Work backwards by dividing by the multiplier. Higher: iterate xₙ₊₁ = ∛(5 − 2xₙ) from x₀ = 1, putting each answer back in, to home in on a solution of x³ + 2x − 5 = 0.",
      practise: "The \"Growing and shrinking\" sheet.",
      check: "A town of 5000 people grows by 2% a year. Write an expression for its population after n years, and work it out for 3 years." },
    [], "Compare two savings accounts: which pays more over 5 years, and why?", "multiplier, compound interest, simple interest, depreciation, growth, decay, iteration");

  addEngland("Fourth", M, FDP, [], "Proportion, compound units and fractions in ratio (Years 10 and 11)",
    "We are learning to use direct and inverse proportion, convert compound units, and use fractions in ratio problems.",
    ["I understand that X is inversely proportional to Y is equivalent to X is proportional to 1/Y, and I can interpret equations that describe direct and inverse proportion (and construct them, higher).", "I can convert between related compound units (speed, rates of pay, prices, density, pressure) in numerical and algebraic contexts.", "I can identify and work with fractions in ratio problems."],
    { start: "4 painters take 6 days to paint a house. How long would 8 painters take? What are you assuming?",
      teach: "Direct proportion: y = kx, so doubling x doubles y. Inverse proportion: y = k/x, so doubling x halves y. Higher: if y ∝ x² and y = 50 when x = 5, then k = 2 and y = 2x². Convert 72 km/h to metres per second: 72 000 m ÷ 3600 s = 20 m/s. Density = mass ÷ volume and pressure = force ÷ area. Fractions in ratio: if boys : girls = 3 : 5, then the boys are ⅜ of the class; if ⅖ of the beads are red, then red : not red = 2 : 3.",
      practise: "The \"Proportion and units\" sheet.",
      check: "y is inversely proportional to x, and y = 6 when x = 4. Find y when x = 3. Convert 15 m/s to km/h." },
    [], "Scale a recipe up or down, and talk about what would be in inverse proportion if more people shared the cooking.", "direct proportion, inverse proportion, constant of proportionality, compound unit, density, pressure, ratio");

  addEngland("Fourth", M, SHAPE, [], "Similarity and enlargement (Years 10 and 11)",
    "We are learning to use scale factors, including fractional and negative ones, and to compare the lengths, areas and volumes of similar shapes.",
    ["I can compare lengths, areas and volumes using ratio notation and scale factors, and make links to similarity, including trigonometric ratios.", "I can apply the concepts of congruence and similarity, including the relationships between lengths in similar figures, and between areas and volumes (higher).", "I can interpret and use fractional scale factors for enlargements, and negative scale factors (higher)."],
    { start: "A photo is enlarged so that every length doubles. Does its area double too?",
      teach: "Check two shapes are similar by comparing corresponding sides. If lengths are multiplied by k, areas are multiplied by k² and volumes by k³: two similar jugs 10 cm and 15 cm tall have k = 1.5, so the larger holds 1.5³ = 3.375 times as much. Enlarge a triangle by a scale factor of ½ from a centre: each point ends up half as far from the centre. Higher: a negative scale factor takes each point through the centre to the other side, turning the shape upside down. Similar right-angled triangles have the same ratios of sides, which is why sin, cos and tan work.",
      practise: "The \"Similar shapes\" sheet.",
      check: "Two similar cylinders have radii of 3 cm and 6 cm. The small one has a volume of 40 cm³. What is the volume of the large one?" },
    [], "Compare a model car or toy with the real thing: what's the scale, and how many times bigger is the real one's surface area?", "similar, congruent, scale factor, enlargement, centre of enlargement, corresponding, area factor, volume factor");

  addEngland("Fourth", M, SHAPE, [], "Vectors and combined transformations (Years 10 and 11)",
    "We are learning to describe translations with vectors, calculate with vectors, and describe combined transformations.",
    ["I can describe translations as 2D vectors.", "I can apply addition and subtraction of vectors, multiplication of vectors by a scalar, and diagrammatic and column representations of vectors.", "I can use vectors to construct geometric arguments and proofs (higher).", "I can describe the changes and invariance achieved by combinations of rotations, reflections and translations (higher)."],
    { start: "Move a counter 3 squares right and 2 down. How could you write that move?",
      teach: "Write a translation as a column vector, with the move across on top and the move up or down below. Add vectors nose to tail, or by adding the tops and the bottoms; 2a is twice as long as a in the same direction, and −a points the opposite way. In parallelogram OABC with OA = a and OC = c, OB = a + c and AC = c − a. Higher: if M is the midpoint of AB, then OM = a + ½(b − a) = ½(a + b); two vectors are parallel when one is a multiple of the other. Reflecting in the x-axis and then the y-axis is the same as a rotation of 180° about the origin: which point doesn't move (is invariant)?",
      practise: "The \"Vectors\" sheet.",
      check: "With a = (2, 5) and b = (−3, 1) as column vectors, find a + b and 2a − b." },
    [], "Give directions round the house as vectors (steps forward and across), then add them up to find the shortcut.", "vector, column vector, scalar, resultant, parallel, midpoint, translation, invariant");

  addEngland("Fourth", M, SHAPE, [], "Circles: parts, arc lengths and sectors (Years 10 and 11)",
    "We are learning the parts of a circle and how to calculate arc lengths, angles and areas of sectors.",
    ["I can identify and apply circle definitions and properties, including: centre, radius, chord, diameter, circumference, tangent, arc, sector and segment.", "I know the formulae: circumference of a circle = 2πr = πd, and area of a circle = πr².", "I can calculate arc lengths, angles and areas of sectors of circles."],
    { start: "What fraction of a circle is a sector with an angle of 90°? Of 120°?",
      teach: "Label a circle: centre, radius, diameter, chord, tangent, arc, sector and segment, and say how a segment differs from a sector. Arc length = θ/360 × 2πr and sector area = θ/360 × πr². For r = 6 cm and θ = 60°, the arc is 2π cm (about 6.28 cm) and the area is 6π cm² (about 18.85 cm²). Work backwards: a sector of radius 10 cm with an area of 25π cm² is 25π ÷ 100π = ¼ of the circle, so its angle is 90°.",
      practise: "The \"Arcs and sectors\" sheet.",
      check: "Find the perimeter of a sector with radius 9 cm and angle 40°, exactly and to 1 decimal place." },
    [], "Look at a slice of pizza or cake: estimate its angle and work out the length of its crust.", "radius, diameter, chord, tangent, arc, sector, segment, circumference, π");

  addEngland("Fourth", M, SHAPE, [], "Circle theorems (Years 10 and 11)",
    "We are learning the standard circle theorems, and using them to find angles and to prove results.",
    ["I can apply the standard circle theorems concerning angles, radii, tangents and chords (higher).", "I can prove the standard circle theorems, and use them to prove related results (higher)."],
    { start: "Draw a triangle with its corners on a circle and one side along a diameter. Measure the angle opposite the diameter. What do you notice?",
      teach: "Teach each theorem with a sketch and an example: the angle in a semicircle is 90°; the angle at the centre is twice the angle at the circumference; angles in the same segment are equal; opposite angles of a cyclic quadrilateral add up to 180°; a tangent is perpendicular to the radius; the two tangents from a point are equal; the perpendicular from the centre to a chord bisects the chord; the angle between a tangent and a chord equals the angle in the alternate segment. Prove the angle at the centre theorem using the isosceles triangles made by radii. Always give the reason in words.",
      practise: "The \"Circle theorems\" sheet.",
      check: "In a cyclic quadrilateral, one angle is 68°. What is the opposite angle, and what is the reason?" },
    [], "Teach one theorem to someone at home with a drawing, and explain why it's true.", "theorem, cyclic quadrilateral, circumference, semicircle, tangent, chord, bisect, alternate segment, proof");

  addEngland("Fourth", M, MEAS, [], "3D shapes: plans, elevations, surface area and volume (Years 10 and 11)",
    "We are learning to draw and read plans and elevations, and to calculate surface areas and volumes of spheres, pyramids, cones and composite solids.",
    ["I can construct and interpret plans and elevations of 3D shapes.", "I can calculate surface areas and volumes of spheres, pyramids, cones and composite solids.", "I can use the formulae for a sphere and a cone when they're given, and I know that the volume of a prism = area of cross section × length."],
    { start: "Look at a cereal box from the front, the side and above. Sketch each view.",
      teach: "Draw the plan (from above), the front elevation and the side elevation of a shape made from cubes. Volume of a prism = area of cross section × length; a pyramid or cone holds a third of the prism or cylinder that fits around it. Use the given formulae: for a sphere, volume = 4/3πr³ and surface area = 4πr²; for a cone, volume = 1/3πr²h and curved surface area = πrl. Work out a composite solid, such as a cone on a hemisphere, part by part, counting only the outside surfaces.",
      practise: "The \"Solid shapes\" sheet.",
      check: "Find the volume of a cone with radius 3 cm and height 4 cm, and its curved surface area (its slant height is 5 cm), in terms of π." },
    [], "Find a cone, a sphere and a pyramid at home (an ice-cream cone, a ball, a tent) and estimate their volumes.", "plan, elevation, prism, pyramid, cone, sphere, hemisphere, slant height, surface area, volume, composite");

  addEngland("Fourth", M, SHAPE, [], "Pythagoras, trigonometry and bearings (Years 10 and 11)",
    "We are learning to find lengths and angles in right-angled triangles with Pythagoras' Theorem and trigonometry, including with bearings.",
    ["I can apply Pythagoras' Theorem and trigonometric ratios to find angles and lengths in right-angled triangles in two dimensional figures, and in three dimensional figures (higher).", "I know the formulae a² + b² = c², sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse and tan θ = opposite/adjacent.", "I know the exact values of sin θ and cos θ for θ = 0°, 30°, 45°, 60° and 90°, and of tan θ for θ = 0°, 30°, 45° and 60°.", "I can interpret and use bearings."],
    { start: "A 5 m ladder leans against a wall with its foot 3 m from the wall. How high up the wall does it reach?",
      teach: "Label the hypotenuse, and the opposite and adjacent sides from the angle, then choose sin, cos or tan. Find a side: x = 10 sin 35° ≈ 5.74; find an angle: tan θ = 7/4, so θ ≈ 60.3°. Get the exact values from two triangles: half an equilateral triangle with sides 2 (sin 30° = ½, cos 30° = √3/2, tan 60° = √3) and a right-angled isosceles triangle with sides 1, 1 and √2 (sin 45° = cos 45° = 1/√2). Bearings are measured clockwise from north, with three figures: a ship sails 8 km east (090°) then 6 km south (180°); it's 10 km from the start, and the bearing back to the start is 307°.",
      practise: "The \"Right-angled triangles\" sheet.",
      check: "Without a calculator, find the side opposite a 30° angle when the hypotenuse is 12 cm. The bearing of B from A is 065°: what is the bearing of A from B?" },
    [], "Use a compass app to find the bearing of a landmark from home, and estimate how far away it is.", "hypotenuse, opposite, adjacent, sine, cosine, tangent, Pythagoras' Theorem, exact value, bearing");

  addEngland("Fourth", M, SHAPE, [], "The sine rule, cosine rule and area of any triangle (Years 10 and 11)",
    "We are learning to find sides, angles and areas in triangles that don't have a right angle.",
    ["I know and can apply the sine rule, a/sin A = b/sin B = c/sin C, to find unknown lengths and angles (higher).", "I know and can apply the cosine rule, a² = b² + c² − 2bc cos A, to find unknown lengths and angles (higher).", "I know and can apply Area = ½ab sin C to calculate the area, sides or angles of any triangle (higher)."],
    { start: "Can you use sin, cos and tan as usual in a triangle with no right angle? Why not?",
      teach: "Label each side with the small letter of the angle opposite it. Use the sine rule when you know a side and the angle opposite it: with a = 8, A = 40° and B = 65°, b = 8 sin 65° ÷ sin 40° ≈ 11.3. Use the cosine rule with two sides and the angle between them (for the third side), or with all three sides (for an angle): with b = 5, c = 7 and A = 60°, a² = 25 + 49 − 70 cos 60° = 39, so a ≈ 6.24. The area of that triangle is ½ × 5 × 7 × sin 60° ≈ 15.2.",
      practise: "The \"Any triangle\" sheet.",
      check: "A triangle has sides of 6 cm and 9 cm with an angle of 50° between them. Find the third side and the area." },
    [], "Measure two sides of a triangular object (a sandwich, a road sign) and the angle between them, and work out its area.", "sine rule, cosine rule, included angle, opposite, area of a triangle");

  addEngland("Fourth", M, DATA, [], "Probability: exhaustive events, models and predictions (Years 10 and 11)",
    "We are learning to use the fact that probabilities add up to 1, and to use probability models and experiments to predict outcomes.",
    ["I can apply the property that the probabilities of an exhaustive set of mutually exclusive events sum to one.", "I can use a probability model to predict the outcomes of future experiments.", "I understand that empirical unbiased samples tend towards theoretical probability distributions, with increasing sample size."],
    { start: "A spinner lands on red with probability 0.3 and blue with probability 0.45. It can also land on green. What is the probability of green?",
      teach: "Mutually exclusive events can't happen at the same time, and an exhaustive set covers every possible outcome, so their probabilities add up to 1. Solve a table with a missing probability (x and 2x). Predict: if P(six) = ⅙, expect about 50 sixes in 300 rolls. Roll a dice 10, 50 and 100 times (or pool results): the relative frequency settles closer to the theoretical probability as the number of trials grows, so a bigger sample gives a better estimate.",
      practise: "The \"Predict and test\" sheet.",
      check: "The probabilities of a bus being early, on time or late are 0.1, x and 0.35. Find x, and how many of 200 buses you'd expect to be late." },
    [], "Flip a coin 20 times, then 100 times. Which relative frequency of heads is closer to 0.5?", "mutually exclusive, exhaustive, probability model, relative frequency, expected frequency, theoretical probability, sample size");

  addEngland("Fourth", M, DATA, [], "Combined events: listing, tree diagrams and conditional probability (Years 10 and 11)",
    "We are learning to list outcomes systematically and to find the probabilities of combined events.",
    ["I can calculate the probability of independent and dependent combined events, including using tree diagrams and other representations, and know the underlying assumptions.", "I can apply systematic listing strategies, including use of the product rule for counting (higher).", "I can calculate and interpret conditional probabilities through representation using expected frequencies with two-way tables, tree diagrams and Venn diagrams (higher).", "I know that P(A or B) = P(A) + P(B) − P(A and B), and P(A and B) = P(A given B)P(B)."],
    { start: "How many different outfits can you make from 3 tops and 4 pairs of trousers?",
      teach: "List outcomes systematically (keep one choice fixed while the other changes) and use the product rule: 3 × 4 = 12. Draw a tree diagram for taking two counters from a bag of 4 red and 6 blue: with replacement, the second branches stay 4/10 and 6/10 (independent); without replacement, they change to 3/9 and 6/9, or 4/9 and 5/9 (dependent). Multiply along the branches and add between them. Higher: use a two-way table or Venn diagram of expected frequencies for conditional probability: of 100 pupils, 40 play football and 25 of those also swim, so P(swims given plays football) = 25/40.",
      practise: "The \"Combined events\" sheet.",
      check: "Two counters are taken without replacement from a bag with 3 red and 2 green. Find P(both red) and P(one of each colour)." },
    [], "Work out how many PINs a 4-digit lock can have, and explain why the product rule works.", "independent, dependent, tree diagram, with replacement, without replacement, product rule, conditional probability, Venn diagram, two-way table");

  addEngland("Fourth", M, DATA, [], "Samples, time series and scatter graphs (Years 10 and 11)",
    "We are learning to draw conclusions about a population from a sample, read time series, and use scatter graphs carefully.",
    ["I can infer properties of populations or distributions from a sample, whilst knowing the limitations of sampling.", "I can interpret and construct tables and line graphs for time series data.", "I can apply statistics to describe a population.", "I can use and interpret scatter graphs, recognise correlation and know that it does not indicate causation, draw estimated lines of best fit, make predictions, and interpolate and extrapolate trends whilst knowing the dangers of so doing."],
    { start: "Ice-cream sales and cases of sunburn both go up in summer. Does ice cream cause sunburn?",
      teach: "Talk about samples: random, big enough, and free from bias (asking people at a gym about exercise isn't fair). Estimate for a population from a sample: if 12 of 60 sampled pupils walk to school, about ⅕ of 900 pupils, 180, do. Plot a time series, such as sales each quarter for two years, and describe the trend and the pattern that repeats. Plot a scatter graph, describe the correlation, draw a line of best fit by eye and use it to predict. Predicting inside the data (interpolating) is safer than beyond it (extrapolating).",
      practise: "The \"Data and samples\" sheet.",
      check: "Why might a line of best fit for the ages and heights of children aged 5 to 12 give a silly prediction for a 40-year-old?" },
    [], "Find a news story that says one thing causes another. Is there evidence of cause, or only a correlation?", "population, sample, bias, random, time series, trend, correlation, causation, line of best fit, interpolate, extrapolate");

  addEngland("Fourth", M, DATA, [], "Histograms, cumulative frequency and box plots (Years 10 and 11)",
    "We are learning to compare distributions using averages, spread, and diagrams such as histograms, cumulative frequency graphs and box plots.",
    ["I can interpret, analyse and compare the distributions of data sets through appropriate graphical representation involving discrete, continuous and grouped data, including box plots (higher).", "I can use appropriate measures of central tendency, including the modal class, and of spread, including quartiles and inter-quartile range (higher).", "I can construct and interpret histograms with equal and unequal class intervals and cumulative frequency graphs, and know their appropriate use (higher)."],
    { start: "Two classes both have a mean test score of 60%. Did they do equally well?",
      teach: "Group continuous data in a table, find the modal class, and estimate the mean using midpoints. Higher: draw a cumulative frequency graph (plotting at the upper end of each class), then read off the median, the quartiles and the interquartile range. Draw box plots and compare two of them: compare an average and a spread, in context. For unequal class widths, plot frequency density = frequency ÷ class width, so the area of each bar shows its frequency.",
      practise: "The \"Distributions\" sheet.",
      check: "A histogram bar for 20 < t ≤ 30 has a frequency density of 1.8. How many values are in that class?" },
    [], "Time how long it takes people at home to do a puzzle, and compare the times with a box plot.", "frequency, class width, frequency density, histogram, cumulative frequency, median, quartile, interquartile range, box plot, modal class");

  addEngland("Fourth", L, READ, [], "Shakespeare: language, character and context (Years 10 and 11)",
    "We are learning to read Shakespeare with understanding, exploring how characters and events are shaped and how the play's context informs our reading.",
    ["I can read and appreciate the depth and power of the English literary heritage, including a play by Shakespeare.", "I can explore aspects of plot, characterisation, events and settings, the relationships between them and their effects.", "I can draw on knowledge of the purpose, audience for and context of the writing, including its social, historical and cultural context and the literary tradition to which it belongs, to inform evaluation."],
    { start: "Shakespeare's audiences often stood for hours. What would a play need to do to hold their attention?",
      teach: "Read a short scene from the play being studied aloud, sharing the parts. Put a few lines into modern English, then talk about what's lost: rhythm, imagery, double meanings. Follow one character through the scene: what they say, what they do, and how others react. Add one piece of context (beliefs about kings, fate or the place of women at the time, or the conventions of tragedy or comedy) and ask how it changes what the scene meant to an audience then, and means now.",
      practise: "The \"Shakespeare scene study\" sheet, on a scene from the play being studied.",
      check: "Ask for a quotation that shows the character's state of mind, what one word in it suggests, and how an audience at the time might have reacted." },
    [], "Watch a filmed performance of the same scene. What did the actors and director do to make it clear?", "soliloquy, aside, dramatic irony, iambic pentameter, imagery, context, characterisation, tragedy, comedy");

  addEngland("Fourth", L, READ, [], "Poetry: analysing and comparing poems (Years 10 and 11)",
    "We are learning to analyse how poets use language, form and structure, and to compare two poems critically.",
    ["I can analyse a writer's choice of vocabulary, form, grammatical and structural features, and evaluate their effectiveness and impact.", "I can make critical comparisons, referring to the contexts, themes, characterisation, style and literary quality of texts.", "I can re-read literature as a basis for making comparisons.", "I can explain how vocabulary, grammar, form and structure contribute to effectiveness and impact, using linguistic and literary terminology accurately."],
    { start: "Read the two poems on the sheet once each. Which one stays with you, and why?",
      teach: "Re-read each poem with a question in mind: what is it about, and what is it really about? Pick out a word or image and explore what it suggests, then look at form and structure: rhyme, rhythm, stanza shape, line breaks and how the poem moves (a turn, a contrast, a change of time). Model a comparison paragraph that links the poems with a point, a quotation from each, analysis of the methods and a judgement about their effect.",
      practise: "The \"Two poems\" sheet.",
      check: "Ask for one way the poems are alike and one way they differ, with a quotation from each and a comment on a method." },
    [], "Choose a poem you like (a song lyric counts) and explain one technique and its effect to someone at home.", "imagery, metaphor, simile, personification, rhyme, rhythm, stanza, enjambment, caesura, tone, volta");

  addEngland("Fourth", L, READ, [], "Summary and synthesis across two non-fiction texts (Years 10 and 11)",
    "We are learning to read for a purpose, summarise and synthesise information from two texts, and judge how useful they are.",
    ["I can read in different ways for different purposes, summarising and synthesising ideas and information, and evaluating their usefulness for particular purposes.", "I can identify the main theme or themes, summarise ideas and information from a single text, and synthesise from more than one text.", "I can understand and critically evaluate texts."],
    { start: "Skim both texts on the sheet in one minute. What are they both about?",
      teach: "Show three ways of reading: skimming for the gist, scanning for a detail, and close reading for meaning. Sort true and false statements about one text, finding the evidence each time. Then synthesise: pick out what the two writers say about the same thing, and write about the differences in your own words, with a short quotation or detail from each and an inference about what the difference shows. Finish by judging how useful each text would be for a given purpose.",
      practise: "The \"Two journeys\" sheet.",
      check: "Ask for one difference between the writers' experiences, with evidence from both, and which text is more useful for finding out what rail travel felt like then." },
    [], "Read two reviews of the same film, game or product and summarise how they differ.", "skim, scan, summary, synthesis, inference, source, usefulness, reliability");

  addEngland("Fourth", L, READ, [], "Evidence, inference and bias (Years 10 and 11)",
    "We are learning to tell supported claims from unsupported ones, spot bias and the misuse of evidence, and back up our own inferences.",
    ["I can distinguish between statements that are supported by evidence and those that are not, and identify bias and misuse of evidence.", "I can seek evidence in the text to support a point of view, including justifying inferences with evidence.", "I can identify and interpret themes, ideas and information, and recognise the possibility of different responses to a text."],
    { start: "\"Everyone knows that…\" Why might a writer start a sentence like that?",
      teach: "Read the opinion piece on the sheet. Highlight claims in two colours: supported by evidence, or not. Look at how evidence is used: is the sample big and fair, does it prove what the writer says it proves? Find bias: one-sided language, attacks on people rather than their arguments, missing views. Make an inference about the writer and justify it with a quotation. Then argue the opposite reading: why might another reader find the piece convincing?",
      practise: "The \"Weighing the evidence\" sheet.",
      check: "Ask for one claim with no evidence, one way evidence is misused, and an inference about the writer backed by a quotation." },
    [], "Find an advert or opinion piece and check one of its claims: what evidence is there?", "claim, evidence, inference, bias, sample, generalisation, fact, opinion, counter-argument");

  addEngland("Fourth", L, READ, [], "Whole novels: themes, characters and a personal response (Years 10 and 11)",
    "We are learning to trace themes and characters through a whole novel, and to make an informed personal response while weighing up other readings.",
    ["I can identify and interpret themes, ideas and information.", "I can make an informed personal response, recognising that other responses to a text are possible and evaluating these.", "I can choose and read books independently for challenge, interest and enjoyment.", "I can explore aspects of plot, characterisation, events and settings, the relationships between them and their effects."],
    { start: "In one sentence, what is the novel you're reading really about? Is that its plot or its theme?",
      teach: "Separate plot (what happens) from theme (the big ideas). Track one theme through the novel: three key moments from the beginning, middle and end, with a quotation and what it suggests. Track how one character changes and why, and link the change to a setting or event. Then form a personal response (what you think the writer is saying) and test it against another reading: what would someone who disagrees say, and how strong is their case?",
      practise: "The \"Theme tracker\" sheet, on the novel being read.",
      check: "Ask how a theme develops across the novel, with two moments as evidence, and for a different interpretation and their view of it." },
    [], "Keep a reading log of a book chosen for interest, and recommend it (or not) to someone at home.", "theme, motif, plot, characterisation, setting, interpretation, personal response, development");

  addEngland("Fourth", L, CREATE, [], "Descriptive and narrative writing (Years 10 and 11)",
    "We are learning to write imaginative descriptions and stories at length, shaping them for effect.",
    ["I can write accurately, fluently, effectively and at length for pleasure and information.", "I can adapt my writing for a wide range of purposes and audiences, including to describe and to narrate.", "I can use language imaginatively and creatively, maintain a consistent point of view, and keep coherence and consistency across a text.", "I can create emotional impact."],
    { start: "Describe this room in one sentence that makes it sound threatening, then in one that makes it sound safe.",
      teach: "Plan before writing: purpose, audience and viewpoint. For a description, zoom in and out, move through time, and use all the senses, with one strong image rather than a list of adjectives. For a story, keep to one or two characters and a short time span, and build to a turning point; start late and end with an echo of the opening. Vary sentence lengths for effect and keep the tense and viewpoint consistent. Write the opening and read it aloud.",
      practise: "The \"Describe and narrate\" sheet.",
      check: "Ask them to point to one choice in their opening (a word, a sentence length, a structure) and say what effect they wanted." },
    [], "Write a short description of the same place at two different times of day.", "narrative, descriptive, viewpoint, structure, imagery, senses, tension, cyclical structure, coherence");

  addEngland("Fourth", L, CREATE, [], "Writing to argue and persuade (Years 10 and 11)",
    "We are learning to plan and write a convincing argument, choosing evidence and rhetorical devices to suit the audience.",
    ["I can select, and use judiciously, vocabulary, grammar, form, and structural and organisational features, including rhetorical devices, to reflect audience, purpose and context, using Standard English where appropriate.", "I can select and organise ideas, facts and key points, and cite evidence, details and quotation effectively and pertinently for support and emphasis.", "I can use language creatively and persuasively, including rhetorical devices such as rhetorical questions, antithesis and parenthesis."],
    { start: "\"Young people should be allowed to vote at 16.\" Agree or disagree in one sentence, then give your best reason.",
      teach: "Name rhetorical devices from examples on the sheet: rhetorical question, antithesis, parenthesis, list of three, direct address, statistics and anecdote. Plan an argument: a clear view, three points in a deliberate order, each with evidence, a counter-argument dealt with fairly, and a strong ending. Choose the form (letter, article, speech) and register for the audience. Use devices on purpose, not as a checklist: one well-placed rhetorical question beats five.",
      practise: "The \"Make the argument\" sheet.",
      check: "Ask them to read their opening and name the devices they used and why they suit the audience." },
    [], "Write a short letter to a local paper about something that matters in your area.", "argument, counter-argument, rebuttal, rhetorical question, antithesis, parenthesis, anecdote, register, Standard English");

  addEngland("Fourth", L, CREATE, [], "Writing from notes and information provided by others (Years 10 and 11)",
    "We are learning to make notes, draft and write a formal letter from key points someone else has given us.",
    ["I can make notes, draft and write, including using information provided by others, such as writing a letter from key points provided.", "I can adapt my writing to explain, instruct, and give and respond to information.", "I can use information provided by others to write in different forms, maintaining coherence and consistency across a text."],
    { start: "You have ten facts and room for five. How do you choose?",
      teach: "Read the key points on the sheet and decide the purpose and audience of the letter. Select the points that serve the purpose, put them in a logical order, and group them into paragraphs. Model turning a note into a sentence (\"85 of 120 would come\" becomes \"Over two thirds of our members have said they would come\"). Use the conventions of a formal letter, Standard English, and a clear request at the end.",
      practise: "The \"From key points to a letter\" sheet.",
      check: "Ask why they left out a point, and how their final paragraph makes the request clear." },
    [], "Take notes from a news report or podcast and use them to write a short summary for someone who missed it.", "notes, draft, key points, formal letter, purpose, audience, paragraph, Standard English");

  addEngland("Fourth", L, WRITE, [], "Revising, editing and proof-reading (Years 10 and 11)",
    "We are learning to revise our writing for impact, restructure and improve it, and proof-read it for accuracy.",
    ["I can revise, edit and proof-read my writing.", "I can reflect on whether my draft achieves the intended impact.", "I can restructure my writing, and amend its grammar and vocabulary to improve coherence, consistency, clarity and overall effectiveness.", "I can pay attention to the accuracy and effectiveness of grammar, punctuation and spelling."],
    { start: "What is the difference between revising, editing and proof-reading?",
      teach: "Work through the draft on the sheet in three passes. Revise: does it achieve its purpose for its audience, and is anything in the wrong place? Edit: improve the order, the links between sentences and the vocabulary, and keep the tense and voice consistent. Proof-read: read slowly, aloud or backwards sentence by sentence, for spelling, punctuation and grammar errors. Then use the same three passes on a piece of the pupil's own writing.",
      practise: "The \"Edit for impact\" sheet.",
      check: "Ask them to explain three changes: one for impact, one for clarity and one for accuracy." },
    [], "Proof-read a message or post before sending it, reading it aloud first.", "revise, edit, proof-read, coherence, consistency, clarity, tense, homophone");

  addEngland("Fourth", L, WRITE, [], "Grammar and vocabulary for effect (Years 10 and 11)",
    "We are learning to analyse how grammar and vocabulary create effects, and to use them on purpose in our own writing.",
    ["I can consolidate and build on my knowledge of grammar and vocabulary.", "I can study the effectiveness and impact of grammar and vocabulary in the texts I read.", "I can draw on new vocabulary and grammatical constructions from my reading and listening, and use these consciously in my writing and speech to achieve particular effects.", "I can use linguistic and literary terminology accurately and confidently in discussing reading, writing and spoken language."],
    { start: "\"He waited. Nothing. Then the handle turned.\" Why are the sentences so short?",
      teach: "Look at grammatical choices in short extracts: short and minor sentences for tension, the passive voice to hide who did something, a fronted subordinate clause to delay the main point, an expanded noun phrase to build an image, modal verbs for certainty or possibility, fronted adverbials to control pace. Name each with the right term, then explain its effect in context. Rewrite a plain sentence three ways for three effects, and borrow one construction from a book being read.",
      practise: "The \"Grammar for effect\" sheet.",
      check: "Ask them to name a feature in a sentence from their reading, using the right term, and explain its effect." },
    [], "Collect three sentences from your reading that you admire, and say what grammar makes them work.", "clause, subordinate clause, minor sentence, passive voice, modal verb, noun phrase, adverbial, terminology");

  addEngland("Fourth", L, TALK, [], "Spoken and written language, registers and Standard English (Years 10 and 11)",
    "We are learning how spoken and written language differ, how register changes with context, and when Standard English is needed.",
    ["I can analyse some of the differences between spoken and written language, including differences associated with formal and informal registers, and between Standard English and other varieties of English.", "I can use Standard English when the context and audience require it.", "I can express ideas using Standard English whenever and wherever appropriate."],
    { start: "How would you tell a friend you'll be late? How would you tell an employer?",
      teach: "Read the transcript on the sheet aloud. Name features of spontaneous speech: fillers, false starts, repetition, pauses, the present tense used for past events, and quoting with \"I was like\". Separate these from features of a regional or social variety (\"me and my mate was\", \"ain't\"), which follow their own regular rules. Talk about register: formal and informal, and who decides. Rewrite the account in written Standard English and discuss what changes and what's lost.",
      practise: "The \"Spoken, written and Standard English\" sheet.",
      check: "Ask for two differences between the spoken and written versions, and a context where Standard English is needed and one where it isn't." },
    [], "Listen to how people speak in two different places (at home and on the radio, say) and note the differences.", "register, formal, informal, Standard English, dialect, variety, transcript, filler, false start");

  addEngland("Fourth", L, TALK, [], "Formal presentations and debates (Years 10 and 11)",
    "We are learning to plan and give a formal presentation or debate speech, and to respond to questions and feedback.",
    ["I can speak confidently, audibly and effectively.", "I can plan for different purposes and audiences, selecting and organising information and ideas effectively and persuasively for formal spoken presentations and debates.", "I can make presentations and speeches.", "I can listen and respond appropriately to questions and feedback."],
    { start: "Think of a speaker you've enjoyed listening to. What did they do that worked?",
      teach: "Choose a topic, purpose and audience. Plan on the sheet: a hook, three points with evidence, a counter-argument for a debate, and an ending with a call to action. Rehearse with cue cards rather than a script, working on volume, pace, pauses, eye contact and Standard English. Predict three questions and prepare short answers. Give the talk, take questions, then note the feedback and how to act on it.",
      practise: "The \"Speech planner\" sheet.",
      check: "After the talk, ask a question they didn't expect, and see how they answer it." },
    [], "Give a two-minute talk to someone at home on a subject you know well, then ask them for one question.", "presentation, debate, audience, purpose, hook, cue card, pace, emphasis, rebuttal, Standard English");

  addEngland("Fourth", L, TALK, [], "Group discussion: leading, listening and challenging (Years 10 and 11)",
    "We are learning to work effectively in a group: leading and managing discussion, building on what others say, and challenging courteously.",
    ["I can work effectively in groups of different sizes and take on required roles, including leading and managing discussions, involving others productively, reviewing and summarising, and contributing to meeting goals and deadlines.", "I can listen to and build on the contributions of others, ask questions to clarify and inform, and challenge courteously when necessary.", "I can listen and respond in a variety of different contexts, both formal and informal, and evaluate content, viewpoints, evidence and aspects of presentation."],
    { start: "What makes a group discussion go badly? What makes one go well?",
      teach: "Read the short discussion on the sheet aloud, taking parts. Find where the chair keeps the group on task, involves a quiet member, and summarises; where someone builds on an idea, asks a question to clarify, or challenges courteously; and where someone doesn't. Then hold a real discussion (the tutor and pupil, or with family), with the pupil in the chair, using the roles and phrases on the sheet, and a time limit and a goal.",
      practise: "The \"Leading a discussion\" sheet.",
      check: "Ask them to summarise where the discussion reached, and to name one point they challenged and how." },
    [], "Chair a short family decision (what to eat, where to go) so that everyone is heard and you reach an answer in five minutes.", "chair, summarise, build on, clarify, challenge, courteous, consensus, goal, deadline");

  addEngland("Fourth", L, TALK, [], "Performing scripts and poetry (Years 10 and 11)",
    "We are learning to improvise, rehearse and perform scripts and poems, and to talk about how performance choices change meaning.",
    ["I can improvise, rehearse and perform play scripts and poetry in order to generate language and discuss language use and meaning.", "I can use role, intonation, tone, volume, mood, silence, stillness and action to add impact."],
    { start: "Say \"You could have said\" three ways: hurt, angry, joking. What changes?",
      teach: "Read the script on the sheet together, then improvise what happened just before it to find out who the characters are. Mark up the script: words to stress, pauses, silences, volume, tone and movement. Perform it twice with different choices (is Jo angry or heartbroken?) and talk about how the meaning changes. Do the same with a poem being studied, deciding where the silences and the stillness should go.",
      practise: "The \"Perform it\" sheet.",
      check: "Ask them to explain one performance choice and how it changed the meaning of a line." },
    [], "Perform a short poem or speech for someone at home, then ask what they understood from it.", "intonation, tone, volume, pace, pause, silence, stillness, gesture, improvise, subtext");

  // Checking understanding, not just the right answer: a question to ask at the end of each lesson,
  // and what a pupil who understands will say or do. (Know: the words to use. Do: the success criteria.)
  const UNDERSTAND = {
    "third-rounding-to-decimal-places-and-estimating": ["Why would you round 2·3 buses up to 3, but £2·346 to £2·35?", "Explains that the context decides: you can't have part of a bus, and money is counted to the penny."],
    "third-calculating-with-whole-numbers-and-decimals": ["When you work out 4·26 × 7 as 426 × 7, how do you know where the point goes?", "Uses an estimate (about 4 × 7 = 28) or explains that 4·26 is 426 hundredths, so the answer is hundredths too."],
    "third-negative-numbers-in-calculations": ["Why is 5 − (−3) bigger than 5?", "Explains that taking away a negative is finding the gap from −3 up to 5, or that removing a debt leaves you better off."],
    "third-common-multiples-common-factors-and-primes": ["Is 1 a prime number? Why or why not?", "Explains that a prime has exactly two different factors, and 1 has only one."],
    "third-powers-and-indices": ["Why is 3² not the same as 3 × 2?", "Explains that the index says how many times the base is multiplied by itself: 3 × 3 = 9."],
    "third-fractions-decimals-and-percentages-in-real-life": ["Why is ⅓ off a better deal than 30% off?", "Explains that ⅓ is about 33%, so it takes off more, whatever the price."],
    "third-adding-and-subtracting-fractions": ["Why can't you add ⅓ and ¼ to get 2/7?", "Explains that the parts are different sizes, so they must be changed into the same size (twelfths) before adding."],
    "third-proportion-and-ratio": ["If teachers to children is 1 : 10, why aren't teachers 1/10 of the school?", "Explains there are 11 parts altogether, so teachers are 1/11 of everyone."],
    "third-best-value-budgets-and-money-words": ["Is the cheapest deal always the best value? Why?", "Explains that best value depends on what you need: total cost, length of contract, what's included, and your own situation."],
    "third-speed-distance-and-time": ["Why can't you write 1 hour 30 minutes as 1·3 hours in a speed calculation?", "Explains that 30 minutes is half an hour, so it's 1·5 hours: minutes are sixtieths, not tenths."],
    "third-area-and-volume-including-compound-shapes": ["You split the L-shape a different way from me. Will we get the same area? Why?", "Explains that the area of the whole shape doesn't change however you split it, as long as no part is counted twice or missed."],
    "third-researching-a-mathematician-or-a-maths-topic": ["How do you know your information about this mathematician is accurate?", "Checked more than one source, chose reliable ones, and can say where each fact came from."],
    "third-sequences-and-their-rules": ["In T = 3n + 1, why is the number in front of n the same as the difference between terms?", "Explains that each time n goes up by 1, 3n goes up by 3, so the terms go up by 3."],
    "third-simplifying-and-evaluating-expressions": ["Why can't 3x² + 4x be simplified to 7x³?", "Explains that x² and x are unlike terms, as different as apples and bananas, so they can't be collected."],
    "third-solving-equations-and-using-formulae": ["Why do you take away 5 before dividing by 3 when solving 3x + 5 = 26?", "Explains that you undo the steps in reverse order: the number was multiplied by 3 first, then 5 was added."],
    "third-drawing-shapes-accurately": ["Why can't you draw a triangle with sides 3 cm, 4 cm and 10 cm?", "Explains that the two shorter sides together must be longer than the longest side, or they can't meet."],
    "third-angles-in-shapes-and-with-parallel-lines": ["How do you know these two angles are equal? Which fact tells you?", "Names the fact (alternate, corresponding or vertically opposite) and points to the parallel lines it depends on."],
    "third-bearings-scale-drawings-and-enlargement": ["When a shape is enlarged by scale factor 2, does its area double too?", "Explains, or finds by drawing, that the area is four times as big, because the length and width both double."],
    "third-coordinates-in-four-quadrants-and-symmetry": ["Why does reflecting a point in the y-axis change the sign of its x-coordinate only?", "Explains that the point moves left or right across the axis to the same distance on the other side, but its height doesn't change."],
    "third-data-fair-samples-clear-graphs-and-misleading-claims": ["Why might asking 10 people give a less reliable answer than asking 100?", "Explains that a small sample may not represent everyone, so the result could be due to chance."],
    "third-probability-from-0-to-1": ["The probability of rain is 0·25. Why might you still take a coat?", "Explains that unlikely isn't impossible, and the consequence of getting soaked matters as well as the probability."],
    "third-choosing-texts-and-explaining-how-well-they-meet-my-needs": ["What would make you stop reading something halfway through?", "Explains with reference to their own needs and expectations, such as purpose, interest or difficulty, with an example."],
    "third-discussion-contributing-building-on-others-and-respecting-other-views": ["How did someone else's point change your view, even slightly?", "Gives a specific example of adapting or developing their thinking, and acknowledges the other person's right to disagree."],
    "third-listening-for-purpose-and-main-ideas-and-making-notes": ["Why are notes better in your own words than copied word for word?", "Explains that putting it in your own words shows you understood it and helps you remember it."],
    "third-commenting-on-spoken-texts-and-recognising-persuasion": ["A speaker uses a statistic. Does that make them right?", "Explains that it depends on where the statistic came from and how it's used, and that statistics can be chosen to persuade."],
    "third-giving-a-talk-clear-structured-and-engaging": ["Why do talks need signposts more than written texts do?", "Explains that listeners can't flick back, so they need to hear where the talk is going and when a new point starts."],
    "third-reading-fluently-and-using-reading-strategies": ["When would you skim, and when would you scan?", "Skims for the general idea of a text; scans to find a particular fact or word quickly."],
    "third-finding-summarising-and-noting-information-from-more-than-one-source": ["Why use two sources and not just one?", "Explains that comparing sources checks accuracy, shows different views and gives a fuller picture."],
    "third-close-reading-purpose-inference-and-language": ["What is the difference between naming a technique and explaining its effect?", "Explains that naming it says what the writer did; the effect says what it makes the reader think or feel, and why."],
    "third-persuasion-and-reliable-sources-in-reading": ["Can a source be persuasive and reliable at the same time?", "Explains yes: a source can argue a view and still use accurate evidence, so you judge the evidence as well as the language."],
    "third-character-setting-theme-and-the-writer-s-style": ["What's the difference between the plot and the theme?", "Explains that the plot is what happens; the theme is the bigger idea about life the story explores."],
    "third-spelling-specialist-and-tricky-words-accurately": ["Why might a spellchecker miss a mistake in 'Their going to the match'?", "Explains that 'their' is a real word, so the checker doesn't flag it; you need to know which word the meaning needs."],
    "third-sentences-punctuation-and-paragraphs": ["Why is 'It rained, we went home' not a correct sentence?", "Explains that two complete sentences need a full stop, a semicolon or a conjunction between them, not just a comma."],
    "third-editing-and-layout-that-helps-the-reader": ["Why edit for meaning before checking spelling?", "Explains that changing the content can remove or add sentences, so the accuracy check should come last."],
    "third-using-notes-and-sources-in-my-writing": ["When is it better to quote than to use your own words?", "Explains that a quotation is best when the exact words matter, such as a striking phrase or an expert's view; otherwise own words show understanding."],
    "third-writing-to-inform-describe-and-explain": ["How would your explanation change for a seven-year-old reader?", "Explains changes to vocabulary, sentence length, examples and layout to suit the reader."],
    "third-writing-to-persuade-and-argue": ["Why mention the other side in a persuasive text?", "Explains that answering the opposing view makes the argument stronger and more convincing to a doubtful reader."],
    "third-writing-about-a-personal-experience": ["What is the difference between telling the reader you were nervous and showing it?", "Explains that showing uses actions, thoughts or physical details so the reader feels it, not just reads the word."],
    "third-creating-texts-in-a-genre-characters-and-settings": ["What makes a character convincing, even in science fiction?", "Explains that believable wants, fears and reactions make a character feel real, whatever the setting."],
    "early-estimate-then-count": ["Why is it fine if your guess wasn't exactly right?", "Knows a guess is a sensible estimate, then counting checks it; can say if the count was more or less than the guess."],
    "early-counting-to-20-and-beyond": ["If I count these again starting from a different one, will I get the same number? Why?", "Knows the total doesn't change with the order, and that the last number counted tells how many."],
    "early-before-after-and-in-between": ["How do you know 14 comes after 13 and not before?", "Uses the counting order or a number line: after means one more."],
    "early-adding-and-taking-away-within-10": ["Here is 6 + 2. Can you tell me a story that matches it?", "Makes up a sensible story: something is added to a group, and the total is bigger."],
    "early-doubles-and-splitting-numbers-to-10": ["Can 7 be split another way? How many ways can you find?", "Finds more than one split (5 and 2, 4 and 3) and sees both parts together make 7."],
    "early-sharing-equally-and-halves": ["Is this half? How do you know?", "Checks both parts are the same size or the same number, not just that there are two parts."],
    "early-coins-and-paying-up-to-10p": ["Which is worth more, one 5p coin or three 1p coins? Why?", "Knows a coin's value isn't how many coins there are: 5p is worth more than 3p."],
    "early-days-routines-and-o-clock": ["The long hand is on 12 and the short hand is on 3. Is it o'clock? What might you be doing at 3 o'clock in the afternoon?", "Explains that the long hand on 12 means o'clock and the short hand shows the hour, and links the time to a real part of their own day."],
    "early-longer-heavier-and-holds-more": ["How could we check which is longer fairly?", "Lines the ends up together, or uses the same thing to measure both."],
    "early-copying-and-continuing-patterns": ["What comes next? How do you know?", "Names the part that repeats and uses it to say what comes next."],
    "early-sorting-2d-shapes-and-3d-objects": ["Is this still a triangle if I turn it round? Why?", "Knows turning a shape doesn't change it: it still has 3 sides and 3 corners."],
    "early-position-direction-and-symmetry": ["Hide a toy and give me clues with words like behind, under and next to. Which clue helped me most? Why?", "Chooses position words to suit a new hiding place, and can say which clue helped and why."],
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
    "early-forming-lowercase-letters": ["Why does it matter where you start a letter? Show me what goes wrong with b if you start at the bottom.", "Explains that the right start makes each letter the same every time; can show a wrong start, spot what changed, and fix it."],
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
    "first-full-stops-question-marks-and-exclamation-marks": ["\"You're going home.\" \"You're going home?\" \"You're going home!\" How does each mark change what it means?", "Explains how the end mark changes the meaning or how it's said, and chooses the right mark for a new sentence of their own."],
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
    "second-tricky-spelling-patterns-soft-c-and-g-silent-letters-ph": ["Here are words you haven't practised: cycle, cell, giant. How would you say each one, and why?", "Applies the soft c and soft g patterns (before e, i or y) to new words and explains them; knows some words, such as get and girl, break the pattern."],
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
    "second-layout-and-presentation-to-engage-a-reader": ["Why did you make that a heading, and not put it in the middle of a paragraph?", "Explains each choice by what the reader needs: to find information quickly, to see what matters most, or to want to read on."],
    "second-questions-fact-and-opinion-in-what-i-hear": ["Was the advert a useful source? Why or why not?", "Weighs it up: it wants to sell, so it chooses facts and adds opinions, so check elsewhere."],
    "second-planning-and-giving-a-short-talk": ["What did you do to keep your audience interested?", "Names techniques: a question, an example, eye contact, changing their voice."],
    "england-year-1-grammar-plurals-un-and-capital-letters": ["Why does box need -es but cat only -s?", "Hears the extra beat (boxes), or knows -es comes after s, x, z, sh and ch."],
    "england-year-2-grammar-apostrophes-suffixes-and-sentence-types": ["Write \"do not\" and \"they are\" the short way. Where does the apostrophe go, and why there?", "Puts the apostrophe where letters are missed out in new words, and explains it; doesn't add apostrophes to ordinary plurals."],
    "england-year-3-grammar-a-or-an-prefixes-and-words-for-time-and-cause": ["Why do we say an apple but a banana?", "Explains an goes before a vowel sound."],
    "england-year-4-grammar-fronted-adverbials-possessive-apostrophes-and-standard-english": ["Start a sentence of your own with \"After lunch\" or \"Without a sound\". Where does the comma go, and how does it help the reader?", "Writes a new fronted adverbial with a comma after it, and explains that the comma shows where the opening ends."],
    "england-year-5-grammar-relative-clauses-possibility-and-parenthesis": ["What does the relative clause add to this sentence?", "Explains it gives extra information about the noun."],
    "england-year-6-grammar-passive-formal-language-and-punctuation-between-clauses": ["Why might a writer use the passive: \"The window was broken\"?", "Explains it hides or doesn't need who did it."],
    "england-year-1-common-exception-words": ["Which part of \"said\" do you have to remember? Now find the tricky part in \"was\".", "Finds the tricky part in a second word without being told, and sounds out the rest."],
    "england-year-2-common-exception-words": ["How will you remember the tricky part of because?", "Uses a strategy: saying it in syllables, a phrase or noticing the tricky part."],
    "england-years-3-and-4-word-list-roots-prefixes-and-suffixes": ["Which root word is in disappear? How does that help you spell it?", "Finds the root (appear) and adds the prefix without changing it."],
    "england-years-5-and-6-word-list-morphology-and-etymology": ["Where does the word come from, and does that help you spell it?", "Uses a word family or origin to explain a spelling."],
    "england-joined-handwriting-years-3-and-4": ["Which letters don't join? Why not?", "Names the letters their school doesn't join (often capitals and some after letters such as b, g, j, p, x, y)."],
    "england-writing-legibly-fluently-and-at-speed-years-5-and-6": ["When would you use neat print, and when quick joined writing?", "Matches style to the task: labels or a final copy vs. notes."],
    "england-getting-ready-for-the-times-tables-check-year-4": ["You don't know 7 × 8. What fact could help?", "Uses a known fact: 7 × 8 is double 7 × 4, or 7 × 7 + 7."],
    "england-getting-ready-for-the-phonics-check-year-1": ["Why can't you guess an alien word?", "Explains alien words aren't real, so you have to sound out every part."],
    "england-numbers-in-words-years-1-and-2": ["Why do we write forty without a u, when we say four?", "Notices that forty is spelled differently from four, and checks tricky number words rather than writing them as they sound."],
    "england-adding-and-subtracting-two-digit-numbers-in-your-head-year-2": ["Is 45 + 30 easier or harder than 45 + 3? Why?", "Explains that adding tens changes the tens digit and adding ones changes the ones, and chooses a method on purpose."],
    "england-comparing-measures-and-quicker-or-later-years-1-and-2": ["Why does 45 cm > 9 cm, even though 9 is a bigger digit than 4?", "Compares the whole measure, not one digit, and checks the units are the same before comparing."],
    "england-three-digit-numbers-in-your-head-year-3": ["What is 296 + 10, and why does more than one digit change?", "Explains carrying: the tens go past 9, so the hundreds change too."],
    "england-pounds-and-pence-adding-and-change-year-3": ["Why is counting on a good way to find change?", "Explains counting up from the price to the amount paid, in friendly steps, and checks by adding the change back."],
    "england-tenths-and-adding-fractions-with-the-same-denominator-years-3-and-4": ["Why is 2/7 + 3/7 equal to 5/7 and not 5/14?", "Explains that the size of the parts (sevenths) stays the same; only the number of parts changes."],
    "england-lines-and-shapes-parallel-perpendicular-and-quadrilaterals-years-3-and-4": ["Is a square a kind of rectangle? Explain.", "Reasons from properties: a square has four right angles and opposite sides equal, so it fits the rectangle's properties too."],
    "england-angles-rectangles-and-accurate-drawing-years-5-and-6": ["A rectangle's perimeter is 30 cm. Can you find its sides without measuring? What else would you need to know?", "Explains that half the perimeter gives one long plus one short side, and that one more length is needed to find both."],
    "england-counting-in-steps-and-roman-numerals-years-4-and-5": ["Why is our number system easier for adding than Roman numerals?", "Explains that place value and zero let us line up columns, while Roman numerals have no place value."],
    "england-numbers-to-ten-million-year-6": ["Which is bigger, 2 999 999 or 3 000 000? How do you know without counting?", "Compares from the millions digit first and explains why the first different digit decides."],
    "england-multiplication-reasoning-facts-splitting-scaling-and-combinations-years-3-to-6": ["Why does 23 × 4 equal 20 × 4 + 3 × 4?", "Explains that 23 fours is 20 fours and 3 more fours, perhaps with an array split into two parts."],
    "england-mixed-numbers-and-calculating-with-fractions-years-5-and-6": ["Why do we need the same denominator before adding 1/3 + 1/4?", "Explains that the parts must be the same size to be added, and finds equivalent fractions to make them so."],
    "england-imperial-units-area-of-triangles-and-simple-formulae-years-5-and-6": ["Why is a triangle's area half of base × height?", "Shows two identical triangles make a rectangle (or parallelogram) with the same base and height."],
    "england-ratio-and-proportion-year-6": ["If the ratio of red to blue is 2 : 3, what fraction of the beads are red? Why isn't it 2/3?", "Explains there are 5 parts altogether, so red is 2/5; the ratio compares parts with each other, not with the whole."],
    "england-the-mean-multi-step-problems-and-long-division-years-5-and-6": ["The mean of five scores is 7. Does anyone have to have scored 7? Why?", "Explains the mean is the total shared equally, so no single score has to equal it."],
    "england-coordinates-plotting-translating-and-reflecting-years-4-to-6": ["When you reflect a point in the x-axis, which number changes, and why?", "Explains that the point stays the same distance from the axis on the other side, so the second (y) number changes sign."],
    "england-getting-ready-to-write-cutting-drawing-and-forming-digits-reception-and-year-1": ["Why do we turn the paper, not the scissors, when we cut round a curve?", "Explains or shows that turning the paper keeps the cutting hand steady and the line accurate."],
    "england-the-alphabet-letter-names-and-the-days-of-the-week-year-1": ["Why do we use letter names, not sounds, when we spell out a word?", "Explains that the same sound can be spelled in different ways, and letter names say exactly which letters to write."],
    "england-reading-longer-words-and-checking-it-makes-sense-years-1-and-2": ["You read 'The dog barked at the cat' as 'The dog bark at the car'. How would you know something was wrong?", "Uses meaning to notice the error (cars don't get barked at in the story; it doesn't sound right), then rereads the words carefully."],
    "england-traditional-tales-retelling-and-story-language-years-1-and-2": ["Why does the troll let the first two goats go?", "Links events: the little goats promise a bigger goat is coming, which leads to the ending."],
    "england-words-and-what-they-mean-years-1-to-6": ["How did the sentence help you work out the word's meaning?", "Points to a clue in the sentence and explains how it narrows the meaning, then checks it."],
    "england-poems-to-learn-say-and-write-year-2": ["Why did you say that line louder (or more slowly)?", "Links how they say it to the meaning or feeling of the line."],
    "england-poetry-forms-and-performing-poems-years-3-to-6": ["How is a narrative poem like a story, and how is it different?", "Explains it tells a story with characters and events, but uses lines, rhythm and poetic language."],
    "england-talking-about-my-writing-saying-it-reading-it-aloud-and-improving-it-years-1-and-2": ["Why is it useful to say a sentence before you write it?", "Explains that it helps them remember the whole sentence and check it makes sense before writing."],
    "england-expanded-noun-phrases-years-2-5-and-6": ["Why might a writer use 'the girl in the red coat' instead of 'the girl'?", "Explains it tells the reader which girl, or helps them picture her, without needing another sentence."],
    "england-homophones-years-2-to-6": ["How will you remember which 'there' to use?", "Gives a reliable memory trick linked to meaning (here, there and where are places; their has 'heir', owning)."],
    "england-myths-legends-and-themes-across-books-years-3-to-6": ["What lesson or theme does this myth share with another story you know?", "Names a theme and backs it with evidence from both stories."],
    "england-asking-questions-and-checking-understanding-as-i-read-years-3-to-6": ["Which of your questions helped you most, and why?", "Explains how a question focused their reading or sorted out a misunderstanding."],
    "england-planning-from-a-model-rehearsing-aloud-and-improving-years-3-and-4": ["When is it better to use the name instead of 'he' or 'she'?", "Explains that a name is clearer when a pronoun could mean more than one person."],
    "england-editing-and-proofreading-tense-the-perfect-form-and-effect-years-5-and-6": ["Why did the writer use 'had started' and not 'started'?", "Explains the past perfect shows that one event happened before another."],
    "england-powers-roots-indices-and-standard-form-years-10-and-11": ["Why is 2⁰ equal to 1, not 0?", "Uses the pattern of halving (2², 2¹, 2⁰) or the division law (2³ ÷ 2³ = 2⁰, and anything divided by itself is 1)."],
    "england-exact-calculation-fractions-surds-and-recurring-decimals-years-10-and-11": ["Why is 6π cm a better answer than 18.8 cm when you're asked for an exact length?", "Explains that 18.8 is rounded, so it's slightly wrong, while 6π is exactly right and can be rounded later if needed."],
    "england-limits-of-accuracy-rounding-truncating-and-bounds-years-10-and-11": ["To get the smallest possible answer to a ÷ b, which bounds of a and b do you use? Why?", "Explains that dividing the smallest a by the largest b gives the smallest answer, because a bigger divisor makes the answer smaller."],
    "england-factorising-quadratics-and-algebraic-fractions-years-10-and-11": ["How do you know (x + 3)(x + 4) is right for x² + 7x + 12, and not (x + 2)(x + 6)?", "Checks by expanding: both pairs multiply to 12, but only 3 and 4 add to 7, the middle coefficient."],
    "england-identities-algebraic-proof-and-functions-years-10-and-11": ["Why don't five examples that work prove that something is always true?", "Explains that examples only show it works for those numbers; algebra (using n) shows it for every number, and one counter-example disproves it."],
    "england-straight-line-graphs-y-mx-c-parallel-and-perpendicular-lines-years-10-and-11": ["On a graph of a phone bill against minutes used, what do the gradient and the intercept mean?", "Explains the gradient is the cost per minute (the rate of change) and the intercept is the fixed charge when no minutes are used."],
    "england-quadratics-roots-turning-points-and-solving-years-10-and-11": ["Why do we rearrange a quadratic to equal 0 before factorising?", "Explains that only when the product equals 0 can we say one of the brackets must be 0."],
    "england-simultaneous-equations-and-inequalities-years-10-and-11": ["What does the point where two straight lines cross tell you about their equations?", "Explains that it's the one pair of x and y values that makes both equations true at once."],
    "england-sequences-quadratic-geometric-and-the-nth-term-years-10-and-11": ["How can you tell whether a sequence is arithmetic, geometric or quadratic?", "Arithmetic: the differences are the same. Geometric: you multiply by the same ratio. Quadratic: the second differences are the same."],
    "england-graphs-of-functions-and-their-transformations-years-10-and-11": ["Why does the graph of y = 1/x never touch the x-axis?", "Explains that 1 divided by any number can never be 0, though it gets closer to 0 as x gets bigger."],
    "england-real-life-graphs-gradients-areas-and-rates-of-change-years-10-and-11": ["On a velocity-time graph, why does the area underneath give the distance travelled?", "Explains that distance = speed × time, which is the area of a rectangle on the graph, so the area under any part adds up the distance."],
    "england-growth-decay-compound-interest-and-iteration-years-10-and-11": ["Why isn't a 10% rise followed by a 10% fall back to where you started?", "Explains the fall is 10% of a bigger amount, so it takes off more: × 1.1 × 0.9 = × 0.99, a 1% loss."],
    "england-proportion-compound-units-and-fractions-in-ratio-years-10-and-11": ["If y is inversely proportional to x, what happens to y when x is multiplied by 3? Why?", "Explains y is divided by 3, because xy stays the same (the constant k)."],
    "england-similarity-and-enlargement-years-10-and-11": ["If the lengths are doubled, why is the volume multiplied by 8 and not 2?", "Explains the volume grows in three directions, so it's multiplied by 2 × 2 × 2."],
    "england-vectors-and-combined-transformations-years-10-and-11": ["How can you tell from two vectors that two lines are parallel?", "Explains that one vector is a multiple of the other, so they point in the same (or opposite) direction."],
    "england-circles-parts-arc-lengths-and-sectors-years-10-and-11": ["Why do we multiply by θ/360 to find an arc length?", "Explains the sector is that fraction of the whole circle, so its arc is that fraction of the circumference."],
    "england-circle-theorems-years-10-and-11": ["Why is the angle in a semicircle always 90°?", "Links it to the angle at the centre: the diameter makes a straight angle of 180° at the centre, and the angle at the circumference is half of that."],
    "england-3d-shapes-plans-elevations-surface-area-and-volume-years-10-and-11": ["Why is the volume of a cone a third of the cylinder that fits around it?", "Explains or shows (by filling with sand or water, or comparing a pyramid with a prism) that three cones fill the cylinder."],
    "england-pythagoras-trigonometry-and-bearings-years-10-and-11": ["How do you decide whether to use Pythagoras' Theorem or trigonometry?", "Pythagoras when it's only sides (two known, find the third); trigonometry when an angle is known or wanted."],
    "england-the-sine-rule-cosine-rule-and-area-of-any-triangle-years-10-and-11": ["How do you choose between the sine rule and the cosine rule?", "Sine rule when you know a side and the angle opposite it; cosine rule when you know two sides and the angle between them, or all three sides."],
    "england-probability-exhaustive-events-models-and-predictions-years-10-and-11": ["Why is a relative frequency from 500 trials a better estimate than one from 20?", "Explains that with more trials, chance variations even out, so the relative frequency settles near the true probability."],
    "england-combined-events-listing-tree-diagrams-and-conditional-probability-years-10-and-11": ["Why do the probabilities on the second branches change when you don't replace the first counter?", "Explains there's one fewer counter in the bag, and one fewer of the colour taken, so the second pick depends on the first."],
    "england-samples-time-series-and-scatter-graphs-years-10-and-11": ["Two things are strongly correlated. Does one cause the other? How could you tell?", "Explains that correlation doesn't prove cause: a third factor (such as hot weather) may cause both, and only an experiment or a clear mechanism would show cause."],
    "england-histograms-cumulative-frequency-and-box-plots-years-10-and-11": ["Why do we compare an average and a spread, not just the averages?", "Explains that two sets can have the same average but be very different: the spread (range or interquartile range) shows how consistent the data is."],
    "england-shakespeare-language-character-and-context-years-10-and-11": ["How might an audience in Shakespeare's time have seen this moment differently from us?", "Links a specific belief or convention of the time to a specific moment, and explains how it changes the meaning or effect."],
    "england-poetry-analysing-and-comparing-poems-years-10-and-11": ["Why did the poet end the line there, and not a word later?", "Explains the effect of the line break or structure on meaning or emphasis, using a term such as enjambment or caesura."],
    "england-summary-and-synthesis-across-two-non-fiction-texts-years-10-and-11": ["What's the difference between summarising and synthesising?", "Explains that a summary gives the key points of one text, while synthesis brings points from two texts together, comparing them in their own words."],
    "england-evidence-inference-and-bias-years-10-and-11": ["The writer gives a statistic. Does that make the argument reliable?", "Questions where the figure comes from, the sample size and who was asked, and whether it really shows what the writer claims."],
    "england-whole-novels-themes-characters-and-a-personal-response-years-10-and-11": ["What would someone who disagrees with your reading say, and are they right?", "States a different interpretation fairly, with evidence, and weighs it against their own rather than dismissing it."],
    "england-descriptive-and-narrative-writing-years-10-and-11": ["What did you want the reader to feel at the end of your opening, and how did you do it?", "Names an intended effect and points to specific choices (a word, an image, a sentence length, the structure) that create it."],
    "england-writing-to-argue-and-persuade-years-10-and-11": ["Why include a counter-argument when you want people to agree with you?", "Explains that answering the other side fairly makes the writer seem reasonable and the argument stronger, and deals with doubts before readers raise them."],
    "england-writing-from-notes-and-information-provided-by-others-years-10-and-11": ["Why didn't you use every key point you were given?", "Explains that they chose the points that best served the purpose and audience, and left out ones that were weaker or off the point."],
    "england-revising-editing-and-proof-reading-years-10-and-11": ["Why do we check whether a piece achieves its purpose before we correct the spelling?", "Explains that big changes (order, content) may remove or rewrite sentences, so it's better to fix those first and proof-read last."],
    "england-grammar-and-vocabulary-for-effect-years-10-and-11": ["Why might a report say \"Mistakes were made\" instead of \"The manager made mistakes\"?", "Explains the passive voice can leave out who did it, to hide or avoid blame, or because it's unknown or unimportant."],
    "england-spoken-and-written-language-registers-and-standard-english-years-10-and-11": ["Is a dialect form such as \"we was\" wrong?", "Explains it's correct in its own variety but not Standard English, and that the context and audience decide which to use."],
    "england-formal-presentations-and-debates-years-10-and-11": ["How did you change your talk for your audience?", "Gives specific choices (vocabulary, examples, register, length, visual aids) and why they suit that audience."],
    "england-group-discussion-leading-listening-and-challenging-years-10-and-11": ["How can you disagree with someone without shutting the discussion down?", "Acknowledges the other person's point, then gives a reason or evidence for their view, and keeps it about the idea, not the person."],
    "england-performing-scripts-and-poetry-years-10-and-11": ["What did the silence in your performance say that words couldn't?", "Explains a specific pause or silence and the feeling or meaning (tension, hurt, hesitation) it showed the audience."]
  };
  lessons.forEach(l => { const u = UNDERSTAND[l.id.replace(/^lesson-/, "")]; if (u) [l.understand, l.lookFor] = u; });

  // A Scottish version of England's lessons where the skill matches a CfE benchmark: a CfE title, level,
  // outcomes, and success criteria taken from the benchmark statements (Education Scotland). In the
  // Scotland view these are ordinary CfE lessons. The five without one (the passive and subjunctive,
  // adding fractions, calculating with mixed numbers, ratio, and the mean) come after Second level in CfE.
  const CFE_VERSION = {
    "year-1-grammar-plurals-un-and-capital-letters": ["Plurals, the prefix un- and capital letters", "First", ["LIT 1-21a", "LIT 1-22a"],
      ["I can use my knowledge of phonics and spelling strategies to spell words, including adding -s or -es.", "I can write independently, punctuating most sentences accurately with a capital letter and a full stop."]],
    "year-2-grammar-apostrophes-suffixes-and-sentence-types": ["Sentence types, suffixes and apostrophes", "First", ["LIT 1-21a", "LIT 1-22a"],
      ["I can punctuate most sentences accurately, using a capital letter, full stop, question mark or exclamation mark.", "I can use phonics and spelling strategies when spelling familiar and unfamiliar words, including words with suffixes.", "I can start sentences in a variety of ways to engage the reader."]],
    "year-3-grammar-a-or-an-prefixes-and-words-for-time-and-cause": ["Linking ideas: a or an, prefixes, and words for time and cause", "First", ["LIT 1-21a", "LIT 1-22a"],
      ["I can link sentences using common conjunctions, for example, and, because, but or so.", "I can start sentences in a variety of ways to engage the reader.", "I can use spelling strategies when spelling unfamiliar words, including words with prefixes."]],
    "year-4-grammar-fronted-adverbials-possessive-apostrophes-and-standard-english": ["Varying sentence openings, apostrophes and accurate grammar", "Second", ["LIT 2-22a"],
      ["I can use sentences of different lengths and types and vary my sentence openings.", "I can use a range of punctuation, including commas and apostrophes.", "I can write most sentences in a grammatically accurate way."]],
    "year-5-grammar-relative-clauses-possibility-and-parenthesis": ["Adding information to sentences: clauses, possibility and brackets", "Second", ["LIT 2-22a"],
      ["I can use sentences of different lengths and types.", "I can link sentences using a range of conjunctions.", "I can write most sentences in a grammatically accurate way, using a range of punctuation."]],
    "year-1-common-exception-words": ["Common words with a tricky part: set 1", "First", ["LIT 1-21a"],
      ["I can spell most commonly used words correctly.", "I can use phonics and spelling strategies when spelling familiar and unfamiliar words."]],
    "year-2-common-exception-words": ["Common words with a tricky part: set 2", "First", ["LIT 1-21a"],
      ["I can spell most commonly used words correctly.", "I can use phonics and spelling strategies when spelling familiar and unfamiliar words."]],
    "years-3-and-4-word-list-roots-prefixes-and-suffixes": ["Spelling longer words: roots, prefixes and suffixes", "Second", ["LIT 2-21a"],
      ["I can apply my knowledge of spelling patterns, rules and strategies to spell most words correctly."]],
    "years-5-and-6-word-list-morphology-and-etymology": ["Spelling tricky words: word parts and where words come from", "Second", ["LIT 2-21a"],
      ["I can apply my knowledge of spelling patterns, rules and strategies to spell most words correctly."]],
    "joined-handwriting-years-3-and-4": ["Joined handwriting", "First", ["LIT 1-24a"],
      ["I can present my writing in a clear and legible way."]],
    "writing-legibly-fluently-and-at-speed-years-5-and-6": ["Writing fluently and legibly at speed", "Second", ["LIT 2-24a"],
      ["I can write in a fluent and legible way.", "I can make appropriate choices about presentation to engage the reader."]],
    "getting-ready-for-the-times-tables-check-year-4": ["Quick recall of times tables", "Second", ["MNU 2-03a"],
      ["I can use multiplication and division facts to the 10th multiplication table.", "I can apply my knowledge of number facts to solve problems."]],
    "getting-ready-for-the-phonics-check-year-1": ["Reading real and made-up words", "First", ["ENG 1-12a", "LIT 1-13a"],
      ["I can decode unknown words by locating and pronouncing familiar letter patterns and blends.", "I can use a range of word recognition strategies independently."]],
    "numbers-in-words-years-1-and-2": ["Numbers in words", "First", ["MNU 1-02a"],
      ["I can read, write, order and recite whole numbers to 1000, starting from any number in the sequence.", "I can identify the value of each digit in a whole number with three digits."]],
    "adding-and-subtracting-two-digit-numbers-in-your-head-year-2": ["Adding and subtracting two-digit numbers mentally", "First", ["MNU 1-02a", "MNU 1-03a"],
      ["I can solve addition and subtraction problems with whole numbers.", "I can add and subtract multiples of 10 to or from any whole number.", "I can show my understanding of the commutative law, for example, 6 + 3 = 3 + 6 or 2 × 4 = 4 × 2."]],
    "comparing-measures-and-quicker-or-later-years-1-and-2": ["Comparing measures, and how long things take", "First", ["MNU 1-11a", "MTH 1-15a", "MNU 1-10c"],
      ["I can record measurements of length, mass and capacity to the nearest standard unit.", "I can use the terms equal to, not equal to, less than and greater than, and the symbols for them.", "I can talk about how long tasks take."]],
    "three-digit-numbers-in-your-head-year-3": ["Three-digit numbers mentally", "First", ["MNU 1-02a", "MNU 1-03a"],
      ["I can add and subtract multiples of 10 or 100 to or from any whole number to 1000.", "I can solve addition and subtraction problems with three-digit whole numbers."]],
    "pounds-and-pence-adding-and-change-year-3": ["Pounds and pence: totals and change", "First", ["MNU 1-09a", "MNU 1-09b"],
      ["I can record amounts accurately in different ways, for example, 149p = £1·49.", "I can use coins and notes to pay for items and give change within £10.", "I can calculate the total spent in a shopping situation, and the change."]],
    "lines-and-shapes-parallel-perpendicular-and-quadrilaterals-years-3-and-4": ["Lines and shapes: sorting by their properties", "First", ["MTH 1-16a"],
      ["I can name, identify and classify a range of simple 2D shapes and 3D objects and recognise them in different orientations and sizes.", "I can use mathematical language to describe their properties, including side, face, edge, vertex, base and angle.", "I can identify 2D shapes within 3D objects."]],
    "angles-rectangles-and-accurate-drawing-years-5-and-6": ["Angles, rectangles and accurate drawing", "Second", ["MTH 2-17a", "MTH 2-16c", "MNU 2-11b"],
      ["I can describe and classify angles using acute, obtuse, straight and reflex.", "I can measure and draw a range of angles to within 2°, and know supplementary angles add up to 180°.", "I can use mathematical instruments to draw 2D shapes.", "I can calculate the perimeter of simple straight-sided 2D shapes."]],
    "counting-in-steps-and-roman-numerals-years-4-and-5": ["Counting in steps, and Roman numerals", "Second", ["MNU 2-02a", "MTH 2-13a", "MTH 1-12a"],
      ["I can apply my knowledge of multiples to generate number patterns.", "I can add and subtract multiples of 10, 100 and 1000 to and from whole numbers.", "I can investigate and share my understanding of a number system used in history, such as Roman numerals."]],
    "numbers-to-ten-million-year-6": ["Very large numbers", "Second", ["MNU 2-02a"],
      ["I can read, write and order whole numbers, starting from any number in the sequence.", "I can explain the link between a digit, its place and its value.", "I can solve problems involving whole numbers using a range of methods."]],
    "multiplication-reasoning-facts-splitting-scaling-and-combinations-years-3-to-6": ["Multiplication reasoning: facts, splitting and scaling", "Second", ["MNU 2-03a"],
      ["I can use multiplication and division facts to solve problems.", "I can interpret and solve multi-step problems using the four operations."]],
    "imperial-units-area-of-triangles-and-simple-formulae-years-5-and-6": ["Imperial units, area and simple formulae", "Second", ["MNU 2-11b", "MNU 2-11c", "MTH 2-15a"],
      ["I can show awareness of imperial units used in everyday life, for example, miles or stones.", "I can calculate the area of squares, rectangles and right-angled triangles.", "I can solve simple algebraic equations with one variable."]],
    "coordinates-plotting-translating-and-reflecting-years-4-to-6": ["Coordinates and moving shapes", "Second", ["MTH 2-18a"],
      ["I can describe, plot and record the location of a point in the first quadrant using coordinate notation.", "I can identify and illustrate line symmetry, and complete symmetrical patterns."]],
    "getting-ready-to-write-cutting-drawing-and-forming-digits-reception-and-year-1": ["Getting ready to write: cutting, drawing and numerals", "Early", ["LIT 0-21b"],
      ["I can use a pencil with increasing control and confidence.", "I can form most letters legibly, and know the difference between a letter, a word and a numeral."]],
    "the-alphabet-letter-names-and-the-days-of-the-week-year-1": ["The alphabet, letter names and the days of the week", "First", ["LIT 1-21a", "MNU 0-10a"],
      ["I can use my knowledge of the alphabet to find words in a dictionary or other reference source.", "I can use phonics and spelling strategies when spelling familiar and unfamiliar words.", "I can name the days of the week in sequence."]],
    "reading-longer-words-and-checking-it-makes-sense-years-1-and-2": ["Reading longer words, and checking it makes sense", "First", ["ENG 1-12a", "LIT 1-13a"],
      ["I can decode unknown words by locating and pronouncing familiar letter patterns and blends.", "I can use a range of word recognition strategies independently.", "I can use context clues to read and understand texts."]],
    "traditional-tales-retelling-and-story-language-years-1-and-2": ["Traditional tales: retelling and story language", "First", ["ENG 1-19a", "LIT 1-16a"],
      ["I can identify the main ideas of a text.", "I can offer my own ideas about characters, the writer's use of language, structure and setting.", "I can answer literal, inferential and evaluative questions about a text."]],
    "words-and-what-they-mean-years-1-to-6": ["Words and what they mean", "First", ["LIT 1-13a", "LIT 1-21a", "ENG 1-19a"],
      ["I can use context clues to read and understand texts.", "I can use my knowledge of the alphabet to find words in a dictionary.", "I can comment on the writer's choice of words."]],
    "poems-to-learn-say-and-write-year-2": ["Poems to learn, say and write", "First", ["ENG 1-31a", "LIT 1-13a"],
      ["I can read aloud a familiar piece of text, adding expression, and show understanding.", "I can create my own poem with recognisable features of the genre."]],
    "poetry-forms-and-performing-poems-years-3-to-6": ["Kinds of poem, and performing poetry", "Second", ["ENG 2-19a", "LIT 2-13a", "ENG 2-03a"],
      ["I can make relevant comments about the writer's style, use of language and features of the genre.", "I can read with fluency, understanding and expression, using appropriate pace and tone.", "I can apply verbal and non-verbal techniques when I present to others."]],
    "talking-about-my-writing-saying-it-reading-it-aloud-and-improving-it-years-1-and-2": ["Talking about my writing: saying it, reading it aloud and improving it", "First", ["LIT 1-23a", "LIT 1-10a"],
      ["I can check my writing to make sure it makes sense.", "I can communicate clearly and audibly.", "I can share my ideas and information in a logical order."]],
    "expanded-noun-phrases-years-2-5-and-6": ["Describing words: noun phrases", "First", ["LIT 1-26a"],
      ["I can use relevant and interesting vocabulary as appropriate for the context.", "I can include relevant information in my writing."]],
    "homophones-years-2-to-6": ["Homophones: words that sound the same", "Second", ["LIT 2-21a"],
      ["I can apply my knowledge of spelling patterns, rules and strategies to spell most words correctly."]],
    "myths-legends-and-themes-across-books-years-3-to-6": ["Myths, legends and themes", "Second", ["ENG 2-19a", "LIT 2-16a"],
      ["I can make relevant comments about structure, characterisation and setting, with reference to the text.", "I can relate the writer's theme to my own and others' experiences.", "I can respond to literal, inferential and evaluative questions about a text."]],
    "asking-questions-and-checking-understanding-as-i-read-years-3-to-6": ["Asking questions and checking understanding as I read", "Second", ["LIT 2-16a", "LIT 2-13a"],
      ["I can create different types of questions to show my understanding of a text.", "I can respond to literal, inferential and evaluative questions.", "I can apply reading strategies such as predicting, clarifying and summarising."]],
    "planning-from-a-model-rehearsing-aloud-and-improving-years-3-and-4": ["Learning from a model, rehearsing aloud and improving", "Second", ["LIT 2-23a", "LIT 2-26a"],
      ["I can organise information in a logical way.", "I can write most sentences in a grammatically accurate way.", "I can review and correct my writing to make sure it makes sense, is technically accurate and meets its purpose."]],
    "editing-and-proofreading-tense-the-perfect-form-and-effect-years-5-and-6": ["Editing and proofreading", "Second", ["LIT 2-23a", "LIT 2-21a"],
      ["I can review and correct my writing to make sure it makes sense, is technically accurate and meets its purpose.", "I can write most sentences in a grammatically accurate way.", "I can apply my knowledge of spelling patterns, rules and strategies to spell most words correctly."]]
  };
  lessons.forEach(l => {
    const v = l.england && CFE_VERSION[l.id.replace(/^lesson-england-/, "")];
    if (v) l.cfe = { title: v[0], level: v[1], codes: v[2], criteria: v[3] };
  });

  const LEVELS = ["Early", "First", "Second", "Third"];
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
