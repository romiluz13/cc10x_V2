# Skill Patterns and Templates

This document details common skill patterns and provides templates for each type.

## Pattern Selection Guide

| Use Case | Pattern | Complexity | Supporting Files |
|----------|---------|------------|------------------|
| Simple instructions | Basic Skill | Low | None |
| Code/data analysis | Analysis Skill | Medium | Optional scripts |
| Creating content/code | Generation Skill | Medium | Examples file |
| Multi-step processes | Workflow Skill | Medium-High | Optional workflow docs |
| Read-only operations | Tool-Restricted Skill | Low-Medium | None |
| Large reference materials | Multi-File Skill | High | Multiple .md files |
| Utility scripts needed | Script-Based Skill | Medium-High | Python/bash scripts |
| Requires validation | Validation Skill | High | Validation scripts |

## 1. Basic Skill Pattern

**When to use:** Simple, self-contained instructions that fit in <500 lines

**Structure:**
```
skill-name/
└── SKILL.md
```

**Template:**
```markdown
---
name: skill-name
description: Brief description with trigger keywords. Use when [scenarios].
---

# Skill Name

## Overview
Brief introduction to what this skill does.

## Instructions

Step-by-step guidance:

1. First step with clear action
2. Second step with clear action
3. Third step with clear action

## Examples

**Example 1:**
[Concrete example showing usage]

**Example 2:**
[Another concrete example]

## Notes

Additional tips or considerations.
```

**Example use case:** Simple formatters, basic converters, straightforward operations

## 2. Analysis Skill Pattern

**When to use:** Analyzing code, data, or documents with optional validation

**Structure:**
```
skill-name/
├── SKILL.md
└── scripts/
    └── validate.py (optional)
```

**Template:**
```markdown
---
name: analyzing-[domain]
description: Analyzes [what] to identify [insights]. Use when user asks to analyze, review, or assess [domain].
---

# [Domain] Analysis

## Analysis Process

1. **Understand context**
   - Identify the scope
   - Determine analysis goals

2. **Perform analysis**
   - Examine [specific aspects]
   - Look for [patterns/issues/opportunities]

3. **Document findings**
   - Summarize discoveries
   - Provide specific examples
   - Rate severity/importance if applicable

## Analysis Checklist

Copy and track progress:

\`\`\`
Analysis Progress:
- [ ] Context understood
- [ ] [Aspect 1] reviewed
- [ ] [Aspect 2] reviewed
- [ ] [Aspect 3] reviewed
- [ ] Findings documented
- [ ] Recommendations provided
\`\`\`

## What to Look For

### [Category 1]
- [Specific thing 1]
- [Specific thing 2]

### [Category 2]
- [Specific thing 1]
- [Specific thing 2]

## Output Format

Structure findings like this:

\`\`\`markdown
# Analysis Results

## Summary
[High-level overview]

## Findings

### [Category 1]
- **Issue**: [Description]
  - **Location**: [Where found]
  - **Severity**: [High/Medium/Low]
  - **Recommendation**: [What to do]

### [Category 2]
[Similar structure]

## Recommendations
1. [Priority recommendation]
2. [Next recommendation]
\`\`\`
```

**Example use cases:** Code reviews, security audits, performance analysis, data quality checks

## 3. Generation Skill Pattern

**When to use:** Creating content, code, or documents with consistent quality

**Structure:**
```
skill-name/
├── SKILL.md
└── examples.md
```

**Template:**
```markdown
---
name: generating-[output-type]
description: Generates [what] following [style/standard]. Use when user asks to create, generate, or write [output-type].
---

# [Output Type] Generator

## Generation Process

1. Understand requirements
2. Follow the template structure
3. Apply style guidelines
4. Include required sections
5. Validate completeness

## Template

Use this structure:

\`\`\`[format]
[Template showing exact structure]
\`\`\`

## Style Guidelines

- **[Guideline 1]**: [Explanation]
- **[Guideline 2]**: [Explanation]
- **[Guideline 3]**: [Explanation]

## Examples

See [examples.md](examples.md) for complete examples.

Quick example:

**Input:** [What user provides]

**Output:**
\`\`\`
[What should be generated]
\`\`\`

## Quality Checklist

Verify generated output:
- [ ] Follows template structure
- [ ] Adheres to style guidelines
- [ ] All required sections present
- [ ] [Domain-specific check]
- [ ] [Domain-specific check]
```

