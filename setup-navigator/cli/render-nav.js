#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const registryPath = path.join(__dirname, '../output/registry.json');
const outputPath = path.join(__dirname, '../output/nav.md');
const workflowsDir = path.join(__dirname, '../workflows');

try {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const stats = registry.stats;

  let output = '';

  output += '\n╔══════════════════════════════════════════════════════════╗\n';
  output += '║          🔧 CLAUDE CODE SETUP NAVIGATOR                 ║\n';
  output += '╚══════════════════════════════════════════════════════════╝\n\n';

  output += `📊  ${stats.totalAgents} agents  •  ${stats.totalSkills} skills  •  ${stats.enabledPlugins} MCPs\n\n`;

  // === WORKFLOWS ===
  output += '═══════════════════════════════════════════════════════════\n';
  output += '  WORKFLOWS\n';
  output += '═══════════════════════════════════════════════════════════\n\n';

  const workflows = fs.readdirSync(workflowsDir)
    .filter(f => f.endsWith('.yml'))
    .map(f => {
      const content = fs.readFileSync(path.join(workflowsDir, f), 'utf8');
      const workflow = yaml.load(content);
      return {
        id: f.replace('.yml', ''),
        ...workflow
      };
    });

  workflows.forEach(wf => {
    output += `${wf.icon}  ${wf.name}\n`;
    output += `   ${wf.description}\n`;
    output += `   → setup workflow ${wf.id}\n\n`;
  });

  output += '💡 Quick: setup workflow <name> to see full details\n\n';

  // === AGENTS ===
  output += '═══════════════════════════════════════════════════════════\n';
  output += '  AGENTS\n';
  output += '═══════════════════════════════════════════════════════════\n\n';

  // ANSI color codes
  const colors = {
    opus: '\x1b[35m',    // Magenta
    sonnet: '\x1b[36m',  // Cyan
    haiku: '\x1b[33m',   // Yellow
    reset: '\x1b[0m'
  };

  // Categorize agents with custom mapping (move seo-specialist to other)
  const categoryMapping = {
    'design-master': 'design',
    'ui-designer': 'design',
    'ux-designer': 'design',
    'ios-dev': 'development',
    'swift-architect': 'development',
    'swiftui-specialist': 'development',
    'frontend-developer': 'development',
    'nextjs-pro': 'development',
    'react-pro': 'development',
    'mobile-developer': 'development',
    'python-pro': 'development',
    'debugger': 'quality',
    'security-auditor': 'quality',
    'code-reviewer-pro': 'quality',
    'dx-optimizer': 'quality',
    'seo-specialist': 'other', // Moved to other
  };

  // Group agents by model first
  const byModel = {
    opus: [],
    sonnet: [],
    haiku: []
  };

  registry.agents.forEach(agent => {
    const model = (agent.model || 'unknown').toLowerCase();
    if (byModel[model]) {
      byModel[model].push(agent);
    }
  });

  // Display Opus agents
  if (byModel.opus.length > 0) {
    output += `${colors.opus}Opus:${colors.reset}\n`;
    output += '  ' + byModel.opus.map(a => a.name).join(', ') + '\n\n';
  }

  // Display Sonnet agents with categories
  if (byModel.sonnet.length > 0) {
    output += `${colors.sonnet}Sonnet:${colors.reset}\n`;

    const sonnetCategories = {
      design: [],
      development: [],
      quality: [],
      other: []
    };

    byModel.sonnet.forEach(agent => {
      const cat = categoryMapping[agent.name] || 'other';
      sonnetCategories[cat].push(agent.name);
    });

    ['design', 'development', 'quality', 'other'].forEach(catKey => {
      if (sonnetCategories[catKey].length > 0) {
        const catName = catKey.charAt(0).toUpperCase() + catKey.slice(1);
        output += `  ${catName}: ${sonnetCategories[catKey].join(', ')}\n`;
      }
    });
    output += '\n';
  }

  // Display Haiku agents
  if (byModel.haiku.length > 0) {
    output += `${colors.haiku}Haiku:${colors.reset}\n`;
    output += '  ' + byModel.haiku.map(a => a.name).join(', ') + '\n\n';
  }

  // === SKILLS ===
  output += '═══════════════════════════════════════════════════════════\n';
  output += '  SKILLS\n';
  output += '═══════════════════════════════════════════════════════════\n\n';

  const skillList = registry.skills.slice(0, 8).map(s => s.name).join(', ');
  const moreSkills = registry.skills.length > 8 ? ` +${registry.skills.length - 8} more` : '';
  output += `   ${skillList}${moreSkills}\n\n`;

  // === MCPs ===
  output += '═══════════════════════════════════════════════════════════\n';
  output += '  MCP SERVERS\n';
  output += '═══════════════════════════════════════════════════════════\n\n';

  const enabledMCPs = Object.entries(registry.plugins)
    .filter(([_, config]) => config.enabled)
    .map(([name]) => name)
    .join(', ');
  output += `   ${enabledMCPs}\n\n`;

  output += '─────────────────────────────────────────────────────────\n';
  output += '💡 setup "query"  •  setup list opus  •  setup analyze\n';
  output += '─────────────────────────────────────────────────────────\n';

  fs.writeFileSync(outputPath, output, 'utf8');
  console.log('✅ Nav view rendered to output/nav.md');

} catch (error) {
  console.error('❌ Error rendering nav:', error.message);
  process.exit(1);
}
