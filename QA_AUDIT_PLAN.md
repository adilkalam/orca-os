# Comprehensive QA Audit Plan

**Goal:** Full-day systematic audit of all tooling, agents, commands, and workflows

**Timeline:** 4-8 hours of execution time
**Output:** Detailed audit report with pass/fail for every component

---

## Phase 1: Command Validation (2-3 hours)

Test each of the 13 commands individually to verify:
- Command exists and is accessible
- Description matches actual behavior
- Arguments work as documented
- Error handling is graceful
- Output is as expected

### Tests per Command

#### Core Orchestration Commands

**Test 1.1: /orca**
- [ ] Command loads without errors
- [ ] Detects project type correctly (test in iOS, Next.js, Python projects)
- [ ] Dispatches correct agent team based on project
- [ ] Creates `.orchestration/` directory structure
- [ ] Writes `user-request.md` with verbatim user input
- [ ] Dispatches agents in parallel when appropriate
- [ ] Collects evidence from agents
- [ ] quality-validator runs final verification
- [ ] Quality gates enforce thresholds (95%, 80%, 85%)
- [ ] Blocks incomplete work from being presented
- [ ] Context flows from user → orchestrator → agents → validator
- [ ] Memory persists across agent handoffs

**Test 1.2: /enhance**
- [ ] Command loads without errors
- [ ] Transforms vague requests into structured prompts
- [ ] Selects appropriate agents based on intent
- [ ] Executes tasks with proper context
- [ ] Provides evidence when needed
- [ ] Works with --debug flag (if applicable)
- [ ] Context from user request flows to implementation

**Test 1.3: /ultra-think**
- [ ] Command loads without errors
- [ ] Performs deep analysis without code changes
- [ ] Multi-dimensional thinking is evident
- [ ] Provides concrete recommendations
- [ ] Does NOT dispatch implementation agents
- [ ] Works as pure reasoning/analysis tool

#### Design Workflow Commands

**Test 1.4: /concept**
- [ ] Command loads without errors
- [ ] Studies provided reference examples
- [ ] Extracts design patterns correctly
- [ ] Brainstorms approaches
- [ ] Requires approval BEFORE building
- [ ] Uses exit_plan_mode correctly
- [ ] Context from references flows to pattern extraction

**Test 1.5: /design**
- [ ] Command loads without errors
- [ ] Conversational design brainstorming works
- [ ] Accepts user-provided references
- [ ] Establishes design system baseline
- [ ] Handles --list, --clear, --remove arguments
- [ ] Stores design principles persistently
- [ ] Memory of past design decisions persists

**Test 1.6: /inspire**
- [ ] Command loads without errors
- [ ] Analyzes design examples
- [ ] Categories work correctly (protocols, landing, components, interactions)
- [ ] Develops aesthetic taste (trackable output)
- [ ] Provides actionable design insights

**Test 1.7: /save-inspiration**
- [ ] Command loads without errors
- [ ] Saves design examples to personal gallery
- [ ] Tags examples correctly
- [ ] Vision analysis extracts design patterns
- [ ] Stored examples are retrievable later
- [ ] Memory persists in `.design-memory/` or similar

**Test 1.8: /visual-review**
- [ ] Command loads without errors
- [ ] Accepts page URLs correctly
- [ ] Uses chrome-devtools MCP if available
- [ ] Takes screenshots of UI
- [ ] Analyzes screenshots with vision
- [ ] Identifies visual issues
- [ ] Provides actionable feedback

#### Workflow & Utility Commands

**Test 1.9: /agentfeedback**
- [ ] Command loads without errors
- [ ] Parses feedback into actionable points
- [ ] Dispatches appropriate agents for each point
- [ ] Orchestrates fixes systematically
- [ ] --learn flag extracts design rules
- [ ] Learned rules prevent repeated mistakes
- [ ] Context from feedback flows to agents

