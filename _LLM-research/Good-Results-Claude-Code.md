---
title: "Getting Good Results from Claude Code"
source: "https://www.dzombak.com/blog/2025/08/getting-good-results-from-claude-code/"
author:
  - "[[Chris Dzombak]]"
published: 2025-08-08
created: 2025-11-06
description: "I've been experimenting with LLM programming agents over the past few months. Claude Code has become my favorite.It is not without issues, but it's allowed me to write ~12 programs/projects in relatively little time, and I feel I would not have been able to do all this in"
tags:
  - "clippings"
---
I’ve been experimenting with LLM programming agents over the past few months. Claude Code has become my favorite.

It is not without issues, but it’s allowed me to write ~12 programs/projects in relatively little time, and I feel I would not have been able to do all this in the same amount of time without it. Most of them, I wouldn’t even have bothered to write without Claude Code, simply because they’d take too much of my time. (A list is included at the end of this post.)

I’m still far from a Claude Code expert, and I have a backlog of blog posts and documentation to review that might be useful. But — and this is critical — you don’t have to read everything that’s out there to start seeing results. You don’t even need to read *this* post; just type some prompts in and see what comes out.

That said, because I just wrote this up for a job application, **here’s how I’m getting good results from Claude Code**. I’ve added links to some examples where appropriate.

- A key is writing a clear spec ahead of time, which provides context to the agent as it works in the codebase. *(examples:* [*1*](https://github.com/cdzombak/mac-install/blob/main/SPEC.md?ref=dzombak.com)*,* [*2*](https://github.com/cdzombak/lychee-ai-organizer/blob/main/SPEC.md?ref=dzombak.com)*,* [*3*](https://github.com/cdzombak/lychee-meta-tool/blob/main/SPEC.md?ref=dzombak.com)*,* [*4*](https://github.com/cdzombak/xrp/blob/main/doc/SPEC.md?ref=dzombak.com)*)*
- Having a document for the agent that outlines the project’s structure and how to run e.g. builds and linters is helpful. *(examples:* [*1*](https://github.com/cdzombak/xrp/blob/main/CLAUDE.md?ref=dzombak.com)*,* [*2*](https://github.com/cdzombak/lychee-meta-tool/blob/main/CLAUDE.md?ref=dzombak.com)*,* [*3*](https://github.com/cdzombak/lychee-ai-organizer/blob/main/CLAUDE.md?ref=dzombak.com)*)*
- Asking the agent to perform a code review on its own work is surprisingly fruitful.
- Finally, I have a personal “global” agent guide describing best practices for agents to follow, specifying things like problem-solving approach, use of TDD, etc. *(This file is listed near the end of this post.)*

Then there’s the question of **validating LLM-written code.**

AI-generated code *is* often incorrect or inefficient.

It’s important for me to call out that **I believe I’m ultimately responsible for the code that goes into a PR with my name on it, regardless of how it was produced**.

Therefore, especially in any professional context, I manually review all AI-written code and test cases. I’ll add test cases for anything I think is missing or needs improvement, either manually or by asking the LLM to write those cases (which I then review).

At the end of the day, manual review is necessary to verify that behavior is implemented correctly and tested properly.

## Personal “global” agent guide

This lives at `~/.claude/CLAUDE.md`:

```markdown
# Development Guidelines

## Philosophy

### Core Beliefs

- **Incremental progress over big bangs** - Small changes that compile and pass tests
- **Learning from existing code** - Study and plan before implementing
- **Pragmatic over dogmatic** - Adapt to project reality
- **Clear intent over clever code** - Be boring and obvious

### Simplicity Means

- Single responsibility per function/class
- Avoid premature abstractions
- No clever tricks - choose the boring solution
- If you need to explain it, it's too complex

## Process

### 1. Planning & Staging

Break complex work into 3-5 stages. Document in \`IMPLEMENTATION_PLAN.md\`:

\`\`\`markdown
## Stage N: [Name]
**Goal**: [Specific deliverable]
**Success Criteria**: [Testable outcomes]
**Tests**: [Specific test cases]
**Status**: [Not Started|In Progress|Complete]
\`\`\`
- Update status as you progress
- Remove file when all stages are done

### 2. Implementation Flow

1. **Understand** - Study existing patterns in codebase
2. **Test** - Write test first (red)
3. **Implement** - Minimal code to pass (green)
4. **Refactor** - Clean up with tests passing
5. **Commit** - With clear message linking to plan

### 3. When Stuck (After 3 Attempts)

**CRITICAL**: Maximum 3 attempts per issue, then STOP.

1. **Document what failed**:
   - What you tried
   - Specific error messages
   - Why you think it failed

2. **Research alternatives**:
   - Find 2-3 similar implementations
   - Note different approaches used

3. **Question fundamentals**:
   - Is this the right abstraction level?
   - Can this be split into smaller problems?
   - Is there a simpler approach entirely?

4. **Try different angle**:
   - Different library/framework feature?
   - Different architectural pattern?
   - Remove abstraction instead of adding?

## Technical Standards

### Architecture Principles

- **Composition over inheritance** - Use dependency injection
- **Interfaces over singletons** - Enable testing and flexibility
- **Explicit over implicit** - Clear data flow and dependencies
- **Test-driven when possible** - Never disable tests, fix them

### Code Quality

- **Every commit must**:
  - Compile successfully
  - Pass all existing tests
  - Include tests for new functionality
  - Follow project formatting/linting

- **Before committing**:
  - Run formatters/linters
  - Self-review changes
  - Ensure commit message explains "why"

### Error Handling

- Fail fast with descriptive messages
- Include context for debugging
- Handle errors at appropriate level
- Never silently swallow exceptions

## Decision Framework

When multiple valid approaches exist, choose based on:

1. **Testability** - Can I easily test this?
2. **Readability** - Will someone understand this in 6 months?
3. **Consistency** - Does this match project patterns?
4. **Simplicity** - Is this the simplest solution that works?
5. **Reversibility** - How hard to change later?

## Project Integration

### Learning the Codebase

- Find 3 similar features/components
- Identify common patterns and conventions
- Use same libraries/utilities when possible
- Follow existing test patterns

### Tooling

- Use project's existing build system
- Use project's test framework
- Use project's formatter/linter settings
- Don't introduce new tools without strong justification

## Quality Gates

### Definition of Done

- [ ] Tests written and passing
- [ ] Code follows project conventions
- [ ] No linter/formatter warnings
- [ ] Commit messages are clear
- [ ] Implementation matches plan
- [ ] No TODOs without issue numbers

### Test Guidelines

- Test behavior, not implementation
- One assertion per test when possible
- Clear test names describing scenario
- Use existing test utilities/helpers
- Tests should be deterministic

## Important Reminders

**NEVER**:
- Use \`--no-verify\` to bypass commit hooks
- Disable tests instead of fixing them
- Commit code that doesn't compile
- Make assumptions - verify with existing code

**ALWAYS**:
- Commit working code incrementally
- Update plan documentation as you go
- Learn from existing implementations
- Stop after 3 failed attempts and reassess
```