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
import type { ContextBundle, ContextQuery, MemoryStore, SemanticSearch, ProjectState } from './types.js';
export declare class ContextBundler {
    private memory;
    private semantic;
    private structureAnalyzer;
    private cacheMaxAge;
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
     * Get current project state (with caching)
     */
    private getProjectState;
    /**
     * Force reanalysis of project structure
     */
    reanalyzeProject(projectPath: string): Promise<ProjectState>;
    /**
     * Cache project state to disk
     */
    private cacheProjectState;
    /**
     * Get design system context for webdev and expo
     */
    private getDesignSystem;
}
//# sourceMappingURL=bundle.d.ts.map