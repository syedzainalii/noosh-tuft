# Neon Database Migration Guide

## Problem
The `hero_banners` table doesn't exist in your Neon PostgreSQL database, causing 500 errors when trying to save hero banners.

## Solution: Run SQL Migration

### Option 1: Using Neon Console (Recommended)

1. **Go to Neon Console**
   - Visit: https://console.neon.tech
   - Select your project: `ep-round-unit-a19rvj0z`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Make sure you're connected to the `neondb` database

3. **Run the Migration**
   - Copy the contents of `tmp_rovodev_neon_migration.sql`
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Success**
   - You should see a message confirming the table was created
   - The last query will show `table_exists: true`

### Option 2: Using psql Command Line

```bash
# Install psql if not already installed
# On Windows: Download from PostgreSQL website
# On Mac: brew install postgresql
# On Linux: sudo apt-get install postgresql-client

# Connect to your Neon database
psql "postgresql://neondb_owner:npg_4juKqTbmFtV7@ep-round-unit-a19rvj0z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Once connected, run the migration
\i tmp_rovodev_neon_migration.sql

# Or copy-paste the SQL directly
```

### Option 3: Using DBeaver or pgAdmin

1. Install DBeaver (https://dbeaver.io) or pgAdmin
2. Create a new PostgreSQL connection with these details:
   - Host: `ep-round-unit-a19rvj0z-pooler.ap-southeast-1.aws.neon.tech`
   - Port: `5432`
   - Database: `neondb`
   - Username: `neondb_owner`
   - Password: `npg_4juKqTbmFtV7`
   - SSL Mode: `require`
3. Open SQL Editor
4. Paste and run the migration SQL

## What the Migration Does

Creates the `hero_banners` table with:
- `id` - Primary key (auto-increment)
- `title` - Optional hero title
- `subtitle` - Optional hero subtitle  
- `image_url` - Required banner image URL
- `button1_text` - Optional first button text
- `button1_url` - Optional first button URL
- `button2_text` - Optional second button text
- `button2_url` - Optional second button URL
- `is_active` - Boolean flag (only one active at a time)
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated

## After Migration

1. **Test the API**
   - The 500 errors should be gone
   - Try creating a hero banner at `/admin/hero-banner`

2. **Verify in Database**
   ```sql
   -- Check the table structure
   \d hero_banners
   
   -- View all hero banners
   SELECT * FROM hero_banners;
   ```

## Why This Was Needed

SQLAlchemy's `Base.metadata.create_all()` doesn't always work reliably on serverless databases like Neon because:
- Connection pooling can interfere with DDL operations
- Serverless functions may timeout during table creation
- Direct SQL migration is more reliable for production databases

## Future Migrations

For future table changes, always create explicit migrations rather than relying on auto-creation.
