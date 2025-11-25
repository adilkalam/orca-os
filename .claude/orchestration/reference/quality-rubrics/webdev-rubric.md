# Webdev Quality Rubric - OS 2.0

**Domain:** Web Development (Next.js/React/TypeScript)
**Version:** 1.0
**Last Updated:** 2025-11-20

---

## Scoring Overview

**Total Score:** 0-100 points across 4 dimensions (25 points each)

**Scoring Interpretation:**
- **90-100:** Excellent - Production-ready, best practices followed
- **75-89:** Good - Minor improvements needed
- **60-74:** Fair - Significant issues to address
- **0-59:** Poor - Major rework required

---

## Dimension 1: Design System Compliance (0-25 points)

### 1.1 Design Token Usage (0-10 points)

**Excellent (9-10 points):**
- NO hardcoded colors (all use design tokens)
- NO hardcoded spacing (all use design tokens)
- NO hardcoded typography (all use design tokens)
- Theme tokens imported from design-dna.json
- Consistent token usage across components

**Good (7-8 points):**
- Few hardcoded values (<5 instances)
- Mostly uses design tokens
- Tokens imported correctly
- Some inconsistency

**Fair (5-6 points):**
- Multiple hardcoded values (5-15 instances)
- Inconsistent token usage
- Some components bypass design system
- Token imports missing in places

**Poor (0-4 points):**
- Extensive hardcoding (>15 instances)
- Design tokens rarely used
- No design system integration

**Common Violations:**
```typescript
// ❌ BAD
<div style={{ color: '#007AFF', padding: '16px' }}>

// ✅ GOOD
<div className="text-primary p-4">
// or
<div style={{ color: theme.colors.primary, padding: theme.spacing.md }}>
```

### 1.2 Component Consistency (0-8 points)

**Excellent (7-8 points):**
- All components follow design system patterns
- Consistent styling approach (CSS modules, Tailwind, or styled-components)
- Proper component composition
- Shared components reused
- Design system documented

**Good (5-6 points):**
- Most components consistent
- Some pattern drift
- Good component reuse
- Basic documentation

**Fair (3-4 points):**
- Inconsistent components
- Multiple styling approaches mixed
- Poor reuse
- No documentation

**Poor (0-2 points):**
- No consistency
- Ad-hoc styling everywhere
- No reuse
- Chaotic patterns

### 1.3 Responsive Design (0-7 points)

**Excellent (6-7 points):**
- Mobile-first approach
- Proper breakpoints used
- Fluid typography and spacing
- No horizontal scroll
- Touch targets ≥44px on mobile
- Tested on multiple devices

**Good (4-5 points):**
- Responsive on major breakpoints
- Most elements adapt
- Minor scroll issues
- Mostly tested

**Fair (2-3 points):**
- Basic responsiveness
- Some broken layouts
- Horizontal scroll issues
- Limited testing

**Poor (0-1 points):**
- Not responsive
- Mobile completely broken
- No breakpoints

---

## Dimension 2: Accessibility (0-25 points)

### 2.1 Semantic HTML (0-8 points)

**Excellent (7-8 points):**
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic elements used (`<nav>`, `<main>`, `<article>`, `<section>`)
- No `<div>` where semantic element exists
- Landmarks properly labeled
- Lists for list content

**Good (5-6 points):**
- Mostly semantic
- Good heading hierarchy
- Some `<div>` overuse
- Basic landmarks

**Fair (3-4 points):**
- Some semantic elements
- Heading hierarchy issues
- Heavy `<div>` usage
- Few landmarks

**Poor (0-2 points):**
- All `<div>`s and `<span>`s
- No semantic structure
- No landmarks

**Common Issues:**
```typescript
// ❌ BAD
<div onClick={handleClick}>Button</div>

// ✅ GOOD
<button onClick={handleClick}>Button</button>
```

### 2.2 ARIA & Labels (0-9 points)

