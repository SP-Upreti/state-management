# Admin User Creation Guide

This guide explains how to create admin users for the e-commerce platform. All passwords are automatically encrypted using **bcrypt** with a salt rounds of 12 before being stored in the database.

## 🔐 Password Security

- Passwords are **never** stored in plain text
- Bcrypt hashing is applied automatically via Sequelize model hooks
- Salt rounds: 12 (high security)
- Password encryption happens in `models/User.js` via `beforeCreate` and `beforeUpdate` hooks

## Methods to Create Admin Users

### Method 1: Quick Setup (Recommended for Testing)

Creates an admin user with predefined credentials:

```bash
cd backend
npm run create-admin-quick
```

**Default Credentials:**
- Email: `admin@ecommerce.com`
- Password: `Admin@123456`
- Username: `admin`

### Method 2: Interactive Setup (Recommended for Production)

Creates an admin user with custom credentials via interactive prompts:

```bash
cd backend
npm run create-admin
```

You'll be prompted to enter:
- First Name
- Last Name
- Username
- Email
- Password
- Phone (optional)

### Method 3: Full Database Setup

Sets up the entire database with sample data including an admin user:

```bash
cd backend
npm run setup-db
```

**Admin Credentials (from setup):**
- Email: `admin@example.com`
- Password: `admin123`

**Test User:**
- Email: `john@example.com`
- Password: `password123`

### Method 4: Manual API Call

You can also create an admin user by modifying the registration endpoint temporarily or directly inserting into the database.

#### Using Registration API (Requires Manual Role Update)

1. Register a new user:
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "username": "newadmin",
  "email": "newadmin@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890"
}
```

2. Update the role to admin manually in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'newadmin@example.com';
```

## 🔒 Password Encryption Details

### How It Works

The password encryption is handled automatically by Sequelize hooks in `backend/models/User.js`:

```javascript
hooks: {
    beforeCreate: async (user) => {
        if (user.password) {
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(user.password, salt);
        }
    },
    beforeUpdate: async (user) => {
        if (user.changed('password')) {
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
}
```

### Verification

Passwords are verified using the `comparePassword` instance method:

```javascript
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
```

This is automatically used during login in `backend/routes/auth.js`.

## 📋 Admin User Features

Admin users have access to:
- Admin Dashboard (`/admin`)
- User Management (`/admin/users`)
- Product Management (`/admin/products`)
- Category Management (`/admin/categories`)
- Order Management (`/admin/orders`)
- Analytics & Reports (`/admin/analytics`)

## ⚠️ Security Best Practices

1. **Change default passwords** immediately in production
2. **Use strong passwords** (minimum 8 characters, include numbers, special characters)
3. **Never commit** `.env` file with production credentials
4. **Limit admin accounts** - only create what you need
5. **Regular password rotation** for admin accounts
6. **Monitor admin activity** through logs

## 🔍 Verify Admin User

To verify an admin user was created successfully:

```sql
SELECT id, firstName, lastName, username, email, role, isActive, createdAt 
FROM users 
WHERE role = 'admin';
```

Note: The `password` field will show the bcrypt hash (starts with `$2a$` or `$2b$`), not the plain text password.

## 📝 Example Bcrypt Hash

When you set password as `Admin@123456`, it gets stored as something like:

```
$2b$12$K1.zzLf7XKHBz7KGVNQZnO8qjf5hC6i3Kt0t5EQRQWxB3rP4NxZ8K
```

- `$2b$` - bcrypt algorithm identifier
- `12` - cost factor (salt rounds)
- Next 22 chars - salt
- Remaining - hashed password

## 🚀 Quick Start

For development:

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file with database credentials
cp .env.example .env

# 4. Setup database (creates tables + sample data + admin user)
npm run setup-db

# 5. Start server
npm run dev

# 6. Login with admin credentials
# Email: admin@example.com
# Password: admin123
```

## 📞 Support

If you encounter any issues creating admin users, check:
1. Database connection is working
2. `.env` file has correct database credentials
3. MySQL server is running
4. Email/username is unique (not already in use)
