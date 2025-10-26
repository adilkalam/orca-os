/**
 * Type Definitions for Verification Enforcement System
 *
 * Core types for task classification, evidence collection, and verification
 */

// ============================================================================
// Task Classification
// ============================================================================

export type TaskType =
  | 'ios-ui'
  | 'ios-logic'
  | 'frontend-ui'
  | 'frontend-logic'
  | 'backend-api'
  | 'backend-logic'
  | 'documentation'
  | 'configuration'
  | 'unknown'

export interface TaskClassification {
  type: TaskType
  confidence: number // 0.0 to 1.0
  requiredTools: ToolType[]
  evidenceBudget: number
  reasoning: string
  keywords: string[]
  filePaths: string[]
}

// ============================================================================
// Tools & Execution
// ============================================================================

export type ToolType =
  | 'xcodebuild'
  | 'simulator'
  | 'screenshot'
  | 'xcuitest'
  | 'npm-build'
  | 'playwright'
  | 'browser-screenshot'
  | 'curl'
  | 'pytest'
  | 'markdown-lint'
  | 'link-checker'

export interface ToolConfig {
  name: ToolType
  command: string
  args: string[]
  timeout: number // milliseconds
  retries: number
  evidencePoints: number
}

export interface ToolResult {
  tool: ToolType
  status: 'success' | 'failure' | 'timeout' | 'error'
  exitCode?: number
  stdout: string
  stderr: string
  duration: number // milliseconds
  timestamp: string
  evidencePoints: number
  artifactPaths?: string[] // screenshots, logs, etc.
}

export interface ToolExecutionPlan {
  tools: ToolConfig[]
  parallel: boolean
  totalTimeout: number
}

// ============================================================================
// Evidence Collection
// ============================================================================

export interface Evidence {
  id: string
  timestamp: string
  taskType: TaskType

  // Build evidence
  build?: {
    status: 'pass' | 'fail'
    output: string
    duration: number
    points: number
  }

  // Visual evidence
  screenshot?: {
    path: string
    width: number
    height: number
    points: number
  }

  // Behavioral evidence (oracles)
  oracle?: {
    status: 'pass' | 'fail'
    name: string
    details: string
    measurements?: Record<string, any>
    points: number
  }

  // Test evidence
  tests?: {
    status: 'pass' | 'fail'
    passed: number
    failed: number
    total: number
    output: string
    points: number
  }

  // Other evidence
  other?: Array<{
    name: string
    status: 'pass' | 'fail'
    details: string
    points: number
  }>

  totalPoints: number
  budgetRequired: number
  budgetMet: boolean
}

// ============================================================================
// Evidence Budget
// ============================================================================

export interface EvidenceBudgetConfig {
  taskType: TaskType
  requiredPoints: number
  evidence: {
    [key: string]: {
      points: number
      required: boolean
      tool: ToolType
    }
  }
}

export interface BudgetStatus {
  required: number
  collected: number
  percentage: number
  met: boolean
  missing: string[]
}

// ============================================================================
// Verification
// ============================================================================

export interface VerificationRequest {
  taskDescription: string
  conversationContext: string[]
  filePaths: string[]
  userRequest: string
}

export interface VerificationResult {
  request: VerificationRequest
  classification: TaskClassification
  evidence: Evidence
  budgetStatus: BudgetStatus
  completionAllowed: boolean
  message: string
  warnings: string[]
}

// ============================================================================
// Completion Claims
// ============================================================================

export interface CompletionClaim {
  detected: boolean
  claim: string
  confidence: number
  taskReferenced: string
  location: {
    start: number
    end: number
  }
}

export interface ClaimVerification {
  claim: CompletionClaim
  evidence: Evidence
  contradiction: boolean
  contradictionReason?: string
  verified: boolean
}

// ============================================================================
// Behavioral Oracles
// ============================================================================

export type OracleType =
  | 'ios-layout-equality'
  | 'ios-element-dimensions'
  | 'frontend-element-dimensions'
  | 'frontend-visual-regression'
  | 'backend-api-response'
  | 'backend-performance'

export interface OracleDefinition {
  type: OracleType
  name: string
  description: string
  code: string
  language: 'swift' | 'typescript' | 'bash'
  expectedResult: 'pass' | 'fail'
}

export interface OracleResult {
  oracle: OracleDefinition
  status: 'pass' | 'fail' | 'error'
  output: string
  measurements?: Record<string, any>
  duration: number
  timestamp: string
}

// ============================================================================
// Metrics & Monitoring
// ============================================================================

export interface VerificationMetrics {
  sessionId: string
  timestamp: string
  taskType: TaskType
  evidenceBudgetRequired: number
  evidenceBudgetCollected: number
  budgetMet: boolean
  latencyMs: number
  toolsExecuted: ToolType[]
  toolSuccessRates: Record<ToolType, number>
  oracleResult?: 'pass' | 'fail'
  completionBlocked: boolean
  userCorrection: boolean
}

// ============================================================================
// Configuration
// ============================================================================

export interface VerificationSystemConfig {
  enabled: boolean
  taskClassification: {
    confidenceThreshold: number
    defaultTaskType: TaskType
  }
  toolExecution: {
    parallelExecution: boolean
    defaultTimeout: number
    maxRetries: number
  }
  evidenceBudget: {
    strictMode: boolean // Block completions without budget
    graceMode: boolean // Allow with warning if tools fail
  }
  storage: {
    evidencePath: string
    retentionDays: number
    screenshotFormat: 'png' | 'jpg'
  }
  monitoring: {
    metricsEnabled: boolean
    metricsPath: string
  }
}
