const fs = require('fs').promises;
const path = require('path');

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readTemplate(templateName) {
  const templatePath = path.join(__dirname, '../../templates', templateName);
  return await fs.readFile(templatePath, 'utf-8');
}

async function createAgentsMd(projectRoot) {
  const agentsMdPath = path.join(projectRoot, 'AGENTS.md');
  
  if (await fileExists(agentsMdPath)) {
    const existingContent = await fs.readFile(agentsMdPath, 'utf-8');
    
    if (existingContent.includes('Telos Framework')) {
      return { created: false, updated: false, path: agentsMdPath, reason: 'already-exists' };
    }
    
    const template = await readTemplate('AGENTS.md');
    const updatedContent = existingContent + '\n\n' + template;
    await fs.writeFile(agentsMdPath, updatedContent);
    
    return { created: false, updated: true, path: agentsMdPath };
  }
  
  const template = await readTemplate('AGENTS.md');
  await fs.writeFile(agentsMdPath, template);
  
  return { created: true, updated: false, path: agentsMdPath };
}

async function createClaudeMd(projectRoot) {
  const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');
  
  if (await fileExists(claudeMdPath)) {
    const existingContent = await fs.readFile(claudeMdPath, 'utf-8');
    
    if (existingContent.includes('Telos Framework')) {
      return { created: false, updated: false, path: claudeMdPath, reason: 'already-exists' };
    }
    
    const template = await readTemplate('CLAUDE.md');
    const updatedContent = existingContent + '\n\n' + template;
    await fs.writeFile(claudeMdPath, updatedContent);
    
    return { created: false, updated: true, path: claudeMdPath };
  }
  
  const template = await readTemplate('CLAUDE.md');
  await fs.writeFile(claudeMdPath, template);
  
  return { created: true, updated: false, path: claudeMdPath };
}

async function createConfigFile(projectRoot, platform) {
  const configFiles = {
    'cursor': '.cursorrules',
    'cline': '.clinerules',
    'windsurf': '.windsurfrules',
    'roo': '.roocode',
    'gemini': 'GEMINI.md'
  };
  
  const fileName = configFiles[platform];
  if (!fileName) return null;
  
  const filePath = path.join(projectRoot, fileName);
  const template = await readTemplate('CLAUDE.md');
  
  if (await fileExists(filePath)) {
    const existingContent = await fs.readFile(filePath, 'utf-8');
    
    if (existingContent.includes('Telos Framework')) {
      return { created: false, updated: false, path: filePath, reason: 'already-exists' };
    }
    
    const updatedContent = template + '\n\n' + existingContent;
    await fs.writeFile(filePath, updatedContent);
    
    return { created: false, updated: true, path: filePath };
  }
  
  await fs.writeFile(filePath, template);
  return { created: true, updated: false, path: filePath };
}

async function setupMemoryFiles(projectRoot, platforms = []) {
  const results = {};
  
  const platformsArray = Array.isArray(platforms) ? platforms : [platforms];
  
  if (platformsArray.includes('other') || platformsArray.length === 0 || !platformsArray.some(p => ['claude', 'opencode', 'cursor', 'cline', 'windsurf', 'roo', 'gemini'].includes(p))) {
    results.agents = await createAgentsMd(projectRoot);
  }
  
  for (const platform of platformsArray) {
    if (platform === 'claude') {
      results.claude = await createClaudeMd(projectRoot);
    } else if (platform === 'cursor' || platform === 'cline' || platform === 'windsurf' || platform === 'roo' || platform === 'gemini') {
      results[platform] = await createConfigFile(projectRoot, platform);
    } else if (platform === 'other') {
      if (!results.agents) {
        results.agents = await createAgentsMd(projectRoot);
      }
    }
  }
  
  return results;
}

module.exports = {
  createAgentsMd,
  createClaudeMd,
  createConfigFile,
  setupMemoryFiles
};
