const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const { discoverTelos } = require('../discovery/telos-discovery');
const { buildHierarchy } = require('../discovery/hierarchy-builder');
const { generateTelosMd } = require('../generators/telos-md-generator');
const { generateL9Agent, generateL1Agent, generateL2Agent } = require('../generators/agent-generator');
const { generateAllAgents } = require('../generators/all-agents-generator');
const { scanProject } = require('../discovery/code-scanner');
const { discoverMcpServers, mapMcpToCapabilities } = require('../discovery/mcp-discovery');
const { mapToolsToLevels, getToolRecommendations } = require('../discovery/tool-mapper');
const { generateToolsMd } = require('../generators/tools-md-generator');
const { generateLogosMd } = require('../generators/logos-md-generator');
const { consolidateAgents } = require('../generators/agents-md-generator');
const { detectPlatforms, getPlatformConfig } = require('../platform/platform-detector');
const { createSymlinks } = require('../platform/symlink-creator');

async function initCommand(options) {
  console.log(chalk.bold.cyan('\n╔════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║   Telos Multi-Agent Initialization   ║'));
  console.log(chalk.bold.cyan('╚════════════════════════════════════════╝\n'));

  try {
    const telosData = await discoverTelos(options);
    
    const spinner = ora('Building purpose hierarchy...').start();
    const hierarchy = await buildHierarchy(telosData, options);
    spinner.succeed('Purpose hierarchy built');

    spinner.start('Generating TELOS.md...');
    const telosPath = path.join(process.cwd(), 'telos', 'content', 'TELOS.md');
    await generateTelosMd(hierarchy, telosPath);
    spinner.succeed(`Generated ${telosPath}`);

    spinner.start('Generating L9 Telos-Guardian agent...');
    const l9AgentPath = path.join(process.cwd(), 'telos', 'agents', 'l9-telos-guardian.md');
    await generateL9Agent(hierarchy, l9AgentPath);
    spinner.succeed(`Generated ${l9AgentPath}`);

    console.log(chalk.green('\n✓ Phase 1: Telos Discovery Complete\n'));

    spinner.start('Scanning project for tools and frameworks...');
    const projectScan = await scanProject(process.cwd());
    spinner.succeed('Project scan complete');

    spinner.start('Discovering MCP servers...');
    const mcpServers = await discoverMcpServers();
    const mcpCapabilities = mapMcpToCapabilities(mcpServers);
    spinner.succeed(`Found ${mcpServers.length} MCP server(s)`);

    spinner.start('Mapping tools to agent levels...');
    const levelTools = mapToolsToLevels(projectScan, mcpCapabilities);
    const recommendations = getToolRecommendations(levelTools);
    spinner.succeed('Tool mapping complete');

    spinner.start('Generating TOOLS.md...');
    const toolsPath = path.join(process.cwd(), 'telos', 'content', 'TOOLS.md');
    await generateToolsMd(levelTools, projectScan, mcpServers, recommendations, toolsPath);
    spinner.succeed(`Generated ${toolsPath}`);

    console.log(chalk.green('\n✓ Phase 2: Tool Discovery Complete\n'));

    spinner.start('Generating all agent definitions...');
    const agentsDir = path.join(process.cwd(), 'telos', 'agents');
    
    await generateL1Agent(hierarchy, levelTools.L1.tools, path.join(agentsDir, 'l1-syntax-linter.md'));
    await generateL2Agent(hierarchy, levelTools.L2.tools, path.join(agentsDir, 'l2-function-author.md'));
    await generateAllAgents(hierarchy, levelTools, agentsDir);
    
    spinner.succeed('Generated all 9 agent definitions');

    console.log(chalk.green('\n✓ Phase 3: Agent Generation Complete\n'));

    spinner.start('Generating Logos orchestrator documentation...');
    const logosPath = path.join(process.cwd(), 'telos', 'content', 'LOGOS.md');
    await generateLogosMd(logosPath);
    spinner.succeed(`Generated ${logosPath}`);

    console.log(chalk.green('\n✓ Phase 4: Logos Orchestrator Complete\n'));

    spinner.start('Consolidating agents into AGENTS.md...');
    const agentsMdPath = path.join(process.cwd(), 'telos', 'content', 'AGENTS.md');
    await consolidateAgents(agentsDir, agentsMdPath);
    spinner.succeed(`Generated ${agentsMdPath}`);

    spinner.start('Detecting platforms and creating symlinks...');
    const platforms = await detectPlatforms(process.cwd());
    let symlinkCount = 0;
    
    for (const platform of platforms) {
      const config = getPlatformConfig(platform.name);
      const results = await createSymlinks(process.cwd(), config);
      symlinkCount += results.filter(r => r.success).length;
    }
    
    spinner.succeed(`Created ${symlinkCount} platform symlink(s) for ${platforms.map(p => p.name).join(', ')}`);

    console.log(chalk.green('\n✓ Phase 5: Platform Configuration Complete\n'));
    
    console.log(chalk.cyan('Your Telos has been captured in:'));
    console.log(chalk.bold(`  ${telosPath}\n`));

  } catch (error) {
    console.error(chalk.red('\n✗ Initialization failed:'), error.message);
    if (options.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

module.exports = { initCommand };
