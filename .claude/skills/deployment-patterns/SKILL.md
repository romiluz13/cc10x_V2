---
name: deployment-patterns
description: Deployment strategies with staged rollouts, rollback procedures, and monitoring. Use when planning production deployments, creating rollback procedures, or setting up deployment monitoring and alerting.
---

# Deployment Patterns

Safe deployment strategies with fast rollback procedures.

## Staged Rollout Pattern

Deploy incrementally to minimize blast radius.

### 5-Stage Rollout

```
Stage 1: Infrastructure (0% traffic)
- Database migrations
- Config updates
- Feature flags
Validate: Schema changes successful
Duration: 10-30 minutes

Stage 2: Canary (1-5% traffic)
- Small user segment
Validate: Error rate < 2x baseline
Duration: 1-4 hours

Stage 3: Partial (10-25% traffic)
- Larger segment
Validate: Metrics stable
Duration: 4-24 hours

Stage 4: Majority (50-75% traffic)
- Most users
Validate: System healthy
Duration: 24-48 hours

Stage 5: Full (100% traffic)
- All users
Validate: No issues for 24h
Duration: Ongoing
```

### Validation at Each Stage

**Automatic (required):**
- Error rate < baseline + 10%
- P99 latency < SLA + 20%
- No 500 errors > 1% of requests
- CPU/memory < 80% capacity

**Manual (recommended):**
- Spot check feature works
- Review monitoring dashboard
- Check alert channels
- Sample user feedback

### Rollback Triggers

**Automatic rollback if:**
- Error rate > 5%
- P99 latency > 5s
- Any 500 errors > 5%
- Resource usage > 95%

**Manual rollback if:**
- User complaints spike
- Data corruption detected
- Security issue found
- Business metrics drop significantly

## 3-Level Rollback Strategy

Fast recovery with escalating options.

### Level 1: Feature Flag (< 1 min)

**When:** Immediate issues with new feature

**Action:**
```bash
# Set feature flag to false
kubectl set env deployment/app FEATURE_NAME=false
# Or in config management
curl -X PUT config-server/features/FEATURE_NAME -d '{"enabled": false}'
```

**Validation:**
- Feature disappears from UI
- Old behavior restored
- Error rate returns to baseline

**Pros:** Instant, no deployment needed
**Cons:** Feature must support flag

### Level 2: Configuration Rollback (< 5 min)

**When:** Feature flag insufficient, config change needed

**Action:**
```bash
# Deploy previous config
kubectl apply -f config/v-previous.yaml
kubectl rollout restart deployment/app
```

**Validation:**
- Config reverted
- System behaves as before
- No data loss

**Pros:** Faster than code deploy
**Cons:** Only works for config issues

### Level 3: Code Rollback (< 15 min)

**When:** Must revert code changes

**Action:**
```bash
# Revert commit
git revert [commit-sha]
git push origin main

# Or rollback deployment
kubectl rollout undo deployment/app

# Or previous version
kubectl set image deployment/app app=image:v-previous
```

**Validation:**
- Previous version deployed
- Tests pass in prod
- System stable

**Pros:** Complete rollback
**Cons:** Slowest option, may lose data

## Monitoring & Alerting

### Key Metrics to Track

**Business Metrics:**
- Feature usage count
- Conversion rate
- Active users
- Key user actions

**Technical Metrics:**
- Request rate
- Error rate (4xx, 5xx)
- Response time (p50, p95, p99)
- CPU usage
- Memory usage
- Database query time
- Queue depth

### Alert Thresholds

**Critical (page on-call):**
- Error rate > 5%
- P99 latency > 5s
- Any 500 errors
- CPU/memory > 95%
- Service unreachable

**Warning (notify channel):**
- Error rate > 2%
- P95 latency > 2s
- CPU/memory > 80%
- Unusual traffic patterns

**Info (log only):**
- Error rate > baseline
- Latency increasing
- Resource usage trending up

### Dead-Man's Switch

Alert if metrics stop reporting:

```yaml
alert: MetricsNotReporting
condition: rate(http_requests[5m]) == 0
duration: 5m
severity: critical
message: "Service stopped reporting metrics"
```

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Security review complete
- [ ] Performance tested
- [ ] Manual testing done
- [ ] Documentation updated
- [ ] Rollback plan documented
- [ ] On-call notified
- [ ] Stakeholders informed

### During Deployment

- [ ] Execute stage 1 (infrastructure)
- [ ] Validate stage 1
- [ ] Execute stage 2 (canary)
- [ ] Monitor metrics for 1-4h
- [ ] Validate stage 2
- [ ] Execute stage 3 (partial)
- [ ] Monitor metrics for 4-24h
- [ ] Validate stage 3
- [ ] Execute stage 4 (majority)
- [ ] Monitor metrics for 24-48h
- [ ] Validate stage 4
- [ ] Execute stage 5 (full)
- [ ] Monitor for 24h

