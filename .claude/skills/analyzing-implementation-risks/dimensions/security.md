# Dimension 5: Security & Validation

## Overview

Security isn't a feature - it's a requirement. Apply OWASP Top 10 thinking to every code change. Assume all input is malicious until proven otherwise.

## Analysis Questions

### Authentication & Authorization
- **Authentication:** Who is this user? How is identity verified?
- **Authorization:** Can this user perform this action?
- **Session management:** Are sessions secure? Timeout? CSRF protection?
- **Privilege escalation:** Can low-privilege user gain high-privilege access?

### Input Validation
- **Server-side:** Is validation enforced server-side (not just client)?
- **Whitelist:** Is there a whitelist of allowed values?
- **Type checking:** Are types validated?
- **Range checking:** Are min/max bounds enforced?
- **Bypass prevention:** Can validation be bypassed via direct API calls?

### Injection Attacks
- **SQL injection:** Are queries parameterized?
- **XSS (Cross-Site Scripting):** Is output escaped?
- **Command injection:** Are shell commands avoided/sanitized?
- **Path traversal:** Are file paths validated?
- **LDAP/NoSQL/XML injection:** Are queries properly escaped?

### Data Exposure
- **Logging:** Is sensitive data logged?
- **Error messages:** Do errors leak internal details?
- **URLs:** Is sensitive data in URLs?
- **Cache:** Is sensitive data cached inappropriately?
- **API responses:** Are responses over-sharing data?

### Common Vulnerabilities
- **CSRF:** Are state-changing operations protected?
- **Insecure direct object references:** Can users access other users' resources?
- **Unvalidated redirects:** Are redirects validated?
- **Broken access control:** Are permissions properly enforced?
- **Security misconfiguration:** Are defaults secure?

## OWASP Top 10 Checklist

### 1. Broken Access Control

**Risk:** Users can access/modify data they shouldn't.

