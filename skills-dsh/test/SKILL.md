---
name: test
disable-model-invocation: true
description: Run TDD workflow — write failing tests, implement, verify. For bugs, use the Prove-It pattern. Use when the user explicitly invokes /test.
---

# /test

Invoke the test-driven-development skill.

For new features:
1. Write tests that describe the expected behavior (they should FAIL)
2. Implement the code to make them pass
3. Refactor while keeping tests green

For bug fixes (Prove-It pattern):
1. Write a test that reproduces the bug (must FAIL)
2. Confirm the test fails
3. Implement the fix
4. Confirm the test passes
5. Run the full test suite for regressions

A bug reported without a ticket gets one first when the repo runs beads (`bug` type, repro steps in the body — see `AGENTS.md` → Issue tracker): the Prove-It test then hangs off a tracked issue, and the fix's commit closes it.

For browser-related issues, also invoke browser-testing-with-devtools to verify with Chrome DevTools MCP.
