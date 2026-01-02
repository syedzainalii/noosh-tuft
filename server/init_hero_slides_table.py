"""
Script to create hero_slides table in the database.
Run this script to add the missing table to your production database.
"""
import sys
from pathlib import Path

# Add parent directory to Python path for imports
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine, inspect
from database import engine
from models import Base, HeroSlide
from config import settings

def create_hero_slides_table():
    """Create hero_slides table if it doesn't exist"""
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    print(f"Existing tables: {existing_tables}")
    
    if "hero_slides" not in existing_tables:
        print("Creating hero_slides table...")
        HeroSlide.__table__.create(bind=engine)
        print("✅ hero_slides table created successfully!")
    else:
        print("ℹ️  hero_slides table already exists")
    
    # Verify
    inspector = inspect(engine)
    if "hero_slides" in inspector.get_table_names():
        print("✅ Verification successful: hero_slides table exists")
        columns = [col['name'] for col in inspector.get_columns('hero_slides')]
        print(f"   Columns: {columns}")
    else:
        print("❌ Error: hero_slides table was not created")

if __name__ == "__main__":
    try:
        print(f"Database URL: {settings.DATABASE_URL[:30]}...")
        create_hero_slides_table()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
