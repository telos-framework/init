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

async function setupMemoryFiles(projectRoot) {
  const results = {
    agents: await createAgentsMd(projectRoot),
    claude: await createClaudeMd(projectRoot)
  };
  
  return results;
}

module.exports = {
  createAgentsMd,
  createClaudeMd,
  setupMemoryFiles
};
