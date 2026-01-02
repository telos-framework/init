/**
 * Telos-SDD Brownfield Discovery
 * 
 * Scans existing codebases to propose spec structure.
 * Generates initial specs from code analysis.
 */

const fs = require('fs').promises;
const path = require('path');
const { loadConfig, detectProjectLanguages } = require('./config');
const { generateSpec, generateTelosEntry } = require('./spec-templates');
const { LEVEL_FOLDERS } = require('./spec-parser');

/**
 * Discover and propose spec structure from existing codebase
 * @param {string} projectRoot - Project root directory
 * @param {object} options - Discovery options
 * @returns {Promise<object>} Discovery results
 */
async function discover(projectRoot, options = {}) {
  const config = await loadConfig(projectRoot);
  
  const results = {
    timestamp: new Date().toISOString(),
    projectRoot,
    languages: [],
    modules: [],
    functions: [],
    proposedSpecs: {
      L4: null,
      L3: [],
      L2: [],
      L1: []
    },
    summary: {}
  };

  // Detect languages
  results.languages = await detectProjectLanguages(projectRoot);
  
  // Scan for project metadata
  const projectMeta = await scanProjectMetadata(projectRoot);
  
  // Propose L4 purpose
  results.proposedSpecs.L4 = proposeL4Purpose(projectMeta);
  
  // Scan for modules and functions
  const codeStructure = await scanCodeStructure(projectRoot, config);
  results.modules = codeStructure.modules;
  results.functions = codeStructure.functions;
  
  // Propose L3 experiences from routes/features
  results.proposedSpecs.L3 = proposeL3Experiences(codeStructure, projectMeta);
  
  // Propose L2 contracts from APIs/components
  results.proposedSpecs.L2 = proposeL2Contracts(codeStructure);
  
  // Propose L1 functions from modules
  results.proposedSpecs.L1 = proposeL1Functions(codeStructure);
  
  // Calculate summary
  results.summary = {
    languagesDetected: results.languages.length,
    modulesFound: results.modules.length,
    functionsFound: results.functions.length,
    l3Proposed: results.proposedSpecs.L3.length,
    l2Proposed: results.proposedSpecs.L2.length,
    l1Proposed: results.proposedSpecs.L1.length
  };

  return results;
}

/**
 * Scan project metadata (README, package.json, etc.)
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<object>} Project metadata
 */
async function scanProjectMetadata(projectRoot) {
  const meta = {
    name: path.basename(projectRoot),
    description: '',
    purpose: '',
    routes: [],
    dependencies: {}
  };

  // Try README
  const readmePaths = ['README.md', 'readme.md', 'README.txt'];
  for (const readmePath of readmePaths) {
    try {
      const content = await fs.readFile(path.join(projectRoot, readmePath), 'utf8');
      meta.readmeContent = content;
      
      // Extract first paragraph as description
      const lines = content.split('\n');
      let foundHeader = false;
      const descLines = [];
      
      for (const line of lines) {
        if (line.startsWith('# ')) {
          meta.name = line.replace('# ', '').trim();
          foundHeader = true;
          continue;
        }
        if (foundHeader && line.trim() && !line.startsWith('#')) {
          descLines.push(line);
          if (descLines.length >= 3) break;
        }
        if (foundHeader && line.startsWith('#')) break;
      }
      
      meta.description = descLines.join(' ').slice(0, 200);
      break;
    } catch {}
  }

  // Try package.json
  try {
    const pkgPath = path.join(projectRoot, 'package.json');
    const content = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(content);
    
    if (!meta.name || meta.name === path.basename(projectRoot)) {
      meta.name = pkg.name;
    }
    if (!meta.description && pkg.description) {
      meta.description = pkg.description;
    }
    
    meta.dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
  } catch {}

  // Try pyproject.toml
  try {
    const pyprojectPath = path.join(projectRoot, 'pyproject.toml');
    const content = await fs.readFile(pyprojectPath, 'utf8');
    
    const nameMatch = content.match(/name\s*=\s*"([^"]+)"/);
    if (nameMatch) meta.name = nameMatch[1];
    
    const descMatch = content.match(/description\s*=\s*"([^"]+)"/);
    if (descMatch) meta.description = descMatch[1];
  } catch {}

  return meta;
}

