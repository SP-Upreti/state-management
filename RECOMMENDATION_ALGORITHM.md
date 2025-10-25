# Product Recommendation Algorithm

## Overview

This e-commerce application implements a **Content-Based Filtering Algorithm** to recommend similar products to users based on product attributes. The system analyzes multiple product features to calculate similarity scores and suggest relevant items.

## Algorithm Type: Content-Based Filtering

Content-based filtering recommends items by comparing the features of items with user preferences or the current item being viewed. Our implementation analyzes:

1. **Category**
2. **Brand**
3. **Description**
4. **Tags/Features**
5. **Price Range**

## How It Works

### 1. Similarity Score Calculation

The algorithm calculates a similarity score between the current product and all other products using a weighted scoring system:

```
Total Similarity Score = 
    (Category Match × 0.35) +
    (Brand Match × 0.25) +
    (Description Similarity × 0.20) +
    (Tags Similarity × 0.15) +
    (Price Range Similarity × 0.05)
```

### 2. Weight Distribution

| Feature | Weight | Reason |
|---------|--------|--------|
| Category | 35% | Products in the same category are most likely to be relevant |
| Brand | 25% | Users often prefer products from the same brand |
| Description | 20% | Similar descriptions indicate similar functionality |
| Tags/Features | 15% | Common features suggest similar use cases |
| Price Range | 5% | Users might prefer similarly priced products |

### 3. Similarity Metrics

#### A. Category Match (Binary)
- **Score**: 0.35 if categories match, 0 otherwise
- **Logic**: Simple boolean comparison of `categoryId`

#### B. Brand Match (Binary)
- **Score**: 0.25 if brands match, 0 otherwise
- **Logic**: Case-insensitive string comparison

#### C. Description Similarity (Cosine Similarity)
- **Score**: 0 to 0.20 (weighted)
- **Algorithm**: TF-IDF based Cosine Similarity
  ```
  similarity = (A · B) / (||A|| × ||B||)
  ```
  Where:
  - A and B are word frequency vectors
  - · represents dot product
  - ||A|| is the magnitude of vector A

**Steps**:
1. Tokenize descriptions into words
2. Create word frequency vectors
3. Calculate cosine similarity
4. Multiply by weight (0.20)

#### D. Tags Similarity (Jaccard Index)
- **Score**: 0 to 0.15 (weighted)
- **Algorithm**: Jaccard Similarity Coefficient
  ```
  J(A,B) = |A ∩ B| / |A ∪ B|
  ```
  Where:
  - A and B are sets of tags
  - ∩ is intersection
  - ∪ is union

**Example**:
- Product A tags: ["wireless", "bluetooth", "portable"]
- Product B tags: ["wireless", "portable", "rechargeable"]
- Intersection: ["wireless", "portable"] = 2 items
- Union: ["wireless", "bluetooth", "portable", "rechargeable"] = 4 items
- Jaccard Score: 2/4 = 0.5
- Weighted Score: 0.5 × 0.15 = 0.075

#### E. Price Range Similarity
- **Score**: 0 to 0.05 (weighted)
- **Formula**:
  ```
  priceRatio = 1 - min(|price1 - price2| / avgPrice, 1)
  weightedScore = priceRatio × 0.05
  ```

**Example**:
- Product A: $100
- Product B: $120
- Difference: $20
- Average: $110
- Ratio: 1 - (20/110) = 0.818
- Weighted Score: 0.818 × 0.05 = 0.041

## Implementation Details

### File Structure

```
src/
├── utils/
│   └── recommendations.ts      # Core recommendation algorithm
└── components/
    └── products/
        └── RecommendedProducts.tsx  # UI component
```

### Key Functions

#### 1. `calculateProductSimilarity(product1, product2)`

Computes similarity score between two products.

**Returns**:
```typescript
{
    score: number,      // 0 to 1
    reasons: string[]   // Match explanations
}
```

#### 2. `getRecommendedProducts(currentProduct, allProducts, limit)`

Returns top N most similar products.

**Parameters**:
- `currentProduct`: The reference product
- `allProducts`: Pool of all available products
- `limit`: Maximum number of recommendations (default: 8)

**Returns**: Array of products sorted by similarity score

#### 3. `getDiverseRecommendations(currentProduct, allProducts, limit)`

Enhanced version that mixes similar products with popular items if not enough similar products are found.

