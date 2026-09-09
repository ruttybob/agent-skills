---
name: setup-bd
disable-model-invocation: true
description: "Initialize the beads (bd) issue tracker in this repo: the AGENTS.md sections + docs/agents/issue-tracker.md, per the established convention. Use when the user explicitly invokes /setup-bd."
---

# /setup-bd

Initialize the repo's beads records: two short sections in `AGENTS.md` plus `docs/agents/issue-tracker.md`. Precedent to mirror: `~/pets/ybg` (`AGENTS.md` → Issue tracker / Persistent memory, `docs/agents/issue-tracker.md`).

Two rules hold the design together:

- **`bd prime` is the command SSOT** — the doc caches no CLI reference, only what the environment does not confess: recorded values, flow conventions, memory rules.
- **Narrow ownership** — `/setup-bd` owns exactly `docs/agents/issue-tracker.md` and the two AGENTS.md sections it writes. Other AGENTS.md content and other docs are off-limits. A repo-specific tracker fact discovered later (a second store, a related repo) is **bd memory** (`bd remember`), never a doc edit.

## 1. Detect current state (read-only first)

- `bd prime` — succeeds: note the prefix, labels, types it reports. Fails: the tracker is not initialized → `bd init`, asking the user for the prefix (default: the repo directory's short name; the prefix is baked into every issue id, so it is worth one confirmation). `bd doctor` when anything looks off.
- What `.gitignore` says about `.beads/` — committed store or gitignored (stealth)?
- Existing git remote / sync setup — for the doc's recorded values.
- `AGENTS.md`: does an Issue tracker or Persistent memory section already exist? `docs/agents/issue-tracker.md`: already written? Replacing it is in-scope (this skill owns it); never touch anything else.

## 2. Write docs/agents/issue-tracker.md

Fill every value from step 1's findings — a stale recorded value is worse than none. Required sections (structure follows the precedent):

- **One-paragraph model** — local beads database in `.beads/`, driven by the `bd` CLI, agent-driven like `gh`; the "commands live in `bd prime`" statement.
- **Recorded values** — prefix, visibility (committed vs gitignored), sync remote (or "none").
- **Scope** — flow conventions only; this file is owned by `/setup-bd`; tracker facts belong in bd memory.
- **Memory** — `bd remember` / `bd recall` / `bd memories` / `bd forget`; loading is deliberate; what belongs (unwritten conventions, gotchas, reasons) and what does not (issue state, per-session scratch).
- **Types** — one type per issue, derived from how the work was born: `epic` (spec container, never claimed), `task`, `bug`, `feature`, `chore` (no spec), `decision`.
- **Labels** — no taxonomy; the workflow labels only: `needs-info` (parked on the user) and `human` (a person must do it). Readiness is computed, not stamped.
- **Conventions** — claim before work, read via `bd show`, conversation is `bd comment`, persistent state is `bd note`.
- **Dependencies and the frontier** — `bd dep add` wires blockers; `bd ready` is the claimable work.
- **Closing** — `bd close <id> --reason` where the reason links to where the work landed; wontfix lives in the reason too.
- **Spec lifecycle** — a published spec is an `epic`; tickets are children (`--parent`); closing the last ticket closes the epic.

## 3. Write the AGENTS.md sections

Insert or replace exactly these two sections in place (under the existing heading structure; create an `## Agent skills` heading only when absent):

```markdown
### Issue tracker

Issues live in bd (beads) — a local, Dolt-backed database in `.beads/`, driven by the `bd` CLI (prefix `<prefix>`, <committed to git|store gitignored>); `bd prime` is the command SSOT. See `docs/agents/issue-tracker.md`.

### Persistent memory

In bd, via `bd remember` / `bd recall` — loading is deliberate: recall what a task needs when it needs it. Reach for `bd remember "<insight>"` for anything worth keeping across sessions. See *Memory* in `docs/agents/issue-tracker.md`.
```

## 4. Verify

- `bd prime` exits clean.
- `AGENTS.md` carries both sections with the real prefix, pointing at a path that exists.
- Every recorded value in the doc matches the live `bd` config.
- `git status` shows only the expected files touched (AGENTS.md, docs/agents/issue-tracker.md, `.beads/` init artifacts) — nothing else drifted.
