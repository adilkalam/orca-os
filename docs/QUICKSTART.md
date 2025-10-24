# Quick Start Guide

## Overview

The new orchestration system uses native Claude Code agents with automatic quality verification. Every task goes through evidence-based validation before you see results.

## Core Commands

### `/enhance` - Main Development Command

Orchestrates specialized agents to complete any coding task with 100% verification.

**Example:**
```
/enhance "Add a settings button to the navigation bar"
```

**What happens:**
1. Request saved to `.orchestration/user-request.md`
2. Work plan created (2-hour pieces max)
3. Appropriate agents dispatched
4. Evidence collected (screenshots/tests)
5. Quality gate verification (100% required)
6. Results presented only when complete

### `/ultra-think` - Deep Analysis

Multi-dimensional problem analysis without implementation.

**Example:**
```
/ultra-think "Why is the calculator difficult to use?"
```

**Output:**
- Problem analysis from multiple perspectives
- Evidence evaluation
- Solution options with tradeoffs
- Confidence levels for conclusions

## System Architecture

```
Your Request
     ↓
workflow-orchestrator (conductor)
     ↓
Specialized Agents:
├── ios-expert (Complete iOS development)
├── swiftui-expert (SwiftUI UI/design)
└── quality-gate (final verification)
     ↓
Evidence Collection (.orchestration/evidence/)
     ↓
100% Verification Required
     ↓
Present Results
```

## Key Features

### 🎯 User Focus Maintained
- Your exact words preserved in `.orchestration/user-request.md`
- Orchestrator re-reads your request multiple times
- Verifies actual problem solved, not just code written

### 📸 Evidence-Based Verification
Every change requires proof:
- **UI changes** → Screenshots
- **Functionality** → Test output
- **Design** → Measurements
- **Integration** → Build logs

### ✅ Quality Gate Protection
- Creates verification table for all requirements
- Blocks presentation if <100% verified
- You never see broken work

### 📁 Transparent Coordination
Track everything in `.orchestration/`:
- `user-request.md` - Your exact request
- `work-plan.md` - How task is broken down
- `agent-log.md` - What each agent did
- `evidence/` - Proof of completion

## Real Examples

### Example 1: Adding a Feature
```
/enhance "Add a logout button to the profile screen"
```

**Result:**
```
✅ Button added to profile screen
✅ Proper 44pt touch target
✅ 24pt font size
✅ Evidence: screenshot_001.png shows button
✅ Evidence: test_logout.txt shows functionality
```

### Example 2: Fixing UI Issues
```
/enhance "The cards are too small and text is hard to read"
```

**Result:**
```
✅ Cards enlarged from 100x80 to 140x100
✅ Font size increased from 14pt to 24pt
✅ Padding increased to 16pt minimum
✅ Evidence: before_after_comparison.png
✅ Evidence: measurements.txt showing new sizes
```

### Example 3: Complex Redesign
```
/enhance "Redesign the calculator to be more user-friendly"
```

**Result:**
```
Work Plan (4 pieces):
1. Layout improvements (2 hrs)
2. Typography and spacing (2 hrs)
3. Interactive elements (2 hrs)
4. Final polish (1 hr)

Each piece verified with evidence before proceeding.
```

## Common Workflows

### Adding Features
```
/enhance "Add [feature] to [screen/component]"
```
- Agent creates implementation
- Provides screenshot of new feature
- Tests functionality
- Verifies against your request

### Fixing Problems
```
/enhance "Fix [specific problem description]"
```
- Agent identifies issue
- Implements solution
- Provides before/after evidence
- Verifies problem resolved

### Design Improvements
```
/enhance "Make [element] more [quality]"
```
- Design verification checks current state
- Implementation makes improvements
- Evidence shows improvements
- Quality gate ensures standards met

## What's Different from Old System

| Aspect | Old System | New System |
|--------|------------|------------|
| Agent prompts | 1,284 lines | <200 lines |
| Critical rules | Buried at line 1200 | First 30 lines |
| Verification | ~40% completion | 100% required |
| Evidence | Optional | Mandatory |
| User focus | Lost during execution | Maintained throughout |
| Context size | 20K+ tokens | <5K tokens |
| Broken work shown | Frequently | Never |

## Debugging

### Check Orchestration Files
```bash
# See your original request
cat .orchestration/user-request.md

# See what agents did
cat .orchestration/agent-log.md

# See the work plan
cat .orchestration/work-plan.md

# Check evidence
ls .orchestration/evidence/
```

### Common Issues

**Issue:** "Agent can't find files"
- Agents now search using grep/glob
- Don't load entire codebase
- More efficient and focused

**Issue:** "Task seems stuck"
- Check `.orchestration/agent-log.md`
- Quality gate may be blocking due to missing evidence
- Provide more specific requirements

**Issue:** "Results don't match expectations"
- Review `.orchestration/user-request.md`
- Ensure request was specific
- Check evidence provided

## Best Practices

### Writing Good Requests

**Instead of:** "Make it better"
**Use:** "Increase font size to 24pt, add 16pt padding, use system blue color"

**Instead of:** "Fix the bug"
**Use:** "Fix the calculator showing NaN when dividing by zero"

### Reviewing Results
1. Check evidence provided matches your request
2. Verify screenshots show desired outcome
3. Review test output for functionality
4. Provide specific feedback if not satisfied

## Advanced Features

### Parallel Agent Execution
For independent tasks, agents can work simultaneously:
```
/enhance "Add login screen AND settings screen"
```

### Iteration Support
System maintains context for improvements:
```
/enhance "Make the button larger"
(after review)
/enhance "Make it blue instead of red"
```

### Deep Analysis Before Implementation
```
/ultra-think "What's the best way to structure the navigation?"
(review analysis)
/enhance "Implement tab navigation as recommended"
```

## Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/enhance` | Implementation | Any coding task |
| `/ultra-think` | Analysis | Complex problems |

| File | Contains | Check When |
|------|----------|------------|
| `user-request.md` | Your exact words | Verifying intent |
| `agent-log.md` | Agent actions | Debugging |
| `evidence/` | Proof | Validating results |

## Getting Started

1. Try a simple task:
   ```
   /enhance "Add a header that says 'Welcome'"
   ```

2. Check the evidence:
   ```
   ls .orchestration/evidence/
   ```

3. Review what happened:
   ```
   cat .orchestration/agent-log.md
   ```

The system ensures you get exactly what you asked for, with proof, every time.