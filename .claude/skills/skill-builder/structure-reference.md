# Skill Structure Technical Reference

## YAML Frontmatter Specification

Every SKILL.md requires YAML frontmatter with specific fields and validation rules.

### Required Fields

```yaml
---
name: skill-name-here
description: Brief description of what this skill does and when to use it
---
```

### Field Specifications

#### name

**Requirements:**
- **Format**: Lowercase letters, numbers, and hyphens only
- **Length**: Maximum 64 characters
- **No XML tags**: Cannot contain `<`, `>`, or XML markup
- **No reserved words**: Cannot contain "anthropic" or "claude"

**Naming conventions (recommended):**
- **Gerund form** (preferred): `processing-pdfs`, `analyzing-data`, `testing-code`
- **Noun phrases** (acceptable): `pdf-processing`, `data-analysis`, `code-testing`
- **Action-oriented** (acceptable): `process-pdfs`, `analyze-data`, `test-code`

**Avoid:**
- Vague names: `helper`, `utils`, `tools`
- Overly generic: `documents`, `data`, `files`
- Reserved words: `anthropic-helper`, `claude-tools`

**Valid examples:**
```yaml
name: pdf-processing
name: analyzing-spreadsheets
name: managing-databases
name: testing-code
name: writing-documentation
```

**Invalid examples:**
```yaml
name: PDF_Processing           # Uppercase not allowed
name: analyze data             # Spaces not allowed
name: helper                   # Too vague
name: claude-pdf-tool          # Reserved word "claude"
name: this-is-a-very-long-skill-name-that-exceeds-the-maximum-length-limit  # >64 chars
```

#### description

**Requirements:**
- **Must be non-empty**
- **Length**: Maximum 1024 characters
- **No XML tags**: Cannot contain `<`, `>`, or XML markup
- **Point of view**: Must use third person (injected into system prompt)

**Content guidelines:**
- Include WHAT the skill does
- Include WHEN to use it
- Include trigger keywords that signal relevance
- Be specific, not vague

**Good descriptions:**
```yaml
description: Extracts text and tables from PDF files, fills forms, merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

description: Analyzes Excel spreadsheets, creates pivot tables, generates charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.

description: Generates descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.
```

**Bad descriptions:**
```yaml
description: Helps with documents  # Too vague, no triggers

description: I can help you process Excel files  # First person, not third

description: You can use this to analyze data  # Second person, not third

description: Processes data  # No specific triggers or details
```

### Optional Fields

#### allowed-tools

Restricts which tools Claude can access when this skill is active.

**Format:**
```yaml
---
name: code-analyzer
description: Analyzes code without making modifications
allowed-tools: Read, Grep, Glob
---
```

**Common tool restrictions:**

**Read-only operations:**
```yaml
allowed-tools: Read, Grep, Glob
```

**Analysis with execution:**
```yaml
allowed-tools: Read, Grep, Glob, Bash
```

**Full access (default if omitted):**
```yaml
# No allowed-tools field = all tools available
```

**Use cases:**
- Security-sensitive workflows where modifications shouldn't be made
- Analysis-only skills that just read and report
- Skills that should prevent accidental writes

## File Organization

### Single-File Skill

Simplest structure for straightforward capabilities:

```
skill-name/
└── SKILL.md
```

**When to use:**
- Instructions fit comfortably in <500 lines
- No additional reference materials needed
- Self-contained functionality

### Multi-File Skill

For skills requiring progressive disclosure:

```
skill-name/
├── SKILL.md              # Main instructions and navigation
├── reference.md          # Detailed API reference
├── examples.md           # Usage examples
├── advanced.md           # Advanced features
└── scripts/
    ├── validate.py       # Utility scripts
    ├── process.py
    └── helper.sh
```

**When to use:**
- SKILL.md approaching or exceeding 500 lines
- Multiple domains or feature areas
- Extensive reference materials
- Utility scripts for deterministic operations

### Domain-Organized Skill

For skills spanning multiple subject areas:

```
bigquery-skill/
├── SKILL.md              # Overview and navigation
└── reference/
    ├── finance.md        # Revenue, billing metrics
    ├── sales.md          # Opportunities, pipeline
    ├── product.md        # API usage, features
    └── marketing.md      # Campaigns, attribution
```

**When to use:**
- Skill covers multiple distinct domains
- Each domain has substantial content
- Users typically need only one domain per query

## File Path Requirements

### Always Use Forward Slashes

**Correct:**
```markdown
See [FORMS.md](FORMS.md)
See [reference/finance.md](reference/finance.md)
Run: python scripts/validate.py
```

**Incorrect:**
```markdown
See [FORMS.md](FORMS.md)             # Backslashes fail on Unix
Run: python scripts\validate.py        # Backslashes fail on Unix
```

Unix-style paths work on all platforms. Windows-style paths fail on Unix systems.

### Keep References One Level Deep

Claude may partially read deeply nested files, resulting in incomplete information.

**Good - One level from SKILL.md:**
```markdown
# SKILL.md

**Basic usage**: [instructions here]
**Advanced**: See [advanced.md](advanced.md)
**API Reference**: See [reference.md](reference.md)
**Examples**: See [examples.md](examples.md)
```

**Bad - Too deep:**
```markdown
# SKILL.md → advanced.md → details.md → actual info
```

