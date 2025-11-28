# Detail Questions: /record Command

## Q1: Should /record automatically categorize extracted learnings?

**Context:** When analyzing git history, the system could auto-categorize:
- Breaking changes → gotcha
- New patterns introduced → decision
- Bug fixes with lessons → gotcha
- Architecture changes → decision

**Default:** YES - auto-categorize with user override

**Why:** Reduces friction while maintaining user control.

---

## Q2: Should /record create Workshop standards from critical gotchas?

**Context:** `save_standard` creates enforceable rules with:
- what_happened
- cost
- rule

Some gotchas are important enough to become standards.

**Default:** NO - but suggest when severity is critical

**Why:** Standards have stronger enforcement implications. User should explicitly promote.

---

## Q3: Should /record support a "learning" type that synthesizes decision + gotcha?

**Context:** Sometimes a learning is both "we decided X" AND "watch out for Y". A combined type could capture this.

**Default:** NO - use separate entries

**Why:** Keeps the data model clean. Workshop already has clear types.

---

## Q4: How should /record handle duplicate detection?

**Context:** User might run /record multiple times. Should check recent Workshop entries.

**Options:**
- A) Check last 24 hours, warn if similar entry exists
- B) Check last 7 days, block if duplicate
- C) No duplicate checking, always record

**Default:** A - 24 hour check with warning

---

## Q5: Should /record integrate with /audit for pattern detection?

**Context:** /audit already has self-improvement analysis. /record could:
- Trigger mini pattern analysis on recorded items
- Suggest if a gotcha should become a standard based on frequency

**Default:** YES - light integration (suggest, don't auto-trigger)

**Why:** Connects human-recorded learnings to the automated improvement loop.
