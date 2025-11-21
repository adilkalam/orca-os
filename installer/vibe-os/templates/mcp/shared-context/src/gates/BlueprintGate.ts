/**
 * Blueprint Gate
 *
 * Enforces blueprint-first workflow:
 * - Phase 1: Blueprint only (code tools forbidden)
 * - Phase 2: Implementation (allowed after blueprint approved)
 *
 * Prevents generic code by requiring detailed specification first.
 */

import fs from 'fs-extra';
import path from 'path';

interface BlueprintSchema {
  phases: {
    phase_1_blueprint: PhaseConfig;
    phase_2_implementation: PhaseConfig;
  };
  enforcement: {
    tool_intercept: ToolIntercept;
    file_location_guard: FileLocationGuard;
  };
}

interface PhaseConfig {
  name: string;
  allowed_tools: string[];
  forbidden_tools: string[];
  required_outputs?: RequiredOutputs;
  approval_required?: boolean;
  approval_criteria?: ApprovalCriteria;
}

interface RequiredOutputs {
  [key: string]: {
    file: string;
    required_sections: string[];
    must_include: string[];
  };
}

interface ApprovalCriteria {
  user_must_confirm: string;
  auto_checks: AutoCheck[];
}

interface AutoCheck {
  check: string;
  pattern?: string;
  forbidden_phrases?: string[];
  min_count?: number;
  message: string;
}

interface ToolIntercept {
  description: string;
  implementation: string;
  behavior: {
    [key: string]: {
      action: 'BLOCK' | 'WARN' | 'ALLOW';
      message: string;
      awareness_tag?: string;
      suggest?: string;
    };
  };
}

interface FileLocationGuard {
  phase_1: {
    allowed_paths: string[];
    forbidden_paths: string[];
    message: string;
  };
  phase_2: {
    allowed_paths: string[];
    reference_required: string;
    message: string;
  };
}

interface GateResult {
  blocked: boolean;
  action: 'BLOCK' | 'WARN' | 'ALLOW';
  message: string;
  awareness_tag?: string;
  suggest?: string;
}

export class BlueprintGate {
  private schemaPath: string;
  private schema?: BlueprintSchema;
  private currentPhase: number = 1;
  private blueprintApproved: boolean = false;

  constructor(schemaPath: string = 'schemas/blueprint-gate-schema.json') {
    this.schemaPath = schemaPath;
  }

  /**
   * Load blueprint gate schema
   */
  async loadSchema(): Promise<void> {
    const fullPath = path.resolve(this.schemaPath);
    if (!await fs.pathExists(fullPath)) {
      throw new Error(`Blueprint gate schema not found: ${fullPath}`);
    }
    this.schema = await fs.readJson(fullPath);
  }

  /**
   * Set current phase
   */
  setPhase(phase: number): void {
    this.currentPhase = phase;
  }

  /**
   * Mark blueprint as approved
   */
  approveBlueprint(): void {
    this.blueprintApproved = true;
    this.currentPhase = 2;
  }

  /**
   * Check if tool is allowed in current phase
   */
  async checkTool(toolName: string): Promise<GateResult> {
    if (!this.schema) {
      await this.loadSchema();
    }

    const phaseKey = this.currentPhase === 1 ? 'phase_1_blueprint' : 'phase_2_implementation';
    const phaseConfig = this.schema!.phases[phaseKey];

    // Check if tool is explicitly forbidden
    if (phaseConfig.forbidden_tools.includes(toolName)) {
      const behavior = this.schema!.enforcement.tool_intercept.behavior.phase_1_code_attempt;
      return { blocked: true, ...behavior };
    }

    // Check if tool is allowed
    if (phaseConfig.allowed_tools.includes(toolName) || phaseConfig.allowed_tools.includes('*')) {
      return {
        blocked: false,
        action: 'ALLOW',
        message: `Tool ${toolName} allowed in Phase ${this.currentPhase}`
      };
    }

    // Tool not in either list - default to block in Phase 1, allow in Phase 2
    if (this.currentPhase === 1) {
      return { blocked: true, ...this.schema!.enforcement.tool_intercept.behavior.phase_1_code_attempt };
    }

    return {
      blocked: false,
      action: 'ALLOW',
      message: `Tool ${toolName} allowed in Phase ${this.currentPhase}`
    };
  }

  /**
   * Check if file path is allowed in current phase
   */
  async checkFilePath(filePath: string): Promise<GateResult> {
    if (!this.schema) {
      await this.loadSchema();
    }

    const guard = this.schema!.enforcement.file_location_guard;

    if (this.currentPhase === 1) {
      // Phase 1: Only blueprint paths allowed
      const allowed = guard.phase_1.allowed_paths.some(p => filePath.startsWith(p));
      const forbidden = guard.phase_1.forbidden_paths.some(p => filePath.startsWith(p));

      if (forbidden) {
        return {
          blocked: true,
          action: 'BLOCK',
          message: guard.phase_1.message,
          awareness_tag: '#POISON_PATH: Trying to write code in Phase 1',
          suggest: `Move file to ${guard.phase_1.allowed_paths[0]}`
        };
      }

      if (!allowed) {
        return {
          blocked: true,
          action: 'BLOCK',
          message: `File must be in allowed path: ${guard.phase_1.allowed_paths.join(' or ')}`,
          suggest: `Create file in ${guard.phase_1.allowed_paths[0]}`
        };
      }

      return {
        blocked: false,
        action: 'ALLOW',
        message: 'File path allowed in Phase 1'
      };
    } else {
      // Phase 2: Implementation paths allowed
      const allowed = guard.phase_2.allowed_paths.some(p => filePath.startsWith(p));

      if (!allowed) {
        return {
          blocked: false,
          action: 'WARN',
          message: `File outside standard paths: ${guard.phase_2.allowed_paths.join(', ')}`,
          suggest: 'Verify file location is intentional'
        };
      }

      return {
        blocked: false,
        action: 'ALLOW',
        message: 'File path allowed in Phase 2'
      };
    }
  }

