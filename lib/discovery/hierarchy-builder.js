const { default: inquirer } = require('inquirer');
const chalk = require('chalk');

const LEVEL_DESCRIPTIONS = {
  L9: 'Transcendent Purpose - The ultimate "why" that gives meaning to all else',
  L8: 'Business/Social Value - Measurable outcomes and societal impact',
  L7: 'User Insight - Understanding user behavior, needs, and feedback',
  L6: 'User Experience - Interface, accessibility, and user journey design',
  L5: 'System Integration - End-to-end workflows and service coordination',
  L4: 'API Contracts - Service boundaries and integration points',
  L3: 'Component Design - Modular architecture and composition',
  L2: 'Function Logic - Individual units of behavior and computation',
  L1: 'Code Structure - Syntax, formatting, and basic integrity'
};

async function buildHierarchy(telosData, options = {}) {
  console.log(chalk.cyan('\n=== Building Purpose Hierarchy ===\n'));
  console.log('We\'ll decompose your Telos into 9 levels (L9 → L1).\n');

  const hierarchy = {
    L9: {
      level: 'L9',
      name: 'Telos-Guardian',
      description: LEVEL_DESCRIPTIONS.L9,
      purpose: telosData.telos,
      beneficiaries: telosData.beneficiaries,
      impact: telosData.impact,
      constraints: telosData.constraints
    }
  };

  if (options.quick) {
    return buildQuickHierarchy(telosData, hierarchy);
  }

  hierarchy.L8 = await promptLevel('L8', 'Business/Social Value', 
    'What measurable business or social outcomes serve your Telos?',
    `Support: ${telosData.telos}`);

  hierarchy.L7 = await promptLevel('L7', 'User Insight',
    'What user insights and behaviors must you understand?',
    `Support: ${hierarchy.L8.purpose}`);

  hierarchy.L6 = await promptLevel('L6', 'User Experience',
    'What user experience qualities are essential?',
    `Support: ${hierarchy.L7.purpose}`);

  hierarchy.L5 = await promptLevel('L5', 'System Integration',
    'What system-level integrations and workflows enable this?',
    `Support: ${hierarchy.L6.purpose}`);

  hierarchy.L4 = await promptLevel('L4', 'API Contracts',
    'What API contracts and service boundaries are required?',
    `Support: ${hierarchy.L5.purpose}`);

  hierarchy.L3 = await promptLevel('L3', 'Component Design',
    'What component architecture supports these contracts?',
    `Support: ${hierarchy.L4.purpose}`);

  hierarchy.L2 = await promptLevel('L2', 'Function Logic',
    'What core functions and logic units are needed?',
    `Support: ${hierarchy.L3.purpose}`);

  hierarchy.L1 = await promptLevel('L1', 'Code Structure',
    'What code quality standards ensure reliability?',
    `Support: ${hierarchy.L2.purpose}`);

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
    L8: {
      level: 'L8',
      name: 'Market-Analyst',
      description: LEVEL_DESCRIPTIONS.L8,
      purpose: `Achieve measurable business outcomes that realize: ${telos}`
    },
    L7: {
      level: 'L7',
      name: 'Insight-Synthesizer',
      description: LEVEL_DESCRIPTIONS.L7,
      purpose: 'Understand user behavior and feedback to inform experience design'
    },
    L6: {
      level: 'L6',
      name: 'UX-Simulator',
      description: LEVEL_DESCRIPTIONS.L6,
      purpose: 'Deliver accessible, intuitive user experiences across all touchpoints'
    },
    L5: {
      level: 'L5',
      name: 'Journey-Validator',
      description: LEVEL_DESCRIPTIONS.L5,
      purpose: 'Ensure end-to-end workflows function cohesively'
    },
    L4: {
      level: 'L4',
      name: 'Integration-Contractor',
      description: LEVEL_DESCRIPTIONS.L4,
      purpose: 'Maintain clear API contracts and service boundaries'
    },
    L3: {
      level: 'L3',
      name: 'Component-Architect',
      description: LEVEL_DESCRIPTIONS.L3,
      purpose: 'Design modular, composable components'
    },
    L2: {
      level: 'L2',
      name: 'Function-Author',
      description: LEVEL_DESCRIPTIONS.L2,
      purpose: 'Write tested, reliable function implementations'
    },
    L1: {
      level: 'L1',
      name: 'Syntax-Linter',
      description: LEVEL_DESCRIPTIONS.L1,
      purpose: 'Ensure code structural integrity and formatting'
    }
  };
}

module.exports = { buildHierarchy };
