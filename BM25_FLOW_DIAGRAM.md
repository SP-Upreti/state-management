# BM25 Search Flow Diagram

## 🔄 Search Request Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER SEARCH REQUEST                         │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
        ┌──────────────────────────────────────────────┐
        │  User types: "gaming laptop"                 │
        │  in search bar (navbar.tsx)                  │
        └──────────────────────────────────────────────┘
                                   │
                                   ▼
        ┌──────────────────────────────────────────────┐
        │  Frontend sends:                             │
        │  GET /api/products?search=gaming+laptop      │
        └──────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND PROCESSING (BM25)                        │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
        ┌────────────────────┐        ┌────────────────────┐
        │ Apply Filters      │        │ Get All Products   │
        │ - Category         │        │ matching filters   │
        │ - Price Range      │        │ from database      │
        │ - Brand            │        │                    │
        └────────────────────┘        └────────────────────┘
                    │                             │
                    └──────────────┬──────────────┘
                                   ▼
                    ┌─────────────────────────────┐
                    │   Initialize BM25 Engine    │
                    │                             │
                    │   Parameters:               │
                    │   - k1: 1.5                 │
                    │   - b: 0.75                 │
                    │   - fieldWeights: {...}     │
                    └─────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BM25 SCORING PROCESS                         │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
        ┌────────────────────┐        ┌────────────────────┐
        │ 1. TOKENIZATION    │        │ Query: "gaming     │
        │                    │        │        laptop"     │
        │ Remove stop words  │        │                    │
        │ Lowercase          │        │ Tokens:            │
        │ Split by spaces    │        │ ["gaming",         │
        │                    │        │  "laptop"]         │
        └────────────────────┘        └────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────────────┐
        │ 2. PROCESS EACH PRODUCT                        │
        │                                                │
        │ For Product #1: "Gaming Laptop Pro"           │
        │                                                │
        │ Title tokens: ["gaming", "laptop", "pro"]     │
        │ Brand tokens: ["dell"]                        │
        │ Description: ["high", "performance", ...]     │
        │ Tags: ["gaming", "computers", ...]            │
        └────────────────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────────────┐
        │ 3. CALCULATE TERM FREQUENCY (TF)              │
        │                                                │
        │ "gaming" appears in:                          │
        │   - Title: 1 time                             │
        │   - Tags: 1 time                              │
        │   - Total TF: 2                               │
        │                                                │
        │ "laptop" appears in:                          │
        │   - Title: 1 time                             │
        │   - Total TF: 1                               │
        └────────────────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────────────┐
        │ 4. CALCULATE IDF (Inverse Document Freq)      │
        │                                                │
        │ IDF(gaming) = ln((N - n + 0.5)/(n + 0.5) + 1) │
        │   N = 100 products total                      │
        │   n = 20 products contain "gaming"            │
        │   IDF = 1.68                                  │
        │                                                │
        │ IDF(laptop) = ln((100 - 15 + 0.5)/(15 + 0.5)) │
        │   IDF = 1.89                                  │
        └────────────────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────────────┐
        │ 5. APPLY BM25 FORMULA FOR EACH FIELD          │
        │                                                │
        │ Title Score (weight: 3.0):                    │
        │   score = IDF × (TF × (k1+1))                 │
        │          ────────────────────────              │
        │          TF + k1×(1-b + b×len/avglen)         │
        │                                                │
        │ "gaming": 1.68 × (1×2.5)/(1+1.5×1.0) = 1.68  │
        │ "laptop": 1.89 × (1×2.5)/(1+1.5×1.0) = 1.89  │
        │                                                │
        │ Title total: (1.68 + 1.89) × 3.0 = 10.71     │
        └────────────────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────────────┐
        │ 6. SUM ACROSS ALL FIELDS                      │
        │                                                │
        │ Title score:       10.71 (weight: 3.0)        │
        │ Brand score:        0.00 (weight: 2.0)        │
        │ Description score:  1.20 (weight: 1.0)        │
        │ Tags score:         4.20 (weight: 2.5)        │
        │                                                │
        │ FINAL BM25 SCORE: 16.11                       │
        └────────────────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────────────┐
        │ 7. REPEAT FOR ALL PRODUCTS                    │
        │                                                │
        │ Product #1: Gaming Laptop Pro    → 16.11      │
        │ Product #2: Office Laptop        → 5.67       │
        │ Product #3: Gaming Mouse         → 4.20       │
        │ Product #4: Laptop Stand         → 5.67       │
        │ ...                                            │
        └────────────────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────────────┐
        │ 8. SORT BY SCORE (DESCENDING)                 │
        │                                                │
        │ 1. Gaming Laptop Pro    → 16.11 ⭐⭐⭐         │
        │ 2. Office Laptop        → 5.67  ⭐⭐          │
        │ 3. Laptop Stand         → 5.67  ⭐⭐          │
        │ 4. Gaming Mouse         → 4.20  ⭐            │
        └────────────────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────────────┐
        │ 9. APPLY PAGINATION                           │
        │                                                │
        │ Page 1, Limit 10:                             │
        │ Return products 1-10                          │
        └────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         RETURN RESULTS                              │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────────────┐
        │ JSON Response:                                 │
        │ {                                              │
        │   "success": true,                             │
        │   "total": 45,                                 │
        │   "data": {                                    │
        │     "products": [                              │
        │       {                                        │
        │         "id": 1,                               │
        │         "title": "Gaming Laptop Pro",          │
        │         "bm25Score": 16.11,                    │
        │         ...                                    │
        │       }                                        │
        │     ],                                         │
        │     "searchApplied": true                      │
        │   }                                            │
        │ }                                              │
        └────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND DISPLAYS RESULTS                        │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎯 Key Components Breakdown

