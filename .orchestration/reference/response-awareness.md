# Response Awareness (Meta-Cognitive Protocol)

Use response-awareness tags to prevent completion drift and force explicit verification where generation tends to fill gaps.

Tags (prefix in output):
- `#COMPLETION_DRIVE:` when the generator is filling gaps with plausible content instead of marking uncertainty
- `#CARGO_CULT:` when unrequested patterns/features leak in from associations
- `#CONTEXT_DEGRADED:` when earlier specifics can’t be recalled precisely
- `#PATH_DECISION:` when multiple valid paths exist; record the options and rationale
- `#POISON_PATH:` when terminology or framing biases toward suboptimal patterns
- `#RESOLUTION_PRESSURE:` when bias to conclude rises with response length

Workflow Phases:
1) Survey (optional) — only for large/unknown codebases
2) Parallel Planning — multiple specialists explore options concurrently; document `#PATH_DECISION`
3) Synthesis — select paths across domains; produce blueprint
4) Implementation — execute strictly against blueprint; mark assumptions with tags
5) Verification — resolve all tags via tests, evidence, or user-confirmed decisions
6) Final Synthesis — summarize outcomes and remaining suggestions

Rules:
- Never dismiss a tag; Phase 5 must resolve every tag deterministically.
- The orchestrator holds the full plan; implementers get focused chunks with zero plan mutation.
- Prefer parallel over sequential thinking to avoid momentum bias.

