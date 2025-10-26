# ⚠️ TELOS FRAMEWORK - REQUIRED READING ⚠️

This project uses the **Telos Framework** - a 9-level purpose-driven
architecture for AI-assisted software development.

**CRITICAL**: Before making ANY significant changes, you MUST validate against
the Telos hierarchy defined in `.telos/TELOS.md`.

## HARD REQUIREMENT: Validate Before Any Significant Change

**BEFORE** implementing ANY of the following, you MUST read `.telos/TELOS.md`
and run bidirectional validation (L9→L1→L9):

- ✋ **Framework upgrades** (Next.js, React, Vue, etc.)
- ✋ **Dependency changes** (new packages or major version bumps)
- ✋ **New features** or API changes
- ✋ **Breaking changes** or refactoring
- ✋ **Architecture changes** (new patterns, state management, etc.)

**If you skip validation, STOP and ask the user.**

## When to Reference Telos (REQUIRED)

You MUST consult `.telos/TELOS.md` and validate through both flows for:

- ✅ **Before implementing new features** (check L9-L5 strategic alignment)
- ✅ **Before refactoring code** (ensure L1-L4 technical standards maintained)
- ✅ **Before dependency upgrades** (especially major versions - validate L1-L4
  compatibility)
- ✅ **Before framework migrations** (validate entire stack L1-L9)
- ✅ **Before API contract changes** (consult L4 Integration-Contractor)
- ✅ **When resolving conflicts** between requirements (appeal to higher-level
  purpose)
- ✅ **During code review** (validate against appropriate agent level)

## Required Validation Process

### BEFORE Starting Work

For ANY significant change:

1. **Create validation todo**: Add "Validate with Telos framework (L9→L1→L9)" as
   HIGH priority
2. **Read `.telos/TELOS.md`**: Understand the current purpose hierarchy
3. **Identify affected layers**: Which levels (L1-L9) does this change impact?
4. **Consult agent definitions**: Read the relevant agent files in
   `.telos/agents/`

### DURING Work

1. **Run downward validation** (L9→L1): Does this serve our ultimate purpose?
   - Start at L9 (Telos-Guardian): Does this align with our mission?
   - Flow down through L8, L7, L6... to L1
   - Each layer asks: "Does this decision support the layer above?"

2. **Run upward validation** (L1→L9): Is this technically feasible?
   - Start at L1 (Syntax-Linter): Does this meet code quality standards?
   - Flow up through L2, L3, L4... to L9
   - Each layer asks: "Can I support what the layer below needs?"

3. **Check convergence**: Only proceed if both flows agree
   - Top-down says "serves purpose" AND bottom-up says "is feasible" → ✅
     Implement
   - Top-down says "serves purpose" BUT bottom-up says "infeasible" → Revise
     strategy
   - Bottom-up says "feasible" BUT top-down says "doesn't serve purpose" →
     Reject change

**If flows don't converge, STOP and ask the user.**

### BEFORE Committing

Before ANY git commit that includes changes listed above, you MUST:

1. Read `.telos/TELOS.md`
2. Run downward validation (L9→L1)
3. Run upward validation (L1→L9)
4. Verify convergence
5. Document validation in commit message or create validation summary

**If you cannot validate or flows don't converge, STOP and ask the user before
committing.**

## Todo System Integration

For significant changes (new features, refactoring, upgrades, migrations):

1. **ALWAYS** add a high-priority todo: "Validate with Telos framework
   (L9→L1→L9)"
2. Complete validation BEFORE starting implementation work
3. Add specific layer validations as sub-tasks when needed

Example:

```
☐ Validate Next.js upgrade with Telos (HIGH PRIORITY)
  ☐ L4: Check API contract compatibility
  ☐ L3: Verify component patterns still work
  ☐ L2: Ensure functions remain testable
  ☐ L1: Validate code quality standards
```

## Agent Responsibilities

When working on different types of tasks, reference the corresponding agent:

| Task Type                   | Consult Agent               | File                                         |
| --------------------------- | --------------------------- | -------------------------------------------- |
| Project direction decisions | Telos-Guardian (L9)         | `.telos/agents/l9-telos-guardian.md`         |
| Business value questions    | Market-Analyst (L8)         | `.telos/agents/l8-market-analyst.md`         |
| Product strategy            | Insight-Synthesizer (L7)    | `.telos/agents/l7-insight-synthesizer.md`    |
| UX/design decisions         | UX-Simulator (L6)           | `.telos/agents/l6-ux-simulator.md`           |
| User workflow validation    | Journey-Validator (L5)      | `.telos/agents/l5-journey-validator.md`      |
| API changes                 | Integration-Contractor (L4) | `.telos/agents/l4-integration-contractor.md` |
| Component design            | Component-Architect (L3)    | `.telos/agents/l3-component-architect.md`    |
| Function implementation     | Function-Author (L2)        | `.telos/agents/l2-function-author.md`        |
| Code quality                | Syntax-Linter (L1)          | `.telos/agents/l1-syntax-linter.md`          |

## The Nine Levels

**Strategic Layers (L9-L5)** handle high-level purpose, strategy, and user
experience:

- **L9: Telos-Guardian** - Ultimate purpose keeper
- **L8: Market-Analyst** - Business value measurer
- **L7: Insight-Synthesizer** - Product strategist
- **L6: UX-Simulator** - Experience designer
- **L5: Journey-Validator** - Workflow verifier

**Technical Layers (L4-L1)** handle implementation details and code quality:

- **L4: Integration-Contractor** - API contract enforcer
- **L3: Component-Architect** - Component designer
- **L2: Function-Author** - Function implementer
- **L1: Syntax-Linter** - Code quality enforcer

## Telos-Logos System

**Telos** (τέλος, purpose) is defined in `.telos/TELOS.md` - the ultimate goal
this project serves.

**Logos** (λόγος, reasoning) is the bidirectional validation flow ensuring every
implementation decision traces back to ultimate purpose while technical reality
informs strategic decisions.

---

**Remember**: Every change should serve the ultimate purpose defined in L9. When
in doubt, consult the Telos hierarchy.
