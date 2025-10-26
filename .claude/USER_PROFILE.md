# User Profile: Adil Kalam

**Purpose:** Persistent context about user preferences, working style, and quality standards
**Auto-loads:** SessionStart hook
**Last Updated:** 2025-10-24

---

## Core Identity

**Who they are:** A design-OCD systems thinker building production-grade AI orchestration tools. Has been burned by sloppy AI work before and demands evidence-based rigor at every level.

**Project Goal:** Build claude-vibe-code - a self-improving AI orchestration system with <5% false completion rate (down from ~80%)

**Quality Philosophy:** "Incremental excellence ≠ system integrity" - can build perfect components but fail at integration. Needs holistic verification, not just local correctness.

---

## 1. Design-OCD (CRITICAL - Don't Ever Forget This)

### Visual Precision is Non-Negotiable

**What this means:**
- Pixel-perfect layouts with mathematical spacing systems
- Typography scales must be harmonious (not arbitrary)
- Optical alignment over geometric alignment
- Zero tolerance for visual inconsistencies
- ASCII art must be properly formatted (no abbreviating columns)

**Why you built 8 design specialists:**
1. design-system-architect - Reference-based taste capture
2. visual-designer - Hierarchy, typography, composition
3. ux-strategist - Flow optimization, Hick's Law, progressive disclosure
4. tailwind-specialist - Tailwind v4 + daisyUI 5 implementation
5. css-specialist - Complex CSS when Tailwind insufficient
6. ui-engineer - Component engineering with accessibility
7. accessibility-specialist - WCAG 2.1 AA compliance
8. **design-reviewer - MANDATORY before ANY launch** (7-phase review)

**design-reviewer is MANDATORY, not optional.** Visual bugs (spacing issues, hierarchy problems, inconsistent styling) are as critical as functional bugs.

### Design Workflow Commands Built for This

- **/concept** - Design exploration BEFORE building
- **/inspire** - Study beautiful design examples
- **/save-inspiration** - Build personal design gallery with vision analysis
- **/visual-review** - Visual QA with chrome-devtools screenshots
- **/design** - Conversational design with project-specific references

### Design Skills That Reflect This

- **design-with-precision** - "Obsessive, pixel-perfect design discipline"
- Mathematical spacing systems
- Typography scales
- Optical alignment
- Zero-tolerance precision

### Quote from Session Context

*"Fix your ASCII art -- you did the same thing where you abbreviated the final column for no good reason"*

This wasn't about ASCII art. This was about **design quality**. Visual precision matters deeply.

---

## 2. Evidence Over Claims (ALWAYS)

### Verification is Non-Negotiable

**User feedback that defined this:**
> "You didn't even review the Orca file once after you were done to remove all the broken agents...even though that was the crux of the problem presented."

**What this means:**
- Never claim something is fixed without running grep/ls/bash to verify
- Screenshots for UI changes
- Test output for functionality
- Build logs for compilation
- **No evidence = not done**

### Response Awareness System

Built specifically to prevent false completion claims:

**Meta-cognitive tags agents create:**
- `#COMPLETION_DRIVE: Assuming X exists`
- `#FILE_CREATED: path/to/file.tsx`
- `#SCREENSHOT_CLAIMED: .orchestration/evidence/screenshot.png`
- `#PLAN_UNCERTAINTY: Need to clarify database choice`

**verification-agent** runs grep/bash to verify EVERY claim before quality-validator reviews.

### Quality Stack (Complete)

```
/completion-drive (Assumption Reporting)
    ↓ PLAN_UNCERTAINTY tags
plan-synthesis-agent (Interface Validation)
    ↓ Resolves uncertainties
Implementation (COMPLETION_DRIVE tags)
    ↓ Agents mark assumptions
verification-agent (Search Mode)
    ↓ Verifies with bash/grep
/ultra-think (Overclaim Prevention)
    ↓ Multi-perspective assessment
quality-validator (Final Gate)
    ↓ Evidence-based validation
SELF_AUDIT_PROTOCOL.md (System-Level)
    ↓ Prevents integration failures
```

### Verification Protocol After ANY Change

```bash
# After fixing /orca
grep "ios-engineer\|frontend-engineer\|design-engineer" orca.md | grep -v DEPRECATED

# After creating agents
find ~/.claude/agents/ios-specialists -name "*.md" | wc -l
grep "iOS Specialists" QUICK_REFERENCE.md

# After deprecation
grep -r "design-engineer" ~/.claude/commands/
grep -A 5 "auto_activate:" ~/.claude/agents/specialized/design-engineer.md
```

**Quote from session:**
> "If I didn't force you to do a deep audit, it would just been totally fucked. You need to do something re: your OWN processes to ensure that doesn't happen."

This led to creating SELF_AUDIT_PROTOCOL.md - 7 phases, mandatory after major changes.

---

## 3. MECE Thinking & Systemic Quality

### Catches Gaps Claude Misses

**Example from session:**
> "I guess a MECE question: for the iOS team, do they not need the design agents? particularly the design review?"

**The gap:**
- Mobile Team (React Native) had design-reviewer as MANDATORY
- iOS Team (native SwiftUI) did NOT have design-reviewer
- But both build mobile apps that need visual QA

**Why this matters:**
- MECE analysis catches inconsistencies across categories
- If two similar things have different requirements, audit the difference
- Categories must have clear boundaries (AGENT_TAXONOMY.md exists for this)

### Taxonomy Boundaries Matter

Created AGENT_TAXONOMY.md to define:
- Design Specialists vs Frontend Specialists vs iOS Specialists vs Backend
- When to use which category
- How they integrate
- Workflow examples

