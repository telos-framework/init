## Context

The Telos framework is feature-complete and ready for initial release. This
design covers the final polish steps to ensure a smooth v0.1.1 publication.

## Goals

**Primary:**

- Publish working package to npm as `telos-framework@0.1.1`
- Enable users to install and use immediately
- Ensure GitHub releases are automated

**Secondary:**

- Set up CI/CD for future development
- Provide comprehensive examples
- Validate cross-platform compatibility

**Non-Goals:**

- Major new features (save for v0.2.0)
- Breaking changes
- Full production hardening (this is beta v0.1.x)

## Decisions

### Decision 1: Release Strategy

**Choice:** Patch release (0.1.0 → 0.1.1) with release-it

**Rationale:**

- Version 0.1.0 was already attempted (403 error)
- Patch bump is cleanest path forward
- release-it automates version/tag/publish flow
- Follows semantic versioning convention

**Alternatives considered:**

- Manual version bump → Too error-prone
- Skip to 0.2.0 → Doesn't match semver (no new features)

### Decision 2: GitHub Token Management

**Choice:** Use personal access token in environment variable

**Rationale:**

- Standard practice for CLI tools
- Keeps token out of repository
- Works locally and in CI/CD
- Can be rotated easily

**Alternatives considered:**

- GitHub App → Overkill for single-developer project
- OAuth flow → Not needed for CLI tool
- No GitHub releases → Loses valuable feature

### Decision 3: Package Contents

**Choice:** Minimal package via `.npmignore`

**Included:**

- `bin/` - CLI executable
- `lib/` - Implementation
- `logos/` - Orchestrator
- `LICENSE`, `README.md`, `USAGE.md`

**Excluded:**

- `test/` - Tests (not needed by users)
- `examples/` - Examples (keep in repo only)
- `openspec/` - Spec files (development only)
- `.telos/` - Runtime state (never include)

**Rationale:**

- Smaller package size
- Faster installation
- Examples/tests available in GitHub repo
- Follows npm best practices

### Decision 4: CI/CD Approach

**Choice:** GitHub Actions with simple workflow (post-release)

**Workflow:**

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
```

**Rationale:**

- Simple, standard approach
- Validates tests on push
- Catches issues before merge
- Free for public repos

**Alternatives considered:**

- Circle CI → GitHub Actions sufficient
- Travis CI → Deprecated
- No CI → Would miss test failures

## Implementation

### Pre-Release Checklist

1. **GitHub Token**:
   ```bash
   # Create at: https://github.com/settings/tokens/new
   # Scopes: repo
   export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
   ```

2. **Verify Package**:
   ```bash
   npm pack --dry-run
   # Review file list, ensure correct contents
   ```

3. **Update Metadata**:
   - Verify `package.json` keywords
   - Check repository URLs
   - Validate `files` array

4. **Release**:
   ```bash
   npm run release
   # Select: patch (0.1.1)
   # Confirm all prompts
   ```

5. **Verify**:
   ```bash
   # Check npm
   open https://www.npmjs.com/package/telos-framework

   # Test install
   cd /tmp
   npx telos-framework init
   ```

### Post-Release (Optional)

1. **GitHub Actions**:
   - Create `.github/workflows/test.yml`
   - Configure to run on push/PR
   - Add badge to README

2. **Additional Examples**:
   - Python project example
   - Flutter project example
   - Monorepo example

3. **Cross-Platform**:
   - Test on Windows (WSL and native)
   - Test on Linux (Ubuntu)
   - Document platform-specific issues

## Risks

### Risk 1: npm publish fails again

**Mitigation:**

- Use release-it which handles version conflicts
- Patch bump ensures new version
- Test with `npm pack` first

### Risk 2: GitHub token expires

**Mitigation:**

- Set token expiration to "No expiration" for now
- Or use 90-day token and rotate
- Document token setup in CONTRIBUTING.md

### Risk 3: Package is too large

**Current size:** ~200KB (without node_modules)

**Mitigation:**

- `.npmignore` already excludes tests/examples
- Size is acceptable for CLI tool
- Can optimize later if needed

## Success Criteria

**Minimum (Required):**

- ✅ Package published to npm as v0.1.1
- ✅ `npx telos-framework init` works
- ✅ GitHub release created with notes
- ✅ Tests passing

**Ideal (Desired):**

- ✅ All above, plus:
- ✅ GitHub Actions CI running
- ✅ Badges in README
- ✅ Examples work end-to-end

**Stretch (Optional):**

- ✅ Cross-platform validation
- ✅ Community announcement
- ✅ Project website live
