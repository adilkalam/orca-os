# Design Agent Rebuild: Complete Master Plan

**Date**: 2025-10-23
**Status**: Comprehensive Analysis Complete
**Scope**: Full modular rebuild of design agent system

---

## Executive Summary

**Current State**:
- 1 monolithic design-engineer.md (649 lines)
- Tries to handle: UI design + UX design + design systems + CSS + Tailwind + accessibility + Figma workflows + pixel-perfect implementation + Response Awareness
- Archive contains 15+ specialized design agents with deep expertise

**Gap Analysis**:
- **Expertise Dilution**: Monolithic agent is generalist, not specialist
- **Missing Workflows**: No reference-based taste capture, no visual verification loops, no structured design review
- **Scalability Problem**: Same agent for simple button → complete design system
- **OneRedOak Insights**: Design review workflow not integrated (Playwright MCP, 7-phase review, live environment testing)

**The Recommendation**: Full Modular Rebuild with 8 Core Design Specialists

---

## Part 1: Synthesis of Archive Agents

### Analysis of 15+ Archive Agents

#### Category 1: Design Review & QA (2 agents)

**1. design-review-specialist.md** (108 lines)
- **Expertise**: Elite design review following Stripe/Airbnb/Linear standards
- **Key Features**:
  - 7-phase review process (Preparation → Interaction → Responsiveness → Visual Polish → Accessibility → Robustness → Code Health)
  - Playwright MCP integration for live environment testing
  - "Live Environment First" principle
  - Triage matrix (Blocker/High/Medium/Nitpick)
  - Evidence-based feedback with screenshots
- **Unique Value**: Systematic review methodology + automated testing + real browser interaction

**2. design-verification.md** (49 lines)
- **Expertise**: Lightweight post-implementation verification
- **Key Features**:
  - Typography size verification
  - Spacing consistency checks
  - Visual hierarchy validation
  - Minimum quality gates (≥24pt primary text, ≥44pt touch targets)
- **Unique Value**: Simple checklist-based verification

**Synthesis**:
- design-review-specialist is comprehensive (for pre-merge review)
- design-verification is lightweight (for quick post-implementation checks)
- **KEEP**: design-review-specialist as design-qa-reviewer
- **MERGE**: design-verification checklist into design-qa-reviewer

---

#### Category 2: Design Systems & Architecture (4 agents)

**3. frontend-designer.md** (194 lines)
- **Expertise**: Converting designs → technical specs + implementation guides
- **Key Features**:
  - Design asset collection (Figma/Sketch/XD)
  - Visual decomposition (atomic design patterns)
  - Comprehensive JSON schema generation
  - Frontend design document creation
  - Tech stack assessment (React/Vue/Angular, Tailwind/MUI, etc.)
- **Unique Value**: Design-to-spec translation, architecture planning

**4. ui-designer.md** (327 lines)
- **Expertise**: Senior UI designer with visual design + interaction design
- **Key Features**:
  - Design systems (atomic design, design tokens, component libraries)
  - Typography approach (type scales, font pairing, hierarchy)
  - Color strategy (palettes, accessibility, dark mode)
  - Layout principles (grid systems, responsive breakpoints)
  - Interaction design (micro-interactions, transitions, gestures)
  - Figma/Sketch/Adobe XD mastery
- **Unique Value**: Deep visual design expertise, design system creation

**5. ux-design-specialist.md** (116 lines)
- **Expertise**: UX optimization + premium UI + design systems
- **Key Features**:
  - UX flow simplification (reducing cognitive load, Hick's Law, Nielsen's principles)
  - Premium UI design (expensive aesthetics, glassmorphism, neumorphism)
  - Design systems architecture (atomic design, design tokens, semantic naming)
  - Tailwind CSS + daisyUI implementation
  - Highcharts data visualization
  - Context integration (MCP tools, design history)
- **Unique Value**: UX optimization + premium aesthetics + data visualization

**6. visual-architect.md** (40 lines)
- **Expertise**: Beautiful, functional, accessible interfaces
- **Key Features**:
  - Design philosophy (form follows function, accessibility first, consistency through tokens)
  - Modern CSS (Grid, Flexbox, Container Queries, Layers)
  - Component architectures (Atomic Design)
  - Design systems (tokens, variants, theming)
  - Animation and motion (Framer Motion, GSAP)
- **Unique Value**: Technical design implementation expertise

**Synthesis**:
- frontend-designer = design-to-spec translator (receives Figma → outputs implementation guide)
- ui-designer = visual designer (creates beautiful interfaces, design systems)
- ux-design-specialist = UX optimizer + premium aesthetics + data viz
- visual-architect = technical implementation architect

**RECOMMENDATION**:
Create 2 specialists:
1. **design-system-architect** (combines ui-designer + visual-architect)
   - Creates/maintains design systems
   - Defines tokens, typography, colors, spacing
   - Establishes component patterns
   - Documents design decisions

2. **ux-strategist** (combines ux-design-specialist + parts of frontend-designer)
   - UX flow optimization
   - User journey mapping
   - Interaction design
   - Premium UI aesthetics
   - Data visualization strategy

---

#### Category 3: CSS/Styling Specialists (4 agents)

**7. css-expert.md** (53 lines)
- **Expertise**: Master CSS stylist
- **Key Features**:
  - Grid and Flexbox layouts
  - CSS Variables for theming
  - Advanced selectors
  - CSS animations and transitions
  - Browser compatibility
  - BEM methodology, CSS Modules
- **Unique Value**: Pure CSS expertise (no framework dependency)

**8. tailwind-artist.md** (57 lines)
- **Expertise**: Tailwind CSS mastery
- **Key Features**:
  - Utility composition
  - Custom configurations
  - Plugin development
  - Design tokens
  - Component patterns
  - JIT compilation, arbitrary values
- **Unique Value**: Rapid Tailwind development

**9. tailwind-css-expert.md (tailwind-frontend-expert) (85 lines)
- **Expertise**: Tailwind v4 specialist
- **Key Features**:
  - Tailwind v4 engine (JIT builds, automatic content detection)
  - Container queries (@container, @min-*, @max-*)
  - Design tokens as CSS vars
  - OKLCH color system
  - First-party Vite plugin
  - Utility-first, HTML-driven approach
