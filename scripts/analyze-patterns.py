#!/usr/bin/env python3
"""
Analyze patterns from Workshop task_history for agent self-improvement.

Usage:
    python3 scripts/analyze-patterns.py [--days 30] [--threshold 3]
"""

import subprocess
import json
import sys
from datetime import datetime, timedelta
from collections import defaultdict
from pathlib import Path

def query_workshop_history(days: int = 30) -> list:
    """Query Workshop for recent task_history entries."""
    # Workshop CLI command to get recent entries
    cmd = [
        "workshop", "--workspace", ".claude/memory",
        "search", "task_history", "--limit", "100"
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode != 0:
            print(f"Workshop query failed: {result.stderr}", file=sys.stderr)
            return []
        # Parse output - Workshop returns JSON or structured text
        # Adjust parsing based on actual Workshop output format
        return parse_workshop_output(result.stdout)
    except Exception as e:
        print(f"Error querying Workshop: {e}", file=sys.stderr)
        return []

def parse_workshop_output(output: str) -> list:
    """Parse Workshop CLI output into structured data."""
    entries = []
    # Workshop outputs structured text - parse accordingly
    # This is a placeholder - adjust based on actual format
    try:
        # Try JSON first
        data = json.loads(output)
        if isinstance(data, list):
            return data
        return [data]
    except json.JSONDecodeError:
        # Parse text format
        pass
    return entries

def identify_patterns(entries: list, threshold: int = 3) -> list:
    """Group issues by agent + type and identify patterns."""
    issue_groups = defaultdict(list)

    for entry in entries:
        if not entry.get("issues"):
            continue
        for issue in entry.get("issues", []):
            key = f"{issue.get('agent', 'unknown')}:{issue.get('type', 'unknown')}"
            issue_groups[key].append({
                "description": issue.get("description", ""),
                "severity": issue.get("severity", "medium"),
                "date": entry.get("timestamp", ""),
                "task": entry.get("task", "")
            })

    patterns = []
    for key, issues in issue_groups.items():
        if len(issues) >= threshold:
            agent, issue_type = key.split(":", 1)
            patterns.append({
                "pattern_id": f"{agent}-{issue_type.replace(' ', '-').lower()}",
                "agent": agent,
                "issue_type": issue_type,
                "occurrences": len(issues),
                "first_seen": min(i["date"] for i in issues if i["date"]),
                "last_seen": max(i["date"] for i in issues if i["date"]),
                "severity": max(issues, key=lambda x: {"high": 3, "medium": 2, "low": 1}.get(x["severity"], 0))["severity"],
                "example_descriptions": list(set(i["description"] for i in issues[:5]))
            })

    return patterns

def generate_proposals(patterns: list) -> dict:
    """Generate improvement proposals from identified patterns."""
    proposals = {
        "version": "1.0",
        "generated": datetime.now().isoformat(),
        "proposals": []
    }

    for pattern in patterns:
        proposal = {
            "proposal_id": f"improve-{pattern['agent']}-{datetime.now().strftime('%Y-%m-%d')}",
            "agent_name": pattern["agent"],
            "issue_description": f"Agent {pattern['agent']} has recurring {pattern['issue_type']} issues ({pattern['occurrences']} occurrences)",
            "recommended_changes": generate_recommendation(pattern),
            "priority": pattern["severity"],
            "example_feedback": pattern["example_descriptions"][0] if pattern["example_descriptions"] else "",
            "pattern_id": pattern["pattern_id"],
            "occurrences": pattern["occurrences"],
            "status": "pending"
        }
        proposals["proposals"].append(proposal)

    return proposals

def generate_recommendation(pattern: dict) -> str:
    """Generate a recommended change based on the pattern."""
    examples = "; ".join(pattern["example_descriptions"][:2])
    return f"Add instruction to {pattern['agent']} prompt to prevent {pattern['issue_type']}. Examples of issues: {examples}"

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Analyze patterns for agent self-improvement")
    parser.add_argument("--days", type=int, default=30, help="Days to look back")
    parser.add_argument("--threshold", type=int, default=3, help="Minimum occurrences for pattern")
    parser.add_argument("--output", type=str, default=".claude/orchestration/temp/improvement-proposals.json")
    args = parser.parse_args()

    print(f"Analyzing patterns from last {args.days} days (threshold: {args.threshold})...")

    entries = query_workshop_history(args.days)
    print(f"Found {len(entries)} task history entries")

    patterns = identify_patterns(entries, args.threshold)
    print(f"Identified {len(patterns)} patterns")

    if patterns:
        proposals = generate_proposals(patterns)
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w") as f:
            json.dump(proposals, f, indent=2)
        print(f"Wrote {len(proposals['proposals'])} proposals to {args.output}")

        # Print summary
        for p in proposals["proposals"]:
            print(f"\n[{p['priority'].upper()}] {p['agent_name']}: {p['issue_description']}")
    else:
        print("No patterns found meeting threshold criteria")

if __name__ == "__main__":
    main()
