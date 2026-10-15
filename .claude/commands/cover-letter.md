---
description: Given a job posting link, print a tailored cover letter as plain text in the CLI (no files, no PDF)
argument-hint: <job posting URL>
allowed-tools: Agent
---

Job posting link: $ARGUMENTS

Hand this straight to the `cover-letter-cli` subagent, which fetches the link,
judges the fit against Ashar's profile, and — only on a match — writes the
cover letter text. It creates no files; the letter comes back as text in its
report.

If `$ARGUMENTS` is empty, ask for the job link instead of guessing.

Relay the subagent's verdict and, on a match, the full letter text back to the
user exactly as written — its report is not shown to them automatically.
