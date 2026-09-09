---
name: build
disable-model-invocation: true
description: Implement tasks incrementally — build, test, verify, commit. Add "auto" to run the whole plan in one approved pass. Use when the user explicitly invokes /build.
---

# /build

Invoke the incremental-implementation skill alongside test-driven-development.

The task ledger is beads (conventions in `AGENTS.md` → Issue tracker; `bd prime` is the command SSOT): each task is a ticket, readiness is the frontier (`bd ready`), done is `bd close` with a close reason. No tracker → "ticket" below means the next unchecked task in the plan file.

## Modes

- `/build` — implement the next ready ticket, then stop (careful, one slice at a time).
- `/build auto` — generate the plan if needed, get a single approval, then implement every ticket without stopping between them.

The arguments select the mode. Treat `auto` (canonical) or `all` as autonomous mode; anything else (or empty) is the default single-task mode. Note: autonomous mode is not faster per task — it runs the same test-driven loop — it only removes the human stepping between tasks.

## Default: one ticket

Claim the next ready ticket (`bd ready --claim`). Then:

1. Read the ticket's acceptance criteria (`bd show <id>`)
2. Load relevant context (existing code, patterns, types)
3. Write a failing test for the expected behavior (RED)
4. Implement the minimum code to pass the test (GREEN)
5. Run the full test suite to check for regressions
6. Run the build to verify compilation
7. Commit with a descriptive message referencing the ticket id
8. Close the ticket — `bd close <id> --reason "<commit sha> — what landed"` — and stop. When that was the epic's last open ticket, also close the epic and archive its plan: `git mv tasks/plans/<slug>.md tasks/archive/` in a small follow-up `chore:` commit.

## Autonomous: the whole plan (`/build auto`)

Use this once a spec exists and you want to collapse plan + build into one run. It removes the manual stepping between tasks — not the verification. Every ticket still earns a passing test and its own commit.

1. Require a spec. Look only for a spec at a known path: SPEC.md at the repo root, docs/SPEC.md, or a file under spec/. A README or arbitrary doc does NOT count. If none exists, stop and tell the user to run /spec first — do not invent requirements.
2. Establish a clean baseline. Run `git status --porcelain`. If there are uncommitted changes outside the expected planning artifacts (SPEC.md, docs/SPEC.md, spec/*, tasks/plans/*), stop and ask the user to commit, stash, or confirm how to handle them. Autonomous per-ticket commits must not absorb unrelated local work, or the clean-rollback guarantee breaks.
3. Plan if needed. If the spec's epic has no open tickets yet, run /planning to create them (the epic's plan file + tickets).
4. Single checkpoint. Present the full plan and wait for an unambiguous affirmative (e.g. "approve", "go", "yes"). Treat hedged responses ("looks reasonable", "I guess") as NOT approved. This is the only human gate — after approval, run autonomously. If you generated plan files, commit them as a single preparatory commit now so it doesn't bleed into the first ticket's commit.
5. Execute every ticket in dependency order — which is the frontier: claim the next `bd ready` ticket, run the full default loop above (RED → GREEN → regression → build → commit → close), repeat until the frontier is empty. Stage only the files that ticket touched — never `git add -A` blindly — and make one commit per ticket so any point is a clean rollback.
6. Stop and ask the user (do not push through) when:
   - a test can't be made to pass or the build breaks without an obvious fix → follow the debugging-and-error-recovery skill
   - the spec is ambiguous, or a ticket needs a decision the spec doesn't cover — park the ticket (`bd note` carrying the question, plus the repo's parked label if it defines one) so the frontier stays honest
   - a ticket is high-risk or irreversible — auth/permission changes, destructive data migrations, payments, deletions, deploys, anything touching secrets, or anything you can't undo with `git revert` → follow the doubt-driven-development skill and get explicit sign-off before continuing
   After the user resolves a blocker, they re-invoke /build auto — it resumes from the frontier.
7. Summarize at the end: tickets closed, tests added, commits made, and anything skipped, flagged, or left for the user.

If any step fails, follow the debugging-and-error-recovery skill.
