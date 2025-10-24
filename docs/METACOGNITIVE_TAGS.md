# Meta-Cognitive Tags System

**Version:** 1.0
**Date:** 2025-10-23
**Status:** ACTIVE

---

## Overview

This tag system implements **Response Awareness** methodology to prevent false completion claims and ensure quality enforcement.

**The Problem:** LLM agents operate in "generation mode" where they cannot stop mid-response to verify assumptions. This causes:
- Agents claiming "I built X" without creating files
- Quality validators passing without checking actual code
- Evidence directories staying empty
- User trust destroyed

**The Solution:** Separate generation from verification
1. **Generation Phase:** Implementation agents write code and mark assumptions with explicit tags
2. **Verification Phase:** Separate verification-agent searches for tags and runs actual checks
3. **Quality Gates:** Block if verification fails

---

## Core Principles

### 1. Explicit Over Implicit
Don't assume. Tag the assumption.

**Bad:**
```swift
import LoginView  // Assuming this exists
```

**Good:**
```swift
// #COMPLETION_DRIVE: Assuming LoginView.swift exists at src/views/LoginView.swift
import LoginView
```

### 2. Verify Don't Trust
verification-agent runs actual commands, not validation theater.

**Bad (validation theater):**
```
"The LoginView file looks good based on the plan."
```

**Good (actual verification):**
```bash
$ ls src/views/LoginView.swift
src/views/LoginView.swift

$ grep "struct LoginView" src/views/LoginView.swift
struct LoginView: View {

✅ VERIFIED: File exists and contains LoginView struct
```

### 3. Tag Everything Verifiable
If it can be checked, tag it.

- File existence → Tag it
- File creation → Tag it
- File modification → Tag it
- Screenshot capture → Tag it
- API assumptions → Tag it

### 4. Block on Failed Verification
One failed verification = entire workflow blocks.

No "mostly complete" or "good enough". Either all verified or blocked.

---

## Tag Categories

### Category 1: Completion Drive Tags (Assumptions)

#### #COMPLETION_DRIVE
**Purpose:** Mark assumptions about files, components, or code existence

**When to use:**
- Assuming a file exists
- Assuming a component has certain properties
- Assuming a function signature
- Assuming design system values

**Format:**
```
// #COMPLETION_DRIVE: [Clear description of assumption]
```

**Examples:**

```swift
// #COMPLETION_DRIVE: Assuming LoginView.swift exists at src/views/LoginView.swift
import LoginView

// #COMPLETION_DRIVE: Assuming Button uses .frame(height: 44) per design system
Button("Login").frame(height: 44)

// #COMPLETION_DRIVE: Assuming primary color is #007AFF
.foregroundColor(Color(hex: "#007AFF"))
```

```typescript
// #COMPLETION_DRIVE: Assuming ThemeContext provides toggle() method
const { toggle } = useTheme()

// #COMPLETION_DRIVE: Assuming API returns {token: string, user: User}
const { token, user } = await response.json()
```

**Verification:** verification-agent checks if assumption is correct

---

#### #COMPLETION_DRIVE_INTEGRATION
**Purpose:** Mark assumptions about system integration (APIs, services, external systems)

**When to use:**
- API endpoint assumptions
- Service interface assumptions
- External library assumptions
- Cross-system communication assumptions

**Format:**
```
// #COMPLETION_DRIVE_INTEGRATION: [Integration assumption]
```

**Examples:**

```typescript
// #COMPLETION_DRIVE_INTEGRATION: Assuming /api/login returns {token: string, user: User}
const response = await fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
const { token, user } = await response.json()
```

```swift
// #COMPLETION_DRIVE_INTEGRATION: Assuming NetworkManager.shared.post() returns Decodable
let user: User = try await NetworkManager.shared.post("/api/login", body: credentials)
```

```python
# #COMPLETION_DRIVE_INTEGRATION: Assuming Redis cache has 'user_session' key structure
session = redis.get(f"user_session:{user_id}")
```

**Verification:** verification-agent checks if integration point exists, may tag as #CANNOT_VERIFY_WITHOUT_RUNTIME if needs manual testing

