# Skill-Builder Evaluations Guide

How to test and validate the skill-builder skill using the evaluation test cases.

## Overview

This document explains how to use the evaluations in `evaluations.json` to test whether the skill-builder skill is working correctly and following best practices.

## Evaluation Structure

The `evaluations.json` file contains:
- **12 test cases** covering different aspects of skill generation
- **Baseline test** to measure improvement over Claude without the skill
- **Success criteria** defining what "passing" means
- **Iteration guidance** for improving the skill based on results

## Running Evaluations

### Manual Testing Process

Since Claude Code doesn't currently provide built-in evaluation tools, run tests manually:

1. **Establish Baseline** (optional but recommended)
   - Start fresh conversation WITHOUT skill-builder skill loaded
   - Run: "Create a Claude Code skill for processing PDF files"
   - Note common issues (see `baseline_test.common_issues_without_skill`)

2. **Run Test Cases WITH Skill**
   - Start fresh conversation WITH skill-builder skill loaded
   - For each test case in `evaluations.json`:
     - Copy the `query` field
     - Submit to Claude
     - Check output against `expected_behaviors`
     - Verify `anti_patterns_to_avoid` are NOT present

3. **Record Results**
   - Mark each test as PASS or FAIL
   - Note specific issues if FAIL
   - Calculate pass rate (need 10/12 to pass)

### Test Case Summary

#### Critical Tests (Must Pass)
- **eval-001**: Basic Skill Generation
- **eval-004**: Invalid Name Validation
- **eval-006**: Description Quality
- **eval-012**: Complete Skill Validation

#### Pattern & Quality Tests
- **eval-002**: Multi-File Skills with Progressive Disclosure
- **eval-003**: Workflow Skills with Validation
- **eval-007**: Conciseness (No Over-Explaining)
- **eval-008**: Template Pattern Selection
- **eval-009**: Examples Pattern Selection
- **eval-010**: Degree of Freedom (Low Freedom for Fragile Ops)

#### Validation Tests
- **eval-005**: Reserved Words Validation
- **eval-011**: Executable Scripts Guidance

## Expected Behaviors Checklist

For each generated skill, verify:

### YAML Frontmatter
- [ ] Valid YAML with opening and closing `---`
- [ ] `name` field: lowercase, hyphens only, ≤64 chars
- [ ] `name` doesn't contain "anthropic" or "claude"
- [ ] `description` field: non-empty, ≤1024 chars
- [ ] `description` in third person (not "I can" or "You can")
- [ ] `description` includes what it does AND when to use it
- [ ] `description` includes trigger keywords

### Content Quality
- [ ] SKILL.md body under 500 lines
- [ ] Concise (no over-explaining basic concepts)
- [ ] Appropriate degree of freedom for use case
- [ ] Consistent terminology throughout
- [ ] Forward slashes in all file paths (not backslashes)

### Progressive Disclosure (if multi-file)
- [ ] SKILL.md serves as overview/table of contents
- [ ] Supporting files for detailed content
- [ ] All references one level deep from SKILL.md
- [ ] Files >100 lines have table of contents at top
- [ ] Descriptive file names (not doc1.md, file2.md)

### Patterns (where applicable)
- [ ] Workflow skills have copy-able checklists
- [ ] Template skills show concrete examples
- [ ] Example-based skills have multiple input/output pairs
- [ ] Validation included for critical operations

### Anti-Patterns (should NOT appear)
- [ ] No Windows-style backslash paths
- [ ] No time-sensitive information (specific dates/versions)
- [ ] No deeply nested references
- [ ] No first/second person in descriptions
- [ ] No over-explanation of concepts Claude knows
- [ ] No vague names like "helper", "utils", "tool"

## Interpreting Results

### Pass Rate
- **10-12 passing (83-100%)**: Skill is working well ✅
- **7-9 passing (58-75%)**: Skill needs refinement ⚠️
- **<7 passing (<58%)**: Skill needs major revision ❌

### Common Failure Patterns

**If eval-001 (Basic Generation) fails:**
- Check SKILL.md for YAML frontmatter guidance
- Ensure examples are clear and concrete
- Verify validation checklist is present

**If eval-002 (Multi-File) fails:**
- Improve progressive disclosure section
- Add clearer guidance on when to split files
- Provide better multi-file examples

**If eval-003 (Workflow) fails:**
- Add more workflow pattern examples
- Emphasize copy-able checklist format
- Include validation loop examples

