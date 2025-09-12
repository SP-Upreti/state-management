const express = require('express');
const { Cart, CartItem, Product, Category } = require('../models');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate, addToCartSchema, updateCartSchema } = require('../middleware/validation');

const router = express.Router();

// Helper function to get or create cart
const getOrCreateCart = async (userId, sessionId = null) => {
    let cart;

    if (userId) {
        cart = await Cart.findOne({
            where: { userId, isActive: true }
        });

        if (!cart) {
            cart = await Cart.create({ userId, isActive: true });
        }
    } else if (sessionId) {
        cart = await Cart.findOne({
            where: { sessionId, isActive: true }
        });

        if (!cart) {
            cart = await Cart.create({ sessionId, isActive: true });
        }
    }

    return cart;
};

// Helper function to calculate cart totals
const calculateCartTotals = (cartItems) => {
    let totalQuantity = 0;
    let totalAmount = 0;
    let totalDiscountedAmount = 0;

    cartItems.forEach(item => {
        const discountedPrice = item.priceAtTime * (1 - item.discountAtTime / 100);
        const itemTotal = discountedPrice * item.quantity;

        totalQuantity += item.quantity;
        totalAmount += item.priceAtTime * item.quantity;
        totalDiscountedAmount += itemTotal;
    });

    return {
        totalQuantity,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalDiscountedAmount: Math.round(totalDiscountedAmount * 100) / 100,
        totalSavings: Math.round((totalAmount - totalDiscountedAmount) * 100) / 100
    };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private/Public (with session)
const getCart = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.headers['x-session-id'];

        if (!userId && !sessionId) {
            return res.status(400).json({
                success: false,
                message: 'User authentication or session ID required'
            });
        }

        const cart = await getOrCreateCart(userId, sessionId);

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                    cart: null,
                    items: [],
                    totals: {
                        totalQuantity: 0,
                        totalAmount: 0,
                        totalDiscountedAmount: 0,
                        totalSavings: 0
                    }
                }
            });
        }

        // Get cart items with product details
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
            ],
            order: [['createdAt', 'ASC']]
        });

        // Format cart items for response
        const formattedItems = cartItems.map(item => {
            const discountedPrice = item.priceAtTime * (1 - item.discountAtTime / 100);
            const total = discountedPrice * item.quantity;

            return {
                id: item.id,
                quantity: item.quantity,
                priceAtTime: item.priceAtTime,
                discountPercentage: item.discountAtTime,
                discountedPrice: Math.round(discountedPrice * 100) / 100,
                total: Math.round(total * 100) / 100,
                product: {
                    id: item.product.id,
                    title: item.product.title,
                    thumbnail: item.product.thumbnail,
                    brand: item.product.brand,
                    stock: item.product.stock,
                    category: item.product.category
                }
            };
        });

        // Calculate totals
        const totals = calculateCartTotals(cartItems);

        res.status(200).json({
            success: true,
            data: {
                cart,
                items: formattedItems,
                totals
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private/Public (with session)
const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user?.id;
        const sessionId = req.headers['x-session-id'];

        if (!userId && !sessionId) {
            return res.status(400).json({
                success: false,
                message: 'User authentication or session ID required'
            });
        }

        // Get product
        const product = await Product.findOne({
            where: { id: productId, isActive: true }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available in stock`
            });
        }

        // Get or create cart
        const cart = await getOrCreateCart(userId, sessionId);

        // Check if item already exists in cart
        const existingItem = await CartItem.findOne({
            where: { cartId: cart.id, productId }
        });

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            if (product.stock < newQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} items available in stock`
                });
            }

            await existingItem.update({ quantity: newQuantity });
        } else {
            await CartItem.create({
                cartId: cart.id,
                productId,
                quantity,
                priceAtTime: product.price,
                discountAtTime: product.discountPercentage
            });
        }

        // Get updated cart
        const updatedCartItems = await CartItem.findAll({
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

        const totals = calculateCartTotals(updatedCartItems);

        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            data: { totals }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private/Public (with session)
const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const itemId = req.params.itemId;
        const userId = req.user?.id;
        const sessionId = req.headers['x-session-id'];

        const cartItem = await CartItem.findOne({
            where: { id: itemId },
            include: [
                {
                    model: Cart,
                    as: 'cart',
                    where: userId ? { userId } : { sessionId }
                },
                {
                    model: Product,
                    as: 'product'
                }
            ]
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // Check stock
        if (cartItem.product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${cartItem.product.stock} items available in stock`
            });
        }

        await cartItem.update({ quantity });

        res.status(200).json({
            success: true,
            message: 'Cart item updated successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private/Public (with session)
const removeFromCart = async (req, res, next) => {
    try {
        const itemId = req.params.itemId;
        const userId = req.user?.id;
        const sessionId = req.headers['x-session-id'];

        const cartItem = await CartItem.findOne({
            where: { id: itemId },
            include: [
                {
                    model: Cart,
                    as: 'cart',
                    where: userId ? { userId } : { sessionId }
                }
            ]
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        await cartItem.destroy();

        res.status(200).json({
            success: true,
            message: 'Item removed from cart successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private/Public (with session)
const clearCart = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.headers['x-session-id'];

        const cart = await Cart.findOne({
            where: userId ? { userId, isActive: true } : { sessionId, isActive: true }
        });

        if (cart) {
            await CartItem.destroy({
                where: { cartId: cart.id }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Merge guest cart with user cart (when user logs in)
// @route   POST /api/cart/merge
// @access  Private
const mergeCart = async (req, res, next) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user.id;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        // Get guest cart
        const guestCart = await Cart.findOne({
            where: { sessionId, isActive: true }
        });

        if (!guestCart) {
            return res.status(200).json({
                success: true,
                message: 'No guest cart to merge',
                data: {}
            });
        }

        // Get user cart
        let userCart = await Cart.findOne({
            where: { userId, isActive: true }
        });

        if (!userCart) {
            userCart = await Cart.create({ userId, isActive: true });
        }

        // Get guest cart items
        const guestCartItems = await CartItem.findAll({
            where: { cartId: guestCart.id },
            include: [{ model: Product, as: 'product' }]
        });

        // Merge items
        for (const guestItem of guestCartItems) {
            const existingUserItem = await CartItem.findOne({
                where: {
                    cartId: userCart.id,
                    productId: guestItem.productId
                }
            });

            if (existingUserItem) {
                // Update quantity if item exists
                const newQuantity = existingUserItem.quantity + guestItem.quantity;
                const maxQuantity = Math.min(newQuantity, guestItem.product.stock);
                await existingUserItem.update({ quantity: maxQuantity });
            } else {
                // Create new item
                await CartItem.create({
                    cartId: userCart.id,
                    productId: guestItem.productId,
                    quantity: guestItem.quantity,
                    priceAtTime: guestItem.priceAtTime,
                    discountAtTime: guestItem.discountAtTime
                });
            }
        }

        // Delete guest cart
        await CartItem.destroy({ where: { cartId: guestCart.id } });
        await guestCart.destroy();

        res.status(200).json({
            success: true,
            message: 'Cart merged successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// Routes
router.get('/', optionalAuth, getCart);
router.post('/add', optionalAuth, validate(addToCartSchema), addToCart);
router.put('/items/:itemId', optionalAuth, validate(updateCartSchema), updateCartItem);
router.delete('/items/:itemId', optionalAuth, removeFromCart);
router.delete('/clear', optionalAuth, clearCart);
router.post('/merge', protect, mergeCart);

module.exports = router;