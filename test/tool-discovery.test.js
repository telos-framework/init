import { describe, it, expect } from 'vitest';
import { mapToolsToLevels, getToolRecommendations } from '../lib/discovery/tool-mapper.js';

describe('Tool Discovery', () => {
  describe('mapToolsToLevels', () => {
    it('should map linters to L1', () => {
      const projectScan = {
        languages: ['JavaScript'],
        frameworks: [],
        testFrameworks: [],
        linters: ['ESLint', 'Prettier'],
        buildTools: [],
        packageManagers: ['npm']
      };
      const mcpCapabilities = {};

      const levelTools = mapToolsToLevels(projectScan, mcpCapabilities);

      expect(levelTools.L1.tools).toHaveLength(2);
      expect(levelTools.L1.tools[0].name).toBe('ESLint');
      expect(levelTools.L1.tools[0].category).toBe('linter');
    });

    it('should map unit test frameworks to L1 (Function)', () => {
      const projectScan = {
        languages: ['JavaScript'],
        frameworks: [],
        testFrameworks: ['Vitest', 'Jest'],
        linters: [],
        buildTools: [],
        packageManagers: ['npm']
      };
      const mcpCapabilities = {};

      const levelTools = mapToolsToLevels(projectScan, mcpCapabilities);

      // Unit tests go to L1 (Function) in 4-level system
      expect(levelTools.L1.tools.length).toBeGreaterThan(0);
    });

    it('should map E2E frameworks to L3 (Experience)', () => {
      const projectScan = {
        languages: ['JavaScript'],
        frameworks: [],
        testFrameworks: ['Playwright', 'Cypress'],
        linters: [],
        buildTools: [],
        packageManagers: ['npm']
      };
      const mcpCapabilities = {};

      const levelTools = mapToolsToLevels(projectScan, mcpCapabilities);

      // E2E tests go to L3 (Experience) in 4-level system
      expect(levelTools.L3.tools).toHaveLength(2);
      expect(levelTools.L3.tools[0].category).toBe('e2e-testing');
    });

    it('should map UI frameworks to L2 (Contract) and L3 (Experience)', () => {
      const projectScan = {
        languages: ['JavaScript'],
        frameworks: ['React', 'Vue'],
        testFrameworks: [],
        linters: [],
        buildTools: [],
        packageManagers: ['npm']
      };
      const mcpCapabilities = {};

      const levelTools = mapToolsToLevels(projectScan, mcpCapabilities);

      // UI frameworks go to L2 (Contract) and L3 (Experience)
      expect(levelTools.L2.tools.length).toBeGreaterThan(0);
      expect(levelTools.L3.tools.length).toBeGreaterThan(0);
    });

    it('should map MCP capabilities to appropriate levels (L1-L4 only)', () => {
      const projectScan = {
        languages: [],
        frameworks: [],
        testFrameworks: [],
        linters: [],
        buildTools: [],
        packageManagers: []
      };
      const mcpCapabilities = {
        L2: [{ server: 'github-mcp', capability: 'version-control' }],
        L4: [{ server: 'analytics-mcp', capability: 'analytics' }]
      };

      const levelTools = mapToolsToLevels(projectScan, mcpCapabilities);

      expect(levelTools.L2.tools).toHaveLength(1);
      expect(levelTools.L4.tools).toHaveLength(1);
    });
  });

  describe('getToolRecommendations', () => {
    it('should recommend linters/tests when none detected for L1', () => {
      const levelTools = {
        L1: { tools: [] },
        L2: { tools: [{ name: 'Express' }] },
        L3: { tools: [] },
        L4: { tools: [] }
      };

      const recommendations = getToolRecommendations(levelTools);

      expect(recommendations.some(r => r.level === 'L1')).toBe(true);
      expect(recommendations.find(r => r.level === 'L1').priority).toBe('high');
    });

    it('should recommend frameworks when none detected for L2', () => {
      const levelTools = {
        L1: { tools: [{ name: 'ESLint' }, { name: 'Vitest' }] },
        L2: { tools: [] },
        L3: { tools: [] },
        L4: { tools: [] }
      };

      const recommendations = getToolRecommendations(levelTools);

      expect(recommendations.some(r => r.level === 'L2')).toBe(true);
    });

    it('should return empty array when all key tools present', () => {
      const levelTools = {
        L1: { tools: [{ name: 'ESLint' }, { name: 'Vitest' }] },
        L2: { tools: [{ name: 'Express' }] },
        L3: { tools: [{ name: 'Playwright' }] },
        L4: { tools: [] }
      };

      const recommendations = getToolRecommendations(levelTools);

      expect(recommendations).toHaveLength(0);
    });
  });
});
