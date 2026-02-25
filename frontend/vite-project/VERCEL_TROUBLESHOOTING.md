# Vercel 404 Error - Troubleshooting Guide

## Quick Fix Steps

### Step 1: Check Root Directory Setting

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. Set it to: `frontend/vite-project`
6. Click **Save**
7. Go to **Deployments** tab
8. Click the **three dots** on the latest deployment
9. Click **Redeploy**

### Step 2: Verify Build Settings

In Vercel project settings:

**Build & Development Settings:**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Check Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Make sure you have:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Supabase backend URL
   - **Environment**: Production (checked)

### Step 4: Manual Redeploy

If the above doesn't work:

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Check **Use existing Build Cache** is UNCHECKED
4. Click **Redeploy**

---

## Common Issues & Solutions

### Issue 1: "404: NOT_FOUND" on Homepage

**Cause**: Root directory not set correctly

**Solution**:
```
Settings → General → Root Directory → frontend/vite-project
```

### Issue 2: Build Fails

**Check the build logs in Vercel:**

1. Go to **Deployments**
2. Click on the failed deployment
3. Check the **Build Logs**

**Common build errors:**

#### Error: "Cannot find module"
```bash
# Solution: Clear cache and rebuild
Settings → General → Clear Build Cache
Then redeploy
```

#### Error: "npm ERR! code ENOENT"
```bash
# Solution: Verify package.json exists in frontend/vite-project
# Root Directory must be: frontend/vite-project
```

### Issue 3: 404 on Page Refresh

**Cause**: SPA routing not configured

**Solution**: Already fixed in `vercel.json` ✅

### Issue 4: Blank Page (No 404)

**Cause**: Build succeeded but app has runtime errors

**Solution**:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Common issues:
   - Missing environment variables
   - API endpoint errors
   - CORS issues

---

## Verify Your Vercel Configuration

### Check vercel.json

Your `vercel.json` should look like this:

```json
{
  "version": 2,
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

### Check package.json

Verify your build script exists:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## Alternative: Deploy from Vercel CLI

If dashboard deployment isn't working, try CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend/vite-project

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? Yes (select your project)
# - Deploy? Yes
```

---

## Check Deployment Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Check the logs for errors

**Look for:**
- ✅ "Build Completed"
- ✅ "Deployment Ready"
- ❌ Any error messages

---

## Test Build Locally First

Before redeploying, test locally:

```bash
cd frontend/vite-project

# Install dependencies
npm install

# Build for production
npm run build

# Preview the build
npm run preview
```

Visit http://localhost:4173 - if this works, the build is fine.

---

## Vercel Project Structure

Your repository structure should be:

```
PowerLink-Ethiopia/              ← Repository root
├── backend/
├── frontend/
│   └── vite-project/           ← Root Directory in Vercel
│       ├── package.json
│       ├── vite.config.js
│       ├── vercel.json
│       ├── src/
│       └── dist/               ← Build output
└── README.md
```

**Important**: Set Root Directory to `frontend/vite-project`, NOT `frontend`

---

## Still Not Working?

### Option 1: Create New Vercel Project

1. Delete the current Vercel project
2. Create a new one
3. Import your repository again
4. Set Root Directory: `frontend/vite-project`
5. Add environment variables
6. Deploy

### Option 2: Deploy from Different Branch

1. Create a new branch: `git checkout -b deploy`
2. Push to GitHub: `git push origin deploy`
3. In Vercel, change deployment branch to `deploy`
4. Redeploy

### Option 3: Use Netlify Instead

If Vercel continues to have issues:

1. Go to https://netlify.com
2. Import your repository
3. Set:
   - **Base directory**: `frontend/vite-project`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/vite-project/dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

---

## Contact Support

If none of these work:

1. **Vercel Support**: https://vercel.com/support
2. **Share your deployment URL** and build logs
3. **Check Vercel Status**: https://www.vercel-status.com/

---

## Quick Checklist

- [ ] Root Directory set to `frontend/vite-project`
- [ ] Build Command is `npm run build`
- [ ] Output Directory is `dist`
- [ ] Environment variable `VITE_API_URL` is set
- [ ] vercel.json exists in frontend/vite-project
- [ ] package.json exists in frontend/vite-project
- [ ] Build succeeds locally (`npm run build`)
- [ ] Preview works locally (`npm run preview`)
- [ ] Cleared Vercel build cache
- [ ] Redeployed after changes

---

## Success Indicators

Your deployment is successful when:

✅ Build logs show "Build Completed"
✅ Deployment shows "Ready"
✅ Visiting your URL shows the app (not 404)
✅ No console errors in browser
✅ Can navigate between pages

---

**Need more help?** Share your:
1. Vercel deployment URL
2. Build logs (from Vercel dashboard)
3. Any error messages you see
