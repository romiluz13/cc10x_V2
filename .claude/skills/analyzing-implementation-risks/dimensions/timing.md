# Dimension 3: Timing, Concurrency & State

## Overview

Timing and concurrency bugs are the hardest to debug because they're non-deterministic. Analyze temporal dependencies and state transitions systematically.

## Analysis Questions

### Execution Order
- **Initialization:** What if this runs before dependencies are initialized?
- **Shutdown:** What if this runs after cleanup/teardown?
- **Mid-operation:** What if this runs during another operation?
- **Multiple calls:** Can this be called multiple times simultaneously?
- **Order dependencies:** What must run before/after this?

### Race Conditions
- **Concurrent modifications:** Can two instances modify the same data?
- **Check-then-act:** Is there a gap between checking and acting (TOCTOU)?
- **Async ordering:** Can async operations complete out of expected order?
- **Event sequencing:** Can events fire in unexpected order?

### State Management
- **Initial state:** What's the expected starting state?
- **Intermediate states:** Can state become invalid mid-operation?
- **State transitions:** Are all transitions valid and handled?
- **State persistence:** Is state correctly saved/restored?
- **State rollback:** Can state be rolled back on failure?

### Synchronization
- **Locks:** Is proper locking used for shared resources?
- **Atomicity:** Are multi-step operations atomic?
- **Transactions:** Are database operations transactional?
- **Deadlocks:** Can circular lock dependencies occur?

## Critical Scenarios

### Scenario 1: Double-Click / Double-Submit

**Situation:** User clicks "Submit Order" button twice rapidly.

**Questions:**
- [ ] Is button disabled after first click?
- [ ] Is request deduplicated on server?
- [ ] Can duplicate orders be created?
- [ ] Is there idempotency key?
- [ ] Is there database unique constraint?

**Example Risk:**
```javascript
// VULNERABLE:
async function submitOrder(items) {
  const order = await db.orders.create({ items });
  await paymentAPI.charge(order.total);
  return order;
}

// If called twice: Two orders created, two charges!
```

**Mitigation:**
```javascript
// SAFE:
async function submitOrder(items, idempotencyKey) {
  // Check if already processed:
  const existing = await db.orders.findByIdempotencyKey(idempotencyKey);
  if (existing) return existing;

  // Atomic transaction:
  return await db.transaction(async (tx) => {
    const order = await tx.orders.create({
      items,
      idempotencyKey,
      status: 'pending'
    });

    try {
      await paymentAPI.charge(order.total, { idempotencyKey });
      await tx.orders.update(order.id, { status: 'paid' });
    } catch (error) {
      // Transaction rolls back automatically
      throw error;
    }

    return order;
  });
}

// Client-side:
button.disabled = true;  // Prevent double-click
```

### Scenario 2: Async Operations Out of Order

**Situation:** User types "abc" quickly in search box → 3 API requests.

**Questions:**
- [ ] Can responses arrive out of order?
- [ ] Is latest request tracked?
- [ ] Are old responses discarded?
- [ ] Is there debouncing/throttling?
- [ ] Are in-flight requests cancelled?

**Example Risk:**
```javascript
// VULNERABLE:
async function searchUsers(query) {
  setLoading(true);
  const results = await api.search(query);
  setResults(results);  // What if old response arrives last?
  setLoading(false);
}

// User types: "a" → "ab" → "abc"
// Requests: 1    → 2     → 3
// Responses: 1 (50ms), 3 (100ms), 2 (150ms) <- wrong order!
// UI shows results for "ab" instead of "abc"
```

**Mitigation:**
```javascript
// SAFE:
let currentRequestId = 0;

async function searchUsers(query) {
  const requestId = ++currentRequestId;

  setLoading(true);
  const results = await api.search(query);

  // Ignore if newer request started:
  if (requestId !== currentRequestId) {
    return;  // Discard stale response
  }

  setResults(results);
  setLoading(false);
}

// Better: Debounce + cancel in-flight
const debouncedSearch = debounce(async (query) => {
  controller.abort();  // Cancel previous request
  controller = new AbortController();

  const results = await api.search(query, { signal: controller.signal });
  setResults(results);
}, 300);
```

