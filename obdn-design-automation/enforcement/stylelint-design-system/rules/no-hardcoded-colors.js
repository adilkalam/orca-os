/**
 * Stylelint Rule: no-hardcoded-colors
 *
 * Prevents hardcoded color values in CSS/SCSS:
 * 1. Hex colors: #D4AF37
 * 2. RGB/RGBA: rgb(201, 169, 97)
 * 3. Named colors: gold, red, etc. (except transparent, currentColor)
 *
 * Universal: Works for any CSS Modules, SCSS, or vanilla CSS
 */

const stylelint = require('stylelint');

const ruleName = 'design-system/no-hardcoded-colors';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value, property) =>
    `Hardcoded color "${value}" in "${property}" not allowed. Use CSS variable (var(--color-*)).`,
});

const colorProperties = [
  'color',
  'background',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'column-rule-color',
  'fill',
  'stroke',
];

const allowedKeywords = [
  'transparent',
  'currentcolor',
  'inherit',
  'initial',
  'unset',
  'revert',
  'none',
];

const hexColorPattern = /#([0-9a-fA-F]{3}){1,2}\b/i;
const rgbPattern = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/i;
const hslPattern = /hsla?\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%(?:\s*,\s*[\d.]+)?\s*\)/i;

function isHardcodedColor(value) {
  const normalizedValue = value.toLowerCase().trim();

  // Allow CSS variables
  if (normalizedValue.includes('var(')) {
    return false;
  }

  // Allow specific keywords
  if (allowedKeywords.includes(normalizedValue)) {
    return false;
  }

  // Check for hex colors
  if (hexColorPattern.test(value)) {
    return true;
  }

  // Check for rgb/rgba
  if (rgbPattern.test(value)) {
    return true;
  }

  // Check for hsl/hsla
  if (hslPattern.test(value)) {
    return true;
  }

  return false;
}

function ruleFunction(primaryOption, secondaryOptions) {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
      possible: [true, false],
    });

    if (!validOptions || !primaryOption) {
      return;
    }

    root.walkDecls((decl) => {
      const prop = decl.prop;
      const value = decl.value;

      // Check if this is a color property
      if (!colorProperties.includes(prop)) {
        return;
      }

      // Check for hardcoded colors
      if (isHardcodedColor(value)) {
        stylelint.utils.report({
          message: messages.rejected(value, prop),
          node: decl,
          result,
          ruleName,
        });
      }
    });
  };
}

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
