/**
 * Orchestrator Firewall - Agent-Level File Path Enforcement (Layer 3)
 *
 * Scans agent prompts before dispatch to detect and block file path violations.
 * This catches violations at the orchestration layer, before agents even execute.
 *
 * Performance target: <10ms per agent dispatch
 */

import * as fs from 'fs';

interface ValidationResult {
  blocked: boolean;
  reason?: string;
  suggestion?: string;
  violationPattern?: RegExp;
}

interface PerformanceMetrics {
  validationCount: number;
  blockedCount: number;
  averageDurationMs: number;
  slowValidations: number; // >10ms
}

export class FirewallViolation extends Error {
  constructor(message: string, public suggestion?: string) {
    super(message);
    this.name = 'FirewallViolation';
  }
}

export class OrchestratorFirewall {
  private static performanceLog: Array<{
    timestamp: string;
    durationMs: number;
    blocked: boolean;
    pattern?: string;
  }> = [];

  // Forbidden file operation patterns
  private static FORBIDDEN_PATTERNS = [
    {
      pattern: /fs\.writeFileSync\s*\(\s*['"]\.orchestration/,
      reason: 'Direct fs.writeFileSync to .orchestration/ is forbidden',
      suggestion: 'Use FileRegistry.write() instead'
    },
    {
      pattern: /fs\.writeFileSync\s*\(\s*['"]\.workshop/,
      reason: 'Direct fs.writeFileSync to .workshop/ is forbidden',
      suggestion: 'Use FileRegistry.write() for Workshop data'
    },
    {
      pattern: /fs\.writeFileSync\s*\(\s*['"]\.secret/,
      reason: 'Direct fs.writeFileSync to .secret/ is forbidden',
      suggestion: 'Use FileRegistry.write() with proper TTL'
    },
    {
      pattern: /Write tool.*\.orchestration/i,
      reason: 'Write tool targeting .orchestration/ directory',
      suggestion: 'Use .claude-work/sessions/ or .claude-work/memory/'
    },
    {
      pattern: /Write tool.*\.workshop/i,
      reason: 'Write tool targeting .workshop/ directory',
      suggestion: 'Use .claude-work/memory/workshop.db'
    },
    {
      pattern: /mkdir\s+['"]?\.[a-z]/,
      reason: 'Creating hidden directory (likely old structure)',
      suggestion: 'Use .claude-work/memory/, sessions/, or temp/'
    },
    {
      pattern: /\.appendFileSync\s*\(\s*['"](?!\.claude-work)/,
      reason: 'Appending to file outside .claude-work/',
      suggestion: 'Use FileRegistry for log files'
    }
  ];

  /**
   * Validate agent prompt for file path violations
   */
  static validateAgentPrompt(prompt: string): ValidationResult {
    const startTime = performance.now();

    try {
      for (const { pattern, reason, suggestion } of this.FORBIDDEN_PATTERNS) {
        if (pattern.test(prompt)) {
          const durationMs = performance.now() - startTime;
          this.logPerformance(durationMs, true, pattern.source);

          return {
            blocked: true,
            reason,
            suggestion,
            violationPattern: pattern
          };
        }
      }

      const durationMs = performance.now() - startTime;
      this.logPerformance(durationMs, false);

      return { blocked: false };

    } catch (error) {
      // Don't block on firewall errors - fail open
      console.error('[Firewall] Validation error:', error);
      return { blocked: false };
    }
  }

  /**
   * Wrap agent with firewall protection
   */
  static wrapAgent<T extends { execute: (task: any) => Promise<any> }>(
    agent: T
  ): T {
    const originalExecute = agent.execute.bind(agent);

    return {
      ...agent,
      execute: async (task: any) => {
        const startTime = performance.now();

        // Validate task prompt
        const validation = this.validateAgentPrompt(
          task.prompt || JSON.stringify(task)
        );

        if (validation.blocked) {
          const durationMs = performance.now() - startTime;

          console.error(`\n🛡️  Orchestrator Firewall blocked agent execution`);
          console.error(`   Layer: Orchestrator Firewall (Layer 3/6)`);
          console.error(`   Reason: ${validation.reason}`);
          console.error(`   Suggestion: ${validation.suggestion}`);
          console.error(`   Duration: ${durationMs.toFixed(2)}ms\n`);

          throw new FirewallViolation(
            validation.reason!,
            validation.suggestion
          );
        }

        // Execute agent
        return originalExecute(task);
      }
    };
  }

  /**
   * Wrap multiple agents in parallel
   */
  static wrapAgents<T extends { execute: (task: any) => Promise<any> }>(
    agents: T[]
  ): T[] {
    return agents.map(agent => this.wrapAgent(agent));
  }

  /**
   * Log performance metrics
   */
  private static logPerformance(
    durationMs: number,
    blocked: boolean,
    pattern?: string
  ): void {
    this.performanceLog.push({
      timestamp: new Date().toISOString(),
      durationMs,
      blocked,
      pattern
    });

    // Keep only last 1000 entries
    if (this.performanceLog.length > 1000) {
      this.performanceLog.shift();
    }

    // Warn if slow
    if (durationMs > 10) {
      console.warn(
        `[Firewall] Slow validation: ${durationMs.toFixed(2)}ms ` +
        `(pattern: ${pattern?.substring(0, 50)})`
      );
    }
  }

  /**
   * Get performance statistics
   */
  static getPerformanceMetrics(): PerformanceMetrics {
    const logs = this.performanceLog;

    if (logs.length === 0) {
      return {
        validationCount: 0,
        blockedCount: 0,
        averageDurationMs: 0,
        slowValidations: 0
      };
    }

    const durations = logs.map(l => l.durationMs);
    const totalDuration = durations.reduce((a, b) => a + b, 0);

    return {
      validationCount: logs.length,
      blockedCount: logs.filter(l => l.blocked).length,
      averageDurationMs: totalDuration / logs.length,
      slowValidations: logs.filter(l => l.durationMs > 10).length
    };
  }

  /**
   * Flush performance metrics to file
   */
  static flushMetrics(): void {
    const metrics = this.getPerformanceMetrics();
    const logPath = '.claude-work/memory/firewall-performance.json';

    try {
      fs.writeFileSync(
        logPath,
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            metrics,
            recentLogs: this.performanceLog.slice(-100)
          },
          null,
          2
        )
      );

      console.log('[Firewall] Performance metrics:');
      console.log(`  Validations: ${metrics.validationCount}`);
      console.log(`  Blocked: ${metrics.blockedCount}`);
      console.log(`  Average duration: ${metrics.averageDurationMs.toFixed(2)}ms`);
      console.log(`  Slow validations (>10ms): ${metrics.slowValidations}`);
    } catch (error) {
      console.error('[Firewall] Failed to flush metrics:', error);
    }
  }

  /**
   * Clear performance logs
   */
  static clearLogs(): void {
    this.performanceLog = [];
  }
}

export default OrchestratorFirewall;
