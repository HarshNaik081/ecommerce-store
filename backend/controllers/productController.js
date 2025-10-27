const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        // Build query
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);
        
        let query = Product.find(JSON.parse(queryStr)).populate('category', 'name slug');

        // Search
        if (req.query.search) {
            query = query.find({ $text: { $search: req.query.search } });
        }

        // Filter by category
        if (req.query.category) {
            query = query.find({ category: req.query.category });
        }

        // Filter by price range
        if (req.query.minPrice || req.query.maxPrice) {
            const priceFilter = {};
            if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
            query = query.find({ price: priceFilter });
        }

        // Filter by rating
        if (req.query.minRating) {
            query = query.find({ 'ratings.average': { $gte: Number(req.query.minRating) } });
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 12;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // Execute query
        const products = await query;
        const total = await Product.countDocuments(JSON.parse(queryStr));

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug')
            .populate({
                path: 'reviews',
                populate: { path: 'user', select: 'name avatar' },
                options: { sort: '-createdAt', limit: 10 }
            });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Increment views
        product.views += 1;
        await product.save();

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin/Seller
exports.createProduct = async (req, res, next) => {
    try {
        // Add seller to req.body
        req.body.seller = req.user.id;

        const product = await Product.create(req.body);

        // Update category product count
        await Category.findByIdAndUpdate(product.category, {
            $inc: { productCount: 1 }
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin/Seller
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Make sure user is product owner or admin
        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin/Seller
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Make sure user is product owner or admin
        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
        }

        // Update category product count
        await Category.findByIdAndUpdate(product.category, {
            $inc: { productCount: -1 }
        });

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 8;

        const products = await Product.find({ featured: true, status: 'active' })
            .populate('category', 'name slug')
            .limit(limit)
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 8;

        const products = await Product.find({ newArrival: true, status: 'active' })
            .populate('category', 'name slug')
            .limit(limit)
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
exports.getBestSellers = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 8;

        const products = await Product.find({ bestSeller: true, status: 'active' })
            .populate('category', 'name slug')
            .limit(limit)
            .sort('-sales');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const limit = parseInt(req.query.limit, 10) || 4;

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            status: 'active'
        })
            .populate('category', 'name slug')
            .limit(limit)
            .sort('-ratings.average');

        res.status(200).json({
            success: true,
            count: relatedProducts.length,
            data: relatedProducts
        });
    } catch (error) {
        next(error);
    }
};
