/**
 * Evidence Budget System
 *
 * Defines quantified evidence requirements per task type and tracks
 * whether the budget has been met before allowing completion claims.
 */

import {
  TaskType,
  EvidenceBudgetConfig,
  BudgetStatus,
  Evidence,
  ToolType
} from './types'

// ============================================================================
// Budget Configurations
// ============================================================================

const BUDGET_CONFIGS: Record<TaskType, EvidenceBudgetConfig> = {
  'ios-ui': {
    taskType: 'ios-ui',
    requiredPoints: 5,
    evidence: {
      build: {
        points: 1,
        required: true,
        tool: 'xcodebuild'
      },
      screenshot: {
        points: 2,
        required: true,
        tool: 'screenshot'
      },
      oracle: {
        points: 2,
        required: true,
        tool: 'xcuitest'
      }
    }
  },

  'ios-logic': {
    taskType: 'ios-logic',
    requiredPoints: 3,
    evidence: {
      build: {
        points: 1,
        required: true,
        tool: 'xcodebuild'
      },
      tests: {
        points: 2,
        required: true,
        tool: 'xcuitest'
      }
    }
  },

  'frontend-ui': {
    taskType: 'frontend-ui',
    requiredPoints: 5,
    evidence: {
      build: {
        points: 1,
        required: true,
        tool: 'npm-build'
      },
      screenshot: {
        points: 2,
        required: true,
        tool: 'browser-screenshot'
      },
      oracle: {
        points: 2,
        required: true,
        tool: 'playwright'
      }
    }
  },

  'frontend-logic': {
    taskType: 'frontend-logic',
    requiredPoints: 3,
    evidence: {
      build: {
        points: 1,
        required: true,
        tool: 'npm-build'
      },
      tests: {
        points: 2,
        required: false,
        tool: 'playwright'
      }
    }
  },

  'backend-api': {
    taskType: 'backend-api',
    requiredPoints: 5,
    evidence: {
      build: {
        points: 1,
        required: false,
        tool: 'pytest'
      },
      tests: {
        points: 2,
        required: true,
        tool: 'pytest'
      },
      api_verification: {
        points: 2,
        required: true,
        tool: 'curl'
      }
    }
  },

  'backend-logic': {
    taskType: 'backend-logic',
    requiredPoints: 3,
    evidence: {
      tests: {
        points: 3,
        required: true,
        tool: 'pytest'
      }
    }
  },

  'documentation': {
    taskType: 'documentation',
    requiredPoints: 2,
    evidence: {
      lint: {
        points: 1,
        required: true,
        tool: 'markdown-lint'
      },
      links: {
        points: 1,
        required: false,
        tool: 'link-checker'
      }
    }
  },

  'configuration': {
    taskType: 'configuration',
    requiredPoints: 1,
    evidence: {
      validation: {
        points: 1,
        required: false,
        tool: 'markdown-lint' // Placeholder
      }
    }
  },

  'unknown': {
    taskType: 'unknown',
    requiredPoints: 0,
    evidence: {}
  }
}

// ============================================================================
// Evidence Budget Tracker
// ============================================================================

export class EvidenceBudgetTracker {
  private budgetConfig: EvidenceBudgetConfig
  private currentEvidence: Evidence | null = null

  constructor(taskType: TaskType) {
    this.budgetConfig = BUDGET_CONFIGS[taskType]
    if (!this.budgetConfig) {
      throw new Error(`No budget configuration for task type: ${taskType}`)
    }
  }

  /**
   * Set current evidence
   */
  setEvidence(evidence: Evidence): void {
    this.currentEvidence = evidence
  }

  /**
   * Get current budget status
   */
  getBudgetStatus(): BudgetStatus {
    const required = this.budgetConfig.requiredPoints
    const collected = this.currentEvidence?.totalPoints || 0

    return {
      required,
      collected,
      percentage: required > 0 ? (collected / required) * 100 : 0,
      met: collected >= required,
      missing: this.getMissingEvidence()
    }
  }

  /**
   * Check if budget is met
   */
  isBudgetMet(): boolean {
    return this.getBudgetStatus().met
  }

  /**
   * Get current points collected
   */
  getCurrentPoints(): number {
    return this.currentEvidence?.totalPoints || 0
  }

  /**
   * Get required points
   */
  getRequiredPoints(): number {
    return this.budgetConfig.requiredPoints
  }

  /**
   * Get missing evidence items
   */
  getMissingEvidence(): string[] {
    const missing: string[] = []
    const evidence = this.currentEvidence

    if (!evidence) {
      // No evidence collected yet - all required items are missing
      for (const [key, config] of Object.entries(this.budgetConfig.evidence)) {
        if (config.required) {
          missing.push(`${key} (${config.points} pts, tool: ${config.tool})`)
        }
      }
      return missing
    }

    // Check each required evidence item
    for (const [key, config] of Object.entries(this.budgetConfig.evidence)) {
      if (config.required) {
        const hasEvidence = this.hasEvidenceForKey(key, evidence)
        if (!hasEvidence) {
          missing.push(`${key} (${config.points} pts, tool: ${config.tool})`)
        }
      }
    }

    // If budget not met but no specific missing items, show point deficit
    if (!this.isBudgetMet() && missing.length === 0) {
      const deficit = this.getRequiredPoints() - this.getCurrentPoints()
      missing.push(`Additional ${deficit} points needed`)
    }

    return missing
  }

