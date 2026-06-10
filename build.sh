#!/bin/bash
# Habit Tracker - Build Script
# For Xiaomi Mi Band 10 (Vela JS)

set -e

echo "🔨 Building Habit Tracker for Mi Band 10..."

# Check if AIoT-IDE is available
if ! command -v aiot-ide &> /dev/null; then
    echo "❌ AIoT-IDE not found in PATH"
    echo ""
    echo "📋 Manual build instructions:"
    echo "1. Open AIoT-IDE"
    echo "2. File → Open Folder → select this project"
    echo "3. Click Build → Build RPK"
    echo "4. Output will be in dist/"
    echo ""
    echo "📥 Download AIoT-IDE from:"
    echo "   https://iot.mi.com/vela/quickapp/en/guide/start/use-ide.html"
    exit 1
fi

# Build RPK
echo "📦 Building RPK..."
aiot-ide build --target rpk

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Output: dist/com.forlin.habittracker.rpk"
    echo ""
    echo "📱 To install on Mi Band 10:"
    echo "   aiot-ide install --device <band-mac-address>"
else
    echo "❌ Build failed"
    exit 1
fi
