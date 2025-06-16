#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build...');

// Build with Vite first
execSync('npx vite build', { stdio: 'inherit', cwd: process.cwd() });

// Ensure dist directory exists in root
const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy from client/dist to root dist
const clientDistDir = path.join(process.cwd(), 'client', 'dist');
if (fs.existsSync(clientDistDir)) {
  console.log('📁 Copying build files...');
  execSync(`cp -r ${clientDistDir}/* ${distDir}/`, { stdio: 'inherit' });
} else {
  console.error('❌ client/dist directory not found');
  process.exit(1);
}

// Verify the build
const distFiles = fs.readdirSync(distDir);
console.log('✅ Build complete. Files in dist:', distFiles.join(', '));

// Create empty .vercel-build-output if needed
const outputFlag = path.join(distDir, '.vercel-build-output');
fs.writeFileSync(outputFlag, '');