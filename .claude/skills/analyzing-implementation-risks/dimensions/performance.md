# Dimension 6: Performance & Scalability

## Overview

Performance isn't just speed - it's about resource efficiency and scaling behavior. Analyze computational complexity, data volume handling, and resource usage.

## Analysis Questions

### Computational Complexity
- **Big O notation:** What's the algorithmic complexity?
- **Nested loops:** Are there O(n²) or worse patterns?
- **Recursion:** Are there unbounded recursive calls?
- **Repeated computation:** Is work being duplicated unnecessarily?

### Data Volume
- **Zero items:** Does it work with empty collections?
- **One item:** Edge case for single-item collections?
- **Typical scale:** Works with expected data size?
- **Large scale:** 1,000 items? 1,000,000 items?
- **Huge items:** Individual items with large size (10MB strings)?
- **Pagination:** Is data paginated/streamed for large sets?

### Resource Usage
- **Memory:** Can this cause memory leaks?
- **CPU:** Does this block the main thread?
- **Network:** How much bandwidth is consumed?
- **Storage:** Can this fill up disk space?
- **Connections:** Are database/API connections pooled?

### Optimization Opportunities
- **Caching:** Can results be cached?
- **Memoization:** Can expensive computations be memoized?
- **Debouncing:** Should this be debounced/throttled?
- **Lazy loading:** Can operations be done lazily?
- **Eager loading:** Should data be prefetched?

## Computational Complexity Analysis

### Common Complexity Classes

**O(1) - Constant**
- Array access by index
- Hash table lookup
- Best case scenario

**O(log n) - Logarithmic**
- Binary search
- Balanced tree operations
- Very scalable

**O(n) - Linear**
- Single loop through array
- Acceptable for most cases
- Watch for hidden loops in library calls

**O(n log n) - Linearithmic**
- Efficient sorting algorithms (merge sort, quicksort)
- Good for sorting operations

**O(n²) - Quadratic**
- Nested loops
- Starts to slow down with large n
- Red flag if avoidable

**O(2ⁿ) - Exponential**
- Recursive algorithms without memoization
- Combinatorial problems
- Usually unacceptable

### Example 1: Quadratic Complexity

```javascript
// SLOW O(n²):
function findDuplicates(array1, array2) {
  const duplicates = [];

  for (const item1 of array1) {
    for (const item2 of array2) {  // Nested loop!
      if (item1 === item2) {
        duplicates.push(item1);
      }
    }
  }

  return duplicates;
}
// With 1000 items each: 1,000,000 comparisons!

// FAST O(n):
function findDuplicates(array1, array2) {
  const set2 = new Set(array2);  // O(n) to build
  const duplicates = [];

  for (const item of array1) {  // O(n) to iterate
    if (set2.has(item)) {       // O(1) lookup
      duplicates.push(item);
    }
  }

  return duplicates;
}
// With 1000 items each: 2,000 operations (500x faster!)
```

### Example 2: Unbounded Recursion

```javascript
// DANGEROUS (stack overflow):
function factorial(n) {
  return n * factorial(n - 1);  // No base case!
}

// SAFE:
function factorial(n) {
  if (n <= 1) return 1;  // Base case
  if (n > 170) throw new Error('Result too large');  // Limit
  return n * factorial(n - 1);
}

// BETTER (iterative):
function factorial(n) {
  if (n <= 1) return 1;
  if (n > 170) throw new Error('Result too large');

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
```

### Example 3: Repeated Computation

```javascript
// INEFFICIENT (recalculating):
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);  // Exponential!
}
// fibonacci(40) = 331,160,281 function calls!

// EFFICIENT (memoization):
const memo = new Map();

function fibonacci(n) {
  if (n <= 1) return n;

  if (memo.has(n)) {
    return memo.get(n);  // Return cached result
  }

  const result = fibonacci(n - 1) + fibonacci(n - 2);
  memo.set(n, result);
  return result;
}
// fibonacci(40) = 79 function calls (4 million times faster!)
```

