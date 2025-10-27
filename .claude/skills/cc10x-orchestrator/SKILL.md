---
name: cc10x-orchestrator
description: Complete development lifecycle orchestrator coordinating specialized agents and domain skills. Use when planning features, building with TDD, conducting comprehensive reviews, or preparing deployments. Automatically routes to appropriate workflow based on user intent.
---

# CC10x Orchestrator

Systematic development orchestrator for 10x productivity with quality gates.

## When to Use

This skill activates automatically when you:
- Plan features ("plan user authentication", "design API")
- Build features ("implement with TDD", "build payment flow")
- Review code ("comprehensive review", "audit security")
- Prepare deployments ("deployment plan", "rollback strategy")

Or explicitly: "cc10x [task]"

## How It Works

CC10x detects intent and routes to appropriate workflow:

**PLANNING** → Context analysis → Risk analysis → Implementation plan
**BUILDING** → TDD cycles → Phase-by-phase → Manual checkpoints
**REVIEWING** → Multi-dimensional analysis → Prioritized findings
**DEPLOYING** → Staged rollout → Rollback procedures → Monitoring setup

Each workflow:
- Spawns specialized agents in parallel
- Loads relevant domain skills
- Requests human approval at phase boundaries
- Tracks progress with todos

## Workflows

### [Planning Workflow](workflows/planning.md)
Complete feature planning with risk analysis.

**Spawns:**
- context-gatherer (reads tickets, requirements)
- codebase-locator (finds relevant files)
- codebase-analyzer (understands implementation)
- pattern-finder (finds similar features)

**Loads:**
- analyzing-implementation-risks
- architecture-patterns

**Output:** Implementation plan with phases, success criteria, risk mitigations

**Checkpoint:** Human approves plan before building

---

### [Building Workflow](workflows/building.md)
TDD-enforced implementation with incremental verification.

**Spawns:**
- test-writer (RED: failing tests)
- code-implementer (GREEN: passing tests)
- refactorer (REFACTOR: improve structure)

**Loads:**
- tdd-patterns
- analyzing-implementation-risks (pre-implementation check)

**Output:** Feature with tests, ready for review

**Checkpoints:** After each phase for manual testing

---

### [Review Workflow](workflows/reviewing.md)
Multi-dimensional code analysis.

**Spawns (parallel):**
- security-reviewer (OWASP, injection, auth)
- performance-reviewer (complexity, N+1, scalability)
- quality-reviewer (SOLID, code smells, DRY)
- ux-reviewer (accessibility, error messages, UX)

**Loads:**
- code-review-patterns
- analyzing-implementation-risks (compare to plan)

**Output:** Consolidated findings (CRITICAL → MODERATE → MINOR)

**Checkpoint:** Human decides: fix all / fix critical / proceed

---

### [Deployment Workflow](workflows/deploying.md)
Deployment planning with rollback procedures.

**Spawns:**
- deployment-planner (staged rollout strategy)
- rollback-planner (fast recovery procedures)

**Loads:**
- deployment-patterns
- analyzing-implementation-risks (deployment risks)

**Output:** Deployment runbook with monitoring, alerts, rollback commands

**Checkpoint:** Human approves before deployment

## Intent Detection

```
User says: "plan authentication feature"
→ PLANNING workflow

User says: "build user registration with tests"
→ BUILDING workflow

User says: "review this PR comprehensively"
→ REVIEW workflow

User says: "prepare deployment for feature X"
→ DEPLOYING workflow
```

If ambiguous, CC10x presents menu: [Plan | Build | Review | Deploy]

## Agent Coordination

Agents run in parallel when possible:

```
PLANNING phase:
├─ context-gatherer ─┐
├─ codebase-locator ─┤
├─ codebase-analyzer ─┼─→ Synthesize → Risk analysis → Plan
└─ pattern-finder ────┘

REVIEW phase:
├─ security-reviewer ──┐
├─ performance-reviewer ┤
├─ quality-reviewer ────┼─→ Consolidate → Prioritize → Report
└─ ux-reviewer ─────────┘
```

## Progress Tracking

CC10x uses TodoWrite to track:
- Workflow phases
- Agent tasks
- Verification steps
- Human checkpoints

Example:
```
[ ] Phase 1: Context gathering (in_progress)
[ ] Phase 2: Risk analysis (pending)
[ ] Phase 3: Plan creation (pending)
[ ] Phase 4: Human checkpoint (pending)
```

## Domain Skills Integration

CC10x automatically loads relevant skills:

**All workflows:**
- analyzing-implementation-risks (8-dimension analysis)

**Planning:**
- architecture-patterns (SOLID, design patterns)

**Building:**
- tdd-patterns (RED-GREEN-REFACTOR)

**Review:**
- code-review-patterns (security, performance, quality, UX checklists)

**Deploy:**
- deployment-patterns (staged rollouts, rollback strategies)

Skills loaded progressively as needed.

## Human Checkpoints

CC10x pauses for approval at:

1. **After planning:** Review plan, risks, approach
2. **After each build phase:** Manual testing verification
3. **After review:** Decide which findings to address
4. **Before deployment:** Approve deployment strategy

Format:
```
🛑 CHECKPOINT: [Phase Name]

[Summary of work completed]
[Key findings or outputs]

Continue? [yes/no/adjust]
```

## Example: Full Lifecycle

```
User: Build user authentication with CC10x

CC10x: Starting PLANNING workflow...

[Spawns 4 agents in parallel]
[Loads analyzing-implementation-risks skill]
[Analyzes 8 dimensions]

Plan created: thoughts/shared/plans/2025-10-27-user-auth.md

Critical risks identified:
- Password storage without bcrypt
- Missing rate limiting
- CSRF token validation

🛑 CHECKPOINT: Review plan?

User: yes

CC10x: Starting BUILDING workflow (Phase 1/5)...

[test-writer: Creates failing test]
RED: test fails ✓

[code-implementer: Implements minimal code]
GREEN: test passes ✓

[refactorer: Improves structure]
REFACTOR: tests still pass ✓

Automated checks PASSED ✓
🛑 CHECKPOINT: Manual testing complete?

[... continues through phases ...]

User: review it

CC10x: Starting REVIEW workflow...

[Spawns 4 reviewers in parallel]

Findings:
CRITICAL (1): SQL injection in login
MODERATE (3): N+1 query, missing keyboard nav, password validation
MINOR (2): Variable naming, comment clarity

🛑 CHECKPOINT: Fix critical before deploy?

User: yes, fix critical

[Fixes SQL injection]
Re-running security review... PASSED ✓

User: deploy

CC10x: Starting DEPLOYMENT workflow...

Deployment plan:
1. Database migration (1% traffic)
2. Backend API (10%)
3. Frontend (50%)
4. Full rollout (100%)

Rollback: Feature flag toggle (< 1 min)

🛑 CHECKPOINT: Approve deployment?

User: yes

Runbook ready: thoughts/shared/deployment-runbooks/2025-10-27-user-auth.md
```

## Customization

Adjust workflows by editing files in `workflows/`:
- `planning.md` - Planning process steps
- `building.md` - TDD implementation phases
- `reviewing.md` - Review dimensions and criteria
- `deploying.md` - Deployment strategies

Adjust agents by creating/editing agent definitions.

## Success Metrics

CC10x achieves 10x productivity when:
- Plans identify risks before implementation
- TDD catches bugs during development
- Reviews find issues before production
- Deployments have rollback procedures ready
- Production incidents decrease over time

---

**Philosophy:** Systematic quality gates at every phase, with human judgment at decision points.
