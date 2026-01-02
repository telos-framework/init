function mapToolsToLevels(projectScan, mcpCapabilities) {
  const levelTools = {
    L1: {
      level: 'L1',
      name: 'Function',
      tools: []
    },
    L2: {
      level: 'L2',
      name: 'Contract',
      tools: []
    },
    L3: {
      level: 'L3',
      name: 'Experience',
      tools: []
    },
    L4: {
      level: 'L4',
      name: 'Purpose',
      tools: []
    }
  };

  // L1 (Function) - Linters, formatters, unit test frameworks
  for (const linter of projectScan.linters || []) {
    levelTools.L1.tools.push({
      name: linter,
      category: 'linter',
      capability: 'static-analysis'
    });
  }

  for (const testFw of projectScan.testFrameworks || []) {
    if (testFw === 'Playwright' || testFw === 'Cypress') {
      // E2E testing goes to L3 (Experience)
      levelTools.L3.tools.push({
        name: testFw,
        category: 'e2e-testing',
        capability: 'journey-validation'
      });
    } else {
      // Unit testing goes to L1 (Function)
      levelTools.L1.tools.push({
        name: testFw,
        category: 'unit-testing',
        capability: 'function-testing'
      });
    }
  }

  // L2 (Contract) - API frameworks, component frameworks
  for (const framework of projectScan.frameworks || []) {
    if (framework.includes('React') || framework.includes('Vue') || framework.includes('Svelte') || framework.includes('Angular')) {
      levelTools.L2.tools.push({
        name: framework,
        category: 'ui-framework',
        capability: 'component-building'
      });
      levelTools.L3.tools.push({
        name: framework,
        category: 'ux-framework',
        capability: 'user-interface'
      });
    } else {
      levelTools.L2.tools.push({
        name: framework,
        category: 'backend-framework',
        capability: 'api-implementation'
      });
    }
  }

  // Map MCP capabilities to levels
  for (const [level, caps] of Object.entries(mcpCapabilities)) {
    // Only process L1-L4
    if (['L1', 'L2', 'L3', 'L4'].includes(level)) {
      for (const cap of caps) {
        levelTools[level].tools.push({
          name: cap.server,
          category: 'mcp-server',
          capability: cap.capability
        });
      }
    }
  }

  return levelTools;
}

function getToolRecommendations(levelTools) {
  const recommendations = [];

  if (levelTools.L1.tools.length === 0) {
    recommendations.push({
      level: 'L1',
      message: 'No linters or test frameworks detected. Consider adding ESLint and Vitest.',
      priority: 'high'
    });
  }

  if (levelTools.L2.tools.length === 0) {
    recommendations.push({
      level: 'L2',
      message: 'No API or component frameworks detected.',
      priority: 'medium'
    });
  }

  if (levelTools.L3.tools.length === 0) {
    recommendations.push({
      level: 'L3',
      message: 'No E2E testing framework detected. Consider adding Playwright.',
      priority: 'medium'
    });
  }

  return recommendations;
}

module.exports = { mapToolsToLevels, getToolRecommendations };
