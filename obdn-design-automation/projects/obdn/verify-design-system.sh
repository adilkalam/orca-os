#!/bin/bash

# OBDN Design System Static Analysis Verification
# Version 3.0.0
# Checks for instant-fail violations using grep patterns from design-rules.json

set -euo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RULES_FILE="${SCRIPT_DIR}/design-rules.json"
TARGET_DIR="${1:-.}"
SCORE=0
MAX_SCORE=80
VIOLATIONS=()

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  OBDN Design System Static Analysis Verification v3.0.0  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Target Directory: ${TARGET_DIR}"
echo "Rules File: ${RULES_FILE}"
echo ""

# Verify rules file exists
if [[ ! -f "$RULES_FILE" ]]; then
    echo -e "${RED}ERROR: Rules file not found: ${RULES_FILE}${NC}"
    exit 1
fi

# Find all relevant files (CSS, TSX, JSX, TS, JS)
FILES=$(find "$TARGET_DIR" -type f \( -name "*.css" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.ts" -o -name "*.js" \) ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" ! -path "*/build/*")
FILE_COUNT=$(echo "$FILES" | wc -l | tr -d ' ')

echo "Analyzing ${FILE_COUNT} files..."
echo ""

# ============================================================================
# INSTANT FAIL CHECK 1: Bento Grid Wrapper Divs (Rule 9d)
# ============================================================================
echo -e "${BLUE}[1/8] Checking Rule 9d: Bento Grid Structural Integrity...${NC}"

WRAPPER_DIVS=$(echo "$FILES" | xargs grep -n "bento-grid" 2>/dev/null | grep -E "bentoRow|bento-content" || true)

if [[ -z "$WRAPPER_DIVS" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - No wrapper divs detected in bento grids"
    SCORE=$((SCORE + 10))
else
    echo -e "${RED}✗ INSTANT FAIL${NC} - Wrapper divs detected in bento grids"
    echo "$WRAPPER_DIVS"
    VIOLATIONS+=("Rule 9d: Wrapper divs in bento grid (.bentoRow or .bento-content)")
fi

SPACER_CLASSNAMES=$(echo "$FILES" | xargs grep -n "className=\"spacer\"" 2>/dev/null || true)

if [[ -z "$SPACER_CLASSNAMES" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - No <div className=\"spacer\"> detected"
else
    echo -e "${RED}✗ INSTANT FAIL${NC} - Spacers must be <div></div> NOT <div className=\"spacer\">"
    echo "$SPACER_CLASSNAMES"
    VIOLATIONS+=("Rule 9d: Spacers with className instead of empty divs")
fi

echo ""

# ============================================================================
# INSTANT FAIL CHECK 2: Domaine Sans Display Minimum Size
# ============================================================================
echo -e "${BLUE}[2/8] Checking Domaine Sans Display minimum 24px...${NC}"

# Check for Domaine with sizes below 24px (10-23px)
DOMAINE_VIOLATIONS=$(echo "$FILES" | xargs grep -Ei "domaine.*(?:1[0-9]|2[0-3])px|domaine.*text-(xs|sm|base|lg)" 2>/dev/null || true)

if [[ -z "$DOMAINE_VIOLATIONS" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - All Domaine Sans Display usage ≥24px"
    SCORE=$((SCORE + 10))
else
    echo -e "${RED}✗ INSTANT FAIL${NC} - Domaine Sans Display used below 24px minimum"
    echo "$DOMAINE_VIOLATIONS"
    VIOLATIONS+=("Domaine Sans Display minimum 24px: Size violations detected")
fi

echo ""

# ============================================================================
# INSTANT FAIL CHECK 3: Supreme LL Labels - Never Italic
# ============================================================================
echo -e "${BLUE}[3/8] Checking Supreme LL labels (Regular 400, never italic)...${NC}"

# Check for uppercase labels with italic style
SUPREME_ITALIC=$(echo "$FILES" | xargs grep -n "text-transform.*uppercase" 2>/dev/null | grep -i "italic" || true)

if [[ -z "$SUPREME_ITALIC" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - No italic uppercase labels detected"
    SCORE=$((SCORE + 10))
else
    echo -e "${RED}✗ INSTANT FAIL${NC} - Supreme LL labels must NEVER be italic"
    echo "$SUPREME_ITALIC"
    VIOLATIONS+=("Supreme LL labels: Italic style detected on uppercase labels")
fi

echo ""

# ============================================================================
# INSTANT FAIL CHECK 4: CSS Variables Mandatory
# ============================================================================
echo -e "${BLUE}[4/8] Checking CSS variable usage (no hardcoded colors)...${NC}"

# Check for hardcoded rgba/rgb colors (but allow var() usage)
HARDCODED_COLORS=$(echo "$FILES" | xargs grep -Eni "(?<!var\()rgba?\([0-9, .]+\)" 2>/dev/null | grep -v "var(--" | head -20 || true)

if [[ -z "$HARDCODED_COLORS" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - All colors use CSS variables"
    SCORE=$((SCORE + 10))
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Hardcoded color values detected (first 20 instances):"
    echo "$HARDCODED_COLORS"
    echo ""
    echo -e "${YELLOW}Note: Review these - may include exceptions for opacity or gradients${NC}"
    VIOLATIONS+=("CSS Variables: Hardcoded color values detected")
fi

# Check for hardcoded hex colors
HARDCODED_HEX=$(echo "$FILES" | xargs grep -Eni "#[0-9a-fA-F]{3,8}" 2>/dev/null | grep -v "var(--" | grep -v "comment" | head -20 || true)

if [[ -z "$HARDCODED_HEX" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - No hardcoded hex colors"
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Hardcoded hex colors detected (first 20 instances):"
    echo "$HARDCODED_HEX"
    VIOLATIONS+=("CSS Variables: Hardcoded hex color values detected")
fi

echo ""

# ============================================================================
# INSTANT FAIL CHECK 5: Spacing Tokens Only
# ============================================================================
echo -e "${BLUE}[5/8] Checking spacing tokens (no random pixel values)...${NC}"

# Allowed spacing values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 144, 160, 256
# Check for random spacing in padding/margin/gap
RANDOM_SPACING=$(echo "$FILES" | xargs grep -Eni "(padding|margin|gap).*(?<!var\(--space-)(?:5|6|7|9|1[01345789]|2[1235789]|3[013-9]|4[1-9]|5[0-9]|6[1-35-9]|7[0-9]|8[1-9]|9[0-57-9]|1[0-1][0-9]|12[1-9]|1[3-9][0-9]|2[0-46-9][0-9]|3[0-9]{2,})px" 2>/dev/null | head -20 || true)

if [[ -z "$RANDOM_SPACING" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - All spacing uses approved tokens"
    SCORE=$((SCORE + 10))
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Random spacing values detected (first 20 instances):"
    echo "$RANDOM_SPACING"
    echo ""
    echo "Allowed values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 144, 160, 256"
    echo "Exceptions: 1-2px optical corrections only"
    VIOLATIONS+=("Spacing Tokens: Random pixel values detected")
fi

echo ""

# ============================================================================
# ADDITIONAL CHECK 6: Font Weight Consistency
# ============================================================================
echo -e "${BLUE}[6/8] Checking font weight consistency...${NC}"

# Check for Supreme LL labels with wrong weights
SUPREME_WEIGHT_VIOLATIONS=$(echo "$FILES" | xargs grep -n "text-transform.*uppercase" 2>/dev/null | grep -E "font-weight.*(300|500|600|700)" || true)

if [[ -z "$SUPREME_WEIGHT_VIOLATIONS" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - Supreme LL labels use Regular 400 weight"
    SCORE=$((SCORE + 10))
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Supreme LL labels should use Regular 400 weight"
    echo "$SUPREME_WEIGHT_VIOLATIONS"
    VIOLATIONS+=("Font Weight: Supreme LL labels using non-400 weight")
fi

echo ""

# ============================================================================
# ADDITIONAL CHECK 7: Grid Structure Validation
# ============================================================================
echo -e "${BLUE}[7/8] Checking grid structure for card alignment...${NC}"

# Check for flexbox on card grids (should use CSS Grid)
FLEXBOX_GRIDS=$(echo "$FILES" | xargs grep -n "display.*flex" 2>/dev/null | grep -i "card.*grid\|grid.*card" || true)

if [[ -z "$FLEXBOX_GRIDS" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - Card grids use CSS Grid (not flexbox)"
    SCORE=$((SCORE + 10))
else
    echo -e "${YELLOW}⚠ ADVISORY${NC} - Flexbox detected in card grid contexts (review for alignment):"
    echo "$FLEXBOX_GRIDS"
    # Not adding to violations - might be intentional for some layouts
fi

echo ""

# ============================================================================
# ADDITIONAL CHECK 8: Component Compliance
# ============================================================================
echo -e "${BLUE}[8/8] Checking component compliance patterns...${NC}"

# Check for inline styles (should use CSS modules or Tailwind with tokens)
INLINE_STYLES=$(echo "$FILES" | xargs grep -n "style={{" 2>/dev/null | head -10 || true)

if [[ -z "$INLINE_STYLES" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - No inline styles detected"
    SCORE=$((SCORE + 10))
else
    echo -e "${YELLOW}⚠ ADVISORY${NC} - Inline styles detected (first 10 instances):"
    echo "$INLINE_STYLES"
    echo ""
    echo "Consider using CSS modules or design tokens"
    # Not adding to violations - might be necessary for dynamic values
fi

echo ""

# ============================================================================
# SUMMARY
# ============================================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    VERIFICATION SUMMARY                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

PERCENTAGE=$((SCORE * 100 / MAX_SCORE))

if [[ $PERCENTAGE -ge 90 ]]; then
    COLOR=$GREEN
    STATUS="EXCELLENT"
elif [[ $PERCENTAGE -ge 72 ]]; then
    COLOR=$BLUE
    STATUS="PASS"
elif [[ $PERCENTAGE -ge 50 ]]; then
    COLOR=$YELLOW
    STATUS="NEEDS WORK"
else
    COLOR=$RED
    STATUS="FAIL"
fi

echo -e "${COLOR}Score: ${SCORE}/${MAX_SCORE} (${PERCENTAGE}%)${NC}"
echo -e "Status: ${COLOR}${STATUS}${NC}"
echo ""

if [[ ${#VIOLATIONS[@]} -gt 0 ]]; then
    echo -e "${RED}Violations Found (${#VIOLATIONS[@]}):${NC}"
    for violation in "${VIOLATIONS[@]}"; do
        echo -e "  ${RED}•${NC} $violation"
    done
    echo ""
fi

echo "Minimum passing score: 72/80 (90% compliance)"
echo ""

if [[ $SCORE -ge 72 ]]; then
    echo -e "${GREEN}✓ Design system verification PASSED${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review warnings (if any) for potential improvements"
    echo "  2. Run visual verification workflow for screenshot validation"
    echo "  3. Proceed with implementation"
    exit 0
else
    echo -e "${RED}✗ Design system verification FAILED${NC}"
    echo ""
    echo "Required actions:"
    echo "  1. Fix all INSTANT FAIL violations immediately"
    echo "  2. Address warnings to improve compliance score"
    echo "  3. Re-run verification until score ≥72/80"
    echo "  4. Review design-rules.json for complete specifications"
    exit 1
fi
