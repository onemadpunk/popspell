  /* ===================== Writing frames with success criteria, by text type =====================
     In the way tutoring frames work: one page per text type, with the parts of the text in order, sentence
     starters in each part, a word bank, and the success criteria as a tick list the writer checks before
     handing in (a "me" column and an "adult" column). Two versions of each: First level (P2 to P4, short
     starters, draw or write) and Second and Third level (P5 to S2, paragraphs and more formal features).
     The writing itself goes on lined paper or in a jotter: the frame is the plan and the checklist. */

  const WF = [
    { id: "recount", name: "Recount", purpose: "to tell what happened, in order",
      first: { parts: [["Who, where and when?", "On Saturday, I went to… with…"], ["First", "First, we…"], ["Next", "Next, …"], ["Then", "After that, …"], ["At the end", "Finally, … I felt… because…"]],
        words: "first, next, then, after that, later, finally, because, so",
        criteria: ["I said who, where and when.", "I told the events in order.", "I used time words (first, next, then).", "I said how I felt.", "I used capital letters and full stops."] },
      second: { parts: [["Opening: set the scene", "Last weekend, my family and I travelled to… where…"], ["Event 1", "Our day began when…"], ["Event 2", "Later that morning, …"], ["Event 3", "By the afternoon, …"], ["Closing: looking back", "Looking back, the best part was… because…"]],
        words: "meanwhile, shortly afterwards, by the time, eventually, as soon as, although, which meant that",
        criteria: ["My opening answers who, what, where and when.", "Events are in time order, one paragraph each.", "I varied my time connectives.", "I added detail: what I saw, heard and felt.", "I wrote in the past tense throughout.", "My ending reflects on the experience."] } },
    { id: "instructions", name: "Instructions", purpose: "to tell someone how to do or make something",
      first: { parts: [["What you will make or do", "How to…"], ["You will need", "• \n• \n• "], ["Step 1", "First, …"], ["Step 2", "Next, …"], ["Step 3", "Then, …"], ["Step 4", "Last, …"]],
        words: "first, next, then, after that, last, cut, fold, mix, put, stir",
        criteria: ["I wrote a 'How to' title.", "I listed what you need.", "My steps are numbered and in order.", "Each step starts with a bossy verb.", "Someone could follow my steps."] },
      second: { parts: [["Title and goal", "How to… (in about … minutes)"], ["Equipment", "You will need: …"], ["Method", "1. Begin by… \n2. Carefully… \n3. Once…, … \n4. …"], ["Tips and warnings", "Make sure that… / Be careful not to…"], ["Finish", "Your … is now ready to…"]],
        words: "carefully, gently, once, until, while, make sure, be careful, approximately",
        criteria: ["The title says exactly what will be made or done.", "The equipment list is complete.", "Steps are numbered, in order and start with imperative verbs.", "I used adverbs to say how (carefully, gently).", "I included a tip or a warning.", "A reader could follow it without asking me anything."] } },
    { id: "report", name: "Information report", purpose: "to give facts about a topic",
      first: { parts: [["Title", "All about…"], ["What is it?", "A … is a…"], ["What does it look like?", "It has…"], ["Where is it found?", "It lives / is found…"], ["An amazing fact", "Did you know that…?"]],
        words: "has, have, is, are, can, lives, eats, most, some, many",
        criteria: ["My title tells the topic.", "I wrote facts, not a story.", "Each part has a heading.", "I wrote in the present tense.", "I added an amazing fact."] },
      second: { parts: [["Introduction", "… are… They are found…"], ["Sub-heading 1: appearance", "Most … have… which helps them…"], ["Sub-heading 2: habitat or uses", "… can be found in… because…"], ["Sub-heading 3: behaviour or facts", "Interestingly, … In addition, …"], ["Conclusion", "Overall, … are important because…"]],
        words: "furthermore, in addition, for example, such as, however, most, some, unlike, similarly",
        criteria: ["My introduction says what the report is about.", "I organised facts under sub-headings.", "I used technical vocabulary and explained it.", "I wrote in the third person and present tense.", "I added a diagram, caption or fact box.", "My conclusion sums up."] } },
    { id: "persuasive", name: "Persuasive writing", purpose: "to make the reader agree or do something",
      first: { parts: [["What I think", "I think that… should…"], ["Reason 1", "One reason is…"], ["Reason 2", "Also, …"], ["Reason 3", "Best of all, …"], ["Ending", "So you can see that…"]],
        words: "I think, because, also, best of all, everyone, should, must, so",
        criteria: ["I said what I think.", "I gave three reasons.", "I used 'because' to explain.", "I used a strong ending.", "I used capital letters and full stops."] },
      second: { parts: [["Opening: state your view", "Have you ever wondered…? I strongly believe that…"], ["Point 1 with evidence", "Firstly, … For example, …"], ["Point 2 with evidence", "Furthermore, … This shows that…"], ["Counter-argument", "Some people say… However, …"], ["Conclusion: call to action", "In conclusion, … so we must…"]],
        words: "firstly, furthermore, moreover, clearly, surely, however, therefore, in conclusion, imagine",
        criteria: ["My opening grabs the reader and states my view.", "Each point is backed with evidence or an example.", "I answered a counter-argument.", "I used persuasive techniques (rhetorical question, rule of three, emotive words).", "I used formal connectives.", "My conclusion tells the reader what to do."] } },
    { id: "narrative", name: "Story", purpose: "to entertain",
      first: { parts: [["Opening: who and where?", "One day, …"], ["Something happens", "Suddenly, …"], ["The problem", "Oh no! …"], ["Sorting it out", "So, …"], ["Ending", "In the end, …"]],
        words: "one day, suddenly, then, so, in the end, happy, scared, dark, huge, tiny",
        criteria: ["My story has a character and a setting.", "Something goes wrong (a problem).", "The problem is sorted out.", "I used describing words.", "My story has an ending."] },
      second: { parts: [["Opening: hook and setting", "Start with action, speech or a question: …"], ["Build-up", "Show the character's feelings: …"], ["Problem", "Without warning, …"], ["Resolution", "Just when…, …"], ["Ending", "Show how the character has changed: …"]],
        words: "without warning, moments later, meanwhile, just as, trembling, gloomy, determined, whispered, muttered",
        criteria: ["My opening hooks the reader.", "I showed feelings through actions and speech (show, don't tell).", "I described the setting using the senses.", "I punctuated speech correctly.", "I varied sentence openers and lengths.", "My ending links back to the opening or shows a change."] } },
    { id: "letter", name: "Letter", purpose: "to write to someone for a reason",
      first: { parts: [["My address and the date", "(top right)"], ["Greeting", "Dear …,"], ["Why I am writing", "I am writing to…"], ["More to say", "I would like to… / Did you know…"], ["Sign off", "From, / Love from, …"]],
        words: "Dear, thank you, I hope, please, because, love from, from",
        criteria: ["I wrote the address and date.", "I started with 'Dear'.", "I said why I am writing.", "I signed off with my name.", "I used capital letters for names."] },
      second: { parts: [["Layout", "Your address (top right), the date, their address (left) if formal"], ["Greeting", "Dear Mr / Mrs / Ms … , or Dear Sir or Madam,"], ["Paragraph 1: purpose", "I am writing to… regarding…"], ["Paragraph 2: detail", "I would like to point out that… / I was disappointed to find…"], ["Paragraph 3: what you want", "I would be grateful if you could…"], ["Sign-off", "Yours sincerely (name known) / Yours faithfully (Dear Sir or Madam)"]],
        words: "regarding, I would be grateful, furthermore, unfortunately, I look forward to hearing from you, yours sincerely, yours faithfully",
        criteria: ["Layout: addresses and date in the right places.", "The greeting and sign-off match (sincerely or faithfully).", "Paragraph 1 states the purpose.", "Tone suits the reader (formal or friendly).", "Each paragraph has one main point.", "I said clearly what I want to happen next."] } },
    { id: "explanation", name: "Explanation", purpose: "to explain how or why something happens",
      first: { parts: [["Title: how or why?", "How does…? / Why do…?"], ["What it is", "A … is…"], ["First", "First, …"], ["This makes", "This makes… because…"], ["At the end", "So that is how…"]],
        words: "first, then, because, so, this makes, when, after",
        criteria: ["My title is a how or why question.", "I explained in order.", "I used 'because' and 'so'.", "I added a labelled picture.", "My ending sums up."] },
      second: { parts: [["Title and introduction", "How does…? … is a process that…"], ["Stage 1", "To begin with, …"], ["Stage 2: cause and effect", "As a result, … This causes…"], ["Stage 3", "Consequently, …"], ["Diagram", "(a labelled diagram or flow chart)"], ["Conclusion", "This process is important because…"]],
        words: "because, therefore, as a result, consequently, this causes, which leads to, when, if",
        criteria: ["My introduction says what process I'm explaining.", "Stages are in a logical order.", "I used cause-and-effect connectives.", "I used technical words and explained them.", "I wrote in the present tense.", "My diagram matches the writing."] } },
    { id: "discussion", name: "Discussion (balanced argument)", purpose: "to give both sides fairly, then a view",
      first: { parts: [["The question", "Should…?"], ["Some people think yes", "Some people think… because…"], ["Other people think no", "Other people think… because…"], ["What I think", "I think… because…"]],
        words: "some people, other people, but, because, I think, also",
        criteria: ["I wrote the question.", "I gave a reason for yes.", "I gave a reason for no.", "I said what I think and why."] },
      second: { parts: [["Introduction: the issue", "Many people disagree about whether… This piece will look at both sides."], ["Arguments for", "Supporters argue that… For example, …"], ["Arguments against", "On the other hand, … Critics point out that…"], ["Conclusion: weigh up and give your view", "Having considered both sides, I believe… because…"]],
        words: "on the other hand, however, whereas, supporters, critics, it could be argued, having considered, overall",
        criteria: ["My introduction sets out the issue neutrally.", "I gave at least two points for each side.", "Each point is backed with evidence or an example.", "I used contrast connectives (however, whereas).", "I stayed impersonal until the conclusion.", "My conclusion weighs both sides before giving my view."] } }
  ];
  const wfBox = (head, start, n) => box(head, `<p class="hint">${start.replace(/\n/g, "<br>")}</p>${lines(n)}`, "wf-box");
  const wfTicks = c => `<table class="gx-track"><thead><tr><th>Success criteria</th><th>Me</th><th>Adult</th></tr></thead><tbody>${c.map(x => `<tr><td>${x}</td><td class="gx-cell">☐</td><td class="gx-cell">☐</td></tr>`).join("")}</tbody></table>`;
  WF.forEach(t => {
    [["first", "First", "lesson-first-writing-frames", "P2 to P4"], ["second", "Second and Third", "lesson-second-writing-frames", "P5 to S2"]].forEach(([k, lvl, lesson, ages]) => {
      const f = t[k];
      add(`paper-frame-${t.id}-${k}`, lesson, `Writing frame (${lvl} level): ${t.name}`,
        `A one-page frame for ${t.name.toLowerCase()} writing (${t.purpose}), ${ages}: the parts in order with sentence starters, a word bank, and ${f.criteria.length} success criteria to tick before handing in.`, (who, h) => ({
          pupil: `${h.sheetHead(`Writing frame: ${t.name}`, who)}${lqStrip(`${t.name}: ${t.purpose}`, `${lvl} level`)}
            <p class="hint">Plan in the boxes, using the starters if they help. Then write it out in full on lined paper. Tick each success criterion when you've checked your writing.</p>
            ${f.parts.map(([hd, st]) => wfBox(hd, st, f.parts.length > 5 ? 1 : 2)).join("")}
            <p class="pp-bank"><b>Words to help:</b> ${f.words}</p>
            ${wfTicks(f.criteria)}`,
          answers: lookForPage(h, `Writing frame: ${t.name}`, f.criteria.map(c => c.replace(/^I |^My /, m => m === "I " ? "The writer " : "Their ")),
            `Ask the writer to tick the "Me" column first, then check together. Pick one criterion they didn't meet as the next target, rather than correcting everything. Sentence starters are a support: praise a writer who changes them into their own words.`)
        }));
    });
  });
