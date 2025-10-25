# Contributing to Telos

Thank you for your interest in contributing to Telos! This document provides
guidelines for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [How to Contribute](#how-to-contribute)
5. [Coding Standards](#coding-standards)
6. [Testing Requirements](#testing-requirements)
7. [Documentation](#documentation)
8. [Pull Request Process](#pull-request-process)
9. [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.
Please be respectful and constructive in your interactions.

### Our Standards

**Positive behaviors**:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behaviors**:

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- Git
- Basic understanding of:
  - JavaScript/Node.js
  - Multi-agent systems
  - The philosophy behind Telos (read [PHILOSOPHY.md](PHILOSOPHY.md))

### First Steps

1. **Read the documentation**:
   - [README.md](README.md) - Project overview
   - [PHILOSOPHY.md](PHILOSOPHY.md) - Theoretical foundations
   - [AGENTS.md](AGENTS.md) - Agent architecture
   - [USAGE.md](USAGE.md) - Usage guide

2. **Explore the codebase**:
   ```bash
   git clone https://github.com/telos-framework/init.git
   cd init
   npm install
   npm test
   ```

3. **Try the system**:
   ```bash
   npm link
   cd /tmp/test-project
   telos init
   ```

---

## Development Setup

### Clone and Install

```bash
# Clone repository
git clone https://github.com/telos-framework/init.git
cd init

# Install dependencies
npm install

# Run tests
npm test

# Link for local development
npm link
```

### Project Structure

```
init/
├── bin/              # CLI entry point
├── lib/              # Core implementation
│   ├── commands/     # CLI commands (init, status, validate, etc.)
│   ├── discovery/    # Telos and tool discovery
│   ├── generators/   # Markdown generators
│   ├── integration/  # Tool integration layer
│   ├── platform/     # Platform compatibility
│   └── spec/         # Spec translation and validation
├── logos/            # Orchestrator implementation
├── test/             # Test suite
├── examples/         # Example usage
└── package.json
```

### Development Workflow

```bash
# Make changes to code
vim lib/commands/init.js

# Run tests
npm test

# Test manually
npm link
cd /tmp/test
telos init

# Unlink when done
npm unlink -g telos-framework
```

---

## How to Contribute

### Types of Contributions

We welcome:

1. **Bug Fixes**: Found a bug? Please report and fix!
2. **Feature Enhancements**: Improvements to existing features
3. **New Features**: Aligned with Telos philosophy
4. **Documentation**: Improvements, clarifications, examples
5. **Tests**: Additional test coverage
6. **Examples**: Real-world usage demonstrations
7. **Philosophy**: Refinements to theoretical foundations

### Finding Work

- Check [Issues](https://github.com/telos-framework/init/issues)
- Look for labels:
  - `good first issue` - Good for newcomers
  - `help wanted` - We need help!
  - `documentation` - Doc improvements
  - `bug` - Something isn't working
  - `enhancement` - New feature or request

### Before You Start

1. **Check existing issues/PRs**: Avoid duplicate work
2. **Open an issue first**: Discuss major changes before implementation
3. **Understand the philosophy**: Changes should align with Telos principles
4. **Ask questions**: We're here to help!

---

## Coding Standards

### JavaScript Style

- **Linting**: Code must pass ESLint
- **Formatting**: Use Prettier (already configured)
- **Modern JS**: Use ES6+ features where appropriate
- **No comments**: Code should be self-documenting (unless complex algorithm)

```bash
# Format code
npx prettier --write lib/

# Lint code
npx eslint lib/
```

### Naming Conventions

- **Files**: `kebab-case.js`
- **Functions**: `camelCase()`
- **Classes**: `PascalCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Private**: Prefix with `_` if truly private

### Module Structure

```javascript
// 1. Imports
const fs = require("fs").promises;
const path = require("path");

// 2. Constants
const DEFAULT_CONFIG = {/* ... */};

// 3. Main functions
async function mainFunction() {
  // ...
}

// 4. Helper functions
function helperFunction() {
  // ...
}

// 5. Exports
module.exports = { mainFunction };
```

### Error Handling

```javascript
// Good: Specific error messages
if (!telosPath) {
  throw new Error("Telos not initialized. Run: telos init");
}

// Bad: Generic errors
if (!telosPath) {
  throw new Error("Error");
}
```

### Async/Await

Prefer `async/await` over callbacks or raw promises:

```javascript
// Good
async function loadConfig() {
  const content = await fs.readFile(configPath, "utf8");
  return JSON.parse(content);
}

// Avoid
function loadConfig(callback) {
  fs.readFile(configPath, "utf8", (err, content) => {
    // ...
  });
}
```

---

## Testing Requirements

### Test Coverage

- All new code must have tests
- Aim for >80% coverage
- Critical paths require 100% coverage

### Test Structure

```javascript
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("Feature Name", () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it("should do something specific", () => {
    // Arrange
    const input = "test";

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe("expected");
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Specific file
npx vitest run test/integration.test.js
```

### Test Types

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test module interactions
3. **CLI Tests**: Test command-line interface
4. **E2E Tests**: Test full workflows (future)

---

## Documentation

### Code Documentation

- **Self-documenting code**: Prefer clear names over comments
- **Complex logic**: Add explanatory comments
- **Public APIs**: Document parameters and return values

```javascript
/**
 * Generates Telos hierarchy from user input
 * @param {string} ultimatePurpose - L9 purpose statement
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Hierarchy with all 9 levels
 */
async function generateHierarchy(ultimatePurpose, options = {}) {
  // ...
}
```

### Markdown Documentation

- Use ATX-style headers (`#`, `##`, not underlines)
- Include code examples
- Link to related docs
- Keep line length reasonable (no hard limit)

### Adding Examples

Examples go in `/examples` directory:

```markdown
# Example: Simple Web App Initialization

This example shows initializing Telos for a new Express.js web app.

## Steps

1. Create project...
2. Run telos init...
3. ...

## Expected Output

\`\`\` ... \`\`\`
```

---

## Pull Request Process

### 1. Fork and Branch

```bash
# Fork repository on GitHub

# Clone your fork
git clone https://github.com/YOUR-USERNAME/init.git
cd init

# Create branch
git checkout -b feature/my-feature
# or
git checkout -b fix/bug-description
```

### 2. Make Changes

```bash
# Make your changes
vim lib/commands/new-command.js

# Add tests
vim test/new-command.test.js

# Run tests
npm test

# Format code
npx prettier --write .
```

### 3. Commit

Use conventional commit messages:

```bash
# Format: type(scope): description

# Examples:
git commit -m "feat(cli): add export command for sharing configs"
git commit -m "fix(discovery): handle missing package.json gracefully"
git commit -m "docs(readme): clarify installation steps"
git commit -m "test(integration): add MCP client timeout tests"
git commit -m "refactor(orchestrator): simplify state management"
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `test`: Adding/updating tests
- `refactor`: Code change that neither fixes bug nor adds feature
- `perf`: Performance improvement
- `chore`: Build process or auxiliary tool changes

### 4. Push and Create PR

```bash
# Push to your fork
git push origin feature/my-feature

# Create PR on GitHub
# - Fill out the PR template
# - Reference related issues
# - Describe changes clearly
# - Add screenshots if UI changes
```

### 5. PR Review Process

- **Automated checks**: Tests must pass
- **Code review**: Maintainer will review
- **Feedback**: Address review comments
- **Approval**: Once approved, we'll merge

### PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Tests passing
- [ ] Code formatted (Prettier)
- [ ] Linter passing
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

---

## Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas, general discussion
- **Pull Requests**: Code contributions

### Getting Help

- **Documentation**: Check docs first
- **Issues**: Search existing issues
- **Discussions**: Ask in GitHub Discussions
- **Philosophy questions**: Reference PHILOSOPHY.md

### Recognition

Contributors are recognized in:

- Release notes
- README contributors section (planned)
- Git history

---

## Advanced: Contributing to Philosophy

Telos is grounded in philosophical principles. If you want to contribute to the
theoretical foundations:

### Requirements

1. **Understanding**: Deep familiarity with:
   - Aristotelian teleology
   - Boulding's hierarchy
   - Systems thinking
   - Software development

2. **Alignment**: Proposals must align with core principles

3. **Rigor**: Philosophical contributions require:
   - Clear argumentation
   - References to primary sources
   - Concrete software implications

### Process

1. Open an issue labeled `philosophy`
2. Propose changes with:
   - Problem statement
   - Philosophical argument
   - Concrete implications for Telos
   - Examples
3. Discussion and refinement
4. PR with PHILOSOPHY.md updates

---

## Release Process (Maintainers Only)

```bash
# Update version
npm version patch|minor|major

# Update CHANGELOG.md

# Push with tags
git push --tags

# Publish
npm publish

# Create GitHub release
```

---

## Questions?

Open an issue or discussion on GitHub!

---

**Thank you for contributing to Telos! Every contribution helps make
purpose-driven development a reality.**
