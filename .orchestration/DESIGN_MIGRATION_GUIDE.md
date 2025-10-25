# Design Migration Guide

**Migrating from Monolithic design-engineer to 8 Modular Design Specialists**

---

## Executive Summary

### What Changed

**Before:** 1 monolithic agent (`design-engineer`) handling all design tasks
**After:** 8 specialized agents organized by expertise and workflow stage

| Old (v1.0) | New (v2.0) |
|------------|------------|
| 1 agent handles everything | 8 specialists with deep expertise |
| Generic design approach | Reference-based design system creation |
| Manual accessibility checks | Dedicated accessibility specialist (always included) |
| No systematic design review | 7-phase OneRedOak methodology with visual verification |
| Fixed team size | Dynamic teams (3-8 agents based on complexity) |

### Why We Changed

**The Problem with Monolithic Design:**
```
User: "Design a dashboard"
design-engineer:
  ✗ Creates generic design without understanding user's taste
  ✗ Skips accessibility (no dedicated expertise)
  ✗ No visual verification loop (can't see implementation)
  ✗ Inconsistent quality (trying to do everything)
  ✗ Multiple revision cycles due to shallow expertise
```

**Benefits of Specialized Design:**
```
User: "Design a dashboard"
system-architect → Recommends 6-agent design team
  ✓ design-system-architect: Captures user's taste from references
  ✓ ux-strategist: Optimizes user flows and interactions
  ✓ visual-designer: Creates high-fidelity mockups
  ✓ tailwind-specialist: Implements with Tailwind v4 + daisyUI 5
  ✓ accessibility-specialist: WCAG 2.1 AA compliance (mandatory)
  ✓ design-reviewer: 7-phase review with Playwright screenshots
Result: Higher quality, fewer revisions, explicit taste capture
```

### Key Benefits

1. **Deep Expertise**: Each specialist focuses on their domain (UX, visual, implementation, accessibility)
2. **Scalable Teams**: 3-4 agents for simple tasks, 7-8 for complex design systems
3. **Reference-Based Design**: Captures user taste from examples (no more generic designs)
4. **Visual Verification**: Playwright MCP integration for live browser testing
5. **Mandatory Accessibility**: Dedicated specialist ensures WCAG compliance
6. **Quality Gates**: 7-phase design review before launch (OneRedOak methodology)

---

## The 8 Design Specialists

### Foundation Layer (Establish Design Language)

**1. design-system-architect**
- **When:** Creating design systems from scratch, no existing design tokens
- **Does:** Collects 3-5 design references → extracts principles → generates `.design-system.md` → configures Tailwind v4 + daisyUI 5
- **Key Skill:** Reference-based taste capture (learns what YOU love)
- **Output:** Design tokens (colors, typography, spacing), component patterns
- **File:** `agents/design-specialists/foundation/design-system-architect.md`

