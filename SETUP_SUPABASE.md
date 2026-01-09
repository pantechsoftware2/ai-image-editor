# Supabase Setup Guide

## Your current Supabase project seems to be unavailable

The URL `https://brqqifiyajnukjdbgaeg.supabase.co` is not resolving. This usually means:
- The project was paused (free tier auto-pauses after inactivity)
- The project was deleted
- The URL is incorrect

## Quick Fix (5 minutes)

### Step 1: Go to Supabase Dashboard
Visit: https://supabase.com/dashboard

### Step 2: Check existing project OR create new one

**If you see project `brqqifiyajnukjdbgaeg`:**
- Click on it
- If it says "Paused", click **"Restore Project"**
- Wait 1-2 minutes for it to wake up
- Skip to Step 4

**If you don't see it (or want a fresh start):**
- Click **"New Project"**
- Name: `vizly-ai-editor`
- Database Password: (choose a strong password)
- Region: Choose closest to you
- Click **"Create new project"**
- Wait 1-2 minutes for setup

### Step 3: Copy your new credentials

Once project is ready:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (another long string)

### Step 4: Update .env.local

Replace the values in `/Users/namanpandey/ai-image-editor/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_NEW_PROJECT_URL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ_YOUR_NEW_ANON_KEY...
SUPABASE_SERVICE_ROLE_KEY=eyJ_YOUR_NEW_SERVICE_ROLE_KEY...
```

### Step 5: Setup Database Tables

In Supabase Dashboard:
1. Go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste from `/docs/database.sql`
4. Click **"Run"**

### Step 6: Enable Google OAuth (Optional)

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google**
3. Add your Google OAuth credentials from Google Cloud Console
4. Add authorized redirect URL: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

### Step 7: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

Now try logging in again!

## Alternative: Skip Authentication for Testing

If you just want to test image generation without auth:
- Go directly to `/editor` route
- You can test the canvas and image generation
- Auth is only needed for saving projects
