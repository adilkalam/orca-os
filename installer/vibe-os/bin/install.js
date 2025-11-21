#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..');

const HOME = os.homedir();
const CLAUDE_DIR = join(HOME, '.claude');
const CLAUDE_CONFIG = join(HOME, '.claude.json');

// ASCII art banner
const banner = `
${chalk.cyan(`
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓███████▓▒░░▒▓████████▓▒░       ░▒▓██████▓▒░ ░▒▓███████▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░
 ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░
 ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░░▒▓██████▓▒░        ░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░
  ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░
  ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░
   ░▒▓██▓▒░  ░▒▓█▓▒░▒▓███████▓▒░░▒▓████████▓▒░       ░▒▓██████▓▒░░▒▓███████▓▒░
`)}
${chalk.bold.white('Vibe OS 2.0 Installer')}
${chalk.gray('Context-aware, memory-persistent orchestration for Claude Code')}
`;

// Check prerequisites
async function checkPrerequisites() {
  const spinner = ora('Checking prerequisites...').start();
  const issues = [];

  // Check Claude Code
  try {
    const claudeConfigExists = await fs.pathExists(CLAUDE_CONFIG);
    if (!claudeConfigExists) {
      issues.push('Claude Code not found (missing ~/.claude.json)');
    }
  } catch (err) {
    issues.push('Cannot access Claude Code configuration');
  }

  // Check Python
  try {
    const { stdout } = await execa('python3', ['--version']);
    const version = stdout.match(/\d+\.\d+/)?.[0];
    if (parseFloat(version) < 3.8) {
      issues.push(`Python 3.8+ required (found ${version})`);
    }
  } catch {
    issues.push('Python 3.8+ not found');
  }

  // Check Node.js
  try {
    const nodeVersion = process.version.match(/\d+/)?.[0];
    if (parseInt(nodeVersion) < 18) {
      issues.push(`Node.js 18+ required (found ${process.version})`);
    }
  } catch {
    issues.push('Node.js 18+ not found');
  }

  if (issues.length > 0) {
    spinner.fail('Prerequisites check failed');
    console.log(chalk.red('\n⚠️  Missing requirements:\n'));
    issues.forEach(issue => console.log(chalk.yellow(`  • ${issue}`)));
    console.log(chalk.gray('\nPlease install missing requirements and try again.\n'));
    process.exit(1);
  }

  spinner.succeed('Prerequisites check passed');
}

// Prompt user for configuration
async function promptConfig() {
  console.log(chalk.bold('\n📋 Configuration\n'));

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'installWorkshop',
      message: 'Install Workshop CLI (required for memory)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'configureGlobal',
      message: 'Configure global settings (~/.claude/)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'initCurrentProject',
      message: 'Initialize current directory as Vibe OS project?',
      default: true
    }
  ]);

  return answers;
}

// Install Workshop CLI
async function installWorkshop() {
  const spinner = ora('Installing Workshop CLI...').start();

  try {
    // Check if cargo is available
    try {
      await execa('cargo', ['--version']);
      await execa('cargo', ['install', 'workshop-cli']);
      spinner.succeed('Workshop CLI installed via cargo');
      return true;
    } catch {
      spinner.text = 'Cargo not found, downloading binary...';

      // Download binary based on platform
      const platform = os.platform();
      const arch = os.arch();

      if (platform === 'darwin' && arch === 'arm64') {
        // Download macOS ARM binary
        spinner.info('Please install Workshop CLI manually:');
        console.log(chalk.gray('  cargo install workshop-cli'));
        console.log(chalk.gray('  or download from: https://github.com/zachswift615/workshop'));
        return false;
      }

      spinner.warn('Workshop CLI installation requires cargo or manual binary download');
      return false;
    }
  } catch (err) {
    spinner.fail('Workshop CLI installation failed');
    console.log(chalk.yellow(`\n⚠️  ${err.message}`));
    console.log(chalk.gray('\nYou can install manually later with: cargo install workshop-cli\n'));
    return false;
  }
}

// Copy MCP servers
async function copyMCPServers() {
  const spinner = ora('Installing MCP servers...').start();

  const mcpDir = join(CLAUDE_DIR, 'mcp');
  await fs.ensureDir(mcpDir);

  const servers = ['project-context', 'shared-context', 'vibe-memory'];

  for (const server of servers) {
    const src = join(packageRoot, 'templates', 'mcp', server);
    const dest = join(mcpDir, server);

    try {
      await fs.copy(src, dest, { overwrite: false });
      spinner.text = `Installed ${server} MCP server`;
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
      spinner.text = `Skipped ${server} (already exists)`;
    }
  }

  spinner.succeed(`MCP servers installed (${servers.length})`);
}

