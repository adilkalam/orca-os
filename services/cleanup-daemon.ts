/**
 * Cleanup Daemon - Automatic File Lifecycle Management (Layer 6)
 *
 * Automatically deletes expired files based on TTL:
 * - .claude-work/temp/      → 24 hours
 * - .claude-work/sessions/  → 7 days
 * - ~/.claude-global/archive/ → 3 months (monthly consolidation)
 *
 * Runs on:
 * - SessionEnd hook (lightweight check)
 * - Weekly cron (full cleanup + consolidation)
 *
 * Performance target: <2s for cleanup (async, user not waiting)
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { format, subDays, subMonths } from 'date-fns';

interface CleanupStats {
  filesDeleted: number;
  bytesFreed: number;
  durationMs: number;
  category: 'temp' | 'sessions' | 'archive';
}

interface CleanupMetadata {
  path: string;
  ttl: string;
  createdAt: string;
}

export class CleanupDaemon {
  private static performanceLog: CleanupStats[] = [];

  /**
   * Run cleanup on SessionEnd (lightweight)
   */
  static async runSessionEndCleanup(): Promise<void> {
    console.log('[CleanupDaemon] Running session-end cleanup...');

    const startTime = performance.now();

    try {
      // Only clean temp files on session end (quick)
      const tempStats = await this.cleanupExpiredFiles('.claude-work/temp', 24 * 60 * 60 * 1000);

      const durationMs = performance.now() - startTime;

      console.log(`[CleanupDaemon] Session-end cleanup complete:`);
      console.log(`  Temp files deleted: ${tempStats.filesDeleted}`);
      console.log(`  Bytes freed: ${this.formatBytes(tempStats.bytesFreed)}`);
      console.log(`  Duration: ${durationMs.toFixed(0)}ms`);

    } catch (error) {
      console.error('[CleanupDaemon] Session-end cleanup failed:', error);
    }
  }

  /**
   * Run full cleanup (weekly cron)
   */
  static async runFullCleanup(): Promise<void> {
    console.log('[CleanupDaemon] Running full cleanup...');

    const startTime = performance.now();

    try {
      // Clean temp files (24 hours)
      const tempStats = await this.cleanupExpiredFiles(
        '.claude-work/temp',
        24 * 60 * 60 * 1000
      );

      // Clean session files (7 days)
      const sessionStats = await this.cleanupExpiredFiles(
        '.claude-work/sessions',
        7 * 24 * 60 * 60 * 1000
      );

      // Consolidate and clean archives (3 months)
      const archiveStats = await this.cleanupGlobalArchives();

      const durationMs = performance.now() - startTime;

      console.log(`[CleanupDaemon] Full cleanup complete:`);
      console.log(`  Temp: ${tempStats.filesDeleted} files, ${this.formatBytes(tempStats.bytesFreed)}`);
      console.log(`  Sessions: ${sessionStats.filesDeleted} files, ${this.formatBytes(sessionStats.bytesFreed)}`);
      console.log(`  Archives: ${archiveStats.filesDeleted} files, ${this.formatBytes(archiveStats.bytesFreed)}`);
      console.log(`  Total duration: ${durationMs.toFixed(0)}ms`);

      // Write summary
      this.writeCleanupSummary({
        temp: tempStats,
        sessions: sessionStats,
        archives: archiveStats,
        totalDurationMs: durationMs
      });

    } catch (error) {
      console.error('[CleanupDaemon] Full cleanup failed:', error);
    }
  }

  /**
   * Clean up expired files in a directory
   */
  private static async cleanupExpiredFiles(
    directory: string,
    maxAgeMs: number
  ): Promise<CleanupStats> {
    const startTime = performance.now();

    let filesDeleted = 0;
    let bytesFreed = 0;

    try {
      if (!fs.existsSync(directory)) {
        return {
          filesDeleted: 0,
          bytesFreed: 0,
          durationMs: performance.now() - startTime,
          category: this.inferCategory(directory)
        };
      }

      const now = Date.now();
      const entries = fs.readdirSync(directory, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        try {
          const stats = fs.statSync(fullPath);
          const age = now - stats.mtimeMs;

          if (age > maxAgeMs) {
            // Calculate size before deletion
            if (entry.isDirectory()) {
              bytesFreed += this.getDirectorySize(fullPath);
              fs.rmSync(fullPath, { recursive: true, force: true });
            } else {
              bytesFreed += stats.size;
              fs.unlinkSync(fullPath);
            }

            filesDeleted++;
          }
        } catch (err) {
          console.warn(`[CleanupDaemon] Failed to delete ${fullPath}:`, err);
        }
      }

      const durationMs = performance.now() - startTime;

      return {
        filesDeleted,
        bytesFreed,
        durationMs,
        category: this.inferCategory(directory)
      };

    } catch (error) {
      console.error(`[CleanupDaemon] Error cleaning ${directory}:`, error);
      return {
        filesDeleted: 0,
        bytesFreed: 0,
        durationMs: performance.now() - startTime,
        category: this.inferCategory(directory)
      };
    }
  }

  /**
   * Consolidate and clean global archives
   */
  private static async cleanupGlobalArchives(): Promise<CleanupStats> {
    const startTime = performance.now();

    let filesDeleted = 0;
    let bytesFreed = 0;

    try {
      const archiveDir = path.join(process.env.HOME!, '.claude-global/archive');

      if (!fs.existsSync(archiveDir)) {
        return {
          filesDeleted: 0,
          bytesFreed: 0,
          durationMs: performance.now() - startTime,
          category: 'archive'
        };
      }

      // Step 1: Consolidate daily folders into monthly
      await this.consolidateArchivesByMonth(archiveDir);

      // Step 2: Delete archives older than 3 months
      const threeMonthsAgo = subMonths(new Date(), 3);
      const cutoffMonth = format(threeMonthsAgo, 'yyyy-MM');

      const monthlyDirs = fs.readdirSync(archiveDir, { withFileTypes: true })
        .filter(d => d.isDirectory() && /^\d{4}-\d{2}$/.test(d.name));

      for (const dir of monthlyDirs) {
        if (dir.name < cutoffMonth) {
          const fullPath = path.join(archiveDir, dir.name);
          bytesFreed += this.getDirectorySize(fullPath);
          fs.rmSync(fullPath, { recursive: true, force: true });
          filesDeleted++;
          console.log(`[CleanupDaemon] Deleted old archive: ${dir.name}`);
        }
      }

      const durationMs = performance.now() - startTime;

      return {
        filesDeleted,
        bytesFreed,
        durationMs,
        category: 'archive'
      };

    } catch (error) {
      console.error('[CleanupDaemon] Archive cleanup failed:', error);
      return {
        filesDeleted: 0,
        bytesFreed: 0,
        durationMs: performance.now() - startTime,
        category: 'archive'
      };
    }
  }

  /**
   * Consolidate daily archive folders into monthly folders
   */
  private static async consolidateArchivesByMonth(archiveDir: string): Promise<void> {
    // Find all daily folders (debug-20251026-153802, etc.)
    const dailyFolders = fs.readdirSync(archiveDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && /\d{8}/.test(d.name));

    // Group by month
    const byMonth = new Map<string, string[]>();

    for (const folder of dailyFolders) {
      const match = folder.name.match(/(\d{4})(\d{2})\d{2}/);
      if (match) {
        const month = `${match[1]}-${match[2]}`; // YYYY-MM
        if (!byMonth.has(month)) {
          byMonth.set(month, []);
        }
        byMonth.get(month)!.push(folder.name);
      }
    }

    // Consolidate each month
    for (const [month, folders] of byMonth.entries()) {
      const monthDir = path.join(archiveDir, month);

      // Create monthly directory if needed
      if (!fs.existsSync(monthDir)) {
        fs.mkdirSync(monthDir, { recursive: true });
      }

      // Move daily folders into monthly folder
      for (const folder of folders) {
        const srcPath = path.join(archiveDir, folder);
        const destPath = path.join(monthDir, folder);

        try {
          fs.renameSync(srcPath, destPath);
        } catch (err) {
          console.warn(`[CleanupDaemon] Failed to consolidate ${folder}:`, err);
        }
      }

      console.log(`[CleanupDaemon] Consolidated ${folders.length} folders into ${month}/`);
    }
  }

  /**
   * Get total size of directory
   */
  private static getDirectorySize(dirPath: string): number {
    let totalSize = 0;

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          totalSize += this.getDirectorySize(fullPath);
        } else {
          const stats = fs.statSync(fullPath);
          totalSize += stats.size;
        }
      }
    } catch (err) {
      // Ignore errors (permissions, etc.)
    }

    return totalSize;
  }

  /**
   * Infer category from directory path
   */
  private static inferCategory(directory: string): 'temp' | 'sessions' | 'archive' {
    if (directory.includes('temp')) return 'temp';
    if (directory.includes('sessions')) return 'sessions';
    return 'archive';
  }

  /**
   * Format bytes to human-readable
   */
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  /**
   * Write cleanup summary to file
   */
  private static writeCleanupSummary(summary: {
    temp: CleanupStats;
    sessions: CleanupStats;
    archives: CleanupStats;
    totalDurationMs: number;
  }): void {
    const summaryPath = '.claude-work/memory/cleanup-summary.json';

    try {
      fs.writeFileSync(
        summaryPath,
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            summary,
            totalFilesDeleted: summary.temp.filesDeleted + summary.sessions.filesDeleted + summary.archives.filesDeleted,
            totalBytesFreed: summary.temp.bytesFreed + summary.sessions.bytesFreed + summary.archives.bytesFreed,
            totalDurationMs: summary.totalDurationMs
          },
          null,
          2
        )
      );
    } catch (error) {
      console.error('[CleanupDaemon] Failed to write summary:', error);
    }
  }

  /**
   * Schedule cleanup (for use in long-running processes)
   */
  static scheduleCleanup(): void {
    // Run on SessionEnd (lightweight)
    process.on('beforeExit', () => {
      this.runSessionEndCleanup();
    });

    // Weekly full cleanup (if using cron or scheduler)
    // This would typically be configured externally
    console.log('[CleanupDaemon] Cleanup scheduled');
    console.log('  - Session end: Temp files only');
    console.log('  - Weekly: Full cleanup + archive consolidation');
  }
}

export default CleanupDaemon;
