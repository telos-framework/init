const fs = require('fs').promises;
const path = require('path');

async function generateTelosMd(hierarchy, outputPath) {
  const content = `# Project Telos

**Generated**: ${new Date().toISOString()}

## Ultimate Purpose (L9)

${hierarchy.L9.purpose}

**Beneficiaries**: ${hierarchy.L9.beneficiaries}

**Success Impact**: ${hierarchy.L9.impact}

**Constraints**: ${hierarchy.L9.constraints}

---

## Purpose Hierarchy

The 9-level decomposition from ultimate purpose to implementation:

### L9: ${hierarchy.L9.name} - Transcendent Purpose

**Purpose**: ${hierarchy.L9.purpose}

${hierarchy.L9.description}

### L8: ${hierarchy.L8.name} - Business/Social Value

**Purpose**: ${hierarchy.L8.purpose}

${hierarchy.L8.description}

**Serves**: L9 Telos

### L7: ${hierarchy.L7.name} - User Insight

**Purpose**: ${hierarchy.L7.purpose}

${hierarchy.L7.description}

**Serves**: L8 Business Value

### L6: ${hierarchy.L6.name} - User Experience

**Purpose**: ${hierarchy.L6.purpose}

${hierarchy.L6.description}

**Serves**: L7 User Insight

### L5: ${hierarchy.L5.name} - System Integration

**Purpose**: ${hierarchy.L5.purpose}

${hierarchy.L5.description}

**Serves**: L6 User Experience

### L4: ${hierarchy.L4.name} - API Contracts

**Purpose**: ${hierarchy.L4.purpose}

${hierarchy.L4.description}

**Serves**: L5 System Integration

### L3: ${hierarchy.L3.name} - Component Design

**Purpose**: ${hierarchy.L3.purpose}

${hierarchy.L3.description}

**Serves**: L4 API Contracts

### L2: ${hierarchy.L2.name} - Function Logic

**Purpose**: ${hierarchy.L2.purpose}

${hierarchy.L2.description}

**Serves**: L3 Component Design

### L1: ${hierarchy.L1.name} - Code Structure

**Purpose**: ${hierarchy.L1.purpose}

${hierarchy.L1.description}

**Serves**: L2 Function Logic

---

## Validation

Every change must trace upward through this hierarchy to the ultimate Telos.

Ask at each level:
- **L1**: Does this meet code quality standards?
- **L2**: Does this function serve the component correctly?
- **L3**: Does this component fit the architecture?
- **L4**: Does this respect API contracts?
- **L5**: Does this integrate into workflows properly?
- **L6**: Does this enhance user experience?
- **L7**: Does this respond to user insights?
- **L8**: Does this advance business objectives?
- **L9**: Does this serve the ultimate Telos?

If the answer is "no" at any level, the change requires revision.
`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  
  return outputPath;
}

module.exports = { generateTelosMd };
