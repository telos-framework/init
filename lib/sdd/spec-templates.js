/**
 * Telos-SDD Spec Templates
 * 
 * Templates for generating spec files at each level.
 */

const TEMPLATES = {
  // L4: Purpose - Project-level purpose and success metrics
  4: (data) => `<!-- telos-metadata
id: L4:purpose
level: 4
title: ${data.title || 'Project Purpose'}
children: []
-->

# L4:purpose: ${data.title || 'Project Purpose'}

## Ultimate Purpose
${data.purpose || '[Describe why this project exists and what problem it solves]'}

## Success Metrics
| Metric | Target | Current |
|--------|--------|---------|
| ${data.metrics?.[0]?.name || 'Primary KPI'} | ${data.metrics?.[0]?.target || 'TBD'} | - |
| ${data.metrics?.[1]?.name || 'Secondary KPI'} | ${data.metrics?.[1]?.target || 'TBD'} | - |

## Strategic Constraints
${data.constraints?.map(c => `- ${c}`).join('\n') || '- [List any technical, business, or regulatory constraints]'}

## Target Users
${data.users?.map(u => `- **${u.name}**: ${u.description}`).join('\n') || '- [Describe your target users]'}

## Children
${data.children?.map(c => `- [${c}](../L3-experience/${c.split(':').pop()}.md)`).join('\n') || '<!-- Add L3:experience specs as children -->'}
`,

  // L3: Experience - User journeys, UX requirements, analytics
  3: (data) => `<!-- telos-metadata
id: L3:experience:${data.id || 'journey-name'}
level: 3
parent: ${data.parent || 'L4:purpose'}
title: ${data.title || 'User Journey'}
children: []
-->

# L3:experience:${data.id || 'journey-name'}: ${data.title || 'User Journey'}

## Derives From
- [${data.parent || 'L4:purpose'}](${data.parentPath || '../L4-purpose/purpose.md'})

## Journey Overview
${data.overview || '[Describe the user journey and its purpose]'}

## User Stories

### Story: ${data.stories?.[0]?.title || 'Primary user story'}
${data.stories?.[0]?.description || 'As a [user], I want to [action] so that I can [benefit].'}

## UX Requirements
${data.uxRequirements?.map(r => `- ${r}`).join('\n') || `- [List UX requirements]
- Accessibility: WCAG 2.1 AA compliance
- Performance: Page load < 3s`}

## Analytics Events
| Event | Trigger | Properties |
|-------|---------|------------|
| ${data.events?.[0]?.name || 'journey_started'} | ${data.events?.[0]?.trigger || 'User enters flow'} | ${data.events?.[0]?.props || '-'} |
| ${data.events?.[1]?.name || 'journey_completed'} | ${data.events?.[1]?.trigger || 'User completes flow'} | ${data.events?.[1]?.props || 'time_elapsed'} |

## Scenarios

### Scenario: ${data.scenarios?.[0]?.name || 'Happy path'}
- GIVEN ${data.scenarios?.[0]?.given || '[precondition]'}
- WHEN ${data.scenarios?.[0]?.when || '[action]'}
- THEN ${data.scenarios?.[0]?.then || '[expected result]'}

### Scenario: ${data.scenarios?.[1]?.name || 'Error case'}
- GIVEN ${data.scenarios?.[1]?.given || '[precondition]'}
- WHEN ${data.scenarios?.[1]?.when || '[action]'}
- THEN ${data.scenarios?.[1]?.then || '[expected result]'}

## Children
${data.children?.map(c => `- [${c}](../L2-contract/${c.split(':').slice(-1)[0]}.md)`).join('\n') || '<!-- Add L2:contract specs as children -->'}
`,

  // L2: Contract - API contracts, component interfaces
  2: (data) => `<!-- telos-metadata
id: L2:contract:${data.path || 'module/path'}
level: 2
parent: ${data.parent || 'L3:experience:journey-name'}
title: ${data.title || 'API/Component Contract'}
module_path: ${data.modulePath || 'src/path/to/module'}
children: []
-->

# L2:contract:${data.path || 'module/path'}: ${data.title || 'Contract'}

## Derives From
- [${data.parent || 'L3:experience:journey-name'}](${data.parentPath || '../L3-experience/journey-name.md'})

## Overview
${data.overview || '[Describe this API/component contract]'}

${data.isApi ? `## Endpoints

### ${data.method || 'POST'} ${data.endpoint || '/api/resource'}

**Request**:
\`\`\`json
${JSON.stringify(data.request || { field: 'type' }, null, 2)}
\`\`\`

**Response 200**:
\`\`\`json
${JSON.stringify(data.response || { success: true }, null, 2)}
\`\`\`

**Response ${data.errorCode || '400'}**:
\`\`\`json
${JSON.stringify(data.errorResponse || { error: 'ERROR_CODE', message: 'Error message' }, null, 2)}
\`\`\`

## Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| ${data.errors?.[0]?.code || 'ERROR_CODE'} | ${data.errors?.[0]?.status || '400'} | ${data.errors?.[0]?.description || 'Description'} |
` : `## Interface

### Props/Input
${data.props?.map(p => `- \`${p.name}\`: ${p.type} - ${p.description}`).join('\n') || '- `prop`: type - description'}

