---
name: code-context
description: >-
  Use when building or maintaining project CONTEXT.md, defining domain language,
  resolving ambiguous terminology from codebase, or establishing shared vocabulary.
metadata:
  category: technique
  triggers: context, domain terms, terminology, ubiquitous language, shared vocabulary, define terms
---

# Code Context

**Core principle:** Shared language starts with explicit definitions. A term without a written definition is not yet understood.

## When to Use

- Starting a new project or feature — establish domain language first
- Encountering unfamiliar or ambiguous terms in the codebase
- CONTEXT.md is missing or incomplete
- Resolving disagreements about what a term means
- Before writing a spec — ensure terminology is settled

## Steps

1. Read existing `CONTEXT.md` at project root (if it exists). Know what's already defined.

2. If multi-context project: read `CONTEXT-MAP.md` to find which context applies.

3. Identify terms to resolve:
   - From the conversation: ambiguous, unfamiliar, or overloaded words
   - From the codebase: domain-relevant classes, modules, functions, variables
   - From research docs: terms used in `specs/{feature}/research/*.md`

4. For each term, research the codebase first:
   - Spawn `task` sub-agents: "Find how term [X] is used in code. Return definitions, relationships, and file:line references."
   - Read relevant files to understand context and usage

5. If codebase doesn't resolve meaning, grill the user (use `code-grill-user` technique):
   - Propose a canonical definition based on code findings
   - If the user introduces a new term, ask: "What does [X] mean? How is it different from [Y] in CONTEXT.md?"
   - Confirm with user before writing

6. Write to `CONTEXT.md` immediately — never batch per the format in Context Format section below.

7. If the term already exists in CONTEXT.md but usage conflicts:
   - Flag the ambiguity: "CONTEXT.md defines X as [def], but codebase/current conversation uses it as [other]"
   - Ask user which interpretation is correct
   - Update CONTEXT.md with resolution

8. After all terms processed, verify:
   - No unresolved ambiguities remain (flag them explicitly if any)
   - Every term has one canonical definition
   - Aliases documented
   - Relationships between terms expressed

## Success Criteria

- Every term has one sentence definition (what it IS)
- Aliases listed for synonyms to avoid
- Ambiguities flagged and resolved (or explicitly noted as unresolved)
- Relationships between terms documented
- User confirmed each definition
- No batching — each term added immediately when resolved

## Completion Guidance

- Report how many terms were added/updated/flagged
- Include path to updated CONTEXT.md in response

---

## Context Format

Write `CONTEXT.md` at the project root (not under `specs/`).

### Single-context (most repos)

One `CONTEXT.md` at root covering all domain terms.

```markdown
## [Domain Group Name]

**TermA**: One sentence definition — what this IS, not what it does.
_Avoid_: synonym1, synonym2

**TermB**: Another domain concept.
_Avoid_: overloaded-word

## [Another Domain Group]

**TermC**: Definition.
_Avoid_: alias
```

### Multi-context (rare)

A `CONTEXT-MAP.md` at root lists bounded contexts. Each gets its own CONTEXT.md:

```
/
├── CONTEXT-MAP.md
├── src/
│   ├── ordering/CONTEXT.md
│   └── billing/CONTEXT.md
```

```markdown
CONTEXT-MAP.md:
# Context Map

- [Ordering](./src/ordering/CONTEXT.md) — receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md) — generates invoices and processes payments

Ordering → Billing: Ordering emits OrderPlaced events; Billing consumes them
```

### Relationships

Add a `## Relationships` section when terms connect:

```markdown
## Relationships

- **Order** produces one or more **Invoices**
- **Invoice** belongs to exactly one **Customer**
```

### Example Dialogue

Optional section showing how terms interact naturally:

```markdown
## Example Dialogue

> Dev: "When a **Customer** places an **Order**, do we create the **Invoice** immediately?"
> Domain expert: "No — an **Invoice** is only generated once **Fulfillment** is confirmed."
```

### Flagged Ambiguities

```markdown
## Flagged Ambiguities

- "account" used to mean both **Customer** and **User** — resolved: these are distinct concepts.
- [unresolved] "foo" — codebase uses it for [A], user says [B]. Waiting for clarification.
```

### Rules

- Be opinionated — pick one canonical term, list alternatives as aliases to avoid
- Flag conflicts explicitly
- Only domain terms — skip generic tech words (array, function, endpoint)
- One sentence per definition — what it IS, not what it does
- Group terms by natural clusters
- Example dialogue optional — include when boundaries between related terms need clarification
