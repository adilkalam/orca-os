#!/bin/bash

# Apply Chaos Prevention Rules to Agent Files
# Adds chaos prevention section to agent markdown files

AGENTS_DIR="${1:-/Users/adilkalam/claude-vibe-code/agents}"
APPLIED_COUNT=0
SKIPPED_COUNT=0

echo "🛡️  Applying Chaos Prevention to Agents"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Chaos prevention text for regular agents
CHAOS_PREVENTION_REGULAR='
## Chaos Prevention
- Max 2 files per task (implementation + test)
- NO planning documents (PLAN.md, TODO.md, etc.)
- Delete temp files immediately
- Evidence in .orchestration/evidence/ only
- Tag with #FILE_CREATED for tracking
- Remember: Previous Claude created 94,000 files. Don'\''t be that Claude.'

# Chaos prevention text for orchestrator agents
CHAOS_PREVENTION_ORCHESTRATOR='
## Chaos Prevention - Orchestrator Rules
YOU coordinate, you don'\''t create documents about coordination:
❌ NO creating orchestration-plan.md
❌ NO creating workflow-summary.md
❌ NO creating agent-coordination-log.md
✅ Use TodoWrite for tracking
✅ Use agent outputs as evidence
✅ Coordinate through Task tool only
- Remember: Previous Claude created 94,000 files. Don'\''t be that Claude.'

# Function to add chaos prevention to a file
add_chaos_prevention() {
    local file="$1"
    local agent_name=$(basename "$file" .md)

    # Skip if already has chaos prevention
    if grep -q "Chaos Prevention" "$file" 2>/dev/null; then
        echo "  ⏭️  $agent_name - already has chaos prevention"
        ((SKIPPED_COUNT++))
        return
    fi

    # Skip non-agent files
    if [[ "$agent_name" == "README" ]] || [[ "$agent_name" == "CHAOS_PREVENTION_DIRECTIVE" ]] || [[ "$agent_name" == "IO_CONTRACT_TEMPLATE" ]] || [[ "$agent_name" == "POLICY_ANCHORS" ]]; then
        return
    fi

    # Determine which version to use
    if [[ "$file" == *"orchestrat"* ]] || [[ "$file" == *"workflow"* ]] || [[ "$file" == *"coordinator"* ]]; then
        echo "  🎯 $agent_name - applying orchestrator rules"
        echo "$CHAOS_PREVENTION_ORCHESTRATOR" >> "$file"
    else
        echo "  ✅ $agent_name - applying standard rules"
        echo "$CHAOS_PREVENTION_REGULAR" >> "$file"
    fi

    ((APPLIED_COUNT++))
}

# Process all agent markdown files
find "$AGENTS_DIR" -name "*.md" -type f | while read -r agent_file; do
    add_chaos_prevention "$agent_file"
done

echo ""
echo "📊 Summary:"
echo "  Applied to: $APPLIED_COUNT agents"
echo "  Skipped: $SKIPPED_COUNT agents (already had rules)"
echo ""
echo "✅ Chaos prevention rules applied!"
echo ""
echo "Note: Agents will now be limited to:"
echo "  - Max 2 files per task"
echo "  - No planning documents"
echo "  - Proper evidence tracking"