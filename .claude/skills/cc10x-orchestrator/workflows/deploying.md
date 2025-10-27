# Deployment Workflow

Deployment planning with staged rollouts, rollback procedures, and monitoring.

## When to Use

- Preparing production deployment
- Planning feature rollout
- Creating rollback procedures
- Setting up deployment monitoring

## Process

### 1. Pre-Deployment Checks

Verify readiness:
```
✓ All tests passing?
✓ Code review complete?
✓ Critical findings resolved?
✓ Manual testing complete?
✓ Documentation updated?
```

If any fail, stop and address before proceeding.

### 2. Deployment Risk Analysis

Load `analyzing-implementation-risks` skill.

Focus on Dimension 7 (Failure Modes) and Dimension 8 (Observability):
- What can fail during deployment?
- How will we detect failures?
- How will we recover?
- What monitoring is needed?

### 3. Create Staged Rollout Plan

Spawn `deployment-planner` agent:
```
Task: deployment-planner
Prompt: "Create staged rollout plan for [feature].
Use deployment-patterns skill.
5 stages with increasing traffic percentages.
Include: validation at each stage, rollback triggers."
```

Standard stages:
```
Stage 1: Infrastructure (0% traffic)
- Database migrations
- Config changes
- Feature flags setup
Validation: Schema changes successful, no errors
Rollback trigger: Migration failures

Stage 2: Canary (1-5% traffic)
- Deploy to small user segment
Validation: Error rate < baseline, latency acceptable
Rollback trigger: Error rate > 2x baseline

Stage 3: Partial (10-25% traffic)
- Expand to larger segment
Validation: Metrics stable, no user complaints
Rollback trigger: Error spike or performance degradation

Stage 4: Majority (50-75% traffic)
- Most users on new version
Validation: System stable, resource usage acceptable
Rollback trigger: Sustained issues

Stage 5: Full (100% traffic)
- All users on new version
Validation: System healthy for 24h
Rollback trigger: Critical issues discovered
```

### 4. Create Rollback Procedures

Spawn `rollback-planner` agent:
```
Task: rollback-planner
Prompt: "Create 3-level rollback procedures for [feature].
Each level faster than previous.
Include: exact commands, validation steps, escalation criteria."
```

Rollback levels:
```
Level 1: Feature Flag (< 1 minute)
Command: Set FEATURE_NAME=false in config
Validation: Feature disappears from UI
When: Immediate issues detected

Level 2: Configuration (< 5 minutes)
Command: Deploy previous config version
Validation: System reverts to old behavior
When: Feature flag insufficient

Level 3: Code Rollback (< 15 minutes)
Command: git revert [commit] && deploy
Validation: Previous version deployed
When: Config rollback insufficient
```

### 5. Setup Monitoring & Alerts

Define what to monitor:

**Business Metrics:**
- Feature usage count
- Conversion rates
- User actions per session

**Technical Metrics:**
- Error rate (4xx, 5xx)
- Response time (p50, p95, p99)
- Resource usage (CPU, memory)
- Database query time

**Alerting Thresholds:**
```
Critical (page on-call):
- Error rate > 5%
- Response time p99 > 5s
- Any 500 errors

Warning (notify channel):
- Error rate > 2%
- Response time p95 > 2s
- Resource usage > 80%
```

**Dead-man's switch:**
- Alert if no metrics received for 5 minutes

### 6. Create Deployment Runbook

Write to: `thoughts/shared/deployment-runbooks/YYYY-MM-DD-feature.md`

Template:
```markdown
# Deployment: [Feature Name]

Date: [YYYY-MM-DD]
Owner: [Name]
Ticket: [Reference]

## Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Manual testing complete
- [ ] Documentation updated

## Staged Rollout

### Stage 1: Infrastructure (0%)
**Deploy:**
\`\`\`bash
[exact commands]
\`\`\`

**Validate:**
- [ ] [validation step]

**Rollback if:** [trigger]

### [Repeat for all stages]

## Rollback Procedures

### Level 1: Feature Flag (< 1 min)
\`\`\`bash
[exact command]
\`\`\`

### Level 2: Config (< 5 min)
\`\`\`bash
[exact commands]
\`\`\`

### Level 3: Code (< 15 min)
\`\`\`bash
[exact commands]
\`\`\`

## Monitoring

**Dashboard:** [URL]

**Metrics to watch:**
- [metric 1]
- [metric 2]

**Alert channels:**
- Critical: #pagerduty
- Warning: #alerts

**Queries:**
\`\`\`
[monitoring queries]
\`\`\`

## Communication Plan

**Before deployment:**
- Notify: [stakeholders]
- Channels: [where to announce]

**During deployment:**
- Update: [where to post status]
- Frequency: [how often]

**If issues:**
- Escalate to: [on-call person]
- Document: [incident channel]
```

### 7. Human Checkpoint

Present deployment plan:
```
🚀 Deployment Plan Ready

Feature: [name]
Stages: [X]
Estimated duration: [time]

Rollback options:
- Level 1: Feature flag (< 1 min)
- Level 2: Configuration (< 5 min)
- Level 3: Code rollback (< 15 min)

Monitoring:
- Dashboard: [URL]
- Alerts configured: [X]
- On-call: [person]

Runbook: [path]

🛑 CHECKPOINT: Approve deployment plan?

Options:
- yes: Plan approved, ready to deploy
- adjust: Make changes (specify)
- no: Cancel deployment
```

## Deployment Execution (Guidance)

CC10x provides the plan, **human executes**:

1. Review runbook completely
2. Execute stage 1, validate
3. If validation passes, continue to stage 2
4. Monitor metrics continuously
5. If issues detected, execute appropriate rollback level
6. Document any incidents or deviations
7. Post-deployment: monitor for 24-48h

## Load Skills

**deployment-patterns:** Staged rollouts, rollback strategies
**analyzing-implementation-risks:** Deployment failure analysis

## Agents Used

**deployment-planner:** Creates staged rollout strategy
**rollback-planner:** Defines recovery procedures

## Example Deployment

```
User: Prepare deployment for user authentication

CC10x: Starting DEPLOYMENT workflow...

Pre-checks:
✓ Tests passing
✓ Review complete
✓ Critical issues resolved
⚠️ Manual testing pending

Complete manual testing before deploying.

User: done

[Analyzes deployment risks]
[Creates 5-stage rollout]
[Defines 3-level rollback]
[Sets up monitoring]

Deployment plan:
- 5 stages (0% → 1% → 10% → 50% → 100%)
- 3 rollback levels (1min, 5min, 15min)
- Monitoring: 8 metrics, 4 alerts

Runbook created: thoughts/shared/deployment-runbooks/2025-10-27-user-auth.md

🛑 CHECKPOINT: Approve?

User: yes

✅ Deployment plan approved

To deploy:
1. Open runbook: [path]
2. Follow stages sequentially
3. Validate at each stage
4. Monitor dashboard: [URL]
5. Rollback if needed: [commands in runbook]

On-call: [name]
Emergency contact: [info]

Good luck! 🚀
```

## Tips

**Start small:** 1-5% canary catches most issues
**Validate thoroughly:** Don't rush through stages
**Monitor actively:** Watch dashboards during rollout
**Communicate clearly:** Keep stakeholders informed
**Document everything:** Record issues and decisions
**Practice rollbacks:** Test procedures before needing them
