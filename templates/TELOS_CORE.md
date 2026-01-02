# TELOS FRAMEWORK - REQUIRED READING

This project uses the **Telos Framework** with **Spec-Driven Development
(SDD)**.

**CRITICAL**: All code must trace back to specifications. Every function needs a
`@telos` annotation linking it to a spec.

## Spec-Driven Development (SDD)

This project enforces a 4-level spec hierarchy:

| Level  | Name       | Description                               |
| ------ | ---------- | ----------------------------------------- |
| **L4** | Purpose    | Why the project exists + success metrics  |
| **L3** | Experience | User journeys, UX requirements, analytics |
| **L2** | Contract   | API contracts, component interfaces       |
| **L1** | Function   | Individual functions with TDD scenarios   |

### Spec Location

All specs live in `telos/specs/`:

```
telos/specs/
├── L4-purpose/      # Project purpose (one file)
├── L3-experience/   # User journeys
├── L2-contract/     # API/component contracts
└── L1-function/     # Function-level specs with scenarios
```

### Code Annotation Requirements

**EVERY function MUST have a `@telos` annotation** linking it to a spec:

```typescript
// @telos L1:function:src/auth/validation:validateToken
export function validateToken(token: string): TokenValidation {
  // implementation
}
```

**EVERY test MUST have `@telos-test` and `@telos-scenario` annotations**:

```typescript
// @telos-test L1:function:src/auth/validation:validateToken
describe("validateToken", () => {
  // @telos-scenario L1:function:src/auth/validation:validateToken:valid-token
  it("should validate properly signed tokens", () => {
    // test
  });
});
```

## BEFORE Writing Any Code

1. **Check if a spec exists** for the code you're about to write
2. **If no spec exists**, create one first using the workflow below
3. **If spec exists**, read it to understand requirements and scenarios
4. **Generate tests** from the spec before implementing
5. **Add @telos annotation** to your code linking to the spec

## Automatic Workflows

### When Creating New Features

1. Run `npx telos context L4:purpose` to understand project purpose
2. Create spec at appropriate level:
   - User-facing feature → L3:experience spec
   - API/component → L2:contract spec
   - Function → L1:function spec
3. Generate tests: `npx telos spec generate-tests <spec-id>`
4. Implement with @telos annotations
5. Validate: `npx telos validate`

### When Modifying Existing Code

1. Find the spec for the code: check for `@telos` annotation
2. Load context: `npx telos context <spec-id>`
3. Update spec if requirements change
4. Update tests if scenarios change
5. Modify code
6. Validate: `npx telos validate`

### When Reviewing Code

Run validation to check:

- All specs have valid structure: `npx telos validate --specs`
- All annotations point to specs: `npx telos validate --links`
- All L1 specs have tests: `npx telos validate --tests`
- No orphaned code: `npx telos validate --orphans`

## TDD Workflow (REQUIRED)

1. **Spec First**: Create or update spec with scenarios
2. **Generate Tests**: `npx telos spec generate-tests <spec-id>`
3. **Red**: Run tests - they should fail
4. **Implement**: Write code with @telos annotation
5. **Green**: Run tests - they should pass
6. **Validate**: `npx telos validate`

## Key Commands

| Command                                   | When to Use                       |
| ----------------------------------------- | --------------------------------- |
| `npx telos spec init`                     | First time setup of SDD           |
| `npx telos discover`                      | Generate specs from existing code |
| `npx telos context <spec-id>`             | Before modifying code             |
| `npx telos spec create <level> <name>`    | Creating new feature              |
| `npx telos spec generate-tests <spec-id>` | Before implementing               |
| `npx telos validate`                      | Before committing                 |
| `npx telos coverage`                      | Check spec/test coverage          |
| `npx telos orphans`                       | Find code without specs           |

## Hard Requirements

### BEFORE Committing

You MUST ensure:

1. All new code has `@telos` annotations
2. All tests have `@telos-test` annotations
3. `npx telos validate` passes
4. No orphaned functions exist

### BEFORE Creating a PR

Run full validation:

```bash
npx telos validate
```

This checks:

- Spec structure integrity
- Code-spec link validity
- Test coverage
- Orphaned code detection

**If validation fails, fix issues before proceeding.**

## Spec ID Format

Full path format: `L{level}:{type}:{path}:{name}`

Examples:

- `L4:purpose` - Project purpose
- `L3:experience:auth-journey` - Auth user journey
- `L2:contract:src/api/auth` - Auth API contract
- `L1:function:src/auth/validation:validateToken` - Specific function

## Context Loading

When you need to understand code, load its full context:

```bash
npx telos context L1:function:src/auth/validation:validateToken
```

This loads:

- TELOS.md (project entry point)
- Full lineage from L4 purpose down to target
- Adjacent sibling specs
- Implementation file paths

Use this context to ensure changes align with purpose.

---

**Remember**: Code without specs is orphaned code. Specs without tests are
incomplete. Every line should trace back to purpose.
