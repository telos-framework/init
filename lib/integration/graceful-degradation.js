const DEGRADATION_STRATEGIES = {
  'manual-code-review': {
    type: 'manual',
    instructions: 'Perform manual code review focusing on syntax, style, and common patterns',
    guidance: 'Check for: indentation consistency, naming conventions, error handling, edge cases'
  },
  'direct-file-access': {
    type: 'native',
    instructions: 'Use built-in filesystem APIs (fs.readFile, fs.writeFile)',
    guidance: 'Ensure proper error handling and encoding specifications'
  },
  'manual-testing': {
    type: 'manual',
    instructions: 'Manually verify function behavior with sample inputs',
    guidance: 'Test edge cases, error conditions, and expected outputs'
  },
  'manual-api-calls': {
    type: 'manual',
    instructions: 'Use curl or similar HTTP clients to test API endpoints',
    guidance: 'Verify status codes, response bodies, and error handling'
  },
  'manual-ux-testing': {
    type: 'manual',
    instructions: 'Manually test user journeys in browser',
    guidance: 'Follow user personas through critical flows, noting UX issues'
  },
  'manual-ux-review': {
    type: 'manual',
    instructions: 'Review UI implementation against design principles',
    guidance: 'Check accessibility, responsiveness, and usability heuristics'
  },
  'log-analysis': {
    type: 'manual',
    instructions: 'Analyze application logs for usage patterns',
    guidance: 'Look for error rates, performance bottlenecks, user behavior patterns'
  },
  'manual-reporting': {
    type: 'manual',
    instructions: 'Create manual reports from available data sources',
    guidance: 'Collect metrics from logs, databases, and manual observations'
  },
  'manual-git': {
    type: 'cli',
    instructions: 'Use git CLI commands directly',
    guidance: 'Standard git workflow: status, add, commit, push, pull'
  },
  'manual-browser-testing': {
    type: 'manual',
    instructions: 'Manually interact with application in browser',
    guidance: 'Test functionality, check console for errors, verify behavior'
  },
  'manual-db-queries': {
    type: 'cli',
    instructions: 'Use database CLI tools (psql, mysql) directly',
    guidance: 'Connect to database and execute queries manually'
  },
  'manual-web-search': {
    type: 'manual',
    instructions: 'Manually search web using browser',
    guidance: 'Use search engines and visit relevant documentation sites'
  },
  'manual-feedback-review': {
    type: 'manual',
    instructions: 'Manually review feedback from support channels',
    guidance: 'Check email, Slack, support tickets for user feedback'
  },
  'manual-implementation': {
    type: 'manual',
    instructions: 'Implement manually without automated tools',
    guidance: 'Follow best practices and manual verification procedures'
  }
};

function getDegradationStrategy(capability, availableCapabilities) {
  if (!availableCapabilities[capability] || !availableCapabilities[capability].available) {
    const fallback = availableCapabilities[capability]?.fallback || 'manual-implementation';
    return DEGRADATION_STRATEGIES[fallback] || DEGRADATION_STRATEGIES['manual-implementation'];
  }
  
  return null;
}

function generateDegradationGuidance(level, capabilities) {
  const guidance = {
    level,
    missingCapabilities: [],
    workflowAdjustments: [],
    recommendations: []
  };

  for (const cap of capabilities) {
    if (!cap.available) {
      const strategy = DEGRADATION_STRATEGIES[cap.fallback] || DEGRADATION_STRATEGIES['manual-implementation'];
      
      guidance.missingCapabilities.push({
        capability: cap.capability,
        fallback: cap.fallback,
        strategy: strategy.type,
        instructions: strategy.instructions,
        guidance: strategy.guidance
      });

      if (strategy.type === 'manual') {
        guidance.workflowAdjustments.push(
          `For ${cap.capability}: ${strategy.instructions}`
        );
      }

      guidance.recommendations.push(
        `Consider adding tools for ${cap.capability} to improve automation`
      );
    }
  }

  return guidance;
}

function createAgentInstructions(level, capabilities) {
  const missing = capabilities.filter(cap => !cap.available);
  
  if (missing.length === 0) {
    return {
      hasAllTools: true,
      message: 'All required tools are available',
      instructions: []
    };
  }

  const instructions = missing.map(cap => {
    const strategy = DEGRADATION_STRATEGIES[cap.fallback] || DEGRADATION_STRATEGIES['manual-implementation'];
    return {
      capability: cap.capability,
      type: strategy.type,
      action: strategy.instructions,
      guidance: strategy.guidance
    };
  });

  return {
    hasAllTools: false,
    message: `${missing.length} tool(s) missing for ${level}`,
    instructions,
    summary: `You will need to use ${instructions.filter(i => i.type === 'manual').length} manual workflow(s)`
  };
}

module.exports = {
  DEGRADATION_STRATEGIES,
  getDegradationStrategy,
  generateDegradationGuidance,
  createAgentInstructions
};
