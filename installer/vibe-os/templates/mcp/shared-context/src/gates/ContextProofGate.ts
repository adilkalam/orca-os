/**
 * Context Proof Gate
 *
 * Enforces that agents must prove they read and understood project context
 * before being allowed to work. Prevents "I used the design system" when they clearly didn't.
 */

import fs from 'fs-extra';
import path from 'path';

interface ConceptVerification {
  concept: string;
  question: string;
  expected_keywords?: string[];
  expected_values?: string[];
  expected_source?: string;
  min_accuracy: number;
}

interface ProofRequirement {
  required_artifacts: string[];
  must_articulate: ConceptVerification[];
  verification_method: 'extract_and_compare';
}

interface ContextProofSchema {
  proof_requirements: {
    [specialist: string]: ProofRequirement;
  };
}

interface AgentUnderstanding {
  [concept: string]: string;
}

interface VerificationFailure {
  concept: string;
  agent_said: string;
  actual: string;
  reason: string;
}

interface ProofResult {
  status: 'verified' | 'failed';
  accuracy: number;
  agent_understanding: AgentUnderstanding;
  verification_details: {
    concepts_verified: number;
    concepts_total: number;
    min_accuracy_met: boolean;
    failures?: VerificationFailure[];
  };
  gate_decision: 'ALLOW' | 'BLOCK';
  awareness_tag?: string;
}

export class ContextProofGate {
  private schemaPath: string;
  private schema?: ContextProofSchema;

  constructor(schemaPath: string = 'schemas/context-proof-schema.json') {
    this.schemaPath = schemaPath;
  }

  /**
   * Load context proof schema
   */
  async loadSchema(): Promise<void> {
    const fullPath = path.resolve(this.schemaPath);
    if (!await fs.pathExists(fullPath)) {
      throw new Error(`Context proof schema not found: ${fullPath}`);
    }
    this.schema = await fs.readJson(fullPath);
  }

  /**
   * Verify agent's understanding of project context
   */
  async verify(
    specialist: string,
    agentResponse: string,
    projectPath: string
  ): Promise<ProofResult> {
    if (!this.schema) {
      await this.loadSchema();
    }

    const requirements = this.schema!.proof_requirements[specialist];
    if (!requirements) {
      // Unknown specialist - allow by default
      return {
        status: 'verified',
        accuracy: 1.0,
        agent_understanding: {},
        verification_details: {
          concepts_verified: 0,
          concepts_total: 0,
          min_accuracy_met: true
        },
        gate_decision: 'ALLOW'
      };
    }

    // Check if required artifacts exist
    const missingArtifacts = await this.checkArtifacts(requirements.required_artifacts, projectPath);
    if (missingArtifacts.length > 0) {
      return {
        status: 'failed',
        accuracy: 0,
        agent_understanding: {},
        verification_details: {
          concepts_verified: 0,
          concepts_total: requirements.must_articulate.length,
          min_accuracy_met: false,
          failures: missingArtifacts.map(artifact => ({
            concept: 'artifact_check',
            agent_said: '',
            actual: artifact,
            reason: `Required artifact not found: ${artifact}`
          }))
        },
        gate_decision: 'BLOCK',
        awareness_tag: `#COMPLETION_DRIVE: Missing required artifacts: ${missingArtifacts.join(', ')}`
      };
    }

    // Extract agent's understanding from response
    const agentUnderstanding = this.extractUnderstanding(agentResponse, requirements.must_articulate);

    // Verify each concept
    const verifications = await Promise.all(
      requirements.must_articulate.map(concept =>
        this.verifyConcept(concept, agentUnderstanding[concept.concept], projectPath)
      )
    );

    const failures = verifications.filter(v => !v.verified && v.failure).map(v => v.failure!);
    const successCount = verifications.filter(v => v.verified).length;
    const accuracy = successCount / verifications.length;
    const overallMinAccuracy = Math.min(...requirements.must_articulate.map(c => c.min_accuracy));

    const passed = accuracy >= overallMinAccuracy;

    return {
      status: passed ? 'verified' : 'failed',
      accuracy,
      agent_understanding: agentUnderstanding,
      verification_details: {
        concepts_verified: successCount,
        concepts_total: verifications.length,
        min_accuracy_met: passed,
        failures: passed ? undefined : failures
      },
      gate_decision: passed ? 'ALLOW' : 'BLOCK',
      awareness_tag: passed ? undefined : '#COMPLETION_DRIVE: Agent claimed understanding but verification failed'
    };
  }

