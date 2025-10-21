#!/usr/bin/env python3
"""
Setup Navigator MCP Server

Provides MCP tools for discovering and querying your Claude Code setup.

Tools:
- setup_scan: Scan ~/.claude/ directory and build registry
- setup_query: Natural language search for agents/skills
- setup_list_agents: List all agents (with filters)
- setup_analyze: Analyze setup for optimization
- setup_docs: Generate comprehensive documentation
"""

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any, Optional

# MCP SDK imports
try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import Tool, TextContent
except ImportError:
    print("Error: MCP SDK not installed. Run: pip install mcp", file=sys.stderr)
    sys.exit(1)


class SetupNavigatorServer:
    def __init__(self):
        self.root_dir = Path(__file__).parent.parent
        self.registry_path = self.root_dir / "output" / "registry.json"
        self.server = Server("setup-navigator")
        self._setup_tools()

    def _setup_tools(self):
        """Register all MCP tools"""

        @self.server.list_tools()
        async def list_tools() -> list[Tool]:
            return [
                Tool(
                    name="setup_scan",
                    description="Scan ~/.claude/ directory and build complete registry of agents, skills, commands, and plugins",
                    inputSchema={
                        "type": "object",
                        "properties": {},
                        "required": []
                    }
                ),
                Tool(
                    name="setup_query",
                    description="Natural language search for agents, skills, or commands. Use for questions like 'Which agent for iOS?' or 'pixel-perfect design'",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "Natural language query (e.g., 'iOS development', 'pixel-perfect design', 'SwiftUI optimization')"
                            }
                        },
                        "required": ["query"]
                    }
                ),
                Tool(
                    name="setup_list_agents",
                    description="List all agents with optional filters by model (opus/sonnet/haiku) or category (ios-development, design, frontend, etc.)",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "model": {
                                "type": "string",
                                "description": "Filter by model: opus, sonnet, or haiku",
                                "enum": ["opus", "sonnet", "haiku"]
                            },
                            "category": {
                                "type": "string",
                                "description": "Filter by category: ios-development, design, frontend, leamas, etc."
                            }
                        }
                    }
                ),
                Tool(
                    name="setup_analyze",
                    description="Analyze setup for redundancies, cost optimization, and model distribution. Provides actionable recommendations.",
                    inputSchema={
                        "type": "object",
                        "properties": {},
                        "required": []
                    }
                ),
                Tool(
                    name="setup_docs",
                    description="Generate comprehensive documentation of your entire Claude Code setup (similar to SETUP-SUMMARY.md)",
                    inputSchema={
                        "type": "object",
                        "properties": {},
                        "required": []
                    }
                )
            ]

        @self.server.call_tool()
        async def call_tool(name: str, arguments: Any) -> list[TextContent]:
            """Handle tool calls"""

            if name == "setup_scan":
                return await self._handle_scan()

            elif name == "setup_query":
                query = arguments.get("query", "")
                return await self._handle_query(query)

            elif name == "setup_list_agents":
                model = arguments.get("model")
                category = arguments.get("category")
                return await self._handle_list_agents(model, category)

            elif name == "setup_analyze":
                return await self._handle_analyze()

            elif name == "setup_docs":
                return await self._handle_docs()

            else:
                return [TextContent(
                    type="text",
                    text=f"Unknown tool: {name}"
                )]

    async def _handle_scan(self) -> list[TextContent]:
        """Run the scanner"""
        try:
            scan_script = self.root_dir / "cli" / "scan.js"
            result = subprocess.run(
                ["node", str(scan_script)],
                cwd=str(self.root_dir),
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                return [TextContent(
                    type="text",
                    text=f"✅ Scan complete!\n\n{result.stdout}"
                )]
            else:
                return [TextContent(
                    type="text",
                    text=f"❌ Scan failed:\n{result.stderr}"
                )]

        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Error running scan: {str(e)}"
            )]

    async def _handle_query(self, query: str) -> list[TextContent]:
        """Handle natural language query"""
        try:
            query_script = self.root_dir / "cli" / "query.js"
            result = subprocess.run(
                ["node", str(query_script), query],
                cwd=str(self.root_dir),
                capture_output=True,
                text=True,
                timeout=10
            )

            if result.returncode == 0:
                return [TextContent(
                    type="text",
                    text=result.stdout
                )]
            else:
                return [TextContent(
                    type="text",
                    text=f"❌ Query failed:\n{result.stderr}"
                )]

        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Error running query: {str(e)}"
            )]

    async def _handle_list_agents(self, model: Optional[str], category: Optional[str]) -> list[TextContent]:
        """List agents with filters"""
        try:
            query_script = self.root_dir / "cli" / "query.js"

            if model:
                cmd = ["node", str(query_script), "--model", model]
            elif category:
                cmd = ["node", str(query_script), "--category", category]
            else:
                # Load registry and list all agents
                if not self.registry_path.exists():
                    return [TextContent(
                        type="text",
                        text="❌ Registry not found. Run setup_scan first."
                    )]

                with open(self.registry_path, 'r') as f:
                    registry = json.load(f)

                output = f"Found {len(registry['agents'])} agent(s):\n\n"
                for agent in registry['agents']:
                    output += f"**{agent['name']}** ({agent['model'].upper()})\n"
                    output += f"   Category: {agent['category']}\n"
                    output += f"   {agent['description'][:150]}...\n\n"

                return [TextContent(type="text", text=output)]

            result = subprocess.run(
                cmd,
                cwd=str(self.root_dir),
                capture_output=True,
                text=True,
                timeout=10
            )

            return [TextContent(type="text", text=result.stdout)]

        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Error listing agents: {str(e)}"
            )]

    async def _handle_analyze(self) -> list[TextContent]:
        """Run setup analyzer"""
        try:
            analyze_script = self.root_dir / "cli" / "analyze.js"
            result = subprocess.run(
                ["node", str(analyze_script)],
                cwd=str(self.root_dir),
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                return [TextContent(
                    type="text",
                    text=result.stdout
                )]
            else:
                return [TextContent(
                    type="text",
                    text=f"❌ Analysis failed:\n{result.stderr}"
                )]

        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Error running analysis: {str(e)}"
            )]

    async def _handle_docs(self) -> list[TextContent]:
        """Generate documentation"""
        try:
            docs_script = self.root_dir / "cli" / "generate-docs.js"
            result = subprocess.run(
                ["node", str(docs_script)],
                cwd=str(self.root_dir),
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                # Read the generated docs
                docs_path = self.root_dir / "output" / "SETUP-DOCUMENTATION.md"
                if docs_path.exists():
                    with open(docs_path, 'r') as f:
                        docs_content = f.read()

                    return [TextContent(
                        type="text",
                        text=f"✅ Documentation generated!\n\n{docs_content[:2000]}...\n\nFull documentation saved to:\n{docs_path}"
                    )]
                else:
                    return [TextContent(
                        type="text",
                        text=f"✅ Documentation generated!\n\n{result.stdout}"
                    )]
            else:
                return [TextContent(
                    type="text",
                    text=f"❌ Documentation generation failed:\n{result.stderr}"
                )]

        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Error generating docs: {str(e)}"
            )]

    async def run(self):
        """Run the MCP server"""
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                self.server.create_initialization_options()
            )


async def main():
    server = SetupNavigatorServer()
    await server.run()


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
