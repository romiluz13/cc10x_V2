# Contributing to Skilz

We welcome contributions! Here's how to help improve the skill-builder repository.

## What Can You Contribute?

### 1. New Templates

Found a useful skill pattern not covered by existing templates?

**Steps:**
1. Create a new directory in `templates/`
2. Write a complete SKILL.md demonstrating the pattern
3. Include README explaining when to use it
4. Add to template list in main README

**Good candidates:**
- Integration patterns (APIs, databases, services)
- Testing patterns (specific frameworks or approaches)
- Documentation patterns (specific styles or formats)
- Deployment patterns (specific platforms or strategies)

### 2. Example Skills

Built a great skill you want to share?

**Steps:**
1. Create directory in `examples/`
2. Include complete, working SKILL.md
3. Add README.md with:
   - Design decisions
   - Why it demonstrates best practices
   - Usage examples
   - Testing scenarios
4. Ensure it passes validation

**Good examples:**
- Domain-specific skills (finance, legal, healthcare)
- Framework-specific skills (React, Django, Spring)
- Tool-specific skills (Docker, Kubernetes, CI/CD)

### 3. Documentation Improvements

Found something unclear or missing?

**Steps:**
1. Identify the documentation file
2. Make improvements
3. Ensure consistency with other docs
4. Add examples if helpful

**Areas to improve:**
- Clarify confusing explanations
- Add more examples
- Fix typos or errors
- Improve organization

### 4. Tool Enhancements

Ideas for better validation or scaffolding?

**Steps:**
1. Discuss in an issue first
2. Implement the enhancement
3. Add tests if applicable
4. Update tool documentation

**Enhancement ideas:**
- Additional validation rules
- Better error messages
- New scaffolding options
- Performance improvements

### 5. Meta-Skill Improvements

Better ways to teach Claude about skills?

**Steps:**
1. Propose change in an issue
2. Discuss impact on skill generation
3. Update skill-builder/SKILL.md
4. Test with various skill types
5. Update supporting files if needed

**Improvement areas:**
- Additional patterns
- Better explanations
- More examples
- New best practices

## Contribution Guidelines

### Before Contributing

1. **Check existing issues** - Someone might be working on it
2. **Open an issue first** - Discuss major changes
3. **Review existing patterns** - Maintain consistency

### Making Changes

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Maintain consistency
   - Add examples
   - Update documentation

4. **Test your changes**
   ```bash
   # For templates
   npm run validate templates/your-template

   # For examples
   npm run validate examples/your-example

   # For tools
   node tools/your-tool.js test-case
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "Add: [description]"
   git commit -m "Fix: [description]"
   git commit -m "Improve: [description]"
   ```

6. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Guidelines

**Title format:**
- `Add: [what you added]`
- `Fix: [what you fixed]`
- `Improve: [what you improved]`

**Description should include:**
- What changes were made
- Why they were made
- How they were tested
- Any breaking changes
- Related issues

**Example:**
```markdown
## Add: SQL Query Builder Template

### Changes
- New template for SQL query construction
- Includes query optimization guidelines
- Demonstrates validation pattern

### Why
- Common use case not covered by existing templates
- Requested in issue #42

### Testing
- Created example skill using template
- Validated with `npm run validate`
- Tested query construction patterns

### Related Issues
- Closes #42
```

## Quality Standards

### For Templates

- [ ] Complete SKILL.md with frontmatter
- [ ] Passes validation (`npm run validate`)
- [ ] Clear when-to-use guidance
- [ ] Demonstrates best practices
- [ ] Includes examples
- [ ] README explains pattern

### For Examples

- [ ] Production-quality skill
- [ ] Demonstrates specific pattern
- [ ] Passes validation
- [ ] README with design notes
- [ ] Clear learning objectives
- [ ] Real-world applicability

### For Documentation

- [ ] Clear and concise
- [ ] Consistent with existing docs
- [ ] Includes examples
- [ ] Proper markdown formatting
- [ ] No typos or errors

### For Tools

- [ ] Works as documented
- [ ] Handles errors gracefully
- [ ] Provides helpful messages
- [ ] Consistent with other tools
- [ ] Code is readable

### For Meta-Skill Changes

- [ ] Maintains existing functionality
- [ ] Tested with multiple skill types
- [ ] Supporting files updated
- [ ] Documentation updated
- [ ] Examples still valid

## Review Process

1. **Automated checks** run on PR
2. **Manual review** by maintainer
3. **Feedback** provided if needed
4. **Iteration** until approved
5. **Merge** when ready

## Recognition

Contributors are recognized in:
- README acknowledgments
- Release notes
- Commit history

## Questions?

- Open an issue for discussion
- Check existing documentation
- Review similar contributions

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on improving the project
- Accept feedback graciously

## Thank You!

Every contribution helps make Skilz better for everyone. We appreciate your time and effort!
