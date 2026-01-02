# System Architecture

## Overview

This is a modern full-stack ecommerce application using a separation of concerns architecture with a REST API backend and a React-based frontend.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js 14 Frontend (Port 3000)           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │  Pages   │  │Components│  │  State Management    │ │ │
│  │  │  (App    │  │  (React) │  │     (Zustand)        │ │ │
│  │  │  Router) │  │          │  │                      │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         Axios API Client (with interceptors)     │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API Layer (Port 8000)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                FastAPI Application                      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │ │
│  │  │  Routers │  │  Schemas │  │   Authentication   │  │ │
│  │  │  (REST   │  │ (Pydantic│  │      (JWT)         │  │ │
│  │  │   API)   │  │  Models) │  │                    │  │ │
│  │  └──────────┘  └──────────┘  └────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │              Middleware Layer                     │ │ │
│  │  │         (CORS, Auth, Error Handling)            │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQLAlchemy ORM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                PostgreSQL Database                      │ │
│  │  ┌──────┐ ┌─────────┐ ┌──────┐ ┌────────┐ ┌────────┐ │ │
│  │  │Users │ │Products │ │Orders│ │Category│ │  Cart  │ │ │
│  │  └──────┘ └─────────┘ └──────┘ └────────┘ └────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌────────────────┐         ┌─────────────────────┐        │
│  │  Email Service │         │   File Storage      │        │
│  │   (SMTP/Gmail) │         │  (Future: AWS S3)   │        │
│  └────────────────┘         └─────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Heroicons

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Database ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Authentication**: JWT (python-jose)
- **Password Hashing**: Passlib (bcrypt)
- **Email**: FastAPI-Mail
- **Migrations**: Alembic

### Database
- **RDBMS**: PostgreSQL 14+
- **Connection**: psycopg2-binary

## Data Flow

### Authentication Flow
```
1. User Registration
   Client → POST /api/auth/register → Backend
   Backend → Hash Password → Save to DB
   Backend → Generate Verification Token
   Backend → Send Verification Email
   Backend → Return User Data

2. Email Verification
   User clicks link → GET /verify-email?token=xxx
   Backend → Verify Token → Update User
   Frontend → Redirect to Login

3. Login
   Client → POST /api/auth/login → Backend
   Backend → Verify Credentials
   Backend → Generate JWT (Access + Refresh)
   Backend → Return Tokens
   Client → Store Tokens in LocalStorage

4. Authenticated Requests
   Client → Add Authorization Header
   Backend → Verify JWT → Process Request
   
5. Token Refresh
   Access Token Expires → Interceptor Catches 401
   Client → POST /api/auth/refresh with Refresh Token
   Backend → Generate New Tokens
   Client → Retry Original Request
```

### Shopping Flow
```
1. Browse Products
   Client → GET /api/products
   Backend → Query Database
   Backend → Return Products with Categories

2. View Product Details
   Client → GET /api/products/slug/{slug}
   Backend → Query Product with Relations
   Backend → Return Full Product Data

3. Add to Cart
   Client → POST /api/cart
   Backend → Verify Stock → Create Cart Item
   Backend → Return Updated Cart

4. Checkout
   Client → POST /api/orders
   Backend → Validate Cart Items
   Backend → Check Stock Availability
   Backend → Create Order & Order Items
   Backend → Update Product Stock
   Backend → Clear User Cart
   Backend → Send Order Confirmation Email
   Backend → Return Order Details
```

### Admin Flow
```
1. Dashboard Statistics
   Admin → GET /api/admin/stats
   Backend → Aggregate Database Queries
   Backend → Return Statistics

2. Product Management
   Admin → POST /api/products
   Backend → Verify Admin Role
   Backend → Validate Data
   Backend → Create Product
   Backend → Return Product

3. Order Management
   Admin → PUT /api/orders/{id}
   Backend → Verify Admin Role
   Backend → Update Order Status
   Backend → Return Updated Order
```

## Security Architecture

### Authentication & Authorization
```
┌─────────────────────────────────────────┐
│         Security Layers                  │
├─────────────────────────────────────────┤
│ 1. Password Security                    │
│    - Bcrypt hashing                     │
│    - Minimum 8 characters               │
│    - Salt rounds: 12                    │
├─────────────────────────────────────────┤
│ 2. Token-Based Auth                     │
│    - JWT (HS256)                        │
│    - Access Token: 30 min               │
│    - Refresh Token: 7 days              │
├─────────────────────────────────────────┤
│ 3. Request Validation                   │
│    - Pydantic schemas                   │
│    - Type checking                      │
│    - Input sanitization                 │
├─────────────────────────────────────────┤
│ 4. Role-Based Access                    │
│    - Admin vs Customer roles            │
│    - Route protection                   │
│    - Dependency injection               │
├─────────────────────────────────────────┤
│ 5. Database Security                    │
│    - ORM (SQL injection protection)     │
│    - Parameterized queries              │
│    - Connection pooling                 │
└─────────────────────────────────────────┘
```

