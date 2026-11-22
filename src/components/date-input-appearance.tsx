import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const variants = ['outline', 'subtle', 'flushed'] as const;
const allowedSizes = new Set<string>(sizes);
const allowedVariants = new Set<string>(variants);
export type DateInputSize = (typeof sizes)[number];
export type DateInputVariant = (typeof variants)[number];

export interface DateInputAppearance {
  size?: FiniteResponsiveChoice<DateInputSize> | undefined;
  variant?: FiniteResponsiveChoice<DateInputVariant> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
}

export interface DateInputAppearanceState {
  size: Accessor<ResponsiveValues<DateInputSize>>;
  variant: Accessor<ResponsiveValues<DateInputVariant>>;
  colorPalette: Accessor<string | undefined>;
  unstyled: Accessor<boolean>;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SizeAttribute = 'data-size' | `data-size-${Breakpoint}`;
type VariantAttribute = 'data-variant' | `data-variant-${Breakpoint}`;
export type DateInputAppearanceAttributes = Partial<
  Record<SizeAttribute, DateInputSize | undefined> &
    Record<VariantAttribute, DateInputVariant | undefined>
> & { 'data-leverui-color-palette': string | undefined };

const AppearanceContext = createOptionalContext<DateInputAppearanceState>();

/** Carry finite DateInput appearance through the compound machine tree. */
export const DateInputAppearanceProvider = AppearanceContext;

/** Require the nearest DateInput machine root for visible parts. */
export function useDateInputAppearance(): DateInputAppearanceState {
  const state = useOptionalContext(AppearanceContext);
  if (!state) throw new Error('DateInput parts must be inside DateInputRoot.');
  return state;
}

/** Validate one responsive DateInput size before it reaches CSS. */
export function readDateInputSize(value: unknown): ResponsiveValues<DateInputSize> {
  return readFiniteResponsiveChoice(value, allowedSizes, 'md', 'DateInput size');
}

/** Validate one responsive DateInput treatment before it reaches CSS. */
export function readDateInputVariant(value: unknown): ResponsiveValues<DateInputVariant> {
  return readFiniteResponsiveChoice(value, allowedVariants, 'outline', 'DateInput variant');
}

/** Accept a named or consumer-defined palette for authored color tokens. */
export function readDateInputPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('DateInput colorPalette must be a nonempty string.');
  }
  return value.trim();
}

/** Reflect finite appearance on each primitive-rendered native part. */
export function dateInputAppearanceAttributes(
  state: DateInputAppearanceState,
): DateInputAppearanceAttributes {
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
