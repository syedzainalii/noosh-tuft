# 🚀 Deploy Your Noosh Tuft E-commerce Site

## Your Environment Variables

### Backend (Server) - Vercel Environment Variables

Go to: **Vercel Dashboard → Your Backend Project → Settings → Environment Variables**

Add these **EXACT** variables:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_4juKqTbmFtV7@ep-round-unit-a19rvj0z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# JWT Settings
SECRET_KEY=rURipMLPYQThadXVjeoI4zCBf1Z3tml6
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email Settings (Update if needed)
MAIL_USERNAME=syedzainali4372@gmail.com
MAIL_PASSWORD=dfzd syyk igxl bmgb
MAIL_FROM=syedzainali4372@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=Noosh Tuft

# Frontend URL
FRONTEND_URL=https://noosh-tuft.vercel.app

# Admin Credentials
ADMIN_EMAIL=syedzainali4372@gmail.com
ADMIN_PASSWORD=zain2002

# Redis (Optional - if not using Redis, can be localhost)
REDIS_URL=redis://localhost:6379

# Note: Cloudinary credentials NOT needed on backend - images upload directly from frontend!
```

### Frontend (Client) - Vercel Environment Variables

Go to: **Vercel Dashboard → Your Frontend Project → Settings → Environment Variables**

Add these **EXACT** variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://noosh-tuft-backend.vercel.app

# Cloudinary (Frontend Direct Upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=nooshdb
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nooshdb
```

---

## 🎯 Step-by-Step Deployment

### Step 1: Fix Cloudinary Upload Preset (CRITICAL!)

1. **Login to Cloudinary:** https://cloudinary.com/console
2. **Go to Settings** (gear icon) → **Upload** tab
3. **Scroll to "Upload presets"**
4. **Create or edit preset:**
   - **Preset name:** `nooshdb`
   - **Signing mode:** `Unsigned` ⭐ **MUST BE UNSIGNED!**
   - **Folder:** `ecommerce` (optional)
5. **Click Save**

---

### Step 2: Update Backend Environment Variables

**Via Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Select your **backend project** (server)
3. Click **Settings** → **Environment Variables**
4. **Delete all old variables** (if any)
5. **Add all variables from above** (Backend section)
6. For each variable:
   - Name: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_4juKqTbmFtV7@ep-round-unit-a19rvj0z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
   - Environment: **Production, Preview, Development** (select all 3)
   - Click **Save**
7. Repeat for ALL variables above

**Via Vercel CLI (Alternative):**

```bash
cd server

# Set each variable
vercel env add DATABASE_URL production
# Paste: postgresql://neondb_owner:npg_4juKqTbmFtV7@ep-round-unit-a19rvj0z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

vercel env add SECRET_KEY production
# Paste: rURipMLPYQThadXVjeoI4zCBf1Z3tml6

# Note: No Cloudinary variables needed - images upload directly from frontend!

# ... add all other variables (MAIL_*, ADMIN_*, etc.)
```

---

### Step 3: Update Frontend Environment Variables

**Via Vercel Dashboard:**

1. Select your **frontend project** (client)
2. Click **Settings** → **Environment Variables**
3. Add these 3 variables:
   - `NEXT_PUBLIC_API_URL` = `https://noosh-tuft-backend.vercel.app`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = `nooshdb`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` = `nooshdb`
4. Select all 3 environments (Production, Preview, Development)
5. Click **Save** for each

---

### Step 4: Update Local .env Files

**Backend (`server/.env`):**

Create/update `server/.env`:

```env
DATABASE_URL=postgresql://neondb_owner:npg_4juKqTbmFtV7@ep-round-unit-a19rvj0z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
SECRET_KEY=rURipMLPYQThadXVjeoI4zCBf1Z3tml6
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
MAIL_USERNAME=syedzainali4372@gmail.com
MAIL_PASSWORD=dfzd syyk igxl bmgb
MAIL_FROM=syedzainali4372@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com