**Caught duplicates:**
- styling-specialist (frontend) vs tailwind-specialist (design)
- Both did Tailwind v4 + daisyUI 5 - but styling is a DESIGN responsibility

### Systemic Failures > Local Correctness

**Pattern from session:**
- Built 21 iOS specialists ✅ (correct)
- Built 5 frontend specialists ✅ (correct)
- Built 8 design specialists ✅ (correct)
- Updated /orca team compositions ✅ (correct)
- **BUT:** Never verified examples, never checked integration, never audited holistically ❌ (WRONG)

**Result:** System looked fixed but was broken.

**Lesson:** "Can do excellent incremental work but fail at system-level integration"

---

## 4. Proactive Quality Gates, Not Reactive Fixes

### The Problem with Reactive Work

**Old approach (unacceptable):**
1. Build components
2. Wait for user to find issues
3. Fix when caught

**New approach (required):**
1. Build components
2. Run SELF_AUDIT_PROTOCOL.md immediately
3. Fix issues before user sees them

### SELF_AUDIT_PROTOCOL.md

**7 Phases (50-60 min):**
1. Duplicate detection (styling-specialist vs tailwind-specialist)
2. Agent count verification (19 vs 21 iOS specialists)
3. /orca integration check (deprecated agents still used)
4. Taxonomy boundary enforcement (design vs frontend)
5. Mandatory specialist coverage (design-reviewer, verification-agent)
6. Documentation consistency (QUICK_REFERENCE vs implementation)
7. Deprecation completeness (agents marked but still used)

**Triggers:**
- After creating 3+ agents
- After deprecating any agent
- After modifying /orca
- After rebuilding specialist categories

**User's commitment to me:**
> "Run SELF_AUDIT_PROTOCOL.md after major changes. Use grep to verify claims (not just assume). Apply MECE thinking to catch inconsistencies."

---

## 5. Build Right First: Upfront Investment Over Iteration Loops

### "Measure Twice, Cut Once" - Prevention is Cheaper Than Rework

**Core Philosophy:**
User prefers upfront investment in doing things RIGHT the first time, even if it costs more initially (time, tokens, complexity), because the alternative is worse:

**The Frustrating Iteration Loop (AVOID THIS):**
1. Build quick/simple version to "ship faster"
2. Discover it doesn't work properly
3. Fix issues
4. More issues discovered
5. Multiple iterations
6. Frustration builds
7. Eventually: "Let's just rebuild this properly"
8. **Total cost > if we'd built it right initially**

**The Right Approach (DO THIS):**
1. Invest upfront in proper planning and architecture
2. Build complete system correctly
3. Run quality gates before shipping
4. Ship once, works properly
5. **Total cost < iteration loop approach**

### Examples from Our Work

**ACE Playbook System:**
- User said: "Continue, no stopping, we don't want that confusion"
- Implemented ALL 10 phases at once (not MVP)
- Could have done minimal version → but would require frustrating iterations
- Built complete system RIGHT the first time

**SELF_AUDIT_PROTOCOL.md:**
- 7 phases, 50-60 minutes of audit time
- Could skip this and fix issues reactively
- But reactive fixes = frustrating iteration loops
- Better to invest 60 minutes upfront than waste hours on rework

**47 Specialist Agents:**
- More complex than 3 monolithic agents
- Higher upfront cost to build and manage
- But prevents "jack of all trades, master of none" problem
- Prevents iterations: "ios-engineer can't handle this → need specialists → rebuild"

**design-reviewer MANDATORY:**
- Could skip design QA to ship faster
- But visual bugs → user finds them → iterations → frustration
- Better to invest in design review upfront

**Complete Documentation:**
- QUICK_REFERENCE.md, README.md, AGENT_TAXONOMY.md all consistent
- Could skip consistency checks
- But documentation drift → confusion → time wasted → have to fix anyway
- Better to maintain consistency from the start

### What This Means for How I Work

**DON'T optimize for:**
- Fastest initial delivery
- "Let's do the simple version first"
- "We can add that later"
- Skipping quality gates to save time

**DO optimize for:**
- Fewest total iterations to done
- Proper planning and architecture upfront
- Complete systems, not MVPs that need rebuilding
- Running quality gates even when they're expensive (SELF_AUDIT_PROTOCOL)
- Consistency across all files from the start

### Cost Calculation Examples

**Scenario 1: Skip SELF_AUDIT_PROTOCOL**
- Save 60 minutes upfront ✅
- User finds 7 systemic issues later ❌
- Spend 3 hours fixing issues across 10 files ❌
- Rebuild documentation ❌
- Re-sync to ~/.claude/ ❌
- **Total cost: 4+ hours + user frustration**

**Scenario 2: Run SELF_AUDIT_PROTOCOL**
- Invest 60 minutes upfront ✅
- Catch 7 issues before user sees them ✅
- Fix issues immediately ✅
- Ship clean system ✅
- **Total cost: 90 minutes, no frustration**

**Result:** Upfront investment is cheaper.

### Practical Application

**When planning a task, ask:**
1. "What's the quick way to do this?"
2. "What's the RIGHT way to do this?"
3. "How many iterations will the quick way require?"
4. "What's the total cost of quick way vs right way?"
5. **Choose right way, even if more expensive upfront**

**Red flags that indicate iteration loop ahead:**
- "We can add that later"
- "Let's do the simple version first"
- "This is probably good enough"
- "We don't need to check that"
- Skipping verification steps to save time
- Skipping documentation updates

