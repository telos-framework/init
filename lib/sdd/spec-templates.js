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
  return `# TELOS: ${data.projectName || 'Project Name'}

> Purpose-driven development with spec-code traceability

## Quick Start

\`\`\`bash
telos validate        # Validate all specs and links
telos context <id>    # Load recursive context for AI
telos coverage        # Show spec-test coverage
telos orphans         # Find unlinked code
\`\`\`

## Purpose

${data.purpose || '[Your project purpose - see L4:purpose spec]'}

See: [Full Purpose Spec](specs/L4-purpose/purpose.md)

## Spec Hierarchy

\`\`\`
L4:purpose ─────────────────────────────────────────────────────┐
│ ${data.purposeTitle || 'Project Purpose'}                     │
│                                                                │
├── L3:experience ──────────────────────────────────────────────┤
│   User journeys, UX requirements, analytics                   │
│                                                                │
├── L2:contract ────────────────────────────────────────────────┤
│   API contracts, component interfaces                         │
│                                                                │
└── L1:function ────────────────────────────────────────────────┤
    Individual functions with TDD scenarios                      │
└────────────────────────────────────────────────────────────────┘
\`\`\`

## Spec Levels

| Level | Name | Description | Count |
|-------|------|-------------|-------|
| L4 | Purpose | Project purpose + success metrics | 1 |
| L3 | Experience | User journeys + UX | ${data.l3Count || 0} |
| L2 | Contract | APIs + component interfaces | ${data.l2Count || 0} |
| L1 | Function | Functions with TDD | ${data.l1Count || 0} |

## Code Style

Style enforcement handled by existing tooling:
${data.linters?.map(l => `- **${l.name}**: \`${l.config}\``).join('\n') || `- **ESLint**: \`.eslintrc.js\`
- **Prettier**: \`.prettierrc\`
- **TypeScript**: \`tsconfig.json\``}

## Annotation Format

\`\`\`${data.primaryLanguage || 'typescript'}
// @telos L1:function:src/module:functionName
export function functionName() {
  // implementation
}

// @telos-test L1:function:src/module:functionName
describe('functionName', () => {
  // @telos-scenario L1:function:src/module:functionName:success-case
  it('should handle success case', () => {
    // test
  });
});
\`\`\`

## Workflow

1. **Create Spec** → Define requirements and scenarios
2. **Generate Tests** → \`telos spec generate-tests <spec-id>\`
3. **Run Tests** → Tests fail (Red)
4. **Implement Code** → Add @telos annotation
5. **Run Tests** → Tests pass (Green)
6. **Validate** → \`telos validate\`
7. **Commit** → Pre-commit hook verifies

## Links

- [Full Documentation](https://github.com/telos-framework/init)
- [Spec-Driven Development Guide](https://telos-framework.dev/sdd)
`;
}

module.exports = {
  TEMPLATES,
  generateSpec,
  generateTelosEntry
};
