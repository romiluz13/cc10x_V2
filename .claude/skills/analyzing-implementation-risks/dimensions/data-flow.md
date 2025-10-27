# Dimension 1: Data Flow & Transformations

## Overview

Track data from origin through all transformations to final destination. Most bugs occur at transformation boundaries.

## Analysis Questions

### Input Sources
- **Origin:** User form? API request? Database query? File upload? Message queue? WebSocket? Cache? Environment variable?
- **Format:** JSON? XML? Binary? Form data? CSV? Protobuf? GraphQL? Plain text?
- **Control:** Who controls this input? Internal trusted service? External third-party? End user? Automated system?
- **Manipulation:** Can input be intercepted/modified before reaching code? (MITM, proxy, browser devtools)

### Transformations
- **Steps:** List every transformation: parse → validate → normalize → compute → format → encode
- **Reversibility:** Can transformations be undone? Is data lost (e.g., hashing)?
- **Intermediate states:** Can intermediate data be invalid? Are all states validated?
- **Error propagation:** If step 3 fails, what happens to steps 1-2?

### Output Destinations
- **Target:** UI render? Database insert? API response? File write? Log entry? Message queue? Cache? Email?
- **Format expected:** Does destination expect specific format? Schema validation?
- **Availability:** What if destination is unavailable? Retry? Queue? Fail?
- **Security:** Can output be intercepted? Is it encrypted in transit/at rest?

## Critical Edge Cases Checklist

