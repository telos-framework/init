# Example: Multi-Platform Usage

This example demonstrates using Telos across different AI coding platforms
simultaneously.

## Scenario

You're a developer who:

- Uses **Claude Code** for complex refactoring
- Uses **Cursor** for quick edits and exploration
- Uses **GitHub Copilot** in VS Code for autocomplete
- Occasionally uses **Gemini** for research

You want all platforms to operate within the Telos framework coherently.

## The Problem

Without Telos, each platform operates in isolation:

```
Claude Code: Refactors component (doesn't know about purpose)
    ↓
Cursor: Adds feature (doesn't know about refactor)
    ↓
Copilot: Suggests code (doesn't know about either)
    ↓
Result: Incoherent codebase
```

## The Solution

Telos creates a **single source of truth** with platform-specific symlinks.

## Setup

### 1. Initialize Telos

```bash
cd your-project
telos init
```

When asked about platform:

```
? Which AI platform are you using?
❯ Multiple platforms

? Select all platforms you use:
  [x] Claude (Code/Projects)
  [x] Cursor
  [x] GitHub Copilot
  [ ] Gemini Code Assist
  [x] Other (I'll configure manually)
  
> Confirm
```

### 2. Generated Structure

Telos creates platform-specific symlinks:

```
your-project/
├── telos/
│   └── content/
│       ├── TELOS.md          # Source of truth
│       ├── AGENTS.md         # Source of truth
│       ├── LOGOS.md          # Source of truth
│       └── TOOLS.md          # Source of truth
│
├── TELOS.md                   # Symlink (all platforms can read)
│
├── CLAUDE.md                  # Symlink → telos/content/AGENTS.md
│                              # Claude Code reads this
│
├── .cursor/
│   └── rules/
│       └── agents.md          # Symlink → ../../telos/content/AGENTS.md
│                              # Cursor reads this
│
├── .github/
│   └── copilot-instructions.md # Symlink → ../telos/content/AGENTS.md
│                               # Copilot reads this
│
└── .gemini/
    └── instructions.md         # Symlink → ../telos/content/AGENTS.md
                               # Gemini reads this
```

### 3. Verify Symlinks

```bash
# Check all symlinks
ls -la CLAUDE.md
ls -la .cursor/rules/agents.md
ls -la .github/copilot-instructions.md

# All should point to:
# -> telos/content/AGENTS.md
```

## Usage Across Platforms

### Scenario 1: Refactoring in Claude Code

**Claude Code Session**:

You: "Refactor the authentication system to use JWT"

Claude reads `CLAUDE.md` (→ `AGENTS.md`):

```markdown
# L4: Integration-Contractor

Your mandate: Maintain service contracts and system boundaries

Current system:

- Session-based auth
- Express session middleware

Tools available:

- API testing (supertest)
- Integration tests

Purpose alignment: This change serves L9: "Enable secure team collaboration"
```

Claude performs refactoring:

1. Validates against L9 purpose ✓
2. Defines new API contract (L4)
3. Implements JWT functions (L2)
4. Updates integration tests (L4)
5. Validates syntax (L1)

Changes committed to git.

### Scenario 2: Quick Edit in Cursor

**Cursor Session** (same project, later):

You: "Add rate limiting to the auth endpoints"

Cursor reads `.cursor/rules/agents.md` (→ same `AGENTS.md`):

```markdown
# L4: Integration-Contractor

Current system:

- JWT-based auth (recently changed)
- Express server

Purpose alignment: Rate limiting serves L9: "Enable secure team collaboration"
```

Cursor knows about the JWT refactoring because it reads the same source of
truth!

Cursor implements:

1. Validates purpose alignment ✓
2. Adds rate limiting middleware (L4)
3. Updates integration tests
4. Maintains API contracts

### Scenario 3: Autocomplete in VS Code (Copilot)

**VS Code Session** (same project):

You start typing:

```javascript
function validateJwtToken
```

Copilot reads `.github/copilot-instructions.md` (→ same `AGENTS.md`):