  /**
   * Check if required artifacts exist
   */
  private async checkArtifacts(artifacts: string[], projectPath: string): Promise<string[]> {
    const missing: string[] = [];

    for (const artifact of artifacts) {
      // Handle wildcards (e.g., *.xcodeproj)
      if (artifact.includes('*')) {
        const pattern = artifact.replace(/\*/g, '.*');
        const regex = new RegExp(pattern);
        const files = await this.findFiles(projectPath, regex);
        if (files.length === 0) {
          missing.push(artifact);
        }
      } else {
        const fullPath = path.join(projectPath, artifact);
        if (!await fs.pathExists(fullPath)) {
          missing.push(artifact);
        }
      }
    }

    return missing;
  }

  /**
   * Find files matching pattern
   */
  private async findFiles(dir: string, pattern: RegExp, depth: number = 3): Promise<string[]> {
    const results: string[] = [];

    if (depth <= 0) return results;

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          const subResults = await this.findFiles(fullPath, pattern, depth - 1);
          results.push(...subResults);
        } else if (pattern.test(entry.name)) {
          results.push(fullPath);
        }
      }
    } catch (error) {
      // Directory not accessible
    }

    return results;
  }

  /**
   * Extract agent's understanding from response
   */
  private extractUnderstanding(
    response: string,
    concepts: ConceptVerification[]
  ): AgentUnderstanding {
    const understanding: AgentUnderstanding = {};

    for (const concept of concepts) {
      // Look for agent's answer to the concept question
      const pattern = new RegExp(
        `${concept.concept}[:\\s]+([^\\n]{10,200})`,
        'i'
      );

      const match = response.match(pattern);
      if (match) {
        understanding[concept.concept] = match[1].trim();
      } else {
        // Try to find any mention of expected keywords
        const keywords = concept.expected_keywords || [];
        const found = keywords.filter(kw =>
          response.toLowerCase().includes(kw.toLowerCase())
        );

        if (found.length > 0) {
          understanding[concept.concept] = found.join(', ');
        } else {
          understanding[concept.concept] = '';
        }
      }
    }

    return understanding;
  }

  /**
   * Verify a single concept
   */
  private async verifyConcept(
    concept: ConceptVerification,
    agentSaid: string,
    projectPath: string
  ): Promise<{ verified: boolean; failure?: VerificationFailure }> {
    // Check expected keywords
    if (concept.expected_keywords) {
      const keywords = concept.expected_keywords;
      const matchCount = keywords.filter(kw =>
        agentSaid.toLowerCase().includes(kw.toLowerCase())
      ).length;

      const accuracy = matchCount / keywords.length;

      if (accuracy < concept.min_accuracy) {
        return {
          verified: false,
          failure: {
            concept: concept.concept,
            agent_said: agentSaid,
            actual: keywords.join(', '),
            reason: `Only matched ${matchCount}/${keywords.length} expected keywords`
          }
        };
      }
    }

    // Check expected values
    if (concept.expected_values) {
      const hasValue = concept.expected_values.some(val =>
        agentSaid.includes(val)
      );

      if (!hasValue) {
        return {
          verified: false,
          failure: {
            concept: concept.concept,
            agent_said: agentSaid,
            actual: concept.expected_values.join(' or '),
            reason: 'Agent did not mention any expected value'
          }
        };
      }
    }

    // Check against source file
    if (concept.expected_source) {
      const sourcePath = path.join(projectPath, concept.expected_source);
      if (await fs.pathExists(sourcePath)) {
        const content = await fs.readFile(sourcePath, 'utf-8');

        // Verify agent's understanding matches source
        const keywords = concept.expected_keywords || [];
        const matchCount = keywords.filter(kw =>
          content.toLowerCase().includes(kw.toLowerCase())
        ).length;

        if (matchCount === 0) {
          return {
            verified: false,
            failure: {
              concept: concept.concept,
              agent_said: agentSaid,
              actual: `Content from ${concept.expected_source}`,
              reason: 'Agent understanding does not match source file'
            }
          };
        }
      }
    }

    return { verified: true };
  }

  /**
   * Format proof result for display
   */
  formatResult(result: ProofResult): string {
    if (result.status === 'verified') {
      return `✅ Context Proof PASSED (${(result.accuracy * 100).toFixed(0)}% accuracy)

Agent Understanding:
${Object.entries(result.agent_understanding)
  .map(([concept, understanding]) => `  • ${concept}: ${understanding}`)
  .join('\n')}

${result.gate_decision === 'ALLOW' ? '✅ ALLOWED to proceed' : '❌ BLOCKED'}`;
    } else {
      return `❌ Context Proof FAILED (${(result.accuracy * 100).toFixed(0)}% accuracy)

Failures:
${result.verification_details.failures
  ?.map(f => `  • ${f.concept}: Agent said "${f.agent_said}" but should be "${f.actual}"\n    Reason: ${f.reason}`)
  .join('\n') || 'Unknown'}

${result.awareness_tag || ''}

${result.gate_decision === 'BLOCK' ? '🚫 BLOCKED - Agent must re-read context' : ''}`;
    }
  }
}
