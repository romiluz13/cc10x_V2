# Skill Validation Rules

Complete checklist for validating Claude Code skills before deployment.

## YAML Frontmatter Validation

### name Field

- [ ] Contains only lowercase letters, numbers, and hyphens
- [ ] Maximum 64 characters
- [ ] No XML tags (`<`, `>`)
- [ ] Does not contain "anthropic" (case-insensitive)
- [ ] Does not contain "claude" (case-insensitive)
- [ ] Not empty
- [ ] Follows naming convention (preferably gerund form)

**Valid examples:**
- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`

**Invalid examples:**
- `PDF-Processing` (uppercase)
- `analyze data` (spaces)
- `helper` (too vague)
- `claude-tool` (reserved word)
- `this-is-an-extremely-long-skill-name-that-goes-way-beyond-the-maximum` (>64 chars)

### description Field

- [ ] Not empty
- [ ] Maximum 1024 characters
- [ ] No XML tags (`<`, `>`)
- [ ] Written in third person
- [ ] Includes what the skill does
- [ ] Includes when to use it
- [ ] Includes trigger keywords
- [ ] Specific, not vague

**Good description checklist:**
- [ ] Starts with action or capability
- [ ] Lists key features or operations
- [ ] Ends with "Use when..." clause
- [ ] Mentions specific file types, domains, or scenarios
- [ ] Uses concrete terms, not abstract ones

### allowed-tools Field (if present)

- [ ] List of valid tool names
- [ ] Tools are comma-separated or YAML list format
- [ ] Only includes allowed tool names

**Valid tool names:**
- Read
- Write
- Edit
- Glob
- Grep
- Bash
- Task
- WebFetch
- WebSearch

## File Structure Validation

### Directory Structure

- [ ] Skill directory name matches YAML `name` field
- [ ] Contains SKILL.md file
- [ ] All referenced files exist
- [ ] No orphaned files (files not referenced anywhere)

### SKILL.md Format

- [ ] Begins with YAML frontmatter (`---`)
- [ ] Ends YAML frontmatter with `---`
- [ ] Body follows frontmatter
- [ ] Body is under 500 lines (recommended)
- [ ] If body >500 lines, content is organized with progressive disclosure

### File Paths

- [ ] All paths use forward slashes (`/`)
- [ ] No backslashes anywhere (`\`)
- [ ] All referenced files exist at specified paths
- [ ] Paths are relative to skill directory
- [ ] File references are one level deep from SKILL.md

**Valid paths:**
```markdown
[FORMS.md](FORMS.md)
[reference/api.md](reference/api.md)
python scripts/validate.py
```

**Invalid paths:**
```markdown
[FORMS.md](FORMS.md)                    # Backslash
[details.md](advanced/details.md)         # Too nested if advanced.md not in SKILL.md
python scripts\validate.py                 # Backslash
```

## Content Quality Validation

### Conciseness

- [ ] No over-explanations of basic concepts
- [ ] No explanations of what PDFs, JSON, CSV, etc. are
- [ ] No explanations of how package managers work
- [ ] Assumes Claude has general programming knowledge
- [ ] Each paragraph justifies its token cost

### Consistency

- [ ] Uses consistent terminology throughout
- [ ] Same term for same concept
- [ ] No mixing of synonyms unnecessarily

**Example consistency check:**
- Pick one: "API endpoint" vs "URL" vs "API route"
- Pick one: "field" vs "box" vs "element"
- Pick one: "extract" vs "pull" vs "get" vs "retrieve"

### Point of View

- [ ] Description uses third person
- [ ] Body can use imperative ("do this") or third person
- [ ] No first person ("I can help")
- [ ] No second person ("You can use") in description

### Time Sensitivity

- [ ] No date-specific information
- [ ] No "before/after [date]" instructions
- [ ] Legacy information in "Old Patterns" sections
- [ ] Current methods clearly marked

## Progressive Disclosure Validation

### File Organization

- [ ] SKILL.md serves as table of contents
- [ ] Detailed content in separate files
- [ ] Domain-specific content in domain files
- [ ] Clear navigation from SKILL.md to details

### Reference Depth

- [ ] All references are one level from SKILL.md
- [ ] No deep nesting (SKILL.md → file1.md → file2.md → file3.md)
- [ ] Referenced files have clear, descriptive names

### File Length

- [ ] SKILL.md under 500 lines
- [ ] Files >100 lines have table of contents
- [ ] Long reference materials split appropriately

## Workflow Validation

### Multi-Step Processes

- [ ] Include copy-able checkbox list
- [ ] Steps are numbered and sequential
- [ ] Each step has clear outcome
- [ ] Validation points identified
- [ ] Failure handling described

**Checkbox format validation:**
- [ ] Checklist is in code fence
- [ ] Uses markdown checkbox format (`- [ ]`)
- [ ] Positioned before detailed steps

### Feedback Loops

- [ ] Validate-fix-repeat pattern where appropriate
- [ ] Validation commands provided
- [ ] Expected outputs described
- [ ] Failure conditions handled
- [ ] Clear "only proceed when validated" language

## Script Validation (if skill includes scripts)

### Script Documentation

- [ ] Purpose clearly stated
- [ ] Usage syntax provided
- [ ] Example invocations shown
- [ ] Expected outputs described
- [ ] Error messages documented

### Script Intent

- [ ] Clear whether to execute or read for reference
- [ ] Execution instructions use imperative language
- [ ] Reference reading explicitly states "See [file] for [reason]"

### Error Handling

- [ ] Scripts handle errors explicitly
- [ ] No punting to Claude with bare exceptions
- [ ] Error messages are helpful and specific
- [ ] Recovery steps documented

### Dependencies

- [ ] Required packages documented
- [ ] Installation commands provided
- [ ] Package availability verified
- [ ] Runtime limitations noted (no network, no runtime installation)

## Pattern Validation

### Template Pattern

- [ ] Template structure provided
- [ ] Level of strictness appropriate
- [ ] Clear when to use exact vs flexible approach

### Examples Pattern

- [ ] Input/output pairs shown
- [ ] Examples are concrete, not abstract
- [ ] Multiple examples for different scenarios
- [ ] Examples demonstrate best practices

### Conditional Workflow Pattern

- [ ] Decision points clearly marked
- [ ] Paths for each condition provided
- [ ] Clear guidance on which path to choose

## Security Validation

### Sensitive Operations

- [ ] Destructive operations have warnings
- [ ] Validation before irreversible changes
- [ ] Read-only mode uses allowed-tools restrictions
- [ ] External dependencies documented

### Data Handling

- [ ] No hardcoded credentials
- [ ] No sensitive data in examples
- [ ] Input validation for user-provided data
- [ ] Clear boundaries for skill's access

## Anti-Pattern Detection

- [ ] No Windows-style paths (`\`)
- [ ] No "too many options" without clear default
- [ ] No time-sensitive information
- [ ] No inconsistent terminology
- [ ] No deeply nested references
- [ ] No assumption of installed tools without documentation
- [ ] No first/second person in descriptions
- [ ] No overly vague names (helper, utils, tools)
- [ ] No overly generic names (documents, data, files)

## Complete Validation Checklist

Run through this complete checklist before finalizing:

### Required Fields
- [ ] `name` field present and valid
- [ ] `description` field present and valid
- [ ] YAML frontmatter properly formatted

### Technical Compliance
- [ ] Forward slashes in all paths
- [ ] SKILL.md under 500 lines (or properly organized)
- [ ] Referenced files exist
- [ ] No deeply nested references
- [ ] Files >100 lines have ToC

### Content Quality
- [ ] Concise (no over-explaining)
- [ ] Consistent terminology
- [ ] Third person in description
- [ ] No time-sensitive info
- [ ] Appropriate degree of freedom

### Structure & Organization
- [ ] Progressive disclosure if multi-file
- [ ] Clear workflows if multi-step
- [ ] Feedback loops for validation
- [ ] Examples are concrete
- [ ] Scripts documented if present

### Security & Safety
- [ ] No sensitive data
- [ ] Destructive ops have warnings
- [ ] Validation before changes
- [ ] Dependencies documented

### Anti-Patterns Avoided
- [ ] No Windows paths
- [ ] No vague names
- [ ] No reserved words
- [ ] No deep nesting
- [ ] No assumption of tools

## Automated Validation

Use provided tools for automated checks:

```bash
# Validate skill structure and requirements
npm run validate path/to/skill

