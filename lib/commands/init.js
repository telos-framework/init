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
const { loadState, updatePhase, clearState, isPhaseComplete, getPhaseData } = require('./init-state');

async function initCommand(options) {
  console.log(chalk.bold.cyan('\n╔══════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║   Telos Multi-Agent Initialization   ║'));
  console.log(chalk.bold.cyan('╚══════════════════════════════════════════╝\n'));

  try {
    // Load previous state if exists
    const savedState = loadState();
    if (savedState) {
      console.log(chalk.yellow('⚠ Found previous initialization attempt from ' + new Date(savedState.timestamp).toLocaleString()));
      console.log(chalk.yellow('  Resuming from last successful phase...\n'));
    }

    // Phase 0: Telos Discovery
    let telosData;
    if (isPhaseComplete(savedState, 'telosDiscovery')) {
      console.log(chalk.dim('↻ Using saved Telos data'));
      telosData = getPhaseData(savedState, 'telosDiscovery');
    } else {
      telosData = await discoverTelos(options);
      updatePhase('telosDiscovery', { data: telosData });
    }
    
    // Phase 0.5: Hierarchy Building
    let hierarchy;
    if (isPhaseComplete(savedState, 'hierarchyBuilding')) {
      console.log(chalk.dim('↻ Using saved hierarchy'));
      hierarchy = getPhaseData(savedState, 'hierarchyBuilding');
    } else {
      if (options.quick) {
        const spinner = ora('Building purpose hierarchy...').start();
        hierarchy = await buildHierarchy(telosData, options);
        spinner.succeed('Purpose hierarchy built');
      } else {
        hierarchy = await buildHierarchy(telosData, options);
        console.log(chalk.green('\n✓ Purpose hierarchy built\n'));
      }
      updatePhase('hierarchyBuilding', { data: hierarchy });
    }

    // Phase 1: Generate TELOS.md and L9 Agent
    if (!isPhaseComplete(savedState, 'phase1')) {
      const spinner = ora('Generating TELOS.md...').start();
      const telosPath = path.join(process.cwd(), 'telos', 'content', 'TELOS.md');
      await generateTelosMd(hierarchy, telosPath);
      spinner.succeed(`Generated ${telosPath}`);

      spinner.start('Generating L9 Telos-Guardian agent...');
      const l9AgentPath = path.join(process.cwd(), 'telos', 'agents', 'l9-telos-guardian.md');
      await generateL9Agent(hierarchy, l9AgentPath);
      spinner.succeed(`Generated ${l9AgentPath}`);

      updatePhase('phase1', { completed: true });
      console.log(chalk.green('\n✓ Phase 1: Telos Discovery Complete\n'));
    } else {
      console.log(chalk.dim('✓ Phase 1: Already completed\n'));
    }

    // Phase 2: Tool Discovery
    let projectScan, mcpServers, mcpCapabilities, levelTools, recommendations;
    if (isPhaseComplete(savedState, 'phase2')) {
      console.log(chalk.dim('↻ Using saved tool discovery data'));
      const phase2Data = getPhaseData(savedState, 'phase2');
      projectScan = phase2Data.projectScan;
      mcpServers = phase2Data.mcpServers;
      mcpCapabilities = phase2Data.mcpCapabilities;
      levelTools = phase2Data.levelTools;
      recommendations = phase2Data.recommendations;
      console.log(chalk.dim('✓ Phase 2: Already completed\n'));
    } else {
      const spinner = ora('Scanning project for tools and frameworks...').start();
      projectScan = await scanProject(process.cwd());
      spinner.succeed('Project scan complete');

      spinner.start('Discovering MCP servers...');
      mcpServers = await discoverMcpServers();
      mcpCapabilities = mapMcpToCapabilities(mcpServers);
      spinner.succeed(`Found ${mcpServers.length} MCP server(s)`);

      spinner.start('Mapping tools to agent levels...');
      levelTools = mapToolsToLevels(projectScan, mcpCapabilities);
      recommendations = getToolRecommendations(levelTools);
      spinner.succeed('Tool mapping complete');

      spinner.start('Generating TOOLS.md...');
      const toolsPath = path.join(process.cwd(), 'telos', 'content', 'TOOLS.md');
      await generateToolsMd(levelTools, projectScan, mcpServers, recommendations, toolsPath);
      spinner.succeed(`Generated ${toolsPath}`);

      updatePhase('phase2', { 
        completed: true,
        data: { projectScan, mcpServers, mcpCapabilities, levelTools, recommendations }
      });
      console.log(chalk.green('\n✓ Phase 2: Tool Discovery Complete\n'));
    }

    // Phase 3: Agent Generation
    if (!isPhaseComplete(savedState, 'phase3')) {
      const spinner = ora('Generating all agent definitions...').start();
      const agentsDir = path.join(process.cwd(), 'telos', 'agents');
      
      await generateL1Agent(hierarchy, levelTools.L1.tools, path.join(agentsDir, 'l1-syntax-linter.md'));
      await generateL2Agent(hierarchy, levelTools.L2.tools, path.join(agentsDir, 'l2-function-author.md'));
      await generateAllAgents(hierarchy, levelTools, agentsDir);
      
      spinner.succeed('Generated all 9 agent definitions');

      updatePhase('phase3', { completed: true });
      console.log(chalk.green('\n✓ Phase 3: Agent Generation Complete\n'));
    } else {
      console.log(chalk.dim('✓ Phase 3: Already completed\n'));
    }

    // Phase 4: Logos Generation
    if (!isPhaseComplete(savedState, 'phase4')) {
      const spinner = ora('Generating Logos orchestrator documentation...').start();
      const logosPath = path.join(process.cwd(), 'telos', 'content', 'LOGOS.md');
      await generateLogosMd(logosPath);
      spinner.succeed(`Generated ${logosPath}`);

      updatePhase('phase4', { completed: true });
      console.log(chalk.green('\n✓ Phase 4: Logos Orchestrator Complete\n'));
    } else {
      console.log(chalk.dim('✓ Phase 4: Already completed\n'));
    }

    // Phase 5: Consolidation and Symlinks
    if (!isPhaseComplete(savedState, 'phase5')) {
      const spinner = ora('Consolidating agents into AGENTS.md...').start();
      const agentsMdPath = path.join(process.cwd(), 'telos', 'content', 'AGENTS.md');
      await consolidateAgents(path.join(process.cwd(), 'telos', 'agents'), agentsMdPath);
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

      updatePhase('phase5', { completed: true });
      console.log(chalk.green('\n✓ Phase 5: Platform Configuration Complete\n'));
    } else {
      console.log(chalk.dim('✓ Phase 5: Already completed\n'));
    }
    
    // Clear state on successful completion
    clearState();
    
    const telosPath = path.join(process.cwd(), 'telos', 'content', 'TELOS.md');
    console.log(chalk.cyan('Your Telos has been captured in:'));
    console.log(chalk.bold(`  ${telosPath}\n`));

  } catch (error) {
    console.error(chalk.red('\n✗ Initialization failed:'), error.message);
    if (options.verbose) {
      console.error(error);
    }
    console.log(chalk.yellow('\n💾 Progress has been saved. Run `telos init` again to resume.\n'));
    process.exit(1);
  }
}

module.exports = { initCommand };