**Excellent (8-9 points):**
- All interactive elements labeled
- Proper ARIA roles where needed
- Alt text on all images
- Form labels associated correctly
- Focus indicators visible
- Skip links present
- Live regions for dynamic content

**Good (6-7 points):**
- Most elements labeled
- Some ARIA usage
- Most images have alt text
- Form labels present
- Focus indicators exist

**Fair (4-5 points):**
- Few labels present
- Missing alt text
- Form accessibility poor
- No focus indicators

**Poor (0-3 points):**
- No labels
- No alt text
- Forms inaccessible
- No focus management

### 2.3 Keyboard Navigation (0-8 points)

**Excellent (7-8 points):**
- All interactive elements keyboard accessible
- Logical tab order
- Focus trap in modals
- Escape key closes overlays
- Arrow keys for custom components
- No keyboard traps
- Tested with keyboard only

**Good (5-6 points):**
- Most elements accessible
- Tab order mostly correct
- Basic modal handling
- Some keyboard support

**Fair (3-4 points):**
- Some keyboard issues
- Tab order problems
- Modal keyboard accessibility missing
- Limited support

**Poor (0-2 points):**
- Not keyboard accessible
- Keyboard traps present
- No focus management

---

## Dimension 3: Code Quality & Performance (0-25 points)

### 3.1 TypeScript Quality (0-8 points)

**Excellent (7-8 points):**
- Strict TypeScript mode enabled
- No `any` types (or minimal with justification)
- Proper type definitions for props/state
- Interfaces/types well-defined
- Generic types used appropriately
- No type assertion abuse (`as`)

**Good (5-6 points):**
- TypeScript used correctly
- Few `any` types
- Most things typed
- Some type definitions

**Fair (3-4 points):**
- Heavy `any` usage
- Poor type definitions
- Type assertions everywhere
- Weak typing

**Poor (0-2 points):**
- Essentially JavaScript with TypeScript extension
- All `any` types
- No type safety

**Common Issues:**
```typescript
// ❌ BAD
const data: any = await fetchData();
const result = data as MyType;

// ✅ GOOD
const data = await fetchData();
type DataResponse = { id: string; name: string };
const result: DataResponse = data;
```

### 3.2 React Best Practices (0-9 points)

**Excellent (8-9 points):**
- Proper hooks usage (no rules violations)
- Components properly memoized where needed
- No prop drilling (Context/composition used)
- Proper key usage in lists
- No direct DOM manipulation
- Error boundaries present
- Suspense for async components

**Good (6-7 points):**
- Hooks used correctly
- Some memoization
- Reasonable prop passing
- Keys mostly correct

**Fair (4-5 points):**
- Some hook violations
- No memoization
- Heavy prop drilling
- Missing/incorrect keys

**Poor (0-3 points):**
- Major hook violations
- Anti-patterns everywhere
- Broken component patterns

**React Anti-Patterns:**
```typescript
// ❌ BAD - Hook inside conditional
if (condition) {
  useEffect(() => {...});
}

// ❌ BAD - Mutating props
props.items.push(newItem);

// ❌ BAD - Index as key
{items.map((item, i) => <div key={i}>{item}</div>)}

// ✅ GOOD
useEffect(() => {
  if (condition) {...}
}, [condition]);

const newItems = [...props.items, newItem];

{items.map(item => <div key={item.id}>{item.name}</div>)}
```

### 3.3 Performance (0-8 points)

**Excellent (7-8 points):**
- Lighthouse score >90
- First Contentful Paint <1.5s
- Largest Contentful Paint <2.5s
- Cumulative Layout Shift <0.1
- Image optimization (next/image)
- Code splitting implemented
- No unnecessary re-renders

**Good (5-6 points):**
- Lighthouse score 75-90
- Acceptable Core Web Vitals
- Some optimization
- Basic code splitting

**Fair (3-4 points):**
- Lighthouse score 50-74
- Poor Core Web Vitals
- Little optimization
- No code splitting

**Poor (0-2 points):**
- Lighthouse score <50
- Terrible performance
- No optimization

