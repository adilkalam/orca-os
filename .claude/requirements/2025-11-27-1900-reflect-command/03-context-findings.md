# Context Findings: /reflect Command

## Key Insight: Different Learning Loops

### Agent Self-Improvement (v2.3.1)
```
Pipeline Execution → Structured Outcome → Pattern Analysis → Agent Prompt Update
```

- **Input:** Structured task_history with issues array
- **Pattern:** Same agent + same issue type
- **Output:** Agent YAML "Learned Rules" section
- **Analysis:** scripts/analyze-patterns.py

### Claude Code Self-Improvement (proposed)
```
Interaction → Signal Extraction → Pattern Analysis → CLAUDE.md/Preference Update
```

- **Input:** Conversation signals (corrections, instructions, feedback)
- **Pattern:** Same correction type, same instruction theme
- **Output:** CLAUDE.md rules OR Workshop preferences
- **Analysis:** New /reflect-specific logic

---

## Signal Types to Capture

### 1. Corrections
User overrides Claude's behavior:
- "No, use X instead of Y"
- "That's wrong, the correct approach is..."
- "Don't do that, do this"

**Pattern detection:** Keywords like "no", "instead", "wrong", "don't", "actually"

### 2. Repeated Instructions
Same instruction given multiple times:
- "Always use TypeScript strict mode"
- "Never use inline styles"
- "Run tests before committing"

**Pattern detection:** Similar instruction content across sessions/messages

### 3. Explicit Feedback
Direct quality signals:
- "That was perfect"
- "This broke something"
- "Great approach, remember this"

**Pattern detection:** Sentiment + action keywords

---

## Storage Architecture

### Workshop Tables for /reflect

| Entry Type | Purpose | Example |
|------------|---------|---------|
| `preference` | Soft preferences | "User prefers concise responses" |
| `gotcha` (tagged `reflect`) | Corrections learned | "Don't suggest inline styles for this project" |
| `decision` (tagged `reflect`) | Rules to add to CLAUDE.md | "Always run lint before commit" |

### CLAUDE.md Sections

```markdown
## Learned Preferences (from /reflect)
<!-- Auto-generated - do not edit manually -->
- Always use TypeScript strict mode in this project
- Prefer functional components over class components
- Run `bun test` not `npm test`
```

---

## #PATH_DECISION: Separate from Agent System

Reasons to keep /reflect separate from agent self-improvement:

1. **Different input format**
   - Agents: Structured JSON with `issues` array
   - Claude Code: Natural language signals from conversation

2. **Different pattern detection**
   - Agents: Exact match on `agent` + `issue_type`
   - Claude Code: Semantic similarity of corrections/instructions

3. **Different outputs**
   - Agents: Update agent YAML files
   - Claude Code: Update CLAUDE.md, Workshop preferences

4. **Different scope**
   - Agents: Per-agent learning
   - Claude Code: Per-project learning (some global)

---

## Signal Extraction Approach

### Option A: Conversation Analysis (requires transcript access)
- Parse conversation for correction keywords
- Extract instruction patterns
- Requires access to session transcript

**#CONTEXT_DEGRADED:** We don't have direct access to conversation transcripts. Would need Workshop `browse` or JSONL imports.

### Option B: User-Prompted Extraction
- User explicitly tells /reflect what to learn
- /reflect asks clarifying questions
- User confirms before recording

**This is more aligned with "manual only" decision.**

### Option C: Recent Workshop Analysis
- Analyze recent Workshop entries (notes, gotchas)
- Look for patterns across entries
- Propose consolidation into CLAUDE.md rules

**Hybrid:** Combine B + C

---

## Proposed /reflect Flow

```
/reflect [topic]
    │
    ├─ If topic provided:
    │   └─ Focus on specific learning
    │
    ├─ Otherwise:
    │   ├─ Query Workshop recent entries
    │   ├─ Query recent git commits for context
    │   └─ Identify potential learnings
    │
    ├─ Present learnings to user:
    │   ├─ "I noticed you corrected me 3 times about X"
    │   ├─ "You've mentioned Y preference multiple times"
    │   └─ "This gotcha keeps coming up: Z"
    │
    ├─ User selects which to formalize:
    │   ├─ Add to CLAUDE.md (rule)
    │   ├─ Add to Workshop preference (soft)
    │   └─ Skip / not worth formalizing
    │
    ├─ For CLAUDE.md additions:
    │   ├─ Generate rule text
    │   ├─ User confirms wording
    │   └─ Append to "Learned Preferences" section
    │
    └─ Summary of what was learned
```

---

## Related Files

| File | Relevance |
|------|-----------|
| `commands/audit.md` | Similar pattern analysis flow |
| `commands/project-memory.md` | Workshop interaction patterns |
| `docs/concepts/self-improvement.md` | Architecture reference |
| `CLAUDE.md` | Target for learned rules |

---

## #COMPLETION_DRIVE: Assumptions

1. Workshop browse/search provides enough history for pattern detection
2. Users will explicitly invoke /reflect when they want learning captured
3. CLAUDE.md "Learned Preferences" section is acceptable format
4. Workshop preferences are appropriate for softer learnings
