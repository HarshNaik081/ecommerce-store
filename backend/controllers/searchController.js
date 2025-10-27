const Product = require('../models/Product');

// @desc    Search products
// @route   GET /api/search
// @access  Public
exports.searchProducts = async (req, res, next) => {
    try {
        const { q, category, minPrice, maxPrice, minRating, sort, page = 1, limit = 12 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const query = {
            $text: { $search: q },
            status: 'active'
        };

        // Apply filters
        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (minRating) {
            query['ratings.average'] = { $gte: Number(minRating) };
        }

        // Sort options
        let sortBy = { score: { $meta: 'textScore' } };
        if (sort === 'price-low') sortBy = { price: 1 };
        else if (sort === 'price-high') sortBy = { price: -1 };
        else if (sort === 'rating') sortBy = { 'ratings.average': -1 };
        else if (sort === 'newest') sortBy = { createdAt: -1 };

        // Execute search
        const skip = (page - 1) * limit;
        const products = await Product.find(query)
            .select('name price images ratings discount category stock')
            .populate('category', 'name slug')
            .sort(sortBy)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            query: q,
            count: products.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get search suggestions/autocomplete
// @route   GET /api/search/suggestions
// @access  Public
exports.getSearchSuggestions = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        const suggestions = await Product.find({
            name: { $regex: q, $options: 'i' },
            status: 'active'
        })
            .select('name category')
            .populate('category', 'name')
            .limit(10);

        res.status(200).json({
            success: true,
            data: suggestions.map(p => ({
                id: p._id,
                name: p.name,
                category: p.category?.name
            }))
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get trending searches
// @route   GET /api/search/trending
// @access  Public
exports.getTrendingSearches = async (req, res, next) => {
    try {
        // In a real application, track search queries in database
        // For now, return mock trending searches
        const trendingSearches = [
            'laptop',
            'wireless headphones',
            'gaming mouse',
            'mechanical keyboard',
            'smartphone',
            '4k monitor',
            'webcam',
            'usb-c cable'
        ];

        res.status(200).json({
            success: true,
            data: trendingSearches
        });
    } catch (error) {
        next(error);
    }
};
