#!/bin/bash

# Agent Chaos Monitor - Tracks files created by agents
# Monitors .orchestration/ for agent activity patterns

echo "🤖 Agent Chaos Monitor"
echo "━━━━━━━━━━━━━━━━━━━━"

ORCH_DIR="${CLAUDE_PROJECT_DIR:-.}/.orchestration"

# Check if .orchestration exists
if [[ ! -d "$ORCH_DIR" ]]; then
    echo "No .orchestration directory found"
    exit 0
fi

# Check recent agent activity (files created in last 2 hours)
echo "📊 Recent Agent Activity (last 2 hours):"

# Evidence files
EVIDENCE_COUNT=$(find "$ORCH_DIR/evidence" -type f -mmin -120 2>/dev/null | wc -l || echo "0")
echo "  Evidence files: $EVIDENCE_COUNT"

# Log files
LOG_COUNT=$(find "$ORCH_DIR/logs" -type f -mmin -120 2>/dev/null | wc -l || echo "0")
echo "  Log files: $LOG_COUNT"

# Check for planning documents created by agents
AGENT_PLANS=$(find "$ORCH_DIR" -type f \( -name "*plan*.md" -o -name "*PLAN*.md" -o -name "*implementation*.md" -o -name "*verification*.md" \) -mmin -120 2>/dev/null || true)
if [[ -n "$AGENT_PLANS" ]]; then
    PLAN_COUNT=$(echo "$AGENT_PLANS" | wc -l)
    echo "  ⚠️  Planning documents: $PLAN_COUNT"
    echo "$AGENT_PLANS" | head -5 | sed 's/^/      - /'
    if [[ $PLAN_COUNT -gt 5 ]]; then
        echo "      ... and $((PLAN_COUNT - 5)) more"
    fi
fi

# Check for excessive directory creation
NEW_DIRS=$(find "$ORCH_DIR" -type d -mmin -120 2>/dev/null | grep -v -E "(evidence|logs|signals|playbooks)" || true)
if [[ -n "$NEW_DIRS" ]]; then
    DIR_COUNT=$(echo "$NEW_DIRS" | wc -l)
    if [[ $DIR_COUNT -gt 3 ]]; then
        echo "  ⚠️  New directories created: $DIR_COUNT"
        echo "$NEW_DIRS" | head -3 | sed 's/^/      - /'
    fi
fi

# Check for agent-created files outside proper directories
MISPLACED_FILES=$(find "$ORCH_DIR" -maxdepth 1 -type f -mmin -120 2>/dev/null | grep -v README || true)
if [[ -n "$MISPLACED_FILES" ]]; then
    echo "  ⚠️  Files in root (should be in subdirs):"
    echo "$MISPLACED_FILES" | sed 's/^/      - /'
fi

echo ""

# Agent-specific patterns
echo "🔍 Agent Pattern Detection:"

# Check for meta-orchestrator chaos (creates the most files)
META_ORCH_FILES=$(grep -l "meta-orchestrator" "$ORCH_DIR"/logs/*.log 2>/dev/null | wc -l || echo "0")
if [[ $META_ORCH_FILES -gt 5 ]]; then
    echo "  ⚠️  Meta-orchestrator spawned $META_ORCH_FILES times (excessive?)"
fi

# Check for workflow-orchestrator creating documents
WORKFLOW_DOCS=$(find "$ORCH_DIR" -name "*workflow*.md" -o -name "*orchestration*.md" -mmin -120 2>/dev/null | wc -l || echo "0")
if [[ $WORKFLOW_DOCS -gt 0 ]]; then
    echo "  ⚠️  Workflow-orchestrator created $WORKFLOW_DOCS documents (should only coordinate!)"
fi

# Check for verification agent creating too much evidence
if [[ -d "$ORCH_DIR/evidence" ]]; then
    OLD_EVIDENCE=$(find "$ORCH_DIR/evidence" -type f -mtime +1 2>/dev/null | wc -l || echo "0")
    if [[ $OLD_EVIDENCE -gt 10 ]]; then
        echo "  ⚠️  Old evidence not cleaned: $OLD_EVIDENCE files older than 1 day"
    fi
fi

echo ""

# Recommendations
echo "💡 Recommendations:"

TOTAL_RECENT=$(find "$ORCH_DIR" -type f -mmin -120 2>/dev/null | wc -l || echo "0")
if [[ $TOTAL_RECENT -gt 50 ]]; then
    echo "  🔥 HIGH AGENT CHAOS: $TOTAL_RECENT files in 2 hours!"
    echo "  - Agents are creating too many files"
    echo "  - Check if orchestrator is spawning too many sub-agents"
    echo "  - Run: apply-chaos-prevention-to-agents.sh"
elif [[ $TOTAL_RECENT -gt 20 ]]; then
    echo "  ⚠️  MODERATE CHAOS: $TOTAL_RECENT files in 2 hours"
    echo "  - Monitor agent behavior"
    echo "  - Consider adding chaos prevention rules"
else
    echo "  ✅ Agent activity looks normal"
fi

# Show how to apply chaos prevention
if [[ $PLAN_COUNT -gt 0 ]] || [[ $WORKFLOW_DOCS -gt 0 ]]; then
    echo ""
    echo "📝 To add chaos prevention to agents:"
    echo "  bash ~/.claude/hooks/apply-chaos-prevention-to-agents.sh"
fi