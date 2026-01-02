# Project Context for Claude

<!-- Telos Framework with Spec-Driven Development -->

This project uses the **Telos Framework** with **Spec-Driven Development
(SDD)**.

**CRITICAL**: Read `AGENTS.md` for complete instructions. Every function must
link to a spec via `@telos` annotation.

## Quick Reference

### Before Writing Code

1. Check if spec exists for your changes
2. If not, create spec first
3. Generate tests from spec
4. Implement with `@telos` annotation
5. Validate before commit

### Key Commands

```bash
npx telos context <spec-id>           # Load context before changes
npx telos spec generate-tests <id>    # Generate test skeletons
npx telos validate                    # Validate before commit
npx telos discover                    # Generate specs from existing code
```

### Annotation Format

```typescript
// @telos L1:function:src/module:functionName
export function functionName() {}

// @telos-test L1:function:src/module:functionName
describe("functionName", () => {
  // @telos-scenario L1:function:src/module:functionName:success
  it("should succeed", () => {});
});
```

## Slash Commands

Use these in Claude Code:

| Command           | Purpose                                 |
| ----------------- | --------------------------------------- |
| `/telos-init`     | Initialize Telos + SDD with AI analysis |
| `/telos-quick`    | Fast initialization (auto-accept)       |
| `/telos-validate` | Check alignment with purpose hierarchy  |
| `/telos-status`   | Show current configuration              |

## Spec Hierarchy

```
L4:purpose      → Why we exist + success metrics
L3:experience   → User journeys + UX
L2:contract     → APIs + components
L1:function     → Functions + TDD
```

---

**See `AGENTS.md` for complete Telos + SDD requirements.**
