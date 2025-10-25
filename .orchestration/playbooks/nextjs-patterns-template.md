# Next.js Development Playbook Template

**Version:** 1.0.0
**Project Type:** Next.js
**Last Updated:** 2025-10-24

This playbook contains curated patterns for Next.js 14+ development with App Router, React Server Components, and modern React 18 patterns. Patterns are organized by confidence level and updated based on real-world outcomes.

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

## ✓ Production-Ready Patterns

### App Router & Architecture

**✓ App Router for Next.js 14+ Projects**
*Pattern ID: nextjs-pattern-001 | Counts: 0/0*

**Context:** New Next.js 14+ projects

**Strategy:** Use nextjs-14-specialist with App Router architecture

**Evidence:** Modern Next.js standard, better performance, streaming support (template)

---

**✓ Server Components by Default**
*Pattern ID: nextjs-pattern-002 | Counts: 0/0*

**Context:** Next.js 14 App Router development

**Strategy:** Use react-18-specialist with Server Components as default, Client only when needed

**Evidence:** Reduces bundle size, faster initial load, better SEO (template)

---

**✓ Parallel Routes for Complex Layouts**
*Pattern ID: nextjs-pattern-010 | Counts: 0/0*

**Context:** Multi-panel dashboards or modals

**Strategy:** Use @folder convention for parallel routes and slots

**Evidence:** Independent loading states, better UX for complex layouts (template)

---

### Data Fetching & Rendering

**✓ Async Server Components for Data Fetching**
*Pattern ID: nextjs-pattern-003 | Counts: 0/0*

**Context:** Server-side data fetching in App Router

**Strategy:** Fetch data directly in async Server Components, avoid useEffect

**Evidence:** Eliminates waterfalls, automatic request deduplication (template)

---

**✓ Streaming with Suspense Boundaries**
*Pattern ID: nextjs-pattern-008 | Counts: 0/0*

**Context:** Slow data fetching scenarios

**Strategy:** Wrap slow components in Suspense, stream HTML progressively

**Evidence:** Faster Time to First Byte, better perceived performance (template)

---

**✓ ISR for Dynamic but Cacheable Content**
*Pattern ID: nextjs-pattern-011 | Counts: 0/0*

**Context:** Content that updates periodically (blogs, product pages)

**Strategy:** Use revalidate option for Incremental Static Regeneration

**Evidence:** Static performance with dynamic updates, reduced origin load (template)

---

### API & Mutations

**✓ Route Handlers for API Endpoints**
*Pattern ID: nextjs-pattern-004 | Counts: 0/0*

**Context:** Backend API in Next.js 14 App Router

**Strategy:** Use Route Handlers (route.ts) instead of API routes

**Evidence:** Native to App Router, better TypeScript support, streaming responses (template)

---

**✓ Server Actions for Mutations**
*Pattern ID: nextjs-pattern-009 | Counts: 0/0*

**Context:** Form submissions and data mutations

**Strategy:** Use Server Actions with 'use server' directive for mutations

**Evidence:** Type-safe, progressive enhancement, no API route needed (template)

---

### SEO & Performance

**✓ Metadata API for SEO**
*Pattern ID: nextjs-pattern-005 | Counts: 0/0*

**Context:** SEO optimization in App Router

**Strategy:** Use metadata exports and generateMetadata for dynamic SEO

**Evidence:** Type-safe, supports streaming, better crawlability (template)

---

**✓ next/image for Automatic Optimization**
*Pattern ID: nextjs-pattern-006 | Counts: 0/0*

**Context:** Image-heavy Next.js applications

**Strategy:** Always use next/image component, never raw <img> tags

**Evidence:** Automatic WebP conversion, lazy loading, responsive sizes (template)

---

**✓ next/font for Font Optimization**
*Pattern ID: nextjs-pattern-007 | Counts: 0/0*

**Context:** Custom fonts in Next.js

**Strategy:** Use next/font/google or next/font/local for font loading

**Evidence:** Zero layout shift, automatic subsetting, self-hosted (template)

---

### React 18 Optimization

**✓ React 18 Hooks Optimization**
*Pattern ID: nextjs-pattern-012 | Counts: 0/0*

**Context:** Client Components with performance needs

**Strategy:** Use react-18-specialist for useMemo, useCallback, useTransition

**Evidence:** Prevents unnecessary re-renders, better perceived responsiveness (template)

---

### Design & UI

**✓ Design System Integration**
*Pattern ID: nextjs-pattern-013 | Counts: 0/0*

**Context:** Next.js projects requiring design consistency

**Strategy:** Use tailwind-specialist + design-system-architect for component libraries

**Evidence:** Consistent UI, faster development, maintainable design tokens (template)

---

## ✗ Anti-Patterns to Avoid

**✗ Avoid Pages Router for New Projects**
*Pattern ID: nextjs-antipattern-001 | Counts: 0/0*

**Context:** New Next.js 14+ projects

**Strategy:** AVOID Pages Router, use App Router instead

**Evidence:** Pages Router is legacy, lacks Server Components, streaming (template)

---

**✗ Don't Overuse Client Components**
*Pattern ID: nextjs-antipattern-002 | Counts: 0/0*

**Context:** App Router development

**Strategy:** AVOID marking everything 'use client', default to Server Components

**Evidence:** Increases bundle size, loses streaming benefits, worse performance (template)

---

**✗ Avoid API Routes in App Router**
*Pattern ID: nextjs-antipattern-003 | Counts: 0/0*

**Context:** Next.js 14 App Router

**Strategy:** AVOID pages/api/* pattern, use Route Handlers instead

**Evidence:** API routes don't support streaming, incompatible with App Router conventions (template)

---

**✗ Don't Fetch in useEffect**
*Pattern ID: nextjs-antipattern-004 | Counts: 0/0*

**Context:** Server-renderable data fetching

**Strategy:** AVOID useEffect for data fetching, use async Server Components

**Evidence:** Creates waterfalls, loses SSR benefits, worse Core Web Vitals (template)

---

## ○ Context-Dependent Patterns

**○ Pages Router for Migration Scenarios**
*Pattern ID: nextjs-neutral-001 | Counts: 0/0*

**Context:** Migrating existing Next.js 12-13 apps

**Strategy:** Pages Router acceptable for gradual migration, not greenfield

**Evidence:** Full rewrite expensive, incremental adoption safer (template)

---

## How This Playbook Evolves

This template serves as the starting point. As /orca executes Next.js projects:

1. **orchestration-reflector** analyzes successful/failed specialist choices after each session
2. **playbook-curator** updates helpful/harmful counts based on outcomes
3. Patterns with `helpful_count > 5` get promoted (higher confidence)
4. Patterns with `harmful_count > helpful_count × 3` trigger apoptosis (deletion after 7-day grace period)
5. New patterns discovered in production get appended with evidence

**Next update:** Automatically after first Next.js project completion
