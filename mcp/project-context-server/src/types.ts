/**
 * OS 2.0 ProjectContextServer Types
 *
 * Core principle: Context is MANDATORY, not optional.
 * No agent can work without a ContextBundle from this service.
 */

/**
 * Context bundle returned to every agent operation
 * Contains everything needed to work with full project awareness
 */
export interface ContextBundle {
  /** Files relevant to the current task (via semantic search) */
  relevantFiles: FileContext[];

  /** Current project state (components, structure, dependencies) */
  projectState: ProjectState;

  /** Past decisions from project memory */
  pastDecisions: Decision[];

  /** Standards learned from this project's history */
  relatedStandards: Standard[];

  /** Similar tasks attempted in the past */
  similarTasks: TaskHistory[];

  /** Design system tokens and patterns */
  designSystem?: DesignSystemContext;
}

/**
 * File context with semantic metadata
 */
export interface FileContext {
  path: string;
  type: string;
  lastModified: Date;
  summary?: string;
  relevanceScore: number;
  symbols?: string[];
}

/**
 * Current project state snapshot
 */
export interface ProjectState {
  components: ComponentRegistry[];
  fileStructure: FileNode;
  dependencies: Record<string, string>;
  lastUpdated: Date;
}

/**
 * Component registry entry
 */
export interface ComponentRegistry {
  name: string;
  path: string;
  type: 'component' | 'hook' | 'utility' | 'page' | 'layout';
  exports: string[];
  imports: string[];
  metadata?: Record<string, any>;
}

/**
 * File tree node
 */
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

/**
 * Decision logged in project memory
 */
export interface Decision {
  id: string;
  timestamp: Date;
  domain: string;
  decision: string;
  reasoning: string;
  context?: string;
  tags?: string[];
}

/**
 * Standard learned from project experience
 */
export interface Standard {
  id: string;
  what_happened: string;
  cost: string;
  rule: string;
  domain: string;
  created: Date;
  enforced_count: number;
}

/**
 * Historical task record
 */
export interface TaskHistory {
  id: string;
  timestamp: Date;
  domain: string;
  task: string;
  outcome: 'success' | 'failure' | 'partial';
  learnings?: string;
  files_modified?: string[];
}

/**
 * Design system context
 */
export interface DesignSystemContext {
  tokens: Record<string, any>;
  customizations: Record<string, any>;
  patterns: string[];
}

/**
 * Query parameters for context retrieval
 */
export interface ContextQuery {
  domain: 'webdev' | 'ios' | 'data' | 'seo' | 'brand';
  task: string;
  projectPath: string;
  maxFiles?: number;
  includeHistory?: boolean;
}

/**
 * Memory storage interface
 */
export interface MemoryStore {
  saveDecision(decision: Omit<Decision, 'id' | 'timestamp'>): Promise<void>;
  queryDecisions(query: string, limit?: number): Promise<Decision[]>;
  saveStandard(standard: Omit<Standard, 'id' | 'created'>): Promise<void>;
  queryStandards(domain: string): Promise<Standard[]>;
  saveTaskHistory(task: Omit<TaskHistory, 'id' | 'timestamp'>): Promise<void>;
  queryTaskHistory(query: string, limit?: number): Promise<TaskHistory[]>;
}

/**
 * Semantic search interface
 */
export interface SemanticSearch {
  search(query: string, projectPath: string, maxResults?: number): Promise<FileContext[]>;
  indexProject(projectPath: string): Promise<void>;
}
