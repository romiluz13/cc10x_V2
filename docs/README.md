# Skilz Documentation

Comprehensive guides for understanding and building Claude Code skills.

## Quick Navigation

- **[Best Practices Guide](best-practices-guide.md)** - Complete guide to writing effective skills
- **[Skill Structure](skill-structure.md)** - Technical specifications and requirements
- **[Progressive Disclosure](progressive-disclosure.md)** - Organizing content for efficient loading
- **[Workflows and Feedback](workflows-and-feedback.md)** - Multi-step processes and validation loops
- **[Testing and Evaluation](testing-and-evaluation.md)** - How to test and iterate on skills
- **[Security Considerations](security-considerations.md)** - Security guidelines for skills

## What Are Claude Code Skills?

Claude Code Skills are modular capabilities that extend Claude's functionality. Each skill packages:

- **Instructions**: Procedural knowledge and workflows
- **Metadata**: Name and description for discovery
- **Resources**: Optional scripts, templates, and reference materials

Skills activate automatically when Claude recognizes a relevant request.

## How Skills Work

### Progressive Loading

Skills load in three stages:

1. **Metadata** (always loaded): Name and description in system prompt
2. **Instructions** (loaded when triggered): Main SKILL.md content
3. **Resources** (loaded as needed): Supporting files and scripts

This ensures only relevant content occupies the context window.

### Example Flow

1. User asks: "Extract text from this PDF"
2. Claude sees pdf-processing skill metadata in system prompt
3. Description matches the request
4. Claude reads pdf-processing/SKILL.md
5. Claude follows instructions to complete task

## Core Principles

### 1. Be Concise

Only include what Claude doesn't already know:
- Skip explanations of common formats
- Assume programming knowledge
- Trust Claude's intelligence

### 2. Set Appropriate Freedom

Match specificity to task fragility:
- **High freedom**: Text instructions for flexible tasks
- **Medium freedom**: Pseudocode for preferred patterns
- **Low freedom**: Exact scripts for critical operations

### 3. Use Progressive Disclosure

Structure content for on-demand loading:
- SKILL.md as table of contents
- Details in separate files
- Claude reads only what's needed

### 4. Implement Workflows

For multi-step tasks:
- Provide checkbox checklists
- Clear sequential steps
- Validation points
- Error recovery

### 5. Create Feedback Loops

For quality-critical work:
- Validate → Fix → Repeat pattern
- Clear success criteria
- Specific error messages

## Quick Start

### Creating Your First Skill

1. **Describe your need** to Claude Code:
   ```
   Create a skill for analyzing SQL query performance
   ```

2. **Claude generates** a properly structured skill using the skill-builder

3. **Save the skill** to:
   - `.claude/skills/[name]/` (project-specific)
   - `~/.claude/skills/[name]/` (personal, all projects)

4. **Test the skill**:
   ```bash
   npm run validate .claude/skills/sql-analyzer
   ```

### Using Templates

Browse the templates directory for common patterns:

```bash
ls templates/
# basic-skill/
# analysis-skill/
# generation-skill/
# workflow-skill/
# tool-restricted-skill/
# multi-file-skill/
# script-based-skill/
# validation-skill/
```

Copy and customize a template:

```bash
cp -r templates/analysis-skill .claude/skills/my-analyzer
# Edit .claude/skills/my-analyzer/SKILL.md
```

## Skill Structure

### Minimal Skill

```
skill-name/
└── SKILL.md
```

```markdown
---
name: skill-name
description: What it does and when to use it
---

# Skill Name

## Instructions

[Your instructions here]
```

### Complex Skill

```
skill-name/
├── SKILL.md              # Overview and navigation
├── quickstart.md         # Common patterns
├── reference/
│   ├── api.md           # API reference
│   └── examples.md       # Examples
└── scripts/
    ├── validate.py       # Validation script
    └── process.py        # Processing script
```

## Validation Requirements

### Required Fields

```yaml
---
name: lowercase-with-hyphens-only
description: Specific description with triggers. Use when [scenarios].
---
```

