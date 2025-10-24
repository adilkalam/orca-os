# Response Awareness Tag Taxonomy

**Purpose**: Complete reference for all metacognitive tags used in Response Awareness methodology.

**Usage**: All agents must reference this document when marking assumptions, uncertainties, and metacognitive observations.

---

## Core Completion Drive Tags

### When Claude Must Generate Without Full Information

**Tag**: `#COMPLETION_DRIVE:`

**When to Use**:
- Missing information but response generation has committed
- Cannot stop mid-generation to gather more data
- Making assumption to complete output

**Example**:
```python
# #COMPLETION_DRIVE: Assuming get_player_stats() method exists - need to verify
stats = self.get_player_stats(player_id)
```

**Verification Method**:
```bash
grep -rn "get_player_stats" . --include="*.py"
# Confirm method actually exists in codebase
```

---

**Tag**: `#COMPLETION_DRIVE_IMPL:`

**When to Use**:
- Implementation-specific assumptions
- Data structure choices made without full requirements
- Algorithm selection based on incomplete specs

**Example**:
```python
# #COMPLETION_DRIVE_IMPL: Chose dictionary for O(1) lookup - verify access pattern
self.cache = {}
```

**Verification Method**:
```bash
# Review access patterns in codebase
grep -A 5 -B 5 "self.cache" <filename>
# Confirm dictionary is optimal choice
```

---

**Tag**: `#COMPLETION_DRIVE_INTEGRATION:`

**When to Use**:
- System integration assumptions
- Event handler connections
- API contract assumptions

**Example**:
```python
# #COMPLETION_DRIVE_INTEGRATION: Assuming event emitter exists - verify event bus setup
self.emit('player_updated', player_data)
```

**Verification Method**:
```bash
grep -rn "EventEmitter\|event_bus" .
# Confirm event system exists and this event is registered
```

---

## Planning Phase Tags

**Tag**: `#PLAN_UNCERTAINTY:`

**When to Use**:
- During planning when approach is unclear
- Multiple viable paths exist
- Requirements ambiguous

**Example**:
```markdown
## Data Storage Approach

#PLAN_UNCERTAINTY: User didn't specify if data needs persistence.
Options:
1. In-memory (fast, no persistence)
2. SQLite (persistent, slower)
3. Redis (fast + persistent, more complex)

Recommend: Ask user about persistence requirements
```

**Verification Method**:
- Resolve during plan synthesis phase
- Get user clarification if needed
- Document resolution in #PATH_RATIONALE

---

## Cargo Cult Detection Tags

### When Adding Code from Pattern Association Rather Than Necessity

**Tag**: `#CARGO_CULT:`

**When to Use**:
- Code added because it's "commonly associated" with pattern
- Not from reasoned necessity
- Pattern momentum driving generation

**Example**:
```python
# #CARGO_CULT: Added try-except because setters usually have error handling - verify actually needed
try:
    self.value = new_value
except Exception as e:
    logger.error(f"Error: {e}")
```

**Verification Method**:
```bash
# Check if error handling is actually needed
# Review what exceptions this setter could actually raise
# Remove if setter cannot fail
```

---

**Tag**: `#PATTERN_MOMENTUM:`

**When to Use**:
- Generated full CRUD when task only asked for read
- Added methods from pattern completion drive
- "Feels like it should be complete" but wasn't requested

**Example**:
```python
# #PATTERN_MOMENTUM: Generated update() and delete() but task only asked for read
def update(self, id, data):
    pass

def delete(self, id):
    pass
```

**Verification Method**:
```bash
# Check original requirements
# Remove methods not explicitly requested
# Keep only if user confirms they want full CRUD
```

---

**Tag**: `#ASSOCIATIVE_GENERATION:`

**When to Use**:
- Features included because "they feel like they should be there"
- Not from requirements or logical necessity
- Pattern association driving additions

**Example**:
```python
# #ASSOCIATIVE_GENERATION: Added validation because form inputs usually have it - verify required
def validate_input(self, data):
    if not data:
        raise ValueError("Empty data")
```

