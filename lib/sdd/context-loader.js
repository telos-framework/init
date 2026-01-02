/**
 * Telos-SDD Context Loader
 * 
 * Recursively loads spec context for AI consumption.
 * Starts from TELOS.md, loads L4:purpose, then walks down to target spec.
 */

const fs = require('fs').promises;
const path = require('path');
const { buildIndex, loadIndex, getLineage, getSiblings, getSpec } = require('./spec-index');
const { parseSpecFile } = require('./spec-parser');

/**
 * Load full context for a spec ID
 * @param {string} projectRoot - Project root directory
 * @param {string} specId - Target spec ID
 * @param {object} options - Loading options
 * @returns {Promise<object>} Context object
 */
async function loadContext(projectRoot, specId, options = {}) {
  const {
    includeSiblings = true,
    includeChildren = false,
    maxDepth = 10,
    format = 'object' // 'object', 'markdown', 'json'
  } = options;

  // Load or build index
  let index = await loadIndex(projectRoot);
  if (!index) {
    index = await buildIndex(projectRoot);
  }

  const context = {
    timestamp: new Date().toISOString(),
    targetId: specId,
    telos: null,
    lineage: [],
    target: null,
    siblings: [],
    children: [],
    implementation: null
  };

  // 1. Load TELOS.md (always)
  try {
    const telosPath = path.join(projectRoot, 'telos', 'TELOS.md');
    context.telos = await fs.readFile(telosPath, 'utf8');
  } catch {
    context.telos = null;
  }

  // 2. Get target spec
  const targetEntry = getSpec(index, specId);
  if (!targetEntry) {
    return {
      ...context,
      error: `Spec "${specId}" not found`
    };
  }

  // 3. Load target spec content
  const targetPath = path.join(projectRoot, targetEntry.filePath);
  try {
    const targetSpec = await parseSpecFile(targetPath);
    context.target = {
      ...targetEntry,
      content: targetSpec.content,
      requirements: targetSpec.requirements,
      scenarios: targetSpec.scenarios,
      functions: targetSpec.functions
    };
  } catch (error) {
    context.target = { ...targetEntry, error: error.message };
  }

  // 4. Load lineage (ancestors from L4 down)
  const lineageEntries = getLineage(index, specId);
  for (const entry of lineageEntries) {
    try {
      const specPath = path.join(projectRoot, entry.filePath);
      const spec = await parseSpecFile(specPath);
      context.lineage.push({
        ...entry,
        content: spec.content,
        // Only include summary for ancestors
        summary: extractSummary(spec.content)
      });
    } catch (error) {
      context.lineage.push({ ...entry, error: error.message });
    }
  }

  // 5. Load siblings (same parent) if requested
  if (includeSiblings) {
    const siblingEntries = getSiblings(index, specId);
    for (const entry of siblingEntries) {
      context.siblings.push({
        id: entry.id,
        title: entry.title,
        level: entry.level
        // Don't include full content for siblings, just metadata
      });
    }
  }

  // 6. Load children if requested
  if (includeChildren && targetEntry.children) {
    for (const childId of targetEntry.children) {
      const childEntry = getSpec(index, childId);
      if (childEntry) {
        context.children.push({
          id: childEntry.id,
          title: childEntry.title,
          level: childEntry.level
        });
      }
    }
  }

  // 7. Add implementation details
  if (targetEntry.modulePath) {
    context.implementation = {
      module: targetEntry.modulePath,
      testFile: targetEntry.testPath
    };
  }

  // Format output if requested
  if (format === 'markdown') {
    return formatContextAsMarkdown(context);
  } else if (format === 'json') {
    return JSON.stringify(context, null, 2);
  }

  return context;
}

/**
 * Load context for a code file/function
 * @param {string} projectRoot - Project root directory
 * @param {string} filePath - Path to code file
 * @param {string} functionName - Optional function name
 * @returns {Promise<object>} Context object
 */
async function loadContextForCode(projectRoot, filePath, functionName = null) {
  // Load index
  let index = await loadIndex(projectRoot);
  if (!index) {
    index = await buildIndex(projectRoot);
  }

  // Find spec by module path
  const relativePath = path.relative(projectRoot, filePath);
  const modulePath = relativePath.replace(/\.[^/.]+$/, ''); // Remove extension

  // Look for matching spec
  const specEntry = index.byPath[modulePath];
  
  if (!specEntry) {
    // Try to find by partial path match
    for (const [modPath, specId] of Object.entries(index.byPath)) {
      if (modulePath.includes(modPath) || modPath.includes(modulePath)) {
        return loadContext(projectRoot, specId);
      }
    }
    
    return {
      error: `No spec found for module "${modulePath}"`,
      suggestion: 'Create a spec with this module_path in metadata'
    };
  }

  // Build full spec ID if function name provided
  let targetSpecId = specEntry;
  if (functionName) {
    targetSpecId = `${specEntry}:${functionName}`;
    // Check if this specific function spec exists
    if (!index.specs[targetSpecId]) {
      targetSpecId = specEntry; // Fall back to module spec
    }
  }

  return loadContext(projectRoot, targetSpecId);
}

