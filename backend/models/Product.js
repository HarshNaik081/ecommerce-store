const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        min: [0, 'Price cannot be negative'],
        default: 0
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please specify product category']
    },
    subcategory: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    stock: {
        type: Number,
        required: [true, 'Please specify stock quantity'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot be more than 5']
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    specifications: [{
        key: String,
        value: String
    }],
    tags: [String],
    colors: [{
        name: String,
        hexCode: String
    }],
    sizes: [{
        name: String,
        stock: Number
    }],
    weight: Number,
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    shipping: {
        isFree: {
            type: Boolean,
            default: false
        },
        cost: {
            type: Number,
            default: 0
        },
        estimatedDays: {
            min: Number,
            max: Number
        }
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    featured: {
        type: Boolean,
        default: false
    },
    newArrival: {
        type: Boolean,
        default: false
    },
    bestSeller: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'out-of-stock'],
        default: 'active'
    },
    views: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ featured: 1, newArrival: 1, bestSeller: 1 });

// Virtual for discount price
productSchema.virtual('discountedPrice').get(function() {
    if (this.discount > 0) {
        return this.price * (1 - this.discount / 100);
    }
    return this.price;
});

// Update stock status
productSchema.pre('save', function(next) {
    if (this.stock === 0) {
        this.status = 'out-of-stock';
    } else if (this.status === 'out-of-stock' && this.stock > 0) {
        this.status = 'active';
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
