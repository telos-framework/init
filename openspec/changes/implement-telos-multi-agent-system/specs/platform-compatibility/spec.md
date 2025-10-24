## ADDED Requirements

### Requirement: Platform Detection

The system SHALL detect which AI development platforms are in use and configure
appropriate integration points.

#### Scenario: Multi-platform environment detection

- **WHEN** initialization runs platform detection
- **THEN** SHALL check for Claude Code indicators (Claude-specific files,
  `.claude/` directory)
- **AND** SHALL check for Cursor indicators (`.cursor/` directory, cursor
  settings)
- **AND** SHALL check for GitHub Copilot indicators
  (`.github/copilot-instructions.md`)
- **AND** SHALL check for Gemini indicators (platform-specific config files)
- **AND** SHALL support multiple platforms simultaneously in same project

#### Scenario: Platform capability detection

- **WHEN** platform is detected
- **THEN** SHALL identify platform capabilities: file-based prompts,
  directory-based rules, symlink support, hook systems
- **AND** SHALL adapt integration strategy based on platform capabilities
- **AND** SHALL use most appropriate integration method for each platform
- **AND** SHALL document platform-specific setup in `telos/content/PLATFORMS.md`

### Requirement: Centralized Content Structure

The system SHALL maintain single-source-of-truth content in `telos/content/`
with platform-specific symlinks for consumption.

#### Scenario: Content organization

- **WHEN** initialization generates agent definitions and documentation
- **THEN** SHALL write master content to `telos/content/AGENTS.md` (consolidated
  all agents)
- **AND** SHALL write Telos hierarchy to `telos/content/TELOS.md`
- **AND** SHALL write orchestrator instructions to `telos/content/LOGOS.md`
- **AND** SHALL write tool registry to `telos/content/TOOLS.md`
- **AND** all platform integrations SHALL reference these canonical files

#### Scenario: Content updates propagate to all platforms

- **WHEN** content in `telos/content/` is updated
- **THEN** all platform symlinks SHALL automatically reflect changes
- **AND** no manual copying or synchronization SHALL be required
- **AND** all platforms SHALL have consistent agent definitions and instructions
- **AND** version drift between platforms SHALL be impossible

### Requirement: Symlink-Based Platform Integration

The system SHALL use symlinks (Unix/Mac) or directory junctions (Windows) to
expose content to platforms.

#### Scenario: Claude Code integration via symlink

- **WHEN** Claude Code platform is detected on Unix/Mac
- **THEN** SHALL create symlink: `CLAUDE.md → telos/content/AGENTS.md`
- **AND** SHALL create symlink: `.claude/agents/ → telos/agents/`
- **AND** Claude Code SHALL read agent definitions from symlinked location
- **AND** updates to source files SHALL be immediately visible to Claude Code

#### Scenario: Cursor integration via symlink

- **WHEN** Cursor platform is detected
- **THEN** SHALL create `.cursor/rules/` directory if not exists
- **AND** SHALL create symlink:
  `.cursor/rules/agents.md → telos/content/AGENTS.md`
- **AND** SHALL create symlink:
  `.cursor/rules/telos.md → telos/content/TELOS.md`
- **AND** Cursor SHALL consume rules from symlinked files

#### Scenario: GitHub Copilot integration via symlink

- **WHEN** GitHub Copilot platform is detected
- **THEN** SHALL create symlink:
  `.github/copilot-instructions.md → telos/content/AGENTS.md`
- **AND** Copilot SHALL read instructions from symlinked location
- **AND** SHALL include Telos context in Copilot instructions

#### Scenario: Windows directory junction creation

- **WHEN** running on Windows OS
- **THEN** SHALL use `mklink /J` for directory junctions instead of symlinks
- **AND** SHALL use `mklink /H` for file hard links
- **AND** SHALL provide equivalent behavior to Unix symlinks
- **AND** SHALL handle Windows permission requirements gracefully

### Requirement: Master Agent Consolidation

The system SHALL generate a master `AGENTS.md` file consolidating all agent
definitions for platform consumption.

#### Scenario: Agent consolidation

