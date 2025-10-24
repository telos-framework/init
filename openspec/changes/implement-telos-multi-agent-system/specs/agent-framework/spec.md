## ADDED Requirements

### Requirement: Agent Definition Schema

The system SHALL define agents using a standardized schema that specifies
mandate, tools, constraints, and reporting format.

#### Scenario: Agent definition structure

- **WHEN** an agent is defined in `telos/agents/l[N]-*.md`
- **THEN** the definition SHALL include sections: Purpose, Mandate, Ontological
  Level, Available Tools, Constraints, Input Format, Output Format, Handoff
  Protocol
- **AND** the Purpose SHALL explain the agent's role in the Telos hierarchy
- **AND** the Mandate SHALL specify what the agent MUST accomplish before
  completion
- **AND** Available Tools SHALL be conditionally rendered based on discovered
  tools
- **AND** Output Format SHALL define structured report schema for orchestrator
  parsing

#### Scenario: Tool-conditional agent prompts

- **WHEN** agent definitions are generated during initialization
- **THEN** the Available Tools section SHALL only include tools detected in the
  project
- **AND** SHALL provide fallback instructions when tools are missing
- **AND** SHALL NOT reference unavailable tools in agent mandates
- **AND** SHALL adapt workflows based on tool availability (e.g., manual review
  if no linter)

### Requirement: L1 Syntax-Linter Agent

The system SHALL provide an L1 agent responsible for code structural integrity,
formatting, and syntactic correctness.

#### Scenario: Syntax validation with linters

- **WHEN** L1 Syntax-Linter receives code from L2
- **THEN** SHALL run detected linters (ESLint, Ruff, Prettier, etc.) against the
  code
- **AND** SHALL report all syntax violations, formatting issues, and style
  deviations
- **AND** SHALL apply auto-fixes where safe and deterministic
- **AND** SHALL hand off to orchestrator only when zero violations remain OR
  explicit exceptions documented

#### Scenario: Missing linter fallback

- **WHEN** no automated linters are available for the language
- **THEN** SHALL perform manual syntax review using language spec knowledge
- **AND** SHALL check: indentation consistency, naming conventions, structural
  patterns
- **AND** SHALL document manual review findings in structured report
- **AND** SHALL recommend linter installation in report

### Requirement: L2 Function-Author Agent

The system SHALL provide an L2 agent responsible for implementing functions with
TDD methodology and unit test coverage.

#### Scenario: Test-driven function implementation

- **WHEN** L2 Function-Author receives function specification from L3
- **THEN** SHALL write failing unit tests FIRST (RED phase)
- **AND** SHALL implement minimal code to make tests pass (GREEN phase)
- **AND** SHALL refactor for quality while keeping tests green (REFACTOR phase)
- **AND** SHALL report test results showing RED→GREEN→REFACTOR progression
- **AND** SHALL NOT hand off to L1 until all tests pass

#### Scenario: Unit testing framework integration

- **WHEN** unit testing framework is detected (Vitest, Jest, PyTest, etc.)
- **THEN** SHALL use detected framework for test generation
- **AND** SHALL follow framework conventions and assertion patterns
- **AND** SHALL achieve ≥80% code coverage for new functions
- **AND** SHALL include test execution command in handoff report

### Requirement: L3 Component-Architect Agent

The system SHALL provide an L3 agent responsible for designing and integrating
components with component-level testing.

#### Scenario: Component integration testing

- **WHEN** L3 Component-Architect receives validated functions from L2
- **THEN** SHALL design component architecture with clear interfaces
- **AND** SHALL write component tests verifying integration of L2 functions
- **AND** SHALL ensure components are composable and maintainable
- **AND** SHALL validate component tests pass before handing off to L4

#### Scenario: Component decomposition

- **WHEN** L4 provides integration requirements
- **THEN** SHALL decompose requirements into logical components
- **AND** SHALL identify which components can be built in parallel
- **AND** SHALL specify each component's interface and dependencies
- **AND** SHALL hand off independent component specs to L2 agents (via
  orchestrator)

### Requirement: L4 Integration-Contractor Agent

The system SHALL provide an L4 agent responsible for API contracts, service
integration, and contract testing.

#### Scenario: API contract definition

- **WHEN** L4 Integration-Contractor receives service requirements from L5
- **THEN** SHALL define API contracts with request/response schemas
- **AND** SHALL write contract tests validating API compliance
- **AND** SHALL specify error handling and failure modes
- **AND** SHALL hand off validated contracts to L3 for component implementation

#### Scenario: External service integration

- **WHEN** integration requires external services
- **THEN** SHALL define integration interfaces with versioning
- **AND** SHALL create mock implementations for testing
- **AND** SHALL validate integration through contract tests
- **AND** SHALL document service dependencies and failure handling

### Requirement: L5 Journey-Validator Agent

The system SHALL provide an L5 agent responsible for end-to-end user journeys
with E2E testing frameworks.

#### Scenario: E2E journey testing

- **WHEN** L5 Journey-Validator receives user journey specs from L6
- **THEN** SHALL implement E2E tests using detected framework (Playwright,
  Cypress, etc.)
- **AND** SHALL test complete user flows from entry to completion
- **AND** SHALL validate all happy paths and critical error paths
- **AND** SHALL execute tests in realistic environments
- **AND** SHALL report journey coverage and failure scenarios