### Descriptive File Names

Use names that clearly indicate content:

**Good:**
- `form_validation_rules.md`
- `api_reference.md`
- `sales_schema.md`
- `migration_workflow.md`

**Bad:**
- `doc1.md`
- `file2.md`
- `misc.md`
- `temp.md`

## Content Organization Guidelines

### SKILL.md Structure

```markdown
---
name: skill-name
description: What it does and when to use it
---

# Skill Name

## Overview
Brief introduction to the skill's purpose

## Quick Start
Immediately actionable instructions for common use case

## Core Features
Main capabilities with concise explanations

## Workflows
Step-by-step processes for complex tasks

## Reference
Links to detailed documentation

## Examples
Common usage patterns

## Advanced
Links to advanced features or edge cases
```

### Keep SKILL.md Under 500 Lines

**Why:** Optimal performance and context efficiency

**How:**
- Move detailed reference to separate files
- Use progressive disclosure patterns
- Link to examples rather than embedding all
- Push domain-specific content to domain files

**Example refactoring:**

**Before (800 lines in SKILL.md):**
```markdown
# SKILL.md (800 lines)

## Quick Start
[50 lines]

## Complete API Reference
[400 lines of API docs]

## All Examples
[250 lines of examples]

## Advanced Features
[100 lines of advanced topics]
```

**After (200 lines in SKILL.md, rest in separate files):**
```markdown
# SKILL.md (200 lines)

## Quick Start
[50 lines]

## Core API Methods
[50 lines of most common methods]

**Complete reference**: See [API-REFERENCE.md](API-REFERENCE.md)
**All examples**: See [EXAMPLES.md](EXAMPLES.md)
**Advanced features**: See [ADVANCED.md](ADVANCED.md)
```

### Table of Contents for Long Files

For any file >100 lines, add a table of contents:

```markdown
# API Reference

## Contents
- [Authentication and Setup](#authentication-and-setup)
- [Core Methods](#core-methods)
  - Create operations
  - Read operations
  - Update operations
  - Delete operations
- [Advanced Features](#advanced-features)
  - Batch operations
  - Webhooks
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)

## Authentication and Setup
...

## Core Methods
...
```

Helps Claude understand scope even when previewing with partial reads.

## Storage Locations

### Project Skills

```
project-directory/
├── .claude/
│   └── skills/
│       ├── skill-one/
│       │   └── SKILL.md
│       └── skill-two/
│           ├── SKILL.md
│           └── reference.md
└── [project files]
```

**Shared with team via git**. Anyone cloning the repository gets these skills.

### Personal Skills

```
~/.claude/skills/
├── skill-one/
│   └── SKILL.md
└── skill-two/
    ├── SKILL.md
    └── reference.md
```

**Available across all projects** for the current user only.

### Choosing Location

**Use project skills when:**
- Skill is specific to the project
- Team members should all have access
- Skill references project-specific patterns or conventions

**Use personal skills when:**
- Skill applies across multiple projects
- Skill reflects personal preferences or workflows
- Skill contains user-specific context

## YAML Validation Rules

### Syntax Requirements

**Valid:**
```yaml
---
name: pdf-processor
description: Processes PDF files for text extraction and analysis
---
```

**Invalid - No closing separator:**
```yaml
---
name: pdf-processor
description: Processes PDF files
# Missing closing ---
```

**Invalid - Tabs in frontmatter:**
```yaml
---
name: pdf-processor
	description: Processes PDF files  # Tab character not allowed
---
```

**Invalid - Improper indentation:**
```yaml
---
  name: pdf-processor
 description: Processes PDF files  # Inconsistent indentation
---
```

### Field Value Format

**Valid:**
```yaml
description: This is a description
description: "This is a description with special chars: colons"
description: |
  This is a multi-line
  description
```

**Invalid:**
```yaml
description: This: needs quotes  # Unquoted colon may break parsing
```

## Complete Valid Example

```markdown
---
name: pdf-processing
description: Extracts text and tables from PDF files, fills forms, and merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
allowed-tools: Read, Write, Bash
---

# PDF Processing

## Overview
This skill provides comprehensive PDF processing capabilities including text extraction, form filling, and document merging.

## Quick Start

Extract text with pdfplumber:

\`\`\`python
import pdfplumber
with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`

## Advanced Features

**Form filling**: See [FORMS.md](FORMS.md) for complete guide
**API reference**: See [REFERENCE.md](REFERENCE.md) for all methods
**Examples**: See [EXAMPLES.md](EXAMPLES.md) for common patterns

## Workflows

See [WORKFLOWS.md](WORKFLOWS.md) for multi-step processes.
```

## Validation Checklist

Before finalizing a skill, verify:

- [ ] YAML frontmatter opens and closes with `---`
- [ ] `name` field: lowercase, hyphens only, ≤64 chars
- [ ] `name` doesn't contain reserved words
- [ ] `description` field: non-empty, ≤1024 chars
- [ ] `description` written in third person
- [ ] `description` includes what and when
- [ ] All file paths use forward slashes
- [ ] References are one level deep from SKILL.md
- [ ] SKILL.md body is under 500 lines (recommended)
- [ ] Files >100 lines have table of contents
- [ ] No Windows-style paths anywhere
- [ ] Consistent terminology throughout
- [ ] No XML tags in frontmatter
