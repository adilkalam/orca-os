# Detail Answers: /record Command

## Q1: Auto-categorize learnings?
**Answer:** YES - auto-categorize

System suggests category, user can override.

## Q2: Create standards from gotchas?
**Answer:** SUGGEST ONLY

Suggest promoting to standard when critical, user decides.

## Q3: Duplicate handling?
**Answer:** 7d check + block

Check last 7 days, block if duplicate.

## Q4: Separate learning type?
**Answer:** NO (default accepted)

Use separate entries - keeps data model clean.

## Q5: Pattern analysis suggestion?
**Answer:** YES - suggest

After recording, hint if this looks like a recurring pattern.

---

## Complete Requirements Summary

**Scope:**
- Human-level learnings only (not code patterns)
- Decisions, gotchas, notes, task outcomes

**Integration:**
- Complements self-improvement system
- Suggests pattern analysis for recurring issues
- Suggests standard promotion for critical gotchas

**UX:**
- Interactive confirmation by default
- --quick flag to skip confirmation
- Auto-categorize with user override
- 7-day duplicate check with block

**Data Flow:**
- Extract from git history + user input
- Auto-detect domain
- Record to Workshop + ProjectContext
- Show summary with query hints
