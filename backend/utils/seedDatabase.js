const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere');
        console.log('📦 Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Review.deleteMany({});
        console.log('🧹 Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@shopsphere.com',
            password: 'admin123',
            role: 'admin',
            emailVerified: true
        });

        // Create demo users
        const users = await User.create([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '5551234567'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                phone: '5559876543'
            }
        ]);

        console.log('👥 Created users');

        // Create categories
        const categories = await Category.create([
            { name: 'Electronics', description: 'Electronic devices and accessories', order: 1 },
            { name: 'Clothing', description: 'Fashion and apparel', order: 2 },
            { name: 'Books', description: 'Books and literature', order: 3 },
            { name: 'Home & Garden', description: 'Home improvement and garden supplies', order: 4 },
            { name: 'Sports', description: 'Sports and outdoor equipment', order: 5 },
            { name: 'Toys', description: 'Toys and games', order: 6 }
        ]);

        console.log('📂 Created categories');

        // Create products
        const products = [];

        // Electronics
        products.push({
            name: 'Wireless Noise Cancelling Headphones',
            description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
            price: 299.99,
            originalPrice: 399.99,
            discount: 25,
            category: categories[0]._id,
            brand: 'AudioTech',
            images: [
                { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', isPrimary: true }
            ],
            stock: 50,
            sku: 'ELEC-HEAD-001',
            tags: ['wireless', 'bluetooth', 'noise-cancelling'],
            featured: true,
            newArrival: true,
            seller: adminUser._id
        });

        products.push({
            name: 'Smart Watch Pro',
            description: 'Advanced smartwatch with fitness tracking, heart rate monitor, GPS, and 7-day battery life.',
            price: 349.99,
            category: categories[0]._id,
            brand: 'TechFit',
            images: [
                { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', isPrimary: true }
            ],
            stock: 75,
            sku: 'ELEC-WATCH-001',
            tags: ['smartwatch', 'fitness', 'gps'],
            bestSeller: true,
            seller: adminUser._id
        });

        products.push({
            name: '4K Ultra HD Webcam',
            description: 'Professional webcam with 4K resolution, autofocus, and built-in stereo microphones.',
            price: 129.99,
            category: categories[0]._id,
            brand: 'CamPro',
            images: [
                { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', isPrimary: true }
            ],
            stock: 30,
            sku: 'ELEC-CAM-001',
            tags: ['webcam', '4k', 'streaming'],
            seller: adminUser._id
        });

        // Clothing
        products.push({
            name: 'Classic Cotton T-Shirt',
            description: 'Comfortable 100% cotton t-shirt, perfect for everyday wear.',
            price: 24.99,
            category: categories[1]._id,
            brand: 'CasualWear',
            images: [
                { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', isPrimary: true }
            ],
            stock: 200,
            sku: 'CLO-TSHIRT-001',
            tags: ['cotton', 'casual', 'comfortable'],
            sizes: [
                { name: 'S', stock: 50 },
                { name: 'M', stock: 75 },
                { name: 'L', stock: 50 },
                { name: 'XL', stock: 25 }
            ],
            colors: [
                { name: 'White', hexCode: '#FFFFFF' },
                { name: 'Black', hexCode: '#000000' },
                { name: 'Navy', hexCode: '#000080' }
            ],
            bestSeller: true,
            seller: adminUser._id
        });

        products.push({
            name: 'Denim Jacket',
            description: 'Classic denim jacket with a modern fit.',
            price: 79.99,
            category: categories[1]._id,
            brand: 'DenimCo',
            images: [
                { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', isPrimary: true }
            ],
            stock: 40,
            sku: 'CLO-JACKET-001',
            tags: ['denim', 'jacket', 'casual'],
            seller: adminUser._id
        });

        // Books
        products.push({
            name: 'The Art of Programming',
            description: 'Comprehensive guide to modern programming techniques and best practices.',
            price: 49.99,
            category: categories[2]._id,
            brand: 'TechBooks',
            images: [
                { url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', isPrimary: true }
            ],
            stock: 100,
            sku: 'BOOK-PROG-001',
            tags: ['programming', 'education', 'technology'],
            seller: adminUser._id
        });

        // Home & Garden
        products.push({
            name: 'Modern Table Lamp',
            description: 'Stylish LED table lamp with adjustable brightness and color temperature.',
            price: 59.99,
            category: categories[3]._id,
            brand: 'LightHome',
            images: [
                { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', isPrimary: true }
            ],
            stock: 60,
            sku: 'HOME-LAMP-001',
            tags: ['lighting', 'led', 'modern'],
            featured: true,
            seller: adminUser._id
        });

        products.push({
            name: 'Indoor Plant Set',
            description: 'Collection of 3 easy-care indoor plants perfect for beginners.',
            price: 39.99,
            category: categories[3]._id,
            brand: 'GreenLife',
            images: [
                { url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', isPrimary: true }
            ],
            stock: 25,
            sku: 'HOME-PLANT-001',
            tags: ['plants', 'indoor', 'decor'],
            newArrival: true,
            seller: adminUser._id
        });

        // Sports
        products.push({
            name: 'Yoga Mat Premium',
            description: 'Extra thick yoga mat with excellent grip and cushioning.',
            price: 34.99,
            category: categories[4]._id,
            brand: 'FitGear',
            images: [
                { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', isPrimary: true }
            ],
            stock: 80,
            sku: 'SPORT-YOGA-001',
            tags: ['yoga', 'fitness', 'exercise'],
            seller: adminUser._id
        });

        products.push({
            name: 'Resistance Bands Set',
            description: 'Set of 5 resistance bands for strength training and rehabilitation.',
            price: 29.99,
            category: categories[4]._id,
            brand: 'FitGear',
            images: [
                { url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500', isPrimary: true }
            ],
            stock: 120,
            sku: 'SPORT-BAND-001',
            tags: ['resistance', 'fitness', 'training'],
            bestSeller: true,
            seller: adminUser._id
        });

        const createdProducts = await Product.create(products);
        console.log('📦 Created products');

        // Update category product counts
        for (let category of categories) {
            const count = createdProducts.filter(p => p.category.toString() === category._id.toString()).length;
            category.productCount = count;
            await category.save();
        }

        // Create reviews
        const reviews = [];
        for (let i = 0; i < 5; i++) {
            reviews.push({
                product: createdProducts[i]._id,
                user: users[i % 2]._id,
                rating: 4 + Math.random(),
                title: 'Great product!',
                comment: 'I really enjoyed using this product. Highly recommended!',
                verified: true,
                status: 'approved'
            });
        }

        await Review.create(reviews);
        console.log('⭐ Created reviews');

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📝 Login credentials:');
        console.log('   Admin: admin@shopsphere.com / admin123');
        console.log('   User:  john@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
