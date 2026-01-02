/**
 * Telos-SDD Test Generator
 * 
 * Generates test skeletons from spec scenarios.
 * Supports multiple test frameworks per language.
 */

const fs = require('fs').promises;
const path = require('path');
const { parseSpecFile } = require('./spec-parser');
const { loadConfig, getTestFramework } = require('./config');
const { loadIndex, getSpec } = require('./spec-index');

// Test framework templates
const TEST_TEMPLATES = {
  vitest: {
    language: ['typescript', 'javascript'],
    extension: '.test.ts',
    wrapper: (specId, imports, tests) => `/**
 * Tests for ${specId}
 * AUTO-GENERATED from Telos spec - customize as needed
 */

${imports}

describe('${getDescribeName(specId)}', () => {
${tests}
});
`,
    scenario: (specId, scenarioId, scenarioName, given, when, then) => `  // @telos-scenario ${specId}:${scenarioId}
  it('${scenarioName}', () => {
    // GIVEN ${given}
    // TODO: Set up test conditions

    // WHEN ${when}
    // TODO: Execute the action

    // THEN ${then}
    // TODO: Add assertions
    expect(true).toBe(true); // Replace with actual assertions
  });
`
  },

  jest: {
    language: ['typescript', 'javascript'],
    extension: '.test.ts',
    wrapper: (specId, imports, tests) => `/**
 * Tests for ${specId}
 * AUTO-GENERATED from Telos spec - customize as needed
 */

${imports}

describe('${getDescribeName(specId)}', () => {
${tests}
});
`,
    scenario: (specId, scenarioId, scenarioName, given, when, then) => `  // @telos-scenario ${specId}:${scenarioId}
  it('${scenarioName}', () => {
    // GIVEN ${given}
    // TODO: Set up test conditions

    // WHEN ${when}
    // TODO: Execute the action

    // THEN ${then}
    // TODO: Add assertions
    expect(true).toBe(true); // Replace with actual assertions
  });
`
  },

  pytest: {
    language: ['python'],
    extension: '_test.py',
    wrapper: (specId, imports, tests) => `"""
Tests for ${specId}
AUTO-GENERATED from Telos spec - customize as needed
"""

${imports}


class Test${getClassName(specId)}:
${tests}
`,
    scenario: (specId, scenarioId, scenarioName, given, when, then) => `    # @telos-scenario ${specId}:${scenarioId}
    def test_${toSnakeCase(scenarioName)}(self):
        """${scenarioName}"""
        # GIVEN ${given}
        # TODO: Set up test conditions

        # WHEN ${when}
        # TODO: Execute the action

        # THEN ${then}
        # TODO: Add assertions
        assert True  # Replace with actual assertions
`
  },

  'go-test': {
    language: ['go'],
    extension: '_test.go',
    wrapper: (specId, imports, tests) => `// Tests for ${specId}
// AUTO-GENERATED from Telos spec - customize as needed

package ${getPackageName(specId)}

${imports}

${tests}
`,
    scenario: (specId, scenarioId, scenarioName, given, when, then) => `// @telos-scenario ${specId}:${scenarioId}
func Test${toPascalCase(scenarioName)}(t *testing.T) {
	// GIVEN ${given}
	// TODO: Set up test conditions

	// WHEN ${when}
	// TODO: Execute the action

	// THEN ${then}
	// TODO: Add assertions
	if true != true {
		t.Error("Replace with actual assertions")
	}
}
`
  },

  'cargo-test': {
    language: ['rust'],
    extension: '_test.rs',
    wrapper: (specId, imports, tests) => `//! Tests for ${specId}
//! AUTO-GENERATED from Telos spec - customize as needed

${imports}

#[cfg(test)]
mod tests {
    use super::*;

${tests}
}
`,
    scenario: (specId, scenarioId, scenarioName, given, when, then) => `    // @telos-scenario ${specId}:${scenarioId}
    #[test]
    fn ${toSnakeCase(scenarioName)}() {
        // GIVEN ${given}
        // TODO: Set up test conditions

        // WHEN ${when}
        // TODO: Execute the action

        // THEN ${then}
        // TODO: Add assertions
        assert!(true); // Replace with actual assertions
    }
`
  }
};