**Test 1.10: /clarify**
- [ ] Command loads without errors
- [ ] Provides focused clarification
- [ ] Does NOT trigger full orchestration
- [ ] Quick mid-workflow questions work
- [ ] Uses AskUserQuestion appropriately

**Test 1.11: /session-save**
- [ ] Command loads without errors
- [ ] Saves current session context
- [ ] Context is written to file
- [ ] File location is documented
- [ ] Saved context is readable

**Test 1.12: /session-resume**
- [ ] Command loads without errors
- [ ] Loads previously saved context
- [ ] Context restoration works correctly
- [ ] Auto-load via SessionStart hook works
- [ ] Manual invocation works when auto-load fails

**Test 1.13: /all-tools**
- [ ] Command loads without errors
- [ ] Lists all available tools
- [ ] Utility function works as expected

---

## Phase 2: Agent Orchestration Validation (2-3 hours)

Test that the right agents are dispatched for specific workflows.

### Tests per Workflow

**Test 2.1: iOS Feature Implementation**
- [ ] Auto-detect iOS project (*.xcodeproj)
- [ ] Load iOS agent team: ios-engineer, design-engineer
- [ ] /orca dispatches system-architect for planning
- [ ] ios-engineer handles Swift/SwiftUI implementation
- [ ] test-engineer writes XCTest suite
- [ ] quality-validator verifies with iOS Simulator screenshots
- [ ] Evidence: screenshots, build logs, test output

**Test 2.2: Next.js Feature Implementation**
- [ ] Auto-detect Next.js project (package.json + "next")
- [ ] Load frontend team: frontend-engineer, design-engineer
- [ ] /orca dispatches system-architect for architecture
- [ ] frontend-engineer handles React/Next.js implementation
- [ ] test-engineer writes Jest/Cypress tests
- [ ] quality-validator verifies with browser screenshots
- [ ] Evidence: screenshots, test output, build logs

**Test 2.3: Python API Implementation**
- [ ] Auto-detect Python project (requirements.txt)
- [ ] Load backend team: backend-engineer, test-engineer
- [ ] /orca dispatches system-architect for API design
- [ ] backend-engineer implements endpoints
- [ ] test-engineer writes pytest suite
- [ ] quality-validator verifies with API tests
- [ ] Evidence: test output, API responses, build logs

**Test 2.4: Design Exploration Workflow**
- [ ] /concept triggers design exploration
- [ ] design-engineer studies references
- [ ] Pattern extraction happens correctly
- [ ] Approval required before implementation
- [ ] After approval, /orca dispatches implementation agents
- [ ] Context from exploration flows to implementation

**Test 2.5: Bug Fix Workflow**
- [ ] Simple bug description triggers appropriate agent
- [ ] Agent investigates and identifies root cause
- [ ] Fix is implemented
- [ ] test-engineer adds regression test
- [ ] quality-validator verifies fix with evidence
- [ ] Evidence: before/after comparison

**Test 2.6: Performance Investigation**
- [ ] /ultra-think analyzes performance issue
- [ ] Identifies bottlenecks without code changes
- [ ] Provides recommendations
- [ ] If user approves, /orca implements optimizations
- [ ] test-engineer benchmarks improvements
- [ ] Evidence: before/after performance metrics

**Test 2.7: Iterative Feedback Loop**
- [ ] Work completed by agents
- [ ] /agentfeedback parses user feedback
- [ ] Appropriate agents dispatched for fixes
- [ ] /agentfeedback --learn extracts rules
- [ ] Rules stored and prevent future mistakes
- [ ] Memory of rules persists across sessions

---

## Phase 3: Context/Memory Flow Validation (1-2 hours)

Test that information flows correctly through the system.

### Tests per Context Flow

**Test 3.1: User Request → Orchestrator → Agents**
- [ ] User's exact words saved to `.orchestration/user-request.md`
- [ ] Orchestrator reads user request before decisions
- [ ] Agents receive full context from orchestrator
- [ ] Agents reference user's words, not interpretations
- [ ] User perspective maintained throughout

