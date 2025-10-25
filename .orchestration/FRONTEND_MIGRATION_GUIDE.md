# Frontend Team Migration Guide

**Migration:** Monolithic `frontend-engineer` → 5 Specialized Frontend Agents

**Date:** 2025-10-23
**Status:** Complete
**Impact:** High - Changes how all frontend development workflows operate

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Why This Migration Happened](#why-this-migration-happened)
3. [The 5 Frontend Specialists](#the-5-frontend-specialists)
4. [Migration Decision Framework](#migration-decision-framework)
5. [Before vs After Examples](#before-vs-after-examples)
6. [Team Composition Guide](#team-composition-guide)
7. [Common Migration Scenarios](#common-migration-scenarios)
8. [Breaking Changes](#breaking-changes)
9. [Rollback Plan](#rollback-plan)
10. [FAQ](#faq)

---

## Executive Summary

### What Changed

**Before:**
- 1 monolithic `frontend-engineer.md` (1,323 lines)
- Covered 18+ responsibilities (React, Vue, Next.js, state, styling, testing, etc.)
- Generic advice, shallow expertise
- Fixed team composition (always used the same agent)
- Outdated patterns (class components, Redux for everything)

**After:**
- 5 focused frontend specialists (~250 lines each)
- Design specialists (tailwind-specialist, ui-engineer, etc.) integrated from design team
- Each specialist has deep expertise in ONE domain
- Modern patterns (React 18 Server Components, state type separation, Tailwind v4)
- Dynamic team composition (10-15 agents based on complexity)
- Clear decision frameworks for specialist selection

### Impact

**For Users:**
- `/orca` now auto-selects the right frontend specialists
- More accurate implementations with modern patterns
- Faster workflows (specialists work in parallel)
- Better code quality (specialized expertise)

**For Developers:**
- Reference specific specialists in prompts
- More maintainable agent files (250 lines vs 1,323)
- Easier to update patterns (change one specialist, not monolith)

### Timeline

- **Planning:** Oct 22, 2025 (ultra-think analysis, master plan)
- **Implementation:** Oct 23, 2025 (template + 6 specialists in parallel)
- **Integration:** Oct 23, 2025 (/orca updates, QUICK_REFERENCE)
- **Status:** Complete and production-ready

---

## Why This Migration Happened

### The Problem with Monolithic frontend-engineer

**Problem 1: Expertise Dilution**
- 1,323 lines trying to cover 18+ distinct responsibilities
- Surface-level knowledge across all areas
- Generic implementations that work but don't excel
- No deep expertise in any one area

**Example:**
```markdown
# Old frontend-engineer.md (excerpt)
"For state management, use Redux, Context, or Zustand. For styling, use Tailwind, CSS-in-JS, or CSS Modules. For testing, use Vitest or Jest."
```
→ No clear decision framework, just lists all options

**Problem 2: Framework Fragmentation**
- React 17 vs React 18 (Server Components completely different)
- Next.js 13 Pages Router vs Next.js 14 App Router
- State management confusion (UI vs server vs URL state)
- Agents defaulted to "safe" outdated patterns

**Problem 3: Performance Blindness**
- Agents can't see rendered output or Core Web Vitals
- No code splitting by default
- Excessive re-renders from poor state management
- Bundle sizes ballooning to 400KB+

**Problem 4: Testing Anti-Patterns**
- Testing implementation details instead of user behavior
- No accessibility testing by default
- Mock-heavy tests that pass but don't verify functionality

**Problem 5: Scalability Issues**
- Fixed team composition (always same agent regardless of task)
- Simple form component gets same agent as complex dashboard
- No way to add specialists for specific needs (performance, state, etc.)

### The Solution: 6 Focused Specialists

**Specialist Philosophy:**
- **One responsibility, deep expertise** (vs many responsibilities, shallow knowledge)
- **Modern patterns by default** (vs safe outdated patterns)
- **Clear decision frameworks** (vs "here are all the options")
- **Dynamic team composition** (vs fixed team)

**7 Root Causes Addressed:**
1. Framework Fragmentation → react-18-specialist, nextjs-14-specialist (framework-specific)
2. State Management Confusion → state-management-specialist (UI vs server vs URL)
3. Performance Blindness → frontend-performance-specialist (Core Web Vitals, bundle analysis)
4. Accessibility Afterthought → Integrated into all specialists + accessibility-specialist from design team
5. TypeScript Type Safety → Enforced in all specialists (<5% `any` usage)
6. Testing Anti-Patterns → frontend-testing-specialist (behavior-first, not implementation)
7. Styling Inconsistency → tailwind-specialist from design team (Tailwind v4 + daisyUI 5)

---

## The 5 Frontend Specialists

**Note:** Styling is handled by `tailwind-specialist` from the design team (`~/.claude/agents/design-specialists/implementation/tailwind-specialist.md`), not a frontend-specific agent. Frontend specialists focus on framework patterns, state, performance, and testing.

### 1. react-18-specialist
**File:** `~/.claude/agents/frontend-specialists/frameworks/react-18-specialist.md`

**Expertise:**
- React 18+ Server Components
- Suspense and concurrent rendering
- Modern hooks (useState, useEffect, useCallback, useMemo, useTransition, useDeferredValue)
- React Query for server state
- Client vs server component boundaries

**When to Use:**
- Building React 18+ applications
- Need server-side data fetching
- Complex client-side interactivity
- NOT for Next.js apps (use nextjs-14-specialist instead)

**Key Pattern:**
```tsx
// Server Component (async data fetching)
async function UserPage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id); // Runs on server

  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserProfile user={user} />
    </Suspense>
  );
}

// Client Component (interactive state)
'use client';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value);
    startTransition(() => {
      router.push(`/search?q=${value}`);
    });
  };

  return <input value={query} onChange={(e) => handleSearch(e.target.value)} />;
}
```

---

### 2. nextjs-14-specialist
**File:** `~/.claude/agents/frontend-specialists/frameworks/nextjs-14-specialist.md`

**Expertise:**
- Next.js 14 App Router
- SSR/SSG/ISR decision framework
- Server Actions
- Metadata API for SEO
- Image optimization
- Route handlers

**When to Use:**
- Building Next.js applications
- Need SEO optimization
- SSR/SSG/ISR strategies
- NOT for standalone React apps (use react-18-specialist)

**Decision Framework:**
```tsx
// SSG - Static content (blog posts, docs)
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// SSR - Personalized content (dashboards)
async function Dashboard({ searchParams }: { searchParams: { view: string } }) {
  const data = await getDashboardData(searchParams.view);
  return <DashboardView data={data} />;
}

// ISR - Frequently updated (product pages)
async function Product({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <ProductView product={product} />;
}
export const revalidate = 3600; // Revalidate every hour
```

---

### 3. state-management-specialist
**File:** `~/.claude/agents/frontend-specialists/state/state-management-specialist.md`

**Expertise:**
- State type separation (UI vs server vs URL)
- Zustand for global UI state
- React Query for server state
- useSearchParams for URL state
- State colocation
- Context API for dependency injection

**When to Use:**
- Complex state management needs
- Multiple state types (UI, server, URL)
- Global state requirements
- NOT for simple local state (use react-18-specialist's useState)

**Decision Framework:**
```
Is it fetched from a server? → Server State (React Query/SWR)
Does it affect the URL? → URL State (useSearchParams)
Does it affect multiple unrelated components? → Global UI State (Zustand/Context/Redux)
Is it local to one component/tree? → Local UI State (useState/useReducer)
```

**Key Pattern:**
```tsx
function ProductList() {
  // UI State (theme, layout)
  const theme = useLocalStorage('theme', 'dark');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Server State (products from API)
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  // URL State (search, filters, pagination)
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const category = searchParams.get('category');
}
```

---

### 4. Styling: tailwind-specialist (from Design Team)
**File:** `~/.claude/agents/design-specialists/implementation/tailwind-specialist.md`

**Why Not Frontend-Specific:**
- Styling is a design responsibility, not a framework responsibility
- Design team owns Tailwind v4, daisyUI 5, design tokens, OKLCH colors
- Frontend specialists focus on framework patterns (React/Next.js)

**Expertise:**
- Tailwind CSS v4 (container queries, OKLCH colors, CSS-first config)
- daisyUI 5 (50+ semantic components)
- Responsive design (mobile-first)
- Dark mode implementation
- Accessible color contrast (OKLCH for perceptual uniformity)

**When to Use:**
- All UI styling needs (MANDATORY for frontend)
- Responsive design
- Design system implementation
- NOT for complex animations (use CSS specialist from design team)

**Integration with Frontend:**
- Frontend specialists create component logic
- tailwind-specialist handles component styling
- Works in parallel with react-18-specialist or nextjs-14-specialist

**See:** `~/.claude/agents/design-specialists/implementation/tailwind-specialist.md` for full documentation

---

### 5. frontend-performance-specialist
**File:** `~/.claude/agents/frontend-specialists/performance/frontend-performance-specialist.md`

**Expertise:**
- Code splitting (route-based, component-based)
- React optimization (React.memo, useMemo, useCallback)
- Virtual scrolling for large lists
- Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- Bundle analysis and optimization
- Image optimization strategies

**When to Use:**
- Performance-critical applications
- Large datasets (10,000+ items)
- Slow page loads (LCP >2.5s)
- NOT for simple apps without performance issues

**Key Patterns:**
```tsx
// Route-Based Code Splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
}

// React Optimization
const ProductCard = memo<ProductCardProps>(({ product, onSelect }) => {
  return <div className="card" onClick={() => onSelect(product.id)}>{product.name}</div>;
});

// Virtual Scrolling
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });
  // Renders ~20 visible items instead of 10,000
}
```

---

### 6. frontend-testing-specialist (MANDATORY)
**File:** `~/.claude/agents/frontend-specialists/testing/frontend-testing-specialist.md`

**Expertise:**
- React Testing Library (behavior-first)
- Vitest for unit/integration tests
- Playwright for E2E tests
- Accessibility testing (axe-core)
- Keyboard navigation testing
- NOT testing implementation details

**When to Use:**
- All frontend testing needs (MANDATORY for production)
- Accessibility compliance testing
- E2E workflow testing
- NOT for backend API testing (use test-engineer)

**Testing Philosophy:**
```tsx
// ❌ WRONG: Testing Implementation Details
expect(component.state().count).toBe(1);
expect(mockFunction).toHaveBeenCalled();

// ✅ CORRECT: Testing User Behavior
render(<Counter />);
const button = screen.getByRole('button', { name: /increment/i });
fireEvent.click(button);
expect(screen.getByText('Count: 1')).toBeInTheDocument();

// Accessibility Testing
import { axe, toHaveNoViolations } from 'jest-axe';

it('meets accessibility standards', async () => {
  const { container } = render(<UserProfile userId="123" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Keyboard Navigation
it('supports keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<UserProfile userId="123" />);

  await user.tab(); // Tab to button
  expect(screen.getByLabelText('Edit profile')).toHaveFocus();

  await user.keyboard('{Enter}'); // Activate
  expect(screen.getByLabelText('Name')).toBeInTheDocument();
});
```

---

## Migration Decision Framework

### When to Use Which Specialist

Use this decision tree when building frontend features:

```
Building a frontend feature?
│
├─ What framework?
│  ├─ React 18+ (standalone) → react-18-specialist
│  └─ Next.js 14 → nextjs-14-specialist
│
├─ Need complex state management?
│  └─ Yes → Add state-management-specialist
│
├─ Need UI styling?
│  └─ Yes → Add tailwind-specialist from design team (MANDATORY)
│
├─ Performance issues or large datasets?
│  └─ Yes → Add frontend-performance-specialist
│
└─ Writing tests?
   └─ Yes → Add frontend-testing-specialist (MANDATORY for production)
```

### Auto-Selection by /orca

The `/orca` command auto-selects specialists based on keywords:

| Keywords | Specialist Selected |
|----------|-------------------|
| "react", "component", "hooks" | react-18-specialist |
| "next.js", "app router", "SEO" | nextjs-14-specialist |
| "state", "zustand", "global state" | state-management-specialist |
| "tailwind", "styling", "css", "responsive" | tailwind-specialist (design team) |
| "performance", "slow", "optimization" | frontend-performance-specialist |
| "test", "testing", "e2e", "accessibility" | frontend-testing-specialist |

---

## Before vs After Examples

### Example 1: Simple React Component

**Before (Monolithic):**
```
User: "Build a login form with React"

Team:
- frontend-engineer (1,323 lines, generic advice)

Result:
- Class component (outdated)
- Inline styles (not Tailwind)
- No accessibility
- No tests
- Generic error handling
```

**After (Specialized):**
```
User: "Build a login form with React"

Auto-detected team:
- react-18-specialist (React 18 patterns)
- tailwind-specialist (Tailwind v4 + daisyUI from design team)
- frontend-testing-specialist (behavior-first tests)

Result:
- Functional component with hooks
- daisyUI form components
- ARIA labels, keyboard navigation
- Comprehensive tests (unit + accessibility)
- Proper error states
```

---

### Example 2: Next.js Dashboard

**Before (Monolithic):**
```
User: "Build a Next.js dashboard with user data"

Team:
- frontend-engineer (doesn't know App Router vs Pages Router)

Result:
- Pages Router (outdated)
- Client-side data fetching (slow)
- No SEO optimization
- useState for server data (wrong state type)
- No performance optimization
```

**After (Specialized):**
```
User: "Build a Next.js dashboard with user data"

Auto-detected team:
- nextjs-14-specialist (App Router, SSR strategy)
- state-management-specialist (server state with React Query)
- tailwind-specialist (Tailwind responsive layout from design team)
- frontend-performance-specialist (code splitting, image optimization)
- frontend-testing-specialist (E2E dashboard flows)

Result:
- App Router with SSR
- Server-side data fetching (fast initial load)
- SEO metadata configured
- React Query for server state
- Route-based code splitting
- Optimized images
- E2E tests for critical flows
```

---

### Example 3: Performance Optimization

**Before (Monolithic):**
```
User: "My React app is slow, optimize it"

Team:
- frontend-engineer (generic advice: "use React.memo")

Result:
- Adds React.memo everywhere (over-optimization)
- No profiling done
- No bundle analysis
- Root cause not identified
```

**After (Specialized):**
```
User: "My React app is slow, optimize it"

Auto-detected team:
- frontend-performance-specialist (profiling, Core Web Vitals)
- react-18-specialist (React patterns if needed)

Result:
1. Profiles with Chrome DevTools
2. Identifies bottlenecks:
   - Large bundle (400KB)
   - Excessive re-renders in ProductList
   - No code splitting
3. Implements fixes:
   - Route-based code splitting (400KB → 150KB initial)
   - useMemo for expensive calculations
   - Virtual scrolling for 10,000-item list
4. Verifies improvement:
   - LCP: 3.5s → 1.8s
   - FID: 200ms → 50ms
```

---

## Team Composition Guide

### Simple React App (8 agents)

**Example:** Todo app, calculator, simple form

**Team:**
1. requirement-analyst
2. system-architect
3. accessibility-specialist (design team)
4. **react-18-specialist**
5. **tailwind-specialist** (design team)
6. **frontend-testing-specialist**
7. verification-agent
8. quality-validator

**Why:**
- Basic React patterns (no complex state)
- Styling with Tailwind
- Accessibility and tests (mandatory)

---

### Complex React App (10 agents)

**Example:** E-commerce site, social network, admin dashboard

**Team:**
1. requirement-analyst
2. system-architect
3. design-system-architect (design team)
4. accessibility-specialist (design team)
5. **react-18-specialist**
6. **state-management-specialist** (complex state)
7. **tailwind-specialist** (design team)
8. **frontend-testing-specialist**
9. verification-agent
10. quality-validator

**Why:**
- Complex state needs (UI + server + URL state)
- Design system for consistency
- Full accessibility and test coverage

---

### Next.js App (9 agents)

**Example:** Blog, marketing site, SaaS product

**Team:**
1. requirement-analyst
2. system-architect
3. design-system-architect (design team)
4. accessibility-specialist (design team)
5. **nextjs-14-specialist** (replaces react-18)
6. **tailwind-specialist** (design team)
7. **frontend-testing-specialist**
8. verification-agent
9. quality-validator

**Why:**
- Next.js-specific patterns (App Router, SSR/SSG/ISR)
- SEO optimization
- Image optimization

---

### Performance-Critical App (11 agents)

**Example:** Data visualization, analytics dashboard, high-traffic site

**Team:**
1. requirement-analyst
2. system-architect
3. visual-designer (design team)
4. design-system-architect (design team)
5. accessibility-specialist (design team)
6. **react-18-specialist**
7. **state-management-specialist**
8. **tailwind-specialist** (design team)
9. **frontend-performance-specialist** (optimization)
10. **frontend-testing-specialist**
11. verification-agent
12. quality-validator

**Why:**
- Performance is critical (Core Web Vitals)
- Large datasets (virtual scrolling)
- Complex visualizations

---

## Common Migration Scenarios

### Scenario 1: Migrating Existing React Project

**Old Workflow:**
```
/orca "Update the login component"
→ frontend-engineer does everything
```

**New Workflow:**
```
/orca "Update the login component"
→ Auto-detects: react-18-specialist, tailwind-specialist (design), frontend-testing-specialist
→ Each specialist contributes expertise
```

**Action Required:**
- None! /orca auto-selects the right specialists based on your project

---

### Scenario 2: Explicitly Requesting a Specialist

**Old Workflow:**
```
"Use frontend-engineer to build this form"
```

**New Workflow:**
```
"Use react-18-specialist for the component logic and tailwind-specialist for the UI styling"
```

**Action Required:**
- Update prompts to reference specific specialists instead of generic "frontend-engineer"

---

### Scenario 3: Performance Issues

**Old Workflow:**
```
"Frontend-engineer, optimize this app"
→ Generic advice
```

**New Workflow:**
```
/orca "Optimize app performance"
→ Auto-dispatches: frontend-performance-specialist
→ Profiles, identifies bottlenecks, implements fixes
```

**Action Required:**
- None! Performance work auto-selects frontend-performance-specialist

---

## Breaking Changes

### Change 1: frontend-engineer.md Deprecated

**Impact:** Medium

**Description:**
- `agents/implementation/frontend-engineer.md` marked as DEPRECATED
- Still available for backward compatibility (moved to backup location)
- Will be removed in future version

**Migration Path:**
- Update prompts to use specific specialists instead of "frontend-engineer"
- Use `/orca` for auto-selection based on keywords

**Example:**
```diff
- "frontend-engineer, build this dashboard"
+ "Build this dashboard" (auto-selects nextjs-14-specialist, state-management, styling)
```

---

### Change 2: Team Composition Now Dynamic

**Impact:** Low

**Description:**
- Team size now varies (8-13 agents) based on complexity
- Simple apps get 8 agents, complex apps get 13
- More efficient (don't dispatch unnecessary specialists)

**Migration Path:**
- No action required - /orca handles this automatically

---

### Change 3: Modern Patterns by Default

**Impact:** High (for generated code)

**Description:**
- React 18 Server Components (not class components)
- State type separation (not Redux for everything)
- Tailwind v4 (not inline styles or CSS-in-JS)
- Behavior-first testing (not implementation details)

**Migration Path:**
- Review generated code for new patterns
- Update existing code to match modern patterns
- Refer to specialist docs for pattern examples

---

## Rollback Plan

If you need to rollback to the monolithic frontend-engineer:

### Step 1: Restore Old Agent

```bash
# The old agent is backed up in archive
cp ~/claude-vibe-code/archive/originals/frontend-engineer.md ~/.claude/agents/implementation/frontend-engineer.md
```

### Step 2: Update /orca Command

Edit `~/.claude/commands/orca.md`:

```diff
- Use frontend specialists (react-18, nextjs-14, state-management, styling, performance, testing)
+ Use frontend-engineer (monolithic)
```

### Step 3: Update QUICK_REFERENCE.md

```diff
- **frontend-engineer (DEPRECATED)** | Legacy - use Frontend specialists
+ **frontend-engineer** | Building frontend apps | React, Vue, Next.js, Tailwind, testing
```

### Step 4: Restart Claude Code

```bash
# Reload agents
# Restart Claude Code to pick up changes
```

---

## FAQ

### Q1: Do I need to update my prompts?

**A:** No! `/orca` auto-selects the right specialists based on keywords. You can continue using natural language requests like "Build a React dashboard" and the system will dispatch the appropriate specialists.

---

### Q2: What if I want to use the old frontend-engineer?

**A:** The old agent is backed up in `archive/originals/frontend-engineer.md`. You can restore it using the rollback plan above. However, we recommend using the new specialists for better results with modern patterns.

---

### Q3: How do I know which specialists will be used?

**A:** When you run `/orca`, system-architect analyzes your request and recommends specialists. You'll see a team confirmation before execution. For example:

```
User: "Build a Next.js dashboard with authentication"

system-architect recommends:
- nextjs-14-specialist (App Router, SSR)
- state-management-specialist (auth state)
- styling-specialist (Tailwind UI)
- frontend-testing-specialist (E2E flows)

Do you approve this team?
```

---

### Q4: Can I mix old and new agents?

**A:** Yes, during the transition period. The old frontend-engineer is still available (DEPRECATED). However, you should not dispatch both frontend-engineer AND the new specialists for the same task - choose one approach.

---

### Q5: What if I need a specialist that doesn't exist?

**A:** The 6 specialists cover 95% of frontend work. For edge cases:
- Complex animations → css-specialist (from design team)
- Backend integration → backend-engineer
- Custom build tools → infrastructure-engineer

---

### Q6: How do specialists coordinate?

**A:** The workflow-orchestrator or system-architect acts as coordinator:

1. User makes request
2. system-architect analyzes and recommends specialists
3. Specialists work in parallel where possible (frameworks, styling, testing)
4. verification-agent checks work with meta-cognitive tags
5. quality-validator does final review

---

### Q7: Will this affect my existing projects?

**A:** No impact on existing code. This only affects how NEW frontend features are built. The specialists generate modern patterns by default, but existing code continues to work.

---

### Q8: What about Vue or Svelte?

**A:** Currently, the specialists focus on React 18+ and Next.js 14 (the most common frameworks). For Vue or Svelte:
- Use the deprecated frontend-engineer (has Vue 3 knowledge)
- OR create a vue-specialist following the same template structure

---

### Q9: How do I report issues with the new specialists?

**A:**
1. Check the specialist's file for patterns and examples
2. Review this migration guide
3. If still an issue, open a GitHub issue with:
   - Which specialist had the problem
   - Expected behavior vs actual behavior
   - Example code snippet

---

### Q10: What's next for the frontend team?

**Planned Enhancements:**
- vue-specialist and svelte-specialist (based on demand)
- form-specialist for complex form validation
- Animation specialist for complex interactions
- Integration with design tools (Figma to code)

---

## Summary

**The frontend team rebuild delivers:**
- ✅ **5 focused frontend specialists + design team integration** (vs 1 monolithic agent)
- ✅ **Modern patterns by default** (React 18 Server Components, Tailwind v4, state separation)
- ✅ **Dynamic team composition** (10-15 agents based on complexity)
- ✅ **Better code quality** (specialized expertise, <5% `any` usage)
- ✅ **Faster workflows** (specialists work in parallel)
- ✅ **Clear decision frameworks** (when to use SSR vs SSG, UI vs server state)
- ✅ **Design-frontend separation** (tailwind-specialist from design team handles styling)

**Key Takeaways:**
1. **No action required for most users** - /orca auto-selects specialists
2. **Modern patterns by default** - Server Components, state separation, Tailwind v4
3. **Backward compatible** - Old frontend-engineer still available (DEPRECATED)
4. **Easy rollback** - Restore from archive if needed

**Questions?** See FAQ above or check specialist docs in `~/.claude/agents/frontend-specialists/`

---

**Last Updated:** 2025-10-23
**Version:** 1.0
**Status:** Production Ready
