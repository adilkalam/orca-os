# Universal Orchestration Patterns

**Version:** 1.0.0
**Project Type:** Universal (applies to all project types)
**Last Updated:** 2025-10-24

This playbook contains patterns that apply across ALL project types: iOS, Next.js, Backend, Mobile, and more. These are core orchestration principles that transcend technology stacks.

---

## Legend

- **✓** Proven helpful patterns (use these)
- **✗** Harmful anti-patterns (avoid these)
- **○** Neutral patterns (context-dependent)

Each pattern includes:
- **Context**: When this pattern applies
- **Strategy**: What to do (or avoid)
- **Evidence**: Why it works/fails
- **Counts**: helpful_count / harmful_count (updated by curator)

---

## ✓ Core Orchestration Patterns

### Requirements & Planning

**✓ Requirement-Analyst First for Complex Projects**
*Pattern ID: universal-pattern-001 | Counts: 0/0*

**Context:** User requests with ambiguous scope or unclear requirements

**Strategy:** ALWAYS dispatch requirement-analyst before implementation specialists

**Evidence:** Prevents scope drift, clarifies acceptance criteria, reduces rework (template)

---

**✓ System-Architect for Multi-System Projects**
*Pattern ID: universal-pattern-005 | Counts: 0/0*

**Context:** Projects spanning frontend + backend + mobile

**Strategy:** Dispatch system-architect to design complete architecture before implementation

**Evidence:** Prevents integration issues, ensures consistent API contracts, identifies bottlenecks early (template)

---

**✓ Plan-Synthesis for Interface Validation**
*Pattern ID: universal-pattern-011 | Counts: 0/0*

**Context:** Multi-specialist tasks with interface dependencies (frontend + backend)

**Strategy:** Use plan-synthesis-agent to validate API contracts before implementation

**Evidence:** Resolves PLAN_UNCERTAINTY tags, prevents integration failures (template)

---

### Quality Gates

**✓ Verification-Agent Before Quality-Validator**
*Pattern ID: universal-pattern-002 | Counts: 0/0*

**Context:** All projects requiring quality gates

**Strategy:** Dispatch verification-agent to verify claims, then quality-validator for final gate

**Evidence:** Verification finds false completions, quality-validator ensures production readiness (template)

---

**✓ SELF_AUDIT_PROTOCOL Before Claiming Complete**
*Pattern ID: universal-pattern-010 | Counts: 0/0*

**Context:** All major implementations (3+ agents, deprecations, system changes)

**Strategy:** Run SELF_AUDIT_PROTOCOL.md 7-phase audit before marking work complete

**Evidence:** Catches systemic failures, prevents doc drift, ensures integration correctness (template)

---

**✓ Design-Reviewer MANDATORY for Production UIs**
*Pattern ID: universal-pattern-004 | Counts: 0/0*

**Context:** All user-facing applications (web, mobile, desktop)

**Strategy:** ALWAYS include design-reviewer in team composition for production releases

**Evidence:** Catches visual bugs, spacing issues, accessibility violations before users see them (template)

---

**✓ Test-Engineer for Critical Functionality**
*Pattern ID: universal-pattern-009 | Counts: 0/0*

**Context:** Projects with authentication, payments, data integrity requirements

**Strategy:** Include test-engineer to create comprehensive test suites for critical paths

**Evidence:** Prevents production bugs in high-risk areas, ensures regression coverage (template)

---

### Performance Optimization

**✓ Parallel Dispatch for Independent Tasks**
*Pattern ID: universal-pattern-003 | Counts: 0/0*

**Context:** Multiple tasks with no dependencies (UI + API, iOS + Android)

**Strategy:** Dispatch specialists in parallel using single message with multiple Task calls

**Evidence:** 40-50% faster than serial dispatch, reduces total orchestration time (template)

---

**✓ Work Orders Reduce Context Hunting**
*Pattern ID: universal-pattern-006 | Counts: 0/0*

**Context:** Large projects with complex architectural context

**Strategy:** Create .orchestration/work-orders/[task-id].md with full context before dispatching specialists

**Evidence:** Specialists waste 30-40% less tokens searching for context (template)

---

### Observability & Debugging

**✓ Signal Logging for Debugging**
*Pattern ID: universal-pattern-007 | Counts: 0/0*

**Context:** All orchestration sessions

**Strategy:** Log SESSION_START, PLAYBOOK_LOADED, SPECIALIST_DISPATCHED events to signal-log.jsonl

**Evidence:** Complete audit trail enables debugging failed sessions, pattern analysis (template)

---

**✓ Cost Tracking Identifies Expensive Specialists**
*Pattern ID: universal-pattern-008 | Counts: 0/0*

**Context:** All orchestration sessions

**Strategy:** Track tokens and cost per specialist in costs.json

**Evidence:** Identifies inefficient specialists consuming excess tokens, enables optimization (template)

---

## ✗ Anti-Patterns to Avoid

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

## ○ Context-Dependent Patterns

**○ Specialist vs Monolithic Trade-off**
*Pattern ID: universal-neutral-001 | Counts: 0/0*

**Context:** Simple single-file tasks

**Strategy:** For trivial tasks (<30 lines, 1 file), direct implementation may be faster than orchestration overhead

**Evidence:** Orchestration adds 2-3 minutes setup; beneficial when task complexity justifies it (template)

---

## How This Playbook Evolves

This template serves as the foundation for all project types. As /orca executes various projects:

1. **orchestration-reflector** analyzes cross-project patterns (what works universally)
2. **playbook-curator** updates helpful/harmful counts across all domains
3. Universal patterns with high confidence (>10 helpful) become core principles
4. Patterns that fail universally get marked for apoptosis
5. Domain-specific patterns that prove universal get promoted to this playbook

**Cross-pollination:** Patterns discovered in iOS that apply to Next.js get added here and vice versa.

**Next update:** Automatically after every 5th session (any project type)
