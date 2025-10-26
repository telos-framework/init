# Changelog

All notable changes to Telos framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.2] - 2025-10-25

### Fixed

- **Init command UX**: Enforce one question at a time during `/telos-init`
  - Added critical guidance: "Ask ONLY ONE question at a time"
  - Added explicit "STOP and WAIT for user response" instructions
  - Removed "Next step: I'll also ask..." previews that caused confusion
  - Prevents AI from asking strategic layer review AND platform selection
    simultaneously
  - User answers no longer misinterpreted as answering wrong question

## [0.7.1] - 2025-10-25

### Fixed

- **CLI box alignment**: Fixed ASCII box borders in installation output
  - "Telos Framework Installation" box right side now aligns properly
  - "Installation Complete!" box right side now aligns properly
  - Both boxes now have consistent 44-character width

## [0.7.0] - 2025-10-25

### Added

- **Single source of truth for Telos instructions**:
  - New `templates/TELOS_CORE.md` contains all core validation requirements
  - `templates/AGENTS.md` injects TELOS_CORE content via `{{TELOS_CORE}}`
    placeholder
  - `templates/CLAUDE.md` now just references AGENTS.md (no duplication)
  - Other platform configs (Cursor, Cline, etc.) use simplified CLAUDE.md
    template
  - Template injection system in `lib/installers/memory-files.js`
  - 5 new tests for template injection (100 total tests)

- **Enforcement mechanisms for Telos validation**:
  - ⚠️ Visual warnings at top of CLAUDE.md and AGENTS.md templates
  - Hard requirement declarations for framework upgrades, dependency changes,
    new features
  - Pre-commit validation checklist that requires stopping if validation fails
  - Explicit "STOP and ask the user" instructions when validation can't be
    completed
  - Todo system integration: Required high-priority validation todos for
    significant changes
  - Expanded "When to Reference Telos" list including:
    - Framework upgrades (Next.js, React, etc.)
    - Dependency changes (major version bumps)
    - API contract changes
    - Architecture changes
    - Breaking changes
- **Concrete validation workflow**:
  - BEFORE/DURING/AFTER work sections with specific steps
  - Example todo structure for Telos validation
  - Required documentation in commit messages
  - Layer-specific validation guidance (which levels to check for different
    change types)

### Changed

- **CLAUDE.md template**: Moved Telos validation to top with "⚠️ REQUIRED
  READING" header
- **AGENTS.md template**: Added enforcement language and explicit stopping
  conditions
- Templates now emphasize convergence requirement: "If flows don't converge,
  STOP"
- Validation is now framed as HARD REQUIREMENT not optional best practice

### Fixed

- **Major issue**: AI assistants were bypassing Telos validation due to:
  - Vague trigger conditions ("significant changes" undefined)
  - No enforcement mechanism (just advisory "IMPORTANT" notes)
  - Missing integration with todo system
  - Framework upgrades not explicitly listed as requiring validation
  - No hard stops when validation couldn't be completed

## [0.6.0] - 2025-10-25

### Added

- **Re-initialization detection and safety checks**:
  - Detects existing Telos installations before proceeding
  - Shows which platforms are already installed
  - Offers three options: Abort (keep existing), Reinstall (overwrite), Add
    platforms (add new)
  - Prevents accidental loss of customized configuration files
  - New `detectExistingInstallation()` function checks for:
    - Existing `.claude/commands/telos/` directory
    - Existing `.opencode/command/telos-*.md` files
    - Config files (CLAUDE.md, AGENTS.md, .cursorrules, etc.) with Telos content
- **9 new tests** for re-initialization detection covering all platforms
- Total test coverage: **95 tests** across 10 test files

### Changed

- `npx telos-framework init` now safe to run multiple times without data loss
- Platform selection prompt adapts based on detected existing installation

## [0.5.0] - 2025-10-25

### Added

- **Comprehensive bidirectional validation flow** in generated `TELOS.md`:
  - Downward flow (L9→L1): Purpose drives implementation
  - Upward flow (L1→L9): Technical reality informs strategy
  - Convergence rule: Proceed only when both flows agree
  - Real-world example of OAuth feature validation through both flows
  - Quick reference guide for validation in development
  - Decision-making framework for when stuck on strategy vs implementation
- Enhanced **AGENTS.md** template with validation flow explanation
- Updated **CLAUDE.md** template with bidirectional validation workflow

### Changed

- `TELOS.md` now serves as the living validation document (the Logos itself)
- Templates emphasize validation gates and convergence requirements
- Documentation clarifies how to use TELOS.md for decision validation

