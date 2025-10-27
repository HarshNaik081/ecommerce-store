const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const {
    searchProducts,
    getSearchSuggestions,
    getTrendingSearches
} = require('../controllers/searchController');

router.get('/', optionalAuth, searchProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/trending', getTrendingSearches);

module.exports = router;
