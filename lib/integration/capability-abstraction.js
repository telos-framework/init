const CAPABILITY_DEFINITIONS = {
  'static-analysis': {
    description: 'Analyze code for syntax errors, style violations, and potential bugs',
    tools: ['eslint', 'ruff', 'pylint', 'rubocop', 'golint'],
    fallback: 'manual-code-review'
  },
  'file-operations': {
    description: 'Read, write, and manipulate files',
    tools: ['filesystem-mcp', 'node-fs'],
    fallback: 'direct-file-access'
  },
  'unit-testing': {
    description: 'Execute and validate unit tests',
    tools: ['vitest', 'jest', 'pytest', 'mocha', 'jasmine'],
    fallback: 'manual-testing'
  },
  'component-testing': {
    description: 'Test UI components in isolation',
    tools: ['vitest', 'jest', 'testing-library', 'enzyme'],
    fallback: 'unit-testing'
  },
  'api-testing': {
    description: 'Test HTTP APIs and external integrations',
    tools: ['supertest', 'requests', 'axios', 'fetch-mcp'],
    fallback: 'manual-api-calls'
  },
  'journey-validation': {
    description: 'End-to-end user journey testing',
    tools: ['playwright', 'cypress', 'selenium'],
    fallback: 'manual-ux-testing'
  },
  'ux-testing': {
    description: 'User experience and accessibility testing',
    tools: ['playwright', 'browser-mcp', 'axe-core'],
    fallback: 'manual-ux-review'
  },
  'analytics': {
    description: 'Collect and analyze user behavior metrics',
    tools: ['analytics-mcp', 'posthog', 'mixpanel'],
    fallback: 'log-analysis'
  },
  'business-metrics': {
    description: 'Track KPIs and business performance',
    tools: ['analytics-mcp', 'database-mcp'],
    fallback: 'manual-reporting'
  },
  'version-control': {
    description: 'Interact with Git and version control systems',
    tools: ['github-mcp', 'git'],
    fallback: 'manual-git'
  },
  'browser-automation': {
    description: 'Automate browser interactions',
    tools: ['playwright', 'browser-mcp', 'chrome-mcp'],
    fallback: 'manual-browser-testing'
  },
  'database-access': {
    description: 'Query and manipulate databases',
    tools: ['postgres-mcp', 'mysql-mcp', 'database-mcp'],
    fallback: 'manual-db-queries'
  },
  'web-research': {
    description: 'Fetch and analyze web content',
    tools: ['fetch-mcp', 'brave-search-mcp', 'http-client'],
    fallback: 'manual-web-search'
  },
  'user-feedback': {
    description: 'Collect and process user feedback',
    tools: ['slack-mcp', 'email-mcp'],
    fallback: 'manual-feedback-review'
  }
};

class CapabilityManager {
  constructor(availableTools = []) {
    this.availableTools = availableTools;
    this.capabilityMap = this.buildCapabilityMap();
  }

  buildCapabilityMap() {
    const map = {};
    
    for (const [capability, definition] of Object.entries(CAPABILITY_DEFINITIONS)) {
      const matchingTools = this.availableTools.filter(tool => {
        const toolName = tool.name.toLowerCase();
        return definition.tools.some(defTool => toolName.includes(defTool.toLowerCase()));
      });

      map[capability] = {
        ...definition,
        available: matchingTools.length > 0,
        tools: matchingTools,
        fallback: definition.fallback
      };
    }

    return map;
  }

  hasCapability(capability) {
    return this.capabilityMap[capability]?.available || false;
  }

  getToolsForCapability(capability) {
    return this.capabilityMap[capability]?.tools || [];
  }

  getFallbackForCapability(capability) {
    return this.capabilityMap[capability]?.fallback || 'manual-implementation';
  }

  getCapabilitiesForLevel(level) {
    const levelCapabilities = {
      L1: ['static-analysis', 'file-operations'],
      L2: ['unit-testing', 'file-operations'],
      L3: ['component-testing', 'file-operations'],
      L4: ['api-testing', 'database-access', 'version-control'],
      L5: ['journey-validation', 'browser-automation'],
      L6: ['ux-testing', 'browser-automation'],
      L7: ['analytics', 'web-research', 'user-feedback'],
      L8: ['business-metrics', 'analytics'],
      L9: ['version-control', 'web-research']
    };

    return (levelCapabilities[level] || []).map(cap => ({
      capability: cap,
      available: this.hasCapability(cap),
      tools: this.getToolsForCapability(cap),
      fallback: this.getFallbackForCapability(cap)
    }));
  }

  getReport() {
    const report = {
      totalCapabilities: Object.keys(CAPABILITY_DEFINITIONS).length,
      availableCapabilities: 0,
      missingCapabilities: [],
      byLevel: {}
    };

    for (const [cap, data] of Object.entries(this.capabilityMap)) {
      if (data.available) {
        report.availableCapabilities++;
      } else {
        report.missingCapabilities.push({
          capability: cap,
          description: data.description,
          fallback: data.fallback
        });
      }
    }

    for (let i = 1; i <= 9; i++) {
      const level = `L${i}`;
      report.byLevel[level] = this.getCapabilitiesForLevel(level);
    }

    return report;
  }
}

module.exports = { CapabilityManager, CAPABILITY_DEFINITIONS };
