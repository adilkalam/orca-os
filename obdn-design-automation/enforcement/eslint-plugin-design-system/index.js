/**
 * ESLint Plugin: Design System Enforcement
 *
 * Universal plugin for preventing design system violations
 * Works with OBDN, peptidefoxv2, and any React/Next.js project
 *
 * Installation:
 *   1. Copy this directory to your project
 *   2. Add to .eslintrc.js:
 *      plugins: ['design-system'],
 *      rules: {
 *        'design-system/no-hardcoded-colors': 'error',
 *      }
 *   3. Run: npm run lint
 */

const noHardcodedColors = require('./rules/no-hardcoded-colors');

module.exports = {
  rules: {
    'no-hardcoded-colors': noHardcodedColors,
  },
  configs: {
    recommended: {
      plugins: ['design-system'],
      rules: {
        'design-system/no-hardcoded-colors': 'error',
      },
    },
  },
};