### Missing/Null Values
- [ ] `null` (JavaScript/Java)
- [ ] `undefined` (JavaScript)
- [ ] `None` (Python)
- [ ] Empty string `""`
- [ ] Empty array `[]`
- [ ] Empty object `{}`
- [ ] Missing object properties (`obj.prop` when `prop` doesn't exist)
- [ ] Database NULL values
- [ ] Optional query parameters not provided

### Wrong Type
- [ ] String when expecting number: `"abc"` for age
- [ ] Number when expecting string: `123` for name
- [ ] Object when expecting array: `{a: 1}` vs `[{a: 1}]`
- [ ] Array when expecting object
- [ ] Boolean as string: `"true"` vs `true`
- [ ] Date as string without parsing: `"2025-10-27"`

### Wrong Format
- [ ] Invalid date: `"2025-13-45"` (13th month)
- [ ] Invalid email: `"user@"`, `"@domain.com"`, `"spaces in email@test.com"`
- [ ] Invalid phone: Letters, wrong length, missing country code
- [ ] Invalid URL: Missing protocol, spaces, invalid domain
- [ ] Invalid JSON: `{key: value}` (unquoted keys)
- [ ] Invalid XML: Unclosed tags, wrong encoding
- [ ] Inconsistent casing: `"TRUE"` vs `"true"` vs `"True"`

### Extreme Values
- [ ] Zero: `0`, `0.0`
- [ ] Negative numbers: `-1`, `-999999`
- [ ] Very large numbers: `Number.MAX_SAFE_INTEGER`, `9999999999999`
- [ ] Infinity: `Infinity`, `-Infinity`
- [ ] NaN: `NaN` (Not a Number)
- [ ] Very long strings: 10MB+ string
- [ ] Very large arrays: 1M+ elements
- [ ] Deeply nested objects: 100+ levels deep
- [ ] Maximum file size: What's the limit?

### Special Characters
- [ ] SQL injection: `' OR '1'='1`, `'; DROP TABLE users--`
- [ ] XSS: `<script>alert('XSS')</script>`, `<img src=x onerror=alert(1)>`
- [ ] Path traversal: `../../etc/passwd`, `..\..\windows\system32`
- [ ] Command injection: `; rm -rf /`, `| cat /etc/passwd`
- [ ] Null bytes: `\0`, `%00`
- [ ] Unicode: Emojis, RTL characters, zero-width chars, homoglyphs
- [ ] Special regex chars: `.*+?^${}()|[]\`
- [ ] Newlines/tabs: `\n`, `\r\n`, `\t`
- [ ] Quotes: `"`, `'`, `` ` ``

### Encoding Issues
- [ ] UTF-8 vs ASCII: Non-ASCII chars break?
- [ ] UTF-8 vs Latin-1: Different byte representations
- [ ] Windows (CRLF) vs Unix (LF) line endings
- [ ] URL encoding: Spaces as `%20` or `+`
- [ ] HTML entities: `&lt;` vs `<`
- [ ] Double encoding: `%2520` (encoded space)
- [ ] BOM (Byte Order Mark): Invisible character at file start

## Data Flow Mapping Template

Use this format to document data flow:

```
INPUT:
Source: [user form / API / database]
Format: [JSON / form-data / CSV]
Trust level: [trusted internal / untrusted external]
Example: {"username": "alice", "age": 25}

TRANSFORMATIONS:
1. Parse: JSON.parse() → object
   Risk: Malformed JSON throws exception

2. Validate: Check username length, age > 0
   Risk: Missing validation for age upper bound

3. Normalize: Trim whitespace, lowercase username
   Risk: Unicode normalization bypasses?

4. Compute: Calculate derived fields
   Risk: Division by zero, overflow

5. Format: Convert to database schema
   Risk: Type coercion issues

OUTPUT:
Destination: PostgreSQL database
Format: SQL INSERT
Validation: Schema constraints, foreign keys
Error handling: Transaction rollback on failure
```

## Common Patterns and Risks

### Pattern: User Input → Database
**Risks:**
- SQL injection if not using parameterized queries
- Type coercion issues (string "123" vs number 123)
- Missing required fields
- Exceeding column size limits
- Constraint violations (unique, foreign key)

**Mitigations:**
- Always use parameterized queries/ORMs
- Validate types before database call
- Validate all required fields present
- Check string lengths match column limits
- Handle constraint violation errors gracefully

### Pattern: API Response → UI Render
**Risks:**
- XSS if rendering unescaped HTML
- Missing error field handling
- Assuming response structure without validation
- Race conditions (stale data displayed)
- Sensitive data exposure in client-side code

**Mitigations:**
- Always escape/sanitize before rendering
- Validate response structure with schema
- Handle all error response formats
- Use loading states and request cancellation
- Never include secrets in API responses

### Pattern: File Upload → Processing
**Risks:**
- File size limits (DoS via huge files)
- File type validation (MIME type spoofing)
- Path traversal in filename
- Malicious file content (zip bombs, macro viruses)
- Resource exhaustion (processing large images)

**Mitigations:**
- Enforce strict file size limits
- Validate file type by content, not extension
- Sanitize filenames, never use user input in paths
- Scan files for malware
- Process asynchronously with timeouts

### Pattern: Cache → Application
**Risks:**
- Cache poisoning (attacker populates cache)
- Stale data (cache not invalidated)
- Cache key collisions
- Serialization/deserialization issues
- Missing cache entry handling

**Mitigations:**
- Validate cached data before use
- Implement cache TTL and invalidation
- Use unique, non-guessable cache keys
- Handle deserialization errors
- Always have fallback for cache misses

## Examples

### Example 1: Login Form Data Flow

**Input:**
```javascript
// POST /login
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Risks Identified:**
1. Missing email format validation (could accept `"not-an-email"`)
2. No password strength requirements
3. No rate limiting (brute force attacks)
4. Plain text password in logs if logged at wrong level
5. No HTTPS enforcement check
6. Missing CSRF token validation

**Mitigations:**
1. Validate email format with regex
2. Enforce min length, complexity rules
3. Implement rate limiting (5 attempts/15 min)
4. Never log password field, redact in monitoring
5. Enforce HTTPS, reject HTTP requests
6. Require and validate CSRF token

### Example 2: CSV Import Data Flow

**Input:**
```csv
name,email,age
Alice,alice@test.com,25
Bob,bob@,30
"Charlie ""The Boss""",charlie@test.com,invalid
```

**Risks Identified:**
1. Row 2: Invalid email format
2. Row 3: Invalid age (non-numeric)
3. Row 3: Quoted quotes handling
4. Missing headers validation
5. No row count limit (could be millions)
6. No encoding specification (UTF-8? Latin-1?)
7. Missing duplicate detection

**Mitigations:**
1. Validate each field, collect all errors
2. Reject entire file or skip invalid rows (document choice)
3. Use proper CSV parser that handles quoting
4. Validate headers match expected schema
5. Limit file size and row count
6. Detect and validate encoding
7. Check for duplicates on unique fields

### Example 3: API Response Parsing

**Input:**
```javascript
// Expected response:
{ "user": { "id": 123, "name": "Alice" } }

// Actual responses that break assumptions:
{ "error": "Not found" }              // Missing "user" field
{ "user": null }                      // Null user
{ "user": { "id": "123" } }          // String ID instead of number
{ "user": { "id": 123 } }            // Missing "name" field
```

**Risks Identified:**
1. Assuming "user" field exists (causes `Cannot read property 'id' of undefined`)
2. Not handling error responses
3. Not validating data types
4. Not handling missing optional fields

**Mitigations:**
```javascript
// Defensive parsing:
try {
  if (response.error) {
    handleError(response.error);
    return;
  }

  if (!response.user) {
    throw new Error("Missing user in response");
  }

  const userId = parseInt(response.user.id);
  if (isNaN(userId)) {
    throw new Error("Invalid user ID");
  }

  const userName = response.user.name || "Unknown User";

  // Now safe to use userId and userName
} catch (error) {
  logError(error);
  showUserFriendlyMessage();
}
```

## Checklist for Any Data Flow

When analyzing any data transformation:

- [ ] Documented where data comes from
- [ ] Documented what format it's in
- [ ] Documented who controls it (trusted/untrusted)
- [ ] Listed every transformation step
- [ ] Identified what can fail at each step
- [ ] Validated all edge cases tested (null, wrong type, extremes)
- [ ] Confirmed input validation on server-side (not just client)
- [ ] Confirmed output escaping/encoding appropriate for destination
- [ ] Checked error handling at each transformation
- [ ] Verified sensitive data is not logged/exposed
- [ ] Confirmed data integrity maintained through transformations
- [ ] Identified all intermediate states are valid

---

**Key Principle:** Trust no data. Validate everything. Assume all input is malicious until proven otherwise.
