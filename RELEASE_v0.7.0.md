# Release: telos-framework v0.7.0

**Published**: October 25, 2025\
**npm**: https://www.npmjs.com/package/telos-framework\
**Git tag**: v0.7.0

## 🎯 Major Changes: Enforcement + Single Source of Truth

This release addresses a critical issue where AI assistants bypassed Telos
validation requirements, and refactors templates to eliminate duplication.

### Problem Statement

**Issue Reported**: During a Next.js upgrade, the AI assistant did NOT consult
the Telos framework despite having it installed.

**Root Causes Identified**:

1. **Weak enforcement**: Instructions said "IMPORTANT" but had no hard stops
2. **Vague triggers**: "significant changes" was undefined
3. **Missing integration**: Todo system didn't prompt for validation
4. **Incomplete list**: Framework upgrades not explicitly mentioned
5. **Massive duplication**: Same 140+ lines in multiple template files

## 🚀 What's New

### 1. Enforcement Mechanisms

**Before v0.7.0:**

```markdown
IMPORTANT: Before making any significant changes...
```

**After v0.7.0:**

```markdown
# ⚠️ TELOS FRAMEWORK - REQUIRED READING ⚠️

HARD REQUIREMENT: Validate Before Any Significant Change

BEFORE implementing ANY of the following, you MUST read `.telos/TELOS.md`:

- ✋ Framework upgrades (Next.js, React, Vue, etc.)
- ✋ Dependency changes (new packages or major version bumps)
- ✋ New features or API changes
- ✋ Breaking changes or refactoring
- ✋ Architecture changes

If you skip validation, STOP and ask the user.
```

**Key Changes**:

- ⚠️ Visual warnings at top of all templates
- Language changed from "important" to "HARD REQUIREMENT"
- Explicit "STOP and ask user" instructions throughout
- Framework upgrades and dependency changes explicitly listed
- Todo system integration: Required high-priority validation todos
- Pre-commit validation checklist with hard stops
- Concrete examples (Next.js upgrade with layer-by-layer validation)

### 2. Single Source of Truth Architecture

**Problem**: Templates had 280+ lines of duplicated content across CLAUDE.md,
AGENTS.md, and platform configs.

**Solution**: Template injection system

```
templates/
├── TELOS_CORE.md      # 150 lines - maintained once
├── AGENTS.md          # 30 lines + {{TELOS_CORE}} injection
└── CLAUDE.md          # 30 lines - references AGENTS.md
```

**How It Works**:

1. `TELOS_CORE.md` contains ALL validation requirements
2. `AGENTS.md` has `{{TELOS_CORE}}` placeholder
3. Installer injects core content at runtime
4. `CLAUDE.md` simply references AGENTS.md
5. Other platforms (Cursor, Cline, etc.) use same CLAUDE.md template

**Result**:

- ✅ No duplication: Edit one file (TELOS_CORE.md)
- ✅ Consistency guaranteed: Injection ensures uniformity
- ✅ Easy updates: Changes propagate automatically
- ✅ Better maintainability: Clear separation of concerns

## 📊 Technical Details

### New Files

1. **templates/TELOS_CORE.md** (150 lines)
   - All core validation requirements
   - Hard requirements list
   - When to validate (explicit triggers)
   - BEFORE/DURING/AFTER workflow
   - Pre-commit checklist
   - Todo system integration
   - Agent responsibilities table
   - Nine levels explanation

2. **test/template-injection.test.js** (5 tests)
   - Verifies `{{TELOS_CORE}}` placeholder replaced
   - Checks core content injected into AGENTS.md
   - Validates CLAUDE.md references AGENTS.md
   - Ensures no duplication

3. **docs/TEMPLATE_ARCHITECTURE.md**
   - Complete architecture documentation
   - How template injection works
   - Making changes guide
   - Migration instructions

### Modified Files

1. **templates/AGENTS.md**
   - Now uses `{{TELOS_CORE}}` placeholder
   - Reduced from 140 lines to 30 lines template

2. **templates/CLAUDE.md**
   - Simplified to reference AGENTS.md
   - Just platform-specific commands
   - Reduced from 140 lines to 30 lines

3. **lib/installers/memory-files.js**
   - Added template injection logic
   - Replaces `{{TELOS_CORE}}` with actual content at runtime

4. **CHANGELOG.md**
   - Complete v0.7.0 entry with all changes

5. **package.json**
   - Version bump: 0.6.0 → 0.7.0

6. **README.md**
   - Updated test count: 95 → 100

## 🧪 Test Coverage

**Total**: 100 tests (up from 95)

**New Tests**:

