# Project: [Your Project Name]

## Project Overview

**Description:** [Brief description of your project]

**Tech Stack:** [e.g., Next.js, TypeScript, Tailwind CSS, Supabase]

---

## Project-Specific Instructions

### Architecture Decisions

**[Add your architectural decisions here]**

Example:
- We use Server Components by default, Client Components only when needed
- API routes follow REST conventions
- Database queries use Supabase client-side where possible

### Code Style & Standards

**[Add your code style preferences here]**

Example:
- Use named exports over default exports
- Prefer functional components with hooks
- Follow file naming convention: `ComponentName.tsx`

### Design System

**[Add your design system rules here]**

Example:
- Spacing: 4px/8px/16px/24px/32px scale
- Colors: Use design tokens from `design-system.css`
- Typography: Use text classes, no arbitrary font sizes

---

## What NOT to Do

**[Add anti-patterns and banned approaches here]**

Example:
- ❌ No inline styles - use design tokens
- ❌ No `any` types in TypeScript
- ❌ No direct DOM manipulation - use React state

---

## Context for Claude

**When working on this project:**

1. **Always query ProjectContext first** - Get relevant files and past decisions
2. **Check memory** - Look for similar work or known issues
3. **Follow standards** - Apply project-specific rules above
4. **Document decisions** - Save important choices to memory

---

## Verification Requirements

Before claiming work is "done":

- [ ] Code compiles without errors
- [ ] Tests pass (if applicable)
- [ ] Follows design system
- [ ] No console errors
- [ ] Screenshots captured (for UI changes)

---

_Created by Vibe OS 2.0 • Last updated: [Date]_
