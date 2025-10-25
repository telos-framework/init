const fs = require('fs').promises;
const path = require('path');

async function generateToolsMd(levelTools, projectScan, mcpServers, recommendations, outputPath) {
  let content = `# Discovered Tools & Capabilities

**Generated**: ${new Date().toISOString()}

## Project Context

- **Languages**: ${projectScan.languages.join(', ') || 'None detected'}
- **Frameworks**: ${projectScan.frameworks.join(', ') || 'None detected'}
- **Package Managers**: ${projectScan.packageManagers.join(', ') || 'None detected'}

## MCP Servers

${mcpServers.length > 0 ? mcpServers.map(s => `- **${s.name}**: \`${s.command}\``).join('\n') : 'No MCP servers detected'}

## Tools by Agent Level

`;

  for (const [level, data] of Object.entries(levelTools)) {
    content += `### ${level}: ${data.name}\n\n`;
    
    if (data.tools.length > 0) {
      content += '**Available Tools**:\n\n';
      for (const tool of data.tools) {
        content += `- **${tool.name}** (${tool.category}): ${tool.capability}\n`;
      }
      content += '\n';
    } else {
      content += '*No tools detected for this level*\n\n';
    }
  }

  if (recommendations.length > 0) {
    content += `## Recommendations\n\n`;
    for (const rec of recommendations) {
      content += `- **${rec.level}** [${rec.priority}]: ${rec.message}\n`;
    }
    content += '\n';
  }

  content += `## Capability Matrix

| Level | Agent | Detected Capabilities |
|-------|-------|----------------------|
`;

  for (const [level, data] of Object.entries(levelTools)) {
    const caps = data.tools.map(t => t.capability).join(', ') || 'None';
    content += `| ${level} | ${data.name} | ${caps} |\n`;
  }

  content += `
## Usage Instructions by Agent

### L1: Syntax-Linter

**Tools**: ${levelTools.L1.tools.map(t => t.name).join(', ') || 'None'}

**Workflow**:
1. Run linter before committing code
2. Fix syntax and style violations automatically when possible
3. Report unfixable issues for manual review

**Example Commands**:
- \`eslint --fix .\` - Auto-fix JavaScript/TypeScript issues
- \`prettier --write .\` - Format code
- \`ruff check .\` - Lint Python code

### L2: Function-Author

**Tools**: ${levelTools.L2.tools.map(t => t.name).join(', ') || 'None'}

**Workflow**:
1. Write tests first (TDD)
2. Implement function to pass tests
3. Verify with unit test suite
4. Refactor while keeping tests green

**Example Commands**:
- \`vitest run\` - Run unit tests
- \`jest --coverage\` - Run tests with coverage
- \`npm test\` - Run test script

### L3: Component-Architect

**Tools**: ${levelTools.L3.tools.map(t => t.name).join(', ') || 'None'}

**Workflow**:
1. Design component interface
2. Write component tests
3. Implement component
4. Verify integration with parent components

**Example Commands**:
- \`vitest --ui\` - Interactive test UI
- \`jest --testPathPattern=components\` - Test components only

### L4: Integration-Contractor

**Tools**: ${levelTools.L4.tools.map(t => t.name).join(', ') || 'None'}

**Workflow**:
1. Define API contracts
2. Write integration tests
3. Implement API endpoints
4. Verify contracts hold

**Example Commands**:
- \`curl -X POST http://localhost:3000/api/test\` - Manual API test
- Check integration test suite

### L5: Journey-Validator

**Tools**: ${levelTools.L5.tools.map(t => t.name).join(', ') || 'None'}

**Workflow**:
1. Define user journeys
2. Write E2E tests for critical paths
3. Run tests in multiple browsers
4. Verify complete user flows

**Example Commands**:
- \`playwright test\` - Run E2E tests
- \`cypress run\` - Run Cypress tests
- \`playwright test --ui\` - Debug tests interactively

### L6: UX-Simulator

**Tools**: ${levelTools.L6.tools.map(t => t.name).join(', ') || 'None'}

**Workflow**:
1. Create user personas
2. Simulate persona interactions
3. Test accessibility
4. Verify UX principles

**Example Commands**:
- Use browser MCP for automation
- Manual testing with personas

### L7: Insight-Synthesizer

**Tools**: ${levelTools.L7.tools.map(t => t.name).join(', ') || 'None'}

**Workflow**:
1. Collect analytics data
2. Gather user feedback
3. Synthesize insights
4. Report findings to higher levels

**Example Commands**:
- Query analytics MCP servers
- Review user feedback channels

### L8: Market-Analyst

**Tools**: ${levelTools.L8.tools.map(t => t.name).join(', ') || 'None'}

**Workflow**:
1. Define business KPIs
2. Track metrics
3. Analyze performance
4. Report to Telos-Guardian

**Example Commands**:
- Query business metrics databases
- Generate reports

### L9: Telos-Guardian

**Tools**: ${levelTools.L9.tools.map(t => t.name).join(', ') || 'None'}

**Workflow**:
1. Review alignment with Telos
2. Validate strategic decisions
3. Guide overall direction
4. Maintain purpose coherence

**Example Commands**:
- Review project documentation
- Validate specs against Telos

## Re-Discovery

To update this file after adding tools or MCP servers, run:

\`\`\`bash
telos rediscover
\`\`\`

This will re-scan your project and update agent configurations accordingly.
`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  
  return outputPath;
}

module.exports = { generateToolsMd };