```markdown
# L2: Function-Author

Project uses JWT authentication Test framework: Vitest Follow TDD workflow
```

Copilot suggests:

```javascript
function validateJwtToken(token) {
  // Knows about JWT from shared context
  // Suggests implementation matching project patterns
  // Includes error handling
}
```

### Scenario 4: Research in Gemini

You ask Gemini:

"Should we cache JWT tokens in Redis?"

Gemini could read `.gemini/instructions.md` if configured, seeing:

```markdown
# L9: Telos-Guardian

Ultimate Purpose: Enable secure team collaboration

L4 Integration-Contractor note: Current auth: JWT-based Infrastructure: Express,
Node.js

L8 Market-Analyst: Performance target: <100ms auth check
```

Gemini provides purpose-aligned answer considering your constraints.

## How It Works

### Single Source of Truth

```
telos/content/AGENTS.md  <-- Master file
         ↑
         |
    All platforms read via symlinks
         |
    ┌────┴────┬────────┬─────────┐
    |         |        |         |
CLAUDE.md  Cursor  Copilot   Gemini
```

Any update to `telos/content/AGENTS.md` is immediately visible to all platforms.

### Update Flow

When you run `telos rediscover`:

```bash
telos rediscover
```

Process:

1. Re-scans project for new tools
2. Updates `telos/content/TOOLS.md`
3. Regenerates `telos/content/AGENTS.md`
4. All platform symlinks automatically see updates
5. Next AI interaction uses updated context

### Platform-Specific Considerations

#### Claude Code/Projects

**Reads**: `CLAUDE.md` at project root

**Format**: Standard markdown with agent definitions

**Special features**:

- Can access entire context
- Understands hierarchical structure
- Follows Logos orchestration

#### Cursor

**Reads**: `.cursor/rules/agents.md`

**Format**: Same markdown, Cursor interprets as rules

**Special features**:

- Applies as coding rules
- Enforces during autocomplete
- Used in AI chat context

#### GitHub Copilot

**Reads**: `.github/copilot-instructions.md`

**Format**: Simplified for autocomplete context

**Special features**:

- Influences code suggestions
- Maintains consistency
- Less hierarchical interpretation

#### Gemini Code Assist

**Reads**: `.gemini/instructions.md` (if configured)

**Format**: Standard markdown

**Note**: May require manual configuration in your IDE

## Consistency Guarantees

### What's Consistent

✅ **Purpose**: All platforms know L9 purpose\
✅ **Tool availability**: All see same TOOLS.md\
✅ **Code standards**: All enforce same L1 rules\
✅ **Architecture**: All understand L4 boundaries

### What's Different

Each platform has different strengths:

- **Claude**: Best for complex multi-level reasoning
- **Cursor**: Best for rapid iteration
- **Copilot**: Best for autocomplete
- **Gemini**: Best for research/exploration

But all operate within the same Telos framework.

## Workflow Example: Adding a Feature

### 1. Planning (Claude Code)

```
You: "Plan a user notification system"

Claude (reads CLAUDE.md):
[L9 validates alignment with purpose]
[L8 defines business metrics]
[L7 specifies analytics needs]
[L6 designs UX]
[L5 maps user journey]
[L4 defines API contracts]
[L3 identifies components]
[L2 lists functions needed]
[L1 sets code standards]

Creates: openspec/changes/add-notifications/proposal.md
```

### 2. Implementation (Cursor)

```
You: "Implement the notification system from the spec"

Cursor (reads .cursor/rules/agents.md):
[Sees the same L1-L9 context]
[Reads the OpenSpec proposal]
[Implements following the spec]
[L2 writes functions with tests]
[L3 creates components]
[L4 builds API endpoints]
```

### 3. Refinement (Copilot)

As you code in VS Code:

```javascript
// Copilot autocomplete suggestions align with:
// - L1 code standards
// - L2 function patterns
// - L4 API contracts
// All because it reads the same context
```

### 4. Validation (Claude)

