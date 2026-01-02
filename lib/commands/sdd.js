/**
 * Telos-SDD CLI Commands
 * 
 * CLI commands for spec-driven development features.
 */

const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;
const { default: inquirer } = require('inquirer');

const sdd = require('../sdd');

/**
 * Initialize SDD structure
 */
async function specInitCommand(options) {
  console.log(chalk.bold.cyan('\n╔══════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║   Telos-SDD Initialization               ║'));
  console.log(chalk.bold.cyan('╚══════════════════════════════════════════╝\n'));

  const projectRoot = process.cwd();

  try {
    // Check for existing specs
    const specsPath = path.join(projectRoot, 'telos', 'specs');
    let hasExisting = false;
    
    try {
      await fs.access(specsPath);
      hasExisting = true;
    } catch {}

    if (hasExisting && !options.force) {
      console.log(chalk.yellow('⚠ Existing spec structure detected.\n'));
      const { proceed } = await inquirer.prompt([{
        type: 'confirm',
        name: 'proceed',
        message: 'Do you want to reinitialize? (This will preserve existing specs)',
        default: false
      }]);
      
      if (!proceed) {
        console.log(chalk.dim('Initialization cancelled.\n'));
        return;
      }
    }

    // Create directory structure
    console.log(chalk.cyan('Creating spec directories...\n'));
    
    const dirs = [
      'telos/specs/L4-purpose',
      'telos/specs/L3-experience',
      'telos/specs/L2-contract',
      'telos/specs/L1-function'
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(projectRoot, dir), { recursive: true });
      console.log(chalk.dim(`  ✓ ${dir}`));
    }

    // Initialize config
    console.log(chalk.cyan('\nInitializing configuration...\n'));
    const config = await sdd.initConfig(projectRoot);
    console.log(chalk.dim(`  ✓ Created telos/.telosrc.json`));

    // Gather project info
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: path.basename(projectRoot)
      },
      {
        type: 'input',
        name: 'purpose',
        message: 'Project purpose (one sentence):',
        default: 'A software project'
      }
    ]);

    // Create L4:purpose spec
    console.log(chalk.cyan('\nCreating L4:purpose spec...\n'));
    
    const purposeSpec = sdd.generateSpec(4, {
      title: answers.projectName,
      purpose: answers.purpose
    });

    const purposePath = path.join(projectRoot, 'telos/specs/L4-purpose/purpose.md');
    await fs.writeFile(purposePath, purposeSpec, 'utf8');
    console.log(chalk.dim(`  ✓ Created ${purposePath}`));

    // Create TELOS.md
    console.log(chalk.cyan('\nCreating TELOS.md entry point...\n'));
    
    const telosEntry = sdd.generateTelosEntry({
      projectName: answers.projectName,
      purpose: answers.purpose
    });

    const telosPath = path.join(projectRoot, 'telos/TELOS.md');
    await fs.writeFile(telosPath, telosEntry, 'utf8');
    console.log(chalk.dim(`  ✓ Created ${telosPath}`));

    // Build initial index
    console.log(chalk.cyan('\nBuilding spec index...\n'));
    const index = await sdd.buildIndex(projectRoot);
    await sdd.saveIndex(projectRoot, index);
    console.log(chalk.dim(`  ✓ Created telos/index.json`));

    console.log(chalk.bold.green('\n✓ SDD initialization complete!\n'));
    console.log(chalk.white('Next steps:'));
    console.log(chalk.dim('  1. Edit telos/specs/L4-purpose/purpose.md to refine your purpose'));
    console.log(chalk.dim('  2. Run "telos spec create 3 <journey-name>" to add user journeys'));
    console.log(chalk.dim('  3. Run "telos discover" to generate specs from existing code'));
    console.log('');

  } catch (error) {
    console.error(chalk.red('\n✗ Initialization failed:'), error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Create a new spec
 */
async function specCreateCommand(level, name, options) {
  const projectRoot = process.cwd();
  const levelNum = parseInt(level, 10);

  if (isNaN(levelNum) || levelNum < 1 || levelNum > 4) {
    console.error(chalk.red('Error: Level must be 1-4'));
    process.exit(1);
  }

  if (!name && levelNum < 4) {
    console.error(chalk.red('Error: Name is required for L1-L3 specs'));
    process.exit(1);
  }

  try {
    const levelName = sdd.LEVEL_NAMES[levelNum];
    const folder = sdd.LEVEL_FOLDERS[levelNum];
    
    // Determine file path
    let fileName;
    if (levelNum === 4) {
      fileName = 'purpose.md';
    } else {
      fileName = `${name.replace(/[:/]/g, '-')}.md`;
    }

    const filePath = path.join(projectRoot, 'telos/specs', folder, fileName);

    // Check if exists
    try {
      await fs.access(filePath);
      if (!options.force) {
        console.error(chalk.red(`Error: Spec already exists at ${filePath}`));
        console.log(chalk.dim('Use --force to overwrite'));
        process.exit(1);
      }
    } catch {}

    // Gather additional info
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Spec title:',
        default: name || 'Purpose'
      },
      {
        type: 'input',
        name: 'parent',
        message: 'Parent spec ID:',
        default: levelNum === 4 ? '' : 
                 levelNum === 3 ? 'L4:purpose' :
                 levelNum === 2 ? `L3:experience:${name}` :
                 `L2:contract:${name}`,
        when: levelNum < 4
      }
    ]);

    // Generate spec
    const specContent = sdd.generateSpec(levelNum, {
      id: name,
      title: answers.title,
      parent: answers.parent,
      path: name
    });

    // Write file
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, specContent, 'utf8');

    console.log(chalk.green(`\n✓ Created spec: ${filePath}\n`));

    // Rebuild index
    const index = await sdd.buildIndex(projectRoot);
    await sdd.saveIndex(projectRoot, index);
    console.log(chalk.dim('Updated spec index'));

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show spec tree
 */
