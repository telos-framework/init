/**
 * Telos-SDD Git Hooks
 * 
 * Installs and manages pre-commit/pre-push hooks for enforcement.
 */

const fs = require('fs').promises;
const path = require('path');
const { loadConfig } = require('./config');

const PRECOMMIT_HOOK = `#!/bin/bash
# Telos-SDD Pre-commit Hook
# Validates specs, links, and tests before commit

echo "Running Telos-SDD validation..."

# Run validation
npx telos validate

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "❌ Telos-SDD validation failed. Commit blocked."
  echo "Run 'telos validate' for details."
  echo ""
  exit 1
fi

echo "✓ Telos-SDD validation passed"
exit 0
`;

const PREPUSH_HOOK = `#!/bin/bash
# Telos-SDD Pre-push Hook
# Full validation including tests before push

echo "Running Telos-SDD full validation..."

# Run full validation
npx telos validate

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "❌ Telos-SDD validation failed. Push blocked."
  echo "Run 'telos validate' for details."
  echo ""
  exit 1
fi

echo "✓ Telos-SDD validation passed"
exit 0
`;

const HUSKY_PRECOMMIT = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx telos validate
`;

/**
 * Install git hooks
 * @param {string} projectRoot - Project root directory
 * @param {object} options - Installation options
 * @returns {Promise<object>} Installation result
 */
async function installHooks(projectRoot, options = {}) {
  const result = {
    installed: [],
    errors: [],
    hooksDir: null
  };

  // Check for Husky
  const huskyDir = path.join(projectRoot, '.husky');
  const gitHooksDir = path.join(projectRoot, '.git', 'hooks');
  
  let useHusky = false;
  try {
    await fs.access(huskyDir);
    useHusky = true;
    result.hooksDir = huskyDir;
  } catch {
    try {
      await fs.access(gitHooksDir);
      result.hooksDir = gitHooksDir;
    } catch {
      result.errors.push('No .git/hooks or .husky directory found');
      return result;
    }
  }

  if (useHusky) {
    // Install Husky hooks
    try {
      const precommitPath = path.join(huskyDir, 'pre-commit');
      let existingContent = '';
      
      try {
        existingContent = await fs.readFile(precommitPath, 'utf8');
      } catch {}

      if (!existingContent.includes('telos validate')) {
        const newContent = existingContent 
          ? existingContent.trim() + '\n\nnpx telos validate\n'
          : HUSKY_PRECOMMIT;
        
        await fs.writeFile(precommitPath, newContent, { mode: 0o755 });
        result.installed.push('pre-commit (husky)');
      } else {
        result.installed.push('pre-commit (already configured)');
      }
    } catch (error) {
      result.errors.push(`pre-commit: ${error.message}`);
    }
  } else {
    // Install raw git hooks
    try {
      const precommitPath = path.join(gitHooksDir, 'pre-commit');
      await fs.writeFile(precommitPath, PRECOMMIT_HOOK, { mode: 0o755 });
      result.installed.push('pre-commit');
    } catch (error) {
      result.errors.push(`pre-commit: ${error.message}`);
    }

    if (options.prePush) {
      try {
        const prepushPath = path.join(gitHooksDir, 'pre-push');
        await fs.writeFile(prepushPath, PREPUSH_HOOK, { mode: 0o755 });
        result.installed.push('pre-push');
      } catch (error) {
        result.errors.push(`pre-push: ${error.message}`);
      }
    }
  }

  return result;
}

/**
 * Uninstall git hooks
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<object>} Uninstallation result
 */
async function uninstallHooks(projectRoot) {
  const result = {
    removed: [],
    errors: []
  };

  const huskyDir = path.join(projectRoot, '.husky');
  const gitHooksDir = path.join(projectRoot, '.git', 'hooks');

  // Try Husky first
  try {
    const precommitPath = path.join(huskyDir, 'pre-commit');
    const content = await fs.readFile(precommitPath, 'utf8');
    
    if (content.includes('telos validate')) {
      const newContent = content.replace(/\n?npx telos validate\n?/g, '\n');
      await fs.writeFile(precommitPath, newContent, { mode: 0o755 });
      result.removed.push('pre-commit (husky)');
    }
  } catch {}

  // Try raw git hooks
  const hooks = ['pre-commit', 'pre-push'];
  for (const hook of hooks) {
    try {
      const hookPath = path.join(gitHooksDir, hook);
      const content = await fs.readFile(hookPath, 'utf8');
      
      if (content.includes('Telos-SDD')) {
        await fs.unlink(hookPath);
        result.removed.push(hook);
      }
    } catch {}
  }

  return result;
}

/**
 * Generate GitHub Actions workflow
 * @param {object} options - Workflow options
 * @returns {string} Workflow YAML
 */
function generateGitHubWorkflow(options = {}) {
  return `# Telos-SDD Validation Workflow
name: Telos Validation

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Telos
        run: npm install -g telos-framework
        
      - name: Validate Spec Structure
        run: telos validate --specs
        
      - name: Validate Code-Spec Links
        run: telos validate --links
        
      - name: Validate Test Coverage
        run: telos validate --tests
        
      - name: Check for Orphaned Code
        run: telos validate --orphans
        
      - name: Generate Coverage Report
        run: telos coverage --json > telos-coverage.json
        
      - name: Upload Coverage Report
        uses: actions/upload-artifact@v4
        with:
          name: telos-coverage
          path: telos-coverage.json
          retention-days: 30
`;
}

/**
 * Generate GitLab CI configuration
 * @param {object} options - CI options
 * @returns {string} GitLab CI YAML
 */
function generateGitLabCI(options = {}) {
  return `# Telos-SDD Validation
telos-validate:
  stage: test
  image: node:20
  before_script:
    - npm ci
    - npm install -g telos-framework
  script:
    - telos validate --specs
    - telos validate --links
    - telos validate --tests
    - telos validate --orphans
    - telos coverage --json > telos-coverage.json
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: telos-coverage.json
    expire_in: 30 days
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
`;
}

/**
 * Install CI configuration
 * @param {string} projectRoot - Project root directory
 * @param {string} platform - CI platform (github, gitlab)
 * @returns {Promise<object>} Installation result
 */
async function installCI(projectRoot, platform = 'github') {
  const result = {
    installed: null,
    error: null
  };

  try {
    if (platform === 'github') {
      const workflowDir = path.join(projectRoot, '.github', 'workflows');
      await fs.mkdir(workflowDir, { recursive: true });
      
      const workflowPath = path.join(workflowDir, 'telos.yml');
      await fs.writeFile(workflowPath, generateGitHubWorkflow(), 'utf8');
      result.installed = workflowPath;
      
    } else if (platform === 'gitlab') {
      const ciPath = path.join(projectRoot, '.gitlab-ci.yml');
      
      let existingContent = '';
      try {
        existingContent = await fs.readFile(ciPath, 'utf8');
      } catch {}

      if (existingContent && !existingContent.includes('telos-validate')) {
        const newContent = existingContent + '\n' + generateGitLabCI();
        await fs.writeFile(ciPath, newContent, 'utf8');
      } else if (!existingContent) {
        await fs.writeFile(ciPath, generateGitLabCI(), 'utf8');
      }
      
      result.installed = ciPath;
    } else {
      result.error = `Unknown CI platform: ${platform}`;
    }
  } catch (error) {
    result.error = error.message;
  }

  return result;
}

module.exports = {
  installHooks,
  uninstallHooks,
  generateGitHubWorkflow,
  generateGitLabCI,
  installCI,
  PRECOMMIT_HOOK,
  PREPUSH_HOOK
};
