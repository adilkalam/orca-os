# Expo / React Native Quality Rubric - OS 2.0

**Domain:** Expo / React Native (Mobile)  
**Version:** 1.0  
**Last Updated:** 2025-11-20

---

## Scoring Overview

**Total Score:** 0–100 points across 4 dimensions (25 points each)

**Scoring Interpretation:**
- **90–100:** Excellent – Production-ready, aligned with Expo/RN best practices
- **75–89:** Good – Minor improvements needed before release
- **60–74:** Fair – Significant issues to address
- **0–59:** Poor – Major rework required

This rubric is used by Expo lane gate agents (design/a11y/perf/security) and
`/orca-expo` to turn subjective “looks good” into objective scores.

---

## Dimension 1: React Native / Expo Implementation Standards (0–25 points)

### 1.1 Component & Code Quality (0–10 points)

**Excellent (9–10 points):**
- Functional components with hooks; no new class components.
- Clear separation of presentational vs container logic.
- No dead code, commented-out blocks, or console.logs in production paths.
- Consistent naming (camelCase, PascalCase for components).
- TS types/interfaces for props and key data structures.

**Good (7–8 points):**
- Mostly functional components.
- Minor mixing of concerns but readable.
- Occasional console.log or commented code.
- Types present for most props.

**Fair (5–6 points):**
- Mixed class and functional components.
- Logic and view tangled; hard to read.
- Many console.logs / commented code.
- Weak or missing TypeScript types.

**Poor (0–4 points):**
- Legacy patterns with no clear structure.
- Untyped props, any/implicit any everywhere.
- Frequent runtime type errors.

**Anti-Patterns to Flag:**
- Massive components (> 300–400 lines) doing everything.
- `any` or `unknown` used pervasively.
- Repeating UI chunks instead of extracting components.

### 1.2 Navigation & Routing (0–8 points)

**Excellent (7–8 points):**
- Uses chosen navigation pattern consistently (Expo Router or React Navigation).
- Screen components live under well-defined routes (`app/**`, `src/features/**/screens/**`).
- Parameters typed (e.g., typed route params).
- Deep link config validated (if used).

**Good (5–6 points):**
- Navigation mostly consistent.
- Some ad-hoc navigation but not harmful.
- Limited type coverage for params.

**Fair (3–4 points):**
- Mixed navigation styles.
- Route params passed as `any`.
- Hard-coded navigation strings scattered.

**Poor (0–2 points):**
- Navigation logic duplicated in many places.
- Fragile, easy-to-break linking.

**Anti-Patterns:**
- Pushing routes via string concatenation.
- Navigation logic buried in deeply nested helpers.

### 1.3 State & Data Flow (0–7 points)

**Excellent (6–7 points):**
- Clear state management choice (React Query, Zustand, Redux, etc.).
- Remote vs local state separated.
- Hooks (`useQuery`, `useStore`, etc.) co-located with features.
- No unnecessary global state; minimal prop drilling.

**Good (4–5 points):**
- Reasonable state decisions.
- Some mixing of remote and local state.
- A bit of prop drilling but manageable.

**Fair (2–3 points):**
- Ad-hoc state scattered across components.
- Direct `fetch` calls in views without abstraction.

**Poor (0–1 points):**
- Complex apps using only React state in random places.
- Difficult to reason about where data comes from or goes.

---

## Dimension 2: UI, Design Tokens & Accessibility (0–25 points)

**Note:** This dimension includes aesthetics evaluation. The `expo-aesthetics-specialist` agent focuses specifically on subsections 2.1 (token usage) and 2.2 (visual quality/hierarchy) to prevent generic "AI slop" UI and enforce cohesive, distinctive design.

### 2.1 Design System & Token Usage (0–10 points)

**Excellent (9–10 points):**
- Colors, spacing, typography all come from design tokens / theme files.
- No hard-coded HEX/RGB values where tokens exist.
- Shared components used for common UI patterns (buttons, inputs, cards).
- Layout respects the project’s design-dna grid and spacing rules.

**Good (7–8 points):**
- Most styling uses tokens.
- A few hard-coded values with clear rationale.
- Some duplication of styles but not systemic.

**Fair (5–6 points):**
- Tokens used inconsistently.
- Many hard-coded values; token coverage incomplete.

