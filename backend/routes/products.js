const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { productValidation, idValidation, validate } = require('../middleware/validation');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getNewArrivals,
    getBestSellers,
    getRelatedProducts
} = require('../controllers/productController');

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/:id', idValidation, validate, getProduct);
router.get('/:id/related', idValidation, validate, getRelatedProducts);

// Admin/Seller routes
router.post('/', protect, authorize('admin', 'seller'), productValidation, validate, createProduct);
router.put('/:id', protect, authorize('admin', 'seller'), idValidation, validate, updateProduct);
router.delete('/:id', protect, authorize('admin', 'seller'), idValidation, validate, deleteProduct);

module.exports = router;
