# Telos CLI Usage Guide

## Commands

### `telos init`

Initialize Telos in your project with interactive discovery.

```bash
telos init [options]
```

**Options:**

- `-q, --quick` - Quick initialization with sensible defaults (skips interactive
  prompts)
- `-v, --verbose` - Show detailed output during initialization

**What it does:**

1. **Phase 1: Telos Discovery** - Interactive questions to capture your
   project's ultimate purpose
2. **Phase 2: Project Scan** - Detects languages, frameworks, and existing code
3. **Phase 3: Tool Discovery** - Finds available MCP servers and development
   tools
4. **Phase 4: Agent Generation** - Creates 9 specialized agents adapted to your
   tools
5. **Phase 5: Platform Setup** - Configures symlinks for your AI platform
   (Claude, Cursor, etc.)

**Example:**

```bash
# Interactive initialization
telos init

# Quick start with defaults
telos init --quick

# Verbose output
telos init --verbose
```

---

### `telos status`

Show current Telos configuration and initialization status.

```bash
telos status [options]
```

**Options:**

- `-v, --verbose` - Show detailed configuration including Telos hierarchy
  preview

**What it shows:**

- Initialization status
- Number of agents configured
- Number of tools discovered
- Platform configuration
- Initialization timestamp

**Example:**

```bash
# Basic status
telos status

# Detailed status with Telos preview
telos status --verbose
```

---

### `telos rediscover`

Re-run tool discovery and update agent configurations.

Use this command after:

- Installing new development tools
- Adding new MCP servers
- Changing project dependencies

```bash
telos rediscover [options]
```

**Options:**

- `-v, --verbose` - Show detailed discovery output

**What it does:**

1. Re-scans project for languages and frameworks
2. Re-discovers MCP servers
3. Updates tool mappings
4. Regenerates TOOLS.md
5. Updates agent configurations with new tools

**Example:**

```bash
# Rediscover tools
telos rediscover

# Verbose rediscovery
telos rediscover --verbose
```

---

### `telos validate`

Validate Telos alignment across the project.

```bash
telos validate [options]
```

**Options:**

- `-v, --verbose` - Show detailed validation results

**What it validates:**

- Telos hierarchy structure (L9 → L1)
- Agent definitions (all 9 agents present)
- Tool configuration (TOOLS.md exists)
- Platform setup (AGENTS.md and symlinks)

**Example:**

```bash
# Run validation
telos validate

# Detailed validation
telos validate --verbose
```

**Exit codes:**

- `0` - All validations passed
- `1` - One or more validations failed

---

## Typical Workflows

### First-Time Setup

```bash
# Clone telos into your project
cd your-project
git clone https://github.com/yourusername/telos.git .telos-framework
cd .telos-framework

# Initialize with interactive discovery
npm install
npm link
cd ..
telos init

# Check status
telos status
```

### Quick Setup (Existing Project)

```bash
cd your-project
telos init --quick
telos validate
```

### Adding New Tools

```bash
# Install new tool (e.g., Playwright)
npm install -D @playwright/test

# Rediscover tools
telos rediscover

# Verify update
telos status
```

### Continuous Validation

```bash
# Add to your CI/CD pipeline
telos validate || exit 1
```

---

## Configuration Files

After initialization, Telos creates:

```
your-project/
├── .telos/
│   ├── config.json          # Runtime configuration
│   └── state.json           # Orchestrator state
├── telos/
│   ├── content/
│   │   ├── TELOS.md        # Purpose hierarchy
│   │   ├── AGENTS.md       # Consolidated agents
│   │   ├── LOGOS.md        # Orchestrator docs
│   │   └── TOOLS.md        # Tool inventory
│   └── agents/
│       ├── l1-syntax-linter.md
│       ├── l2-function-author.md
│       └── ... (9 total)
└── TELOS.md                 # Symlink to telos/content/TELOS.md
```

---

## Getting Help

```bash
# Show all commands
telos --help

# Show command-specific help
telos init --help
telos status --help
telos rediscover --help
telos validate --help
```

---

## Troubleshooting

### Telos Not Initialized

**Error:** `✗ Telos not initialized`

**Solution:**

```bash
telos init
```

### Tool Discovery Issues

**Error:** Tools not being detected

**Solution:**

```bash
# Ensure package.json exists
# Install tools via package manager
npm install -D eslint vitest

# Rediscover
telos rediscover
```

### Validation Failures

**Error:** `✗ Agent Definitions`

**Solution:**

```bash
# Re-run initialization
telos init

# Or regenerate agents
telos rediscover
```

### Platform Symlink Issues (Windows)

**Error:** Symlinks not working on Windows

**Solution:**

- Run terminal as Administrator
- Or use directory junctions (automatically attempted)
- Or manually copy `telos/content/AGENTS.md` to platform-specific location

---

## Advanced Usage

### Custom Platform Configuration

Edit `.telos/config.json` to customize platform-specific settings:

```json
{
  "platform": "claude",
  "timestamp": "2024-10-24T...",
  "symlinks": {
    "CLAUDE.md": "telos/content/AGENTS.md",
    "TELOS.md": "telos/content/TELOS.md"
  }
}
```

### Manual Tool Addition

Edit `telos/content/TOOLS.md` to manually add tools, then:

```bash
telos rediscover
```

### Agent Customization

Edit individual agent files in `telos/agents/` to customize behavior. After
editing:

```bash
# Regenerate consolidated AGENTS.md
telos rediscover
```

---

For more information, see:

- [README.md](./README.md) - Philosophy and overview
- [PHILOSOPHY.md](./PHILOSOPHY.md) - Theoretical foundation (if exists)
- [GitHub Issues](https://github.com/yourusername/telos/issues) - Bug reports
  and feature requests
