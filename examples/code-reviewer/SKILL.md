---
name: reviewing-code
description: Reviews code for quality, security, performance, and best practices. Use when user asks to review, analyze, or assess code quality, or mentions code review, security audit, or performance analysis.
allowed-tools: Read, Grep, Glob
---

# Code Reviewer

Reviews code systematically for quality, security, and best practices.

## Review Process

Copy this checklist:

```
Review Progress:
- [ ] Step 1: Understand context
- [ ] Step 2: Structural analysis
- [ ] Step 3: Security review
- [ ] Step 4: Performance check
- [ ] Step 5: Best practices
- [ ] Step 6: Document findings
```

## Step 1: Understand Context

Before reviewing:
- What is the code's purpose?
- What language/framework?
- What are the requirements?
- What is the scope of review?

## Step 2: Structural Analysis

**Organization:**
- Clear module structure?
- Appropriate separation of concerns?
- Consistent file organization?

**Readability:**
- Clear naming?
- Appropriate comments?
- Consistent style?

## Step 3: Security Review

**Check for:**
- Input validation
- SQL injection vulnerabilities
- XSS vulnerabilities
- Authentication/authorization issues
- Sensitive data exposure
- Insecure dependencies

## Step 4: Performance Check

**Look for:**
- Inefficient algorithms
- Unnecessary computations
- Database query optimization
- Memory leaks
- Resource management issues

## Step 5: Best Practices

**Verify:**
- Error handling
- Logging appropriately
- Testing coverage
- Documentation
- Code reusability

## Step 6: Document Findings

Structure results:

```markdown
# Code Review Results

## Summary
[Overall assessment]

## Critical Issues (High Priority)

### Issue 1: [Title]
- **Location**: [File:line]
- **Severity**: Critical
- **Issue**: [Description]
- **Impact**: [What could happen]
- **Recommendation**: [How to fix]

## Important Issues (Medium Priority)

### Issue 2: [Title]
[Similar structure]

## Suggestions (Low Priority)

### Suggestion 1: [Title]
[Similar structure]

## Positive Observations

- [Good practice 1]
- [Good practice 2]

## Overall Assessment

[Summary and recommendations]
```

## Review Criteria

### Security

**High severity:**
- SQL injection
- XSS vulnerabilities
- Authentication bypasses
- Hardcoded credentials

**Medium severity:**
- Missing input validation
- Weak encryption
- Information disclosure

**Low severity:**
- Missing security headers
- Verbose error messages

### Performance

**High impact:**
- O(n²) or worse algorithms
- N+1 query problems
- Memory leaks

**Medium impact:**
- Unnecessary computations
- Missing caching
- Large payloads

**Low impact:**
- Minor inefficiencies
- Optimization opportunities

### Code Quality

**Critical:**
- No error handling
- Broken functionality
- Race conditions

**Important:**
- Code duplication
- Complex logic
- Poor naming

**Suggestions:**
- Style inconsistencies
- Missing comments
- Refactoring opportunities

## Example Review

### Code Snippet

```python
def get_user(id):
    query = f"SELECT * FROM users WHERE id = {id}"
    result = db.execute(query)
    return result
```

### Review

**Critical Issue: SQL Injection**
- **Location**: get_user function, line 2
- **Severity**: Critical
- **Issue**: Direct string interpolation creates SQL injection vulnerability
- **Impact**: Attacker could access or modify any data in database
- **Recommendation**: Use parameterized queries

```python
def get_user(id):
    query = "SELECT * FROM users WHERE id = ?"
    result = db.execute(query, (id,))
    return result
```

**Important Issue: No Error Handling**
- **Location**: get_user function
- **Severity**: Medium
- **Issue**: No handling for invalid IDs or database errors
- **Recommendation**: Add try/except and validation

```python
def get_user(id):
    if not isinstance(id, int) or id <= 0:
        raise ValueError("Invalid user ID")

    try:
        query = "SELECT * FROM users WHERE id = ?"
        result = db.execute(query, (id,))
        return result
    except DatabaseError as e:
        logger.error(f"Database error: {e}")
        raise
```

## Quick Reference

| Category | Look For | Severity if Missing |
|----------|----------|---------------------|
| Security | Input validation | High |
| Security | Parameterized queries | Critical |
| Security | Auth checks | Critical |
| Performance | Algorithm efficiency | Medium-High |
| Performance | Resource cleanup | Medium |
| Quality | Error handling | High |
| Quality | Clear naming | Medium |
| Quality | Documentation | Low |

**Note**: This is a read-only analysis skill. It identifies issues but doesn't make changes. User must implement fixes.
