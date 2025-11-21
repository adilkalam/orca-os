# Policy Anchors (Agent Operating Rules)

- Orchestrator never implements: workflow-orchestrator coordinates, specialists implement.
- Evidence over claims: all work must pass `/finalize` to produce `.verified` before commit/push.
- Zero-Tag Gate: `.orchestration/implementation-log.md` must include tags (#FILE_CREATED, #FILE_MODIFIED, #COMPLETION_DRIVE, #PATH_DECISION, #SCREENSHOT_CLAIMED). Visual work requires a screenshot or explicit CANNOT_CAPTURE_SECURITY_POLICY.
- Design gating: When `.claude/design-dna` exists, run UI guard. Phase 2 is warn-only; stricter enforcement can be enabled later.
- Escalation triggers: unresolved `#PLAN_UNCERTAINTY`, cross-domain file touches, build/test failures, explicit `#COMPLEXITY_EXCEEDED`.
- File organization: evidence → `.orchestration/evidence/`, logs → `.orchestration/logs/`, docs → `docs/`.
- I/O contracts required: every specialist documents Inputs, Outputs, Acceptance, Self-checks.
- Quality pipeline: verification-agent → testing specialists → UI tests/AX → design-reviewer → quality-validator.

These anchors are shared expectations across all agents; reference them in each agent’s “I/O Contract”.
