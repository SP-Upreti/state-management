# 🚀 Getting Started - Complete Setup Guide

Welcome! This guide will walk you through setting up and running this E-commerce application step by step. Don't worry if you're a beginner - we'll explain everything in detail!

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Install Required Software](#step-1-install-required-software)
3. [Step 2: Setup XAMPP and Database](#step-2-setup-xampp-and-database)
4. [Step 3: Setup Backend](#step-3-setup-backend)
5. [Step 4: Setup Frontend](#step-4-setup-frontend)
6. [Step 5: Running the Application](#step-5-running-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Default Login Credentials](#default-login-credentials)

---

## Prerequisites

Before we start, you'll need to have the following installed on your computer:

- **XAMPP** (for MySQL database)
- **Node.js** (version 14 or higher)
- **pnpm** (package manager - we'll show you how to install it)
- A code editor like **VS Code** (optional but recommended)

---

## Step 1: Install Required Software

### 1.1 Install XAMPP

**What is XAMPP?** XAMPP is a free software that provides a MySQL database server which our application needs to store data.

1. Download XAMPP from: https://www.apachefriends.org/download.html
2. Choose the version for your operating system (Windows/Mac/Linux)
3. Run the installer
4. During installation, make sure **MySQL** is selected
5. Complete the installation with default settings

### 1.2 Install Node.js

**What is Node.js?** Node.js allows us to run JavaScript code on our computer (outside of a web browser).

1. Download Node.js from: https://nodejs.org/
2. Choose the **LTS (Long Term Support)** version
3. Run the installer and follow the setup wizard
4. Use default settings and complete the installation

### 1.3 Verify Installation

Open your terminal (Command Prompt, PowerShell, or Git Bash) and type:

```bash
node --version
```

You should see something like `v18.x.x` or `v20.x.x`

```bash
npm --version
```

You should see something like `9.x.x` or `10.x.x`

### 1.4 Install pnpm

**What is pnpm?** It's a fast and efficient package manager (like npm, but better!).

```bash
npm install -g pnpm
```

Verify installation:

```bash
pnpm --version
```

---

## Step 2: Setup XAMPP and Database

### 2.1 Start XAMPP

1. Open **XAMPP Control Panel**
   - On Windows: Search for "XAMPP Control Panel" in Start Menu
   - On Mac: Open from Applications folder

2. Click the **Start** button next to **MySQL**
   - The MySQL status should turn green
   - You might see a popup asking for permission - click "Allow"

![XAMPP Control Panel](https://via.placeholder.com/600x200/4CAF50/ffffff?text=MySQL+should+show+green+status)

### 2.2 Create the Database

**Method 1: Using phpMyAdmin (Recommended for Beginners)**

1. In XAMPP Control Panel, click **Admin** button next to MySQL
   - This will open phpMyAdmin in your browser
   - Or manually go to: http://localhost/phpmyadmin

2. Click on **"New"** in the left sidebar

3. Create a new database:
   - Database name: `ecommerce_db`
   - Collation: `utf8mb4_general_ci` (select from dropdown)
   - Click **"Create"** button

✅ You should see `ecommerce_db` appear in the left sidebar!

**Method 2: Using SQL (Alternative)**

1. In phpMyAdmin, click on the **SQL** tab at the top
2. Copy and paste this command:
   ```sql
   CREATE DATABASE IF NOT EXISTS ecommerce_db;
   ```
3. Click **"Go"** button

---

## Step 3: Setup Backend

The backend is the server that handles all the data, user authentication, and business logic.

### 3.1 Navigate to Backend Folder

Open your terminal and navigate to the backend folder:

```bash
cd c:\Users\testi\Desktop\project\state-management\backend
```

💡 **Tip:** You can also right-click the `backend` folder in VS Code and select "Open in Integrated Terminal"

### 3.2 Install Backend Dependencies

This will download all the required packages for the backend to work:

```bash
pnpm install
```

⏱️ This may take 1-3 minutes. You'll see a progress bar.

When it's done, you should see:
```
✓ Dependencies installed successfully
```

### 3.3 Setup Database Tables and Sample Data

This command will create all the necessary tables and add sample products:

```bash
pnpm run setup-db
```

You should see output like:
```
✓ Database connection established
✓ Tables created successfully
✓ Sample data inserted
✓ Admin user created
✓ Test user created
```

### 3.4 Start the Backend Server

```bash
pnpm run dev
```

✅ **Success!** You should see:
```
Server running on port 5000
Database connected successfully
```

🎉 Your backend is now running! Keep this terminal window open.

---

## Step 4: Setup Frontend

The frontend is the user interface that people see and interact with in their web browser.

### 4.1 Open a New Terminal

**Important:** Don't close the backend terminal! Open a NEW terminal window.

- In VS Code: Click `Terminal` → `New Terminal`
- Or open a new Command Prompt/PowerShell window

### 4.2 Navigate to Frontend Folder

```bash
cd c:\Users\testi\Desktop\project\state-management
```

💡 **Note:** This is the root folder of the project (not the backend folder)

### 4.3 Install Frontend Dependencies

```bash
pnpm install
```

⏱️ This may take 2-4 minutes as it downloads React and other frontend libraries.

When complete, you should see:
```
✓ Dependencies installed successfully
```

### 4.4 Start the Frontend Development Server

```bash
pnpm run dev
```

✅ **Success!** You should see:
```
  VITE v6.0.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## Step 5: Running the Application

### 5.1 Access the Application

Open your web browser and go to:

```
http://localhost:5173/
```

🎉 **Congratulations!** You should now see the E-commerce website!

### 5.2 What's Running?

You should now have **3 things running**:

1. ✅ **XAMPP MySQL** - Database (port 3306)
2. ✅ **Backend Server** - API (port 5000) - http://localhost:5000
3. ✅ **Frontend Server** - Website (port 5173) - http://localhost:5173

### 5.3 Test the Application

- Browse products on the homepage
- Click on products to see details
- Try adding products to cart
- Try logging in (see credentials below)

---

## Default Login Credentials

The database comes with pre-configured user accounts for testing:

### 🔐 Admin Account
```
Email: admin@example.com
Password: admin123
```
**Access:** Admin dashboard, manage products, orders, users

### 👤 Regular User Account
```
Email: john@example.com
Password: password123
```
**Access:** Shop, cart, checkout, order history

---

## 🛑 How to Stop the Application

### Stop Frontend
1. Go to the frontend terminal
2. Press `Ctrl + C`
3. Type `Y` and press Enter (if asked)

### Stop Backend
1. Go to the backend terminal
2. Press `Ctrl + C`
3. Type `Y` and press Enter (if asked)

### Stop MySQL
1. Open XAMPP Control Panel
2. Click **Stop** button next to MySQL

---

## 🔄 How to Restart Everything

### Starting from Scratch (Every Time)

1. **Start XAMPP MySQL**
   - Open XAMPP Control Panel
   - Click Start next to MySQL

2. **Start Backend** (in backend folder)
   ```bash
   cd backend
   pnpm run dev
   ```

3. **Start Frontend** (in root folder, new terminal)
   ```bash
   pnpm run dev
   ```

4. **Open Browser**
   ```
   http://localhost:5173
   ```

---

## 🔧 Troubleshooting

### Problem: "Port 5000 is already in use"

**Solution:**
```bash
# Kill the process using port 5000
npx kill-port 5000

# Then restart the backend
pnpm run dev
```

### Problem: "Cannot connect to database"

**Checklist:**
- ✅ Is XAMPP MySQL running? (Check XAMPP Control Panel)
- ✅ Is the database `ecommerce_db` created? (Check phpMyAdmin)
- ✅ Did you run `pnpm run setup-db`?

### Problem: "Module not found" or "Cannot find package"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Problem: Frontend shows blank page or errors

**Checklist:**
- ✅ Is the backend running? (Should see "Server running on port 5000")
- ✅ Check browser console for errors (Press F12)
- ✅ Try clearing browser cache (Ctrl + Shift + Delete)
- ✅ Try restarting the frontend server

### Problem: "pnpm: command not found"

**Solution:**
```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

### Problem: MySQL won't start in XAMPP

**Solution:**
- Check if port 3306 is already in use (maybe MySQL is already installed)
- Try changing MySQL port in XAMPP config
- Restart your computer
- Run XAMPP as Administrator (Windows)

### Problem: "Access Denied" when accessing database

**Solution:**
1. Open phpMyAdmin
2. Click on "User accounts"
3. Edit the `root` user
4. Ensure "Login Information" → "Password" is empty
5. Or update the backend `.env` file with the correct password

---

## 📱 Accessing from Mobile/Other Devices

To access the application from other devices on your network:

1. Find your computer's IP address:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. Start frontend with host flag:
   ```bash
   pnpm run dev -- --host
   ```

3. Access from other devices:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```

---

## 🎯 Quick Reference Commands

### Backend Commands
```bash
cd backend
pnpm install              # Install dependencies
pnpm run dev             # Start development server
pnpm run setup-db        # Setup database
pnpm run create-admin    # Create admin user
```

### Frontend Commands
```bash
cd state-management      # Root folder
pnpm install            # Install dependencies
pnpm run dev           # Start development server
pnpm run build         # Build for production
```

---

## 📚 Project Structure

```
state-management/
├── backend/              # Backend API (Node.js + Express)
│   ├── config/          # Database configuration
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & validation
│   └── server.js        # Main server file
│
├── src/                 # Frontend source code (React + TypeScript)
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React Context (state management)
│   └── utils/          # Utility functions
│
└── public/             # Static assets
```

---

## 🎓 Next Steps

Now that you have the application running:

1. 🛍️ Explore the application features
2. 👨‍💼 Try logging in as admin to see the dashboard
3. 🔍 Look at the code to understand how it works
4. ✏️ Try making small changes to customize it
5. 📖 Read the other documentation files for more details

---

## 💡 Tips for Beginners

- **Keep terminals open:** While working, keep both backend and frontend terminals running
- **Check terminals for errors:** If something doesn't work, check the terminal outputs for error messages
- **Use browser DevTools:** Press F12 in your browser to see console logs and network requests
- **Save your work:** Changes to code are auto-saved and will hot-reload in the browser
- **Git commits:** Make frequent commits as you make changes (good practice!)

---

## 📞 Need Help?

If you're stuck:
1. Read the error messages carefully - they often tell you what's wrong
2. Check the troubleshooting section above
3. Google the error message
4. Check the other `.md` files in the project for more specific documentation

---

## ✅ Success Checklist

Before you start developing, make sure:

- [ ] XAMPP MySQL is running (green status)
- [ ] Database `ecommerce_db` exists in phpMyAdmin
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Local: http://localhost:5173/"
- [ ] You can access http://localhost:5173 in your browser
- [ ] You can log in with the default credentials
- [ ] No error messages in any terminals

If all boxes are checked - you're good to go! 🎉

---

**Happy Coding! 🚀**

*Last Updated: October 18, 2025*
