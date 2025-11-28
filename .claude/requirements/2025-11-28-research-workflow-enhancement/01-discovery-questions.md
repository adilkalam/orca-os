# Discovery Questions – Research Workflow Enhancement

These questions establish the scope and constraints for integrating Perplexity + Open Deep Research patterns.

---

## Q1: Should the research pipeline enforce hard time budgets?

Open Deep Research uses a 4.5-minute cap with 1 minute reserved for synthesis. This prevents runaway research but may truncate deep investigations.

- **Default: Yes** – Time budgets create predictable behavior and prevent infinite loops.
- **Why:** Without time limits, research can expand indefinitely. A budget forces prioritization.

---

## Q2: Should loop decisions use structured JSON schemas (like Open Deep Research) instead of agent judgment?

Open Deep Research uses: `{ shouldContinue, gaps[], nextSearchTopic, urlToSearch }`. Our current pipeline relies on the lead agent's judgment in gap_analysis.

- **Default: Yes** – Structured schemas are more predictable and auditable.
- **Why:** Agent judgment varies; schemas enforce consistency and make decisions inspectable.

---

## Q3: Should we add explicit retry limits for failed web operations?

Open Deep Research caps at 3 failed attempts before stopping. Our pipeline uses RA tags (`#RATE_LIMITED`) but doesn't enforce retry limits.

- **Default: Yes** – 3 retries then graceful degradation.
- **Why:** Unbounded retries waste time and may indicate systemic issues.

---

## Q4: Should query_type detection be mandatory in scoping, or optional?

We added query_type (academic, news, people, coding, comparison, factual) to the lead agent's scoping. Should this be required for every research task?

- **Default: Yes (mandatory)** – Query type drives format; ambiguity leads to inconsistent output.
- **Why:** Writers need this to format correctly; defaulting to "factual" when unclear is acceptable.

---

## Q5: Should the Perplexity format rules (no hedging, no header start, inline citations only) apply to ALL research output, or only standard-mode?

Deep academic reports may benefit from different formatting (e.g., section headers, formal hedging).

- **Default: Both modes** – Consistency across outputs, adapted for length/depth.
- **Why:** The core rules (no hedging, inline citations) improve all research writing.
