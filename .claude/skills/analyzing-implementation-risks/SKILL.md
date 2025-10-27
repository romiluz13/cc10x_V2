---
name: analyzing-implementation-risks
description: Prevents bugs before implementation by identifying logical flaws, edge cases, security vulnerabilities, and unintended consequences using 8-dimension critical analysis. Use when reviewing designs, validating fixes, auditing code changes, planning deployments, or evaluating any software change before implementation.
---

# What Could Go Wrong? - Risk Analysis Framework

## Purpose

This skill provides a systematic framework for pre-implementation risk analysis. Apply it to ANY code change, design, or feature to identify issues before they reach production.

**Core Philosophy:** "Every change is guilty until proven innocent"

## When to Use

Use this analysis for:
- Pre-deployment code reviews
- Architecture design reviews
- Bug fix validation
- Security audits
- API/integration planning
- Database migration planning
- Performance optimization planning

## Analysis Workflow

For any proposed change:

1. **Gather Context**
   - [ ] Identify change type (feature/fix/refactor/infrastructure)
   - [ ] Document tech stack and affected systems
   - [ ] Note urgency and risk tolerance
   - [ ] Read proposed code/design

2. **Apply 8-Dimension Analysis**
   - [ ] Dimension 1: Data flow & transformations
   - [ ] Dimension 2: Dependencies & integrations
   - [ ] Dimension 3: Timing, concurrency & state
   - [ ] Dimension 4: User experience & human factors
   - [ ] Dimension 5: Security & validation
   - [ ] Dimension 6: Performance & scalability
   - [ ] Dimension 7: Failure modes & recovery
   - [ ] Dimension 8: Observability & debuggability

3. **Generate Structured Report**
   - [ ] Document expected behavior
   - [ ] List critical risks (must fix)
   - [ ] List moderate risks (should address)
   - [ ] List minor issues (nice to fix)
   - [ ] Create verification checklist
   - [ ] Identify affected components

4. **Iterate Until Satisfied**
   - [ ] Developer addresses identified risks
   - [ ] Re-analyze with same framework
   - [ ] Continue until critical/moderate risks resolved

## The 8 Dimensions

Read dimension details progressively as needed:

### [Dimension 1: Data Flow & Transformations](dimensions/data-flow.md)

Critical questions for ANY data processing:
- Where does data originate? (user input, API, database, file, cache)
- How is it transformed? (parsing, validation, computation, formatting)
- Where does it go? (UI, database, API, log, message queue)
- What edge cases exist? (null, wrong type, extreme values, special characters)

**Quick checks:**
- Missing/null/undefined values
- Wrong data types
- Invalid formats
- Extreme values (0, negative, MAX_INT, huge strings)
- Malicious input (SQL injection chars, XSS, Unicode)

### [Dimension 2: Dependencies & Integrations](dimensions/dependencies.md)

Map all relationships:
- Direct dependencies (what this code calls)
- Reverse dependencies (what calls this code)
- Shared state (global vars, databases, caches, files)
- External integrations (APIs, services, third-party libraries)

**Quick checks:**
- Single source of truth or duplicated logic?
- Circular dependencies?
- Dependency unavailability handling?
- Version pinning vs auto-updates?

### [Dimension 3: Timing, Concurrency & State](dimensions/timing.md)

Temporal issues:
- Execution order (before init, after cleanup, during operation)
- Race conditions (concurrent modifications, out-of-order async)
- State management (initial state, invalid mid-operation states)
- Check-then-act patterns (TOCTOU bugs)

**Quick checks:**
- Double-click scenarios
- Concurrent access to shared data
- Async operations completing out of order
- State corruption mid-operation
- System clock changes (DST, timezone, NTP)

### [Dimension 4: User Experience & Human Factors](dimensions/ux.md)

Human-centered risks:
- User expectations (what they see, feedback, wait times)
- Accessibility (screen readers, keyboard nav, color-only indicators)
- Internationalization (languages, timezones, number formats, RTL)
- Device variations (mobile, tablet, desktop, browsers, connection speed)

**Quick checks:**
- Does user see clear feedback?
- Works with keyboard only?
- Handles navigation away mid-operation?
- Works on slow connections?

### [Dimension 5: Security & Validation](dimensions/security.md)

