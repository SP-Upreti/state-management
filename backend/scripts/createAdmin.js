require('dotenv').config();
const { sequelize } = require('../config/database');
const { User } = require('../models');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

const createAdmin = async () => {
    try {
        console.log('\n🔐 Create Admin User\n');
        console.log('═══════════════════════════════════════\n');

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established\n');

        // Get user input
        const firstName = await question('First Name: ');
        const lastName = await question('Last Name: ');
        const username = await question('Username: ');
        const email = await question('Email: ');
        const password = await question('Password: ');
        const phone = await question('Phone (optional): ');

        console.log('\n🔄 Creating admin user...\n');

        // Check if user with email or username already exists
        const { Op } = require('sequelize');
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            console.log('❌ Error: User with this email or username already exists!');
            rl.close();
            process.exit(1);
        }

        // Create admin user
        const adminUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            password, // Password will be automatically hashed by the model's beforeCreate hook
            phone: phone || null,
            role: 'admin',
            isActive: true
        });

        console.log('✅ Admin user created successfully!\n');
        console.log('═══════════════════════════════════════\n');
        console.log('📋 Admin User Details:');
        console.log(`   ID: ${adminUser.id}`);
        console.log(`   Name: ${adminUser.firstName} ${adminUser.lastName}`);
        console.log(`   Username: ${adminUser.username}`);
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Role: ${adminUser.role}`);
        console.log(`   Phone: ${adminUser.phone || 'N/A'}`);
        console.log('\n🔐 Login Credentials:');
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Password: ${password} (encrypted in database)`);
        console.log('\n═══════════════════════════════════════\n');

        rl.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error creating admin user:', error.message);
        rl.close();
        process.exit(1);
    }
};

// Run the script
createAdmin();
