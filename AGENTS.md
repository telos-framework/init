<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big
  performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Project-Specific Agent Guidelines

## Build/Test Commands

- This is a documentation/spec project with no build process
- Validate OpenSpec changes: `openspec validate --strict`
- List active changes: `openspec list`
- List specs: `openspec list --specs`
- Show item details: `openspec show [item]`

## Code Style (Markdown)

- Use standard markdown without emojis unless requested
- Headers: ATX style (`#`, `##`, not underlines)
- Code blocks: Use triple backticks with language identifier
- Lists: Use `-` for bullets, maintain consistent indentation
- Line length: No hard limit, let content flow naturally

## Workflow

1. Before changes: Check `openspec/project.md` and `openspec list` for context
2. For new features: Create proposal under `openspec/changes/[change-id]/`
3. Validate all spec changes with `openspec validate [change] --strict`
4. Archive completed changes to `changes/archive/YYYY-MM-DD-[name]/`
