---
name: skill-builder
description: Generates well-structured Claude Code skills following best practices. Use when the user asks to create, build, or generate a skill, or describes a capability they want to package as a skill.
---

# Skill Builder

Generates high-quality Claude Code skills that follow best practices and technical requirements.

## When to Use

Activate this skill when the user:
- Asks to "create a skill for [purpose]"
- Describes a capability they want to package
- Requests help building or generating a skill
- Wants to formalize a workflow as a reusable skill

## Generation Process

1. **Understand the requirement**: Ask clarifying questions if needed
2. **Choose the pattern**: Select appropriate template based on use case
3. **Generate SKILL.md**: Create compliant frontmatter and body
4. **Add supporting files**: Include additional files if needed for progressive disclosure
5. **Validate**: Ensure all requirements are met

## Core Principles

### Be Concise
Claude is already smart. Only provide information Claude doesn't have:
- Avoid explaining what PDFs are, how libraries work, or basic programming concepts
- Remove unnecessary explanations and verbose descriptions
- Challenge every sentence: "Does Claude really need this?"
- Keep SKILL.md body under 500 lines

**Example - Good (concise):**
```markdown
Use pdfplumber for text extraction:
\`\`\`python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`
```

**Example - Bad (verbose):**
```markdown
PDF files are a common format containing text and images. To extract text, you'll need a library. We recommend pdfplumber because it's easy to use. First install it with pip...
```

### Set Appropriate Degrees of Freedom

Match specificity to task fragility:

**High freedom** (text instructions): When multiple approaches work
```markdown
1. Analyze code structure
2. Check for potential bugs
3. Suggest improvements for readability
```

**Medium freedom** (pseudocode/scripts with parameters): When a pattern exists but variation acceptable
```python
def generate_report(data, format="markdown", include_charts=True):
    # Process data and generate output
```

**Low freedom** (exact scripts): When operations are fragile or consistency critical
```bash
python scripts/migrate.py --verify --backup
# Do not modify this command
```

### Progressive Disclosure

Structure content for on-demand loading:

**SKILL.md** = Table of contents pointing to details
**Supporting files** = Loaded only when needed

Keep SKILL.md focused, move details to separate files:

```markdown
## Quick start
[Basic instructions here]

## Advanced Features
**Form filling**: See [FORMS.md](FORMS.md)
**API reference**: See [REFERENCE.md](REFERENCE.md)
**Examples**: See [EXAMPLES.md](EXAMPLES.md)
```

### Use Workflows for Complex Tasks

Break multi-step operations into clear sequences with checkboxes:

```markdown
Copy this checklist and track progress:

\`\`\`
Task Progress:
- [ ] Step 1: Analyze the form (run analyze_form.py)
- [ ] Step 2: Create field mapping (edit fields.json)
- [ ] Step 3: Validate mapping (run validate_fields.py)
- [ ] Step 4: Fill the form (run fill_form.py)
- [ ] Step 5: Verify output (run verify_output.py)
\`\`\`
```

### Implement Feedback Loops

For quality-critical work, use validate-fix-repeat pattern:

```markdown
1. Make your edits
2. **Validate immediately**: `python scripts/validate.py`
3. If validation fails:
   - Review error messages
   - Fix issues
   - Run validation again
4. **Only proceed when validation passes**
5. Continue with next step
```

## Technical Requirements

### YAML Frontmatter

Required fields with strict validation:

```yaml
---
name: skill-name-here
description: What this skill does and when to use it
---
```

**name field:**
- Lowercase letters, numbers, hyphens only
- Maximum 64 characters
- No XML tags
- No reserved words: "anthropic", "claude"
- Prefer gerund form: `processing-pdfs`, `analyzing-data`, `testing-code`

**description field:**
- Non-empty, maximum 1024 characters
- No XML tags
- **Write in third person** (injected into system prompt)
- Include what it does AND when to use it
- Include trigger keywords

