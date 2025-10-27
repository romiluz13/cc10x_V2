# Dimension 8: Observability & Debuggability

## Overview

A perfect system still breaks. The question is: Can you detect failures and diagnose them quickly? Observability converts unknown failure into known signals.

## Analysis Questions

### Metrics & Monitoring
- **What gets measured:** Request rates, error rates, latency, resource usage?
- **Alerting thresholds:** What values trigger alerts?
- **Alert actionability:** Do alerts tell you what's wrong and how to fix it?
- **False positives:** Are there noisy alerts that get ignored?
- **Dead-man's switch:** What if metrics stop reporting?

### Logging Strategy
- **Structured logs:** JSON format with consistent fields?
- **Log levels:** Appropriate use of DEBUG, INFO, WARN, ERROR?
- **Correlation IDs:** Can you trace a request across services?
- **Context:** Enough information to understand what happened?
- **Sensitive data:** Are passwords/tokens accidentally logged?
- **Log retention:** How long are logs kept?

### Tracing
- **Request flows:** Can you trace a request through all services?
- **Performance bottlenecks:** Can you identify slow operations?
- **Dependency mapping:** Can you see which services are called?
- **Sampling:** Are traces sampled appropriately?

### Debugging Capabilities
- **Reproducibility:** Can you reproduce the issue locally?
- **State inspection:** Can you inspect system state when failure occurs?
- **Time travel:** Can you replay requests to debug?
- **Local development:** Can you test/debug locally?

## The Three Pillars of Observability

### 1. Metrics (What happened?)

Quantitative data points over time:
- Request count
- Error rate
- Response time (latency)
- CPU/memory usage
- Active connections
- Queue depth

**Example:**
```javascript
const prometheus = require('prom-client');

// Counter: only goes up (request count, error count)
const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status']
});

// Histogram: measures distributions (latency)
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.001, 0.01, 0.1, 0.5, 1, 5, 10]  // Latency buckets
});

// Gauge: can go up or down (active connections, queue size)
const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Middleware to track:
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestsTotal.inc({
      method: req.method,
      path: req.route?.path || req.path,
      status: res.statusCode
    });

    httpRequestDuration.observe({
      method: req.method,
      path: req.route?.path || req.path,
      status: res.statusCode
    }, duration);
  });

  activeConnections.inc();
  res.on('close', () => activeConnections.dec());

  next();
});

// Expose metrics endpoint:
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

### 2. Logs (Why did it happen?)

Discrete event records:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()  // Structured logging
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Add correlation ID to all logs:
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();
  res.setHeader('X-Correlation-Id', req.correlationId);

  // Bind correlation ID to logger:
  req.logger = logger.child({ correlationId: req.correlationId });

  next();
});

// Usage:
app.post('/users', async (req, res) => {
  req.logger.info('Creating user', {
    email: req.body.email,
    // DON'T log password!
  });

  try {
    const user = await createUser(req.body);

    req.logger.info('User created successfully', {
      userId: user.id,
      email: user.email
    });

    res.json(user);

  } catch (error) {
    req.logger.error('Failed to create user', {
      email: req.body.email,
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({ error: 'Internal server error' });
  }
});
```

**Log Levels Guide:**

```javascript
// DEBUG: Detailed diagnostic information (not in production)
logger.debug('Query parameters', { params: req.query });

// INFO: General informational messages (notable events)
logger.info('User logged in', { userId: user.id });

// WARN: Warning but not an error (recoverable issues)
logger.warn('Cache miss, falling back to database', { key });

// ERROR: Error that prevented operation (but service continues)
logger.error('Failed to send email', { userId, error: error.message });

// FATAL/CRITICAL: Severe error causing service to stop
logger.fatal('Database connection lost', { error });
```

### 3. Traces (How did it flow?)

Request journey across services:
```javascript
const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

// Set up tracing:
const provider = new NodeTracerProvider();
provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation()
  ]
});

const tracer = opentelemetry.trace.getTracer('user-service');

// Manual span creation:
app.get('/users/:id', async (req, res) => {
  const span = tracer.startSpan('fetch_user');

  try {
    span.setAttribute('user.id', req.params.id);

    // Database query (creates child span):
    const user = await db.users.findUnique({ where: { id: req.params.id } });

    // External API call (creates child span):
    const profile = await fetchUserProfile(user.externalId);

    span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
    res.json({ ...user, ...profile });

  } catch (error) {
    span.recordException(error);
    span.setStatus({
      code: opentelemetry.SpanStatusCode.ERROR,
      message: error.message
    });

    res.status(500).json({ error: 'Internal server error' });

  } finally {
    span.end();
  }
});
```

## Alerting Best Practices

### Rule 1: Alerts Must Be Actionable

**Bad alert:**
```
Alert: High error rate
Description: Error rate is 5%
```
*What should I do? Is 5% bad? Which errors?*

**Good alert:**
```
Alert: User login failures spiking
Description: Login error rate is 15% (threshold: 5%)
Current: 150 failures/min (baseline: 20 failures/min)
Likely cause: Authentication service degraded
Action: 1. Check auth service status
        2. Review auth service logs
        3. Page auth team if service is down
Runbook: https://wiki.company.com/runbooks/auth-failures
```

