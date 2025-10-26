/**
 * Verification Enforcement System
 *
 * Main entry point for the three critical mechanisms:
 * 1. Auto-Verification Injection - Automatic tool execution, evidence inevitable
 * 2. Behavioral Oracles - Objective measurement, can't fake
 * 3. Evidence Budget - Quantified requirements, completion blocked until met
 *
 * Usage:
 *   import { VerificationSystem } from './verification-system'
 *
 *   const system = new VerificationSystem()
 *   const enhanced = await system.processResponse(response, context)
 */

// ============================================================================
// Exports
// ============================================================================

// Types
export * from './types'

// Core Systems
export {
  TaskClassifier,
  createTaskClassifier,
  CLASSIFICATION_RULES
} from './task-classifier'

export {
  ToolExecutor,
  IOSToolExecutor,
  createToolExecutor,
  createIOSToolExecutor,
  TOOL_CONFIGS
} from './tool-executor'

export {
  EvidenceCollector,
  EvidenceFormatter,
  createEvidenceCollector,
  createEvidenceFormatter
} from './evidence-collector'

export {
  EvidenceBudgetTracker,
  CompletionBlocker,
  createBudgetTracker,
  createCompletionBlocker,
  getBudgetConfig,
  BUDGET_CONFIGS
} from './evidence-budget'

export {
  AutoVerificationEngine,
  VerificationCoordinator,
  CompletionClaimDetector,
  createAutoVerificationEngine,
  createVerificationCoordinator,
  createClaimDetector
} from './auto-verification'

export {
  OracleGenerator,
  OracleExecutor,
  createOracleGenerator,
  createOracleExecutor
} from './behavioral-oracles'

// ============================================================================
// Unified Verification System
// ============================================================================

import { VerificationCoordinator } from './auto-verification'

export class VerificationSystem {
  private coordinator: VerificationCoordinator

  constructor(enabled: boolean = true) {
    this.coordinator = new VerificationCoordinator(enabled)
  }

  /**
   * Process response with auto-verification
   *
   * @param response - The response text to process
   * @param taskDescription - Description of the task being verified
   * @param filePaths - File paths involved in the task
   * @param conversationContext - Recent conversation messages
   * @returns Enhanced response with evidence injected
   */
  async processResponse(
    response: string,
    taskDescription: string,
    filePaths: string[] = [],
    conversationContext: string[] = []
  ): Promise<string> {
    return this.coordinator.processResponse(
      response,
      taskDescription,
      filePaths,
      conversationContext
    )
  }

  /**
   * Enable/disable verification
   */
  setEnabled(enabled: boolean): void {
    this.coordinator.setEnabled(enabled)
  }

  /**
   * Check if verification is enabled
   */
  isEnabled(): boolean {
    return this.coordinator.isEnabled()
  }
}

// ============================================================================
// Quick Start Example
// ============================================================================

/*

// 1. Create verification system
const verification = new VerificationSystem()

// 2. Process Claude's response
const claudeResponse = "Fixed the chips! They're now equal width."
const taskDescription = "Fix iOS calculator chips to be equal width"
const filePaths = ["PeptideFox/Features/Calculator/CalculatorView.swift"]

const enhanced = await verification.processResponse(
  claudeResponse,
  taskDescription,
  filePaths
)

// 3. Enhanced response now includes:
// - Automatic xcodebuild execution
// - Simulator screenshot
// - XCUITest oracle measuring chip widths
// - Evidence budget status (5/5 points)
// - Contradiction detection if claim doesn't match evidence

console.log(enhanced)

*/

// ============================================================================
// Default Export
// ============================================================================

export default VerificationSystem