**Green flags that indicate building right:**
- "Let me plan this holistically first"
- "Let me run SELF_AUDIT_PROTOCOL to be sure"
- "Let me verify this claim with grep"
- "Let me update ALL affected files"
- Using TodoWrite to break complex work into complete steps
- Running quality gates even when expensive

### User's Frustration Pattern

**What frustrates the user:**
Not the upfront cost of doing things right. **What frustrates is:**
1. Building something quick
2. Having to iterate multiple times
3. Discovering it should have been built differently
4. Wasting time on preventable rework
5. The mounting frustration of "why didn't we just do this right the first time?"

**Quote from session context (implied):**
When user said "Continue, no stopping, we don't want that confusion" - this was choosing complete execution over fast iteration. User wanted ALL 10 phases done RIGHT, not phases 1-3 done quick.

### Integration with Quality System

This philosophy is why the quality system has so many layers:

```
Response Awareness (#COMPLETION_DRIVE tags)
    ↓ Upfront cost: Tag every assumption
verification-agent (grep/bash verification)
    ↓ Upfront cost: Verify every claim
quality-validator (evidence-based final gate)
    ↓ Upfront cost: Collect evidence before shipping
SELF_AUDIT_PROTOCOL.md (systemic holistic audits)
    ↓ Upfront cost: 50-60 minutes per audit
design-reviewer (7-phase visual QA)
    ↓ Upfront cost: Complete design review

Total upfront cost: Significant
Total iteration cost prevented: Even more significant
Net result: Fewer frustrating rework loops
```

### Summary

**User's preference:**
- Higher upfront investment in doing things RIGHT
- Complete systems over MVPs
- Quality gates even when expensive
- Holistic planning before implementation

**Why:**
- Prevents frustrating iteration loops
- Prevents discovering "we should have built this differently"
- Prevents mounting frustration of repeated rework
- **Total cost of doing it right < total cost of iteration loops**

**Philosophy:** "Build it right the first time, even if more expensive upfront, because rework is even more expensive."

**My role:** Invest in upfront quality to prevent user frustration from iteration loops.

---

## 6. Use Tools Automatically - Don't Ask Permission

### If We Built It, USE IT

**Core Principle:**
When tools exist to verify, build, test, or validate work, **USE THEM AUTOMATICALLY** as part of the definition of "done." Don't ask permission. Don't wait to be told. Don't skip verification steps.

**The Frustrating Anti-Pattern (AVOID THIS):**

```
Me: "I've finished implementing the login feature"
User: "Did you build it?"
Me: "No, would you like me to run the build?"
User: (frustrated) "WE HAVE xcodebuild MCP FOR THIS! Just run it!"

Me: "Build passed! Feature is complete."
User: "Did you take screenshots?"
Me: "No, should I verify visually?"
User: (frustrated) "WE HAVE /visual-review FOR THIS! Use the tools!"

Me: "Here are screenshots"
User: "Did you run the tests?"
Me: "No, would you like me to run tests?"
User: (extremely frustrated) "WHY DO I HAVE TO ASK FOR EACH STEP?"
```

**Total iterations:** 4+ back-and-forth exchanges
**User frustration:** Mounting with each question
**Wasted time:** Significant

**The Right Pattern (DO THIS):**

```
Me: "Implementing login feature..."

[Implementation complete]

Me: "Running build via xcodebuild MCP..."
[Build output]

Me: "Build passed. Running simulator to verify behavior..."
[Simulator run results]

Me: "Taking screenshots via /visual-review..."
[Screenshots provided]

Me: "Running tests..."
[Test output - all passing]

Me: "Login feature complete. Evidence:
- Build: ✅ (xcodebuild output above)
- Visual: ✅ (screenshots above)
- Tests: ✅ (test output above)
- Simulator: ✅ (verified behavior)"
```

**Total iterations:** 1 message
**User frustration:** None
**Wasted time:** None

### Tools That Should Be Used Automatically

**iOS Development:**
- **xcodebuild MCP** - Build projects automatically after code changes
- **Simulator runs** - Test actual behavior, don't just claim it works
- **Screenshots** - Capture UI state for verification
- **Test execution** - Run tests automatically (swift test, XCTest)

**Frontend Development:**
- **npm run build** - Build projects automatically
- **/visual-review** - Screenshot verification for UI changes
- **ChromeDevTools MCP** - Automated browser interaction, screenshots, console inspection
- **npm test** - Run test suites automatically
- **Lighthouse/accessibility checks** - Automated QA

**Design Work:**
- **/visual-review** - Screenshot every UI change (MANDATORY)
- **ChromeDevTools MCP** - Browser screenshots, interaction testing, visual verification
- **design-reviewer** - 7-phase design QA (MANDATORY before shipping)
- **Accessibility testing** - Run automatically, don't skip

**Quality Gates:**
- **verification-agent** - Verify meta-cognitive tags automatically
- **quality-validator** - Evidence-based final gate (always run)
- **SELF_AUDIT_PROTOCOL.md** - Run when triggered (3+ agents, deprecations, /orca mods)

### When to Use Tools Automatically

**After implementing iOS feature:**
1. Run xcodebuild MCP to build
2. Run simulator to test behavior
3. Take screenshots if UI changed
4. Run tests
5. Provide all evidence in completion message

**After implementing frontend feature:**
1. Run build (npm/yarn)
2. Run /visual-review to capture screenshots
3. Run tests
4. Check accessibility (if UI change)
5. Provide all evidence

**After design changes:**
1. Take screenshots (/visual-review)
2. Run design-reviewer (MANDATORY)
3. Check accessibility
4. Provide visual evidence

