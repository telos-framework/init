---
description: Initialize Telos spec-driven development for this project
---

# Telos Initialization

You are initializing the **Telos Framework** - a 4-level spec-driven development
system for AI-assisted software development. Your role is to analyze this
codebase, set up the spec hierarchy, and guide the user through defining their
project purpose.

## The 4-Level Hierarchy

| Level | Name       | Description                                     |
| ----- | ---------- | ----------------------------------------------- |
| L4    | Purpose    | Why the project exists + success metrics        |
| L3    | Experience | User journeys, UX requirements, analytics needs |
| L2    | Contract   | API contracts, component interfaces, boundaries |
| L1    | Function   | Individual functions with TDD scenarios         |

## ⚠️ CRITICAL: One Question at a Time

**Throughout this initialization:**

- Ask ONLY ONE question at a time
- NEVER preview the next question or step
- STOP and WAIT for user response before proceeding

## Important Note

Platform setup (slash commands, config files) was already completed by running
`npx telos-framework init`. The `telos/` directory structure also exists. Your
job is to help the user define their L4 purpose and understand how to use the
system.

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

- **package.json** (Node.js)
- **pyproject.toml** or **requirements.txt** (Python)
- **Cargo.toml** (Rust)
- **go.mod** (Go)

### 1.3 Source Code Structure

Scan the primary source directory (src/, lib/, app/) to identify:

- Component patterns
- API structure
- Architectural patterns
- Database integration

### 1.4 Existing Specs

Check if `telos/specs/L4-purpose/purpose.md` exists and read it.

## Step 2: Propose Purpose (L4)

Based on your analysis, propose the L4 Purpose spec:

```
═══════════════════════════════════════════════════════════════════════════
                         PROPOSED L4: PURPOSE
═══════════════════════════════════════════════════════════════════════════

Project: [Project name from package.json or directory]

Purpose: [One sentence - why this project exists]

Beneficiaries: [Who benefits from this project]

Success Metrics:
- [Metric 1]
- [Metric 2]
- [Metric 3]

Constraints:
- [Any ethical or technical constraints]

═══════════════════════════════════════════════════════════════════════════
```

Then ask:

**Does this capture your project's purpose? Would you like to refine it?**

Options:

- "Accept" - Proceed with this purpose
- "Refine" - Let's adjust the purpose statement
- "Start over" - Re-analyze with different focus

**STOP and WAIT for user response.**

## Step 3: Update L4 Purpose Spec

Once the user accepts (or after refinements), update
`telos/specs/L4-purpose/purpose.md`:

```markdown
<!-- telos-metadata
id: L4:purpose
level: 4
title: [Project Name]
-->

# L4: Purpose

## Why This Project Exists

[Purpose statement]

## Beneficiaries

[Who benefits]

## Success Metrics

- [Metric 1]
- [Metric 2]
- [Metric 3]

## Constraints

- [Constraint 1]
- [Constraint 2]

## Technology Stack

- **Languages**: [Detected]
- **Frameworks**: [Detected]
- **Testing**: [Detected]
- **Linting**: [Detected]

## Initialization

- **Date**: [Current date]
- **Method**: /telos:init
```

## Step 4: Define L3 Experiences (User Journeys)

Now ask about key user experiences. These are the main things users DO with the
application.

Ask:

**What are the key user journeys in your application?**

Examples of user journeys:

- "User signs up and creates their first project"
- "User searches for products and completes checkout"
- "Admin reviews and approves pending submissions"

List 2-5 key journeys (or say "skip" if you want to define these later):

**STOP and WAIT for user response.**

### 4.1 Create L3 Experience Specs

For each journey the user provides, create a spec file in
`telos/specs/L3-experience/`:

**Filename**: Convert journey to kebab-case (e.g., `user-signup-flow.md`)

```markdown
<!-- telos-metadata
id: L3:experience:[filename-without-extension]
level: 3
title: [Journey Title]
parent: L4:purpose
-->

# L3: [Journey Title]

## Overview

[Brief description of this user journey]

## User Story

As a [user type], I want to [action] so that [benefit].

## Journey Steps

1. **[Step 1 name]**
   - User action: [What the user does]
   - System response: [What happens]
   - Success criteria: [How we know it worked]

2. **[Step 2 name]**
   - User action: [What the user does]
   - System response: [What happens]
   - Success criteria: [How we know it worked]

[Continue for each step...]

## Edge Cases

- [Edge case 1]: [How it's handled]
- [Edge case 2]: [How it's handled]

## Analytics Events

- `[event_name]`: [When it fires, what it tracks]

## Related Specs

- L2: [Related contracts - to be defined]
- L1: [Related functions - to be defined]
```

### 4.2 Confirm Experiences

After creating the L3 specs, summarize:

```
═══════════════════════════════════════════════════════════════════════════
                      L3 EXPERIENCES CREATED
═══════════════════════════════════════════════════════════════════════════

Created [N] user journey specs:

1. telos/specs/L3-experience/[journey-1].md
   "[Journey 1 title]"

2. telos/specs/L3-experience/[journey-2].md
   "[Journey 2 title]"

[etc...]

These journeys will guide your L2 contracts and L1 functions.
═══════════════════════════════════════════════════════════════════════════
```

## Step 5: Update TELOS.md

Update `telos/TELOS.md` to include the experiences. See the template in
`lib/sdd/spec-templates.js` for the full format. Key sections to update:

- **Experiences** section listing all L3 journeys
- **Spec Levels** table with correct counts

## Step 6: Explain the Workflow

After saving specs, explain the SDD workflow:

---

✅ **Telos initialization complete!**

**Your project now has:**

- `telos/specs/L4-purpose/purpose.md` - Your project purpose
- `telos/specs/L3-experience/*.md` - Your user journey specs
- `telos/specs/L2-contract/` - For API/component contracts
- `telos/specs/L1-function/` - For function specs with TDD scenarios
- `telos/TELOS.md` - Entry point with workflow guidance

**Available commands:**

- `/telos:validate` - Validate specs, links, tests
- `/telos:status` - Show current configuration
- `/telos:sdd-discover` - Generate specs from existing code
- `/telos:sdd-context` - Load spec context before changes
- `/telos:sdd-generate-tests` - Generate tests from scenarios

**Next steps:**

1. For existing code: Run `/telos:sdd-discover` to generate L2/L1 specs
2. For new features: Follow the workflow in `telos/TELOS.md`
3. Always add `@telos` annotations to link code to specs

---

## Tips

- If README is missing or vague, ask user for clarification
- For empty/greenfield projects, focus on defining clear purpose and journeys
- Be conversational - this is a dialogue, not a survey
- Remind users that specs come before code