## Database Schema

### Entity Relationships
```
Users (1) ─────< Orders (M)
  │                  │
  │                  │
  └──< Cart Items    └──< Order Items >──┐
         │                                │
         │                                │
         └──> Products <──────────────────┘
                 │
                 │
                 └──> Categories (M:1)
```

### Key Tables

**users**
- id (PK)
- email (unique)
- hashed_password
- full_name
- role (admin/customer)
- is_active, is_verified
- verification_token, reset_token
- timestamps

**products**
- id (PK)
- name, slug (unique)
- description
- price, compare_at_price, cost_per_item
- stock_quantity
- sku (unique)
- image_url, images
- is_active, is_featured
- category_id (FK)
- timestamps

**categories**
- id (PK)
- name, slug (unique)
- description
- image_url
- timestamp

**orders**
- id (PK)
- order_number (unique)
- user_id (FK)
- status (enum)
- total_amount
- shipping details
- customer details
- timestamps

**order_items**
- id (PK)
- order_id (FK)
- product_id (FK)
- quantity, price

**cart_items**
- id (PK)
- user_id (FK)
- product_id (FK)
- quantity
- timestamp

## API Design

### RESTful Principles
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response
- Proper HTTP status codes
- Pagination support
- Filtering and search

### Response Format
```json
{
  "id": 1,
  "field": "value",
  "nested": {
    "field": "value"
  },
  "timestamps": "ISO-8601"
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

## State Management

### Zustand Stores

**authStore**
- user
- isAuthenticated
- isLoading
- login(), logout(), register()
- fetchUser(), verifyEmail()

**cartStore**
- items[]
- isLoading
- fetchCart(), addToCart()
- updateCartItem(), removeFromCart()
- clearCart(), getTotal()

## Deployment Architecture

### Production Setup (Recommended)
```
Internet
   │
   ▼
┌────────────────┐
│  Reverse Proxy │  (Nginx/Caddy)
│  (SSL/TLS)     │
└────────────────┘
   │          │
   │          └──────────┐
   ▼                     ▼
┌──────────┐      ┌──────────────┐
│ Frontend │      │   Backend    │
│  (Next)  │      │   (FastAPI)  │
│  :3000   │      │    :8000     │
└──────────┘      └──────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ PostgreSQL  │
                  │   :5432     │
                  └─────────────┘
```

## Performance Considerations

### Frontend
- Server-side rendering (SSR)
- Image optimization
- Code splitting
- Lazy loading
- Caching strategies

### Backend
- Database connection pooling
- Query optimization
- Pagination
- Async operations
- Response compression

### Database
- Indexes on frequently queried fields
- Foreign key constraints
- Query optimization
- Connection pooling

## Scalability

### Horizontal Scaling
- Stateless API design
- JWT tokens (no server sessions)
- Load balancer ready
- Database replication support

### Caching Strategy (Future)
- Redis for session data
- Product catalog caching
- Query result caching
- CDN for static assets

## Monitoring & Logging

### Backend Logging
- Request/response logging
- Error logging
- Performance metrics
- Database query logging

### Frontend Logging
- Error boundaries
- Console logging (development)
- Error tracking (production ready)

## Testing Strategy

### Backend Testing
- Unit tests (pytest)
- API endpoint tests
- Database tests
- Authentication tests

### Frontend Testing
- Component tests (Jest)
- Integration tests
- E2E tests (ready for Playwright)

## Development Workflow

### Local Development
1. Run PostgreSQL locally
2. Start backend (port 8000)
3. Start frontend (port 3000)
4. Hot reload enabled

### Version Control
- Git for source control
- Feature branches
- Pull request workflow
- Code review process

## Future Enhancements

### Microservices
- Separate order service
- Separate payment service
- Separate notification service

### Message Queue
- RabbitMQ/Celery for async tasks
- Email queue
- Order processing queue

### Cloud Services
- AWS S3 for images
- CloudFront CDN
- AWS SES for emails
- Container orchestration (Docker/Kubernetes)
