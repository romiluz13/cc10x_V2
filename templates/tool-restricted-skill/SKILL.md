---
name: [action]-[domain]
description: [What it does] without making modifications. Use when user needs to analyze, review, or understand [domain] without changing anything.
allowed-tools: Read, Grep, Glob
---

# [Domain] [Action] (Read-Only)

**Important:** This skill operates in read-only mode and will not modify any files or system state.

## What This Skill Does

This skill provides [capabilities] while ensuring no modifications are made to:
- Files and directories
- System configuration
- Data or databases
- Any persistent state

## What This Skill Cannot Do

Due to tool restrictions:
- ✗ Cannot write or modify files
- ✗ Cannot execute scripts that change state
- ✗ Cannot install packages
- ✗ Cannot make destructive changes

For operations requiring modifications, you'll need explicit permission to use an unrestricted approach.

## Analysis Process

### Step 1: Gather Information

Use read-only tools to collect data:

```bash
# Find relevant files
grep -r "pattern" path/

# Read file contents
cat file.txt

# List directory structure
ls -la path/
```

### Step 2: Analyze Content

Examine the gathered information for:
- [Aspect 1 to analyze]
- [Aspect 2 to analyze]
- [Aspect 3 to analyze]

### Step 3: Document Findings

Structure output as:

```markdown
# Analysis Report

## Summary
[High-level overview of findings]

## Findings

### [Category 1]
- **Finding**: [What was discovered]
  - **Location**: [Where found]
  - **Evidence**: [Supporting details]

### [Category 2]
- **Finding**: [What was discovered]
  - **Location**: [Where found]
  - **Evidence**: [Supporting details]

## Observations
[Additional insights]

## Recommendations
[Suggestions that would require write access]

**Note**: These are recommendations only. Implementing them requires appropriate permissions.
```

## Analysis Categories

### [Category 1]

**What to examine:**
- [Item 1]
- [Item 2]

**How to check:**
```bash
[Read-only command]
```

**Look for:**
- [Pattern or indicator 1]
- [Pattern or indicator 2]

### [Category 2]

**What to examine:**
- [Item 1]
- [Item 2]

**How to check:**
```bash
[Read-only command]
```

### [Category 3]

[Similar structure]

## Example Analysis

### Scenario: [Example]

**Files examined:**
```bash
ls path/
# file1.txt
# file2.txt
# file3.txt
```

**Content reviewed:**
```bash
grep "pattern" file1.txt
# line 10: pattern found
# line 25: pattern found
```

**Findings:**
- [Finding 1 with location and evidence]
- [Finding 2 with location and evidence]

**Recommendations:**
1. [What should be changed - requires write access]
2. [Another recommendation - requires write access]

## Quick Reference

**Allowed operations:**
- `grep`: Search file contents
- `cat`, `head`, `tail`: Read files
- `ls`, `find`: List files
- `diff`: Compare files
- File reading and pattern matching

**Not allowed:**
- `echo >`, `cat >`: Writing to files
- `rm`, `mv`, `cp`: Modifying filesystem
- Script execution that changes state
- Package installation

## Reporting Format

Always conclude analysis with:

1. **Summary**: Brief overview of findings
2. **Detailed findings**: Specific discoveries with evidence
3. **Recommendations**: What changes would improve things (user must implement)
4. **Next steps**: What actions require elevated permissions
