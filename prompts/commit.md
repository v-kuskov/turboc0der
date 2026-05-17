---
description: Commit changes to git
argument-hint: <description what need to be commited>
---

Collect files to commit:

- Check what was done in this session, what files were changed.
- Check which files are stages and changed with `git status --porcelain`.
- Read changes if needed by using `git diff`.
- Stage files that has changes related to the goal `git add <file> <file>..`.

Check if need to amend:

- Changes are small <= 10 lines total or <=3 lines per file.
- Changes don't affect functionality and fix minor bugs or typos
- Changes are directly related to last commit `git log-1 --format=%s`.

Formulate list of changes:

- Each logical change goes into one line describe in one sentence.
- For bugs add short explaination, including root reason and fix.

Present changes to user:

- **CHANGED:** Short description of what was changed from goal and changes.
- **FILES:** Which files were changed.
- **MESSAGE** One-line description of changes, as full sentence, <= 72 symbols
- **DESCRIPTION** List of logical changes.
- Are you going to commit or amend?

Wait for user to confirm.

Commit: `git commit -m "One-line description" -m "Description"`
Check that commit was successfull: `git log -1`
Present user report and commit hash.
