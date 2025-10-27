const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name price images stock discount');

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity, selectedColor, selectedSize } = req.body;

        // Check if product exists and has stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                price: product.discount > 0 
                    ? product.price * (1 - product.discount / 100) 
                    : product.price,
                selectedColor,
                selectedSize
            });
        }

        await cart.save();
        await cart.populate('items.product', 'name price images stock discount');

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Check stock
        const product = await Product.findById(productId);
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.product', 'name price images stock discount');

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate('items.product', 'name price images stock discount');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        cart.appliedCoupon = undefined;
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Apply coupon code
// @route   POST /api/cart/coupon
// @access  Private
exports.applyCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Mock coupon validation (in production, check against Coupon model)
        const mockCoupons = {
            'SAVE10': 10,
            'SAVE20': 20,
            'WELCOME': 15
        };

        const discount = mockCoupons[code.toUpperCase()];

        if (!discount) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        cart.appliedCoupon = { code: code.toUpperCase(), discount };
        await cart.save();
        await cart.populate('items.product', 'name price images stock discount');

        res.status(200).json({
            success: true,
            message: 'Coupon applied successfully',
            data: cart
        });
    } catch (error) {
        next(error);
    }
};
