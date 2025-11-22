---
description: "OS 2.0 orchestrator entrypoint for native iOS tasks"
allowed-tools:
  - Task
  - AskUserQuestion
  - mcp__project-context__query_context
  - mcp__project-context__save_decision
---

# /orca-ios – iOS Lane Orchestrator

Use this command when the task is clearly native iOS (Swift/SwiftUI/UIKit, Xcode, device features).

## Flow
1) **Context**: Call ProjectContextServer
   - domain: "ios"
   - task: user request (short)
   - projectPath: repo root
   - maxFiles: 10–20
   - includeHistory: true

2) **Assign Grand Architect**
   - Agent: `ios-grand-architect`
   - Inputs: ContextBundle
   - Outputs: architecture/data choice (SwiftUI vs MVVM/TCA/UIKit; SwiftData vs Core Data/GRDB), design DNA presence, risks, task force plan.
   - Save decision via mcp__project-context__save_decision.

3) **Planning**
   - Agent: `ios-architect`
   - Produce: plan + constraints (UI/logic/data/tests/verification), change type, impact, risks.

4) **Implementation**
   - Agent: `ios-builder`
   - Specialists as needed:
     - UI: `swiftui-specialist` or `uikit-specialist`
     - Tokens: `design-dna-guardian`
     - Data: `persistence-specialist` (SwiftData/Core Data/GRDB)
     - Networking: `networking-specialist`
     - Testing: `testing-specialist` (Swift Testing) and/or `ui-testing-specialist` (XCUITest)
     - Risk-based: `performance-engineer`, `security-tester`, `accessibility-tester`

5) **Gates**
   - Standards: `ios-standards-enforcer`
   - UI/Interaction: `ios-ui-reviewer`
   - Build/Test: `ios-verification` (xcodebuild or xcodebuildmcp)

6) **Completion**
   - Summarize gate scores, build/test results, and remaining risks.
   - Ensure decisions and outcomes are saved.

## Notes
- Block UI work if design DNA/tokens are missing; request them.
- Do not change data store without explicit plan (SwiftData vs Core Data/GRDB).
- Keep edits scoped to plan; no scope creep.
