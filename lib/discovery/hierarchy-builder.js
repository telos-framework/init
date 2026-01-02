const { default: inquirer } = require('inquirer');
const chalk = require('chalk');

const LEVEL_DESCRIPTIONS = {
  L4: 'Purpose - Why the project exists and success metrics',
  L3: 'Experience - User journeys, UX requirements, analytics',
  L2: 'Contract - API contracts, component interfaces, boundaries',
  L1: 'Function - Individual functions with TDD scenarios'
};

async function buildHierarchy(telosData, options = {}) {
  console.log(chalk.cyan('\n=== Building Spec Hierarchy ===\n'));
  console.log('We\'ll define your project\'s 4-level spec hierarchy (L4 → L1).\n');

  const hierarchy = {
    L4: {
      level: 'L4',
      name: 'Purpose',
      description: LEVEL_DESCRIPTIONS.L4,
      purpose: telosData.telos,
      beneficiaries: telosData.beneficiaries,
      impact: telosData.impact,
      constraints: telosData.constraints
    }
  };

  if (options.quick) {
    return buildQuickHierarchy(telosData, hierarchy);
  }

  hierarchy.L3 = await promptLevel('L3', 'Experience', 
    'What user journeys and UX requirements are essential?',
    `Supporting: ${telosData.telos}`);

  hierarchy.L2 = await promptLevel('L2', 'Contract',
    'What API contracts and component interfaces are required?',
    `Supporting: ${hierarchy.L3.purpose}`);

  hierarchy.L1 = await promptLevel('L1', 'Function',
    'What are the core function categories and TDD requirements?',
    `Supporting: ${hierarchy.L2.purpose}`);

  return hierarchy;
}

async function promptLevel(level, name, question, context) {
  console.log(chalk.dim(`\n${context}\n`));
  
  const { purpose } = await inquirer.prompt([
    {
      type: 'input',
      name: 'purpose',
      message: `${chalk.bold(level)} - ${name}:\n  ${question}`,
      validate: (input) => input.trim().length > 0 || 'Purpose cannot be empty'
    }
  ]);

  return {
    level,
    name,
    description: LEVEL_DESCRIPTIONS[level],
    purpose: purpose.trim()
  };
}

function buildQuickHierarchy(telosData, baseHierarchy) {
  const telos = telosData.telos;
  
  return {
    ...baseHierarchy,
    L3: {
      level: 'L3',
      name: 'Experience',
      description: LEVEL_DESCRIPTIONS.L3,
      purpose: 'Deliver intuitive user experiences across all touchpoints'
    },
    L2: {
      level: 'L2',
      name: 'Contract',
      description: LEVEL_DESCRIPTIONS.L2,
      purpose: 'Maintain clear API contracts and component interfaces'
    },
    L1: {
      level: 'L1',
      name: 'Function',
      description: LEVEL_DESCRIPTIONS.L1,
      purpose: 'Write tested, reliable function implementations with TDD'
    }
  };
}

module.exports = { buildHierarchy };
