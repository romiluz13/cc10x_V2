# JSON Formatter Example Skill

**Pattern**: Basic Skill
**Complexity**: Low
**Lines**: ~160

## Overview

This example demonstrates the **basic-skill pattern** - a self-contained skill that fits comfortably in a single SKILL.md file under 500 lines.

## Design Decisions

### Pattern Choice

**Why basic-skill?**
- Simple, focused capability (JSON formatting)
- No complex workflows or multi-step processes
- No need for progressive disclosure
- Straightforward operations

**Alternatives considered**:
- ❌ Script-based: Overkill for simple JSON operations
- ❌ Multi-file: No need for separate reference files

### Structure

```
json-formatter/
├── SKILL.md (complete skill)
└── README.md (this file)
```

Single file structure because:
- Content fits well under 500 lines (~160 lines)
- All operations are related and simple
- No extensive reference material needed

### Best Practices Demonstrated

#### 1. Conciseness ✓

**What we DON'T explain** (Claude already knows):
- What JSON is
- How Python's json module works
- Basic file I/O operations
- What indentation means

**What we DO include**:
- Specific commands for operations
- Python code snippets ready to use
- Common issues and solutions
- Configuration options

#### 2. YAML Frontmatter ✓

```yaml
name: json-formatter  # lowercase, hyphens
description: Formats, validates, and prettifies JSON files...
  # Third person, includes what it does and when to use it
  # Includes triggers: "JSON files", "API responses", "configuration"
```

#### 3. Appropriate Freedom ✓

**High freedom**: General approach ("format JSON")
**Medium freedom**: Example code with parameters
**Low freedom**: Not needed (JSON formatting isn't fragile)

The skill provides example code but allows variations based on needs.

#### 4. Concrete Examples ✓

Every operation includes working code:
- Pretty print with options
- Minify
- Validation
- Batch operations
- Common issues (trailing commas, comments)

#### 5. No Time-Sensitive Info ✓

No version-specific information or dates that will become outdated.

### Validation Checklist

- [x] Name: lowercase, hyphens, max 64 chars
- [x] Description: specific, third person, includes triggers
- [x] SKILL.md body: 160 lines (under 500)
- [x] Forward slashes: N/A (no file references)
- [x] Consistent terminology: "JSON", "format", "validate"
- [x] Concise: No over-explaining
- [x] Examples: Concrete, working code
- [x] No time-sensitive info

## Usage Example

When Claude Code has this skill loaded:

```
User: Format this messy JSON file and fix any syntax errors

Claude: [Loads json-formatter skill]
        [Reads the file]
        [Applies formatting with validation]
        [Handles trailing commas if present]
        [Saves formatted result]
```

Claude knows to:
1. Check for common issues first (trailing commas, comments)
2. Validate syntax
3. Apply standard formatting (2-space indent, sorted keys)
4. Report any errors clearly

## Key Takeaways

1. **Basic pattern works for simple, focused capabilities**
2. **Concise code examples > lengthy explanations**
3. **Cover common issues users actually face**
4. **Provide ready-to-use code, not just concepts**
5. **Under 500 lines leaves room for growth**

## Possible Extensions

If this skill needed to grow, consider:

**Multi-file pattern** if adding:
- JSON Schema validation (SCHEMA.md reference)
- Complex transformations (TRANSFORMS.md reference)
- Extensive configuration options (CONFIG.md reference)

**Script-based pattern** if adding:
- Pre-built validation script with error handling
- Batch processing script with progress reporting
- Schema generation script

For now, basic pattern is perfect.
