# API Reviewer Example Skill

**Pattern**: Analysis Skill
**Complexity**: Medium
**Lines**: ~280
**Tools**: Read-only (allowed-tools restriction)

## Overview

This example demonstrates the **analysis-skill pattern** - a structured review process with checklists, categorization, and templated output.

## Design Decisions

### Pattern Choice

**Why analysis-skill?**
- Structured review process with multiple steps
- Clear workflow from analysis to report
- Categorization of findings (critical, consistency, security)
- Templated output format
- Read-only operation (no modifications)

**Alternatives considered**:
- ❌ Basic: Too simple for structured analysis
- ❌ Workflow: More about execution than analysis
- ✓ Analysis: Perfect fit for review/audit tasks

### Structure

```
api-reviewer/
├── SKILL.md (complete analysis skill)
└── README.md (this file)
```

Single file structure because:
- Content fits well under 500 lines (~280 lines)
- All review criteria are related
- No need for extensive separate reference material
- Could extend to multi-file if adding domain-specific APIs

### Best Practices Demonstrated

#### 1. Tool Restrictions ✓

```yaml
allowed-tools: Read, Grep, Glob
```

**Why restrict tools?**
- This is a read-only analysis task
- Should NOT modify code
- Prevents accidental writes
- Clear signal of intent (review, don't change)

#### 2. Workflow with Checklist ✓

```
API Review Progress:
- [ ] Step 1: Identify API specification files
- [ ] Step 2: Analyze endpoint structure
- [ ] Step 3: Check naming conventions
...
```

**Benefits**:
- User can copy and track progress
- Clear sequence prevents missed steps
- Checkbox format is actionable
- 9 steps break down complex review

#### 3. Template Pattern ✓

Provides complete report template:
- Summary section
- Findings by category
- Severity classification
- Recommendations with examples
- Positive highlights

**Why this works**:
- Consistent output across reviews
- User knows what to expect
- All important aspects covered
- Examples show good/bad patterns side-by-side

#### 4. Examples Pattern ✓

Every guideline includes concrete examples:

```
Good patterns:
GET    /api/v1/users
POST   /api/v1/users

Anti-patterns:
❌ GET /api/getUsers    # Verb in URL
❌ GET /api/Users       # Inconsistent casing
```

Shows what to do AND what to avoid.

#### 5. Categorization ✓

Findings organized by:
- **Critical Issues**: High-priority problems
- **Consistency Issues**: Style/convention violations
- **Security Considerations**: Auth, validation, exposure
- **Best Practices**: General REST principles

Makes findings actionable and prioritized.

#### 6. Severity Classification ✓

```
🔴 High - Breaking changes, security issues
🟡 Medium - Consistency problems, usability issues
🟢 Low - Minor improvements, nice-to-haves
```

Helps prioritize remediation efforts.

### Validation Checklist

- [x] Name: lowercase, hyphens, max 64 chars
- [x] Description: specific, third person, includes triggers
- [x] SKILL.md body: 280 lines (under 500)
- [x] allowed-tools: Read-only operations
- [x] Workflow: 9-step checklist
- [x] Template: Complete report structure
- [x] Examples: Good/bad patterns shown
- [x] Consistent terminology: "endpoint", "resource", "method"
- [x] Concise: No over-explaining REST concepts
- [x] Validation checklist at end

## Usage Example

When Claude Code has this skill loaded:

```
User: Review this API design for REST best practices

Claude: [Loads api-reviewer skill]
        [Copies progress checklist]
        [Step 1: Finds OpenAPI spec file]
        [Step 2: Analyzes 23 endpoints]
        [Step 3: Checks naming - finds inconsistencies]
        [Step 4: Validates HTTP methods - finds GET used for delete]
        [Steps 5-8: Continues systematic review]
        [Step 9: Generates findings report using template]

        [Outputs]:
        # API Design Review: User Management API

        ## Summary
        Endpoints Reviewed: 23
        Overall Assessment: Fair

        ## Critical Issues

        ### Incorrect HTTP Method Usage
        Severity: 🔴 High

        Finding: DELETE operation using GET method
        Location: GET /api/users/delete/{id}
        Impact: Not idempotent, unsafe, violates REST
        Recommendation:

        Current:  GET /api/users/delete/{id}
        Proposed: DELETE /api/users/{id}

        [... continues with full report]
```

Claude follows the structured workflow and generates a complete, actionable report.

## Key Takeaways

1. **Analysis skills need structured workflows**
   - Break complex review into clear steps
   - Provide checkbox tracking
   - Ensure no aspect is missed

2. **Templates ensure consistency**
   - User knows what to expect
   - All important categories covered
   - Output is immediately useful

3. **Examples clarify guidelines**
   - Show good AND bad patterns
   - Make abstract rules concrete
   - Enable quick understanding

4. **Categorization aids prioritization**
   - Critical vs minor issues clear
   - User can triage effectively
   - Remediation plan emerges naturally

5. **Read-only tools signal intent**
   - Makes review safe
   - Prevents accidental modifications
   - Clear separation of concerns

## When to Use This Pattern

Use the analysis-skill pattern when:

- ✅ Reviewing/auditing code, architecture, or designs
- ✅ Multi-step assessment process
- ✅ Findings need categorization
- ✅ Consistent output format desired
- ✅ Read-only operation (no modifications)

Don't use for:
- ❌ Simple operations (use basic-skill)
- ❌ Execution workflows (use workflow-skill)
- ❌ Content generation (use generation-skill)
- ❌ Operations requiring writes

## Possible Extensions

If this skill needed to grow:

**Multi-file pattern** for:
- Domain-specific API patterns (REST.md, GraphQL.md, gRPC.md)
- Industry standards (HEALTHCARE.md, FINANCE.md)
- Extensive examples library (EXAMPLES.md)

**Script-based pattern** for:
- Automated spec parsing
- Endpoint discovery scripts
- Validation against OpenAPI spec

For now, single-file analysis pattern is ideal.

## Related Patterns

- **code-reviewer**: Similar analysis pattern for code
- **security-reviewer**: Analysis with security focus
- **database-schema-reviewer**: Analysis for data models
- **architecture-reviewer**: System design analysis

All follow similar structure:
1. Workflow with checklist
2. Categorized findings
3. Templated output
4. Examples of good/bad
5. Severity classification
