---
name: humanize-writing
description: Use whenever writing or editing a CV, resume, or cover letter (or any application text meant to read as personally written). Checks the prose for AI-writing tells — em dash overuse, emoji, buzzword stacking, uniform sentence rhythm, generic filler phrases — and fixes them so the text reads like a person wrote it, not a template.
disable-model-invocation: false
---

# Humanize writing

A checklist pass for CV, resume, and cover letter prose. Run it after drafting
or editing the text, before treating it as final. This is a style pass only —
never change a fact, metric, date, or claim while applying it.

## What to check

1. **No em dashes or en dashes used as sentence punctuation.** A dash used to
   insert a clause mid-sentence ("shipped the feature — on time and under
   budget — for the launch") is the single most common AI tell. Replace it
   with a period, a comma, parentheses, or a plain conjunction. Exception:
   a dash that is structurally part of a fixed template element already in
   the file — a date range like `2020–2023`, an `&mdash;` used as a list
   separator in an existing base template — is not prose and stays as-is;
   don't touch template punctuation you were told elsewhere to preserve.
2. **No emojis.** None, anywhere, including in headers or bullet markers.
3. **No AI-filler phrases.** Cut or rewrite anything like: "in today's
   fast-paced world," "at the forefront of," "seamlessly," "cutting-edge,"
   "unlock," "elevate," "game-changer," "leverage" used as a verb, "robust
   solution," "dive into," "it's important to note," stacked "Furthermore,"
   / "Moreover," transitions, and adjective triads ("innovative, scalable,
   and reliable").
4. **Vary sentence rhythm.** Three sentences in a row with the same
   subject-verb-object shape and similar length reads as generated. Break the
   pattern: shorten one, restructure another, lead with a different part of
   speech.
5. **Prefer concrete over abstract.** Swap intensifiers like "significant,"
   "substantial," or "extensive" for the actual number, name, or outcome
   already present in the source material. If there's no concrete detail to
   point to, cut the intensifier rather than keep a vague one.
6. **Don't overdo it.** No stacked superlatives ("incredibly passionate,"
   "absolutely thrilled"), no exclamation points, no forced enthusiasm. Confident
   and plain beats hyped.
7. **Read it back in one pass.** If a sentence sounds like it belongs in a
   keynote or a marketing template rather than something a specific person
   would say about their own work, cut the adjectives and say the thing
   plainly.

## How to apply

Do this as a second pass over text you already wrote, not while first
drafting:

1. Reread every sentence you changed or added.
2. Flag anything that matches a rule above.
3. Rewrite the flagged sentence so the same fact survives with plainer,
   more varied phrasing.
4. Do not introduce a new claim, number, or detail while rewriting — this
   pass only changes how something is said, never what is said.
