# stylelint-design-system

Universal Stylelint plugin for preventing design system violations in CSS.

## Rules

### `no-hardcoded-colors`

Prevents hardcoded color values in CSS properties:
- Hex colors: `#D4AF37`, `#D4AF37FF`
- RGB/RGBA: `rgb(201, 169, 97)`, `rgba(201, 169, 97, 0.3)`
- HSL/HSLA: `hsl(43, 74%, 49%)`, `hsla(43, 74%, 49%, 0.3)`
- Named colors: `gold`, `red`, etc.

**Allowed values:**
- CSS variables: `var(--color-accent-gold)`
- Keywords: `transparent`, `currentColor`, `inherit`, `initial`, `unset`

**❌ Incorrect:**
```css
.button {
  color: #D4AF37; /* Hardcoded hex */
  background: rgba(201, 169, 97, 0.3); /* Hardcoded rgba */
  border-color: gold; /* Named color */
}
```

**✅ Correct:**
```css
.button {
  color: var(--color-accent-gold-bright);
  background: var(--color-accent-gold-soft);
  border-color: var(--color-accent-gold);
}
```

## Installation

### Step 1: Install Stylelint (if not already installed)

```bash
npm install --save-dev stylelint
```

### Step 2: Add Plugin to Project

Copy `stylelint-design-system/` to your project root.

### Step 3: Configure Stylelint

Create `.stylelintrc.json`:

```json
{
  "plugins": ["./stylelint-design-system"],
  "rules": {
    "design-system/no-hardcoded-colors": true
  }
}
```

### Step 4: Add to package.json Scripts

```json
{
  "scripts": {
    "stylelint": "stylelint '**/*.{css,scss,module.css}'",
    "stylelint:fix": "stylelint '**/*.{css,scss,module.css}' --fix"
  }
}
```

## Usage

### Command Line

```bash
# Check for violations
npm run stylelint

# Auto-fix (when possible)
npm run stylelint:fix
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npm run stylelint
if [ $? -ne 0 ]; then
  echo "❌ Stylelint violations detected"
  exit 1
fi
```

### IDE Integration

#### VS Code

Install [Stylelint extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

Add to `.vscode/settings.json`:

```json
{
  "stylelint.enable": true,
  "css.validate": false,
  "scss.validate": false
}
```

## Examples

### CSS Modules

```css
/* page.module.css */
.header {
  background: var(--color-background); /* ✅ Correct */
  color: #0c051c; /* ❌ Error: Hardcoded hex color */
}
```

### SCSS

```scss
// styles.scss
.card {
  $gold: #D4AF37; // ❌ Error: Hardcoded hex color
  background: var(--color-surface); // ✅ Correct
  border-color: var(--color-border); // ✅ Correct
}
```

## Configuration Options

Currently, the rule does not have configuration options. Future versions may add:
- `allowedPatterns`: Regex patterns for exceptions
- `colorProperties`: Customize which CSS properties to check
- `allowedKeywords`: Customize allowed color keywords

## Integration with Verification Script

This Stylelint plugin works alongside the verification script:

```bash
# Verification script catches violations
./verify-design-system.sh .

# Stylelint prevents future violations
npm run stylelint
```

## License

MIT