OWASP-style threats:
- Authentication & authorization (who can trigger this?)
- Input validation (client AND server, bypass prevention)
- Injection attacks (SQL, XSS, command, path traversal)
- Data exposure (logs, errors, URLs, cache, API responses)
- Common vulnerabilities (CSRF, broken access control, insecure references)

**Quick checks:**
- Input validated server-side?
- SQL/XSS injection possible?
- Sensitive data in logs/errors?
- Authorization bypasses?

### [Dimension 6: Performance & Scalability](dimensions/performance.md)

Resource and scale issues:
- Computational complexity (O(n²), nested loops, unbounded recursion)
- Data volume (works with 0 items? 1M items? huge items?)
- Resource usage (memory leaks, CPU blocking, network bandwidth, disk space)
- Optimization opportunities (caching, memoization, debouncing, lazy loading)

**Quick checks:**
- Algorithm complexity acceptable?
- Pagination for large datasets?
- Memory leak potential?
- Database connection pooling?

### [Dimension 7: Failure Modes & Recovery](dimensions/failure-modes.md)

What breaks and how to recover:
- Failure scenarios (network, database, file, API, service outages)
- Error handling (catching, logging, user-friendly messages, no info leaks)
- Graceful degradation (read-only mode, cached data, queued operations)
- Recovery mechanisms (rollback, retry, idempotency, backup/restore)

**Quick checks:**
- All errors caught and logged?
- User-friendly error messages?
- Partial failure rollback?
- Idempotent operations?

### [Dimension 8: Observability & Debuggability](dimensions/observability.md)

Detecting and diagnosing failures:
- Metrics & monitoring (what gets measured, alerting thresholds)
- Logging strategy (structured logs, correlation IDs, log levels)
- Tracing (request flows, performance bottlenecks)
- Alerting (actionable alerts, noise reduction, dead-man switches)

**Quick checks:**
- Can we tell WHY it failed, not just THAT it failed?
- Logs structured with correlation IDs?
- Sensitive data accidentally logged?
- Alerts actionable or noisy?
- Dead-man's switch if metrics stop?

## Output Format

Structure your risk analysis as:

### ✅ EXPECTED BEHAVIOR (Happy Path)
Brief summary of what SHOULD happen when everything works correctly, with all assumptions that must be true.

### 🚨 CRITICAL RISKS (Must Fix Before Deploy)
For each critical issue:
```
Issue: [Brief description]
Location: [File:line or component]
Trigger: [What action/input causes this]
Impact: [Data loss? Security hole? Crash?]
Probability: [High/Medium/Low]
Fix: [Specific recommendation]
```

### ⚠️ MODERATE RISKS (Should Address)
Same format, for edge cases and quality issues.

### 📉 MINOR ISSUES (Nice to Fix)
Same format, for performance, UX, or maintainability concerns.

### 🔍 VERIFICATION CHECKLIST
- [ ] Specific test case 1
- [ ] Specific test case 2
- [ ] Edge case 3
- [ ] Integration test 4

### 🎯 AFFECTED COMPONENTS
- Component/Module A (direct dependency)
- Component/Module B (uses similar pattern)
- External System C (API integration)

## Red Flags (Stop and Reassess)

If you encounter these statements, dig deeper:
- "This will never happen in practice"
- "Users would never do that"
- "We can fix it later if it's a problem"
- "It's just a quick fix, we don't need tests"
- "The old code did it this way"

These signal insufficient analysis.

## Meta-Questions

Before approving any change, force answers to:

1. **What's the simplest thing that could go wrong?**
   Often the most obvious bug is missed.

2. **What assumption am I making that might be false?**
   Every assumption is a potential bug.

3. **What would an attacker do to exploit this?**
   Think adversarially.

4. **What would a confused user try to do?**
   Think like someone who doesn't understand the system.

5. **What breaks if this runs at 3 AM on a Sunday?**
   Consider timing edge cases.

6. **What breaks if we 100x our user base tomorrow?**
   Consider scale.

7. **How would I debug this in production if it fails?**
   Consider observability.

## Testing Strategies

### Boundary Value Testing
Test at edges of valid ranges:
- Minimum (0, empty, null)
- Just below minimum (-1, negative)
- Typical middle value
- Just below maximum
- Maximum (MAX_INT, huge string)
- Just above maximum (overflow)

