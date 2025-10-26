# Skilz - Claude Code Skill Builder

![Production Ready](https://img.shields.io/badge/status-production--ready-green.svg)
![Test Coverage](https://img.shields.io/badge/evaluations-12%20test%20cases-blue.svg)
![Best Practices](https://img.shields.io/badge/best%20practices-compliant-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Automated skill builder for Claude Code** - Describe a skill you need, and Claude Code generates it following best practices automatically.

## What is This?

Skilz is a **meta-repository** that teaches Claude Code how to write high-quality skills. It contains:

1. **skill-builder skill** - A skill that Claude loads to learn how to write skills
2. **Comprehensive evaluations** - 12 test cases to validate skill quality
3. **Comprehensive templates** - 8 ready-to-use skill patterns
4. **Complete examples** - Production-quality skills demonstrating best practices
5. **Validation tools** - Automated checking of skill requirements
6. **Full documentation** - Everything you need to understand skills

## Quick Start

### 1. Install Dependencies

```bash
cd skilz
npm install
```

### 2. Use Claude Code to Build a Skill

Claude Code will automatically load the skill-builder skill and generate properly structured skills:

```
You: Create a skill for analyzing SQL query performance

Claude: I'll create a skill for SQL query performance analysis...
[Generates complete skill with proper YAML frontmatter, structure, and content]
```

That's it! Claude Code reads the skill-builder skill and knows how to:
- Structure YAML frontmatter correctly
- Write effective descriptions with triggers
- Apply appropriate patterns (analysis, workflow, etc.)
- Use progressive disclosure when needed
- Follow all best practices

### 3. Validate Your Skill

```bash
npm run validate .claude/skills/sql-analyzer
```

Output:
```
✓ name field valid: sql-analyzer
✓ description field valid (245 chars)
✓ SKILL.md length: 287 lines
✓ No Windows-style paths found
✓ All validations passed!
```

### 4. Use Your Skill

Your skill is now ready! Claude Code will automatically use it when relevant.

## How It Works

### The Meta-Skill

The core of this repository is `.claude/skills/skill-builder/SKILL.md` - a skill that teaches Claude how to write skills.

When you ask Claude Code to create a skill, it:

1. **Loads skill-builder** - The meta-skill activates automatically
2. **Applies best practices** - Follows conciseness, progressive disclosure, workflows
3. **Chooses right pattern** - Selects appropriate template (analysis, workflow, etc.)
4. **Generates valid structure** - Creates proper YAML frontmatter and organization
5. **Validates requirements** - Ensures name/description format is correct

### Example Interaction

**You ask:**
```
Create a skill for reviewing API designs
```

**Claude Code:**
1. Recognizes this is a skill creation request
2. Loads `.claude/skills/skill-builder/SKILL.md`
3. Determines this needs the "analysis-skill" pattern
4. Generates complete SKILL.md with:
   - Valid YAML frontmatter (`name: reviewing-api-designs`)
   - Specific description with triggers
   - Structured analysis process
   - Checklist workflow
   - Output template
   - Examples

**Result:** A production-ready skill following all best practices.

## Repository Structure

```
skilz/
├── README.md (You are here)
├── package.json (Node.js tooling)
│
├── .claude/
│   └── skills/
│       └── skill-builder/           # THE META-SKILL
│           ├── SKILL.md             # Main skill teaching Claude
│           ├── EVALUATIONS.md       # Testing guide
│           ├── evaluations.json     # 12 test cases
│           ├── best-practices.md    # Core principles
│           ├── structure-reference.md
│           ├── patterns.md          # Pattern library
│           ├── validation-rules.md
│           └── examples/            # Inline examples
│
├── docs/                            # Comprehensive documentation
│   ├── README.md
│   ├── best-practices-guide.md
│   ├── skill-structure.md
│   └── ...
│
├── templates/                       # 8 ready-to-use templates
│   ├── basic-skill/
│   ├── analysis-skill/
│   ├── generation-skill/
│   ├── workflow-skill/
│   ├── tool-restricted-skill/
│   ├── multi-file-skill/
│   ├── script-based-skill/
│   └── validation-skill/
│
├── examples/                        # Production-quality examples
│   └── code-reviewer/
│       ├── SKILL.md
│       └── README.md (design notes)
│
└── tools/                           # Validation and scaffolding
    ├── validate-skill.js
    ├── scaffold-skill.js
    ├── lint-skill.js
    └── test-skill.js
```

## What Makes Skills Effective?

The skill-builder teaches Claude these core principles:

### 1. Conciseness

Only include what Claude doesn't already know:
- ✗ Don't explain what PDFs are
- ✗ Don't explain how npm works
- ✓ Do provide specific commands
- ✓ Do document domain conventions

### 2. Appropriate Degrees of Freedom

Match specificity to task fragility:
- **High freedom**: Text instructions for flexible tasks
- **Medium freedom**: Pseudocode for preferred patterns
- **Low freedom**: Exact scripts for critical operations

### 3. Progressive Disclosure

Structure content for on-demand loading:
- SKILL.md as table of contents
- Details in separate files
- Claude reads only what's needed

### 4. Workflows and Feedback

For multi-step tasks:
- Provide checkbox checklists
- Clear validation points
- Validate → Fix → Repeat pattern

### 5. Testing and Evaluation

Comprehensive test suite ensures quality:
- **12 evaluation test cases** covering all skill aspects
- **Baseline comparison** to measure improvement
- **Success criteria** (10/12 passing = 83%)
- **Iteration guidance** for continuous improvement

See `.claude/skills/skill-builder/EVALUATIONS.md` for complete testing guide.

## Usage Examples

### Generate a Simple Skill

```
You: Create a skill for formatting JSON files

Claude: [Generates basic-skill pattern with proper structure]
```

### Generate an Analysis Skill

```
You: Create a skill for reviewing database schemas

Claude: [Generates analysis-skill pattern with:
- Structured review process
- Checkbox workflow
- Output template
- Finding categorization]
```

### Generate a Workflow Skill

```
You: Create a skill for deploying applications safely

Claude: [Generates workflow-skill pattern with:
- Multi-step process
- Validation at each step
- Error recovery
- Feedback loops]
```

### Validate Generated Skill

```bash
npm run validate .claude/skills/json-formatter
# ✓ All validations passed!
```

## Using Templates Directly

You can also copy templates manually:

```bash
# Copy template to your project
cp -r templates/analysis-skill .claude/skills/my-analyzer

# Edit SKILL.md
vim .claude/skills/my-analyzer/SKILL.md

# Validate
npm run validate .claude/skills/my-analyzer
```

## Available Templates

| Template | Use Case | Complexity | Key Features |
|----------|----------|------------|--------------|
| **basic-skill** | Simple instructions | Low | Single file, straightforward |
| **analysis-skill** | Code/data analysis | Medium | Structured review, categorization |
| **generation-skill** | Creating content | Medium | Templates, examples, style guides |
| **workflow-skill** | Multi-step processes | Medium-High | Checkboxes, validation, recovery |
| **tool-restricted-skill** | Read-only operations | Low-Medium | allowed-tools restriction |
| **multi-file-skill** | Complex capabilities | High | Progressive disclosure |
| **script-based-skill** | With utility scripts | Medium-High | Pre-built scripts, reliability |
| **validation-skill** | Plan-validate-execute | High | Error prevention, validation loops |

## Tools

### Validate Skill

Check technical requirements:

```bash
npm run validate path/to/skill
```

Validates:
- YAML frontmatter syntax
- Name format (lowercase, hyphens, max 64 chars)
- Description length (max 1024 chars)
- File paths (forward slashes)
- Referenced files exist
- No Windows-style paths

### Scaffold New Skill

Interactive skill generator:

```bash
npm run scaffold
```

Prompts for:
- Skill name
- Description
- Template choice
- Location (project vs personal)

### Lint Skill

Check best practices:

```bash
npm run lint path/to/skill
```

Checks:
- Markdown formatting
- Consistency
- Verbosity
- Anti-patterns

### Test Skill

Test skill behavior:

```bash
npm run test path/to/skill
```

Tests:
- Trigger recognition
- File navigation
- Workflow completeness

## Best Practices Summary

### Required Fields

```yaml
---
name: lowercase-with-hyphens
description: What it does and when to use it. Use when [triggers].
---
```

**name:**
- Lowercase, hyphens, max 64 chars
- No reserved words (anthropic, claude)
- Prefer gerund form: `processing-pdfs`, `analyzing-data`

**description:**
- Max 1024 chars, third person
- Include WHAT and WHEN
- Include trigger keywords

### Content Guidelines

- SKILL.md under 500 lines
- Forward slashes in all paths
- References one level deep from SKILL.md
- Consistent terminology
- Concrete examples
- No time-sensitive information

### Patterns

**Template Pattern:** Structure output format
**Examples Pattern:** Show input/output pairs
**Workflow Pattern:** Multi-step with checkboxes
**Validation Pattern:** Plan-validate-execute

## Documentation

Complete guides in `docs/`:

- **[best-practices-guide.md](docs/best-practices-guide.md)** - Complete authoring guide
- **[skill-structure.md](docs/skill-structure.md)** - Technical specifications
- **[progressive-disclosure.md](docs/progressive-disclosure.md)** - Content organization
- **[workflows-and-feedback.md](docs/workflows-and-feedback.md)** - Multi-step processes
- **[testing-and-evaluation.md](docs/testing-and-evaluation.md)** - Testing skills
- **[security-considerations.md](docs/security-considerations.md)** - Security guidelines

## Examples

Browse `examples/` for production-quality skills:

### code-reviewer

Complete read-only analysis skill demonstrating:
- Tool restrictions (`allowed-tools: Read, Grep, Glob`)
- Structured workflow with checklist
- Severity classification
- Concrete examples
- Appropriate conciseness

See `examples/code-reviewer/README.md` for detailed design notes.

## Real-World Usage

### Scenario 1: Building a Database Query Skill

```
You: Create a skill for building and optimizing PostgreSQL queries

Claude Code: [Generates skill with:
- Query construction patterns
- Optimization guidelines
- Index usage recommendations
- Performance analysis steps
- Common patterns reference]

You: npm run validate .claude/skills/postgres-queries

Output: ✓ All validations passed!
```

### Scenario 2: Building a Testing Skill

```
You: Create a skill for generating comprehensive test suites

Claude Code: [Generates generation-skill with:
- Test structure templates
- Coverage guidelines
- Mock/stub patterns
- Edge case considerations
- Examples for unit/integration tests]
```

### Scenario 3: Building a Deployment Skill

```
You: Create a skill for safely deploying to production

Claude Code: [Generates workflow-skill with:
- Pre-deployment checklist
- Validation at each step
- Rollback procedures
- Health checks
- Post-deployment verification]
```

## Key Benefits

### For You

- **No manual skill writing**: Describe what you need, get a complete skill
- **Best practices automatic**: Claude applies all guidelines
- **Consistent quality**: Every skill follows same standards
- **Quick iteration**: Generate, validate, test, refine

### For Your Team

- **Shared knowledge**: Package expertise as skills
- **Onboarding**: New team members get access to team skills
- **Consistency**: Everyone uses same approaches
- **Version control**: Skills tracked in git

## FAQ

### How does the skill-builder work?

It's a skill that Claude Code loads when you ask to create a skill. It contains all best practices, patterns, and requirements. Claude reads it and applies the knowledge to generate your skill.

### Do I need to understand skills to use this?

No! Just describe what you need. Claude handles the structure, formatting, and best practices automatically.

### Can I modify generated skills?

Yes! Generated skills are starting points. Edit them to fit your specific needs.

### How do I share skills with my team?

Put skills in `.claude/skills/` in your project repository. Anyone who clones the repo gets the skills.

### What if validation fails?

The validator provides specific error messages. Fix the issues it identifies and validate again.

### Can I create skills for specific programming languages?

Yes! Describe language-specific patterns and Claude will incorporate them.

### How do I update the skill-builder?

Pull the latest version of this repository to get updates to the meta-skill, templates, and tools.

## Contributing

Found a useful pattern? Have a great example?

1. Document your pattern
2. Create a reusable template
3. Add comprehensive examples
4. Submit a pull request

## Resources

- **Anthropic Docs**: [Skills Overview](https://docs.claude.com/docs/agents-and-tools/agent-skills)
- **Best Practices**: [Skill Authoring Guide](https://docs.claude.com/docs/agents-and-tools/agent-skills/best-practices)
- **Claude Cookbooks**: [Skills Examples](https://github.com/anthropics/claude-cookbooks/tree/main/skills)

## Next Steps

1. **Try it**: Ask Claude Code to "create a skill for [your use case]"
2. **Validate**: Run `npm run validate` on the generated skill
3. **Use it**: The skill activates automatically when relevant
4. **Iterate**: Refine based on usage
5. **Share**: Commit skills to your project for team access

## License

MIT

## Support

- Documentation: See `docs/` directory
- Examples: See `examples/` directory
- Issues: Open a GitHub issue
- Questions: Check documentation first

---

**Happy skill building!** 🚀

The skill-builder skill is ready to generate high-quality, best-practice-compliant skills for all your needs.
