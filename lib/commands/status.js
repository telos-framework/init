const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

async function statusCommand(options) {
  console.log(chalk.cyan('\n=== Telos Status ===\n'));

  try {
    const telosPath = path.join(process.cwd(), 'telos', 'content', 'TELOS.md');
    const toolsPath = path.join(process.cwd(), 'telos', 'content', 'TOOLS.md');
    const agentsPath = path.join(process.cwd(), 'telos', 'content', 'AGENTS.md');
    const configPath = path.join(process.cwd(), '.telos', 'config.json');
    
    let initialized = false;
    let config = null;

    try {
      await fs.access(telosPath);
      initialized = true;
      console.log(chalk.green('✓ Telos initialized'));
      console.log(chalk.dim(`  Location: ${telosPath}\n`));
    } catch {
      console.log(chalk.yellow('✗ Telos not initialized'));
      console.log(chalk.dim('  Run: telos init\n'));
      return;
    }

    try {
      const configContent = await fs.readFile(configPath, 'utf8');
      config = JSON.parse(configContent);
    } catch {
    }

    console.log(chalk.cyan('Components:'));
    
    try {
      await fs.access(agentsPath);
      const agentFiles = await fs.readdir(path.join(process.cwd(), 'telos', 'agents'));
      console.log(chalk.green(`  ✓ Agents: ${agentFiles.length} configured`));
    } catch {
      console.log(chalk.yellow('  ✗ Agents: Not configured'));
    }

    try {
      await fs.access(toolsPath);
      const toolsContent = await fs.readFile(toolsPath, 'utf8');
      const toolCount = (toolsContent.match(/^- \*\*/gm) || []).length;
      console.log(chalk.green(`  ✓ Tools: ${toolCount} discovered`));
    } catch {
      console.log(chalk.yellow('  ✗ Tools: Not discovered'));
    }

    if (config) {
      console.log(chalk.green(`  ✓ Platform: ${config.platform || 'generic'}`));
      console.log(chalk.green(`  ✓ Initialized: ${new Date(config.timestamp).toLocaleString()}\n`));
    } else {
      console.log(chalk.yellow('  ✗ Configuration: Not found\n'));
    }

    if (options.verbose) {
      console.log(chalk.cyan('Telos Hierarchy:'));
      try {
        const telosContent = await fs.readFile(telosPath, 'utf8');
        const lines = telosContent.split('\n').slice(0, 20);
        console.log(chalk.dim(lines.join('\n')));
      } catch (error) {
        console.log(chalk.red('  Error reading Telos content'));
      }
    }

  } catch (error) {
    console.error(chalk.red('Error checking status:'), error.message);
    process.exit(1);
  }
}

module.exports = { statusCommand };
