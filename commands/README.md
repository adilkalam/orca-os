# Updated Commands with Response Awareness & Spec-Agent Architecture

All commands have been updated to incorporate learnings from:
1. **Response Awareness Methodology** - Metacognitive patterns to prevent AI failures
2. **Spec-Agent System** - Three-phase workflow with quality gates
3. **Pure Orchestration** - Orchestrators that never implement

## Command Overview

### 🎯 Core Orchestration Commands

#### `/orca` - Pure Workflow Orchestrator
- **PURE ORCHESTRATOR** - NO Edit/Write/MultiEdit tools
- Implements 3-phase workflow (Planning → Development → Validation)
- Quality gates at each phase (95% → 80% → 85%)
- Parallel agent dispatch for efficiency
- Response Awareness patterns throughout
- Evidence-based completion requirements

#### `/spec-workflow` - Complete Spec-Based Pipeline
- Full implementation of claude-sub-agent workflow
- Automated quality gates with scoring
- Intelligent feedback loops
- Maximum iteration limits to prevent infinite loops
- Comprehensive evidence collection

### 🔍 Enhancement & Planning Commands

#### `/enhance` - Intelligent Request Enhancement
- Transforms vague requests into specifications
- Response Awareness checks for assumptions
- Multi-level enhancement (requirements → technical → implementation)
- Quality criteria definition
- Evidence requirements specification

#### `/concept` - Design Exploration
- Three-phase concept development
- Based on spec-analyst patterns
- Research-driven design decisions
- Concept validation with scoring
- Integration with development workflow

### ✅ Validation & Improvement Commands

#### `/clarify` - Metacognitive Assumption Checking
- Identifies and validates assumptions
- Prevents #ASSUMPTION_BLINDNESS
- Quick verification process
- Cascading assumption analysis
- Integration points with workflow

#### `/agentfeedback` - Systematic Feedback Processing
- Three-phase feedback handling
- Quality gates for feedback resolution
- Learning extraction (--learn flag)
- Pattern identification
- Design rule creation

## Response Awareness Patterns

All commands now monitor for:
- `#COMPLETION_DRIVE` - Urge to mark complete without verification
- `#CARGO_CULT` - Copying without understanding context
- `#ASSUMPTION_BLINDNESS` - Making unchecked assumptions
- `#FALSE_COMPLETION` - Claiming success without evidence
- `#IMPLEMENTATION_SKEW` - Drifting from requirements
- `#CONTEXT_ROT` - Implementation overtaking architecture
- `#TOOL_OBSESSION` - Using complex tools unnecessarily
- `#PREMATURE_OPTIMIZATION` - Optimizing before working

## Quality Gate Framework

### Standard Gates Across Commands

**Gate 1: Planning (95% threshold)**
- Requirements completeness
- Architecture definition
- Task breakdown
- Risk identification

**Gate 2: Implementation (80% threshold)**
- Code completion
- Test coverage
- Documentation
- Performance metrics

**Gate 3: Validation (85% threshold)**
- Production readiness
- Security validation
- Operational requirements
- User acceptance

## Evidence Requirements

### What Constitutes Evidence
- Command output showing success
- Test results passing
- Build/deployment logs
- Screenshots for UI changes
- Performance benchmarks
- Security scan results

### What Does NOT Constitute Evidence
- "Looks good to me"
- "Should work"
- "I've implemented X" (without proof)
- "Tests would pass" (without running them)

## Orchestration Principles

### Pure Orchestrators
- Orchestrators NEVER have Edit/Write/MultiEdit tools
- Only coordinate, dispatch, and verify
- Maintain architectural vision
- Prevent context rot

### Parallel Execution
- Leverage token economics ($0.003 input vs $0.015 output)
- Dispatch multiple agents simultaneously
- Collect concise results
- Maximize efficiency

### Spec-Based Workflow
- Specifications as contracts between agents
- Artifacts flow between phases
- Quality gates ensure consistency
- Feedback loops for continuous improvement

## Usage Examples

### Complete Feature Development
```
/spec-workflow "Create user authentication system"
→ Planning phase with specs
→ Parallel implementation
→ Validation and production readiness
```

### Quick Assumption Check
```
/clarify "Is this a React or Vue project?"
→ Identifies assumption
→ Validates against evidence
→ Provides confidence level
```

### Design Exploration
```
/concept "Modern dashboard interface"
→ Research and references
→ Multiple concept generation
→ Validation and recommendation
```

### Feedback Processing
```
/agentfeedback "The UI is misaligned and API is slow" --learn
→ Parses feedback points
→ Dispatches fixes
→ Extracts learning patterns
```

## Integration Points

Commands work together:
1. `/enhance` → `/spec-workflow` (enhance then implement)
2. `/concept` → `/orca` (design then build)
3. `/clarify` → any command (check assumptions anytime)
4. Any command → `/agentfeedback` (process feedback)

## Remember

These updated commands implement hard-won insights about AI agent behavior:
- Orchestrators must remain pure to prevent context rot
- Assumptions must be explicitly checked
- Evidence is required for all claims
- Quality gates prevent cascade failures
- Parallel execution maximizes efficiency
- Learning from feedback prevents repeated mistakes

The commands now work as a cohesive system, each reinforcing the principles of Response Awareness and spec-based development.