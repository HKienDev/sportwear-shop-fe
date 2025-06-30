#!/bin/bash

echo "🧹 Clearing all caches..."

# Clear Next.js cache
rm -rf .next

# Clear node_modules cache
rm -rf node_modules/.cache

# Clear npm cache
npm cache clean --force

# Clear browser cache (optional - uncomment if needed)
# echo "Please clear your browser cache manually"

echo "✅ Cache cleared successfully!"
echo "🚀 Starting development server..."

# Start development server
npm run dev 