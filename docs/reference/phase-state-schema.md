# Phase State Schema

**Version:** 2.0.0
**Last Updated:** 2025-11-19

## Overview

Phase state tracking is OS 2.2's mechanism for managing workflow progression through domain pipelines. Each pipeline execution maintains a `phase_state.json` file that tracks current phase, gates passed/failed, and artifacts created.

**Purpose:** Provide persistent, queryable state for pipeline orchestration and recovery.

---

## Schema Definition

### Root Schema

```typescript
interface PhaseState {
  // Metadata
  version: string;                    // Schema version (e.g., "2.0.0")
  domain: DomainType;                 // Which pipeline is running
  session_id: string;                 // Unique session identifier
  created_at: string;                 // ISO timestamp
  updated_at: string;                 // ISO timestamp

  // Current state
  current_phase: string;              // Current phase name
  status: SessionStatus;              // Overall session status

  // Request context
  request: {
    original: string;                 // Original user request
    complexity: ComplexityLevel;      // Estimated complexity
    estimated_phases: number;         // Expected phase count
  };

  // Phase tracking
  phases: Record<string, PhaseInfo>; // All phases and their states

  // Gate results
  gates_passed: string[];            // Gates that passed
  gates_failed: GateFailure[];       // Gates that failed with reasons

  // Artifacts
  artifacts: Artifact[];             // Files/outputs created

  // Context reference
  context_bundle_id?: string;        // Reference to ContextBundle used

  // Recovery
  recovery?: RecoveryInfo;           // Info for resuming failed sessions
}

// Types
type DomainType = 'webdev' | 'ios' | 'data' | 'seo' | 'brand';
type SessionStatus = 'initializing' | 'in_progress' | 'blocked' | 'completed' | 'failed';
type ComplexityLevel = 'simple' | 'medium' | 'complex';
type PhaseStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';

interface PhaseInfo {
  status: PhaseStatus;
  started_at?: string;               // ISO timestamp
  completed_at?: string;             // ISO timestamp
  duration_ms?: number;              // Time taken
  agent?: string;                    // Agent that ran this phase
  notes?: string;                    // Phase-specific notes
  data?: Record<string, any>;        // Phase-specific data
}

interface GateFailure {
  gate: string;                      // Gate name
  phase: string;                     // Which phase it occurred in
  score?: number;                    // Numeric score if applicable
  threshold?: number;                // Required threshold
  violations?: string[];             // Specific violations
  timestamp: string;                 // When it failed
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface Artifact {
  type: string;                      // Type of artifact
  path: string;                      // File path
  created_at: string;                // ISO timestamp
  created_by: string;                // Which phase/agent created it
  size_bytes?: number;               // File size
  description?: string;              // Human-readable description
}

interface RecoveryInfo {
  last_successful_phase: string;     // Last phase that completed
  failure_reason: string;            // Why session stopped
  can_resume: boolean;               // Whether resumable
  resume_from_phase: string;         // Which phase to resume from
}
```

---

