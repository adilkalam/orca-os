# Expo Lane Config – OS 2.0

**Purpose:** Shared configuration for the Expo / React Native lane.  
Used by: `/orca`, `expo-architect-agent`, `expo-builder-agent`,
Expo gate agents, and `expo-verification-agent`.

---

## 1. Stack Assumptions

- **Platforms:** iOS + Android (Expo managed or bare).
- **React Native:** 0.74+ (targeting modern Fabric-capable releases).
- **Expo SDK:** 50+.
- **Language:** TypeScript first.

When the project clearly targets newer React Native/Expo versions, agents may
pull patterns from the React Native best-practices guide in:

- `_LLM-research/_orchestration_repositories/claude_code_agent_farm-main/claude_code_agent_farm-main/best_practices_guides/REACT_NATIVE_BEST_PRACTICES.md`

Agents should treat that guide as conceptual backing, not a hard dependency.

---

## 2. Project Layout Expectations

Common layouts (agents should detect which is in use):

- **Expo Router:**
  - `app/` directory with route segments (`app/(tabs)/`, `app/(auth)/`, etc.).
  - Shared UI and hooks under `components/`, `hooks/`, `lib/`, etc.

- **Custom layout:**
  - `src/` with `screens/`, `components/`, `navigation/`, `store/`, etc.

Agents SHOULD:
- Detect the layout from ContextBundle `projectState` + file inspection.
- Respect the existing module/feature boundaries when planning/implementing.

---

## 3. Default Commands (Heuristics)

Verification and local checks should look for these commands in `package.json`
and only run them if present:

- **Tests:**
  - `npm test` / `yarn test` / `pnpm test` / `bun test`
  - Or more specific scripts such as `test:unit`, `test:e2e`
- **Linting / static checks:**
  - `npm run lint` / `yarn lint` / `pnpm lint`
  - `npm run typecheck` / `yarn typecheck` / `pnpm typecheck`
- **Expo health checks:**
  - `npx expo doctor` (or equivalent via the chosen package manager)

Agents MUST NOT assume a specific command exists; they should:
- Inspect `package.json` to discover available scripts.
- Prefer non-destructive checks.
- Report clearly which commands they actually ran.

---

## 4. Gate Thresholds (Expo Lane)

Suggested thresholds for Expo gate agents:

- **Design Tokens / Standards (`design-token-guardian`):**
  - PASS: score ≥ 90
  - CAUTION: 70–89
  - FAIL: < 70

- **Accessibility (`a11y-enforcer`):**
  - PASS: no critical WCAG violations
  - FAIL: any blocking issue that affects core flows

- **Aesthetics (`expo-aesthetics-specialist`):**
  - PASS: score ≥ 90 (polished, distinctive UI)
  - CAUTION: 75–89 (acceptable but could be refined)
  - FAIL: 60–74 (visual quality issues present)
  - BLOCK: < 60 (generic "AI slop" UI requiring UX rethink)
  - **Note:** Soft gate by default - CAUTION/FAIL don't block progress unless user prioritizes visual quality for this phase

- **Performance (`performance-enforcer` / `performance-prophet`):**
  - PASS: within budgets, no significant regressions
  - CAUTION: minor regressions with clear mitigation plan
  - FAIL: meaningful regressions or severe risk

- **Security (`security-specialist`):**
  - PASS: no critical OWASP Mobile Top 10 issues
  - FAIL: any critical finding

These thresholds should be recorded into `phase_state.json` gates and can be
tightened on a per-project basis via standards stored in `vibe.db`.

---

## 4.1. Gate Threshold Rationale

This section explains **why** each gate uses its specific threshold and what score ranges represent in practice.

### Design Tokens / Standards (90 threshold, not 85 or 95)

**Why 90, not 85?**
- **85 allows too much drift:** At 85, projects average 1-2 hardcoded values per screen. This compounds over 10+ screens into 15-20 violations.
- **Cost of drift:** Each hardcoded color/spacing creates:
  - Design system fragmentation (3 shades of "primary blue")
  - Harder refactors (find-replace across 20 files vs centralized token update)
  - Inconsistent user experience
- **90 sets tight enforcement:** Allows ~1 violation per 2 screens (tolerable edge cases like platform-specific overrides).

**Why 90, not 95?**
- **95 is too strict for production velocity:** Achieving 95+ requires zero exceptions, even for legitimate platform differences.
- **Example valid exceptions at 90-94:**
  ```typescript
  // iOS-specific safe area handling
  <View style={{ paddingTop: Platform.OS === 'ios' ? 44 : 0 }} />
  // Not a design token but necessary platform adaptation
  ```
- **95+ reserved for:** Design system showcase projects or final polish phases.

**Score examples:**
- **92 (PASS):** 1 hardcoded value in 8 screens (likely valid platform exception)
- **85 (CAUTION):** 3-4 hardcoded values across 10 screens (drifting, needs cleanup)
- **68 (FAIL):** 8+ violations (systematic issue, design tokens not used)

---

### Accessibility (No numeric score - binary PASS/FAIL on WCAG violations)

