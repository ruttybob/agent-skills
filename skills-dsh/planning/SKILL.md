---
name: planning
disable-model-invocation: true
description: Break work into small verifiable tasks with acceptance criteria and dependency ordering. Use when the user explicitly invokes /planning.
---

# /planning

Invoke the planning-and-task-breakdown skill.

Read the existing spec (SPEC.md or equivalent) and the relevant codebase sections. Then:

1. Enter plan mode — read only, no code changes
2. Identify the dependency graph between components
3. Slice work vertically (one complete path per task, not horizontal layers)
4. Write tasks with acceptance criteria and verification steps
5. Add checkpoints between phases
6. Present the plan for human review

Save the plan to tasks/plan.md — the human-readable artifact: dependency graph, slice rationale, checkpoints.

The **task ledger lives in beads** (conventions in `AGENTS.md` → Issue tracker; `bd prime` is the command SSOT; the base skill's External tracker branch is the rule): one issue per task — type per the repo's type table, acceptance criteria and verify steps in the body, parented under the spec's epic, blockers wired with `bd dep add` so the frontier (`bd ready`) *is* the build order. Do not also write `tasks/todo.md` — one ledger, or tasks scatter.

No tracker (`bd prime` fails) → fall back to the base skill's default `tasks/todo.md`.

**One plan per epic.** bd carries the live state; the plan is the readable companion of a single cycle and never outlives its epic:

- Starting a new cycle while a finished plan is on disk (its epic has no open tickets): archive it first — `git mv tasks/plan.md tasks/archive/<epic-or-spec-slug>.md` — then write the new one. Git history is the real archive; the rename keeps past plans browsable.
- Open tickets under the plan's epic → the cycle is mid-flight: stop and ask, never silently overwrite an incomplete plan.
- Nothing is lost when the plan goes: the *why* stays in the spec, the *what's-left* in bd.