## Data Volume Issues

### Issue 1: Loading All Items

```javascript
// BREAKS WITH LARGE DATA:
async function getUsers() {
  const users = await db.users.findAll();  // Loads ALL users into memory
  return users;
}
// With 1M users: Out of memory!

// SCALABLE (pagination):
async function getUsers(page = 1, pageSize = 50) {
  const offset = (page - 1) * pageSize;

  const [users, total] = await Promise.all([
    db.users.findMany({
      limit: pageSize,
      offset: offset,
      orderBy: { createdAt: 'desc' }
    }),
    db.users.count()
  ]);

  return {
    users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}

// Alternative: Cursor-based pagination (better for real-time data):
async function getUsers(cursor, pageSize = 50) {
  const users = await db.users.findMany({
    take: pageSize,
    skip: cursor ? 1 : 0,  // Skip the cursor item
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' }
  });

  return {
    users,
    nextCursor: users.length === pageSize ? users[users.length - 1].id : null
  };
}
```

### Issue 2: N+1 Query Problem

```javascript
// INEFFICIENT (N+1 queries):
async function getPostsWithAuthors() {
  const posts = await db.posts.findAll();  // 1 query

  for (const post of posts) {
    post.author = await db.users.findById(post.authorId);  // N queries!
  }

  return posts;
}
// With 100 posts: 101 database queries!

// EFFICIENT (eager loading):
async function getPostsWithAuthors() {
  const posts = await db.posts.findAll({
    include: {
      author: true  // Single JOIN query
    }
  });

  return posts;
}
// With 100 posts: 1 database query!

// Alternative: DataLoader (batching):
const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (userIds) => {
  const users = await db.users.findMany({
    where: { id: { in: userIds } }
  });

  // Return in same order as requested:
  return userIds.map(id => users.find(u => u.id === id));
});

async function getPostsWithAuthors() {
  const posts = await db.posts.findAll();

  // Batches all user requests into single query:
  for (const post of posts) {
    post.author = await userLoader.load(post.authorId);
  }

  return posts;
}
```

### Issue 3: Large File Uploads

```javascript
// BREAKS WITH LARGE FILES (loads entire file into memory):
app.post('/upload', async (req, res) => {
  const fileContent = await req.file.buffer;  // Entire file in RAM!
  await processFile(fileContent);
});

// SCALABLE (streaming):
app.post('/upload', async (req, res) => {
  const writeStream = fs.createWriteStream('/tmp/upload');

  req.pipe(writeStream);  // Stream to disk

  writeStream.on('finish', async () => {
    await processFileStream('/tmp/upload');  // Process in chunks
  });
});

// Process in chunks:
async function processFileStream(filePath) {
  const readStream = fs.createReadStream(filePath, {
    highWaterMark: 64 * 1024  // 64KB chunks
  });

  for await (const chunk of readStream) {
    await processChunk(chunk);  // Process one chunk at a time
  }
}
```

## Resource Usage Monitoring

### Memory Leaks

Common causes:
- **Global variables:** Accumulating data in global scope
- **Event listeners:** Not removed when component unmounts
- **Timers:** `setInterval` not cleared
- **Closures:** Capturing large objects unnecessarily
- **Caches:** Growing unbounded without eviction

**Example leak:**
```javascript
// LEAKS MEMORY:
let cache = {};

function getData(key) {
  if (!cache[key]) {
    cache[key] = expensiveOperation(key);  // Cache grows forever!
  }
  return cache[key];
}

// SAFE (LRU cache with size limit):
const LRU = require('lru-cache');

const cache = new LRU({
  max: 500,  // Max 500 entries
  maxAge: 1000 * 60 * 60  // 1 hour TTL
});

function getData(key) {
  let value = cache.get(key);

  if (!value) {
    value = expensiveOperation(key);
    cache.set(key, value);
  }

  return value;
}
```

