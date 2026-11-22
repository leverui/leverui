import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export const switchSizes = ['xs', 'sm', 'md', 'lg'] as const;
export const switchVariants = ['solid', 'raised'] as const;
export type SwitchSize = (typeof switchSizes)[number];
export type SwitchVariant = (typeof switchVariants)[number];

export interface SwitchAppearance {
  size?: FiniteResponsiveChoice<SwitchSize> | undefined;
  variant?: FiniteResponsiveChoice<SwitchVariant> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

const sizes = new Set<string>(switchSizes);
const variants = new Set<string>(switchVariants);

/** Validate Switch sizes at the breakpoints covered by authored CSS. */
export function readSwitchSizes(value: unknown): ResponsiveValues<SwitchSize> {
  return readFiniteResponsiveChoice(value, sizes, 'md', 'Switch size');
}

/** Validate Switch variants at the breakpoints covered by authored CSS. */
export function readSwitchVariants(value: unknown): ResponsiveValues<SwitchVariant> {
  return readFiniteResponsiveChoice(value, variants, 'solid', 'Switch variant');
}

/** Reflect finite Switch appearance choices through stable CSS selectors. */
export function switchAttributes(appearance: SwitchAppearance): {
  'data-size': SwitchSize | undefined;
  'data-size-sm': SwitchSize | undefined;
  'data-size-md': SwitchSize | undefined;
  'data-size-lg': SwitchSize | undefined;
  'data-size-xl': SwitchSize | undefined;
  'data-size-2xl': SwitchSize | undefined;
  'data-variant': SwitchVariant | undefined;
  'data-variant-sm': SwitchVariant | undefined;
  'data-variant-md': SwitchVariant | undefined;
  'data-variant-lg': SwitchVariant | undefined;
  'data-variant-xl': SwitchVariant | undefined;
  'data-variant-2xl': SwitchVariant | undefined;
  'data-leverui-color-palette': string | undefined;
  'data-unstyled': string | undefined;
} {
  const palette = appearance.colorPalette;
  if (palette !== undefined && (typeof palette !== 'string' || !palette.trim())) {
    throw new TypeError('Switch colorPalette must be a nonempty string.');
  }
  const size = readSwitchSizes(appearance.size);
  const variant = readSwitchVariants(appearance.variant);
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
