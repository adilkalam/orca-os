#!/bin/bash

# Populate Design Inspiration Gallery with Screenshots
# Uses Chrome headless to capture viewport screenshots

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
GALLERY="$HOME/.claude/design-inspiration"

echo "🎨 POPULATING DESIGN INSPIRATION GALLERY"
echo ""

screenshot() {
    local url="$1"
    local category="$2"
    local name="$3"
    local output="$GALLERY/$category/$name.png"

    if [ -f "$output" ]; then
        echo "⏭️  $name (already exists)"
        return 0
    fi

    echo "📸 $name ($url)"
    mkdir -p "$GALLERY/$category"

    "$CHROME" --headless --disable-gpu \
        --screenshot="$output" \
        --window-size=1440,900 \
        --hide-scrollbars \
        --virtual-time-budget=5000 \
        "$url" 2>/dev/null

    if [ -f "$output" ]; then
        echo "   ✅ Saved to $category/"
    else
        echo "   ❌ Failed"
    fi

    sleep 2
}

echo "📁 Category: landing/"
screenshot "https://www.vaayu.tech/" "landing" "vaayu"
screenshot "https://moheim.com/" "landing" "moheim"
screenshot "https://www.deepjudge.ai/" "landing" "deepjudge"
screenshot "https://fey.com/" "landing" "fey"
screenshot "https://endex.ai/" "landing" "endex"
screenshot "https://www.apple.com/" "landing" "apple"
screenshot "https://www.openweb.com/" "landing" "openweb"
screenshot "https://area17.com/" "landing" "area17"
screenshot "https://linear.app/" "landing" "linear"
screenshot "https://www.notion.com/" "landing" "notion"

echo ""
echo "📁 Category: protocols/"
screenshot "https://docs.stripe.com/api" "protocols" "stripe-api"
screenshot "https://tailwindcss.com/docs" "protocols" "tailwind-docs"
screenshot "https://vercel.com/docs" "protocols" "vercel-docs"
screenshot "https://github.com/features" "protocols" "github-features"

echo ""
echo "📁 Category: components/"
screenshot "https://www.figma.com/pricing" "components" "figma-pricing"
screenshot "https://chakra-ui.com/" "components" "chakra-ui"
screenshot "https://www.airtable.com/" "components" "airtable"
screenshot "https://www.intercom.com/" "components" "intercom"

echo ""
echo "📁 Category: typography/"
screenshot "https://www.fontshare.com/" "typography" "fontshare"
screenshot "https://fonts.google.com/" "typography" "google-fonts"

echo ""
echo "✅ Gallery population complete!"
echo "   Location: $GALLERY"
echo ""
echo "📊 Summary:"
find "$GALLERY" -name "*.png" | wc -l | xargs echo "   Screenshots captured:"

