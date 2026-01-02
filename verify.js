#!/usr/bin/env node

/**
 * Vizly AI - Complete Project Verification
 * This script verifies all project files are in place
 */

const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

const requiredFiles = [
  // Pages
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/globals.css',
  'src/app/editor/page.tsx',
  'src/app/dashboard/page.tsx',

  // API Routes
  'src/app/api/extract-brand/route.ts',
  'src/app/api/generate-prompt/route.ts',
  'src/app/api/generate-images/route.ts',
  'src/app/api/projects/route.ts',
  'src/app/api/projects/[id]/route.ts',

  // Components
  'src/components/Canvas.tsx',
  'src/components/Toolbar.tsx',
  'src/components/BrandModal.tsx',
  'src/components/ImageVariantsGrid.tsx',
  'src/components/TemplateSelector.tsx',
  'src/components/StyleChips.tsx',
  'src/components/LoadingSpinner.tsx',
  'src/components/Toast.tsx',

  // Hooks
  'src/hooks/useCanvas.ts',

  // Libraries
  'src/lib/supabase.ts',
  'src/lib/vertex-ai.ts',
  'src/lib/brand-extractor.ts',
  'src/lib/templates.ts',
  'src/lib/api-client.ts',
  'src/lib/canvas-utils.ts',
  'src/lib/image-processor.ts',
  'src/lib/prompt-engineer.ts',
  'src/lib/config.ts',
  'src/lib/constants.ts',
  'src/lib/validators.ts',
  'src/lib/formatters.ts',
  'src/lib/database-schema.ts',

  // Store
  'src/store/editor-store.ts',

  // Types
  'src/types/index.ts',

  // Config
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'tsconfig.json',
  'package.json',
  '.env.local',
  '.gitignore',
];

const requiredDocumentation = [
  'README.md',
  'QUICK_START.md',
  'SETUP_GUIDE.md',
  'FILE_STRUCTURE.md',
  'FILE_INDEX.md',
  'PROJECT_DELIVERY.md',
  'COMPLETION_SUMMARY.md',
  'FILE_INVENTORY.md',
];

console.log('🎨 Vizly AI - Project Verification');
console.log('==================================\n');

let allPresent = true;
let fileCount = 0;

console.log('📂 Checking Source Files...\n');
requiredFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (exists) fileCount++;
  else allPresent = false;
});

console.log('\n📚 Checking Documentation Files...\n');
requiredDocumentation.forEach(file => {
  const filePath = path.join(projectRoot, file);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (exists) fileCount++;
  else allPresent = false;
});

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${fileCount}/${requiredFiles.length + requiredDocumentation.length} files present\n`);

if (allPresent) {
  console.log('🎉 All files are in place!\n');
  console.log('Next steps:');
  console.log('1. Update .env.local with your credentials');
  console.log('2. Run: npm install');
  console.log('3. Run: npm run dev');
  console.log('4. Open: http://localhost:3000\n');
  process.exit(0);
} else {
  console.log('❌ Some files are missing. Check the list above.\n');
  process.exit(1);
}
