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

## 5. Phase-State Integration (Summary)

This config works together with the detailed Expo phase-state contract
in `docs/pipelines/expo-pipeline.md`:

- Agents should:
  - Use this file for lane-level assumptions (stack, commands, thresholds).
  - Use the pipeline doc for phase definitions and the `phase_state.json`
    contract (what to write per phase).

If project-specific overrides exist (e.g. `docs/pipelines/expo-lane-config.local.md`),
agents should prefer those over the defaults here.

