# Modern Ecommerce Website

A full-stack ecommerce platform built with Next.js 14, FastAPI, PostgreSQL, and TypeScript. Features include user authentication with email verification, product management, shopping cart, checkout system, and a comprehensive admin dashboard.

## Features

### Customer Features
- 🔐 User registration and login with email verification
- 🛍️ Browse products with search and category filters
- 🛒 Shopping cart functionality
- 💳 Checkout process with order management
- 📦 Order history and tracking
- 🔔 Email notifications for registration and orders

### Admin Features
- 📊 Dashboard with key metrics and statistics
- 📦 Product management (CRUD operations)
- 🗂️ Category management
- 📋 Order management with status updates
- 👥 User management
- 📈 Sales and inventory tracking

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Relational database
- **SQLAlchemy**: ORM for database operations
- **Alembic**: Database migrations
- **JWT**: Authentication and authorization
- **FastAPI-Mail**: Email notifications
- **Pydantic**: Data validation

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **Axios**: HTTP client
- **React Hook Form**: Form handling
- **React Hot Toast**: Notifications
- **Heroicons**: Icon library

## Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-website
```

### 2. Backend Setup

```bash
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# Update DATABASE_URL, SECRET_KEY, email settings, etc.
```

#### Database Setup

```bash
# Create PostgreSQL database
createdb ecommerce_db

# Or using psql:
psql -U postgres
CREATE DATABASE ecommerce_db;
\q

# The application will create tables automatically on first run
# Or you can use Alembic for migrations:
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

#### Run Backend Server

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install
# or
yarn install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local if needed
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Run Frontend

```bash
# Development mode
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## Default Admin Credentials

After starting the backend, a default admin account is created:

- **Email**: admin@example.com (or from your .env ADMIN_EMAIL)
- **Password**: admin123 (or from your .env ADMIN_PASSWORD)

**⚠️ Important**: Change these credentials immediately after first login!

## Project Structure

```
ecommerce-website/
├── server/                 # FastAPI backend
│   ├── routers/           # API route handlers
│   │   ├── auth.py        # Authentication endpoints
│   │   ├── products.py    # Product endpoints
│   │   ├── categories.py  # Category endpoints
│   │   ├── cart.py        # Cart endpoints
│   │   ├── orders.py      # Order endpoints
│   │   └── admin.py       # Admin endpoints
│   ├── models.py          # Database models
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # Authentication utilities
│   ├── database.py        # Database configuration
│   ├── config.py          # Application configuration
│   ├── email_service.py   # Email functionality
│   ├── main.py            # FastAPI application
│   └── requirements.txt   # Python dependencies
│
└── client/                # Next.js frontend
    ├── src/
    │   ├── app/          # Next.js app directory
    │   │   ├── admin/    # Admin dashboard pages
    │   │   ├── products/ # Product pages
    │   │   ├── cart/     # Cart page
    │   │   ├── checkout/ # Checkout page
    │   │   ├── orders/   # Order pages
    │   │   ├── login/    # Login page
    │   │   └── register/ # Registration page
    │   ├── components/   # React components
    │   ├── lib/          # Utilities and API client
    │   ├── store/        # Zustand stores
    │   └── types/        # TypeScript types
    └── package.json      # Node dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/slug/{slug}` - Get product by slug
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/{id}` - Update category (admin)
- `DELETE /api/categories/{id}` - Delete category (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove cart item

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order status (admin)

### Admin
- `GET /api/admin/stats` - Dashboard statistics

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@example.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=Ecommerce Store

FRONTEND_URL=http://localhost:3000

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

REDIS_URL=redis://localhost:6379
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in MAIL_PASSWORD

For other providers, update MAIL_SERVER and MAIL_PORT accordingly.

## Development

### Running Tests

```bash
# Backend tests
cd server
pytest

# Frontend tests
cd client
npm test
```

### Database Migrations

```bash
cd server
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Production Deployment

### Backend

1. Set production environment variables
2. Use a production WSGI server (Gunicorn)
3. Set up HTTPS/SSL
4. Configure CORS properly
5. Use a production database

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

```bash
npm run build
npm start
```

Or deploy to Vercel, Netlify, or similar platforms.

## Security Considerations

- Change default admin credentials
- Use strong SECRET_KEY
- Enable HTTPS in production
- Implement rate limiting
- Regular security updates
- Secure email credentials
- Validate and sanitize all inputs
- Use environment variables for sensitive data

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Email Not Sending
- Verify email credentials
- Check firewall settings
- Ensure 2FA and App Password (for Gmail)

### CORS Errors
- Verify FRONTEND_URL in backend .env
- Check CORS middleware configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- FastAPI documentation
- Next.js documentation
- Tailwind CSS
- PostgreSQL community
# noosh-tuft