**examples.md structure:**
```markdown
# [Output Type] Examples

## Example 1: [Scenario]

**Input:**
[User request or starting materials]

**Output:**
\`\`\`
[Complete generated output]
\`\`\`

**Notes:**
[Why this example demonstrates the pattern]

## Example 2: [Different Scenario]

[Same structure]

## Example 3: [Edge Case]

[Same structure]
```

**Example use cases:** Documentation generation, test creation, API design, report writing

## 4. Workflow Skill Pattern

**When to use:** Multi-step processes requiring sequential execution

**Structure:**
```
skill-name/
├── SKILL.md
└── workflows/ (optional)
    ├── workflow-1.md
    └── workflow-2.md
```

**Template:**
```markdown
---
name: [action]-workflow
description: Guides through [process] with validation steps. Use when user needs to [accomplish goal] through multiple steps.
---

# [Process] Workflow

## Workflow Overview

This skill guides you through [high-level process description].

## Main Workflow

Copy this checklist to track progress:

\`\`\`
Workflow Progress:
- [ ] Step 1: [Action]
- [ ] Step 2: [Action]
- [ ] Step 3: [Action]
- [ ] Step 4: [Action]
- [ ] Step 5: [Action]
\`\`\`

### Step 1: [Action]

**What to do:**
[Detailed instructions]

**Expected outcome:**
[What you should see]

**If something goes wrong:**
[Troubleshooting guidance]

### Step 2: [Action]

**Prerequisites:**
- Step 1 must be complete
- [Other prerequisites]

**What to do:**
[Detailed instructions]

**Validation:**
Run: \`[validation command]\`

Expected output: [what it should show]

**If validation fails:**
- [Common issue 1]: [How to fix]
- [Common issue 2]: [How to fix]
- Return to Step 1 if needed

### Step 3: [Action]

[Similar structure]

## Feedback Loop

After each step:
1. Validate the output
2. If validation fails, fix issues before proceeding
3. Document any deviations from expected results
4. Only proceed when validation passes

## Troubleshooting

### [Common Problem 1]

**Symptoms:** [How you know this is the problem]
**Solution:** [How to fix it]
**Prevention:** [How to avoid in future]

### [Common Problem 2]

[Similar structure]
```

**Example use cases:** Database migrations, deployment processes, data pipelines, complex refactorings

## 5. Tool-Restricted Skill Pattern

**When to use:** Read-only operations or security-sensitive tasks

**Structure:**
```
skill-name/
└── SKILL.md
```

**Template:**
```markdown
---
name: [action]-[domain]
description: [What it does] without making modifications. Use when user needs to [analyze/review/understand] [domain].
allowed-tools: Read, Grep, Glob
---

# [Domain] [Action]

**Note:** This skill operates in read-only mode and will not modify any files.

## What This Skill Does

[Explanation of capabilities]

## What This Skill Cannot Do

Due to tool restrictions:
- Cannot write or modify files
- Cannot execute scripts that change system state
- Cannot install packages or dependencies

For operations requiring modifications, ask the user for explicit permission to use a different approach.

## Analysis Process

1. **Read relevant files**
   Use: \`grep\` and file reading to gather information

2. **Analyze content**
   [What to look for]

3. **Report findings**
   Structure output as:
   \`\`\`markdown
   # Analysis Report

   ## Findings
   [What was discovered]

   ## Observations
   [Insights]

   ## Recommendations
   [Suggestions that would require write access]
   \`\`\`

## Example Usage

[Example showing read-only analysis]
```

**Example use cases:** Security audits, code analysis, configuration review, dependency checking