**Poor (0–4 points):**
- Virtually all styles hard-coded.
- No obvious link to design system.

**Anti-Patterns:**
- Inline styles everywhere instead of StyleSheet or themed helpers.
- Recreating button/card styles in each screen instead of shared components.

### 2.2 Layout, Responsiveness & Visual Quality (0–8 points)

**Excellent (7–8 points):**
- Layouts adapt gracefully to different device sizes/aspect ratios.
- Lists and detail screens have clear, intentional visual hierarchy (typography roles, spacing, prominence).
- Empty/error/loading states are well-designed and cohesive with app aesthetics.
- No visual glitches (clipping, overlap, truncation) in common device sizes.
- Color palette is cohesive and distinctive (not generic purple-on-white "AI slop").
- Purposeful use of motion, elevation/depth, and backgrounds to create polish.

**Good (5–6 points):**
- Mostly solid layout and hierarchy.
- Minor issues on extreme devices.
- Some basic empty/loading states.
- Color choices acceptable but not particularly distinctive.

**Fair (3–4 points):**
- Layout works on target devices but breaks on others.
- Sparse empty/error handling (e.g., just "No data").
- Visual hierarchy weak or inconsistent (sizes/weights look arbitrary).
- Feels generic or uninspired ("cookie-cutter" mobile UI).

**Poor (0–2 points):**
- Frequent overlapping / cutoff content.
- No thought given to states beyond the happy path.
- Generic, low-effort aesthetics with no design system connection.
- Obvious "AI-generated" feel with no refinement.

### 2.3 Accessibility (0–7 points)

**Excellent (6–7 points):**
- All touchable elements have `accessibilityLabel` and appropriate `accessibilityRole`.
- Touch targets respect 44x44 pt minimum (or hitSlop used correctly).
- Color contrast meets WCAG AA for text/icons.
- Screen reader flows tested and logical.

**Good (4–5 points):**
- Most important elements labeled.
- Basic touch target and contrast discipline.

**Fair (2–3 points):**
- Partial accessibility: some labels but many gaps.
- Touch target/contrast issues in secondary flows.

**Poor (0–1 points):**
- Accessibility largely absent.

**Common Issues:**
- Icon-only buttons without labels or hints.
- Small tap targets for close/back icons.
- Light grey text on white backgrounds.

---

## Dimension 3: Architecture & Data Surfaces (0–25 points)

### 3.1 Feature Architecture & Modularity (0–12 points)

**Excellent (11–12 points):**
- Feature-based structure (`features/foo/screens`, `features/foo/components`, `features/foo/stores`).
- Clear separation of UI, state, and side effects.
- Shared infrastructure (`services/api`, `services/storage`) re-used across features.
- New flows slot cleanly into existing architecture.

**Good (8–10 points):**
- Mostly feature-based.
- Some cross-feature coupling but manageable.

**Fair (5–7 points):**
- Mixed patterns; both feature-based and “dumped into src/”.
- Hard to extract flows or reuse logic.

**Poor (0–4 points):**
- Everything in a flat `screens/` or `components/` folder.
- No discernible architecture; logic scattered.

### 3.2 Networking & API Handling (0–6 points)

**Excellent (5–6 points):**
- Central API client or React Query setup with typed responses.
- Errors handled gracefully; retry/backoff where appropriate.
- No hard-coded URLs in components; endpoints organized and configurable.

**Good (3–4 points):**
- Basic API abstraction present.
- Reasonable error handling.

**Fair (1–2 points):**
- `fetch`/`axios` calls spread throughout components.
- Minimal error handling; many silent failures or generic alerts.

**Poor (0 points):**
- Broken API integrations or frequent crashes.

**Anti-Patterns:**
- Deeply nested `then` chains instead of async/await.
- Hard-coded base URLs in multiple files.

### 3.3 Offline & Persistence (0–7 points)

**Excellent (6–7 points):**
- Appropriate storage choices (MMKV, SecureStore, AsyncStorage wrappers).
- Sensitive data stored securely (encrypted storage or SecureStore).
- Offline-aware flows where appropriate (queueing, retries, optimistic updates).

**Good (4–5 points):**
- Basic persistence implemented.
- Some security awareness (e.g., tokens not in plain AsyncStorage).

