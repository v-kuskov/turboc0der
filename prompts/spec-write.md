---
description: Creating and writing spec
argument-hint: [feature description]
---

Interrogate user and write or update feature spec at path `.specs/{feature}/spec.md. Spec must reflect
feature from user's perspective, describing what need to be done, without any implementation details.

**Pre-flight**

1. Read project's context, understand it's structure and high-level functionality.
2. Determine feature slug from description and context (kebab-case).
3. Create directory `.specs/{feature}/`.

**1. Requirements collection**

Systematically ask the user about what the feature should do — from the user's perspective, not the implementer's.

Question Categories:

1. **User & Purpose**
   - Who is the user of this feature?
   - What is the user trying to accomplish?
   - What problem does this solve for them?

2. **Expected Behavior**
   - What should happen when the user triggers this feature?
   - What inputs does the user provide? What outputs do they get?
   - What does success look like from the user's point of view?

3. **Quality & Constraints**
   - How fast/reliable does it need to be?
   - What platforms or environments must it support?
   - What existing systems must it work with?

4. **Scope Boundaries**
   - What is explicitly in scope?
   - What is explicitly out of scope?
   - What should NOT happen?

5. **Priorities**
   - What is essential vs nice-to-have?
   - What can be deferred?

6. **Edge Cases**
   - What could go wrong from the user's perspective?
   - What error states should the user see?
   - What invalid inputs might occur?

**2: Write Requirements Spec**

Synthesize answers into `.specs/{feature}/spec.md`:

```markdown
---
status: draft
summary: Requirements spec for {feature}
---

# Context and Goals

Brief background, what problem this solves for the user.

## User Stories

[List of user stories, named as US-{N}]

## Acceptance

[Acceptance scenarios]

## Functional Requirements

[List of functional requirements using MUST/SHOULD language, named as FC-{N}]

## Key Entities

[List of entities described from user's perspective, named as KE-{N}]

## Scope

### In Scope

[List of aspects that in scope of this feature]

### Out of Scope

[List of aspects that out of scope of this features]

## Edge Cases

[List of edge cases, named as EC-{N}]

## Success Criteria

[List of outcomes from user's perspective, named as SC-{N}]

## Open Questions

[List of open questions]

## Details

[List of subspecs and with short description for each one, written after subspecs]
```

Validate with user: present the spec and ask "does this capture what you want?"

**3: Decompose into sub-specs**

Split spec into compact sub-specs (≤150 lines each). Each covers one coherent concept.

1. Identify natural boundaries: user story groups, functional areas, lifecycle phases.
2. For each subfeature, write `.specs/{feature}/spec-{slug}.md` with same format as above plus frontmatter:

```markdown
---
summary: One-line description
---

## Context

(brief)

## User Stories Summary

[List of user stories covered by this subspec]

## Functional Requirements

[List of functional requirements using MUST/SHOULD language]

## Edge Cases

[List of edge cases]

## Success Criteria

[List of outcomes from user's perspective]
```

**Rules**

- Ask ONE question at a time.
- Each question must be from the user's perspective only.
- If user starts describing implementation, redirect: "Let's focus on what the user sees, not how it's built.".
- Spec files must be 150 lines long or less.
- Continue until all categories are covered and user has nothing more to add.
- Max 3 iterations. Document remaining unknowns as open questions.
- No implementation details, never ask about or document HOW, only WHAT from user perspective.
- Do not plan, this workflow produces requirements and specs only.
