/**
 * Telos-SDD Validator
 * 
 * Validates specs, code annotations, tests, and orphans.
 * Returns structured results with exit codes for CI.
 */

const path = require('path');
const { buildIndex, validateIndex, getLineage } = require('./spec-index');
const { scanDirectory, findOrphans, validateAnnotations } = require('./annotation-scanner');
const { loadConfig, isHardEnforcement } = require('./config');
const { parseSpecFile } = require('./spec-parser');

// Exit codes
const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;

/**
 * Run full validation
 * @param {string} projectRoot - Project root directory
 * @param {object} options - Validation options
 * @returns {Promise<object>} Validation results
 */
async function validate(projectRoot, options = {}) {
  const config = await loadConfig(projectRoot);
  const results = {
    timestamp: new Date().toISOString(),
    projectRoot,
    valid: true,
    exitCode: EXIT_SUCCESS,
    sections: {}
  };

  // Build spec index
  const index = await buildIndex(projectRoot);

  // Run requested validations
  if (options.all || options.specs !== false) {
    results.sections.specs = await validateSpecs(projectRoot, index, config);
    if (!results.sections.specs.valid && isHardEnforcement(config, 'specs')) {
      results.valid = false;
      results.exitCode = EXIT_FAILURE;
    }
  }

  if (options.all || options.links !== false) {
    results.sections.links = await validateLinks(projectRoot, index, config);
    if (!results.sections.links.valid && isHardEnforcement(config, 'links')) {
      results.valid = false;
      results.exitCode = EXIT_FAILURE;
    }
  }

  if (options.all || options.tests !== false) {
    results.sections.tests = await validateTests(projectRoot, index, config);
    if (!results.sections.tests.valid && isHardEnforcement(config, 'tests')) {
      results.valid = false;
      results.exitCode = EXIT_FAILURE;
    }
  }

  if (options.all || options.orphans !== false) {
    results.sections.orphans = await validateOrphans(projectRoot, index, config);
    if (!results.sections.orphans.valid && isHardEnforcement(config, 'orphans')) {
      results.valid = false;
      results.exitCode = EXIT_FAILURE;
    }
  }

  // Calculate summary
  results.summary = calculateSummary(results);

  return results;
}

/**
 * Validate spec structure and integrity
 * @param {string} projectRoot - Project root directory
 * @param {object} index - Spec index
 * @param {object} config - Configuration
 * @returns {Promise<object>} Spec validation results
 */
async function validateSpecs(projectRoot, index, config) {
  const result = {
    valid: true,
    specCount: Object.keys(index.specs).length,
    byLevel: {
      4: index.byLevel[4]?.length || 0,
      3: index.byLevel[3]?.length || 0,
      2: index.byLevel[2]?.length || 0,
      1: index.byLevel[1]?.length || 0
    },
    issues: [],
    parseErrors: index.errors || []
  };

  // Validate index integrity
  const indexValidation = validateIndex(index);
  result.issues.push(...indexValidation.issues);

  // Check for L4 purpose
  if (result.byLevel[4] === 0) {
    result.issues.push({
      type: 'missing_purpose',
      severity: 'error',
      message: 'No L4:purpose spec found. Run "telos spec init" to create one.'
    });
  }

  // Check for orphan specs (no parent except L4)
  for (const spec of Object.values(index.specs)) {
    if (spec.level < 4 && !spec.parent) {
      result.issues.push({
        type: 'orphan_spec',
        severity: 'warning',
        specId: spec.id,
        message: `Spec "${spec.id}" has no parent - not connected to L4:purpose`
      });
    }
  }

  // Check for circular references
  for (const spec of Object.values(index.specs)) {
    const visited = new Set();
    let current = spec;
    
    while (current && current.parent) {
      if (visited.has(current.id)) {
        result.issues.push({
          type: 'circular_reference',
          severity: 'error',
          specId: spec.id,
          message: `Circular parent reference detected starting from "${spec.id}"`
        });
        break;
      }
      visited.add(current.id);
      current = index.specs[current.parent];
    }
  }

  // Parse errors are critical
  if (result.parseErrors.length > 0) {
    result.issues.push(...result.parseErrors.map(e => ({
      type: 'parse_error',
      severity: 'error',
      file: e.file,
      message: e.error
    })));
  }

  result.valid = result.issues.filter(i => i.severity === 'error').length === 0;
  return result;
}

