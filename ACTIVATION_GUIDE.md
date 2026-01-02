# 🚀 Activation Guide - From MVP to Production

**Status:** MVP is 99% complete. These steps activate the real integrations.

---

## Step 1: Google Cloud Setup (Imagen-4)

### 1a. Get Google Cloud Credentials
```bash
# Go to: https://console.cloud.google.com/
# Project: ai-image-editor-482905 (or your project)
# Service Accounts → vertex-ai-service@ai-image-editor-482905.iam.gserviceaccount.com
# Keys → Create new JSON key
# This file contains: private_key, client_email, project_id
```

### 1b. Fill Environment Variables
**File:** `.env.local`
```bash
# Google Cloud (from the JSON key file)
GOOGLE_CLOUD_PROJECT_ID=ai-image-editor-482905
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLOUD_CLIENT_EMAIL=vertex-ai-service@ai-image-editor-482905.iam.gserviceaccount.com
GOOGLE_CLOUD_REGION=us-central1

# Public versions (safe for frontend)
NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID=ai-image-editor-482905
NEXT_PUBLIC_GOOGLE_CLOUD_REGION=us-central1
```

### 1c. Verify Vertex AI APIs Enabled
```bash
# In Google Cloud Console:
# APIs & Services → Enabled APIs
# ✅ Vertex AI API
# ✅ Cloud Vision API (for brand extraction)
# ✅ Generative Language API
```

---

## Step 2: Supabase Setup (Database & Storage)

### 2a. Get Supabase Credentials
```bash
# Go to: https://supabase.com/
# Your Project → Settings → API
# URL and Keys are there
```

### 2b. Fill Environment Variables
**File:** `.env.local`
```bash
# Supabase (public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: for server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-key (if needed)
```

### 2c. Create Database Tables
**Method 1: SQL Editor in Supabase Console**
```bash
# Go to: SQL Editor
# Copy-paste from: src/lib/database-schema.js
# Run each CREATE TABLE statement
```

**Method 2: Use migration script** (Coming soon)
```bash
npm run setup:db
```

### 2d. Create Storage Bucket
```bash
# Supabase Console → Storage
# Create bucket: "ai-images"
# Policy: Public (for image display)
```

---

## Step 3: Test Real Image Generation

### 3a. Stop dev server and restart with credentials
```bash
# Kill current dev server (Ctrl+C)
npm run dev
```

### 3b. Test Extract Brand
```bash
curl -X POST http://localhost:3000/api/extract-brand \
  -H "Content-Type: application/json" \
  -d '{"url": "https://apple.com"}'

# Should return: colors, fonts, logo, vibe
```

### 3c. Test Generate Prompt
```bash
curl -X POST http://localhost:3000/api/generate-prompt \
  -H "Content-Type: application/json" \
  -d '{
    "brandColors": ["#000000", "#FFFFFF"],
    "brandVibe": "minimalist",
    "userRequest": "coffee cup"
  }'

# Should return: imagen_prompt, composition, color_strategy, etc.
```

### 3d. Test Generate Images
```bash
curl -X POST http://localhost:3000/api/generate-images \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "photorealistic espresso cup on marble counter",
    "brandColors": ["#000000", "#FFFFFF"]
  }'

# Should return: 4 image variants (NOT mocks)
```

---

## Step 4: Full User Flow Test

### 4a. Start dev server
```bash
npm run dev
# Open: http://localhost:3000
```

### 4b. Test the complete MVP loop
1. **Home page:** Enter URL (e.g., `https://apple.com`)
2. **Brand extraction:** System returns colors, fonts, logo
3. **Confirm brand:** Click "Use These Colors"
4. **Editor page:** System loads with brand colors
5. **Generate images:** Type prompt → Click "Generate"
6. **Select variant:** Click one of the 4 images
7. **Smart overlay:** Text appears automatically
8. **Edit text:** Use toolbar to change font/color
9. **Regenerate:** Click "Regenerate Text" for alternatives
10. **Export:** Click "Download" → Save as PNG/JPG
11. **Save project:** Click "Save Project"
12. **My Projects:** View saved projects on `/projects`

---

## Step 5: Deployment to Vercel

