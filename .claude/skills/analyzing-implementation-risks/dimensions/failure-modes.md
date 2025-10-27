# Dimension 7: Failure Modes & Recovery

## Overview

Everything fails eventually. Plan for failure, handle it gracefully, and recover automatically when possible. Focus on resilience, not just correctness.

## Analysis Questions

### What Can Fail?
- **Network:** Timeouts, DNS failures, SSL errors, connection refused
- **Database:** Connection lost, deadlock, constraint violation, out of space
- **File system:** Permission denied, disk full, file locked, missing directory
- **External APIs:** Rate limited, deprecated endpoint, changed response format, service down
- **Third-party services:** Cloud region outage, payment gateway down, email service degraded
- **Resources:** Out of memory, CPU throttled, connection pool exhausted

### Error Handling
- **Caught errors:** Are all errors caught?
- **Context:** Are errors logged with sufficient context?
- **User-facing:** Are errors user-friendly?
- **Information leakage:** Can errors leak sensitive information?
- **Circuit breakers:** Is there protection against cascading failures?

### Graceful Degradation
- **Read-only mode:** Can system operate without writes?
- **Cached data:** Can it fall back to cached data?
- **Queue operations:** Can operations be queued for retry?
- **Feature flags:** Can non-critical features be disabled?

### Recovery & Rollback
- **Partial failures:** Can partial failures be rolled back?
- **Manual retry:** Is there a way to manually retry?
- **Idempotency:** Are operations safe to retry?
- **Backup/restore:** Is there data backup capability?

## Common Failure Scenarios

### Scenario 1: Network Timeout

**Situation:** API request takes > 30 seconds, then times out.

**Problems without proper handling:**
- User waits indefinitely
- Resources held (connections, memory)
- No retry attempted
- No fallback to cached data

**Solution:**
```javascript
// Configure timeout and retries:
async function fetchWithRetry(url, options = {}) {
  const maxRetries = 3;
  const timeout = 10000;  // 10 seconds
  const backoffMs = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryable =
        error.name === 'AbortError' ||  // Timeout
        error.message.includes('ECONNREFUSED') ||  // Connection refused
        error.message.includes('ETIMEDOUT');  // Network timeout

      if (!isRetryable || isLastAttempt) {
        logger.error('Request failed', { url, attempt, error });
        throw error;
      }

      // Exponential backoff:
      const delay = backoffMs * Math.pow(2, attempt - 1);
      logger.warn(`Retry ${attempt}/${maxRetries} after ${delay}ms`, { url, error });
      await sleep(delay);
    }
  }
}

// Fallback to cache:
async function fetchDataWithFallback(url) {
  try {
    const data = await fetchWithRetry(url);
    await cache.set(url, data, { ttl: 3600 });  // Cache for 1 hour
    return data;
  } catch (error) {
    const cached = await cache.get(url);

    if (cached) {
      logger.info('Using cached data due to fetch failure', { url });
      return cached;
    }

    throw new Error('Data unavailable and no cache found');
  }
}
```

### Scenario 2: Database Deadlock

**Situation:** Two transactions lock resources in opposite order.

```sql
-- Transaction 1:
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Locks row 1
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Waits for row 2

-- Transaction 2 (simultaneously):
BEGIN;
UPDATE accounts SET balance = balance - 50 WHERE id = 2;  -- Locks row 2
UPDATE accounts SET balance = balance + 50 WHERE id = 1;  -- Waits for row 1

-- DEADLOCK! Neither can proceed.
```

