/**
 * Telos-SDD Annotation Scanner
 * 
 * Scans source code files for @telos annotations and validates them against specs.
 * Supports multiple languages: TypeScript, JavaScript, Python, Go, Rust
 */

const fs = require('fs').promises;
const path = require('path');

// Language-specific annotation patterns
const ANNOTATION_PATTERNS = {
  typescript: {
    extensions: ['.ts', '.tsx'],
    telos: /\/\/\s*@telos\s+(.+)/g,
    telosTest: /\/\/\s*@telos-test\s+(.+)/g,
    telosScenario: /\/\/\s*@telos-scenario\s+(.+)/g
  },
  javascript: {
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    telos: /\/\/\s*@telos\s+(.+)/g,
    telosTest: /\/\/\s*@telos-test\s+(.+)/g,
    telosScenario: /\/\/\s*@telos-scenario\s+(.+)/g
  },
  python: {
    extensions: ['.py'],
    telos: /#\s*@telos\s+(.+)/g,
    telosTest: /#\s*@telos-test\s+(.+)/g,
    telosScenario: /#\s*@telos-scenario\s+(.+)/g
  },
  go: {
    extensions: ['.go'],
    telos: /\/\/\s*@telos\s+(.+)/g,
    telosTest: /\/\/\s*@telos-test\s+(.+)/g,
    telosScenario: /\/\/\s*@telos-scenario\s+(.+)/g
  },
  rust: {
    extensions: ['.rs'],
    telos: /\/\/\s*@telos\s+(.+)/g,
    telosTest: /\/\/\s*@telos-test\s+(.+)/g,
    telosScenario: /\/\/\s*@telos-scenario\s+(.+)/g
  }
};

/**
 * Get language config by file extension
 * @param {string} filePath - File path
 * @returns {object|null} Language config or null
 */
function getLanguageConfig(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  for (const [lang, config] of Object.entries(ANNOTATION_PATTERNS)) {
    if (config.extensions.includes(ext)) {
      return { language: lang, ...config };
    }
  }
  
  return null;
}

/**
 * Scan a single file for annotations
 * @param {string} filePath - Path to file
 * @returns {Promise<object>} Scan result
 */
