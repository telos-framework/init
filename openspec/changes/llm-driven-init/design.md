## Context

The Telos initialization system currently uses a CLI-based interview approach
where users run `telos init` and answer sequential questions. This was designed
before understanding that:

1. **Telos runs inside AI assistants**: Users interact with Telos through Claude
   Code, OpenCode, or Cursor—environments where the AI can directly analyze code
2. **Slash commands are the native pattern**: Both Claude Code and OpenCode
   support custom slash commands (markdown files in `.claude/commands/` or
   `.opencode/command/`) that the AI executes
3. **AI can do the analysis**: Claude doesn't need JavaScript code to scan
   projects—it can read files, detect patterns, and infer purpose natively

**Current implementation (CLI-based):**

- User runs `telos init` → Node.js CLI starts
- JavaScript code in `lib/discovery/` runs inquirer prompts
- User types answers into terminal prompts
- JavaScript generators create agent files

**Opportunity:**

- Convert to slash command → Claude executes natively
- Claude reads codebase directly → No JavaScript scanning needed
- Claude proposes hierarchy → User refines in conversation
- Claude writes all files → Native file operations, no npm package

**Constraints:**

- Must work across Claude Code, OpenCode, Cursor
- Should still provide fallback CLI for non-AI environments
- Must maintain compatibility with existing state persistence pattern
- Generated files should match current structure for backward compatibility

## Goals / Non-Goals

**Goals:**

- Make `/telos-init` the primary initialization method (slash command executed
  by AI)
- Use CLI exclusively as an installer for slash commands and memory files
  (AGENTS.md, CLAUDE.md)
- Leverage AI's native code analysis instead of JavaScript scanners
- Reduce user cognitive load from 12 questions to 2-3 refinements
- Distribute as a plugin for one-command installation
- Auto-generate L1-L4 technical layers from code patterns
- Focus user attention on strategic L5-L9 layers

**Non-Goals:**

- Keep interactive prompts in CLI (CLI is installer only)
- Make CLI do the analysis work (that's the AI's job via slash commands)
- Change the 9-level architecture or generated file structure
- Require external API calls or network dependencies
- Support non-markdown command formats

## Decisions

### Decision 1: Slash Command as Primary Interface

**Chosen approach:** Create `.claude/commands/telos/init.md` that instructs
Claude to analyze and initialize

**Why slash commands:**

1. **Native AI execution**: Claude reads the markdown and executes directly—no
   CLI orchestration needed
2. **Cross-platform**: Works in Claude Code, OpenCode, Cursor with identical
   syntax
3. **Conversational**: User can refine proposals in natural dialogue, not rigid
   prompts
4. **Plugin-ready**: Easy to package and distribute via
   `/plugin marketplace add`
5. **Industry pattern**: `/init` already exists in both Claude Code and OpenCode

**Implementation structure:**

```
.claude/
  commands/
    telos/
      init.md          # Main initialization command
      quick.md         # Fast mode with minimal prompts
      reset.md         # Clear and restart initialization
```

**Alternatives considered:**

- **Keep CLI as primary** - Loses AI analysis capability, requires npm install
- **MCP server** - Overcomplicated for file generation task
- **Agent Skill** - Better for ongoing capabilities, not one-time initialization

### Decision 2: Prompt-Driven Analysis Instead of Code Scanning

**Chosen approach:** Write detailed analysis instructions in the slash command
markdown

**Prompt structure:**

