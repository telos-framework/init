const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

async function statusCommand(options) {
  console.log(chalk.cyan('\n=== Telos SDD Status ===\n'));

  try {
    const specsPath = path.join(process.cwd(), 'telos', 'specs');
    const configPath = path.join(process.cwd(), 'telos', '.telosrc.json');
    const legacyConfigPath = path.join(process.cwd(), '.telos', 'config.json');
    const agentsPath = path.join(process.cwd(), 'AGENTS.md');
    
    let initialized = false;
    let config = null;
    let legacyConfig = null;

    // Check for SDD structure
    try {
      await fs.access(specsPath);
      initialized = true;
      console.log(chalk.green('✓ Telos SDD initialized'));
      console.log(chalk.dim(`  Location: ${specsPath}\n`));
    } catch {
      console.log(chalk.yellow('✗ Telos not initialized'));
      console.log(chalk.dim('  Run: npx telos-framework init\n'));
      return;
    }

    // Load config
    try {
      const configContent = await fs.readFile(configPath, 'utf8');
      config = JSON.parse(configContent);
    } catch {}

    try {
      const legacyContent = await fs.readFile(legacyConfigPath, 'utf8');
      legacyConfig = JSON.parse(legacyContent);
    } catch {}

    console.log(chalk.cyan('Specs:'));
    
    // Count specs at each level
    const levels = ['L4-purpose', 'L3-experience', 'L2-contract', 'L1-function'];
    let totalSpecs = 0;
    
    for (const level of levels) {
      try {
        const levelPath = path.join(specsPath, level);
        const files = await fs.readdir(levelPath);
        const specFiles = files.filter(f => f.endsWith('.md'));
        totalSpecs += specFiles.length;
        console.log(chalk.green(`  ✓ ${level}: ${specFiles.length} spec(s)`));
      } catch {
        console.log(chalk.yellow(`  ✗ ${level}: Not found`));
      }
    }

    console.log(chalk.dim(`  Total: ${totalSpecs} specs\n`));

    console.log(chalk.cyan('Configuration:'));

    if (config) {
      console.log(chalk.green(`  ✓ Enforcement: ${config.enforcement ? 'Configured' : 'Default'}`));
      if (config.enforcement) {
        console.log(chalk.dim(`    - specs: ${config.enforcement.specs || 'hard'}`));
        console.log(chalk.dim(`    - links: ${config.enforcement.links || 'hard'}`));
        console.log(chalk.dim(`    - tests: ${config.enforcement.tests || 'hard'}`));
        console.log(chalk.dim(`    - orphans: ${config.enforcement.orphans || 'soft'}`));
      }
    } else {
      console.log(chalk.yellow('  ✗ Configuration: Not found'));
    }

    // Check platform integration
    try {
      await fs.access(agentsPath);
      console.log(chalk.green('  ✓ AGENTS.md: Present'));
    } catch {
      console.log(chalk.yellow('  ✗ AGENTS.md: Not found'));
    }

    if (legacyConfig) {
      console.log(chalk.green(`  ✓ Platform: ${legacyConfig.platform || 'generic'}`));
    }

    console.log('');

    if (options.verbose) {
      console.log(chalk.cyan('L4 Purpose:'));
      try {
        const purposePath = path.join(specsPath, 'L4-purpose', 'purpose.md');
        const purposeContent = await fs.readFile(purposePath, 'utf8');
        const lines = purposeContent.split('\n').slice(0, 15);
        console.log(chalk.dim(lines.join('\n')));
      } catch (error) {
        console.log(chalk.dim('  Purpose spec not found'));
      }
    }

  } catch (error) {
    console.error(chalk.red('Error checking status:'), error.message);
    process.exit(1);
  }
}

module.exports = { statusCommand };
