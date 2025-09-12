const express = require('express');
const { Op } = require('sequelize');
const { Order, OrderItem, Product, Category, User, Cart, CartItem } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { validate, orderSchema } = require('../middleware/validation');

const router = express.Router();

// Helper function to generate unique order number
const generateOrderNumber = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${randomNum}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, billingAddress, paymentMethod, paymentId } = req.body;
        const userId = req.user.id;

        // Get user's cart
        const cart = await Cart.findOne({
            where: { userId, isActive: true }
        });

        if (!cart) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Get cart items
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [
                {
                    model: Product,
                    as: 'product',
                    include: [
                        {
                            model: Category,
                            as: 'category',
                            attributes: ['id', 'name', 'slug']
                        }
                    ]
                }
            ]
        });

        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate stock for all items
        for (const item of cartItems) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.product.title}. Only ${item.product.stock} available.`
                });
            }
        }

        // Calculate totals
        let totalAmount = 0;
        let totalDiscountedAmount = 0;
        let totalProducts = cartItems.length;
        let totalQuantity = 0;

        cartItems.forEach(item => {
            const discountedPrice = item.priceAtTime * (1 - item.discountAtTime / 100);
            const itemTotal = discountedPrice * item.quantity;

            totalAmount += item.priceAtTime * item.quantity;
            totalDiscountedAmount += itemTotal;
            totalQuantity += item.quantity;
        });

        // Calculate shipping and tax
        const shippingCost = totalDiscountedAmount > 100 ? 0 : 15;
        const tax = totalDiscountedAmount * 0.08; // 8% tax
        const finalTotal = totalDiscountedAmount + shippingCost + tax;

        // Create order
        const order = await Order.create({
            orderNumber: generateOrderNumber(),
            userId,
            status: 'pending',
            totalAmount: Math.round(totalAmount * 100) / 100,
            discountedTotal: Math.round(finalTotal * 100) / 100,
            shippingCost: Math.round(shippingCost * 100) / 100,
            tax: Math.round(tax * 100) / 100,
            totalProducts,
            totalQuantity,
            paymentMethod,
            paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
            paymentId,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });

        // Create order items and update product stock
        const orderItems = [];
        for (const item of cartItems) {
            const discountedPrice = item.priceAtTime * (1 - item.discountAtTime / 100);
            const total = discountedPrice * item.quantity;

            const orderItem = await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.priceAtTime,
                discountPercentage: item.discountAtTime,
                discountedPrice: Math.round(discountedPrice * 100) / 100,
                total: Math.round(total * 100) / 100,
                productSnapshot: {
                    id: item.product.id,
                    title: item.product.title,
                    description: item.product.description,
                    brand: item.product.brand,
                    thumbnail: item.product.thumbnail,
                    category: item.product.category
                }
            });

            orderItems.push(orderItem);

            // Update product stock
            await item.product.update({
                stock: item.product.stock - item.quantity
            });
        }

        // Clear cart
        await CartItem.destroy({ where: { cartId: cart.id } });
        await cart.update({ isActive: false });

        // Get complete order with items
        const completeOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'title', 'thumbnail', 'brand']
                        }
                    ]
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: { order: completeOrder }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = { userId: req.user.id };
        if (status) {
            where.status = status;
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'title', 'thumbnail', 'brand']
                        }
                    ]
                }
            ],
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'title', 'thumbnail', 'brand', 'category']
                        }
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order can be cancelled
        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.status}`
            });
        }

        // Restore product stock
        for (const item of order.items) {
            await item.product.update({
                stock: item.product.stock + item.quantity
            });
        }

        // Update order status
        await order.update({
            status: 'cancelled',
            paymentStatus: 'refunded'
        });

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            paymentStatus,
            startDate,
            endDate,
            search
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const where = {};

        // Status filter
        if (status) where.status = status;
        if (paymentStatus) where.paymentStatus = paymentStatus;

        // Date range filter
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = new Date(startDate);
            if (endDate) where.createdAt[Op.lte] = new Date(endDate);
        }

        // Search filter
        if (search) {
            where[Op.or] = [
                { orderNumber: { [Op.like]: `%${search}%` } },
                { '$user.firstName$': { [Op.like]: `%${search}%` } },
                { '$user.lastName$': { [Op.like]: `%${search}%` } },
                { '$user.email$': { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'title', 'thumbnail']
                        }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']],
            distinct: true
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

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status, trackingNumber } = req.body;

        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const updateData = { status };

        // Add tracking number if provided
        if (trackingNumber) {
            updateData.trackingNumber = trackingNumber;
        }

        // Set delivered date if status is delivered
        if (status === 'delivered') {
            updateData.deliveredAt = new Date();
        }

        await order.update(updateData);

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
const getOrderStats = async (req, res, next) => {
    try {
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // Total orders
        const totalOrders = await Order.count();

        // Orders in period
        const periodOrders = await Order.count({
            where: {
                createdAt: { [Op.gte]: startDate }
            }
        });

        // Total revenue
        const totalRevenue = await Order.sum('discountedTotal', {
            where: {
                paymentStatus: 'paid'
            }
        });

        // Revenue in period
        const periodRevenue = await Order.sum('discountedTotal', {
            where: {
                paymentStatus: 'paid',
                createdAt: { [Op.gte]: startDate }
            }
        });

        // Orders by status
        const ordersByStatus = await Order.findAll({
            attributes: [
                'status',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
            ],
            group: 'status',
            raw: true
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

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalOrders,
                    periodOrders,
                    totalRevenue: totalRevenue || 0,
                    periodRevenue: periodRevenue || 0,
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
router.post('/', protect, validate(orderSchema), createOrder);
router.get('/admin/stats', protect, authorize('admin'), getOrderStats);
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/', protect, getUserOrders);

module.exports = router;