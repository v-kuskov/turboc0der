# Spec Write Reference

## spec.md Template

File: `.specs/{feature}/spec.md`

```markdown
---
status: draft
summary: Requirements spec for {feature}
---

## Context and Goals

Brief background, what problem this solves for the user.

## User Stories

[List of user stories, named as US-{N}]

[Acceptance scenarios]

## Functional Requirements

[List using MUST/SHOULD language, named as FC-{N}]

## Key Entities

[List of entities described from user's perspective]

## Scope

### In Scope

### Out of Scope

## Edge Cases

[List of edge cases, named as EC-{N}]

## Success Criteria

[List of outcomes from user's perspective, named as SC-{N}]

## Open Questions

[List of open questions]

## Details

[List of sub-specs with short description, written after sub-specs]
```

## Sub-Spec Template

File: `.specs/{feature}/spec-{slug}.md`

```markdown
---
status: draft
summary: One-line description
dependencies: []
---

## Context

(brief)

## User Stories Summary

[List of user stories covered by this sub-spec]

## Functional Requirements

[List using MUST/SHOULD language]

## Edge Cases

[List of edge cases]

## Success Criteria

[List of outcomes from user's perspective]
```

## Question Categories (Phase 1)

1. **User & Purpose** — Who is the user? What are they trying to accomplish? What problem does this solve?
2. **Expected Behavior** — What happens when triggered? What inputs/outputs? What does success look like?
3. **Quality & Constraints** — Speed/reliability needs? Platforms? Existing systems to work with?
4. **Scope Boundaries** — What's in scope? What's out of scope? What should NOT happen?
5. **Priorities** — Essential vs nice-to-have? What can be deferred?
6. **Edge Cases** — What could go wrong? What error states? What invalid inputs?

## Rules

- Ask ONE question at a time via `question` tool
- Each question from **user's perspective only**
- If user describes implementation, redirect to user perspective
- Continue until all categories covered and user has nothing more to add
- Max 3 iterations per category
- Document remaining unknowns as open questions
- Sub-specs ≤150 lines (compress or split if exceeded)
- No implementation details, no code, no planning
