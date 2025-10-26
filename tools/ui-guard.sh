#!/bin/bash

# UI Guard - iOS Layout Law Enforcement
# Catches visual violations BEFORE build
# Usage: ./tools/ui-guard.sh [path-to-swift-files]

set -e

TARGET_DIR="${1:-.}"
VIOLATIONS=0
REPORT_FILE=".orchestration/verification/ui-guard-report.md"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🛡️  UI Guard - Layout Law Enforcement"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create report directory
mkdir -p .orchestration/verification

# Initialize report
cat > "$REPORT_FILE" <<REPORT
# UI Guard Report
**Date:** $(date)
**Target:** $TARGET_DIR

## Violations Found

REPORT

# Rule 0: Design DNA MUST exist (No DNA, no design)
echo "Checking Rule 0: Design DNA existence..."

# Detect project from Swift files
PROJECT_NAME=$(grep -r "struct.*App:" "$TARGET_DIR" --include="*.swift" 2>/dev/null | head -1 | sed 's/.*struct \(.*\)App:.*/\1/' | tr '[:upper:]' '[:lower:]' || echo "unknown")

# Check for project-specific DNA
DNA_FILE=".claude/design-dna/${PROJECT_NAME}.json"
DNA_UNIVERSAL=".claude/design-dna/universal-taste.json"

if [ ! -f "$DNA_FILE" ] && [ ! -f "$DNA_UNIVERSAL" ]; then
  echo -e "${RED}❌ BLOCKING: No Design DNA found for project '$PROJECT_NAME'${NC}"
  echo "" >> "$REPORT_FILE"
  echo "### ❌ BLOCKING: Design DNA Missing" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "**Project:** $PROJECT_NAME" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "**Rule:** No DNA, no design. Design DNA schemas are MANDATORY before UI work." >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "**Required files:**" >> "$REPORT_FILE"
  echo "- \`.claude/design-dna/${PROJECT_NAME}.json\` (project-specific DNA)" >> "$REPORT_FILE"
  echo "- \`.claude/design-dna/universal-taste.json\` (fallback)" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "**Action:** Create Design DNA schema before implementing UI." >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "## Verdict" >> "$REPORT_FILE"
  echo "❌ **HARD BLOCKED** - Design DNA missing. UI work cannot proceed without design constraints." >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "Report saved: $REPORT_FILE"
  exit 1
elif [ -f "$DNA_FILE" ]; then
  echo -e "${GREEN}✅ Design DNA found: $DNA_FILE${NC}"
  echo "" >> "$REPORT_FILE"
  echo "### ✅ Design DNA Loaded" >> "$REPORT_FILE"
  echo "**Schema:** \`$DNA_FILE\`" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
else
  echo -e "${YELLOW}⚠️  Using universal DNA (no project-specific schema)${NC}"
  echo "" >> "$REPORT_FILE"
  echo "### ⚠️  Using Universal DNA" >> "$REPORT_FILE"
  echo "**Schema:** \`$DNA_UNIVERSAL\` (no project-specific DNA found)" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
fi
echo ""

# Rule 1: Spacing must be multiples of 4px (2pt in iOS)
echo "Checking Rule 1: Spacing multiples of 4px/2pt..."
SPACING_VIOLATIONS=$(grep -r "\.padding\|\.spacing\|\.frame.*width:\|\.frame.*height:" "$TARGET_DIR" --include="*.swift" 2>/dev/null | \
  grep -E "\.padding\([0-9]+\)|\.spacing\([0-9]+\)|width: [0-9]+|height: [0-9]+" | \
  grep -Ev "\.padding\((4|8|12|16|20|24|28|32|36|40|44|48)\)|\.spacing\((4|8|12|16|20|24|28|32|36|40|44|48)\)|width: (44|88|132|176|220|264|308|352)|height: (44|88|132|176|220|264|308|352)" || true)

if [ -n "$SPACING_VIOLATIONS" ]; then
  echo -e "${RED}❌ CRITICAL: Found spacing not using 4px/2pt multiples${NC}"
  echo "$SPACING_VIOLATIONS"
  echo "" >> "$REPORT_FILE"
  echo "### ❌ CRITICAL: Spacing Violations (must be multiples of 4px/2pt)" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  echo "$SPACING_VIOLATIONS" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✅ Spacing multiples check passed${NC}"
fi
echo ""

# Rule 2: Minimum hit areas ≥ 44pt
echo "Checking Rule 2: Hit areas ≥ 44pt..."
HIT_AREA_VIOLATIONS=$(grep -r "\.frame(width:" "$TARGET_DIR" --include="*.swift" 2>/dev/null | \
  grep -E "width: [0-9]+" | \
  awk -F'width: ' '{print $2}' | \
  awk -F'[,)]' '{if ($1 < 44) print}' || true)

