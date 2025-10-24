/**
 * ESLint Rule: no-hardcoded-colors
 *
 * Prevents hardcoded color values in:
 * 1. Inline styles (style={{ color: '#hex' }})
 * 2. Tailwind arbitrary values (className="text-[#hex]")
 * 3. Style objects (const styles = { color: '#hex' })
 *
 * Universal: Works for OBDN, peptidefoxv2, and any React/Next.js project
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded hex color values - use CSS variables or design tokens',
      category: 'Design System',
      recommended: true,
    },
    fixable: null, // Could add auto-fix with color mapping in future
    schema: [
      {
        type: 'object',
        properties: {
          allowedPatterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Regex patterns for allowed hex colors (e.g., for third-party libraries)',
          },
          cssVariablePattern: {
            type: 'string',
            description: 'Required prefix for CSS variables (default: --color-)',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      hardcodedColor: 'Hardcoded hex color "{{value}}" not allowed. Use CSS variable (var(--color-*)) or design token.',
      tailwindArbitraryColor: 'Tailwind arbitrary color value "{{value}}" not allowed. Use design token class or CSS variable.',
      styleObjectColor: 'Hardcoded color in style object not allowed. Use CSS variable.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedPatterns = options.allowedPatterns || [];
    const cssVariablePattern = options.cssVariablePattern || '--color-';

    // Regex patterns
    const hexColorPattern = /#([0-9a-fA-F]{3}){1,2}\b/gi;
    const rgbaPattern = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/gi;
    const tailwindArbitraryColorPattern = /\[#([0-9a-fA-F]{3}){1,2}\]/g;

    /**
     * Check if a value matches allowed patterns
     */
    function isAllowed(value) {
      return allowedPatterns.some(pattern => {
        const regex = new RegExp(pattern);
        return regex.test(value);
      });
    }

    /**
     * Check if string contains hardcoded color
     */
    function containsHardcodedColor(value) {
      if (typeof value !== 'string') return false;
      if (isAllowed(value)) return false;

      // Check for hex colors not in var()
      const hexMatches = value.match(hexColorPattern);
      if (hexMatches) {
        // Allow if inside var() function
        return !value.includes('var(');
      }

      // Check for rgba not in var()
      const rgbaMatches = value.match(rgbaPattern);
      if (rgbaMatches && !value.includes('var(')) {
        return true;
      }

      return false;
    }

    /**
     * Check if Tailwind className contains arbitrary color values
     */
    function containsTailwindArbitraryColor(className) {
      if (typeof className !== 'string') return false;
      return tailwindArbitraryColorPattern.test(className);
    }

    return {
      /**
       * Check JSX style prop: <div style={{ color: '#hex' }}>
       */
      JSXAttribute(node) {
        // Check style attribute
        if (node.name.name === 'style' && node.value) {
          if (node.value.type === 'JSXExpressionContainer') {
            const expression = node.value.expression;

            if (expression.type === 'ObjectExpression') {
              expression.properties.forEach(prop => {
                if (prop.value && prop.value.type === 'Literal') {
                  const value = prop.value.value;
                  if (containsHardcodedColor(value)) {
                    context.report({
                      node: prop,
                      messageId: 'hardcodedColor',
                      data: { value },
                    });
                  }
                }
                // Check template literals: style={{ color: `#${hex}` }}
                if (prop.value && prop.value.type === 'TemplateLiteral') {
                  const rawValue = prop.value.quasis.map(q => q.value.raw).join('');
                  if (containsHardcodedColor(rawValue)) {
                    context.report({
                      node: prop,
                      messageId: 'hardcodedColor',
                      data: { value: rawValue },
                    });
                  }
                }
              });
            }
          }
        }

        // Check className attribute for Tailwind arbitrary values
        if (node.name.name === 'className' && node.value) {
          let className = '';

          if (node.value.type === 'Literal') {
            className = node.value.value;
          } else if (node.value.type === 'JSXExpressionContainer' &&
                     node.value.expression.type === 'Literal') {
            className = node.value.expression.value;
          } else if (node.value.type === 'JSXExpressionContainer' &&
                     node.value.expression.type === 'TemplateLiteral') {
            // Template literal className
            className = node.value.expression.quasis.map(q => q.value.raw).join('');
          }

          if (containsTailwindArbitraryColor(className)) {
            const matches = className.match(tailwindArbitraryColorPattern);
            context.report({
              node: node.value,
              messageId: 'tailwindArbitraryColor',
              data: { value: matches ? matches[0] : className },
            });
          }
        }
      },

      /**
       * Check style objects: const styles = { color: '#hex' }
       */
      Property(node) {
        if (node.value && node.value.type === 'Literal') {
          const value = node.value.value;

          // Check if this is a style-related property
          const styleProps = ['color', 'backgroundColor', 'background', 'borderColor',
                            'borderTopColor', 'borderRightColor', 'borderBottomColor',
                            'borderLeftColor', 'fill', 'stroke'];

          if (node.key && styleProps.includes(node.key.name || node.key.value)) {
            if (containsHardcodedColor(value)) {
              context.report({
                node,
                messageId: 'styleObjectColor',
                data: { value },
              });
            }
          }
        }
      },

      /**
       * Check CSS-in-JS tagged templates: css`color: #hex;`
       */
      TaggedTemplateExpression(node) {
        if (node.tag.name === 'css' || node.tag.name === 'styled') {
          const template = node.quasi.quasis.map(q => q.value.raw).join('');
          if (containsHardcodedColor(template)) {
            context.report({
              node,
              messageId: 'hardcodedColor',
              data: { value: template.match(hexColorPattern)?.[0] || 'color value' },
            });
          }
        }
      },
    };
  },
};
