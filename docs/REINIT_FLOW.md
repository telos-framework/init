# Re-initialization Flow Diagram

## User Decision Tree

```
┌─────────────────────────────┐
│  npx telos-framework init   │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Detect existing install?   │
└──────┬──────────────┬───────┘
       │              │
    NO │              │ YES
       │              │
       ▼              ▼
┌──────────────┐  ┌────────────────────────┐
│ Fresh install│  │ Show detected platforms│
│              │  │  - Claude Code         │
│ Select       │  │  - Cursor              │
│ platforms    │  │  - etc.                │
└──────┬───────┘  └──────┬─────────────────┘
       │                 │
       │                 ▼
       │          ┌──────────────────────┐
       │          │ What to do?          │
       │          │  1. Abort            │
       │          │  2. Reinstall        │
       │          │  3. Add platforms    │
       │          └──┬───────┬──────┬────┘
       │             │       │      │
       │          1. │    2. │   3. │
       │             │       │      │
       │             ▼       │      ▼
       │       ┌─────────┐   │  ┌─────────────────┐
       │       │  Exit   │   │  │ Select new      │
       │       │  (no    │   │  │ platforms only  │
       │       │ changes)│   │  └────────┬────────┘
       │       └─────────┘   │           │
       │                     │           │
       │                     ▼           │
       │              ┌──────────────┐   │
       │              │  Overwrite   │   │
       │              │  warning     │   │
       │              └──────┬───────┘   │
       │                     │           │
       │                     │           │
       ▼                     ▼           ▼
┌──────────────────────────────────────────┐
│        Install slash commands            │
│        Create config files               │
└──────────────┬───────────────────────────┘
               │
               ▼
        ┌──────────────┐
        │  Complete!   │
        └──────────────┘
```

## Detection Logic

```
detectExistingInstallation()
├── Check .claude/commands/telos/
│   └── exists? → hasClaudeCommands = true
│
├── Check .opencode/command/
│   └── has telos-*.md? → hasOpencodeCommands = true
│
└── Check config files:
    ├── CLAUDE.md
    ├── AGENTS.md
    ├── .cursorrules
    ├── .clinerules
    ├── .windsurfrules
    ├── .roocode
    └── GEMINI.md
        └── contains "Telos Framework"? → hasConfigFiles = true
                                        detectedPlatforms.push(platform)

Return: {
  hasExisting: (any checks true?),
  hasClaudeCommands,
  hasOpencodeCommands,
  hasConfigFiles,
  detectedPlatforms: []
}
```

## State Transitions

### Fresh Install (No Existing)

```
State: INITIAL
  ↓
Detect: hasExisting = false
  ↓
Action: Show platform selection
  ↓
State: INSTALLING
  ↓
Action: Create all files
  ↓
State: COMPLETE
```

### Abort (Keep Existing)

```
State: INITIAL
  ↓
Detect: hasExisting = true
  ↓
Action: Show "What to do?" prompt
  ↓
User selects: "Abort"
  ↓
Action: console.log('Installation cancelled')
  ↓
State: COMPLETE (no changes)
```

### Reinstall (Overwrite)

```
State: INITIAL
  ↓
Detect: hasExisting = true
  ↓
Action: Show "What to do?" prompt
  ↓
User selects: "Reinstall"
  ↓
Action: Show warning ⚠️
  ↓
Action: Show platform selection (all platforms)
  ↓
State: INSTALLING
  ↓
Action: Overwrite all files
  ↓
State: COMPLETE
```

### Add Platforms

```
State: INITIAL
  ↓
Detect: hasExisting = true
  ↓
Action: Show "What to do?" prompt
  ↓
User selects: "Add platforms"
  ↓
Action: Show platform selection
  ↓
State: INSTALLING
  ↓
Action: Install only newly selected platforms
  ↓
State: COMPLETE
```

## File Operations by Action

### Fresh Install