### 1. Field Weighting Impact

```
┌──────────────────────────────────────────────────────────┐
│  Same term "gaming" found in different fields:           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  In TITLE (weight: 3.0):                                │
│  Base Score: 2.0  →  Final: 2.0 × 3.0 = 6.0 ⭐⭐⭐       │
│                                                          │
│  In BRAND (weight: 2.0):                                │
│  Base Score: 2.0  →  Final: 2.0 × 2.0 = 4.0 ⭐⭐         │
│                                                          │
│  In DESCRIPTION (weight: 1.0):                          │
│  Base Score: 2.0  →  Final: 2.0 × 1.0 = 2.0 ⭐           │
│                                                          │
│  In TAGS (weight: 2.5):                                 │
│  Base Score: 2.0  →  Final: 2.0 × 2.5 = 5.0 ⭐⭐⭐       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 2. Multi-Word Query Scoring

```
┌──────────────────────────────────────────────────────────┐
│  Query: "gaming laptop"                                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Product A: "Gaming Laptop Pro"                         │
│  ├─ "gaming" in title: +6.0                             │
│  └─ "laptop" in title: +7.0                             │
│  TOTAL: 13.0  ⭐⭐⭐⭐                                      │
│                                                          │
│  Product B: "Gaming Mouse"                              │
│  ├─ "gaming" in title: +6.0                             │
│  └─ "laptop" not found: +0.0                            │
│  TOTAL: 6.0   ⭐⭐                                        │
│                                                          │
│  Product C: "Office Laptop"                             │
│  ├─ "gaming" not found: +0.0                            │
│  └─ "laptop" in title: +7.0                             │
│  TOTAL: 7.0   ⭐⭐                                        │
│                                                          │
│  RANKING: A > C > B  (More matches = Higher rank!)      │
└──────────────────────────────────────────────────────────┘
```

### 3. Length Normalization Effect

```
┌──────────────────────────────────────────────────────────┐
│  Why length matters (parameter b = 0.75):               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Short Title (3 words): "Gaming Laptop Pro"             │
│  Term appears 1 time                                    │
│  Score: HIGH (no penalty)  ⭐⭐⭐⭐⭐                       │
│                                                          │
│  Long Description (100 words): "This is a great...      │
│  gaming laptop for..."                                  │
│  Term appears 1 time                                    │
│  Score: LOWER (length penalty applied)  ⭐⭐⭐            │
│                                                          │
│  Reason: Prevents long documents from dominating        │
│  just by being long                                     │
└──────────────────────────────────────────────────────────┘
```

### 4. IDF Impact (Rare vs Common Words)

```
┌──────────────────────────────────────────────────────────┐
│  Inverse Document Frequency (IDF) Effect:               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  RARE WORD: "ultrabook"                                 │
│  Found in 5 out of 100 products                         │
│  IDF = ln((100-5+0.5)/(5+0.5)) = 2.85  ⭐⭐⭐⭐⭐          │
│  High score! (Very distinctive)                         │
│                                                          │
│  COMMON WORD: "product"                                 │
│  Found in 80 out of 100 products                        │
│  IDF = ln((100-80+0.5)/(80+0.5)) = 0.24  ⭐             │
│  Low score! (Not very distinctive)                      │
│                                                          │
│  STOP WORD: "the" (filtered out)                        │
│  IDF = 0 (removed during tokenization)                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 📊 Real Example Comparison

