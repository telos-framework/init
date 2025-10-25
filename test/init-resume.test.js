import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadState, saveState, clearState, updatePhase } from '../lib/commands/init-state.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DIR = path.join(__dirname, 'tmp-init-resume-test');

describe('Init Resume Behavior', () => {
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

  it('should not prompt for telos data if already saved', () => {
    const telosData = {
      telos: 'Enable API marketplace',
      beneficiaries: 'API publishers',
      impact: 'APIs published',
      constraints: 'Open marketplace'
    };

    // Simulate saved state from previous failed init
    updatePhase('telosDiscovery', { data: telosData }, TEST_DIR);

    const state = loadState(TEST_DIR);
    expect(state.phases.telosDiscovery.data).toEqual(telosData);
  });

  it('should not prompt for hierarchy if already saved', () => {
    const hierarchy = {
      L9: { level: 'L9', purpose: 'Ultimate purpose' },
      L8: { level: 'L8', purpose: 'Business value' }
    };

    updatePhase('hierarchyBuilding', { data: hierarchy }, TEST_DIR);

    const state = loadState(TEST_DIR);
    expect(state.phases.hierarchyBuilding.data).toEqual(hierarchy);
  });

  it('should skip completed phases when resuming', () => {
    // Simulate init that completed phases 1-3
    updatePhase('telosDiscovery', { data: { telos: 'test' } }, TEST_DIR);
    updatePhase('hierarchyBuilding', { data: {} }, TEST_DIR);
    updatePhase('phase1', { completed: true }, TEST_DIR);
    updatePhase('phase2', { data: {} }, TEST_DIR);
    updatePhase('phase3', { completed: true }, TEST_DIR);

    const state = loadState(TEST_DIR);
    
    // Verify phases 1-3 are marked complete
    expect(state.phases.telosDiscovery).toBeDefined();
    expect(state.phases.hierarchyBuilding).toBeDefined();
    expect(state.phases.phase1.completed).toBe(true);
    expect(state.phases.phase2).toBeDefined();
    expect(state.phases.phase3.completed).toBe(true);
    
    // Phase 4 should not exist (not reached yet)
    expect(state.phases.phase4).toBeUndefined();
  });

  it('should preserve user input across multiple failed attempts', () => {
    const userInputs = {
      telos: 'Very long and detailed purpose that user spent time writing',
      beneficiaries: 'Multiple stakeholder groups with detailed descriptions',
      impact: 'Complex success metrics with specific KPIs',
      constraints: 'Detailed ethical and technical constraints'
    };

    // First attempt - save telos discovery
    updatePhase('telosDiscovery', { data: userInputs }, TEST_DIR);
    
    // Simulate failure and reload
    const state1 = loadState(TEST_DIR);
    expect(state1.phases.telosDiscovery.data.telos).toBe(userInputs.telos);
    
    // Add more progress
    updatePhase('hierarchyBuilding', { data: { L9: 'test' } }, TEST_DIR);
    
    // Another failure and reload
    const state2 = loadState(TEST_DIR);
    expect(state2.phases.telosDiscovery.data.telos).toBe(userInputs.telos);
    expect(state2.phases.hierarchyBuilding.data.L9).toBe('test');
  });

  it('should track lastPhase correctly', () => {
    updatePhase('telosDiscovery', { data: {} }, TEST_DIR);
    let state = loadState(TEST_DIR);
    expect(state.lastPhase).toBe('telosDiscovery');

    updatePhase('hierarchyBuilding', { data: {} }, TEST_DIR);
    state = loadState(TEST_DIR);
    expect(state.lastPhase).toBe('hierarchyBuilding');

    updatePhase('phase1', { completed: true }, TEST_DIR);
    state = loadState(TEST_DIR);
    expect(state.lastPhase).toBe('phase1');
  });

  it('should include completion timestamps', () => {
    const beforeTime = new Date();
    
    updatePhase('telosDiscovery', { data: { telos: 'test' } }, TEST_DIR);
    
    const state = loadState(TEST_DIR);
    const completedAt = new Date(state.phases.telosDiscovery.completedAt);
    
    expect(completedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    expect(state.lastUpdated).toBeDefined();
  });

  it('should handle quick mode state persistence', () => {
    // In quick mode, hierarchy is auto-generated
    const quickHierarchy = {
      L9: { level: 'L9', name: 'Telos-Guardian' },
      L8: { level: 'L8', name: 'Market-Analyst' },
      L7: { level: 'L7', name: 'Insight-Synthesizer' },
      L6: { level: 'L6', name: 'UX-Simulator' },
      L5: { level: 'L5', name: 'Journey-Validator' },
      L4: { level: 'L4', name: 'Integration-Contractor' },
      L3: { level: 'L3', name: 'Component-Architect' },
      L2: { level: 'L2', name: 'Function-Author' },
      L1: { level: 'L1', name: 'Syntax-Linter' }
    };

    updatePhase('hierarchyBuilding', { data: quickHierarchy }, TEST_DIR);
    
    const state = loadState(TEST_DIR);
    const hierarchy = state.phases.hierarchyBuilding.data;
    
    expect(Object.keys(hierarchy)).toHaveLength(9);
    expect(hierarchy.L9.name).toBe('Telos-Guardian');
    expect(hierarchy.L1.name).toBe('Syntax-Linter');
  });

  it('should handle complex tool discovery data', () => {
    const toolData = {
      projectScan: {
        languages: ['javascript', 'typescript'],
        frameworks: ['vitest', 'react'],
        tools: {
          linter: 'eslint',
          formatter: 'prettier',
          bundler: 'vite'
        },
        packageManager: 'npm'
      },
      mcpServers: [
        { name: 'server1', capabilities: ['test'] }
      ],
      levelTools: {
        L1: { tools: ['eslint', 'prettier'] },
        L2: { tools: ['vitest'] }
      }
    };

    updatePhase('phase2', { data: toolData }, TEST_DIR);
    
    const state = loadState(TEST_DIR);
    const loaded = state.phases.phase2.data;
    
    expect(loaded.projectScan.languages).toContain('typescript');
    expect(loaded.projectScan.tools.bundler).toBe('vite');
    expect(loaded.mcpServers).toHaveLength(1);
  });
});