### Scenario 3: Check-Then-Act (TOCTOU)

**Situation:** Check if user has balance, then deduct balance.

**Questions:**
- [ ] Is there a gap between check and act?
- [ ] Can state change between check and act?
- [ ] Is operation atomic?
- [ ] Is there proper locking?
- [ ] Can race condition occur?

**Example Risk:**
```python
# VULNERABLE (TOCTOU bug):
def withdraw(user_id, amount):
    balance = db.get_balance(user_id)

    # GAP HERE! Another thread can withdraw in parallel

    if balance >= amount:
        db.set_balance(user_id, balance - amount)
        return True
    return False

# If two threads call withdraw($50) with balance $100:
# Thread 1: reads balance $100, checks OK
# Thread 2: reads balance $100, checks OK
# Thread 1: writes balance $50
# Thread 2: writes balance $50  <- should be $0!
# User withdraws $100 but balance is $50 (lost $50!)
```

**Mitigation:**
```python
# SAFE (atomic operation):
def withdraw(user_id, amount):
    # Atomic SQL operation:
    result = db.execute(
        """
        UPDATE accounts
        SET balance = balance - :amount
        WHERE user_id = :user_id
        AND balance >= :amount
        RETURNING balance
        """,
        {"user_id": user_id, "amount": amount}
    )

    if result.rowcount == 0:
        return False  # Insufficient balance or user not found

    return True

# Alternative: Optimistic locking with version
def withdraw(user_id, amount):
    while True:
        account = db.get_account(user_id)  # Includes version number

        if account.balance < amount:
            return False

        # Try to update only if version unchanged:
        success = db.execute(
            """
            UPDATE accounts
            SET balance = :new_balance, version = version + 1
            WHERE user_id = :user_id AND version = :expected_version
            """,
            {
                "user_id": user_id,
                "new_balance": account.balance - amount,
                "expected_version": account.version
            }
        )

        if success.rowcount > 0:
            return True

        # Version mismatch, retry
        continue
```

### Scenario 4: State Corruption Mid-Operation

**Situation:** User updates profile, operation fails halfway.

**Questions:**
- [ ] Is operation wrapped in transaction?
- [ ] Can partial state be persisted?
- [ ] Is rollback implemented?
- [ ] Is state validated after operation?
- [ ] Are there state invariants?

**Example Risk:**
```javascript
// VULNERABLE:
async function updateUserProfile(userId, data) {
  await db.users.update(userId, { email: data.email });
  await sendVerificationEmail(data.email);  // FAILS HERE
  await db.users.update(userId, { emailVerified: false });

  // Email changed but verification email not sent!
  // User locked out of account!
}
```

**Mitigation:**
```javascript
// SAFE:
async function updateUserProfile(userId, data) {
  return await db.transaction(async (tx) => {
    // All-or-nothing transaction:
    const oldEmail = await tx.users.get(userId).email;

    await tx.users.update(userId, {
      email: data.email,
      emailVerified: false
    });

    try {
      await sendVerificationEmail(data.email);
    } catch (error) {
      // Transaction rolls back automatically
      logger.error('Verification email failed', { userId, error });
      throw new Error('Failed to send verification email');
    }

    // Commit transaction
  });
}

// Alternative: Compensating transaction
async function updateUserProfile(userId, data) {
  const oldEmail = await db.users.get(userId).email;

  try {
    await db.users.update(userId, { email: data.email });
    await sendVerificationEmail(data.email);
  } catch (error) {
    // Rollback email change:
    await db.users.update(userId, { email: oldEmail });
    throw error;
  }
}
```

## Common Timing Patterns

### Pattern 1: Lazy Initialization

**Setup:**
```javascript
let instance = null;

function getInstance() {
  if (!instance) {
    instance = new ExpensiveObject();
  }
  return instance;
}
```

**Risk:** Race condition if called concurrently (two instances created).

