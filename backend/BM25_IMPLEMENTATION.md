# BM25 Search Implementation

## Overview

This project now uses the **BM25 (Best Matching 25)** algorithm for intelligent product search. BM25 is a probabilistic ranking function widely used in information retrieval systems and is considered one of the most effective text search algorithms.

## What is BM25?

BM25 (Best Matching 25) is a ranking function used by search engines to estimate the relevance of documents to a given search query. It's an improvement over basic TF-IDF (Term Frequency-Inverse Document Frequency) and is the foundation of many modern search systems.

### Key Advantages

1. **Relevance Ranking**: Returns results ordered by relevance, not just presence of search terms
2. **Term Saturation**: Handles repeated terms intelligently (diminishing returns)
3. **Length Normalization**: Adjusts for document length to avoid bias
4. **Multi-field Search**: Searches across multiple fields with different weights
5. **No Database LIKE Overhead**: More efficient than SQL LIKE queries for complex searches

## Algorithm Components

### 1. The BM25 Formula

```
score(D,Q) = Σ IDF(qi) × (f(qi,D) × (k1 + 1)) / (f(qi,D) + k1 × (1 - b + b × |D| / avgdl))
```

Where:
- **D** = Document being scored
- **Q** = Query containing terms q1, q2, ..., qn
- **f(qi, D)** = Frequency of term qi in document D
- **|D|** = Length of document D (number of terms)
- **avgdl** = Average document length in collection
- **k1** = Term frequency saturation parameter (default: 1.5)
- **b** = Length normalization parameter (default: 0.75)
- **IDF(qi)** = Inverse Document Frequency of term qi

### 2. IDF Calculation

```
IDF(qi) = ln((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)
```

Where:
- **N** = Total number of documents
- **n(qi)** = Number of documents containing term qi

## Implementation Details

### Parameters

Our implementation uses these optimized parameters:

```javascript
{
  k1: 1.5,        // Controls term frequency saturation (1.2 - 2.0 typical)
  b: 0.75,        // Controls length normalization (0 - 1)
  fieldWeights: {
    title: 3.0,       // Title matches get 3x weight
    brand: 2.0,       // Brand matches get 2x weight
    description: 1.0, // Description is baseline (1x)
    tags: 2.5         // Tags get 2.5x weight
  }
}
```

### Field Weights Explained

Different fields have different importance:

- **Title (3.0)**: Most important - exact title matches are highly relevant
- **Tags (2.5)**: Very important - tags are specifically chosen keywords
- **Brand (2.0)**: Important - users often search by brand
- **Description (1.0)**: Baseline - provides context but less specific

### Stop Words Removal

Common words that don't add search value are filtered out:
```javascript
['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 
 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 
 'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have']
```

## API Endpoints

### 1. Standard Product Search (with BM25)

```
GET /api/products?search=query
```

**Features:**
- Uses BM25 when search query is provided
- Combines with filters (category, price, brand)
- Returns paginated results
- Maintains backward compatibility

**Example:**
```bash
GET /api/products?search=wireless headphones&page=1&limit=10
```

### 2. Advanced BM25 Search

```
GET /api/products/search?q=query&limit=20&includeScore=true
```

**Parameters:**
- `q` (required): Search query
- `limit` (optional): Max results (default: 20)
- `includeScore` (optional): Include BM25 score in results

**Example:**
```bash
GET /api/products/search?q=gaming laptop&includeScore=true
```

**Response:**
```json
{
  "success": true,
  "query": "gaming laptop",
  "count": 15,
  "data": {
    "products": [
      {
        "id": 1,
        "title": "Gaming Laptop Pro",
        "relevanceScore": 8.45,
        ...
      }
    ],
    "algorithm": "BM25"
  }
}
```

### 3. Search Suggestions

```
GET /api/products/suggestions?q=partial&limit=5
```

**Features:**
- Auto-complete functionality
- Fast partial matching
- Returns top 5 most relevant titles

**Example:**
```bash
GET /api/products/suggestions?q=game
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      { "text": "Gaming Laptop Pro", "score": 5.2 },
      { "text": "Gaming Mouse RGB", "score": 4.8 },
      { "text": "Game Controller Wireless", "score": 4.3 }
    ]
  }
}
```

## How It Works: Step by Step