  /**
   * Verify blueprint completeness
   */
  async verifyBlueprint(projectPath: string): Promise<GateResult> {
    if (!this.schema) {
      await this.loadSchema();
    }

    const phase1 = this.schema!.phases.phase_1_blueprint;
    if (!phase1.required_outputs) {
      return {
        blocked: false,
        action: 'ALLOW',
        message: 'No required outputs specified'
      };
    }

    const missing: string[] = [];
    const incomplete: string[] = [];

    for (const [outputName, config] of Object.entries(phase1.required_outputs)) {
      const filePath = path.join(projectPath, config.file);

      // Check file exists
      if (!await fs.pathExists(filePath)) {
        missing.push(config.file);
        continue;
      }

      // Check required sections
      const content = await fs.readFile(filePath, 'utf-8');

      for (const section of config.required_sections) {
        if (!content.includes(section)) {
          incomplete.push(`${config.file} missing section: ${section}`);
        }
      }

      // Check must-include items
      for (const mustInclude of config.must_include) {
        if (!content.includes(mustInclude) && !this.checkPattern(content, mustInclude)) {
          incomplete.push(`${config.file} missing: ${mustInclude}`);
        }
      }
    }

    if (missing.length > 0) {
      return {
        blocked: true,
        action: 'BLOCK',
        message: `Blueprint incomplete. Missing files: ${missing.join(', ')}`,
        awareness_tag: '#COMPLETION_DRIVE: Blueprint files missing',
        suggest: 'Create all required blueprint files'
      };
    }

    if (incomplete.length > 0) {
      return {
        blocked: true,
        action: 'BLOCK',
        message: `Blueprint incomplete:\n${incomplete.join('\n')}`,
        awareness_tag: '#COMPLETION_DRIVE: Blueprint missing required content',
        suggest: 'Complete all required sections and details'
      };
    }

    return {
      blocked: false,
      action: 'ALLOW',
      message: '✅ Blueprint complete and ready for approval'
    };
  }

  /**
   * Run auto-checks on blueprint
   */
  async runAutoChecks(projectPath: string): Promise<GateResult> {
    if (!this.schema) {
      await this.loadSchema();
    }

    const phase1 = this.schema!.phases.phase_1_blueprint;
    if (!phase1.approval_criteria) {
      return {
        blocked: false,
        action: 'ALLOW',
        message: 'No auto-checks configured'
      };
    }

    const failures: string[] = [];

    // Read all blueprint files
    const blueprintFiles = await this.findBlueprintFiles(projectPath);
    const allContent = (await Promise.all(
      blueprintFiles.map((f: string) => fs.readFile(f, 'utf-8'))
    )).join('\n');

    for (const check of phase1.approval_criteria.auto_checks) {
      if (check.pattern) {
        const regex = new RegExp(check.pattern, 'g');
        const matches = allContent.match(regex) || [];

        if (check.min_count && matches.length < check.min_count) {
          failures.push(`${check.message} (found ${matches.length}, need ${check.min_count})`);
        }
      }

      if (check.forbidden_phrases) {
        const found = check.forbidden_phrases.filter(phrase =>
          allContent.toLowerCase().includes(phrase.toLowerCase())
        );

        if (found.length > 0) {
          failures.push(`${check.message}: Found forbidden phrases: ${found.join(', ')}`);
        }
      }
    }

    if (failures.length > 0) {
      return {
        blocked: true,
        action: 'BLOCK',
        message: `Blueprint auto-checks failed:\n${failures.join('\n')}`,
        awareness_tag: '#COMPLETION_DRIVE: Blueprint quality checks failed',
        suggest: 'Fix blueprint to meet quality standards'
      };
    }

    return {
      blocked: false,
      action: 'ALLOW',
      message: '✅ All auto-checks passed'
    };
  }

  /**
   * Find blueprint files
   */
  private async findBlueprintFiles(projectPath: string): Promise<string[]> {
    const blueprintDir = path.join(projectPath, '00-blueprint');
    if (!await fs.pathExists(blueprintDir)) {
      return [];
    }

    const files = await fs.readdir(blueprintDir);
    return files
      .filter((f: string) => f.endsWith('.md'))
      .map((f: string) => path.join(blueprintDir, f));
  }

  /**
   * Check if content matches pattern
   */
  private checkPattern(content: string, pattern: string): boolean {
    try {
      const regex = new RegExp(pattern, 'i');
      return regex.test(content);
    } catch {
      return false;
    }
  }

  /**
   * Format gate result for display
   */
  formatResult(result: GateResult): string {
    const icon = result.action === 'ALLOW' ? '✅' : result.action === 'WARN' ? '⚠️' : '🚫';
    let output = `${icon} ${result.message}`;

    if (result.awareness_tag) {
      output += `\n\n${result.awareness_tag}`;
    }

    if (result.suggest) {
      output += `\n\n💡 Suggestion: ${result.suggest}`;
    }

    return output;
  }
}
