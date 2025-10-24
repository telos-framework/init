## ADDED Requirements

### Requirement: MCP Server Discovery

The system SHALL enumerate and query available Model Context Protocol (MCP)
servers to discover development capabilities.

#### Scenario: MCP server enumeration

- **WHEN** tool discovery phase runs during initialization
- **THEN** SHALL detect configured MCP servers in Claude Code or other platform
  configs
- **AND** SHALL query each MCP server for its available tools and capabilities
- **AND** SHALL record server metadata: name, version, capabilities, tool
  schemas
- **AND** SHALL persist MCP server configurations to `telos/content/TOOLS.md`

#### Scenario: MCP server capability extraction

- **WHEN** querying an MCP server
- **THEN** SHALL extract tool names, descriptions, input schemas, and output
  schemas
- **AND** SHALL categorize tools by capability type (static-analysis, testing,
  deployment, etc.)
- **AND** SHALL identify which agent levels can benefit from each tool
- **AND** SHALL handle MCP server unavailability gracefully with fallback

### Requirement: Common Tool Detection

The system SHALL detect commonly used development tools through filesystem
scanning and configuration files.

#### Scenario: Linter detection

- **WHEN** scanning for static analysis tools
- **THEN** SHALL check for ESLint config (`.eslintrc.*`, `eslint.config.js`)
- **AND** SHALL check for Ruff config (`ruff.toml`, `pyproject.toml`)
- **AND** SHALL check for other language linters (RuboCop, Clippy, etc.)
- **AND** SHALL extract linter rules and configurations
- **AND** SHALL map detected linters to L1 Syntax-Linter agent

#### Scenario: Testing framework detection

- **WHEN** scanning for testing capabilities
- **THEN** SHALL check package.json or requirements.txt for test frameworks
- **AND** SHALL identify unit test frameworks (Jest, Vitest, PyTest, etc.) for
  L2
- **AND** SHALL identify component test frameworks (React Testing Library, etc.)
  for L3
- **AND** SHALL identify E2E frameworks (Playwright, Cypress, etc.) for L5
- **AND** SHALL extract test configuration and script commands

#### Scenario: Analytics integration detection

- **WHEN** scanning for analytics capabilities
- **THEN** SHALL search for analytics SDK imports (Google Analytics, Mixpanel,
  Segment, etc.)
- **AND** SHALL check for analytics configuration files
- **AND** SHALL identify API keys or environment variables for analytics
  services
- **AND** SHALL map analytics integrations to L7 Insight-Synthesizer and L8
  Market-Analyst

### Requirement: Capability-Based Tool Mapping

The system SHALL map discovered tools to agent capabilities using an abstract
capability layer.

#### Scenario: Capability abstraction

- **WHEN** a tool is discovered
- **THEN** SHALL classify tool into capability categories: static-analysis,
  unit-testing, component-testing, integration-testing, e2e-testing,
  accessibility-testing, analytics, deployment, monitoring
- **AND** SHALL map capabilities to appropriate agent levels
- **AND** SHALL handle tools that span multiple capabilities (e.g., Playwright
  for E2E + accessibility)
- **AND** SHALL store mapping in `.telos/tool-capabilities.json`

#### Scenario: Multi-tool capability resolution

- **WHEN** multiple tools provide the same capability (e.g., ESLint + TSLint for
  static-analysis)
- **THEN** SHALL prioritize based on: project usage frequency, recency,
  community support
- **AND** SHALL include all available tools in agent prompts with priority
  ordering
- **AND** SHALL allow agents to choose best tool for specific contexts
- **AND** SHALL document tool selection rationale in agent reports

### Requirement: Graceful Tool Degradation

The system SHALL adapt agent behavior when expected tools are unavailable using
fallback strategies.

#### Scenario: Missing critical tool fallback

- **WHEN** a critical tool is missing (e.g., no unit test framework for L2)
- **THEN** SHALL include fallback instructions in agent prompt
- **AND** SHALL recommend tool installation with specific commands
- **AND** SHALL provide manual alternative approach (e.g., manual test
  specifications)