## [0.4.1] - 2025-10-25

### Fixed

- **Opencode command naming**: Changed from `/telos/init` to `/telos-init`
  format
  - Commands now installed directly in `.opencode/command/` instead of
    subdirectory
  - Files named `telos-init.md`, `telos-quick.md`, etc.
  - Removes awkward double-slash syntax (`/telos/init` → `/telos-init`)
- Updated CLI output to show correct command syntax for each platform
- Updated `/telos:init` documentation with correct Opencode paths

## [0.4.0] - 2025-10-25

### Added

- **Multi-platform initialization support**: Interactive platform selection
  during `telos init`
  - Checkbox-based selection (arrow keys + space to select)
  - Support for Claude Code, Opencode, Cursor, Cline, Windsurf, Roo, Gemini
  - "Other" option creates AGENTS.md only
- **Opencode command support**: Commands installed to `.opencode/command/telos/`
  - Added YAML frontmatter with descriptions for all commands
  - Commands use `/telos/` prefix (e.g., `/telos/init`, `/telos/validate`)
- **Platform-specific config file generation**:
  - Claude Code → `CLAUDE.md`
  - Cursor → `.cursorrules`
  - Cline → `.clinerules`
  - Windsurf → `.windsurfrules`
  - Roo → `.roocode`
  - Gemini → `GEMINI.md`
  - Other → `AGENTS.md`
- **Updated `/telos:init` slash command**:
  - Step 0: Platform selection instructions
  - Step 4.4: Opencode command installation with frontmatter examples
  - Updated completion message with platform-specific command syntax

### Changed

- `telos init` now prompts for platform selection instead of auto-detecting
- Config files are prepended with Telos content (not appended) for better
  visibility
- Multiple platforms can be selected simultaneously

### Tests

- Added comprehensive test suite (`test/platform-selection.test.js`) with 18
  tests
- Total test coverage: 86 tests across 9 test files, all passing ✅
- Tests cover: command installation, config generation, frontmatter,
  multi-platform selection

## [0.3.3] - 2025-10-25

### Fixed

- Updated all slash command references and templates to use `.telos/` directory
  paths
- Corrected file path references in documentation and CLI output messages

## [0.3.2] - 2025-10-25

### Changed

- **BREAKING**: Telos files now generated in `.telos/` directory instead of
  `telos/`
  - `.telos/TELOS.md` - Main purpose hierarchy file (was
    `telos/content/TELOS.md`)
  - `.telos/agents/` - Agent definitions directory (was `telos/agents/`)
- `/telos-init` now integrates with multiple AI assistant config files:
  - Detects and updates: AGENTS.md, CLAUDE.md, .cursorrules, .clinerules,
    .windsurfrules, .roo, GEMINI.md
  - Prepends Telos reference instructions to existing config files
  - Creates AGENTS.md if no config files exist
  - All AI assistants now reference `.telos/TELOS.md` before making changes

### Added

- Comprehensive AI assistant config file integration
- Telos reference instructions prepended to 7 different AI assistant formats
- Quick reference guide in config files for L9-L1 hierarchy

### Migration

For existing Telos users:

```bash
# Move existing telos/ to .telos/
mv telos .telos
# Then run /telos-init to update config file integrations
```

## [0.3.1] - 2025-10-25

### Fixed

- Improved `/telos-init` hierarchy display formatting for terminal readability
  - Changed from markdown table to block format with visual separators
  - Each level now displayed in its own block with clear purpose and reasoning
    sections
  - Better line wrapping and visual hierarchy

## [0.3.0] - 2025-10-25

### Changed

- **BREAKING: Slash Command-First Architecture**
  - `telos init` now installs slash commands instead of running interactive
    prompts
  - CLI becomes installer-only: copies `/telos-init`, `/telos-quick`,
    `/telos-validate`, `/telos-status`, `/telos-reset` to
    `.claude/commands/telos/`
  - Sets up `AGENTS.md` and `CLAUDE.md` memory files with Telos instructions
  - Primary workflow: `telos init` → `/telos-init` (AI-driven setup)
  - Time reduction: 10 minutes → 2 minutes
  - User effort: 12 questions → 2-3 strategic refinements

### Added

- **AI-Native Slash Commands**
  - `/telos-init` - Interactive initialization with AI codebase analysis
  - `/telos-quick` - Fast initialization with auto-accepted AI proposals
  - `/telos-validate` - Check code alignment with purpose hierarchy
  - `/telos-status` - Show current Telos configuration
  - `/telos-reset` - Clear and reinitialize
