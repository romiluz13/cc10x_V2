# Skill Authoring Best Practices

Complete guide to writing effective Claude Code skills.

## Table of Contents

- [Core Principles](#core-principles)
- [Writing Descriptions](#writing-descriptions)
- [Structuring Content](#structuring-content)
- [Progressive Disclosure](#progressive-disclosure)
- [Workflows and Processes](#workflows-and-processes)
- [Common Patterns](#common-patterns)
- [Anti-Patterns](#anti-patterns)
- [Testing and Iteration](#testing-and-iteration)

## Core Principles

### 1. Conciseness is Key

The context window is shared. Every token competes with conversation history and other context.

**Default assumption: Claude is already very smart**

Only add what Claude doesn't know:
- ✗ Don't explain what PDFs, JSON, or CSV files are
- ✗ Don't explain how pip or npm work
- ✗ Don't describe basic programming concepts
- ✓ Do provide specific commands and patterns
- ✓ Do document domain-specific conventions
- ✓ Do include configuration values with rationale

**Example: Concise vs Verbose**

Bad (150 tokens):
```markdown
PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available for PDF processing, but we
recommend pdfplumber because it's easy to use and handles most cases well.
First, you'll need to install it using pip. Then you can use the code below...
```

Good (50 tokens):
```markdown
Extract PDF text with pdfplumber:

\`\`\`python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`
```

**Challenge every token:**
1. "What happens if I remove this sentence?"
2. "Does this add information Claude wouldn't have?"
3. "Could I show this with code instead of prose?"

### 2. Set Appropriate Degrees of Freedom

Match your specificity to the task's fragility.

**High Freedom: Text Instructions**

Use when multiple approaches are valid:

```markdown
## Code Review Process

1. Analyze code structure and organization
2. Check for potential bugs or edge cases
3. Suggest improvements for readability
4. Verify adherence to project conventions
```

Claude can adapt based on context.

**Medium Freedom: Pseudocode or Parameterized Scripts**

Use when a preferred pattern exists:

```markdown
## Generate Report

\`\`\`python
def generate_report(data, format="markdown", include_charts=True):
    # Process data
    # Generate output in specified format
    # Optionally include visualizations
\`\`\`
```

Provides structure but allows customization.

**Low Freedom: Exact Scripts**

Use when operations are fragile:

```markdown
## Database Migration

Run exactly this command:

\`\`\`bash
python scripts/migrate.py --verify --backup
\`\`\`

Do not modify the command or add flags.
```

**Choosing the Right Level:**

Think of Claude navigating a path:
- **Narrow bridge with cliffs**: One safe way → Low freedom, exact instructions
- **Open field, no hazards**: Many paths → High freedom, general guidance

### 3. Test with Multiple Models

Skills effectiveness depends on the underlying model.

**Testing checklist:**
- [ ] Test with Haiku (fast, economical)
- [ ] Test with Sonnet (balanced)
- [ ] Test with Opus (powerful reasoning)

What works for Opus might need more detail for Haiku.

### 4. Use Consistent Terminology

Pick one term per concept and stick with it throughout.

**Good - Consistent:**
- Always "API endpoint"
- Always "field"
- Always "extract"

**Bad - Inconsistent:**
- Mix "API endpoint", "URL", "API route", "path"
- Mix "field", "box", "element", "control"
- Mix "extract", "pull", "get", "retrieve"

## Writing Descriptions

The `description` field enables skill discovery. It's critical for Claude to find the right skill.

### Requirements

```yaml
description: What it does and when to use it. Use when [triggers].
```

**Technical:**
- Maximum 1024 characters
- No XML tags
- **Always third person** (injected into system prompt)

**Content:**
- Describe WHAT the skill does
- Describe WHEN to use it
- Include trigger keywords

### Good Descriptions

```yaml
description: Extracts text and tables from PDF files, fills forms, merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

Why it's good:
- Lists capabilities (extract, fill, merge)
- Mentions trigger keywords (PDF, forms, extraction)
- Clear when-to-use clause

```yaml
description: Analyzes Excel spreadsheets, creates pivot tables, generates charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.
```

Why it's good:
- Specific operations (analyze, pivot, charts)
- Multiple trigger keywords (Excel, spreadsheets, .xlsx)
- Clear domain (tabular data)

### Bad Descriptions

```yaml
description: Helps with documents
```
Too vague, no specific triggers.

```yaml
description: I can help you process Excel files
```
First person (should be third person).

```yaml
description: You can use this to analyze data
```
Second person (should be third person).

### Description Checklist

- [ ] Third person point of view
- [ ] Describes what the skill does
- [ ] Describes when to use it
- [ ] Includes specific trigger keywords
- [ ] Under 1024 characters
- [ ] No XML tags

## Structuring Content

### SKILL.md as Table of Contents

SKILL.md should guide Claude to detailed content, not contain all of it.

**Pattern:**
```markdown
## Quick Start
[Most common 80% use case inline]

## Advanced Features
**[Feature 1]**: See [feature1.md](feature1.md)
**[Feature 2]**: See [feature2.md](feature2.md)

## Examples
See [examples.md](examples.md) for complete examples.
```

### Keep SKILL.md Under 500 Lines

**Why:** Optimal performance and context efficiency

**How:**
- Move detailed reference to separate files
- Use progressive disclosure
- Link to examples rather than embedding all
- Push domain-specific content to domain files

**Before (800 lines):**
```
SKILL.md contains:
- Overview (50 lines)
- Complete API reference (400 lines)
- All examples (250 lines)
- Advanced features (100 lines)
```

**After (200 lines):**
```
SKILL.md contains:
- Overview (50 lines)
- Core API methods (50 lines)
- Links to:
  - API-REFERENCE.md (detailed API)
  - EXAMPLES.md (all examples)
  - ADVANCED.md (advanced topics)
```

### File Organization

**Single-file skill:**
```
skill-name/
└── SKILL.md
```
Use for simple skills <500 lines.

**Multi-file skill:**
```
skill-name/
├── SKILL.md
├── reference.md
├── examples.md
└── scripts/
    └── validate.py
```
Use when SKILL.md approaches 500 lines.

**Domain-organized skill:**
```
skill-name/
├── SKILL.md
└── reference/
    ├── domain-1.md
    ├── domain-2.md
    └── domain-3.md
```
Use for multi-domain capabilities.

### Keep References One Level Deep

**Bad - Too nested:**
```markdown
# SKILL.md links to advanced.md
# advanced.md links to details.md
# details.md contains actual info
```

Claude may partially read nested files.

**Good - One level:**
```markdown
# SKILL.md links to:
- advanced.md (complete info)
- reference.md (complete info)
- examples.md (complete info)
```

All referenced files are directly linked from SKILL.md.

### Table of Contents for Long Files

For files >100 lines, add TOC:

```markdown
# API Reference

## Contents
- [Authentication](#authentication)
- [Core Methods](#core-methods)
- [Advanced Features](#advanced-features)
- [Error Handling](#error-handling)

## Authentication
...
```

Helps Claude understand scope even when previewing.

## Progressive Disclosure

Load content in stages as needed.

### Three Levels of Loading

**Level 1: Metadata (always loaded)**

```yaml
---
name: pdf-processing
description: Extract text from PDFs, fill forms, merge documents
---
```

Loaded at startup in system prompt (~100 tokens).

**Level 2: Instructions (loaded when triggered)**

Main SKILL.md body. Loaded when skill activates.

**Level 3: Resources (loaded as needed)**

Separate files, loaded only when referenced:
- reference.md
- examples.md
- scripts/validate.py

### Progressive Disclosure Patterns

**Pattern 1: High-level guide with references**

```markdown
## Quick Start
[Basic instructions inline]

## Advanced
**Form filling**: See [FORMS.md](FORMS.md)
**API reference**: See [REFERENCE.md](REFERENCE.md)
```

**Pattern 2: Domain organization**

```markdown
## Department-Specific Guides
**Finance**: See [reference/finance.md](reference/finance.md)
**Sales**: See [reference/sales.md](reference/sales.md)
**Marketing**: See [reference/marketing.md](reference/marketing.md)
```

Claude reads only the relevant domain file.

**Pattern 3: Conditional details**

```markdown
## Creating Documents
Use docx-js. See [DOCX-JS.md](DOCX-JS.md).

## Editing Documents
For simple edits, modify XML directly.

**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

Advanced files loaded only if needed.

## Workflows and Processes

### Multi-Step Workflows

Provide copy-able checklists for tracking:

```markdown
## Workflow

Copy this checklist:

\`\`\`
Progress:
- [ ] Step 1: Analyze requirements
- [ ] Step 2: Create plan
- [ ] Step 3: Validate plan
- [ ] Step 4: Execute plan
- [ ] Step 5: Verify results
\`\`\`

### Step 1: Analyze Requirements

**What to do:**
[Detailed instructions]

**Expected outcome:**
[What you should see]

### Step 2: Create Plan

[Detailed instructions for this step]
```

Benefits:
- Tracks progress visibly
- Prevents skipped steps
- Clear what's complete vs pending

### Feedback Loops

**Pattern: Validate → Fix → Repeat**

```markdown
## Document Editing Process

1. Make your edits to \`document.xml\`
2. **Validate immediately**: \`python validate.py document.xml\`
3. If validation fails:
   - Review error message carefully
   - Fix the issues
   - Run validation again
4. **Only proceed when validation passes**
5. Rebuild document
6. Test output
```

This pattern greatly improves quality by catching errors early.

## Common Patterns

### Template Pattern

Provide structure for consistent output:

```markdown
## Report Structure

ALWAYS use this template:

\`\`\`markdown
# [Analysis Title]

## Executive Summary
[One-paragraph overview]

## Key Findings
- Finding 1 with supporting data
- Finding 2 with supporting data

## Recommendations
1. Specific actionable recommendation
2. Specific actionable recommendation
\`\`\`
```

### Examples Pattern

Show input/output pairs:

```markdown
## Commit Message Format

**Example 1:**
Input: Added user authentication with JWT tokens
Output:
\`\`\`
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
\`\`\`

**Example 2:**
Input: Fixed bug where dates displayed incorrectly
Output:
\`\`\`
fix(reports): correct date formatting

Use UTC timestamps consistently
\`\`\`
```

Examples show desired style better than descriptions.

### Conditional Workflow Pattern

Guide through decision points:

```markdown
## Document Modification

1. Determine the type:
   **Creating new content?** → Creation workflow
   **Editing existing content?** → Editing workflow

2. Creation workflow:
   - Use docx-js library
   - Build document from scratch
   - Export to .docx format

3. Editing workflow:
   - Unpack existing document
   - Modify XML directly
   - Validate after changes
   - Repack when complete
```

## Anti-Patterns

### Windows-Style Paths

❌ Don't use:
```markdown
scripts\helper.py
reference\guide.md
```

✓ Always use:
```markdown
scripts/helper.py
reference/guide.md
```

Unix-style paths work everywhere. Windows-style fail on Unix.

### Too Many Options

❌ Don't offer:
```markdown
You can use pypdf, or pdfplumber, or PyMuPDF, or pdf2image...
```

✓ Provide default:
```markdown
Use pdfplumber for text extraction:
\`\`\`python
import pdfplumber
\`\`\`

For scanned PDFs requiring OCR, use pytesseract instead.
```

### Time-Sensitive Information

❌ Avoid:
```markdown
If you're doing this before August 2025, use the old API.
```

✓ Use "old patterns":
```markdown
## Current Method
Use v2 API: \`api.example.com/v2/messages\`

## Old Patterns
<details>
<summary>Legacy v1 API (deprecated 2025-08)</summary>
Use: \`api.example.com/v1/messages\`
No longer supported.
</details>
```

### Deeply Nested References

❌ Don't create:
```
SKILL.md → advanced.md → details.md → actual info
```

✓ Keep one level:
```
SKILL.md → advanced.md (complete info)
SKILL.md → details.md (complete info)
```

## Testing and Iteration

### Build Evaluations First

Create evaluations BEFORE extensive documentation:

1. Run Claude without skill, document failures
2. Create 3 evaluation scenarios
3. Establish baseline performance
4. Write minimal instructions to pass evaluations
5. Iterate and expand

This ensures you solve real problems, not imagined ones.

### Develop Iteratively with Claude

Use Claude to help create skills:

1. Complete a task with Claude, noting context you provide
2. Identify the reusable pattern
3. Ask Claude to create a skill capturing that pattern
4. Review for conciseness
5. Improve organization
6. Test on similar tasks
7. Iterate based on observations

### Observe How Claude Uses Your Skill

Watch for:
- Unexpected file reading order
- Missed connections between files
- Overreliance on certain sections
- Ignored content

Iterate based on actual behavior, not assumptions.

## Quick Reference Checklist

Before finalizing a skill:

### Required Fields
- [ ] Valid YAML frontmatter
- [ ] `name`: lowercase, hyphens, ≤64 chars
- [ ] `description`: third person, ≤1024 chars, with triggers

### Structure
- [ ] Forward slashes in all paths
- [ ] SKILL.md under 500 lines (or well-organized)
- [ ] References one level deep
- [ ] Files >100 lines have TOC

### Content Quality
- [ ] Concise (no over-explaining)
- [ ] Consistent terminology
- [ ] Concrete examples
- [ ] Clear workflows if multi-step
- [ ] No time-sensitive info

### Anti-Patterns Avoided
- [ ] No Windows paths
- [ ] No vague names
- [ ] No reserved words
- [ ] No deep nesting
- [ ] No first/second person in description

## Next Steps

1. Review [Skill Structure](skill-structure.md) for technical specs
2. Study [Progressive Disclosure](progressive-disclosure.md) for organization
3. Read [Workflows and Feedback](workflows-and-feedback.md) for processes
4. Check [Testing and Evaluation](testing-and-evaluation.md) for validation
5. Review [Security Considerations](security-considerations.md) for safety

Happy skill building!