**Test 3.2: Agent → Evidence Collection → Validator**
- [ ] Agents produce work
- [ ] Evidence automatically collected (screenshots, tests, logs)
- [ ] Evidence stored in `.orchestration/evidence/`
- [ ] quality-validator reads evidence
- [ ] Validator verifies against requirements

**Test 3.3: Session Context Persistence**
- [ ] /session-save captures current state
- [ ] State written to `.claude-session-context.md`
- [ ] /session-resume loads state correctly
- [ ] SessionStart hook auto-loads on new session
- [ ] Context available across sessions

**Test 3.4: Design Memory Persistence**
- [ ] /save-inspiration saves to `.design-memory/`
- [ ] /design stores design principles
- [ ] /agentfeedback --learn stores rules
- [ ] Stored patterns retrievable in future sessions
- [ ] Memory influences future design decisions

**Test 3.5: Project Type Detection → Agent Team Loading**
- [ ] SessionStart hook runs detect-project-type.sh
- [ ] Project type detected (< 50ms)
- [ ] Appropriate agent team loaded
- [ ] Context written to `.claude-orchestration-context.md`
- [ ] Available to all commands in session

**Test 3.6: Quality Gate Enforcement**
- [ ] Quality Gate 1 (Planning): 95% threshold enforced
- [ ] If < 95%, loop back with feedback
- [ ] Quality Gate 2 (Implementation): 80% threshold enforced
- [ ] If < 80%, re-dispatch agents
- [ ] Quality Gate 3 (Production): 85% threshold enforced
- [ ] If < 85%, block presentation to user
- [ ] No partial work presented

---

## Phase 4: Integration Testing (1-2 hours)

Test that all components work together seamlessly.

### Integration Tests

**Test 4.1: Full /orca Workflow**
- [ ] Run /orca "Add authentication to the app"
- [ ] Verify entire flow: detection → planning → implementation → validation
- [ ] Check all agents dispatched correctly
- [ ] Verify evidence collection
- [ ] Confirm quality gates enforced
- [ ] Validate final output has proof

**Test 4.2: Design Workflow Integration**
- [ ] Run /concept "Dashboard with analytics"
- [ ] Approve design exploration
- [ ] Run /orca to implement approved design
- [ ] Verify context flows from concept → implementation
- [ ] Run /visual-review on result
- [ ] Provide feedback via /agentfeedback
- [ ] Verify fixes applied

**Test 4.3: Multi-Project Type Testing**
- [ ] Test in iOS project
- [ ] Test in Next.js project
- [ ] Test in Python project
- [ ] Test in unknown project
- [ ] Verify correct agent teams loaded each time
- [ ] Verify appropriate evidence collected per type

**Test 4.4: Hook + Command Integration**
- [ ] SessionStart hook detects project
- [ ] /orca uses detected project context
- [ ] /enhance uses detected project context
- [ ] Commands work without hook (fallback)
- [ ] Commands work with wrong detection (override)

**Test 4.5: Error Handling**
- [ ] Commands handle missing arguments gracefully
- [ ] Agents handle missing files gracefully
- [ ] Quality gates handle missing evidence
- [ ] System recovers from agent failures
- [ ] User gets helpful error messages

---

## Phase 5: Documentation Validation (1 hour)

Verify documentation matches reality.

### Documentation Tests

**Test 5.1: README.md Accuracy**
- [ ] All 12 agents listed actually exist
- [ ] All 13 commands listed actually work
- [ ] Installation instructions work on fresh system
- [ ] Examples in README are reproducible
- [ ] ASCII diagrams reflect actual flow
- [ ] Project structure matches actual files

**Test 5.2: QUICK_REFERENCE.md Accuracy**
- [ ] Agent descriptions match actual capabilities
- [ ] Command descriptions match actual behavior
- [ ] Suggested teams match auto-detection
- [ ] Workflows are reproducible
- [ ] Decision tree leads to correct commands
- [ ] File locations are correct

