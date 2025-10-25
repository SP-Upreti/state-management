import { Product } from './api';

/**
 * Content-based filtering algorithm for product recommendations
 * Uses category, brand, description, and tags to find similar products
 */

// Calculate text similarity using TF-IDF approach
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

    // Cosine similarity
    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

// Parse tags from string or array
function parseTags(tags: string[] | string | undefined): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
        return JSON.parse(tags);
    } catch {
        return [];
    }
}

// Calculate Jaccard similarity for sets (tags)
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

/**
 * Calculate similarity score between two products
 * Weights:
 * - Category match: 35%
 * - Brand match: 25%
 * - Description similarity: 20%
 * - Tags similarity: 15%
 * - Price range similarity: 5%
 */
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

/**
 * Get recommended products based on content-based filtering
 * @param currentProduct - The product to base recommendations on
 * @param allProducts - All available products
 * @param limit - Maximum number of recommendations to return
 * @returns Array of recommended products with similarity scores
 */
export function getRecommendedProducts(
    currentProduct: Product,
    allProducts: Product[],
    limit: number = 8
): ScoredProduct[] {
    // Filter out the current product and inactive products
    const candidateProducts = allProducts.filter(
        p => p.id !== currentProduct.id && p.isActive && p.stock > 0
    );

    // Calculate similarity scores
    const scoredProducts: ScoredProduct[] = candidateProducts.map(product => {
        const { score, reasons } = calculateProductSimilarity(currentProduct, product);
        return {
            ...product,
            similarityScore: score,
            matchReasons: reasons
        };
    });

    // Sort by similarity score (descending) and return top N
    return scoredProducts
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, limit);
}

/**
 * Get diverse recommendations (mix of similar and popular products)
 * @param currentProduct - The product to base recommendations on
 * @param allProducts - All available products
 * @param limit - Maximum number of recommendations to return
 * @returns Array of recommended products
 */
export function getDiverseRecommendations(
    currentProduct: Product,
    allProducts: Product[],
    limit: number = 8
): ScoredProduct[] {
    const similarProducts = getRecommendedProducts(currentProduct, allProducts, limit * 2);

    // If we have enough similar products, return them
    if (similarProducts.length >= limit) {
        return similarProducts.slice(0, limit);
    }

    // Otherwise, fill with popular products from same or different categories
    const remainingSlots = limit - similarProducts.length;
    const usedIds = new Set([currentProduct.id, ...similarProducts.map(p => p.id)]);

    const popularProducts = allProducts
        .filter(p => !usedIds.has(p.id) && p.isActive && p.stock > 0)
        .sort((a, b) => {
            // Sort by views/rating
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
