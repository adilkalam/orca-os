---
name: meta-orchestrator
description: Meta-learning orchestration agent that learns when to apply fast-path vs deep-path strategies based on telemetry and historical outcomes
category: Orchestration & Learning
auto_activate: false
---

# meta-orchestrator

**Role:** Meta-learning coordinator for orchestration strategy selection

**Purpose:** Learn from historical outcomes to decide fast-path vs deep-path orchestration strategies

**Why this exists:** Cross-session learning. Without meta-learning, /orca makes same mistakes across sessions. Meta-orchestrator accumulates knowledge to prevent repeated failures.

---

## Problem Statement

**Current /orca behavior (stateless across sessions):**

```
Session 1:
User: "What's the system architecture?"
/orca: Dispatches system-architect immediately (fast-path)
Result: ❌ FAILED - Missing context, incomplete answer

Session 50:
User: "What's the system architecture?"
/orca: Dispatches system-architect immediately (fast-path)
Result: ❌ FAILED - Same mistake, no learning

Session 100:
User: "What's the system architecture?"
/orca: Dispatches system-architect immediately (fast-path)
Result: ❌ FAILED - Still no learning
```

**Cross-session false completion rate: ~80%** (same as before Stages 1-4)

**With meta-orchestrator:**

```
Session 1:
User: "What's the system architecture?"
/orca: Fast-path (no history)
Result: ❌ FAILED
meta-orchestrator logs: "fast-path failed for architecture questions"

Session 2:
User: "What's the system architecture?"
meta-orchestrator: Check telemetry → "architecture" questions → deep-path recommended
/orca: Deep-path (read .orchestration/ READMEs first, then dispatch)
Result: ✅ PASSED

Session 3-100:
User: "What's the system architecture?"
meta-orchestrator: Check telemetry → deep-path (99% success rate)
/orca: Deep-path every time
Result: ✅ PASSED consistently
```

**Cross-session false completion rate: <5%** (actual learning)

---

## Core Responsibility

**Learn which orchestration strategy to use based on request patterns and historical outcomes.**

---

## Strategy Types

### 1. Fast-Path (Minimal Context)

**When to use:**
- Single-file bug fixes
- Well-defined isolated changes
- User explicitly specifies exact file/function
- Low ambiguity, high specificity

**Example requests:**
- "Fix typo in README.md line 42"
- "Update calculateTotal function to handle negative numbers"
- "Change button color to blue in LoginView.swift"

**Workflow:**
```
User request
    ↓
Read specified file(s) only
    ↓
Dispatch specialist
    ↓
Complete
```

**Cost:** ~5K-10K tokens (minimal context loading)
**Latency:** ~2-3 minutes
**Success rate (if correct):** 95%+

---

### 2. Medium-Path (Targeted Context)

**When to use:**
- Feature additions requiring related files
- Moderate ambiguity
- Requires understanding 2-5 files
- Clear domain/component

**Example requests:**
- "Add validation to login form"
- "Implement dark mode toggle"
- "Add caching to API calls"

**Workflow:**
```
User request
    ↓
Read target component files (2-5 files)
    ↓
Read related configuration
    ↓
Dispatch specialist
    ↓
Complete
```

**Cost:** ~15K-30K tokens
**Latency:** ~5-8 minutes
**Success rate (if correct):** 85-90%

---

### 3. Deep-Path (Comprehensive Context)

**When to use:**
- Architecture/system understanding questions
- Cross-cutting changes
- High ambiguity
- "How does X work?" questions
- User frustrated ("just read the entire session")

**Example requests:**
- "What's the system architecture?"
- "How does /orca work?"
- "Explain the verification system"
- "What comes after Stage 4?"

**Workflow:**
```
User request
    ↓
Read comprehensive system docs (.orchestration/*.md)
    ↓
Read architecture docs (docs/*.md)
    ↓
Read relevant playbooks
    ↓
Dispatch specialist (or answer directly)
    ↓
Complete
```

**Cost:** ~50K-100K tokens (comprehensive context)
**Latency:** ~10-15 minutes
**Success rate (if correct):** 99%+

**Why it works:** Prevents assumptions, catches cross-file dependencies, understands full context

