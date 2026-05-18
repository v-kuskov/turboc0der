---
description: Code review
argument-hint: <description what need to be reviewd>
---

Read changed code, analyze changes if any, check against goal and code standards, find bugs. Use subagents to delegate the work.

Decide what need to be reviewed.

- Is there description of changes and what need to be reviewd? Use this.
- Does context have some work done? Use this.
- Check `git status --porcelain` and `git diff` to check if there any changes.

Launch 2 `reviewer` agents in parallel, give them full description what need to be reviewd. Every agent review it's own
part.

1. Review code quality and find bugs.
2. Review if code does what it supposed to do.

Wait for subagents to finish. Merge both reports and present them to user.

Do not fix anything, just present results.
