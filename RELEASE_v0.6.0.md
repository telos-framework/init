# Release: telos-framework v0.6.0

**Published**: October 25, 2025\
**npm**: https://www.npmjs.com/package/telos-framework\
**Git tag**: v0.6.0

## 🎯 Feature: Re-initialization Safety

### What's New

Running `npx telos-framework init` is now **safe to run multiple times** without
data loss.

When an existing Telos installation is detected, users are presented with three
clear options:

```
⚠ Existing Telos installation detected

Detected platforms:
  - Claude Code
  - Cursor

? What would you like to do?
  ❯ Abort (keep existing installation)
    Reinstall (overwrite everything)
    Add platforms (keep existing, add new)
```

### Why This Matters

**Before v0.6.0:**

- Re-running init would silently overwrite all configuration files
- Users could lose custom modifications to AGENTS.md, CLAUDE.md, etc.
- No warning or detection of existing installations
- Poor user experience when accidentally running init twice

**After v0.6.0:**

- Users are immediately warned about existing installations
- Three clear options prevent accidental data loss
- "Add platforms" enables multi-platform setup without risk
- Professional, safe UX that respects user customizations

### Use Cases

#### 1. Accidental Re-run

User accidentally runs `init` again → Choose "Abort" → No changes made ✅

#### 2. Adding New Platform

Started with Claude Code, now want Cursor → Choose "Add platforms" → Only Cursor
files created ✅

#### 3. Framework Upgrade

New Telos version available → Commit customizations → Choose "Reinstall" →
Latest templates installed → Restore customizations from git if needed ✅

## 📊 Technical Details

### Detection System

Automatically scans for:

- `.claude/commands/telos/` directory
- `.opencode/command/telos-*.md` files
- Config files (CLAUDE.md, AGENTS.md, .cursorrules, etc.) containing "Telos
  Framework"

Returns:

```javascript
{
  hasExisting: boolean,
  detectedPlatforms: ['claude', 'cursor', ...]
}
```

### Performance

- Detection overhead: **~20-30ms**
- No noticeable user impact
- Efficient file system checks

### Test Coverage

- **9 new tests** in `test/reinit-detection.test.js`
- **95 total tests** across 10 test files
- **100% passing**
- Comprehensive coverage of all platforms and edge cases

## 📝 Changes

### Modified Files

1. **lib/commands/init.js** (+122 lines)
   - New `detectExistingInstallation()` function
   - Interactive prompts for existing installations
   - Conditional workflow based on user choice

2. **test/reinit-detection.test.js** (NEW, 238 lines)
   - Fresh install detection (no false positives)
   - Claude Code detection
   - Opencode detection
   - Multi-platform detection
   - Config file content checking
   - Edge cases

3. **CHANGELOG.md**
   - v0.6.0 section with feature details

4. **package.json**
   - Version: 0.5.0 → 0.6.0

5. **README.md**
   - Updated test count badge: 29 → 95
   - Added safety note in Installation section
   - Link to comprehensive docs

### New Documentation

1. **docs/REINIT.md** (400+ lines)
   - User guide with examples
   - Best practices
   - Troubleshooting
   - Technical details

2. **docs/REINIT_FLOW.md** (350+ lines)
   - Visual flow diagrams
   - State transitions
   - Detection logic
   - Example journeys

3. **IMPLEMENTATION_SUMMARY.md** (600+ lines)
   - Complete technical overview
   - Design decisions
   - Validation checklist

## 🔄 Migration Guide

### From v0.5.0 or earlier

No action needed! The new detection works automatically.

If you want to upgrade your framework files:

```bash
# Save your customizations first
git add .
git commit -m "Save Telos customizations"

# Run init
npx telos-framework init

# Choose "Reinstall" when prompted
# Review changes
git diff

# Restore specific customizations if needed
git checkout -- CLAUDE.md  # example
```

## 🎨 User Experience

### Before

```bash
$ npx telos-framework init
# Immediately overwrites everything
# No warning, no choice
```

### After

```bash
$ npx telos-framework init

⚠ Existing Telos installation detected

Detected platforms:
  - Claude Code

? What would you like to do?
  ❯ Abort (keep existing installation)
    
✓ Installation cancelled. Existing files preserved.
```

## 🚀 What's Next

Potential future enhancements:

- Selective file reinstallation
- Automatic backups before overwrite
- Diff preview before reinstalling
- Migration scripts for breaking changes
- Dedicated `telos upgrade` command

## 📦 Installation

```bash
# Fresh install
npx telos-framework init

# Global install
npm install -g telos-framework
telos init

# Upgrade existing
npm update -g telos-framework
telos init  # Safe to run!
```

## 🔗 Links

- **npm Package**: https://www.npmjs.com/package/telos-framework
- **GitHub Repo**: https://github.com/telos-framework/init
- **Documentation**: See `/docs` folder
- **Issues**: https://github.com/telos-framework/init/issues

## ✅ Validation

- ✅ All 95 tests passing
- ✅ Published to npm successfully
- ✅ Git tagged and pushed
- ✅ Documentation complete
- ✅ Backward compatible (no breaking changes)
- ✅ Performance acceptable (<30ms overhead)

## 🙏 Feedback

If you encounter any issues with the new re-initialization detection, please:

1. Check `docs/REINIT.md` for troubleshooting
2. Open an issue on GitHub with details
3. Include: OS, Node version, detected platforms, expected vs actual behavior

---

**Enjoy safer, more reliable Telos initialization! 🎯**
