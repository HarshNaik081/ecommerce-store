# ShopSphere E-commerce Platform

A full-stack e-commerce platform built with Node.js, Express, MongoDB, and vanilla JavaScript.

![ShopSphere](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Features

### Backend
- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** & Authorization
- **Role-based Access Control** (User, Admin, Seller)
- **Product Management** with categories, reviews, ratings
- **Shopping Cart** with real-time updates
- **Order Management** with status tracking
- **Wishlist** functionality
- **Advanced Search** with filters and sorting
- **Image Upload** support
- **Input Validation** with express-validator
- **Error Handling** middleware
- **Security** with Helmet and CORS

### Frontend
- **Modern UI/UX** with responsive design
- **Dark/Light Theme** toggle
- **Real-time Cart** updates
- **Product Filtering** & Search
- **User Authentication** flow
- **Profile Management**
- **Order Tracking**
- **Review System**
- **Wishlist Management**

## 📁 Project Structure

```
shopsphere-ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── productController.js  # Product management
│   │   ├── cartController.js     # Shopping cart
│   │   ├── orderController.js    # Order processing
│   │   ├── reviewController.js   # Product reviews
│   │   ├── wishlistController.js # Wishlist
│   │   ├── categoryController.js # Categories
│   │   ├── searchController.js   # Search functionality
│   │   └── adminController.js    # Admin dashboard
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── errorHandler.js       # Error handling
│   │   └── validation.js         # Input validation
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   ├── Category.js           # Category schema
│   │   ├── Cart.js               # Cart schema
│   │   ├── Order.js              # Order schema
│   │   └── Review.js             # Review schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── products.js           # Product routes
│   │   ├── cart.js               # Cart routes
│   │   ├── orders.js             # Order routes
│   │   ├── reviews.js            # Review routes
│   │   ├── wishlist.js           # Wishlist routes
│   │   ├── categories.js         # Category routes
│   │   ├── search.js             # Search routes
│   │   └── admin.js              # Admin routes
│   ├── utils/
│   │   └── seedDatabase.js       # Database seeding
│   ├── .env.example              # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Main server file
├── frontend/
│   ├── assets/
│   │   └── images/
│   ├── css/
│   │   └── style.css             # Styles
│   ├── js/
│   │   ├── app.js                # Main application logic
│   │   ├── components.js         # UI components
│   │   └── utils.js              # Utility functions
│   └── index.html                # Main HTML file
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v18 or higher
- MongoDB v6 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   ```env
   MONGODB_URI=mongodb://localhost:27017/shopsphere
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   ```

4. **Seed the database (optional):**
   ```bash
   npm run seed
   ```
   This creates demo products, categories, and users.

5. **Start the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Open frontend directory:**
   ```bash
   cd frontend
   ```

2. **Serve with a local server:**
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Or using Node.js http-server
   npx http-server -p 3000
   
   # Or using VS Code Live Server extension
   ```

3. **Access the application:**
   Open browser and go to `http://localhost:3000`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/update-password` - Update password
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:token` - Reset password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin/Seller)
- `PUT /api/products/:id` - Update product (Admin/Seller)
- `DELETE /api/products/:id` - Delete product (Admin/Seller)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/best-sellers` - Get best sellers

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update cart item
- `DELETE /api/cart/items/:productId` - Remove from cart
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/coupon` - Apply coupon

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews/product/:productId` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist
- `DELETE /api/wishlist` - Clear wishlist

### Search
- `GET /api/search?q=query` - Search products
- `GET /api/search/suggestions?q=query` - Get search suggestions
- `GET /api/search/trending` - Get trending searches

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/tree` - Get category tree
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Admin
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/products` - Get all products
- `GET /api/admin/orders` - Get all orders

## 👤 Default Accounts (After Seeding)

**Admin Account:**
- Email: `admin@shopsphere.com`
- Password: `admin123`

**User Account:**
- Email: `john@example.com`
- Password: `password123`

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP headers security with Helmet
- CORS configuration
- Input validation and sanitization
- SQL injection protection (MongoDB)
- XSS protection
- Rate limiting (recommended for production)

## 📊 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Security:** Helmet, CORS, bcryptjs

### Frontend
- **HTML5**
- **CSS3** (with CSS Variables for theming)
- **Vanilla JavaScript**
- **Responsive Design**

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, Render)

1. Set environment variables in your hosting platform
2. Connect your MongoDB (MongoDB Atlas recommended)
3. Deploy using Git or container

### Frontend Deployment (Netlify, Vercel, GitHub Pages)

1. Build your frontend assets
2. Configure API endpoint in production
3. Deploy static files

## 📝 Development Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Social authentication (Google, Facebook)
- [ ] Product image upload to cloud storage
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Multi-vendor support
- [ ] Real-time chat support
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**ShopSphere Team**

## 🙏 Acknowledgments

- MongoDB for the database
- Express.js community
- All open-source contributors

---

**Happy Shopping! 🛍️**
