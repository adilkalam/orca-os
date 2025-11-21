/**
 * FileRegistry - Centralized file management with enforcement and performance tracking
 *
 * All orchestration file operations MUST go through this registry.
 * Direct fs usage is blocked to ensure compliance with .claude-work/ structure.
 */

import * as fs from 'fs';
import * as path from 'path';

export enum TTL {
  PERMANENT = 'permanent',  // .claude-work/memory/ (never deleted)
  SESSION = '7d',           // .claude-work/sessions/ (deleted after 7 days)
  TEMP = '24h'              // .claude-work/temp/ (deleted after 24 hours)
}

interface PerformanceLog {
  operation: string;
  path: string;
  durationMs: number;
  timestamp: string;
}

export class FilePathViolation extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FilePathViolation';
  }
}

export class FileRegistry {
  private static ALLOWED_ROOTS = [
    '.claude-work/memory',
    '.claude-work/sessions',
    '.claude-work/temp',
    'src/',
    'docs/',
    'tests/',
    'agents/',
    'commands/',
    'hooks/'
  ];

  private static pathCache = new Map<string, boolean>();
  private static performanceLogs: PerformanceLog[] = [];
  private static enforcementEnabled = true;

  /**
   * Write a file with automatic categorization based on TTL
   */
  static write(relativePath: string, content: string | Buffer, ttl: TTL = TTL.PERMANENT): string {
    const startTime = performance.now();

    try {
      const normalized = this.normalizePath(relativePath);

      // Enforcement check
      if (this.enforcementEnabled && !this.isSourceCode(normalized)) {
        this.enforceClaudeWorkPath(normalized);
      }

      // Determine category and final path
      const category = this.inferCategory(ttl);
      const finalPath = this.buildFinalPath(normalized, category, ttl);

      // Ensure directory exists
      const dir = path.dirname(finalPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write file
      fs.writeFileSync(finalPath, content);

      // Track for cleanup
      if (ttl !== TTL.PERMANENT) {
        this.trackForCleanup(finalPath, ttl);
      }

      this.logPerformance('write', finalPath, startTime);
      return finalPath;

    } catch (error) {
      this.logPerformance('write_failed', relativePath, startTime);
      throw error;
    }
  }

  /**
   * Write evidence file (screenshots, logs, etc.)
   */
  static writeEvidence(filename: string, data: Buffer): string {
    const sessionDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const evidencePath = `evidence/${timestamp}_${filename}`;

    return this.write(evidencePath, data, TTL.SESSION);
  }

  /**
   * Write session artifact (audit reports, summaries)
   */
  static writeSessionArtifact(filename: string, content: string): string {
    return this.write(filename, content, TTL.SESSION);
  }

  /**
   * Write temporary file (build outputs, test results)
   */
  static writeTemp(filename: string, content: string): string {
    return this.write(filename, content, TTL.TEMP);
  }

  /**
   * Check if path is allowed without enforcement
   */
  private static isSourceCode(path: string): boolean {
    return ['src/', 'docs/', 'tests/', 'agents/', 'commands/', 'hooks/'].some(
      root => path.startsWith(root)
    );
  }

  /**
   * Enforce .claude-work/ path requirement
   */
  private static enforceClaudeWorkPath(path: string): void {
    if (!path.startsWith('.claude-work/')) {
      throw new FilePathViolation(
        `BLOCKED: Files must be in .claude-work/ or source directories\n` +
        `Attempted: ${path}\n` +
        `Allowed roots: ${this.ALLOWED_ROOTS.join(', ')}`
      );
    }
  }

  /**
   * Check if path is allowed (with caching)
   */
  private static isAllowed(path: string): boolean {
    if (this.pathCache.has(path)) {
      return this.pathCache.get(path)!;
    }

    const allowed = this.ALLOWED_ROOTS.some(root => path.startsWith(root));
    this.pathCache.set(path, allowed);
    return allowed;
  }

  /**
   * Normalize path (remove leading ./, resolve relative paths)
   */
  private static normalizePath(p: string): string {
    return p.replace(/^\.\//, '');
  }

  /**
   * Infer category directory based on TTL
   */
  private static inferCategory(ttl: TTL): string {
    switch (ttl) {
      case TTL.PERMANENT:
        return 'memory';
      case TTL.SESSION:
        return 'sessions';
      case TTL.TEMP:
        return 'temp';
    }
  }

  /**
   * Build final file path with category and date prefix for sessions
   */
  private static buildFinalPath(normalized: string, category: string, ttl: TTL): string {
    if (normalized.startsWith('.claude-work/')) {
      // Already has .claude-work prefix
      return normalized;
    }

    if (ttl === TTL.SESSION) {
      // Add date prefix for session files
      const sessionDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      return `.claude-work/${category}/${sessionDate}/${normalized}`;
    }

    return `.claude-work/${category}/${normalized}`;
  }

  /**
   * Track file for cleanup
   */
  private static trackForCleanup(path: string, ttl: TTL): void {
    const cleanupMetadata = {
      path,
      ttl,
      createdAt: new Date().toISOString()
    };

    // Append to cleanup tracking file
    const trackingFile = '.claude-work/memory/cleanup-tracking.jsonl';
    const line = JSON.stringify(cleanupMetadata) + '\n';

    fs.appendFileSync(trackingFile, line);
  }

  /**
   * Log performance metrics
   */
  private static logPerformance(operation: string, path: string, startTime: number): void {
    const durationMs = performance.now() - startTime;

    this.performanceLogs.push({
      operation,
      path,
      durationMs,
      timestamp: new Date().toISOString()
    });

    // Keep only last 1000 logs
    if (this.performanceLogs.length > 1000) {
      this.performanceLogs.shift();
    }

    // Log slow operations (>10ms)
    if (durationMs > 10) {
      console.warn(`[FileRegistry] Slow ${operation}: ${path} (${durationMs.toFixed(2)}ms)`);
    }
  }

  /**
   * Get performance statistics
   */
  static getPerformanceStats(): {
    totalOperations: number;
    avgDurationMs: number;
    maxDurationMs: number;
    slowOperations: PerformanceLog[];
  } {
    const durations = this.performanceLogs.map(log => log.durationMs);

    return {
      totalOperations: this.performanceLogs.length,
      avgDurationMs: durations.reduce((a, b) => a + b, 0) / durations.length || 0,
      maxDurationMs: Math.max(...durations, 0),
      slowOperations: this.performanceLogs.filter(log => log.durationMs > 10)
    };
  }

  /**
   * Flush performance logs to file
   */
  static flushPerformanceLogs(): void {
    const stats = this.getPerformanceStats();
    const logPath = '.claude-work/memory/performance-logs.json';

    fs.writeFileSync(logPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      stats,
      recentLogs: this.performanceLogs.slice(-100) // Last 100 operations
    }, null, 2));

    console.log(`[FileRegistry] Performance stats:`);
    console.log(`  Total operations: ${stats.totalOperations}`);
    console.log(`  Average duration: ${stats.avgDurationMs.toFixed(2)}ms`);
    console.log(`  Max duration: ${stats.maxDurationMs.toFixed(2)}ms`);
    console.log(`  Slow operations (>10ms): ${stats.slowOperations.length}`);
  }

  /**
   * Toggle enforcement (for debugging/migration)
   */
  static setEnforcement(enabled: boolean): void {
    this.enforcementEnabled = enabled;
    console.log(`[FileRegistry] Enforcement ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Check if enforcement is enabled
   */
  static isEnforcementEnabled(): boolean {
    return this.enforcementEnabled;
  }
}

// Export ONLY FileRegistry - do NOT export fs module
// This forces agents to use FileRegistry instead of direct fs operations
export default FileRegistry;
