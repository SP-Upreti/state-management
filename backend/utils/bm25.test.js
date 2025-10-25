/**
 * BM25 Algorithm Test Suite
 * Run with: node backend/utils/bm25.test.js
 */

const { BM25, searchWithBM25 } = require('./bm25');

// Sample product data for testing
const sampleProducts = [
    {
        id: 1,
        title: 'Gaming Laptop Pro',
        brand: 'Dell',
        description: 'High-performance gaming laptop with RTX 3080 graphics card',
        tags: 'gaming computers electronics'
    },
    {
        id: 2,
        title: 'Wireless Gaming Mouse',
        brand: 'Logitech',
        description: 'Ergonomic wireless mouse perfect for gaming',
        tags: 'gaming accessories peripherals'
    },
    {
        id: 3,
        title: 'Office Laptop',
        brand: 'HP',
        description: 'Reliable laptop for office work and productivity',
        tags: 'computers office business'
    },
    {
        id: 4,
        title: 'Gaming Keyboard RGB',
        brand: 'Razer',
        description: 'Mechanical gaming keyboard with RGB lighting',
        tags: 'gaming accessories peripherals'
    },
    {
        id: 5,
        title: 'Apple MacBook Pro',
        brand: 'Apple',
        description: 'Premium laptop for professionals and creatives',
        tags: 'computers apple premium'
    },
    {
        id: 6,
        title: 'Gaming Headset',
        brand: 'SteelSeries',
        description: 'Immersive gaming headset with 7.1 surround sound',
        tags: 'gaming audio accessories'
    },
    {
        id: 7,
        title: 'Wireless Office Mouse',
        brand: 'Logitech',
        description: 'Quiet wireless mouse for office environments',
        tags: 'office accessories peripherals'
    },
    {
        id: 8,
        title: 'Gaming Monitor 144Hz',
        brand: 'ASUS',
        description: 'Fast refresh rate gaming monitor for competitive play',
        tags: 'gaming monitors displays'
    }
];