**Test 5.3: Agent Markdown Files**
- [ ] Each agent's description matches behavior
- [ ] Tools listed match allowed-tools
- [ ] Auto_activate keywords work correctly
- [ ] Specialization accurately describes focus
- [ ] Complexity ratings are appropriate

**Test 5.4: Command Markdown Files**
- [ ] Description matches actual behavior
- [ ] allowed-tools are actually used
- [ ] argument-hint reflects actual arguments
- [ ] Examples work as documented

---

## QA Execution Strategy

### Automated Testing (Where Possible)
```bash
# Script to test command existence
for cmd in orca enhance ultra-think concept design inspire save-inspiration visual-review agentfeedback clarify session-save session-resume all-tools; do
  echo "Testing /$cmd..."
  # Test command exists and loads
done

# Script to test agent existence
for agent in agents/implementation/*.md agents/planning/*.md agents/quality/*.md agents/specialized/*.md agents/orchestration/*.md; do
  echo "Testing $agent..."
  # Validate frontmatter
  # Check file exists in ~/.claude/agents/
done

# Script to test hook
bash hooks/detect-project-type.sh
# Verify output format
# Verify project types detected correctly
```

### Manual Testing (Required)
1. **Real Workflows**: Actually run commands in real projects
2. **Agent Dispatching**: Verify correct agents execute
3. **Context Flow**: Check information passes correctly
4. **Evidence Collection**: Verify screenshots, logs, tests collected
5. **Quality Gates**: Confirm blocking behavior works
6. **User Experience**: Is it actually helpful?

### Test Projects Setup
Create minimal test projects for each type:
```bash
# iOS test project
mkdir -p test-projects/ios-test
cd test-projects/ios-test
# Create minimal *.xcodeproj

# Next.js test project
mkdir -p test-projects/nextjs-test
cd test-projects/nextjs-test
npx create-next-app@latest . --typescript --tailwind --app

# Python test project
mkdir -p test-projects/python-test
cd test-projects/python-test
touch requirements.txt
# Add Flask/FastAPI

# Unknown test project
mkdir -p test-projects/unknown-test
cd test-projects/unknown-test
# Just a README
```

---

## Phase 6: Conflicts & Contradictions Audit (1-2 hours)

**Critical:** Identify where the system contradicts itself or has competing ideas.

### Tests for Conflicts

**Test 6.1: Agent Role Conflicts**
- [ ] Do any agents have overlapping responsibilities?
- [ ] Is it clear which agent handles what?
- [ ] Example: frontend-engineer vs design-engineer for UI work
- [ ] Are there gaps where no agent owns a responsibility?
- [ ] Document role boundaries clearly

**Test 6.2: Command Overlap & Competition**
- [ ] Do multiple commands do similar things?
- [ ] Example: /orca vs /enhance - when to use which?
- [ ] Is there clear guidance on command selection?
- [ ] Are there tasks that have multiple valid command paths?
- [ ] Decision tree in QUICK_REFERENCE resolves ambiguity?

**Test 6.3: Documentation Contradictions**
- [ ] README.md vs QUICK_REFERENCE.md consistency
- [ ] Agent markdown vs actual agent behavior
- [ ] Command markdown vs actual command behavior
- [ ] Installation instructions match across docs
- [ ] Workflow examples consistent across docs
- [ ] File paths consistent (e.g., .orchestration/ vs .design-memory/)

**Test 6.4: Quality Gate Contradictions**
- [ ] All docs agree on thresholds: 95%, 80%, 85%
- [ ] quality-validator enforces documented thresholds
- [ ] workflow-orchestrator uses same thresholds
- [ ] /orca command uses same thresholds
- [ ] No conflicting quality requirements

