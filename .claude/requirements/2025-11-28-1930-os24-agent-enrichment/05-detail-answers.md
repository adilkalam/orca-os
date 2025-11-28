# Detail Answers: OS 2.4 Agent Enrichment

**Answered:** 2025-11-28

---

## Q1: Knowledge Loading
**Answer:** Inline instructions

**Impact:** Each agent prompt will include:
```markdown
## Knowledge Loading (Required)
Before starting any task, check if `.claude/agent-knowledge/{your-name}/patterns.json` exists.
If it does, read it and apply relevant patterns to your work.
```
No hook or MCP changes needed. Simple, explicit, auditable.

---

## Q2: Skill Format
**Answer:** Pure markdown

**Impact:** New skills will follow current format:
```markdown
# Skill Name

Description...

## Rules
...

## Examples
...
```
This keeps skills simple and avoids format migration debt.

---

## Q3: Agent Size
**Answer:** Depends on the agent. Be intelligent rather than rigid.

**Impact:** Target line counts will vary by agent complexity:

| Agent Type | Target Range | Rationale |
|------------|--------------|-----------|
| Grand architects | 600-800 | Complex orchestration needs depth |
| Builders | 400-600 | Primary implementation agents |
| Specialists | 300-500 | Focused domain experts |
| Reviewers/Gates | 200-400 | Validation-focused, narrower scope |
| Light orchestrators | 200-300 | Routing, minimal logic |

This is intelligent sizing — complex agents get more content, simple agents stay lean.

---

## Q4: Feedback Tracking
**Answer:** User feedback

**Impact:**
- Learning system will track user reactions:
  - Explicit: "That worked!" / "That's wrong"
  - Implicit: User continues (success) vs user complains/reverts (failure)
- Pattern promotion requires 85% success rate over 10+ occurrences
- User feedback is captured at session end (Workshop integration)

---

## Q5: Migration Approach
**Not asked due to limit, applying default:** Template + script

**Impact:**
- Create templates with insertion points for each agent type
- Script injects universal patterns (code_style, pitfalls)
- Manual review for lane-specific content
- Ensures consistency while allowing customization

---

## Summary of Technical Decisions

| Decision | Choice | Implementation |
|----------|--------|----------------|
| Knowledge loading | Inline instructions | Add to each agent prompt |
| Skill format | Pure markdown | Current format, no migration |
| Agent size | Intelligent sizing | 200-800 lines based on complexity |
| Feedback | User feedback | Workshop integration + implicit signals |
| Migration | Template + script | Automated injection, manual review |

---

## Ready for Spec Generation

All discovery and detail questions answered. Context findings complete with:
- Source material mapping
- Pattern extractions
- Learning system design
- Risk assessment with RA tags

Proceeding to generate blueprint spec.
