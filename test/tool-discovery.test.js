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

    it('should map unit test frameworks to L2 and L3', () => {
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

      expect(levelTools.L2.tools.length).toBeGreaterThan(0);
      expect(levelTools.L3.tools.length).toBeGreaterThan(0);
    });

    it('should map E2E frameworks to L5', () => {
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

      expect(levelTools.L5.tools).toHaveLength(2);
      expect(levelTools.L5.tools[0].category).toBe('e2e-testing');
    });

    it('should map UI frameworks to L3 and L6', () => {
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

      expect(levelTools.L3.tools.length).toBeGreaterThan(0);
      expect(levelTools.L6.tools.length).toBeGreaterThan(0);
    });

    it('should map MCP capabilities to appropriate levels', () => {
      const projectScan = {
        languages: [],
        frameworks: [],
        testFrameworks: [],
        linters: [],
        buildTools: [],
        packageManagers: []
      };
      const mcpCapabilities = {
        L4: [{ server: 'github-mcp', capability: 'ci-cd-integration' }],
        L7: [{ server: 'analytics-mcp', capability: 'analytics' }]
      };

      const levelTools = mapToolsToLevels(projectScan, mcpCapabilities);

      expect(levelTools.L4.tools).toHaveLength(1);
      expect(levelTools.L7.tools).toHaveLength(1);
    });
  });

  describe('getToolRecommendations', () => {
    it('should recommend linters when none detected', () => {
      const levelTools = {
        L1: { tools: [] },
        L2: { tools: [{ name: 'Vitest' }] },
        L3: { tools: [] },
        L4: { tools: [] },
        L5: { tools: [] },
        L6: { tools: [] },
        L7: { tools: [] },
        L8: { tools: [] },
        L9: { tools: [] }
      };

      const recommendations = getToolRecommendations(levelTools);

      expect(recommendations.some(r => r.level === 'L1')).toBe(true);
      expect(recommendations.find(r => r.level === 'L1').priority).toBe('medium');
    });

    it('should recommend test framework when none detected', () => {
      const levelTools = {
        L1: { tools: [{ name: 'ESLint' }] },
        L2: { tools: [] },
        L3: { tools: [] },
        L4: { tools: [] },
        L5: { tools: [] },
        L6: { tools: [] },
        L7: { tools: [] },
        L8: { tools: [] },
        L9: { tools: [] }
      };

      const recommendations = getToolRecommendations(levelTools);

      expect(recommendations.some(r => r.level === 'L2')).toBe(true);
      expect(recommendations.find(r => r.level === 'L2').priority).toBe('high');
    });

    it('should return empty array when all tools present', () => {
      const levelTools = {
        L1: { tools: [{ name: 'ESLint' }] },
        L2: { tools: [{ name: 'Vitest' }] },
        L3: { tools: [] },
        L4: { tools: [] },
        L5: { tools: [{ name: 'Playwright' }] },
        L6: { tools: [] },
        L7: { tools: [{ name: 'Analytics' }] },
        L8: { tools: [] },
        L9: { tools: [] }
      };

      const recommendations = getToolRecommendations(levelTools);

      expect(recommendations).toHaveLength(0);
    });
  });
});
