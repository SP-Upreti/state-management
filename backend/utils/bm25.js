class BM25 {
    constructor(documents, options = {}) {
        // BM25 parameters
        this.k1 = options.k1 || 1.5; // Controls term frequency saturation (1.2 - 2.0)
        this.b = options.b || 0.75;  // Controls length normalization (0 - 1)
        
        // Field weights (boost certain fields)
        this.fieldWeights = options.fieldWeights || {
            title: 3.0,      // Title matches are most important
            brand: 2.0,      // Brand matches are important
            description: 1.0, // Description matches are standard
            tags: 2.5        // Tags are very relevant
        };
        
        this.documents = documents;
        this.documentCount = documents.length;
        
        // Tokenize and process documents
        this.processedDocs = documents.map(doc => this.processDocument(doc));
        
        // Calculate average document length for each field
        this.avgFieldLengths = this.calculateAvgFieldLengths();
        
        // Calculate IDF for all terms
        this.idf = this.calculateIDF();
    }

    tokenize(text) {
        if (!text) return [];
        
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ') // Remove special characters
            .split(/\s+/)
            .filter(term => term.length > 0)
            .filter(term => !this.isStopWord(term));
    }

    /**
     * Common stop words to ignore (can be expanded)
     */
    isStopWord(word) {
        const stopWords = new Set([
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have'
        ]);
        return stopWords.has(word);
    }

    /**
     * Process a document into searchable fields
     */
    processDocument(doc) {
        const processed = {
            id: doc.id,
            original: doc,
            fields: {}
        };

        // Process each field
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

    /**
     * Calculate term frequency for tokens
     */
    calculateTermFrequency(tokens) {
        const tf = {};
        tokens.forEach(term => {
            tf[term] = (tf[term] || 0) + 1;
        });
        return tf;
    }

    /**
     * Calculate average field lengths across all documents
     */
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

    /**
     * Calculate Inverse Document Frequency (IDF) for all terms
     * IDF(qi) = ln((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)
     * Where N is total documents and n(qi) is documents containing qi
     */
    calculateIDF() {
        const termDocCount = {};
        
        // Count documents containing each term
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

        // Calculate IDF for each term
        const idf = {};
        Object.entries(termDocCount).forEach(([term, docCount]) => {
            idf[term] = Math.log(
                (this.documentCount - docCount + 0.5) / (docCount + 0.5) + 1
            );
        });

        return idf;
    }

    /**
     * Calculate BM25 score for a single field
     */
    scoreField(queryTerms, field, docField, avgLength) {
        if (!docField) return 0;
        
        let score = 0;
        const docLength = docField.length;
        const tf = docField.termFrequency;

        queryTerms.forEach(term => {
            const termFreq = tf[term] || 0;
            const idf = this.idf[term] || 0;

            // BM25 scoring formula for this term
            const numerator = termFreq * (this.k1 + 1);
            const denominator = termFreq + this.k1 * (
                1 - this.b + this.b * (docLength / (avgLength || 1))
            );

            score += idf * (numerator / denominator);
        });

        return score;
    }

    /**
     * Search documents and return scored results
     */
    search(query, options = {}) {
        const limit = options.limit || 10;
        const threshold = options.threshold || 0; // Minimum score threshold
        
        // Tokenize query
        const queryTerms = this.tokenize(query);
        
        if (queryTerms.length === 0) {
            return [];
        }

        // Score all documents
        const scoredDocs = this.processedDocs.map(doc => {
            let totalScore = 0;

            // Calculate score for each field and apply field weights
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

        // Filter by threshold and sort by score
        return scoredDocs
            .filter(item => item.score > threshold)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    /**
     * Get search suggestions based on partial query
     */
    getSuggestions(partialQuery, limit = 5) {
        const results = this.search(partialQuery, { limit });
        return results.map(result => ({
            text: result.document.title || '',
            score: result.score
        }));
    }
}

/**
 * Helper function to create BM25 instance and search
 */
function searchWithBM25(documents, query, options = {}) {
    const bm25 = new BM25(documents, options);
    return bm25.search(query, options);
}

module.exports = {
    BM25,
    searchWithBM25
};
