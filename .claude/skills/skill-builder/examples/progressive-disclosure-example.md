# Progressive Disclosure Example

This example shows how to structure a skill that grows from simple to complex.

## Scenario

You're creating a skill for working with a BigQuery database that has:
- Multiple departments (finance, sales, marketing, product)
- Dozens of tables per department
- Complex schemas and relationships
- Common query patterns

## Bad Approach: Everything in SKILL.md

```markdown
---
name: bigquery-analysis
description: Analyzes BigQuery data across all departments
---

# BigQuery Analysis

## Finance Department

### Revenue Table
Schema:
- customer_id (STRING)
- amount (NUMERIC)
- transaction_date (DATE)
- payment_method (STRING)
[... 50 more lines of finance schemas ...]

## Sales Department

### Opportunities Table
Schema:
- opp_id (STRING)
- account_id (STRING)
[... 50 more lines of sales schemas ...]

## Marketing Department

### Campaigns Table
[... 50 more lines of marketing schemas ...]

## Product Department

### API Usage Table
[... 50 more lines of product schemas ...]

## Common Queries

[... 100 lines of example queries ...]
```

**Problems:**
- SKILL.md is 800+ lines
- Loads all department data even if user only needs finance
- Difficult to navigate
- High token cost for simple queries

## Good Approach: Progressive Disclosure

### Directory Structure

```
bigquery-analysis/
├── SKILL.md              # Overview and navigation (200 lines)
├── quickstart.md         # Common patterns (100 lines)
└── reference/
    ├── finance.md        # Finance schemas and queries
    ├── sales.md          # Sales schemas and queries
    ├── marketing.md      # Marketing schemas and queries
    └── product.md        # Product schemas and queries
```

### SKILL.md (The Table of Contents)

```markdown
---
name: bigquery-analysis
description: Analyzes BigQuery data across finance, sales, marketing, and product departments. Use when querying data, creating reports, or analyzing metrics from the data warehouse.
---

# BigQuery Analysis

## Quick Start

Connect to BigQuery:

\`\`\`python
from google.cloud import bigquery

client = bigquery.Client(project="project-id")
query = "SELECT * FROM dataset.table LIMIT 10"
results = client.query(query).result()
\`\`\`

## Department-Specific Guides

**Finance**: Revenue, ARR, billing metrics → See [reference/finance.md](reference/finance.md)
**Sales**: Opportunities, pipeline, accounts → See [reference/sales.md](reference/sales.md)
**Marketing**: Campaigns, attribution, email → See [reference/marketing.md](reference/marketing.md)
**Product**: API usage, features, adoption → See [reference/product.md](reference/product.md)

## Common Patterns

See [quickstart.md](quickstart.md) for:
- Joining tables across datasets
- Date filtering patterns
- Aggregation queries
- Performance optimization tips

## Quick Search

Find specific tables or metrics:

\`\`\`bash
# Search for revenue-related tables
grep -i "revenue" reference/finance.md

# Find pipeline metrics
grep -i "pipeline" reference/sales.md
\`\`\`

## Data Dictionary

Each department guide includes:
- Table schemas with field descriptions
- Common query patterns
- Filtering rules (e.g., exclude test accounts)
- Join patterns
- Example queries
```

### reference/finance.md (Loaded Only When Needed)

```markdown
# Finance Department Data Reference

## Contents
- [Revenue Table](#revenue-table)
- [Billing Table](#billing-table)
- [ARR Calculation](#arr-calculation)
- [Common Queries](#common-queries)

## Revenue Table

**Dataset:** `analytics.revenue`

**Schema:**
- `customer_id` (STRING): Unique customer identifier
- `amount` (NUMERIC): Transaction amount in USD
- `transaction_date` (DATE): Date of transaction
- `payment_method` (STRING): Values: 'card', 'wire', 'ach'
- `status` (STRING): Values: 'completed', 'pending', 'failed'

**Filtering Rules:**
- **Always** exclude test customers: `WHERE customer_id NOT LIKE 'test_%'`
- **Always** filter to completed transactions unless analyzing failures

**Common Query:**
\`\`\`sql
SELECT
  DATE_TRUNC(transaction_date, MONTH) as month,
  SUM(amount) as total_revenue
FROM analytics.revenue
WHERE
  customer_id NOT LIKE 'test_%'
  AND status = 'completed'
  AND transaction_date >= '2024-01-01'
GROUP BY month
ORDER BY month DESC
\`\`\`

## Billing Table

[... more finance-specific content ...]
```

### quickstart.md (Common Patterns)

```markdown
# BigQuery Quick Start

## Common Query Patterns

### Date Filtering

Current month:
\`\`\`sql
WHERE DATE_TRUNC(date_field, MONTH) = DATE_TRUNC(CURRENT_DATE(), MONTH)
\`\`\`

Last 90 days:
\`\`\`sql
WHERE date_field >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
\`\`\`

## Joining Tables

Standard join pattern:
\`\`\`sql
SELECT
  t1.field1,
  t2.field2
FROM analytics.table1 t1
LEFT JOIN analytics.table2 t2
  ON t1.id = t2.foreign_id
\`\`\`

[... more common patterns ...]
```

## How This Works in Practice

### Scenario 1: User Asks About Revenue

**User:** "Show me revenue by month for Q4"

**Claude's behavior:**
1. Skill-builder skill triggers based on description
2. Reads SKILL.md (200 lines) - sees finance reference
3. Reads reference/finance.md (only finance data)
4. Writes query following the finance patterns
5. **Token cost:** ~500 tokens instead of 2000+

### Scenario 2: User Asks About Multiple Departments

**User:** "Compare marketing spend to revenue generated"

**Claude's behavior:**
1. Reads SKILL.md
2. Reads reference/finance.md (for revenue)
3. Reads reference/marketing.md (for spend)
4. Writes cross-department query
5. **Token cost:** ~800 tokens (still less than loading everything)

### Scenario 3: User Asks Common Pattern Question

**User:** "How do I filter to last 30 days?"

**Claude's behavior:**
1. Reads SKILL.md
2. Reads quickstart.md (sees date filtering section)
3. Provides pattern
4. **Token cost:** ~350 tokens (SKILL.md + quickstart.md)

## Key Benefits

1. **Efficiency**: Only load what's needed
2. **Scalability**: Can add new departments without bloating SKILL.md
3. **Maintainability**: Update one department without affecting others
4. **Navigation**: Clear structure makes it easy for Claude to find information
5. **Performance**: Faster loading, lower token costs

## Pattern Summary

**Level 1: SKILL.md (always loaded)**
- High-level overview
- Navigation to specialized content
- Most common 80% use case inline

**Level 2: Domain files (loaded when relevant)**
- Detailed schemas
- Domain-specific patterns
- Complex examples

**Level 3: Advanced/reference files (loaded rarely)**
- Edge cases
- Advanced optimization
- Deep technical details

## Another Example: API Skill

```
api-integration/
├── SKILL.md              # Overview, basic usage
├── authentication.md     # Auth patterns (loaded if auth mentioned)
├── reference/
│   ├── users-api.md      # User endpoints
│   ├── payments-api.md   # Payment endpoints
│   └── webhooks-api.md   # Webhook endpoints
└── examples/
    ├── common-flows.md
    └── error-handling.md
```

**User asks:** "How do I create a user?"
- Claude reads: SKILL.md + reference/users-api.md

**User asks:** "How does authentication work?"
- Claude reads: SKILL.md + authentication.md

**User asks:** "Show me common API patterns?"
- Claude reads: SKILL.md + examples/common-flows.md

Each query loads only relevant content, keeping token costs low and responses focused.
