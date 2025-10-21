# Setup Navigator - Quick Start Guide

## 🚀 What is This?

**Setup Navigator** is your discovery tool for Claude Code - inspired by [Agentwise](https://github.com/VibeCodingWithPhil/agentwise). While Agentwise orchestrates multiple agents to build projects, Setup Navigator helps you **discover and understand** your existing Claude Code configuration.

---

## ⚡ Quick Commands

```bash
# 1. Scan your ~/.claude/ directory
node cli/scan.js

# 2. Query with natural language
node cli/query.js "Which agent for iOS development?"
node cli/query.js "pixel-perfect design"
node cli/query.js "SwiftUI optimization"

# 3. Filter by model or category
node cli/query.js --model opus
node cli/query.js --category design

# 4. Generate documentation
node cli/generate-docs.js

# 5. Analyze setup for optimization
node cli/analyze.js
```

---

## 📊 What You Get

### 1. Complete Inventory
- **29 agents** with metadata (model, capabilities, tools)
- **12 skills** categorized by function
- **Slash commands** documented
- **10 enabled plugins** tracked

### 2. Natural Language Search
```bash
$ node cli/query.js "Which agent for pixel-perfect design?"

🤖 AGENTS:
1. design-master (SONNET) - Score: 39
   Comprehensive UI/UX design expert combining pixel-perfect...

2. ui-designer (SONNET) - Score: 26
   A creative and detail-oriented AI UI Designer...

🎨 SKILLS:
1. design-with-precision - Score: 26
   Apply obsessive, pixel-perfect design discipline...
```

### 3. Setup Analysis
```bash
$ node cli/analyze.js

📊 MODEL DISTRIBUTION
Opus: 4 agents (13.8%) @ $15/$75 per M tokens
Sonnet: 22 agents (75.9%) @ $3/$15 per M tokens
Haiku: 3 agents (10.3%) @ $1/$5 per M tokens

💰 COST ANALYSIS
Estimated Monthly Cost: $50-150
Optimization Status: ✅ OPTIMAL

🔍 REDUNDANCY ANALYSIS
⚠️  Found 1 duplicate: agent-organizer appears twice

💡 RECOMMENDATIONS
🟢 Optimal Model Distribution
   Keep using Opus strategically for architecture!
```

### 4. Auto-Generated Documentation
Comprehensive setup summary similar to your SETUP-SUMMARY.md

---

## 🎯 Common Use Cases

### "Which agent should I use for X?"
```bash
# iOS development
node cli/query.js "iOS architecture"
→ swift-architect (Opus), ios-dev (Sonnet)

# Design work
node cli/query.js "pixel-perfect UI"
→ design-master (Sonnet)

# Frontend development
node cli/query.js "React components"
→ frontend-developer, react-pro, nextjs-pro
```

### "Show me all Opus agents"
```bash
node cli/query.js --model opus
→ 4 agents: swift-architect, context-manager, prompt-engineer, quant-analyst
```

### "What's in my setup?"
```bash
node cli/scan.js
→ Complete inventory saved to output/registry.json

node cli/generate-docs.js
→ Full documentation saved to output/SETUP-DOCUMENTATION.md
```

### "Is my setup optimized?"
```bash
node cli/analyze.js
→ Model distribution, cost analysis, redundancy detection,
  optimization recommendations
```

---

## 📁 Output Files

All generated files are in `output/`:

```
output/
├── registry.json                # Complete setup inventory
├── SETUP-DOCUMENTATION.md      # Auto-generated documentation
└── analysis-report.md          # Optimization analysis report
```

---

## 🔮 Future Enhancements

Based on Agentwise architecture, we could add:

1. **MCP Server Integration**
   - Use from Claude Code with natural language
   - "Show me all design agents"
   - "Generate setup documentation"

2. **Advanced Recommendations**
   - Suggest agent consolidations
   - Identify unused agents
   - Optimize model distribution

3. **Workflow Suggestions**
   - Based on your agents, recommend workflows
   - E.g., "For iOS apps: swift-architect → ios-dev → swiftui-specialist"

4. **Agent Usage Tracking**
   - Track which agents you actually use
   - Identify redundant ones

---

## 🎉 Summary

**What We Built:**
✅ Complete setup scanner (29 agents, 12 skills, 10 plugins)
✅ Natural language query engine with fuzzy matching
✅ Comprehensive documentation generator
✅ Setup analyzer with cost optimization
✅ Redundancy detection and recommendations

**Inspired by Agentwise:**
- Multi-agent coordination → Setup discovery
- Token optimization → Cost analysis
- Real-time monitoring → Documentation generation
- Self-improving agents → Setup optimization

---

**Built:** October 20, 2025
**Scanned:** 29 agents, 12 skills, 10 plugins
**Model Distribution:** 13.8% Opus, 75.9% Sonnet ✅ OPTIMAL
