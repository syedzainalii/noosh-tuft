# 🔧 Fix 404 and Cloudinary 401 Errors

## Issues Detected

1. ❌ **404 Error**: Backend API endpoint not responding at `https://noosh-tuft-backend.vercel.app/api/categories`
2. ❌ **Cloudinary 401 Error**: "Unknown API key" - Upload preset not configured correctly

---

## ✅ Solution 1: Fix Backend 404 Error

### The categories endpoint exists but backend might not be deployed properly.

### Check Backend Deployment:

1. **Visit your backend URL directly:**
   ```
   https://noosh-tuft-backend.vercel.app/
   ```
   - Should show: "Welcome to Noosh Tuft API" or similar

2. **Test categories endpoint:**
   ```
   https://noosh-tuft-backend.vercel.app/api/categories
   ```
   - Should return JSON array of categories or empty array `[]`

3. **If 404 persists, redeploy backend:**

```bash
# Go to server directory
cd server

# Deploy to Vercel
vercel --prod

# Or push to Git (auto-deploys if connected)
git add .
git commit -m "Redeploy backend"
git push origin main
```

### Verify Environment Variables on Vercel:

Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables

**Required variables:**
```
DATABASE_URL=your_neon_database_url
SECRET_KEY=rURipMLPYQThadXVjeoI4zCBf1Z3tml6
# ... other variables (MAIL_*, ADMIN_*, etc.)
```

**Note:** Backend does NOT need Cloudinary credentials - images upload directly from frontend!

After adding variables, **redeploy**!

---

## ✅ Solution 2: Fix Cloudinary 401 Error (CRITICAL)

The error "Unknown API key" means your upload preset is **NOT configured as UNSIGNED**.

### Step-by-Step Fix:

#### 1. Login to Cloudinary
Go to https://cloudinary.com/console

#### 2. Verify Cloud Name
- At the top of dashboard, check your **Cloud Name**
- It should be: `nooshdb`
- If different, update `.env.local` in client folder

#### 3. Create/Fix Unsigned Upload Preset

**Method A: Via Dashboard (Recommended)**

1. Go to **Settings** (gear icon)
2. Click **Upload** tab
3. Scroll to **Upload presets** section
4. Look for preset named `nooshdb`
   - If it exists, click **Edit**
   - If not, click **Add upload preset**

5. **Configure the preset:**
   ```
   Preset name: nooshdb
   Signing mode: Unsigned ⭐ IMPORTANT!
   Folder: (leave empty or set to "ecommerce")
   Use filename or externally defined Public ID: ✓ (checked)
   Unique filename: ✓ (checked)
   Overwrite: ✗ (unchecked)
   ```

6. Click **Save**

**Method B: Via API (Alternative)**

```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/nooshdb/upload_presets \
  -u "286975485855137:ZtlfiZogr9pKv78uiwc9mivRhl8" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "nooshdb",
    "unsigned": true,
    "folder": "ecommerce"
  }'
```

#### 4. Test Upload Preset

Open the test file we created:
```bash
start client/tmp_rovodev_test_upload.html
```

Or create a quick test:

```html
<!-- Save as test_cloudinary.html and open in browser -->
<!DOCTYPE html>
<html>
<body>
<input type="file" id="fileInput" accept="image/*">
<button onclick="testUpload()">Test Upload</button>
<div id="result"></div>

<script>
async function testUpload() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return alert('Select a file first');
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'nooshdb');
  
  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/nooshdb/image/upload',
      { method: 'POST', body: formData }
    );
    
    const data = await response.json();
    
    if (response.ok) {
      document.getElementById('result').innerHTML = 
        '✅ SUCCESS!<br>URL: ' + data.secure_url;
    } else {
      document.getElementById('result').innerHTML = 
        '❌ ERROR: ' + JSON.stringify(data.error);
    }
  } catch (error) {
    document.getElementById('result').innerHTML = 
      '❌ ERROR: ' + error.message;
  }
}
</script>
</body>
</html>
```

---

## 🔍 Troubleshooting

### If Cloudinary still shows 401:

**Check 1: Verify cloud name is correct**
```bash
# In client/.env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=nooshdb  # Must match your account
```

**Check 2: Ensure preset is UNSIGNED**
- In Cloudinary dashboard → Settings → Upload → Upload presets
- Click on `nooshdb` preset
- **Signing mode MUST be "Unsigned"**

**Check 3: Clear browser cache**
```
Ctrl+Shift+Delete → Clear cached images and files
```

**Check 4: Check Cloudinary account status**
- Make sure your Cloudinary account is active
- Check if you've hit any usage limits (unlikely on free tier)

### If Backend still shows 404:

**Check 1: Backend is deployed**
```bash
curl https://noosh-tuft-backend.vercel.app/
```
Should return something, not 404

**Check 2: Check Vercel logs**
- Go to Vercel Dashboard → Your Backend Project → Deployments
- Click latest deployment → View Function Logs
- Look for errors

**Check 3: Database connection**
- Verify `DATABASE_URL` is set in Vercel
- Test if database is accessible from Vercel

**Check 4: CORS settings**
Make sure `server/api/main.py` has correct CORS:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://noosh-tuft.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚀 Quick Fix Commands

### For Local Development:

```bash
# Terminal 1 - Start Backend
cd server
python -m uvicorn api.main:app --reload

# Terminal 2 - Start Frontend (update .env.local to use localhost)
cd client
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

### For Production:

```bash
# Redeploy backend
cd server
vercel --prod

# Redeploy frontend
cd client
vercel --prod
```

---

## 📝 Checklist

- [ ] Cloudinary preset `nooshdb` created
- [ ] Preset signing mode is **UNSIGNED**
- [ ] Cloud name is correct (`nooshdb`)
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Frontend environment variables set
- [ ] CORS configured correctly
- [ ] Tested image upload (no 401 error)
- [ ] Tested API endpoints (no 404 error)

---

## 💡 Key Points

1. **Cloudinary 401 = Preset not unsigned** - This is the #1 cause
2. **Backend 404 = Not deployed or wrong URL** - Check Vercel deployment
3. **Always redeploy after changing environment variables**
4. **Test locally first before deploying to production**

---

## 🆘 Still Having Issues?

If errors persist:

1. **Test locally first:**
   - Use `http://localhost:8000` for backend
   - Use `http://localhost:3000` for frontend
   - This eliminates deployment issues

2. **Check browser console:**
   - F12 → Console tab
   - Network tab shows exact requests/responses

3. **Verify Cloudinary account:**
   - Login to Cloudinary dashboard
   - Check account status and limits

4. **Share specific error messages:**
   - Full error from browser console
   - Backend logs from Vercel
   - Exact steps to reproduce

---

**Most Common Fix:** Just make sure the Cloudinary upload preset is set to **"Unsigned"** mode! 🎯
