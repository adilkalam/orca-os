# Phase 1 Prevention - Installation Guide

**Goal:** Block hardcoded colors from being committed
**Time:** 30 minutes per project
**Outcome:** 70/80 → 80/80 compliance (structural prevention)

---

## Overview

Phase 1 implements **3 enforcement layers:**

1. **ESLint** → Blocks hardcoded colors in JSX/TSX (inline styles, Tailwind arbitrary values)
2. **Stylelint** → Blocks hardcoded colors in CSS/SCSS files
3. **Pre-commit Hook** → Prevents commits with violations

**Result:** Developers literally CANNOT commit hardcoded colors

---

## Installation for OBDN

### Step 1: Install Dependencies

```bash
cd ~/Desktop/OBDN/obdn_site

# Install ESLint (if not already installed)
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Install Stylelint
npm install --save-dev stylelint stylelint-config-standard

# Install Husky for pre-commit hooks
npm install --save-dev husky
npx husky install
```

### Step 2: Copy Enforcement Plugins

```bash
# Copy ESLint plugin
cp -r ~/claude-vibe-code/obdn-design-automation/enforcement/eslint-plugin-design-system \
      ~/Desktop/OBDN/obdn_site/

# Copy Stylelint plugin
cp -r ~/claude-vibe-code/obdn-design-automation/enforcement/stylelint-design-system \
      ~/Desktop/OBDN/obdn_site/
```

### Step 3: Configure ESLint

Create or update `.eslintrc.js`:

```javascript
// ~/Desktop/OBDN/obdn_site/.eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    './eslint-plugin-design-system/configs/recommended',
  ],
  plugins: ['./eslint-plugin-design-system'],
  rules: {
    'design-system/no-hardcoded-colors': 'error',
  },
};
```

### Step 4: Configure Stylelint

Create `.stylelintrc.json`:

```json
{
  "extends": "stylelint-config-standard",
  "plugins": ["./stylelint-design-system"],
  "rules": {
    "design-system/no-hardcoded-colors": true
  }
}
```

### Step 5: Add Scripts to package.json

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "stylelint": "stylelint '**/*.{css,module.css}'",
    "stylelint:fix": "stylelint '**/*.{css,module.css}' --fix",
    "verify": "~/claude-vibe-code/obdn-design-automation/projects/obdn/verify-design-system.sh ."
  }
}
```

### Step 6: Install Pre-commit Hook

```bash
# Copy pre-commit hook
cp ~/claude-vibe-code/obdn-design-automation/enforcement/hooks/pre-commit \
   ~/Desktop/OBDN/obdn_site/.husky/pre-commit

# Make executable
chmod +x ~/Desktop/OBDN/obdn_site/.husky/pre-commit
```

### Step 7: Test Enforcement

```bash
cd ~/Desktop/OBDN/obdn_site

# Test ESLint
npm run lint

# Test Stylelint
npm run stylelint

# Test verification
npm run verify

# Test pre-commit hook
git add .
git commit -m "test: verify enforcement works"
# Should block if violations exist
```

---

## Installation for peptidefoxv2

### Step 1: Install Dependencies

```bash
cd ~/Desktop/OBDN/peptidefoxv2

# Install ESLint (if not already installed)
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Install Stylelint
npm install --save-dev stylelint stylelint-config-standard

# Install Husky
npm install --save-dev husky
npx husky install
```

### Step 2: Copy Enforcement Plugins

```bash
# Copy ESLint plugin
cp -r ~/claude-vibe-code/obdn-design-automation/enforcement/eslint-plugin-design-system \
      ~/Desktop/OBDN/peptidefoxv2/

# Copy Stylelint plugin
cp -r ~/claude-vibe-code/obdn-design-automation/enforcement/stylelint-design-system \
      ~/Desktop/OBDN/peptidefoxv2/
```

### Step 3: Configure ESLint

Create `.eslintrc.js`:

```javascript
// ~/Desktop/OBDN/peptidefoxv2/.eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    './eslint-plugin-design-system/configs/recommended',
  ],
  plugins: ['./eslint-plugin-design-system'],
  rules: {
    'design-system/no-hardcoded-colors': 'error',
  },
};
```

### Step 4: Configure Stylelint

Create `.stylelintrc.json`:

```json
{
  "extends": "stylelint-config-standard",
  "plugins": ["./stylelint-design-system"],
  "rules": {
    "design-system/no-hardcoded-colors": true
  }
}
```

### Step 5: Add Scripts to package.json

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "stylelint": "stylelint '**/*.{css,module.css}'",
    "stylelint:fix": "stylelint '**/*.{css,module.css}' --fix"
  }
}
```

