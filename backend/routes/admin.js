const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getDashboardStats,
    getAllUsers,
    updateUser,
    deleteUser,
    getAllProducts,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/adminController');

// All admin routes require admin authorization
router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Products management
router.get('/products', getAllProducts);

// Orders management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