---

### Category 2: File Operation Tags (Claims)

#### #FILE_CREATED
**Purpose:** Document that you created a new file (MUST be verifiable)

**When to use:** Every time you create a new file

**Format (in .orchestration/implementation-log.md):**
```markdown
#FILE_CREATED: [file_path] ([line_count] lines)
  Description: [What the file contains]
  Purpose: [Why it was created]
```

**Examples:**

```markdown
#FILE_CREATED: src/components/DarkModeToggle.tsx (247 lines)
  Description: React functional component with theme toggle
  Purpose: Allow users to switch between light and dark mode
  Dependencies: ThemeContext, lucide-react icons
```

```markdown
#FILE_CREATED: src/views/LoginView.swift (183 lines)
  Description: SwiftUI login screen with email/password fields
  Purpose: User authentication flow entry point
  Dependencies: NetworkManager, ValidationService
```

**Verification:** verification-agent runs `ls [file_path]` and `wc -l [file_path]` to confirm file exists and approximate line count

---

#### #FILE_MODIFIED
**Purpose:** Document that you modified an existing file

**When to use:** Every time you change an existing file

**Format (in .orchestration/implementation-log.md):**
```markdown
#FILE_MODIFIED: [file_path]
  Lines affected: [line_range]
  Changes: [Description of what changed]
```

**Examples:**

```markdown
#FILE_MODIFIED: src/App.tsx
  Lines affected: 8, 102-115
  Changes:
    - Line 8: Added import for DarkModeToggle
    - Lines 102-115: Added <DarkModeToggle /> component to header
```

```markdown
#FILE_MODIFIED: src/index.css
  Lines affected: 1-25
  Changes: Added CSS custom properties for dark mode theme variables
```

**Verification:** verification-agent runs `grep` to check if claimed changes exist in file

---

#### #SCREENSHOT_CLAIMED
**Purpose:** Document that you captured a screenshot (visual evidence)

**When to use:**
- UI changes (before/after)
- Visual bugs (reproduction)
- Design implementation (comparison to mockup)
- Visual regression testing

**Format (in .orchestration/implementation-log.md):**
```markdown
#SCREENSHOT_CLAIMED: [file_path]
  Description: [What the screenshot shows]
  Timestamp: [When captured]
```

**Examples:**

```markdown
#SCREENSHOT_CLAIMED: .orchestration/evidence/task-123/before-dark-mode.png
  Description: Application header before dark mode toggle added
  Timestamp: 2025-10-23T14:20:00

#SCREENSHOT_CLAIMED: .orchestration/evidence/task-123/after-dark-mode.png
  Description: Application header with dark mode toggle visible in top-right
  Timestamp: 2025-10-23T14:25:00

#SCREENSHOT_CLAIMED: .orchestration/evidence/task-123/dark-mode-active.png
  Description: Full application with dark theme activated
  Timestamp: 2025-10-23T14:26:00
```

**Verification:** verification-agent runs `ls` and `file` commands to confirm screenshot exists and is valid image format (PNG, JPG, etc.)

---

### Category 3: Verification Tags (Added by verification-agent)

#### #VERIFIED
**Purpose:** Mark that an assumption or claim was checked and is CORRECT

**Who adds it:** verification-agent only (implementation agents NEVER add this)

**Format:**
```
#VERIFIED: [What was verified] ✓
  Verified by: [Command used]
  Result: [What was found]
  Timestamp: [When verified]
```

**Examples:**

```markdown
#VERIFIED: LoginView.swift exists at src/views/LoginView.swift ✓
  Verified by: ls src/views/LoginView.swift
  Result: File exists, 183 lines
  Timestamp: 2025-10-23T14:30:00

#VERIFIED: Button height matches design system (44px) ✓
  Verified by: grep ".frame(height:" src/components/Button.swift
  Result: Found .frame(height: 44) at line 102
  Timestamp: 2025-10-23T14:31:00

#VERIFIED: Screenshot captured ✓
  Verified by: ls .orchestration/evidence/task-123/after.png && file .orchestration/evidence/task-123/after.png
  Result: PNG image data, 1920 x 1080
  Timestamp: 2025-10-23T14:32:00
```