**Checks:**
- [ ] Authorization enforced server-side (not client-side)
- [ ] User can only access their own resources
- [ ] Horizontal privilege escalation prevented (user A can't access user B's data)
- [ ] Vertical privilege escalation prevented (regular user can't access admin)
- [ ] Direct object references protected (can't change ID in URL to access others' data)

**Example Vulnerability:**
```javascript
// VULNERABLE:
app.get('/api/users/:userId/profile', (req, res) => {
  const profile = db.getProfile(req.params.userId);
  res.json(profile);  // Any user can access any profile by changing userId!
});

// SECURE:
app.get('/api/users/:userId/profile', authMiddleware, (req, res) => {
  const requestedUserId = req.params.userId;
  const authenticatedUserId = req.user.id;

  // Check authorization:
  if (requestedUserId !== authenticatedUserId && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const profile = db.getProfile(requestedUserId);
  res.json(profile);
});
```

### 2. Cryptographic Failures

**Risk:** Sensitive data exposed due to weak encryption.

**Checks:**
- [ ] Sensitive data encrypted at rest
- [ ] Sensitive data encrypted in transit (HTTPS/TLS)
- [ ] Strong encryption algorithms (AES-256, not DES)
- [ ] Secure key management (not hardcoded)
- [ ] Proper password hashing (bcrypt, argon2, not MD5/SHA1)
- [ ] No sensitive data in logs, URLs, error messages

**Example Vulnerability:**
```javascript
// VULNERABLE:
const hashedPassword = md5(password);  // MD5 is broken!

// SECURE:
const bcrypt = require('bcrypt');
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verification:
const match = await bcrypt.compare(password, hashedPassword);
```

### 3. Injection

**Risk:** Attacker injects malicious code/commands.

**SQL Injection:**
```javascript
// VULNERABLE:
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.execute(query);
// Attacker sends: ' OR '1'='1' --
// Query becomes: SELECT * FROM users WHERE email = '' OR '1'='1' --'
// Returns all users!

// SECURE:
const query = 'SELECT * FROM users WHERE email = ?';
db.execute(query, [email]);  // Parameterized query
```

**XSS (Cross-Site Scripting):**
```javascript
// VULNERABLE:
div.innerHTML = userInput;
// Attacker sends: <script>steal_cookies()</script>

// SECURE:
div.textContent = userInput;  // Auto-escapes

// For HTML libraries:
<div>{userInput}</div>  // React auto-escapes
<div v-text="userInput"></div>  // Vue auto-escapes

// If you MUST render HTML:
import DOMPurify from 'dompurify';
div.innerHTML = DOMPurify.sanitize(userInput);
```

**Command Injection:**
```javascript
// VULNERABLE:
exec(`convert ${userFilename} output.png`);
// Attacker sends: file.jpg; rm -rf /

// SECURE:
// Avoid shell commands! Use libraries instead.
import sharp from 'sharp';
await sharp(userFilename).toFile('output.png');

// If you MUST use shell:
import { execFile } from 'child_process';
execFile('convert', [userFilename, 'output.png']);  // Array arguments
```

**Path Traversal:**
```javascript
// VULNERABLE:
const filePath = `/uploads/${req.params.filename}`;
res.sendFile(filePath);
// Attacker sends: ../../etc/passwd

// SECURE:
const path = require('path');
const filename = path.basename(req.params.filename);  // Remove path components
const filePath = path.join(__dirname, 'uploads', filename);

// Additional check:
if (!filePath.startsWith(path.join(__dirname, 'uploads'))) {
  return res.status(403).send('Forbidden');
}

res.sendFile(filePath);
```

### 4. Insecure Design

**Risk:** Fundamental design flaws that can't be patched.

**Checks:**
- [ ] Threat modeling performed
- [ ] Security requirements defined
- [ ] Defense in depth (multiple layers)
- [ ] Fail securely (errors don't bypass security)
- [ ] Least privilege (minimal permissions by default)
- [ ] Separation of duties (no single point of compromise)

### 5. Security Misconfiguration

**Risk:** Default configurations are insecure.

**Checks:**
- [ ] Default passwords changed
- [ ] Unnecessary features disabled
- [ ] Error messages don't leak information
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] CORS properly configured
- [ ] Dependency versions up to date

**Example:**
```javascript
// Security headers:
app.use(helmet());  // Sets secure headers

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Error handling (don't leak stack traces):
if (process.env.NODE_ENV === 'production') {
  app.use((err, req, res, next) => {
    logger.error(err);  // Log full error
    res.status(500).json({ error: 'Internal server error' });  // Generic message
  });
} else {
  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message, stack: err.stack });  // Dev only
  });
}
```

### 6. Vulnerable and Outdated Components

**Risk:** Dependencies have known vulnerabilities.

**Checks:**
- [ ] Dependencies regularly updated
- [ ] Vulnerability scanning (npm audit, Snyk, Dependabot)
- [ ] No dependencies with known CVEs
- [ ] Unused dependencies removed
- [ ] Transitive dependencies checked

**Commands:**
```bash
# Check for vulnerabilities:
npm audit
npm audit fix

# Update dependencies:
npm update

# Check for outdated:
npm outdated
```

### 7. Identification and Authentication Failures

**Risk:** Weak authentication allows unauthorized access.

**Checks:**
- [ ] Strong password requirements (min length, complexity)
- [ ] Multi-factor authentication (MFA) available
- [ ] Brute force protection (rate limiting, account lockout)
- [ ] Credential stuffing protection
- [ ] Session timeout implemented
- [ ] Secure session ID generation
- [ ] Password reset secure (time-limited tokens, not guessable)

**Example:**
```javascript
// Rate limiting for login:
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // Max 5 requests per window
  message: 'Too many login attempts, please try again later.'
});

app.post('/login', loginLimiter, async (req, res) => {
  // Login logic
});

// Password requirements:
const passwordSchema = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{12,}$'
);
// Min 12 chars, 1 lowercase, 1 uppercase, 1 digit, 1 special char

if (!passwordSchema.test(password)) {
  return res.status(400).json({
    error: 'Password must be at least 12 characters with mixed case, numbers, and symbols'
  });
}

// Secure session configuration:
app.use(session({
  secret: process.env.SESSION_SECRET,  // Strong random secret
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JavaScript access
    maxAge: 3600000,   // 1 hour
    sameSite: 'strict' // CSRF protection
  }
}));
```

### 8. Software and Data Integrity Failures

**Risk:** Code/data modified without detection.

**Checks:**
- [ ] Dependency integrity verified (lockfiles, checksums)
- [ ] Code signing for releases
- [ ] Secure CI/CD pipeline
- [ ] Subresource Integrity (SRI) for CDN scripts
- [ ] Digital signatures for critical data

**Example:**
```html
<!-- Subresource Integrity: -->
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>
```

### 9. Security Logging and Monitoring Failures

**Risk:** Attacks go undetected.

**Checks:**
- [ ] Failed login attempts logged
- [ ] Authorization failures logged
- [ ] Input validation failures logged
- [ ] Logs include correlation IDs
- [ ] Logs don't contain sensitive data
- [ ] Alerting on suspicious patterns
- [ ] Log retention policy

**Example:**
```javascript
// Security event logging:
function logSecurityEvent(event) {
  logger.warn('SECURITY_EVENT', {
    type: event.type,
    user: event.userId,
    ip: event.ipAddress,
    timestamp: new Date().toISOString(),
    details: event.details,
    correlationId: event.correlationId
  });

  // Alert on critical events:
  if (event.type === 'AUTH_FAILURE' && event.attemptCount > 5) {
    alerting.notify('Potential brute force attack', event);
  }
}

// Failed login:
logSecurityEvent({
  type: 'AUTH_FAILURE',
  userId: email,
  ipAddress: req.ip,
  details: 'Invalid password',
  attemptCount: await getFailedAttempts(email)
});

// Authorization failure:
logSecurityEvent({
  type: 'AUTHZ_FAILURE',
  userId: req.user.id,
  ipAddress: req.ip,
  details: `Attempted to access resource ${resourceId} without permission`
});
```

### 10. Server-Side Request Forgery (SSRF)

**Risk:** Attacker tricks server into making requests to internal systems.

**Checks:**
- [ ] User-supplied URLs validated
- [ ] Internal IPs blocked (10.x, 192.168.x, 127.x)
- [ ] URL schemes restricted (only http/https)
- [ ] DNS rebinding protections

**Example:**
```javascript
// VULNERABLE:
app.post('/fetch-url', async (req, res) => {
  const url = req.body.url;
  const response = await fetch(url);  // Attacker can access internal services!
  res.json(await response.json());
});

// SECURE:
const URL = require('url');

function isUrlSafe(urlString) {
  try {
    const url = new URL(urlString);

    // Only allow http/https:
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    // Block internal IPs:
    const hostname = url.hostname;
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('169.254.') ||  // Link-local
      hostname === '[::1]'  // IPv6 localhost
    ) {
      return false;
    }

    // Whitelist allowed domains:
    const allowedDomains = ['api.example.com', 'cdn.example.com'];
    if (!allowedDomains.includes(hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

app.post('/fetch-url', async (req, res) => {
  const url = req.body.url;

  if (!isUrlSafe(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const response = await fetch(url, { timeout: 5000 });
  res.json(await response.json());
});
```

## Security Testing Checklist

- [ ] **Authentication bypass:** Can you access without logging in?
- [ ] **Authorization bypass:** Can you access other users' data?
- [ ] **SQL injection:** Try `' OR '1'='1' --` in inputs
- [ ] **XSS:** Try `<script>alert(1)</script>` in inputs
- [ ] **Path traversal:** Try `../../etc/passwd` in file operations
- [ ] **CSRF:** Can POST request be triggered from external site?
- [ ] **Session fixation:** Can attacker set session ID?
- [ ] **Insecure deserialization:** Can attacker inject malicious objects?
- [ ] **Mass assignment:** Can attacker modify fields they shouldn't?
- [ ] **IDOR:** Can attacker change ID parameter to access others' resources?

---

**Key Principle:** Never trust user input. Validate everything. Fail securely. Log security events. Defense in depth.
