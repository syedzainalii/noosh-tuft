# 🔧 Fix Cloudinary Upload Preset - CRITICAL!

## ⚠️ Current Error

```
Error uploading to Cloudinary: Error: Unknown API key
401 (Unauthorized)
```

**Cause:** Your Cloudinary upload preset `nooshdb` is NOT set to **"Unsigned"** mode.

---

## ✅ Solution: Set Upload Preset to Unsigned

### Step 1: Login to Cloudinary

Go to: **https://cloudinary.com/console**

### Step 2: Navigate to Upload Presets

1. Click **Settings** (gear icon in top-right)
2. Click **Upload** tab
3. Scroll down to **Upload presets** section

### Step 3: Find or Create Preset

**Option A: If preset `nooshdb` exists:**
1. Find the preset named `nooshdb` in the list
2. Click **Edit** (pencil icon)

**Option B: If preset doesn't exist:**
1. Click **Add upload preset**
2. Set **Preset name**: `nooshdb`

### Step 4: Configure as Unsigned ⭐

This is the CRITICAL step:

1. **Signing Mode**: Change to **"Unsigned"**
2. **Folder**: Set to `ecommerce` (optional but recommended)
3. **Use filename or externally defined Public ID**: Check this if you want
4. Click **Save**

### Step 5: Verify Settings

Your preset should show:
- ✅ **Name**: `nooshdb`
- ✅ **Signing Mode**: **Unsigned** (in green)
- ✅ **Folder**: `ecommerce` (optional)

---

## 📸 Visual Guide

### What "Unsigned" Looks Like:

```
Upload preset name: nooshdb
Signing mode: [Unsigned] ← Must show "Unsigned" in GREEN
Folder: ecommerce
```

### Common Mistake:

```
Signing mode: [Signed] ← WRONG! This causes "Unknown API key" error
```

---

## 🧪 Test After Fixing

1. Save the preset as "Unsigned"
2. Go to your frontend application
3. Try uploading an image (e.g., create a category)
4. Check browser console:
   ```
   ✅ Image uploaded to Cloudinary: https://res.cloudinary.com/nooshdb/image/upload/...
   ```

---

## ❓ Why Unsigned?

**Unsigned uploads** allow direct uploads from the browser without exposing API credentials.

- **Signed uploads**: Require API key + signature (backend needed)
- **Unsigned uploads**: No API key needed (frontend-only) ✅

Since we removed Cloudinary from the backend, we MUST use unsigned uploads.

---

## 🆘 Still Getting 401 Error?

### Double-check these:

1. **Preset name matches exactly**: `nooshdb` (case-sensitive)
2. **Signing mode is Unsigned**: Should show in GREEN
3. **Frontend env vars are correct**:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=nooshdb
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nooshdb
   ```
4. **Clear browser cache** and try again

### Test with cURL:

```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/nooshdb/image/upload \
  -F "upload_preset=nooshdb" \
  -F "file=@/path/to/test-image.jpg"
```

If preset is unsigned, this should return a successful response with `secure_url`.

---

## 📚 Related Documentation

- **Cloudinary Upload Presets**: https://cloudinary.com/documentation/upload_presets
- **Unsigned Uploads**: https://cloudinary.com/documentation/upload_images#unsigned_upload

---

**After fixing this, image uploads will work perfectly!** 🎉
