const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const { Cart, CartItem } = require('./Cart');
const { Order, OrderItem } = require('./Order');
const { Review, Address } = require('./Others');

// Define associations

// User associations
User.hasMany(Product, {
    foreignKey: 'createdBy',
    as: 'createdProducts'
});

User.hasOne(Cart, {
    foreignKey: 'userId',
    as: 'cart'
});

User.hasMany(Order, {
    foreignKey: 'userId',
    as: 'orders'
});

User.hasMany(Review, {
    foreignKey: 'userId',
    as: 'reviews'
});

User.hasMany(Address, {
    foreignKey: 'userId',
    as: 'addresses'
});

// Category associations
Category.hasMany(Product, {
    foreignKey: 'categoryId',
    as: 'products'
});

// Product associations
Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

Product.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
});

Product.hasMany(CartItem, {
    foreignKey: 'productId',
    as: 'cartItems'
});

Product.hasMany(OrderItem, {
    foreignKey: 'productId',
    as: 'orderItems'
});

Product.hasMany(Review, {
    foreignKey: 'productId',
    as: 'reviews'
});

// Cart associations
Cart.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
    as: 'items'
});

// CartItem associations
CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',
    as: 'cart'
});

CartItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
});

// Order associations
Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'items'
});

// OrderItem associations
OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

OrderItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
});

// Review associations
Review.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Review.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
});

// Address associations
Address.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

module.exports = {
    sequelize,
    User,
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Review,
    Address
};