## JSON Schema (for Validation)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PhaseState",
  "description": "OS 2.2 Pipeline Phase State",
  "type": "object",
  "required": ["version", "domain", "session_id", "created_at", "current_phase", "status", "request", "phases"],
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "domain": {
      "type": "string",
      "enum": ["nextjs", "webdev", "ios", "data", "seo", "brand"]
    },
    "session_id": {
      "type": "string",
      "pattern": "^[a-f0-9]{32}$"
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time"
    },
    "current_phase": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": ["initializing", "in_progress", "blocked", "completed", "failed"]
    },
    "request": {
      "type": "object",
      "required": ["original", "complexity"],
      "properties": {
        "original": { "type": "string" },
        "complexity": {
          "type": "string",
          "enum": ["simple", "medium", "complex"]
        },
        "estimated_phases": { "type": "number" }
      }
    },
    "phases": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["status"],
        "properties": {
          "status": {
            "type": "string",
            "enum": ["pending", "in_progress", "completed", "failed", "skipped"]
          },
          "started_at": { "type": "string", "format": "date-time" },
          "completed_at": { "type": "string", "format": "date-time" },
          "duration_ms": { "type": "number" },
          "agent": { "type": "string" },
          "notes": { "type": "string" },
          "data": { "type": "object" }
        }
      }
    },
    "gates_passed": {
      "type": "array",
      "items": { "type": "string" }
    },
    "gates_failed": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["gate", "phase", "timestamp", "severity"],
        "properties": {
          "gate": { "type": "string" },
          "phase": { "type": "string" },
          "score": { "type": "number" },
          "threshold": { "type": "number" },
          "violations": {
            "type": "array",
            "items": { "type": "string" }
          },
          "timestamp": { "type": "string", "format": "date-time" },
          "severity": {
            "type": "string",
            "enum": ["low", "medium", "high", "critical"]
          }
        }
      }
    },
    "artifacts": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["type", "path", "created_at", "created_by"],
        "properties": {
          "type": { "type": "string" },
          "path": { "type": "string" },
          "created_at": { "type": "string", "format": "date-time" },
          "created_by": { "type": "string" },
          "size_bytes": { "type": "number" },
          "description": { "type": "string" }
        }
      }
    },
    "context_bundle_id": { "type": "string" },
    "recovery": {
      "type": "object",
      "required": ["last_successful_phase", "failure_reason", "can_resume", "resume_from_phase"],
      "properties": {
        "last_successful_phase": { "type": "string" },
        "failure_reason": { "type": "string" },
        "can_resume": { "type": "boolean" },
        "resume_from_phase": { "type": "string" }
      }
    }
  }
}
```

---

## Domain-Specific Phase Definitions

### Webdev Domain Phases

```yaml
webdev_phases:
  context_query:
    order: 1
    required: true
    agent: "ProjectContextServer (MCP)"
    gates_before: []
    gates_after: []

  planning:
    order: 2
    required: true
    agent: "Orchestrator or requirement-analyst"
    gates_before: []
    gates_after: ["customization_gate"]

  analysis:
    order: 3
    required: true
    agent: "frontend-layout-analyzer"
    gates_before: ["customization_gate"]
    gates_after: []

  implementation_pass_1:
    order: 4
    required: true
    agent: "frontend-builder-agent"
    gates_before: []
    gates_after: ["standards_gate", "design_qa_gate"]
    max_file_edits: 10

  standards_enforcement:
    order: 5
    required: true
    agent: "frontend-standards-enforcer"
    gates_before: []
    gates_after: []
    outputs: ["standards_score", "violations"]

  design_qa:
    order: 6
    required: true
    agent: "frontend-design-reviewer-agent"
    gates_before: []
    gates_after: []
    outputs: ["design_qa_score", "visual_issues"]

  implementation_pass_2:
    order: 7
    required: false  # Only if gates failed
    agent: "frontend-builder-agent"
    gates_before: []
    gates_after: ["standards_gate", "design_qa_gate"]
    trigger_condition: "standards_score < 90 OR design_qa_score < 90"
    max_file_edits: 5  # Corrective only

  verification:
    order: 8
    required: true
    agent: "Orchestrator or verification-agent"
    gates_before: ["standards_gate", "design_qa_gate"]
    gates_after: ["build_gate"]

  completion:
    order: 9
    required: true
    agent: "Orchestrator"
    gates_before: ["build_gate"]
    gates_after: []
```

### iOS Domain Phases

```yaml
ios_phases:
  context_query:
    order: 1
    required: true
    agent: "ProjectContextServer (MCP)"

  requirements:
    order: 2
    required: true
    agent: "requirement-analyst"
    gates_after: ["architecture_gate"]

  architecture:
    order: 3
    required: true
    agent: "system-architect"

  implementation:
    order: 4
    required: true
    agent: "ios-builder-agent"
    max_file_edits: 12

  testing:
    order: 5
    required: true
    agent: "test-engineer or ios-builder-agent"
    gates_after: ["test_gate"]

  verification:
    order: 6
    required: true
    agent: "verification-agent"
    gates_after: ["build_gate"]

  completion:
    order: 7
    required: true
    agent: "Orchestrator"
