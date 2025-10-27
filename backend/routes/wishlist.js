const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} = require('../controllers/wishlistController');

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.delete('/', clearWishlist);

module.exports = router;
