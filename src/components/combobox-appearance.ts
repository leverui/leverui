import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const variants = ['outline', 'subtle', 'flushed'] as const;
const allowedSizes = new Set<string>(sizes);
const allowedVariants = new Set<string>(variants);
export type ComboboxSize = (typeof sizes)[number];
export type ComboboxVariant = (typeof variants)[number];

export interface ComboboxAppearance {
  size?: FiniteResponsiveChoice<ComboboxSize> | undefined;
  variant?: FiniteResponsiveChoice<ComboboxVariant> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
}

export interface ComboboxAppearanceState {
  size: Accessor<ResponsiveValues<ComboboxSize>>;
  variant: Accessor<ResponsiveValues<ComboboxVariant>>;
  colorPalette: Accessor<string | undefined>;
  unstyled: Accessor<boolean>;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SizeAttribute = 'data-size' | `data-size-${Breakpoint}`;
type VariantAttribute = 'data-variant' | `data-variant-${Breakpoint}`;
export type ComboboxAppearanceAttributes = Partial<
  Record<SizeAttribute, ComboboxSize | undefined> &
    Record<VariantAttribute, ComboboxVariant | undefined> & {
      'data-leverui-color-palette': string | undefined;
    }
>;

const AppearanceContext = createOptionalContext<ComboboxAppearanceState>();

/** Carry finite Combobox appearance through the primitive's native and portalled parts. */
export const ComboboxAppearanceProvider = AppearanceContext;

/** Require the nearest owned or caller-owned Combobox root. */
export function useComboboxAppearance(): ComboboxAppearanceState {
  const state = useOptionalContext(AppearanceContext);
  if (!state)
    throw new Error('Combobox parts must be inside ComboboxRoot or ComboboxRootProvider.');
  return state;
}

/** Validate one responsive Combobox size without creating style objects. */
export function readComboboxSize(value: unknown): ResponsiveValues<ComboboxSize> {
  return readFiniteResponsiveChoice(value, allowedSizes, 'md', 'Combobox size');
}

/** Validate one responsive Combobox treatment without creating style objects. */
export function readComboboxVariant(value: unknown): ResponsiveValues<ComboboxVariant> {
  return readFiniteResponsiveChoice(value, allowedVariants, 'outline', 'Combobox variant');
}

/** Accept a named or consumer-defined color palette for CSS token scopes. */
export function readComboboxPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Combobox colorPalette must be a nonempty string.');
  }
  return value.trim();
}

/** Supply the same finite selectors to native and portalled parts. */
export function comboboxAppearanceAttributes(
  state: ComboboxAppearanceState,
): ComboboxAppearanceAttributes {
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
    'data-leverui-color-palette': state.colorPalette(),
  };
}
