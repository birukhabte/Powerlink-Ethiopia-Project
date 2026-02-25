# Quick Deploy Guide - 5 Minutes ⚡

## Prerequisites
- ✅ Backend deployed on Supabase
- ✅ Git repository
- ✅ Supabase backend URL

## Deploy to Vercel (Recommended)

### 1. Push to Git (1 min)
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### 2. Deploy (2 min)
1. Go to **https://vercel.com**
2. Click **"Add New Project"**
3. **Import** your repository
4. Set **Root Directory**: `frontend/vite-project`
5. Add **Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: Your Supabase URL
6. Click **"Deploy"**

### 3. Update Backend CORS (1 min)
In `backend/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app.vercel.app',  // Add this
];
```

### 4. Test (1 min)
Visit your Vercel URL and test login!

## Done! 🎉

Your app is live at: `https://your-app.vercel.app`

---

## Need Help?
- Detailed guide: `DEPLOYMENT_GUIDE.md`
- Step-by-step: `DEPLOYMENT_CHECKLIST.md`
- Vercel docs: https://vercel.com/docs

## Common Issues

**API calls fail?**
→ Check `VITE_API_URL` in Vercel environment variables

**CORS errors?**
→ Add Vercel URL to backend `allowedOrigins`

**404 on refresh?**
→ Already fixed in `vercel.json` ✅

## Alternative: Netlify

1. Go to **https://netlify.com**
2. **"Add new site"** → Import from Git
3. Set **Base directory**: `frontend/vite-project`
4. Set **Build command**: `npm run build`
5. Set **Publish directory**: `frontend/vite-project/dist`
6. Add environment variable: `VITE_API_URL`
7. Deploy!

## Test Locally First

```bash
cd frontend/vite-project
npm run build
npm run preview
```

Visit http://localhost:4173

---

**That's it! Your frontend is deployed and ready to use! 🚀**
