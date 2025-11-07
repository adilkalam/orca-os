---
description: "DEPRECATED — Use /enhance to structure questions, or ask ad‑hoc inline."
allowed-tools: [AskUserQuestion]
argument-hint: (deprecated)
---

# /survey (DEPRECATED)

This command is deprecated. Prefer:
- `/enhance` to extract the few critical questions that unblock work
- Inline AskUserQuestion with 1–3 targeted prompts if truly needed mid‑flow

**PURPOSE (old):** Convert bulk questions (5-20+) into manageable terminal Q&A batches.

**Use when (legacy):**
- Agent has many questions after review
- Need user input on multiple items
- Design decisions, feature preferences, priority rankings

**Problem this solved (legacy):**
- AskUserQuestion supports max 4 questions at once
- Asking 20 questions = overwhelming terminal UI
- Hard to navigate, easy to miss questions

**Solution (legacy):**
- Batch questions into groups of 4
- Present sequentially with progress indicator
- Collect all responses
- Return aggregated results

---

## For Agents: How to Use This Command

When you have 5+ questions to ask user, instead of calling AskUserQuestion directly:

### Step 1: Prepare Questions in JSON Format

Create a JSON array with your questions:

```json
{
  "questions": [
    {
      "id": "hero-section",
      "question": "Should the hero section use a timeline or grid layout?",
      "header": "Hero Layout",
      "options": [
        {"label": "Timeline", "description": "Horizontal timeline showing progression"},
        {"label": "Grid", "description": "Card grid with phases"},
        {"label": "Vertical", "description": "Vertical stacked timeline"}
      ]
    },
    {
      "id": "color-scheme",
      "question": "Which color emphasis do you prefer?",
      "header": "Colors",
      "options": [
        {"label": "Gold accent", "description": "Current gold (#D4AF37)"},
        {"label": "Blue accent", "description": "Professional blue"},
        {"label": "Minimal", "description": "Black/white only"}
      ]
    },
    ...
  ]
}
```

### Step 2: Write to Temp File

```bash
cat > /tmp/survey-questions.json << 'EOF'
{json from step 1}
EOF
```

### Step 3: Call Survey Command

```bash
SlashCommand("/survey")
```

The command will:
1. Read `/tmp/survey-questions.json`
2. Batch questions into groups of 4
3. Present each batch with progress indicator
4. Collect all responses
5. Write results to `/tmp/survey-responses.json`

### Step 4: Read Responses

```bash
Read /tmp/survey-responses.json
```

Results format:
```json
{
  "hero-section": "Timeline",
  "color-scheme": "Gold accent",
  ...
}
```

---

## For Users: Direct Usage

You can also use `/survey` directly by preparing questions yourself:

**Example:**
```bash
# Create questions file
cat > /tmp/survey-questions.json << 'EOF'
{
  "questions": [
    {
      "id": "framework",
      "question": "Which framework for new project?",
      "header": "Framework",
      "options": [
        {"label": "Next.js", "description": "React with SSR"},
        {"label": "Remix", "description": "Full-stack React"},
        {"label": "SvelteKit", "description": "Svelte framework"}
      ]
    }
  ]
}
EOF

# Run survey
/survey
```

---

## Implementation

### Execution Flow

**Step 1: Load Questions**

```bash
if [ ! -f /tmp/survey-questions.json ]; then
  echo "❌ Error: No questions found at /tmp/survey-questions.json"
  echo ""
  echo "Create questions file first:"
  echo "cat > /tmp/survey-questions.json << 'EOF'"
  echo '{"questions": [...]}'
  echo "EOF"
  exit 1
fi

questions=$(cat /tmp/survey-questions.json)
total_questions=$(echo "$questions" | jq '.questions | length')
```

**Step 2: Calculate Batches**

```bash
batch_size=4
num_batches=$(( (total_questions + batch_size - 1) / batch_size ))

echo "📋 Survey: $total_questions questions in $num_batches batches"
echo ""
```

**Step 3: Present Batches**

For each batch of 4 questions:

```javascript
// Batch 1: Questions 1-4
AskUserQuestion({
  questions: [
    {
      question: questions[0].question,
      header: questions[0].header + " (1/20)",  // Progress indicator
      options: questions[0].options,
      multiSelect: false
    },
    {
      question: questions[1].question,
      header: questions[1].header + " (2/20)",
      options: questions[1].options,
      multiSelect: false
    },
    {
      question: questions[2].question,
      header: questions[2].header + " (3/20)",
      options: questions[2].options,
      multiSelect: false
    },
    {
      question: questions[3].question,
      header: questions[3].header + " (4/20)",
      options: questions[3].options,
      multiSelect: false
    }
  ]
})

// Collect responses
batch1_responses = {...}

// Show progress
echo "✓ Batch 1/5 complete"
echo ""
```

**Repeat for all batches.**

**Step 4: Aggregate Results**

```javascript
// Combine all batch responses
all_responses = {
  [question_id_1]: response_1,
  [question_id_2]: response_2,
  ...
}

// Write to output file
Write("/tmp/survey-responses.json", JSON.stringify(all_responses, null, 2))
```

**Step 5: Present Summary**

```
✅ SURVEY COMPLETE

Answered: 20/20 questions

Results saved to: /tmp/survey-responses.json

Summary:
• hero-section: Timeline
• color-scheme: Gold accent
• spacing: 8px grid
• typography: GT Pantheon
...

[Full results available in /tmp/survey-responses.json]
```

---

## Advanced Features

### Multi-Select Questions

