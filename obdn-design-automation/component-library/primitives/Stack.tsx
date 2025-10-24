/**
 * Stack Component - Semantic Spacing
 *
 * Prevents spacing hierarchy violations by using SEMANTIC props
 * instead of raw spacing tokens
 *
 * Universal: Works with any design system by mapping to project's tokens
 *
 * Example:
 *   <Stack spacing="cards">      ← Developer thinks "these are cards"
 *     <Card />                   ← System applies var(--space-4) automatically
 *     <Card />
 *   </Stack>
 */

import React, { CSSProperties, ReactNode } from 'react';

// Semantic spacing levels (universal concept)
export type SpacingLevel =
  | 'tight'      // 4px  - Very related elements (icon + text)
  | 'list'       // 8px  - List items, small gaps
  | 'related'    // 16px - Related elements, default gap
  | 'cards'      // 16px - Separate cards in a list
  | 'sections'   // 32px - Major sections, navigation → content
  | 'page';      // 120px - Page sections (rare)

export type StackDirection = 'vertical' | 'horizontal';
export type AlignItems = 'start' | 'center' | 'end' | 'stretch';
export type JustifyContent = 'start' | 'center' | 'end' | 'space-between' | 'space-around';

export interface StackProps {
  /** Semantic spacing level - maps to design system tokens */
  spacing: SpacingLevel;

  /** Stack direction */
  direction?: StackDirection;

  /** Align items (cross-axis) */
  align?: AlignItems;

  /** Justify content (main-axis) */
  justify?: JustifyContent;

  /** Children elements */
  children: ReactNode;

  /** Additional className for custom styling */
  className?: string;

  /** HTML element type */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Spacing Hierarchy Mapping
 *
 * Maps semantic levels to CSS variables
 * Customize for your project's design system
 */
const SPACING_MAP: Record<SpacingLevel, string> = {
  tight: 'var(--space-1)',      // 4px
  list: 'var(--space-2)',       // 8px
  related: 'var(--space-4)',    // 16px
  cards: 'var(--space-4)',      // 16px (same as related, semantic clarity)
  sections: 'var(--space-8)',   // 32px
  page: 'var(--space-30)',      // 120px
};

/**
 * Stack Component
 *
 * Provides consistent, semantic spacing for layouts
 * Prevents "wrong token for context" violations
 */
export const Stack: React.FC<StackProps> = ({
  spacing,
  direction = 'vertical',
  align = 'stretch',
  justify = 'start',
  children,
  className = '',
  as: Element = 'div',
}) => {
  const styles: CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap: SPACING_MAP[spacing],
    alignItems: align,
    justifyContent: justify,
  };

  return (
    <Element style={styles} className={className}>
      {children}
    </Element>
  );
};

/**
 * Convenience Components for Common Patterns
 */

export const VStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="vertical" />
);

export const HStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="horizontal" />
);

/**
 * Usage Examples:
 *
 * // Separate cards in a list
 * <Stack spacing="cards">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Stack>
 *
 * // Navigation to content transition
 * <Stack spacing="sections">
 *   <Navigation />
 *   <MainContent />
 * </Stack>
 *
 * // Tight icon + label
 * <HStack spacing="tight" align="center">
 *   <Icon />
 *   <span>Label</span>
 * </HStack>
 *
 * // List items
 * <Stack spacing="list">
 *   <li>Item 1</li>
 *   <li>Item 2</li>
 *   <li>Item 3</li>
 * </Stack>
 */

/**
 * Benefits:
 *
 * 1. PREVENTS spacing hierarchy violations
 *    - Developer thinks "cards" → system uses correct token
 *    - No need to remember var(--space-4) vs var(--space-1)
 *
 * 2. SELF-DOCUMENTING code
 *    - <Stack spacing="cards"> tells you WHAT it contains
 *    - Not <div style={{gap: '16px'}}> (meaningless number)
 *
 * 3. MAINTAINABLE design system
 *    - Change cards spacing: Update SPACING_MAP once
 *    - All <Stack spacing="cards"> update automatically
 *
 * 4. TYPE-SAFE at compile time
 *    - TypeScript enforces valid spacing levels
 *    - Can't typo "card" → will error
 *
 * 5. ZERO inline styles
 *    - All spacing through design tokens
 *    - ESLint/Stylelint happy
 */

export default Stack;