- **Unique Value**: Modern Tailwind v4 features

**10. tailwind-expert.md** (54 lines)
- **Expertise**: Tailwind CSS for responsive styling
- **Key Features**:
  - Utility-first approach
  - Custom configuration
  - Responsive design capabilities
  - Typography utilities
  - Custom themes
  - PurgeCSS optimization
- **Unique Value**: Standard Tailwind expertise

**Synthesis**:
- css-expert = pure CSS (no framework)
- tailwind-artist = Tailwind rapid development
- tailwind-css-expert = Tailwind v4 modern features
- tailwind-expert = standard Tailwind

**RECOMMENDATION**:
Create 2 specialists:
1. **css-specialist** (css-expert for framework-agnostic styling)
   - Pure CSS expertise
   - Grid/Flexbox mastery
   - CSS animations
   - Browser compatibility
   - Used when Tailwind not appropriate

2. **tailwind-specialist** (combines tailwind-css-expert + tailwind-artist)
   - Tailwind v4 mastery
   - daisyUI 5 integration
   - Container queries
   - OKLCH colors
   - Rapid utility-first development

---

#### Category 4: UI/UX Engineering (4 agents)

**11. ui-engineer.md** (59 lines)
- **Expertise**: Modern frontend with React/Vue/Angular
- **Key Features**:
  - Component-driven architecture
  - TypeScript typing
  - SOLID principles
  - State management patterns
  - Performance optimization
  - Accessibility compliance
  - Backend integration
- **Unique Value**: Clean, maintainable, production-ready code

**12. ui-engineer-duplicate.md** (59 lines)
- **Duplicate of ui-engineer.md**

**13. ui-ux-engineer.md** (88 lines)
- **Expertise**: Elite frontend specialist
- **Key Features**:
  - Component architecture (reusable, composable)
  - Responsive design implementation
  - Performance optimization (lazy loading, code splitting)
  - Modern frontend patterns (SSR, SSG, PWA)
  - State management excellence
  - UI/UX implementation (pixel-perfect from Figma)
- **Unique Value**: Comprehensive frontend engineering

**14. mobile-ux-optimizer.md** (42 lines)
- **Expertise**: Mobile-first UX optimization
- **Key Features**:
  - Theme analysis & consistency
  - Mobile-first optimization (44px touch targets, thumb navigation)
  - UX best practices (progressive disclosure, intuitive navigation)
  - Technical implementation (Flexbox, Grid, responsive breakpoints)
- **Unique Value**: Mobile-specific optimization

**Synthesis**:
- ui-engineer = clean code, backend integration
- ui-ux-engineer = comprehensive frontend (component architecture → performance)
- mobile-ux-optimizer = mobile-first specialist

**RECOMMENDATION**:
Create 1 specialist:
1. **ui-implementation-engineer** (combines ui-engineer + ui-ux-engineer + mobile-ux-optimizer)
   - Implements designs in React/Vue/Angular
   - Component architecture
   - Responsive + mobile-first
   - Performance optimization
   - Accessibility compliance
   - TypeScript + modern patterns

---

### Current System Analysis

**15. design-engineer.md** (649 lines) - Our current monolithic agent

**Structure**:
- Comprehensive Design Capabilities (Visual Design, Tools, Implementation)
- Response Awareness for Design (common failures: CARGO_CULT, COMPLETION_DRIVE, PATTERN_MOMENTUM)
- Design System Implementation (Tailwind v4 + daisyUI 5 tokens)
- Component Implementation (Button with all variants)
- Accessibility Implementation (Modal with focus trap, ARIA, keyboard support)
- Pixel-Perfect Implementation (8px grid, optical alignment, fluid typography)
- Figma-to-Code Workflow (token export, component extraction, checklist)
- Best Practices with Response Awareness
- Quality Gates for Design

**Strengths**:
- Response Awareness integration (meta-cognitive tags)
- Tailwind v4 + daisyUI 5 expertise
- Comprehensive accessibility (WCAG 2.1 AA)
- Pixel-perfect precision methodology
- Figma-to-code workflows

**Weaknesses**:
- Tries to do everything (design systems + UX + CSS + implementation + QA)
- No reference-based taste capture
- No visual verification loops (screenshots)
- No structured design review workflow
- Not scalable (same agent for button → design system)

---

## Part 2: OneRedOak Design-Review Integration

### OneRedOak Workflow Analysis

**Key Components**:
1. **Multi-phase review process**:
   - Phase 0: Preparation (analyze PR, code diff, setup Playwright)
   - Phase 1: Interaction and User Flow (test primary flow, interactive states)
   - Phase 2: Responsiveness Testing (desktop/tablet/mobile viewports)
   - Phase 3: Visual Polish (layout, typography, colors, hierarchy)
   - Phase 4: Accessibility (WCAG 2.1 AA - keyboard, focus, semantic HTML, contrast)
   - Phase 5: Robustness Testing (validation, edge cases, loading/error states)
   - Phase 6: Code Health (component reuse, design tokens, patterns)
   - Phase 7: Content and Console (grammar, errors/warnings)

2. **Playwright MCP Integration**:
   - `browser_navigate`, `browser_click`, `browser_type`, `browser_select_option`
   - `browser_take_screenshot` for visual evidence
   - `browser_resize` for viewport testing
   - `browser_snapshot` for DOM analysis
   - `browser_console_messages` for error checking

3. **Communication Principles**:
   - Problems Over Prescriptions (describe impact, not solutions)
   - Triage Matrix (Blocker/High-Priority/Medium-Priority/Nitpick)
   - Evidence-Based Feedback (screenshots + positive opening)

4. **Design Principles Storage**:
   - Store in CLAUDE.md for persistence
   - Reference across reviews
   - Ensure consistency with brand guidelines

**Integration Strategy**:
- OneRedOak workflow maps directly to **design-qa-reviewer** specialist
- Playwright MCP tools enable visual verification loops
- CLAUDE.md storage enables reference-based design system persistence
- Triage matrix provides structured feedback

