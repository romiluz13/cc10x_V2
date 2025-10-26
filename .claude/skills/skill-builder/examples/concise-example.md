# Conciseness Examples

## Example 1: PDF Text Extraction

### Bad - Too Verbose (150 tokens)

```markdown
## Extracting Text from PDF Files

PDF (Portable Document Format) files are a widely-used document format
that can contain text, images, and other content. When you need to extract
text from a PDF file, you'll need to use a specialized library because PDF
files have a complex internal structure. There are several Python libraries
available for PDF processing, but we recommend using pdfplumber because
it's relatively easy to use compared to alternatives and handles most
common cases quite well. Before you can use pdfplumber, you'll need to
install it using pip, Python's package manager.
```

### Good - Concise (50 tokens)

```markdown
## Extract PDF Text

Use pdfplumber for text extraction:

\`\`\`python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`
```

### Why It's Better

- Assumes Claude knows what PDFs are
- Assumes Claude knows how to install packages
- Provides the essential information: which library and how to use it
- Saves 100 tokens while being just as useful

## Example 2: Git Commit Messages

### Bad - Too Verbose (200 tokens)

```markdown
## Creating Good Commit Messages

A commit message is a short description that explains what changes you made
in a git commit. Good commit messages are important for several reasons. First,
they help other developers understand what was changed and why. Second, they
create a historical record of the project's evolution. Third, they make it easier
to find specific changes later when you need to review the project history.

When writing a commit message, you should follow a standard format. The first
line should be a brief summary of the changes, typically 50 characters or less.
This is called the "subject line." After the subject line, you can optionally
add a blank line followed by a more detailed explanation of the changes.
```

### Good - Concise (80 tokens)

```markdown
## Commit Message Format

Structure commits with a brief subject and optional detailed body:

\`\`\`
type(scope): brief summary (≤50 chars)

Detailed explanation of changes and reasoning.
\`\`\`

**Example:**
\`\`\`
feat(auth): implement JWT authentication

Add login endpoint with token validation and
refresh token support.
\`\`\`
```

### Why It's Better

- Assumes Claude understands version control
- Shows the pattern instead of explaining why it matters
- Provides concrete example
- Saves 120 tokens

## Example 3: API Error Handling

### Bad - Too Verbose (180 tokens)

```markdown
## Handling API Errors

When you make requests to an API, sometimes things can go wrong. The server
might be down, the network connection might fail, or you might send invalid
data. It's important to handle these errors properly so that your application
doesn't crash and users get helpful feedback about what went wrong.

Python provides a try-except mechanism for error handling. You should wrap
your API calls in a try block and then use except blocks to catch different
types of errors that might occur. Common errors include network timeouts,
connection errors, and HTTP errors with status codes like 404 or 500.
```

### Good - Concise (60 tokens)

```markdown
## Handle API Errors

Wrap API calls with error handling:

\`\`\`python
try:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()
except requests.Timeout:
    print("Request timed out")
except requests.HTTPError as e:
    print(f"HTTP error: {e.response.status_code}")
\`\`\`
```

### Why It's Better

- Assumes Claude knows about try-except
- Shows specific error handling patterns
- Demonstrates timeout configuration
- Saves 120 tokens

## Key Principles

### What to Assume Claude Knows

- Basic programming concepts (variables, functions, loops)
- Common file formats (PDF, JSON, CSV, XML)
- How package managers work (pip, npm)
- Standard software engineering practices
- Common libraries and tools in the ecosystem

### What to Include

- Specific commands and code
- Particular patterns or structures
- Domain-specific conventions
- Edge cases and gotchas
- Configuration values with rationale

### Challenge Each Sentence

Ask yourself:
1. "What happens if I remove this sentence?"
2. "Does this add new information Claude wouldn't have?"
3. "Could I show this with code instead of prose?"

### Show, Don't Tell

**Instead of:**
"You should validate user input before processing it to avoid security issues."

**Write:**
```python
def process_user_input(data):
    if not validate_input(data):
        raise ValueError("Invalid input format")
    return transform(data)
```

The code shows validation happening, no explanation needed.
