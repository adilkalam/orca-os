#!/usr/bin/env node
/**
 * Gate Runner CLI
 *
 * Provides command-line interface to run gate checks from hooks
 */

import { ContextProofGate } from './ContextProofGate.js';
import { BlueprintGate } from './BlueprintGate.js';
import { PatternViolationDetector } from './PatternViolationDetector.js';
import fs from 'fs-extra';

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  try {
    switch (command) {
      case 'context-proof':
        await runContextProof(args);
        break;

      case 'blueprint-check':
        await runBlueprintCheck(args);
        break;

      case 'pattern-check':
        await runPatternCheck(args);
        break;

      case 'tool-check':
        await runToolCheck(args);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.error('Usage: runner.js <context-proof|blueprint-check|pattern-check|tool-check> [args]');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function runContextProof(args: string[]) {
  if (args.length < 3) {
    console.error('Usage: context-proof <specialist> <response> <projectPath>');
    process.exit(1);
  }

  const [specialist, response, projectPath] = args;
  const gate = new ContextProofGate();

  const result = await gate.verify(specialist, response, projectPath);
  console.log(gate.formatResult(result));

  process.exit(result.gate_decision === 'ALLOW' ? 0 : 1);
}

async function runBlueprintCheck(args: string[]) {
  if (args.length < 1) {
    console.error('Usage: blueprint-check <projectPath>');
    process.exit(1);
  }

  const [projectPath] = args;
  const gate = new BlueprintGate();

  // Check blueprint completeness
  const verifyResult = await gate.verifyBlueprint(projectPath);

  if (verifyResult.blocked) {
    console.log(gate.formatResult(verifyResult));
    process.exit(1);
  }

  // Run auto-checks
  const checkResult = await gate.runAutoChecks(projectPath);
  console.log(gate.formatResult(checkResult));

  process.exit(checkResult.blocked ? 1 : 0);
}

async function runPatternCheck(args: string[]) {
  if (args.length < 1) {
    console.error('Usage: pattern-check <filePath>');
    process.exit(1);
  }

  const [filePath] = args;
  const detector = new PatternViolationDetector();

  const result = await detector.detectInFile(filePath);
  console.log(detector.formatDetailedReport(result));

  process.exit(result.shouldBlock ? 1 : 0);
}

async function runToolCheck(args: string[]) {
  if (args.length < 1) {
    console.error('Usage: tool-check <toolName>');
    process.exit(1);
  }

  const [toolName] = args;
  const gate = new BlueprintGate();

  // Load phase state
  const phaseStatePath = '.claude/orchestration/phase_state.json';
  let phase = 1;

  if (await fs.pathExists(phaseStatePath)) {
    const phaseState = await fs.readJson(phaseStatePath);
    phase = phaseState.current_phase || 1;
  }

  gate.setPhase(phase);

  const result = await gate.checkTool(toolName);
  console.log(gate.formatResult(result));

  process.exit(result.blocked ? 1 : 0);
}

main();
