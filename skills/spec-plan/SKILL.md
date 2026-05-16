---
name: spec-plan
description: Take spec files from spec-write, validate through structured grilling, deduce solutions from codebase, then decompose into plan.md + task-*.md files. Use when user says /spec-plan, or mentions planning, task decomposition, or implementation plans after specs exist.
---

# Spec Plan

Take spec-write output, grill user on architecture/boundaries/types, deduce from codebase, ask remaining Qs, write plan.md + task-*.md files.

## Quick Start

```
/spec-plan "feature-slug"
```

## Workflow

1. **Pre-flight** — read CONTEXT-MAP.md, CONTEXT.md files, ADRs, `.specs/{feature}/spec*.md`. Load `grill-with-docs`. Explore codebase for relevant types/interfaces/test patterns.

2. **Grilling** (Phase 1) — one Q at a time via `question` tool. Focus: terminology conflicts, boundary clarity, type coherence, missing assumptions. Max 4 iterations. No user-perspective Qs (that's spec-write's job).

3. **Deduction** (Phase 2) — resolve from spec + codebase: type locations, interface shapes, dependency direction, defaults, task seams. Note each with brief rationale. Skip Qs fully answered by deduction.

4. **Ask User** (Phase 3) — for what deduction couldn't resolve. Order: API shape → behavioral choices → config defaults → error/edge handling. Max 3 iterations. Offer recommended answer per Q.

5. **Plan & Decompose** (Phase 4) — write `plan.md` + `task-*.md` into `.specs/{feature}/`. Each task compiles standalone. First task has `dependencies: []`. Tasks form DAG.

6. **Post-flight** — set `status: draft` in frontmatter. Present to user.

## Full Templates & Validation

See [REFERENCE.md](REFERENCE.md) for plan.md template, task.md template, and validation checklist.

Validation gates:
- plan.md ≤ 300 lines
- Architecture/Types section focuses on types
- Tasks table at end of plan.md
- Each task ≤ 300 lines with Acceptance criteria
- Dependencies acyclic
- First task `dependencies: []`
- Each task ends compilable+testable