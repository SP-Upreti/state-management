const { sequelize } = require('../config/database');

async function fixIndexes() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database');
        
        // Get all indexes on users table
        const [indexes] = await sequelize.query("SHOW INDEX FROM users WHERE Key_name != 'PRIMARY'");
        console.log('Current indexes count:', indexes.length);
        
        if (indexes.length > 0) {
            console.log('\nIndexes found:');
            const uniqueIndexes = [...new Set(indexes.map(i => i.Key_name))];
            uniqueIndexes.forEach(idx => console.log('  -', idx));
        }
        
        // Drop all non-primary indexes
        const seenIndexes = new Set();
        
        for (const index of indexes) {
            const keyName = index.Key_name;
            
            if (!seenIndexes.has(keyName)) {
                console.log('\nDropping index:', keyName);
                try {
                    await sequelize.query(`ALTER TABLE users DROP INDEX \`${keyName}\``);
                    console.log('  ✓ Dropped:', keyName);
                } catch (error) {
                    console.log('  ✗ Failed to drop:', keyName, '-', error.message);
                }
                seenIndexes.add(keyName);
            }
        }
        
        console.log('\n✅ Indexes cleanup completed');
        console.log('Now restart your server to recreate the correct indexes.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixIndexes();
