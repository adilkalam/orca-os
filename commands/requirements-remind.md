---
description: "Remind the model of OS 2.0 requirements gathering rules"
allowed-tools: ["Read"]
---

# /requirements-remind – Requirements Reminder

Use this when the conversation drifts away from requirements gathering into implementation or open-ended discussion.

---

## Behavior

1. Check `requirements/.current-requirement`:
   - If none, say: `No active requirements session. Start one with /requirements-start.`
   - If present:
     - Load `metadata.json` to determine current phase (`discovery`, `context`, `detail`, `spec`).

2. Print a concise reminder of phase-specific rules, for example:

- **Discovery Phase:**
  - Only ask high-level yes/no questions (with defaults).
  - Ask one question at a time.
  - Focus on user goals and workflows, not code.
  - Write all questions to file before recording answers.

- **Context Phase:**
  - No user questions; analyze code and docs autonomously.
  - Document findings in `03-context-findings.md`.

- **Detail Phase:**
  - Ask expert-level yes/no questions tied to concrete files/patterns.
  - Still no implementation.

3. Reinforce global rules:
   - No implementation during requirements gathering.
   - No open-ended “what/how/why” questions; rephrase as yes/no with defaults.
   - Keep answers short and focused on requirements.

