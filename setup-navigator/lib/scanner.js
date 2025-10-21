/**
 * Setup Navigator - Scanner
 *
 * Scans ~/.claude/ directory and extracts all agents, skills, commands, and plugins
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class SetupScanner {
  constructor() {
    this.claudeDir = path.join(os.homedir(), '.claude');
    this.registry = {
      agents: [],
      skills: [],
      commands: [],
      plugins: {},
      settings: {},
      stats: {
        totalAgents: 0,
        totalSkills: 0,
        totalCommands: 0,
        enabledPlugins: 0,
        scannedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Main scan method - scans entire ~/.claude/ directory
   */
  async scan() {
    console.log('🔍 Scanning Claude Code setup...\n');

    try {
      // Scan agents
      await this.scanAgents();

      // Scan skills
      await this.scanSkills();

      // Scan commands
      await this.scanCommands();

      // Scan settings and plugins
      await this.scanSettings();

      // Update stats
      this.updateStats();

      console.log('\n✅ Scan complete!');
      this.printSummary();

      return this.registry;
    } catch (error) {
      console.error('❌ Scan failed:', error.message);
      throw error;
    }
  }

  /**
   * Scan all agents in ~/.claude/agents/
   */
  async scanAgents() {
    console.log('📂 Scanning agents...');
    const agentsDir = path.join(this.claudeDir, 'agents');

    try {
      const entries = await this.getAllMarkdownFiles(agentsDir);

      for (const file of entries) {
        try {
          const agent = await this.parseAgentFile(file);
          if (agent) {
            this.registry.agents.push(agent);
            console.log(`  ✓ ${agent.name}`);
          }
        } catch (error) {
          console.error(`  ⚠️  Failed to parse ${path.basename(file)}: ${error.message}`);
        }
      }

      console.log(`  Found ${this.registry.agents.length} agents\n`);
    } catch (error) {
      console.error(`  ⚠️  Agents directory not found: ${error.message}\n`);
    }
  }

  /**
   * Scan all skills in ~/.claude/skills/
   */
  async scanSkills() {
    console.log('🎨 Scanning skills...');
    const skillsDir = path.join(this.claudeDir, 'skills');

    try {
      const entries = await fs.readdir(skillsDir, { withFileTypes: true });
      const skillDirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'));

      for (const dir of skillDirs) {
        try {
          const skill = await this.parseSkillDir(path.join(skillsDir, dir.name));
          if (skill) {
            this.registry.skills.push(skill);
            console.log(`  ✓ ${skill.name}`);
          }
        } catch (error) {
          console.error(`  ⚠️  Failed to parse ${dir.name}: ${error.message}`);
        }
      }

      console.log(`  Found ${this.registry.skills.length} skills\n`);
    } catch (error) {
      console.error(`  ⚠️  Skills directory not found: ${error.message}\n`);
    }
  }

  /**
   * Scan all commands in ~/.claude/commands/
   */
  async scanCommands() {
    console.log('⚡ Scanning commands...');
    const commandsDir = path.join(this.claudeDir, 'commands');

    try {
      const entries = await this.getAllMarkdownFiles(commandsDir);

      for (const file of entries) {
        try {
          const command = await this.parseCommandFile(file);
          if (command) {
            this.registry.commands.push(command);
            console.log(`  ✓ /${command.name}`);
          }
        } catch (error) {
          console.error(`  ⚠️  Failed to parse ${path.basename(file)}: ${error.message}`);
        }
      }

      console.log(`  Found ${this.registry.commands.length} commands\n`);
    } catch (error) {
      console.error(`  ⚠️  Commands directory not found: ${error.message}\n`);
    }
  }

  /**
   * Scan settings.json for plugins and configuration
   */
  async scanSettings() {
    console.log('⚙️  Scanning settings...');
    const settingsPath = path.join(this.claudeDir, 'settings.json');

    try {
      const content = await fs.readFile(settingsPath, 'utf-8');
      const settings = JSON.parse(content);

      this.registry.settings = settings;
      this.registry.plugins = settings.enabledPlugins || {};

      const enabledCount = Object.values(this.registry.plugins).filter(Boolean).length;
      console.log(`  Found ${enabledCount} enabled plugins\n`);
    } catch (error) {
      console.error(`  ⚠️  Settings file not found: ${error.message}\n`);
    }
  }

  /**
   * Get all .md files recursively from a directory
   */
  async getAllMarkdownFiles(dir) {
    const files = [];

    async function scan(currentDir) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await scan(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    }

    await scan(dir);
    return files;
  }

  /**
   * Parse agent .md file and extract metadata
   */
  async parseAgentFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.md');

    // Extract YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const metadata = frontmatterMatch ? this.parseYAML(frontmatterMatch[1]) : {};

    // Extract key information
    const agent = {
      name: metadata.name || fileName,
      file: filePath,
      description: metadata.description || this.extractDescription(content),
      model: metadata.model || 'sonnet',
      tools: metadata.tools || [],
      dependencies: metadata.dependencies || [],
      color: metadata.color || null,
      size: (await fs.stat(filePath)).size,
      capabilities: this.extractCapabilities(content),
      category: this.categorizeAgent(filePath, metadata.name || fileName)
    };

    return agent;
  }

  /**
   * Parse skill directory and extract metadata
   */
  async parseSkillDir(skillPath) {
    const skillName = path.basename(skillPath);
    const skillFile = path.join(skillPath, 'SKILL.md');

    try {
      const content = await fs.readFile(skillFile, 'utf-8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      const metadata = frontmatterMatch ? this.parseYAML(frontmatterMatch[1]) : {};

      return {
        name: metadata.name || skillName,
        path: skillPath,
        description: metadata.description || this.extractDescription(content),
        files: await this.getSkillFiles(skillPath),
        category: this.categorizeSkill(skillName)
      };
    } catch (error) {
      // Skill might not have SKILL.md, try to infer from directory name
      return {
        name: skillName,
        path: skillPath,
        description: `Skill: ${skillName}`,
        files: await this.getSkillFiles(skillPath),
        category: this.categorizeSkill(skillName)
      };
    }
  }

  /**
   * Parse command .md file and extract metadata
   */
  async parseCommandFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.md');

    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const metadata = frontmatterMatch ? this.parseYAML(frontmatterMatch[1]) : {};

    return {
      name: fileName,
      file: filePath,
      description: metadata.description || this.extractDescription(content),
      allowedTools: metadata['allowed-tools'] || [],
      category: this.categorizeCommand(fileName)
    };
  }

  /**
   * Simple YAML parser for frontmatter
   */
  parseYAML(yaml) {
    const obj = {};
    const lines = yaml.split('\n');

    for (const line of lines) {
      const match = line.match(/^(\w+(?:-\w+)*):(.*)$/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();

        // Handle arrays
        if (value.startsWith('[') && value.endsWith(']')) {
          value = JSON.parse(value.replace(/'/g, '"'));
        }
        // Handle quoted strings
        else if ((value.startsWith('"') && value.endsWith('"')) ||
                 (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        obj[key] = value;
      }
    }

    return obj;
  }

  /**
   * Extract description from content (first paragraph or summary)
   */
  extractDescription(content) {
    // Remove frontmatter
    const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');

    // Get first non-empty paragraph
    const paragraphs = withoutFrontmatter.split('\n\n');
    for (const p of paragraphs) {
      const text = p.trim().replace(/^#+\s+/, ''); // Remove headers
      if (text && text.length > 10 && !text.startsWith('#')) {
        return text.substring(0, 200);
      }
    }

    return 'No description available';
  }

  /**
   * Extract capabilities from agent content
   */
  extractCapabilities(content) {
    const capabilities = [];

    // Look for capability patterns
    const patterns = [
      /##\s*(?:Core\s+)?Capabilities?\s*\n([\s\S]*?)(?=\n##|$)/i,
      /##\s*(?:Core\s+)?Expertise\s*\n([\s\S]*?)(?=\n##|$)/i,
      /##\s*What\s+I\s+Do\s*\n([\s\S]*?)(?=\n##|$)/i
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        const text = match[1];
        // Extract bullet points
        const bullets = text.match(/^[-*]\s+(.+)$/gm);
        if (bullets) {
          capabilities.push(...bullets.map(b => b.replace(/^[-*]\s+/, '').trim()));
        }
      }
    }

    return capabilities.slice(0, 10); // Limit to 10 capabilities
  }

  /**
   * Get all files in a skill directory
   */
  async getSkillFiles(skillPath) {
    try {
      const entries = await fs.readdir(skillPath, { withFileTypes: true });
      return entries
        .filter(e => e.isFile())
        .map(e => e.name);
    } catch (error) {
      return [];
    }
  }

  /**
   * Categorize agent based on name and path
   */
  categorizeAgent(filePath, name) {
    const lowerName = name.toLowerCase();
    const pathStr = filePath.toLowerCase();

    if (pathStr.includes('leamas')) return 'leamas';
    if (lowerName.includes('ios') || lowerName.includes('swift')) return 'ios-development';
    if (lowerName.includes('design') || lowerName.includes('ui') || lowerName.includes('ux')) return 'design';
    if (lowerName.includes('seo')) return 'seo';
    if (lowerName.includes('agent-organizer') || lowerName.includes('orchestr')) return 'orchestration';
    if (lowerName.includes('frontend') || lowerName.includes('react') || lowerName.includes('nextjs')) return 'frontend';
    if (lowerName.includes('backend')) return 'backend';
    if (lowerName.includes('mobile')) return 'mobile';

    return 'general';
  }

  /**
   * Categorize skill based on name
   */
  categorizeSkill(name) {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('uxscii') || lowerName.includes('design')) return 'design';
    if (lowerName.includes('superpowers')) return 'workflow';
    if (lowerName.includes('youtube') || lowerName.includes('article')) return 'content';
    if (lowerName.includes('javascript') || lowerName.includes('typescript')) return 'development';

    return 'general';
  }

  /**
   * Categorize command based on name
   */
  categorizeCommand(name) {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('git')) return 'git';
    if (lowerName.includes('agent') || lowerName.includes('workflow')) return 'workflow';
    if (lowerName.includes('enhance')) return 'optimization';

    return 'general';
  }

  /**
   * Update registry stats
   */
  updateStats() {
    this.registry.stats.totalAgents = this.registry.agents.length;
    this.registry.stats.totalSkills = this.registry.skills.length;
    this.registry.stats.totalCommands = this.registry.commands.length;
    this.registry.stats.enabledPlugins = Object.values(this.registry.plugins).filter(Boolean).length;
  }

  /**
   * Print scan summary
   */
  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 SCAN SUMMARY');
    console.log('='.repeat(50));
    console.log(`Agents:   ${this.registry.stats.totalAgents}`);
    console.log(`Skills:   ${this.registry.stats.totalSkills}`);
    console.log(`Commands: ${this.registry.stats.totalCommands}`);
    console.log(`Plugins:  ${this.registry.stats.enabledPlugins} enabled`);
    console.log('='.repeat(50) + '\n');
  }

  /**
   * Save registry to file
   */
  async saveRegistry(outputPath) {
    await fs.writeFile(
      outputPath,
      JSON.stringify(this.registry, null, 2),
      'utf-8'
    );
    console.log(`✅ Registry saved to ${outputPath}`);
  }
}

module.exports = SetupScanner;
