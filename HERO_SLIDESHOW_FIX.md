# Hero Slideshow Fix Guide

## 🔍 Root Causes

The hero slideshow is failing due to **two issues**:

### 1. CORS Configuration (✅ FIXED)
- **Problem**: Vercel serverless functions weren't returning proper CORS headers
- **Solution**: Updated `server/vercel.json` with proper CORS headers
- **Status**: Fixed, needs redeployment

### 2. Missing Database Table (❌ NEEDS FIX)
- **Problem**: The `hero_slides` table doesn't exist in production database
- **Error**: 500 Internal Server Error from `/api/hero-slides`
- **Status**: Needs manual database migration

## 🎯 Current Behavior

The `HeroSlideshow` component is actually working correctly! It has built-in error handling:

1. **Loading State**: Shows an animated sparkle while fetching
2. **Error/Empty State**: Shows a beautiful fallback hero with "Welcome to Noosh Tuft"
3. **Success State**: Shows the slideshow with your configured slides

So the site **won't crash** - it just shows the default hero until you fix the database.

## 🚀 Fix Steps

### Step 1: Redeploy Backend (for CORS fix)

```bash
cd server
git add vercel.json
git commit -m "Fix CORS headers for Vercel deployment"
git push
```

Or manually via Vercel dashboard:
1. Go to Vercel Dashboard
2. Select your backend project
3. Go to "Deployments"
4. Click "Redeploy"

### Step 2: Create Database Table

Choose ONE of these options:

#### Option A: Via Vercel Postgres Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to: Your Project → Storage → Your Database
3. Click "Query" or ".sql" tab
4. Copy and paste from `server/create_hero_slides_table.sql`
5. Click "Execute"

#### Option B: Run Python Script (If you have DB access)

```bash
cd server
pip install -r requirements.txt

# Set your DATABASE_URL environment variable
export DATABASE_URL="your_vercel_postgres_url"

# Run the script
python ensure_tables.py
```

#### Option C: Use Alembic (Professional approach)

```bash
cd server
pip install alembic

# Run migration
alembic upgrade head
```

### Step 3: Verify

After fixing the database, test these endpoints:

```bash
# Should return 200 with empty array or your slides
curl https://noosh-tuft-backend.vercel.app/api/hero-slides

# Should return 200 (health check)
curl https://noosh-tuft-backend.vercel.app/health
```

## 📝 Quick Test

After both fixes are deployed, your browser console errors should change from:

**Before:**
```
❌ Failed to load resource: the server responded with a status of 500
❌ Access to XMLHttpRequest blocked by CORS policy
```

**After:**
```
✅ No errors (or empty array response)
```

## 🎨 Adding Your First Slide

Once the database is fixed, add slides via the admin panel:

1. Go to: `https://noosh-tuft.vercel.app/admin/hero-slides`
2. Login with admin credentials
3. Click "Add New Slide"
4. Fill in:
   - **Title**: Your main headline
   - **Subtitle**: Supporting text
   - **Image URL**: Full URL to your hero image
   - **Button Text**: CTA text (e.g., "Shop Now")
   - **Button Link**: Where the button goes (e.g., "/products")
   - **Order Index**: 0 for first slide
   - **Active**: ✓ Checked

## 🔄 Why This Happened

The `hero_slides` feature was added to the codebase, but:
- The model was added to `models.py`
- The router was added to `routers/hero_slides.py`
- The frontend component was created

But the database table was never created in production because:
- Alembic migrations weren't set up initially
- `Base.metadata.create_all()` in `main.py` doesn't work reliably on Vercel serverless
- Manual database creation wasn't done during initial deployment

## 🛡️ Prevention for Future

I've now set up:
- ✅ Alembic migration infrastructure
- ✅ Migration scripts (`server/alembic/versions/001_add_hero_slides_table.py`)
- ✅ Helper scripts (`ensure_tables.py`, `init_hero_slides_table.py`)
- ✅ Documentation (`README_MIGRATIONS.md`)

For future schema changes, use:
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## 📞 Need Help?

If you're stuck, share:
1. Error messages from browser console
2. Which fix option you tried
3. Any error outputs from commands

The component is designed to gracefully handle failures, so your site will work even before fixing this!