**Why binary, not 0-100?**
- **Accessibility is binary:** Users with disabilities either can use the app or cannot. There's no "80% accessible."
- **WCAG is a checklist:** Each criterion (4.1.2, 1.4.3, 2.5.5) is pass/fail. An 80% pass means 20% of users blocked.
- **App Store rejection risk:** Apple/Google reject apps with critical a11y violations (missing labels, contrast, touch targets).

**Failure examples:**
- **CRITICAL (WCAG A):** Missing `accessibilityLabel` on checkout button → Screen reader users cannot complete purchase
- **HIGH (WCAG AA):** Low contrast text (3.2:1 vs 4.5:1 minimum) → Users with low vision cannot read content
- **MEDIUM (best practice):** Missing `accessibilityHint` → Reduces usability but doesn't block core flows

**Pass criteria:**
- ✅ Zero Level A violations (app is usable)
- ✅ Zero Level AA violations on critical flows (commerce, auth, navigation)
- ⚠️ Level AAA aspirational (enhanced experience, not required)

**Why not numeric?**
- A "90/100" a11y score could mean:
  - Option A: 10% of buttons missing labels (breaks screen readers)
  - Option B: 10% missing hints (degraded UX, not broken)
- Binary PASS/FAIL with severity classification is clearer.

---

### Aesthetics (90 PASS, 75-89 CAUTION, 60-74 FAIL, <60 BLOCK)

**Why 90 for PASS?**
- **90 = distinctive, cohesive UI:** Design feels intentional, not generic.
- **Typical 90+ characteristics:**
  - Clear visual hierarchy (typography scale applied consistently)
  - Cohesive color story (intentional palette, not "pick 5 random colors")
  - Purposeful spacing (rhythm, not arbitrary)
  - Subtle depth (backgrounds, shadows used thoughtfully)
- **Example 92-rated screen:**
  ```typescript
  // Typography hierarchy clear
  <Text style={typography.heading}>Product Name</Text>  // 24px bold
  <Text style={typography.body}>$79.99</Text>           // 16px regular
  <Text style={typography.caption}>In stock</Text>      // 12px gray

  // Color story cohesive (blue dominant, orange accent)
  <View style={{ backgroundColor: colors.primary }}>...</View>
  <TouchableOpacity style={{ backgroundColor: colors.accent }}>...</TouchableOpacity>
  ```

**Why 75-89 CAUTION zone?**
- **Acceptable but generic:** UI works but lacks polish.
- **Common issues at 80:**
  - Typography exists but no clear hierarchy (all 16px or 18px)
  - Colors functional but bland (grays, no dominant color)
  - Spacing consistent but flat (no rhythm or breathing room)
- **Soft gate:** Projects can ship at 80 if visual polish isn't current priority.

**Why 60-74 FAIL?**
- **Noticeable visual quality problems:**
  - Inconsistent typography (some screens 14px, others 20px)
  - Noisy color palettes (7+ colors, no cohesion)
  - Poor hierarchy (everything looks equally important)
- **Recommendation:** Dedicate corrective pass to visual cleanup.

