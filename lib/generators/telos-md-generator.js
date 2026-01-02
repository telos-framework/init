const fs = require('fs').promises;
const path = require('path');

/**
 * DEPRECATED: The 9-level hierarchy system has been replaced by 4-level SDD.
 * This file is kept for backward compatibility.
 * 
 * Use the SDD system instead - specs are stored in telos/specs/L1-L4
 */

async function generateTelosMd(hierarchy, outputPath) {
  // Generate 4-level SDD compatible TELOS.md
  const content = `# Project Telos

**Generated**: ${new Date().toISOString()}

## Project Purpose (L4)

${hierarchy.L4?.purpose || hierarchy.L9?.purpose || 'Purpose not defined'}

**Beneficiaries**: ${hierarchy.L4?.beneficiaries || hierarchy.L9?.beneficiaries || 'Not specified'}

**Success Impact**: ${hierarchy.L4?.impact || hierarchy.L9?.impact || 'Not specified'}

**Constraints**: ${hierarchy.L4?.constraints || hierarchy.L9?.constraints || 'None specified'}

---

## Spec Hierarchy (4 Levels)

| Level | Name       | Purpose |
|-------|------------|---------|
| L4    | Purpose    | ${hierarchy.L4?.purpose || hierarchy.L9?.purpose || 'Define project purpose'} |
| L3    | Experience | ${hierarchy.L3?.purpose || 'User journeys and UX requirements'} |
| L2    | Contract   | ${hierarchy.L2?.purpose || 'API contracts and component interfaces'} |
| L1    | Function   | ${hierarchy.L1?.purpose || 'Individual functions with TDD scenarios'} |

---

## Spec Locations

- **L4 Purpose**: \`telos/specs/L4-purpose/purpose.md\`
- **L3 Experience**: \`telos/specs/L3-experience/*.md\`
- **L2 Contract**: \`telos/specs/L2-contract/*.md\`
- **L1 Function**: \`telos/specs/L1-function/*.md\`

## Validation

Every change must trace to a spec. Use \`@telos\` annotations to link code to specs.

Ask at each level:
- **L1**: Does this function have a spec with TDD scenarios?
- **L2**: Does this respect API/component contracts?
- **L3**: Does this support user journeys?
- **L4**: Does this serve the project purpose?

If the answer is "no" at any level, create or update the spec first.
`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  
  return outputPath;
}

module.exports = { generateTelosMd };
