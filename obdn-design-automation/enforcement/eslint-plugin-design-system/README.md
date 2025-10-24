# eslint-plugin-design-system

Universal ESLint plugin for preventing design system violations.

## Rules

### `no-hardcoded-colors`

Prevents hardcoded color values in:
- Inline styles: `<div style={{ color: '#D4AF37' }}>`
- Tailwind arbitrary values: `<div className="text-[#D4AF37]">`
- Style objects: `const styles = { color: '#D4AF37' }`
- CSS-in-JS: `css\`color: #D4AF37;\``

**❌ Incorrect:**
```jsx
// Inline style with hex
<div style={{ color: '#D4AF37' }}>Gold text</div>

// Tailwind arbitrary color
<div className="bg-[#10172a] text-[#e2e8f0]">Content</div>

// Style object
const styles = {
  color: '#D4AF37',
  backgroundColor: 'rgba(201, 169, 97, 0.3)',
};
```

**✅ Correct:**
```jsx
// Use CSS variables
<div style={{ color: 'var(--color-accent-gold-bright)' }}>Gold text</div>

// Use Tailwind design token classes
<div className="bg-surface text-primary">Content</div>

// Use CSS variables in style objects
const styles = {
  color: 'var(--color-accent-gold-bright)',
  backgroundColor: 'var(--color-accent-gold-soft)',
};
```

## Installation

### Option 1: Local Plugin (Recommended)

1. Copy `eslint-plugin-design-system/` to your project root
2. Update `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ['./eslint-plugin-design-system'],
  rules: {
    'design-system/no-hardcoded-colors': 'error',
  },
};
```

### Option 2: Use Recommended Config

```javascript
module.exports = {
  extends: ['./eslint-plugin-design-system/configs/recommended'],
};
```

## Configuration

### Allow Specific Patterns

```javascript
module.exports = {
  rules: {
    'design-system/no-hardcoded-colors': ['error', {
      // Allow specific hex colors (e.g., for third-party libraries)
      allowedPatterns: [
        'react-calendar', // Allow in react-calendar imports
        'node_modules',   // Allow in node_modules
      ],
      // Customize CSS variable pattern
      cssVariablePattern: '--color-', // Default
    }],
  },
};
```

## Usage with Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint violations detected"
  exit 1
fi
```

## Examples

See `test/` directory for comprehensive examples.

## License

MIT
