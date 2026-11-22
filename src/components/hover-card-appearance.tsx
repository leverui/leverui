import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';

export const hoverCardSizes = ['xs', 'sm', 'md', 'lg'] as const;
export type HoverCardSize = (typeof hoverCardSizes)[number];
const allowedSizes = new Set<string>(hoverCardSizes);

export interface HoverCardAppearance {
  size?: FiniteResponsiveChoice<HoverCardSize> | undefined;
  unstyled?: boolean | undefined;
}

export interface HoverCardAppearanceState {
  unstyled: Accessor<boolean>;
  size: Accessor<ResponsiveValues<HoverCardSize>>;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SizeAttribute = 'data-size' | `data-size-${Breakpoint}`;
export type HoverCardSizeAttributes = Partial<Record<SizeAttribute, HoverCardSize | undefined>>;

const HoverCardAppearanceContext = createOptionalContext<HoverCardAppearanceState>();

/** Carry one HoverCard root's presentation choice through Solid portals. */
export const HoverCardAppearanceProvider = HoverCardAppearanceContext;

/** Read the nearest HoverCard root's presentation choice. */
export function useHoverCardAppearance(): HoverCardAppearanceState {
  const state = useOptionalContext(HoverCardAppearanceContext);
  if (!state) throw new Error('HoverCard parts require HoverCardRoot or HoverCardRootProvider.');
  return state;
}

/** Validate the finite Hover Card size at every supported breakpoint. */
export function readHoverCardSize(value: unknown): ResponsiveValues<HoverCardSize> {
  return readFiniteResponsiveChoice(value, allowedSizes, 'md', 'Hover Card size');
}

/** Reflect responsive size choices on the portalled content. */
export function hoverCardSizeAttributes(
  size: ResponsiveValues<HoverCardSize>,
): HoverCardSizeAttributes {
  return {
    'data-size': size.base,
    'data-size-sm': size.sm,
    'data-size-md': size.md,
    'data-size-lg': size.lg,
    'data-size-xl': size.xl,
    'data-size-2xl': size['2xl'],
  };
}
