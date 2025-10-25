const { default: inquirer } = require('inquirer');
const chalk = require('chalk');

async function discoverTelos(options = {}) {
  console.log(chalk.cyan('\n=== Telos Discovery ===\n'));
  console.log('Let\'s discover the ultimate purpose of your software.\n');

  const answers = {};

  answers.purpose = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message: 'What is the ultimate purpose of your software?\n  (Why does this project exist?)',
      validate: (input) => input.trim().length > 0 || 'Purpose cannot be empty'
    }
  ]).then(a => a.value);

  answers.beneficiaries = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message: 'Who ultimately benefits from achieving this purpose?',
      validate: (input) => input.trim().length > 0 || 'Beneficiaries cannot be empty'
    }
  ]).then(a => a.value);

  answers.impact = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message: 'What measurable impact defines success?',
      validate: (input) => input.trim().length > 0 || 'Impact cannot be empty'
    }
  ]).then(a => a.value);

  answers.constraints = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message: 'What ethical or practical constraints guide this purpose?',
      default: 'None specified'
    }
  ]).then(a => a.value);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `\nYour Telos:\n  ${chalk.bold(answers.purpose)}\n\nIs this correct?`,
      default: true
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('Let\'s try again...\n'));
    return discoverTelos(options);
  }

  return {
    telos: answers.purpose,
    beneficiaries: answers.beneficiaries,
    impact: answers.impact,
    constraints: answers.constraints,
    timestamp: new Date().toISOString()
  };
}

module.exports = { discoverTelos };
