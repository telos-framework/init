# Example: Integrating Telos into an Existing Codebase

This example demonstrates adding Telos to an existing Express.js API project.

## Scenario

You have an existing REST API called "HealthTracker" that's been in production
for 6 months. The codebase has:

- 15,000 lines of code
- Express.js backend
- PostgreSQL database
- Basic tests with Mocha
- ESLint for linting
- No clear documentation of purpose
- Growing technical debt

You want to add Telos to maintain alignment and prevent further drift.

## Prerequisites

```bash
# Existing project structure
healthtracker/
├── src/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── app.js
├── test/
├── .eslintrc.json
├── package.json
└── README.md

# Install Telos
npm install -g telos-framework
```

## Steps

### 1. Backup Your Project

```bash
cd healthtracker
git checkout -b add-telos
git commit -am "Checkpoint before Telos integration"
```

### 2. Run Telos Init

```bash
telos init
```

### 3. Discovery Phase

#### Telos Discovery (New Questions)

Since you have existing code, Telos will ask additional questions:

```
? What is the ultimate purpose of your software?
> Help individuals achieve sustainable health through personalized tracking

? Who are the primary beneficiaries?
> Health-conscious individuals seeking data-driven wellness

? What problem does this solve?
> People struggle to maintain healthy habits without personalized insights

? What does success look like?
> 80% of users maintain healthy habits for 6+ months

? This appears to be an existing project. Should we analyze the codebase to infer purpose? (Y/n)
> Y

Analyzing codebase...
Found 127 files
Detected features:
- Meal logging
- Exercise tracking
- Sleep monitoring
- Goal setting
- Progress analytics

? Do these features align with your stated purpose? (Y/n)
> Y

? Any features that DON'T align with the purpose?
> Social sharing features (added for engagement but distract from core purpose)

Noted: Social features flagged for review
```

#### Project Scan

```
Scanning project...

Detected:
- Language: JavaScript (Node.js 18)
- Framework: Express.js 4.18
- Database: PostgreSQL (via pg library)
- Test framework: Mocha + Chai
- Linter: ESLint (Airbnb config)
- No E2E tests detected
- No accessibility testing
- No analytics integration

? Would you like to add recommended tools?
  [x] Playwright (E2E testing)
  [x] Vitest (faster unit tests - alongside Mocha)
  [ ] Migrate from Mocha to Vitest completely
  [x] Analytics integration (PostHog)
  
> Confirm
```

#### Tool Discovery

```
Scanning for MCP servers...
Found:
- postgres-mcp (already in use)

? Would you like to add:
  [x] filesystem-mcp (for better file operations)
  [ ] github-mcp (for repository integration)
  
> Confirm
```

### 4. Telos Hierarchy Generation

Telos analyzes your existing code and generates a hierarchy:

```markdown
# Project Telos: HealthTracker

## L9: Ultimate Purpose

Help individuals achieve sustainable health through personalized tracking

## L8: Business Objectives

- Maintain 80% user retention at 6 months
- Achieve 4.5+ app store rating
- Support 100k+ active users
- Reduce support tickets by automated insights

## L7: User Insights (INFERRED FROM CODE)

Currently tracking:

- Meal logging frequency
- Exercise completion rates
- Sleep pattern consistency

RECOMMENDED additions:

- User satisfaction surveys
- Feature usage analytics
- Dropout prediction

## L6: User Experience (INFERRED FROM CODE)

Current patterns:

- Manual data entry (meal, exercise, sleep)
- Daily summary view
- Weekly/monthly progress charts

GAPS IDENTIFIED:

- No onboarding flow
- Limited accessibility features
- No dark mode

## L5: User Journeys (INFERRED FROM CODE)

Existing journeys:

1. Onboard → Set goals → Log data → View progress → Adjust goals
2. Daily check-in → Log meal → Log exercise → Log sleep → Review day

ISSUES FOUND:

- No E2E tests for critical journeys
- Onboarding flow incomplete

## L4: System Integration (INFERRED FROM CODE)

Current architecture:

- REST API (Express)
- PostgreSQL database
- Session-based auth

BOUNDARY ISSUES:

- No rate limiting
- Inconsistent error responses
- Missing API versioning

## L3: Components (INFERRED FROM CODE)

Found 23 route handlers:

- /api/meals/*
- /api/exercises/*
- /api/sleep/*
- /api/goals/*
- /api/analytics/*

ISSUES:

- Route handlers too large (100-200 lines)
- Missing input validation on 8 endpoints
- No component-level tests

## L2: Core Functions (INFERRED FROM CODE)

Found 147 functions Test coverage: 62% (BELOW TARGET)

ISSUES:

- 23 functions without tests
- 12 functions >50 lines (complexity warning)
- Inconsistent error handling

## L1: Code Standards (DETECTED)

Current:

- ESLint (Airbnb config)
- No code formatter

VIOLATIONS FOUND:

- 127 linting warnings
- Inconsistent indentation in 34 files
- Missing JSDoc on public APIs

---

? Generate improvement roadmap based on analysis? (Y/n)

> Y
```