- New installer modules:
  - `lib/installers/slash-commands.js` - Command file installation
  - `lib/installers/memory-files.js` - AGENTS.md and CLAUDE.md setup
- Templates for memory files:
  - `templates/AGENTS.md` - Agent framework documentation
  - `templates/CLAUDE.md` - Project context for AI assistants
- Cross-platform support: Claude Code, OpenCode, Cursor

### Removed

- Interactive CLI prompts from `telos init` (moved to `/telos-init` slash
  command)
- Dependencies on `inquirer` and `ora` in init command (still used by other
  commands)

### Migration

**For existing users:**

1. Run `telos init` in your project (installs new slash commands)
2. If you need to reconfigure, run `/telos-reset` then `/telos-init`
3. Your existing `telos/` directory structure remains compatible

**New behavior:**

- `telos init` no longer prompts for questions—it installs commands
- To complete setup, run `/telos-init` in Claude Code
- AI analyzes your codebase and proposes hierarchy
- You only review strategic layers (L9-L5), technical layers (L1-L4)
  auto-generated

## [0.2.0] - 2025-10-25

### Added

- **Progressive State Persistence**: Init process now saves progress after each
  phase, allowing seamless recovery from errors without re-prompting users
  - State saved to `.telos-init-state.json` (auto-cleaned on success)
  - Tracks 7 phases: Telos Discovery, Hierarchy Building, and Phases 1-5
  - Preserves all user input (telos, beneficiaries, impact, constraints, L9-L1
    hierarchy)
  - Automatically resumes from last successful phase on retry
  - Visual indicators show when using cached data vs running fresh
- New `lib/commands/init-state.js` module with state management functions
- Comprehensive test coverage: 68 tests including state persistence, resume
  behavior, and error recovery scenarios

### Fixed

- UI box alignment in initialization header (added missing characters)

## [0.1.4] - 2025-10-25

### Fixed

- Fixed spinner blocking interactive prompts during non-quick mode
  initialization. Spinner now only shows during quick mode; interactive mode
  shows clean prompts without spinner interference.

## [0.1.3] - 2025-10-25

### Fixed

- Fixed `inquirer.prompt is not a function` error by correctly importing
  inquirer v9.x default export in `telos-discovery.js` and
  `hierarchy-builder.js`

## [0.1.0] - 2025-10-25

### Added

#### Core Framework

- **9-Level Agent Architecture** based on Boulding's hierarchy
  - L1: Syntax-Linter for code structure integrity
  - L2: Function-Author with TDD workflow
  - L3: Component-Architect for stateful components
  - L4: Integration-Contractor for service boundaries
  - L5: Journey-Validator for E2E workflows
  - L6: UX-Simulator for accessibility and usability
  - L7: Insight-Synthesizer for behavioral analytics
  - L8: Market-Analyst for business metrics
  - L9: Telos-Guardian for purpose alignment

- **Logos Orchestrator** with three communication flows:
  - Top-down decomposition (L9 → L1)
  - Bottom-up validation (L1 → L9)
  - Middle-out reconciliation for conflicts
  - State management with `.telos/state.json` persistence

- **Telos Initialization System**:
  - Interactive discovery with progressive questioning
  - Hierarchical purpose decomposition (L9 → L1)
  - Quick mode with sensible defaults (`--quick` flag)
  - `TELOS.md` generation with 9-level hierarchy

- **Tool Discovery & Integration**:
  - Automatic project scanning (languages, frameworks, tools)
  - MCP server enumeration and capability mapping
  - 14 capability definitions with graceful degradation
  - Tool-to-level mapping system
  - `TOOLS.md` generation with usage instructions

- **Platform Compatibility**:
  - Multi-platform support (Claude, Cursor, Copilot, Gemini)
  - Symlink-based configuration (single source of truth)
  - Automatic platform detection
  - Windows junction fallback
  - Manual copy option for restricted environments

- **Spec-Driven Dialogue**:
  - OpenSpec integration with TELOS ALIGNMENT extensions
  - Spec translation (L9 goals → L1 tasks)
  - Validation cascade implementation
  - Spec lineage tracking

#### CLI Commands

- `telos init` - Initialize Telos in project
  - Interactive discovery
  - Quick mode option
  - Verbose output flag
- `telos status` - Show current configuration
  - Agent count
  - Tool inventory
  - Platform information
  - Verbose mode with details
- `telos rediscover` - Update tool detection
  - Re-scans project
  - Updates agent configurations
  - Regenerates `TOOLS.md`
- `telos validate` - Check Telos alignment
  - 4 validation checks (hierarchy, agents, tools, platform)
  - Detailed failure reporting
  - Verbose mode option

