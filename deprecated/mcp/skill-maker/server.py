#!/usr/bin/env python3
"""
Skill Maker MCP Server
Create, manage, validate, and test Claude Code skills.
Built with official MCP Python SDK.
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import Optional
from mcp.server.fastmcp import FastMCP

# Create MCP server instance
mcp = FastMCP(name="skill-maker")

# Skills directory (global Claude setup)
SKILLS_DIR = Path.home() / ".claude" / "skills"

def log(message: str):
    """Log to stderr (never stdout - MCP protocol requirement)"""
    print(f"[skill-maker] {message}", file=sys.stderr, flush=True)

def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Parse YAML frontmatter and content from skill file"""
    if not content.startswith("---"):
        return {}, content

    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content

    frontmatter = {}
    for line in parts[1].strip().split("\n"):
        if ":" in line:
            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip()

            # Handle lists
            if key == "allowed-tools":
                frontmatter[key] = []
                continue
            elif line.startswith("  - "):
                if "allowed-tools" in frontmatter:
                    frontmatter["allowed-tools"].append(line.strip("  - "))
                continue

            frontmatter[key] = value

    return frontmatter, parts[2].strip()

@mcp.tool()
def create_skill(
    name: str,
    description: str,
    tools: str = "Read,Write,Edit,Bash"
) -> str:
    """Create a new skill from template

    Args:
        name: Skill name (kebab-case, e.g., my-new-skill)
        description: Brief description of when to use this skill
        tools: Comma-separated list of allowed tools (default: Read,Write,Edit,Bash)
    """
    skill_dir = SKILLS_DIR / name

    if skill_dir.exists():
        return f"Error: Skill '{name}' already exists at {skill_dir}"

    # Parse tools
    tools_list = [t.strip() for t in tools.split(",")]

    # Create skill content
    frontmatter = f"""---
name: {name}
description: {description}
allowed-tools:
{chr(10).join(f"  - {tool}" for tool in tools_list)}
---

# {name.replace('-', ' ').title()}

## When to Use This Skill

Use when:
- [Add trigger condition 1]
- [Add trigger condition 2]

## Instructions

[Add detailed instructions here]

## Example Usage

[Add example workflow here]
"""

    # Create directory and file
    skill_dir.mkdir(parents=True)
    skill_file = skill_dir / "SKILL.md"
    skill_file.write_text(frontmatter)

    return f"✓ Created skill '{name}' at {skill_file}\n\nNext steps:\n1. Edit {skill_file} to add instructions\n2. Test with: test_skill('{name}', 'your test prompt')\n3. Validate with: validate_skill('{name}')"

@mcp.tool()
def list_skills() -> str:
    """List all available skills in ~/.claude/skills/"""
    if not SKILLS_DIR.exists():
        return f"No skills directory found at {SKILLS_DIR}"

    skills = []
    for skill_dir in sorted(SKILLS_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue

        skill_file = skill_dir / "SKILL.md"
        if not skill_file.exists():
            continue

        # Parse skill metadata
        content = skill_file.read_text()
        metadata, _ = parse_frontmatter(content)

        name = metadata.get("name", skill_dir.name)
        desc = metadata.get("description", "No description")

        skills.append(f"• {name}\n  {desc[:100]}{'...' if len(desc) > 100 else ''}")

    if not skills:
        return "No skills found"

    return f"Found {len(skills)} skills:\n\n" + "\n\n".join(skills)

@mcp.tool()
def read_skill(name: str) -> str:
    """Read skill content

    Args:
        name: Skill name
    """
    skill_file = SKILLS_DIR / name / "SKILL.md"

    if not skill_file.exists():
        return f"Error: Skill '{name}' not found at {skill_file}"

    content = skill_file.read_text()
    return f"Skill: {name}\nPath: {skill_file}\n\n{content}"

@mcp.tool()
def validate_skill(name: str) -> str:
    """Validate skill format and structure

    Args:
        name: Skill name
    """
    skill_file = SKILLS_DIR / name / "SKILL.md"

    if not skill_file.exists():
        return f"Error: Skill '{name}' not found"

    content = skill_file.read_text()
    metadata, body = parse_frontmatter(content)

    errors = []
    warnings = []

    # Check required fields
    if "name" not in metadata:
        errors.append("Missing 'name' in frontmatter")
    elif metadata["name"] != name:
        warnings.append(f"Name mismatch: frontmatter says '{metadata['name']}' but directory is '{name}'")

    if "description" not in metadata:
        errors.append("Missing 'description' in frontmatter")
    elif len(metadata["description"]) < 20:
        warnings.append("Description is very short (< 20 chars)")

    if "allowed-tools" not in metadata:
        warnings.append("No 'allowed-tools' specified")

    # Check body content
    if not body or len(body) < 100:
        warnings.append("Skill body is very short (< 100 chars)")

    if "[Add " in body or "[TODO" in body:
        warnings.append("Contains placeholder text ([Add...] or [TODO])")

    # Generate report
    report = [f"Validation Report for '{name}':", ""]

    if errors:
        report.append("❌ ERRORS:")
        report.extend(f"  - {err}" for err in errors)
        report.append("")

    if warnings:
        report.append("⚠️  WARNINGS:")
        report.extend(f"  - {warn}" for warn in warnings)
        report.append("")

    if not errors and not warnings:
        report.append("✓ Skill is valid!")
    elif not errors:
        report.append("✓ Skill has no critical errors (warnings only)")

    return "\n".join(report)

@mcp.tool()
def update_skill_metadata(
    name: str,
    field: str,
    value: str
) -> str:
    """Update skill frontmatter metadata

    Args:
        name: Skill name
        field: Metadata field to update (name, description, allowed-tools)
        value: New value (for allowed-tools, use comma-separated list)
    """
    skill_file = SKILLS_DIR / name / "SKILL.md"

    if not skill_file.exists():
        return f"Error: Skill '{name}' not found"

    content = skill_file.read_text()
    metadata, body = parse_frontmatter(content)

    # Update field
    if field == "allowed-tools":
        metadata[field] = [t.strip() for t in value.split(",")]
    else:
        metadata[field] = value

    # Rebuild frontmatter
    new_frontmatter = "---\n"
    for key, val in metadata.items():
        if key == "allowed-tools":
            new_frontmatter += f"{key}:\n"
            new_frontmatter += "\n".join(f"  - {tool}" for tool in val)
            new_frontmatter += "\n"
        else:
            new_frontmatter += f"{key}: {val}\n"
    new_frontmatter += "---\n\n"

    # Write back
    new_content = new_frontmatter + body
    skill_file.write_text(new_content)

    return f"✓ Updated {field} in skill '{name}'"

@mcp.tool()
def test_skill(name: str, test_prompt: str) -> str:
    """Test skill by invoking it with a prompt

    Args:
        name: Skill name to test
        test_prompt: Test prompt to use with the skill
    """
    skill_file = SKILLS_DIR / name / "SKILL.md"

    if not skill_file.exists():
        return f"Error: Skill '{name}' not found"

    # Read skill content
    content = skill_file.read_text()

    return f"""To test skill '{name}', use the Skill tool in Claude Code:

Skill("{name}")

Then provide this test prompt:
{test_prompt}

The skill will execute with these instructions:
{content[:500]}...

Note: This MCP cannot directly invoke skills - use the Skill tool in Claude Code instead."""

if __name__ == "__main__":
    log("Skill Maker MCP Server starting...")
    mcp.run()
