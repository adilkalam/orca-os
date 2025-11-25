# Response Awareness in Vibe Code OS 2.2

**Purpose:** Provide a light-weight, OS 2.2–native way to use Response Awareness ideas (metacognitive tags, planning modes) without introducing a separate orchestrator.

This doc defines:
- A small set of **RA tags** agents may use.
- How tags are recorded in requirements/specs.
- How tags can be surfaced via `vibe.db.events` in the future.

---

## 1. Tag Taxonomy

Agents MAY annotate text (requirements, findings, implementation summaries) with
inline tags to mark notable cognitive patterns or decisions:

- `#PATH_DECISION:` – multiple viable implementation paths considered; this marks the chosen path and, ideally, hints at alternatives.
- `#COMPLETION_DRIVE:` – the model filled in plausible content where real information was missing (assumption rather than observed fact).
- `#CARGO_CULT:` – pattern-matching from past examples is adding unrequested features or complexity.
- `#CONTEXT_DEGRADED:` – earlier specifics are no longer reliably retrievable; any reconstruction is “best effort”.
- `#POISON_PATH:` – particular terminology or framing is biasing solutions toward a known-bad pattern.
- `#RESOLUTION_PRESSURE:` – generation strongly “wants” to tie things off; risk of prematurely declaring work “done”.

These tags are **signals**, not verdicts. They should be used sparingly and only
when they genuinely help future readers (including future agents).

---

## 2. Where Tags Can Appear

The primary places to use RA tags are:

- Requirements docs:
  - `03-context-findings.md`
  - `06-requirements-spec.md`
- Implementation summaries:
  - Webdev/Expo implementation summaries (Phase 4 / 4b).
- Verification / gate reports:
  - When standards/QA detect suspicious patterns worth encoding.

Examples:

```markdown
## Patterns to Follow

- Extend existing `ProfileCard` component for new avatar state.
- Avoid duplicating card layout:
  #PATH_DECISION: We considered a new standalone component but chose to extend `ProfileCard` to keep UX consistent.
```

```markdown
### Assumptions

- #COMPLETION_DRIVE: We assumed “export to CSV” should mirror the existing PDF export filters, but this was not explicitly confirmed.
```

---

## 3. Memory Integration (vibe.db)

The `vibe.db` schema includes an `events` table that can be used to store RA-related
metadata (see `docs/memory/vibe-memory-v2-architecture-2025-11-16.md`).

Recommended pattern:

- When a requirement or implementation uses a significant RA tag:
  - Optionally insert an `events` row with:
    - `type`: `"ra_tag"`.
    - `data`: JSON containing:
      - `tag`: tag name (e.g. `"PATH_DECISION"`).
      - `location`: file/path within the repo (e.g. `requirements/.../06-requirements-spec.md`).
      - `requirement_id` or `task_id`.
      - `note`: short description of what was marked.

In the current OS 2.2 implementation, this insertion is **conceptual**; scripts or
future MCP tools (e.g. a `vibe-memory` server) can adopt this convention to make
RA tags searchable and actionable.

---

## 4. Interaction with Pipelines

Pipelines and agents can treat RA tags as hints:

- Requirements lane:
  - `#PATH_DECISION` marks important architectural choices in `03-context-findings.md` or `06-requirements-spec.md`.
  - `#COMPLETION_DRIVE` in assumptions highlights items that should be re-validated before heavy implementation.

- Domain pipelines (webdev, expo, ios, etc.):
  - Architect and builder agents should:
    - Read any RA-tagged sections in the spec before planning/implementing.
    - Call out these tags in their own summaries (“this area carries #COMPLETION_DRIVE – verify during QA”).

- Standards/QA gates:
  - May raise gate strictness or add follow-up tasks when RA tags highlight riskier areas.

Response Awareness is **optional** and **lightweight**: it should help focus attention
where it matters most, without becoming noisy or blocking.

