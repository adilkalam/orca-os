/**
 * Evidence Collection & Storage System
 *
 * Collects verification evidence from tool executions and stores it
 * with proper organization and retention policies.
 */

import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import {
  Evidence,
  ToolResult,
  TaskType,
  ToolType
} from './types'

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const unlink = promisify(fs.unlink)

// ============================================================================
// Evidence Collector
// ============================================================================

export class EvidenceCollector {
  private evidenceBasePath: string
  private retentionDays: number

  constructor(
    basePath: string = '.orchestration/evidence',
    retentionDays: number = 7
  ) {
    this.evidenceBasePath = basePath
    this.retentionDays = retentionDays
  }

  /**
   * Create evidence from tool results
   */
  async createEvidence(
    taskType: TaskType,
    toolResults: ToolResult[],
    budgetRequired: number
  ): Promise<Evidence> {
    const id = this.generateEvidenceId()
    const timestamp = new Date().toISOString()

    // Create evidence directory
    const evidenceDir = await this.createEvidenceDirectory(timestamp)

    // Process tool results
    const evidence: Evidence = {
      id,
      timestamp,
      taskType,
      totalPoints: 0,
      budgetRequired,
      budgetMet: false
    }

    for (const result of toolResults) {
      await this.processToolResult(result, evidence, evidenceDir)
    }

    // Calculate total points and budget status
    evidence.totalPoints = this.calculateTotalPoints(evidence)
    evidence.budgetMet = evidence.totalPoints >= budgetRequired

    // Save evidence manifest
    await this.saveEvidenceManifest(evidence, evidenceDir)

    return evidence
  }

  /**
   * Process a single tool result
   */
  private async processToolResult(
    result: ToolResult,
    evidence: Evidence,
    evidenceDir: string
  ): Promise<void> {
    switch (result.tool) {
      case 'xcodebuild':
      case 'npm-build':
        evidence.build = {
          status: result.status === 'success' ? 'pass' : 'fail',
          output: this.truncateOutput(result.stdout + result.stderr, 5000),
          duration: result.duration,
          points: result.evidencePoints
        }
        // Save full build output
        await this.saveBuildOutput(result, evidenceDir)
        break

      case 'screenshot':
      case 'browser-screenshot':
        if (result.artifactPaths && result.artifactPaths.length > 0) {
          evidence.screenshot = {
            path: result.artifactPaths[0],
            width: 0, // Would need to read image metadata
            height: 0,
            points: result.evidencePoints
          }
        }
        break

      case 'xcuitest':
      case 'playwright':
      case 'pytest':
        evidence.tests = this.parseTestResults(result)
        break

      default:
        // Other evidence
        if (!evidence.other) {
          evidence.other = []
        }
        evidence.other.push({
          name: result.tool,
          status: result.status === 'success' ? 'pass' : 'fail',
          details: this.truncateOutput(result.stdout, 1000),
          points: result.evidencePoints
        })
    }
  }

  /**
   * Parse test results
   */
  private parseTestResults(result: ToolResult): Evidence['tests'] {
    const output = result.stdout + result.stderr

    // Try to parse test counts from output
    let passed = 0
    let failed = 0
    let total = 0

    // XCTest format: "Test Suite 'All tests' passed at..."
    const xctestMatch = output.match(/(\d+) tests?.*?(\d+) failures?/i)
    if (xctestMatch) {
      total = parseInt(xctestMatch[1])
      failed = parseInt(xctestMatch[2])
      passed = total - failed
    }

    // Pytest format: "5 passed, 2 failed"
    const pytestMatch = output.match(/(\d+) passed.*?(\d+) failed/i)
    if (pytestMatch) {
      passed = parseInt(pytestMatch[1])
      failed = parseInt(pytestMatch[2])
      total = passed + failed
    }

    // Playwright format
    const playwrightMatch = output.match(/(\d+) passed.*?(\d+) failed/i)
    if (playwrightMatch) {
      passed = parseInt(playwrightMatch[1])
      failed = parseInt(playwrightMatch[2])
      total = passed + failed
    }

    return {
      status: failed === 0 ? 'pass' : 'fail',
      passed,
      failed,
      total: total || passed + failed,
      output: this.truncateOutput(output, 2000),
      points: failed === 0 ? result.evidencePoints : 0
    }
  }

  /**
   * Calculate total evidence points
   */
  private calculateTotalPoints(evidence: Evidence): number {
    let total = 0

    if (evidence.build) {
      total += evidence.build.points
    }

    if (evidence.screenshot) {
      total += evidence.screenshot.points
    }

    if (evidence.oracle) {
      total += evidence.oracle.points
    }

    if (evidence.tests) {
      total += evidence.tests.points
    }

    if (evidence.other) {
      total += evidence.other.reduce((sum, item) => sum + item.points, 0)
    }

    return total
  }

