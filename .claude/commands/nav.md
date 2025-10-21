---
description: View your complete Claude Code setup (agents, skills, MCPs) in a navigable format
---

```javascript
const fs = require('fs');
const path = require('path');

const registryPath = path.join(process.env.HOME, 'claude-vibe-code/setup-navigator/output/registry.json');

try {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║          🔧 CLAUDE CODE SETUP NAVIGATOR                 ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Compact Stats
  const stats = registry.stats;
  console.log(`📊  ${stats.totalAgents} agents  •  ${stats.totalSkills} skills  •  ${stats.enabledPlugins} MCPs\n`);

  // === AGENTS ===
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  AGENTS');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Model Distribution
  const modelCounts = {};
  registry.agents.forEach(a => {
    const m = (a.model || 'unknown').toUpperCase();
    modelCounts[m] = (modelCounts[m] || 0) + 1;
  });

  console.log('🤖 MODEL DISTRIBUTION');
  Object.entries(modelCounts).sort((a,b) => b[1] - a[1]).forEach(([model, count]) => {
    const bar = '█'.repeat(Math.ceil(count / 2));
    console.log(`   ${model.padEnd(8)} ${bar} ${count}`);
  });
  console.log('');

  // Categorize agents with custom mapping
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
    'seo-specialist': 'seo',
    'seo-content-auditor': 'seo',
    'seo-content-planner': 'seo',
    'seo-content-writer': 'seo',
    'seo-keyword-strategist': 'seo',
  };

  const categories = {
    design: [],
    development: [],
    quality: [],
    seo: [],
    other: []
  };

  registry.agents.forEach(agent => {
    const cat = categoryMapping[agent.name] || 'other';
    categories[cat].push(agent);
  });

  // Display categories in specific order
  console.log('📂 AGENTS BY CATEGORY\n');
  ['design', 'development', 'quality', 'seo', 'other'].forEach(catKey => {
    const catAgents = categories[catKey];
    if (catAgents.length === 0) return;

    const catName = catKey.toUpperCase();
    console.log(`   ${catName} (${catAgents.length})`);

    // Group by model within category
    const byModel = {};
    catAgents.forEach(a => {
      const model = (a.model || 'unknown').toLowerCase();
      if (!byModel[model]) byModel[model] = [];
      byModel[model].push(a.name);
    });

    ['opus', 'sonnet', 'haiku', 'unknown'].forEach(model => {
      if (byModel[model]) {
        const names = byModel[model].join(', ');
        console.log(`     ${model}: ${names}`);
      }
    });
    console.log('');
  });

  // === SKILLS ===
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  SKILLS');
  console.log('═══════════════════════════════════════════════════════════\n');

  const skillList = registry.skills.slice(0, 8).map(s => s.name).join(', ');
  const moreSkills = registry.skills.length > 8 ? ` +${registry.skills.length - 8} more` : '';
  console.log(`   ${skillList}${moreSkills}\n`);

  // === MCPs ===
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  MCP SERVERS');
  console.log('═══════════════════════════════════════════════════════════\n');

  const enabledMCPs = Object.entries(registry.plugins)
    .filter(([_, config]) => config.enabled)
    .map(([name]) => name)
    .join(', ');
  console.log(`   ${enabledMCPs}\n`);

  console.log('─────────────────────────────────────────────────────────');
  console.log('💡 setup "query"  •  setup list opus  •  setup analyze');
  console.log('─────────────────────────────────────────────────────────\n');

} catch (error) {
  console.error('❌ Error loading registry:', error.message);
  console.log('\n💡 Run `setup scan` to generate the registry first.\n');
}
```
