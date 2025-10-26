# Template Architecture

## Overview

Telos framework uses a **single source of truth** architecture for validation
instructions to eliminate duplication and ensure consistency across all AI
coding platforms.

## File Structure

```
templates/
├── TELOS_CORE.md      # Single source of truth for all validation requirements
├── AGENTS.md          # Injects TELOS_CORE via {{TELOS_CORE}} placeholder
└── CLAUDE.md          # Platform-specific, references AGENTS.md
```

## How It Works

### 1. Core Template (TELOS_CORE.md)

Contains ALL validation requirements that apply to every AI coding platform:

- ⚠️ Warning headers
- Hard requirements list (framework upgrades, dependencies, etc.)
- When to validate (required trigger conditions)
- Validation process (BEFORE/DURING/AFTER workflow)
- Pre-commit checklist
- Todo system integration
- Agent responsibilities table
- The nine levels explanation
- Telos-Logos system description

**Size**: ~150 lines **Maintained**: Single file only

### 2. Platform-Agnostic Template (AGENTS.md)

```markdown
# AI Agent Instructions

{{TELOS_CORE}}

## Slash Commands

[platform-agnostic command list]

## Philosophy

[framework philosophy]
```

**Injection**: `{{TELOS_CORE}}` placeholder gets replaced with full content from
`TELOS_CORE.md` at runtime

**Result**: Complete validation instructions for any AI assistant

### 3. Platform-Specific Template (CLAUDE.md)

```markdown
# Project Context for Claude

See `AGENTS.md` for complete validation requirements.

## Claude-Specific Commands

[only Claude-specific slash commands]

## Integration with OpenSpec

[only if relevant]
```

**Size**: ~30 lines **Purpose**: Minimal platform-specific additions

### 4. Other Platforms

Cursor, Cline, Windsurf, Roo, Gemini all use the same CLAUDE.md template.

## Template Injection System

### Code Location

`lib/installers/memory-files.js`:

```javascript
async function readTemplate(templateName) {
  const templatePath = path.join(__dirname, "../../templates", templateName);
  let content = await fs.readFile(templatePath, "utf-8");

  // If template contains {{TELOS_CORE}}, inject the core content
  if (content.includes("{{TELOS_CORE}}")) {
    const coreContent = await fs.readFile(
      path.join(__dirname, "../../templates/TELOS_CORE.md"),
      "utf-8",
    );
    content = content.replace("{{TELOS_CORE}}", coreContent);
  }

  return content;
}
```

### How Installation Works

When user runs `npx telos-framework init`:

1. **Platform selection**: User chooses platforms (Claude, Opencode, Cursor,
   etc.)
2. **Template loading**: Installer loads appropriate templates
3. **Injection**: `{{TELOS_CORE}}` placeholder replaced with full core content
4. **File creation**: Final content written to project files

**Result**:

- `AGENTS.md`: Contains full core content (injected)
- `CLAUDE.md`: Contains platform-specific additions + reference to AGENTS.md
- `.cursorrules`, `.clinerules`, etc.: Same as CLAUDE.md

## Generated File Structure

After `npx telos-framework init`:

```
your-project/
├── AGENTS.md              # Full core content (150+ lines)
├── CLAUDE.md              # Platform-specific (30 lines) + reference to AGENTS.md
├── .cursorrules           # Same as CLAUDE.md (if Cursor selected)
├── .clinerules            # Same as CLAUDE.md (if Cline selected)
├── .windsurfrules         # Same as CLAUDE.md (if Windsurf selected)
├── .roocode               # Same as CLAUDE.md (if Roo selected)
└── GEMINI.md              # Same as CLAUDE.md (if Gemini selected)
```

## Why This Architecture?

### Before (v0.6.0 and earlier)

**Problem**: Massive duplication

```
CLAUDE.md:     140 lines (full validation requirements)
AGENTS.md:     140 lines (same full validation requirements)
.cursorrules:  140 lines (same full validation requirements)
```

**Issues**:

- 3× duplication of same content
- Update in one place = must update in 3 places
- Risk of inconsistency
- Difficult to maintain

### After (v0.7.0)

**Solution**: Single source of truth

```
TELOS_CORE.md: 150 lines (maintained once)
AGENTS.md:      30 lines template + injection → 180 lines final
CLAUDE.md:      30 lines (just references AGENTS.md)
.cursorrules:   30 lines (just references AGENTS.md)
```

**Benefits**:

- ✅ No duplication: Core maintained in one file
- ✅ Easy updates: Change TELOS_CORE.md once
- ✅ Consistency guaranteed: Injection ensures uniformity
- ✅ Simpler platform templates: Only platform-specific content
- ✅ Better maintainability: Clear separation of concerns

## Making Changes

### To Update Core Validation Requirements

Edit **only** `templates/TELOS_CORE.md`

Changes automatically apply to all platforms on next install.

### To Update Platform-Specific Instructions

Edit `templates/CLAUDE.md` or `templates/AGENTS.md`

**CLAUDE.md**: Platform-specific commands, integrations **AGENTS.md**:
Philosophy, slash commands list

### To Add New Platform

1. Add platform to `lib/installers/memory-files.js`
2. Use existing CLAUDE.md template (already generic enough)
3. No changes to TELOS_CORE.md needed

## Testing

### Template Injection Tests

`test/template-injection.test.js` verifies:

1. `{{TELOS_CORE}}` placeholder is replaced (not present in output)
2. Core content is injected into AGENTS.md
3. AGENTS.md contains all expected sections
4. CLAUDE.md references AGENTS.md (not duplicating content)
5. CLAUDE.md is concise (<50 lines)
6. Both files created correctly for multi-platform setups

### Running Tests

```bash
npm test template-injection.test.js  # Just template tests
npm test                              # All 100 tests
```

## Future Enhancements

Potential improvements:

1. **Multiple injection points**: Support multiple `{{VAR}}` placeholders
2. **Conditional sections**: `{{#PLATFORM_CLAUDE}}...{{/PLATFORM_CLAUDE}}`
3. **Version tracking**: Include Telos version in generated files
4. **Template variables**: `{{PROJECT_NAME}}`, `{{PLATFORM}}`, etc.
5. **Validation**: Check templates for required sections before publish

## Migration Guide

### From v0.6.0 to v0.7.0

**For users**: No action needed. Re-running `npx telos-framework init` will use
new template architecture.

**For contributors**: If you previously edited validation requirements in
multiple files:

1. All core requirements now go in `templates/TELOS_CORE.md`
2. Platform-specific content goes in `templates/CLAUDE.md`
3. Generic additions go in `templates/AGENTS.md`
4. Test your changes with `npm test template-injection.test.js`

## Philosophy

This architecture embodies the Telos principle of **clarity through
simplification**:

- **L9 (Purpose)**: Ensure consistent validation across all AI assistants
- **L8 (Value)**: Reduce maintenance burden, prevent inconsistencies
- **L7 (Strategy)**: Single source of truth eliminates duplication
- **L6 (UX)**: Simple template editing, clear file organization
- **L5 (Workflow)**: Template injection happens transparently
- **L4 (Integration)**: Runtime injection maintains flexibility
- **L3 (Architecture)**: Separation of core/platform-specific content
- **L2 (Implementation)**: String replacement in readTemplate()
- **L1 (Code Quality)**: Tested, simple, maintainable

Every technical decision serves the ultimate purpose: making Telos validation
requirements consistent and easy to maintain.
