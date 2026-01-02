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

## Step 4: Explain the Workflow

After saving the purpose spec, explain the SDD workflow:

---

✅ **Telos initialization complete!**

**Your project now has:**

- `telos/specs/L4-purpose/purpose.md` - Your project purpose
- `telos/specs/L3-experience/` - For user journey specs
- `telos/specs/L2-contract/` - For API/component contracts
- `telos/specs/L1-function/` - For function specs with TDD scenarios

**How Spec-Driven Development works:**

1. **Before coding**: Create a spec at the appropriate level
2. **Write tests**: Generate tests from spec scenarios
3. **Implement**: Write code with `@telos` annotation linking to spec
4. **Validate**: Run `/telos:validate` before commits

**Code annotation example:**

```typescript
// @telos L1:function:src/auth/validation:validateToken
export function validateToken(token: string): TokenValidation {
  // implementation
}
```

**Available commands:**

- `/telos:validate` - Validate specs, links, tests
- `/telos:status` - Show current configuration
- `/telos:sdd-discover` - Generate specs from existing code
- `/telos:sdd-context` - Load spec context before changes
- `/telos:sdd-generate-tests` - Generate tests from scenarios

**Next steps:**

1. For existing code: Run `/telos:sdd-discover` to generate specs
2. For new features: Create specs in `telos/specs/` before coding
3. Always add `@telos` annotations to link code to specs

---

## Tips

- If README is missing or vague, ask user for clarification
- For empty/greenfield projects, focus on defining clear purpose
- Be conversational - this is a dialogue, not a survey
- Remind users that specs come before code
