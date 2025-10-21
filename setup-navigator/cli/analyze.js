#!/usr/bin/env node

/**
 * Setup Navigator - Setup Analyzer
 *
 * Analyzes your Claude Code setup for:
 * - Redundancies and overlaps
 * - Cost optimization opportunities
 * - Model distribution
 * - Unused or duplicate agents
 *
 * Usage: node cli/analyze.js
 */

const fs = require('fs').promises;
const path = require('path');

async function main() {
  console.log('🔬 Setup Navigator - Analyzing Your Setup\n');

  const registryPath = path.join(__dirname, '../output/registry.json');

  try {
    const data = await fs.readFile(registryPath, 'utf-8');
    const registry = JSON.parse(data);

    const analysis = analyzeSetup(registry);

    printAnalysis(analysis);

    // Save analysis report
    const reportPath = path.join(__dirname, '../output/analysis-report.md');
    const report = generateReport(analysis, registry);
    await fs.writeFile(reportPath, report, 'utf-8');

    console.log(`\n✅ Analysis complete! Report saved to:`);
    console.log(`   ${reportPath}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nMake sure you\'ve run the scanner first:');
    console.error('  node cli/scan.js\n');
    process.exit(1);
  }
}

function analyzeSetup(registry) {
  const analysis = {
    modelDistribution: analyzeModelDistribution(registry.agents),
    categoryDistribution: analyzeCategoryDistribution(registry.agents),
    costs: analyzeCosts(registry.agents),
    redundancies: findRedundancies(registry.agents),
    duplicates: findDuplicates(registry.agents),
    recommendations: [],
    strengths: [],
    warnings: []
  };

  // Generate recommendations
  analysis.recommendations = generateRecommendations(analysis, registry);

  return analysis;
}

function analyzeModelDistribution(agents) {
  const distribution = {
    opus: { count: 0, agents: [], percentage: 0 },
    sonnet: { count: 0, agents: [], percentage: 0 },
    haiku: { count: 0, agents: [], percentage: 0 }
  };

  agents.forEach(agent => {
    const model = agent.model.toLowerCase();
    if (distribution[model]) {
      distribution[model].count++;
      distribution[model].agents.push(agent.name);
    }
  });

  // Calculate percentages
  const total = agents.length;
  Object.keys(distribution).forEach(model => {
    distribution[model].percentage = ((distribution[model].count / total) * 100).toFixed(1);
  });

  return distribution;
}

function analyzeCategoryDistribution(agents) {
  const categories = {};

  agents.forEach(agent => {
    if (!categories[agent.category]) {
      categories[agent.category] = [];
    }
    categories[agent.category].push({
      name: agent.name,
      model: agent.model,
      size: agent.size
    });
  });

  return categories;
}

function analyzeCosts(agents) {
  const modelCosts = {
    opus: { input: 15, output: 75, count: 0 },
    sonnet: { input: 3, output: 15, count: 0 },
    haiku: { input: 1, output: 5, count: 0 }
  };

  agents.forEach(agent => {
    const model = agent.model.toLowerCase();
    if (modelCosts[model]) {
      modelCosts[model].count++;
    }
  });

  // Calculate percentages
  const opusPercentage = agents.length > 0 ? modelCosts.opus.count / agents.length : 0;
  const sonnetPercentage = agents.length > 0 ? modelCosts.sonnet.count / agents.length : 0;
  const haikuPercentage = agents.length > 0 ? modelCosts.haiku.count / agents.length : 0;

  return {
    opus: modelCosts.opus,
    sonnet: modelCosts.sonnet,
    haiku: modelCosts.haiku,
    distribution: { opusPercentage, sonnetPercentage, haikuPercentage },
    estimated: {
      low: 50,
      high: 150,
      optimal: opusPercentage < 0.2 && sonnetPercentage > 0.7
    }
  };
}

function findRedundancies(agents) {
  const redundancies = [];

  // Group agents by similar names
  const groups = {};

  agents.forEach(agent => {
    const baseName = agent.name.toLowerCase()
      .replace(/-pro$/, '')
      .replace(/-expert$/, '')
      .replace(/-specialist$/, '')
      .replace(/-developer$/, '');

    if (!groups[baseName]) {
      groups[baseName] = [];
    }
    groups[baseName].push(agent);
  });

  // Find groups with multiple agents
  Object.entries(groups).forEach(([base, agentList]) => {
    if (agentList.length > 1) {
      redundancies.push({
        baseName: base,
        agents: agentList.map(a => ({
          name: a.name,
          model: a.model,
          category: a.category,
          size: a.size
        })),
        count: agentList.length
      });
    }
  });

  return redundancies;
}

function findDuplicates(agents) {
  const duplicates = [];
  const seen = {};

  agents.forEach(agent => {
    const key = `${agent.name}-${agent.category}`;

    if (seen[key]) {
      duplicates.push({
        name: agent.name,
        instances: [seen[key], agent],
        category: agent.category
      });
    } else {
      seen[key] = agent;
    }
  });

  return duplicates;
}

function generateRecommendations(analysis, registry) {
  const recommendations = [];

  // Cost optimization
  if (analysis.modelDistribution.opus.percentage > 20) {
    recommendations.push({
      type: 'cost',
      priority: 'high',
      title: 'Reduce Opus Usage',
      message: `You're using Opus for ${analysis.modelDistribution.opus.percentage}% of agents. Consider moving some to Sonnet for cost savings.`,
      impact: 'Could save $30-80/month',
      agents: analysis.modelDistribution.opus.agents
    });
  }

  // Leamas category overload
  if (analysis.categoryDistribution.leamas && analysis.categoryDistribution.leamas.length > 15) {
    recommendations.push({
      type: 'organization',
      priority: 'medium',
      title: 'Consolidate Leamas Agents',
      message: `You have ${analysis.categoryDistribution.leamas.length} agents in the 'leamas' category. Consider consolidating similar ones.`,
      impact: 'Easier navigation and faster agent selection',
      count: analysis.categoryDistribution.leamas.length
    });
  }

  // Redundancies found
  if (analysis.redundancies.length > 0) {
    recommendations.push({
      type: 'redundancy',
      priority: 'medium',
      title: 'Potential Redundant Agents',
      message: `Found ${analysis.redundancies.length} groups of potentially redundant agents.`,
      impact: 'Simplify setup and reduce confusion',
      redundancies: analysis.redundancies
    });
  }

  // Duplicates found
  if (analysis.duplicates.length > 0) {
    recommendations.push({
      type: 'duplicate',
      priority: 'high',
      title: 'Duplicate Agents Detected',
      message: `Found ${analysis.duplicates.length} duplicate agent(s).`,
      impact: 'Remove duplicates to avoid conflicts',
      duplicates: analysis.duplicates
    });
  }

  // Positive feedback for good distribution
  if (analysis.costs && analysis.costs.estimated && analysis.costs.estimated.optimal) {
    recommendations.push({
      type: 'strength',
      priority: 'info',
      title: 'Optimal Model Distribution',
      message: 'Your model distribution is cost-optimized! Keep using Opus strategically for architecture.',
      impact: 'Already optimized'
    });
  }

  return recommendations;
}

