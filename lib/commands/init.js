const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;
const { default: inquirer } = require('inquirer');
const { installSlashCommands } = require('../installers/slash-commands');
const { setupMemoryFiles } = require('../installers/memory-files');

async function detectExistingInstallation(projectRoot) {
  const indicators = {
    hasClaudeCommands: false,
    hasOpencodeCommands: false,
    hasConfigFiles: false,
    detectedPlatforms: []
  };

  try {
    const claudeCommandsPath = path.join(projectRoot, '.claude', 'commands', 'telos');
    try {
      await fs.access(claudeCommandsPath);
      indicators.hasClaudeCommands = true;
      indicators.detectedPlatforms.push('claude');
    } catch {}

    const opencodeCommandsPath = path.join(projectRoot, '.opencode', 'command');
    try {
      const files = await fs.readdir(opencodeCommandsPath);
      if (files.some(f => f.startsWith('telos-'))) {
        indicators.hasOpencodeCommands = true;
        indicators.detectedPlatforms.push('opencode');
      }
    } catch {}

    const configFiles = [
      { file: 'CLAUDE.md', platform: 'claude' },
      { file: 'AGENTS.md', platform: 'other' },
      { file: '.cursorrules', platform: 'cursor' },
      { file: '.clinerules', platform: 'cline' },
      { file: '.windsurfrules', platform: 'windsurf' },
      { file: '.roocode', platform: 'roo' },
      { file: 'GEMINI.md', platform: 'gemini' }
    ];

    for (const { file, platform } of configFiles) {
      try {
        const content = await fs.readFile(path.join(projectRoot, file), 'utf-8');
        if (content.includes('Telos Framework') || content.includes('.telos/TELOS.md')) {
          indicators.hasConfigFiles = true;
          if (!indicators.detectedPlatforms.includes(platform)) {
            indicators.detectedPlatforms.push(platform);
          }
        }
      } catch {}
    }
  } catch (error) {
    // No existing installation detected
  }

  const hasExisting = indicators.hasClaudeCommands || 
                      indicators.hasOpencodeCommands || 
                      indicators.hasConfigFiles;

  return { hasExisting, ...indicators };
}

async function initCommand(options) {
  console.log(chalk.bold.cyan('\n╔══════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║   Telos Framework Installation           ║'));
  console.log(chalk.bold.cyan('╚══════════════════════════════════════════╝\n'));

  try {
    const projectRoot = process.cwd();

    // Check for existing installation
    const existing = await detectExistingInstallation(projectRoot);

    if (existing.hasExisting) {
      console.log(chalk.yellow('⚠ Existing Telos installation detected\n'));
      
      if (existing.detectedPlatforms.length > 0) {
        console.log(chalk.dim('Detected platforms:'));
        existing.detectedPlatforms.forEach(p => {
          const name = p === 'claude' ? 'Claude Code' :
                      p === 'opencode' ? 'Opencode' :
                      p === 'cursor' ? 'Cursor' :
                      p === 'cline' ? 'Cline' :
                      p === 'windsurf' ? 'Windsurf' :
                      p === 'roo' ? 'Roo' :
                      p === 'gemini' ? 'Gemini' :
                      p === 'other' ? 'Other (AGENTS.md)' : p;
          console.log(chalk.dim(`  - ${name}`));
        });
        console.log();
      }

      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Abort (keep existing installation)', value: 'abort' },
            { name: 'Reinstall (overwrite everything)', value: 'reinstall' },
            { name: 'Add platforms (keep existing, add new)', value: 'add' }
          ]
        }
      ]);

      if (action === 'abort') {
        console.log(chalk.dim('\n✓ Installation cancelled. Existing files preserved.\n'));
        return;
      }

      if (action === 'add') {
        console.log(chalk.cyan('\nSelect additional platforms to install:\n'));
      } else if (action === 'reinstall') {
        console.log(chalk.yellow('\n⚠ Warning: This will overwrite all Telos files\n'));
      }
    }

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'platforms',
        message: existing.hasExisting && existing.action !== 'reinstall' 
          ? 'Select platforms to add:' 
          : 'Which AI coding platforms do you want to initialize Telos for?',
        choices: [
          { name: 'Claude Code', value: 'claude', checked: !existing.hasExisting },
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
    console.log(chalk.bold.cyan('║       Installation Complete!             ║'));
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

module.exports = { initCommand, detectExistingInstallation };
