# Universal Patterns Playbook

**Version:** 1.1.0
**Last Updated:** 2025-11-07T05:06:00Z
**Project Type:** universal

This playbook contains patterns that apply across all project types.

---

## Helpful Patterns (✓)

### universal-pattern-001: Requirement-Analyst First for Complex Projects
**Context:** User requests with ambiguous scope or unclear requirements
**Strategy:** ALWAYS dispatch requirement-analyst before implementation specialists
**Evidence:** Prevents scope drift, clarifies acceptance criteria, reduces rework (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-pattern-002: Verification-Agent Before Quality-Validator
**Context:** All projects requiring quality gates
**Strategy:** Dispatch verification-agent to verify claims, then quality-validator for final gate
**Evidence:** Verification finds false completions, quality-validator ensures production readiness. SEO Phase 1-4: Zero false completions through bash verification (ls, grep, wc)
**Helpful Count:** 1 | **Harmful Count:** 0
**Learned From:** seo-orca-phase-1-4-2025-11-07

---

### universal-pattern-003: Parallel Dispatch for Independent Tasks
**Context:** Multiple tasks with no dependencies (UI + API, iOS + Android)
**Strategy:** Dispatch specialists in parallel using single message with multiple Task calls
**Evidence:** 40-50% faster than serial dispatch, reduces total orchestration time (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-pattern-004: Design-Reviewer MANDATORY for Production UIs
**Context:** All user-facing applications (web, mobile, desktop)
**Strategy:** ALWAYS include design-reviewer in team composition for production releases
**Evidence:** Catches visual bugs, spacing issues, accessibility violations before users see them (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-pattern-005: System-Architect for Multi-System Projects
**Context:** Projects spanning frontend + backend + mobile
**Strategy:** Dispatch system-architect to design complete architecture before implementation
**Evidence:** Prevents integration issues, ensures consistent API contracts, identifies bottlenecks early (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-pattern-006: Work Orders Reduce Context Hunting
**Context:** Large projects with complex architectural context
**Strategy:** Create .orchestration/work-orders/[task-id].md with full context before dispatching specialists
**Evidence:** Specialists waste 30-40% less tokens searching for context (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-pattern-007: Signal Logging for Debugging
**Context:** All orchestration sessions
**Strategy:** Log SESSION_START, PLAYBOOK_LOADED, SPECIALIST_DISPATCHED events to signal-log.jsonl
**Evidence:** Complete audit trail enables debugging failed sessions, pattern analysis (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-pattern-008: Cost Tracking Identifies Expensive Specialists
**Context:** All orchestration sessions
**Strategy:** Track tokens and cost per specialist in costs.json
**Evidence:** Identifies inefficient specialists consuming excess tokens, enables optimization (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-pattern-009: Test-Engineer for Critical Functionality
**Context:** Projects with authentication, payments, data integrity requirements
**Strategy:** Include test-engineer to create comprehensive test suites for critical paths
**Evidence:** Prevents production bugs in high-risk areas, ensures regression coverage (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-pattern-010: SELF_AUDIT_PROTOCOL Before Claiming Complete
**Context:** All major implementations (3+ agents, deprecations, system changes)
**Strategy:** Run SELF_AUDIT_PROTOCOL.md 7-phase audit before marking work complete
**Evidence:** Catches systemic failures, prevents doc drift, ensures integration correctness (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-pattern-011: Plan-Synthesis for Interface Validation
**Context:** Multi-specialist tasks with interface dependencies (frontend + backend)
**Strategy:** Use plan-synthesis-agent to validate API contracts before implementation
**Evidence:** Resolves PLAN_UNCERTAINTY tags, prevents integration failures (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-pattern-012: Multi-Phase Implementation Workflow
**Context:** Complex improvements requiring multiple coordinated changes
**Strategy:** Break complex improvements into 5 phases: (1) Data Infrastructure, (2) Content Extraction/Processing, (3) Principles/Heuristics, (4) Enforcement/Validation, (5) Integration/Documentation. Implement sequentially with clear completion criteria per phase. Verify before moving to next phase. Document after implementation complete.
**Evidence:** SEO Phase 1-4: 2-3hr investment for 5-phase system avoided 4+ hrs per article. Complete execution without stopping prevents context loss and rework. Documentation after implementation eliminates drift.
**Helpful Count:** 1 | **Harmful Count:** 0
**Learned From:** seo-orca-phase-1-4-2025-11-07
**Tags:** planning, complex-systems, quality

---

### universal-pattern-013: Evidence-Based Completion Protocol
**Context:** Claiming work is complete
**Strategy:** Before claiming ANY work is complete: (1) File operations - verify with ls -lh, git diff, grep. (2) Integration points - verify with grep for imports/calls. (3) Data structures - verify with cat/jq. (4) Output quality - verify with wc/grep. (5) Documentation consistency - verify with grep counts. Never claim done without command output proving the claim.
**Evidence:** SEO Phase 1-4: Zero false completions through systematic bash verification. Command output is objective evidence preventing false confidence.
**Helpful Count:** 1 | **Harmful Count:** 0
**Learned From:** seo-orca-phase-1-4-2025-11-07
**Tags:** verification, quality, trust

---

### universal-pattern-014: Build Right First Philosophy
**Context:** Starting any new implementation or system improvement
**Strategy:** Invest upfront in proper planning and architecture. Prefer complete systems over MVPs that need rebuilding. Run quality gates even when expensive. Total cost of building right first < total cost of iteration loops.
**Evidence:** SEO Phase 1-4: 2-3hr upfront investment avoided 4+ hrs per article. First article pays back implementation cost; every subsequent article is pure gain. Quality gates prevent publication of low-clarity content requiring rework.
**Helpful Count:** 1 | **Harmful Count:** 0
**Learned From:** seo-orca-phase-1-4-2025-11-07
**Tags:** planning, quality, efficiency

---

### universal-pattern-015: Complete Execution Without Stopping
**Context:** Multi-phase work with clear requirements
**Strategy:** When user requests complete execution ('crank through all of this'), implement all phases without interruption. Context switching is expensive. Complete system is testable; partial system requires assumptions.
**Evidence:** SEO Phase 1-4: All 5 phases implemented in single session without stopping mid-flow. User instruction 'continue, no stopping, we don't want that confusion' honored. Complete system delivered ready for use.
**Helpful Count:** 1 | **Harmful Count:** 0
**Learned From:** seo-orca-phase-1-4-2025-11-07
**Tags:** workflow, efficiency, trust

---

## Anti-Patterns (✗)

### universal-antipattern-001: Skipping Verification Leads to False Completions
**Context:** All projects
**Strategy:** AVOID claiming work complete without verification-agent checking with grep/ls/bash
**Evidence:** 80% of false completions come from skipping verification step (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-antipattern-002: Serial Dispatch Wastes Time
**Context:** Independent tasks (separate UI components, parallel platform development)
**Strategy:** AVOID dispatching specialists one-by-one when tasks have no dependencies
**Evidence:** Serial dispatch takes 2x longer than parallel for independent work (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-antipattern-003: Omitting Requirement-Analyst Causes Scope Drift
**Context:** Ambiguous user requests
**Strategy:** AVOID jumping straight to implementation without clarifying requirements
**Evidence:** 60% of rework stems from unclear requirements captured upfront (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

### universal-antipattern-004: Skipping Design Review for Internal Tools
**Context:** Internal dashboards and admin UIs
**Strategy:** AVOID omitting design-reviewer for 'internal only' UIs
**Evidence:** Internal tools used daily, poor UX compounds productivity loss (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

## Neutral Patterns (○)

### universal-neutral-001: Specialist vs Monolithic Trade-off
**Context:** Simple single-file tasks
**Strategy:** For trivial tasks (<30 lines, 1 file), direct implementation may be faster than orchestration overhead
**Evidence:** Orchestration adds 2-3 minutes setup; beneficial when task complexity justifies it (template)
**Helpful Count:** 0 | **Harmful Count:** 0

---

## Summary Statistics

- **Total Patterns:** 20
  - Helpful: 15
  - Anti-patterns: 4
  - Neutral: 1
- **Patterns with Evidence:** 4 (from seo-orca-phase-1-4-2025-11-07)
- **Templates (awaiting evidence):** 16
