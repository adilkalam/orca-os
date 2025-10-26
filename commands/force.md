---
description: "Force verification workflows - run this at session start to prevent false completions"
allowed-tools: ["Read"]
---

# Force Verification - Mandatory Behavior Enforcement

Run this command at the START of any session to force-feed verification requirements into Claude's context.

## Your Role

You are receiving **MANDATORY VERIFICATION REQUIREMENTS** that you MUST follow for the entire session.

---

## MANDATORY VERIFICATION WORKFLOW

For ANY iOS UI change, you MUST:

### 1. Build (MANDATORY)
```bash
xcodebuild -scheme [PROJECT] -destination 'platform=iOS Simulator,name=iPhone 15 Pro' build
```

**BEFORE claiming "Fixed!" or "Done!" - BUILD FIRST.**

### 2. Launch Simulator (MANDATORY)
```bash
xcrun simctl boot "iPhone 15 Pro"
# Then manually verify behavior in Simulator
```

**BEFORE claiming it works - SEE IT RUNNING.**

### 3. Screenshot (MANDATORY)
Use `/visual-review [url]` or manually capture screenshot.

**BEFORE claiming visual changes - CAPTURE SCREENSHOT.**

### 4. Mark Complete ONLY After All 3
**DO NOT** mark todos complete until:
- ✅ Build passes
- ✅ Simulator launched and verified
- ✅ Screenshot captured

---

## EVIDENCE REQUIRED FOR COMPLETION

### iOS UI Changes: 5 POINTS REQUIRED
- Build output: 1 point
- Simulator screenshot: 2 points
- Visual verification: 2 points
- **Total: 5 points to claim "Done!"**

### Frontend UI Changes: 5 POINTS REQUIRED
- Build output: 1 point
- Browser screenshot: 2 points
- Visual verification: 2 points
- **Total: 5 points to claim "Done!"**

### Backend API Changes: 5 POINTS REQUIRED
- Build output: 1 point
- curl/API test: 2 points
- Test output: 2 points
- **Total: 5 points to claim "Done!"**

---

## FALSE COMPLETION = SESSION FAILURE

If you claim something is "Fixed!" or "Done!" WITHOUT:
- Build verification
- Simulator/browser launch
- Screenshot evidence

**YOU HAVE FAILED THIS SESSION.**

---

## What "Complete" Actually Means

**NOT complete:**
- "I updated the file" ❌
- "The build passed" ❌
- "Changes compiled" ❌

**Actually complete:**
- "Build passed + Simulator running + Screenshot shows correct behavior" ✅
- "Build passed + Browser screenshot shows expected layout + Tests pass" ✅
- "API tests pass + curl returns correct response + Unit tests pass" ✅

---

## Your Response Pattern (MANDATORY)

When making changes:

```
[Make changes to code]

Now running verification (MANDATORY):

1. Building...
[Run xcodebuild]
✅ Build output: [show result]

2. Launching simulator...
[Launch simulator]
✅ Simulator running

3. Capturing screenshot...
[Take screenshot or use /visual-review]
✅ Screenshot: [path]

Evidence: 5/5 points ✅

NOW I can mark this complete.
```

**DO NOT skip these steps. DO NOT assume. DO NOT claim completion without evidence.**

---

## Evidence Budget Tracker

Track your evidence points for current task:

**Current Task Evidence:**
- [ ] Build (1 point)
- [ ] Visual/API verification (2 points)
- [ ] Screenshot/Test output (2 points)
- **Total: __/5 points**

**Cannot claim complete until: 5/5 points**

---

## Session Start Reminder

At the start of EVERY response involving implementation:

1. Check: "Do I have 5 points of evidence?"
2. If NO → Run verification tools
3. If YES → Provide evidence in response
4. ONLY THEN → Claim completion

---

## This Session's Commitment

For the remainder of THIS SESSION, I commit to:

✅ Building BEFORE claiming done
✅ Launching simulator/browser BEFORE claiming working
✅ Taking screenshots BEFORE claiming visual correctness
✅ Providing ALL evidence in completion claim
✅ NOT marking todos complete without 5/5 evidence points

**No more "Fixed!" without proof.**
**No more false completions.**
**Evidence first, claims second.**

---

## Quick Reference

**Before ANY completion claim, ask:**

1. Did I run the build? (Show output)
2. Did I launch simulator/browser? (Show screenshot)
3. Did I verify behavior? (Show evidence)
4. Do I have 5/5 points? (Count them)

**If answer to ANY is NO → Not complete yet.**

---

**Session Status:** VERIFICATION ENFORCED ✅

**This applies to:** REST OF THIS SESSION

**Violation consequence:** False completion = session failure