```

### Data Domain Phases

```yaml
data_phases:
  context_query:
    order: 1
    required: true
    agent: "ProjectContextServer (MCP)"

  discovery:
    order: 2
    required: true
    agent: "Orchestrator"
    outputs: ["data_sources", "metrics_needed"]

  parallel_analysis:
    order: 3
    required: true
    agents:
      - "merch-lifecycle-analyst"
      - "ads-creative-analyst"
      - "bf-sales-analyst"
      - "general-performance-analyst"
    parallel: true

  synthesis:
    order: 4
    required: true
    agent: "story-synthesizer"
    gates_before: []
    gates_after: ["verification_gate"]

  verification:
    order: 5
    required: true
    agent: "verification-agent"
    outputs: ["verified_metrics"]

  completion:
    order: 6
    required: true
    agent: "Orchestrator"
```

---

## Example Phase States

### Example 1: Webdev - Simple Task Success (First Pass)

```json
{
  "version": "2.0.0",
  "domain": "webdev",
  "session_id": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "created_at": "2025-11-19T17:00:00Z",
  "updated_at": "2025-11-19T17:15:00Z",
  "current_phase": "completion",
  "status": "completed",

  "request": {
    "original": "Fix spacing on pricing card component",
    "complexity": "simple",
    "estimated_phases": 7
  },

  "phases": {
    "context_query": {
      "status": "completed",
      "started_at": "2025-11-19T17:00:05Z",
      "completed_at": "2025-11-19T17:00:12Z",
      "duration_ms": 7000,
      "agent": "ProjectContextServer",
      "data": {
        "relevant_files": 3,
        "standards_loaded": 5,
        "decisions_loaded": 2
      }
    },
    "planning": {
      "status": "completed",
      "started_at": "2025-11-19T17:00:13Z",
      "completed_at": "2025-11-19T17:01:00Z",
      "duration_ms": 47000,
      "agent": "Orchestrator",
      "notes": "Single component change, straightforward"
    },
    "analysis": {
      "status": "completed",
      "started_at": "2025-11-19T17:01:01Z",
      "completed_at": "2025-11-19T17:02:30Z",
      "duration_ms": 89000,
      "agent": "frontend-layout-analyzer",
      "data": {
        "dependencies": ["pricing-page.tsx"],
        "current_spacing": "hardcoded",
        "recommendation": "use spacing tokens"
      }
    },
    "implementation_pass_1": {
      "status": "completed",
      "started_at": "2025-11-19T17:02:31Z",
      "completed_at": "2025-11-19T17:05:00Z",
      "duration_ms": 149000,
      "agent": "frontend-builder-agent",
      "data": {
        "files_modified": 1,
        "changes": "replaced hardcoded spacing with tokens"
      }
    },
    "standards_enforcement": {
      "status": "completed",
      "started_at": "2025-11-19T17:05:01Z",
      "completed_at": "2025-11-19T17:06:30Z",
      "duration_ms": 89000,
      "agent": "frontend-standards-enforcer",
      "data": {
        "score": 100,
        "violations": 0
      }
    },
    "design_qa": {
      "status": "completed",
      "started_at": "2025-11-19T17:06:31Z",
      "completed_at": "2025-11-19T17:08:00Z",
      "duration_ms": 89000,
      "agent": "frontend-design-reviewer-agent",
      "data": {
        "score": 95,
        "issues": 0
      }
    },
    "implementation_pass_2": {
      "status": "skipped",
      "notes": "Skipped - both gates passed first try"
    },
    "verification": {
      "status": "completed",
      "started_at": "2025-11-19T17:08:01Z",
      "completed_at": "2025-11-19T17:12:00Z",
      "duration_ms": 239000,
      "agent": "Orchestrator",
      "data": {
        "lint": "passed",
        "typecheck": "passed",
        "build": "passed"
      }
    },
    "completion": {
      "status": "completed",
      "started_at": "2025-11-19T17:12:01Z",
      "completed_at": "2025-11-19T17:15:00Z",
      "duration_ms": 179000,
      "agent": "Orchestrator"
    }
  },

  "gates_passed": [
    "customization_gate",
    "standards_gate",
    "design_qa_gate",
    "build_gate"
  ],

  "gates_failed": [],

  "artifacts": [
    {
      "type": "analysis_report",
      "path": ".claude/orchestration/temp/analysis-20251119170230.md",
      "created_at": "2025-11-19T17:02:30Z",
      "created_by": "frontend-layout-analyzer",
      "size_bytes": 2048,
      "description": "Component dependency analysis"
    },
    {
      "type": "standards_report",
      "path": ".claude/orchestration/evidence/standards-20251119170630.md",
      "created_at": "2025-11-19T17:06:30Z",
      "created_by": "frontend-standards-enforcer",
      "size_bytes": 4096,
      "description": "Standards audit results"
    },
    {
      "type": "design_qa_report",
      "path": ".claude/orchestration/evidence/design-qa-20251119170800.md",
      "created_at": "2025-11-19T17:08:00Z",
      "created_by": "frontend-design-reviewer-agent",
      "size_bytes": 3072,
      "description": "Visual QA results"
    },
    {
      "type": "build_log",
      "path": ".claude/orchestration/evidence/build-20251119171200.log",
      "created_at": "2025-11-19T17:12:00Z",
      "created_by": "verification",
      "size_bytes": 8192,
      "description": "Build output"
    }
  ],

  "context_bundle_id": "ctx_20251119170005"
}
```

### Example 2: Webdev - Medium Task with Corrective Pass

```json
{
  "version": "2.0.0",
  "domain": "webdev",
  "session_id": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7",
  "created_at": "2025-11-19T18:00:00Z",
  "updated_at": "2025-11-19T18:45:00Z",
  "current_phase": "completion",
  "status": "completed",

  "request": {
    "original": "Add dark mode toggle to settings page",
    "complexity": "medium",
    "estimated_phases": 9
  },

  "phases": {
    "context_query": {
      "status": "completed",
      "started_at": "2025-11-19T18:00:05Z",
      "completed_at": "2025-11-19T18:00:15Z",
      "duration_ms": 10000,
      "agent": "ProjectContextServer"
    },
    "planning": {
      "status": "completed",
      "started_at": "2025-11-19T18:00:16Z",
      "completed_at": "2025-11-19T18:02:00Z",
      "duration_ms": 104000,
      "agent": "Orchestrator"
    },
    "analysis": {
      "status": "completed",
      "started_at": "2025-11-19T18:02:01Z",
      "completed_at": "2025-11-19T18:05:00Z",
      "duration_ms": 179000,
      "agent": "frontend-layout-analyzer"
    },
    "implementation_pass_1": {
      "status": "completed",
      "started_at": "2025-11-19T18:05:01Z",
      "completed_at": "2025-11-19T18:12:00Z",
      "duration_ms": 419000,
      "agent": "frontend-builder-agent",
      "data": {
        "files_modified": 4,
        "changes": "added toggle component + theme provider integration"
      }
    },
    "standards_enforcement": {
      "status": "completed",
      "started_at": "2025-11-19T18:12:01Z",
      "completed_at": "2025-11-19T18:15:00Z",
      "duration_ms": 179000,
      "agent": "frontend-standards-enforcer",
      "data": {
        "score": 85,
        "violations": 2
      }
    },
    "design_qa": {
      "status": "completed",
      "started_at": "2025-11-19T18:15:01Z",
      "completed_at": "2025-11-19T18:18:00Z",
      "duration_ms": 179000,
      "agent": "frontend-design-reviewer-agent",
      "data": {
        "score": 88,
        "issues": 1
      }
    },
    "implementation_pass_2": {
      "status": "completed",
      "started_at": "2025-11-19T18:18:01Z",
      "completed_at": "2025-11-19T18:25:00Z",
      "duration_ms": 419000,
      "agent": "frontend-builder-agent",
      "notes": "Corrective pass - fixed violations and design issues",
      "data": {
        "files_modified": 2,
        "changes": "fixed spacing tokens, corrected toggle styling"
      }
    },
    "standards_enforcement_2": {
      "status": "completed",
      "started_at": "2025-11-19T18:25:01Z",
      "completed_at": "2025-11-19T18:27:00Z",
      "duration_ms": 119000,
      "agent": "frontend-standards-enforcer",
      "data": {
        "score": 92,
        "violations": 0
      }
    },
    "design_qa_2": {
      "status": "completed",
      "started_at": "2025-11-19T18:27:01Z",
      "completed_at": "2025-11-19T18:29:00Z",
      "duration_ms": 119000,
      "agent": "frontend-design-reviewer-agent",
      "data": {
        "score": 93,
        "issues": 0
      }
    },
    "verification": {
      "status": "completed",
      "started_at": "2025-11-19T18:29:01Z",
      "completed_at": "2025-11-19T18:38:00Z",
      "duration_ms": 539000,
      "agent": "Orchestrator"
    },
    "completion": {
      "status": "completed",
      "started_at": "2025-11-19T18:38:01Z",
      "completed_at": "2025-11-19T18:45:00Z",
      "duration_ms": 419000,
      "agent": "Orchestrator"
    }
  },

  "gates_passed": [
    "customization_gate",
    "standards_gate",
    "design_qa_gate",
    "build_gate"
  ],

  "gates_failed": [
    {
      "gate": "standards_gate",
      "phase": "standards_enforcement",
      "score": 85,
      "threshold": 90,
      "violations": [
        "Non-token spacing value in Toggle.tsx:42",
        "Arbitrary color in settings-page.tsx:67"
      ],
      "timestamp": "2025-11-19T18:15:00Z",
      "severity": "high"
    },
    {
      "gate": "design_qa_gate",
      "phase": "design_qa",
      "score": 88,
      "threshold": 90,
      "violations": [
        "Toggle button not optically centered"
      ],
      "timestamp": "2025-11-19T18:18:00Z",
      "severity": "medium"
    }
  ],

  "artifacts": [
    {
      "type": "analysis_report",
      "path": ".claude/orchestration/temp/analysis-20251119180500.md",
      "created_at": "2025-11-19T18:05:00Z",
      "created_by": "frontend-layout-analyzer"
    },
    {
      "type": "standards_report",
      "path": ".claude/orchestration/evidence/standards-20251119181500.md",
      "created_at": "2025-11-19T18:15:00Z",
      "created_by": "frontend-standards-enforcer",
      "description": "Pass 1 - Score 85 (violations detected)"
    },
    {
      "type": "standards_report",
      "path": ".claude/orchestration/evidence/standards-20251119182700.md",
      "created_at": "2025-11-19T18:27:00Z",
      "created_by": "frontend-standards-enforcer",
      "description": "Pass 2 - Score 92 (violations fixed)"
    },
    {
      "type": "build_log",
      "path": ".claude/orchestration/evidence/build-20251119183800.log",
      "created_at": "2025-11-19T18:38:00Z",
      "created_by": "verification"
    }
  ],

  "context_bundle_id": "ctx_20251119180005"
}
```

### Example 3: Webdev - Blocked on Customization Gate

```json
{
  "version": "2.0.0",
  "domain": "webdev",
  "session_id": "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
  "created_at": "2025-11-19T19:00:00Z",
  "updated_at": "2025-11-19T19:05:00Z",
  "current_phase": "planning",
  "status": "blocked",

  "request": {
    "original": "Add bright blue accent color to CTA buttons",
    "complexity": "simple",
    "estimated_phases": 7
  },

  "phases": {
    "context_query": {
      "status": "completed",
      "started_at": "2025-11-19T19:00:05Z",
      "completed_at": "2025-11-19T19:00:12Z",
      "duration_ms": 7000,
      "agent": "ProjectContextServer"
    },
    "planning": {
      "status": "completed",
      "started_at": "2025-11-19T19:00:13Z",
      "completed_at": "2025-11-19T19:02:00Z",
      "duration_ms": 107000,
      "agent": "Orchestrator"
    },
    "analysis": {
      "status": "pending"
    },
    "implementation_pass_1": {
      "status": "pending"
    },
    "standards_enforcement": {
      "status": "pending"
    },
    "design_qa": {
      "status": "pending"
    },
    "verification": {
      "status": "pending"
    },
    "completion": {
      "status": "pending"
    }
  },

  "gates_passed": [],

  "gates_failed": [
    {
      "gate": "customization_gate",
      "phase": "planning",
      "violations": [
        "Color 'bright blue' not in design system palette"
      ],
      "timestamp": "2025-11-19T19:02:00Z",
      "severity": "high"
    }
  ],

  "artifacts": [],

  "context_bundle_id": "ctx_20251119190005",

  "recovery": {
    "last_successful_phase": "planning",
    "failure_reason": "Customization gate failed - design system update required",
    "can_resume": true,
    "resume_from_phase": "analysis"
  }
}
```

---

## Phase State Operations

### Initialize

```typescript
function initializePhaseState(request: string, domain: DomainType): PhaseState {
  const sessionId = generateSessionId();
  const complexity = estimateComplexity(request);
  const phaseDefs = getPhaseDefinitionsForDomain(domain);

  const phases: Record<string, PhaseInfo> = {};
  for (const [phaseName, phaseDef] of Object.entries(phaseDefs)) {
    phases[phaseName] = { status: 'pending' };
  }

  return {
    version: '2.0.0',
    domain,
    session_id: sessionId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    current_phase: 'context_query',
    status: 'initializing',
    request: {
      original: request,
      complexity,
      estimated_phases: Object.keys(phaseDefs).length
    },
    phases,
    gates_passed: [],
    gates_failed: [],
    artifacts: []
  };
}
```

### Update Phase

```typescript
function updatePhase(
  state: PhaseState,
  phaseName: string,
  update: Partial<PhaseInfo>
): PhaseState {
  return {
    ...state,
    phases: {
      ...state.phases,
      [phaseName]: {
        ...state.phases[phaseName],
        ...update
      }
    },
    current_phase: update.status === 'completed'
      ? getNextPhase(state, phaseName)
      : state.current_phase,
    updated_at: new Date().toISOString()
  };
}
```

### Record Gate Result

```typescript
function recordGateResult(
  state: PhaseState,
  gate: string,
  passed: boolean,
  details?: Partial<GateFailure>
): PhaseState {
  if (passed) {
    return {
      ...state,
      gates_passed: [...state.gates_passed, gate],
      updated_at: new Date().toISOString()
    };
  } else {
    const failure: GateFailure = {
      gate,
      phase: state.current_phase,
      timestamp: new Date().toISOString(),
      severity: details?.severity || 'medium',
      ...details
    };

    return {
      ...state,
      gates_failed: [...state.gates_failed, failure],
      status: 'blocked',
      updated_at: new Date().toISOString()
    };
  }
}
```

### Add Artifact

```typescript
function addArtifact(
  state: PhaseState,
  artifact: Omit<Artifact, 'created_at'>
): PhaseState {
  return {
    ...state,
    artifacts: [
      ...state.artifacts,
      {
        ...artifact,
        created_at: new Date().toISOString()
      }
    ],
    updated_at: new Date().toISOString()
  };
}
```

### Complete Session

```typescript
function completeSession(
  state: PhaseState,
  status: 'completed' | 'failed'
): PhaseState {
  return {
    ...state,
    status,
    current_phase: 'completion',
    updated_at: new Date().toISOString()
  };
}
```

---

## File Location

**Standard location:** `.claude/project/phase_state.json`

**Per-session location:** `.claude/project/sessions/phase_state_${session_id}.json`

**Archive location:** `.claude/project/sessions/archive/phase_state_${session_id}.json`

---

## Usage in Pipelines

```typescript
// At pipeline start
const state = initializePhaseState(request, 'webdev');
await writeFile('.claude/project/phase_state.json', JSON.stringify(state, null, 2));

// Before each phase
const state = await readPhaseState();
updatePhase(state, 'analysis', { status: 'in_progress', started_at: new Date().toISOString() });

// After each phase
updatePhase(state, 'analysis', {
  status: 'completed',
  completed_at: new Date().toISOString(),
  duration_ms: Date.now() - startTime,
  data: analysisResults
});

// At gates
if (gateResult.passed) {
  recordGateResult(state, 'standards_gate', true);
} else {
  recordGateResult(state, 'standards_gate', false, {
    score: gateResult.score,
    threshold: 90,
    violations: gateResult.violations,
    severity: 'high'
  });
}

// At completion
completeSession(state, 'completed');
```

---

_Phase State: Persistent workflow tracking for OS 2.2 pipelines._