# Note: No Cloudinary credentials needed - images upload directly from frontend!
MAIL_FROM_NAME=Noosh Tuft
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=syedzainali4372@gmail.com
ADMIN_PASSWORD=zain2002
REDIS_URL=redis://localhost:6379
```

**Frontend (`client/.env.local`):**

Update `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=nooshdb
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nooshdb
```

---

### Step 5: Commit and Deploy

```bash
# Commit all changes
git add .
git commit -m "Add Cloudinary integration and mobile optimization"
git push origin main
```

**Vercel will auto-deploy both frontend and backend!**

Or manually deploy:

```bash
# Deploy backend
cd server
vercel --prod

# Deploy frontend
cd ../client
vercel --prod
```

---

### Step 6: Redeploy After Adding Environment Variables

⚠️ **IMPORTANT:** After adding environment variables, you MUST redeploy!

**Via Vercel Dashboard:**
1. Go to **Deployments** tab
2. Click **...** menu on latest deployment
3. Click **Redeploy**

**Via CLI:**
```bash
cd server
vercel --prod

cd ../client
vercel --prod
```

---

## ✅ Testing Checklist

### Test Backend:

1. **Homepage:** https://noosh-tuft-backend.vercel.app/
   - Should show API info (not 404)

2. **Categories:** https://noosh-tuft-backend.vercel.app/api/categories
   - Should return `[]` or array (not 404)

3. **Products:** https://noosh-tuft-backend.vercel.app/api/products
   - Should return `[]` or array

4. **Docs:** https://noosh-tuft-backend.vercel.app/docs
   - Should show FastAPI docs

### Test Frontend:

1. **Homepage:** https://noosh-tuft.vercel.app/
   - Should load without errors

2. **Open Console** (F12):
   - No 404 errors
   - No 401 Cloudinary errors

3. **Test Image Upload:**
   - Login as admin
   - Try to upload a product image
   - Should upload to Cloudinary successfully

---

## 🐛 Troubleshooting

### If still getting 404 errors:

**Check backend is deployed:**
```bash
curl https://noosh-tuft-backend.vercel.app/
```

**Check Vercel logs:**
1. Vercel Dashboard → Backend Project → Deployments
2. Click latest deployment
3. Click "View Function Logs"
4. Look for errors

**Common issue:** Database connection
- Verify `DATABASE_URL` is correct in Vercel
- Check Neon database is running at: https://console.neon.tech/

### If still getting 401 Cloudinary errors:

**Verify preset is unsigned:**
1. Cloudinary Dashboard → Settings → Upload
2. Click on `nooshdb` preset
3. **Signing mode MUST show "Unsigned"**
4. If it says "Signed", change to "Unsigned" and save

**Clear browser cache:**
- Ctrl+Shift+Delete → Clear cached files

**Test with the HTML test file:**
```bash
start client/tmp_rovodev_test_upload.html
```

### If backend connects but categories are empty:

**Run database migrations:**
```bash
cd server
alembic upgrade head
```

**Or seed some test data** (if you have a seed script)

---

## 🚀 Quick Deploy Commands

### For Vercel:

```bash
# One-time: Link projects to Vercel
cd server
vercel
# Follow prompts, link to existing project

cd ../client  
vercel
# Follow prompts, link to existing project

# Deploy to production
cd server && vercel --prod
cd ../client && vercel --prod
```

### For Local Testing:

```bash
# Terminal 1 - Backend
cd server
python -m uvicorn api.main:app --reload

# Terminal 2 - Frontend
cd client
npm run dev
```

Then open: http://localhost:3000

---

## 📋 Final Checklist

- [ ] Cloudinary preset `nooshdb` created
- [ ] Preset set to **UNSIGNED** mode ⭐
- [ ] Backend environment variables added to Vercel
- [ ] Frontend environment variables added to Vercel
- [ ] Backend redeployed after adding variables
- [ ] Frontend redeployed after adding variables
- [ ] Tested backend URL (no 404)
- [ ] Tested frontend (no 401 Cloudinary error)
- [ ] Tested image upload (works!)
- [ ] Local `.env` files updated

---

## 🎉 You're All Set!

Once you:
1. ✅ Set Cloudinary preset to "Unsigned"
2. ✅ Add environment variables to Vercel
3. ✅ Redeploy both projects

Your site should work perfectly! 🚀

**Test it and let me know if you encounter any issues!**
