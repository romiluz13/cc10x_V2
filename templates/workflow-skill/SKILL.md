---
name: [action]-workflow
description: Guides through [process] with validation and error handling. Use when user needs to [accomplish complex goal] through multiple coordinated steps.
---

# [Process] Workflow

## Workflow Overview

This skill guides through [process description] ensuring each step completes successfully before proceeding.

## Complete Workflow

### Copy this checklist to track progress:

```
Workflow Progress:
- [ ] Step 1: [Action]
- [ ] Step 2: [Action]
- [ ] Step 3: [Action]
- [ ] Step 4: [Action]
- [ ] Step 5: [Action]
- [ ] Step 6: [Verification]
```

## Step-by-Step Instructions

### Step 1: [Action Name]

**Objective:** [What this step accomplishes]

**Prerequisites:**
- [Requirement 1]
- [Requirement 2]

**Actions:**

1. [Specific action 1]
   ```[language]
   [command or code]
   ```

2. [Specific action 2]
   ```[language]
   [command or code]
   ```

**Expected Outcome:**
- [What you should see]
- [What should happen]

**Validation:**
```[language]
[Validation command]
```

Expected output:
```
[What successful validation looks like]
```

**If validation fails:**
- **Symptom**: [Error message or behavior]
  **Solution**: [How to fix]
- **Symptom**: [Another error]
  **Solution**: [How to fix]

**Before proceeding:**
- [ ] Validation passed
- [ ] Output matches expectations
- [ ] No error messages

---

### Step 2: [Action Name]

**Objective:** [What this step accomplishes]

**Prerequisites:**
- [ ] Step 1 completed successfully
- [Additional requirement]

**Actions:**

1. [Specific action 1]
   ```[language]
   [command or code]
   ```

2. [Specific action 2]
   ```[language]
   [command or code]
   ```

**Expected Outcome:**
- [What you should see]
- [What should happen]

**Validation:**
```[language]
[Validation command]
```

**If validation fails:**
- **DO NOT proceed to Step 3**
- Review error messages
- Fix identified issues
- Re-run validation
- Only continue when validation passes

**Before proceeding:**
- [ ] Validation passed
- [ ] Output correct
- [ ] Ready for next step

---

### Step 3: [Action Name]

**Objective:** [What this step accomplishes]

**Prerequisites:**
- [ ] Steps 1-2 completed successfully
- [Additional requirement]

**Actions:**

1. [Specific action 1]
2. [Specific action 2]

**Expected Outcome:**
[What should happen]

**Validation:**
```[language]
[Validation command]
```

**Critical checkpoint:**

This is a critical step. If anything fails here:

1. **Stop immediately**
2. Review all previous steps
3. Check for [common issue 1]
4. Check for [common issue 2]
5. Do not continue until issue resolved

**Before proceeding:**
- [ ] Critical validation passed
- [ ] No warnings or errors
- [ ] State is consistent

---

### Step 4: [Action Name]

[Similar structure to previous steps]

---

### Step 5: [Action Name]

[Similar structure to previous steps]

---

### Step 6: Final Verification

**Objective:** Confirm entire workflow completed successfully

**Verification Steps:**

1. **Check [aspect 1]:**
   ```[language]
   [verification command]
   ```
   Expected: [What you should see]

2. **Check [aspect 2]:**
   ```[language]
   [verification command]
   ```
   Expected: [What you should see]

3. **Check [aspect 3]:**
   ```[language]
   [verification command]
   ```
   Expected: [What you should see]

**Final Checklist:**
- [ ] All workflow steps completed
- [ ] All validations passed
- [ ] Final verification successful
- [ ] No outstanding errors or warnings
- [ ] Output meets requirements

**If final verification fails:**
- Identify which aspect failed
- Return to the relevant step
- Fix the issue
- Re-run workflow from that point
- Verify again

## Feedback Loop

This workflow uses a validate-fix-repeat pattern at each step:

```
1. Perform action
2. Validate immediately
3. If validation fails:
   - Fix issue
   - Re-validate
   - Repeat until passes
4. Only then proceed to next step
```

This catches errors early when they're easiest to fix.

## Troubleshooting

### Common Issue 1: [Issue Name]

**Symptoms:**
- [What you see]
- [Error message]

**Cause:**
[Why this happens]

**Solution:**
1. [Step to fix]
2. [Step to fix]
3. [Step to verify fix]

**Prevention:**
[How to avoid in future]

### Common Issue 2: [Issue Name]

**Symptoms:**
- [What you see]

**Cause:**
[Why this happens]

**Solution:**
1. [Step to fix]
2. [Step to fix]

### Common Issue 3: [Issue Name]

[Similar structure]

## Recovery Procedures

### If You Need to Start Over

1. [Cleanup step 1]
2. [Cleanup step 2]
3. Return to Step 1

### If You Need to Resume

1. Determine last successful step
2. Verify state is consistent
3. Resume from next step

## Example Walkthrough

### Scenario: [Example scenario]

**Starting conditions:**
- [Condition 1]
- [Condition 2]

**Step 1:** [What happened]
**Validation:** [Result]

**Step 2:** [What happened]
**Validation:** [Result]

**Step 3:** [What happened]
**Encountered issue:** [Problem]
**Resolution:** [How fixed]
**Validation:** [Result after fix]

**Steps 4-5:** [What happened]

**Final verification:** [All checks passed]

**Result:** [Successful outcome]

## Best Practices

- **Never skip validation steps**
- **Stop immediately on critical errors**
- **Document any deviations from standard workflow**
- **Keep a log of what you've done**
- **Ask for help if stuck on same issue repeatedly**

## Quick Reference

| Step | Action | Validation | Critical? |
|------|--------|------------|-----------|
| 1 | [Brief description] | `[command]` | No |
| 2 | [Brief description] | `[command]` | No |
| 3 | [Brief description] | `[command]` | Yes |
| 4 | [Brief description] | `[command]` | No |
| 5 | [Brief description] | `[command]` | Yes |
| 6 | [Brief description] | `[command]` | Yes |