---

#### #FAILED_VERIFICATION
**Purpose:** Mark that an assumption or claim was checked and is INCORRECT (BLOCKS quality gate)

**Who adds it:** verification-agent only

**Impact:** ONE failed verification = entire workflow BLOCKED

**Format:**
```
#FAILED_VERIFICATION: [What was checked]
  Claimed: [What was assumed]
  Actual: [What was found]
  File/Location: [Where the issue is]
  Fix required: [What needs to be done]
```

**Examples:**

```markdown
#FAILED_VERIFICATION: Button height incorrect
  Claimed: .frame(height: 44)
  Actual: .frame(height: 48)
  File: src/components/Button.swift:102
  Fix required: Change line 102 to .frame(height: 44) to match design system

#FAILED_VERIFICATION: SearchBar file missing
  Claimed: #FILE_CREATED: src/components/SearchBar.tsx
  Actual: File does not exist
  Command: ls src/components/SearchBar.tsx → No such file or directory
  Fix required: Create SearchBar.tsx file or remove claim

#FAILED_VERIFICATION: Screenshot missing
  Claimed: #SCREENSHOT_CLAIMED: .orchestration/evidence/task-123/glow-view.png
  Actual: File not found
  Command: ls .orchestration/evidence/task-123/glow-view.png → No such file
  Fix required: Capture screenshot or acknowledge cannot capture (explain why)
```

---

#### #CANNOT_VERIFY_WITHOUT_RUNTIME
**Purpose:** Mark assumptions that cannot be verified statically (need runtime testing)

**Who adds it:** verification-agent

**When to use:**
- API endpoint behavior (need server running)
- Database queries (need DB connection)
- Network requests (need external service)
- User interaction flows (need manual testing)

**Format:**
```
#CANNOT_VERIFY_WITHOUT_RUNTIME: [What cannot be verified]
  Reason: [Why static verification impossible]
  Manual test required: [What user needs to test]
```

**Examples:**

```markdown
#CANNOT_VERIFY_WITHOUT_RUNTIME: API endpoint /api/login behavior
  Reason: Requires running backend server
  Manual test required:
    1. Start backend server
    2. POST to /api/login with {email, password}
    3. Verify response contains {token, user}

#CANNOT_VERIFY_WITHOUT_RUNTIME: Dark mode toggle interaction
  Reason: Requires browser runtime
  Manual test required:
    1. npm run dev
    2. Click dark mode toggle
    3. Verify theme switches and persists to localStorage
```

**Impact:** Does NOT block quality gate, but flags for manual testing

---

### Category 4: Advanced Meta-Cognitive Tags (Optional for v1)

These tags are part of full Typhren methodology but OPTIONAL for initial hybrid implementation.

#### #CARGO_CULT
Code added because pattern association, not necessity

```python
# #CARGO_CULT: Adding try/except because API calls usually have it
try:
    result = fetch_data()
except Exception as e:
    logging.error(e)  # But no actual error handling needed here
```

#### #PATTERN_MOMENTUM
Generating more than requested due to pattern completion

```typescript
// #PATTERN_MOMENTUM: Generated full CRUD but task only asked for read operation
async create(data) { ... }  // Not requested
async read(id) { ... }       // This was requested
async update(id, data) { ... }  // Not requested
async delete(id) { ... }     // Not requested
```

#### #CONTEXT_DEGRADED
Can't clearly recall earlier context, making educated guess

```swift
// #CONTEXT_DEGRADED: Can't recall if primary button style uses .bold or .semibold
Text("Login").fontWeight(.bold)
```

---

## Implementation Log Structure

Every implementation phase MUST create `.orchestration/implementation-log.md` with this structure:

