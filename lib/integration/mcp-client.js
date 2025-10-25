const { spawn } = require('child_process');

class McpClient {
  constructor(serverConfig) {
    this.name = serverConfig.name;
    this.command = serverConfig.command;
    this.args = serverConfig.args || [];
    this.env = serverConfig.env || {};
    this.process = null;
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.process = spawn(this.command, this.args, {
        env: { ...process.env, ...this.env },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.process.on('error', (error) => {
        reject(new Error(`Failed to start MCP server ${this.name}: ${error.message}`));
      });

      this.process.stdout.once('data', () => {
        resolve();
      });

      setTimeout(() => {
        if (!this.process.killed) {
          resolve();
        }
      }, 1000);
    });
  }

  async call(method, params = {}) {
    if (!this.process) {
      throw new Error(`MCP server ${this.name} not started`);
    }

    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      };

      let responseData = '';

      const timeout = setTimeout(() => {
        reject(new Error(`MCP call to ${this.name}.${method} timed out`));
      }, 5000);

      const onData = (data) => {
        responseData += data.toString();
        try {
          const response = JSON.parse(responseData);
          clearTimeout(timeout);
          this.process.stdout.off('data', onData);
          
          if (response.error) {
            reject(new Error(`MCP error: ${response.error.message}`));
          } else {
            resolve(response.result);
          }
        } catch (e) {
        }
      };

      this.process.stdout.on('data', onData);
      this.process.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async stop() {
    if (this.process && !this.process.killed) {
      this.process.kill();
      this.process = null;
    }
  }

  async listTools() {
    try {
      const result = await this.call('tools/list');
      return result.tools || [];
    } catch (error) {
      return [];
    }
  }

  async callTool(toolName, args) {
    try {
      return await this.call('tools/call', {
        name: toolName,
        arguments: args
      });
    } catch (error) {
      throw new Error(`Tool ${toolName} failed: ${error.message}`);
    }
  }
}

async function createMcpClient(serverConfig) {
  const client = new McpClient(serverConfig);
  await client.start();
  return client;
}

module.exports = { McpClient, createMcpClient };
