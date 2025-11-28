#!/usr/bin/env python3
"""
Apply approved improvements to agent YAML files.

Usage:
    python3 scripts/apply-improvement.py [--proposals FILE] [--deploy]
"""

import json
import re
import subprocess
import sys
from pathlib import Path
from datetime import datetime

AGENTS_DIR = Path("agents")
DEPLOY_DIR = Path.home() / ".claude" / "agents"

def load_proposals(path: str) -> dict:
    """Load improvement proposals from JSON file."""
    with open(path) as f:
        return json.load(f)

def find_agent_file(agent_name: str) -> Path | None:
    """Find the agent file by name."""
    for agent_file in AGENTS_DIR.rglob("*.md"):
        if agent_file.stem == agent_name or agent_file.stem.replace("-", "_") == agent_name.replace("-", "_"):
            return agent_file
    return None

def add_learned_rule(agent_path: Path, rule: str, proposal_id: str) -> bool:
    """Add a learned rule to an agent's markdown file."""
    content = agent_path.read_text()

    # Check if "Learned Rules" section exists
    learned_rules_pattern = r"## Learned Rules \(Self-Improvement\)"

    if re.search(learned_rules_pattern, content):
        # Add to existing section
        new_rule = f"\n- **[{proposal_id}]**: {rule}"
        content = re.sub(
            learned_rules_pattern,
            f"## Learned Rules (Self-Improvement){new_rule}",
            content,
            count=1
        )
    else:
        # Create new section after frontmatter
        frontmatter_end = content.find("---", content.find("---") + 3)
        if frontmatter_end == -1:
            print(f"Could not find frontmatter end in {agent_path}", file=sys.stderr)
            return False

        new_section = f"""

## Learned Rules (Self-Improvement)
<!-- Auto-generated from improvement proposals. Do not edit manually. -->
- **[{proposal_id}]**: {rule}

"""
        content = content[:frontmatter_end + 3] + new_section + content[frontmatter_end + 3:]

    agent_path.write_text(content)
    return True

def deploy_agent(agent_path: Path) -> bool:
    """Deploy agent file to ~/.claude/agents/."""
    relative_path = agent_path.relative_to(AGENTS_DIR)
    deploy_path = DEPLOY_DIR / relative_path
    deploy_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        deploy_path.write_text(agent_path.read_text())
        return True
    except Exception as e:
        print(f"Failed to deploy {agent_path}: {e}", file=sys.stderr)
        return False

def update_proposal_status(proposals: dict, proposal_id: str, status: str) -> None:
    """Update the status of a proposal."""
    for p in proposals["proposals"]:
        if p["proposal_id"] == proposal_id:
            p["status"] = status
            break

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Apply approved improvements to agents")
    parser.add_argument("--proposals", type=str, default=".claude/orchestration/temp/improvement-proposals.json")
    parser.add_argument("--deploy", action="store_true", help="Deploy changes to ~/.claude/agents/")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done without making changes")
    args = parser.parse_args()

    proposals = load_proposals(args.proposals)
    approved = [p for p in proposals["proposals"] if p["status"] == "approved"]

    if not approved:
        print("No approved proposals to apply")
        return

    print(f"Applying {len(approved)} approved improvements...")

    applied = []
    for proposal in approved:
        agent_name = proposal["agent_name"]
        agent_path = find_agent_file(agent_name)

        if not agent_path:
            print(f"Could not find agent file for: {agent_name}", file=sys.stderr)
            continue

        rule = proposal["recommended_changes"]
        proposal_id = proposal["proposal_id"]

        if args.dry_run:
            print(f"[DRY RUN] Would add rule to {agent_path}: {rule[:50]}...")
            continue

        if add_learned_rule(agent_path, rule, proposal_id):
            print(f"Added rule to {agent_path}")
            applied.append(agent_path)
            update_proposal_status(proposals, proposal_id, "applied")

            if args.deploy:
                if deploy_agent(agent_path):
                    print(f"Deployed {agent_path} to {DEPLOY_DIR}")
                else:
                    print(f"Failed to deploy {agent_path}", file=sys.stderr)

    if not args.dry_run:
        # Save updated proposals
        with open(args.proposals, "w") as f:
            json.dump(proposals, f, indent=2)
        print(f"\nApplied {len(applied)} improvements")
        print(f"Updated proposals file: {args.proposals}")

if __name__ == "__main__":
    main()