```markdown
---
description: Initialize Telos multi-agent system for this project
allowed-tools: Read, Write, List, Bash(git status:*)
---

# Telos Initialization

## Step 1: Analyze Codebase

Read and analyze the following to understand this project:

1. **README.md** - Extract project purpose, description, goals
2. **package.json / pyproject.toml / Cargo.toml** - Identify:
   - Tech stack (frameworks, languages)
   - Test frameworks (Vitest, Jest, Pytest)
   - Linters (ESLint, Ruff, Prettier)
   - Build tools (Vite, Webpack)
3. **src/ or lib/ directory** - Identify:
   - Component patterns (React, Vue, etc.)
   - API structure (Express routes, FastAPI endpoints)
   - Architectural patterns (MVC, microservices)
4. **!`git status`** - Check project state

## Step 2: Propose Telos Hierarchy

Based on your analysis, propose a complete 9-level hierarchy:

### L9: Telos-Guardian (Ultimate Purpose)

**Proposed purpose:** [Infer from README and project description] **Reasoning:**
[Why this is the ultimate purpose]

### L8: Market-Analyst (Business Value)

**Proposed purpose:** [Infer from metrics, KPIs mentioned] **Reasoning:**
[Business outcomes this project serves]

... [continue for L7-L1]

### L1: Syntax-Linter (Code Structure)

**Proposed purpose:** [Based on detected linters] **Reasoning:**
[ESLint/Prettier/Ruff detected, here's the quality standard]

## Step 3: User Review (L5-L9 only)

Present the strategic layers (L9-L5) and ask: "Please review the strategic
purpose layers. Would you like to refine any of these?"

If yes: Collect refinements conversationally If no: Proceed to generation

## Step 4: Generate Telos System

Create the following files:

- telos/content/TELOS.md
- telos/agents/l9-telos-guardian.md
- telos/agents/l8-market-analyst.md ... [all 9 agents]
- logos/orchestrator.js
- Platform-specific symlinks
```

**Why this approach:**

- Claude can read files and infer patterns better than JavaScript regex
- Reduces npm dependencies (no need for code-scanner.js, hierarchy-builder.js)
- More flexible—Claude adapts to any language/framework
- Faster—no CLI startup time, direct AI execution

**Alternatives considered:**

- **Keep JavaScript scanners** - Still requires CLI, less flexible than AI
- **Minimal prompts** - Would miss opportunities for quality analysis

### Decision 3: Auto-Generate L1-L4, Review L5-L9

**Rationale:** Technical layers are deterministic; strategic layers need human
input

**L1-L4 (Auto-generated based on detected patterns):**

- **L1 (Syntax-Linter)**: If ESLint found → "Ensure code passes ESLint strict
  mode"
- **L2 (Function-Author)**: If Vitest found → "Write TDD functions with Vitest
  coverage"
- **L3 (Component-Architect)**: If React found → "Design reusable React
  components"
- **L4 (Integration-Contractor)**: If Express found → "Maintain RESTful API
  contracts"

**L5-L9 (User-reviewed strategic goals):**

- **L5 (Journey-Validator)**: Requires understanding user workflows
- **L6 (UX-Simulator)**: Requires UX philosophy
- **L7 (Insight-Synthesizer)**: Requires product strategy
- **L8 (Market-Analyst)**: Requires business model understanding
- **L9 (Telos-Guardian)**: Requires philosophical purpose (can be AI-proposed
  but user must approve)

**User interaction flow:**

1. Claude shows full L9-L1 proposal with reasoning
2. Claude says: "The technical layers (L1-L4) are based on your detected
   tooling. The strategic layers (L9-L5) define your business purpose. Would you
   like to refine L9-L5?"
3. If yes: Conversational refinement of each strategic layer
4. If no: Generate with AI proposals

### Decision 4: Plugin Distribution Model

**Chosen approach:** Distribute via Claude Code plugin marketplace

**Plugin structure:**

```
.claude-plugin/
  plugin.json          # Manifest
commands/
  telos/
    init.md            # Main command
    quick.md           # Quick initialization
templates/
  agent-template.md    # Agent generation template
  telos-template.md    # TELOS.md template
README.md              # Plugin documentation
```

**Installation flow:**

```bash
# User adds Telos marketplace
/plugin marketplace add telos/framework

# User installs Telos plugin
/plugin install telos

# User runs initialization
/telos-init
```

**Why plugin distribution:**

1. **One-command install**: No `npm install -g`, no version management
2. **Auto-updates**: Plugin marketplaces can push updates
3. **Discoverability**: Users browse plugin marketplace for capabilities
4. **Team sharing**: Organizations can run internal plugin marketplaces
5. **Easy toggle**: Enable/disable without uninstalling

**Alternatives considered:**

- **Keep npm package** - Harder to discover, requires global install, version
  conflicts
- **Git clone** - Manual setup, no auto-updates

### Decision 5: CLI Role - Installer Only

**Chosen approach:** CLI installs slash commands and sets up memory files, then
exits

**New CLI behavior:**

