const { body, param, query, validationResult } = require('express-validator');

// Validation middleware to check results
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

// Registration validation
exports.registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Login validation
exports.loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Product validation
exports.productValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ max: 200 }).withMessage('Product name cannot exceed 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Product description is required'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category ID'),
    body('stock')
        .notEmpty().withMessage('Stock is required')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

// Review validation
exports.reviewValidation = [
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title')
        .trim()
        .notEmpty().withMessage('Review title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('comment')
        .trim()
        .notEmpty().withMessage('Review comment is required')
        .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
];

// Order validation
exports.orderValidation = [
    body('items')
        .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress')
        .notEmpty().withMessage('Shipping address is required'),
    body('paymentMethod')
        .notEmpty().withMessage('Payment method is required')
        .isIn(['credit-card', 'debit-card', 'paypal', 'cod']).withMessage('Invalid payment method')
];

// ID parameter validation
exports.idValidation = [
    param('id')
        .isMongoId().withMessage('Invalid ID format')
];
