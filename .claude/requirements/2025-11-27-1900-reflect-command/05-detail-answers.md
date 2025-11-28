# Detail Answers: /reflect Command

## Q1: Data source?
**Answer:** JSONL transcripts (default) + explicit user input

Default to parsing JSONL transcripts for signals; user can also explicitly say what to learn.

## Q2: Pre-promotion tracking?
**Answer:** JSON journal file

Dedicated file at `.claude/orchestration/temp/reflect-journal.json` for accumulating signals before promotion.

## Q3: Unlearning?
**Answer:** Yes - full lifecycle

/reflect can add, update, and remove learned rules.

## Q4: Conflict handling?
**Answer:** (default accepted) Warn and let user decide

Show conflicts, don't silently override.

## Q5: Scope?
**Answer:** Project only

All learnings go to project CLAUDE.md. No global suggestions.

---

## Complete Requirements Summary

**Data Sources:**
- Primary: JSONL transcript parsing (workshop import)
- Secondary: Explicit user input ("learn: X")

**Storage:**
- Pre-promotion: JSON journal file
- Finalized: CLAUDE.md (rules) + Workshop preferences (soft)

**Lifecycle:**
- Add new learned rules
- Update existing rules
- Remove obsolete rules (full lifecycle)

**Scope:**
- Project-only (no global ~/.claude/CLAUDE.md)

**Conflict Handling:**
- Warn on conflicts, user decides