### Post-Deployment

- [ ] Metrics stable for 24h
- [ ] No user complaints
- [ ] Performance acceptable
- [ ] Document any issues
- [ ] Retrospective if needed
- [ ] Update runbooks

## Database Migration Patterns

### Safe Migration Strategy

**Never in same deploy:**
- Schema change + code change

**Do instead:**
1. Deploy backward-compatible schema
2. Deploy code using new schema
3. Remove old schema (later)

### Example: Adding Column

**Bad (breaks rollback):**
```sql
-- Deploy 1: Add column + use it
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
-- Code immediately requires phone
```

**Good (rollback safe):**
```sql
-- Deploy 1: Add nullable column
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;
-- Code ignores phone, still works

-- Deploy 2 (after validation): Use column
-- Code starts using phone

-- Deploy 3 (weeks later): Make required
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
```

### Example: Renaming Column

**Use 3-phase approach:**
```sql
-- Phase 1: Add new column
ALTER TABLE users ADD COLUMN email_address VARCHAR(255);
UPDATE users SET email_address = email; -- Copy data
-- Code reads/writes both columns

-- Phase 2 (after validation): Switch to new column
-- Code only uses email_address

-- Phase 3 (weeks later): Drop old column
ALTER TABLE users DROP COLUMN email;
```

## Feature Flag Patterns

### Toggle Types

**Release Toggle:** Enable/disable feature
```javascript
if (featureFlags.isEnabled('NEW_CHECKOUT')) {
  return <NewCheckout />;
} else {
  return <OldCheckout />;
}
```

**Experiment Toggle:** A/B testing
```javascript
if (experiment.variant('checkout_flow') === 'B') {
  return <CheckoutVariantB />;
}
```

**Ops Toggle:** Circuit breaker
```javascript
if (featureFlags.isEnabled('USE_NEW_API')) {
  return await newAPI.call();
} else {
  return await fallbackAPI.call();
}
```

### Flag Lifecycle

1. **Create:** Flag off by default
2. **Test:** Enable for internal users
3. **Rollout:** Gradually increase percentage
4. **Complete:** 100% on for weeks
5. **Remove:** Delete flag and old code

**Never:** Let flags live forever. Clean up after rollout complete.

## Blue-Green Deployment

Two identical environments: Blue (current), Green (new).

```
1. Deploy to Green (inactive)
2. Test Green thoroughly
3. Switch traffic: Blue → Green
4. Monitor Green
5. If issues: Switch back to Blue (instant)
6. If stable: Decommission Blue
```

**Pros:** Instant rollback
**Cons:** 2x infrastructure cost

## Canary Deployment

Route small percentage to new version.

```yaml
# Kubernetes example
apiVersion: v1
kind: Service
metadata:
  name: app
spec:
  selector:
    app: myapp
---
# Canary deployment (10% traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-canary
spec:
  replicas: 1  # 10% of total
  selector:
    matchLabels:
      app: myapp
      version: canary
---
# Stable deployment (90% traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-stable
spec:
  replicas: 9  # 90% of total
  selector:
    matchLabels:
      app: myapp
      version: stable
```

## Communication Plan

### Before Deployment
**Notify:**
- Engineering team
- Product team
- Customer support
- Key stakeholders

**Include:**
- What's deploying
- When (date/time)
- Expected duration
- Impact (if any)
- Rollback plan

### During Deployment
**Update:**
- Slack channel (#deployments)
- Status page (if customer-facing)

**Frequency:**
- At each stage transition
- If issues detected

### After Deployment
**Report:**
- Deployment complete
- Metrics summary
- Any issues encountered
- Next steps

## Deployment Runbook Template

```markdown
# Deployment: [Feature Name]

## Pre-Flight
- [ ] Tests passing
- [ ] Review approved
- [ ] Stakeholders notified

## Rollout Plan
### Stage 1: Infrastructure
Commands: [exact bash commands]
Validation: [how to verify]
Duration: [estimate]

[Repeat for each stage]

## Rollback Procedures
### Level 1: Feature Flag
Command: [exact command]
Expected time: < 1 min

### Level 2: Config
Command: [exact command]
Expected time: < 5 min

### Level 3: Code
Command: [exact command]
Expected time: < 15 min

## Monitoring
Dashboard: [URL]
Alerts: [channel]
On-call: [person]

## Rollback Triggers
- Error rate > 5%
- P99 > 5s
- [other criteria]
```

---

**Philosophy:** Deploy confidently with fast rollback procedures. Monitor actively, rollback quickly if needed.