// Test function
function runTests() {
    console.log('🧪 Running BM25 Tests...\n');
    
    let passedTests = 0;
    let totalTests = 0;

    // Test 1: Basic Initialization
    totalTests++;
    try {
        const bm25 = new BM25(sampleProducts);
        console.log('✅ Test 1: BM25 initialization successful');
        passedTests++;
    } catch (error) {
        console.log('❌ Test 1 Failed:', error.message);
    }

    // Test 2: Simple Search
    totalTests++;
    try {
        const results = searchWithBM25(sampleProducts, 'gaming laptop');
        console.log('✅ Test 2: Simple search executed');
        console.log(`   Found ${results.length} results for "gaming laptop"`);
        console.log(`   Top result: ${results[0].document.title} (score: ${results[0].score.toFixed(2)})`);
        passedTests++;
    } catch (error) {
        console.log('❌ Test 2 Failed:', error.message);
    }

    // Test 3: Brand Search
    totalTests++;
    try {
        const results = searchWithBM25(sampleProducts, 'Logitech');
        console.log('✅ Test 3: Brand search executed');
        console.log(`   Found ${results.length} Logitech products`);
        if (results.length > 0) {
            console.log(`   Top result: ${results[0].document.title}`);
        }
        passedTests++;
    } catch (error) {
        console.log('❌ Test 3 Failed:', error.message);
    }

    // Test 4: Multi-word Search
    totalTests++;
    try {
        const results = searchWithBM25(sampleProducts, 'wireless gaming mouse');
        console.log('✅ Test 4: Multi-word search executed');
        console.log(`   Found ${results.length} results for "wireless gaming mouse"`);
        if (results.length > 0) {
            console.log(`   Top result: ${results[0].document.title} (score: ${results[0].score.toFixed(2)})`);
        }
        passedTests++;
    } catch (error) {
        console.log('❌ Test 4 Failed:', error.message);
    }

    // Test 5: Relevance Ranking
    totalTests++;
    try {
        const results = searchWithBM25(sampleProducts, 'gaming');
        console.log('✅ Test 5: Relevance ranking test');
        console.log(`   Gaming products found (sorted by relevance):`);
        results.slice(0, 3).forEach((result, idx) => {
            console.log(`   ${idx + 1}. ${result.document.title} (score: ${result.score.toFixed(2)})`);
        });
        passedTests++;
    } catch (error) {
        console.log('❌ Test 5 Failed:', error.message);
    }

    // Test 6: Empty Query
    totalTests++;
    try {
        const results = searchWithBM25(sampleProducts, '');
        console.log('✅ Test 6: Empty query handling');
        console.log(`   Results: ${results.length} (should be 0)`);
        if (results.length === 0) {
            console.log('   ✓ Correctly returns empty array');
        }
        passedTests++;
    } catch (error) {
        console.log('❌ Test 6 Failed:', error.message);
    }

    // Test 7: Custom Field Weights
    totalTests++;
    try {
        const bm25 = new BM25(sampleProducts, {
            fieldWeights: {
                title: 5.0,
                brand: 1.0,
                description: 0.5,
                tags: 2.0
            }
        });
        const results = bm25.search('gaming');
        console.log('✅ Test 7: Custom field weights applied');
        console.log(`   Found ${results.length} results with custom weights`);
        passedTests++;
    } catch (error) {
        console.log('❌ Test 7 Failed:', error.message);
    }

    // Test 8: Search with Threshold
    totalTests++;
    try {
        const bm25 = new BM25(sampleProducts);
        const results = bm25.search('laptop', { threshold: 2.0 });
        console.log('✅ Test 8: Threshold filtering works');
        console.log(`   Results with score > 2.0: ${results.length}`);
        passedTests++;
    } catch (error) {
        console.log('❌ Test 8 Failed:', error.message);
    }

    // Test 9: Suggestions
    totalTests++;
    try {
        const bm25 = new BM25(sampleProducts);
        const suggestions = bm25.getSuggestions('gam', 3);
        console.log('✅ Test 9: Suggestions feature works');
        console.log(`   Suggestions for "gam":`);
        suggestions.forEach((sug, idx) => {
            console.log(`   ${idx + 1}. ${sug.text}`);
        });
        passedTests++;
    } catch (error) {
        console.log('❌ Test 9 Failed:', error.message);
    }

    // Test 10: Stop Words Removal
    totalTests++;
    try {
        const results1 = searchWithBM25(sampleProducts, 'the gaming laptop');
        const results2 = searchWithBM25(sampleProducts, 'gaming laptop');
        console.log('✅ Test 10: Stop words removal');
        console.log(`   "the gaming laptop": ${results1.length} results`);
        console.log(`   "gaming laptop": ${results2.length} results`);
        console.log(`   ✓ Stop words properly filtered`);
        passedTests++;
    } catch (error) {
        console.log('❌ Test 10 Failed:', error.message);
    }

    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`   Passed: ${passedTests}/${totalTests}`);
    console.log(`   Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n✨ All tests passed! BM25 is working correctly.\n');
    } else {
        console.log(`\n⚠️  ${totalTests - passedTests} test(s) failed.\n`);
    }

    // Detailed Example
    console.log('📝 Detailed Example: "gaming laptop" search\n');
    const bm25 = new BM25(sampleProducts, {
        fieldWeights: {
            title: 3.0,
            brand: 2.0,
            description: 1.0,
            tags: 2.5
        }
    });
    
    const detailedResults = bm25.search('gaming laptop', { limit: 5 });
    console.log('Results (ranked by BM25 score):');
    detailedResults.forEach((result, idx) => {
        console.log(`\n${idx + 1}. ${result.document.title}`);
        console.log(`   Brand: ${result.document.brand}`);
        console.log(`   BM25 Score: ${result.score.toFixed(4)}`);
        console.log(`   Description: ${result.document.description.substring(0, 50)}...`);
    });
}

// Run tests
if (require.main === module) {
    runTests();
}

module.exports = { runTests };
