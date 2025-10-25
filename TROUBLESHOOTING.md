# Troubleshooting Guide

Common issues and solutions for Telos framework.

## Installation Issues

### Issue: `npm install -g telos-framework` fails

**Symptoms**:

```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/local/lib/node_modules
```

**Cause**: Permission issues with global npm install

**Solutions**:

1. **Use npx** (recommended - no global install needed):
   ```bash
   npx telos-framework init
   ```

2. **Fix npm permissions**:
   ```bash
   # macOS/Linux
   sudo chown -R $(whoami) /usr/local/lib/node_modules

   # Or configure npm to use different directory
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Use sudo** (not recommended):
   ```bash
   sudo npm install -g telos-framework
   ```

---

### Issue: `telos: command not found`

**Symptoms**:

```bash
telos init
-bash: telos: command not found
```

**Cause**: Package not in PATH or not installed globally

**Solutions**:

1. **Use npx**:
   ```bash
   npx telos-framework init
   ```

2. **Check if installed**:
   ```bash
   npm list -g telos-framework
   ```

3. **Install globally**:
   ```bash
   npm install -g telos-framework
   ```

4. **Use local installation**:
   ```bash
   npm install telos-framework
   npx telos init
   ```

---

## Initialization Issues

### Issue: Telos init hangs or times out

**Symptoms**:

```
Discovering MCP servers...
[hangs indefinitely]
```

**Cause**: MCP server discovery attempting to connect to unresponsive servers

**Solution**:

```bash
# Skip MCP discovery
telos init --quick

# Or manually configure later
telos rediscover
```

---

### Issue: "Telos already initialized"

**Symptoms**:

```
Error: Telos already initialized in this project
Run 'telos status' to see current configuration
```

**Cause**: `telos/` directory already exists

**Solutions**:

1. **Check current status**:
   ```bash
   telos status
   ```

2. **Reinitialize** (removes existing config):
   ```bash
   rm -rf telos/ .telos/
   telos init
   ```

3. **Update instead**:
   ```bash
   telos rediscover  # Re-scan for tools
   ```

---

### Issue: Interactive prompts don't work

**Symptoms**:

```
? What is the ultimate purpose of your software?
[No cursor, can't type]
```

**Cause**: Terminal doesn't support interactive input (CI/CD, some IDEs)

**Solution**:

```bash
# Use quick mode with defaults
telos init --quick

# Or set environment variable
TELOS_QUICK=1 telos init
```

---

## Platform Issues

### Issue: Symlinks not working on Windows

**Symptoms**:

```
Error: EPERM: operation not permitted, symlink 'telos/content/AGENTS.md' -> 'CLAUDE.md'
```

**Cause**: Windows requires administrator privileges for symlinks

**Solutions**:

1. **Run as Administrator** (recommended):
   ```powershell
   # Right-click terminal -> "Run as Administrator"
   telos init
   ```

2. **Enable Developer Mode** (Windows 10+):
   - Settings → Update & Security → For developers
   - Enable "Developer Mode"
   - Restart terminal
   - Run `telos init`

3. **Use directory junctions** (automatic fallback):
   - Telos automatically tries junctions on Windows
   - Should work without admin rights

4. **Manual copy** (last resort):
   ```powershell
   # Copy files instead of symlinking
   copy telos\content\AGENTS.md CLAUDE.md
   copy telos\content\AGENTS.md .cursor\rules\agents.md

   # Remember to recopy after updates!
   ```

---

### Issue: Multiple platform symlinks conflict

**Symptoms**:

```
Warning: CLAUDE.md and .cursor/rules/agents.md both point to same file
This is intended behavior
```

**Cause**: Not an error - this is correct!

**Solution**: No action needed. All platforms read from same source of truth.

---

## Tool Discovery Issues

### Issue: Tools not detected

**Symptoms**:

```
telos status

Tools: 0 discovered
```

**Cause**: Tools installed after Telos initialization, or not in package.json

**Solutions**:

1. **Rediscover tools**:
   ```bash
   telos rediscover
   ```

2. **Ensure tools are installed**:
   ```bash
   npm install -D eslint prettier vitest
   ```

3. **Check package.json**:
   - Tools must be in `dependencies` or `devDependencies`
   - Global tools won't be detected

---

### Issue: MCP servers not found

**Symptoms**:

```
telos status

MCP Servers: None detected
```

**Cause**: MCP servers not configured in Claude desktop config

**Solutions**:

1. **Configure Claude desktop app** with MCP servers

2. **Manual configuration**:
   ```bash
   # Edit config
   vim ~/.config/claude/claude_desktop_config.json

   # Add servers:
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
       }
     }
   }
   ```

3. **Rediscover**:
   ```bash
   telos rediscover
   ```

---

## Validation Issues

### Issue: `telos validate` fails

**Symptoms**:

```
telos validate

✗ Telos Hierarchy (L9 missing)
✗ Agent Definitions (only 7 agents found)
```

**Cause**: Incomplete initialization or corrupted files

**Solutions**:

1. **Check for missing files**:
   ```bash
   ls telos/content/
   ls telos/agents/
   ```

2. **Regenerate missing files**:
   ```bash
   telos rediscover
   ```

3. **Reinitialize** (if severely corrupted):
   ```bash
   rm -rf telos/ .telos/
   telos init
   ```

---

### Issue: Level validation fails

**Symptoms**:

```
telos validate

L2 Function-Author:
  ✗ 45% coverage (target: 80%)
```

**Cause**: Not an error - this is information about your project state

**Solution**: This is working as intended. Follow the recommendations:

```bash
# Add tests to reach 80% coverage
# Run test suite
npm test