### Events/Output
${data.events?.map(e => `- \`${e.name}\`: ${e.type} - ${e.description}`).join('\n') || '- `event`: type - description'}
`}

## Requirements

### ${data.requirements?.[0]?.id || 'REQ-001'}
${data.requirements?.[0]?.text || 'The system SHALL [requirement]'}

## Children
${data.children?.map(c => `- [${c}](../L1-function/${c.split(':').slice(-1)[0].replace(/\\//g, '-')}.md)`).join('\n') || '<!-- Add L1:function specs as children -->'}
`,

  // L1: Function - Individual functions with TDD scenarios
  1: (data) => `<!-- telos-metadata
id: L1:function:${data.path || 'src/module'}${data.name ? ':' + data.name : ''}
level: 1
parent: ${data.parent || 'L2:contract:module/path'}
title: ${data.title || 'Module Functions'}
module_path: ${data.modulePath || 'src/module.ts'}
test_path: ${data.testPath || 'src/module.test.ts'}
-->

# L1:function:${data.path || 'src/module'}: ${data.title || 'Module Functions'}

## Derives From
- [${data.parent || 'L2:contract:module/path'}](${data.parentPath || '../L2-contract/module-path.md'})

## Implementation
- **Source**: \`${data.modulePath || 'src/module.ts'}\`
- **Tests**: \`${data.testPath || 'src/module.test.ts'}\`

---

## Functions

${data.functions?.map(fn => `### L1:function:${data.path}:${fn.name}

#### Signature
\`\`\`${data.language || 'typescript'}
${fn.signature || `function ${fn.name}(): void`}
\`\`\`

#### Purpose
${fn.purpose || '[Describe what this function does]'}

#### Requirements
${fn.requirements?.map(r => `- ${r}`).join('\n') || '- SHALL [requirement]'}

#### Scenarios

##### Scenario: ${fn.scenarios?.[0]?.name || 'success-case'}
- GIVEN ${fn.scenarios?.[0]?.given || '[precondition]'}
- WHEN ${fn.scenarios?.[0]?.when || `${fn.name} is called`}
- THEN ${fn.scenarios?.[0]?.then || '[expected result]'}

##### Scenario: ${fn.scenarios?.[1]?.name || 'error-case'}
- GIVEN ${fn.scenarios?.[1]?.given || '[error precondition]'}
- WHEN ${fn.scenarios?.[1]?.when || `${fn.name} is called`}
- THEN ${fn.scenarios?.[1]?.then || '[expected error handling]'}

---
`).join('\n') || `### L1:function:${data.path}:functionName

#### Signature
\`\`\`${data.language || 'typescript'}
function functionName(param: Type): ReturnType
\`\`\`

#### Purpose
[Describe what this function does]

#### Requirements
- SHALL [requirement]

#### Scenarios

##### Scenario: success-case
- GIVEN [precondition]
- WHEN functionName is called
- THEN [expected result]

---
`}

## Coverage Status

| Function | Scenarios | Tests | Passing | Coverage |
|----------|-----------|-------|---------|----------|
${data.functions?.map(fn => `| ${fn.name} | ${fn.scenarios?.length || 0} | - | - | ⏳ |`).join('\n') || '| functionName | 0 | - | - | ⏳ |'}

Last validated: -
`
};

/**
 * Generate spec content from template
 * @param {number} level - Spec level (1-4)
 * @param {object} data - Template data
 * @returns {string} Spec markdown content
 */
function generateSpec(level, data = {}) {
  const template = TEMPLATES[level];
  if (!template) {
    throw new Error(`Unknown spec level: ${level}`);
  }
  return template(data);
}

/**
 * Generate TELOS.md entry point
 * @param {object} data - Project data
 * @returns {string} TELOS.md content
 */
function generateTelosEntry(data = {}) {
  // Generate experiences list if provided
  const experiencesList = data.experiences?.length > 0
    ? data.experiences.map(e => `- [${e.title}](specs/L3-experience/${e.file})`).join('\n')
    : '_No experiences defined yet. Run `/telos:init` to add user journeys._';

  return `# TELOS: ${data.projectName || 'Project Name'}

> Purpose-driven development with spec-code traceability

## Purpose

${data.purpose || '[Your project purpose - see L4:purpose spec]'}

See: [Full Purpose Spec](specs/L4-purpose/purpose.md)

## User Experiences (L3)

${experiencesList}

## Spec Hierarchy

| Level | Name | Description | Count |
|-------|------|-------------|-------|
| L4 | Purpose | Project purpose + success metrics | 1 |
| L3 | Experience | User journeys + UX | ${data.l3Count || 0} |
| L2 | Contract | APIs + component interfaces | ${data.l2Count || 0} |
| L1 | Function | Functions with TDD | ${data.l1Count || 0} |

---

## 🚨 IMPORTANT: Feature Request Workflow

**When the user requests a new feature, you MUST follow this workflow:**

### Step 1: Check Impact on Experiences (L3)

Ask: "Does this feature affect any existing user journeys, or create a new one?"

- If **new journey**: Create a new L3 spec in \`telos/specs/L3-experience/\`
- If **modifies journey**: Update the relevant L3 spec first
- If **no journey impact**: Proceed to Step 2

### Step 2: Define or Update Contracts (L2)

Before writing ANY code, create/update L2 contract specs:

- **New API endpoint?** → Create \`telos/specs/L2-contract/api-[name].md\`
- **New component?** → Create \`telos/specs/L2-contract/component-[name].md\`
- **Modifying existing?** → Update the relevant L2 spec

L2 specs must include:
- Interface/API signature
- Input/output contracts
- Error handling
- Parent L3 experience reference

### Step 3: Define Functions (L1)

For each function needed to implement the L2 contracts:

1. Create L1 spec in \`telos/specs/L1-function/\`
2. Include TDD scenarios (given/when/then)
3. Reference parent L2 contract

### Step 4: Generate Tests

\`\`\`bash
telos spec generate-tests L1:function:[spec-id]
\`\`\`

Or manually create tests with \`@telos-test\` annotations.

### Step 5: Implement with Annotations

\`\`\`${data.primaryLanguage || 'typescript'}
// @telos L1:function:src/module:functionName
export function functionName() {
  // implementation
}
\`\`\`

### Step 6: Validate Before Commit

\`\`\`bash
telos validate
\`\`\`

---

## Quick Reference

**Commands:**
- \`/telos:validate\` - Validate specs, code links, and tests
- \`/telos:status\` - Show current spec counts and health
- \`/telos:sdd-discover\` - Generate specs from existing code
- \`/telos:sdd-context <spec-id>\` - Load context for a spec
- \`/telos:sdd-generate-tests <spec-id>\` - Generate tests from scenarios

**Annotation Format:**
\`\`\`${data.primaryLanguage || 'typescript'}
// @telos L1:function:src/module:functionName
// @telos-test L1:function:src/module:functionName
// @telos-scenario L1:function:src/module:functionName:scenario-name
\`\`\`

**Spec ID Format:** \`L[level]:[type]:[path]:[name]\`

Examples:
- \`L4:purpose\`
- \`L3:experience:user-signup-flow\`
- \`L2:contract:api-auth\`
- \`L1:function:src/auth/validation:validateToken\`

---

## Links

- [Telos Documentation](https://github.com/telos-framework/init)
- [Spec-Driven Development Guide](https://telos-framework.dev/sdd)
`;
}

module.exports = {
  TEMPLATES,
  generateSpec,
  generateTelosEntry
};