```
You: "Validate the notification system"

Claude (reads CLAUDE.md):
[Bottom-up validation cascade]
[L1 → L2 → L3 → L4 → L5 → L6 → L7 → L8 → L9]
[All levels validated ✓]
```

## Advanced: Platform-Specific Extensions

### Claude-Specific Enhancements

Add to `CLAUDE.md` (separate from main AGENTS.md):

```markdown
<!-- Claude-specific orchestration -->

## Logos Orchestration Protocol

When delegating between levels:

1. Always check TELOS.md for purpose alignment
2. Use OpenSpec for change proposals
3. Maintain conversation lineage
4. Report structured results

<!-- This section only read by Claude -->
```

### Cursor-Specific Rules

Add to `.cursor/rules/cursor-specific.md`:

```markdown
# Cursor-Specific Shortcuts

## Quick Commands

- /lint - Run L1 Syntax-Linter
- /test - Run L2 tests
- /validate - Run full L1-L9 cascade

## File Navigation

When editing files:

- Check TELOS.md first
- Review relevant agent level
- Follow level-specific guidelines
```

### Copilot-Specific Patterns

Add to `.github/copilot-patterns.md`:

````markdown
# Common Patterns

## Function Pattern (L2)

```javascript
/**
 * [Purpose aligned with L9]
 */
function doSomething(input) {
  // Validate input
  // Core logic
  // Error handling
  return result;
}
```
````

## Component Pattern (L3)

```javascript
const Component = ({ props }) => {
  // State management
  // Effects
  // Render
};
```

````
## Troubleshooting

### Symlinks Not Working (Windows)

**Problem**: Windows requires admin rights for symlinks

**Solution 1**: Run terminal as administrator
```powershell
# Run as Administrator
telos init
````

**Solution 2**: Use directory junctions (automatic fallback)

```bash
# Telos automatically tries junctions on Windows
```

**Solution 3**: Manual copy (last resort)

```bash
# Copy instead of symlink
cp telos/content/AGENTS.md CLAUDE.md
cp telos/content/AGENTS.md .cursor/rules/agents.md
# etc.

# Remember to re-copy after updates!
```

### Platform Not Seeing Updates

**Problem**: Made changes but platform uses old context

**Solution**:

```bash
# Regenerate all files
telos rediscover

# Restart your AI platform
# (Close and reopen Claude/Cursor/VS Code)
```

### Conflicts Between Platforms

**Problem**: Different platforms suggest conflicting approaches

**Solution**: All platforms should reference TELOS.md

```
You (to any platform): "Check TELOS.md before suggesting"

Platform reads purpose, aligns suggestion accordingly
```

## Benefits of Multi-Platform Setup

1. **Consistency**: All platforms work from same purpose
2. **Flexibility**: Use best tool for each task
3. **No Duplication**: Single source of truth
4. **Always Aligned**: Changes propagate to all platforms
5. **Team Coordination**: Team members can use different platforms

## Team Usage

### Scenario: Team with Mixed Platforms

**Alice** uses Claude Code\
**Bob** uses Cursor\
**Carol** uses Copilot

All work on same codebase:

```bash
# Alice initializes
alice$ telos init
alice$ git add telos/ CLAUDE.md .cursor/ .github/
alice$ git commit -m "Add Telos framework"
alice$ git push

# Bob pulls
bob$ git pull
bob$ # .cursor/rules/agents.md is there
bob$ # Cursor now sees Telos framework

# Carol pulls
carol$ git pull
carol$ # .github/copilot-instructions.md is there
carol$ # Copilot now sees Telos framework
```

All three developers now operate within the same Telos framework, using their
preferred tools.

## Summary

Telos multi-platform support provides:

- ✅ Single source of truth (`telos/content/`)
- ✅ Platform-specific symlinks
- ✅ Automatic synchronization
- ✅ Cross-platform consistency
- ✅ Team coordination
- ✅ Tool flexibility

**Result**: Coherent development regardless of which AI platform you use.

---

**Next**: Use your preferred platform(s) knowing they all operate within the
same purpose-driven framework.
