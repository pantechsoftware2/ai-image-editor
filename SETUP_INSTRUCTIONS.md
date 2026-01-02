# Vizly - Complete Setup & Deployment Guide

## 🔐 Critical: Security Setup FIRST

Before doing anything else, read `SECURITY_NOTICE.md` - a private key was exposed and needs to be revoked.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Google Cloud Project with Vertex AI enabled
- Supabase Project with Storage bucket

## 1️⃣ Environment Setup

### Create `.env.local` (NEVER commit this file)

Copy from `.env.example` and fill in your actual credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Google Cloud
NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_CLOUD_PRIVATE_KEY="your_private_key_with_newlines_escaped"

# App
NEXT_PUBLIC_API_URL=http://localhost:3000 (development)
NODE_ENV=development
```

### Get Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Vertex AI API
4. Create a Service Account:
   - IAM & Admin → Service Accounts
   - Create new service account
   - Grant "Vertex AI User" and "Vertex AI Service Agent" roles
5. Create and download JSON key
6. Convert to single-line format:
   ```bash
   cat key.json | jq '.private_key'
   # Copy the output (with escaped newlines)
   ```

### Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create or select a project
3. Settings → API Keys → Copy URL and anon key
4. Create "generated-images" storage bucket:
   - Storage → Create new bucket
   - Name: `generated-images`
   - Make public
   - Set RLS policies for authenticated uploads

## 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

## 3️⃣ Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit http://localhost:3000

## 4️⃣ Database Setup (Optional)

If using Supabase database for projects:

```sql
-- Create design_projects table
CREATE TABLE design_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  canvas_json JSONB,
  brand_data JSONB,
  image_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own projects
CREATE POLICY "Users can view own projects"
ON design_projects FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to create projects
CREATE POLICY "Users can create projects"
ON design_projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update own projects
CREATE POLICY "Users can update own projects"
ON design_projects FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete own projects
CREATE POLICY "Users can delete own projects"
ON design_projects FOR DELETE
USING (auth.uid() = user_id);
```

## 5️⃣ Test the Complete Flow

### Image Generation Pipeline
```
1. Dashboard → Extract Brand
2. Editor → Type Prompt
3. Click "Generate 4 Variants"
4. Images should appear in grid within 10-15 seconds
5. Click image to load on canvas
```

### Text Baking
```
1. Enable "Use AI Text Effects?"
2. Enter text (e.g., "SALE")
3. Generate images
4. Text should be rendered in images
```

### Canvas Editing
```
1. Select image variant
2. Click "+ Add Text" in toolbar
3. Edit font, color, size
4. Export as PNG/JPG
```

### Project Management
```
1. Enter project name
2. Click "Save Project"
3. Go to "My Projects"
4. Load, copy, or delete projects
```

## 6️⃣ Build for Production

```bash
npm run build
npm run start
```

Or deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🔧 Troubleshooting

### Images not generating
- Check Google Cloud API quota
- Verify credentials in `.env.local`
- Check browser console for errors
- Enable CORS on Supabase bucket

### Timeout errors
- Increase timeout in error-handler.js
- Check network connectivity
- Verify API endpoints are reachable

### Canvas not showing
- Check fabric.js is imported
- Verify canvas element with id="editor-canvas"
- Check browser console for fabric errors

### Storage upload fails
- Verify Supabase bucket exists and is public
- Check RLS policies on storage bucket
- Ensure Supabase key is correct

## 📚 Architecture Overview

```
┌─ Frontend (Next.js 14)
│  ├─ Editor Page (Full-featured design tool)
│  ├─ Dashboard (Brand extraction, project list)
│  ├─ Canvas (fabric.js)
│  └─ Components (UI, toolbar, modals)
│
├─ APIs (Next.js Route Handlers)
│  ├─ /api/generate-prompt (Gemini 1.5)
│  ├─ /api/generate-images (Imagen-3.0)
│  ├─ /api/projects/* (CRUD operations)
│  └─ /api/extract-brand (URL scraping)
│
├─ Libraries
│  ├─ vertex-ai.js (Gemini & Imagen integration)
│  ├─ storage-utils.js (Supabase uploads)
│  ├─ canvas-export.js (PNG/JPG export)
│  ├─ project-manager.js (DB operations)
│  ├─ error-handler.js (Retry & error handling)
│  └─ brand-extractor.js (URL scraping)
│
└─ Infrastructure
   ├─ Supabase (Auth, Database, Storage)
   ├─ Google Cloud (Vertex AI, Imagen)
   └─ Vercel/Self-hosted (Deployment)
```

## 🚀 Features Implemented

✅ **Core Generation**
- Gemini 1.5 Flash for prompt engineering
- Imagen-3.0 for image generation
- 4-variant generation per request

✅ **Canvas Editing**
- fabric.js integration
- Text tools (color, size, family, alignment)
- Image background merging
- Export to PNG/JPG at 2x resolution

✅ **Text Features**
- Text baking (AI-rendered text in images)
- Text regeneration (generate 5 alternatives)
- Copy suggestions for headlines

✅ **Project Management**
- Save projects to Supabase
- Load/duplicate/delete projects
- Search projects by name
- Project versioning

✅ **Error Handling**
- Retry logic with exponential backoff
- User-friendly error messages
- Toast notifications
- Network status monitoring

✅ **Security**
- Environment variables for secrets
- Row-level security on Supabase
- Authentication required for projects
- No secrets in version control

## 📖 Key Files

| File | Purpose |
|------|---------|
| `src/app/editor/page.jsx` | Main editor interface |
| `src/lib/vertex-ai.js` | Gemini & Imagen integration |
| `src/lib/canvas-export.js` | Export utilities |
| `src/lib/project-manager.js` | Database operations |
| `src/lib/error-handler.js` | Error & retry logic |
| `src/lib/storage-utils.js` | Supabase storage |
| `src/components/CanvasToolbar.jsx` | Text editing tools |
| `src/components/Canvas.jsx` | fabric.js canvas |

## 🎯 Next Steps

1. ✅ Complete security setup (revoke exposed key)
2. ✅ Set up environment variables
3. ✅ Create Supabase project & bucket
4. ✅ Create Google Cloud service account
5. ✅ Run development server
6. ✅ Test image generation pipeline
7. ✅ Test all features
8. ✅ Deploy to production

## 📞 Support

For issues:
1. Check `SECURITY_NOTICE.md` for security problems
2. Review error messages in browser console
3. Check `.env.local` is properly configured
4. Verify API credentials are correct
5. Check Supabase dashboard for storage status

## 📄 License

MIT - See LICENSE file