function printAnalysis(analysis) {
  console.log('═'.repeat(60));
  console.log('📊 MODEL DISTRIBUTION');
  console.log('═'.repeat(60));

  // Debug: Check analysis.costs structure
  if (!analysis.costs) {
    console.error('ERROR: analysis.costs is undefined');
    return;
  }

  Object.entries(analysis.modelDistribution).forEach(([model, data]) => {
    const costInfo = analysis.costs[model];
    if (!costInfo) {
      console.error(`ERROR: No cost info for model: ${model}`);
      console.error(`Available costs keys:`, Object.keys(analysis.costs));
      return;
    }
    console.log(`\n${model.toUpperCase()}:`);
    console.log(`  Count: ${data.count} agents (${data.percentage}%)`);
    console.log(`  Cost: $${costInfo.input}/$${costInfo.output} per M tokens`);
    if (data.agents.length > 0) {
      console.log(`  Agents: ${data.agents.slice(0, 5).join(', ')}${data.agents.length > 5 ? '...' : ''}`);
    }
  });

  console.log('\n' + '═'.repeat(60));
  console.log('💰 COST ANALYSIS');
  console.log('═'.repeat(60));
  console.log(`\nEstimated Monthly Cost: $${analysis.costs.estimated.low}-${analysis.costs.estimated.high}`);
  console.log(`Optimization Status: ${analysis.costs.estimated.optimal ? '✅ OPTIMAL' : '⚠️  CAN BE IMPROVED'}`);

  console.log('\n' + '═'.repeat(60));
  console.log('📂 CATEGORY DISTRIBUTION');
  console.log('═'.repeat(60));

  Object.entries(analysis.categoryDistribution)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, agents]) => {
      console.log(`\n${category.toUpperCase()} (${agents.length} agents):`);
      agents.slice(0, 5).forEach(a => {
        console.log(`  - ${a.name} (${a.model})`);
      });
      if (agents.length > 5) {
        console.log(`  ... and ${agents.length - 5} more`);
      }
    });

  console.log('\n' + '═'.repeat(60));
  console.log('🔍 REDUNDANCY ANALYSIS');
  console.log('═'.repeat(60));

  if (analysis.redundancies.length === 0) {
    console.log('\n✅ No obvious redundancies found!');
  } else {
    console.log(`\n⚠️  Found ${analysis.redundancies.length} potential redundancy group(s):\n`);
    analysis.redundancies.forEach((group, i) => {
      console.log(`${i + 1}. ${group.baseName} (${group.count} agents):`);
      group.agents.forEach(a => {
        console.log(`   - ${a.name} (${a.model}, ${(a.size / 1024).toFixed(1)} KB)`);
      });
      console.log('');
    });
  }

  if (analysis.duplicates.length > 0) {
    console.log('⚠️  DUPLICATES DETECTED:\n');
    analysis.duplicates.forEach((dup, i) => {
      console.log(`${i + 1}. ${dup.name} appears multiple times`);
    });
    console.log('');
  }

  console.log('═'.repeat(60));
  console.log('💡 RECOMMENDATIONS');
  console.log('═'.repeat(60) + '\n');

  analysis.recommendations.forEach((rec, i) => {
    const icon = rec.priority === 'high' ? '🔴' :
                 rec.priority === 'medium' ? '🟡' :
                 '🟢';

    console.log(`${icon} ${rec.title}`);
    console.log(`   ${rec.message}`);
    console.log(`   Impact: ${rec.impact}\n`);
  });
}

