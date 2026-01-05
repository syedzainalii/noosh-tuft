import sys
from pathlib import Path

# Add parent directory to Python path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, products, categories, cart, orders, admin, handcraft_photos, reviews, hero_banners, about, packages
from models import User, UserRole, HeroBanner, AboutPage
from auth import get_password_hash
from config import settings
from sqlalchemy.orm import Session
from database import SessionLocal

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Ecommerce API",
    description="Modern ecommerce backend with authentication and admin dashboard",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://noosh-tuft.vercel.app",
        settings.FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(handcraft_photos.router)
app.include_router(reviews.router)
app.include_router(hero_banners.router)
app.include_router(about.router)
app.include_router(packages.router)


@app.on_event("startup")
async def startup_event():
    """Create default admin user if not exists"""
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin_user:
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                full_name="Admin User",
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True
            )
            db.add(admin_user)
            db.commit()
            print(f"Admin user created: {settings.ADMIN_EMAIL}")
    finally:
        db.close()


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Ecommerce API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
