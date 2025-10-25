const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const TOOL_COMMANDS = {
  eslint: {
    lint: (files = '.') => `eslint ${files}`,
    fix: (files = '.') => `eslint --fix ${files}`,
    check: (file) => `eslint ${file}`
  },
  
  prettier: {
    format: (files = '.') => `prettier --write ${files}`,
    check: (files = '.') => `prettier --check ${files}`
  },
  
  vitest: {
    run: (args = '') => `vitest run ${args}`,
    watch: () => 'vitest',
    coverage: () => 'vitest run --coverage'
  },
  
  jest: {
    run: (args = '') => `jest ${args}`,
    watch: () => 'jest --watch',
    coverage: () => 'jest --coverage'
  },
  
  playwright: {
    test: (args = '') => `playwright test ${args}`,
    ui: () => 'playwright test --ui',
    debug: (test) => `playwright test --debug ${test || ''}`
  },
  
  git: {
    status: () => 'git status',
    add: (files = '.') => `git add ${files}`,
    commit: (message) => `git commit -m "${message}"`,
    push: () => 'git push',
    diff: () => 'git diff'
  }
};

class ToolInvoker {
  constructor(availableTools = []) {
    this.availableTools = availableTools.map(t => t.name.toLowerCase());
  }

  hasTool(toolName) {
    const name = toolName.toLowerCase();
    return this.availableTools.includes(name) || 
           this.availableTools.some(t => t.includes(name));
  }

  async invoke(tool, action, ...args) {
    const toolName = tool.toLowerCase();
    
    if (!this.hasTool(toolName)) {
      throw new Error(`Tool ${tool} not available`);
    }

    const commands = TOOL_COMMANDS[toolName];
    if (!commands || !commands[action]) {
      throw new Error(`Action ${action} not supported for tool ${tool}`);
    }

    const command = commands[action](...args);
    
    try {
      const { stdout, stderr } = await execAsync(command);
      return {
        success: true,
        tool,
        action,
        command,
        stdout,
        stderr
      };
    } catch (error) {
      return {
        success: false,
        tool,
        action,
        command,
        error: error.message,
        stdout: error.stdout,
        stderr: error.stderr
      };
    }
  }

  async runLinter(files = '.') {
    if (this.hasTool('eslint')) {
      return await this.invoke('eslint', 'lint', files);
    } else if (this.hasTool('prettier')) {
      return await this.invoke('prettier', 'check', files);
    } else {
      return {
        success: false,
        tool: 'none',
        action: 'lint',
        error: 'No linter available'
      };
    }
  }

  async runTests(args = '') {
    if (this.hasTool('vitest')) {
      return await this.invoke('vitest', 'run', args);
    } else if (this.hasTool('jest')) {
      return await this.invoke('jest', 'run', args);
    } else {
      return {
        success: false,
        tool: 'none',
        action: 'test',
        error: 'No test framework available'
      };
    }
  }

  async runE2ETests(args = '') {
    if (this.hasTool('playwright')) {
      return await this.invoke('playwright', 'test', args);
    } else {
      return {
        success: false,
        tool: 'none',
        action: 'e2e',
        error: 'No E2E framework available'
      };
    }
  }

  async format(files = '.') {
    if (this.hasTool('prettier')) {
      return await this.invoke('prettier', 'format', files);
    } else if (this.hasTool('eslint')) {
      return await this.invoke('eslint', 'fix', files);
    } else {
      return {
        success: false,
        tool: 'none',
        action: 'format',
        error: 'No formatter available'
      };
    }
  }

  getAvailableActions(tool) {
    const toolName = tool.toLowerCase();
    const commands = TOOL_COMMANDS[toolName];
    
    if (!commands) {
      return [];
    }
    
    return Object.keys(commands);
  }

  getSupportedTools() {
    return Object.keys(TOOL_COMMANDS);
  }
}

module.exports = { ToolInvoker, TOOL_COMMANDS };
