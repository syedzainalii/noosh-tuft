# Ecommerce Backend API

FastAPI backend for the ecommerce platform.

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run server
python main.py
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

See `.env.example` for all required configuration options.

## Database Models

- **User**: User accounts with authentication
- **Category**: Product categories
- **Product**: Product catalog
- **Cart**: Shopping cart items
- **Order**: Customer orders
- **OrderItem**: Items within orders

## Authentication

JWT-based authentication with access and refresh tokens.

### Token Endpoints
- Login: `POST /api/auth/login`
- Register: `POST /api/auth/register`
- Refresh: `POST /api/auth/refresh`

## Development

```bash
# Run with auto-reload
uvicorn main:app --reload

# Run tests
pytest

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```