/**
 * Scan code structure for modules, functions, routes
 * @param {string} projectRoot - Project root directory
 * @param {object} config - Configuration
 * @returns {Promise<object>} Code structure
 */
async function scanCodeStructure(projectRoot, config) {
  const structure = {
    modules: [],
    functions: [],
    routes: [],
    components: []
  };

  const sourceDirs = ['src', 'lib', 'app', 'api', 'routes', 'components', 'pages'];
  
  for (const sourceDir of sourceDirs) {
    const sourcePath = path.join(projectRoot, sourceDir);
    try {
      await fs.access(sourcePath);
      await scanDirectory(sourcePath, projectRoot, structure, config);
    } catch {}
  }

  return structure;
}

/**
 * Recursively scan directory for code files
 * @param {string} dir - Directory to scan
 * @param {string} projectRoot - Project root
 * @param {object} structure - Structure to populate
 * @param {object} config - Configuration
 */
async function scanDirectory(dir, projectRoot, structure, config) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (config.ignore.includes(entry.name)) continue;
    
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(projectRoot, fullPath);
    
    if (entry.isDirectory()) {
      await scanDirectory(fullPath, projectRoot, structure, config);
      continue;
    }
    
    if (!entry.isFile()) continue;
    
    const ext = path.extname(entry.name).toLowerCase();
    const supportedExts = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs'];
    
    if (!supportedExts.includes(ext)) continue;
    
    // Skip test files
    if (entry.name.includes('.test.') || entry.name.includes('.spec.') ||
        entry.name.includes('_test.') || entry.name.startsWith('test_')) {
      continue;
    }

    try {
      const content = await fs.readFile(fullPath, 'utf8');
      const module = await analyzeModule(relativePath, content, ext);
      
      if (module) {
        structure.modules.push(module);
        structure.functions.push(...module.functions);
        structure.routes.push(...module.routes);
        structure.components.push(...module.components);
      }
    } catch {}
  }
}

/**
 * Analyze a module file
 * @param {string} relativePath - Relative path to file
 * @param {string} content - File content
 * @param {string} ext - File extension
 * @returns {object|null} Module analysis
 */
async function analyzeModule(relativePath, content, ext) {
  const module = {
    path: relativePath,
    name: path.basename(relativePath, ext),
    functions: [],
    routes: [],
    components: [],
    exports: []
  };

  const lines = content.split('\n');

  // Analyze based on language
  if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
    analyzeJavaScript(module, content, lines);
  } else if (ext === '.py') {
    analyzePython(module, content, lines);
  } else if (ext === '.go') {
    analyzeGo(module, content, lines);
  } else if (ext === '.rs') {
    analyzeRust(module, content, lines);
  }

  return module.functions.length > 0 || module.routes.length > 0 || module.components.length > 0
    ? module
    : null;
}

/**
 * Analyze JavaScript/TypeScript file
 */
function analyzeJavaScript(module, content, lines) {
  // Find function definitions
  const funcPatterns = [
    /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/gm,
    /^(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[^=])\s*=>/gm,
    /^\s*(\w+)\s*\([^)]*\)\s*{/gm
  ];

  for (const pattern of funcPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const name = match[1];
      if (name && !['if', 'for', 'while', 'switch', 'catch'].includes(name)) {
        module.functions.push({
          name,
          path: module.path,
          type: 'function'
        });
      }
    }
  }

  // Find routes (Express, Next.js, etc.)
  const routePatterns = [
    /(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
    /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(/gi
  ];

  for (const pattern of routePatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      module.routes.push({
        method: match[1].toUpperCase(),
        path: match[2] || module.path,
        modulePath: module.path
      });
    }
  }

  // Find React components
  if (module.path.includes('component') || ['.tsx', '.jsx'].includes(path.extname(module.path))) {
    const componentPattern = /(?:export\s+)?(?:default\s+)?function\s+([A-Z]\w+)/g;
    let match;
    while ((match = componentPattern.exec(content)) !== null) {
      module.components.push({
        name: match[1],
        path: module.path,
        type: 'component'
      });
    }
  }
}

/**
 * Analyze Python file
 */
