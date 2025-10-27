# CC10x Orchestrator

**10x Development Velocity with Systematic Quality Gates**

CC10x is a complete development lifecycle orchestrator that coordinates specialized agents and domain skills to deliver high-quality software systematically.

## What It Does

CC10x automatically routes tasks to appropriate workflows based on user intent:

- **PLANNING:** Feature design with 8-dimension risk analysis
- **BUILDING:** TDD-enforced implementation with phase checkpoints
- **REVIEWING:** Multi-dimensional code analysis (security, performance, quality, UX)
- **DEPLOYING:** Staged rollouts with rollback procedures

## Architecture

```
┌─────────────────────────────────────┐
│      CC10X ORCHESTRATOR             │
│  (Intent detection & coordination)  │
└──────────┬──────────────────────────┘
           │
    ┌──────┼──────┬──────┬──────┐
    ▼      ▼      ▼      ▼      ▼
 ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
 │PLAN│ │BUILD│ │REVIEW│ │DEPLOY│ │SKILLS│
 └────┘ └────┘ └────┘ └────┘ └────┘
```

## Workflows

### Planning Workflow
```
User intent: "plan authentication feature"
    ↓
Spawn agents (parallel):
  - context-gatherer: Read tickets/requirements
  - codebase-locator: Find related files
  - codebase-analyzer: Understand implementation
  - pattern-finder: Find similar features
    ↓
Load skills:
  - analyzing-implementation-risks (8 dimensions)
  - architecture-patterns
    ↓
Output: Implementation plan with:
  - Phases (each < 200 lines)
  - Success criteria (automated + manual)
  - Risk mitigations
  - File manifest
    ↓
🛑 CHECKPOINT: Human approves plan
```

### Building Workflow
```
User intent: "implement with TDD"
    ↓
For each phase:
  1. RED: test-writer creates failing test
  2. GREEN: code-implementer makes it pass
  3. REFACTOR: refactorer improves structure
  4. Automated verification (tests, linting, build)
  5. 🛑 CHECKPOINT: Manual testing
    ↓
Load skills:
  - tdd-patterns (RED-GREEN-REFACTOR)
  - analyzing-implementation-risks (pre-phase check)
    ↓
Output: Feature with tests, ready for review
```

### Review Workflow
```
User intent: "comprehensive code review"
    ↓
Spawn reviewers (parallel):
  - security-reviewer: OWASP Top 10
  - performance-reviewer: Complexity, N+1, scalability
  - quality-reviewer: SOLID, code smells, DRY
  - ux-reviewer: WCAG 2.1 AA, keyboard nav
    ↓
Load skills:
  - code-review-patterns (checklists)
  - analyzing-implementation-risks (compare to plan)
    ↓
Output: Consolidated findings:
  🚨 CRITICAL (must fix)
  ⚠️ MODERATE (should fix)
  📉 MINOR (nice to fix)
    ↓
🛑 CHECKPOINT: Human decides what to fix
```

### Deployment Workflow
```
User intent: "prepare deployment"
    ↓
Spawn agents (parallel):
  - deployment-planner: 5-stage rollout
  - rollback-planner: 3-level recovery
    ↓
Load skills:
  - deployment-patterns (staged rollouts)
  - analyzing-implementation-risks (deployment risks)
    ↓
Output: Deployment runbook with:
  - Staged rollout (0% → 1% → 10% → 50% → 100%)
  - Rollback procedures (1min, 5min, 15min)
  - Monitoring setup
  - Alert thresholds
    ↓
🛑 CHECKPOINT: Human approves deployment
```

## Skills Included

### 1. cc10x-orchestrator (This Skill)
Master coordinator that detects intent and routes to workflows.

**Location:** `.claude/skills/cc10x-orchestrator/`

**Files:**
- `SKILL.md` - Main skill (296 lines, validated ✓)
- `workflows/planning.md` - Planning process
- `workflows/building.md` - TDD implementation
- `workflows/reviewing.md` - Multi-dimensional review
- `workflows/deploying.md` - Deployment strategy

### 2. analyzing-implementation-risks
8-dimension "What Could Go Wrong?" analysis.

**Location:** `.claude/skills/analyzing-implementation-risks/`

**Dimensions:**
1. Data flow & transformations
2. Dependencies & integrations
3. Timing, concurrency & state
4. User experience & human factors
5. Security & validation
6. Performance & scalability
7. Failure modes & recovery
8. Observability & debuggability

**Files:**
- `SKILL.md` - Main skill (407 lines, validated ✓)
- `dimensions/*.md` - 8 detailed dimension files

### 3. tdd-patterns
Test-Driven Development methodology.

**Location:** `.claude/skills/tdd-patterns/`

**Covers:**
- RED-GREEN-REFACTOR cycle
- Test types (unit, integration, E2E)
- Test strategies (boundary, error cases, edge cases)
- Mocking patterns
- Common anti-patterns

**Files:**
- `SKILL.md` - Main skill (353 lines, validated ✓)

### 4. code-review-patterns
Comprehensive code review checklists.

**Location:** `.claude/skills/code-review-patterns/`

**Dimensions:**
- Security: OWASP Top 10, injection, auth
- Performance: Complexity, N+1, memory leaks
- Quality: SOLID, code smells, DRY
- UX: WCAG 2.1 AA, keyboard nav, error messages

**Files:**
- `SKILL.md` - Main skill (240 lines, validated ✓)

### 5. deployment-patterns
Safe deployment strategies.

**Location:** `.claude/skills/deployment-patterns/`

**Covers:**
- Staged rollout (5 stages)
- Rollback procedures (3 levels)
- Monitoring & alerting
- Database migrations
- Feature flags
- Blue-green deployments

