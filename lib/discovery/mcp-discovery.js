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
  // 4-level hierarchy: L1 (Function), L2 (Contract), L3 (Experience), L4 (Purpose)
  const capabilities = {
    L1: [],
    L2: [],
    L3: [],
    L4: []
  };

  for (const server of servers) {
    const name = server.name.toLowerCase();
    
    // L1 (Function) - File operations, linting, testing
    if (name.includes('filesystem') || name.includes('file')) {
      capabilities.L1.push({ server: server.name, capability: 'file-operations' });
    }
    
    // L2 (Contract) - Version control, API testing, database
    if (name.includes('github') || name.includes('git')) {
      capabilities.L2.push({ server: server.name, capability: 'version-control' });
    }
    
    if (name.includes('postgres') || name.includes('database') || name.includes('mysql')) {
      capabilities.L2.push({ server: server.name, capability: 'database-access' });
    }
    
    if (name.includes('fetch') || name.includes('web') || name.includes('http')) {
      capabilities.L2.push({ server: server.name, capability: 'api-testing' });
    }
    
    // L3 (Experience) - Browser automation, UX testing, user feedback
    if (name.includes('brave') || name.includes('browser') || name.includes('chrome')) {
      capabilities.L3.push({ server: server.name, capability: 'browser-automation' });
    }
    
    if (name.includes('slack') || name.includes('email')) {
      capabilities.L3.push({ server: server.name, capability: 'user-feedback' });
    }
    
    // L4 (Purpose) - Analytics, business metrics, research
    if (name.includes('analytics') || name.includes('metrics')) {
      capabilities.L4.push({ server: server.name, capability: 'analytics' });
    }
  }

  return capabilities;
}

module.exports = { discoverMcpServers, mapMcpToCapabilities };
