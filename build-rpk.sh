#!/bin/bash
# Build RPK for Xiaomi Mi Band 10
# RPK = ZIP with specific structure

set -e

echo "🔨 Building RPK..."

# Check required files
for f in src/manifest.json src/app.ux src/pages/index/index.ux; do
  if [ ! -f "$f" ]; then
    echo "❌ Missing: $f"
    exit 1
  fi
done

# Create build directory
BUILD_DIR="dist"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Create RPK (ZIP with specific structure)
RPK_FILE="$BUILD_DIR/com.forlin.habittracker.rpk"

echo "📦 Creating RPK package..."
cd src
zip -r "../$RPK_FILE" \
  manifest.json \
  app.ux \
  pages/ \
  common/ \
  i18n/ \
  2>/dev/null
cd ..

# Verify
if [ -f "$RPK_FILE" ]; then
  SIZE=$(du -h "$RPK_FILE" | cut -f1)
  echo "✅ Build successful!"
  echo "📁 Output: $RPK_FILE ($SIZE)"
  echo ""
  echo "📱 To install on Mi Band 10:"
  echo "   1. Transfer RPK to phone"
  echo "   2. Open Mi Fitness app"
  echo "   3. Go to Developer options"
  echo "   4. Install Quick App from file"
  echo ""
  echo "📱 Via AIoT-IDE:"
  echo "   1. Open AIoT-IDE"
  echo "   2. File → Open Folder"
  echo "   3. Click Install → Select device"
else
  echo "❌ Build failed"
  exit 1
fi
