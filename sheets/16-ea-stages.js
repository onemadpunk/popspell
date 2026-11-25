  /* ===================== EA Literacy Stages 4 to 7 ===================== */

  // Block 35: the ch in loch. There's no online list for it (the voice can't say the sound), so this sheet is the practice.
  add("paper-ea47-scots-ch", "lesson-second-ea-stages-4-7-block-35-scots-ch", "Scots words with ch (as in loch)",
    "Say and spell Scots words where ch is the sound at the back of the throat, match them to English words, and spot the pattern.", (who, h) => {
    const pairs = shuffle([["nicht", "night"], ["licht", "light"], ["bricht", "bright"], ["richt", "right"], ["micht", "might"],
      ["fecht", "fight"], ["dochter", "daughter"], ["eneuch", "enough"]]).slice(0, 6);
    return {
      pupil: `${h.sheetHead("Scots words with ch (as in loch)", who)}
        <p>In Scots, and in Scottish English, <b>ch</b> can be a sound made at the back of the throat, as in <b>loch</b> and <b>och</b>. Your teacher will say these words with you.</p>
        <p class="pp-bank"><b>Say them:</b> loch, och, dreich, bricht, nicht, licht, clachan, pibroch</p>
        ${box("1. Write the English word for each Scots word", `<table class="pp-table"><tr><th>Scots</th><th>English</th></tr>${pairs.map(([s]) => `<tr><td>${s}</td><td>${blank(8)}</td></tr>`).join("")}</table>`)}
        ${box("2. What do you notice?", `<p>Look at the Scots and English words. Which letters does English write where Scots writes <b>ch</b>?</p>${lines(2)}`)}
        ${box("3. Places with ch", `<p>Lochgelly, Auchtermuchty and Ecclefechan all have the sound. Find three more Scottish places or names with it.</p>${lines(2)}`)}
        ${box("4. Use a Scots word", `<p>Write a sentence about the weather using <b>dreich</b> (dull, grey and wet).</p>${lines(2)}`)}`,
      answers: answersPage(h, "Scots words with ch (as in loch)", pairs.map(([s, e]) => `${s}: <b>${e}</b>`).concat([
        "2. English writes <b>gh</b> (night, light, bright). Long ago English said that sound too, and the spelling kept it after the sound stopped.",
        "3. Any names with the sound: for example Loch Lomond, Lochaber, Auchinleck, Mauchline, Buchan, Strachan, Murdoch.",
        "4. Any sentence that uses dreich to describe dull, wet weather."]),
        "Say the words to the pupil: the online voice can't make this sound.")
    };
  });
