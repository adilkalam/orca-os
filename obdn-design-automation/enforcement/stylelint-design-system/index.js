/**
 * Stylelint Plugin: Design System Enforcement
 *
 * Universal plugin for preventing design system violations in CSS
 * Works with CSS Modules, SCSS, and vanilla CSS
 *
 * Installation:
 *   1. Copy this directory to your project
 *   2. Add to .stylelintrc.json:
 *      {
 *        "plugins": ["./stylelint-design-system"],
 *        "rules": {
 *          "design-system/no-hardcoded-colors": true
 *        }
 *      }
 *   3. Run: npm run stylelint
 */

const noHardcodedColors = require('./rules/no-hardcoded-colors');

module.exports = [noHardcodedColors];