/**
 * Validate code-to-spec links
 * @param {string} projectRoot - Project root directory
 * @param {object} index - Spec index
 * @param {object} config - Configuration
 * @returns {Promise<object>} Link validation results
 */
async function validateLinks(projectRoot, index, config) {
  const scanResults = await scanDirectory(projectRoot, {
    ignore: config.ignore
  });

  const annotationValidation = validateAnnotations(scanResults, index);

  const result = {
    valid: annotationValidation.valid,
    totalAnnotations: annotationValidation.total,
    validAnnotations: annotationValidation.validCount,
    invalidAnnotations: annotationValidation.invalidCount,
    annotatedFiles: scanResults.annotatedFiles,
    scannedFiles: scanResults.scannedFiles,
    issues: []
  };

  // Add invalid annotation issues
  for (const invalid of annotationValidation.invalid) {
    result.issues.push({
      type: 'invalid_annotation',
      severity: 'error',
      file: invalid.relativePath,
      line: invalid.line,
      specId: invalid.specId,
      message: `Annotation references non-existent spec "${invalid.specId}"`
    });
  }

  // Check for specs without any annotations
  for (const spec of Object.values(index.specs)) {
    if (spec.level === 1 && spec.modulePath) {
      const hasAnnotation = Object.keys(scanResults.bySpec).some(
        specId => specId.startsWith(spec.id)
      );
      
      if (!hasAnnotation) {
        result.issues.push({
          type: 'unimplemented_spec',
          severity: 'warning',
          specId: spec.id,
          message: `L1 spec "${spec.id}" has no implementing code`
        });
      }
    }
  }

  return result;
}

/**
 * Validate test coverage
 * @param {string} projectRoot - Project root directory
 * @param {object} index - Spec index
 * @param {object} config - Configuration
 * @returns {Promise<object>} Test validation results
 */
async function validateTests(projectRoot, index, config) {
  const scanResults = await scanDirectory(projectRoot, {
    ignore: config.ignore
  });

  const result = {
    valid: true,
    specsWithTests: 0,
    specsWithoutTests: 0,
    scenariosTotal: 0,
    scenariosCovered: 0,
    issues: []
  };

  // Group annotations by type
  const telosAnnotations = scanResults.annotations.filter(a => a.type === 'telos');
  const testAnnotations = scanResults.annotations.filter(a => a.type === 'telos-test');
  const scenarioAnnotations = scanResults.annotations.filter(a => a.type === 'telos-scenario');

  const testedSpecs = new Set(testAnnotations.map(a => a.specId));
  const testedScenarios = new Set(scenarioAnnotations.map(a => a.specId));

  // Check each L1 spec has tests
  for (const spec of Object.values(index.specs)) {
    if (spec.level !== 1) continue;

    const hasTests = testedSpecs.has(spec.id) || 
                     Array.from(testedSpecs).some(id => id.startsWith(spec.id));

    if (hasTests) {
      result.specsWithTests++;
    } else {
      result.specsWithoutTests++;
      result.issues.push({
        type: 'missing_tests',
        severity: 'error',
        specId: spec.id,
        message: `Spec "${spec.id}" has no @telos-test annotations`
      });
    }

    // Check scenario coverage
    result.scenariosTotal += spec.scenarioCount || 0;
    // This is simplified - would need to parse spec to get actual scenarios
  }

  result.valid = result.issues.filter(i => i.severity === 'error').length === 0;
  return result;
}

/**
 * Validate orphaned code
 * @param {string} projectRoot - Project root directory
 * @param {object} index - Spec index
 * @param {object} config - Configuration
 * @returns {Promise<object>} Orphan validation results
 */
async function validateOrphans(projectRoot, index, config) {
  const orphans = await findOrphans(projectRoot, {
    ignore: config.ignore
  });

  const result = {
    valid: orphans.length === 0,
    orphanCount: orphans.length,
    orphans: orphans.map(o => ({
      type: 'orphan_code',
      severity: 'error',
      file: o.relativePath,
      line: o.line,
      name: o.name,
      codeType: o.type,
      message: `${o.type} "${o.name}" has no @telos annotation`
    })),
    issues: []
  };

  result.issues = result.orphans;
  return result;
}

/**
 * Calculate summary from validation results
 * @param {object} results - Full validation results
 * @returns {object} Summary object
 */
