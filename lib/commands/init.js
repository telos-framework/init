const chalk = require('chalk');
const path = require('path');
const { installSlashCommands } = require('../installers/slash-commands');
const { setupMemoryFiles } = require('../installers/memory-files');

async function initCommand(options) {
  console.log(chalk.bold.cyan('\n╔══════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║   Telos Framework Installation       ║'));
  console.log(chalk.bold.cyan('╚══════════════════════════════════════════╝\n'));

  try {
    const projectRoot = process.cwd();

    console.log(chalk.cyan('Installing Telos slash commands...\n'));

    const commandResults = await installSlashCommands(projectRoot);
    
    for (const { platform, results } of commandResults) {
      const successful = results.filter(r => r.success);
      if (successful.length > 0) {
        console.log(chalk.green(`✓ Installed ${successful.length} command(s) for ${platform}:`));
        successful.forEach(r => {
          console.log(chalk.dim(`  - /telos-${r.file.replace('.md', '')}`));
        });
      }
      
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        console.log(chalk.yellow(`⚠ Failed to install ${failed.length} command(s):`));
        failed.forEach(r => {
          console.log(chalk.dim(`  - ${r.file}: ${r.error}`));
        });
      }
    }

    console.log(chalk.cyan('\nSetting up memory files...\n'));

    const memoryResults = await setupMemoryFiles(projectRoot);
    
    if (memoryResults.agents.created) {
      console.log(chalk.green('✓ Created AGENTS.md'));
    } else if (memoryResults.agents.updated) {
      console.log(chalk.green('✓ Updated AGENTS.md with Telos content'));
    } else {
      console.log(chalk.dim('✓ AGENTS.md already contains Telos content'));
    }
    
    if (memoryResults.claude.created) {
      console.log(chalk.green('✓ Created CLAUDE.md'));
    } else if (memoryResults.claude.updated) {
      console.log(chalk.green('✓ Updated CLAUDE.md with Telos instructions'));
    } else {
      console.log(chalk.dim('✓ CLAUDE.md already contains Telos content'));
    }

    console.log(chalk.bold.cyan('\n╔══════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║       Installation Complete!         ║'));
    console.log(chalk.bold.cyan('╚══════════════════════════════════════════╝\n'));

    console.log(chalk.bold.white('Next steps:\n'));
    console.log(chalk.white('1. Open this project in Claude Code (or your AI coding assistant)'));
    console.log(chalk.white('2. Run the slash command: ') + chalk.bold.green('/telos-init'));
    console.log(chalk.white('3. Follow the interactive setup to configure your purpose hierarchy\n'));

    console.log(chalk.dim('Available commands after initialization:'));
    console.log(chalk.dim('  /telos-init     - Initialize Telos with interactive review'));
    console.log(chalk.dim('  /telos-quick    - Quick initialization (auto-accept AI proposals)'));
    console.log(chalk.dim('  /telos-validate - Check code alignment with purpose'));
    console.log(chalk.dim('  /telos-status   - Show current Telos configuration'));
    console.log(chalk.dim('  /telos-reset    - Clear and reinitialize\n'));

  } catch (error) {
    console.error(chalk.red('\n✗ Installation failed:'), error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    console.log(chalk.yellow('\nPlease check the error and try again.\n'));
    process.exit(1);
  }
}

module.exports = { initCommand };
