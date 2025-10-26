const chalk = require('chalk');
const path = require('path');
const { default: inquirer } = require('inquirer');
const { installSlashCommands } = require('../installers/slash-commands');
const { setupMemoryFiles } = require('../installers/memory-files');

async function initCommand(options) {
  console.log(chalk.bold.cyan('\n╔══════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║   Telos Framework Installation       ║'));
  console.log(chalk.bold.cyan('╚══════════════════════════════════════════╝\n'));

  try {
    const projectRoot = process.cwd();

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'platforms',
        message: 'Which AI coding platforms do you want to initialize Telos for?',
        choices: [
          { name: 'Claude Code', value: 'claude', checked: true },
          { name: 'Opencode', value: 'opencode' },
          { name: 'Cursor', value: 'cursor' },
          { name: 'Cline', value: 'cline' },
          { name: 'Windsurf', value: 'windsurf' },
          { name: 'Roo', value: 'roo' },
          { name: 'Gemini', value: 'gemini' },
          { name: 'Other (AGENTS.md only)', value: 'other' }
        ],
        validate: (answer) => {
          if (answer.length === 0) {
            return 'You must choose at least one platform or press Ctrl+C to cancel.';
          }
          return true;
        }
      }
    ]);

    const platforms = answers.platforms;

    console.log(chalk.cyan('\nInstalling Telos commands...\n'));

    const commandResults = await installSlashCommands(projectRoot, platforms);
    
      for (const { platform: platformName, results } of commandResults) {
        const successful = results.filter(r => r.success);
        if (successful.length > 0) {
          console.log(chalk.green(`✓ Installed ${successful.length} command(s) for ${platformName}:`));
          successful.forEach(r => {
            if (platformName === 'claude') {
              const cmdName = r.file.replace('.md', '');
              console.log(chalk.dim(`  - /telos:${cmdName}`));
            } else if (platformName === 'opencode') {
              const cmdName = r.file.replace('.md', '');
              console.log(chalk.dim(`  - /${cmdName}`));
            } else {
              console.log(chalk.dim(`  - ${r.file}`));
            }
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

    console.log(chalk.cyan('\nSetting up configuration files...\n'));

    const memoryResults = await setupMemoryFiles(projectRoot, platforms);
    
    for (const [fileType, result] of Object.entries(memoryResults)) {
      const fileName = fileType === 'agents' ? 'AGENTS.md' :
                      fileType === 'claude' ? 'CLAUDE.md' :
                      fileType === 'cursor' ? '.cursorrules' :
                      fileType === 'cline' ? '.clinerules' :
                      fileType === 'windsurf' ? '.windsurfrules' :
                      fileType === 'roo' ? '.roocode' :
                      fileType === 'gemini' ? 'GEMINI.md' : fileType;
      
      if (result.created) {
        console.log(chalk.green(`✓ Created ${fileName}`));
      } else if (result.updated) {
        console.log(chalk.green(`✓ Updated ${fileName} with Telos content`));
      } else if (result.reason === 'already-exists') {
        console.log(chalk.dim(`✓ ${fileName} already contains Telos content`));
      }
    }

    console.log(chalk.bold.cyan('\n╔══════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║       Installation Complete!         ║'));
    console.log(chalk.bold.cyan('╚══════════════════════════════════════════╝\n'));

    console.log(chalk.bold.white('Next steps:\n'));
    
    const hasClaudeOrOpencode = platforms.includes('claude') || platforms.includes('opencode');
    
    if (hasClaudeOrOpencode) {
      const primaryPlatform = platforms.includes('claude') ? 'claude' : 'opencode';
      const cmdExample = primaryPlatform === 'claude' ? '/telos:init' : '/telos-init';
      const platformName = primaryPlatform === 'claude' ? 'Claude Code' : 'Opencode';
      
      console.log(chalk.white(`1. Open this project in ${platformName} (or your chosen AI assistant)`));
      console.log(chalk.white('2. Run the command: ') + chalk.bold.green(cmdExample));
      console.log(chalk.white('3. AI will analyze your codebase and propose a 9-level purpose hierarchy'));
      console.log(chalk.white('4. Review strategic layers (L9-L5) and provide refinements'));
      console.log(chalk.white('5. AI generates .telos/TELOS.md and integrates with your config files\n'));

      console.log(chalk.dim('Available commands:'));
      if (primaryPlatform === 'claude') {
        console.log(chalk.dim('  /telos:init     - Initialize Telos with interactive review'));
        console.log(chalk.dim('  /telos:quick    - Quick initialization (auto-accept AI proposals)'));
        console.log(chalk.dim('  /telos:validate - Check code alignment with purpose'));
        console.log(chalk.dim('  /telos:status   - Show current Telos configuration'));
        console.log(chalk.dim('  /telos:reset    - Clear and reinitialize\n'));
      } else {
        console.log(chalk.dim('  /telos-init     - Initialize Telos with interactive review'));
        console.log(chalk.dim('  /telos-quick    - Quick initialization (auto-accept AI proposals)'));
        console.log(chalk.dim('  /telos-validate - Check code alignment with purpose'));
        console.log(chalk.dim('  /telos-status   - Show current Telos configuration'));
        console.log(chalk.dim('  /telos-reset    - Clear and reinitialize\n'));
      }
    } else {
      console.log(chalk.white('1. Open this project in your AI coding assistant'));
      console.log(chalk.white('2. Your AI assistant will reference the updated config files'));
      console.log(chalk.white('3. Ask your AI to run Telos initialization\n'));
    }

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