### 5. Generated Improvement Roadmap

Telos creates `telos/roadmap.md`:

```markdown
# HealthTracker Improvement Roadmap

## Immediate (Week 1)

### L1: Syntax & Structure

- [ ] Run `prettier --write .` to fix formatting
- [ ] Fix 127 ESLint warnings
- [ ] Add JSDoc to public API functions

### L2: Function Quality

- [ ] Add unit tests for 23 untested functions (→ 80% coverage)
- [ ] Refactor 12 complex functions (<50 lines each)
- [ ] Standardize error handling pattern

## Short-term (Month 1)

### L3: Component Validation

- [ ] Break down large route handlers into controllers
- [ ] Add input validation middleware (all endpoints)
- [ ] Add component-level tests for route handlers

### L4: Integration Integrity

- [ ] Implement API versioning (/api/v1/*)
- [ ] Add rate limiting middleware
- [ ] Standardize error response format
- [ ] Add integration test suite

### L5: Journey Completion

- [ ] Add E2E tests for critical journeys (Playwright)
- [ ] Complete onboarding flow
- [ ] Test error paths in user journeys

## Medium-term (Quarters 1-2)

### L6: UX Enhancement

- [ ] Add accessibility features (ARIA labels, keyboard nav)
- [ ] Implement dark mode
- [ ] Improve onboarding UX
- [ ] Add user satisfaction tracking

### L7: Insight Generation

- [ ] Integrate analytics (PostHog)
- [ ] Track feature usage
- [ ] Build dropout prediction model
- [ ] Add user feedback collection

### L8: Business Alignment

- [ ] Set up KPI dashboard
- [ ] Track retention metrics
- [ ] Monitor app store ratings
- [ ] Measure support ticket reduction

### L9: Purpose Review

- [ ] Evaluate social features against purpose
- [ ] Consider deprecating misaligned features
- [ ] Validate all features serve core purpose
- [ ] Strategic planning session

## Technical Debt Items

### High Priority

- [ ] Social sharing features (misaligned with purpose)
- [ ] 23 untested functions (risk)
- [ ] Missing input validation (security)

### Medium Priority

- [ ] Large route handlers (maintainability)
- [ ] Inconsistent error handling (UX)
- [ ] No E2E tests (quality)

### Low Priority

- [ ] 127 ESLint warnings (code quality)
- [ ] Missing JSDoc (documentation)
```

### 6. Review Generated Agents

Each agent is now adapted to your existing project:

```bash
cat telos/agents/l2-function-author.md
```

````markdown
# L2: Function-Author

## Your Project: HealthTracker

**Available Tools**:

- Mocha + Chai (existing test framework)
- Vitest (newly added, faster alternative)

**Current State**:

- 147 functions detected
- 62% test coverage
- 23 functions without tests

**Your Mandate**: Bring all functions to 80% test coverage using TDD workflow.

**Workflow**:

1. Identify untested function
2. Write test first (RED)
3. Implement to pass test (GREEN)
4. Refactor for clarity (REFACTOR)
5. Repeat

**Priority Functions** (flagged during scan):

- `calculateDailyCalories()` - No tests, complex logic
- `predictGoalCompletion()` - Partial tests, missing edge cases
- `generateWeeklySummary()` - No tests, 87 lines

**Report Format**:

```json
{
  "functions_tested": ["calculateDailyCalories"],
  "coverage_before": "62%",
  "coverage_after": "67%",
  "tests_added": 8,
  "refactoring": "Extracted helper function for calorie calculation"
}
```
````

````
### 7. Validate Current State

```bash
telos validate
````

Output:

```
=== Telos Validation ===

⚠ Telos Hierarchy (9 levels defined, 3 gaps identified)
✓ Agent Definitions (9 agents configured)
⚠ Tool Configuration (gaps: E2E testing, analytics)
✓ Platform Setup (CLAUDE.md symlinked)

Detailed Issues:

L1 Syntax-Linter:
  ⚠ 127 ESLint warnings present
  Recommendation: Run eslint --fix

L2 Function-Author:
  ✗ 62% coverage (target: 80%)
  ✗ 23 functions without tests
  Recommendation: Follow roadmap to add tests

L3 Component-Architect:
  ⚠ 8 endpoints missing validation
  Recommendation: Add validation middleware

L5 Journey-Validator:
  ✗ No E2E tests present
  Recommendation: Implement Playwright tests

