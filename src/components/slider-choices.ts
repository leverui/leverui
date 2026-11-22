import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export type SliderSize = 'sm' | 'md' | 'lg';
export type SliderVariant = 'outline' | 'solid';

export interface SliderAppearance {
  size?: FiniteResponsiveChoice<SliderSize> | undefined;
  variant?: FiniteResponsiveChoice<SliderVariant> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

const sizes = new Set<string>(['sm', 'md', 'lg']);
const variants = new Set<string>(['outline', 'solid']);

/** Keep responsive Slider size choices within the authored CSS matrix. */
export function readSliderSizes(value: unknown): ResponsiveValues<SliderSize> {
  return readFiniteResponsiveChoice(value, sizes, 'md', 'Slider size');
}

/** Keep responsive Slider variants within the authored CSS matrix. */
export function readSliderVariants(value: unknown): ResponsiveValues<SliderVariant> {
  return readFiniteResponsiveChoice(value, variants, 'outline', 'Slider variant');
}

/** Reflect Slider appearance through stable CSS selectors. */
export function sliderAttributes(appearance: SliderAppearance): {
  'data-size': SliderSize | undefined;
  'data-size-sm': SliderSize | undefined;
  'data-size-md': SliderSize | undefined;
  'data-size-lg': SliderSize | undefined;
  'data-size-xl': SliderSize | undefined;
  'data-size-2xl': SliderSize | undefined;
  'data-variant': SliderVariant | undefined;
  'data-variant-sm': SliderVariant | undefined;
  'data-variant-md': SliderVariant | undefined;
  'data-variant-lg': SliderVariant | undefined;
  'data-variant-xl': SliderVariant | undefined;
  'data-variant-2xl': SliderVariant | undefined;
  'data-leverui-color-palette': string | undefined;
  'data-unstyled': string | undefined;
} {
  const palette = appearance.colorPalette;
  if (palette !== undefined && (typeof palette !== 'string' || !palette.trim())) {
    throw new TypeError('Slider colorPalette must be a nonempty string.');
  }
  const size = readSliderSizes(appearance.size);
  const variant = readSliderVariants(appearance.variant);
  return {
    'data-size': size.base,
    'data-size-sm': size.sm,
    'data-size-md': size.md,
    'data-size-lg': size.lg,
    'data-size-xl': size.xl,
    'data-size-2xl': size['2xl'],
    'data-variant': variant.base,
    'data-variant-sm': variant.sm,
    'data-variant-md': variant.md,
    'data-variant-lg': variant.lg,
    'data-variant-xl': variant.xl,
    'data-variant-2xl': variant['2xl'],
    'data-leverui-color-palette': palette?.trim(),
    'data-unstyled': appearance.unstyled ? '' : undefined,
  };
}