### Step 6: Create peptidefoxv2 Verification Script

```bash
# Copy OBDN verification script as template
cp ~/claude-vibe-code/obdn-design-automation/projects/obdn/verify-design-system.sh \
   ~/claude-vibe-code/obdn-design-automation/projects/peptidefoxv2/verify-design-system.sh

# Note: This uses OBDN rules as baseline. To customize:
# 1. Create projects/peptidefoxv2/design-rules.json
# 2. Update verification script to use peptidefoxv2 rules
```

### Step 7: Install Pre-commit Hook

```bash
# Copy pre-commit hook
cp ~/claude-vibe-code/obdn-design-automation/enforcement/hooks/pre-commit \
   ~/Desktop/OBDN/peptidefoxv2/.husky/pre-commit

# Make executable
chmod +x ~/Desktop/OBDN/peptidefoxv2/.husky/pre-commit
```

---

## Verification

### Test on Known Violations

**OBDN tracker (known violations):**
```bash
cd ~/Desktop/OBDN/obdn_site

# Should detect 3 hardcoded colors
npm run lint app/protocols/tracker/page.module.css
npm run stylelint app/protocols/tracker/page.module.css
```

**Expected output:**
```
❌ app/protocols/tracker/page.module.css
  200:3  ✖  Hardcoded hex color "#D4AF37" in "color" not allowed
  201:3  ✖  Hardcoded hex color "#D4AF37" in "border-bottom-color" not allowed
  481:3  ✖  Hardcoded hex color "#D4AF37" in "color" not allowed
```

### Test Pre-commit Hook

```bash
# Try to commit file with violations
git add app/protocols/tracker/page.module.css
git commit -m "test: should be blocked"

# Expected: Commit blocked with violation details
```

---

## Expected Results

### Before Phase 1
| Project | Score | Violations | Can Commit? |
|---------|-------|------------|-------------|
| OBDN    | 70/80 | 3 colors   | ✅ Yes      |
| peptide | 70/80 | ~10 colors | ✅ Yes      |

### After Phase 1
| Project | Score | Violations | Can Commit? |
|---------|-------|------------|-------------|
| OBDN    | 70/80 | 3 colors   | ❌ No       |
| peptide | 70/80 | ~10 colors | ❌ No       |

**Note:** Score stays same, but NEW violations are PREVENTED

### After Fixing Existing Violations
| Project | Score | Violations | Can Commit? |
|---------|-------|------------|-------------|
| OBDN    | 80/80 | 0 colors   | ✅ Yes      |
| peptide | 80/80 | 0 colors   | ✅ Yes      |

---

## Troubleshooting

### ESLint: "Cannot find module './eslint-plugin-design-system'"

**Fix:**
```bash
# Ensure plugin is in project root
ls -la eslint-plugin-design-system/

# Check .eslintrc.js path
# Should be: './eslint-plugin-design-system'
# NOT: '~/claude-vibe-code/...'
```

### Stylelint: "Unknown rule design-system/no-hardcoded-colors"

**Fix:**
```bash
# Ensure plugin is in project root
ls -la stylelint-design-system/

# Check .stylelintrc.json
# Should have both "plugins" and "rules"
```

### Pre-commit Hook Not Running

**Fix:**
```bash
# Ensure Husky is installed
npx husky install

# Make hook executable
chmod +x .husky/pre-commit

# Test directly
./.husky/pre-commit
```

### False Positives

**Scenario:** ESLint flags legitimate usage

**Temporary Fix:**
```javascript
// eslint-disable-next-line design-system/no-hardcoded-colors
const color = '#D4AF37'; // Coming from external API
```

**Permanent Fix:**
Add to `.eslintrc.js`:
```javascript
{
  rules: {
    'design-system/no-hardcoded-colors': ['error', {
      allowedPatterns: ['external-api', 'third-party-lib'],
    }],
  },
}
```

---

## Next Steps

After Phase 1 installation:

1. **Fix existing violations**
   - Run: `npm run lint:fix`
   - Run: `npm run stylelint:fix`
   - Manually fix remaining issues

2. **Verify score improvement**
   - Run: `npm run verify`
   - Target: 80/80 (100%)

3. **Continue to Phase 2**
   - Build component library (Stack, Box)
   - Add semantic spacing props
   - Reduce inline styles

---

**Installation Time:** ~30 minutes
**Expected Score Improvement:** 70/80 → 80/80 (after fixing)
**Prevention Rate:** ~80% (blocks hardcoded colors)
**Status:** ✅ Ready to deploy

---

**Questions?** Check enforcement plugin READMEs or verification script docs.