### 5a. Connect to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# During setup:
# - Connect your GitHub repository
# - Select project
# - Import environment variables from .env.local
```

### 5b. Set Environment Variables in Vercel Dashboard
```bash
# Vercel Dashboard → Settings → Environment Variables
# Add all variables from .env.local:
# - GOOGLE_CLOUD_PROJECT_ID
# - GOOGLE_CLOUD_PRIVATE_KEY (copy exactly, including \n)
# - GOOGLE_CLOUD_CLIENT_EMAIL
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - etc.
```

### 5c. Deploy
```bash
vercel --prod
```

---

## Step 6: Security Checklist

### ⚠️ Before Production
- [ ] Delete `google-cloud-key.json` from Downloads folder
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Verify no secrets in committed code
- [ ] Rotate Google Cloud credentials if exposed
- [ ] Enable Supabase RLS policies (read: src/lib/database-schema.js)
- [ ] Set up CORS for image loading from Supabase
- [ ] Configure OAuth (Google/GitHub login if needed)

---

## Step 7: Configuration Fine-Tuning

### 7a. Adjust Gemini Parameters (Optional)
**File:** `src/lib/vertex-ai.js` (line 136-142)
```javascript
generationConfig: {
  temperature: 0.7,        // 0=deterministic, 1=creative
  topP: 0.95,              // Diversity control
  topK: 40,                // Token pool size
  maxOutputTokens: 600,    // Response length
}
```

### 7b. Adjust Imagen Parameters (Optional)
**File:** `src/lib/vertex-ai.js` (image generation call)
```javascript
// Number of variants (1-4)
const imageCount = 4;

// Model version (as of Jan 2026)
model: 'imagen-3.0-generate'
```

### 7c. Adjust Canvas Size (Optional)
**File:** `src/lib/templates.js`
```javascript
// Default: 1080x1350 (Instagram Story)
// Change to any aspect ratio:
// - 1200x628 (Twitter/LinkedIn)
// - 1920x1080 (YouTube thumbnail)
// - 1024x1024 (Square)
```

---

## Troubleshooting

### Issue: "Google Cloud Project ID is not configured"
**Solution:**
```bash
# Check .env.local exists
ls -la .env.local

# Check format:
cat .env.local | grep GOOGLE_CLOUD_PROJECT_ID

# Should see: GOOGLE_CLOUD_PROJECT_ID=your_id
```

### Issue: "Image generation returns SVG mocks"
**Solution:**
The API is configured to return mock SVGs in development mode. To enable real Imagen:
```bash
# Verify GOOGLE_CLOUD_PRIVATE_KEY is set correctly
# Kill and restart dev server
npm run dev

# Check server logs for errors
# If error: "Authentication failed" → Re-check credentials
```

### Issue: Supabase connection fails
**Solution:**
```bash
# Verify NEXT_PUBLIC_SUPABASE_URL format:
# Should be: https://your-project.supabase.co (NOT localhost)

# Test connection:
curl https://your-project.supabase.co/rest/v1/ \
  -H "apikey: your-anon-key"
```

### Issue: Images don't upload to Supabase
**Solution:**
```bash
# Verify storage bucket exists: "ai-images"
# Verify bucket is PUBLIC
# Check Supabase service role key is set (server-side only)
```

---

## Performance Optimization

### 7a. Image Caching
```javascript
// Images are automatically cached in Supabase Storage
// See: src/lib/storage-utils.js
```

### 7b. Prompt Optimization
```javascript
// Cached in localStorage:
// - Brand data
// - User preferences
// - Generated prompts
```

### 7c. Canvas State Snapshots
```javascript
// Projects saved with canvas state as JSONB
// Enables instant load of previous work
```

---

## Monitoring & Analytics (Optional)

### 7a. Token Usage
```javascript
// Available function: countTokens()
// Use to show user the cost before generation
```

### 7b. Generation Logs
```javascript
// All generations logged in 'generations' table
// Use to track usage, trends, popular prompts
```

---

## Next Features (Post-MVP)

1. **Batch Operations:** Generate 100 variants at once
2. **Team Collaboration:** Share projects with teammates
3. **AI Refinement:** "Make it more minimalist" → Smart adjustment
4. **Brand Library:** Save brand profiles for reuse
5. **Template Store:** Buy/sell custom templates
6. **Export Options:** Animated GIFs, videos, multi-format
7. **Mobile App:** React Native version
8. **Custom Models:** Fine-tune Imagen on brand images

---

## Getting Help

### Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Vertex AI SDK](https://cloud.google.com/python/docs/reference/vertexai)
- [Supabase Docs](https://supabase.com/docs)
- [Fabric.js Docs](https://fabricjs.com/)

### Community
- [Vertex AI Discord](https://discord.gg/google-cloud)
- [Supabase Community](https://discord.supabase.com)
- [Next.js Community](https://discord.gg/nextjs)

---

**Version:** 1.0 (MVP Ready)  
**Last Updated:** January 2, 2026  
**Status:** Ready for activation