- **AND** SHALL mark capability as degraded in agent context
- **AND** SHALL log missing tool for user notification

#### Scenario: Partial capability coverage

- **WHEN** some but not all tools for a level are available (e.g., linter but no
  formatter)
- **THEN** SHALL enable agent workflows using available tools
- **AND** SHALL adapt workflows to skip unavailable tool steps
- **AND** SHALL document limitations in agent mandate
- **AND** SHALL suggest complementary tool additions for full capability

### Requirement: Tool Re-Discovery

The system SHALL support re-discovering tools as projects evolve without full
re-initialization.

#### Scenario: Adding tools mid-project

- **WHEN** user runs `telos rediscover tools`
- **THEN** SHALL re-scan project for new tool configurations
- **AND** SHALL detect newly added tools since last discovery
- **AND** SHALL update `telos/content/TOOLS.md` with new tools
- **AND** SHALL regenerate affected agent prompts with new tool integrations
- **AND** SHALL preserve existing Telos and preference configurations

#### Scenario: Removing obsolete tools

- **WHEN** re-discovery detects tools no longer present
- **THEN** SHALL mark tools as unavailable in tool registry
- **AND** SHALL update agent prompts to remove references to missing tools
- **AND** SHALL enable fallback strategies for affected agents
- **AND** SHALL notify user of removed tools and impact on agent capabilities

### Requirement: Tool Configuration Management

The system SHALL manage tool-specific configurations and ensure agents use
correct tool invocations.

#### Scenario: Tool invocation pattern extraction

- **WHEN** a tool is discovered
- **THEN** SHALL extract standard invocation pattern (CLI command, API calls,
  etc.)
- **AND** SHALL identify tool-specific flags and options
- **AND** SHALL check for project-specific tool configurations
- **AND** SHALL generate ready-to-use invocation snippets for agent prompts

#### Scenario: Configuration file generation

- **WHEN** a tool is recommended but not configured
- **THEN** SHALL offer to generate standard configuration file
- **AND** SHALL use opinionated defaults aligned with project conventions
- **AND** SHALL place configuration in standard location (e.g.,
  `.eslintrc.json`, `vitest.config.js`)
- **AND** SHALL document configuration choices in `telos/content/TOOLS.md`

### Requirement: MCP Client Integration

The system SHALL provide MCP client functionality for agents to invoke MCP
server tools.

#### Scenario: Agent MCP tool invocation

- **WHEN** an agent needs to use an MCP tool during execution
- **THEN** SHALL invoke tool through MCP protocol with proper schema
- **AND** SHALL handle tool execution asynchronously if needed
- **AND** SHALL capture tool output and errors
- **AND** SHALL include tool results in agent's structured report
- **AND** SHALL log all MCP invocations for debugging and metrics

#### Scenario: MCP server unavailability

- **WHEN** an agent attempts to invoke MCP tool but server is unreachable
- **THEN** SHALL detect connection failure within timeout (5s default)
- **AND** SHALL fall back to alternative tools or manual approaches
- **AND** SHALL report MCP server unavailability in agent output
- **AND** SHALL NOT block agent completion on MCP failures

### Requirement: Tool Usage Instrumentation

The system SHALL track tool usage patterns to inform future recommendations and
optimizations.

#### Scenario: Tool usage metrics

- **WHEN** agents invoke tools during development
- **THEN** SHALL log: tool name, invocation count, success rate, execution time,
  agent level
- **AND** SHALL store metrics in `.telos/metrics/tool-usage.json`
- **AND** SHALL generate usage reports showing most/least used tools
- **AND** SHALL identify slow or failing tools for optimization opportunities

#### Scenario: Tool recommendation engine

- **WHEN** analyzing tool usage over time
- **THEN** SHALL recommend removing unused tools to reduce clutter
- **AND** SHALL recommend additional tools for frequently-needed capabilities
  without tool support
- **AND** SHALL suggest tool upgrades when newer versions offer better
  integration
- **AND** SHALL provide tool adoption insights in `telos status` command output
