const fs = require('fs').promises;
const path = require('path');

async function detectPlatforms(projectRoot) {
  const platforms = [];

  if (await fileExists(path.join(projectRoot, 'CLAUDE.md'))) {
    platforms.push({ name: 'claude', configFile: 'CLAUDE.md' });
  }

  if (await fileExists(path.join(projectRoot, '.cursor'))) {
    platforms.push({ name: 'cursor', configFile: '.cursor/rules/agents.md' });
  }

  if (await fileExists(path.join(projectRoot, '.github', 'copilot-instructions.md'))) {
    platforms.push({ name: 'copilot', configFile: '.github/copilot-instructions.md' });
  }

  if (await fileExists(path.join(projectRoot, '.gemini'))) {
    platforms.push({ name: 'gemini', configFile: '.gemini/instructions.md' });
  }

  if (platforms.length === 0) {
    platforms.push({ name: 'claude', configFile: 'CLAUDE.md' });
  }

  return platforms;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function getPlatformConfig(platformName) {
  const configs = {
    claude: {
      name: 'Claude',
      targets: [
        { source: 'telos/content/AGENTS.md', target: 'CLAUDE.md' },
        { source: 'telos/content/TELOS.md', target: 'TELOS.md' },
        { source: 'telos/content/LOGOS.md', target: 'LOGOS.md' }
      ]
    },
    cursor: {
      name: 'Cursor',
      targets: [
        { source: 'telos/content/AGENTS.md', target: '.cursor/rules/agents.md' },
        { source: 'telos/content/TELOS.md', target: '.cursor/rules/telos.md' },
        { source: 'telos/content/LOGOS.md', target: '.cursor/rules/logos.md' }
      ]
    },
    copilot: {
      name: 'GitHub Copilot',
      targets: [
        { source: 'telos/content/AGENTS.md', target: '.github/copilot-instructions.md' }
      ]
    },
    gemini: {
      name: 'Gemini',
      targets: [
        { source: 'telos/content/AGENTS.md', target: '.gemini/instructions.md' }
      ]
    }
  };

  return configs[platformName] || configs.claude;
}

module.exports = { detectPlatforms, getPlatformConfig };
