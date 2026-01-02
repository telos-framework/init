# Sub-Agent Mapping to Telos Levels

This document maps the 15 specialized sub-agents to the 4 Telos SDD levels,
showing which sub-agents each level can delegate to for specific tasks.

## Sub-Agent Overview

All sub-agents are located in `templates/agents/sub-agents/` and are available
for delegation via the Task tool.

### Available Sub-Agents

1. **api-design.md** - REST/GraphQL API design, authentication, validation
2. **code-reviewer.md** - Code quality review, best practices validation
3. **component-implementation.md** - UI component creation, accessibility,
   responsiveness
4. **database-design.md** - Database schema, queries, optimization
5. **devops.md** - Deployment, CI/CD, infrastructure, monitoring
6. **documentation.md** - Technical documentation, guides, API docs
7. **feature-implementation.md** - Feature development, business logic
8. **infrastructure.md** - Cloud infrastructure, scalability, reliability
9. **polish.md** - Code optimization, performance tuning, refinement
10. **prd.md** - Product requirements documents, user stories
11. **quality.md** - QA, accessibility, security, performance testing
12. **refactoring.md** - Code restructuring, technical debt reduction
13. **research.md** - Technical research, library comparison, best practices
14. **security-audit.md** - Security review, vulnerability assessment
15. **testing.md** - Test creation, test strategy, coverage

## Telos Level Mapping

### L4: Purpose

**Primary Sub-Agents:**

- `prd.md` - Understanding product requirements at strategic level
- `research.md` - Strategic technology research and direction

**Use Cases:**

- Validating feature alignment with ultimate purpose
- Researching strategic technology decisions
- Understanding product vision from requirements

**Example Delegation:**

```markdown
Use the research subagent to analyze whether adopting [technology] aligns with
our purpose of [goal].
```

---

### L3: Experience

**Primary Sub-Agents:**

- `prd.md` - Product requirements and feature specifications
- `component-implementation.md` - UI component creation
- `research.md` - UX patterns and accessibility research
- `quality.md` - Accessibility validation
- `testing.md` - User journey E2E testing

**Use Cases:**

- Creating comprehensive PRDs
- Designing user interfaces
- Implementing accessible components
- E2E testing user journeys

**Example Delegation:**

```markdown
Use the component-implementation subagent to create an accessible [component]
following WCAG 2.1 AA standards.
```

---

### L2: Contract

**Primary Sub-Agents:**

- `api-design.md` - API contract definition
- `database-design.md` - Database schema contracts
- `documentation.md` - API documentation
- `security-audit.md` - API security review

**Secondary Sub-Agents:**

- `infrastructure.md` - Infrastructure contracts
- `devops.md` - CI/CD contracts

**Use Cases:**

- Designing API contracts
- Defining database schemas
- Documenting component interfaces
- Security validation of contracts

**Example Delegation:**

```markdown
Use the api-design subagent to design RESTful endpoints for [feature] with
OpenAPI documentation.
```

---

### L1: Function

**Primary Sub-Agents:**

- `feature-implementation.md` - Core function implementation
- `testing.md` - Unit test creation (TDD)
- `code-reviewer.md` - Code quality validation

**Secondary Sub-Agents:**

- `refactoring.md` - Code structure improvement
- `polish.md` - Performance optimization
- `documentation.md` - Code documentation

**Use Cases:**

- Implementing functions with TDD
- Writing unit tests
- Code quality review
- Refactoring and optimization

**Example Delegation:**

```markdown
Use the testing subagent to create unit tests for [function] covering all
scenarios from the L1 spec.
```

---

## Delegation Guidelines

### When to Delegate

1. **L4 (Purpose)**: Delegate strategic research and PRD creation
2. **L3 (Experience)**: Delegate UI/UX implementation and E2E testing
3. **L2 (Contract)**: Delegate API design and documentation
4. **L1 (Function)**: Delegate implementation, testing, and code review

### Delegation Format

Use the Task tool with appropriate subagent_type:

```markdown
Use the [subagent] subagent to [specific task] for [context].
```

### Best Practices

1. **Be specific**: Provide clear context and requirements
2. **Reference specs**: Include relevant spec IDs (e.g.,
   L1:function:src/auth:validate)
3. **Set boundaries**: Define scope and expected output
4. **Follow TDD**: For L1, always generate tests before implementation

## Common Workflows

### New Feature Development

1. **L4 (Purpose)** → `research.md` - Research if feature aligns with purpose
2. **L3 (Experience)** → `prd.md` - Create feature PRD with user stories
3. **L3 (Experience)** → `component-implementation.md` - Implement UI components
4. **L2 (Contract)** → `api-design.md` - Design API contracts
5. **L1 (Function)** → `testing.md` - Create unit tests (TDD)
6. **L1 (Function)** → `feature-implementation.md` - Implement functions
7. **L1 (Function)** → `code-reviewer.md` - Review implementation

### Major Technology Migration

1. **L4 (Purpose)** → `research.md` - Strategic technology research
2. **L2 (Contract)** → `api-design.md` - Design migration API contracts
3. **L1 (Function)** → `testing.md` - Create migration tests
4. **L1 (Function)** → `refactoring.md` - Execute migration

---

**Remember**: Sub-agents are tools for delegation. The SDD spec hierarchy
(L4→L1) defines WHAT to build; sub-agents help HOW to build it.
