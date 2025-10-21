#!/usr/bin/env node

/**
 * Setup Navigator - Query CLI
 *
 * Natural language search for agents, skills, and commands
 *
 * Usage:
 *   node cli/query.js "Which agent for iOS development?"
 *   node cli/query.js "pixel-perfect design"
 *   node cli/query.js --model opus
 *   node cli/query.js --category design
 */

const QueryEngine = require('../lib/query-engine');
const fs = require('fs').promises;
const path = require('path');

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  // Load registry
  const registryPath = path.join(__dirname, '../output/registry.json');

  try {
    const data = await fs.readFile(registryPath, 'utf-8');
    const registry = JSON.parse(data);

    const engine = new QueryEngine(registry);

    // Handle different query types
    if (args.includes('--model')) {
      const modelIndex = args.indexOf('--model');
      const model = args[modelIndex + 1];
      handleModelQuery(engine, model);
    } else if (args.includes('--category')) {
      const catIndex = args.indexOf('--category');
      const category = args[catIndex + 1];
      handleCategoryQuery(engine, category);
    } else if (args.includes('--best')) {
      const task = args.filter(a => !a.startsWith('--')).join(' ');
      handleBestQuery(engine, task);
    } else {
      // Natural language query
      const query = args.join(' ');
      handleNaturalQuery(engine, query);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nMake sure you\'ve run the scanner first:');
    console.error('  node cli/scan.js\n');
    process.exit(1);
  }
}

function handleNaturalQuery(engine, query) {
  console.log(`🔍 Searching for: "${query}"\n`);

  const results = engine.query(query);

  if (results.totalScore === 0) {
    console.log('❌ No results found. Try different keywords.\n');
    console.log('💡 Tips:');
    console.log('  - Try searching for: ios, swift, design, ui, frontend, seo, etc.');
    console.log('  - Use --model opus/sonnet/haiku to filter by model');
    console.log('  - Use --category to filter by category\n');
    return;
  }

  console.log(engine.formatResults(results, 5));

  // Show total stats
  console.log(`\n📊 Total Results: ${results.agents.length + results.skills.length + results.commands.length}`);
  console.log(`   Agents: ${results.agents.length} | Skills: ${results.skills.length} | Commands: ${results.commands.length}\n`);
}

function handleModelQuery(engine, model) {
  console.log(`🤖 Filtering agents by model: ${model.toUpperCase()}\n`);

  const agents = engine.filterByModel(model);

  if (agents.length === 0) {
    console.log(`❌ No agents found with model: ${model}\n`);
    return;
  }

  agents.forEach((agent, i) => {
    console.log(`${i + 1}. ${agent.name}`);
    console.log(`   ${agent.description.substring(0, 120)}...`);
    console.log(`   Category: ${agent.category}\n`);
  });

  console.log(`Found ${agents.length} agent(s) using ${model.toUpperCase()}\n`);
}

function handleCategoryQuery(engine, category) {
  console.log(`📂 Filtering by category: ${category}\n`);

  const results = engine.filterByCategory(category);

  if (results.agents.length > 0) {
    console.log('🤖 AGENTS:\n');
    results.agents.forEach((agent, i) => {
      console.log(`${i + 1}. ${agent.name} (${agent.model.toUpperCase()})`);
      console.log(`   ${agent.description.substring(0, 120)}...`);
      console.log(`   Category: ${agent.category}\n`);
    });
  }

  if (results.skills.length > 0) {
    console.log('🎨 SKILLS:\n');
    results.skills.forEach((skill, i) => {
      console.log(`${i + 1}. ${skill.name}`);
      console.log(`   ${skill.description.substring(0, 120)}...`);
      console.log(`   Category: ${skill.category}\n`);
    });
  }

  console.log(`Found ${results.agents.length} agent(s) and ${results.skills.length} skill(s)\n`);
}

function handleBestQuery(engine, task) {
  console.log(`🎯 Finding best tool for: "${task}"\n`);

  const matches = engine.findBestFor(task);
  console.log(engine.formatBestMatches(matches));
}

function printHelp() {
  console.log(`
🔍 Setup Navigator - Query Tool

USAGE:
  node cli/query.js <search query>
  node cli/query.js --model <opus|sonnet|haiku>
  node cli/query.js --category <category>
  node cli/query.js --best <task description>

EXAMPLES:

  Natural Language Queries:
    node cli/query.js "Which agent for iOS development?"
    node cli/query.js "pixel-perfect design"
    node cli/query.js "SwiftUI optimization"
    node cli/query.js "frontend react components"
    node cli/query.js "SEO optimization"

  Filter by Model:
    node cli/query.js --model opus
    node cli/query.js --model sonnet
    node cli/query.js --model haiku

  Filter by Category:
    node cli/query.js --category ios-development
    node cli/query.js --category design
    node cli/query.js --category frontend

  Best Match:
    node cli/query.js --best "Create pixel-perfect UI from Figma designs"
    node cli/query.js --best "Architect iOS app with MVVM pattern"

QUICK SEARCHES:
  ios, swift, swiftui     → iOS development agents
  design, ui, ux          → Design agents and skills
  frontend, react         → Frontend development
  seo, content            → SEO and content tools
  opus, sonnet            → Filter by AI model

NOTE: Run 'node cli/scan.js' first to build the registry.
`);
}

main();
