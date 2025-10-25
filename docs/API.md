# Logos Orchestrator API Documentation

This document describes the programmatic API for the Logos orchestrator and core
Telos modules.

## Table of Contents

1. [Orchestrator API](#orchestrator-api)
2. [State Manager API](#state-manager-api)
3. [Discovery APIs](#discovery-apis)
4. [Generator APIs](#generator-apis)
5. [Integration APIs](#integration-apis)
6. [Platform APIs](#platform-apis)

---

## Orchestrator API

### `logos/orchestrator.js`

Main orchestration engine for Telos framework.

#### `createOrchestrator(config)`

Creates a new Logos orchestrator instance.

**Parameters**:

- `config` (Object):
  - `projectRoot` (string): Path to project root
  - `statePath` (string, optional): Path to state file (default:
    `.telos/state.json`)
  - `telosPath` (string, optional): Path to TELOS.md

**Returns**: `Orchestrator` instance

**Example**:

```javascript
const { createOrchestrator } = require("telos-framework/logos/orchestrator");

const orchestrator = createOrchestrator({
  projectRoot: process.cwd(),
  statePath: ".telos/state.json",
});
```

#### `orchestrator.decomposeTopDown(goal, fromLevel, toLevel)`

Decomposes a high-level goal into lower-level specs.

**Parameters**:

- `goal` (string): High-level goal or requirement
- `fromLevel` (number): Starting level (1-9)
- `toLevel` (number): Target level (1-9)

**Returns**: `Promise<Array<Spec>>` - Array of specs at each level

**Example**:

```javascript
const specs = await orchestrator.decomposeTopDown(
  "Add user authentication",
  9, // From L9 (purpose)
  2, // To L2 (functions)
);

// Returns:
[
  { level: 9, content: "Validates auth aligns with purpose" },
  { level: 8, content: "Define success metrics for auth" },
  // ...
  { level: 2, content: "Implement hashPassword(), verifyToken()" },
];
```

#### `orchestrator.validateBottomUp(implementation, fromLevel, toLevel)`

Validates implementation against higher-level specs.

**Parameters**:

- `implementation` (Object): Implementation details
- `fromLevel` (number): Starting level (usually 1 or 2)
- `toLevel` (number): Target level (usually 9)

**Returns**: `Promise<ValidationResult>`

**Example**:

```javascript
const result = await orchestrator.validateBottomUp(
  { code: "function authenticate() {...}", tests: "passing" },
  1,  // From L1 (syntax)
  9   // To L9 (purpose)
);

// Returns:
{
  valid: true,
  levels: [
    { level: 1, status: "pass", message: "Syntax valid" },
    { level: 2, status: "pass", message: "Tests passing" },
    // ...
    { level: 9, status: "pass", message: "Aligned with purpose" }
  ]
}
```

#### `orchestrator.reconcileMiddleOut(conflict)`

Resolves conflicts between top-down and bottom-up flows.

**Parameters**:

- `conflict` (Object):
  - `topDown` (Spec): Top-down specification
  - `bottomUp` (Implementation): Bottom-up implementation
  - `level` (number): Level where conflict occurs

**Returns**: `Promise<Resolution>`

**Example**:

```javascript
const resolution = await orchestrator.reconcileMiddleOut({
  topDown: { level: 6, spec: "Simple 2-click checkout" },
  bottomUp: { level: 4, impl: "Complex 5-step API flow" },
  level: 5
});

// Returns:
{
  level: 5,
  resolution: "Simplify API to 2-step, update UX to match",
  adjustments: {
    L4: "Consolidate steps 2-4 into single API call",
    L6: "Update UX to reflect simplified flow"
  }
}
```

---

## State Manager API

### `logos/state-manager.js`

Manages orchestrator state persistence.

#### `StateManager.create(statePath)`

Creates a new state manager instance.

**Parameters**:

- `statePath` (string): Path to state JSON file

**Returns**: `StateManager` instance

**Example**:

```javascript
const { StateManager } = require("telos-framework/logos/state-manager");

const stateManager = StateManager.create(".telos/state.json");
```

#### `stateManager.load()`

Loads state from disk.

**Returns**: `Promise<State>`

**Example**:

```javascript
const state = await stateManager.load();

// Returns:
{
  currentLevel: 5,
  activeAgents: ['L5-Journey-Validator'],
  sessionId: '12345',
  history: [...]
}
```

#### `stateManager.save(state)`

Saves state to disk.

**Parameters**:

- `state` (Object): State to save

**Returns**: `Promise<void>`

**Example**:

```javascript
await stateManager.save({
  currentLevel: 6,
  activeAgents: ["L6-UX-Simulator"],
  sessionId: "12345",
});
```

#### `stateManager.updateAgent(level, status)`

Updates agent status in state.

**Parameters**:

- `level` (number): Agent level (1-9)
- `status` (string): Status ('idle', 'active', 'completed', 'error')

**Returns**: `Promise<void>`

**Example**:

```javascript
await stateManager.updateAgent(2, "active");
// Marks L2-Function-Author as active
```

---

## Discovery APIs

### Telos Discovery

#### `discoverTelos(options)`

Interactive Telos discovery with user prompts.

**Module**: `lib/discovery/telos-discovery.js`

**Parameters**:

- `options` (Object):
  - `quick` (boolean): Use defaults, minimal prompts
  - `existingTelos` (string, optional): Pre-existing purpose statement

**Returns**: `Promise<TelosData>`

**Example**:

```javascript
const { discoverTelos } = require('telos-framework/lib/discovery/telos-discovery');

const telos = await discoverTelos({ quick: false });

// Returns:
{
  purpose: "Enable physicians to deliver personalized care",
  beneficiaries: "Healthcare providers and patients",
  problemSolved: "Fragmented patient data...",
  successCriteria: "30% reduction in consultation time"
}
```

### Hierarchy Builder

#### `buildHierarchy(telos, options)`

Builds 9-level hierarchy from L9 purpose.

**Module**: `lib/discovery/hierarchy-builder.js`

**Parameters**:

- `telos` (string | Object): L9 purpose statement
- `options` (Object):
  - `quick` (boolean): Generate quickly with defaults

**Returns**: `Promise<Hierarchy>`

**Example**:

```javascript
const { buildHierarchy } = require('telos-framework/lib/discovery/hierarchy-builder');

const hierarchy = await buildHierarchy("Enable physicians...", { quick: false });

// Returns:
{
  L9: { purpose: "Enable physicians...", level: "Transcendental" },
  L8: { purpose: "Achieve 90% satisfaction...", level: "Social" },
  // ... through L1
}
```

### Tool Discovery

#### `scanProject(projectRoot)`

Scans project for languages, frameworks, tools.

**Module**: `lib/discovery/code-scanner.js`

**Parameters**:

- `projectRoot` (string): Path to project

**Returns**: `Promise<ProjectScan>`

**Example**:

```javascript
const { scanProject } = require('telos-framework/lib/discovery/code-scanner');

const scan = await scanProject(process.cwd());

// Returns:
{
  languages: ['JavaScript', 'TypeScript'],
  frameworks: ['React', 'Express'],
  testFrameworks: ['Vitest'],
  linters: ['ESLint'],
  packageManagers: ['npm']
}
```

#### `discoverMcpServers()`

Discovers available MCP servers.

**Module**: `lib/discovery/mcp-discovery.js`

**Returns**: `Promise<Array<McpServer>>`

**Example**:

```javascript
const { discoverMcpServers } = require('telos-framework/lib/discovery/mcp-discovery');

const servers = await discoverMcpServers();

// Returns:
[
  { name: 'filesystem', command: 'npx', args: [...] },
  { name: 'postgres', command: 'node', args: [...] }
]
```

#### `mapToolsToLevels(projectScan, mcpCapabilities)`

Maps discovered tools to agent levels.

**Module**: `lib/discovery/tool-mapper.js`

**Parameters**:

- `projectScan` (Object): From `scanProject()`
- `mcpCapabilities` (Object): From `discoverMcpServers()`

**Returns**: `Object` - Tools by level (L1-L9)

**Example**:

```javascript
const { mapToolsToLevels } = require('telos-framework/lib/discovery/tool-mapper');

const levelTools = mapToolsToLevels(scan, mcpCaps);

// Returns:
{
  L1: { tools: [{ name: 'ESLint', category: 'linter' }] },
  L2: { tools: [{ name: 'Vitest', category: 'unit-testing' }] },
  // ... through L9
}
```

---

## Generator APIs

### Agent Generator

#### `generateAgent(level, telos, tools, outputPath)`

Generates individual agent definition.

**Module**: `lib/generators/agent-generator.js`

**Parameters**:

- `level` (number): Agent level (1-9)
- `telos` (Object): Telos hierarchy
- `tools` (Array): Available tools for this level
- `outputPath` (string): Where to write agent file

**Returns**: `Promise<string>` - Path to generated file

**Example**:

```javascript
const { generateAgent } = require(
  "telos-framework/lib/generators/agent-generator",
);

await generateAgent(
  2,
  hierarchy,
  ["vitest", "jest"],
  "telos/agents/l2-function-author.md",
);
```

### TELOS.md Generator

#### `generateTelosMd(hierarchy, outputPath)`

Generates TELOS.md from hierarchy.

**Module**: `lib/generators/telos-md-generator.js`

**Parameters**:

- `hierarchy` (Object): 9-level hierarchy
- `outputPath` (string): Where to write TELOS.md

**Returns**: `Promise<string>` - Path to generated file

---

## Integration APIs

### MCP Client

#### `createMcpClient(serverConfig)`

Creates MCP client for server communication.

**Module**: `lib/integration/mcp-client.js`

**Parameters**:

- `serverConfig` (Object):
  - `name` (string): Server name
  - `command` (string): Executable command
  - `args` (Array): Command arguments
  - `env` (Object): Environment variables

**Returns**: `Promise<McpClient>`

**Example**:

```javascript
const { createMcpClient } = require(
  "telos-framework/lib/integration/mcp-client",
);

const client = await createMcpClient({
  name: "filesystem",
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
});

await client.callTool("read_file", { path: "/tmp/test.txt" });
await client.stop();
```

### Capability Manager

#### `new CapabilityManager(availableTools)`

Manages tool capabilities and fallbacks.

**Module**: `lib/integration/capability-abstraction.js`

**Parameters**:

- `availableTools` (Array): Tools detected in project

**Returns**: `CapabilityManager` instance

**Example**:

```javascript
const { CapabilityManager } = require(
  "telos-framework/lib/integration/capability-abstraction",
);

const manager = new CapabilityManager([
  { name: "eslint", category: "linter" },
  { name: "vitest", category: "testing" },
]);

manager.hasCapability("static-analysis"); // true
manager.hasCapability("e2e-testing"); // false

const caps = manager.getCapabilitiesForLevel("L2");
// Returns capabilities needed for L2 Function-Author
```

### Tool Invoker

#### `new ToolInvoker(availableTools)`

Invokes tools with unified API.

**Module**: `lib/integration/tool-invoker.js`

**Parameters**:

- `availableTools` (Array): Tools available

**Returns**: `ToolInvoker` instance

**Example**:

```javascript
const { ToolInvoker } = require("telos-framework/lib/integration/tool-invoker");

const invoker = new ToolInvoker([{ name: "eslint" }]);

const result = await invoker.invoke("eslint", "lint", "./src");
// Runs: eslint ./src

const testResult = await invoker.runTests();
// Runs appropriate test framework
```

---

## Platform APIs

### Platform Detector

#### `detectPlatform()`

Detects which AI platform is being used.

**Module**: `lib/platform/platform-detector.js`

**Returns**: `string` - Platform name ('claude', 'cursor', 'copilot', 'unknown')

**Example**:

```javascript
const { detectPlatform } = require(
  "telos-framework/lib/platform/platform-detector",
);

const platform = detectPlatform();
// Returns: 'claude' | 'cursor' | 'copilot' | 'unknown'
```

### Symlink Creator

#### `createSymlinks(projectRoot, platform)`

Creates platform-specific symlinks.

**Module**: `lib/platform/symlink-creator.js`

**Parameters**:

- `projectRoot` (string): Project root path
- `platform` (string | Array): Platform(s) to configure

**Returns**: `Promise<Array<SymlinkResult>>`

**Example**:

```javascript
const { createSymlinks } = require(
  "telos-framework/lib/platform/symlink-creator",
);

const results = await createSymlinks(
  process.cwd(),
  ["claude", "cursor"],
);

// Returns:
[
  { path: "CLAUDE.md", target: "telos/content/AGENTS.md", created: true },
  {
    path: ".cursor/rules/agents.md",
    target: "../../telos/content/AGENTS.md",
    created: true,
  },
];
```

---

## Error Handling

All async functions may throw errors. Always use try/catch:

```javascript
try {
  const telos = await discoverTelos();
} catch (error) {
  if (error.code === "USER_CANCELLED") {
    // User cancelled interactive prompt
  } else {
    console.error("Discovery failed:", error.message);
  }
}
```

## Common Error Codes

- `USER_CANCELLED`: User cancelled interactive prompt
- `TELOS_NOT_INITIALIZED`: Telos not initialized in project
- `TOOL_NOT_FOUND`: Required tool not available
- `VALIDATION_FAILED`: Validation cascade failed
- `MCP_SERVER_ERROR`: MCP server communication failed
- `SYMLINK_FAILED`: Unable to create symlink

---

## Usage Examples

### Full Initialization Flow

```javascript
const { discoverTelos } = require(
  "telos-framework/lib/discovery/telos-discovery",
);
const { buildHierarchy } = require(
  "telos-framework/lib/discovery/hierarchy-builder",
);
const { scanProject } = require("telos-framework/lib/discovery/code-scanner");
const { discoverMcpServers } = require(
  "telos-framework/lib/discovery/mcp-discovery",
);
const { mapToolsToLevels } = require(
  "telos-framework/lib/discovery/tool-mapper",
);
const { generateTelosMd } = require(
  "telos-framework/lib/generators/telos-md-generator",
);
const { generateAllAgents } = require(
  "telos-framework/lib/generators/all-agents-generator",
);

async function initializeTelos(projectRoot) {
  // Discover purpose
  const telosData = await discoverTelos({ quick: false });

  // Build hierarchy
  const hierarchy = await buildHierarchy(telosData.purpose, { quick: false });

  // Scan project
  const projectScan = await scanProject(projectRoot);

  // Discover MCP servers
  const mcpServers = await discoverMcpServers();

  // Map tools to levels
  const levelTools = mapToolsToLevels(projectScan, mcpServers);

  // Generate TELOS.md
  await generateTelosMd(hierarchy, "telos/content/TELOS.md");

  // Generate all agents
  await generateAllAgents(hierarchy, levelTools, "telos/agents/");

  return { hierarchy, levelTools };
}
```

### Orchestration Flow

```javascript
const { createOrchestrator } = require("telos-framework/logos/orchestrator");

async function processFeatureRequest(request) {
  const orchestrator = createOrchestrator({ projectRoot: process.cwd() });

  // Top-down decomposition
  const specs = await orchestrator.decomposeTopDown(request, 9, 1);

  // Implementation happens here (by agents)
  // ...

  // Bottom-up validation
  const validation = await orchestrator.validateBottomUp(implementation, 1, 9);

  if (validation.valid) {
    console.log("Feature aligned with purpose ✓");
  } else {
    console.log("Validation failed at level", validation.failedLevel);
  }
}
```

---

## TypeScript Support

TypeScript definitions will be available in a future release. For now, use
JSDoc:

```javascript
/**
 * @typedef {Object} TelosData
 * @property {string} purpose - Ultimate purpose
 * @property {string} beneficiaries - Primary beneficiaries
 * @property {string} problemSolved - Problem being solved
 * @property {string} successCriteria - Success criteria
 */

/**
 * @param {Object} options
 * @returns {Promise<TelosData>}
 */
async function discoverTelos(options) {
  // ...
}
```

---

For more details, see the source code in the respective modules.
