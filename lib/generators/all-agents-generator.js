const fs = require('fs').promises;
const path = require('path');

/**
 * DEPRECATED: The 9-level agent system has been replaced by 4-level SDD.
 * This file is kept for backward compatibility but generates minimal output.
 * 
 * Use the SDD system instead:
 * - telos/specs/L4-purpose/
 * - telos/specs/L3-experience/
 * - telos/specs/L2-contract/
 * - telos/specs/L1-function/
 */

async function generateAllAgents(hierarchy, levelTools, outputDir) {
  // Return empty array - agents are deprecated in favor of specs
  console.warn('Note: Agent generation is deprecated. Use SDD specs instead.');
  return [];
}

async function generateAgent(level, hierarchyData, tools, outputDir, meta) {
  // Deprecated - no-op
  return null;
}

module.exports = { generateAllAgents, generateAgent };
