## 1. Create Slash Command Definition

- [x] 1.1 Create `.claude/commands/telos/init.md` with comprehensive analysis
      prompt:
  - [x] Frontmatter with `allowed-tools: Read, Write, List, Bash`
  - [x] Step 1: Codebase analysis instructions (README, package files, src
        structure)
  - [x] Step 2: Hierarchy proposal template (L9→L1 with reasoning)
  - [x] Step 3: User review prompts for strategic layers (L9-L5)
  - [x] Step 4: File generation instructions with exact paths
- [x] 1.2 Create `.claude/commands/telos/quick.md` for auto-accept mode (no
      review)
- [x] 1.3 Create `.claude/commands/telos/reset.md` for clearing existing
      installation
- [ ] 1.4 Test commands in Claude Code to ensure prompt clarity and correct
      execution

## 2. Build Agent Generation Templates (for slash command to use)

- [ ] 2.1 Create `templates/agent-l9-template.md` - Telos-Guardian agent
      structure
- [ ] 2.2 Create `templates/agent-l8-template.md` - Market-Analyst agent
      structure
- [ ] 2.3 Create `templates/agent-l7-template.md` - Insight-Synthesizer agent
      structure
- [ ] 2.4 Create `templates/agent-l6-template.md` - UX-Simulator agent structure
- [ ] 2.5 Create `templates/agent-l5-template.md` - Journey-Validator agent
      structure
- [ ] 2.6 Create `templates/agent-l4-template.md` - Integration-Contractor agent
      structure
- [ ] 2.7 Create `templates/agent-l3-template.md` - Component-Architect agent
      structure
- [ ] 2.8 Create `templates/agent-l2-template.md` - Function-Author agent
      structure
- [ ] 2.9 Create `templates/agent-l1-template.md` - Syntax-Linter agent
      structure
- [ ] 2.10 Embed templates in `/telos-init` slash command (not as separate
      files)
- [ ] 2.11 Slash command will substitute values directly when generating agents

## 3. Create Memory File Templates (for CLI installer)

- [x] 3.1 Create `templates/AGENTS.md` template:
  - [x] Reference to 9-level agent hierarchy
  - [x] Explanation of Telos-Logos system
  - [x] Instructions for using `/telos-validate` and `/telos-status`
  - [x] Links to agent files in `telos/agents/`
- [x] 3.2 Create `templates/CLAUDE.md` template:
  - [x] Project-specific Telos instructions
  - [x] Reminder to consult Telos hierarchy before major changes
  - [x] Reference to OpenSpec integration
  - [x] Placeholder for project-specific context
- [x] 3.3 Create `templates/telos-content-template.md` (embedded in slash
      command):
  - [x] Ultimate purpose (L9 Telos)
  - [x] Beneficiaries, measurable impact, ethical constraints
  - [x] 9-level hierarchy summary
  - [x] Detected tech stack and tooling
- [x] 3.4 Test template installation via CLI

## 4. Build Plugin Structure

- [ ] 4.1 Create `.claude-plugin/plugin.json` manifest:
  - [ ] Plugin metadata (name, version, description, author)
  - [ ] Command exports (`/telos-init`, `/telos-quick`, `/telos-reset`)
  - [ ] Dependencies (none required for basic operation)
  - [ ] Permissions (file read/write, bash execution)
- [ ] 4.2 Create plugin README.md with:
  - [ ] Installation instructions (`/plugin marketplace add telos/framework`)
  - [ ] Usage guide (`/telos-init` walkthrough)
  - [ ] Explanation of 9-level hierarchy
  - [ ] Examples of generated outputs
- [ ] 4.3 Create LICENSE file (MIT)
- [ ] 4.4 Create CHANGELOG.md for plugin versioning

## 5. Cross-Platform Support

- [ ] 5.1 Create `.opencode/command/telos/init.md` (OpenCode format):
  - [ ] Test that frontmatter matches OpenCode spec
  - [ ] Verify `$ARGUMENTS` placeholder works
  - [ ] Test shell output with `!` prefix
- [ ] 5.2 Add platform detection in slash command:
  - [ ] Detect `.claude/` vs `.opencode/` context
  - [ ] Generate files in appropriate directories
  - [ ] Create symlinks if needed for cross-platform support
- [ ] 5.3 Test in Cursor (uses Claude Code format)
- [ ] 5.4 Document platform-specific variations if any

## 6. Reimplement CLI as Installer Only

- [x] 6.1 Completely rewrite `lib/commands/init.js`:
  - [x] Remove all interactive prompts (inquirer, ora, etc.)
  - [x] Implement `installSlashCommands()` - Copy command files to
        `.claude/commands/telos/`
  - [x] Implement `setupMemoryFiles()` - Create AGENTS.md and CLAUDE.md from
        templates
  - [x] Detect platform (`.claude/` vs `.opencode/`) and install to correct
        location
  - [x] Display completion message: "Next step: Run /telos-init"
- [x] 6.2 Create `lib/installers/slash-commands.js`:
  - [x] `copyCommandFiles()` - Copy from package to project
  - [x] `detectPlatform()` - Check for Claude Code, OpenCode, Cursor
  - [x] `ensureDirectories()` - Create `.claude/commands/telos/` if needed
- [x] 6.3 Create `lib/installers/memory-files.js`:
  - [x] `createAgentsMd()` - Generate AGENTS.md with Telos agent references
  - [x] `createClaudeMd()` - Generate CLAUDE.md with Telos instructions
  - [x] `updateExisting()` - Merge with existing files if present
