# Plan 3: Documentation Consistency

**Objective**: Ensure all documentation sources describe the same team compositions with no contradictions

---

## Documentation Sources Audit

### Source 1: commands/orca.md
**Current state**: Lists 2-agent teams
**Required changes**: Update to 6-7 agent teams (per Plan 2)

### Source 2: QUICK_REFERENCE.md
**Current state**: Lists 4-agent iOS team, contradicts orca.md
**Required changes**: Update to match orca.md exactly

### Source 3: README.md
**Current state**: Unknown (need to check if it mentions teams)
**Required changes**: TBD after audit

### Source 4: Agent definitions (agents/*/*)
**Current state**: Monolithic scopes
**Required changes**: Update to single responsibilities (per Plan 1)

---

## QUICK_REFERENCE.md Updates

### Current iOS Team (lines 84-88)
```markdown
**Primary Team:**
- ios-engineer (implementation)
- design-engineer (UI/UX)
- test-engineer (testing)
- quality-validator (final check)
```

### Corrected iOS Team
```markdown
**Primary Team:**
1. requirement-analyst → Requirements analysis
2. system-architect → iOS architecture design
3. design-engineer → UI/UX design & accessibility
4. ios-engineer → Swift/SwiftUI implementation ONLY
5. test-engineer → Unit/UI/integration testing
6. verification-agent → Meta-cognitive tag verification
7. quality-validator → Final validation gate

**When to add:**
- infrastructure-engineer → CI/CD, App Store deployment
- Never skip: ios-engineer, test-engineer, verification-agent, quality-validator
```

### Current Frontend Team (lines 102-108)
```markdown
**Primary Team:**
- frontend-engineer (UI implementation)
- design-engineer (design system)
- test-engineer (unit/integration tests)
- quality-validator (final check)
```

### Corrected Frontend Team
```markdown
**Primary Team:**
1. requirement-analyst → Requirements analysis
2. system-architect → Frontend architecture (state management, routing)
3. design-engineer → UI/UX design (Tailwind v4 + daisyUI 5)
4. frontend-engineer → React/Vue/Next.js implementation ONLY
5. test-engineer → Vitest/Playwright/accessibility testing
6. verification-agent → Meta-cognitive tag verification
7. quality-validator → Final validation gate

**When to add:**
- backend-engineer → If full-stack
- infrastructure-engineer → Deployment, SEO optimization
```

### Current Backend Team (lines 123-130)
```markdown
**Primary Team:**
- backend-engineer (API implementation)
- test-engineer (comprehensive testing)
- system-architect (architecture)
- quality-validator (final check)
```

### Corrected Backend Team
```markdown
**Primary Team:**
1. requirement-analyst → Requirements analysis
2. system-architect → Backend architecture (API design, database schema)
3. backend-engineer → API/server implementation ONLY
4. test-engineer → Supertest/k6 load testing
5. verification-agent → Meta-cognitive tag verification
6. quality-validator → Final validation gate

**When to add:**
- infrastructure-engineer → Docker, Kubernetes, cloud deployment
- design-engineer → If building admin UI
```

---

## Cross-Reference Consistency Matrix

| Team Type | orca.md | QUICK_REFERENCE.md | Agent Definitions | Status |
|-----------|---------|--------------------|--------------------|--------|
| iOS Team | 7 agents | 7 agents (same) | ios-engineer: implementation ONLY | ✅ Consistent |
| Frontend Team | 7 agents | 7 agents (same) | frontend-engineer: implementation ONLY | ✅ Consistent |
| Backend Team | 6 agents | 6 agents (same) | backend-engineer: implementation ONLY | ✅ Consistent |
| Mobile Team | 7 agents | 7 agents (same) | cross-platform-mobile: implementation ONLY | ✅ Consistent |

