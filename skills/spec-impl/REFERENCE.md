# Spec Impl — Reference

## Pre-flight checklist

1. Read CONTEXT-MAP.md and all CONTEXT.md files.
2. Read `.specs/{feature}/plan.md` — confirm `status: approved`.
3. Get tasks from plan and read task files. Select those with `status` set in `planned` or `in-progress`.
4. Run verification and tests to confirm clean start.

## Phase 1: Create Feature Base Branch

```powershell
git checkout -b "feat/{feature}"
```

## Phase 2: Implement plan one task at time

For each task, in execution order:

### 2a. Implement Task

Update the task's frontmatter `status` from `planned` to `in-progress`.
Mark task as `in-progress` in task list.

Launch `tdd-agent` via `task`. Pass:

- Feature slug
- Path to the task file
- Paths to referenced spec files

TDD agent writes source and test code only.

Wait for tdd-agent to complete.

### 2b. Review Task

Launch 2 instances of `review-agent` via `task` in parallel:

1. Check if code is correct and meets standards and best practices.
2. Check if code does what it's supposed to do against the spec.

For each agent pass:

- Task description, with all references (spec, plan, task files)
- List of changed files (from `git diff --name-only`)

Wait for review agents to complete, merge results.
Review output is trusted and should not be validated.

### 2c. Verify

If review returned any blocking/critical/major issues or verification failed → go to fix loop.

### 2d. Fix Loop

When build or test output contains blocking, critical, or major failures:

1. Collect the failure details.
2. Go back to step 2a — re-launch impl-agent with the task file AND the failure details.
3. Re-run step 2b (review) — output is again trusted.
4. Re-run step 2c (verify).
5. Max 2 fix iterations per task.

### 2e. Mark Task Done

Update the task `status` from `in-progress` to `done`.

### 2f. Commit

```powershell
git add <list of changed files>
git commit -m "<short description what was done>" -m "<list of changes, short explanation what was changed, why if needed>"
```

One commit per task. Follow project-specific commit rules.

### 2g. Move to Next Task

Proceed to the next task in the ordered list.

## Phase 3: Full Suite Verification

After ALL tasks are committed run full verification and tests.
If verification fails, fix the last task (go to Phase 2 for the failing task).

## Phase 4: Consolidate Feature Branch

```powershell
git checkout master
git pull --rebase                          # catch any upstream changes
git checkout feat/{feature}
git rebase master                          # rebase feature onto latest master
# Verify rebase is clean
<verification and tests>
# Consolidate all intermediate commits into one
$commitCount = git rev-list --count HEAD "^(master)"
if ([int]$commitCount -gt 1) {
    $consolidatedMsg = "- <short description of functional changes that were made with `why` if needed>"
    git reset --soft master
    git commit -m $consolidatedMsg
}
# Verify squash is clean
<verification and tests>
```

## Phase 5: Report

Update project's context.

Return:

- Feature slug
- Tasks implemented and committed (ordered list)
- Per-task: review outcome, fix iterations
- Squashed commit hash (on feature branch)
- Number of intermediate commits consolidated
- Any unresolved issues