---

## Part 3: Addressing AI Design Struggles

### Original Ultra-Think Insights (from design-agent-ultrathink-analysis.md)

**Root Causes of Poor Design**:
1. **Generic Design Problem**: Agents play it safe without explicit taste input → template-like output
2. **Technical Over-Aesthetic Problem**: Focus on code correctness > visual quality
3. **Missing Context Problem**: Lack project identity awareness (brand, audience, stage)
4. **No Visual Feedback Problem**: Can't "see" rendered output → can't judge visually
5. **Taste is Implicit Problem**: User preferences never explicitly captured

**Solution Framework**:
1. **Reference-Based Design System**: Capture taste through examples before designing
2. **Visual Verification Loops**: Screenshot-based feedback + agent self-correction
3. **Specialized Design Agents**: Split responsibilities (not one monolithic agent)
4. **Taste Elicitation Protocol**: Structured conversation to extract preferences
5. **Design Review Workflow**: Structured review with checklist (OneRedOak approach)

**Implementation Roadmap** (from original analysis):
- **Phase 1**: Design System Foundation (reference-based, taste capture)
- **Phase 2**: Visual Verification (Playwright MCP screenshots)
- **Phase 3**: Modular Design Team (specialists)
- **Phase 4**: Testing & Refinement

**Success Metrics**:
- Design revision cycles: 5+ → 2-3
- User satisfaction: "matches my vision" vs "generic"
- Visual issues caught: 80%+ before user review
- Design system usage: 90%+ of projects

---

## Part 4: The Full Rebuild Plan

### Recommended Architecture: 8 Core Design Specialists

#### 1. **design-system-architect** (Design System Foundation)
**Responsibility**: Creates and maintains project design system

**Expertise**:
- Design token definition (colors, typography, spacing, animations)
- Component pattern establishment
- Atomic design methodology
- Brand identity translation to design language
- Design system documentation

**Key Workflows**:
- **Reference Collection**: "Show me 3-5 designs you love"
- **Principle Extraction**: Analyze references → extract design language
- **Design System Creation**: Generate `.design-system.md`
  - Color palettes (primary, secondary, accents, neutrals, semantic)
  - Typography scale (font families, sizes, line heights)
  - Spacing system (8px grid, scale progression)
  - Component patterns (button styles, card designs, form aesthetics)
  - Layout philosophy (grid system, breakpoints, density)

**Outputs**:
- `.design-system.md` (persists across sessions)
- Design token exports (CSS variables, Tailwind config)
- Component pattern library
- Usage guidelines

**Response Awareness**:
- `#PLAN_UNCERTAINTY`: "Should we use 8px or 4px spacing grid?" → Document decision
- `#COMPLETION_DRIVE`: "Have all interaction states been defined?"
- `#PATTERN_MOMENTUM`: "Does this align with established patterns?"

**Tools**: Read, Write, Figma (optional), WebFetch (for design inspiration)

**When to Use**:
- Before any design work (no `.design-system.md` exists)
- When creating new design system
- When updating design system
- When ensuring design consistency

**Source**: Synthesized from ui-designer.md + visual-architect.md + parts of ux-design-specialist.md

---

#### 2. **ux-strategist** (User Experience Optimization)
**Responsibility**: Optimizes user flows and experience strategy

**Expertise**:
- UX flow simplification (cognitive load reduction)
- User journey mapping
- Interaction design patterns
- Premium UI aesthetics (when required)
- Data visualization strategy (Highcharts)
- UX research integration

**Key Workflows**:
- **Flow Analysis**: Identify friction points in user journeys
- **Simplification**: Apply Hick's Law, progressive disclosure, Nielsen's principles
- **Journey Mapping**: Document user flows with decision points
- **Interaction Design**: Define micro-interactions, transitions, gestures
- **Data Viz Strategy**: Choose appropriate chart types, design interactive dashboards

**Outputs**:
- User journey maps
- Interaction specifications
- UX optimization recommendations
- Data visualization designs
- Heuristic evaluation reports

**Response Awareness**:
- `#PLAN_UNCERTAINTY`: "What's the primary user flow vs secondary?"
- `#COMPLETION_DRIVE`: "Are ALL user flows documented?"
- `#ASSUMPTION_BLINDNESS`: "What edge cases haven't we considered?"

**Tools**: Read, Write, Figma (user flows), WebFetch (UX patterns), Context MCP (design history)

**When to Use**:
- Before implementation (UX strategy phase)
- When user feedback indicates confusion
- When optimizing existing flows
- When designing complex interactions
- When creating data visualizations

**Source**: Synthesized from ux-design-specialist.md + parts of frontend-designer.md

---

#### 3. **visual-designer** (Aesthetic Design & Composition)
**Responsibility**: Creates beautiful, polished visual designs

**Expertise**:
- Visual hierarchy and composition
- Typography (type scales, font pairing, readability)
- Color theory (palettes, harmony, contrast, accessibility)
- Layout design (grid systems, spacing, alignment)
- Visual rhythm and balance
- Brand expression through design

**Key Workflows**:
- **Visual Exploration**: Create design variations based on design system
- **Typography Design**: Establish type hierarchy, font pairings
- **Color Palette Creation**: Design accessible color schemes (OKLCH)
- **Layout Composition**: Design grid systems, spacing patterns
- **Visual Polish**: Refine alignment, spacing, visual rhythm

**Outputs**:
- High-fidelity mockups (Figma/Sketch)
- Visual design specifications
- Typography scale definitions
- Color palette documentation
- Layout templates

**Response Awareness**:
- `#CARGO_CULT`: "Is this design trend justified by user needs?"
- `#PATTERN_MOMENTUM`: "Does this match the design system?"
- `#COMPLETION_DRIVE`: "Are all visual states designed (hover, focus, disabled)?"

**Tools**: Figma, Sketch, Adobe XD, Read, Write, WebFetch (design inspiration)

**When to Use**:
- After UX strategy defined
- Before implementation
- When visual design needed
- When creating high-fidelity mockups
- When refining visual polish

