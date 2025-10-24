/**
 * Component Library Primitives - Index
 *
 * Universal layout and typography primitives
 * Prevents design system violations through type-safe props
 *
 * Usage:
 *   import { Stack, Box, Text } from '@/components/primitives';
 */

export { Stack, VStack, HStack } from './Stack';
export type { StackProps, SpacingLevel, StackDirection } from './Stack';

export { Box } from './Box';
export type {
  BoxProps,
  SpacingToken,
  ColorToken,
  RadiusToken,
} from './Box';

export { Text } from './Text';
export type { TextProps, TextVariant, TextColor } from './Text';
