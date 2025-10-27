const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const { reviewValidation, idValidation, validate } = require('../middleware/validation');
const {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful
} = require('../controllers/reviewController');

// Public routes
router.get('/product/:productId', optionalAuth, getProductReviews);

// Protected routes
router.post('/product/:productId', protect, reviewValidation, validate, createReview);
router.put('/:id', protect, idValidation, validate, updateReview);
router.delete('/:id', protect, idValidation, validate, deleteReview);
router.post('/:id/helpful', protect, idValidation, validate, markHelpful);

module.exports = router;
