#!/usr/bin/env node

const { Command } = require('commander');
const { initCommand } = require('../lib/commands/init');
const { statusCommand } = require('../lib/commands/status');
const { rediscoverCommand } = require('../lib/commands/rediscover');
const { validateCommand } = require('../lib/commands/validate');
const {
  specInitCommand,
  specCreateCommand,
  specTreeCommand,
  sddValidateCommand,
  contextCommand,
  generateTestsCommand,
  orphansCommand,
  coverageCommand,
  discoverCommand,
  hooksInstallCommand,
  hooksUninstallCommand,
  ciInstallCommand
} = require('../lib/commands/sdd');

const program = new Command();

program
  .name('telos')
  .description('Telos-driven Multi-Agent Development Framework with Spec-Driven Development')
  .version('0.2.0');

// ========== Original Commands ==========

program
  .command('init')
  .description('Initialize Telos in your project with interactive discovery')
  .option('-q, --quick', 'Quick initialization with sensible defaults')
  .option('-v, --verbose', 'Show detailed output')
  .action(initCommand);

program
  .command('status')
  .description('Show current Telos configuration')
  .option('-v, --verbose', 'Show detailed configuration')
  .action(statusCommand);

program
  .command('rediscover')
  .description('Re-run tool discovery and update configurations')
  .option('-v, --verbose', 'Show detailed output')
  .action(rediscoverCommand);

// ========== SDD Commands ==========

// Spec subcommand group
const specCmd = program
  .command('spec')
  .description('Specification management commands');

specCmd
  .command('init')
  .description('Initialize SDD spec structure (L4-L1 hierarchy)')
  .option('-f, --force', 'Reinitialize even if specs exist')
  .option('-v, --verbose', 'Show detailed output')
  .action(specInitCommand);

specCmd
  .command('create <level> [name]')
  .description('Create a new spec at the specified level (1-4)')
  .option('-f, --force', 'Overwrite if exists')
  .action(specCreateCommand);

specCmd
  .command('tree')
  .description('Display spec hierarchy as ASCII tree')
  .action(specTreeCommand);

specCmd
  .command('generate-tests <spec-id>')
  .description('Generate test skeletons from spec scenarios')
  .option('-d, --dry-run', 'Show generated content without writing')
  .option('-f, --framework <name>', 'Test framework (vitest, jest, pytest, etc.)')
  .action(generateTestsCommand);

// Validation command (enhanced with SDD)
program
  .command('validate')
  .description('Validate specs, code-spec links, tests, and orphans')
  .option('--specs', 'Validate spec structure only')
  .option('--links', 'Validate code-spec links only')
  .option('--tests', 'Validate test coverage only')
  .option('--orphans', 'Check for orphaned code only')
  .option('-v, --verbose', 'Show detailed validation results')
  .action(sddValidateCommand);

// Context command
program
  .command('context <spec-id>')
  .description('Load recursive context for AI consumption')
  .option('-f, --format <type>', 'Output format: markdown (default) or json')
  .option('--no-siblings', 'Exclude sibling specs')
  .action(contextCommand);

// Orphans command
program
  .command('orphans')
  .description('Find code without @telos annotations')
  .option('--json', 'Output as JSON')
  .action(orphansCommand);

// Coverage command
program
  .command('coverage')
  .description('Show spec and test coverage report')
  .option('--json', 'Output as JSON')
  .action(coverageCommand);

// Lineage command (alias for context)
program
  .command('lineage <spec-id>')
  .description('Show full lineage from L4:purpose to spec')
  .action(async (specId) => {
    await contextCommand(specId, { format: 'markdown' });
  });

// Discover command (brownfield)
program
  .command('discover')
  .description('Scan existing codebase and propose spec structure')
  .option('-d, --dry-run', 'Show proposed structure without generating files')
  .option('--skip-purpose', 'Skip L4:purpose generation (keep existing)')
  .option('--json', 'Output discovery results as JSON')
  .option('-v, --verbose', 'Show detailed output')
  .action(discoverCommand);

// Hooks subcommand group
const hooksCmd = program
  .command('hooks')
  .description('Git hooks management');

hooksCmd
  .command('install')
  .description('Install pre-commit validation hooks')
  .option('--pre-push', 'Also install pre-push hook')
  .action(hooksInstallCommand);

hooksCmd
  .command('uninstall')
  .description('Remove Telos-SDD git hooks')
  .action(hooksUninstallCommand);

// CI command
program
  .command('ci <platform>')
  .description('Install CI configuration (github, gitlab)')
  .action(ciInstallCommand);

program.parse();
