const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

async function detectPlatform(projectRoot) {
  const claudeDir = path.join(projectRoot, '.claude');
  const opencodeDir = path.join(projectRoot, '.opencode');
  
  const hasClaudeDir = await fs.access(claudeDir).then(() => true).catch(() => false);
  const hasOpencodeDir = await fs.access(opencodeDir).then(() => true).catch(() => false);
  
  const platforms = [];
  if (hasClaudeDir) platforms.push('claude');
  if (hasOpencodeDir) platforms.push('opencode');
  
  if (platforms.length === 0) {
    platforms.push('claude');
  }
  
  return platforms;
}

async function ensureDirectories(projectRoot, platform) {
  const commandsDir = platform === 'claude' 
    ? path.join(projectRoot, '.claude', 'commands', 'telos')
    : path.join(projectRoot, '.opencode', 'command', 'telos');
  
  await fs.mkdir(commandsDir, { recursive: true });
  return commandsDir;
}

async function copyCommandFiles(projectRoot, platform) {
  const sourceDir = path.join(__dirname, '../../.claude/commands/telos');
  const targetDir = await ensureDirectories(projectRoot, platform);
  
  const commandFiles = [
    'init.md',
    'quick.md',
    'reset.md',
    'validate.md',
    'status.md'
  ];
  
  const results = [];
  for (const file of commandFiles) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    try {
      await fs.copyFile(sourcePath, targetPath);
      results.push({ file, success: true, path: targetPath });
    } catch (error) {
      results.push({ file, success: false, error: error.message });
    }
  }
  
  return results;
}

async function installSlashCommands(projectRoot) {
  const platforms = await detectPlatform(projectRoot);
  
  const allResults = [];
  for (const platform of platforms) {
    const results = await copyCommandFiles(projectRoot, platform);
    allResults.push({ platform, results });
  }
  
  return allResults;
}

module.exports = {
  detectPlatform,
  ensureDirectories,
  copyCommandFiles,
  installSlashCommands
};
