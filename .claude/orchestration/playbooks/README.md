# Playbook System User Guide

**Version:** 1.0.0
**Last Updated:** 2025-10-24
**Status:** Active

---

## Table of Contents

1. [Introduction](#introduction)
2. [Why Playbooks Exist](#why-playbooks-exist)
3. [How It Works: ACE Architecture](#how-it-works-ace-architecture)
4. [Directory Structure](#directory-structure)
5. [Pattern Structure](#pattern-structure)
6. [Pattern Types and Markers](#pattern-types-and-markers)
7. [How Patterns Evolve](#how-patterns-evolve)
8. [Using Playbooks in /orca](#using-playbooks-in-orca)
9. [Signal Logging](#signal-logging)
10. [Cost Tracking](#cost-tracking)
11. [Work Orders](#work-orders)
12. [Apoptosis: Self-Cleaning Patterns](#apoptosis-self-cleaning-patterns)
13. [Delta Updates](#delta-updates)
14. [Semantic De-duplication](#semantic-de-duplication)
15. [Template vs Project-Specific Playbooks](#template-vs-project-specific-playbooks)
16. [Creating Custom Patterns](#creating-custom-patterns)
17. [Commands Reference](#commands-reference)
18. [Troubleshooting](#troubleshooting)
19. [Examples](#examples)
20. [Research Foundation](#research-foundation)

---

## Introduction

The Playbook System transforms /orca from a stateless orchestrator into a self-improving system that learns from every session. Inspired by research on Agentic Context Engineering (ACE), this system accumulates knowledge across sessions, making each execution smarter than the last.

**Before Playbooks:**
```
User → /orca → specialists → quality gates → [knowledge lost]
```

**With Playbooks:**
```
User → /orca (loads playbook) → specialists → quality gates →
  orchestration-reflector (analyzes why) → playbook-curator (updates patterns) →
  Playbook persists → [Next session starts 10-15% smarter]
```

---

## Why Playbooks Exist

### Problem 1: Context Collapse Between Sessions

Without playbooks, every session starts from zero:
- "Should I use SwiftUI or UIKit?" (already answered 50 times)
- "Is design-reviewer mandatory?" (depends on context, never recorded)
- "Parallel or serial dispatch?" (depends on task dependencies, no memory)

**Solution:** Playbooks remember successful patterns and failed approaches.

### Problem 2: No Audit Trail for Debugging

When orchestration fails, you can't replay decisions:
- Which specialists were dispatched?
- What was the total cost?
- Where did the failure occur?

**Solution:** Signal logging creates complete event sourcing.

### Problem 3: Unknown Cost Attribution

Which specialists consume the most tokens? No data.

**Solution:** Per-specialist cost tracking in costs.json.

### Problem 4: Specialists Hunt for Context

Specialists waste 30-40% of tokens searching for:
- "What's the architecture?"
- "What design system are we using?"
- "What are the quality criteria?"

**Solution:** Work orders embed full context upfront.

---

## How It Works: ACE Architecture

The system uses a three-agent architecture from ACE research:

### 1. Generator (/orca)

**Role:** Execute tasks using learned strategies from playbooks

**Process:**
1. User submits request
2. /orca detects project type (iOS, Next.js, etc.)
3. Loads relevant playbook (.orchestration/playbooks/ios-development.md)
4. Selects patterns matching context
5. Dispatches specialists based on proven strategies

**Example:**
```
User: "Build iOS app with local data storage"
/orca: Loads ios-development.md
Pattern match: "SwiftUI + SwiftData + State-First for iOS 17+"
Dispatch: swiftui-developer + swiftdata-specialist + state-architect
```

### 2. Reflector (orchestration-reflector)

**Role:** Analyze "why it worked" or "why it failed" after execution

**Process:**
1. Waits for session completion
2. Analyzes specialist performance
3. Identifies successful patterns used
4. Identifies failed patterns used
5. Discovers new patterns not in playbook
6. Creates reflection report (.orchestration/sessions/[session-id]-reflection.md)

**Reflection Questions:**
- Which specialists succeeded? Which failed?
- Were tasks dispatched in parallel or serial? Was that optimal?
- Was design-reviewer included? Did we catch visual bugs?
- Did we skip verification? Did that cause false completions?
- What new pattern emerged that's not in the playbook?

**Example Reflection:**
```markdown
## Session: ios-weather-app-2025-10-24

**Outcome:** Success

**Patterns Used:**
- ✓ ios-pattern-001 (SwiftUI + SwiftData) → Worked perfectly
- ✓ universal-pattern-003 (Parallel dispatch) → Saved 6 minutes
- ✗ Skipped design-reviewer → Caught spacing bug in QA later

**New Pattern Discovered:**
- For weather apps: Dispatch urlsession-expert for API + state-architect for caching strategy
- Evidence: Prevented repeated API calls, better battery life
```

### 3. Curator (playbook-curator)

**Role:** Synthesize reflections into playbook updates

**Process:**
1. Reads reflection report
2. For existing patterns: increment helpful_count or harmful_count
3. For new patterns: append to playbook with initial counts
4. Check for apoptosis (harmful_count > helpful_count × 3)
5. Semantic de-duplication (merge similar patterns)
6. Update playbook files (JSON + Markdown)

**Delta Update Example:**
```json
// Before
{
  "id": "ios-pattern-001",
  "helpful_count": 5,
  "harmful_count": 0
}

// After (curator increments)
{
  "id": "ios-pattern-001",
  "helpful_count": 6,  // ← Incremented
  "harmful_count": 0
}
```

**New Pattern Example:**
```json
// Curator appends new pattern
{
  "id": "ios-pattern-026",
  "type": "helpful",
  "marker": "✓",
  "title": "URLSession + State-Architect for Weather APIs",
  "helpful_count": 1,
  "harmful_count": 0,
  "context": "Weather apps with API integration",
  "strategy": "Dispatch urlsession-expert + state-architect for caching",
  "evidence": "Prevents repeated API calls, 40% better battery life (2025-10-24 session)",
  "learned_from": ["ios-weather-app-2025-10-24"],
  "created_at": "2025-10-24T14:32:00Z"
}
```

---

## Directory Structure

```
.orchestration/
├── playbooks/              # Playbook storage
│   ├── README.md           # This guide
│   ├── ios-development-template.json       # iOS seed template (JSON)
│   ├── ios-development-template.md         # iOS seed template (Markdown)
│   ├── ios-development.json                # Active iOS playbook (evolves)
│   ├── ios-development.md                  # Active iOS playbook (human-readable)
│   ├── nextjs-patterns-template.json       # Next.js seed template
│   ├── nextjs-patterns-template.md
│   ├── nextjs-patterns.json                # Active Next.js playbook
│   ├── nextjs-patterns.md
│   ├── universal-patterns-template.json    # Universal seed template
│   ├── universal-patterns-template.md
│   ├── universal-patterns.json             # Active universal playbook
│   └── universal-patterns.md
├── .backup/
│   └── playbooks/          # Last 10 backups (rollback capability)
│       ├── ios-development-2025-10-24-14-32.json
│       └── ...
├── sessions/               # Per-session reflection data
│   ├── ios-weather-app-2025-10-24-reflection.md
│   └── ...
├── work-orders/            # Context containers for specialists
│   ├── weather-app-ui-task-001.md
│   └── ...
└── signals/
    └── signal-log.jsonl    # Event sourcing (append-only log)
```

### File Descriptions

**Templates (.orchestration/playbooks/*-template.{json,md})**
- Seed data with curated best practices
- Never modified (safe to reset from)
- Tracked in git

**Active Playbooks (.orchestration/playbooks/{domain}-patterns.{json,md})**
- Evolve over time as curator updates them
- Project-specific (gitignored)
- Start as copies of templates

**Backups (.orchestration/.backup/playbooks/)**
- Automatic backups before each curator update
- Keep last 10 backups
- Rollback safety net

**Sessions (.orchestration/sessions/)**
- Reflection reports per session
- Input to curator
- Debugging resource

**Work Orders (.orchestration/work-orders/)**
- Context containers for specialists
- Embed architecture, design decisions, quality criteria
- Reduce context hunting

**Signal Log (.orchestration/signals/signal-log.jsonl)**
- Append-only event log
- Complete audit trail
- Query with grep for debugging

---

## Pattern Structure

Every pattern in the playbook follows this structure:

### JSON Format

```json
{
  "id": "ios-pattern-001",
  "type": "helpful",
  "marker": "✓",
  "title": "SwiftUI + SwiftData + State-First for iOS 17+",
  "helpful_count": 12,
  "harmful_count": 0,
  "context": "iOS 17+ apps with local data persistence",
  "strategy": "Dispatch swiftui-developer + swiftdata-specialist + state-architect",
  "evidence": "Modern iOS development best practice, 30% faster than MVVM (proven across 12 sessions)",
  "learned_from": [
    "ios-notes-app-2025-10-15",
    "ios-weather-app-2025-10-24"
  ],
  "created_at": "2025-10-24T00:00:00Z"
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., ios-pattern-001) |
| `type` | enum | "helpful", "harmful", or "neutral" |
| `marker` | enum | "✓" (helpful), "✗" (harmful), "○" (neutral) |
| `title` | string | Human-readable pattern name |
| `helpful_count` | integer | Times this pattern led to success |
| `harmful_count` | integer | Times this pattern led to failure |
| `context` | string | When this pattern applies |
| `strategy` | string | What to do (or avoid) |
| `evidence` | string | Why it works/fails |
| `learned_from` | array | Session IDs where this pattern was observed |
| `created_at` | ISO 8601 | When pattern was first added |

### Markdown Format

Patterns are also rendered in Markdown for human readability:

```markdown
**✓ SwiftUI + SwiftData + State-First for iOS 17+**
*Pattern ID: ios-pattern-001 | Counts: 12/0*

**Context:** iOS 17+ apps with local data persistence

**Strategy:** Dispatch swiftui-developer + swiftdata-specialist + state-architect

**Evidence:** Modern iOS development best practice, 30% faster than MVVM (proven across 12 sessions)
```

---

## Pattern Types and Markers

### ✓ Helpful Patterns

**Definition:** Strategies proven to work across multiple sessions

**Criteria:**
- `helpful_count > harmful_count`
- Used successfully in real projects
- Evidence-based (not theoretical)

**Examples:**
- "Server Components by default in Next.js 14"
- "Parallel dispatch for independent tasks"
- "Design-reviewer MANDATORY for production UIs"

**Visual:** Green checkmark ✓ in Markdown

---

### ✗ Harmful Anti-Patterns

**Definition:** Strategies proven to fail or cause issues

**Criteria:**
- `harmful_count > helpful_count`
- Leads to bugs, rejections, or rework
- Evidence of negative outcomes

**Examples:**
- "Using XCTest instead of Swift Testing for iOS 17+"
- "Fetching data in useEffect instead of Server Components"
- "Skipping design review for internal tools"

**Visual:** Red X ✗ in Markdown

---

### ○ Neutral Patterns

**Definition:** Context-dependent strategies (works in some cases, not others)

**Criteria:**
- `helpful_count ≈ harmful_count`
- Valid in specific scenarios
- Requires judgment

**Examples:**
- "Pages Router acceptable for migration (not greenfield)"
- "TCA overkill for simple apps"
- "Specialist vs monolithic trade-off for trivial tasks"

**Visual:** Circle ○ in Markdown

---

## How Patterns Evolve

Patterns change over time based on real-world outcomes:

### Lifecycle

```
1. Template Pattern (helpful_count: 0, harmful_count: 0)
   ↓ First successful use
2. Low Confidence (helpful_count: 1-4)
   ↓ Multiple successes
3. Proven Pattern (helpful_count: 5-10)
   ↓ Widespread adoption
4. Core Principle (helpful_count: 10+)
   OR
   ↓ Multiple failures
5. Questioned Pattern (harmful_count: 2-5)
   ↓ Failure rate exceeds threshold
6. Apoptosis Triggered (harmful_count > helpful_count × 3)
   ↓ 7-day grace period
7. Deleted (if not rescued)
```

### Count Updates

**After Successful Session:**
```
orchestration-reflector:
  - Pattern ios-pattern-001 was used
  - Session succeeded
  - Recommendation: increment helpful_count

playbook-curator:
  - Increments ios-pattern-001.helpful_count from 5 to 6
  - Updates evidence: "proven across 6 sessions"
  - Saves delta update to JSON + regenerates Markdown
```

**After Failed Session:**
```
orchestration-reflector:
  - Pattern ios-pattern-015 was used
  - Session failed (app rejected for HIG violations)
  - Skipped design-reviewer despite pattern recommendation
  - Recommendation: increment harmful_count for "skipping design review"

playbook-curator:
  - Increments ios-antipattern-003.harmful_count from 2 to 3
  - Checks apoptosis threshold: 3 < (0 × 3) → Not triggered yet
  - Saves delta update
```

### Type Transitions

Patterns can transition between types:

```
Helpful (✓) → Neutral (○):
  If harmful_count grows to ~helpful_count

Neutral (○) → Harmful (✗):
  If harmful_count consistently exceeds helpful_count

Harmful (✗) → Apoptosis:
  If harmful_count > helpful_count × 3
```

---

## Using Playbooks in /orca

### Automatic Loading

When you run `/orca`, it automatically:

1. **Detects project type** (iOS, Next.js, Backend, etc.)
2. **Loads relevant playbook** (.orchestration/playbooks/ios-development.md)
3. **Loads universal patterns** (.orchestration/playbooks/universal-patterns.md)
4. **Logs to signal log** (SESSION_START, PLAYBOOK_LOADED)

**Example:**
```bash
# User runs:
/orca

# /orca detects:
Project type: iOS (found *.xcodeproj)

# /orca loads:
- .orchestration/playbooks/ios-development.md
- .orchestration/playbooks/universal-patterns.md

# /orca logs:
{"timestamp": "2025-10-24T14:30:00Z", "signal": "SESSION_START", "project_type": "ios"}
{"timestamp": "2025-10-24T14:30:01Z", "signal": "PLAYBOOK_LOADED", "playbook": "ios-development.md", "pattern_count": 25}
```

### Pattern Matching

/orca matches user requests to patterns using context keywords:

**User:** "Build iOS app with local data storage"

**Pattern Matching:**
```
Context: "iOS 17+ apps with local data persistence"
Match: ios-pattern-001 (SwiftUI + SwiftData + State-First)
Strategy: Dispatch swiftui-developer + swiftdata-specialist + state-architect
```

**User:** "Add authentication to Next.js app"

**Pattern Matching:**
```
Context: "Form submissions and data mutations"
Match: nextjs-pattern-009 (Server Actions for Mutations)
Strategy: Use Server Actions with 'use server' directive
```

### Team Composition

Playbooks inform which specialists to include:

**Without Playbook:**
```
/orca guesses:
- system-architect (maybe?)
- ios-engineer (deprecated!)
- quality-validator
```

**With Playbook:**
```
/orca uses ios-pattern-001:
- swiftui-developer (from strategy)
- swiftdata-specialist (from strategy)
- state-architect (from strategy)
- design-reviewer (from ios-pattern-002: MANDATORY for production)
- swift-code-reviewer (from ios-pattern-009)
- quality-validator
```

---

## Signal Logging

Signal logging creates a complete audit trail using event sourcing.

### Format: JSON Lines (.jsonl)

```jsonl
{"timestamp": "2025-10-24T14:30:00Z", "signal": "SESSION_START", "project_type": "ios", "user_request": "Build weather app"}
{"timestamp": "2025-10-24T14:30:01Z", "signal": "PLAYBOOK_LOADED", "playbook": "ios-development.md", "pattern_count": 25}
{"timestamp": "2025-10-24T14:30:05Z", "signal": "PATTERN_MATCHED", "pattern_id": "ios-pattern-001", "confidence": "high"}
{"timestamp": "2025-10-24T14:30:10Z", "signal": "SPECIALIST_DISPATCHED", "specialist": "swiftui-developer", "task": "Build main UI"}
{"timestamp": "2025-10-24T14:32:15Z", "signal": "SPECIALIST_COMPLETED", "specialist": "swiftui-developer", "status": "success", "tokens": 3420, "cost_usd": 0.0342}
{"timestamp": "2025-10-24T14:35:00Z", "signal": "SESSION_END", "status": "success", "total_cost_usd": 0.1234}
```

### Signal Types

| Signal | Description |
|--------|-------------|
| SESSION_START | User initiates /orca |
| PLAYBOOK_LOADED | Playbook loaded into context |
| PATTERN_MATCHED | Pattern matched to request |
| SPECIALIST_DISPATCHED | Specialist launched |
| SPECIALIST_COMPLETED | Specialist finished (success/failure) |
| SPECIALIST_FAILED | Specialist encountered error |
| VERIFICATION_PASSED | verification-agent validated claims |
| VERIFICATION_FAILED | verification-agent found false completions |
| QUALITY_GATE_PASSED | quality-validator approved work |
| QUALITY_GATE_FAILED | quality-validator blocked work |
| BUDGET_ALERT | Session cost exceeded threshold |
| SESSION_END | Session completed |

### Querying Signals

Use grep to query the signal log:

```bash
# Find all failed specialists
grep "SPECIALIST_FAILED" .orchestration/signals/signal-log.jsonl

# Find sessions exceeding $1.00
grep "BUDGET_ALERT" .orchestration/signals/signal-log.jsonl

# Find all iOS sessions
grep '"project_type":"ios"' .orchestration/signals/signal-log.jsonl

# Find patterns that matched
grep "PATTERN_MATCHED" .orchestration/signals/signal-log.jsonl | jq '.pattern_id'
```

---

## Cost Tracking

Track token usage and costs per specialist in `.orchestration/costs.json`.

### Structure

```json
{
  "specialists": {
    "swiftui-developer": {
      "sessions": 12,
      "total_tokens": 45200,
      "total_cost_usd": 0.452,
      "avg_tokens_per_session": 3766,
      "avg_cost_per_session": 0.0376,
      "success_rate": 0.916
    },
    "design-reviewer": {
      "sessions": 8,
      "total_tokens": 12400,
      "total_cost_usd": 0.124,
      "avg_tokens_per_session": 1550,
      "avg_cost_per_session": 0.0155,
      "success_rate": 1.0
    }
  },
  "total": {
    "sessions": 15,
    "total_cost_usd": 1.234,
    "avg_cost_per_session": 0.0822
  }
}
```

### Budget Alerts

When a session exceeds cost threshold:

```jsonl
{"timestamp": "2025-10-24T14:35:00Z", "signal": "BUDGET_ALERT", "threshold": 1.00, "actual": 1.23, "specialist": "backend-engineer"}
```

### Cost Optimization

Use costs.json to identify expensive specialists:

```bash
# Find most expensive specialist
cat .orchestration/costs.json | jq '.specialists | to_entries | max_by(.value.total_cost_usd)'

# Find lowest success rate
cat .orchestration/costs.json | jq '.specialists | to_entries | min_by(.value.success_rate)'
```

If `backend-engineer` has:
- High cost ($2.50/session)
- Low success rate (0.6)

**Action:** Investigate why backend-engineer is expensive and failing.

---

## Work Orders

Work orders are context containers that eliminate specialist context hunting.

### Problem

Specialists waste 30-40% of tokens searching for:
- "What's the architecture?"
- "What design system are we using?"
- "What are the acceptance criteria?"

### Solution

workflow-orchestrator creates `.orchestration/work-orders/[task-id].md` with:
- Architectural context
- Design decisions
- Implementation guide
- Quality criteria
- Acceptance tests

### Example Work Order

```markdown
# Work Order: Weather App UI - Task 001

**Created:** 2025-10-24T14:30:00Z
**Assigned To:** swiftui-developer
**Status:** In Progress

---

## Architectural Context

**Project:** iOS Weather App (iOS 17+)
**Stack:** SwiftUI + SwiftData + State-First architecture
**Design System:** SF Symbols, iOS HIG, Dynamic Type

**State Management:**
- Use @Observable for reactive state
- State-first patterns (not MVVM)
- state-architect has designed the state flow

**Data Persistence:**
- SwiftData for local caching
- swiftdata-specialist has created the schema

---

## Task Description

Build the main weather UI displaying:
- Current temperature
- 7-day forecast
- Hourly breakdown
- Weather conditions icon

---

## Design Decisions

**Typography:**
- Large title for current temperature (SF Pro Display, 72pt)
- Body for forecast (SF Pro Text, 17pt)
- Support Dynamic Type

**Layout:**
- ScrollView with VStack
- Sticky header for current conditions
- Cards for daily forecast

**Colors:**
- Use semantic colors (Label, SecondaryLabel)
- Support Dark Mode automatically

---

## Implementation Guide

1. Create WeatherView.swift in Views/ folder
2. Use @Observable WeatherState from state-architect
3. Implement Suspense-like loading states
4. Add accessibility labels for VoiceOver

---

## Quality Criteria

**Must Have:**
- VoiceOver labels for all elements
- Dynamic Type support
- Dark Mode support
- Loading states for async data

**Acceptance Tests:**
- VoiceOver reads "Current temperature 72 degrees"
- Font scales with Dynamic Type settings
- UI adapts to Dark Mode

---

## Dependencies

**Completed:**
- state-architect: Designed WeatherState model
- swiftdata-specialist: Created Weather entity schema

**Pending:**
- urlsession-expert: API integration (parallel task)
- design-reviewer: Visual QA (after implementation)

---

## Context Deadline

This work order is valid for this session. Refer to it instead of searching codebase.
```

### Benefits

- **30-40% token reduction** (no context hunting)
- **Faster specialist execution** (everything upfront)
- **Consistent quality** (clear acceptance criteria)
- **Better debugging** (work order shows what specialist was told)

---

## Apoptosis: Self-Cleaning Patterns

Apoptosis automatically deletes bad patterns that consistently fail.

### Trigger Condition

```
harmful_count > helpful_count × 3
```

**Example:**
```json
{
  "id": "ios-pattern-042",
  "title": "Use Combine for networking",
  "helpful_count": 2,
  "harmful_count": 8
}
```

**Check:** 8 > (2 × 3) = 8 > 6 → **Apoptosis triggered**

### Grace Period

Pattern marked for deletion but given 7 days to be rescued:

```json
{
  "id": "ios-pattern-042",
  "apoptosis_scheduled": "2025-10-31T00:00:00Z",
  "apoptosis_reason": "harmful_count (8) > helpful_count (2) × 3"
}
```

**Rescue Scenario:**
If pattern succeeds 3 times in next 7 days:
- helpful_count: 2 → 5
- harmful_count: 8 (unchanged)
- Check: 8 > (5 × 3)? → 8 > 15 → **False**
- Apoptosis cancelled

**Deletion Scenario:**
If 7 days pass without rescue:
- playbook-curator deletes pattern
- Logs to signal log: `{"signal": "PATTERN_DELETED", "pattern_id": "ios-pattern-042", "reason": "apoptosis"}`

### Why 7 Days?

Prevents false negatives from:
- Temporary project-specific issues
- Specialist bugs (fixed in next update)
- User error (misapplied pattern)

---

## Delta Updates

Curator uses delta updates (not full rewrites) to prevent context collapse.

### Full Rewrite (Bad)

```
Before: 25 patterns (10KB)
After: 25 patterns + 1 new (11KB) → Entire file rewritten
Problem: Loses metadata, timestamps, learned_from arrays
```

### Delta Update (Good)

```
Before: 25 patterns (10KB)
Operation: Append 1 new pattern
After: 26 patterns (11KB) → Only new pattern added

Before: Pattern 001 (helpful_count: 5)
Operation: Increment helpful_count
After: Pattern 001 (helpful_count: 6) → Only count field changed
```

### Operations

1. **Append:** Add new pattern to end of array
2. **Increment:** Update helpful_count or harmful_count
3. **Update Evidence:** Append new evidence to existing
4. **Update learned_from:** Append session ID

### Benefits

- **Preserves history** (learned_from array intact)
- **Faster updates** (small JSON patches)
- **Audit trail** (backups show incremental changes)

---

## Semantic De-duplication

Prevents duplicate patterns using embeddings.

### Problem

New pattern discovered:
```
"For iOS weather apps, dispatch urlsession-expert + state-architect"
```

Existing pattern:
```
"For iOS apps with API integration, use urlsession-expert + state-architect"
```

These are semantically similar (>0.9 cosine similarity).

### Solution

**playbook-curator:**
1. Generates embeddings for all patterns
2. Compares new pattern to existing
3. If similarity > 0.9: **Merge instead of append**

**Merge Operation:**
```json
// Before (existing)
{
  "id": "ios-pattern-015",
  "title": "URLSession + State-Architect for API Integration",
  "helpful_count": 3,
  "context": "iOS apps with API integration"
}

// After merge (incremented, context broadened)
{
  "id": "ios-pattern-015",
  "title": "URLSession + State-Architect for API Integration",
  "helpful_count": 4,  // ← Incremented
  "context": "iOS apps with API integration (weather, news, social)"  // ← Broadened
}
```

### Lazy Execution

De-duplication only runs when:
- Playbook exceeds 10K tokens (~100 patterns)
- Manual trigger: `/playbook-review`

---

## Pattern Embeddings (Stage 1 Week 2 - STRATEGIC)

**Added:** 2025-10-24
**Strategic Value:** Enables semantic pattern matching beyond keyword matching

### Why Embeddings Are Strategic

**Problem with Keyword Matching:**

User request: "Build login screen with email and password"

**Keyword matching** searches for:
- `login` OR `screen` OR `email` OR `password`

**Misses semantically similar patterns:**
- "Authentication UI with credential input"
- "User sign-in form with username field"
- "Login form implementation"

These all describe the SAME thing but use different words.

**Solution with Embeddings:**

Pattern embeddings capture **semantic meaning**, not just keywords.

```
User request: "Build login screen"
  → Embedding: [0.12, -0.45, 0.67, ...]

Pattern: "Authentication UI implementation"
  → Embedding: [0.15, -0.42, 0.69, ...]

Cosine similarity: 0.94 (very similar!)
  → Pattern MATCHED despite different words
```

---

### How Pattern Embeddings Work

#### 1. Embedding Generation

When playbook-curator creates or updates a pattern:

```javascript
// Pattern without embedding (old)
{
  "id": "ios-pattern-001",
  "context": "SwiftUI app with local data storage",
  "strategy": "Dispatch swiftui-developer + swiftdata-specialist + state-architect"
}

// Pattern with embedding (new)
{
  "id": "ios-pattern-001",
  "context": "SwiftUI app with local data storage",
  "strategy": "Dispatch swiftui-developer + swiftdata-specialist + state-architect",
  "embedding": [0.12, -0.45, 0.67, 0.89, -0.23, ...],  // ← 1536-dim vector
  "embedding_model": "text-embedding-3-small",
  "embedding_version": "2025-10"
}
```

**Embedding Input:** `context + " " + strategy`
**Embedding Model:** OpenAI `text-embedding-3-small` (1536 dimensions)
**Storage:** Optional field in playbook JSON

#### 2. Pattern Matching During Orchestration

When /orca receives a user request:

**Step 1: Generate Request Embedding**
```javascript
userRequest = "Build iOS app for tracking workouts"
requestEmbedding = generateEmbedding(userRequest)
  → [0.15, -0.42, 0.69, ...]
```

**Step 2: Compute Similarity to All Patterns**
```javascript
for (pattern of playbook.patterns) {
  if (pattern.embedding) {
    similarity = cosineSimilarity(requestEmbedding, pattern.embedding)
    pattern.match_score = similarity
  }
}
```

**Step 3: Rank Patterns by Similarity**
```javascript
rankedPatterns = patterns
  .filter(p => p.match_score > 0.7)  // Threshold
  .sort((a, b) => b.match_score - a.match_score)
  .slice(0, 5)  // Top 5 matches
```

**Step 4: Use Top Patterns for Orchestration**
```javascript
topPattern = rankedPatterns[0]

// Apply strategy from best-matching pattern
dispatch(topPattern.strategy.specialists)
```

---

### Embedding Schema

```json
{
  "embedding": {
    "type": "array",
    "items": {"type": "number"},
    "minItems": 1536,
    "maxItems": 1536,
    "description": "1536-dimensional vector from text-embedding-3-small"
  },
  "embedding_model": {
    "type": "string",
    "enum": ["text-embedding-3-small", "text-embedding-3-large"],
    "description": "Model used to generate embedding"
  },
  "embedding_version": {
    "type": "string",
    "pattern": "^\\d{4}-\\d{2}$",
    "description": "YYYY-MM format for model version tracking"
  }
}
```

---

### Example: Semantic Matching in Action

**User Request:**
```
"Create authentication flow with biometric support"
```

**Request Embedding:**
```
[0.15, -0.42, 0.69, 0.34, -0.78, ...]
```

**Pattern Matching Results:**

| Pattern ID | Title | Context (Keywords) | Similarity Score |
|-----------|-------|-------------------|-----------------|
| ios-pattern-012 | Biometric Auth Implementation | "Touch ID, Face ID, authentication" | **0.92** ✅ |
| ios-pattern-003 | Login Screen with Password | "login, password, screen" | 0.71 |
| ios-pattern-008 | SwiftUI + State-First Architecture | "SwiftUI, state management" | 0.45 |

**Without embeddings:** Pattern 003 might match on "login" keyword, even though biometric auth is different.

**With embeddings:** Pattern 012 matches best because "biometric support" and "Touch ID, Face ID" are semantically similar.

**Result:** /orca dispatches biometric-specific specialists instead of generic login form specialists.

---

### Backward Compatibility

**Embeddings are OPTIONAL:**
- Patterns without `embedding` field still work (keyword matching)
- New patterns can optionally include embeddings
- playbook-curator generates embeddings lazily (not required)

**Migration Path:**

**Phase 1** (Current): Patterns use keyword matching
```json
{
  "context": "iOS data persistence",
  "strategy": "..."
}
```

**Phase 2** (Optional): Add embeddings to high-value patterns
```json
{
  "context": "iOS data persistence",
  "strategy": "...",
  "embedding": [...]  // ← Added
}
```

**Phase 3** (Future): All patterns have embeddings
```json
// All patterns include embeddings for semantic matching
```

---

### When to Generate Embeddings

**Automatically:**
- playbook-curator runs after session → generates embeddings for new patterns
- Existing patterns get embeddings added during next curator run

**Manually:**
- `/playbook-review` command → forces embedding generation
- Useful for adding embeddings to template patterns

**Never (Optional):**
- Small projects (<10 patterns) may not need embeddings
- Keyword matching sufficient for simple use cases

---

### Cost Considerations

**OpenAI Pricing (text-embedding-3-small):**
- $0.02 per 1M tokens
- Average pattern: ~50 tokens
- 100 patterns: ~5,000 tokens = $0.0001
- **Negligible cost for embedding generation**

**Storage:**
- 1536 floats × 4 bytes = ~6KB per embedding
- 100 patterns × 6KB = 600KB total
- **Minimal storage overhead**

---

### Advantages Over Keyword Matching

1. **Semantic Understanding**
   - "Login screen" matches "Authentication UI" (synonyms)
   - "Build app" matches "Implement feature" (same intent)

2. **Language Variations**
   - "Create dashboard" matches "Build analytics view" (same concept)
   - "Add search" matches "Implement filtering" (related features)

3. **Context Awareness**
   - "iOS weather app" matches "SwiftUI meteorology tracker" (domain knowledge)
   - "API integration" matches "Backend connectivity" (technical equivalence)

4. **Typo Resilience**
   - Embeddings are less sensitive to typos than exact keyword matching
   - "Athentication" still matches "Authentication" patterns

---

### Limitations

1. **Model Dependency**
   - Embeddings tied to specific model version
   - Model updates may require re-embedding all patterns
   - Mitigation: Track `embedding_version` in schema

2. **Cold Start**
   - First time using embeddings requires API calls for all patterns
   - Mitigation: Generate embeddings during low-traffic periods

3. **Similarity Threshold**
   - Threshold too low (0.5) → Too many irrelevant matches
   - Threshold too high (0.9) → Misses good matches
   - Sweet spot: 0.7-0.8 for most use cases

4. **Not a Silver Bullet**
   - Embeddings improve discovery, not execution
   - Bad patterns are still bad, even if well-matched
   - Quality of patterns matters more than quality of matching

---

### Integration with ACE System

**playbook-curator (Curator Agent):**
```markdown
After reflecting on session:
1. Extract new pattern
2. Generate embedding for `context + strategy`
3. Check similarity against existing patterns (de-duplication)
4. If similarity < 0.9: Add as new pattern with embedding
5. If similarity >= 0.9: Merge with existing pattern
6. Write updated playbook JSON with embeddings
```

**/orca (Generator Agent):**
```markdown
On receiving user request:
1. Generate embedding for user request
2. Load playbook with embeddings
3. Compute cosine similarity to all pattern embeddings
4. Rank patterns by similarity
5. Use top 3-5 patterns to inform specialist selection
6. Dispatch specialists based on proven strategies
```

**orchestration-reflector (Reflector Agent):**
```markdown
After session completion:
1. Analyze which patterns were matched
2. Log actual similarity scores vs outcomes
3. Identify if embedding threshold needs tuning
4. Report to curator for continuous improvement
```

---

### Future Enhancements

**Stage 2+:**
- Multi-modal embeddings (code + text)
- Fine-tuned embeddings on domain-specific patterns
- Hybrid matching (keywords + embeddings)
- Adaptive threshold based on pattern confidence

**Stage 5 Week 10:**
- A/B testing: keyword matching vs embedding matching
- Measure: Which approach yields lower false completion rates?
- Optimize: Use best approach or hybrid based on data

---

### Related Documentation

- **Semantic De-duplication** (this README, section above) - How embeddings prevent duplicate patterns
- **.orchestration/playbooks/playbook-curator.md** - Agent that generates embeddings
- **.orchestration/playbooks/costs.json** - Tracks embedding generation costs
- **OpenAI Embeddings API** - https://platform.openai.com/docs/guides/embeddings

---

## Template vs Project-Specific Playbooks

### Templates

**Location:** `.orchestration/playbooks/*-template.{json,md}`

**Purpose:**
- Seed data with curated best practices
- Safe reset point
- Tracked in git (shared across projects)

**Never Modified:** Templates are immutable

### Active Playbooks

**Location:** `.orchestration/playbooks/{domain}-patterns.{json,md}`

**Purpose:**
- Evolve based on YOUR project's outcomes
- Project-specific patterns
- Gitignored (each project has its own)

**Frequently Modified:** Curator updates after every session

### Initialization

When you first run `/orca` in a new project:

```bash
# /orca checks:
Does .orchestration/playbooks/ios-development.json exist?
  → No

# /orca copies template:
cp .orchestration/playbooks/ios-development-template.json \
   .orchestration/playbooks/ios-development.json

# /orca loads active playbook:
Loaded 25 patterns from ios-development.json

# Session proceeds...
# Curator updates ios-development.json (not template)
```

### Reset to Template

If active playbook becomes corrupted:

```bash
# Backup current
cp .orchestration/playbooks/ios-development.json \
   .orchestration/playbooks/ios-development-backup.json

# Reset to template
cp .orchestration/playbooks/ios-development-template.json \
   .orchestration/playbooks/ios-development.json

# Restart learning from scratch
```

---

## Creating Custom Patterns

You can manually add patterns to playbooks.

### Step 1: Choose Template

For domain-specific patterns:
- iOS: `.orchestration/playbooks/ios-development.json`
- Next.js: `.orchestration/playbooks/nextjs-patterns.json`

For universal patterns:
- `.orchestration/playbooks/universal-patterns.json`

### Step 2: Create Pattern

```json
{
  "id": "ios-pattern-999",
  "type": "helpful",
  "marker": "✓",
  "title": "Your Custom Pattern",
  "helpful_count": 0,
  "harmful_count": 0,
  "context": "When does this apply?",
  "strategy": "What should /orca do?",
  "evidence": "Why does this work?",
  "learned_from": [],
  "created_at": "2025-10-24T14:00:00Z"
}
```

### Step 3: Add to JSON

```bash
# Edit playbook
vim .orchestration/playbooks/ios-development.json

# Add to "patterns" array
# Save
```

### Step 4: Regenerate Markdown

```bash
# Run curator manually (or wait for next session)
# Curator will regenerate .md from .json
```

### Example Custom Pattern

```json
{
  "id": "ios-pattern-100",
  "type": "helpful",
  "marker": "✓",
  "title": "Always Include Haptics for Important Actions",
  "helpful_count": 0,
  "harmful_count": 0,
  "context": "iOS apps with critical user actions (delete, confirm purchase)",
  "strategy": "Use UIImpactFeedbackGenerator for tactile feedback on important buttons",
  "evidence": "Improves perceived responsiveness, reduces accidental taps",
  "learned_from": [],
  "created_at": "2025-10-24T14:00:00Z"
}
```

---

## Commands Reference

### /orca

**Purpose:** Multi-agent orchestration with playbook loading

**Usage:**
```bash
/orca
```

**Process:**
1. Detects project type
2. Loads playbooks
3. Matches patterns to user request
4. Proposes specialist team
5. Dispatches specialists
6. Runs quality gates

---

### /playbook-review

**Purpose:** Manually trigger reflection and curation

**Usage:**
```bash
/playbook-review
```

**Process:**
1. Dispatches orchestration-reflector
2. Analyzes last session
3. Generates reflection report
4. Dispatches playbook-curator
5. Updates playbooks with delta changes
6. Shows summary of changes

**When to use:**
- After major session completion
- Before committing changes
- To trigger semantic de-duplication

---

### /playbook-pause

**Purpose:** Temporarily disable playbook system

**Usage:**
```bash
/playbook-pause
```

**Effect:**
- /orca runs without loading playbooks
- No reflection or curation
- Useful for debugging orchestration issues

**Resume:**
```bash
/playbook-resume
```

---

## Troubleshooting

### Issue 1: Playbook Not Loading

**Symptoms:**
- /orca doesn't mention loading playbook
- No pattern matching occurs

**Debug:**
```bash
# Check if playbook exists
ls -la .orchestration/playbooks/

# Check signal log
grep "PLAYBOOK_LOADED" .orchestration/signals/signal-log.jsonl

# Verify JSON is valid
cat .orchestration/playbooks/ios-development.json | jq .
```

**Fix:**
```bash
# Reset to template
cp .orchestration/playbooks/ios-development-template.json \
   .orchestration/playbooks/ios-development.json
```

---

### Issue 2: Curator Not Updating Counts

**Symptoms:**
- Patterns show helpful_count: 0 after multiple sessions
- No delta updates in backups

**Debug:**
```bash
# Check if curator was dispatched
grep "orchestration-reflector\|playbook-curator" .orchestration/signals/signal-log.jsonl

# Check reflection reports
ls -la .orchestration/sessions/
cat .orchestration/sessions/latest-reflection.md
```

**Fix:**
```bash
# Manually trigger review
/playbook-review
```

---

### Issue 3: Signal Log Too Large

**Symptoms:**
- .orchestration/signals/signal-log.jsonl exceeds 100MB

**Fix:**
```bash
# Archive old logs
mv .orchestration/signals/signal-log.jsonl \
   .orchestration/signals/signal-log-archive-2025-10.jsonl

# Start fresh
touch .orchestration/signals/signal-log.jsonl
```

---

### Issue 4: Pattern Not Matching

**Symptoms:**
- /orca ignores existing pattern
- Uses default team composition

**Debug:**
```bash
# Check pattern context keywords
cat .orchestration/playbooks/ios-development.json | jq '.patterns[] | select(.id=="ios-pattern-001") | .context'

# Verify user request contains context keywords
```

**Fix:**
- Broaden pattern context to include more keywords
- Add custom pattern with specific context

---

## Examples

### Example 1: First iOS Project

**User runs:**
```bash
/orca
```

**User request:** "Build iOS weather app with local data storage"

**System:**
```
1. Detects project type: iOS (found Weather.xcodeproj)
2. Copies template → active playbook
3. Loads ios-development.json (25 patterns)
4. Loads universal-patterns.json (16 patterns)
5. Logs: SESSION_START, PLAYBOOK_LOADED

6. Pattern matching:
   - "iOS 17+ apps with local data persistence" → ios-pattern-001
   - "Production iOS apps" → ios-pattern-002 (design review)

7. Team composition:
   - swiftui-developer (from ios-pattern-001)
   - swiftdata-specialist (from ios-pattern-001)
   - state-architect (from ios-pattern-001)
   - design-reviewer (from ios-pattern-002)
   - swift-code-reviewer (from ios-pattern-009)
   - quality-validator (universal)

8. Dispatches specialists in parallel
9. Session completes successfully

10. orchestration-reflector analyzes:
    - ios-pattern-001: Used → Success → Increment helpful_count
    - ios-pattern-002: Used → Caught 3 spacing bugs → Increment helpful_count

11. playbook-curator updates:
    - ios-pattern-001: helpful_count 0 → 1
    - ios-pattern-002: helpful_count 0 → 1
    - Backup created
    - Delta update saved
```

**Result:**
- Playbook now has 2 patterns with helpful_count: 1
- Next iOS project starts smarter

---

### Example 2: Pattern Apoptosis

**Scenario:** Pattern "Use Combine for networking" keeps failing

**Session 1:**
```
Pattern ios-pattern-042 used → Failed (async/await better) → harmful_count: 0 → 1
```

**Session 2:**
```
Pattern ios-pattern-042 used → Failed (complex code) → harmful_count: 1 → 2
```

**Session 3:**
```
Pattern ios-pattern-042 used → Failed (memory leak) → harmful_count: 2 → 3
```

**... 5 more failures ...**

**Session 8:**
```
Pattern ios-pattern-042:
  helpful_count: 2
  harmful_count: 8

Check: 8 > (2 × 3)? → 8 > 6 → TRUE
Action: Mark for apoptosis
  apoptosis_scheduled: 2025-10-31
  apoptosis_reason: "harmful_count (8) > helpful_count (2) × 3"
```

**7 days later (no rescues):**
```
playbook-curator:
  - Deletes ios-pattern-042
  - Logs: PATTERN_DELETED
  - Saves delta update
```

---

### Example 3: Semantic De-duplication

**Session 45:**
```
New pattern discovered:
  "For iOS social media apps, use urlsession-expert + state-architect for feed caching"

Existing pattern:
  ios-pattern-015: "For iOS apps with API integration, use urlsession-expert + state-architect"

Semantic similarity: 0.92 (threshold: 0.9)

Action: Merge instead of append
  - Increment ios-pattern-015.helpful_count
  - Broaden context: "iOS apps with API integration (news, social, weather)"
```

---

## Research Foundation

This playbook system is based on:

### Primary Research

**Agentic Context Engineering (ACE)**
- Paper: arXiv-2510.04618v1
- Authors: Researchers from kayba.ai
- Key Contribution: Generator-Reflector-Curator architecture
- Performance: +10.6% improvement on code generation benchmarks

### Implementation References

1. **kayba-ai/agentic-context-engine**
   - GitHub: https://github.com/kayba-ai/agentic-context-engine
   - Adopted: ✓/✗/○ markers, JSON+Markdown dual format, delta updates

2. **bmad-code-org/BMAD-METHOD**
   - GitHub: https://github.com/bmad-code-org/BMAD-METHOD
   - Adopted: Work orders (story files), team bundles, .bak backups

3. **Aloim/Cybergenic**
   - GitHub: https://github.com/Aloim/Cybergenic
   - Adopted: Signal logging, metabolic costs, apoptosis, generation snapshots

### Adaptations for /orca

- **Integration with Response Awareness:** verification-agent findings feed reflector
- **46-specialist ecosystem:** Team composition informed by playbooks
- **Quality gates:** playbook-curator only updates on quality-validator approval
- **Git workflow:** Templates tracked, active playbooks gitignored
- **Dual format:** JSON (machine) + Markdown (human) for accessibility

---

## Version History

**v1.0.0 (2025-10-24)**
- Initial release
- 3 template playbooks (iOS, Next.js, Universal)
- 59 seed patterns total
- Signal logging
- Cost tracking
- Work orders
- Apoptosis
- Delta updates
- Semantic de-duplication

---

## Support

**Issues:**
- Check this README first
- Check Troubleshooting section
- Review signal log: `.orchestration/signals/signal-log.jsonl`
- Review reflection reports: `.orchestration/sessions/`

**Feedback:**
- Playbooks improve through use
- Report false positives/negatives
- Suggest new patterns

---

**End of Playbook System User Guide**
