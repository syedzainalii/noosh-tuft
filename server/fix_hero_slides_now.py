#!/usr/bin/env python3
"""
ONE-COMMAND FIX for hero_slides table
Run this script with your database URL to create the missing table.

Usage:
    python fix_hero_slides_now.py

Make sure you have DATABASE_URL in your .env file or environment
"""
import os
import sys

def create_table():
    try:
        # Try to import psycopg2 (PostgreSQL driver)
        try:
            import psycopg2
        except ImportError:
            print("❌ psycopg2 not installed. Installing...")
            os.system("pip install psycopg2-binary")
            import psycopg2
        
        # Get database URL from environment
        database_url = os.getenv('DATABASE_URL')
        
        if not database_url:
            print("\n❌ DATABASE_URL environment variable not found!")
            print("\nPlease set it first:")
            print("  export DATABASE_URL='your_postgres_connection_string'")
            print("\nOr add it to your .env file")
            sys.exit(1)
        
        print(f"🔌 Connecting to database...")
        print(f"   URL: {database_url[:30]}...")
        
        # Connect to database
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        print("\n📋 Creating hero_slides table...")
        
        # Create table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hero_slides (
                id SERIAL PRIMARY KEY,
                title VARCHAR NOT NULL,
                subtitle VARCHAR,
                image_url VARCHAR NOT NULL,
                button_text VARCHAR,
                button_link VARCHAR,
                order_index INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE
            );
        """)
        
        print("✅ Table created!")
        
        # Create indexes
        print("\n📊 Creating indexes...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_hero_slides_order 
            ON hero_slides(order_index);
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_hero_slides_active 
            ON hero_slides(is_active);
        """)
        print("✅ Indexes created!")
        
        # Commit changes
        conn.commit()
        
        # Verify
        print("\n🔍 Verifying table exists...")
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'hero_slides'
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        if columns:
            print("\n✅ SUCCESS! Table created with columns:")
            for col_name, col_type in columns:
                print(f"   - {col_name}: {col_type}")
        else:
            print("\n❌ Error: Table not found after creation")
            sys.exit(1)
        
        # Close connection
        cursor.close()
        conn.close()
        
        print("\n" + "="*60)
        print("🎉 HERO SLIDES TABLE CREATED SUCCESSFULLY!")
        print("="*60)
        print("\n✨ Your slideshow should now work!")
        print("📝 Next: Add slides via /admin/hero-slides")
        print()
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("\nIf you can't run this script, use the SQL in Vercel dashboard instead.")
        return False

if __name__ == "__main__":
    print("="*60)
    print("🔧 HERO SLIDES TABLE FIX")
    print("="*60)
    
    # Try to load .env file
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("✅ .env file loaded")
    except ImportError:
        print("ℹ️  python-dotenv not installed (that's okay)")
    
    print()
    success = create_table()
    sys.exit(0 if success else 1)
