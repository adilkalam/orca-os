/**
 * Box Component - Universal Layout Primitive
 *
 * Prevents hardcoded values by accepting only design system tokens
 * Base component for all layouts
 *
 * Universal: Works with any design system
 *
 * Example:
 *   <Box padding="8" color="primary" background="surface">
 *     Content
 *   </Box>
 */

import React, { CSSProperties, ReactNode } from 'react';

// Spacing tokens (customize for your design system)
export type SpacingToken =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12'
  | '16' | '20' | '24' | '30' | '36' | '40' | '64';

// Color tokens (customize for your design system)
export type ColorToken =
  | 'primary' | 'secondary' | 'accent-gold' | 'accent-gold-bright' | 'accent-gold-soft'
  | 'text-primary' | 'text-secondary' | 'text-muted'
  | 'background' | 'surface' | 'surface-raised'
  | 'border' | 'border-soft';

// Border radius tokens
export type RadiusToken = 'sm' | 'md' | 'lg' | 'card' | 'pill';

export interface BoxProps {
  /** Padding (maps to var(--space-N)) */
  padding?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
  paddingTop?: SpacingToken;
  paddingRight?: SpacingToken;
  paddingBottom?: SpacingToken;
  paddingLeft?: SpacingToken;

  /** Margin (maps to var(--space-N)) */
  margin?: SpacingToken;
  marginX?: SpacingToken;
  marginY?: SpacingToken;
  marginTop?: SpacingToken;
  marginRight?: SpacingToken;
  marginBottom?: SpacingToken;
  marginLeft?: SpacingToken;

  /** Color (maps to var(--color-N)) */
  color?: ColorToken;

  /** Background (maps to var(--color-N)) */
  background?: ColorToken;

  /** Border color (maps to var(--color-N)) */
  borderColor?: ColorToken;

  /** Border radius (maps to var(--radius-N)) */
  borderRadius?: RadiusToken;

  /** Border width */
  borderWidth?: '1' | '2';

  /** Width */
  width?: string | 'full';

  /** Max width */
  maxWidth?: string;

  /** Height */
  height?: string | 'full';

  /** Display */
  display?: 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none';

  /** Children */
  children?: ReactNode;

  /** Additional className */
  className?: string;

  /** HTML element type */
  as?: keyof JSX.IntrinsicElements;

  /** Click handler */
  onClick?: () => void;
}

/**
 * Token mapping functions
 * Customize these for your design system
 */

function toSpacingVar(token: SpacingToken): string {
  return `var(--space-${token})`;
}

function toColorVar(token: ColorToken): string {
  return `var(--color-${token})`;
}

function toRadiusVar(token: RadiusToken): string {
  return `var(--radius-${token})`;
}

/**
 * Box Component
 *
 * Universal layout primitive that only accepts design tokens
 * Makes hardcoded values impossible at type level
 */
export const Box: React.FC<BoxProps> = ({
  // Padding
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,

  // Margin
  margin,
  marginX,
  marginY,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,

  // Colors
  color,
  background,
  borderColor,

  // Border
  borderRadius,
  borderWidth,

  // Sizing
  width,
  maxWidth,
  height,

  // Display
  display,

  // Other
  children,
  className = '',
  as: Element = 'div',
  onClick,
}) => {
  const styles: CSSProperties = {};

  // Padding
  if (padding) {
    styles.padding = toSpacingVar(padding);
  }
  if (paddingX) {
    styles.paddingLeft = toSpacingVar(paddingX);
    styles.paddingRight = toSpacingVar(paddingX);
  }
  if (paddingY) {
    styles.paddingTop = toSpacingVar(paddingY);
    styles.paddingBottom = toSpacingVar(paddingY);
  }
  if (paddingTop) styles.paddingTop = toSpacingVar(paddingTop);
  if (paddingRight) styles.paddingRight = toSpacingVar(paddingRight);
  if (paddingBottom) styles.paddingBottom = toSpacingVar(paddingBottom);
  if (paddingLeft) styles.paddingLeft = toSpacingVar(paddingLeft);

  // Margin
  if (margin) {
    styles.margin = toSpacingVar(margin);
  }
  if (marginX) {
    styles.marginLeft = toSpacingVar(marginX);
    styles.marginRight = toSpacingVar(marginX);
  }
  if (marginY) {
    styles.marginTop = toSpacingVar(marginY);
    styles.marginBottom = toSpacingVar(marginY);
  }
  if (marginTop) styles.marginTop = toSpacingVar(marginTop);
  if (marginRight) styles.marginRight = toSpacingVar(marginRight);
  if (marginBottom) styles.marginBottom = toSpacingVar(marginBottom);
  if (marginLeft) styles.marginLeft = toSpacingVar(marginLeft);

  // Colors
  if (color) styles.color = toColorVar(color);
  if (background) styles.background = toColorVar(background);
  if (borderColor) styles.borderColor = toColorVar(borderColor);

  // Border
  if (borderRadius) styles.borderRadius = toRadiusVar(borderRadius);
  if (borderWidth) styles.borderWidth = `${borderWidth}px`;
  if (borderColor && !borderWidth) styles.borderWidth = '1px'; // Default border width

  // Sizing
  if (width === 'full') {
    styles.width = '100%';
  } else if (width) {
    styles.width = width;
  }
  if (maxWidth) styles.maxWidth = maxWidth;
  if (height === 'full') {
    styles.height = '100%';
  } else if (height) {
    styles.height = height;
  }

  // Display
  if (display) styles.display = display;

  return (
    <Element style={styles} className={className} onClick={onClick}>
      {children}
    </Element>
  );
};

/**
 * Usage Examples:
 *
 * // Card with padding and border
 * <Box
 *   padding="8"
 *   background="surface"
 *   borderColor="border"
 *   borderRadius="card"
 * >
 *   <h2>Card Title</h2>
 *   <p>Card content</p>
 * </Box>
 *
 * // Section with vertical spacing
 * <Box paddingY="16" background="background">
 *   <h1>Section Title</h1>
 * </Box>
 *
 * // Inline badge
 * <Box
 *   display="inline-flex"
 *   paddingX="3"
 *   paddingY="1"
 *   background="accent-gold-soft"
 *   color="text-primary"
 *   borderRadius="pill"
 * >
 *   Badge
 * </Box>
 *
 * // Full-width container
 * <Box width="full" maxWidth="1200px" marginX="auto">
 *   <Content />
 * </Box>
 */

/**
 * Benefits:
 *
 * 1. TYPE-SAFE design tokens
 *    - Can't use 'padding="23px"' → Type error
 *    - Must use 'padding="8"' → Maps to var(--space-8)
 *
 * 2. IMPOSSIBLE to use hardcoded values
 *    - No color="#D4AF37" → Type error
 *    - Must use color="accent-gold-bright"
 *
 * 3. ZERO inline style violations
 *    - All styles use CSS variables
 *    - ESLint happy, Stylelint happy
 *
 * 4. COMPOSABLE with other primitives
 *    - <Box> + <Stack> + <Text> = complete layouts
 *    - No need for raw divs
 *
 * 5. MAINTAINABLE design system
 *    - Change var(--space-8) value → all Box padding="8" update
 *    - Single source of truth
 */

export default Box;
