# Vizly AI - Professional AI Image Editor

**A full-stack AI-powered image editor built with Next.js, Fabric.js, and Google Vertex AI.**

## 🎯 Overview

Vizly AI is a production-ready application that enables users to:
1. **Extract brand information** from any website (colors, fonts, logos)
2. **Generate AI prompts** using Google Gemini Pro 1.5
3. **Create stunning images** with Imagen-4 image generation
4. **Edit with professional tools** using Fabric.js canvas engine
5. **Export and share** social media-ready content

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to start using Vizly AI.

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📋 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (5 endpoints)
│   ├── layout.jsx         # Root layout
│   ├── page.jsx          # Landing page
│   ├── editor/           # Editor page
│   ├── dashboard/        # Projects dashboard
│   └── globals.css       # Global styles
├── components/           # React components (8 total)
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries (13 total)
├── store/              # Zustand state management
└── types/              # JSDoc type definitions
```

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, JSX
- **Canvas**: Fabric.js v6
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **AI**: Google Vertex AI (Gemini, Imagen-4)
- **HTTP**: Axios
- **Scraping**: Cheerio

---

## ⚙️ Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
```

---

## 📊 Build Status

✅ Build: Successful  
✅ Files: 33 JavaScript files converted  
✅ Dependencies: 555 packages, 0 vulnerabilities  
✅ Deployment: Ready  

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed information.

---

## 🔄 Features

✅ Brand extraction from websites  
✅ AI prompt generation with Gemini  
✅ Image generation with Imagen-4  
✅ Professional canvas editing  
✅ Project management & save/load  
✅ Export to PNG/JPG  
✅ Social media templates  

---

**Built with Next.js, Fabric.js, and Google Vertex AI** ❤️

Status: ✅ Production Ready
