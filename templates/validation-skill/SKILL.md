---
name: [action]-[domain]
description: [What it does] with plan-validate-execute pattern to prevent errors. Use when [high-stakes scenarios] requiring validation before changes.
---

# [Domain] [Action] (Validated)

This skill uses a plan-validate-execute pattern to catch errors before making changes.

## Why This Pattern

The plan-validate-execute pattern:
- ✓ Catches errors before applying changes
- ✓ Provides machine-verifiable validation
- ✓ Allows iteration on plan without touching originals
- ✓ Gives specific error messages for debugging
- ✓ Prevents costly mistakes in production

## Workflow

### Copy this checklist:

```
Workflow Progress:
- [ ] Step 1: Analyze requirements
- [ ] Step 2: Create plan file
- [ ] Step 3: Validate plan
- [ ] Step 4: Fix validation errors (if any)
- [ ] Step 5: Re-validate until clean
- [ ] Step 6: Execute validated plan
- [ ] Step 7: Verify results
```

## Step 1: Analyze Requirements

**Understand what needs to be done:**

Ask:
- What is the goal?
- What resources are involved?
- What constraints exist?
- What are the success criteria?

**Document:**
- Input sources
- Output targets
- Transformation rules
- Validation criteria

## Step 2: Create Plan File

**Generate a structured plan describing all changes:**

```bash
python scripts/create_plan.py [inputs] > plan.json
```

**Plan file format:**

```json
{
  "metadata": {
    "created": "[timestamp]",
    "purpose": "[description]"
  },
  "changes": [
    {
      "id": "change-1",
      "type": "[change-type]",
      "target": "[what to change]",
      "value": "[new value]",
      "reason": "[why this change]"
    },
    {
      "id": "change-2",
      "type": "[change-type]",
      "target": "[what to change]",
      "value": "[new value]",
      "reason": "[why this change]"
    }
  ],
  "dependencies": [
    {
      "change": "change-2",
      "depends_on": "change-1",
      "reason": "[why order matters]"
    }
  ]
}
```

## Step 3: Validate Plan

**Critical step - validate before executing:**

```bash
python scripts/validate_plan.py plan.json
```

**Validation checks:**
- All referenced targets exist
- Values are in valid format
- No conflicting changes
- Dependencies are satisfiable
- All required fields present
- [Domain-specific validations]

**Possible outcomes:**

**✓ Success:**
```
Validation passed
0 errors, 0 warnings
Safe to execute
```

**✗ Failure:**
```
Validation failed with 3 errors:

Error 1: Target 'item-5' does not exist
  Location: changes[2].target
  Available targets: item-1, item-2, item-3, item-4

Error 2: Value 'invalid' is not allowed
  Location: changes[3].value
  Allowed values: value-a, value-b, value-c

Error 3: Circular dependency detected
  Changes: change-1 → change-2 → change-1
```

## Step 4: Fix Validation Errors

**If validation fails:**

1. **Read error messages carefully**
   - Note the specific issue
   - Note the location in plan file
   - Understand what's wrong

2. **Edit plan.json to fix issues**
   - Fix one error at a time
   - Double-check syntax
   - Verify logic

3. **Re-run validation**
   ```bash
   python scripts/validate_plan.py plan.json
   ```

4. **Iterate until clean**
   - Fix new errors that appear
   - Keep validating
   - **Do not proceed until validation passes**

## Step 5: Re-Validate

**Run validation one final time before executing:**

```bash
python scripts/validate_plan.py plan.json
```

**Only proceed if:**
- ✓ 0 errors
- ✓ 0 warnings (or warnings acknowledged)
- ✓ "Safe to execute" message

## Step 6: Execute Validated Plan

**Only execute after validation passes:**

```bash
python scripts/execute_plan.py plan.json
```

**What happens:**
- Applies all changes from validated plan
- Follows dependency order
- Reports progress
- Handles errors gracefully
- Creates backups (if applicable)

**Monitor output:**
```
Executing plan.json...

[1/5] Applying change-1... ✓
[2/5] Applying change-2... ✓
[3/5] Applying change-3... ✓
[4/5] Applying change-4... ✓
[5/5] Applying change-5... ✓

Execution complete. 5/5 changes applied successfully.
```

## Step 7: Verify Results

**Confirm changes were applied correctly:**

**Verification checklist:**
- [ ] All changes applied
- [ ] No unexpected side effects
- [ ] Output meets requirements
- [ ] [Domain-specific verification 1]
- [ ] [Domain-specific verification 2]

**Verification commands:**
```bash
[Verification command 1]
[Verification command 2]
```

## Error Handling

### Validation Errors

**Common validation errors and fixes:**

**Error: Target does not exist**
- Check target name spelling
- Verify target actually exists
- Review available targets in error message

**Error: Invalid value format**
- Check value against allowed values
- Verify data type
- Review format requirements

**Error: Circular dependency**
- Review dependency chain
- Restructure dependencies
- Break circular references

**Error: Conflicting changes**
- Identify conflicts
- Decide on resolution
- Update plan accordingly

### Execution Errors

If execution fails mid-way:

1. **Review error message**
2. **Check which changes succeeded** (before failure)
3. **Determine next steps:**
   - **Option A**: Fix issue and continue
   - **Option B**: Rollback and start over
4. **Create updated plan** addressing the issue
5. **Validate and execute again**

## Example Walkthrough

### Scenario: [Example scenario]

**Step 1: Requirements**
- Need to [goal]
- Involving [resources]
- Following [rules]

**Step 2: Create Plan**
```bash
python scripts/create_plan.py input.txt > plan.json
```

Generated plan with 10 changes.

**Step 3: Initial Validation**
```bash
python scripts/validate_plan.py plan.json
# Error: Target 'item-11' does not exist
# Error: Value must be positive number, got '-5'
```

**Step 4: Fix Errors**
- Corrected 'item-11' to 'item-1'
- Changed '-5' to '5'

**Step 5: Re-validate**
```bash
python scripts/validate_plan.py plan.json
# Validation passed
# 0 errors, 0 warnings
# Safe to execute
```

**Step 6: Execute**
```bash
python scripts/execute_plan.py plan.json
# Execution complete. 10/10 changes applied successfully.
```

**Step 7: Verify**
```bash
[verification command]
# All checks passed
```

**Result:** Successfully completed with validation preventing 2 errors.

## Plan File Guidelines

**Good plan characteristics:**
- Clear, specific changes
- Descriptive reasons
- Explicit dependencies
- Proper ordering
- Complete information

**Bad plan characteristics:**
- Vague changes
- Missing reasons
- Implicit dependencies
- Wrong order
- Missing fields

## When to Use This Pattern

**Use plan-validate-execute when:**
- ✓ Changes are complex
- ✓ Many items affected
- ✓ Mistakes are costly
- ✓ Rollback is difficult
- ✓ Validation is automatable

**Simple direct approach when:**
- Single simple change
- Easy to verify manually
- Low risk
- Quick to undo

## Scripts Reference

**create_plan.py**: Generates plan from inputs
**validate_plan.py**: Validates plan file
**execute_plan.py**: Executes validated plan

See [scripts/README.md](scripts/README.md) for detailed documentation.