**Fair (2–3 points):**
- Persistence used but naive; sensitive items in AsyncStorage.

**Poor (0–1 points):**
- No persistence or dangerous choices (plaintext secrets).

---

## Dimension 4: Performance, Security & Error Handling (0–25 points)

### 4.1 Performance & Rendering (0–12 points)

**Excellent (11–12 points):**
- Lists (FlatList/SectionList/FlashList) properly virtualized with `keyExtractor`,
  `getItemLayout` (where appropriate), and stable item components.
- Avoids unnecessary re-renders (memoized cell components, stable callbacks).
- No obvious main-thread blocking work in render paths.
- Images optimized (FastImage or equivalent, proper sizing/caching).

**Good (8–10 points):**
- Major lists virtualized.
- Some memoization in critical areas.
- Performance acceptable on modest hardware.

**Fair (5–7 points):**
- Lists sometimes use `ScrollView` with many children.
- Noticeable jank on mid-range devices.

**Poor (0–4 points):**
- Large lists rendered naively.
- Heavy computation directly in components.
- Frequent frame drops and jank.

**Red Flags:**
- `map` over large arrays in JSX with no virtualization.
- Inline arrow functions and object literals in huge lists.

### 4.2 Security (0–8 points)

**Excellent (7–8 points):**
- No API keys/secrets in source code.
- Tokens and user-sensitive data stored securely (encrypted storage, SecureStore).
- All network calls use HTTPS; no accidental HTTP.
- Input validation for user data; no obvious injection vectors.
- No sensitive data in logs or error messages.

**Good (5–6 points):**
- Most secrets externalized.
- Basic secure storage in place.
- ATS-equivalent constraints respected via API config.

**Fair (3–4 points):**
- Some secrets or tokens stored in AsyncStorage or plain config.
- Logs occasionally include sensitive values.

**Poor (0–2 points):**
- Hard-coded secrets.
- Tokens/passwords in AsyncStorage without encryption.
- HTTP endpoints for sensitive APIs.

### 4.3 Error Handling & Resilience (0–5 points)

**Excellent (5 points):**
- Clear error boundaries for network and storage failures.
- User-friendly error states and retry affordances.
- Logging and monitoring hooks in place (e.g. Sentry, custom logger).

**Good (3–4 points):**
- Basic error handling (try/catch, showing error messages).
- Some retry logic or fallback paths.

**Fair (1–2 points):**
- Errors mostly surfaced as generic alerts or silently ignored.

**Poor (0 points):**
- Frequent crashes or stuck states on error.

---

## Quality Gate Thresholds

**Gate Status by Score:**

| Score  | Status   | Action                                      |
|--------|----------|---------------------------------------------|
| 90–100 | ✅ PASS  | Excellent – Ship or stage for release       |
| 75–89  | ⚠️ CAUTION | Good – Fix minor issues before shipping   |
| 60–74  | 🔴 FAIL | Significant issues – Address before proceed |
| 0–59   | 🚫 BLOCK | Major rework required                      |

**Critical Issues (Automatic FAIL/BLOCK):**
- Hard-coded secrets, tokens, or passwords.
- Sensitive data in plain AsyncStorage without encryption.
- Severe performance problems on realistic devices (unusable jank).
- No accessibility on critical flows.
- Crashes or data loss bugs in core flows.

---

## Scoring Example (Expo Feature)

### Example: New Mobile Flow – Search & Detail Screen

**Dimension 1: Implementation (18/25)**
- Component Quality: 7/10 (functional components, some duplicated UI chunks).
- Navigation: 6/8 (Expo Router used correctly; some stringly-typed params).
- State & Data Flow: 5/7 (React Query used; a bit of prop drilling).

**Dimension 2: UI & A11y (20/25)**
- Design Tokens: 8/10 (mostly token usage; 3 hard-coded colors).
- Layout: 7/8 (good hierarchy; minor spacing tweaks needed).
- Accessibility: 5/7 (labels on main buttons; small tap targets on icons).

**Dimension 3: Architecture & Data (17/25)**
- Feature Architecture: 9/12 (feature folder; some cross-feature leakage).
- Networking: 4/6 (API client abstraction; limited error mapping).
- Persistence: 4/7 (search history stored in AsyncStorage; non-sensitive).

