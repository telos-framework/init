## Context

This implementation creates a novel AI-native development framework grounded in
classical philosophy. The framework operates across multiple abstraction levels
simultaneously, requiring careful architectural decisions about agent isolation,
communication protocols, state management, and platform compatibility. The
system must be generic enough to adapt to any project while maintaining
philosophical coherence.

**Background:**

- Based on Boulding's 9-level hierarchy of system complexity
- Inspired by Claude Collective multi-agent patterns
- Uses Spec-Driven Development (OpenSpec/Spec Kit) as communication protocol
- Must support multiple AI platforms (Claude, Cursor, Copilot, Gemini) via
  generic structure + symlinks

**Constraints:**

- Must work across platforms without duplication
- Agent prompts must be adaptable to discovered tools
- Initialization must handle projects with/without existing code
- Must maintain OpenSpec compatibility
- Should be simple to clone and initialize

## Goals / Non-Goals

**Goals:**

- Complete 9-level agent architecture with Logos orchestrator
- Comprehensive telos discovery and hierarchy capture
- Generic platform compatibility via symlink pattern
- Tool/MCP auto-discovery and integration
- Clear, well-documented open-source release (MIT)
- Minimal dependencies, maximum portability

**Non-Goals:**

- GUI/web interface for initialization (CLI-first)
- Language-specific implementations (remain generic)
- Hosted service or SaaS offering
- Integration with specific project management tools
- Automated deployment of generated code

## Decisions

### Decision 1: Directory Structure

**Choice:** Centralized content with platform-specific symlinks

```
/telos/
  content/           # Single source of truth
    TELOS.md         # Captured project purpose & hierarchy
    AGENTS.md        # Master agent definitions
    LOGOS.md         # Orchestrator instructions
    TOOLS.md         # Discovered tools & MCPs
  agents/
    l1-syntax-linter.md
    l2-function-author.md
    ...
    l9-telos-guardian.md
  templates/
    platform-configs/
      claude/
      cursor/
      copilot/
# Platform symlinks (created during init)
CLAUDE.md -> telos/content/AGENTS.md
.cursor/rules/agents.md -> ../telos/content/AGENTS.md
.github/copilot-instructions.md -> telos/content/AGENTS.md
```

**Rationale:**

- Follows auraone pattern: multiple platform files symlink to single source
- No duplication, single update point
- Each platform reads its preferred filename
- Easy to add new platforms

**Alternatives considered:**

- Template copying: Rejected due to sync issues
- Platform detection: Rejected as users often use multiple tools

### Decision 2: Agent Architecture Pattern

**Choice:** Orchestrator-worker with isolated contexts and structured reporting

**Pattern:**

```
Logos Orchestrator
├─ Maintains global development state
├─ Spawns isolated agent contexts
├─ Routes specs between levels
└─ Enforces validation cascades

Specialized Agents (9 levels)
├─ L9: Telos-Guardian (strategic documents)
├─ L8: Market-Analyst (analytics APIs)
├─ L7: Insight-Synthesizer (user feedback)
├─ L6: UX-Simulator (persona models, browsers)
├─ L5: Journey-Validator (E2E frameworks)
├─ L4: Integration-Contractor (API testing)
├─ L3: Component-Architect (component tests)
├─ L2: Function-Author (unit tests, TDD)
└─ L1: Syntax-Linter (linters, formatters)
```

**Communication:**

- Logos sends structured prompts with context
- Agents return structured reports (JSON/markdown)
- Specs flow top-down, validation flows bottom-up
- Middle-out reconciliation for conflicts

**Alternatives considered:**

- Flat agent collective: Rejected, lacks hierarchical governance
- Monolithic agent: Rejected, too complex, inefficient

### Decision 3: Initialization Flow

**Choice:** Multi-phase interactive discovery with progressive refinement

**Phases:**

1. **Telos Discovery** (L9→L8)
   - Prompt: "What is the ultimate purpose of your software?"
   - Follow-up questions to refine into formal Telos statement
   - Capture business objectives (L8)

2. **Context Discovery**
   - Scan for existing code, frameworks, languages
   - Identify project type (web app, mobile, library, etc.)
   - Detect testing frameworks, linters, build tools

3. **Tool Discovery**
   - Enumerate available MCP servers
   - Detect analytics integrations, API testing tools
   - Map tools to appropriate agent levels

4. **Preference Discovery**
   - Code style, naming conventions
   - Testing strategy (TDD, BDD, etc.)
   - Git workflow preferences

5. **Generation Phase**
   - Generate adapted agent prompts with discovered tools
   - Create platform symlinks
   - Write configuration files
   - Generate example specs

**Rationale:**

- Progressive disclosure reduces cognitive load
- Each phase informs the next
- Allows validation at each step
- Builds complete context picture

**Alternatives considered:**

- Single questionnaire: Rejected as too overwhelming
- Fully automated: Rejected, misses nuance
- Manual configuration: Rejected, defeats purpose

### Decision 4: Tool Integration Strategy

