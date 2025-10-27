# Building Workflow

TDD-enforced implementation with incremental verification and manual checkpoints.

## Prerequisites

- Approved implementation plan from planning workflow
- Plan includes phases with clear success criteria

## Process

For each phase in the plan:

### 1. Pre-Phase Risk Check

Quick risk analysis:
```
Load analyzing-implementation-risks skill
Focus on: current phase only
Questions:
- Any new edge cases discovered?
- Dependencies changed since planning?
- Timing/concurrency concerns?
```

### 2. Test First (RED)

Spawn `test-writer` agent:
```
Task: test-writer
Prompt: "Write failing test for [phase requirement].
Follow existing test patterns in [test directory].
Test should fail for the RIGHT reason."
```

**Verify test fails** before proceeding.

### 3. Implement (GREEN)

Spawn `code-implementer` agent:
```
Task: code-implementer
Prompt: "Implement MINIMAL code to pass test.
File: [from plan]
Don't optimize yet, just make it work."
```

**Verify test passes** before proceeding.

### 4. Refactor (REFACTOR)

Spawn `refactorer` agent (optional):
```
Task: refactorer
Prompt: "Improve code structure without changing behavior.
Extract methods, improve names, remove duplication.
Tests must stay green."
```

**Verify tests still pass** after refactoring.

### 5. Automated Verification

Run all checks from plan's success criteria:

```bash
# Example (adjust to project):
npm test                  # All tests
npm run lint             # Linting
npm run typecheck        # Type checking
npm run build            # Build
```

All must pass before manual testing.

### 6. Manual Verification Checkpoint

Present:
```
✅ Phase [N/Total] Complete

Automated checks PASSED:
- [X] tests passing
- [X] linting clean
- [X] types valid
- [X] build successful

🛑 MANUAL TESTING REQUIRED

Please verify:
- [ ] [Manual criterion 1 from plan]
- [ ] [Manual criterion 2 from plan]
- [ ] [Manual criterion 3 from plan]

Once complete, respond:
- continue: Move to next phase
- fix: Issues found (describe)
- abort: Stop implementation
```

**Do not proceed until human confirms.**

### 7. Mark Phase Complete

Update plan file:
- Check off completed items
- Note any deviations from plan
- Document decisions made

Update todos:
```
[x] Phase 1: Database schema
[ ] Phase 2: API endpoints
[ ] Phase 3: Frontend UI
```

## RED-GREEN-REFACTOR Cycle

```
┌──────────────────────────────────┐
│ RED: Write failing test          │
│ - Test should fail                │
│ - Verify failure reason           │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ GREEN: Make test pass            │
│ - Minimal implementation          │
│ - Don't optimize yet              │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ REFACTOR: Improve structure      │
│ - Extract methods                 │
│ - Better names                    │
│ - Remove duplication              │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Tests still pass?                │
│ YES: Continue ──────────┐        │
│ NO: Revert refactor     │        │
└─────────────────────────┼────────┘
                          │
                          ▼
                    Next feature
```

## Load Skills

**tdd-patterns:** TDD methodology, test strategies
**analyzing-implementation-risks:** Pre-phase risk checks

## Agents Used

**test-writer:** Writes failing tests (RED)
**code-implementer:** Minimal implementation (GREEN)
**refactorer:** Improves structure (REFACTOR)

## Example Phase

```
Phase 2/5: User login endpoint

1. Risk check: Rate limiting needed, session management
2. RED: test-writer creates test for POST /login
   Test expects: 200 on valid creds, 401 on invalid
   Test FAILS ✓
3. GREEN: code-implementer adds login route
   Test PASSES ✓
4. REFACTOR: refactorer extracts validateCredentials()
   Tests PASSES ✓
5. Automated: All checks pass ✓
6. 🛑 MANUAL: Test login via Postman, verify tokens
   User confirms ✓
7. Mark complete, proceed to Phase 3
```

## Tips

**Keep phases small:** < 200 lines per phase
**Test first:** Never write code without a failing test
**Verify constantly:** Run tests after every change
**Manual testing matters:** Don't skip human verification
**Document decisions:** Note any deviations from plan