#### Documentation

- **PHILOSOPHY.md** - 8000+ word deep dive into:
  - Aristotelian teleology applied to software
  - Boulding's hierarchy explained per level
  - Logos as rational orchestration
  - Ontological emergence
  - Why hierarchical agents matter

- **AGENT_ARCHITECTURE.md** - Complete agent documentation:
  - Each agent's mandate, tools, responsibilities
  - Orchestrator-worker pattern
  - Communication flows
  - Example workflows and protocols

- **CONTRIBUTING.md** - Open-source contribution guide:
  - Development setup
  - Coding standards
  - Testing requirements
  - Pull request process
  - Philosophy contribution guidelines

- **USAGE.md** - Complete CLI usage guide:
  - All commands with examples
  - Typical workflows
  - Configuration files
  - Troubleshooting section

- **TROUBLESHOOTING.md** - Comprehensive issue guide:
  - Installation issues
  - Platform-specific problems
  - Tool discovery issues
  - Validation problems
  - Performance optimization
  - Common misunderstandings

- **docs/API.md** - Programmatic API documentation:
  - Orchestrator API
  - State Manager API
  - Discovery APIs
  - Generator APIs
  - Integration APIs
  - Platform APIs
  - Usage examples

#### Examples

- **examples/simple-web-app/** - Step-by-step new project initialization
  - Complete interactive walkthrough
  - Expected outputs at each step
  - Development workflow patterns
  - Common usage examples

- **examples/existing-project/** - Integrating Telos into existing codebase
  - Code analysis and inference
  - Gap identification
  - Improvement roadmap generation
  - Incremental adoption strategy
  - Technical debt management

- **examples/multi-platform/** - Using Telos across AI platforms
  - Symlink structure explanation
  - Consistency guarantees
  - Platform-specific considerations
  - Team collaboration scenarios

#### Integration Layer

- **MCP Client** (`lib/integration/mcp-client.js`):
  - JSON-RPC 2.0 protocol implementation
  - Server lifecycle management
  - Tool invocation with timeout handling

- **Capability Abstraction** (`lib/integration/capability-abstraction.js`):
  - 14 capability definitions
  - Tool-to-capability mapping
  - Level-specific capability queries
  - Capability availability reporting

- **Graceful Degradation** (`lib/integration/graceful-degradation.js`):
  - 13 degradation strategies
  - Fallback workflows (manual, CLI, native)
  - Agent-specific degradation guidance

- **Tool Config Writers** (`lib/integration/tool-config-writers.js`):
  - ESLint, Prettier, Vitest, Playwright templates
  - Automatic configuration generation
  - Overwrite protection

- **Tool Invoker** (`lib/integration/tool-invoker.js`):
  - Unified tool execution API
  - Convenience methods (`runLinter()`, `runTests()`, `format()`)
  - Support for multiple tool types

#### Testing

- **29 passing tests** with Vitest:
  - 3 Telos discovery tests
  - 8 Tool discovery and mapping tests
  - 11 Integration layer tests
  - 7 CLI command tests
- Test coverage >80% for core modules
- Fork-based test execution for process isolation

#### Repository Infrastructure

- MIT License
- Package published as `telos-framework` on npm
- GitHub repository at `telos-framework/init`
- `.npmignore` configured for clean package
- `.gitignore` for development files
- `prepublishOnly` script runs tests before publish

### Technical Details

**Dependencies**:

- commander ^11.1.0 (CLI framework)
- inquirer ^9.2.12 (Interactive prompts)
- handlebars ^4.7.8 (Template processing)
- chalk ^4.1.2 (Terminal styling)
- ora ^5.4.1 (Progress indicators)

**Dev Dependencies**:

- vitest ^1.0.0 (Testing framework)

**Node.js**: >=16.0.0

### Installation

```bash
# Global installation
npm install -g telos-framework

# Or use directly with npx
npx telos-framework init
```

### Credits

Created by Alan Colver

Based on:

- Aristotelian teleology (final causes)
- Kenneth Boulding's hierarchy of system complexity
- OpenSpec workflow integration
- Claude Collective multi-agent patterns

### Notes

This is the initial release of the Telos framework. While the core functionality
is complete and tested, this is considered a beta release. Feedback and
contributions are welcome.

## [Unreleased]

### Planned Features

- Additional examples (Python, Flutter, monorepo projects)
- GitHub Actions CI/CD templates
- Enhanced analytics integration
- Visual dependency graphs
- Project website
- Video tutorials

---

[0.1.0]: https://github.com/telos-framework/init/releases/tag/v0.1.0
