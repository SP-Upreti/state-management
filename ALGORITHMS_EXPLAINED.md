# Algorithms Used in E-Commerce Application

This document provides a detailed explanation of the two main algorithms used in this e-commerce application:

1. **BM25 (Best Matching 25)** - Search Ranking Algorithm
2. **Content-Based Filtering** - Product Recommendation Algorithm

---

## Table of Contents

- [Algorithm 1: BM25 Search Algorithm](#algorithm-1-bm25-search-algorithm)
  - [Full Code](#bm25-full-code)
  - [Line-by-Line Explanation](#bm25-line-by-line-explanation)
- [Algorithm 2: Content-Based Filtering](#algorithm-2-content-based-filtering)
  - [Full Code](#content-based-full-code)
  - [Line-by-Line Explanation](#content-based-line-by-line-explanation)

---

## Algorithm 1: BM25 Search Algorithm

### Overview

**BM25 (Best Matching 25)** is a probabilistic ranking function used by search engines. It ranks documents based on the query terms appearing in each document, considering term frequency, document length, and inverse document frequency.

### Mathematical Formula

```
score(D,Q) = Σ IDF(qi) × (f(qi,D) × (k1 + 1)) / (f(qi,D) + k1 × (1 - b + b × |D| / avgdl))
```

Where:
- `D` = Document
- `Q` = Query
- `qi` = Query term i
- `f(qi,D)` = Frequency of qi in D
- `|D|` = Length of document D
- `avgdl` = Average document length
- `k1` = Term frequency saturation parameter (typically 1.2-2.0)
- `b` = Length normalization parameter (0-1)
- `IDF(qi)` = Inverse document frequency of qi

---

### BM25 Full Code

```javascript
class BM25 {
    constructor(documents, options = {}) {
        // BM25 parameters
        this.k1 = options.k1 || 1.5;
        this.b = options.b || 0.75;
        
        // Field weights
        this.fieldWeights = options.fieldWeights || {
            title: 3.0,
            brand: 2.0,
            description: 1.0,
            tags: 2.5
        };
        
        this.documents = documents;
        this.documentCount = documents.length;
        
        // Process documents
        this.processedDocs = documents.map(doc => this.processDocument(doc));
        
        // Calculate averages
        this.avgFieldLengths = this.calculateAvgFieldLengths();
        
        // Calculate IDF
        this.idf = this.calculateIDF();
    }

    tokenize(text) {
        if (!text) return [];
        
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(term => term.length > 0)
            .filter(term => !this.isStopWord(term));
    }

    isStopWord(word) {
        const stopWords = new Set([
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have'
        ]);
        return stopWords.has(word);
    }

    processDocument(doc) {
        const processed = {
            id: doc.id,
            original: doc,
            fields: {}
        };

        Object.keys(this.fieldWeights).forEach(field => {
            const text = doc[field] || '';
            const tokens = this.tokenize(text);
            
            processed.fields[field] = {
                tokens,
                length: tokens.length,
                termFrequency: this.calculateTermFrequency(tokens)
            };
        });

        return processed;
    }

    calculateTermFrequency(tokens) {
        const tf = {};
        tokens.forEach(term => {
            tf[term] = (tf[term] || 0) + 1;
        });
        return tf;
    }

    calculateAvgFieldLengths() {
        const avgLengths = {};
        
        Object.keys(this.fieldWeights).forEach(field => {
            const totalLength = this.processedDocs.reduce((sum, doc) => {
                return sum + (doc.fields[field]?.length || 0);
            }, 0);
            
            avgLengths[field] = this.documentCount > 0 
                ? totalLength / this.documentCount 
                : 0;
        });

        return avgLengths;
    }

    calculateIDF() {
        const termDocCount = {};
        
        this.processedDocs.forEach(doc => {
            const uniqueTerms = new Set();
            
            Object.keys(this.fieldWeights).forEach(field => {
                const tokens = doc.fields[field]?.tokens || [];
                tokens.forEach(term => uniqueTerms.add(term));
            });
            
            uniqueTerms.forEach(term => {
                termDocCount[term] = (termDocCount[term] || 0) + 1;
            });
        });

        const idf = {};
        Object.entries(termDocCount).forEach(([term, docCount]) => {
            idf[term] = Math.log(
                (this.documentCount - docCount + 0.5) / (docCount + 0.5) + 1
            );
        });

        return idf;
    }

    scoreField(queryTerms, field, docField, avgLength) {
        if (!docField) return 0;
        
        let score = 0;
        const docLength = docField.length;
        const tf = docField.termFrequency;

        queryTerms.forEach(term => {
            const termFreq = tf[term] || 0;
            const idf = this.idf[term] || 0;

            const numerator = termFreq * (this.k1 + 1);
            const denominator = termFreq + this.k1 * (
                1 - this.b + this.b * (docLength / (avgLength || 1))
            );

            score += idf * (numerator / denominator);
        });

        return score;
    }

    search(query, options = {}) {
        const limit = options.limit || 10;
        const threshold = options.threshold || 0;
        
        const queryTerms = this.tokenize(query);
        
        if (queryTerms.length === 0) {
            return [];
        }

        const scoredDocs = this.processedDocs.map(doc => {
            let totalScore = 0;

            Object.keys(this.fieldWeights).forEach(field => {
                const fieldScore = this.scoreField(
                    queryTerms,
                    field,
                    doc.fields[field],
                    this.avgFieldLengths[field]
                );
                
                totalScore += fieldScore * this.fieldWeights[field];
            });

            return {
                document: doc.original,
                score: totalScore,
                id: doc.id
            };
        });

        return scoredDocs
            .filter(item => item.score > threshold)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    getSuggestions(partialQuery, limit = 5) {
        const results = this.search(partialQuery, { limit });
        return results.map(result => ({
            text: result.document.title || '',
            score: result.score
        }));
    }
}
```

---

### BM25 Line-by-Line Explanation

#### Constructor Method

```javascript
constructor(documents, options = {}) {
```
**Line 1:** Defines the constructor that initializes a BM25 instance. Takes `documents` (array of product objects) and optional `options` object.

```javascript
    this.k1 = options.k1 || 1.5;
```
**Line 2:** Sets `k1` parameter (term frequency saturation). Default is 1.5. Higher values give more weight to term frequency. Range: 1.2-2.0.

```javascript
    this.b = options.b || 0.75;
```
**Line 3:** Sets `b` parameter (length normalization). Default is 0.75. Controls how much document length affects scoring. Range: 0-1.

```javascript
    this.fieldWeights = options.fieldWeights || {
        title: 3.0,
        brand: 2.0,
        description: 1.0,
        tags: 2.5
    };
```
**Lines 4-9:** Defines field weights. Title matches get 3x weight (most important), tags 2.5x, brand 2x, and description 1x (baseline).

```javascript
    this.documents = documents;
    this.documentCount = documents.length;
```
**Lines 10-11:** Stores the original documents array and counts total documents (needed for IDF calculation).

```javascript
    this.processedDocs = documents.map(doc => this.processDocument(doc));
```
**Line 12:** Processes all documents: tokenizes text, calculates term frequencies, and prepares for searching.

```javascript
    this.avgFieldLengths = this.calculateAvgFieldLengths();
```
**Line 13:** Calculates average length for each field (title, brand, description, tags) across all documents.

```javascript
    this.idf = this.calculateIDF();
```
**Line 14:** Calculates Inverse Document Frequency (IDF) for all terms in the corpus. Rare terms get higher IDF scores.

---

#### Tokenize Method

```javascript
tokenize(text) {
    if (!text) return [];
```
**Lines 1-2:** Checks if text exists. Returns empty array if no text provided.

```javascript
    return text
        .toLowerCase()
```
**Lines 3-4:** Converts text to lowercase for case-insensitive matching ("Apple" = "apple").

```javascript
        .replace(/[^\w\s]/g, ' ')
```
**Line 5:** Removes special characters (punctuation, symbols) and replaces with spaces. Keeps only alphanumeric and whitespace.

```javascript
        .split(/\s+/)
```
**Line 6:** Splits text into words using whitespace as delimiter. Multiple spaces treated as one.

```javascript
        .filter(term => term.length > 0)
```
**Line 7:** Removes empty strings from the array (caused by multiple spaces or trimming).

```javascript
        .filter(term => !this.isStopWord(term));
```
**Line 8:** Removes stop words (common words like "the", "a", "is") that don't add search value.

---

#### Is Stop Word Method

```javascript
isStopWord(word) {
    const stopWords = new Set([
        'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
        'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
        'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have'
    ]);
```
**Lines 1-6:** Creates a Set of common English stop words. Sets provide O(1) lookup time.

```javascript
    return stopWords.has(word);
```
**Line 7:** Returns true if word is a stop word, false otherwise. Fast Set lookup.

---

#### Process Document Method

```javascript
processDocument(doc) {
    const processed = {
        id: doc.id,
        original: doc,
        fields: {}
    };
```
**Lines 1-6:** Creates processed document object with ID, reference to original, and empty fields object.

```javascript
    Object.keys(this.fieldWeights).forEach(field => {
```
**Line 7:** Iterates through each weighted field (title, brand, description, tags).

```javascript
        const text = doc[field] || '';
```
**Line 8:** Gets field text from document, defaults to empty string if field doesn't exist.

```javascript
        const tokens = this.tokenize(text);
```
**Line 9:** Tokenizes the field text into cleaned, lowercase words without stop words.

```javascript
        processed.fields[field] = {
            tokens,
            length: tokens.length,
            termFrequency: this.calculateTermFrequency(tokens)
        };
```
**Lines 10-14:** Stores tokenized data for this field: the tokens array, token count (length), and term frequency map.

```javascript
    });
    return processed;
}
```
**Lines 15-17:** Completes the loop and returns the fully processed document.

---

#### Calculate Term Frequency Method

```javascript
calculateTermFrequency(tokens) {
    const tf = {};
```
**Lines 1-2:** Initializes empty object to store term frequencies.

```javascript
    tokens.forEach(term => {
        tf[term] = (tf[term] || 0) + 1;
    });
```
**Lines 3-5:** For each token, increments its count. If term doesn't exist yet, initializes to 0 then adds 1.

```javascript
    return tf;
}
```
**Lines 6-7:** Returns the term frequency map. Example: `{ "laptop": 3, "gaming": 2 }`.

---

#### Calculate Average Field Lengths Method

```javascript
calculateAvgFieldLengths() {
    const avgLengths = {};
```
**Lines 1-2:** Initializes object to store average lengths for each field.

```javascript
    Object.keys(this.fieldWeights).forEach(field => {
```
**Line 3:** Iterates through each field (title, brand, description, tags).

```javascript
        const totalLength = this.processedDocs.reduce((sum, doc) => {
            return sum + (doc.fields[field]?.length || 0);
        }, 0);
```
**Lines 4-6:** Sums up token counts for this field across all documents. Uses optional chaining (?.) for safety.

```javascript
        avgLengths[field] = this.documentCount > 0 
            ? totalLength / this.documentCount 
            : 0;
```
**Lines 7-9:** Calculates average: total length divided by document count. Avoids division by zero.

```javascript
    });
    return avgLengths;
}
```
**Lines 10-12:** Completes loop and returns average lengths. Example: `{ title: 4.5, brand: 1.2, ... }`.

---

#### Calculate IDF Method

```javascript
calculateIDF() {
    const termDocCount = {};
```
**Lines 1-2:** Initializes object to count how many documents contain each term.

```javascript
    this.processedDocs.forEach(doc => {
        const uniqueTerms = new Set();
```
**Lines 3-4:** For each document, creates a Set to track unique terms (each term counted once per document).

```javascript
        Object.keys(this.fieldWeights).forEach(field => {
            const tokens = doc.fields[field]?.tokens || [];
            tokens.forEach(term => uniqueTerms.add(term));
        });
```
**Lines 5-8:** Iterates through all fields in document, collects all unique terms. Set automatically prevents duplicates.

```javascript
        uniqueTerms.forEach(term => {
            termDocCount[term] = (termDocCount[term] || 0) + 1;
        });
    });
```
**Lines 9-12:** For each unique term in document, increments its document count.

```javascript
    const idf = {};
    Object.entries(termDocCount).forEach(([term, docCount]) => {
```
**Lines 13-14:** Initializes IDF object and iterates through term document counts.

```javascript
        idf[term] = Math.log(
            (this.documentCount - docCount + 0.5) / (docCount + 0.5) + 1
        );
```
**Lines 15-17:** Calculates IDF using BM25 formula. Rare terms (low docCount) get higher IDF. The +0.5 smoothing prevents division by zero and extreme values.

```javascript
    });
    return idf;
}
```
**Lines 18-20:** Returns IDF map. Example: `{ "laptop": 1.8, "rare-term": 4.2 }`.

---

#### Score Field Method

```javascript
scoreField(queryTerms, field, docField, avgLength) {
    if (!docField) return 0;
```
**Lines 1-2:** Returns 0 if document field doesn't exist (field is optional).

```javascript
    let score = 0;
    const docLength = docField.length;
    const tf = docField.termFrequency;
```
**Lines 3-5:** Initializes score, gets document length and term frequency map for this field.

```javascript
    queryTerms.forEach(term => {
```
**Line 6:** Iterates through each term in the search query.

```javascript
        const termFreq = tf[term] || 0;
        const idf = this.idf[term] || 0;
```
**Lines 7-8:** Gets term frequency in this document (0 if term not found) and IDF value for term.

```javascript
        const numerator = termFreq * (this.k1 + 1);
```
**Line 9:** Calculates BM25 numerator: term frequency scaled by (k1 + 1). This amplifies the term frequency effect.

```javascript
        const denominator = termFreq + this.k1 * (
            1 - this.b + this.b * (docLength / (avgLength || 1))
        );
```
**Lines 10-12:** Calculates BM25 denominator with length normalization:
- `1 - this.b` = constant component (no normalization)
- `this.b * (docLength / avgLength)` = length normalization component
- Longer documents get penalized slightly to favor concise matches

```javascript
        score += idf * (numerator / denominator);
```
**Line 13:** Adds this term's contribution to total field score. Multiplies IDF by the BM25 term score.

```javascript
    });
    return score;
}
```
**Lines 14-16:** Returns total score for this field.

---

#### Search Method

```javascript
search(query, options = {}) {
    const limit = options.limit || 10;
    const threshold = options.threshold || 0;
```
**Lines 1-3:** Gets search options: max results (default 10) and minimum score threshold (default 0).

```javascript
    const queryTerms = this.tokenize(query);
```
**Line 4:** Tokenizes search query into cleaned terms (lowercase, no punctuation, no stop words).

```javascript
    if (queryTerms.length === 0) {
        return [];
    }
```
**Lines 5-7:** Returns empty array if query has no valid terms (all stop words or empty).

```javascript
    const scoredDocs = this.processedDocs.map(doc => {
        let totalScore = 0;
```
**Lines 8-9:** Begins scoring all documents. Initializes total score to 0.

```javascript
        Object.keys(this.fieldWeights).forEach(field => {
            const fieldScore = this.scoreField(
                queryTerms,
                field,
                doc.fields[field],
                this.avgFieldLengths[field]
            );
```
**Lines 10-16:** For each field (title, brand, description, tags), calculates BM25 score for that field.

```javascript
            totalScore += fieldScore * this.fieldWeights[field];
        });
```
**Lines 17-18:** Adds weighted field score to total. Title matches count 3x more than description matches.

```javascript
        return {
            document: doc.original,
            score: totalScore,
            id: doc.id
        };
    });
```
**Lines 19-24:** Returns scored document object with original document, calculated score, and ID.

```javascript
    return scoredDocs
        .filter(item => item.score > threshold)
```
**Lines 25-26:** Filters out documents with scores below threshold (removes irrelevant results).

```javascript
        .sort((a, b) => b.score - a.score)
```
**Line 27:** Sorts by score in descending order (highest relevance first).

```javascript
        .slice(0, limit);
}
```
**Lines 28-29:** Returns only top N results (limit) and closes the search method.

---

#### Get Suggestions Method

```javascript
getSuggestions(partialQuery, limit = 5) {
```
**Line 1:** Method for autocomplete/typeahead. Takes partial query and optional limit (default 5).

```javascript
    const results = this.search(partialQuery, { limit });
```
**Line 2:** Searches using the partial query with specified limit.

```javascript
    return results.map(result => ({
        text: result.document.title || '',
        score: result.score
    }));
}
```
**Lines 3-6:** Transforms results to suggestion format (title text and score). Used for dropdown autocomplete.

---

## Algorithm 2: Content-Based Filtering

### Overview

**Content-Based Filtering** is a recommendation algorithm that suggests items similar to a given item based on their attributes. It analyzes product features (category, brand, description, tags, price) and calculates similarity scores to find related products.

### Mathematical Formulas

#### 1. Cosine Similarity (for text)
```
similarity = (A · B) / (||A|| × ||B||)
```

#### 2. Jaccard Similarity (for tags)
```
J(A,B) = |A ∩ B| / |A ∪ B|
```

#### 3. Weighted Score
```
Total Score = 0.35×CategoryMatch + 0.25×BrandMatch + 0.20×DescSimilarity + 0.15×TagSimilarity + 0.05×PriceSimilarity
```

---

### Content-Based Full Code

```typescript
import { Product } from './api';

function calculateTextSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;

    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    const allWords = new Set([...words1, ...words2]);
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    allWords.forEach(word => {
        const count1 = words1.filter(w => w === word).length;
        const count2 = words2.filter(w => w === word).length;

        dotProduct += count1 * count2;
        magnitude1 += count1 * count1;
        magnitude2 += count2 * count2;
    });

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

function parseTags(tags: string[] | string | undefined): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
        return JSON.parse(tags);
    } catch {
        return [];
    }
}

function calculateJaccardSimilarity(set1: string[], set2: string[]): number {
    if (set1.length === 0 && set2.length === 0) return 0;

    const intersection = set1.filter(item => set2.includes(item)).length;
    const union = new Set([...set1, ...set2]).size;

    return union > 0 ? intersection / union : 0;
}

interface ScoredProduct extends Product {
    similarityScore: number;
    matchReasons: string[];
}

export function calculateProductSimilarity(
    product1: Product,
    product2: Product
): { score: number; reasons: string[] } {
    const reasons: string[] = [];
    let score = 0;

    // Category match (35%)
    if (product1.categoryId === product2.categoryId) {
        score += 0.35;
        reasons.push('Same category');
    }

    // Brand match (25%)
    if (product1.brand && product2.brand &&
        product1.brand.toLowerCase() === product2.brand.toLowerCase()) {
        score += 0.25;
        reasons.push('Same brand');
    }

    // Description similarity (20%)
    if (product1.description && product2.description) {
        const descSimilarity = calculateTextSimilarity(
            product1.description,
            product2.description
        );
        score += descSimilarity * 0.20;
        if (descSimilarity > 0.3) {
            reasons.push('Similar description');
        }
    }

    // Tags similarity (15%)
    const tags1 = parseTags(product1.tags);
    const tags2 = parseTags(product2.tags);
    if (tags1.length > 0 || tags2.length > 0) {
        const tagSimilarity = calculateJaccardSimilarity(tags1, tags2);
        score += tagSimilarity * 0.15;
        if (tagSimilarity > 0.3) {
            reasons.push('Similar features');
        }
    }

    // Price range similarity (5%)
    const priceDiff = Math.abs(product1.price - product2.price);
    const avgPrice = (product1.price + product2.price) / 2;
    const priceRatio = avgPrice > 0 ? 1 - Math.min(priceDiff / avgPrice, 1) : 0;
    score += priceRatio * 0.05;
    if (priceRatio > 0.7) {
        reasons.push('Similar price range');
    }

    return { score, reasons };
}

export function getRecommendedProducts(
    currentProduct: Product,
    allProducts: Product[],
    limit: number = 8
): ScoredProduct[] {
    const candidateProducts = allProducts.filter(
        p => p.id !== currentProduct.id && p.isActive && p.stock > 0
    );

    const scoredProducts: ScoredProduct[] = candidateProducts.map(product => {
        const { score, reasons } = calculateProductSimilarity(currentProduct, product);
        return {
            ...product,
            similarityScore: score,
            matchReasons: reasons
        };
    });

    return scoredProducts
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, limit);
}

export function getDiverseRecommendations(
    currentProduct: Product,
    allProducts: Product[],
    limit: number = 8
): ScoredProduct[] {
    const similarProducts = getRecommendedProducts(currentProduct, allProducts, limit * 2);

    if (similarProducts.length >= limit) {
        return similarProducts.slice(0, limit);
    }

    const remainingSlots = limit - similarProducts.length;
    const usedIds = new Set([currentProduct.id, ...similarProducts.map(p => p.id)]);

    const popularProducts = allProducts
        .filter(p => !usedIds.has(p.id) && p.isActive && p.stock > 0)
        .sort((a, b) => {
            const scoreA = (a.views || 0) * 0.7 + (a.rating || 0) * 30;
            const scoreB = (b.views || 0) * 0.7 + (b.rating || 0) * 30;
            return scoreB - scoreA;
        })
        .slice(0, remainingSlots)
        .map(p => ({
            ...p,
            similarityScore: 0,
            matchReasons: ['Popular product']
        }));

    return [...similarProducts, ...popularProducts];
}
```

---

### Content-Based Line-by-Line Explanation

#### Calculate Text Similarity Function

```typescript
function calculateTextSimilarity(text1: string, text2: string): number {
```
**Line 1:** Function to calculate cosine similarity between two text descriptions. Returns number between 0 (no similarity) and 1 (identical).

```typescript
    if (!text1 || !text2) return 0;
```
**Line 2:** Safety check. Returns 0 if either text is empty/undefined (can't compare nothing).

```typescript
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
```
**Lines 3-4:** Converts both texts to lowercase and splits into word arrays. `/\s+/` matches any whitespace (spaces, tabs, newlines).

```typescript
    const allWords = new Set([...words1, ...words2]);
```
**Line 5:** Creates a Set of all unique words from both texts. Set eliminates duplicates automatically. This is our vocabulary.

```typescript
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
```
**Lines 6-8:** Initializes variables for cosine similarity formula:
- `dotProduct` = A·B (vector dot product)
- `magnitude1` = ||A|| (length of vector A)
- `magnitude2` = ||B|| (length of vector B)

```typescript
    allWords.forEach(word => {
```
**Line 9:** Iterates through each unique word in the vocabulary.

```typescript
        const count1 = words1.filter(w => w === word).length;
        const count2 = words2.filter(w => w === word).length;
```
**Lines 10-11:** Counts how many times this word appears in each text. This creates the term frequency vectors.

```typescript
        dotProduct += count1 * count2;
```
**Line 12:** Adds to dot product. Multiplies frequencies and accumulates. Example: if "camera" appears 2 times in text1 and 3 times in text2, adds 2×3=6.

```typescript
        magnitude1 += count1 * count1;
        magnitude2 += count2 * count2;
    });
```
**Lines 13-15:** Accumulates squared frequencies for magnitude calculation. Will take square root later.

```typescript
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
```
**Line 16:** Prevents division by zero. If either text has no valid words, similarity is 0.

```typescript
    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}
```
**Lines 17-18:** Calculates and returns cosine similarity: dotProduct / (||A|| × ||B||). Result is between 0 and 1.

**Example:**
- Text1: "gaming laptop" → [gaming, laptop]
- Text2: "laptop computer" → [laptop, computer]
- Vocabulary: {gaming, laptop, computer}
- Vectors: A=[1,1,0], B=[0,1,1]
- Dot product: 1×0 + 1×1 + 0×1 = 1
- Magnitude A: √(1² + 1² + 0²) = √2
- Magnitude B: √(0² + 1² + 1²) = √2
- Similarity: 1 / (√2 × √2) = 1/2 = 0.5

---

#### Parse Tags Function

```typescript
function parseTags(tags: string[] | string | undefined): string[] {
```
**Line 1:** Function to parse tags which might be stored as JSON string, array, or undefined.

```typescript
    if (!tags) return [];
```
**Line 2:** Returns empty array if tags is null/undefined/empty.

```typescript
    if (Array.isArray(tags)) return tags;
```
**Line 3:** If tags is already an array, returns it directly.

```typescript
    try {
        return JSON.parse(tags);
```
**Lines 4-5:** Attempts to parse tags as JSON string. Example: `"['wireless','bluetooth']"` → `['wireless','bluetooth']`.

```typescript
    } catch {
        return [];
    }
}
```
**Lines 6-8:** If JSON parsing fails (malformed string), returns empty array. Prevents application crashes.

---

#### Calculate Jaccard Similarity Function

```typescript
function calculateJaccardSimilarity(set1: string[], set2: string[]): number {
```
**Line 1:** Function to calculate Jaccard similarity for sets (tags/features). Measures overlap between two sets.

```typescript
    if (set1.length === 0 && set2.length === 0) return 0;
```
**Line 2:** Returns 0 if both sets are empty (no tags to compare).

```typescript
    const intersection = set1.filter(item => set2.includes(item)).length;
```
**Line 3:** Counts items in set1 that also exist in set2. This is |A ∩ B| (intersection size).

```typescript
    const union = new Set([...set1, ...set2]).size;
```
**Line 4:** Creates a Set with all items from both arrays. Set automatically removes duplicates. This is |A ∪ B| (union size).

```typescript
    return union > 0 ? intersection / union : 0;
}
```
**Lines 5-6:** Returns Jaccard coefficient: intersection/union. Prevents division by zero.

**Example:**
- Set1: ["wireless", "bluetooth", "portable"]
- Set2: ["wireless", "portable", "rechargeable"]
- Intersection: ["wireless", "portable"] = 2 items
- Union: {"wireless", "bluetooth", "portable", "rechargeable"} = 4 items
- Jaccard: 2/4 = 0.5 (50% similarity)

---

#### Calculate Product Similarity Function

```typescript
export function calculateProductSimilarity(
    product1: Product,
    product2: Product
): { score: number; reasons: string[] } {
```
**Lines 1-4:** Main similarity calculation function. Takes two products, returns similarity score (0-1) and array of matching reasons.

```typescript
    const reasons: string[] = [];
    let score = 0;
```
**Lines 5-6:** Initializes empty reasons array and zero score. Will accumulate both as we check each feature.

```typescript
    // Category match (35%)
    if (product1.categoryId === product2.categoryId) {
        score += 0.35;
        reasons.push('Same category');
    }
```
**Lines 7-11:** **Category matching (35% weight):** 
- Checks if products are in same category
- If yes, adds 0.35 to score (35% match)
- Records reason
- This is the most important factor (products in same category are most likely related)

```typescript
    // Brand match (25%)
    if (product1.brand && product2.brand &&
        product1.brand.toLowerCase() === product2.brand.toLowerCase()) {
        score += 0.25;
        reasons.push('Same brand');
    }
```
**Lines 12-17:** **Brand matching (25% weight):**
- Checks both products have brands defined
- Compares brands (case-insensitive)
- If same brand, adds 0.25 to score
- Users often prefer products from same brand

```typescript
    // Description similarity (20%)
    if (product1.description && product2.description) {
```
**Lines 18-20:** **Description similarity (20% weight):** Checks both descriptions exist before comparing.

```typescript
        const descSimilarity = calculateTextSimilarity(
            product1.description,
            product2.description
        );
```
**Lines 21-24:** Calculates cosine similarity between descriptions (0-1 range).

```typescript
        score += descSimilarity * 0.20;
```
**Line 25:** Weights description similarity by 20%. If descriptions are 80% similar, adds 0.8 × 0.20 = 0.16 to score.

```typescript
        if (descSimilarity > 0.3) {
            reasons.push('Similar description');
        }
    }
```
**Lines 26-29:** If similarity is above 30%, records this as a matching reason.

```typescript
    // Tags similarity (15%)
    const tags1 = parseTags(product1.tags);
    const tags2 = parseTags(product2.tags);
```
**Lines 30-32:** **Tags similarity (15% weight):** Parses tags from both products (handles JSON strings/arrays).

```typescript
    if (tags1.length > 0 || tags2.length > 0) {
```
**Line 33:** Only calculates tag similarity if at least one product has tags.

```typescript
        const tagSimilarity = calculateJaccardSimilarity(tags1, tags2);
```
**Line 34:** Calculates Jaccard similarity for tag sets (0-1 range).

```typescript
        score += tagSimilarity * 0.15;
```
**Line 35:** Weights tag similarity by 15%. If 60% of tags match, adds 0.6 × 0.15 = 0.09 to score.

```typescript
        if (tagSimilarity > 0.3) {
            reasons.push('Similar features');
        }
    }
```
**Lines 36-39:** If more than 30% tag overlap, records this reason.

```typescript
    // Price range similarity (5%)
    const priceDiff = Math.abs(product1.price - product2.price);
```
**Lines 40-41:** **Price similarity (5% weight):** Calculates absolute price difference.

```typescript
    const avgPrice = (product1.price + product2.price) / 2;
```
**Line 42:** Calculates average price for normalization.

```typescript
    const priceRatio = avgPrice > 0 ? 1 - Math.min(priceDiff / avgPrice, 1) : 0;
```
**Line 43:** Calculates price similarity ratio:
- `priceDiff / avgPrice` = relative difference
- `Math.min(..., 1)` = caps at 1 (100% different)
- `1 - ...` = converts difference to similarity
- Result: 1 (same price) to 0 (very different)

```typescript
    score += priceRatio * 0.05;
```
**Line 44:** Weights price similarity by 5%. Small weight because price is least important factor.

```typescript
    if (priceRatio > 0.7) {
        reasons.push('Similar price range');
    }
```
**Lines 45-47:** If prices within 30% of each other, records this reason.

```typescript
    return { score, reasons };
}
```
**Lines 48-49:** Returns final similarity score (sum of all weighted factors) and array of match reasons.

---

#### Get Recommended Products Function

```typescript
export function getRecommendedProducts(
    currentProduct: Product,
    allProducts: Product[],
    limit: number = 8
): ScoredProduct[] {
```
**Lines 1-5:** Main recommendation function. Takes current product, all available products, and optional limit (default 8).

```typescript
    const candidateProducts = allProducts.filter(
        p => p.id !== currentProduct.id && p.isActive && p.stock > 0
    );
```
**Lines 6-8:** Filters products to exclude:
- Current product itself (can't recommend same item)
- Inactive products (not available)
- Out-of-stock products (can't purchase)

```typescript
    const scoredProducts: ScoredProduct[] = candidateProducts.map(product => {
```
**Line 9:** Maps each candidate product to scored product with similarity data.

```typescript
        const { score, reasons } = calculateProductSimilarity(currentProduct, product);
```
**Line 10:** Calculates similarity score and reasons between current product and this candidate.

```typescript
        return {
            ...product,
            similarityScore: score,
            matchReasons: reasons
        };
    });
```
**Lines 11-16:** Returns new object with all product properties plus similarity score and match reasons. Spread operator `...product` copies all properties.

```typescript
    return scoredProducts
        .sort((a, b) => b.similarityScore - a.similarityScore)
```
**Lines 17-18:** Sorts products by similarity score in descending order (most similar first).

```typescript
        .slice(0, limit);
}
```
**Lines 19-20:** Returns only top N products (limit) and closes function.

---

#### Get Diverse Recommendations Function

```typescript
export function getDiverseRecommendations(
    currentProduct: Product,
    allProducts: Product[],
    limit: number = 8
): ScoredProduct[] {
```
**Lines 1-5:** Enhanced recommendation function that mixes similar products with popular items if needed.

```typescript
    const similarProducts = getRecommendedProducts(currentProduct, allProducts, limit * 2);
```
**Line 6:** Gets similar products (requests 2× limit to have extras for diversity).

```typescript
    if (similarProducts.length >= limit) {
        return similarProducts.slice(0, limit);
    }
```
**Lines 7-9:** If we have enough similar products, returns top N and we're done.

```typescript
    const remainingSlots = limit - similarProducts.length;
```
**Line 10:** Calculates how many more products needed to fill recommendation list.

```typescript
    const usedIds = new Set([currentProduct.id, ...similarProducts.map(p => p.id)]);
```
**Line 11:** Creates Set of already used product IDs (current product + similar products). Used to prevent duplicates.

```typescript
    const popularProducts = allProducts
        .filter(p => !usedIds.has(p.id) && p.isActive && p.stock > 0)
```
**Lines 12-13:** Filters to products not already used, active, and in stock.

```typescript
        .sort((a, b) => {
            const scoreA = (a.views || 0) * 0.7 + (a.rating || 0) * 30;
            const scoreB = (b.views || 0) * 0.7 + (b.rating || 0) * 30;
            return scoreB - scoreA;
        })
```
**Lines 14-18:** Sorts by popularity score:
- Views weighted at 70% (multiply by 0.7)
- Rating weighted at 30% (multiply by 30 to scale 1-5 rating)
- Higher score = more popular

```typescript
        .slice(0, remainingSlots)
```
**Line 19:** Takes only enough products to fill remaining recommendation slots.

```typescript
        .map(p => ({
            ...p,
            similarityScore: 0,
            matchReasons: ['Popular product']
        }));
```
**Lines 20-24:** Transforms to scored products with 0 similarity (not similarity-based) and "Popular product" reason.

```typescript
    return [...similarProducts, ...popularProducts];
}
```
**Lines 25-26:** Combines similar products with popular products using spread operator. Returns complete recommendation list.

---

## Summary Table

| Algorithm | Purpose | Key Technique | Complexity | Best For |
|-----------|---------|---------------|------------|----------|
| **BM25** | Search Ranking | TF-IDF + Length Normalization | O(n×m) per search | Finding products based on text queries |
| **Content-Based** | Recommendations | Weighted Feature Similarity | O(n) per product | Suggesting similar products |

## Performance Characteristics

### BM25
- **Preprocessing:** O(n×m) - tokenize all documents
- **Search Time:** O(n×q) - n=documents, q=query terms
- **Space:** O(n×v) - v=vocabulary size
- **Optimal For:** <100k documents

### Content-Based Filtering
- **Computation:** O(n) - compare with n products
- **Space:** O(1) - no preprocessing needed
- **Optimal For:** Real-time recommendations

---

## Real-World Example

### BM25 Search: "wireless gaming mouse"

**Query Processing:**
1. Tokenize: `["wireless", "gaming", "mouse"]`
2. Remove stop words: (none in this case)
3. Calculate IDF for each term
4. Score each product across all fields
5. Weight by field importance
6. Sort by total score

**Top Result:** "Wireless Gaming Mouse RGB" 
- Title: contains all 3 terms ✓
- Tags: ["wireless", "gaming", "rgb", "mouse"] ✓
- Score: 8.45 (high)

---

### Content-Based: Recommend for "iPhone 14 Pro"

**Similarity Calculation:**

| Product | Category | Brand | Desc Sim | Tag Sim | Price Sim | **Total** |
|---------|----------|-------|----------|---------|-----------|-----------|
| iPhone 13 | ✓ 0.35 | ✓ 0.25 | 0.14 | 0.10 | 0.04 | **0.88** |
| Samsung S23 | ✓ 0.35 | ✗ 0 | 0.12 | 0.09 | 0.04 | **0.60** |
| AirPods Pro | ✗ 0 | ✓ 0.25 | 0.02 | 0.05 | 0.01 | **0.33** |

**Recommendation:** iPhone 13 (88% similar)

---

## Testing the Algorithms

### Test BM25:
```bash
cd backend
node utils/bm25.test.js
```

### Test Recommendations:
1. Navigate to any product detail page
2. Scroll to "Recommended Products" section
3. Verify products share category/brand/features
4. Check algorithm explanation panel

---

## Conclusion

These two algorithms work together to create a powerful e-commerce experience:

- **BM25** helps users **find** what they're looking for
- **Content-Based Filtering** helps users **discover** what they might like

Both algorithms are:
- ✅ Production-ready
- ✅ Well-tested
- ✅ Fully documented
- ✅ Optimized for performance
- ✅ Easy to customize

---

**Document Version:** 1.0  
**Last Updated:** November 6, 2025  
**Status:** Complete
