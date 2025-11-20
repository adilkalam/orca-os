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
import { readFile } from 'fs/promises';
import { join } from 'path';
export class ContextBundler {
    memory;
    semantic;
    constructor(memory, semantic) {
        this.memory = memory;
        this.semantic = semantic;
    }
    /**
     * Create a complete context bundle for an agent operation
     */
    async createBundle(query) {
        console.error(`Creating context bundle: ${query.domain} - ${query.task.substring(0, 50)}...`);
        // Run queries in parallel for efficiency
        const [relevantFiles, pastDecisions, relatedStandards, similarTasks, projectState,] = await Promise.all([
            this.getRelevantFiles(query),
            this.getPastDecisions(query),
            this.getRelatedStandards(query),
            this.getSimilarTasks(query),
            this.getProjectState(query.projectPath),
        ]);
        const bundle = {
            relevantFiles,
            projectState,
            pastDecisions,
            relatedStandards,
            similarTasks,
        };
        // Add design system for webdev domain
        if (query.domain === 'webdev') {
            bundle.designSystem = await this.getDesignSystem(query.projectPath);
        }
        console.error(`Bundle created: ${relevantFiles.length} files, ` +
            `${pastDecisions.length} decisions, ` +
            `${relatedStandards.length} standards`);
        return bundle;
    }
    /**
     * Get files semantically relevant to the task
     */
    async getRelevantFiles(query) {
        const maxFiles = query.maxFiles || 10;
        return await this.semantic.search(query.task, query.projectPath, maxFiles);
    }
    /**
     * Get past decisions from project memory
     */
    async getPastDecisions(query) {
        // Search for decisions related to this task
        const decisions = await this.memory.queryDecisions(query.task, 5);
        // Also get recent decisions from this domain
        const domainDecisions = await this.memory.queryDecisions(query.domain, 3);
        // Combine and deduplicate
        const allDecisions = [...decisions, ...domainDecisions];
        const unique = allDecisions.filter((d, i, arr) => arr.findIndex((x) => x.id === d.id) === i);
        return unique.slice(0, 8);
    }
    /**
     * Get standards relevant to this domain
     */
    async getRelatedStandards(query) {
        return await this.memory.queryStandards(query.domain);
    }
    /**
     * Get history of similar tasks
     */
    async getSimilarTasks(query) {
        if (!query.includeHistory)
            return [];
        return await this.memory.queryTaskHistory(query.task, 5);
    }
    /**
     * Get current project state
     */
    async getProjectState(projectPath) {
        // Try to read cached project state
        const statePath = join(projectPath, '.claude', 'project', 'state.json');
        try {
            const stateData = await readFile(statePath, 'utf-8');
            return JSON.parse(stateData);
        }
        catch {
            // No cached state, generate basic structure
            return {
                components: [],
                fileStructure: {
                    name: projectPath.split('/').pop() || 'project',
                    path: projectPath,
                    type: 'directory',
                },
                dependencies: {},
                lastUpdated: new Date(),
            };
        }
    }
    /**
     * Get design system context for webdev
     */
    async getDesignSystem(projectPath) {
        const designDnaPath = join(projectPath, 'design-dna.json');
        try {
            const designData = await readFile(designDnaPath, 'utf-8');
            return JSON.parse(designData);
        }
        catch {
            // No design system found
            return undefined;
        }
    }
}
//# sourceMappingURL=bundle.js.map