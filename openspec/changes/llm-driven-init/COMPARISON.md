# Before vs After: Telos Initialization

## Current Architecture (v0.2.0)

```
┌──────────────────────────────────────────────────────────────┐
│ Terminal: $ telos init                                       │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│ Node.js CLI Process                                          │
│                                                              │
│  1. lib/discovery/telos-discovery.js                        │
│     → inquirer.prompt("What is the ultimate purpose?")      │
│     → inquirer.prompt("Who benefits?")                       │
│     → inquirer.prompt("What is the impact?")                │
│     → inquirer.prompt("What are constraints?")              │
│                                                              │
│  2. lib/discovery/hierarchy-builder.js                      │
│     → inquirer.prompt("L8 purpose?")                        │
│     → inquirer.prompt("L7 purpose?")                        │
│     → inquirer.prompt("L6 purpose?")                        │
│     → inquirer.prompt("L5 purpose?")                        │
│     → inquirer.prompt("L4 purpose?")                        │
│     → inquirer.prompt("L3 purpose?")                        │
│     → inquirer.prompt("L2 purpose?")                        │
│     → inquirer.prompt("L1 purpose?")                        │
│                                                              │
│  3. lib/discovery/code-scanner.js                           │
│     → fs.readdir() + regex pattern matching                 │
│                                                              │
│  4. lib/generators/*.js                                     │
│     → Generate TELOS.md                                      │
│     → Generate 9 agent files                                │
│     → Generate logos orchestrator                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘

User Experience:
- Must answer 12 questions in sequence
- No context on "what's a good L3 purpose?"
- Can't see codebase while answering
- ~10 minutes of typing
- One-shot: hard to refine later
```

## Proposed Architecture (slash command-first)

### Step 1: Installation (CLI as installer)

```
┌──────────────────────────────────────────────────────────────┐
│ Terminal: $ telos init                                       │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│ Node.js CLI - INSTALLER ONLY                                │
│                                                              │
│  lib/installers/slash-commands.js                           │
│  → Copy .claude/commands/telos/*.md to project              │
│                                                              │
│  lib/installers/memory-files.js                             │
│  → Create AGENTS.md from template                            │
│  → Create CLAUDE.md from template                            │
│                                                              │
│  Exit with message:                                          │
│  ✓ Installed /telos-init, /telos-validate, /telos-status   │
│  → Next: Run /telos-init to complete setup                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Installation:
- Runs once per project
- No questions asked
- ~10 seconds
- Just file copying
```

### Step 2: AI-Driven Discovery (slash command)

```
┌──────────────────────────────────────────────────────────────┐
│ Claude Code: > /telos-init                                   │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│ Claude Reads .claude/commands/telos/init.md                 │
│                                                              │
│ Executes Analysis Workflow:                                  │
│                                                              │
│  Step 1: Analyze Codebase                                    │
│  → Read README.md (native file read)                        │
│  → Read package.json/pyproject.toml/Cargo.toml              │
│  → Scan src/ directory structure                             │
│  → Run !`git status` for context                            │
│                                                              │
│  Step 2: Infer Hierarchy                                     │
│  → L9: Extract ultimate purpose from README                  │
│  → L8: Identify business metrics mentioned                   │
│  → L7: Detect user analytics (PostHog, etc.)                │
│  → L6: Infer UX concerns from framework                     │
│  → L5: Map user journeys from routes                        │
│  → L4: Auto-generate from API framework (Express, etc.)     │
│  → L3: Auto-generate from components (React, etc.)          │
│  → L2: Auto-generate from test framework (Vitest, etc.)     │
│  → L1: Auto-generate from linters (ESLint, etc.)            │
│                                                              │
│  Step 3: Present Proposal                                    │
│  → Show L9-L1 with reasoning                                │
│  → "Would you like to refine L9-L5 strategic layers?"       │
│                                                              │
│  [User reviews conversationally]                             │
│  User: "L9 looks good but L8 should focus on retention"     │
│  Claude: "Updated L8. Anything else?"                        │
│  User: "No, proceed"                                         │
│                                                              │
│  Step 4: Generate Files                                      │
│  → Write telos/content/TELOS.md                             │
│  → Write telos/agents/l9-telos-guardian.md (with context)   │
│  → Write telos/agents/l8-market-analyst.md                  │
│  → ... (all 9 agents with detected tools)                   │
│  → Write logos/orchestrator.js                               │
│  → Show summary of created files                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘

User Experience:
- No rigid questions, conversational refinement
- Claude has full codebase context
- User reviews AI proposals, provides strategic input
- ~2 minutes of conversation
- Can re-run /telos-init to iterate
```

## Side-by-Side Comparison

