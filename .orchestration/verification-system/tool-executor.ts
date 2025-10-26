/**
 * Tool Execution Framework
 *
 * Automatically executes verification tools (xcodebuild, simulator, screenshots, etc.)
 * with retry logic, timeout handling, and parallel execution support.
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import { ToolType, ToolConfig, ToolResult, ToolExecutionPlan } from './types'

const execAsync = promisify(exec)

// ============================================================================
// Tool Configurations
// ============================================================================

const TOOL_CONFIGS: Record<ToolType, ToolConfig> = {
  // iOS Tools
  'xcodebuild': {
    name: 'xcodebuild',
    command: 'xcodebuild',
    args: ['build', '-scheme', 'PeptideFox', '-destination', 'platform=iOS Simulator,name=iPhone 15 Pro'],
    timeout: 120000, // 2 minutes
    retries: 2,
    evidencePoints: 1
  },
  'simulator': {
    name: 'simulator',
    command: 'xcrun',
    args: ['simctl', 'boot', 'iPhone 15 Pro'],
    timeout: 30000, // 30 seconds
    retries: 3,
    evidencePoints: 0 // No points, prerequisite for screenshot
  },
  'screenshot': {
    name: 'screenshot',
    command: 'xcrun',
    args: ['simctl', 'io', 'booted', 'screenshot'],
    timeout: 10000, // 10 seconds
    retries: 2,
    evidencePoints: 2
  },
  'xcuitest': {
    name: 'xcuitest',
    command: 'xcodebuild',
    args: ['test', '-scheme', 'PeptideFox', '-destination', 'platform=iOS Simulator,name=iPhone 15 Pro'],
    timeout: 180000, // 3 minutes
    retries: 1,
    evidencePoints: 2
  },

  // Frontend Tools
  'npm-build': {
    name: 'npm-build',
    command: 'npm',
    args: ['run', 'build'],
    timeout: 120000, // 2 minutes
    retries: 1,
    evidencePoints: 1
  },
  'playwright': {
    name: 'playwright',
    command: 'npx',
    args: ['playwright', 'test'],
    timeout: 180000, // 3 minutes
    retries: 1,
    evidencePoints: 2
  },
  'browser-screenshot': {
    name: 'browser-screenshot',
    command: 'npx',
    args: ['playwright', 'screenshot'],
    timeout: 30000, // 30 seconds
    retries: 2,
    evidencePoints: 2
  },

  // Backend Tools
  'curl': {
    name: 'curl',
    command: 'curl',
    args: ['-s', '-w', '\\n%{http_code}'],
    timeout: 10000, // 10 seconds
    retries: 2,
    evidencePoints: 1
  },
  'pytest': {
    name: 'pytest',
    command: 'pytest',
    args: ['-v', '--tb=short'],
    timeout: 120000, // 2 minutes
    retries: 1,
    evidencePoints: 2
  },

  // Documentation Tools
  'markdown-lint': {
    name: 'markdown-lint',
    command: 'npx',
    args: ['markdownlint', '**/*.md'],
    timeout: 30000, // 30 seconds
    retries: 1,
    evidencePoints: 1
  },
  'link-checker': {
    name: 'link-checker',
    command: 'npx',
    args: ['markdown-link-check'],
    timeout: 60000, // 1 minute
    retries: 1,
    evidencePoints: 1
  }
}

// ============================================================================
// Tool Executor
// ============================================================================

export class ToolExecutor {
  private executionId: number = 0

  /**
   * Execute a single tool
   */
  async execute(
    toolType: ToolType,
    customArgs?: string[],
    customTimeout?: number
  ): Promise<ToolResult> {
    const config = TOOL_CONFIGS[toolType]
    if (!config) {
      throw new Error(`Unknown tool type: ${toolType}`)
    }

    const args = customArgs || config.args
    const timeout = customTimeout || config.timeout

    return this.executeWithRetry(config, args, timeout)
  }

  /**
   * Execute multiple tools in parallel
   */
  async executeParallel(tools: ToolType[]): Promise<ToolResult[]> {
    const promises = tools.map(tool => this.execute(tool))
    return Promise.all(promises)
  }

  /**
   * Execute tools according to execution plan
   */
  async executePlan(plan: ToolExecutionPlan): Promise<ToolResult[]> {
    if (plan.parallel) {
      return this.executeParallel(plan.tools.map(t => t.name))
    } else {
      const results: ToolResult[] = []
      for (const toolConfig of plan.tools) {
        const result = await this.execute(toolConfig.name)
        results.push(result)

        // Stop execution if a tool fails (sequential mode)
        if (result.status === 'failure' || result.status === 'error') {
          console.log(`Tool ${toolConfig.name} failed, stopping execution plan`)
          break
        }
      }
      return results
    }
  }