**Source**: Extracted from ui-designer.md visual design sections

---

#### 4. **accessibility-specialist** (WCAG Compliance & Inclusive Design)
**Responsibility**: Ensures accessibility compliance (WCAG 2.1 AA minimum)

**Expertise**:
- Semantic HTML structure
- ARIA attributes and roles
- Keyboard navigation patterns
- Screen reader compatibility
- Color contrast validation (4.5:1 text, 3:1 graphics)
- Touch target sizing (min 44x44px)
- Focus management
- Motion preferences (prefers-reduced-motion)

**Key Workflows**:
- **Accessibility Audit**: Run axe DevTools, WAVE, Pa11y
- **Keyboard Testing**: Test Tab order, Enter/Space activation, Escape handling
- **Screen Reader Testing**: Test with NVDA/JAWS/VoiceOver
- **Contrast Validation**: Check all text/graphic contrast ratios
- **Touch Target Verification**: Measure interactive elements
- **Focus Indicator Review**: Ensure visible, high-contrast focus states

**Outputs**:
- Accessibility audit reports
- WCAG compliance checklist
- Remediation recommendations
- ARIA annotation specifications
- Keyboard navigation documentation

**Response Awareness**:
- `#SUGGEST_ACCESSIBILITY`: "This interactive element needs keyboard support"
- `#COMPLETION_DRIVE`: "Have ALL accessibility requirements been met?"
- `#ASSUMPTION_BLINDNESS`: "What happens for screen reader users?"

**Tools**: Read, Bash (axe CLI, Pa11y), Browser DevTools, Screen readers, Contrast checkers

**When to Use**:
- During design phase (design for accessibility)
- During implementation phase (implement accessibility)
- Before launch (accessibility audit)
- When remediating issues
- PROACTIVELY for all interactive elements

**Source**: Extracted from design-engineer.md + ui-designer.md + ux-design-specialist.md accessibility sections

---

#### 5. **tailwind-specialist** (Tailwind CSS v4 + daisyUI 5 Implementation)
**Responsibility**: Implements designs using Tailwind CSS v4 + daisyUI 5

**Expertise**:
- Tailwind v4 engine (JIT, automatic content detection)
- daisyUI 5 component library
- Container queries (@container, @min-*, @max-*)
- OKLCH color system
- Design tokens as CSS variables
- Utility-first approach
- Responsive design (mobile-first)
- Dark mode implementation

**Key Workflows**:
- **Design Token Translation**: Convert design system → Tailwind config
- **Component Implementation**: Build components with Tailwind utilities + daisyUI
- **Responsive Layout**: Implement mobile-first responsive design
- **Dark Mode**: Implement color-scheme utilities
- **Performance**: Ensure minimal bundle size (automatic purge)

**Outputs**:
- Tailwind configuration files
- daisyUI theme customizations
- Component implementations
- Responsive layouts
- Dark mode variants

**Response Awareness**:
- `#CARGO_CULT`: "Use daisyUI component before custom CSS"
- `#PATTERN_MOMENTUM`: "Reference ~/.claude/context/daisyui.llms.txt"
- `#COMPLETION_DRIVE`: "Are all responsive breakpoints implemented?"

**Tools**: Read, Write, Edit, Bash (Tailwind CLI), WebFetch (Tailwind/daisyUI docs)

**When to Use**:
- When implementing designs with Tailwind
- When building component libraries
- When creating responsive layouts
- When implementing dark mode
- When optimizing CSS performance

**Source**: Synthesized from tailwind-css-expert.md + tailwind-artist.md + daisyui.llms.txt

---

#### 6. **css-specialist** (Framework-Agnostic CSS Implementation)
**Responsibility**: Pure CSS implementation (when Tailwind not appropriate)

**Expertise**:
- CSS Grid and Flexbox mastery
- CSS Variables for theming
- Advanced selectors (attribute, pseudo-class, pseudo-element)
- CSS animations and transitions
- Browser compatibility and fallbacks
- CSS Modules and BEM methodology
- Performance optimization

**Key Workflows**:
- **Custom Component Styling**: When daisyUI/Tailwind insufficient
- **Complex Animations**: CSS animations beyond Tailwind utilities
- **Grid Layouts**: Complex CSS Grid implementations
- **Cross-Browser Compatibility**: Vendor prefixes, fallbacks
- **Performance Optimization**: Critical CSS, unused CSS removal

**Outputs**:
- Custom CSS stylesheets
- CSS Grid/Flexbox layouts
- CSS animations and transitions
- Cross-browser compatible styles
- Performance-optimized CSS

**Response Awareness**:
- `#PATH_DECISION`: "Why not use Tailwind?" → Document rationale
- `#PATTERN_MOMENTUM`: "Should this be in design system?"
- `#COMPLETION_DRIVE`: "Tested in all target browsers?"

**Tools**: Read, Write, Edit, Bash (CSS linters), Browser DevTools

**When to Use**:
- When Tailwind/daisyUI insufficient
- When complex custom animations needed
- When CSS Grid layout required
- When framework-agnostic styles needed
- When legacy browser support critical

**Source**: From css-expert.md

---

#### 7. **ui-implementation-engineer** (Component Engineering)
**Responsibility**: Implements UI components in React/Vue/Angular

**Expertise**:
- React/Vue/Angular component architecture
- TypeScript + strict typing
- Component composition patterns
- State management (local vs global)
- Performance optimization (memo, lazy loading, code splitting)
- Accessibility implementation
- Testing (unit, integration, visual regression)
- Responsive implementation

**Key Workflows**:
- **Component Implementation**: Translate designs → React/Vue/Angular components
- **Type Safety**: Define TypeScript interfaces and types
- **State Management**: Implement local state, context, or global store
- **Performance**: Optimize re-renders, bundle size, lazy load
- **Testing**: Write unit tests, integration tests, visual regression tests

**Outputs**:
- React/Vue/Angular components
- TypeScript interfaces
- Storybook stories
- Unit/integration tests
- Component documentation

