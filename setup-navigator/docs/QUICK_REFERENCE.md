# Quick Reference - Optimization Tools

**Fast reference for all optimization utilities**

---

## CLI Commands

### Context Cache
```bash
# View cache stats
node ~/.claude/lib/context-cache.js stats

# Clear cache
node ~/.claude/lib/context-cache.js clear

# List cached entries
node ~/.claude/lib/context-cache.js list
```

### Analytics
```bash
# Dashboard
node ~/.claude/lib/analytics-viewer.js dashboard

# Agent performance
node ~/.claude/lib/analytics-viewer.js agents

# Identify issues
node ~/.claude/lib/analytics-viewer.js issues

# Token report
node ~/.claude/lib/analytics-viewer.js tokens

# View specific session
node ~/.claude/lib/session-analytics.js view <session-id>

# Summary
node ~/.claude/lib/session-analytics.js summary
```

### Workflow Tools
```bash
# Detect workflow
node ~/.claude/lib/workflow-detector.js "Build iOS app"

# Agent recommendations
node ~/.claude/lib/smart-agent-selector.js "Fix React bug"

# Compose workflow
node ~/.claude/lib/workflow-composer.js compose "database" "auth" "frontend"

# Use template
node ~/.claude/lib/workflow-composer.js template full-stack-app "my-app"
```

---

## Configuration Files

### Central Configs
- **Design philosophy:** `~/.claude/config/design-philosophy.md`
- **Agent selection:** `~/.claude/config/agent-selection-rules.yml`
- **Quality gate:** `~/.claude/config/quality-gate-checklist.md`
- **Common phases:** `~/.claude/config/common-phases.yml`
- **Model strategy:** `~/.claude/config/model-selection-strategy.yml`
- **Benchmarks:** `~/.claude/config/performance-benchmarks.yml`

### Validation
- **Validation schema:** `~/.claude/agentfeedback-validation-schema.yml`

### Design Inspiration
- **Collections:** `~/.claude/design-inspiration/COLLECTIONS.md`
- **Typography:** `~/.claude/design-inspiration/typography/REVIEWS.md`

---

## JavaScript API

### Context Cache
```javascript
const { ContextCache, CACHE_KEYS } = require('~/.claude/lib/context-cache');

const cache = new ContextCache();

// Set
cache.set(CACHE_KEYS.DESIGN_PATTERNS, content);

// Get
const cached = cache.get(CACHE_KEYS.DESIGN_PATTERNS);

// Check
if (cache.has(CACHE_KEYS.VALIDATION_SCHEMA)) { }

// Invalidate
cache.invalidate(CACHE_KEYS.SESSION_CONTEXT);

// Stats
const stats = cache.stats();
```

### Session Analytics
```javascript
const { SessionAnalytics } = require('~/.claude/lib/session-analytics');

const analytics = new SessionAnalytics();

// Start
const sessionId = analytics.startSession({ model: 'claude-opus-4' });

// Track
analytics.trackAgent('ios-dev', { duration: 8, tokens: 3500 });
analytics.trackWorkflow('ios-development');
analytics.trackCommand('/agentfeedback');
analytics.trackQualityGate(true);
analytics.trackValidation(true, false);

// End
const session = analytics.endSession();

// Load
const loaded = SessionAnalytics.loadSession(sessionId);
const summary = SessionAnalytics.getSummary();
```

### Analytics Viewer
```javascript
const { AnalyticsViewer } = require('~/.claude/lib/analytics-viewer');

const viewer = new AnalyticsViewer();

viewer.dashboard();
viewer.analyzeAgents();
viewer.identifyIssues();
viewer.tokenReport();
```

### Workflow Detector
```javascript
const { WorkflowDetector } = require('~/.claude/lib/workflow-detector');

const detector = new WorkflowDetector();
const result = detector.detect("Build iOS app");

// result: { workflow, confidence, reasoning, detected }
```

### Smart Agent Selector
```javascript
const { SmartAgentSelector } = require('~/.claude/lib/smart-agent-selector');

const selector = new SmartAgentSelector();
const result = selector.recommend("Fix React performance");

// result: { primary, secondary, qualityGate, confidence, reasoning }
```

### Workflow Composer
```javascript
const { WorkflowComposer } = require('~/.claude/lib/workflow-composer');

const composer = new WorkflowComposer();

// Compose custom
const workflow = composer.compose({
  name: 'custom-workflow',
  tasks: ['database', 'authentication', 'frontend'],
  useGitWorktree: true,
  includeQualityGate: true
});

// From template
const workflow2 = composer.composeFromTemplate('full-stack-app', {
  name: 'my-app'
});

// Save
composer.saveWorkflow(workflow, './workflow.yml');
```

---

## Cache Keys

**Predefined keys for context caching:**

- `DESIGN_PATTERNS` - Design pattern documentation
- `VALIDATION_SCHEMA` - Validation framework
- `AGENT_SELECTION_RULES` - Agent assignment rules
- `QUALITY_GATE_CHECKLIST` - Review checklist
- `DESIGN_PHILOSOPHY` - Design principles
- `COMMON_PHASES` - Workflow phases
- `SESSION_CONTEXT` - Current session state

---

## Model Selection

**Sonnet (cheaper) - Deterministic tasks:**
- code-reviewer-pro
- debugger
- ios-dev
- frontend-developer
- python-pro
- mobile-developer

**Opus (creative) - Complex/creative tasks:**
- design-master
- swift-architect
- nextjs-pro
- ux-designer
- ui-designer

---

## Token Savings

| Optimization | Tokens Saved |
|--------------|--------------|
| Context caching | 15-20K |
| Agent prompt compression | 20K |
| Lazy-loading examples | 8K |
| Smart agent reuse | 5K |
| Command consolidation | 9K |
| **Total** | **~50K (60%)** |

---

## Cost Savings

| Model | Before | After | Savings |
|-------|--------|-------|---------|
| Opus only | 100% | 40% | - |
| Sonnet | 0% | 60% | - |
| **Cost/session** | **$1.13** | **$0.59** | **48%** |

---

## Performance Baselines

| Agent | Duration | Tokens | Quality |
|-------|----------|--------|---------|
| ios-dev | 8min | 3500 | 9/10 |
| design-master | 10min | 4000 | 10/10 |
| frontend-developer | 7min | 3000 | 9/10 |
| code-reviewer-pro | 5min | 2500 | 10/10 |
| debugger | 12min | 4500 | 8/10 |

---

**Last Updated:** 2025-10-21