# Lint skill content
npm run lint path/to/skill

# Test skill triggers
npm run test path/to/skill
```

## Manual Review

Automated tools catch technical issues, but manual review ensures:
- [ ] Description triggers appropriately
- [ ] Instructions are clear and actionable
- [ ] Examples are relevant and helpful
- [ ] Workflows are logical and complete
- [ ] Degree of freedom is appropriate
- [ ] Content is concise and valuable

## Testing Checklist

Before deployment, test the skill:

- [ ] Load skill in Claude Code
- [ ] Verify skill appears in skill list
- [ ] Test with queries matching description triggers
- [ ] Verify Claude loads SKILL.md
- [ ] Verify Claude navigates to referenced files when needed
- [ ] Test complete workflows end-to-end
- [ ] Verify validation scripts work as expected
- [ ] Test error handling and recovery paths
- [ ] Confirm output quality matches expectations
- [ ] Iterate based on test results

## Validation Tool Output

When running `npm run validate`, expect:

**Pass:**
```
✓ YAML frontmatter valid
✓ Name field valid: processing-pdfs
✓ Description field valid (342 chars)
✓ File paths use forward slashes
✓ Referenced files exist
✓ SKILL.md length: 287 lines
✓ All validations passed
```

**Fail:**
```
✗ Name field invalid: contains uppercase
✗ Description too long: 1150 chars (max 1024)
✗ Windows-style path found: scripts\validate.py
✗ Referenced file missing: advanced/details.md
⚠ SKILL.md is 623 lines (recommended: <500)
✗ Validation failed with 4 errors, 1 warning
```

## Quick Reference

**Critical requirements:**
1. Valid YAML frontmatter with name and description
2. Forward slashes in all paths
3. Description in third person with triggers
4. Name: lowercase, hyphens, ≤64 chars
5. Description: ≤1024 chars

**Best practices:**
1. SKILL.md <500 lines
2. Progressive disclosure for complex skills
3. Concrete examples
4. Clear workflows with checkboxes
5. Feedback loops for validation

**Anti-patterns to avoid:**
1. Windows-style paths
2. Over-explaining basic concepts
3. Time-sensitive information
4. Deeply nested references
5. Vague or generic names