**Solution:**
```javascript
async function transferFunds(fromId, toId, amount) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await db.transaction(async (tx) => {
        // ALWAYS lock in same order (by ID) to prevent deadlocks:
        const [lowerId, higherId] = [fromId, toId].sort();

        const [lowerAccount, higherAccount] = await Promise.all([
          tx.accounts.findUnique({ where: { id: lowerId }, lock: 'UPDATE' }),
          tx.accounts.findUnique({ where: { id: higherId }, lock: 'UPDATE' })
        ]);

        // Determine which is from/to:
        const fromAccount = fromId === lowerId ? lowerAccount : higherAccount;
        const toAccount = fromId === lowerId ? higherAccount : lowerAccount;

        if (fromAccount.balance < amount) {
          throw new InsufficientFundsError();
        }

        await tx.accounts.update({
          where: { id: fromId },
          data: { balance: fromAccount.balance - amount }
        });

        await tx.accounts.update({
          where: { id: toId },
          data: { balance: toAccount.balance + amount }
        });
      });

      return { success: true };

    } catch (error) {
      if (error.code === 'P2034') {  // Prisma deadlock error
        if (attempt < maxRetries) {
          logger.warn(`Deadlock detected, retry ${attempt}/${maxRetries}`);
          await sleep(Math.random() * 100);  // Random backoff to break symmetry
          continue;
        }
      }

      throw error;
    }
  }
}
```

### Scenario 3: Disk Full

**Situation:** Application tries to write file, disk is full.

**Problems without proper handling:**
- Partial file written (corrupted)
- Application crashes
- No cleanup of partial files
- User not notified

**Solution:**
```javascript
async function saveFile(filePath, content) {
  const tempPath = `${filePath}.tmp`;

  try {
    // Write to temporary file first:
    await fs.promises.writeFile(tempPath, content);

    // Verify file was written completely:
    const stats = await fs.promises.stat(tempPath);
    const expectedSize = Buffer.byteLength(content);

    if (stats.size !== expectedSize) {
      throw new Error(`File size mismatch: expected ${expectedSize}, got ${stats.size}`);
    }

    // Atomic rename (either succeeds completely or not at all):
    await fs.promises.rename(tempPath, filePath);

    return { success: true };

  } catch (error) {
    // Cleanup temp file:
    try {
      await fs.promises.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }

    if (error.code === 'ENOSPC') {
      logger.error('Disk full', { filePath, size: content.length });
      throw new DiskFullError('Unable to save file: disk is full');
    }

    throw error;
  }
}

// Monitor disk space:
async function checkDiskSpace() {
  const diskSpace = await checkDiskspace('/');

  if (diskSpace.free < 1024 * 1024 * 100) {  // Less than 100MB
    logger.error('Low disk space', { free: diskSpace.free });
    await alertOncall('LOW_DISK_SPACE', diskSpace);
  }
}

setInterval(checkDiskSpace, 60000);  // Check every minute
```

### Scenario 4: External API Rate Limiting

**Situation:** Third-party API returns `429 Too Many Requests`.

**Solution:**
```javascript
class RateLimitedClient {
  constructor(baseUrl, requestsPerSecond) {
    this.baseUrl = baseUrl;
    this.requestsPerSecond = requestsPerSecond;
    this.queue = [];
    this.isProcessing = false;
  }

  async request(endpoint, options) {
    return new Promise((resolve, reject) => {
      this.queue.push({ endpoint, options, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { endpoint, options, resolve, reject } = this.queue.shift();

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, options);

        if (response.status === 429) {
          // Rate limited - check Retry-After header:
          const retryAfter = response.headers.get('Retry-After');
          const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : 60000;

          logger.warn(`Rate limited, waiting ${delayMs}ms`, { endpoint });

          // Re-queue the request:
          this.queue.unshift({ endpoint, options, resolve, reject });

          await sleep(delayMs);
          continue;
        }

        resolve(await response.json());

      } catch (error) {
        reject(error);
      }

      // Delay between requests to respect rate limit:
      await sleep(1000 / this.requestsPerSecond);
    }

    this.isProcessing = false;
  }
}

const client = new RateLimitedClient('https://api.example.com', 10);  // 10 req/sec

// Usage (automatically queued and rate-limited):
const data = await client.request('/users/123');
```

### Scenario 5: Circuit Breaker Pattern

**Situation:** External service is down, we keep trying and failing.

**Problem:** Wastes resources calling service we know is down.