  /**
   * Execute tool with retry logic
   */
  private async executeWithRetry(
    config: ToolConfig,
    args: string[],
    timeout: number
  ): Promise<ToolResult> {
    let lastError: Error | null = null
    let attempts = 0

    while (attempts <= config.retries) {
      attempts++

      try {
        return await this.executeSingle(config, args, timeout)
      } catch (error) {
        lastError = error as Error
        console.log(
          `Tool ${config.name} failed (attempt ${attempts}/${config.retries + 1}):`,
          error
        )

        if (attempts <= config.retries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempts - 1), 10000)
          await this.sleep(delay)
        }
      }
    }

    // All retries failed
    return {
      tool: config.name,
      status: 'error',
      stdout: '',
      stderr: lastError?.message || 'Unknown error',
      duration: 0,
      timestamp: new Date().toISOString(),
      evidencePoints: 0
    }
  }

  /**
   * Execute tool once
   */
  private async executeSingle(
    config: ToolConfig,
    args: string[],
    timeout: number
  ): Promise<ToolResult> {
    const executionId = ++this.executionId
    const startTime = Date.now()

    console.log(`[${executionId}] Executing: ${config.command} ${args.join(' ')}`)

    try {
      const { stdout, stderr } = await execAsync(
        `${config.command} ${args.join(' ')}`,
        { timeout }
      )

      const duration = Date.now() - startTime
      const status = this.determineStatus(stdout, stderr)

      console.log(`[${executionId}] Completed in ${duration}ms: ${status}`)

      return {
        tool: config.name,
        status,
        exitCode: 0,
        stdout,
        stderr,
        duration,
        timestamp: new Date().toISOString(),
        evidencePoints: status === 'success' ? config.evidencePoints : 0
      }
    } catch (error: any) {
      const duration = Date.now() - startTime

      if (error.killed) {
        console.log(`[${executionId}] Timeout after ${duration}ms`)
        return {
          tool: config.name,
          status: 'timeout',
          exitCode: error.code,
          stdout: error.stdout || '',
          stderr: error.stderr || 'Command timed out',
          duration,
          timestamp: new Date().toISOString(),
          evidencePoints: 0
        }
      }

      console.log(`[${executionId}] Failed after ${duration}ms: ${error.message}`)

      return {
        tool: config.name,
        status: 'failure',
        exitCode: error.code || 1,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        duration,
        timestamp: new Date().toISOString(),
        evidencePoints: 0
      }
    }
  }

  /**
   * Determine tool status from output
   */
  private determineStatus(stdout: string, stderr: string): 'success' | 'failure' {
    // Check for common failure indicators
    const failureIndicators = [
      /error:/i,
      /failed/i,
      /\*\* BUILD FAILED \*\*/,
      /Test Suite.*failed/,
      /FAILED/
    ]

    const output = stdout + stderr

    for (const indicator of failureIndicators) {
      if (indicator.test(output)) {
        return 'failure'
      }
    }

    // Check for success indicators
    const successIndicators = [
      /BUILD SUCCEEDED/,
      /Test Suite.*passed/,
      /All tests passed/,
      /✓/,
      /PASSED/
    ]

    for (const indicator of successIndicators) {
      if (indicator.test(output)) {
        return 'success'
      }
    }

    // Default to success if no clear failure
    return 'success'
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get tool configuration
   */
  getConfig(toolType: ToolType): ToolConfig | undefined {
    return TOOL_CONFIGS[toolType]
  }
}

// ============================================================================
// iOS-Specific Helpers
// ============================================================================

export class IOSToolExecutor extends ToolExecutor {
  /**
   * Build iOS project
   */
  async build(scheme: string = 'PeptideFox'): Promise<ToolResult> {
    return this.execute('xcodebuild', [
      'build',
      '-scheme', scheme,
      '-destination', 'platform=iOS Simulator,name=iPhone 15 Pro'
    ])
  }

  /**
   * Boot simulator
   */
  async bootSimulator(deviceName: string = 'iPhone 15 Pro'): Promise<ToolResult> {
    return this.execute('simulator', ['simctl', 'boot', deviceName])
  }

  /**
   * Take screenshot
   */
  async screenshot(outputPath: string): Promise<ToolResult> {
    return this.execute('screenshot', [
      'simctl', 'io', 'booted', 'screenshot', outputPath
    ])
  }

  /**
   * Run UI tests
   */
  async runUITests(scheme: string = 'PeptideFox'): Promise<ToolResult> {
    return this.execute('xcuitest', [
      'test',
      '-scheme', scheme,
      '-destination', 'platform=iOS Simulator,name=iPhone 15 Pro',
      '-only-testing:GeneratedUITests'
    ])
  }

  /**
   * Complete iOS verification workflow
   */
  async verifyIOSChange(outputPath: string): Promise<ToolResult[]> {
    const results: ToolResult[] = []

    // 1. Build
    console.log('Step 1: Building iOS project...')
    const buildResult = await this.build()
    results.push(buildResult)

    if (buildResult.status !== 'success') {
      console.log('Build failed, stopping verification')
      return results
    }

    // 2. Boot simulator
    console.log('Step 2: Booting simulator...')
    const simResult = await this.bootSimulator()
    results.push(simResult)

    if (simResult.status !== 'success') {
      console.log('Simulator boot failed, stopping verification')
      return results
    }

    // 3. Take screenshot
    console.log('Step 3: Taking screenshot...')
    const screenshotResult = await this.screenshot(outputPath)
    results.push(screenshotResult)

    return results
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createToolExecutor(): ToolExecutor {
  return new ToolExecutor()
}

export function createIOSToolExecutor(): IOSToolExecutor {
  return new IOSToolExecutor()
}

// ============================================================================
// Exports
// ============================================================================

export { TOOL_CONFIGS }
