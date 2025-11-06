#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

/**
 * Shopify Admin MCP Server
 *
 * Executes GraphQL queries and ShopifyQL queries against the Shopify Admin API
 *
 * Configuration via environment variables:
 * - SHOPIFY_SHOP_URL: Your shop URL (e.g., your-store.myshopify.com)
 * - SHOPIFY_ACCESS_TOKEN: Admin API access token
 * - SHOPIFY_API_VERSION: API version (default: 2024-10)
 */

interface ShopifyConfig {
  shopUrl: string;
  accessToken: string;
  apiVersion: string;
}

interface GraphQLResponse {
  data?: any;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: any;
  }>;
}

interface ShopifyQLResponse {
  data?: {
    shopifyqlQuery: {
      tableData: {
        columns: Array<{
          name: string;
          dataType: string;
          displayName: string;
        }>;
        rows: any;
      } | null;
      parseErrors: string[];
    };
  };
  errors?: Array<{
    message: string;
    extensions?: any;
  }>;
}

class ShopifyAdminMCPServer {
  private server: Server;
  private config: ShopifyConfig;

  constructor() {
    this.server = new Server(
      {
        name: "shopify-admin-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Load configuration from environment variables
    this.config = this.loadConfig();

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private loadConfig(): ShopifyConfig {
    const shopUrl = process.env.SHOPIFY_SHOP_URL;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-10";

    if (!shopUrl) {
      throw new Error("SHOPIFY_SHOP_URL environment variable is required");
    }

    if (!accessToken) {
      throw new Error("SHOPIFY_ACCESS_TOKEN environment variable is required");
    }

    // Normalize shop URL (remove https:// and trailing slashes)
    const normalizedShopUrl = shopUrl
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");

    return {
      shopUrl: normalizedShopUrl,
      accessToken,
      apiVersion,
    };
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "execute_graphql",
            description:
              "Execute a GraphQL query against the Shopify Admin API. " +
              "Supports queries and mutations for products, orders, customers, inventory, and all Admin API operations. " +
              "Example: 'query { products(first: 10) { edges { node { id title } } } }'",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description:
                    "The GraphQL query or mutation string. Use standard GraphQL syntax.",
                },
                variables: {
                  type: "object",
                  description:
                    "Optional variables for the GraphQL query (as JSON object)",
                },
              },
              required: ["query"],
            },
          } satisfies Tool,
          {
            name: "execute_shopifyql",
            description:
              "Execute a ShopifyQL query against the Shopify Admin API. " +
              "Returns product analytics, sales data, customer insights, and more. " +
              "Supports queries from datasets: products, orders, sales, customers, payment_attempts. " +
              "Example: 'FROM products SHOW product_title, sum(view_sessions) GROUP BY product_title SINCE -30d LIMIT 20'",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description:
                    "The ShopifyQL query string. Use ShopifyQL syntax (FROM, SHOW, WHERE, GROUP BY, SINCE, UNTIL, ORDER BY, LIMIT). " +
                    "Available datasets: products (with conversion funnel metrics), orders, sales, customers, payment_attempts.",
                },
              },
              required: ["query"],
            },
          } satisfies Tool,
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === "execute_graphql") {
        return await this.executeGraphQLQuery(
          request.params.arguments as { query: string; variables?: any }
        );
      }

      if (request.params.name === "execute_shopifyql") {
        return await this.executeShopifyQLQuery(
          request.params.arguments as { query: string }
        );
      }

      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }

  private async executeGraphQLQuery(args: { query: string; variables?: any }) {
    const { query, variables } = args;

    if (!query || typeof query !== "string") {
      return {
        content: [
          {
            type: "text",
            text: "Error: query parameter is required and must be a string",
          },
        ],
      };
    }

    try {
      const apiUrl = `https://${this.config.shopUrl}/admin/api/${this.config.apiVersion}/graphql.json`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.config.accessToken,
        },
        body: JSON.stringify({
          query,
          variables: variables || {},
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          content: [
            {
              type: "text",
              text: `HTTP Error ${response.status}: ${errorText}`,
            },
          ],
          isError: true,
        };
      }

      const result = (await response.json()) as GraphQLResponse;

      // Check for GraphQL errors
      if (result.errors && result.errors.length > 0) {
        const errorDetails = result.errors
          .map((err) => {
            let msg = `- ${err.message}`;
            if (err.locations) {
              msg += ` (line ${err.locations[0].line}, column ${err.locations[0].column})`;
            }
            if (err.path) {
              msg += ` at path: ${err.path.join(".")}`;
            }
            return msg;
          })
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text: `GraphQL Errors:\n${errorDetails}`,
            },
          ],
          isError: true,
        };
      }

      // Format successful response
      let markdown = "# GraphQL Query Results\n\n";
      markdown += "```json\n";
      markdown += JSON.stringify(result.data, null, 2);
      markdown += "\n```\n";

      return {
        content: [
          {
            type: "text",
            text: markdown,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing GraphQL query: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async executeShopifyQLQuery(args: { query: string }) {
    const { query } = args;

    if (!query || typeof query !== "string") {
      return {
        content: [
          {
            type: "text",
            text: "Error: query parameter is required and must be a string",
          },
        ],
      };
    }

    try {
      // Construct the GraphQL API URL
      const apiUrl = `https://${this.config.shopUrl}/admin/api/${this.config.apiVersion}/graphql.json`;

      // Build GraphQL query
      const graphqlQuery = `
        query ShopifyQLQuery($query: String!) {
          shopifyqlQuery(query: $query) {
            tableData {
              columns {
                name
                dataType
                displayName
              }
              rows
            }
            parseErrors
          }
        }
      `;

      // Make request to Shopify API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.config.accessToken,
        },
        body: JSON.stringify({
          query: graphqlQuery,
          variables: { query },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          content: [
            {
              type: "text",
              text: `HTTP Error ${response.status}: ${errorText}`,
            },
          ],
          isError: true,
        };
      }

      const result = (await response.json()) as ShopifyQLResponse;

      // Check for GraphQL errors
      if (result.errors && result.errors.length > 0) {
        const errorMessages = result.errors
          .map((err) => err.message)
          .join(", ");
        return {
          content: [
            {
              type: "text",
              text: `GraphQL Error: ${errorMessages}`,
            },
          ],
          isError: true,
        };
      }

      // Check for ShopifyQL parse errors
      const shopifyqlData = result.data?.shopifyqlQuery;
      if (
        shopifyqlData?.parseErrors &&
        shopifyqlData.parseErrors.length > 0
      ) {
        return {
          content: [
            {
              type: "text",
              text: `ShopifyQL Parse Errors:\n${shopifyqlData.parseErrors.join("\n")}`,
            },
          ],
          isError: true,
        };
      }

      // Format successful response
      if (shopifyqlData?.tableData) {
        const { columns, rows } = shopifyqlData.tableData;

        // Format as markdown table for better readability
        let markdown = "# ShopifyQL Query Results\n\n";
        markdown += `**Query:** \`${query}\`\n\n`;

        if (columns && Array.isArray(rows) && rows.length > 0) {
          // Create table header
          markdown += "| " + columns.map((col) => col.displayName).join(" | ") + " |\n";
          markdown += "| " + columns.map(() => "---").join(" | ") + " |\n";

          // Create table rows
          for (const row of rows) {
            const values = columns.map((col) => {
              const value = row[col.name];
              if (value === null || value === undefined) {
                return "—";
              }
              return String(value);
            });
            markdown += "| " + values.join(" | ") + " |\n";
          }

          markdown += `\n**Total rows:** ${rows.length}\n`;
        } else if (!rows || rows.length === 0) {
          markdown += "*No results found*\n";
        }

        // Also include raw JSON for programmatic access
        markdown += "\n## Raw Data\n\n```json\n";
        markdown += JSON.stringify(shopifyqlData.tableData, null, 2);
        markdown += "\n```\n";

        return {
          content: [
            {
              type: "text",
              text: markdown,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "No data returned from query",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing ShopifyQL query: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Shopify Admin MCP Server running on stdio");
  }
}

// Start the server
const server = new ShopifyAdminMCPServer();
server.run().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
