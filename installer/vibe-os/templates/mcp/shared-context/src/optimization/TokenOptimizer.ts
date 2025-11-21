/**
 * Simplified TokenOptimizer for SharedContextServer
 * Provides core optimization methods without heavy dependencies
 */

export interface ContextDiff {
  added: Record<string, any>;
  modified: Record<string, any>;
  removed: string[];
  unchanged: string[];
}

export interface OptimizationResult {
  context: any;
  tokensRemoved: number;
  compressionRatio: number;
}

export class TokenOptimizer {
  private readonly CHARS_PER_TOKEN = 4;
  private readonly DEFAULT_MAX_TOKENS = 100000; // Default: 100k tokens (~400KB)

  /**
   * Trim context to fit within token limits
   * Uses simple priority-based pruning: keep essential keys, trim large arrays/objects
   */
  trimContext(context: any, maxTokens: number = this.DEFAULT_MAX_TOKENS): OptimizationResult {
    const maxSize = maxTokens * this.CHARS_PER_TOKEN;
    const originalSize = JSON.stringify(context).length;

    if (originalSize <= maxSize) {
      return {
        context,
        tokensRemoved: 0,
        compressionRatio: 1.0
      };
    }

    // Priority keys that should always be preserved
    const priorityKeys = ['projectId', 'agentId', 'version', 'timestamp', 'type', 'id'];

    const trimmed: any = {};
    let currentSize = 0;

    // First pass: Add priority keys
    for (const key of priorityKeys) {
      if (context[key] !== undefined) {
        trimmed[key] = context[key];
        currentSize = JSON.stringify(trimmed).length;
      }
    }

    // Second pass: Add other keys until we hit the limit
    for (const [key, value] of Object.entries(context)) {
      if (priorityKeys.includes(key)) continue;

      const testContext = { ...trimmed, [key]: value };
      const testSize = JSON.stringify(testContext).length;

      if (testSize <= maxSize) {
        trimmed[key] = value;
        currentSize = testSize;
      } else {
        // Try to add a truncated version if it's an array or string
        if (Array.isArray(value) && value.length > 0) {
          // Add partial array
          const partialArray = [];
          for (const item of value) {
            const testWithItem = { ...trimmed, [key]: [...partialArray, item] };
            if (JSON.stringify(testWithItem).length <= maxSize) {
              partialArray.push(item);
            } else {
              break;
            }
          }
          if (partialArray.length > 0) {
            trimmed[key] = partialArray;
            currentSize = JSON.stringify(trimmed).length;
          }
        } else if (typeof value === 'string' && value.length > 100) {
          // Add truncated string
          const available = maxSize - currentSize;
          if (available > 50) {
            trimmed[key] = value.substring(0, available - 20) + '...[truncated]';
            currentSize = JSON.stringify(trimmed).length;
          }
        }
      }
    }

    const finalSize = JSON.stringify(trimmed).length;
    const tokensRemoved = Math.ceil((originalSize - finalSize) / this.CHARS_PER_TOKEN);

    return {
      context: trimmed,
      tokensRemoved,
      compressionRatio: finalSize / originalSize
    };
  }

  /**
   * Compute differential updates between old and new context
   * Returns added, modified, removed, and unchanged keys
   */
  computeContextDiff(oldContext: any, newContext: any): ContextDiff {
    const diff: ContextDiff = {
      added: {},
      modified: {},
      removed: [],
      unchanged: []
    };

    if (!oldContext) {
      // No old context, everything is added
      diff.added = { ...newContext };
      return diff;
    }

    if (!newContext) {
      // No new context, everything is removed
      diff.removed = Object.keys(oldContext);
      return diff;
    }

    const oldKeys = new Set(Object.keys(oldContext));
    const newKeys = new Set(Object.keys(newContext));

    // Find added keys
    for (const key of newKeys) {
      if (!oldKeys.has(key)) {
        diff.added[key] = newContext[key];
      }
    }

    // Find removed keys
    for (const key of oldKeys) {
      if (!newKeys.has(key)) {
        diff.removed.push(key);
      }
    }

    // Find modified and unchanged keys
    for (const key of newKeys) {
      if (oldKeys.has(key)) {
        const oldValue = JSON.stringify(oldContext[key]);
        const newValue = JSON.stringify(newContext[key]);

        if (oldValue !== newValue) {
          diff.modified[key] = newContext[key];
        } else {
          diff.unchanged.push(key);
        }
      }
    }

    return diff;
  }

  /**
   * Optimize agent configuration by creating shared context references
   * Reduces duplication when multiple agents share common context
   */
  optimizeAgentConfiguration(agents: any[], context: any): any {
    if (!agents || agents.length === 0) {
      return context;
    }

    // Extract common context that all agents share
    const sharedContext: any = {
      projectId: context.projectId,
      timestamp: context.timestamp,
      version: context.version
    };

    // Find keys that appear in context for all agents
    const commonKeys: Set<string> = new Set();

    for (const [key, value] of Object.entries(context)) {
      if (['projectId', 'timestamp', 'version'].includes(key)) continue;

      // Check if this key is relevant to all agents
      const relevantToAll = agents.every(agent => {
        return agent.requiredContext?.includes(key) ||
               agent.capabilities?.includes(key);
      });

      if (relevantToAll) {
        commonKeys.add(key);
        sharedContext[key] = value;
      }
    }

    // Create optimized structure with shared reference
    return {
      shared: sharedContext,
      perAgent: agents.reduce((acc, agent) => {
        acc[agent.agentId] = {
          agentId: agent.agentId,
          // Only include agent-specific context
          specific: Object.keys(context)
            .filter(key => !commonKeys.has(key) &&
                          !['projectId', 'timestamp', 'version'].includes(key))
            .reduce((obj, key) => {
              obj[key] = context[key];
              return obj;
            }, {} as any)
        };
        return acc;
      }, {} as any)
    };
  }

  /**
   * Estimate token count from text/object
   */
  estimateTokens(data: any): number {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    return Math.ceil(str.length / this.CHARS_PER_TOKEN);
  }

  /**
   * Calculate token savings from using differential updates
   */
  calculateDiffSavings(fullContext: any, diff: ContextDiff): number {
    const fullSize = JSON.stringify(fullContext).length;
    const diffSize = JSON.stringify(diff).length;
    const savings = fullSize - diffSize;
    return Math.ceil(savings / this.CHARS_PER_TOKEN);
  }
}
