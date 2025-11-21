#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import { execa } from 'execa';
import os from 'os';
import { join } from 'path';

const program = new Command();
const HOME = os.homedir();
const CLAUDE_DIR = join(HOME, '.claude');
const CLAUDE_CONFIG = join(HOME, '.claude.json');

program
  .name('vibe-os')
  .description('Vibe OS 2.0 CLI')
  .version('1.0.0');

// Doctor command
program
  .command('doctor')
  .description('Verify Vibe OS installation')
  .action(async () => {
    console.log(chalk.bold('\n🔍 Running diagnostics...\n'));

    const checks = [];

    // Check Claude Code
    checks.push({
      name: 'Claude Code',
      check: async () => await fs.pathExists(CLAUDE_CONFIG),
      message: '~/.claude.json found'
    });

    // Check MCP servers
    const mcpServers = ['project-context', 'shared-context', 'vibe-memory'];
    for (const server of mcpServers) {
      checks.push({
        name: `MCP: ${server}`,
        check: async () => await fs.pathExists(join(CLAUDE_DIR, 'mcp', server)),
        message: `${server} installed`
      });
    }

    // Check commands
    checks.push({
      name: 'Commands',
      check: async () => {
        const commandsDir = join(CLAUDE_DIR, 'commands');
        if (!await fs.pathExists(commandsDir)) return false;
        const files = await fs.readdir(commandsDir);
        return files.length > 0;
      },
      message: 'Slash commands available'
    });

    // Check agents
    checks.push({
      name: 'Agents',
      check: async () => {
        const agentsDir = join(CLAUDE_DIR, 'agents');
        if (!await fs.pathExists(agentsDir)) return false;
        const orchestrators = await fs.readdir(join(agentsDir, 'orchestrators')).catch(() => []);
        const specialists = await fs.readdir(join(agentsDir, 'specialists')).catch(() => []);
        return orchestrators.length + specialists.length > 0;
      },
      message: 'Agent definitions loaded'
    });

    // Check Workshop CLI
    checks.push({
      name: 'Workshop CLI',
      check: async () => {
        try {
          await execa('workshop', ['--version']);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Workshop CLI installed'
    });

    // Check Python
    checks.push({
      name: 'Python 3.8+',
      check: async () => {
        try {
          const { stdout } = await execa('python3', ['--version']);
          const version = stdout.match(/\d+\.\d+/)?.[0];
          return parseFloat(version) >= 3.8;
        } catch {
          return false;
        }
      },
      message: 'Python 3.8+ available'
    });

    // Check configuration
    checks.push({
      name: 'Configuration',
      check: async () => {
        if (!await fs.pathExists(CLAUDE_CONFIG)) return false;
        const config = await fs.readJSON(CLAUDE_CONFIG);
        return config.mcpServers && Object.keys(config.mcpServers).length > 0;
      },
      message: 'MCP servers configured'
    });

    // Run checks
    let passed = 0;
    let failed = 0;

    for (const { name, check, message } of checks) {
      const spinner = ora(name).start();
      try {
        const result = await check();
        if (result) {
          spinner.succeed(chalk.green(message));
          passed++;
        } else {
          spinner.fail(chalk.red(message));
          failed++;
        }
      } catch (err) {
        spinner.fail(chalk.red(`${message} - ${err.message}`));
        failed++;
      }
    }

    console.log(chalk.bold(`\n📊 Results: ${chalk.green(passed)} passed, ${failed > 0 ? chalk.red(failed) : chalk.gray(failed)} failed\n`));

    if (failed > 0) {
      console.log(chalk.yellow('⚠️  Some checks failed. Run "npx create-vibe-os" to reinstall.\n'));
      process.exit(1);
    } else {
      console.log(chalk.green('✅ Vibe OS is properly installed!\n'));
    }
  });

// Init command
program
  .command('init')
  .description('Initialize current directory as Vibe OS project')
  .action(async () => {
    console.log(chalk.bold('\n📦 Initializing project...\n'));

    const cwd = process.cwd();
    const projectClaudeDir = join(cwd, '.claude');

    const spinner = ora('Creating directory structure').start();

    try {
      // Create .claude structure
      await fs.ensureDir(join(projectClaudeDir, 'memory'));
      await fs.ensureDir(join(projectClaudeDir, 'orchestration', 'evidence'));
      await fs.ensureDir(join(projectClaudeDir, 'orchestration', 'temp'));
      await fs.ensureDir(join(projectClaudeDir, 'orchestration', 'playbooks'));
      await fs.ensureDir(join(projectClaudeDir, 'orchestration', 'reference'));
      await fs.ensureDir(join(projectClaudeDir, 'orchestration', 'orca-commands'));

      spinner.succeed('Directory structure created');

      // Initialize Workshop
      spinner.start('Initializing Workshop database');
      try {
        await execa('workshop', ['init'], { cwd });
        const workshopDb = join(cwd, '.workshop', 'workshop.db');
        const destDb = join(projectClaudeDir, 'memory', 'workshop.db');

        if (await fs.pathExists(workshopDb)) {
          await fs.move(workshopDb, destDb, { overwrite: true });
        }
        spinner.succeed('Workshop database initialized');
      } catch {
        spinner.warn('Workshop CLI not found - skipping database init');
      }

      console.log(chalk.green('\n✨ Project initialized!\n'));
      console.log(chalk.gray('Created:\n'));
      console.log(chalk.white(`  ${projectClaudeDir}/memory/workshop.db`));
      console.log(chalk.white(`  ${projectClaudeDir}/orchestration/evidence/`));
      console.log(chalk.white(`  ${projectClaudeDir}/orchestration/temp/\n`));

    } catch (err) {
      spinner.fail('Initialization failed');
      console.error(chalk.red(`\n❌ ${err.message}\n`));
      process.exit(1);
    }
  });

// Update command
program
  .command('update')
  .description('Update Vibe OS to latest version')
  .action(async () => {
    console.log(chalk.bold('\n📥 Updating Vibe OS...\n'));

    const spinner = ora('Checking for updates').start();

    try {
      // This would check npm registry for updates
      // For now, just tell user to reinstall
      spinner.info('To update, run: npx create-vibe-os');
      console.log(chalk.gray('\nThis will update your installation while preserving existing configuration.\n'));
    } catch (err) {
      spinner.fail('Update check failed');
      console.error(chalk.red(`\n❌ ${err.message}\n`));
    }
  });

// Info command
program
  .command('info')
  .description('Show Vibe OS configuration')
  .action(async () => {
    console.log(chalk.bold('\n📋 Vibe OS Configuration\n'));

    try {
      // Claude directory
      console.log(chalk.gray('Claude Directory:'));
      console.log(chalk.white(`  ${CLAUDE_DIR}\n`));

      // MCP servers
      const mcpDir = join(CLAUDE_DIR, 'mcp');
      if (await fs.pathExists(mcpDir)) {
        const servers = await fs.readdir(mcpDir);
        console.log(chalk.gray('MCP Servers:'));
        servers.forEach(server => console.log(chalk.white(`  • ${server}`)));
        console.log();
      }

      // Commands
      const commandsDir = join(CLAUDE_DIR, 'commands');
      if (await fs.pathExists(commandsDir)) {
        const commands = await fs.readdir(commandsDir);
        console.log(chalk.gray('Commands:'));
        commands.filter(f => f.endsWith('.md')).forEach(cmd => {
          const name = cmd.replace('.md', '');
          console.log(chalk.white(`  • /${name}`));
        });
        console.log();
      }

      // Agents
      const agentsDir = join(CLAUDE_DIR, 'agents');
      if (await fs.pathExists(agentsDir)) {
        const orchestrators = await fs.readdir(join(agentsDir, 'orchestrators')).catch(() => []);
        const specialists = await fs.readdir(join(agentsDir, 'specialists')).catch(() => []);

        console.log(chalk.gray('Agents:'));
        console.log(chalk.white(`  • Orchestrators: ${orchestrators.length}`));
        console.log(chalk.white(`  • Specialists: ${specialists.length}\n`));
      }

    } catch (err) {
      console.error(chalk.red(`\n❌ ${err.message}\n`));
      process.exit(1);
    }
  });

program.parse();