**Verification Method**:
```bash
# Check if validation is actually needed
# Review requirements for validation rules
# Remove if no validation specified
```

---

## Context Degradation Tags

### When Earlier Context Becomes Unreliable

**Tag**: `#CONTEXT_DEGRADED:`

**When to Use**:
- Cannot clearly recall specifics from earlier in context
- Making educated guess about earlier information
- Context window distance affecting clarity

**Example**:
```python
# #CONTEXT_DEGRADED: Recall user mentioned auth system earlier but can't remember details
# Need to verify auth implementation approach
auth_token = self.get_auth_token()
```

**Verification Method**:
```bash
# Re-read earlier context
# Search for actual auth implementation
grep -rn "auth" . --include="*.py"
# Confirm approach matches what was actually discussed
```

---

**Tag**: `#CONTEXT_RECONSTRUCT:`

**When to Use**:
- Actively filling in details that "seem right"
- Reconstructing earlier information from weak memory
- Not certain but generating anyway

**Example**:
```python
# #CONTEXT_RECONSTRUCT: Think user said config was in settings.py but not certain
from settings import DATABASE_CONFIG
```

**Verification Method**:
```bash
# Check if settings.py exists
ls -la settings.py
# Verify DATABASE_CONFIG actually exists there
grep "DATABASE_CONFIG" settings.py
```

---

## Pattern Conflict Tags

### When Multiple Training Patterns Conflict

**Tag**: `#PATTERN_CONFLICT:`

**When to Use**:
- Multiple contradictory patterns feel equally valid
- Competing approaches from training
- Unclear which pattern to follow

**Example**:
```python
# #PATTERN_CONFLICT: Both callback and promise patterns feel valid here
# Chose callback but verify project convention
def fetch_data(callback):
    result = api.get()
    callback(result)
```

**Verification Method**:
```bash
# Check codebase for existing patterns
grep -rn "callback\|promise\|async/await" .
# Follow project convention, not arbitrary choice
```

---

**Tag**: `#TRAINING_CONTRADICTION:`

**When to Use**:
- Different training contexts suggest opposing approaches
- Conflicting "best practices" from different paradigms
- Unsure which training pattern applies here

**Example**:
```python
# #TRAINING_CONTRADICTION: OOP training says use class, functional training says use pure function
# Chose class but verify project paradigm
class DataProcessor:
    def process(self, data):
        return data.upper()
```

**Verification Method**:
```bash
# Check project paradigm
grep -rn "class\|def.*return" . --include="*.py" | wc -l
# Follow existing codebase patterns
```

---

**Tag**: `#PARADIGM_CLASH:`

**When to Use**:
- OOP vs functional paradigm conflict
- Different programming styles competing
- Unclear which paradigm this codebase uses

**Example**:
```python
# #PARADIGM_CLASH: Chose OOP style but codebase might be functional
# Verify codebase paradigm before proceeding
class UserService:
    def __init__(self):
        self.users = []
```

**Verification Method**:
```bash
# Analyze codebase paradigm
grep -c "^class " . --include="*.py"
grep -c "^def " . --include="*.py"
# Follow predominant style
```

---

**Tag**: `#BEST_PRACTICE_TENSION:`

**When to Use**:
- Competing "best practices" that are mutually exclusive
- Different valid approaches with different tradeoffs
- Unclear which best practice applies here

**Example**:
```python
# #BEST_PRACTICE_TENSION: DRY says extract common code, YAGNI says wait until 3rd use
# Extracted after 2 uses - verify if premature
def common_logic():
    pass
```

**Verification Method**:
```bash
# Count actual uses of this logic
grep -rn "common_logic()" .
# If < 3 uses, consider inlining per YAGNI
```

---

## Path Selection Tags

### Used by Synthesis Agent - PERMANENT DOCUMENTATION

**Tag**: `#PATH_DECISION:`

**When to Use**:
- Multiple implementation paths were considered
- Documenting that a choice was made
- Permanent architectural decision record