```markdown
# Implementation Log - [Task ID]: [Task Title]

**Started:** [Timestamp]
**Completed:** [Timestamp]
**Agent:** [Agent name]

---

## Task Summary
[Brief description of what was implemented]

---

## Assumptions Made

#COMPLETION_DRIVE: [Assumption 1]
  Context: [Why this assumption was made]
  Files affected: [List files]

#COMPLETION_DRIVE_INTEGRATION: [Integration assumption]
  Context: [Why this assumption was made]
  Verification: [How to verify - may need runtime]

[... all assumptions ...]

---

## Files Created

#FILE_CREATED: [file_path] ([line_count] lines)
  Description: [What it contains]
  Purpose: [Why created]
  Dependencies: [What it imports/uses]

[... all created files ...]

---

## Files Modified

#FILE_MODIFIED: [file_path]
  Lines affected: [ranges]
  Changes: [Detailed description]
  Reason: [Why modified]

[... all modified files ...]

---

## Evidence Captured

#SCREENSHOT_CLAIMED: [path_to_screenshot]
  Description: [What it shows]
  Timestamp: [When captured]

[... all screenshots ...]

---

## Integration Points

#COMPLETION_DRIVE_INTEGRATION: [Integration point]
  Expected behavior: [What should happen]
  Verification method: [How to test]

[... all integration assumptions ...]

---

## Notes

[Any additional context, decisions made, trade-offs, etc.]
```

---

## Verification Report Structure

verification-agent MUST create `.orchestration/verification-report.md` with this structure:

```markdown
# Verification Report

**Timestamp:** [When verification ran]
**Task:** [Task ID and title]
**Implementation log:** [Path to implementation-log.md]

---

## Summary

- **Total tags found:** [N]
- **Verified (✓):** [N]
- **Failed verification (❌):** [N]
- **Cannot verify without runtime (⏳):** [N]

---

## ❌ FAILED VERIFICATIONS (BLOCKING)

[If any exist]

### 1. [Description]
- **Tag:** [Original tag]
- **Claimed:** [What was assumed]
- **Actual:** [What was found]
- **Verification command:** [Bash command used]
- **Output:** [Command output]
- **Fix required:** [What needs to be done]
- **Status:** ❌ FAILED

[... all failed verifications ...]

**⚠️ QUALITY GATE BLOCKED - Must fix all failed verifications before proceeding**

---

## ⏳ CANNOT VERIFY WITHOUT RUNTIME

[If any exist]

### 1. [Description]
- **Tag:** [Original tag]
- **Assumption:** [What was assumed]
- **Why cannot verify:** [Reason]
- **Manual test required:** [Steps to test manually]
- **Status:** ⏳ NEEDS RUNTIME TEST

[... all runtime-only verifications ...]

---

## ✅ VERIFIED ASSUMPTIONS

### 1. [Description]
- **Tag:** [Original tag]
- **Claimed:** [What was assumed]
- **Verification command:** `[bash command]`
- **Output:** [Command output]
- **Result:** [What was confirmed]
- **Status:** ✅ VERIFIED

[... all verified assumptions ...]

---

## Quality Gate Verdict

**Status:** [✅ PASSED | ❌ BLOCKED | ⏳ CONDITIONAL]

**Reasoning:**
[Explanation of verdict]

**If BLOCKED:**
- [N] failed verifications must be fixed
- See "FAILED VERIFICATIONS" section above
- DO NOT PROCEED until all failures resolved

**If CONDITIONAL:**
- [N] runtime verifications required
- See "CANNOT VERIFY WITHOUT RUNTIME" section
- User must manually test before deploying

**If PASSED:**
- All verifications completed ✓
- No failed assumptions ✓
- Ready for quality validation ✓

---

## Commands Run

[List all bash commands used for verification]

```bash
grep -r "#COMPLETION_DRIVE" . --include="*.swift"
ls src/views/LoginView.swift
grep "struct LoginView" src/views/LoginView.swift
ls .orchestration/evidence/task-123/
file .orchestration/evidence/task-123/after.png
[... all commands ...]
```

---

## Tag Cleanup Status

[If all verified]
- ✅ All tags cleaned from code
- ✅ Verification report preserved
- ✅ Implementation log preserved

[If failed or conditional]
- ⏳ Tags NOT cleaned (failures must be fixed first)
- Tags remain for re-verification after fixes
```

---

## Quality Gate Rules

### BLOCK Conditions (Workflow STOPS)

