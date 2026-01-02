# TELOS: Redshift

> Purpose-driven development with spec-code traceability

## Quick Start

```bash
telos validate        # Validate all specs and links
telos context <id>    # Load recursive context for AI
telos coverage        # Show spec-test coverage
telos orphans         # Find unlinked code
```

## Purpose

Enable developers to manage application secrets with true ownership and censorship resistance, using client-side encryption on Nostr.

See: [Full Purpose Spec](specs/L4-purpose/purpose.md)

## Spec Hierarchy

```
L4:purpose ─────────────────────────────────────────────────────┐
│ Project Purpose                     │
│                                                                │
├── L3:experience ──────────────────────────────────────────────┤
│   User journeys, UX requirements, analytics                   │
│                                                                │
├── L2:contract ────────────────────────────────────────────────┤
│   API contracts, component interfaces                         │
│                                                                │
└── L1:function ────────────────────────────────────────────────┤
    Individual functions with TDD scenarios                      │
└────────────────────────────────────────────────────────────────┘
```

## Spec Levels

| Level | Name | Description | Count |
|-------|------|-------------|-------|
| L4 | Purpose | Project purpose + success metrics | 1 |
| L3 | Experience | User journeys + UX | 0 |
| L2 | Contract | APIs + component interfaces | 0 |
| L1 | Function | Functions with TDD | 0 |

## Code Style

Style enforcement handled by existing tooling:
- **ESLint**: `.eslintrc.js`
- **Prettier**: `.prettierrc`
- **TypeScript**: `tsconfig.json`

## Annotation Format

```typescript
// @telos L1:function:src/module:functionName
export function functionName() {
  // implementation
}

// @telos-test L1:function:src/module:functionName
describe('functionName', () => {
  // @telos-scenario L1:function:src/module:functionName:success-case
  it('should handle success case', () => {
    // test
  });
});
```

## Workflow

1. **Create Spec** → Define requirements and scenarios
2. **Generate Tests** → `telos spec generate-tests <spec-id>`
3. **Run Tests** → Tests fail (Red)
4. **Implement Code** → Add @telos annotation
5. **Run Tests** → Tests pass (Green)
6. **Validate** → `telos validate`
7. **Commit** → Pre-commit hook verifies

## Links

- [Full Documentation](https://github.com/telos-framework/init)
- [Spec-Driven Development Guide](https://telos-framework.dev/sdd)
