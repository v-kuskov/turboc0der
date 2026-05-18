---
description: Implement planned spec
argument-hint: [feature slug]
---

Orchestrate implementation for given feature using TDD, subagents and self-verification cycle.

**Pre-flight**

1. Read plan `.specs/{feature}/plan.md` — confirm `status: approved`.
2. Explore the codebase enough to understand existing types, interfaces, module structure
and test patterns relevant to the plan.
3. Run verification and tests to confirm clean start.

**Rules**

- One task at the time.
- Review-gate per task, do NOT proceed until current task passes review.
- Commit per task, each verified + reviewed task gets one intermediate commit.
- Full test suite at end, run it before merging.
- *Squash all per-task commits collapsed into one consolidated commit.
- Consolidated commit message, describe what was done for the task, follow project's guidlines.
- Never change code, that's what subagents for.

**1. Create Feature Base Branch**

```bash
git checkout -b "feat/{feature}"
```

**2. Implement plan one task at time**

For each task, in execution order update the task's frontmatter `status` from `planned` to `in-progress` and run `tdd` agent for that task.

Provide agent with:

- Full task description.
- References to related files.
- All necessary context.

Agent must implement exactly one task. Wait for agent to complete.

**3. Review**

Launch 2 instances of `reviewer` agents in parallel:

1. Check if code is correct and meets standards and best practices.
2. Check if code does what it's supposed to do against the spec.

Pass to each agent:

- Full task description.
- Parts of the spec this task implemented.
- List of changed files.

Review output is trusted and should not be validated.

**4. Verify**

If review returned any blocking/critical/major issues or verification failed → go to fix loop.

**Fix Loop**

When build or test output contains blocking, critical, or major failures:

1. Collect the failure details.
2. Go back to step 2, re-launch it, add failure details to the prompt.
3. No more thn 3 fix iterations per task.

**Mark Task Done**

Update the task `status` from `in-progress` to `done`.

**Commit**

```powershell
git add <list of changed files>
git commit -m "<short description what was done as full stntences>" -m "<list of changes, short explanation what was changed, and why>"
```

One commit per task. Follow project-specific commit rules.

**Move to Next Task**

Proceed to the next task in the ordered list.

**Full Verification**

After ALL tasks are committed run full verification and tests.
If verification fails, fix it.

**Report**

Update project's context.

Return:

- Feature description.
- Tasks implemented and committed (ordered list).
- Per-task: review outcome, fix iterations.
- Squashed commit hash (on feature branch).
- Number of intermediate commits consolidated.
- Any unresolved issues.