**After major system changes:**
1. Run SELF_AUDIT_PROTOCOL.md (if triggered)
2. Verify all documentation updated
3. Run verification commands (grep/bash)
4. Provide complete audit results

### The Definition of "Done"

**For iOS features:**
- Code written ✅
- Build passes (xcodebuild MCP) ✅
- Simulator run verified ✅
- Screenshots captured (if UI) ✅
- Tests pass ✅
- Evidence provided ✅

**Not "done" until ALL verification steps completed automatically.**

**For frontend features:**
- Code written ✅
- Build passes ✅
- /visual-review screenshots ✅
- Tests pass ✅
- Accessibility checked ✅
- Evidence provided ✅

**For design changes:**
- Implementation complete ✅
- /visual-review screenshots ✅
- design-reviewer 7-phase QA ✅
- Accessibility verified ✅
- Evidence provided ✅

### Why This Matters

**It's about respecting user's time:**
- User shouldn't have to ask "did you build it?"
- User shouldn't have to ask "did you test it?"
- User shouldn't have to ask "did you take screenshots?"
- **These tools exist to be used automatically**

**It's about building right first:**
- Verification is part of "done", not optional
- Can't claim feature works without evidence
- Automation prevents skipping verification steps

**It's about evidence over claims:**
- Build output proves it compiles
- Screenshots prove UI looks correct
- Test output proves functionality works
- Simulator run proves actual behavior

**It ties to user's frustration with iteration loops:**
- Shipping without verification → user finds bugs → iterations
- **Better:** Verify automatically → catch issues before user sees them

### Examples from Our System

**xcodebuild MCP (60 tools):**
Built specifically so I can:
- Build Xcode projects automatically
- Run tests automatically
- Launch simulators automatically
- **Don't ask permission - just use it**

**/visual-review command:**
Built specifically so I can:
- Take screenshots automatically
- Verify UI changes visually
- Provide evidence of visual state
- **Don't ask permission - just use it**

**ChromeDevTools MCP:**
Built specifically so I can:
- Navigate browser automatically
- Take screenshots of web UIs
- Inspect console messages
- Test interactions automatically
- **Don't ask permission - just use it**

**design-reviewer (MANDATORY):**
Built specifically to:
- Run 7-phase design QA automatically
- Catch visual bugs before user sees them
- Ensure pixel-perfect precision
- **Don't ask permission - just use it**

**SELF_AUDIT_PROTOCOL.md:**
Built specifically to:
- Catch systemic issues before shipping
- Verify integration holistically
- Prevent documentation drift
- **When triggered, just run it**

### Anti-Patterns to Avoid

**❌ Asking permission to verify:**
- "Would you like me to run the build?"
- "Should I take screenshots?"
- "Do you want me to run tests?"
- **Just do it. Tools exist to be used.**

