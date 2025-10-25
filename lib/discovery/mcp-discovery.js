const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function discoverMcpServers() {
  const servers = [];
  
  const configPaths = [
    path.join(os.homedir(), '.config', 'claude', 'claude_desktop_config.json'),
    path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
    path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'config.json')
  ];

  for (const configPath of configPaths) {
    try {
      const content = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(content);
      
      if (config.mcpServers) {
        for (const [name, serverConfig] of Object.entries(config.mcpServers)) {
          servers.push({
            name,
            command: serverConfig.command,
            args: serverConfig.args || [],
            env: serverConfig.env || {}
          });
        }
        break;
      }
    } catch (error) {
    }
  }

  return servers;
}

function mapMcpToCapabilities(servers) {
  const capabilities = {
    L1: [],
    L2: [],
    L3: [],
    L4: [],
    L5: [],
    L6: [],
    L7: [],
    L8: [],
    L9: []
  };

  for (const server of servers) {
    const name = server.name.toLowerCase();
    
    if (name.includes('filesystem') || name.includes('file')) {
      capabilities.L1.push({ server: server.name, capability: 'file-operations' });
      capabilities.L2.push({ server: server.name, capability: 'file-read-write' });
    }
    
    if (name.includes('github') || name.includes('git')) {
      capabilities.L3.push({ server: server.name, capability: 'version-control' });
      capabilities.L4.push({ server: server.name, capability: 'ci-cd-integration' });
    }
    
    if (name.includes('brave') || name.includes('browser') || name.includes('chrome')) {
      capabilities.L5.push({ server: server.name, capability: 'browser-automation' });
      capabilities.L6.push({ server: server.name, capability: 'ux-testing' });
    }
    
    if (name.includes('postgres') || name.includes('database') || name.includes('mysql')) {
      capabilities.L4.push({ server: server.name, capability: 'database-access' });
    }
    
    if (name.includes('fetch') || name.includes('web') || name.includes('http')) {
      capabilities.L4.push({ server: server.name, capability: 'api-testing' });
      capabilities.L7.push({ server: server.name, capability: 'web-research' });
    }
    
    if (name.includes('slack') || name.includes('email')) {
      capabilities.L7.push({ server: server.name, capability: 'user-feedback' });
    }
    
    if (name.includes('analytics') || name.includes('metrics')) {
      capabilities.L7.push({ server: server.name, capability: 'analytics' });
      capabilities.L8.push({ server: server.name, capability: 'business-metrics' });
    }
  }

  return capabilities;
}

module.exports = { discoverMcpServers, mapMcpToCapabilities };
