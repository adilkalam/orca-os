#!/usr/bin/env node

/**
 * Setup Navigator - Scan CLI
 *
 * Usage: node cli/scan.js [--output <path>]
 */

const SetupScanner = require('../lib/scanner');
const path = require('path');
const fs = require('fs').promises;

async function main() {
  const args = process.argv.slice(2);
  const outputFlag = args.indexOf('--output');
  const outputPath = outputFlag >= 0 && args[outputFlag + 1]
    ? args[outputFlag + 1]
    : path.join(__dirname, '../output/registry.json');

  console.log('🚀 Setup Navigator - Scanning Claude Code Setup\n');

  try {
    // Create scanner
    const scanner = new SetupScanner();

    // Run scan
    const registry = await scanner.scan();

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Save registry
    await scanner.saveRegistry(outputPath);

    // Print agent breakdown
    console.log('\n📋 AGENT BREAKDOWN BY CATEGORY:');
    const agentsByCategory = {};
    registry.agents.forEach(agent => {
      if (!agentsByCategory[agent.category]) {
        agentsByCategory[agent.category] = [];
      }
      agentsByCategory[agent.category].push(agent.name);
    });

    for (const [category, agents] of Object.entries(agentsByCategory).sort()) {
      console.log(`\n${category.toUpperCase()} (${agents.length}):`);
      agents.forEach(name => console.log(`  - ${name}`));
    }

    // Print model distribution
    console.log('\n\n🤖 MODEL DISTRIBUTION:');
    const modelCounts = {};
    registry.agents.forEach(agent => {
      modelCounts[agent.model] = (modelCounts[agent.model] || 0) + 1;
    });

    for (const [model, count] of Object.entries(modelCounts).sort()) {
      const percentage = ((count / registry.agents.length) * 100).toFixed(1);
      console.log(`  ${model}: ${count} agents (${percentage}%)`);
    }

    // Print enabled plugins
    console.log('\n\n🔌 ENABLED PLUGINS:');
    const enabledPlugins = Object.entries(registry.plugins)
      .filter(([_, enabled]) => enabled)
      .map(([name, _]) => name)
      .sort();

    enabledPlugins.forEach(plugin => {
      console.log(`  ✓ ${plugin}`);
    });

    // Render nav view
    console.log('\n🎨 Rendering nav view...');
    const { execSync } = require('child_process');
    try {
      execSync('node cli/render-nav.js', { cwd: __dirname + '/..', stdio: 'inherit' });
    } catch (renderError) {
      console.error('⚠️  Warning: Failed to render nav view:', renderError.message);
    }

    console.log(`\n✅ Complete! Registry saved to:\n   ${outputPath}\n`);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
