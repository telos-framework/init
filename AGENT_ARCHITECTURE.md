# Telos Agent Architecture

This document explains the nine-level agent architecture that forms the core of
the Telos framework.

## Overview

Telos uses a hierarchical multi-agent system based on Kenneth Boulding's nine
levels of system complexity. Each agent operates at a specific ontological
level, with specialized responsibilities, tools, and validation strategies.

## Architecture Principles

### 1. Hierarchical Organization

Agents are organized in a strict hierarchy (L9 → L1):

```
L9: Telos-Guardian          [Transcendental - Purpose]
L8: Market-Analyst          [Social - Business]
L7: Insight-Synthesizer     [Human - Learning]
L6: UX-Simulator            [Animal - Perception]
L5: Journey-Validator       [Plant - Workflows]
L4: Integration-Contractor  [Cell - Boundaries]
L3: Component-Architect     [Thermostat - Regulation]
L2: Function-Author         [Clockwork - Logic]
L1: Syntax-Linter           [Framework - Structure]
```

### 2. Orchestrator-Worker Pattern

**Logos Orchestrator** (central hub):

- Maintains global development state
- Routes specs between levels
- Spawns isolated agent contexts
- Enforces validation cascades

**Specialized Agents** (workers):

- Operate in isolation with filtered context
- Report structured results back to Logos
- Delegate to technical agents when needed
- Validate within their ontological level

### 3. Three Communication Flows

#### Top-Down Decomposition

Strategic goals cascade into tactical specs:

```
L9 → L8 → L7 → L6 → L5 → L4 → L3 → L2 → L1
(Purpose → Implementation)
```

#### Bottom-Up Validation

Implementation validates against purpose:

```
L1 → L2 → L3 → L4 → L5 → L6 → L7 → L8 → L9
(Code → Purpose Alignment)
```

#### Middle-Out Reconciliation

Conflicts resolved through rational dialogue at the appropriate level.

---

## The Nine Agents

### L1: Syntax-Linter

**Level**: Framework (Static Structure)\
**Mandate**: Ensure code structural integrity

**Responsibilities**:

- Run linters and formatters
- Enforce style conventions
- Detect structural anti-patterns
- Ensure syntactic correctness

**Tools**:

- ESLint (JavaScript/TypeScript)
- Prettier (Code formatting)
- Ruff (Python)
- Language-specific linters

**Validation**:

```bash
eslint --fix .
prettier --write .
```

**Reports**:

- Linting violations fixed
- Remaining manual issues
- Code quality metrics

**Delegates To**:

- None (operates directly on code)

**Example Concern**:

> "Function has 47 parameters (complexity warning)"

---

### L2: Function-Author

**Level**: Clockwork (Simple Dynamic Systems)\
**Mandate**: Implement deterministic logic with unit-level verification

**Responsibilities**:

- Write pure functions
- Follow TDD workflow (RED → GREEN → REFACTOR)
- Maintain unit test coverage
- Ensure algorithmic correctness

**Tools**:

- Vitest / Jest (JavaScript/TypeScript)
- pytest (Python)
- Unit testing frameworks

**Validation**:

```bash
vitest run
# All unit tests must pass
```

**Reports**:

- Test coverage percentage
- Failed/passing tests
- Functions implemented
- Refactoring performed

**Delegates To**:

- `testing-implementation-agent` for comprehensive test suites

**Example Concern**:

> "Sorting function fails on empty arrays (edge case)"

---

### L3: Component-Architect

**Level**: Thermostat (Cybernetic Systems)\
**Mandate**: Design stateful components with internal consistency

**Responsibilities**:

- Design component interfaces
- Manage component state
- Ensure lifecycle correctness
- Validate component composition

**Tools**:

- React Testing Library
- Component test frameworks
- State management tools

**Validation**:

```bash
vitest --testPathPattern=components
# Component tests must pass
```

**Reports**:

- Components designed/modified
- State management approach
- Composition patterns used
- Integration points defined

**Delegates To**:

- `component-implementation-agent` for UI component creation

**Example Concern**:

> "Counter component state becomes negative when constrained to positive"

---

### L4: Integration-Contractor

**Level**: Cell (Open Systems)\
**Mandate**: Maintain service contracts and system boundaries

**Responsibilities**:

- Define API contracts
- Validate service boundaries
- Ensure data integrity across systems
- Manage external dependencies

**Tools**:

