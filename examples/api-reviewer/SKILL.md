---
name: api-reviewer
description: Reviews REST API designs for consistency, usability, and best practices. Use when designing APIs, reviewing endpoints, or validating API specifications against standards.
allowed-tools: Read, Grep, Glob
---

# API Design Reviewer

Analyzes REST API designs for consistency, usability, and adherence to best practices.

## When to Use

Activate this skill when the user wants to:
- Review API endpoint design
- Check API specification (OpenAPI/Swagger) for issues
- Validate REST conventions
- Assess API usability and consistency
- Identify potential improvements

## Review Process

Copy this checklist and track progress:

```
API Review Progress:
- [ ] Step 1: Identify API specification files
- [ ] Step 2: Analyze endpoint structure
- [ ] Step 3: Check naming conventions
- [ ] Step 4: Validate HTTP methods usage
- [ ] Step 5: Review request/response formats
- [ ] Step 6: Assess error handling
- [ ] Step 7: Check authentication approach
- [ ] Step 8: Evaluate versioning strategy
- [ ] Step 9: Generate findings report
```

### Step 1: Identify Specification Files

Find API specification:

```bash
# OpenAPI/Swagger specs
find . -name "openapi.yaml" -o -name "swagger.yaml" -o -name "*api*.yaml"

# Or source code endpoints
grep -r "@app.route\|@router\|app.get\|app.post" --include="*.py"
grep -r "@GetMapping\|@PostMapping\|@RequestMapping" --include="*.java"
```

### Step 2: Analyze Endpoint Structure

Review URL patterns:

**Good patterns**:
```
GET    /api/v1/users
GET    /api/v1/users/{id}
POST   /api/v1/users
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}

GET    /api/v1/users/{id}/posts
POST   /api/v1/users/{id}/posts
```

**Anti-patterns**:
```
❌ GET  /api/getUsers          # Verb in URL
❌ POST /api/user/create       # Verb in URL
❌ GET  /api/users/delete/123  # Wrong method
❌ GET  /api/Users             # Inconsistent casing
❌ GET  /api/user_posts        # Inconsistent delimiter
```

### Step 3: Check Naming Conventions

Verify consistency:

**Resource Names**:
- Plural nouns: `/users` not `/user`
- Lowercase: `/users` not `/Users`
- Hyphens for multi-word: `/blog-posts` not `/blog_posts`
- No verbs: `/users` not `/getUsers`

**URL Parameters**:
- Snake_case or camelCase (be consistent)
- Descriptive: `?page_size=20` not `?ps=20`
- Avoid abbreviations: `?created_after=2024-01-01` not `?ca=2024-01-01`

### Step 4: Validate HTTP Methods

Check method usage:

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| GET | Retrieve resource | ✓ | ✓ |
| POST | Create resource | ✗ | ✗ |
| PUT | Replace resource | ✓ | ✗ |
| PATCH | Update partial | ✗ | ✗ |
| DELETE | Remove resource | ✓ | ✗ |

**Common mistakes**:
- ❌ Using GET for state changes
- ❌ Using POST when PUT is appropriate
- ❌ DELETE returning resource in body

### Step 5: Review Request/Response Formats

Check for consistency:

**Request bodies** should:
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response format** should be consistent:

**Success response**:
```json
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**List response**:
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

**Error response**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": {
      "field": "email",
      "issue": "missing"
    }
  }
}
```

### Step 6: Assess Error Handling

Verify status codes:

| Code | Meaning | Use When |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST creating resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Valid auth, insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (POST) |
| 422 | Unprocessable | Semantic errors |
| 500 | Server Error | Unexpected server error |

**Common mistakes**:
- ❌ Using 200 for all responses
- ❌ Using 500 for validation errors
- ❌ Using 404 for authorization failures

### Step 7: Check Authentication

Review auth approach:

**Bearer tokens** (common):
```
Authorization: Bearer <token>
```