**Good description:**
```yaml
description: Extracts text and tables from PDF files, fills forms, merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

**Bad description:**
```yaml
description: Helps with documents  # Too vague, no triggers
```

### Optional: allowed-tools

Restrict tool access for read-only or security-sensitive operations:

```yaml
---
name: code-analyzer
description: Analyzes code without modifications
allowed-tools: Read, Grep, Glob
---
```

### File Organization

**Single file skill:**
```
skill-name/
└── SKILL.md
```

**Multi-file skill:**
```
skill-name/
├── SKILL.md              # Overview and navigation
├── reference.md          # Detailed reference (loaded as needed)
├── examples.md           # Usage examples
└── scripts/
    ├── validate.py       # Utility scripts
    └── process.py
```

**Important:**
- Use forward slashes in paths (not backslashes)
- Keep references one level deep from SKILL.md
- Name files descriptively
- Add table of contents to files >100 lines

## Common Patterns

### Template Pattern

For structured output:

```markdown
## Report Structure

Use this template:

\`\`\`markdown
# [Analysis Title]

## Executive Summary
[One-paragraph overview]

## Key Findings
- Finding 1 with data
- Finding 2 with data

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
fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently across report generation
\`\`\`
```

### Conditional Workflow Pattern

Guide through decision points:

```markdown
## Workflow

1. Determine the modification type:
   **Creating new content?** → Follow "Creation workflow"
   **Editing existing?** → Follow "Editing workflow"

2. Creation workflow:
   - Use library X
   - Build from scratch
   - Export to format

3. Editing workflow:
   - Load existing file
   - Modify content
   - Validate changes
   - Save when complete
```

## What to Avoid

### Anti-patterns
- Windows-style paths (`scripts\helper.py`) - use forward slashes
- Too many options - provide defaults with escape hatches
- Time-sensitive information - use "old patterns" sections instead
- Inconsistent terminology - pick one term and stick with it
- Deeply nested references - keep files one level from SKILL.md
- Assuming tools are installed - document dependencies explicitly
- Writing in first/second person in descriptions - use third person

### Security
- Document any external dependencies clearly
- Be cautious with code that fetches external content
- Validate inputs when using executable scripts
- Don't include sensitive data in examples

## Skill Templates Reference

Choose the appropriate template:

- **basic-skill**: Simple instructions, no supporting files
- **analysis-skill**: Analyzing code/data with validation
- **generation-skill**: Creating content/code with examples
- **workflow-skill**: Multi-step process with checkboxes
- **tool-restricted-skill**: Read-only operations
- **multi-file-skill**: Progressive disclosure with references
- **script-based-skill**: Includes utility scripts
- **validation-skill**: Plan-validate-execute pattern

See [patterns.md](patterns.md) for detailed template specifications.

## Output Format

When generating a skill, create:

1. Directory structure
2. SKILL.md with proper frontmatter and body
3. Supporting files if needed
4. Brief explanation of design decisions

Ask user where to save the skill:
- Project-specific: `.claude/skills/[skill-name]/`
- Personal: `~/.claude/skills/[skill-name]/`

## Validation Checklist

Before finalizing, verify:
- [ ] Name is lowercase, hyphens only, max 64 chars
- [ ] Description is specific with trigger keywords, max 1024 chars
- [ ] Description written in third person
- [ ] SKILL.md body under 500 lines
- [ ] Forward slashes in all file paths
- [ ] References one level deep from SKILL.md
- [ ] Consistent terminology throughout
- [ ] Concise (no over-explaining)
- [ ] Appropriate degree of freedom for use case
- [ ] Workflows have clear steps if multi-step
- [ ] Examples are concrete if pattern-based
- [ ] No time-sensitive information
- [ ] No Windows-style paths
- [ ] No reserved words in name

## Further Reading

- **[best-practices.md](best-practices.md)**: Deep dive on principles
- **[structure-reference.md](structure-reference.md)**: Technical specifications
- **[patterns.md](patterns.md)**: Detailed pattern library
- **[validation-rules.md](validation-rules.md)**: Complete validation requirements
- **[EVALUATIONS.md](EVALUATIONS.md)**: Testing guide and evaluation test cases