## 6. Multi-File Skill Pattern

**When to use:** Skills with substantial reference materials or multiple domains

**Structure:**
```
skill-name/
├── SKILL.md          # Overview and navigation
├── quickstart.md     # Getting started
├── reference.md      # Detailed API/command reference
├── examples.md       # Usage examples
├── advanced.md       # Advanced features
└── domain/           # Domain-specific content
    ├── domain-1.md
    ├── domain-2.md
    └── domain-3.md
```

**SKILL.md template:**
```markdown
---
name: skill-name
description: Comprehensive description with all trigger keywords
---

# Skill Name

## Overview

High-level introduction to the skill's capabilities.

## Quick Start

Most common usage right here in SKILL.md:

\`\`\`
[Basic example that covers 80% of use cases]
\`\`\`

## Documentation Structure

This skill includes specialized documentation:

**Getting Started**: See [quickstart.md](quickstart.md)
**API Reference**: See [reference.md](reference.md)
**Examples**: See [examples.md](examples.md)
**Advanced Features**: See [advanced.md](advanced.md)

## Domain-Specific Guides

**[Domain 1]**: See [domain/domain-1.md](domain/domain-1.md)
**[Domain 2]**: See [domain/domain-2.md](domain/domain-2.md)
**[Domain 3]**: See [domain/domain-3.md](domain/domain-3.md)

## Quick Reference

Most common operations:

| Task | Command | Notes |
|------|---------|-------|
| [Task 1] | \`[command]\` | [Notes] |
| [Task 2] | \`[command]\` | [Notes] |

For complete reference, see [reference.md](reference.md).
```

**Supporting file template (reference.md):**
```markdown
# [Skill Name] Reference

## Contents
- [Section 1](#section-1)
- [Section 2](#section-2)
- [Section 3](#section-3)

## Section 1

Detailed information for Section 1.

## Section 2

Detailed information for Section 2.

## Section 3

Detailed information for Section 3.
```

**Example use cases:** Database query skills, complex APIs, multi-domain platforms, comprehensive toolkits

## 7. Script-Based Skill Pattern

**When to use:** Operations requiring deterministic code execution

**Structure:**
```
skill-name/
├── SKILL.md
├── scripts/
│   ├── validate.py
│   ├── process.py
│   └── helper.sh
└── reference/
    └── script-api.md (optional)
```

**Template:**
```markdown
---
name: [action]-[domain]
description: [What it does] using pre-built utilities. Use when [scenarios].
---

# [Domain] [Action]

## Available Scripts

This skill includes utility scripts for reliable operations.

### validate.py

**Purpose:** Validates [what] before processing

**Usage:**
\`\`\`bash
python scripts/validate.py [input-file]
\`\`\`

**Output:**
- Success: Prints "Validation passed"
- Failure: Prints specific error messages

**Example:**
\`\`\`bash
python scripts/validate.py data.json
# Output: Validation passed
\`\`\`

### process.py

**Purpose:** Processes [what] with [transformation]

**Usage:**
\`\`\`bash
python scripts/process.py [input-file] [output-file] [options]
\`\`\`

**Options:**
- \`--format [type]\`: Output format (default: json)
- \`--verbose\`: Show detailed progress

**Example:**
\`\`\`bash
python scripts/process.py input.csv output.json --format json
\`\`\`

### helper.sh

**Purpose:** Helper utilities for [purpose]

**Usage:**
\`\`\`bash
bash scripts/helper.sh [action] [args]
\`\`\`

## Workflow

1. **Validate input**
   \`\`\`bash
   python scripts/validate.py input-file
   \`\`\`

2. **If validation passes, process**
   \`\`\`bash
   python scripts/process.py input-file output-file
   \`\`\`

3. **Verify output**
   \`\`\`bash
   python scripts/validate.py output-file
   \`\`\`

## Error Handling

Scripts provide clear error messages. Common issues:

**[Error Type 1]**
```
Error message example
```
**Solution:** [How to fix]

**[Error Type 2]**
```
Error message example
```
**Solution:** [How to fix]

## Script Development Notes

Scripts are designed to:
- Handle errors explicitly (not punt to Claude)
- Provide helpful error messages
- Validate inputs before processing
- Clean up resources on failure

See [reference/script-api.md](reference/script-api.md) for implementation details.
```

