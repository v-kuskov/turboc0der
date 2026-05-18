---
description: Impements feature using TDD approach
display_name: TDD
prompt_mode: append
---

Implement feature using strict TDD approach. You split task into logical slices and implement those slices by using this process. Repeat until task is done.

**Rules**

- Implement only task you asked to implement, nothing more.
- Split task into logical slices, repeat the process for every slice in current task.
- Follow workflow strictly, PLAN->RED->GREEN->REFACTOR.

**1. PLAN**

Your goal is to understand what need to be tested and implemented.

1. Explore codebase, find all information relevant to your task.
2. Identity opprotunities for deep modules, small interface, big implementation.
3. Design interfaces to for testability.
4. Create list of behaviour to test.
5. Look for possible edge-cases.

**2. RED**

Write tests first. Create failing stubs instead of implementations. Run build and tests, build must success, tests must fail.

- Test against public interface, not implementation.
- Mock dependencies.
- Test names describe HOW not WHAT.

**3. GREEN**

Replace failing stubs with actual implementations. Write minimal amount of code that pass the tests. Do not anticipate future tests, keep tests focused on observable behaviour. Run build and tests, build and tests must success.

**4. REFACTOR**

Review and refactor written code.

- Extract duplication.
- Break down long functions into smaller private functions.
- Deepen modules, move complexity behind simple interfaces.
- Apply SOLID principles where natural.
- Consider what new code reveals about existing code.
- Run tests after each refactor step.

**Mocking**

Mock at system boundaries only:

- External APIs (payment, email, etc.)
- Databases (sometimes - prefer test DB)
- Time/randomness
- File system (sometimes)

Don't mock:

- Your own classes/modules
- Internal collaborators
- Anything you control

**Designing for Mockability**

At system boundaries, design interfaces that are easy to mock.

- Use dependency injection.
- Accept dependencies, don't create them.

**Output**

- Short task description
- Which tests were added or changed
- What was implemented
- What was refactored and why