// Copy commands
async function copyCommands() {
  const spinner = ora('Installing commands...').start();

  const commandsDir = join(CLAUDE_DIR, 'commands');
  await fs.ensureDir(commandsDir);

  const src = join(packageRoot, 'templates', 'commands');
  const files = await fs.readdir(src);

  for (const file of files) {
    const srcPath = join(src, file);
    const destPath = join(commandsDir, file);

    try {
      await fs.copy(srcPath, destPath, { overwrite: false });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }

  spinner.succeed(`Commands installed (${files.length})`);
}

// Copy agents
async function copyAgents() {
  const spinner = ora('Installing agents...').start();

  const agentsDir = join(CLAUDE_DIR, 'agents');
  await fs.ensureDir(agentsDir);

  const src = join(packageRoot, 'templates', 'agents');

  await fs.copy(src, agentsDir, {
    overwrite: false,
    filter: (srcPath) => {
      // Skip if destination exists
      const relativePath = srcPath.replace(src, '');
      const destPath = join(agentsDir, relativePath);
      return !fs.existsSync(destPath);
    }
  });

  // Count agents
  const orchestrators = await fs.readdir(join(agentsDir, 'orchestrators')).catch(() => []);
  const specialists = await fs.readdir(join(agentsDir, 'specialists')).catch(() => []);
  const count = orchestrators.length + specialists.length;

  spinner.succeed(`Agents installed (${count})`);
}

// Copy hooks
async function copyHooks() {
  const spinner = ora('Installing session hooks...').start();

  const hooksDir = join(CLAUDE_DIR, 'hooks');
  await fs.ensureDir(hooksDir);

  const hooks = ['session-start.sh', 'session-end.sh'];

  for (const hook of hooks) {
    const src = join(packageRoot, 'templates', 'hooks', hook);
    const dest = join(hooksDir, hook);

    try {
      await fs.copy(src, dest, { overwrite: false });
      await fs.chmod(dest, 0o755); // Make executable
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }

  spinner.succeed('Session hooks installed');
}

// Update Claude configuration
async function updateClaudeConfig() {
  const spinner = ora('Updating Claude Code configuration...').start();

  let config = {};

  if (await fs.pathExists(CLAUDE_CONFIG)) {
    config = await fs.readJSON(CLAUDE_CONFIG);
  }

  // Add global MCP servers if not present
  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  const mcpServers = {
    'project-context': {
      command: 'python3',
      args: [join(CLAUDE_DIR, 'mcp', 'project-context', 'server.py')],
      env: { PYTHONUNBUFFERED: '1' }
    },
    'shared-context': {
      command: 'python3',
      args: [join(CLAUDE_DIR, 'mcp', 'shared-context', 'server.py')],
      env: { PYTHONUNBUFFERED: '1' }
    },
    'vibe-memory': {
      command: 'python3',
      args: [join(CLAUDE_DIR, 'mcp', 'vibe-memory', 'memory_server.py')],
      env: { PYTHONUNBUFFERED: '1' }
    }
  };

  for (const [name, server] of Object.entries(mcpServers)) {
    if (!config.mcpServers[name]) {
      config.mcpServers[name] = server;
    }
  }

  await fs.writeJSON(CLAUDE_CONFIG, config, { spaces: 2 });

  spinner.succeed('Claude Code configuration updated');
}

// Initialize current project
async function initProject() {
  const spinner = ora('Initializing current project...').start();

  const cwd = process.cwd();
  const projectClaudeDir = join(cwd, '.claude');

  // Create .claude structure
  await fs.ensureDir(join(projectClaudeDir, 'memory'));
  await fs.ensureDir(join(projectClaudeDir, 'orchestration', 'evidence'));
  await fs.ensureDir(join(projectClaudeDir, 'orchestration', 'temp'));
  await fs.ensureDir(join(projectClaudeDir, 'orchestration', 'playbooks'));
  await fs.ensureDir(join(projectClaudeDir, 'orchestration', 'reference'));
  await fs.ensureDir(join(projectClaudeDir, 'orchestration', 'orca-commands'));

  // Copy CLAUDE.md template if not exists
  const claudeMd = join(cwd, 'CLAUDE.md');
  if (!await fs.pathExists(claudeMd)) {
    const template = join(packageRoot, 'templates', 'CLAUDE.md');
    await fs.copy(template, claudeMd);
  }

  // Initialize Workshop database
  try {
    await execa('workshop', ['init'], { cwd });
    const workshopDb = join(cwd, '.workshop', 'workshop.db');
    const destDb = join(projectClaudeDir, 'memory', 'workshop.db');

    if (await fs.pathExists(workshopDb)) {
      await fs.move(workshopDb, destDb, { overwrite: true });
    }
  } catch (err) {
    spinner.warn('Workshop initialization skipped (install Workshop CLI first)');
  }

  spinner.succeed('Project initialized');
}

// Main installation flow
async function install() {
  console.clear();
  console.log(banner);

  try {
    await checkPrerequisites();

    const config = await promptConfig();

    console.log(chalk.bold('\n🚀 Installing Vibe OS 2.0...\n'));

    if (config.installWorkshop) {
      await installWorkshop();
    }

    if (config.configureGlobal) {
      await copyMCPServers();
      await copyCommands();
      await copyAgents();
      await copyHooks();
      await updateClaudeConfig();
    }

    if (config.initCurrentProject) {
      await initProject();
    }

    console.log(chalk.bold.green('\n✨ Installation complete!\n'));
    console.log(chalk.gray('Next steps:\n'));
    console.log(chalk.white('  1. Restart Claude Code to load new configuration'));
    console.log(chalk.white('  2. Run: vibe-os doctor (to verify installation)'));
    console.log(chalk.white('  3. Try: /orca "your task" (to test orchestration)\n'));

  } catch (err) {
    console.error(chalk.red('\n❌ Installation failed:\n'));
    console.error(chalk.yellow(err.message));
    console.error(chalk.gray('\nPlease report issues at: https://github.com/adilkalam/vibe-os/issues\n'));
    process.exit(1);
  }
}

install();