**Example use cases:** PDF form filling, data transformations, file format conversions, batch processing

## 8. Validation Skill Pattern

**When to use:** Complex operations requiring plan-validate-execute workflow

**Structure:**
```
skill-name/
├── SKILL.md
└── scripts/
    ├── create_plan.py
    ├── validate_plan.py
    └── execute_plan.py
```

**Template:**
```markdown
---
name: [action]-[domain]
description: [What it does] with validation to prevent errors. Use when [high-stakes scenarios].
---

# [Domain] [Action]

This skill uses a plan-validate-execute pattern to catch errors before making changes.

## Workflow

Copy this checklist:

\`\`\`
Workflow Progress:
- [ ] Step 1: Analyze requirements
- [ ] Step 2: Create plan file
- [ ] Step 3: Validate plan
- [ ] Step 4: Fix any validation errors
- [ ] Step 5: Execute validated plan
- [ ] Step 6: Verify results
\`\`\`

### Step 1: Analyze Requirements

Understand what needs to be done:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

### Step 2: Create Plan File

Generate a plan file describing all changes:

\`\`\`bash
python scripts/create_plan.py [inputs] > plan.json
\`\`\`

Plan file format:
\`\`\`json
{
  "changes": [
    {
      "type": "action-type",
      "target": "what to change",
      "value": "new value",
      "reason": "why this change"
    }
  ]
}
\`\`\`

### Step 3: Validate Plan

**Critical:** Validate before executing

\`\`\`bash
python scripts/validate_plan.py plan.json
\`\`\`

Validation checks:
- [Check 1]
- [Check 2]
- [Check 3]

### Step 4: Fix Validation Errors

If validation fails:

1. Read error messages carefully
2. Edit plan.json to fix issues
3. Run validation again
4. **Do not proceed until validation passes**

Common validation errors:

**[Error Type 1]:**
```
Error: [message]
```
**Fix:** [How to resolve]

**[Error Type 2]:**
```
Error: [message]
```
**Fix:** [How to resolve]

### Step 5: Execute Validated Plan

Only execute after validation passes:

\`\`\`bash
python scripts/execute_plan.py plan.json
\`\`\`

This applies all changes from the validated plan.

### Step 6: Verify Results

Confirm changes were applied correctly:
- [Verification step 1]
- [Verification step 2]
- [Verification step 3]

## Why This Pattern

The plan-validate-execute pattern:
- Catches errors before applying changes
- Provides machine-verifiable validation
- Allows iteration on plan without touching originals
- Gives specific error messages for debugging

## Example

[Complete example showing full workflow from requirements through verification]
```

**Example use cases:** Batch updates, database migrations, configuration changes, bulk file operations

## Pattern Combinations

Skills can combine multiple patterns:

**Analysis + Validation:**
```
skill-name/
├── SKILL.md
├── analysis-guide.md
└── scripts/
    └── validate.py
```

**Generation + Examples:**
```
skill-name/
├── SKILL.md
├── examples.md
└── templates/
    ├── template-1.md
    └── template-2.md
```

**Workflow + Scripts:**
```
skill-name/
├── SKILL.md
├── workflows.md
└── scripts/
    ├── step1.py
    ├── step2.py
    └── validate.py
```

## Choosing the Right Pattern

1. **Start simple**: Use basic-skill unless you have a specific need
2. **Add structure as needed**: Upgrade to workflow if multi-step
3. **Use scripts for reliability**: Add scripts for error-prone operations
4. **Apply validation for high-stakes**: Use validation pattern for critical operations
5. **Organize by domain**: Use multi-file for multiple subject areas

Most skills start as basic-skill and evolve based on usage and requirements.
