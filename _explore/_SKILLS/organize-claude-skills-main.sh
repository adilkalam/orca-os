#!/bin/bash
# Organize skills from claude-skills-main into existing categories
# This script categorizes individual skills and moves organizational folders

set -euo pipefail

cd "$(dirname "$0")"
SOURCE_DIR="claude-skills-main"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ Error: $SOURCE_DIR directory not found"
  exit 1
fi

echo "🔍 Analyzing skills in $SOURCE_DIR..."

# Create category directories if they don't exist
for cat in 01-development 02-design-creative 03-content-marketing 04-sales 05-business-operations 06-data-analytics 07-sports 08-finance 09-communication 10-meta-skills 11-product 12-project-management 13-education-learning 14-personal-lifestyle 00-organizational; do
  mkdir -p "$cat"
done

# Extract individual skills from engineering-team/ and categorize them
echo "📦 Organizing engineering skills..."
if [ -d "$SOURCE_DIR/engineering-team" ]; then
  for skill_dir in "$SOURCE_DIR/engineering-team"/*; do
    if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
      skill_name=$(basename "$skill_dir")
      case "$skill_name" in
        code-reviewer|senior-architect|senior-backend|senior-computer-vision|senior-data-engineer|senior-data-scientist|senior-devops|senior-frontend|senior-fullstack|senior-ml-engineer|senior-prompt-engineer|senior-qa|senior-secops|senior-security)
          echo "  → Moving $skill_name to 01-development/"
          mv "$skill_dir" 01-development/ 2>/dev/null || true
          ;;
      esac
    fi
  done
  # Move remaining engineering-team organizational files
  if [ -d "$SOURCE_DIR/engineering-team" ]; then
    echo "  → Moving engineering-team/ organizational content to 00-organizational/"
    [ -d "$SOURCE_DIR/engineering-team" ] && mv "$SOURCE_DIR/engineering-team" 00-organizational/ 2>/dev/null || true
  fi
fi

# Extract individual skills from marketing-skill/ and categorize them
echo "📦 Organizing marketing skills..."
if [ -d "$SOURCE_DIR/marketing-skill" ]; then
  for skill_dir in "$SOURCE_DIR/marketing-skill"/*; do
    if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
      skill_name=$(basename "$skill_dir")
      case "$skill_name" in
        content-creator|marketing-demand-acquisition|marketing-strategy-pmm)
          echo "  → Moving $skill_name to 03-content-marketing/"
          mv "$skill_dir" 03-content-marketing/ 2>/dev/null || true
          ;;
      esac
    fi
  done
  # Move remaining marketing-skill organizational files
  if [ -d "$SOURCE_DIR/marketing-skill" ]; then
    echo "  → Moving marketing-skill/ organizational content to 00-organizational/"
    [ -d "$SOURCE_DIR/marketing-skill" ] && mv "$SOURCE_DIR/marketing-skill" 00-organizational/ 2>/dev/null || true
  fi
fi

# Extract individual skills from product-team/ and categorize them
echo "📦 Organizing product skills..."
if [ -d "$SOURCE_DIR/product-team" ]; then
  for skill_dir in "$SOURCE_DIR/product-team"/*; do
    if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
      skill_name=$(basename "$skill_dir")
      case "$skill_name" in
        agile-product-owner|product-manager-toolkit|product-strategist|ui-design-system|ux-researcher-designer)
          echo "  → Moving $skill_name to 11-product/"
          mv "$skill_dir" 11-product/ 2>/dev/null || true
          ;;
      esac
    fi
  done
  # Move remaining product-team organizational files
  if [ -d "$SOURCE_DIR/product-team" ]; then
    echo "  → Moving product-team/ organizational content to 00-organizational/"
    [ -d "$SOURCE_DIR/product-team" ] && mv "$SOURCE_DIR/product-team" 00-organizational/ 2>/dev/null || true
  fi
fi

# Extract individual skills from c-level-advisor/ and categorize them
echo "📦 Organizing C-level advisor skills..."
if [ -d "$SOURCE_DIR/c-level-advisor" ]; then
  for skill_dir in "$SOURCE_DIR/c-level-advisor"/*; do
    if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
      skill_name=$(basename "$skill_dir")
      case "$skill_name" in
        ceo-advisor|cto-advisor)
          echo "  → Moving $skill_name to 05-business-operations/"
          mv "$skill_dir" 05-business-operations/ 2>/dev/null || true
          ;;
      esac
    fi
  done
  # Move remaining c-level-advisor organizational files
  if [ -d "$SOURCE_DIR/c-level-advisor" ]; then
    echo "  → Moving c-level-advisor/ organizational content to 00-organizational/"
    [ -d "$SOURCE_DIR/c-level-advisor" ] && mv "$SOURCE_DIR/c-level-advisor" 00-organizational/ 2>/dev/null || true
  fi
fi

# Move ra-qm-team organizational folder (specialized regulatory/compliance)
echo "📦 Organizing RA/QM team..."
if [ -d "$SOURCE_DIR/ra-qm-team" ]; then
  echo "  → Moving ra-qm-team/ to 00-organizational/"
  mv "$SOURCE_DIR/ra-qm-team" 00-organizational/ 2>/dev/null || true
fi

# Move other organizational folders
echo "📦 Moving organizational folders..."
for org_folder in agents commands documentation project-management standards templates; do
  if [ -d "$SOURCE_DIR/$org_folder" ]; then
    echo "  → Moving $org_folder/ to 00-organizational/"
    mv "$SOURCE_DIR/$org_folder" 00-organizational/ 2>/dev/null || true
  fi
done

# Move root-level files from claude-skills-main
echo "📦 Moving documentation files..."
for file in README.md CHANGELOG.md CLAUDE.md CODE_OF_CONDUCT.md CONTRIBUTING.md LICENSE SECURITY.md; do
  if [ -f "$SOURCE_DIR/$file" ]; then
    # Check if file already exists in root
    if [ ! -f "$file" ]; then
      echo "  → Moving $file to root"
      mv "$SOURCE_DIR/$file" . 2>/dev/null || true
    else
      echo "  → Skipping $file (already exists)"
    fi
  fi
done

# Remove empty claude-skills-main directory
if [ -d "$SOURCE_DIR" ]; then
  remaining=$(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 2>/dev/null | wc -l | tr -d ' ')
  if [ "$remaining" -eq 0 ]; then
    echo "  → Removing empty $SOURCE_DIR/"
    rmdir "$SOURCE_DIR" 2>/dev/null || true
  else
    echo "  → Warning: $SOURCE_DIR/ still contains $remaining items"
    find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 2>/dev/null | head -5
  fi
fi

echo ""
echo "✅ Organization complete!"
echo ""
echo "Summary:"
for dir in */; do
  if [[ "$dir" =~ ^[0-9] ]]; then
    count=$(find "$dir" -maxdepth 1 -type d ! -name "$dir" 2>/dev/null | wc -l | tr -d ' ')
    echo "  $dir: $count skills"
  fi
done

