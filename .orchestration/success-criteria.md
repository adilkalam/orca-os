# Success Criteria - Architecture Fix

## Objective Measures (Must Pass 100%)

### 1. Agent Scope Compliance

**ios-engineer.md:**
- [ ] Description does NOT say "complete" or "comprehensive"
- [ ] Contains ONLY Swift/SwiftUI implementation responsibilities
- [ ] Does NOT contain "Architecture Patterns" section
- [ ] Does NOT contain "Testing Methodology" section  
- [ ] Does NOT contain "App Store Deployment" section
- [ ] Does NOT contain "CI/CD & DevOps" section
- [ ] DOES contain "Single Responsibility" section stating implementation ONLY
- [ ] DOES contain "Does NOT do" section listing architecture/testing/design/deployment

**Verification command:**
```bash
grep -c "comprehensive\|complete specialist" ~/.claude/agents/implementation/ios-engineer.md
# Expected: 0
```

**frontend-engineer.md:**
- [ ] Description does NOT say "complete frontend development specialist"
- [ ] Scope limited to React/Vue/Next.js code implementation
- [ ] Performance optimization → moved to test-engineer
- [ ] Accessibility compliance → moved to design-engineer

**backend-engineer.md:**
- [ ] Description does NOT say "complete backend development specialist"
- [ ] Scope limited to API/server code implementation
- [ ] Security → moved to test-engineer
- [ ] Scalability → moved to system-architect

---

### 2. Team Composition Consistency

**/orca iOS Team:**
- [ ] Lists requirement-analyst
- [ ] Lists system-architect
- [ ] Lists design-engineer
- [ ] Lists ios-engineer
- [ ] Lists test-engineer
- [ ] Lists verification-agent
- [ ] Lists quality-validator
- [ ] Total: 7 agents minimum

**Verification command:**
```bash
grep -A 20 "### 📱 iOS Team" ~/.claude/commands/orca.md | grep "^- "
# Expected: 7 lines (one per agent)
```

**/orca Frontend Team:**
- [ ] Lists 6-7 specialized agents (same pattern as iOS)

**/orca Backend Team:**
- [ ] Lists 6-7 specialized agents (same pattern as iOS)

**QUICK_REFERENCE.md iOS Team:**
- [ ] Matches /orca iOS Team exactly
- [ ] All 7 agents listed
- [ ] Includes verification-agent

**Verification command:**
```bash
diff <(grep -A 10 "iOS Team" ~/.claude/commands/orca.md | grep "^- " | sort) \
     <(grep -A 10 "iOS.*Project" QUICK_REFERENCE.md | grep "^- " | sort)
# Expected: No differences
```

---

### 3. Documentation Consistency

**All sources list same teams:**
- [ ] /orca iOS Team = QUICK_REFERENCE iOS Team
- [ ] /orca Frontend Team = QUICK_REFERENCE Frontend Team  
- [ ] /orca Backend Team = QUICK_REFERENCE Backend Team
- [ ] verification-agent appears in all team listings

**Verification command:**
```bash
# Check verification-agent documented
grep "verification-agent" ~/.claude/commands/orca.md | wc -l
grep "verification-agent" QUICK_REFERENCE.md | wc -l
# Both should be > 0
```

---

### 4. zhsama Pattern Alignment

**Single Responsibility Check:**
Each agent has exactly ONE of these responsibilities:
- Requirements analysis (requirement-analyst)
- Architecture design (system-architect)
- UI/UX design (design-engineer)
- Code implementation (ios/frontend/backend-engineer)
- Testing (test-engineer)
- Tag verification (verification-agent)
- Quality validation (quality-validator)

**No Overlaps:**
- [ ] No agent claims multiple primary responsibilities
- [ ] Clear handoff points between agents
- [ ] Each responsibility assigned to exactly one agent type

---

## Verification Gates

### Phase 4: verification-agent Must Verify

1. All #COMPLETION_DRIVE tags in implementation log
2. All #FILE_MODIFIED claims accurate
3. All scope removal verified (grep confirms sections removed)
4. All team composition changes verified (files actually updated)

**Output**: verification-report.md with 100% pass rate

### Phase 5: quality-validator Must Approve

1. User requirement met (zhsama alignment achieved)
2. All acceptance criteria checked
3. Evidence provided (diffs, verification results)
4. No blocking issues

**Output**: Quality score 100%, APPROVED for delivery

---

## Evidence Requirements

**Must provide to user:**

1. **Diffs showing scope removal:**
   ```bash
   git diff agents/implementation/ios-engineer.md
   # Show architecture/testing sections removed
   ```

2. **Verification results:**
   ```bash
   cat .orchestration/verification-report.md
   # Show 100% verification passed
   ```

3. **Team composition proof:**
   ```bash
   grep -A 20 "iOS Team" ~/.claude/commands/orca.md
   grep -A 20 "iOS.*Project" QUICK_REFERENCE.md
   # Show both list 7 agents
   ```

4. **Quality validation:**
   ```bash
   cat .orchestration/quality-validation.md
   # Show quality-validator approval
   ```

---

## Failure Criteria

**BLOCK delivery if ANY of these:**
- Agent still claims "comprehensive" scope
- Team composition < 6 agents
- /orca and QUICK_REFERENCE contradict each other
- verification-agent missing from team listings
- verification-report.md shows failures
- quality-validator does not approve
- No evidence provided to user

---

## Success Definition

**ALL of the following:**
✅ Every implementation agent has single responsibility
✅ Every team composition lists 6-7 specialized agents
✅ All documentation sources consistent
✅ verification-agent verifies 100% of claims
✅ quality-validator approves with evidence
✅ User confirms all 5 gaps addressed
