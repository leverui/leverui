import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

export const colorPickerSizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export type ColorPickerSize = (typeof colorPickerSizes)[number];
export const colorPickerVariants = ['outline', 'subtle'] as const;
export type ColorPickerVariant = (typeof colorPickerVariants)[number];
const allowedSizes = new Set<string>(colorPickerSizes);
const allowedVariants = new Set<string>(colorPickerVariants);

export interface ColorPickerAppearance {
  size?: FiniteResponsiveChoice<ColorPickerSize> | undefined;
  variant?: FiniteResponsiveChoice<ColorPickerVariant> | undefined;
  unstyled?: boolean | undefined;
}

export interface ColorPickerAppearanceState {
  size: Accessor<ResponsiveValues<ColorPickerSize>>;
  variant: Accessor<ResponsiveValues<ColorPickerVariant>>;
  unstyled: Accessor<boolean>;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SizeAttribute = 'data-size' | `data-size-${Breakpoint}`;
type VariantAttribute = 'data-variant' | `data-variant-${Breakpoint}`;
export type ColorPickerAppearanceAttributes = Partial<
  Record<SizeAttribute, ColorPickerSize | undefined> &
    Record<VariantAttribute, ColorPickerVariant | undefined>
>;

const ColorPickerAppearanceContext = createOptionalContext<ColorPickerAppearanceState>();

/** Carry one picker's reactive appearance across Solid portals. */
export const ColorPickerAppearanceProvider = ColorPickerAppearanceContext;

/** Read the appearance of the nearest ColorPicker root. */
export function useColorPickerAppearance(): ColorPickerAppearanceState {
  const state = useOptionalContext(ColorPickerAppearanceContext);
  if (!state) throw new Error('ColorPicker parts require ColorPickerRoot.');
  return state;
}

/** Validate a finite size at each supported breakpoint. */
export function readColorPickerSize(value: unknown): ResponsiveValues<ColorPickerSize> {
  return readFiniteResponsiveChoice(value, allowedSizes, 'md', 'ColorPicker size');
}

/** Validate a finite variant at each supported breakpoint. */
export function readColorPickerVariant(value: unknown): ResponsiveValues<ColorPickerVariant> {
  return readFiniteResponsiveChoice(value, allowedVariants, 'outline', 'ColorPicker variant');
}

/** Reflect root choices on a native part, including portaled parts. */
export function colorPickerAppearanceAttributes(
  state: ColorPickerAppearanceState,
): ColorPickerAppearanceAttributes {
  const size = state.size();
  const variant = state.variant();
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
  };
}
