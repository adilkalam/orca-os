#!/bin/bash

# Verify Design Inspiration System is Ready
# Quick check that all components are in place

echo "🔍 VERIFYING DESIGN INSPIRATION SYSTEM"
echo ""

GALLERY_PATH="$HOME/.claude/design-inspiration"
ALL_GOOD=true

# Check gallery directory exists
if [ -d "$GALLERY_PATH" ]; then
    echo "✅ Gallery directory exists: $GALLERY_PATH"
else
    echo "❌ Gallery directory NOT found"
    ALL_GOOD=false
fi

# Check category folders
CATEGORIES=("landing" "protocols" "components" "interactions" "typography")
for category in "${CATEGORIES[@]}"; do
    if [ -d "$GALLERY_PATH/$category" ]; then
        count=$(ls -1 "$GALLERY_PATH/$category"/*.png 2>/dev/null | wc -l)
        echo "✅ Category: $category/ ($count screenshots)"
    else
        echo "❌ Category missing: $category/"
        ALL_GOOD=false
    fi
done

# Check documentation
DOCS=("COLLECTIONS.md" "AESTHETIC_PRINCIPLES.md" "README.md" "SYSTEM_SUMMARY.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$GALLERY_PATH/$doc" ]; then
        size=$(du -h "$GALLERY_PATH/$doc" | awk '{print $1}')
        echo "✅ Documentation: $doc ($size)"
    else
        echo "❌ Missing: $doc"
        ALL_GOOD=false
    fi
done

# Check commands
COMMANDS=("discover" "inspire" "visual-review")
for cmd in "${COMMANDS[@]}"; do
    if [ -f "$HOME/.claude/commands/$cmd.md" ]; then
        echo "✅ Command: /$cmd"
    else
        echo "❌ Missing command: /$cmd"
        ALL_GOOD=false
    fi
done

# Check scripts
SCRIPTS=("populate-gallery.sh" "screenshot-site.sh" "verify-inspiration-system.sh")
for script in "${SCRIPTS[@]}"; do
    if [ -f "$HOME/.claude/scripts/$script" ]; then
        echo "✅ Script: $script"
    else
        echo "⚠️  Optional script missing: $script"
    fi
done

# Total screenshot count
TOTAL=$(find "$GALLERY_PATH" -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "📊 Total screenshots: $TOTAL"

# Final verdict
echo ""
if [ "$ALL_GOOD" = true ] && [ "$TOTAL" -gt 0 ]; then
    echo "✅ SYSTEM READY"
    echo ""
    echo "Commands available:"
    echo "  /discover [project] - Find new examples"
    echo "  /inspire [category] - Analyze existing examples"
    echo "  /visual-review [url] - QA your implementation"
    echo ""
    echo "Gallery: $TOTAL screenshots across ${#CATEGORIES[@]} categories"
    exit 0
else
    echo "❌ SYSTEM NOT READY - Missing components"
    exit 1
fi