**API keys** (simple):
```
X-API-Key: <key>
```

**Issues to flag**:
- ❌ Auth tokens in URL parameters
- ❌ Inconsistent header naming
- ❌ No token refresh mechanism
- ❌ Unclear auth error messages

### Step 8: Evaluate Versioning

Check versioning strategy:

**URL versioning** (common):
```
/api/v1/users
/api/v2/users
```

**Header versioning** (flexible):
```
Accept: application/vnd.api.v1+json
```

**Issues to flag**:
- ❌ No versioning strategy
- ❌ Breaking changes without version bump
- ❌ Inconsistent versioning approach

### Step 9: Generate Findings Report

Use this template:

## Findings Report Structure

```markdown
# API Design Review: [API Name]

## Summary

**Review Date**: [Date]
**Endpoints Reviewed**: [Count]
**Overall Assessment**: [Good/Fair/Needs Improvement]

## Critical Issues

### [Issue Category]

**Severity**: 🔴 High / 🟡 Medium / 🟢 Low

**Finding**: [Specific issue]

**Location**: [Endpoint or file]

**Impact**: [What this affects]

**Recommendation**: [How to fix]

**Example**:
\`\`\`
Current:  POST /api/deleteUser/123
Proposed: DELETE /api/users/123
\`\`\`

## Consistency Issues

- [List of inconsistencies found]
- [Specific examples]

## Naming Conventions

✓ **Strengths**: [What's done well]
❌ **Issues**: [What needs fixing]

## HTTP Methods

✓ **Strengths**: [Correct usage]
❌ **Issues**: [Incorrect usage]

## Error Handling

✓ **Strengths**: [Good error patterns]
❌ **Issues**: [Missing or incorrect errors]

## Security Considerations

[Auth issues, exposure risks, etc.]

## Best Practices Compliance

| Practice | Status | Notes |
|----------|--------|-------|
| RESTful URLs | ✓/✗ | [Notes] |
| Consistent naming | ✓/✗ | [Notes] |
| Proper HTTP methods | ✓/✗ | [Notes] |
| Error handling | ✓/✗ | [Notes] |
| Versioning | ✓/✗ | [Notes] |

## Priority Recommendations

1. **High Priority**: [Critical fixes]
2. **Medium Priority**: [Important improvements]
3. **Low Priority**: [Nice-to-have enhancements]

## Positive Highlights

[Things the API does well - always include positives]
```

## Review Checklist

Before finalizing review:

- [ ] All endpoints analyzed
- [ ] Consistency checked across endpoints
- [ ] HTTP methods validated
- [ ] Error codes verified
- [ ] Naming conventions assessed
- [ ] Authentication reviewed
- [ ] Findings categorized by severity
- [ ] Specific examples provided
- [ ] Recommendations are actionable
- [ ] Positive aspects highlighted

## Common Patterns to Flag

### Over-Nesting

```
❌ GET /api/users/{id}/posts/{post_id}/comments/{comment_id}/likes

✓ GET /api/comments/{comment_id}/likes
```

### Actions as Resources

```
❌ POST /api/users/{id}/send-email

✓ POST /api/users/{id}/notifications
```

### Mixing Singular and Plural

```
❌ GET /api/user/{id}
❌ GET /api/users/{id}/post

✓ GET /api/users/{id}
✓ GET /api/users/{id}/posts
```

### Query Parameters for Filtering

```
✓ GET /api/users?status=active&role=admin

❌ GET /api/users/active/admin
```

## Security Review Points

- Authentication required on all non-public endpoints
- Authorization checks for resource access
- Rate limiting implemented
- Input validation on all parameters
- No sensitive data in URLs
- HTTPS enforced
- CORS configured appropriately

## Final Validation

After generating report:

1. Ensure all findings have examples
2. Verify recommendations are specific
3. Check that severity is appropriate
4. Confirm positive highlights included
5. Validate report is actionable
