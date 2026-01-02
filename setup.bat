@echo off
REM Installation and Setup Script for Windows
REM This script helps set up the Vizly AI Image Editor project

echo.
echo 🎨 Vizly AI - Installation Setup
echo ==================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env.local template if it doesn't exist
if not exist .env.local (
    echo.
    echo 📝 Creating .env.local template...
    (
        echo # Supabase Configuration
        echo NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
        echo.
        echo # Google Cloud Configuration
        echo GOOGLE_CLOUD_PROJECT_ID=your-project-id
        echo GOOGLE_CLOUD_REGION=us-central1
        echo GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json
        echo.
        echo # API Configuration
        echo NEXT_PUBLIC_API_URL=http://localhost:3000
    ) > .env.local
    echo ✅ .env.local created - please update with your credentials
) else (
    echo ✅ .env.local already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your credentials
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo For more info, see QUICK_START.md
echo.
pause