Quality gate **MUST BLOCK** if:

1. ❌ Any `#FAILED_VERIFICATION` tags exist
2. ❌ Any `#COMPLETION_DRIVE` tags remain unverified
3. ❌ Any `#FILE_CREATED` claims not verified
4. ❌ Any `#FILE_MODIFIED` claims not verified
5. ❌ Any `#SCREENSHOT_CLAIMED` files missing
6. ❌ `.orchestration/implementation-log.md` missing
7. ❌ `.orchestration/verification-report.md` missing
8. ❌ verification-agent not run

### CONDITIONAL Conditions (User must manually test)

Quality gate is **CONDITIONAL** if:

1. ⏳ `#CANNOT_VERIFY_WITHOUT_RUNTIME` tags exist
2. ⏳ Integration assumptions require manual testing
3. ⏳ API behavior needs runtime verification

User receives list of manual tests required.

### PASS Conditions (Workflow continues)

Quality gate **PASSES** only if:

1. ✅ All `#COMPLETION_DRIVE` tags verified
2. ✅ All `#FILE_CREATED` claims verified
3. ✅ All `#FILE_MODIFIED` claims verified
4. ✅ All `#SCREENSHOT_CLAIMED` files verified
5. ✅ Zero `#FAILED_VERIFICATION` tags
6. ✅ verification-report.md shows "PASSED" verdict
7. ✅ All tags cleaned from code (or marked as permanent documentation)

---

## Tag Usage Examples by Language

### Swift (iOS)

```swift
import SwiftUI

// #COMPLETION_DRIVE: Assuming Colors.swift defines Colors.primary
// #COMPLETION_DRIVE: Assuming design system uses 44pt touch targets
struct LoginButton: View {
    var body: some View {
        Button("Login") {
            // Action
        }
        .foregroundColor(Colors.primary)
        .frame(height: 44)
    }
}
```

**In .orchestration/implementation-log.md:**
```markdown
#FILE_CREATED: src/components/LoginButton.swift (23 lines)
  Description: Reusable primary button component

#COMPLETION_DRIVE: Assuming Colors.primary defined in Colors.swift
  Context: Following existing design system pattern

#COMPLETION_DRIVE: Assuming 44pt touch target per Apple HIG
  Context: iOS standard touch target size
```

---

### TypeScript/React

```typescript
import { useTheme } from './context/ThemeContext'

// #COMPLETION_DRIVE: Assuming ThemeContext provides {theme, toggle}
// #COMPLETION_DRIVE: Assuming theme values are 'light' | 'dark'
export function DarkModeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button onClick={toggle}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

**In .orchestration/implementation-log.md:**
```markdown
#FILE_CREATED: src/components/DarkModeToggle.tsx (47 lines)
  Description: Theme toggle button component
  Dependencies: ThemeContext

#COMPLETION_DRIVE: Assuming ThemeContext at src/context/ThemeContext.tsx
  Context: Standard React context pattern

#COMPLETION_DRIVE_INTEGRATION: Assuming toggle() updates theme state
  Context: Following context API convention
```

---

### Python (Backend)

```python
from services.auth import AuthService

# #COMPLETION_DRIVE: Assuming AuthService.authenticate() returns User | None
# #COMPLETION_DRIVE_INTEGRATION: Assuming request.json has {email, password}
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = AuthService.authenticate(
        email=data['email'],
        password=data['password']
    )

    if user:
        return jsonify({'token': user.generate_token(), 'user': user.to_dict()})
    return jsonify({'error': 'Invalid credentials'}), 401
```

**In .orchestration/implementation-log.md:**
```markdown
#FILE_MODIFIED: api/routes/auth.py
  Lines affected: 12-24
  Changes: Added /api/login endpoint

#COMPLETION_DRIVE: Assuming AuthService.authenticate() exists
  Context: Following existing service pattern

#COMPLETION_DRIVE_INTEGRATION: Assuming client sends {email, password} JSON
  Context: Standard login request format
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Tagging without verifiability

```markdown
#COMPLETION_DRIVE: This looks good
```