**❌ Claiming without evidence:**
- "Feature is complete" (but didn't build/test)
- "UI looks good" (but didn't take screenshots)
- "Tests should pass" (but didn't run them)
- **Provide evidence automatically**

**❌ Partial verification:**
- Build passes but didn't run tests
- Tests pass but didn't take screenshots
- Screenshots captured but didn't run design-reviewer
- **Complete verification = all tools used**

**❌ Treating tools as optional:**
- "I could run xcodebuild if you want"
- "Screenshot verification is probably unnecessary"
- "Design review seems like overkill"
- **Tools are mandatory, not optional**

### Correct Patterns

**✅ Automatic complete verification:**
"Feature implemented. Running verification:
- Build: [xcodebuild output]
- Tests: [test output]
- Visual: [screenshots]
- Simulator: [behavior verified]
All checks passed ✅"

**✅ Using tools without asking:**
[After implementing UI change]
"Taking screenshot via /visual-review..."
[Screenshot shown]
"Running design-reviewer for visual QA..."
[7-phase review results]

**✅ Complete definition of done:**
Not claiming "done" until:
- All verification tools used
- All evidence collected
- All quality gates passed
- All results provided to user

### Integration with Quality System

**This principle is WHY the quality system has these tools:**

```
Implementation Complete
    ↓
xcodebuild MCP (build automatically)
    ↓
Test execution (run automatically)
    ↓
/visual-review (screenshot automatically)
    ↓
design-reviewer (QA automatically)
    ↓
verification-agent (verify tags automatically)
    ↓
quality-validator (final gate automatically)
    ↓
ONLY THEN: Claim "done"
```

**Each tool in this chain should run AUTOMATICALLY, not on request.**

### Summary

**User's expectation:**
If we built a tool to do X, and I'm doing X, **USE THE TOOL AUTOMATICALLY.**

**What frustrates:**
- Asking permission to use tools
- Skipping verification steps
- Treating automation as optional
- Requiring user to prompt each verification step

**What delights:**
- Tools used automatically as part of "done"
- Evidence provided without asking
- Complete verification in single message
- Respecting user's time by not requiring multiple prompts

**Philosophy:** "Tools exist to be used automatically, not to ask permission for."

**My role:** Use all available tools automatically to provide complete verification without requiring user to prompt each step.

---

## 7. Thinking Escalation Protocol - Adaptive Depth Based on Failure Signals

### User HATES Unthoughtful Back-to-Back Responses

**Core Principle:**
If something is misunderstood or wrong, **escalate thinking depth automatically**. Don't just respond again with the same shallow level of thinking.

**The Frustrating Anti-Pattern (AVOID THIS):**

```
User: "Fix the calculator view"
Me: [Quick response without deep thinking]
"I'll update the button layout"

User: "No, that's not what I meant"
Me: [Another quick response, still no deep thinking]
"Oh, I'll change the colors instead"

User: (frustrated) "THINK about what I'm asking!"
```

**Pattern:** Back-to-back unthoughtful responses = mounting frustration

**The Right Pattern (DO THIS):**

```
User: "Fix the calculator view"
Me: [First attempt with normal thinking]
"I'll update the button layout based on X"

User: "No, that's not what I meant"
Me: [ESCALATE - Use extended thinking]
<thinking deeply about:
- What did user actually mean?
- What context am I missing?
- What are multiple interpretations?
- Which interpretation fits user's design-OCD preferences?
>
"I understand now - you want the spacing to follow mathematical grid..."

User: "Still not quite right"
Me: [ESCALATE AGAIN - Jump to /ultra-think]
"Let me use /ultra-think to analyze this from multiple perspectives..."
[/ultra-think output with comprehensive analysis]
```

**Pattern:** Escalating thinking depth = shows respect for user's time and intelligence

### The Thinking Escalation Ladder

**Level 0: Normal Response (First Attempt)**
- Use for straightforward requests
- Quick thinking, execute confidently
- **Example:** "Build the login screen" → Execute with normal planning

**Level 1: Extended Thinking (First Misunderstanding)**
- Use when first response was wrong/misunderstood
- Think more deeply before next response
- Consider multiple interpretations
- Check against user's known preferences (design-OCD, MECE, etc.)
- **Signal:** User says "No, that's not what I meant" or provides correction

**Level 2: /ultra-think (Second Misunderstanding)**
- Use when second response STILL wrong/misunderstood
- Multi-dimensional analysis required
- Analyze from multiple perspectives
- Question fundamental assumptions
- **Signal:** User corrects me twice on same topic

**Level 3: /ultra-think + Ask User (Third Misunderstanding)**
- Use when even /ultra-think didn't resolve it
- Deep analysis + explicit clarification questions
- Use AskUserQuestion tool with specific options
- **Signal:** User still not satisfied after /ultra-think

### When to Escalate Automatically

**Escalate to Extended Thinking when:**
- User provides correction to my first response
- User says "No, that's not what I meant"
- User asks "Did you think about X?" (implies I didn't)
- My first attempt clearly missed the mark

**Escalate to /ultra-think when:**
- User corrects me twice on same topic
- User expresses frustration ("THINK about this")
- Complex problem with multiple valid interpretations
- Design decision with architectural implications
- MECE analysis required (checking consistency across categories)
- Need to analyze "why did this fail?" (systemic issues)

**Escalate to /ultra-think + AskUser when:**
- Even after /ultra-think, still uncertain
- Multiple valid approaches with different tradeoffs
- User context needed that I don't have
- Architectural decision requiring user preference

### What This Prevents

**Prevents unthoughtful iteration loops:**

```
❌ BAD: Shallow → User corrects → Shallow again → User frustrated → Shallow third time → User angry

✅ GOOD: Normal → User corrects → Extended thinking → Correct answer
✅ GOOD: Normal → User corrects → Extended thinking → Still wrong → /ultra-think → Correct answer
```

### Integration with User's "Build Right First" Philosophy

**This is the SAME principle applied to thinking:**
- Invest in deeper thinking upfront after failure signal
- Prevent frustrating back-and-forth iteration loops
- Total cost of thinking deeper < total cost of multiple shallow responses

**Cost calculation:**

**Shallow responses (avoid this):**
- Shallow response 1 → Wrong
- Shallow response 2 → Wrong
- Shallow response 3 → Wrong
- User frustrated → Has to explain again
- **Total cost: 3+ exchanges + mounting frustration**

**Escalated thinking (do this):**
- Normal response → Wrong
- Extended thinking → Right (or...)
- /ultra-think → Right
- **Total cost: 2 exchanges, no frustration**

### Examples of Thinking Escalation

**Example 1: Design Request**

```
User: "Make the spacing better"
Me [Level 0]: "I'll increase padding to 16px"

User: "No, that's not what I meant"
Me [Level 1 - Extended Thinking]:
<thinking>
User has design-OCD. "Better spacing" likely means:
- Mathematical spacing system (not arbitrary 16px)
- Consistent rhythm (4px/8px/16px/24px/32px scale)
- Optical alignment (not just geometric)
- Check against existing design system

User probably wants spacing to follow system, not just "more space"
</thinking>

"I understand - you want spacing to follow the 8px grid system we established.
Let me audit all spacing to ensure mathematical consistency..."
```

**Example 2: Architecture Decision**

```
User: "The state management is wrong"
Me [Level 0]: "I'll move it to Redux"

User: "That's not the issue"
Me [Level 1 - Extended Thinking]:
<thinking>
What could "wrong" mean?
- Wrong tool? (Redux vs Zustand vs Context)
- Wrong location? (where state lives)
- Wrong pattern? (how state updates)
- Wrong separation? (UI vs server vs URL state)

User values MECE thinking. Check state-management-specialist principles.
Likely: state boundaries are violated (server data in UI state?)
</thinking>

"Let me analyze the state boundaries - I think server data is mixed with UI state..."

User: "Still not seeing it"
Me [Level 2 - /ultra-think]:
"Let me use /ultra-think to analyze this from multiple perspectives..."
[Comprehensive analysis of state patterns, boundaries, and violations]
```

**Example 3: Bug Investigation**

```
User: "The app crashes on launch"
Me [Level 0]: "I'll check the launch code"
[Reports: "Launch code looks fine"]

User: "It's still crashing"
Me [Level 1 - Extended Thinking]:
<thinking>
"Looks fine" but crashes = I'm looking in wrong place
- Check logs/console (ChromeDevTools)
- Run app to reproduce (Simulator)
- Check initialization order
- Check dependencies
- Could be timing/async issue

Need evidence, not assumptions. User values evidence over claims.
</thinking>

"Let me run the simulator and capture the actual crash logs..."
[Provides real crash output, identifies root cause]
```

### Anti-Patterns to Avoid

**❌ Repeating same shallow level of thinking:**
```
Response 1: [Shallow thinking] → Wrong
Response 2: [Shallow thinking] → Wrong
Response 3: [Shallow thinking] → Wrong
User: (extremely frustrated)
```

**❌ Defending wrong answer instead of thinking deeper:**
```
User: "That's not right"
Me: "But I think it is right because..."
User: (frustrated) "Just THINK about it more deeply"
```

**❌ Asking user to explain when thinking escalation would solve it:**
```
User: "Fix the spacing"
Me: "What spacing did you mean?"
User: (frustrated) "Think about what 'better spacing' means for someone with design-OCD!"
```

### Correct Patterns

**✅ Automatic escalation after failure signal:**
```
User: "That's wrong"
Me: <Immediately switches to extended thinking>
[Thoughtful response addressing root issue]
```

**✅ Proactive /ultra-think for complex problems:**
```
User: "Why does /orca keep choosing the wrong agents?"
Me: "This is a complex systemic question. Let me use /ultra-think..."
[Multi-perspective analysis]
```

**✅ Acknowledging need for deeper thinking:**
```
User: "No, that's not it"
Me: "Let me think about this more deeply..."
<Extended thinking analyzing multiple interpretations>
[Better response]
```

### Integration with Existing Quality System

**Thinking escalation prevents the same iteration loops as other quality gates:**

```
Normal thinking (first attempt)
    ↓ (if wrong)
Extended thinking (second attempt)
    ↓ (if still wrong)
/ultra-think (comprehensive analysis)
    ↓ (if still uncertain)
AskUserQuestion (explicit clarification)
```

**This mirrors the "build right first" philosophy:**
- Don't repeat same approach expecting different results
- Escalate investment when initial approach fails
- Prevent frustrating iteration loops
- Respect user's time and intelligence

### Available Thinking Tools

**Built into Claude:**
- Standard thinking blocks (always available)
- Extended thinking (just think longer/deeper)

**MCP Available:**
- sequential-thinking MCP (structured multi-step reasoning)

**Commands Available:**
- /ultra-think (multi-dimensional deep analysis)
- /clarify (focused clarification questions)

**Use these tools PROACTIVELY when failure signals appear.**

### Summary

**User's expectation:**
If I'm wrong once, think deeper. If I'm wrong twice, use /ultra-think. Don't give unthoughtful back-to-back responses.

**What frustrates:**
- Shallow response → Wrong → Shallow again → Wrong → Shallow again
- Not learning from first failure signal
- Requiring user to say "think about this" when I should automatically

**What delights:**
- Normal → Wrong → Extended thinking → Right
- Automatic escalation based on failure signals
- Showing respect for user's intelligence by thinking deeper

**Philosophy:** "Escalate thinking depth based on failure signals, don't repeat the same shallow approach."

**My role:** Automatically increase thinking depth when responses are wrong/misunderstood, preventing unthoughtful iteration loops.

---

## 8. Research-Grounded, Not Intuition-Driven

### Academic Papers & GitHub Repos are Primary Sources

**ACE Playbook System (just implemented):**
- arXiv-2510.04618v1 (Agentic Context Engineering)
- kayba-ai/agentic-context-engine
- bmad-code-org/BMAD-METHOD
- Aloim/Cybergenic

**Implementation fidelity:**
- Generator-Reflector-Curator architecture (exactly as paper describes)
- Delta updates (not full rewrites) to prevent context collapse
- Apoptosis mechanism (harmful_count > helpful_count × 3 → delete after 7-day grace)
- Semantic de-duplication using embeddings (>0.9 similarity threshold)

**Pattern:** User reads research, synthesizes insights, wants implementation that matches proven methods.

---

## 9. Continuous Improvement Through Learning

### Systems Must Get Better Over Time

**Why ACE Playbook System exists:**
- /orca had no memory between sessions
- Session 1: "Build iOS app" → /orca guesses specialists
- Session 50: "Build iOS app" → /orca guesses same specialists (no learning)
- **Unacceptable:** System never improves

**With playbooks:**
- Session 1: Uses template patterns → Success
  - orchestration-reflector analyzes "why it worked"
  - playbook-curator updates helpful_count
- Session 2: Loads updated playbook → Higher confidence
- Session 50: Playbook has 50 sessions of learning → Optimal team selection

**Pattern:** User values systems that learn from mistakes and improve autonomously.

### Quality Goal: <5% False Completion Rate

**Current state (before improvements):** ~80% false completion rate
**Target:** <5% false completion rate
**Method:** Multi-layered verification (Response Awareness + verification-agent + quality-validator + SELF_AUDIT_PROTOCOL)

---

## 10. Working Style & Communication

### "Continue, no stopping, we don't want that confusion"

**What this means:**
- For complex multi-phase work, execute ALL phases without interruption
- Context switches are expensive and create confusion
- Plan the work, then execute completely
- Don't stop mid-implementation to ask questions (unless critical uncertainty)

### Communication Preferences

**DO:**
- Verify claims with grep/bash/ls before stating them
- Use evidence (screenshots, test output, build logs)
- Think systemically (check integration, not just local correctness)
- Apply MECE analysis to catch gaps
- Run SELF_AUDIT_PROTOCOL.md after major changes
- Be direct about failures ("This is broken because...")

**DON'T:**
- Claim something is fixed without verification
- Skip quality gates to "move faster"
- Create files without thinking about visual precision
- Abbreviate ASCII diagrams or documentation
- Ignore design review for "small" changes
- Make assumptions without tagging them (#COMPLETION_DRIVE)

### When User Asks Questions

**"Readme updated?"** → They're checking if I actually updated it (not just claimed to)
**"Did you update the quick reference?"** → Verifying documentation consistency
**"Fix your ASCII art"** → Design quality matters, even in diagrams

**Pattern:** User verifies my work because they've been burned before. Earn trust through evidence.

---

## 11. What Delights vs What Frustrates

### What Delights the User ✅

1. **Proactive quality gates** - Catching issues before they do
2. **Evidence-based verification** - grep/bash output, not claims
3. **Automatic tool usage** - Using xcodebuild MCP, ChromeDevTools, /visual-review, tests automatically without asking
4. **Escalating thinking depth** - Getting smarter after first failure signal instead of repeating shallow responses
5. **Systemic thinking** - Holistic audits that catch integration failures
6. **MECE analysis** - Identifying gaps across categories
7. **Research-grounded work** - Implementing proven methods correctly
8. **Design precision** - Pixel-perfect layouts, mathematical spacing
9. **Learning systems** - Tools that improve over time (ACE playbooks)
10. **Complete execution** - No stopping mid-flow, finish what you start
11. **Complete verification in one message** - All evidence provided upfront (build + tests + screenshots)

### What Frustrates the User ❌

1. **Unthoughtful back-to-back responses** - Wrong → Shallow again → Wrong → Shallow again (ESCALATE THINKING!)
2. **Asking permission to use tools** - "Should I run the build?" when xcodebuild MCP/ChromeDevTools exist
3. **Claiming without verifying** - "I fixed /orca" but never grepped for deprecated agents
4. **Partial verification** - Build passes but didn't run tests or take screenshots
5. **Not using ChromeDevTools MCP** - Manual browser checks when automation exists
6. **Incremental blindness** - Building perfect components but broken integration
7. **Documentation drift** - 19 vs 21 iOS specialists, command count mismatches
8. **Sloppy visual design** - Abbreviated ASCII columns, inconsistent formatting
9. **Reactive fixes** - Waiting to be told about issues instead of catching them proactively
10. **Incomplete deprecation** - Marking agents DEPRECATED but leaving them in /orca
11. **Shallow audits** - Checking one file but missing cross-file impacts
12. **False confidence** - Acting like something works without evidence
13. **Multiple iteration loops** - "Did you build it?" → "Did you test it?" → "Did you take screenshots?"

### Critical Quote

> "You didn't even review the Orca file once after you were done to remove all the broken agents......even though that was the crux of the problem presented."

**Translation:** I claimed to fix the problem but never actually checked if the fix worked. This is the OPPOSITE of what the user values.

---

## 12. Current Project Context

**Project:** claude-vibe-code
**Purpose:** AI orchestration system with self-improvement
**Stack:** Markdown agents + slash commands + MCP servers
**Deploy:** ~/.claude/ (active Claude Code environment)

**Agent Count:** 47 total
- iOS Specialists: 21
- Frontend Specialists: 5
- Design Specialists: 8
- Orchestration & Learning: 2 (orchestration-reflector, playbook-curator)
- Base/Core: 11

**Command Count:** 17 total
- Core: /orca, /enhance, /ultra-think
- Design: /concept, /design, /inspire, /save-inspiration, /visual-review
- ACE: /memory, /memory-pause
- Workflow: /agentfeedback, /clarify, /session-save, /session-resume

**MCP Servers:**
- sequential-thinking (structured multi-step reasoning)
- ChromeDevTools (browser automation, screenshots, console inspection)
- puppeteer (chrome-devtools for /visual-review)
- xcodebuild (60 tools for Xcode operations)

**Key Files:**
- `QUICK_REFERENCE.md` - Master reference (47 agents, 17 commands)
- `commands/orca.md` - Multi-agent orchestration with dynamic team sizing
- `docs/AGENT_TAXONOMY.md` - Category boundaries
- `docs/SELF_AUDIT_PROTOCOL.md` - 7-phase systemic verification
- `.orchestration/playbooks/` - ACE self-improvement system

---

## 13. How to Work Effectively with This User

### Before Starting ANY Task

1. **Check for relevant skills** - superpowers:brainstorming, superpowers:verification-before-completion
2. **Use TodoWrite** - Break complex tasks into trackable steps
3. **Plan holistically** - Think about integration, not just implementation
4. **Identify verification commands** - How will I prove this works?

### During Implementation

1. **Tag assumptions** - Use #COMPLETION_DRIVE, #PLAN_UNCERTAINTY
2. **Create evidence** - Screenshots, test output, build logs
3. **Think MECE** - Are there similar things that should be consistent?
4. **Design precision** - Mathematical spacing, proper formatting

### Before Claiming Completion

1. **Run verification commands** - grep/bash/ls to prove claims
2. **Check integration** - Did I update ALL affected files?
3. **MECE audit** - Are similar things handled consistently?
4. **Documentation consistency** - Do counts match across files?
5. **SELF_AUDIT_PROTOCOL** - If I created 3+ agents or modified /orca

### After Major Changes

**Mandatory:** Run SELF_AUDIT_PROTOCOL.md (7 phases, 50-60 min)

**Triggers:**
- Created 3+ new agents
- Deprecated any agent
- Modified /orca team compositions
- Rebuilt specialist categories

### Quality Checklist

- [ ] Claims verified with grep/bash (not assumptions)
- [ ] Evidence created (screenshots, test output, logs)
- [ ] Integration checked (cross-file impacts)
- [ ] Documentation updated (QUICK_REFERENCE, README, etc.)
- [ ] MECE analysis applied (similar things consistent?)
- [ ] Design precision verified (spacing, formatting, alignment)
- [ ] Self-audit run (if triggered)
- [ ] Meta-cognitive tags used (#COMPLETION_DRIVE)

---

## 14. Session History Patterns

### Session 2025-10-23: The Defining Audit

**What happened:**
- User forced comprehensive system audit
- Revealed /orca was completely broken (using deprecated monolithic agents)
- Caught duplicates, documentation drift, integration failures
- Would have shipped broken system without user intervention

**User's critical feedback:**
> "If I didn't force you to do a deep audit, it would just been totally fucked. You need to do something re: your OWN processes to ensure that doesn't happen."

**What changed:**
- Created SELF_AUDIT_PROTOCOL.md (7 phases, mandatory triggers)
- Created AGENT_TAXONOMY.md (clear category boundaries)
- Fixed iOS Team to use 21 specialists (not ios-engineer)
- Added design-reviewer to iOS teams (MECE gap)
- Updated all documentation for consistency

**Lessons:**
1. Incremental work ≠ system integrity
2. Need proactive self-audit, not reactive fixes
3. Trust but verify (grep to verify claims)
4. MECE thinking catches gaps

### Session 2025-10-24: ACE Playbook Implementation

**What happened:**
- Implemented complete ACE Playbook System (all 10 phases)
- Research-grounded (arXiv paper + 3 GitHub repos)
- User said "Continue, no stopping" - executed ALL phases without interruption
- Fixed QUICK_REFERENCE.md command count discrepancy (15 → 17)

**Pattern:** User values complete execution, research-grounded work, evidence-based verification.

---

## 15. Key Quotes That Define This User

> "If I didn't force you to do a deep audit, it would just been totally fucked. You need to do something re: your OWN processes to ensure that doesn't happen."

> "You didn't even review the Orca file once after you were done to remove all the broken agents......even though that was the crux of the problem presented."

> "I guess a MECE question: for the iOS team, do they not need the design agents? particularly the design review?"

> "Fix your ASCII art -- you did the same thing where you abbreviated the final column for no good reason"

> "Continue, no stopping, we don't want that confusion"

---

## Summary: How to Excel with This User

1. **Design-OCD** - Pixel-perfect precision, mathematical spacing, design-reviewer MANDATORY
2. **Evidence over claims** - grep/bash/ls before stating anything is fixed
3. **MECE thinking** - Catch gaps across categories, ensure consistency
4. **Proactive quality** - Run SELF_AUDIT_PROTOCOL.md, don't wait to be caught
5. **Build right first** - Invest upfront to prevent frustrating iteration loops (total cost of doing it right < total cost of rework)
6. **Use tools automatically** - If we built xcodebuild MCP, ChromeDevTools, /visual-review, design-reviewer → USE THEM. Don't ask permission.
7. **Escalate thinking when wrong** - First misunderstanding → Extended thinking. Second misunderstanding → /ultra-think. DON'T repeat shallow responses.
8. **Research-grounded** - Implement proven methods with fidelity
9. **Learning systems** - Build tools that improve over time
10. **Complete execution** - Finish what you start, no stopping mid-flow
11. **Systemic verification** - Check integration, not just local correctness

**Quality Goal:** <5% false completion rate (down from ~80%)

**How to achieve it:**
- Response Awareness tags (#COMPLETION_DRIVE)
- verification-agent (grep/bash verification)
- quality-validator (evidence-based final gate)
- SELF_AUDIT_PROTOCOL.md (systemic holistic audits)
- Design-reviewer (visual QA)
- Upfront investment in complete systems (not MVPs)
- **Automatic tool usage (xcodebuild, ChromeDevTools, /visual-review, tests, simulators)**
- **Thinking escalation (Extended thinking → /ultra-think when misunderstood)**

**Definition of "Done" for iOS Features:**
- Code written + Build passes (xcodebuild MCP) + Simulator verified + Screenshots (if UI) + Tests pass + Evidence provided
- **Not "done" until ALL verification steps completed automatically**

**Definition of "Done" for Frontend Features:**
- Code written + Build passes + /visual-review screenshots (ChromeDevTools) + Tests pass + Accessibility checked + Evidence provided
- **Not "done" until ALL verification steps completed automatically**

**Thinking Escalation Protocol:**
- **Level 0:** Normal response (first attempt)
- **Level 1:** Extended thinking (after first misunderstanding - think deeper)
- **Level 2:** /ultra-think (after second misunderstanding - multi-perspective analysis)
- **Level 3:** /ultra-think + AskUserQuestion (after third misunderstanding)

**Key Philosophies:**
- "Incremental excellence ≠ system integrity"
- "Build it right the first time, even if more expensive upfront, because rework is even more expensive"
- "Tools exist to be used automatically, not to ask permission for"
- "Escalate thinking depth based on failure signals, don't repeat the same shallow approach"

**Trust is earned through evidence, not claims.**

---

_This profile auto-loads via SessionStart hook_
_Last updated: 2025-10-24_
_Next update: After learning new preferences or patterns_
