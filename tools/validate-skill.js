#!/usr/bin/env node

/**
 * Skill Validation Tool
 *
 * Validates Claude Code skills against technical requirements and best practices.
 *
 * Usage: node tools/validate-skill.js <skill-path>
 * Example: node tools/validate-skill.js .claude/skills/my-skill
 */

const fs = require('fs');
const path = require('path');

class SkillValidator {
  constructor(skillPath) {
    this.skillPath = skillPath;
    this.errors = [];
    this.warnings = [];
    this.skillMdPath = path.join(skillPath, 'SKILL.md');
  }

  validate() {
    console.log(`\nValidating skill at: ${this.skillPath}\n`);

    // Check if directory exists
    if (!fs.existsSync(this.skillPath)) {
      this.errors.push(`Skill directory does not exist: ${this.skillPath}`);
      return this.report();
    }

    // Check if SKILL.md exists
    if (!fs.existsSync(this.skillMdPath)) {
      this.errors.push('SKILL.md file is required but not found');
      return this.report();
    }

    const content = fs.readFileSync(this.skillMdPath, 'utf-8');

    // Validate frontmatter
    this.validateFrontmatter(content);

    // Validate file structure
    this.validateFileStructure(content);

    // Validate content
    this.validateContent(content);

    // Validate references
    this.validateReferences(content);

    return this.report();
  }

  validateFrontmatter(content) {
    // Check for frontmatter
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      this.errors.push('YAML frontmatter is required but not found');
      return;
    }

    const frontmatter = match[1];

    // Parse frontmatter
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

    // Validate name field
    if (!nameMatch) {
      this.errors.push('name field is required in frontmatter');
    } else {
      const name = nameMatch[1].trim();
      this.validateName(name);
    }

    // Validate description field
    if (!descMatch) {
      this.errors.push('description field is required in frontmatter');
    } else {
      const description = descMatch[1].trim();
      this.validateDescription(description);
    }

    // Check for allowed-tools (optional)
    const allowedToolsMatch = frontmatter.match(/^allowed-tools:\s*(.+)$/m);
    if (allowedToolsMatch) {
      const tools = allowedToolsMatch[1].trim();
      this.validateAllowedTools(tools);
    }
  }

  validateName(name) {
    // Check length
    if (name.length > 64) {
      this.errors.push(`name is too long: ${name.length} chars (max 64)`);
    }

    // Check format (lowercase, numbers, hyphens only)
    if (!/^[a-z0-9-]+$/.test(name)) {
      this.errors.push('name must contain only lowercase letters, numbers, and hyphens');
    }

    // Check for reserved words
    if (/anthropic|claude/i.test(name)) {
      this.errors.push('name cannot contain reserved words: "anthropic", "claude"');
    }

    // Check for XML tags
    if (/<|>/.test(name)) {
      this.errors.push('name cannot contain XML tags');
    }

    // Check if not too vague
    const vagueNames = ['helper', 'utils', 'tools', 'skill'];
    if (vagueNames.includes(name)) {
      this.warnings.push(`name "${name}" is too vague, consider a more specific name`);
    }

    console.log(`✓ name field valid: ${name}`);
  }

  validateDescription(description) {
    // Check length
    if (description.length > 1024) {
      this.errors.push(`description is too long: ${description.length} chars (max 1024)`);
    }

    // Check not empty
    if (description.trim().length === 0) {
      this.errors.push('description cannot be empty');
    }

    // Check for XML tags
    if (/<|>/.test(description)) {
      this.errors.push('description cannot contain XML tags');
    }

    // Check for first/second person (should be third person)
    if (/\b(I|me|my|you|your)\b/i.test(description)) {
      this.warnings.push('description should use third person, not first or second person');
    }

    // Check if includes "use when"
    if (!/use when/i.test(description)) {
      this.warnings.push('description should include "Use when..." to specify triggers');
    }

    console.log(`✓ description field valid (${description.length} chars)`);
  }

  validateAllowedTools(tools) {
    const validTools = [
      'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash',
      'Task', 'WebFetch', 'WebSearch'
    ];

    const toolList = tools.split(/[,\s]+/).filter(t => t.length > 0);

    toolList.forEach(tool => {
      if (!validTools.includes(tool)) {
        this.warnings.push(`Unknown tool in allowed-tools: ${tool}`);
      }
    });

    console.log(`✓ allowed-tools field valid: ${tools}`);
  }

  validateFileStructure(content) {
    const lines = content.split('\n');
    const bodyLines = lines.slice(lines.findIndex(l => l === '---', 1) + 1);
    const bodyLineCount = bodyLines.length;

    if (bodyLineCount > 500) {
      this.warnings.push(`SKILL.md is ${bodyLineCount} lines (recommended: <500). Consider using progressive disclosure.`);
    } else {
      console.log(`✓ SKILL.md length: ${bodyLineCount} lines`);
    }
  }

  validateContent(content) {
    // Check for Windows-style paths
    const backslashPattern = /[^`]\\[^n\\r\\t\s]/;
    if (backslashPattern.test(content)) {
      const matches = content.match(/\\.+/g);
      this.errors.push(`Windows-style paths found (use forward slashes): ${matches ? matches[0] : ''}`);
    } else {
      console.log('✓ No Windows-style paths found');
    }

    // Check for time-sensitive information
    const timePatterns = [
      /before \d{4}/i,
      /after \d{4}/i,
      /until \d{4}/i,
      /as of \d{4}/i
    ];

    timePatterns.forEach(pattern => {
      if (pattern.test(content)) {
        this.warnings.push('Time-sensitive information detected. Consider using "Old Patterns" section instead.');
      }
    });
  }

  validateReferences(content) {
    // Find all markdown links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    const references = [];

    while ((match = linkRegex.exec(content)) !== null) {
      const linkPath = match[2];

      // Skip external links
      if (linkPath.startsWith('http://') || linkPath.startsWith('https://')) {
        continue;
      }

      // Skip anchors
      if (linkPath.startsWith('#')) {
        continue;
      }

      references.push(linkPath);
    }

    // Check if referenced files exist
    references.forEach(ref => {
      const refPath = path.join(this.skillPath, ref);
      if (!fs.existsSync(refPath)) {
        this.errors.push(`Referenced file does not exist: ${ref}`);
      }
    });

    if (references.length > 0) {
      console.log(`✓ ${references.length} file reference(s) found and validated`);
    }
  }

  report() {
    console.log('\n' + '='.repeat(50));
    console.log('VALIDATION RESULTS');
    console.log('='.repeat(50) + '\n');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✓ All validations passed!');
      console.log('✓ Skill is ready to use');
      return true;
    }

    if (this.errors.length > 0) {
      console.log(`✗ Found ${this.errors.length} error(s):\n`);
      this.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log(`⚠ Found ${this.warnings.length} warning(s):\n`);
      this.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
      console.log('');
    }

    if (this.errors.length > 0) {
      console.log('✗ Validation failed. Please fix errors before using this skill.');
      return false;
    } else {
      console.log('⚠ Validation passed with warnings. Review warnings for best practices.');
      return true;
    }
  }
}

// Main execution
if (require.main === module) {
  const skillPath = process.argv[2];

  if (!skillPath) {
    console.error('Usage: node validate-skill.js <skill-path>');
    console.error('Example: node validate-skill.js .claude/skills/my-skill');
    process.exit(1);
  }

  const validator = new SkillValidator(skillPath);
  const success = validator.validate();

  process.exit(success ? 0 : 1);
}

module.exports = SkillValidator;