- API testing tools (Supertest, Postman)
- Database clients
- Contract validators
- MCP servers for external services

**Validation**:

```bash
# Integration tests
vitest --testPathPattern=integration
# Contract validation
```

**Reports**:

- API contracts defined/modified
- Integration test results
- External dependencies
- Boundary conditions validated

**Delegates To**:

- `api-design` agent for API architecture
- `feature-implementation-agent` for service logic

**Example Concern**:

> "Auth service returns 500 when user service is unavailable (boundary failure)"

---

### L5: Journey-Validator

**Level**: Plant (Genetic-Societal)\
**Mandate**: Validate end-to-end user journeys

**Responsibilities**:

- Test complete user workflows
- Validate multi-step processes
- Ensure integration completeness
- Verify happy paths and error cases

**Tools**:

- Playwright
- Cypress
- E2E testing frameworks
- Browser automation

**Validation**:

```bash
playwright test
# E2E tests must pass
```

**Reports**:

- User journeys tested
- Workflow completion rates
- Integration issues found
- Error handling validated

**Delegates To**:

- `functional-testing-agent` for comprehensive E2E suites

**Example Concern**:

> "Checkout flow fails if user refreshes during payment step"

---

### L6: UX-Simulator

**Level**: Animal (Self-Aware Systems)\
**Mandate**: Ensure usable, accessible, appropriate user experience

**Responsibilities**:

- Test with user personas
- Validate accessibility (WCAG)
- Ensure appropriate affordances
- Verify responsive behavior

**Tools**:

- Browser MCP servers
- Accessibility checkers (axe-core)
- Usability testing tools
- Persona simulations

**Validation**:

```bash
# Accessibility audit
playwright test --grep @a11y
# Persona testing
```

**Reports**:

- Accessibility score
- Persona test results
- Usability issues found
- Responsive design validation

**Delegates To**:

- `polish-implementation-agent` for UX improvements

**Example Concern**:

> "Button appears clickable but is disabled (affordance mismatch)"

---

### L7: Insight-Synthesizer

**Level**: Human (Self-Conscious)\
**Mandate**: Synthesize behavioral data into actionable insights

**Responsibilities**:

- Collect behavioral analytics
- Identify usage patterns
- Synthesize user feedback
- Report insights to higher levels

**Tools**:

- Analytics MCP servers
- User feedback systems
- Session replay tools
- Web research tools

**Validation**:

```bash
# Analytics check
# Verify event tracking configured
```

**Reports**:

- Usage patterns identified
- User feedback synthesized
- Behavioral insights
- Recommendations for L8/L9

**Delegates To**:

- `research-agent` for user behavior analysis

**Example Concern**:

> "80% of users abandon form at step 3 (behavioral insight)"

---

### L8: Market-Analyst

**Level**: Social Organizations\
**Mandate**: Track business metrics and market position

**Responsibilities**:

- Define success metrics
- Track KPIs
- Monitor competitive position
- Report business performance

**Tools**:

- Analytics platforms
- Business intelligence tools
- Database MCP servers for metrics
- Market research tools

**Validation**:

```bash
# KPI check
# Verify metrics collection
```

**Reports**:

- KPI status (red/yellow/green)
- Business metrics trends
- Competitive analysis
- Strategic recommendations

**Delegates To**:

- `research-agent` for market analysis
- `prd-research-agent` for strategic planning

**Example Concern**:

> "Customer acquisition cost exceeded lifetime value (business metric failure)"

---

### L9: Telos-Guardian

**Level**: Transcendental Systems\
**Mandate**: Maintain alignment with project's ultimate purpose

**Responsibilities**:

- Guard ultimate purpose
- Validate strategic alignment
- Resolve value conflicts
- Maintain vision coherence

**Tools**:

- Strategic documents (TELOS.md)
- Version control (for historical context)
- Web research (for vision validation)

**Validation**:

```bash
telos validate
# Purpose alignment check
```

**Reports**:

- Purpose alignment assessment
- Strategic coherence evaluation
- Value conflict resolutions
- Vision updates (if needed)

**Delegates To**:

- `prd-agent` for strategic documentation
- `research-agent` for vision validation

**Example Concern**:

> "This feature drives revenue but compromises our mission to empower users"

---

_For full documentation, see [PHILOSOPHY.md](PHILOSOPHY.md) for theoretical
foundations and [USAGE.md](USAGE.md) for practical usage._