### State Transition Testing
Test all state changes:
- All valid transitions (A→B, B→C, C→A)
- Invalid transitions (should be rejected)
- Corrupt/unexpected states

### Negative Testing
Intentionally break it:
- Malformed data
- Wrong data types
- Wrong order
- Contradictory data
- Operations out of sequence

### Stress Testing
Test under extremes:
- Maximum concurrent users
- Minimum resources
- Slowest network
- Largest dataset
- Most complex input

## Domain-Specific Checklists

### Web/Mobile Apps
- [ ] Cross-browser compatible (Chrome, Firefox, Safari, Edge)?
- [ ] Works on iOS and Android?
- [ ] Handles browser back button correctly?
- [ ] Preserves state on page refresh?
- [ ] Works over slow 3G connection?

### APIs/Backends
- [ ] Rate limiting implemented?
- [ ] Request size limits enforced?
- [ ] Idempotent operations guaranteed?
- [ ] Backward compatibility maintained?
- [ ] Circuit breakers for external calls?
- [ ] Proper HTTP status codes?

### Data Pipelines
- [ ] Handles duplicate records?
- [ ] Handles out-of-order records?
- [ ] Schema evolution strategy?
- [ ] Data quality checks?
- [ ] Exactly-once or at-least-once semantics?
- [ ] Monitoring & alerting?

## Usage Examples

### Example 1: Quick Audit (2-3 min)

**Input:**
```
Quick "what could go wrong?" check:
[User adds password reset functionality]
Focus on: security, data flow
```

**Analysis:**
Focus on Dimensions 1, 5, and 8:
- Data flow: Email → token generation → storage → email delivery → validation
- Security: Token strength, expiration, single-use, timing attacks
- Observability: Failed reset attempts, expired tokens, suspicious patterns

**Output:**
Critical risks: Weak tokens, no rate limiting, tokens never expire
Verification: Test token entropy, rate limit bypass, expired token handling

### Example 2: Deep Audit (15-30 min)

**Input:**
```
Full audit for production deploy:
[Payment processing integration]
Risk tolerance: Zero-tolerance
```

**Analysis:**
Apply all 8 dimensions systematically:
- Full data flow mapping (Dimension 1)
- Third-party API integration risks (Dimension 2)
- Race conditions in payment confirmation (Dimension 3)
- User feedback during payment (Dimension 4)
- PCI compliance, sensitive data handling (Dimension 5)
- Under load behavior (Dimension 6)
- Payment failure and retry logic (Dimension 7)
- Transaction tracing and alerting (Dimension 8)

**Output:**
Comprehensive report with 20+ specific risks, prioritized by severity, with concrete fixes and extensive verification checklist.

### Example 3: Bug Fix Verification

**Input:**
```
Bug: Users can view other users' profiles
Fix: Added userId check in API endpoint

Verify:
1. Does this fix the ROOT CAUSE?
2. Does this introduce NEW bugs?
3. Are there SIMILAR bugs elsewhere?
```

**Analysis:**
- Root cause: Missing authorization check (Dimension 5)
- New bugs: Does check happen before or after data fetch? Timing issue? (Dimension 3)
- Similar patterns: Search codebase for other endpoints without userId checks (Dimension 2)

**Output:**
Verified fix addresses root cause. Identified 3 similar endpoints without checks. Added test cases for authorization bypass attempts.

## Integration with Development Workflow

**Before starting implementation:**
1. Read design/requirements
2. Run quick risk analysis (5 min)
3. Address critical risks in design phase

**During code review:**
1. Apply full 8-dimension analysis
2. Generate structured report
3. Iterate until risks resolved

**Before deployment:**
1. Final verification of critical dimensions (5, 7, 8)
2. Confirm monitoring/alerting in place
3. Validate rollback procedure

## Success Metrics

**You're using this correctly when:**
- Finding bugs during design/review, not production
- First deployments succeed without rollbacks
- Team proactively asks "did we check X?"
- Production incidents decrease over time
- Code reviews find issues upfront

**You're NOT using it correctly when:**
- Still discovering bugs in production
- Multiple rollbacks per deploy
- Frequently saying "we didn't think about that"
- Treating this as checkbox exercise
- Skipping dimensions arbitrarily

---

*This framework is project-agnostic and applies to any software change in any language or domain.*
