import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

const variants = ['subtle', 'solid', 'plain'] as const;
const allowedVariants = new Set<string>(variants);
export type ListboxVariant = (typeof variants)[number];

export interface ListboxAppearance {
  variant?: FiniteResponsiveChoice<ListboxVariant> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
}

export interface ListboxAppearanceState {
  variant: Accessor<ResponsiveValues<ListboxVariant>>;
  colorPalette: Accessor<string | undefined>;
  unstyled: Accessor<boolean>;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type VariantAttribute = 'data-variant' | `data-variant-${Breakpoint}`;
export type ListboxAppearanceAttributes = Partial<
  Record<VariantAttribute, ListboxVariant | undefined>
> & {
  'data-lui-color-palette': string | undefined;
};

const AppearanceContext = createOptionalContext<ListboxAppearanceState>();

/** Carry one Listbox's reactive appearance through its compound parts. */
export const ListboxAppearanceProvider = AppearanceContext;

/** Require the nearest Listbox root for native parts. */
export function useListboxAppearance(): ListboxAppearanceState {
  const state = useOptionalContext(AppearanceContext);
  if (!state) throw new Error('Listbox parts must be inside ListboxRoot.');
  return state;
}

/** Validate the finite variant at each supported breakpoint. */
export function readListboxVariant(value: unknown): ResponsiveValues<ListboxVariant> {
  return readFiniteResponsiveChoice(value, allowedVariants, 'subtle', 'Listbox variant');
}

/** Accept a named or consumer-defined color palette for selected items. */
export function readListboxPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Listbox colorPalette must be a nonempty string.');
  }
  return value.trim();
}

/** Reflect the root's finite choices on native and moved parts. */
export function listboxAppearanceAttributes(
  state: ListboxAppearanceState,
): ListboxAppearanceAttributes {
  const variant = state.variant();
  return {
    'data-variant': variant.base,
    'data-variant-sm': variant.sm,
    'data-variant-md': variant.md,
    'data-variant-lg': variant.lg,
    'data-variant-xl': variant.xl,
    'data-variant-2xl': variant['2xl'],
    'data-lui-color-palette': state.colorPalette(),
  };
}
