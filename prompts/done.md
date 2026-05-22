---
description: Archive completed work — move SPEC.md and tasks/ to specs/archive/
---

All tasks are complete and shipped. Archive the planning artifacts:

1. Verify with the user that the current work is fully done (tests pass, code reviewed, shipped)
2. Create a timestamped directory: `specs/archive/<YYYY-MM-DD>-<short-slug>/`
3. Move `SPEC.md` → that directory (rename to include slug if ambiguous)
4. Move `tasks/` → that directory
5. Commit the archive with message `chore: archive completed spec and tasks`

If SPEC.md or tasks/ don't exist, skip silently — nothing to archive.

User's input: $ARGUMENTS