async function specTreeCommand(options) {
  const projectRoot = process.cwd();

  try {
    const tree = await sdd.getSpecTree(projectRoot);
    console.log('\n' + tree + '\n');
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Validate specs, links, tests, orphans
 */
async function sddValidateCommand(options) {
  const projectRoot = process.cwd();

  try {
    const results = await sdd.validate(projectRoot, {
      all: !options.specs && !options.links && !options.tests && !options.orphans,
      specs: options.specs,
      links: options.links,
      tests: options.tests,
      orphans: options.orphans
    });

    console.log(sdd.formatResults(results));
    process.exit(results.exitCode);

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Load context for a spec
 */
async function contextCommand(specId, options) {
  const projectRoot = process.cwd();

  try {
    const context = await sdd.loadContext(projectRoot, specId, {
      includeSiblings: !options.noSiblings,
      format: options.format || 'markdown'
    });

    if (context.error) {
      console.error(chalk.red('Error:'), context.error);
      process.exit(1);
    }

    if (options.format === 'json') {
      console.log(JSON.stringify(context, null, 2));
    } else {
      console.log(context);
    }

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Generate tests from spec
 */
async function generateTestsCommand(specId, options) {
  const projectRoot = process.cwd();

  try {
    const result = await sdd.generateTests(projectRoot, specId, {
      dryRun: options.dryRun,
      framework: options.framework
    });

    if (!result.success) {
      console.error(chalk.red('Error:'), result.error);
      if (result.suggestion) {
        console.log(chalk.dim(result.suggestion));
      }
      process.exit(1);
    }

    if (options.dryRun) {
      console.log(chalk.cyan('\n--- Generated Test Content (dry run) ---\n'));
      console.log(result.content);
      console.log(chalk.cyan('\n--- End ---\n'));
      console.log(chalk.dim(`Would write to: ${result.testPath}`));
    } else {
      console.log(chalk.green(`\n✓ ${result.message}\n`));
    }

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Find orphaned code
 */
async function orphansCommand(options) {
  const projectRoot = process.cwd();

  try {
    const config = await sdd.loadConfig(projectRoot);
    const orphans = await sdd.findOrphans(projectRoot, {
      ignore: config.ignore
    });

    if (orphans.length === 0) {
      console.log(chalk.green('\n✓ No orphaned code found\n'));
      return;
    }

    console.log(chalk.yellow(`\n⚠ Found ${orphans.length} orphaned functions/classes:\n`));

    const byFile = {};
    for (const orphan of orphans) {
      if (!byFile[orphan.relativePath]) {
        byFile[orphan.relativePath] = [];
      }
      byFile[orphan.relativePath].push(orphan);
    }

    for (const [file, items] of Object.entries(byFile)) {
      console.log(chalk.white(file));
      for (const item of items) {
        console.log(chalk.dim(`  ${item.line}: ${item.type} ${item.name}`));
      }
    }

    console.log('');
    console.log(chalk.dim('Add @telos annotations to link code to specs'));
    console.log(chalk.dim('Example: // @telos L1:function:module:functionName\n'));

    if (options.json) {
      console.log(JSON.stringify(orphans, null, 2));
    }

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show coverage report
 */
async function coverageCommand(options) {
  const projectRoot = process.cwd();

  try {
    const index = await sdd.loadIndex(projectRoot) || await sdd.buildIndex(projectRoot);
    const scanResults = await sdd.scanDirectory(projectRoot);

    console.log(chalk.bold.cyan('\nTelos-SDD Coverage Report\n'));

    // Count by level
    const byLevel = { 4: [], 3: [], 2: [], 1: [] };
    for (const spec of Object.values(index.specs)) {
      byLevel[spec.level].push(spec);
    }

    console.log('Spec Counts:');
    console.log(chalk.dim(`  L4:purpose     ${byLevel[4].length} spec(s)`));
    console.log(chalk.dim(`  L3:experience  ${byLevel[3].length} spec(s)`));
    console.log(chalk.dim(`  L2:contract    ${byLevel[2].length} spec(s)`));
    console.log(chalk.dim(`  L1:function    ${byLevel[1].length} spec(s)`));
    console.log('');

    // Annotation counts
    const telosCount = scanResults.annotations.filter(a => a.type === 'telos').length;
    const testCount = scanResults.annotations.filter(a => a.type === 'telos-test').length;
    const scenarioCount = scanResults.annotations.filter(a => a.type === 'telos-scenario').length;

    console.log('Code Annotations:');
    console.log(chalk.dim(`  @telos          ${telosCount} annotation(s)`));
    console.log(chalk.dim(`  @telos-test     ${testCount} annotation(s)`));
    console.log(chalk.dim(`  @telos-scenario ${scenarioCount} annotation(s)`));
    console.log('');

    // L1 specs with tests
    const l1Specs = byLevel[1];
    const testedSpecs = new Set(
      scanResults.annotations
        .filter(a => a.type === 'telos-test')
        .map(a => a.specId.split(':').slice(0, -1).join(':') || a.specId)
    );

    let specsWithTests = 0;
    for (const spec of l1Specs) {
      if (testedSpecs.has(spec.id)) {
        specsWithTests++;
      }
    }

    const coverage = l1Specs.length > 0 
      ? Math.round((specsWithTests / l1Specs.length) * 100) 
      : 100;

    console.log('Test Coverage:');
    console.log(chalk.dim(`  L1 specs with tests: ${specsWithTests}/${l1Specs.length} (${coverage}%)`));
    console.log('');

    if (options.json) {
      console.log(JSON.stringify({
        specs: { l4: byLevel[4].length, l3: byLevel[3].length, l2: byLevel[2].length, l1: byLevel[1].length },
        annotations: { telos: telosCount, test: testCount, scenario: scenarioCount },
        coverage: { specsWithTests, totalSpecs: l1Specs.length, percentage: coverage }
      }, null, 2));
    }

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Discover and propose specs from existing codebase
 */
async function discoverCommand(options) {
  console.log(chalk.bold.cyan('\n╔══════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║   Telos-SDD Brownfield Discovery         ║'));
  console.log(chalk.bold.cyan('╚══════════════════════════════════════════╝\n'));

  const projectRoot = process.cwd();

  try {
    console.log(chalk.cyan('Scanning codebase...\n'));
    
    const results = await sdd.discover(projectRoot);

    console.log(chalk.white('Languages detected:'), results.languages.join(', ') || 'none');
    console.log(chalk.white('Modules found:'), results.modules.length);
    console.log(chalk.white('Functions found:'), results.functions.length);
    console.log('');

    // Show proposed specs
    console.log(chalk.bold('Proposed Spec Structure:\n'));

    console.log(chalk.green('L4:purpose'));
    console.log(chalk.dim(`  └─ ${results.proposedSpecs.L4?.title || 'Project Purpose'}`));
    console.log('');

    console.log(chalk.green(`L3:experience (${results.proposedSpecs.L3.length} proposed)`));
    for (const spec of results.proposedSpecs.L3.slice(0, 5)) {
      console.log(chalk.dim(`  └─ ${spec.title}`));
    }
    if (results.proposedSpecs.L3.length > 5) {
      console.log(chalk.dim(`  └─ ... and ${results.proposedSpecs.L3.length - 5} more`));
    }
    console.log('');

    console.log(chalk.green(`L2:contract (${results.proposedSpecs.L2.length} proposed)`));
    for (const spec of results.proposedSpecs.L2.slice(0, 5)) {
      console.log(chalk.dim(`  └─ ${spec.title}`));
    }
    if (results.proposedSpecs.L2.length > 5) {
      console.log(chalk.dim(`  └─ ... and ${results.proposedSpecs.L2.length - 5} more`));
    }
    console.log('');

    console.log(chalk.green(`L1:function (${results.proposedSpecs.L1.length} proposed)`));
    for (const spec of results.proposedSpecs.L1.slice(0, 5)) {
      console.log(chalk.dim(`  └─ ${spec.title} (${spec.functionCount} functions)`));
    }
    if (results.proposedSpecs.L1.length > 5) {
      console.log(chalk.dim(`  └─ ... and ${results.proposedSpecs.L1.length - 5} more`));
    }
    console.log('');

    if (options.dryRun) {
      console.log(chalk.yellow('Dry run - no files created'));
      if (options.json) {
        console.log(JSON.stringify(results, null, 2));
      }
      return;
    }

    // Prompt for generation
    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: 'Generate spec files from this structure?',
      default: true
    }]);

    if (!proceed) {
      console.log(chalk.dim('\nDiscovery cancelled.\n'));
      return;
    }

    // Generate specs
    console.log(chalk.cyan('\nGenerating spec files...\n'));
    
    const generated = await sdd.generateSpecs(projectRoot, results, {
      skipL4: options.skipPurpose
    });

    console.log(chalk.green(`✓ Created ${generated.files.length} spec file(s)`));
    
    for (const file of generated.files.slice(0, 10)) {
      console.log(chalk.dim(`  ${path.relative(projectRoot, file)}`));
    }
    if (generated.files.length > 10) {
      console.log(chalk.dim(`  ... and ${generated.files.length - 10} more`));
    }

    if (generated.errors.length > 0) {
      console.log(chalk.yellow(`\n⚠ ${generated.errors.length} error(s) during generation`));
      for (const err of generated.errors) {
        console.log(chalk.dim(`  ${err.id || err.level}: ${err.error}`));
      }
    }

    // Rebuild index
    console.log(chalk.cyan('\nRebuilding spec index...\n'));
    const index = await sdd.buildIndex(projectRoot);
    await sdd.saveIndex(projectRoot, index);

    console.log(chalk.bold.green('\n✓ Discovery complete!\n'));
    console.log(chalk.white('Next steps:'));
    console.log(chalk.dim('  1. Review and edit the generated specs'));
    console.log(chalk.dim('  2. Add @telos annotations to your code'));
    console.log(chalk.dim('  3. Run "telos validate" to check coverage'));
    console.log('');

  } catch (error) {
    console.error(chalk.red('\n✗ Discovery failed:'), error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Install git hooks
 */
async function hooksInstallCommand(options) {
  const projectRoot = process.cwd();

  try {
    console.log(chalk.cyan('\nInstalling Telos-SDD git hooks...\n'));

    const result = await sdd.installHooks(projectRoot, {
      prePush: options.prePush
    });

    if (result.installed.length > 0) {
      console.log(chalk.green('✓ Installed hooks:'));
      for (const hook of result.installed) {
        console.log(chalk.dim(`  - ${hook}`));
      }
    }

    if (result.errors.length > 0) {
      console.log(chalk.yellow('\n⚠ Errors:'));
      for (const error of result.errors) {
        console.log(chalk.dim(`  - ${error}`));
      }
    }

    console.log('');

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Uninstall git hooks
 */
async function hooksUninstallCommand() {
  const projectRoot = process.cwd();

  try {
    console.log(chalk.cyan('\nUninstalling Telos-SDD git hooks...\n'));

    const result = await sdd.uninstallHooks(projectRoot);

    if (result.removed.length > 0) {
      console.log(chalk.green('✓ Removed hooks:'));
      for (const hook of result.removed) {
        console.log(chalk.dim(`  - ${hook}`));
      }
    } else {
      console.log(chalk.dim('No Telos-SDD hooks found to remove.'));
    }

    console.log('');

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Install CI configuration
 */
async function ciInstallCommand(platform, options) {
  const projectRoot = process.cwd();

  try {
    console.log(chalk.cyan(`\nInstalling Telos-SDD ${platform} CI configuration...\n`));

    const result = await sdd.installCI(projectRoot, platform);

    if (result.installed) {
      console.log(chalk.green(`✓ Created ${path.relative(projectRoot, result.installed)}`));
    }

    if (result.error) {
      console.error(chalk.red('Error:'), result.error);
      process.exit(1);
    }

    console.log('');

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

module.exports = {
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
};
