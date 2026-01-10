# 🚀 Quick Start Guide - Noosh Tuft E-commerce

## ⚡ Fast Deploy (3 Steps)

### 1️⃣ Fix Cloudinary (2 minutes)
- Go to https://cloudinary.com/console
- Settings → Upload → Upload presets
- Find `nooshdb` preset
- **Set to "Unsigned"** ⭐
- Save

### 2️⃣ Add Environment Variables to Vercel

**Backend:** https://vercel.com/dashboard → Your Backend → Settings → Environment Variables

```env
DATABASE_URL=postgresql://neondb_owner:npg_4juKqTbmFtV7@ep-round-unit-a19rvj0z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
SECRET_KEY=rURipMLPYQThadXVjeoI4zCBf1Z3tml6
```

**Note:** No Cloudinary credentials needed on backend - images upload directly from frontend!

**Frontend:** Your Frontend → Settings → Environment Variables

```env
NEXT_PUBLIC_API_URL=https://noosh-tuft-backend.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=nooshdb
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nooshdb
```

### 3️⃣ Redeploy
- Vercel Dashboard → Deployments → ... → Redeploy

**That's it!** 🎉

---

## 🧪 Test After Deploy

1. **Backend:** https://noosh-tuft-backend.vercel.app/
2. **Frontend:** https://noosh-tuft.vercel.app/
3. **Try uploading an image** (should work without errors)

---

## 📚 Full Documentation

- **DEPLOY_WITH_YOUR_CREDENTIALS.md** - Complete deployment guide
- **FIX_ERRORS_GUIDE.md** - Troubleshooting 404/401 errors
- **MOBILE_OPTIMIZATION_COMPLETE.md** - Responsive design details

---

## 💻 Local Development

```bash
# Terminal 1 - Backend
cd server
python -m uvicorn api.main:app --reload

# Terminal 2 - Frontend
cd client
npm run dev
```

Open: http://localhost:3000

---

## 🆘 Having Issues?

**Most common fixes:**
1. ✅ Cloudinary preset set to "Unsigned"
2. ✅ All environment variables added to Vercel
3. ✅ Redeployed after adding variables

**Still stuck?** Check **FIX_ERRORS_GUIDE.md**