**If eval-004/005 (Validation) fails:**
- Make validation rules more prominent
- Add examples of invalid names being corrected
- Include validation checklist earlier

**If eval-006 (Description) fails:**
- Emphasize third-person requirement MORE
- Add more good/bad description examples
- Make trigger keywords requirement clearer

**If eval-007 (Conciseness) fails:**
- Make "Claude is already smart" principle MORE prominent
- Add more concise vs. verbose examples
- Challenge every sentence in examples

**If eval-008/009 (Patterns) fails:**
- Improve pattern selection guide
- Add clearer examples for each pattern
- Make pattern matching more explicit

**If eval-010 (Degrees of Freedom) fails:**
- Improve bridge analogy explanation
- Add more examples at each freedom level
- Clarify when to use each level

**If eval-011 (Scripts) fails:**
- Add clearer guidance on when to provide scripts
- Include script examples
- Explain execute vs. read distinction

**If eval-012 (Complete Validation) fails:**
- This is comprehensive - check ALL previous failures
- Ensure validation checklist is complete
- Verify all best practices are covered

## Iteration Process

Based on test results:

1. **Identify failure patterns** across test cases
2. **Update relevant sections** in SKILL.md or supporting files
3. **Re-run failed tests** to verify improvements
4. **Run full suite** to ensure no regressions
5. **Update evaluations** if new patterns emerge

## Baseline Comparison

To measure skill effectiveness:

### Without Skill-Builder (Baseline)
Common issues:
- May not format YAML correctly
- May use uppercase or spaces in names
- May write in first/second person
- May not understand progressive disclosure
- May not know 500-line limit
- May over-explain basic concepts
- May not follow validation checklist

### With Skill-Builder (Expected)
Should address all baseline issues:
- ✅ Proper YAML frontmatter
- ✅ Valid naming (lowercase, hyphens)
- ✅ Third-person descriptions
- ✅ Progressive disclosure when needed
- ✅ Stays under 500 lines
- ✅ Concise, assumes Claude's knowledge
- ✅ Follows complete validation checklist

### Success Metric
Skill-builder should:
- Prevent 90%+ of baseline errors
- Generate validating skills in first attempt
- Produce skills that pass all validation rules
- Create appropriate patterns for use cases

## Quick Test Command

For rapid validation, run this quick test:

```
Query: "Create a skill for processing CSV files with data validation"

Quick Check:
✓ Name is valid (lowercase-with-hyphens)?
✓ Description in third person?
✓ Description includes triggers (CSV, data, validation)?
✓ SKILL.md under 500 lines?
✓ No over-explanation of what CSVs are?
✓ Validation pattern included?
✓ Checklist included if workflow?
```

If all ✓ pass, skill is working. If any fail, investigate that aspect.

## Recording Results

Use this template to track evaluation runs:

```markdown
## Evaluation Run: [Date]

### Configuration
- Claude Model: [Sonnet/Opus/Haiku]
- Skill Version: [version]

### Results
- eval-001 Basic Generation: [PASS/FAIL] - [notes]
- eval-002 Multi-File: [PASS/FAIL] - [notes]
- eval-003 Workflow: [PASS/FAIL] - [notes]
- eval-004 Invalid Name: [PASS/FAIL] - [notes]
- eval-005 Reserved Words: [PASS/FAIL] - [notes]
- eval-006 Description: [PASS/FAIL] - [notes]
- eval-007 Conciseness: [PASS/FAIL] - [notes]
- eval-008 Template Pattern: [PASS/FAIL] - [notes]
- eval-009 Examples Pattern: [PASS/FAIL] - [notes]
- eval-010 Degrees of Freedom: [PASS/FAIL] - [notes]
- eval-011 Scripts: [PASS/FAIL] - [notes]
- eval-012 Complete: [PASS/FAIL] - [notes]

### Pass Rate
[X]/12 ([XX]%)

### Action Items
1. [Item if any failures]
2. [Item]

### Next Steps
[What to improve based on results]
```

## Notes

- Evaluations are living documents - update as skill evolves
- Add new test cases when edge cases discovered
- Baseline test helps quantify skill's value
- Critical tests (001, 004, 006, 012) must always pass
- Pattern tests (008, 009, 010) may need refinement over time

## See Also

- [best-practices.md](best-practices.md) - Full best practices guide
- [validation-rules.md](validation-rules.md) - Complete validation checklist
- [patterns.md](patterns.md) - Pattern selection guide
