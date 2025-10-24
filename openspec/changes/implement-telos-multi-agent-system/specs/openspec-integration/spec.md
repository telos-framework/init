## ADDED Requirements

### Requirement: OpenSpec CLI Integration

The system SHALL use OpenSpec CLI as the primary change management and
specification system.

#### Scenario: Logos creates OpenSpec proposal

- **WHEN** Logos orchestrator determines work is needed
- **THEN** SHALL invoke `openspec init` if not already initialized
- **AND** SHALL create OpenSpec change proposal using natural language or
  `/openspec:proposal` command
- **AND** SHALL generate proper `openspec/changes/<change-id>/proposal.md` with
  Why/What/Impact
- **AND** SHALL generate `openspec/changes/<change-id>/tasks.md` with
  implementation checklist
- **AND** SHALL generate
  `openspec/changes/<change-id>/specs/<capability>/spec.md` with requirement
  deltas

#### Scenario: Telos alignment in OpenSpec proposals

- **WHEN** creating OpenSpec change proposal
- **THEN** proposal.md SHALL include Telos alignment section showing:
  "Contributes to: [L9 Telos statement]"
- **AND** SHALL include path: "Via: [L8→...→current level]"
- **AND** each spec delta SHALL trace back to Telos through lineage
- **AND** SHALL enable validating Telos alignment at any time

### Requirement: OpenSpec Task Execution

The system SHALL use OpenSpec tasks as the work breakdown structure for agent
implementation.

#### Scenario: Agent works through OpenSpec tasks

- **WHEN** an agent is assigned work from Logos
- **THEN** SHALL read tasks from `openspec/changes/<change-id>/tasks.md`
- **AND** SHALL work through tasks in order, marking with checkboxes: `- [ ]` →
  `- [x]`
- **AND** SHALL reference spec requirements when implementing each task
- **AND** SHALL validate implementation against spec scenarios

#### Scenario: Task dependency management

- **WHEN** tasks have dependencies
- **THEN** SHALL identify parallelizable vs sequential tasks from OpenSpec
  tasks.md
- **AND** SHALL coordinate parallel execution through Logos orchestrator
- **AND** SHALL NOT start dependent tasks until prerequisites complete
- **AND** SHALL update task status to reflect blocked/waiting/in-progress states

### Requirement: OpenSpec Validation Integration

The system SHALL use OpenSpec validation to ensure spec quality and
completeness.

#### Scenario: Validate change before implementation

- **WHEN** Logos creates or updates an OpenSpec change
- **THEN** SHALL run `openspec validate <change-id> --strict`
- **AND** SHALL check all spec deltas have proper format
  (ADDED/MODIFIED/REMOVED)
- **AND** SHALL verify all requirements have at least one scenario
- **AND** SHALL ensure scenarios use WHEN/THEN format
- **AND** SHALL NOT proceed to implementation if validation fails

#### Scenario: Pre-archive validation

- **WHEN** all tasks in a change are complete
- **THEN** SHALL run final `openspec validate <change-id> --strict`
- **AND** SHALL verify all specs are properly formatted
- **AND** SHALL check for any incomplete or TODO markers
- **AND** SHALL require passing validation before archiving

### Requirement: OpenSpec Archive Integration

The system SHALL use OpenSpec archive command to merge completed changes into
source specs.

#### Scenario: Archive completed change

- **WHEN** all tasks complete and validation passes
- **THEN** SHALL run `openspec archive <change-id> --yes`
- **AND** archiving SHALL merge spec deltas into
  `openspec/specs/<capability>/spec.md`
- **AND** SHALL move change folder to
  `openspec/changes/archive/YYYY-MM-DD-<change-id>/`
- **AND** SHALL preserve audit trail of what was implemented when

#### Scenario: Archive with conflicts

- **WHEN** archiving encounters conflicts with current specs
- **THEN** SHALL halt archive process
- **AND** SHALL report conflict details (which requirements conflict)
- **AND** SHALL require manual conflict resolution before completing archive
- **AND** SHALL re-validate after conflict resolution

### Requirement: OpenSpec Directory Structure

The system SHALL maintain OpenSpec's canonical directory structure and
conventions.

#### Scenario: Source of truth specs

- **WHEN** Telos is initialized in a project
- **THEN** SHALL create `openspec/specs/` as source-of-truth directory
- **AND** SHALL organize specs by capability:
  `openspec/specs/<capability>/spec.md`
- **AND** specs SHALL represent current system state (what IS)
- **AND** SHALL initialize OpenSpec if not already present

#### Scenario: Proposed changes directory

- **WHEN** Logos creates a change
- **THEN** SHALL create `openspec/changes/<change-id>/` directory
- **AND** change SHALL contain: `proposal.md`, `tasks.md`, `design.md`
  (optional), `specs/<capability>/spec.md` (deltas)
- **AND** spec deltas SHALL show what will CHANGE (not full spec, just diff)
- **AND** SHALL maintain clean separation between current state (specs/) and
  proposed changes (changes/)

### Requirement: OpenSpec Slash Command Support

The system SHALL generate OpenSpec slash commands for supported AI platforms.

#### Scenario: Platform-specific slash commands

- **WHEN** initialization detects a supported platform (Claude Code, Cursor,
  etc.)
- **THEN** SHALL run `openspec init` and select appropriate platform
- **AND** SHALL generate slash commands: `/openspec:proposal`,
  `/openspec:apply`, `/openspec:archive`
- **AND** platform SHALL invoke OpenSpec workflow through commands
- **AND** SHALL update commands when OpenSpec is updated

### Requirement: Telos-Enhanced OpenSpec Format

The system SHALL extend OpenSpec spec format with Telos-specific metadata
without breaking compatibility.

#### Scenario: Telos metadata in specs

- **WHEN** creating spec requirements
- **THEN** SHALL optionally include metadata block:

```markdown
<!-- telos-metadata
level: L4
parent: <parent-requirement-id>
telos_path: L9→L8→L7→L6→L5→L4
-->
```

- **AND** metadata SHALL be markdown comments (OpenSpec-compatible)
- **AND** SHALL NOT break OpenSpec validation
- **AND** SHALL enable Telos lineage queries

### Requirement: OpenSpec Show and List Integration

The system SHALL use OpenSpec commands for reviewing changes and specs.

#### Scenario: Review change before implementation

- **WHEN** Logos completes change proposal
- **THEN** user can run `openspec show <change-id>` to review
- **AND** SHALL display proposal, tasks, and spec deltas
- **AND** SHALL enable human-AI alignment on what will be built

#### Scenario: Track active changes

- **WHEN** multiple changes are in progress
- **THEN** `openspec list` SHALL show all active changes
- **AND** SHALL display completion status (N/M tasks)
- **AND** Logos SHALL coordinate work across multiple active changes

### Requirement: No Custom Spec System

The system SHALL NOT implement a custom specification system parallel to
OpenSpec.

#### Scenario: OpenSpec as single source of truth

- **WHEN** any spec-related work is needed
- **THEN** SHALL use OpenSpec CLI and format exclusively
- **AND** SHALL NOT create competing `.telos/specs/` directory
- **AND** SHALL NOT implement custom spec validation (use `openspec validate`)
- **AND** SHALL NOT create custom archive logic (use `openspec archive`)

#### Scenario: Leverage OpenSpec tooling

- **WHEN** spec operations are needed
- **THEN** SHALL invoke OpenSpec commands via subprocess
- **AND** SHALL parse OpenSpec output for orchestrator decisions
- **AND** SHALL treat OpenSpec as authoritative spec system
- **AND** SHALL contribute improvements back to OpenSpec project if needed