**Test 6.5: Context Flow Contradictions**
- [ ] All agents expect same context format
- [ ] File-based coordination consistent (.orchestration/)
- [ ] Session context vs orchestration context - clear separation?
- [ ] Design memory vs orchestration memory - when to use which?
- [ ] No competing memory systems causing confusion

**Test 6.6: Evidence Collection Contradictions**
- [ ] All agents know where to put evidence
- [ ] quality-validator knows where to find evidence
- [ ] Evidence requirements consistent across project types
- [ ] No conflicting evidence formats
- [ ] Clear what counts as evidence vs what doesn't

**Test 6.7: Workflow Contradictions**
- [ ] Step-by-step workflows don't conflict
- [ ] Agent dispatch order makes sense
- [ ] No circular dependencies
- [ ] Quality gates in right order
- [ ] No "do A before B" vs "do B before A" conflicts

**Test 6.8: Project Type Detection Conflicts**
- [ ] Hook detects project types consistently
- [ ] Agent teams match project types correctly
- [ ] No ambiguous project types (e.g., Next.js with Python backend)
- [ ] Override mechanism works when detection is wrong
- [ ] Fallback to "unknown" is safe

**Test 6.9: Tool Usage Conflicts**
- [ ] Agents use allowed-tools only
- [ ] No "this agent should use X" vs "this agent uses Y"
- [ ] Tool restrictions enforced consistently
- [ ] workflow-orchestrator truly doesn't implement (no Edit/Write)
- [ ] Implementation agents have proper tools

**Test 6.10: Philosophy & Approach Conflicts**
- [ ] Evidence-based vs trust-based - pick one
- [ ] 100% completion vs progressive delivery - which?
- [ ] User perspective maintenance vs agent autonomy
- [ ] File-based coordination vs other methods
- [ ] All agents follow same core philosophy

**Test 6.11: Competing Ideas Management**
- [ ] Multiple ways to save design preferences - which is canonical?
  - .design-memory/
  - /design command storage
  - /save-inspiration gallery
  - /agentfeedback --learn rules
- [ ] Multiple ways to provide feedback - which to use when?
  - Direct conversation
  - /agentfeedback
  - /clarify
- [ ] Multiple session management approaches - which wins?
  - SessionStart hook auto-load
  - /session-resume manual load
  - .claude-orchestration-context.md
  - .claude-session-context.md

**Test 6.12: Installation & Setup Conflicts**
- [ ] README installation vs actual requirements
- [ ] Hook setup instructions consistent
- [ ] File copying instructions don't conflict
- [ ] .claude/settings.local.json examples work
- [ ] No "do this" then "actually do that instead"

### Conflict Resolution Strategy

For each conflict found:

**1. Identify the conflict:**
- What are the two (or more) conflicting approaches?
- Where is each documented/implemented?
- What's the impact on users?

**2. Determine the "source of truth":**
- Which approach is better?
- Which is already more widely used?
- Which aligns with core philosophy?

**3. Document the resolution:**
- Update all conflicting docs to match
- Remove competing implementations
- Add clarity to prevent future confusion

**4. Categorize severity:**
- **Critical:** System doesn't work because of conflict
- **Major:** Confusing user experience, unclear which to use
- **Minor:** Cosmetic inconsistency, no functional impact

### Expected Conflicts (Known Issues)

Document any known conflicts that need resolution:

**Known Conflict 1: Design Memory Storage**
- Multiple systems store design patterns/preferences
- Need to consolidate or clearly separate purposes

**Known Conflict 2: Context Files**
- `.claude-orchestration-context.md` (from hook)
- `.claude-session-context.md` (from /session-save)
- `.orchestration/user-request.md` (from /orca)
- Clarify purpose of each

**Known Conflict 3: Agent Dispatch**
- /orca has its own orchestration logic
- workflow-orchestrator agent has orchestration logic
- Are these the same? Different? Clarify relationship

**Known Conflict 4: Evidence Requirements**
- Some workflows say "screenshots required"
- Some say "evidence when needed"
- Standardize when evidence is mandatory vs optional

