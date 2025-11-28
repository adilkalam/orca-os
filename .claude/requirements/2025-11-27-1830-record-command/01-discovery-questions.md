# Discovery Questions: /record Command

## Context

We have two memory systems with distinct purposes:

**Workshop (project-memory)** - Session/human memory:
- decisions (with reasoning)
- gotchas (warnings, pitfalls)
- notes (reference info)
- preferences
- antipatterns
- goals, next steps

**vibe.db (project-code)** - Code intelligence:
- code_chunks (functions, classes)
- symbols (fast name lookup)
- embeddings (semantic search)
- task_history (via ProjectContext MCP)

**ProjectContext MCP** - Bridge/API:
- save_decision → Workshop
- save_standard → Workshop
- save_task_history → vibe.db/Workshop
- query_context → Bundles from both

---

## Discovery Questions

### Q1: Should /record capture code-level learnings (symbols, patterns)?

**Default:** NO

**Why this default:** Workshop handles human-level learnings (decisions, gotchas). Code intelligence is auto-indexed by vibe-sync. Mixing them would confuse the purpose.

**Options:**
- YES - /record should also tag/annotate code patterns
- NO - /record focuses on human-level learnings only

---

### Q2: Should /record integrate with the self-improvement system?

**Default:** YES

**Why this default:** The self-improvement system (v2.3.1) already records task outcomes. /record could be the human-triggered complement to auto-recorded outcomes.

**Options:**
- YES - /record complements the self-improvement loop
- NO - Keep them separate

---

### Q3: Should /record always require interactive confirmation?

**Default:** YES (with --quick bypass)

**Why this default:** User should validate what gets recorded. But --quick flag allows power users to skip confirmation.

**Options:**
- YES - Always confirm, with --quick bypass
- NO - Auto-record by default, require --confirm for review

---

### Q4: Should /record have domain-specific variants?

**Default:** NO

**Why this default:** /record is cross-cutting. Domain detection should be automatic based on context, not separate commands.

**Options:**
- YES - /record-ios, /record-nextjs, etc.
- NO - Single /record with auto-domain detection

---

### Q5: Should /record support bulk recording from session history?

**Default:** YES

**Why this default:** Sometimes users want to capture multiple learnings from a long session. Analyzing recent git commits + conversation could extract multiple items.

**Options:**
- YES - /record can analyze session and extract multiple items
- NO - /record is single-item at a time