**Verification command:**
```bash
# Extract iOS teams from both sources
grep -A 20 "### 📱 iOS Team" ~/.claude/commands/orca.md | grep "^\*\*" > /tmp/orca-ios.txt
grep -A 20 "### iOS/Swift Project" QUICK_REFERENCE.md | grep "^[0-9]" > /tmp/quick-ios.txt

# Compare (should have same agents)
diff /tmp/orca-ios.txt /tmp/quick-ios.txt
# Expected: No differences (or only formatting differences)
```

---

## Agent Definition Updates

Each implementation agent needs consistency updates:

### ios-engineer.md

**Add to line 1307 (Integration with Other Agents section):**
```markdown
## Integration with Other Agents

**Receives specs from:**
- **requirement-analyst**: User requirements, acceptance criteria, edge cases
- **system-architect**: Architecture decisions, data models, navigation patterns, tech stack
- **design-engineer**: Design system tokens, UI specifications, accessibility requirements

**Provides implementation to:**
- **test-engineer**: Testable Swift/SwiftUI code for unit/UI testing
- **verification-agent**: implementation-log.md with meta-cognitive tags
- **quality-validator**: Final implementation for production readiness check

**Does NOT interact with:**
- User directly (goes through quality-validator)
- Other implementation agents (different domains)

**Workflow position:**
```
requirement-analyst → system-architect → design-engineer → 
[ios-engineer: YOU ARE HERE] → test-engineer → verification-agent → quality-validator
```

**Example handoff:**
1. system-architect provides: "Use MVVM with @Observable, NavigationStack for routing"
2. design-engineer provides: "Use Colors.primary token, 44pt touch targets, SF Symbols"
3. You implement: Swift/SwiftUI code following ALL specs
4. You hand off to test-engineer: Testable code + implementation-log.md
```

### frontend-engineer.md

**Add similar "Integration with Other Agents" section**
- Receives from: requirement-analyst, system-architect, design-engineer
- Provides to: test-engineer, verification-agent, quality-validator

### backend-engineer.md

**Add similar "Integration with Other Agents" section**
- Note: May not need design-engineer unless building UI

---

## README.md Audit & Updates

**Action required:**
1. Read README.md
2. Check if it mentions team compositions
3. If yes: Update to match orca.md and QUICK_REFERENCE.md
4. If no: Add brief mention with link to QUICK_REFERENCE.md

---

## Verification Matrix

### Pre-Implementation Checks
- [ ] All plans (1, 2, 3) reviewed for consistency
- [ ] No plan contradicts another plan
- [ ] All #PLAN_UNCERTAINTY tags identified

### Post-Implementation Checks
- [ ] orca.md teams = QUICK_REFERENCE.md teams
- [ ] Agent definitions reference correct teams
- [ ] README.md consistent with other docs
- [ ] verification-agent mentioned in all team listings

### Evidence Collection
```bash
# Collect team listings from all sources
echo "=== orca.md iOS Team ===" > /tmp/team-comparison.txt
grep -A 20 "### 📱 iOS Team" ~/.claude/commands/orca.md >> /tmp/team-comparison.txt

echo "\n=== QUICK_REFERENCE.md iOS Team ===" >> /tmp/team-comparison.txt
grep -A 20 "### iOS/Swift Project" QUICK_REFERENCE.md >> /tmp/team-comparison.txt

# Manual review: Do they match?
cat /tmp/team-comparison.txt
```

---

## #PLAN_UNCERTAINTY Tags

1. **Does README.md need updating?**
   - Need to read README.md first to know
   - **Resolution**: Audit README.md in Phase 2

2. **Are there other documentation sources?**
   - docs/ directory?
   - examples/ directory?
   - **Resolution**: Search for "iOS Team" or "team composition" in all .md files

3. **Should we version this change?**
   - Breaking change for users expecting monolithic agents
   - **Resolution**: Add CHANGELOG.md entry

---

## Success Criteria for This Plan

- [ ] orca.md and QUICK_REFERENCE.md list identical teams
- [ ] All agent definitions reference correct workflows
- [ ] README.md consistent with team compositions
- [ ] verification-agent documented in all sources
- [ ] No contradictions found across any documentation
- [ ] grep searches confirm consistency
