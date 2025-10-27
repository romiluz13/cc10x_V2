# Planning Workflow

Systematic feature planning with risk analysis and human approval.

## Process

### 1. Context Gathering (Parallel)

Spawn these agents concurrently:

```
Task: context-gatherer
Prompt: "Read all mentioned files: [ticket paths, requirements, research docs]
Read FULLY without limit/offset parameters."

Task: codebase-locator
Prompt: "Find all files related to [feature name].
Focus on: [specific directories if known]"

Task: codebase-analyzer
Prompt: "Analyze how [related feature] currently works.
Trace data flow, identify patterns, note file:line references."

Task: pattern-finder
Prompt: "Find similar features to [feature name].
Look for: similar implementations we can model after."
```

**Wait for all to complete** before proceeding.

### 2. Synthesize Findings

Read all files identified by agents.

Create understanding:
- Current state (what exists)
- Desired state (what we're building)
- Patterns to follow
- Integration points
- Technical constraints

### 3. Risk Analysis

Load `analyzing-implementation-risks` skill.

Analyze using 8 dimensions:
1. Data flow & transformations
2. Dependencies & integrations
3. Timing, concurrency & state
4. User experience & human factors
5. Security & validation
6. Performance & scalability
7. Failure modes & recovery
8. Observability & debuggability

Output format:
```
🚨 CRITICAL RISKS (must fix):
- [Issue]: [Description]
  Location: [File/component]
  Fix: [Specific recommendation]

⚠️ MODERATE RISKS (should address):
- [Issue]: [Description]

📉 MINOR ISSUES (nice to fix):
- [Issue]: [Description]
```

### 4. Architecture Design

Load `architecture-patterns` skill (if exists).

Define:
- Component structure
- Data model changes
- API contracts
- Integration approach

### 5. Create Implementation Plan

Write to: `thoughts/shared/plans/YYYY-MM-DD-TICKET-XXX-description.md`

Template:
```markdown
# [Feature] Implementation Plan

## Overview
[1-2 sentences]

## Current State
[What exists, what's missing]

## What We're NOT Doing
[Explicit scope boundaries]

## Risks & Mitigations
[Critical risks from analysis + how we'll address]

## Phase 1: [Name]
**Changes:**
- File: `path/to/file`
- Changes: [description]

**Success Criteria:**

Automated:
- [ ] Tests pass
- [ ] Linting passes
- [ ] Build succeeds

Manual:
- [ ] Feature works as expected
- [ ] No regressions

**🛑 Pause for manual testing after this phase**

## Phase 2: [Name]
[... similar structure ...]

## Testing Strategy
Unit tests: [key scenarios]
Integration tests: [end-to-end flows]
Manual testing: [specific steps]

## References
- Ticket: [path]
- Research: [paths]
```

### 6. Human Checkpoint

Present:
```
📋 Plan created: [path]

Summary:
- [X] phases identified
- [Y] critical risks found
- [Z] files to modify

Critical risks:
1. [Risk + mitigation]
2. [Risk + mitigation]

🛑 CHECKPOINT: Review plan

Options:
- yes: Proceed to building
- adjust: Make changes (specify what)
- no: Stop here
```

## Todo Tracking

Use TodoWrite:
```
[ ] Context gathering (4 agents)
[ ] Synthesize findings
[ ] Risk analysis (8 dimensions)
[ ] Architecture design
[ ] Plan creation
[ ] Human checkpoint
```

## Tips

**Be skeptical:** Question vague requirements, verify with code.

**Be specific:** Include file:line references, concrete examples.

**Be complete:** No open questions in final plan. Resolve before proceeding.

**Phasing:** Each phase < 200 lines code, testable independently.