**Performance Checklist:**
- [ ] Images optimized and lazy loaded
- [ ] Code split by route
- [ ] Bundle size < 200KB initial
- [ ] No blocking resources
- [ ] CSS optimized
- [ ] Fonts preloaded
- [ ] No layout shifts

---

## Dimension 4: Technical Standards (0-25 points)

### 4.1 Next.js Best Practices (0-10 points)

**Excellent (9-10 points):**
- App Router used correctly (if Next.js 13+)
- Server/Client Components properly separated
- Proper data fetching patterns
- Metadata API used
- Route handlers for APIs
- ISR/SSG/SSR used appropriately
- Error handling with error.tsx
- Loading states with loading.tsx

**Good (7-8 points):**
- Good Router usage
- Mostly correct component types
- Decent data fetching
- Some metadata

**Fair (5-6 points):**
- Basic Router usage
- Component separation unclear
- Poor data fetching
- Missing metadata

**Poor (0-4 points):**
- Router misused
- No component separation
- Data fetching broken
- No metadata

**Next.js Patterns:**
```typescript
// ✅ GOOD - Server Component
async function Page() {
  const data = await fetchData(); // Direct fetch
  return <div>{data.title}</div>;
}

// ✅ GOOD - Client Component
'use client';
function InteractiveWidget() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 4.2 SEO (0-8 points)

**Excellent (7-8 points):**
- Metadata complete (title, description, og tags)
- Sitemap.xml generated
- Robots.txt configured
- Schema.org structured data
- Canonical URLs set
- Alt text on all images
- Semantic HTML structure

**Good (5-6 points):**
- Basic metadata present
- Sitemap exists
- Some structured data
- Most images have alt

**Fair (3-4 points):**
- Minimal metadata
- No sitemap
- No structured data
- Missing alt text

**Poor (0-2 points):**
- No SEO consideration
- Missing metadata
- Not search engine friendly

### 4.3 Security (0-7 points)

**Excellent (6-7 points):**
- No hardcoded API keys/secrets
- Environment variables used correctly
- Input sanitized (XSS protection)
- CSRF protection enabled
- Secure headers configured
- No sensitive data in client bundles
- Dependencies up to date

**Good (4-5 points):**
- Most secrets in env vars
- Basic sanitization
- Some security headers
- Recent dependencies

**Fair (2-3 points):**
- Some hardcoded secrets
- Limited sanitization
- Few security headers
- Outdated dependencies

**Poor (0-1 points):**
- API keys in code
- No sanitization
- No security headers
- Vulnerable dependencies

**Security Checklist:**
- [ ] API keys in .env (not committed)
- [ ] User input sanitized
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] HTTPS enforced
- [ ] CSP headers set
- [ ] No eval() usage

---

## Quality Gate Thresholds

**Gate Status by Score:**

| Score | Status | Action |
|-------|--------|--------|
| 90-100 | ✅ **PASS** | Excellent - Ship it |
| 75-89 | ⚠️ **CAUTION** | Good - Address minor issues before ship |
| 60-74 | 🔴 **FAIL** | Significant issues - Fix before proceeding |
| 0-59 | 🚫 **BLOCK** | Major rework required |

**Critical Issues (Automatic FAIL):**
- Hardcoded API keys/secrets in code
- Major accessibility violations (no labels, keyboard inaccessible)
- Design system completely bypassed (>20 hardcoded values)
- Performance Lighthouse score <50
- Security vulnerabilities (XSS, injection flaws)

---

## Scoring Example

### Example: Product Landing Page Review

**Dimension 1: Design System Compliance (21/25)**
- Design Token Usage: 8/10 (2 hardcoded colors)
- Component Consistency: 8/8 (excellent reuse)
- Responsive Design: 5/7 (minor mobile issues)

**Dimension 2: Accessibility (17/25)**
- Semantic HTML: 7/8 (good structure)
- ARIA & Labels: 6/9 (missing some alt text)
- Keyboard Navigation: 4/8 (modal keyboard trap)

**Dimension 3: Code Quality & Performance (19/25)**
- TypeScript Quality: 7/8 (one `any` type)
- React Best Practices: 8/9 (excellent patterns)
- Performance: 4/8 (LCP 3.2s, needs optimization)

**Dimension 4: Technical Standards (20/25)**
- Next.js Best Practices: 9/10 (proper App Router usage)
- SEO: 6/8 (missing some structured data)
- Security: 5/7 (API key in env but CSP missing)

**Total: 77/100 - CAUTION**

**Issues to Address:**
1. ⚠️ Keyboard trap in modal (accessibility)
2. ⚠️ Large Contentful Paint 3.2s (performance)
3. ⚠️ Missing CSP headers (security)
4. ⚠️ 2 hardcoded colors (design system)

**Recommendation:** Address performance and accessibility issues before ship. Acceptable for staging review.

---

## Anti-Pattern Library

### 1. Hardcoded Design Values
```typescript
// ❌ BAD
<div style={{
  color: '#007AFF',
  padding: '16px',
  marginTop: '24px',
  fontSize: '18px'
}}>