### CPU Blocking

```javascript
// BLOCKS MAIN THREAD (bad UX):
function processLargeDataset(data) {
  for (let i = 0; i < 1000000; i++) {
    // Expensive computation blocks everything
    data[i] = complexCalculation(data[i]);
  }
  return data;
}

// NON-BLOCKING (chunked processing):
async function processLargeDataset(data) {
  const chunkSize = 1000;

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);

    // Process chunk:
    for (let j = 0; j < chunk.length; j++) {
      chunk[j] = complexCalculation(chunk[j]);
    }

    // Yield to event loop:
    await new Promise(resolve => setTimeout(resolve, 0));

    // Update progress:
    updateProgress(i / data.length * 100);
  }

  return data;
}

// BETTER (Web Workers):
// main.js:
const worker = new Worker('worker.js');
worker.postMessage(data);

worker.onmessage = (e) => {
  const result = e.data;  // Doesn't block main thread!
};

// worker.js:
self.onmessage = (e) => {
  const data = e.data;
  const result = processLargeDataset(data);
  self.postMessage(result);
};
```

### Database Connection Pooling

```javascript
// INEFFICIENT (new connection per request):
async function getUser(userId) {
  const connection = await mysql.createConnection({...});  // Slow!
  const user = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
  await connection.end();
  return user;
}

// EFFICIENT (connection pool):
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'myapp',
  connectionLimit: 10,  // Max 10 concurrent connections
  queueLimit: 0         // No limit on waiting queries
});

async function getUser(userId) {
  const connection = await pool.getConnection();  // Reuses existing connection

  try {
    const user = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    return user;
  } finally {
    connection.release();  // Return to pool
  }
}
```

## Caching Strategies

### Cache Levels
1. **Browser cache:** Static assets (images, CSS, JS)
2. **CDN cache:** Edge caching for global distribution
3. **Application cache:** In-memory (Redis, Memcached)
4. **Database cache:** Query result caching
5. **CPU cache:** Hardware-level (automatic)

### Cache Invalidation

```javascript
// Simple TTL-based cache:
const cache = new Map();

function getCachedData(key) {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < 60000) {  // 1 min TTL
    return cached.value;
  }

  const value = fetchData(key);
  cache.set(key, { value, timestamp: Date.now() });
  return value;
}

// Tag-based invalidation:
class Cache {
  constructor() {
    this.data = new Map();
    this.tags = new Map();
  }

  set(key, value, tags = []) {
    this.data.set(key, value);

    for (const tag of tags) {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag).add(key);
    }
  }

  get(key) {
    return this.data.get(key);
  }

  invalidateTag(tag) {
    const keys = this.tags.get(tag) || [];
    for (const key of keys) {
      this.data.delete(key);
    }
    this.tags.delete(tag);
  }
}

// Usage:
cache.set('user:123', userData, ['user', 'user:123']);
cache.set('user:123:posts', posts, ['user', 'user:123', 'posts']);

// Invalidate all user-related caches:
cache.invalidateTag('user:123');
```

## Performance Testing Checklist

- [ ] **Baseline performance:** Measure current performance
- [ ] **Load testing:** Test with expected concurrent users
- [ ] **Stress testing:** Test beyond expected limits
- [ ] **Spike testing:** Test sudden traffic spikes
- [ ] **Endurance testing:** Test sustained load over time
- [ ] **Scalability testing:** Test horizontal/vertical scaling
- [ ] **Database indexes:** Verify indexes on queried columns
- [ ] **Query optimization:** Use EXPLAIN to analyze queries
- [ ] **Caching effectiveness:** Measure cache hit rates
- [ ] **Resource monitoring:** Track CPU, memory, network, disk

---

**Key Principle:** Measure, don't guess. Profile before optimizing. Optimize the bottleneck, not everything.
