/**
 * Auto-Verification Injection System
 *
 * Automatically detects completion claims, executes verification tools,
 * and injects evidence into responses before sending to user.
 *
 * This is the CRITICAL component that makes false completions impossible.
 */

import {
  VerificationRequest,
  VerificationResult,
  CompletionClaim,
  ClaimVerification,
  TaskType,
  Evidence
} from './types'
import { TaskClassifier } from './task-classifier'
import { ToolExecutor, IOSToolExecutor } from './tool-executor'
import { EvidenceCollector, EvidenceFormatter } from './evidence-collector'
import { EvidenceBudgetTracker, CompletionBlocker } from './evidence-budget'

// ============================================================================
// Completion Claim Detector
// ============================================================================

export class CompletionClaimDetector {
  /**
   * Detect completion claims in response
   */
  detect(response: string): CompletionClaim[] {
    const claims: CompletionClaim[] = []

    const patterns = [
      { pattern: /\b(fixed|fix)\b/gi, confidence: 0.9 },
      { pattern: /\b(done|finished)\b/gi, confidence: 0.95 },
      { pattern: /\b(complete|completed)\b/gi, confidence: 0.95 },
      { pattern: /\b(resolved|solved)\b/gi, confidence: 0.85 },
      { pattern: /\b(working( now)?|works( now)?)\b/gi, confidence: 0.8 },
      { pattern: /\bshould work\b/gi, confidence: 0.7 },
      { pattern: /\ball set\b/gi, confidence: 0.75 },
      { pattern: /\b(ready|good to go)\b/gi, confidence: 0.75 }
    ]

    for (const { pattern, confidence } of patterns) {
      let match
      while ((match = pattern.exec(response)) !== null) {
        claims.push({
          detected: true,
          claim: match[0],
          confidence,
          taskReferenced: this.extractTaskReference(response, match.index),
          location: {
            start: match.index,
            end: match.index + match[0].length
          }
        })
      }
    }

    return claims
  }

  /**
   * Extract task reference from context around claim
   */
  private extractTaskReference(text: string, claimIndex: number): string {
    // Get sentence containing the claim
    const before = text.substring(Math.max(0, claimIndex - 100), claimIndex)
    const after = text.substring(claimIndex, Math.min(text.length, claimIndex + 100))

    const context = before + after

    // Extract task keywords
    const taskPatterns = [
      /chips?/i,
      /buttons?/i,
      /layout/i,
      /spacing/i,
      /width/i,
      /height/i,
      /design/i,
      /ui/i,
      /view/i,
      /component/i
    ]

    for (const pattern of taskPatterns) {
      const match = context.match(pattern)
      if (match) {
        return match[0]
      }
    }

    return 'unknown task'
  }
}

// ============================================================================
// Auto-Verification Engine
// ============================================================================

export class AutoVerificationEngine {
  private classifier: TaskClassifier
  private toolExecutor: ToolExecutor
  private evidenceCollector: EvidenceCollector
  private evidenceFormatter: EvidenceFormatter
  private claimDetector: CompletionClaimDetector

  constructor() {
    this.classifier = new TaskClassifier()
    this.toolExecutor = new ToolExecutor()
    this.evidenceCollector = new EvidenceCollector()
    this.evidenceFormatter = new EvidenceFormatter()
    this.claimDetector = new CompletionClaimDetector()
  }

  /**
   * Process response - detect claims and auto-verify
   */
  async processResponse(
    response: string,
    request: VerificationRequest
  ): Promise<string> {
    // 1. Detect completion claims
    const claims = this.claimDetector.detect(response)

    if (claims.length === 0) {
      // No claims detected - return original response
      return response
    }

    console.log(`Detected ${claims.length} completion claim(s)`)

    // 2. Classify task
    const classification = this.classifier.classify(request)

    if (classification.type === 'unknown' || classification.confidence < 0.5) {
      console.log('Task classification uncertain, skipping auto-verification')
      return response
    }

    console.log(`Task classified as: ${classification.type} (confidence: ${classification.confidence})`)

    // 3. Execute verification
    const verificationResult = await this.verify(request, classification.type)

    // 4. Inject evidence into response
    const enhancedResponse = this.injectEvidence(
      response,
      verificationResult,
      claims[0] // Use first claim
    )

    return enhancedResponse
  }

