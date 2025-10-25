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

- Run tests: `npm test`
- Tests must pass before any version bump or publish
- This is an npm package that gets published to the registry

## Publishing Workflow

**IMPORTANT: Always ask user before publishing or version bumps**

1. Make and test code changes
2. Run `npm test` to verify all tests pass
3. **Ask user** if they want to bump version and publish
4. If approved:
   - Update version in `package.json`
   - Update `CHANGELOG.md` with changes
   - Run `npm test` again
   - Run `npm publish`
5. **Never auto-commit, auto-bump versions, or auto-publish without explicit
   user approval**

## Code Style (JavaScript/Node.js)

- CommonJS modules (`require`/`module.exports`)
- Use chalk for colored output
- Use ora for spinners (but not during interactive prompts)
- Use inquirer v9.x with `const { default: inquirer } = require('inquirer')`
- No unnecessary comments unless requested

## Workflow

1. Before changes: Check existing code patterns and conventions
2. Make focused changes to fix specific issues
3. Run `npm test` to verify
4. Ask user before version bumps or publishing