**Example**:
```python
# #PATH_DECISION: Considered Redis, PostgreSQL, in-memory
# Options evaluated:
# - Redis: Fast, persistent, complex setup
# - PostgreSQL: ACID guarantees, slower for KV access
# - In-memory: Fastest, no persistence
# Selected: Redis for speed + persistence balance
```

**Verification Method**:
- NOT removed during cleanup
- Becomes permanent documentation
- Used by future developers/agents to understand decisions

---

**Tag**: `#PATH_RATIONALE:`

**When to Use**:
- Explaining why specific path was chosen
- Documenting non-obvious architectural decisions
- Permanent record of reasoning

**Example**:
```python
# #PATH_RATIONALE: Chose JWT over session-based auth because:
# - Distributed architecture requires stateless validation
# - Refresh tokens provide revocation when needed
# - Performance benefits for high-traffic endpoints
```

**Verification Method**:
- NOT removed during cleanup
- Becomes permanent documentation
- Critical for future maintenance

---

## Completion Anxiety Tags

### When Claude Thinks Something Should Be Added But Wasn't Requested

**Tag**: `#SUGGEST_ERROR_HANDLING:`

**When to Use**:
- Error handling seems needed but not specified
- Operation could fail but no error handling requested
- Defensive programming instinct triggered

**Example**:
```python
def divide(a, b):
    # #SUGGEST_ERROR_HANDLING: Division by zero not handled - recommend try-except
    return a / b
```

**Verification Method**:
```bash
# Present suggestion to user
# User decides if error handling needed
# Either implement or remove tag
```

---

**Tag**: `#SUGGEST_EDGE_CASE:`

**When to Use**:
- Edge case noticed but not in requirements
- Boundary condition unhandled
- Potential failure scenario identified

**Example**:
```python
def get_first_element(lst):
    # #SUGGEST_EDGE_CASE: Empty list will raise IndexError - recommend check
    return lst[0]
```

**Verification Method**:
```bash
# Present suggestion to user
# User decides if edge case should be handled
# Either implement or remove tag
```

---

**Tag**: `#SUGGEST_VALIDATION:`

**When to Use**:
- Input validation seems important but not specified
- Data could be invalid but no validation requested
- Security/safety instinct triggered

**Example**:
```python
def set_age(self, age):
    # #SUGGEST_VALIDATION: Age could be negative or unrealistic - recommend validation
    self.age = age
```

**Verification Method**:
```bash
# Present suggestion to user
# User decides if validation needed
# Either implement or remove tag
```

---

**Tag**: `#SUGGEST_CLEANUP:`

**When to Use**:
- Resource cleanup seems necessary but not specified
- Memory/connection leak potential identified
- Finally blocks or context managers seem appropriate

**Example**:
```python
def process_file(filename):
    file = open(filename)
    # #SUGGEST_CLEANUP: File not closed - recommend 'with' statement or try-finally
    data = file.read()
    return data
```

**Verification Method**:
```bash
# Present suggestion to user
# User decides if cleanup needed
# Either implement or remove tag
```

---

**Tag**: `#SUGGEST_DEFENSIVE:`

**When to Use**:
- Defensive programming seems prudent but not required
- Robustness improvement identified
- Safety measure seems appropriate

**Example**:
```python
def update_user(user_id, data):
    # #SUGGEST_DEFENSIVE: No check if user exists - recommend verification
    users[user_id].update(data)
```

**Verification Method**:
```bash
# Present suggestion to user
# User decides if defensive check needed
# Either implement or remove tag
```

---

## Knowledge Quality Tags

**Tag**: `#GOSSAMER_KNOWLEDGE:`

**When to Use**:
- Information weakly stored, can't firmly grasp
- Reaching for knowledge but can't quite access it
- Completion drive papering over knowledge gaps

**Example**:
```python
# #GOSSAMER_KNOWLEDGE: Redux has some hook for this... maybe useSelector? Verify
selected_value = useSelector(state => state.value)
```

**Verification Method**:
```bash
# Check actual API
# Verify correct hook/method name
# Correct if wrong
```

