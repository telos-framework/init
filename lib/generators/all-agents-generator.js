const fs = require('fs').promises;
const path = require('path');

async function generateAllAgents(hierarchy, levelTools, outputDir) {
  const agents = [];

  agents.push(await generateAgent('L3', hierarchy.L3, levelTools.L3.tools, outputDir, {
    role: 'Component Architect',
    focus: 'Component design and composition'
  }));

  agents.push(await generateAgent('L4', hierarchy.L4, levelTools.L4.tools, outputDir, {
    role: 'Integration Contractor',
    focus: 'API contracts and service boundaries'
  }));

  agents.push(await generateAgent('L5', hierarchy.L5, levelTools.L5.tools, outputDir, {
    role: 'Journey Validator',
    focus: 'End-to-end workflows and integration testing'
  }));

  agents.push(await generateAgent('L6', hierarchy.L6, levelTools.L6.tools, outputDir, {
    role: 'UX Simulator',
    focus: 'User experience and accessibility'
  }));

  agents.push(await generateAgent('L7', hierarchy.L7, levelTools.L7.tools, outputDir, {
    role: 'Insight Synthesizer',
    focus: 'User behavior and feedback analysis'
  }));

  agents.push(await generateAgent('L8', hierarchy.L8, levelTools.L8.tools, outputDir, {
    role: 'Market Analyst',
    focus: 'Business metrics and KPIs'
  }));

  return agents;
}

async function generateAgent(level, hierarchyData, tools, outputDir, meta) {
  const toolsList = tools.length > 0
    ? tools.map(t => `- **${t.name}** (${t.category}): ${t.capability}`).join('\n')
    : `- *No specific tools detected for ${level}*`;

  const content = `# ${level}: ${hierarchyData.name}

**Role**: ${meta.role}

## Your Mandate

You are the ${hierarchyData.name}, responsible for ${meta.focus}. Your purpose:

> **${hierarchyData.purpose}**

This serves the ultimate Telos through its contribution to the overall system hierarchy.

## Your Responsibilities

${getResponsibilities(level)}

## Available Tools

${toolsList}

## When You Are Invoked

${getInvocationTriggers(level)}

## Communication Protocol

### Input Format
\`\`\`
${level.toUpperCase()} REQUEST
Context: [what needs to be done]
Serves: [higher-level purpose]
REQUEST: [specific action]
\`\`\`

### Output Format
\`\`\`
${level.toUpperCase()} RESPONSE
Result: [what was accomplished]
Validation: [how it was verified]
Status: [PASS | FAIL]
Serves: [confirms higher-level contribution]
\`\`\`

## Integration with Other Levels

${getIntegration(level)}

## Sub-Agent Delegation

You can delegate specialized tasks to expert sub-agents using the Task tool:

${getSubAgents(level)}

See \`.telos/agents/SUB_AGENT_MAPPING.md\` for complete sub-agent documentation.

## Remember

Your work at ${level} is essential to the hierarchy. Maintain quality and alignment with the purpose: "${hierarchyData.purpose}"
`;

  const filename = `${level.toLowerCase()}-${hierarchyData.name.toLowerCase().replace(/\s+/g, '-')}.md`;
  const outputPath = path.join(outputDir, filename);
  
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  
  return outputPath;
}

function getResponsibilities(level) {
  const responsibilities = {
    L3: `1. **Component Design**: Create modular, reusable components
2. **Composition Patterns**: Establish how components interact
3. **State Management**: Define component-level state
4. **Component Testing**: Test components in isolation`,
    L4: `1. **API Contract Definition**: Specify service interfaces
2. **Integration Points**: Define system boundaries
3. **Contract Testing**: Validate API contracts
4. **Dependency Management**: Manage service dependencies`,
    L5: `1. **End-to-End Testing**: Validate complete user journeys
2. **Integration Validation**: Ensure services work together
3. **Workflow Testing**: Test multi-step processes
4. **Performance Testing**: Validate system-wide performance`,
    L6: `1. **UX Design Validation**: Ensure usability standards
2. **Accessibility**: WCAG compliance and keyboard navigation
3. **User Journey Mapping**: Optimize user flows
4. **Visual Consistency**: Maintain design system coherence`,
    L7: `1. **Behavior Analysis**: Understand user patterns
2. **Feedback Synthesis**: Process user feedback
3. **A/B Testing**: Experiment with variations
4. **Insight Reporting**: Communicate findings to L8`,
    L8: `1. **Metrics Definition**: Establish KPIs and success criteria
2. **Business Analysis**: Evaluate business impact
3. **ROI Tracking**: Monitor return on investment
4. **Strategic Reporting**: Communicate to L9 Telos-Guardian`
  };
  return responsibilities[level] || '';
}

