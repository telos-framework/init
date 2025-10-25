# Project Context for Claude

This project uses the **Telos Framework** for purpose-driven development.

## Before Making Changes

1. **Check Telos hierarchy**: Run `/telos-status` to see the 9-level purpose
   structure
2. **Understand the purpose**: Read `telos/content/TELOS.md` for ultimate
   project goals
3. **Consult the right agent**: Check the appropriate agent definition in
   `telos/agents/`

## Agent Responsibilities

When working on different types of tasks, reference the corresponding agent:

| Task Type                   | Consult Agent               | File                                        |
| --------------------------- | --------------------------- | ------------------------------------------- |
| Project direction decisions | Telos-Guardian (L9)         | `telos/agents/l9-telos-guardian.md`         |
| Business value questions    | Market-Analyst (L8)         | `telos/agents/l8-market-analyst.md`         |
| Product strategy            | Insight-Synthesizer (L7)    | `telos/agents/l7-insight-synthesizer.md`    |
| UX/design decisions         | UX-Simulator (L6)           | `telos/agents/l6-ux-simulator.md`           |
| User workflow validation    | Journey-Validator (L5)      | `telos/agents/l5-journey-validator.md`      |
| API changes                 | Integration-Contractor (L4) | `telos/agents/l4-integration-contractor.md` |
| Component design            | Component-Architect (L3)    | `telos/agents/l3-component-architect.md`    |
| Function implementation     | Function-Author (L2)        | `telos/agents/l2-function-author.md`        |
| Code quality                | Syntax-Linter (L1)          | `telos/agents/l1-syntax-linter.md`          |

## Validation

After completing significant work:

- Run `/telos-validate` to ensure changes align with purpose
- Fix any misalignments before committing

## Commands

- `/telos-status` - View current purpose hierarchy
- `/telos-validate` - Check alignment with purpose
- `/telos-init` - Reconfigure if project direction changes

## Integration with OpenSpec

If this project uses OpenSpec for change management, ensure that:

- Major changes have proposals referencing Telos levels
- Breaking changes are validated against L9 (ultimate purpose)
- Technical specs reference L1-L4 agents for implementation guidance

---

**Remember**: Every change should serve the ultimate purpose defined in L9. When
in doubt, consult the Telos hierarchy.
