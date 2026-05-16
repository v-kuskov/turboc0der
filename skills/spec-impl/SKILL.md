---
name: spec-impl
description: Implement features sequentially via review-gated per-task workflow. Creates feature branch, implements tasks one-by-one with tdd-agent, reviews each with review-agent, fixes up to 2 iterations per task, then squashes all commits and --no-ff merges to master. Use when implementing features from approved spec/plan documents where tasks must be written, reviewed, verified, and consolidated per task before merging.
---

# Spec Impl — Sequential Implementation Workflow

## Quick start

```
/spec-impl "feature-slug"
```

Pre-flight reads `.specs/{feature}/plan.md` (must be `status: approved`) and all CONTEXT files. Tasks selected with `status: planned` or `in-progress`.

## Workflows

### Phase 1: Setup feature branch

```powershell
git checkout -b "feat/{feature}"
```

### Phase 2: Implement one task at a time

For each task in execution order, sequential only — no parallel:

- [ ] **Implement** — Launch `tdd-agent` with task file + spec refs. Writes source + tests.
- [ ] **Review** — Launch 2 `review-agent` instances in parallel: (1) correctness & standards, (2) spec compliance. Pass task description + changed files (`git diff --name-only`).
- [ ] **Verify** — If review returns blocking/critical/major issues → fix loop.
- [ ] **Fix loop** — Re-launch impl-agent with task + failure details. Re-review. Max 2 iterations.
- [ ] **Mark done** — Update task status to `done`.
- [ ] **Commit** — `git add` changed files, `git commit -m "<description>" -m "<list of changes>"`. One commit per task.

### Phase 3: Full suite verification

Run full verification + tests across all tasks. Fix failures by returning to Phase 2 for that task.

### Phase 4: Consolidate

```powershell
git checkout master && git pull --rebase
git checkout "feat/{feature}" && git rebase master
<verification and tests>
$commitCount = git rev-list --count HEAD "^"(master)
if ([int]$commitCount -gt 1) {
    $consolidatedMsg = "- <short description of functional changes with why>"
    git reset --soft master && git commit -m $consolidatedMsg
}
<verification and tests>
```

### Phase 5: Report

Update project context. Return: feature slug, tasks implemented (ordered), per-task review outcome + fix iterations, squashed commit hash, intermediate commit count, unresolved issues.

## See also

Detailed phase instructions: [REFERENCE.md](REFERENCE.md)

## Critical rules

- **Sequential only** — one task at a time. No parallel worktrees. No forks.
- **Review-gate per task** — do NOT proceed until current task passes (no blocking/critical/major issues).
- **Fix loop** — max 2 fix iterations per task.
- **Commit per task** — each verified + reviewed task gets one intermediate commit.
- **Full test suite at end** — run before merging.
- **Squash** — all per-task commits collapsed into one consolidated commit.
- **Consolidated commit msg** — subject: short description of feature; body: list of changes as full sentences. Describes final outcome, not individual tasks.
