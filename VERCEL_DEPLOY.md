# 🚀 Deploy to Vercel - Complete Instructions

## Prerequisites Checklist

Before deploying, verify you have:

```
☑ GitHub account (github.com)
☑ Vercel account (vercel.com) - free tier available
☑ Supabase project created (supabase.com)
☑ Project folder: c:\Users\pante\Downloads\ai-image-editor
☑ Git initialized (cd ai-image-editor && git init)
```

## Step 1: Prepare Your GitHub Repository

### Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create new repository:
   - Name: `ai-image-editor`
   - Description: "AI-powered image editor with Next.js and Supabase"
   - Visibility: Public (or Private)
   - Click "Create repository"
3. Copy the HTTPS URL from GitHub

### Push Code to GitHub

```bash
cd c:\Users\pante\Downloads\ai-image-editor

# Initialize git (if not already done)
git init

# Configure git user
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Vizly AI Image Editor"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/ai-image-editor.git

# Change branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 2: Configure Supabase

### Create Tables

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click "New query"
5. Copy entire content of `docs/database.sql`
6. Paste into the SQL Editor
7. Click "Run" button
8. Verify success (check for no errors)

### Configure OAuth (Google)

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find and click **Google**
3. Enable the provider
4. Paste Google OAuth credentials:
   - Client ID: [from Google Cloud Console]
   - Client Secret: [from Google Cloud Console]
5. Click "Save"

### Verify Environment Variables

Check that you have these credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://brqqifiyajnukjdbgaeg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PSz1alDUqf9Ajw0FYsBlPA_anBGIdTZ
SUPABASE_SERVICE_KEY=sb_secret_eTxedm5J43EBfP2cF_nRwg_rTwKilyK
```

These are already in your `.env.local` file.

## Step 3: Deploy to Vercel

### Option A: Via Vercel Web Dashboard (RECOMMENDED)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Paste your GitHub URL:
   ```
   https://github.com/YOUR_USERNAME/ai-image-editor
   ```
4. Click **"Import"**

### Configure Vercel Project

On the next screen:

1. **Project Name**: `ai-image-editor` (or custom name)
2. **Framework Preset**: Next.js (auto-selected)
3. **Root Directory**: `./` (default)

### Add Environment Variables

1. Scroll down to **Environment Variables**
2. Click **"Add"** for each variable:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://brqqifiyajnukjdbgaeg.supabase.co`
   - Click **"Add"**

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `sb_publishable_PSz1alDUqf9Ajw0FYsBlPA_anBGIdTZ`
   - Click **"Add"**

   **Variable 3:**
   - Name: `SUPABASE_SERVICE_KEY`
   - Value: `sb_secret_eTxedm5J43EBfP2cF_nRwg_rTwKilyK`
   - Click **"Add"**

3. Click **"Deploy"** button

### Wait for Deployment

- Build progress displayed in real-time
- Usually takes 2-3 minutes
- Green checkmark when complete
- You'll see: "Congratulations! Your project has been successfully deployed"

## Step 4: Get Your Vercel URL

After deployment completes:

1. Click **"Visit"** button, or
2. Your URL will be: `https://ai-image-editor-xxx.vercel.app`
3. Bookmark this URL!

## Step 5: Update Supabase Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **Authentication** → **URL Configuration**
3. Scroll to **Authorized redirect URLs**
4. Add your Vercel URL:
   - `https://ai-image-editor-xxx.vercel.app/auth/callback`
   - `https://ai-image-editor-xxx.vercel.app/login`
5. Click **"Save"**

## Step 6: Test Your Deployment

### Test Landing Page
1. Visit `https://ai-image-editor-xxx.vercel.app`
2. Verify:
   - ✅ Logo "Vizly" appears
   - ✅ Magic Input visible
   - ✅ Sign In / Sign Up buttons in header
   - ✅ Features section displayed
   - ✅ No console errors

