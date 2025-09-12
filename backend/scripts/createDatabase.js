require('dotenv').config();
const mysql = require('mysql2/promise');
const { setupDatabase } = require('./setupDatabase');

const createDatabase = async () => {
    try {
        console.log('🔄 Creating database...');

        // Connect to MySQL without specifying a database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        // Create the database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'ecommerce_db'}`);
        console.log(`✅ Database '${process.env.DB_NAME || 'ecommerce_db'}' created successfully`);

        await connection.end();

        // Now run the database setup
        console.log('🔄 Setting up database schema and data...');
        await setupDatabase();

    } catch (error) {
        console.error('❌ Database creation failed:', error);
        throw error;
    }
};

// Run if this file is executed directly
if (require.main === module) {
    createDatabase()
        .then(() => {
            console.log('\n🎉 Database created and setup completed successfully!');
            console.log('You can now start the server with: npm run dev');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Database creation failed:', error);
            process.exit(1);
        });
}

module.exports = { createDatabase };