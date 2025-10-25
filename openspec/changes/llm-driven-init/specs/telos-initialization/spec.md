## ADDED Requirements

### Requirement: Slash Command-Based Initialization

The initialization system SHALL be implemented as a slash command
(`/telos-init`) that executes natively within AI coding assistants (Claude Code,
OpenCode, Cursor).

#### Scenario: User runs initialization command

- **WHEN** user types `/telos-init` in Claude Code
- **THEN** Claude SHALL:
  - Read the command definition from `.claude/commands/telos/init.md`
  - Execute the analysis and generation workflow defined in the prompt
  - Create all Telos files and agent definitions
  - Confirm completion with summary of generated files

#### Scenario: Command works across AI platforms

- **WHEN** user runs `/telos-init` in OpenCode or Cursor
- **THEN** the command SHALL:
  - Execute identically using the same markdown definition
  - Detect platform-specific paths (`.claude/` vs `.opencode/`)
  - Generate appropriate symlinks or copies for the platform

#### Scenario: Command fails gracefully in non-AI environment

- **WHEN** user tries to run `/telos-init` outside an AI assistant
- **THEN** the system SHALL:
  - Detect absence of AI context
  - Suggest running `telos init` CLI instead
  - Display installation instructions for CLI fallback

### Requirement: AI-Native Codebase Analysis

The slash command SHALL instruct the AI to analyze the project codebase using
its native file reading and pattern recognition capabilities, without requiring
JavaScript scanning code.

#### Scenario: Analysis discovers project from README

- **WHEN** Claude executes `/telos-init` in a project with README.md
- **THEN** Claude SHALL:
  - Read README.md and extract project description, purpose, goals
  - Infer ultimate Telos (L9) from stated purpose
  - Identify key beneficiaries and impact metrics mentioned
  - Use this as foundation for hierarchy proposal

#### Scenario: Analysis detects tech stack from package files

- **WHEN** project contains package.json, pyproject.toml, or Cargo.toml
- **THEN** Claude SHALL:
  - Parse dependencies to identify frameworks (React, Express, FastAPI, etc.)
  - Detect test frameworks (Vitest, Jest, Pytest, etc.)
  - Identify linters and formatters (ESLint, Prettier, Ruff, etc.)
  - Note build tools (Vite, Webpack, etc.)
  - Use these to auto-generate L1-L4 technical layer purposes

#### Scenario: Analysis examines code structure

- **WHEN** project contains source code directories (src/, lib/, app/)
- **THEN** Claude SHALL:
  - Scan directory structure to understand organization patterns
  - Identify component architecture (if using React, Vue, etc.)
  - Detect API patterns (REST endpoints, GraphQL schemas, etc.)
  - Infer architectural style (MVC, microservices, monolith, etc.)
  - Incorporate findings into L3-L5 layer proposals

#### Scenario: Analysis handles monorepo or multi-purpose projects

- **WHEN** analysis detects multiple distinct purposes (e.g., monorepo with
  frontend + backend)
- **THEN** Claude SHALL:
  - Identify the multiple purposes
  - Ask user: "I detected multiple purposes: [A] and [B]. Which is the primary
    Telos for this initialization?"
  - Proceed with user-selected focus area

### Requirement: Auto-Generated Technical Layers (L1-L4)

The system SHALL automatically generate purpose statements for technical
implementation layers based on detected code patterns and tooling, without
requiring user input.

#### Scenario: L1 generated from linter detection

- **WHEN** ESLint configuration is detected in project
- **THEN** L1 (Syntax-Linter) purpose SHALL be:
  - "Ensure code passes ESLint [strict/recommended] rules and maintains
    [TypeScript/JavaScript] quality standards"
  - Include reference to detected configuration file path
  - Specify detected severity levels and auto-fix capabilities

#### Scenario: L2 generated from test framework detection

- **WHEN** Vitest is detected as test framework
- **THEN** L2 (Function-Author) purpose SHALL be:
  - "Write test-driven functions with Vitest coverage, ensuring [X]% coverage
    threshold"
  - Reference detected test scripts in package.json
  - Include TDD expectations and coverage targets if configured

#### Scenario: L3 generated from component framework

- **WHEN** React with TypeScript is detected
- **THEN** L3 (Component-Architect) purpose SHALL be:
  - "Design reusable, type-safe React components following composition patterns"
  - Reference component directory structure detected
  - Include props interface design and accessibility standards

#### Scenario: L4 generated from API framework

