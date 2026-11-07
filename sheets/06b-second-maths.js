  /* ===================== Second level (P5 to P7): maths ===================== */
  // One sheet for each Second level maths lesson that had only online practice. Each sheet works on
  // paper what the screen can't: reasoning, explaining, choosing a method, reading scales and charts.
  // Uses qs, trueFalse and matchUp from the Third level sheets (they come first in name order).

  const S2 = id => `lesson-second-${id}`;
  // A number line from lo to hi, a tick every step, a label every `every` ticks; marks are [value, letter]
  const s2Line = (lo, hi, step, every, marks = [], w = 560) => {
    const n = Math.round((hi - lo) / step), x = i => 20 + (i * (w - 40)) / n;
    const fmt = v => String(Math.round(v * 1000) / 1000).replace("-", "−").replace(".", "·");
    return svg(w, 62, `<line x1="14" y1="30" x2="${w - 14}" y2="30" class="pp-axis"/>
      ${Array.from({ length: n + 1 }, (_, i) => `<line x1="${x(i)}" y1="${i % every ? 24 : 20}" x2="${x(i)}" y2="${i % every ? 36 : 40}" class="pp-axis"/>${i % every ? "" : `<text x="${x(i)}" y="56" text-anchor="middle" class="pp-small">${fmt(lo + i * step)}</text>`}`).join("")}
      ${marks.map(([v, l]) => `<text x="${x((v - lo) / step)}" y="14" text-anchor="middle" class="pp-lab">${l}</text><line x1="${x((v - lo) / step)}" y1="16" x2="${x((v - lo) / step)}" y2="27" class="pp-axis"/>`).join("")}`);
  };

  add("paper-round-estimate", S2("rounding-large-numbers-and-decimals"), "Round and estimate", "Round big numbers and decimals, estimate before calculating, and decide which way to round in real problems.", (who, h) => ({
    pupil: `${h.sheetHead("Round and estimate", who)}
      <p><b>1.</b> Round each number.</p>
      <table class="pp-table"><tr><th>Number</th><th>to the nearest 1000</th><th>to the nearest 10 000</th><th>to the nearest 100 000</th></tr>
        ${["487 362", "1 253 849", "65 501"].map(n => `<tr><td>${n}</td><td></td><td></td><td></td></tr>`).join("")}</table>
      <p><b>2.</b> Round each decimal.</p>
      <table class="pp-table"><tr><th>Decimal</th><th>to the nearest whole number</th><th>to 1 decimal place</th><th>to 2 decimal places</th></tr>
        ${["7·463", "12·083", "0·958"].map(n => `<tr><td>${n}</td><td></td><td></td><td></td></tr>`).join("")}</table>
      <p><b>3.</b> Estimate first, then work out the exact answer.</p>
      <table class="pp-table"><tr><th>Calculation</th><th>My estimate</th><th>Exact answer</th></tr>
        ${["4 978 + 3 104", "9 012 − 2 897", "61 × 39"].map(c => `<tr><td>${c}</td><td></td><td></td></tr>`).join("")}</table>
      ${qs([`Rolls come in packs of 6. 38 people each need one roll. How many packs should you buy? Did you round up or down, and why?${lines(1)}`,
        `A stadium holds 67 482 people. One headline says "Nearly 70 000 fans", another says "67 000 fans". Which is more useful for a reader, and why?${lines(1)}`], 4)}
      ${trueFalse(6, ["3 499 rounded to the nearest 1000 is 4 000", "2·95 rounded to 1 decimal place is 3·0", "149 999 rounded to the nearest 100 000 is 100 000", "0·45 rounded to the nearest whole number is 1"])}`,
    answers: answersPage(h, "Round and estimate", ["487 000, 490 000, 500 000; 1 254 000, 1 250 000, 1 300 000; 66 000, 70 000, 100 000",
      "7, 7·5, 7·46; 12, 12·1, 12·08; 1, 1·0, 0·96",
      "5 000 + 3 000 = 8 000 (exact 8 082); 9 000 − 3 000 = 6 000 (exact 6 115); 60 × 40 = 2 400 (exact 2 379)",
      "38 ÷ 6 = 6 r 2, so 7 packs: round up, or two people go without", "Either, with a reason: 67 000 is closer (to the nearest thousand); \"nearly 70 000\" gives the size quickly",
      "6. False (3 000); True; True; False (0)"], "Listen for why a real problem rounds up or down, not only the rule.")
  }));

  add("paper-millions", S2("place-value-to-a-million"), "Numbers to a million", "Read, write and order numbers to a million, the value of each digit, and adding and taking away 1000s and 10 000s.", (who, h) => ({
    pupil: `${h.sheetHead("Numbers to a million", who)}
      ${qs([`Write in figures: four hundred and six thousand, two hundred and fifty ${blank(5)} · seventy thousand and nine ${blank(5)} · one million ${blank(5)}`,
        `Write in words: 503 018 ${lines(1)} 240 600 ${lines(1)}`,
        `What is the 7 worth in each number? 372 145 ${blank(4)} &nbsp; 917 004 ${blank(4)} &nbsp; 700 321 ${blank(4)}`,
        `Put in order, smallest first: 504 300 · 540 030 · 54 300 · 503 400 · 500 430 ${lines(1)}`])}
      <p><b>5.</b> Fill in the table.</p>
      <table class="pp-table"><tr><th>Number</th><th>+ 1000</th><th>+ 10 000</th><th>− 100</th></tr>
        ${["48 950", "299 100", "990 000"].map(n => `<tr><td>${n}</td><td></td><td></td><td></td></tr>`).join("")}</table>
      ${qs([`Use the digits 3, 0, 8, 5, 1 and 6 once each. Make the largest six-digit number ${blank(5)} and the smallest ${blank(5)}`,
        `Sam says 99 999 is bigger than 100 000 because it has more nines. Is Sam right? Explain.${lines(2)}`], 6)}`,
    answers: answersPage(h, "Numbers to a million", ["406 250; 70 009; 1 000 000", "five hundred and three thousand and eighteen; two hundred and forty thousand, six hundred",
      "70 000; 7 000; 700 000", "54 300, 500 430, 503 400, 504 300, 540 030",
      "49 950, 58 950, 48 850; 300 100, 309 100, 299 000; 991 000, 1 000 000, 989 900",
      "865 310; 103 568 (a number can't start with 0)", "No: 100 000 has six digits, so it has a hundred thousands. 99 999 is one less than 100 000."],
      "Watch the zeros in 70 009 and 503 018: pupils often write 7 009 or 50 318. Ask what each digit is worth.")
  }));

  add("paper-thousandths", S2("decimals-to-three-places"), "Tenths, hundredths, thousandths", "The value of each digit in a decimal, partitioning, ordering and comparing decimals, and placing them on a line.", (who, h) => ({
    pupil: `${h.sheetHead("Tenths, hundredths, thousandths", who)}
      ${qs([`What is the 4 worth? 3·45 ${blank(4)} &nbsp; 0·074 ${blank(4)} &nbsp; 2·148 ${blank(4)} &nbsp; 41·6 ${blank(4)}`,
        `Fill in the gaps. 6·27 = 6 ones, ${blank(2)} tenths and ${blank(2)} hundredths &nbsp; · &nbsp; 3·6 = ${blank(2)} tenths &nbsp; · &nbsp; 0·45 = ${blank(2)} hundredths &nbsp; · &nbsp; 1·205 = 1 + ${blank(2)} + ${blank(3)}`,
        `Put in order, smallest first: 0·5 · 0·45 · 0·405 · 0·054 · 0·54 ${lines(1)}`,
        `Write &lt;, &gt; or =. &nbsp; 0·7 ${blank(1)} 0·70 &nbsp; · &nbsp; 0·08 ${blank(1)} 0·8 &nbsp; · &nbsp; 1·305 ${blank(1)} 1·35 &nbsp; · &nbsp; 2·1 ${blank(1)} 2·099`])}
      <div class="pp-q"><p><b>5.</b> Draw an arrow to show where each number goes: <b>0·3 &nbsp; 0·75 &nbsp; 0·05 &nbsp; 0·96</b></p>${s2Line(0, 1, 0.05, 2)}</div>
      ${qs([`Times in a 100 m race: Ava 14·08 s, Ben 14·8 s, Cara 14·085 s, Dev 14·18 s. Put them in finishing order. Who won?${lines(1)}`,
        `Lily says 0·25 is bigger than 0·3 because 25 is bigger than 3. Explain her mistake.${lines(2)}`], 6)}`,
    answers: answersPage(h, "Tenths, hundredths, thousandths", ["4 tenths (0·4); 4 hundredths (0·04); 4 hundredths (0·04); 4 tens (40)", "2 and 7; 36; 45; 0·2 + 0·005",
      "0·054, 0·405, 0·45, 0·5, 0·54", "=, &lt;, &lt;, &gt;", "Arrows at 0·3, three-quarters of the way (0·75), halfway between 0 and the first tick (0·05), and just before 1",
      "Ava (14·08), Cara (14·085), Dev (14·18), Ben (14·8). Ava won: the smallest time is the fastest.",
      "0·3 is 3 tenths, which is 30 hundredths; 0·25 is only 25 hundredths. Compare the tenths first."],
      "\"Longer means bigger\" is the common mistake (0·405 &gt; 0·45). Ask pupils to write each number with the same number of decimal places.")
  }));

  add("paper-big-sums", S2("adding-and-subtracting-large-numbers-and-decimals"), "Big numbers and decimals", "Written and mental adding and subtracting with large numbers and decimals, missing digits, and checking with the inverse.", (who, h) => ({
    pupil: `${h.sheetHead("Big numbers and decimals", who)}
      <p><b>1.</b> Work these out. Show your working.</p>
      <div class="pp-grid3">${["45 678 + 27 945", "304 015 − 128 760", "512 400 + 98 650", "6·75 + 12·8", "20 − 7·36", "15·4 − 8·75"]
        .map((c, i) => `<div class="pp-cell"><p><b>${String.fromCharCode(97 + i)})</b> ${c} =</p><div class="pp-draw" style="height:18mm"></div></div>`).join("")}</div>
      ${qs([`Would you work these out in your head or on paper? Choose, then explain why. &nbsp; 3 000 − 1 999 &nbsp; · &nbsp; 46 381 + 29 754${lines(2)}`,
        `Find the missing digits: &nbsp; 3 ☐ 6 + 1 4 ☐ = 5 1 3`,
        `A festival sold 128 450 tickets on Saturday and 96 875 on Sunday. How many tickets altogether? How many more on Saturday?${lines(2)}`,
        `Jo has £20. She buys a book for £7·49 and a pen for £2·85. How much change does she get?${lines(1)}`,
        `Mark says 8 004 − 3 567 = 4 547. Check with an addition. Is he right? If not, find the right answer.${lines(2)}`], 2)}`,
    answers: answersPage(h, "Big numbers and decimals", ["a) 73 623  b) 175 255  c) 611 050  d) 19·55  e) 12·64  f) 6·65",
      "3 000 − 1 999: in your head, as 3 000 − 2 000 + 1 = 1 001. 46 381 + 29 754 = 76 135: on paper, as there are many exchanges.",
      "3 6 6 + 1 4 7 = 5 1 3", "225 325 tickets; 31 575 more on Saturday", "£7·49 + £2·85 = £10·34, so £9·66 change",
      "4 547 + 3 567 = 8 114, not 8 004, so he's wrong. 8 004 − 3 567 = 4 437."],
      "For decimals, look for the points lined up (6·75 + 12·80). For 20 − 7·36, look for 20·00.")
  }));

  add("paper-facts-powers-ten", S2("multiplication-and-division-facts-and-10-100-1000"), "Facts and powers of ten", "Times tables and division facts, multiplying and dividing by 10, 100 and 1000, and using a fact to work out others.", (who, h) => ({
    pupil: `${h.sheetHead("Facts and powers of ten", who)}
      <div class="pp-q"><p><b>1.</b> Quick facts.</p><div class="pp-next">${["7 × 8", "9 × 6", "8 × 8", "6 × 7", "9 × 4", "7 × 9", "63 ÷ 9", "72 ÷ 8", "48 ÷ 6", "81 ÷ 9", "56 ÷ 7", "42 ÷ 6"].map(c => `<span>${c} = ${blank(2)}</span>`).join("")}</div></div>
      <p><b>2.</b> Fill in the table.</p>
      <table class="pp-table"><tr><th>Number</th><th>× 10</th><th>× 100</th><th>× 1000</th></tr><tr><td>3·7</td><td></td><td></td><td></td></tr><tr><td>0·06</td><td></td><td></td><td></td></tr>
        <tr><th>Number</th><th>÷ 10</th><th>÷ 100</th><th>÷ 1000</th></tr><tr><td>45</td><td></td><td></td><td></td></tr><tr><td>2 300</td><td></td><td></td><td></td></tr></table>
      ${qs([`Missing numbers: ${blank(3)} × 100 = 2 300 &nbsp; · &nbsp; 5·2 × ${blank(3)} = 520 &nbsp; · &nbsp; 8 400 ÷ ${blank(3)} = 8·4 &nbsp; · &nbsp; ${blank(3)} ÷ 10 = 0·9`,
        `7 × 8 = 56. Use this to work out: 70 × 8 = ${blank(3)} &nbsp; 7 × 80 = ${blank(3)} &nbsp; 0·7 × 8 = ${blank(3)} &nbsp; 5 600 ÷ 8 = ${blank(3)}`,
        `A box holds 1 000 sheets of paper. How many boxes hold 45 000 sheets? ${blank(3)} &nbsp; A metre of ribbon costs £0·85. How much do 100 metres cost? ${blank(3)}`,
        `Josh says "to multiply by 10, add a zero", so 3·5 × 10 = 3·50. Explain why that's wrong, and what really happens.${lines(2)}`], 3)}`,
    answers: answersPage(h, "Facts and powers of ten", ["56, 54, 64, 42, 36, 63; 7, 9, 8, 9, 8, 7", "37, 370, 3 700; 0·6, 6, 60; 4·5, 0·45, 0·045; 230, 23, 2·3",
      "23; 100; 1 000; 9", "560; 560; 5·6; 700", "45 boxes; £85",
      "3·50 is the same as 3·5. Multiplying by 10 makes every digit worth ten times as much, so each digit moves one place to the left: 35."],
      "Look for digits moving, not the decimal point \"jumping\". Place value charts help.")
  }));

  add("paper-long-multiply", S2("multiplying-by-2-digits-and-dividing-with-decimal-answers"), "Multiply and divide on paper", "Multiplying by two-digit numbers, decimals times a digit, dividing with decimal answers, and choosing what to do with a remainder.", (who, h) => ({
    pupil: `${h.sheetHead("Multiply and divide on paper", who)}
      <p><b>1.</b> Estimate first, then calculate. Use any written method.</p>
      <div class="pp-grid3">${["34 × 26", "58 × 47", "125 × 32"].map((c, i) => `<div class="pp-cell"><p><b>${String.fromCharCode(97 + i)})</b> ${c}</p><p>Estimate: ${blank(3)}</p><div class="pp-draw" style="height:26mm"></div></div>`).join("")}</div>
      <div class="pp-q"><p><b>2.</b> Decimals times a digit.</p><div class="pp-next">${["4·6 × 3", "2·35 × 4", "0·78 × 6"].map(c => `<span>${c} = ${blank(3)}</span>`).join("")}</div></div>
      <div class="pp-q"><p><b>3.</b> Divide. Give each answer as a decimal, not a remainder.</p><div class="pp-next">${["43 ÷ 5", "27 ÷ 4", "9·6 ÷ 3", "52 ÷ 8"].map(c => `<span>${c} = ${blank(3)}</span>`).join("")}</div></div>
      ${qs([`28 pupils each pay £14 for a trip. How much is paid altogether?${lines(1)}`,
        `A 7·5 m rope is cut into 6 equal pieces. How long is each piece?${lines(1)}`,
        `150 eggs are packed in boxes of 12. How many boxes are needed to pack all the eggs? Explain what you did with the remainder.${lines(2)}`], 4)}`,
    answers: answersPage(h, "Multiply and divide on paper", ["a) 30 × 30 = 900; 884  b) 60 × 50 = 3 000; 2 726  c) 100 × 30 = 3 000 (or 125 × 30 = 3 750); 4 000",
      "13·8; 9·4; 4·68", "8·6; 6·75; 3·2; 6·5", "£392", "1·25 m", "150 ÷ 12 = 12 r 6 (12·5), so 13 boxes: the last 6 eggs still need a box"],
      "Check estimates are made before calculating, and used to check the answer.")
  }));

  add("paper-negatives-line", S2("negative-numbers"), "Negative numbers", "Negative numbers on a line, in temperatures, lifts and money, and ordering them.", (who, h) => ({
    pupil: `${h.sheetHead("Negative numbers", who)}
      <div class="pp-q"><p><b>1.</b> Write the letter of each number above the line: <b>A −7 &nbsp; B 3 &nbsp; C −2 &nbsp; D 8 &nbsp; E −10</b></p>${s2Line(-10, 10, 1, 5)}</div>
      ${qs([`Put these temperatures in order, coldest first: 3°C · −5°C · 0°C · −1°C · −8°C · 6°C ${lines(1)}`,
        `It is −3°C and gets 5 degrees warmer. What is the temperature now? ${blank(3)}`,
        `It is 4°C and the temperature drops by 7 degrees. What is it now? ${blank(3)}`,
        `In the morning it was −6°C. By the afternoon it was 2°C. How many degrees did it rise? ${blank(3)}`,
        `A lift starts on floor 4. The car park is floor −2. How many floors does the lift go down? ${blank(3)}`,
        `Kim has £5 in her bank account and pays £8 with her card. What does her account show now? ${blank(3)}`,
        `Write three places where we use negative numbers in real life.${lines(2)}`], 2)}
      ${trueFalse(9, ["−9 is bigger than −2", "−1 is bigger than −10", "0 is bigger than −5", "−4 and 4 are the same distance from 0"])}`,
    answers: answersPage(h, "Negative numbers", ["E at −10, A at −7, C at −2, B at 3, D at 8", "−8, −5, −1, 0, 3, 6", "2°C", "−3°C", "8 degrees", "6 floors", "−£3 (£3 overdrawn)",
      "For example: temperatures, below sea level, bank accounts, lift floors below ground, golf scores", "9. False; True; True; True"],
      "If a pupil thinks −9 is bigger than −2, use a thermometer: which is colder?")
  }));

  add("paper-factors-primes", S2("multiples-factors-and-primes"), "Multiples, factors and primes", "Find multiples and factors, spot primes, sort numbers in a table and solve a common multiple problem.", (who, h) => ({
    pupil: `${h.sheetHead("Multiples, factors and primes", who)}
      ${qs([`Write the first five multiples of 7: ${blank(8)} &nbsp; and of 12: ${blank(8)}`,
        `Write all the factors of 24: ${blank(8)} &nbsp; 36: ${blank(9)} &nbsp; 17: ${blank(3)}`,
        `Circle the prime numbers: &nbsp; 2 &nbsp; 9 &nbsp; 11 &nbsp; 15 &nbsp; 19 &nbsp; 21 &nbsp; 23 &nbsp; 27 &nbsp; 29 &nbsp; 31`])}
      <div class="pp-q"><p><b>4.</b> Write each number in the right box: &nbsp; 2 &nbsp; 4 &nbsp; 6 &nbsp; 9 &nbsp; 12 &nbsp; 15 &nbsp; 18 &nbsp; 20 &nbsp; 27 &nbsp; 36</p>
        <table class="pp-table"><tr><th></th><th>A factor of 36</th><th>Not a factor of 36</th></tr><tr><th>A multiple of 3</th><td style="height:40px"></td><td></td></tr><tr><th>Not a multiple of 3</th><td style="height:40px"></td><td></td></tr></table></div>
      ${qs([`One bus leaves every 6 minutes and another every 8 minutes. Both leave at 9:00. When do they next leave together? Show how you know.${lines(2)}`,
        `Why is 1 not a prime number? Why is 2 the only even prime?${lines(2)}`], 5)}`,
    answers: answersPage(h, "Multiples, factors and primes", ["7, 14, 21, 28, 35; 12, 24, 36, 48, 60", "1, 2, 3, 4, 6, 8, 12, 24; 1, 2, 3, 4, 6, 9, 12, 18, 36; 1, 17",
      "2, 11, 19, 23, 29, 31", "Multiple of 3 and factor of 36: 6, 9, 12, 18, 36. Multiple of 3, not a factor: 15, 27. Factor, not a multiple of 3: 2, 4. Neither: 20.",
      "9:24 (24 is the lowest common multiple of 6 and 8)", "A prime has exactly two factors; 1 has only one. Every other even number has 2 as a factor as well as 1 and itself."],
      "Listen for factor pairs (1 × 24, 2 × 12, 3 × 8, 4 × 6) as a way to find them all.")
  }));

  add("paper-same-value", S2("fractions-decimals-and-percentages-are-linked"), "Same value, different forms", "Fractions, decimals and percentages for the same amount, ordering them, choosing the easiest form, and a deal to compare.", (who, h) => {
    const grid = svg(162, 162, gridLines(10, 10, 16, 1, 1));
    return {
      pupil: `${h.sheetHead("Same value, different forms", who)}
        <p><b>1.</b> Fill in the table.</p>
        <table class="pp-table"><tr><th>Fraction</th><th>Decimal</th><th>Percentage</th></tr>
          ${[["1/2", "0·5", "50%"], ["1/4", "", ""], ["", "0·75", ""], ["", "", "10%"], ["2/5", "", ""], ["", "0·07", ""], ["", "", "30%"]].map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table>
        ${qs([`Put in order, smallest first: 0·6 · 55% · ¾ · 0·08 · ½ ${lines(1)}`,
          `Choose the easiest form, then work it out: 25% of 48 = ${blank(3)} &nbsp; 0·5 × 36 = ${blank(3)} &nbsp; 10% of 70 = ${blank(3)}`,
          `A jacket costs £40. Shop A takes ¼ off. Shop B takes 20% off. Which shop is cheaper, and by how much?${lines(2)}`], 2)}
        <div class="pp-side"><div>${grid}</div><div>${qs([`Shade 0·35 of the grid. What percentage is shaded? ${blank(3)} What fraction? ${blank(3)}`], 5)}
          ${trueFalse(6, ["0·4 = 4%", "3/10 = 30%", "0·25 = ¼", "⅓ = 0·3"])}</div></div>`,
      answers: answersPage(h, "Same value, different forms", ["1/4 = 0·25 = 25%; 3/4 = 0·75 = 75%; 1/10 = 0·1 = 10%; 2/5 = 0·4 = 40%; 7/100 = 0·07 = 7%; 3/10 = 0·3 = 30%",
        "0·08, ½, 55%, 0·6, ¾", "12 (¼ of 48); 18 (half of 36); 7", "A: £40 − £10 = £30. B: £40 − £8 = £32. Shop A is £2 cheaper.", "35 squares; 35%; 35/100 = 7/20",
        "6. False (40%); True; True; False (0·333…)"], "Ask why ¼ off is more than 20% off: ¼ is 25%.")
    };
  });

  add("paper-amounts", S2("percentages-and-fractions-of-amounts"), "Fractions and percentages of amounts", "Find fractions and percentages of amounts, sale prices, a class survey, and how to build 15% from 10% and 5%.", (who, h) => ({
    pupil: `${h.sheetHead("Fractions and percentages of amounts", who)}
      <div class="pp-q"><p><b>1.</b> Fractions of amounts.</p><div class="pp-next">${["⅓ of 27", "⅗ of 60", "⅔ of 45", "¾ of 120", "⅝ of 40", "7/10 of 200"].map(c => `<span>${c} = ${blank(3)}</span>`).join("")}</div></div>
      <div class="pp-q"><p><b>2.</b> Percentages of amounts.</p><div class="pp-next">${["10% of 350", "25% of 84", "50% of £6·40", "15% of 60", "5% of 240", "75% of 48"].map(c => `<span>${c} = ${blank(3)}</span>`).join("")}</div></div>
      ${qs([`Trainers cost £80. In a sale they are 15% off. How much is taken off? ${blank(3)} What is the sale price? ${blank(3)}`,
        `A £24 game has 25% off. What is the sale price? ${blank(3)}`,
        `In a class of 30, 40% walk to school, ⅓ come by bus and the rest come by car. How many come each way? Show your working.${lines(2)}`,
        `Explain how you can find 15% of any amount using 10% and 5%. Use 15% of £60 as your example.${lines(2)}`], 3)}`,
    answers: answersPage(h, "Fractions and percentages of amounts", ["9; 36; 30; 90; 25; 140", "35; 21; £3·20; 9; 12; 36", "£12 off; £68", "£18",
      "Walk 12 (10% is 3, × 4); bus 10; car 8", "Find 10% (divide by 10: £6), halve it for 5% (£3), then add: 15% = £9"],
      "For ⅗ of 60, look for \"divide by the bottom, multiply by the top\": 60 ÷ 5 = 12, × 3 = 36.")
  }));

  add("paper-equivalent", S2("equivalent-fractions-and-simplest-form"), "Equivalent fractions", "Make equivalent fractions, simplify, order fractions with different denominators, and explain with a diagram.", (who, h) => ({
    pupil: `${h.sheetHead("Equivalent fractions", who)}
      ${qs([`Fill in the missing numbers: &nbsp; 1/2 = ${blank(1)}/8 &nbsp; · &nbsp; 3/4 = 9/${blank(1)} &nbsp; · &nbsp; 2/5 = ${blank(1)}/20 &nbsp; · &nbsp; 6/9 = 2/${blank(1)} &nbsp; · &nbsp; 10/15 = ${blank(1)}/3`,
        `Write each fraction in its simplest form: &nbsp; 6/8 ${blank(2)} &nbsp; 10/12 ${blank(2)} &nbsp; 15/25 ${blank(2)} &nbsp; 14/21 ${blank(2)} &nbsp; 20/50 ${blank(2)} &nbsp; 9/27 ${blank(2)}`,
        `Put in order, smallest first: 3/4 · 2/3 · 5/12 · 1/2 · 5/6. Hint: change them all to twelfths. ${lines(1)}`,
        `Draw two bars the same length to show that 2/3 = 4/6.<div class="pp-draw pp-short"></div>`,
        `Ali ate 3/8 of a pizza. Beth ate 1/4 of a pizza the same size. Who ate more? How do you know?${lines(1)}`,
        `Which is the odd one out? 2/3 · 4/6 · 6/9 · 8/10. Explain.${lines(1)}`])}`,
    answers: answersPage(h, "Equivalent fractions", ["4; 12; 8; 3; 2", "3/4; 5/6; 3/5; 2/3; 2/5; 1/3", "5/12, 1/2 (6/12), 2/3 (8/12), 3/4 (9/12), 5/6 (10/12)",
      "One bar in 3 equal parts with 2 shaded; the other in 6 equal parts with 4 shaded; the shaded lengths match", "Ali: 1/4 = 2/8, and 3/8 is more than 2/8",
      "8/10: the others all equal 2/3, but 8/10 = 4/5"], "Ask what you did to the top and the bottom, and why that keeps the fraction the same size.")
  }));

  add("paper-budget", S2("budgets-best-value-profit-and-loss"), "Budget and best value", "Plan a meal for three on a £25 budget, compare best value, work out profit and loss, and think about paying by card.", (who, h) => ({
    pupil: `${h.sheetHead("Budget and best value", who)}
      <div class="pp-side"><table class="pp-table"><tr><th colspan="2">Café prices</th></tr>${[["Pizza", "£6·50"], ["Burger", "£5·25"], ["Salad", "£4·80"], ["Smoothie", "£2·90"], ["Juice", "£1·35"], ["Ice cream", "£2·15"], ["Cookie", "£0·95"]].map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</table>
        <div><p><b>1.</b> Plan lunch for 3 people. Each needs a main meal and a drink. Spend no more than <b>£25</b>.</p>
          <table class="pp-table"><tr><th>Item</th><th>How many</th><th>Cost</th></tr>${"<tr><td></td><td></td><td></td></tr>".repeat(5)}<tr><th colspan="2">Total</th><td></td></tr></table>
          <p>Change from £25: ${blank(3)}</p></div></div>
      ${qs([`Pack A: 6 rolls for £1·80. Pack B: 10 rolls for £2·70. Which is better value? Show how you know.${lines(2)}`,
        `4 cinema tickets cost £34. How much is one ticket? ${blank(3)}`,
        `A class spends £14·60 on ingredients and sells 36 cakes at 50p each. Did they make a profit or a loss? How much?${lines(1)}`,
        `Ravi bought a comic for £4·50 and sold it for £3·75. Profit or loss? How much? ${blank(4)}`,
        `Give one good thing and one risk about paying with a bank card or phone instead of cash.${lines(2)}`], 2)}`,
    answers: answersPage(h, "Budget and best value", ["Answers vary. Check: three mains and three drinks, correct total, total no more than £25, correct change. For example 3 burgers (£15·75) and 3 juices (£4·05) = £19·80, £5·20 change.",
      "A: 30p a roll. B: 27p a roll. B is better value.", "£8·50", "36 × 50p = £18; £18 − £14·60 = £3·40 profit", "Loss of 75p",
      "For example: good: quick, no need to carry cash, a record of spending. Risk: easy to overspend, lost or stolen card, someone could copy details."])
  }));

  add("paper-timetables", S2("12-and-24-hour-time-and-timetables"), "Timetable time", "Change between 12- and 24-hour time, plan a journey from a bus timetable, and work with dates.", (who, h) => ({
    pupil: `${h.sheetHead("Timetable time", who)}
      <p><b>1.</b> Change to the other kind of time.</p>
      <table class="pp-table"><tr><th>12-hour</th><th>24-hour</th><th>12-hour</th><th>24-hour</th></tr>
        <tr><td>3:45 pm</td><td></td><td></td><td>18:20</td></tr><tr><td>9:05 am</td><td></td><td></td><td>23:55</td></tr><tr><td>12:30 am</td><td></td><td></td><td>00:15</td></tr></table>
      <p><b>2.</b> Use the bus timetable.</p>
      <table class="pp-table"><tr><th>Town Centre</th><td>08:15</td><td>09:40</td><td>11:05</td></tr><tr><th>Library</th><td>08:27</td><td>09:52</td><td>11:17</td></tr>
        <tr><th>Park</th><td>08:41</td><td>10:06</td><td>11:31</td></tr><tr><th>Station</th><td>08:58</td><td>10:23</td><td>11:48</td></tr></table>
      ${qs([`How long does the bus take from the Town Centre to the Station? ${blank(4)}`,
        `You get on at the Library and need to be at the Station by 10:30. Which bus do you catch? ${blank(4)}`,
        `You reach the Library at 09:57. How long must you wait for the next bus? ${blank(4)}`,
        `Write the time the 11:05 bus reaches the Park in 12-hour time. ${blank(4)}`,
        `A swimming course starts on Monday 3 March and runs every Monday for 4 weeks. What is the date of the last lesson? ${blank(4)}`], 3)}`,
    answers: answersPage(h, "Timetable time", ["15:45; 09:05; 00:30; 6:20 pm; 11:55 pm; 12:15 am", "(The timetable is for questions 3 to 7.)", "43 minutes", "The 09:52 (it arrives at 10:23)", "1 hour 20 minutes (until 11:17)", "11:31 am", "Monday 24 March"],
      "12:30 am is half past midnight (00:30). Pupils often write 12:30.")
  }));

  add("paper-durations", S2("durations-units-of-time-speed-and-distance"), "How long, how far, how fast", "Convert units of time, work out durations across hours, choose the right timer, and use speed, distance and time.", (who, h) => ({
    pupil: `${h.sheetHead("How long, how far, how fast", who)}
      <div class="pp-q"><p><b>1.</b> Convert.</p><div class="pp-next">${["1¾ hours = ___ minutes", "2½ hours = ___ minutes", "200 seconds = ___ min ___ s", "90 minutes = ___ hours", "3 days = ___ hours"].map(c => `<span>${c.replace(/___/g, blank(2))}</span>`).join("")}</div></div>
      <p><b>2.</b> How long is it from the start to the end?</p>
      <table class="pp-table"><tr><th>Start</th><th>End</th><th>How long?</th></tr><tr><td>10:45</td><td>13:20</td><td></td></tr><tr><td>21:50</td><td>00:15 the next day</td><td></td></tr><tr><td>7:35 am</td><td>4:10 pm</td><td></td></tr></table>
      ${matchUp(3, "Match each thing to the best way to time it.", ["A 100 m sprint", "Boiling an egg", "A flight to Spain", "Growing a sunflower"], ["Days or weeks", "Minutes on a kitchen timer", "A stopwatch, to hundredths of a second", "Hours and minutes"])}
      ${qs([`A car travels at 60 km per hour for 2½ hours. How far does it go? ${blank(3)}`,
        `Mo walks at 4 km per hour. How long does a 10 km walk take? ${blank(3)}`,
        `A train goes 240 km in 2 hours. What is its average speed? ${blank(3)}`,
        `Ella ran 100 m in 12·47 s and Finn in 12·5 s. Who was faster, and by how much? ${blank(5)}`], 4)}`,
    answers: answersPage(h, "How long, how far, how fast", ["105; 150; 3 min 20 s; 1½; 72", "2 h 35 min; 2 h 25 min; 8 h 35 min",
      "Sprint: stopwatch to hundredths. Egg: minutes on a kitchen timer. Flight: hours and minutes. Sunflower: days or weeks.", "150 km", "2½ hours (2 h 30 min)", "120 km per hour", "Ella, by 0·03 s"],
      "For durations, look for counting on to the next hour, then on again, rather than taking away the times.")
  }));

  add("paper-measure-convert", S2("estimate-measure-and-convert-metric-units"), "Measure and convert", "Estimate with familiar objects, read scales, convert metric units and solve measuring problems.", (who, h) => ({
    pupil: `${h.sheetHead("Measure and convert", who)}
      ${matchUp(1, "Match each thing to the best estimate.", ["The height of a door", "A bag of sugar", "A mug of tea", "A new pencil"], ["300 ml", "15 cm", "2 m", "1 kg"])}
      <div class="pp-q"><p><b>2.</b> What does each arrow show? &nbsp; A ${blank(3)} ml &nbsp; B ${blank(3)} kg</p>${s2Line(0, 500, 20, 5, [[340, "A"]])}${s2Line(0, 2, 0.1, 5, [[1.3, "B"]])}</div>
      <div class="pp-q"><p><b>3.</b> Convert.</p><div class="pp-next">${["550 cm = ___ m", "2·4 km = ___ m", "3 750 g = ___ kg", "0·6 l = ___ ml", "85 mm = ___ cm", "1·25 l = ___ ml"].map(c => `<span>${c.replace("___", blank(3))}</span>`).join("")}</div></div>
      ${qs([`Put in order, lightest first: 1·5 kg · 1 450 g · 0·9 kg · 1 kg 20 g ${lines(1)}`,
        `A recipe needs 750 g of flour. A bag holds 1·5 kg. How many times can you make the recipe? ${blank(3)}`,
        `A 3 m ribbon is cut into 40 cm pieces. How many pieces? How much is left over?${lines(1)}`], 4)}`,
    answers: answersPage(h, "Measure and convert", ["Door: 2 m. Sugar: 1 kg. Mug: 300 ml. Pencil: 15 cm.", "A 340 ml; B 1·3 kg", "5·5 m; 2 400 m; 3·75 kg; 600 ml; 8·5 cm; 1 250 ml",
      "0·9 kg, 1 kg 20 g, 1 450 g, 1·5 kg", "2 times", "7 pieces (280 cm), 20 cm left"],
      "For the scales, ask what each small step is worth before reading the arrow.")
  }));

  add("paper-area-volume", S2("perimeter-area-and-volume"), "Perimeter, area and volume", "Perimeter and area of rectangles, triangles and an L-shape, volume of cuboids, and drawing a shape to a given area and perimeter.", (who, h) => {
    const s = 14;
    const shapes = svg(600, 150, `<rect x="10" y="20" width="${8 * s}" height="${5 * s}" class="pp-shape"/><text x="${10 + 4 * s}" y="14" text-anchor="middle" class="pp-small">8 cm</text><text x="${16 + 8 * s}" y="${24 + 2.5 * s}" class="pp-small">5 cm</text><text x="10" y="${40 + 5 * s}" class="pp-lab">A</text>
      <polygon points="220,${20 + 6 * s} ${220 + 8 * s},${20 + 6 * s} 220,20" class="pp-shape"/><text x="${220 + 4 * s}" y="${36 + 6 * s}" text-anchor="middle" class="pp-small">8 cm</text><text x="182" y="${24 + 3 * s}" class="pp-small">6 cm</text><text x="${226 + 4 * s}" y="${16 + 3 * s}" class="pp-small">10 cm</text><text x="200" y="${48 + 6 * s}" class="pp-lab">B</text>
      <polygon points="400,20 ${400 + 10 * s},20 ${400 + 10 * s},${20 + 6 * s} ${400 + 4 * s},${20 + 6 * s} ${400 + 4 * s},${20 + 3 * s} 400,${20 + 3 * s}" class="pp-shape"/>
      <text x="${400 + 5 * s}" y="14" text-anchor="middle" class="pp-small">10 cm</text><text x="${406 + 10 * s}" y="${24 + 3 * s}" class="pp-small">6 cm</text><text x="362" y="${24 + 1.5 * s}" class="pp-small">3 cm</text><text x="${400 + 7 * s}" y="${36 + 6 * s}" text-anchor="middle" class="pp-small">6 cm</text><text x="400" y="${48 + 6 * s}" class="pp-lab">C</text>`);
    return {
      pupil: `${h.sheetHead("Perimeter, area and volume", who)}<p><b>1.</b> Find the perimeter and area of each shape. Show your working.</p>${shapes}
        <table class="pp-table"><tr><th>Shape</th><th>Perimeter</th><th>Area</th></tr><tr><td>A (rectangle)</td><td></td><td></td></tr><tr><td>B (right-angled triangle)</td><td></td><td></td></tr><tr><td>C (L-shape)</td><td></td><td></td></tr></table>
        ${qs([`A cuboid is 5 cm long, 4 cm wide and 3 cm high. What is its volume? ${blank(3)}`, `What is the volume of a cube with edges of 4 cm? ${blank(3)}`], 2)}
        <div class="pp-side"><div>${svg(12 * 16 + 4, 8 * 16 + 4, gridLines(12, 8, 16, 2, 2))}</div>
          <div>${qs([`On the squared grid (each square is 1 cm²), draw a rectangle with an area of 24 cm² and a perimeter of 20 cm.`, `Draw a different shape that also has an area of 24 cm². Is its perimeter the same?${lines(1)}`], 4)}</div></div>`,
      answers: answersPage(h, "Perimeter, area and volume", ["A: 26 cm, 40 cm². B: 24 cm, 24 cm² (half of 8 × 6). C: 32 cm, 48 cm² (10 × 6 − 4 × 3, or 10 × 3 + 6 × 3).", "60 cm³", "64 cm³",
        "6 cm by 4 cm", "For example 8 by 3 (perimeter 22 cm) or 12 by 2 (28 cm): the same area can have different perimeters."],
      "Check units: cm for perimeter, cm² for area, cm³ for volume.")
    };
  });

  add("paper-special-numbers", S2("square-triangular-and-fibonacci-numbers"), "Special number patterns", "Square, triangular and Fibonacci numbers: continue them, draw them and find links between them.", (who, h) => {
    const dots = (pts, w) => svg(w, 70, pts.map(([x, y]) => `<circle cx="${10 + x * 14}" cy="${10 + y * 14}" r="4" class="pp-dot"/>`).join(""));
    const sq = n => Array.from({ length: n * n }, (_, i) => [i % n, Math.floor(i / n)]);
    const tri = n => Array.from({ length: n }, (_, r) => Array.from({ length: r + 1 }, (_, c) => [c + (n - 1 - r) / 2, r])).flat();
    return {
      pupil: `${h.sheetHead("Special number patterns", who)}
        <div style="display:flex;gap:48px;align-items:flex-end;margin:4px 0">${[[dots(sq(3), 60), "The 3rd square number: 9"], [dots(tri(3), 60), "The 3rd triangular number: 6"]].map(([d, t]) => `<div>${d}<p class="pp-small" style="margin:2px 0">${t}</p></div>`).join("")}</div>
        ${qs([`Draw the 4th square number and the 4th triangular number as dots.<div class="pp-draw pp-short"></div>`])}
        ${qs([`Square numbers: 1, 4, 9, 16, 25, ${blank(2)}, ${blank(2)}, ${blank(2)}`,
          `Triangular numbers: 1, 3, 6, 10, 15, ${blank(2)}, ${blank(2)}, ${blank(2)}`,
          `Fibonacci numbers: 1, 1, 2, 3, 5, 8, ${blank(2)}, ${blank(2)}, ${blank(2)}. What is the rule?${lines(1)}`,
          `Add next-door triangular numbers: 1 + 3 = ${blank(2)} &nbsp; 3 + 6 = ${blank(2)} &nbsp; 6 + 10 = ${blank(2)} &nbsp; 10 + 15 = ${blank(2)}. What do you notice?${lines(1)}`,
          `Which number between 2 and 50 is both a square number and a triangular number? ${blank(3)}`,
          `A pattern starts at 5 and adds 4 each time. Write the first five terms, then find the 10th term without writing them all.${lines(2)}`], 2)}`,
      answers: answersPage(h, "Special number patterns", ["A 4 × 4 square of 16 dots; a triangle of 10 dots (rows of 1, 2, 3, 4)", "36, 49, 64", "21, 28, 36", "13, 21, 34. Add the two numbers before.",
        "4, 9, 16, 25: they make the square numbers", "36", "5, 9, 13, 17, 21. 10th term: 5 + 9 × 4 = 41."],
        "Ask pupils to explain why square numbers are called square, using the dots.")
    };
  });

  add("paper-solve-it", S2("solving-simple-equations"), "Solve it", "Solve one-step and two-step equations, write equations from words, and check an answer by substituting.", (who, h) => ({
    pupil: `${h.sheetHead("Solve it", who)}
      <div class="pp-q"><p><b>1.</b> Find the value of each letter.</p><div class="pp-next">${["a − 30 = 40", "4b = 20", "c + 17 = 52", "d ÷ 6 = 9", "7g = 63", "50 − f = 18", "3e + 2 = 23", "h ÷ 2 + 5 = 12"].map(c => `<span>${c} &nbsp; ${c.match(/[a-h]/)[0]} = ${blank(2)}</span>`).join("")}</div></div>
      ${qs([`I think of a number and multiply it by 5. The answer is 45. Write an equation and solve it.${lines(1)}`,
        `A pen and a £3 notebook cost £4·20 altogether. Write an equation for the cost of the pen, p, and solve it.${lines(1)}`,
        `3 bags of marbles and 4 loose marbles are 19 marbles altogether. Each bag holds the same number. How many marbles are in a bag? Show your equation.${lines(2)}`,
        `Ella solved 2x + 6 = 20 and got x = 13. Put 13 back into the equation to check. Is she right? If not, find x.${lines(2)}`,
        `Write your own equation whose answer is 8. Swap with a partner.${lines(1)}`], 2)}`,
    answers: answersPage(h, "Solve it", ["a = 70, b = 5, c = 35, d = 54, g = 9, f = 32, e = 7, h = 14", "5n = 45, n = 9", "p + 3 = 4·20, p = £1·20", "3m + 4 = 19, 3m = 15, m = 5",
      "2 × 13 + 6 = 32, not 20, so no. 2x = 14, x = 7.", "Any equation with 8 as its answer, such as y + 12 = 20"],
      "Look for the inverse being used to undo each step, and for checking by substituting.")
  }));

  add("paper-nets-circles", S2("shape-properties-nets-and-circles"), "Shapes, nets and circles", "Parts of a circle, radius and diameter, which nets make a cube, naming 3D objects from their properties and diagonals.", (who, h) => {
    const s = 16;
    const net = (cells, label) => `<div class="pp-cell">${svg(4 * s + 4, 3 * s + 4, cells.map(([x, y]) => `<rect x="${2 + x * s}" y="${2 + y * s}" width="${s}" height="${s}" class="pp-shape"/>`).join(""))}<p>${label} ${tick(["Yes", "No"])}</p></div>`;
    const circle = svg(150, 130, `<circle cx="70" cy="65" r="55" class="pp-shape"/><circle cx="70" cy="65" r="3" class="pp-dot"/><line x1="70" y1="65" x2="109" y2="26" class="pp-shape"/><line x1="15" y1="65" x2="125" y2="65" class="pp-shape"/>
      <text x="92" y="40" class="pp-lab">A</text><text x="40" y="60" class="pp-lab">B</text><text x="128" y="110" class="pp-lab">C</text><line x1="118" y1="102" x2="110" y2="96" class="pp-shape"/>`);
    return {
      pupil: `${h.sheetHead("Shapes, nets and circles", who)}
        <div class="pp-side"><div>${circle}</div><div>${qs([`Label A, B and C: radius, diameter or circumference? A ${blank(4)} B ${blank(4)} C ${blank(4)}`,
          `A circle has a radius of 4 cm. Its diameter is ${blank(2)} &nbsp; Another has a diameter of 15 cm. Its radius is ${blank(2)}`])}</div></div>
        <div class="pp-q"><p><b>3.</b> Which of these nets fold to make a cube? Tick yes or no.</p>
          <div class="pp-grid3" style="grid-template-columns:repeat(4,1fr)">${net([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], "a)")}${net([[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 0]], "b)")}${net([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], "c)")}${net([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], "d)")}</div></div>
        ${qs([`Name each 3D object. &nbsp; Six faces, all squares: ${blank(4)} &nbsp; Two triangle faces and three rectangles: ${blank(5)} &nbsp; One curved face and one circular flat face: ${blank(4)}`,
          `Draw a regular hexagon and an irregular hexagon. Draw all the diagonals from one corner of each.<div class="pp-draw pp-short"></div>`,
          `How many diagonals does a pentagon have altogether? ${blank(2)} A hexagon? ${blank(2)}`], 4)}`,
      answers: answersPage(h, "Shapes, nets and circles", ["A radius, B diameter, C circumference", "8 cm; 7·5 cm", "a) yes  b) no (the two end squares fold onto the same face)  c) yes  d) no",
        "Cube; triangular prism; cone", "A regular hexagon has equal sides and angles; an irregular one doesn't. From one corner there are 3 diagonals in each.", "5; 9"],
      "Let pupils cut out and fold the nets if they're unsure.")
    };
  });

  add("paper-angles-measure", S2("classifying-and-measuring-angles"), "Measure and name angles", "Classify angles, measure them with a protractor, draw angles and find complementary and supplementary angles.", (who, h) => {
    const degs = shuffle([40, 75, 110, 135, 160]);
    // The vertex sits left for an acute angle and in the middle for an obtuse one, so both arms fit
    const ang = d => { const r = (d * Math.PI) / 180, vx = d > 90 ? 80 : 20;
      return svg(150, 95, `<line x1="${vx}" y1="80" x2="${vx + 66}" y2="80" class="pp-shape"/><line x1="${vx}" y1="80" x2="${(vx + 66 * Math.cos(r)).toFixed(1)}" y2="${(80 - 66 * Math.sin(r)).toFixed(1)}" class="pp-shape"/>`); };
    return {
      pupil: `${h.sheetHead("Measure and name angles", who)}
        <div class="pp-q"><p><b>1.</b> Acute, right, obtuse, straight or reflex?</p><div class="pp-next">${["35°", "90°", "145°", "180°", "260°", "89°", "91°"].map(c => `<span>${c} ${blank(3)}</span>`).join("")}</div></div>
        <div class="pp-q"><p><b>2.</b> Measure each angle with a protractor.</p><div class="pp-grid3" style="grid-template-columns:repeat(5,1fr)">${degs.map((d, i) => `<div class="pp-cell">${ang(d)}<p><b>${String.fromCharCode(97 + i)})</b> ${blank(2)}°</p></div>`).join("")}</div></div>
        <div class="pp-cols pp-grow">${box("3. Draw an angle of 65°", '<div class="pp-draw"></div>')}${box("4. Draw an angle of 120°", '<div class="pp-draw"></div>')}</div>
        ${qs([`Complementary angles add to 90°. Find the partner of 35° ${blank(2)} and of 72° ${blank(2)}`,
          `Supplementary angles add to 180°. Find the partner of 110° ${blank(2)} and of 45° ${blank(2)}`,
          `Two angles sit on a straight line. One is 128°. What is the other, and how do you know?${lines(1)}`], 5)}`,
      answers: answersPage(h, "Measure and name angles", ["acute, right, obtuse, straight, reflex, acute, obtuse", `${degs.map((d, i) => `${String.fromCharCode(97 + i)}) ${d}°`).join(", ")} (accept within 2°)`,
        "Check with a protractor: within 2°", "Check with a protractor: within 2°", "55°; 18°", "70°; 135°", "52°, because angles on a straight line add to 180°"],
      "Watch for reading the wrong scale on the protractor: an obtuse angle measured as acute is a sign.")
    };
  });

  add("paper-maps-coordinates", S2("compass-points-scale-and-coordinates"), "Maps and coordinates", "The eight compass points and turns between them, map scales, and reading and plotting coordinates.", (who, h) => {
    const s = 20, o = 8 * s + 14;
    const grid = svg(8 * s + 30, 8 * s + 30, `${gridLines(8, 8, s, 14, 14)}<line x1="14" y1="${o}" x2="${8 * s + 14}" y2="${o}" class="pp-axis"/><line x1="14" y1="14" x2="14" y2="${o}" class="pp-axis"/>
      ${Array.from({ length: 9 }, (_, i) => `<text x="${14 + i * s - 3}" y="${o + 13}" class="pp-small">${i}</text>${i ? `<text x="2" y="${o - i * s + 4}" class="pp-small">${i}</text>` : ""}`).join("")}
      ${[["P", 3, 6], ["Q", 7, 2], ["R", 0, 5]].map(([l, x, y]) => `<circle cx="${14 + x * s}" cy="${o - y * s}" r="3.5" class="pp-dot"/><text x="${14 + x * s + 5}" y="${o - y * s - 5}" class="pp-lab pp-halo">${l}</text>`).join("")}`);
    const rose = svg(200, 190, `<circle cx="100" cy="95" r="4" class="pp-dot"/>${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4 - Math.PI / 2, l = i % 2 ? 40 : 56, b = l + 20;
      return `<line x1="100" y1="95" x2="${(100 + l * Math.cos(a)).toFixed(1)}" y2="${(95 + l * Math.sin(a)).toFixed(1)}" class="pp-shape"/>${i === 0 ? '<text x="94" y="28" class="pp-lab">N</text>' : `<rect x="${(100 + b * Math.cos(a) - 14).toFixed(1)}" y="${(95 + b * Math.sin(a) - 9).toFixed(1)}" width="28" height="18" class="pp-frame"/>`}`; }).join("")}`);
    return {
      pupil: `${h.sheetHead("Maps and coordinates", who)}
        <div class="pp-side"><div>${rose}</div><div>${qs([`Fill in the other seven compass points.`,
          `How many degrees clockwise from N to E? ${blank(2)} From N to SW? ${blank(2)}`,
          `You face W and turn 135° clockwise. Which way do you face now? ${blank(2)}`])}</div></div>
        ${qs([`A map has a scale of 1 cm : 2 km. On the map, the school is 3·5 cm from the park. How far is that really? ${blank(3)} &nbsp; Two towns are 6 cm apart on the map: ${blank(3)} &nbsp; A real 15 km walk is how long on the map? ${blank(3)}`], 4)}
        <div class="pp-side"><div>${grid}</div><div>${qs([`Write the coordinates of P ${blank(3)} Q ${blank(3)} R ${blank(3)}`,
          `Plot A(1, 1), B(5, 1) and C(5, 4). Where must D go to make a rectangle ABCD? Plot it and write its coordinates. ${blank(3)}`,
          `Explain why (2, 5) and (5, 2) are not the same point.${lines(2)}`], 5)}</div></div>`,
      answers: answersPage(h, "Maps and coordinates", ["Clockwise from N: NE, E, SE, S, SW, W, NW", "90°; 225°", "NE", "7 km; 12 km; 7·5 cm", "P(3, 6), Q(7, 2), R(0, 5)", "D(1, 4)",
        "The first number is how far across, the second how far up: (2, 5) is 2 across and 5 up, (5, 2) is 5 across and 2 up."],
      "\"Along the corridor, then up the stairs\" helps pupils remember the order.")
    };
  });

  add("paper-data-charts", S2("graphs-pie-charts-and-reliable-data"), "Charts and data you can trust", "Make a frequency table, draw a bar chart, read a pie chart and a line graph, and judge whether a claim is reliable.", (who, h) => {
    const fruit = "A B G A O B A G G A B A O A G B A G A B".split(" ");
    const pie = svg(130, 130, `<circle cx="65" cy="65" r="55" class="pp-shape"/><line x1="65" y1="10" x2="65" y2="120" class="pp-shape"/><line x1="65" y1="65" x2="120" y2="65" class="pp-shape"/><line x1="65" y1="65" x2="${65 + 55 * Math.cos(Math.PI / 4)}" y2="${65 + 55 * Math.sin(Math.PI / 4)}" class="pp-shape"/>
      <text x="22" y="70" class="pp-small">Walk</text><text x="80" y="45" class="pp-small">Bus</text><text x="94" y="80" class="pp-small">Car</text><text x="70" y="108" class="pp-small">Bike</text>`);
    const temps = [[6, 4], [9, 7], [12, 11], [15, 13], [18, 9], [21, 6]], gx = t => 40 + (t - 6) * 18, gy = v => 130 - v * 8;
    const line = svg(340, 150, `${[0, 5, 10, 15].map(v => `<line x1="40" y1="${gy(v)}" x2="320" y2="${gy(v)}" class="pp-grid"/><text x="18" y="${gy(v) + 4}" class="pp-small">${v}°</text>`).join("")}
      <line x1="40" y1="130" x2="320" y2="130" class="pp-axis"/><line x1="40" y1="${gy(15)}" x2="40" y2="130" class="pp-axis"/>
      ${temps.map(([t]) => `<text x="${gx(t) - 12}" y="146" class="pp-small">${t > 12 ? t - 12 : t}${t >= 12 ? "pm" : "am"}</text>`).join("")}
      <polyline points="${temps.map(([t, v]) => `${gx(t)},${gy(v)}`).join(" ")}" class="pp-frame"/>${temps.map(([t, v]) => `<circle cx="${gx(t)}" cy="${gy(v)}" r="3" class="pp-dot"/>`).join("")}`);
    return {
      pupil: `${h.sheetHead("Charts and data you can trust", who)}
        <p><b>1.</b> 20 pupils chose their favourite fruit (A apple, B banana, G grapes, O orange): &nbsp; <b>${fruit.join(" ")}</b></p>
        <div class="pp-cols"><table class="pp-table"><tr><th>Fruit</th><th>Tally</th><th>Frequency</th></tr>${["Apple", "Banana", "Grapes", "Orange"].map(f => `<tr><td>${f}</td><td></td><td></td></tr>`).join("")}</table>
          ${box("2. Draw a bar chart of your table, with a title and labels.", '<div class="pp-draw pp-short"></div>')}</div>
        <div class="pp-side"><div>${pie}</div><div>${qs([`The pie chart shows how 24 pupils travel to school. How many walk? ${blank(2)} Take the bus? ${blank(2)} Come by car? ${blank(2)}`], 3)}</div></div>
        <div class="pp-side"><div>${line}</div><div>${qs([`What was the highest temperature, and when? ${blank(4)}`, `How much did it rise between 9 am and 12 noon? ${blank(2)}`], 4)}</div></div>
        ${qs([`5 pupils in one class were asked, and all 5 said they love maths. A poster says "Everyone in the school loves maths!" Is that a fair claim? Explain.${lines(2)}`], 6)}`,
      answers: answersPage(h, "Charts and data you can trust", ["Apple 8, banana 5, grapes 5, orange 2 (total 20)", "Bars of 8, 5, 5 and 2, with a title, labelled axes and a sensible scale",
        "Walk 12 (half), bus 6 (a quarter), car 3 (an eighth), and bike 3", "13°C at 3 pm", "4 degrees (7°C to 11°C)",
        "No: 5 pupils from one class is a tiny sample and may not be like the rest of the school. Ask more pupils from every class."],
      "In question 6, look for sample size and who was asked.")
    };
  });

  add("paper-chance", S2("probability-and-chance-experiments"), "Chance experiments", "Describe chance in words, fractions and percentages, place events on a scale, run an experiment and judge whether a game is fair.", (who, h) => {
    const cols = ["#ef4444", "#ef4444", "#ef4444", "#ef4444", "#3b82f6", "#3b82f6", "#22c55e", "#facc15"], names = ["R", "R", "R", "R", "B", "B", "G", "Y"];
    const spin = svg(130, 130, names.map((n, i) => { const a0 = (i * Math.PI) / 4 - Math.PI / 2, a1 = a0 + Math.PI / 4, m = a0 + Math.PI / 8;
      return `<path d="M65 65 L${65 + 55 * Math.cos(a0)} ${65 + 55 * Math.sin(a0)} A55 55 0 0 1 ${65 + 55 * Math.cos(a1)} ${65 + 55 * Math.sin(a1)} Z" fill="${cols[i]}" fill-opacity=".35" class="pp-shape"/><text x="${60 + 36 * Math.cos(m)}" y="${70 + 36 * Math.sin(m)}" class="pp-lab">${n}</text>`; }).join(""));
    return {
      pupil: `${h.sheetHead("Chance experiments", who)}
        <p><b>1.</b> Describe each chance as a word (impossible, unlikely, even chance, likely, certain), a fraction and a percentage where you can.</p>
        <table class="pp-table"><tr><th>Event</th><th>Word</th><th>Fraction</th><th>Percentage</th></tr>${["Rolling a 6 on a dice", "A coin landing heads", "Picking red from 3 red and 1 blue counter", "Rolling a number less than 7 on a dice"].map(e => `<tr><td>${e}</td><td></td><td></td><td></td></tr>`).join("")}</table>
        <div class="pp-q"><p><b>2.</b> Write the letter of each event above the scale. &nbsp; <b>A</b> It snows in Scotland in July &nbsp; <b>B</b> A baby born today is a girl &nbsp; <b>C</b> You pick a vowel from the letters of BANANA &nbsp; <b>D</b> The sun rises tomorrow</p>${s2Line(0, 1, 0.125, 2)}</div>
        <div class="pp-side"><div>${spin}</div><div>${qs([`What is the chance of landing on red? ${blank(2)} On blue? ${blank(2)} On green? ${blank(2)}`,
          `If you spin it 80 times, about how many times would you expect red? ${blank(2)}`], 3)}</div></div>
        ${qs([`Flip a coin 20 times and tally heads and tails. Heads ${blank(4)} Tails ${blank(4)} How close is it to what you expected? Why might it not be exactly 10?${lines(1)}`,
          `A game with a dice: you win on an even number; your friend wins on a 1 or a 2. Is it fair? Explain.${lines(2)}`], 5)}`,
      answers: answersPage(h, "Chance experiments", ["Unlikely, 1/6, about 17%; even chance (fifty-fifty), 1/2, 50%; likely, 3/4, 75%; certain, 1 (6/6), 100%",
        "A near 0 (very unlikely), B at ½, C at ½ (3 of the 6 letters are A), D at 1", "4/8 = 1/2; 2/8 = 1/4; 1/8", "About 40",
        "Results vary. Each flip is random, so a small number of flips rarely gives exactly 10; more flips get closer to half.", "Not fair: you win with 3 of 6 numbers (2, 4, 6), your friend with only 2 of 6 (and nobody wins on 3 or 5)."],
      "Look for the difference between what we expect and what happens in a small experiment.")
    };
  });