- Template injection verification (5 tests)
- Core content injection
- Placeholder replacement
- No duplication verification
- Multi-platform setup

**All Tests Passing**: ✅ 100/100

## 📋 Validation Requirements Now Include

Explicit triggers for when AI MUST validate:

- ✅ **Framework upgrades** (Next.js, React, Vue, etc.) - validates L1-L4
  minimum
- ✅ **Dependency changes** (especially major versions) - validates L1-L4
- ✅ **New features** - validates L3-L9 depending on scope
- ✅ **API contract changes** - must consult L4 Integration-Contractor
- ✅ **Breaking changes** - validates entire stack L1-L9
- ✅ **Architecture changes** - validates L3-L5 minimum
- ✅ **Refactoring** - validates relevant layers based on scope

## 🔄 Migration Guide

### For Users

**No action required.** Re-running `npx telos-framework init` will use the new
template architecture.

**Optional**: If you want to upgrade existing installations:

```bash
npx telos-framework init
# Choose "Reinstall" when prompted
```

This will regenerate config files with new enforcement mechanisms.

### For Contributors

If you previously edited validation requirements in multiple template files:

1. **Core requirements** → Edit `templates/TELOS_CORE.md`
2. **Platform-specific content** → Edit `templates/CLAUDE.md`
3. **Generic additions** → Edit `templates/AGENTS.md`
4. **Test changes** → Run `npm test template-injection.test.js`

## 🎯 Impact

### For AI Assistants

**Before**: Could easily skip Telos validation

- Vague "important" suggestions
- Unclear when to validate
- No integration with workflow

**After**: Hard to skip validation

- ⚠️ Visual warnings
- Explicit STOP instructions
- Concrete trigger list
- Required validation todos
- Pre-commit checklist

### For Maintainers

**Before**: Maintain validation text in 3+ files

- CLAUDE.md: 140 lines
- AGENTS.md: 140 lines
- Other configs: 140 lines each
- Total: 420+ lines of duplication

**After**: Maintain in one file

- TELOS_CORE.md: 150 lines
- Injection handles the rest
- Updates propagate automatically

### For Users

**Before**: AI might bypass Telos during major changes

- Risk of framework upgrades without validation
- Dependency changes without purpose alignment
- Breaking changes without convergence check

**After**: AI enforced to validate

- Framework upgrades trigger validation
- Explicit stopping points
- Todo system integration
- Pre-commit validation required

## 🔗 Links

- **npm Package**: https://www.npmjs.com/package/telos-framework
- **GitHub Repo**: https://github.com/telos-framework/init
- **Issues**: https://github.com/telos-framework/init/issues
- **Template Architecture**: See `docs/TEMPLATE_ARCHITECTURE.md`

## 📝 Example: Framework Upgrade Validation

**Old Behavior** (v0.6.0):

```
User: "Upgrade Next.js to v16"
AI: *upgrades without consulting Telos*
User: "Did you check Telos?"
AI: "Oops, no I didn't. Let me validate now..."
```

**New Behavior** (v0.7.0):

```
User: "Upgrade Next.js to v16"
AI: *reads AGENTS.md, sees HARD REQUIREMENT*
AI: "Before proceeding with Next.js upgrade, I need to validate with Telos framework."
AI: *creates todo: "Validate Next.js upgrade (L9→L1→L9)"*
AI: *reads .telos/TELOS.md*
AI: *runs downward validation (L9→L1)*
AI: *runs upward validation (L1→L9)*
AI: *checks convergence*
AI: "Validation complete. Both flows converge - proceeding with upgrade."
AI: *performs upgrade*
AI: *documents validation in commit message*
```

## ✅ Checklist

- ✅ Version bumped to 0.7.0
- ✅ CHANGELOG.md updated
- ✅ README.md updated (test count)
- ✅ All 100 tests passing
- ✅ Templates refactored (no duplication)
- ✅ Enforcement mechanisms added
- ✅ Documentation complete (TEMPLATE_ARCHITECTURE.md)
- ✅ Published to npm
- ✅ Git tagged (v0.7.0)
- ✅ No breaking changes

## 🙏 Credits

This release was driven by real-world user feedback:

> "During the NextJS upgrade did you ever reference the telos framework?"
>
> "No, I did not reference the Telos framework during the Next.js upgrade."

The AI assistant's honest self-analysis identified:

1. Placement issues in system prompt
2. Lack of enforcement mechanism
3. Vague trigger conditions
4. Missing integration with todo system

These insights led to comprehensive improvements that make Telos validation
impossible to bypass.

---

**Transform AI-assisted development from reactive tool usage to coherent,
purpose-aligned creation.**

Now with enforcement that actually works.
