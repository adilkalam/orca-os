# Claude Code Orchestration System

**Native Claude Code agents with evidence-based verification**

## Quick Start

```bash
# Main command for any coding task
/enhance "Add a dark mode toggle to settings"

# Deep analysis without implementation
/ultra-think "Why is the app slow?"
```

The system automatically:
- ✅ Orchestrates specialized agents
- ✅ Requires evidence for all work
- ✅ Verifies 100% completion
- ✅ Never shows broken work

## How It Works

```
Your Request → Orchestrator → Agents → Evidence → Verification → Results
```

1. **workflow-orchestrator** coordinates everything
2. Specialized agents do the work (iOS, design, etc.)
3. Evidence collected (screenshots, tests)
4. Quality gate verifies 100% complete
5. Only then presented to you

## Key Features

### 🎯 Maintains Your Perspective
- Your exact words saved in `.orchestration/user-request.md`
- Orchestrator re-reads your request multiple times
- Verifies your actual problem is solved

### 📸 Evidence-Based
- Screenshots for UI changes
- Test output for functionality
- No claims without proof

### ✅ Quality Gate
- 100% verification required
- Blocks incomplete work
- You never see failures

## Documentation

- [Quick Start Guide](docs/QUICKSTART.md) - Examples and usage
- [Architecture](docs/ARCHITECTURE.md) - How the system works
- [Setup](docs/SETUP.md) - Installation and configuration
- [Workflows](docs/WORKFLOWS.md) - Common patterns
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Debugging help
- [Design Guidelines](docs/DESIGN-GUIDELINES.md) - Universal design patterns
- [SwiftUI Design System](docs/SWIFTUI-DESIGN-SYSTEM.md) - iOS-specific patterns

## What's New

This system replaces the previous complex orchestration with a simpler, more reliable approach:

| Before | After |
|--------|-------|
| 1,284 line agents | <200 lines |
| Guidelines buried | Critical rules first |
| ~40% completion | 100% required |
| No verification | Evidence mandatory |
| Complex coordination | Simple file-based |

## Project Structure

```
.claude/
  agents/               # Specialized agents
  commands/            # /enhance, /ultra-think

.orchestration/
  user-request.md      # Your exact words
  work-plan.md        # How work is broken down
  agent-log.md        # What each agent did
  evidence/           # Proof of completion

docs/
  QUICKSTART.md       # Examples and usage
  ARCHITECTURE.md     # System design
```

## Examples

### Add a Feature
```
/enhance "Add a logout button to the profile"
```
Result: Button added, screenshot provided, functionality tested

### Fix a Problem
```
/enhance "The text is too small to read"
```
Result: Font size increased, before/after comparison, measurements provided

### Analyze an Issue
```
/ultra-think "Why does the calculator feel confusing?"
```
Result: Multi-dimensional analysis with solution options

## Contributing

The system is designed to be extended:
1. Agents are simple markdown files in `.claude/agents/`
2. Commands are markdown in `.claude/commands/`
3. Keep agents under 200 lines
4. Critical rules in first 30 lines
5. Always require evidence

## License

MIT

---

Built to solve the actual problems, not just complete tasks.