# Dimension 2: Dependencies & Integrations

## Overview

Map all relationships between code components, external services, and shared resources. Most integration failures stem from incorrect assumptions about dependencies.

## Analysis Questions

### Direct Dependencies (What This Code Calls)
- **Functions/Methods:** What internal functions does this call?
- **Modules/Classes:** What other parts of the codebase are imported?
- **Libraries:** What third-party packages are used?
- **APIs:** What external HTTP endpoints are called?
- **Databases:** What tables/collections are accessed?
- **Files:** What files are read/written?
- **Environment:** What env vars/config is required?

### Reverse Dependencies (What Calls This Code)
- **Callers:** What other code imports/calls this function?
- **Impact radius:** If this changes, what breaks?
- **API contracts:** Are there documented guarantees?
- **Deprecation:** Can old callers be notified?

### Shared State & Resources
- **Global variables:** Are there shared singletons/statics?
- **Database tables:** Are tables shared across features?
- **Cache:** Are cache keys shared?
- **Files/Locks:** Are files accessed by multiple processes?
- **Message queues:** Are topics/queues shared?
- **Configuration:** Is config shared across services?

### External Integrations
- **Third-party APIs:** What external services are called?
- **Authentication:** OAuth, API keys, tokens?
- **Rate limits:** What limits exist?
- **SLAs:** What uptime/performance is guaranteed?
- **Versioning:** What API version is used?

## Critical Checks

### Single Source of Truth
- [ ] Is this logic duplicated elsewhere?
- [ ] If duplicated, are they consistent?
- [ ] Is there a canonical implementation?
- [ ] Can duplicates be consolidated?

**Risk:** Logic divergence causes inconsistent behavior across the system.

### Circular Dependencies
- [ ] Does A import B and B import A?
- [ ] Are there indirect cycles (A→B→C→A)?
- [ ] Can cycles be broken?

**Risk:** Initialization deadlocks, difficult refactoring, build failures.

### Dependency Availability
- [ ] What if dependency is down?
- [ ] Is there a timeout configured?
- [ ] Is there a fallback/cache?
- [ ] Is there a circuit breaker?
- [ ] Is failure logged/alerted?

**Risk:** Cascading failures where one dependency brings down entire system.

### Version Management
- [ ] Are dependency versions pinned?
- [ ] Can dependencies auto-update?
- [ ] Are breaking changes possible?
- [ ] Is there a deprecation policy?

**Risk:** Unexpected breakage from dependency updates.

## Dependency Mapping Template

```
DIRECT DEPENDENCIES:
├─ Internal:
│  ├─ UserService.authenticate() - validates credentials
│  ├─ Database.query() - executes SQL
│  └─ Logger.info() - writes logs
├─ External Libraries:
│  ├─ axios@1.4.0 - HTTP requests
│  ├─ jsonwebtoken@9.0.0 - JWT tokens
│  └─ bcrypt@5.1.0 - password hashing
└─ External Services:
   ├─ auth.example.com/oauth - OAuth provider
   ├─ PostgreSQL (localhost:5432) - primary database
   └─ Redis (localhost:6379) - session cache

REVERSE DEPENDENCIES:
├─ API endpoint: POST /login
├─ API endpoint: POST /register
└─ Admin dashboard: users.refresh()

SHARED STATE:
├─ users table (database) - shared with user management
├─ sessions cache (Redis) - shared with session middleware
└─ AUTH_SECRET (env var) - shared with all auth code

INTEGRATION POINTS:
├─ OAuth provider: Can fail if down (mitigation: local fallback)
├─ Database: Connection pool (max 20 connections)
└─ Redis: Cache miss fallback to database
```

## Common Dependency Patterns

### Pattern 1: API Client Wrapper

**Setup:**
```javascript
// Internal code calls API client:
import { fetchUserData } from './apiClient';

const user = await fetchUserData(userId);
```

**Risks:**
- API client doesn't handle rate limits → cascading failures
- No timeout configured → hangs forever
- No retry logic → transient failures become permanent
- Assumes response structure → breaks on API changes
- No circuit breaker → keeps calling failing API

**Mitigations:**
- Implement exponential backoff retries
- Configure reasonable timeout (e.g., 10s)
- Implement circuit breaker pattern
- Validate response structure with schema
- Monitor API health and error rates

### Pattern 2: Shared Database Table

**Setup:**
```sql
-- Both Feature A and Feature B write to same table:
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  status VARCHAR(50),
  ...
);
```

**Risks:**
- Feature A adds status "processing", Feature B doesn't handle it
- Concurrent writes cause race conditions
- Schema changes break one feature
- No ownership/coordination of table evolution

**Mitigations:**
- Document all possible status values
- Use database constraints (enums, check constraints)
- Coordinate schema changes across teams
- Use database transactions with proper isolation
- Consider separating tables per feature

### Pattern 3: Global Singleton

**Setup:**
```python
# Global cache used by many modules:
cache = Cache()

# Module A:
cache.set('user:123', user_data)

# Module B:
data = cache.get('user:123')
```

**Risks:**
- Cache key collisions between modules
- One module clears cache affecting others
- Memory leaks if cache grows unbounded
- No invalidation coordination
- Testing difficulties (shared state)

**Mitigations:**
- Use namespaced keys (`moduleA:user:123`)
- Implement TTL on all cache entries
- Document cache key conventions
- Provide cache.clear(namespace) method
- Consider per-module cache instances

