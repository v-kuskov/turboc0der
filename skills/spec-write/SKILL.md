---
name: spec-write
description: Elicit requirements from user perspective and decompose features into sub-specs. Use when writing feature specifications, gathering requirements, defining scope, or when user mentions specs, requirements, or feature definition.
---

# Spec Write

## Quick start

`/spec-write "feature description"`

Pre-flight:
1. Read CONTEXT-MAP.md, CONTEXT.md files, ADRs in `docs/adr/`
2. Determine `{feature}` slug (kebab-case)
3. Create `.specs/{feature}/` directory

## Workflows

### Phase 1: Requirements Collection

Ask user about feature from **user's perspective only**. Never ask about HOW, only WHAT.

Six question categories, **one at a time** via `question` tool:

1. **User & Purpose** — who, what goal, what problem
2. **Expected Behavior** — triggers, inputs/outputs, success look
3. **Quality & Constraints** — speed, reliability, platforms, compat
4. **Scope Boundaries** — in scope, out of scope, what should NOT happen
5. **Priorities** — essential vs nice-to-have, deferrable
6. **Edge Cases** — what goes wrong, error states, invalid inputs

Rules: one question per turn. If user describes implementation, redirect: "Let's focus on what the user sees, not how it's built." Max 3 iterations per category. Document remaining unknowns as open questions.

### Phase 2: Write Requirements Spec

Synthesize answers into `.specs/{feature}/spec.md`. See [REFERENCE.md](REFERENCE.md) for templates.

Validate with user: "does this capture what you want?"

### Phase 3: Decompose into Sub-Specs

Split spec into compact sub-specs (≤150 lines each). Each covers one coherent concept.

1. Identify natural boundaries: user story groups, functional areas, lifecycle phases
2. Write `.specs/{feature}/spec-{slug}.md` per subfeature (templates in REFERENCE.md)

## Key Rules

- **No implementation details** — only WHAT from user perspective
- **No code** — requirements only, no planning, no implementation
- **Self-validate**: each sub-spec ≤150 lines? No implementation leaked? Dependencies acyclic?
- **Compress or split**: if sub-spec exceeds 150 lines, tighten language or split into two+
- **Parent spec.md** exempt from line limit (it's a summary/index)

## Templates

See [REFERENCE.md](REFERENCE.md) for spec and sub-spec templates.