- [ ] 6.4 Remove dependencies no longer needed:
  - [ ] Remove `lib/discovery/telos-discovery.js` (logic moves to slash command)
  - [ ] Remove `lib/discovery/hierarchy-builder.js` (logic moves to slash
        command)
  - [ ] Keep `lib/discovery/code-scanner.js` for potential helper use
- [ ] 6.5 Update `bin/telos-cli.js` to remove old command references
- [x] 6.6 Test CLI installation in various environments

## 7. Update Documentation

- [x] 7.1 Update `README.md`:
  - [x] Move slash command installation to top of "Quick Start"
  - [x] Show `/telos-init` as primary method
  - [ ] Document CLI as "Fallback" or "CI/CD" method
  - [ ] Add visual comparison: before (12 questions) vs after (2 min review)
  - [ ] Include GIF or video of `/telos-init` in action
- [ ] 7.2 Update `USAGE.md`:
  - [ ] Detailed walkthrough of `/telos-init` workflow
  - [ ] How to refine strategic layers
  - [ ] How to re-run if unsatisfied
  - [ ] Examples of different project types (React, Python, Rust)
- [ ] 7.3 Create `docs/SLASH_COMMANDS.md`:
  - [ ] `/telos-init` - Full initialization with review
  - [ ] `/telos-quick` - Auto-accept all proposals
  - [ ] `/telos-reset` - Clear and restart
  - [ ] `/telos-status` - Show current Telos configuration
- [ ] 7.4 Update `TROUBLESHOOTING.md`:
  - [ ] "Slash command not found" → Plugin installation steps
  - [ ] "AI proposed wrong purpose" → How to refine
  - [ ] "Missing L1-L4 tools" → Manual specification guide

## 8. Plugin Marketplace Setup

- [ ] 8.1 Create GitHub repository for plugin marketplace:
  - [ ] `marketplace.json` with plugin listings
  - [ ] Plugin metadata and descriptions
  - [ ] Installation URLs and versions
- [ ] 8.2 Publish Telos plugin to marketplace:
  - [ ] Create release with versioned plugin
  - [ ] Add plugin to marketplace.json
  - [ ] Test installation via `/plugin marketplace add telos/framework`
- [ ] 8.3 Create marketplace documentation:
  - [ ] How to browse available plugins
  - [ ] How to install and enable Telos
  - [ ] Update and version management

## 9. Testing

- [ ] 9.1 Test `/telos-init` in various project types:
  - [ ] React + TypeScript + Vitest project
  - [ ] Python + FastAPI + Pytest project
  - [ ] Node.js + Express + Jest project
  - [ ] Rust + Cargo project
  - [ ] Empty/greenfield project
  - [ ] Monorepo with multiple packages
- [ ] 9.2 Test user refinement workflows:
  - [ ] Accept all AI proposals
  - [ ] Refine only L9 (ultimate purpose)
  - [ ] Refine all strategic layers (L9-L5)
  - [ ] Request re-analysis with additional context
  - [ ] Cancel and restart
- [ ] 9.3 Test cross-platform:
  - [ ] Claude Code (macOS, Linux, Windows)
  - [ ] OpenCode in terminal
  - [ ] Cursor editor
- [ ] 9.4 Test generated file quality:
  - [ ] TELOS.md contains accurate analysis
  - [ ] All 9 agent files include relevant tools
  - [ ] Logos orchestrator is properly configured
  - [ ] Platform symlinks work correctly
- [ ] 9.5 Test CLI fallback:
  - [ ] `telos init` works without AI environment
  - [ ] `telos generate --from-spec` works in CI
  - [ ] Environment detection shows correct tips

## 10. Migration Guide

- [ ] 10.1 Create `MIGRATION.md`:
  - [ ] For existing Telos CLI users
  - [ ] How to transition to slash command workflow
  - [ ] What changes in generated files (if any)
  - [ ] How to migrate existing `.telos-init-state.json` files
- [ ] 10.2 Add deprecation notice to CLI (non-breaking):
  - [ ] Banner: "Consider trying /telos-init for improved experience"
  - [ ] Link to migration guide
  - [ ] No removal of CLI functionality
- [ ] 10.3 Update package.json scripts:
  - [ ] Keep existing `telos init` command
  - [ ] Add note about plugin installation in postinstall hook

## 11. Polish and User Experience

- [ ] 11.1 Improve slash command output formatting:
  - [ ] Use markdown tables for hierarchy proposal display
  - [ ] Add emoji indicators (✓ auto-generated, ✏️ needs review)
  - [ ] Show progress indicators ("Analyzing... Reading... Proposing...")
- [ ] 11.2 Add helpful hints in command:
  - [ ] "Tip: Say 'refine L9' to edit specific layers"
  - [ ] "Tip: Say 'explain L3' to understand component architecture layer"
- [ ] 11.3 Create example outputs for documentation:
  - [ ] Sample TELOS.md for React project
  - [ ] Sample L1 agent for Python project
  - [ ] Sample full hierarchy for various domains
- [ ] 11.4 Add `/telos-examples` command showing sample projects
- [ ] 11.5 Create video tutorial demonstrating full workflow

## 12. Community and Launch

- [ ] 12.1 Create announcement blog post:
  - [ ] "Introducing Slash Command Initialization"
  - [ ] Before/after comparison
  - [ ] Video demo
  - [ ] Installation guide
- [ ] 12.2 Update npm package description and keywords:
  - [ ] Add "claude-code-plugin", "slash-commands", "ai-native"
- [ ] 12.3 Submit to Claude Code plugin marketplace
- [ ] 12.4 Submit to OpenCode command library (if exists)
- [ ] 12.5 Create GitHub Discussions thread for feedback
- [x] 12.6 Update CHANGELOG.md with new feature announcement
