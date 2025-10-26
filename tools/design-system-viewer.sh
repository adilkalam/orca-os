#!/bin/bash

# Design System Viewer - Convert project's design-system.md to HTML
# Usage: Run this IN YOUR PROJECT directory
#   cd /path/to/your/project
#   /path/to/claude-vibe-code/tools/design-system-viewer.sh [--open]

set -e

# Look for design-system.md in current directory or docs/
if [ -f "design-system.md" ]; then
  DESIGN_SYSTEM_MD="design-system.md"
elif [ -f "docs/design-system.md" ]; then
  DESIGN_SYSTEM_MD="docs/design-system.md"
else
  echo "❌ ERROR: design-system.md not found"
  echo ""
  echo "This tool looks for your project's design system documentation:"
  echo "  - ./design-system.md"
  echo "  - ./docs/design-system.md"
  echo ""
  echo "Create this file in YOUR PROJECT first."
  echo ""
  echo "Example:"
  echo "  cd /path/to/your/project"
  echo "  touch design-system.md"
  echo "  # Document your design system"
  exit 1
fi

OUTPUT_HTML="design-system.html"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🎨 Design System Viewer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ Found: $DESIGN_SYSTEM_MD${NC}"
echo ""

# Generate HTML with enhanced styling
cat > "$OUTPUT_HTML" << 'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design System Reference</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --bg-primary: #0C051C;
      --bg-secondary: #1A1625;
      --bg-elevated: #2A2435;
      --text-primary: #FFFFFF;
      --text-body: rgba(255, 255, 255, 0.75);
      --text-secondary: rgba(255, 255, 255, 0.5);
      --accent-gold: #C9A961;
      --accent-purple: #8B5CF6;
      --border: rgba(255, 255, 255, 0.1);
      --spacing-base: 4px;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
      background: var(--bg-primary);
      color: var(--text-body);
      line-height: 1.6;
      padding: calc(var(--spacing-base) * 8);
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: var(--text-primary);
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: calc(var(--spacing-base) * 4);
      padding-bottom: calc(var(--spacing-base) * 4);
      border-bottom: 1px solid var(--border);
    }

    h2 {
      color: var(--text-primary);
      font-size: 1.75rem;
      font-weight: 400;
      margin-top: calc(var(--spacing-base) * 12);
      margin-bottom: calc(var(--spacing-base) * 4);
    }

    h3 {
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 500;
      margin-top: calc(var(--spacing-base) * 8);
      margin-bottom: calc(var(--spacing-base) * 3);
    }

    h4 {
      color: var(--accent-gold);
      font-size: 1rem;
      font-weight: 600;
      margin-top: calc(var(--spacing-base) * 6);
      margin-bottom: calc(var(--spacing-base) * 2);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    p {
      margin-bottom: calc(var(--spacing-base) * 4);
    }

    code {
      background: var(--bg-elevated);
      padding: calc(var(--spacing-base) * 1) calc(var(--spacing-base) * 2);
      border-radius: calc(var(--spacing-base) * 1);
      font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
      color: var(--accent-purple);
    }

    pre {
      background: var(--bg-secondary);
      padding: calc(var(--spacing-base) * 4);
      border-radius: calc(var(--spacing-base) * 2);
      overflow-x: auto;
      margin-bottom: calc(var(--spacing-base) * 4);
      border: 1px solid var(--border);
    }

    pre code {
      background: transparent;
      padding: 0;
      color: var(--text-body);
    }

    ul, ol {
      margin-left: calc(var(--spacing-base) * 6);
      margin-bottom: calc(var(--spacing-base) * 4);
    }

    li {
      margin-bottom: calc(var(--spacing-base) * 2);
    }

    strong {
      color: var(--text-primary);
      font-weight: 600;
    }

    em {
      color: var(--accent-gold);
      font-style: normal;
    }

    blockquote {
      border-left: calc(var(--spacing-base) * 1) solid var(--accent-gold);
      padding-left: calc(var(--spacing-base) * 4);
      margin: calc(var(--spacing-base) * 4) 0;
      color: var(--text-secondary);
      font-style: italic;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: calc(var(--spacing-base) * 4);
      background: var(--bg-secondary);
      border-radius: calc(var(--spacing-base) * 2);
      overflow: hidden;
    }

    th, td {
      padding: calc(var(--spacing-base) * 3);
      text-align: left;
      border-bottom: 1px solid var(--border);
    }

    th {
      background: var(--bg-elevated);
      color: var(--text-primary);
      font-weight: 600;
    }

    hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: calc(var(--spacing-base) * 8) 0;
    }

    .meta {
      background: var(--bg-secondary);
      padding: calc(var(--spacing-base) * 4);
      border-radius: calc(var(--spacing-base) * 2);
      margin-bottom: calc(var(--spacing-base) * 8);
      border-left: calc(var(--spacing-base) * 1) solid var(--accent-purple);
    }

    .meta p {
      margin-bottom: calc(var(--spacing-base) * 2);
    }

    .meta p:last-child {
      margin-bottom: 0;
    }

    a {
      color: var(--accent-purple);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }

    a:hover {
      border-bottom-color: var(--accent-purple);
    }
  </style>
</head>
<body>
HTML

# Add metadata
cat >> "$OUTPUT_HTML" << ENDMETA
<div class='meta'>
<p><strong>Project:</strong> $(basename "$(pwd)")</p>
<p><strong>Source:</strong> <code>$DESIGN_SYSTEM_MD</code></p>
<p><strong>Generated:</strong> $(date)</p>
</div>
ENDMETA

# Convert markdown to HTML (basic)
sed -e 's/^# \(.*\)/<h1>\1<\/h1>/' \
    -e 's/^## \(.*\)/<h2>\1<\/h2>/' \
    -e 's/^### \(.*\)/<h3>\1<\/h3>/' \
    -e 's/^#### \(.*\)/<h4>\1<\/h4>/' \
    -e 's/^\*\*\(.*\)\*\*/<strong>\1<\/strong>/g' \
    -e 's/^\*\(.*\)\*/<em>\1<\/em>/g' \
    -e 's/^- /<li>/g' \
    -e 's/^---$/<hr>/g' \
    -e 's/^$/<\/p><p>/g' \
    "$DESIGN_SYSTEM_MD" >> "$OUTPUT_HTML"

cat >> "$OUTPUT_HTML" << 'HTML'
</body>
</html>
HTML

ABS_PATH="$(pwd)/$OUTPUT_HTML"

echo -e "${GREEN}✅ HTML generated: $OUTPUT_HTML${NC}"
echo ""
echo "📍 file://$ABS_PATH"
echo ""

if [ "$1" = "--open" ]; then
  echo "🌐 Opening in browser..."
  if command -v open &> /dev/null; then
    open "$ABS_PATH"
  elif command -v xdg-open &> /dev/null; then
    xdg-open "$ABS_PATH"
  else
    echo -e "${YELLOW}⚠️  Could not auto-open${NC}"
    echo "Open manually: file://$ABS_PATH"
  fi
fi

echo ""
echo "Next steps:"
echo "  1. Review design-system.html in browser"
echo "  2. Manually create .claude/design-dna/{project}.json from this"
echo "  3. Run ui-guard.sh to verify DNA enforcement"
