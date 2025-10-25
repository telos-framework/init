#!/usr/bin/env node

const { Command } = require('commander');
const { initCommand } = require('../lib/commands/init');
const { statusCommand } = require('../lib/commands/status');
const { rediscoverCommand } = require('../lib/commands/rediscover');
const { validateCommand } = require('../lib/commands/validate');

const program = new Command();

program
  .name('telos')
  .description('Telos-driven Multi-Agent Development Framework')
  .version('0.1.0');

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

program
  .command('validate')
  .description('Validate Telos alignment across the project')
  .option('-v, --verbose', 'Show detailed validation results')
  .action(validateCommand);

program.parse();
