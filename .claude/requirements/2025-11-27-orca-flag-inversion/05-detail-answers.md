# Detail Answers

## Q1: Context query on light path?
**Answer:** Keep context query
**Implication:** Light path still calls ProjectContextServer - speed comes from skipping grand-architect/spec gating, not from skipping context

## Q2: Pixel measurement tolerance?
**Answer:** Zero tolerance
**Implication:** Exact pixel match required. 1px off = fail. No rounding forgiveness.

## Q3: Spec requirement for --complex?
**Answer:** Allow mini-spec
**Implication:** Architect can generate inline spec in phase_state if no requirements file exists. Reduces friction while keeping requirements clarity.

## Q4: Update base /orca too?
**Answer:** Yes, update /orca too
**Implication:** All five commands get the three-tier flag structure:
- /orca
- /orca-nextjs
- /orca-ios
- /orca-expo
- /orca-shopify

---

## Additional Requirement: Claim Language Enforcement

**Problem identified:** Agent said "What I've Fixed ✅" then later admitted "I don't know if the changes worked."

**Root cause:** Language allows agents to claim verification status they don't have.

**Solution:** Three-layer verification enforcement:

1. **Pixel measurement** - When you CAN see it, measure exact pixels
2. **Explicit comparison** - Compare your screenshot to user's reference
3. **Claim language** - When you CAN'T verify, NEVER say "fixed"

**Language rules:**
| BANNED | REQUIRED INSTEAD |
|--------|------------------|
| "Fixed" | "Changed" / "Modified" |
| "Verified ✅" | "UNVERIFIED - [reason]" |
| "Issues resolved" | "Code changes applied - awaiting visual confirmation" |
| "Works correctly" | "Build passes - visual verification required" |

**When verification blocked:** Agent MUST:
1. State "UNVERIFIED" prominently at top
2. Use "changed/modified" language only
3. List what blocked verification
4. NO checkmarks for unverified work