if [ -n "$HIT_AREA_VIOLATIONS" ]; then
  echo -e "${RED}❌ CRITICAL: Found hit areas < 44pt${NC}"
  echo "" >> "$REPORT_FILE"
  echo "### ❌ CRITICAL: Hit Area Violations (minimum 44pt)" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  grep -r "\.frame(width:" "$TARGET_DIR" --include="*.swift" 2>/dev/null | grep -E "width: [0-9]+" >> "$REPORT_FILE" || true
  echo '```' >> "$REPORT_FILE"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✅ Hit area check passed${NC}"
fi
echo ""

# Rule 3: No hardcoded colors
echo "Checking Rule 3: No hardcoded colors..."
HARDCODED_COLORS=$(grep -r "Color(red:\|Color(hue:\|Color\.init(red:\|#colorLiteral\|UIColor(red:" "$TARGET_DIR" --include="*.swift" 2>/dev/null || true)

if [ -n "$HARDCODED_COLORS" ]; then
  echo -e "${RED}❌ CRITICAL: Found hardcoded colors${NC}"
  echo "$HARDCODED_COLORS"
  echo "" >> "$REPORT_FILE"
  echo "### ❌ CRITICAL: Hardcoded Color Violations (use DesignTokens.swift)" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  echo "$HARDCODED_COLORS" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✅ No hardcoded colors${NC}"
fi
echo ""

# Rule 4: No hardcoded font sizes
echo "Checking Rule 4: No hardcoded font sizes..."
HARDCODED_FONTS=$(grep -r "\.font(\.system(size:\|Font\.system(size:" "$TARGET_DIR" --include="*.swift" 2>/dev/null || true)

if [ -n "$HARDCODED_FONTS" ]; then
  echo -e "${RED}❌ CRITICAL: Found hardcoded font sizes${NC}"
  echo "$HARDCODED_FONTS"
  echo "" >> "$REPORT_FILE"
  echo "### ❌ CRITICAL: Hardcoded Font Violations (use DesignTokens.swift)" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  echo "$HARDCODED_FONTS" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✅ No hardcoded fonts${NC}"
fi
echo ""

# Rule 5: Animation duration ≤ 0.3s
echo "Checking Rule 5: Animation duration ≤ 0.3s..."
ANIMATION_VIOLATIONS=$(grep -r "\.animation\|withAnimation" "$TARGET_DIR" --include="*.swift" 2>/dev/null | \
  grep -E "duration: [0-9.]+|\.easeInOut\([0-9.]+\)" | \
  awk -F'duration: |\.easeInOut\\(' '{print $2}' | \
  awk -F'[,)]' '{if ($1 > 0.3) print}' || true)

if [ -n "$ANIMATION_VIOLATIONS" ]; then
  echo -e "${YELLOW}⚠️  WARNING: Found animations > 0.3s${NC}"
  echo "" >> "$REPORT_FILE"
  echo "### ⚠️  WARNING: Animation Duration Violations (max 0.3s)" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  grep -r "\.animation\|withAnimation" "$TARGET_DIR" --include="*.swift" 2>/dev/null | \
    grep -E "duration: [0-9.]+|\.easeInOut\([0-9.]+\)" >> "$REPORT_FILE" || true
  echo '```' >> "$REPORT_FILE"
  # Don't count as blocking violation, just warn
else
  echo -e "${GREEN}✅ Animation duration check passed${NC}"
fi
echo ""

# Rule 6: Accessibility labels/IDs present
echo "Checking Rule 6: Accessibility labels/IDs..."
# Find all Button, TextField, Toggle views without accessibility
MISSING_A11Y=$(grep -r "Button\|TextField\|Toggle" "$TARGET_DIR" --include="*.swift" 2>/dev/null -A 3 | \
  grep -v "\.accessibilityLabel\|\.accessibilityIdentifier" || true)

if [ -n "$MISSING_A11Y" ]; then
  echo -e "${YELLOW}⚠️  WARNING: Found interactive elements without accessibility${NC}"
  echo "" >> "$REPORT_FILE"
  echo "### ⚠️  WARNING: Missing Accessibility Labels/IDs" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  echo "$MISSING_A11Y" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  # Don't count as blocking violation for now
else
  echo -e "${GREEN}✅ Accessibility check passed${NC}"
fi
echo ""

# Final verdict
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $VIOLATIONS -gt 0 ]; then
  echo -e "${RED}❌ UI Guard FAILED: $VIOLATIONS critical violation(s) found${NC}"
  echo "" >> "$REPORT_FILE"
  echo "## Verdict" >> "$REPORT_FILE"
  echo "❌ **BLOCKED** - $VIOLATIONS critical violation(s) must be fixed before build." >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "Report saved: $REPORT_FILE"
  exit 1
else
  echo -e "${GREEN}✅ UI Guard PASSED: All layout laws satisfied${NC}"
  echo "" >> "$REPORT_FILE"
  echo "## Verdict" >> "$REPORT_FILE"
  echo "✅ **PASSED** - All critical layout laws satisfied." >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "Report saved: $REPORT_FILE"
  exit 0
fi
