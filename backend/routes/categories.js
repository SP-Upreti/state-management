const express = require('express');
const { Category, Product } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { validate, categorySchema } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
    try {
        const { includeProducts = false } = req.query;

        const includeOptions = [];

        if (includeProducts === 'true') {
            includeOptions.push({
                model: Product,
                as: 'products',
                where: { isActive: true },
                attributes: ['id', 'title', 'price', 'thumbnail'],
                required: false,
                limit: 5
            });
        }

        const categories = await Category.findAll({
            where: { isActive: true },
            include: includeOptions,
            order: [['sortOrder', 'ASC'], ['name', 'ASC']]
        });

        // Add product count to each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const productCount = await Product.count({
                    where: {
                        categoryId: category.id,
                        isActive: true
                    }
                });

                return {
                    ...category.toJSON(),
                    productCount
                };
            })
        );

        res.status(200).json({
            success: true,
            count: categoriesWithCount.length,
            data: { categories: categoriesWithCount }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findOne({
            where: {
                id: req.params.id,
                isActive: true
            },
            include: [
                {
                    model: Product,
                    as: 'products',
                    where: { isActive: true },
                    required: false,
                    limit: 10,
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Get total product count
        const productCount = await Product.count({
            where: {
                categoryId: category.id,
                isActive: true
            }
        });

        const categoryData = category.toJSON();
        categoryData.productCount = productCount;

        res.status(200).json({
            success: true,
            data: { category: categoryData }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
    try {
        const category = await Category.findOne({
            where: {
                slug: req.params.slug,
                isActive: true
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Get product count
        const productCount = await Product.count({
            where: {
                categoryId: category.id,
                isActive: true
            }
        });

        const categoryData = category.toJSON();
        categoryData.productCount = productCount;

        res.status(200).json({
            success: true,
            data: { category: categoryData }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { category }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const updatedCategory = await category.update(req.body);

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: { category: updatedCategory }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if category has products
        const productCount = await Product.count({
            where: { categoryId: category.id }
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${productCount} products associated with it.`
            });
        }

        await category.destroy();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// Routes
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);
router.get('/', getCategories);
router.post('/', protect, authorize('admin'), validate(categorySchema), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;