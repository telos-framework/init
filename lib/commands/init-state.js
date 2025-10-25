const fs = require('fs');
const path = require('path');

const STATE_FILE = '.telos-init-state.json';

/**
 * Get the state file path for the current directory
 */
function getStateFilePath(cwd = process.cwd()) {
  return path.join(cwd, STATE_FILE);
}

/**
 * Load existing initialization state if present
 */
function loadState(cwd = process.cwd()) {
  const statePath = getStateFilePath(cwd);
  
  if (!fs.existsSync(statePath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(statePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Save initialization state
 */
function saveState(state, cwd = process.cwd()) {
  const statePath = getStateFilePath(cwd);
  
  try {
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Update specific phase data in state
 */
function updatePhase(phase, data, cwd = process.cwd()) {
  const currentState = loadState(cwd) || { phases: {}, timestamp: new Date().toISOString() };
  
  currentState.phases[phase] = {
    ...data,
    completedAt: new Date().toISOString()
  };
  currentState.lastPhase = phase;
  currentState.lastUpdated = new Date().toISOString();
  
  return saveState(currentState, cwd);
}

/**
 * Clear initialization state (call on successful completion)
 */
function clearState(cwd = process.cwd()) {
  const statePath = getStateFilePath(cwd);
  
  try {
    if (fs.existsSync(statePath)) {
      fs.unlinkSync(statePath);
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if a specific phase is completed
 */
function isPhaseComplete(state, phase) {
  return !!(state && state.phases && state.phases[phase]);
}

/**
 * Get phase data if it exists
 */
function getPhaseData(state, phase) {
  if (state && state.phases && state.phases[phase]) {
    return state.phases[phase].data;
  }
  return null;
}

module.exports = {
  loadState,
  saveState,
  updatePhase,
  clearState,
  isPhaseComplete,
  getPhaseData,
  getStateFilePath
};
