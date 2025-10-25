import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadState, saveState, clearState, isPhaseComplete, getPhaseData } from '../lib/commands/init-state.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DIR = path.join(__dirname, 'tmp-init-integration');
const STATE_FILE = path.join(TEST_DIR, '.telos-init-state.json');

describe('Init Command State Integration', () => {
  beforeEach(() => {
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  it('should resume from saved telos discovery data', () => {
    // Simulate a previous init that completed telos discovery
    const telosData = {
      telos: 'Enable API marketplace',
      beneficiaries: 'API publishers and users',
      impact: 'APIs published and used',
      constraints: 'Open marketplace, censorship resistance',
      timestamp: new Date().toISOString()
    };

    saveState({
      phases: {
        telosDiscovery: {
          data: telosData,
          completedAt: new Date().toISOString()
        }
      },
      timestamp: new Date().toISOString(),
      lastPhase: 'telosDiscovery'
    }, TEST_DIR);

    const state = loadState(TEST_DIR);
    expect(isPhaseComplete(state, 'telosDiscovery')).toBe(true);
    
    const loaded = getPhaseData(state, 'telosDiscovery');
    expect(loaded.telos).toBe('Enable API marketplace');
    expect(loaded.beneficiaries).toBe('API publishers and users');
  });

  it('should resume from saved hierarchy data', () => {
    const hierarchy = {
      L9: { level: 'L9', name: 'Telos-Guardian', purpose: 'Test purpose' },
      L8: { level: 'L8', name: 'Market-Analyst', purpose: 'Business metrics' },
      L7: { level: 'L7', name: 'Insight-Synthesizer', purpose: 'User insights' },
      L6: { level: 'L6', name: 'UX-Simulator', purpose: 'User experience' },
      L5: { level: 'L5', name: 'Journey-Validator', purpose: 'Integration' },
      L4: { level: 'L4', name: 'Integration-Contractor', purpose: 'API contracts' },
      L3: { level: 'L3', name: 'Component-Architect', purpose: 'Components' },
      L2: { level: 'L2', name: 'Function-Author', purpose: 'Functions' },
      L1: { level: 'L1', name: 'Syntax-Linter', purpose: 'Code structure' }
    };

    saveState({
      phases: {
        telosDiscovery: {
          data: { telos: 'test' },
          completedAt: new Date().toISOString()
        },
        hierarchyBuilding: {
          data: hierarchy,
          completedAt: new Date().toISOString()
        }
      },
      timestamp: new Date().toISOString(),
      lastPhase: 'hierarchyBuilding'
    }, TEST_DIR);

    const state = loadState(TEST_DIR);
    const loaded = getPhaseData(state, 'hierarchyBuilding');
    
    expect(loaded.L9.name).toBe('Telos-Guardian');
    expect(loaded.L8.name).toBe('Market-Analyst');
    expect(Object.keys(loaded)).toHaveLength(9);
  });

  it('should resume from saved tool discovery data', () => {
    const toolData = {
      projectScan: {
        languages: ['javascript'],
        frameworks: ['vitest'],
        tools: { linter: 'eslint', formatter: 'prettier' }
      },
      mcpServers: [],
      mcpCapabilities: [],
      levelTools: {
        L1: { tools: ['eslint'] },
        L2: { tools: ['vitest'] }
      },
      recommendations: []
    };

    saveState({
      phases: {
        telosDiscovery: { data: { telos: 'test' }, completedAt: new Date().toISOString() },
        hierarchyBuilding: { data: {}, completedAt: new Date().toISOString() },
        phase1: { completed: true, completedAt: new Date().toISOString() },
        phase2: { data: toolData, completedAt: new Date().toISOString() }
      },
      timestamp: new Date().toISOString(),
      lastPhase: 'phase2'
    }, TEST_DIR);

    const state = loadState(TEST_DIR);
    const loaded = getPhaseData(state, 'phase2');
    
    expect(loaded.projectScan.languages).toContain('javascript');
    expect(loaded.levelTools.L1.tools).toContain('eslint');
  });

  it('should track completion through all 5 phases', () => {
    saveState({
      phases: {
        telosDiscovery: { data: {}, completedAt: new Date().toISOString() },
        hierarchyBuilding: { data: {}, completedAt: new Date().toISOString() },
        phase1: { completed: true, completedAt: new Date().toISOString() },
        phase2: { data: {}, completedAt: new Date().toISOString() },
        phase3: { completed: true, completedAt: new Date().toISOString() },
        phase4: { completed: true, completedAt: new Date().toISOString() },
        phase5: { completed: true, completedAt: new Date().toISOString() }
      },
      timestamp: new Date().toISOString(),
      lastPhase: 'phase5'
    }, TEST_DIR);

    const state = loadState(TEST_DIR);
    
    // All phases should be complete
    expect(isPhaseComplete(state, 'telosDiscovery')).toBe(true);
    expect(isPhaseComplete(state, 'hierarchyBuilding')).toBe(true);
    expect(isPhaseComplete(state, 'phase1')).toBe(true);
    expect(isPhaseComplete(state, 'phase2')).toBe(true);
    expect(isPhaseComplete(state, 'phase3')).toBe(true);
    expect(isPhaseComplete(state, 'phase4')).toBe(true);
    expect(isPhaseComplete(state, 'phase5')).toBe(true);
  });

  it('should handle resume from mid-initialization failure', () => {
    // Simulate failure after phase 2
    saveState({
      phases: {
        telosDiscovery: { 
          data: { 
            telos: 'Enable marketplace',
            beneficiaries: 'Users',
            impact: 'Success',
            constraints: 'None'
          }, 
          completedAt: new Date().toISOString() 
        },
        hierarchyBuilding: { 
          data: { L9: { purpose: 'test' } }, 
          completedAt: new Date().toISOString() 
        },
        phase1: { completed: true, completedAt: new Date().toISOString() },
        phase2: { 
          data: { 
            projectScan: {},
            levelTools: {}
          }, 
          completedAt: new Date().toISOString() 
        }
      },
      timestamp: new Date().toISOString(),
      lastPhase: 'phase2'
    }, TEST_DIR);

    const state = loadState(TEST_DIR);
    
    // First two phases and phase1-2 should be complete
    expect(isPhaseComplete(state, 'telosDiscovery')).toBe(true);
    expect(isPhaseComplete(state, 'hierarchyBuilding')).toBe(true);
    expect(isPhaseComplete(state, 'phase1')).toBe(true);
    expect(isPhaseComplete(state, 'phase2')).toBe(true);
    
    // Remaining phases should be incomplete
    expect(isPhaseComplete(state, 'phase3')).toBe(false);
    expect(isPhaseComplete(state, 'phase4')).toBe(false);
    expect(isPhaseComplete(state, 'phase5')).toBe(false);
    
    // Data should be retrievable
    const telosData = getPhaseData(state, 'telosDiscovery');
    expect(telosData.telos).toBe('Enable marketplace');
  });

  it('should clear state file after successful completion', () => {
    saveState({
      phases: {
        telosDiscovery: { data: {}, completedAt: new Date().toISOString() }
      },
      timestamp: new Date().toISOString()
    }, TEST_DIR);

    expect(fs.existsSync(STATE_FILE)).toBe(true);

    clearState(TEST_DIR);
    
    expect(fs.existsSync(STATE_FILE)).toBe(false);
  });

  it('should preserve timestamp information', () => {
    const startTime = new Date().toISOString();
    
    saveState({
      phases: {
        telosDiscovery: { 
          data: { telos: 'test' }, 
          completedAt: startTime 
        }
      },
      timestamp: startTime,
      lastPhase: 'telosDiscovery'
    }, TEST_DIR);

    const state = loadState(TEST_DIR);
    
    expect(state.timestamp).toBe(startTime);
    expect(state.phases.telosDiscovery.completedAt).toBe(startTime);
    expect(state.lastPhase).toBe('telosDiscovery');
  });
});
