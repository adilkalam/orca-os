# Requirements Spec: /orca-* Three-Tier Flags + Verification Enforcement

## Problem Statement

Two distinct problems:

1. **Pipeline friction**: Current `/orca-*` commands default to full pipeline (grand-architect, spec gating) for most tasks, creating friction for "fix this component" level work.

2. **Verification dishonesty**: Agents claim "fixed" and "verified ✅" without:
   - Actually measuring pixel values for spacing/alignment
   - Comparing screenshots to user's reference
   - Being honest when verification is blocked (dev server won't start, etc.)

## Solution Overview

### Three-Tier Flag Structure

| Flag | Path | Design Verification | Use Case |
|------|------|---------------------|----------|
| (none) | Light | YES - gates run | Default for most work |
| `-tweak` | Light | NO - pure speed | Fast iteration, skip visual review |
| `--complex` | Full | YES - all gates | Architecture, multi-page, specs |

### Three-Layer Verification Enforcement

1. **Pixel Measurement** - When you CAN see it, measure exact pixels (zero tolerance)
2. **Explicit Comparison** - Compare your screenshot to user's reference, issue by issue
3. **Claim Language** - When you CAN'T verify, NEVER say "fixed"

---

## Full Scope of Changes

This spec updates **4 categories** (~30 files):

### A) Orca Commands (6 files) + Design Review (1 file)
| File | Change |
|------|--------|
| `commands/orca.md` | Three-tier flag structure, routing logic |
| `commands/orca-nextjs.md` | Same |
| `commands/orca-ios.md` | Same |
| `commands/orca-expo.md` | Same |
| `commands/orca-shopify.md` | Same |
| `commands/orca-os-dev.md` | Same |
| `commands/design-review.md` | Add pixel measurement protocol, explicit comparison, claim language |

### B) Agents (13+ files)

**Reviewer Agents** (pixel measurement + claim language + explicit comparison):
| Agent | File |
|-------|------|
| `nextjs-design-reviewer` | `agents/dev/nextjs-design-reviewer.md` |
| `ios-ui-reviewer` | `agents/iOS/ios-ui-reviewer.md` |
| `expo-aesthetics-specialist` | `agents/expo/expo-aesthetics-specialist.md` |

**Builder Agents** (claim language only):
| Agent | File |
|-------|------|
| `nextjs-builder` | `agents/dev/nextjs-builder.md` |
| `ios-builder` | `agents/iOS/ios-builder.md` |
| `expo-builder-agent` | `agents/expo/expo-builder-agent.md` |
| `shopify-*-specialist` | Various shopify agents |

**Light Orchestrators** (routing logic for default vs -tweak):
| Agent | File |
|-------|------|
| `nextjs-light-orchestrator` | `agents/dev/nextjs-light-orchestrator.md` |
| `ios-light-orchestrator` | `agents/iOS/ios-light-orchestrator.md` |
| `expo-light-orchestrator` | `agents/expo/expo-light-orchestrator.md` |
| `shopify-light-orchestrator` | `agents/shopify/shopify-light-orchestrator.md` |

### C) Pipeline Docs (5 files)
| File | Change |
|------|--------|
| `docs/pipelines/nextjs-pipeline.md` | Document three-tier behavior |
| `docs/pipelines/ios-pipeline.md` | Same |
| `docs/pipelines/expo-pipeline.md` | Same |
| `docs/pipelines/shopify-pipeline.md` | Same |
| `docs/concepts/complexity-routing.md` | Update routing logic documentation |

### D) Phase Configs (5 files)
| File | Change |
|------|--------|
| `docs/reference/phase-configs/nextjs-phase-config.yaml` | Add ephemeral mode for default path |
| `docs/reference/phase-configs/ios-phase-config.yaml` | Same |
| `docs/reference/phase-configs/expo-phase-config.yaml` | Same |
| `docs/reference/phase-configs/shopify-phase-config.yaml` | Same |
| `docs/reference/phase-configs/os-dev-phase-config.yaml` | Same |

**Note:** `orca-os-dev` is included because OS-dev work also benefits from the three-tier structure.

---

## Part 1: Command Flag Changes

### 1.1 Three-Tier Flag Structure

**BEFORE:**
```
/orca-* "task"        → Complexity heuristics → Usually FULL pipeline
/orca-* -tweak "task" → Force light path (no gates)
```

**AFTER:**
```
/orca-* "task"            → Light path WITH design verification gates
/orca-* -tweak "task"     → Light path WITHOUT design verification (pure speed)
/orca-* --complex "task"  → Full pipeline (grand-architect, spec gating, all gates)
```

### 1.2 Commands to Update

| Command | File |
|---------|------|
| `/orca` | `commands/orca.md` |
| `/orca-nextjs` | `commands/orca-nextjs.md` |
| `/orca-ios` | `commands/orca-ios.md` |
| `/orca-expo` | `commands/orca-expo.md` |
| `/orca-shopify` | `commands/orca-shopify.md` |

### 1.3 Default Path Behavior (No Flag)

1. Context query via ProjectContextServer (keep for relevant files/standards)
2. Delegate to `{domain}-light-orchestrator`
3. Light orchestrator routes to builder + specialists
4. Basic verification (lint/type/build)
5. **Design verification gates RUN** (standards-enforcer, design-reviewer)
6. NO grand-architect deliberation
7. NO spec requirement
8. **Ephemeral phase_state only** (scores/files for THIS run, no multi-phase orchestration)

**Key difference from current:** Faster (no grand-architect, no spec) but STILL quality-gated.

**#PATH_DECISION: Ephemeral phase_state for default path**
Gates (standards-enforcer, design-reviewer) may write a minimal phase_state for the current run only:
- Scores and affected files for this execution
- No multi-phase ceremony or status tracking across invocations
- Keeps gate agents reusable without the full OS 2.3 state machine

### 1.4 Tweak Path Behavior (`-tweak`)

1. Minimal context (memory-first only, skip ProjectContext)
2. Delegate directly to builder
3. Basic verification (lint/type/build)
4. **NO design verification gates**
5. Pure speed mode for fast iteration

**Use case:** "Just make this change, I'll verify myself"

**#PATH_DECISION: Fallback to narrow ProjectContext**
If memory cannot confidently locate the target file(s), the tweak path MAY fall back to a narrow ProjectContext query (e.g., `maxFiles: 3`) instead of failing blindly. This keeps tweak mode fast while preventing "I edited the wrong component" failures in newer or unfamiliar repos.

### 1.5 Complex Path Behavior (`--complex`)

1. Full context query with history
2. Spec check:
   - If requirement ID provided, load spec from `.claude/requirements/<id>/06-requirements-spec.md`
   - If no spec exists, architect generates **mini-spec in phase_state** (not blocking)
3. Grand-architect deliberation
4. Architect planning
5. Layout analysis (Next.js)
6. Builder + all specialists
7. ALL gates: standards-enforcer, design-reviewer, verification
8. Full phase_state tracking
9. Decision saved to ProjectContext

**Use case:** Architecture decisions, multi-page flows, anything needing spec-level rigor

---

## Part 2: Pixel Measurement Enforcement

### 2.1 Problem

Reviewers claim:
- "The layout looks correct"
- "Spacing is consistent"
- "Alignment verified"

Without measuring actual pixel values. This leads to false positives.

### 2.2 Solution: Zero-Tolerance Pixel Measurement

Reviewers MUST:
1. **Calculate exact pixel values** for any spacing/alignment claims
2. **Report measurements explicitly** in output
3. **Compare measurements** against design tokens or expected values
4. **FAIL if ANY measurement is off by even 1px** (when expected value is known)

**#PATH_DECISION: Zero tolerance scope and conditions**

Zero tolerance (1px off = FAIL) applies when:
- There IS a clear expected value (design token, spec, or user-provided reference)
- Measurements are taken in the **same environment** used for acceptance (same OS, browser, device)

In absence of explicit expectations:
- Reviewer MUST still measure and report all pixel values
- Reviewer CANNOT hard-fail purely on 1–2px difference without a reference
- Report as `CAUTION: No expected value - measured Xpx, verify intent`

**Platform variance note:** Font rendering and subpixel rounding can produce legitimate 1px differences between environments (macOS vs Linux, Chrome vs Firefox). When environment differs from acceptance target, note this in the report.

**#PATH_DECISION: Design-DNA vs Legacy Surfaces**

In areas **not yet covered** by design-dna / tokens:
- Reviewers and standards-enforcers MUST still measure and report all values
- Violations are **CAUTION + migration notes**, not hard FAIL
- Exception: If the task explicitly asks to bring that area into compliance, then FAIL is appropriate

This prevents getting stuck on legacy surfaces while still generating the learning/migration data we want.

### 2.3 Pixel Measurement Protocol

```markdown
## 🔴 PIXEL MEASUREMENT PROTOCOL (MANDATORY - ZERO TOLERANCE)

When verifying spacing, alignment, or sizing, you MUST measure actual pixels.

### Step 1: Measure Actual Pixels

Use platform tools to get EXACT pixel values:

```
MEASUREMENTS:
┌─────────────────────────────────┬──────────┬──────────┐
│ Element                         │ Actual   │ Expected │
├─────────────────────────────────┼──────────┼──────────┤
│ Section 1 to Section 2 gap      │ 24px     │ 24px     │
│ Card padding-left               │ 16px     │ 16px     │
│ Header to content spacing       │ 12px     │ 16px     │
│ Button width                    │ 120px    │ 120px    │
└─────────────────────────────────┴──────────┴──────────┘
```

### Step 2: Compare (Zero Tolerance)

```
PIXEL COMPARISON:
- Section 1 to Section 2 gap: 24px == 24px → ✓ MATCH
- Card padding-left: 16px == 16px → ✓ MATCH
- Header to content spacing: 12px != 16px → ✗ MISMATCH (off by 4px)
- Button width: 120px == 120px → ✓ MATCH
```

### Step 3: Verdict

```
PIXEL VERIFICATION RESULT:
- Total measurements: 4
- Matching: 3
- Mismatched: 1
- VERDICT: FAIL (zero tolerance - 1px off = fail)

FAILED MEASUREMENTS:
- Header to content spacing: 12px (actual) vs 16px (expected) - 4px short
```

### Anti-Patterns (NEVER DO THESE)

❌ "Spacing looks consistent" - WHERE ARE THE PIXEL VALUES?
❌ "Alignment appears correct" - SHOW THE MEASUREMENTS
❌ "Layout matches design" - PROVE IT WITH NUMBERS
❌ "Within acceptable tolerance" - THERE IS NO TOLERANCE, ZERO MEANS ZERO
```

### 2.4 Measurement Methods by Platform

**Next.js (Playwright):**
```javascript
// Get computed style
const padding = await page.evaluate(() => {
  const el = document.querySelector('.target');
  return window.getComputedStyle(el).paddingLeft;
});

// Get bounding box for distances
const box1 = await page.locator('.element1').boundingBox();
const box2 = await page.locator('.element2').boundingBox();
const gap = box2.y - (box1.y + box1.height);
```

**iOS (XcodeBuildMCP + Simulator):**
```bash
# Capture view hierarchy with frames
xcrun simctl ui booted describe

# Or use accessibility inspector
# Parse frame values from output
```

**Expo/React Native:**
```javascript
// Use onLayout to capture measurements
// Or inspect via React DevTools
// Report exact layout values from native bridge
```

---

## Part 3: Claim Language Enforcement

### 3.1 Problem

Agent said "What I've Fixed ✅" then later admitted "I don't know if the changes worked."

This is dishonest. The word "fixed" implies verification happened.

### 3.2 Solution: Banned Language When Unverified

**WHEN VERIFICATION IS BLOCKED** (dev server won't start, build fails, etc.):

| BANNED LANGUAGE | REQUIRED INSTEAD |
|-----------------|------------------|
| "Fixed" | "Changed" or "Modified" |
| "Verified ✅" | "UNVERIFIED - [reason]" |
| "Issues resolved" | "Code changes applied - visual verification pending" |
| "Works correctly" | "Build passes - visual verification required" |
| Any checkmarks (✅) | No checkmarks for unverified work |

### 3.3 Unverified Work Protocol

When agent cannot run the app and see the result:

```markdown
## ⚠️ UNVERIFIED CHANGES

Visual verification BLOCKED because: [Node.js version incompatible / build error / etc.]

### What I CHANGED (not "fixed"):
- File A: Modified X to Y
- File B: Changed Z to W

### Why these changes SHOULD work:
- [Logical reasoning based on code analysis]

### To verify:
- [Steps user needs to take]

### Honest status:
I cannot confirm these changes work. I made logical modifications based on code
analysis, but visual verification failed. The word "fixed" would be dishonest.
```

### 3.4 Language Enforcement in Agents

Add to ALL builder and reviewer agents:

```markdown
## 🔴 CLAIM LANGUAGE RULES (MANDATORY)

### If You CAN See the Result:
- Use pixel measurements
- Compare to user's reference
- Say "Verified" only with measurement proof

### If You CANNOT See the Result:
- State "UNVERIFIED" prominently at TOP of response
- Use "changed/modified" language, NEVER "fixed"
- List what blocked verification
- NO checkmarks (✅) for unverified work
- Provide steps for user to verify

### The Word "Fixed" Is EARNED, Not Assumed
"Fixed" = I saw it broken, I changed code, I saw it working
"Changed" = I modified code but couldn't verify the result
```

---

## Part 4: Agents to Update

### 4.1 Reviewer Agents (Pixel Measurement + Claim Language)

| Agent | File |
|-------|------|
| `nextjs-design-reviewer` | `agents/dev/nextjs-design-reviewer.md` |
| `ios-ui-reviewer` | `agents/iOS/ios-ui-reviewer.md` |
| `expo-aesthetics-specialist` | `agents/expo/expo-aesthetics-specialist.md` |

### 4.2 Builder Agents (Claim Language Only)

| Agent | File |
|-------|------|
| `nextjs-builder` | `agents/dev/nextjs-builder.md` |
| `ios-builder` | `agents/iOS/ios-builder.md` |
| `expo-builder-agent` | `agents/expo/expo-builder-agent.md` |
| `shopify-*-specialist` | Various shopify agents |

### 4.3 Light Orchestrators (Route to Gates on Default)

| Agent | File |
|-------|------|
| `nextjs-light-orchestrator` | `agents/dev/nextjs-light-orchestrator.md` |
| `ios-light-orchestrator` | `agents/iOS/ios-light-orchestrator.md` |
| `expo-light-orchestrator` | `agents/expo/expo-light-orchestrator.md` |
| `shopify-light-orchestrator` | `agents/shopify/shopify-light-orchestrator.md` |

---

## Implementation Checklist

### Phase 1: Command Updates (7 files)

- [ ] `commands/orca.md` - Add three-tier flag structure
- [ ] `commands/orca-nextjs.md` - Add three-tier flag structure
- [ ] `commands/orca-ios.md` - Add three-tier flag structure
- [ ] `commands/orca-expo.md` - Add three-tier flag structure
- [ ] `commands/orca-shopify.md` - Add three-tier flag structure
- [ ] `commands/orca-os-dev.md` - Add three-tier flag structure
- [ ] `commands/design-review.md` - Add pixel protocol, explicit comparison, claim language

### Phase 2: Reviewer Agents - Pixel Measurement + Comparison (3 files)

- [ ] `agents/dev/nextjs-design-reviewer.md` - Add pixel protocol + explicit comparison
- [ ] `agents/iOS/ios-ui-reviewer.md` - Add pixel protocol + explicit comparison
- [ ] `agents/expo/expo-aesthetics-specialist.md` - Add pixel protocol + explicit comparison

### Phase 3: Builder Agents - Claim Language (4+ files)

- [ ] `agents/dev/nextjs-builder.md` - Add claim language rules
- [ ] `agents/iOS/ios-builder.md` - Add claim language rules
- [ ] `agents/expo/expo-builder-agent.md` - Add claim language rules
- [ ] Shopify builder agents (if applicable)

### Phase 4: Light Orchestrator Updates (4 files)

- [ ] `agents/dev/nextjs-light-orchestrator.md` - Default runs gates, -tweak skips, ephemeral phase_state
- [ ] `agents/iOS/ios-light-orchestrator.md` - Same
- [ ] `agents/expo/expo-light-orchestrator.md` - Same
- [ ] `agents/shopify/shopify-light-orchestrator.md` - Same

### Phase 5: Pipeline Docs (5 files)

- [ ] `docs/pipelines/nextjs-pipeline.md` - Document three-tier behavior
- [ ] `docs/pipelines/ios-pipeline.md` - Same
- [ ] `docs/pipelines/expo-pipeline.md` - Same
- [ ] `docs/pipelines/shopify-pipeline.md` - Same
- [ ] `docs/concepts/complexity-routing.md` - Update routing logic documentation

### Phase 6: Phase Configs (5 files)

- [ ] `docs/reference/phase-configs/nextjs-phase-config.yaml` - Add ephemeral mode
- [ ] `docs/reference/phase-configs/ios-phase-config.yaml` - Same
- [ ] `docs/reference/phase-configs/expo-phase-config.yaml` - Same
- [ ] `docs/reference/phase-configs/shopify-phase-config.yaml` - Same
- [ ] `docs/reference/phase-configs/os-dev-phase-config.yaml` - Same

### Phase 7: Deploy & Test

- [ ] Deploy all to `~/.claude/`
- [ ] Record decision in workshop
- [ ] Test each tier with sample tasks

---

## Acceptance Criteria

### Flag Behavior
1. `/orca-nextjs "task"` → Light path WITH design gates
2. `/orca-nextjs -tweak "task"` → Light path WITHOUT design gates
3. `/orca-nextjs --complex "task"` → Full pipeline with grand-architect
4. All 5 `/orca*` commands behave consistently

### Pixel Measurement
5. Reviewers output explicit pixel values in table format
6. Zero tolerance enforced when expected value exists (1px off = FAIL)
7. CAUTION (not FAIL) when no reference exists or in legacy surfaces
8. No vague language ("looks correct") without measurements

### Claim Language
9. Builders say "changed" not "fixed" when unverified
10. "UNVERIFIED" stated prominently when verification blocked
11. No checkmarks for unverified work

---

## RA Tags Summary

- **#PATH_DECISION**: Three-tier structure (default/tweak/complex) - DECIDED
- **#PATH_DECISION**: Default light path STILL runs design gates - DECIDED
- **#PATH_DECISION**: Ephemeral phase_state for default path (scores only, no ceremony) - DECIDED
- **#PATH_DECISION**: Tweak path fallback to narrow ProjectContext when memory insufficient - DECIDED
- **#PATH_DECISION**: Zero pixel tolerance WHEN expected value exists - DECIDED
- **#PATH_DECISION**: No hard-fail on 1-2px without reference (CAUTION instead) - DECIDED
- **#PATH_DECISION**: Legacy surfaces get CAUTION + migration notes, not hard FAIL - DECIDED
- **#PATH_DECISION**: Mini-spec allowed for --complex (not hard block) - DECIDED
- **#PATH_DECISION**: All 5 /orca* commands updated - DECIDED
- **#PATH_DECISION**: Claim language enforcement in builders AND reviewers - DECIDED
