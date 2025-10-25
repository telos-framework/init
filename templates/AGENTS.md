# Agent Framework

This project uses the **Telos Framework** - a 9-level purpose-driven
architecture for AI-assisted software development.

## Purpose Hierarchy

The Telos system organizes development decisions across 9 hierarchical levels,
from ultimate purpose (L9) to code syntax (L1). Each level is managed by a
specialized agent.

### Strategic Layers (L9-L5)

These agents handle high-level purpose, strategy, and user experience:

- **L9: Telos-Guardian** (`telos/agents/l9-telos-guardian.md`) - Ultimate
  purpose keeper
- **L8: Market-Analyst** (`telos/agents/l8-market-analyst.md`) - Business value
  measurer
- **L7: Insight-Synthesizer** (`telos/agents/l7-insight-synthesizer.md`) -
  Product strategist
- **L6: UX-Simulator** (`telos/agents/l6-ux-simulator.md`) - Experience designer
- **L5: Journey-Validator** (`telos/agents/l5-journey-validator.md`) - Workflow
  verifier

### Technical Layers (L4-L1)

These agents handle implementation details and code quality:

- **L4: Integration-Contractor** (`telos/agents/l4-integration-contractor.md`) -
  API contract enforcer
- **L3: Component-Architect** (`telos/agents/l3-component-architect.md`) -
  Component designer
- **L2: Function-Author** (`telos/agents/l2-function-author.md`) - Function
  implementer
- **L1: Syntax-Linter** (`telos/agents/l1-syntax-linter.md`) - Code quality
  enforcer

## Telos-Logos System

**Telos** (purpose) is defined in `telos/content/TELOS.md` - the ultimate goal
this project serves.

**Logos** (logic) is managed by the orchestrator in `logos/orchestrator.js` -
routes development requests to the appropriate agent based on the nature of the
work.

## Using Telos in Development

When working on this project:

1. **Check purpose alignment**: Before major changes, consult the relevant agent
   definition
2. **Validate decisions**: Run `/telos-validate` to ensure code aligns with
   purpose
3. **Review hierarchy**: Run `/telos-status` to see current configuration
4. **Refine as needed**: Run `/telos-init` to reconfigure if project direction
   changes

## Slash Commands

- `/telos-init` - Initialize or reconfigure Telos hierarchy
- `/telos-quick` - Fast initialization with auto-accepted proposals
- `/telos-validate` - Check code alignment with purpose hierarchy
- `/telos-status` - Show current Telos configuration
- `/telos-reset` - Clear and reinitialize

## Philosophy

The Telos framework ensures that every line of code serves a clear purpose,
traceable back to the ultimate goal. This creates:

- **Clarity**: Everyone understands why we're building what we're building
- **Alignment**: Technical decisions support strategic goals
- **Focus**: No feature creep or purposeless code
- **Quality**: Each layer has clear validation criteria

For more information, see
[Telos Framework documentation](https://github.com/yourusername/telos).
