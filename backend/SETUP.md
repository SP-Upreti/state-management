# Quick Start Guide

## Prerequisites
1. **XAMPP installed and running** with MySQL service started
2. **Node.js** installed (version 14 or higher)

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Setup
1. Open XAMPP Control Panel
2. Start **MySQL** service
3. Open phpMyAdmin (http://localhost/phpmyadmin)
4. Create a new database named `ecommerce_db`

### 3. Environment Configuration
The `.env` file is already configured for XAMPP default settings:
- Database: `ecommerce_db`
- Username: `root`
- Password: (empty)
- Host: `localhost`
- Port: `3306`

### 4. Initialize Database with Sample Data
```bash
npm run setup-db
```

This will create all tables and insert sample data including:
- 24 product categories
- Sample products
- Admin and test user accounts
- Sample addresses and reviews

### 5. Start the Server
```bash
npm run dev
```

Server will start on: http://localhost:5000

### 6. Test the API
You can test the API using:
- **Postman** or **Insomnia**
- **Browser** for GET requests: http://localhost:5000/api/health
- **VS Code REST Client** extension

## Default Accounts

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

### Test User Account
- Email: `john@example.com`
- Password: `password123`
- Role: `user`

## API Base URL
```
http://localhost:5000/api
```

## Key Endpoints to Test

### Authentication
```bash
# Register new user
POST /api/auth/register
{
  "firstName": "Test",
  "lastName": "User",
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Products
```bash
# Get all products
GET /api/products

# Get products with search
GET /api/products?search=mascara

# Get products by category
GET /api/products?category=1

# Get single product
GET /api/products/1
```

### Cart (requires authentication or session-id header)
```bash
# Add to cart
POST /api/cart/add
Headers: Authorization: Bearer <token>
{
  "productId": 1,
  "quantity": 2
}

# Get cart
GET /api/cart
Headers: Authorization: Bearer <token>
```

### Orders (requires authentication)
```bash
# Create order
POST /api/orders
Headers: Authorization: Bearer <token>
{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  },
  "paymentMethod": "card"
}
```

## Frontend Integration

To connect your React frontend:

1. Update your API calls to use `http://localhost:5000/api`
2. Store JWT token in localStorage or context
3. Include token in Authorization header for protected routes
4. Handle session ID for guest cart functionality

Example API service:
```javascript
const API_BASE = 'http://localhost:5000/api';

export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
  
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  }
};

export const productAPI = {
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/products?${queryString}`);
    return response.json();
  }
};
```

## Troubleshooting

### Database Connection Issues
- Ensure XAMPP MySQL is running
- Check database name exists in phpMyAdmin
- Verify .env configuration matches your setup

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000
```

### Permission Issues
```bash
# On Windows, run as administrator
# On Mac/Linux, use sudo if needed
```

## Next Steps

1. Test all API endpoints
2. Integrate with your React frontend
3. Customize products and categories as needed
4. Add your own branding and styling
5. Deploy to production when ready

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify XAMPP MySQL is running
3. Ensure all dependencies are installed
4. Check the .env file configuration