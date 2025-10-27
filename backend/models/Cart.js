const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1'],
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    selectedColor: String,
    selectedSize: String,
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalItems: {
        type: Number,
        default: 0
    },
    subtotal: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    appliedCoupon: {
        code: String,
        discount: Number
    }
}, {
    timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate tax (8% example)
    this.tax = this.subtotal * 0.08;
    
    // Calculate shipping
    this.shipping = this.subtotal > 50 ? 0 : 5.99;
    
    // Apply coupon discount if exists
    let discount = 0;
    if (this.appliedCoupon && this.appliedCoupon.discount) {
        discount = this.subtotal * (this.appliedCoupon.discount / 100);
    }
    
    this.total = this.subtotal + this.tax + this.shipping - discount;
    next();
});

module.exports = mongoose.model('Cart', cartSchema);
