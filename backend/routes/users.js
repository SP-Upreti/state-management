const express = require('express');
const { Op } = require('sequelize');
const { User, Address, Order, Review, Product } = require('../models');
const { protect } = require('../middleware/auth');
const { validate, addressSchema } = require('../middleware/validation');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [
                {
                    model: Address,
                    as: 'addresses',
                    order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            birthDate: req.body.birthDate,
            bloodGroup: req.body.bloodGroup,
            height: req.body.height,
            weight: req.body.weight,
            eyeColor: req.body.eyeColor,
            hairColor: req.body.hairColor,
            hairType: req.body.hairType
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key =>
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByPk(req.user.id);
        await user.update(fieldsToUpdate);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getUserAddresses = async (req, res, next) => {
    try {
        const addresses = await Address.findAll({
            where: { userId: req.user.id },
            order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: addresses.length,
            data: { addresses }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res, next) => {
    try {
        const addressData = {
            ...req.body,
            userId: req.user.id
        };

        // If this is set as default, remove default from other addresses
        if (addressData.isDefault) {
            await Address.update(
                { isDefault: false },
                { where: { userId: req.user.id, type: addressData.type } }
            );
        }

        const address = await Address.create(addressData);

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: { address }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = async (req, res, next) => {
    try {
        const address = await Address.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // If this is set as default, remove default from other addresses
        if (req.body.isDefault && !address.isDefault) {
            await Address.update(
                { isDefault: false },
                { where: { userId: req.user.id, type: address.type } }
            );
        }

        await address.update(req.body);

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: { address }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = async (req, res, next) => {
    try {
        const address = await Address.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        await address.destroy();

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Set default address
// @route   PUT /api/users/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res, next) => {
    try {
        const address = await Address.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Remove default from other addresses of same type
        await Address.update(
            { isDefault: false },
            { where: { userId: req.user.id, type: address.type } }
        );

        // Set this address as default
        await address.update({ isDefault: true });

        res.status(200).json({
            success: true,
            message: 'Default address updated successfully',
            data: { address }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user order history
// @route   GET /api/users/orders
// @access  Private
const getUserOrderHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = { userId: req.user.id };
        if (status) where.status = status;

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            total: count,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            },
            data: { orders }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user reviews
// @route   GET /api/users/reviews
// @access  Private
const getUserReviews = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: reviews } = await Review.findAndCountAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'title', 'thumbnail']
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            total: count,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            },
            data: { reviews }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res, next) => {
    try {
        // Total orders
        const totalOrders = await Order.count({
            where: { userId: req.user.id }
        });

        // Total spent
        const totalSpent = await Order.sum('discountedTotal', {
            where: {
                userId: req.user.id,
                status: { [Op.ne]: 'cancelled' }
            }
        });

        // Total reviews
        const totalReviews = await Review.count({
            where: { userId: req.user.id }
        });

        // Recent orders
        const recentOrders = await Order.findAll({
            where: { userId: req.user.id },
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        // Orders by status
        const ordersByStatus = await Order.findAll({
            attributes: [
                'status',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
            ],
            where: { userId: req.user.id },
            group: 'status',
            raw: true
        });

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalOrders,
                    totalSpent: totalSpent || 0,
                    totalReviews,
                    ordersByStatus,
                    recentOrders
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/addresses', protect, getUserAddresses);
router.post('/addresses', protect, validate(addressSchema), addAddress);
router.put('/addresses/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);
router.get('/orders', protect, getUserOrderHistory);
router.get('/reviews', protect, getUserReviews);
router.get('/stats', protect, getUserStats);

module.exports = router;