- **WHEN** Express.js with RESTful routes is detected
- **THEN** L4 (Integration-Contractor) purpose SHALL be:
  - "Maintain RESTful API contracts with versioning and clear service
    boundaries"
  - Reference detected route structure and middleware patterns
  - Include API documentation standards (Swagger, OpenAPI)

### Requirement: Strategic Layer Review (L5-L9)

The system SHALL present AI-proposed strategic layers to the user for review and
refinement, focusing user attention on business and user-facing concerns.

#### Scenario: User reviews and accepts strategic layers

- **WHEN** Claude proposes L9-L5 purposes based on analysis
- **AND** asks "Would you like to refine any of these strategic layers?"
- **AND** user responds "No, they look good"
- **THEN** Claude SHALL:
  - Use the AI-proposed purposes for L9-L5
  - Proceed directly to file generation
  - Show summary of all 9 layers before creating files

#### Scenario: User refines individual strategic layer

- **WHEN** user says "I want to refine L9"
- **THEN** Claude SHALL:
  - Show current L9 proposal with reasoning
  - Ask "What should the ultimate purpose (Telos) be?"
  - Accept user's refined statement
  - Update L9 with user's version
  - Ask if user wants to refine other layers

#### Scenario: User provides additional context before proposal

- **WHEN** user says "Before you analyze, note that this is for healthcare
  compliance"
- **THEN** Claude SHALL:
  - Incorporate user context into analysis
  - Emphasize compliance-related aspects in hierarchy proposal
  - Reference healthcare domain in strategic layer purposes

### Requirement: File Generation and Structure

The slash command SHALL generate all Telos files matching the existing structure
for backward compatibility with current Telos system.

#### Scenario: Complete file set generated

- **WHEN** initialization completes successfully
- **THEN** Claude SHALL create:
  - `telos/content/TELOS.md` - Ultimate purpose documentation
  - `telos/agents/l9-telos-guardian.md` - L9 agent definition
  - `telos/agents/l8-market-analyst.md` - L8 agent definition
  - ... (all 9 agent files)
  - `logos/orchestrator.js` - Orchestration engine
  - Platform-specific configurations and symlinks

#### Scenario: Generated files include rich context

- **WHEN** agent definition files are created
- **THEN** each file SHALL include:
  - The layer's purpose statement (AI-generated or user-refined)
  - Detected tools and frameworks relevant to that layer
  - Specific commands for invoking project tooling
  - Configuration file paths for that layer's concerns
  - Cross-references to higher and lower layers

#### Scenario: Files respect existing Telos installation

- **WHEN** user runs `/telos-init` in project with existing Telos files
- **THEN** Claude SHALL:
  - Detect existing installation
  - Ask "Existing Telos installation found. Overwrite, merge, or cancel?"
  - If overwrite: Backup existing to `telos.backup/` and create fresh
  - If merge: Update files while preserving user customizations
  - If cancel: Exit without changes

## MODIFIED Requirements

### Requirement: Primary Initialization Interface

The system SHALL use **slash command execution as the primary initialization
method**, with CLI maintained as a fallback for non-AI environments.

#### Scenario: User discovers Telos in AI environment

- **WHEN** user installs Telos plugin via
  `/plugin marketplace add telos/framework`
- **AND** runs `/plugin install telos`
- **THEN** the system SHALL:
  - Install `.claude/commands/telos/init.md` command
  - Make `/telos-init` available in command palette
  - Show in `/help` output with description

#### Scenario: CLI detects AI environment and suggests slash command

- **WHEN** user runs `telos init` in terminal
- **AND** `CLAUDE_CODE` or `CURSOR_SESSION` environment variable is detected
- **THEN** the CLI SHALL:
  - Display: "💡 Tip: You're in an AI coding environment! For better experience,
    try: /telos-init"
  - Continue with CLI workflow if user proceeds
  - Provide link to slash command documentation

#### Scenario: CLI serves as automation fallback

- **WHEN** user runs `telos init --from-spec telos-spec.json` in CI/CD
- **THEN** the CLI SHALL:
  - Read specification from JSON file
  - Generate all Telos files non-interactively
  - Skip analysis and user prompts
  - Exit with success/failure code for automation

## REMOVED Requirements

### Requirement: ~~Sequential Interactive Prompts~~

**Reason**: Slash command uses conversational refinement instead of rigid
sequential prompts **Migration**: Users no longer answer 12 sequential
questions; instead review AI proposal and refine conversationally

### Requirement: ~~JavaScript-based Code Scanning~~

**Reason**: AI assistant natively reads files and detects patterns better than
JavaScript regex **Migration**: `lib/discovery/code-scanner.js` becomes optional
helper for CLI fallback only
