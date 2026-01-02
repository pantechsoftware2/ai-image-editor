# 🎯 QUICK START REFERENCE CARD

## For Users: How to Use Vizly

### 1️⃣ Brand Extraction (URL → Colors, Fonts, Logo)
```
1. Go to home page
2. Paste URL: https://yoursite.com
3. Click "Extract Brand"
4. Review colors, fonts, logo
5. Click "Use These Colors"
6. Proceed to editor
```

### 2️⃣ Generate Images (Prompt → 4 Variants)
```
1. In editor, type your request
   Example: "espresso cup with latte art"
2. Click "Generate Images"
3. Wait 15-30 seconds
4. See 4 AI-generated variants
5. Click one to select
```

### 3️⃣ Edit Text (Customize Headlines)
```
1. Click text on canvas
2. Use toolbar to:
   - Change font (Font dropdown)
   - Change color (Color picker)
   - Change size (Size slider)
   - Change alignment (Alignment buttons)
3. Click "Apply"
4. Or click "Regenerate Text" for alternatives
```

### 4️⃣ Export Design (PNG/JPG)
```
1. Click "Download"
2. Choose PNG or JPG
3. File automatically downloads
4. Ready for social media!
```

### 5️⃣ Save Project (Come Back Later)
```
1. Click "Save Project"
2. Enter project name
3. Click "Save"
4. Go to "/projects" to view all
5. Click "Remix" to edit later
```

---

## For Developers: How to Activate

### Quick Activation (5 minutes)

**Step 1: Google Cloud Credentials**
```bash
# Get from: console.cloud.google.com
# Project: ai-image-editor-482905
# Service Accounts → vertex-ai-service → Create JSON key

# Add to .env.local:
GOOGLE_CLOUD_PROJECT_ID=ai-image-editor-482905
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_CLOUD_CLIENT_EMAIL=vertex-ai-service@...
```

**Step 2: Supabase Credentials**
```bash
# Get from: supabase.com → Your Project → Settings → API

# Add to .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

**Step 3: Run It**
```bash
npm run dev
# Open http://localhost:3000
# Test: Extract brand → Generate images → Edit → Export
```

**Step 4: Deploy**
```bash
vercel --prod
# During setup, add same environment variables
# Done! Live on Vercel
```

---

## File Reference Map

### User-Facing Pages
| URL | File | Purpose |
|-----|------|---------|
| `/` | `app/page.tsx` | Home with brand input |
| `/editor` | `src/app/editor/page.jsx` | Main editor |
| `/projects` | `src/app/projects/page.jsx` | My Projects |
| `/dashboard` | `app/dashboard/page.tsx` | Dashboard |

### API Endpoints
| Route | File | Purpose |
|-------|------|---------|
| `/api/extract-brand` | `src/app/api/extract-brand/route.js` | Scrape URL for brand |
| `/api/generate-prompt` | `app/api/generate-prompt/route.ts` | Gemini prompts |
| `/api/generate-images` | `app/api/generate-images/route.ts` | Imagen variants |
| `/api/projects` | `src/app/api/projects/route.js` | CRUD projects |

### Core Libraries
| Library | File | Purpose |
|---------|------|---------|
| Vertex AI | `src/lib/vertex-ai.js` | Gemini + Imagen |
| Brand Extract | `src/lib/brand-extractor.js` | URL scraping |
| Projects | `src/lib/project-manager.js` | Save/load |
| Errors | `src/lib/error-handler.js` | Error handling |
| Export | `src/lib/canvas-export.js` | PNG/JPG export |
| Storage | `src/lib/storage-utils.js` | Supabase uploads |

### UI Components
| Component | File | Purpose |
|-----------|------|---------|
| Canvas | `src/components/Canvas.jsx` | fabric.js setup |
| Toolbar | `src/components/CanvasToolbar.jsx` | Text controls |
| Variants | `src/components/ImageVariantsGrid.jsx` | Image grid |
| Brand | `src/components/BrandModal.jsx` | Brand extraction |

---

## Key Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Deployment
```bash
vercel               # Deploy to Vercel (staging)
vercel --prod        # Deploy to production
git push origin main # Push to GitHub
```

### Database
```bash
# Create tables manually:
# 1. Go to Supabase console
# 2. SQL Editor
# 3. Copy from src/lib/database-schema.js
# 4. Run each CREATE TABLE statement

