import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadState, saveState, updatePhase, clearState, isPhaseComplete, getPhaseData } from '../lib/commands/init-state.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DIR = path.join(__dirname, 'tmp-state-test');
const STATE_FILE = path.join(TEST_DIR, '.telos-init-state.json');

describe('Init State Persistence', () => {
  beforeEach(() => {
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
    process.chdir(TEST_DIR);
  });

  afterEach(() => {
    if (fs.existsSync(STATE_FILE)) {
      fs.unlinkSync(STATE_FILE);
    }
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  it('should save and load state', () => {
    const state = {
      phases: {
        phase1: { completed: true }
      },
      timestamp: new Date().toISOString()
    };

    const saved = saveState(state, TEST_DIR);
    expect(saved).toBe(true);

    const loaded = loadState(TEST_DIR);
    expect(loaded).toBeTruthy();
    expect(loaded.phases.phase1.completed).toBe(true);
  });

  it('should return null for non-existent state', () => {
    const loaded = loadState(TEST_DIR);
    expect(loaded).toBe(null);
  });

  it('should update phase data', () => {
    const updated = updatePhase('telosDiscovery', { data: { purpose: 'test' } }, TEST_DIR);
    expect(updated).toBe(true);

    const loaded = loadState(TEST_DIR);
    expect(loaded.phases.telosDiscovery.data.purpose).toBe('test');
    expect(loaded.lastPhase).toBe('telosDiscovery');
  });

  it('should check if phase is complete', () => {
    updatePhase('phase1', { completed: true }, TEST_DIR);
    const state = loadState(TEST_DIR);

    expect(isPhaseComplete(state, 'phase1')).toBe(true);
    expect(isPhaseComplete(state, 'phase2')).toBe(false);
  });

  it('should clear state', () => {
    saveState({ test: true }, TEST_DIR);
    expect(fs.existsSync(STATE_FILE)).toBe(true);

    clearState(TEST_DIR);
    expect(fs.existsSync(STATE_FILE)).toBe(false);
  });

  it('should handle corrupted state file gracefully', () => {
    fs.writeFileSync(STATE_FILE, 'invalid json{', 'utf8');
    
    const loaded = loadState(TEST_DIR);
    expect(loaded).toBe(null);
  });

  it('should get phase data', () => {
    const testData = { purpose: 'Enable API marketplace', impact: 'APIs published' };
    updatePhase('telosDiscovery', { data: testData }, TEST_DIR);
    
    const state = loadState(TEST_DIR);
    const data = getPhaseData(state, 'telosDiscovery');
    
    expect(data).toEqual(testData);
  });

  it('should return null for non-existent phase data', () => {
    const state = loadState(TEST_DIR);
    const data = getPhaseData(state, 'nonexistent');
    
    expect(data).toBe(null);
  });

  it('should preserve existing phases when updating new phase', () => {
    updatePhase('phase1', { data: { value: 'first' } }, TEST_DIR);
    updatePhase('phase2', { data: { value: 'second' } }, TEST_DIR);
    
    const state = loadState(TEST_DIR);
    
    expect(getPhaseData(state, 'phase1').value).toBe('first');
    expect(getPhaseData(state, 'phase2').value).toBe('second');
    expect(state.lastPhase).toBe('phase2');
  });

  it('should include timestamps for each phase', () => {
    updatePhase('phase1', { completed: true }, TEST_DIR);
    
    const state = loadState(TEST_DIR);
    
    expect(state.phases.phase1.completedAt).toBeDefined();
    expect(state.lastUpdated).toBeDefined();
    expect(typeof state.phases.phase1.completedAt).toBe('string');
  });

  it('should save complex nested data structures', () => {
    const complexData = {
      hierarchy: {
        L9: { name: 'Telos-Guardian', purpose: 'Test' },
        L8: { name: 'Market-Analyst', purpose: 'Test' }
      },
      tools: ['eslint', 'vitest'],
      config: { quick: false, verbose: true }
    };
    
    updatePhase('hierarchyBuilding', { data: complexData }, TEST_DIR);
    
    const state = loadState(TEST_DIR);
    const loaded = getPhaseData(state, 'hierarchyBuilding');
    
    expect(loaded.hierarchy.L9.name).toBe('Telos-Guardian');
    expect(loaded.tools).toEqual(['eslint', 'vitest']);
    expect(loaded.config.verbose).toBe(true);
  });

  it('should track all init phases correctly', () => {
    // Simulate a full init run
    updatePhase('telosDiscovery', { data: { purpose: 'test' } }, TEST_DIR);
    updatePhase('hierarchyBuilding', { data: { L9: 'test' } }, TEST_DIR);
    updatePhase('phase1', { completed: true }, TEST_DIR);
    updatePhase('phase2', { data: { tools: [] } }, TEST_DIR);
    updatePhase('phase3', { completed: true }, TEST_DIR);
    updatePhase('phase4', { completed: true }, TEST_DIR);
    updatePhase('phase5', { completed: true }, TEST_DIR);
    
    const state = loadState(TEST_DIR);
    
    expect(isPhaseComplete(state, 'telosDiscovery')).toBe(true);
    expect(isPhaseComplete(state, 'hierarchyBuilding')).toBe(true);
    expect(isPhaseComplete(state, 'phase1')).toBe(true);
    expect(isPhaseComplete(state, 'phase2')).toBe(true);
    expect(isPhaseComplete(state, 'phase3')).toBe(true);
    expect(isPhaseComplete(state, 'phase4')).toBe(true);
    expect(isPhaseComplete(state, 'phase5')).toBe(true);
    expect(state.lastPhase).toBe('phase5');
  });

  it('should handle partial initialization state', () => {
    // Simulate a failed init after phase 2
    updatePhase('telosDiscovery', { data: { purpose: 'test' } }, TEST_DIR);
    updatePhase('hierarchyBuilding', { data: { L9: 'test' } }, TEST_DIR);
    updatePhase('phase1', { completed: true }, TEST_DIR);
    updatePhase('phase2', { data: { tools: [] } }, TEST_DIR);
    
    const state = loadState(TEST_DIR);
    
    expect(isPhaseComplete(state, 'telosDiscovery')).toBe(true);
    expect(isPhaseComplete(state, 'phase2')).toBe(true);
    expect(isPhaseComplete(state, 'phase3')).toBe(false);
    expect(isPhaseComplete(state, 'phase4')).toBe(false);
    expect(isPhaseComplete(state, 'phase5')).toBe(false);
  });

  it('should handle clear state on non-existent file', () => {
    const result = clearState(TEST_DIR);
    expect(result).toBe(true);
  });
});
