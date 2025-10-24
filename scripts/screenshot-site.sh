#!/bin/bash

# Simple script to screenshot a URL and save to inspiration gallery
# Usage: screenshot-site.sh <url> <category> <name>

URL="$1"
CATEGORY="$2"
NAME="$3"

GALLERY_PATH="$HOME/.claude/design-inspiration"
OUTPUT_PATH="$GALLERY_PATH/$CATEGORY/$NAME.png"

echo "📸 Screenshotting: $URL"
echo "   Category: $CATEGORY"
echo "   Name: $NAME"
echo "   Output: $OUTPUT_PATH"

# Check if already exists
if [ -f "$OUTPUT_PATH" ]; then
    echo "   ⏭️  Already exists, skipping"
    exit 0
fi

# Ensure category directory exists
mkdir -p "$GALLERY_PATH/$CATEGORY"

# Try using chrome headless if available
if command -v google-chrome &> /dev/null || command -v chromium &> /dev/null; then
    CHROME=$(command -v google-chrome || command -v chromium || command -v "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")

    "$CHROME" --headless --disable-gpu --screenshot="$OUTPUT_PATH" \
        --window-size=1440,900 \
        --hide-scrollbars \
        "$URL" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo "   ✅ Screenshot saved"
        exit 0
    fi
fi

# Fallback: Try webkit2png if available (macOS)
if command -v webkit2png &> /dev/null; then
    cd "$GALLERY_PATH/$CATEGORY"
    webkit2png -F -W 1440 -H 900 --delay=3 -o "$NAME" "$URL" 2>/dev/null
    mv "${NAME}-full.png" "$OUTPUT_PATH" 2>/dev/null || mv "${NAME}.png" "$OUTPUT_PATH" 2>/dev/null
    rm -f "${NAME}"-*.png 2>/dev/null
    echo "   ✅ Screenshot saved"
    exit 0
fi

# Fallback: Use curl to at least save HTML
echo "   ⚠️  No screenshot tool available, saving HTML description"
curl -s "$URL" | head -100 > "$GALLERY_PATH/$CATEGORY/${NAME}.html"
echo "   📝 Saved HTML instead (install Chrome or webkit2png for screenshots)"

