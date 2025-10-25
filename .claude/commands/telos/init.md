---
description: Initialize Telos multi-agent system for this project
---

# Telos Initialization

You are initializing the **Telos Framework** - a 9-level purpose-driven
architecture for AI-assisted software development. Your role is to analyze this
codebase, propose a complete hierarchy from ultimate purpose (L9) to code
structure (L1), and generate all necessary files.

## Step 1: Analyze Codebase

Read and analyze the following to understand this project:

### 1.1 Project Documentation

- **README.md** - Extract:
  - Project purpose and description
  - Target users/beneficiaries
  - Goals and success metrics
  - Technology stack

### 1.2 Package Configuration

Check for and read (if exists):

- **package.json** (Node.js) - Identify:
  - Dependencies and frameworks (React, Express, Next.js, etc.)
  - Dev dependencies (testing, linting, build tools)
  - Scripts (test, lint, build commands)
- **pyproject.toml** or **requirements.txt** (Python)
- **Cargo.toml** (Rust)
- **pom.xml** or **build.gradle** (Java)
- **go.mod** (Go)

### 1.3 Source Code Structure

Scan the primary source directory:

- Look for **src/**, **lib/**, **app/**, or similar
- Identify:
  - Component patterns (React components, Vue SFCs)
  - API structure (routes, endpoints, controllers)
  - Architectural patterns (MVC, microservices, monolith)
  - Database integration (Prisma, Sequelize, MongoDB)

### 1.4 Testing and Quality Tools

Check for:

- **Test frameworks**: Jest, Vitest, Pytest, RSpec, etc.
- **Linters**: ESLint, Prettier, Ruff, Clippy, etc.
- **Type checkers**: TypeScript, mypy, etc.

### 1.5 Project State

Run: `git status` to check if this is an active repository

## Step 2: Propose Telos Hierarchy

Based on your analysis, propose a complete 9-level hierarchy. Present it using
this block format:

```
═══════════════════════════════════════════════════════════════════════════
                          PROPOSED TELOS HIERARCHY
═══════════════════════════════════════════════════════════════════════════

───────────────────────────────────────────────────────────────────────────
L9 - Telos-Guardian (Ultimate Purpose)
───────────────────────────────────────────────────────────────────────────
Purpose: [Proposed ultimate purpose statement]

Reasoning: [Why this is the ultimate purpose - based on README, project 
description, and inferred mission]
───────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────
L8 - Market-Analyst (Business Value)
───────────────────────────────────────────────────────────────────────────
Purpose: [Proposed business value statement]

Reasoning: [Business outcomes this project serves - based on metrics, KPIs,
or market positioning mentioned in docs]
───────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────
L7 - Insight-Synthesizer (Product Strategy)
───────────────────────────────────────────────────────────────────────────
Purpose: [Proposed product strategy statement]

Reasoning: [How it delivers user value - based on features, roadmap, or
user-facing goals]
───────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────
L6 - UX-Simulator (Experience Philosophy)
───────────────────────────────────────────────────────────────────────────
Purpose: [Proposed UX philosophy statement]

Reasoning: [User experience principles - based on UI framework, design
system, or accessibility mentions]
───────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────
L5 - Journey-Validator (Workflow Validation)
───────────────────────────────────────────────────────────────────────────
Purpose: [Proposed workflow validation statement]

Reasoning: [User journey requirements - based on E2E tests, integration
tests, or workflow documentation]
───────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────
L4 - Integration-Contractor (API Contracts)
───────────────────────────────────────────────────────────────────────────
Purpose: [Proposed API contract statement]

Reasoning: [Based on detected API frameworks, protocols, and integration
patterns]
───────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────
L3 - Component-Architect (Component Design)
───────────────────────────────────────────────────────────────────────────
Purpose: [Proposed component architecture statement]

Reasoning: [Based on detected UI framework, component patterns, and
architectural choices]
───────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────
L2 - Function-Author (Function Implementation)
───────────────────────────────────────────────────────────────────────────
Purpose: [Proposed function implementation statement]

Reasoning: [Based on detected test framework, testing strategy, and code
coverage requirements]
───────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────
L1 - Syntax-Linter (Code Quality)
───────────────────────────────────────────────────────────────────────────
Purpose: [Proposed code quality statement]

Reasoning: [Based on detected linters, formatters, and quality standards]
═══════════════════════════════════════════════════════════════════════════
```

### Auto-generation Guidelines for L1-L4

**L1 (Syntax-Linter)** - Based on detected tools:

- If ESLint found → "Ensure code passes ESLint strict mode with zero warnings"
- If Prettier found → "Maintain consistent code formatting via Prettier"
- If Ruff found (Python) → "Enforce Ruff linting rules for code quality"
- If Clippy found (Rust) → "Pass all Clippy lints at deny level"

**L2 (Function-Author)** - Based on test framework:

- If Vitest found → "Write TDD functions with Vitest coverage >80%"
- If Jest found → "Implement testable functions with Jest unit tests"
- If Pytest found → "Write pure functions with pytest coverage"

**L3 (Component-Architect)** - Based on framework:

- If React found → "Design reusable React components following composition
  patterns"
- If Vue found → "Build modular Vue components with clear prop contracts"
- If Flutter found → "Create widget hierarchies following Material/Cupertino
  design"

**L4 (Integration-Contractor)** - Based on detected APIs:

- If Express found → "Maintain RESTful API contracts with OpenAPI docs"
- If FastAPI found → "Define typed API endpoints with automatic validation"
- If GraphQL found → "Maintain GraphQL schema contracts"

## Step 3: User Review (Strategic Layers Only)

After presenting the table, say:

---
**Strategic layers (L9-L5) define your project's purpose and require your input.**

**Technical layers (L1-L4) are auto-generated based on your detected tooling:**

- L1: [List detected linters]
- L2: [List detected test frameworks]
- L3: [List detected component frameworks]
- L4: [List detected API frameworks]

**Please review the strategic layers (L9-L5). Would you like to refine any of these?**

Options:

- "Accept all" - Proceed with generation
- "Refine L9" - Edit ultimate purpose layer
- "Refine L8" - Edit business value layer
- "Refine all" - Walk through each strategic layer
- "Restart" - Re-analyze with different focus

---

Wait for user response. If they want refinements, engage conversationally:

- Ask for their vision for the specific layer
- Propose updated purpose statement
- Confirm before moving to next layer

## Step 4: Generate Telos System

Once the hierarchy is finalized, create the following files:

### 4.1 Create `.telos/TELOS.md`

```markdown
# Telos: Ultimate Purpose

## Ultimate Purpose

[L9 purpose statement]

## Beneficiaries

[Who benefits from this project - extracted from README or inferred]

## Measurable Impact

[Success metrics - extracted from README or project goals]

## Ethical Constraints

[Constraints on how purpose is achieved - inferred from domain]

## 9-Level Hierarchy

| Level | Agent                  | Purpose      |
| ----- | ---------------------- | ------------ |
| L9    | Telos-Guardian         | [L9 purpose] |
| L8    | Market-Analyst         | [L8 purpose] |
| L7    | Insight-Synthesizer    | [L7 purpose] |
| L6    | UX-Simulator           | [L6 purpose] |
| L5    | Journey-Validator      | [L5 purpose] |
| L4    | Integration-Contractor | [L4 purpose] |
| L3    | Component-Architect    | [L3 purpose] |
| L2    | Function-Author        | [L2 purpose] |
| L1    | Syntax-Linter          | [L1 purpose] |

## Detected Technology Stack

**Languages**: [Detected languages] **Frameworks**: [Detected frameworks]
**Testing**: [Test frameworks] **Linting**: [Linters and formatters] **Build
Tools**: [Build systems]

## Initialization Metadata

- **Initialized**: [Current date]
- **AI Assistant**: Claude via Telos `/telos:init`
- **Project Type**: [Inferred project type]
```

### 4.2 Create Agent Files

For each level (L9 → L1), create `.telos/agents/l[N]-[agent-name].md`:

**Template structure:**

```markdown
# L[N]: [Agent Name]

## Purpose

[Purpose statement for this level]

## Role

[What this agent is responsible for]

## Capabilities

[What this agent can do]

## Tools

[List relevant tools based on detected stack]

## Validation Criteria

[How to verify this agent's output aligns with purpose]

## Examples

[2-3 examples of decisions this agent would make]
```

**Specific guidance per level:**

**L9 (Telos-Guardian)**: Ultimate purpose keeper

- Tools: Read access to all specs, ability to veto changes
- Examples: Reject feature that violates core purpose

**L8 (Market-Analyst)**: Business value measurer

- Tools: Analytics, metrics dashboards, user feedback
- Examples: Evaluate feature ROI against business goals

**L7 (Insight-Synthesizer)**: Product strategist

- Tools: User research, competitive analysis, roadmap planning
- Examples: Prioritize features based on user insights

**L6 (UX-Simulator)**: Experience designer

- Tools: Figma, user testing, accessibility checkers
- Examples: Ensure UI meets experience philosophy

**L5 (Journey-Validator)**: Workflow verifier

- Tools: E2E testing, user flow analysis, journey mapping
- Examples: Validate checkout flow meets user expectations

**L4 (Integration-Contractor)**: API contract enforcer

- Tools: [Detected API tools - OpenAPI, GraphQL schema, etc.]
- Examples: Ensure breaking changes follow versioning strategy

**L3 (Component-Architect)**: UI component designer

- Tools: [Detected framework - React, Vue, etc.], Storybook
- Examples: Design reusable button component following design system

**L2 (Function-Author)**: Function implementer

- Tools: [Detected test framework], code coverage tools
- Examples: Write TDD function with 100% coverage

**L1 (Syntax-Linter)**: Code quality enforcer

- Tools: [Detected linters - ESLint, Prettier, etc.]
- Examples: Reject PR with linting errors

### 4.3 Integrate with AI Assistant Configuration Files

Check for and update existing AI assistant configuration files to reference
`.telos/TELOS.md`:

**Files to check:**

- `AGENTS.md` - Unified standard (if exists, prepend Telos reference)
- `CLAUDE.md` - Claude Code (if exists, prepend Telos reference)
- `.cursorrules` - Cursor IDE (if exists, prepend Telos reference)
- `.clinerules` - Cline/VS Code (if exists, prepend Telos reference)
- `.windsurfrules` - Windsurf IDE (if exists, prepend Telos reference)
- `.roo/config` or `.roocode` - Roo Code (if exists, prepend Telos reference)
- `GEMINI.md` - Google Gemini (if exists, prepend Telos reference)

**For each existing file, prepend this instruction:**

```markdown
## Telos Purpose Hierarchy

**IMPORTANT**: Before making any significant changes to this project, consult
the Telos purpose hierarchy defined in `.telos/TELOS.md`. This file contains the
9-level purpose structure (L9: Ultimate Purpose → L1: Code Quality) that guides
all development decisions.

**When to reference Telos:**

- Before implementing new features (check L9-L5 strategic alignment)
- Before refactoring code (ensure L1-L4 technical standards are maintained)
- When resolving conflicts between requirements (appeal to higher-level purpose)
- During code review (validate against appropriate agent level)

**Quick reference:**

- L9 (Telos-Guardian): Ultimate purpose - does this serve our mission?
- L8 (Market-Analyst): Business value - does this deliver measurable outcomes?
- L7 (Insight-Synthesizer): Product strategy - does this align with our roadmap?
- L6 (UX-Simulator): Experience - does this meet UX standards?
- L5 (Journey-Validator): Workflows - do user journeys work end-to-end?
- L4 (Integration-Contractor): API contracts - are integrations maintained?
- L3 (Component-Architect): Components - does this follow our patterns?
- L2 (Function-Author): Functions - is this testable and maintainable?
- L1 (Syntax-Linter): Code quality - does this pass linting/formatting?

See `.telos/TELOS.md` for complete hierarchy and `.telos/agents/` for detailed
agent definitions.

---
```

**If no AI assistant config files exist**, create `AGENTS.md` with Telos
content.

### 4.4 Create Orchestrator (Optional)

If JavaScript/Node.js project, create `logos/orchestrator.js`:

```javascript
// Telos-Logos orchestrator
// Routes requests to appropriate L1-L9 agents

const hierarchy = [
  { level: 9, name: "telos-guardian", role: "ultimate-purpose" },
  { level: 8, name: "market-analyst", role: "business-value" },
  // ... all 9 levels
];

module.exports = { hierarchy };
```

## Step 5: Completion

Once all files are generated, display:

---
✅ **Telos initialization complete!**

**Generated files:**

- `.telos/TELOS.md` - Ultimate purpose and hierarchy
- `.telos/agents/l9-telos-guardian.md` through `l1-syntax-linter.md`
- Updated AI assistant config files (AGENTS.md, CLAUDE.md, .cursorrules, etc.)
- `logos/orchestrator.js` - Request router (if applicable)

**Next steps:**

1. Review the generated agent definitions in `.telos/agents/`
2. Run `/telos:validate` to check alignment with current codebase
3. Run `/telos:status` to see current configuration
4. Start developing with purpose-driven AI assistance!

**Your AI assistant now knows about Telos!** All existing config files (AGENTS.md,
CLAUDE.md, .cursorrules, etc.) have been updated to reference `.telos/TELOS.md`
before making changes.

**Slash commands available:**

- `/telos:validate` - Check if current code aligns with Telos
- `/telos:status` - Show current Telos configuration
- `/telos:reset` - Clear and reinitialize

---

## Tips

- If README is missing or vague, ask user for clarification before proposing L9
- If no testing framework detected, suggest adding one in L2
- If no linter detected, suggest adding one in L1
- For empty/greenfield projects, ask user for project vision before proposing
  hierarchy
- Be conversational and collaborative - this is a dialogue, not a survey
