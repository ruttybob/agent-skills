---
description: Pre-launch checklist via parallel fan-out, then synthesize go/no-go decision
---

Load skill `/skill:shipping-and-launch`.

`/ship` is a **fan-out orchestrator**. It runs three specialist personas in parallel against the current change, then merges their reports into a single go/no-go decision with a rollback plan.

## Phase A — Parallel fan-out

Spawn three subagents **concurrently** by issuing all three `subagent` calls in a single response. This is critical — sequential calls defeat the purpose.

For each subagent, read the corresponding persona file and pass its instructions as the task:

1. **Code Reviewer** — Read `agents/code-reviewer.md`, then call:
   `subagent(agent="worker", task="Read agents/code-reviewer.md and follow its instructions as the Code Reviewer persona. Review the current staged changes or recent commits across all five axes (correctness, readability, architecture, security, performance). Output the standard review template from your instructions.")`

2. **Security Auditor** — Read `agents/security-auditor.md`, then call:
   `subagent(agent="worker", task="Read agents/security-auditor.md and follow its instructions as the Security Auditor persona. Run a vulnerability and threat-model pass on the current staged changes or recent commits. Check OWASP Top 10, secrets handling, auth/authz, dependency CVEs. Output the standard audit report from your instructions.")`

3. **Test Engineer** — Read `agents/test-engineer.md`, then call:
   `subagent(agent="worker", task="Read agents/test-engineer.md and follow its instructions as the Test Engineer persona. Analyze test coverage for the current change. Identify gaps in happy path, edge cases, error paths, and concurrency scenarios. Output the standard coverage analysis from your instructions.")`

**Constraints:**
- Subagents cannot spawn other subagents — do not let one persona delegate to another.
- Each subagent gets its own context window and returns only its report to this main session.

## Phase B — Merge in main context

Once all three reports are back, synthesize them as the main agent:

1. **Code Quality** — Aggregate Critical/Important findings from the code reviewer. Resolve duplicates.
2. **Security** — Promote any Critical/High security findings to launch blockers. Cross-reference with the reviewer's security axis.
3. **Performance** — Pull from the reviewer's performance axis; cross-check Core Web Vitals if applicable.
4. **Accessibility** — Verify keyboard nav, screen reader support, contrast. Handle directly.
5. **Infrastructure** — Env vars, migrations, monitoring, feature flags. Verify directly.
6. **Documentation** — README, ADRs, changelog. Verify directly.

## Phase C — Decision and rollback

Produce a single output:

```markdown
## Ship Decision: GO | NO-GO

### Blockers (must fix before ship)
- [Source persona: Critical finding + file:line]

### Recommended fixes (should fix before ship)
- [Source persona: Important finding + file:line]

### Acknowledged risks (shipping anyway)
- [Risk + mitigation]

### Rollback plan
- Trigger conditions: [what signals would prompt rollback]
- Rollback procedure: [exact steps]
- Recovery time objective: [target]

### Specialist reports (full)
- [code-reviewer report]
- [security-auditor report]
- [test-engineer report]
```

## Rules

1. The three Phase A personas run in parallel — never sequentially.
2. Personas do not call each other. The main agent merges in Phase B.
3. The rollback plan is mandatory before any GO decision.
4. If any persona returns a Critical finding, the default verdict is NO-GO unless the user explicitly accepts the risk.
5. **Skip the fan-out only if all of the following are true:** the change touches 2 files or fewer, the diff is under 50 lines, and it does not touch auth, payments, data access, or config/env. Otherwise, default to fan-out.
