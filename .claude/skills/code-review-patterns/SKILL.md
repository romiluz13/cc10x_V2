---
name: code-review-patterns
description: Code review standards covering security (OWASP), performance (complexity, scalability), quality (SOLID, clean code), and UX (accessibility, usability). Use when conducting code reviews, auditing code quality, or analyzing pull requests.
---

# Code Review Patterns

Comprehensive review checklists for security, performance, quality, and UX.

## Review Dimensions

**Security:** OWASP Top 10, injection attacks, authentication, data exposure
**Performance:** Algorithmic complexity, N+1 queries, memory leaks, scalability
**Quality:** SOLID principles, code smells, DRY, maintainability
**UX:** WCAG 2.1 AA compliance, keyboard navigation, error messages

## Quick Reference

### Security: Critical Checks

**Input Validation:**
- [ ] Server-side validation (not just client)
- [ ] Whitelist allowed values
- [ ] Type and range checking
- [ ] SQL parameterized queries (no string concat)
- [ ] HTML output escaped (prevent XSS)

**Authentication:**
- [ ] Strong password requirements
- [ ] Bcrypt/Argon2 for hashing (not MD5)
- [ ] Rate limiting on login
- [ ] Session timeout configured
- [ ] CSRF token validation

**Data Exposure:**
- [ ] No sensitive data in logs
- [ ] No secrets in code
- [ ] No sensitive data in URLs
- [ ] API responses not over-sharing

### Performance: Critical Checks

**Complexity:**
- [ ] No O(n²) loops over large datasets
- [ ] No unbounded recursion
- [ ] Pagination for large datasets
- [ ] Database indexes on queried columns

**Resource Usage:**
- [ ] Connection pooling
- [ ] No memory leaks (event listeners cleaned)
- [ ] Large files streamed (not loaded fully)
- [ ] Caching for expensive operations

**Database:**
- [ ] No N+1 query problems
- [ ] Eager loading when needed
- [ ] Batch operations instead of loops
- [ ] Query optimization (use EXPLAIN)

### Quality: Critical Checks

**SOLID:**
- [ ] Single Responsibility (one reason to change)
- [ ] Functions < 50 lines
- [ ] No duplicate code (DRY)
- [ ] Clear naming (no abbreviations)

**Structure:**
- [ ] Error handling present
- [ ] Edge cases handled
- [ ] Tests included
- [ ] Documentation for complex logic

### UX: Critical Checks

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] ARIA labels on interactive elements
- [ ] Color contrast 4.5:1 minimum
- [ ] Error messages user-friendly

**User Experience:**
- [ ] Loading states shown
- [ ] Error feedback clear
- [ ] No data loss on navigation
- [ ] Works on mobile

## Severity Levels

### 🚨 CRITICAL
Must fix before merge:
- Security vulnerabilities
- Data loss risks
- System crashes
- Accessibility blockers

### ⚠️ MODERATE
Should fix soon:
- Performance issues
- Code quality problems
- UX friction
- Maintainability concerns

### 📉 MINOR
Nice to fix:
- Naming improvements
- Comment clarity
- Minor optimizations
- Style consistency

## Review Process

1. **Automated checks first**
   - Linting
   - Type checking
   - Security scanning
   - Test coverage

2. **Manual review**
   - Read code for understanding
   - Apply checklists by dimension
   - Note file:line for each issue

3. **Consolidate findings**
   - Group by severity
   - Remove duplicates
   - Prioritize fixes

4. **Provide feedback**
   - Be specific (file:line)
   - Explain why it's an issue
   - Suggest concrete fix

## Feedback Template

```
[SEVERITY] [CATEGORY]: [Issue description]
File: path/to/file.js:42
Problem: [What's wrong and why it matters]
Fix: [Specific recommendation]

Example:
🚨 CRITICAL Security: SQL injection vulnerability
File: src/auth/login.js:34
Problem: User input directly concatenated into query
Fix: Use parameterized query: db.query('SELECT * FROM users WHERE email = ?', [email])
```

## Progressive Review

**Quick review (5 min):**
- Security: Check for obvious vulnerabilities
- Performance: Check for O(n²) loops
- Quality: Check function lengths
- UX: Check error messages

**Standard review (20 min):**
- All quick checks
- Apply full checklists
- Test manually
- Read tests

**Deep review (60 min):**
- All standard checks
- Trace data flow
- Check edge cases
- Load test
- Accessibility audit

## Language-Specific Patterns

### JavaScript/TypeScript
- Use `const` by default
- Avoid `any` types
- Handle promise rejections
- Use optional chaining (`?.`)
- Escape JSX content

### Python
- Use type hints
- Follow PEP 8
- Use context managers for resources
- Avoid mutable defaults
- Use list comprehensions

### Go
- Handle all errors
- Close resources (defer)
- Use channels for concurrency
- Avoid goroutine leaks
- Check nil pointers

## Common Code Smells

**Long Method:** > 50 lines → Extract methods
**Large Class:** > 300 lines → Split responsibilities
**Duplicate Code:** Copy-paste → Extract function
**Magic Numbers:** Hardcoded values → Named constants
**Deep Nesting:** > 3 levels → Early returns
**Long Parameter List:** > 3 params → Parameter object
**Comments Explaining Code:** → Rename for clarity

## Automated Tools

**Security:**
- npm audit (JavaScript)
- bandit (Python)
- gosec (Go)

**Performance:**
- Lighthouse (web)
- profiling tools
- query analyzers

**Quality:**
- ESLint (JavaScript)
- Pylint (Python)
- golangci-lint (Go)

**Accessibility:**
- axe DevTools
- WAVE
- Lighthouse a11y audit

## Review Checklist Summary

Before approving:
- [ ] Security vulnerabilities addressed
- [ ] No obvious performance issues
- [ ] Code is maintainable
- [ ] Tests included and passing
- [ ] Accessibility requirements met
- [ ] Error handling present
- [ ] Documentation adequate
- [ ] No hardcoded secrets

---

**Philosophy:** Prevent bugs, not just find them. Review to teach, not just criticize.