### Test Email Signup
1. Click "Sign Up"
2. Enter:
   - Email: `test@example.com`
   - Password: `TestPass123!`
3. Click "Sign Up"
4. Should redirect to `/dashboard`
5. Should see: "Welcome back! test@example.com"

### Test Email Login
1. Go to `/login`
2. Enter same credentials
3. Click "Sign In"
4. Should redirect to `/dashboard`

### Test Google OAuth
1. Click "Google Sign In"
2. You'll be redirected to Google login
3. After approval, should return to app
4. Should be logged in to `/dashboard`

## Option B: Via Vercel CLI (ALTERNATIVE)

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd c:\Users\pante\Downloads\ai-image-editor
vercel

# Follow prompts:
# - Link to existing project? (No)
# - Set project name: ai-image-editor
# - Directory: ./
# - Modify settings? (No)

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY

# Deploy to production
vercel --prod
```

## Troubleshooting Deployment

### Build Failed

**Error**: "Build failed"
- Check build logs in Vercel dashboard
- Common issue: Missing dependencies
- Solution: `npm install` locally, then `git push`

### Auth Not Working

**Error**: "Callback URL mismatch"
- Update Supabase URL Configuration
- Add your exact Vercel URL
- Wait 5 minutes for changes to apply

### Database Connection Error

**Error**: "Failed to connect to Supabase"
- Verify environment variables in Vercel dashboard
- Check Supabase project is active
- Test credentials in `.env.local` locally first

### Slow Loading

**Issue**: Page takes too long to load
- Check Vercel logs for errors
- Verify Supabase isn't down
- Clear browser cache and refresh

## Verify Deployment Success

Run this checklist:

```
Landing Page (/):
☑ Page loads
☑ Logo visible
☑ Magic Input visible
☑ Features section visible
☑ Sign In button works
☑ Sign Up button works

Auth Pages:
☑ /login page loads
☑ /signup page loads
☑ Email inputs accept text
☑ Password inputs accept text

Protected Pages:
☑ /dashboard redirects to login if not authenticated
☑ /editor redirects to login if not authenticated

Authentication:
☑ Can sign up with email
☑ Can log in with email
☑ Can log in with Google
☑ Session persists after refresh
☑ Sign out works

Database:
☑ No console errors
☑ Profile created in Supabase
☑ RLS policies working
```

## Next Steps

1. ✅ App is live on Vercel
2. 🎨 Customize branding (change colors, logo, etc.)
3. 🤖 Integrate Vertex AI APIs
4. 📧 Set up email notifications
5. 📊 Configure analytics
6. 🔒 Enable rate limiting
7. 📱 Test on mobile devices

## Monitoring Your App

### Vercel Dashboard
- **Analytics**: Real-time traffic
- **Deployments**: View history
- **Logs**: Debug issues
- **Settings**: Configure domain

### Supabase Dashboard
- **Database**: Monitor queries
- **Auth**: View login attempts
- **Usage**: Check limits
- **Logs**: Debug database issues

## Custom Domain (Optional)

To use your own domain:

1. Go to Vercel project settings
2. Click **"Domains"**
3. Enter your domain
4. Follow DNS instructions
5. Update Supabase URLs with custom domain

## Update Supabase Redirect URLs for Custom Domain

1. Supabase Dashboard → Authentication → URL Configuration
2. Update redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com/login`
3. Save

## Helpful Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Support

If deployment fails:

1. Check [Vercel Status](https://www.vercel-status.com/)
2. Check [Supabase Status](https://status.supabase.com/)
3. Review error logs in Vercel dashboard
4. Check browser console (F12)
5. Verify environment variables

## Success! 🎉

Your Vizly app is now live on Vercel!

**Share your URL with friends and start using AI image generation!**

---

**Deployment Guide Version**: 1.0
**Last Updated**: January 6, 2026
**Expected Deployment Time**: 5-10 minutes
