  /* ===================== Literacy: choice, listening and talking, finding information ===================== */

  const faces = `<span class="pp-tick">☐ 😀 I liked it</span> <span class="pp-tick">☐ 😐 It was OK</span> <span class="pp-tick">☐ 🙁 I didn't like it</span>`;

  add("paper-favourite-story", "lesson-early-choosing-and-sharing-stories-i-like", "My favourite story", "Draw a favourite part of a story, say how it felt and why the book was chosen.", (who, h) => ({
    pupil: `${h.sheetHead("My favourite story", who)}<p>Your adult can write your words for you.</p>
      ${box("My story is called", ruled(h, 1))}
      ${box("I chose it because of the… (tick)", tick(["cover", "title", "pictures", "author", "someone told me about it"]))}
      ${box("Draw your favourite part", `<div class="pp-draw"></div>`)}
      ${box("How did the story make you feel?", faces)}
      ${box("Tell your adult why. Then act out a part with toys or puppets.", ruled(h, 1))}`,
    answers: lookForPage(h, "My favourite story", ["A reason for choosing that's about the book: its cover, title, pictures or author",
      "Likes and dislikes shared, with a reason (\"I didn't like it when the wolf…\")", "Retelling or acting out a part in their own way, in order",
      "Talking about the characters and events, not just naming them"], "Most of this is talk: note what the pupil says as they explain and act it out.")
  }));

  add("paper-my-news", "lesson-early-sharing-my-news-and-new-words", "My news", "Draw your news in order, then tell it using a new word.", (who, h) => ({
    pupil: `${h.sheetHead("My news", who)}<p>Draw what happened, in order. Then tell your news to your adult.</p>
      <div class="pp-cols3">${["First…", "Then…", "At the end…"].map(t => box(t, `<div class="pp-draw"></div>`)).join("")}</div>
      ${box("How did I feel?", tick(["happy", "excited", "proud", "worried", "sad", "surprised"]))}
      ${box("My new word", `${ruled(h, 1)}<p class="hint">Use it when you tell your news.</p>`)}
      ${box("Let's pretend: I am in a shop. I tell the shopkeeper what I want and why.", tick(["I spoke clearly", "I said please and thank you", "I used my new word"]))}`,
    answers: lookForPage(h, "My news", ["Events told in the right order (first, then, at the end)", "Feelings and ideas shared, not just what happened",
      "Talking clearly enough to be understood", "The new word used in a way that fits", "In the pretend shop: explaining what they want so the listener understands"],
      "Jot down a phrase or two the pupil says: it's the best evidence of their talk.")
  }));

  add("paper-find-it", "lesson-early-finding-information-in-signs-and-books", "Find it!", "Read a poster and a menu with an adult, find information and use it to choose.", (who, h) => ({
    pupil: `${h.sheetHead("Find it!", who)}<p>Read the poster and the menu with your adult.</p>
      <div class="pp-cols">${box("Poster", `<p class="pp-advert"><b>PET SHOW</b><br>Saturday<br>10 o'clock<br>In the park<br>Bring your pet! 🐶 🐱 🐰</p>`)}
        ${box("Café menu", `<p class="pp-advert">🥪 Sandwich 3p<br>🍎 Apple 1p<br>🍪 Biscuit 2p<br>🥛 Milk 2p</p>`)}</div>
      <p><b>1.</b> What day is the pet show? ${blank(6)}</p>
      <p><b>2.</b> Where is it? ${blank(6)}</p>
      <p><b>3.</b> What pet would you take? Draw it.</p><div class="pp-draw pp-short"></div>
      <p><b>4.</b> You have 3p. Choose what to buy from the menu. Draw or write it.</p><div class="pp-draw pp-short"></div>
      <p><b>5.</b> Is this a story or information? Circle one: &nbsp; <b>story</b> &nbsp; <b>information</b></p>`,
    answers: answersPage(h, "Find it!", ["Saturday", "In the park", "Any pet, and a reason if they give one", "Anything that costs 3p or less in total, for example a sandwich, or an apple and a biscuit",
      "Information: it tells you facts, not a story"], "Read the poster and menu aloud with the pupil if needed: the skill here is finding and using the information.")
  }));

  add("paper-my-choices", "lesson-first-choosing-texts-and-explaining-why", "My choices", "A log of texts chosen for enjoyment or information, with reasons, then a plan for a text of your own.", (who, h) => ({
    pupil: `${h.sheetHead("My choices", who)}
      <table class="pp-table"><tr><th>What I read, watched or listened to</th><th>Who made it</th><th>For fun or to find out?</th><th>Why I liked it, or didn't</th></tr>
        ${[1, 2, 3].map(() => "<tr><td></td><td></td><td></td><td></td></tr>").join("")}</table>
      ${box("My favourite author or series, and why", lines(2))}
      ${box("I chose a book by looking at its… (tick)", tick(["cover", "title", "author", "illustrator", "blurb on the back"]))}
      <h2 class="ws-sub">Now plan a text of your own choice</h2>
      <div class="pp-cols">${box("It's about…", lines(1))}${box("It's for… (who will read it?)", lines(1))}</div>
      ${box("It will be a…", tick(["story", "comic", "poster", "letter", "fact file", "something else"]))}
      ${box("I chose that because…", lines(2))}`,
    answers: lookForPage(h, "My choices", ["Choosing for different reasons: for fun and to find something out", "Reasons about the text itself, such as the author's style, the topic or the pictures",
      "Using the cover, title, author or blurb to choose", "For their own text: a subject, a reader and a format that suit each other, with a reason"])
  }));

  add("paper-talking-together", "lesson-first-listening-and-talking-in-a-group", "Talking together", "Prepare a short talk about an object, then check how the talk and the listening went.", (who, h) => ({
    pupil: `${h.sheetHead("Talking together", who)}
      ${box("My object or picture is", lines(1))}
      ${box("Three things I will say about it", lines(3))}
      ${box("A question I could ask my listener", lines(1))}
      <h2 class="ws-sub">When I talk</h2><p>${tick(["I spoke clearly and loudly enough", "I looked at my listener", "I used my voice and face to make it interesting", "I showed my object or picture"])}</p>
      <h2 class="ws-sub">When I listen</h2><p>${tick(["I waited for my turn", "I looked at the speaker", "I nodded or agreed", "I asked a question that fitted"])}</p>
      ${box("Next time I will…", lines(1))}`,
    answers: `${h.brandHead("What to look for: Talking together", "For the adult, while you listen and talk.")}
      <table class="pp-table"><tr><th></th><th>Not yet</th><th>Some of the time</th><th>Yes</th></tr>
        ${["Takes turns and talks at the right time", "Listens and responds respectfully (nods, agrees, asks, answers)", "Speaks clearly and audibly", "Uses eye contact, expression and body language",
          "Shares ideas in a sensible order, with useful words", "Uses the object or picture to help the listener"].map(t => `<tr><td>${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
      <p>Ask one question after the talk, and note how the pupil answers.</p>`
  }));

  const HEDGEHOGS = "Hedgehogs are small, spiny animals that live in gardens, parks and woods. They come out at night to find food. They eat beetles, worms, slugs and caterpillars. In winter, when there's less food, hedgehogs hibernate in a nest of leaves. You can help them by leaving a gap under your fence so they can travel between gardens.";
  add("paper-notes-listening", "lesson-first-notes-from-listening-then-using-them", "Notes from listening", "Make notes under headings while an adult reads a short talk, then use them to write.", (who, h) => ({
    pupil: `${h.sheetHead("Notes from listening", who)}<p>Your adult will read a short talk twice. The first time, just listen. The second time, write <b>key words</b> under each heading.</p>
      <p><b>The talk is about:</b> ${blank(12)}</p>
      <div class="pp-cols">${["Where they live", "What they eat", "What they do in winter", "How we can help"].map(t => box(t, lines(2))).join("")}</div>
      ${box("Now use your notes: write three sentences, in order, for someone who didn't hear the talk.", ruled(h, 3))}`,
    answers: `${h.brandHead("For the adult: Notes from listening", "Read this aloud twice: once to listen, once for notes.")}
      <p class="pp-passage">${HEDGEHOGS}</p>
      <ul class="ws-answers"><li><b>About:</b> hedgehogs</li><li><b>Where:</b> gardens, parks, woods</li><li><b>Eat:</b> beetles, worms, slugs, caterpillars</li>
        <li><b>Winter:</b> hibernate in a nest of leaves</li><li><b>Help:</b> a gap under the fence</li></ul>
      <p>Look for key words, not whole sentences, and three sentences that follow a sensible order and make sense to a new reader.</p>`
  }), { needsAdult: true });

  add("paper-fact-opinion-first", "lesson-first-fact-and-opinion-in-what-i-read", "Fact or opinion? Penguins", "Read a short text, sort facts from opinions, and write one of each.", (who, h) => {
    const items = [["Penguins are birds.", "fact"], ["Penguins cannot fly.", "fact"], ["Penguins are the cutest animals in the world.", "opinion"],
      ["Penguins use their wings to swim.", "fact"], ["Watching penguins is the best thing to do at the zoo.", "opinion"], ["I think penguins look funny when they walk.", "opinion"]];
    return {
      pupil: `${h.sheetHead("Fact or opinion? Penguins", who)}<p>Read the text.</p>
        <p class="pp-passage">${items.map(i => i[0]).join(" ")}</p>
        <p>A <b>fact</b> can be checked. An <b>opinion</b> is what someone thinks. Tick one for each sentence.</p>
        <table class="pp-table"><tr><th>Sentence</th><th>Fact</th><th>Opinion</th></tr>${items.map(([t]) => `<tr><td>${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
        <p><b>Circle</b> the words in the text that show an opinion.</p>
        <p><b>Write a fact</b> about an animal you know:</p>${ruled(h, 1)}
        <p><b>Write your opinion</b> about the same animal:</p>${ruled(h, 1)}`,
      answers: answersPage(h, "Fact or opinion? Penguins", items.map(([t, k]) => `${t} <b>${k}</b>`).concat(["Opinion words: cutest, best, I think, funny",
        "Any fact that could be checked in a book, and any opinion"]), "Ask how they know: a fact can be checked; an opinion is what someone thinks.")
    };
  });

  add("paper-inform-persuade-first", "lesson-first-writing-to-share-information-or-an-opinion", "Inform or persuade", "Facts in one box, an opinion and reasons in another, then a short poster.", (who, h) => ({
    pupil: `${h.sheetHead("Inform or persuade", who)}
      ${box("My topic (a pet, a game, a place…)", ruled(h, 1))}
      ${box("Inform: three facts about it", ruled(h, 3))}
      ${box("My opinion, and a reason (I think… because…)", ruled(h, 1))}
      ${box("Persuade: make your poster. Use \"You should…\" and a reason.", `<div class="pp-draw"></div>`)}`,
    answers: lookForPage(h, "Inform or persuade", ["Facts chosen and organised clearly, not a mixed list of facts and opinions", "Words suited to the job: plain and clear to inform, strong and personal to persuade",
      "An opinion with a reason, using because", "At least one attempt to persuade the reader (you should…, don't miss…)"])
  }));

  add("paper-recommend-it", "lesson-second-choosing-texts-and-authors-and-writing-my-own-choice", "Recommend it", "A review with evidence, a note on sources, and a plan for a text of your own with its audience and form.", (who, h) => ({
    pupil: `${h.sheetHead("Recommend it", who)}
      <div class="pp-cols">${box("Title and author", lines(1))}${box("I read, watched or listened to it for…", tick(["enjoyment", "information"]))}</div>
      ${box("What the author does well, with an example from the text", lines(3))}
      ${box("Who would enjoy it, and why?", lines(2))}
      ${box("For information, I'd use this source because… (is it up to date? who made it?)", lines(2))}
      <h2 class="ws-sub">Plan a text of your own</h2>
      <div class="pp-cols">${box("Purpose (to entertain, inform, persuade, explain)", lines(1))}${box("Audience", lines(1))}</div>
      ${box("Form and style (a review, blog, comic, instructions…), and why it suits the audience", lines(2))}`,
    answers: lookForPage(h, "Recommend it", ["Preferences explained with supporting detail: an example of what the author does", "A reader who'd enjoy it, with a reason",
      "Thinking about how useful and reliable a source is", "A genre, form, structure and style that suit the purpose and audience, with a reason"])
  }));

  add("paper-discussion", "lesson-second-group-discussion-building-on-others-ideas", "Discussion: building on ideas", "Plan points for a discussion, use the starters, and note the techniques a speaker uses.", (who, h) => ({
    pupil: `${h.sheetHead("Discussion: building on ideas", who)}
      ${box("The question we're discussing", lines(1))}
      <div class="pp-cols">${box("My view and two reasons", lines(3))}${box("A view someone else might have", lines(3))}</div>
      ${box("Starters to use (tick each one you use)", tick(["I agree with… because…", "Building on what you said…", "Can you explain what you mean by…?", "I see it differently because…", "So what we're saying is…"]))}
      ${box("Something someone else said that changed or added to my thinking", lines(2))}
      ${box("Listening to a speaker: techniques they used to influence me", tick(["emphasis on key words", "changing pace", "tone of voice", "a rhetorical question", "strong vocabulary"]))}`,
    answers: `${h.brandHead("What to look for: Discussion", "For the adult, while you discuss.")}
      <table class="pp-table"><tr><th></th><th>Not yet</th><th>Some of the time</th><th>Yes</th></tr>
        ${["Contributes relevant ideas, information and opinions", "Shows respect for others' views and offers their own", "Builds on others' contributions (asks, clarifies, supports)",
          "Uses vocabulary, eye contact, body language, emphasis, pace and tone", "Spots techniques used to engage or influence a listener"].map(t => `<tr><td>${t}</td><td class="pp-c">☐</td><td class="pp-c">☐</td><td class="pp-c">☐</td></tr>`).join("")}</table>
      <p>The strongest evidence is a pupil changing or adding to their view because of what someone else said.</p>`
  }));

  const PLASTIC = "Every year, millions of tonnes of plastic end up in the sea. Some comes from rubbish dropped on beaches, and some is washed down rivers from towns. Sea animals can mistake plastic bags for jellyfish and eat them. Tiny pieces, called microplastics, have been found in fish that people eat. Scientists say that using less single-use plastic, such as straws and bags, and recycling more, would help. Some towns now hold beach clean-ups every month. This information comes from a radio programme about the ocean.";
  add("paper-notes-own-words", "lesson-second-notes-from-listening-in-my-own-words", "Notes in my own words", "Notes in your own words under your own headings while an adult reads, then a paragraph with its source.", (who, h) => ({
    pupil: `${h.sheetHead("Notes in my own words", who)}<p>Your adult will read a short talk twice. First listen for the <b>purpose</b> and <b>main ideas</b>. Then make notes in <b>your own words</b> under headings you choose.</p>
      <p><b>Purpose of the talk:</b> ${blank(16)}</p>
      <div class="pp-cols">${[1, 2, 3, 4].map(n => box(`Heading ${n}: ${blank(8)}`, lines(2))).join("")}</div>
      ${box("Use your notes: write a short paragraph explaining this to a younger pupil.", lines(4))}
      <p><b>Source:</b> where did this information come from? ${blank(14)}</p>`,
    answers: `${h.brandHead("For the adult: Notes in my own words", "Read this aloud twice: once to listen, once for notes.")}
      <p class="pp-passage">${PLASTIC}</p>
      <ul class="ws-answers"><li><b>Purpose:</b> to inform listeners about plastic in the sea and how to help</li>
        <li><b>Main ideas:</b> where the plastic comes from; how it harms sea animals; microplastics in fish; what helps (less single-use plastic, recycling, clean-ups)</li>
        <li><b>Source:</b> a radio programme about the ocean</li></ul>
      <p>Look for notes in the pupil's own words (not copied phrases), sensible headings, a paragraph that suits a younger reader, and the source credited.</p>`
  }), { needsAdult: true });

  const ADVERT = "Are you tired of boring breakfasts? Try new Sunny Crunch! Sunny Crunch is made with oats and dried fruit, and each bowl has 5 grams of fibre. It's the tastiest cereal you'll ever eat! Kids everywhere love it. Ask for Sunny Crunch at your local shop today: you won't be disappointed!";
  add("paper-what-i-heard", "lesson-second-questions-fact-and-opinion-in-what-i-hear", "What I heard", "Questions on a radio advert read aloud: literal, inferential and evaluative, fact and opinion, and how it tries to influence.", (who, h) => ({
    pupil: `${h.sheetHead("What I heard", who)}<p>Your adult will read a radio advert aloud. Listen carefully. You can hear it twice.</p>
      <p><b>1. Literal</b> (it says so): What is the cereal made with?</p>${lines(1)}
      <p><b>2. Inferential</b> (clues tell you): Who do you think the advert is aimed at? How can you tell?</p>${lines(1)}
      <p><b>3. Evaluative</b> (what do you think?): Would this advert make you want to buy Sunny Crunch? Why?</p>${lines(2)}
      <p><b>4.</b> Write one <b>fact</b> and one <b>opinion</b> from the advert.</p>${lines(2)}
      <p><b>5.</b> How does the advert try to influence you? ${tick(["a question to start", "strong words like tastiest", "saying everyone loves it", "telling you what to do"])}</p>
      <p><b>6.</b> How useful is the advert if you want to know whether the cereal is healthy? Why?</p>${lines(2)}
      <p><b>7.</b> Write your own questions about the advert: one literal, one inferential and one evaluative.</p>${lines(3)}`,
    answers: `${h.brandHead("For the adult: What I heard", "Read this aloud, like a radio advert. Read it again if asked.")}
      <p class="pp-passage">${ADVERT}</p>
      <ol class="ws-answers"><li>Oats and dried fruit</li><li>Children and families: \"kids everywhere\", \"boring breakfasts\", a fun name</li><li>Any answer with a reason</li>
        <li>Fact: made with oats and dried fruit, or 5 grams of fibre. Opinion: the tastiest cereal, kids everywhere love it, you won't be disappointed</li>
        <li>All four: a question, strong words, saying everyone loves it, telling you to buy it</li>
        <li>Not very useful on its own: it's trying to sell, so it chooses what to tell you. Check the label or another source.</li>
        <li>Three questions of the right kinds</li></ol>`
  }), { needsAdult: true });

  const HAMSTER = "Hamsters are small animals that make good pets. They sleep in the day and are busy at night, so their cage should be somewhere quiet. A hamster needs a big cage with deep bedding to dig in, a wheel to run on and a place to hide. Give your hamster fresh water every day and a small amount of hamster food. They also like small pieces of carrot or apple. Never give a hamster chocolate or sweets. Clean the cage once a week, and handle your hamster gently, close to the floor, in case it jumps.";
  add("paper-layout-page", "lesson-second-layout-and-presentation-to-engage-a-reader", "Design a page", "Turn a plain text into a leaflet page for a younger reader: headings, bullet points, pictures and captions, then explain the choices.", (who, h) => ({
    pupil: `${h.sheetHead("Design a page", who)}<p>This information is all in one block, so it's hard to read. Your reader is a child aged 7 who is getting a hamster.</p>
      <p class="pp-passage">${HAMSTER}</p>
      <p><b>1.</b> Underline the most important ideas. Which ones belong together? Group them, for example <i>home</i>, <i>food</i>, <i>care</i>.</p>
      <p><b>2.</b> Design the page in the box. Sketch where everything goes and write the words for your headings and bullet points.</p>
      <div class="pp-draw" style="height:78mm"></div>
      <p><b>I used:</b> ${tick(["a heading", "sub-headings", "bullet points", "a picture", "a caption", "a font or colour to make something stand out"])}</p>
      <p><b>3.</b> Choose one thing you used. Why does it help your reader?</p>${lines(2)}`,
    answers: lookForPage(h, "Design a page", [
      "The main ideas picked out and grouped (home, food, care and handling), not every sentence copied",
      "Features chosen for a purpose: a heading that says what the page is about, sub-headings for each group, bullet points for lists such as foods",
      "Pictures with captions that add information, not just decoration",
      "Something important made to stand out, such as never giving chocolate or sweets",
      "A reason for a choice that is about the 7-year-old reader: finding things quickly, seeing what matters most, wanting to read on"],
      "A version made on a computer or tablet counts just as much. Ask which choice helps the reader most, and whether there's a better way to show one idea.")
  }));