  /**
   * Create evidence directory
   */
  private async createEvidenceDirectory(timestamp: string): Promise<string> {
    const date = timestamp.split('T')[0] // YYYY-MM-DD
    const dirPath = path.join(this.evidenceBasePath, date)

    try {
      await mkdir(dirPath, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    return dirPath
  }

  /**
   * Save build output to file
   */
  private async saveBuildOutput(
    result: ToolResult,
    evidenceDir: string
  ): Promise<void> {
    const filename = `build-${result.tool}-${Date.now()}.log`
    const filepath = path.join(evidenceDir, filename)

    const content = `
Tool: ${result.tool}
Status: ${result.status}
Duration: ${result.duration}ms
Exit Code: ${result.exitCode || 'N/A'}
Timestamp: ${result.timestamp}

=== STDOUT ===
${result.stdout}

=== STDERR ===
${result.stderr}
    `.trim()

    await writeFile(filepath, content, 'utf-8')
  }

  /**
   * Save evidence manifest
   */
  private async saveEvidenceManifest(
    evidence: Evidence,
    evidenceDir: string
  ): Promise<void> {
    const filename = `evidence-${evidence.id}.json`
    const filepath = path.join(evidenceDir, filename)

    await writeFile(
      filepath,
      JSON.stringify(evidence, null, 2),
      'utf-8'
    )
  }

  /**
   * Clean up old evidence
   */
  async cleanupOldEvidence(): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays)

    let deletedCount = 0

    try {
      const entries = await readdir(this.evidenceBasePath)

      for (const entry of entries) {
        const entryPath = path.join(this.evidenceBasePath, entry)
        const stats = await stat(entryPath)

        if (stats.isDirectory() && stats.mtime < cutoffDate) {
          await this.deleteDirectory(entryPath)
          deletedCount++
        }
      }
    } catch (error) {
      console.error('Error cleaning up old evidence:', error)
    }

    return deletedCount
  }

  /**
   * Delete directory recursively
   */
  private async deleteDirectory(dirPath: string): Promise<void> {
    const entries = await readdir(dirPath)

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry)
      const stats = await stat(entryPath)

      if (stats.isDirectory()) {
        await this.deleteDirectory(entryPath)
      } else {
        await unlink(entryPath)
      }
    }

    await fs.promises.rmdir(dirPath)
  }

  /**
   * Generate unique evidence ID
   */
  private generateEvidenceId(): string {
    return `ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Truncate output to max length
   */
  private truncateOutput(output: string, maxLength: number): string {
    if (output.length <= maxLength) {
      return output
    }

    return output.substring(0, maxLength) + '\n\n... (truncated)'
  }
}

// ============================================================================
// Evidence Formatter
// ============================================================================

export class EvidenceFormatter {
  /**
   * Format evidence for display in response
   */
  formatForResponse(evidence: Evidence): string {
    const sections: string[] = []

    sections.push('## Auto-Verification Results\n')

    // Build evidence
    if (evidence.build) {
      const icon = evidence.build.status === 'pass' ? '✅' : '❌'
      sections.push(
        `- **Build:** ${icon} ${evidence.build.status.toUpperCase()} ` +
        `(${evidence.build.duration}ms, ${evidence.build.points} pts)`
      )
    }

    // Screenshot evidence
    if (evidence.screenshot) {
      sections.push(
        `- **Screenshot:** ✅ Captured (${evidence.screenshot.points} pts)\n` +
        `  ![Screenshot](${evidence.screenshot.path})`
      )
    }

    // Oracle evidence
    if (evidence.oracle) {
      const icon = evidence.oracle.status === 'pass' ? '✅' : '❌'
      sections.push(
        `- **Oracle:** ${icon} ${evidence.oracle.status.toUpperCase()} - ` +
        `${evidence.oracle.details} (${evidence.oracle.points} pts)`
      )

      if (evidence.oracle.measurements) {
        sections.push('  Measurements:')
        for (const [key, value] of Object.entries(evidence.oracle.measurements)) {
          sections.push(`  - ${key}: ${JSON.stringify(value)}`)
        }
      }
    }

    // Test evidence
    if (evidence.tests) {
      const icon = evidence.tests.status === 'pass' ? '✅' : '❌'
      sections.push(
        `- **Tests:** ${icon} ${evidence.tests.passed}/${evidence.tests.total} passed ` +
        `(${evidence.tests.points} pts)`
      )
    }

    // Other evidence
    if (evidence.other && evidence.other.length > 0) {
      for (const item of evidence.other) {
        const icon = item.status === 'pass' ? '✅' : '❌'
        sections.push(
          `- **${item.name}:** ${icon} ${item.status.toUpperCase()} ` +
          `(${item.points} pts)`
        )
      }
    }

    // Budget status
    sections.push(
      `\n**Evidence Budget:** ${evidence.totalPoints}/${evidence.budgetRequired} points ` +
      `(${evidence.budgetMet ? '✅ MET' : '❌ NOT MET'})`
    )

    return sections.join('\n')
  }

  /**
   * Format contradiction message
   */
  formatContradiction(
    claim: string,
    evidence: Evidence,
    reason: string
  ): string {
    return `
⚠️ **CONTRADICTION DETECTED**

**Claim:** "${claim}"
**Evidence:** ${reason}

The auto-verification results contradict the completion claim.
Please review the evidence above and address the issues.
    `.trim()
  }

  /**
   * Format budget not met message
   */
  formatBudgetNotMet(
    evidence: Evidence,
    missing: string[]
  ): string {
    return `
❌ **EVIDENCE BUDGET NOT MET**

**Required:** ${evidence.budgetRequired} points
**Collected:** ${evidence.totalPoints} points
**Deficit:** ${evidence.budgetRequired - evidence.totalPoints} points

**Missing Evidence:**
${missing.map(m => `- ${m}`).join('\n')}

Cannot claim completion until evidence budget is met.
    `.trim()
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createEvidenceCollector(
  basePath?: string,
  retentionDays?: number
): EvidenceCollector {
  return new EvidenceCollector(basePath, retentionDays)
}

export function createEvidenceFormatter(): EvidenceFormatter {
  return new EvidenceFormatter()
}
