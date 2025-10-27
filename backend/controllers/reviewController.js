const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const query = { 
            product: req.params.productId,
            status: 'approved'
        };

        // Filter by rating
        if (req.query.rating) {
            query.rating = parseInt(req.query.rating);
        }

        // Sort options
        let sortBy = '-createdAt';
        if (req.query.sort === 'helpful') {
            sortBy = '-helpful';
        } else if (req.query.sort === 'rating-high') {
            sortBy = '-rating';
        } else if (req.query.sort === 'rating-low') {
            sortBy = 'rating';
        }

        const reviews = await Review.find(query)
            .populate('user', 'name avatar')
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments(query);

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product review
// @route   POST /api/reviews/product/:productId
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
        const { rating, title, comment, images } = req.body;
        const productId = req.params.productId;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            product: productId,
            user: req.user.id
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Create review
        const review = await Review.create({
            product: productId,
            user: req.user.id,
            rating,
            title,
            comment,
            images
        });

        // Add review to product
        await Product.findByIdAndUpdate(productId, {
            $push: { reviews: review._id }
        });

        await review.populate('user', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Make sure user is review owner
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'name avatar');

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Make sure user is review owner or admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        // Remove review from product
        await Product.findByIdAndUpdate(review.product, {
            $pull: { reviews: review._id }
        });

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user already marked as helpful
        const alreadyMarked = review.helpfulBy.includes(req.user.id);

        if (alreadyMarked) {
            // Remove from helpful
            review.helpfulBy = review.helpfulBy.filter(
                id => id.toString() !== req.user.id
            );
            review.helpful -= 1;
        } else {
            // Add to helpful
            review.helpfulBy.push(req.user.id);
            review.helpful += 1;
        }

        await review.save();

        res.status(200).json({
            success: true,
            message: alreadyMarked ? 'Removed from helpful' : 'Marked as helpful',
            data: { helpful: review.helpful }
        });
    } catch (error) {
        next(error);
    }
};