---

## Output: Comprehensive Audit Report

### Report Structure
```
QA_AUDIT_REPORT.md
├── Executive Summary
│   ├── Overall Health Score (%)
│   ├── Critical Issues Found
│   ├── Recommendations
│   └── Pass/Fail Verdict
│
├── Phase 1: Command Validation
│   ├── Test 1.1: /orca [PASS/FAIL]
│   ├── Test 1.2: /enhance [PASS/FAIL]
│   └── ... (all 13 commands)
│
├── Phase 2: Agent Orchestration
│   ├── Test 2.1: iOS Workflow [PASS/FAIL]
│   ├── Test 2.2: Next.js Workflow [PASS/FAIL]
│   └── ... (all workflows)
│
├── Phase 3: Context Flow
│   ├── Test 3.1: User → Agents [PASS/FAIL]
│   ├── Test 3.2: Evidence Collection [PASS/FAIL]
│   └── ... (all flows)
│
├── Phase 4: Integration Tests
│   ├── Test 4.1: Full /orca [PASS/FAIL]
│   └── ... (all integration tests)
│
├── Phase 5: Documentation
│   ├── Test 5.1: README [PASS/FAIL]
│   └── ... (all docs)
│
├── Phase 6: Conflicts & Contradictions
│   ├── Test 6.1: Agent Role Conflicts [PASS/FAIL]
│   ├── Test 6.2: Command Overlap [PASS/FAIL]
│   ├── Test 6.3: Documentation Contradictions [PASS/FAIL]
│   ├── Test 6.4: Quality Gate Contradictions [PASS/FAIL]
│   ├── Test 6.5: Context Flow Contradictions [PASS/FAIL]
│   ├── Test 6.6: Evidence Collection Contradictions [PASS/FAIL]
│   ├── Test 6.7: Workflow Contradictions [PASS/FAIL]
│   ├── Test 6.8: Project Type Detection Conflicts [PASS/FAIL]
│   ├── Test 6.9: Tool Usage Conflicts [PASS/FAIL]
│   ├── Test 6.10: Philosophy & Approach Conflicts [PASS/FAIL]
│   ├── Test 6.11: Competing Ideas Management [PASS/FAIL]
│   └── Test 6.12: Installation & Setup Conflicts [PASS/FAIL]
│
├── Issues Found
│   ├── Critical (blocking)
│   ├── Major (important but not blocking)
│   ├── Minor (nice to fix)
│   └── Documentation gaps
│
└── Recommendations
    ├── Immediate fixes needed
    ├── Improvements suggested
    └── Future enhancements
```

---

## Success Criteria

**PASS:** ≥ 90% of tests passing, no critical issues
**CONDITIONAL PASS:** 75-89% passing, critical issues have workarounds
**FAIL:** < 75% passing, or critical blocking issues found

---

## Timeline

| Phase | Time | Description |
|-------|------|-------------|
| **Phase 1** | 2-3 hours | Test all 13 commands individually |
| **Phase 2** | 2-3 hours | Test agent orchestration for workflows |
| **Phase 3** | 1-2 hours | Validate context/memory flows |
| **Phase 4** | 1-2 hours | Integration testing |
| **Phase 5** | 1 hour | Documentation validation |
| **Phase 6** | 1-2 hours | **Conflicts & contradictions audit** |
| **Report** | 30-60 min | Compile comprehensive report |
| **Total** | **7-14 hours** | Full audit completion |

---

## Next Steps

1. **Review this QA plan** - Does it cover everything you need?
2. **Set up test projects** - Create minimal projects for each type
3. **Run Phase 1** - Start with command validation
4. **Document findings** - Track issues in real-time
5. **Generate report** - Comprehensive audit report
6. **Fix critical issues** - Address blocking problems
7. **Iterate** - Re-run failed tests after fixes

---

**Ready to execute?** Say "Start QA audit" and I'll begin Phase 1.