**Solution:**
```javascript
class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;  // 1 minute
    this.state = 'CLOSED';  // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await this.fn(...args);

      // Success - reset:
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }

      return result;

    } catch (error) {
      this.failureCount++;

      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.resetTimeout;
        logger.error('Circuit breaker opened', {
          failures: this.failureCount,
          resetAfter: this.resetTimeout
        });
      }

      throw error;
    }
  }
}

// Usage:
const getUser = new CircuitBreaker(
  async (userId) => {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    return response.json();
  },
  { failureThreshold: 5, resetTimeout: 60000 }
);

try {
  const user = await getUser.execute(123);
} catch (error) {
  // Use fallback/cached data
}
```

## Idempotency

**Definition:** Operation can be applied multiple times without changing result beyond first application.

**Why it matters:** Safe to retry failed operations.

### Idempotent Operations

```javascript
// ✓ Idempotent:
UPDATE users SET status = 'active' WHERE id = 123;
DELETE FROM users WHERE id = 123;
PUT /users/123 { "name": "Alice" }

// ✗ NOT idempotent:
UPDATE users SET login_count = login_count + 1 WHERE id = 123;
INSERT INTO users VALUES (...);
POST /users { "name": "Alice" }
```

### Making Operations Idempotent

```javascript
// Non-idempotent:
app.post('/orders', async (req, res) => {
  const order = await db.orders.create(req.body);
  return res.json(order);
});
// If client retries: duplicate orders!

// Idempotent (with idempotency key):
app.post('/orders', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency-Key header required' });
  }

  // Check if already processed:
  const existing = await db.orders.findByIdempotencyKey(idempotencyKey);
  if (existing) {
    return res.json(existing);  // Return existing result
  }

  // Create new order:
  const order = await db.orders.create({
    ...req.body,
    idempotencyKey
  });

  return res.json(order);
});

// Client usage:
import { v4 as uuidv4 } from 'uuid';

const response = await fetch('/orders', {
  method: 'POST',
  headers: {
    'Idempotency-Key': uuidv4(),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
});
```

## Graceful Degradation Examples

### Example 1: Read-Only Mode

```javascript
let isReadOnly = false;

// Health check sets read-only if database is down:
async function healthCheck() {
  try {
    await db.query('SELECT 1');
    isReadOnly = false;
  } catch (error) {
    logger.error('Database unavailable, entering read-only mode');
    isReadOnly = true;
  }
}

// Middleware to enforce:
app.use((req, res, next) => {
  if (isReadOnly && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return res.status(503).json({
      error: 'Service temporarily in read-only mode'
    });
  }
  next();
});
```

### Example 2: Feature Flags

```javascript
const features = {
  NEW_DASHBOARD: false,  // New feature not working, disable
  RECOMMENDATIONS: true,
  NOTIFICATIONS: true
};

function renderDashboard(user) {
  if (features.NEW_DASHBOARD) {
    return <NewDashboard user={user} />;
  }
  return <OldDashboard user={user} />;  // Fallback
}

// Remote feature flag control:
async function updateFeatureFlags() {
  try {
    const response = await fetch('/api/features');
    const remoteFlags = await response.json();
    Object.assign(features, remoteFlags);
  } catch (error) {
    // Keep existing flags if update fails
  }
}
```

## Failure Recovery Checklist

- [ ] **All errors caught:** No unhandled promise rejections
- [ ] **Errors logged:** With context (user ID, request ID, stack trace)
- [ ] **User-friendly messages:** No technical jargon
- [ ] **Sensitive data:** Not leaked in error messages
- [ ] **Retries:** Implemented with exponential backoff
- [ ] **Idempotency:** Operations safe to retry
- [ ] **Circuit breakers:** Prevent cascading failures
- [ ] **Graceful degradation:** Fallbacks for critical dependencies
- [ ] **Health checks:** Monitor service health
- [ ] **Alerting:** On-call notified of critical failures
- [ ] **Rollback plan:** Can deploy previous version quickly
- [ ] **Data backup:** Regular backups, tested restore procedure

---

**Key Principle:** Design for failure. Everything fails. Handle it gracefully, recover automatically, and alert humans when needed.
