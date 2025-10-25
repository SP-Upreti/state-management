# Content-Based Filtering Algorithm - Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER VIEWS PRODUCT                          │
│                  (Product Details Page)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              RECOMMENDED PRODUCTS COMPONENT                      │
│  • Triggered when product details are loaded                    │
│  • Fetches all available products (limit: 100)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PRODUCT FILTERING                              │
│  Filter out:                                                    │
│    ❌ Current product (avoid self-recommendation)               │
│    ❌ Inactive products (isActive = false)                      │
│    ❌ Out of stock products (stock <= 0)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│            SIMILARITY CALCULATION (for each product)            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. CATEGORY MATCH (35%)                                  │  │
│  │    if (product.categoryId == current.categoryId)         │  │
│  │       score += 0.35                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 2. BRAND MATCH (25%)                                     │  │
│  │    if (product.brand == current.brand)                   │  │
│  │       score += 0.25                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 3. DESCRIPTION SIMILARITY (20%)                          │  │
│  │    • Tokenize both descriptions                          │  │
│  │    • Calculate word frequencies                          │  │
│  │    • Apply Cosine Similarity:                            │  │
│  │         similarity = (A·B) / (||A|| × ||B||)            │  │
│  │    • score += similarity × 0.20                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 4. TAGS SIMILARITY (15%)                                 │  │
│  │    • Parse tags arrays                                   │  │
│  │    • Calculate Jaccard Index:                            │  │
│  │         J = |A ∩ B| / |A ∪ B|                           │  │
│  │    • score += jaccard × 0.15                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 5. PRICE SIMILARITY (5%)                                 │  │
│  │    • Calculate price difference                          │  │
│  │    • ratio = 1 - (diff / avgPrice)                       │  │
│  │    • score += ratio × 0.05                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ TOTAL SIMILARITY SCORE                                   │  │
│  │    Range: 0.0 (no match) to 1.0 (perfect match)         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RANKING & SORTING                            │
│  • Sort products by similarity score (descending)               │
│  • Select top 8 products                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FALLBACK STRATEGY                              │
│  If fewer than 8 similar products found:                        │
│    • Calculate remaining slots needed                           │
│    • Fetch popular products by:                                 │
│         popularity = (views × 0.7) + (rating × 30)             │
│    • Fill remaining slots with popular items                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DISPLAY RESULTS                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Products You May Like                                    │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                    │ │
│  │  │ Prod │ │ Prod │ │ Prod │ │ Prod │                    │ │
│  │  │  1   │ │  2   │ │  3   │ │  4   │                    │ │
│  │  └──────┘ └──────┘ └──────┘ └──────┘                    │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                    │ │
│  │  │ Prod │ │ Prod │ │ Prod │ │ Prod │                    │ │
│  │  │  5   │ │  6   │ │  7   │ │  8   │                    │ │
│  │  └──────┘ └──────┘ └──────┘ └──────┘                    │ │
│  │                                                            │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ 💡 Smart Recommendations                           │  │ │
│  │  │ These products are selected using content-based    │  │ │
│  │  │ filtering algorithm that analyzes:                 │  │ │
│  │  │  • Category match (35%)                            │  │ │
│  │  │  • Brand similarity (25%)                          │  │ │
│  │  │  • Description analysis (20%)                      │  │ │
│  │  │  • Feature matching (15%)                          │  │ │
│  │  │  • Price range (5%)                                │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Algorithm Weight Distribution

```
┌─────────────────────────────────────────────┐
│          SIMILARITY FACTORS                 │
└─────────────────────────────────────────────┘

Category Match (35%)    ████████████████████████████████████
Brand Match (25%)       █████████████████████████
Description (20%)       ████████████████████
Tags/Features (15%)     ███████████████
Price Range (5%)        █████

TOTAL = 100%
```

## Data Flow

