const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            const message = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                success: false,
                message: message
            });
        }

        next();
    };
};

// User validation schemas
const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
    birthDate: Joi.date().optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateUserSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().optional(),
    birthDate: Joi.date().optional(),
    bloodGroup: Joi.string().optional(),
    height: Joi.number().optional(),
    weight: Joi.number().optional(),
    eyeColor: Joi.string().optional(),
    hairColor: Joi.string().optional(),
    hairType: Joi.string().optional()
});

// Product validation schemas
const productSchema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().required(),
    price: Joi.number().min(0.01).required(),
    discountPercentage: Joi.number().min(0).max(100).optional(),
    stock: Joi.number().min(0).required(),
    brand: Joi.string().max(100).optional(),
    sku: Joi.string().max(50).optional(),
    categoryId: Joi.number().required(),
    weight: Joi.number().optional(),
    dimensions: Joi.object().optional(),
    warrantyInformation: Joi.string().optional(),
    shippingInformation: Joi.string().optional(),
    returnPolicy: Joi.string().optional(),
    minimumOrderQuantity: Joi.number().min(1).optional(),
    tags: Joi.array().items(Joi.string()).optional()
});

// Category validation schemas
const categorySchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).required(),
    description: Joi.string().optional(),
    sortOrder: Joi.number().optional()
});

// Cart validation schemas
const addToCartSchema = Joi.object({
    productId: Joi.number().required(),
    quantity: Joi.number().min(1).required()
});

const updateCartSchema = Joi.object({
    quantity: Joi.number().min(1).required()
});

// Order validation schemas
const orderSchema = Joi.object({
    shippingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required(),
        phone: Joi.string().optional()
    }).required(),
    billingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required()
    }).optional(),
    paymentMethod: Joi.string().valid('card', 'paypal', 'cash_on_delivery').required(),
    paymentId: Joi.string().optional()
});

// Address validation schemas
const addressSchema = Joi.object({
    type: Joi.string().valid('shipping', 'billing').required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    company: Joi.string().optional(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().optional(),
    isDefault: Joi.boolean().optional()
});

// Review validation schemas
const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().optional()
});

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    updateUserSchema,
    productSchema,
    categorySchema,
    addToCartSchema,
    updateCartSchema,
    orderSchema,
    addressSchema,
    reviewSchema
};