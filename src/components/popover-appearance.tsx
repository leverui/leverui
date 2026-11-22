import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

export const popoverSizes = ['xs', 'sm', 'md', 'lg'] as const;
export type PopoverSize = (typeof popoverSizes)[number];
const allowedSizes = new Set<string>(popoverSizes);

export interface PopoverAppearance {
  size?: FiniteResponsiveChoice<PopoverSize> | undefined;
  unstyled?: boolean | undefined;
}

export interface PopoverAppearanceState {
  unstyled: Accessor<boolean>;
  size: Accessor<ResponsiveValues<PopoverSize>>;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SizeAttribute = 'data-size' | `data-size-${Breakpoint}`;
export type PopoverSizeAttributes = Partial<Record<SizeAttribute, PopoverSize | undefined>>;

const PopoverAppearanceContext = createOptionalContext<PopoverAppearanceState>();

/** Carry one Popover root's presentation choice through Solid portals. */
export const PopoverAppearanceProvider = PopoverAppearanceContext;

/** Read the nearest Popover root's presentation choice. */
export function usePopoverAppearance(): PopoverAppearanceState {
  const state = useOptionalContext(PopoverAppearanceContext);
  if (!state) throw new Error('Popover parts require PopoverRoot or PopoverRootProvider.');
  return state;
}

/** Validate the finite Popover size at every supported breakpoint. */
export function readPopoverSize(value: unknown): ResponsiveValues<PopoverSize> {
  return readFiniteResponsiveChoice(value, allowedSizes, 'md', 'Popover size');
}

/** Reflect responsive size choices on the portalled content. */
export function popoverSizeAttributes(size: ResponsiveValues<PopoverSize>): PopoverSizeAttributes {
  return {
    'data-size': size.base,
    'data-size-sm': size.sm,
    'data-size-md': size.md,
    'data-size-lg': size.lg,
    'data-size-xl': size.xl,
    'data-size-2xl': size['2xl'],
  };
}