function calculateSummary(results) {
  const allIssues = [];
  
  for (const section of Object.values(results.sections)) {
    if (section.issues) {
      allIssues.push(...section.issues);
    }
  }

  const errors = allIssues.filter(i => i.severity === 'error');
  const warnings = allIssues.filter(i => i.severity === 'warning');

  return {
    totalIssues: allIssues.length,
    errors: errors.length,
    warnings: warnings.length,
    specs: results.sections.specs?.specCount || 0,
    annotations: results.sections.links?.totalAnnotations || 0,
    orphans: results.sections.orphans?.orphanCount || 0
  };
}

/**
 * Format validation results as text
 * @param {object} results - Validation results
 * @returns {string} Formatted text
 */
function formatResults(results) {
  const lines = [];
  
  lines.push('');
  lines.push('Telos Validation Report');
  lines.push('═'.repeat(60));
  lines.push('');

  // Specs section
  if (results.sections.specs) {
    const s = results.sections.specs;
    const status = s.valid ? '✓ PASS' : '✗ FAIL';
    lines.push(`Spec Structure ${'.'.repeat(44)} ${status}`);
    lines.push(`  - ${s.specCount} specs across 4 levels`);
    lines.push(`    L4:purpose: ${s.byLevel[4]}, L3:experience: ${s.byLevel[3]}, L2:contract: ${s.byLevel[2]}, L1:function: ${s.byLevel[1]}`);
    
    if (s.issues.length > 0) {
      for (const issue of s.issues.slice(0, 5)) {
        lines.push(`  ${issue.severity === 'error' ? '✗' : '⚠'} ${issue.message}`);
      }
      if (s.issues.length > 5) {
        lines.push(`  ... and ${s.issues.length - 5} more issues`);
      }
    }
    lines.push('');
  }

  // Links section
  if (results.sections.links) {
    const l = results.sections.links;
    const status = l.valid ? '✓ PASS' : '✗ FAIL';
    lines.push(`Code-Spec Links ${'.'.repeat(43)} ${status}`);
    lines.push(`  - ${l.totalAnnotations} annotations in ${l.annotatedFiles} files`);
    lines.push(`  - ${l.validAnnotations} valid, ${l.invalidAnnotations} invalid`);
    
    if (l.issues.length > 0) {
      for (const issue of l.issues.slice(0, 5)) {
        lines.push(`  ✗ ${issue.file}:${issue.line} → ${issue.specId}`);
      }
      if (l.issues.length > 5) {
        lines.push(`  ... and ${l.issues.length - 5} more issues`);
      }
    }
    lines.push('');
  }

  // Tests section
  if (results.sections.tests) {
    const t = results.sections.tests;
    const status = t.valid ? '✓ PASS' : '⚠ WARN';
    lines.push(`Test Coverage ${'.'.repeat(45)} ${status}`);
    lines.push(`  - ${t.specsWithTests}/${t.specsWithTests + t.specsWithoutTests} L1 specs have tests`);
    
    if (t.issues.length > 0) {
      for (const issue of t.issues.slice(0, 5)) {
        lines.push(`  ⚠ ${issue.specId} - missing tests`);
      }
      if (t.issues.length > 5) {
        lines.push(`  ... and ${t.issues.length - 5} more specs without tests`);
      }
    }
    lines.push('');
  }

  // Orphans section
  if (results.sections.orphans) {
    const o = results.sections.orphans;
    const status = o.valid ? '✓ PASS' : '✗ FAIL';
    lines.push(`Orphaned Code ${'.'.repeat(45)} ${status}`);
    lines.push(`  - ${o.orphanCount} functions/classes without @telos annotations`);
    
    if (o.orphans.length > 0) {
      for (const orphan of o.orphans.slice(0, 5)) {
        lines.push(`  ✗ ${orphan.file}:${orphan.line} - ${orphan.name}`);
      }
      if (o.orphans.length > 5) {
        lines.push(`  ... and ${o.orphans.length - 5} more orphans`);
      }
    }
    lines.push('');
  }

  // Summary
  lines.push('═'.repeat(60));
  const overallStatus = results.valid ? 'PASS' : 'FAIL';
  const summary = results.summary;
  lines.push(`Overall: ${overallStatus} (${summary.errors} errors, ${summary.warnings} warnings)`);
  lines.push(`Exit code: ${results.exitCode}`);
  lines.push('');

  return lines.join('\n');
}

module.exports = {
  validate,
  validateSpecs,
  validateLinks,
  validateTests,
  validateOrphans,
  formatResults,
  EXIT_SUCCESS,
  EXIT_FAILURE
};
