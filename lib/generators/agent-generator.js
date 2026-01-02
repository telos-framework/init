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

async function generateL9Agent(hierarchy, outputPath) {
  // Deprecated - L9 is now L4 Purpose in SDD
  console.warn('Note: L9 agent generation is deprecated. Use L4 Purpose spec instead.');
  return null;
}

async function generateL1Agent(hierarchy, tools, outputPath) {
  // Deprecated - L1 is now L1 Function specs in SDD
  console.warn('Note: L1 agent generation is deprecated. Use L1 Function specs instead.');
  return null;
}

async function generateL2Agent(hierarchy, tools, outputPath) {
  // Deprecated - L2 is now part of L1 Function specs in SDD
  console.warn('Note: L2 agent generation is deprecated. Use L1 Function specs instead.');
  return null;
}

module.exports = { generateL9Agent, generateL1Agent, generateL2Agent };
