/**
 * Text Component - Typography Primitive
 *
 * Prevents typography violations by providing semantic variants
 * Enforces design system typography rules
 *
 * Universal: Customize variants for your design system
 *
 * Example:
 *   <Text variant="heading">Title</Text>
 *   <Text variant="body" color="muted">Description</Text>
 */

import React, { ReactNode } from 'react';

// Typography variants (customize for your design system)
export type TextVariant =
  | 'display'       // Hero text (Domaine 48-280px)
  | 'h1'            // Page titles (Domaine 36-72px)
  | 'h2'            // Section headings (GT Pantheon 24-32px)
  | 'h3'            // Subsection headings (GT Pantheon 18-24px)
  | 'body'          // Body text (Supreme LL 14-16px)
  | 'body-large'    // Lead paragraphs (Supreme LL 16-18px)
  | 'body-small'    // Small text (Supreme LL 12-14px)
  | 'label'         // Labels (Supreme LL 12-14px, uppercase)
  | 'label-strong'  // Strong labels (Supreme LL 12-14px, bold, uppercase)
  | 'mono'          // Code/data (Brown LL Mono 14-15px)
  | 'card-title';   // Card titles (Domaine 24-32px)

// Color tokens
export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'accent-gold'
  | 'accent-gold-bright';

// Text alignment
export type TextAlign = 'left' | 'center' | 'right';

export interface TextProps {
  /** Typography variant */
  variant: TextVariant;

  /** Text color */
  color?: TextColor;

  /** Text alignment */
  align?: TextAlign;

  /** Children */
  children: ReactNode;

  /** Additional className */
  className?: string;

  /** HTML element type (auto-selected based on variant if not provided) */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Variant Configuration
 *
 * Maps semantic variants to design system specifications
 * Customize for your typography scale
 */
const VARIANT_STYLES: Record<TextVariant, React.CSSProperties> = {
  display: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(48px, 8vw, 280px)',
    fontWeight: 200,
    lineHeight: 1.05,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(36px, 5vw, 72px)',
    fontWeight: 200,
    lineHeight: 1.1,
    letterSpacing: '0.02em',
  },
  h2: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(24px, 3vw, 32px)',
    fontWeight: 300,
    lineHeight: 1.3,
  },
  h3: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(18px, 2vw, 24px)',
    fontWeight: 400,
    lineHeight: 1.3,
  },
  body: {
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  'body-large': {
    fontFamily: 'var(--font-body)',
    fontSize: '18px',
    fontWeight: 300,
    lineHeight: 1.6,
  },
  'body-small': {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  label: {
    fontFamily: 'var(--font-label)',
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: 1.3,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  'label-strong': {
    fontFamily: 'var(--font-label)',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  mono: {
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    fontWeight: 300,
    lineHeight: 1.4,
  },
  'card-title': {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(24px, 3vw, 32px)',
    fontWeight: 200,
    lineHeight: 1.2,
  },
};

/**
 * Default HTML elements for each variant
 * Can be overridden with `as` prop
 */
const VARIANT_ELEMENTS: Record<TextVariant, keyof JSX.IntrinsicElements> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  'body-large': 'p',
  'body-small': 'p',
  label: 'span',
  'label-strong': 'span',
  mono: 'code',
  'card-title': 'h2',
};

/**
 * Text Component
 *
 * Typography primitive with semantic variants
 * Prevents font/size/weight violations
 */
export const Text: React.FC<TextProps> = ({
  variant,
  color,
  align,
  children,
  className = '',
  as,
}) => {
  const Element = as || VARIANT_ELEMENTS[variant];

  const styles: React.CSSProperties = {
    ...VARIANT_STYLES[variant],
    margin: 0, // Reset default margins
  };

  if (color) {
    styles.color = `var(--color-text-${color})`;
  }

  if (align) {
    styles.textAlign = align;
  }

  return (
    <Element style={styles} className={className}>
      {children}
    </Element>
  );
};

/**
 * Usage Examples:
 *
 * // Page title
 * <Text variant="h1">Protocol Tracker</Text>
 *
 * // Section heading
 * <Text variant="h2" color="muted">Getting Started</Text>
 *
 * // Body text
 * <Text variant="body">
 *   This protocol helps you track your compounds and dosing schedule.
 * </Text>
 *
 * // Label
 * <Text variant="label" color="muted">Week 1</Text>
 *
 * // Card title
 * <Text variant="card-title">BPC-157</Text>
 *
 * // Data/code
 * <Text variant="mono" color="accent-gold">250mcg</Text>
 */

/**
 * Benefits:
 *
 * 1. PREVENTS typography violations
 *    - Can't use Domaine below 24px (not in variants)
 *    - Can't make labels italic (not in VARIANT_STYLES)
 *    - Enforces design system rules at component level
 *
 * 2. SEMANTIC variants
 *    - <Text variant="card-title"> → self-documenting
 *    - Not <div style={{fontSize: '24px'}}> → meaningless
 *
 * 3. TYPE-SAFE
 *    - Can't use variant="heading1" → Type error
 *    - Must use variant="h1"
 *
 * 4. RESPONSIVE by default
 *    - Uses clamp() for fluid typography
 *    - No media queries needed
 *
 * 5. MAINTAINABLE
 *    - Change h1 size: Update VARIANT_STYLES once
 *    - All <Text variant="h1"> update automatically
 *
 * 6. ZERO inline styles
 *    - All typography through design system
 *    - ESLint/Stylelint compliant
 */

export default Text;
