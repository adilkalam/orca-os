#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const workflowsDir = path.join(__dirname, '../workflows');
const workflowName = process.argv[2];

if (!workflowName) {
  console.error('Usage: node show-workflow.js <workflow-name>');
  process.exit(1);
}

try {
  const workflowPath = path.join(workflowsDir, `${workflowName}.yml`);
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');
  const workflow = yaml.load(workflowContent);

  console.log(`\n${workflow.icon}  ${workflow.name}`);
  console.log(`${workflow.description}\n`);
  console.log('═══════════════════════════════════════════════════════════\n');

  workflow.phases.forEach((phase, idx) => {
    console.log(`Phase ${idx + 1}: ${phase.name}`);
    console.log(`  Agents: ${phase.agents.join(', ')}`);
    if (phase.skills && phase.skills.length > 0) {
      console.log(`  Skills: ${phase.skills.join(', ')}`);
    }
    if (phase.mcps && phase.mcps.length > 0) {
      console.log(`  MCPs: ${phase.mcps.join(', ')}`);
    }
    console.log(`  Actions:`);
    phase.actions.forEach(action => {
      console.log(`    • ${action}`);
    });
    console.log('');
  });

} catch (error) {
  console.error(`❌ Error loading workflow: ${error.message}`);
  process.exit(1);
}
