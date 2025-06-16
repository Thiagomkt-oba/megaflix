#!/bin/bash
# Build script for Vercel deployment

echo "Building frontend with Vite..."
npx vite build

echo "Creating dist directory..."
mkdir -p dist

echo "Copying frontend files to dist..."
cp -r client/dist/* dist/

echo "Build completed - dist directory created with frontend files"
ls -la dist/