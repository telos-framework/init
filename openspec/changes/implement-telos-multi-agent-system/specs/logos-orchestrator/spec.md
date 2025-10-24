## ADDED Requirements

### Requirement: Orchestrator State Management

The Logos orchestrator SHALL maintain global development state across all agent
interactions and enable session persistence and resumption.

#### Scenario: State tracking across sessions

- **WHEN** a user begins a development task with Logos
- **THEN** the orchestrator SHALL create a session state in `.telos/state.json`
- **AND** the state SHALL track active agents, current level focus, and
  specification lineage
- **AND** the state SHALL persist after each agent handoff
- **AND** the orchestrator SHALL resume from the last known state when restarted

#### Scenario: Multi-level context management

- **WHEN** the orchestrator spawns an agent at any level
- **THEN** the context SHALL include relevant Telos hierarchy (L9 down to
  agent's level)
- **AND** the context SHALL include relevant specifications from higher levels
- **AND** the context SHALL include tool configurations specific to that agent
- **AND** the context SHALL be isolated per agent to prevent context pollution

### Requirement: Top-Down Decomposition Flow

The orchestrator SHALL implement top-down spec decomposition from strategic
purpose (L9) through implementation details (L1).

#### Scenario: Feature request decomposition

- **WHEN** a user requests a new feature
- **THEN** the orchestrator SHALL invoke L9 Telos-Guardian to verify alignment
- **AND** if aligned, SHALL cascade to L8 Market-Analyst for business case
- **AND** SHALL continue cascading through each level (L7→L6→L5→L4→L3→L2)
- **AND** SHALL reach L1 Syntax-Linter for final syntax validation
- **AND** each level SHALL produce a specification that constrains the next
  level

#### Scenario: Misaligned feature rejection

- **WHEN** L9 Telos-Guardian determines a request violates project purpose
- **THEN** the orchestrator SHALL halt the decomposition cascade
- **AND** SHALL report the alignment violation to the user
- **AND** SHALL suggest alternative approaches that maintain alignment
- **AND** SHALL NOT invoke lower-level agents for misaligned work

### Requirement: Bottom-Up Validation Flow

The orchestrator SHALL implement bottom-up validation ensuring lower-level
implementation satisfies higher-level requirements.

#### Scenario: Implementation validation cascade

- **WHEN** L2 Function-Author completes implementation with passing tests
- **THEN** the orchestrator SHALL invoke L3 Component-Architect to validate
  integration
- **AND** SHALL cascade upward through L4→L5→L6→L7→L8
- **AND** SHALL reach L9 Telos-Guardian for final purpose alignment check
- **AND** each level SHALL verify its requirements are satisfied by the level
  below

#### Scenario: Validation failure at mid-level

- **WHEN** validation fails at any level (e.g., L5 Journey-Validator finds E2E
  test failures)
- **THEN** the orchestrator SHALL halt upward cascade
- **AND** SHALL invoke middle-out reconciliation starting at failure point
- **AND** SHALL report specific validation failures with context
- **AND** SHALL coordinate fixes through appropriate lower-level agents

### Requirement: Middle-Out Reconciliation

The orchestrator SHALL resolve conflicts between levels when top-down specs and
bottom-up reality diverge.

#### Scenario: Specification-implementation conflict

- **WHEN** bottom-up validation reveals implementation doesn't satisfy higher
  specs
- **THEN** the orchestrator SHALL identify the highest level with conflict
- **AND** SHALL spawn agents at that level and adjacent levels
- **AND** SHALL facilitate dialogue between levels to reach consensus
- **AND** SHALL update specifications at all affected levels
- **AND** SHALL re-validate through both top-down and bottom-up flows

#### Scenario: Technical constraint discovered late

- **WHEN** L2 implementation discovers a technical constraint not in L4 specs
- **THEN** the orchestrator SHALL invoke L3 and L4 agents for consultation
- **AND** SHALL bubble constraint up to L5+ if it affects user journeys
- **AND** SHALL coordinate specification updates across all affected levels
- **AND** SHALL ensure constraint resolution maintains L9 alignment

### Requirement: Agent Isolation and Communication

The orchestrator SHALL spawn agents with isolated contexts and enforce
structured communication protocols.

#### Scenario: Agent context isolation

- **WHEN** the orchestrator invokes any agent
- **THEN** the agent SHALL receive only its level-appropriate context
- **AND** the agent SHALL NOT have access to other agents' working contexts
- **AND** the agent SHALL communicate only through the orchestrator via
  structured reports
- **AND** the agent SHALL complete its mandate or explicitly hand off through
  orchestrator

#### Scenario: Structured agent reporting

- **WHEN** an agent completes its work
- **THEN** the agent SHALL return a structured report (JSON or markdown with
  standard sections)
- **AND** the report SHALL include: work summary, spec updates, validation
  results, tool usage, next recommended action
- **AND** the orchestrator SHALL parse the report to determine next routing
  decision
- **AND** invalid or incomplete reports SHALL trigger agent re-invocation with
  feedback

### Requirement: Handoff Protocol

The orchestrator SHALL enforce a deterministic handoff protocol preventing lost
work and routing loops.

#### Scenario: Explicit handoff to next level

- **WHEN** an agent completes work and recommends handoff (e.g., L8→L7)
- **THEN** the orchestrator SHALL validate completion using the agent's
  deliverables
- **AND** SHALL extract context for the next agent from the handoff report
- **AND** SHALL spawn the next agent with enriched context
- **AND** SHALL track handoff lineage in state for debugging

#### Scenario: Handoff loop detection

- **WHEN** the orchestrator detects repeated handoffs between same agents (e.g.,
  L3↔L4 loop)
- **THEN** SHALL halt after 3 iterations of the same handoff pattern
- **AND** SHALL invoke middle-out reconciliation with both agents
- **AND** SHALL require explicit conflict resolution before resuming
- **AND** SHALL log loop patterns for system improvement

### Requirement: Parallel Agent Coordination

The orchestrator SHALL support parallel agent execution when work can be safely
decomposed.

#### Scenario: Independent component parallelization

- **WHEN** L3 Component-Architect identifies multiple independent components
- **THEN** the orchestrator SHALL spawn multiple L2 Function-Author agents in
  parallel
- **AND** each agent SHALL work on isolated components without shared state
- **AND** the orchestrator SHALL collect all L2 results before proceeding to L1
  validation
- **AND** SHALL merge all L2 specifications into unified L3 validation context

#### Scenario: Cross-component conflict detection

- **WHEN** parallel agents produce conflicting outputs (e.g., duplicate function
  names)
- **THEN** the orchestrator SHALL detect conflicts before merging results
- **AND** SHALL coordinate resolution through middle-out reconciliation
- **AND** SHALL re-validate resolved outputs before proceeding upward
- **AND** SHALL NOT allow conflicting outputs to propagate to higher levels

### Requirement: Session Continuity

The orchestrator SHALL enable long-running development sessions with robust
state persistence and resumption.

#### Scenario: Development session interruption

- **WHEN** a development session is interrupted (user closes IDE, crash, etc.)
- **THEN** the orchestrator SHALL persist current state to `.telos/state.json`
- **AND** SHALL record: active agents, pending handoffs, specification stack,
  validation status
- **WHEN** session resumes
- **THEN** the orchestrator SHALL restore state from `.telos/state.json`
- **AND** SHALL present user with session summary and next recommended action
- **AND** SHALL allow user to resume, reset, or fork the session

#### Scenario: Multi-day feature development

- **WHEN** a feature spans multiple development sessions
- **THEN** the orchestrator SHALL maintain cumulative state across all sessions
- **AND** SHALL track completed phases, pending validations, and blocked
  dependencies
- **AND** SHALL provide session-to-session continuity report showing progress
- **AND** SHALL enable rollback to any previous session checkpoint