/**
 * Extract summary from spec content
 * @param {string} content - Spec markdown content
 * @returns {string} Summary text
 */
function extractSummary(content) {
  // Get first paragraph after the title
  const lines = content.split('\n');
  let foundTitle = false;
  const summaryLines = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      foundTitle = true;
      continue;
    }
    
    if (foundTitle) {
      if (line.trim() === '') {
        if (summaryLines.length > 0) break;
        continue;
      }
      if (line.startsWith('#')) break;
      if (line.startsWith('<!--')) continue;
      summaryLines.push(line);
    }
  }

  return summaryLines.join(' ').slice(0, 200);
}

/**
 * Format context as markdown for AI consumption
 * @param {object} context - Context object
 * @returns {string} Markdown formatted context
 */
function formatContextAsMarkdown(context) {
  const lines = [];

  lines.push(`# Telos Context for ${context.targetId}`);
  lines.push('');
  lines.push(`Generated: ${context.timestamp}`);
  lines.push('');

  // Lineage section
  if (context.lineage.length > 0) {
    lines.push('## Lineage (L4 → Target)');
    lines.push('');
    
    for (const ancestor of context.lineage) {
      const levelName = `L${ancestor.level}:${ancestor.levelName || ''}`;
      lines.push(`### ${levelName} - ${ancestor.title}`);
      if (ancestor.summary) {
        lines.push(`> ${ancestor.summary}`);
      }
      lines.push('');
    }
  }

  // Target section
  if (context.target) {
    lines.push('## Target Spec');
    lines.push('');
    
    if (context.target.content) {
      lines.push(context.target.content);
    } else if (context.target.error) {
      lines.push(`*Error loading spec: ${context.target.error}*`);
    }
    lines.push('');
  }

  // Siblings section
  if (context.siblings.length > 0) {
    lines.push('## Adjacent Specs (Same Parent)');
    lines.push('');
    for (const sibling of context.siblings) {
      lines.push(`- **${sibling.id}**: ${sibling.title}`);
    }
    lines.push('');
  }

  // Children section
  if (context.children.length > 0) {
    lines.push('## Child Specs');
    lines.push('');
    for (const child of context.children) {
      lines.push(`- **${child.id}**: ${child.title}`);
    }
    lines.push('');
  }

  // Implementation section
  if (context.implementation) {
    lines.push('## Implementation');
    lines.push('');
    lines.push(`- **Module**: \`${context.implementation.module}\``);
    if (context.implementation.testFile) {
      lines.push(`- **Tests**: \`${context.implementation.testFile}\``);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Get spec tree as ASCII visualization
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<string>} ASCII tree
 */
async function getSpecTree(projectRoot) {
  let index = await loadIndex(projectRoot);
  if (!index) {
    index = await buildIndex(projectRoot);
  }

  const lines = [];
  lines.push('telos/specs/');

  // Start from L4
  const l4Specs = Object.values(index.specs).filter(s => s.level === 4);
  
  for (const root of l4Specs) {
    printSpecNode(root, index, lines, '');
  }

  return lines.join('\n');
}

/**
 * Recursively print spec node
 * @param {object} spec - Spec entry
 * @param {object} index - Spec index
 * @param {string[]} lines - Output lines
 * @param {string} prefix - Line prefix
 */
function printSpecNode(spec, index, lines, prefix) {
  const levelIcon = spec.level === 4 ? '◆' : 
                    spec.level === 3 ? '◇' :
                    spec.level === 2 ? '○' : '•';
  
  const status = spec.scenarioCount > 0 ? '✓' : '○';
  
  lines.push(`${prefix}${levelIcon} ${spec.id} ${status}`);
  lines.push(`${prefix}  └─ ${spec.title}`);

  // Print children
  const children = (spec.children || [])
    .map(id => index.specs[id])
    .filter(Boolean)
    .sort((a, b) => b.level - a.level); // Higher levels first

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const isLast = i === children.length - 1;
    const childPrefix = prefix + (isLast ? '    ' : '│   ');
    printSpecNode(child, index, lines, childPrefix);
  }
}

module.exports = {
  loadContext,
  loadContextForCode,
  formatContextAsMarkdown,
  getSpecTree,
  extractSummary
};