**Choice:** Capability-based tool mapping with graceful degradation

**Approach:**

- Each agent declares required capabilities (e.g., "static-analysis",
  "unit-testing")
- Initialization maps discovered tools to capabilities
- Agent prompts include conditional tool usage
- Missing tools trigger fallback strategies

**Example:**

```markdown
# L1: Syntax-Linter Agent

## Available Tools

{{#if tools.eslint}}

- ESLint for JavaScript/TypeScript linting {{/if}} {{#if tools.ruff}}
- Ruff for Python linting {{/if}} {{#if tools.none}}
- Manual code review (no automated linters detected) {{/if}}

## Your Role

Ensure code structural integrity using {{available_tools}}.
```

**Rationale:**

- Adapts to diverse project ecosystems
- Doesn't fail if specific tools missing
- Allows tool addition over time

**Alternatives considered:**

- Prescriptive tool list: Rejected, too constraining
- No tool integration: Rejected, agents can't act

### Decision 5: Spec-Driven Dialogue Protocol

**Choice:** Extend OpenSpec with Telos-specific conventions

**Format:**

```markdown
## TELOS ALIGNMENT

Contributes to: [L9 Telos statement] Via: [L8→L5 intermediate purposes]

## ADDED Requirements

### Requirement: [Capability Name]

[SHALL/MUST statement]

#### Scenario: [Success case]

- **WHEN** [precondition]
- **THEN** [postcondition]

## TOOLS REQUIRED

- [L1]: ESLint, Prettier
-
-
```

**Rationale:**

- Maintains OpenSpec compatibility
- Adds Telos lineage tracking
- Makes tool requirements explicit
- Enables validation cascade

## Risks / Trade-offs

### Risk 1: Initialization Complexity

**Risk:** Multi-phase discovery may be intimidating for new users
**Mitigation:**

- Provide quick-start mode with sensible defaults
- Allow skipping/revisiting phases
- Show progress indicators
- Offer example projects for reference

### Risk 2: Platform Symlink Compatibility

**Risk:** Windows has different symlink behavior than Unix **Mitigation:**

- Detect OS during initialization
- Use directory junctions on Windows
- Provide manual copy fallback
- Document platform-specific setup

### Risk 3: Tool Discovery Reliability

**Risk:** May not detect all available tools, or detect incorrectly
**Mitigation:**

- Combine automated detection with manual confirmation
- Allow manual tool addition post-init
- Provide re-discovery command
- Graceful degradation when tools missing

### Risk 4: Agent Prompt Bloat

**Risk:** Adaptive prompts with all conditionals may become too large
**Mitigation:**

- Template generation creates static prompts per project
- Only include relevant tool sections
- Keep base agent definitions focused
- Use file composition for complex agents

### Risk 5: OpenSpec Integration Conflicts

**Risk:** Telos extensions might conflict with future OpenSpec changes
**Mitigation:**