- **WHEN** agent definitions are generated in `telos/agents/l[1-9]-*.md`
- **THEN** SHALL concatenate all agent definitions into
  `telos/content/AGENTS.md`
- **AND** SHALL include clear section markers between agents
- **AND** SHALL preserve agent-specific tools and constraints
- **AND** SHALL include orchestrator routing instructions at top of file
- **AND** SHALL update master file whenever individual agent files change

#### Scenario: Platform-optimized formatting

- **WHEN** generating master AGENTS.md
- **THEN** SHALL format content optimally for AI assistant parsing
- **AND** SHALL use clear headers, delimiters, and structure
- **AND** SHALL include quick-reference routing matrix
- **AND** SHALL provide agent selection decision tree
- **AND** SHALL optimize for fast context loading and comprehension

### Requirement: Manual Copy Fallback

The system SHALL provide manual copy fallback when symlink creation is
impossible or restricted.

#### Scenario: Symlink creation failure

- **WHEN** symlink creation fails due to permissions or filesystem limitations
- **THEN** SHALL fall back to copying files from `telos/content/` to platform
  locations
- **AND** SHALL notify user that manual sync is required for updates
- **AND** SHALL provide `telos sync` command to manually re-copy files
- **AND** SHALL log warning about potential version drift

#### Scenario: Restricted environments

- **WHEN** user explicitly requests `--no-symlinks` mode
- **THEN** SHALL use file copying instead of symlinks
- **AND** SHALL create `.telos/sync-status.json` tracking copy timestamps
- **AND** SHALL warn when copied files are out of sync with source
- **AND** SHALL offer to re-sync on next `telos` command invocation

### Requirement: Platform-Specific Templates

The system SHALL provide platform-specific configuration templates in
`telos/templates/platform-configs/`.

#### Scenario: Claude Code template

- **WHEN** generating Claude Code configuration
- **THEN** SHALL use template from `telos/templates/platform-configs/claude/`
- **AND** SHALL include Claude-specific hooks integration
- **AND** SHALL configure `.claude/settings.json` with hook system
- **AND** SHALL enable auto-delegation and handoff detection

#### Scenario: Cursor template

- **WHEN** generating Cursor configuration
- **THEN** SHALL use template from `telos/templates/platform-configs/cursor/`
- **AND** SHALL format rules using Cursor's rule syntax
- **AND** SHALL configure `.cursor/settings.json` if needed
- **AND** SHALL adapt orchestrator instructions for Cursor's command system

### Requirement: Cross-Platform Compatibility Testing

The system SHALL validate platform integrations work correctly across different
environments.

#### Scenario: Symlink validation

- **WHEN** initialization completes
- **THEN** SHALL verify all created symlinks point to correct targets
- **AND** SHALL test symlink readability from platform perspective
- **AND** SHALL detect broken symlinks and report errors
- **AND** SHALL provide repair command for broken symlinks

#### Scenario: Platform content loading test

- **WHEN** running `telos validate` command
- **THEN** SHALL verify each platform can read agent definitions
- **AND** SHALL check content integrity (no truncation, encoding issues)
- **AND** SHALL verify agent routing instructions are parseable
- **AND** SHALL report platform-specific issues with remediation steps

### Requirement: Platform Evolution Support

The system SHALL easily support adding new AI platforms as they emerge.

#### Scenario: New platform integration

- **WHEN** adding support for a new AI platform
- **THEN** SHALL only require: platform detection logic, symlink mapping,
  configuration template
- **AND** SHALL NOT require changes to core agent definitions
- **AND** SHALL NOT require changes to orchestrator logic
- **AND** SHALL leverage existing `telos/content/` structure
- **AND** new platform SHALL coexist with existing platforms

#### Scenario: Platform-specific feature flags

- **WHEN** a platform has unique capabilities (e.g., native MCP support,
  advanced hooks)
- **THEN** SHALL detect platform capabilities during initialization
- **AND** SHALL enable platform-specific features conditionally
- **AND** SHALL document platform differences in `telos/content/PLATFORMS.md`
- **AND** SHALL maintain baseline compatibility across all platforms