**Mitigation:**
```javascript
let instance = null;
let initializing = false;
let initPromise = null;

async function getInstance() {
  if (instance) return instance;

  if (initializing) {
    return await initPromise;  // Wait for existing init
  }

  initializing = true;
  initPromise = ExpensiveObject.create();
  instance = await initPromise;
  initializing = false;

  return instance;
}
```

### Pattern 2: Event Handlers

**Setup:**
```javascript
window.addEventListener('scroll', handleScroll);

function handleScroll() {
  updateLayout();  // Expensive operation
}
```

**Risk:** Called hundreds of times per second, overloading system.

**Mitigation:**
```javascript
// Throttle: Execute at most once per interval
window.addEventListener('scroll', throttle(handleScroll, 100));

// Debounce: Execute only after user stops
window.addEventListener('scroll', debounce(handleScroll, 200));

function throttle(fn, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}
```

### Pattern 3: Cleanup on Unmount

**Setup:**
```javascript
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  // MISSING: return () => clearInterval(interval);
}, []);
```

**Risk:** Interval continues after component unmounts (memory leak, crashes).

**Mitigation:**
```javascript
useEffect(() => {
  const interval = setInterval(fetchData, 5000);

  // Cleanup function:
  return () => {
    clearInterval(interval);
  };
}, []);

// For async operations:
useEffect(() => {
  let cancelled = false;

  async function load() {
    const data = await fetchData();
    if (!cancelled) {  // Check if still mounted
      setData(data);
    }
  }

  load();

  return () => {
    cancelled = true;  // Cancel on unmount
  };
}, []);
```

## Time-Related Edge Cases

### System Clock Changes

**Scenarios:**
- [ ] Daylight Saving Time transitions
- [ ] Timezone changes (user travels)
- [ ] NTP sync (clock jumps forward/backward)
- [ ] Manual clock adjustment by admin

**Impacts:**
- Scheduled tasks fire at wrong time
- TTL calculations incorrect
- Timestamp comparisons break
- JWT token expiry issues

**Mitigations:**
- Use monotonic clocks for durations (`performance.now()`, not `Date.now()`)
- Store timestamps in UTC, convert to local for display only
- Use robust scheduling libraries (cron with timezone awareness)
- Test with clock skew scenarios

### Leap Seconds

**Issue:** Rare but real - clocks can have 61 seconds in a minute.

**Mitigation:** Use standard libraries for time math, never roll your own.

## State Machine Analysis

For any stateful system, document valid state transitions:

```
ORDER STATES:
┌─────────┐
│ PENDING │
└────┬────┘
     │ payment_success
     ▼
┌──────┐    fulfillment_complete
│ PAID ├────────────────────────────┐
└───┬──┘                            │
    │ payment_refunded              ▼
    │                        ┌───────────┐
    └───────────────────────▶│ COMPLETED │
                             └───────────┘

INVALID TRANSITIONS:
PENDING → COMPLETED (skip PAID)
COMPLETED → PENDING (can't un-complete)
```

**Check:**
- [ ] All valid transitions documented
- [ ] All invalid transitions rejected
- [ ] Idempotent (same transition multiple times OK)
- [ ] Atomic (transition and side effects together)

## Concurrency Checklist

- [ ] **Identified shared resources:** What can be accessed concurrently?
- [ ] **Proper locking:** Are locks used correctly?
- [ ] **Lock ordering:** Is there consistent lock ordering (prevent deadlocks)?
- [ ] **Lock granularity:** Locks held for minimal time?
- [ ] **Deadlock detection:** Can deadlocks be detected/recovered?
- [ ] **Atomic operations:** Are multi-step operations atomic?
- [ ] **Idempotency:** Can operations be safely retried?
- [ ] **Optimistic locking:** Is versioning used where appropriate?
- [ ] **Async coordination:** Are promises/callbacks coordinated correctly?
- [ ] **Cancellation:** Can in-flight operations be cancelled?

---

**Key Principle:** Timing bugs are rare but catastrophic. Test concurrent scenarios explicitly, don't assume "it'll probably work."
