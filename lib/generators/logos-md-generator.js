const fs = require('fs').promises;
const path = require('path');

async function generateLogosMd(outputPath) {
  const content = `# Logos: Rational Orchestrator

**Role**: Central orchestration engine for the Telos multi-agent collective

## What is Logos?

Logos (Greek: λόγος) means "reason," "discourse," or "rational principle." In the Telos framework, Logos is the orchestrator that maintains coherence across all 9 agent levels through rational dialogue and systematic decomposition.

## Core Responsibilities

1. **Top-Down Decomposition**: Break strategic goals (L9) into tactical implementations (L1)
2. **Bottom-Up Validation**: Verify implementations (L1) align with strategic purpose (L9)
3. **Middle-Out Reconciliation**: Resolve conflicts between levels by appealing to higher purpose
4. **State Management**: Track development state, active agents, and validation cascades

## Orchestration Flows

### Flow 1: Top-Down Decomposition

\`\`\`
User Request → L9 Telos-Guardian
  ↓ (Does this serve our Telos?)
L8 Market-Analyst (What business value?)
  ↓
L7 Insight-Synthesizer (What user insights needed?)
  ↓
L6 UX-Simulator (What UX required?)
  ↓
L5 Journey-Validator (What workflows?)
  ↓
L4 Integration-Contractor (What APIs?)
  ↓
L3 Component-Architect (What components?)
  ↓
L2 Function-Author (What functions?)
  ↓
L1 Syntax-Linter (Code quality check)
  ↓
Implementation
\`\`\`

### Flow 2: Bottom-Up Validation

\`\`\`
Implementation Complete
  ↓
L1 Syntax-Linter validates structure
  ↓ (PASS → continue)
L2 Function-Author validates logic & tests
  ↓ (PASS → continue)
L3 Component-Architect validates composition
  ↓ (PASS → continue)
L4 Integration-Contractor validates contracts
  ↓ (PASS → continue)
L5 Journey-Validator validates workflows
  ↓ (PASS → continue)
L6 UX-Simulator validates UX
  ↓ (PASS → continue)
L7 Insight-Synthesizer validates insights
  ↓ (PASS → continue)
L8 Market-Analyst validates business value
  ↓ (PASS → continue)
L9 Telos-Guardian validates Telos alignment
  ↓
APPROVED ✓
\`\`\`

### Flow 3: Middle-Out Reconciliation

When conflicts arise between levels:

\`\`\`
Conflict Detected (e.g., L3 vs L5)
  ↓
Logos identifies higher authority (L4)
  ↓
L4 Integration-Contractor reconciles
  ↓
If unresolved, escalate to L6
  ↓
Continue up hierarchy until resolved
  ↓
Resolution cascades back down
\`\`\`

## State Management

Logos maintains state in \`.telos/state.json\`:

\`\`\`json
{
  "activeAgents": [
    { "level": "L2", "task": "implement-auth", "status": "in-progress" }
  ],
  "decompositionStack": [
    { "level": "L9", "spec": "...", "children": [...] }
  ],
  "validationQueue": [
    { "level": "L1", "validation": {...}, "status": "pending" }
  ],
  "conflicts": [
    { "levelA": "L3", "levelB": "L5", "resolved": false }
  ]
}
\`\`\`

## Agent Delegation Protocol

Logos delegates to agents using structured messages:

### Request Format
\`\`\`
AGENT REQUEST
Level: [L1-L9]
Type: [decompose | validate | reconcile | implement]
Context: [relevant information]
Parent Purpose: [higher-level goal this serves]
REQUEST: [specific action]
\`\`\`

### Response Format
\`\`\`
AGENT RESPONSE
Level: [L1-L9]
Status: [PASS | FAIL | CONDITIONAL]
Result: [what was accomplished]
Validation: [how it was verified]
Serves: [confirms contribution to higher purpose]
Issues: [if any]
\`\`\`

## Integration with OpenSpec

Logos creates and manages OpenSpec proposals for all changes:

1. **Proposal Creation**: L9 validates alignment, creates OpenSpec proposal
2. **Task Generation**: Logos decomposes into tasks (L9→L1)
3. **Implementation**: Agents work through tasks
4. **Validation**: Bottom-up verification
5. **Archive**: Completed proposals archived with lineage

## Session Management

Each development session:
- Gets unique session ID
- Tracks all agent invocations
- Maintains decomposition history
- Preserves validation results
- Enables resumption after interruption

## Usage

Logos is invoked automatically by the Telos system when:
- User creates new feature request
- Code changes are proposed
- Conflicts arise between agents
- Validation is required

You typically don't invoke Logos directly—agents and the system do this for you.

## Philosophy

Logos embodies the principle that **rational discourse** maintains coherence in complex systems. By enforcing:

- Top-down purpose alignment
- Bottom-up integrity verification
- Middle-out conflict resolution

...Logos ensures every line of code serves the ultimate Telos while maintaining implementation quality at every level.

## Remember

Logos is not a command-and-control system. It's a **dialogue facilitator** that:
- Asks the right questions at the right levels
- Routes information to appropriate agents
- Maintains traceability from Telos to implementation
- Enables emergence through structured interaction

Trust the process. Trust the hierarchy. Trust Logos.
`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  
  return outputPath;
}

module.exports = { generateLogosMd };
