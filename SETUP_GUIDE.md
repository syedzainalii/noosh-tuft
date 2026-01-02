# Quick Setup Guide

This guide will help you get the ecommerce website up and running in minutes.

## Step 1: Install Prerequisites

### Required Software
- **Python 3.9+**: Download from https://www.python.org/downloads/
- **Node.js 18+**: Download from https://nodejs.org/
- **PostgreSQL 14+**: Download from https://www.postgresql.org/download/

### Verify Installation
```bash
python --version
node --version
npm --version
psql --version
```

## Step 2: Database Setup

### Create Database
```bash
# Option 1: Using command line
createdb ecommerce_db

# Option 2: Using PostgreSQL shell
psql -U postgres
CREATE DATABASE ecommerce_db;
\q
```

## Step 3: Backend Setup

### Navigate to server directory
```bash
cd server
```

### Create and activate virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Configure environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings
# Minimum required changes:
# - DATABASE_URL: Update with your PostgreSQL credentials
# - SECRET_KEY: Generate a strong random key
# - Email settings: Add your email credentials
```

### Generate SECRET_KEY
```python
# Run this in Python to generate a secure key
import secrets
print(secrets.token_urlsafe(32))
```

### Start backend server
```bash
python main.py
```

Server will run at: http://localhost:8000
API docs available at: http://localhost:8000/docs

## Step 4: Frontend Setup

### Open new terminal and navigate to client directory
```bash
cd client
```

### Install dependencies
```bash
npm install
```

### Configure environment
```bash
# Copy example env file
cp .env.local.example .env.local

# The default settings should work:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Start frontend
```bash
npm run dev
```

Frontend will run at: http://localhost:3000

## Step 5: Access the Application

### Customer Access
1. Open http://localhost:3000
2. Click "Sign Up" to create an account
3. Check your email for verification link
4. Verify email and login

### Admin Access
1. Open http://localhost:3000/login
2. Login with default credentials:
   - Email: admin@example.com
   - Password: admin123
3. **Important**: Change password immediately!
4. Access admin dashboard at http://localhost:3000/admin

## Step 6: Add Sample Data (Optional)

### Add Categories
1. Login as admin
2. Go to Admin Dashboard → Manage Categories
3. Add categories like: Electronics, Clothing, Books, etc.

### Add Products
1. Go to Admin Dashboard → Manage Products
2. Click "Add New Product"
3. Fill in product details
4. For image URLs, you can use:
   - Unsplash: https://source.unsplash.com/800x600/?product
   - Placeholder: https://via.placeholder.com/800x600

## Common Issues and Solutions

### Issue: Database connection failed
**Solution**: 
- Check if PostgreSQL is running
- Verify DATABASE_URL in server/.env
- Ensure database 'ecommerce_db' exists

### Issue: Email verification not working
**Solution**:
- Check email credentials in server/.env
- For Gmail: Enable 2FA and use App Password
- Check spam folder for verification emails
- In development, check backend logs for email content

### Issue: CORS errors
**Solution**:
- Ensure backend is running on port 8000
- Verify FRONTEND_URL in server/.env matches frontend URL
- Clear browser cache

### Issue: Port already in use
**Solution**:
```bash
# Find and kill process on port 8000 (backend)
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Find and kill process on port 3000 (frontend)
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## Gmail Email Configuration

1. Go to Google Account settings
2. Enable 2-Step Verification
3. Generate App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated password
4. Use this password in MAIL_PASSWORD in .env

## Next Steps

### For Development
- Read the full README.md for detailed documentation
- Explore the API at http://localhost:8000/docs
- Customize the frontend theme in client/tailwind.config.ts

### For Production
- Change all default passwords
- Use production-grade SECRET_KEY
- Set up proper email service (SendGrid, AWS SES, etc.)
- Configure production database
- Enable HTTPS
- Set up proper logging and monitoring
- Review security settings

## Testing the Application

### Test Customer Flow
1. Register a new account
2. Browse products
3. Add items to cart
4. Complete checkout
5. View order history

### Test Admin Flow
1. Login as admin
2. Create categories
3. Add products
4. View dashboard statistics
5. Manage orders
6. Update order statuses

## Development Workflow

### Making Changes

#### Backend Changes
1. Edit files in server/
2. Changes auto-reload (uvicorn --reload)
3. Test at http://localhost:8000/docs

#### Frontend Changes
1. Edit files in client/src/
2. Changes auto-reload (Next.js Fast Refresh)
3. View at http://localhost:3000

### Database Changes
1. Modify models in server/models.py
2. Create migration: `alembic revision --autogenerate -m "Description"`
3. Apply migration: `alembic upgrade head`

## Getting Help

- Check the full README.md
- Review API documentation at /docs
- Check console logs for errors
- Review the code comments
- Open an issue on GitHub

## Success Checklist

- [ ] PostgreSQL database created and running
- [ ] Backend server running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can register a new user
- [ ] Can login as admin
- [ ] Admin dashboard loads correctly
- [ ] Can create products and categories

If all checkboxes are complete, you're ready to develop! 🎉
