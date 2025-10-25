import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadState, saveState, updatePhase, clearState, isPhaseComplete } from '../lib/commands/init-state.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DIR = path.join(__dirname, 'tmp-error-recovery-test');

describe('Init Error Recovery', () => {
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

  it('should recover from error during hierarchy building', () => {
    // User completed telos discovery
    updatePhase('telosDiscovery', {
      data: {
        telos: 'Enable API marketplace',
        beneficiaries: 'API publishers',
        impact: 'APIs published',
        constraints: 'Open marketplace'
      }
    }, TEST_DIR);

    // User answered some hierarchy questions (L8-L6) then error occurred
    updatePhase('hierarchyBuilding', {
      data: {
        L9: { level: 'L9', purpose: 'From telos discovery' },
        L8: { level: 'L8', purpose: 'User answered this' },
        L7: { level: 'L7', purpose: 'User answered this' },
        L6: { level: 'L6', purpose: 'User answered this' }
        // L5-L1 not completed due to error
      }
    }, TEST_DIR);

    const state = loadState(TEST_DIR);
    
    // Telos discovery should be complete
    expect(isPhaseComplete(state, 'telosDiscovery')).toBe(true);
    
    // Partial hierarchy should be saved
    const hierarchy = state.phases.hierarchyBuilding.data;
    expect(hierarchy.L9).toBeDefined();
    expect(hierarchy.L8).toBeDefined();
    expect(hierarchy.L7).toBeDefined();
    expect(hierarchy.L6).toBeDefined();
  });

  it('should recover from error during file generation', () => {
    // User completed discovery and hierarchy
    updatePhase('telosDiscovery', { data: { telos: 'test' } }, TEST_DIR);
    updatePhase('hierarchyBuilding', { data: { L9: 'test' } }, TEST_DIR);
    
    // Phase 1 started but failed partway through
    // (e.g., TELOS.md created but L9 agent failed)
    updatePhase('phase1', { completed: false, partial: true }, TEST_DIR);

    const state = loadState(TEST_DIR);
    
    expect(isPhaseComplete(state, 'telosDiscovery')).toBe(true);
    expect(isPhaseComplete(state, 'hierarchyBuilding')).toBe(true);
    // Phase 1 exists but not marked complete
    expect(state.phases.phase1).toBeDefined();
  });

  it('should recover from error during tool discovery', () => {
    // All user input phases complete
    updatePhase('telosDiscovery', { data: { telos: 'test' } }, TEST_DIR);
    updatePhase('hierarchyBuilding', { data: {} }, TEST_DIR);
    updatePhase('phase1', { completed: true }, TEST_DIR);
    
    // Phase 2 started - project scan succeeded but MCP discovery failed
    updatePhase('phase2', {
      data: {
        projectScan: { languages: ['javascript'] },
        mcpServers: null, // Failed here
        levelTools: null
      }
    }, TEST_DIR);

    const state = loadState(TEST_DIR);
    
    // Should have saved project scan data
    expect(state.phases.phase2.data.projectScan).toBeDefined();
    expect(state.phases.phase2.data.projectScan.languages).toContain('javascript');
  });

  it('should recover from network/filesystem errors', () => {
    updatePhase('telosDiscovery', { data: { telos: 'test' } }, TEST_DIR);
    
    // Simulate filesystem becoming unavailable briefly
    const state = loadState(TEST_DIR);
    expect(state).toBeTruthy();
    
    // Should be able to continue
    updatePhase('hierarchyBuilding', { data: {} }, TEST_DIR);
    
    const updatedState = loadState(TEST_DIR);
    expect(isPhaseComplete(updatedState, 'telosDiscovery')).toBe(true);
    expect(isPhaseComplete(updatedState, 'hierarchyBuilding')).toBe(true);
  });

  it('should handle graceful degradation on partial data loss', () => {
    // Save initial state
    updatePhase('telosDiscovery', { data: { telos: 'test' } }, TEST_DIR);
    updatePhase('hierarchyBuilding', { data: { L9: 'test' } }, TEST_DIR);
    
    // Manually corrupt part of the state (simulating partial write)
    const statePath = path.join(TEST_DIR, '.telos-init-state.json');
    const currentState = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    
    // Remove one phase but keep the file valid
    delete currentState.phases.hierarchyBuilding;
    fs.writeFileSync(statePath, JSON.stringify(currentState), 'utf8');
    
    const state = loadState(TEST_DIR);
    
    // Should still load successfully
    expect(state).toBeTruthy();
    expect(isPhaseComplete(state, 'telosDiscovery')).toBe(true);
    expect(isPhaseComplete(state, 'hierarchyBuilding')).toBe(false);
  });

  it('should recover from interrupted writes', () => {
    updatePhase('telosDiscovery', { data: { telos: 'test' } }, TEST_DIR);
    
    // Simulate interrupted write by writing incomplete JSON
    const statePath = path.join(TEST_DIR, '.telos-init-state.json');
    
    // Write valid JSON first
    updatePhase('hierarchyBuilding', { data: { L9: 'test' } }, TEST_DIR);
    
    // Verify it loads correctly
    const state = loadState(TEST_DIR);
    expect(state).toBeTruthy();
    
    // Now corrupt it
    fs.writeFileSync(statePath, '{"phases": {', 'utf8');
    
    // Should return null instead of crashing
    const corruptedState = loadState(TEST_DIR);
    expect(corruptedState).toBe(null);
  });

  it('should allow manual state reset', () => {
    // User has partial state
    updatePhase('telosDiscovery', { data: { telos: 'old data' } }, TEST_DIR);
    updatePhase('hierarchyBuilding', { data: {} }, TEST_DIR);
    
    // User decides to start fresh
    clearState(TEST_DIR);
    
    const state = loadState(TEST_DIR);
    expect(state).toBe(null);
    
    // Can start new init
    updatePhase('telosDiscovery', { data: { telos: 'new data' } }, TEST_DIR);
    
    const newState = loadState(TEST_DIR);
    expect(newState.phases.telosDiscovery.data.telos).toBe('new data');
  });

  it('should preserve large user inputs without truncation', () => {
    const largeTelos = 'A'.repeat(10000); // 10KB of text
    const largeConstraints = 'B'.repeat(5000); // 5KB of text
    
    updatePhase('telosDiscovery', {
      data: {
        telos: largeTelos,
        beneficiaries: 'test',
        impact: 'test',
        constraints: largeConstraints
      }
    }, TEST_DIR);

    const state = loadState(TEST_DIR);
    
    expect(state.phases.telosDiscovery.data.telos).toHaveLength(10000);
    expect(state.phases.telosDiscovery.data.constraints).toHaveLength(5000);
  });

  it('should handle Unicode and special characters in user input', () => {
    const unicodeInput = {
      telos: 'Enable marketplace with émojis 🚀 and special chars: <>&"\'',
      beneficiaries: '中文 日本語 한글',
      impact: 'Metrics: €100K, £50K, ¥1M',
      constraints: 'Follow RFC-3986 & ISO-8601'
    };

    updatePhase('telosDiscovery', { data: unicodeInput }, TEST_DIR);

    const state = loadState(TEST_DIR);
    const loaded = state.phases.telosDiscovery.data;
    
    expect(loaded.telos).toBe(unicodeInput.telos);
    expect(loaded.beneficiaries).toBe(unicodeInput.beneficiaries);
    expect(loaded.impact).toBe(unicodeInput.impact);
    expect(loaded.constraints).toBe(unicodeInput.constraints);
  });

  it('should handle multi-line user inputs', () => {
    const multilineInput = {
      telos: `Enable API marketplace with:
- Easy monetization
- Discovery features
- Decentralized hosting`,
      beneficiaries: `1. API publishers
2. API consumers
3. Platform hosts`,
      impact: `Success metrics:
- 1000+ APIs published
- 10K+ daily users`,
      constraints: 'Open marketplace\nNo censorship\nUser privacy'
    };

    updatePhase('telosDiscovery', { data: multilineInput }, TEST_DIR);

    const state = loadState(TEST_DIR);
    const loaded = state.phases.telosDiscovery.data;
    
    expect(loaded.telos).toContain('\n');
    expect(loaded.beneficiaries).toContain('1.');
    expect(loaded.impact).toContain('- ');
  });
});
