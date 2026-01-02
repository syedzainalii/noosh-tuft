"""
Ensure all database tables exist.
This script can be run as part of deployment or manually.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import inspect, text
from database import engine, Base
from models import *
from config import settings

def ensure_all_tables():
    """Create all tables that don't exist"""
    try:
        print("=" * 60)
        print("DATABASE TABLE INITIALIZATION")
        print("=" * 60)
        print(f"\nDatabase: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'local'}")
        
        # Get existing tables
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        print(f"\nExisting tables: {existing_tables}")
        
        # Get all tables defined in models
        all_tables = Base.metadata.tables.keys()
        print(f"Required tables: {list(all_tables)}")
        
        # Find missing tables
        missing_tables = [table for table in all_tables if table not in existing_tables]
        
        if missing_tables:
            print(f"\n⚠️  Missing tables detected: {missing_tables}")
            print("\nCreating missing tables...")
            
            # Create only missing tables
            for table_name in missing_tables:
                table = Base.metadata.tables[table_name]
                table.create(bind=engine, checkfirst=True)
                print(f"  ✅ Created: {table_name}")
            
            print("\n✅ All missing tables have been created!")
        else:
            print("\n✅ All tables already exist. No action needed.")
        
        # Verify all tables now exist
        print("\n" + "=" * 60)
        print("VERIFICATION")
        print("=" * 60)
        inspector = inspect(engine)
        final_tables = inspector.get_table_names()
        
        for table in all_tables:
            if table in final_tables:
                cols = [col['name'] for col in inspector.get_columns(table)]
                print(f"✅ {table}: {len(cols)} columns")
            else:
                print(f"❌ {table}: MISSING!")
        
        print("\n" + "=" * 60)
        print("INITIALIZATION COMPLETE")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = ensure_all_tables()
    sys.exit(0 if success else 1)