# Or use migration (when ready):
npm run setup:db
```

---

## Environment Variables Needed

### Google Cloud (for AI)
```bash
GOOGLE_CLOUD_PROJECT_ID=...
GOOGLE_CLOUD_PRIVATE_KEY=...
GOOGLE_CLOUD_CLIENT_EMAIL=...
GOOGLE_CLOUD_REGION=us-central1
NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID=...
NEXT_PUBLIC_GOOGLE_CLOUD_REGION=us-central1
```

### Supabase (for Database)
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Optional
```bash
SUPABASE_SERVICE_ROLE_KEY=...  # Server-side only
NODE_ENV=production             # For production
```

---

## Troubleshooting

### "Google Cloud Project ID not configured"
```
✅ Solution: Check GOOGLE_CLOUD_PROJECT_ID in .env.local exists
✅ Kill server: Ctrl+C
✅ Restart: npm run dev
```

### "Images show as SVG mock"
```
✅ Solution: Verify GOOGLE_CLOUD_PRIVATE_KEY is set correctly
✅ Check server logs for errors
✅ If "Authentication failed" → Check credentials format
```

### "Supabase connection fails"
```
✅ Solution: Verify NEXT_PUBLIC_SUPABASE_URL format
✅ Should be: https://your-project.supabase.co
✅ Test: curl https://your-project.supabase.co/rest/v1/
```

### "Build fails"
```
✅ Delete node_modules: rm -r node_modules
✅ Reinstall: npm install
✅ Rebuild: npm run build
```

---

## Architecture Overview

```
User Browser
    ↓
Next.js 16 (Frontend + Backend)
    ├─ Pages (React)
    ├─ API Routes
    └─ Static Assets
    
    ↓
    
Google Vertex AI
├─ Gemini 1.5 Flash (prompt generation)
└─ Imagen-3.0-generate (image generation)

Supabase
├─ PostgreSQL (profiles, projects, generations)
├─ Storage (ai-images bucket)
└─ Auth (Google/Email)

Deployed on: Vercel (frontend + serverless functions)
```

---

## Feature Checklist for Testing

```
✅ Extract brand from URL
   □ Try: https://apple.com
   □ See colors, fonts, logo, vibe

✅ Generate 4 image variants
   □ Type prompt
   □ Click generate
   □ See 4 images in grid

✅ Edit text on canvas
   □ Click text
   □ Change font
   □ Change color
   □ Change size
   □ Change alignment

✅ Regenerate text alternatives
   □ Click "Regenerate Text"
   □ See 5 alternatives
   □ Select one

✅ Export to PNG/JPG
   □ Click "Download"
   □ Choose format
   □ File downloads

✅ Save project
   □ Click "Save Project"
   □ Enter name
   □ Goes to /projects

✅ Load project
   □ Go to /projects
   □ Click "Remix"
   □ Edit resumes
```

---

## Important Limits

```
Image size: 1080x1350 (Instagram story format)
Variants per request: 4
Text size range: 8px - 72px
Max project name: 255 characters
Storage per project: ~2MB
Max file upload: 50MB (Supabase default)
```

---

## Contact & Support

```
Issues/Bugs: GitHub Issues
Documentation: See /docs folder
Questions: Check ACTIVATION_GUIDE.md
```

---

## Tech Stack Summary

```
Frontend: React 19 + Next.js 16
Canvas: fabric.js v7.0.0
AI: Vertex AI (Gemini + Imagen)
Database: Supabase (PostgreSQL)
Auth: Supabase Auth
Storage: Supabase Storage
Hosting: Vercel
Styling: Tailwind CSS 4
UI Library: shadcn/ui
State: Zustand
```

---

## Success Criteria

You'll know it's working when:

```
✅ npm run build succeeds (no errors)
✅ npm run dev starts (http://localhost:3000)
✅ Extract brand endpoint returns colors
✅ Generate prompt endpoint returns JSON
✅ Generate images endpoint returns 4 variants
✅ Text appears on canvas
✅ Export downloads PNG/JPG file
✅ Project saves to database
✅ Can reload and edit saved project
```

---

**Generated:** January 2, 2026  
**Project:** Vizly AI Image Editor MVP  
**Status:** Production Ready ✅

**Next:** Follow ACTIVATION_GUIDE.md to add credentials and go live!