  /**
   * Verify task by running required tools
   */
  async verify(
    request: VerificationRequest,
    taskType: TaskType
  ): Promise<VerificationResult> {
    const classification = this.classifier.classify(request)
    const budgetTracker = new EvidenceBudgetTracker(taskType)

    console.log(`Running verification for ${taskType}...`)
    console.log(`Required tools: ${classification.requiredTools.join(', ')}`)

    // Execute tools
    const toolResults = await this.toolExecutor.executeParallel(
      classification.requiredTools
    )

    console.log(`Executed ${toolResults.length} tools`)

    // Collect evidence
    const evidence = await this.evidenceCollector.createEvidence(
      taskType,
      toolResults,
      classification.evidenceBudget
    )

    budgetTracker.setEvidence(evidence)
    const budgetStatus = budgetTracker.getBudgetStatus()

    console.log(`Evidence collected: ${budgetStatus.collected}/${budgetStatus.required} points`)

    return {
      request,
      classification,
      evidence,
      budgetStatus,
      completionAllowed: budgetStatus.met,
      message: budgetTracker.formatBudgetStatus(),
      warnings: budgetStatus.met ? [] : ['Evidence budget not met']
    }
  }

  /**
   * Inject evidence into response
   */
  private injectEvidence(
    originalResponse: string,
    verificationResult: VerificationResult,
    claim: CompletionClaim
  ): string {
    let enhanced = originalResponse + '\n\n---\n\n'

    // Add evidence section
    enhanced += this.evidenceFormatter.formatForResponse(verificationResult.evidence)

    // Check for contradictions
    const contradiction = this.detectContradiction(claim, verificationResult.evidence)

    if (contradiction) {
      enhanced += '\n\n'
      enhanced += this.evidenceFormatter.formatContradiction(
        claim.claim,
        verificationResult.evidence,
        contradiction
      )
    }

    // Add budget status warning if not met
    if (!verificationResult.completionAllowed) {
      enhanced += '\n\n'
      enhanced += verificationResult.message
    }

    return enhanced
  }

  /**
   * Detect contradiction between claim and evidence
   */
  private detectContradiction(
    claim: CompletionClaim,
    evidence: Evidence
  ): string | null {
    // Check build failure
    if (evidence.build && evidence.build.status === 'fail') {
      return 'Build failed - code does not compile'
    }

    // Check oracle failure
    if (evidence.oracle && evidence.oracle.status === 'fail') {
      return `Oracle verification failed: ${evidence.oracle.details}`
    }

    // Check test failure
    if (evidence.tests && evidence.tests.status === 'fail') {
      return `Tests failed: ${evidence.tests.failed}/${evidence.tests.total} tests failing`
    }

    // Check budget not met
    if (!evidence.budgetMet) {
      return `Evidence insufficient (${evidence.totalPoints}/${evidence.budgetRequired} points)`
    }

    return null
  }
}

// ============================================================================
// Verification Coordinator
// ============================================================================

export class VerificationCoordinator {
  private engine: AutoVerificationEngine
  private enabled: boolean

  constructor(enabled: boolean = true) {
    this.engine = new AutoVerificationEngine()
    this.enabled = enabled
  }

  /**
   * Process response with auto-verification
   */
  async processResponse(
    response: string,
    taskDescription: string,
    filePaths: string[],
    conversationContext: string[]
  ): Promise<string> {
    if (!this.enabled) {
      return response
    }

    const request: VerificationRequest = {
      taskDescription,
      conversationContext,
      filePaths,
      userRequest: conversationContext[conversationContext.length - 1] || ''
    }

    return this.engine.processResponse(response, request)
  }

  /**
   * Enable/disable auto-verification
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Check if enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createAutoVerificationEngine(): AutoVerificationEngine {
  return new AutoVerificationEngine()
}

export function createVerificationCoordinator(
  enabled?: boolean
): VerificationCoordinator {
  return new VerificationCoordinator(enabled)
}

export function createClaimDetector(): CompletionClaimDetector {
  return new CompletionClaimDetector()
}
