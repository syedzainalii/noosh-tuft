# Vercel Deployment Guide

## Issues Fixed

### 1. Import Path Issues in `server/api/main.py`
When you moved `main.py` to `server/api/main.py`, the imports couldn't find the modules (`database`, `routers`, `models`, etc.) because they were looking in the wrong directory.

**Solution:** Added Python path adjustment at the top of `main.py` to include the parent directory.

### 2. CORS Configuration
The backend wasn't configured to accept requests from your Vercel frontend URL.

**Solution:** Added `https://noosh-tuft.vercel.app` to the allowed origins in CORS middleware.

## Environment Variables Setup

### Backend (https://noosh-tuft-backend.vercel.app/)

You need to configure these environment variables in your Vercel project settings:

```bash
# Database (REQUIRED - use a PostgreSQL database)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Settings (REQUIRED)
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Frontend URL (REQUIRED)
FRONTEND_URL=https://noosh-tuft.vercel.app

# Admin Credentials (REQUIRED)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-admin-password

# Email Settings (REQUIRED for email verification)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_FROM=noreply@yourdomain.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=Your Store Name

# Redis (OPTIONAL - can be omitted if not using caching)
REDIS_URL=redis://your-redis-url:6379
```

### Frontend (https://noosh-tuft.vercel.app/)

You need to configure this environment variable in your Vercel frontend project:

```bash
NEXT_PUBLIC_API_URL=https://noosh-tuft-backend.vercel.app
```

## Database Setup

**CRITICAL:** You need a PostgreSQL database for your backend. Vercel doesn't provide a database, so you need to use an external service:

### Recommended Database Providers:
1. **Vercel Postgres** (easiest integration)
   - Go to your Vercel project → Storage → Create Database → Postgres
   - Automatically adds DATABASE_URL to your environment variables

2. **Supabase** (free tier available)
   - Create account at https://supabase.com
   - Create a new project
   - Get the connection string from Settings → Database

3. **Railway** (free tier available)
   - Create account at https://railway.app
   - Provision a PostgreSQL database
   - Get the connection string

4. **Neon** (free tier available)
   - Create account at https://neon.tech
   - Create a database
   - Get the connection string

## Deployment Steps

### 1. Set Environment Variables
- Go to your Vercel backend project settings
- Navigate to "Environment Variables"
- Add all the required variables listed above
- **Redeploy** your backend after adding variables

### 2. Update Frontend Environment
- Go to your Vercel frontend project settings
- Add `NEXT_PUBLIC_API_URL=https://noosh-tuft-backend.vercel.app`
- **Redeploy** your frontend

### 3. Test the Connection
After redeploying both projects:
1. Visit https://noosh-tuft-backend.vercel.app/health - should return `{"status":"healthy"}`
2. Visit https://noosh-tuft-backend.vercel.app/docs - should show the API documentation
3. Try logging in with your admin credentials on the frontend

## Troubleshooting

### Login Still Fails After Deployment?

1. **Check Backend Logs:**
   - Go to Vercel → Your backend project → Deployments
   - Click on the latest deployment → Functions tab
   - Check the logs for errors

2. **Verify Environment Variables:**
   - Make sure DATABASE_URL is set correctly
   - Ensure SECRET_KEY is set
   - Confirm FRONTEND_URL matches your frontend domain

3. **Database Connection:**
   - Verify your database is accessible from Vercel
   - Check if the database URL has the correct format
   - Some databases require SSL: `postgresql://user:pass@host:port/db?sslmode=require`

4. **Check Browser Console:**
   - Open Developer Tools (F12) on your frontend
   - Look for CORS errors or failed API requests
   - Check the Network tab to see the actual API response

### Common Issues:

**Issue:** "Network Error" or "Failed to fetch"
- **Solution:** Check if backend is deployed and NEXT_PUBLIC_API_URL is set correctly

**Issue:** "CORS policy error"
- **Solution:** Already fixed in the code, but make sure to redeploy the backend

**Issue:** "Database connection failed"
- **Solution:** Verify DATABASE_URL is correct and the database is accessible

**Issue:** "Email sending failed"
- **Solution:** This won't prevent login, but verify email settings if you need verification emails

## Next Steps

1. **Deploy the changes:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment imports and CORS"
   git push
   ```

2. **Set up database** (if not already done)

3. **Configure environment variables** in Vercel dashboard

4. **Test the deployment**

## Notes

- The admin user is created automatically on first startup
- Make sure to use strong passwords in production
- Consider using a managed database service for better reliability
- Monitor your Vercel function logs for any issues
