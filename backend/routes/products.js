const express = require('express');
const { Op } = require('sequelize');
const { Product, Category, Review, User } = require('../models');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validate, productSchema, reviewSchema } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all products with pagination, filtering, and search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            skip = 0,
            search,
            category,
            brand,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            sortOrder = 'DESC',
            featured
        } = req.query;

        // Build where clause
        const where = { isActive: true };

        // Search functionality
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { brand: { [Op.like]: `%${search}%` } }
            ];
        }

        // Category filter
        if (category) {
            where.categoryId = category;
        }

        // Brand filter
        if (brand) {
            where.brand = { [Op.like]: `%${brand}%` };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
        }

        // Featured filter
        if (featured === 'true') {
            where.isFeatured = true;
        }

        // Calculate offset
        const offset = parseInt(skip) || (parseInt(page) - 1) * parseInt(limit);

        // Get products
        const { count, rows: products } = await Product.findAndCountAll({
            where,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Review,
                    as: 'reviews',
                    attributes: ['rating'],
                    required: false
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [[sortBy, sortOrder.toUpperCase()]],
            distinct: true
        });

        // Calculate average rating for each product
        const productsWithRating = products.map(product => {
            const reviews = product.reviews || [];
            const avgRating = reviews.length > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                : 0;

            const productData = product.toJSON();
            delete productData.reviews;

            return {
                ...productData,
                rating: Math.round(avgRating * 100) / 100,
                reviewCount: reviews.length
            };
        });

        res.status(200).json({
            success: true,
            count: productsWithRating.length,
            total: count,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            },
            data: {
                products: productsWithRating
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            where: {
                id: req.params.id,
                isActive: true
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Review,
                    as: 'reviews',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'firstName', 'lastName', 'image']
                        }
                    ],
                    where: { isApproved: true },
                    required: false,
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Increment view count
        await product.update({ views: product.views + 1 });

        // Calculate average rating
        const reviews = product.reviews || [];
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

        const productData = product.toJSON();
        productData.rating = Math.round(avgRating * 100) / 100;
        productData.reviewCount = reviews.length;

        res.status(200).json({
            success: true,
            data: { product: productData }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        // Add user who created the product
        req.body.createdBy = req.user.id;

        // Generate SKU if not provided
        if (!req.body.sku) {
            const timestamp = Date.now();
            const randomNum = Math.floor(Math.random() * 1000);
            req.body.sku = `PRD-${timestamp}-${randomNum}`;
        }

        const product = await Product.create(req.body);

        // Fetch the created product with associations
        const newProduct = await Product.findByPk(product.id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product: newProduct }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const updatedProduct = await product.update(req.body);

        // Fetch updated product with associations
        const productWithAssociations = await Product.findByPk(updatedProduct.id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: { product: productWithAssociations }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.destroy();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categorySlug
// @access  Public
const getProductsByCategory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Find category
        const category = await Category.findOne({
            where: { slug: req.params.categorySlug }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Get products
        const { count, rows: products } = await Product.findAndCountAll({
            where: {
                categoryId: category.id,
                isActive: true
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: products.length,
            total: count,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            },
            data: {
                category,
                products
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            where: {
                productId: req.params.id,
                userId: req.user.id
            }
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = await Review.create({
            rating,
            comment,
            productId: req.params.id,
            userId: req.user.id
        });

        // Get review with user data
        const newReview = await Review.findByPk(review.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'image']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: { review: newReview }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
    try {
        const { limit = 8 } = req.query;

        const products = await Product.findAll({
            where: {
                isFeatured: true,
                isActive: true
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: { products }
        });
    } catch (error) {
        next(error);
    }
};

// Routes
router.get('/featured', getFeaturedProducts);
router.get('/category/:categorySlug', getProductsByCategory);
router.get('/:id', getProduct);
router.post('/:id/reviews', protect, validate(reviewSchema), addReview);
router.get('/', getProducts);
router.post('/', protect, authorize('admin'), validate(productSchema), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;