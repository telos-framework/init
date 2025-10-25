---
description: Quick Telos initialization with auto-accepted AI proposals
---

# Telos Quick Initialization

This is the fast-track initialization mode that accepts all AI-proposed
hierarchy levels without user review. Use this when you trust the AI analysis
and want to get started immediately.

## Process

1. **Analyze codebase** (same as `/telos-init`)
2. **Propose hierarchy** (auto-accept without showing to user)
3. **Generate all files** immediately
4. **Show summary** of what was created

## Step 1: Silent Analysis

Perform the same analysis as `/telos-init`:

- Read README.md
- Check package.json / pyproject.toml / Cargo.toml
- Scan src/ or lib/ directory
- Detect testing and linting tools
- Check git status

## Step 2: Auto-Generate Hierarchy

Generate the 9-level hierarchy without user interaction:

**L9-L5 (Strategic)**: Infer from README and project description **L4-L1
(Technical)**: Auto-generate from detected tools

Do NOT ask for user review - proceed directly to generation.

## Step 3: Generate Files

Create all files exactly as specified in `/telos-init` Step 4:

- `telos/content/TELOS.md`
- `telos/agents/l9-telos-guardian.md` through `l1-syntax-linter.md`
- `AGENTS.md` (if `.claude/` or `.opencode/` exists)
- `logos/orchestrator.js` (if Node.js project)

## Step 4: Display Summary

Once complete, show:

---
⚡ **Telos quick initialization complete!**

**Generated hierarchy:**

| Level | Agent | Purpose |
|-------|-------|---------|
| L9 | Telos-Guardian | [Purpose] |
| L8 | Market-Analyst | [Purpose] |
| L7 | Insight-Synthesizer | [Purpose] |
| L6 | UX-Simulator | [Purpose] |
| L5 | Journey-Validator | [Purpose] |
| L4 | Integration-Contractor | [Purpose] |
| L3 | Component-Architect | [Purpose] |
| L2 | Function-Author | [Purpose] |
| L1 | Syntax-Linter | [Purpose] |

**Files created:**
- `telos/content/TELOS.md`
- `telos/agents/` (9 agent definitions)
- `AGENTS.md`
- `logos/orchestrator.js` (if applicable)

**Not satisfied?** Run `/telos-reset` then `/telos-init` for interactive mode.
---

## When to Use Quick Mode

✅ **Use quick mode when:**

- Starting a new project with clear conventions
- The codebase already has comprehensive README
- You trust AI inference for strategic purpose
- You want to iterate quickly and refine later

❌ **Use full `/telos-init` when:**

- Project has unique or nuanced purpose
- Strategic direction needs human input
- Multiple stakeholders need alignment
- Initial setup must be perfect