L6 UX-Simulator:
  ⚠ Accessibility features incomplete
  Recommendation: Add ARIA labels, keyboard navigation

L7 Insight-Synthesizer:
  ✗ No analytics integration
  Recommendation: Configure PostHog

L9 Telos-Guardian:
  ⚠ Social features misaligned with purpose
  Recommendation: Review and deprecate

Results: 2 passed, 5 warnings, 2 failures

Next steps:
1. Address L2 test coverage (highest priority)
2. Add L5 E2E tests
3. Review L9 feature alignment
```

### 8. Start Incremental Improvements

#### Fix L1 Issues

```bash
# Run formatter
npx prettier --write .

# Fix lint issues
npx eslint --fix src/

# Validate
telos validate
```

#### Address L2 Coverage

Request from your AI assistant:

```
You: "Add tests for calculateDailyCalories function following TDD"

[L2 Function-Author agent activates]

L2: Reading function at src/utils/calories.js:45
L2: Function calculates BMR + activity multiplier - no tests found
L2: Starting TDD workflow...

[Writes test first]
L2: Created test/unit/calories.test.js with 8 test cases
L2: Running tests... 8 failing (expected - RED phase)

[Implements function]
L2: Fixed edge cases found in tests
L2: All tests passing (GREEN phase)

[Refactors]
L2: Extracted BMR calculation to separate function
L2: Tests still passing

L2: Report:
- Coverage: 62% → 65%
- Tests added: 8
- Functions tested: 1
- Next: 22 functions remain
```

### 9. Continuous Alignment

As you make changes, validate alignment:

```bash
# After adding feature
git diff

# Validate against Telos
telos validate

# Check which level it affects
# Update roadmap as needed
```

### 10. Quarterly Purpose Review

```bash
# Review social features flagged as misaligned
cat telos/content/TELOS.md

# Decision: Deprecate social sharing
# Update roadmap
vim telos/roadmap.md

# Add deprecation plan
# Validate alignment
telos validate
```

## Key Differences: Existing vs New Project

### New Project

- Start with clear purpose
- Build aligned from day 1
- Proactive validation

### Existing Project (This Example)

- **Infer purpose** from code
- **Identify misalignment** through analysis
- **Generate roadmap** for improvement
- **Incremental adoption** of Telos practices
- **Technical debt management** guided by purpose

## Benefits Realized

### Before Telos

- Unclear purpose
- Features added reactively
- 62% test coverage
- No alignment validation
- Growing technical debt

### After Telos

- Explicit purpose statement
- Feature decisions guided by purpose
- Roadmap to 80% coverage
- Continuous alignment validation
- Prioritized debt reduction

## Common Issues & Solutions

### Issue: "Too many problems identified"

**Solution**: Focus on one level at a time

```bash
# Start with L1 (quick wins)
npx eslint --fix .
npx prettier --write .

# Move to L2 (important)
# Add tests incrementally

# Address higher levels later
```

### Issue: "Existing tests use Mocha, Telos suggests Vitest"

**Solution**: Gradual migration

```bash
# Keep Mocha for existing tests
# Write new tests in Vitest
# Migrate incrementally over time

# Both frameworks can coexist:
{
  "scripts": {
    "test:mocha": "mocha test/**/*.test.js",
    "test:vitest": "vitest run test/**/*.spec.js",
    "test": "npm run test:mocha && npm run test:vitest"
  }
}
```

### Issue: "Can't justify removing profitable but misaligned feature"

**Solution**: Document the tradeoff

```markdown
## L9: Purpose Alignment Exception

Feature: Social sharing Status: Misaligned with core purpose Business Impact:
15% of user engagement Decision: Keep for now, but:

- Don't expand
- Monitor for purpose drift
- Revisit in Q2 review
- Consider spin-off product
```

## Incremental Adoption Timeline

### Week 1: Setup

- Run `telos init`
- Review generated hierarchy
- Fix L1 issues (quick wins)

### Month 1: Foundation

- Address L2 test coverage
- Add L4 integration tests
- Implement L5 E2E tests

### Quarter 1: UX & Insights

- L6 accessibility improvements
- L7 analytics integration
- L8 KPI tracking

### Quarter 2: Strategic Alignment

- L9 purpose review
- Deprecate misaligned features
- Refine purpose if needed

## Result

You now have:

- ✅ Clear purpose statement
- ✅ 9-level validation hierarchy
- ✅ Prioritized improvement roadmap
- ✅ Technical debt aligned with purpose
- ✅ Continuous alignment validation
- ✅ Agents adapted to your existing tools

Your existing codebase is now **purpose-driven** rather than **feature-driven**.

---

**Next**: Continue working through the roadmap, validating alignment with
`telos validate` after each change.