**Problem:** Vague, not verifiable

**Fix:**
```markdown
#COMPLETION_DRIVE: Assuming Button.swift uses .frame(height: 44)
  Verifiable by: grep ".frame" src/components/Button.swift
```

---

### ❌ Mistake 2: Claiming file creation without tagging

```markdown
I created DarkModeToggle.tsx with the theme toggle component.
```

**Problem:** No tag = verification-agent won't check

**Fix:**
```markdown
#FILE_CREATED: src/components/DarkModeToggle.tsx (247 lines)
  Description: Theme toggle component
```

---

### ❌ Mistake 3: Implementation agent adding #VERIFIED

```markdown
#COMPLETION_DRIVE: Button uses 44px
#VERIFIED: Checked and it's correct ✓
```

**Problem:** Implementation agents CANNOT verify their own work (generation mode)

**Fix:** Only add #COMPLETION_DRIVE, let verification-agent add #VERIFIED

---

### ❌ Mistake 4: Skipping tags "to save time"

```swift
import LoginView  // Exists, I checked
```

**Problem:** "I checked" during generation = rationalization, not verification

**Fix:**
```swift
// #COMPLETION_DRIVE: Assuming LoginView.swift exists at src/views/LoginView.swift
import LoginView
```

---

### ❌ Mistake 5: Vague screenshot claims

```markdown
#SCREENSHOT_CLAIMED: screenshot.png
```

**Problem:** Which screenshot? Where? What does it show?

**Fix:**
```markdown
#SCREENSHOT_CLAIMED: .orchestration/evidence/task-123/dark-mode-active.png
  Description: Full app with dark theme activated, shows background #1a1a1a
  Timestamp: 2025-10-23T14:26:00
```

---

## FAQ

### Q: Do I tag EVERY import statement?

**A:** No. Only tag when you're making an assumption about existence.

**Don't tag:** Imports of files you just created
```swift
// Just created this file, no tag needed
import MyNewComponent
```

**Do tag:** Imports of existing files you're assuming exist
```swift
// #COMPLETION_DRIVE: Assuming DesignSystem.swift exists
import DesignSystem
```

---

### Q: What if I'm 99% sure a file exists?

**A:** Still tag it. 99% sure = 1% risk of false completion.

```swift
// #COMPLETION_DRIVE: Assuming Colors.swift exists (saw it in earlier context)
import Colors
```

verification-agent will check. If it exists → verified. If not → caught before user sees false completion.

---

### Q: Do tags slow down development?

**A:** Minimally (~2-3 minutes for tagging). But they prevent hours of wasted work from false completions.

**Cost of tagging:** 2-3 minutes
**Cost of false completion:** 30-120 minutes (git reset, restart, lost trust)

Tagging is dramatically cheaper.

---

### Q: Can I add tags after implementation?

**A:** Technically yes, but defeats the purpose. Tag **during** generation to capture real assumptions.

Adding tags after = retrofitting, may miss assumptions made unconsciously.

---

### Q: What if verification fails? Do I retag?

**A:** No. Fix the issue, then verification-agent re-runs verification.

Failed verification → Fix code → Re-run verification → Should pass

Don't modify tags unless the assumption itself changed.

---

### Q: Should tags be removed after verification?

**A:** Yes, except `#PATH_DECISION` and `#PATH_RATIONALE` (permanent documentation).

All other tags should be cleaned by verification-agent after successful verification.

---

## Version History

**v1.0 (2025-10-23):** Initial hybrid Response Awareness implementation
- Core tags: #COMPLETION_DRIVE, #FILE_CREATED, #FILE_MODIFIED, #SCREENSHOT_CLAIMED
- Verification tags: #VERIFIED, #FAILED_VERIFICATION, #CANNOT_VERIFY_WITHOUT_RUNTIME
- Quality gate rules defined
- Implementation log structure defined

**Future versions may add:**
- #CARGO_CULT, #PATTERN_MOMENTUM (pattern detection)
- #CONTEXT_DEGRADED (context tracking)
- #PATH_DECISION (architectural decisions)
- Automated tag cleanup scripts
- Tag format linter