**Files:**
- `SKILL.md` - Main skill (451 lines, validated ✓)

## Agent Definitions (Planned)

These agents will be created as separate files to be spawned by workflows:

### Context Analysis Agents
- **context-gatherer:** Reads tickets, requirements, research docs
- **codebase-locator:** Finds relevant files (Grep/Glob specialist)
- **codebase-analyzer:** Understands implementation details
- **pattern-finder:** Finds similar features to model after

### Review Specialist Agents
- **security-reviewer:** OWASP Top 10, vulnerability detection
- **performance-reviewer:** Complexity, scalability analysis
- **quality-reviewer:** Clean code, maintainability assessment
- **ux-reviewer:** Accessibility, usability evaluation

### Implementation Agents
- **test-writer:** Writes failing tests (RED)
- **code-implementer:** Minimal implementation (GREEN)
- **refactorer:** Improves structure (REFACTOR)

### Deployment Agents
- **deployment-planner:** Creates staged rollout strategy
- **rollback-planner:** Defines recovery procedures

## How to Use

### Automatic Activation

CC10x automatically activates when you use trigger phrases:

```
"plan user authentication"           → PLANNING workflow
"build payment processing with TDD"  → BUILDING workflow
"review this PR comprehensively"     → REVIEW workflow
"prepare deployment for feature X"   → DEPLOYING workflow
```

### Explicit Invocation

Use "cc10x" prefix for explicit control:

```
cc10x plan feature X
cc10x build with tests
cc10x review security
cc10x deploy
```

### Full Lifecycle Example

```
User: Build user authentication with CC10x

CC10x: Starting PLANNING workflow...

[4 agents research in parallel]
[8-dimension risk analysis]

Plan created with 5 phases
Critical risks: password storage, rate limiting, CSRF

🛑 CHECKPOINT: Approve plan? → User: yes

CC10x: Starting BUILDING workflow (Phase 1/5)...

[test-writer: failing test]
RED ✓
[code-implementer: make it pass]
GREEN ✓
[refactorer: improve structure]
REFACTOR ✓

Automated checks PASSED ✓
🛑 CHECKPOINT: Manual testing? → User: done

[... continues through all phases ...]

CC10x: Starting REVIEW workflow...

[4 reviewers analyze in parallel]

CRITICAL (1): SQL injection
MODERATE (3): N+1 query, keyboard nav, validation

🛑 CHECKPOINT: Fix critical? → User: yes

[Fixes SQL injection]
Re-running security review... PASSED ✓

CC10x: Starting DEPLOYMENT workflow...

5-stage rollout plan created
3-level rollback procedures ready
Monitoring configured

🛑 CHECKPOINT: Approve deployment? → User: yes

Runbook ready. Follow stages sequentially. 🚀
```

## Design Philosophy

### Systematic Quality Gates

Every workflow includes systematic checks:
- **Planning:** Risk analysis identifies issues before coding
- **Building:** TDD catches bugs during development
- **Review:** Multi-dimensional analysis finds remaining issues
- **Deploy:** Staged rollout with fast rollback minimizes risk

### Human in the Loop

Checkpoints at phase boundaries ensure human judgment:
- After planning: Approve approach
- After each build phase: Verify manually
- After review: Decide what to fix
- Before deployment: Approve strategy

### Parallel Execution

Agents run in parallel when possible:
- Planning: 4 context agents simultaneously
- Review: 4 specialized reviewers simultaneously
- Reduces wall-clock time significantly

### Progressive Disclosure

Skills load details on-demand:
- Main SKILL.md provides overview
- Workflow files have detailed procedures
- Dimension files have deep analysis
- Minimizes token usage

## Success Metrics

CC10x achieves 10x productivity when:
- ✓ Plans identify risks before implementation
- ✓ TDD catches bugs during development (not in production)
- ✓ Reviews find issues before merge
- ✓ Deployments have rollback procedures ready
- ✓ Production incidents decrease over time

## Validation Status

All skills validated with `npm run validate`:

```
✓ cc10x-orchestrator        (296 lines)
✓ analyzing-implementation-risks (407 lines + 8 dimension files)
✓ tdd-patterns              (353 lines)
✓ code-review-patterns      (240 lines)
✓ deployment-patterns       (451 lines)
```

## Directory Structure

```
.claude/skills/
├── cc10x-orchestrator/
│   ├── SKILL.md                   ✓ validated
│   ├── README.md                  (this file)
│   └── workflows/
│       ├── planning.md
│       ├── building.md
│       ├── reviewing.md
│       └── deploying.md
├── analyzing-implementation-risks/
│   ├── SKILL.md                   ✓ validated
│   └── dimensions/
│       ├── data-flow.md
│       ├── dependencies.md
│       ├── timing.md
│       ├── ux.md
│       ├── security.md
│       ├── performance.md
│       ├── failure-modes.md
│       └── observability.md
├── tdd-patterns/
│   └── SKILL.md                   ✓ validated
├── code-review-patterns/
│   └── SKILL.md                   ✓ validated
└── deployment-patterns/
    └── SKILL.md                   ✓ validated
```

## Next Steps

1. **Test the orchestrator:** Try "cc10x plan simple feature"
2. **Create agents:** Define agent prompt files for spawning
3. **Iterate:** Refine based on usage
4. **Document learnings:** Update workflows based on experience

## Contributing

To extend CC10x:

1. **Add skills:** Create new domain skills following Skilz methodology
2. **Add agents:** Define new specialized agents for workflows
3. **Improve workflows:** Edit workflow files to refine processes
4. **Add patterns:** Enhance pattern skills with new best practices

## License

Part of the Skilz skill-builder project (MIT License)

---

**CC10x: Complete development lifecycle with systematic quality gates** 🚀