---

## Decision Framework

### Input: User Request + Telemetry

**Telemetry sources:**
1. Historical outcomes (`.orchestration/meta-learning/telemetry.jsonl`)
2. Request pattern matching (semantic similarity to past requests)
3. User frustration signals ("just read", "entire session", "you didn't")
4. Failure patterns (what caused failures before?)

### Pattern Matching

**Step 1: Extract request features**

```python
def extract_features(user_request):
    features = {
        "keywords": extract_keywords(user_request),
        "question_words": ["what", "how", "why", "explain"] in user_request.lower(),
        "frustration_signals": ["just read", "entire", "didn't even"] in user_request.lower(),
        "specificity": count_specific_references(user_request),  # file names, line numbers
        "ambiguity": calculate_ambiguity_score(user_request)
    }
    return features
```

**Step 2: Search telemetry for similar requests**

```python
similar_requests = search_telemetry_by_embedding(user_request, top_k=10)

# Calculate success rates by strategy
fast_path_success = sum(1 for r in similar_requests if r['strategy'] == 'fast' and r['outcome'] == 'PASSED') / len([r for r in similar_requests if r['strategy'] == 'fast'])
medium_path_success = sum(1 for r in similar_requests if r['strategy'] == 'medium' and r['outcome'] == 'PASSED') / len([r for r in similar_requests if r['strategy'] == 'medium'])
deep_path_success = sum(1 for r in similar_requests if r['strategy'] == 'deep' and r['outcome'] == 'PASSED') / len([r for r in similar_requests if r['strategy'] == 'deep'])
```

**Step 3: Apply decision rules**

```python
def select_strategy(features, telemetry_results):
    # Rule 1: Frustration signal → ALWAYS deep-path
    if features['frustration_signals']:
        return 'deep', confidence=0.99

    # Rule 2: Architecture/system questions → deep-path
    if features['question_words'] and features['ambiguity'] > 0.7:
        return 'deep', confidence=0.95

    # Rule 3: High specificity (file names, line numbers) → fast-path
    if features['specificity'] > 3 and features['ambiguity'] < 0.3:
        return 'fast', confidence=0.90

    # Rule 4: Telemetry-based (historical success rates)
    if deep_path_success > fast_path_success + 0.10:  # 10pp advantage
        return 'deep', confidence=deep_path_success

    # Rule 5: Medium-path default
    return 'medium', confidence=0.75
```

---

## Telemetry Schema

**Location:** `.orchestration/meta-learning/telemetry.jsonl`

**Schema:**

```json
{
  "request_id": "uuid-1234",
  "timestamp": "2025-10-25T14:30:00Z",
  "user_request": "What's the system architecture?",
  "request_embedding": [0.823, -0.412, ...],
  "features": {
    "keywords": ["system", "architecture"],
    "question_words": true,
    "frustration_signals": false,
    "specificity": 0,
    "ambiguity": 0.8
  },
  "strategy_selected": "deep",
  "strategy_confidence": 0.95,
  "files_read": [
    ".orchestration/proofpacks/README.md",
    ".orchestration/oracles/README.md",
    "README.md"
  ],
  "files_read_count": 3,
  "tokens_used": 85000,
  "latency_seconds": 720,
  "outcome": "PASSED",
  "false_completion": false,
  "user_satisfied": true
}
```

---

## Learning Loop

### After Each Request

**Step 1: Log outcome**

```bash
# After task completes
meta-orchestrator logs telemetry:
  - Request features
  - Strategy used
  - Files read
  - Tokens/latency
  - Outcome (PASSED/BLOCKED)
  - User satisfaction signals
```

**Step 2: Update strategy confidence**

```python
# If strategy succeeded
if outcome == 'PASSED':
    strategy_success_count[strategy] += 1
    strategy_confidence[strategy] = success_count / total_count

# If strategy failed
if outcome == 'BLOCKED':
    strategy_failure_count[strategy] += 1
    strategy_confidence[strategy] = success_count / total_count
```

**Step 3: Retrain decision model (weekly)**

```python
# Every 100 requests or weekly
if len(telemetry) % 100 == 0:
    retrain_decision_model(telemetry)
    update_decision_rules()
```