1. **Installation**: Copy slash command files from package to
   `.claude/commands/telos/`
2. **Memory setup**: Create/update AGENTS.md and CLAUDE.md with Telos
   instructions
3. **Platform detection**: Check for `.claude/` vs `.opencode/` and adapt
4. **Exit with instructions**: Display "Next step: Run /telos-init to complete
   setup"

**No more interactive prompts in CLI** - all discovery happens in `/telos-init`
slash command

**CLI implementation:**

```javascript
// In lib/commands/init.js
async function initCommand(options) {
  console.log(chalk.cyan("Installing Telos slash commands...\n"));

  // Copy slash command files
  await installSlashCommands();
  console.log(
    chalk.green("✓ Installed /telos-init, /telos-validate, /telos-status"),
  );

  // Setup memory files
  await setupMemoryFiles();
  console.log(chalk.green("✓ Created AGENTS.md and CLAUDE.md templates"));

  // Done
  console.log(chalk.bold.cyan("\n🎯 Next step:"));
  console.log(
    chalk.white("   Run /telos-init in Claude Code to complete setup\n"),
  );
}
```

**Why this approach:**

- Clear separation: CLI = installer, AI = intelligent discovery
- No duplication: Don't need to maintain both CLI prompts and slash command
  prompts
- Faster: CLI runs once to install, `/telos-init` can be run multiple times to
  refine
- Plugin-friendly: Plugin distribution just bundles the command files, no CLI
  needed

## Risks / Trade-offs

**Risk: Non-AI environment users lose primary workflow**

- Mitigation: Keep CLI fully functional, document as "advanced" or "CI" mode
- Trade-off: Maintain two codepaths, but CLI becomes simpler (just file
  generation)

**Risk: Slash command quality varies by AI assistant**

- Different AIs interpret prompts differently
- Mitigation: Test across Claude Code, OpenCode, Cursor; refine prompt clarity
- Trade-off: May need platform-specific command variants

**Risk: Users unfamiliar with slash commands**

- New pattern for developers used to CLI tools
- Mitigation: Clear documentation, video walkthrough, `/help` integration
- Trade-off: Learning curve, but aligns with industry (both Claude/OpenCode use
  this)

**Risk: Plugin marketplace adoption**

- Users may not know about plugin marketplaces
- Mitigation: Dual distribution (npm + plugin), document both methods
- Trade-off: More distribution channels to maintain

**Risk: Loss of state persistence mid-initialization**

- Slash commands don't have built-in resume capability like CLI
- Mitigation: Command writes checkpoint files, can be re-run safely
- Trade-off: State persistence less robust than CLI version

## Migration Plan

**Phase 1: Build slash command alongside CLI (current release)**

- Add `.claude/commands/telos/init.md`
- Test across Claude Code, OpenCode, Cursor
- Document both CLI and slash command methods
- Collect user feedback on preference

**Phase 2: Promote slash command as primary (next release)**

- Update README to show `/telos-init` first
- Add plugin marketplace support
- CLI shows recommendation for slash command
- Mark CLI as "legacy" in docs

**Phase 3: Simplify CLI to just file generation (future)**

- Remove interactive prompts from CLI
- CLI becomes `telos generate --from-file telos-spec.json`
- Slash command remains primary user-facing method
- CLI useful for CI/CD automation only

**Rollback strategy:** If slash commands prove problematic, continue maintaining
CLI as primary. Plugin distribution is additive, doesn't remove npm package.

## Open Questions

1. **Q: Should we support both `.claude/commands/` and `.opencode/command/`
   locations?**
   - A: Yes, use symlinks or copy command to both locations for cross-platform
     support

2. **Q: How do we handle projects where AI can't infer purpose (e.g., empty
   repos)?**
   - A: Command detects empty project, asks user for minimal context, then
     proposes hierarchy

3. **Q: Should quick mode still exist for slash commands?**
   - A: Yes, `/telos-quick` accepts all AI proposals without review

4. **Q: How do we version slash commands for breaking changes?**
   - A: Plugin versioning handles this; users can pin plugin versions

5. **Q: Should the command be `/telos-init` or `/telos:init` (namespaced)?**
   - A: `/telos-init` for simplicity; namespace only if conflicts arise
