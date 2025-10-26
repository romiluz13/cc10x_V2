---
name: json-formatter
description: Formats, validates, and prettifies JSON files with consistent indentation and structure. Use when working with JSON files, API responses, or configuration files that need formatting or validation.
---

# JSON Formatter

Formats and validates JSON files with consistent structure and indentation.

## When to Use

Use this skill when the user wants to:
- Format messy or minified JSON
- Validate JSON syntax
- Standardize JSON indentation across files
- Convert between compact and pretty JSON

## Formatting

### Pretty Print

Use Python's json module for reliable formatting:

```python
import json

with open('file.json') as f:
    data = json.load(f)

with open('file.json', 'w') as f:
    json.dump(data, f, indent=2, sort_keys=True)
```

**Options**:
- `indent=2`: Two-space indentation (standard)
- `indent=4`: Four-space indentation (alternative)
- `sort_keys=True`: Alphabetical key order
- `ensure_ascii=False`: Preserve Unicode characters

### Minify

Remove all whitespace:

```python
import json

with open('file.json') as f:
    data = json.load(f)

with open('output.json', 'w') as f:
    json.dump(data, f, separators=(',', ':'))
```

## Validation

### Check Syntax

```python
import json

try:
    with open('file.json') as f:
        json.load(f)
    print("✓ Valid JSON")
except json.JSONDecodeError as e:
    print(f"✗ Invalid JSON: {e}")
```

### Validate and Report

```python
import json

def validate_json(filepath):
    try:
        with open(filepath) as f:
            data = json.load(f)
        return {
            "valid": True,
            "type": type(data).__name__,
            "size": len(str(data)),
            "keys": len(data) if isinstance(data, dict) else None
        }
    except json.JSONDecodeError as e:
        return {
            "valid": False,
            "error": str(e),
            "line": e.lineno,
            "column": e.colno
        }

result = validate_json('file.json')
print(result)
```

## Batch Operations

### Format All JSON in Directory

```bash
find . -name "*.json" -exec python -m json.tool {} {}.tmp \; -exec mv {}.tmp {} \;
```

Or with Python:

```python
import json
from pathlib import Path

for json_file in Path('.').rglob('*.json'):
    with open(json_file) as f:
        data = json.load(f)

    with open(json_file, 'w') as f:
        json.dump(data, f, indent=2, sort_keys=True)

    print(f"✓ Formatted {json_file}")
```

## Common Issues

### Trailing Commas

JSON doesn't allow trailing commas. Fix:

```python
import re

def remove_trailing_commas(text):
    # Remove commas before closing brackets/braces
    text = re.sub(r',\s*}', '}', text)
    text = re.sub(r',\s*]', ']', text)
    return text

with open('file.json') as f:
    content = f.read()

cleaned = remove_trailing_commas(content)
data = json.loads(cleaned)

with open('file.json', 'w') as f:
    json.dump(data, f, indent=2)
```

### Comments

JSON doesn't support comments. Remove before parsing:

```python
import re
import json

def strip_comments(text):
    # Remove // comments
    text = re.sub(r'//.*?$', '', text, flags=re.MULTILINE)
    # Remove /* */ comments
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    return text

with open('file.jsonc') as f:
    content = strip_comments(f.read())

data = json.loads(content)

with open('file.json', 'w') as f:
    json.dump(data, f, indent=2)
```

## Standard Configuration

For consistent formatting across projects:

```python
# config.py
JSON_FORMAT_OPTIONS = {
    'indent': 2,
    'sort_keys': True,
    'ensure_ascii': False,
    'separators': (',', ': ')
}

# Usage
with open('file.json', 'w') as f:
    json.dump(data, f, **JSON_FORMAT_OPTIONS)
```

## Validation Rules

When validating JSON structure:

1. Check syntax first (catches obvious errors)
2. Verify expected type (object vs array)
3. Check required keys (if applicable)
4. Validate value types (if schema known)

Example:

```python
def validate_config(data):
    required_keys = ['name', 'version', 'settings']

    if not isinstance(data, dict):
        return False, "Must be an object"

    for key in required_keys:
        if key not in data:
            return False, f"Missing required key: {key}"

    return True, "Valid"

with open('config.json') as f:
    data = json.load(f)

valid, message = validate_config(data)
print(f"{'✓' if valid else '✗'} {message}")
```
