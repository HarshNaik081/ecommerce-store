const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items'
            });
        }

        // Calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (let item of items) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            const price = product.discount > 0 
                ? product.price * (1 - product.discount / 100) 
                : product.price;

            subtotal += price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0]?.url,
                quantity: item.quantity,
                price,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize
            });

            // Update product stock and sales
            product.stock -= item.quantity;
            product.sales += item.quantity;
            await product.save();
        }

        const tax = subtotal * 0.08;
        const shippingCost = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + tax + shippingCost;

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            subtotal,
            tax,
            shippingCost,
            total
        });

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { items: [], appliedCoupon: undefined }
        );

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const query = {};

        if (req.query.status) {
            query.orderStatus = req.query.status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user is order owner or admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.user.id })
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status, trackingNumber, carrier, note } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.orderStatus = status;
        
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (carrier) order.carrier = carrier;

        // Add to status history
        order.statusHistory.push({
            status,
            note,
            updatedBy: req.user.id
        });

        // Update delivery status
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user is order owner
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Can only cancel if pending or processing
        if (!['pending', 'processing'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
        }

        order.orderStatus = 'cancelled';
        order.statusHistory.push({
            status: 'cancelled',
            note: req.body.reason || 'Cancelled by customer',
            updatedBy: req.user.id
        });

        // Restore product stock
        for (let item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity, sales: -item.quantity }
            });
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};
