# Discovery Questions: /reflect Command

## Context

**Agent Self-Improvement (existing):**
- Input: Pipeline execution outcomes (structured task_history)
- Pattern: Same issue from same agent 3+ times
- Output: Agent prompt improvements
- Trigger: /audit command

**Claude Code Self-Improvement (proposed):**
- Input: General interactions (corrections, preferences, repeated instructions)
- Pattern: Same type of correction/instruction 3+ times
- Output: CLAUDE.md / preferences / project standards
- Trigger: /reflect command

---

## Discovery Questions

### Q1: What signals should /reflect capture for learning?

**Options:**
- A) User corrections ("no, do it this way instead")
- B) Repeated instructions ("always use X", "don't do Y")
- C) Explicit feedback ("that was good", "that was wrong")
- D) All of the above

**Default:** D - All of the above

**Why:** Comprehensive learning requires multiple signal types. Each captures different improvement opportunities.

---

### Q2: Where should /reflect improvements be applied?

**Options:**
- A) CLAUDE.md only (project-level)
- B) Workshop preferences only (session-memory)
- C) Both CLAUDE.md and Workshop preferences
- D) Also ~/.claude/CLAUDE.md (global)

**Default:** C - Both CLAUDE.md and Workshop preferences

**Why:** CLAUDE.md for persistent, important rules; Workshop preferences for softer preferences that may evolve.

---

### Q3: Should /reflect require manual invocation or be automatic?

**Options:**
- A) Manual only (/reflect command)
- B) Automatic at session end (via hook)
- C) Both (auto-capture, manual review/apply)

**Default:** C - Both

**Why:** Auto-capture ensures no signals are lost; manual review ensures user controls what gets applied.

---

### Q4: Should /reflect share infrastructure with agent self-improvement?

**Options:**
- A) Yes - reuse analyze-patterns.py, same proposal format
- B) No - separate system for Claude Code learnings
- C) Hybrid - shared storage (Workshop), separate analysis

**Default:** C - Hybrid

**Why:** Workshop as unified memory makes sense, but Claude Code learnings have different patterns than agent pipeline outcomes.

---

### Q5: What's the threshold for promoting a learning to CLAUDE.md?

**Options:**
- A) Any recurring pattern (2+ occurrences)
- B) Strong pattern (3+ occurrences, like agents)
- C) User must explicitly mark as important
- D) Severity-based (critical → auto-suggest, others → user decides)

**Default:** D - Severity-based

**Why:** Critical corrections should be surfaced quickly; minor preferences can accumulate before suggesting promotion.
