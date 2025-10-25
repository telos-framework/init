const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const { scanProject } = require('../discovery/code-scanner');
const { discoverMcpServers, mapMcpToCapabilities } = require('../discovery/mcp-discovery');
const { mapToolsToLevels, getToolRecommendations } = require('../discovery/tool-mapper');
const { generateToolsMd } = require('../generators/tools-md-generator');

async function rediscoverCommand(options) {
  console.log(chalk.cyan('\n=== Tool Rediscovery ===\n'));

  try {
    const spinner = ora('Re-scanning project...').start();
    const projectScan = await scanProject(process.cwd());
    spinner.succeed('Project scan complete');

    spinner.start('Re-discovering MCP servers...');
    const mcpServers = await discoverMcpServers();
    const mcpCapabilities = mapMcpToCapabilities(mcpServers);
    spinner.succeed(`Found ${mcpServers.length} MCP server(s)`);

    spinner.start('Re-mapping tools to agent levels...');
    const levelTools = mapToolsToLevels(projectScan, mcpCapabilities);
    const recommendations = getToolRecommendations(levelTools);
    spinner.succeed('Tool mapping complete');

    spinner.start('Updating TOOLS.md...');
    const toolsPath = path.join(process.cwd(), 'telos', 'content', 'TOOLS.md');
    await generateToolsMd(levelTools, projectScan, mcpServers, recommendations, toolsPath);
    spinner.succeed(`Updated ${toolsPath}`);

    console.log(chalk.green('\n✓ Tool rediscovery complete\n'));

    if (recommendations.length > 0) {
      console.log(chalk.yellow('Recommendations:'));
      for (const rec of recommendations) {
        console.log(chalk.dim(`  [${rec.level}] ${rec.message}`));
      }
      console.log();
    }

  } catch (error) {
    console.error(chalk.red('\n✗ Rediscovery failed:'), error.message);
    process.exit(1);
  }
}

module.exports = { rediscoverCommand };
