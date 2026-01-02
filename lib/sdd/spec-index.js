/**
 * Telos-SDD Spec Index
 * 
 * Builds and maintains an index of all specs for fast lookup.
 * The index is stored as index.json in the telos directory.
 */

const fs = require('fs').promises;
const path = require('path');
const { parseSpecFile, LEVEL_FOLDERS } = require('./spec-parser');

/**
 * Scan specs directory and build index
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<object>} Index object
 */
async function buildIndex(projectRoot) {
  const specsRoot = path.join(projectRoot, 'telos', 'specs');
  const index = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    specs: {},
    byLevel: { 4: [], 3: [], 2: [], 1: [] },
    byPath: {},
    errors: []
  };

  // Check if specs directory exists
  try {
    await fs.access(specsRoot);
  } catch {
    return index;
  }

  // Scan each level folder
  for (const [level, folder] of Object.entries(LEVEL_FOLDERS)) {
    const levelPath = path.join(specsRoot, folder);
    
    try {
      await fs.access(levelPath);
    } catch {
      continue;
    }

    const files = await scanDirectory(levelPath);
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      try {
        const spec = await parseSpecFile(file);
        
        if (spec.valid) {
          const id = spec.metadata.id;
          
          index.specs[id] = {
            id,
            level: spec.metadata.level,
            levelName: spec.metadata.levelName,
            title: spec.title,
            filePath: path.relative(projectRoot, file),
            parent: spec.metadata.parent || null,
            children: spec.metadata.children || [],
            modulePath: spec.metadata.module_path || null,
            testPath: spec.metadata.test_path || null,
            scenarioCount: spec.scenarios.length,
            functionCount: spec.functions.length
          };

          index.byLevel[spec.metadata.level].push(id);
          
          if (spec.metadata.module_path) {
            index.byPath[spec.metadata.module_path] = id;
          }
        } else {
          index.errors.push({
            file: path.relative(projectRoot, file),
            error: spec.error
          });
        }
      } catch (error) {
        index.errors.push({
          file: path.relative(projectRoot, file),
          error: error.message
        });
      }
    }
  }

  // Build parent-child relationships
  for (const spec of Object.values(index.specs)) {
    if (spec.parent && index.specs[spec.parent]) {
      if (!index.specs[spec.parent].children.includes(spec.id)) {
        index.specs[spec.parent].children.push(spec.id);
      }
    }
  }

  return index;
}

/**
 * Recursively scan directory for files
 * @param {string} dir - Directory path
 * @returns {Promise<string[]>} Array of file paths
 */
async function scanDirectory(dir) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await scanDirectory(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist or not accessible
  }

  return files;
}

/**
 * Save index to file
 * @param {string} projectRoot - Project root directory
 * @param {object} index - Index object
 */
async function saveIndex(projectRoot, index) {
  const indexPath = path.join(projectRoot, 'telos', 'index.json');
  await fs.mkdir(path.dirname(indexPath), { recursive: true });
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');
  return indexPath;
}

/**
 * Load existing index
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<object|null>} Index object or null
 */
async function loadIndex(projectRoot) {
  const indexPath = path.join(projectRoot, 'telos', 'index.json');
  
  try {
    const content = await fs.readFile(indexPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Get spec by ID from index
 * @param {object} index - Index object
 * @param {string} specId - Spec ID
 * @returns {object|null} Spec entry or null
 */
function getSpec(index, specId) {
  return index.specs[specId] || null;
}

/**
 * Get spec by module path
 * @param {object} index - Index object
 * @param {string} modulePath - Module path (e.g., "src/auth/validation")
 * @returns {object|null} Spec entry or null
 */
function getSpecByPath(index, modulePath) {
  const specId = index.byPath[modulePath];
  return specId ? index.specs[specId] : null;
}

/**
 * Get all specs at a given level
 * @param {object} index - Index object
 * @param {number} level - Level number (1-4)
 * @returns {object[]} Array of spec entries
 */
function getSpecsByLevel(index, level) {
  const ids = index.byLevel[level] || [];
  return ids.map(id => index.specs[id]).filter(Boolean);
}

/**
 * Get lineage (ancestors) for a spec
 * @param {object} index - Index object
 * @param {string} specId - Spec ID
 * @returns {object[]} Array of ancestor specs from L4 down
 */
function getLineage(index, specId) {
  const lineage = [];
  let current = index.specs[specId];

  while (current && current.parent) {
    const parent = index.specs[current.parent];
    if (parent) {
      lineage.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }

  return lineage;
}

/**
 * Get siblings (same parent) for a spec
 * @param {object} index - Index object
 * @param {string} specId - Spec ID
 * @returns {object[]} Array of sibling specs
 */
function getSiblings(index, specId) {
  const spec = index.specs[specId];
  if (!spec || !spec.parent) return [];

  const parent = index.specs[spec.parent];
  if (!parent) return [];

  return parent.children
    .filter(id => id !== specId)
    .map(id => index.specs[id])
    .filter(Boolean);
}

/**
 * Validate index integrity
 * @param {object} index - Index object
 * @returns {object} Validation result
 */
function validateIndex(index) {
  const issues = [];

  for (const [id, spec] of Object.entries(index.specs)) {
    // Check parent exists
    if (spec.parent && !index.specs[spec.parent]) {
      issues.push({
        type: 'missing_parent',
        specId: id,
        parentId: spec.parent,
        message: `Spec "${id}" references non-existent parent "${spec.parent}"`
      });
    }

    // Check children exist
    for (const childId of spec.children) {
      if (!index.specs[childId]) {
        issues.push({
          type: 'missing_child',
          specId: id,
          childId,
          message: `Spec "${id}" references non-existent child "${childId}"`
        });
      }
    }

    // Check L4 has no parent
    if (spec.level === 4 && spec.parent) {
      issues.push({
        type: 'invalid_parent',
        specId: id,
        message: `L4:purpose should not have a parent`
      });
    }

    // Check non-L4 has parent (warning)
    if (spec.level < 4 && !spec.parent) {
      issues.push({
        type: 'orphan_spec',
        specId: id,
        message: `Spec "${id}" has no parent - may be orphaned`
      });
    }
  }

  return {
    valid: issues.filter(i => i.type !== 'orphan_spec').length === 0,
    issues
  };
}

module.exports = {
  buildIndex,
  saveIndex,
  loadIndex,
  getSpec,
  getSpecByPath,
  getSpecsByLevel,
  getLineage,
  getSiblings,
  validateIndex
};
