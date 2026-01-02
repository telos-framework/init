# Telos: Purpose-Driven Multi-Agent Development Framework

[![npm version](https://badge.fury.io/js/telos-framework.svg)](https://www.npmjs.com/package/telos-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/telos-framework)](https://nodejs.org)
[![Tests](https://img.shields.io/badge/tests-116%20passing-brightgreen)]()

A philosophically-grounded AI framework that embeds purpose hierarchy and
spec-driven development into AI-assisted coding. Every line of code traces back
to requirements, and every requirement traces back to ultimate purpose.

## Philosophy

**Telos** (Greek: τέλος) means "end," "purpose," or "goal"—the ultimate reason
something exists.

**Logos** (Greek: λόγος) means "reason," "discourse," or "rational
principle"—the organizing intelligence that maintains coherent order.

Once you install the Telos framework, your AI coding assistant becomes the Logos
orchestrator itself. It ensures that:

1. **Every feature has a spec** before code is written
2. **Every function links to a requirement** via `@telos` annotation
3. **Every requirement traces to purpose** through the spec hierarchy
4. **Every change is validated** against the spec structure

## Quick Start

```bash
npx telos-framework init
```

This command:

- Detects your AI coding platform (Claude Code, OpenCode, Cursor, etc.)
- Installs platform-specific configuration (CLAUDE.md, AGENTS.md, etc.)
- Sets up Telos + SDD instructions for your AI assistant

After installation, your AI assistant automatically:

- Creates specs before implementing features
- Adds `@telos` annotations to code
- Generates tests from spec scenarios
- Validates changes before commits

> **That's it!** No explicit commands needed for normal development. Your AI
> reads the installed instructions and follows the Telos workflow automatically.

## How It Works

### The Spec Hierarchy (4 Levels)

```
L4: Purpose ─────────────────────────────────────────────────────┐
│   Why does this project exist? Success metrics?               │
│                                                                │
├── L3: Experience ─────────────────────────────────────────────┤
│   User journeys, UX requirements, analytics needs             │
│                                                                │
├── L2: Contract ───────────────────────────────────────────────┤
│   API contracts, component interfaces, service boundaries     │
│                                                                │
└── L1: Function ───────────────────────────────────────────────┤
    Individual functions with TDD scenarios                      │
└────────────────────────────────────────────────────────────────┘
```

### Code-to-Spec Linking

Every function must have a `@telos` annotation:

```typescript
// @telos L1:function:src/auth/validation:validateToken
export function validateToken(token: string): TokenValidation {
  // implementation
}
```

Every test must link to the same spec:

```typescript
// @telos-test L1:function:src/auth/validation:validateToken
describe("validateToken", () => {
  // @telos-scenario L1:function:src/auth/validation:validateToken:valid-token
  it("should validate properly signed tokens", () => {
    // test implementation
  });
});
```

### TDD Workflow

1. **Spec First**: Create spec with requirements and scenarios
2. **Generate Tests**: Tests are generated from spec scenarios
3. **Red**: Tests fail (no implementation yet)
4. **Implement**: Write code with `@telos` annotation
5. **Green**: Tests pass
6. **Validate**: Run `npx telos validate` before commit

## Installation

### New Projects

```bash
# Initialize Telos in your project
npx telos-framework init

# Initialize the spec structure
npx telos spec init
```

### Existing Projects (Brownfield)

```bash
# Initialize Telos
npx telos-framework init

# Discover and generate specs from existing code
npx telos discover
```

This scans your codebase and proposes a spec structure based on:

- README and documentation
- API routes and endpoints
- Components and modules
- Function signatures

## CLI Commands

### Core Commands

```bash
telos init              # Install Telos to your project
telos spec init         # Initialize SDD spec structure
telos discover          # Generate specs from existing code
telos validate          # Validate specs, links, tests, orphans
```

### Spec Management

```bash
telos spec create <level> <name>    # Create a new spec (level 1-4)
telos spec tree                     # Show spec hierarchy
telos spec generate-tests <spec-id> # Generate test skeletons
```

### Context & Coverage

```bash
telos context <spec-id>   # Load recursive context for AI
telos coverage            # Show spec and test coverage
telos orphans             # Find code without @telos annotations
telos lineage <spec-id>   # Show full lineage from L4 to spec
```

### Enforcement

```bash
telos hooks install       # Install pre-commit validation hooks
telos hooks uninstall     # Remove hooks
telos ci github           # Generate GitHub Actions workflow
telos ci gitlab           # Generate GitLab CI config
```

## Project Structure

After initialization:

```
your-project/
├── telos/
│   ├── TELOS.md                 # Entry point and navigation
│   ├── .telosrc.json            # Configuration
│   ├── index.json               # Spec registry (auto-generated)
│   └── specs/
│       ├── L4-purpose/
│       │   └── purpose.md       # Project purpose + metrics
│       ├── L3-experience/
│       │   └── *.md             # User journey specs
│       ├── L2-contract/
│       │   └── *.md             # API/component contracts
│       └── L1-function/
│           └── *.md             # Function specs with TDD scenarios
├── AGENTS.md                    # AI assistant instructions
├── CLAUDE.md                    # Claude-specific instructions
└── src/
    └── **/*.ts                  # Code with @telos annotations
```

## Multi-Platform Support

Works with any AI coding assistant:

- Claude (Code, Projects)
- OpenCode
- Cursor
- Cline
- Windsurf
- GitHub Copilot
- Google Gemini

Single source of truth with platform-specific configuration files.

## Validation

Run validation before commits:

```bash
npx telos validate
```

This checks:

| Check       | Description                                   |
| ----------- | --------------------------------------------- |
| **Specs**   | Structure integrity, parent-child links       |
| **Links**   | All `@telos` annotations point to valid specs |
| **Tests**   | All L1 specs have `@telos-test` annotations   |
| **Orphans** | All functions have `@telos` annotations       |

### Exit Codes

- `0` - All validations passed
- `1` - One or more validations failed (blocks commit/CI)

### Pre-commit Hooks

```bash
# Install automatic validation
npx telos hooks install
```

### CI Integration

```bash
# Generate GitHub Actions workflow
npx telos ci github

# Generate GitLab CI config
npx telos ci gitlab
```

## Configuration

Configure enforcement in `telos/.telosrc.json`:

```json
{
  "enforcement": {
    "specs": "hard",
    "links": "hard",
    "tests": "hard",
    "orphans": "hard"
  },
  "languages": {
    "typescript": {
      "testPatterns": ["**/*.test.ts", "**/*.spec.ts"]
    }
  }
}
```

## Examples

See `/examples` for:

- Simple web app initialization
- Existing codebase integration
- Multi-platform usage demonstration

## Philosophy Deep Dive

See [PHILOSOPHY.md](PHILOSOPHY.md) for:

- Aristotelian teleology in software
- Boulding's hierarchy applied to development
- Why spec-driven development matters

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute.

## License

MIT License - see [LICENSE](LICENSE)

---

**Transform AI-assisted development from vibe-coding to purpose-driven,
spec-traced creation.**

[GitHub Repository](https://github.com/telos-framework/init) |
[Documentation](https://telos-framework.dev) |
[Report Issues](https://github.com/telos-framework/init/issues)
