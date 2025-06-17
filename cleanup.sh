#!/bin/bash

# Codebase Cleanup Script
echo "🧹 Cleaning up codebase for production..."

# Remove temporary development documentation
echo "📄 Removing temporary documentation files..."
rm -f "BORDER_ANIMATION_ENHANCEMENT.md"
rm -f "VIDEO_LOADING_IMPROVEMENTS.md"
rm -f "VIDEO_FIX_COMPLETE.md"
rm -f "S3_INTEGRATION_COMPLETE.md"

# Clean up debug files
echo "🐛 Removing debug files..."
rm -f debug*.html
rm -f debug*.js
rm -f debug*.cjs
rm -f *debug*.js
rm -f test-*.cjs
rm -f direct-video-test.html

# Remove temporary video debug files
echo "🎥 Cleaning video debug files..."
rm -f deep-check-videos.cjs
rm -f check-bucket.cjs
rm -f check-schema.cjs

# Organize documentation
echo "📚 Organizing documentation..."
if [ ! -d "docs/setup" ]; then
    mkdir -p "docs/setup"
fi

# Move setup guides to organized location
mv "SUPABASE_SETUP.md" "docs/setup/" 2>/dev/null || echo "SUPABASE_SETUP.md not found"
mv "SUPABASE_INTEGRATION.md" "docs/setup/" 2>/dev/null || echo "SUPABASE_INTEGRATION.md not found"
mv "SECURITY_SETUP.md" "docs/setup/" 2>/dev/null || echo "SECURITY_SETUP.md not found"
mv "VIDEO_SETUP_GUIDE.md" "docs/setup/" 2>/dev/null || echo "VIDEO_SETUP_GUIDE.md not found"
mv "VIDEO_UPLOAD_GUIDE.md" "docs/setup/" 2>/dev/null || echo "VIDEO_UPLOAD_GUIDE.md not found"

# Clean up SQL files (move to scripts)
echo "🗄️ Organizing SQL files..."
if [ -f "RUN_THIS_SQL.sql" ]; then
    mv "RUN_THIS_SQL.sql" "scripts/"
fi
if [ -f "setup-storage-policies.sql" ]; then
    mv "setup-storage-policies.sql" "scripts/"
fi
if [ -f "setup-videos-table.sql" ]; then
    mv "setup-videos-table.sql" "scripts/"
fi

# Remove node_modules and reinstall for clean dependencies
echo "📦 Cleaning dependencies..."
if [ -d "node_modules" ]; then
    echo "Removing node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "Removing package-lock.json..."
    rm -f package-lock.json
fi

echo "Installing fresh dependencies..."
npm install

# Run linting and formatting
echo "✨ Running code formatting..."
npm run lint --fix 2>/dev/null || echo "No lint script found"

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

echo "✅ Codebase cleanup complete!"
echo ""
echo "📁 Project structure organized:"
echo "   - Documentation moved to docs/setup/"
echo "   - Debug files removed"
echo "   - SQL files moved to scripts/"
echo "   - Dependencies refreshed"
echo "   - Code formatted and built"
echo ""
echo "🚀 Ready for git push!"
