# E-commerce Backend API

A comprehensive backend API for an e-commerce application built with Express.js, MySQL, and Sequelize.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - User registration and login
  - Password hashing with bcrypt

- **Product Management**
  - CRUD operations for products
  - Category management
  - Product search and filtering
  - Image upload support
  - Product reviews and ratings

- **Shopping Cart**
  - Add/remove items from cart
  - Update quantities
  - Session-based cart for guests
  - Cart persistence for logged-in users

- **Order Management**
  - Place orders with multiple items
  - Order history for users
  - Order status tracking
  - Order cancellation

- **Admin Dashboard**
  - User management
  - Product analytics
  - Order statistics
  - Sales reporting

- **Additional Features**
  - Address management
  - Review system
  - Input validation
  - Error handling
  - Rate limiting
  - CORS support

## Prerequisites

- Node.js (v14 or higher)
- MySQL (XAMPP recommended)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   Create a `.env` file in the root directory with the following:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # Database Configuration (XAMPP MySQL)
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=ecommerce_db
   DB_USER=root
   DB_PASSWORD=
   
   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random
   JWT_EXPIRE=7d
   
   # CORS
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Setup MySQL Database:**
   - Start XAMPP and ensure MySQL is running
   - Create a database named `ecommerce_db` (or use the name you specified in .env)

5. **Initialize Database:**
   ```bash
   npm run setup-db
   ```

6. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /updatedetails` - Update user details
- `PUT /updatepassword` - Update password
- `POST /logout` - Logout user

### Product Routes (`/api/products`)
- `GET /` - Get all products (with search, filter, pagination)
- `GET /:id` - Get single product
- `GET /featured` - Get featured products
- `GET /category/:categorySlug` - Get products by category
- `POST /` - Create product (Admin only)
- `PUT /:id` - Update product (Admin only)
- `DELETE /:id` - Delete product (Admin only)
- `POST /:id/reviews` - Add product review

### Category Routes (`/api/categories`)
- `GET /` - Get all categories
- `GET /:id` - Get single category
- `GET /slug/:slug` - Get category by slug
- `POST /` - Create category (Admin only)
- `PUT /:id` - Update category (Admin only)
- `DELETE /:id` - Delete category (Admin only)

### Cart Routes (`/api/cart`)
- `GET /` - Get user cart
- `POST /add` - Add item to cart
- `PUT /items/:itemId` - Update cart item quantity
- `DELETE /items/:itemId` - Remove item from cart
- `DELETE /clear` - Clear entire cart
- `POST /merge` - Merge guest cart with user cart

### Order Routes (`/api/orders`)
- `GET /` - Get user orders
- `GET /:id` - Get single order
- `POST /` - Create new order
- `PUT /:id/cancel` - Cancel order
- `GET /admin/all` - Get all orders (Admin only)
- `PUT /:id/status` - Update order status (Admin only)
- `GET /admin/stats` - Get order statistics (Admin only)

### User Routes (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /addresses` - Get user addresses
- `POST /addresses` - Add new address
- `PUT /addresses/:id` - Update address
- `DELETE /addresses/:id` - Delete address
- `PUT /addresses/:id/default` - Set default address
- `GET /orders` - Get user order history
- `GET /reviews` - Get user reviews
- `GET /stats` - Get user statistics

### Admin Routes (`/api/admin`)
- `GET /stats` - Get dashboard statistics
- `GET /users` - Get all users
- `PUT /users/:id/role` - Update user role
- `PUT /users/:id/status` - Toggle user status
- `DELETE /users/:id` - Delete user
- `GET /products/analytics` - Get product analytics

## Database Schema

The database includes the following main tables:
- `users` - User accounts and profiles
- `categories` - Product categories
- `products` - Product information
- `carts` - Shopping carts
- `cart_items` - Items in shopping carts
- `orders` - Order information
- `order_items` - Items in orders
- `addresses` - User addresses
- `reviews` - Product reviews

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Default Admin Account

After running the database setup, you can use these credentials:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Test User Account:**
- Email: `john@example.com`
- Password: `password123`

## Error Handling

The API returns consistent error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "Error stack (development only)"
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation with Joi
- CORS protection
- Helmet for security headers
- SQL injection prevention with Sequelize

## Development

For development, the API includes:
- Hot reloading with nodemon
- Detailed logging with Morgan
- Environment-based configuration
- Database synchronization
- Validation middleware

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup-db` - Initialize database with sample data

## Frontend Integration

To connect this backend with your React frontend:

1. Update your frontend API calls to point to `http://localhost:5000/api`
2. Include authentication tokens in your requests
3. Handle session management for guest cart functionality
4. Update your Redux store to use the backend API endpoints

Example API call from frontend:
```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});

// Authenticated request
const response = await fetch('http://localhost:5000/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.