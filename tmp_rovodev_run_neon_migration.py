#!/usr/bin/env python3
"""
Script to create hero_banners table in Neon PostgreSQL database
Run this from the server directory: python tmp_rovodev_run_neon_migration.py
"""

import os
from sqlalchemy import create_engine, text

# Your Neon database URL
DATABASE_URL = "postgresql://neondb_owner:npg_4juKqTbmFtV7@ep-round-unit-a19rvj0z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Or read from environment variable
# DATABASE_URL = os.getenv("DATABASE_URL")

def run_migration():
    """Create the hero_banners table"""
    print("🔄 Connecting to Neon database...")
    
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        # SQL to create table
        migration_sql = """
        -- Create the hero_banners table
        CREATE TABLE IF NOT EXISTS hero_banners (
            id SERIAL PRIMARY KEY,
            title VARCHAR,
            subtitle VARCHAR,
            image_url VARCHAR NOT NULL,
            button1_text VARCHAR,
            button1_url VARCHAR,
            button2_text VARCHAR,
            button2_url VARCHAR,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE
        );

        -- Create index on id
        CREATE INDEX IF NOT EXISTS ix_hero_banners_id ON hero_banners(id);
        """
        
        # Execute migration
        print("📝 Creating hero_banners table...")
        with engine.connect() as conn:
            conn.execute(text(migration_sql))
            conn.commit()
            print("✅ Table created successfully!")
            
            # Verify table exists
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'hero_banners'
                ) AS table_exists;
            """))
            
            exists = result.fetchone()[0]
            if exists:
                print("✅ Verified: hero_banners table exists!")
                
                # Show table structure
                print("\n📋 Table structure:")
                result = conn.execute(text("""
                    SELECT column_name, data_type, is_nullable
                    FROM information_schema.columns 
                    WHERE table_name = 'hero_banners'
                    ORDER BY ordinal_position;
                """))
                
                for row in result:
                    nullable = "NULL" if row[2] == "YES" else "NOT NULL"
                    print(f"  • {row[0]}: {row[1]} ({nullable})")
            else:
                print("❌ Error: Table was not created")
                return False
        
        print("\n🎉 Migration completed successfully!")
        print("You can now use the hero banner feature!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error during migration: {e}")
        print("\nTroubleshooting:")
        print("1. Check your database URL is correct")
        print("2. Ensure you have psycopg2 or psycopg2-binary installed:")
        print("   pip install psycopg2-binary")
        print("3. Check network connectivity to Neon")
        return False

if __name__ == "__main__":
    print("\n" + "="*50)
    print("  NEON DATABASE MIGRATION")
    print("  Creating hero_banners table")
    print("="*50 + "\n")
    
    success = run_migration()
    
    if success:
        print("\n✅ All done! Your app is ready to use hero banners.")
    else:
        print("\n❌ Migration failed. Please check the errors above.")
        print("\nAlternative: Run the SQL manually in Neon console")
        print("File: tmp_rovodev_neon_migration.sql")