/**
 * Parse scenarios from spec content
 * @param {string} content - Spec markdown content
 * @returns {object[]} Array of scenario objects
 */
function parseScenarios(content) {
  const scenarios = [];
  const lines = content.split('\n');
  
  let currentScenario = null;
  let currentSection = null; // 'given', 'when', 'then'

  for (const line of lines) {
    // Match scenario headers
    const scenarioMatch = line.match(/^#{2,}\s*Scenario:\s*(.+)/i);
    if (scenarioMatch) {
      if (currentScenario) {
        scenarios.push(currentScenario);
      }
      currentScenario = {
        name: scenarioMatch[1].trim(),
        id: toKebabCase(scenarioMatch[1].trim()),
        given: [],
        when: [],
        then: []
      };
      currentSection = null;
      continue;
    }

    if (!currentScenario) continue;

    // Match GIVEN/WHEN/THEN lines
    const givenMatch = line.match(/^-\s*GIVEN\s+(.+)/i);
    if (givenMatch) {
      currentSection = 'given';
      currentScenario.given.push(givenMatch[1].trim());
      continue;
    }

    const whenMatch = line.match(/^-\s*WHEN\s+(.+)/i);
    if (whenMatch) {
      currentSection = 'when';
      currentScenario.when.push(whenMatch[1].trim());
      continue;
    }

    const thenMatch = line.match(/^-\s*THEN\s+(.+)/i);
    if (thenMatch) {
      currentSection = 'then';
      currentScenario.then.push(thenMatch[1].trim());
      continue;
    }

    const andMatch = line.match(/^-\s*AND\s+(.+)/i);
    if (andMatch && currentSection) {
      currentScenario[currentSection].push(andMatch[1].trim());
    }
  }

  if (currentScenario) {
    scenarios.push(currentScenario);
  }

  return scenarios;
}

/**
 * Generate test file from spec
 * @param {string} projectRoot - Project root directory
 * @param {string} specId - Spec ID
 * @param {object} options - Generation options
 * @returns {Promise<object>} Generation result
 */
async function generateTests(projectRoot, specId, options = {}) {
  const config = await loadConfig(projectRoot);
  let index = await loadIndex(projectRoot);
  if (!index) {
    const { buildIndex } = require('./spec-index');
    index = await buildIndex(projectRoot);
  }

  const specEntry = getSpec(index, specId);
  if (!specEntry) {
    return { success: false, error: `Spec "${specId}" not found` };
  }

  // Load spec content
  const specPath = path.join(projectRoot, specEntry.filePath);
  const spec = await parseSpecFile(specPath);
  
  if (!spec.valid) {
    return { success: false, error: spec.error };
  }

  // Parse scenarios
  const scenarios = parseScenarios(spec.content);
  
  if (scenarios.length === 0) {
    return { 
      success: false, 
      error: 'No scenarios found in spec',
      suggestion: 'Add scenarios in format: "## Scenario: name" followed by "- GIVEN/WHEN/THEN"'
    };
  }

  // Detect language from module path
  let language = 'typescript'; // default
  if (specEntry.modulePath) {
    if (specEntry.modulePath.endsWith('.py')) language = 'python';
    else if (specEntry.modulePath.endsWith('.go')) language = 'go';
    else if (specEntry.modulePath.endsWith('.rs')) language = 'rust';
  }

  // Get test framework
  const framework = options.framework || getTestFramework(config, language);
  const template = TEST_TEMPLATES[framework];
  
  if (!template) {
    return { 
      success: false, 
      error: `Unknown test framework: ${framework}`,
      available: Object.keys(TEST_TEMPLATES)
    };
  }

  // Generate test content
  const testParts = [];
  
  for (const scenario of scenarios) {
    const given = scenario.given.join(', ');
    const when = scenario.when.join(', ');
    const then = scenario.then.join(', ');
    
    testParts.push(template.scenario(
      specId,
      scenario.id,
      scenario.name,
      given,
      when,
      then
    ));
  }

  // Generate imports
  const imports = generateImports(specEntry, language, framework);
  
  // Wrap in test file structure
  const testContent = template.wrapper(
    specId,
    imports,
    testParts.join('\n')
  );

  // Determine output path
  let testPath;
  if (specEntry.testPath) {
    testPath = path.join(projectRoot, specEntry.testPath);
  } else if (specEntry.modulePath) {
    const basePath = specEntry.modulePath.replace(/\.[^/.]+$/, '');
    testPath = path.join(projectRoot, basePath + template.extension);
  } else {
    testPath = path.join(
      projectRoot, 
      'tests', 
      specId.replace(/:/g, '-') + template.extension
    );
  }

  // Write test file (or return content if dry run)
  if (options.dryRun) {
    return {
      success: true,
      testPath,
      content: testContent,
      scenarios: scenarios.length,
      framework
    };
  }

  await fs.mkdir(path.dirname(testPath), { recursive: true });
  await fs.writeFile(testPath, testContent, 'utf8');

  return {
    success: true,
    testPath,
    scenarios: scenarios.length,
    framework,
    message: `Generated ${scenarios.length} test(s) in ${testPath}`
  };
}

/**
 * Generate import statements
 * @param {object} specEntry - Spec entry from index
 * @param {string} language - Language name
 * @param {string} framework - Test framework
 * @returns {string} Import statements
 */
function generateImports(specEntry, language, framework) {
  const imports = [];

  if (language === 'typescript' || language === 'javascript') {
    if (framework === 'vitest') {
      imports.push("import { describe, it, expect } from 'vitest';");
    }
    // Jest doesn't need imports (globals)
    
    if (specEntry.modulePath) {
      const moduleName = path.basename(specEntry.modulePath, path.extname(specEntry.modulePath));
      imports.push(`// import { } from './${moduleName}';`);
    }
  } else if (language === 'python') {
    imports.push('import pytest');
    if (specEntry.modulePath) {
      const moduleName = specEntry.modulePath.replace(/\//g, '.').replace('.py', '');
      imports.push(`# from ${moduleName} import `);
    }
  } else if (language === 'go') {
    imports.push('import "testing"');
  }

  return imports.join('\n');
}

/**
 * Sync tests with spec changes
 * @param {string} projectRoot - Project root directory
 * @param {string} specId - Spec ID
 * @returns {Promise<object>} Sync result
 */
async function syncTests(projectRoot, specId) {
  // Load existing test file
  const config = await loadConfig(projectRoot);
  const index = await loadIndex(projectRoot);
  const specEntry = getSpec(index, specId);

  if (!specEntry || !specEntry.testPath) {
    return { success: false, error: 'No test file associated with spec' };
  }

  const testPath = path.join(projectRoot, specEntry.testPath);
  let existingContent;
  
  try {
    existingContent = await fs.readFile(testPath, 'utf8');
  } catch {
    // Test file doesn't exist, generate fresh
    return generateTests(projectRoot, specId);
  }

  // Parse existing scenarios in test file
  const existingScenarios = new Set();
  const scenarioRegex = /@telos-scenario\s+[^:]+:([^\s]+)/g;
  let match;
  while ((match = scenarioRegex.exec(existingContent)) !== null) {
    existingScenarios.add(match[1]);
  }

  // Parse scenarios from spec
  const specPath = path.join(projectRoot, specEntry.filePath);
  const spec = await parseSpecFile(specPath);
  const specScenarios = parseScenarios(spec.content);

  // Find new scenarios
  const newScenarios = specScenarios.filter(s => !existingScenarios.has(s.id));
  const removedScenarios = [...existingScenarios].filter(
    id => !specScenarios.find(s => s.id === id)
  );

  return {
    success: true,
    existingCount: existingScenarios.size,
    newScenarios: newScenarios.map(s => s.name),
    removedScenarios,
    message: newScenarios.length > 0 
      ? `Found ${newScenarios.length} new scenario(s) to add`
      : 'Tests are in sync with spec'
  };
}

// Helper functions
function getDescribeName(specId) {
  const parts = specId.split(':');
  return parts[parts.length - 1];
}

function getClassName(specId) {
  const parts = specId.split(':');
  return toPascalCase(parts[parts.length - 1]);
}

function getPackageName(specId) {
  const parts = specId.split(':');
  if (parts.length > 2) {
    return parts[2].split('/').pop();
  }
  return 'main';
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toSnakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

function toPascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, c => c.toUpperCase());
}

module.exports = {
  parseScenarios,
  generateTests,
  syncTests,
  TEST_TEMPLATES
};