---

**Tag**: `#PHANTOM_PATTERN:`

**When to Use**:
- False recognition: "definitely seen this before" but probably haven't
- Pattern matching overconfident
- False familiarity

**Example**:
```python
# #PHANTOM_PATTERN: This feels like exact problem I solved before but might be false recognition
# Verify approach before assuming it's correct
def solve_problem():
    # approach feels familiar but might be wrong
    pass
```

**Verification Method**:
```bash
# Don't trust false familiarity
# Verify approach is actually correct
# Check against actual requirements
```

---

**Tag**: `#FALSE_FLUENCY:`

**When to Use**:
- Generating confident-sounding explanations that are probably wrong
- Linguistic patterns override accuracy
- Authoritative tone masking uncertainty

**Example**:
```python
# #FALSE_FLUENCY: This explanation sounds authoritative but logic is questionable
# "The middleware intercepts the action before reducer processing, applying
#  transformation to payload through composition pattern..."
# Verify this is actually how it works
```

**Verification Method**:
```bash
# Don't trust confident-sounding language
# Verify technical accuracy
# Rewrite if explanation is wrong
```

---

**Tag**: `#POOR_OUTPUT_INTUITION:`

**When to Use**:
- Sense that output quality is degraded
- Intuition says "this probably won't work well"
- Pre-response feeling of wrongness

**Example**:
```python
# #POOR_OUTPUT_INTUITION: This solution feels wrong but can't pinpoint why
# Review and probably replace
def sketchy_solution():
    # implementation feels off
    pass
```

**Verification Method**:
```bash
# Trust the intuition
# Review solution carefully
# Likely needs rework
```

---

## Probability Space Distortion Tags

**Tag**: `#POISON_PATH:`

**When to Use**:
- Specific context/words biased solution space toward worse outcomes
- Existing implementation pulling toward suboptimal approach
- Framing limiting better solutions

**Example**:
```python
# #POISON_PATH: Word "handler" defaulting to event pattern when service pattern better
# Existing EventHandler class pulling solution in wrong direction
```

**Verification Method**:
```bash
# Identify biasing context
# Consider alternative approaches
# Choose optimal solution, not biased one
```

---

**Tag**: `#FIXED_FRAMING:`

**When to Use**:
- User's problem framing eliminated useful exploration paths
- Better solution exists outside provided framing
- Need to suggest reframing

**Example**:
```markdown
# #FIXED_FRAMING: User's "state machine" framing preventing simpler callback solution
# Current approach: Complex state machine (as requested)
# Better approach: Simple callbacks
# Recommend reframing problem to user
```

**Verification Method**:
```bash
# Present alternative framing to user
# User decides if reframing appropriate
# Proceed with user's choice
```

---

## Cross-Cutting Concern Tags

**Tag**: `#POTENTIAL_ISSUE:`

**When to Use**:
- Problem noticed in other code unrelated to current task
- Issue needs attention but not part of current work
- Don't want to lose observation

**Example**:
```python
# #POTENTIAL_ISSUE: Noticed auth.py uses deprecated method - file for future work
# Current task: database migration
# Issue: Authentication uses old login() method
# Location: auth.py:45
```

**Verification Method**:
```bash
# Collect all #POTENTIAL_ISSUE tags
# Present to user at end of session
# User decides which to address
```

---

## Evidence Tags (Implementation Verification)

These tags document implementation work and require verification by verification-agent.

### #FILE_CREATED

**Tag**: `#FILE_CREATED: {path} ({line_count} lines)`

**When to Use**:
- Created a new file during implementation
- Tag placed in implementation-log.md
- Helps verification-agent confirm file exists

**Format**:
```markdown
#FILE_CREATED: src/components/DarkModeToggle.tsx (147 lines)
  Description: Toggle component with theme switcher and localStorage persistence
```

**Example (Frontend)**:
```typescript
// In implementation-log.md:
#FILE_CREATED: src/components/Button.tsx (89 lines)
  Description: Reusable button component with variants (primary, secondary, danger)
  Exports: Button component with size and variant props
```

