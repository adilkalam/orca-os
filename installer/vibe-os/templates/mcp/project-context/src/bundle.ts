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

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type {
  ContextBundle,
  ContextQuery,
  MemoryStore,
  SemanticSearch,
  ProjectState,
  ComponentRegistry,
  FileNode,
} from './types.js';
import { StructureAnalyzer } from './structure.js';

export class ContextBundler {
  private structureAnalyzer: StructureAnalyzer;
  private cacheMaxAge = 1000 * 60 * 60; // 1 hour cache

  constructor(
    private memory: MemoryStore,
    private semantic: SemanticSearch
  ) {
    this.structureAnalyzer = new StructureAnalyzer();
  }

  /**
   * Create a complete context bundle for an agent operation
   */
  async createBundle(query: ContextQuery): Promise<ContextBundle> {
    // FIX: Initialize memory DB with project path before any queries
    await (this.memory as any).initializeDb(query.projectPath);

    console.error(
      `Creating context bundle: ${query.domain} - ${query.task.substring(0, 50)}...`
    );

    // Run queries in parallel for efficiency
    const [
      relevantFiles,
      pastDecisions,
      relatedStandards,
      similarTasks,
      projectState,
    ] = await Promise.all([
      this.getRelevantFiles(query),
      this.getPastDecisions(query),
      this.getRelatedStandards(query),
      this.getSimilarTasks(query),
      this.getProjectState(query.projectPath),
    ]);

    const bundle: ContextBundle = {
      relevantFiles,
      projectState,
      pastDecisions,
      relatedStandards,
      similarTasks,
    };

    // Add design system for webdev and expo domains
    if (query.domain === 'webdev' || query.domain === 'expo') {
      bundle.designSystem = await this.getDesignSystem(query.projectPath);
    }

    console.error(
      `Bundle created: ${relevantFiles.length} files, ` +
        `${pastDecisions.length} decisions, ` +
        `${relatedStandards.length} standards`
    );

    return bundle;
  }

  /**
   * Get files semantically relevant to the task
   */
  private async getRelevantFiles(query: ContextQuery) {
    const maxFiles = query.maxFiles || 10;
    return await this.semantic.search(
      query.task,
      query.projectPath,
      maxFiles
    );
  }

  /**
   * Get past decisions from project memory
   */
  private async getPastDecisions(query: ContextQuery) {
    // Search for decisions related to this task
    const decisions = await this.memory.queryDecisions(query.task, 5);

    // Also get recent decisions from this domain
    const domainDecisions = await this.memory.queryDecisions(
      query.domain,
      3
    );

    // Combine and deduplicate
    const allDecisions = [...decisions, ...domainDecisions];
    const unique = allDecisions.filter(
      (d, i, arr) => arr.findIndex((x) => x.id === d.id) === i
    );

    return unique.slice(0, 8);
  }

  /**
   * Get standards relevant to this domain
   */
  private async getRelatedStandards(query: ContextQuery) {
    return await this.memory.queryStandards(query.domain);
  }

  /**
   * Get history of similar tasks
   */
  private async getSimilarTasks(query: ContextQuery) {
    if (!query.includeHistory) return [];
    return await this.memory.queryTaskHistory(query.task, 5);
  }

  /**
   * Get current project state (with caching)
   */
  private async getProjectState(projectPath: string): Promise<ProjectState> {
    const statePath = join(projectPath, '.claude', 'project', 'state.json');

    // Try to read cached state
    try {
      const stateData = await readFile(statePath, 'utf-8');
      const cachedState: ProjectState = JSON.parse(stateData);

      // Check if cache is still fresh
      const cacheAge =
        Date.now() - new Date(cachedState.lastUpdated).getTime();

      if (cacheAge < this.cacheMaxAge) {
        console.error(`Using cached project state (${Math.round(cacheAge / 1000 / 60)}min old)`);
        return cachedState;
      }
    } catch {
      // No cache or invalid cache
    }

    // Cache miss or expired - analyze project
    console.error('Analyzing project structure (this may take a moment)...');
    const projectState = await this.structureAnalyzer.analyzeProject(
      projectPath
    );

    // Cache the result
    await this.cacheProjectState(projectPath, projectState);

    return projectState;
  }

  /**
   * Force reanalysis of project structure
   */
  async reanalyzeProject(projectPath: string): Promise<ProjectState> {
    console.error('Force reanalyzing project structure...');
    const projectState = await this.structureAnalyzer.analyzeProject(
      projectPath
    );

    await this.cacheProjectState(projectPath, projectState);

    return projectState;
  }

  /**
   * Cache project state to disk
   */
  private async cacheProjectState(
    projectPath: string,
    state: ProjectState
  ): Promise<void> {
    const stateDir = join(projectPath, '.claude', 'project');
    const statePath = join(stateDir, 'state.json');

    try {
      // Ensure directory exists
      await mkdir(stateDir, { recursive: true });

      // Write state
      await writeFile(statePath, JSON.stringify(state, null, 2), 'utf-8');

      console.error(`Project state cached to ${statePath}`);
    } catch (error) {
      console.error(`Failed to cache project state:`, error);
    }
  }

  /**
   * Get design system context for webdev and expo
   */
  private async getDesignSystem(projectPath: string) {
    const designDnaPath = join(projectPath, 'design-dna.json');

    try {
      const designData = await readFile(designDnaPath, 'utf-8');
      return JSON.parse(designData);
    } catch {
      // No design system found
      return undefined;
    }
  }
}
