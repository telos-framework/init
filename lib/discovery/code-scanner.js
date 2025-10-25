const fs = require('fs').promises;
const path = require('path');

async function scanProject(projectRoot) {
  const results = {
    languages: new Set(),
    frameworks: new Set(),
    testFrameworks: new Set(),
    linters: new Set(),
    buildTools: new Set(),
    packageManagers: new Set()
  };

  try {
    const files = await fs.readdir(projectRoot);
    
    for (const file of files) {
      if (file.startsWith('.')) continue;
      
      const filePath = path.join(projectRoot, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isFile()) {
        await detectFromFile(file, filePath, results);
      }
    }

    await detectFromPackageJson(projectRoot, results);
    
  } catch (error) {
    console.error('Error scanning project:', error.message);
  }

  return {
    languages: Array.from(results.languages),
    frameworks: Array.from(results.frameworks),
    testFrameworks: Array.from(results.testFrameworks),
    linters: Array.from(results.linters),
    buildTools: Array.from(results.buildTools),
    packageManagers: Array.from(results.packageManagers)
  };
}

async function detectFromFile(filename, filePath, results) {
  if (filename === 'package.json') {
    results.packageManagers.add('npm');
    results.languages.add('JavaScript/TypeScript');
  } else if (filename === 'package-lock.json') {
    results.packageManagers.add('npm');
  } else if (filename === 'yarn.lock') {
    results.packageManagers.add('yarn');
  } else if (filename === 'pnpm-lock.yaml') {
    results.packageManagers.add('pnpm');
  } else if (filename === 'Cargo.toml') {
    results.languages.add('Rust');
    results.packageManagers.add('cargo');
  } else if (filename === 'go.mod') {
    results.languages.add('Go');
    results.packageManagers.add('go modules');
  } else if (filename === 'requirements.txt' || filename === 'pyproject.toml') {
    results.languages.add('Python');
    results.packageManagers.add('pip');
  } else if (filename === 'Gemfile') {
    results.languages.add('Ruby');
    results.packageManagers.add('bundler');
  } else if (filename === 'pubspec.yaml') {
    results.languages.add('Dart');
    results.frameworks.add('Flutter');
    results.packageManagers.add('pub');
  } else if (filename === '.eslintrc.js' || filename === '.eslintrc.json' || filename === 'eslint.config.js') {
    results.linters.add('ESLint');
  } else if (filename === '.prettierrc' || filename === '.prettierrc.json') {
    results.linters.add('Prettier');
  } else if (filename === 'ruff.toml' || filename === '.ruff.toml') {
    results.linters.add('Ruff');
  } else if (filename === 'vite.config.js' || filename === 'vite.config.ts') {
    results.buildTools.add('Vite');
  } else if (filename === 'webpack.config.js') {
    results.buildTools.add('Webpack');
  } else if (filename === 'vitest.config.js' || filename === 'vitest.config.ts') {
    results.testFrameworks.add('Vitest');
  } else if (filename === 'jest.config.js' || filename === 'jest.config.json') {
    results.testFrameworks.add('Jest');
  } else if (filename === 'playwright.config.js' || filename === 'playwright.config.ts') {
    results.testFrameworks.add('Playwright');
  } else if (filename === 'cypress.config.js' || filename === 'cypress.config.ts') {
    results.testFrameworks.add('Cypress');
  }
}

async function detectFromPackageJson(projectRoot, results) {
  try {
    const pkgPath = path.join(projectRoot, 'package.json');
    const content = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(content);
    
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies
    };

    if (allDeps.react) results.frameworks.add('React');
    if (allDeps.vue) results.frameworks.add('Vue');
    if (allDeps.next) results.frameworks.add('Next.js');
    if (allDeps.nuxt) results.frameworks.add('Nuxt');
    if (allDeps.svelte) results.frameworks.add('Svelte');
    if (allDeps['@angular/core']) results.frameworks.add('Angular');
    if (allDeps.express) results.frameworks.add('Express');
    if (allDeps.fastify) results.frameworks.add('Fastify');
    if (allDeps.nest) results.frameworks.add('NestJS');
    
    if (allDeps.vitest) results.testFrameworks.add('Vitest');
    if (allDeps.jest) results.testFrameworks.add('Jest');
    if (allDeps.mocha) results.testFrameworks.add('Mocha');
    if (allDeps.playwright) results.testFrameworks.add('Playwright');
    if (allDeps.cypress) results.testFrameworks.add('Cypress');
    
    if (allDeps.eslint) results.linters.add('ESLint');
    if (allDeps.prettier) results.linters.add('Prettier');
    if (allDeps.typescript) {
      results.languages.add('TypeScript');
      results.linters.add('TypeScript Compiler');
    }
    
  } catch (error) {
  }
}

module.exports = { scanProject };