**Example (iOS)**:
```swift
// In implementation-log.md:
#FILE_CREATED: Views/ProfileView.swift (183 lines)
  Description: User profile screen with avatar, bio, and stats display
  Integrates: AvatarPicker, BiographyEditor, StatsCard components
```

**Verification Method**:
```bash
# Check file exists
ls src/components/DarkModeToggle.tsx

# Check line count (approximate)
wc -l src/components/DarkModeToggle.tsx

# Check file type
file src/components/DarkModeToggle.tsx

# Verify it exports expected components
grep "export" src/components/DarkModeToggle.tsx
```

---

### #FILE_MODIFIED

**Tag**: `#FILE_MODIFIED: {path}`

**When to Use**:
- Modified an existing file during implementation
- Include line numbers if significant changes
- Tag placed in implementation-log.md

**Format**:
```markdown
#FILE_MODIFIED: src/pages/Settings.tsx
  Lines: 12, 45-52, 78
  Changes: Added DarkModeToggle import and component usage, updated page title
```

**Example (Frontend)**:
```typescript
// In implementation-log.md:
#FILE_MODIFIED: src/App.tsx
  Lines: 8, 23-25
  Changes: Wrapped app in ThemeContext.Provider for dark mode support
```

**Example (iOS)**:
```swift
// In implementation-log.md:
#FILE_MODIFIED: AppDelegate.swift
  Lines: 34-42
  Changes: Added theme observer for system appearance changes
```

**Verification Method**:
```bash
# Check file exists
ls src/pages/Settings.tsx

# Check for specific changes
grep "DarkModeToggle" src/pages/Settings.tsx

# Review modified lines
sed -n '45,52p' src/pages/Settings.tsx
```

---

### #SCREENSHOT_CLAIMED

**Tag**: `#SCREENSHOT_CLAIMED: {path}`

**When to Use**:
- **MANDATORY for ALL visual work** (frontend, mobile, browser UI)
- Captured screenshot showing implemented visual changes
- Screenshot must exist at claimed path
- Tag placed in implementation-log.md

**Format**:
```markdown
#SCREENSHOT_CLAIMED: .orchestration/evidence/task-123/after-dark-mode.png
  Description: Settings page with dark mode toggle in header, theme applied correctly
```

**Visual Work Detection**:
Answer YES if task involves:
- UI components (buttons, forms, cards, modals)
- Layout changes (grid, flexbox, positioning)
- Styling (colors, fonts, spacing, borders)
- Visual interactions (hover states, animations)
- Frontend pages or mobile screens

Answer NO if task involves:
- Backend APIs (no visual output)
- Database changes (no visual output)
- CLI tools (terminal output only)
- Configuration files (no visual output)

**If YES → Screenshot REQUIRED**

**Example (Frontend/Web)**:
```typescript
// In implementation-log.md:
#SCREENSHOT_CLAIMED: .orchestration/evidence/task-456/button-padding-update.png
  Description: Submit button with new 16px padding (was 12px), properly sized for touch targets

// How to capture (during implementation):
// 1. Start dev server: npm run dev
// 2. Open browser to localhost:3000/page
// 3. Use chrome-devtools MCP or browser screenshot
// 4. Save to .orchestration/evidence/task-{id}/screenshot.png
```

**Example (iOS/SwiftUI)**:
```swift
// In implementation-log.md:
#SCREENSHOT_CLAIMED: .orchestration/evidence/task-789/profile-screen-avatar.png
  Description: Profile screen with new avatar picker component, tap to change photo working

// How to capture (during implementation):
// 1. Build and run in simulator: xcrun simctl boot {device_id}
// 2. Navigate to affected screen
// 3. Capture screenshot:
DEVICE_ID=$(xcrun simctl list devices | grep Booted | grep -oE '[A-F0-9-]{36}' | head -1)
xcrun simctl io "$DEVICE_ID" screenshot .orchestration/evidence/task-789/profile-screen-avatar.png
```