**Fallback Strategy**:
1. Get similar products using content-based filtering
2. If insufficient results, fill remaining slots with popular products
3. Popular products ranked by: `(views × 0.7) + (rating × 30)`

### Text Processing

#### Tokenization
```typescript
const words = text.toLowerCase().split(/\s+/);
```

#### Tag Parsing
Handles both JSON strings and arrays:
```typescript
function parseTags(tags: string[] | string | undefined): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
        return JSON.parse(tags);
    } catch {
        return [];
    }
}
```

## Example Calculation

### Scenario
**Current Product**: iPhone 14 Pro
- Category: Smartphones
- Brand: Apple
- Description: "Latest flagship smartphone with advanced camera..."
- Tags: ["5G", "wireless charging", "face ID"]
- Price: $999

**Candidate Product**: iPhone 13
- Category: Smartphones
- Brand: Apple
- Description: "Premium smartphone with excellent camera..."
- Tags: ["5G", "wireless charging"]
- Price: $799

### Score Breakdown

1. **Category Match**: ✓ Same category
   - Score: 0.35

2. **Brand Match**: ✓ Both Apple
   - Score: 0.25

3. **Description Similarity**: ~70% similar text
   - Raw similarity: 0.70
   - Weighted: 0.70 × 0.20 = 0.14

4. **Tags Similarity**: 2 common tags out of 3 total
   - Intersection: 2, Union: 3
   - Jaccard: 2/3 = 0.667
   - Weighted: 0.667 × 0.15 = 0.10

5. **Price Similarity**:
   - Difference: $200
   - Average: $899
   - Ratio: 1 - (200/899) = 0.777
   - Weighted: 0.777 × 0.05 = 0.039

**Total Similarity Score**: 0.35 + 0.25 + 0.14 + 0.10 + 0.039 = **0.879**

This is a very high similarity score (87.9%), making iPhone 13 an excellent recommendation!

## Filtering Rules

Products are excluded from recommendations if:
1. Same as the current product (`id` match)
2. Inactive (`isActive = false`)
3. Out of stock (`stock <= 0`)

## UI Display

The recommendation section shows:
- Up to 8 recommended products
- Product cards with images, prices, and discounts
- Algorithm explanation panel
- Reasons for each recommendation (via match reasons)

## Performance Considerations

### Time Complexity
- **Per Product Comparison**: O(n × m)
  - n = words in description
  - m = number of tags
- **Total**: O(P × (n × m))
  - P = total number of products

### Optimization Strategies
1. **Limit product pool**: Fetch only active, in-stock products
2. **Cache recommendations**: Store results for frequently viewed products
3. **Lazy loading**: Load recommendations after main product details
4. **Batch processing**: Calculate similarities in batches for large datasets

## Future Enhancements

1. **Collaborative Filtering**
   - Add user behavior data
   - "Users who bought this also bought..."

2. **Hybrid Approach**
   - Combine content-based + collaborative filtering
   - Weighted combination of both algorithms

3. **Machine Learning**
   - Train models on user interactions
   - Deep learning for feature extraction

4. **Personalization**
   - User preference tracking
   - Browsing history analysis
   - Purchase history consideration

5. **A/B Testing**
   - Test different weight distributions
   - Measure click-through rates
   - Optimize conversion rates

6. **Context Awareness**
   - Time-based recommendations
   - Seasonal products
   - Trending items

## Testing

To test the algorithm:

1. **View a product** with clear attributes (category, brand, description)
2. **Check recommendations** below product details
3. **Verify relevance**: Recommended products should share attributes
4. **Read algorithm info**: Review the explanation panel

### Test Cases

- ✓ Same category products appear first
- ✓ Same brand products ranked higher
- ✓ Similar descriptions increase score
- ✓ Out-of-stock products excluded
- ✓ Fallback to popular products works
- ✓ No duplicate recommendations

## References

- **Cosine Similarity**: [Wikipedia](https://en.wikipedia.org/wiki/Cosine_similarity)
- **Jaccard Index**: [Wikipedia](https://en.wikipedia.org/wiki/Jaccard_index)
- **TF-IDF**: [Wikipedia](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)
- **Content-Based Filtering**: [Recommender Systems Handbook](https://link.springer.com/referencework/10.1007/978-1-0716-2197-4)

## License

This implementation is part of the e-commerce application and follows the project's license terms.