### Pattern 4: Transitive Dependencies

**Setup:**
```
Your code → Library A → Library B → Library C
```

**Risks:**
- Library C has security vulnerability (CVE)
- Library B updates breaking change → Library A breaks → Your code breaks
- Dependency tree bloat (hundreds of transitive deps)
- License conflicts in deep dependencies
- Difficult to audit all transitive dependencies

**Mitigations:**
- Use `npm audit` / `pip-audit` / equivalent regularly
- Pin all dependency versions (including transitive)
- Review dependency tree size (`npm list --all`)
- Use tools like Dependabot for security updates
- Prefer libraries with minimal dependencies

## Integration Failure Scenarios

### Scenario 1: External API Down

**Situation:** Payment gateway API returns 503 (service unavailable)

**Questions:**
- Is this retried automatically?
- How many retries? Exponential backoff?
- Is user notified of temporary issue?
- Is order queued for later processing?
- Is incident logged and alerted?
- Is there a fallback payment method?

**Best Practice:**
```javascript
async function processPayment(orderId, amount) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const result = await paymentAPI.charge(amount);
      await db.orders.update(orderId, { status: 'paid' });
      return result;
    } catch (error) {
      attempt++;

      if (error.statusCode === 503 && attempt < maxRetries) {
        // Temporary failure, retry with backoff
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }

      // Permanent failure or max retries
      await db.orders.update(orderId, { status: 'payment_failed' });
      await notifyUser(orderId, 'payment_failed');
      await alertOncall('payment_api_failure', { orderId, error });
      throw error;
    }
  }
}
```

### Scenario 2: Database Connection Pool Exhausted

**Situation:** All 20 database connections are in use, new request hangs.

**Questions:**
- Is there a timeout on acquiring connection?
- Are connections properly released (finally blocks)?
- Are long-running queries identified and optimized?
- Is connection pool size appropriate for load?
- Is there connection leakage detection?

**Best Practice:**
```python
# Connection pool with timeout:
pool = ConnectionPool(
    max_connections=20,
    acquire_timeout=5.0,  # Wait max 5s for connection
    idle_timeout=300.0,   # Close idle connections after 5m
)

async def query_users(user_id):
    try:
        # Automatically released even if exception
        async with pool.connection() as conn:
            result = await conn.execute(
                "SELECT * FROM users WHERE id = $1",
                user_id,
                timeout=10.0  # Query timeout
            )
            return result
    except AcquireTimeout:
        logger.error("Connection pool exhausted")
        raise ServiceUnavailableError("Database overloaded")
    except QueryTimeout:
        logger.error("Slow query", extra={"user_id": user_id})
        raise ServiceUnavailableError("Request timeout")
```

### Scenario 3: Breaking API Change

**Situation:** Third-party API changes response format without notice.

**Old Response:**
```json
{
  "user": {
    "id": 123,
    "name": "Alice"
  }
}
```

**New Response:**
```json
{
  "data": {
    "userId": 123,
    "fullName": "Alice"
  }
}
```

**Questions:**
- Is API version pinned in requests?
- Is response structure validated?
- Is there monitoring for unexpected response shapes?
- Is there a rollback plan if API breaks?
- Are API changes tracked (changelog monitoring)?

**Best Practice:**
```javascript
// Version-specific API client:
const API_VERSION = 'v2';

async function fetchUser(userId) {
  const response = await axios.get(
    `https://api.example.com/${API_VERSION}/users/${userId}`,
    {
      headers: { 'Accept': `application/vnd.api+json; version=${API_VERSION}` }
    }
  );

  // Validate response structure:
  const schema = {
    user: {
      id: 'number',
      name: 'string'
    }
  };

  if (!validateSchema(response.data, schema)) {
    logger.error('API response schema mismatch', {
      expected: schema,
      received: response.data
    });
    throw new APIContractViolationError('Unexpected response format');
  }

  return response.data.user;
}

// Monitor for schema violations:
metrics.increment('api.schema_validation.success');
// Alert if validation failures spike
```

## Dependency Analysis Checklist

For each dependency:

- [ ] **Purpose:** Why is this dependency needed?
- [ ] **Alternatives:** Are there simpler alternatives?
- [ ] **Maintenance:** Is it actively maintained? Recent commits?
- [ ] **Security:** Any known vulnerabilities (CVE)?
- [ ] **License:** Compatible with project license?
- [ ] **Size:** How much does it add to bundle size?
- [ ] **Trust:** Is maintainer/org trustworthy?
- [ ] **Transitive:** How many dependencies does IT have?

For each integration:

- [ ] **Contract:** Is API contract documented?
- [ ] **Versioning:** Is API version pinned?
- [ ] **Authentication:** How is it authenticated?
- [ ] **Rate limits:** What limits exist?
- [ ] **Timeout:** Is timeout configured?
- [ ] **Retries:** Is retry logic implemented?
- [ ] **Circuit breaker:** Is there a circuit breaker?
- [ ] **Fallback:** What happens if it fails?
- [ ] **Monitoring:** Are failures monitored/alerted?

For shared state:

- [ ] **Ownership:** Who owns this resource?
- [ ] **Coordination:** How are changes coordinated?
- [ ] **Conflicts:** Can concurrent access cause issues?
- [ ] **Locking:** Is proper locking used?
- [ ] **Documentation:** Are conventions documented?

---

**Key Principle:** Explicit is better than implicit. Document all dependencies, integrations, and shared state. Plan for every dependency to fail.