**name:**
- Lowercase letters, numbers, hyphens only
- Maximum 64 characters
- No reserved words (anthropic, claude)

**description:**
- Maximum 1024 characters
- Third person only
- Include what AND when

### Best Practices

- SKILL.md under 500 lines
- Forward slashes in paths
- References one level deep
- Consistent terminology
- Concrete examples

## Common Patterns

### Template Pattern

Provide structure for output:

```markdown
## Output Format

\`\`\`markdown
# [Title]

## Section 1
[Content]

## Section 2
[Content]
\`\`\`
```

### Examples Pattern

Show input/output pairs:

```markdown
**Example 1:**
Input: [User request]
Output: [Expected result]

**Example 2:**
Input: [Different request]
Output: [Expected result]
```

### Workflow Pattern

Multi-step with checkboxes:

```markdown
\`\`\`
Progress:
- [ ] Step 1: [Action]
- [ ] Step 2: [Action]
- [ ] Step 3: [Action]
\`\`\`

**Step 1: [Action]**
[Detailed instructions]
```

## Tools and Validation

### Validate Skill

```bash
npm run validate path/to/skill
```

Checks:
- YAML frontmatter syntax
- Name and description format
- File paths and references
- Structure compliance

### Lint Skill

```bash
npm run lint path/to/skill
```

Checks:
- Markdown formatting
- Consistency
- Verbosity warnings
- Anti-patterns

### Test Skill

```bash
npm run test path/to/skill
```

Tests:
- Trigger recognition
- File navigation
- Workflow completeness

### Scaffold New Skill

```bash
npm run scaffold
```

Interactive CLI to:
- Choose pattern/template
- Set name and description
- Generate structure
- Create initial files

## Learning Path

### Beginner

1. Read [Best Practices Guide](best-practices-guide.md)
2. Review [Skill Structure](skill-structure.md)
3. Use `npm run scaffold` to create first skill
4. Start with basic-skill template
5. Test with simple use cases

### Intermediate

1. Study [Progressive Disclosure](progressive-disclosure.md)
2. Review example skills in `examples/`
3. Create multi-file skills with references
4. Implement workflow patterns
5. Add validation scripts

### Advanced

1. Read [Workflows and Feedback](workflows-and-feedback.md)
2. Study script-based and validation patterns
3. Create domain-organized skills
4. Build skills with complex dependencies
5. Contribute patterns and examples

## Examples

Browse `examples/` directory for production-quality skills:

- `code-reviewer/` - Code quality and security analysis
- `test-generator/` - Comprehensive test suite generation
- `refactoring-assistant/` - Code refactoring suggestions
- `api-designer/` - RESTful API design
- `technical-writer/` - Technical documentation
- `sql-query-builder/` - SQL query construction

Each includes:
- Complete, working SKILL.md
- Supporting files
- Design rationale
- Evaluation scenarios

## Getting Help

- Check [Best Practices Guide](best-practices-guide.md) first
- Review similar skills in `examples/`
- Use templates as starting points
- Run validation tools for quick feedback
- Test iteratively with real usage

## Contributing

Found a useful pattern? Have a great example skill?

1. Document your pattern in detail
2. Create a reusable template
3. Add comprehensive examples
4. Submit as a contribution

See `CONTRIBUTING.md` for guidelines.

## Resources

- **Templates**: `../templates/` - 8 common patterns
- **Examples**: `../examples/` - Production-quality skills
- **Meta-Skill**: `../.claude/skills/skill-builder/` - The skill that builds skills
- **Tools**: `../tools/` - Validation and scaffolding utilities

## Next Steps

1. **Learn the basics**: Read [Best Practices Guide](best-practices-guide.md)
2. **Understand structure**: Review [Skill Structure](skill-structure.md)
3. **Choose a template**: Browse `../templates/`
4. **Create your skill**: Use Claude Code with skill-builder
5. **Validate**: Run `npm run validate`
6. **Test**: Use skill in real scenarios
7. **Iterate**: Refine based on usage

Happy skill building!
