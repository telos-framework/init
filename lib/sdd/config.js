/**
 * Telos-SDD Configuration
 * 
 * Loads and manages .telosrc.json configuration
 */

const fs = require('fs').promises;
const path = require('path');

const DEFAULT_CONFIG = {
  version: '1.0',
  enforcement: {
    specs: 'hard',
    links: 'hard',
    tests: 'hard',
    orphans: 'hard'
  },
  languages: {
    typescript: {
      extensions: ['.ts', '.tsx'],
      annotationPrefix: '//',
      testPatterns: ['**/*.test.ts', '**/*.spec.ts']
    },
    javascript: {
      extensions: ['.js', '.jsx', '.mjs', '.cjs'],
      annotationPrefix: '//',
      testPatterns: ['**/*.test.js', '**/*.spec.js']
    },
    python: {
      extensions: ['.py'],
      annotationPrefix: '#',
      testPatterns: ['**/test_*.py', '**/*_test.py']
    },
    go: {
      extensions: ['.go'],
      annotationPrefix: '//',
      testPatterns: ['**/*_test.go']
    },
    rust: {
      extensions: ['.rs'],
      annotationPrefix: '//',
      testPatterns: ['**/tests/**/*.rs']
    }
  },
  paths: {
    specs: 'telos/specs',
    index: 'telos/index.json',
    orphans: 'telos/orphans.json',
    telos: 'telos/TELOS.md'
  },
  ignore: [
    'node_modules',
    'dist',
    'build',
    '.git',
    '.telos',
    'telos',
    'coverage',
    '__pycache__',
    '.pytest_cache',
    'target',
    'vendor'
  ],
  testFrameworks: {
    typescript: 'vitest',
    javascript: 'jest',
    python: 'pytest',
    go: 'go-test',
    rust: 'cargo-test'
  }
};

/**
 * Load configuration from .telosrc.json
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<object>} Merged configuration
 */
async function loadConfig(projectRoot) {
  const configPath = path.join(projectRoot, 'telos', '.telosrc.json');
  
  try {
    const content = await fs.readFile(configPath, 'utf8');
    const userConfig = JSON.parse(content);
    return mergeConfig(DEFAULT_CONFIG, userConfig);
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Save configuration to .telosrc.json
 * @param {string} projectRoot - Project root directory
 * @param {object} config - Configuration object
 */
async function saveConfig(projectRoot, config) {
  const configPath = path.join(projectRoot, 'telos', '.telosrc.json');
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
  return configPath;
}

/**
 * Deep merge two config objects
 * @param {object} base - Base configuration
 * @param {object} override - Override configuration
 * @returns {object} Merged configuration
 */
function mergeConfig(base, override) {
  const result = { ...base };
  
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = mergeConfig(result[key] || {}, value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Check if enforcement level is hard (blocking)
 * @param {object} config - Configuration object
 * @param {string} type - Enforcement type (specs, links, tests, orphans)
 * @returns {boolean} True if hard enforcement
 */
function isHardEnforcement(config, type) {
  return config.enforcement[type] === 'hard';
}

/**
 * Get test patterns for a language
 * @param {object} config - Configuration object
 * @param {string} language - Language name
 * @returns {string[]} Test file patterns
 */
function getTestPatterns(config, language) {
  return config.languages[language]?.testPatterns || [];
}

/**
 * Get test framework for a language
 * @param {object} config - Configuration object
 * @param {string} language - Language name
 * @returns {string} Test framework name
 */
function getTestFramework(config, language) {
  return config.testFrameworks[language] || 'unknown';
}

/**
 * Check if a path should be ignored
 * @param {string} filePath - File path
 * @param {object} config - Configuration object
 * @returns {boolean} True if path should be ignored
 */
function shouldIgnore(filePath, config) {
  const parts = filePath.split(path.sep);
  return parts.some(part => config.ignore.includes(part));
}

/**
 * Initialize default configuration
 * @param {string} projectRoot - Project root directory
 * @param {object} options - Initialization options
 * @returns {Promise<object>} Created configuration
 */
async function initConfig(projectRoot, options = {}) {
  const config = { ...DEFAULT_CONFIG };
  
  // Detect languages from project
  if (options.detectLanguages !== false) {
    const detected = await detectProjectLanguages(projectRoot);
    
    // Filter languages to only those detected
    if (detected.length > 0 && !options.allLanguages) {
      const filteredLanguages = {};
      for (const lang of detected) {
        if (config.languages[lang]) {
          filteredLanguages[lang] = config.languages[lang];
        }
      }
      config.languages = filteredLanguages;
    }
  }

  // Detect test framework
  if (options.detectTestFramework !== false) {
    const testFrameworks = await detectTestFrameworks(projectRoot);
    config.testFrameworks = { ...config.testFrameworks, ...testFrameworks };
  }

  await saveConfig(projectRoot, config);
  return config;
}

/**
 * Detect languages used in project
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<string[]>} Array of language names
 */
async function detectProjectLanguages(projectRoot) {
  const languages = new Set();
  const indicators = {
    typescript: ['tsconfig.json', 'package.json'],
    javascript: ['package.json'],
    python: ['requirements.txt', 'pyproject.toml', 'setup.py'],
    go: ['go.mod'],
    rust: ['Cargo.toml']
  };

  for (const [lang, files] of Object.entries(indicators)) {
    for (const file of files) {
      try {
        await fs.access(path.join(projectRoot, file));
        
        // For package.json, check for TypeScript
        if (file === 'package.json' && lang === 'typescript') {
          const content = await fs.readFile(path.join(projectRoot, file), 'utf8');
          const pkg = JSON.parse(content);
          if (pkg.devDependencies?.typescript || pkg.dependencies?.typescript) {
            languages.add('typescript');
          } else {
            languages.add('javascript');
          }
        } else if (file !== 'package.json') {
          languages.add(lang);
        }
      } catch {
        // File doesn't exist
      }
    }
  }

  return Array.from(languages);
}

/**
 * Detect test frameworks in project
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<object>} Test framework mapping
 */
async function detectTestFrameworks(projectRoot) {
  const frameworks = {};

  try {
    const pkgPath = path.join(projectRoot, 'package.json');
    const content = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(content);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (deps.vitest) {
      frameworks.typescript = 'vitest';
      frameworks.javascript = 'vitest';
    } else if (deps.jest) {
      frameworks.typescript = 'jest';
      frameworks.javascript = 'jest';
    } else if (deps.mocha) {
      frameworks.javascript = 'mocha';
    }

    if (deps.playwright) {
      frameworks.e2e = 'playwright';
    } else if (deps.cypress) {
      frameworks.e2e = 'cypress';
    }
  } catch {
    // No package.json
  }

  // Check for pytest
  try {
    const pyproject = path.join(projectRoot, 'pyproject.toml');
    const content = await fs.readFile(pyproject, 'utf8');
    if (content.includes('pytest')) {
      frameworks.python = 'pytest';
    }
  } catch {
    // No pyproject.toml
  }

  return frameworks;
}

module.exports = {
  DEFAULT_CONFIG,
  loadConfig,
  saveConfig,
  mergeConfig,
  isHardEnforcement,
  getTestPatterns,
  getTestFramework,
  shouldIgnore,
  initConfig,
  detectProjectLanguages,
  detectTestFrameworks
};
