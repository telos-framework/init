const fs = require('fs').promises;
const path = require('path');

async function ensureDirectories(projectRoot, platform) {
  const commandsDir = platform === 'claude' 
    ? path.join(projectRoot, '.claude', 'commands', 'telos')
    : path.join(projectRoot, '.opencode', 'command');
  
  await fs.mkdir(commandsDir, { recursive: true });
  return commandsDir;
}

async function addFrontmatterToContent(content, filename) {
  const descriptions = {
    'telos-init.md': 'Initialize Telos multi-agent system for this project',
    'telos-quick.md': 'Quick Telos initialization with auto-accepted AI proposals',
    'telos-validate.md': 'Validate current code against Telos purpose hierarchy',
    'telos-status.md': 'Show current Telos configuration and hierarchy',
    'telos-reset.md': 'Clear existing Telos installation and reinitialize'
  };
  
  const description = descriptions[filename] || 'Telos command';
  
  if (content.startsWith('---')) {
    return content;
  }
  
  return `---\ndescription: ${description}\n---\n\n${content}`;
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
    
    let targetFile = file;
    if (platform === 'opencode') {
      targetFile = file.replace('.md', '').replace(/^/, 'telos-') + '.md';
    }
    
    const targetPath = path.join(targetDir, targetFile);
    
    try {
      let content = await fs.readFile(sourcePath, 'utf-8');
      
      if (platform === 'opencode') {
        content = await addFrontmatterToContent(content, targetFile);
      }
      
      await fs.writeFile(targetPath, content);
      results.push({ file: targetFile, success: true, path: targetPath });
    } catch (error) {
      results.push({ file: targetFile, success: false, error: error.message });
    }
  }
  
  return results;
}

async function installSlashCommands(projectRoot, selectedPlatforms = ['claude']) {
  const platforms = Array.isArray(selectedPlatforms) ? selectedPlatforms : [selectedPlatforms];
  
  const commandPlatforms = platforms.filter(p => p === 'claude' || p === 'opencode');
  
  const allResults = [];
  for (const platform of commandPlatforms) {
    const results = await copyCommandFiles(projectRoot, platform);
    allResults.push({ platform, results });
  }
  
  return allResults;
}

module.exports = {
  ensureDirectories,
  copyCommandFiles,
  installSlashCommands
};
