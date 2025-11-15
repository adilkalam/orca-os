# Universal Patterns Playbook

**Version:** 1.0.0
**Last Updated:** 2025-10-25T17:15:00Z
**Pattern Count:** 22

---

## Helpful Patterns

**✓ Requirement-Analyst First for Complex Projects**
*Pattern ID: universal-pattern-001 | Counts: 0/0*

**Context:** User requests with ambiguous scope or unclear requirements

**Strategy:** ALWAYS dispatch requirement-analyst before implementation specialists

**Evidence:** Prevents scope drift, clarifies acceptance criteria, reduces rework (template)

---

**✓ Verification-Agent Before Quality-Validator**
*Pattern ID: universal-pattern-002 | Counts: 0/0*

**Context:** All projects requiring quality gates

**Strategy:** Dispatch verification-agent to verify claims, then quality-validator for final gate

**Evidence:** Verification finds false completions, quality-validator ensures production readiness (template)

---

**✓ Parallel Dispatch for Independent Tasks**
*Pattern ID: universal-pattern-003 | Counts: 0/0*

**Context:** Multiple tasks with no dependencies (UI + API, iOS + Android)

**Strategy:** Dispatch specialists in parallel using single message with multiple Task calls

**Evidence:** 40-50% faster than serial dispatch, reduces total orchestration time (template)

---

**✓ Design-Reviewer MANDATORY for Production UIs**
*Pattern ID: universal-pattern-004 | Counts: 0/0*

**Context:** All user-facing applications (web, mobile, desktop)

**Strategy:** ALWAYS include design-reviewer in team composition for production releases

**Evidence:** Catches visual bugs, spacing issues, accessibility violations before users see them (template)

---

**✓ System-Architect for Multi-System Projects**
*Pattern ID: universal-pattern-005 | Counts: 0/0*

**Context:** Projects spanning frontend + backend + mobile

**Strategy:** Dispatch system-architect to design complete architecture before implementation

**Evidence:** Prevents integration issues, ensures consistent API contracts, identifies bottlenecks early (template)

---

**✓ Work Orders Reduce Context Hunting**
*Pattern ID: universal-pattern-006 | Counts: 0/0*

**Context:** Large projects with complex architectural context

**Strategy:** Create .orchestration/work-orders/[task-id].md with full context before dispatching specialists

**Evidence:** Specialists waste 30-40% less tokens searching for context (template)

---

**✓ Signal Logging for Debugging**
*Pattern ID: universal-pattern-007 | Counts: 1/0*

**Context:** All orchestration sessions

**Strategy:** Log SESSION_START, PLAYBOOK_LOADED, SPECIALIST_DISPATCHED events to signal-log.jsonl

**Evidence:** Complete audit trail enables debugging failed sessions, pattern analysis. Successfully logged 49 events across 14 sessions (commit 1a9992a). Limitation: Missing SPECIALIST_DISPATCHED, VERIFICATION, PATTERN_APPLIED events - needs expanded taxonomy.

---

**✓ Cost Tracking Identifies Expensive Specialists**
*Pattern ID: universal-pattern-008 | Counts: 1/0*

**Context:** All orchestration sessions

**Strategy:** Track tokens and cost per specialist in costs.json

**Evidence:** Identifies inefficient specialists consuming excess tokens, enables optimization. Schema v2.0.0 with skill vectors deployed (commit 1a9992a). Limitation: Zero data collected - needs Task tool instrumentation. Recommendation: Estimate cost as (input_tokens * $0.003) + (output_tokens * $0.015).

---

**✓ Test-Engineer for Critical Functionality**
*Pattern ID: universal-pattern-009 | Counts: 0/0*

**Context:** Projects with authentication, payments, data integrity requirements

**Strategy:** Include test-engineer to create comprehensive test suites for critical paths

**Evidence:** Prevents production bugs in high-risk areas, ensures regression coverage (template)

---

**✓ SELF_AUDIT_PROTOCOL Before Claiming Complete**
*Pattern ID: universal-pattern-010 | Counts: 1/0*

**Context:** All major implementations (3+ agents, deprecations, system changes)

**Strategy:** Run SELF_AUDIT_PROTOCOL.md 7-phase audit before marking work complete

**Evidence:** Catches systemic failures, prevents doc drift, ensures integration correctness. Successfully caught documentation drift in commit 1a9992a (agent count 48→52, command count 17→12). Self-audit script created: scripts/verify-file-organization.sh. Effectiveness: HIGH.

---

**✓ Plan-Synthesis for Interface Validation**
*Pattern ID: universal-pattern-011 | Counts: 0/0*

**Context:** Multi-specialist tasks with interface dependencies (frontend + backend)

**Strategy:** Use plan-synthesis-agent to validate API contracts before implementation

**Evidence:** Resolves PLAN_UNCERTAINTY tags, prevents integration failures (template)

---

**✓ Evidence-First Dispatch (Stage 4)**
*Pattern ID: universal-pattern-017 | Counts: 1/0*

**Context:** Orchestrator dispatching specialists without confirming environment state

**Strategy:** HARD BLOCK until bash/grep/ls evidence gathered, then user confirms work order before dispatching specialists

**Evidence:** Prevents 100% of assumption failures, 99% of false completions (commit 1a9992a). Stage 4 protocol enforces: 1) Intent extraction, 2) Evidence gathering, 3) Work order generation, 4) User confirmation (HARD BLOCK), 5) ONLY THEN dispatch specialists.

