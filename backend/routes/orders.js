const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { orderValidation, idValidation, validate } = require('../middleware/validation');
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getMyOrders
} = require('../controllers/orderController');

// Protected routes
router.use(protect);

router.post('/', orderValidation, validate, createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', idValidation, validate, getOrder);
router.put('/:id/cancel', idValidation, validate, cancelOrder);

// Admin routes
router.get('/', authorize('admin'), getOrders);
router.put('/:id/status', authorize('admin'), idValidation, validate, updateOrderStatus);

module.exports = router;
