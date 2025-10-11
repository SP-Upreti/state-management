require('dotenv').config();
const { sequelize } = require('../config/database');
const { User } = require('../models');

/**
 * Quick script to create an admin user with predefined credentials
 * Usage: node scripts/createAdminQuick.js
 */

const createAdminQuick = async () => {
    try {
        console.log('\n🔐 Creating Admin User...\n');

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established\n');

        // Predefined admin credentials
        const adminData = {
            firstName: 'Admin',
            lastName: 'Administrator',
            username: 'admin',
            email: 'admin@ecommerce.com',
            password: 'Admin@123456', // Will be encrypted automatically
            phone: '+1-800-ADMIN',
            role: 'admin',
            isActive: true
        };

        // Check if admin already exists
        const { Op } = require('sequelize');
        const existingAdmin = await User.findOne({
            where: {
                [Op.or]: [
                    { email: adminData.email },
                    { username: adminData.username }
                ]
            }
        });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Username: ${existingAdmin.username}`);
            console.log('\n💡 Tip: If you need to reset the password, delete this user first or use a different email/username.\n');
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create(adminData);

        console.log('✅ Admin user created successfully!\n');
        console.log('═══════════════════════════════════════');
        console.log('📋 Admin User Details:');
        console.log('═══════════════════════════════════════');
        console.log(`   ID: ${adminUser.id}`);
        console.log(`   Name: ${adminUser.firstName} ${adminUser.lastName}`);
        console.log(`   Username: ${adminUser.username}`);
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Role: ${adminUser.role}`);
        console.log(`   Phone: ${adminUser.phone}`);
        console.log('\n═══════════════════════════════════════');
        console.log('🔐 Login Credentials:');
        console.log('═══════════════════════════════════════');
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Password: ${adminData.password}`);
        console.log('\n⚠️  IMPORTANT: Password is encrypted in database using bcrypt');
        console.log('═══════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error creating admin user:', error.message);
        console.error(error);
        process.exit(1);
    }
};

// Run the script
createAdminQuick();