**Dimension 4: Perf/Security/Error Handling (19/25)**
- Performance: 10/12 (FlashList, memoized rows; minor jank with huge results).
- Security: 4/8 (no secrets, but token storage approach not yet reviewed).
- Error Handling: 5/5 (clear errors + retry on network failures).

**Total:** 74/100 → **FAIL (needs targeted fixes)**  
**Primary Concerns:** hard-coded colors, small tap targets, token storage review.

---

## Anti-Pattern Library (Expo / React Native)

### 1. Non-Virtualized Lists
```tsx
// ❌ BAD – heavy list in ScrollView
<ScrollView>
  {items.map(item => (
    <ItemRow key={item.id} item={item} />
  ))}
</ScrollView>

// ✅ GOOD – use FlatList/FlashList
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemRow item={item} />}
/>
```

### 2. Hard-Coded Styles Instead of Tokens
```tsx
// ❌ BAD
<View style={{ padding: 16, backgroundColor: '#336CFF' }}>
  <Text style={{ fontSize: 18, color: '#FFFFFF' }}>Title</Text>
</View>

// ✅ GOOD (tokens)
<View style={{ padding: spacing.md, backgroundColor: colors.primary }}>
  <Text style={[typography.headingSm, { color: colors.onPrimary }]}>
    Title
  </Text>
</View>
```

### 3. Inline Heavy Logic in Render
```tsx
// ❌ BAD
const ComplexList = ({ data }) => (
  <FlatList
    data={data}
    renderItem={({ item }) => (
      <View>
        {expensiveTransform(item).map(row => (
          <Row key={row.id} row={row} />
        ))}
      </View>
    )}
  />
);

// ✅ GOOD – precompute and memoize
const ComplexList = ({ data }) => {
  const transformed = useMemo(
    () => data.map(expensiveTransform),
    [data]
  );
  const renderItem = useCallback(
    ({ item }) => <RowGroup rows={item} />,
    []
  );
  return <FlatList data={transformed} renderItem={renderItem} />;
};
```

### 4. Sensitive Data in AsyncStorage
```ts
// ❌ BAD
await AsyncStorage.setItem('authToken', token);

// ✅ BETTER
await SecureStore.setItemAsync('authToken', token);
```

### 5. Icon Buttons Without Labels
```tsx
// ❌ BAD
<TouchableOpacity onPress={onClose}>
  <Icon name="close" />
</TouchableOpacity>

// ✅ GOOD
<TouchableOpacity
  onPress={onClose}
  accessibilityLabel="Close"
  accessibilityRole="button"
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  <Icon name="close" />
</TouchableOpacity>
```

---

## Automated & Manual Checks

**Automated Checks (to be wired up over time):**
- Static checks for hard-coded colors/spacing vs tokens.
- Lint rules for non-virtualized lists and `ScrollView` misuse.
- Search for AsyncStorage usage with sensitive keys.
- Basic accessibility linting (missing accessibilityLabel on touchables).

**Manual Review Focus:**
- Visual fit & finish on common target devices.
- Smoothness of critical flows (scrolling, input-heavy screens).
- Realistic error, offline, and edge-case behavior.

---

## Related Documents

- **Expo Pipeline Spec:** `docs/pipelines/expo-pipeline.md`
- **Expo Agents:** `agents/expo-architect-agent.md`, `agents/expo-builder-agent.md`,
  `agents/expo-verification-agent.md`
- **Design/System Agents:** `agents/design-token-guardian.md`, `agents/a11y-enforcer.md`,
  `agents/expo-aesthetics-specialist.md`, `agents/performance-enforcer.md`,
  `agents/performance-prophet.md`, `agents/security-specialist.md`
- **React Native Best Practices:**
  `_explore/orchestration_repositories/claude_code_agent_farm-main/claude_code_agent_farm-main/best_practices_guides/REACT_NATIVE_BEST_PRACTICES.md`

---

## Changelog

- **2025-11-20:** Initial Expo / React Native rubric created.
- **2025-11-20:** Enhanced Dimension 2.2 to explicitly cover aesthetics (typography hierarchy, cohesive color, motion, depth). Added note linking expo-aesthetics-specialist agent to Dimension 2.

---

_Expo / React Native Quality Rubric v1.0 – apply to all Expo lane deliverables_

