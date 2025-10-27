# Review Workflow

Multi-dimensional code analysis with parallel specialized reviewers.

## When to Use

- Pre-merge code review
- PR analysis
- Security audit
- Performance check
- Accessibility compliance

## Process

### 1. Identify Scope

Determine what to review:
- Branch/PR diff
- Specific files/directories
- Feature area
- Full codebase section

### 2. Spawn Parallel Reviewers

Launch all 4 reviewers concurrently:

```
Task: security-reviewer
Prompt: "Security review of [scope].
Check: OWASP Top 10, injection, auth, data exposure.
Use code-review-patterns skill.
Return: file:line for each issue, severity, fix."

Task: performance-reviewer
Prompt: "Performance review of [scope].
Check: Big O complexity, N+1 queries, memory leaks.
Use code-review-patterns skill.
Return: file:line, performance impact, optimization."

Task: quality-reviewer
Prompt: "Code quality review of [scope].
Check: SOLID, code smells, DRY, maintainability.
Use code-review-patterns skill.
Return: file:line, smell type, refactoring suggestion."

Task: ux-reviewer
Prompt: "UX and accessibility review of [scope].
Check: WCAG 2.1 AA, keyboard nav, error messages, UX.
Use code-review-patterns skill.
Return: file:line, a11y violation, fix."
```

**Wait for all reviewers to complete.**

### 3. Risk Re-Analysis

Load `analyzing-implementation-risks` skill.

Compare actual implementation vs plan:
- New risks introduced?
- Planned mitigations implemented?
- Edge cases handled?

### 4. Consolidate Findings

Merge all reviewer reports:

```
🚨 CRITICAL (Must Fix Before Merge):
[Issue count]
1. [Category: Security] SQL injection in login
   File: src/auth/login.js:45
   Risk: Attacker can access all users
   Fix: Use parameterized queries

⚠️ MODERATE (Should Address):
[Issue count]
3. [Category: Performance] N+1 query in user.sessions
   File: src/models/user.js:89
   Impact: Slow with many sessions
   Fix: Add eager loading

📉 MINOR (Nice to Fix):
[Issue count]
2. [Category: Quality] Duplicate validation logic
   File: src/validators/user.js:23, src/api/users.js:67
   Impact: Maintainability
   Fix: Extract to shared function
```

**Prioritize:** CRITICAL → MODERATE → MINOR

**Deduplicate:** Remove redundant findings from multiple reviewers

### 5. Generate Report

Create consolidated report:

```markdown
# Code Review: [Feature/PR Name]

Date: [YYYY-MM-DD]
Scope: [files/directories reviewed]
Reviewers: Security, Performance, Quality, UX

## Summary
- Total findings: [X]
- Critical: [Y]
- Moderate: [Z]
- Minor: [W]

## Critical Issues (Must Fix)
[Details with file:line, description, fix]

## Moderate Issues (Should Fix)
[Details with file:line, description, fix]

## Minor Issues (Nice to Fix)
[Details with file:line, description, fix]

## Risk Analysis
[Comparison to plan, new risks, missing mitigations]

## Recommendations
[Prioritized action items]
```

### 6. Human Checkpoint

Present findings:
```
🔍 Review Complete

Findings:
- 🚨 CRITICAL: [X]
- ⚠️ MODERATE: [Y]
- 📉 MINOR: [Z]

Top critical issue:
[Issue description]
File: [path:line]
Fix: [recommendation]

🛑 CHECKPOINT: How to proceed?

Options:
- fix-all: Address all findings
- fix-critical: Only critical issues
- proceed: Accept risks, merge anyway
- abort: Don't merge
```

## Review Dimensions

### Security (security-reviewer)
- SQL injection
- XSS (cross-site scripting)
- CSRF tokens
- Authentication/authorization
- Data exposure
- Input validation
- Secrets in code

### Performance (performance-reviewer)
- Algorithm complexity (Big O)
- N+1 query problems
- Memory leaks
- Resource usage
- Caching opportunities
- Database indexes
- Pagination needs

### Quality (quality-reviewer)
- SOLID principles
- Code smells (Martin Fowler)
- DRY violations
- Function length
- Cyclomatic complexity
- Naming clarity
- Test coverage

### UX/Accessibility (ux-reviewer)
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast
- Error messages
- Loading states
- Offline behavior

## Load Skills

**code-review-patterns:** Checklists for all review dimensions
**analyzing-implementation-risks:** Compare actual vs planned risks

## Agents Used

**security-reviewer:** OWASP Top 10 specialist
**performance-reviewer:** Scalability specialist
**quality-reviewer:** Clean code specialist
**ux-reviewer:** Accessibility specialist

## Example Review

```
User: Review PR #123 comprehensively

CC10x: Starting REVIEW workflow...

[Spawns 4 reviewers in parallel]
[Loads code-review-patterns]
[Analyzes actual vs planned risks]

Findings:
🚨 CRITICAL (2):
1. [Security] Hardcoded API key
   src/config.js:12
   Fix: Use environment variable

2. [Security] Missing auth check
   src/api/admin.js:34
   Fix: Add isAdmin middleware

⚠️ MODERATE (5):
1. [Performance] Loading all users into memory
   src/services/user.js:23
   Fix: Add pagination

[... more findings ...]

🛑 CHECKPOINT: Fix critical before merge?

User: yes

[Fixes applied]
Re-running security review... PASSED ✓

Moderate issues remain. Proceed?

User: create issues for moderate, merge

Creating issues:
- Issue #456: Add pagination to user service
- Issue #457: Optimize dashboard query
[... etc ...]

✅ Ready to merge
```

## Tips

**Run early:** Review during development, not just at PR time
**Fix incrementally:** Address critical first, then moderate
**Create issues:** Track non-blocking findings as technical debt
**Learn patterns:** Repeated issues suggest need for linting rules
**Automate:** Some checks can be automated in CI/CD