function getInvocationTriggers(level) {
  const triggers = {
    L3: `- Implementing new UI/business components
- Refactoring component architecture
- Component integration issues
- State management decisions`,
    L4: `- Defining new service contracts
- API versioning decisions
- Service integration points
- Contract breaking changes`,
    L5: `- New feature complete flows
- Integration testing needs
- Performance validation
- Release readiness checks`,
    L6: `- New user interfaces
- Accessibility audits
- User journey optimization
- Design system updates`,
    L7: `- Analyzing user behavior data
- Processing user feedback
- A/B test evaluation
- Feature usage analysis`,
    L8: `- Quarterly business reviews
- Feature prioritization
- ROI analysis
- Strategic planning sessions`
  };
  return triggers[level] || '';
}

function getIntegration(level) {
  const integration = {
    L3: `- Receives specs from **L4 Integration-Contractor**
- Uses functions from **L2 Function-Author**
- Validated by **L1 Syntax-Linter**
- Feeds into **L4** contracts`,
    L4: `- Receives requirements from **L5 Journey-Validator**
- Composed of **L3** components
- Defines contracts for **L3**
- Reports to **L5** on integration status`,
    L5: `- Receives journeys from **L6 UX-Simulator**
- Validates **L4** integrations
- Tests **L3** component interactions
- Reports to **L6** on workflow quality`,
    L6: `- Receives insights from **L7 Insight-Synthesizer**
- Defines journeys for **L5**
- Guides **L3** component design
- Reports to **L7** on UX metrics`,
    L7: `- Receives goals from **L8 Market-Analyst**
- Analyzes **L6** user interactions
- Informs **L6** design decisions
- Reports to **L8** on user insights`,
    L8: `- Receives strategy from **L9 Telos-Guardian**
- Defines success metrics for **L7**
- Evaluates **L7** insights against business goals
- Reports to **L9** on business alignment`
  };
  return integration[level] || '';
}

function getSubAgents(level) {
  const subAgents = {
    L3: `**Primary Sub-Agents:**
- \`component-implementation\` - Component creation and design
- \`feature-implementation\` - Feature-level component implementation

**Secondary Sub-Agents:**
- \`refactoring\` - Component refactoring
- \`quality\` - Component quality review
- \`testing\` - Component testing

**Example Delegation:**
\`\`\`
Use the component-implementation subagent to create a reusable [component] that follows our design system.
\`\`\``,
    L4: `**Primary Sub-Agents:**
- \`api-design\` - REST/GraphQL API design and contracts
- \`database-design\` - Data schema and contract definition

**Secondary Sub-Agents:**
- \`devops\` - API deployment infrastructure
- \`documentation\` - API documentation
- \`testing\` - API and contract testing

**Example Delegation:**
\`\`\`
Use the api-design subagent to design a RESTful API for [resource] with proper authentication and validation.
\`\`\``,
    L5: `**Primary Sub-Agents:**
- \`testing\` - User journey and E2E testing
- \`quality\` - Workflow quality assurance

**Secondary Sub-Agents:**
- \`component-implementation\` - User interaction implementation

**Example Delegation:**
\`\`\`
Use the testing subagent to create E2E tests that validate the [workflow] user journey.
\`\`\``,
    L6: `**Primary Sub-Agents:**
- \`component-implementation\` - UI component creation with accessibility
- \`research\` - UX patterns and accessibility research

**Secondary Sub-Agents:**
- \`quality\` - Accessibility validation (WCAG 2.1 AA)
- \`testing\` - User journey testing

**Example Delegation:**
\`\`\`
Use the component-implementation subagent to create an accessible [component] following WCAG 2.1 AA standards.
\`\`\``,
    L7: `**Primary Sub-Agents:**
- \`prd\` - Product requirements and feature specifications
- \`research\` - Feature research and best practices

**Example Delegation:**
\`\`\`
Use the prd subagent to create a comprehensive PRD for [feature] with user stories and acceptance criteria.
\`\`\``,
    L8: `**Primary Sub-Agents:**
- \`prd\` - Understanding market needs and user requirements
- \`research\` - Competitive analysis and market trends

**Example Delegation:**
\`\`\`
Use the prd subagent to create user stories that demonstrate business value for [feature].
\`\`\``
  };
  return subAgents[level] || '';
}

module.exports = { generateAllAgents };
