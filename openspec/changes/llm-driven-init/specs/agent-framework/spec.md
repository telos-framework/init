## MODIFIED Requirements

### Requirement: L1-L4 Agent Generation from Code Patterns

The system SHALL generate technical layer agents (L1: Syntax-Linter, L2:
Function-Author, L3: Component-Architect, L4: Integration-Contractor) using
**LLM-inferred purpose statements** derived from codebase analysis rather than
user-provided input.

#### Scenario: L1 agent reflects detected linting tools

- **WHEN** L1 (Syntax-Linter) agent is generated
- **AND** LLM analysis detected ESLint + Prettier in the project
- **THEN** the agent definition SHALL include:
  - Purpose statement referencing ESLint and Prettier standards
  - Tool invocation instructions for `eslint` and `prettier` commands
  - Code quality criteria based on detected configuration files

#### Scenario: L2 agent reflects test framework

- **WHEN** L2 (Function-Author) agent is generated
- **AND** LLM analysis detected Vitest as the test framework
- **THEN** the agent definition SHALL include:
  - Purpose statement emphasizing TDD with Vitest
  - Tool invocation instructions for `vitest` command
  - Test coverage expectations based on project configuration

#### Scenario: L3 agent reflects component architecture

- **WHEN** L3 (Component-Architect) agent is generated
- **AND** LLM analysis detected React with TypeScript
- **THEN** the agent definition SHALL include:
  - Purpose statement referencing React component patterns
  - Composition and modularity principles from detected code structure
  - TypeScript interface design patterns

#### Scenario: L4 agent reflects API design

- **WHEN** L4 (Integration-Contractor) agent is generated
- **AND** LLM analysis detected Express.js with REST APIs
- **THEN** the agent definition SHALL include:
  - Purpose statement emphasizing RESTful contract design
  - Service boundary patterns from detected route structure
  - API versioning and integration standards

### Requirement: L5-L9 Agent Generation from User-Reviewed Purpose

The system SHALL generate strategic layer agents (L5: Journey-Validator, L6:
UX-Simulator, L7: Insight-Synthesizer, L8: Market-Analyst, L9: Telos-Guardian)
using **user-reviewed and refined purpose statements**, ensuring human judgment
guides business and user-facing concerns.

#### Scenario: L9 agent embodies user-confirmed Telos

- **WHEN** L9 (Telos-Guardian) agent is generated
- **AND** user has reviewed and confirmed the ultimate purpose
- **THEN** the agent definition SHALL include:
  - The exact user-approved Telos statement
  - Beneficiaries, impact metrics, and constraints from Telos discovery
  - Strategic alignment validation responsibilities

#### Scenario: L5-L8 agents use user-refined strategic goals

- **WHEN** L5-L8 agents are generated
- **AND** user has edited strategic layer purposes during review
- **THEN** each agent definition SHALL:
  - Use the user-approved purpose statement (not raw LLM proposal)
  - Include user-specific business context and product strategy
  - Reference higher-level purposes for top-down alignment

## ADDED Requirements

### Requirement: Agent Prompt Enhancement with Analysis Context

Generated agent prompts SHALL include rich context from LLM codebase analysis to
provide agents with architectural awareness beyond just purpose statements.

#### Scenario: Agents know project tech stack

- **WHEN** any agent (L1-L9) is generated
- **THEN** the agent prompt SHALL include:
  - Detected languages and frameworks from analysis
  - Key architectural patterns identified
  - Integration points and external dependencies
  - Testing and quality standards in use

#### Scenario: Agents reference specific tools

- **WHEN** an agent needs to invoke project tooling
- **THEN** the agent prompt SHALL include:
  - Exact commands for detected tools (e.g., `npm run lint`, `pytest`)
  - Configuration file locations (e.g., `.eslintrc.json`, `vitest.config.ts`)
  - Custom scripts from package.json

#### Scenario: Agents understand codebase structure

- **WHEN** agents need to navigate the codebase
- **THEN** the agent prompt SHALL include:
  - Directory structure summary from analysis
  - Key file locations (e.g., `src/components/`, `tests/`)
  - Naming conventions detected in existing code
