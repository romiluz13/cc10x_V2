---
name: tdd-patterns
description: Test-Driven Development methodology enforcing RED-GREEN-REFACTOR cycle. Use when implementing features with test-first discipline, writing tests before code, or ensuring quality through systematic testing.
---

# TDD Patterns

Test-Driven Development discipline: RED → GREEN → REFACTOR.

## Core Cycle

```
1. RED: Write failing test
   ↓
2. GREEN: Make it pass (minimal code)
   ↓
3. REFACTOR: Improve structure
   ↓
4. Repeat
```

## RED: Write Failing Test

Write test **before** implementation.

**Test should:**
- Describe desired behavior clearly
- Fail for the RIGHT reason (not compilation error)
- Be specific (one behavior per test)
- Follow existing test patterns

**Example:**
```javascript
// RED: This test fails because authenticateUser doesn't exist yet
test('authenticateUser returns token for valid credentials', async () => {
  const result = await authenticateUser('alice@example.com', 'password123');

  expect(result.success).toBe(true);
  expect(result.token).toBeDefined();
});
```

**Verify:** Run test, confirm it fails with expected message.

## GREEN: Make It Pass

Write **minimal** code to pass the test.

**Don't:**
- ❌ Optimize prematurely
- ❌ Add extra features
- ❌ Perfect the code

**Do:**
- ✓ Make test pass
- ✓ Use simplest approach
- ✓ Hard-code if needed (refactor later)

**Example:**
```javascript
// GREEN: Minimal implementation
async function authenticateUser(email, password) {
  // Just enough to pass the test
  const user = await db.users.findByEmail(email);

  if (!user) return { success: false };

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) return { success: false };

  const token = jwt.sign({ userId: user.id }, SECRET);

  return { success: true, token };
}
```

**Verify:** Run test, confirm it passes.

## REFACTOR: Improve Structure

Improve code **while keeping tests green**.

**Refactoring opportunities:**
- Extract methods
- Improve naming
- Remove duplication
- Simplify logic
- Add constants

**Example:**
```javascript
// REFACTOR: Better structure
async function authenticateUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return authFailure();

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return authFailure();

  const token = generateToken(user.id);
  return authSuccess(token);
}

// Extracted helpers
function authFailure() {
  return { success: false };
}

function authSuccess(token) {
  return { success: true, token };
}
```

**Verify:** Run tests, confirm they still pass.

## Test Types

### Unit Tests
Test single function/method in isolation.

```javascript
// Unit test
test('calculateDiscount applies percentage correctly', () => {
  expect(calculateDiscount(100, 0.2)).toBe(80);
  expect(calculateDiscount(50, 0.1)).toBe(45);
});
```

### Integration Tests
Test multiple components working together.

```javascript
// Integration test
test('user registration flow', async () => {
  const response = await api.post('/register', {
    email: 'new@example.com',
    password: 'secure123'
  });

  expect(response.status).toBe(201);

  const user = await db.users.findByEmail('new@example.com');
  expect(user).toBeDefined();
  expect(user.emailVerified).toBe(false);
});
```

### End-to-End Tests
Test complete user flow.

```javascript
// E2E test
test('user can login and view dashboard', async () => {
  await page.goto('/login');
  await page.fill('[name=email]', 'user@example.com');
  await page.fill('[name=password]', 'password');
  await page.click('button[type=submit]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

## Test Strategies

### Boundary Testing
Test edges of valid ranges.

```javascript
test('age validation boundaries', () => {
  expect(isValidAge(0)).toBe(false);   // Below min
  expect(isValidAge(1)).toBe(true);    // Min valid
  expect(isValidAge(50)).toBe(true);   // Mid-range
  expect(isValidAge(120)).toBe(true);  // Max valid
  expect(isValidAge(121)).toBe(false); // Above max
});
```

### Error Cases
Test failure scenarios.

```javascript
test('handles missing required fields', async () => {
  await expect(createUser({ email: 'test@example.com' }))
    .rejects
    .toThrow('Password is required');
});

test('handles invalid email format', async () => {
  const result = await validateEmail('not-an-email');
  expect(result.valid).toBe(false);
  expect(result.error).toBe('Invalid email format');
});
```

### Edge Cases
Test unusual but valid inputs.

```javascript
test('handles empty arrays', () => {
  expect(sumArray([])).toBe(0);
});

test('handles single-item arrays', () => {
  expect(sumArray([5])).toBe(5);
});

test('handles null values', () => {
  expect(processData(null)).toBe(null);
});
```

## Test Organization

### Arrange-Act-Assert (AAA)
```javascript
test('user can update profile', async () => {
  // Arrange: Set up test data
  const user = await createTestUser();
  const updates = { name: 'New Name' };

  // Act: Perform action
  const result = await updateProfile(user.id, updates);

  // Assert: Verify outcome
  expect(result.name).toBe('New Name');
  expect(result.updatedAt).toBeDefined();
});
```

### Test Fixtures
Reusable test data.

```javascript
// fixtures/users.js
export const validUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

export const invalidUser = {
  email: 'invalid-email',
  password: '123' // Too short
};

// In tests:
import { validUser } from './fixtures/users';

test('creates user with valid data', async () => {
  const user = await createUser(validUser);
  expect(user.id).toBeDefined();
});
```

## TDD Discipline Rules

**Rule 1:** Never write production code without a failing test.

**Rule 2:** Write only enough test to fail (including compilation failures).

**Rule 3:** Write only enough production code to pass the test.

**Breaking these rules?** Not doing TDD.

## Common Anti-Patterns

### ❌ Test After Implementation
```javascript
// Wrong: Code first, then test
function calculateTotal(items) { /* implementation */ }
test('calculates total', () => { /* test */ });
```

### ✓ Test Before Implementation
```javascript
// Correct: Test first, then implementation
test('calculates total', () => { /* test */ });
function calculateTotal(items) { /* implementation */ }
```

### ❌ Testing Implementation Details
```javascript
// Wrong: Testing internal state
test('user service calls database', () => {
  const spy = jest.spyOn(db, 'query');
  userService.getUser(123);
  expect(spy).toHaveBeenCalled();
});
```

### ✓ Testing Behavior
```javascript
// Correct: Testing outcomes
test('getUser returns user data', async () => {
  const user = await userService.getUser(123);
  expect(user.email).toBe('test@example.com');
});
```

## Test Speed

**Fast tests (< 100ms):** Unit tests, pure functions
**Medium tests (100ms-1s):** Integration tests with mocks
**Slow tests (> 1s):** E2E tests, real databases

**Strategy:**
- Run fast tests frequently (on save)
- Run medium tests on commit
- Run slow tests in CI/CD

## Mocking

When to mock:
- External APIs
- Slow operations (database, file I/O)
- Non-deterministic behavior (dates, random)

```javascript
// Mock external API
jest.mock('./api-client');
apiClient.fetchUser.mockResolvedValue({ id: 123, name: 'Alice' });

// Mock date
jest.useFakeTimers();
jest.setSystemTime(new Date('2025-10-27'));
```

When NOT to mock:
- Simple utility functions
- Logic you control
- When integration matters

## Red Flags

**Tests always pass?** Tests might not be testing anything.
**Tests flaky?** Race conditions, external dependencies, timing issues.
**Tests slow?** Too much setup, not using mocks, testing too much.
**Tests break on refactor?** Testing implementation, not behavior.

## Success Metrics

TDD working when:
- All code has tests
- Tests written before code
- Tests fail when expected
- Refactoring doesn't break tests
- High confidence in changes

---

**Remember:** RED (fail) → GREEN (pass) → REFACTOR (improve) → Repeat
