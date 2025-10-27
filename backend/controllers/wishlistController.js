const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'wishlist',
                populate: { path: 'category', select: 'name slug' }
            });

        res.status(200).json({
            success: true,
            count: user.wishlist.length,
            data: user.wishlist
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const user = await User.findById(req.user.id);

        // Check if already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }

        user.wishlist.push(productId);
        await user.save();

        await user.populate({
            path: 'wishlist',
            populate: { path: 'category', select: 'name slug' }
        });

        res.status(200).json({
            success: true,
            message: 'Product added to wishlist',
            data: user.wishlist
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user.id);

        user.wishlist = user.wishlist.filter(
            id => id.toString() !== productId
        );

        await user.save();

        await user.populate({
            path: 'wishlist',
            populate: { path: 'category', select: 'name slug' }
        });

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
            data: user.wishlist
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        user.wishlist = [];
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Wishlist cleared',
            data: []
        });
    } catch (error) {
        next(error);
    }
};
