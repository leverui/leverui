import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const variants = ['outline', 'subtle', 'ghost'] as const;
export type SelectSize = (typeof sizes)[number];
export type SelectVariant = (typeof variants)[number];

export interface SelectAppearance {
  size?: FiniteResponsiveChoice<SelectSize> | undefined;
  variant?: FiniteResponsiveChoice<SelectVariant> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
}

export interface SelectAppearanceState {
  size: Accessor<ResponsiveValues<SelectSize>>;
  variant: Accessor<ResponsiveValues<SelectVariant>>;
  colorPalette: Accessor<string | undefined>;
  unstyled: Accessor<boolean>;
}

const AppearanceContext = createOptionalContext<SelectAppearanceState>();

/** Carry finite Select appearance through the primitive's native and portalled parts. */
export const SelectAppearanceProvider = AppearanceContext;

/** Require the nearest owned or caller-owned Select root. */
export function useSelectAppearance(): SelectAppearanceState {
  const state = useOptionalContext(AppearanceContext);
  if (!state) throw new Error('Select parts must be inside SelectRoot or SelectRootProvider.');
  return state;
}

/** Validate one responsive Select size without creating style objects. */
export function readSelectSize(value: unknown): ResponsiveValues<SelectSize> {
  return readFiniteResponsiveChoice(value, new Set<string>(sizes), 'md', 'Select size');
}

/** Validate one responsive Select treatment without creating style objects. */
export function readSelectVariant(value: unknown): ResponsiveValues<SelectVariant> {
  return readFiniteResponsiveChoice(value, new Set<string>(variants), 'outline', 'Select variant');
}

/** Accept a named or consumer-defined color palette for CSS token scopes. */
export function readSelectPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Select colorPalette must be a nonempty string.');
  }
  return value.trim();
}

/** Reflect one finite choice at the supported CSS breakpoints. */
function choiceAttributes<T extends string>(
  name: 'size' | 'variant',
  selected: ResponsiveValues<T>,
): Record<string, string | undefined> {
  return {
    [`data-${name}`]: selected.base,
    [`data-${name}-sm`]: selected.sm,
    [`data-${name}-md`]: selected.md,
    [`data-${name}-lg`]: selected.lg,
    [`data-${name}-xl`]: selected.xl,
    [`data-${name}-2xl`]: selected['2xl'],
  };
}

/** Supply the same finite selectors to native and portalled parts. */
export function selectAppearanceAttributes(
  state: SelectAppearanceState,
): Record<string, string | undefined> {
  return {
    ...choiceAttributes('size', state.size()),
    ...choiceAttributes('variant', state.variant()),
    'data-leverui-color-palette': state.colorPalette(),
  };
}
