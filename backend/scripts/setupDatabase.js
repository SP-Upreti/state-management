require('dotenv').config();
const { sequelize } = require('../config/database');
const { User, Category, Product, Cart, CartItem, Order, OrderItem, Review, Address } = require('../models');

const sampleCategories = [
    {
        name: 'Beauty',
        slug: 'beauty',
        description: 'Beauty and cosmetic products',
        sortOrder: 1
    },
    {
        name: 'Fragrances',
        slug: 'fragrances',
        description: 'Perfumes and fragrances',
        sortOrder: 2
    },
    {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Home and office furniture',
        sortOrder: 3
    },
    {
        name: 'Groceries',
        slug: 'groceries',
        description: 'Food and grocery items',
        sortOrder: 4
    },
    {
        name: 'Home Decoration',
        slug: 'home-decoration',
        description: 'Home decoration and accessories',
        sortOrder: 5
    },
    {
        name: 'Kitchen Accessories',
        slug: 'kitchen-accessories',
        description: 'Kitchen tools and accessories',
        sortOrder: 6
    },
    {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Laptops and notebooks',
        sortOrder: 7
    },
    {
        name: 'Mens Shirts',
        slug: 'mens-shirts',
        description: 'Men\'s shirts and tops',
        sortOrder: 8
    },
    {
        name: 'Mens Shoes',
        slug: 'mens-shoes',
        description: 'Men\'s footwear',
        sortOrder: 9
    },
    {
        name: 'Mens Watches',
        slug: 'mens-watches',
        description: 'Men\'s watches and timepieces',
        sortOrder: 10
    },
    {
        name: 'Mobile Accessories',
        slug: 'mobile-accessories',
        description: 'Phone cases, chargers, and accessories',
        sortOrder: 11
    },
    {
        name: 'Motorcycle',
        slug: 'motorcycle',
        description: 'Motorcycles and parts',
        sortOrder: 12
    },
    {
        name: 'Skin Care',
        slug: 'skin-care',
        description: 'Skincare products and treatments',
        sortOrder: 13
    },
    {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones and smartphones',
        sortOrder: 14
    },
    {
        name: 'Sports Accessories',
        slug: 'sports-accessories',
        description: 'Sports equipment and accessories',
        sortOrder: 15
    },
    {
        name: 'Sunglasses',
        slug: 'sunglasses',
        description: 'Sunglasses and eyewear',
        sortOrder: 16
    },
    {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Tablets and e-readers',
        sortOrder: 17
    },
    {
        name: 'Tops',
        slug: 'tops',
        description: 'Tops and t-shirts',
        sortOrder: 18
    },
    {
        name: 'Vehicle',
        slug: 'vehicle',
        description: 'Cars and vehicles',
        sortOrder: 19
    },
    {
        name: 'Womens Bags',
        slug: 'womens-bags',
        description: 'Women\'s handbags and purses',
        sortOrder: 20
    },
    {
        name: 'Womens Dresses',
        slug: 'womens-dresses',
        description: 'Women\'s dresses and gowns',
        sortOrder: 21
    },
    {
        name: 'Womens Jewellery',
        slug: 'womens-jewellery',
        description: 'Women\'s jewelry and accessories',
        sortOrder: 22
    },
    {
        name: 'Womens Shoes',
        slug: 'womens-shoes',
        description: 'Women\'s footwear',
        sortOrder: 23
    },
    {
        name: 'Womens Watches',
        slug: 'womens-watches',
        description: 'Women\'s watches and timepieces',
        sortOrder: 24
    }
];

