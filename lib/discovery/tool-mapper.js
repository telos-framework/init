function mapToolsToLevels(projectScan, mcpCapabilities) {
  const levelTools = {
    L1: {
      level: 'L1',
      name: 'Syntax-Linter',
      tools: []
    },
    L2: {
      level: 'L2',
      name: 'Function-Author',
      tools: []
    },
    L3: {
      level: 'L3',
      name: 'Component-Architect',
      tools: []
    },
    L4: {
      level: 'L4',
      name: 'Integration-Contractor',
      tools: []
    },
    L5: {
      level: 'L5',
      name: 'Journey-Validator',
      tools: []
    },
    L6: {
      level: 'L6',
      name: 'UX-Simulator',
      tools: []
    },
    L7: {
      level: 'L7',
      name: 'Insight-Synthesizer',
      tools: []
    },
    L8: {
      level: 'L8',
      name: 'Market-Analyst',
      tools: []
    },
    L9: {
      level: 'L9',
      name: 'Telos-Guardian',
      tools: []
    }
  };

  for (const linter of projectScan.linters || []) {
    levelTools.L1.tools.push({
      name: linter,
      category: 'linter',
      capability: 'static-analysis'
    });
  }

  for (const testFw of projectScan.testFrameworks || []) {
    if (testFw === 'Playwright' || testFw === 'Cypress') {
      levelTools.L5.tools.push({
        name: testFw,
        category: 'e2e-testing',
        capability: 'journey-validation'
      });
    } else {
      levelTools.L2.tools.push({
        name: testFw,
        category: 'unit-testing',
        capability: 'function-testing'
      });
      levelTools.L3.tools.push({
        name: testFw,
        category: 'component-testing',
        capability: 'component-validation'
      });
    }
  }

  for (const framework of projectScan.frameworks || []) {
    if (framework.includes('React') || framework.includes('Vue') || framework.includes('Svelte') || framework.includes('Angular')) {
      levelTools.L3.tools.push({
        name: framework,
        category: 'ui-framework',
        capability: 'component-building'
      });
      levelTools.L6.tools.push({
        name: framework,
        category: 'ux-framework',
        capability: 'user-interface'
      });
    } else {
      levelTools.L4.tools.push({
        name: framework,
        category: 'backend-framework',
        capability: 'api-implementation'
      });
    }
  }

  for (const [level, caps] of Object.entries(mcpCapabilities)) {
    for (const cap of caps) {
      levelTools[level].tools.push({
        name: cap.server,
        category: 'mcp-server',
        capability: cap.capability
      });
    }
  }

  return levelTools;
}

function getToolRecommendations(levelTools) {
  const recommendations = [];

  if (levelTools.L1.tools.length === 0) {
    recommendations.push({
      level: 'L1',
      message: 'No linters detected. Consider adding ESLint or Prettier.',
      priority: 'medium'
    });
  }

  if (levelTools.L2.tools.length === 0) {
    recommendations.push({
      level: 'L2',
      message: 'No test framework detected. Consider adding Vitest or Jest.',
      priority: 'high'
    });
  }

  if (levelTools.L5.tools.length === 0) {
    recommendations.push({
      level: 'L5',
      message: 'No E2E testing framework detected. Consider adding Playwright.',
      priority: 'medium'
    });
  }

  if (levelTools.L7.tools.length === 0) {
    recommendations.push({
      level: 'L7',
      message: 'No analytics tools detected. Consider user feedback mechanisms.',
      priority: 'low'
    });
  }

  return recommendations;
}

module.exports = { mapToolsToLevels, getToolRecommendations };
