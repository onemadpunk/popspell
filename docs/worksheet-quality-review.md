# Pop Spell worksheet review and replacement plan
3 November 2026

## Scope and findings
This is a repository-source review of Pop Spell's printable worksheet system, supported by generator tests. It is **not** a claim that every PDF has been visually printed and approved by a literacy specialist.

- **73 spelling lists** (49 Pop Spell stages plus 24 England statutory lists) were routed through one common generator in `teacher.js`. Its `mapping` mode makes a large table of blank boxes even when the phonics rule, age and learning intention are quite different.
- The same spelling lists also offer dictation, handwriting, sentences and a teacher word key, but these are generic modes rather than a designed progression of tasks.
- **165 separately authored paper sheets** are built from `sheets/*.js` into `paper-sheets.js`. Several, especially in upper-primary and secondary literacy, already use comparison, evidence, source evaluation and original writing. We should not replace these blindly.
- Activity printouts in `teacher.js` convert online questions to multiple choice or blank answer lines. They add teacher feedback for some tasks, but the experience is not always an effective independent paper lesson.
- Many England statutory spelling lists had no suitable example sentences in the existing `sentences.js`, leaving them poorly supported for use-in-context activities.
- The print fitter in `teacher.js` scales sheets and may omit excess generic questions to fit paper. The new activities must be checked for real A4 page breaks, not only automated content validity.

## Repair implemented on this branch
- New original `workbook.js` lesson-specific activity builder with **eight families**: short vowels, consonant teams, split e, vowel spellings, vowel+r, word endings, exception words, and older word study.
- The pupil works through **notice / investigate, practise, apply in a sentence, and independent check**, with different task designs for each spelling family. A pattern investigation is **not** a row of blank sound boxes.
- Each of the 73 lists now has **supported, independent and extension** worksheet versions, each with its own adult answer and assessment notes. Sound maps, dictation, handwriting and sentence-only pages remain separately available as teaching tools.
- **72 original contextual sentences** for the 24 statutory lists, written expressly for Pop Spell and referenced by the correct list.
- **15 specific word investigations** for Years 3–6 including sound contrasts, suffixes, doubled consonants and pattern exceptions. A specialist still needs to approve these.
- Library printing, lesson packs, scheduled work and homework now select the practice worksheet by default instead of the former generic sound-map worksheet.
- The new pages are laid out for black-and-white A4 with clear directions, writing space, no unnecessary ink-heavy backgrounds, and separate teacher pages.

## Assessment rubric for Sara
Please inspect printed copies at early, first, second and upper-primary level for:
1. **Correctness**: words actually demonstrate the claimed rule; no false generalisations or misleading sound maps.
2. **Teaching progression**: the pupil observes or models a feature before being asked to use it independently.
3. **Diagnostic value**: the teacher can tell a misheard sound from a letter-pattern error or a vocabulary misunderstanding.
4. **Differentiation**: the supported route supplies meaningful modelling, not merely fewer questions; extension requires reasoning and transfer.
5. **Age respect**: task content, vocabulary, space to write and visual style suit the pupil, including older pupils needing literacy support.
6. **Classroom usability**: printable in monochrome, no clipped text or split questions, teacher prompts and answers match the pupils' page, and the tasks can be delivered without unnecessary equipment.

## Print review sweep
After the branch is available in a browser preview, open the teacher Library and run `tools/fit-sweep.js` using the steps described at the top of that file. `__sweepWorkbooks()` checks the supported, independent and extension variants of the visible spelling lists against A4 printable height. An over-height result is a defect to fix, not a reason to shrink pupil handwriting to illegibility. Manual A4 PDF checks are still necessary because a height check cannot detect poor writing space or confusing typography.

## What still needs review
- **Real browser/PDF A4 print proof** for representative packs. Automated tests verify the content, not line wraps or print dimensions.
- **Specialist approval of linguistic content**, including any differences caused by Scottish versus English phonics pronunciation.
- **Individual quality inspection of all 165 bespoke paper worksheets**. They should be kept where useful and rewritten one by one where weak, checking their source under `sheets/` rather than editing generated `paper-sheets.js`.
- **Question-to-paper conversions** need a second pass to replace weak multiple-choice or blank-line tasks with subject-appropriate activities where applicable.
- **Teacher marking and progression integration** must eventually record what pupils have mastered, not just how many words they got right.

No commercial examples were copied. These resources use original text and the existing Pop Spell word lists and content. This branch deliberately does not alter pupil progress, class data or the separate Eponine recording repair.
