/**
 * Platform Adapters for Telos Commands
 * 
 * Transforms centralized command definitions into platform-specific formats.
 * 
 * Supported platforms:
 * - claude: .claude/commands/telos/*.md (with frontmatter)
 * - opencode: .opencode/command/telos-*.md (with frontmatter)
 * - cursor: Embedded in .cursorrules (no native slash commands)
 * - cline: Embedded in .clinerules (no native slash commands)
 * - windsurf: Embedded in .windsurfrules (no native slash commands)
 * - roo: Embedded in .roocode (no native slash commands)
 * - gemini: Embedded in GEMINI.md or uses native commands if supported
 */

const COMMAND_METADATA = {
  // Core commands
  init: {
    description: 'Initialize Telos spec-driven development for this project',
    aliases: ['telos-init', 'telos:init', 'initialize telos', 'setup telos']
  },
  validate: {
    description: 'Validate specs, code links, and tests',
    aliases: ['telos-validate', 'telos:validate', 'check telos', 'validate specs']
  },
  status: {
    description: 'Show current Telos configuration and spec status',
    aliases: ['telos-status', 'telos:status', 'telos info', 'show telos']
  },
  quick: {
    description: 'Quick Telos initialization with auto-accepted AI proposals',
    aliases: ['telos-quick', 'telos:quick', 'quick init', 'fast setup']
  },
  reset: {
    description: 'Clear existing Telos installation and reinitialize',
    aliases: ['telos-reset', 'telos:reset', 'clear telos', 'remove telos']
  },
  // SDD commands
  'sdd-init': {
    description: 'Initialize SDD structure (alternative to init)',
    aliases: ['telos-sdd-init', 'telos:sdd-init', 'sdd init']
  },
  'sdd-discover': {
    description: 'Generate specs from existing code',
    aliases: ['telos-sdd-discover', 'telos:sdd-discover', 'discover specs', 'scan code']
  },
  'sdd-context': {
    description: 'Load spec context for AI work',
    aliases: ['telos-sdd-context', 'telos:sdd-context', 'load context', 'spec context']
  },
  'sdd-validate': {
    description: 'Validate SDD structure and links',
    aliases: ['telos-sdd-validate', 'telos:sdd-validate', 'validate sdd']
  },
  'sdd-generate-tests': {
    description: 'Generate tests from spec scenarios',
    aliases: ['telos-sdd-generate-tests', 'telos:sdd-generate-tests', 'generate tests']
  }
};

/**
 * Platform configurations
 */
const PLATFORM_CONFIG = {
  claude: {
    hasNativeCommands: true,
    commandDir: '.claude/commands/telos',
    fileNaming: (name) => `${name}.md`,
    transform: transformForClaude
  },
  opencode: {
    hasNativeCommands: true,
    commandDir: '.opencode/command',
    fileNaming: (name) => `telos-${name}.md`,
    transform: transformForOpencode
  },
  cursor: {
    hasNativeCommands: false,
    configFile: '.cursorrules',
    transform: transformForRulesFile
  },
  cline: {
    hasNativeCommands: false,
    configFile: '.clinerules',
    transform: transformForRulesFile
  },
  windsurf: {
    hasNativeCommands: false,
    configFile: '.windsurfrules',
    transform: transformForRulesFile
  },
  roo: {
    hasNativeCommands: false,
    configFile: '.roocode',
    transform: transformForRulesFile
  },
  gemini: {
    hasNativeCommands: false,
    configFile: 'GEMINI.md',
    transform: transformForRulesFile
  }
};

/**
 * Transform command for Claude Code
 * Adds frontmatter with description
 */
function transformForClaude(content, commandName) {
  const meta = COMMAND_METADATA[commandName];
  return `---
description: ${meta.description}
---

${content}`;
}

/**
 * Transform command for OpenCode
 * Adds frontmatter with description
 */
function transformForOpencode(content, commandName) {
  const meta = COMMAND_METADATA[commandName];
  return `---
description: ${meta.description}
---

${content}`;
}

/**
 * Transform commands for platforms without native slash commands
 * Embeds command triggers and full instructions in config file
 */
function transformForRulesFile(commands) {
  let output = `
## Telos Commands

When the user asks to run any of these commands, follow the instructions below:

`;

  for (const [name, content] of Object.entries(commands)) {
    const meta = COMMAND_METADATA[name];
    output += `### Command: ${name}

**Triggers**: ${meta.aliases.map(a => `"${a}"`).join(', ')}

**Description**: ${meta.description}

<details>
<summary>Full Instructions (click to expand)</summary>

${content}

</details>

---

`;
  }

  return output;
}

/**
 * Get platform configuration
 */
function getPlatformConfig(platform) {
  return PLATFORM_CONFIG[platform] || null;
}

/**
 * Check if platform supports native slash commands
 */
function hasNativeCommands(platform) {
  const config = PLATFORM_CONFIG[platform];
  return config ? config.hasNativeCommands : false;
}

/**
 * Get all supported platforms
 */
function getSupportedPlatforms() {
  return Object.keys(PLATFORM_CONFIG);
}

/**
 * Get platforms with native command support
 */
function getPlatformsWithNativeCommands() {
  return Object.entries(PLATFORM_CONFIG)
    .filter(([_, config]) => config.hasNativeCommands)
    .map(([name, _]) => name);
}

/**
 * Get platforms without native command support (need embedding)
 */
function getPlatformsWithoutNativeCommands() {
  return Object.entries(PLATFORM_CONFIG)
    .filter(([_, config]) => !config.hasNativeCommands)
    .map(([name, _]) => name);
}

module.exports = {
  COMMAND_METADATA,
  PLATFORM_CONFIG,
  transformForClaude,
  transformForOpencode,
  transformForRulesFile,
  getPlatformConfig,
  hasNativeCommands,
  getSupportedPlatforms,
  getPlatformsWithNativeCommands,
  getPlatformsWithoutNativeCommands
};