function generateReport(analysis, registry) {
  const date = new Date().toLocaleDateString();

  return `# Setup Analysis Report

**Generated:** ${date}
**Total Agents:** ${registry.agents.length}
**Total Skills:** ${registry.skills.length}

---

## 📊 MODEL DISTRIBUTION

${Object.entries(analysis.modelDistribution).map(([model, data]) => `
### ${model.toUpperCase()}
- **Count:** ${data.count} agents (${data.percentage}%)
- **Cost:** $${analysis.costs[model].input}/$${analysis.costs[model].output} per million tokens
- **Agents:** ${data.agents.join(', ')}
`).join('\n')}

---

## 💰 COST ANALYSIS

- **Estimated Monthly Cost:** $${analysis.costs.estimated.low}-${analysis.costs.estimated.high}
- **Optimization Status:** ${analysis.costs.estimated.optimal ? '✅ OPTIMAL' : '⚠️ CAN BE IMPROVED'}

${analysis.costs.estimated.optimal ? `
Your model distribution is cost-optimized with ${analysis.modelDistribution.opus.percentage}% Opus and ${analysis.modelDistribution.sonnet.percentage}% Sonnet.
` : `
**Recommendation:** Consider reducing Opus usage to <20% of agents for better cost efficiency.
`}

---

## 📂 CATEGORY BREAKDOWN

${Object.entries(analysis.categoryDistribution)
  .sort((a, b) => b[1].length - a[1].length)
  .map(([cat, agents]) => `
### ${cat.toUpperCase()} (${agents.length} agents)

${agents.map(a => `- **${a.name}** (${a.model}, ${(a.size / 1024).toFixed(1)} KB)`).join('\n')}
`).join('\n')}

---

## 🔍 REDUNDANCY ANALYSIS

${analysis.redundancies.length === 0 ? '✅ No obvious redundancies detected.' : `
Found ${analysis.redundancies.length} potential redundancy group(s):

${analysis.redundancies.map(g => `
### ${g.baseName} (${g.count} agents)
${g.agents.map(a => `- ${a.name} (${a.model}, ${(a.size / 1024).toFixed(1)} KB)`).join('\n')}
`).join('\n')}
`}

${analysis.duplicates.length > 0 ? `
### ⚠️ DUPLICATES

${analysis.duplicates.map(d => `- ${d.name} (appears ${d.instances.length} times)`).join('\n')}
` : ''}

---

## 💡 RECOMMENDATIONS

${analysis.recommendations.map((rec, i) => `
### ${i + 1}. ${rec.title} (${rec.priority.toUpperCase()} PRIORITY)

${rec.message}

**Impact:** ${rec.impact}
`).join('\n')}

---

**Generated by Setup Navigator**
`;
}

main();