function analyzePython(module, content, lines) {
  // Find function definitions
  const funcPattern = /^def\s+(\w+)\s*\(/gm;
  let match;
  while ((match = funcPattern.exec(content)) !== null) {
    if (!match[1].startsWith('_') || match[1] === '__init__') {
      module.functions.push({
        name: match[1],
        path: module.path,
        type: 'function'
      });
    }
  }

  // Find class definitions
  const classPattern = /^class\s+(\w+)/gm;
  while ((match = classPattern.exec(content)) !== null) {
    module.components.push({
      name: match[1],
      path: module.path,
      type: 'class'
    });
  }

  // Find routes (Flask, FastAPI)
  const routePattern = /@(?:app|router)\.(?:route|get|post|put|delete)\s*\(\s*['"]([^'"]+)['"]/gi;
  while ((match = routePattern.exec(content)) !== null) {
    module.routes.push({
      path: match[1],
      modulePath: module.path
    });
  }
}

/**
 * Analyze Go file
 */
function analyzeGo(module, content, lines) {
  const funcPattern = /^func\s+(?:\([^)]+\)\s+)?(\w+)/gm;
  let match;
  while ((match = funcPattern.exec(content)) !== null) {
    if (match[1][0] === match[1][0].toUpperCase()) { // Exported
      module.functions.push({
        name: match[1],
        path: module.path,
        type: 'function'
      });
    }
  }
}

/**
 * Analyze Rust file
 */
function analyzeRust(module, content, lines) {
  const funcPattern = /^pub\s+(?:async\s+)?fn\s+(\w+)/gm;
  let match;
  while ((match = funcPattern.exec(content)) !== null) {
    module.functions.push({
      name: match[1],
      path: module.path,
      type: 'function'
    });
  }
}

/**
 * Propose L4 purpose spec
 */
function proposeL4Purpose(projectMeta) {
  return {
    id: 'L4:purpose',
    title: projectMeta.name,
    purpose: projectMeta.description || `A ${projectMeta.name} application`,
    data: {
      title: projectMeta.name,
      purpose: projectMeta.description
    }
  };
}

/**
 * Propose L3 experience specs
 */
function proposeL3Experiences(codeStructure, projectMeta) {
  const experiences = [];
  
  // Group routes into journeys
  const routeGroups = {};
  for (const route of codeStructure.routes) {
    const base = route.path.split('/').filter(Boolean)[1] || 'main';
    if (!routeGroups[base]) {
      routeGroups[base] = [];
    }
    routeGroups[base].push(route);
  }

  for (const [name, routes] of Object.entries(routeGroups)) {
    experiences.push({
      id: `L3:experience:${name}-journey`,
      title: `${capitalize(name)} Journey`,
      routes: routes.length,
      data: {
        id: `${name}-journey`,
        title: `${capitalize(name)} Journey`,
        parent: 'L4:purpose',
        overview: `User journey for ${name} functionality`
      }
    });
  }

  // Add experiences for major component groups
  const componentDirs = new Set(
    codeStructure.components.map(c => path.dirname(c.path).split('/').pop())
  );

  for (const dir of componentDirs) {
    if (!routeGroups[dir]) {
      experiences.push({
        id: `L3:experience:${dir}`,
        title: `${capitalize(dir)} Experience`,
        data: {
          id: dir,
          title: `${capitalize(dir)} Experience`,
          parent: 'L4:purpose'
        }
      });
    }
  }

  return experiences;
}

/**
 * Propose L2 contract specs
 */
function proposeL2Contracts(codeStructure) {
  const contracts = [];
  
  // API contracts from routes
  const routeModules = new Set(codeStructure.routes.map(r => r.modulePath));
  for (const modulePath of routeModules) {
    const name = path.basename(modulePath, path.extname(modulePath));
    const routes = codeStructure.routes.filter(r => r.modulePath === modulePath);
    
    contracts.push({
      id: `L2:contract:${modulePath.replace(/[/.]/g, '-')}`,
      title: `${capitalize(name)} API`,
      isApi: true,
      routes: routes.length,
      data: {
        path: modulePath,
        title: `${capitalize(name)} API Contract`,
        isApi: true,
        modulePath
      }
    });
  }

  // Component contracts
  const componentModules = new Set(codeStructure.components.map(c => c.path));
  for (const modulePath of componentModules) {
    const name = path.basename(modulePath, path.extname(modulePath));
    
    contracts.push({
      id: `L2:contract:${modulePath.replace(/[/.]/g, '-')}`,
      title: `${capitalize(name)} Component`,
      isApi: false,
      data: {
        path: modulePath,
        title: `${capitalize(name)} Component Contract`,
        isApi: false,
        modulePath
      }
    });
  }

  return contracts;
}

/**
 * Propose L1 function specs
 */
function proposeL1Functions(codeStructure) {
  const functions = [];
  
  // Group functions by module
  const byModule = {};
  for (const fn of codeStructure.functions) {
    if (!byModule[fn.path]) {
      byModule[fn.path] = [];
    }
    byModule[fn.path].push(fn);
  }

  for (const [modulePath, fns] of Object.entries(byModule)) {
    const name = path.basename(modulePath, path.extname(modulePath));
    
    functions.push({
      id: `L1:function:${modulePath.replace(/[/.]/g, '-')}`,
      title: `${capitalize(name)} Functions`,
      functionCount: fns.length,
      functions: fns.map(f => f.name),
      data: {
        path: modulePath,
        title: `${capitalize(name)} Functions`,
        modulePath,
        testPath: modulePath.replace(/\.(ts|js|py|go|rs)$/, '.test.$1'),
        functions: fns.map(f => ({
          name: f.name,
          signature: `function ${f.name}(): void`,
          purpose: `[Describe ${f.name}]`
        }))
      }
    });
  }

  return functions;
}

/**
 * Generate specs from discovery results
 * @param {string} projectRoot - Project root directory
 * @param {object} discoveryResults - Results from discover()
 * @param {object} options - Generation options
 * @returns {Promise<object>} Generation results
 */
async function generateSpecs(projectRoot, discoveryResults, options = {}) {
  const generated = {
    files: [],
    errors: []
  };

  const specsPath = path.join(projectRoot, 'telos', 'specs');

  // Generate L4 purpose
  if (discoveryResults.proposedSpecs.L4 && !options.skipL4) {
    try {
      const content = generateSpec(4, discoveryResults.proposedSpecs.L4.data);
      const filePath = path.join(specsPath, 'L4-purpose', 'purpose.md');
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf8');
      generated.files.push(filePath);
    } catch (error) {
      generated.errors.push({ level: 4, error: error.message });
    }
  }

  // Generate L3 experiences
  for (const spec of discoveryResults.proposedSpecs.L3) {
    try {
      const content = generateSpec(3, spec.data);
      const fileName = `${spec.data.id}.md`;
      const filePath = path.join(specsPath, 'L3-experience', fileName);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf8');
      generated.files.push(filePath);
    } catch (error) {
      generated.errors.push({ level: 3, id: spec.id, error: error.message });
    }
  }

  // Generate L2 contracts
  for (const spec of discoveryResults.proposedSpecs.L2) {
    try {
      const content = generateSpec(2, spec.data);
      const fileName = spec.data.path.replace(/[/.]/g, '-') + '.md';
      const filePath = path.join(specsPath, 'L2-contract', fileName);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf8');
      generated.files.push(filePath);
    } catch (error) {
      generated.errors.push({ level: 2, id: spec.id, error: error.message });
    }
  }

  // Generate L1 functions
  for (const spec of discoveryResults.proposedSpecs.L1) {
    try {
      const content = generateSpec(1, spec.data);
      const fileName = spec.data.path.replace(/[/.]/g, '-') + '.md';
      const filePath = path.join(specsPath, 'L1-function', fileName);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf8');
      generated.files.push(filePath);
    } catch (error) {
      generated.errors.push({ level: 1, id: spec.id, error: error.message });
    }
  }

  // Generate TELOS.md
  try {
    const telosContent = generateTelosEntry({
      projectName: discoveryResults.proposedSpecs.L4?.title || 'Project',
      purpose: discoveryResults.proposedSpecs.L4?.purpose || '',
      l3Count: discoveryResults.proposedSpecs.L3.length,
      l2Count: discoveryResults.proposedSpecs.L2.length,
      l1Count: discoveryResults.proposedSpecs.L1.length
    });
    const telosPath = path.join(projectRoot, 'telos', 'TELOS.md');
    await fs.writeFile(telosPath, telosContent, 'utf8');
    generated.files.push(telosPath);
  } catch (error) {
    generated.errors.push({ level: 'telos', error: error.message });
  }

  return generated;
}

// Helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/[-_]/g, ' ');
}

module.exports = {
  discover,
  generateSpecs,
  scanProjectMetadata,
  scanCodeStructure
};