```
┌──────────────┐
│  Product     │
│  Database    │
└──────┬───────┘
       │
       │ Fetch all products
       ▼
┌──────────────────┐     ┌─────────────────┐
│  Current Product │────▶│  Recommendation │
│  (User viewing)  │     │    Algorithm    │
└──────────────────┘     └────────┬────────┘
                                  │
                                  │ Calculate
                                  │ similarities
                                  ▼
                         ┌────────────────┐
                         │  Scored        │
                         │  Products      │
                         │  (sorted)      │
                         └────────┬───────┘
                                  │
                                  │ Render
                                  ▼
                         ┌────────────────┐
                         │  UI Component  │
                         │  (Grid View)   │
                         └────────────────┘
```

## Cosine Similarity Visualization

```
For Description Similarity:

Text 1: "wireless bluetooth speaker"
        ↓ Tokenize
        [wireless, bluetooth, speaker]
        ↓ Count frequency
        Vector A: {wireless: 1, bluetooth: 1, speaker: 1}

Text 2: "portable wireless speaker with bluetooth"
        ↓ Tokenize
        [portable, wireless, speaker, with, bluetooth]
        ↓ Count frequency
        Vector B: {portable: 1, wireless: 1, speaker: 1, with: 1, bluetooth: 1}

        ↓ Calculate Cosine Similarity

Similarity = (1×1 + 1×1 + 1×1) / (√3 × √5)
          = 3 / (1.732 × 2.236)
          = 3 / 3.873
          = 0.774

Final Score = 0.774 × 0.20 = 0.155 (15.5% of total)
```

## Jaccard Index Visualization

```
For Tags Similarity:

Product A tags: [wireless, bluetooth, portable]
Product B tags: [wireless, portable, rechargeable]

Intersection (∩): [wireless, portable] = 2 items
Union (∪): [wireless, bluetooth, portable, rechargeable] = 4 items

Jaccard Index = |A ∩ B| / |A ∪ B|
              = 2 / 4
              = 0.5

Final Score = 0.5 × 0.15 = 0.075 (7.5% of total)
```

## Example Scenario

```
Current Product: iPhone 14 Pro
├─ Category: Smartphones
├─ Brand: Apple
├─ Description: "Latest flagship smartphone with advanced camera..."
├─ Tags: [5G, wireless charging, face ID]
└─ Price: $999

                    ↓ Algorithm Processing

Candidate: iPhone 13
├─ Category Match: ✓ (Smartphones)        → +0.35
├─ Brand Match: ✓ (Apple)                 → +0.25
├─ Description: ~70% similar              → +0.14
├─ Tags: 2/3 match                        → +0.10
└─ Price: $799 (~20% diff)                → +0.04
                                   TOTAL: 0.88 (88%)

Candidate: Samsung Galaxy S23
├─ Category Match: ✓ (Smartphones)        → +0.35
├─ Brand Match: ✗ (Samsung ≠ Apple)      → +0.00
├─ Description: ~60% similar              → +0.12
├─ Tags: 2/3 match                        → +0.10
└─ Price: $899 (~10% diff)                → +0.045
                                   TOTAL: 0.615 (61.5%)

Candidate: AirPods Pro
├─ Category Match: ✗ (Audio ≠ Smartphones) → +0.00
├─ Brand Match: ✓ (Apple)                  → +0.25
├─ Description: ~20% similar               → +0.04
├─ Tags: 1/4 match                         → +0.0375
└─ Price: $249 (~75% diff)                 → +0.0125
                                    TOTAL: 0.34 (34%)

Ranking: iPhone 13 > Samsung Galaxy S23 > AirPods Pro
```

## Performance Considerations

```
Time Complexity Analysis:

For each product comparison:
├─ Category check: O(1)
├─ Brand check: O(1)
├─ Description similarity: O(n × m) where n,m = word counts
├─ Tags similarity: O(t1 + t2) where t = tag counts
└─ Price calculation: O(1)

Total for P products:
└─ O(P × (n × m + t))

Optimization:
├─ Limit products fetched (100 max)
├─ Filter before processing
└─ Early termination for zero scores
```
