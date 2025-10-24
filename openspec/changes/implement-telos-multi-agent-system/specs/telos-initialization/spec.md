## ADDED Requirements

### Requirement: Interactive Telos Discovery
The system SHALL provide an interactive discovery process that captures the project's ultimate purpose and decomposes it into a hierarchical Telos structure spanning all nine ontological levels.

#### Scenario: New project initialization
- **WHEN** a user runs `telos init` in an empty or existing project directory
- **THEN** the system SHALL guide the user through progressive questioning to capture the ultimate purpose (L9 Telos)
- **AND** the system SHALL decompose this purpose into intermediate objectives at each level (L8 business goals, L7 user value, etc.)
- **AND** the system SHALL generate a formal `telos/content/TELOS.md` file containing the complete hierarchy

#### Scenario: Telos refinement
- **WHEN** a user has ambiguous or conflicting responses during discovery
- **THEN** the system SHALL ask clarifying questions to resolve ambiguity
- **AND** the system SHALL validate consistency between levels (e.g., L8 goals support L9 Telos)
- **AND** the system SHALL allow the user to revise previous answers

### Requirement: Context Discovery
The system SHALL automatically detect existing project context including code structure, frameworks, languages, and development tools.

#### Scenario: Existing codebase scanning
- **WHEN** the initialization runs in a directory with existing code
- **THEN** the system SHALL scan for language-specific files (package.json, requirements.txt, pubspec.yaml, etc.)
- **AND** the system SHALL identify the project type (web app, mobile, library, monorepo)
- **AND** the system SHALL detect testing frameworks, linters, and build tools already in use
- **AND** the system SHALL present findings to the user for confirmation

#### Scenario: Greenfield project
- **WHEN** the initialization runs in an empty directory
- **THEN** the system SHALL ask the user about intended languages and frameworks
- **AND** the system SHALL recommend appropriate tools based on best practices
- **AND** the system SHALL offer to scaffold basic project structure

### Requirement: Tool Discovery
The system SHALL enumerate and map available development tools to appropriate agent levels based on capabilities.

#### Scenario: MCP server detection
- **WHEN** tool discovery phase begins
- **THEN** the system SHALL enumerate available MCP (Model Context Protocol) servers
- **AND** the system SHALL query each server for its capabilities
- **AND** the system SHALL map capabilities to agent levels (e.g., "static-analysis" → L1 Syntax-Linter)
- **AND** the system SHALL record tool configurations in `telos/content/TOOLS.md`

#### Scenario: Common tool detection
- **WHEN** scanning for development tools
- **THEN** the system SHALL detect common linters (ESLint, Ruff, etc.) for L1
- **AND** the system SHALL detect unit testing frameworks (Vitest, Jest, PyTest) for L2
- **AND** the system SHALL detect E2E frameworks (Playwright, Cypress) for L5
- **AND** the system SHALL detect analytics integrations (Google Analytics API, Mixpanel) for L7/L8
- **AND** the system SHALL gracefully handle missing tools with fallback recommendations

### Requirement: Preference Capture
The system SHALL capture developer preferences for code style, testing strategy, and workflow to customize agent behavior.

#### Scenario: Style preferences
- **WHEN** the preference discovery phase runs
- **THEN** the system SHALL ask about code formatting preferences (tabs vs spaces, line length, etc.)
- **AND** the system SHALL ask about naming conventions (camelCase, snake_case, etc.)
- **AND** the system SHALL ask about comment and documentation standards
- **AND** the system SHALL incorporate preferences into L1 Syntax-Linter agent prompts

#### Scenario: Testing strategy
- **WHEN** capturing testing preferences
- **THEN** the system SHALL ask about testing methodology (TDD, BDD, test-after)
- **AND** the system SHALL ask about coverage requirements
- **AND** the system SHALL configure L2 Function-Author agent with appropriate TDD workflow

### Requirement: Adaptive Agent Generation
The system SHALL generate customized agent definitions with tool-specific instructions based on discovered context.

#### Scenario: Agent prompt generation
- **WHEN** discovery phases complete
- **THEN** the system SHALL generate nine agent definition files in `telos/agents/`
- **AND** each agent definition SHALL include discovered tools relevant to its level
- **AND** agent prompts SHALL include conditional logic for tool availability
- **AND** agent mandates SHALL align with the captured Telos hierarchy

#### Scenario: Tool-specific adaptations
- **WHEN** a tool is available for an agent
- **THEN** the agent prompt SHALL include specific invocation patterns for that tool
- **WHEN** a tool is unavailable
- **THEN** the agent prompt SHALL include fallback strategies (e.g., manual review)

### Requirement: Quick Start Mode
The system SHALL provide a quick-start mode with sensible defaults for users who want to skip detailed discovery.

#### Scenario: Quick initialization
- **WHEN** a user runs `telos init --quick`
- **THEN** the system SHALL prompt only for the L9 Telos (ultimate purpose)
- **AND** the system SHALL auto-detect tools without confirmation
- **AND** the system SHALL apply opinionated defaults for preferences
- **AND** the system SHALL complete initialization in under 2 minutes

### Requirement: Re-initialization Support
The system SHALL allow users to re-run discovery phases to update configuration as projects evolve.

#### Scenario: Tool rediscovery
- **WHEN** a user runs `telos rediscover tools`
- **THEN** the system SHALL re-scan for available tools
- **AND** the system SHALL update agent prompts with newly detected tools
- **AND** the system SHALL preserve existing Telos and preferences

#### Scenario: Telos refinement
- **WHEN** a user runs `telos rediscover telos`
- **THEN** the system SHALL re-run Telos discovery questions
- **AND** the system SHALL show current Telos hierarchy for comparison
- **AND** the system SHALL update agent prompts to align with revised Telos