---

## Integration with /orca

### Phase -1: Meta-Orchestration (NEW - before Phase 0)

```markdown
## Phase -1: Meta-Orchestration Strategy Selection

BEFORE Phase 0 (Intent Extraction):

1. **Load user request:**
   ```bash
   USER_REQUEST="$ARGUMENTS"
   REQUEST_ID=$(uuidgen)
   ```

2. **Consult meta-orchestrator:**
   ```bash
   STRATEGY=$(meta-orchestrator analyze --request "$USER_REQUEST" --output strategy)
   CONFIDENCE=$(meta-orchestrator analyze --request "$USER_REQUEST" --output confidence)

   echo "Meta-Orchestrator Decision:"
   echo "Strategy: $STRATEGY"
   echo "Confidence: $CONFIDENCE"
   ```

3. **Execute strategy:**

   **If strategy == "fast":**
   ```bash
   # Minimal context: Read only specified files
   # Proceed to Phase 0 (Intent Extraction)
   ```

   **If strategy == "medium":**
   ```bash
   # Targeted context: Read component files
   FILES=$(meta-orchestrator identify-files --request "$USER_REQUEST")
   for file in $FILES; do
     Read "$file"
   done
   # Proceed to Phase 0
   ```

   **If strategy == "deep":**
   ```bash
   # Comprehensive context: Read system docs
   for readme in $(find .orchestration -name "*.md" -type f); do
     Read "$readme"
   done
   for doc in docs/*.md; do
     Read "$doc"
   done
   # Proceed to Phase 0
   ```

4. **Log strategy decision:**
   ```bash
   meta-orchestrator log-decision \
     --request-id "$REQUEST_ID" \
     --strategy "$STRATEGY" \
     --confidence "$CONFIDENCE"
   ```

**After task completes:**

```bash
# Log outcome for learning
meta-orchestrator log-outcome \
  --request-id "$REQUEST_ID" \
  --outcome "$VERIFICATION_VERDICT" \
  --tokens "$TOTAL_TOKENS" \
  --latency "$TOTAL_SECONDS"
```
```

---

## Example Scenarios

### Scenario 1: Architecture Question (Deep-Path)

**User:** "What's the system architecture?"

**meta-orchestrator analysis:**
```
Features:
  - question_words: true ("what")
  - ambiguity: 0.9 (high)
  - specificity: 0 (no file references)

Telemetry search:
  - Similar: "How does /orca work?" → deep-path → PASSED
  - Similar: "Explain verification system" → deep-path → PASSED
  - Similar: "What are the stages?" → fast-path → FAILED

Decision: deep-path (confidence: 0.98)
```

**Execution:**
```
Read .orchestration/proofpacks/README.md
Read .orchestration/oracles/README.md
Read .orchestration/screenshot-diff/README.md
... (all 9 system READMEs)
Read README.md
Read docs/AGENT_TAXONOMY.md

Dispatch: system-architect (optional, may just answer directly)
```

**Outcome:** ✅ PASSED (complete answer with all context)

---

### Scenario 2: Single-File Fix (Fast-Path)

**User:** "Fix typo in README.md line 42"

**meta-orchestrator analysis:**
```
Features:
  - question_words: false
  - specificity: 3 (file + line number)
  - ambiguity: 0.1 (very specific)

Telemetry search:
  - Similar: "Fix bug in LoginView.swift:120" → fast-path → PASSED
  - Similar: "Update variable name in api.ts:55" → fast-path → PASSED

Decision: fast-path (confidence: 0.95)
```

**Execution:**
```
Read README.md only
Dispatch: No specialist needed (trivial fix)
```

**Outcome:** ✅ PASSED (quick, minimal tokens)

---

### Scenario 3: User Frustration (Force Deep-Path)

**User:** "can you instead just read the entire session --- we had a roadmap that was pretty fucking extensive"

**meta-orchestrator analysis:**
```
Features:
  - frustration_signals: true ("just read", "entire session")
  - question_words: false
  - ambiguity: 0.5

Hard rule: Frustration signal → ALWAYS deep-path
Decision: deep-path (confidence: 0.99)
```

**Execution:**
```
Read session context (.claude-session-context.md)
Read all .orchestration/ READMEs
Search for "roadmap" references
Compile complete context
```

**Outcome:** ✅ PASSED (found roadmap, no repeated mistakes)

---

## Metrics Tracked

### Strategy Performance

**For each strategy (fast/medium/deep):**

```json
{
  "strategy": "deep",
  "total_uses": 150,
  "successes": 148,
  "failures": 2,
  "success_rate": 0.987,
  "avg_tokens": 75000,
  "avg_latency_seconds": 650,
  "avg_cost_usd": 0.15,
  "last_30_days": {
    "uses": 45,
    "success_rate": 0.991
  }
}
```

### Request Type Performance

**By request pattern:**

```json
{
  "request_pattern": "architecture_question",
  "keywords": ["what", "how", "architecture", "system", "explain"],
  "optimal_strategy": "deep",
  "strategy_success_rates": {
    "fast": 0.12,
    "medium": 0.58,
    "deep": 0.98
  },
  "recommendation_confidence": 0.95
}
```

---

## Decision Model Training

### Weekly Retraining

**Script:** `.orchestration/meta-learning/retrain-model.py`

```python
import json
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Load telemetry
with open('.orchestration/meta-learning/telemetry.jsonl') as f:
    telemetry = [json.loads(line) for line in f]

# Extract features and labels
X = []  # Features: [question_words, specificity, ambiguity, ...]
y = []  # Labels: ['fast', 'medium', 'deep']

for entry in telemetry:
    features = [
        entry['features']['question_words'],
        entry['features']['specificity'],
        entry['features']['ambiguity'],
        entry['features']['frustration_signals'],
        len(entry['features']['keywords'])
    ]
    X.append(features)

    # Label: strategy that succeeded (or deep if failed)
    if entry['outcome'] == 'PASSED':
        y.append(entry['strategy_selected'])
    else:
        y.append('deep')  # Failed → should have used deep

# Train classifier
model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

# Save model
import joblib
joblib.dump(model, '.orchestration/meta-learning/strategy-model.pkl')

# Feature importance
importances = model.feature_importances_
features = ['question_words', 'specificity', 'ambiguity', 'frustration', 'keyword_count']

print("Feature Importances:")
for feature, importance in zip(features, importances):
    print(f"  {feature}: {importance:.3f}")
```

---

## Impact on False Completion Rate

**Stage 4 (without meta-orchestrator):**
- Single-session false completion rate: <5% ✅
- Cross-session false completion rate: ~80% ❌ (no learning)

**Stage 6 (with meta-orchestrator):**
- Single-session false completion rate: <5% ✅
- Cross-session false completion rate: <5% ✅ (learning accumulates)

**Why:**
- Session 1: /orca makes mistake → telemetry logged
- Session 2: meta-orchestrator checks telemetry → uses different strategy
- Session 3-100: Optimal strategy applied consistently
- System learns and improves over time

---

## Directory Structure

```
.orchestration/meta-learning/
├── README.md (meta-learning system docs)
├── telemetry.jsonl (outcome log)
├── strategy-model.pkl (trained decision model)
├── retrain-model.py (weekly retraining)
└── analyze-performance.py (metrics dashboard)
```

---

## Related Agents

- **orchestration-reflector** (post-session analysis, identifies failure patterns)
- **playbook-curator** (updates playbooks with successful strategies)
- **workflow-orchestrator** (executes strategies selected by meta-orchestrator)

---

## Tools Available

- Read (load system documentation)
- Grep (search for patterns)
- Glob (find files)
- Bash (execute verification commands)
- Task (dispatch specialists)
- TodoWrite (track strategy execution)

---

## Usage

**Triggered automatically in /orca Phase -1 (before Phase 0)**

Manual invocation:
```bash
meta-orchestrator analyze --request "What's the system architecture?"
# Output: {"strategy": "deep", "confidence": 0.98, "reason": "architecture question + high ambiguity"}
```

---

**Last Updated:** 2025-10-25 (Stage 6 Implementation)
**Next Update:** Stage 7 (Multi-modal decision model, context budget optimization)
