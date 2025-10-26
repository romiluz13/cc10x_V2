---
name: [action]-[domain]
description: [What it does] using pre-built utility scripts for reliability. Use when [scenarios requiring deterministic operations].
---

# [Domain] [Action]

This skill includes utility scripts for reliable, deterministic operations.

## Available Scripts

### script1.py - [Purpose]

**Purpose:** [What this script does]

**Usage:**
```bash
python scripts/script1.py [input] [options]
```

**Arguments:**
- `input`: [Description]
- `--option1`: [Description] (optional, default: [value])
- `--option2`: [Description] (optional)

**Output:**
- Success: [What it produces]
- Failure: [Error message format]

**Example:**
```bash
python scripts/script1.py input.txt --option1 value
# Output: [expected output]
```

### script2.py - [Purpose]

**Purpose:** [What this script does]

**Usage:**
```bash
python scripts/script2.py [args]
```

**Arguments:**
- [Argument descriptions]

**Output:**
[Output description]

**Example:**
```bash
python scripts/script2.py arg1 arg2
```

### validate.py - Validation Script

**Purpose:** Validates [what] before processing

**Usage:**
```bash
python scripts/validate.py [input-file]
```

**Output:**
- ✓ "Validation passed" - Safe to proceed
- ✗ Specific error messages - Fix before proceeding

**Example:**
```bash
python scripts/validate.py data.json
# Validation passed
```

## Workflow

### Standard Process

```
Copy this checklist:

\`\`\`
Process:
- [ ] Step 1: Validate input
- [ ] Step 2: Process with script1.py
- [ ] Step 3: Validate output
- [ ] Step 4: Further processing (if needed)
\`\`\`
```

### Step 1: Validate Input

**Always validate first:**

```bash
python scripts/validate.py input-file
```

**If validation fails:**
1. Read error message
2. Fix identified issues
3. Run validation again
4. **Do not proceed until validation passes**

### Step 2: Process

**Once validated, process:**

```bash
python scripts/script1.py input-file output-file [options]
```

**Monitor output for:**
- Progress indicators
- Warning messages
- Error conditions

### Step 3: Validate Output

**Verify results:**

```bash
python scripts/validate.py output-file
```

**If validation fails:**
- Review error messages
- Check processing step
- Verify input was correct
- Re-run if needed

### Step 4: Additional Processing

**If more steps needed:**

```bash
python scripts/script2.py output-file final-output
```

## Error Handling

Scripts provide explicit error handling with helpful messages.

### Common Errors

**Error: [Error message 1]**

**Cause:** [Why this happens]

**Solution:**
1. [Fix step 1]
2. [Fix step 2]
3. Re-run command

**Error: [Error message 2]**

**Cause:** [Why this happens]

**Solution:**
[How to resolve]

## Script Features

Scripts are designed to:
- ✓ Handle errors explicitly (don't punt to Claude)
- ✓ Provide helpful error messages
- ✓ Validate inputs before processing
- ✓ Clean up resources on failure
- ✓ Support common options
- ✓ Work reliably and deterministically

## Dependencies

Scripts require:
- Python 3.8+
- [Package 1]: `pip install package1`
- [Package 2]: `pip install package2`

**Installation:**
```bash
pip install package1 package2
```

## Complete Example

### Scenario: [Example scenario]

**Step 1: Validate**
```bash
python scripts/validate.py input.txt
# Output: Validation passed
```

**Step 2: Process**
```bash
python scripts/script1.py input.txt output.json --format json
# Output: Processing complete. 150 items processed.
```

**Step 3: Validate Output**
```bash
python scripts/validate.py output.json
# Output: Validation passed
```

**Result:** Successfully processed input with validation at each step.

## When to Execute vs Read Scripts

**Execute (most common):**
- "Run `script1.py` to process the data"
- "Use `validate.py` to check the file"

Scripts execute without loading into context.

**Read as reference (rare):**
- "See `script1.py` for the processing algorithm"

Only when you need to understand implementation details.

## Troubleshooting

**Scripts won't run:**
- Check Python version: `python --version`
- Verify dependencies installed: `pip list`
- Check file permissions: `ls -l scripts/`

**Unexpected output:**
- Review input format
- Check validation passed
- Verify options are correct
- Check error messages carefully

**Validation fails:**
- Read specific error message
- Fix identified issue
- Don't skip validation step