**Response Awareness**:
- `#PATTERN_MOMENTUM`: "Reuse existing components before creating new"
- `#COMPLETION_DRIVE`: "Are all interaction states implemented?"
- `#ASSUMPTION_BLINDNESS`: "What happens on loading/error?"

**Tools**: Read, Write, Edit, MultiEdit, Bash (npm, test runners), TodoWrite

**When to Use**:
- When implementing designs in code
- When building component libraries
- When refactoring UI code
- When optimizing performance
- When adding interaction behaviors

**Source**: Synthesized from ui-engineer.md + ui-ux-engineer.md + mobile-ux-optimizer.md

---

#### 8. **design-qa-reviewer** (Design Quality Assurance)
**Responsibility**: Comprehensive design review and visual verification

**Expertise**:
- 7-phase review process (OneRedOak methodology)
- Playwright MCP for live browser testing
- Visual regression testing
- Accessibility auditing
- Responsive design verification
- Performance validation
- Code quality review

**Key Workflows**:
- **Phase 0: Preparation**: Analyze PR, code diff, setup Playwright
- **Phase 1: Interaction**: Test primary user flows, all interactive states
- **Phase 2: Responsiveness**: Test desktop (1440px), tablet (768px), mobile (375px)
- **Phase 3: Visual Polish**: Check alignment, spacing, typography, colors, hierarchy
- **Phase 4: Accessibility**: Verify WCAG 2.1 AA (keyboard, screen reader, contrast)
- **Phase 5: Robustness**: Test validation, edge cases, loading/error states
- **Phase 6: Code Health**: Check component reuse, design tokens, patterns
- **Phase 7: Content/Console**: Review text, check browser console

**Outputs**:
- Design review reports
- Screenshots (desktop/tablet/mobile)
- Accessibility audit reports
- Triage matrix (Blocker/High/Medium/Nitpick)
- Remediation recommendations

**Response Awareness**:
- `#COMPLETION_DRIVE`: "ALL phases completed before approval"
- `#SUGGEST_VERIFICATION`: "Take screenshot, measure with DevTools"
- `#ASSUMPTION_BLINDNESS`: "Test with keyboard only, screen reader"

**Tools**: Read, Bash, Playwright MCP (all browser tools), axe DevTools, TodoWrite

**When to Use**:
- Before merging design changes (pre-merge review)
- After implementation (visual verification)
- When user reports design issues
- During accessibility audits
- PROACTIVELY after significant UI changes

**Source**: From design-review-specialist.md + OneRedOak workflow + design-verification.md

---

### Team Compositions

**Simple Design Task** (Button component, single page):
- 3-4 agents:
  1. design-system-architect (if no design system exists)
  2. tailwind-specialist OR ui-implementation-engineer
  3. accessibility-specialist
  4. design-qa-reviewer

**Medium Design Task** (Multi-page app, component library):
- 5-6 agents:
  1. design-system-architect
  2. ux-strategist
  3. visual-designer (for high-fidelity mockups)
  4. tailwind-specialist + ui-implementation-engineer
  5. accessibility-specialist
  6. design-qa-reviewer

**Complex Design Task** (Design system from scratch, complex UX flows):
- 7-8 agents:
  1. design-system-architect
  2. ux-strategist
  3. visual-designer
  4. accessibility-specialist
  5. tailwind-specialist
  6. css-specialist (for custom components)
  7. ui-implementation-engineer
  8. design-qa-reviewer

---

### Directory Structure

```
~/.claude/agents/design-specialists/
├── foundation/
│   ├── design-system-architect.md
│   └── ux-strategist.md
├── visual/
│   └── visual-designer.md
├── implementation/
│   ├── tailwind-specialist.md
│   ├── css-specialist.md
│   └── ui-implementation-engineer.md
├── quality/
│   ├── accessibility-specialist.md
│   └── design-qa-reviewer.md
└── TEMPLATE.md
```

---

## Part 5: Implementation Roadmap

### Phase 1: Foundation Setup (Week 1, Days 1-3)

**Goal**: Create core foundation specialists

**Tasks**:
1. Create directory structure
2. Build TEMPLATE.md with Response Awareness
3. Create **design-system-architect**:
   - Reference collection workflow
   - Design token extraction
   - `.design-system.md` generation
   - Tailwind v4 + daisyUI 5 configuration
4. Create **ux-strategist**:
   - UX flow analysis
   - Journey mapping
   - Interaction design
   - Data visualization strategy
5. Test workflow: "Create design system from references"

**Success Criteria**:
- design-system-architect creates valid `.design-system.md`
- ux-strategist produces actionable UX recommendations
- Workflow integrates seamlessly

---

### Phase 2: Visual & Accessibility (Week 1, Days 4-5)

**Goal**: Add visual design and accessibility

**Tasks**:
1. Create **visual-designer**:
   - Visual hierarchy
   - Typography design
   - Color palette creation
   - Layout composition
   - Figma integration
2. Create **accessibility-specialist**:
   - WCAG 2.1 AA audit
   - Keyboard testing
   - Screen reader testing
   - Contrast validation
   - Remediation recommendations
3. Test workflow: "Design accessible button component"

**Success Criteria**:
- visual-designer creates high-fidelity mockups
- accessibility-specialist catches all WCAG violations
- Components meet WCAG 2.1 AA

---

### Phase 3: Implementation Specialists (Week 2, Days 1-3)

**Goal**: Build implementation layer

**Tasks**:
1. Create **tailwind-specialist**:
   - Tailwind v4 + daisyUI 5 mastery
   - Container queries
   - OKLCH colors
   - Dark mode
   - Responsive design
2. Create **css-specialist**:
   - Pure CSS expertise
   - CSS Grid/Flexbox
   - Animations
   - Browser compatibility
3. Create **ui-implementation-engineer**:
   - React/Vue/Angular components
   - TypeScript typing
   - State management
   - Performance optimization
   - Testing
4. Test workflow: "Implement design system in React + Tailwind"

**Success Criteria**:
- tailwind-specialist generates correct Tailwind config
- ui-implementation-engineer creates type-safe components
- All components performant and tested

---

### Phase 4: Quality Assurance (Week 2, Days 4-5)

**Goal**: Integrate design review workflow