// ✅ GOOD (Tailwind)
<div className="text-primary p-4 mt-6 text-lg">

// ✅ GOOD (CSS Modules with tokens)
<div className={styles.card}>
// styles.card uses theme tokens
```

### 2. Div Soup
```typescript
// ❌ BAD
<div>
  <div>
    <div onClick={nav}>Home</div>
    <div onClick={nav}>About</div>
  </div>
</div>

// ✅ GOOD
<nav>
  <ul>
    <li><Link href="/">Home</Link></li>
    <li><Link href="/about">About</Link></li>
  </ul>
</nav>
```

### 3. Prop Drilling Hell
```typescript
// ❌ BAD
<GrandParent user={user}>
  <Parent user={user}>
    <Child user={user}>
      <GrandChild user={user} />

// ✅ GOOD - Context
const UserContext = createContext();
<UserContext.Provider value={user}>
  <GrandChild /> // useContext(UserContext)
```

### 4. Any Type Abuse
```typescript
// ❌ BAD
const data: any = await fetch(url).then(r => r.json());
const user: any = data.user;

// ✅ GOOD
type User = { id: string; name: string; email: string };
type ApiResponse = { user: User };
const data: ApiResponse = await fetch(url).then(r => r.json());
const user: User = data.user;
```

### 5. No Image Optimization
```typescript
// ❌ BAD
<img src="/huge-image.jpg" alt="Product" />

// ✅ GOOD (Next.js)
<Image
  src="/huge-image.jpg"
  alt="Product"
  width={800}
  height={600}
  loading="lazy"
/>
```

### 6. Client Component Everything
```typescript
// ❌ BAD
'use client';
export default function Page() {
  // Entire page is client-side when only button needs interactivity
  return (
    <div>
      <StaticContent /> {/* Doesn't need client */}
      <InteractiveButton /> {/* Needs client */}
    </div>
  );
}

// ✅ GOOD
export default function Page() {
  // Server Component by default
  return (
    <div>
      <StaticContent /> {/* Server */}
      <InteractiveButton /> {/* Client Component */}
    </div>
  );
}
```

---

## Automated Checks (Future)

**Scripts to develop:**
- ESLint for design token violations
- Lighthouse CI integration
- Accessibility checker (axe-core)
- Bundle size monitor
- TypeScript strict mode enforcer
- Security scanner (npm audit, Snyk)

---

## Related Documents

- **Orchestrator Framework:** `.claude/orchestration/reference/orchestrator-framework.md`
- **Design System:** `design-dna.json`, `design-system-vX.X.X.md`
- **Webdev Agent Prompts:** `~/.claude/agents/frontend-*.md`

---

## Changelog

- **2025-11-20:** Initial webdev rubric created

---

_Webdev Quality Rubric v1.0 - Apply to all web deliverables_
