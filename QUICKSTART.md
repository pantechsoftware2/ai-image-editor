# Quick Start Guide

## 🎯 Getting Started with Vizly

### Step 1: Clone & Install
```bash
cd ai-image-editor
npm install
```

### Step 2: Set Environment Variables
Create `.env.local` with your credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://brqqifiyajnukjdbgaeg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PSz1alDUqf9Ajw0FYsBlPA_anBGIdTZ
SUPABASE_SERVICE_KEY=sb_secret_eTxedm5J43EBfP2cF_nRwg_rTwKilyK
```

### Step 3: Set Up Database
1. Log in to [Supabase](https://supabase.com)
2. Go to SQL Editor
3. Run the SQL from `docs/database.sql`

### Step 4: Run Locally
```bash
npm run dev
# Visit http://localhost:3000
```

### Step 5: Deploy to Vercel
```bash
git add .
git commit -m "Initial commit"
git push origin main

# Go to vercel.com
# Import your GitHub repository
# Add environment variables
# Click Deploy!
```

## 🔗 Key URLs

- **Landing Page**: `/`
- **Login**: `/login`
- **Sign Up**: `/signup`
- **Dashboard**: `/dashboard` (protected)
- **Editor**: `/editor` (protected)

## 👤 Test Accounts

### Email Sign Up
1. Go to `/signup`
2. Enter email and password
3. Submit
4. Redirected to `/dashboard`

### Google Sign Up
1. Click "Google Sign Up"
2. Complete Google OAuth flow
3. Automatically created and redirected to `/dashboard`

## 🗂️ Project Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Landing page with Magic Input |
| `src/app/login/page.tsx` | Login page |
| `src/app/signup/page.tsx` | Signup page |
| `src/app/dashboard/page.tsx` | User dashboard |
| `src/app/editor/page.tsx` | Canvas editor (placeholder) |
| `src/lib/auth-context.tsx` | Authentication state management |
| `src/lib/supabase.ts` | Supabase client initialization |
| `src/components/header.tsx` | Navigation header |
| `src/components/magic-input.tsx` | Main input component |
| `docs/database.sql` | Database schema |

## 🎨 Styling

The app uses:
- **Tailwind CSS** for utility-first styling
- **Dark theme** with purple accents
- **shadcn/ui** components for consistency
- **Responsive design** for all screen sizes

## 🚀 Performance

- **Turbopack** for fast development builds
- **Optimized images** with Next.js Image
- **Code splitting** automatic with App Router
- **SEO optimized** with proper metadata

## 📱 Mobile Friendly

All pages are fully responsive:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## 🔒 Authentication

- **Supabase Auth** handles all authentication
- **Google OAuth** for quick signup
- **Email/Password** for traditional signup
- **Session management** with secure cookies

## 💾 Data Storage

- **Supabase PostgreSQL** for all data
- **Row-Level Security** for data protection
- **Auto-generated timestamps** on all tables

## 🐛 Troubleshooting

**"Supabase connection failed"**
- Check `.env.local` has correct credentials
- Verify Supabase project is active

**"Auth error on signup"**
- Ensure database tables are created
- Check RLS policies are enabled

**"Port 3000 already in use"**
```bash
npm run dev -- -p 3001
```

## 📚 Next Steps

1. ✅ App is running locally
2. 🔑 Set up Google OAuth in Supabase
3. 🗄️ Create database tables from SQL
4. 🚀 Deploy to Vercel
5. 🤖 Integrate Vertex AI APIs

## 🤝 Support

For issues:
1. Check the [README.md](./README.md)
2. Review [SETUP.md](./SETUP.md)
3. Check Supabase docs
4. Create a GitHub issue

---

**Happy building! 🎉**