### Rule 2: Alert on Symptoms, Not Causes

**Bad:** "Database CPU > 80%"
- Maybe it's fine (legitimate load spike)

**Good:** "API response time p99 > 5 seconds"
- User impact is clear
- Database CPU might be the cause (or not)

### Rule 3: Avoid Alert Fatigue

```javascript
// Bad: Alert on every error
if (errorRate > 0) {
  alert('ERRORS DETECTED');
}

// Good: Alert when significantly above baseline
const baseline = getHistoricalAverage();
const currentRate = errorRate;

if (currentRate > baseline * 3) {  // 3x normal
  alert(`Error rate ${currentRate} is 3x baseline ${baseline}`);
}

// Better: Use anomaly detection
const isAnomaly = detectAnomaly(currentRate, historical);
if (isAnomaly) {
  alert('Anomalous error rate detected');
}
```

### Rule 4: Dead-Man's Switch

Detect when monitoring itself fails:
```javascript
// Heartbeat: Emit metric every minute
setInterval(() => {
  metrics.heartbeat.inc();
}, 60000);

// Alert if no heartbeat received in 5 minutes:
// (configured in monitoring system)
alert HeartbeatMissing
  if rate(heartbeat[5m]) == 0
  annotations:
    summary: "Service stopped reporting metrics"
    description: "No heartbeat from {{ $labels.service }} for 5 minutes"
```

## Debugging-Friendly Code

### Include Context in Errors

```javascript
// Bad: Generic error
throw new Error('Invalid input');

// Good: Specific error with context
throw new Error(`Invalid email format: ${email}`);

// Better: Structured error
class ValidationError extends Error {
  constructor(field, value, reason) {
    super(`Validation failed: ${field}`);
    this.field = field;
    this.value = value;
    this.reason = reason;
  }
}

throw new ValidationError('email', email, 'Invalid format');

// In error handler:
logger.error('Validation failed', {
  field: error.field,
  value: error.value,  // Sanitize sensitive values!
  reason: error.reason,
  userId: req.user?.id,
  correlationId: req.correlationId,
  stack: error.stack
});
```

### Correlation IDs Across Services

```javascript
// Service A: Generate correlation ID
const correlationId = uuidv4();

// Service A: Call Service B
const response = await fetch('http://service-b/api/data', {
  headers: {
    'X-Correlation-Id': correlationId
  }
});

// Service B: Extract and propagate correlation ID
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'];
  res.setHeader('X-Correlation-Id', req.correlationId);
  next();
});

// Service B: Include in logs
logger.info('Processing request', {
  correlationId: req.correlationId,
  endpoint: req.path
});

// Now you can grep all logs for single correlation ID to trace entire request!
```

### Feature Flags for Debugging

```javascript
// Enable verbose logging for specific user:
app.use((req, res, next) => {
  if (req.user?.id === 'debug-user-123') {
    req.logger.level = 'debug';
  }
  next();
});

// Enable debug mode via header:
app.use((req, res, next) => {
  if (req.headers['x-debug-mode'] === 'true' && req.user?.isAdmin) {
    res.locals.debugMode = true;
    req.logger.level = 'debug';
  }
  next();
});

// Return debug info in response (admin only):
if (res.locals.debugMode) {
  res.json({
    data: result,
    _debug: {
      queries: db.getExecutedQueries(),
      cacheHits: cache.getStats(),
      duration: Date.now() - start
    }
  });
}
```

## Observability Checklist

### Metrics
- [ ] Request count by endpoint and status code
- [ ] Request latency (p50, p95, p99)
- [ ] Error rate (4xx, 5xx)
- [ ] Resource usage (CPU, memory, disk, network)
- [ ] Business metrics (signups, purchases, active users)
- [ ] Dependency health (external API status)
- [ ] Queue depth (background jobs)

### Logs
- [ ] Structured logging (JSON format)
- [ ] Correlation IDs for request tracing
- [ ] Appropriate log levels (DEBUG, INFO, WARN, ERROR)
- [ ] Sensitive data redacted (passwords, tokens, PII)
- [ ] Error logs include stack traces
- [ ] Logs include context (user ID, request ID, timestamps)
- [ ] Log retention policy configured

### Traces
- [ ] Distributed tracing implemented
- [ ] Spans for database queries
- [ ] Spans for external API calls
- [ ] Spans for expensive operations
- [ ] Trace sampling configured
- [ ] Trace IDs in logs for correlation

### Alerts
- [ ] Alerts for high error rates
- [ ] Alerts for high latency
- [ ] Alerts for resource exhaustion
- [ ] Alerts actionable (include runbook link)
- [ ] Dead-man's switch for monitoring
- [ ] On-call rotation configured
- [ ] Alert escalation policy

### Debugging
- [ ] Errors include sufficient context
- [ ] Correlation IDs propagated across services
- [ ] Debug mode available (for admins)
- [ ] Local development environment works
- [ ] Can reproduce prod issues locally
- [ ] Feature flags for gradual rollout

---

**Key Principle:** You can't fix what you can't see. Instrument everything. Make failures visible and diagnosable.