- Use clearly namespaced additions (## TELOS ALIGNMENT)
- Maintain backward compatibility
- Contribute improvements upstream if valuable
- Document deviations clearly

## Migration Plan

**N/A** - This is a new capability. Users adopt by:

1. Clone telos repo into their project
2. Run initialization
3. Begin using multi-agent system

**Rollback:** Remove telos directory and created symlinks

## Open Questions

1. **CLI Implementation Language**: Should `telos init` be:
   - Bash script (maximum portability)?
   - Node.js (better interaction, JSON handling)?
   - Python (better for AI/ML community)?
   - **Recommendation:** Node.js for better prompts/interaction, with npx
     execution

2. **Agent Context Windows**: How much context should each agent receive?
   - Full project context (expensive)?
   - Filtered by relevance (risk missing connections)?
   - **Recommendation:** Hierarchical filtering—lower agents get focused
     context, higher agents get broader context

3. **State Persistence**: Where does Logos maintain development state?
   - In-memory only (lost on restart)?
   - File-based (`.telos/state.json`)?
   - **Recommendation:** File-based with session tracking for continuity

4. **Validation Cascade Performance**: Full bottom-up validation on every change
   may be slow
   - Run all levels always (thorough but slow)?
   - Smart change detection (risk missing issues)?
   - **Recommendation:** Configurable depth, with full cascade pre-commit

5. **Multi-User Projects**: How do teams share Telos configuration?
   - Commit telos/ to git (risk conflicts)?
   - Gitignore generated content (loss of team alignment)?
   - **Recommendation:** Commit `telos/content/TELOS.md` and base configs,
     gitignore platform-specific generated files

## Additional Context from Claude Code Collective

**Reference Implementation**: The claude-code-collective project provides
working patterns we should adapt:

### Installer Architecture

- **NPM Package with NPX Support**: `npx telos-init init` pattern
- **Express Installation Mode**: `--express` or `--quick` flag for opinionated
  defaults with smart merge
- **File Mapping System**: Centralized mapping (`lib/file-mapping.js`) defining
  source templates → target locations
- **Template Processing**: Handlebars-based template engine with variable
  injection
- **Backup Strategy**: Auto-backup existing files to timestamped
  `.telos-backups/` before overwrite
- **Validation System**: Post-install validation checks ensuring all components
  installed correctly

### Directory Structure Pattern

```
project/
├── .telos/                    # Runtime state (gitignored)
│   ├── state.json            # Session state, active agents
│   ├── config.json           # Installation configuration
│   └── metrics/              # Usage metrics and analytics
├── telos/                     # Source of truth (committed)
│   ├── content/              # Master content files
│   │   ├── TELOS.md         # Project purpose hierarchy
│   │   ├── AGENTS.md        # Consolidated agent definitions
│   │   ├── LOGOS.md         # Orchestrator instructions
│   │   └── TOOLS.md         # Tool registry
│   ├── agents/               # Individual agent definitions
│   │   ├── l1-syntax-linter.md
│   │   └── ...
│   └── templates/            # Platform-specific templates
│       └── platform-configs/
│           ├── claude/
│           ├── cursor/
│           └── copilot/
├── TELOS.md                   # Symlink → telos/content/TELOS.md (root level for visibility)
└── [platform-specific symlinks created during init]
```

### Key Learnings from Claude-Collective

1. **Decision Flow Separation**: Separate decision logic from behavioral rules
   - `DECISION.md` handles routing and auto-delegation (always loaded)
   - `AGENTS.md` contains full agent definitions (loaded only when needed)
   - This prevents context bloat while maintaining fast routing

2. **Auto-Delegation Infrastructure**: Two-tier handoff system
   - **Orchestrator handoffs**: Explicit handoff messages with pattern matching
   - **Hook-based handoffs**: Shell hooks detect agent completion and
     auto-delegate
   - Unicode normalization for dash characters to prevent pattern match failures

3. **Hub-and-Spoke Architecture**: Central orchestrator pattern
   - All agent communication flows through hub (Logos orchestrator)
   - No peer-to-peer agent communication (prevents chaos)
   - Isolated agent contexts with structured reporting

4. **TDD Contract Enforcement**: Every agent follows RED→GREEN→REFACTOR
   - Standardized completion report format
   - Tests written first, always
   - Validation gates prevent untested code from propagating

5. **Smart Merge Strategies**: For existing installations
   - Detect identical files (skip silently)
   - Backup different files before overwrite
   - Merge JSON configs using deepmerge
   - Express mode for non-interactive installation

6. **Hooks System**: For behavioral enforcement
   - `.claude/hooks/` contains shell scripts
   - Hooks enforce TDD, detect handoffs, collect metrics
   - Require restart to load (platform limitation)

7. **Testing Infrastructure**: Multi-layer validation
   - Contract tests for handoff validation
   - Directive compliance tests
   - Agent-specific TDD validation tests
   - Integration tests for full flows

### Adaptations for Telos

**Adopt:**

- NPM package structure with `bin/` executable
- Express/quick mode for fast initialization
- File mapping system for template → target management
- Handlebars template processing
- Smart merge with backup strategy
- Validation system post-install
- Hub-and-spoke orchestrator pattern
- Structured agent reporting protocol
- Auto-delegation infrastructure

**Adapt:**

- Replace `/van` routing command with Logos orchestrator invocation
- Replace TDD-only enforcement with level-appropriate validation (TDD at L2, UX
  testing at L6, etc.)
- Add Telos alignment tracking to all agent reports
- Extend handoff protocol with spec lineage preservation
- Add middle-out reconciliation (not present in claude-collective)
- Add 9-level hierarchy (claude-collective has ~10 flat specialized agents)

**Add (new to Telos):**

- Interactive Telos discovery phase
- Hierarchical ontological level mapping (L1-L9)
- Top-down decomposition flow
- Bottom-up validation cascade
- Spec-driven dialogue with OpenSpec integration
- Telos alignment validation at every level
- Tool-to-level capability mapping
- Multi-platform symlink strategy (claude-collective is Claude Code only)

### Implementation Sequence Informed by Claude-Collective

**Phase 1: Core Infrastructure** (parallels claude-collective installer)

1. NPM package setup with Commander CLI
2. File mapping system for templates
3. Handlebars template engine
4. Installation with backup strategy
5. Validation system

**Phase 2: Telos-Specific Discovery** (new to Telos)

1. Interactive Telos capture
2. Hierarchy builder (L9→L1)
3. Tool discovery and capability mapping
4. Preference collection

**Phase 3: Agent Framework** (adapted from claude-collective)

1. Agent definition schema
2. Template-based agent generation
3. Hub-and-spoke orchestrator
4. Structured reporting protocol
5. Auto-delegation system

**Phase 4: Advanced Orchestration** (new to Telos)

1. Top-down decomposition
2. Bottom-up validation
3. Middle-out reconciliation
4. Spec lineage tracking

**Phase 5: Platform Integration** (extended beyond claude-collective)

1. Platform detection
2. Symlink creation (all platforms)
3. Content consolidation
4. Cross-platform testing
