#!/bin/bash
# Habit Tracker - Build Script
# For Xiaomi Mi Band 10 (Vela JS)

set -e

echo "🔨 Building Habit Tracker for Mi Band 10..."

# Check if hap-toolkit is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build RPK with hap-toolkit
echo "📦 Building RPK with hap-toolkit..."
npx hap-toolkit build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📁 Output: dist/com.forlin.habittracker.debug.1.0.0.rpk"
    echo ""
    echo "📱 To install on Mi Band 10:"
    echo "   1. Transfer RPK to your phone"
    echo "   2. Open Mi Fitness app"
    echo "   3. Go to Developer Options"
    echo "   4. Install Quick App from file"
    echo ""
    echo "🤖 Or use AIoT-IDE:"
    echo "   1. Open AIoT-IDE"
    echo "   2. File → Open Folder → select this project"
    echo "   3. Click Install → Select device"
else
    echo "❌ Build failed"
    exit 1
fi