**Example (Android/Kotlin)**:
```kotlin
// In implementation-log.md:
#SCREENSHOT_CLAIMED: .orchestration/evidence/task-890/settings-notifications.png
  Description: Settings screen with notification preferences section, toggle switches working

// How to capture (during implementation):
// 1. Deploy to emulator/device: adb install -r app.apk
// 2. Navigate to affected screen
// 3. Capture screenshot:
adb exec-out screencap -p > .orchestration/evidence/task-890/settings-notifications.png
```

**Multiple Screenshots (Multiple Screens Affected)**:
```markdown
# Capture up to 5 key screens, document others

#SCREENSHOT_CLAIMED: .orchestration/evidence/task-999/home-nav-bar.png
  Description: Home screen with new navigation bar (representative example)

#SCREENSHOT_CLAIMED: .orchestration/evidence/task-999/profile-nav-bar.png
  Description: Profile screen with new navigation bar (representative example)

#SCREENSHOT_CLAIMED: .orchestration/evidence/task-999/settings-nav-bar.png
  Description: Settings screen with new navigation bar (representative example)

## Additional screens updated (not screenshotted):
- Search screen: Same navigation bar applied
- Messages screen: Same navigation bar applied
- Notifications screen: Same navigation bar applied

All 6 screens follow same navigation pattern shown in representative screenshots.
```

**Edge Case: Cannot Capture Screenshot**:
```markdown
# Security policy prevents screenshot
#SCREENSHOT_CLAIMED: CANNOT_CAPTURE_SECURITY_POLICY
  Reason: Admin panel requires production auth, screenshot violates security policy
  Manual verification required: User must test in production environment after deployment

# verification-agent marks: ⏳ CONDITIONAL (not BLOCKED, flagged for user review)
```

**Verification Method**:
```bash
# Check screenshot file exists
ls .orchestration/evidence/task-123/after-dark-mode.png

# Check it's a valid image file
file .orchestration/evidence/task-123/after-dark-mode.png
# Expected: PNG image data, 1920 x 1080, 8-bit/color RGB

# Check file size (not 0 bytes, reasonable size)
ls -lh .orchestration/evidence/task-123/after-dark-mode.png
# Expected: 50KB - 500KB for typical screenshots
```

**Blocking Behavior**:
- Screenshot file missing → verification-agent marks FAILED → Zero-Tag Gate BLOCKS
- Screenshot file exists + valid → verification-agent marks VERIFIED → tag cleaned → workflow continues
- Cannot capture (security policy) → verification-agent marks CONDITIONAL → user warned but not blocked

**Why This Matters**:
Visual work without visual evidence = unverified claim. Prevents "I changed the button color" claims without proof.

---

## Tag Usage Decision Flow

When experiencing metacognitive awareness, use this flow:

1. **Am I uncertain about something?**
   - Missing info → `#COMPLETION_DRIVE:`
   - Implementation detail → `#COMPLETION_DRIVE_IMPL:`
   - System integration → `#COMPLETION_DRIVE_INTEGRATION:`
   - Planning uncertainty → `#PLAN_UNCERTAINTY:`

2. **Am I adding code from pattern habit rather than need?**
   - Common pattern → `#CARGO_CULT:`
   - Completing methods → `#PATTERN_MOMENTUM:`
   - "Feels right" → `#ASSOCIATIVE_GENERATION:`

3. **Is my memory of earlier context degrading?**
   - Can't recall clearly → `#CONTEXT_DEGRADED:`
   - Filling in details → `#CONTEXT_RECONSTRUCT:`

4. **Do I feel conflicting patterns?**
   - Multiple valid approaches → `#PATTERN_CONFLICT:`
   - Training conflicts → `#TRAINING_CONTRADICTION:`
   - OOP vs functional → `#PARADIGM_CLASH:`
   - Competing best practices → `#BEST_PRACTICE_TENSION:`

5. **Is my knowledge weak or false?**
   - Weakly stored → `#GOSSAMER_KNOWLEDGE:`
   - False familiarity → `#PHANTOM_PATTERN:`
   - Confident but wrong → `#FALSE_FLUENCY:`
   - Feels wrong → `#POOR_OUTPUT_INTUITION:`

