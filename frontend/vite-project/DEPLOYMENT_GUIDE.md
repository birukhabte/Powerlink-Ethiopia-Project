# Frontend Deployment Guide

## Prerequisites
- Backend deployed on Supabase
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier available)

## Step 1: Update Environment Variables

Before deploying, you need to set your production API URL.

### Local Development
The app uses `.env.local` for local development:
```
VITE_API_URL=http://localhost:5000
```

### Production
You'll set the production URL in Vercel's dashboard:
```
VITE_API_URL=https://your-supabase-backend-url.supabase.co
```

## Step 2: Test Build Locally

Before deploying, test the production build:

```bash
cd frontend/vite-project
npm run build
npm run preview
```

This will:
1. Create an optimized production build in the `dist` folder
2. Start a local server to preview the production build

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend/vite-project`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Supabase backend URL (e.g., `https://your-project.supabase.co`)
6. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend/vite-project

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? (accept default or customize)
# - Directory? ./
# - Override settings? No

# After deployment, set environment variable
vercel env add VITE_API_URL
# Enter your Supabase backend URL when prompted

# Redeploy with environment variable
vercel --prod
```

## Step 4: Update Backend CORS

After deployment, update your backend CORS settings to allow requests from your Vercel domain.

In your `backend/server.js`, add your Vercel URL to allowed origins:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://your-app-name.vercel.app',  // Add this
];
```

Redeploy your backend after this change.

## Step 5: Verify Deployment

1. Visit your Vercel URL
2. Test key features:
   - User login/registration
   - Service request submission
   - File uploads
   - Admin dashboard
   - Announcements

## Alternative Deployment Options

### Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure:
   - **Base directory**: `frontend/vite-project`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/vite-project/dist`
5. Add environment variable `VITE_API_URL`
6. Deploy

### AWS S3 + CloudFront

```bash
# Build the app
npm run build

# Install AWS CLI
# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Upload build files
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure bucket for static website hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html

# Set up CloudFront distribution (optional, for CDN)
```

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Verify Node.js version (should be 18+)
- Check for TypeScript/ESLint errors: `npm run lint`

### API Calls Fail
- Verify `VITE_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend CORS includes your frontend domain

### Environment Variables Not Working
- Environment variables must start with `VITE_`
- Rebuild after changing environment variables
- In Vercel, redeploy after adding/changing env vars

### 404 on Page Refresh
- Ensure `vercel.json` rewrites are configured
- For other platforms, configure SPA fallback to `index.html`

## Monitoring

After deployment:
- Monitor Vercel Analytics for performance
- Check browser console for errors
- Test all user flows
- Monitor API response times

## Continuous Deployment

Once connected to Git:
- Push to main branch → automatic production deployment
- Push to other branches → automatic preview deployments
- Each PR gets its own preview URL

## Custom Domain (Optional)

In Vercel dashboard:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## Cost Considerations

### Vercel Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Preview deployments
- Analytics

### Paid Plans Start at $20/month for:
- More bandwidth
- Team collaboration
- Advanced analytics
- Password protection

## Next Steps

1. Set up monitoring and error tracking (e.g., Sentry)
2. Configure custom domain
3. Set up staging environment
4. Implement CI/CD pipeline
5. Add performance monitoring
