/**
 * Telos-SDD Spec Parser
 * 
 * Parses spec files and extracts metadata from the telos-metadata comment block.
 * Supports the 4-level hierarchy: L4:purpose, L3:experience, L2:contract, L1:function
 */

const fs = require('fs').promises;
const path = require('path');

const LEVEL_NAMES = {
  4: 'purpose',
  3: 'experience',
  2: 'contract',
  1: 'function'
};

const LEVEL_FOLDERS = {
  4: 'L4-purpose',
  3: 'L3-experience',
  2: 'L2-contract',
  1: 'L1-function'
};

/**
 * Parse telos-metadata from a spec file
 * @param {string} content - File content
 * @returns {object|null} Parsed metadata or null if not found
 */
function parseMetadata(content) {
  const metadataRegex = /<!--\s*telos-metadata\s*([\s\S]*?)-->/;
  const match = content.match(metadataRegex);
  
  if (!match) {
    return null;
  }

  const metadataBlock = match[1];
  const metadata = {};

  // Parse YAML-like key: value pairs
  const lines = metadataBlock.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();

    // Handle arrays [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    }

    metadata[key] = value;
  }

  // Validate required fields
  if (!metadata.id || !metadata.level) {
    return null;
  }

  // Parse level as number
  metadata.level = parseInt(metadata.level, 10);
  
  // Add level name
  metadata.levelName = LEVEL_NAMES[metadata.level] || 'unknown';

  return metadata;
}

/**
 * Parse a spec file and return full spec object
 * @param {string} filePath - Path to spec file
 * @returns {Promise<object>} Spec object
 */
async function parseSpecFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const metadata = parseMetadata(content);

  if (!metadata) {
    return {
      valid: false,
      filePath,
      error: 'No valid telos-metadata found'
    };
  }

  // Extract title from first H1
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : metadata.title || metadata.id;

  // Extract requirements (lines starting with "- SHALL" or "The ... SHALL")
  const requirements = [];
  const reqRegex = /(?:^|\n)(?:#+\s*)?(?:The\s+\w+\s+)?SHALL\s+(.+)/gi;
  let reqMatch;
  while ((reqMatch = reqRegex.exec(content)) !== null) {
    requirements.push(reqMatch[1].trim());
  }

  // Extract scenarios
  const scenarios = [];
  const scenarioRegex = /#{3,}\s*Scenario:\s*(.+)/gi;
  let scenarioMatch;
  while ((scenarioMatch = scenarioRegex.exec(content)) !== null) {
    scenarios.push(scenarioMatch[1].trim());
  }

  // Extract function signatures for L1 specs
  const functions = [];
  if (metadata.level === 1) {
    const funcRegex = /#{3,}\s*L1:function:[^:]+:(\w+)/g;
    let funcMatch;
    while ((funcMatch = funcRegex.exec(content)) !== null) {
      functions.push(funcMatch[1]);
    }
  }

  return {
    valid: true,
    filePath,
    metadata,
    title,
    requirements,
    scenarios,
    functions,
    content
  };
}

/**
 * Parse spec ID to extract components
 * @param {string} specId - Spec ID like "L1:function:src/auth/validation:validateToken"
 * @returns {object} Parsed components
 */
function parseSpecId(specId) {
  const parts = specId.split(':');
  
  if (parts.length < 2) {
    return { valid: false, error: 'Invalid spec ID format' };
  }

  const levelPart = parts[0]; // L1, L2, L3, L4
  const levelMatch = levelPart.match(/^L(\d)$/);
  
  if (!levelMatch) {
    return { valid: false, error: 'Invalid level format' };
  }

  const level = parseInt(levelMatch[1], 10);
  const levelName = parts[1]; // purpose, experience, contract, function

  // Validate level matches name
  if (LEVEL_NAMES[level] !== levelName) {
    return { valid: false, error: `Level ${level} should be "${LEVEL_NAMES[level]}", got "${levelName}"` };
  }

  const result = {
    valid: true,
    level,
    levelName,
    fullId: specId
  };

  // Parse remaining path components
  if (parts.length > 2) {
    result.path = parts.slice(2, -1).join(':');
    result.name = parts[parts.length - 1];
  } else {
    result.path = '';
    result.name = levelName;
  }

  return result;
}

/**
 * Build spec ID from components
 * @param {number} level - Level number (1-4)
 * @param {string} path - Module path (e.g., "src/auth/validation")
 * @param {string} name - Function/component name
 * @returns {string} Full spec ID
 */
function buildSpecId(level, path = '', name = '') {
  const levelName = LEVEL_NAMES[level];
  
  if (level === 4) {
    return `L4:purpose`;
  }

  const parts = [`L${level}`, levelName];
  
  if (path) {
    parts.push(path);
  }
  
  if (name) {
    parts.push(name);
  }

  return parts.join(':');
}

/**
 * Get the expected file path for a spec ID
 * @param {string} specId - Spec ID
 * @param {string} specsRoot - Root path for specs (default: telos/specs)
 * @returns {string} Expected file path
 */
function specIdToPath(specId, specsRoot = 'telos/specs') {
  const parsed = parseSpecId(specId);
  
  if (!parsed.valid) {
    return null;
  }

  const folder = LEVEL_FOLDERS[parsed.level];
  
  if (parsed.level === 4) {
    return path.join(specsRoot, folder, 'purpose.md');
  }

  // Convert path to filename-safe format
  const fileName = parsed.path 
    ? `${parsed.path.replace(/\//g, '-')}.md`
    : `${parsed.name}.md`;

  return path.join(specsRoot, folder, fileName);
}

/**
 * Get parent spec ID from a spec ID
 * @param {string} specId - Spec ID
 * @param {object} metadata - Spec metadata containing parent reference
 * @returns {string|null} Parent spec ID or null
 */
function getParentId(specId, metadata) {
  if (metadata && metadata.parent) {
    return metadata.parent;
  }
  
  // Default parent based on level
  const parsed = parseSpecId(specId);
  if (!parsed.valid || parsed.level === 4) {
    return null;
  }

  // L3 defaults to L4:purpose
  if (parsed.level === 3) {
    return 'L4:purpose';
  }

  // L2 and L1 need explicit parent
  return null;
}

module.exports = {
  LEVEL_NAMES,
  LEVEL_FOLDERS,
  parseMetadata,
  parseSpecFile,
  parseSpecId,
  buildSpecId,
  specIdToPath,
  getParentId
};
