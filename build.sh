#!/bin/bash
# Build script for Vercel deployment

echo "Building frontend..."
npm run build

echo "Copying build files..."
mkdir -p dist/public
cp -r client/dist/* dist/public/

echo "Build completed successfully!"