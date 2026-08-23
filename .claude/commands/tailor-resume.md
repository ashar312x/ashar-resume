---
description: Tailor the resume to a job description (text, screenshot, or URL) and export a PDF
argument-hint: <JD text | URL | path to screenshot>
allowed-tools: Read, Agent
---

Job description input: $ARGUMENTS

Hand this to the `resume-tailor` subagent, which judges the fit and — only on a
match — writes `applications/<Job Title> - <Company>/` containing the tailored
resume, cover letter, both PDFs, and `job-info.txt`.

Before delegating:

- If the JD is a **pasted screenshot** (an image already in this conversation,
  not a file path), transcribe it to text first — subagents cannot see images.
  Pass the full transcription in the prompt.
- If it is an **image file path**, Read it, transcribe it, and pass the text.
- If it is a **URL** or **raw text**, pass it through verbatim; the subagent
  fetches URLs itself.
- If `$ARGUMENTS` is empty, ask for the JD instead of guessing.

Always tell the subagent **how the JD arrived** (LinkedIn URL, other web page,
screenshot, manual paste) and the **job URL** if there is one — those two go
into `job-info.txt`.

Then relay the subagent's verdict, output paths, and the list of changes back to
the user — its report is not shown to them.
