# Skill Structure Technical Specification

Technical requirements for Claude Code skills.

## YAML Frontmatter

### Required Format

```yaml
---
name: skill-name
description: Brief description with triggers
---
```

###name Field

**Requirements:**
- Lowercase letters, numbers, hyphens only
- Maximum 64 characters
- No XML tags
- No reserved words: "anthropic", "claude"

**Naming conventions:**
- Preferred: Gerund form (`processing-pdfs`, `analyzing-data`)
- Acceptable: Noun phrases (`pdf-processing`, `data-analysis`)
- Acceptable: Action-oriented (`process-pdfs`, `analyze-data`)

**Examples:**
```yaml
✓ name: processing-pdfs
✓ name: analyzing-spreadsheets
✓ name: managing-databases
✗ name: PDF_Processing        # Uppercase
✗ name: helper                 # Too vague
✗ name: claude-tool            # Reserved word
```

### description Field

**Requirements:**
- Non-empty, maximum 1024 characters
- No XML tags
- **Third person only** (injected into system prompt)
- Include WHAT and WHEN

**Examples:**
```yaml
✓ description: Extracts text from PDFs, fills forms. Use when working with PDF files.
✗ description: I can help with documents  # First person
✗ description: Helps with files          # Too vague, no triggers
```

### allowed-tools Field (Optional)

Restrict tool access:

```yaml
---
name: code-analyzer
description: Analyzes code without modifications
allowed-tools: Read, Grep, Glob
---
```

## Directory Structure

### Single-File Skill

```
skill-name/
└── SKILL.md
```

For simple skills under 500 lines.

### Multi-File Skill

```
skill-name/
├── SKILL.md              # Main instructions
├── reference.md          # Detailed reference
├── examples.md           # Usage examples
└── scripts/
    ├── validate.py       # Utility scripts
    └── process.py
```

For skills with extensive content or multiple domains.

## File Path Requirements

### Always Use Forward Slashes

```markdown
✓ See [FORMS.md](FORMS.md)
✓ python scripts/validate.py

✗ See [FORMS.md](FORMS.md)
✗ python scripts\validate.py
```

### Keep References One Level Deep

```markdown
✓ SKILL.md → advanced.md
✓ SKILL.md → reference.md

✗ SKILL.md → advanced.md → details.md
```

## Storage Locations

### Project Skills

```
project-directory/
├── .claude/
│   └── skills/
│       └── skill-name/
│           └── SKILL.md
```

Shared with team via git.

### Personal Skills

```
~/.claude/skills/
└── skill-name/
    └── SKILL.md
```

Available across all projects for current user.

## Content Guidelines

### SKILL.md Length

- **Target**: Under 500 lines
- **Method**: Use progressive disclosure for longer content
- Add table of contents if >100 lines

### Supporting Files

- Name descriptively (`api-reference.md`, not `doc2.md`)
- Add TOC if >100 lines
- Reference directly from SKILL.md

## Complete Example

```markdown
---
name: pdf-processing
description: Extracts text and tables from PDF files, fills forms, merges documents. Use when working with PDF files or when user mentions PDFs, forms, or document extraction.
allowed-tools: Read, Write, Bash
---

# PDF Processing

## Overview
Comprehensive PDF processing capabilities.

## Quick Start

Extract text:

\`\`\`python
import pdfplumber
with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`

## Advanced Features

**Form filling**: See [FORMS.md](FORMS.md)
**API reference**: See [REFERENCE.md](REFERENCE.md)
**Examples**: See [EXAMPLES.md](EXAMPLES.md)
```

## Validation Checklist

- [ ] YAML frontmatter properly formatted
- [ ] `name`: lowercase, hyphens, ≤64 chars
- [ ] `name`: no reserved words
- [ ] `description`: third person, ≤1024 chars
- [ ] `description`: includes what and when
- [ ] Forward slashes in all paths
- [ ] References one level deep
- [ ] SKILL.md under 500 lines (recommended)
- [ ] Long files have TOC

## Tools

Validate your skill:

```bash
npm run validate path/to/skill
```

Checks all technical requirements automatically.
