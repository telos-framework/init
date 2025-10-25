const fs = require('fs').promises;
const path = require('path');

const CONFIG_TEMPLATES = {
  eslint: {
    filename: '.eslintrc.json',
    content: {
      env: {
        browser: true,
        es2021: true,
        node: true
      },
      extends: ['eslint:recommended'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      rules: {}
    }
  },
  
  prettier: {
    filename: '.prettierrc.json',
    content: {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 100,
      tabWidth: 2
    }
  },
  
  vitest: {
    filename: 'vitest.config.js',
    content: `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
`
  },
  
  playwright: {
    filename: 'playwright.config.js',
    content: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
`
  }
};

async function writeToolConfig(tool, projectRoot, options = {}) {
  const template = CONFIG_TEMPLATES[tool.toLowerCase()];
  
  if (!template) {
    throw new Error(`No configuration template for tool: ${tool}`);
  }

  const configPath = path.join(projectRoot, template.filename);
  
  try {
    await fs.access(configPath);
    if (!options.overwrite) {
      return {
        written: false,
        path: configPath,
        reason: 'Config already exists'
      };
    }
  } catch (error) {
  }

  const content = typeof template.content === 'string'
    ? template.content
    : JSON.stringify(template.content, null, 2);

  await fs.writeFile(configPath, content, 'utf8');
  
  return {
    written: true,
    path: configPath,
    tool
  };
}

async function writeAllConfigs(tools, projectRoot, options = {}) {
  const results = [];
  
  for (const tool of tools) {
    try {
      const result = await writeToolConfig(tool, projectRoot, options);
      results.push(result);
    } catch (error) {
      results.push({
        written: false,
        tool,
        error: error.message
      });
    }
  }
  
  return results;
}

function getConfigTemplate(tool) {
  return CONFIG_TEMPLATES[tool.toLowerCase()] || null;
}

function hasConfigTemplate(tool) {
  return tool.toLowerCase() in CONFIG_TEMPLATES;
}

module.exports = {
  writeToolConfig,
  writeAllConfigs,
  getConfigTemplate,
  hasConfigTemplate,
  CONFIG_TEMPLATES
};
