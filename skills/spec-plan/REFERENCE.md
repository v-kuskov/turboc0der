---
name: spec-plan-reference
description: Detailed templates and validation for spec-plan skill.
---

# Plan Structure (`plan.md`)

```markdown
---
status: draft
summary: Execution plan for {feature}
---

# Summary

2-3 sentences: what gets built, what changes.

## Execution Context

### Runtime/Platform
Language version, runtime, key packages/frameworks

### Implementation Dependencies
Libraries, frameworks, internal APIs this depends on

### Constraints
Must NOT use X. Must stay under Y bytes.

### Validation
Generic: build succeeds (zero errors), lint (no warnings), test (all pass). Exact commands depend on project toolchain.

# Architecture

## Types

| Type | Kind | Description |
|------|------|-------------|
| `Foo` | new struct / modified class / deleted | one-liner |

New types: key fields with types and invariants.
Modified types: what changes (new fields, removed members, changed sigs).
Deleted types: state deletion.

## Interface

New/modified public API signatures in pseudocode. Minimal — only shapes.

## Relations

| Module | How it's used |
|--------|---------------|
| Fooer | Foo calls Fooer.bar(...) for X |

## Boundaries

What each module knows and does NOT know.

# Acceptance

Summary of success criteria. Reference user stories (US-{N}), functional criteria (FC-{N}), edge cases (EC-{N}) from spec.

| Ref | Check |
|-----|-------|
| US-1 | what user sees when done |

# File Organization

| Action | File |
|--------|------|
| NEW | path/to/new-file.ext |
| MODIFY | path/to/existing-file.ext — what changes |
| DELETE | path/to/removed-file.ext |

List test files too.

# Tasks

| # | File | Summary | Dependencies |
|---|------|---------|--------------|
| 1 | `task-1.md` | Short summary | none |
| 2 | `task-2.md` | Short summary | task-1 |
```

Plan constraints: ≤ 300 lines. Architecture/types focus on types. No implementation pseudocode. Acceptance section required.

---

# Task Structure (`task-{desc}.md`)

```markdown
---
status: planned
summary: One-line description
dependencies: []
---

# Description

2-4 sentences. What this builds. What it does NOT build (explicit out-of-scope).

# Types

| Type | Kind | Description |
|------|------|-------------|
| `Foo` | new class | ... |

# Interface

API signatures in pseudocode this task introduces or modifies.

# Implementation

Brief algorithm description. Pseudocode only for non-obvious logic. ≤20 lines. Omit if straightforward.

# Acceptance criteria

**US coverage:** which user stories verified.
**FC coverage:** which functional requirements.
**EC coverage:** which edge cases.
**Test scenarios:** 1-2 sentence key test cases (language-agnostic).

# Files to change

| File | Action |
|------|--------|
| `path/to/file` | NEW / MODIFY / DELETE |
```

Task constraints: ≤ 300 lines. Each ends compilable+testable. First task `dependencies: []`. Tasks form DAG.

---

# Deduction Heuristics

| Question | How to deduce |
|----------|---------------|
| Where does this type go? | Check existing files for similar types. Follow namespace/package conventions. |
| What signature fits? | Look at existing APIs in same area. Match conventions. |
| Which is simpler? | Fewer types, less nesting, no generics unless needed, plain fns vs classes, minimal public API. |
| What default? | Check if codebase uses similar default elsewhere. |
| How to split tasks? | Data structure → consumer → wiring. Each = vertical slice with own tests. |

---

# Task Decomposition Seams

1. **Pure data structure + tests** (standalone, compiles + tests)
2. **Core logic + tests** (depends on data structure)
3. **Integration wiring** (singletons, pipeline registration)
4. **API surface / config** (types, validation, schemas)

---

# Validation Checklist

- [ ] plan.md ≤ 300 lines
- [ ] plan.md has Architecture/Types section with type focus
- [ ] plan.md has Tasks table at end
- [ ] Each task file follows template, ≤ 300 lines
- [ ] Dependencies form DAG (no cycles)
- [ ] First task has `dependencies: []`
- [ ] Each task ends compilable+testable (for its scope: build, lint, test all pass)
- [ ] Task files in same dir as plan.md