**2. ux-strategist**
- **When:** Complex user flows, journey mapping, interaction design
- **Does:** Simplifies flows (Hick's Law), creates journey maps, designs micro-interactions, data viz strategy
- **Key Skill:** UX optimization (progressive disclosure, cognitive load reduction)
- **Output:** User journey maps, interaction specs, flow diagrams
- **File:** `agents/design-specialists/foundation/ux-strategist.md`

### Visual Layer (Create High-Fidelity Designs)

**3. visual-designer**
- **When:** Need mockups, visual refinement, typography/color design
- **Does:** Visual hierarchy (F-pattern, Z-pattern), typography scales, color palettes (OKLCH), composition
- **Key Skill:** Visual design mastery (balance, rhythm, whitespace)
- **Output:** High-fidelity mockups, typography system, color palette
- **File:** `agents/design-specialists/visual/visual-designer.md`

### Implementation Layer (Build the Design)

**4. tailwind-specialist**
- **When:** Using Tailwind CSS (most common)
- **Does:** Translates design system → Tailwind config, implements components with daisyUI, container queries, dark mode
- **Key Skill:** Tailwind v4 + daisyUI 5 expert
- **Output:** Tailwind config, utility-first components
- **File:** `agents/design-specialists/implementation/tailwind-specialist.md`

**5. css-specialist**
- **When:** Complex CSS Grid, custom animations, no framework
- **Does:** Pure CSS implementation, complex Grid layouts, keyframe animations, framework-agnostic
- **Key Skill:** Advanced CSS (Grid, animations, SVG)
- **Output:** Custom CSS files, complex layouts
- **File:** `agents/design-specialists/implementation/css-specialist.md`

**6. ui-engineer**
- **When:** Component implementation (always for frontend)
- **Does:** React/Vue/Angular components, TypeScript, state management, performance optimization, a11y implementation
- **Key Skill:** Component engineering (memo, lazy loading, Context/Zustand/Redux)
- **Output:** Production-ready UI components
- **File:** `agents/design-specialists/implementation/ui-engineer.md`

### Quality Layer (Verify and Review)

**7. accessibility-specialist** (MANDATORY)
- **When:** ALWAYS (accessibility is non-negotiable)
- **Does:** Keyboard nav testing, screen reader testing (NVDA, VoiceOver), contrast validation, touch target sizing
- **Key Skill:** WCAG 2.1 AA compliance
- **Output:** Accessibility audit report, remediation plan
- **File:** `agents/design-specialists/quality/accessibility-specialist.md`

**8. design-reviewer** (MANDATORY)
- **When:** ALWAYS before merge/launch (quality gate)
- **Does:** 7-phase design review (OneRedOak), Playwright MCP integration, tests desktop/tablet/mobile, visual polish validation
- **Key Skill:** Systematic design QA with visual verification
- **Output:** Design review report, screenshot evidence, approval/block decision
- **File:** `agents/design-specialists/quality/design-reviewer.md`

---

## Migration Scenarios

### Simple: Button Component

**Old Approach (1 agent):**
```
User: "Create a primary button component"
design-engineer:
  - Creates generic button design
  - Implements with basic Tailwind
  - Manual accessibility check (often skipped)
  - No visual verification
Result: 1 agent, ~15 minutes, generic result
```

**New Approach (3-4 agents):**
```
User: "Create a primary button component"
/orca detects design work → recommends team

Team (3-4 agents):
1. design-system-architect: Establishes button design tokens (if no design system exists)
2. tailwind-specialist: Implements with Tailwind v4 + daisyUI
3. accessibility-specialist: WCAG compliance (contrast, touch targets, keyboard nav)
4. design-reviewer: Visual verification with Playwright screenshots

Result: 3-4 agents, ~20 minutes, production-quality with accessibility
```

**Migration:** If you previously used `design-engineer` for simple components, now use 3-4 specialists for higher quality.

---

### Medium: Multi-Page Application

**Old Approach (1 agent):**
```
User: "Design a 5-page e-commerce app"
design-engineer:
  - Creates page layouts
  - Basic design system
  - Some components
  - No UX flow optimization
  - Accessibility afterthought
Result: 1 agent, 2-3 hours, inconsistent design, multiple revision cycles
```

**New Approach (5-6 agents):**
```
User: "Design a 5-page e-commerce app"
/orca detects complex design → recommends team

Team (5-6 agents):
1. design-system-architect: Creates design system from user references
2. ux-strategist: Optimizes checkout flow, reduces steps, journey mapping
3. visual-designer: High-fidelity mockups for key pages
4. tailwind-specialist: Implements responsive layouts
5. accessibility-specialist: Ensures WCAG compliance across all pages
6. design-reviewer: Visual verification on desktop/tablet/mobile

Result: 5-6 agents, 3-4 hours, cohesive design, fewer revisions
```

**Migration:** Use `/orca` for multi-page apps. System will recommend appropriate team size.

---

### Complex: Design System from Scratch

**Old Approach (1 agent):**
```
User: "Create a complete design system for our SaaS product"
design-engineer:
  - Generic design tokens
  - Basic component library
  - No user taste capture
  - Limited documentation
Result: 1 agent, 1 day, generic system that doesn't match brand
```

**New Approach (7-8 agents):**
```
User: "Create a complete design system for our SaaS product"
/orca detects design system work → recommends full team

Team (7-8 agents):
1. design-system-architect: Collects 3-5 design references from user → extracts taste
2. ux-strategist: Defines interaction patterns, component behaviors
3. visual-designer: Creates comprehensive visual language (typography, color, spacing)
4. tailwind-specialist: Tailwind v4 config with design tokens
5. css-specialist: Complex animations and custom Grid layouts
6. ui-engineer: React component library with TypeScript
7. accessibility-specialist: WCAG 2.1 AA compliance for all components
8. design-reviewer: Systematic review with visual verification

Result: 7-8 agents, 1-2 days, production-quality system that matches user's taste
```

**Migration:** For design systems, always use full team. The reference-based approach captures your unique taste.

---

## Key Workflow Changes

### NEW: Reference-Based Design System Creation

**Old:** design-engineer created generic designs without understanding user taste
**New:** design-system-architect collects references first

**Workflow:**
```
1. design-system-architect asks: "Show me 3-5 designs you love"
2. User provides URLs or screenshots
3. Architect analyzes: color palettes, typography, spacing, component patterns
4. Extracts principles → generates .design-system.md
5. Configures Tailwind v4 with exact design tokens
6. Rest of team implements using this system
```

**Benefit:** No more generic designs. System learns YOUR taste.

---

### NEW: Visual Verification Loops

**Old:** design-engineer claimed "I built X" without seeing it
**New:** design-reviewer uses Playwright MCP for live browser testing

**Workflow:**
```
1. Implementation completes
2. design-reviewer launches Playwright MCP
3. Tests on:
   - Desktop (1440px)
   - Tablet (768px)
   - Mobile (375px)
4. Captures screenshots for evidence
5. Compares to design spec
6. Blocks if visual issues found
7. Only approves when visually verified
```

**Benefit:** Prevents "looks good in theory, broken in browser" failures.

---

### NEW: 7-Phase Design Review (OneRedOak Methodology)

**Old:** Manual, inconsistent design checks
**New:** Systematic 7-phase review before every launch

**The 7 Phases:**
```
Phase 1: Visual Hierarchy
  - F-pattern/Z-pattern flow
  - Proper emphasis on CTAs
  - Whitespace usage

Phase 2: Typography
  - Readability (line height, letter spacing)
  - Scale consistency
  - Font pairing

Phase 3: Color & Contrast
  - WCAG contrast ratios (4.5:1 text, 3:1 graphics)
  - Color meaning consistency
  - Dark mode validation

Phase 4: Spacing & Layout
  - Consistent spacing scale (4px/8px)
  - Alignment
  - Responsive breakpoints

Phase 5: Component Quality
  - State variations (hover, focus, disabled, error)
  - Interactive feedback
  - Loading states

Phase 6: Accessibility
  - Keyboard navigation
  - Screen reader labels
  - Touch target sizing (≥44x44px)

Phase 7: Responsiveness
  - Mobile-first design
  - Breakpoint testing
  - Touch-friendly interactions
```

**Benefit:** Catches design issues before user sees them.

---

### IMPROVED: Accessibility (Always Included)

**Old:** Accessibility was optional or skipped
**New:** accessibility-specialist is MANDATORY in all design teams

**Why Mandatory:**
- Legal compliance (ADA, Section 508)
- Reaches 15% more users (disability community)
- Better UX for everyone (keyboard nav, contrast, etc.)
- Prevents costly remediation later

**What Changes:**
- accessibility-specialist runs AFTER implementation
- Blocks merge if WCAG 2.1 AA not met
- Tests keyboard nav, screen readers, contrast, touch targets
- Provides remediation plan for violations

---

## How to Request Design Work

### Using /orca (Recommended)

**Simple Request:**
```
/orca "Design a login page"

→ system-architect detects design keywords
→ Recommends: design-system-architect, tailwind-specialist, accessibility-specialist, design-reviewer
→ User confirms team
→ Executes design workflow
```

**Complex Request:**
```
/orca "Create a complete design system for our healthcare platform"

→ system-architect recommends full 8-agent design team
→ User confirms
→ Foundation layer (design-system-architect, ux-strategist) runs first
→ Visual layer (visual-designer) creates mockups
→ Implementation layer (tailwind-specialist, css-specialist, ui-engineer) builds
→ Quality layer (accessibility-specialist, design-reviewer) verifies
```

### Keywords That Trigger Design Specialists

**system-architect or ux-strategist will recommend design specialists when they see:**

- **Foundation:** "design system", "brand", "style guide", "design tokens"
- **UX:** "user flow", "journey", "interaction", "UX optimization"
- **Visual:** "mockup", "visual design", "typography", "colors"
- **Implementation:** "Tailwind", "daisyUI", "CSS Grid", "animation", "React component"
- **Accessibility:** "accessibility", "WCAG", "screen reader", "a11y"
- **Always:** design-reviewer runs before launch (automatic quality gate)

### Integration with Other Teams

**iOS Team:**
```
/orca "Build iOS app with custom design"
→ design-engineer (old monolithic agent) → design-system-architect
→ design-system-architect creates iOS-specific design system
→ swiftui-developer implements with SwiftUI
→ ios-accessibility-tester ensures VoiceOver compliance
```

**Frontend Team:**
```
/orca "Build Next.js dashboard"
→ design-system-architect creates design system
→ tailwind-specialist implements with Tailwind v4
→ ui-engineer builds React components
→ accessibility-specialist ensures WCAG compliance
→ design-reviewer verifies with Playwright
```

**Mobile Team:**
```
/orca "Build React Native app"
→ design-system-architect creates cross-platform design tokens
→ visual-designer creates platform-adaptive designs
→ cross-platform-mobile implements
→ accessibility-specialist tests TalkBack + VoiceOver
```

---

## Backward Compatibility

### Old design-engineer Still Available

**Location:** `agents/specialized/design-engineer.md` (backup)

**When to Use:**
- Legacy projects that depend on the old agent
- Quick prototypes where quality isn't critical
- Learning/experimentation

**Invoke Manually:**
```
Task: "Use design-engineer to create a quick prototype button"
```

**Limitation:** No reference-based design, no visual verification, no systematic review

---

### Recommended: Use New Specialists

**Why New is Better:**
```
Old design-engineer:
  ✗ Generic designs
  ✗ No taste capture
  ✗ Inconsistent accessibility
  ✗ No visual verification
  ✗ Multiple revision cycles

New design specialists:
  ✓ Reference-based designs
  ✓ Captures YOUR taste
  ✓ Mandatory accessibility
  ✓ Visual verification with Playwright
  ✓ Fewer revisions (higher quality upfront)
```

---

## Common Questions

### Q: More agents = more complex?

**A: No. /orca handles orchestration automatically.**

```
You type: "Design a dashboard"
System:
  1. Detects design work
  2. Recommends 5-6 agent team
  3. You confirm (or modify)
  4. Executes in phases automatically
  5. Presents verified results

Complexity hidden from you. Quality improved.
```

---

### Q: When to use which specialist?

**A: See QUICK_REFERENCE.md for quick lookup, or let system-architect decide.**

**Quick Rules:**
- **Simple component (button, card):** 3-4 agents
  - design-system-architect (if no system exists)
  - tailwind-specialist OR ui-engineer
  - accessibility-specialist (mandatory)
  - design-reviewer (mandatory)

- **Multi-page app:** 5-6 agents
  - Add: ux-strategist, visual-designer

- **Design system from scratch:** 7-8 agents
  - Add: css-specialist (for complex layouts/animations)

**Let /orca decide:** It will recommend the right team based on complexity.

---

### Q: What if I don't have design references?

**A: design-system-architect will suggest references or use /inspire.**

**Options:**
1. **Provide your own:** "I love the design of Stripe, Linear, and Notion"
2. **Use /inspire:** Browse curated design collections for your industry
3. **Let architect suggest:** "I'm building a healthcare portal" → architect suggests relevant references

**Why references matter:** Generic designs don't match your brand. References capture your unique taste.

---

### Q: How much longer does the new workflow take?

**A: Similar time, but higher quality (fewer revisions save time overall).**

```
Old (design-engineer):
  Initial: 30 min
  Revision 1: 20 min (generic design didn't match taste)
  Revision 2: 20 min (accessibility issues)
  Revision 3: 15 min (visual bugs in browser)
  Total: 85 min

New (design specialists):
  Foundation: 20 min (reference-based design system)
  Implementation: 30 min
  Quality Review: 15 min (catches issues before user sees)
  Total: 65 min (23% faster, higher quality)
```

**Key:** Upfront quality investment reduces revision cycles.

---

### Q: Can I mix old and new agents?

**A: Not recommended. Stick to one approach per project.**

**Why:**
- Old design-engineer makes generic decisions
- New specialists follow reference-based design system
- Mixing creates inconsistency

**Migration Path:**
1. Finish current work with old agent
2. Switch to new specialists for next feature
3. Gradually migrate design system to reference-based

---

### Q: What about design-engineer in /orca teams?

**A: It's being replaced by design-system-architect in v2.0.**

**Current State (transition period):**
- /orca iOS Team: Still uses design-engineer (will migrate to design-system-architect)
- /orca Frontend Team: Still uses design-engineer (will migrate)
- /orca Design Team: Uses new 8 specialists

**Future (v2.1):**
- All teams use modular design specialists
- design-engineer fully deprecated

---

## Migration Checklist

### For Existing Projects

- [ ] Identify all design-related work in progress
- [ ] Complete current work with old design-engineer
- [ ] Create design system with design-system-architect (collect 3-5 references)
- [ ] Update project documentation to reference new specialists
- [ ] Use /orca for all new design work
- [ ] Run accessibility-specialist audit on existing designs
- [ ] Run design-reviewer 7-phase review before next launch

### For New Projects

- [ ] Start with /orca for design work
- [ ] Collect 3-5 design references you love (for taste capture)
- [ ] Let system-architect recommend design team size
- [ ] Confirm team composition
- [ ] Execute design workflow
- [ ] Verify with design-reviewer before launch
- [ ] Save design system to `.design-system.md` for future use

### For Teams

- [ ] Update team documentation to reference new specialists
- [ ] Share QUICK_REFERENCE.md for fast specialist lookup
- [ ] Establish design reference collection process
- [ ] Make accessibility-specialist mandatory in all design reviews
- [ ] Adopt 7-phase design review checklist
- [ ] Train team on /orca usage for design requests

---

## Resources

**Documentation:**
- `QUICK_REFERENCE.md`: Fast specialist lookup
- `commands/orca.md`: Auto-orchestration details
- `commands/concept.md`: Design exploration workflow
- `commands/visual-review.md`: Visual verification process

**Design Specialist Files:**
- `agents/design-specialists/foundation/design-system-architect.md`
- `agents/design-specialists/foundation/ux-strategist.md`
- `agents/design-specialists/visual/visual-designer.md`
- `agents/design-specialists/implementation/tailwind-specialist.md`
- `agents/design-specialists/implementation/css-specialist.md`
- `agents/design-specialists/implementation/ui-engineer.md`
- `agents/design-specialists/quality/accessibility-specialist.md`
- `agents/design-specialists/quality/design-reviewer.md`

**Old Agent (backup):**
- `agents/specialized/design-engineer.md` (deprecated, use for reference only)

**Examples:**
- See `/orca` execution logs for real-world design team orchestration

---

## Summary

**Old Way:**
- 1 monolithic design-engineer
- Generic designs without taste capture
- Inconsistent accessibility
- No visual verification
- Multiple revision cycles

**New Way:**
- 8 specialized design experts
- Reference-based design (captures YOUR taste)
- Mandatory accessibility specialist
- Visual verification with Playwright
- Systematic 7-phase quality review
- Fewer revisions, higher quality

**Migration:** Use `/orca` for all design work. Let it recommend the right team. Enjoy higher quality with less effort.

**Questions?** See `QUICK_REFERENCE.md` or ask system-architect to recommend the right specialists for your needs.