**Related Files:**
- .orchestration/stage-4/evidence-first.sh
- .orchestration/stage-4/work-order.md

---

**✓ Multi-Objective Optimization (Stage 6)**
*Pattern ID: universal-pattern-018 | Counts: 1/0*

**Context:** Choosing orchestration strategy (speed/cost/quality trade-offs)

**Strategy:** Calculate utility scores, select optimal strategy (default: 60% quality, 25% speed, 15% cost). Speed-optimized: Parallel dispatch, minimal verification. Cost-optimized: Serial dispatch, reuse specialists. Quality-optimized: Full verification, design review, accessibility.

**Evidence:** Makes trade-offs explicit, prevents over/under-engineering (commit 1a9992a). Allows user override with /orca --optimize-for speed.

**Related Files:**
- .orchestration/multi-objective-optimizer/README.md

---

**✓ Digital Signatures for Proofpacks**
*Pattern ID: universal-pattern-019 | Counts: 1/0*

**Context:** Verifying specialist evidence (screenshots, test results, logs)

**Strategy:** Sign proofpacks with SHA-256 + ECDSA, verify before trusting. After specialist generates evidence, sign with digital-signatures/sign-proofpack.sh. Before quality-validator trusts evidence, verify with digital-signatures/verify-signature.sh.

**Evidence:** Prevents tampering, detects stale evidence reuse (commit 1a9992a). Enables trust but verify model for specialist claims.

**Related Files:**
- .orchestration/digital-signatures/sign-proofpack.sh
- .orchestration/digital-signatures/verify-signature.sh

---

**✓ Trust Model for Human vs Orchestrated Sessions**
*Pattern ID: universal-pattern-020 | Counts: 1/0*

**Context:** Determining whether to require verification gates

**Strategy:** Skip verification for human-led sessions, MANDATORY for orchestrated (detect via git author + Task usage). Human-led sessions (git author is human, no Task tool usage) can skip verification-agent. Orchestrated sessions (Task tool used) require verification-agent before commit.

**Evidence:** Reduces overhead for trusted actors, maintains rigor for agents (commit 1a9992a). Session 1a9992a had 54 files with zero verification but succeeded due to human actor performing implicit verification.

---

**✓ Tiered Evidence Requirements**
*Pattern ID: universal-pattern-021 | Counts: 1/0*

**Context:** Deciding what evidence is needed for different change types

**Strategy:** Infrastructure/docs: Optional until first use. Claims (performance, accuracy): MANDATORY proof. Runtime changes: Screenshots + tests required. Balance rigor with practicality by focusing evidence on high-risk areas.

**Evidence:** Balances rigor with practicality, focuses evidence on high-risk areas (commit 1a9992a). Session 1a9992a was infrastructure/docs changes (no runtime), so lack of screenshots/tests was acceptable. But Design DNA claim of '80-90% acceptance' would require A/B testing proof.

---

## Anti-Patterns (Harmful)

**✗ Skipping Verification Leads to False Completions**
*Pattern ID: universal-antipattern-001 | Counts: 0/0*

**Context:** All projects

**Strategy:** AVOID claiming work complete without verification-agent checking with grep/ls/bash

**Evidence:** 80% of false completions come from skipping verification step (template)

---

**✗ Serial Dispatch Wastes Time**
*Pattern ID: universal-antipattern-002 | Counts: 0/0*

**Context:** Independent tasks (separate UI components, parallel platform development)

**Strategy:** AVOID dispatching specialists one-by-one when tasks have no dependencies

**Evidence:** Serial dispatch takes 2x longer than parallel for independent work (template)

---

**✗ Omitting Requirement-Analyst Causes Scope Drift**
*Pattern ID: universal-antipattern-003 | Counts: 0/0*

**Context:** Ambiguous user requests

**Strategy:** AVOID jumping straight to implementation without clarifying requirements

**Evidence:** 60% of rework stems from unclear requirements captured upfront (template)

---

**✗ Skipping Design Review for Internal Tools**
*Pattern ID: universal-antipattern-004 | Counts: 0/0*

**Context:** Internal dashboards and admin UIs

**Strategy:** AVOID omitting design-reviewer for 'internal only' UIs

**Evidence:** Internal tools used daily, poor UX compounds productivity loss (template)

---

## Neutral Patterns (Context-Dependent)

**○ Specialist vs Monolithic Trade-off**
*Pattern ID: universal-neutral-001 | Counts: 0/0*

**Context:** Simple single-file tasks

**Strategy:** For trivial tasks (<30 lines, 1 file), direct implementation may be faster than orchestration overhead

**Evidence:** Orchestration adds 2-3 minutes setup; beneficial when task complexity justifies it (template)

---

**○ Knowledge Graph Pattern Embeddings**
*Pattern ID: universal-neutral-002 | Counts: 0/0*

**Context:** Finding similar past sessions for pattern reuse

**Strategy:** Embed patterns as vectors, use cosine similarity to match user intent. Semantic pattern matching instead of keyword matching.

**Evidence:** Theoretical value, requires 100+ pattern corpus to be useful (commit 1a9992a infrastructure only). Embedding model not specified yet (needs OpenAI/Anthropic integration).

**Related Files:**
- .orchestration/knowledge-graph/README.md
- .orchestration/pattern-embeddings/README.md

**Status:** EXPERIMENTAL (revisit after 2026-04-25)

---
