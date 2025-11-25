# Nextjs Pipeline Config – OS 2.2

**Purpose:** Shared configuration for the Nextjs (frontend) pipeline.  
Used by: `/orca`, `nextjs-builder`, `nextjs-layout-analyzer`,
`nextjs-standards-enforcer`, `nextjs-design-reviewer`.

---

## 1. Stack Assumptions

Defaults when the project doesn’t specify otherwise:

- **Framework:** Next.js App Router (React).
- **Styling:** Tailwind CSS as primary utility system.
- **Component library:** shadcn/ui where appropriate.
- **Icons:** lucide-react.
- **Language:** TypeScript-first.

Agents SHOULD:
- Detect actual stack from ContextBundle `projectState` + package files.
- Defer to project-specific conventions if they clearly differ (e.g. CSS Modules, Styled Components, vanilla React).

---

## 2. Layout & Design Defaults

For frontend work:

- **Responsive by default**
  - Treat mobile/tablet/desktop breakpoints as required, not optional.
  - Ensure layouts don’t break at common widths (e.g., 320px, 768px, 1024px+).

- **Design system alignment**
  - Use `design-dna.json` and project design docs as law.
  - Prefer existing layout primitives and components over new ad‑hoc wrappers.

- **Accessibility**
  - Semantic HTML where possible (`main`, `header`, `nav`, `section`, etc.).
  - Proper ARIA roles only when necessary (don’t over‑ARIA).
  - Alt text for non‑decorative images.

These defaults are enforced primarily through the standards and design QA gates.

---

## 3. File & Infra Safeguards

Agents in this pipeline SHOULD NOT:
- Regenerate or wholesale rewrite:
  - `next.config.*`, `tailwind.config.*`, `postcss.config.*`.
  - `app/layout.tsx` or equivalent app shell without explicit request.
  - shadcn/ui primitive components (import from `@/components/ui/*` instead).
- Introduce new styling systems without explicit user/orchestrator request.

Safe operations:
- Adding new **feature-level** components under existing feature/module folders.
- Adding small, focused utility files as needed.
- Extending Tailwind or design tokens via agreed standards process (not ad‑hoc).

---

## 4. “Quick Edit” vs Rewrite

Inspired by Vercel v0 and Lovable patterns:

- **Quick edit mode (preferred):**
  - Small, localized changes (1–20 lines) in a small number of files.
  - Example: tweak layout classes, adjust spacing, fix a minor bug, refine copy.
  - The agent should:
    - Read the existing implementation.
    - Make the minimal change needed.
    - Avoid touching unrelated code.

- **Rewrite / new component:**
  - Only when:
    - The existing component is clearly beyond salvage for the requested change, or
    - The user explicitly asks for a new component/page, or
    - Standards/QA highlight systemic issues that require restructuring.
  - Even then: prefer rewriting a **single component** or local subtree, not the whole feature or app.

Agents SHOULD explicitly decide which mode they’re in and keep diffs consistent with that choice.

---

## 5. Frontend Builder Responsibilities (Lovable‑style Behavior)

For `nextjs-builder` specifically:

- **Check before coding**
  - Use ContextBundle + quick reads to see if the requested behavior already exists.
  - If it does, explain to the user/orchestrator where it is instead of duplicating or re‑implementing it.

- **Minimalism**
  - Keep changes as small and focused as possible.
  - Avoid adding dependencies or abstractions unless clearly justified.
  - Don’t do more than what the request and pipeline plan call for.

- **Single coherent change set per implementation pass**
  - Treat each implementation pass as one coherent diff:
    - Make all necessary edits.
    - Run the relevant checks (lint/typecheck/build).
    - Provide one clear summary (files touched, changes, verification status).

These behaviors should be enforced via the Nextjs pipeline spec and standards.
