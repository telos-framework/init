# Changelog

All notable changes to Telos framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
