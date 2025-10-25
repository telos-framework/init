const fs = require('fs').promises;
const path = require('path');

async function consolidateAgents(agentsDir, outputPath) {
  let content = `# Telos Multi-Agent Collective

**Generated**: ${new Date().toISOString()}

This document consolidates all 9 agent definitions for the Telos framework. Each agent operates at a specific ontological level in Boulding's hierarchy.

---

`;

  const agentFiles = [
    'l9-telos-guardian.md',
    'l8-market-analyst.md',
    'l7-insight-synthesizer.md',
    'l6-ux-simulator.md',
    'l5-journey-validator.md',
    'l4-integration-contractor.md',
    'l3-component-architect.md',
    'l2-function-author.md',
    'l1-syntax-linter.md'
  ];

  for (const filename of agentFiles) {
    const filePath = path.join(agentsDir, filename);
    
    try {
      const agentContent = await fs.readFile(filePath, 'utf8');
      content += agentContent + '\n\n---\n\n';
    } catch (error) {
      content += `# ${filename}\n\n*Agent definition not yet generated*\n\n---\n\n`;
    }
  }

  content += `## Using the Agents

These agents work together as an orchestrated collective managed by Logos. You typically won't invoke individual agents directly—instead, Logos routes work to the appropriate level based on the task.

### Agent Hierarchy

\`\`\`
L9 (Strategic) ← Telos-Guardian
L8 (Business)  ← Market-Analyst
L7 (Insight)   ← Insight-Synthesizer
L6 (UX)        ← UX-Simulator
L5 (Journey)   ← Journey-Validator
L4 (API)       ← Integration-Contractor
L3 (Component) ← Component-Architect
L2 (Function)  ← Function-Author
L1 (Syntax)    ← Syntax-Linter
\`\`\`

### Workflow

1. **Request** enters at L9 (Telos validation)
2. **Decomposition** cascades L9→L1
3. **Implementation** occurs at appropriate levels
4. **Validation** cascades L1→L9
5. **Approval** from L9 Telos-Guardian

See LOGOS.md for orchestration details.
`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  
  return outputPath;
}

module.exports = { consolidateAgents };