async function scanFile(filePath) {
  const langConfig = getLanguageConfig(filePath);
  
  if (!langConfig) {
    return { filePath, supported: false, annotations: [] };
  }

  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');
  const annotations = [];

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    
    // Check for @telos annotation
    const telosMatch = line.match(/(?:\/\/|#)\s*@telos\s+(.+)/);
    if (telosMatch) {
      annotations.push({
        type: 'telos',
        specId: telosMatch[1].trim(),
        line: lineNum + 1,
        raw: line.trim()
      });
    }

    // Check for @telos-test annotation
    const testMatch = line.match(/(?:\/\/|#)\s*@telos-test\s+(.+)/);
    if (testMatch) {
      annotations.push({
        type: 'telos-test',
        specId: testMatch[1].trim(),
        line: lineNum + 1,
        raw: line.trim()
      });
    }

    // Check for @telos-scenario annotation
    const scenarioMatch = line.match(/(?:\/\/|#)\s*@telos-scenario\s+(.+)/);
    if (scenarioMatch) {
      annotations.push({
        type: 'telos-scenario',
        specId: scenarioMatch[1].trim(),
        line: lineNum + 1,
        raw: line.trim()
      });
    }
  }

  return {
    filePath,
    supported: true,
    language: langConfig.language,
    annotations
  };
}

/**
 * Scan directory recursively for annotations
 * @param {string} dir - Directory to scan
 * @param {object} options - Scan options
 * @returns {Promise<object>} Scan results
 */
async function scanDirectory(dir, options = {}) {
  const {
    ignore = ['node_modules', 'dist', 'build', '.git', '.telos', 'telos'],
    testPatterns = ['**/*.test.*', '**/*.spec.*', '**/test_*', '**/*_test.*']
  } = options;

  const results = {
    scannedFiles: 0,
    annotatedFiles: 0,
    annotations: [],
    byFile: {},
    bySpec: {},
    errors: []
  };

  async function scan(currentDir) {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Skip ignored directories
      if (entry.isDirectory()) {
        if (ignore.includes(entry.name)) continue;
        await scan(fullPath);
        continue;
      }

      // Only scan supported file types
      if (!entry.isFile()) continue;
      const langConfig = getLanguageConfig(fullPath);
      if (!langConfig) continue;

      results.scannedFiles++;

      try {
        const fileResult = await scanFile(fullPath);
        
        if (fileResult.annotations.length > 0) {
          results.annotatedFiles++;
          results.byFile[fullPath] = fileResult.annotations;

          for (const annotation of fileResult.annotations) {
            // Add file context to annotation
            const fullAnnotation = {
              ...annotation,
              filePath: fullPath,
              relativePath: path.relative(dir, fullPath)
            };

            results.annotations.push(fullAnnotation);

            // Group by spec ID
            if (!results.bySpec[annotation.specId]) {
              results.bySpec[annotation.specId] = [];
            }
            results.bySpec[annotation.specId].push(fullAnnotation);
          }
        }
      } catch (error) {
        results.errors.push({
          filePath: fullPath,
          error: error.message
        });
      }
    }
  }

  await scan(dir);
  return results;
}

/**
 * Find functions/classes without @telos annotations (orphans)
 * @param {string} dir - Directory to scan
 * @param {object} options - Scan options
 * @returns {Promise<object[]>} Array of orphaned code locations
 */
async function findOrphans(dir, options = {}) {
  const orphans = [];
  const {
    ignore = ['node_modules', 'dist', 'build', '.git', '.telos', 'telos']
  } = options;

  // Function/class detection patterns by language
  const patterns = {
    typescript: {
      function: /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/gm,
      arrowExport: /^export\s+const\s+(\w+)\s*=/gm,
      class: /^(?:export\s+)?class\s+(\w+)/gm
    },
    javascript: {
      function: /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/gm,
      arrowExport: /^(?:module\.exports\.)?(\w+)\s*=\s*(?:async\s+)?(?:function|\()/gm,
      class: /^(?:export\s+)?class\s+(\w+)/gm
    },
    python: {
      function: /^def\s+(\w+)/gm,
      class: /^class\s+(\w+)/gm
    },
    go: {
      function: /^func\s+(?:\([^)]+\)\s+)?(\w+)/gm
    },
    rust: {
      function: /^(?:pub\s+)?(?:async\s+)?fn\s+(\w+)/gm
    }
  };

  async function scan(currentDir) {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        if (ignore.includes(entry.name)) continue;
        await scan(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;
      const langConfig = getLanguageConfig(fullPath);
      if (!langConfig) continue;

      try {
        const content = await fs.readFile(fullPath, 'utf8');
        const lines = content.split('\n');
        const langPatterns = patterns[langConfig.language] || {};

        // Find all function/class definitions
        const definitions = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          for (const [type, regex] of Object.entries(langPatterns)) {
            regex.lastIndex = 0;
            const match = regex.exec(line);
            if (match) {
              definitions.push({
                type,
                name: match[1],
                line: i + 1
              });
            }
          }
        }

        // Check which definitions have @telos annotations
        for (const def of definitions) {
          // Look for @telos in the 5 lines before the definition
          const startLine = Math.max(0, def.line - 6);
          const precedingLines = lines.slice(startLine, def.line - 1);
          const hasAnnotation = precedingLines.some(l => 
            l.includes('@telos ') || l.includes('@telos-test ')
          );

          if (!hasAnnotation) {
            orphans.push({
              filePath: fullPath,
              relativePath: path.relative(dir, fullPath),
              type: def.type,
              name: def.name,
              line: def.line,
              language: langConfig.language
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  await scan(dir);
  return orphans;
}

/**
 * Validate annotations against spec index
 * @param {object} scanResults - Results from scanDirectory
 * @param {object} specIndex - Spec index from buildIndex
 * @returns {object} Validation results
 */
function validateAnnotations(scanResults, specIndex) {
  const validation = {
    valid: true,
    total: scanResults.annotations.length,
    validCount: 0,
    invalidCount: 0,
    invalid: []
  };

  for (const annotation of scanResults.annotations) {
    const spec = specIndex.specs[annotation.specId];
    
    if (!spec) {
      validation.valid = false;
      validation.invalidCount++;
      validation.invalid.push({
        ...annotation,
        error: `Spec "${annotation.specId}" not found`
      });
    } else {
      validation.validCount++;
    }
  }

  return validation;
}

/**
 * Generate annotation comment for a spec ID
 * @param {string} specId - Spec ID
 * @param {string} language - Language name
 * @param {string} type - Annotation type ('telos', 'telos-test', 'telos-scenario')
 * @returns {string} Annotation comment
 */
function generateAnnotation(specId, language, type = 'telos') {
  const commentPrefix = language === 'python' ? '#' : '//';
  return `${commentPrefix} @${type} ${specId}`;
}

module.exports = {
  ANNOTATION_PATTERNS,
  getLanguageConfig,
  scanFile,
  scanDirectory,
  findOrphans,
  validateAnnotations,
  generateAnnotation
};
