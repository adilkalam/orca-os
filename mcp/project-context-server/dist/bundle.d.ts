/**
 * Context Bundler
 *
 * Creates tailored context bundles by combining:
 * - Semantic file search
 * - Project memory (decisions, standards, history)
 * - Project state (components, structure)
 *
 * Every agent receives a ContextBundle before work begins.
 */
import type { ContextBundle, ContextQuery, MemoryStore, SemanticSearch } from './types.js';
export declare class ContextBundler {
    private memory;
    private semantic;
    constructor(memory: MemoryStore, semantic: SemanticSearch);
    /**
     * Create a complete context bundle for an agent operation
     */
    createBundle(query: ContextQuery): Promise<ContextBundle>;
    /**
     * Get files semantically relevant to the task
     */
    private getRelevantFiles;
    /**
     * Get past decisions from project memory
     */
    private getPastDecisions;
    /**
     * Get standards relevant to this domain
     */
    private getRelatedStandards;
    /**
     * Get history of similar tasks
     */
    private getSimilarTasks;
    /**
     * Get current project state
     */
    private getProjectState;
    /**
     * Get design system context for webdev
     */
    private getDesignSystem;
}
//# sourceMappingURL=bundle.d.ts.map