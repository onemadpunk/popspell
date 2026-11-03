/* Pop Spell original print practice. Each word list is given a lesson-specific task
 * sequence, not a page of identical boxes. Pure functions keep preview and print identical. */
window.PopWorksheets = (() => {
  "use strict";
  const e = value => String(value == null ? "" : value).replace(/[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const line = (n = 1) => '<div class="ws-wb-lines">' + '<span></span>'.repeat(n) + '</div>';
  const bank = entries => '<div class="ws-wb-bank"><b>Word bank:</b> ' + entries.map(e).join("  ·  ") + '</div>';
  const task = (number, label, instructions, body) =>
    '<section class="ws-wb-task"><h2><span>' + number + '</span> ' + e(label) +
    '</h2><p>' + e(instructions) + '</p>' + body + '</section>';
  const wordText = item => typeof item === "string" ? item : item.spelling;
  const sentence = word => {
    const found = (window.SENTENCES || {})[String(word).toLowerCase()];
    return typeof found === "string" ? found : "";
  };
  const gapSentence = (full, word) => {
    const at = full.toLowerCase().indexOf(word.toLowerCase());
    if (at < 0) return "";
    const left = at === 0 || !/[a-z]/i.test(full[at - 1]);
    const right = at + word.length >= full.length || !/[a-z]/i.test(full[at + word.length]);
    if (!left || !right) return "";
    return e(full.slice(0, at)) + '<span class="ws-wb-gap">____________</span>' + e(full.slice(at + word.length));
  };
  const complete = items => items
    .map(item => ({word:wordText(item), text:sentence(wordText(item))}))
    .filter(x => x.text && x.text.toLowerCase().includes(x.word.toLowerCase()))
    .filter(x => gapSentence(x.text, x.word)).slice(0, 3);
  const patternFor = id => {
    const map = { "ow-long":["ow"], "ow-cow":["ow"], "oo-long":["oo"], "oo-short":["oo"],
      "oi-oy":["oi","oy"], "aw-au":["aw","au"], "ew-ue":["ew","ue"],
      "er-ir-ur":["er","ir","ur"], "air-are":["air","are"], "ear-eer":["ear","eer"],
      "ng-nk":["ng","nk"], "floss":["ff","ll","ss","zz"], "soft-c-g":["c","g"],
      "kn-wr":["kn","wr"], "l-blends":["bl","cl","fl","gl","pl","sl"],
      "r-s-blends":["cr","dr","fr","gr","pr","br","sn","sp","st","sw","sk","sm"],
      "end-blends":["st","nd","mp","lk","nt","lt","sk","ft","lp"],
      "s-es":["es","s"], "y-ee":["y"], "initial-y":["y"] };
    if (map[id]) return map[id];
    if (/^[aeiou]-e$/.test(id)) return [id[0] + "_e"];
    return [id];
  };
  const target = (word, patterns) => patterns.find(p =>
    p.includes("_") ? new RegExp(p[0] + "[a-z]" + p[p.length - 1] + "$", "i").test(word)
      : word.toLowerCase().includes(p.toLowerCase()));
  const hide = (word, patterns) => {
    const found = target(word, patterns);
    if (!found) return "";
    if (found.includes("_")) {
      return e(word.replace(new RegExp(found[0] + "([a-z])" + found[found.length - 1] + "$", "i"),
        "□$1□"));
    }
    return e(word.replace(new RegExp(found, "i"), "□".repeat(found.length)));
  };
  const sectionAnswers = (label, body) => '<li><b>' + e(label) + ':</b> ' + body + '</li>';
  const familyOf = list => {
    const id = list.id || "";
    if (/^(wl-y34|wl-y56)/.test(id)) return "word-study";
    if (id === "initial-y") return "teams";
    if (/^(cew-|y1-days)/.test(id) || id === "tricky") return "exception";
    if (/^[aeiou]-e$/.test(id)) return "split-e";
    if (["ing","s-es","y-ee","le","soft-c-g","kn-wr","ph"].includes(id)) return "endings";
    if ((list.stage || "").includes("Stage 1")) return "short";
    if ((list.stage || "").includes("Stage 2")) return "teams";
    if ((list.stage || "").includes("Stage 5")) return "r-vowels";
    return "vowels";
  };
  const pairs = items => {
    const out = [];
    for (const a of items) for (const b of items) {
      if (a === b || a.length !== b.length || a.length < 3) continue;
      const diff = [...a].filter((ch,i) => ch !== b[i]).length;
      if (diff === 1 && !out.some(pair => pair.includes(a) && pair.includes(b)))
        out.push([a,b]);
    }
    return out.slice(0,2);
  };
  const table = rows => '<div class="ws-wb-table">' + rows.map(r =>
    '<div class="ws-wb-row">' + r.map(cell => '<div>' + cell + '</div>').join("") + '</div>').join("") + '</div>';
  const blank = '<span class="ws-wb-answer">__________________</span>';
  const check = (items, support, answer) => {
    const selected = items.slice(0,2).map(wordText);
    if (!selected.length) return task(5,"Show what you know",
      "Choose one of today's words. Say it, cover it, write it and check.", line(2));
    answer.push(sectionAnswers("Independent check", selected.map(e).join(", ") +
      ". Look for the taught pattern rather than just a memorised letter sequence."));
    return task(5, "Try an unfamiliar word",
      "Ask your adult to say these new words. Spell each one, then mark the spelling pattern you used.",
      table(selected.map((_,i) => ['<b>' + (i+1) + '.</b> Adult says the word', blank])));
  };
  function cloze(items, support, answer, label = "Use it in a sentence", listId = "") {
    const known = new Set(items.map(x => wordText(x).toLowerCase()));
    const originalContexts = ((window.PopWorksheetContexts || {})[listId] || [])
      .map(([word, text]) => ({ word, text }))
      .filter(x => known.has(x.word.toLowerCase()) && gapSentence(x.text, x.word));
    const samples = (originalContexts.length >= 2 ? originalContexts : complete(items)).slice(0,3);
    if (samples.length < 2) {
      const ws = items.slice(0,2).map(wordText);
      answer.push(sectionAnswers(label,"Open responses. Check that " + ws.map(e).join(" and ") +
        " are spelt correctly and used in a meaningful sentence."));
      return task(4,label,"Choose two words. Write a sentence for each, showing what the words mean.",
        bank(ws) + line(2));
    }
    const words = samples.map(x=>x.word);
    answer.push(sectionAnswers(label,samples.map((x,i)=> (i+1) + ". " + e(x.text)).join("<br>")));
    return task(4,label,"Choose the word that makes sense in each sentence. Read your completed sentences.",
      (support ? bank(words) : "") + samples.map((x,i)=>
        '<p class="ws-wb-cloze"><b>' + (i+1) + '.</b> ' + gapSentence(x.text,x.word) + '</p>').join(""));
  }
  function build(list, options = {}) {
    if (!list || !Array.isArray(list.items) || !list.items.length) return null;
    const items = list.items.map(it => ({spelling:wordText(it),tokens:it.tokens || []}));
    const words = items.map(it=>it.spelling), checks = list.checks || [];
    const support = options.level === "support", stretch = options.level === "stretch";
    const level = support ? "Supported" : stretch ? "Extend" : "Independent";
    const fam = familyOf(list), patterns = patternFor(list.id), title = list.title || "Spelling";
    const head = typeof options.brandHead === "function" ? options.brandHead
      : (heading,meta) => '<header><h1>' + e(heading) + '</h1><p>' + meta + '</p></header>';
    const meta = "<b>Name:</b> " + e(options.who || "________________") +
      ' &nbsp; <b>Date:</b> ' + e(options.date || "__________");
    const goal = list.tip || "Notice the spelling choices, practise them, and use them independently.";
    const pupil = [];
    const answers = [];
    const first = words.slice(0,5);
    const tokens = items.slice(0,4);
    const renderWords = (a, focus = true) => a.map(w => '<span class="ws-wb-word">' + e(w) + '</span>').join("");
    let purpose = "Investigate spelling and apply it in writing";
    if (fam === "short") {
      purpose = "Hear the sounds, build words and change a sound";
      pupil.push(task(1,"Listen and notice",
        "Say each word slowly. Underline the vowel sound in each word and tell your partner what you hear.",
        '<div class="ws-wb-words">' + renderWords(first) + '</div>'));
      answers.push(sectionAnswers("Notice","Pupils should identify the short vowel in " + first.map(e).join(", ") + "."));
      pupil.push(task(2,"Build it from sounds",
        "Your adult says each word. Tap the sounds, then write one grapheme in each box.",
        table(tokens.slice(0,3).map((it,i) => [
          '<b>' + (i+1) + '.</b>',
          '<div class="ws-wb-sounds">' + '<span></span>'.repeat(Math.max(1,it.tokens.length)) + '</div>']))));
      answers.push(sectionAnswers("Build from sounds",tokens.slice(0,3).map(it=> e(it.spelling) +
        " = " + e(it.tokens.join(" · "))).join("<br>")));
      const contrast = pairs(words);
      pupil.push(task(3,"Change one sound",
        "Use the first word to make the second. What sound and letters changed?",
        contrast.length ? contrast.map(([a,b])=>'<p class="ws-wb-pair"><b>'+e(a)+'</b> → '+blank+
          ' <span class="ws-wb-hint">Replace letter '+e(String([...a].findIndex((ch,i) => ch !== b[i])+1))+
          ' with '+e(b[[...a].findIndex((ch,i) => ch !== b[i])])+'.</span></p>').join("")
          : '<p>Choose two words above. Say which sound is different.</p>'+line()));
      answers.push(sectionAnswers("Change one sound",contrast.length ?
        contrast.map(([a,b])=>e(a)+" → "+e(b)).join("; ") : "Accept a correctly identified change in one sound."));
    } else if (fam === "split-e") {
      purpose = "Investigate how two vowels work with a final e";
      const examples = { "a-e":["cap","cape"],"i-e":["kit","kite"],"o-e":["hop","hope"],
        "u-e":["cub","cube"] };
      const pair = examples[list.id];
      if (pair) {
        pupil.push(task(1,"The silent-e experiment",
          "Read the pair aloud. Add the final e. What changes in how the vowel sounds?",
          '<div class="ws-wb-compare"><b>'+e(pair[0])+'</b> <span>+ e →</span> <b>'+e(pair[1])+'</b></div>' +
          '<p>Explain the change to your partner, then write another example from the word bank.</p>' + line()));
        answers.push(sectionAnswers("Silent-e experiment",e(pair[0])+" → "+e(pair[1])+
          ". The final e changes the pronunciation of the preceding vowel."));
      } else {
        pupil.push(task(1,"Two e's working together",
          "Read these words. Underline the vowel e and circle the final silent e. What do you notice?",
          '<div class="ws-wb-words">' + renderWords(["these","theme","complete"]) + '</div>' + line()));
        answers.push(sectionAnswers("Two e's","Look for the long e sound in these, theme and complete. Discuss how the two e letters are separated."));
      }
      pupil.push(task(2,"Find the spelling pattern",
        "Look closely at each word. Mark the two vowel letters that work together.",
        '<div class="ws-wb-words">' + renderWords(first) + '</div>'));
      answers.push(sectionAnswers("Find the pattern",first.map(e).join(", ") + ". Check both vowel letters, not just the final e."));
      const masked = words.map(w=>({w,masked:hide(w,patterns)})).filter(x=>x.masked && x.masked !== e(x.w)).slice(0,4);
      pupil.push(task(3,"Complete the spelling",
        "Use the words above to help you. Fill the gaps and read each completed word.",
        '<div class="ws-wb-grid">' + masked.map(x=>'<p>'+x.masked+'</p>').join("")+'</div>'));
      answers.push(sectionAnswers("Complete the spelling",masked.map(x=>e(x.w)).join(", ")));
    } else if (fam === "teams" || fam === "vowels" || fam === "r-vowels") {
      purpose = fam === "r-vowels" ? "Investigate the vowel and r spelling choices"
        : "Compare spelling patterns and use them in context";
      const compare = fam === "r-vowels"
        ? "Notice the vowel letters and r. In Scottish speech, listen carefully for the r sound."
        : "Read each word. Circle the grapheme you are investigating.";
      pupil.push(task(1,"Pattern detective",compare,
        '<div class="ws-wb-words">' + renderWords(first) + '</div>'));
      answers.push(sectionAnswers("Pattern detective",first.map(e).join(", ")+
        ". Check what the pupil actually notices rather than assuming one pronunciation for every word."));
      const variants = patterns.filter(p=>!p.includes("_"));
      const split = variants.map(pt=>({pt,arr:words.filter(w=>w.toLowerCase().includes(pt.toLowerCase()))}));
      const usable = split.filter(v=>v.arr.length>=2);
      if (usable.length>=2 && usable[0].pt!==usable[1].pt) {
        const [a,b] = usable.slice(0,2);
        const samples = [...a.arr.slice(0,2),...b.arr.slice(0,2)];
        pupil.push(task(2,"Sort by spelling",
          "Sort the words by the letters they use. Read each group aloud.",
          bank(samples) + table([['<b>'+e(a.pt)+'</b>','<b>'+e(b.pt)+'</b>'],[line(2),line(2)]])));
        answers.push(sectionAnswers("Sort",e(a.pt)+": "+a.arr.slice(0,2).map(e).join(", ") +
          "; "+e(b.pt)+": "+b.arr.slice(0,2).map(e).join(", ")));
      } else {
        pupil.push(task(2,"Compare two words",
          "Say each pair. Underline the repeated spelling pattern. What is similar, and what changes?",
          table([[e(words[0]),e(words[1])],[e(words[2]),e(words[3])]])+line()));
        answers.push(sectionAnswers("Compare",words.slice(0,4).map(e).join(", ")+
          ". Discuss the shared spelling and the different surrounding letters."));
      }
      const masked = words.map(w=>({w,masked:hide(w,patterns)}))
        .filter(x=>x.masked && x.masked !== e(x.w)).slice(0,4);
      pupil.push(task(3,"Fill the spelling gap",
        "Choose the missing letters. Say the whole word and check it makes sense.",
        '<div class="ws-wb-grid">' + masked.map(x=>'<p>'+x.masked+'</p>').join("")+'</div>' +
        (support ? bank([...new Set(masked.map(x=>target(x.w,patterns)))]) : "")));
      answers.push(sectionAnswers("Spelling gaps",masked.map(x=>e(x.w)).join(", ")));
    } else if (fam === "endings") {
      purpose = "Investigate word structure and spelling decisions";
      const prompt = { "ing":"Look at the ending -ing. Which letters belong to the base word?",
        "s-es":"Compare the plural endings -s and -es. Where do you see each?",
        "y-ee":"Which words end in y? What sound does the final y make?",
        "le":"Spot the -le ending. Say the final syllable.",
        "soft-c-g":"Find c and g. Does each one sound like /s/, /j/ or something else?",
        "kn-wr":"Find kn and wr. Which letter is not pronounced at the beginning?",
        "ph":"Find ph. What sound do the two letters represent?" }[list.id] ||
        "Which letters help you recognise this pattern?";
      pupil.push(task(1,"Word structure detective",prompt,
        '<div class="ws-wb-words">'+renderWords(first)+'</div>'+line()));
      answers.push(sectionAnswers("Word structure","Discuss the rule using "+first.map(e).join(", ")+
        ". Do not expect a single rule to explain every word."));
      const matched = words.map(w=>({w,masked:hide(w,patterns)}))
        .filter(x=>x.masked && x.masked!==e(x.w)).slice(0,4);
      pupil.push(task(2,"Repair the missing letters",
        "Fill the gaps, read the whole word and check its meaning.",
        '<div class="ws-wb-grid">'+matched.map(x=>'<p>'+x.masked+'</p>').join("")+'</div>'));
      answers.push(sectionAnswers("Repair the letters",matched.map(x=>e(x.w)).join(", ")));
      pupil.push(task(3,"Explain your choice",
        "Choose two words from the list. Describe how their spelling is alike and how it is different.",
        table([[e(words[1]),e(words[5]||words[0])]])+line()));
      answers.push(sectionAnswers("Explain","Listen for an accurate observation about the target pattern; accept different valid comparisons."));
    } else {
      purpose = "Study tricky spellings, meaning and accurate use";
      const older = fam === "word-study";
      pupil.push(task(1,older ? "Look closely: where is the tricky bit?" : "Look, say, cover, write, check",
        older ? "Read each word. Mark the part you need to remember. Can you explain why it might be difficult?"
          : "Read each word aloud, look at its unusual letters, cover it and write it from memory.",
        '<div class="ws-wb-words">'+renderWords(first)+'</div>'+line()));
      answers.push(sectionAnswers("Notice",first.map(e).join(", ") +
        ". Accept accurate observations about letters or sound-to-spelling choices."));
      const removeLetter = word => {
        if (word.length<3) return word;
        let index = word.length > 5 ? Math.floor(word.length/2) : 1;
        if (word[index] === "'") index++;
        return e(word.slice(0,index) + "□" + word.slice(index+1));
      };
      const selected = words.slice(5,9);
      pupil.push(task(2,older ? "Proofreading clinic" : "Spot the missing letter",
        "Each word has lost one letter. Write the complete word and check every letter.",
        '<div class="ws-wb-grid">'+selected.map(w=>'<p>'+removeLetter(w)+'</p>').join("")+'</div>'));
      answers.push(sectionAnswers("Missing letters",selected.map(e).join(", ")));
      const investigation = older && (window.PopWorksheetInvestigations || {})[list.id];
      if (investigation) {
        pupil.push(task(3, "Word investigation", investigation.prompt,
          bank(investigation.words) + line(2)));
        answers.push(sectionAnswers("Word investigation", e(investigation.expect)));
      } else {
        pupil.push(task(3,older ? "Word investigation" : "Use your word bank",
          older ? "Choose two words. Look for their smaller meaningful parts, syllables or spelling patterns. Explain what you discover."
            : "Choose two words from the bank and say a sentence about something real.",
          bank(words.slice(0,8)) + line(2)));
        answers.push(sectionAnswers("Investigation","Open responses. Look for a sensible explanation, or a sentence using the word with the intended meaning."));
      }
    }
    const context = cloze(fam === "word-study" || fam === "exception" ? items : items.slice(3),
      support, answers, fam === "word-study" ? "Words in context" : "Use it in a sentence", list.id);
    pupil.push(context);
    pupil.push(check(checks,support,answers));
    if (stretch) pupil.push(task(6,"Explain and transfer",
      "Explain one spelling decision you made. Write a new sentence using a word from this lesson.",
      line(3)));
    if (stretch) answers.push(sectionAnswers("Explain and transfer",
      "Look for a reason linked to the spelling pattern and a meaningful, correctly written sentence."));
    const focus = '<div class="ws-wb-focus"><b>Learning intention</b><p>'+e(goal)+'</p></div>';
    const instructions = support ?
      "Supported practice · A word bank and oral discussion are encouraged." :
      stretch ? "Extension · Justify spelling choices and apply them independently." :
        "Independent practice · Notice, explain and apply the target spelling.";
    const main = head(title + " · " + level, meta) +
      '<div class="ws-workbook"><p class="ws-wb-lead">'+e(purpose)+
      '</p>'+focus+'<p class="ws-wb-instructions">'+e(instructions)+'</p>'+
      pupil.join("")+
      '<div class="ws-wb-self"><b>Before you finish</b> &nbsp; □ I read my words aloud &nbsp; □ I checked the target pattern &nbsp; □ I corrected a mistake</div></div>';
    const extra = checks.length ? checks.slice(0,2).map(wordText) : words.slice(-3);
    const teacher = head("Teacher notes: " + title,
      "For the adult · "+e(level)+" · "+e(options.date||"")) +
      '<div class="ws-workbook ws-wb-teacher"><h2>Purpose and use</h2>'+
      '<p>'+e(goal)+'</p>'+
      '<p><b>Teacher-led check:</b> '+extra.map(e).join(", ")+'</p>'+
      '<ol>'+answers.join("")+'</ol>'+
      '<h2>Assessment and next steps</h2>'+
      '<p><b>Listen for:</b> the child identifying the taught spelling and explaining a choice. '+
      'Correct letters alone do not prove understanding.</p>'+
      '<p><b>If insecure:</b> return to two modelled examples, practise orally and try a fresh word. '+
      '<b>If secure:</b> use the pattern in independent writing and check after a delay.</p>'+
      '<p><b>Evidence:</b> □ Knows the pattern &nbsp; □ Can choose it &nbsp; □ Uses it independently</p></div>';
    return {className:"ws-workbook-sheet ws-literacy", html:main, answers:teacher,
      family:fam, variant:level, id:list.id, taskCount:pupil.length};
  }
  return { build, familyOf, patternFor };
})();