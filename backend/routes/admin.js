const express = require('express');
const { Op } = require('sequelize');
const { User, Product, Category, Order, OrderItem, Review } = require('../models');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
    try {
        const { period = '30' } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // Total counts
        const totalUsers = await User.count();
        const totalProducts = await Product.count();
        const totalOrders = await Order.count();
        const totalCategories = await Category.count();

        // Period counts
        const newUsers = await User.count({
            where: { createdAt: { [Op.gte]: startDate } }
        });

        const newProducts = await Product.count({
            where: { createdAt: { [Op.gte]: startDate } }
        });

        const newOrders = await Order.count({
            where: { createdAt: { [Op.gte]: startDate } }
        });

        // Revenue calculations
        const totalRevenue = await Order.sum('discountedTotal', {
            where: { paymentStatus: 'paid' }
        });

        const periodRevenue = await Order.sum('discountedTotal', {
            where: {
                paymentStatus: 'paid',
                createdAt: { [Op.gte]: startDate }
            }
        });

        // Average order value
        const avgOrderValue = await Order.findOne({
            attributes: [
                [require('sequelize').fn('AVG', require('sequelize').col('discountedTotal')), 'avgValue']
            ],
            where: { paymentStatus: 'paid' },
            raw: true
        });

        // Top selling products
        const topProducts = await OrderItem.findAll({
            attributes: [
                'productId',
                [require('sequelize').fn('SUM', require('sequelize').col('quantity')), 'totalSold'],
                [require('sequelize').fn('SUM', require('sequelize').col('total')), 'totalRevenue']
            ],
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['title', 'thumbnail', 'price']
                }
            ],
            group: ['productId'],
            order: [[require('sequelize').fn('SUM', require('sequelize').col('quantity')), 'DESC']],
            limit: 10
        });

        // Recent orders
        const recentOrders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName', 'email']
                }
            ],
            limit: 10,
            order: [['createdAt', 'DESC']]
        });

        // Monthly sales data for chart (last 12 months)
        const salesData = [];
        for (let i = 11; i >= 0; i--) {
            const monthStart = new Date();
            monthStart.setMonth(monthStart.getMonth() - i, 1);
            monthStart.setHours(0, 0, 0, 0);

            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0);
            monthEnd.setHours(23, 59, 59, 999);

            const monthRevenue = await Order.sum('discountedTotal', {
                where: {
                    paymentStatus: 'paid',
                    createdAt: {
                        [Op.gte]: monthStart,
                        [Op.lte]: monthEnd
                    }
                }
            });

            salesData.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                sales: monthRevenue || 0
            });
        }

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    totalCategories,
                    totalRevenue: totalRevenue || 0,
                    avgOrderValue: avgOrderValue?.avgValue || 0
                },
                period: {
                    newUsers,
                    newProducts,
                    newOrders,
                    periodRevenue: periodRevenue || 0
                },
                topProducts,
                recentOrders,
                salesData
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            role,
            isActive
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const where = {};

        // Search filter
        if (search) {
            where[Op.or] = [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { username: { [Op.like]: `%${search}%` } }
            ];
        }

        // Role filter
        if (role) where.role = role;

        // Active status filter
        if (isActive !== undefined) where.isActive = isActive === 'true';

        const { count, rows: users } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Order,
                    as: 'orders',
                    attributes: ['id', 'totalAmount', 'status'],
                    required: false
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        // Add user stats
        const usersWithStats = users.map(user => {
            const orders = user.orders || [];
            const totalOrders = orders.length;
            const totalSpent = orders
                .filter(order => order.status !== 'cancelled')
                .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

            const userData = user.toJSON();
            delete userData.orders;

            return {
                ...userData,
                stats: {
                    totalOrders,
                    totalSpent: Math.round(totalSpent * 100) / 100
                }
            };
        });

        res.status(200).json({
            success: true,
            count: users.length,
            total: count,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            },
            data: { users: usersWithStats }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be user or admin'
            });
        }

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent removing admin role from the current user
        if (user.id === req.user.id && role === 'user') {
            return res.status(400).json({
                success: false,
                message: 'Cannot remove admin role from yourself'
            });
        }

        await user.update({ role });

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deactivating current user
        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot deactivate yourself'
            });
        }

        await user.update({ isActive: !user.isActive });

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting current user
        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete yourself'
            });
        }

        // Check if user has orders
        const orderCount = await Order.count({
            where: { userId: user.id }
        });

        if (orderCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete user. User has ${orderCount} orders associated.`
            });
        }

        await user.destroy();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get product analytics
// @route   GET /api/admin/products/analytics
// @access  Private/Admin
const getProductAnalytics = async (req, res, next) => {
    try {
        // Products by category
        const productsByCategory = await Category.findAll({
            attributes: [
                'id',
                'name',
                [require('sequelize').fn('COUNT', require('sequelize').col('products.id')), 'productCount']
            ],
            include: [
                {
                    model: Product,
                    as: 'products',
                    attributes: [],
                    where: { isActive: true },
                    required: false
                }
            ],
            group: ['Category.id']
        });

        // Low stock products
        const lowStockProducts = await Product.findAll({
            where: {
                stock: { [Op.lte]: 10 },
                isActive: true
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }
            ],
            limit: 20,
            order: [['stock', 'ASC']]
        });

        // Most viewed products
        const mostViewedProducts = await Product.findAll({
            where: { isActive: true },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }
            ],
            order: [['views', 'DESC']],
            limit: 10
        });

        // Products with most reviews
        const productsWithReviews = await Product.findAll({
            attributes: [
                'id',
                'title',
                'thumbnail',
                [require('sequelize').fn('COUNT', require('sequelize').col('reviews.id')), 'reviewCount'],
                [require('sequelize').fn('AVG', require('sequelize').col('reviews.rating')), 'avgRating']
            ],
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    attributes: [],
                    required: false
                }
            ],
            group: ['Product.id'],
            order: [[require('sequelize').fn('COUNT', require('sequelize').col('reviews.id')), 'DESC']],
            limit: 10
        });

        res.status(200).json({
            success: true,
            data: {
                productsByCategory,
                lowStockProducts,
                mostViewedProducts,
                productsWithReviews
            }
        });
    } catch (error) {
        next(error);
    }
};

// Routes
router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/users/:id/status', protect, authorize('admin'), toggleUserStatus);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/products/analytics', protect, authorize('admin'), getProductAnalytics);

module.exports = router;