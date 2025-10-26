# Agent Framework

This project uses the **Telos Framework** - a 9-level purpose-driven
architecture for AI-assisted software development.

## Purpose Hierarchy

The Telos system organizes development decisions across 9 hierarchical levels,
from ultimate purpose (L9) to code syntax (L1). Each level is managed by a
specialized agent.

### Strategic Layers (L9-L5)

These agents handle high-level purpose, strategy, and user experience:

- **L9: Telos-Guardian** (`.telos/agents/l9-telos-guardian.md`) - Ultimate
  purpose keeper
- **L8: Market-Analyst** (`.telos/agents/l8-market-analyst.md`) - Business value
  measurer
- **L7: Insight-Synthesizer** (`.telos/agents/l7-insight-synthesizer.md`) -
  Product strategist
- **L6: UX-Simulator** (`.telos/agents/l6-ux-simulator.md`) - Experience
  designer
- **L5: Journey-Validator** (`.telos/agents/l5-journey-validator.md`) - Workflow
  verifier

### Technical Layers (L4-L1)

These agents handle implementation details and code quality:

- **L4: Integration-Contractor**
  (`.telos/agents/l4-integration-contractor.md`) - API contract enforcer
- **L3: Component-Architect** (`.telos/agents/l3-component-architect.md`) -
  Component designer
- **L2: Function-Author** (`.telos/agents/l2-function-author.md`) - Function
  implementer
- **L1: Syntax-Linter** (`.telos/agents/l1-syntax-linter.md`) - Code quality
  enforcer

## Telos-Logos System

**Telos** (τέλος, purpose) is defined in `.telos/TELOS.md` - the ultimate goal
this project serves.

**Logos** (λόγος, reasoning) is the bidirectional validation flow that ensures:

- **Downward flow (L9→L1)**: Every implementation decision traces back to
  ultimate purpose
- **Upward flow (L1→L9)**: Technical reality informs and validates strategic
  decisions

### How Logos Works

**Before any change**, validate through both flows:

1. **Top-down validation**: "Does this serve our ultimate purpose (L9)?"
   - Start at L9 (Telos-Guardian): Does this align with our mission?
   - Flow down through L8, L7, L6... to L1
   - Each layer asks: "Does this decision support the layer above?"

2. **Bottom-up validation**: "Is this technically feasible (L1)?"
   - Start at L1 (Syntax-Linter): Does this meet code quality standards?
   - Flow up through L2, L3, L4... to L9
   - Each layer asks: "Can I support what the layer below needs?"

3. **Convergence**: Change is validated when both flows agree
   - If top-down says "yes" but bottom-up says "infeasible" → revise strategy
   - If bottom-up says "possible" but top-down says "doesn't serve purpose" →
     reject change
   - If both agree → proceed with confidence

The orchestrator in `logos/orchestrator.js` routes requests to the appropriate
agent(s) and manages this validation flow.

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