# Validate again
telos validate
```

---

## Agent Usage Issues

### Issue: Agent doesn't use detected tools

**Symptoms**:

- Agent suggests manual workflow
- Doesn't mention ESLint even though it's installed

**Cause**: Tool detection stale or agent definitions not updated

**Solutions**:

1. **Rediscover tools**:
   ```bash
   telos rediscover
   telos status --verbose
   ```

2. **Check agent definition**:
   ```bash
   cat telos/agents/l1-syntax-linter.md
   # Should list ESLint if detected
   ```

3. **Restart AI platform**:
   - Close and reopen Claude/Cursor/VS Code
   - Force reload of agent definitions

---

### Issue: Agents give conflicting advice

**Symptoms**:

- L2 suggests one approach
- L3 suggests incompatible approach

**Cause**: Agents not aware of each other's context

**Solution**: This shouldn't happen in Telos. Report as bug if it does.

```bash
# Ensure using latest version
npm update -g telos-framework

# Check TELOS.md for consistency
cat telos/content/TELOS.md

# Validate hierarchy
telos validate
```

---

## Performance Issues

### Issue: `telos init` is very slow

**Symptoms**:

- Takes >5 minutes to initialize

**Cause**: Large codebase or many MCP servers

**Solutions**:

1. **Use quick mode**:
   ```bash
   telos init --quick
   ```

2. **Disable MCP discovery**:
   ```bash
   # Set environment variable
   SKIP_MCP=1 telos init
   ```

3. **Initialize in smaller directory**:
   ```bash
   cd src/  # Smaller subset
   telos init
   cd ..
   mv src/telos ./telos
   ```

---

### Issue: `telos validate` is slow

**Symptoms**:

- Validation takes >30 seconds

**Cause**: Running actual tools (linters, tests) for validation

**Solution**: This is expected. Validation runs:

- Linters (L1)
- Tests (L2-L5)
- Various checks

To speed up:

```bash
# Skip tool execution, only check files exist
telos validate --fast

# Or validate specific level
telos validate --level L1
```

---

## Git Issues

### Issue: Large `.telos/` directory

**Symptoms**:

```
.telos/ directory is 500MB
```

**Cause**: State file accumulating large history

**Solution**:

```bash
# .telos/ should be in .gitignore
echo ".telos/" >> .gitignore

# Clean state
rm -rf .telos/
telos init
```

**Note**: `.telos/` is runtime state - should NOT be committed to git.

---

### Issue: Merge conflicts in `telos/`

**Symptoms**:

```
CONFLICT (content): Merge conflict in telos/content/TELOS.md
```

**Cause**: Team members have different Telos configurations

**Solutions**:

1. **Team should coordinate** on single TELOS.md:
   ```bash
   # Designate one person to define Telos
   # Others pull and use their version
   ```

2. **Resolve conflict** manually:
   ```bash
   # Edit telos/content/TELOS.md
   # Choose one version or merge
   git add telos/content/TELOS.md
   git commit
   ```

3. **Regenerate** if severely conflicted:
   ```bash
   git checkout --theirs telos/content/TELOS.md
   # Or
   git checkout --ours telos/content/TELOS.md

   telos rediscover
   ```

---

## Documentation Issues

### Issue: PHILOSOPHY.md vs TELOS.md confusion

**Symptoms**:

- "Which file do I edit?"

**Answer**:

- **PHILOSOPHY.md**: Telos framework theory (read-only, part of npm package)
- **TELOS.md**: YOUR project's purpose (edit this)
- **telos/content/TELOS.md**: Master version (source of truth)
- **TELOS.md** (root): Symlink to above (don't edit, edit source)

**Solution**: Always edit `telos/content/TELOS.md`, not the symlink.

---

### Issue: Agent files are huge

**Symptoms**:

```
telos/agents/l2-function-author.md is 50KB
```

**Cause**: Adaptive agent with many tool conditionals

**Solution**: This is normal. The file is generated and includes:

- Tool-specific instructions
- Fallback workflows
- Examples
- Reporting protocols

To reduce size:

```bash
# Use quick mode (less detailed)
rm -rf telos/
telos init --quick
```

---

## Reporting Bugs

If you encounter an issue not listed here:

1. **Check existing issues**:
   - https://github.com/telos-framework/init/issues

2. **Gather information**:
   ```bash
   telos status --verbose > telos-debug.txt
   npm list telos-framework >> telos-debug.txt
   node --version >> telos-debug.txt
   ```

3. **Create minimal reproduction**:
   ```bash
   mkdir test-project
   cd test-project
   npm init -y
   telos init
   # [observe issue]
   ```

4. **Report issue** with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Debug output from step 2
   - OS and Node version

---

## Getting Help

- **Documentation**: Start with [README.md](README.md),
  [PHILOSOPHY.md](PHILOSOPHY.md), [USAGE.md](USAGE.md)
- **Examples**: See `/examples` directory
- **Issues**: https://github.com/telos-framework/init/issues
- **Discussions**: https://github.com/telos-framework/init/discussions

---

## Common Misunderstandings

### "Do I need to use all 9 levels?"

**Answer**: Yes, but they're automatic. When you request a feature, Logos
orchestrator coordinates all 9 levels. You don't manually invoke each level.

### "Can I skip the philosophy and just use the tools?"

**Answer**: The tools are grounded in the philosophy. Without understanding
purpose alignment, you're just using another build tool. Read
[PHILOSOPHY.md](PHILOSOPHY.md) for the "why" behind the "what".

### "Is this only for AI development?"

**Answer**: No! Telos can be used for any software project. The AI agents are
helpers, not requirements. You can use Telos principles with human-only
development.

### "Do I need Claude specifically?"

**Answer**: No. Telos works with Claude, Cursor, Copilot, Gemini, or any AI
platform (or none). It's platform-agnostic.

---

**Still stuck? Open an issue: https://github.com/telos-framework/init/issues**
