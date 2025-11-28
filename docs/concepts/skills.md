# Skills

Skills are reusable knowledge packages that provide domain expertise to agents.

## What is a Skill?

A skill is a directory containing:
- `SKILL.md` - skill definition with metadata and knowledge
- Supporting files (optional) - examples, templates, references

Skills load into agent context when relevant, providing:
- Domain-specific patterns and conventions
- Best practices and anti-patterns
- Reference material and examples

## Skill Structure

```
skills/
├── ios-knowledge-skill/
│   └── SKILL.md
├── nextjs-knowledge-skill/
│   └── SKILL.md
├── shopify-theme/
│   └── SKILL.md
├── liquid-quick/
│   └── SKILL.md
└── os-dev-knowledge-skill/
    └── SKILL.md
```

## SKILL.md Format

```yaml
---
name: skill-name
description: >
  What this skill provides and when to use it.
---

# Skill Title

Content that loads into agent context...

## Patterns
...

## Anti-Patterns
...

## Examples
...
```

## How Skills Load

1. **Explicit invocation**: User or agent calls the skill
2. **Agent reference**: Agent definition mentions the skill
3. **Context matching**: Skill description matches task domain

When loaded, skill content appears in agent context alongside:
- ContextBundle from ProjectContext
- Memory hits from Workshop/vibe.db
- Task-specific instructions from orchestrator

## Available Skills

### Domain Knowledge Skills
- `ios-knowledge-skill` - iOS/Swift patterns and conventions
- `nextjs-knowledge-skill` - Next.js patterns and conventions
- `shopify-theme` - Shopify theme development expertise
- `os-dev-knowledge-skill` - OS 2.4 configuration knowledge (LOCAL)

### Quick Reference Skills
- `liquid-quick` - Fast Liquid syntax reference

### Testing Skills
- `ios-testing-skill` - iOS testing patterns

## Creating a Skill

1. Create directory: `skills/my-skill/`
2. Create `SKILL.md` with frontmatter and content
3. Reference in agent definitions or invoke explicitly

### Example SKILL.md

```yaml
---
name: my-domain-skill
description: >
  Expertise for my-domain development. Use when working on
  my-domain files or patterns.
---

# My Domain Skill

## Core Patterns

### Pattern 1
Description and example...

### Pattern 2
Description and example...

## Anti-Patterns

### Don't Do This
Why it's bad and what to do instead...

## Common Gotchas

- Gotcha 1: explanation
- Gotcha 2: explanation
```

## Skills vs Agents

| Aspect | Skill | Agent |
|--------|-------|-------|
| Purpose | Provide knowledge | Perform actions |
| Has tools? | No | Yes |
| Edits files? | No | Yes (specialists) |
| Invocation | Loads into context | Delegated via Task |

Skills inform agents; agents do work.

## See Also

- [Pipeline Model](pipeline-model.md) - How skills fit into pipelines
- [Memory Systems](memory-systems.md) - Other sources of agent context
