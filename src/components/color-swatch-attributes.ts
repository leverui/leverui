import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { ColorSwatchShape, ColorSwatchSize } from './color-swatch-choices';

export interface ColorSwatchAttributes {
  'data-size': ColorSwatchSize | undefined;
  'data-size-sm': ColorSwatchSize | undefined;
  'data-size-md': ColorSwatchSize | undefined;
  'data-size-lg': ColorSwatchSize | undefined;
  'data-size-xl': ColorSwatchSize | undefined;
  'data-size-2xl': ColorSwatchSize | undefined;
  'data-shape': ColorSwatchShape | undefined;
  'data-shape-sm': ColorSwatchShape | undefined;
  'data-shape-md': ColorSwatchShape | undefined;
  'data-shape-lg': ColorSwatchShape | undefined;
  'data-shape-xl': ColorSwatchShape | undefined;
  'data-shape-2xl': ColorSwatchShape | undefined;
}

/** Reflect finite swatch choices for authored CSS selectors. */
export function colorSwatchAttributes(
  size: ResponsiveValues<ColorSwatchSize>,
  shape: ResponsiveValues<ColorSwatchShape>,
): ColorSwatchAttributes {
  return {
    'data-size': size.base,
    'data-size-sm': size.sm,
    'data-size-md': size.md,
    'data-size-lg': size.lg,
    'data-size-xl': size.xl,
    'data-size-2xl': size['2xl'],
    'data-shape': shape.base,
    'data-shape-sm': shape.sm,
    'data-shape-md': shape.md,
    'data-shape-lg': shape.lg,
    'data-shape-xl': shape.xl,
    'data-shape-2xl': shape['2xl'],
  };
}
