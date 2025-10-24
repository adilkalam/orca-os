# Workflows Guide

**Detailed scenario walkthroughs for common tasks**

---

## Table of Contents

- [Scenario 1: Building a New Feature](#scenario-1-building-a-new-feature)
- [Scenario 2: Fixing Multiple Bugs](#scenario-2-fixing-multiple-bugs)
- [Scenario 3: Redesigning Existing UI](#scenario-3-redesigning-existing-ui)
- [Scenario 4: iOS App Development](#scenario-4-ios-app-development)
- [Scenario 5: Performance Optimization](#scenario-5-performance-optimization)

---

## Scenario 1: Building a New Feature

**Use case:** You want to add a new feature to your web app.

**Example:** Add a real-time notification system

---

### Phase 1: Concept Exploration

**Your input:**

```bash
/concept "add real-time notifications to the app for user actions"
```

---

**System response:**

```
🎨 CONCEPT EXPLORATION
   Agent: design-master
   Skill: brainstorming

Let me understand your needs through some questions...

Q1: What types of notifications? (user actions, system alerts, messages, etc.)
```

**You answer:** "User actions - likes, comments, follows, mentions"

```
Q2: How should they be displayed? (toast, dropdown, dedicated page, badge)
```

**You answer:** "Dropdown from header with badge count, plus toast for immediate actions"

```
Q3: Real-time tech preference? (WebSocket, Server-Sent Events, polling)
```

**You answer:** "WebSocket for real-time, fallback to polling"

```
Q4: Persistence needed? (store in DB, mark as read, history)
```

**You answer:** "Yes - store in DB, mark as read, show last 30 days"

---

**System analyzes:**

```
🧠 ANALYZING YOUR REQUIREMENTS

Based on your input, I'm exploring 3 approaches:

APPROACH A: Simple Toast Notifications
   Pros: Easy to implement, non-intrusive
   Cons: No history, notifications disappear
   Best for: Simple alerts, low frequency

APPROACH B: Dropdown + Toast Hybrid
   Pros: Best UX, history preserved, immediate feedback
   Cons: More complex implementation
   Best for: Your use case ✓

APPROACH C: Dedicated Notifications Page
   Pros: Full management interface
   Cons: Extra navigation, less immediate
   Best for: High-frequency enterprise apps

📋 RECOMMENDATION: Approach B (Hybrid)

Why:
- Dropdown provides history and management
- Toast gives immediate feedback for urgent actions
- Badge shows unread count at a glance
- WebSocket ensures real-time delivery
- DB persistence allows cross-device sync

COMPONENT BREAKDOWN:
├── NotificationDropdown.tsx (main UI)
├── NotificationItem.tsx (individual notification)
├── NotificationBadge.tsx (unread count)
├── Toast.tsx (immediate alerts)
├── useNotifications.tsx (WebSocket hook)
└── notificationService.ts (API + WebSocket client)

DATABASE SCHEMA:
- notifications table
  - id, user_id, type, content, read, created_at

API ENDPOINTS:
- GET /api/notifications (fetch history)
- POST /api/notifications/:id/read (mark as read)
- DELETE /api/notifications/:id (dismiss)
- WebSocket /ws/notifications (real-time stream)

Would you like me to create a detailed design brief?
```

**You type:** "yes"

```
✅ CONCEPT BRIEF CREATED

   File: docs/design-briefs/notifications-system-20251021.md

   Includes:
   - Architecture diagram
   - Component breakdown
   - API specification
   - WebSocket protocol
   - Database schema
   - UX flow diagrams
   - Implementation checklist

   Time spent: 15 minutes

   Ready to implement? Use /enhance
```

---

### Phase 2: Implementation

**Your input:**

```bash
/enhance "implement notifications system from concept brief"
```

---

**System response:**

```
🔍 ANALYZING TASK

   Loading concept brief...
   ✓ docs/design-briefs/notifications-system-20251021.md

   Detected:
   - Frontend: React components + WebSocket
   - Backend: API endpoints + database
   - Real-time: WebSocket server

   Workflow: full-stack-development
   Agents: frontend-developer, python-pro (backend), design-master

📋 EXECUTION PLAN

   Wave 1: Database & API (python-pro)
   Wave 2: Frontend Components (frontend-developer + design-master)
   Wave 3: WebSocket Integration (frontend-developer + python-pro)
   Wave 4: Quality Gate (code-reviewer-pro)

   Estimated time: 90-120 minutes

   Proceed? (yes/no)
```

**You type:** "yes"

---

```
🏃 WAVE 1 - DATABASE & API

   Agent: python-pro
   Skill: test-driven-development

   ✓ Created migration: add_notifications_table.sql
   ✓ Created model: Notification (SQLAlchemy)
   ✓ Created API routes:
     - GET /api/notifications
     - POST /api/notifications/:id/read
     - DELETE /api/notifications/:id
   ✓ Wrote tests (RED): 8 tests
   ✓ Implemented features (GREEN): 8 passing
   ✓ Added pagination, filtering

   Duration: 25 minutes

🎨 WAVE 2 - FRONTEND COMPONENTS

   Agents: frontend-developer + design-master (parallel)

   frontend-developer (TDD):
   ✓ NotificationDropdown.tsx + tests
   ✓ NotificationItem.tsx + tests
   ✓ NotificationBadge.tsx + tests
   ✓ Toast.tsx + tests
   ✓ useNotifications hook + tests
   ✓ 15 tests passing

   design-master:
   ✓ Spacing: 8px grid system
   ✓ Typography: Readable notification text
   ✓ Layout: Dropdown positioning, z-index
   ✓ Colors: Unread vs read states
   ✓ Animation: Smooth toast transitions

   Duration: 35 minutes

⚡ WAVE 3 - WEBSOCKET INTEGRATION

   Agents: frontend-developer + python-pro (coordinated)

   python-pro:
   ✓ WebSocket server (FastAPI)
   ✓ Broadcast to user's connections
   ✓ Heartbeat for connection health

   frontend-developer:
   ✓ WebSocket client in useNotifications
   ✓ Auto-reconnect logic
   ✓ Fallback to polling if WebSocket fails
   ✓ Tests for connection states

   Duration: 30 minutes

🛡️ QUALITY GATE

   Agent: code-reviewer-pro

   ✓ Build passes (frontend + backend)
   ✓ All tests pass (23/23)
   ✓ TypeScript strict mode
   ✓ Security: WebSocket auth token validation
   ✓ Performance: Debounced badge updates
   ✓ Accessibility: Keyboard navigation, screen reader
   ✓ Error handling: Network failures graceful

   Result: ✅ APPROVED

✅ COMPLETE

   Total time: 95 minutes

   Files created:
   Frontend:
   - components/notifications/NotificationDropdown.tsx
   - components/notifications/NotificationItem.tsx
   - components/notifications/NotificationBadge.tsx
   - components/notifications/Toast.tsx
   - hooks/useNotifications.tsx
   - services/notificationService.ts
   - __tests__/notifications/*.test.tsx (15 tests)

   Backend:
   - api/routes/notifications.py
   - models/notification.py
   - websocket/notification_server.py
   - migrations/add_notifications_table.sql
   - tests/test_notifications.py (8 tests)

   Tests: 23 passing
   Quality: Production-ready
   Ready to deploy!
```

---

### Phase 3: Visual QA (Optional)

**Your input:**

```bash
/visual-review "http://localhost:3000"
```

```
📸 CAPTURING SCREENSHOTS

   ✓ Desktop: Dropdown open
   ✓ Desktop: Toast notification
   ✓ Mobile: Dropdown responsive

🔍 VISUAL ANALYSIS

   design-master:

   SPACING:
   ✓ Dropdown padding: 16px ✓
   ✓ Item spacing: 12px ✓
   ✓ Badge positioning: correct

   TYPOGRAPHY:
   ✓ Notification text: 14px ✓
   ✓ Timestamp: 12px gray ✓
   ✓ Line height: 1.5 ✓

   LAYOUT:
   ✓ Dropdown width: 320px (desktop) ✓
   ✓ Mobile: Full width ✓
   ✓ Z-index: Above other elements ✓

   INTERACTION:
   ✓ Hover states working
   ✓ Mark as read visual feedback
   ✓ Toast auto-dismiss timing correct

   📊 RESULT: 100% design system compliance

   ✅ Ready to ship!
```

---

**Total time:** 110 minutes (concept + implementation + QA)

**Result:** Production-ready notifications system with tests, real-time, and QA

---

## Scenario 2: Fixing Multiple Bugs

**Use case:** After a testing sprint, you have 10 bugs to fix.

**Example:** Bug list from QA team

---

### Your Input

```bash
/agentfeedback "
1. Login button doesn't respond on mobile Safari
2. Dashboard charts crash when data is empty
3. User search returns duplicate results
4. Profile image upload shows wrong file type error
5. Dark mode toggle doesn't persist across sessions
6. Table sorting breaks when column has null values
7. Form validation messages are cut off
8. API requests timeout after 5 seconds
9. Notification badge shows wrong count
10. Footer social links have wrong URLs
"
```

---

### System Response

```
📊 PARSING FEEDBACK

   Received: 10 items
   Analyzing severity, type, and dependencies...

🔴 CRITICAL (Breaks functionality)
   1. Login button doesn't respond on mobile Safari
   2. Dashboard charts crash when data is empty
   8. API requests timeout after 5 seconds

🟡 IMPORTANT (Degrades UX)
   3. User search returns duplicate results
   4. Profile image upload shows wrong file type error
   5. Dark mode toggle doesn't persist
   6. Table sorting breaks with null values
   9. Notification badge shows wrong count

🟢 POLISH (Visual/minor issues)
   7. Form validation messages cut off
   10. Footer social links wrong URLs

🎯 AGENT ASSIGNMENT

   Critical issues:
   - Mobile bug → frontend-developer (iOS Safari specialist)
   - Chart crash → frontend-developer (error handling)
   - API timeout → python-pro (backend performance)

   Important issues:
   - Search duplicates → python-pro (database query)
   - Image upload → frontend-developer (file validation)
   - Dark mode → frontend-developer (localStorage)
   - Table sorting → frontend-developer (null handling)
   - Badge count → frontend-developer (state sync)

   Polish:
   - Form messages → design-master (layout fix)
   - Footer links → frontend-developer (quick fix)

📋 EXECUTION PLAN

   Wave 1 (Critical): 3 agents in parallel
   Wave 2 (Important): 5 tasks, 2 agents in parallel
   Wave 3 (Polish): 2 tasks, 2 agents in parallel
   Quality Gate: code-reviewer-pro

   Estimated time: 60 minutes

   Proceed?
```

**You type:** "yes"

---

```
🏃 WAVE 1 - CRITICAL FIXES (Parallel)

   Agent 1: frontend-developer
   Task: Mobile Safari login button

   Investigation:
   - Tested on iOS Safari 17
   - Issue: Touch event not registered (z-index conflict)

   Fix:
   ✓ Increased z-index from 10 to 100
   ✓ Added touch-action: manipulation
   ✓ Verified on iOS Safari 16, 17

   Duration: 12 minutes

   ---

   Agent 2: frontend-developer
   Task: Dashboard chart crash

   Investigation:
   - Chart library throws on empty data array
   - No null checks before rendering

   Fix:
   ✓ Added data validation before chart render
   ✓ Show "No data available" message when empty
   ✓ Wrote test for empty data case

   Duration: 10 minutes

   ---

   Agent 3: python-pro
   Task: API timeout

   Investigation:
   - Default timeout: 5s (too short for complex queries)
   - Database queries not optimized

   Fix:
   ✓ Increased timeout to 30s
   ✓ Added database indices on frequently queried columns
   ✓ Optimized slow query (N+1 problem)

   Duration: 18 minutes

🏃 WAVE 2 - IMPORTANT FIXES (Parallel)

   Agent: python-pro
   Tasks: Search duplicates

   Investigation:
   - SQL query missing DISTINCT clause

   Fix:
   ✓ Added DISTINCT to search query
   ✓ Added test for duplicate prevention

   Duration: 8 minutes

   ---

   Agent: frontend-developer
   Tasks: Image upload, dark mode, table sorting, badge count

   1. Image upload:
   ✓ Fixed MIME type validation
   ✓ Added .jpg to allowed types

   2. Dark mode:
   ✓ Added localStorage persistence
   ✓ Load on mount from localStorage

   3. Table sorting:
   ✓ Handle null values (sort to end)
   ✓ Added test for null handling

   4. Badge count:
   ✓ Fixed state sync issue (was stale)
   ✓ Use real-time count from WebSocket

   Duration: 25 minutes

🏃 WAVE 3 - POLISH (Parallel)

   Agent: design-master
   Task: Form validation messages

   Investigation:
   - Messages overflow container (no wrap)

   Fix:
   ✓ Added word-wrap: break-word
   ✓ Max-width: 300px
   ✓ Verified on long messages

   Duration: 5 minutes

   ---

   Agent: frontend-developer
   Task: Footer social links

   Fix:
   ✓ Updated URLs to correct social profiles

   Duration: 2 minutes

🛡️ QUALITY GATE

   Agent: code-reviewer-pro

   Validation:
   ✓ All 10 items addressed
   ✓ Build passes
   ✓ Tests pass (18 new tests)
   ✓ No regressions introduced
   ✓ Security: No new vulnerabilities
   ✓ Performance: API faster (timeout fix + DB optimization)

   Regression Testing:
   ✓ Login works on desktop
   ✓ Charts work with normal data
   ✓ Search works correctly
   ✓ Other forms not affected

   Result: ✅ APPROVED

✅ COMPLETE

   Fixed: 10/10 bugs (100%)
   Total time: 62 minutes
   Regressions: 0
   New tests: 18 passing
   Quality: Production-ready

   Summary by severity:
   🔴 Critical: 3/3 fixed
   🟡 Important: 5/5 fixed
   🟢 Polish: 2/2 fixed
```

---

**Result:** All bugs fixed systematically in 62 minutes with 0 regressions.

---

## Scenario 3: Redesigning Existing UI

**Use case:** Your current checkout flow has usability issues.

**Example:** Redesign checkout based on user feedback

---

### Phase 1: Concept Exploration

**Your input:**

```bash
/concept "redesign checkout flow - users say it's confusing and has too many steps"
```

---

**System response:**

```
🎨 CONCEPT EXPLORATION

   Agent: design-master
   Skill: brainstorming

Let me understand the current issues and your goals...

Q1: How many steps does the current checkout have?
```

**You answer:** "5 steps - cart → shipping → billing → review → payment"

```
Q2: What specific feedback did users give?
```

**You answer:** "Takes too long, why can't billing and shipping be same step? Review step feels redundant"

```
Q3: What's your average order value and complexity?
```

**You answer:** "Most orders: $50-200, single shipping address, credit card payment"

```
Q4: Mobile vs desktop usage split?
```

**You answer:** "60% mobile, 40% desktop"

---

**System analyzes:**

```
🧠 ANALYZING CURRENT VS DESIRED STATE

Current flow (5 steps):
Cart → Shipping → Billing → Review → Payment
Problems:
- 5 clicks to complete
- Billing separate from shipping (redundant for 80% of users)
- Review step just repeats info already shown
- Mobile: Extra scrolling, more friction

APPROACH A: One-Page Checkout
   All info on one page, scroll to complete
   Pros: Fewest clicks, fastest completion
   Cons: Overwhelming on mobile, long scroll
   Best for: Desktop-heavy, simple products

APPROACH B: Two-Step Checkout
   Step 1: Shipping + Billing (combined)
   Step 2: Payment
   Pros: Fast, less overwhelming than one-page
   Cons: Still requires page transition
   Best for: Your use case ✓

APPROACH C: Progressive Disclosure
   Accordion-style, reveal next section on completion
   Pros: Feels fast, less page loads
   Cons: Can be confusing for some users
   Best for: Mobile-first apps

📋 RECOMMENDATION: Approach B (Two-Step)

Why:
- Combines shipping + billing (saves 2 steps)
- "Same as shipping" checkbox for 80% case
- Payment separate (PCI compliance, security perception)
- Mobile-friendly (less overwhelming)
- Progress indicator shows 2 steps (psychologically better than 5)

REDESIGNED FLOW:

Step 1: Shipping & Billing
├── Shipping address
├── ☑️ Billing same as shipping (default checked)
└── If unchecked: Show billing fields

Step 2: Payment
├── Cart summary (sticky on desktop, collapsed on mobile)
├── Payment method
└── Place order button

IMPROVEMENTS:
- 5 steps → 2 steps (60% fewer clicks)
- Estimated completion time: 90s → 35s
- Mobile: Less scrolling, better UX

UX ENHANCEMENTS:
- Inline validation (instant feedback)
- Autofill support (address autocomplete)
- Save for next time (return customers)
- Express checkout (Apple Pay, Google Pay)
- Cart summary sticky (always visible)

Would you like me to create a detailed design brief with wireframes?
```

**You type:** "yes"

```
✅ CONCEPT BRIEF CREATED

   File: docs/design-briefs/checkout-redesign-20251021.md

   Includes:
   - Current vs redesigned flow diagrams
   - Wireframes (desktop + mobile)
   - Component breakdown
   - Form validation strategy
   - Mobile optimizations
   - A/B test plan
   - Implementation checklist

   Time spent: 18 minutes

   Ready to implement? Use /enhance
```

---

### Phase 2: Implementation

**Your input:**

```bash
/enhance "implement checkout redesign from concept brief"
```

---

(Similar flow to Scenario 1, with agents implementing the redesigned checkout)

---

**Result:** New checkout in 2 steps, 60% faster completion, production-ready.

---

## Scenario 4: iOS App Development

**Use case:** Build a new feature for an iOS app.

**Example:** Add a settings screen with theme picker

---

**Your input:**

```bash
/enhance "add iOS settings screen with theme picker (light/dark/auto)"
```

---

**System response:**

```
🔍 ANALYZING TASK

   Detected: iOS development
   Platform: SwiftUI
   Workflow: ios-development

   Agents: ios-dev, swiftui-specialist, design-master

📋 EXECUTION PLAN

   Phase 1: Architecture (ios-dev)
   Phase 2: Implementation (ios-dev with TDD)
   Phase 3: UI Polish (design-master + swiftui-specialist)
   Phase 4: Quality Gate (code-reviewer-pro)

   Estimated time: 60 minutes

🏃 PHASE 1 - ARCHITECTURE

   Agent: ios-dev

   ✓ Created SettingsView.swift
   ✓ Created ThemePicker.swift
   ✓ Created ThemeManager.swift (state management)
   ✓ Updated AppDelegate for theme application
   ✓ Defined Theme enum (light, dark, auto)

   Duration: 10 minutes

🧪 PHASE 2 - TDD IMPLEMENTATION

   Agent: ios-dev
   Skill: test-driven-development

   RED (Write tests):
   ✓ Test: Theme selection updates UserDefaults
   ✓ Test: Theme persists across app restarts
   ✓ Test: Auto theme follows system setting
   ✓ 8 tests written, all failing ✓

   GREEN (Implement):
   ✓ ThemeManager saves to UserDefaults
   ✓ Persistence logic implemented
   ✓ System theme observer added
   ✓ All 8 tests passing ✓

   REFACTOR:
   ✓ Extracted theme logic to separate class
   ✓ Added proper error handling
   ✓ Improved naming clarity

   Duration: 25 minutes

🎨 PHASE 3 - UI POLISH

   Agents: design-master + swiftui-specialist (parallel)

   design-master:
   ✓ Spacing: iOS standard (16px, 24px)
   ✓ Typography: SF Pro system font
   ✓ Layout: Grouped list style (iOS native)
   ✓ Colors: System colors for theme support

   swiftui-specialist:
   ✓ Added SF Symbols icons
   ✓ Smooth theme transition animation
   ✓ Accessibility: VoiceOver labels
   ✓ Dynamic Type support

   Duration: 15 minutes

🛡️ QUALITY GATE

   Agent: code-reviewer-pro

   ✓ Build passes (Xcode)
   ✓ Tests pass (8/8)
   ✓ SwiftLint: No warnings
   ✓ Accessibility: VoiceOver works
   ✓ iOS guidelines: Follows HIG
   ✓ Performance: No memory leaks

   Result: ✅ APPROVED

✅ COMPLETE

   Total time: 58 minutes

   Files created:
   - Views/SettingsView.swift
   - Views/ThemePicker.swift
   - Managers/ThemeManager.swift
   - Tests/ThemeManagerTests.swift

   Tests: 8 passing
   Quality: App Store ready
```

---

**Result:** iOS settings screen with theme picker in 58 minutes, tested and App Store ready.

---

## Scenario 5: Performance Optimization

**Use case:** Dashboard page loads slowly.

**Example:** Optimize dashboard performance

---

**Your input:**

```bash
/enhance "optimize dashboard page load performance - currently takes 8 seconds"
```

---

**System response:**

```
🔍 ANALYZING TASK

   Detected: Performance optimization
   Workflow: debugging + optimization

   Agents: frontend-developer, debugger

📋 INVESTIGATION PLAN

   Phase 1: Profiling (debugger)
   Phase 2: Root cause analysis (debugger)
   Phase 3: Optimization (frontend-developer)
   Phase 4: Verification (code-reviewer-pro)

🔎 PHASE 1 - PROFILING

   Agent: debugger
   Skill: systematic-debugging

   Measuring baseline performance:
   ✓ Total load time: 8.2 seconds
   ✓ Chrome DevTools performance profile captured

   Breakdown:
   - API requests: 5.8s (71%)
   - Chart rendering: 1.9s (23%)
   - Initial render: 0.5s (6%)

   Bottlenecks identified:
   1. 12 API requests fired sequentially (waterfall)
   2. Charts render with all data points (10K+ points)
   3. Large bundle size (2.5MB uncompressed)

   Duration: 8 minutes

🧠 PHASE 2 - ROOT CAUSE ANALYSIS

   Agent: debugger

   Root cause #1: Sequential API requests
   - Each widget fetches its own data
   - Requests wait for previous to complete
   - Total: 12 requests × 500ms = 6 seconds

   Root cause #2: Chart performance
   - Rendering 10,000+ data points
   - No data sampling or lazy loading

   Root cause #3: Bundle size
   - Importing entire chart library (500KB)
   - Not code-splitting by route

   Duration: 5 minutes

⚡ PHASE 3 - OPTIMIZATION

   Agent: frontend-developer

   Optimization #1: Parallel API requests
   ✓ Use Promise.all() for parallel fetching
   ✓ Batch related requests into single endpoint
   ✓ Result: 6s → 0.8s (87% faster)

   Optimization #2: Chart performance
   ✓ Sample data to 500 points (maintain visual accuracy)
   ✓ Use React.memo to prevent unnecessary re-renders
   ✓ Lazy load charts below the fold
   ✓ Result: 1.9s → 0.3s (84% faster)

   Optimization #3: Bundle optimization
   ✓ Code-split by route
   ✓ Import only needed chart types
   ✓ Enable compression (gzip)
   ✓ Result: 2.5MB → 650KB (74% smaller)

   Duration: 30 minutes

✅ PHASE 4 - VERIFICATION

   Agent: code-reviewer-pro

   Performance testing:
   ✓ Load time: 8.2s → 1.4s (83% faster)
   ✓ First Contentful Paint: 2.1s → 0.4s
   ✓ Time to Interactive: 8.2s → 1.6s
   ✓ Lighthouse score: 45 → 92

   Functionality testing:
   ✓ All widgets load correctly
   ✓ Charts display accurate data
   ✓ No visual regressions

   Result: ✅ APPROVED

✅ COMPLETE

   Total time: 48 minutes

   Improvements:
   - Load time: 8.2s → 1.4s (83% faster)
   - Bundle size: 2.5MB → 650KB (74% smaller)
   - Lighthouse: 45 → 92 (+104%)

   Changes:
   - Parallelized API requests
   - Added data sampling for charts
   - Code-split by route
   - Optimized bundle

   Ready to deploy!
```

---

**Result:** Dashboard load time reduced by 83% in 48 minutes.

---

## Next Steps

**Try these workflows yourself:**

→ [QUICKSTART.md](QUICKSTART.md) for command examples

**Optimize your setup:**

→ [OPTIMIZATION.md](OPTIMIZATION.md) for cost/token savings

**Having issues?**

→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions
