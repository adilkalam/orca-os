# Context Findings: /record Command

## Memory System Architecture

### Workshop (project-memory)
**Location:** `.claude/memory/workshop.db`
**Purpose:** Human-level session memory

| Entry Type | Command | Purpose |
|------------|---------|---------|
| decision | `workshop decision "<text>" -r "<reasoning>"` | Architectural/design choices |
| gotcha | `workshop gotcha "<text>" -t <tags>` | Warnings, pitfalls, constraints |
| note | `workshop note "<text>"` | Reference information |
| preference | `workshop preference "<text>"` | User preferences |
| antipattern | `workshop antipattern "<text>"` | Patterns to avoid |

**Query commands:**
- `workshop why "<topic>"` - Find decisions with reasoning
- `workshop search "<query>"` - Fulltext search
- `workshop recent` - Recent activity

### vibe.db (project-code)
**Location:** `.claude/memory/vibe.db`
**Purpose:** Code intelligence

| Table | Purpose |
|-------|---------|
| code_chunks | Functions, classes, methods with code |
| symbols | Function/class names for fast lookup |
| embeddings | Semantic vectors for similarity search |
| task_history | (via ProjectContext) Task outcomes |

**Commands:** `python3 ~/.claude/scripts/vibe-sync.py <subcommand>`

### ProjectContext MCP
**Purpose:** API bridge to both systems

| Tool | Target | Purpose |
|------|--------|---------|
| `save_decision` | Workshop | Record decision with reasoning |
| `save_standard` | Workshop | Create standard from failure |
| `save_task_history` | Both | Record task outcome with files/learnings |
| `query_context` | Both | Get ContextBundle for task |

---

## Self-Improvement System (v2.3.1)

**Automatic recording:** Grand-architects call `save_task_history` at pipeline end

```json
{
  "domain": "ios",
  "task": "Build Auth UI",
  "outcome": "success",
  "agents_used": ["ios-builder", "ios-verification"],
  "issues": [...],
  "files_modified": [...]
}
```

**Pattern analysis:** `/audit` triggers `scripts/analyze-patterns.py`
- Identifies recurring issues (3+ occurrences)
- Generates improvement proposals

**#PATH_DECISION:** /record should complement this by capturing human-identified learnings that the automatic system might miss.

---

## Existing Commands Analysis

### /project-memory decide
Records a single decision:
```bash
workshop --workspace .claude/memory decision "<text>" -r "<reasoning>"
```

### /session-save
Captures session context to `.claude-session-context.md`:
- Git status, recent commits
- User-provided summary
- Next steps

**Gap:** Neither captures multiple categorized learnings in one operation.

---

## Data Flow for /record

```
Session Work
    ↓
/record (manual trigger)
    ↓
Analyze Context:
  - Git commits/diff
  - Modified files
  - Conversation (if available)
  - phase_state.json
    ↓
Extract Learnings:
  - Decisions (with reasoning)
  - Gotchas (warnings)
  - Task summary
    ↓
User Confirmation (unless --quick)
    ↓
Record to:
  ├── Workshop (decision, gotcha, note)
  └── ProjectContext (save_decision, save_task_history)
    ↓
Summary Output
```

---

## #PATH_DECISION: Storage Targets

| Learning Type | Workshop Command | ProjectContext Tool |
|---------------|------------------|---------------------|
| Decision | `workshop decision` | `save_decision` |
| Gotcha | `workshop gotcha` | (no equivalent, Workshop only) |
| Note | `workshop note` | (no equivalent, Workshop only) |
| Task outcome | (via note) | `save_task_history` |
| Standard | (via gotcha) | `save_standard` |

**Decision:** Record to both Workshop AND ProjectContext for decisions/task history. Workshop-only for gotchas/notes since ProjectContext lacks equivalents.

---

## #COMPLETION_DRIVE: Assumptions

1. Git history is the primary source for session analysis
2. Conversation transcript is not directly accessible (rely on git + user input)
3. Domain can be auto-detected from modified files
4. Users want to see what will be recorded before confirmation

---

## Related Files

| File | Relevance |
|------|-----------|
| `commands/project-memory.md` | Workshop command interface |
| `commands/project-code.md` | vibe.db command interface |
| `commands/session-save.md` | Similar session capture pattern |
| `commands/audit.md` | Self-improvement integration point |
| `scripts/analyze-patterns.py` | Pattern recognition for self-improvement |
