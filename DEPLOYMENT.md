# 🚀 Vizly Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. ✅ GitHub account
2. ✅ Vercel account (free tier available)
3. ✅ Supabase project created and configured
4. ✅ Environment variables prepared

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Vizly AI Image Editor"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/ai-image-editor.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Verify Environment Variables

Ensure `.env.local` contains:

```
NEXT_PUBLIC_SUPABASE_URL=https://brqqifiyajnukjdbgaeg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PSz1alDUqf9Ajw0FYsBlPA_anBGIdTZ
SUPABASE_SERVICE_KEY=sb_secret_eTxedm5J43EBfP2cF_nRwg_rTwKilyK
```

### 3. Create Database Tables

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Create new query
5. Copy content from `docs/database.sql`
6. Execute the SQL

### 4. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository
4. Click **Import**

#### Configure Project

1. **Environment Variables**:
   - Click **Environment Variables**
   - Add all variables from your `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_KEY`

2. **Build Settings**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Click Deploy**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables when prompted
# Or use:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY

# Deploy to production
vercel --prod
```

### 5. Configure Supabase for Production

#### Enable Google OAuth

1. Go to Supabase Dashboard
2. Authentication → Providers
3. Click **Google**
4. Enable the provider
5. Add your Google OAuth credentials:
   - Client ID
   - Client Secret

#### Update Redirect URLs

1. Go to Authentication → URL Configuration
2. Add your Vercel URL to **Authorized redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/login`

#### Enable RLS

All tables should have RLS enabled (set up via `database.sql`)

### 6. Test Production Deployment

1. Go to your Vercel deployment URL
2. Test landing page
3. Try signing up with email
4. Try signing up with Google
5. Verify you can access dashboard

### 7. Custom Domain (Optional)

1. Go to Vercel project settings
2. Click **Domains**
3. Add your custom domain
4. Follow DNS configuration steps
5. Update Supabase redirect URLs with custom domain

## Monitoring & Logs

### Vercel Dashboard

- **Analytics**: Real-time request metrics
- **Logs**: Edge and function logs
- **Deployments**: View all deployment history
- **Environment**: Manage variables

### Supabase Dashboard

- **Database**: Query performance and activity
- **Authentication**: User and auth logs
- **Storage**: File usage
- **Real-time**: Connection status

## Troubleshooting

### Build Fails on Vercel

**Error**: "Type error in auth-context.tsx"
- Ensure `@supabase/ssr` is installed
- Check Node.js version (18+)

**Solution**:
```bash
npm install @supabase/ssr
git push
```

### Authentication Not Working

**Issue**: OAuth doesn't redirect properly
1. Check Vercel deployment URL
2. Update Supabase redirect URLs
3. Verify Google OAuth credentials

**Solution**:
```
Supabase → Authentication → URL Configuration
Add: https://your-app.vercel.app/auth/callback
```

### Database Connection Error

**Issue**: "Failed to connect to Supabase"
1. Verify environment variables in Vercel
2. Check Supabase project is active
3. Test with Supabase SQL Editor

**Solution**:
```
Vercel Settings → Environment Variables
Ensure all SUPABASE_ variables are set correctly
```

### CORS Errors

**Issue**: Frontend can't reach Supabase
1. Check environment variables
2. Verify Supabase URL is correct
3. Check browser console for error details

**Solution**:
- CORS is handled by Supabase
- Ensure you're using the correct URL
- Verify credentials haven't changed

## Performance Tips

1. **Enable Caching**:
   - Vercel automatically caches static content
   - Set `revalidate` for ISR pages

2. **Database Optimization**:
   - Indexes are created by `database.sql`
   - Use appropriate query patterns
   - Monitor slow queries in Supabase

3. **Image Optimization**:
   - Use Next.js Image component
   - Optimize images before upload
   - Set appropriate sizes

## Security Checklist

- ✅ Environment variables not in code
- ✅ RLS enabled on all tables
- ✅ CORS properly configured
- ✅ HTTPS enforced
- ✅ Service key not exposed to client
- ✅ Rate limiting configured (optional)

## Next Steps

1. ✅ App deployed on Vercel
2. 🔄 Set up CI/CD with GitHub Actions
3. 🤖 Integrate Vertex AI APIs
4. 📧 Set up email notifications
5. 📊 Configure analytics

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Hosting](https://supabase.com/docs/guides/hosting)
- [GitHub Actions](https://docs.github.com/en/actions)

## Support

For deployment issues:
1. Check [Vercel Status](https://www.vercel-status.com/)
2. Check [Supabase Status](https://status.supabase.com/)
3. Review error logs in Vercel dashboard
4. Check Supabase dashboard for alerts

---

**Your app is now live on Vercel! 🎉**