### 1. Document Processing
```javascript
// Each product is processed into searchable fields
{
  id: 123,
  fields: {
    title: { tokens: ['gaming', 'laptop'], length: 2, termFrequency: {...} },
    brand: { tokens: ['dell'], length: 1, termFrequency: {...} },
    description: { tokens: ['powerful', 'gaming', ...], length: 20, ... },
    tags: { tokens: ['electronics', 'computers'], ... }
  }
}
```

### 2. Query Tokenization
```javascript
"Gaming Laptop" → ['gaming', 'laptop']
```

### 3. Scoring Process
For each document:
1. Calculate term frequency for each query term
2. Apply length normalization
3. Multiply by IDF (penalizes common terms)
4. Apply field weights
5. Sum scores across all fields

### 4. Ranking
Results are sorted by total BM25 score (descending)

## Performance Considerations

### Optimal Use Cases
- ✅ Search queries across multiple fields
- ✅ Relevance-based ranking needed
- ✅ Medium-sized datasets (< 100k products)
- ✅ Real-time search with caching

### When to Consider Alternatives
- ❌ Very large datasets (> 1M products) → Use Elasticsearch
- ❌ Exact substring matching only → SQL LIKE may suffice
- ❌ Real-time index updates required → Consider dedicated search engine

### Optimization Tips

1. **Caching**: Cache BM25 instance for frequently accessed product sets
2. **Indexing**: Pre-calculate IDF values periodically
3. **Threshold**: Set minimum score threshold to filter irrelevant results
4. **Field Selection**: Only include necessary fields to reduce processing

## Example Search Scenarios

### Scenario 1: Branded Product Search
```
Query: "Apple iPhone"
Result: iPhone products ranked first (brand + title match)
BM25 handles: Brand weight (2.0) + Title weight (3.0)
```

### Scenario 2: Feature-based Search
```
Query: "wireless noise cancelling headphones"
Result: Products with all features ranked highest
BM25 handles: Multiple term matching across description + title + tags
```

### Scenario 3: Partial Brand Search
```
Query: "Sam"
Result: Samsung products ranked by relevance
BM25 handles: Partial tokenization + brand field weight
```

## Testing the Implementation

### Test Search Quality
```bash
# Test 1: Simple search
curl "http://localhost:3000/api/products?search=laptop"

# Test 2: Multi-word search
curl "http://localhost:3000/api/products?search=wireless gaming mouse"

# Test 3: Advanced search with scores
curl "http://localhost:3000/api/products/search?q=laptop&includeScore=true"

# Test 4: Suggestions
curl "http://localhost:3000/api/products/suggestions?q=gam"
```

### Verify Ranking Quality
1. Search for common terms - verify relevant products rank higher
2. Search for specific brands - verify brand products appear first
3. Search for features - verify products with those features rank higher
4. Compare with old SQL LIKE search - BM25 should provide better relevance

## Migration from SQL LIKE

### Before (SQL LIKE)
```javascript
where[Op.or] = [
  { title: { [Op.like]: `%${search}%` } },
  { description: { [Op.like]: `%${search}%` } },
  { brand: { [Op.like]: `%${search}%` } }
];
```

**Issues:**
- No relevance ranking
- All matches treated equally
- Poor multi-word handling
- Performance issues with wildcards

### After (BM25)
```javascript
const bm25 = new BM25(products, fieldWeights);
const results = bm25.search(query);
```

**Benefits:**
- Intelligent relevance ranking
- Field-weighted scoring
- Better multi-word handling
- Optimized performance

## Future Enhancements

1. **Synonyms**: Add synonym expansion (e.g., "laptop" → "notebook")
2. **Typo Tolerance**: Implement fuzzy matching for misspellings
3. **Query Expansion**: Auto-expand queries with related terms
4. **Personalization**: Boost results based on user history
5. **Caching Layer**: Add Redis cache for BM25 instances
6. **Analytics**: Track search queries and result clicks

## References

- [BM25 Wikipedia](https://en.wikipedia.org/wiki/Okapi_BM25)
- [Robertson & Zaragoza BM25 Paper](https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf)
- [Elasticsearch BM25 Implementation](https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables)

## Support

For issues or questions about the BM25 implementation, please check:
1. This documentation
2. Code comments in `/backend/utils/bm25.js`
3. Test examples in this file
