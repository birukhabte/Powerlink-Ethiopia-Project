# Frontend Deployment Checklist

## Pre-Deployment

- [ ] All API endpoints updated to use centralized config (`src/config/api.js`)
- [ ] Backend deployed and accessible on Supabase
- [ ] Backend URL noted (e.g., `https://your-project.supabase.co`)
- [ ] Code committed to Git repository
- [ ] Local build tested successfully (`npm run build && npm run preview`)

## Vercel Deployment Steps

### 1. Initial Setup
- [ ] Create Vercel account at [vercel.com](https://vercel.com)
- [ ] Connect Git repository (GitHub/GitLab/Bitbucket)

### 2. Project Configuration
- [ ] Import project in Vercel
- [ ] Set root directory: `frontend/vite-project`
- [ ] Framework preset: Vite (auto-detected)
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### 3. Environment Variables
- [ ] Add `VITE_API_URL` environment variable
- [ ] Set value to your Supabase backend URL
- [ ] Example: `https://your-project.supabase.co`

### 4. Deploy
- [ ] Click "Deploy" button
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Note your deployment URL (e.g., `https://your-app.vercel.app`)

## Post-Deployment

### 5. Update Backend CORS
- [ ] Open `backend/server.js`
- [ ] Add Vercel URL to `allowedOrigins` array:
  ```javascript
  const allowedOrigins = [
    'http://localhost:5173',
    'https://your-app.vercel.app',  // Add this
  ];
  ```
- [ ] Redeploy backend to Supabase

### 6. Testing
- [ ] Visit deployed URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test service request submission
- [ ] Test file uploads
- [ ] Test admin features
- [ ] Test announcements
- [ ] Test all user roles (Customer, Admin, Supervisor, Technician)
- [ ] Check browser console for errors
- [ ] Test on mobile devices

### 7. Monitoring
- [ ] Check Vercel deployment logs
- [ ] Monitor Vercel Analytics
- [ ] Set up error tracking (optional: Sentry)
- [ ] Monitor API response times

## Common Issues & Solutions

### Issue: API calls return 404
**Solution**: Verify `VITE_API_URL` is set correctly in Vercel environment variables

### Issue: CORS errors
**Solution**: Ensure backend CORS includes your Vercel domain

### Issue: Page refresh returns 404
**Solution**: Verify `vercel.json` rewrites are configured (already done)

### Issue: Environment variables not working
**Solution**: 
- Ensure variable name starts with `VITE_`
- Redeploy after adding/changing environment variables

### Issue: Build fails
**Solution**:
- Check Node.js version (18+)
- Run `npm install` to ensure all dependencies are installed
- Check for linting errors: `npm run lint`

## Optional Enhancements

- [ ] Set up custom domain
- [ ] Configure staging environment
- [ ] Set up preview deployments for PRs
- [ ] Add performance monitoring
- [ ] Configure analytics
- [ ] Set up automated testing
- [ ] Add SSL certificate (automatic with Vercel)

## Rollback Plan

If deployment fails:
1. Check Vercel deployment logs for errors
2. Revert to previous deployment in Vercel dashboard
3. Fix issues locally
4. Test build locally before redeploying
5. Redeploy when ready

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Vite Documentation: https://vitejs.dev/guide/
- Supabase Documentation: https://supabase.com/docs

## Deployment Complete! 🎉

Once all items are checked:
- Your frontend is live and accessible
- Users can access the application
- All features are working correctly
- Backend and frontend are properly connected
