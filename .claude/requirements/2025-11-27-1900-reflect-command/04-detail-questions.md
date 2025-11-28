# Detail Questions: /reflect Command

## Q1: How should /reflect access conversation history for analysis?

**Context:** We need conversation signals but don't have direct transcript access.

**Options:**
- A) Workshop browse/search (existing entries)
- B) JSONL transcript parsing (via workshop import)
- C) User provides signals explicitly ("learn: X")
- D) Analyze git commit messages + recent files

**Default:** A + C - Workshop history + explicit user input

**Why:** Doesn't require new infrastructure; user controls what gets analyzed.

---

## Q2: Should /reflect have a "learning journal" for accumulating signals before promotion?

**Context:** Minor preferences might need 3+ mentions before promotion. Need somewhere to track pre-promotion signals.

**Options:**
- A) Yes - dedicated Workshop table/tag for pre-promotion signals
- B) No - use existing Workshop notes, analyze at /reflect time
- C) Yes - file-based journal at .claude/orchestration/temp/reflect-journal.json

**Default:** C - JSON journal file

**Why:** Clean separation from Workshop (which is for finalized entries). Easy to analyze programmatically.

---

## Q3: How should /reflect handle conflicts with existing CLAUDE.md rules?

**Context:** A learned preference might conflict with an existing rule.

**Options:**
- A) Block - don't allow conflicting rules
- B) Warn - show conflict, let user decide
- C) Replace - newer learning supersedes older rule

**Default:** B - Warn and let user decide

**Why:** User should consciously update rules, not silently override.

---

## Q4: Should /reflect support "unlearning" (removing rules that no longer apply)?

**Context:** Project needs change. A rule added 6 months ago might be obsolete.

**Options:**
- A) Yes - /reflect can also remove/archive learned rules
- B) No - manual CLAUDE.md editing for removals
- C) Yes - with "staleness" detection (rule not reinforced in X days)

**Default:** A - Yes, can remove/archive

**Why:** Learning includes unlearning. /reflect should manage the full lifecycle.

---

## Q5: Should learned rules be project-specific or potentially global?

**Context:** Some learnings apply to all projects (coding style), others are project-specific.

**Options:**
- A) Project-only - everything in project CLAUDE.md
- B) Suggest global when appropriate - user decides
- C) Automatic global for universal patterns

**Default:** B - Suggest global when appropriate

**Why:** "Always use strict TypeScript" might be user-wide; "use bun not npm" might be project-specific.
