#!/bin/bash

echo "🔧 Fixing n8n replica installation..."

# Clean everything
echo "1️⃣ Cleaning old files..."
rm -rf node_modules package-lock.json
npm cache clean --force

# Fresh install
echo "2️⃣ Installing dependencies..."
npm install

# Check if vite exists
if [ -f "node_modules/.bin/vite" ]; then
    echo "✅ Installation successful!"
    echo ""
    echo "🚀 Starting development server..."
    npm run dev
else
    echo "❌ Installation failed. Please run 'npm install' manually."
    exit 1
fi
