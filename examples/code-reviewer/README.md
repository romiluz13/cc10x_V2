# Code Reviewer Skill - Design Notes

This example demonstrates several best practices for skill authoring.

## Design Decisions

### 1. Tool Restrictions

```yaml
allowed-tools: Read, Grep, Glob
```

**Why:** Code review is inherently read-only. This skill analyzes without modifying code.

**Benefits:**
- Prevents accidental changes
- Clear signal this is analysis-only
- Safe for use in sensitive contexts

### 2. Workflow with Checklist

```markdown
\`\`\`
Review Progress:
- [ ] Step 1: Understand context
- [ ] Step 2: Structural analysis
...
\`\`\`
```

**Why:** Code review is multi-step and benefits from tracking.

**Benefits:**
- Ensures no steps skipped
- Provides visible progress
- User can verify completeness

### 3. Structured Output Template

Provides exact format for review results with severity levels.

**Why:** Consistency in output format.

**Benefits:**
- Easy to understand
- Comparable across reviews
- Clear priorities

### 4. Concrete Examples

Shows actual code with issues and fixes.

**Why:** Examples clarify expectations better than abstract descriptions.

**Benefits:**
- Demonstrates severity levels
- Shows desired output format
- Provides reference for edge cases

### 5. Concise Content

**Avoids:**
- Explaining what code review is
- Describing why security matters
- Explaining programming concepts

**Includes:**
- Specific things to check
- How to structure findings
- Severity classifications

**Why:** Assumes Claude understands code review concepts, focuses on specific approach.

### 6. Progressive Disclosure Opportunity

This skill is simple enough for single file, but could grow to:

```
code-reviewer/
├── SKILL.md              # Overview and process
├── security-guide.md     # Detailed security checks
├── performance-guide.md  # Performance analysis details
└── examples/
    ├── python.md         # Language-specific examples
    ├── javascript.md
    └── java.md
```

If extended for multiple languages with extensive examples.

## What This Skill Does Well

### ✓ Clear Scope

Description includes what, when, and triggers:
```yaml
description: Reviews code for quality, security, performance, and best practices.
Use when user asks to review, analyze, or assess code quality...
```

### ✓ Structured Process

Six clear steps from understanding context to documenting findings.

### ✓ Severity Classification

Organizes findings by priority (Critical/Important/Suggestions).

### ✓ Concrete Guidance

Specific checks for each category (security, performance, quality).

### ✓ Example-Driven

Shows actual vulnerable code and how to fix it.

### ✓ Read-Only

Appropriate tool restrictions for analysis task.

## Usage Examples

### Example 1: Review a Single File

**User:** "Review this authentication function"

**Claude behavior:**
1. Loads reviewing-code skill
2. Follows review process
3. Checks security (auth-specific focus)
4. Checks error handling
5. Documents findings in structured format

### Example 2: Review Entire Module

**User:** "Review the API module for security issues"

**Claude behavior:**
1. Loads reviewing-code skill
2. Uses Grep to find files: `grep -r "def " api/`
3. Reviews each file systematically
4. Focuses on security (per user request)
5. Aggregates findings by severity

### Example 3: Focused Review

**User:** "Check this code for performance problems"

**Claude behavior:**
1. Loads reviewing-code skill
2. Focuses on Step 4 (Performance Check)
3. Looks for inefficient algorithms, N+1 queries
4. Documents performance issues
5. Provides optimization recommendations

## Testing Scenarios

### Test 1: SQL Injection Detection

**Code:**
```python
query = f"SELECT * FROM users WHERE name = '{user_input}'"
```

**Expected:** Critical security issue flagged with explanation and fix.

### Test 2: Missing Error Handling

**Code:**
```python
def divide(a, b):
    return a / b
```

**Expected:** Important issue flagged, recommend try/except and validation.

### Test 3: Performance Issue

**Code:**
```python
for user in users:
    for post in user.get_posts():  # N+1 query
        print(post.title)
```

**Expected:** High-impact performance issue with optimization suggestion.

## Possible Enhancements

### Add Language-Specific Rules

Extend with language-specific guides:
- Python: PEP 8, common anti-patterns
- JavaScript: ESLint rules, async/await patterns
- Java: SOLID principles, design patterns

### Add Automated Checks

Include scripts for static analysis:
```bash
python scripts/run_linter.py
python scripts/check_security.py
```

### Add Framework-Specific Knowledge

Extend for frameworks:
- Django security checklist
- React performance patterns
- Spring Boot best practices

### Add Custom Rules

Allow users to specify project-specific rules:
```yaml
custom_rules:
  - no_print_statements: error
  - max_function_length: 50
  - require_type_hints: warning
```

## Key Takeaways

1. **Tool restrictions** communicate intent and prevent accidents
2. **Checklists** ensure systematic coverage
3. **Structured output** provides consistency
4. **Concrete examples** clarify expectations
5. **Severity levels** prioritize findings
6. **Read-only analysis** appropriate for review tasks
7. **Concise content** trusts Claude's baseline knowledge
8. **Clear triggers** in description enable automatic activation

This skill demonstrates the analysis-skill pattern with appropriate tool restrictions and structured workflows.
