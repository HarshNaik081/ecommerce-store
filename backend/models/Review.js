const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    title: {
        type: String,
        required: [true, 'Please provide a review title'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Please provide a review comment'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    images: [{
        url: String,
        alt: String
    }],
    verified: {
        type: Boolean,
        default: false
    },
    helpful: {
        type: Number,
        default: 0
    },
    helpfulBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    }
}, {
    timestamps: true
});

// Ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product ratings after review is saved
reviewSchema.post('save', async function() {
    const Product = mongoose.model('Product');
    const Review = mongoose.model('Review');
    
    const stats = await Review.aggregate([
        { $match: { product: this.product, status: 'approved' } },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                numRatings: { $sum: 1 }
            }
        }
    ]);
    
    if (stats.length > 0) {
        await Product.findByIdAndUpdate(this.product, {
            'ratings.average': Math.round(stats[0].avgRating * 10) / 10,
            'ratings.count': stats[0].numRatings
        });
    }
});

module.exports = mongoose.model('Review', reviewSchema);