**Why <60 BLOCK?**
- **Generic "AI slop" UI requiring UX rethink:**
  - Purple gradient (#8B5CF6 → #EC4899) on white (overused AI pattern)
  - No visual identity (could be any SaaS app)
  - Visual noise (too many styles, no restraint)
- **Why BLOCK?** Shipping at <60 damages brand perception. Users see "generic AI-generated" instantly.
- **Example <60 anti-pattern:**
  ```typescript
  // ❌ Generic gradient everywhere
  <LinearGradient colors={['#8B5CF6', '#EC4899']}>
    <View style={{ padding: 16 }}>  // Arbitrary padding
      <Text style={{ fontSize: 18 }}>Title</Text>  // No typography system
    </View>
  </LinearGradient>
  ```

**Score examples:**
- **93 (PASS):** Distinctive visual identity, clear hierarchy, cohesive colors
- **82 (CAUTION):** Functional UI, minor hierarchy issues, acceptable for MVP
- **67 (FAIL):** Inconsistent styles, noisy colors, needs visual cleanup
- **52 (BLOCK):** Purple gradients, no identity, generic AI slop - requires design rethink

---

### Performance (90 threshold with category-based budgets)

**Why 90 for PASS?**
- **90 = within budgets with margin:** Allows 10% buffer for minor regressions or platform differences.
- **Budget categories:**
  - **Bundle size:** Android <25MB, iOS <30MB (90 = 22.5MB / 27MB used)
  - **FPS:** >58fps scrolling (90 = 52-58fps acceptable)
  - **Time to Interactive:** <2000ms (90 = 1800ms acceptable)
  - **Bridge calls:** <60/sec (90 = 54/sec acceptable)

**Why 90, not 85?**
- **85 cuts too close to budgets:** At 85, Android would be 21.25MB (only 3.75MB headroom). One dependency update could break.
- **90 provides safety margin:** 2.5MB headroom allows for growth without constant performance crisis.

**Why 90, not 95?**
- **95 is over-optimization:** Would require bundle at 23.75MB / 28.5MB - leaves too much unused capacity.
- **Opportunity cost:** Achieving 95 might mean aggressive code splitting that adds complexity without user benefit.

**Score calculation example:**
```text
Bundle Size: 23.2MB / 25MB = 92.8% used
Start: 100 points
Deduction: -7.2 points (over 90%)
Score: 92.8 (PASS)

Bundle Size: 26.8MB / 25MB = 107.2% over
Start: 100 points
Deduction: -25 points (over budget = -20 base + -5 for 7% overage)
Score: 75 (CAUTION - over budget, needs optimization)
```

**Failure examples:**
- **88 (CAUTION):** Bundle at 24.2MB (close to limit, monitor but acceptable)
- **72 (FAIL):** Bundle at 27MB, FlatList at 45fps (both over budget)
- **58 (FAIL):** Bundle 31MB, heavy bridge calls - requires immediate optimization

---

### Security (Binary PASS/FAIL based on CVSS scores)

**Why binary, not 0-100?**
- **Security is binary:** App is either secure or exploitable. No middle ground.
- **CVSS provides severity:** Use industry-standard Common Vulnerability Scoring System (0-10 scale).
- **Threshold: CVSS 9+ = CRITICAL = BLOCK immediately**

**Failure examples by CVSS:**

**CVSS 9.1 (CRITICAL) - Auth token in AsyncStorage:**
```typescript
// ❌ CRITICAL vulnerability
await AsyncStorage.setItem('authToken', token);
// Attack: Root device → extract token → full account access
```

**CVSS 8.2 (HIGH) - HTTP instead of HTTPS:**
```typescript
// ❌ HIGH vulnerability
fetch('http://api.example.com/payment', {...});
// Attack: Man-in-the-middle → intercept payment data
```

**CVSS 6.5 (MEDIUM) - API key in code:**
```typescript
// ❌ MEDIUM vulnerability
const API_KEY = 'sk_live_abc123xyz';
// Attack: Decompile APK → extract key → abuse API quota
```

**Pass criteria:**
- ✅ Zero CVSS 9+ (CRITICAL) vulnerabilities
- ✅ Zero CVSS 7-8 (HIGH) vulnerabilities on critical flows (auth, payment, PII)
- ⚠️ CVSS 4-6 (MEDIUM) acceptable with mitigation plan
- ✅ CVSS 1-3 (LOW) informational (document but don't block)

**Why not numeric?**
- "Security score: 85/100" is meaningless. One CVSS 9.1 auth bypass makes the app completely insecure regardless of other fixes.
- Binary with CVSS severity is clearer: "FAIL: 1 CRITICAL (CVSS 9.1) + 2 MEDIUM (CVSS 5.x)"

---

### Verification (Binary PASS/FAIL based on build/test results)

**Why binary?**
- **Build either succeeds or fails:** No partial builds in production.
- **Tests either pass or fail:** Broken tests indicate regressions.
- **Expo doctor either passes or warns:** Configuration either correct or broken.

**Pass criteria:**
- ✅ `npm test` passes (0 failures)
- ✅ `npm run lint` passes (0 errors, warnings OK)
- ✅ `expo doctor` passes (0 critical warnings)

**Failure examples:**

**Build failure:**
```bash
$ npm test
FAIL src/hooks/useAuth.test.ts
● useAuth › should logout user
  Expected: user to be null
  Received: user still present

Test Suites: 1 failed, 8 passed
```

**Expo doctor failure:**
```bash
$ npx expo doctor
✖ Package version mismatch
  expo@50.0.0 requires react-native@0.73.x
  Found: react-native@0.74.1
```

**Why not numeric?**
- "Verification score: 90/100" implies partial success. But:
  - 10% test failures = regressions shipped to production
  - Build with errors = broken app
- Binary is clearer: "FAIL: 3 test regressions + 1 TypeScript error"

---

### Summary: Why Different Gates Use Different Scales

| Gate | Scale | Rationale |
|------|-------|-----------|
| Design Tokens | 0-100 (90 threshold) | Numeric reflects % compliance. 90 balances strictness with platform exceptions. |
| Accessibility | Binary (PASS/FAIL) | Users either can use app or can't. WCAG is checklist, not spectrum. |
| Aesthetics | 0-100 (90/75/60 gates) | Subjective quality ranges from generic (60) to polished (90). Soft gate allows prioritization. |
| Performance | 0-100 (90 threshold) | Budget compliance measurable. 90 provides safety margin without over-optimization. |
| Security | Binary (PASS/FAIL) | Security is binary. CVSS provides severity (9+ = block). One critical flaw breaks everything. |
| Verification | Binary (PASS/FAIL) | Build/tests either work or don't. No partial success in production. |

---

## 5. Phase-State Integration (Summary)

This config works together with the detailed Expo phase-state contract
in `docs/pipelines/expo-pipeline.md`:

- Agents should:
  - Use this file for lane-level assumptions (stack, commands, thresholds).
  - Use the pipeline doc for phase definitions and the `phase_state.json`
    contract (what to write per phase).

If project-specific overrides exist (e.g. `docs/pipelines/expo-lane-config.local.md`),
agents should prefer those over the defaults here.

