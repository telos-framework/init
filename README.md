# Telos: Purpose-Driven Multi-Agent Development Framework

[![npm version](https://badge.fury.io/js/telos-framework.svg)](https://www.npmjs.com/package/telos-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/telos-framework)](https://nodejs.org)
[![Tests](https://img.shields.io/badge/tests-100%20passing-brightgreen)]()

A philosophically-grounded AI collective that embeds Aristotelian purpose
hierarchy into software development. Every line of code serves your ultimate
mission.

## Philosophy

**Telos** (Greek: τέλος) means "end," "purpose," or "goal"—the ultimate reason
something exists.

**Logos** (Greek: λόγος) means "reason," "discourse," or "rational
principle"—the organizing intelligence that maintains coherent order.

Once you install the Telos framework, your AI coding assistant becomes the Logos
orchestrator itself. Every conversation with your AI follows bidirectional
validation: strategic purpose flows downward (L9→L1) to guide implementation,
while technical constraints flow upward (L1→L9) to inform strategy. Your AI
assistant mediates this dialogue, ensuring decisions converge only when both
flows align.

Most development tools focus on _how_ to code. Telos ensures you're building the
_right_ thing by maintaining alignment between implementation and purpose across
nine levels of abstraction—from syntax to transcendent meaning.

Based on Kenneth Boulding's hierarchy of system complexity, Telos orchestrates
specialized AI agents that operate coherently from low-level linting to
strategic vision.

## Architecture

### The Nine Levels

```
L9: Telos-Guardian      → Strategic alignment with ultimate purpose
L8: Market-Analyst      → Business metrics and KPIs
L7: Insight-Synthesizer → User feedback and behavioral analytics
L6: UX-Simulator        → User experience and accessibility
L5: Journey-Validator   → End-to-end workflows and integration
L4: Integration-Contractor → API contracts and service boundaries
L3: Component-Architect → Component design and composition
L2: Function-Author     → Unit logic and TDD
L1: Syntax-Linter       → Code structure and formatting
```

### Logos Orchestrator

The central orchestration engine implementing:

- **Top-down decomposition**: Strategic goals cascade into tactical specs
- **Bottom-up validation**: Implementation validates against purpose
- **Middle-out reconciliation**: Conflicts resolved through rational dialogue
- **Spec-driven workflow**: All changes flow through OpenSpec proposals

## Quick Start

```bash
npx telos-framework init
```

This command:

- Detects your AI coding platform (Claude Code, Opencode, Cursor, etc.)
- Installs platform-specific slash commands
- Sets up configuration files (CLAUDE.md, AGENTS.md, etc.)
- Prepares your project for Logos-driven development

> **Note**: Safe to run multiple times! If Telos is already installed, you'll be
> prompted to choose: Abort (keep existing), Reinstall (overwrite), or Add
> platforms. See [Re-initialization Safety](docs/REINIT.md) for details.

After installation, open your project in your AI coding assistant and run
`/telos-init` to analyze your codebase and generate the 9-level purpose
hierarchy.

## Features

### Adaptive Tool Integration

Telos discovers and integrates your existing tools:

- Linters (ESLint, Ruff, etc.)
- Test frameworks (Vitest, Jest, Playwright)
- Analytics (PostHog, Amplitude)
- MCP servers
- Custom tooling

### Multi-Platform Support

Works with:

- Claude (Code, Projects)
- Cursor
- GitHub Copilot
- Google Gemini
- Any AI coding assistant

Single source of truth with platform-specific symlinks—no duplication.

### OpenSpec Integration

Full integration with [OpenSpec](https://openspec.dev) workflow:

- Logos creates proposals for changes
- Agents work through specs and tasks
- Validation uses OpenSpec archive
- Telos lineage tracked throughout

### Specialized Sub-Agent Delegation

Each L1-L9 agent can delegate to 15 specialized sub-agents for deep technical expertise:

**Strategic & Planning:**
- `prd` - Product requirements and user stories
- `research` - Technical research and library comparison

**Implementation:**
- `api-design` - REST/GraphQL API design
- `component-implementation` - UI component creation
- `feature-implementation` - Feature development
- `database-design` - Database schema design

**Quality & Testing:**
- `code-reviewer` - Code quality review
- `quality` - Comprehensive QA (accessibility, security, performance)
- `security-audit` - Security vulnerability assessment
- `testing` - Test creation and strategy

**Operations & Documentation:**
- `devops` - Deployment and CI/CD
- `infrastructure` - Cloud infrastructure
- `documentation` - Technical documentation

**Optimization:**
- `refactoring` - Code restructuring
- `polish` - Performance optimization

All sub-agents integrated from [agents repository](https://github.com/accolver/agents/tree/main/agent)

## Commands

### CLI Commands

```bash
telos init              # Install Telos slash commands and memory files
telos --help            # Show all commands
```

### Slash Commands (AI-Native)

Use these in Claude Code, OpenCode, or Cursor:

```
/telos-init             # Initialize Telos with AI-driven analysis
/telos-quick            # Fast initialization (auto-accept AI proposals)
/telos-validate         # Check code alignment with purpose hierarchy
/telos-status           # Show current Telos configuration
/telos-reset            # Clear and reinitialize
```

## Project Structure

After initialization:

```
your-project/
├── telos/
│   ├── content/
│   │   ├── TELOS.md         # Your project's purpose hierarchy
│   │   ├── AGENTS.md        # Consolidated agent definitions
│   │   ├── LOGOS.md         # Orchestrator instructions
│   │   └── TOOLS.md         # Tool registry and mappings
│   ├── agents/              # Individual agent definitions (L1-L9)
│   │   ├── l9-telos-guardian.md through l1-syntax-linter.md
│   │   ├── sub-agents/      # 15 specialized sub-agents
│   │   └── SUB_AGENT_MAPPING.md  # Sub-agent to level mapping
│   └── templates/           # Platform-specific configs
├── .telos/                  # Runtime state (gitignored)
├── TELOS.md                 # Symlink for visibility
└── [platform symlinks]      # CLAUDE.md, .cursor/rules/, etc.
```

## Philosophy & Theory

### Why Hierarchical Agents?

Flat agent collectives lack governance—agents can work at cross-purposes.
Hierarchical organization with clear level boundaries ensures:

- Strategic coherence (top-down)
- Implementation integrity (bottom-up)
- Efficient specialization (right tool, right level)

### Why Telos?

Without explicit purpose capture, AI assistants optimize for immediate requests,
not ultimate goals. Telos makes purpose explicit and traceable, enabling:

- Alignment validation at every level
- Conflict resolution through purpose appeal
- Emergent strategic consistency

### Why Logos?

Unstructured agent communication devolves into noise. Logos enforces rational
discourse through:

- Spec-driven dialogue (OpenSpec format)
- Structured reporting protocols
- Level-appropriate context filtering

## Examples

See `/examples` for:

- Simple web app initialization
- Existing codebase integration
- Multi-platform usage demonstration

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to this project.

## Philosophy Deep Dive

See [PHILOSOPHY.md](PHILOSOPHY.md) for comprehensive explanation of:

- Aristotelian teleology in software
- Boulding's hierarchy applied to development
- Logos as rational agent orchestration
- Ontological levels and emergence

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.

## License

MIT License - see [LICENSE](LICENSE)

---

**Transform AI-assisted development from reactive tool usage to coherent,
purpose-aligned creation.**

[GitHub Repository](https://github.com/telos-framework/init) |
[Documentation](https://telos-framework.dev) |
[Report Issues](https://github.com/telos-framework/init/issues)