### Input: "gaming laptop"

#### ❌ Old SQL LIKE Search
```sql
WHERE (title LIKE '%gaming%' OR description LIKE '%gaming%')
  AND (title LIKE '%laptop%' OR description LIKE '%laptop%')
```

**Results** (unranked):
1. Gaming Laptop Pro
2. Office Laptop (contains "laptop")
3. Gaming Mouse (contains "gaming")
4. The Best Gaming Laptop Guide (blog post title)
5. Laptop Gaming Stand

**Problems:**
- No relevance ranking
- Blog post appears in results
- Stand ranks same as actual laptops

#### ✅ New BM25 Search

**Results** (ranked by relevance):
1. Gaming Laptop Pro         (16.11) ⭐⭐⭐⭐⭐
2. Office Laptop              (7.20) ⭐⭐⭐
3. Gaming Mouse               (6.50) ⭐⭐
4. Laptop Gaming Stand        (5.80) ⭐⭐
5. Gaming Accessories Bundle  (4.20) ⭐

**Improvements:**
- ✅ Best match first (both terms in title)
- ✅ Relevant ranking order
- ✅ Term frequency considered
- ✅ Field importance weighted

## 🔧 Configuration Quick Reference

### Adjust Search Sensitivity

```javascript
// STRICT (fewer but better results)
const bm25 = new BM25(products, {
    k1: 1.2,  // Less weight to repeated terms
    b: 0.9,   // Strong length penalty
    threshold: 1.0  // High minimum score
});

// BALANCED (default)
const bm25 = new BM25(products, {
    k1: 1.5,
    b: 0.75,
    threshold: 0.1
});

// LENIENT (more results)
const bm25 = new BM25(products, {
    k1: 2.0,  // More weight to repeated terms
    b: 0.5,   // Less length penalty
    threshold: 0.01  // Low minimum score
});
```

## 🎓 Understanding the Math

### Simple Example Calculation

**Product:** "Gaming Laptop Pro"  
**Query:** "gaming laptop"  
**Fields:** Only title, weight = 3.0

**Step by step:**

1. **Tokenize:** ["gaming", "laptop"]

2. **Term Frequency (TF):**
   - "gaming": 1
   - "laptop": 1

3. **Document Length:** 3 words
   - Average length: 5 words

4. **IDF Calculation:**
   ```
   IDF("gaming") = ln((100-20+0.5)/(20+0.5)) = 1.68
   IDF("laptop") = ln((100-15+0.5)/(15+0.5)) = 1.89
   ```

5. **BM25 Score per term:**
   ```
   For "gaming":
   score = 1.68 × (1×(1.5+1))/(1+1.5×(1-0.75+0.75×3/5))
        = 1.68 × 2.5/2.35
        = 1.79
   
   For "laptop":
   score = 1.89 × (1×(1.5+1))/(1+1.5×(1-0.75+0.75×3/5))
        = 1.89 × 2.5/2.35
        = 2.01
   ```

6. **Field Weight:**
   ```
   Total = (1.79 + 2.01) × 3.0 = 11.40
   ```

**Final Score: 11.40** ⭐⭐⭐⭐

---

**Understanding this flow helps you:**
- Debug search results
- Tune parameters effectively
- Explain ranking to stakeholders
- Optimize search quality
