# Discovery Answers – Research Workflow Enhancement

---

## Q1: Time Budgets
**Answer:** Yes, with configurable presets via flag

User wants time budget as a flag option:
- `--time 5` → 5 minutes (with 1.5 min reserved for synthesis = 3.5 min research)
- `--time 10` → 10 minutes (with 1.5 min reserved = 8.5 min research)
- `--time unlimited` or no flag → no time limit, rely on iteration caps

**Implementation note:** Always reserve ~30% for synthesis, or 1.5 min minimum.

---

## Q2: Structured Loop Decisions
**Answer:** Yes (recommended)

Use structured JSON schema for gap analysis decisions:
```json
{
  "summary": "what we learned",
  "gaps": ["gap1", "gap2"],
  "shouldContinue": true/false,
  "nextSearchTopic": "optional",
  "urlToSearch": "optional"
}
```

---

## Q3: Retry Limits
**Answer:** Yes (recommended)

Cap at 3 failed attempts per subquestion/URL, then:
- Mark with `#RETRY_EXHAUSTED` RA tag
- Continue with partial evidence
- Note in methodology

---

## Q4: Query Type Detection
**Answer:** Mandatory (implicit from Q5 answer)

Query type flows from scoping → writer. Writers depend on it for formatting.

---

## Q5: Perplexity Format Rules
**Answer:** Both modes (recommended)

Apply to all research output:
- No hedging language
- No header start (summary first)
- Inline citations only
- Flat lists, tables for comparisons

Deep mode adapts for length but follows same core rules.