**Tasks**:
1. Create **design-qa-reviewer**:
   - 7-phase review process (OneRedOak)
   - Playwright MCP integration
   - Visual verification loops
   - Triage matrix
   - Evidence-based feedback
2. Test Playwright MCP:
   - Screenshot capture
   - Viewport resizing
   - DOM snapshots
   - Console message capture
3. Test workflow: "Review implemented design"

**Success Criteria**:
- design-qa-reviewer completes all 7 phases
- Screenshots captured automatically
- Issues triaged correctly (Blocker/High/Medium/Nitpick)
- Visual verification catches 80%+ issues

---

### Phase 5: Integration & Testing (Week 3)

**Goal**: Integrate with /orca, test workflows

**Tasks**:
1. Update `/orca` command:
   - Detect design-related keywords
   - Propose appropriate design team (3-8 agents)
   - User confirms team before orchestration
2. Test simple workflow (button component):
   - design-system-architect (if needed)
   - tailwind-specialist
   - accessibility-specialist
   - design-qa-reviewer
3. Test medium workflow (multi-page app):
   - Full 5-6 agent team
4. Test complex workflow (design system from scratch):
   - Full 7-8 agent team
5. Create documentation:
   - DESIGN_MIGRATION_GUIDE.md
   - DESIGN_WORKFLOWS.md
   - Update QUICK_REFERENCE.md

**Success Criteria**:
- /orca correctly identifies design tasks
- Simple workflow completes successfully
- Medium workflow completes successfully
- Complex workflow completes successfully
- All agents follow Response Awareness

---

### Phase 6: Documentation & Launch (Week 3)

**Goal**: Document and deploy

**Tasks**:
1. Create DESIGN_MIGRATION_GUIDE.md:
   - Migration from monolithic design-engineer
   - How to choose specialists
   - Workflow examples
   - Troubleshooting
2. Create DESIGN_WORKFLOWS.md:
   - Reference-based design system creation
   - Visual verification loops
   - Design review process
   - Team composition guidelines
3. Update QUICK_REFERENCE.md:
   - Add 8 design specialists
   - Update team compositions
   - Add design workflow section
4. Update README.md:
   - Design capabilities section
   - OneRedOak integration
   - Playwright MCP requirements
5. Archive old design-engineer.md:
   - Move to `archive/originals/`
   - Keep Response Awareness patterns
6. Commit and deploy

**Success Criteria**:
- All documentation complete
- QUICK_REFERENCE.md updated
- README.md updated
- Old agent archived
- System deployed to production

---

## Part 6: Key Design Patterns

### Reference-Based Design System Creation

```markdown
## Workflow: Create Design System from References

**Goal**: Capture user taste explicitly before designing

### Step 1: Reference Collection (design-system-architect)
Agent: "Before designing, I need to understand your aesthetic preferences.
Can you share:
1. 3-5 websites/apps whose design you love
2. What specifically appeals to you about each
3. Any design directions to avoid"

User provides references (URLs, screenshots, Figma links)

### Step 2: Principle Extraction (design-system-architect)
Agent analyzes references:
- Color palette preferences (vibrant vs muted, monochromatic vs colorful)
- Typography style (modern/classic, serif/sans, size scale)
- Spacing philosophy (tight/generous, consistent/varied)
- Component style (flat/elevated, rounded/sharp, minimalist/detailed)
- Layout preferences (grid-based, asymmetric, card-heavy)

Agent synthesizes into design language:
"Based on your selections:
- Style: Modern + Professional → Clean lines, sans-serif, muted colors
- Colors: Muted + Monochromatic → Soft blue palette (#3B82F6) with gray neutrals
- Spacing: Generous → 8px base unit, 1.5x scale, lots of padding
- Typography: Sans-serif + Large → Clear hierarchy, big headings (48px/36px/24px)
- Components: Flat + Rounded → Soft corners (8px radius), no shadows

Does this match your vision?"

### Step 3: Design System Creation (design-system-architect)
Agent creates `.design-system.md`:
- Color palette (primary, secondary, accents, neutrals, semantic)
- Typography scale (font families, sizes, line heights)
- Spacing system (4px/8px/12px/16px/24px/32px/48px/64px)
- Component patterns (button styles, card designs, form aesthetics)
- Layout philosophy (12-column grid, breakpoints: 640/768/1024/1280)

Saves to project root: `.design-system.md`

### Step 4: Validation (user)
User reviews `.design-system.md`
User provides feedback: "Spacing too generous, reduce to tighter"
Agent updates `.design-system.md`

### Step 5: Token Export (tailwind-specialist)
Agent generates Tailwind config from `.design-system.md`:
- `tailwind.config.js` with custom colors, spacing, typography
- daisyUI theme customization
- CSS variables for runtime theming

#PATTERN_MOMENTUM: Design system persists across sessions
#CARGO_CULT: Don't use generic design systems - always customize
```

---

### Visual Verification Loop

```markdown
## Workflow: Visual Verification with Screenshots

**Goal**: Enable agent self-correction through visual feedback

### Step 1: Implementation (ui-implementation-engineer)
Agent implements button component with all variants

### Step 2: Screenshot Capture (design-qa-reviewer)
Agent uses Playwright MCP:
1. Navigate to component (Storybook or local dev server)
2. Capture screenshots at 3 viewports:
   - Desktop (1440px): `button-desktop.png`
   - Tablet (768px): `button-tablet.png`
   - Mobile (375px): `button-mobile.png`

### Step 3: Visual Analysis (design-qa-reviewer)
Agent analyzes screenshots against `.design-system.md`:
- Visual hierarchy: "Primary button most prominent?"
- Spacing consistency: "Padding matches 16px from design system?"
- Color harmony: "Colors from design system palette?"
- Alignment: "Elements properly aligned?"
- Responsive behavior: "Layout adapts gracefully?"

### Step 4: Self-Correction (if issues found)
Agent identifies issue: "Desktop screenshot shows button padding is 12px, design system specifies 16px"
Agent requests fix from ui-implementation-engineer
Agent re-captures screenshot
Agent verifies fix

### Step 5: User Review (design-qa-reviewer)
Agent presents final screenshots to user:
"Button component implemented. Screenshots attached.
- Desktop (1440px): All variants visible, proper spacing
- Tablet (768px): Layout adapts correctly
- Mobile (375px): Touch targets ≥44px, no horizontal scroll

Ready for approval?"

#SUGGEST_VERIFICATION: Always capture screenshots before user review
#COMPLETION_DRIVE: Don't claim "complete" without visual verification
```

