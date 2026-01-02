#!/usr/bin/env node

/**
 * Vizly Phase 2 Setup Verification
 * Checks that all components are properly configured
 */

const fs = require('fs');
const path = require('path');

const checks = {
  passed: [],
  failed: [],
};

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function check(name, condition) {
  if (condition) {
    checks.passed.push(name);
    console.log(`${colors.green}✓${colors.reset} ${name}`);
  } else {
    checks.failed.push(name);
    console.log(`${colors.red}✗${colors.reset} ${name}`);
  }
}

console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}  Vizly Phase 2 - Setup Verification${colors.reset}`);
console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

// 1. Check key files exist
console.log(`${colors.yellow}File Structure:${colors.reset}`);
check('Canvas.jsx exists', fs.existsSync('src/components/Canvas.jsx'));
check('StyleChips.jsx exists', fs.existsSync('src/components/StyleChips.jsx'));
check('vertex-ai.js exists', fs.existsSync('src/lib/vertex-ai.js'));
check('templates.js exists', fs.existsSync('src/lib/templates.js'));
check('editor-store.js exists', fs.existsSync('src/store/editor-store.js'));
check('API route: generate-prompt', fs.existsSync('src/app/api/generate-prompt/route.js'));
check('API route: generate-images', fs.existsSync('src/app/api/generate-images/route.js'));

// 2. Check environment setup
console.log(`\n${colors.yellow}Environment Configuration:${colors.reset}`);
const hasEnvLocal = fs.existsSync('.env.local');
const hasEnvExample = fs.existsSync('.env.example');

check('.env.local exists', hasEnvLocal);
check('.env.example exists', hasEnvExample);

if (hasEnvLocal) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  check('GOOGLE_CLOUD_PROJECT_ID configured', envContent.includes('GOOGLE_CLOUD_PROJECT_ID'));
  check('GOOGLE_CLOUD_PRIVATE_KEY configured', envContent.includes('GOOGLE_CLOUD_PRIVATE_KEY'));
  check('Supabase URL configured', envContent.includes('SUPABASE_URL'));
}

// 3. Check dependencies in package.json
console.log(`\n${colors.yellow}Dependencies:${colors.reset}`);
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deps = packageJson.dependencies || {};

check('@google-cloud/vertexai installed', !!deps['@google-cloud/vertexai']);
check('fabric installed', !!deps['fabric']);
check('zustand installed', !!deps['zustand']);
check('axios installed', !!deps['axios']);
check('@supabase/supabase-js installed', !!deps['@supabase/supabase-js']);

// 4. Check that old markdown files are removed
console.log(`\n${colors.yellow}Cleanup:${colors.reset}`);
const mdFiles = fs.readdirSync('.').filter(f => f.endsWith('.md'));
const unwantedMd = mdFiles.filter(f => 
  f !== 'README.md' && f !== 'IMPLEMENTATION_GUIDE.md'
);
check('Old .md files removed', unwantedMd.length === 0);

// 5. Check Canvas.jsx has fabric.js initialization
console.log(`\n${colors.yellow}Component Implementation:${colors.reset}`);
const canvasContent = fs.readFileSync('src/components/Canvas.jsx', 'utf8');
check('Canvas has fabric.Canvas init', canvasContent.includes('new fabric.Canvas'));
check('Canvas has responsive sizing', canvasContent.includes('containerRef'));
check('Canvas aspect ratio handling', canvasContent.includes('1080') && canvasContent.includes('1350'));

// 6. Check vertex-ai.js has Gemini system prompt
const vertexContent = fs.readFileSync('src/lib/vertex-ai.js', 'utf8');
check('Vertex AI has Gemini system prompt', vertexContent.includes('GEMINI_SYSTEM_PROMPT'));
check('Vertex AI has generateImagePrompt', vertexContent.includes('generateImagePrompt'));
check('Vertex AI has template-specific instructions', vertexContent.includes('getNegativeSpaceInstructions'));

// 7. Check StyleChips integration
const styleContent = fs.readFileSync('src/components/StyleChips.jsx', 'utf8');
check('StyleChips has 6 style options', (styleContent.match(/id:/g) || []).length >= 6);
check('StyleChips exports STYLE_CHIPS', styleContent.includes('export { STYLE_CHIPS }'));

// Summary
console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
console.log(`${colors.green}Passed: ${checks.passed.length}${colors.reset}`);
console.log(`${colors.red}Failed: ${checks.failed.length}${colors.reset}`);
console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

if (checks.failed.length > 0) {
  console.log(`${colors.yellow}Failed checks:${colors.reset}`);
  checks.failed.forEach(f => console.log(`  - ${f}`));
  process.exit(1);
} else {
  console.log(`${colors.green}All checks passed! Ready to start Phase 2.${colors.reset}\n`);
  process.exit(0);
}
