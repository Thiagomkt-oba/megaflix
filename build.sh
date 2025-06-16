#!/bin/bash
set -e

echo "🚀 Building Megaflix..."

# Build frontend with Vite
echo "📦 Building frontend..."
npx vite build

# Build backend with esbuild
echo "⚙️ Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Create dist directory for frontend assets
echo "📁 Preparing dist directory..."
mkdir -p dist

# Copy frontend assets to dist
echo "📋 Copying frontend assets..."
cp -r client/dist/* dist/

# Verify build
echo "✅ Build complete!"
ls -la dist/