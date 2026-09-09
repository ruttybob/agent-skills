---
name: spec
disable-model-invocation: true
description: Start spec-driven development — write a structured specification before writing code. Use when the user explicitly invokes /spec.
---

# /spec

Invoke the spec-driven-development skill.

Begin by understanding what the user wants to build. Ask clarifying questions about:
1. The objective and target users
2. Core features and acceptance criteria
3. Tech stack preferences and constraints
4. Known boundaries (what to always do, ask first about, and never do)

Then generate a structured spec covering all six core areas: objective, commands, project structure, code style, testing strategy, and boundaries.

If the request bundles several independently testable capabilities, first propose a capability map (module ids, dependency direction, build order) per the skill's Phase 0 and get it approved, then spec each module in dependency order.

Save the spec as SPEC.md in the project root and confirm with the user before proceeding.

## Register in beads

If the repo runs the beads tracker (see `AGENTS.md` → Issue tracker; `bd prime` is the command SSOT), register the approved spec before leaving:

- Each capability-map module becomes one `epic` — a container; a single-capability spec gets one epic. Record the spec file's path in the epic body.
- The spec file stays the SSOT for the *why*; the epic only points at it. Never fork spec content into the tracker.

No tracker → skip this section; the spec file alone is the artifact.
