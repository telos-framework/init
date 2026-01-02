# Telos: Purpose-Driven Multi-Agent Development Framework

[![npm version](https://badge.fury.io/js/telos-framework.svg)](https://www.npmjs.com/package/telos-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/telos-framework)](https://nodejs.org)

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

This one command:

- Detects your AI coding platform (Claude Code, OpenCode, Cursor, etc.)
- Installs slash commands and platform-specific configuration
- Sets up the spec-driven development structure

After installation, open your project in your AI coding assistant and run:

```
/telos:init
```

> **That's it!** Your AI assistant now follows the Telos workflow automatically.

## How It Works

### The Spec Hierarchy (4 Levels)

| Level | Name       | Description                                     |
| ----- | ---------- | ----------------------------------------------- |
| L4    | Purpose    | Why does this project exist? Success metrics?   |
| L3    | Experience | User journeys, UX requirements, analytics needs |
| L2    | Contract   | API contracts, component interfaces, boundaries |
| L1    | Function   | Individual functions with TDD scenarios         |

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
2. **Generate Tests**: AI generates tests from spec scenarios
3. **Red**: Tests fail (no implementation yet)
4. **Implement**: AI writes code with `@telos` annotation
5. **Green**: Tests pass
6. **Validate**: AI validates before commit

## Installation

### New Projects

```bash
npx telos-framework init
```

Then in your AI coding assistant:

```
/telos:init
```

### Existing Projects (Brownfield)

```bash
npx telos-framework init
```

Then in your AI coding assistant:

```
/telos:sdd-discover
```

This scans your codebase and proposes a spec structure based on existing code.

## Slash Commands

All interaction happens through slash commands in your AI coding assistant.

### Claude Code

| Command                     | Description                        |
| --------------------------- | ---------------------------------- |
| `/telos:init`               | Initialize Telos with AI guidance  |
| `/telos:quick`              | Quick init (auto-accept proposals) |
| `/telos:validate`           | Validate specs, links, tests       |
| `/telos:status`             | Show current configuration         |
| `/telos:sdd-discover`       | Generate specs from existing code  |
| `/telos:sdd-context`        | Load spec context before changes   |
| `/telos:sdd-generate-tests` | Generate tests from spec scenarios |

### OpenCode

| Command                     | Description                        |
| --------------------------- | ---------------------------------- |
| `/telos-init`               | Initialize Telos with AI guidance  |
| `/telos-quick`              | Quick init (auto-accept proposals) |
| `/telos-validate`           | Validate specs, links, tests       |
| `/telos-status`             | Show current configuration         |
| `/telos-sdd-discover`       | Generate specs from existing code  |
| `/telos-sdd-context`        | Load spec context before changes   |
| `/telos-sdd-generate-tests` | Generate tests from spec scenarios |

### Other Platforms

For Cursor, Cline, Windsurf, and other platforms, ask your AI assistant:

- "Initialize Telos" or "Run Telos init"
- "Validate my specs"
- "Generate specs from my code"

The AI reads the installed configuration and knows what to do.

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
├── .claude/commands/telos/      # Slash commands (Claude Code)
├── AGENTS.md                    # AI assistant instructions
├── CLAUDE.md                    # Claude-specific instructions
└── src/
    └── **/*.ts                  # Code with @telos annotations
```

## Multi-Platform Support

Works with any AI coding assistant:

- Claude Code
- OpenCode
- Cursor
- Cline
- Windsurf
- GitHub Copilot
- Google Gemini

Single source of truth with platform-specific configuration files.

## Validation

Your AI assistant validates before commits:

| Check       | Description                                   |
| ----------- | --------------------------------------------- |
| **Specs**   | Structure integrity, parent-child links       |
| **Links**   | All `@telos` annotations point to valid specs |
| **Tests**   | All L1 specs have `@telos-test` annotations   |
| **Orphans** | All functions have `@telos` annotations       |

Run `/telos:validate` (Claude) or `/telos-validate` (OpenCode) to check.

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
[Report Issues](https://github.com/telos-framework/init/issues)
