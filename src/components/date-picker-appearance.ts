import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import {
  readResponsiveBooleans,
  type ResponsiveBooleanValue,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const variants = ['outline', 'subtle', 'flushed'] as const;
const allowedSizes = new Set<string>(sizes);
const allowedVariants = new Set<string>(variants);
export type DatePickerSize = (typeof sizes)[number];
export type DatePickerVariant = (typeof variants)[number];

export interface DatePickerAppearance {
  size?: FiniteResponsiveChoice<DatePickerSize> | undefined;
  variant?: FiniteResponsiveChoice<DatePickerVariant> | undefined;
  hideOutsideDays?: ResponsiveBooleanValue | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
}

export interface DatePickerAppearanceState {
  size: Accessor<ResponsiveValues<DatePickerSize>>;
  variant: Accessor<ResponsiveValues<DatePickerVariant>>;
  hideOutsideDays: Accessor<ResponsiveValues<boolean>>;
  colorPalette: Accessor<string | undefined>;
  unstyled: Accessor<boolean>;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SizeAttribute = 'data-size' | `data-size-${Breakpoint}`;
type VariantAttribute = 'data-variant' | `data-variant-${Breakpoint}`;
type OutsideDaysAttribute = 'data-hide-outside-days' | `data-hide-outside-days-${Breakpoint}`;
export type DatePickerAppearanceAttributes = Partial<
  Record<SizeAttribute, DatePickerSize | undefined> &
    Record<VariantAttribute, DatePickerVariant | undefined> & {
      'data-lui-color-palette': string | undefined;
    } & Record<OutsideDaysAttribute, 'true' | 'false' | undefined>
>;

const AppearanceContext = createOptionalContext<DatePickerAppearanceState>();

/** Carry finite calendar appearance across native and portalled parts. */
export const DatePickerAppearanceProvider = AppearanceContext;

/** Read the nearest Date Picker root's reactive appearance. */
export function useDatePickerAppearance(): DatePickerAppearanceState {
  const state = useOptionalContext(AppearanceContext);
  if (!state) throw new Error('DatePicker parts must be inside DatePickerRoot.');
  return state;
}

/** Validate the five supported responsive calendar sizes. */
export function readDatePickerSize(value: unknown): ResponsiveValues<DatePickerSize> {
  return readFiniteResponsiveChoice(value, allowedSizes, 'md', 'DatePicker size');
}

/** Validate the three supported responsive field treatments. */
export function readDatePickerVariant(value: unknown): ResponsiveValues<DatePickerVariant> {
  return readFiniteResponsiveChoice(value, allowedVariants, 'outline', 'DatePicker variant');
}

/** Validate responsive outside-day visibility without retaining CSS objects. */
export function readDatePickerHideOutsideDays(value: unknown): ResponsiveValues<boolean> {
  const selected = readResponsiveBooleans(value);
  if (!selected) throw new TypeError('DatePicker hideOutsideDays has an unsupported value.');
  return { base: false, ...selected };
}

/** Accept a named or consumer-defined palette for scoped CSS tokens. */
export function readDatePickerPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('DatePicker colorPalette must be a nonempty string.');
  }
  return value.trim();
}

/** Turn one declared boolean breakpoint into its finite DOM value. */
function booleanAttribute(value: boolean | undefined): 'true' | 'false' | undefined {
  return value === undefined ? undefined : value ? 'true' : 'false';
}

/** Reflect finite choices on the primitive parts that may leave the root DOM subtree. */
export function datePickerAppearanceAttributes(
  state: DatePickerAppearanceState,
): DatePickerAppearanceAttributes {
  const size = state.size();
  const variant = state.variant();
  const hideOutsideDays = state.hideOutsideDays();
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
    'data-hide-outside-days': booleanAttribute(hideOutsideDays.base),
    'data-hide-outside-days-sm': booleanAttribute(hideOutsideDays.sm),
    'data-hide-outside-days-md': booleanAttribute(hideOutsideDays.md),
    'data-hide-outside-days-lg': booleanAttribute(hideOutsideDays.lg),
    'data-hide-outside-days-xl': booleanAttribute(hideOutsideDays.xl),
    'data-hide-outside-days-2xl': booleanAttribute(hideOutsideDays['2xl']),
    'data-lui-color-palette': state.colorPalette(),
  };
}
