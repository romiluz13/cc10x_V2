# Best Practices for Skill Authoring

## Contents
- [The Conciseness Principle](#the-conciseness-principle)
- [Degrees of Freedom](#degrees-of-freedom)
- [Progressive Disclosure](#progressive-disclosure)
- [Workflows and Feedback Loops](#workflows-and-feedback-loops)
- [Content Guidelines](#content-guidelines)
- [Common Patterns](#common-patterns)
- [Evaluation and Iteration](#evaluation-and-iteration)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Skills with Executable Code](#skills-with-executable-code)

---

## The Conciseness Principle

The context window is shared across all Claude's knowledge. Every token in your skill competes with conversation history and other context.

### Default Assumption: Claude is Smart

Only add what Claude doesn't already know:
- Skip explanations of common formats (PDF, JSON, CSV)
- Don't explain how libraries or package managers work
- Assume knowledge of programming concepts
- Trust Claude to understand domain-general information

### Challenge Every Token

Ask yourself:
- "Does Claude really need this explanation?"
- "Can I assume Claude knows this?"
- "Does this paragraph justify its token cost?"

### Examples

**Good - Concise (50 tokens):**
```markdown
## Extract PDF Text

Use pdfplumber:

\`\`\`python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`
```

**Bad - Verbose (150 tokens):**
```markdown
## Extract PDF Text

PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available for PDF processing, but we
recommend pdfplumber because it's easy to use and handles most cases well.
First, you'll need to install it using pip...
```

## Degrees of Freedom

Match your specificity to the task's fragility and variability.

### High Freedom: Text-Based Instructions

**When to use:**
- Multiple valid approaches exist
- Decisions depend on context
- Heuristics guide the approach

**Example:**
```markdown
## Code Review Process

1. Analyze code structure and organization
2. Check for potential bugs or edge cases
3. Suggest improvements for readability
4. Verify adherence to project conventions
```

### Medium Freedom: Pseudocode or Parameterized Scripts

**When to use:**
- A preferred pattern exists
- Some variation is acceptable
- Configuration affects behavior

**Example:**
```markdown
## Generate Report

Use this template and customize:

\`\`\`python
def generate_report(data, format="markdown", include_charts=True):
    # Process data
    # Generate output in specified format
    # Optionally include visualizations
\`\`\`
```

### Low Freedom: Specific Scripts

**When to use:**
- Operations are fragile and error-prone
- Consistency is critical
- A specific sequence must be followed

**Example:**
```markdown
## Database Migration

Run exactly this script:

\`\`\`bash
python scripts/migrate.py --verify --backup
\`\`\`

Do not modify the command or add flags.
```

### The Bridge Analogy

Think of Claude navigating a path:
- **Narrow bridge with cliffs**: Only one safe way forward → Use low freedom with exact instructions
- **Open field, no hazards**: Many paths work → Use high freedom with general guidance

## Progressive Disclosure

SKILL.md is a table of contents, not an encyclopedia. Point to details, don't embed them.

### Three Levels of Loading

**Level 1: Metadata (always loaded)**
```yaml
---
name: pdf-processing
description: Extract text from PDFs, fill forms, merge documents
---
```
~100 tokens, loaded at startup in system prompt.

**Level 2: Instructions (loaded when triggered)**
Main SKILL.md body with core instructions. Loaded when skill activates.

**Level 3: Resources (loaded as needed)**
Separate files like FORMS.md, REFERENCE.md, or scripts. Loaded only when referenced.

### Pattern: High-Level Guide with References

```markdown
## Quick Start
[Basic instructions inline]

## Advanced Features
**Form filling**: See [FORMS.md](FORMS.md)
**API reference**: See [REFERENCE.md](REFERENCE.md)
**Examples**: See [EXAMPLES.md](EXAMPLES.md)
```

### Pattern: Domain Organization

For skills spanning multiple domains:

```
bigquery-skill/
├── SKILL.md
└── reference/
    ├── finance.md      # Revenue, billing metrics
    ├── sales.md        # Opportunities, pipeline
    ├── product.md      # API usage, features
    └── marketing.md    # Campaigns, attribution
```

Claude reads only relevant domain files for each query.

### Pattern: Conditional Details

```markdown
## Creating Documents

Use docx-js. See [DOCX-JS.md](DOCX-JS.md).

## Editing Documents

For simple edits, modify XML directly.

**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

### Keep References One Level Deep

**Bad - Too nested:**
```markdown
# SKILL.md → advanced.md → details.md → actual information
```

**Good - One level:**
```markdown
# SKILL.md
**Basic**: [inline]
**Advanced**: See [advanced.md](advanced.md)
**API Reference**: See [reference.md](reference.md)
**Examples**: See [examples.md](examples.md)
```

### Add Table of Contents for Long Files

For files >100 lines:

```markdown
# API Reference

## Contents
- Authentication and setup
- Core methods (CRUD operations)
- Advanced features (batch, webhooks)
- Error handling patterns
- Code examples

## Authentication and Setup
...
```

## Workflows and Feedback Loops

### Multi-Step Workflows with Checkboxes

Provide copy-able checklists:

```markdown
## Research Synthesis Workflow

Copy this checklist:

\`\`\`
Research Progress:
- [ ] Step 1: Read all source documents
- [ ] Step 2: Identify key themes
- [ ] Step 3: Cross-reference claims
- [ ] Step 4: Create structured summary
- [ ] Step 5: Verify citations
\`\`\`

**Step 1: Read all source documents**
Review each document in sources/. Note main arguments and evidence.

**Step 2: Identify key themes**
Look for patterns across sources. Where do sources agree/disagree?
[...]
```

### Feedback Loops

**Pattern: Validate → Fix → Repeat**

```markdown
## Document Editing Process

1. Make edits to \`word/document.xml\`
2. **Validate immediately**: \`python validate.py unpacked_dir/\`
3. If validation fails:
   - Review error message
   - Fix issues in XML
   - Run validation again
4. **Only proceed when validation passes**
5. Rebuild: \`python pack.py unpacked_dir/ output.docx\`
6. Test output document
```

This catches errors early and improves quality.

## Content Guidelines

### Avoid Time-Sensitive Information

**Bad:**
```markdown
If you're doing this before August 2025, use the old API.
```

**Good:**
```markdown
## Current Method
Use v2 API: \`api.example.com/v2/messages\`

## Old Patterns
<details>
<summary>Legacy v1 API (deprecated 2025-08)</summary>
The v1 API used: \`api.example.com/v1/messages\`
This endpoint is no longer supported.
</details>
```

### Use Consistent Terminology

Pick one term and stick with it:

**Good:**
- Always "API endpoint"
- Always "field"
- Always "extract"

**Bad:**
- Mix "API endpoint", "URL", "API route", "path"
- Mix "field", "box", "element", "control"

## Common Patterns

### Template Pattern

Provide structure for output:

**Strict requirements:**
```markdown
## Report Structure

ALWAYS use this exact template:

\`\`\`markdown
# [Title]

## Executive Summary
[One paragraph]

## Key Findings
- Finding 1 with data
- Finding 2 with data

## Recommendations
1. Actionable recommendation
2. Actionable recommendation
\`\`\`
```

**Flexible guidance:**
```markdown
## Report Structure

Default format (adapt as needed):
[same template]

Adjust sections based on analysis type.
```

### Examples Pattern

Show input/output pairs:

```markdown
## Commit Messages

**Example 1:**
Input: Added JWT authentication
Output:
\`\`\`
feat(auth): implement JWT-based authentication

Add login endpoint and token validation
\`\`\`

**Example 2:**
Input: Fixed date bug in reports
Output:
\`\`\`
fix(reports): correct date formatting

Use UTC timestamps consistently
\`\`\`

Follow this style: type(scope): brief description, then details.
```

### Conditional Workflow Pattern

Guide through decision points:

```markdown
## Document Modification

1. Determine type:
   **Creating new?** → Creation workflow
   **Editing existing?** → Editing workflow

2. Creation workflow:
   - Use docx-js
   - Build from scratch
   - Export to .docx

3. Editing workflow:
   - Unpack document
   - Modify XML
   - Validate changes
   - Repack when complete
```

## Evaluation and Iteration

### Build Evaluations First

Create evaluations BEFORE extensive documentation:

1. **Identify gaps**: Run Claude without skill, document failures
2. **Create evaluations**: Build 3 scenarios testing gaps
3. **Establish baseline**: Measure performance without skill
4. **Write minimal instructions**: Just enough to pass evaluations
5. **Iterate**: Execute, compare, refine

### Develop Iteratively with Claude

Use Claude to help create skills:

1. Complete a task with Claude, noting context you provide
2. Identify reusable patterns
3. Ask Claude to create a skill capturing that pattern
4. Review for conciseness
5. Improve information architecture
6. Test on similar tasks
7. Iterate based on observations

### Observe Navigation Patterns

Watch how Claude uses your skill:
- Does it read files in unexpected order?
- Does it miss important references?
- Does it repeatedly read the same file?
- Does it ignore bundled content?

Iterate based on actual behavior, not assumptions.

## Anti-Patterns to Avoid

- **Windows paths**: Use forward slashes, not backslashes
- **Too many options**: Provide defaults with escape hatches
- **Offering multiple tools**: Pick one recommended approach
- **Deep nesting**: Keep references one level from SKILL.md
- **Assuming installed tools**: Document dependencies
- **Time-sensitive info**: Use old patterns sections
- **Inconsistent terms**: Choose one term per concept
- **Over-explaining**: Trust Claude's intelligence
- **First/second person**: Always use third person in descriptions

## Skills with Executable Code

### Solve, Don't Punt

Handle errors explicitly:

**Good:**
```python
def process_file(path):
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"File {path} not found, creating default")
        with open(path, 'w') as f:
            f.write('')
        return ''
```

**Bad:**
```python
def process_file(path):
    return open(path).read()  # Punt to Claude if fails
```

### Provide Utility Scripts

Benefits:
- More reliable than generated code
- Save tokens (no code in context)
- Save time (no generation)
- Ensure consistency

**Make execution intent clear:**
- "Run \`analyze_form.py\` to extract fields" (execute)
- "See \`analyze_form.py\` for extraction algorithm" (reference)

### Verifiable Intermediate Outputs

Use plan-validate-execute pattern:

1. Create plan file (e.g., changes.json)
2. Validate plan with script
3. If valid, execute plan
4. Verify results

Catches errors before applying changes.

### Runtime Environment

Skills run in code execution container:
- **No network access**: Cannot call external APIs
- **No runtime installation**: Only pre-installed packages
- **Filesystem access**: Can read/write files
- **Bash execution**: Can run commands and scripts

Use forward slashes in paths. Scripts execute without loading into context.
