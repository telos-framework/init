const fs = require('fs').promises;
const path = require('path');
const { 
  COMMAND_METADATA, 
  getPlatformConfig, 
  hasNativeCommands,
  transformForRulesFile 
} = require('./platform-adapters');

/**
 * Read centralized command template
 */
async function readCommandTemplate(commandName) {
  const templatePath = path.join(__dirname, '../../templates/commands', `${commandName}.md`);
  return fs.readFile(templatePath, 'utf-8');
}

/**
 * Ensure command directory exists
 */
async function ensureDirectories(projectRoot, platform) {
  const config = getPlatformConfig(platform);
  if (!config || !config.hasNativeCommands) return null;
  
  const commandsDir = path.join(projectRoot, config.commandDir);
  await fs.mkdir(commandsDir, { recursive: true });
  return commandsDir;
}

/**
 * Install slash commands for platforms with native command support
 */
async function installNativeCommands(projectRoot, platform) {
  const config = getPlatformConfig(platform);
  if (!config || !config.hasNativeCommands) {
    return [];
  }

  const targetDir = await ensureDirectories(projectRoot, platform);
  const commandNames = Object.keys(COMMAND_METADATA);
  const results = [];

  for (const commandName of commandNames) {
    try {
      // Read centralized template
      const content = await readCommandTemplate(commandName);
      
      // Transform for platform
      const transformed = config.transform(content, commandName);
      
      // Write to target
      const targetFile = config.fileNaming(commandName);
      const targetPath = path.join(targetDir, targetFile);
      
      await fs.writeFile(targetPath, transformed);
      results.push({ file: targetFile, success: true, path: targetPath });
    } catch (error) {
      results.push({ file: commandName, success: false, error: error.message });
    }
  }

  return results;
}

/**
 * Generate embedded command instructions for platforms without native commands
 */
async function generateEmbeddedCommands() {
  const commands = {};
  const commandNames = Object.keys(COMMAND_METADATA);

  for (const commandName of commandNames) {
    try {
      commands[commandName] = await readCommandTemplate(commandName);
    } catch (error) {
      console.warn(`Warning: Could not read template for ${commandName}: ${error.message}`);
    }
  }

  return transformForRulesFile(commands);
}

/**
 * Embed commands into a config file for platforms without native slash commands
 */
async function embedCommandsInConfig(projectRoot, platform) {
  const config = getPlatformConfig(platform);
  if (!config || config.hasNativeCommands) {
    return { success: false, reason: 'platform-has-native-commands' };
  }

  const configPath = path.join(projectRoot, config.configFile);
  const embeddedContent = await generateEmbeddedCommands();
  
  try {
    // Check if config file exists
    let existingContent = '';
    try {
      existingContent = await fs.readFile(configPath, 'utf-8');
    } catch (e) {
      // File doesn't exist, will create new
    }

    // Check if commands already embedded
    if (existingContent.includes('## Telos Commands')) {
      // Replace existing Telos Commands section
      const beforeTelos = existingContent.split('## Telos Commands')[0];
      const afterTelos = existingContent.split('## Telos Commands')[1];
      
      // Find end of Telos section (next ## heading or end of file)
      const nextHeadingMatch = afterTelos?.match(/\n## [^T]/);
      const afterTelosSection = nextHeadingMatch 
        ? afterTelos.substring(nextHeadingMatch.index) 
        : '';
      
      const newContent = beforeTelos + embeddedContent + afterTelosSection;
      await fs.writeFile(configPath, newContent);
      return { success: true, updated: true, path: configPath };
    } else {
      // Append to existing content
      const newContent = existingContent + '\n\n' + embeddedContent;
      await fs.writeFile(configPath, newContent);
      return { success: true, created: !existingContent, updated: !!existingContent, path: configPath };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Install slash commands for selected platforms
 * - Platforms with native commands: Creates command files
 * - Platforms without native commands: Embeds in config files
 */
async function installSlashCommands(projectRoot, selectedPlatforms = ['claude']) {
  const platforms = Array.isArray(selectedPlatforms) ? selectedPlatforms : [selectedPlatforms];
  const allResults = [];

  for (const platform of platforms) {
    if (hasNativeCommands(platform)) {
      // Install native command files
      const results = await installNativeCommands(projectRoot, platform);
      allResults.push({ platform, type: 'native', results });
    } else if (getPlatformConfig(platform)) {
      // Embed in config file
      const result = await embedCommandsInConfig(projectRoot, platform);
      allResults.push({ platform, type: 'embedded', results: [result] });
    }
    // Skip unknown platforms silently
  }

  return allResults;
}

/**
 * Copy command files (legacy API - kept for backwards compatibility)
 */
async function copyCommandFiles(projectRoot, platform) {
  return installNativeCommands(projectRoot, platform);
}

module.exports = {
  ensureDirectories,
  copyCommandFiles,
  installSlashCommands,
  installNativeCommands,
  embedCommandsInConfig,
  generateEmbeddedCommands,
  readCommandTemplate
};
