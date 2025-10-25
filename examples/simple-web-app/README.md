# Example: Simple Web App Initialization

This example demonstrates initializing Telos for a new Express.js web
application.

## Scenario

You're building a task management web app called "TaskFlow" for small teams.

**Ultimate Purpose (Telos)**: Enable small teams to coordinate work efficiently
without meetings

## Prerequisites

```bash
# Install Node.js (>= 16)
node --version

# Install Telos globally
npm install -g telos-framework
```

## Steps

### 1. Create New Project

```bash
mkdir taskflow
cd taskflow
npm init -y
npm install express
npm install -D nodemon
```

### 2. Initialize Telos

```bash
telos init
```

### 3. Interactive Discovery

The initialization will ask you questions:

#### Phase 1: Telos Discovery

```
? What is the ultimate purpose of your software?
> Enable small teams to coordinate work efficiently without meetings

? Who are the primary beneficiaries?
> Small team leads and members (5-15 people)

? What problem does this solve?
> Teams waste 20+ hours/week in status meetings

? What does success look like?
> Teams reduce meeting time by 80% while maintaining alignment
```

#### Phase 2: Project Scan

Telos will detect:

- Language: JavaScript/Node.js
- Framework: Express.js
- Package manager: npm
- No linters detected → Will recommend ESLint
- No test framework → Will recommend Vitest

#### Phase 3: Tool Discovery

```
? Would you like to install recommended tools? (Y/n)
> Y

Installing:
- eslint (syntax validation)
- prettier (code formatting)
- vitest (unit testing)
- playwright (E2E testing)
```

#### Phase 4: Agent Generation

Telos generates 9 specialized agents adapted to your project:

- L1: Syntax-Linter (with ESLint/Prettier)
- L2: Function-Author (with Vitest)
- L3: Component-Architect (with Express patterns)
- L4: Integration-Contractor (with API testing)
- L5: Journey-Validator (with Playwright)
- L6: UX-Simulator (with browser automation)
- L7: Insight-Synthesizer (with analytics planning)
- L8: Market-Analyst (with success metrics)
- L9: Telos-Guardian (with your purpose statement)

#### Phase 5: Platform Setup

```
? Which AI platform are you using? (Use arrow keys)
❯ Claude (Code/Projects)
  Cursor
  GitHub Copilot
  Multiple platforms
  Other
```

Creates symlinks for your platform.

### 4. Explore Generated Files

```bash
ls -la

# New files:
# telos/                 - Telos framework files
# TELOS.md               - Your purpose hierarchy (symlinked)
# .eslintrc.json         - Linter config
# .prettierrc.json       - Formatter config
# vitest.config.js       - Test config
# playwright.config.js   - E2E test config
```

### 5. View Your Telos Hierarchy

```bash
cat TELOS.md
```

Output:

```markdown
# Project Telos: TaskFlow

## L9: Ultimate Purpose (Transcendental)

Enable small teams to coordinate work efficiently without meetings

**Beneficiaries**: Small team leads and members (5-15 people) **Problem
Solved**: Teams waste 20+ hours/week in status meetings **Success Criteria**:
Teams reduce meeting time by 80% while maintaining alignment

## L8: Business Objectives (Social Organization)

- Achieve 1000 active teams within 12 months
- Maintain 90%+ user satisfaction
- Reduce average team meeting time from 20hrs → 4hrs/week

## L7: User Insights (Self-Conscious)

- Track task completion patterns
- Monitor collaboration frequency
- Measure meeting time saved
- Collect team feedback

## L6: User Experience (Self-Aware)

- Simple, non-intrusive task updates
- Real-time team visibility
- Mobile-friendly interface
- Accessible to all team members

## L5: User Journeys (Genetic-Societal)

- Create task → Assign → Update → Complete
- Team overview → Identify blockers → Coordinate
- Weekly planning → Daily updates → Retrospective

## L4: System Integration (Cell)

- REST API for task management
- WebSocket for real-time updates
- Authentication & authorization
- Data persistence layer

## L3: Components (Thermostat)

- TaskList component
- TaskCard component
- TeamDashboard component
- NotificationCenter component

## L2: Core Functions (Clockwork)

- createTask()
- assignTask()
- updateTaskStatus()
- notifyTeam()

## L1: Code Standards (Framework)

- ESLint with Airbnb style guide
- Prettier for consistent formatting
- JSDoc for function documentation
```

### 6. Start Development with Telos

Now when you request features, your AI assistant operates as a multi-agent
collective:

```
You: "Add user authentication"

[Telos Multi-Agent System engages]

L9 Telos-Guardian:
  ✓ Auth aligns with purpose (team coordination requires identity)
  → Pass to L8

L8 Market-Analyst:
  ✓ Define success: 99.9% uptime, <100ms login time
  → Pass to L7

L7 Insight-Synthesizer:
  ✓ Track: login success rate, auth failures, session duration
  → Pass to L6

L6 UX-Simulator:
  ✓ Design: Simple email/password, "Remember me", SSO option
  → Pass to L5

L5 Journey-Validator:
  ✓ E2E test: Register → Login → Access Dashboard → Logout
  → Pass to L4

L4: Integration-Contractor:
  ✓ API: POST /auth/login, POST /auth/register, POST /auth/logout
  → Pass to L3

L3 Component-Architect:
  ✓ Components: LoginForm, RegisterForm, AuthProvider
  → Pass to L2

L2 Function-Author (TDD):
  ✓ Functions: hashPassword(), verifyToken(), generateSession()
  ✓ Tests: 100% coverage, all edge cases
  → Pass to L1

L1 Syntax-Linter:
  ✓ Code formatted, no linting errors
  → Implementation complete

[Bottom-up validation cascade]
L1 → L2 → L3 → L4 → L5 → L6 → L7 → L8 → L9
✓ All levels validate successfully

[Feature approved and aligned with purpose]
```

### 7. Validate Alignment

```bash
telos validate
```

Output:

```
=== Telos Validation ===

✓ Telos Hierarchy (9 levels defined)
✓ Agent Definitions (9 agents configured)
✓ Tool Configuration (4 tools detected: eslint, prettier, vitest, playwright)
✓ Platform Setup (CLAUDE.md symlinked)

Results: 4 passed, 0 failed
```

### 8. Check Status Anytime

```bash
telos status
```

Output:

```
=== Telos Status ===

✓ Telos initialized
  Location: /Users/you/taskflow/telos/content/TELOS.md

Components:
  ✓ Agents: 9 configured
  ✓ Tools: 4 discovered
  ✓ Platform: claude
  ✓ Initialized: Oct 24, 2025 5:30 PM
```

## Complete Example Project Structure

```
taskflow/
├── telos/
│   ├── content/
│   │   ├── TELOS.md              # Purpose hierarchy
│   │   ├── AGENTS.md             # All agent definitions
│   │   ├── LOGOS.md              # Orchestrator instructions
│   │   └── TOOLS.md              # Tool inventory
│   ├── agents/
│   │   ├── l1-syntax-linter.md
│   │   ├── l2-function-author.md
│   │   ├── l3-component-architect.md
│   │   ├── l4-integration-contractor.md
│   │   ├── l5-journey-validator.md
│   │   ├── l6-ux-simulator.md
│   │   ├── l7-insight-synthesizer.md
│   │   ├── l8-market-analyst.md
│   │   └── l9-telos-guardian.md
│   └── templates/
│       └── platform-configs/
├── .telos/
│   ├── config.json               # Runtime config
│   └── state.json                # Orchestrator state
├── src/
│   ├── routes/
│   ├── models/
│   └── index.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── TELOS.md                       # Symlink to telos/content/TELOS.md
├── CLAUDE.md                      # Symlink to telos/content/AGENTS.md
├── .eslintrc.json
├── .prettierrc.json
├── vitest.config.js
├── playwright.config.js
├── package.json
└── README.md
```

## Development Workflow

### Adding a Feature

1. **Request feature**: "Add task prioritization"
2. **Logos orchestrates**: Top-down decomposition (L9 → L1)
3. **Implementation**: Each level validates and implements
4. **Validation**: Bottom-up cascade (L1 → L9)
5. **Alignment check**: `telos validate`

### Maintaining Alignment

```bash
# Weekly check
telos validate

# After major changes
telos validate

# When adding tools
telos rediscover
```

## Benefits Demonstrated

1. **Purpose-Driven**: Every feature traces to "reduce meeting time"
2. **Multi-Level Validation**: Syntax → Logic → UX → Business → Purpose
3. **Tool Adaptation**: Agents use ESLint, Vitest, Playwright automatically
4. **Clear Hierarchy**: 9 specialized agents vs. generic AI assistant
5. **Continuous Alignment**: Validate at any time

## Next Steps

- Add more features using the Telos framework
- See agents coordinate through LOGOS.md orchestrator
- Watch validation cascade in action
- Maintain purpose alignment as project grows

## Common Patterns

### Pattern 1: Feature Request

```
Request → L9 validates → L8 defines metrics → ... → L2 implements → L1 lints
```

### Pattern 2: Bug Fix

```
Bug report → Identify level → Fix at that level → Validate cascade → Confirm alignment
```

### Pattern 3: Refactoring

```
L3 proposes refactor → Check L4 contracts → L2 updates functions → L1 reformats
```

## Troubleshooting

### Q: Telos validation fails

```bash
telos validate --verbose
# Shows which level failed
# Fix at that level
```

### Q: Agents not using my tools

```bash
telos rediscover
# Re-scans for tools
# Updates agent configurations
```

### Q: Need to change purpose

Edit `telos/content/TELOS.md`, then:

```bash
telos validate
# Ensures changes maintain coherence
```

---

**Result**: You now have a purpose-driven development framework that maintains
alignment from ultimate vision down to code syntax.