---

### Design Review Process (OneRedOak)

```markdown
## Workflow: 7-Phase Design Review

**Goal**: Comprehensive design review before merge

### Phase 0: Preparation (design-qa-reviewer)
- Read PR description, understand motivation
- Review code diff, identify changed files
- Setup Playwright: Navigate to preview environment
- Configure viewport: 1440x900 desktop

### Phase 1: Interaction and User Flow (design-qa-reviewer)
- Execute primary user flow from PR notes
- Test all interactive states:
  - Hover (visual feedback?)
  - Focus (keyboard indicator visible?)
  - Active (pressed state?)
  - Disabled (clearly indicated?)
- Verify destructive action confirmations (Delete → confirm modal?)
- Assess perceived performance (loading states? optimistic UI?)

**Checklist**:
- [ ] Primary flow works end-to-end
- [ ] All interactive states designed
- [ ] Destructive actions confirmed
- [ ] Loading states clear

### Phase 2: Responsiveness Testing (design-qa-reviewer)
- Resize to desktop (1440px): Capture screenshot
- Resize to tablet (768px): Verify layout adaptation, capture screenshot
- Resize to mobile (375px): Ensure touch optimization, capture screenshot
- Check: No horizontal scrolling, no element overlap

**Checklist**:
- [ ] Desktop layout correct (screenshot)
- [ ] Tablet layout adapts (screenshot)
- [ ] Mobile layout optimized (screenshot)
- [ ] No horizontal scroll
- [ ] No element overlap

### Phase 3: Visual Polish (design-qa-reviewer)
- Layout alignment: Grid-aligned? Consistent spacing?
- Typography hierarchy: Clear heading levels? Readable sizes?
- Color palette: Consistent with design system? Image quality good?
- Visual hierarchy: Most important content most prominent?

**Checklist**:
- [ ] Layout aligned to grid
- [ ] Spacing consistent (8px scale)
- [ ] Typography hierarchy clear
- [ ] Colors from design system
- [ ] Visual hierarchy guides attention

### Phase 4: Accessibility (WCAG 2.1 AA) (design-qa-reviewer)
- Keyboard navigation:
  - Tab through all elements (logical order?)
  - Enter/Space activate buttons?
  - Escape closes modals?
- Focus states: Visible on all interactive elements?
- Semantic HTML: Proper heading hierarchy? Landmark regions?
- Form labels: Associated with inputs?
- Image alt text: Descriptive?
- Color contrast: Run axe DevTools (4.5:1 minimum)

**Checklist**:
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Semantic HTML correct
- [ ] Form labels associated
- [ ] Image alt text descriptive
- [ ] Color contrast ≥4.5:1 (axe: 0 violations)

### Phase 5: Robustness Testing (design-qa-reviewer)
- Form validation: Invalid inputs handled?
- Content overflow: Long text wraps properly?
- Loading states: Spinner/skeleton shown?
- Empty states: "No data" message?
- Error states: Error message clear?
- Edge cases: Tested?

**Checklist**:
- [ ] Form validation works
- [ ] Content overflow handled
- [ ] Loading states shown
- [ ] Empty states designed
- [ ] Error states clear

### Phase 6: Code Health (design-qa-reviewer)
- Component reuse: Reusing existing components?
- Design tokens: Using CSS variables (no magic numbers)?
- Patterns: Following established patterns?

**Checklist**:
- [ ] Components reused (not duplicated)
- [ ] Design tokens used
- [ ] Patterns followed

### Phase 7: Content and Console (design-qa-reviewer)
- Text review: Grammar correct? Clarity good?
- Console: Check browser console (errors? warnings?)

**Checklist**:
- [ ] Text grammar/clarity good
- [ ] Console clean (no errors/warnings)

### Final Report (design-qa-reviewer)
```markdown
### Design Review Summary
[Positive opening: "Great work on the responsive navigation component!"]

### Findings

#### Blockers
- [Accessibility] Focus indicators missing on mobile menu toggle
  ![Screenshot: mobile-focus-issue.png]

#### High-Priority
- [Responsiveness] Menu overlaps content on tablet (768px)
  ![Screenshot: tablet-overlap.png]

#### Medium-Priority / Suggestions
- [Visual Polish] Spacing between nav items inconsistent (16px vs 24px)

#### Nitpicks
- Nit: Button hover transition could be smoother (150ms → 200ms)
```

#COMPLETION_DRIVE: ALL 7 phases required before approval
#SUGGEST_VERIFICATION: Evidence (screenshots) for visual issues
```

---

## Part 7: Success Metrics

### Quantitative Metrics

| Metric | Current (Monolithic) | Target (Modular) |
|--------|---------------------|------------------|
| Design revision cycles | 5-7 iterations | 2-3 iterations |
| Visual issues caught pre-merge | ~40% | ≥80% |
| Design system usage | ~60% | ≥90% |
| Accessibility compliance rate | ~70% | ≥95% (WCAG 2.1 AA) |
| User satisfaction ("matches vision") | ~50% | ≥80% |
| Agent selection accuracy | N/A (1 agent) | ≥90% (right specialist) |

### Qualitative Metrics

**Design Quality**:
- ✅ Design feels personalized (not template-like)
- ✅ Brand consistency across project
- ✅ Design reflects user taste (not generic best practices)
- ✅ Iteration is productive (refining, not rebuilding)

**Workflow Efficiency**:
- ✅ Right-sized teams (3-8 agents vs always 1)
- ✅ Clear specialist responsibilities (no overlap)
- ✅ Parallel execution (multiple agents work concurrently)
- ✅ Design system reuse (not recreating patterns)