const sampleProducts = [
    {
        title: 'Essence Mascara Lash Princess',
        description: 'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.',
        price: 9.99,
        discountPercentage: 7.17,
        rating: 4.94,
        stock: 5,
        brand: 'Essence',
        sku: 'RCH45Q1A',
        thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
        images: [
            'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png'
        ],
        categoryId: 1, // Beauty
        isFeatured: true
    },
    {
        title: 'Eyeshadow Palette with Mirror',
        description: 'The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it\'s convenient for on-the-go makeup application.',
        price: 19.99,
        discountPercentage: 5.5,
        rating: 3.28,
        stock: 44,
        brand: 'Glamour Beauty',
        sku: 'MVCFH27F',
        thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png',
        images: [
            'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png'
        ],
        categoryId: 1 // Beauty
    },
    {
        title: 'Powder Canister',
        description: 'The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.',
        price: 14.99,
        discountPercentage: 18.14,
        rating: 3.82,
        stock: 59,
        brand: 'Velvet Touch',
        sku: 'VJU979VJ',
        thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png',
        images: [
            'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png'
        ],
        categoryId: 1 // Beauty
    },
    {
        title: 'Calvin Klein CK One',
        description: 'CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It\'s a versatile fragrance suitable for everyday wear.',
        price: 49.99,
        discountPercentage: 0.32,
        rating: 4.85,
        stock: 17,
        brand: 'Calvin Klein',
        sku: 'DZM2JQZE',
        thumbnail: 'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png',
        images: [
            'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/1.png',
            'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/2.png',
            'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/3.png'
        ],
        categoryId: 2, // Fragrances
        isFeatured: true
    },
    {
        title: 'Chanel Coco Noir Eau De',
        description: 'Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.',
        price: 129.99,
        discountPercentage: 18.64,
        rating: 2.76,
        stock: 41,
        brand: 'Chanel',
        sku: 'K71HBCGS',
        thumbnail: 'https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/thumbnail.png',
        images: [
            'https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/1.png',
            'https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/2.png',
            'https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/3.png'
        ],
        categoryId: 2 // Fragrances
    },
    {
        title: 'Annibale Colombo Bed',
        description: 'The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.',
        price: 1899.99,
        discountPercentage: 0.29,
        rating: 4.14,
        stock: 47,
        brand: 'Annibale Colombo',
        sku: 'A4PQLJDD',
        thumbnail: 'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.png',
        images: [
            'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/1.png',
            'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/2.png',
            'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/3.png'
        ],
        categoryId: 3 // Furniture
    },
    {
        title: 'Apple MacBook Pro 14 Inch Space Grey',
        description: 'The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring the latest technology and design for professional use.',
        price: 1999.99,
        discountPercentage: 9.25,
        rating: 3.13,
        stock: 39,
        brand: 'Apple',
        sku: 'TYZP66EP',
        thumbnail: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png',
        images: [
            'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png',
            'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/2.png',
            'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/3.png'
        ],
        categoryId: 7, // Laptops
        isFeatured: true
    },
    {
        title: 'iPhone 13 Pro Max',
        description: 'The iPhone 13 Pro Max is Apple\'s flagship smartphone, featuring a stunning Super Retina XDR display, advanced camera system, and powerful A15 Bionic chip.',
        price: 1099.99,
        discountPercentage: 8.45,
        rating: 4.65,
        stock: 23,
        brand: 'Apple',
        sku: 'APL13PM',
        thumbnail: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=300',
        images: [
            'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
        ],
        categoryId: 14, // Smartphones
        isFeatured: true
    }
];

const sampleUsers = [
    {
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567890',
        birthDate: '1990-01-01'
    },
    {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        phone: '+1234567891',
        birthDate: '1985-05-15'
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
        phone: '+1234567892',
        birthDate: '1992-08-22'
    }
];

const setupDatabase = async () => {
    try {
        console.log('🔄 Starting database setup...');

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        // Drop all tables if they exist (for fresh setup)
        await sequelize.drop();
        console.log('🗑️  Dropped existing tables');

        // Create all tables
        await sequelize.sync({ force: true });
        console.log('📋 Created all tables');

        // Insert sample categories
        console.log('🏷️  Inserting categories...');
        await Category.bulkCreate(sampleCategories);
        console.log(`✅ Inserted ${sampleCategories.length} categories`);

        // Insert sample users
        console.log('👥 Inserting users...');
        await User.bulkCreate(sampleUsers);
        console.log(`✅ Inserted ${sampleUsers.length} users`);

        // Insert sample products
        console.log('📦 Inserting products...');
        await Product.bulkCreate(sampleProducts);
        console.log(`✅ Inserted ${sampleProducts.length} products`);

        // Create sample addresses
        const users = await User.findAll();
        const addresses = [
            {
                userId: users[1].id, // John Doe
                type: 'shipping',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'United States',
                phone: '+1234567891',
                isDefault: true
            },
            {
                userId: users[2].id, // Jane Smith
                type: 'shipping',
                firstName: 'Jane',
                lastName: 'Smith',
                address: '456 Oak Ave',
                city: 'Los Angeles',
                state: 'CA',
                zipCode: '90210',
                country: 'United States',
                phone: '+1234567892',
                isDefault: true
            }
        ];

        console.log('🏠 Inserting addresses...');
        await Address.bulkCreate(addresses);
        console.log(`✅ Inserted ${addresses.length} addresses`);

        // Create sample reviews
        const products = await Product.findAll();
        const reviews = [
            {
                userId: users[1].id,
                productId: products[0].id,
                rating: 5,
                comment: 'Amazing mascara! Really makes my lashes pop.',
                isVerifiedPurchase: true
            },
            {
                userId: users[2].id,
                productId: products[0].id,
                rating: 4,
                comment: 'Good quality, but a bit pricey.',
                isVerifiedPurchase: true
            },
            {
                userId: users[1].id,
                productId: products[3].id,
                rating: 5,
                comment: 'Love this fragrance! Fresh and clean scent.',
                isVerifiedPurchase: true
            }
        ];

        console.log('⭐ Inserting reviews...');
        await Review.bulkCreate(reviews);
        console.log(`✅ Inserted ${reviews.length} reviews`);

        console.log('🎉 Database setup completed successfully!');
        console.log('\n📊 Setup Summary:');
        console.log(`   Categories: ${sampleCategories.length}`);
        console.log(`   Products: ${sampleProducts.length}`);
        console.log(`   Users: ${sampleUsers.length}`);
        console.log(`   Addresses: ${addresses.length}`);
        console.log(`   Reviews: ${reviews.length}`);
        console.log('\n🔐 Admin Login:');
        console.log('   Email: admin@example.com');
        console.log('   Password: admin123');
        console.log('\n👤 Test User Login:');
        console.log('   Email: john@example.com');
        console.log('   Password: password123');

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        throw error;
    }
};

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase()
        .then(() => {
            console.log('\n✨ Setup complete! You can now start the server.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Setup failed:', error);
            process.exit(1);
        });
}

module.exports = { setupDatabase };