| Aspect | Current (CLI-based) | Proposed (Slash command) |
|--------|---------------------|--------------------------|
| **Installation** | `npm install -g telos-framework && telos init` | `telos init` (just installs files) |
| **Main Flow** | CLI prompts 12 questions | `/telos-init` analyzes and proposes |
| **User Input** | Type 12 detailed answers | Review proposals, refine 2-3 strategic layers |
| **Codebase Analysis** | JavaScript regex scanning | AI native file reading |
| **Time Required** | ~10 minutes | ~2 minutes |
| **Iteration** | Must re-run full `telos init` | Re-run `/telos-init` anytime |
| **Context Awareness** | No codebase context visible | AI has full project context |
| **L1-L4 (Technical)** | User must define | Auto-generated from detected tools |
| **L5-L9 (Strategic)** | User must define | AI proposes, user refines |
| **Distribution** | npm package only | npm + plugin marketplace |
| **Platform Support** | CLI works anywhere | Works in Claude Code, OpenCode, Cursor |

## Example Session Comparison

### Current Workflow
```bash
$ telos init

=== Telos Discovery ===

What is the ultimate purpose of your software?
> [User types: "Help developers build purpose-driven software"]

Who ultimately benefits from achieving this purpose?
> [User types: "Software engineers and their end users"]

What measurable impact defines success?
> [User types: "Increased code quality and alignment with business goals"]

What ethical or practical constraints guide this purpose?
> [User types: "Open source, privacy-respecting, accessible"]

L8 - Business/Social Value:
  What measurable business or social outcomes serve your Telos?
> [User types: "Reduced technical debt, faster feature delivery"]

L7 - User Insight:
  What user insights and behaviors must you understand?
> [User types: "How developers currently approach architecture decisions"]

... [6 more questions] ...
```

### Proposed Workflow
```
> /telos-init

Analyzing your project...

I've analyzed your README, package.json, and code structure. Here's what I found:

PROJECT CONTEXT:
- Purpose: "Help developers build purpose-driven software" (from README)
- Tech Stack: Node.js, TypeScript, Vitest, ESLint
- Architecture: CLI tool with modular discovery system

PROPOSED 9-LEVEL HIERARCHY:

L9: Telos-Guardian (Ultimate Purpose)
  Purpose: "Enable purpose-driven software development through AI-augmented architecture"
  Reasoning: Your README emphasizes "Aristotelian purpose hierarchy" and "strategic alignment"
  
L8: Market-Analyst (Business Value)
  Purpose: "Reduce technical debt and increase development velocity for engineering teams"
  Reasoning: Package description mentions "code quality" and "alignment with business goals"

L7: Insight-Synthesizer (User Insight)
  Purpose: "Understand how developers make architectural decisions and provide context-aware guidance"
  Reasoning: Tool is designed for developers; focus on decision support

... [Shows L6-L1 with reasoning] ...

L1: Syntax-Linter (Code Structure)
  Purpose: "Ensure code passes ESLint strict mode and TypeScript compiler checks"
  Reasoning: Detected ESLint, TypeScript, Prettier in your project

---

The technical layers (L1-L4) are based on your detected tooling.
The strategic layers (L9-L5) define your business purpose.

Would you like to refine any of the strategic layers (L9-L5)?

User: L9 looks great. For L8, let's focus more on "developer velocity" rather than just technical debt.

Understood. I'll update L8 to emphasize developer velocity. Anything else?

User: No, that's good.

Great! Generating your Telos system...

✓ Created telos/content/TELOS.md
✓ Created telos/agents/l9-telos-guardian.md
✓ Created telos/agents/l8-market-analyst.md
... [all 9 agents]
✓ Created logos/orchestrator.js

Your Telos multi-agent system is ready!
```

## Code Reduction

### Files Removed/Simplified
- ❌ `lib/discovery/telos-discovery.js` - Interactive prompts → Removed
- ❌ `lib/discovery/hierarchy-builder.js` - Sequential questions → Removed  
- ⚠️ `lib/discovery/code-scanner.js` - May keep as helper, not critical
- ⚠️ `lib/commands/init.js` - Becomes simple installer (~50 lines)

### Files Added
- ✅ `.claude/commands/telos/init.md` - Main slash command
- ✅ `.claude/commands/telos/validate.md` - Alignment check
- ✅ `.claude/commands/telos/status.md` - Config display
- ✅ `templates/AGENTS.md` - Memory file template
- ✅ `templates/CLAUDE.md` - Memory file template
- ✅ `lib/installers/slash-commands.js` - File copying logic
- ✅ `lib/installers/memory-files.js` - Template instantiation

### Net Effect
- **Less code to maintain** (prompts in markdown, not JavaScript)
- **More flexible** (AI adapts to any language, not hardcoded)
- **Better UX** (conversational vs rigid Q&A)

---

**Recommendation:** Approve and proceed with implementation. This is a significant UX improvement that aligns with how developers actually use AI coding assistants.
