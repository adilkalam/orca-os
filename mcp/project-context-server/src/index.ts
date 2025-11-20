/**
 * OS 2.0 ProjectContextServer
 *
 * THE MANDATORY BRAIN: No agent can work without context from this service.
 *
 * Key principles:
 * 1. Context is MANDATORY, not optional
 * 2. Every operation goes through this service
 * 3. Makes v1's context amnesia structurally impossible
 * 4. Integrates: Claude Context MCP + vibe.db + file index
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import type {
  ContextBundle,
  ContextQuery,
  MemoryStore,
  SemanticSearch,
} from './types.js';
import { MemoryStoreImpl } from './memory.js';
import { SemanticSearchImpl } from './semantic.js';
import { ContextBundler } from './bundle.js';

/**
 * ProjectContextServer - The mandatory context service for OS 2.0
 */
export class ProjectContextServer {
  private server: Server;
  private memory: MemoryStore;
  private semantic: SemanticSearch;
  private bundler: ContextBundler;

  constructor() {
    this.server = new Server(
      {
        name: 'project-context-server',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize subsystems
    this.memory = new MemoryStoreImpl();
    this.semantic = new SemanticSearchImpl();
    this.bundler = new ContextBundler(this.memory, this.semantic);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools(),
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'query_context':
          return await this.handleQueryContext(args as unknown as ContextQuery);

        case 'save_decision':
          return await this.handleSaveDecision(args as any);

        case 'save_standard':
          return await this.handleSaveStandard(args as any);

        case 'save_task_history':
          return await this.handleSaveTaskHistory(args as any);

        case 'index_project':
          return await this.handleIndexProject(args as any);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  /**
   * Define MCP tools exposed by this server
   */
  private getTools(): Tool[] {
    return [
      {
        name: 'query_context',
        description:
          'MANDATORY: Get project context bundle before ANY work. ' +
          'Returns relevant files, project state, past decisions, standards, and history. ' +
          'No agent can work without calling this first.',
        inputSchema: {
          type: 'object',
          properties: {
            domain: {
              type: 'string',
              enum: ['webdev', 'ios', 'data', 'seo', 'brand'],
              description: 'The domain/lane for this operation',
            },
            task: {
              type: 'string',
              description: 'Description of the task to perform',
            },
            projectPath: {
              type: 'string',
              description: 'Absolute path to the project root',
            },
            maxFiles: {
              type: 'number',
              description: 'Maximum number of relevant files to return (default: 10)',
              default: 10,
            },
            includeHistory: {
              type: 'boolean',
              description: 'Include task history in the bundle (default: true)',
              default: true,
            },
          },
          required: ['domain', 'task', 'projectPath'],
        },
      },
      {
        name: 'save_decision',
        description: 'Log a design or architectural decision to project memory',
        inputSchema: {
          type: 'object',
          properties: {
            domain: { type: 'string' },
            decision: { type: 'string' },
            reasoning: { type: 'string' },
            context: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
          required: ['domain', 'decision', 'reasoning'],
        },
      },
      {
        name: 'save_standard',
        description:
          'Create a new standard from a failure or repeated issue. ' +
          'Format: What Happened / Cost / Rule',
        inputSchema: {
          type: 'object',
          properties: {
            what_happened: { type: 'string' },
            cost: { type: 'string' },
            rule: { type: 'string' },
            domain: { type: 'string' },
          },
          required: ['what_happened', 'cost', 'rule', 'domain'],
        },
      },
      {
        name: 'save_task_history',
        description: 'Record task completion for future reference',
        inputSchema: {
          type: 'object',
          properties: {
            domain: { type: 'string' },
            task: { type: 'string' },
            outcome: { type: 'string', enum: ['success', 'failure', 'partial'] },
            learnings: { type: 'string' },
            files_modified: { type: 'array', items: { type: 'string' } },
          },
          required: ['domain', 'task', 'outcome'],
        },
      },
      {
        name: 'index_project',
        description: 'Index a project for semantic search (run once per project)',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
          },
          required: ['projectPath'],
        },
      },
    ];
  }

  /**
   * CORE FUNCTION: Query project context
   * This is called before EVERY agent operation
   */
  private async handleQueryContext(query: ContextQuery) {
    const bundle = await this.bundler.createBundle(query);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(bundle, null, 2),
        },
      ],
    };
  }

  private async handleSaveDecision(args: any) {
    await this.memory.saveDecision(args);
    return {
      content: [{ type: 'text', text: 'Decision saved to project memory' }],
    };
  }

  private async handleSaveStandard(args: any) {
    await this.memory.saveStandard(args);
    return {
      content: [{ type: 'text', text: 'Standard saved and will be enforced' }],
    };
  }

  private async handleSaveTaskHistory(args: any) {
    await this.memory.saveTaskHistory(args);
    return {
      content: [{ type: 'text', text: 'Task history recorded' }],
    };
  }

  private async handleIndexProject(args: { projectPath: string }) {
    await this.semantic.indexProject(args.projectPath);
    return {
      content: [
        { type: 'text', text: `Project indexed: ${args.projectPath}` },
      ],
    };
  }

  /**
   * Start the MCP server
   */
  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ProjectContextServer v2.0 started');
    console.error('Context is now MANDATORY for all operations');
  }
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new ProjectContextServer();
  server.run().catch(console.error);
}
