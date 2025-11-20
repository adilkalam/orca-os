# Teams by Stack

Pre-configured teams for common tech stacks. ORCA proposes, user confirms.

## iOS (SwiftUI + SwiftData)

### Core Team (5 agents)
```
requirement-analyst      → Define features & user flows
system-architect        → Design data model & architecture
swiftui-developer       → Build views & navigation
swiftdata-specialist    → Implement persistence
swift-testing-specialist → Write tests
```

### When to Add Specialists
- **Performance issues**: `ios-performance-engineer`
- **Complex networking**: `urlsession-expert` or `combine-networking`
- **Legacy data**: `coredata-expert`
- **Complex state**: `tca-specialist` or `state-architect`
- **Security audit**: `ios-security-tester`

### Evidence Required
- Clean build: `xcodebuild clean && xcodebuild build`
- Tests pass: `swift test`
- Screenshot: `.orchestration/evidence/*.png`

## Frontend (React/Next.js)

### Core Team (4-5 agents)
```
system-architect         → API design & data flow
react-18-specialist      → Components & hooks
test-engineer           → Jest/Vitest tests
```

### When to Add Specialists
- **Next.js app router**: `nextjs-14-specialist`

### Evidence Required
- Build succeeds: `npm run build`
- Dev server runs: `npm run dev`
- Browser screenshot: `/visual-review http://localhost:3000`

## Backend (Python/Node/Go)

### Core Team (4 agents)
```
system-architect        → API design & database schema
backend-engineer        → Business logic & endpoints
infrastructure-engineer → Docker, CI/CD, deployment
test-engineer          → Unit & integration tests
```

### When to Add Specialists
- **Complex queries**: Database specialist
- **Authentication**: Security specialist
- **High traffic**: Performance engineer
- **Data migration**: Migration specialist

### Evidence Required
- Tests pass: `pytest` or `npm test`
- Server starts: No errors in logs
- API responds: curl/Postman verification

## Data Analysis

### Core Team (5-7 agents)
```
requirement-analyst     → Define metrics & KPIs
ads-creative-analyst   → Ad performance analysis
bf-sales-analyst       → Sales event analysis
merch-lifecycle-analyst → Product journey tracking
story-synthesizer      → Narrative & recommendations
```

### Evidence Required
- Numbers verified: `grep` from source files
- Calculations checked: No fabrication
- Granular data: Not aggregated
- Clear narrative: Actionable insights

## Full Stack

### Typical Team (6-8 agents)
```
Planning:
  requirement-analyst
  system-architect

Backend:
  backend-engineer
  infrastructure-engineer

Frontend:
  react-18-specialist
  state-management-specialist

Quality:
  verification-agent
  quality-validator
```

## Selection Principles

1. **Start with 3-5 agents** — Minimal viable team
2. **Add specialists for known risks** — Don't speculate
3. **Swap, don't grow** — Replace agents as needs change
4. **Evidence always** — No "done" without proof
5. **User confirms** — Never auto-dispatch