If a question allows multiple selections:

```json
{
  "id": "features",
  "question": "Which features should we prioritize?",
  "header": "Features",
  "multiSelect": true,
  "options": [
    {"label": "Dark mode", "description": "..."},
    {"label": "Search", "description": "..."},
    {"label": "Filters", "description": "..."}
  ]
}
```

Result:
```json
{
  "features": ["Dark mode", "Search"]
}
```

### Conditional Questions

Skip questions based on previous answers:

```json
{
  "id": "database",
  "question": "Which database?",
  "condition": {
    "question_id": "backend",
    "answer": "Yes"
  },
  "options": [...]
}
```

If user answered "No" to "backend" question → Skip "database" question.

### Question Groups

Organize questions into sections:

```json
{
  "sections": [
    {
      "title": "Layout Decisions",
      "questions": [...]
    },
    {
      "title": "Color & Typography",
      "questions": [...]
    }
  ]
}
```

Show section header before each batch:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SECTION 1/3: Layout Decisions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Questions 1-4]
```

---

## Example Use Cases

### Use Case 1: Design Review with 15 Decisions

**Agent (design-reviewer):**
```javascript
// After reviewing design, agent has 15 questions

questions = [
  {id: "hero-layout", question: "Hero section layout?", ...},
  {id: "nav-style", question: "Navigation style?", ...},
  // ... 13 more questions
]

Write("/tmp/survey-questions.json", questions)
SlashCommand("/survey")
responses = Read("/tmp/survey-responses.json")

// Use responses to generate final design spec
```

**User experience:**
```
📋 Survey: 15 questions in 4 batches

[Batch 1: Questions 1-4]
✓ Batch 1/4 complete

[Batch 2: Questions 5-8]
✓ Batch 2/4 complete

[Batch 3: Questions 9-12]
✓ Batch 3/4 complete

[Batch 4: Questions 13-15]
✓ Batch 4/4 complete

✅ SURVEY COMPLETE
```

### Use Case 2: Feature Prioritization

**20 potential features, need to prioritize:**

```json
{
  "questions": [
    {
      "id": "feature-1",
      "question": "Priority for dark mode?",
      "header": "Dark Mode (1/20)",
      "options": [
        {"label": "High", "description": "Build first"},
        {"label": "Medium", "description": "Build soon"},
        {"label": "Low", "description": "Build later"},
        {"label": "Skip", "description": "Don't build"}
      ]
    },
    // ... 19 more features
  ]
}
```

Result: Priority ranking for all 20 features in one session.

### Use Case 3: Onboarding Questionnaire

**New project setup with 12 configuration questions:**

```json
{
  "sections": [
    {
      "title": "Project Setup",
      "questions": [
        {id: "framework", question: "Framework?", ...},
        {id: "typescript", question: "TypeScript?", ...},
        {id: "testing", question: "Testing library?", ...}
      ]
    },
    {
      "title": "Design System",
      "questions": [
        {id: "styling", question: "Styling approach?", ...},
        {id: "components", question: "Component library?", ...}
      ]
    },
    {
      "title": "Deployment",
      "questions": [
        {id: "hosting", question: "Hosting platform?", ...},
        {id: "ci-cd", question: "CI/CD?", ...}
      ]
    }
  ]
}
```

Organized, navigable questionnaire for complex setup.

---

## Integration with Agents

### In Agent Prompts

**design-reviewer.md:**
```markdown
## After Review: Collect User Decisions

If you have 5+ questions after review:

1. Create questions in /tmp/survey-questions.json
2. Call SlashCommand("/survey")
3. Read responses from /tmp/survey-responses.json
4. Use responses to generate final spec

**Example:**
After reviewing homepage design, you have 12 decisions to make.
Instead of asking all 12 at once via AskUserQuestion:

SlashCommand("/survey")

User answers in manageable batches.
You get all 12 responses in /tmp/survey-responses.json.
```

### In /orca Workflows

**When multiple agents each have questions:**

```markdown
## Phase 7: Collect All User Decisions

After all agents complete:

1. Aggregate questions from all agents
2. Write to /tmp/survey-questions.json
3. SlashCommand("/survey")
4. Distribute responses back to agents

This prevents asking user 20 questions across 5 different agents.
Ask once, in organized batches.
```

---

## File Formats

### Input: /tmp/survey-questions.json

```json
{
  "questions": [
    {
      "id": "unique-id",
      "question": "The question text?",
      "header": "Short label (12 chars max)",
      "multiSelect": false,
      "options": [
        {
          "label": "Option 1",
          "description": "What this option means"
        },
        {
          "label": "Option 2",
          "description": "What this option means"
        }
      ]
    }
  ]
}
```

### Output: /tmp/survey-responses.json

```json
{
  "question-id-1": "Selected option label",
  "question-id-2": "Selected option label",
  "multi-select-id": ["Option 1", "Option 2"]
}
```

---

## Summary

**/survey solves bulk Q&A:**
- ✅ Batches 5-20+ questions into groups of 4
- ✅ Shows progress indicator (3/20)
- ✅ Navigable terminal UI (not overwhelming)
- ✅ Collects all responses
- ✅ Returns aggregated results

**Usage:**
```bash
# Prepare questions
cat > /tmp/survey-questions.json << 'EOF'
{"questions": [...]}
EOF

# Run survey
/survey

# Read responses
cat /tmp/survey-responses.json
```

**For agents:** Use this when you have 5+ questions after review/analysis instead of overwhelming user with bulk AskUserQuestion calls.
