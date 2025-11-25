/**
 * Workshop Client
 *
 * Wraps Workshop CLI for reading/writing session memory.
 * Workshop handles: decisions, gotchas, learnings, task history
 *
 * This keeps vibe.db focused on code context only (chunks, components, embeddings)
 */

import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import type { Decision, Standard, TaskHistory } from './types.js';

const execAsync = promisify(exec);

export class WorkshopClient {
  private workspacePath: string;

  constructor(projectPath: string) {
    // Workshop uses .claude/memory as workspace
    this.workspacePath = `${projectPath}/.claude/memory`;
  }

  /**
   * Execute workshop command
   */
  private async runWorkshop(args: string): Promise<string> {
    try {
      const cmd = `workshop --workspace "${this.workspacePath}" ${args}`;
      const { stdout, stderr } = await execAsync(cmd, {
        encoding: 'utf8',
        timeout: 10000,
      });
      if (stderr) {
        console.error(`Workshop stderr: ${stderr}`);
      }
      return stdout.trim();
    } catch (error: any) {
      console.error(`Workshop error: ${error.message}`);
      return '';
    }
  }

  /**
   * Save a decision to Workshop
   */
  async saveDecision(decision: {
    domain: string;
    decision: string;
    reasoning: string;
    context?: string;
    tags?: string[];
  }): Promise<void> {
    const tagsArg = decision.tags?.map((t) => `-t "${t}"`).join(' ') || '';
    const decisionText = `[${decision.domain}] ${decision.decision}`;

    await this.runWorkshop(
      `decision "${decisionText}" -r "${decision.reasoning}" ${tagsArg}`
    );
  }

  /**
   * Save a gotcha (standard/rule) to Workshop
   */
  async saveGotcha(standard: {
    what_happened: string;
    cost: string;
    rule: string;
    domain: string;
  }): Promise<void> {
    const gotchaText = `[${standard.domain}] ${standard.rule} (Cost: ${standard.cost}. Cause: ${standard.what_happened})`;

    await this.runWorkshop(`gotcha "${gotchaText}" -t "${standard.domain}"`);
  }

  /**
   * Save task history as a note
   */
  async saveTaskHistory(task: {
    domain: string;
    task: string;
    outcome: string;
    learnings?: string;
    files_modified?: string[];
  }): Promise<void> {
    const filesStr = task.files_modified?.join(', ') || 'none';
    const noteText = `[${task.domain}] Task: ${task.task} | Outcome: ${task.outcome} | Files: ${filesStr}`;

    await this.runWorkshop(`note "${noteText}"`);

    // Save learnings separately if present
    if (task.learnings) {
      await this.runWorkshop(
        `note "[${task.domain}] Learning: ${task.learnings}"`
      );
    }
  }

  /**
   * Query decisions from Workshop using 'why' command
   */
  async queryDecisions(query: string, limit = 10): Promise<Decision[]> {
    const output = await this.runWorkshop(`why "${query}" --json`);

    if (!output) return [];

    try {
      const results = JSON.parse(output);
      // Transform Workshop results to Decision format
      return results
        .filter((r: any) => r.type === 'decision')
        .slice(0, limit)
        .map((r: any, i: number) => ({
          id: `workshop_${i}`,
          timestamp: new Date(r.timestamp || Date.now()),
          domain: this.extractDomain(r.content),
          decision: r.content,
          reasoning: r.reasoning || '',
          context: r.context,
          tags: r.tags,
        }));
    } catch {
      // Fallback: parse text output
      return this.parseTextDecisions(output, limit);
    }
  }

  /**
   * Query standards/gotchas from Workshop
   */
  async queryStandards(domain: string): Promise<Standard[]> {
    const output = await this.runWorkshop(`search "gotcha ${domain}" --json`);

    if (!output) return [];

    try {
      const results = JSON.parse(output);
      return results
        .filter((r: any) => r.type === 'gotcha')
        .map((r: any, i: number) => ({
          id: `workshop_gotcha_${i}`,
          what_happened: r.content,
          cost: 'See content',
          rule: r.content,
          domain: domain,
          created: new Date(r.timestamp || Date.now()),
          enforced_count: 0,
        }));
    } catch {
      return [];
    }
  }

  /**
   * Query task history from Workshop
   */
  async queryTaskHistory(query: string, limit = 10): Promise<TaskHistory[]> {
    const output = await this.runWorkshop(`search "Task: ${query}" --json`);

    if (!output) return [];

    try {
      const results = JSON.parse(output);
      return results.slice(0, limit).map((r: any, i: number) => ({
        id: `workshop_task_${i}`,
        timestamp: new Date(r.timestamp || Date.now()),
        domain: this.extractDomain(r.content),
        task: r.content,
        outcome: 'success' as const,
        learnings: r.reasoning,
        files_modified: undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get recent context from Workshop
   */
  async getRecentContext(): Promise<string> {
    return await this.runWorkshop('context');
  }

  /**
   * Extract domain from content like "[nextjs] ..."
   */
  private extractDomain(content: string): string {
    const match = content.match(/^\[([^\]]+)\]/);
    return match ? match[1] : 'general';
  }

  /**
   * Parse text output when JSON not available
   */
  private parseTextDecisions(output: string, limit: number): Decision[] {
    const lines = output.split('\n').filter((l) => l.trim());
    return lines.slice(0, limit).map((line, i) => ({
      id: `text_${i}`,
      timestamp: new Date(),
      domain: this.extractDomain(line),
      decision: line,
      reasoning: '',
    }));
  }
}