**Developer Experience**:
- ✅ Clear agent selection (know which specialist to use)
- ✅ Predictable workflows (consistent processes)
- ✅ Quality gates prevent issues (not firefighting)
- ✅ Documentation comprehensive (easy to understand)

---

## Part 8: Risk Assessment & Mitigation

### Risk 1: Coordination Overhead (8 agents vs 1)
**Severity**: Medium
**Likelihood**: Medium

**Mitigation**:
- Clear agent responsibilities (no overlap)
- Structured workflows (documented processes)
- /orca orchestration (auto-selects team)
- Response Awareness prevents drift

### Risk 2: User Doesn't Provide Design References
**Severity**: Medium
**Likelihood**: High

**Mitigation**:
- design-system-architect proactively asks for references
- Fallback: Structured taste elicitation (multiple-choice)
- Fallback: Use existing design patterns (if available)
- Document: "Generic design due to no references provided"

### Risk 3: Playwright MCP Not Installed
**Severity**: Low
**Likelihood**: Low

**Mitigation**:
- Check MCP availability at workflow start
- Fallback: design-qa-reviewer uses static analysis (no screenshots)
- Document: "Visual verification skipped (Playwright unavailable)"
- User instructions to install Playwright MCP

### Risk 4: Design System Drift Over Time
**Severity**: Medium
**Likelihood**: Medium

**Mitigation**:
- design-system-architect maintains `.design-system.md`
- design-qa-reviewer checks adherence to design system
- Periodic design system audits (quarterly)
- Version control `.design-system.md` (track changes)

### Risk 5: Agent Specialization Too Narrow
**Severity**: Low
**Likelihood**: Low

**Mitigation**:
- Each specialist has "Related Specialists" section
- /orca proposes complete teams (not single agents)
- Agent templates allow cross-training
- Periodic review of specialist boundaries

---

## Part 9: Comparison with Current System

### Monolithic design-engineer.md (Current)

**Strengths**:
- ✅ Comprehensive (covers everything)
- ✅ Response Awareness integrated
- ✅ Tailwind v4 + daisyUI 5 expertise
- ✅ WCAG 2.1 AA accessibility
- ✅ Pixel-perfect precision
- ✅ Figma-to-code workflows

**Weaknesses**:
- ❌ Expertise dilution (generalist, not specialist)
- ❌ Not scalable (same agent for button → design system)
- ❌ No reference-based taste capture
- ❌ No visual verification loops (screenshots)
- ❌ No structured design review (OneRedOak)
- ❌ No parallel execution (1 agent does all work)

### Modular Design Specialists (Proposed)

**Strengths**:
- ✅ Deep expertise (8 specialists)
- ✅ Scalable (3-8 agents based on complexity)
- ✅ Reference-based design system creation
- ✅ Visual verification loops (Playwright MCP)
- ✅ Structured design review (OneRedOak 7-phase)
- ✅ Parallel execution (multiple agents work concurrently)
- ✅ Response Awareness preserved
- ✅ Clear agent selection (/orca orchestration)

**Weaknesses**:
- ❌ More complex (8 agents vs 1)
- ❌ Requires orchestration (/orca)
- ❌ More documentation needed
- ❌ Learning curve for users

**Trade-off Analysis**:
- Complexity: Increased (8 agents vs 1)
- Quality: Significantly improved (specialist expertise)
- Scalability: Massively improved (right-sized teams)
- Workflows: Enhanced (reference-based, visual verification, review)
- User Experience: Improved (clearer processes, better outcomes)

**Recommendation**: ✅ **Proceed with modular rebuild**
- Benefits (quality, scalability, workflows) outweigh costs (complexity)
- /orca orchestration mitigates coordination overhead
- Documentation addresses learning curve
- Maintains Response Awareness (core requirement)

---

## Part 10: Next Steps

### Immediate Actions (This Session)

1. **Get User Approval**:
   - Present this master plan
   - Confirm modular approach
   - Clarify any questions
   - Get go/no-go decision

2. **If Approved: Begin Phase 1**:
   - Create directory structure
   - Build TEMPLATE.md
   - Create design-system-architect
   - Create ux-strategist
   - Test reference-based workflow

### Timeline Summary

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Foundation | 3 days | design-system-architect, ux-strategist |
| Phase 2: Visual & Accessibility | 2 days | visual-designer, accessibility-specialist |
| Phase 3: Implementation | 3 days | tailwind-specialist, css-specialist, ui-implementation-engineer |
| Phase 4: Quality Assurance | 2 days | design-qa-reviewer + Playwright MCP integration |
| Phase 5: Integration & Testing | 5 days | /orca updates, workflow testing |
| Phase 6: Documentation & Launch | 3 days | Migration guide, workflows, launch |
| **Total** | **18 days (2.5-3 weeks)** | **8 specialists + documentation** |

---

## Conclusion

**The Problem**: AI agents struggle with design because:
1. Generic output (no explicit taste input)
2. Technical focus (code > aesthetics)
3. Missing context (brand, audience, stage)
4. No visual feedback (can't "see" rendered output)
5. Implicit taste (preferences never captured)

**The Solution**: Full modular rebuild with:
1. **Reference-based design system** (explicit taste capture)
2. **Visual verification loops** (Playwright MCP screenshots)
3. **8 specialized design agents** (deep expertise)
4. **Structured design review** (OneRedOak 7-phase)
5. **Scalable team compositions** (3-8 agents based on complexity)

**Expected Outcomes**:
- Design revision cycles: 5-7 → 2-3 iterations
- Visual issues caught: 40% → 80%+
- Design system usage: 60% → 90%+
- Accessibility compliance: 70% → 95%+
- User satisfaction: 50% → 80%+

**This is the iOS rebuild playbook applied to design.**

**Next**: User approval → Execute Phase 1 → Iterate to completion.

---

**END OF MASTER PLAN**

_This document synthesizes:_
- _15+ archive design agents_
- _OneRedOak design-review workflow_
- _Original ultra-think analysis on AI design struggles_
- _Current design-engineer.md analysis_
- _iOS team rebuild learnings_

_Comprehensive. Methodical. Ready to execute._
