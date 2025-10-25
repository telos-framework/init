const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

async function validateCommand(options) {
  console.log(chalk.cyan('\n=== Telos Validation ===\n'));

  try {
    const telosPath = path.join(process.cwd(), 'telos', 'content', 'TELOS.md');
    
    try {
      await fs.access(telosPath);
    } catch {
      console.log(chalk.red('✗ Telos not initialized'));
      console.log(chalk.dim('  Run: telos init first\n'));
      return;
    }

    const checks = [
      { name: 'Telos Hierarchy', fn: validateTelosHierarchy },
      { name: 'Agent Definitions', fn: validateAgents },
      { name: 'Tool Configuration', fn: validateTools },
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

async function validateTelosHierarchy(projectRoot) {
  const telosPath = path.join(projectRoot, 'telos', 'content', 'TELOS.md');
  
  try {
    const content = await fs.readFile(telosPath, 'utf8');
    
    const hasL9 = content.includes('## L9:');
    const hasL1 = content.includes('## L1:');
    
    if (hasL9 && hasL1) {
      const levelCount = (content.match(/## L\d:/g) || []).length;
      return {
        valid: levelCount >= 5,
        details: `${levelCount} levels defined`
      };
    }
    
    return {
      valid: false,
      message: 'Missing level definitions'
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Could not read TELOS.md'
    };
  }
}

async function validateAgents(projectRoot) {
  const agentsPath = path.join(projectRoot, 'telos', 'agents');
  
  try {
    const files = await fs.readdir(agentsPath);
    const agentFiles = files.filter(f => f.endsWith('.md'));
    
    return {
      valid: agentFiles.length >= 9,
      details: `${agentFiles.length} agent files found`
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Agents directory not found'
    };
  }
}

async function validateTools(projectRoot) {
  const toolsPath = path.join(projectRoot, 'telos', 'content', 'TOOLS.md');
  
  try {
    const content = await fs.readFile(toolsPath, 'utf8');
    const hasToolSection = content.includes('## Tools by Agent Level');
    
    return {
      valid: hasToolSection,
      details: 'Tool inventory present'
    };
  } catch (error) {
    return {
      valid: false,
      message: 'TOOLS.md not found'
    };
  }
}

async function validatePlatform(projectRoot) {
  const agentsPath = path.join(projectRoot, 'telos', 'content', 'AGENTS.md');
  
  try {
    await fs.access(agentsPath);
    return {
      valid: true,
      details: 'AGENTS.md exists'
    };
  } catch (error) {
    return {
      valid: false,
      message: 'AGENTS.md not found - run platform setup'
    };
  }
}

module.exports = { validateCommand };
