# Database Migrations Guide

## Problem: Missing hero_slides table in production

The `hero_slides` table was added to the models but doesn't exist in your production database on Vercel, causing 500 errors.

## Solutions (Choose ONE):

### Option 1: Run Python Script (Recommended)
This is the easiest method if you have access to your production database connection string.

```bash
cd server
pip install -r requirements.txt
python init_hero_slides_table.py
```

### Option 2: Run SQL Script Directly
If you have direct access to your Vercel Postgres database:

1. Go to your Vercel dashboard
2. Navigate to your database
3. Open the SQL editor
4. Copy and paste the contents of `create_hero_slides_table.sql`
5. Execute the SQL

### Option 3: Use Alembic Migrations (Best for future)
For proper migration management going forward:

```bash
cd server
pip install alembic

# Run the migration
alembic upgrade head
```

### Option 4: Redeploy with Fresh Database
If you're okay with recreating the database:

1. The `Base.metadata.create_all(bind=engine)` in `main.py` should create all tables on startup
2. However, on Vercel serverless, this might not work reliably
3. Consider adding a startup script or migration job

## Vercel-Specific Solution

For Vercel deployments, you may need to:

1. **Add a build script** that runs migrations during deployment
2. **Use Vercel's build hooks** to execute migration scripts
3. **Manually run the SQL** via the Vercel Postgres dashboard

## Verification

After running any of the above solutions, verify the table exists:

```sql
SELECT * FROM hero_slides;
```

You should see an empty table with all the columns.

## Future Migrations

Going forward, use Alembic for all schema changes:

```bash
# Create a new migration
alembic revision --autogenerate -m "description of change"

# Apply migrations
alembic upgrade head
```