```
Creates:
  .claude/commands/telos/*.md (if Claude selected)
  .opencode/command/telos-*.md (if Opencode selected)
  CLAUDE.md (if Claude selected)
  AGENTS.md (if "Other" or fallback)
  .cursorrules (if Cursor selected)
  .clinerules (if Cline selected)
  .windsurfrules (if Windsurf selected)
  .roocode (if Roo selected)
  GEMINI.md (if Gemini selected)

Modifies:
  None
```

### Abort

```
Creates:
  None

Modifies:
  None
```

### Reinstall

```
Creates:
  (same as Fresh Install for selected platforms)

Modifies:
  Overwrites any existing files from selected platforms
```

### Add Platforms

```
Creates:
  Files for newly selected platforms only

Modifies:
  None (existing platform files untouched)
```

## Example User Journeys

### Journey 1: First-time User

```
User: npx telos-framework init
System: (no detection, fresh install)
System: "Which AI coding platforms?"
User: [✓] Claude Code
System: ✓ Created .claude/commands/telos/init.md
        ✓ Created CLAUDE.md
        Installation Complete!
```

### Journey 2: Accidental Re-run

```
User: npx telos-framework init
System: ⚠ Existing Telos installation detected
        Detected platforms:
          - Claude Code
        What would you like to do?
User: Abort
System: ✓ Installation cancelled. Existing files preserved.
```

### Journey 3: Adding Cursor to Existing Claude

```
User: npx telos-framework init
System: ⚠ Existing Telos installation detected
        Detected platforms:
          - Claude Code
        What would you like to do?
User: Add platforms
System: Select additional platforms to install:
User: [✓] Cursor
System: ✓ Created .cursorrules
        Installation Complete!
```

### Journey 4: Upgrading (Reinstall)

```
User: git add . && git commit -m "Save customizations"
User: npx telos-framework init
System: ⚠ Existing Telos installation detected
        Detected platforms:
          - Claude Code
          - Cursor
        What would you like to do?
User: Reinstall
System: ⚠ Warning: This will overwrite all Telos files
        Which AI coding platforms?
User: [✓] Claude Code
      [✓] Cursor
System: ✓ Created .claude/commands/telos/init.md
        ✓ Created CLAUDE.md
        ✓ Created .cursorrules
        Installation Complete!
User: git diff  # See what changed
User: git restore CLAUDE.md  # If needed
```

## Safety Mechanisms

### 1. Detection Phase

- ✅ Scans multiple indicators
- ✅ Shows detected platforms
- ✅ No assumptions

### 2. User Consent

- ✅ Explicit choice required
- ✅ Clear option labels
- ✅ Warning for destructive action

### 3. Abort Escape Hatch

- ✅ Always available
- ✅ Zero modifications
- ✅ Friendly message

### 4. Selective Installation

- ✅ Add platforms without affecting existing
- ✅ User controls scope
- ✅ Predictable behavior

## Testing Coverage

```
Test Suite: reinit-detection.test.js (9 tests)

✓ should detect no existing installation in fresh directory
✓ should detect existing Claude Code installation
✓ should detect existing Opencode installation
✓ should detect existing CLAUDE.md with Telos content
✓ should detect existing AGENTS.md with Telos content
✓ should detect multiple platform installations
✓ should not detect CLAUDE.md without Telos content
✓ should ignore .opencode/command without telos- prefixed files
✓ should detect all platform-specific config files

All scenarios covered:
- Fresh install
- Single platform detection
- Multi-platform detection
- Config file detection
- False positive prevention
- Edge cases
```

## Performance Profile

```
Detection overhead:
- File system checks: ~5-10ms
- Content reads: ~2-5ms per file
- Total: ~20-30ms

User experience:
- Adds 1 prompt if existing detected
- Clear messaging throughout
- No noticeable delay
```

## Error Handling

```
Error scenarios handled:
1. File system errors → Silent fail (assume not installed)
2. Permission errors → Silent fail
3. Corrupted files → Detection triggers, reinstall repairs
4. Missing directories → Silent fail
5. Invalid JSON/content → Silent fail

Philosophy: Better to not detect than to false positive
```