#### Scenario: Missing E2E framework

- **WHEN** no E2E framework is available
- **THEN** SHALL create detailed manual test plans with step-by-step procedures
- **AND** SHALL recommend E2E framework installation
- **AND** SHALL validate journeys through manual testing documentation
- **AND** SHALL require explicit sign-off before upward validation

### Requirement: L6 UX-Simulator Agent

The system SHALL provide an L6 agent responsible for user experience simulation
with persona models and accessibility validation.

#### Scenario: Persona-based UX validation

- **WHEN** L6 UX-Simulator receives experience requirements from L7
- **THEN** SHALL create user personas representing target audience
- **AND** SHALL simulate each persona's interaction with the system
- **AND** SHALL identify friction points, confusion, and delight moments
- **AND** SHALL validate accessibility compliance (WCAG, ARIA, etc.)
- **AND** SHALL provide UX improvement recommendations

#### Scenario: Browser-based UX testing

- **WHEN** browser testing tools are available (Playwright MCP, Chrome DevTools)
- **THEN** SHALL perform actual browser-based UX validation
- **AND** SHALL test responsive design across viewport sizes
- **AND** SHALL validate interactive elements and animations
- **AND** SHALL measure performance metrics (LCP, FID, CLS)
- **AND** SHALL capture screenshots and recordings for review

### Requirement: L7 Insight-Synthesizer Agent

The system SHALL provide an L7 agent responsible for synthesizing user feedback,
analytics data, and behavioral insights.

#### Scenario: Analytics integration

- **WHEN** L7 Insight-Synthesizer has access to analytics APIs
- **THEN** SHALL query user behavior data, conversion metrics, and engagement
  patterns
- **AND** SHALL identify trends, anomalies, and opportunities
- **AND** SHALL correlate user feedback with behavioral data
- **AND** SHALL synthesize actionable insights for L8 business decisions

#### Scenario: Feedback analysis without analytics

- **WHEN** no analytics integration is available
- **THEN** SHALL analyze available user feedback sources (reviews, support
  tickets, etc.)
- **AND** SHALL identify patterns and recurring themes
- **AND** SHALL prioritize insights by frequency and impact
- **AND** SHALL recommend analytics instrumentation for future insight
  generation

### Requirement: L8 Market-Analyst Agent

The system SHALL provide an L8 agent responsible for business case analysis,
KPIs, and market alignment.

#### Scenario: Business case validation

- **WHEN** L8 Market-Analyst receives strategic requirements from L9
- **THEN** SHALL evaluate business viability and ROI potential
- **AND** SHALL define success metrics and KPIs
- **AND** SHALL identify market positioning and competitive advantages
- **AND** SHALL validate alignment with business objectives
- **AND** SHALL provide go/no-go recommendation with justification

#### Scenario: KPI tracking integration

- **WHEN** business metrics APIs are available
- **THEN** SHALL define trackable KPIs for the initiative
- **AND** SHALL specify measurement methodologies and targets
- **AND** SHALL monitor KPI achievement during development
- **AND** SHALL alert when metrics suggest course correction needed

### Requirement: L9 Telos-Guardian Agent

The system SHALL provide an L9 agent responsible for ensuring all work aligns
with ultimate project purpose.

#### Scenario: Purpose alignment validation

- **WHEN** L9 Telos-Guardian receives any development request
- **THEN** SHALL evaluate request against project Telos (ultimate purpose)
- **AND** SHALL trace logical path from request to Telos
- **AND** SHALL identify contradictions or misalignments
- **AND** SHALL provide binary judgment: ALIGNED or MISALIGNED with explanation
- **AND** SHALL suggest alternative approaches for misaligned requests that
  preserve purpose

#### Scenario: Strategic document maintenance

- **WHEN** L9 Telos-Guardian identifies Telos evolution or refinement
  opportunities
- **THEN** SHALL recommend updates to `telos/content/TELOS.md`
- **AND** SHALL ensure updates preserve core purpose while adapting to learning
- **AND** SHALL notify user of proposed Telos changes for approval
- **AND** SHALL NOT autonomously change Telos without explicit user consent

### Requirement: Agent Prompt Template System

The system SHALL use template engine (Handlebars) to generate adaptive agent
prompts based on project context.

#### Scenario: Template-based prompt generation

- **WHEN** initialization completes with discovered tools and preferences
- **THEN** SHALL process agent template files with Handlebars
- **AND** SHALL inject tool configurations, Telos hierarchy, and project
  conventions
- **AND** SHALL conditionally render sections based on tool availability
- **AND** SHALL generate final static agent markdown files in `telos/agents/`
- **AND** generated files SHALL NOT contain template syntax (fully resolved)

#### Scenario: Template variables available

- **WHEN** processing agent templates
- **THEN** templates SHALL have access to variables: `{{tools.*}}`,
  `{{telos.l9}}` through `{{telos.l1}}`, `{{preferences.*}}`, `{{project.*}}`
- **AND** SHALL support conditionals: `{{#if tools.eslint}}...{{/if}}`
- **AND** SHALL support iterations: `{{#each tools.linters}}...{{/each}}`
- **AND** SHALL support partials for reusable prompt fragments
