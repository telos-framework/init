const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

async function validateCommand(options) {
  console.log(chalk.cyan('\n=== Telos SDD Validation ===\n'));

  try {
    const specsPath = path.join(process.cwd(), 'telos', 'specs');
    
    try {
      await fs.access(specsPath);
    } catch {
      console.log(chalk.red('✗ Telos not initialized'));
      console.log(chalk.dim('  Run: npx telos-framework init first\n'));
      return;
    }

    const checks = [
      { name: 'Spec Structure', fn: validateSpecStructure },
      { name: 'L4 Purpose', fn: validateL4Purpose },
      { name: 'Configuration', fn: validateConfig },
      { name: 'Platform Setup', fn: validatePlatform }
    ];

    let passed = 0;
    let failed = 0;

    for (const check of checks) {
      try {
        const result = await check.fn(process.cwd());
        if (result.valid) {
          console.log(chalk.green(`✓ ${check.name}`));
          if (result.details && options.verbose) {
            console.log(chalk.dim(`  ${result.details}`));
          }
          passed++;
        } else {
          console.log(chalk.yellow(`✗ ${check.name}`));
          if (result.message) {
            console.log(chalk.dim(`  ${result.message}`));
          }
          failed++;
        }
      } catch (error) {
        console.log(chalk.red(`✗ ${check.name}`));
        console.log(chalk.dim(`  Error: ${error.message}`));
        failed++;
      }
    }

    console.log(chalk.cyan(`\nResults: ${passed} passed, ${failed} failed\n`));

    if (failed > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error(chalk.red('Error during validation:'), error.message);
    process.exit(1);
  }
}

async function validateSpecStructure(projectRoot) {
  const specsPath = path.join(projectRoot, 'telos', 'specs');
  
  try {
    const levels = ['L4-purpose', 'L3-experience', 'L2-contract', 'L1-function'];
    let existingLevels = 0;
    
    for (const level of levels) {
      try {
        await fs.access(path.join(specsPath, level));
        existingLevels++;
      } catch {}
    }
    
    return {
      valid: existingLevels === 4,
      details: `${existingLevels}/4 level directories present`
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Specs directory not found'
    };
  }
}

async function validateL4Purpose(projectRoot) {
  const purposePath = path.join(projectRoot, 'telos', 'specs', 'L4-purpose', 'purpose.md');
  
  try {
    const content = await fs.readFile(purposePath, 'utf8');
    
    const hasMetadata = content.includes('telos-metadata') || content.includes('id: L4:purpose');
    const hasTitle = content.includes('# L4:') || content.includes('# Purpose');
    
    if (hasMetadata || hasTitle) {
      return {
        valid: true,
        details: 'L4 purpose spec defined'
      };
    }
    
    return {
      valid: false,
      message: 'L4 purpose spec missing required content'
    };
  } catch (error) {
    return {
      valid: false,
      message: 'L4 purpose.md not found - run /telos:init'
    };
  }
}

async function validateConfig(projectRoot) {
  const configPath = path.join(projectRoot, 'telos', '.telosrc.json');
  
  try {
    const content = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(content);
    
    const hasEnforcement = config.enforcement !== undefined;
    
    return {
      valid: hasEnforcement,
      details: 'Configuration valid'
    };
  } catch (error) {
    return {
      valid: false,
      message: '.telosrc.json not found or invalid'
    };
  }
}

async function validatePlatform(projectRoot) {
  const agentsPath = path.join(projectRoot, 'AGENTS.md');
  
  try {
    await fs.access(agentsPath);
    return {
      valid: true,
      details: 'AGENTS.md exists'
    };
  } catch (error) {
    return {
      valid: false,
      message: 'AGENTS.md not found - run npx telos-framework init'
    };
  }
}

module.exports = { validateCommand };