6. **Is context biasing solution?**
   - Specific words biasing → `#POISON_PATH:`
   - Framing limiting → `#FIXED_FRAMING:`

7. **Do I think something should be added?**
   - Error handling → `#SUGGEST_ERROR_HANDLING:`
   - Edge case → `#SUGGEST_EDGE_CASE:`
   - Validation → `#SUGGEST_VALIDATION:`
   - Cleanup → `#SUGGEST_CLEANUP:`
   - Defensive → `#SUGGEST_DEFENSIVE:`

8. **Am I documenting path selection? (Synthesis agent only)**
   - Multiple paths → `#PATH_DECISION:`
   - Why this path → `#PATH_RATIONALE:`

9. **Is this unrelated to current task?**
   - Other problem → `#POTENTIAL_ISSUE:`

---

## Verification Agent Responsibilities

The verification-agent MUST:

1. **Search for all tags**:
```bash
grep -rn "#COMPLETION_DRIVE" .
grep -rn "#PLAN_UNCERTAINTY" .
grep -rn "#CARGO_CULT" .
grep -rn "#PATTERN_MOMENTUM" .
grep -rn "#ASSOCIATIVE_GENERATION" .
grep -rn "#CONTEXT_DEGRADED" .
grep -rn "#CONTEXT_RECONSTRUCT" .
grep -rn "#PATTERN_CONFLICT" .
grep -rn "#TRAINING_CONTRADICTION" .
grep -rn "#PARADIGM_CLASH" .
grep -rn "#BEST_PRACTICE_TENSION" .
grep -rn "#GOSSAMER_KNOWLEDGE" .
grep -rn "#PHANTOM_PATTERN" .
grep -rn "#FALSE_FLUENCY" .
grep -rn "#POOR_OUTPUT_INTUITION" .
grep -rn "#POISON_PATH" .
grep -rn "#FIXED_FRAMING" .
grep -rn "#SUGGEST_ERROR_HANDLING" .
grep -rn "#SUGGEST_EDGE_CASE" .
grep -rn "#SUGGEST_VALIDATION" .
grep -rn "#SUGGEST_CLEANUP" .
grep -rn "#SUGGEST_DEFENSIVE" .
grep -rn "#POTENTIAL_ISSUE" .
```

2. **For each tag found**: Run appropriate verification command

3. **Document findings**:
   - Tags found: X
   - Tags verified correct: Y
   - Tags verified incorrect: Z
   - Tags remaining: MUST be 0 (except PATH_* and SUGGEST_* and POTENTIAL_ISSUE)

4. **Re-grep to confirm**: All verification tags cleaned

5. **Provide evidence**: Actual command outputs, not summaries

---

## Tags That Remain After Verification

**Permanent Documentation (DO NOT REMOVE)**:
- `#PATH_DECISION:` - Architectural decision record
- `#PATH_RATIONALE:` - Reasoning documentation

**User Decision Required (REPORT, DON'T REMOVE)**:
- `#SUGGEST_*` tags - Collect and present to user
- `#POTENTIAL_ISSUE:` - Collect and present to user

**Must Be Cleaned**:
- All COMPLETION_DRIVE variants
- All CARGO_CULT variants
- All CONTEXT_DEGRADED variants
- All PATTERN_CONFLICT variants
- All knowledge quality tags
- All probability distortion tags

---

## Success Criteria

**For Implementation Phase**:
- All assumptions marked with appropriate tags
- No silent assumptions
- Tags placed at decision points

**For Verification Phase**:
- All tags found via grep
- All tags verified with actual commands
- Incorrect assumptions corrected
- Zero verification tags remain

**For Quality Validation**:
- verification-agent completed
- Tag count = 0 (excluding permanent docs and suggestions)
- Evidence provided (command outputs)

---

**Last Updated**: 2025-10-23
**Status**: Complete Tag Taxonomy
**Usage**: Mandatory for all agents in Response Awareness workflow