  /**
   * Check if evidence exists for a key
   */
  private hasEvidenceForKey(key: string, evidence: Evidence): boolean {
    switch (key) {
      case 'build':
        return !!evidence.build && evidence.build.status === 'pass'
      case 'screenshot':
        return !!evidence.screenshot
      case 'oracle':
        return !!evidence.oracle && evidence.oracle.status === 'pass'
      case 'tests':
        return !!evidence.tests && evidence.tests.status === 'pass'
      case 'lint':
      case 'links':
      case 'validation':
      case 'api_verification':
        return !!evidence.other && evidence.other.some(
          item => item.name.includes(key) && item.status === 'pass'
        )
      default:
        return false
    }
  }

  /**
   * Get required tools for this budget
   */
  getRequiredTools(): ToolType[] {
    return Object.values(this.budgetConfig.evidence)
      .filter(e => e.required)
      .map(e => e.tool)
  }

  /**
   * Get all tools (required and optional) for this budget
   */
  getAllTools(): ToolType[] {
    return Object.values(this.budgetConfig.evidence)
      .map(e => e.tool)
  }

  /**
   * Format budget status for display
   */
  formatBudgetStatus(): string {
    const status = this.getBudgetStatus()
    const icon = status.met ? '✅' : '❌'

    const lines = [
      `${icon} **Evidence Budget:** ${status.collected}/${status.required} points (${status.percentage.toFixed(0)}%)`
    ]

    if (status.missing.length > 0) {
      lines.push('\n**Missing Evidence:**')
      for (const item of status.missing) {
        lines.push(`- ${item}`)
      }
    }

    return lines.join('\n')
  }
}

// ============================================================================
// Completion Blocker
// ============================================================================

export interface BlockResult {
  blocked: boolean
  reason?: string
  message?: string
  budgetStatus?: BudgetStatus
}

export class CompletionBlocker {
  private tracker: EvidenceBudgetTracker
  private strictMode: boolean

  constructor(tracker: EvidenceBudgetTracker, strictMode: boolean = true) {
    this.tracker = tracker
    this.strictMode = strictMode
  }

  /**
   * Check if completion should be blocked
   */
  shouldBlock(response: string): BlockResult {
    // Check for completion claims
    const hasClaim = this.hasCompletionClaim(response)

    if (!hasClaim) {
      return { blocked: false }
    }

    // Check budget status
    const budgetStatus = this.tracker.getBudgetStatus()

    if (budgetStatus.met) {
      return { blocked: false }
    }

    // Budget not met - block in strict mode
    if (this.strictMode) {
      return {
        blocked: true,
        reason: 'Evidence budget not met',
        message: this.formatBlockMessage(budgetStatus),
        budgetStatus
      }
    }

    // Grace mode - allow with warning
    return {
      blocked: false,
      reason: 'Evidence budget not met (grace mode)',
      message: this.formatWarningMessage(budgetStatus),
      budgetStatus
    }
  }

  /**
   * Check if response contains completion claim
   */
  private hasCompletionClaim(response: string): boolean {
    const claimPatterns = [
      /\bfixed\b/i,
      /\bdone\b/i,
      /\bcomplete(d)?\b/i,
      /\bresolved\b/i,
      /\bworking( now)?\b/i,
      /\bshould work\b/i,
      /\ball set\b/i,
      /\bready\b/i
    ]

    return claimPatterns.some(pattern => pattern.test(response))
  }

  /**
   * Format block message
   */
  private formatBlockMessage(status: BudgetStatus): string {
    return `
❌ **COMPLETION BLOCKED - Evidence Budget Not Met**

**Required:** ${status.required} points
**Collected:** ${status.collected} points
**Deficit:** ${status.required - status.collected} points

**Missing Evidence:**
${status.missing.map(m => `- ${m}`).join('\n')}

Cannot claim completion until evidence budget is met.
Run the required tools to collect evidence.
    `.trim()
  }

  /**
   * Format warning message
   */
  private formatWarningMessage(status: BudgetStatus): string {
    return `
⚠️ **WARNING - Evidence Budget Not Met**

**Required:** ${status.required} points
**Collected:** ${status.collected} points
**Deficit:** ${status.required - status.collected} points

**Missing Evidence:**
${status.missing.map(m => `- ${m}`).join('\n')}

Proceeding with completion claim, but verification is incomplete.
**MANUAL CHECK RECOMMENDED**
    `.trim()
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createBudgetTracker(taskType: TaskType): EvidenceBudgetTracker {
  return new EvidenceBudgetTracker(taskType)
}

export function createCompletionBlocker(
  tracker: EvidenceBudgetTracker,
  strictMode?: boolean
): CompletionBlocker {
  return new CompletionBlocker(tracker, strictMode)
}

export function getBudgetConfig(taskType: TaskType): EvidenceBudgetConfig {
  return BUDGET_CONFIGS[taskType]
}

// ============================================================================
// Exports
// ============================================================================

export { BUDGET_CONFIGS }
